# 🏁 Cierre del Proyecto y Lecciones Aprendidas

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  
**Profesora:** Yaskelly  

---

## 📌 Resumen de Entregables
El proyecto **WELLNESS - Calistenia Tracker** ha completado exitosamente su ciclo de desarrollo, entregando una aplicación funcional de escritorio basada en **Electron** y **SQLite** (`sql.js`).

### Principales Logros
- **Persistencia Nativa:** Gestión eficiente de datos mediante la base de datos local `wellness.db` utilizando `sql.js`.
- **Diagnóstico Dual por IA:** Integración con la API externa de **OpenRouter** respaldada por un motor de reglas locales para funcionamiento 100% offline.
- **Interfaz Reactiva:** Vistas dinámicas para gestión de perfil, catálogo de ejercicios, registro de sesiones, historial y plan semanal.
- **Soporte de Personalización:** Modos de tema Claro/Oscuro y traducción dinámica Español/Inglés.

---

## 💡 Lecciones Aprendidas y Conclusiones
- **Alineación Arquitectura-Documentación:** Se evidenció la importancia de mantener actualizada la documentación técnica a medida que las decisiones de diseño evolucionan durante el desarrollo (por ejemplo, la transición de persistencia en archivos planos a SQLite embebida mediante `sql.js`).
- **Resiliencia en Servicios Externos:** El diseño con fallback local garantizó que la aplicación no dependa exclusivamente de servicios de terceros para ofrecer valor al usuario.
