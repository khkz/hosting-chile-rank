import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DomainRedirect: React.FC = () => {
  useEffect(() => {
    const checkDomainRedirect = async () => {
      try {
        // Get current location info
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        
        // Call the edge function to check if redirect is needed
        const { data, error } = await supabase.functions.invoke('domain-redirect', {
          body: {
            path: currentPath,
            search: currentSearch
          }
        });

        if (error) {
          console.error('Error checking domain redirect:', error);
          return;
        }

        // If redirect is needed, perform the redirect
        if (data?.shouldRedirect && data?.redirectUrl) {
          console.log(`Redirecting to: ${data.redirectUrl}`);
          window.location.href = data.redirectUrl;
        }
      } catch (error) {
        console.error('Error in domain redirect check:', error);
      }
    };

    // Only check on initial load
    checkDomainRedirect();
  }, []);

  // This component doesn't render anything
  return null;
};

export default DomainRedirect;