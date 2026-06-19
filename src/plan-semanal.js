// ============================================================
// plan-semanal.js  —  PLAN SEMANAL, RESUMEN DIARIO, EDITOR
// ============================================================
// Depende de: database.js (obtenerPlanSemanal, obtenerProgresionesPorGrupo,
//             obtenerSesiones, guardarPlanSemanal),
//             idiomas.js (t),
//             app.js (usuarioActual)
// ============================================================

// ------------------------------------------------------------
// refrescarPlanSemanal()
// ------------------------------------------------------------
function refrescarPlanSemanal() {
  if (!usuarioActual) return;

  var DIAS = [t('lunes'), t('martes'), t('miercoles'), t('jueves'), t('viernes'), t('sabado'), t('domingo')];

  var plan = obtenerPlanSemanal(usuarioActual.id);
  if (plan.length === 0) return;

  var hoy = new Date().getDay();
  var hoyIndex = hoy === 0 ? 6 : hoy - 1;
  var hoyGrupo = plan[hoyIndex].grupo;

  var nivelMaximo = { Principiante: 1, Intermedio: 2, Experto: 3 }[usuarioActual.nivel] || 1;

  // ---- Dia de hoy destacado ----
  var hoyDiv = document.getElementById('texto-plan-hoy');
  hoyDiv.innerHTML = '';
  var strong = document.createElement('strong');
  strong.style.fontSize = '1.1rem';
  strong.appendChild(document.createTextNode(t('hoy') + ' (' + DIAS[hoyIndex] + '): '));
  var spanGrupo = document.createElement('span');
  spanGrupo.style.cssText = hoyGrupo ? 'color:var(--success)' : 'color:var(--text-muted)';
  spanGrupo.textContent = hoyGrupo ? t(hoyGrupo.toLowerCase()) : t('descanso');
  strong.appendChild(spanGrupo);
  hoyDiv.appendChild(strong);

  // ---- Grilla semanal ----
  var completoDiv = document.getElementById('texto-plan-completo');
  var grid = document.createElement('div');
  grid.className = 'plan-grid';

  for (var i = 0; i < plan.length; i++) {
    var grupo = plan[i].grupo;
    var grupoT = grupo ? t(grupo.toLowerCase()) : null;

    var item = document.createElement('div');
    item.className = 'plan-grid-item' + (i === hoyIndex ? ' hoy' : ' normal');

    var dia = document.createElement('div');
    dia.className = 'plan-grid-dia';
    dia.textContent = DIAS[i].substring(0, 3);
    item.appendChild(dia);

    var grp = document.createElement('div');
    grp.className = 'plan-grid-grupo' + (grupoT ? ' activo' : ' inactivo');
    grp.textContent = grupoT || '—';
    item.appendChild(grp);

    grid.appendChild(item);
  }

  completoDiv.innerHTML = '';
  completoDiv.appendChild(grid);

  // ---- Recomendaciones del dia ----
  var tarjetaEj = document.getElementById('tarjeta-ejercicios-hoy');
  var textoEj = document.getElementById('texto-ejercicios-hoy');
  var tarjetaResumen = document.getElementById('tarjeta-resumen-diario');

  if (!hoyGrupo) {
    tarjetaEj.style.display = 'none';
    tarjetaResumen.style.display = 'none';
    return;
  }

  var ejercicios = obtenerProgresionesPorGrupo(hoyGrupo, nivelMaximo);
  if (ejercicios.length === 0) {
    tarjetaEj.style.display = 'none';
    tarjetaResumen.style.display = 'none';
    return;
  }

  var sesiones = obtenerSesiones(usuarioActual.id, 1);
  var primerVez = sesiones.length === 0;

  tarjetaEj.style.display = 'block';
  textoEj.innerHTML = '';

  // Banner de primera vez
  if (primerVez) {
    var banner = document.createElement('div');
    banner.className = 'banner-primera-vez';
    var imgBanner = document.createElement('img');
    imgBanner.src = 'icons/target.svg';
    imgBanner.width = 14;
    imgBanner.height = 14;
    imgBanner.style.cssText = 'vertical-align:middle';
    banner.appendChild(imgBanner);
    banner.appendChild(document.createTextNode(' ' + t('primeraVez')));
    textoEj.appendChild(banner);
  }

  var intro = document.createElement('p');
  intro.className = 'ia-texto';
  intro.style.marginBottom = '8px';
  intro.textContent = t('ejerciciosPara') + ' ' + t(hoyGrupo.toLowerCase()) + ' '
    + t('paraTuNivel') + ' (' + t(usuarioActual.nivel.toLowerCase()) + '):';
  textoEj.appendChild(intro);

  var lista = document.createElement('div');
  lista.style.cssText = 'display:flex;flex-direction:column;gap:6px';

  for (var i = 0; i < ejercicios.length; i++) {
    var e = ejercicios[i];
    // Columnas: [0]=id, [1]=nombre, [2]=grupo, [3]=nivel,
    //           [4]=reps_requeridas, [5]=series_requeridas, [6]=descripcion

    var card = document.createElement('div');
    card.className = 'plan-ej-card';

    var header = document.createElement('div');
    header.className = 'plan-ej-card-header';

    var nombre = document.createElement('strong');
    nombre.className = 'plan-ej-card-nombre';
    nombre.textContent = e[1];
    header.appendChild(nombre);

    var nivel = document.createElement('span');
    nivel.className = 'plan-ej-card-nivel';
    nivel.textContent = t('nivelAbrev') + ' ' + e[3];
    header.appendChild(nivel);

    var desc = document.createElement('div');
    desc.className = 'plan-ej-card-desc';
    desc.textContent = (e[5] || '—') + ' ' + t('seriesAbrev') + ' x '
      + (e[4] || '—') + ' ' + t('repsAbrev')
      + (e[6] ? ' — ' + e[6] : '');

    card.appendChild(header);
    card.appendChild(desc);
    lista.appendChild(card);
  }

  textoEj.appendChild(lista);
  mostrarResumenDiario();
}


