// ============================================================
// progresiones.js  —  CATALOGO DE EJERCICIOS DE CALISTENIA
// ============================================================

var CATALOGO = [
  // ============================================================
  // ESPALDA — Dominadas (Pull-ups)
  // ============================================================
  { grupo: "Espalda", nombre: "Dominadas negativas",                nivel: 1, reps: 8,  series: 3, desc: "Bajada controlada desde arriba" },
  { grupo: "Espalda", nombre: "Dominadas asistidas",                nivel: 1, reps: 8,  series: 3, desc: "Con banda elastica o salto" },
  { grupo: "Espalda", nombre: "Dominadas estrictas",                nivel: 2, reps: 8,  series: 4, desc: "Sin impulso, pecho a la barra" },
  { grupo: "Espalda", nombre: "Dominadas con agarre ancho",         nivel: 2, reps: 8,  series: 4, desc: "Manos separadas, abriendo dorsal" },
  { grupo: "Espalda", nombre: "Dominadas con agarre cerrado",       nivel: 3, reps: 8,  series: 4, desc: "Manos juntas, enfasis en biceps" },
  { grupo: "Espalda", nombre: "Dominadas explosivas",               nivel: 3, reps: 6,  series: 4, desc: "Subir con potencia, soltar la barra" },
  { grupo: "Espalda", nombre: "Dominadas con peso",                 nivel: 4, reps: 8,  series: 4, desc: "Con lastre (disco o chaleco)" },
  { grupo: "Espalda", nombre: "Muscle up (transicion)",             nivel: 4, reps: 5,  series: 4, desc: "De dominada a fondo en la barra" },
  { grupo: "Espalda", nombre: "Dominadas Archer",                   nivel: 5, reps: 5,  series: 3, desc: "Un brazo estirado, el otro tira" },
  { grupo: "Espalda", nombre: "Dominadas a un brazo",               nivel: 5, reps: 5,  series: 3, desc: "Maximo nivel de dominadas" },
  // ESPALDA — Remo (Rows)
  { grupo: "Espalda", nombre: "Remo australiano piernas dobladas",  nivel: 1, reps: 10, series: 3, desc: "Barra baja, piernas flexionadas" },
  { grupo: "Espalda", nombre: "Remo australiano piernas rectas",    nivel: 1, reps: 10, series: 3, desc: "Cuerpo recto, talones en el piso" },
  { grupo: "Espalda", nombre: "Remo australiano con peso",          nivel: 2, reps: 8,  series: 4, desc: "Con mochila o lastre" },
  { grupo: "Espalda", nombre: "Remo en barra fija (Front Lever Row)", nivel: 3, reps: 6, series: 4, desc: "Cuerpo horizontal, remo hacia el pecho" },

  // ============================================================
  // PECHO — Flexiones (Push-ups)
  // ============================================================
  { grupo: "Pecho", nombre: "Flexiones de rodillas",                nivel: 1, reps: 12, series: 3, desc: "Apoyo de rodillas, espalda recta" },
  { grupo: "Pecho", nombre: "Flexiones inclinadas",                 nivel: 1, reps: 12, series: 3, desc: "Manos en un banco, pies en el piso" },
  { grupo: "Pecho", nombre: "Flexiones clasicas",                   nivel: 2, reps: 12, series: 3, desc: "Cuerpo recto, brazos a 45°" },
  { grupo: "Pecho", nombre: "Flexiones diamante",                   nivel: 2, reps: 10, series: 3, desc: "Manos juntas en forma de diamante" },
  { grupo: "Pecho", nombre: "Flexiones archer",                     nivel: 3, reps: 8,  series: 3, desc: "Un brazo estirado, el otro flexiona" },
  { grupo: "Pecho", nombre: "Flexiones con palmada",                nivel: 3, reps: 8,  series: 4, desc: "Explosivas, despegar las manos" },
  { grupo: "Pecho", nombre: "Flexiones pseudo planche",             nivel: 4, reps: 8,  series: 4, desc: "Manos atras, inclinado hacia adelante" },
  { grupo: "Pecho", nombre: "Flexiones decline",                    nivel: 4, reps: 10, series: 4, desc: "Pies elevados, enfoque en hombros" },
  { grupo: "Pecho", nombre: "Flexiones a un brazo",                 nivel: 5, reps: 6,  series: 3, desc: "Maximo nivel de flexiones" },
  { grupo: "Pecho", nombre: "Planche push-up (tuck)",               nivel: 5, reps: 5,  series: 3, desc: "Cuerpo paralelo al piso, rodillas al pecho" },
  // PECHO — Fondos (Dips)
  { grupo: "Pecho", nombre: "Fondos en banco",                      nivel: 1, reps: 10, series: 3, desc: "Manos en banco, pies en el piso" },
  { grupo: "Pecho", nombre: "Fondos en paralelas asistidos",        nivel: 2, reps: 8,  series: 3, desc: "Con banda elastica" },
  { grupo: "Pecho", nombre: "Fondos en paralelas",                  nivel: 2, reps: 10, series: 4, desc: "Cuerpo recto, bajar a 90°" },
  { grupo: "Pecho", nombre: "Fondos con inclinacion",               nivel: 3, reps: 8,  series: 4, desc: "Piernas elevadas, enfoque en pectoral" },
  { grupo: "Pecho", nombre: "Fondos con peso",                      nivel: 4, reps: 8,  series: 4, desc: "Con lastre" },
  { grupo: "Pecho", nombre: "Fondos rusos (Ring Dips)",             nivel: 5, reps: 6,  series: 3, desc: "En anillas, maximo control" },

  // ============================================================
  // HOMBROS — Pino / Handstand + Press
  // ============================================================
  { grupo: "Hombros", nombre: "Postura del perro boca abajo",       nivel: 1, reps: 30, series: 3, desc: "Sostener en segundos, abriendo hombros" },
  { grupo: "Hombros", nombre: "Pike push-ups",                      nivel: 1, reps: 10, series: 3, desc: "Cadera arriba, flexiones en V" },
  { grupo: "Hombros", nombre: "Patada a pino contra pared",         nivel: 2, reps: 15, series: 3, desc: "Segundos sostenido contra pared" },
  { grupo: "Hombros", nombre: "Pino contra pared",                  nivel: 2, reps: 30, series: 3, desc: "Sostener 30s contra pared" },
  { grupo: "Hombros", nombre: "Pino caminando contra pared",        nivel: 3, reps: 10, series: 3, desc: "Caminar con manos hacia la pared" },
  { grupo: "Hombros", nombre: "Pino libre",                         nivel: 3, reps: 20, series: 3, desc: "Sin pared, sostener 20s" },
  { grupo: "Hombros", nombre: "Pike push-ups con peso",             nivel: 4, reps: 10, series: 4, desc: "Con mochila, mayor rango" },
  { grupo: "Hombros", nombre: "Fondos en pino contra pared",        nivel: 4, reps: 5,  series: 3, desc: "Handstand Push-ups contra pared" },
  { grupo: "Hombros", nombre: "Fondos en pino libre",               nivel: 5, reps: 3,  series: 3, desc: "HeSPU sin pared, maximo control" },
  { grupo: "Hombros", nombre: "90° hold a pino",                    nivel: 5, reps: 10, series: 3, desc: "Bajar a 90° y sostener segundos" },

  // ============================================================
  // PIERNAS — Squats + Variaciones
  // ============================================================
  { grupo: "Piernas", nombre: "Sentadillas asistidas",              nivel: 1, reps: 15, series: 3, desc: "Sujetandose de algo" },
  { grupo: "Piernas", nombre: "Sentadillas clasicas",               nivel: 1, reps: 20, series: 3, desc: "Peso corporal, cadera abajo de rodilla" },
  { grupo: "Piernas", nombre: "Sentadillas bulgaras",               nivel: 2, reps: 12, series: 3, desc: "Un pie atras en un banco" },
  { grupo: "Piernas", nombre: "Zancadas estaticas",                 nivel: 2, reps: 12, series: 3, desc: "Pierna adelante, rodilla a 90°" },
  { grupo: "Piernas", nombre: "Sentadillas con salto",              nivel: 3, reps: 10, series: 4, desc: "Explosivas, maximo salto" },
  { grupo: "Piernas", nombre: "Zancadas caminando",                 nivel: 3, reps: 12, series: 3, desc: "Alternando piernas, avanzando" },
  { grupo: "Piernas", nombre: "Pistol asistido",                    nivel: 4, reps: 6,  series: 3, desc: "Sentadilla a 1 pierna con apoyo" },
  { grupo: "Piernas", nombre: "Sentadillas a una pierna (Pistol)",  nivel: 4, reps: 8,  series: 3, desc: "Una pierna extendida al frente" },
  { grupo: "Piernas", nombre: "Nordic curl negativo",               nivel: 5, reps: 6,  series: 3, desc: "Bajada controlada de femoral" },
  { grupo: "Piernas", nombre: "Pistol con peso",                    nivel: 5, reps: 6,  series: 4, desc: "Sentadilla a 1 pierna con lastre" },

  // ============================================================
  // CORE — Abdomen
  // ============================================================
  { grupo: "Abdomen", nombre: "Plancha de rodillas",                   nivel: 1, reps: 20, series: 3, desc: "Sostener 20s de rodillas" },
  { grupo: "Abdomen", nombre: "Plancha clasica",                       nivel: 1, reps: 30, series: 3, desc: "Sostener 30s, cuerpo recto" },
  { grupo: "Abdomen", nombre: "Plancha lateral",                       nivel: 2, reps: 20, series: 3, desc: "Sostener 20s cada lado" },
  { grupo: "Abdomen", nombre: "Elevaciones de piernas acostado",       nivel: 2, reps: 15, series: 3, desc: "Acostado, piernas a 90°" },
  { grupo: "Abdomen", nombre: "Russian twists",                        nivel: 3, reps: 20, series: 3, desc: "Torso rotando, tocar el piso" },
  { grupo: "Abdomen", nombre: "Plancha con toque de hombro",           nivel: 3, reps: 16, series: 3, desc: "Tocar hombro opuesto sin mover cadera" },
  { grupo: "Abdomen", nombre: "Elevaciones de piernas colgado",        nivel: 4, reps: 10, series: 3, desc: "Colgado de una barra" },
  { grupo: "Abdomen", nombre: "L-sit en paralelas",                    nivel: 4, reps: 15, series: 3, desc: "Sostener 15s, piernas rectas al frente" },
  { grupo: "Abdomen", nombre: "Windshield wipers",                     nivel: 5, reps: 8,  series: 3, desc: "Colgado, piernas de lado a lado" },
  { grupo: "Abdomen", nombre: "Dragon Flag",                           nivel: 5, reps: 8,  series: 3, desc: "Cuerpo recto, bajar controlado" },
];

