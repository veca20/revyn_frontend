
document.addEventListener('DOMContentLoaded', function() {
    
    
    document.getElementById('product-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Product added successfully!');
       
    });

   
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productItem = this.closest('.product-item');
            const productName = productItem.querySelector('.product-details h2').textContent;
            const productPrice = productItem.querySelector('.product-details p').textContent;
            alert(`Edit product: ${productName}, Price: ${productPrice}`);
         
        });
    });

    
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productItem = this.closest('.product-item');
            productItem.remove();
            alert('Product deleted successfully!');
           
        });
    });

    document.querySelector('.hamburger-menu').addEventListener('click', function() {
        document.querySelector('nav ul').classList.toggle('show');
    });
});
