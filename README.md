# NoteFlow
NoteFlow es una aplicación móvil de gestión de notas desarrollada con React Native y Expo. Permite crear, organizar y gestionar notas de forma rápida e intuitiva desde cualquier dispositivo móvil.

## Tecnologías utilizadas

 - [Expo](https://expo.dev/)
 - [React Native](https://reactnative.dev/)
 - [Expo Router](https://docs.expo.dev/router/introduction/) (Navegación basada en archivos)
 - [Zustand](https://github.com/pmndrs/zustand) (Gestión de estado global)
 - [React Native Reanimated](https://www.reanimated2.com/) (Animaciones fluidas)
 - [Zod](https://zod.dev/) (Validación de datos)
 - [TypeScript](https://www.typescriptlang.org/)

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
│   │    └── _layout.tsx        # Layout principal de tabs
│   ├── checklists/
│   │   └── [id].tsx            # Detalle de checklist
│   ├── ideas/
│   │   └── [id].tsx            # Detalle de idea
│   ├── notas/
│   │   └── [id].tsx            # Detalle de nota
│   ├── _layout.tsx             # Layout raíz
│   └── new-note.tsx            # Crear nueva nota
├── assets/                     # Imágenes y recursos estáticos
├── components/                 # Componentes reutilizables
│   ├── forms/                  # Formularios
│   │   ├── ChecklistForm.tsx
│   │   ├── IdeaForm.tsx
│   │   ├── NoteForm.tsx
│   │   └── TypeSelector.tsx
│   └── items/                  # Componentes de lista
│       ├── EmptyState.tsx
│       └── SearchBar.tsx
├── constants/                  # Constantes y configuración
│   └── theme.ts                # Tema visual
├── store/                      # Estado global (Zustand)
│   ├── slices/                 # Slices por módulo
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
 - Expo Go en tu dispositivo móvil (para desarrollo)

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

## Cómo usar el proyecto
Asegurarse de estar en `noteflow/` antes de ejecutar cualquier comando.

### Ver en móvil (URL manual)

1. Inicia el proyecto: `npx expo start`
2. Ejecuta `ipconfig` y copia tu IP WIFI (ej. `192.168.1.XX`)
3. Abre Expo Go y escribe: `exp://192.168.1.XX:8081`

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
 - Creación de notas
 - Edición y eliminación de notas
 - Gestión de checklists
 - Organización de ideas
 - Búsqueda de contenido
 - Persistencia de datos
 - Navegación optimizada con Expo Router

## Ejemplos de uso

**Crear una nota nueva**  
Pulsa el botón + en la pantalla principal, escribe el título y el contenido, y guarda.

**Editar una nota existente**  
Pulsa sobre cualquier nota en la lista para abrirla y editarla directamente.

**Eliminar una nota**  
Desliza la nota hacia la izquierda o mantén pulsado para acceder a la opción de eliminar.

## API

Este proyecto consume una API REST separada, puedes ver el repositorio del servidor aquí:

[![Backend Repository](https://img.shields.io/badge/Backend-API-blue?style=for-the-badge&logo=github)](https://github.com/Nereag443/noteflow-api)

## Documentación
La documentación detallada de la aplicación se puede encontrar en la carpeta [`/docs`](/docs/).