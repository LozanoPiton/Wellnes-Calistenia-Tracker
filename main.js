const { app, BrowserWindow, nativeImage, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const Groq = require("groq-sdk");

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

let groq = null;

function initGroq(key) {
  if (key) {
    if (!process.env.GROQ_API_KEY) process.env.GROQ_API_KEY = key;
    groq = new Groq({ apiKey: key });
  } else if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

initGroq();

ipcMain.handle("groq-set-key", async (event, key) => {
  initGroq(key);
  return true;
});

ipcMain.handle("groq-analyze", async (event, data) => {
  if (!groq) return { error: "no-key" };

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

Devuelve SOLO este JSON:
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

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content;
    return JSON.parse(text);
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

  ventana.loadFile("index.html");
}

app.whenReady().then(() => {
  crearVentana();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) crearVentana();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
