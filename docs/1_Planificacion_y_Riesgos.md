# 📑 Planificación y Gestión de Riesgos

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  
**Profesora:** Yaskelly  

---

## 1. Alcance y Objetivos del Proyecto

### 1.1. Objetivo General
Desarrollar una aplicación de escritorio intuitiva y funcional mediante **Electron**, **SQLite (`sql.js`)** e **Inteligencia Artificial (OpenRouter)** para la gestión, seguimiento y análisis de rutinas de calistenia y entrenamiento físico de forma local.

### 1.2. Objetivos Específicos
- **Persistencia Local:** Implementar una base de datos embebida `wellness.db` gestionada mediante `sql.js` para asegurar un rendimiento óptimo sin dependencia de servidores externos.
- **Asistencia Inteligente:** Integrar la API de **OpenRouter** respaldada por un motor heurístico local para ofrecer recomendaciones personalizadas sobre el progreso y estancamiento del usuario.
- **Experiencia de Usuario (UX):** Diseñar una interfaz reactiva con soporte multi-idioma (Español/Inglés) y cambio de tema dinámico (Claro/Oscuro).

---

## 2. Matriz de Gestión de Riesgos

A continuación se detallan los riesgos identificados durante la ejecución del proyecto, su nivel de impacto, probabilidad y las medidas de mitigación aplicadas en la versión final:

| Riesgo | Impacto | Probabilidad | Plan de Mitigación / Estado |
| :--- | :--- | :--- | :--- |
| **Acceso a Node.js en Renderer (`nodeIntegration: true`)** | Medio | Baja | **Mitigado:** La aplicación se ejecuta en un entorno local seguro sin navegación externa; únicamente procesa archivos HTML/JS del proyecto (`index.html`). Se asume como limitación documentada de arquitectura. |
| **Falta de Conexión o API Key de IA (OpenRouter)** | Alto | Media | **Mitigado:** Se diseñó un motor de reglas heurísticas en `src/ia.js` que evalúa estancamientos y progresiones sin requerir conexión a internet ni API Key. |
| **Bloqueo o Corrupción de la Base de Datos SQLite** | Alto | Baja | **Mitigado:** Manejo de escrituras e in-memory a través de `sql.js` con persistencia periódica en la base de datos `wellness.db`. |
| **Discrepancias entre Documentación y Código Main** | Medio | Media | **Mitigado:** Corrección y alineación continua de la carpeta `docs/` con las clases, métodos y configuraciones reales implementadas en la rama `main`. |

---

## 3. Plan de Recursos y Tecnologías Utilizadas

- **Entorno de Desarrollo:** Electron (Node.js, Chromium).
- **Base de Datos:** SQLite embebido mediante WebAssembly (`sql.js`).
- **Lógica e Interfaz:** JavaScript (ES6+), HTML5, CSS3.
- **Integraciones:** API OpenRouter (Modelos de LLM) / GROQ Fallback.
- **Gestión de Versiones:** Git, GitHub (Repositorio `LozanoPiton/Wellnes-Calistenia-Tracker` y Fork `Liligs1/Wellnes-Calistenia-Tracker`).

---

## 4. Cronograma de Ejecución (Diagrama de Gantt Final)

Este cronograma refleja el tiempo real de ejecución del proyecto planificado y registrado en **GanttProject**:

```mermaid
gantt
    title Cronograma de Desarrollo - WELLNESS Calistenia Tracker
    dateFormat  YYYY-MM-DD
    
    section Fase 1: Planificación y Diseño
    Fase 2 Requerimientos Funcionales y No Funcionales :a1, 2026-05-11, 2026-05-11
    Diseño UI/UX, UML y Datos                          :a2, 2026-05-21, 2026-06-04
    Diseño UML y Base de Datos (sql.js)                :a3, 2026-05-28, 2026-05-29
    Arquitectura y Patrones POO                        :a4, 2026-06-01, 2026-06-04
    
    section Fase 2: Desarrollo (Iteraciones)
    Iteración 1 Perfil / Autenticación                 :b1, 2026-06-08, 2026-06-09
    Iteración 2 Gestión de Rutinas y Catálogo          :b2, 2026-06-12, 2026-06-18
    Iteración 3 Progreso e Interfaz (Dark/Light)        :b3, 2026-06-25, 2026-06-26
    Iteración 4 Sugerencias IA (OpenRouter / Local)    :b4, 2026-06-26, 2026-07-02
    
    section Fase 3: Integración, Pruebas y Cierre
    Integración y Pruebas Funcionales                  :c1, 2026-07-03, 2026-07-09
    Integración Final y Seguridad (Electron)           :c2, 2026-07-06, 2026-07-10
    Pruebas Funcionales e Integradas                   :c3, 2026-07-06, 2026-07-09
