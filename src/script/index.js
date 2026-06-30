import '../styles/main.scss';
import '@splidejs/splide/css';
import Splide from '@splidejs/splide';
let popupOpen = false;

let hamburger = document.querySelector('#navbar-hamburger');
let popup = document.querySelector('#navbar-popup');
const headings = document.querySelectorAll('.footer__dropdown-button');

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
        if (window.innerWidth > 430) return;
        const parent = heading.closest('.footer__section');
        const linkContainer = parent.querySelector('.footer__link-container');
        const span = heading.querySelector('.footer__dropdown-icon');
        span.classList.toggle('rotate');

        linkContainer.classList.toggle('accordion');
    });
});
