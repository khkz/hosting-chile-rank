import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Building2, 
  Search, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Image,
  Edit2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Server,
  Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface CompanyFormData {
  name: string;
  slug: string;
  description: string;
  website: string;
  logo_url: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  contact_hours: string;
  datacenter_location: string;
  year_founded: number | null;
  technologies: string[];
  social_media: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

const commonTechnologies = [
  'cPanel', 'Plesk', 'DirectAdmin',
  'LiteSpeed', 'Apache', 'Nginx',
  'SSD NVMe', 'SSD', 'CloudLinux',
  'CentOS', 'Ubuntu', 'SSL Gratis',
  'WordPress Optimizado', 'Backup Automático'
];

export default function AdminCompanies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLogo, setEditingLogo] = useState<{ id: string; currentUrl: string; name: string } | null>(null);
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    slug: '',
    description: '',
    website: '',
    logo_url: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    contact_hours: '',
    datacenter_location: '',
    year_founded: null,
    technologies: [],
    social_media: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    }
  });

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

  const updateLogo = async () => {
    if (!editingLogo || !newLogoUrl.trim()) {
      toast.error('Debes ingresar una URL válida');
      return;
    }

    const { error } = await supabase
      .from('hosting_companies')
      .update({ logo_url: newLogoUrl })
      .eq('id', editingLogo.id);

    if (error) {
      toast.error('Error actualizando logo');
    } else {
      toast.success('Logo actualizado correctamente');
      setEditingLogo(null);
      setNewLogoUrl('');
      refetch();
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleEditClick = (company: any) => {
    setEditingCompany(company);
    setFormData({
      name: company.name || '',
      slug: company.slug || '',
      description: company.description || '',
      website: company.website || '',
      logo_url: company.logo_url || '',
      contact_email: company.contact_email || '',
      contact_phone: company.contact_phone || '',
      contact_address: company.contact_address || '',
      contact_hours: company.contact_hours || '',
      datacenter_location: company.datacenter_location || '',
      year_founded: company.year_founded || null,
      technologies: (company.technologies as string[]) || [],
      social_media: {
        facebook: company.social_media?.facebook || '',
        twitter: company.social_media?.twitter || '',
        instagram: company.social_media?.instagram || '',
        linkedin: company.social_media?.linkedin || '',
        youtube: company.social_media?.youtube || ''
      }
    });
  };

  const toggleTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech]
    }));
  };

  const updateSocialMedia = (platform: string, url: string) => {
    setFormData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: url
      }
    }));
  };

  const handleSaveCompany = async () => {
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      toast.error('El nombre debe tener al menos 2 caracteres');
      return;
    }
    
    if (!formData.description.trim() || formData.description.trim().length < 50) {
      toast.error('La descripción debe tener al menos 50 caracteres');
      return;
    }
    
    const urlPattern = /^https?:\/\/.+/;
    if (formData.website && !urlPattern.test(formData.website)) {
      toast.error('El website debe ser una URL válida (http:// o https://)');
      return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contact_email && !emailPattern.test(formData.contact_email)) {
      toast.error('El email no tiene un formato válido');
      return;
    }
    
    const currentYear = new Date().getFullYear();
    if (formData.year_founded && (formData.year_founded < 1990 || formData.year_founded > currentYear)) {
      toast.error(`El año de fundación debe estar entre 1990 y ${currentYear}`);
      return;
    }
    
    const socialUrls = Object.values(formData.social_media).filter(url => url);
    for (const url of socialUrls) {
      if (!urlPattern.test(url)) {
        toast.error('Las URLs de redes sociales deben ser válidas (http:// o https://)');
        return;
      }
    }
    
    const { error } = await supabase
      .from('hosting_companies')
      .update({
        name: formData.name.trim(),
        slug: formData.slug,
        description: formData.description.trim(),
        website: formData.website,
        logo_url: formData.logo_url,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        contact_address: formData.contact_address,
        contact_hours: formData.contact_hours,
        datacenter_location: formData.datacenter_location,
        year_founded: formData.year_founded,
        technologies: formData.technologies,
        social_media: formData.social_media as any
      })
      .eq('id', editingCompany.id);
    
    if (error) {
      toast.error('Error al actualizar la empresa: ' + error.message);
    } else {
      toast.success('Empresa actualizada correctamente');
      setEditingCompany(null);
      refetch();
    }
  };

  useEffect(() => {
    if (editingCompany && formData.name) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.name)
      }));
    }
  }, [formData.name, editingCompany]);

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
                    <Dialog open={editingLogo?.id === company.id} onOpenChange={(open) => {
                      if (!open) {
                        setEditingLogo(null);
                        setNewLogoUrl('');
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingLogo({
                              id: company.id,
                              currentUrl: company.logo_url || '',
                              name: company.name
                            });
                            setNewLogoUrl(company.logo_url || '');
                          }}
                        >
                          <Image className="h-4 w-4 mr-1" />
                          Cambiar Logo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Actualizar Logo de {company.name}</DialogTitle>
                          <DialogDescription>
                            Ingresa la URL del nuevo logo. Puedes usar logos desde /public o URLs externas.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                            <img
                              src={newLogoUrl || company.logo_url || '/placeholder.svg'}
                              alt="Preview"
                              className="max-h-32 object-contain"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="logo-url">URL del Logo</Label>
                            <Input
                              id="logo-url"
                              placeholder="/logo-empresa.svg o https://..."
                              value={newLogoUrl}
                              onChange={(e) => setNewLogoUrl(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Ejemplos: /logo-hostingplus.svg, https://ejemplo.com/logo.png
                            </p>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => {
                            setEditingLogo(null);
                            setNewLogoUrl('');
                          }}>
                            Cancelar
                          </Button>
                          <Button onClick={updateLogo}>
                            Actualizar Logo
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={editingCompany?.id === company.id} onOpenChange={(open) => {
                      if (!open) setEditingCompany(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(company)}
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Editar Empresa
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>Editar Empresa: {company.name}</DialogTitle>
                          <DialogDescription>
                            Modifica la información de la empresa. Los campos marcados son obligatorios.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <ScrollArea className="h-[60vh] pr-4">
                          <div className="space-y-6">
                            {/* Información Básica */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Información Básica
                              </h3>
                              
                              <div className="space-y-2">
                                <Label htmlFor="name">Nombre *</Label>
                                <Input
                                  id="name"
                                  value={formData.name}
                                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                  placeholder="Nombre de la empresa"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="slug">Slug (auto-generado)</Label>
                                <Input
                                  id="slug"
                                  value={formData.slug}
                                  readOnly
                                  className="bg-muted"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="description">Descripción *</Label>
                                <Textarea
                                  id="description"
                                  value={formData.description}
                                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                  placeholder="Descripción de la empresa (mínimo 50 caracteres)"
                                  rows={4}
                                />
                                <p className="text-xs text-muted-foreground">
                                  {formData.description.length} / 50 caracteres mínimos
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="logo_url">URL del Logo</Label>
                                <Input
                                  id="logo_url"
                                  value={formData.logo_url}
                                  onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                                  placeholder="/logo-empresa.svg"
                                />
                                <div className="flex justify-center p-4 bg-muted rounded-lg">
                                  <img
                                    src={formData.logo_url || '/placeholder.svg'}
                                    alt="Preview"
                                    className="max-h-24 object-contain"
                                    onError={(e) => {
                                      e.currentTarget.src = '/placeholder.svg';
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Presencia Online */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Presencia Online
                              </h3>

                              <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                  id="website"
                                  value={formData.website}
                                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                                  placeholder="https://ejemplo.cl"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="facebook" className="flex items-center gap-2">
                                    <Facebook className="h-4 w-4" />
                                    Facebook
                                  </Label>
                                  <Input
                                    id="facebook"
                                    value={formData.social_media.facebook}
                                    onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                                    placeholder="https://facebook.com/..."
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="twitter" className="flex items-center gap-2">
                                    <Twitter className="h-4 w-4" />
                                    Twitter/X
                                  </Label>
                                  <Input
                                    id="twitter"
                                    value={formData.social_media.twitter}
                                    onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                                    placeholder="https://twitter.com/..."
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="instagram" className="flex items-center gap-2">
                                    <Instagram className="h-4 w-4" />
                                    Instagram
                                  </Label>
                                  <Input
                                    id="instagram"
                                    value={formData.social_media.instagram}
                                    onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                                    placeholder="https://instagram.com/..."
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                                    <Linkedin className="h-4 w-4" />
                                    LinkedIn
                                  </Label>
                                  <Input
                                    id="linkedin"
                                    value={formData.social_media.linkedin}
                                    onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                                    placeholder="https://linkedin.com/..."
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="youtube" className="flex items-center gap-2">
                                    <Youtube className="h-4 w-4" />
                                    YouTube
                                  </Label>
                                  <Input
                                    id="youtube"
                                    value={formData.social_media.youtube}
                                    onChange={(e) => updateSocialMedia('youtube', e.target.value)}
                                    placeholder="https://youtube.com/..."
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Información de Contacto */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                Información de Contacto
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="contact_email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email
                                  </Label>
                                  <Input
                                    id="contact_email"
                                    type="email"
                                    value={formData.contact_email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                                    placeholder="contacto@empresa.cl"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="contact_phone" className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Teléfono
                                  </Label>
                                  <Input
                                    id="contact_phone"
                                    value={formData.contact_phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                                    placeholder="+56 2 2345 6789"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="contact_address" className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  Dirección
                                </Label>
                                <Textarea
                                  id="contact_address"
                                  value={formData.contact_address}
                                  onChange={(e) => setFormData(prev => ({ ...prev, contact_address: e.target.value }))}
                                  placeholder="Dirección física de la empresa"
                                  rows={2}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="contact_hours" className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  Horarios de Atención
                                </Label>
                                <Input
                                  id="contact_hours"
                                  value={formData.contact_hours}
                                  onChange={(e) => setFormData(prev => ({ ...prev, contact_hours: e.target.value }))}
                                  placeholder="Lun-Vie 9:00-18:00"
                                />
                              </div>
                            </div>

                            {/* Tecnologías */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Server className="h-5 w-5" />
                                Tecnologías y Características
                              </h3>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {commonTechnologies.map((tech) => (
                                  <div key={tech} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={tech}
                                      checked={formData.technologies.includes(tech)}
                                      onCheckedChange={() => toggleTechnology(tech)}
                                    />
                                    <label
                                      htmlFor={tech}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                      {tech}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Datos Adicionales */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Datos Adicionales
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="datacenter_location">Ubicación del Datacenter</Label>
                                  <Select
                                    value={formData.datacenter_location}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, datacenter_location: value }))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecciona ubicación" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Chile">Chile</SelectItem>
                                      <SelectItem value="USA">USA</SelectItem>
                                      <SelectItem value="Europa">Europa</SelectItem>
                                      <SelectItem value="Global">Global</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="year_founded" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Año de Fundación
                                  </Label>
                                  <Input
                                    id="year_founded"
                                    type="number"
                                    min="1990"
                                    max={new Date().getFullYear()}
                                    value={formData.year_founded || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, year_founded: e.target.value ? parseInt(e.target.value) : null }))}
                                    placeholder="2005"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </ScrollArea>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingCompany(null)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveCompany}>
                            Guardar Cambios
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

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
