// ============================================================
// historial.js  —  LISTA DE SESIONES + EDICION + ELIMINACION
// ============================================================

// ------------------------------------------------------------
// refrescarHistorial()
// Muestra la ultima sesion en Inicio y el listado en Progreso
// con botones Editar/Eliminar.
// Columnas: [0]=nombre, [1]=series_hechas, [2]=reps_hechas,
//           [3]=notas, [4]=fecha, [5]=reps_req, [6]=series_req,
//           [7]=grupo, [8]=nivel, [9]=s.id
// ------------------------------------------------------------
function refrescarHistorial() {
  if (!usuarioActual) return;
  var sesiones = obtenerSesiones(usuarioActual.id, 10);

  // ---- Ultima sesion en Inicio ----
  var ultimaDiv = document.getElementById('texto-ultima-sesion');
  if (sesiones.length > 0) {
    var s = sesiones[0];
    ultimaDiv.innerHTML = '';
    var strong = document.createElement('strong');
    strong.textContent = s[0];
    ultimaDiv.appendChild(strong);
    ultimaDiv.appendChild(document.createTextNode(' — ' + s[1] + 'x' + s[2] + ' (' + s[4] + ')'));
  } else {
    ultimaDiv.textContent = t('sinSesiones');
    ultimaDiv.style.cssText = 'color:var(--text-secondary);font-style:italic';
  }

  // ---- Historial en Progreso ----
  var histDiv = document.getElementById('historial-sesiones');
  histDiv.innerHTML = '';

  if (sesiones.length === 0) {
    var msg = document.createElement('p');
    msg.style.cssText = 'color:var(--text-secondary);font-style:italic';
    msg.textContent = t('sinHistorial');
    histDiv.appendChild(msg);
    return;
  }

  var ul = document.createElement('ul');
  ul.className = 'historial-lista';

  for (var i = 0; i < sesiones.length; i++) {
    var s = sesiones[i];
    var idSesion = s[9];

    var item = crearItemHistorial(s, idSesion);
    ul.appendChild(item);
  }
  histDiv.appendChild(ul);
}


// ------------------------------------------------------------
// crearItemHistorial(s, idSesion)
// Crea un <li> con nombre, seriesxreps, fecha, notas y botones
// ------------------------------------------------------------
function crearItemHistorial(s, idSesion) {
  var li = document.createElement('li');
  li.className = 'historial-item';

  var content = document.createElement('div');
  content.className = 'historial-item-content';

  var info = document.createElement('div');
  info.className = 'historial-item-info';

  var strong = document.createElement('strong');
  strong.textContent = s[0];
  info.appendChild(strong);
  info.appendChild(document.createTextNode(' ' + s[1] + 'x' + s[2] + ' '));

  var fecha = document.createElement('span');
  fecha.className = 'historial-item-fecha';
  fecha.textContent = s[4];
  info.appendChild(fecha);

  if (s[3]) {
    info.appendChild(document.createElement('br'));
    var notas = document.createElement('small');
    notas.className = 'historial-item-notas';
    notas.textContent = s[3];
    info.appendChild(notas);
  }

  var acciones = document.createElement('div');
  acciones.className = 'historial-item-acciones';

  acciones.appendChild(crearBotonEditar(idSesion));
  acciones.appendChild(crearBotonEliminar(idSesion));

  content.appendChild(info);
  content.appendChild(acciones);
  li.appendChild(content);
  return li;
}


// ------------------------------------------------------------
// crearBotonEditar(id)
// ------------------------------------------------------------
function crearBotonEditar(id) {
  var btn = document.createElement('button');
  btn.className = 'btn-historial btn-historial-editar';

  var img = document.createElement('img');
  img.src = 'icons/new.svg';
  img.width = 12;
  img.height = 12;
  btn.appendChild(img);
  btn.appendChild(document.createTextNode(' ' + t('editar')));

  btn.addEventListener('click', function () { editarSesionClick(id); });
  return btn;
}


// ------------------------------------------------------------
// crearBotonEliminar(id)
// ------------------------------------------------------------
function crearBotonEliminar(id) {
  var btn = document.createElement('button');
  btn.className = 'btn-historial btn-historial-eliminar';

  var img = document.createElement('img');
  img.src = 'icons/new.svg';
  img.width = 12;
  img.height = 12;
  btn.appendChild(img);
  btn.appendChild(document.createTextNode(' ' + t('eliminar')));

  btn.addEventListener('click', function () { eliminarSesionClick(id); });
  return btn;
}


