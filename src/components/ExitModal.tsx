
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ExitModal = () => {
  const [open, setOpen] = useState(false);

  /* Detectar intención de salida (desktop + mobile) */
  useEffect(() => {
    const KEY = "exitIntentSeen";
    if (localStorage.getItem(KEY)) return;

    const leave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setOpen(true);
        localStorage.setItem(KEY, "1");
        document.removeEventListener("mouseout", leave);
      }
    };
    const scrollUpFast = () => {
      if ((window as any).oldScroll && (window as any).oldScroll - window.scrollY > 120) {
        setOpen(true);
        localStorage.setItem(KEY, "1");
        window.removeEventListener("scroll", scrollUpFast);
      }
      (window as any).oldScroll = window.scrollY;
    };

    document.addEventListener("mouseout", leave);
    window.addEventListener("scroll", scrollUpFast, { passive: true });
    return () => {
      document.removeEventListener("mouseout", leave);
      window.removeEventListener("scroll", scrollUpFast);
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
