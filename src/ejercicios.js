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

  infoDiv.innerHTML = '';
  infoDiv.style.display = 'block';

  var flex = document.createElement('div');
  flex.style.cssText = 'display:flex;justify-content:space-between;align-items:center';

  var left = document.createElement('div');
  var strongNombre = document.createElement('strong');
  strongNombre.style.color = 'var(--text-primary)';
  strongNombre.textContent = nombre;
  left.appendChild(strongNombre);
  left.appendChild(document.createElement('br'));
  var spanDesc = document.createElement('span');
  spanDesc.style.color = 'var(--text-muted)';
  spanDesc.textContent = desc;
  left.appendChild(spanDesc);
  flex.appendChild(left);

  var right = document.createElement('div');
  right.style.textAlign = 'right';
  var spanNivel = document.createElement('span');
  spanNivel.style.cssText = 'color:var(--warning);font-weight:700';
  spanNivel.textContent = t('nivelAbrev') + nivel;
  right.appendChild(spanNivel);
  right.appendChild(document.createElement('br'));
  var spanMeta = document.createElement('span');
  spanMeta.style.cssText = 'color:var(--accent);font-family:monospace';
  spanMeta.textContent = t('meta') + ': ' + series + 'x' + reps;
  right.appendChild(spanMeta);
  flex.appendChild(right);

  infoDiv.appendChild(flex);
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
    var msgEl = mostrarMensajeSesion('error');
    msgEl.textContent = t('completarCampos');
    return;
  }

  guardarSesion(usuarioActual.id, progresionId, series, reps, notas);
  logEvento("Sesion guardada", option.getAttribute('data-nombre') + " " + series + "x" + reps);

  var metaReps = parseInt(option.getAttribute('data-reps'));
  var metaSeries = parseInt(option.getAttribute('data-series'));
  var nombre = option.getAttribute('data-nombre');

  var msgEl = mostrarMensajeSesion('ok');
  msgEl.appendChild(document.createTextNode(t('sesionGuardada') + ' \u2014 ' + series + 'x' + reps + ' de ' + nombre));

  if (series >= metaSeries && reps >= metaReps) {
    msgEl.appendChild(document.createElement('br'));
    var spanOk = document.createElement('span');
    spanOk.style.cssText = 'color:var(--success);font-weight:700';
    spanOk.textContent = t('metaCumplida');
    msgEl.appendChild(spanOk);
  } else {
    msgEl.appendChild(document.createElement('br'));
    var spanFalta = document.createElement('span');
    spanFalta.style.color = 'var(--warning)';
    spanFalta.textContent = t('meta') + ': ' + metaSeries + 'x' + metaReps + ' \u2014 ' + t('teFaltaron') + ' ' +
      Math.max(0, metaSeries - series) + ' ' + t('seriesAbrev') + ' ' + t('o') + ' ' + Math.max(0, metaReps - reps) + ' ' + t('repsAbrev');
    msgEl.appendChild(spanFalta);
  }

  document.getElementById('series-sesion').value = '3';
  document.getElementById('reps-sesion').value = '10';
  document.getElementById('notas-sesion').value = '';

  refrescarHistorial();
  mostrarResumenDiario();
}

// ------------------------------------------------------------
// mostrarMensajeSesion(tipo)
// ------------------------------------------------------------
function mostrarMensajeSesion(tipo) {
  var div = document.getElementById('resultado-sesion');
  div.innerHTML = '';
  var msg = document.createElement('div');
  msg.className = 'mensaje-sesion ' + tipo;
  div.appendChild(msg);
  return msg;
}

window.guardarSesionClick = guardarSesionClick;
window.mostrarMetaEjercicio = mostrarMetaEjercicio;
