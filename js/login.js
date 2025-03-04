document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM teljesen betöltődött!');

    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');

    // Hamburger menü működtetése
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('show');
        });
    } else {
        console.error('Hamburger vagy navMenu nem található.');
    }

    // Bejelentkezési gomb működtetése
    const btnLogin = document.getElementById('btnLogin');
    console.log('btnLogin:', btnLogin);

    if (btnLogin) {
        btnLogin.addEventListener('click', login);
    } else {
        console.error('HIBA: Nem található btnLogin az oldalon!');
    }
});

// Bejelentkezési funkció
async function login(event) {
    event.preventDefault(); // Megakadályozza az űrlap elküldését

    // Ellenőrizzük, hogy az elemek léteznek-e
    const email = document.querySelector('.email');
    const psw = document.querySelector('.password');

    console.log('Email mező:', email);
    console.log('Jelszó mező:', psw);

    if (!email || !psw) {
        console.error('HIBA: Nem található az email vagy jelszó mező a HTML-ben!');
        alert('Hiba történt! Frissítsd az oldalt és próbáld újra.');
        return;
    }

    // Az értékek lekérése
    const emailValue = email.value;
    const pswValue = psw.value;

    if (!emailValue || !pswValue) {
        alert('Kérlek, töltsd ki az összes mezőt.');
        return;
    }

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailValue, psw: pswValue }),
            credentials: 'include', // Cookie-k továbbítása
        });

        console.log(res); // A válasz státusza
        console.log('Cookie-k a kérés előtt:', document.cookie); // Cookie-k a kérés előtt

        const data = await res.json();
        console.log('Cookie-k a válasz után:', document.cookie); // Cookie-k a válasz után

        // Ha a válasz nem sikeres
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Hiba történt:', errorText);
            alert('Bejelentkezés sikertelen. Ellenőrizd az adatokat.');
            return;
        }

        console.log('Bejelentkezés sikeres:', data);
        if (data && data.message) {
            alert(data.message);
            console.log('Cookie-k sikeres bejelentkezés után:', document.cookie);
            // Ha szeretnél irányítani egy másik oldalra, használd a következőt:
          //window.location.href = 'index.html';
        } else {
            alert('Ismeretlen hiba történt.');
        }
    } catch (error) {
        console.error('Hiba a bejelentkezés során:', error);
        alert('Nem sikerült csatlakozni a szerverhez. Próbáld újra később.');
    }
}
