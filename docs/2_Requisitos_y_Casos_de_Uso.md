# 🎯 Especificación de Requisitos y Modelo de Datos

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  

---

## 1. Necesidades Identificadas
El seguimiento del entrenamiento de calistenia requiere medir el progreso por niveles y metas específicas (series y repeticiones por ejercicio). Las aplicaciones genéricas no adaptan sus métricas a esta disciplina ni ofrecen análisis contextualizados offline.

---

## 2. Requisitos Funcionales (RF) y No Funcionales (RNF)

### Requisitos Funcionales
1. **RF01 - Gestión de Usuario:** Registro, consulta y edición de perfil (nombre, peso, altura, nivel, objetivo).
2. **RF02 - Catálogo de Ejercicios:** Exploración de más de 100 progresiones filtradas por grupo muscular y nivel.
3. **RF03 - Registro de Sesiones:** Captura de series y repeticiones realizadas con retroalimentación inmediata frente a la meta.
4. **RF04 - Historial Transaccional:** Consulta, modificación y eliminación de sesiones de entrenamiento registradas.
5. **RF05 - Planificación Semanal:** Visualización de rutinas diarias y porcentaje de cumplimiento.
6. **RF06 - Análisis con IA Externa:** Diagnóstico integral de progreso, recomendaciones técnicas y plan alternativo mediante OpenRouter.
7. **RF07 - Motor de Reglas Local:** Detección offline de estancamiento (3 fallos seguidos) y evaluación de ascenso de nivel.
8. **RF08 - Registro de Auditoría:** Escribir eventos del sistema y errores en `wellness.log`.
9. **RF09 - Selección de Idioma:** Alternancia dinámica de interfaz entre español e inglés.
10. **RF10 - Personalización Visual:** Modos de color claro y oscuro.

### Requisitos No Funcionales
1. **RNF01 - Disponibilidad Offline:** Operatividad del 100% de funciones principales sin conexión a internet.
2. **RNF02 - Portabilidad Desktop:** Ejecución nativa mediante marco de trabajo Electron en sistemas de escritorio.
3. **RNF03 - Persistencia Embebida:** Uso de base de datos SQLite compilada a WebAssembly (`sql.js`).
4. **RNF04 - Seguridad IPC:** Comunicación entre Renderizador y Proceso Principal mediante canales IPC acotados (`log-write`, `ia-set-key`, `ia-analyze`, `app-close`) registrados en `ipcMain` e invocados con `ipcRenderer.invoke()`. La configuración actual es `nodeIntegration: true` y `contextIsolation: false` (sin `preload.js`).
5. **RNF05 - Rendimiento:** Tiempos de respuesta inferiores a 200ms en consultas a la base de datos local.

---

## 3. Requisitos de Datos (Esquema de Base de Datos)
El sistema utiliza cinco entidades principales en `wellness.db`:
* **`usuarios`**: `id`, `nombre`, `nivel`, `peso`, `altura`, `objetivo`, `creado_en`.
* **`ejercicios`**: `id`, `usuario_id`, `nombre`, `grupo_muscular`, `dificultad`, `series`, `repeticiones`, `creado_en`.
* **`progresiones`**: `id`, `grupo_muscular`, `nombre`, `nivel`, `reps_requeridas`, `series_requeridas`, `siguiente_id`, `descripcion`.
* **`sesiones`**: `id`, `usuario_id`, `progresion_id`, `series_hechas`, `reps_hechas`, `notas`, `fecha`.
* **`plan_semanal`**: `id`, `usuario_id`, `dia`, `grupo_muscular`.
