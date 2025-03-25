document.addEventListener('DOMContentLoaded', async function () {
    // Termékek betöltése
    const res = await fetch('/api/products', {
        method: 'GET',
        credentials: 'include'
    });
    const products = await res.json();
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Süti kezelés
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Felhasználói állapot kezelése
    const userLoggedIn = getCookie('userLoggedIn');
    const profileButton = document.querySelector('.profile-icon');
    const logoutContainer = document.getElementById('logout-container');

    // Bejelentkezési állapot kezelése
    if (userLoggedIn === 'true') {
        profileButton.setAttribute('href', 'profileszerkesztes.html');
        if (logoutContainer) logoutContainer.style.display = 'flex';
    } else {
        profileButton.setAttribute('href', 'login.html');
        if (logoutContainer) logoutContainer.style.display = 'none';
    }

    // Logout funkció
    function deleteAllCookies() {
        document.cookie.split(";").forEach(function(cookie) {
            document.cookie = cookie
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/");
        });
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            deleteAllCookies();
            localStorage.removeItem('cart');
            alert("Sikeres kijelentkezés!");
            window.location.href = "login.html";
        });
    }

    // Kosár frissítése
    function updateCart() {
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
    }

    // Kosár eseménykezelők
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('decrease-quantity')) {
            const index = e.target.getAttribute('data-index');
            if (cartItems[index].quantity > 1) {
                cartItems[index].quantity--;
            } else {
                cartItems.splice(index, 1);
            }
            updateCart();
        } else if (e.target.classList.contains('increase-quantity')) {
            const index = e.target.getAttribute('data-index');
            cartItems[index].quantity++;
            updateCart();
        } else if (e.target.classList.contains('remove-item')) {
            const index = e.target.getAttribute('data-index');
            cartItems.splice(index, 1);
            updateCart();
        }
    });

    // Termék hozzáadása a kosárhoz
    window.addToCart = function(event) {
        const button = event.target;
        const productName = button.getAttribute('data-name');
        const productPrice = parseFloat(button.getAttribute('data-price')) || 0;
        let productImage = button.getAttribute('data-image') || 'uploads/default.jpg';

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

        alert(`${productName} hozzáadva a kosárhoz!`);
        updateCart();
    };

    // Termékek megjelenítése
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
                        <img src="uploads/${product.product_image}" alt="${product.product_name}" class="product-image">
                    </a>
                    <h3>${product.product_name}</h3>
                    <p class="price">$${product.product_price || 0}</p>
                    <button class="btnAddToCart" 
                        data-name="${product.product_name}" 
                        data-price="${product.product_price || 0}" 
                        data-image="uploads/${product.product_image}"
                        onclick="addToCart(event)">
                        ADD TO CART
                    </button>
                </div>
            `;

            container.appendChild(productElement);
        });
    }

    // Kosár legördülő menü kezelése
    document.querySelector('.cart-icon')?.addEventListener('click', function() {
        const cartDropdown = document.getElementById('cart-dropdown');
        if (cartDropdown) cartDropdown.classList.toggle('active');
    });

    // Hamburger menü kezelése
    document.querySelector('.hamburger-menu')?.addEventListener('click', function() {
        document.querySelector('nav ul')?.classList.toggle('show');
    });

    // Inicializálás
    displayProducts(products);
    updateCart();
});