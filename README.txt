# Wellness - Calistenia Tracker

Aplicación de escritorio para registrar ejercicios de calistenia y seguir el progreso con ayuda de IA.

## Tecnologías

- **Electron** 42 : el marco de escritorio (HTML, CSS y JavaScript).
- **sql.js** 1.14 : SQLite corriendo en JavaScript/WebAssembly (la base vive en `wellness.db`).
- **Node.js** necesario para instalar dependencias (`npm`) y lanzar la app (desde la terminal).

## Dependencias

Instalar con npm dentro de la carpeta del proyecto:

```
npm install
```

Esto instala las dependencias declaradas en `package.json`:

| Paquete  | Versión | Para qué |
|----------|---------|----------|
| electron | ^42.0.1 | Crear y ejecutar la ventana de la app |
| sql.js   | ^1.14.1 | Base de datos SQLite embebida |

## Cómo usar la app

### 1. Iniciar la aplicación

Desde la terminal, en la carpeta del proyecto:

```
npm run start
```

O directamente con el ejecutable de Electron que queda en `node_modules`:

```
node_modules\electron\dist\electron.exe .
```

### 2. Configurar la IA (opcional, para las recomendaciones con OpenRouter)

La IA externa necesita una API key. Hay dos formas de cargarla:

- **Opción A (recomendada por interfaz):** ir a la sección Progreso → "Analizar" el análisis pedirá una key → pegarla y guardar. Queda guardada en `localStorage`, no hace falta volver a pegarla.
- **Opción B (archivo .env):** crear un archivo `.env` en la carpeta del proyecto con:

  ```
  OPENROUTER_API_KEY=sk-or-v1-TU_CLAVE
  ```

  Se obtiene gratis en https://openrouter.ai/keys. El archivo `.env` no se sube a Git (está en `.gitignore`) y no se comparte.

Sin API key la app **sigue funcionando**: el análisis local (nivel, tendencia y estancamiento) corre siempre; lo único que se desactiva es el coaching de la IA externa.

### 3. Utilizar la app

1. Al abrir, se crean las tablas de la base y se puebla el catálogo de ejercicios automáticamente.
2. Si no hay usuarios, aparece el registro (nombre, nivel, peso, altura y objetivo). Si ya hay, se elige un perfil del login.
3. **Inicio:** plan semanal y grupo muscular del día, con el resumen diario.
4. **Entrenar:** elegir un ejercicio del catálogo, cargar series y repeticiones, y guardar. La app compara contra la meta del ejercicio y te indica si la cumpliste.
5. **Progreso:** historial de sesiones (editar/eliminar) y análisis de la IA.
6. **Catálogo:** todos los ejercicios por grupo muscular con metas.
7. **Perfil:** ver o editar los datos del usuario.

### 4. Datos y registro

- La base se guarda en `wellness.db` (recreable si se borra, vuelve a crearse al iniciar).
- Los eventos quedan registrados en `wellness.log` (misma carpeta).

## Estructura del proyecto

```
main.js                 Proceso principal: ventana, IPC y llamadas a la IA
index.html              Interfaz (una sola página)
src/                    Módulos de la interfaz
  app.js                Arranque y tema
  auth.js               Login y registro
  clases.js             Clases POO (Usuario, Ejercicio, Rutina, Sesion)
  database.js           Base de datos SQLite (sql.js)
  ejercicios.js         Guardar sesiones
  historial.js          Historial
  ia.js                 Análisis de IA (externa + local)
  navegacion.js         Cambio de secciones
  plan-semanal.js       Plan de la semana
  progresiones.js       Catálogo de ejercicios
  idiomas.js            Traducción español/inglés
styles/                 Hojas de estilo y temas
icons/                  Iconos de la app
```

## Notas

- La app funciona 100 % local: los datos nunca salen de la computadora.
- `documentacion.txt` contiene la documentación del proyecto.