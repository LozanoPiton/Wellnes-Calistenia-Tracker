// ============================================================
// progresiones.js  —  CATALOGO DE EJERCICIOS DE CALISTENIA
// ============================================================

var CATALOGO = [
  // ============================================================
  // ESPALDA  (17 ejercicios)
  // ============================================================
  // Pull-ups
  { grupo: "Espalda", nombre: "Dominadas negativas",                nivel: 1, reps: 8,  series: 3, desc: "Bajada controlada desde arriba" },
  { grupo: "Espalda", nombre: "Dominadas asistidas",                nivel: 1, reps: 8,  series: 3, desc: "Con banda elastica o salto" },
  { grupo: "Espalda", nombre: "Dominadas estrictas",                nivel: 1, reps: 8,  series: 4, desc: "Sin impulso, pecho a la barra" },
  { grupo: "Espalda", nombre: "Dominadas con agarre ancho",         nivel: 1, reps: 8,  series: 4, desc: "Manos separadas, abriendo dorsal" },
  { grupo: "Espalda", nombre: "Scapular pulls",                     nivel: 1, reps: 10, series: 3, desc: "Activar escapulas colgado, sin doblar brazos" },
  { grupo: "Espalda", nombre: "Dominadas con agarre cerrado",       nivel: 2, reps: 8,  series: 4, desc: "Manos juntas, enfasis en biceps" },
  { grupo: "Espalda", nombre: "Dominadas explosivas",               nivel: 2, reps: 6,  series: 4, desc: "Subir con potencia, soltar la barra" },
  { grupo: "Espalda", nombre: "Front lever tuck",                   nivel: 2, reps: 15, series: 3, desc: "Sostener rodillas al pecho, cuerpo horizontal" },
  { grupo: "Espalda", nombre: "Dominadas con peso",                 nivel: 3, reps: 8,  series: 4, desc: "Con lastre (disco o chaleco)" },
  { grupo: "Espalda", nombre: "Muscle up (transicion)",             nivel: 3, reps: 5,  series: 4, desc: "De dominada a fondo en la barra" },
  { grupo: "Espalda", nombre: "Dominadas Archer",                   nivel: 3, reps: 5,  series: 3, desc: "Un brazo estirado, el otro tira" },
  { grupo: "Espalda", nombre: "Dominadas a un brazo",               nivel: 3, reps: 5,  series: 3, desc: "Maximo nivel de dominadas" },
  // Rows
  { grupo: "Espalda", nombre: "Remo australiano piernas dobladas",  nivel: 1, reps: 10, series: 3, desc: "Barra baja, piernas flexionadas" },
  { grupo: "Espalda", nombre: "Remo australiano piernas rectas",    nivel: 1, reps: 10, series: 3, desc: "Cuerpo recto, talones en el piso" },
  { grupo: "Espalda", nombre: "Remo australiano con peso",          nivel: 1, reps: 8,  series: 4, desc: "Con mochila o lastre" },
  { grupo: "Espalda", nombre: "Remo en barra fija (Front Lever Row)", nivel: 2, reps: 6, series: 4, desc: "Cuerpo horizontal, remo hacia el pecho" },
  { grupo: "Espalda", nombre: "Band pull-aparts",                   nivel: 2, reps: 15, series: 3, desc: "Apertura de hombros con banda" },
  // L1 extras
  { grupo: "Espalda", nombre: "Superman holds",                     nivel: 1, reps: 20, series: 3, desc: "Sostener brazos y piernas elevados" },
  { grupo: "Espalda", nombre: "Band face pulls",                    nivel: 1, reps: 12, series: 3, desc: "Remo al rostro con banda" },

  // ============================================================
  // PECHO  (18 ejercicios)
  // ============================================================
  // Push-ups
  { grupo: "Pecho", nombre: "Flexiones de rodillas",                nivel: 1, reps: 12, series: 3, desc: "Apoyo de rodillas, espalda recta" },
  { grupo: "Pecho", nombre: "Flexiones inclinadas",                 nivel: 1, reps: 12, series: 3, desc: "Manos en un banco, pies en el piso" },
  { grupo: "Pecho", nombre: "Flexiones clasicas",                   nivel: 1, reps: 12, series: 3, desc: "Cuerpo recto, brazos a 45°" },
  { grupo: "Pecho", nombre: "Flexiones diamante",                   nivel: 1, reps: 10, series: 3, desc: "Manos juntas en forma de diamante" },
  { grupo: "Pecho", nombre: "Flexiones wide",                       nivel: 1, reps: 10, series: 3, desc: "Manos mas abiertas que hombros" },
  { grupo: "Pecho", nombre: "Flexiones archer",                     nivel: 2, reps: 8,  series: 3, desc: "Un brazo estirado, el otro flexiona" },
  { grupo: "Pecho", nombre: "Flexiones con palmada",                nivel: 2, reps: 8,  series: 4, desc: "Explosivas, despegar las manos" },
  { grupo: "Pecho", nombre: "Flexiones decline",                    nivel: 2, reps: 10, series: 4, desc: "Pies elevados, enfoque en hombros" },
  { grupo: "Pecho", nombre: "Flexiones pseudo planche",             nivel: 3, reps: 8,  series: 4, desc: "Manos atras, inclinado hacia adelante" },
  { grupo: "Pecho", nombre: "Flexiones a un brazo",                 nivel: 3, reps: 6,  series: 3, desc: "Maximo nivel de flexiones" },
  { grupo: "Pecho", nombre: "Planche push-up (tuck)",               nivel: 3, reps: 5,  series: 3, desc: "Cuerpo paralelo al piso, rodillas al pecho" },
  // Dips
  { grupo: "Pecho", nombre: "Fondos en banco",                      nivel: 1, reps: 10, series: 3, desc: "Manos en banco, pies en el piso" },
  { grupo: "Pecho", nombre: "Fondos en paralelas asistidos",        nivel: 1, reps: 8,  series: 3, desc: "Con banda elastica" },
  { grupo: "Pecho", nombre: "Fondos en paralelas",                  nivel: 1, reps: 10, series: 4, desc: "Cuerpo recto, bajar a 90°" },
  { grupo: "Pecho", nombre: "Flexiones con banda",                  nivel: 1, reps: 10, series: 3, desc: "Con banda elastica en la espalda" },
  { grupo: "Pecho", nombre: "Flexiones inclinadas diamante",        nivel: 1, reps: 10, series: 3, desc: "Manos en banco en diamante" },
  { grupo: "Pecho", nombre: "Fondos con inclinacion",               nivel: 2, reps: 8,  series: 4, desc: "Piernas elevadas, enfoque en pectoral" },
  { grupo: "Pecho", nombre: "Close-grip push-ups",                  nivel: 2, reps: 10, series: 3, desc: "Manos juntas, triceps" },
  { grupo: "Pecho", nombre: "Fondos con peso",                      nivel: 3, reps: 8,  series: 4, desc: "Con lastre" },
  { grupo: "Pecho", nombre: "Fondos rusos (Ring Dips)",             nivel: 3, reps: 6,  series: 3, desc: "En anillas, maximo control" },

  // ============================================================
  // HOMBROS  (15 ejercicios)
  // ============================================================
  { grupo: "Hombros", nombre: "Postura del perro boca abajo",       nivel: 1, reps: 30, series: 3, desc: "Sostener en segundos, abriendo hombros" },
  { grupo: "Hombros", nombre: "Pike push-ups",                      nivel: 1, reps: 10, series: 3, desc: "Cadera arriba, flexiones en V" },
  { grupo: "Hombros", nombre: "Dislocates con banda",               nivel: 1, reps: 10, series: 3, desc: "Movilidad de hombros con banda" },
  { grupo: "Hombros", nombre: "Patada a pino contra pared",         nivel: 1, reps: 15, series: 3, desc: "Segundos sostenido contra pared" },
  { grupo: "Hombros", nombre: "Pino contra pared",                  nivel: 1, reps: 30, series: 3, desc: "Sostener 30s contra pared" },
  { grupo: "Hombros", nombre: "Wall slides",                        nivel: 1, reps: 10, series: 3, desc: "Brazos en W, subir y bajar contra pared" },
  { grupo: "Hombros", nombre: "Punches con banda",                  nivel: 1, reps: 15, series: 3, desc: "Golpes al frente con banda" },
  { grupo: "Hombros", nombre: "Lateral raises con banda",           nivel: 1, reps: 12, series: 3, desc: "Elevacion lateral con banda" },
  { grupo: "Hombros", nombre: "Front raises con banda",             nivel: 1, reps: 12, series: 3, desc: "Elevacion frontal con banda" },
  { grupo: "Hombros", nombre: "Band external rotation",             nivel: 1, reps: 12, series: 3, desc: "Rotacion externa con banda" },
  // Hombros L2 extras
  { grupo: "Hombros", nombre: "YTWL raises",                        nivel: 2, reps: 8,  series: 3, desc: "Fortalecer escapulas en 4 posiciones" },
  { grupo: "Hombros", nombre: "Pino caminando contra pared",        nivel: 2, reps: 10, series: 3, desc: "Caminar con manos hacia la pared" },
  { grupo: "Hombros", nombre: "Pino libre",                         nivel: 2, reps: 20, series: 3, desc: "Sin pared, sostener 20s" },
  { grupo: "Hombros", nombre: "Face pulls con banda",               nivel: 2, reps: 12, series: 3, desc: "Apertura de hombros y trapecio" },
  { grupo: "Hombros", nombre: "Pike push-ups con peso",             nivel: 3, reps: 10, series: 4, desc: "Con mochila, mayor rango" },
  { grupo: "Hombros", nombre: "Fondos en pino contra pared",        nivel: 3, reps: 5,  series: 3, desc: "Handstand Push-ups contra pared" },
  { grupo: "Hombros", nombre: "Fondos en pino libre",               nivel: 3, reps: 3,  series: 3, desc: "HeSPU sin pared, maximo control" },
  { grupo: "Hombros", nombre: "90° hold a pino",                    nivel: 3, reps: 10, series: 3, desc: "Bajar a 90° y sostener segundos" },
  { grupo: "Hombros", nombre: "Handstand shoulder taps",            nivel: 3, reps: 10, series: 3, desc: "Tocar hombro opuesto en pino" },
  { grupo: "Hombros", nombre: "Handstand walk",                     nivel: 3, reps: 5,  series: 3, desc: "Caminar en pino metros" },

  // ============================================================
  // PIERNAS  (18 ejercicios)
  // ============================================================
  { grupo: "Piernas", nombre: "Sentadillas asistidas",              nivel: 1, reps: 15, series: 3, desc: "Sujetandose de algo" },
  { grupo: "Piernas", nombre: "Sentadillas clasicas",               nivel: 1, reps: 20, series: 3, desc: "Peso corporal, cadera abajo de rodilla" },
  { grupo: "Piernas", nombre: "Sentadillas bulgaras",               nivel: 1, reps: 12, series: 3, desc: "Un pie atras en un banco" },
  { grupo: "Piernas", nombre: "Zancadas estaticas",                 nivel: 1, reps: 12, series: 3, desc: "Pierna adelante, rodilla a 90°" },
  { grupo: "Piernas", nombre: "Glute bridges",                      nivel: 1, reps: 15, series: 3, desc: "Elevar cadera, apretar gluteo" },
  { grupo: "Piernas", nombre: "Calf raises",                        nivel: 1, reps: 20, series: 3, desc: "Subir talones, trabajar gemelos" },
  { grupo: "Piernas", nombre: "Step-ups",                           nivel: 1, reps: 12, series: 3, desc: "Subir a un banco alternando pierna" },
  { grupo: "Piernas", nombre: "Reverse lunges",                     nivel: 1, reps: 12, series: 3, desc: "Zancada hacia atras" },
  { grupo: "Piernas", nombre: "Side lunges",                        nivel: 1, reps: 10, series: 3, desc: "Zancada lateral" },
  { grupo: "Piernas", nombre: "Donkey kicks",                       nivel: 1, reps: 15, series: 3, desc: "Patada hacia atras a cuatro patas" },
  { grupo: "Piernas", nombre: "Sentadillas con salto",              nivel: 2, reps: 10, series: 4, desc: "Explosivas, maximo salto" },
  { grupo: "Piernas", nombre: "Zancadas caminando",                 nivel: 2, reps: 12, series: 3, desc: "Alternando piernas, avanzando" },
  { grupo: "Piernas", nombre: "Single-leg glute bridge",            nivel: 2, reps: 12, series: 3, desc: "Un pie elevado, empujar cadera" },
  { grupo: "Piernas", nombre: "Bulgarian split squat con peso",     nivel: 2, reps: 10, series: 3, desc: "Un pie atras en banco con lastre" },
  { grupo: "Piernas", nombre: "Wall sit",                           nivel: 2, reps: 45, series: 3, desc: "Sostener 45s contra la pared" },
  { grupo: "Piernas", nombre: "Pistol asistido",                    nivel: 3, reps: 6,  series: 3, desc: "Sentadilla a 1 pierna con apoyo" },
  { grupo: "Piernas", nombre: "Sentadillas a una pierna (Pistol)",  nivel: 3, reps: 8,  series: 3, desc: "Una pierna extendida al frente" },
  { grupo: "Piernas", nombre: "Nordic curl negativo",               nivel: 3, reps: 6,  series: 3, desc: "Bajada controlada de femoral" },
  { grupo: "Piernas", nombre: "Pistol con peso",                    nivel: 3, reps: 6,  series: 4, desc: "Sentadilla a 1 pierna con lastre" },
  { grupo: "Piernas", nombre: "Shrimp squat",                       nivel: 3, reps: 6,  series: 3, desc: "Sentadilla a una pierna, talon elevado" },
  { grupo: "Piernas", nombre: "Sissy squat",                        nivel: 3, reps: 10, series: 3, desc: "Rodillas adelante, torso atras" },

  // ============================================================
  // ABDOMEN  (16 ejercicios)
  // ============================================================
  { grupo: "Abdomen", nombre: "Plancha de rodillas",                nivel: 1, reps: 20, series: 3, desc: "Sostener 20s de rodillas" },
  { grupo: "Abdomen", nombre: "Plancha clasica",                    nivel: 1, reps: 30, series: 3, desc: "Sostener 30s, cuerpo recto" },
  { grupo: "Abdomen", nombre: "Plancha lateral",                    nivel: 1, reps: 20, series: 3, desc: "Sostener 20s cada lado" },
  { grupo: "Abdomen", nombre: "Elevaciones de piernas acostado",    nivel: 1, reps: 15, series: 3, desc: "Acostado, piernas a 90°" },
  { grupo: "Abdomen", nombre: "Dead bug",                           nivel: 1, reps: 10, series: 3, desc: "Brazos y piernas opuestos, lumbar pegada" },
  { grupo: "Abdomen", nombre: "Hollow body hold",                   nivel: 1, reps: 20, series: 3, desc: "Sostener 20s, cuerpo en banana" },
  { grupo: "Abdomen", nombre: "Mountain climbers",                  nivel: 1, reps: 20, series: 3, desc: "Rodillas al pecho alternando rapido" },
  { grupo: "Abdomen", nombre: "Flutter kicks",                      nivel: 1, reps: 20, series: 3, desc: "Patadas alternadas acostado" },
  { grupo: "Abdomen", nombre: "Heel taps",                          nivel: 1, reps: 20, series: 3, desc: "Tocar talones acostado" },
  { grupo: "Abdomen", nombre: "Bird dog",                           nivel: 1, reps: 10, series: 3, desc: "Brazo y pierna opuestos extendidos" },
  { grupo: "Abdomen", nombre: "Russian twists",                     nivel: 2, reps: 20, series: 3, desc: "Torso rotando, tocar el piso" },
  { grupo: "Abdomen", nombre: "Plancha con toque de hombro",        nivel: 2, reps: 16, series: 3, desc: "Tocar hombro opuesto sin mover cadera" },
  { grupo: "Abdomen", nombre: "Bicycle crunches",                   nivel: 2, reps: 20, series: 3, desc: "Codo a rodilla opuesta alternando" },
  { grupo: "Abdomen", nombre: "Leg lowers",                         nivel: 2, reps: 10, series: 3, desc: "Bajar piernas sin despegar lumbar" },
  { grupo: "Abdomen", nombre: "Elevaciones de piernas colgado",     nivel: 3, reps: 10, series: 3, desc: "Colgado de una barra" },
  { grupo: "Abdomen", nombre: "L-sit en paralelas",                 nivel: 3, reps: 15, series: 3, desc: "Sostener 15s, piernas rectas al frente" },
  { grupo: "Abdomen", nombre: "Windshield wipers",                  nivel: 3, reps: 8,  series: 3, desc: "Colgado, piernas de lado a lado" },
  { grupo: "Abdomen", nombre: "Dragon Flag",                        nivel: 3, reps: 8,  series: 3, desc: "Cuerpo recto, bajar controlado" },
  { grupo: "Abdomen", nombre: "V-ups",                              nivel: 3, reps: 12, series: 3, desc: "Tocar pies en V, bajar controlado" },
];

