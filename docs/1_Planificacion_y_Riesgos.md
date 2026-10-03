# 📋 Planificación del Proyecto y Análisis de Riesgos

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  

---

## 1. Metodología de Desarrollo
El proyecto se desarrolló bajo el marco de trabajo **Scrum Adaptado**, utilizando un ciclo de vida iterativo e incremental compuesto por sprints de 2 semanas de duración. Esta metodología permitió adaptar las funcionalidades locales de la aplicación y la integración progresiva de la Inteligencia Artificial.

### Matriz de Responsabilidades (RACI)
* **Luis Lozano:** Lead UI/UX, Maquetación CSS, Diseño de Vistas SPA, Flujos de Pantalla y Casos de Uso.
* **Liliana Gutiérrez y Luis Lozano:** Backend & Arquitectura de Software, Persistencia SQLite (`sql.js`), Canales IPC Electron, Motor Dual de IA y Auditoría de Sistema (`wellness.log`).

---

## 2. Hitos y Cronograma del Proyecto

| Hito | Descripción | Entregables Clave | Fecha Planificada | Fecha Realizada |
| :--- | :--- | :--- | :--- | :--- |
| **Hito 1: Requisitos y Arquitectura** | Definición del alcance local y estructura base de Electron. | Documento de requisitos y maquetación inicial. | 2026-05-19 | 2026-05-19 |
| **Hito 2: Persistencia y Core UI** | Integración de `sql.js` para la base de datos embebida y flujo SPA. | Tablas SQLite (`wellness.db`) y navegación funcional. | 2026-05-26 | 2026-05-26 |
| **Hito 3: Módulos funcionales** | Desarrollo de autenticación, plan semanal, historial, ejercicios y navegación. | Módulos `src/*.js` funcionando. | 2026-05-27 – 2026-06-01 | 2026-05-27 – 2026-06-01 |
| **Hito 4: Motor Dual de IA e IPC** | Implementación del motor de reglas local y conexión a OpenRouter. | Módulo `ia.js`, `main.js` con canales IPC y análisis heurístico. | 2026-06-08 – 2026-06-13 | 2026-06-08 – 2026-06-13 |
| **Hito 5: Mejoras, correcciones y UX** | Correcciones de UI, contraste, asincronía y reintentos de IA. | Ajustes en CSS, `main.js` y módulos de vista. | 2026-06-17 – 2026-06-19 | 2026-06-17 – 2026-06-19 |
| **Hito 6: Pruebas, Auditoría y Cierre** | Verificación funcional, registro de eventos y preparación académica. | Trazas en `wellness.log`, carpeta `/docs`, README y `documentacion.txt`. | 2026-09-23 – 2026-10-02 | 2026-09-23 – 2026-10-02 |

**Diagrama Gantt (resumen por sprint):**

| Sprint | Fechas | Actividades |
| :--- | :--- | :--- |
| Sprint 1 | 2026-05-19 – 2026-05-25 | Análisis, arquitectura, estructura base de Electron. |
| Sprint 2 | 2026-05-26 – 2026-06-01 | Persistencia `sql.js`, SPA, autenticación y plan semanal. |
| Sprint 3 | 2026-06-02 – 2026-06-08 | Historial, catálogo y navegación. |
| Sprint 4 | 2026-06-09 – 2026-06-15 | Motor IA (OpenRouter + análisis local), canales IPC. |
| Sprint 5 | 2026-06-16 – 2026-06-22 | Ajustes UX, estabilidad, correcciones. |
| Cierre | 2026-09-23 – 2026-10-02 | Revisión final, documentación, auditoría y entrega. |

---

## 3. Matriz y Gestión de Riesgos

| Riesgo Identificado | Impacto | Probabilidad | Plan de Mitigación / Contingencia |
| :--- | :---: | :---: | :--- |
| **Indisponibilidad de API externa de IA (OpenRouter)** | Alto | Media | Implementación de **Motor Dual**: conmutación automática al algoritmo de reglas heurísticas local sin internet. |
| **Errores de compilación de SQLite nativo en Electron** | Alto | Alta | Sustitución de módulos nativos por **`sql.js` (WebAssembly)**, garantizando ejecución directa en memoria/disco. |
| **Bloqueos de seguridad en el sistema de archivos** | Medio | Media | Aislamiento de contexto y canalización de escrituras (`wellness.log`) mediante **IPC Bridges** de Electron. |
| **Pérdida de datos por cierre inesperado de la app** | Alto | Baja | Ejecución de la función `guardarDB()` tras cada inserción o modificación de datos en la aplicación. |
