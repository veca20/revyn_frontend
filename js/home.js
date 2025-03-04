document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOMContentLoaded event fired'); // Debugging célra

    const res = await fetch('/api/products', {
        method: 'GET',
        credentials: 'include'
    });

    const products = await res.json();
    console.log(products);

    displayProducts(products);
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');

    // Hamburger menü
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('show');
        });
    } else {
        console.error('Hamburger vagy navMenu elem nem található');
    }

    // ADMIN JOGOSULTSÁGOK KEZELÉSE
    const role = localStorage.getItem('role');
    if (role === 'admin') {
        const adminPanelLink = document.querySelector('.admin-panel-link');
        if (adminPanelLink) {
            adminPanelLink.style.display = 'block';
        }
        window.location.href = 'addproduct.html'; 
    } else if (role === 'user') {
        const adminPanelLink = document.querySelector('.admin-panel-link');
        if (adminPanelLink) {
            adminPanelLink.style.display = 'none';
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

    document.addEventListener('click', function(event) {
        const target = event.target;

        if (target.classList.contains('increase-quantity')) {
            const index = target.getAttribute('data-index');
            const item = cartItems[index];
            if (item) {
                item.quantity++;
                updateCart();
            }
        }

        if (target.classList.contains('decrease-quantity')) {
            const index = target.getAttribute('data-index');
            const item = cartItems[index];
            if (item && item.quantity > 1) {
                item.quantity--;
                updateCart();
            }
        }

        if (target.classList.contains('remove-item')) {
            const index = target.getAttribute('data-index');
            cartItems.splice(index, 1);
            updateCart();
        }
    });
});




function displayProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) {
        console.error('A termékeket tartalmazó elem nem található.');
        return;
    }
    
     // Kosárba adás gombok kezelése
     document.querySelectorAll('.btnAddToCart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        productElement.innerHTML = `
            <img src="${product_image}" alt="${product_name}" class="product_image">
            <h3>${product_name}</h3>
           
            <p class="price">$${price.toFixed(2)}</p>
            <button class="btnAddToCart" data-name="${product_name}" data-price="${product_price}" data-image="${product_image}">ADD TO CART</button>
        `;

        container.appendChild(productElement);
    });

   
}
