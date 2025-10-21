const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/products');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files before defining routes and starting the server
app.use(express.static(path.join(__dirname, 'public')));

app.use('/products', productRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});