// ------------------------------------------------------------
// poblarProgresiones()
// Inserta solo los ejercicios nuevos que no esten en la DB
// para no romper las sesiones existentes (FK).
// ------------------------------------------------------------
function poblarProgresiones() {
  // Normalizar niveles existentes por si habia datos corruptos
  db.run("UPDATE progresiones SET nivel = 3 WHERE nivel > 3");
  db.run("UPDATE progresiones SET nivel = 1 WHERE nivel < 1");
  guardarDB();

  var resultado = db.exec("SELECT COUNT(*) as total FROM progresiones");
  var total = resultado[0].values[0][0];

  if (total === 0) {
    // Usuario nuevo: insertar todo
    for (var i = 0; i < CATALOGO.length; i++) {
      var e = CATALOGO[i];
      db.run(
        "INSERT INTO progresiones (grupo_muscular, nombre, nivel, reps_requeridas, series_requeridas, descripcion) VALUES (?, ?, ?, ?, ?, ?)",
        [e.grupo, e.nombre, e.nivel, e.reps, e.series, e.desc]
      );
    }
    guardarDB();
    return;
  }

  // Usuario existente: actualizar los existentes e insertar los que faltan
  var existentes = db.exec("SELECT id, grupo_muscular, nombre, nivel, reps_requeridas, series_requeridas, descripcion FROM progresiones");
  var mapExistentes = {};
  if (existentes.length > 0) {
    var vals = existentes[0].values;
    for (var i = 0; i < vals.length; i++) {
      mapExistentes[vals[i][1] + '|' + vals[i][2]] = { id: vals[i][0], nivel: vals[i][3], reps: vals[i][4], series: vals[i][5], desc: vals[i][6] };
    }
  }

  var insertados = 0;
  var actualizados = 0;
  for (var i = 0; i < CATALOGO.length; i++) {
    var e = CATALOGO[i];
    var key = e.grupo + '|' + e.nombre;
    var existente = mapExistentes[key];
    if (!existente) {
      db.run(
        "INSERT INTO progresiones (grupo_muscular, nombre, nivel, reps_requeridas, series_requeridas, descripcion) VALUES (?, ?, ?, ?, ?, ?)",
        [e.grupo, e.nombre, e.nivel, e.reps, e.series, e.desc]
      );
      insertados++;
    } else if (existente.nivel !== e.nivel || existente.reps !== e.reps || existente.series !== e.series || existente.desc !== e.desc) {
      db.run(
        "UPDATE progresiones SET nivel=?, reps_requeridas=?, series_requeridas=?, descripcion=? WHERE id=?",
        [e.nivel, e.reps, e.series, e.desc, existente.id]
      );
      actualizados++;
    }
  }

  if (insertados > 0 || actualizados > 0) {
    console.log("Catalogo actualizado: " + insertados + " nuevos, " + actualizados + " modificados");
    guardarDB();
  } else {
    console.log("Progresiones ya pobaladas (" + total + " ejercicios)");
  }
}

