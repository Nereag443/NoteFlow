# NoteFlow
NoteFlow es una aplicaciónmóvil de gestión de notas desarrollada con React Native y Expo. Permite crear, organizar y gestionar notas de forma rápida e intuitiva desde cualquier dispositivo móvil.

## Tecnologías utilizadas

 - Expo
 - React Native
 - Expo Router
 - Zustand
 - React NAtive Reanimated
 - Zod

## Estructura del proyecto

```bash
noteflow/
├── app/                  # Rutas y pantallas (Expo Router)
├── assets/               # Imágenes, fuentes y recursos estáticos
├── components/           # Componentes reutilizables
├── constants/            # Constantes y configuración
├── store/                # Estado global (Zustand)
├── types/                # Tipos TypeScript
├── babel.config.js
├── app.json
└── package.json
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
cd frontend
npm install
```

## Cómo usar el proyecto
Iniciar el proyecto
```bash
cd noteflow
npx expo start
```
Escanea el QR con Expo Go en tu móvil.

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

## Documentación
La documentación detallada de la aplicación se puede encontrar en la carpeta [`/docs](/docs/).