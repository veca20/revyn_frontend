document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('show');
        shipTo.classList.toggle('show');
    });
});
document.getElementById('search-icon').addEventListener('click', function() {
    const searchBox = document.getElementById('search-box');
    searchBox.classList.toggle('show');
});
