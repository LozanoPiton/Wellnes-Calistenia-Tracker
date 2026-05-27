const { app, BrowserWindow } = require("electron");
const path = require("path");

function crearVentana() {
  // Configura las dimensiones de la ventana de escritorio de la App
  const ventana = new BrowserWindow({
    width: 800,
    height: 600,
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

// Cierra la app si todas las ventanas se cierran (menos en Mac)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
