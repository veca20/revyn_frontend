document.addEventListener('DOMContentLoaded', function () {
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

    // Load page function
    let defaultPage = "index";
    
    function loadPage(page) {
        let pageToLoad = page ? page : defaultPage;
        let filePath = `/revyn_frontend/${pageToLoad}.html`;

        let currentContent = document.getElementById("content").getAttribute("data-loaded-page");
        if (currentContent === pageToLoad) {
            console.log(`Az oldal már betöltődött: ${pageToLoad}`);
            return;
        }

        console.log(`Betöltés: ${filePath}`);

        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Hiba: ${response.status} - Az oldal nem található: ${filePath}`);
                }
                return response.text();
            })
            .then(html => {
                let contentDiv = document.getElementById("content");
                contentDiv.innerHTML = html;
                contentDiv.setAttribute("data-loaded-page", pageToLoad);
            })
            .catch(error => console.error("Hiba történt:", error));
    }

    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            let page = this.getAttribute("data-page");
            loadPage(page);
        });
    });

    if (!document.getElementById("content").hasAttribute("data-loaded-page")) {
        loadPage();
    }
});