// ------------------------------------------------------------
// mostrarCatalogo()
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

  var contenedor = document.getElementById('catalogo-contenido');
  contenedor.innerHTML = '';
  var orden = ["Espalda", "Pecho", "Hombros", "Piernas", "Abdomen"];
  for (var g = 0; g < orden.length; g++) {
    var nombreGrupo = orden[g];
    var ejercicios = grupos[nombreGrupo];
    if (!ejercicios) continue;

    var divGrupo = document.createElement('div');
    divGrupo.className = 'catalogo-grupo';

    var h4 = document.createElement('h4');
    h4.className = 'catalogo-grupo-titulo';
    h4.textContent = t(nombreGrupo.toLowerCase());
    divGrupo.appendChild(h4);

    var tabla = document.createElement('table');
    tabla.className = 'catalogo-tabla';

    var thead = document.createElement('tr');
    var ths = [t('nivelAbrev'), t('ejercicio'), t('meta'), t('descripcion')];
    for (var thIdx = 0; thIdx < ths.length; thIdx++) {
      var th = document.createElement('th');
      th.textContent = ths[thIdx];
      thead.appendChild(th);
    }
    tabla.appendChild(thead);

    for (var j = 0; j < ejercicios.length; j++) {
      var e = ejercicios[j];
      var tr = document.createElement('tr');

      var tdNivel = document.createElement('td');
      tdNivel.className = 'catalogo-nivel';
      tdNivel.textContent = e[3];
      tr.appendChild(tdNivel);

      var tdNombre = document.createElement('td');
      tdNombre.className = 'catalogo-nombre';
      tdNombre.textContent = e[2];
      tr.appendChild(tdNombre);

      var tdMeta = document.createElement('td');
      tdMeta.className = 'catalogo-meta';
      tdMeta.textContent = e[4] + 'x' + e[5];
      tr.appendChild(tdMeta);

      var tdDesc = document.createElement('td');
      tdDesc.className = 'catalogo-desc';
      tdDesc.textContent = e[6];
      tr.appendChild(tdDesc);

      tabla.appendChild(tr);
    }

    divGrupo.appendChild(tabla);
    contenedor.appendChild(divGrupo);
  }
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

  var nivelMax = 3;
  if (usuarioActual.nivel === 'Principiante') nivelMax = 1;
  else if (usuarioActual.nivel === 'Intermedio') nivelMax = 2;

  var filas = resultado[0].values;
  var grupos = {};
  for (var i = 0; i < filas.length; i++) {
    var f = filas[i];
    if (f[3] > nivelMax) continue;
    if (!grupos[f[1]]) grupos[f[1]] = [];
    grupos[f[1]].push(f);
  }

  var select = document.getElementById('select-ejercicio-sesion');
  if (!select) return;
  select.innerHTML = '';

  var optDefault = document.createElement('option');
  optDefault.value = '';
  optDefault.textContent = t('selectPlaceholder');
  select.appendChild(optDefault);
  var orden = ["Espalda", "Pecho", "Hombros", "Piernas", "Abdomen"];
  for (var g = 0; g < orden.length; g++) {
    var grupo = orden[g];
    var ejercicios = grupos[grupo];
    if (!ejercicios) continue;

    var optgroup = document.createElement('optgroup');
    optgroup.label = t(grupo.toLowerCase());
    for (var j = 0; j < ejercicios.length; j++) {
      var e = ejercicios[j];
      var option = document.createElement('option');
      option.value = e[0];
      option.setAttribute('data-nombre', e[2]);
      option.setAttribute('data-nivel', e[3]);
      option.setAttribute('data-reps', e[4]);
      option.setAttribute('data-series', e[5]);
      option.setAttribute('data-desc', e[6]);
      option.textContent = t('nivelAbrev') + e[3] + ' \u2014 ' + e[2] + ' (' + e[4] + 'x' + e[5] + ')';
      optgroup.appendChild(option);
    }
    select.appendChild(optgroup);
  }

  // Atar evento change y ocultar meta inicial
  select.onchange = mostrarMetaEjercicio;
  document.getElementById('info-meta-ejercicio').style.display = 'none';
}

window.CATALOGO = CATALOGO;
window.poblarProgresiones = poblarProgresiones;
window.mostrarCatalogo = mostrarCatalogo;
window.poblarSelectEjercicios = poblarSelectEjercicios;
