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
// Muestra las ultimas 10 sesiones en dos lugares:
//   1. Inicio: la sesion mas reciente
//   2. Progreso: lista completa con botones Editar/Eliminar
// Columnas devueltas por obtenerSesiones():
//   [0]=nombre, [1]=series_hechas, [2]=reps_hechas, [3]=notas,
//   [4]=fecha, [5]=reps_requeridas, [6]=series_requeridas,
//   [7]=grupo_muscular, [8]=nivel, [9]=s.id
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
      var idSesion = s[9];
      html += '<li style="padding:8px 12px;margin-bottom:6px;background:#1e293b;border-radius:8px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<div style="flex:1">' +
            '<strong>' + s[0] + '</strong> ' + s[1] + 'x' + s[2] +
            '<span style="color:#6c7086;margin-left:8px;font-size:0.8rem">' + s[4] + '</span>' +
            (s[3] ? '<br><small style="color:#a6adc8">' + s[3] + '</small>' : '') +
          '</div>' +
          '<div style="display:flex;gap:4px;flex-shrink:0">' +
            '<button onclick="editarSesionClick(' + idSesion + ')" style="padding:4px 8px;background:#313244;color:#cdd6f4;border:none;border-radius:4px;cursor:pointer;font-size:0.75rem">' +
              '<img src="icons/new.svg" width="12" height="12" /> ' + t('editar') +
            '</button>' +
            '<button onclick="eliminarSesionClick(' + idSesion + ')" style="padding:4px 8px;background:#313244;color:#f38ba8;border:none;border-radius:4px;cursor:pointer;font-size:0.75rem">' +
              '<img src="icons/new.svg" width="12" height="12" /> ' + t('eliminar') +
            '</button>' +
          '</div>' +
        '</div>' +
        '</li>';
    }
    html += '</ul>';
    histDiv.innerHTML = html;
  } else {
    histDiv.innerHTML = '<p style="color:#a6adc8;font-style:italic">' + t('sinHistorial') + '</p>';
  }
}


// ------------------------------------------------------------
// editarSesionClick(id)
// ------------------------------------------------------------
function editarSesionClick(id) {
  var sesiones = obtenerSesiones(usuarioActual.id, 100);
  var sesion = null;
  for (var i = 0; i < sesiones.length; i++) {
    if (sesiones[i][9] === id) { sesion = sesiones[i]; break; }
  }
  if (!sesion) return;

  var histDiv = document.getElementById('historial-sesiones');
  histDiv.innerHTML =
    '<div style="background:#151520;border:1px solid #313244;border-radius:10px;padding:16px">' +
      '<h4 style="color:#cdd6f4;margin:0 0 10px">' + t('editando') + ': ' + sesion[0] + '</h4>' +
      '<div class="fila-inputs" style="margin-bottom:8px">' +
        '<div class="columna-input">' +
          '<label class="label-ejercicio">' + t('lblSeries') + '</label>' +
          '<input type="number" id="edit-series-' + id + '" class="input-ejercicio" value="' + sesion[1] + '" min="1" />' +
        '</div>' +
        '<div class="columna-input">' +
          '<label class="label-ejercicio">' + t('lblReps') + '</label>' +
          '<input type="number" id="edit-reps-' + id + '" class="input-ejercicio" value="' + sesion[2] + '" min="1" />' +
        '</div>' +
      '</div>' +
      '<div class="grupo-input">' +
        '<label class="label-ejercicio">' + t('lblNotas') + '</label>' +
        '<input type="text" id="edit-notas-' + id + '" class="input-ejercicio" value="' + (sesion[3] || '') + '" />' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-top:10px">' +
        '<button onclick="guardarEdicionSesion(' + id + ')" class="btn-guardar-ejercicio" style="flex:1">' +
          '<img src="icons/check.svg" width="16" height="16" style="vertical-align:middle" /> ' + t('guardarCambios') +
        '</button>' +
        '<button onclick="refrescarHistorial()" class="btn-catalogo" style="flex:1">' +
          t('cancelar') +
        '</button>' +
      '</div>' +
    '</div>';
}


// ------------------------------------------------------------
// guardarEdicionSesion(id)
// ------------------------------------------------------------
function guardarEdicionSesion(id) {
  var series = parseInt(document.getElementById('edit-series-' + id).value);
  var reps = parseInt(document.getElementById('edit-reps-' + id).value);
  var notas = document.getElementById('edit-notas-' + id).value.trim();

  if (!series || !reps) { alert(t('completarCampos')); return; }

  actualizarSesion(id, series, reps, notas);
  refrescarHistorial();
  mostrarResumenDiario();
}


// ------------------------------------------------------------
// eliminarSesionClick(id)
// ------------------------------------------------------------
function eliminarSesionClick(id) {
  if (!confirm(t('confirmEliminarSesion'))) return;
  eliminarSesion(id);
  refrescarHistorial();
  mostrarResumenDiario();
}


window.editarSesionClick = editarSesionClick;
window.eliminarSesionClick = eliminarSesionClick;
window.guardarEdicionSesion = guardarEdicionSesion;


