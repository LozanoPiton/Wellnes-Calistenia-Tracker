// ============================================================
// database.js  —  LA BASE DE DATOS (SQLite)
// ============================================================
// Este archivo es el que guarda y trae los datos del disco.
// Usamos sql.js que es SQLite pero en JavaScript puro, asi
// no necesitamos instalar nada raro en Windows.
//
// Los datos se guardan en un archivo llamado "wellness.db"
// que se crea en la misma carpeta del proyecto.
// ============================================================

// "require" importa librerias de Node.js
var initSqlJs = require('sql.js');  
var fs = require('fs');             
var path = require('path');  

var RUTA_DB = path.join(__dirname, 'wellness.db');

window.db = null;
var timerGuardarDB = null;

// ------------------------------------------------------------
// iniciarDB()
// ------------------------------------------------------------

async function iniciarDB() {

    // Cargamos el motor de sql.js
    var SQL = await initSqlJs();

    // Si ya existe el archivo .db, lo cargamos desde el disco
    if (fs.existsSync(RUTA_DB)) {
        var archivo = fs.readFileSync(RUTA_DB);
        db = new SQL.Database(archivo);
        window.db = db;
    } else {
        // Si no existe, creamos una base de datos nueva en memoria
        db = new SQL.Database();
        window.db = db;
    }

    // ---------------------------------------------------------
    // TABLA: usuarios
    // ---------------------------------------------------------
    // Guarda la informacion de cada persona que usa la app.
    // ---------------------------------------------------------
    db.run('CREATE TABLE IF NOT EXISTS usuarios (' +
        'id        INTEGER PRIMARY KEY AUTOINCREMENT,' +
        'nombre    TEXT NOT NULL,' +
        'nivel     TEXT NOT NULL,' +
        'peso      REAL,' +
        'altura    REAL,' +
        'objetivo  TEXT,' +
        'creado_en DATETIME DEFAULT CURRENT_TIMESTAMP' +
    ')');

    // ---------------------------------------------------------
    // TABLA: ejercicios
    // ---------------------------------------------------------
    // Guarda los ejercicios que cada usuario va registrando.
    // ---------------------------------------------------------
    db.run('CREATE TABLE IF NOT EXISTS ejercicios (' +
        'id             INTEGER PRIMARY KEY AUTOINCREMENT,' +
        'usuario_id     INTEGER NOT NULL,' +
        'nombre         TEXT NOT NULL,' +
        'grupo_muscular TEXT NOT NULL,' +
        'dificultad     TEXT NOT NULL,' +
        'series         INTEGER DEFAULT 4,' +
        'repeticiones   INTEGER DEFAULT 10,' +
        'creado_en      DATETIME DEFAULT CURRENT_TIMESTAMP,' +
        'FOREIGN KEY (usuario_id) REFERENCES usuarios(id)' +
    ')');

    try {
        db.exec('SELECT peso FROM usuarios LIMIT 1');
    } catch (e) {
        db.run('ALTER TABLE usuarios ADD COLUMN peso REAL');
        db.run('ALTER TABLE usuarios ADD COLUMN altura REAL');
    }

    try {
        db.exec('SELECT usuario_id FROM ejercicios LIMIT 1');
    } catch (e) {
        db.run('ALTER TABLE ejercicios ADD COLUMN usuario_id INTEGER DEFAULT 0');
    }

    try {
        db.exec('SELECT objetivo FROM usuarios LIMIT 1');
    } catch (e) {
        db.run('ALTER TABLE usuarios ADD COLUMN objetivo TEXT');
    }

    // ---------------------------------------------------------
    // TABLA: progresiones
    // ---------------------------------------------------------
    // Catalogo de ejercicios de calistenia organizados en
    // progresion. Cada ejercicio puede tener un "siguiente"
    // al que se avanza cuando se cumplen las reps requeridas.
    // ---------------------------------------------------------
    db.run('CREATE TABLE IF NOT EXISTS progresiones (' +
        'id              INTEGER PRIMARY KEY AUTOINCREMENT,' +
        'grupo_muscular   TEXT NOT NULL,' +
        'nombre           TEXT NOT NULL,' +
        'nivel            INTEGER DEFAULT 1,' +
        'reps_requeridas  INTEGER,' +
        'series_requeridas INTEGER,' +
        'siguiente_id     INTEGER,' +
        'descripcion      TEXT' +
    ')');

    // ---------------------------------------------------------
    // TABLA: sesiones
    // ---------------------------------------------------------
    // Registro diario de entrenamiento. El usuario selecciona
    // un ejercicio, lo hace e ingresa cuanto hizo.
    // ---------------------------------------------------------
    db.run('CREATE TABLE IF NOT EXISTS sesiones (' +
        'id           INTEGER PRIMARY KEY AUTOINCREMENT,' +
        'usuario_id   INTEGER NOT NULL,' +
        'progresion_id INTEGER NOT NULL,' +
        'series_hechas INTEGER DEFAULT 0,' +
        'reps_hechas  INTEGER DEFAULT 0,' +
        'notas        TEXT,' +
        'fecha        DATETIME DEFAULT CURRENT_TIMESTAMP,' +
        'FOREIGN KEY (usuario_id) REFERENCES usuarios(id),' +
        'FOREIGN KEY (progresion_id) REFERENCES progresiones(id)' +
    ')');

    // ---------------------------------------------------------
    // TABLA: plan_semanal
    // ---------------------------------------------------------
    // Guarda que grupo muscular toca cada dia de la semana.
    // Cada usuario tiene su propio plan.
    // ---------------------------------------------------------
    db.run('CREATE TABLE IF NOT EXISTS plan_semanal (' +
        'id        INTEGER PRIMARY KEY AUTOINCREMENT,' +
        'usuario_id INTEGER NOT NULL,' +
        'dia       INTEGER NOT NULL,' + 
        'grupo_muscular TEXT,' +
        'FOREIGN KEY (usuario_id) REFERENCES usuarios(id)' +
    ')');

    guardarDB();
}


