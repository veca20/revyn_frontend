document.addEventListener("DOMContentLoaded", function () {
    // 🔸 Hamburger menü működtetése
    const hamburger = document.querySelector(".hamburger-menu");
    const navMenu = document.querySelector("nav ul");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", function () {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("show");
        });
    }

    // 🔸 Termék betöltése URL-ből
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        console.warn("Hiányzik a termék ID az URL-ből.");
        return;
    }

    console.log(`HTML query-ből a productId: ${productId}`);
    loadProduct(productId);

    // 🔸 Kijelentkezés
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async function () {
            try {
                const response = await fetch('/api/logout', { method: 'POST', credentials: 'include' });
                if (response.ok) {
                    window.location.href = '/login.html';
                }
            } catch (error) {
                console.error('Hiba történt a kijelentkezés során:', error);
            }
        });
    }

    // 🔸 Kosár ikon dropdown
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function () {
            const cartDropdown = document.getElementById('cart-dropdown');
            if (cartDropdown) cartDropdown.classList.toggle('active');
        });
    }

    // 🔸 Kosár frissítése oldalbetöltéskor
    updateCart();
});

// 🔧 Termék betöltése szerverről
async function loadProduct(productId) {
    try {
        const response = await fetch(`/api/product/${productId}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Hiba a termék betöltésekor');

        const product = await response.json();
        console.log('Termék adatok:', product);

        document.getElementById('product_name').textContent = product.product_name;
        document.getElementById('product_price').textContent = `Ár: ${product.product_price} Ft`;
        document.getElementById('product_image').src = `/uploads/${product.product_image}`;
        document.getElementById('product_description').textContent = product.product_description;

        const addToCartButton = document.getElementById('add-to-cart');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', () => {
                addToCart(product);
                updateCart();
                alert(`${product.product_name} hozzáadva a kosárhoz!`);
            });
        }
    } catch (error) {
        console.error('Hiba:', error);
        alert('Hiba történt a termék betöltésekor!');
    }
}

// 💾 Kosár: hozzáadás
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.product_name,
            price: product.product_price,
            image: `/uploads/${product.product_image}`,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

// 🔄 Kosár frissítése
function updateCart() {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartCount = document.getElementById('cart-count');
    const checkoutButton = document.getElementById('checkoutButton');
    if (!cartItemsList || !cartCount || !checkoutButton) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsList.innerHTML = '';
    let totalItems = 0;

    cart.forEach((item, index) => {
        totalItems += item.quantity;
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; margin-right: 10px;">
            ${item.name} - ${item.price} Ft (x${item.quantity})
            <button class="decrease-quantity" data-index="${index}">➖</button>
            <button class="increase-quantity" data-index="${index}">➕</button>
            <button class="remove-item" data-index="${index}">❌</button>
        `;
        cartItemsList.appendChild(li);
    });

    cartCount.textContent = totalItems;
    checkoutButton.style.display = cart.length > 0 ? 'block' : 'none';

    // Mennyiség módosítás
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', () => modifyQuantity(button.dataset.index, -1));
    });
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', () => modifyQuantity(button.dataset.index, 1));
    });
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => removeItem(button.dataset.index));
    });
}

// ➖➕❌ Kosár műveletek
function modifyQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}
