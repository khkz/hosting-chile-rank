
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import HostingVsPage from './pages/HostingVsPage';
import Catalogo from './pages/Catalogo';
import CatalogoDetalle from './pages/CatalogoDetalle';
import Resena from './pages/Resena';

function App() {
  return (
    <>
      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/comparativa" element={<Comparativa />} />
          <Route path="/comparativa/hostingplus-vs/:slug" element={<HostingVsPage />} />
          <Route path="/comparativa/:slug" element={<CatalogoDetalle />} />
          <Route path="/cotiza-hosting" element={<CotizaHosting />} />
          <Route path="/whois/:slug" element={<WhoisDomain />} />
          <Route path="/ultimos-dominios" element={<UltimosDominios />} />
          <Route path="/guia-elegir-hosting" element={<GuiaElegirHosting />} />
          <Route path="/guia-elegir-vps" element={<GuiaElegirVPS />} />
          <Route path="/guia-elegir-servidor-dedicado" element={<GuiaElegirServidorDedicado />} />
          <Route path="/guia-elegir-ssl" element={<GuiaElegirSSL />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:slug" element={<CatalogoDetalle />} />
          <Route path="/resena/:slug" element={<Resena />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
