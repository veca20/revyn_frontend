document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');

    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    } else {
        console.error('Hamburger vagy navMenu elem nem található');
    }
});
// regisztáció
document.addEventListener('DOMContentLoaded', function () {
    const btnReg = document.querySelector('.btnReg');

    if (btnReg) {
        btnReg.addEventListener('click', function (event) {
            event.preventDefault(); // Megakadályozza az űrlap elküldését
            window.location.href = 'index.html'; // Átirányítás az index.html-re
        });
    } else {
        console.error('btnReg gomb nem található');
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementsByClassName('login-form')[0];
    console.log(form);

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Az alapértelmezett űrlapküldést meggátoljuk

       const firstname = document.getElementById('firstname').value;
       const lastname = document.getElementById('lastname').value;
       const email = document.getElementById('email').value;
       const psw = document.getElementById('psw').value;

        try {
            const response = await fetch('https://nodejs314.dszcbaross.edu.hu/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstname, lastname, email, psw })
            });

            const result = await response.json();
            console.log('Szerver válasza:', result); // Naplózás a debughoz
            console.log(response);
            if (response.ok) {
                alert('Sikeres regisztráció!');
                form.reset();
            } else {
                // Ellenőrizd, hogy van-e "errors" mező, és az tömb-e
                const errors = result.errors;
                if (Array.isArray(errors)) {
                    alert(`Hiba: ${errors.map(err => err.error).join(', ')}`);
                } else {
                    alert('Ismeretlen hiba történt! Ellenőrizd az adatokat, és próbáld újra.');
                }
            }
        } catch (error) {
            console.error('Hálózati hiba:', error);
            alert('Hálózati hiba történt! Győződj meg arról, hogy a szerver fut, és próbáld újra.');
        }
    });
});
