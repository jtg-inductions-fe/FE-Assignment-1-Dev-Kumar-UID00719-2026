import { STORAGE_KEYS } from './constants';

// Dom Elements-------------------------------------------------------------------------------
const dealSection = document.querySelector('#deals');
const dealLinks = document.querySelectorAll('.deals-link');
const dealsCloseButtons = document.querySelectorAll('.deals__close-button');
const btn = document.querySelector('#spin-button');
const wheel = document.querySelector('#wheel');
const wheelContainer = document.querySelector('#picker');
const pointer = document.querySelector('#wheel-pointer');
const viewPrizeButton = document.querySelector('#view-prizes');
const backButton = document.querySelector('#back-button');
const winningsContainer = document.querySelector('#winnings-container');
const dealModal = document.querySelector('#deal-modal');
const winningModal = document.querySelector('#winning-modal');
const navbarPopup = document.querySelector('#navbar-popup');
const counter = document.querySelector('#counter');

// States-------------------------------------------------------------------------------

let deals = [];
let wheelDeals = [];
let winnings = findWinnings();
let availableDeals = [];

let currentDegree = 0;
let spinClicked = false;
const spinTime = 5000;
const loadingTime = 2000;
const expiryColor = '#999999';

// Event Listeners -------------------------------------------------------------------------------

dealLinks.forEach((deal) => {
    deal.addEventListener('click', () => {
        dealSection.classList.add('special-deals-open');
        document.body.classList.add('no-scroll');
        navbarPopup.classList.remove('active');
        if (!localStorage.getItem(STORAGE_KEYS.WINNINGS)) {
            localStorage.setItem(STORAGE_KEYS.WINNINGS, '[]');
        }
        counter.textContent = winnings.length;
        if (deals.length === 0) fetchDeals();
        else {
            fetchRandom();
            renderWheel();
        }
    });
});

viewPrizeButton.addEventListener('click', () => {
    dealModal.classList.add('hide');
    winningModal.classList.remove('hide');
    renderWinnings();
    const UnlockedTabList = winningModal.querySelectorAll('.deal-tab');
    tabUpdate(UnlockedTabList);
});

backButton.addEventListener('click', () => {
    winningModal.classList.add('hide');
    dealModal.classList.remove('hide');
    const dealsTabList = dealModal.querySelectorAll('.deal-tab');
    tabUpdate(dealsTabList);
});

dealsCloseButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        dealSection.classList.remove('special-deals-open');
        document.body.classList.remove('no-scroll');
        if (!winningModal.classList.contains('hide')) {
            winningModal.classList.add('hide');
            dealModal.classList.remove('hide');
        }
    });
});

btn.addEventListener('click', () => {
    if (spinClicked) return;
    spinClicked = true;

    fetchRandom();
    renderWheel();

    const rotations = Math.floor(Math.random() * 6) + 10;
    const degree = Math.floor(Math.random() * 360);
    currentDegree += rotations * 360 + degree;
    wheel.style.transform = `rotate(${currentDegree}deg)`;
    const finalAngle = (360 - (currentDegree % 360)) % 360;

    let prize;

    if (finalAngle >= 0 && finalAngle < 90) {
        prize = 1;
    } else if (finalAngle >= 90 && finalAngle < 180) {
        prize = 3;
    } else if (finalAngle >= 180 && finalAngle < 270) {
        prize = 2;
    } else {
        prize = 0;
    }

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 7);

    if (wheelDeals[prize] === -1) {
        setTimeout(() => {
            spinClicked = false;
        }, spinTime);
        return;
    }

    const newWinning = {
        label: availableDeals[wheelDeals[prize]].label,
        code: availableDeals[wheelDeals[prize]].promoCode,
        time: currentDate,
    };

    winnings.push(newWinning);
    localStorage.setItem(STORAGE_KEYS.WINNINGS, JSON.stringify(winnings));

    const oldPrize = document.querySelector('.deals__win-box');
    if (oldPrize) oldPrize.remove();

    setTimeout(() => {
        wheelContainer.insertAdjacentElement('afterend', renderPrize());
        counter.textContent = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.WINNINGS),
        ).length;
        spinClicked = false;
    }, spinTime);
});

document.addEventListener('click', (e) => {
    const copyButton = e.target.closest('.prize__copy-button');
    if (!copyButton) return;
    const prize = copyButton.closest('.prize');
    const code = prize.querySelector('.prize__code').textContent;

    navigator.clipboard.writeText(code);
});

// Data-------------------------------------------------------------------------------

async function fetchDeals() {
    try {
        const data = await fetch(
            'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/',
        );
        deals = await data.json();
        setTimeout(() => {
            fetchRandom();
            renderWheel();
        }, loadingTime);
    } catch (error) {
        wheel.innerHTML = `
            <p>Failed to load deals</p>
            <p>${error}</p>
        `;
    }
}

