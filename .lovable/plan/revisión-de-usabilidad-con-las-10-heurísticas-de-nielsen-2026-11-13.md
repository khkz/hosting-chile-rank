# Revisión de usabilidad con las 10 heurísticas de Nielsen

Es solo una revisión: no cambia código, datos ni el ranking, y no publica nada. El resultado es un informe con hallazgos y prioridades.

## Páginas revisadas (vista previa, escritorio 1280 px y móvil 390 px)
Portada `/`, `/ranking`, `/directorio`, `/catalogo` y la ficha `/catalogo/planetahosting`, `/metodologia-benchmark`, `/latam` y una página de país (`/pe`), una comparativa, `/contacto`, `/auth` y `/reclamos`.

## Revisores (5 agentes en paralelo, 2 heurísticas cada uno)
1. **Estado del sistema y coincidencia con el mundo real**: carga, fechas, "sin medir", lenguaje del usuario chileno.
2. **Control y libertad del usuario, y consistencia y estándares**: volver atrás, filtros, navegación, coherencia entre directorio, catálogo y ranking.
3. **Prevención de errores, y reconocer antes que recordar**: formularios de contacto y registro, comparador, etiquetas visibles.
4. **Flexibilidad y eficiencia, y diseño estético y minimalista**: atajos, búsqueda, densidad, ruido visual, móvil.
5. **Ayuda para reconocer y recuperarse de errores, y ayuda y documentación**: mensajes de error, estados vacíos, metodología, FAQ.

Cada revisor navega con capturas, lee el código de las pantallas cuando hace falta y entrega por hallazgo: página, heurística, evidencia (captura o archivo:línea), gravedad (0-4 de Nielsen) y una corrección propuesta.

## Consolidación
- Elimino duplicados entre revisores y ordeno por gravedad y por cantidad de visitantes afectados.
- Marco aparte cualquier hallazgo que afecte la confianza (afirmaciones sin respaldo o divulgación), por el riesgo legal ya conocido.
- Entrego `/mnt/documents/usabilidad/heuristicas-nielsen.md`, con las capturas clave, y un resumen corto en el chat con los 10 problemas principales.

## Fuera de alcance
No implemento correcciones. Las correcciones se piden después, de a un tema por vez.
