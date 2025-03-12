document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();

    function fetchProducts() {
        fetch('/api/products')
            .then(response => response.json())
            .then(products => {
                const productList = document.querySelector('.product-list');
                productList.innerHTML = '';
                products.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.classList.add('product-item');
                    productItem.innerHTML = `
                        <img src="${product.image_url}" alt="Product Image">
                        <div class="product-details">
                            <h2>${product.name}</h2>
                            <p>$${product.price}</p>
                            <div class="product-actions">
                                <button class="edit-btn" data-id="${product.id}"><i class="fa-solid fa-pencil"></i> Edit</button>
                                <button class="delete-btn" data-id="${product.id}"><i class="fa-solid fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    `;
                    productList.appendChild(productItem);
                });
            });
    }

    // Termék szerkesztése
    document.querySelector('.product-list').addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-btn')) {
            const productId = event.target.getAttribute('data-id');
            const productItem = event.target.closest('.product-item');
            const productName = productItem.querySelector('h2').textContent;
            const productPrice = productItem.querySelector('p').textContent.replace('$', '');

            // Itt lehetne egy modal vagy form, ahol szerkeszteni lehet a terméket
            const newName = prompt('Enter new product name:', productName);
            const newPrice = prompt('Enter new product price:', productPrice);

            if (newName && newPrice) {
                fetch(`/api/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: newName, price: newPrice })
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    fetchProducts();
                });
            }
        }
    });

    // Termék törlése
    document.querySelector('.product-list').addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const productId = event.target.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this product?')) {
                fetch(`/api/products/${productId}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    fetchProducts();
                });
            }
        }
    });
});