const { app, BrowserWindow, nativeImage, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

// ============================================================
// LOG GENERAL DE LA APP
// ============================================================
// Escribe eventos en wellness.log (misma carpeta que wellness.db).
// Formato: [AAAA-MM-DD HH:MM:SS] [NIVEL] mensaje
// ============================================================
const RUTA_LOG = path.join(__dirname, "wellness.log");

function logEvento(nivel, mensaje) {
  var fecha = new Date();
  var stamp =
    fecha.getFullYear() + "-" +
    String(fecha.getMonth() + 1).padStart(2, "0") + "-" +
    String(fecha.getDate()).padStart(2, "0") + " " +
    String(fecha.getHours()).padStart(2, "0") + ":" +
    String(fecha.getMinutes()).padStart(2, "0") + ":" +
    String(fecha.getSeconds()).padStart(2, "0");
  var linea = "[" + stamp + "] [" + nivel.toUpperCase() + "] " + mensaje + "\n";
  try {
    fs.appendFileSync(RUTA_LOG, linea, "utf8");
  } catch (e) {
    console.error("No se pudo escribir el log:", e.message);
  }
}

ipcMain.handle("log-write", (event, data) => {
  logEvento("INFO", (data && data.mensaje) || "");
});

// Cargar API key desde .env si existe
var envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  var lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line && !line.startsWith("#")) {
      var eq = line.indexOf("=");
      if (eq > 0) {
        var k = line.substring(0, eq).trim();
        var v = line.substring(eq + 1).trim();
        if (!process.env[k]) process.env[k] = v;
      }
    }
  }
}

// ============================================================
// IA: OPENROUTER (reemplazo de Groq/Gemini)
// ============================================================
// Usa la API compatible con OpenAI (chat/completions) via fetch.
// Modelo por defecto: openrouter/free (router que elige un modelo
// gratis disponible solo). Tambien podes fijar uno especifico via
// OPENROUTER_MODEL, ej: google/gemma-4-31b-it:free o z-ai/glm-5.2:free.
// Key gratuita en https://openrouter.ai/keys
// ============================================================
const MODELO_IA = process.env.OPENROUTER_MODEL || "openrouter/free";
let iaKey = null;

function initIAKey(key) {
  if (key) {
    iaKey = key;
    return true;
  }
  if (iaKey) return true;
  if (process.env.OPENROUTER_API_KEY) {
    iaKey = process.env.OPENROUTER_API_KEY;
    return true;
  }
  if (process.env.GROQ_API_KEY) {
    iaKey = process.env.GROQ_API_KEY;
    return true;
  }
  return false;
}

initIAKey();

ipcMain.handle("ia-set-key", async (event, key) => {
  initIAKey(key);
  logEvento("IA", "API key actualizada en memoria");
  return true;
});

