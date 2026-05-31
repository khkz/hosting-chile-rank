## Reemplazar falsas credenciales de "años de experiencia" por valor real

El sitio tiene 1 año real, no 5. Eliminar todas las afirmaciones de antigüedad atribuibles a EligeTuHosting y sustituirlas por el bullet elegido por el usuario: **"Metodología 100% verificable"**.

### Archivos a editar (solo créditos del sitio, NO tocar descripciones de proveedores)

1. **`src/components/Footer.tsx`**
   - Cambiar `<span>5 años de experiencia</span>` → `<span>Metodología 100% verificable</span>`.
   - Cambiar icono `Award` → `ShieldCheck`.
   - Cambiar texto descriptivo: "El análisis más completo y objetivo de hosting en Chile desde 2020." → algo sin "desde 2020" (ej: "El análisis más completo y objetivo de hosting en Chile. Metodología abierta y reproducible.").

2. **`src/pages/AcercaDe.tsx`**
   - `foundingDate: "2020"` → eliminar o cambiar a año real si lo tiene (quitar claim falso).
   - "…desde 2020 con pruebas técnicas…" → "…con pruebas técnicas y políticas de transparencia…".
   - "…evalúa proveedores de hosting en Chile desde 2020." → quitar "desde 2020".

3. **`src/pages/SobreNosotros.tsx`**
   - `foundingDate: '2020'` → eliminar claim falso.
   - "…hosting en Chile desde 2020. Nuestras guías combinan experiencia operativa real," → "…hosting en Chile. Nuestras guías combinan benchmarks verificables,".

4. **`src/pages/MejorHostingChile2026.tsx`**
   - Eliminar "desde 2020" en respuesta FAQ que dice "0 reclamos registrados en Reclamos.cl desde 2020." → "0 reclamos registrados en Reclamos.cl."
   - Eliminar "5 años" en "…0 reclamos en 5 años demuestra excelente servicio…" → "…0 reclamos demuestra excelente servicio al cliente…".
   - Pie de tabla "(2020-{CURRENT_YEAR})" → "(últimos periodos disponibles)".

### Lo que NO toco
- Descripciones de proveedores en `src/data/hostingCompanies.ts` (esos "años" son de las empresas reales, no del sitio).

Sin cambios de BD ni de estructura; solo copy.
