import '../styles/main.scss';
import '@splidejs/splide/css';
import Splide from '@splidejs/splide';

let popupOpen = false;

const hamburger = document.querySelector('#navbar-hamburger');
const popup = document.querySelector('#navbar-popup');
const footerButton = document.querySelectorAll('.footer__dropdown-button');

new Splide('.splide', {
    type: 'loop',
    perPage: 1,
    arrows: true,
}).mount();

function updateFooterAccessibility() {
    const isMobile = window.innerWidth <= 430;

    footerButton.forEach((button) => {
        button.style.pointerEvents = isMobile ? 'auto' : 'none';
        button.tabIndex = isMobile ? 0 : -1;
    });
}

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

updateFooterAccessibility();
window.addEventListener('resize', updateFooterAccessibility);

footerButton.forEach((button) => {
    button.addEventListener('click', () => {
        if (window.innerWidth > 430) return;
        const parent = button.closest('.footer__section');
        const linkContainer = parent.querySelector('.footer__link-container');
        const span = button.querySelector('.footer__dropdown-icon');
        span.classList.toggle('rotate');

        linkContainer.classList.toggle('accordion');
    });
});
