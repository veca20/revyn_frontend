document.addEventListener('DOMContentLoaded', async function () {
    const res = await fetch('/api/products', {
        method: 'GET',
        credentials: 'include'
    });

    const products = await res.json();
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
        localStorage.setItem('cart', JSON.stringify(cartItems)); 
    }

    window.addToCart = function(event) {
        const button = event.target;
        const productName = button.getAttribute('data-name');
        const productPrice = parseFloat(button.getAttribute('data-price')) || 0;
        let productImage = button.getAttribute('data-image'); 
    
        if (!productImage || productImage === "uploads/") {
            productImage = "uploads/default.jpg"; 
        }
    
        const existingItem = cartItems.find(item => item.name === productName);
    
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ name: productName, price: productPrice, image: productImage, quantity: 1 });
        }
    
        alert(`${productName} hozzáadva a kosárhoz!`);
        updateCart();
    };
    
    function displayProducts(products) {
        const container = document.getElementById('products-container');
        if (!container) {
            console.error('A termékeket tartalmazó elem nem található.');
            return;
        }
    
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
                        data-image="uploads/${product.product_image}">ADD TO CART</button>
                </div>
            `;
    
            container.appendChild(productElement);
        });
    
        document.querySelectorAll('.btnAddToCart').forEach(button => {
            button.addEventListener('click', function(event) {
                addToCart(event);
            });
        });
    }
    
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

    displayProducts(products);
    updateCart();
});