document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('product-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Product added successfully!');
    });
});

function toggleMenu() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('show');
}