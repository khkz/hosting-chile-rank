
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ExitModal = () => {
  const [open, setOpen] = useState(false);

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md text-center space-y-5">
        <DialogHeader>
          <DialogTitle className="text-2xl">¡Antes de irte! 🎁</DialogTitle>
        </DialogHeader>

        <p>
          Usa el cupón <span className="font-mono bg-gray-100 px-2 py-1 rounded">EXIT20</span> y
          obtén <span className="font-semibold text-red-600">20 % de descuento</span> en tu contrato
          anual de HostingPlus. Válido por 24 h.
        </p>

        <Button className="w-full bg-[#EF233C]" onClick={() => (window.location.href = WHMCS_URL)}>
          Ir al carrito y aplicar descuento
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ExitModal;
