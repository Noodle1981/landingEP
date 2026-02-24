// ==================== INICIO: DOM CONTENT LOADED ====================
document.addEventListener('DOMContentLoaded', function() {

    // ==================== 1. INICIALIZAR AOS (ANIMATE ON SCROLL) ====================
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic',
        delay: 100,
    });

    // ==================== 2. ACTUALIZAR AÑO EN FOOTER ====================
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ==================== 3. EFECTO DE CURSOR PERSONALIZADO ====================
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    const speed = 0.1; // Velocidad de seguimiento del cursor

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursorPosition() {
        // Interpolación suave del cursor
        currentX += (mouseX - currentX) * speed;
        currentY += (mouseY - currentY) * speed;

        // Actualizar CSS custom properties para el efecto de fondo
        const percentX = (currentX / window.innerWidth) * 100;
        const percentY = (currentY / window.innerHeight) * 100;
        document.body.style.setProperty('--mouse-x', `${percentX}%`);
        document.body.style.setProperty('--mouse-y', `${percentY}%`);

        requestAnimationFrame(updateCursorPosition);
    }
    updateCursorPosition();

    // ==================== 4. NAVBAR SCROLL EFFECT ====================
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Agregar clase 'scrolled' cuando se hace scroll
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    }, { passive: true });

    // ==================== 5. NAVEGACIÓN ACTIVA CON INTERSECTION OBSERVER ====================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.section === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ==================== 6. SMOOTH SCROLL PARA LINKS DE NAVEGACIÓN ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Cerrar el menú móvil si está abierto
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    if (navbarToggler) {
                        navbarToggler.click();
                    }
                }
            }
        });
    });

    // ==================== 7. PARALLAX EFFECT EN HERO SECTION ====================
    const heroSection = document.querySelector('.hero-section');
    const dashboardMockup = document.querySelector('.dashboard-mockup');

    if (heroSection && dashboardMockup) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;

            // Efecto parallax en el dashboard
            if (scrolled < heroSection.offsetHeight) {
                dashboardMockup.style.transform = `translateY(${scrolled * parallaxSpeed}px) rotateX(8deg) rotateY(-4deg) rotateZ(1deg)`;
            }
        }, { passive: true });
    }

    // ==================== 8. EFECTO 3D EN DASHBOARD MOCKUP CON MOUSE ====================
    if (dashboardMockup) {
        const mockupWrapper = document.querySelector('.dashboard-mockup-wrapper');

        mockupWrapper.addEventListener('mousemove', (e) => {
            const rect = mockupWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            dashboardMockup.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        mockupWrapper.addEventListener('mouseleave', () => {
            dashboardMockup.style.transform = 'rotateX(8deg) rotateY(-4deg) rotateZ(1deg)';
        });
    }

    // ==================== 9. ANIMACIÓN DE CONTADORES (si tienes números) ====================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = Math.round(target);
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current);
            }
        }, 16);
    }

    // Observar elementos con la clase 'counter' y animarlos cuando entren en vista
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateCounter(entry.target, target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // ==================== 10. MANEJO DEL FORMULARIO DE DEMO ====================
    const demoForm = document.getElementById('demo-form');
    const formFeedback = document.getElementById('form-feedback');

    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nameInput = demoForm.querySelector('input[type="text"]');
            const emailInput = demoForm.querySelector('input[type="email"]');
            const submitButton = demoForm.querySelector('button[type="submit"]');

            // Validación básica
            if (!nameInput.value.trim() || !emailInput.value.trim()) {
                showFormFeedback('Por favor, completa todos los campos.', 'error');
                return;
            }

            if (!isValidEmail(emailInput.value)) {
                showFormFeedback('Por favor, introduce un email válido.', 'error');
                return;
            }

            // Deshabilitar botón y mostrar estado de carga
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';

            // Simular envío (reemplaza esto con tu llamada real a la API)
            setTimeout(() => {
                showFormFeedback('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.', 'success');
                demoForm.reset();

                // Restaurar botón
                submitButton.disabled = false;
                submitButton.textContent = 'Contáctenos';

                // Aquí iría tu código real de envío:
                // fetch('/api/contact', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({
                //         name: nameInput.value,
                //         email: emailInput.value
                //     })
                // })
                // .then(response => response.json())
                // .then(data => {
                //     showFormFeedback('¡Gracias! Te contactaremos pronto.', 'success');
                //     demoForm.reset();
                // })
                // .catch(error => {
                //     showFormFeedback('Hubo un error. Intenta nuevamente.', 'error');
                // })
                // .finally(() => {
                //     submitButton.disabled = false;
                //     submitButton.textContent = 'Contáctenos';
                // });

            }, 1500);
        });
    }

    function showFormFeedback(message, type) {
        formFeedback.textContent = message;
        formFeedback.className = `mt-3 ${type}`;
        formFeedback.style.display = 'block';

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            formFeedback.style.display = 'none';
        }, 5000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ==================== 11. LAZY LOADING PARA IMÁGENES ====================
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('loading' in HTMLImageElement.prototype) {
        // El navegador soporta lazy loading nativo
        images.forEach(img => {
            img.src = img.src;
        });
    } else {
        // Fallback para navegadores que no soportan lazy loading
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // ==================== 12. ANIMACIÓN DE TARJETAS AL HACER HOVER ====================
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Añadir clase para animación extra si es necesario
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // ==================== 13. RIPPLE EFFECT EN BOTONES ====================
    const buttons = document.querySelectorAll('.btn-primary-custom');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: translate(-50%, -50%);
                animation: ripple-animation 0.6s ease-out;
            `;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Agregar animación de ripple al CSS dinámicamente si no existe
    if (!document.querySelector('#ripple-animation-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation-style';
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ==================== 14. PERFORMANCE: REDUCIR ANIMACIONES EN DISPOSITIVOS LENTOS ====================
    // Detectar si el dispositivo tiene recursos limitados
    if (navigator.hardwareConcurrency <= 2) {
        document.body.classList.add('reduce-animations');
    }

    // ==================== 15. SCROLL REVEAL PARA ELEMENTOS ====================
    const revealElements = document.querySelectorAll('.feature-card, .industry-icon');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        revealObserver.observe(element);
    });

    // ==================== 16. PRELOAD DE IMÁGENES CRÍTICAS ====================
    const criticalImages = document.querySelectorAll('.dashboard-mockup img');
    criticalImages.forEach(img => {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = img.src;
        document.head.appendChild(preloadLink);
    });

    // ==================== 17. LOG DE INICIALIZACIÓN ====================
    console.log('%c🚀 Xamanen Landing Page Loaded Successfully!', 'color: #a55b16; font-size: 16px; font-weight: bold;');
    console.log('%c✨ Enhanced with premium animations and interactions', 'color: #5a646a; font-size: 12px;');

}); // FIN DOM CONTENT LOADED

// ==================== FUNCIONES GLOBALES ====================

// Función para agregar clase cuando el elemento es visible
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            element.classList.add('revealed');
        }
    });
}, { passive: true });

// ==================== MANEJO DE ERRORES DE IMÁGENES ====================
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.warn('Failed to load image:', e.target.src);
        // Agregar imagen placeholder si falla la carga
        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
    }
}, true);

// ==================== OPTIMIZACIÓN DE RENDIMIENTO ====================
// Debounce function para eventos que se disparan frecuentemente
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function para limitar la frecuencia de ejecución
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Aplicar debounce al resize
window.addEventListener('resize', debounce(function() {
    // Recalcular dimensiones si es necesario
    AOS.refresh();
}, 250));
