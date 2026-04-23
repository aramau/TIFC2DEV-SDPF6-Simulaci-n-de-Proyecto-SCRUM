/**
 * EL BLOG DE LAS HADAS -
 */

document.addEventListener("DOMContentLoaded", function() {
    // 1. SELECCIÓN DE ELEMENTOS
    const navLinks = document.querySelectorAll('.nav-link');
    const contentDiv = document.getElementById('content');
    const navbarCollapse = document.getElementById('navbarNav');

    /**
     * 2. FUNCIÓN DE CARGA DINÁMICA
     * Trae el contenido de inicio, quienes-somos y contacto sin recargar
     */
    function loadContent(pageUrl) {
        // Efecto de suavizado antes de cargar
        contentDiv.style.opacity = '0';

        fetch(pageUrl)
            .then(response => {
                if (!response.ok) throw new Error('Error al conectar con la cueva: ' + response.statusText);
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newContent = doc.body.innerHTML;
                
                // Para insertar contenido y luego aplicar el efecto de aparición suave
                contentDiv.innerHTML = newContent;
                contentDiv.style.opacity = '1';

                // Asegurar que las imágenes nuevas también sean responsivas
                const images = contentDiv.querySelectorAll('img');
                images.forEach(img => img.classList.add('img-fluid'));
            })
            .catch(error => {
                console.error('Error:', error);
                contentDiv.innerHTML = `
                    <div class="alert alert-danger shadow-sm" role="alert">
                        ¡Vaya! El eco se ha perdido. No pudimos cargar la página.
                    </div>`;
                contentDiv.style.opacity = '1';
            });
    }

    /**
     * 3. CLICS EN LOS ENLACES DE NAVEGACIÓN NAVBAR
     */
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const pageToLoad = this.getAttribute('data-page');

            // Cambiar clase activa visualmente
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Cerrar el menú
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
                bsCollapse.hide();
            }

            loadContent(pageToLoad);
        });
    });

    /**
     * 4. Tarea 6. Manejo de envío del formulario de contacto
     */
    document.addEventListener('submit', function(event) {
        //  Para verificar si el formulario enviado es el de contacto
        if (event.target && event.target.id === 'contactForm') {
            event.preventDefault();

            const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
            
            // Función para crear y mostrar la alerta de que si se envió el mensaje
            const appendAlert = (message, type) => {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = [
                    `<div class="alert alert-${type} alert-dismissible fade show shadow-sm border-0" role="alert">`,
                    `   <div><i class="bi bi-envelope-check-fill me-2"></i>${message}</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('');

                alertPlaceholder.append(wrapper);
            };

            // Ejecuta la alerta
            appendAlert('¡Tu mensaje ha sido entregado! Nosotras sabremos encontrarte.', 'success');

            // Limpia los campos del formulario
            event.target.reset();
        }
    });

    // 5. CARGA INICIAL
    // Se carga el inicio.html por defecto al abrir el sitio
    loadContent('inicio.html');
});