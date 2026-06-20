import '../styles/main.scss';
let popupOpen = false;

let hamburger = document.querySelector('.navbar__hamburger');
let popup = document.querySelector('.navbar__popup');

hamburger.addEventListener('click', () => {
    if (popupOpen === false) {
        popup.style.display = 'flex';
        popupOpen = true;
        hamburger.style.transform = 'rotate(90deg)';
        hamburger.style.transition = 'transform 0.3s ease';
    } else {
        popup.style.display = 'none';
        popupOpen = false;
        hamburger.style.transform = 'rotate(0deg)';
        hamburger.style.transition = 'transform 0.3s ease';
    }
});
