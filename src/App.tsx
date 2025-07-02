
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Index from './pages/Index';
import Ranking from './pages/Ranking';
import Comparativa from './pages/Comparativa';
import CotizaHosting from './pages/CotizaHosting';
import WhoisDomain from './pages/WhoisDomain';
import NotFound from './pages/NotFound';
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

// Component to handle redirection from old /whois routes to new /domain routes
const WhoisRedirect = () => {
  const currentPath = window.location.pathname;
  const slug = currentPath.replace('/whois/', '').replace(/\/$/, '');
  return <Navigate to={`/domain/${slug}/`} replace />;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/comparativa" element={<Comparativa />} />
        <Route path="/cotiza-hosting" element={<CotizaHosting />} />
        <Route path="/domain/:slug" element={<WhoisDomain />} />
        <Route path="/whois/:slug" element={<WhoisRedirect />} />
        <Route path="/ultimos-dominios" element={<UltimosDominios />} />
        <Route path="/guia-elegir-hosting" element={<GuiaElegirHosting />} />
        <Route path="/guia-elegir-vps" element={<GuiaElegirVPS />} />
        <Route path="/guia-elegir-servidor-dedicado" element={<GuiaElegirServidorDedicado />} />
        <Route path="/guia-elegir-ssl" element={<GuiaElegirSSL />} />
        <Route path="/reseñas/:slug" element={<Resena />} />
        <Route path="/catalogo/:slug" element={<CatalogoDetalle />} />
        <Route path="/benchmark" element={<Benchmark />} />
        <Route path="/mejor-hosting-chile-2025" element={<MejorHostingChile2025 />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
