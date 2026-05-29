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
  var secciones = document.querySelectorAll(".seccion");
  for (var i = 0; i < secciones.length; i++) {
    secciones[i].classList.remove("activa");
  }

  // 2) Mostramos solo la seccion que elegimos
  document.getElementById(idDeSeccion).classList.add("activa");

  // 3) Sacamos el resaltado de todos los botones del menu
  var botones = document.querySelectorAll(".boton-nav");
  for (var i = 0; i < botones.length; i++) {
    botones[i].classList.remove("activo");
  }

  // 4) Resaltamos el boton que apretamos
  botonPresionado.classList.add("activo");
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

var botonIA = document.getElementById("boton-generar");
var resultadoIA = document.getElementById("resultado-ia");

botonIA.addEventListener("click", function () {
  // Mostramos el cartel de "cargando..."
  resultadoIA.style.display = "block";
  resultadoIA.innerHTML =
    '<p style="color: #f9e2af;">Consultando a la IA...</p>';

  // Despues de 1.5 segundos, mostramos la respuesta falsa
  setTimeout(function () {
    resultadoIA.innerHTML =
      '<h4 style="color: #a6e3a1; margin-top: 0;">Circuito generado (Enfasis en Tiron):</h4>' +
      '<ul style="line-height: 1.8;">' +
      "<li>4x8 Dominadas estrictas (Pull-ups)</li>" +
      "<li>4x10 Remos Australianos</li>" +
      "<li>3x Fallo: Aguante isometrico en barra</li>" +
      "<li>3x15 Elevaciones de rodillas a la barra</li>" +
      "</ul>" +
      '<p style="font-size: 12px; color: #6c7086;">*Aca conectaras el backend real*</p>';
  }, 1500);
});

// ============================================================
// SISTEMA INTERNACIONAL DE IDIOMAS (i18n) - TRADUCCIÓN GLOBAL
// ============================================================

const diccionarioIdiomas = {
  es: {
    // Menú Lateral
    resumen: "Resumen",
    generador: "Generador IA",
    gestion: "Gestion de Atletas",
    btnCambiarUser: "🔄 Cambiar usuario",

    // Pantalla Principal (Resumen)
    bienvenida: "Bienvenido de vuelta",
    tituloRegistro: "🏋️ Registrar Nuevo Ejercicio",
    lblNombre: "Nombre del Ejercicio:",
    placeholderNombre: "Ej. Dominadas, Fondos, Flexiones",
    lblGrupo: "Grupo Muscular:",
    lblDificultad: "Dificultad:",
    lblSeries: "Series:",
    lblReps: "Repeticiones:",
    btnGuardar: "💾 Guardar en Rutina IA",

    // Opciones de Desplegables
    pecho: "Pecho (Empuje)",
    espalda: "Espalda (Tirón)",
    piernas: "Piernas",
    hombros: "Hombros",
    core: "Core / Abdomen",
    principiante: "Principiante",
    intermedio: "Intermedio",
    avanzado: "Avanzado",

    // SECCIÓN: Generador IA
    iaTituloSec: "Generador de Rutinas IA",
    iaTituloTar: "Crear rutina personalizada",
    iaDesc:
      "Selecciona el nivel y el grupo muscular para que la IA genere el circuito.",
    iaOptPrinc: "Principiante",
    iaOptInter: "Intermedio",
    iaOptAvanz: "Avanzado (Front Lever, Muscle Up)",
    iaBtnGenerar: "Generar con IA",

    // SECCIÓN: Gestión de Atletas
    atletasTituloSec: "Gestion de Atletas",
    atletasTituloTar: "Listado",
    atletasDesc:
      "Interfaz lista para que construyas tu tabla de usuarios, conectes el backend y manejes perfiles, pesos y progresiones.",
  },
  en: {
    // Menú Lateral
    resumen: "Summary",
    generador: "AI Generator",
    gestion: "Athlete Management",
    btnCambiarUser: "🔄 Change user",

    // Pantalla Principal (Resumen)
    bienvenida: "Welcome back",
    tituloRegistro: "🏋️ Register New Exercise",
    lblNombre: "Exercise Name:",
    placeholderNombre: "Ex. Pull-ups, Dips, Push-ups",
    lblGrupo: "Muscle Group:",
    lblDificultad: "Difficulty:",
    lblSeries: "Sets:",
    lblReps: "Repetitions:",
    btnGuardar: "💾 Save to AI Routine",

    // Opciones de Desplegables
    pecho: "Chest (Push)",
    espalda: "Back (Pull)",
    piernas: "Legs",
    hombros: "Shoulders",
    core: "Core / Abs",
    principiante: "Beginner",
    intermedio: "Intermediate",
    avanzado: "Advanced",

    // SECCIÓN: Generador IA
    iaTituloSec: "AI Routine Generator",
    iaTituloTar: "Create Personalized Routine",
    iaDesc:
      "Select the level and muscle group to let the AI generate the circuit.",
    iaOptPrinc: "Beginner",
    iaOptInter: "Intermediate",
    iaOptAvanz: "Advanced (Front Lever, Muscle Up)",
    iaBtnGenerar: "Generate with AI",

    // SECCIÓN: Gestión de Atletas
    atletasTituloSec: "Athlete Management",
    atletasTituloTar: "List",
    atletasDesc:
      "Interface ready for you to build your user table, connect the backend and manage profiles, weights and progressions.",
  },
};

