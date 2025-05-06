
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
}

interface RSSFeedProps {
  title: string;
  description: string;
  link: string;
  items: FeedItem[];
}

const RSSFeed: React.FC<RSSFeedProps> = ({ title, description, link, items }) => {
  // Generate RSS feed XML
  const generateRSSFeed = () => {
    const rssItems = items.map(item => `
    <item>
      <title>${item.title}</title>
      <link>${item.link}</link>
      <description>${item.description}</description>
      <pubDate>${item.pubDate}</pubDate>
      <guid>${item.guid}</guid>
    </item>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <description>${description}</description>
    <link>${link}</link>
    <atom:link href="${link}/feeds/latest-domains.xml" rel="self" type="application/rss+xml" />
    <language>es-cl</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;
  };

  // Effect to create the physical RSS file in development
  useEffect(() => {
    // In development, we'll log the XML to console
    // In production, the file should be created by the build process or server
    console.log('RSS feed XML generated:', generateRSSFeed());
    
    // For local development only - won't work in production
    // This is just to demonstrate what would happen
    if (process.env.NODE_ENV === 'development') {
      try {
        // Show that we're generating the RSS feed
        console.log('In a real production environment, we would save this to public/feeds/latest-domains.xml');
      } catch (error) {
        console.error('Error generating RSS feed file:', error);
      }
    }
  }, [items]);

  return (
    <Helmet>
      <link rel="alternate" type="application/rss+xml" title={title} href="/feeds/latest-domains.xml" />
    </Helmet>
  );
};

export default RSSFeed;
