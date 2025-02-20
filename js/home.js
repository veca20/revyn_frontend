document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('show');
        });
    } else {
        console.error('Hamburger vagy navMenu elem nem található');
    }

    // **ADMIN JOGOSULTSÁGOK KEZELÉSE**
    const role = localStorage.getItem('role');
    if (role === 'admin') {
        // Admin jogosultságokkal elérhető funkciók (pl. termékek kezelése)
        const adminPanelLink = document.querySelector('.admin-panel-link');
        if (adminPanelLink) {
            adminPanelLink.style.display = 'block'; // Admin panel link megjelenítése
        }

        // Ha admin, átirányítjuk a 'addproduct.html' oldalra
        window.location.href = 'addproduct.html';  // Átirányítás addproduct.html-re
    } else if (role === 'user') {
        // Normál felhasználók esetén
        const adminPanelLink = document.querySelector('.admin-panel-link');
        if (adminPanelLink) {
            adminPanelLink.style.display = 'none'; // Ha nem admin, elrejtjük az admin panel linket
        }
    }

    // KOSÁR KEZELÉSE
    const cartIcon = document.querySelector('.cart-icon');
    const cartDropdown = document.getElementById('cart-dropdown');
    const checkoutButton = document.getElementById('checkoutButton');
    const cartCount = document.getElementById('cart-count');
    const cartItemsList = document.getElementById('cart-items-list');
    const addToCartButtons = document.querySelectorAll('.btnAddToCart');

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
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

        // **MENTÉS LOCALSTORAGE-BE**
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    function addToCart(event) {
        const button = event.target;
        const productName = button.getAttribute('data-name');
        const productPrice = parseFloat(button.getAttribute('data-price'));
        const productImage = button.getAttribute('data-image');

        const existingItem = cartItems.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ name: productName, price: productPrice, image: productImage, quantity: 1 });
        }

        alert(`${productName} hozzáadva a kosárhoz!`);
        updateCart();
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    if (cartIcon && cartDropdown) {
        cartIcon.addEventListener('click', function () {
            cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Kosár gombok eseménykezelői
    document.addEventListener('click', function(event) {
        const target = event.target;

        // Mennyiség növelése
        if (target.classList.contains('increase-quantity')) {
            const index = target.getAttribute('data-index');
            const item = cartItems[index];
            if (item) {
                item.quantity++;
                updateCart();
            }
        }

        // Mennyiség csökkentése
        if (target.classList.contains('decrease-quantity')) {
            const index = target.getAttribute('data-index');
            const item = cartItems[index];
            if (item && item.quantity > 1) {
                item.quantity--;
                updateCart();
            }
        }

        // Termék eltávolítása a kosárból
        if (target.classList.contains('remove-item')) {
            const index = target.getAttribute('data-index');
            cartItems.splice(index, 1);
            updateCart();
        }
    });

    // termékek hozzáadása
    document.addEventListener('DOMContentLoaded', async function () {
        const productList = document.getElementById('product-list');

        async function fetchProducts() {
            try {
                const response = await fetch('https://nodejs314.dszcbaross.edu.hu/api/products');
                const products = await response.json();

                productList.innerHTML = '';
                products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product-card');
                    productDiv.innerHTML = `
                        <img src="${product.product_image}" alt="${product.product_name}">
                        <h3>${product.product_name}</h3>
                        <p>$${product.product_price.toFixed(2)}</p>
                        <button class="btnAddToCart" data-name="${product.product_name}" data-price="${product.product_price}" data-image="${product.product_image}">Kosárba</button>
                    `;
                    productList.appendChild(productDiv);
                });

                // Gombok újra hozzárendelése
                const addToCartButtons = document.querySelectorAll('.btnAddToCart');
                addToCartButtons.forEach(button => {
                    button.addEventListener('click', addToCart);
                });

            } catch (error) {
                console.error('Hiba a termékek lekérésekor:', error);
                alert("Hiba történt a termékek betöltésekor. Kérlek próbáld újra.");
            }
        }

        fetchProducts();
    });
});
