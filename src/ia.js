// ============================================================
// ia.js  —  ANALISIS IA: NIVEL, TENDENCIA, ESTANCAMIENTO
// ============================================================
// Depende de: database.js (obtenerSesiones, actualizarUsuario, obtenerUsuarioPorId),
//             auth.js (actualizarInfoUsuario),
//             idiomas.js (t),
//             app.js (usuarioActual)
// ============================================================

// ------------------------------------------------------------
// ANALISIS IA — PUNTO DE ENTRADA
// ------------------------------------------------------------
// El boton "Analizar con IA" ejecuta tres analisis:
//   1. Nivel       — evalua si puede subir (60d + 15 sesiones + 60%)
//   2. Tendencia   — compara volumen semanal vs semana pasada
//   3. Estancamiento — detecta ejercicios sin mejora en 3 sesiones
// ------------------------------------------------------------

var botonIA = document.getElementById("boton-analizar");
var resultadoIA = document.getElementById("resultado-ia");

botonIA.addEventListener("click", function () {
  resultadoIA.style.display = "block";
  resultadoIA.innerHTML = '';
  var pAnalizando = document.createElement('p');
  pAnalizando.className = 'ia-texto-dorado';
  pAnalizando.textContent = t('analizando');
  resultadoIA.appendChild(pAnalizando);

  // setTimeout para que el DOM pinte "Analizando..." antes del bloqueo
  setTimeout(function () {
    try {
      var sesiones = obtenerSesiones(usuarioActual.id, 40);
      var container = document.createElement('div');

      // Titulo
      var titulo = document.createElement('h4');
      titulo.className = 'ia-titulo';
      titulo.textContent = t('analisisTitulo');
      container.appendChild(titulo);

      if (sesiones.length === 0) {
        var sinDatos = document.createElement('p');
        sinDatos.className = 'ia-texto';
        sinDatos.textContent = t('sinDatosAnalisis');
        container.appendChild(sinDatos);
        resultadoIA.innerHTML = '';
        resultadoIA.appendChild(container);
        return;
      }

      container.appendChild(crearListaSesiones(sesiones));
      container.appendChild(analizarNivel(sesiones));
      container.appendChild(analizarTendencia(sesiones));

      var infoEstancamiento = analizarEstancamiento(sesiones);
      if (infoEstancamiento) container.appendChild(infoEstancamiento);

      var seguir = document.createElement('p');
      seguir.className = 'ia-texto-verde';
      seguir.style.marginTop = '12px';
      seguir.textContent = t('seguirAsi');
      container.appendChild(seguir);

      resultadoIA.innerHTML = '';
      resultadoIA.appendChild(container);

    } catch (e) {
      resultadoIA.innerHTML = '';
      var pError = document.createElement('p');
      pError.style.color = '#f38ba8';
      pError.textContent = 'Error: ' + e.message;
      resultadoIA.appendChild(pError);
    }
  }, 800);
});


// ------------------------------------------------------------
// crearListaSesiones(sesiones)
// ------------------------------------------------------------
// Genera un bloque con las ultimas sesiones, cada una con
// un check (verde) si cumplio la meta o un cross (rojo) si no.
// ------------------------------------------------------------
function crearListaSesiones(sesiones) {
  var container = document.createElement('div');

  var subtitulo = document.createElement('h5');
  subtitulo.className = 'ia-subtitulo';
  subtitulo.textContent = t('ultimasSesiones');
  container.appendChild(subtitulo);

  var lista = document.createElement('div');
  lista.className = 'ia-lista-sesiones';

  for (var i = 0; i < sesiones.length; i++) {
    var s = sesiones[i];
    // Columnas: [0]=nombre, [1]=series_hechas, [2]=reps_hechas,
    //            [4]=fecha, [5]=reps_req, [6]=series_req
    var cumplio = s[1] >= s[6] && s[2] >= s[5];

    var item = document.createElement('div');
    item.className = 'ia-item-sesion';

    var spanInfo = document.createElement('span');
    var icono = document.createElement('span');
    icono.style.color = cumplio ? '#a6e3a1' : '#f38ba8';
    icono.textContent = cumplio ? '\u2713' : '\u2717';
    spanInfo.appendChild(icono);
    spanInfo.appendChild(document.createTextNode(' '));
    var strong = document.createElement('strong');
    strong.textContent = s[0];
    spanInfo.appendChild(strong);
    spanInfo.appendChild(document.createTextNode(' ' + s[1] + 'x' + s[2]));

    var spanFecha = document.createElement('span');
    spanFecha.className = 'ia-item-sesion-fecha';
    spanFecha.textContent = s[4];

    item.appendChild(spanInfo);
    item.appendChild(spanFecha);
    lista.appendChild(item);
  }

  container.appendChild(lista);
  return container;
}


