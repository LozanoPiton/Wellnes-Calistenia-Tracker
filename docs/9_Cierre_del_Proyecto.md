# 🏁 Cierre del Proyecto y Lecciones Aprendidas

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  
**Profesora:** Yaskelly  
**Materia:** Ingeniería de Software  

---

## 1. Resumen Ejecutivo del Proyecto

El proyecto **WELLNESS - Calistenia Tracker** se concibió e implementó exitosamente como una aplicación de escritorio orientada a atletas y practicantes de entrenamiento funcional. La solución combina la persistencia de datos local (SQLite vía `sql.js`) para el seguimiento continuo del usuario con la potencia de la Inteligencia Artificial (**OpenRouter**) para ofrecer diagnósticos y recomendaciones de entrenamiento adaptadas al rendimiento individual.

---

## 2. Logros Alcanzados

* **Desarrollo Multiplataforma:** Implementación exitosa de la interfaz gráfica y lógica de control utilizando Electron, HTML5, CSS3 y JavaScript ES6.
* **Integración de IA:** Conexión asíncrona mediante API con OpenRouter para la generación de recomendaciones dinámicas de rutinas, con análisis heurístico local de respaldo.
* **Persistencia Offline:** Almacenamiento local estructurado de perfiles, métricas corporales (IMC) e historial de entrenamientos.
* **Arquitectura desacoplada:** Comunicación entre procesos mediante canales IPC acotados registrados en `ipcMain` e invocados desde el renderer a través de `ipcRenderer.invoke()`. La configuración actual es `nodeIntegration: true` y `contextIsolation: false` sin `preload.js`.
* **Documentación Completa:** Elaboración de la suite completa de documentación académica (Requisitos, UML, Arquitectura, Pruebas, Seguridad y Manuales).

---

## 3. Dificultades Encontradas y Soluciones Aplicadas

| Dificultad Identificada | Impacto | Solución Implementada |
| :--- | :--- | :--- |
| **Seguridad en Electron:** Riesgo de exposición de APIs nativas de Node.js a la vista renderizada. | Alto | Se limitaron los canales IPC a una whitelist y se controla el acceso a funcionalidades sensibles. La configuración actual es `nodeIntegration: true`, `contextIsolation: false` y sin `preload.js`. |
| **Gestión de Claves API:** Necesidad de proteger la clave de OpenRouter sin exponerla en el repositorio. | Medio | Las claves se leen desde `.env` (parseado manualmente en `main.js`), excluido del versionado, y pueden almacenarse en `localStorage` para facilitar el uso, permaneciendo en memoria en el proceso principal. |
| **Consistencia de Datos:** Manejo de datos de sesiones sin depender de bases de datos relacionales pesadas. | Bajo | Implementación de objetos modelo en JavaScript (`Usuario`, `Sesion`, `Ejercicio`) con serialización en formato JSON. |

---

## 4. Recomendaciones de Mantenimiento y Trabajo Futuro

Para futuras iteraciones de la plataforma **WELLNESS**, se recomienda:

1. **Sincronización en la Nube:** Incorporar autenticación de usuarios y respaldo remoto (por ejemplo, Firebase o PostgreSQL) para sincronización multidispositivo.
2. **Gráficos Avanzados:** Integrar librerías de visualización de datos (como Chart.js) para mostrar curvas de progreso e intensidad histórica.
3. **Módulo Nutricional:** Expandir las capacidades de la IA para sugerir planes de hidratación y macronutrientes basados en el gasto calórico estimado.

---

## 5. Conclusiones

La realización de **WELLNESS - Calistenia Tracker** permitió consolidar los conocimientos teóricos y prácticos de la ingeniería de software, desde la fase de especificación de requisitos y diseño arquitectónico hasta la implementación, pruebas y despliegue local. El producto final satisface con precisión las necesidades identificadas para el seguimiento de calistenia en un entorno seguro, intuitivo y moderno.
