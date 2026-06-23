import '../styles/main.scss';
let popupOpen = false;

let hamburger = document.querySelector('#navbar__hamburger');
let popup = document.querySelector('#navbar__popup');

hamburger.addEventListener('click', () => {
    if (popupOpen === false) {
        popup.classList.add('active');
        popupOpen = true;
    } else {
        popup.classList.remove('active');
        popupOpen = false;
    }
});
