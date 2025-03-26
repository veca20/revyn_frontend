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
                const productList = document.querySelector('.product-list');
                productList.innerHTML = '';
                
                if (products.length === 0) {
                    productList.innerHTML = '<p>No products found.</p>';
                    return;
                }

                products.forEach(product => {
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
        // Termék szerkesztése
        document.querySelector('.product-list').addEventListener('click', function(event) {
            const editBtn = event.target.closest('.edit-btn');
            const deleteBtn = event.target.closest('.delete-btn');
            
            if (editBtn) {
                handleEdit(editBtn);
            } else if (deleteBtn) {
                handleDelete(deleteBtn);
            }
        });
    }

    function handleEdit(editBtn) {
        const productId = editBtn.getAttribute('data-id');
        
        // Debug: Check if productId exists
        if (!productId) {
            console.error('No product ID found for edit button:', editBtn);
            alert('Error: Could not identify product to edit.');
            return;
        }
    
        const productItem = editBtn.closest('.product-item');
        const productName = productItem.querySelector('h2').textContent;
        const productPrice = productItem.querySelector('p').textContent.replace('$', '');
        const productDescription = productItem.querySelectorAll('p')[1].textContent;
    
        const newName = prompt('Enter new product name:', productName);
        if (newName === null) return; // User cancelled
        
        const newPrice = prompt('Enter new product price:', productPrice);
        if (newPrice === null) return;
        
        const newDescription = prompt('Enter new product description:', productDescription);
        if (newDescription === null) return;
    
        if (newName && newPrice && newDescription) {
            // Debug: Log the request details
            console.log('Sending PUT request to:', `/api/products/${productId}`);
            console.log('Request payload:', { 
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
                })
            })
            .then(response => {
                if (!response.ok) {
                    // Get more details about the error
                    return response.text().then(text => {
                        throw new Error(`Server responded with ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                alert('Product updated successfully!');
                fetchProducts(); // Refresh the list
            })
            .catch(error => {
                console.error('Error updating product:', error);
                alert(`Error updating product: ${error.message}`);
            });
        }
    }

    function handleDelete(deleteBtn) {
        const productId = deleteBtn.getAttribute('data-id');
        
        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
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
                alert('Product deleted successfully!');
                fetchProducts(); // Refresh the list
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                alert('Error deleting product. Please try again.');
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