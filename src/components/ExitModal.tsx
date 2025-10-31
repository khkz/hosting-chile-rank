import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

const ExitModal = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'quiz' | 'offer'>('quiz');
  const [projectType, setProjectType] = useState<string>('');

  useEffect(() => {
    const KEY = "exitIntentSeen";

    // Desactivar si está embebido en un iframe (p.ej., vista previa del editor)
    const inIframe = (() => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    })();
    if (inIframe) return;

    if (localStorage.getItem(KEY)) return;

    // Armado con retardo de 5s para evitar disparos tempranos
    let armed = false;
    const armTimeout = window.setTimeout(() => {
      armed = true;
    }, 5000);

    function triggerOpen() {
      setOpen(true);
      localStorage.setItem(KEY, "1");
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(armTimeout);
    }

    // Desktop: usar pointerout + relatedTarget null + clientY <= 0
    function onPointerOut(e: PointerEvent) {
      if (!armed) return;
      const target = e.relatedTarget as Node | null;
      if (!target && e.clientY <= 0) {
        triggerOpen();
      }
    }

    // Mobile: requerir scroll > 300px y luego "flick" hacia arriba > 200px en < 300ms
    let scrolledDown = window.scrollY > 300;
    let lastY = window.scrollY;
    let lastT = performance.now();

    function onScroll() {
      if (!armed) return;
      const y = window.scrollY;
      if (y > 300) scrolledDown = true;

      const now = performance.now();
      const dy = lastY - y; // positivo cuando se desplaza hacia arriba
      const dt = now - lastT;

      if (scrolledDown && dy >= 200 && dt <= 300) {
        triggerOpen();
        return;
      }

      lastY = y;
      lastT = now;
    }

    document.addEventListener("pointerout", onPointerOut);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(armTimeout);
    };
  }, []);

  const WHMCS_URL =
    "https://clientes.hostingplus.cl/cart.php?gid=13&promocode=EXIT20";

  const handleQuizSubmit = () => {
    if (projectType) {
      setStep('offer');
    }
  };

  const getDiscountForProject = () => {
    switch(projectType) {
      case 'wordpress': return '25% OFF en Hosting WordPress';
      case 'ecommerce': return '30% OFF en Hosting E-commerce';
      case 'empresa': return '20% OFF en cualquier plan anual';
      default: return '20% OFF en tu primer año';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md space-y-5">
        {step === 'quiz' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">¡Espera un momento! 🤔</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                Ayúdanos a entender tu proyecto para ofrecerte el mejor descuento:
              </p>

              <RadioGroup value={projectType} onValueChange={setProjectType}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="wordpress" id="wordpress" />
                  <Label htmlFor="wordpress" className="flex-1 cursor-pointer">
                    Sitio WordPress / Blog
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="ecommerce" id="ecommerce" />
                  <Label htmlFor="ecommerce" className="flex-1 cursor-pointer">
                    Tienda Online / E-commerce
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="empresa" id="empresa" />
                  <Label htmlFor="empresa" className="flex-1 cursor-pointer">
                    Sitio Corporativo / Empresa
                  </Label>
                </div>
              </RadioGroup>

              <Button 
                onClick={handleQuizSubmit}
                disabled={!projectType}
                className="w-full"
              >
                Ver mi descuento exclusivo
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">¡Tu descuento exclusivo! 🎁</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-center">
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {getDiscountForProject()}
                </p>
              </div>

              <p>
                Usa el cupón{' '}
                <span className="font-mono bg-muted px-2 py-1 rounded font-bold">
                  EXIT{projectType === 'ecommerce' ? '30' : projectType === 'wordpress' ? '25' : '20'}
                </span>
              </p>

              <ul className="text-sm space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Migración gratuita incluida</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>30 días garantía de devolución</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Soporte técnico 24/7</span>
                </li>
              </ul>

              <Button 
                className="w-full"
                onClick={() => window.location.href = WHMCS_URL}
              >
                Ir al carrito y aplicar descuento
              </Button>

              <p className="text-xs text-muted-foreground">
                Válido por las próximas 24 horas
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExitModal;
