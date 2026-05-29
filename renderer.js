// ============================================================
// renderer.js  —  NAVEGACION Y SIMULACION DE IA
// ============================================================
// Este archivo maneja dos cosas:
//   1) Cambiar entre las pantallas de la app (Resumen,
//      Generador IA, Gestion de Atletas)
//   2) La simulacion del generador de rutinas con IA
//      (todavia no esta conectado a un backend de verdad)
// ============================================================


// ------------------------------------------------------------
// cambiarSeccion(idDeSeccion, botonPresionado)
// ------------------------------------------------------------
// Cambia entre las pantallas de la app.
//
// "idDeSeccion" es el ID del div que queremos mostrar
// (ej: "resumen", "rutinas", "atletas")
//
// "botonPresionado" es el boton del menu que clickeamos
// ------------------------------------------------------------
function cambiarSeccion(idDeSeccion, botonPresionado) {

    // 1) Ocultamos todas las secciones
    var secciones = document.querySelectorAll('.seccion');
    for (var i = 0; i < secciones.length; i++) {
        secciones[i].classList.remove('activa');
    }

    // 2) Mostramos solo la seccion que elegimos
    document.getElementById(idDeSeccion).classList.add('activa');

    // 3) Sacamos el resaltado de todos los botones del menu
    var botones = document.querySelectorAll('.boton-nav');
    for (var i = 0; i < botones.length; i++) {
        botones[i].classList.remove('activo');
    }

    // 4) Resaltamos el boton que apretamos
    botonPresionado.classList.add('activo');
}


// ------------------------------------------------------------
// SIMULACION DEL GENERADOR DE RUTINAS CON IA
// ------------------------------------------------------------
// El boton "Generar con IA" todavia no esta conectado a una
// IA de verdad. Por ahora muestra una respuesta "falsa"
// con un tiempo de espera simulado de 1.5 segundos.
//
// Mas adelante se puede reemplazar esto por una llamada
// a un backend real (ChatGPT, etc).
// ------------------------------------------------------------

var botonIA = document.getElementById('boton-generar');
var resultadoIA = document.getElementById('resultado-ia');

botonIA.addEventListener('click', function () {

    // Mostramos el cartel de "cargando..."
    resultadoIA.style.display = 'block';
    resultadoIA.innerHTML = '<p style="color: #f9e2af;">Consultando a la IA...</p>';

    // Despues de 1.5 segundos, mostramos la respuesta falsa
    setTimeout(function () {
        resultadoIA.innerHTML =
            '<h4 style="color: #a6e3a1; margin-top: 0;">Circuito generado (Enfasis en Tiron):</h4>' +
            '<ul style="line-height: 1.8;">' +
                '<li>4x8 Dominadas estrictas (Pull-ups)</li>' +
                '<li>4x10 Remos Australianos</li>' +
                '<li>3x Fallo: Aguante isometrico en barra</li>' +
                '<li>3x15 Elevaciones de rodillas a la barra</li>' +
            '</ul>' +
            '<p style="font-size: 12px; color: #6c7086;">*Aca conectaras el backend real*</p>';
    }, 1500);
});
