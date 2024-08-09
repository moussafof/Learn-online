document.addEventListener('DOMContentLoaded', function() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    
    if (addToCartBtn) {
        const courseId = addToCartBtn.getAttribute('data-id');
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        if (cartItems.includes(courseId)) {
            addToCartBtn.textContent = 'Cours ajouté au panier';
            addToCartBtn.classList.add('bg-green-700');
        }
        
        addToCartBtn.addEventListener('click', function(event) {
            event.preventDefault();
            if (!cartItems.includes(courseId)) {
                cartItems.push(courseId);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                addToCartBtn.textContent = 'Cours ajouté au panier';
                addToCartBtn.classList.add('bg-green-700');
                updateCartCounter();
            }
        });
    }

    function updateCartCounter() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartCounter = document.getElementById('cart-counter');
        if (cartCounter) {
            cartCounter.textContent = cartItems.length;
        }
    }

    updateCartCounter();
});
