document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOMContentLoaded event fired');

    const res = await fetch('/api/products', {
        method: 'GET',
        credentials: 'include'
    });

    const products = await res.json();
    console.log(products);

    let cartItems = JSON.parse(localStorage.getItem('cart')) || []; // Kosár betöltése

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

    // 🔹 **Először definiáljuk az addToCart függvényt**
    function addToCart(event) {
        const button = event.target;
        const productName = button.getAttribute('data-name');
        const productPrice = parseFloat(button.getAttribute('data-price')) || 0;
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

    // 🔹 **Ezután hívjuk meg a displayProducts-et**
    displayProducts(products);
    updateCart(); // Betöltéskor frissítjük a kosarat is

    // 🔹 Kosár működtetése
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
});

// 🔹 **A displayProducts meghívása után az eseményfigyelők is rendesen működni fognak**
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

    // 🔹 **Itt már biztosan létezik az addToCart függvény, így nem lesz hiba**
    document.querySelectorAll('.btnAddToCart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}
