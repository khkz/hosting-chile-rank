import React, { useEffect } from 'react';

const DomainRedirect: React.FC = () => {
  useEffect(() => {
    try {
      const isInIframe = window.self !== window.top;
      const isLovablePreview = window.location.search.includes('__lovable_token');
      const targetDomain = 'eligetuhosting.cl';
      const currentHost = window.location.host.toLowerCase();
      const isPreviewOrDevHost =
        currentHost.includes('lovable.app') ||
        currentHost.startsWith('localhost') ||
        currentHost.startsWith('127.0.0.1');

      if (isInIframe || isLovablePreview || isPreviewOrDevHost) return;

      // If we're already on the target domain, do nothing
      if (currentHost.includes(targetDomain)) return;

      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const redirectUrl = `https://${targetDomain}${currentPath}${currentSearch}${window.location.hash || ''}`;

      const currentHref = window.location.href;
      if (redirectUrl === currentHref) return;

      // Redirect to the canonical domain
      window.location.replace(redirectUrl);
    } catch (error) {
      console.error('Error in domain redirect check:', error);
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default DomainRedirect;