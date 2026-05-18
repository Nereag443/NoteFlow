# NoteFlow
NoteFlow es una aplicación móvil de gestión de notas desarrollada con React Native y Expo. Permite crear, organizar y gestionar notas de forma rápida e intuitiva desde cualquier dispositivo móvil.

## Tecnologías utilizadas

 - [Expo](https://expo.dev/)
 - [React Native](https://reactnative.dev/)
 - [Expo Router](https://docs.expo.dev/router/introduction/) (Navegación basada en archivos)
 - [Zustand](https://github.com/pmndrs/zustand) (Gestión de estado global)
 - [React Native Reanimated](https://www.reanimated2.com/) (Animaciones fluidas)
 - [Zod](https://zod.dev/) (Validación de datos)

## Estructura del proyecto

```bash
noteflow/
├── app/                        # Rutas y pantallas (Expo Router)
│   ├── (tabs)/                 # Navegación por pestañas
│   │    ├── checklists/        # Módulo de checklists
│   │    │   ├── [id].tsx       # Detalle de checklist
│   │    │   └── index.tsx      # Lista de checklists
│   │    ├── ideas/             # Módulo de ideas
│   │    │   ├── [id].tsx       # Detalle de idea
│   │    │   └── index.tsx      # Lista de ideas
│   │    ├── notas/             # Módulo de notas
│   │    │    ├── [id].tsx      # Detalle de nota
│   │    │    └── index.tsx     # Lista de notas
│   │    └── _layout.tsx        # Layout principal de tabs
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
 - Expo go en tu dispositivo móvil (para desarrollo)

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
Iniciar el proyecto (Asegurarse de estar en noteflow/)
```bash
npx expo start
```
Escanea el código QR que aparece en la terminal con Expo Go en tu móvil.

## Funcionalidades principales
 - Creación de notas
 - Edición de notas
 - Eliminación de notas
 - Búsqueda
 - Persistencia local

## Ejemplos de uso

**Crear una nota nueva**  
Pulsa el botón + en la pantalla principal, escribe el título y el contenido, y guarda.

**Editar una nota existente**  
Pulsa sobre cualquier nota en la lista para abrirla y editarla directamente.

**Eliminar una nota**  
Desliza la nota hacia la izquierda o mantén pulsado para acceder a la opción de eliminar.

## API

Este proyecto consume una API REST separada, puedes ver el repositorio del servidor aquí:

[![Backend Repo](https://img.shields.io/badge/backend-repository-blue)](https://github.com/Nereag443/noteflow-api.git).

## Documentación
La documentación detallada de la aplicación se puede encontrar en la carpeta [`/docs`](/docs/).