# Configuración de herramientas de IA

## Herramientas utilizadas

Durante el desarrollo de NoteFlow se ha usado **Claude** (claude.ai) como asistente principal para consultas técnicas.

## Cómo se ha usado Claude

Se ha utilizado la interfaz web de claude.ai sin configuración persistente de sistema. El flujo de trabajo ha sido conversacional: consultas puntuales sobre errores, dudas de arquitectura y generación de fragmentos de código según la necesidad del momento.

Ejemplos de uso durante el proyecto:

- Resolución de errores de TypeScript y compatibilidad de versiones.
- Consultas sobre APIs de Expo Router, Zustand y React Native Paper.
- Revisión y corrección de código existente.

## Limitaciones de este enfoque

Al no tener configuración persistente, Claude no conoce el contexto del proyecto entre conversaciones. Esto significa que en cada sesión nueva hay que proporcionar contexto manualmente si se quiere que el código generado respete las convenciones del proyecto.

## Mejora propuesta — .cursorrules

Si se usara Cursor como editor, el archivo `.cursorrules` de la raíz del proyecto contiene el contexto completo de NoteFlow: stack, convenciones, restricciones y patrones preferidos. Esto haría que el código generado fuera consistente con el proyecto sin necesidad de repetir el contexto en cada consulta.

Para Claude, el equivalente sería usar las instrucciones personalizadas de claude.ai (Settings > Custom Instructions) con el contexto del proyecto, aunque no se ha configurado durante este desarrollo.