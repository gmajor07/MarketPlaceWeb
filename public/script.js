const apiUrl = 'http://localhost:3000/products';

let currentEditId = null;
let currentDeleteId = null;

async function fetchInventory(query = '') {
  const res = await fetch(apiUrl);
  const products = await res.json();
  const tbody = document.getElementById('inventory');
  tbody.innerHTML = '';

  products
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-2 font-medium">${product.name}</td>
        <td class="px-4 py-2">${product.description}</td>
        <td class="px-4 py-2">TZS ${product.price}</td>
        <td class="px-4 py-2">${product.quantity}</td>
        <td class="px-4 py-2">
          <button onclick="editProduct(${product.id}, '${product.name}', '${product.description}', ${product.price}, ${product.quantity})" class="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500">Edit</button>
          <button onclick="deleteProduct(${product.id})" class="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
}

async function addProduct() {
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const price = parseFloat(document.getElementById('price').value);
  const quantity = parseInt(document.getElementById('quantity').value);

  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price, quantity })
  });

  document.getElementById('name').value = '';
  document.getElementById('description').value = '';
  document.getElementById('price').value = '';
  document.getElementById('quantity').value = '';
  fetchInventory();
}

function editProduct(id, name, description, price, quantity) {
  currentEditId = id;
  document.getElementById('editName').value = name;
  document.getElementById('editDescription').value = description;
  document.getElementById('editPrice').value = price;
  document.getElementById('editQuantity').value = quantity;
  document.getElementById('editModal').classList.remove('hidden');
}

function closeEditModal() {
  document.getElementById('editModal').classList.add('hidden');
}

async function submitEdit() {
  const name = document.getElementById('editName').value;
  const description = document.getElementById('editDescription').value;
  const price = parseFloat(document.getElementById('editPrice').value);
  const quantity = parseInt(document.getElementById('editQuantity').value);

  await fetch(`${apiUrl}/${currentEditId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price, quantity })
  });

  closeEditModal();
  fetchInventory();
}

function deleteProduct(id, name) {
  currentDeleteId = id;
  document.getElementById('deleteName').textContent = name;
  document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.add('hidden');
}

async function confirmDelete() {
  await fetch(`${apiUrl}/${currentDeleteId}`, { method: 'DELETE' });
  closeDeleteModal();
  fetchInventory();
}

function searchProducts() {
  const query = document.getElementById('searchInput').value;
  fetchInventory(query);
}

fetchInventory();