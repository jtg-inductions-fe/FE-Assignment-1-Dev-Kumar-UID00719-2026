let popupOpen = false;

const hamburger = document.querySelector('#navbar-hamburger');
const popup = document.querySelector('#navbar-popup');
const body = document.body;

hamburger.addEventListener('click', () => {
    if (popupOpen === false) {
        popup.classList.add('navbar__popup--active');
        popupOpen = true;
        body.classList.add('no-scroll');
    } else {
        popup.classList.remove('navbar__popup--active');
        popupOpen = false;
        body.classList.remove('no-scroll');
    }
});

window.addEventListener('resize', () => {
    popup.classList.remove('navbar__popup--active');
    popupOpen = false;
    body.classList.remove('no-scroll');
});
