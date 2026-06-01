const { app, BrowserWindow, nativeImage } = require("electron");
const path = require("path");

function crearVentana() {
  const rutaIcono = path.join(__dirname, "icons", "logo_app.png");
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
