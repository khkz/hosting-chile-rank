import { Link } from 'react-router-dom';
import { Award, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CertificationsBanner() {
  return (
    <section className="py-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Award className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-4">
            Certificaciones de Calidad
          </h2>
          
          <p className="text-lg text-[#555] mb-8 max-w-3xl mx-auto">
            Reconocemos a los mejores proveedores de hosting en Chile con certificaciones 
            basadas en rendimiento verificado, seguridad y atención al cliente.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <ShieldCheck className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Mejor Seguridad</h3>
              <p className="text-sm text-gray-600">
                SSL, firewall y respaldos automáticos verificados
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Star className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Mejor Soporte</h3>
              <p className="text-sm text-gray-600">
                Atención 24/7 y tiempo de respuesta certificado
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Award className="h-10 w-10 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Mejor Rendimiento</h3>
              <p className="text-sm text-gray-600">
                Uptime superior al 99.9% y velocidad optimizada
              </p>
            </div>
          </div>
          
          <Button asChild size="lg">
            <Link to="/certificaciones">
              Ver Certificaciones Completas
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
