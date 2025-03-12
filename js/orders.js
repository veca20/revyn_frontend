document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menü kezelése
    document.querySelector('.hamburger-menu').addEventListener('click', function() {
        document.querySelector('nav ul').classList.toggle('show');
    });

    // Rendelések lekérése és megjelenítése
    fetchOrders();

    function fetchOrders() {
        fetch('/api/orders') // A backend endpointja, ahol a rendelések lekérhetők
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(orders => {
                console.log('Orders fetched:', orders); // Hibakeresés
                const tbody = document.querySelector('table tbody');
                tbody.innerHTML = ''; // Töröljük a korábbi tartalmat
                orders.forEach(order => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${order.name}</td>
                        <td>${order.address}</td>
                        <td>${order.billInformation}</td>
                    `;
                    row.addEventListener('click', function() {
                        alert(`Order details:\nName: ${order.name}\nAddress: ${order.address}\nBill Information: ${order.billInformation}`);
                    });
                    tbody.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching orders:', error));
    }
});