// ------------------------------------------------------------
// guardarDB()
// ------------------------------------------------------------
// sql.js trabaja en memoria (como un archivo temporal).
// Si no guardamos, cuando cerramos la app se borra todo.
// Esta funcion escribe los cambios al archivo wellness.db
// en tu disco para que queden guardados.
// ------------------------------------------------------------
function guardarDB() {
    if (!db) return;
    if (timerGuardarDB) clearTimeout(timerGuardarDB);
    timerGuardarDB = setTimeout(function () {
        timerGuardarDB = null;
        guardarDBAhora();
    }, 150);
}


function guardarDBAhora() {
    if (!db) return;
    try {
        var datos = db.export();
        fs.writeFileSync(RUTA_DB, Buffer.from(datos));
    } catch (e) {
        try { console.error("No se pudo guardar la base:", e.message); } catch (_) {}
    }
}

// Si la app se cierra dentro de los 150ms del debounce, escribir igual.
window.addEventListener('beforeunload', function () {
    if (timerGuardarDB) {
        clearTimeout(timerGuardarDB);
        timerGuardarDB = null;
        guardarDBAhora();
    }
});


// ============================================================
// FUNCIONES PARA USUARIOS
// ============================================================

// ------------------------------------------------------------
// crearUsuario(nombre, nivel, peso, altura, objetivo)
// ------------------------------------------------------------
// Guarda un usuario nuevo en la base de datos.
// Devuelve el ID que se le asigno automaticamente.
// ------------------------------------------------------------
function crearUsuario(nombre, nivel, peso, altura, objetivo) {
    db.run(
        'INSERT INTO usuarios (nombre, nivel, peso, altura, objetivo) VALUES (?, ?, ?, ?, ?)',
        [nombre, nivel, peso, altura, objetivo]
    );
    guardarDB();

    // "last_insert_rowid()" trae el ID del ultimo registro guardado
    var resultado = db.exec('SELECT last_insert_rowid()');
    return resultado[0].values[0][0];
}


