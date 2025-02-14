document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');

    hamburger.addEventListener('click', function () {
        navMenu.classList.toggle('show');
    });

    const btnLogin = document.getElementById('btnLogin');

    // Ellenőrizze, hogy a login gomb létezik-e, mielőtt eseményt ad hozzá
    if (btnLogin) {
        btnLogin.addEventListener('click', login);
    }
});

// Bejelentkezési funkció
async function login() {
    const email = document.getElementById('email').value.trim();
    const psw = document.getElementById('psw').value.trim();

    // Üres mezők ellenőrzése
    if (!email || !psw) {
        alert('Kérlek, töltsd ki az összes mezőt.');
        return;
    }

    try {
        const res = await fetch('http://192.168.10.13:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, psw }),
            credentials: 'include',
        });

        if (!res.ok) {
            // Nem sikeres válasz esetén szövegként olvassuk be
            const errorText = await res.text();
            console.error('Hiba történt:', errorText);
            alert('Bejelentkezés sikertelen. Ellenőrizd az adatokat.');
            return;
        }

        // Próbáljuk meg JSON formátumban olvasni a választ
        const data = await res.json();
        console.log('Bejelentkezés sikeres:', data);

        if (data.message) {
            alert(data.message);
            window.location.href = '../html/home.html'; // Átirányítás a főoldalra
        } else {
            alert('Ismeretlen hiba történt.');
        }
    } catch (error) {
        console.error('Hiba a bejelentkezés során:', error);
        alert('Nem sikerült csatlakozni a szerverhez. Próbáld újra később.');
    }
    
}
