
document.addEventListener('DOMContentLoaded', function() {
    
  
    document.querySelector('.hamburger-menu').addEventListener('click', function() {
        document.querySelector('nav ul').classList.toggle('show');
    });

    
    const tableRows = document.querySelectorAll('table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            alert(`Order details:\nName: ${this.cells[0].textContent}\nAddress: ${this.cells[1].textContent}\nBill Information: ${this.cells[2].textContent}`);
        });
    });
});