// ------------------------------------------------------------
// editarSesionClick(id)
// Remplaza el historial por un formulario de edicion.
// Los inputs ya vienen con los valores actuales.
// ------------------------------------------------------------
function editarSesionClick(id) {
  var sesiones = obtenerSesiones(usuarioActual.id, 100);
  var sesion = null;
  for (var i = 0; i < sesiones.length; i++) {
    if (sesiones[i][9] === id) { sesion = sesiones[i]; break; }
  }
  if (!sesion) return;

  var histDiv = document.getElementById('historial-sesiones');
  histDiv.innerHTML = '';

  var form = document.createElement('div');
  form.className = 'edit-form';

  var titulo = document.createElement('h4');
  titulo.className = 'edit-form-titulo';
  titulo.textContent = t('editando') + ': ' + sesion[0];
  form.appendChild(titulo);

  // Fila: Series + Reps
  var fila = document.createElement('div');
  fila.className = 'fila-inputs';
  fila.style.marginBottom = '8px';

  var colSeries = document.createElement('div');
  colSeries.className = 'columna-input';
  colSeries.appendChild(crearLabel('lblSeries'));
  var inputSeries = document.createElement('input');
  inputSeries.type = 'number';
  inputSeries.id = 'edit-series-' + id;
  inputSeries.className = 'input-ejercicio';
  inputSeries.value = sesion[1];
  inputSeries.min = '1';
  colSeries.appendChild(inputSeries);
  fila.appendChild(colSeries);

  var colReps = document.createElement('div');
  colReps.className = 'columna-input';
  colReps.appendChild(crearLabel('lblReps'));
  var inputReps = document.createElement('input');
  inputReps.type = 'number';
  inputReps.id = 'edit-reps-' + id;
  inputReps.className = 'input-ejercicio';
  inputReps.value = sesion[2];
  inputReps.min = '1';
  colReps.appendChild(inputReps);
  fila.appendChild(colReps);

  form.appendChild(fila);

  // Notas
  var grupoNotas = document.createElement('div');
  grupoNotas.className = 'grupo-input';
  grupoNotas.appendChild(crearLabel('lblNotas'));
  var inputNotas = document.createElement('input');
  inputNotas.type = 'text';
  inputNotas.id = 'edit-notas-' + id;
  inputNotas.className = 'input-ejercicio';
  inputNotas.value = sesion[3] || '';
  grupoNotas.appendChild(inputNotas);
  form.appendChild(grupoNotas);

  // Botones: Guardar + Cancelar
  var divBotones = document.createElement('div');
  divBotones.className = 'edit-form-acciones';

  var btnGuardar = document.createElement('button');
  btnGuardar.className = 'btn-guardar-ejercicio';
  btnGuardar.style.flex = '1';
  var imgCheck = document.createElement('img');
  imgCheck.src = 'icons/check.svg';
  imgCheck.width = 16;
  imgCheck.height = 16;
  imgCheck.style.cssText = 'vertical-align:middle';
  btnGuardar.appendChild(imgCheck);
  btnGuardar.appendChild(document.createTextNode(' ' + t('guardarCambios')));
  btnGuardar.addEventListener('click', function () { guardarEdicionSesion(id); });
  divBotones.appendChild(btnGuardar);

  var btnCancelar = document.createElement('button');
  btnCancelar.className = 'btn-catalogo';
  btnCancelar.style.flex = '1';
  btnCancelar.textContent = t('cancelar');
  btnCancelar.addEventListener('click', refrescarHistorial);
  divBotones.appendChild(btnCancelar);

  form.appendChild(divBotones);
  histDiv.appendChild(form);
}


// ------------------------------------------------------------
// crearLabel(claveTraduccion)
// ------------------------------------------------------------
function crearLabel(clave) {
  var label = document.createElement('label');
  label.className = 'label-ejercicio';
  label.textContent = t(clave);
  return label;
}


// ------------------------------------------------------------
// guardarEdicionSesion(id)
// Toma los valores del formulario y los guarda en la BD.
// ------------------------------------------------------------
function guardarEdicionSesion(id) {
  var series = parseInt(document.getElementById('edit-series-' + id).value);
  var reps = parseInt(document.getElementById('edit-reps-' + id).value);
  var notas = document.getElementById('edit-notas-' + id).value.trim();
  if (!series || !reps) { alert(t('completarCampos')); return; }

  actualizarSesion(id, series, reps, notas);
  logEvento("Sesion editada", "id=" + id + " " + series + "x" + reps);
  refrescarHistorial();
  mostrarResumenDiario();
}


// ------------------------------------------------------------
// eliminarSesionClick(id)
// Pide confirmacion, borra la sesion y refresca.
// ------------------------------------------------------------
function eliminarSesionClick(id) {
  if (!confirm(t('confirmEliminarSesion'))) return;
  eliminarSesion(id);
  logEvento("Sesion eliminada", "id=" + id);
  refrescarHistorial();
  mostrarResumenDiario();
}


window.refrescarHistorial = refrescarHistorial;
window.editarSesionClick = editarSesionClick;
window.eliminarSesionClick = eliminarSesionClick;
window.guardarEdicionSesion = guardarEdicionSesion;
