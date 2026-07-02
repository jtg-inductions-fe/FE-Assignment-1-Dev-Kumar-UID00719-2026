const footerButton = document.querySelectorAll('.footer__dropdown-button');

function updateFooterAccessibility() {
    const isMobile = window.innerWidth <= 430;

    footerButton.forEach((button) => {
        button.style.pointerEvents = isMobile ? 'auto' : 'none';
        button.tabIndex = isMobile ? 0 : -1;
    });
}

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
