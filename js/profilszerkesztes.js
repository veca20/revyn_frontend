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



document.getElementById('profileForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const token = localStorage.getItem('token'); // JWT token
    if (!token) {
        alert('Be kell jelentkezned!');
        return;
    }

    const firstname = document.getElementById('firstname').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const password = document.getElementById('password').value.trim();
    const profilePicture = document.getElementById('profile_picture').files[0];

    try {
        // **1️⃣ Név módosítása**
        if (firstname || lastname) {
            const nameResponse = await fetch('/api/editProfileName', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ psw: password })
            });

            const passwordResult = await passwordResponse.json();
            if (!passwordResponse.ok) throw new Error(passwordResult.error);
        }

        // **3️⃣ Profilkép módosítása**
        if (profilePicture) {
            const formData = new FormData();
            formData.append('profile_picture', profilePicture);

            const pictureResponse = await fetch('/api/editProfilePicture', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const pictureResult = await pictureResponse.json();
            if (!pictureResponse.ok) throw new Error(pictureResult.error);
        }

        document.getElementById('message').textContent = 'Profil sikeresen frissítve!';
        document.getElementById('message').style.color = 'green';
    } catch (error) {
        console.error('Hiba:', error);
        document.getElementById('message').textContent = 'Hiba történt: ' + error.message;
        document.getElementById('message').style.color = 'red';
    }
});