// ------------------------------------------------------------
// obtenerUsuarios()
// ------------------------------------------------------------
// Trae TODOS los usuarios de la base de datos.
// Devuelve un array (lista) con cada usuario como objeto.
// ------------------------------------------------------------
function obtenerUsuarios() {
    var resultado = db.exec('SELECT id, nombre, nivel, peso, altura, objetivo, creado_en FROM usuarios');

    if (resultado.length === 0) return [];

    var usuarios = [];
    var filas = resultado[0].values;

    for (var i = 0; i < filas.length; i++) {
        usuarios.push(new Usuario(
            filas[i][0],  // id
            filas[i][1],  // nombre
            filas[i][2],  // nivel
            filas[i][3],  // peso
            filas[i][4],  // altura
            filas[i][5],  // objetivo
            filas[i][6]   // creadoEn
        ));
    }

    return usuarios;
}


// ------------------------------------------------------------
// obtenerUsuarioPorId(id)
// ------------------------------------------------------------
// Busca un usuario por su numero de ID.
// Devuelve el usuario o null si no lo encuentra.
// ------------------------------------------------------------
function obtenerUsuarioPorId(id) {
    var resultado = db.exec('SELECT id, nombre, nivel, peso, altura, objetivo, creado_en FROM usuarios WHERE id = ' + id);

    if (resultado.length === 0) return null;

    var fila = resultado[0].values[0];
    return new Usuario(
        fila[0], fila[1], fila[2], fila[3], fila[4], fila[5], fila[6]
    );
}


// ------------------------------------------------------------
// eliminarUsuario(id)
// ------------------------------------------------------------
// Borra un usuario y TODOS sus ejercicios.
// Pregunta confirmacion antes de borrar (en auth.js).
// ------------------------------------------------------------
function eliminarUsuario(id) {
    // Primero borramos los ejercicios del usuario
    db.run('DELETE FROM ejercicios WHERE usuario_id = ' + id);
    // Despues borramos el usuario
    db.run('DELETE FROM usuarios WHERE id = ' + id);
    guardarDB();
}


// ------------------------------------------------------------
// actualizarUsuario(id, nombre, nivel, peso, altura, objetivo)
// ------------------------------------------------------------
// Actualiza los datos de un usuario existente.
// ------------------------------------------------------------
function actualizarUsuario(id, nombre, nivel, peso, altura, objetivo) {
    db.run(
        'UPDATE usuarios SET nombre = ?, nivel = ?, peso = ?, altura = ?, objetivo = ? WHERE id = ?',
        [nombre, nivel, peso, altura, objetivo, id]
    );
    guardarDB();
}


// ============================================================
// FUNCIONES PARA EJERCICIOS
// ============================================================

// ------------------------------------------------------------
// guardarEjercicio(usuarioId, nombre, grupo, dificultad, series, repes)
// ------------------------------------------------------------
// Guarda un ejercicio en la base de datos, vinculado al
// usuario que esta logueado (usuarioId).
// Devuelve el ID que se le asigno.
// ------------------------------------------------------------
function guardarEjercicio(usuarioId, nombre, grupo, dificultad, series, repes) {
    db.run(
        'INSERT INTO ejercicios (usuario_id, nombre, grupo_muscular, dificultad, series, repeticiones) VALUES (?, ?, ?, ?, ?, ?)',
        [usuarioId, nombre, grupo, dificultad, series, repes]
    );
    guardarDB();

    var resultado = db.exec('SELECT last_insert_rowid()');
    return resultado[0].values[0][0];
}


