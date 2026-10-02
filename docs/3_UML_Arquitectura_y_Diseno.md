# 📐 Diseño UML y Arquitectura del Sistema

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  

---

## 1. Diagrama de Casos de Uso
* **Actores:** Atleta (Usuario) y Proceso Principal (Electron Main Process).

```mermaid
graph TD
    user((Atleta))
    
    subgraph WELLNESS System
        UC1(Registrar / Editar Perfil)
        UC2(Consultar Catálogo)
        UC3(Registrar Sesión)
        UC4(Gestionar Plan Semanal)
        UC5(Solicitar Diagnóstico IA)
        UC6(Evaluación Heurística Local)
    end

    user --> UC1
    user --> UC2
    user --> UC3
    user --> UC4
    user --> UC5
    UC5 ..> UC6 : fallback

2. Diagrama de Clases
Estructura de las clases principales orientadas a objetos aplicadas en la arquitectura del sistema (src/clases.js):
classDiagram
    class Usuario {
        +int id
        +string nombre
        +string nivel
        +float peso
        +float altura
        +guardar()
    }

    class Ejercicio {
        +int id
        +string grupoMuscular
        +string nombre
        +int nivel
    }

    class Sesion {
        +int id
        +int usuarioId
        +int progresionId
        +int seriesHechas
        +int repsHechas
        +string fecha
    }

    Usuario "1" -- "0..*" Sesion : realiza
    Ejercicio "1" -- "0..*" Sesion : contiene

3. Arquitectura del Sistema (Electron Multi-Process)
La aplicación utiliza la arquitectura nativa de Electron, dividida en tres capas de responsabilidad:

1. Proceso Principal (main.js): Encargado de la gestión de la ventana, acceso al sistema de archivos local para la auditoría (wellness.log), carga de variables de entorno y llamadas directas a APIs de Inteligencia Artificial (OpenRouter).

2. Proceso Renderizador (index.html + src/*.js): Interfaz gráfica SPA (Single Page Application) donde se procesa la interacción del usuario, estilos y navegación sin recargar la página.

3. Puente IPC (contextBridge): Canalización segura de mensajes asíncronos mediante ipcMain e ipcRenderer, evitando exponer el motor Node.js directamente a la vista.
