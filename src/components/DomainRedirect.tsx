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

      // Only redirect if we are on a KNOWN non-target production domain.
      // If the host is anything other than a recognizable production alias,
      // do nothing (safe for Lovable editor, preview, localhost, etc.).
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