// =========================================================
// MODELO DE DATOS - PARADIGMA ORIENTADO A OBJETOS (POO)
// =========================================================

// 1. Entidad Ejercicio: Define cada movimiento de calisthenics
class Ejercicio {
  constructor(id, nombre, grupoMuscular, dificultad) {
    this.id = id;
    this.nombre = nombre; // Ej: "Dominadas", "Fondos"
    this.grupoMuscular = grupoMuscular; // Ej: "Espalda", "Pecho"
    this.dificultad = dificultad; // Ej: "Principiante", "Intermedio", "Avanzado"
  }
}

// 2. Entidad Rutina: Maneja la lista de ejercicios del entrenamiento
class Rutina {
  constructor(id, nombreRutina, objetivo) {
    this.id = id;
    this.nombreRutina = nombreRutina; // Ej: "Rutina de Empuje"
    this.objetivo = objetivo; // Ej: "Fuerza", "Hipertrofia"
    this.listaEjercicios = []; // Array donde se acumulan los ejercicios
  }

  // Método para añadir ejercicios con sus series y repeticiones
  agregarEjercicio(ejercicio, series, repeticiones) {
    this.listaEjercicios.push({
      ejercicio: ejercicio,
      series: series,
      repeticiones: repeticiones,
    });
    console.log(
      `💪 Ejercicio [${ejercicio.nombre}] añadido a la rutina: ${this.nombreRutina}`,
    );
  }
}

// 3. Entidad Usuario: Controla el perfil del atleta
class Usuario {
  constructor(id, nombre, nivelActual) {
    this.id = id;
    this.nombre = nombre;
    this.nivelActual = nivelActual; // Ej: "Intermedio"
    this.rutinasGuardadas = []; // Lista de rutinas del usuario
  }

  guardarRutina(rutina) {
    this.rutinasGuardadas.push(rutina);
    console.log(
      `💾 Rutina "${rutina.nombreRutina}" guardada con éxito en el perfil de ${this.nombre}`,
    );
  }
}

// =========================================================
// --- SIMULACIÓN EN CONSOLA PARA PROBAR EL PROYECTO ---
// =========================================================
console.log("=========================================");
console.log(" ¡HOLA LILI! PROBANDO EL MOTOR DE TU APP ");
console.log("=========================================");

// Creamos dos ejercicios de prueba
const ej1 = new Ejercicio(1, "Dominadas", "Espalda", "Intermedio");
const ej2 = new Ejercicio(2, "Flexiones de Pecho", "Pecho", "Principiante");

// Creamos una rutina vacía
const miEntrenamiento = new Rutina(101, "Rutina de Torso", "Fuerza");

// Exportamos las clases para que el frontend de Electron las pueda usar
window.Ejercicio = Ejercicio;
window.Rutina = Rutina;
window.Usuario = Usuario;

// Creamos tu usuario y guardamos la rutina
const atleta = new Usuario(1, "LILI", "Intermedio");
atleta.guardarRutina(miEntrenamiento);

console.log;
