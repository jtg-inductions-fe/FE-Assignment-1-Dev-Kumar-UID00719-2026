import { STORAGE_KEYS, TIME, COLOR, DEALS_API } from './constants';

// Dom Elements-------------------------------------------------------------------------------
const dealSection = document.querySelector('#deals');
const dealButtons = document.querySelectorAll('.navbar__deals-button');
const dealsCloseButtons = document.querySelectorAll('.deals__close-button');
const spinButton = document.querySelector('#spin-button');
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
let currentShownDeals = [];
let availableDeals = [];

let currentDegree = 0;

// Data-------------------------------------------------------------------------------

/**
 * Copies the provided promo code to the clipboard.
 *
 * @param {string} code - Promo code to copy.
 */
const copy = (code, button) => {
    navigator.clipboard.writeText(code);
    const icon = button.querySelector('.copy-icon');
    icon.classList.remove('icon-copy');
    icon.classList.add('icon-checkmark');

    setTimeout(() => {
        icon.classList.remove('icon-checkmark');
        icon.classList.add('icon-copy');
    }, TIME.COPY_TRANSITION);
};
window.copy = copy;

/**
 * Fetches Deals data from API
 */
const fetchDeals = async () => {
    try {
        const data = await fetch(DEALS_API);
        deals = await data.json();
        setTimeout(() => {
            fetchRandomDealsForWheel();
            renderWheel();
        }, TIME.WHEEL_LOADING_TIME);
    } catch (error) {
        wheel.innerHTML = `
            <p>Failed to load deals</p>
            <p>${error}</p>
        `;
    }
};

/**
 * Fetches winnings data from localstorage
 */
const fetchWinnings = () => {
    try {
        const winnings = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.WINNINGS),
        );
        return winnings ?? [];
    } catch {
        localStorage.removeItem(STORAGE_KEYS.WINNINGS);
        return [];
    }
};

let winnings = fetchWinnings();

// Other Functions -------------------------------------------------------------------------------------
/**
 * Calculates the remaining days until the deal expires.
 *
 * @param {string | Date} date - The expiry date of the deal.
 * @returns {number} The number of days remaining until expiry.
 */
const findExpiry = (date) => {
    const currentDate = new Date();
    const expiry = new Date(date);

    const diffInMS = expiry - currentDate;

    const days = Math.floor(diffInMS / TIME.MILI_SECONDS_IN_ONE_DAY);
    return days + 1;
};

/**
 * Updates keyboard tab navigation for the provided tab list.
 *
 * @param {NodeList} tabList - The list of focusable tab elements.
 */
const tabNavigationUpdate = (tabList) => {
    tabList[0].focus();
    tabList[0].addEventListener('keydown', (e) => {
        tabListEventPrev(e, tabList);
    });
    tabList[tabList.length - 1].addEventListener('keydown', (e) => {
        tabListEventNext(e, tabList);
    });
};

/**
 * Handles reverse tab navigation from the first element.
 *
 * @param {KeyboardEvent} e - The keyboard event.
 * @param {NodeList} tabList - The list of focusable tab elements.
 */
const tabListEventPrev = (e, tabList) => {
    if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        tabList[tabList.length - 1].focus();
    }
};

/**
 * Handles forward tab navigation from the last element.
 *
 * @param {KeyboardEvent} e - The keyboard event.
 * @param {NodeList} tabList - The list of focusable tab elements.
 */
const tabListEventNext = (e, tabList) => {
    if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        tabList[0].focus();
    }
};

// UI Rendering-------------------------------------------------------------------------------

/**
 * Renders the deals wheel with the currently selected deals.
 */
const renderWheel = () => {
    wheel.innerHTML = '';
    wheel.classList.add('picker__wheel--ready');
    pointer.classList.add('show');
    spinButton.classList.add('show');
    let html = '';

    currentShownDeals.forEach((deal, index) => {
        html += `
            <div class="picker__box${index + 1} picker__box">
                <span class="picker__box-content picker__offer${index + 1}">
                    ${deal === -1 ? 'No deals for now' : deal.label}
                </span>
            </div>
        `;
    });

    wheel.innerHTML = html;
};

/**
 * Selects up to four random available deals for the wheel.
 */
const fetchRandomDealsForWheel = () => {
    currentShownDeals = [];
    availableDeals = deals.filter(
        (deal) => !winnings.some((win) => win.label === deal.label),
    );

    for (let i = availableDeals.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [availableDeals[i], availableDeals[j]] = [
            availableDeals[j],
            availableDeals[i],
        ];
    }

    currentShownDeals = availableDeals.slice(0, 4);
    while (currentShownDeals.length < 4) {
        currentShownDeals.push(-1);
    }
};

/**
 * Creates and returns the winning prize element.
 *
 * @param {Object} winning - The winning deal.
 * @returns {HTMLDivElement} The rendered prize element.
 */
