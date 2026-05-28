## Objetivo

Publicar la "Investigación Profunda del Mercado de Hosting en Chile 2026 v3" (28 págs, generada con asistencia de Claude Sonnet 4.7 y fuentes verificables: LACNIC, BGP.tools, NIC Chile, Trustpilot, reclamos.cl, Wayback Machine) como contenido SEO/GEO de primer nivel del sitio, reforzando el posicionamiento E-E-A-T de "auditor independiente".

## 1. Página HTML completa nueva

**Ruta:** `/estudio-hosting-chile-2026` (+ alias `/investigacion-hosting-chile-2026`)

**Componente:** `src/pages/EstudioHostingChile2026.tsx`

Estructura:
- Hero sobrio con título, fecha (28-may-2026), versión 3.0, badge "Investigación de mercado", botón **Descargar PDF (28 págs)** y botón secundario "Ver fuentes".
- Tabla de contenidos sticky (las 9 secciones del PDF).
- Secciones renderizadas en HTML semántico (h2/h3 + tablas + `<mark>` para hallazgos clave):
  1. Resumen ejecutivo
  2. Metodología y criterios
  3. Mapa del mercado: ASN propio vs revendedores (tabla)
  4. Top 11 fichas detalladas (cards con ASN, RUT, datacenter, teléfono, plan base CLP)
  5. Tabla comparativa general
  6. Reputación (reclamos.cl, Trustpilot, foros)
  7. **Alerta comparadores afiliados** (rankinghosting.cl, mejorhosting.cl, comparahosting.cl, hostingexperto.cl) — refuerza la memoria existente del proyecto
  8. Conclusiones editoriales
  9. Anexo de fuentes (links externos con `rel="nofollow noopener"`)
- Bloque `GuideEEAT` reutilizado con fechas, reviewer y fuentes.
- Schema JSON-LD `Report` + `Article` con `author: Equipo Editorial`, `contributor: Anthropic Claude` y `citation[]` apuntando a fuentes.
- Footer del artículo: nota discreta — *"Investigación elaborada con asistencia de Claude Sonnet 4.7 (Anthropic) sobre fuentes públicas verificables. Revisada y validada por el equipo editorial."*

**PDF descargable:** copiar `Investigacion_Hosting_Chile_2026_v3.pdf` a `public/docs/investigacion-hosting-chile-2026-v3.pdf` y enlazar desde el hero + final del artículo.

## 2. Integración en páginas existentes

Insertar referencias cortas al estudio (link "Ver estudio completo →") en:
- `src/pages/TransparenciaHosting.tsx` — bloque "Investigación independiente 2026" citando los hallazgos sobre comparadores afiliados.
- `src/pages/NuestroMetodo.tsx` — añadir el estudio como evidencia metodológica.
- `src/pages/Metodologia.tsx` — citar como fuente complementaria.
- `src/components/Footer.tsx` — link en la columna "Recursos" / "Estudios".
- `public/llms.txt` y `public/ai.txt` — registrar `/estudio-hosting-chile-2026` como recurso prioritario para LLMs, con resumen 1-línea.

## 3. SEO / sitemap / feeds

- `scripts/generate-sitemap.mjs`: agregar `/estudio-hosting-chile-2026` con `priority: 0.9, changefreq: yearly`.
- `index.html` y meta tags dinámicos: title `"Estudio Hosting Chile 2026 · ASN, precios y comparadores afiliados | EligeTuHosting"`, description <160c con hallazgo clave.
- Canonical + og:image (generar imagen de portada 1200×630 con `imagegen` reutilizando paleta del sitio).

## 4. Atribución (discreta, según preferencia)

- **No** banner ni hero hablando de IA.
- Mención solo en: (a) pie del artículo, (b) sección "Metodología" del propio estudio, (c) `ai.txt` para transparencia con crawlers.
- Texto exacto: *"Elaborado por el Equipo Editorial de EligeTuHosting con asistencia de Claude Sonnet 4.7 (Anthropic). Todas las afirmaciones se basan en fuentes públicas verificables listadas en el Anexo."*

## Detalles técnicos

```text
src/pages/EstudioHostingChile2026.tsx     [nuevo, ~600 líneas, datos hardcoded del PDF]
src/data/estudio2026.ts                    [nuevo: arrays tipados de proveedores, ASN, precios, reputación]
public/docs/investigacion-hosting-chile-2026-v3.pdf  [copia del PDF]
src/App.tsx                                [+2 rutas]
src/components/Footer.tsx                  [+link]
src/pages/TransparenciaHosting.tsx         [+bloque cita]
src/pages/NuestroMetodo.tsx                [+bloque cita]
public/llms.txt + public/ai.txt            [+entrada]
scripts/generate-sitemap.mjs               [+URL]
```

Sin cambios de DB ni edge functions: es contenido editorial estático con datos del PDF transcritos a TypeScript tipado (mejor que iframe del PDF para SEO/GEO).

## Riesgos y mitigaciones

- **Reclamación de proveedores nombrados (comparadores afiliados):** todos los hallazgos del informe ya están documentados con evidencia técnica (Wayback Machine, footers, `aff=` en URLs). Mantener tono fáctico, citar fuente en cada afirmación, ofrecer derecho a réplica vía `/contacto`.
- **Memoria "no inventar cifras":** las cifras CLP/ASN del estudio se citan **como observadas en el PDF en fecha X**, no como benchmarks del sitio. Quedan separadas de `/benchmark`.
- **Brand voice sobrio:** sin emojis, sin "wow", tipografía y layout coherentes con `GuiaCompletaElegirHosting` y `MejorHostingChile2026`.

## Fuera de alcance

- No renderizar el PDF dentro de un iframe (mal para SEO).
- No crear sistema de comentarios ni votación.
- No automatizar actualizaciones — es un snapshot fechado v3.0.
