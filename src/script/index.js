import '../styles/main.scss';
// import interFont from 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/+esm';
let popupOpen = false;

let hamburger = document.querySelector('#navbar-hamburger');
let popup = document.querySelector('#navbar-popup');

// const links = document.querySelectorAll(".navbar__links");
// links.forEach((link).addEventListener("click", (e)=>{
//     e.preventDefault();
// }))

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
