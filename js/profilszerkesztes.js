document.addEventListener('DOMContentLoaded', function () {

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
});

document.getElementById('message').textContent = 'Profil sikeresen frissítve!';

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('profileForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        // 🔹 Az új id-k, amik megegyeznek a HTML fájlban lévőkkel
        const firstnameInput = document.getElementById('first_name');
        const lastnameInput = document.getElementById('last_name');
        const passwordInput = document.getElementById('password');

        // 🔹 Ellenőrizzük, hogy az elemek léteznek-e
        if (!firstnameInput || !lastnameInput || !passwordInput) {
            console.error('Hiba: Nem találhatóak az input mezők!');
            return;
        }

        const firstname = firstnameInput.value.trim();
        const lastname = lastnameInput.value.trim();
        
        const password = passwordInput.value.trim();

        try {
            // Név módosítása**
            if (firstname || lastname) {
                const nameResponse = await fetch('/api/editProfileName', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ firstname, lastname })
                });

                const nameResult = await nameResponse.json();
                if (!nameResponse.ok) throw new Error(nameResult.error);
            }

           
           
            //  Jelszó módosítása**
            if (password) {
                if (password.length < 6) throw new Error('A jelszónak legalább 6 karakter hosszúnak kell lennie.');

                const passwordResponse = await fetch('/api/editProfilePsw', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ psw: password })
                });

                const passwordResult = await passwordResponse.json();
                if (!passwordResponse.ok) throw new Error(passwordResult.error);
            }

            document.getElementById('message').textContent = 'Profil sikeresen frissítve!';
            document.getElementById('message').style.color = 'green';
        } catch (error) {
            console.error('Hiba:', error);
            document.getElementById('message').textContent = 'Hiba történt: ' + error.message;
            document.getElementById('message').style.color = 'red';
        }
    });
});

