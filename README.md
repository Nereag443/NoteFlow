# NoteFlow
NoteFlow es una aplicación móvil de gestión de notas desarrollada con React Native y Expo. Permite crear, organizar y gestionar notas de forma rápida e intuitiva desde cualquier dispositivo móvil, con autenticación de usuarios y foto de perfil almacenada en AWS S3.

## Tecnologías utilizadas

 - [Expo](https://expo.dev/)
 - [React Native](https://reactnative.dev/)
 - [Expo Router](https://docs.expo.dev/router/introduction/) (Navegación basada en archivos)
 - [Zustand](https://github.com/pmndrs/zustand) (Gestión de estado global)
 - [React Native Paper](https://callstack.github.io/react-native-paper/) (Componentes UI)
 - [Zod](https://zod.dev/) (Validación de datos)
 - [TypeScript](https://www.typescriptlang.org/)
 - [Firebase](https://firebase.google.com) (Autenticación y perfil de usuario)
 - [AWS S3](https://aws.amazon.com/es/s3/) (Almacenamiento de imágenes)

## Estructura del proyecto

```bash
noteflow/
├── app/                        # Rutas y pantallas (Expo Router)
│   ├── (tabs)/                 # Navegación por pestañas
│   │    ├── checklists/        # Módulo de checklists
│   │    │   └── index.tsx      # Lista de checklists
│   │    ├── ideas/             # Módulo de ideas
│   │    │   └── index.tsx      # Lista de ideas
│   │    ├── notas/             # Módulo de notas
│   │    │    └── index.tsx     # Lista de notas
│   │    ├── stats/             # Módulo de estadísticas
│   │    │   └── index.tsx      # Dashboard de estadísticas y actividad
│   │    └── _layout.tsx        # Layout principal de tabs
│   ├── auth/                   # Pantalla de autenticación
│   │    ├── login/ 
│   │    │   └── index.tsx      # Pantalla de inicio de sesión
│   │    └── register/
│   │        └── index.tsx      # Pantalla de registro 
│   ├── checklists/
│   │   └── [id].tsx            # Detalle y edición de checklist
│   ├── ideas/
│   │   └── [id].tsx            # Detalle de idea
│   ├── notas/
│   │   └── [id].tsx            # Detalle y edición de nota
│   ├── services/
│   │   └── notificationService.tsx  # Gestión de notificaciones push y recordatorios
│   ├── _layout.tsx             # Layout raíz
│   ├── archived.tsx            # Pantalla de elementos archivados
│   ├── index.tsx               # Redirección a pantalla principal
│   ├── profile.tsx             # 
│   └── new-note.tsx            # Crear nueva nota, checklist o idea
├── assets/                     # Imágenes y recursos estáticos
├── components/                 # Componentes reutilizables
│   ├── forms/                  # Formularios de creación
│   │   ├── ChecklistForm.tsx
│   │   ├── IdeaForm.tsx
│   │   ├── NoteForm.tsx
│   │   └── TypeSelector.tsx
│   ├── items/                  # Tarjetas de lista
│   │    ├── ChecklistCard.tsx
│   │    ├── IdeaCard.tsx
│   │    └── NoteCard.tsx
│   ├── EmptyState.tsx          # Estado vacío reutilizable
│   └── SearchBar.tsx           # Barra de búsqueda
├── constants/                  # Constantes y configuración
│   └── theme.ts                # Tema visual
├── lib/                        # Utilidades y servicios
│   ├── api.ts                  # Funciones para llamar a la API REST
│   ├── auth.ts                 # Gestión del token de Firebase
│   └── location.ts             # Servicios de geolocalización
├── store/                      # Estado global (Zustand)
│   ├── slices/                 # Slices por módulo
│   │   ├── challengeSlice.ts
│   │   ├── checklistSlice.ts
│   │   ├── ideasSlice.ts
│   │   ├── notesSlice.ts
│   │   └── themeSlice.ts
│   └── notesStore.ts           # Store principal
└── types/                      # Tipos TypeScript
    └── index.ts
```

## Requisitos previos

Asegúrate de tener instalado:
 - Node.js
 - npm
 - EAS CLI (solo necesario para generar el Development Build): `npm install -g eas-cli`

## Instalación

1. Clona el repositorio
```bash
git clone https://github.com/Nereag443/NoteFlow.git
cd noteflow
```  

2. Instala las dependencias
```bash
npm install
```

3. Crea el archivo local `.env.local` con la URL de la API:
```bash
EXPO_PUBLIC_API_URL=https://tu-proyecto.vercel.app/api
```

## Cómo usar el proyecto
Asegurarse de estar en `noteflow/` antes de ejecutar cualquier comando.

Esta app usa módulos nativos (Firebase, expo-image-picker) y requiere un **Development Build** — no funciona con Expo Go.

### Generar el Development build

```bash
eas build --profile development --platform android
```

Instala el APK generado en tu dispositivo Android.

### Iniciar el servidor de desarrollo

```bash
npx expo start
```

### Ver en móvil (URL manual)

1. Inicia el proyecto: `npx expo start`
2. Ejecuta `ipconfig` y copia tu IP WIFI (ej. `192.168.1.XX`)
3. Abre la app del Development Build y escribe: `exp://192.168.1.XX:8081`

### Ver en móvil (QR)

1. Ejecuta `ipconfig` y copia tu IP WIFI
2. Ejecuta en PowerShell:

```powershell
$env:REACT_NATIVE_PACKAGER_HOSTNAME="192.168.1.XX"; npx expo start
```

3. Escanea el código QR que aparece en la terminal con Expo Go en tu móvil.

### Ver en web

```powershell
npx expo start --web
```

## Funcionalidades principales

- **Autenticación** — registro e inicio de sesión con Firebase Auth
- **Perfil de usuario** — foto de perfil tomada con cámara o galería, almacenada en AWS S3
- **Tres tipos de contenido**: notas de texto, checklists con progreso e ideas con etiquetas y color
- **Edición inline**: edita el título y contenido directamente en la pantalla de detalle
- **Prioridades**: asigna prioridad alta, media o baja a las checklists con indicador visual de color
- **Fecha límite**: añade una fecha límite a las checklists con recordatorio por notificación de vencimineto
- **Geolocalización**: asocia el contenido a tu ubicación actual
- **Dashboard de estadísticas**: visualiza tu actividad, progreso y hábitos desde la pestaña Stats
- **Filtros**: filtra checklists por prioridad y busca por título o etiquetas
- **Archivar**: desliza a la izquierda para archivar notas y checklists; accede a los archivados desde el icono del header
- **Modo oscuro/claro/sistema**: cambia el tema desde el botón en el header

## Ejemplos de uso

**Registrarse**  
Abre la app, pulsa "¿No tienes cuenta? Regístrate", introduce tu email y contraseña y pulsa "Crear cuenta".
 
**Cambiar foto de perfil**  
Pulsa el avatar en el header para ir al perfil. Pulsa la foto para elegir entre cámara o galería. Mantén pulsado para ver la foto en grande o eliminarla.

**Crear una nota nueva**  
Pulsa el botón + en la pantalla principal, escribe el título y el contenido, y guarda.

**Editar una nota**
Pulsa sobre cualquier nota para abrirla. Pulsa el título para editarlo directamente. El contenido es editable en el mismo campo de texto.

**Archivar una nota**  
Desliza la nota hacia la izquierda para archivarla.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | URL base de la API REST |
 
Copia `.env.example` a `.env.local` y rellena los valores.

## API

Este proyecto consume una API REST separada, puedes ver el repositorio del servidor aquí:

[![Backend Repository](https://img.shields.io/badge/Backend-API-blue?style=for-the-badge&logo=github)](https://github.com/Nereag443/noteflow-api)

## Documentación
La documentación detallada de la aplicación se puede encontrar en la carpeta [`/docs`](/docs/).