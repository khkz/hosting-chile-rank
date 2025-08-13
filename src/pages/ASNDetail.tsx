import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { getASNDetails, estimatePrefixSize, normalizeASN } from '@/services/asnApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const ASNDetail: React.FC = () => {
  const { asn: asnParam } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Awaited<ReturnType<typeof getASNDetails>> | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!asnParam) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getASNDetails(asnParam);
        setData(res);
      } catch (e: any) {
        setError(e?.message || 'Error al cargar datos del ASN');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [asnParam]);

  const asnNum = useMemo(() => normalizeASN(asnParam || '') || 0, [asnParam]);
  const pageTitle = data ? `AS${data.overview.asn} ${data.overview.name || ''} – Prefijos IP y Peers` : `AS${asnNum} – ASN`;
  const canonical = `${window.location.origin}/asn/AS${asnNum}`;

  const chartData = useMemo(() => {
    if (!data) return [];
    const rows = data.ipv4_prefixes.map((p) => ({
      prefix: p.prefix,
      size: estimatePrefixSize(p.prefix),
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);
    return rows;
  }, [data]);

  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Detalle del ASN AS${asnNum}: prefijos IPv4/IPv6, tamaño de rangos y peers.`} />
        <link rel="canonical" href={canonical} />
        <meta httpEquiv="content-language" content="es-CL" />
        <link rel="alternate" hrefLang="es-cl" href={canonical} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={`Prefijos IP y relaciones de AS${asnNum}.`} />
        <meta property="og:url" content={canonical} />
        {data && (
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            url: canonical,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${window.location.origin}/` },
                { '@type': 'ListItem', position: 2, name: 'ASN', item: `${window.location.origin}/asn` },
                { '@type': 'ListItem', position: 3, name: `AS${data.overview.asn}` },
              ]
            }
          })}</script>
        )}
      </Helmet>

      <SEOBreadcrumbs items={[{ name: 'ASN', href: '/asn' }]} pageName={`AS${asnNum}`} />

      {loading && (
        <div className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Cargando datos del ASN…</div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data && (
        <section className="space-y-6">
          <header>
            <h1 className="text-3xl font-bold">AS{data.overview.asn} {data.overview.name}</h1>
            <p className="text-muted-foreground mt-2">{data.overview.description || 'Proveedor de red / Sistema autónomo'}</p>
            {data.overview.country_code && (
              <p className="text-xs mt-1">País base: {data.overview.country_code}</p>
            )}
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Top 10 rangos IPv4 por tamaño</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="prefix" hide />
                  <YAxis tickFormatter={(v) => Intl.NumberFormat('es-CL').format(v)} width={80} />
                  <Tooltip formatter={(v: any) => Intl.NumberFormat('es-CL').format(v as number)} labelFormatter={() => ''} />
                  <Bar dataKey="size" name="IPs" fill="#EF233C" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Tabs defaultValue="ipv4">
            <TabsList>
              <TabsTrigger value="ipv4">Prefijos IPv4 ({data.ipv4_prefixes.length})</TabsTrigger>
              <TabsTrigger value="ipv6">Prefijos IPv6 ({data.ipv6_prefixes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="ipv4">
              <Card>
                <CardHeader>
                  <CardTitle>Prefijos IPv4</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Prefijo</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>País</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.ipv4_prefixes.slice(0, 100).map((p, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{p.prefix}</TableCell>
                          <TableCell className="max-w-[480px] truncate" title={p.description || ''}>{p.description || '-'}</TableCell>
                          <TableCell>{p.country_code || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {data.ipv4_prefixes.length > 100 && (
                    <p className="text-xs text-muted-foreground mt-2">Mostrando primeros 100 prefijos.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ipv6">
              <Card>
                <CardHeader>
                  <CardTitle>Prefijos IPv6</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Prefijo</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>País</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.ipv6_prefixes.slice(0, 100).map((p, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{p.prefix}</TableCell>
                          <TableCell className="max-w-[480px] truncate" title={p.description || ''}>{p.description || '-'}</TableCell>
                          <TableCell>{p.country_code || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {data.ipv6_prefixes.length > 100 && (
                    <p className="text-xs text-muted-foreground mt-2">Mostrando primeros 100 prefijos.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {data.peers && data.peers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Peers (vínculos)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                  {data.peers.slice(0, 24).map((p) => (
                    <li key={p.asn}>
                      <Link to={`/asn/AS${p.asn}`} className="hover:underline">AS{p.asn} {p.name || ''}</Link>
                    </li>
                  ))}
                </ul>
                {data.peers.length > 24 && (
                  <p className="text-xs text-muted-foreground mt-2">Mostrando primeros 24 peers.</p>
                )}
              </CardContent>
            </Card>
          )}
        </section>
      )}
    </main>
  );
};

export default ASNDetail;