// ------------------------------------------------------------
// analizarNivel(sesiones)
// ------------------------------------------------------------
// Evalua si el usuario cumple los requisitos para subir de nivel:
//   • 60+ dias desde el registro
//   • 15+ sesiones en su nivel actual
//   • 60%+ de metas cumplidas
// Si no cumple, muestra cuantos dias/sesiones faltan.
// ------------------------------------------------------------
function analizarNivel(sesiones) {
  var container = document.createElement('div');

  var subtitulo = document.createElement('h5');
  subtitulo.className = 'ia-subtitulo';
  subtitulo.textContent = t('nivelActual') + ': ' + t(usuarioActual.nivel.toLowerCase());
  container.appendChild(subtitulo);

  var niveles = ['', 'Principiante', 'Intermedio', 'Experto'];
  var nivelActualIdx = niveles.indexOf(usuarioActual.nivel);
  var puedeSubir = false;
  var nivelSiguiente = null;

  // Si ya es Experto (ultimo nivel) no puede subir mas
  if (nivelActualIdx <= 0 || nivelActualIdx >= 3) {
    var p = document.createElement('p');
    p.className = 'ia-texto-verde';
    p.textContent = t('seguirAsi');
    container.appendChild(p);
    return container;
  }

  nivelSiguiente = niveles[nivelActualIdx + 1];

  // Filtrar sesiones de su nivel actual
  var sesionesNivelActual = [];
  for (var i = 0; i < sesiones.length; i++) {
    var s = sesiones[i];
    if (s[8] > 0 && s[8] <= nivelActualIdx + 1) {
      sesionesNivelActual.push(s);
    }
  }

  // Calcular dias desde el registro
  var fechaReg;
  if (usuarioActual.creado_en) {
    fechaReg = new Date(usuarioActual.creado_en.split(' ')[0]);
  } else {
    fechaReg = new Date();
  }
  var hoyDate = new Date();
  var diffTime = hoyDate.getTime() - fechaReg.getTime();
  var diffDias = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Mostrar tiempo entrenando
  var pTiempo = document.createElement('p');
  pTiempo.className = 'ia-texto';
  pTiempo.textContent = t('entrenandoDesde') + ': ' + diffDias + ' ' + t('dias');
  container.appendChild(pTiempo);

  // Si cumple tiempo y sesiones minimas
  if (diffDias >= 60 && sesionesNivelActual.length >= 15) {
    var cumplidas = 0;
    for (var i = 0; i < sesionesNivelActual.length; i++) {
      var s = sesionesNivelActual[i];
      if (s[1] >= s[6] && s[2] >= s[5]) cumplidas++;
    }
    var porcentaje = (cumplidas / sesionesNivelActual.length) * 100;

    var pStats = document.createElement('p');
    pStats.className = 'ia-texto';
    pStats.textContent = sesionesNivelActual.length + ' sesiones en tu nivel — '
      + cumplidas + ' cumplieron la meta (' + Math.round(porcentaje) + '%)';
    container.appendChild(pStats);

    if (porcentaje >= 60) {
      puedeSubir = true;
    } else {
      var pMejora = document.createElement('p');
      pMejora.className = 'ia-texto-dorado';
      pMejora.textContent = t('mejorarRendimiento');
      container.appendChild(pMejora);
    }
  } else {
    var faltaTiempo = Math.max(0, 60 - diffDias);
    var faltaSesiones = Math.max(0, 15 - sesionesNivelActual.length);
    var pFalta = document.createElement('p');
    pFalta.className = 'ia-texto-dorado';
    var textoFalta = '';
    if (faltaTiempo > 0) textoFalta += t('faltan') + ' ' + faltaTiempo + ' ' + t('dias') + ' ';
    if (faltaSesiones > 0) textoFalta += t('y') + ' ' + faltaSesiones + ' ' + t('sesionesMas');
    textoFalta += ' ' + t('paraEvaluar');
    pFalta.textContent = textoFalta;
    container.appendChild(pFalta);
  }

  // Si puede subir, mostrar botones
  if (puedeSubir && nivelSiguiente) {
    var nivelSiguienteT = t(nivelSiguiente.toLowerCase());

    var card = document.createElement('div');
    card.className = 'ia-card-nivel';

    var pSuficiente = document.createElement('p');
    pSuficiente.textContent = t('progresoSuficiente');
    pSuficiente.style.cssText = 'color:#a6e3a1;font-weight:bold;margin-bottom:10px';
    card.appendChild(pSuficiente);

    var pPregunta = document.createElement('p');
    pPregunta.style.cssText = 'color:#cdd6f4;margin-bottom:12px';
    var textPre = document.createTextNode(t('listoSubir') + ' ');
    pPregunta.appendChild(textPre);
    var strongNivel = document.createElement('strong');
    strongNivel.textContent = nivelSiguienteT;
    pPregunta.appendChild(strongNivel);
    pPregunta.appendChild(document.createTextNode('?'));
    card.appendChild(pPregunta);

    var divBotones = document.createElement('div');
    divBotones.className = 'edit-form-acciones';

    var btnSi = document.createElement('button');
    btnSi.className = 'btn-subir-nivel confirmar';
    btnSi.textContent = t('siSubir') + ' (' + nivelSiguienteT + ')';
    btnSi.addEventListener('click', (function (nivel) {
      return function () { confirmarSubirNivel(nivel); };
    })(nivelSiguiente));
    divBotones.appendChild(btnSi);

    var btnNo = document.createElement('button');
    btnNo.className = 'btn-subir-nivel rechazar';
    btnNo.textContent = t('noSubir') + ' ' + t(usuarioActual.nivel.toLowerCase());
    btnNo.addEventListener('click', cancelarSubirNivel);
    divBotones.appendChild(btnNo);

    card.appendChild(divBotones);
    container.appendChild(card);
  }

  return container;
}


