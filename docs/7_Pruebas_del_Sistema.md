# 🧪 Plan de Pruebas del Sistema y Resultados

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  
**Profesora:** Yaskelly  

---

## 1. Estrategia de Pruebas

Para garantizar la calidad y estabilidad de la aplicación **WELLNESS - Calistenia Tracker**, se definió una estrategia de pruebas por niveles que abarca la lógica de negocio, la persistencia de datos local y la interfaz de usuario basada en Electron.

---

## 2. Casos de Prueba Ejecutados

### 2.1. Pruebas Unitarias (Lógica de Negocio y Modelos)

| ID | Módulo / Función | Descripción del Test | Resultado Esperado | Estado |
| :---: | :--- | :--- | :--- | :---: |
| **TU-01** | `Usuario.guardar()` | Almacenamiento de nuevo perfil de atleta. | El perfil se crea correctamente en memoria y genera ID único. | **PASS** |
| **TU-02** | `Sesion.validar()` | Validación de campos obligatorios en entrenamiento. | Retorna error si series o repeticiones son menores a 1. | **PASS** |
| **TU-03** | `Ejercicio.filtrar()` | Filtrado de catálogo por grupo muscular. | Retorna únicamente los ejercicios correspondientes a la categoría elegida. | **PASS** |

### 2.2. Pruebas de Integración (Electron IPC & Persistencia)

| ID | Módulo / Función | Descripción del Test | Resultado Esperado | Estado |
| :---: | :--- | :--- | :--- | :---: |
| **TI-01** | IPC Communication (`preload.js`) | Envío de eventos desde la vista (Renderer) al proceso principal (Main). | La información del formulario llega sin pérdida de datos. | **PASS** |
| **TI-02** | Local Storage / JSON Persistence | Escritura y lectura del historial en disco local. | Los datos guardados se mantienen intactos al reiniciar la app. | **PASS** |
| **TI-03** | API Integration (Gemini IA) | Envío de prompt con métricas de usuario y recepción de recomendación. | Retorna respuesta estructurada en JSON/texto con la sugerencia de rutina. | **PASS** |

### 2.3. Pruebas de Interfaz y Usabilidad (UI)

| ID | Escenario de Uso | Paso a Paso | Resultado Obtenido | Estado |
| :---: | :--- | :--- | :--- | :---: |
| **TUI-01** | Registro de entrenamiento | Seleccionar ejercicio → Ingresar series/reps → Clic en 'Registrar'. | La tabla de progreso se actualiza inmediatamente en pantalla. | **PASS** |
| **TUI-02** | Consulta de diagnóstico IA | Clic en 'Generar Diagnóstico' en la vista de IA. | Muestra un indicador de carga y luego despliega la recomendación. | **PASS** |

---

## 3. Matriz de Cobertura y Resumen de Resultados

* **Total de pruebas diseñadas:** 8
* **Pruebas aprobadas (PASS):** 8 (100%)
* **Pruebas fallidas (FAIL):** 0
* **Conclusión de calidad:** La aplicación cumple con todos los requisitos funcionales esperados y opera de forma estable en el entorno de desarrollo local.
