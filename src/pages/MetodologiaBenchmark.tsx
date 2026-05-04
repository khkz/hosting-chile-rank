import React from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const MetodologiaBenchmark: React.FC = () => {
  const { data: methodologies } = useQuery({
    queryKey: ["benchmark-methodologies-all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("benchmark_methodology")
        .select("*")
        .order("published_at", { ascending: false });
      return data ?? [];
    },
  });

  const current = methodologies?.find((m) => m.is_current);
  const previous = methodologies?.filter((m) => !m.is_current) ?? [];

  return (
    <>
      <Helmet>
        <title>Metodología del Benchmark | EligeTuHosting.cl</title>
        <meta
          name="description"
          content="Cómo medimos el rendimiento de los proveedores de hosting en Chile. Metodología pública, versionada y reproducible."
        />
        <link rel="canonical" href="https://eligetuhosting.cl/metodologia-benchmark" />
      </Helmet>

      <Navbar />

      <main className="bg-[#F7F9FC] min-h-screen py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Metodología del Benchmark</h1>
          <p className="text-muted-foreground mb-6">
            Documentación pública y versionada de cómo medimos a los proveedores de hosting en Chile.
          </p>

          {current && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Versión {current.version}
                  <Badge>Vigente</Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Publicada el {format(new Date(current.published_at), "d 'de' MMMM yyyy", { locale: es })}
                </p>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                  {current.markdown}
                </pre>
              </CardContent>
            </Card>
          )}

          {previous.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">Versiones anteriores</h2>
              <div className="space-y-3">
                {previous.map((m) => (
                  <Card key={m.version}>
                    <CardHeader>
                      <CardTitle className="text-base">Versión {m.version}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(m.published_at), "d 'de' MMMM yyyy", { locale: es })}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                        {m.markdown}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MetodologiaBenchmark;