// ------------------------------------------------------------
// analizarTendencia(sesiones)
// ------------------------------------------------------------
// Calcula el volumen (series * reps) de esta semana y lo
// compara con la semana pasada. Muestra subiste/bajaste/igual%.
// Si no hay datos de la semana pasada, muestra "Primera semana".
// ------------------------------------------------------------
function analizarTendencia(sesiones) {
  var container = document.createElement('div');

  var subtitulo = document.createElement('h5');
  subtitulo.className = 'ia-subtitulo';
  subtitulo.textContent = t('tendenciaSemanal');
  container.appendChild(subtitulo);

  var ahora = new Date();
  var hace7 = new Date(ahora);
  hace7.setDate(hace7.getDate() - 7);
  var hace14 = new Date(ahora);
  hace14.setDate(hace14.getDate() - 14);

  var volSemana = 0;
  var volSemanaPasada = 0;
  var diasUnicos = {};

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

  var totalDias = 0;
  for (var d in diasUnicos) totalDias++;

  var card = document.createElement('div');
  card.className = 'ia-card';

  if (volSemana === 0 && volSemanaPasada === 0) {
    var p = document.createElement('p');
    p.className = 'ia-texto';
    p.style.fontSize = '0.85rem';
    p.textContent = t('sinDatosTendencia');
    card.appendChild(p);
  } else {
    if (volSemanaPasada < 10) {
      var pPrimera = document.createElement('p');
      pPrimera.textContent = t('primeraSemana');
      pPrimera.style.cssText = 'color:#a6e3a1;font-size:0.9rem';
      card.appendChild(pPrimera);
    } else if (volSemana > volSemanaPasada) {
      var dif = Math.round(((volSemana - volSemanaPasada) / volSemanaPasada) * 100);
      var pSubio = document.createElement('p');
      pSubio.appendChild(document.createTextNode(t('subiste') + ' '));
      var strongDif = document.createElement('strong');
      strongDif.textContent = dif + '%';
      pSubio.appendChild(strongDif);
      pSubio.appendChild(document.createTextNode(' ' + t('vsSemanaPasada')));
      pSubio.style.cssText = 'color:#a6e3a1;font-size:0.9rem';
      card.appendChild(pSubio);
    } else if (volSemana < volSemanaPasada) {
      var dif = Math.round(((volSemanaPasada - volSemana) / volSemanaPasada) * 100);
      var pBajo = document.createElement('p');
      pBajo.appendChild(document.createTextNode(t('bajaste') + ' '));
      var strongDif = document.createElement('strong');
      strongDif.textContent = dif + '%';
      pBajo.appendChild(strongDif);
      pBajo.appendChild(document.createTextNode(' ' + t('vsSemanaPasada')));
      pBajo.style.cssText = 'color:#f38ba8;font-size:0.9rem';
      card.appendChild(pBajo);
    } else {
      var pIgual = document.createElement('p');
      pIgual.textContent = t('igualQueSemanaPasada');
      pIgual.style.cssText = 'color:#f9e2af;font-size:0.9rem';
      card.appendChild(pIgual);
    }

    var pVol = document.createElement('p');
    pVol.textContent = t('volumenTotal') + ': ' + volSemana + ' — ' + totalDias + ' ' + t('diasEntrenados');
    pVol.style.cssText = 'color:#6c7086;font-size:0.8rem;margin-top:4px';
    card.appendChild(pVol);
  }

  container.appendChild(card);
  return container;
}


