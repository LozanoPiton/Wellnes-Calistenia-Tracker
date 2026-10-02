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

| Hito | Descripción | Entregables Clave |
| :--- | :--- | :--- |
| **Hito 1: Requisitos y Arquitectura** | Definición del alcance local y estructura base de Electron. | Documento de requisitos y maquetación inicial. |
| **Hito 2: Persistencia y Core UI** | Integración de `sql.js` para la base de datos embebida y flujo SPA. | Tablas SQLite (`wellness.db`) y navegación funcional. |
| **Hito 3: Motor Dual de IA e IPC** | Implementación del motor de reglas local y conexión a OpenRouter. | Módulo `ia.js` y puente IPC de seguridad. |
| **Hito 4: Pruebas, Auditoría y Cierre** | Verificación funcional, registro de eventos y preparación académica. | Trazas en `wellness.log`, carpeta `/docs` y capturas. |

---

## 3. Matriz y Gestión de Riesgos

| Riesgo Identificado | Impacto | Probabilidad | Plan de Mitigación / Contingencia |
| :--- | :---: | :---: | :--- |
| **Indisponibilidad de API externa de IA (OpenRouter)** | Alto | Media | Implementación de **Motor Dual**: conmutación automática al algoritmo de reglas heurísticas local sin internet. |
| **Errores de compilación de SQLite nativo en Electron** | Alto | Alta | Sustitución de módulos nativos por **`sql.js` (WebAssembly)**, garantizando ejecución directa en memoria/disco. |
| **Bloqueos de seguridad en el sistema de archivos** | Medio | Media | Aislamiento de contexto y canalización de escrituras (`wellness.log`) mediante **IPC Bridges** de Electron. |
| **Pérdida de datos por cierre inesperado de la app** | Alto | Baja | Ejecución de la función `guardarDB()` tras cada inserción o modificación de datos en la aplicación. |
