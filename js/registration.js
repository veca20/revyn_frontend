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

// regisztáció
document.addEventListener('DOMContentLoaded', function () {
    const btnReg = document.querySelector('.btnReg');

    if (btnReg) {
        btnReg.addEventListener('click', function (event) {
            event.preventDefault(); // Megakadályozza az alapértelmezett űrlapküldést
            console.log('Regisztrációs gombra kattintottak!'); // Ellenőrzés a konzolon
            // Ha ide akarod navigálni az oldalt, akkor csak a regisztrációs adatokat küld el a szerverre
        });
    } else {
        console.error('btnReg gomb nem található!');
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

            // Konzolba kiírás
            console.log('Szerver válasza:', response);
            const result = await response.json();
            console.log('Szerver válasz JSON:', result);

            // Ellenőrizd a válasz státuszát
            if (!response.ok) {
                console.log('Hiba a válaszban:', response.status);
                return alert(`Hiba történt! HTTP státusz: ${response.status}`);
            }

            // Ha van hibaüzenet
            if (result.errors) {
                console.error('Szerver hibaüzenetek:', result.errors);
                alert('Hiba történt a regisztráció során.');
            } else {
                console.log('Sikeres regisztráció:', result);
                alert('Sikeres regisztráció!');
                form.reset();
                window.location.href = 'index.html'; // Átirányítás siker után
            }
        } catch (error) {
            console.error('Hálózati hiba:', error);
            alert('Hálózati hiba történt! Próbáld újra.');
        }
    });
});
