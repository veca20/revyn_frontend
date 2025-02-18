document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('show');
        });
    } else {
        console.error('Hamburger vagy navMenu nem található.');
    }

    const btnLogin = document.querySelector('#btnLogin'); // ID alapján kiválasztás

    if (btnLogin) {
        btnLogin.addEventListener('click', login);
    } else {
        console.error('btnLogin nem található!');
    }
});

// Bejelentkezési funkció
async function login(event) {
    event.preventDefault(); // Megakadályozza az űrlap elküldését

    console.log(document.getElementById('email'));
console.log(document.getElementById('psw'));
console.log(document.getElementById('btnLogin'));


    const email = document.getElementById('email').value.trim();
    const psw = document.getElementById('psw').value.trim();

    if (!email || !psw) {
        alert('Kérlek, töltsd ki az összes mezőt.');
        return;
    }

    try {
        const res = await fetch('https://nodejs314.dszcbaross.edu.hu/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, psw }),
            credentials: 'include',
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Hiba történt:', errorText);
            alert('Bejelentkezés sikertelen. Ellenőrizd az adatokat.');
            return;
        }

        const data = await res.json();
        console.log('Bejelentkezés sikeres:', data);

        if (data.message) {
            alert(data.message);
            window.location.href = 'index.html'; // Sikeres bejelentkezés után navigáció
        } else {
            alert('Ismeretlen hiba történt.');
        }
    } catch (error) {
        console.error('Hiba a bejelentkezés során:', error);
        alert('Nem sikerült csatlakozni a szerverhez. Próbáld újra később.');
    }
}