// ------------------------------------------------------------
// ANALISIS IA
// ------------------------------------------------------------
var botonIA = document.getElementById("boton-analizar");
var resultadoIA = document.getElementById("resultado-ia");

botonIA.addEventListener("click", function () {
  resultadoIA.style.display = "block";
  resultadoIA.innerHTML = '<p style="color: #f9e2af;">' + t('analizando') + '</p>';
  // Usamos setTimeout para que el DOM se actualice con "Analizando..."
  // antes de que el bucle pesado de analisis bloquee el hilo.
  // Todo el analisis esta dentro de try/catch para que un error JS
  // no deje el mensaje "Analizando..." para siempre.

  setTimeout(function () {
    try {
      var sesiones = obtenerSesiones(usuarioActual.id, 40);

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

    // ---- NIVEL: evaluar si puede subir ----
    // Requisitos para ascender:
    //   • 60+ dias desde el registro
    //   • 15+ sesiones en su nivel actual
    //   • 60%+ de esas sesiones cumplieron la meta
    // Si no cumple, muestra cuantos dias/sesiones faltan.
    // ------------------------------------------------------------
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

      // Calcular tiempo desde que se registro
      var fechaReg;
      if (usuarioActual.creado_en) {
        fechaReg = new Date(usuarioActual.creado_en.split(' ')[0]);
      } else {
        fechaReg = new Date();
      }
      var hoyDate = new Date();
      var diffTime = hoyDate.getTime() - fechaReg.getTime();
      var diffDias = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      mensajeSubir = '<p style="color:#a6adc8">' + t('entrenandoDesde') + ': ' + diffDias + ' ' + t('dias') + '</p>';

      if (diffDias >= 60 && sesionesNivelActual.length >= 15) {
        var cumplidas = 0;
        for (var i = 0; i < sesionesNivelActual.length; i++) {
          var s = sesionesNivelActual[i];
          if (s[1] >= s[6] && s[2] >= s[5]) cumplidas++;
        }
        var porcentaje = (cumplidas / sesionesNivelActual.length) * 100;

        mensajeSubir += '<p style="color:#a6adc8">' + sesionesNivelActual.length + ' sesiones en tu nivel — ' +
          cumplidas + ' cumplieron la meta (' + Math.round(porcentaje) + '%)</p>';

        if (porcentaje >= 60) {
          puedeSubir = true;
        } else {
          mensajeSubir += '<p style="color:#f9e2af">' + t('mejorarRendimiento') + '</p>';
        }
      } else {
        var faltaTiempo = Math.max(0, 60 - diffDias);
        var faltaSesiones = Math.max(0, 15 - sesionesNivelActual.length);
        mensajeSubir += '<p style="color:#f9e2af">';
        if (faltaTiempo > 0) mensajeSubir += t('faltan') + ' ' + faltaTiempo + ' ' + t('dias') + ' ';
        if (faltaSesiones > 0) mensajeSubir += t('y') + ' ' + faltaSesiones + ' ' + t('sesionesMas');
        mensajeSubir += ' ' + t('paraEvaluar') + '</p>';
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

    // ---- TENDENCIA SEMANAL ----
    // Calcula el volumen total (series * reps) de esta semana
    // y lo compara con el de la semana pasada. Muestra el %
    // de cambio (subiste / bajaste / igual).
    // Si no hay datos de la semana pasada, muestra "Primera semana".
    // ------------------------------------------------------------
    var ahora = new Date();
    var hace7 = new Date(ahora); hace7.setDate(hace7.getDate() - 7);
    var hace14 = new Date(ahora); hace14.setDate(hace14.getDate() - 14);

    var volSemana = 0, volSemanaPasada = 0, diasEntrenados = 0, diasUnicos = {};
    for (var i = 0; i < sesiones.length; i++) {
      var s = sesiones[i];
      var fechaSesion = new Date(s[4].split(' ')[0]);
      var vol = s[1] * s[2];
      if (fechaSesion >= hace7) {
        volSemana += vol;
        diasUnicos[s[4].split(' ')[0]] = true;
      } else if (fechaSesion >= hace14) {
        volSemanaPasada += vol;
      }
    }
    var totalDias = 0; for (var d in diasUnicos) totalDias++;

    html += '<h5 style="color:#cdd6f4;margin:12px 0 6px">' + t('tendenciaSemanal') + '</h5>';
    html += '<div style="background:#1e1e2e;border-radius:8px;padding:10px;margin-bottom:8px">';
    if (volSemana === 0 && volSemanaPasada === 0) {
      html += '<p style="color:#a6adc8;font-size:0.85rem">' + t('sinDatosTendencia') + '</p>';
    } else {
      if (volSemanaPasada < 10) {
        html += '<p style="color:#a6e3a1;font-size:0.9rem">' + t('primeraSemana') + '</p>';
      } else if (volSemana > volSemanaPasada) {
        var dif = Math.round(((volSemana - volSemanaPasada) / volSemanaPasada) * 100);
        html += '<p style="color:#a6e3a1;font-size:0.9rem">' + t('subiste') + ' <strong>' + dif + '%</strong> ' + t('vsSemanaPasada') + '</p>';
      } else if (volSemana < volSemanaPasada) {
        var dif = Math.round(((volSemanaPasada - volSemana) / volSemanaPasada) * 100);
        html += '<p style="color:#f38ba8;font-size:0.9rem">' + t('bajaste') + ' <strong>' + dif + '%</strong> ' + t('vsSemanaPasada') + '</p>';
      } else {
        html += '<p style="color:#f9e2af;font-size:0.9rem">' + t('igualQueSemanaPasada') + '</p>';
      }
      html += '<p style="color:#6c7086;font-size:0.8rem;margin-top:4px">' + t('volumenTotal') + ': ' + volSemana + ' — ' + totalDias + ' ' + t('diasEntrenados') + '</p>';
    }
    html += '</div>';

    // ---- ESTANCAMIENTO (PLATEAU) ----
    // Agrupa las sesiones por nombre de ejercicio. Si las
    // ultimas 3 sesiones de ese ejercicio NO cumplieron la meta
    // (series_hechas < series_requeridas O reps_hechas < reps_requeridas),
    // lo marca como estancado y sugiere cambiar de progresion.
    // ------------------------------------------------------------
    var porEjercicio = {};
    for (var i = 0; i < sesiones.length; i++) {
      var s = sesiones[i];
      if (!porEjercicio[s[0]]) porEjercicio[s[0]] = [];
      porEjercicio[s[0]].push(s);
    }

    var estancados = [];
    for (var nombre in porEjercicio) {
      var list = porEjercicio[nombre];
      if (list.length >= 3) {
        var todosFallaron = true;
        for (var i = 0; i < 3; i++) {
          var ex = list[i];
          if (ex[1] >= ex[6] && ex[2] >= ex[5]) { todosFallaron = false; break; }
        }
        if (todosFallaron) estancados.push(nombre);
      }
    }

    if (estancados.length > 0) {
      html += '<h5 style="color:#cdd6f4;margin:12px 0 6px">' + t('estancamiento') + '</h5>';
      html += '<div style="background:#1e1e2e;border:1px solid #f38ba8;border-radius:8px;padding:10px;margin-bottom:8px">';
      html += '<p style="color:#f38ba8;font-size:0.85rem;margin-bottom:6px">' + t('ejerciciosEstancados') + ':</p>';
      for (var i = 0; i < estancados.length; i++) {
        html += '<p style="color:#cdd6f4;font-size:0.85rem;padding:3px 0">&#10007; <strong>' + estancados[i] + '</strong></p>';
      }
      html += '<p style="color:#a6adc8;font-size:0.8rem;margin-top:6px">' + t('sugerenciaEstancamiento') + '</p>';
      html += '</div>';
    }

    html += '<p style="color: #a6e3a1;margin-top:12px">' + t('seguirAsi') + '</p>';

    resultadoIA.innerHTML = html;
    } catch (e) {
      resultadoIA.innerHTML = '<p style="color:#f38ba8">Error: ' + e.message + '</p>';
    }
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
  tarjetaResumen = document.getElementById('tarjeta-resumen-diario');
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

  var nivelMaximo = { Principiante: 2, Intermedio: 3, Experto: 5 }[usuarioActual.nivel] || 2;
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

  var pct = total > 0 ? Math.round((completados / total) * 100) : 0;
  var color = completados === total ? '#a6e3a1' : (completados > 0 ? '#f9e2af' : '#f38ba8');

  var html = '<div style="text-align:center;padding:5px">' +
    '<div style="font-size:2.2rem;font-weight:bold;color:' + color + '">' +
      completados + ' / ' + total +
    '</div>' +
    '<div style="color:#a6adc8;margin-top:2px;font-size:0.85rem">' + t('ejerciciosCompletados') + '</div>' +
    '<div style="margin-top:8px;height:8px;background:#313244;border-radius:4px;overflow:hidden">' +
      '<div style="height:100%;width:' + pct + '%;background:' + color + ';border-radius:4px;transition:width 0.3s"></div>' +
    '</div>' +
    '<div style="margin-top:10px;text-align:left">';

  for (var i = 0; i < ejerciciosRecomendados.length; i++) {
    var e = ejerciciosRecomendados[i];
    var hecho = false;
    for (var j = 0; j < sesionesHoy.length; j++) {
      if (sesionesHoy[j][0] === e[1]) { hecho = true; break; }
    }
    html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #1e1e2e">' +
      '<span>' +
        (hecho
          ? '<span style="color:#a6e3a1">&#10003;</span>'
          : '<span style="color:#f38ba8">&#10007;</span>') +
        ' <strong style="color:#cdd6f4;font-size:0.85rem">' + e[1] + '</strong>' +
      '</span>' +
      '<span style="color:#6c7086;font-size:0.75rem">' + t('nivelAbrev') + ' ' + e[3] + '</span>' +
    '</div>';
  }

  html += '</div></div>';
  div.innerHTML = html;
}

window.mostrarResumenDiario = mostrarResumenDiario;


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