// ------------------------------------------------------------
// obtenerEjercicios(usuarioId)
// ------------------------------------------------------------
// Trae todos los ejercicios de un usuario.
// Vienen ordenados del mas nuevo al mas viejo.
// Devuelve un array vacio si no hay ejercicios.
// ------------------------------------------------------------
function obtenerEjercicios(usuarioId) {
    var resultado = db.exec(
        'SELECT id, nombre, grupo_muscular, dificultad, series, repeticiones, creado_en FROM ejercicios WHERE usuario_id = ' + usuarioId + ' ORDER BY creado_en DESC'
    );

    if (resultado.length === 0) return [];

    var ejercicios = [];
    var filas = resultado[0].values;

    for (var i = 0; i < filas.length; i++) {
        ejercicios.push(new Ejercicio(
            filas[i][0],  // id
            filas[i][1],  // nombre
            filas[i][2],  // grupoMuscular
            filas[i][3],  // dificultad
            filas[i][4],  // series
            filas[i][5],  // repeticiones
            filas[i][6]   // creadoEn
        ));
    }

    return ejercicios;
}


// ------------------------------------------------------------
// guardarSesion(usuarioId, progresionId, series, reps, notas)
// ------------------------------------------------------------
// Guarda una sesion de entrenamiento del usuario.
// ------------------------------------------------------------
function guardarSesion(usuarioId, progresionId, series, reps, notas) {
    db.run(
        'INSERT INTO sesiones (usuario_id, progresion_id, series_hechas, reps_hechas, notas) VALUES (?, ?, ?, ?, ?)',
        [usuarioId, progresionId, series, reps, notas]
    );
    guardarDB();
}


// ------------------------------------------------------------
// obtenerSesiones(usuarioId, limite)
// ------------------------------------------------------------
// Trae las ultimas sesiones de un usuario, con el nombre del
// ejercicio incluido. Ordenadas de la mas nueva a la mas vieja.
// Columnas devueltas (indice):
//   [0]=nombre, [1]=series_hechas, [2]=reps_hechas, [3]=notas,
//   [4]=fecha, [5]=reps_requeridas, [6]=series_requeridas,
//   [7]=grupo_muscular, [8]=nivel, [9]=s.id
// ------------------------------------------------------------
function obtenerSesiones(usuarioId, limite) {
    limite = limite || 10;
    var resultado = db.exec(
        'SELECT p.nombre, s.series_hechas, s.reps_hechas, s.notas, s.fecha, ' +
        'p.reps_requeridas, p.series_requeridas, p.grupo_muscular, p.nivel, s.id ' +
        'FROM sesiones s ' +
        'JOIN progresiones p ON s.progresion_id = p.id ' +
        'WHERE s.usuario_id = ' + usuarioId + ' ' +
        'ORDER BY s.fecha DESC LIMIT ' + limite
    );
    if (resultado.length === 0) return [];
    return resultado[0].values;
}


// ------------------------------------------------------------
// actualizarSesion(id, series, reps, notas)
// ------------------------------------------------------------
function actualizarSesion(id, series, reps, notas) {
    db.run(
        'UPDATE sesiones SET series_hechas = ?, reps_hechas = ?, notas = ? WHERE id = ?',
        [series, reps, notas, id]
    );
    guardarDB();
}


// ------------------------------------------------------------
// eliminarSesion(id)
// ------------------------------------------------------------
function eliminarSesion(id) {
    db.run('DELETE FROM sesiones WHERE id = ?', [id]);
    guardarDB();
}


// ------------------------------------------------------------
// inicializarPlanSemanal(usuarioId)
// ------------------------------------------------------------
// Crea el plan semanal por defecto si no existe.
// ------------------------------------------------------------
function inicializarPlanSemanal(usuarioId) {
    var existe = db.exec('SELECT COUNT(*) FROM plan_semanal WHERE usuario_id = ' + usuarioId);
    if (existe[0].values[0][0] > 0) return;

    var plan = [
        [0, 'Espalda'],   // Lunes
        [1, 'Pecho'],     // Martes
        [2, 'Hombros'],   // Miercoles
        [3, 'Abdomen'],   // Jueves
        [4, 'Piernas'],   // Viernes
        [5, null],        // Sabado
        [6, null],        // Domingo
    ];

    for (var i = 0; i < plan.length; i++) {
        db.run(
            'INSERT INTO plan_semanal (usuario_id, dia, grupo_muscular) VALUES (?, ?, ?)',
            [usuarioId, plan[i][0], plan[i][1]]
        );
    }
    guardarDB();
}


