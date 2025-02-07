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
        closeServiceDropdown: document.querySelector('.close-services'),
        menuBar: document.querySelectorAll('.menu-bar')
    };

    if (Object.values(elements).some(el => !el || (NodeList.prototype.isPrototypeOf(el) && !el.length))) {
        console.error('One or more elements not found');
        return;
    }

    const { menuButton, menuBar, logo, navLinks, bannerWrapper, slides, indicators, servicesListItem, serviceDropdown, navbar, navContainer, closeServiceDropdown } = elements;

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

    // Optimized debounce function
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const handleScroll = () => {
        if (servicesListItem.classList.contains('active') || menuButton.classList.contains('active')) return;

        const isScrolled = window.scrollY > 0;
        navbar.style.backgroundColor = isScrolled ? 'white' : 'transparent';
        navbar.style.color = isScrolled ? '#05172D' : '#FFFFFF';

        menuBar.forEach(bar => {
            bar.style.backgroundColor = isScrolled ? '#05172D' : 'white';
        });

        logo.style.fill = isScrolled ? '#05172D' : '#FFFFFF';
    };

    // Use debounced scroll handler
    const debouncedHandleScroll = debounce(handleScroll, 10);

    // Scroll event listener (with passive true for performance)
    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });

    // Toggles the navigation links on mobile
    menuButton.addEventListener('click', () => {
        const isActive = toggleClass(menuButton, 'active');
        toggleClass(navLinks, 'active', isActive);
        toggleClass(navContainer, 'active', isActive);


        navbar.style.position = isActive ? 'sticky' : '';
        navbar.style.backgroundColor = isActive ? 'white' : 'transparent';
        navbar.style.color = isActive ? '#05172D' : '#FFFFFF';
        navbar.style.borderBottom = isActive ? '0.0625rem' : '0';

        menuBar.forEach(bar => {
            bar.style.backgroundColor = isActive ? '#05172D' : 'white';
        });

        logo.style.fill = isActive ? '#05172D' : '#FFFFFF';

        if (!isActive) {
            toggleClass(serviceDropdown, 'active', false);
            toggleClass(servicesListItem, 'active', false);
            navLinks.style.left = '0';
        }
        debouncedHandleScroll()
    });

    // Toggles the service dropdown menu
    servicesListItem.addEventListener('click', (event) => {
        event.preventDefault();

        const isServiceActive = toggleClass(servicesListItem, 'active');
        toggleClass(serviceDropdown, 'active', isServiceActive);

        const isDesktop = window.innerWidth > 769;

        navbar.style.backgroundColor = isServiceActive ? 'white' : '';
        navbar.style.color = isServiceActive ? '#05172D' : '';

        logo.style.fill = isServiceActive ? '#05172D' : '';
        navLinks.style.left = isServiceActive && !isDesktop ? '-100vw' : '0';
        debouncedHandleScroll()
    });

    // Closes the service dropdown when the mouse leaves on desktop
    serviceDropdown.addEventListener('mouseleave', () => {
        if (window.innerWidth > 769) {
            toggleClass(serviceDropdown, 'active', false);
            toggleClass(servicesListItem, 'active', false);

            const isScrolled = window.scrollY > 0;
            Object.assign(navbar.style, {
                backgroundColor: isScrolled ? 'white' : '',
                color: isScrolled ? '#05172D' : '',
            });

            logo.style.fill = isScrolled ? '#05172D' : '';
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
