# NoteFlow
NoteFlow es una aplicación móvil de gestión de notas desarrollada con React Native y Expo. Permite crear, organizar y gestionar notas de forma rápida e intuitiva desde cualquier dispositivo móvil.

## Tecnologías utilizadas

 - [Expo](https://expo.dev/)
 - [React Native](https://reactnative.dev/)
 - [Expo Router](https://docs.expo.dev/router/introduction/) (Navegación basada en archivos)
 - [Zustand](https://github.com/pmndrs/zustand) (Gestión de estado global)
 - [React Native Reanimated](https://www.reanimated2.com/) (Animaciones fluidas)
 - [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) (Swipe)
 - [React Native Paper](https://callstack.github.io/react-native-paper/) (Componentes UI)
 - [Expo Linear gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) (Degradados)
 - [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) (Vibración tactil)
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
│   │   └── [id].tsx            # Detalle y edición de checklist
│   ├── ideas/
│   │   └── [id].tsx            # Detalle de idea
│   ├── notas/
│   │   └── [id].tsx            # Detalle y edición de nota
│   ├── _layout.tsx             # Layout raíz
│   ├── archived.tsx            # Pantalla de elementos archivados
│   ├── index.tsx               # Redirección a pantalla principal
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

- **Tres tipos de contenido**: notas de texto, checklists con progreso e ideas con etiquetas y color
- **Edición inline**: edita el título y contenido directamente en la pantalla de detalle
- **Prioridades**: asigna prioridad alta, media o baja a las checklists con indicador visual de color
- **Filtros**: filtra checklists por prioridad y busca por título o etiquetas
- **Archivar**: desliza a la izquierda para archivar notas y checklists; accede a los archivados desde el icono del header
- **Modo oscuro/claro/sistema**: cambia el tema desde el botón en el header
- **Animaciones**: transiciones fluidas con React Native Reanimated
- **Haptics**: respuesta táctil al completar acciones en móvil
- **Soporte web**: la app funciona también en navegador
- **Persistencia de datos**: los datos se guardan localmente con Zustand

## Ejemplos de uso

**Crear una nota nueva**  
Pulsa el botón + en la pantalla principal, escribe el título y el contenido, y guarda.

**Editar una nota**
Pulsa sobre cualquier nota para abrirla. Pulsa el título para editarlo directamente. El contenido es editable en el mismo campo de texto.

**Archivar una nota**  
Desliza la nota hacia la izquierda para archivarla.

## API

Este proyecto consume una API REST separada, puedes ver el repositorio del servidor aquí:

[![Backend Repository](https://img.shields.io/badge/Backend-API-blue?style=for-the-badge&logo=github)](https://github.com/Nereag443/noteflow-api)

## Documentación
La documentación detallada de la aplicación se puede encontrar en la carpeta [`/docs`](/docs/).