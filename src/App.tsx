
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Routes to be implemented later according to the architecture */}
          <Route path="/comparativa" element={<NotFound />} />
          <Route path="/reseñas/:slug" element={<NotFound />} />
          <Route path="/benchmark" element={<NotFound />} />
          <Route path="/guia-elegir-hosting" element={<NotFound />} />
          <Route path="/cotiza-tu-hosting" element={<NotFound />} />
          <Route path="/vota-por-tu-hosting" element={<NotFound />} />
          <Route path="/contacto" element={<NotFound />} />
          <Route path="/blog" element={<NotFound />} />
          <Route path="/blog/:slug" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
