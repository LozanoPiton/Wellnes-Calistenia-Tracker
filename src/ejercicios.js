// ============================================================
// ejercicios.js  —  REGISTRO DE SESIONES
// ============================================================

// ------------------------------------------------------------
// mostrarMetaEjercicio()
// ------------------------------------------------------------
// Muestra la meta del ejercicio seleccionado (reps, series, nivel)
// ------------------------------------------------------------
function mostrarMetaEjercicio() {
  var select = document.getElementById('select-ejercicio-sesion');
  var option = select.options[select.selectedIndex];
  var infoDiv = document.getElementById('info-meta-ejercicio');

  if (!option || !option.value) {
    infoDiv.style.display = 'none';
    return;
  }

  var nombre = option.getAttribute('data-nombre');
  var nivel = option.getAttribute('data-nivel');
  var reps = option.getAttribute('data-reps');
  var series = option.getAttribute('data-series');
  var desc = option.getAttribute('data-desc');

  infoDiv.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center">' +
      '<div>' +
        '<strong style="color:#f8fafc">' + nombre + '</strong>' +
        '<br><span style="color:#6c7086">' + desc + '</span>' +
      '</div>' +
      '<div style="text-align:right">' +
        '<span style="color:#facc15;font-weight:700">' + t('nivelAbrev') + nivel + '</span>' +
        '<br><span style="color:#38bdf8;font-family:monospace">' + t('meta') + ': ' + series + 'x' + reps + '</span>' +
      '</div>' +
    '</div>';

  infoDiv.style.display = 'block';
}

// ------------------------------------------------------------
// guardarSesionClick()
// ------------------------------------------------------------
function guardarSesionClick() {
  var select = document.getElementById('select-ejercicio-sesion');
  var option = select.options[select.selectedIndex];
  var progresionId = parseInt(select.value);
  var series = parseInt(document.getElementById('series-sesion').value);
  var reps = parseInt(document.getElementById('reps-sesion').value);
  var notas = document.getElementById('notas-sesion').value.trim();

  if (!progresionId || !series || !reps) {
    mostrarMensajeSesion(t('completarCampos'), 'error');
    return;
  }

  guardarSesion(usuarioActual.id, progresionId, series, reps, notas);

  var metaReps = parseInt(option.getAttribute('data-reps'));
  var metaSeries = parseInt(option.getAttribute('data-series'));
  var nombre = option.getAttribute('data-nombre');

  var texto = t('sesionGuardada') + ' — ' + series + 'x' + reps + ' de ' + nombre;

  if (series >= metaSeries && reps >= metaReps) {
    texto += '<br><span style="color:#a6e3a1;font-weight:700">' + t('metaCumplida') + '</span>';
  } else {
    texto += '<br><span style="color:#f9e2af">' + t('meta') + ': ' + metaSeries + 'x' + metaReps + ' — ' + t('teFaltaron') + ' ' +
      Math.max(0, metaSeries - series) + ' ' + t('seriesAbrev') + ' ' + t('o') + ' ' + Math.max(0, metaReps - reps) + ' ' + t('repsAbrev') + '</span>';
  }

  mostrarMensajeSesion(texto, 'ok');

  document.getElementById('series-sesion').value = '3';
  document.getElementById('reps-sesion').value = '10';
  document.getElementById('notas-sesion').value = '';

  refrescarHistorial();
}

// ------------------------------------------------------------
// mostrarMensajeSesion(texto, tipo)
// ------------------------------------------------------------
function mostrarMensajeSesion(texto, tipo) {
  var div = document.getElementById('resultado-sesion');
  var color = tipo === 'ok' ? '#4ade80' : '#f87171';
  div.innerHTML =
    '<div style="padding:12px;border-radius:8px;background:#1e293b;border-left:4px solid ' + color + ';color:#f8fafc">' +
    texto + '</div>';
}

window.guardarSesionClick = guardarSesionClick;
window.mostrarMetaEjercicio = mostrarMetaEjercicio;
