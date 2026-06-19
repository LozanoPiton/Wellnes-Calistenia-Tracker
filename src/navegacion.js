// ============================================================
// navegacion.js  —  CAMBIO ENTRE SECCIONES
// ============================================================
// Depende de: progresiones.js (mostrarCatalogo, poblarSelectEjercicios),
//             historial.js (refrescarHistorial),
//             plan-semanal.js (refrescarPlanSemanal)
// ============================================================

function cambiarSeccion(idDeSeccion, botonPresionado) {
  // Oculta todas las secciones
  var secciones = document.querySelectorAll(".seccion");
  for (var i = 0; i < secciones.length; i++) {
    secciones[i].classList.remove("activa");
  }

  // Muestra la seccion elegida
  document.getElementById(idDeSeccion).classList.add("activa");

  // Desactiva todos los botones de navegacion
  var botones = document.querySelectorAll(".boton-nav");
  for (var i = 0; i < botones.length; i++) {
    botones[i].classList.remove("activo");
  }

  // Activa el boton presionado
  botonPresionado.classList.add("activo");

  // Renderiza el contenido segun la seccion
  if (idDeSeccion === "catalogo") {
    mostrarCatalogo();
  }
  if (idDeSeccion === "entrenar") {
    poblarSelectEjercicios();
  }
  if (idDeSeccion === "progreso" || idDeSeccion === "inicio") {
    refrescarHistorial();
  }
  if (idDeSeccion === "progreso") {
    // Auto-analisis al entrar a Progreso
    if (typeof ejecutarAnalisisIA === "function") {
      setTimeout(ejecutarAnalisisIA, 100);
    }
  }
  if (idDeSeccion === "inicio") {
    refrescarPlanSemanal();
  }
}
