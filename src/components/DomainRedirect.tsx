import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DomainRedirect: React.FC = () => {
  useEffect(() => {
    try {
      const isInIframe = window.self !== window.top;
      const isLovablePreview = window.location.search.includes('__lovable_token');
      if (isInIframe || isLovablePreview) return;

      const targetDomain = 'eligetuhosting.cl';
      const currentHost = window.location.host;

      // If we're already on the target domain, do nothing
      if (currentHost.includes(targetDomain)) return;

      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const redirectUrl = `https://${targetDomain}${currentPath}${currentSearch}${window.location.hash || ''}`;

      const currentHref = window.location.href;
      if (redirectUrl === currentHref) return;

      // Redirect to the canonical domain
      window.location.href = redirectUrl;

      // Fire-and-forget ping for logging (does not affect redirect)
      void supabase.functions.invoke('domain-redirect', {
        body: { path: currentPath, search: currentSearch }
      }).catch(() => {});
    } catch (error) {
      console.error('Error in domain redirect check:', error);
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default DomainRedirect;