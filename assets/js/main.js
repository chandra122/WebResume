// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.vg-page[id]');
    
    // Color selector functionality
    const colorSelector = document.querySelector('.color-selector select');
    const homeSection = document.getElementById('home');
    
    const gradients = {
        'blue': 'linear-gradient(135deg, #4CA1AF, #2C3E50)',
        'red': 'linear-gradient(135deg, #ff416c, #ff4b2b)',
        'green': 'linear-gradient(135deg, #56ab2f, #a8e063)'
    };
    
    if (colorSelector) {
        colorSelector.addEventListener('change', function() {
            const selectedColor = this.value;
            if (gradients[selectedColor]) {
                homeSection.style.background = gradients[selectedColor];
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Function to update active section
    function updateActiveSection() {
        // Get current scroll position
        const scrollPosition = window.scrollY;
        
        // Find the current section
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight - 10;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            // Check if we're in this section
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section's link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Update active section on scroll
    window.addEventListener('scroll', updateActiveSection);
    
    // Update active section on page load
    updateActiveSection();

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offset = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // LinkedIn Authentication
    const linkedinAuth = document.getElementById('linkedinAuth');
    if (linkedinAuth) {
        linkedinAuth.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('http://localhost:3001/auth/linkedin');
                const data = await response.json();
                
                if (data.profile) {
                    // Update profile summary
                    const summaryElement = document.querySelector('.about-content p');
                    if (summaryElement && data.summary) {
                        summaryElement.textContent = data.summary;
                    }
                    
                    alert('LinkedIn profile connected successfully!');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to connect with LinkedIn');
            }
        });
    }

    // Add animation classes on scroll
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

    // Counter Animation
    const counters = document.querySelectorAll('.counter-item .number');
    const speed = 200; // The lower the slower

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(() => animateCounter(counter), 1);
        } else {
            counter.innerText = target;
        }
    }

    const startCounterAnimation = () => {
        counters.forEach(counter => {
            counter.innerText = '0';
            animateCounter(counter);
        });
    }

    // Start counter animation when the section is in view
    const funFactSection = document.querySelector('.page-funfact');
    if (funFactSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounterAnimation();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(funFactSection);
    }
}); 