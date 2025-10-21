const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ GET all products OR search across multiple fields
router.get('/', (req, res) => {
  const search = req.query.search;
  let query = 'SELECT * FROM products';
  let params = [];

  if (search && search.trim() !== '') {
    query += `
      WHERE 
        name LIKE ? OR 
        description LIKE ? OR 
        price LIKE ? OR 
        quantity LIKE ?
    `;
    const wildcard = `%${search}%`;
    params = [wildcard, wildcard, wildcard, wildcard];
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ✅ POST new product
router.post('/', (req, res) => {
  const { name, description, price, quantity } = req.body;
  db.query(
    'INSERT INTO products (name, description, price, quantity) VALUES (?, ?, ?, ?)',
    [name, description, price, quantity],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId });
    }
  );
});

// ✅ PUT update product
router.put('/:id', (req, res) => {
  const { name, description, price, quantity } = req.body;
  db.query(
    'UPDATE products SET name=?, description=?, price=?, quantity=? WHERE id=?',
    [name, description, price, quantity, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    }
  );
});

// ✅ DELETE product
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM products WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

module.exports = router;
