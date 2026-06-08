// ============================================================
// renderer.js  —  NAVEGACION, CATALOGO, IA
// ============================================================

function cambiarSeccion(idDeSeccion, botonPresionado) {
  var secciones = document.querySelectorAll(".seccion");
  for (var i = 0; i < secciones.length; i++) {
    secciones[i].classList.remove("activa");
  }

  document.getElementById(idDeSeccion).classList.add("activa");

  var botones = document.querySelectorAll(".boton-nav");
  for (var i = 0; i < botones.length; i++) {
    botones[i].classList.remove("activo");
  }

  botonPresionado.classList.add("activo");

  if (idDeSeccion === "catalogo") {
    mostrarCatalogo();
  }
  if (idDeSeccion === "entrenar") {
    poblarSelectEjercicios();
  }
  if (idDeSeccion === "progreso" || idDeSeccion === "inicio") {
    refrescarHistorial();
  }
  if (idDeSeccion === "inicio") {
    refrescarPlanSemanal();
  }
}

// ------------------------------------------------------------
// refrescarHistorial()
// ------------------------------------------------------------
function refrescarHistorial() {
  if (!usuarioActual) return;
  var sesiones = obtenerSesiones(usuarioActual.id, 10);

  // Ultima sesion en Inicio
  var ultimaDiv = document.getElementById('texto-ultima-sesion');
  if (sesiones.length > 0) {
    var s = sesiones[0];
    ultimaDiv.innerHTML = '<strong>' + s[0] + '</strong> — ' + s[1] + 'x' + s[2] + ' (' + s[4] + ')';
  } else {
    ultimaDiv.innerHTML = t('sinSesiones');
    ultimaDiv.style.color = '#a6adc8';
    ultimaDiv.style.fontStyle = 'italic';
  }

  // Historial en Progreso
  var histDiv = document.getElementById('historial-sesiones');
  if (sesiones.length > 0) {
    var html = '<ul style="line-height:1.8;list-style:none;padding:0">';
    for (var i = 0; i < sesiones.length; i++) {
      var s = sesiones[i];
      html += '<li style="padding:8px 12px;margin-bottom:6px;background:#1e293b;border-radius:8px">' +
        '<strong>' + s[0] + '</strong> ' + s[1] + 'x' + s[2] +
        '<span style="color:#6c7086;float:right">' + s[4] + '</span>' +
        (s[3] ? '<br><small style="color:#a6adc8">' + s[3] + '</small>' : '') +
        '</li>';
    }
    html += '</ul>';
    histDiv.innerHTML = html;
  } else {
    histDiv.innerHTML = '<p style="color:#a6adc8;font-style:italic">' + t('sinHistorial') + '</p>';
  }
}

// ------------------------------------------------------------
// ANALISIS IA
// ------------------------------------------------------------
var botonIA = document.getElementById("boton-analizar");
var resultadoIA = document.getElementById("resultado-ia");

