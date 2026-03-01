import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const LlmsTxt: React.FC = () => {
  const [content, setContent] = useState<string>('Cargando...');

  useEffect(() => {
    const fetchLlmsTxt = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('llms-txt');
        if (error) throw error;
        // The edge function returns text/markdown, supabase client may parse it
        if (typeof data === 'string') {
          setContent(data);
        } else {
          // If it came as a blob or other format, try to extract text
          const text = await new Response(data).text();
          setContent(text);
        }
      } catch (err) {
        console.error('Error fetching llms.txt:', err);
        // Fallback: direct fetch
        try {
          const res = await fetch(
            `https://oegvwjxrlmtwortyhsrv.supabase.co/functions/v1/llms-txt`,
            {
              headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZ3Z3anhybG10d29ydHloc3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjA4NzEsImV4cCI6MjA2MjAzNjg3MX0.ruA3v0xiTGgH2vubqAnWPgbvwSOlaVp7Oc0e2YeZq4M',
              },
            }
          );
          setContent(await res.text());
        } catch {
          setContent('# Error\nNo se pudo cargar la información de proveedores.');
        }
      }
    };

    // Remove all stylesheets and set plain text rendering
    document.title = 'llms.txt - eligetuhosting.cl';
    fetchLlmsTxt();
  }, []);

  return (
    <pre style={{
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      margin: 0,
      padding: '16px',
      fontSize: '13px',
      lineHeight: '1.5',
      backgroundColor: '#fff',
      color: '#000',
    }}>
      {content}
    </pre>
  );
};

export default LlmsTxt;
