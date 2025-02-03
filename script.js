document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        menuButton: document.querySelector('.menu-button'),
        logo: document.querySelector('.nav__logo svg'),
        navLinks: document.querySelector('.nav__links'),
        bannerWrapper: document.querySelector('.banner__wrapper'),
        slides: document.querySelectorAll('.banner__content'),
        indicators: document.querySelectorAll('.indicator'),
        servicesListItem: document.querySelector('.nav__links li:nth-child(3)'),
        serviceDropdown: document.querySelector('.services-dropdown'),
        navbar: document.querySelector('.sticky-nav'),
        navContainer: document.querySelector('.nav-container'),
        closeServiceButton: document.querySelector('.close-services')
    };

    if (Object.values(elements).some(el => !el || (NodeList.prototype.isPrototypeOf(el) && !el.length))) {
        console.error('One or more elements not found');
        return;
    }

    const { menuButton, logo, navLinks, bannerWrapper, slides, indicators, servicesListItem, serviceDropdown, navbar, navContainer, closeServiceButton } = elements;

    const backgrounds = [
        "url('./assets/images/homeslide1.png')",
        "url('./assets/images/homeslide2.png')"
    ];

    let currentIndex = 0;
    const totalSlides = slides.length;
    let interval;

    const toggleClass = (element, className) => {
        element.classList.toggle(className);
    };

    // Show specific slide based on index
    const showSlide = (index) => {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            indicators[i].classList.toggle('active', i === index);
        });
        bannerWrapper.style.backgroundImage = backgrounds[index];
    };

    // Show next slide
    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    };

    // Start auto slide transition
    const startAutoSlide = () => {
        interval = setInterval(nextSlide, 10000);
    };

    // Stop auto slide transition
    const stopAutoSlide = () => {
        clearInterval(interval);
    };

    // Optimized debounce function
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // Handle navbar color change on scroll
    const handleScroll = () => {
        const isServicesActive = servicesListItem.classList.contains('active');
        const isScrolled = !isServicesActive && window.innerWidth > 768 && window.scrollY > (navbar.offsetHeight / 2);
        navbar.style.backgroundColor = isScrolled ? 'transparent' : '';
        navbar.style.color = isScrolled ? 'white' : '';
        logo.style.fill = isScrolled ? 'white' : '';
    };

    // Use debounced scroll handler
    const debouncedHandleScroll = debounce(handleScroll, 10);

    // Menu button click handler
    menuButton.addEventListener('click', () => {
        toggleClass(menuButton, 'active');
        toggleClass(navLinks, 'active');
        toggleClass(navContainer, 'active');
        if (!menuButton.classList.contains('active')) {
            navLinks.classList.remove('active');
            serviceDropdown.classList.remove('active');
            servicesListItem.classList.remove('active');
            navLinks.style.left = '0';
        }
    });

    // Close services dropdown
    closeServiceButton.addEventListener('click', () => {
        toggleClass(serviceDropdown, 'active');
        toggleClass(servicesListItem, 'active');
        navLinks.style.left = '0';
    });

    // Scroll event listener (with passive true for performance)
    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });

    // Handle clicks in navLinks
    navLinks.addEventListener('click', (event) => {
        const clickedElement = event.target.closest('li');
        if (!clickedElement) return;

        if (clickedElement === servicesListItem) {
            event.preventDefault();
            debouncedHandleScroll();
            const isActive = servicesListItem.classList.toggle('active');
            serviceDropdown.classList.toggle('active', isActive);
            navLinks.style.left = isActive ? '' : '-100vw';
        } else {
            servicesListItem.classList.remove('active');
            serviceDropdown.classList.remove('active');
            navLinks.style.left = '';
        }
    });

    // Window resize handler (close all open menus)
    window.addEventListener('resize', () => {
        navLinks.classList.remove('active');
        serviceDropdown.classList.remove('active');
        servicesListItem.classList.remove('active');
        menuButton.classList.remove('active');
        navLinks.style.left = '';
    });

    // Indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            showSlide(currentIndex);
        });
    });

    // Hover effects to stop/start auto slide
    bannerWrapper.addEventListener('mouseenter', stopAutoSlide);
    bannerWrapper.addEventListener('mouseleave', startAutoSlide);

    // Initialize
    showSlide(currentIndex);
    startAutoSlide();
});
