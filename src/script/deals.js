const dealSection = document.querySelector('#deals');
const dealLinks = document.querySelectorAll('.deals-link');
const dealsCloseButton = document.querySelector('#deals-close-button');
const btn = document.querySelector('#spin-button');
const wheel = document.querySelector('#wheel');

// const color1 = '#F4436C';
// const color2 = '#7C3AED';
// const color3 = '#06B6D4';
// const color4 = '#FBBF24';

dealLinks.forEach((deal) => {
    deal.addEventListener('click', () => {
        dealSection.classList.add('special-deals-open');
        document.body.classList.add('no-scroll');

        // fetchDeals();
    });
});

dealsCloseButton.addEventListener('click', () => {
    dealSection.classList.remove('special-deals-open');
    document.body.classList.remove('no-scroll');
});

let current = 0;

// async function fetchDeals() {
//     try {
//         const data = await fetch(
//             'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/ ',
//         );
//         const deals = await data.json();
//         console.log(deals);
//     } catch (error) {
//         console.log(error);
//     }
// }

btn.addEventListener('click', () => {
    const rotations = Math.floor(Math.random() * 6) + 10;
    const degree = Math.floor(Math.random() * 361);
    current += rotations * 360 + degree;

    wheel.style.transform = `rotate(${current}deg)`;
});
