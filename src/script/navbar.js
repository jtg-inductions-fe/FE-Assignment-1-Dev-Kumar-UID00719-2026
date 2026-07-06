import { BREAKPOINTS } from './constants';

let popupOpen = false;

const hamburger = document.querySelector('#navbar-hamburger');
const popup = document.querySelector('#navbar-popup');

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
    if (window.innerWidth > BREAKPOINTS.DESKTOP) {
        popup.classList.remove('active');
    }
});
