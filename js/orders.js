document.addEventListener('DOMContentLoaded', function() {
    function fetchOrders() {
        fetch('/api/orders')
            .then(response => response.json())
            .then(orders => {
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
            })
            .catch(error => console.error('Error fetching orders:', error));
    }

    fetchOrders();
});
