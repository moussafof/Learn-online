document.addEventListener('DOMContentLoaded', function() {
    const cartItemsString = localStorage.getItem('cartItems') || '[]';
    const cartItems = JSON.parse(cartItemsString);

    const cartContainer = document.getElementById('cart-container');
    let totalPrix = 0;
    
    updateCartCounter() ;
     if (cartContainer && cartItems.length > 0) {
        cartItems.forEach(courseId => {
            fetch(`/api/course/${courseId}`)
                .then(response => response.json())
                .then(course => {
                    if (course) {
                        const courseElement = document.createElement('div');
                        courseElement.innerHTML = `
                            <div class="max-w-xs mx-2 my-4 mb-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col">
                                <a href="#">
                                    <img class="max-w" src="${course.image}" alt="">
                                </a>
                                <div class="p-5">
                                    <a href="#">
                                        <h4 class="mb-4 text-2xl font-bold text-sm tracking-tight text-gray-900 dark:text-white">${course.title}</h4>
                                    </a>
                                    <p class="mb-3 text-sm text-gray-700 dark:text-gray-400">${course.price} FCFA</p>
                                    <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-blue bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 remove-from-cart-btn" data-id="${course.id}">
                                        Retirer du panier
                                    </a>
                                </div>
                            </div>
                        `;
                        cartContainer.appendChild(courseElement);
                        totalPrix += parseFloat(course.price); // Assurez-vous que le prix est traité comme un nombre
                        updateTotalPrix(totalPrix);
                        updateCartCounter();
                        courseElement.querySelector('.remove-from-cart-btn').addEventListener('click', function(event) {
                            event.preventDefault();
                            removeFromCart(courseId, courseElement);
                        });
                    } else {
                        console.error(`Cours avec l'ID ${courseId} introuvable.`);
                    }
                })
                .catch(error => console.error(error));
        });
    } else {
        console.log('Aucun cours dans le panier.');
        updateTotalPrix(totalPrix);
    }
    
    document.getElementById('validate-cart-btn').addEventListener('click', function() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        fetch('/validate_cart', {
            method: 'POST',  
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ cartItems: cartItems })  
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.redirect) {
                window.location.href = data.redirect;
                
            } else {
                alert('Panier validé avec succès!');
                
            }
            updateCartCounter();
        })
        .catch(error => console.error('Error:', error));
    });

    
});

function updateTotalPrix(total) {
    const totalPrixElement = document.getElementById('total-prix');
    if (totalPrixElement) {
        totalPrixElement.textContent = `Total: ${total} FCFA`;
    }
}

function removeFromCart(courseId, courseElement) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const index = cartItems.indexOf(courseId);
    if (index > -1) {
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        courseElement.remove();
        updateCartCounter();
        let newTotalPrix= 0;
        cartItems.forEach(id => {
            fetch(`/api/course/${id}`)
                .then(response => response.json())
                .then(course => {
                    if (course) {
                        newTotalPrix += parseFloat(course.price);
                        updateTotalPrix(newTotalPrix);
                    } else {
                        console.error(`Cours avec l'ID ${id} n'existe pas.`);
                    }
                })
                .catch(error => console.error(error));
        });

            
       
    }
}

function updateCartCounter() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    document.getElementById('cart-counter').textContent = cartItems.length;
}
