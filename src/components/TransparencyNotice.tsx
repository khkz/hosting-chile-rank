
import React from 'react';
import { Shield, Eye, Award, CheckCircle } from 'lucide-react';

const TransparencyNotice = () => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-4">
              Transparencia Total
            </h2>
            <p className="text-xl text-gray-600">
              Conoce nuestra metodología de evaluación independiente
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            
            {/* Independence */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2B2D42]">Análisis Independiente</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                No recibimos pagos por posicionamiento en rankings. Nuestras evaluaciones se basan únicamente en 
                métricas técnicas verificables: velocidad, uptime, seguridad y soporte técnico.
              </p>
            </div>

            {/* Methodology */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mr-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2B2D42]">Metodología Rigurosa</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Probamos cada hosting durante 30 días mínimo, monitoreamos uptime 24/7, 
                medimos velocidades desde múltiples ubicaciones y evaluamos la calidad del soporte técnico.
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-gradient-to-r from-[#2B2D42] to-gray-800 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Nuestros Criterios de Evaluación
            </h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#EF233C] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Velocidad</h4>
                <p className="text-sm text-gray-300">Tiempo de carga y optimización</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Uptime</h4>
                <p className="text-sm text-gray-300">Disponibilidad 24/7</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Seguridad</h4>
                <p className="text-sm text-gray-300">Protección y backups</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Soporte</h4>
                <p className="text-sm text-gray-300">Atención al cliente</p>
              </div>
            </div>
          </div>

          {/* Disclosure */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 leading-relaxed">
              <strong>Divulgación:</strong> Este sitio puede recibir comisiones cuando haces clic en algunos de nuestros enlaces. 
              Esto no afecta nuestras recomendaciones ni rankings, que se basan únicamente en pruebas técnicas objetivas.
              Siempre recomendamos el mejor hosting para cada necesidad específica.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransparencyNotice;
