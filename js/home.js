document.addEventListener('DOMContentLoaded', async function () {
    // Hamburger menü kezelése
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('show');
        });
    }

    // ======================
    // 1. INITIALIZATION
    // ======================
    let products = [];
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let updateCartTimeout;

    // ======================
    // 2. AUTHENTICATION MANAGEMENT
    // ======================
    async function checkLoginState() {
        try {
            const res = await fetch('/api/check-auth', {
                method: 'GET',
                credentials: 'include'
            });
            
            const profileIcon = document.querySelector('.profile-icon');
            const logoutContainer = document.getElementById('logout-container');
            
            if (res.ok) {
                // Ha be van jelentkezve
                if (profileIcon) {
                    profileIcon.style.display = 'block';
                    profileIcon.href = "profilszerkesztes.html";
                    profileIcon.title = "Profil szerkesztése";
                }
                if (logoutContainer) logoutContainer.style.display = 'block';
                return true;
            } else {
                // Ha nincs bejelentkezve
                if (profileIcon) {
                    profileIcon.style.display = 'block';
                    profileIcon.href = "login.html";
                    profileIcon.title = "Bejelentkezés";
                }
                if (logoutContainer) logoutContainer.style.display = 'none';
                return false;
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            return false;
        }
    }

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
        notification.style.transition = 'opacity 0.5s ease';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 2500);
    }

    // ======================
    // 3. CART MANAGEMENT
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
    // 4. PRODUCT DISPLAY
    // ======================
    async function loadProducts() {
        try {
            const res = await fetch('/api/products', {
                method: 'GET',
                credentials: 'include'
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            products = await res.json();
            return products;
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

            const imagePath = `/uploads/${product.product_image}`;
            const defaultImage = `/uploads/default.jpg`;

            productElement.innerHTML = `
                <div class="card-body">
                    <a href="product.html?id=${product.product_id}">
                        <img src="${imagePath}" 
                             alt="${product.product_name}" 
                             class="product-image"
                             onerror="this.onerror=null;this.src='${defaultImage}'">
                    </a>
                    <h3>${product.product_name}</h3>
                    <p class="price">$${product.product_price || 0}</p>
                    <button class="btnAddToCart" 
                            data-name="${product.product_name}" 
                            data-price="${product.product_price || 0}" 
                            data-image="${imagePath}">
                        ADD TO CART
                    </button>
                </div>
            `;

            container.appendChild(productElement);
        });
    }

    // ======================
    // 5. EVENT HANDLERS
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
        document.querySelector('.cart-icon')?.addEventListener('click', function () {
            document.getElementById('cart-dropdown')?.classList.toggle('active');
        });

        // Delegated event listeners
        document.addEventListener('click', function (e) {
            handleCartActions(e);
            handleAddToCart(e);
        });

        // Logout handler
        document.getElementById('logout-button')?.addEventListener('click', async function (e) {
            e.preventDefault();
            const button = this;
            button.disabled = true;
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Kijelentkezés...';

            try {
                const res = await fetch('/api/logout', {
                    method: 'POST',
                    credentials: 'include'
                });

                if (res.ok) {
                    localStorage.removeItem('user');
                    sessionStorage.clear();
                    showNotification("Sikeresen kijelentkeztél!");
                    setTimeout(() => window.location.href = "login.html", 1000);
                } else {
                    throw new Error('A kijelentkezés sikertelen');
                }
            } catch (error) {
                console.error("Kijelentkezési hiba:", error);
                showNotification("Hiba történt a kijelentkezés során", 'error');
                button.disabled = false;
                button.innerHTML = originalText;
            }
        });
    }

    // ======================
    // 6. MAIN EXECUTION
    // ======================
    async function initializeApp() {
        try {
            // Check auth state first
            await checkLoginState();

            // Load other data
            products = await loadProducts();
            displayProducts(products);
            updateCart();
            setupEventListeners();

            console.log("Alkalmazás inicializálva");
        } catch (error) {
            console.error("Inicializálási hiba:", error);
            showNotification("Az alkalmazás betöltése sikertelen", 'error');
        }
    }

    // Start the application
    initializeApp();
});