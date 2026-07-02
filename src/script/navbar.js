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
    if (window.innerWidth > 1024) {
        popup.classList.remove('active');
    }
});
