document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();

    // Termékek lekérése és megjelenítése
    function fetchProducts() {
        fetch('/api/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(products => {
                console.log('Products fetched:', products); // Hibakeresés
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
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    // Termék szerkesztése
    document.querySelector('.product-list').addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-btn')) {
            const productId = event.target.getAttribute('data-id');
            const productItem = event.target.closest('.product-item');
            const productName = productItem.querySelector('h2').textContent;
            const productPrice = productItem.querySelector('p').textContent.replace('$', '');

            console.log('Editing product:', productId, productName, productPrice); // Hibakeresés

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
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Update response:', data); // Hibakeresés
                    alert(data.message);
                    fetchProducts();
                })
                .catch(error => console.error('Error updating product:', error));
            }
        }
    });

    // Termék törlése
    document.querySelector('.product-list').addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const productId = event.target.getAttribute('data-id');

            console.log('Deleting product:', productId); // Hibakeresés

            if (confirm('Are you sure you want to delete this product?')) {
                fetch(`/api/products/${productId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Delete response:', data); // Hibakeresés
                    alert(data.message);
                    fetchProducts();
                })
                .catch(error => console.error('Error deleting product:', error));
            }
        }
    });

    // Hamburger menü kezelése
    document.querySelector('.hamburger-menu').addEventListener('click', function() {
        const navUl = document.querySelector('nav ul');
        console.log('Hamburger menu clicked, nav ul:', navUl); // Hibakeresés
        navUl.classList.toggle('show');
    });
});