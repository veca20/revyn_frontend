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

    const token = localStorage.getItem('token'); // A JWT token
    const firstname = document.getElementById('firstname').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const password = document.getElementById('password').value.trim();
   

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

        
        alert('Profil sikeresen frissítve!');
    } catch (error) {
        console.error('Hiba:', error);
        alert('Hiba történt: ' + error.message);
    }
});


