
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ExitModal = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [hasLeftPage, setHasLeftPage] = useState(false);
  
  useEffect(() => {
    // Only trigger for desktop users and only once
    if (window.innerWidth >= 768 && !hasLeftPage) {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY < 0) {
          setOpen(true);
          setHasLeftPage(true);
        }
      };
      
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, [hasLeftPage]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    console.log('Submitted email:', email);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">¡Hey! 15 % OFF en tu primer año</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-[#555]">Déjanos tu correo y recibe el cupón.</p>
          <Input
            type="email"
            placeholder="tu@email.cl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            className="w-full bg-[#EF233C]"
          >
            Obtener cupón
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExitModal;
