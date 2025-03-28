document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();

    // Termékek lekérése és megjelenítése
    function fetchProducts() {
        fetch('/api/products', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(products => {
                console.log('Received products:', products); // Debug log
                const productList = document.querySelector('.product-list');
                productList.innerHTML = '';
                
                if (products.length === 0) {
                    productList.innerHTML = '<p>No products found.</p>';
                    return;
                }

                products.forEach(product => {
                    // Debug: Check if product has an ID
                    if (!product.id) {
                        console.error('Product missing ID:', product);
                        return;
                    }

                    const productItem = document.createElement('div');
                    productItem.classList.add('product-item');
                    productItem.innerHTML = `
                        <img src="${product.product_image ? '/uploads/' + product.product_image : './img/placeholder.png'}" alt="${product.product_name}">
                        <div class="product-details">
                            <h2>${product.product_name}</h2>
                            <p>$${product.product_price}</p>
                            <p>${product.product_description || ''}</p>
                            <div class="product-actions">
                                <button class="edit-btn" data-id="${product.id}"><i class="fa-solid fa-pencil"></i> Edit</button>
                                <button class="delete-btn" data-id="${product.id}"><i class="fa-solid fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    `;
                    productList.appendChild(productItem);
                });

                // Add event listeners after products are loaded
                setupEventListeners();
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                document.querySelector('.product-list').innerHTML = '<p>Error loading products. Please try again.</p>';
            });
    }

    function setupEventListeners() {
        document.querySelector('.product-list').addEventListener('click', function(event) {
            const editBtn = event.target.closest('.edit-btn');
            const deleteBtn = event.target.closest('.delete-btn');
            
            if (editBtn) {
                console.log('Edit button clicked, data-id:', editBtn.dataset.id);
                handleEdit(editBtn);
            } else if (deleteBtn) {
                console.log('Delete button clicked, data-id:', deleteBtn.dataset.id);
                handleDelete(deleteBtn);
            }
        });
    }

    function handleEdit(editBtn) {
        // Multiple ways to get the ID to ensure we capture it
        const productId = editBtn.dataset.id || editBtn.getAttribute('data-id');
        
        if (!productId || productId === 'undefined') {
            console.error('No valid product ID found for edit button:', editBtn);
            console.log('Edit button HTML:', editBtn.outerHTML);
            alert('Error: Could not identify product to edit. Check console for details.');
            return;
        }

        const productItem = editBtn.closest('.product-item');
        const productName = productItem.querySelector('h2').textContent;
        const productPrice = productItem.querySelector('p').textContent.replace('$', '');
        const productDescription = productItem.querySelectorAll('p')[1].textContent;
    
        const newName = prompt('Enter new product name:', productName);
        if (newName === null) return;
        
        const newPrice = prompt('Enter new product price:', productPrice);
        if (newPrice === null) return;
        
        const newDescription = prompt('Enter new product description:', productDescription);
        if (newDescription === null) return;
    
        if (newName && newPrice && newDescription) {
            console.log('Attempting to update product ID:', productId);
            console.log('New data:', { 
                product_name: newName, 
                product_price: newPrice, 
                product_description: newDescription 
            });

            fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    product_name: newName, 
                    product_price: newPrice, 
                    product_description: newDescription 
                }),
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Server responded with ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Update successful:', data);
                alert('Product updated successfully!');
                fetchProducts();
            })
            .catch(error => {
                console.error('Error updating product:', error);
                alert(`Error updating product: ${error.message}`);
            });
        }
    }

    function handleDelete(deleteBtn) {
        const productId = deleteBtn.dataset.id || deleteBtn.getAttribute('data-id');
        
        if (!productId || productId === 'undefined') {
            console.error('No valid product ID found for delete button:', deleteBtn);
            alert('Error: Could not identify product to delete.');
            return;
        }

        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            console.log('Attempting to delete product ID:', productId);
            
            fetch(`/api/products/${productId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Server responded with ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Delete successful:', data);
                alert('Product deleted successfully!');
                fetchProducts();
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                alert(`Error deleting product: ${error.message}`);
            });
        }
    }

    // Kijelentkezés gomb eseménykezelő
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async function() {
            localStorage.removeItem('user');
            sessionStorage.clear();

            try {
                const res = await fetch('/api/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                
                if (res.ok) {
                    const message = await res.json();
                    alert(message.message);
                    window.location.href = 'login.html';
                } else {
                    throw new Error('Logout failed');
                }
            } catch (error) {
                console.error('Error during logout:', error);
                alert('Error during logout. Please try again.');
            }
        });
    }
});