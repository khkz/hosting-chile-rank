import { useEffect } from 'react';
import { COM_SLUGS } from '@/lib/countries';

// Rutas que viven en eligetuhosting.com: ediciones por país y el índice LATAM.
const COM_PATH_RE = new RegExp(`^/(${[...COM_SLUGS, 'latam'].join('|')})(/|$)`, 'i');

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

      // 0) Cross-domain: en el .cl, las ediciones por país (/pe, /mx… y las
      //    que estén en verificación) y el índice /latam viven en el .com.
      const isCl = currentHost === targetDomain || currentHost === `www.${targetDomain}`;
      if (isCl && COM_PATH_RE.test(currentPath)) {
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

      window.location.replace(
        `https://${targetDomain}${currentPath}${currentSearch}${currentHash}`
      );
    } catch (error) {
      console.error('Error in domain redirect check:', error);
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default DomainRedirect;