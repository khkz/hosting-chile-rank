
import React, { useEffect, useState } from 'react';

const StaticRSSFeed: React.FC = () => {
  const [rssContent, setRssContent] = useState<string>('');

  useEffect(() => {
    // Fetch RSS feed content from the public directory
    fetch('/feed/latest-domains.xml')
      .then(response => response.text())
      .then(content => setRssContent(content))
      .catch(() => {
        // Fallback RSS feed if fetch fails
        const fallbackRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Últimos dominios .CL – EligeTuHosting.cl</title>
    <description>Feed con los dominios .cl recién inscritos en NIC Chile.</description>
    <link>https://eligetuhosting.cl</link>
    <atom:link href="https://eligetuhosting.cl/feed/latest-domains.xml" rel="self" type="application/rss+xml"/>
    <language>es-cl</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`;
        setRssContent(fallbackRSS);
      });

    // Set appropriate headers for XML content
    const setHeaders = () => {
      if (typeof window !== 'undefined') {
        document.querySelector('meta[http-equiv="Content-Type"]')?.remove();
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Type';
        meta.content = 'application/rss+xml; charset=utf-8';
        document.head.appendChild(meta);
      }
    };

    setHeaders();
  }, []);

  // Return the XML content as plain text
  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap', 
      margin: 0, 
      padding: 0,
      fontSize: '12px'
    }}>
      {rssContent}
    </pre>
  );
};

export default StaticRSSFeed;
