// Image scroll parallax effect
document.addEventListener('DOMContentLoaded', function() {
    const homeSection = document.getElementById('home');
    
    if (homeSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            
            // Create parallax effect
            homeSection.style.backgroundPositionY = `${rate}px`;
        });
    }
    
    // Add animation classes for elements
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = (elementTop < window.innerHeight) && (elementBottom >= 0);
            
            if (isVisible) {
                element.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
}); 