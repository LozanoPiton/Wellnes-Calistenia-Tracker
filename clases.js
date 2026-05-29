// ============================================================
// clases.js  —  LOS MOLDES DE LA APP
// ============================================================
// Aca definimos las "clases", que son como moldes para crear
// objetos. Por ejemplo, la clase Ejercicio es el molde para
// crear ejercicios, y la clase Rutina es el molde para crear
// rutinas de entrenamiento.
// ============================================================


// ------------------------------------------------------------
// Ejercicio
// ------------------------------------------------------------
// Molde para crear un ejercicio. Cada ejercicio tiene:
//   - id: numero unico para identificarlo
//   - nombre: ej "Dominadas"
//   - grupoMuscular: ej "Espalda"
//   - dificultad: ej "Intermedio"
//
// Para crear uno nuevo:
//   var ej = new Ejercicio(1, "Dominadas", "Espalda", "Intermedio");
// ------------------------------------------------------------
class Ejercicio {
    constructor(id, nombre, grupoMuscular, dificultad) {
        this.id = id;
        this.nombre = nombre;
        this.grupoMuscular = grupoMuscular;
        this.dificultad = dificultad;
    }
}


// ------------------------------------------------------------
// Rutina
// ------------------------------------------------------------
// Molde para crear una rutina. Una rutina tiene:
//   - id: numero unico
//   - nombreRutina: ej "Rutina de Torso"
//   - objetivo: ej "Fuerza"
//   - listaEjercicios: aca se van acumulando los ejercicios
//
// Metodos:
//   agregarEjercicio(ejercicio, series, repeticiones)
//     → mete un ejercicio en la lista de la rutina
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


// Exportamos las clases para que otros archivos las puedan usar
window.Ejercicio = Ejercicio;
window.Rutina = Rutina;
