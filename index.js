// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // 1. Inicializar AOS (Animate On Scroll) - Sin cambios
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
    });

    // 2. Actualizar dinámicamente el año en el footer - Sin cambios
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 3. NAVEGACIÓN ACTIVA CON INTERSECTION OBSERVER (CORREGIDO)
    const sections = document.querySelectorAll('section[id]');
    // Seleccionamos solo los enlaces que apuntan a una sección de la misma página
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');

    if (sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.4 
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        // CORRECCIÓN: Comparamos el href del link con el ID de la sección
                        // ej. link.getAttribute('href') es "#nosotros" y '#' + sectionId también es "#nosotros"
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
    
    // 4. MANEJO DE FORMULARIOS REUTILIZABLE (MEJORADO)
    
    /**
     * Función genérica para manejar el envío de formularios de contacto.
     * @param {string} formId - El ID del formulario a manejar.
     * @param {string} feedbackId - El ID del elemento donde se mostrará el feedback.
     */
    const handleContactForm = (formId, feedbackId) => {
        const form = document.getElementById(formId);
        const feedbackEl = document.getElementById(feedbackId);

        // Si el formulario no existe en la página actual, no hacemos nada.
        if (!form || !feedbackEl) {
            return;
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenimos el envío tradicional

            feedbackEl.textContent = 'Enviando...';
            feedbackEl.className = 'mt-3'; // Resetea clases de color
            
            // Simulamos una respuesta después de 1.5 segundos
            setTimeout(() => {
                const nameInput = form.querySelector('input[type="text"]');
                const emailInput = form.querySelector('input[type="email"]');

                // Validación simple
                if (nameInput.value && emailInput.value && emailInput.checkValidity()) {
                    feedbackEl.textContent = '¡Gracias! Nos pondremos en contacto contigo pronto.';
                    feedbackEl.style.color = '#198754'; // Verde de éxito
                    form.reset();
                } else {
                    feedbackEl.textContent = 'Por favor, introduce un nombre y un email válido.';
                    feedbackEl.style.color = '#dc3545'; // Rojo de error
                }
            }, 1500);
        });
    };

    // Aplicamos la función a TODOS los formularios que queramos manejar
    handleContactForm('demo-form', 'form-feedback');               // Para la página principal
    handleContactForm('contact-form-agro', 'form-feedback-agro'); // Para la página de Agro
});