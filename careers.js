document.addEventListener('DOMContentLoaded', () => {
    const jobModal = document.getElementById('job-modal');
    const modalContentArea = document.getElementById('modal-content-area');
    const pageOverlay = document.getElementById('page-overlay');
    let triggeringElement = null;

    // Job Listing Expiry Logic
    const jobListingsContainer = document.getElementById('job-listings-container');
    if (jobListingsContainer) {
        const jobListings = jobListingsContainer.querySelectorAll('.job-listing[data-expiry]');
        const noListingsMessage = document.getElementById('no-listings-message');
        const now = new Date();
        let visibleJobsCount = 0;
        jobListings.forEach(listing => {
            const expiryDateStr = listing.dataset.expiry;
            if (expiryDateStr) {
                const expiryDate = new Date(expiryDateStr);
                if (expiryDate instanceof Date && !isNaN(expiryDate)) {
                    if (expiryDate > now) {
                        visibleJobsCount++;
                    } else {
                        listing.remove();
                    }
                } else {
                    console.warn('Invalid expiry date:', expiryDateStr);
                    visibleJobsCount++;
                }
            } else {
                visibleJobsCount++;
            }
        });
        const remainingListings = jobListingsContainer.querySelectorAll('.job-listing').length;
        if (remainingListings === 0 && noListingsMessage) {
            noListingsMessage.classList.remove('hidden');
        } else if (noListingsMessage) {
            noListingsMessage.classList.add('hidden');
        }
    }

    // Show Modal with Content
    window.showDetail = function (buttonElement, type) {
        const card = buttonElement.closest('.job-listing');
        if (!card) return;

        const contentSelector = (type === 'jd') ? '.job-description-content' : '.apply-form-content';
        const contentElement = card.querySelector(contentSelector);
        if (!contentElement) return;

        triggeringElement = buttonElement;
        const contentClone = contentElement.cloneNode(true);
        contentClone.classList.remove('hidden');
        modalContentArea.innerHTML = '';
        modalContentArea.appendChild(contentClone);

        jobModal.classList.remove('hidden');
        pageOverlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            jobModal.classList.add('visible');
            pageOverlay.classList.add('visible');
        });

        const closeBtn = jobModal.querySelector('.modal-close-btn');
        if (closeBtn) closeBtn.focus();

        document.body.classList.add('popup-open');
    }

    // Hide Modal
    function hideModal() {
        jobModal.classList.remove('visible');
        pageOverlay.classList.remove('visible');
        jobModal.addEventListener('transitionend', () => {
            if (!jobModal.classList.contains('visible')) {
                jobModal.classList.add('hidden');
                modalContentArea.innerHTML = '';
            }
        }, { once: true });
        pageOverlay.addEventListener('transitionend', () => {
            if (!pageOverlay.classList.contains('visible')) {
                pageOverlay.classList.add('hidden');
            }
        }, { once: true });

        document.body.classList.remove('popup-open');
        if (triggeringElement) {
            triggeringElement.focus();
            triggeringElement = null;
        }
    }

    // Event Listeners
    jobModal.querySelector('.modal-close-btn').addEventListener('click', hideModal);
    pageOverlay.addEventListener('click', hideModal);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && jobModal.classList.contains('visible')) {
            hideModal();
        }
    });
});