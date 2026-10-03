# 🔒 Aspectos de Seguridad e Integración del Sistema

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  
**Profesora:** Yaskelly  

---

## 1. Arquitectura de Seguridad en Electron

Electron ejecuta código Node.js junto con el motor de renderizado Chromium. Para garantizar la seguridad de la aplicación de escritorio y evitar vulnerabilidades de ejecución remota de código (RCE), se aplicaron los siguientes principios en la configuración de la ventana principal (`main.js`):

### 1.1. Context Isolation (Aislamiento de Contexto)
* La propiedad `contextIsolation: true` se encuentra activada.
* Garantiza que los scripts de la interfaz web (Renderer) no tengan acceso directo a los objetos globales de Node.js ni a funciones sensibles del sistema operativo.

### 1.2. Desactivación de Node Integration
* La opción `nodeIntegration: false` asegura que el código HTML/JS de la interfaz de usuario no pueda ejecutar directamente código a nivel de sistema.

### 1.3. Comunicación Segura vía Preload Bridge
* La interacción entre la vista y el proceso principal se realiza exclusivamente mediante un canal seguro expuesto en `preload.js` usando `contextBridge.exposeInMainWorld()`.

```javascript
// Ejemplo de puente seguro expuesto en preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  guardarEntrenamiento: (datos) => ipcRenderer.invoke('guardar-entrenamiento', datos),
  consultarIA: (prompt) => ipcRenderer.invoke('consultar-ia', prompt)
});
```

2. Integración y Protección de Claves API (Gemini IA)
Para el módulo de sugerencias de entrenamiento personalizadas con IA, la aplicación se integra de manera asíncrona con la API de Google Gemini.

2.1. Gestión de Variables de Entorno (dotenv)
La clave privada de la API (GEMINI_API_KEY) nunca se incluye directamente en el código fuente (hardcoded).

Se almacena en un archivo local .env que está excluido del control de versiones mediante .gitignore.

El proceso principal (main.js) lee las credenciales en tiempo de ejecución utilizando el paquete dotenv.

2.2. Manejo de Errores e Integración Fallback
Si no hay conexión a internet o la API Key no está configurada, el módulo de IA no bloquea la ejecución de la aplicación.

Retorna un mensaje amigable al usuario sugiriéndole rutinas predefinidas offline de forma segura.

3. Persistencia de Datos e Integridad
Almacenamiento Local: Los registros de entrenamientos y el perfil del usuario se guardan localmente en archivos de formato JSON estructurado.

Validación de Entradas: Toda entrada del usuario (peso, repeticiones, nombre) es saneada y validada en el cliente antes de ser enviada al proceso de persistencia para evitar inyecciones o corrupción de datos.
