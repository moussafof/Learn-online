document.addEventListener('DOMContentLoaded', function() {
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            const courseId = this.getAttribute('data-course-id');
            addToCart(courseId, this);
        });
    });

    function addToCart(courseId, btn) {
        // Ajouter l'ID du cours au localStorage
        let cartItems = localStorage.getItem('cartItems');
        cartItems = cartItems ? JSON.parse(cartItems) : [];
        if (!cartItems.includes(courseId)) {
            cartItems.push(courseId);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartCounter();
        }

        // Modifier le texte et la couleur du bouton
        btn.textContent = 'Course ajouté au panier';
    }
    function updateCartCounter() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    document.getElementById('cart-counter').textContent = cartItems.length;
}
updateCartCounter();

});

