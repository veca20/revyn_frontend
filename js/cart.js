document.addEventListener('DOMContentLoaded', function () {
    // Hamburger menü toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('show');
        });
    } else {
        console.error('Hamburger vagy navMenu elem nem található');
    }

    function getCartItems() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function saveCartItems(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        let cart = getCartItems();
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }

    function displayCart() {
        let cart = getCartItems();
        const cartContainer = document.getElementById('cart-container');
        const totalPriceElement = document.getElementById('total-price');
        const discountMessage = document.getElementById('discount-message');
        const orderSummary = document.getElementById('order-summary');

        if (cartContainer) {
            cartContainer.innerHTML = cart.length === 0 ? '<p>A kosár üres!</p>' : '';

            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
                        <p>${item.name} - ${item.price} $ - Mennyiség: 
                        <button class="decrease-quantity" data-index="${index}">➖</button>
                        ${item.quantity}
                        <button class="increase-quantity" data-index="${index}">➕</button>
                        <button class="remove-item" data-index="${index}">❌</button>
                        </p>
                    </div>
                `;
                cartContainer.appendChild(itemElement);
            });
        }

        if (orderSummary) {
            orderSummary.innerHTML = '<h3>Order Summary</h3>';
            cart.forEach(item => {
                const summaryItem = document.createElement('p');
                summaryItem.textContent = `${item.name} - ${item.quantity} x ${item.price} $`;
                orderSummary.appendChild(summaryItem);
            });
        }

        let totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (totalPriceElement) {
            totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} $`;
        }
    }

    document.addEventListener('click', function(event) {
        let cart = getCartItems();
        const target = event.target;
        if (target.classList.contains('increase-quantity')) {
            const index = target.getAttribute('data-index');
            cart[index].quantity++;
            saveCartItems(cart);
            displayCart();
        }
        if (target.classList.contains('decrease-quantity')) {
            const index = target.getAttribute('data-index');
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                saveCartItems(cart);
                displayCart();
            }
        }
        if (target.classList.contains('remove-item')) {
            const index = target.getAttribute('data-index');
            cart.splice(index, 1);
            saveCartItems(cart);
            displayCart();
        }
    });

    updateCartCount();
    displayCart();
});
