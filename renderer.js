// ==========================================
// LÓGICA DE NAVEGACIÓN (Cambio de pantallas)
// ==========================================

/**
 * Función para cambiar entre las diferentes interfaces de la aplicación.
 * @param {string} idDeSeccion - El ID del elemento HTML que queremos mostrar.
 * @param {HTMLElement} botonPresionado - El botón que el usuario acaba de clickear en el menú.
 */
function cambiarSeccion(idDeSeccion, botonPresionado) {
    
    // 1. Buscamos todas las secciones del HTML y las ocultamos quitándoles la clase 'activa'
    const todasLasSecciones = document.querySelectorAll('.seccion');
    todasLasSecciones.forEach(seccionActual => {
        seccionActual.classList.remove('activa');
    });
    // probando el commit desde la rama de desarrollo
    // 2. Buscamos la sección específica que el usuario quiere ver y le ponemos la clase 'activa'
    const seccionAMostrar = document.getElementById(idDeSeccion);
    seccionAMostrar.classList.add('activa');

    // 3. Buscamos todos los botones del menú lateral y les quitamos la clase 'activo'
    const todosLosBotones = document.querySelectorAll('.boton-nav');
    todosLosBotones.forEach(botonActual => {
        botonActual.classList.remove('activo');
    });

    // 4. Resaltamos visualmente el botón que el usuario acaba de presionar
    botonPresionado.classList.add('activo');
}


// ==========================================
// LÓGICA DE LA IA (Simulación del Frontend)
// ==========================================

// Obtenemos los elementos del HTML con los que vamos a interactuar
const botonGenerarRutina = document.getElementById('boton-generar');
const contenedorResultadoIA = document.getElementById('resultado-ia');

// Escuchamos el evento de clic en el botón de la IA
botonGenerarRutina.addEventListener('click', () => {
    
    // Mostramos el contenedor y ponemos un mensaje de espera (simulando que la red está cargando)
    contenedorResultadoIA.style.display = 'block';
    contenedorResultadoIA.innerHTML = '<p style="color: #f9e2af;">Consultando a la IA...</p>';

    // Usamos setTimeout para simular el tiempo que tardaría tu backend en responder (ej. 1.5 segundos)
    setTimeout(() => {
        
        // Reemplazamos el mensaje de carga con la respuesta simulada
        contenedorResultadoIA.innerHTML = `
            <h4 style="color: #a6e3a1; margin-top: 0;">Circuito generado (Énfasis en Tirón):</h4>
            <ul style="line-height: 1.8;">
                <li>4x8 Dominadas estrictas (Pull-ups)</li>
                <li>4x10 Remos Australianos</li>
                <li>3x Fallo: Aguante isométrico en barra</li>
                <li>3x15 Elevaciones de rodillas a la barra</li>
            </ul>
            <p style="font-size: 12px; color: #6c7086;">
                *Aquí es donde conectarás tu backend para inyectar la respuesta real del modelo.*
            </p>
        `;
    }, 1500); // 1500 milisegundos = 1.5 segundos
});