// ------------------------------------------------------------
// poblarProgresiones()
// ------------------------------------------------------------
function poblarProgresiones() {
  var resultado = db.exec("SELECT COUNT(*) as total FROM progresiones");
  var total = resultado[0].values[0][0];

  if (total > 0) {
    console.log("Progresiones ya pobaladas (" + total + " ejercicios)");
    return;
  }

  for (var i = 0; i < CATALOGO.length; i++) {
    var e = CATALOGO[i];
    db.run(
      "INSERT INTO progresiones (grupo_muscular, nombre, nivel, reps_requeridas, series_requeridas, descripcion) VALUES (?, ?, ?, ?, ?, ?)",
      [e.grupo, e.nombre, e.nivel, e.reps, e.series, e.desc]
    );
    }

    guardarDB();
}

// ------------------------------------------------------------
// mostrarCatalogo()
// ------------------------------------------------------------
// Renderiza el catalogo en #catalogo-contenido
// Se llama desde renderer.js al cambiar a la seccion catalogo
// ------------------------------------------------------------
function mostrarCatalogo() {
  var resultado = db.exec(
    "SELECT id, grupo_muscular, nombre, nivel, reps_requeridas, series_requeridas, descripcion FROM progresiones ORDER BY grupo_muscular, nivel"
  );
  if (resultado.length === 0) return;

  var filas = resultado[0].values;

  var grupos = {};
  for (var i = 0; i < filas.length; i++) {
    var f = filas[i];
    if (!grupos[f[1]]) grupos[f[1]] = [];
    grupos[f[1]].push(f);
  }

  var html = '';
  var orden = ["Espalda", "Pecho", "Hombros", "Piernas", "Abdomen"];
  for (var g = 0; g < orden.length; g++) {
    var nombreGrupo = orden[g];
    var ejercicios = grupos[nombreGrupo];
    if (!ejercicios) continue;

    html += '<div class="catalogo-grupo">';
    html += '<h4 class="catalogo-grupo-titulo">' + t(nombreGrupo.toLowerCase()) + '</h4>';
    html += '<table class="catalogo-tabla">';
    html += '<tr><th>' + t('nivelAbrev') + '</th><th>' + t('ejercicio') + '</th><th>' + t('meta') + '</th><th>' + t('descripcion') + '</th></tr>';

    for (var j = 0; j < ejercicios.length; j++) {
      var e = ejercicios[j];
      html += '<tr>' +
        '<td class="catalogo-nivel">' + e[3] + '</td>' +
        '<td class="catalogo-nombre">' + e[2] + '</td>' +
        '<td class="catalogo-meta">' + e[4] + 'x' + e[5] + '</td>' +
        '<td class="catalogo-desc">' + e[6] + '</td>' +
        '</tr>';
    }
    html += '</table></div>';
  }

  document.getElementById('catalogo-contenido').innerHTML = html;
}

