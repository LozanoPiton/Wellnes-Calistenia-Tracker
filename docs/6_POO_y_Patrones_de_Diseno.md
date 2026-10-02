# 🧩 Programación Orientada a Objetos y Patrones de Diseño

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  
**Profesora:** Yaskelly  

---

## 1. Aplicación de Programación Orientada a Objetos (POO)

El proyecto utiliza el paradigma orientado a objetos en JavaScript ES6 para modelar las entidades del dominio en la aplicación (`src/clases.js`):

### 1.1. Abstracción y Encapsulamiento
* **Clase `Usuario`:** Representa al atleta dentro del sistema. Encapsula atributos como `id`, `nombre`, `nivel`, `peso` y `altura`, protegiendo la estructura interna y exponiendo métodos como `guardar()` y `obtenerIMC()`.
* **Clase `Ejercicio`:** Define las características de cada movimiento de calistenia (`id`, `grupoMuscular`, `nombre`, `nivel`).
* **Clase `Sesion`:** Modela un registro de entrenamiento individual, vinculando al usuario con la progresión, repeticiones e intensidad alcanzada.

```javascript
// Ejemplo de implementación de clases en la solución
class Usuario {
  constructor(id, nombre, nivel, peso, altura) {
    this.id = id;
    this.nombre = nombre;
    this.nivel = nivel;
    this.peso = peso;
    this.altura = altura;
  }

  obtenerResumen() {
    return `${this.nombre} - Nivel: ${this.nivel} (${this.peso}kg)`;
  }
}
```
2. Patrones de Diseño Aplicados
Para mantener un código limpio, desacoplado y mantenible dentro del ecosistema de Electron, se implementaron los siguientes patrones:

2.1. Patrón Singleton (Gestor de Datos Local)
Propósito: Garantizar que exista una sola instancia activa del gestor de persistencia (StorageManager) durante la ejecución del programa.

Uso en el código: Evita la sobreescritura accidental o conflictos al leer/escribir el archivo JSON de datos de entrenamientos.

2.2. Patrón Bridge / IPC Communication (Electron Channel)
Propósito: Desacoplar la interfaz de usuario (Renderer) de los recursos del sistema operativo manejados por el proceso principal (Main).

Uso en el código: Implementado mediante contextBridge e ipcRenderer en preload.js, canalizando las peticiones de almacenamiento y consulta con la API de IA sin exponer la API nativa de Node.js a la vista.

2.3. Patrón Observer (Manejo de Eventos DOM)
Propósito: Reaccionar a las interacciones del usuario de manera asíncrona.

Uso en el código: Los componentes de la interfaz suscritos a eventos (addEventListener) reaccionan al registro de un nuevo ejercicio actualizando en tiempo real la tabla de progreso sin necesidad de recargar la ventana.
