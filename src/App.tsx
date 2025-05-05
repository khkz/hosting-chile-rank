import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Ranking from './pages/Ranking';
import Comparativa from './pages/Comparativa';
import Blog from './pages/Blog';
import CotizaHosting from './pages/CotizaHosting';
import WhoisDomain from './pages/WhoisDomain';
import { Toaster } from '@/components/ui/toaster';
import UltimosDominios from './pages/UltimosDominios';

function App() {
  return (
    <>
      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/comparativa" element={<Comparativa />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/cotiza-hosting" element={<CotizaHosting />} />
          <Route path="/whois/:slug" element={<WhoisDomain />} />
          <Route path="/ultimos-dominios" element={<UltimosDominios />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
