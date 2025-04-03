document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('show');
        });
    } else {
        console.error('Hamburger vagy navMenu nem található.');
    }
});

document.addEventListener('DOMContentLoaded', async function () {
    // ======================
    // 1. INITIALIZATION
    // ======================
    let products = [];
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let updateCartTimeout;

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
    // 3. LOGIN STATE MANAGEMENT (JAVÍTOTT)
    // ======================
    async function checkLoginState() {
        try {
            const res = await fetch('', {
                method: 'GET',
                credentials: 'include'
            });
    
            const data = await res.json();
            const isLoggedIn = data.authenticated;
            
            console.log('Auth status:', isLoggedIn, data);
    
            const profileButton = document.querySelector('.profile-icon');
            const logoutContainer = document.getElementById('logout-container');
    
            if (isLoggedIn) {
                // Bejelentkezett állapot
                if (profileButton) {
                    profileButton.href = 'profileszerkesztes.html';
                    profileButton.innerHTML = '<i class="fas fa-user-edit"></i>';
                    profileButton.style.display = 'block';
                }
                if (logoutContainer) {
                    logoutContainer.style.display = 'flex';
                    setTimeout(() => { logoutContainer.style.opacity = '1' }, 10);
                }
            } else {
                // Nem bejelentkezett állapot
                if (profileButton) {
                    profileButton.href = 'login.html';
                    profileButton.innerHTML = '<i class="fas fa-user"></i>';
                    profileButton.style.display = 'block';
                }
                if (logoutContainer) {
                    logoutContainer.style.opacity = '0';
                    setTimeout(() => { logoutContainer.style.display = 'none' }, 300);
                }
            }
        } catch (error) {
            console.error('Login state check failed:', error);
            // Alapértelmezett állapot beállítása
            const profileButton = document.querySelector('.profile-icon');
            if (profileButton) {
                profileButton.href = 'login.html';
                profileButton.style.display = 'block';
            }
            const logoutContainer = document.getElementById('logout-container');
            if (logoutContainer) logoutContainer.style.display = 'none';
        }
    }
    
    // Frissített initializeApp() függvény
    async function initializeApp() {
        try {
            // Először vizuális elemek alaphelyzetbe állítása
            document.querySelector('.profile-icon').style.display = 'none';
            document.getElementById('logout-container').style.display = 'none';
            
            // Bejelentkezési állapot ellenőrzése
            await checkLoginState();
            
            // Termékek betöltése
            products = await loadProducts();
            displayProducts(products);
            updateCart();
            setupEventListeners();
            
            // Késleltetett újraellenőrzés
            setTimeout(checkLoginState, 1000);
        } catch (error) {
            console.error("Initialization error:", error);
            showNotification("The application failed to load.", 'error');
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
            products = await res.json();
            console.log(products);
            
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
        document.querySelector('.cart-icon')?.addEventListener('click', function () {
            document.getElementById('cart-dropdown')?.classList.toggle('active');
        });

        document.querySelector('.hamburger-menu')?.addEventListener('click', function () {
            document.querySelector('nav ul')?.classList.toggle('show');
        });

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

                    const logoutContainer = document.getElementById('logout-container');
                    if (logoutContainer) {
                        logoutContainer.style.opacity = '0';
                        setTimeout(() => {
                            logoutContainer.style.display = 'none';
                        }, 300);
                    }

                    showNotification("You have successfully logged out!!");
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 1000);
                } else {
                    throw new Error('Logout failed');
                }
            } catch (error) {
                console.error("Logout error:", error);
                showNotification("An error occurred while logging out", 'error');
                button.disabled = false;
                button.innerHTML = originalText;
            }
        });

        document.addEventListener('click', function (e) {
            handleCartActions(e);
            handleAddToCart(e);
        });

        setInterval(checkLoginState, 300000);
    }

    // ======================
    // 7. MAIN EXECUTION
    // ======================
    async function initializeApp() {
        try {
            await checkLoginState();
            products = await loadProducts();
            displayProducts(products);
            updateCart();
            setupEventListeners();
        } catch (error) {
            console.error("Initialization error:", error);
            showNotification("The application failed to load.", 'error');
        }
    }

    initializeApp();
});