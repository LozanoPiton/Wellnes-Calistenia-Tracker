// ============================================================
// ia.js  —  ANALISIS IA: Groq + FALLBACK LOCAL
// ============================================================
// Depende de: database.js, auth.js, idiomas.js, app.js
// ============================================================

var botonIA = document.getElementById("boton-analizar");
var resultadoIA = document.getElementById("resultado-ia");
var { ipcRenderer } = require("electron");

// Helper DOM — crear elemento con clase y texto opcionales
function crear(tag, clase, texto) {
  var el = document.createElement(tag);
  if (clase) el.className = clase;
  if (texto != null) el.textContent = texto;
  return el;
}

function nivelMaximo() {
  return { "Principiante": 1, "Intermedio": 2, "Experto": 3 }[usuarioActual.nivel] || 1;
}

(function initKey() {
  var saved = localStorage.getItem("groqKey");
  if (saved) {
    ipcRenderer.invoke("groq-set-key", saved);
  }
})();

// ------------------------------------------------------------
// ejecutarAnalisisIA()  —  compartido entre boton y auto-analisis
// ------------------------------------------------------------
function ejecutarAnalisisIA() {
  resultadoIA.style.display = "block";
  resultadoIA.innerHTML = "";
  resultadoIA.appendChild(crear("p", "ia-texto-dorado", t("analizando")));

  setTimeout(function () {
    try {
      var sesiones = obtenerSesiones(usuarioActual.id, 15);
      var container = crear("div");
      container.appendChild(crear("h4", "ia-titulo", t("analisisTitulo")));

      if (sesiones.length === 0) {
        container.appendChild(crear("p", "ia-texto", t("sinDatosAnalisis")));
        return volcar(container);
      }

      container.appendChild(crearListaSesiones(sesiones));

      var plan = obtenerPlanSemanal(usuarioActual.id);
      var planMap = {};
      if (plan && plan.length > 0) {
        for (var p = 0; p < plan.length; p++) {
          planMap[plan[p][0]] = plan[p][1];
        }
      }

      iaAnalizar(sesiones, planMap).then(function (respuesta) {
        resultadoIA.innerHTML = "";
        if (respuesta.error === "no-key") {
          container.appendChild(crearInputAPIKey());
        } else if (respuesta.error) {
          container.appendChild(errorMsg(respuesta.error));
        } else {
          container.appendChild(renderizarIA(respuesta));
        }
        container.appendChild(analizarLocalCompleto(sesiones));
        resultadoIA.appendChild(container);
      }).catch(function (e) {
        resultadoIA.innerHTML = "";
        container.appendChild(errorMsg(e.message));
        container.appendChild(analizarLocalCompleto(sesiones));
        resultadoIA.appendChild(container);
      });

    } catch (e) {
      volcar(crear("p", "ia-texto-danger", "Error: " + e.message));
    }
  }, 800);

  function volcar(el) {
    resultadoIA.innerHTML = "";
    resultadoIA.appendChild(el);
  }
}

// ------------------------------------------------------------
// Boton: Analizar con IA
// ------------------------------------------------------------
botonIA.addEventListener("click", ejecutarAnalisisIA);

// ------------------------------------------------------------
// iaAnalizar(sesiones) → llama a main process
// ------------------------------------------------------------
async function iaAnalizar(sesiones, planSemanal) {
  var fechaReg;
  if (usuarioActual.creado_en) {
    fechaReg = new Date(usuarioActual.creado_en.split(" ")[0]);
  } else {
    fechaReg = new Date();
  }
  var hoy = new Date();
  var diffDias = Math.floor((hoy.getTime() - fechaReg.getTime()) / (1000 * 60 * 60 * 24));

  // Formatear sesiones solo con campos utiles para la IA
  var slim = [];
  for (var i = 0; i < sesiones.length; i++) {
    var s = sesiones[i];
    slim.push([s[0], s[1], s[2], s[4], s[5], s[6], s[7]]);
  }

  // Obtener catalogo filtrado por nivel del usuario
  var nivelMax = { "Principiante": 1, "Intermedio": 2, "Experto": 3 }[usuarioActual.nivel] || 1;
  var catalogo = obtenerTodasProgresiones(nivelMax);

  return await ipcRenderer.invoke("groq-analyze", {
    nivel: usuarioActual.nivel,
    diasDesdeRegistro: diffDias,
    objetivo: usuarioActual.objetivo || "",
    planSemanal: planSemanal || {},
    sesiones: slim,
    catalogo: catalogo
  });
}

