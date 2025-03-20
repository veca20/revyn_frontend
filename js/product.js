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
});

document.addEventListener('DOMContentLoaded', async function () {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        console.error('Nincs termék ID megadva.');
        return;
    }

    try {
        const response = await fetch(`/api/product/${productId}`);
        if (!response.ok) throw new Error('Hiba a termék betöltésekor');

        const product = await response.json();

        if (!product || !product.name || !product.price || !product.image || !product.description) {
            throw new Error('A termék adatai nem teljesek.');
        }

        document.getElementById('product_name').textContent = product.name;
        document.getElementById('product_price').textContent = `Ár: $${product.price}`;
        document.getElementById('product_image').src = `uploads/${product.image}`;
        document.getElementById('product_description').textContent = product.description;

        const addToCartButton = document.getElementById('add-to-cart');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', function () {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                let existingItem = cart.find(item => item.id === product.id);

                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({ id: product.id, name: product.name, price: product.price, image: `uploads/${product.image}`, quantity: 1 });
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                alert(`${product.name} hozzáadva a kosárhoz!`);
                updateCart(); // Frissítjük a kosár menüt
            });
        } else {
            console.error('add-to-cart gomb nem található');
        }

    } catch (error) {
        console.error(error);
        document.getElementById('product-container').innerHTML = "<p>Hiba történt a termék betöltésekor.</p>";
    }
});

function updateCart() {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartCount = document.getElementById('cart-count');
    const checkoutButton = document.getElementById('checkoutButton');

    if (!cartItemsList || !cartCount || !checkoutButton) {
        console.error("Kosár elemei nem találhatók.");
        return;
    }

    cartItemsList.innerHTML = '';
    let totalCount = 0;
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

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

// Kosár ikon kattintás eseménye
document.querySelector('.cart-icon').addEventListener('click', function() {
    const cartDropdown = document.getElementById('cart-dropdown');
    cartDropdown.classList.toggle('active');
});
// kijelentkezés
document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logout-button');

    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            // Töröljük a sütit
            document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            
            // Átirányítjuk a felhasználót a bejelentkezési oldalra
            window.location.href = '/login.html'; // A bejelentkezési oldal URL-je
        });
    } else {
        console.error('A kijelentkezés gomb nem található');
    }
});