botonIA.addEventListener("click", function () {
  resultadoIA.style.display = "block";
  resultadoIA.innerHTML = '<p style="color: #f9e2af;">' + t('analizando') + '</p>';

  setTimeout(function () {
    var sesiones = obtenerSesiones(usuarioActual.id, 20);

    var html = '<h4 style="color: #a6e3a1; margin-top: 0;">' + t('analisisTitulo') + '</h4>';

    if (sesiones.length === 0) {
      html += '<p style="color: #a6adc8;">' + t('sinDatosAnalisis') + '</p>';
      resultadoIA.innerHTML = html;
      return;
    }

    // Session history summary
    html += '<h5 style="color:#cdd6f4;margin:10px 0 6px">' + t('ultimasSesiones') + '</h5>';
    html += '<div style="max-height:200px;overflow-y:auto">';
    for (var i = 0; i < sesiones.length; i++) {
      var s = sesiones[i];
      // s[0]=nombre, s[1]=series_hechas, s[2]=reps_hechas, s[4]=fecha, s[5]=reps_req, s[6]=series_req, s[8]=nivel
      var cumplio = s[1] >= s[6] && s[2] >= s[5];
      var icono = cumplio ? '<span style="color:#a6e3a1">&#10003;</span>' : '<span style="color:#f38ba8">&#10007;</span>';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 8px;margin:2px 0;background:#1e1e2e;border-radius:6px;font-size:0.85rem">' +
        '<span>' + icono + ' <strong>' + s[0] + '</strong> ' + s[1] + 'x' + s[2] + '</span>' +
        '<span style="color:#6c7086;font-size:0.75rem">' + s[4] + '</span>' +
      '</div>';
    }
    html += '</div>';

    // Level-up analysis
    html += '<h5 style="color:#cdd6f4;margin:12px 0 6px">' + t('nivelActual') + ': ' + t(usuarioActual.nivel.toLowerCase()) + '</h5>';

    var niveles = ['', 'Principiante', 'Intermedio', 'Experto'];
    var nivelActualIdx = niveles.indexOf(usuarioActual.nivel);
    var puedeSubir = false;
    var mensajeSubir = '';
    var nivelSiguiente = null;

    if (nivelActualIdx > 0 && nivelActualIdx < 3) {
      nivelSiguiente = niveles[nivelActualIdx + 1];
      var sesionesNivelActual = [];
      for (var i = 0; i < sesiones.length; i++) {
        var s = sesiones[i];
        if (s[8] > 0 && s[8] <= nivelActualIdx + 1) {
          sesionesNivelActual.push(s);
        }
      }

      if (sesionesNivelActual.length >= 2) {
        var cumplidas = 0;
        for (var i = 0; i < sesionesNivelActual.length; i++) {
          var s = sesionesNivelActual[i];
          if (s[1] >= s[6] && s[2] >= s[5]) cumplidas++;
        }
        var porcentaje = (cumplidas / sesionesNivelActual.length) * 100;

        mensajeSubir = '<p style="color:#a6adc8">' + sesionesNivelActual.length + ' sesiones en tu nivel — ' +
          cumplidas + ' cumplieron la meta (' + Math.round(porcentaje) + '%)</p>';

        if (porcentaje >= 70) {
          puedeSubir = true;
        } else {
          mensajeSubir += '<p style="color:#f9e2af">' + t('noSesionesNivel') + '</p>';
        }
      } else {
        mensajeSubir = '<p style="color:#f9e2af">' + t('noSesionesNivel') + '</p>';
      }
    } else {
      mensajeSubir = '<p style="color:#a6e3a1">' + t('seguirAsi') + '</p>';
    }

    html += mensajeSubir;

    if (puedeSubir && nivelSiguiente) {
      var nivelSiguienteT = t(nivelSiguiente.toLowerCase());
      html += '<div style="background:#1e1e2e;border:1px solid #a6e3a1;border-radius:10px;padding:14px;margin-top:10px">' +
        '<p style="color:#a6e3a1;font-weight:bold;margin-bottom:10px">' + t('progresoSuficiente') + '</p>' +
        '<p style="color:#cdd6f4;margin-bottom:12px">' + t('listoSubir') + ' <strong>' + nivelSiguienteT + '</strong>?</p>' +
        '<div style="display:flex;gap:8px">' +
          '<button onclick="confirmarSubirNivel(\'' + nivelSiguiente + '\')" style="flex:1;padding:10px;background:#a6e3a1;color:#1e1e2e;border:none;border-radius:8px;font-weight:bold;cursor:pointer">' +
            t('siSubir') + ' (' + nivelSiguienteT + ')' +
          '</button>' +
          '<button onclick="cancelarSubirNivel()" style="flex:1;padding:10px;background:#313244;color:#cdd6f4;border:none;border-radius:8px;cursor:pointer">' +
            t('noSubir') + ' ' + t(usuarioActual.nivel.toLowerCase()) +
          '</button>' +
        '</div>' +
      '</div>';
    }

    html += '<p style="color: #a6e3a1;margin-top:12px">' + t('seguirAsi') + '</p>';

    resultadoIA.innerHTML = html;
  }, 800);
});