// ------------------------------------------------------------
// renderizarIA(respuesta)  —  COACHING IA (no pisa lo local)
// ------------------------------------------------------------
function renderizarIA(r) {
  var card = crear("div", "ia-coach-card");
  card.appendChild(crear("h5", "ia-coach-titulo", "\uD83C\uDFCB\uFE0F\u200D\u2642\uFE0F Coach IA"));

  if (r.observaciones) card.appendChild(crear("p", "ia-texto-obs", r.observaciones));
  if (r.recomendaciones) {
    for (var i = 0; i < r.recomendaciones.length; i++) {
      card.appendChild(crear("p", "ia-texto-rec", "\u25B8 " + r.recomendaciones[i]));
    }
  }
  if (r.tecnicas) card.appendChild(crear("p", "ia-texto-tec", "\uD83D\uDD0D " + r.tecnicas));
  if (r.planSugerido) card.appendChild(crear("p", "ia-texto-plan", "\uD83D\uDCCB " + r.planSugerido));

  var container = crear("div");
  container.appendChild(card);

  if (r.ejerciciosRecomendados) {
    for (var ei = 0; ei < r.ejerciciosRecomendados.length; ei++) {
      var item = r.ejerciciosRecomendados[ei];
      var recCard = crear("div", "ia-card-recomendacion");
      recCard.appendChild(crear("p", "ia-rec-titulo", "\uD83D\uDCA1 " + t("alternativasPara") + " " + item.ejercicioEstancado + ":"));
      if (item.sugerencias) {
        for (var si = 0; si < item.sugerencias.length; si++) {
          recCard.appendChild(crear("span", "ia-rec-ejercicio", item.sugerencias[si]));
        }
      }
      container.appendChild(recCard);
    }
  }
  return container;
}

// ------------------------------------------------------------
// crearBotonSubir(nivel)
// ------------------------------------------------------------
function crearBotonSubir(nivel) {
  var card = crear("div", "ia-card-nivel");
  card.appendChild(crear("p", "ia-texto-exito", t("progresoSuficiente")));

  var pPreg = crear("p", "ia-texto-preg");
  pPreg.appendChild(document.createTextNode(t("listoSubir") + " "));
  var strong = document.createElement("strong");
  strong.textContent = t(nivel.toLowerCase());
  pPreg.appendChild(strong);
  pPreg.appendChild(document.createTextNode("?"));
  card.appendChild(pPreg);

  var divBtns = crear("div", "edit-form-acciones");

  var btnSi = crear("button", "btn-subir-nivel confirmar", t("siSubir") + " (" + t(nivel.toLowerCase()) + ")");
  btnSi.addEventListener("click", function (n) {
    return function () { confirmarSubirNivel(n); };
  }(nivel));
  divBtns.appendChild(btnSi);

  var btnNo = crear("button", "btn-subir-nivel rechazar", t("noSubir") + " " + t(usuarioActual.nivel.toLowerCase()));
  btnNo.addEventListener("click", cancelarSubirNivel);
  divBtns.appendChild(btnNo);

  card.appendChild(divBtns);
  return card;
}

