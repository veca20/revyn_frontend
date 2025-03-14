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
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch (e) {
            console.error('Hiba a kosár betöltésekor:', e);
            return [];
        }
    }

    function saveCartItems(cart) {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Hiba a kosár mentésekor:', e);
        }
    }

    function updateCartCount() {
        let cart = getCartItems();
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }

    function createCartItemElement(item, index) {
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
        return itemElement;
    }

    function displayCart() {
        let cart = getCartItems();
        const cartContainer = document.getElementById('cart-container');
        const totalPriceElement = document.getElementById('total-price');
        const orderSummary = document.getElementById('order-summary');

        if (cartContainer) {
            cartContainer.innerHTML = cart.length === 0 ? '<p>A kosár üres!</p>' : '';
            cart.forEach((item, index) => {
                const itemElement = createCartItemElement(item, index);
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
            totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
        }
    }

    function handleCartAction(event) {
        let cart = getCartItems();
        const target = event.target;
        const index = target.getAttribute('data-index');

        if (target.classList.contains('increase-quantity')) {
            cart[index].quantity++;
        } else if (target.classList.contains('decrease-quantity')) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
        } else if (target.classList.contains('remove-item')) {
            cart.splice(index, 1);
        }

        saveCartItems(cart);
        updateCartCount();
        displayCart();
    }

    document.addEventListener('click', handleCartAction);

    updateCartCount();
    displayCart();

    // Pay Now gomb működtetése
    const payNowButton = document.querySelector('.pay-now');
    if (payNowButton) {
        payNowButton.addEventListener('click', function () {
            const first_name = document.getElementById('first_name').value;
            const last_name = document.getElementById('last_name').value;
            const address = document.getElementById('address').value;
            const phone_number = document.getElementById('phone_number').value;
            const card_number = document.getElementById('card_number').value;
            const expiration_date = document.getElementById('expiration_date').value;
            const name_on_card = document.getElementById('name_on_card').value;
            const cvc = document.getElementById('cvc').value;
            const cart = getCartItems();

            if (!first_name || !last_name || !address || !phone_number || !card_number || !expiration_date || !name_on_card ||  !cvc || cart.length === 0) {
                alert('Minden mezőt ki kell tölteni, és a kosár nem lehet üres!');
                return;
            }

            const orderData = { first_name, last_name, address, phone_number, card_number, expiration_date, name_on_card, cart };

            fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(data => {
                alert('Sikeres fizetés! A rendelés mentve lett.');
                localStorage.removeItem('cart'); // Kosár törlése
            })
            .catch(error => console.error('Error saving order:', error));
        });
    } 
});