// ------------------------------------------------------------
// mostrarResumenDiario()
// ------------------------------------------------------------
// Tarjeta que muestra cuantos ejercicios del plan de hoy se
// completaron. Obtiene el grupo muscular del dia segun el plan
// semanal, busca los ejercicios recomendados para ese grupo
// (filtrados por nivel del usuario), y cuenta cuantos ya tienen
// una sesion registrada hoy. Muestra X/Y con barra de progreso
// y un check/cross por cada ejercicio.
// ------------------------------------------------------------
function mostrarResumenDiario() {
  if (!usuarioActual) return;

  var hoy = new Date();
  var fechaStr = hoy.getFullYear() + '-' +
    String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
    String(hoy.getDate()).padStart(2, '0');

  // indice del dia: 0=Lu..6=Do (getDay devuelve 0=Do, ajustamos)
  var hoyIndex = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1;
  var plan = obtenerPlanSemanal(usuarioActual.id);
  if (plan.length === 0) return;
  var grupo = plan[hoyIndex].grupo;
  if (!grupo) {
    document.getElementById('tarjeta-resumen-diario').style.display = 'none';
    return;
  }

  var nivelMaximo = { Principiante: 1, Intermedio: 2, Experto: 3 }[usuarioActual.nivel] || 1;
  var ejerciciosRecomendados = obtenerProgresionesPorGrupo(grupo, nivelMaximo);

  var sesiones = obtenerSesiones(usuarioActual.id, 100);
  var sesionesHoy = [];
  for (var i = 0; i < sesiones.length; i++) {
    if (sesiones[i][4].indexOf(fechaStr) === 0) sesionesHoy.push(sesiones[i]);
  }

  var tarjeta = document.getElementById('tarjeta-resumen-diario');
  if (ejerciciosRecomendados.length === 0) {
    tarjeta.style.display = 'none';
    return;
  }

  var completados = 0;
  for (var i = 0; i < ejerciciosRecomendados.length; i++) {
    var nombreEj = ejerciciosRecomendados[i][1];
    for (var j = 0; j < sesionesHoy.length; j++) {
      if (sesionesHoy[j][0] === nombreEj) { completados++; break; }
    }
  }

  var total = ejerciciosRecomendados.length;
  tarjeta.style.display = 'block';
  var div = document.getElementById('texto-resumen-diario');
  div.innerHTML = '';

  var pct = total > 0 ? Math.round((completados / total) * 100) : 0;
  var color = completados === total ? 'var(--success)' : (completados > 0 ? 'var(--warning)' : 'var(--danger)');

  var contenedor = document.createElement('div');
  contenedor.className = 'resumen-diario';

  var numero = document.createElement('div');
  numero.className = 'resumen-diario-numero';
  numero.style.color = color;
  numero.textContent = completados + ' / ' + total;
  contenedor.appendChild(numero);

  var texto = document.createElement('div');
  texto.className = 'resumen-diario-texto';
  texto.textContent = t('ejerciciosCompletados');
  contenedor.appendChild(texto);

  var barraOuter = document.createElement('div');
  barraOuter.className = 'resumen-diario-barra';
  var barraInner = document.createElement('div');
  barraInner.className = 'resumen-diario-barra-inner';
  barraInner.style.width = pct + '%';
  barraInner.style.background = color;
  barraOuter.appendChild(barraInner);
  contenedor.appendChild(barraOuter);

  var lista = document.createElement('div');
  lista.className = 'resumen-diario-lista';

  for (var i = 0; i < ejerciciosRecomendados.length; i++) {
    var e = ejerciciosRecomendados[i];
    var hecho = false;
    for (var j = 0; j < sesionesHoy.length; j++) {
      if (sesionesHoy[j][0] === e[1]) { hecho = true; break; }
    }

    var row = document.createElement('div');
    row.className = 'resumen-diario-ejercicio';

    var spanIzq = document.createElement('span');
    var icono = document.createElement('span');
    icono.style.color = hecho ? 'var(--success)' : 'var(--danger)';
    icono.textContent = hecho ? '\u2713' : '\u2717';
    spanIzq.appendChild(icono);

    var strong = document.createElement('strong');
    strong.className = 'resumen-diario-ejercicio-nombre';
    strong.textContent = e[1];
    spanIzq.appendChild(strong);

    var spanNivel = document.createElement('span');
    spanNivel.className = 'resumen-diario-ejercicio-nivel';
    spanNivel.textContent = t('nivelAbrev') + ' ' + e[3];

    row.appendChild(spanIzq);
    row.appendChild(spanNivel);
    lista.appendChild(row);
  }

  contenedor.appendChild(lista);
  div.appendChild(contenedor);
}


