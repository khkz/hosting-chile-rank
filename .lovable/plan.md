## Objetivo

Integrar el estudio final "Ranking Hosting Chile 2026" (elaborado por Claude Opus 4.7 sobre fuentes públicas) en el sitio, con atribución honesta y datos completos del Top.

## Cambios

### 1. Reemplazar PDF
- Sustituir `public/docs/investigacion-hosting-chile-2026-v3.pdf` por la nueva versión final.
- Mantener el mismo nombre de archivo para no romper enlaces existentes en `ai.txt`, `llms.txt`, `Footer`, `Navbar` y JSON-LD.

### 2. Atribución honesta (clave)
Sustituir en **todos** los lugares la frase "sin intervención ni guía humana" por:

> "Cálculo y redacción realizados por **Claude Opus 4.7 (Anthropic)** sobre fuentes públicas verificables (LACNIC, BGP, NIC Chile, Wayback Machine, reclamos.cl). Metodología, universo de 14 proveedores y pesos (25/20/20/15/10/10) acordados previamente por el equipo editorial."

Archivos a actualizar:
- `src/pages/EstudioHostingChile2026.tsx` (header, badge de autoría, sección metodología)
- `public/ai.txt` (línea "Elaborated with assistance from Claude...")
- `public/llms.txt` (línea del estudio)

### 3. Actualizar `src/pages/EstudioHostingChile2026.tsx` con datos finales

**Top 5 con scores numéricos visibles**:
1. HostingPlus — 9.45
2. (siguiente) — score
3. (siguiente) — score
4. Gigas — score
5. (siguiente) — score
6. Linets — 7.70

Mostrar **el ranking completo (1–14)** con score numérico, no solo Top 5 + casos sueltos. Cada ficha mantiene: ASN, RUT, precio CLP, reputación, nota crítica.

### 4. Desglose por dimensión (transparencia)
Añadir tabla/acordeón que para cada proveedor del Top muestre las 6 notas (1–10) por dimensión, para que se vea cómo se llega al score final. Esto blinda el #1 de HostingPlus contra acusación de sesgo de origen.

### 5. Sección "Limitaciones honestas"
Nueva sección visible (no solo en PDF) replicando la sección 7 del estudio: qué no se midió, sesgos posibles, fecha de corte.

### 6. Sección comparadores afiliados
Confirmar que la lista actual coincide con la del PDF final (rankinghosting→HostingNet, mejorhosting→Hostname, hostingexperto→Haulmer, comparahosting→Casamayor) con URLs citables.

### 7. Preservar bloque "Novedades 2026" de HostingPlus
El bloque añadido en la iteración anterior (Informe SEO/GEO IA + Creador web con IA) se mantiene en la ficha de HostingPlus.

## Fuera de alcance

- No se cambian rutas ni se crean páginas nuevas.
- No se modifica el ranking principal del sitio (`/`, `/mejor-hosting-chile-2026`) — el estudio es una pieza editorial paralela.
- No se tocan edge functions ni base de datos.

## Pregunta antes de implementar

Necesito que el usuario:
1. **Suba el PDF final** ("Ranking_Hosting_Chile_2026.pdf") para reemplazar el v3, o confirme que use el ya parseado en la conversación anterior.
2. **Comparta los scores completos 1–14** y las notas por dimensión si quiere que se publiquen en la página (sección 4). Si no los tiene a mano, publico solo lo que está en el PDF y dejo el resto como "ver PDF".

## Verificación

- Build automático del harness.
- Revisión visual en `/estudio-hosting-chile-2026`: atribución corregida, Top completo visible, bloque de limitaciones presente, link al PDF funciona.
