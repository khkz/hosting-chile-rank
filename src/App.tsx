
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Comparativa from "./pages/Comparativa";
import Resena from "./pages/Resena";
import Benchmark from "./pages/Benchmark";
import GuiaElegirHosting from "./pages/GuiaElegirHosting";
import CotizaHosting from "./pages/CotizaHosting";
import VotaHosting from "./pages/VotaHosting";
import Contacto from "./pages/Contacto";
import Catalogo from "./pages/Catalogo";
import CatalogoDetalle from "./pages/CatalogoDetalle";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Ranking from "./pages/Ranking";
import WhoisDomain from "./pages/WhoisDomain";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/:slug" element={<CatalogoDetalle />} />
            <Route path="/comparativa" element={<Comparativa />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/cotiza-hosting" element={<CotizaHosting />} />
            <Route path="/guia-elegir-hosting" element={<GuiaElegirHosting />} />
            <Route path="/benchmark" element={<Benchmark />} />
            <Route path="/vota-hosting" element={<VotaHosting />} />
            <Route path="/resena/:slug" element={<Resena />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/whois/:slug" element={<WhoisDomain />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
