document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOMContentLoaded event fired');

    const res = await fetch('/api/products', {
        method: 'GET',
        credentials: 'include'
    });

    const products = await res.json();
    console.log(products);

    let cartItems = JSON.parse(localStorage.getItem('cart')) || []; // Kosár betöltése

    // 🔹 **Kosár frissítése**
    function updateCart() {
        const cartItemsList = document.getElementById('cart-items-list');
        const cartCount = document.getElementById('cart-count');
        const checkoutButton = document.getElementById('checkoutButton');

        if (!cartItemsList || !cartCount || !checkoutButton) {
            console.error("Kosár elemei nem találhatók.");
            return;
        }

        cartItemsList.innerHTML = ''; // Kosár tartalmának ürítése
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
        localStorage.setItem('cart', JSON.stringify(cartItems)); // Kosár mentése
    }

    // 🔹 **Kosár gombra kattintás: Kosár legördülő menü megjelenítése**
    document.querySelector('.cart-icon').addEventListener('click', function() {
        const cartDropdown = document.getElementById('cart-dropdown');
        if (cartDropdown.style.display === 'none' || cartDropdown.style.display === '') {
            cartDropdown.style.display = 'block'; // Kosár megjelenítése
        } else {
            cartDropdown.style.display = 'none'; // Kosár elrejtése
        }
    });

    // 🔹 **Termékek megjelenítése**
    function displayProducts(products) {
        const container = document.getElementById('products-container');
        if (!container) {
            console.error('A termékeket tartalmazó elem nem található.');
            return;
        }

        container.innerHTML = '';

        products.forEach(product => {
            console.log(product);

            let imageUrl = product.product_image;
            if (!imageUrl.startsWith('http')) {
                imageUrl = `https://revyn.netlify.app/${imageUrl}`;
            }

            const productElement = document.createElement('div');
            productElement.classList.add('product');

            productElement.innerHTML = `
                <img src="${imageUrl}" alt="${product.product_name}" class="product-image">
                <h3>${product.product_name}</h3>
                <p class="price">$${product.product_price || 0}</p>
                <button class="btnAddToCart" data-name="${product.product_name}" data-price="${product.product_price || 0}" data-image="${imageUrl}">ADD TO CART</button>
            `;

            container.appendChild(productElement);
        });

        // 🔹 **Most már a `window.addToCart` elérhető!**
        document.querySelectorAll('.btnAddToCart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    // 🔹 **Kosár műveletek**
    document.addEventListener('click', function(event) {
        const target = event.target;

        if (target.classList.contains('increase-quantity')) {
            const index = target.getAttribute('data-index');
            cartItems[index].quantity++;
            updateCart();
        }

        if (target.classList.contains('decrease-quantity')) {
            const index = target.getAttribute('data-index');
            if (cartItems[index].quantity > 1) {
                cartItems[index].quantity--;
                updateCart();
            }
        }

        if (target.classList.contains('remove-item')) {
            const index = target.getAttribute('data-index');
            cartItems.splice(index, 1);
            updateCart();
        }
    });

    // 🔹 **Meghívjuk a termékek megjelenítését és a kosár frissítését**
    displayProducts(products);
    updateCart();
});
