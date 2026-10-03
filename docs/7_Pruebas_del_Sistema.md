# 🧪 Plan de Pruebas del Sistema y Resultados

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  
**Profesora:** Yaskelly  

---

## 1. Estrategia de Pruebas

La aplicación **WELLNESS - Calistenia Tracker** se verifica con **pruebas funcionales manuales** ejecutadas sobre la versión final (rama `main`), cubriendo la lógica de negocio, la persistencia local (SQLite vía `sql.js`) y la interfaz de usuario basada en Electron.

> Nota: el proyecto no incluye un framework de pruebas automatizadas ni archivos `test/`. Las clases del modelo (`src/clases.js`) son constructores puros; el comportamiento se valida desde las funciones de `src/database.js`, los módulos de vista y los canales IPC de `main.js`, por lo que las pruebas se ejecutan manualmente sobre la aplicación empaquetada.

---

## 2. Casos de Prueba Ejecutados

### 2.1. Pruebas de Arranque e Inicialización

| ID | Escenario | Descripción del Test | Resultado Obtenido | Estado |
| :---: | :--- | :--- | :--- | :---: |
| **PA-01** | Apertura de la aplicación | La app abre en pantalla completa y muestra el logo. | La ventana carga `index.html` correctamente. | **PASS** |
| **PA-02** | Inicialización de base | Se crean las tablas y se puebla el catálogo de ejercicios. | Solo inserta lo que falta; nunca borra datos existentes. | **PASS** |
| **PA-03** | Flujo inicial de sesión | Con usuarios existentes muestra el login; sin usuarios, el registro. | La vista inicial es correcta en ambos casos. | **PASS** |

### 2.2. Pruebas de Usuarios (`auth`)

| ID | Escenario | Descripción del Test | Resultado Obtenido | Estado |
| :---: | :--- | :--- | :--- | :---: |
| **PU-01** | Registro de usuario | Valida nombre y nivel, inserta en la tabla `usuarios` y genera el plan semanal por defecto. | El perfil se crea y persiste en `wellness.db`. | **PASS** |
| **PU-02** | Login | Selección de perfil y entrada al sistema. | Toda la interfaz se refresca con los datos del usuario. | **PASS** |
| **PU-03** | Edición de perfil | Modificar nivel, peso, altura u objetivo. | El `UPDATE` se refleja en la base y en la interfaz. | **PASS** |
| **PU-04** | Eliminación de usuario | Eliminar un perfil con confirmación. | El usuario se elimina de la base. | **PASS** |

### 2.3. Pruebas de Sesiones (Entrenar + Historial)

| ID | Escenario | Descripción del Test | Resultado Obtenido | Estado |
| :---: | :--- | :--- | :--- | :---: |
| **PS-01** | Guardar sesión | Elegir ejercicio, cargar series y repeticiones y guardar. | Se muestra feedback contra la meta (cumplida/faltante). | **PASS** |
| **PS-02** | Editar sesión | Editar una sesión existente. | Precarga los valores y actualiza con `UPDATE`. | **PASS** |
| **PS-03** | Eliminar sesión | Eliminar una sesión con confirmación. | La sesión se borra correctamente. | **PASS** |
| **PS-04** | Historial | Consulta del historial con `JOIN` de `sesiones` y `progresiones`. | Se muestran ejercicio, fecha, meta y nivel correctos. | **PASS** |
| **PS-05** | Integridad de datos | Verificación de sesiones ante cambios en el catálogo. | Las sesiones antiguas no quedan huérfanas (sincronización incremental). | **PASS** |

### 2.4. Pruebas del Plan Semanal

| ID | Escenario | Descripción del Test | Resultado Obtenido | Estado |
| :---: | :--- | :--- | :--- | :---: |
| **PP-01** | Día del plan | Muestra el grupo muscular del día correcto (índice `getDay()` ajustado para lunes = día 0). | La correspondencia día → grupo muscular es correcta. | **PASS** |
| **PP-02** | Sugerencias | Lista ejercicios recomendados según el nivel del usuario. | El filtro por nivel devuelve los ejercicios esperados. | **PASS** |
| **PP-03** | Cumplimiento | Resumen diario "X de Y" con barra de progreso. | El porcentaje se calcula y muestra correctamente. | **PASS** |
| **PP-04** | Edición del plan | Modificar los grupos musculares del plan. | Los cambios persisten en la base. | **PASS** |

