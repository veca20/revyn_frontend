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
        const response = await fetch(`/api/products/${productId}`); // Backend végpont
        if (!response.ok) throw new Error('Hiba a termék betöltésekor');

        const product = await response.json();

        // Termékadatok megjelenítése
        document.getElementById('product_name').textContent = product.name;
        document.getElementById('product_price').textContent = `Ár: $${product.price}`;
        document.getElementById('product_image').src = `uploads/${product.image}`;

        document.getElementById('product-_description').textContent = product.description;

        // Kosárhoz adás gomb működése
        document.getElementById('add-to-cart').addEventListener('click', function () {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id: product.id, name: product.name, price: product.price, image: `uploads/${product.image}`, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${product.name} hozzáadva a kosárhoz!`);
        });

    } catch (error) {
        console.error(error);
        document.getElementById('product-container').innerHTML = "<p>Hiba történt a termék betöltésekor.</p>";
    }
});
