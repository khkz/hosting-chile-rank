
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Comparativa from "./pages/Comparativa";
import Resena from "./pages/Resena";
import Benchmark from "./pages/Benchmark";
import GuiaElegirHosting from "./pages/GuiaElegirHosting";
import CotizaHosting from "./pages/CotizaHosting";
import VotaHosting from "./pages/VotaHosting";
import Contacto from "./pages/Contacto";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/comparativa" element={<Comparativa />} />
          <Route path="/reseñas/:slug" element={<Resena />} />
          <Route path="/benchmark" element={<Benchmark />} />
          <Route path="/guia-elegir-hosting" element={<GuiaElegirHosting />} />
          <Route path="/cotiza-tu-hosting" element={<CotizaHosting />} />
          <Route path="/vota-por-tu-hosting" element={<VotaHosting />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
