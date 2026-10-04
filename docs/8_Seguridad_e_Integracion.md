# 🔒 Aspectos de Seguridad e Integración del Sistema

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  
**Profesora:** Yaskelly  

---

## 1. Arquitectura de Seguridad en Electron y Limitaciones Conocidas

Electron ejecuta código Node.js junto con el motor de renderizado Chromium. La configuración aplicada en la ventana principal (`main.js`) responde a las necesidades de una aplicación de escritorio local.

### 1.1. Configuración del Proceso Renderizador y Limitaciones Conocidas
* La ventana principal se crea con `nodeIntegration: true` y `contextIsolation: false` en `webPreferences`.
* **Acceso a Node.js en el Renderizador (limitación conocida):** Con `nodeIntegration: true` y `contextIsolation: false`, el proceso renderizador **tiene acceso general a las APIs nativas de Node.js** (incluido `require('electron')`, `fs`, `path`, entre otras). Esto constituye una **limitación de seguridad conocida** de la arquitectura actual de este proyecto.
* **Comunicación IPC:** Aunque el renderer puede acceder directamente a Node.js, la aplicación utiliza `ipcRenderer.invoke()` para comunicarse con el proceso principal a través de canales explícitos (ver sección 1.2).
* **Mitigación por carga local:** No se carga contenido remoto (`ventana.loadFile("index.html")`). La aplicación solo sirve archivos locales del propio proyecto, lo que reduce la superficie de ataque frente a scripts externos.

### 1.2. Canales IPC Acotados (Whitelist)
La comunicación Renderizador → Proceso Principal se limita a una lista explícita de canales registrados con `ipcMain.handle()` en `main.js`:

| Canal | Uso |
| :--- | :--- |
| `log-write` | Escritura de mensajes de auditoría en `wellness.log`. |
| `ia-set-key` | Registro de la API Key de OpenRouter/GROQ en memoria principal. |
| `ia-analyze` | Envío del contexto de entrenamiento y recepción del diagnóstico de IA. |
| `app-close` | Cierre de la aplicación desde el botón de la interfaz. |

Desde la vista solo se invocan estos canales (`src/app.js`, `src/ia.js`). La existencia de acceso general a Node.js en el renderer se documenta como una **limitación aceptada** en la versión final entregada.
## 2. Integración y Protección de Claves API (OpenRouter IA)

Para el módulo de sugerencias de entrenamiento personalizadas con IA, la aplicación se integra de manera asíncrona con la API de **OpenRouter** (`POST https://openrouter.ai/api/v1/chat/completions`), con respaldo en **GROQ** como proveedor alternativo.

### 2.1. Gestión de Variables de Entorno
* La clave privada de la API (`OPENROUTER_API_KEY`) nunca se incluye directamente en el código fuente (hardcoded).
* Se almacena en un archivo local `.env`, excluido del control de versiones mediante `.gitignore`.
* El proceso principal (`main.js`) lee las credenciales de `OPENROUTER_API_KEY` (o `GROQ_API_KEY`) desde `.env` al iniciar la aplicación, parseando el archivo con `fs.readFileSync`.
* La clave también puede ingresarse desde la interfaz de usuario; en ese caso se conserva en `localStorage` y se remite al proceso principal a través del canal `ia-set-key`, quedando en memoria.

### 2.2. Manejo de Errores e Integración Fallback
* La llamada a la API se realiza con reintentos para absorber fallos transitorios de red.
* Si no hay conexión a internet o la API Key no está configurada, la aplicación no se bloquea: el módulo de IA local (`main.js`) mantiene su análisis heurístico (tendencia semanal, ascenso de nivel y estancamiento) y la interfaz muestra el campo para cargar la clave.
* La respuesta de la IA se normaliza tolerando JSON envuelto en bloques de código o texto adicional.

---

## 3. Persistencia de Datos e Integridad

* **Almacenamiento Local:** Los registros de entrenamientos y el perfil del usuario se guardan localmente en una base de datos **SQLite** embebida compilada a WebAssembly (**`sql.js`**), persistida en el archivo `wellness.db`.
* **Validación de Entradas:** Toda entrada del usuario (peso, repeticiones, nombre) es saneada y validada antes de ser enviada a la persistencia, para evitar inyecciones o corrupción de datos.
* **Auditoría:** Los eventos del sistema se registran de forma asíncrona (`fs.promises.appendFile`) en `wellness.log`, evitando bloqueos de la interfaz.
* **Integridad del Catálogo:** La aplicación sincroniza el catálogo de `progresiones` de forma incremental solo al iniciar (inserta lo que falta, nunca borra), de modo que las sesiones históricas no quedan huérfanas.
