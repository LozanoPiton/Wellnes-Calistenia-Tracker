# 📐 Diseño UML y Arquitectura del Sistema

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  

---

## 1. Diagrama de Casos de Uso
* **Actores:** Atleta (Usuario) y Proceso Principal (Electron Main Process).

```mermaid
graph TD
    user((Atleta))
    
    subgraph WELLNESS
        UC1(Registrar Perfil)
        UC2(Consultar Catalogo)
        UC3(Registrar Sesion)
        UC4(Gestionar Plan)
        UC5(Solicitar IA)
        UC6(Evaluacion Local)
    end

    user --> UC1
    user --> UC2
    user --> UC3
    user --> UC4
    user --> UC5
    UC5 -.-> UC6 
```
## 2. Diagrama de Clases
Definición de clases orientadas a objetos tal como están implementadas en `src/clases.js` (constructores sin métodos de negocio; la lógica de persistencia vive en `src/database.js`):

```mermaid
classDiagram
    class Usuario {
        +int id
        +string nombre
        +string nivel
        +float peso
        +float altura
        +string objetivo
        +string creadoEn
    }

    class Ejercicio {
        +int id
        +string nombre
        +string grupoMuscular
        +string dificultad
        +int series
        +int repeticiones
        +string creadoEn
    }

    class Rutina {
        +int id
        +string nombreRutina
        +string objetivo
        +array listaEjercicios
        +agregarEjercicio(ejercicio, series, repeticiones)
    }

    class Sesion {
        +int id
        +int usuarioId
        +int progresionId
        +int seriesHechas
        +int repsHechas
        +string notas
        +string fecha
    }

    Usuario "1" -- "0..*" Sesion : registra
   Rutina "1" --> "0..*" Ejercicio : "listaEjercicios"
```

## 3. Arquitectura del Sistema (Electron Multi-Process)
La aplicación utiliza la arquitectura nativa de Electron, dividida en dos capas principales, con canales IPC acotados:

1. **Proceso Principal (`main.js`):** Encargado de la gestión de la ventana, persistencia y auditoría (`wellness.log`, `wellness.db` vía `sql.js`), carga de claves API (desde `.env` o vía IPC) y las llamadas a la API de **OpenRouter**.

2. **Proceso Renderizador (`index.html` + `src/*.js`):** Interfaz gráfica SPA (Single Page Application) donde se procesa la interacción del usuario, estilos, navegación y lógica de presentación.

Los módulos del Renderizador se comunican con el proceso principal mediante **`ipcRenderer.invoke()`** a los canales registrados en `ipcMain` (`log-write`, `ia-set-key`, `ia-analyze`, `app-close`). En esta versión no se utiliza `preload.js` ni `contextBridge`: `nodeIntegration: true` y `contextIsolation: false` permiten el uso directo de `electron.ipcRenderer` desde los scripts del renderer (acceso a Node.js desde la UI). No se carga contenido remoto; toda la aplicación se sirve localmente.