// ------------------------------------------------------------
// mostrarEditorPlan()
// ------------------------------------------------------------
function mostrarEditorPlan() {
  document.getElementById('tarjeta-plan-semanal').style.display = 'none';
  document.getElementById('tarjeta-editor-plan').style.display = 'block';

  var plan = obtenerPlanSemanal(usuarioActual.id);
  var DIAS = [t('lunes'), t('martes'), t('miercoles'), t('jueves'), t('viernes'), t('sabado'), t('domingo')];

  var tabla = document.createElement('table');
  tabla.className = 'editor-plan-tabla';

  var grupos = [
    { value: '', label: t('descanso') },
    { value: 'Espalda', label: t('espalda') },
    { value: 'Pecho', label: t('pecho') },
    { value: 'Hombros', label: t('hombros') },
    { value: 'Abdomen', label: t('abdomen') },
    { value: 'Piernas', label: t('piernas') },
  ];

  for (var i = 0; i < plan.length; i++) {
    var tr = document.createElement('tr');

    var tdDia = document.createElement('td');
    tdDia.className = 'editor-plan-td-dia';
    tdDia.textContent = DIAS[i];
    tr.appendChild(tdDia);

    var tdSelect = document.createElement('td');
    tdSelect.className = 'editor-plan-td-select';

    var select = document.createElement('select');
    select.id = 'plan-grupo-' + i;
    select.className = 'select-ejercicio';
    select.style.width = '100%';

    for (var j = 0; j < grupos.length; j++) {
      var option = document.createElement('option');
      option.value = grupos[j].value;
      option.textContent = grupos[j].label;
      if (plan[i].grupo === grupos[j].value) option.selected = true;
      select.appendChild(option);
    }

    tdSelect.appendChild(select);
    tr.appendChild(tdSelect);
    tabla.appendChild(tr);
  }

  var contenedor = document.getElementById('editor-plan-contenido');
  contenedor.innerHTML = '';
  contenedor.appendChild(tabla);
}


// ------------------------------------------------------------
// guardarEditorPlan()
// ------------------------------------------------------------
function guardarEditorPlan() {
  for (var i = 0; i < 7; i++) {
    var select = document.getElementById('plan-grupo-' + i);
    if (select) {
      guardarPlanSemanal(usuarioActual.id, i, select.value || null);
    }
  }
  cancelarEditorPlan();
  refrescarPlanSemanal();
}


// ------------------------------------------------------------
// cancelarEditorPlan()
// ------------------------------------------------------------
function cancelarEditorPlan() {
  document.getElementById('tarjeta-plan-semanal').style.display = 'block';
  document.getElementById('tarjeta-editor-plan').style.display = 'none';
}

// Exportar funciones al HTML (onclick, etc.)
window.refrescarPlanSemanal = refrescarPlanSemanal;
window.mostrarResumenDiario = mostrarResumenDiario;
window.mostrarEditorPlan = mostrarEditorPlan;
window.guardarEditorPlan = guardarEditorPlan;
window.cancelarEditorPlan = cancelarEditorPlan;
