import React from 'react';
import { Zap, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

const BeforeAfter = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2B2D42] mb-4">
            De hosting <span className="text-gray-400 line-through">prometedor</span> → 
            <span className="text-brand-red"> Hosting que cumple</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            La diferencia entre elegir cualquier hosting vs elegir con datos verificados
          </p>
        </div>

        {/* Before/After Split Screen */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* ANTES - Hosting Promedio */}
          <div className="bg-white border-2 border-red-200 rounded-2xl p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Sin Verificación
            </div>
            
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">😰</div>
              <h3 className="text-xl font-bold text-gray-800">Hosting Promedio</h3>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Lentitud constante</p>
                  <p className="text-sm text-gray-600">450ms de latencia promedio</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Caídas frecuentes</p>
                  <p className="text-sm text-gray-600">97.5% uptime (6h caído/mes)</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Pérdida de clientes</p>
                  <p className="text-sm text-gray-600">-38% conversiones por lentitud</p>
                </div>
              </li>
            </ul>
          </div>

          {/* DESPUÉS - Hosting Verificado */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-8 relative shadow-lg">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-red to-brand-red-dark text-white px-4 py-1 rounded-full text-sm font-semibold">
              Verificado por Nosotros
            </div>
            
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">🚀</div>
              <h3 className="text-xl font-bold text-gray-800">Hosting que Cumple</h3>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Velocidad comprobada</p>
                  <p className="text-sm text-gray-600">250ms latencia (44% más rápido)</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Disponibilidad real</p>
                  <p className="text-sm text-gray-600">99.98% uptime verificado</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Más conversiones</p>
                  <p className="text-sm text-gray-600">+38% ventas con sitio rápido</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Stats */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-full shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700">
              Todos nuestros datos son verificados con herramientas independientes
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BeforeAfter;
