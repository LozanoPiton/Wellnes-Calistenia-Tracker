// ============================================================
// app.js  —  EL CORAZON DE LA APP
// ============================================================
// Este archivo es el que arranca todo. Cuando abris la app,
// esto se ejecuta primero.
//
// QUE HACE:
//   - Guarda las variables que se usan en toda la app
//     (como el usuario que esta logueado)
//   - Arranca la base de datos
//   - Decide si mostrar login o registro
// ============================================================


// ------------------------------------------------------------
// VARIABLES GLOBALES
// ------------------------------------------------------------
// "usuarioActual" guarda al usuario que esta usando la app ahora.
// Arranca como null (vacio) hasta que alguien inicia sesion.
// ------------------------------------------------------------
var usuarioActual = null;

// "nivelSeleccionado" guarda el nivel que se elige en el registro.
// Se usa ahi nomas y despues se reinicia.
var nivelSeleccionado = null;

// ------------------------------------------------------------
// LOG GENERAL DE LA APP
// ------------------------------------------------------------
// Escribe una linea en wellness.log via el proceso principal.
// Uso: logEvento("Login de usuario", "Lozano");
// ------------------------------------------------------------
var { ipcRenderer } = require("electron");

function logEvento(accion, detalle) {
  var mensaje = accion;
  if (detalle) mensaje += " | " + detalle;
  if (usuarioActual) mensaje += " | usuario=" + usuarioActual.nombre;
  ipcRenderer.invoke("log-write", { mensaje: mensaje });
}
window.logEvento = logEvento;

function cerrarApp() {
  ipcRenderer.invoke("app-close");
}
window.cerrarApp = cerrarApp;


// ------------------------------------------------------------
// INICIO: esto se ejecuta automaticamente al abrir la app
// ------------------------------------------------------------
// "DOMContentLoaded" significa "esperá a que termine de cargar
// el HTML antes de empezar". No hagas nada hasta que la pagina
// este lista.
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {

    // 0) Inicializar tema (modo claro por defecto)
    initTema();
    logEvento("App lista", "Bienvenida");

    // 1) Arrancamos la base de datos (ver database.js)
    //    "iniciarDB()" es async, osea que lleva tiempo.
    //    Por eso usamos ".then()" que significa "cuando termine, hace esto".
    iniciarDB().then(function () {

        // Poblar catalogo de progresiones si esta vacio
        poblarProgresiones();

        // 2) Preguntamos a la DB: ¿hay usuarios guardados?
        var usuarios = obtenerUsuarios();

        if (usuarios.length === 0) {
            // No hay ningun usuario → mostramos el formulario de registro
            mostrarRegistro();
        } else {
            // Hay usuarios guardados → mostramos el listado para elegir
            mostrarLogin(usuarios);
        }
    });
});


// ------------------------------------------------------------
// MOSTRAR / OCULTAR PANTALLAS
// ------------------------------------------------------------
// Estas funciones esconden o muestran partes de la pantalla.
// Se usan cuando pasamos del login a la app, o al reves.
// ------------------------------------------------------------

// Oculta la pantalla de login/registro
function ocultarAuth() {
    document.getElementById('pantalla-auth').style.display = 'none';
}

// Muestra la app principal (el contenido despues del login)
function mostrarApp() {
    document.getElementById('contenido-principal').style.display = 'block';
    document.getElementById('info-usuario').style.display = 'flex';
    document.getElementById('btn-cambiar-usuario').style.display = 'block';
}

// Oculta la app principal (vuelve al login)
function ocultarApp() {
    document.getElementById('contenido-principal').style.display = 'none';
    document.getElementById('info-usuario').style.display = 'none';
    document.getElementById('btn-cambiar-usuario').style.display = 'none';
}


// ------------------------------------------------------------
// FUNCIONES DE CONSOLA (para probar)
// ------------------------------------------------------------
// Abri la consola con Ctrl+Shift+I y tipea:
//   verUsuarios()     → muestra todos los usuarios
//   verEjercicios()   → muestra los ejercicios del usuario actual
// ------------------------------------------------------------

function verUsuarios() {
    var usuarios = obtenerUsuarios();
    console.log('Usuarios (' + usuarios.length + '):');
    for (var i = 0; i < usuarios.length; i++) {
        console.log('  ' + (i + 1) + '. ' + usuarios[i].nombre + ' - ' + usuarios[i].nivel);
    }
}

function verEjercicios() {
    if (!usuarioActual) {
        console.log('Primero inicia sesion');
        return;
    }
    var ejercicios = obtenerEjercicios(usuarioActual.id);
    console.log('Ejercicios de ' + usuarioActual.nombre + ' (' + ejercicios.length + '):');
    for (var i = 0; i < ejercicios.length; i++) {
        console.log('  ' + (i + 1) + '. ' + ejercicios[i].nombre + ' ' + ejercicios[i].series + 'x' + ejercicios[i].repeticiones);
    }
}


// ------------------------------------------------------------
// TEMA: MODO CLARO / OSCURO
// ------------------------------------------------------------

function initTema() {
    var tema = localStorage.getItem('tema');
    if (tema === 'oscuro') {
        document.body.classList.add('dark-mode');
    }
    actualizarBotonTema();
}

function toggleTema() {
    document.body.classList.toggle('dark-mode');
    var esOscuro = document.body.classList.contains('dark-mode');
    localStorage.setItem('tema', esOscuro ? 'oscuro' : 'claro');
    logEvento("Cambio de tema", esOscuro ? "oscuro" : "claro");
    actualizarBotonTema();
}

function actualizarBotonTema() {
    var esOscuro = document.body.classList.contains('dark-mode');
    var icono = document.getElementById('icono-tema');
    var texto = document.getElementById('texto-tema');
    if (icono) icono.textContent = esOscuro ? '\uD83C\uDF19' : '\u2600\uFE0F';
    if (texto) texto.textContent = esOscuro ? 'Modo oscuro' : 'Modo claro';
}
