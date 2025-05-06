
import React from 'react';
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

  return (
    <Helmet>
      <link rel="alternate" type="application/rss+xml" title={title} href="/feeds/latest-domains.xml" />
    </Helmet>
  );
};

export default RSSFeed;