const renderNewPrize = (winning) => {
    const { label, code, time } = winning;
    const prize = document.createElement('div');
    prize.classList.add('deals__win-box');

    const daysLeft = findExpiry(time);
    prize.innerHTML = `
        <span class="deals__win-box-heading">You won!</span>
        <div class="prize">
            <div class="prize__left">
                <span class="card-label">${label}</span>
                <span class="card-label card-label--accented">Expires in ${daysLeft}d</span>
            </div>
            <div class="prize__right">
                <span class="prize__code">${code}</span>
                <button 
                    class="prize__copy-button"
                    tabindex="2"
                    type="button"
                    onclick = "copy('${code}', this)"
                >
                    <span class="icon-copy copy-icon"></span>
                </button>
            </div>
            
        </div>
    `;

    return prize;
};

/**
 * Renders all saved winnings in the winnings container.
 */
const renderAllWinnings = () => {
    if (winnings.length === 0) {
        return;
    }

    winningsContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();

    const sortedWinnings = [...winnings].sort(
        (a, b) => new Date(a.time) - new Date(b.time),
    );

    sortedWinnings.forEach((winning) => {
        const { label, code, time } = winning;
        const daysLeft = findExpiry(time);
        const div = document.createElement('div');
        div.classList.add('prize');

        if (daysLeft <= 0) {
            div.classList.add('prize--expired');
        }

        div.innerHTML = `
            <div class="prize__left">
                <span class="card-label">${label}</span>
                <span
                    class="card-label card-label--accented"
                    ${daysLeft <= 0 ? `style="color:${COLOR.EXPIRY_COLOR}"` : ''}
                >
                    ${daysLeft <= 0 ? 'Deal Expired' : `Expires in ${daysLeft}d`}
                </span>
            </div>
            <div class="prize__right">
                <span class="prize__code">${code}</span>
                <button
                    class="prize__copy-button deal-tab"
                    tabindex="2"
                    type="button"
                    onclick="copy('${code}', this)"
                    ${daysLeft <= 0 ? 'disabled' : ''}
                >
                    <span class="icon-copy copy-icon"></span>
                </button>
            </div>
        `;
        fragment.appendChild(div);
    });

    winningsContainer.appendChild(fragment);
};

const spinButtonEvent = function () {
    this.disabled = true;
    this.classList.toggle('picker__spin-button--disabled');

    fetchRandomDealsForWheel();
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
    const currentWinning = currentShownDeals[prize];

    if (currentWinning === -1) {
        setTimeout(() => {
            this.disabled = false;
            this.classList.toggle('picker__spin-button--disabled');
        }, TIME.SPIN_TIME);
        return;
    }

    const dealValidFor = currentWinning.validFor ?? 7;
    currentDate.setDate(currentDate.getDate() + dealValidFor);

    const newWinning = {
        label: currentWinning.label,
        code: currentWinning.promoCode,
        time: currentDate,
    };

    winnings.push(newWinning);
    localStorage.setItem(STORAGE_KEYS.WINNINGS, JSON.stringify(winnings));

    const oldPrize = document.querySelector('.deals__win-box');

    if (oldPrize) {
        oldPrize.remove();
    }

    setTimeout(() => {
        wheelContainer.insertAdjacentElement(
            'afterend',
            renderNewPrize(newWinning),
        );
        counter.textContent = winnings.length;
        this.disabled = false;
        this.classList.toggle('picker__spin-button--disabled');
    }, TIME.SPIN_TIME);
};

// Event Listeners -------------------------------------------------------------------------------

dealButtons.forEach((dealButton) => {
    dealButton.addEventListener('click', () => {
        dealSection.classList.add('deals--open');
        document.body.classList.add('no-scroll');
        navbarPopup.classList.remove('active');

        if (!localStorage.getItem(STORAGE_KEYS.WINNINGS)) {
            localStorage.setItem(STORAGE_KEYS.WINNINGS, '[]');
        }

        counter.textContent = winnings.length;

        const dealsTabList = dealModal.querySelectorAll('.deal-tab');
        tabNavigationUpdate(dealsTabList);

        if (deals.length === 0) {
            fetchDeals();
        } else {
            fetchRandomDealsForWheel();
            renderWheel();
        }
    });
});

viewPrizeButton.addEventListener('click', () => {
    dealModal.classList.add('hide');
    winningModal.classList.remove('hide');

    renderAllWinnings();

    const unlockedTabList = winningModal.querySelectorAll('.deal-tab');
    tabNavigationUpdate(unlockedTabList);
});

backButton.addEventListener('click', () => {
    winningModal.classList.add('hide');
    dealModal.classList.remove('hide');
    const dealsTabList = dealModal.querySelectorAll('.deal-tab');
    tabNavigationUpdate(dealsTabList);
});

dealsCloseButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        dealSection.classList.remove('deals--open');
        document.body.classList.remove('no-scroll');

        if (!winningModal.classList.contains('hide')) {
            winningModal.classList.add('hide');
            dealModal.classList.remove('hide');
        }
    });
});

spinButton.addEventListener('click', spinButtonEvent);
