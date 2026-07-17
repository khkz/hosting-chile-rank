import { useEffect } from 'react';

const DomainRedirect = () => {
  useEffect(() => {
    try {
      let isInIframe = false;
      try {
        isInIframe = window.self !== window.top;
      } catch {
        isInIframe = true; // cross-origin iframe
      }

      // Never redirect inside any iframe (Lovable editor, embedding, etc.)
      if (isInIframe) return;

      const currentHost = window.location.host.toLowerCase();
      const targetDomain = 'eligetuhosting.cl';
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const currentHash = window.location.hash || '';

      // 0) Cross-domain: if we're on .cl but the path is a LATAM country
      //    (/pe, /mx, /co, /ar y subrutas) → redirigir a .com que es donde vive ese contenido.
      const isCl = currentHost === targetDomain || currentHost === `www.${targetDomain}`;
      if (isCl && /^\/(pe|mx|co|ar)(\/|$)/.test(currentPath)) {
        window.location.replace(
          `https://eligetuhosting.com${currentPath}${currentSearch}${currentHash}`
        );
        return;
      }

      // 1) Redirect www.eligetuhosting.cl → eligetuhosting.cl (canonical no-www)
      if (currentHost === `www.${targetDomain}`) {
        window.location.replace(
          `https://${targetDomain}${currentPath}${currentSearch}${currentHash}`
        );
        return;
      }

      // 2) Si ya estamos en el dominio canonical, nada que hacer.
      if (currentHost.includes(targetDomain)) return;


      // Whitelist: only redirect from known production aliases
      const productionAliases = [
        'hosting-chile-rank.lovable.app', // published Lovable URL
      ];

      const isKnownProductionAlias = productionAliases.some(alias =>
        currentHost === alias
      );

      // If NOT a known production alias, do nothing (dev/preview/editor/localhost)
      if (!isKnownProductionAlias) return;

      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      window.location.replace(
        `https://${targetDomain}${currentPath}${currentSearch}${window.location.hash || ''}`
      );
    } catch (error) {
      console.error('Error in domain redirect check:', error);
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default DomainRedirect;