// ------------------------------------------------------------
// confirmarSubirNivel(nuevoNivel)
// ------------------------------------------------------------
function confirmarSubirNivel(nuevoNivel) {
  actualizarUsuario(usuarioActual.id, usuarioActual.nombre, nuevoNivel, usuarioActual.peso, usuarioActual.altura, usuarioActual.objetivo);
  usuarioActual = obtenerUsuarioPorId(usuarioActual.id);
  actualizarInfoUsuario();
  resultadoIA.innerHTML = '<div style="background:#1e1e2e;border:1px solid #a6e3a1;border-radius:10px;padding:14px;margin-top:10px;text-align:center">' +
    '<p style="color:#a6e3a1;font-weight:bold;font-size:1.1rem">' + t('felicitaciones') + ' <strong>' + t(nuevoNivel.toLowerCase()) + '</strong>!</p>' +
    '<p style="color:#a6adc8">' + t('nivelSubido') + '</p>' +
  '</div>';
}

window.confirmarSubirNivel = confirmarSubirNivel;
window.cancelarSubirNivel = cancelarSubirNivel;


// ------------------------------------------------------------
// cancelarSubirNivel()
// ------------------------------------------------------------
function cancelarSubirNivel() {
  resultadoIA.innerHTML = '<p style="color:#a6adc8">' + t('noSubir') + ' ' + t(usuarioActual.nivel.toLowerCase()) + '.</p>';
}


// ------------------------------------------------------------
// DIAS DE LA SEMANA
// ------------------------------------------------------------
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

  var nivelMaximo = { Principiante: 2, Intermedio: 3, Experto: 5 }[usuarioActual.nivel] || 2;

  // Hoy destacado
  var hoyDiv = document.getElementById('texto-plan-hoy');
  if (hoyGrupo) {
    hoyDiv.innerHTML = '<strong style="font-size:1.1rem">' + t('hoy') + ' (' + DIAS[hoyIndex] + '): <span style="color:#a6e3a1">' + t(hoyGrupo.toLowerCase()) + '</span></strong>';
  } else {
    hoyDiv.innerHTML = '<strong style="font-size:1.1rem">' + t('hoy') + ' (' + DIAS[hoyIndex] + '): <span style="color:#6c7086">' + t('descanso') + '</span></strong>';
  }

  // Grilla semanal rediseñada
  var completoDiv = document.getElementById('texto-plan-completo');
  var html = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:10px">';
  for (var i = 0; i < plan.length; i++) {
    var grupo = plan[i].grupo;
    var grupoT = grupo ? t(grupo.toLowerCase()) : null;
    var esHoy = i === hoyIndex;
    var bg = esHoy ? 'background:#313244;border:1px solid #a6e3a1' : 'background:#1e1e2e;border:1px solid #313244';
    var txtColor = grupoT ? '#a6e3a1' : '#6c7086';
    html += '<div style="' + bg + ';padding:10px 4px;border-radius:10px;text-align:center;font-size:0.7rem;display:flex;flex-direction:column;align-items:center;gap:4px">' +
      '<div style="font-weight:bold;color:#cdd6f4;font-size:0.75rem">' + DIAS[i].substring(0, 3) + '</div>' +
      '<div style="color:' + txtColor + ';font-size:0.7rem;line-height:1.2">' + (grupoT || '—') + '</div>' +
      '</div>';
  }
  html += '</div>';
  completoDiv.innerHTML = html;

  // Recomendaciones del dia
  var tarjetaEj = document.getElementById('tarjeta-ejercicios-hoy');
  var textoEj = document.getElementById('texto-ejercicios-hoy');
  if (!hoyGrupo) {
    tarjetaEj.style.display = 'none';
    return;
  }

  var ejercicios = obtenerProgresionesPorGrupo(hoyGrupo, nivelMaximo);
  if (ejercicios.length === 0) {
    tarjetaEj.style.display = 'none';
    return;
  }

  var sesiones = obtenerSesiones(usuarioActual.id, 1);
  var primerVez = sesiones.length === 0;

  tarjetaEj.style.display = 'block';
  var ejHtml = '';
  if (primerVez) {
    ejHtml += '<div style="background:#1e1e2e;border:1px solid #f9e2af;border-radius:8px;padding:10px 12px;margin-bottom:10px;color:#f9e2af;font-size:0.9rem">' +
      '<img src="icons/target.svg" width="14" height="14" style="vertical-align:middle" /> ' + t('primeraVez') + '</div>';
  }
  ejHtml += '<p style="color:#a6adc8;margin-bottom:8px">' + t('ejerciciosPara') + ' ' + t(hoyGrupo.toLowerCase()) + ' ' + t('paraTuNivel') + ' (' + t(usuarioActual.nivel.toLowerCase()) + '):</p>' +
    '<div style="display:flex;flex-direction:column;gap:6px">';
  for (var i = 0; i < ejercicios.length; i++) {
    var e = ejercicios[i];
    ejHtml += '<div style="background:#1e1e2e;border-radius:8px;padding:10px 12px;border:1px solid #313244">' +
      '<div style="display:flex;justify-content:space-between;align-items:center">' +
        '<strong style="color:#cdd6f4">' + e[1] + '</strong>' +
        '<span style="color:#a6e3a1;font-size:0.85rem;font-weight:bold">' + t('nivelAbrev') + ' ' + e[3] + '</span>' +
      '</div>' +
      '<div style="color:#6c7086;font-size:0.85rem;margin-top:4px">' +
        (e[5] || '—') + ' ' + t('seriesAbrev') + ' x ' + (e[4] || '—') + ' ' + t('repsAbrev') +
        (e[6] ? ' — ' + e[6] : '') +
      '</div>' +
    '</div>';
  }
  ejHtml += '</div>';
  textoEj.innerHTML = ejHtml;
}


