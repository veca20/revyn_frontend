document.addEventListener('DOMContentLoaded', async function () {
    // ======================
    // 1. INITIALIZATION
    // ======================
    let products = [];
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let updateCartTimeout;

    // ======================
    // 2. UTILITY FUNCTIONS
    // ======================
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function deleteAllCookies() {
        document.cookie.split(";").forEach(cookie => {
            document.cookie = cookie
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/");
        });
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.background = type === 'error' ? '#ff4444' : '#00C851';
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // ======================
    // 3. LOGIN STATE MANAGEMENT
    // ======================
    function checkLoginState() {
        const userLoggedIn = getCookie('userLoggedIn');
        const profileButton = document.querySelector('.profile-icon');
        const logoutContainer = document.getElementById('logout-container');

        if (userLoggedIn === 'true') {
            if (profileButton) profileButton.setAttribute('href', 'profileszerkesztes.html');
            if (logoutContainer) logoutContainer.style.display = 'flex';
        } else {
            if (profileButton) profileButton.setAttribute('href', 'login.html');
            if (logoutContainer) logoutContainer.style.display = 'none';
        }
    }

    // ======================
    // 4. CART MANAGEMENT
    // ======================
    function updateCart() {
        clearTimeout(updateCartTimeout);
        updateCartTimeout = setTimeout(() => {
            const cartItemsList = document.getElementById('cart-items-list');
            const cartCount = document.getElementById('cart-count');
            const checkoutButton = document.getElementById('checkoutButton');

            if (!cartItemsList || !cartCount || !checkoutButton) return;

            cartItemsList.innerHTML = '';
            let totalCount = 0;

            cartItems.forEach((item, index) => {
                totalCount += item.quantity;
                const li = document.createElement('li');
                li.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; margin-right: 10px;">
                    ${item.name} - $${item.price.toFixed(2)} (x${item.quantity})
                    <button class="cart-action" data-action="decrease" data-index="${index}">➖</button>
                    <button class="cart-action" data-action="increase" data-index="${index}">➕</button>
                    <button class="cart-action" data-action="remove" data-index="${index}">❌</button>
                `;
                cartItemsList.appendChild(li);
            });

            cartCount.textContent = totalCount;
            checkoutButton.style.display = cartItems.length > 0 ? 'block' : 'none';
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }, 100);
    }

    // ======================
    // 5. PRODUCT DISPLAY
    // ======================
    async function loadProducts() {
        try {
            const res = await fetch('/api/products', {
                method: 'GET',
                credentials: 'include'
            });
            
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error("Failed to load products:", error);
            showNotification("Failed to load products. Please try again later.", 'error');
            return [];
        }
    }

    function displayProducts(products) {
        const container = document.getElementById('products-container');
        if (!container) return;

        container.innerHTML = '';

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('card');

            productElement.innerHTML = `
                <div class="card-body">
                    <a href="product.html?id=${product.product_id}">
                        <img src="uploads/${product.product_image}" 
                             alt="${product.product_name}" 
                             class="product-image"
                             onerror="this.onerror=null;this.src='uploads/default.jpg'">
                    </a>
                    <h3>${product.product_name}</h3>
                    <p class="price">$${product.product_price || 0}</p>
                    <button class="btnAddToCart" 
                            data-name="${product.product_name}" 
                            data-price="${product.product_price || 0}" 
                            data-image="uploads/${product.product_image}">
                        ADD TO CART
                    </button>
                </div>
            `;

            container.appendChild(productElement);
        });
    }

    // ======================
    // 6. EVENT HANDLERS
    // ======================
    function handleCartActions(e) {
        const target = e.target.closest('.cart-action');
        if (!target) return;

        const index = target.getAttribute('data-index');
        const action = target.getAttribute('data-action');

        switch (action) {
            case 'decrease':
                if (cartItems[index].quantity > 1) {
                    cartItems[index].quantity--;
                } else {
                    cartItems.splice(index, 1);
                }
                break;
            case 'increase':
                cartItems[index].quantity++;
                break;
            case 'remove':
                cartItems.splice(index, 1);
                break;
        }

        updateCart();
    }

    function handleAddToCart(e) {
        const button = e.target.closest('.btnAddToCart');
        if (!button) return;

        button.disabled = true;
        
        const productName = button.getAttribute('data-name');
        const productPrice = parseFloat(button.getAttribute('data-price')) || 0;
        const productImage = button.getAttribute('data-image') || 'uploads/default.jpg';

        const existingItem = cartItems.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ 
                name: productName, 
                price: productPrice, 
                image: productImage, 
                quantity: 1 
            });
        }

        showNotification(`${productName} added to cart!`);
        updateCart();
        button.disabled = false;
    }

    function setupEventListeners() {
        // Cart toggle
        document.querySelector('.cart-icon')?.addEventListener('click', function() {
            document.getElementById('cart-dropdown')?.classList.toggle('active');
        });

        // Hamburger menu
        document.querySelector('.hamburger-menu')?.addEventListener('click', function() {
            document.querySelector('nav ul')?.classList.toggle('show');
        });

        // Enhanced logout button with all storage clearing
        document.getElementById('logout-button')?.addEventListener('click', async function(e) {
            e.preventDefault();
            try {
                const res = await fetch('/api/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                
                if (res.ok) {
                    const message = await res.json();
                    // Clear all storage methods
                    deleteAllCookies();
                    localStorage.removeItem('cart');
                    localStorage.removeItem('user');
                    sessionStorage.clear();
                    
                    // Show notification
                    showNotification(message.message || "Successfully logged out!");
                    
                    // Redirect after delay
                    setTimeout(() => window.location.href = "login.html", 1000);
                } else {
                    throw new Error(res.statusText || 'Logout failed');
                }
            } catch (error) {
                console.error("Logout failed:", error);
                showNotification("Logout failed. Please try again.", 'error');
            }
        });

        // Delegated event listeners
        document.addEventListener('click', function(e) {
            handleCartActions(e);
            handleAddToCart(e);
        });
    }

    // ======================
    // 7. MAIN EXECUTION
    // ======================
    async function initializeApp() {
        try {
            // Load products first
            products = await loadProducts();
            
            // Then setup the UI
            checkLoginState();
            displayProducts(products);
            updateCart();
            setupEventListeners();
            
            // Show app is ready
            console.log("Application initialized successfully");
        } catch (error) {
            console.error("Initialization error:", error);
            showNotification("Failed to initialize application", 'error');
        }
    }

    // Start the application
    initializeApp();
});