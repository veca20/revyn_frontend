document.addEventListener('DOMContentLoaded', function() {
    // Űrlap beküldésének kezelése és termék mentése MySQL-be
    document.getElementById('product-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('product_name').value;
        const price = document.getElementById('product_price').value;
        const info = document.getElementById('product_description').value;
        
        fetch('api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, info, image: "" })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            document.getElementById('product-form').reset();
            displayProducts(); // Frissítjük a termékek listáját
        })
        .catch(error => console.error("Hiba:", error));
    });
    
    // Termékek megjelenítése, ha van "products-list" elem az oldalon
    if (document.getElementById('product_description')) {
        displayProducts();
    }
    
    // Kijelentkezés gomb eseménykezelő
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('user'); // Felhasználói adatok törlése
            sessionStorage.clear(); // Munkamenet törlése
            window.location.href = 'login.html'; // Átirányítás a bejelentkezési oldalra
        });
    }
});

// Termékek listázása MySQL-ből
function displayProducts() {
    fetch('api/products')
    .then(response => response.json())
    .then(products => {
        const productsList = document.getElementById('product_description');
        productsList.innerHTML = '';
        
        products.forEach(product => {
            const item = document.createElement('div');
            item.innerHTML = `<strong>${product.name}</strong> - $${product.price} <p>${product.info}</p>`;
            productsList.appendChild(item);
        });
    })
    .catch(error => console.error("Hiba a termékek betöltésekor:", error));
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
    fetch('api/orders')
    .then(response => response.json())
    .then(orders => {
        ordersTable.innerHTML = '';
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${order.name}</td><td>${order.address}</td><td>${order.bill}</td>`;
            ordersTable.appendChild(row);
        });
    })
    .catch(error => console.error("Hiba a rendelések betöltésekor:", error));
}