// ------------------------------------------------------------
// mostrarEditorPlan()
// ------------------------------------------------------------
function mostrarEditorPlan() {
  document.getElementById('tarjeta-plan-semanal').style.display = 'none';
  document.getElementById('tarjeta-editor-plan').style.display = 'block';

  var plan = obtenerPlanSemanal(usuarioActual.id);
  var DIAS = [t('lunes'), t('martes'), t('miercoles'), t('jueves'), t('viernes'), t('sabado'), t('domingo')];
  var html = '<table style="width:100%;border-collapse:collapse">';
  for (var i = 0; i < plan.length; i++) {
    html += '<tr>' +
      '<td style="padding:8px 12px;font-weight:bold;color:#cdd6f4;width:90px">' + DIAS[i] + '</td>' +
      '<td style="padding:8px">' +
        '<select id="plan-grupo-' + i + '" class="select-ejercicio" style="width:100%">' +
          '<option value="">' + t('descanso') + '</option>' +
          '<option value="Espalda"'  + (plan[i].grupo === 'Espalda' ? ' selected' : '') + '>' + t('espalda') + '</option>' +
          '<option value="Pecho"'    + (plan[i].grupo === 'Pecho' ? ' selected' : '') + '>' + t('pecho') + '</option>' +
          '<option value="Hombros"'  + (plan[i].grupo === 'Hombros' ? ' selected' : '') + '>' + t('hombros') + '</option>' +
          '<option value="Abdomen"'  + (plan[i].grupo === 'Abdomen' ? ' selected' : '') + '>' + t('abdomen') + '</option>' +
          '<option value="Piernas"'  + (plan[i].grupo === 'Piernas' ? ' selected' : '') + '>' + t('piernas') + '</option>' +
        '</select>' +
      '</td>' +
    '</tr>';
  }
  html += '</table>';
  document.getElementById('editor-plan-contenido').innerHTML = html;
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
