
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogClose 
} from "@/components/ui/dialog";

const Hero = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [domainInfo, setDomainInfo] = useState({
    domain: '',
    ip: '',
    nameservers: '',
    location: '',
    isChile: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const domain = formData.get('domain')?.toString().trim().toLowerCase();
    
    if (!domain) return;
    
    setIsLoading(true);
    
    try {
      // Consulta IP via Google DNS
      const aRes = await fetch(`https://dns.google/resolve?name=${domain}&type=A`).then(r => r.json());
      const ip = aRes.Answer ? aRes.Answer[0].data : '–';
      
      // Consulta NS
      const nsRes = await fetch(`https://dns.google/resolve?name=${domain}&type=NS`).then(r => r.json());
      const ns = nsRes.Answer ? nsRes.Answer.map((x: any) => x.data).join('\n') : '–';
      
      // Geo IP (ipapi.co)
      const geo = ip !== '–' ? await fetch(`https://ipapi.co/${ip}/country_name/`).then(r => r.text()) : '–';
      
      setDomainInfo({
        domain,
        ip,
        nameservers: ns,
        location: geo,
        isChile: geo.includes('Chile')
      });
      
      setIsOpen(true);
    } catch (error) {
      console.error('Error fetching domain information:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* section 1: Hero with domain search */}
      <section className="py-20 text-center bg-[#F7F9FC]">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42]">Mejor Hosting Chileno 2025</h1>
          <p className="mt-4 text-lg text-[#555] max-w-2xl mx-auto">
            Análisis de velocidad, soporte, seguridad y precio.
            Obtenga información sobre IP chilena, nameservers y una vista previa de cualquier dominio.
          </p>
          
          {/* Domain search box */}
          <form 
            onSubmit={handleSubmit} 
            className="relative w-full max-w-lg mx-auto mt-8"
          >
            <Input
              type="text"
              name="domain"
              required
              placeholder="midominio.cl"
              className="w-full rounded-full px-6 py-3 pr-14 outline-none text-[#2B2D42]"
            />
            <Button 
              type="submit"
              disabled={isLoading}
              aria-label="Buscar dominio" 
              className="absolute right-1.5 top-1.5 bg-[#EF233C] hover:bg-[#b3001b] text-white rounded-full p-2 h-auto"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
          
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              asChild
              className="inline-block bg-[#EF233C] text-white px-6 py-3 rounded-lg transition hover:bg-red-700"
            >
              <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener noreferrer">
                Contratar HostingPlus
                <span className="ml-2 text-xs font-medium text-white/80">(desde $4 158 CLP/mes)</span>
              </a>
            </Button>
            
            <a href="#ranking" className="text-[#2B2D42] underline text-sm hover:text-[#EF233C]">
              Ver ranking completo
            </a>
          </div>
          
          {/* Trust bar */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <img src="/logo-visa.svg" alt="Visa" className="h-5" />
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
              <Check className="h-3 w-3" />0 reclamos
            </span>
          </div>
          
          {/* Price hint - already implemented */}
          <p className="mt-3 text-sm text-[#555]">
            <span className="font-medium">Desde $4.000 CLP/mes</span> con 30 días de garantía
          </p>
        </div>
      </section>
      
      {/* Domain info dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-blue-700 text-xl font-bold">
              {domainInfo.domain}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Información del dominio
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <dl className="text-sm space-y-1">
              <div>
                <dt className="font-medium inline">Dirección IP: </dt>
                <dd className="ml-1 inline">{domainInfo.ip}</dd>
              </div>
              <div>
                <dt className="font-medium">Nameservers: </dt>
                <dd className="ml-1 leading-tight whitespace-pre-wrap">{domainInfo.nameservers}</dd>
              </div>
              <div>
                <dt className="font-medium inline">Ubicación IP: </dt>
                <dd className="ml-1 inline">
                  {domainInfo.isChile ? '🇨🇱 Chile' : `🌐 ${domainInfo.location}`}
                </dd>
              </div>
            </dl>
            <div>
              {domainInfo.domain && (
                <img 
                  src={`https://image.thum.io/get/png/noanimate/width/300/${domainInfo.domain}`}
                  className="rounded shadow w-full h-auto"
                  alt="Preview del sitio"
                />
              )}
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Hero;
