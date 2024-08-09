import {carouselElement} from './carousel_origine.js';
import {items} from './carousel_origine.js';
import {options} from './carousel_origine.js';
import {instanceOptions} from './carousel_origine.js';

const carousel = new Carousel(carouselElement, items, options, instanceOptions);
carousel.next();

// goes to the previous (left) slide
carousel.prev();

carousel.cycle();

// pauses the cycling (automated sliding)
carousel.pause();

// const $prevButton = document.getElementById('data-carousel-prev');
// const $nextButton = document.getElementById('data-carousel-next');

// $prevButton.addEventListener('click', () => {
//     carousel.prev();
// });

// $nextButton.addEventListener('click', () => {
//     carousel.next();
// });