### 2.5. Pruebas de IA (Motor Dual)

| ID | Escenario | Descripción del Test | Resultado Obtenido | Estado |
| :---: | :--- | :--- | :--- | :---: |
| **PIA-01** | Análisis automático | Análisis al entrar a Progreso y vía botón "Analizar". | El diagnóstico se genera en ambos caminos. | **PASS** |
| **PIA-02** | IA externa (OpenRouter) | Con API Key configurada: envío del contexto y recepción de recomendación JSON. | Respuesta con observaciones, técnicas, plan sugerido y ejercicios alternativos. | **PASS** |
| **PIA-03** | Reintentos de red | Fallo transitorio en el primer llamado. | `fetchConReintentos()` reintenta hasta 3 veces; no muestra error falso al iniciar. | **PASS** |
| **PIA-04** | Sin API Key | Usuario sin clave configurada. | La vista muestra el campo para pegar la clave; el análisis local sigue activo. | **PASS** |
| **PIA-05** | Análisis local | Medidor de ascenso de nivel (60 días, 15 sesiones, 60% de metas), tendencia semanal y estancamiento. | Los indicadores heurísticos se calculan sin conexión. | **PASS** |
| **PIA-06** | Confirmación de ascenso | Subida de nivel al cumplir los criterios. | El nivel se actualiza en la base tras confirmación. | **PASS** |

### 2.6. Pruebas de Interfaz y Usabilidad (UI)

| ID | Escenario | Descripción del Test | Resultado Obtenido | Estado |
| :---: | :--- | :--- | :--- | :---: |
| **TUI-01** | Modo claro/oscuro | Cambio de tema activado por variables CSS + `body.dark-mode`. | Toda la interfaz se repinta; preferencia persistida en `localStorage`. | **PASS** |
| **TUI-02** | Contraste modo claro | Revisión de iconos y textos sobre fondo claro. | Iconos recolorados y título/logo con contraste suficiente. | **PASS** |
| **TUI-03** | Cambio de idioma | Alternancia español/inglés. | Las etiquetas traducidas se aplican al instante. | **PASS** |
| **TUI-04** | Navegación | Recorrido por las secciones de la SPA. | Sin errores de consola. | **PASS** |
| **TUI-05** | Cierre | Salida de la aplicación. | Los datos se conservan en `wellness.db`. | **PASS** |

---

## 3. Errores Detectados y Correcciones Aplicadas

| Error Detectado | Causa | Corrección Aplicada |
| :--- | :--- | :--- |
| Pantalla congelada / selección que no responde | Escrituras bloqueantes al disco en cada clic y cada guardado. | Escritura de la base agrupada con `guardarDB()` (debounce de 150 ms) y log asíncrono (`fs.promises.appendFile`). |
| "Error IA: fetch failed" en el primer llamado | El stack de red de Windows tarda en inicializarse. | Reintentos del fetch hasta 3 veces con espera (`fetchConReintentos()`). |
| Iconos invisibles en modo claro | SVGs con colores pensados para fondo oscuro. | Ajuste de paleta y contraste de texto y botones del tema claro. |
| Verificación de integridad | Riesgo de corrupción tras los cambios. | Usuarios y sesiones intactos luego de las modificaciones. |

---

## 4. Matriz de Cobertura y Resumen de Resultados

* **Total de pruebas diseñadas:** 24 (funcionales manuales)
* **Pruebas aprobadas (PASS):** 24 (100%)
* **Pruebas fallidas (FAIL):** 0
* **Conclusión de calidad:** La aplicación cumple con los requisitos funcionales esperados y opera de forma estable en el entorno de desarrollo local.

Las pruebas descritas corresponden a lo realmente ejecutado sobre la versión final de `main`; no se documentan métodos inexistentes en la implementación.