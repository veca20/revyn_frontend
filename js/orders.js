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
        console.log('Szerver válasza:', orders); // Ellenőrizd, mit kapsz a szervertől

        if (!Array.isArray(orders)) {
            throw new Error('A szerver nem adott vissza tömböt');
        }

        // Táblázat létrehozása és adatok feltöltése
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = '<h1>Orders</h1><table><tr><th>Name</th><th>Address</th><th>Billing Info</th></tr></table>';
        const table = mainContent.querySelector('table');

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.name}</td>
                <td>${order.address}</td>
                <td>${order.billInformation}</td>
            `;
            table.appendChild(row);
        });
    } catch (error) {
        console.error('Hiba történt:', error);
    }
}

async function getOrders() {
    const res = await fetch('/api/orders', {
        method: 'GET',
        credentials: 'include'
    });

    const orders = await res.json();
    console.log(orders);
    
}

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