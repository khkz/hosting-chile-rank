import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Ranking from '@/pages/Ranking';
import Catalogo from '@/pages/Catalogo';
import CatalogoDetalle from '@/pages/CatalogoDetalle';
import Comparativa from '@/pages/Comparativa';
import Resena from '@/pages/Resena';
import Benchmark from '@/pages/Benchmark';
import GuiaElegirHosting from '@/pages/GuiaElegirHosting';
import VotaHosting from '@/pages/VotaHosting';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import CotizaHosting from '@/pages/CotizaHosting';
import Contacto from '@/pages/Contacto';
import WhoisDomain from '@/pages/WhoisDomain';
import UltimosDominios from '@/pages/UltimosDominios';
import NotFound from '@/pages/NotFound';
import { Toaster } from "@/components/ui/toaster"
import './App.css';
import WebHosting from '@/pages/WebHosting';
import VpsHosting from '@/pages/VpsHosting';
import ServidoresDedicados from '@/pages/ServidoresDedicados';
import ResellerHosting from '@/pages/ResellerHosting';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App bg-[#F7F9FC]">
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/web-hosting" element={<WebHosting />} />
          <Route path="/vps-hosting" element={<VpsHosting />} />
          <Route path="/servidores-dedicados" element={<ServidoresDedicados />} />
          <Route path="/reseller-hosting" element={<ResellerHosting />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:id" element={<CatalogoDetalle />} />
          <Route path="/comparativa" element={<Comparativa />} />
          <Route path="/resena/:id" element={<Resena />} />
          <Route path="/benchmark" element={<Benchmark />} />
          <Route path="/guia-elegir-hosting" element={<GuiaElegirHosting />} />
          <Route path="/vota-hosting" element={<VotaHosting />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/cotiza-hosting" element={<CotizaHosting />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/whois/:domain" element={<WhoisDomain />} />
          <Route path="/ultimos-dominios" element={<UltimosDominios />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

