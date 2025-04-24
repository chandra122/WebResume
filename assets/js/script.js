// Counter Animation
function animateCounter(element, target) {
    let current = 0;
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // Update every 16ms (60fps)
    
    function update() {
        current += step;
        if (current < target) {
            element.textContent = Math.round(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    update();
}

// Intersection Observer for counter animation
const counterSection = document.querySelector('.page-funfact');
const numbers = document.querySelectorAll('.section-counter .number');
let animated = false;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
            numbers.forEach(number => {
                const target = parseInt(number.getAttribute('data-target'));
                number.classList.add('animated');
                animateCounter(number, target);
            });
            animated = true;
        }
    });
}, {
    threshold: 0.5
});

if (counterSection) {
    observer.observe(counterSection);
}

// Parallax Effect
window.addEventListener('scroll', () => {
    const parallaxSections = document.querySelectorAll('.page-funfact');
    
    parallaxSections.forEach(section => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        section.style.backgroundPositionY = `${rate}px`;
    });
}); 