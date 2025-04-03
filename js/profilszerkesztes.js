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



document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('profileForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        // Ellenőrzés: Az összes input létezik-e?
        const firstnameInput = document.getElementById('firstname');
        const lastnameInput = document.getElementById('lastname');
        const passwordInput = document.getElementById('password');


        if (!firstnameInput || !lastnameInput || !passwordInput || !profilePictureInput) {
            console.error('Hiba: Nem találhatóak az input mezők!');
            return;
        }

        const firstname = firstnameInput.value.trim();
        const lastname = lastnameInput.value.trim();
        const password = passwordInput.value.trim();
        const profilePicture = profilePictureInput.files[0];

        try {
            // **1️⃣ Név módosítása**
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

            // **2️⃣ Jelszó módosítása**
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
