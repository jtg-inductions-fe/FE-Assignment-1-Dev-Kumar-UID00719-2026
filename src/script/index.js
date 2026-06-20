import '../styles/main.scss';
let popupOpen = false;

let hamburger = document.querySelector('.navbar__hamburger');
let popup = document.querySelector('.navbar__popup');

hamburger.addEventListener('click', () => {
    if (popupOpen === false) {
        popup.style.display = 'flex';
        popupOpen = true;
    } else {
        popup.style.display = 'none';
        popupOpen = false;
    }
});
