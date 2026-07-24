// Mirror de src/data/countryContent.mjs para consumo desde React/TS.
// Si edits uno, edita el otro (textos idénticos por país).
export type CountryFaq = { q: string; a: string };
export type CountryCopy = {
  kicker: string;
  title: string;
  subtitle: string;
  chips: string[];
  intro: string[];
  faq: CountryFaq[];
};

export const COUNTRY_CONTENT: Record<'pe' | 'mx' | 'co' | 'ar', CountryCopy> = {
  pe: {
    kicker: "🇵🇪 Perú · Ranking independiente 2026",
    title: "Hosting en Perú 2026: la comparación honesta que no encontrarás en los blogs de siempre",
    subtitle: "Comparamos proveedores con datos que puedes verificar tú mismo: RUC en SUNAT, dónde están los servidores de verdad, reseñas y reclamos en INDECOPI. Sin rankings pagados ni «top» inventados.",
    chips: ["18 proveedores verificados", "RUC peruano comprobable", "Datacenter local verificado", "Reclamos INDECOPI a la vista"],
    intro: [
      "Elegir hosting en el Perú se volvió un campo minado. Buscas «mejor hosting Perú» y casi todo lo que sale son webs de los propios proveedores poniéndose en primer lugar, o blogs que cobran comisión por recomendarte a quien más les paga. Nosotros hacemos lo contrario: publicamos solo lo que se puede comprobar.",
      "Para cada proveedor revisamos su razón social y RUC en SUNAT, dónde aloja realmente sus servidores, qué tecnología declara y cómo le va en reclamos públicos. Si un dato no lo podemos verificar, lo decimos; no lo maquillamos con una nota inventada del 1 al 10."
    ],
    faq: [
      { q: "¿Cuánto cuesta un hosting en el Perú?", a: "Un plan compartido serio parte alrededor de los S/ 10 a S/ 30 al mes según el proveedor y el plazo que contrates. Ojo con los precios «gancho» del primer año: revisa siempre a cuánto se renueva. En cada ficha mostramos el precio y la razón social que te va a facturar." },
      { q: "¿Conviene un hosting con datacenter en el Perú?", a: "Si tu público está en el Perú, un datacenter local baja la latencia y te da un respaldo legal más claro. Pero cuidado: muchos dicen «datacenter en Perú» y en realidad revenden servidores de afuera. Marcamos cuáles tienen infraestructura local verificable." }
    ],
  },
  mx: {
    kicker: "🇲🇽 México · Ranking independiente 2026",
    title: "Hosting en México 2026: comparativa sin cortinas de humo",
    subtitle: "Nada de «top 10» pagados. Comparamos proveedores con datos que puedes checar: RFC, dónde están los servidores de verdad, reseñas y quejas en el Buró Comercial de PROFECO.",
    chips: ["Proveedores verificados", "RFC y razón social", "Servidores: dónde de verdad", "Quejas PROFECO a la vista"],
    intro: [
      "Buscar hosting en México casi siempre termina igual: páginas que se recomiendan a sí mismas y blogs que te mandan a quien les suelta más comisión. Aquí no. Solo ponemos lo que se puede comprobar, y si algo no cuadra, lo decimos claro.",
      "De cada proveedor revisamos su RFC y razón social, dónde aloja realmente sus servidores, qué tecnología usa y cómo anda en el Buró Comercial de PROFECO. Cuando un dato no se puede verificar, lo marcamos así — nada de inventar una calificación para rellenar."
    ],
    faq: [
      { q: "¿Cuánto cuesta un hosting en México?", a: "Un plan compartido decente ronda los $80 a $250 MXN al mes según proveedor y contratación. Aguas con el precio de enganche del primer año: fíjate siempre en cuánto sube la renovación. En cada ficha ves el precio y quién te va a facturar." },
      { q: "¿Sirve que el hosting tenga datacenter en México?", a: "Si tu audiencia está en México, un datacenter local mejora la velocidad y la parte legal. El detalle: muchos dicen tener servidores en México y en realidad revenden infraestructura de EE.UU. Señalamos cuáles sí tienen presencia local comprobable." }
    ],
  },
  co: {
    kicker: "🇨🇴 Colombia · Ranking independiente 2026",
    title: "Hosting en Colombia 2026: una comparación en la que sí puede confiar",
    subtitle: "Sin rankings pagados. Comparamos proveedores con datos verificables: NIT, dónde están realmente los servidores, reseñas y reclamos ante la SIC.",
    chips: ["Proveedores verificados", "NIT y razón social", "Datacenter: ubicación real", "Reclamos SIC a la vista"],
    intro: [
      "Buscar hosting en Colombia suele llevarlo a lo mismo: sitios que se ponen a sí mismos de primeros y blogs que recomiendan a quien mejor les paga. Nosotros trabajamos distinto: publicamos únicamente lo que se puede comprobar, y cuando un dato no da, se lo decimos con franqueza.",
      "De cada proveedor verificamos su NIT y razón social, dónde aloja de verdad sus servidores, qué tecnología declara y su historial de reclamos ante la Superintendencia de Industria y Comercio. Si algo no es verificable, lo dejamos claro; no rellenamos con una nota inventada."
    ],
    faq: [
      { q: "¿Cuánto cuesta un hosting en Colombia?", a: "Un plan compartido serio va, más o menos, entre $15.000 y $45.000 COP al mes según el proveedor y el plazo. Tenga cuidado con el precio del primer año: mire siempre a cuánto queda la renovación. En cada ficha aparece el precio y la razón social que le factura." },
      { q: "¿Vale la pena un hosting con datacenter en Colombia?", a: "Si su público está en Colombia, un datacenter local mejora la velocidad y el respaldo legal. Pero ojo: varios dicen tener «servidores en Colombia» y en realidad revenden infraestructura de afuera. Señalamos cuáles tienen presencia local verificable." }
    ],
  },
  ar: {
    kicker: "🇦🇷 Argentina · Ranking independiente 2026",
    title: "Hosting en Argentina 2026: la comparación que no te van a mostrar los de siempre",
    subtitle: "Sin rankings comprados. Comparamos proveedores con datos que podés chequear vos mismo: CUIT, dónde están los servidores en serio, reseñas y reclamos en Defensa del Consumidor.",
    chips: ["Proveedores verificados", "CUIT y razón social", "Servidores: dónde en serio", "Reclamos oficiales a la vista"],
    intro: [
      "Buscás «mejor hosting Argentina» y te encontrás con lo mismo de siempre: páginas que se recomiendan solas y blogs que te mandan a quien les paga más comisión. Acá hacemos al revés: publicamos solo lo que se puede comprobar, y si un dato no cierra, te lo decimos de frente.",
      "De cada proveedor miramos el CUIT y la razón social, dónde alojan de verdad los servidores, qué tecnología declaran y cómo vienen con los reclamos en Defensa del Consumidor. Cuando algo no se puede verificar, lo marcamos; no te inventamos un puntaje para rellenar."
    ],
    faq: [
      { q: "¿Cuánto sale un hosting en Argentina?", a: "Por la inflación conviene mirar el precio en dólares o el valor de renovación, no solo el del primer mes. Un compartido serio suele arrancar en pocos dólares mensuales. En cada ficha te mostramos el precio y quién te factura." },
      { q: "¿Conviene un hosting con datacenter en Argentina?", a: "Si tu público está en Argentina, un datacenter local mejora la latencia y la parte legal. Pero atención: muchos dicen tener «servidores en Argentina» y en realidad revenden infraestructura de afuera. Marcamos cuáles tienen presencia local verificable." }
    ],
  },
};