// ------------------------------------------------------------
// crearInputAPIKey()
// ------------------------------------------------------------
function crearInputAPIKey() {
  var div = crear("div", "ia-card-warn");
  div.appendChild(crear("p", "ia-texto-warn", "No hay API key de Groq. Pega tu key para activar el analisis con IA:"));

  var inputRow = crear("div", "ia-flex-row");
  var input = document.createElement("input");
  input.type = "text";
  input.placeholder = "gsk_...";
  input.className = "ia-input-key";
  inputRow.appendChild(input);

  var btn = crear("button", "ia-btn-guardar-key", "Guardar");
  btn.addEventListener("click", function () {
    var key = input.value.trim();
    if (key) {
      localStorage.setItem("groqKey", key);
      ipcRenderer.invoke("groq-set-key", key);
      input.disabled = true;
      btn.textContent = "\u2713 Listo";
      btn.className = "ia-btn-guardar-key ia-btn-guardado";
      botonIA.click();
    }
  });
  inputRow.appendChild(btn);
  div.appendChild(inputRow);
  div.appendChild(crear("p", "ia-texto-muted", "La key se guarda localmente. Saca tuya en https://console.groq.com/keys"));
  return div;
}

function errorMsg(msg) {
  var div = crear("div", "ia-card-error");
  div.appendChild(crear("p", "ia-texto-danger", "Error IA: " + msg));
  return div;
}

// ============================================================
// FALLBACK LOCAL
// ============================================================

function analizarLocalCompleto(sesiones) {
  var container = crear("div");
  container.appendChild(analizarNivel(sesiones));
  container.appendChild(analizarTendencia(sesiones));
  var infoEst = analizarEstancamiento(sesiones);
  if (infoEst) container.appendChild(infoEst);
  var seguir = crear("p", "ia-texto-verde", t("seguirAsi"));
  seguir.style.marginTop = "12px";
  container.appendChild(seguir);
  return container;
}

function crearListaSesiones(sesiones) {
  var container = crear("div");
  container.appendChild(crear("h5", "ia-subtitulo", t("ultimasSesiones")));

  var lista = crear("div", "ia-lista-sesiones");
  for (var i = 0; i < sesiones.length; i++) {
    var s = sesiones[i];
    var cumplio = s[1] >= s[6] && s[2] >= s[5];
    var item = crear("div", "ia-item-sesion");

    var spanInfo = document.createElement("span");
    var icono = document.createElement("span");
    icono.style.color = cumplio ? "var(--success)" : "var(--danger)";
    icono.textContent = cumplio ? "\u2713" : "\u2717";
    spanInfo.appendChild(icono);
    spanInfo.appendChild(document.createTextNode(" "));
    var strong = document.createElement("strong");
    strong.textContent = s[0];
    spanInfo.appendChild(strong);
    spanInfo.appendChild(document.createTextNode(" " + s[1] + "x" + s[2]));

    item.appendChild(spanInfo);
    item.appendChild(crear("span", "ia-item-sesion-fecha", s[4]));
    lista.appendChild(item);
  }
  container.appendChild(lista);
  return container;
}

function analizarNivel(sesiones) {
  var container = crear("div");
  container.appendChild(crear("h5", "ia-subtitulo", t("nivelActual") + ": " + t(usuarioActual.nivel.toLowerCase())));

  var niveles = ["", "Principiante", "Intermedio", "Experto"];
  var idx = niveles.indexOf(usuarioActual.nivel);
  if (idx <= 0 || idx >= 3) {
    container.appendChild(crear("p", "ia-texto-verde", t("seguirAsi")));
    return container;
  }
  var sig = niveles[idx + 1];

  var actuales = [];
  for (var i = 0; i < sesiones.length; i++) {
    var s = sesiones[i];
    if (s[8] > 0 && s[8] <= idx + 1) actuales.push(s);
  }

  var dias = usarDiasTranscurridos();
  container.appendChild(crear("p", "ia-texto", t("entrenandoDesde") + ": " + dias + " " + t("dias")));

  var puede = false;
  if (dias >= 60 && actuales.length >= 15) {
    var cumplidas = 0;
    for (i = 0; i < actuales.length; i++) {
      if (actuales[i][1] >= actuales[i][6] && actuales[i][2] >= actuales[i][5]) cumplidas++;
    }
    var pct = (cumplidas / actuales.length) * 100;
    container.appendChild(crear("p", "ia-texto", actuales.length + " sesiones en tu nivel \u2014 " + cumplidas + " cumplieron la meta (" + Math.round(pct) + "%)"));
    if (pct >= 60) {
      puede = true;
    } else {
      container.appendChild(crear("p", "ia-texto-dorado", t("mejorarRendimiento")));
    }
  } else {
    container.appendChild(crearBarraProgreso(dias, actuales.length));
  }

  if (puede && sig) container.appendChild(crearBotonSubir(sig));
  return container;
}

