// Hamburger menü kapcsoló funkció
function toggleMenu() {
    var menu = document.getElementById('nav-menu');
    menu.classList.toggle('hidden');
}

// Hamburger menü kapcsoló funkció
document.querySelector('.hamburger-menu').addEventListener('click', function() {
    
});

// Keresés
document.getElementById('search-icon').addEventListener('click', function() {
    const searchBox = document.getElementById('search-box');
    searchBox.classList.toggle('show');
});

document.getElementById('profileForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Példa mentésre, itt el lehet küldeni az adatokat egy szerverre
    console.log('Felhasználónév:', username);
    console.log('E-mail:', email);
    console.log('Jelszó:', password);

    alert('Profiladatok mentése sikeres!');
});
