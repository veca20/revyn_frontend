document.addEventListener('DOMContentLoaded', getOrders); 

                // mainContent.innerHTML = '<h1>Orders</h1><table><tr><th>Name</th><th>Address</th><th>Billing Info</th></tr></table>';
                // const table = mainContent.querySelector('table');

                // orders.forEach(order => {
                //     const row = document.createElement('tr');
                //     row.innerHTML = `
                //         <td>${order.name}</td>
                //         <td>${order.address}</td>
                //         <td>${order.billInformation}</td>
                //     `;
                //     table.appendChild(row);
                // });

async function getOrders() {
    const res = await fetch('/api/orders', {
        method: 'GET',
        credentials: 'include'
    });

    const orders = await res.json();
    console.log(orders);
    
}