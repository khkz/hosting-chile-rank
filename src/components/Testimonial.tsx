
import React from 'react';

const Testimonial = () => {
  return (
    <section className="container mx-auto py-16 flex flex-col items-center gap-8 px-4">
      {/* Placeholder for video - would be replaced with actual video component */}
      <div className="rounded-xl w-full max-w-xl shadow-lg bg-gray-200 aspect-video flex items-center justify-center">
        <p className="text-gray-500">Testimonial Video Placeholder</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 grayscale opacity-80 hover:opacity-100 transition">
        <img src="/logo-hostingplus-new.svg" className="h-8" alt="cPanel" />
        <img src="/logo-ecohosting-new.svg" className="h-8" alt="LiteSpeed" />
        <img src="/logo-hostgator.svg" className="h-8" alt="SSL" />
        <img src="/logo-godaddy.svg" className="h-8" alt="JetBackup" />
      </div>
    </section>
  );
};

export default Testimonial;
