import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Building2, Search, Edit, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminCompanies() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: companies, isLoading, refetch } = useQuery({
    queryKey: ['admin-companies'],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('*')
        .order('name');
      return data;
    },
  });

  const toggleVerified = async (companyId: string, currentStatus: boolean) => {
    await supabase
      .from('hosting_companies')
      .update({ is_verified: !currentStatus })
      .eq('id', companyId);
    refetch();
  };

  const toggleFeatured = async (companyId: string, currentStatus: boolean) => {
    await supabase
      .from('hosting_companies')
      .update({ is_featured: !currentStatus })
      .eq('id', companyId);
    refetch();
  };

  const filteredCompanies = companies?.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gestión de Empresas</h1>
              <p className="text-muted-foreground">
                {companies?.length || 0} empresas registradas
              </p>
            </div>
            <Link to="/admin/dashboard">
              <Button variant="outline">Volver al Dashboard</Button>
            </Link>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Companies List */}
          <div className="space-y-4">
            {filteredCompanies?.map((company) => (
              <Card key={company.id} className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={company.logo_url || '/placeholder.svg'}
                    alt={company.name}
                    className="w-16 h-16 object-contain"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{company.name}</h3>
                      {company.is_verified && (
                        <Badge variant="secondary">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verificada
                        </Badge>
                      )}
                      {company.is_featured && (
                        <Badge className="bg-yellow-500">
                          Destacada
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {company.description?.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Rating:</span> {company.overall_rating || 'N/A'}
                      </div>
                      <div>
                        <span className="font-semibold">Reviews:</span> {company.total_reviews || 0}
                      </div>
                      <div>
                        <span className="font-semibold">Fundada:</span> {company.year_founded || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVerified(company.id, company.is_verified || false)}
                    >
                      {company.is_verified ? <XCircle className="h-4 w-4 mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                      {company.is_verified ? 'Desverificar' : 'Verificar'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFeatured(company.id, company.is_featured || false)}
                    >
                      {company.is_featured ? 'Quitar Destacado' : 'Destacar'}
                    </Button>

                    <Link to={`/catalogo/${company.slug}`}>
                      <Button variant="ghost" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-1" />
                        Ver Perfil
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {!isLoading && filteredCompanies?.length === 0 && (
            <Card className="p-12 text-center">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No se encontraron empresas</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Aún no hay empresas registradas'}
              </p>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
