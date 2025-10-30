import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { migrateHostingCompanies } from '@/utils/migrateHostingData';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const DataMigration = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMigration = async () => {
    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const migrationResult = await migrateHostingCompanies();
      setResult(migrationResult);
    } catch (err: any) {
      setError(err.message || 'Error desconocido durante la migración');
      console.error('Migration error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Migración de Datos a Supabase</CardTitle>
            <CardDescription>
              Esta herramienta migra todos los datos de hosting desde el archivo estático 
              <code className="mx-1 px-2 py-1 bg-muted rounded">src/data/hostingCompanies.ts</code> 
              a la base de datos Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Esta migración solo debe ejecutarse una vez. 
                Las empresas que ya existen en la base de datos serán omitidas automáticamente.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold">¿Qué se migrará?</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Información completa de todas las empresas de hosting</li>
                <li>Planes de hosting con precios y características</li>
                <li>Datos de contacto y ubicación</li>
                <li>Ratings y año de fundación</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleMigration} 
                disabled={isRunning}
                size="lg"
              >
                {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isRunning ? 'Migrando...' : 'Iniciar Migración'}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold text-green-900">¡Migración completada!</p>
                    <div className="text-sm space-y-1">
                      <p>✅ Empresas migradas: <strong>{result.success}</strong></p>
                      <p>⏭️ Empresas omitidas (ya existían): <strong>{result.skipped}</strong></p>
                      <p>❌ Errores: <strong>{result.errors}</strong></p>
                      <p>📦 Total procesadas: <strong>{result.total}</strong></p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {result && result.success > 0 && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Próximos pasos:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Verificar que las empresas aparezcan en <a href="/catalogo" className="text-primary hover:underline">/catalogo</a></li>
                  <li>Revisar que los planes y precios sean correctos</li>
                  <li>Actualizar enlaces internos para usar <code>/catalogo</code> en lugar de <code>/directorio-hosting-chile</code></li>
                  <li>Verificar que los redirects 301 funcionen correctamente</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default DataMigration;
