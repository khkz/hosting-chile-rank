

# Plan: Corregir Regex de Sync-Deleted-Domains

## Problema Identificado

La Edge Function `sync-deleted-domains` recibe correctamente el HTML de NIC.cl (242KB), pero los patrones regex no coinciden con la estructura real.

## Estructura Real del HTML

Los dominios en la página de NIC.cl aparecen así:

```html
<td style="padding: 0px;">
  <div style="float: left; position: relative;">
    
    
      10deseos.cl
    
  </div>
  ...
</td>
```

Los dominios están como **texto suelto** dentro de `<div>`, con espacios en blanco y saltos de línea alrededor.

## Solución

Actualizar los patrones regex para capturar dominios en este formato.

### Patrones Correctos

```javascript
const patterns = [
  // Dominio solo en una línea (con espacios opcionales)
  /^\s*([a-z0-9][a-z0-9-]*\.cl)\s*$/gim,
  
  // Dominio dentro de div/td con newlines
  />\s*\n?\s*([a-z0-9][a-z0-9-]*\.cl)\s*\n?\s*</gi,
  
  // Busqueda general de .cl con limites de palabra
  /\b([a-z0-9][a-z0-9-]{1,61}\.cl)\b/gi,
];
```

### Archivo a Modificar

```
supabase/functions/sync-deleted-domains/index.ts
  - Líneas 82-86: Reemplazar patrones regex
  - Agregar filtrado para evitar falsos positivos (nic.cl, google.cl, etc.)
```

## Cambios Específicos

### 1. Nuevos Patrones Regex

Cambiar de:
```javascript
const patterns = [
  /([a-z0-9áéíóúñü-]+\.cl)\s*<br>/gi,
  />([a-z0-9áéíóúñü-]+\.cl)</gi,
  /Whois\.do\?d=([a-z0-9-]+\.cl)/gi,
];
```

A:
```javascript
// Pattern que captura dominios .cl en líneas solas o dentro de estructuras HTML
const domainPattern = /\b([a-z0-9][a-z0-9-]{1,61}\.cl)\b/gi;

// Lista de dominios a excluir (infraestructura, ejemplos, etc.)
const excludedDomains = new Set([
  'nic.cl',
  'www.nic.cl',
  'clientes.nic.cl',
  'google.cl',
  'recaptcha.cl',
]);
```

### 2. Lógica de Filtrado Mejorada

```javascript
let match;
while ((match = domainPattern.exec(html)) !== null) {
  const domain = match[1].toLowerCase();
  
  // Filtros de validación
  if (
    domain.length > 4 &&                    // Mínimo 5 caracteres
    !excludedDomains.has(domain) &&         // No está excluido
    !domain.includes('--') &&               // No tiene doble guión
    !domain.startsWith('-') &&              // No empieza con guión
    !domains.includes(domain)               // No duplicado
  ) {
    domains.push(domain);
  }
}
```

### 3. Validación con Sección de Dominios Eliminados

Para ser más preciso, solo parsear la sección relevante del HTML:

```javascript
// Buscar la sección de dominios eliminados
const sectionStart = html.indexOf('Listado Dominios Eliminados');
const sectionEnd = html.indexOf('</table>', sectionStart);
const relevantHtml = sectionStart > 0 
  ? html.slice(sectionStart, sectionEnd) 
  : html;
```

## Resultado Esperado

Después de este fix:
- La sincronización debería encontrar los ~221 dominios disponibles
- Los dominios se insertarán en `domain_opportunities` con `source: "deleted"`
- El toast mostrará "221 encontrados, X nuevos insertados"

## Testing

Una vez implementado, presionar "Sincronizar NIC.cl" debería mostrar algo como:

```
✅ Sincronización completada
221 nuevos dominios agregados, 0 ya existían
```

