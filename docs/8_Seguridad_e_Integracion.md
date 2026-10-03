# 🔒 Aspectos de Seguridad e Integración del Sistema

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  
**Profesora:** Yaskelly  

---

## 1. Arquitectura de Seguridad en Electron

Electron ejecuta código Node.js junto con el motor de renderizado Chromium. La configuración aplicada en la ventana principal (`main.js`) responde a las necesidades de una aplicación de escritorio local que integra persistencia y módulos procesados en Node.js.

### 1.1. Configuración Real del Proceso Renderizador
* La ventana principal se crea con `nodeIntegration: true` y `contextIsolation: false` en `webPreferences`.
* **No se utiliza `preload.js` ni `contextBridge`**: la interfaz se comunica con el proceso principal mediante `ipcRenderer.invoke()` directo, disponible al habilitarse Node Integration.
* No se carga contenido remoto: `ventana.loadFile("index.html")` carga únicamente archivos locales del propio proyecto, por lo que no se expone la aplicación a scripts externos ni a la navegación a sitios de terceros. Esta es la principal medida de mitigación de ejecución remota de código (RCE) en esta configuración.

### 1.2. Canales IPC Acotados (Whitelist)
La comunicación Renderizador → Main se limita a una lista explícita de canales registrados con `ipcMain.handle()` en `main.js`:

| Canal | Uso |
| :--- | :--- |
| `log-write` | Escritura de mensajes de auditoría en `wellness.log`. |
| `ia-set-key` | Registro de la API Key de OpenRouter en memoria. |
| `ia-analyze` | Envío del contexto de entrenamiento y recepción del diagnóstico de IA. |
| `app-close` | Cierre de la aplicación desde el botón de la interfaz. |

Desde la vista solo se invocan estos canales (`src/app.js`, `src/ia.js`); no se ofrece al Renderizador acceso general a los módulos de Node.js.

---

## 2. Integración y Protección de Claves API (OpenRouter IA)

Para el módulo de sugerencias de entrenamiento personalizadas con IA, la aplicación se integra de manera asíncrona con la API de **OpenRouter** (`POST https://openrouter.ai/api/v1/chat/completions`), con respaldo en **GROQ** como provedor alternativo.

### 2.1. Gestión de Variables de Entorno
* La clave privada de la API (`OPENROUTER_API_KEY`) nunca se incluye directamente en el código fuente (hardcoded).
* Se almacena en un archivo local `.env`, excluido del control de versiones mediante `.gitignore`.
* El proceso principal (`main.js`) lee las credenciales de `OPENROUTER_API_KEY` (o `GROQ_API_KEY`) desde `.env` al iniciar la aplicación, parseando el archivo con `fs.readFileSync` (no se utiliza el paquete `dotenv`; no figura en `package.json`).
* La clave también puede ingresarse desde la interfaz de usuario; en ese caso se conserva en `localStorage` y se remite al proceso principal a través del canal `ia-set-key`, quedando en memoria.

### 2.2. Manejo de Errores e Integración Fallback
* La llamada a la API se realiza con la función `fetchConReintentos()`: hasta 3 intentos con 800 ms de espera entre reintentos, para absorber fallos transitorios de red (p. ej. el "fetch failed" del primer llamado al iniciar la app en Windows).
* Si no hay conexión a internet o la API Key no está configurada, la aplicación no se bloquea: el módulo de IA local (`src/ia.js`) mantiene su análisis heurístico (tendencia semanal, ascenso de nivel y estancamiento) y la interfaz muestra el campo para cargar la clave.
* La respuesta de la IA se normaliza con la función `extraerJSON()`, tolerando JSON envuelto en bloques de código o texto adicional.

---

## 3. Persistencia de Datos e Integridad

* **Almacenamiento Local:** Los registros de entrenamientos y el perfil del usuario se guardan localmente en una base de datos **SQLite** embebida compilada a WebAssembly (**`sql.js`**), persistida en el archivo `wellness.db`.
* **Validación de Entradas:** Toda entrada del usuario (peso, repeticiones, nombre) es saneada y validada antes de ser enviada a la persistencia, para evitar inyecciones o corrupción de datos.
* **Auditoría:** Los eventos del sistema se registran de forma asíncrona (`fs.promises.appendFile`) en `wellness.log`, evitando bloqueos de la interfaz.
* **Integridad del catálogo:** la aplicación sincroniza el catálogo de `progresiones` de forma incremental solo al iniciar (inserta lo que falta, nunca borra), de modo que las sesiones históricas no quedan huérfanas.