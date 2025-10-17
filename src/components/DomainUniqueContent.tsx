import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, CheckCircle, Server, Building } from 'lucide-react';

interface DomainUniqueContentProps {
  domainName: string;
  domainData: {
    whois: {
      owner_name: string;
      created_date: string;
      expires_date: string;
      registrar: string;
    };
    dns: {
      ns_records: string[];
    };
    basic: {
      asn?: string;
      provider?: string;
    };
  };
}

// Helper function to analyze owner type
const analyzeOwner = (ownerName: string) => {
  if (!ownerName || ownerName === 'No disponible') {
    return { type: 'Desconocido', isCompany: false, name: ownerName };
  }
  
  const isCompany = ownerName.includes('LTDA') || 
                    ownerName.includes('SPA') || 
                    ownerName.includes('S.A.') ||
                    ownerName.includes('SOCIEDAD') ||
                    ownerName.toUpperCase() === ownerName;
  
  return {
    type: isCompany ? 'Empresa' : 'Persona Natural',
    name: ownerName,
    isCompany
  };
};

// Helper function to calculate domain age
const calculateDomainAge = (createdDate: string) => {
  if (!createdDate || createdDate === 'No disponible') {
    return { days: 0, years: 0, isNew: false, isEstablished: false };
  }
  
  const created = new Date(createdDate);
  const now = new Date();
  const ageInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  const ageInYears = parseFloat((ageInDays / 365).toFixed(1));
  
  return {
    days: ageInDays,
    years: ageInYears,
    isNew: ageInDays < 30,
    isEstablished: ageInDays > 365
  };
};

