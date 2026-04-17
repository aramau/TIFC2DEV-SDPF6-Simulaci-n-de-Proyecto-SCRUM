document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentDiv = document.getElementById('content');

    // Función para cargar contenido de forma asíncrona
    function loadContent(pageUrl) {
        fetch(pageUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar la página: ' + response.statusText);
                }
                return response.text();
            })
            .then(html => {
                // Cargar solo el contenido dentro de <body> de la página solicitada
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newContent = doc.body.innerHTML;
                contentDiv.innerHTML = newContent;
            })
            .catch(error => {
                console.error('Error al cargar contenido:', error);
                contentDiv.innerHTML = '<p>Error al cargar el contenido.</p>';
            });
    }

    // Agregar evento de clic a cada enlace de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Evitar el comportamiento predeterminado del enlace
            const pageToLoad = this.getAttribute('data-page');
            loadContent(pageToLoad);
        });
    });

    // Cargar la página de "Inicio" por defecto al cargar el sitio
    loadContent('inicio.html');
});