function aplicarTraduccion() {
  const selectorDeIdioma = document.getElementById("select-lang");
  if (!selectorDeIdioma) return;

  const idiomaElegido = selectorDeIdioma.value;
  const palabras = diccionarioIdiomas[idiomaElegido];

  // 1. Traducir Menú Lateral e Inferior
  if (document.getElementById("menu-resumen"))
    document.getElementById("menu-resumen").innerText = palabras.resumen;
  if (document.getElementById("menu-generador"))
    document.getElementById("menu-generador").innerText = palabras.generador;
  if (document.getElementById("menu-gestion"))
    document.getElementById("menu-gestion").innerText = palabras.gestion;
  if (document.getElementById("btn-cambiar-usuario"))
    document.getElementById("btn-cambiar-usuario").innerText =
      palabras.btnCambiarUser;

  // 2. Traducir Contenido de la Pantalla Resumen y Formulario
  if (document.getElementById("txt-bienvenida"))
    document.getElementById("txt-bienvenida").innerText = palabras.bienvenida;
  if (document.getElementById("titulo-registro"))
    document.getElementById("titulo-registro").innerText =
      palabras.tituloRegistro;
  if (document.getElementById("lbl-nombre-ejercicio"))
    document.getElementById("lbl-nombre-ejercicio").innerText =
      palabras.lblNombre;
  if (document.getElementById("nombreEjercicio"))
    document.getElementById("nombreEjercicio").placeholder =
      palabras.placeholderNombre;
  if (document.getElementById("lbl-grupo-muscular"))
    document.getElementById("lbl-grupo-muscular").innerText = palabras.lblGrupo;
  if (document.getElementById("lbl-dificultad"))
    document.getElementById("lbl-dificultad").innerText =
      palabras.lblDificultad;
  if (document.getElementById("lbl-series"))
    document.getElementById("lbl-series").innerText = palabras.lblSeries;
  if (document.getElementById("lbl-repeticiones"))
    document.getElementById("lbl-repeticiones").innerText = palabras.lblReps;
  if (document.getElementById("btn-guardar-rutina"))
    document.getElementById("btn-guardar-rutina").innerText =
      palabras.btnGuardar;

  // 3. Traducir las opciones de los desplegables
  if (document.getElementById("opt-pecho"))
    document.getElementById("opt-pecho").innerText = palabras.pecho;
  if (document.getElementById("opt-espalda"))
    document.getElementById("opt-espalda").innerText = palabras.espalda;
  if (document.getElementById("opt-piernas"))
    document.getElementById("opt-piernas").innerText = palabras.piernas;
  if (document.getElementById("opt-hombros"))
    document.getElementById("opt-hombros").innerText = palabras.hombros;
  if (document.getElementById("opt-core"))
    document.getElementById("opt-core").innerText = palabras.core;
  if (document.getElementById("opt-principiante"))
    document.getElementById("opt-principiante").innerText =
      palabras.principiante;
  if (document.getElementById("opt-intermedio"))
    document.getElementById("opt-intermedio").innerText = palabras.intermedio;
  if (document.getElementById("opt-avanzado"))
    document.getElementById("opt-avanzado").innerText = palabras.avanzado;

  // 4. Traducir Sección: Generador IA
  if (document.getElementById("ia-titulo-seccion"))
    document.getElementById("ia-titulo-seccion").innerText =
      palabras.iaTituloSec;
  if (document.getElementById("ia-titulo-tarjeta"))
    document.getElementById("ia-titulo-tarjeta").innerText =
      palabras.iaTituloTar;
  if (document.getElementById("ia-descripcion"))
    document.getElementById("ia-descripcion").innerText = palabras.iaDesc;
  if (document.getElementById("ia-opt-principiante"))
    document.getElementById("ia-opt-principiante").innerText =
      palabras.iaOptPrinc;
  if (document.getElementById("ia-opt-intermedio"))
    document.getElementById("ia-opt-intermedio").innerText =
      palabras.iaOptInter;
  if (document.getElementById("ia-opt-avanzado"))
    document.getElementById("ia-opt-avanzado").innerText = palabras.iaOptAvanz;
  if (document.getElementById("boton-generar"))
    document.getElementById("boton-generar").innerText = palabras.iaBtnGenerar;

  // 5. Traducir Sección: Gestión de Atletas
  if (document.getElementById("atletas")) {
    const h1Atletas = document.querySelector("#atletas h1");
    const h3Atletas = document.querySelector("#atletas h3");
    const pAtletas = document.querySelector("#atletas p");
    if (h1Atletas) h1Atletas.innerText = palabras.atletasTituloSec;
    if (h3Atletas) h3Atletas.innerText = palabras.atletasTituloTar;
    if (pAtletas) pAtletas.innerText = palabras.atletasDesc;
  }

  // 6. Traducir la tarjeta gris del perfil de atleta en tiempo real
  const tarjeta = document.getElementById("tarjeta-bienvenida");
  if (tarjeta && tarjeta.innerHTML !== "") {
    let contenido = tarjeta.innerHTML;
    if (idiomaElegido === "en") {
      contenido = contenido
        .replace(/Nivel:/g, "Level:")
        .replace(/Principiante/g, "Beginner")
        .replace(/Intermedio/g, "Intermediate")
        .replace(/Experto/g, "Expert")
        .replace(/Peso:/g, "Weight:")
        .replace(/Altura:/g, "Height:");
    } else {
      contenido = contenido
        .replace(/Level:/g, "Nivel:")
        .replace(/Beginner/g, "Principiante")
        .replace(/Intermediate/g, "Intermedio")
        .replace(/Expert/g, "Experto")
        .replace(/Weight:/g, "Peso:")
        .replace(/Height:/g, "Altura:");
    }
    tarjeta.innerHTML = contenido;
  }

  // 7. INTERCEPTOR DINÁMICO: Traducir bloques de alerta y rutinas de calistenia generadas en vivo
  const resultadoIA = document.getElementById("resultado-ia");
  if (resultadoIA && resultadoIA.innerHTML !== "") {
    let contenidoIA = resultadoIA.innerHTML;
    if (idiomaElegido === "en") {
      contenidoIA = contenidoIA
        .replace(
          "Circuito generado (Enfasis en Tiron):",
          "Generated Circuit (Pull Emphasis):",
        )
        .replace("Dominadas estrictas", "Strict Pull-ups")
        .replace("Remos Australianos", "Australian Rows")
        .replace(
          "Fallo: Aguante isometrico en barra",
          "Failure: Isometric bar hold",
        )
        .replace("Elevaciones de rodillas a la barra", "Knee raises to the bar")
        .replace(
          "*Aca conectaras el backend real*",
          "*Here you will connect the real backend*",
        );
    }
    resultadoIA.innerHTML = contenidoIA;
  }

  // Traducir las alertas flotantes del sistema de guardado (el bloque oscuro inferior)
  const alertasGuardado = document.querySelectorAll(".tarjeta, body, div");
  alertasGuardado.forEach((bloque) => {
    if (bloque.innerHTML && bloque.innerHTML.includes("Guardado a las")) {
      if (idiomaElegido === "en") {
        bloque.innerHTML = bloque.innerHTML
          .replace("Guardado a las", "Saved at")
          .replace("Espalda", "Back");
      }
    }
  });
}

// Escuchar los cambios manuales en el selector
document
  .getElementById("select-lang")
  .addEventListener("change", aplicarTraduccion);

// EJECUCIÓN AUTOMÁTICA CONTINUA: Traduce al cargar y vigila interacciones para elementos dinámicos
document.addEventListener("DOMContentLoaded", aplicarTraduccion);
document.addEventListener("click", () => setTimeout(aplicarTraduccion, 50));