// ------------------------------------------------------------
// obtenerPlanSemanal(usuarioId)
// ------------------------------------------------------------
// Devuelve un array de 7 dias con el grupo muscular asignado.
// ------------------------------------------------------------
function obtenerPlanSemanal(usuarioId) {
    var resultado = db.exec(
        'SELECT dia, grupo_muscular FROM plan_semanal WHERE usuario_id = ' + usuarioId + ' ORDER BY dia'
    );
    if (resultado.length === 0) return [];
    var plan = [];
    for (var i = 0; i < resultado[0].values.length; i++) {
        plan.push({ dia: resultado[0].values[i][0], grupo: resultado[0].values[i][1] });
    }
    return plan;
}


// ------------------------------------------------------------
// guardarPlanSemanal(usuarioId, dia, grupo)
// ------------------------------------------------------------
function guardarPlanSemanal(usuarioId, dia, grupo) {
    db.run(
        'UPDATE plan_semanal SET grupo_muscular = ? WHERE usuario_id = ? AND dia = ?',
        [grupo, usuarioId, dia]
    );
    guardarDB();
}


// ------------------------------------------------------------
// obtenerProgresionesPorGrupo(grupo, nivelMaximo)
// ------------------------------------------------------------
// Trae ejercicios de progresiones filtrados por grupo muscular
// y nivel maximo. Se usa para recomendar ejercicios segun el
// dia y el nivel del usuario.
// ------------------------------------------------------------
function obtenerProgresionesPorGrupo(grupo, nivelMaximo) {
    var resultado = db.exec(
        "SELECT id, nombre, grupo_muscular, nivel, reps_requeridas, series_requeridas, descripcion " +
        "FROM progresiones " +
        "WHERE grupo_muscular = '" + grupo.replace(/'/g, "''") + "' " +
        "AND nivel <= " + nivelMaximo + " " +
        "ORDER BY nivel ASC"
    );
    if (resultado.length === 0) return [];
    return resultado[0].values;
}


// ------------------------------------------------------------
// Trae todos los ejercicios de progresiones hasta un nivel maximo
// ------------------------------------------------------------
function obtenerTodasProgresiones(nivelMaximo) {
    var resultado = db.exec(
        "SELECT nombre, grupo_muscular, nivel, reps_requeridas || 'x' || series_requeridas, descripcion " +
        "FROM progresiones " +
        "WHERE nivel <= " + nivelMaximo + " " +
        "ORDER BY grupo_muscular, nivel ASC"
    );
    if (resultado.length === 0) return [];
    return resultado[0].values;
}


window.iniciarDB = iniciarDB;
window.crearUsuario = crearUsuario;
window.obtenerUsuarios = obtenerUsuarios;
window.obtenerUsuarioPorId = obtenerUsuarioPorId;
window.eliminarUsuario = eliminarUsuario;
window.guardarEjercicio = guardarEjercicio;
window.obtenerEjercicios = obtenerEjercicios;
window.guardarSesion = guardarSesion;
window.obtenerSesiones = obtenerSesiones;
window.actualizarUsuario = actualizarUsuario;
window.inicializarPlanSemanal = inicializarPlanSemanal;
window.obtenerPlanSemanal = obtenerPlanSemanal;
window.guardarPlanSemanal = guardarPlanSemanal;
window.obtenerTodasProgresiones = obtenerTodasProgresiones;
window.obtenerProgresionesPorGrupo = obtenerProgresionesPorGrupo;
window.actualizarSesion = actualizarSesion;
window.eliminarSesion = eliminarSesion;