// ------------------------------------------------------------
// analizarEstancamiento(sesiones)
// ------------------------------------------------------------
// Agrupa sesiones por ejercicio. Si las ultimas 3 sesiones
// de un ejercicio NO cumplieron la meta (series/reps),
// lo marca como estancado y sugiere cambiar de progresion.
// Retorna null si no hay estancamiento.
// ------------------------------------------------------------
function analizarEstancamiento(sesiones) {
  // Agrupar sesiones por nombre de ejercicio
  var porEjercicio = {};
  for (var i = 0; i < sesiones.length; i++) {
    var s = sesiones[i];
    if (!porEjercicio[s[0]]) porEjercicio[s[0]] = [];
    porEjercicio[s[0]].push(s);
  }

  // Detectar estancados: 3+ sesiones consecutivas sin cumplir meta
  var estancados = [];
  for (var nombre in porEjercicio) {
    var list = porEjercicio[nombre];
    if (list.length >= 3) {
      var todosFallaron = true;
      for (var i = 0; i < 3; i++) {
        var ex = list[i];
        if (ex[1] >= ex[6] && ex[2] >= ex[5]) {
          todosFallaron = false;
          break;
        }
      }
      if (todosFallaron) estancados.push(nombre);
    }
  }

  if (estancados.length === 0) return null;

  var container = document.createElement('div');

  var subtitulo = document.createElement('h5');
  subtitulo.className = 'ia-subtitulo';
  subtitulo.textContent = t('estancamiento');
  container.appendChild(subtitulo);

  var card = document.createElement('div');
  card.className = 'ia-card-plateau';

  var pTitulo = document.createElement('p');
  pTitulo.className = 'ia-card-plateau-titulo';
  pTitulo.textContent = t('ejerciciosEstancados') + ':';
  card.appendChild(pTitulo);

  for (var i = 0; i < estancados.length; i++) {
    var pEj = document.createElement('p');
    pEj.className = 'ia-ejercicio-estancado';
    pEj.appendChild(document.createTextNode('\u2717 '));
    var strongEj = document.createElement('strong');
    strongEj.textContent = estancados[i];
    pEj.appendChild(strongEj);
    card.appendChild(pEj);
  }

  var pSugerencia = document.createElement('p');
  pSugerencia.textContent = t('sugerenciaEstancamiento');
  pSugerencia.style.cssText = 'color:#a6adc8;font-size:0.8rem;margin-top:6px';
  card.appendChild(pSugerencia);

  container.appendChild(card);
  return container;
}


// ------------------------------------------------------------
// confirmarSubirNivel(nuevoNivel)
// ------------------------------------------------------------
function confirmarSubirNivel(nuevoNivel) {
  actualizarUsuario(usuarioActual.id, usuarioActual.nombre, nuevoNivel,
    usuarioActual.peso, usuarioActual.altura, usuarioActual.objetivo);
  usuarioActual = obtenerUsuarioPorId(usuarioActual.id);
  actualizarInfoUsuario();

  var card = document.createElement('div');
  card.className = 'card-felicitaciones';

  var titulo = document.createElement('p');
  titulo.className = 'card-felicitaciones-titulo';
  titulo.appendChild(document.createTextNode(t('felicitaciones') + ' '));
  var strongNuevo = document.createElement('strong');
  strongNuevo.textContent = t(nuevoNivel.toLowerCase());
  titulo.appendChild(strongNuevo);
  titulo.appendChild(document.createTextNode('!'));
  card.appendChild(titulo);

  var sub = document.createElement('p');
  sub.className = 'ia-texto';
  sub.textContent = t('nivelSubido');
  card.appendChild(sub);

  resultadoIA.innerHTML = '';
  resultadoIA.appendChild(card);
}

// ------------------------------------------------------------
// cancelarSubirNivel()
// ------------------------------------------------------------
function cancelarSubirNivel() {
  resultadoIA.innerHTML = '';
  var p = document.createElement('p');
  p.className = 'ia-texto';
  p.textContent = t('noSubir') + ' ' + t(usuarioActual.nivel.toLowerCase()) + '.';
  resultadoIA.appendChild(p);
}

// Exportar funciones al HTML (onclick, etc.)
window.confirmarSubirNivel = confirmarSubirNivel;
window.cancelarSubirNivel = cancelarSubirNivel;