function crearBarraProgreso(dias, ses) {
  var pDias = Math.min(dias / 60, 1) * 100;
  var pSes = Math.min(ses / 15, 1) * 100;
  var total = Math.min(pDias, pSes);

  var div = crear("div", "progreso-ascenso");
  var barra = crear("div", "progreso-ascenso-barra");
  var relleno = crear("div", "progreso-ascenso-relleno");
  relleno.style.width = Math.round(total) + "%";
  barra.appendChild(relleno);
  div.appendChild(barra);
  div.appendChild(crear("span", "progreso-ascenso-texto", Math.round(total) + "% " + t("paraAscenso")));

  var det = crear("div", "progreso-ascenso-detalle");
  det.appendChild(crear("span", null, "\uD83D\uDCC5 " + dias + "/60 " + t("dias")));
  det.appendChild(crear("span", null, "\uD83D\uDCAA " + ses + "/15 " + t("sesiones")));
  div.appendChild(det);
  return div;
}

function usarDiasTranscurridos() {
  var fechaReg = usuarioActual.creado_en ? new Date(usuarioActual.creado_en.split(" ")[0]) : new Date();
  return Math.floor((Date.now() - fechaReg.getTime()) / (1000 * 60 * 60 * 24));
}

function analizarTendencia(sesiones) {
  var container = crear("div");
  container.appendChild(crear("h5", "ia-subtitulo", t("tendenciaSemanal")));

  var ahora = new Date();
  var hace7 = new Date(+ahora - 604800000);
  var hace14 = new Date(+ahora - 1209600000);

  var volSem = 0, volAnt = 0, diasU = {};
  for (var i = 0; i < sesiones.length; i++) {
    var s = sesiones[i];
    var f = new Date(s[4].split(" ")[0]);
    var vol = s[1] * s[2];
    if (f >= hace7) { volSem += vol; diasU[s[4].split(" ")[0]] = true; }
    else if (f >= hace14) volAnt += vol;
  }
  var totDias = 0; for (var d in diasU) totDias++;

  var card = crear("div", "ia-card");
  if (volSem === 0 && volAnt === 0) {
    card.appendChild(crear("p", "ia-texto", t("sinDatosTendencia")));
  } else {
    if (volAnt < 10) {
      card.appendChild(crear("p", "ia-texto-success", t("primeraSemana")));
    } else {
      var subio = volSem > volAnt;
      var igual = volSem === volAnt;
      var dif = Math.round((Math.abs(volSem - volAnt) / volAnt) * 100);
      var clase = subio ? "ia-texto-success" : igual ? "ia-texto-warn" : "ia-texto-error";
      var verbo = subio ? t("subiste") : igual ? t("igualQueSemanaPasada") : t("bajaste");
      var p = crear("p", clase);
      if (!igual) {
        p.appendChild(document.createTextNode(verbo + " "));
        var st = document.createElement("strong");
        st.textContent = dif + "%";
        p.appendChild(st);
        p.appendChild(document.createTextNode(" " + t("vsSemanaPasada")));
      } else {
        p.textContent = verbo;
      }
      card.appendChild(p);
    }
    card.appendChild(crear("p", "ia-texto-muted-vol", t("volumenTotal") + ": " + volSem + " \u2014 " + totDias + " " + t("diasEntrenados")));
  }
  container.appendChild(card);
  return container;
}

