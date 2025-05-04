
import React from 'react';

const factorWeights = [
  { factor: "Servicio post-venta", weight: "25%" },
  { factor: "Velocidad/tecnología", weight: "25%" },
  { factor: "Seguridad & Backups", weight: "20%" },
  { factor: "Reputación", weight: "15%" },
  { factor: "Precio vs. valor", weight: "15%" }
];

const Methodology = () => {
  return (
    <section className="py-12 bg-background" id="metodologia">
      {/* <!-- section 3: Methodology --> */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-primary">
          Metodología de Evaluación
        </h2>
        <div className="max-w-3xl mx-auto">
          <p className="mb-8 text-primary/80 text-center">
            Asignamos puntajes (0-10) en cinco factores: Servicio post-venta (25%), 
            Velocidad/tecnología (25%), Seguridad & Backups (20%), Reputación (15%), 
            Precio vs. valor (15%). Datos obtenidos de pruebas reales de ping, uptime públicos, 
            Reclamos.cl y documentación de cada proveedor.
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="py-3 px-4 text-left">Factor</th>
                  <th className="py-3 px-4 text-right">Peso</th>
                </tr>
              </thead>
              <tbody>
                {factorWeights.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="py-3 px-4 border-t">{item.factor}</td>
                    <td className="py-3 px-4 border-t text-right font-semibold">{item.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
