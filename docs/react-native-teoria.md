# Teoría React Native

## Diferencias entre React Native y una app nativa
La diferencia pprincipal es que React Native permite desarrollar apps para iOS y Android con un solo lenguaje de programación, JavaScript, haciendo el desarrollo más rápido, mientras que una app nativa requiere un desarrollo independiente para cada plataforma en la que se quiera publicar la aplicación, lo que ofrece máximo rendimiento y acceso total a hardware pero mayor lentitud en el desarrollo.

## Metro Bundler
Metro Bundler es un empaquetador de JavaScript para React Native que coge todo el código JavaScript y sus dependencias y los empaqueta en un solo archivo que la aplicación pueda cargar.

## Expo Go en proyectos reales
Expo Go no es sufiente en proyectos reales porque no soporta módulos personalizados como pagos, biometría, cámara, etc., funcionalidades esenciales en la mayoría de aplicaciones actuales.

## Sistemas de diseño
Se eligió **React Native Paper** sobre Gluestack UI por las siguientes razones:

- Setup inmediato sin configuración extra: no requiere NativeWind, ni modificar `babel.config.js` ni `metro.config.js`.
- Estable y maduro: ampliamente probado en producción.
- Integración sencilla mediante un único `PaperProvider`.
- Los componentes de Material Design 3 ofrecen una base sólida que se puede personalizar extendiendo el tema con tokens propios.

Se descartó Gluestack UI porque su arquitectura basada en NativeWind presentó incompatibilidades con Metro en Windows durante el desarrollo, lo que habría ralentizado el progreso del proyecto.

## Navegación con Expo Router

### Tipos de navegación

**Stack (pila)**  
Cada pantalla se apila sobre la anterior. El usuario puede volver atrás con el gesto de swipe o el botón de retroceso. Se usa para flujos de detalle: lista → detalle de un elemento.
En NoteFlow se usa en el root layout para envolver toda la app y para las rutas `[id].tsx` de cada sección.

**Tabs (pestañas)**  
Navegación horizontal entre secciones principales. Las pantallas no se apilan, simplemente se muestran u ocultan. El estado de cada tab se preserva al cambiar entre ellas.
En NoteFlow es la navegación principal: Notas, Tareas e Ideas. Se elige porque son tres secciones independientes del mismo nivel jerárquico, sin relación entre ellas.

**Modal**  
Se presenta sobre la pantalla actual con animación desde abajo. No forma parte de la jerarquía de tabs. Se usa para acciones transitorias que no merecen una pantalla completa en el flujo principal.
En NoteFlow lo usamos para `nueva-nota.tsx` porque crear una nota es una acción puntual que el usuario completa y cierra, sin necesidad de navegar dentro de ella.

### Por qué esta arquitectura

- El Stack raíz permite que el modal flote sobre los tabs.
- Los tabs preservan el estado de cada sección (scroll, filtros).
- Las rutas dinámicas `[id]` permiten navegar al detalle sin definir una ruta por cada nota — Expo Router extrae el id automáticamente con `useLocalSearchParams`.

## Modelado de datos con TypeScript

### Interfaces y herencia

`BaseNote` define los campos comunes a todos los tipos de nota.
El resto de interfaces extienden `BaseNote` con `extends`, heredando sus campos y añadiendo los propios:

- `Note` añade `content: string` para notas de texto.
- `Checklist` añade `items: ChecklistItem[]` para listas de tareas.
- `IdeaNote` añade `tags: string[]` y `color: string` para ideas.

### Tipo de unión

`AnyNote = Note | Checklist | IdeaNote` permite escribir funciones que acepten cualquier tipo de nota sin duplicar código:

```ts
function formatTitle(note: AnyNote): string {
  return note.title.toUpperCase();
}
```

### Type Guards

El problema con los tipos de unión es que TypeScript no sabe en tiempo de ejecución qué tipo concreto es una nota. Los type guards resuelven esto.

`'items' in note` devuelve `true` solo si el objeto tiene una propiedad `items`, lo que únicamente ocurre en `Checklist`:

```ts
if (isChecklist(note)) {
  // aquí TypeScript sabe que note es Checklist
  console.log(note.items.length);
}
```

Sin el type guard, TypeScript daría error al acceder a `note.items` porque `Note` e `IdeaNote` no tienen esa propiedad.

## Gestión de estado

**useState**: estado local de un componente que es solo accesible desde ese componente y sus hijos con props.

**Context API**: estado compartido entre componentes sin pasar props manualmente.

**Zustand**: estado global sin providers. Los componentes se suscriben solo a los valores que usan, por lo que solo se re-renderizan cuando esos valores cambian.

### Por qué Zustand en NoteFlow

- Las notas son datos globales que múltiples pantallas necesitan leer y modificar (lista, detalle, creación).
- Con Context API cada modificación re-renderizaría todas las pantallas suscritas simultáneamente.
- Zustand permite que `NotasScreen` solo se re-renderice cuando cambia `notes`, no cuando cambia `checklists` o `ideas`.
- No requiere envolver la app en ningún provider.

### Slices

Para mantener el código organizado, el store se divide en slices: `notesSlice`, `checklistSlice` e `ideasSlice`. Cada slice define su propio estado y acciones, y se combinan en un único store con una única persistencia en AsyncStorage.

## Rendimiento en listas
### El problema de FlatList

FlatList renderiza y destruye componentes según el scroll. Cuando un elemento sale de la pantalla, su componente se desmonta. Cuando vuelve a entrar, se monta de nuevo. En listas largas esto provoca pantallas en blanco durante el scroll rápido porque el JS thread no puede montar componentes tan rápido como el usuario hace scroll.

### Cómo FlashList lo resuelve

