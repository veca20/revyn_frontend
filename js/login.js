document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM teljesen betöltődött!');

    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('show');
        });
    } else {
        console.error('Hamburger vagy navMenu nem található.');
    }

    // Biztos, hogy betöltődnek az elemek
    setTimeout(() => {
        const btnLogin = document.getElementById('btnLogin');
        console.log('btnLogin:', btnLogin);

        if (btnLogin) {
            btnLogin.addEventListener('click', login);
        } else {
            console.error('HIBA: Nem található btnLogin az oldalon!');
        }
    }, 500); // Késleltetés fél másodpercet, hogy a DOM biztosan betöltődjön
});

// Bejelentkezési funkció
async function login(event) {
    event.preventDefault(); // Megakadályozza az űrlap elküldését

    // Ellenőrizzük, hogy az elemek léteznek-e
    const email = document.getElementsByClassName('email')[0];

    const psw = document.getElementsByClassName('password')[0]; // Az első password mező

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
        const res = await fetch('https://nodejs314.dszcbaross.edu.hu/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailValue, psw: pswValue }),
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
            window.location.href = 'index.html';
        } else {
            alert('Ismeretlen hiba történt.');
        }
    } catch (error) {
        console.error('Hiba a bejelentkezés során:', error);
        alert('Nem sikerült csatlakozni a szerverhez. Próbáld újra később.');
    }
}