function findWinnings() {
    try {
        const winnings = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.WINNINGS),
        );
        if (Array.isArray(winnings)) return winnings;
        return [];
    } catch {
        localStorage.removeItem(STORAGE_KEYS.WINNINGS);
        return [];
    }
}

// Other Functions -------------------------------------------------------------------------------------
function findExpiry(date) {
    const currentDate = new Date();
    const expiry = new Date(date);

    const diffInMS = expiry - currentDate;

    const days = Math.floor(diffInMS / (1000 * 60 * 60 * 24));
    return days + 1;
}

function tabUpdate(tabList) {
    tabList[0].addEventListener('keydown', (e) => {
        tabListEventPrev(e, tabList);
    });
    tabList[tabList.length - 1].addEventListener('keydown', (e) => {
        tabListEventNext(e, tabList);
    });
}

function tabListEventPrev(e, tabList) {
    if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        tabList[tabList.length - 1].focus();
    }
}

function tabListEventNext(e, tabList) {
    if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        tabList[0].focus();
    }
}

// UI Rendering-------------------------------------------------------------------------------
function renderWheel() {
    wheel.innerHTML = '';
    wheel.classList.add('wheel-ready');
    pointer.classList.add('show');
    btn.classList.add('show');

    wheel.innerHTML = `
        <div class="picker__box1 picker__box">
            <span class="picker__box-content picker__offer1">${wheelDeals[0] === -1 ? 'No deals for now' : availableDeals[wheelDeals[0]].label}</span>
        </div>
        <div class="picker__box2 picker__box">
            <span class="picker__box-content picker__offer2">${wheelDeals[1] === -1 ? 'No deals for now' : availableDeals[wheelDeals[1]].label}</span>
        </div>
        <div class="picker__box3 picker__box">
            <span class="picker__box-content picker__offer3">${wheelDeals[2] === -1 ? 'No deals for now' : availableDeals[wheelDeals[2]].label}</span>
        </div>
        <div class="picker__box4 picker__box">
            <span class="picker__box-content picker__offer4">${wheelDeals[3] === -1 ? 'No deals for now' : availableDeals[wheelDeals[3]].label}</span>
        </div>
    `;

    const dealsTabList = dealModal.querySelectorAll('.deal-tab');
    tabUpdate(dealsTabList);
}

function fetchRandom() {
    availableDeals = deals.filter(
        (deal) => !winnings.some((win) => win.label === deal.label),
    );

    wheelDeals = [];

    for (let i = 0; i < Math.min(4, availableDeals.length); i++) {
        let index = -1;
        while (index === -1 || wheelDeals.includes(index)) {
            index = Math.floor(Math.random() * availableDeals.length);
        }
        wheelDeals.push(index);
    }
    while (wheelDeals.length < 4) {
        wheelDeals.push(-1);
    }
}

function renderPrize() {
    const currentWinnings = findWinnings();
    const prize = document.createElement('div');
    prize.classList.add('deals__win-box');

    const newPrize = currentWinnings[currentWinnings.length - 1];
    const daysLeft = findExpiry(newPrize.time);
    prize.innerHTML = `
        <span class="deals__win-box-heading">You won!</span>
        <div class="prize">
            <div class="prize__left">
                <span class="prize__label">${newPrize.label}</span>
                <span class="prize__expiry">Expires in ${daysLeft}d</span>
            </div>
            <div class="prize__right">
                <span class="prize__code">${newPrize.code}</span>
                <button 
                    class="prize__copy-button"
                    tabindex="2"
                    type="button"
                >
                    <img src="assets/icons/Copy.svg" alt="copy icon">
                </button>
            </div>
            
        </div>
    `;

    return prize;
}

function renderWinnings() {
    if (winnings.length === 0) return;
    winningsContainer.innerHTML = '';
    for (let i = 0; i < winnings.length; i++) {
        const prize = document.createElement('div');
        prize.classList.add('prize');
        const thisPrize = winnings[winnings.length - 1 - i];
        const daysLeft = findExpiry(thisPrize.time);

        prize.innerHTML = `
            <div class="prize__left">
                <span class="prize__label">${thisPrize.label}</span>
                <span class="prize__expiry">Expires in ${daysLeft}d</span>
            </div>
            <div class="prize__right">
                <span class="prize__code">${thisPrize.code}</span>
                <button 
                    class="prize__copy-button deal-tab"
                    tabindex="2"
                    type="button"
                >
                    <img src="assets/icons/Copy.svg" alt="copy icon">
                </button>
            </div>
        `;

        if (daysLeft <= 0) {
            const expiry = prize.querySelector('.prize__expiry');
            expiry.textContent = 'Deal Expired';
            expiry.style.color = expiryColor;
            prize.classList.add('expired');
        }

        winningsContainer.appendChild(prize);
    }
}