FlashList recicla los componentes en lugar de destruirlos. Cuando un elemento sale de pantalla, su componente no se desmonta sino que se reutiliza para el siguiente elemento que entra. Esto reduce drásticamente el trabajo del JS thread y elimina las pantallas en blanco.

### estimatedItemSize

Este valor le indica a FlashList cuánto espacio ocupará cada elemento antes de renderizarlo. Con este dato puede calcular cuántos componentes necesita tener en memoria para cubrir la pantalla y los elementos inmediatamente fuera de ella. Cuanto más preciso sea el valor, más eficiente será la gestión de memoria.

En NoteFlow usamos 100px como estimación para las tarjetas. Si las tarjetas fueran más altas (con imagen, por ejemplo), habría que aumentar este valor.

## Formularios y validación

### KeyboardAvoidingView

En móvil el teclado virtual ocupa parte de la pantalla y puede tapar los inputs. `KeyboardAvoidingView` ajusta el layout automáticamente cuando el teclado aparece. El comportamiento varía por plataforma:
- iOS: `behavior="padding"` añade padding inferior.
- Android: `behavior="height"` reduce la altura del contenedor.

### Zod

Zod valida datos en runtime con schemas tipados. `safeParse` devuelve un objeto con `success` y `error` en lugar de lanzar una excepción, lo que permite manejar los errores de validación sin try/catch y mostrarlos directamente en el formulario bajo cada campo.

El formulario de NoteFlow se divide en subcomponentes por tipo: `NoteForm`, `ChecklistForm` e `IdeaForm`, manteniendo la lógica de validación centralizada en `nueva-nota.tsx`.

## Persistencia con AsyncStorage
### Rehidratación del store

Cuando la app arranca, Zustand inicializa el store con los valores por defecto (arrays vacíos). Inmediatamente después lanza una lectura asíncrona de AsyncStorage para recuperar los datos guardados. Este proceso se llama rehidratación.

Durante la rehidratación hay un breve momento en que el store tiene los valores por defecto aunque haya datos guardados. Si renderizas la UI antes de que termine, el usuario verá la app vacía durante un instante antes de que aparezcan sus datos.

### Indicador de carga

Para evitarlo, el store expone `_hasHydrated` que empieza en `false` y pasa a `true` cuando `onRehydrateStorage` se ejecuta. En el layout raíz se muestra un `ActivityIndicator` mientras `_hasHydrated` es `false`, garantizando que el usuario nunca ve la app vacía.

### Limitaciones de AsyncStorage

- Sin cifrado: los datos se guardan en texto plano.
- Límite de 6MB en Android.
- Solo disponible en el dispositivo local, no se sincroniza entre dispositivos.
- Para datos sensibles usar expo-secure-store.
- Para sincronización entre dispositivos necesitarías un backend.

## Pulido de UX y feedback táctil

### Haptics

Las vibraciones táctiles elevan la percepción de calidad de la app.
Se usan dos tipos según el contexto:

- `Haptics.impactAsync(ImpactFeedbackStyle.Light)` al eliminar una nota, confirmando la acción destructiva con una vibración suave.
- `Haptics.notificationAsync(NotificationFeedbackType.Success)` al completar todos los items de un checklist, celebrando el logro con una vibración de éxito más pronunciada.

La detección de checklist completo se hace comparando el estado actualizado antes de que Zustand lo procese, mapeando los items localmente para anticipar el resultado del toggle.

### Pantallas de detalle

Cada tab tiene su ruta dinámica `[id].tsx` que recibe el id mediante `useLocalSearchParams`. El componente busca el elemento en el store con `.find()` y muestra un estado de "no encontrado" si el id no existe, lo que previene crashes cuando se navega a un elemento que ha sido eliminado.

La eliminación usa `Alert.alert` con dos opciones: cancelar y confirmar. Al confirmar se dispara el haptic, se llama la acción del store y se navega atrás con `router.back()`.

### Estado vacío

Cada pestaña muestra un `EmptyState` cuando no hay contenido. El componente recibe un icono de `@expo/vector-icons`, un título y un subtítulo, y se adapta automáticamente al tema oscuro/claro mediante `useAppTheme`. Se diferencia entre dos casos:

- Lista vacía sin búsqueda activa → invita a crear el primer elemento.
- Búsqueda sin resultados → informa de que no hay coincidencias con el término buscado.

### Búsqueda en tiempo real

Cada pantalla de lista tiene un `SearchBar` con un `useState` local para el término de búsqueda. El array filtrado se calcula en cada render con `.filter()` sobre el array del store, sin necesidad de estado adicional. El filtro compara título y contenido en minúsculas para que la búsqueda no distinga mayúsculas.

El `SearchBar` usa `useAppTheme` para adaptar colores de fondo, borde, texto y placeholder al modo oscuro/claro.

### Animaciones con Reanimated

Las tarjetas se envuelven en `Animated.View` con:

- `entering={FadeInDown}` — cada tarjeta aparece deslizándose desde abajo con fade, dando sensación de carga progresiva.
- `exiting={FadeOutLeft}` — al eliminar una tarjeta sale hacia la izquierda con fade, confirmando visualmente la eliminación.

### Diseño de tarjetas

Las tres tarjetas siguen principios de profundidad visual:

- **NoteCard** — barra de acento izquierda en color primario, sombra suave con `shadowRadius` alto y feedback de escala al pulsar con `transform: scale(0.985)`.
- **ChecklistCard** — barra de progreso que refleja el estado de completado, sombra elevada con `elevation: 6`.
- **IdeaCard** — color de fondo dinámico por idea, rotación aleatoria fijada con `useRef` para simular sticky notes, esquina doblada con SVG y triángulos superpuestos.

Todas las tarjetas usan `useAppTheme` para adaptar colores de superficie, texto y bordes al modo oscuro/claro del sistema.