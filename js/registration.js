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

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementsByClassName('login-form')[0];
    console.log(form);

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Az alapértelmezett űrlapküldést meggátoljuk

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('https://nodejs314.dszcbaross.edu.hu/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log('Szerver válasza:', result); // Naplózás a debughoz

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
