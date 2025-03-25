document.addEventListener('DOMContentLoaded', async function () {
    // 1. Load products with error handling
    let products = [];
    try {
        const res = await fetch('/api/products', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        products = await res.json();
    } catch (error) {
        console.error("Failed to load products:", error);
        showNotification("Failed to load products. Please try again later.", 'error');
    }

    // 2. Initialize cart
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let updateCartTimeout;

    // 3. Cookie management
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

    // 4. User state management
    // Logout gomb kezelése
function setupLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    if (!logoutButton) return;

    logoutButton.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();  // Más eseménykezelők blokkolása
        
        try {
            // 1. Küldjük a kijelentkezési kérelmet
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
            
            // 2. Töröljük az ügyfél oldali adatokat
            deleteAllCookies();
            localStorage.clear();
            
            // 3. Frissítjük a felületet
            document.querySelector('.profile-icon')?.setAttribute('href', 'login.html');
            document.getElementById('logout-container').style.display = 'none';
            
            // 4. Átirányítás késleltetve
            setTimeout(() => {
                window.location.href = "login.html";
            }, 500);
        } catch (error) {
            console.error("Logout error:", error);
        }
    });
}

    // 5. Cart management
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
                    <button class="decrease-quantity" data-index="${index}">➖</button>
                    <button class="increase-quantity" data-index="${index}">➕</button>
                    <button class="remove-item" data-index="${index}">❌</button>
                `;
                cartItemsList.appendChild(li);
            });

            cartCount.textContent = totalCount;
            checkoutButton.style.display = cartItems.length > 0 ? 'block' : 'none';
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }, 100);
    }

    // 6. Event handlers
    function setupEventListeners() {
        // Cart dropdown toggle
        document.querySelector('.cart-icon')?.addEventListener('click', function() {
            document.getElementById('cart-dropdown')?.classList.toggle('active');
        });

        // Hamburger menu
        document.querySelector('.hamburger-menu')?.addEventListener('click', function() {
            document.querySelector('nav ul')?.classList.toggle('show');
        });

        // Logout button
        document.getElementById('logout-button')?.addEventListener('click', async function(e) {
            e.preventDefault();
            try {
                await fetch('/api/logout', { method: 'POST' });
                deleteAllCookies();
                localStorage.removeItem('cart');
                showNotification("Successfully logged out!");
                setTimeout(() => window.location.href = "login.html", 1000);
            } catch (error) {
                console.error("Logout failed:", error);
                showNotification("Logout failed. Please try again.", 'error');
            }
        });

        // Cart item actions using event delegation
        document.getElementById('cart-items-list')?.addEventListener('click', function(e) {
            const index = e.target.closest('[data-index]')?.getAttribute('data-index');
            if (index === null || index === undefined) return;

            if (e.target.classList.contains('decrease-quantity')) {
                if (cartItems[index].quantity > 1) {
                    cartItems[index].quantity--;
                } else {
                    cartItems.splice(index, 1);
                }
                updateCart();
            } else if (e.target.classList.contains('increase-quantity')) {
                cartItems[index].quantity++;
                updateCart();
            } else if (e.target.classList.contains('remove-item')) {
                cartItems.splice(index, 1);
                updateCart();
            }
        });
    }

    // 7. Product display
    function displayProducts() {
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

        // Add event listeners to all add-to-cart buttons
        document.querySelectorAll('.btnAddToCart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    // 8. Add to cart function
    function addToCart(event) {
        const button = event.target;
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

    // 9. Notification system
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.background = type === 'error' ? '#ff4444' : '#00C851';
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.style.animation = 'fadeIn 0.3s';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // 10. Initialize everything
    checkLoginState();
    displayProducts();
    updateCart();
    setupEventListeners();
});