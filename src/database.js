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
var initSqlJs = require('sql.js');  // sql.js = SQLite en JS
var fs = require('fs');             // fs = File System (archivos)
var path = require('path');         // path = rutas de archivos

// La ruta donde se guarda la base de datos
// __dirname = carpeta del HTML (root del proyecto), no la de este archivo
// en Electron renderer con nodeIntegration. Por eso va directo.
var RUTA_DB = path.join(__dirname, 'wellness.db');

// "db" es la conexion a la base de datos
// Arranca como null y se llena cuando llamamos a iniciarDB()
// Se exporta a window para que otros modulos puedan usarla
var db = null;
window.db = null;


// ------------------------------------------------------------
// iniciarDB()
// ------------------------------------------------------------
// Se llama una sola vez al abrir la app.
// Hace 3 cosas:
//   1. Carga el motor de sql.js
//   2. Si ya existe wellness.db → lo abre
//      Si no existe → lo crea desde cero
//   3. Crea las tablas si no existen
//
// "async" significa que esta funcion es asincronica (tarda
// un poco en ejecutarse porque tiene que cargar el WASM).
// ============================================================
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
    //
    // Columnas:
    //   id       → numero unico (se auto-incrementa solo)
    //   nombre   → el nombre de la persona
    //   nivel    → Principiante, Intermedio o Experto
    //   peso     → peso en kg (puede estar vacio = null)
    //   altura   → altura en cm (puede estar vacio = null)
    //   objetivo → meta del usuario (ej: "10 dominadas")
    //   creado_en → fecha y hora de cuando se creo
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
    //
    // Columnas:
    //   id             → numero unico
    //   usuario_id     → a que usuario pertenece este ejercicio
    //   nombre         → ej: "Dominadas"
    //   grupo_muscular → ej: "Espalda"
    //   dificultad     → ej: "Intermedio"
    //   series         → cuantas series
    //   repeticiones   → cuantas repeticiones
    //   creado_en      → fecha y hora
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

    // ---------------------------------------------------------
    // MIGRACION: si la base de datos es vieja y le faltan
    // columnas, las agregamos aca.
    // ---------------------------------------------------------
    // "CREATE TABLE IF NOT EXISTS" no modifica tablas viejas.
    // Entonces probamos si la columna "peso" existe y si no,
    // la agregamos con ALTER TABLE.
    // ---------------------------------------------------------
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

    // Migracion: columna objetivo
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
        'dia       INTEGER NOT NULL,' +   // 0=Lunes ... 6=Domingo
        'grupo_muscular TEXT,' +
        'FOREIGN KEY (usuario_id) REFERENCES usuarios(id)' +
    ')');

    // Guardamos los cambios al disco
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
    var datos = db.export();       // Exporta la DB como bytes
    var buffer = Buffer.from(datos); // Convierte los bytes a buffer
    fs.writeFileSync(RUTA_DB, buffer); // Escribe el archivo en disco
}


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
// ------------------------------------------------------------
function obtenerSesiones(usuarioId, limite) {
    limite = limite || 10;
    var resultado = db.exec(
        'SELECT p.nombre, s.series_hechas, s.reps_hechas, s.notas, s.fecha, ' +
        'p.reps_requeridas, p.series_requeridas, p.grupo_muscular, p.nivel ' +
        'FROM sesiones s ' +
        'JOIN progresiones p ON s.progresion_id = p.id ' +
        'WHERE s.usuario_id = ' + usuarioId + ' ' +
        'ORDER BY s.fecha DESC LIMIT ' + limite
    );
    if (resultado.length === 0) return [];
    return resultado[0].values;
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


// En Electron con nodeIntegration, las funciones se comparten
// a traves de window. Asi auth.js, ejercicios.js, etc.
// pueden llamar a estas funciones de base de datos.
// ============================================================
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
window.obtenerProgresionesPorGrupo = obtenerProgresionesPorGrupo;
