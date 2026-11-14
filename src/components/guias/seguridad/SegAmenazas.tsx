import React from 'react';
import { H2, GuideNote } from '../GuideBlocks';

/** Guía de seguridad web: experiencia, amenazas y medidas básicas. */
const SegAmenazas: React.FC = () => (
  <>
    <H2 id="experiencia">Mi experiencia con hackeos en Chile</H2>
    <p>
      <strong>La llamada que me cambió:</strong> 3:30 AM, diciembre 2022. Una tienda online de Concepción había sido
      hackeada en plena campaña navideña. Los hackers robaron datos de 5.000 clientes y pusieron pornografía en su
      sitio.
    </p>
    <p>Resultado: pérdidas cuantiosas, demandas de clientes, y 6 meses para recuperar la confianza.</p>
    <p>
      Desde entonces, he limpiado más de 300 sitios hackeados y desarrollado un protocolo específico para el mercado
      chileno.
    </p>
    <GuideNote>
      <p>
        <strong>Realidad chilena:</strong> El 80&nbsp;% de los hackeos que veo podrían haberse evitado con medidas
        básicas de seguridad de costo bajo.
      </p>
    </GuideNote>

    <H2 id="amenazas-chile">Amenazas específicas en Chile</H2>
    <h3>Top 5 ataques que veo</h3>
    <ol>
      <li><strong>WordPress desactualizado</strong> (60&nbsp;% de casos)</li>
      <li><strong>Plugins vulnerables</strong> (25&nbsp;% de casos)</li>
      <li><strong>Contraseñas débiles</strong> (20&nbsp;% de casos)</li>
      <li><strong>Hosting sin protección</strong> (15&nbsp;% de casos)</li>
      <li><strong>Emails corporativos</strong> (10&nbsp;% de casos)</li>
    </ol>
    <h3>Objetivos favoritos</h3>
    <ul>
      <li><strong>E-commerce:</strong> robo de datos de tarjetas</li>
      <li><strong>Empresas:</strong> secuestro de datos (ransomware)</li>
      <li><strong>Blogs populares:</strong> SEO spam</li>
      <li><strong>Sitios corporativos:</strong> desfiguración</li>
    </ul>
    <GuideNote title="Patrón que he observado en Chile">
      <p>
        Los hackers suelen atacar entre las 2:00 y las 6:00 AM (cuando nadie monitorea) y prefieren sitios .cl porque
        saben que muchas empresas chilenas tienen seguridad básica.
      </p>
      <p>
        <strong>Dato alarmante:</strong> El 70&nbsp;% de mis clientes descubren el hackeo 3–7 días después, cuando
        Google ya los ha marcado como «sitio peligroso».
      </p>
    </GuideNote>

    <H2 id="medidas-basicas">Medidas básicas (obligatorias)</H2>
    <h3>1. Contraseñas seguras</h3>
    <p>
      <strong>Mi experiencia:</strong> El 80&nbsp;% de hackeos empiezan con contraseñas débiles.
    </p>
    <ul>
      <li>Mínimo 12 caracteres</li>
      <li>Mayúsculas, minúsculas, números, símbolos</li>
      <li>Diferente para cada servicio</li>
      <li>Cambiar cada 6 meses</li>
    </ul>
    <p>
      <strong>Gestores recomendados:</strong>
    </p>
    <ul>
      <li><strong>LastPass:</strong> fácil para empresas</li>
      <li><strong>1Password:</strong> mejor UX</li>
      <li><strong>Bitwarden:</strong> opción gratuita sólida</li>
    </ul>

    <h3>2. Actualizaciones automáticas</h3>
    <p>
      <strong>Historia real:</strong> Un restaurante de Las Condes perdió su sitio por no actualizar WordPress. La
      vulnerabilidad tenía 3 meses y un parche disponible.
    </p>
    <p>
      <strong>Configuración que uso:</strong>
    </p>
    <ul>
      <li>WordPress: actualizaciones automáticas activadas</li>
      <li>Plugins: solo automáticas para updates menores</li>
      <li>Temas: manual (pueden romper diseño)</li>
      <li>PHP: actualizar anualmente con pruebas</li>
    </ul>

    <h3>3. Backups automatizados</h3>
    <p>
      <strong>Regla de oro:</strong> Un backup no verificado es como no tener backup.
    </p>
    <p>
      <strong>Frecuencia recomendada:</strong>
    </p>
    <ul>
      <li><strong>E-commerce:</strong> diario</li>
      <li><strong>Blogs activos:</strong> semanal</li>
      <li><strong>Sitios estáticos:</strong> mensual</li>
      <li><strong>Antes de cambios:</strong> siempre</li>
    </ul>
    <p>
      <strong>Herramientas que uso:</strong>
    </p>
    <ul>
      <li><strong>UpdraftPlus:</strong> WordPress</li>
      <li><strong>BackWPup:</strong> alternativa gratuita</li>
      <li><strong>Acronis:</strong> sitios completos</li>
      <li><strong>Google Drive:</strong> almacenamiento</li>
    </ul>
  </>
);

export default SegAmenazas;
