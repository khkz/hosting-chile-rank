
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import WhoisRedirect from './components/WhoisRedirect';
import StaticSitemap from './components/StaticSitemap';
import StaticRobots from './components/StaticRobots';
import StaticRSSFeed from './components/StaticRSSFeed';
import Index from './pages/Index';
import Ranking from './pages/Ranking';
import Comparativa from './pages/Comparativa';
import CotizaHosting from './pages/CotizaHosting';
import WhoisDomain from './pages/WhoisDomain';
import { Toaster } from '@/components/ui/toaster';
import UltimosDominios from './pages/UltimosDominios';
import GuiaElegirHosting from './pages/GuiaElegirHosting';
import GuiaElegirVPS from './pages/GuiaElegirVPS';
import GuiaElegirServidorDedicado from './pages/GuiaElegirServidorDedicado';
import GuiaElegirSSL from './pages/GuiaElegirSSL';
import Resena from './pages/Resena';
import CatalogoDetalle from './pages/CatalogoDetalle';
import Benchmark from './pages/Benchmark';
import MejorHostingChile2025 from './pages/MejorHostingChile2025';
import Sitemap from './pages/Sitemap';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster />
      <Routes>
        {/* Rutas para archivos estáticos */}
        <Route path="/sitemap.xml" element={<StaticSitemap />} />
        <Route path="/robots.txt" element={<StaticRobots />} />
        <Route path="/feed/latest-domains.xml" element={<StaticRSSFeed />} />
        
        {/* Rutas normales de la aplicación */}
        <Route path="/" element={<Index />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/comparativa" element={<Comparativa />} />
        <Route path="/cotiza-hosting" element={<CotizaHosting />} />
        <Route path="/domain/:slug" element={<WhoisDomain />} />
        <Route path="/domain/:slug/" element={<WhoisDomain />} />
        
        {/* Rutas de redirección para compatibilidad con URLs antiguas */}
        <Route path="/whois/:slug" element={<WhoisRedirect />} />
        <Route path="/whois/:slug/" element={<WhoisRedirect />} />
        
        <Route path="/ultimos-dominios" element={<UltimosDominios />} />
        <Route path="/guia-elegir-hosting" element={<GuiaElegirHosting />} />
        <Route path="/guia-elegir-vps" element={<GuiaElegirVPS />} />
        <Route path="/guia-elegir-servidor-dedicado" element={<GuiaElegirServidorDedicado />} />
        <Route path="/guia-elegir-ssl" element={<GuiaElegirSSL />} />
        <Route path="/reseñas/:slug" element={<Resena />} />
        <Route path="/catalogo/:slug" element={<CatalogoDetalle />} />
        <Route path="/benchmark" element={<Benchmark />} />
        <Route path="/mejor-hosting-chile-2025" element={<MejorHostingChile2025 />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
