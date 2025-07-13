// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // 1. Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
    });

    // 2. Actualizar dinámicamente el año en el footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 3. NAVEGACIÓN ACTIVA CON INTERSECTION OBSERVER (MODERNO Y EFICIENTE)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.4 // 40% de la sección debe estar visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    // Comparamos el data-section del link con el id de la sección
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
    
    // 4. MANEJO DEL FORMULARIO DE DEMO CON FETCH (SIN RECARGAR LA PÁGINA)
    const demoForm = document.getElementById('demo-form');
    const formFeedback = document.getElementById('form-feedback');

    if(demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenimos el envío tradicional

            // Simulación de envío a un backend
            formFeedback.textContent = 'Enviando...';
            formFeedback.className = 'mt-3';
            
            // Aquí iría tu llamada fetch real: fetch('URL_DE_TU_API', { method: 'POST', body: ... })
            // Por ahora, simulamos una respuesta después de 1.5 segundos
            setTimeout(() => {
                const emailInput = demoForm.querySelector('input[type="email"]');
                if (emailInput.value && emailInput.checkValidity()) {
                    formFeedback.textContent = '¡Gracias! Nos pondremos en contacto contigo pronto.';
                    formFeedback.classList.add('success');
                    demoForm.reset();
                } else {
                    formFeedback.textContent = 'Por favor, introduce un nombre y un email válido.';
                    formFeedback.classList.add('error');
                }
            }, 1500);
        });
    }

});