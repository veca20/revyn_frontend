document.addEventListener('DOMContentLoaded', function() {
    // Űrlap beküldésének kezelése
    document.getElementById('product-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Termékadatok beolvasása
        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const info = document.getElementById('product-info').value;
        
        // Új termék objektum
        const product = { name, price, info };
        
        // Termékek mentése localStorage-ba
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
        
        alert('Product added successfully!');
        document.getElementById('product-form').reset();
    });
    
    // Termékek megjelenítése, ha van "products-list" elem az oldalon
    if (document.getElementById('products-list')) {
        displayProducts();
    }
});

// Termékek listázása
function displayProducts() {
    const productsList = document.getElementById('products-list');
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    productsList.innerHTML = '';
    products.forEach((product, index) => {
        const item = document.createElement('div');
        item.innerHTML = `<strong>${product.name}</strong> - $${product.price} <p>${product.info}</p>`;
        productsList.appendChild(item);
    });
}

// Menü megjelenítése/működtetése
function toggleMenu() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('show');
}

// Rendelések megjelenítése (orders.html)
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('table tbody')) {
        displayOrders();
    }
});

function displayOrders() {
    const ordersTable = document.querySelector('table tbody');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    ordersTable.innerHTML = '';
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${order.name}</td><td>${order.address}</td><td>${order.bill}</td>`;
        ordersTable.appendChild(row);
    });
}