// ------------------------------------------------------------
// poblarSelectEjercicios()
// ------------------------------------------------------------
// Llena el <select> de la seccion Entrenar con los ejercicios
// del catalogo. Se llama desde renderer.js.
// ------------------------------------------------------------
function poblarSelectEjercicios() {
  var resultado = db.exec(
    "SELECT id, grupo_muscular, nombre, nivel, reps_requeridas, series_requeridas, descripcion FROM progresiones ORDER BY grupo_muscular, nivel"
  );
  if (resultado.length === 0) return;

  var select = document.getElementById('select-ejercicio-sesion');
  if (!select) return;

  // Nivel maximo segun el usuario
  var nivelMax = 5;
  if (usuarioActual.nivel === 'Principiante') nivelMax = 2;
  else if (usuarioActual.nivel === 'Intermedio') nivelMax = 3;

  var filas = resultado[0].values;
  var grupos = {};
  for (var i = 0; i < filas.length; i++) {
    var f = filas[i];
    if (f[3] > nivelMax) continue;
    if (!grupos[f[1]]) grupos[f[1]] = [];
    grupos[f[1]].push(f);
  }

  var html = '<option value="">' + t('selectPlaceholder') + '</option>';
  var orden = ["Espalda", "Pecho", "Hombros", "Piernas", "Abdomen"];
  for (var g = 0; g < orden.length; g++) {
    var grupo = orden[g];
    var ejercicios = grupos[grupo];
    if (!ejercicios) continue;
    html += '<optgroup label="' + t(grupo.toLowerCase()) + '">';
    for (var j = 0; j < ejercicios.length; j++) {
      var e = ejercicios[j];
      html += '<option value="' + e[0] + '"' +
        ' data-nombre="' + e[2] + '"' +
        ' data-nivel="' + e[3] + '"' +
        ' data-reps="' + e[4] + '"' +
        ' data-series="' + e[5] + '"' +
        ' data-desc="' + e[6] + '"' +
        '>' +
        t('nivelAbrev') + e[3] + ' — ' + e[2] + ' (' + e[4] + 'x' + e[5] + ')' +
        '</option>';
    }
    html += '</optgroup>';
  }

  select.innerHTML = html;

  // Atar evento change y ocultar meta inicial
  select.onchange = mostrarMetaEjercicio;
  document.getElementById('info-meta-ejercicio').style.display = 'none';
}

window.CATALOGO = CATALOGO;
window.poblarProgresiones = poblarProgresiones;
window.mostrarCatalogo = mostrarCatalogo;
window.poblarSelectEjercicios = poblarSelectEjercicios;
