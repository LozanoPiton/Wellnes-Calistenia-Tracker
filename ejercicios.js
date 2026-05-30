// ============================================================
// ejercicios.js  —  CAPTURAR Y GUARDAR EJERCICIOS
// ============================================================
// Este archivo se encarga de todo lo relacionado con los
// ejercicios: agarrar los datos del formulario, validarlos,
// guardarlos en la base de datos y mostrar el mensajito
// de que se guardo bien.
//
// QUE HACE:
//   - Toma los datos del formulario de ejercicio
//   - Los guarda en la base de datos (vinculados al usuario)
//   - Muestra un cartelito verde de confirmacion
// ============================================================


// ------------------------------------------------------------
// capturarNuevoEjercicio()
// ------------------------------------------------------------
// Esta funcion se ejecuta cuando apretas el boton
// "💾 Guardar en Rutina IA" en la pantalla de Resumen.
//
// PASO A PASO:
//   1. Lee los datos del formulario (nombre, grupo, series, etc)
//   2. Verifica que el nombre no este vacio
//   3. Lo guarda en la base de datos
//   4. Muestra un cartel verde confirmando
//   5. Limpia el formulario para el proximo ejercicio
// ------------------------------------------------------------
function capturarNuevoEjercicio() {

    // 1) Leemos los valores del formulario
    var nombre = document.getElementById('nombreEjercicio').value.trim();
    var grupoMuscular = document.getElementById('grupoMuscular').value;
    var dificultad = document.getElementById('dificultadEjercicio').value;
    var series = parseInt(document.getElementById('series').value);
    var repeticiones = parseInt(document.getElementById('repeticiones').value);

    // 2) Validamos: si no escribio nombre, avisamos y frenamos
    if (nombre === '') {
        alert('Pone un nombre para el ejercicio');
        return;  // "return" corta la funcion aca, no sigue
    }

    // 3) Guardamos en la base de datos.
    //    El ejercicio queda vinculado al usuario que esta logueado.
    guardarEjercicio(usuarioActual.id, nombre, grupoMuscular, dificultad, series, repeticiones);

    // 4) Mostramos el cartelito de "Guardado" abajo del formulario
    mostrarEjercicioGuardado(nombre, series, repeticiones, grupoMuscular);

    // 5) Limpiamos los campos para el proximo ejercicio
    document.getElementById('nombreEjercicio').value = '';
    document.getElementById('series').value = '4';
    document.getElementById('repeticiones').value = '10';
    // El grupo muscular y dificultad vuelven solos al primer valor
}


// ------------------------------------------------------------
// mostrarEjercicioGuardado(nombre, series, repes, grupo)
// ------------------------------------------------------------
// Muestra un cartelito verde debajo del formulario para que
// sepas que el ejercicio se guardo bien.
//
// Dice: "✅ Guardado a las 14:30 · Dominadas 4x10 · Espalda"
// ------------------------------------------------------------
function mostrarEjercicioGuardado(nombre, series, repes, grupo) {

    // Buscamos un contenedor para el mensaje
    // Si no existe, lo creamos sobre la marcha
    // (no esta en el HTML fijo porque solo aparece
    // cuando guardas un ejercicio por primera vez)
    var contenedor = document.getElementById('resultado-ejercicio');

    if (!contenedor) {
        // Creamos el contenedor
        contenedor = document.createElement('div');
        contenedor.id = 'resultado-ejercicio';
        contenedor.style.cssText = 'margin-top: 20px; padding: 15px; background-color: #1e293b; border-radius: 8px; border-left: 4px solid #4ade80;';

        // Lo metemos justo despues del formulario
        var formulario = document.querySelector('.formulario-ejercicio');
        formulario.parentNode.insertBefore(contenedor, formulario.nextSibling);
    }

    // Obtenemos la hora actual para mostrar cuando se guardo
    var hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    // Armamos el mensaje
    contenedor.innerHTML =
        '<div style="display: flex; justify-content: space-between; align-items: center;">' +
            '<div>' +
                '<strong style="color: #4ade80;">✅ Guardado</strong> a las ' + hora +
                '<br>' +
                '<span style="color: #f8fafc;">' + nombre + ' · ' + series + 'x' + repes + ' · ' + grupo + '</span>' +
            '</div>' +
            '<span style="font-size: 24px;">💪</span>' +
        '</div>';
}
