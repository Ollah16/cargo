document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        menuButton: document.querySelector('.menu-button'),
        navLinks: document.querySelector('.nav__links'),
        bannerWrapper: document.querySelector('.banner__wrapper'),
        slides: document.querySelectorAll('.banner__content'),
        indicators: document.querySelectorAll('.indicator'),
        servicesListItem: document.querySelector('.nav__links li:nth-child(3)'),
        serviceDropdown: document.querySelector('.services-dropdown'),
        navContainer: document.querySelector('.nav-container'),
        closeServiceDropdown: document.querySelector('.close-services')
    };

    if (Object.values(elements).some(el => !el || (NodeList.prototype.isPrototypeOf(el) && !el.length))) {
        console.error('One or more elements not found');
        return;
    }

    const { menuButton, navLinks, bannerWrapper, slides, indicators, servicesListItem, serviceDropdown, navContainer, closeServiceDropdown } = elements;

    const backgrounds = [
        "url('./assets/images/homeslide1.png')",
        "url('./assets/images/homeslide2.png')"
    ];

    let currentIndex = 0;
    const totalSlides = slides.length;
    let interval;

    const toggleClass = (element, className, force) => element.classList.toggle(className, force);

    const showSlide = (index) => {
        slides.forEach((slide, i) => {
            toggleClass(slide, 'active', i === index)
            toggleClass(indicators[i], 'active', i === index)
        });
        bannerWrapper.style.backgroundImage = backgrounds[index];
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    };

    const startAutoSlide = () => {
        interval = setInterval(nextSlide, 10000);
    };

    const stopAutoSlide = () => {
        clearInterval(interval);
    };

    // Toggles the navigation links on mobile
    menuButton.addEventListener('click', () => {
        const isActive = toggleClass(menuButton, 'active');
        toggleClass(navLinks, 'active', isActive);
        toggleClass(navContainer, 'active', isActive);

        if (!isActive) {
            toggleClass(serviceDropdown, 'active', isActive);
            toggleClass(servicesListItem, 'active', isActive);
            navLinks.style.left = '0';
        }
    });

    // Toggles the service dropdown menu
    servicesListItem.addEventListener('click', (event) => {
        event.preventDefault();
        const isServiceActive = toggleClass(servicesListItem, 'active');
        toggleClass(serviceDropdown, 'active', isServiceActive);
        navLinks.style.left = isServiceActive && window.innerWidth < 769 ? '-100vw' : '0';
    });

    // Closes the service dropdown when the mouse leaves on desktop
    serviceDropdown.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 769) {
            toggleClass(serviceDropdown, 'active', false);
            toggleClass(servicesListItem, 'active', false);
        }
    });

    // Closes the service dropdown menu on mobile
    closeServiceDropdown.addEventListener('click', () => {
        toggleClass(serviceDropdown, 'active', false);
        toggleClass(servicesListItem, 'active', false);
        navLinks.style.left = '0';
    });

    window.addEventListener('resize', () => {
        toggleClass(navLinks, 'active', false);
        toggleClass(serviceDropdown, 'active', false);
        toggleClass(servicesListItem, 'active', false);
        toggleClass(menuButton, 'active', false);
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            showSlide(currentIndex);
        });
    });

    bannerWrapper.addEventListener('mouseenter', stopAutoSlide);
    bannerWrapper.addEventListener('mouseleave', startAutoSlide);

    showSlide(currentIndex);
    startAutoSlide();
});
