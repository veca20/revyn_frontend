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

    // Kosár gombok dinamikus kezelése
    const cartButtons = document.querySelectorAll('.add-to-cart');
    cartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            if (!productCard) return;

            const productName = productCard.querySelector('h2')?.innerText;
            const productPrice = productCard.querySelector('.price')?.innerText.replace('$', '');
            const productQuantity = productCard.querySelector('.quantity input')?.value;
            const productImage = productCard.querySelector('img')?.src;

            if (!productName || !productPrice || !productQuantity || !productImage) {
                console.error('Hiányzó termékadatok');
                return;
            }

            let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
            let existingProduct = cart.find(item => item.name === productName);

            if (existingProduct) {
                existingProduct.quantity += parseInt(productQuantity);
            } else {
                cart.push({
                    name: productName,
                    price: parseFloat(productPrice),
                    quantity: parseInt(productQuantity),
                    image: productImage
                });
            }

            sessionStorage.setItem('cart', JSON.stringify(cart));
            alert(`${productQuantity}x ${productName} hozzáadva a kosárhoz!`);
            updateCartCount();
            displayCart();
        });
    });

    // Kosár ikon frissítése
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (!cartCount) return;

        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Kosár tartalmának megjelenítése
    function displayCart() {
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const cartContainer = document.getElementById('cart-container');
        const totalPriceElement = document.getElementById('total-price');
        const applyGiftCardButton = document.getElementById('apply-gift-card');

        if (cartContainer) {
            cartContainer.innerHTML = ''; // Kosár kiürítése
            if (cart.length === 0) {
                cartContainer.innerHTML = '<p>A kosár üres!</p>';
            } else {
                cart.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('cart-item');
                    itemElement.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
                        <p>${item.name} - ${item.price} $ - Mennyiség: ${item.quantity}</p>
                    `;
                    cartContainer.appendChild(itemElement);
                });
            }
        }

        if (totalPriceElement) {
            let totalPrice = 0;
            cart.forEach(item => {
                totalPrice += item.price * item.quantity;
            });

            totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} $`;
        }
    }

    // Kuponkód alkalmazása
    let discounts = {
        "DISCOUNT10": 10,
        "SAVE20": 20,
        "PROMO5": 5
    };

    function applyDiscount() {
        const giftCardInput = document.getElementById('gift-card');
        const discountMessage = document.getElementById('discount-message');
    
        if (!discountMessage) {
            console.warn('A discount-message elem nem található a DOM-ban.');
            return;
        }

        // Ellenőrizzük, hogy már alkalmazva lett-e kupon
        if (sessionStorage.getItem('discountApplied')) {
            discountMessage.textContent = "Egy kupon már alkalmazva van!";
            alert("Egy kupon már alkalmazva van! Csak egy kupon használható.");
            return;
        }

        if (giftCardInput && discounts[giftCardInput.value]) {
            let appliedDiscount = discounts[giftCardInput.value];
            sessionStorage.setItem('discount', appliedDiscount);
            sessionStorage.setItem('discountApplied', true);

            discountMessage.textContent = `Kupon sikeresen alkalmazva! Kedvezmény: ${appliedDiscount} Ft`;
            alert(`Kupon sikeresen alkalmazva! Kedvezmény: ${appliedDiscount} Ft`);
        } else {
            sessionStorage.removeItem('discount');
            sessionStorage.removeItem('discountApplied');
            discountMessage.textContent = "Érvénytelen kuponkód!";
            alert("Érvénytelen kuponkód!");
        }

        displayCart();
    }

    const applyGiftCardButton = document.getElementById('apply-gift-card');
    if (applyGiftCardButton) {
        applyGiftCardButton.addEventListener('click', applyDiscount);
    }

    // Oldal betöltésekor frissítse a kosár ikont és jelenítse meg a kosár tartalmát
    updateCartCount();
    displayCart();
});
