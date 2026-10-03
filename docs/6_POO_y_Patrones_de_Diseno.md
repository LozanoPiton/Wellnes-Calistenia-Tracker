# 🧩 Programación Orientada a Objetos y Patrones de Diseño

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  
**Profesora:** Yaskelly  

---

## 1. Aplicación de Programación Orientada a Objetos (POO)

El proyecto utiliza el paradigma orientado a objetos en JavaScript ES6 para modelar las entidades del dominio (`src/clases.js`):

* **Clase `Usuario`:** Representa al atleta dentro del sistema. Sus atributos son `id`, `nombre`, `nivel`, `peso`, `altura`, `objetivo` y `creadoEn`. Se instancia al crear o recuperar usuarios (`src/database.js`).
* **Clase `Ejercicio`:** Define los ejercicios creados por el usuario (`id`, `usuario_id`, `nombre`, `grupoMuscular`, `dificultad`, `series`, `repeticiones`, `creadoEn`).
* **Clase `Rutina`:** Modela una rutina armada con ejercicios; posee el método `agregarEjercicio(ejercicio, series, repeticiones)` que agrega elementos a `listaEjercicios`.
* **Clase `Sesion`:** Modela un registro de entrenamiento individual, vinculando al usuario (`usuarioId`) con la progresión (`progresionId`), las series y repeticiones hechas, las notas y la fecha.

```javascript
// Ejemplo de implementación de clases en la solución
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
```

Estas clases actúan como **constructores de objetos**: no definen métodos de persistencia ni validación; las operaciones `INSERT/UPDATE/DELETE/SELECT` se implementan en `src/database.js` (usando `sql.js`) y la lógica de UI en `src/*.js`.

---

## 2. Patrones de Diseño Aplicados

Los patrones identificados en la implementación son los siguientes:

### 2.1. Patrón Orientado a Módulos (Module Pattern)
El código se organiza por módulos funcionales (`database.js`, `auth.js`, `historial.js`, `plan-semanal.js`, `ia.js`, etc.), exportando funcionalidad al ámbito del renderer (`window.*`, variables globales) y agrupando responsabilidades de acuerdo a las vistas de la SPA.

### 2.2. Patrón Publisher–Subscriber / Event-Driven (Manejo de Eventos DOM)
La interfaz reacciona a las interacciones del usuario mediante `addEventListener` en los módulos de vista. Cuando se registra, edita o elimina una sesión, el historial, el plan semanal y las vistas relacionadas se actualizan sin recargar la ventana.

### 2.3. Patrón Facade (Capa de Acceso a Datos)
`src/database.js` actúa como **facade** entre la UI y la base SQLite (`sql.js`): expone funciones de alto nivel como `crearUsuario()`, `guardarSesion()`, `obtenerSesiones()`, `inicializarPlanSemanal()`, etc., ocultando la sintaxis SQL y la gestión del archivo `wellness.db`.

### 2.4. Patrón Reintentos (Retry Pattern)
Para las llamadas a la API de IA se implementa un reintento con backoff simple (`fetchConReintentos(url, opciones, intentos, esperaMs)` en `main.js`), haciendo el sistema más resistente a fallas transitorias de red.

La configuración actual de Electron (`nodeIntegration: true`, `contextIsolation: false`) y la comunicación directa vía `ipcRenderer.invoke()` no implementan un `StorageManager` Singleton ni un `Bridge` con `preload.js`; la documentación refleja, por tanto, únicamente lo efectivamente presente en el código.