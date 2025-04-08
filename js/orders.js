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
                    <th>Order ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Card Number</th>
                    <th>Total</th>
                    <th>Date</th>
                </tr>
            </table>
        `;
        const table = mainContent.querySelector('table');

        rders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Order ID">${order.order_id}</td>
                <td data-label="Name">${order.first_name} ${order.last_name}</td>
                <td data-label="Address">${order.address}</td>
                <td data-label="Phone">${order.phone_number}</td>
                <td data-label="Card">${order.card_number}</td>
                <td data-label="Total">${order.total}</td>
                <td data-label="Date">${new Date(order.order_date).toLocaleDateString()}</td>
            `;
            table.appendChild(row);
        });

        table.classList.add('responsive-table');
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
 };