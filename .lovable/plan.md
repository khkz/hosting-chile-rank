## Uniformar tamaño de logos de proveedores

En `src/components/Testimonial.tsx`, sección "Proveedores verificados en Chile", los logos se ven dispares (algunos diminutos, otros enormes, y uno roto en una segunda fila).

### Cambios

1. **Contenedor fijo por logo**: envolver cada `<img>` en un div con tamaño uniforme (ej. `h-12 w-32`), centrado con flex.
2. **Imagen normalizada**: `max-h-10 max-w-full object-contain` para que todos los logos ocupen el mismo "porte" visual sin deformarse.
3. **Grid en vez de flex-wrap**: usar `grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center` para alinear todos en una sola fila pareja en desktop y evitar el logo huérfano en segunda fila.
4. **Fallback de logo roto**: agregar `onError` que reemplace por `/placeholder.svg` para que no aparezca el texto alt roto (caso PowerHost/IxMetro).

Sin cambios de lógica ni de datos; solo presentación.