function analizarEstancamiento(sesiones) {
  var porEj = {}, grupoDe = {};
  for (var i = 0; i < sesiones.length; i++) {
    var s = sesiones[i];
    if (!porEj[s[0]]) porEj[s[0]] = [];
    porEj[s[0]].push(s);
    grupoDe[s[0]] = s[7];
  }

  var estancados = [];
  for (var nom in porEj) {
    var list = porEj[nom];
    if (list.length >= 3) {
      var mal = true;
      for (var i2 = 0; i2 < 3; i2++) {
        var ex = list[i2];
        if (ex[1] >= ex[6] && ex[2] >= ex[5]) { mal = false; break; }
      }
      if (mal) estancados.push({ nombre: nom, grupo: grupoDe[nom] || "" });
    }
  }
  if (estancados.length === 0) return null;

  var catalogo = obtenerTodasProgresiones(nivelMaximo());
  var porGrupo = {};
  for (var ci = 0; ci < catalogo.length; ci++) {
    var row = catalogo[ci];
    if (!porGrupo[row[1]]) porGrupo[row[1]] = [];
    porGrupo[row[1]].push(row[0]);
  }

  var container = crear("div");
  container.appendChild(crear("h5", "ia-subtitulo", t("estancamiento")));
  var card = crear("div", "ia-card-plateau");
  card.appendChild(crear("p", "ia-card-plateau-titulo", t("ejerciciosEstancados") + ":"));

  for (var i3 = 0; i3 < estancados.length; i3++) {
    var est = estancados[i3];
    var pEj = crear("p", "ia-ejercicio-estancado");
    pEj.appendChild(document.createTextNode("\u2717 "));
    var st = document.createElement("strong");
    st.textContent = est.nombre;
    pEj.appendChild(st);
    card.appendChild(pEj);

    var alternativas = (porGrupo[est.grupo] || []).filter(function (a) { return a !== est.nombre; });
    if (alternativas.length > 0) {
      card.appendChild(crear("p", "ia-rec-local", "\u21E2 " + t("probaCon") + ": " + alternativas.slice(0, 3).join(", ")));
    }
  }

  card.appendChild(crear("p", "ia-texto-sugerencia", t("sugerenciaEstancamiento")));
  container.appendChild(card);
  return container;
}

function confirmarSubirNivel(nuevoNivel) {
  actualizarUsuario(usuarioActual.id, usuarioActual.nombre, nuevoNivel,
    usuarioActual.peso, usuarioActual.altura, usuarioActual.objetivo);
  usuarioActual = obtenerUsuarioPorId(usuarioActual.id);
  actualizarInfoUsuario();

  var card = crear("div", "card-felicitaciones");
  var titulo = crear("p", "card-felicitaciones-titulo");
  titulo.appendChild(document.createTextNode(t("felicitaciones") + " "));
  var strong = document.createElement("strong");
  strong.textContent = t(nuevoNivel.toLowerCase());
  titulo.appendChild(strong);
  titulo.appendChild(document.createTextNode("!"));
  card.appendChild(titulo);
  card.appendChild(crear("p", "ia-texto", t("nivelSubido")));
  resultadoIA.innerHTML = "";
  resultadoIA.appendChild(card);
}

function cancelarSubirNivel() {
  resultadoIA.innerHTML = "";
  resultadoIA.appendChild(crear("p", "ia-texto", t("noSubir") + " " + t(usuarioActual.nivel.toLowerCase()) + "."));
}

window.confirmarSubirNivel = confirmarSubirNivel;
window.cancelarSubirNivel = cancelarSubirNivel;
