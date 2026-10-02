# 📖 Manual de Usuario - WELLNESS Calistenia Tracker

**Proyecto:** WELLNESS - Calistenia Tracker  
**Equipo #4:** Liliana Gutiérrez y Luis Lozano  
**Profesora:** Yaskelly  

---

## 1. Introducción y Propósito

**WELLNESS CALISTENIA-TRACKER** es una aplicación de escritorio desarrollada con Electron diseñada para atletas y practicantes de calistenia. Permite registrar progresiones de entrenamiento, consultar catálogos de ejercicios, hacer seguimiento de métricas corporales y obtener recomendaciones personalizadas mediante inteligencia artificial.

---

## 2. Pantallas Principales de la Aplicación

### 2.1. Perfil del Atleta
* **Ubicación:** Menú principal → *Perfil*
* **Acciones:**
  1. Ingresa tu nombre, peso actual (kg), altura (cm) y nivel de experiencia (Principiante, Intermedio, Avanzado).
  2. Haz clic en **Guardar Perfil** para almacenar tus datos locales.

### 2.2. Catálogo de Ejercicios y Progresiones
* **Ubicación:** Menú principal → *Catálogo*
* **Funcionalidad:** Muestra la lista completa de ejercicios clasificados por grupo muscular (Pecho, Espalda, Piernas, Core, Hombros) y dificultad.

### 2.3. Registro de Sesiones de Entrenamiento
* **Ubicación:** Menú principal → *Entrenar*
* **Pasos para registrar:**
  1. Selecciona el ejercicio o progresión a ejecutar.
  2. Ingresa el número de series y repeticiones realizadas.
  3. Presiona **Registrar Sesión** para guardar el entrenamiento en el historial local.

### 2.4. Diagnóstico y Recomendaciones con IA
* **Ubicación:** Menú principal → *Diagnóstico IA*
* **Funcionalidad:** Analiza tus métricas actuales y tu historial de entrenamientos para sugerirte progresiones, ajustar repeticiones o recomendar días de descanso.
* **Nota:** Requiere conexión a internet y una clave válida de API configurada en el entorno.

---

## 3. Preguntas Frecuentes (FAQ)

* **¿Mis datos de entrenamiento se guardan en internet?**  
  No, la aplicación funciona de forma offline guardando tu perfil e historial localmente en tu equipo. Solo el módulo de consulta con IA hace uso de red exterior.

* **¿Cómo puedo ver mi historial guardado?**  
  Ingresa a la sección *Progreso* dentro de la app para ver el registro cronológico de todas tus sesiones.
