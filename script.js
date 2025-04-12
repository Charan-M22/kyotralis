document.addEventListener('DOMContentLoaded', () => {
    // --- Variables ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const mobileNavLinks = document.querySelectorAll('.nav-link-mobile');
    const desktopNavLinks = document.querySelectorAll('.nav-link-indicator');
    const navbar = document.querySelector('.navbar');
    const sectionsToObserve = document.querySelectorAll('.main-section[id], .footer[id]');
    const snapSections = document.querySelectorAll('.main-section[id]');

    // --- Mobile Menu Logic ---
    const toggleMenu = () => {
        const isMenuOpen = !mobileMenu.classList.contains('hidden');
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';

        // Toggle visibility classes
        mobileMenu.classList.toggle('hidden');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');

        // Update ARIA attribute for accessibility
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);

        // Toggle body scroll lock class
        if (mobileMenu.classList.contains('hidden')) {
             // Menu is now hidden
             document.body.classList.remove('mobile-menu-open');
        } else {
             // Menu is now visible
             document.body.classList.add('mobile-menu-open');
        }
    };

    // --- Ensure the event listener setup is correct ---
    if (mobileMenuButton && mobileMenu && menuIcon && closeIcon) {
        mobileMenuButton.addEventListener('click', toggleMenu);
    }

    // --- Add listener to close menu when a link is clicked ---
    if (mobileNavLinks.length > 0) {
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Only close if the menu is actually open
                if (!mobileMenu.classList.contains('hidden')) {
                    toggleMenu();
                }
                // Smooth scroll is handled by the separate anchor link listener
            });
        });
    }

    // --- Smooth Scrolling for Nav Links ---
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const navbarHeight = navbar?.offsetHeight || 64;

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    let targetPosition = targetElement.offsetTop;
                    const offsetPosition = targetPosition - navbarHeight;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                    if (!mobileMenu.classList.contains('hidden')) toggleMenu();
                }
            }
        });
    });

    // --- Navbar Active Link Indicator (REVISED LOGIC) ---
    const activateNavLink = (sectionId) => {
        const currentSectionId = sectionId || 'hero';
        // console.log("Activating Nav for:", currentSectionId); // Debugging
        desktopNavLinks.forEach(link => {
            link.classList.remove('active');
            const linkSection = link.dataset.section || link.getAttribute('href')?.substring(1);
            if (linkSection === currentSectionId) {
                link.classList.add('active');
            }
        });
    };

    // Revised Observer Options: Defines a thin line just below the navbar.
    // When a section's top edge enters this zone, it's considered active.
    const observerOptionsNavRevised = {
        root: null,
        // rootMargin Top: Negative navbar height (start observing just below navbar)
        // rootMargin Bottom: Calculates a value far enough down so only the top edge crossing matters.
        // (Viewport Height - Navbar Height - 1px) makes the bottom margin effectively just 1px below the navbar.
        rootMargin: `-${navbarHeight}px 0px -${window.innerHeight - navbarHeight - 1}px 0px`,
        threshold: 0 // Trigger as soon as the 1px line is crossed
    };

    let lastActiveSectionId = null; // Track the last definitively active section

    const sectionObserverNavRevised = new IntersectionObserver((entries) => {
        let currentlyActiveSection = null;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If multiple sections intersect this thin line (unlikely but possible during fast scroll/snap),
                // we might take the first one reported, or refine later if needed.
                currentlyActiveSection = entry.target.id;
            }
        });

        // If the observer reports an intersecting section, use it.
        if (currentlyActiveSection) {
            activateNavLink(currentlyActiveSection);
            lastActiveSectionId = currentlyActiveSection;
        }
        // If observer reports NO intersection (scrolled between sections or past the last one),
        // potentially keep the last known active section highlighted, OR default based on scroll position.
        // For snap scrolling, keeping the last active often feels right until the next snap completes.
        else if (lastActiveSectionId) {
            // Optional: you could add a check here based on scrollY if keeping last active feels wrong.
            // e.g., if scrollY is very near 0, force 'hero'.
            if (window.scrollY < 100) {
                activateNavLink('hero');
                lastActiveSectionId = 'hero';
            } else {
                activateNavLink(lastActiveSectionId); // Keep last known section active
            }
        } else if (window.scrollY < 100) {
            // Fallback for initial load near top
            activateNavLink('hero');
            lastActiveSectionId = 'hero';
        }

    }, observerOptionsNavRevised); // Use the revised options

    sectionsToObserve.forEach(section => {
        if (section.id) sectionObserverNavRevised.observe(section); // Observe using the new observer
    });

    // Initial check on load (can likely be simplified or rely on observer firing)
    // Let observer handle initial state if possible, otherwise use fallback:
    setTimeout(() => {
        if (!lastActiveSectionId) { // If observer didn't fire quickly on load
            let initialSectionId = 'hero';
            for (const section of snapSections) {
                const rect = section.getBoundingClientRect();
                if ((rect.top >= navbarHeight && rect.top < window.innerHeight / 2) ||
                    (rect.top < navbarHeight && rect.bottom > navbarHeight + 50)) {
                    initialSectionId = section.id;
                    break;
                }
            }
            activateNavLink(initialSectionId);
            lastActiveSectionId = initialSectionId;
        }
    }, 100); // Short delay to allow observer to fire first


    // --- Scroll Animations for elements WITHIN sections ---
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const observerOptionsAnimate = { root: null, rootMargin: '0px 0px -15% 0px', threshold: 0.1 };
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Optional: Animate only once
            } else { if (entry.boundingClientRect.bottom < 0) { /* Optional Reset */ } }
        });
    }, observerOptionsAnimate);
    elementsToAnimate.forEach(el => animationObserver.observe(el));

    // --- Phrase Slideshow Logic (Unchanged from previous) ---
    const phraseSlider = document.getElementById('phrase-slider');
    const phraseContainer = document.querySelector('.animated-phrases-container');
    if (phraseSlider && phraseContainer) {
        const phrases = phraseSlider.querySelectorAll('.phrase-item');
        const phraseCount = phrases.length;
        let currentPhraseIndex = 0; let phraseItemHeight = 0; let intervalId = null;
        const calculateHeight = () => { if (phrases.length > 0) phraseItemHeight = phrases[0].offsetHeight; };
        const slideToPhrase = (index) => { if (phraseItemHeight > 0) phraseSlider.style.transform = `translateY(${-index * phraseItemHeight}px)`; };
        const nextPhrase = () => { currentPhraseIndex = (currentPhraseIndex + 1) % phraseCount; slideToPhrase(currentPhraseIndex); };
        const startSlideshow = () => { if (intervalId) clearInterval(intervalId); calculateHeight(); if (phraseItemHeight === 0) { setTimeout(() => { calculateHeight(); if (phraseItemHeight === 0) { console.warn("Phrase height 0"); return; } proceedWithSlideshow(); }, 200); } else { proceedWithSlideshow(); } };
        const proceedWithSlideshow = () => { const currentTransition = phraseSlider.style.transition; phraseSlider.style.transition = 'none'; slideToPhrase(currentPhraseIndex); phraseSlider.offsetHeight; phraseSlider.style.transition = currentTransition; const slideInterval = 3200; const initialDelay = 600; setTimeout(() => { nextPhrase(); intervalId = setInterval(nextPhrase, slideInterval); }, initialDelay); };
        const containerAnimDelay = parseFloat(getComputedStyle(phraseContainer).getPropertyValue('--animation-delay') || '0s') * 1000; const containerAnimDuration = 800;
        setTimeout(startSlideshow, containerAnimDelay + containerAnimDuration);
    }

    // --- Video Play Logic (Unchanged) ---
    const video1 = document.getElementById('video1');
    if (video1) { video1.loop = true; video1.play().catch(e => { console.error("Vid play fail:", e); }); }

    // --- Update Footer Year (Unchanged) ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }
});