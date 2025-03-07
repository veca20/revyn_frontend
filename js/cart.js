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

        if (cartContainer) {
            cartContainer.innerHTML = cart.length === 0 ? '<p>A kosár üres!</p>' : '';

            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
                        <p>${item.name} - ${item.price} $ - Mennyiség: ${item.quantity}</p>
                    </div>
                `;
                cartContainer.appendChild(itemElement);
            });
        }

        let totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (totalPriceElement) {
            totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} $`;
        }

        // Kuponkód kezelése
        let discounts = {
            "DISCOUNT10": 10,
            "SAVE20": 20,
            "PROMO5": 5
        };

        function applyDiscount() {
            const giftCardInput = document.getElementById('gift-card');
            if (!discountMessage) {
                console.warn('A discount-message elem nem található a DOM-ban.');
                return;
            }

            if (localStorage.getItem('discountApplied')) {
                discountMessage.textContent = "Egy kupon már alkalmazva van!";
                alert("Egy kupon már alkalmazva van! Csak egy kupon használható.");
                return;
            }

            if (giftCardInput && discounts[giftCardInput.value]) {
                let appliedDiscount = discounts[giftCardInput.value];
                localStorage.setItem('discount', appliedDiscount);
                localStorage.setItem('discountApplied', true);

                totalPrice -= appliedDiscount;
                totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} $ (kedvezménnyel)`;
                discountMessage.textContent = `Kupon sikeresen alkalmazva! Kedvezmény: ${appliedDiscount} $`;
                alert(`Kupon sikeresen alkalmazva! Kedvezmény: ${appliedDiscount} $`);
            } else {
                localStorage.removeItem('discount');
                localStorage.removeItem('discountApplied');
                discountMessage.textContent = "Érvénytelen kuponkód!";
                alert("Érvénytelen kuponkód!");
            }
        }

        const applyGiftCardButton = document.getElementById('apply-gift-card');
        if (applyGiftCardButton) {
            applyGiftCardButton.addEventListener('click', applyDiscount);
        }
    }

    updateCartCount();
    displayCart();
});
