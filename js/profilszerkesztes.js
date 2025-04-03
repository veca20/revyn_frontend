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

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // API kérés elküldése a backendhez
    try {
        const response = await fetch('api/update-profile', { // Itt módosítsd az API URL-t!
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password }) 
        });

        const result = await response.json();
        if (response.ok) {
            alert('Profil sikeresen frissítve!');
        } else {
            alert('Hiba történt: ' + result.message);
        }
    } catch (error) {
        console.error('Hálózati hiba:', error);
        alert('Nem sikerült csatlakozni a szerverhez.');
    }
});
