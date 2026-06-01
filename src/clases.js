// ============================================================
// clases.js  —  LOS MOLDES DE LA APP (POO)
// ============================================================
// Este archivo define las clases que se usan en toda la app.
// Cada clase es un molde para crear objetos con la misma
// estructura.
//
// CLASES:
//   Usuario   → representa una persona que usa la app
//   Ejercicio → representa un ejercicio guardado
//   Rutina    → representa una rutina armada con ejercicios
// ============================================================


// ------------------------------------------------------------
// Usuario
// ------------------------------------------------------------
// Molde para crear un usuario. Cada usuario tiene:
//   - id:        numero unico (lo asigna la DB)
//   - nombre:    ej "Lili"
//   - nivel:     "Principiante", "Intermedio" o "Experto"
//   - peso:      peso en kg (puede ser null)
//   - altura:    altura en cm (puede ser null)
//   - objetivo:  meta del usuario (ej: "10 dominadas")
//   - creadoEn:  fecha de creacion (string)
//
// Para crear uno nuevo:
//   var u = new Usuario(1, "Lili", "Intermedio", 65, 170, "10 dominadas", "2025-01-01");
// ------------------------------------------------------------
class Usuario {
    constructor(id, nombre, nivel, peso, altura, objetivo, creadoEn) {
        this.id = id;
        this.nombre = nombre;
        this.nivel = nivel;
        this.peso = peso;
        this.altura = altura;
        this.objetivo = objetivo;
        this.creadoEn = creadoEn;
    }
}


// ------------------------------------------------------------
// Ejercicio
// ------------------------------------------------------------
// Molde para crear un ejercicio. Cada ejercicio tiene:
//   - id:             numero unico
//   - nombre:         ej "Dominadas"
//   - grupoMuscular:  ej "Espalda"
//   - dificultad:     ej "Intermedio"
//   - series:         cantidad de series
//   - repeticiones:   cantidad de repeticiones
//   - creadoEn:       fecha de creacion
// ------------------------------------------------------------
class Ejercicio {
    constructor(id, nombre, grupoMuscular, dificultad, series, repeticiones, creadoEn) {
        this.id = id;
        this.nombre = nombre;
        this.grupoMuscular = grupoMuscular;
        this.dificultad = dificultad;
        this.series = series;
        this.repeticiones = repeticiones;
        this.creadoEn = creadoEn;
    }
}


// ------------------------------------------------------------
// Rutina
// ------------------------------------------------------------
// Molde para crear una rutina de entrenamiento.
// Una rutina arranca vacia y se le van agregando ejercicios
// con el metodo agregarEjercicio().
//
//   var r = new Rutina(1, "Torso", "Fuerza");
//   r.agregarEjercicio(ej1, 4, 10);
//   r.agregarEjercicio(ej2, 3, 12);
// ------------------------------------------------------------
class Rutina {
    constructor(id, nombreRutina, objetivo) {
        this.id = id;
        this.nombreRutina = nombreRutina;
        this.objetivo = objetivo;
        this.listaEjercicios = [];
    }

    agregarEjercicio(ejercicio, series, repeticiones) {
        this.listaEjercicios.push({
            ejercicio: ejercicio,
            series: series,
            repeticiones: repeticiones
        });
    }
}


// ------------------------------------------------------------
// Sesion
// ------------------------------------------------------------
// Molde para registrar una sesion de entrenamiento.
// Cada sesion guarda lo que el usuario hizo en el dia.
// ------------------------------------------------------------
class Sesion {
    constructor(id, usuarioId, progresionId, seriesHechas, repsHechas, notas, fecha) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.progresionId = progresionId;
        this.seriesHechas = seriesHechas;
        this.repsHechas = repsHechas;
        this.notas = notas;
        this.fecha = fecha;
    }
}


// Exportamos las clases para que otros archivos las puedan usar
window.Usuario = Usuario;
window.Ejercicio = Ejercicio;
window.Rutina = Rutina;
window.Sesion = Sesion;
