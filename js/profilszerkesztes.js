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

    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ first_name, last_name, email, password }) 
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

