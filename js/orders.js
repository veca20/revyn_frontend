async function getOrders() {
    try {
        const res = await fetch('/api/orders', {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error(`Hiba a kérés során: ${res.status} ${res.statusText}`);
        }

        const orders = await res.json();
        console.log('Szerver válasza:', orders);

        if (!Array.isArray(orders)) {
            throw new Error('A szerver nem adott vissza tömböt');
        }

        // Táblázat létrehozása és adatok feltöltése
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <h1>Orders</h1>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Total</th>
                    <th>Products</th>
                </tr>
            </table>
        `;
        const table = mainContent.querySelector('table');

        orders.forEach(order => {
            const row = document.createElement('tr');
            
            // Format products information
            let productsHtml = '<ul>';
            if (order.products && Array.isArray(order.products)) {
                order.products.forEach(product => {
                    productsHtml += `<li>${product.name} (${product.quantity} x ${product.price})</li>`;
                });
            } else {
                productsHtml += '<li>No product information</li>';
            }
            productsHtml += '</ul>';

            row.innerHTML = `
                <td>${order.first_name} ${order.last_name}</td>
                <td>${order.address}</td>
                <td>${order.phone_number}</td>
                <td>${order.total}</td>
                <td>${productsHtml}</td>
            `;
            table.appendChild(row);
        });
    } catch (error) {
        console.error('Hiba történt:', error);
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `<p class="error">Hiba történt a rendelések betöltésekor: ${error.message}</p>`;
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', getOrders);

// Kijelentkezés gomb eseménykezelő
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', async function () {
        localStorage.removeItem('user'); // Felhasználói adatok törlése
        sessionStorage.clear(); // Munkamenet törlése

        const res = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (res.ok) {
            const message = await res.json();
            alert(message.message);
            window.location.href = 'login.html'; // Átirányítás a bejelentkezési oldalra
        } else {
            alert('Hiba a kijelentkezéskor');
        }
    });
}