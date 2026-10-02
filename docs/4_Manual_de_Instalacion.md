# 🛠️ Manual de Instalación y Despliegue Local

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  

---

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener instalado el siguiente software en tu equipo:

* **Node.js:** Versión v18.0.0 o superior ([Descargar Node.js](https://nodejs.org/))
* **npm:** Gestión de paquetes incluida con Node.js (v9.0.0 o superior)
* **Git:** Control de versiones ([Descargar Git](https://git-scm.com/))
* **Sistema Operativo:** Windows 10/11, macOS (10.15+) o Linux (Ubuntu 20.04+)

---

## 2. Clonación del Repositorio

Abre tu terminal (Command Prompt, PowerShell o Terminal de macOS/Linux) y ejecuta:

```bash
git clone [https://github.com/TU_USUARIO/wellness-calistenia-tracker.git](https://github.com/TU_USUARIO/wellness-calistenia-tracker.git)
cd wellness-calistenia-tracker
```
3. Instalación de Dependencias

Ejecuta el siguiente comando para instalar Electron y el resto de las bibliotecas del proyecto:

npm install

4. Configuración de Variables de Entorno

Crea un archivo llamado .env en la raíz del proyecto (junto al archivo package.json) y agrega las credenciales necesarias:

PORT=3000

NODE_ENV=development

GEMINI_API_KEY=tu_api_key_aqui

Nota: La variable GEMINI_API_KEY es opcional para el funcionamiento básico, pero requerida para el módulo de diagnóstico por IA.

5. Ejecución en Modo Desarrollo
Para iniciar la aplicación en tu entorno local con Electron:

npm start

Se abrirá la ventana principal de escritorio de WELLNESS - Calistenia Tracker.

6. Solución de Problemas Frecuentes:

⁎Error de permisos con npm: Ejecuta npm install usando terminal con permisos de administrador.

⁎Electron no abre la ventana: Verifica que la versión de Node.js instalada sea compatible ejecutando node -v.

⁎Falta de API Key: Si la sección de Diagnóstico IA falla, confirma que la clave en el archivo .env sea válida.
