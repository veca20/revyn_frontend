document.addEventListener('DOMContentLoaded', function () {
    // Űrlap beküldésének kezelése és termék mentése MySQL-be
    document.getElementById('product-form').addEventListener('submit', function (event) {
        event.preventDefault();

        // FormData használata a képfeltöltéshez
        const formData = new FormData();
        formData.append('name', document.getElementById('product_name').value);
        formData.append('price', document.getElementById('product_price').value);
        formData.append('info', document.getElementById('product_description').value);
        formData.append('image', document.getElementById('product_image').files[0]); // Képfeltöltés

        fetch('api/products', {
            method: 'POST',
            body: formData // Már nem küldünk JSON-t, hanem FormData-t
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                document.getElementById('product-form').reset(); // Űrlap resetelése
                displayProducts(); // Termékek frissítése
            })
            .catch(error => console.error("Hiba:", error));
    });

    // Termékek megjelenítése, ha van "products-list" elem az oldalon
    if (document.getElementById('products-container')) {
        displayProducts();
    }

    // Kijelentkezés gomb eseménykezelő
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('user'); // Felhasználói adatok törlése
            sessionStorage.clear(); // Munkamenet törlése
            window.location.href = 'login.html'; // Átirányítás a bejelentkezési oldalra
        });
    }
});

// Termékek listázása MySQL-ből
function displayProducts() {
    fetch('api/products')
        .then(response => response.json())
        .then(products => {
            const productsContainer = document.getElementById('products-container');
            if (!productsContainer) return; // Ha nincs ilyen elem, kilépünk

            productsContainer.innerHTML = ''; // Tartalom törlése

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

                productsContainer.appendChild(productElement);
            });
        })
        .catch(error => console.error("Hiba a termékek betöltésekor:", error));
}