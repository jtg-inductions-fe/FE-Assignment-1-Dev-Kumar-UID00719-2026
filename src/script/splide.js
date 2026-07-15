import '@splidejs/splide/css';
import Splide from '@splidejs/splide';
import profilePic from '../../assets/profile-pic/user-profile.webp';

const reviewContainer = document.querySelector('.splide__list');

const reviews = [
    {
        name: 'Will Smith',
        interest: 'Travel Enthusiast',
        image: profilePic,
        rating: 5,
        description:
            'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.',
    },
    {
        name: 'Vladmir Putin',
        interest: 'Politics',
        image: profilePic,
        rating: 3,
        description:
            'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.',
    },
    {
        name: 'Nicolas Cage',
        interest: 'Movies',
        image: profilePic,
        rating: 4,
        description:
            'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.',
    },
];

/**
 * Renders all review cards inside the review container.
 */
const renderReviews = () => {
    const fragment = document.createDocumentFragment();

    reviews.forEach((review) => {
        const { name, interest, image, rating, description } = review;
        const reviewCard = document.createElement('li');
        reviewCard.classList.add('splide__slide');

        reviewCard.innerHTML = `
            <div class="review">
                <div class="review__profile-pic">
                    <img
                        class="review__profile-img"
                        src="${image}"
                        alt="reviewer profile picture"
                    />
                </div>
                <div class="review__detail">
                    <div class="review__reviewer-info">
                        <span class="review__reviewer-name">
                            ${name}
                        </span>
                        <span class="review__reviewer-interest">
                            / ${interest}
                        </span>
                    </div>
                    <div class="review__stars">
                        ${'<span class="icon-star-5 review__star"></span>'.repeat(rating)}
                    </div>
                </div>
                <p class="review__description">
                    ${description}
                </p>
            </div>
        `;

        fragment.appendChild(reviewCard);
    });
    reviewContainer.appendChild(fragment);
};

renderReviews();

new Splide('.splide', {
    type: 'loop',
    perPage: 1,
    arrows: true,
}).mount();
