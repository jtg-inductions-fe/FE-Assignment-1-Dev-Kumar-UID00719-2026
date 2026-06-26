import '../styles/main.scss';
import '@splidejs/splide/css';
import Splide from '@splidejs/splide';
let popupOpen = false;

let hamburger = document.querySelector('#navbar-hamburger');
let popup = document.querySelector('#navbar-popup');
const headings = document.querySelectorAll('.footer__subheading');

hamburger.addEventListener('click', () => {
    if (popupOpen === false) {
        popup.classList.add('active');
        popupOpen = true;
    } else {
        popup.classList.remove('active');
        popupOpen = false;
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        popup.classList.remove('active');
    }
});

new Splide('.splide', {
    type: 'loop',
    perPage: 1,
    arrows: true,
}).mount();

headings.forEach((heading) => {
    heading.addEventListener('click', () => {
        const link = heading.nextElementSibling;

        const span = heading.querySelector('span');
        span.classList.toggle('rotate');

        link.classList.toggle('accordion');
    });
});
