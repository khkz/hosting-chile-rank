
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const methodologyFactors = [
  { name: "Servicio post-venta", weight: "25 %" },
  { name: "Velocidad/tecnología", weight: "25 %" },
  { name: "Seguridad & Backups", weight: "20 %" },
  { name: "Reputación", weight: "15 %" },
  { name: "Precio vs. valor", weight: "15 %" },
];

const Methodology = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">Puntuación y Metodología</h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg mb-6">
            Asignamos puntajes (0-10) según cinco factores: Servicio post-venta (25 %), 
            Velocidad/tecnología (25 %), Seguridad & Backups (20 %), Reputación (15 %), 
            Precio vs. valor (15 %). Datos obtenidos de pruebas reales de ping, uptime públicos, 
            Reclamos.cl y documentación de cada proveedor.
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factor</TableHead>
                  <TableHead className="text-right">Peso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {methodologyFactors.map((factor) => (
                  <TableRow key={factor.name}>
                    <TableCell className="font-medium">{factor.name}</TableCell>
                    <TableCell className="text-right">{factor.weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