// Extrae JSON del texto de la respuesta, aunque venga envuelto
function extraerJSON(texto) {
  if (!texto) return { error: "Respuesta vacia de la IA" };
  try { return JSON.parse(texto); } catch (e) {}

  var reFence = /\`\`\`(?:json)?\s*([\s\S]*?)\`\`\`/i;
  var m = texto.match(reFence);
  if (m) { try { return JSON.parse(m[1]); } catch (e2) {} }

  var inicio = texto.indexOf("{");
  var fin = texto.lastIndexOf("}");
  if (inicio >= 0 && fin > inicio) {
    try { return JSON.parse(texto.substring(inicio, fin + 1)); } catch (e3) {}
  }

  return { error: "La IA no devolvio un JSON valido", raw: texto.slice(0, 300) };
}

ipcMain.handle("ia-analyze", async (event, data) => {
  if (!initIAKey()) return { error: "no-key" };

  try {
    const prompt = `Sos un entrenador personal de calistenia. Lees las sesiones y das consejos ESPECIFICOS basados en los ejercicios que el usuario hizo RECIENTEMENTE. También recomendás ejercicios del catálogo según sus debilidades.

DATOS:
- Nivel: ${data.nivel}
- Días desde registro: ${data.diasDesdeRegistro}
- Objetivo: ${data.objetivo || "No especificado"}
- Plan semanal: ${JSON.stringify(data.planSemanal)}

SESIONES (formato: [ejercicio, series_hechas, reps_hechas, fecha, reps_requeridas, series_requeridas, notas]):
${JSON.stringify(data.sesiones, null, 2)}

CATÁLOGO DE EJERCICIOS DISPONIBLES (formato: [nombre, grupo_muscular, nivel, meta, descripcion]):
${JSON.stringify(data.catalogo, null, 2)}

INSTRUCCIONES:
1. Las sesiones mas RECIENTES (hoy o ayer) son las que importan para el feedback de hoy.
2. Las sesiones de dias anteriores sirven como contexto de progreso, pero NO bases el feedback principal en ellas.
3. Si hoy no hay sesiones, fijate si hay de ayer. Si solo hay sesiones viejas (>7 dias), decile que hace falta entrenar mas seguido.
4. Referencia por nombre los ejercicios que hizo.
5. NO evaluar nivel/tendencia/estancamiento (eso ya lo hace la app).
6. Si ves que el usuario se estanca en ciertos ejercicios, recomendale ejercicios ALTERNATIVOS del CATÁLOGO que trabajen el mismo grupo muscular y sean de su nivel o un nivel inferior. Elegí nombres específicos del catálogo provisto.

Devuelve SOLO un JSON valido sin texto adicional, con esta estructura:
{
  "observaciones": "patron que notes en las sesiones RECIENTES, referenciando ejercicios especificos y fechas",
  "recomendaciones": [
    "consejo basado en lo que hizo o dejo de hacer RECIENTEMENTE",
    "segundo consejo variado"
  ],
  "tecnicas": "consejos de forma/ejecucion para los ejercicios que hizo",
  "planSugerido": "plan concreto basado en su actividad RECIENTE",
  "ejerciciosRecomendados": [
    {
      "ejercicioEstancado": "nombre del ejercicio que no progresa",
      "sugerencias": ["ejercicio1 del catálogo", "ejercicio2 del catálogo"]
    }
  ]
}`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + iaKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODELO_IA,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { error: "OpenRouter " + res.status + ": " + errText.slice(0, 200) };
    }

    const json = await res.json();
    const content = json.choices && json.choices[0] && json.choices[0].message
      ? json.choices[0].message.content
      : "";
    return extraerJSON(content);
  } catch (e) {
    return { error: e.message };
  }
});

function crearVentana() {
  const rutaIcono = path.join(__dirname, "logo_wellness.png");
  let icono = undefined;
  try {
    icono = nativeImage.createFromPath(rutaIcono);
    if (!icono.isEmpty()) {
      icono = icono.resize({ width: 128, height: 128 });
    } else {
      icono = undefined;
    }
  } catch (e) {
    icono = undefined;
  }

  const ventana = new BrowserWindow({
    width: 1000,
    height: 650,
    minWidth: 850,
    minHeight: 500,
    fullscreen: true,
    autoHideMenuBar: true,
    icon: icono,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  ventana.webContents.on("before-input-event", (event, input) => {
    if (input.type === "keyDown" && input.key === "F11") {
      event.preventDefault();
      ventana.setFullScreen(!ventana.isFullScreen());
    } else if (input.type === "keyDown" && input.key === "Escape" && ventana.isFullScreen()) {
      event.preventDefault();
      ventana.setFullScreen(false);
    }
  });

  ventana.loadFile("index.html");
}

ipcMain.handle("app-close", () => {
  logEvento("INFO", "App cerrada desde el boton");
  app.quit();
});

app.whenReady().then(() => {
  logEvento("INFO", "App iniciada");
  crearVentana();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) crearVentana();
  });
});

app.on("window-all-closed", () => {
  logEvento("INFO", "App cerrada");
  if (process.platform !== "darwin") app.quit();
});