// Helper function to calculate days until expiration
const calculateExpirationDays = (expiresDate: string) => {
  if (!expiresDate || expiresDate === 'No disponible') {
    return { days: 0, isExpiringSoon: false, isExpired: false };
  }
  
  const expires = new Date(expiresDate);
  const now = new Date();
  const daysUntilExpiry = Math.floor((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    days: daysUntilExpiry,
    isExpiringSoon: daysUntilExpiry < 90,
    isExpired: daysUntilExpiry < 0
  };
};

// Helper function to analyze nameservers
const analyzeNameservers = (nameservers: string[]) => {
  if (!nameservers || nameservers.length === 0) {
    return {
      configured: false,
      provider: null,
      details: 'Dominio sin nameservers configurados'
    };
  }
  
  const nsString = nameservers.join(' ').toLowerCase();
  
  let provider = 'Proveedor Personalizado';
  let description = '';
  
  if (nsString.includes('cloudflare')) {
    provider = 'Cloudflare';
    description = 'Cloudflare es una CDN y servicio de seguridad líder mundial que ofrece protección DDoS, SSL gratuito y optimización de rendimiento.';
  } else if (nsString.includes('hostgator')) {
    provider = 'HostGator Chile';
    description = 'HostGator es un proveedor de hosting con presencia en Chile, ofreciendo planes compartidos y VPS con soporte en español.';
  } else if (nsString.includes('hostingplus')) {
    provider = 'HostingPlus';
    description = 'HostingPlus es el proveedor líder en Chile con servidores locales, SSL gratuito y soporte 24/7 en español.';
  } else if (nsString.includes('ecohosting')) {
    provider = 'EcoHosting';
    description = 'EcoHosting ofrece servicios de hosting ecológico en Chile con enfoque en sostenibilidad y energías renovables.';
  } else if (nsString.includes('nic.cl')) {
    provider = 'NIC Chile';
    description = 'NIC Chile es el registro oficial de dominios .CL, gestionado por la Universidad de Chile.';
  }
  
  return {
    configured: true,
    provider,
    description,
    nameservers
  };
};

export const DomainUniqueContent: React.FC<DomainUniqueContentProps> = ({ domainName, domainData }) => {
  const ownerAnalysis = analyzeOwner(domainData.whois.owner_name);
  const domainAge = calculateDomainAge(domainData.whois.created_date);
  const expirationInfo = calculateExpirationDays(domainData.whois.expires_date);
  const nsAnalysis = analyzeNameservers(domainData.dns.ns_records);

  return (
    <div className="space-y-8 mt-8">
      {/* 1. Análisis del Propietario */}
      <section className="bg-white p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Building className="h-6 w-6 text-primary" />
          Información del Propietario de {domainName}
        </h2>
        <p className="text-gray-700 mb-4">
          Este dominio está registrado a nombre de <strong>{ownerAnalysis.name}</strong>
          {ownerAnalysis.isCompany ? 
            ', una entidad empresarial chilena. Los dominios registrados por empresas suelen indicar proyectos comerciales profesionales, lo que puede reflejar mayor seriedad y permanencia en el tiempo.' :
            ', una persona natural. Los dominios registrados por individuos pueden ser proyectos personales, emprendimientos o portafolios profesionales.'
          }
        </p>
        
        {ownerAnalysis.isCompany && (
          <div className="bg-blue-50 p-4 rounded-lg mt-4 border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Building className="h-5 w-5" />
              Características de dominios empresariales
            </h3>
            <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
              <li>Mayor probabilidad de contar con hosting profesional</li>
              <li>Usualmente incluyen SSL y medidas de seguridad</li>
              <li>Proyectos de largo plazo con soporte técnico</li>
              <li>Recomendable verificar en SII para confirmar actividad comercial</li>
            </ul>
          </div>
        )}
      </section>

      {/* 2. Análisis Temporal */}
      <section className="bg-white p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Antigüedad y Ciclo de Vida de {domainName}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Fecha de Registro</h3>
              <p className="text-2xl font-bold text-blue-600">
                {domainData.whois.created_date !== 'No disponible' 
                  ? new Date(domainData.whois.created_date).toLocaleDateString('es-CL')
                  : 'No disponible'
                }
              </p>
              {domainAge.days > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Hace {domainAge.days} días ({domainAge.years} años)
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Fecha de Expiración</h3>
              <p className="text-2xl font-bold text-orange-600">
                {domainData.whois.expires_date !== 'No disponible'
                  ? new Date(domainData.whois.expires_date).toLocaleDateString('es-CL')
                  : 'No disponible'
                }
              </p>
              {expirationInfo.days > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Faltan {expirationInfo.days} días
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">📊 Análisis Temporal</h3>
          <p className="text-gray-700">
            {domainAge.isNew ? 
              `Este es un dominio recién registrado (menos de 30 días). Los dominios nuevos suelen estar en fase de configuración o desarrollo. Es normal que aún no tengan contenido publicado o que estén configurando su infraestructura de hosting.` :
              domainAge.isEstablished ?
              `Este dominio tiene más de un año de antigüedad, lo que indica un proyecto establecido. Los dominios con mayor antigüedad suelen tener mejor posicionamiento en buscadores y mayor confianza por parte de los usuarios.` :
              domainAge.days > 0 ?
              `Este dominio tiene ${domainAge.days} días de antigüedad. Está en fase intermedia donde probablemente ya cuenta con contenido activo y configuración completa.` :
              'No se pudo determinar la antigüedad del dominio.'
            }
          </p>
          
          {expirationInfo.isExpiringSoon && expirationInfo.days > 0 && (
            <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-yellow-800 font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Este dominio expira en menos de 90 días
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                Si eres el propietario, recuerda renovarlo antes de la fecha de expiración 
                para evitar perder el dominio.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Análisis de Nameservers */}
      <section className="bg-white p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Server className="h-6 w-6 text-primary" />
          Configuración de Nameservers de {domainName}
        </h2>
        
        {nsAnalysis.configured ? (
          <>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 mb-4">
              <p className="text-green-800 font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Dominio configurado con nameservers activos
              </p>
              <p className="text-green-700 text-sm mt-1">
                Proveedor detectado: <strong>{nsAnalysis.provider}</strong>
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Nameservers Configurados:</h3>
              <ul className="space-y-1">
                {nsAnalysis.nameservers.map((ns, idx) => (
                  <li key={idx} className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {ns}
                  </li>
                ))}
              </ul>
            </div>
            
            {nsAnalysis.description && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">📖 Sobre {nsAnalysis.provider}</h3>
                <p className="text-sm text-gray-700">{nsAnalysis.description}</p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <p className="text-yellow-800 font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Dominio sin nameservers configurados
            </p>
            <p className="text-yellow-700 text-sm mt-2">
              Este dominio está registrado pero aún no tiene nameservers asignados. 
              Esto significa que no está apuntando a ningún servidor de hosting y 
              no puede mostrar un sitio web todavía.
            </p>
            
            <div className="mt-4">
              <h4 className="font-semibold text-sm">Para activar este dominio necesitas:</h4>
              <ol className="list-decimal list-inside text-sm space-y-2 mt-2">
                <li>Contratar un plan de hosting en Chile</li>
                <li>Configurar los nameservers proporcionados por tu hosting</li>
                <li>Esperar 24-48 horas para propagación DNS</li>
              </ol>
              <Link to="/ranking" className="inline-block mt-3 text-blue-600 underline text-sm hover:text-blue-800">
                Ver ranking de hosting en Chile →
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 4. Comparación con Dominios Similares */}
      <section className="bg-white p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">📊 Comparación con Otros Dominios .CL</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">ANTIGÜEDAD</h3>
              <p className="text-2xl font-bold">
                {domainAge.days > 0 ? `${domainAge.days} días` : 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Promedio en Chile: ~547 días
              </p>
              {domainAge.days > 0 && (
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{width: `${Math.min((domainAge.days / 1000) * 100, 100)}%`}}
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">TIPO REGISTRADOR</h3>
              <p className="text-lg font-bold">
                {domainData.whois.registrar || 'Desconocido'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {domainData.whois.registrar === 'NIC Chile' ? 
                  '76% de dominios .CL usan NIC Chile' :
                  'Registrador internacional'
                }
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">CONFIGURACIÓN</h3>
              <p className="text-2xl font-bold">
                {nsAnalysis.configured ? '✅ Activo' : '⏳ Pendiente'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {nsAnalysis.configured ? 
                  '82% de dominios están configurados' :
                  '18% están sin configurar'
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. Recomendaciones Personalizadas */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">💡 Recomendaciones Específicas para {domainName}</h2>
        
        <div className="space-y-4">
          {domainAge.isNew && (
            <div className="p-4 bg-white border-l-4 border-blue-500 rounded-r-lg shadow-sm">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <span>🆕</span> Dominio Nuevo: Considera estas prioridades
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Configura SSL desde el primer día (mejora SEO y confianza)</li>
                <li>• Elige hosting con buena velocidad para crear buena primera impresión</li>
                <li>• Implementa redirects 301 correctamente si migras contenido</li>
              </ul>
              <Link to="/guia-elegir-hosting" className="text-blue-600 text-sm underline mt-2 inline-block hover:text-blue-800">
                Ver guía completa →
              </Link>
            </div>
          )}
          
          {!nsAnalysis.configured && (
            <div className="p-4 bg-white border-l-4 border-orange-500 rounded-r-lg shadow-sm">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <span>⚙️</span> Sin Configuración: Pasos a seguir
              </h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>1. Contrata hosting:</strong> Recomendamos proveedores chilenos 
                  para mejor rendimiento local
                  <Link to="/ranking" className="text-blue-600 underline ml-1 hover:text-blue-800">
                    Ver ranking
                  </Link>
                </li>
                <li>
                  <strong>2. Configura nameservers:</strong> Tu proveedor te dará 2 nameservers 
                  para configurar en NIC Chile
                </li>
                <li>
                  <strong>3. Espera propagación:</strong> Los cambios DNS toman 24-48 horas
                </li>
              </ol>
            </div>
          )}
          
          {domainData.whois.registrar !== 'NIC Chile' && domainData.whois.registrar !== 'No disponible' && (
            <div className="p-4 bg-white border-l-4 border-purple-500 rounded-r-lg shadow-sm">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <span>🌍</span> Registrador Internacional
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                Tu dominio .CL está registrado a través de <strong>{domainData.whois.registrar}</strong>, 
                un registrador internacional. Esto es totalmente válido, pero considera:
              </p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Soporte técnico puede estar en otro idioma/horario</li>
                <li>• Pagos en moneda extranjera (posibles comisiones)</li>
                <li>• Transferir a NIC Chile es posible si prefieres gestión local</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 6. Enlaces Internos Estratégicos */}
      <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold mb-3">🔗 Recursos Útiles</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <Link to="/ranking" className="flex items-center gap-2 p-3 bg-white rounded hover:bg-blue-50 transition-colors border hover:border-blue-300">
            <span>📊</span> 
            <span className="text-sm font-medium">Ranking de Hosting Chile 2025</span>
          </Link>
          <Link to="/wiki" className="flex items-center gap-2 p-3 bg-white rounded hover:bg-blue-50 transition-colors border hover:border-blue-300">
            <span>📚</span> 
            <span className="text-sm font-medium">Wiki de Términos de Hosting</span>
          </Link>
          {domainData.basic.asn && (
            <Link to={`/asn/AS${domainData.basic.asn}`} className="flex items-center gap-2 p-3 bg-white rounded hover:bg-blue-50 transition-colors border hover:border-blue-300">
              <span>🌐</span> 
              <span className="text-sm font-medium">Ver información de ASN {domainData.basic.asn}</span>
            </Link>
          )}
          <Link to="/guia-elegir-hosting" className="flex items-center gap-2 p-3 bg-white rounded hover:bg-blue-50 transition-colors border hover:border-blue-300">
            <span>📖</span> 
            <span className="text-sm font-medium">Guía para Elegir Hosting</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
