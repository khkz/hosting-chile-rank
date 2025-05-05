
import { writeFileSync, mkdirSync, existsSync } from "fs";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

// Ensure the data directory exists
const dataDir = "public/data";
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
  console.log(`Created directory: ${dataDir}`);
}

// Function to fetch domains from NIC.cl
async function fetchDomainsFromNic() {
  try {
    // This is the URL for the latest domains (last day)
    const response = await fetch("https://www.nic.cl/registry/Ultimos.do?t=1d");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch domains: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Find the domains in the content
    const content = document.body.textContent;
    
    // Count total domains mentioned in the page (usually in a header text)
    const domainCountMatch = content.match(/(\d+)\s+Dominios\s+Inscritos/i);
    const totalDomains = domainCountMatch ? parseInt(domainCountMatch[1]) : 0;
    console.log(`Found header indicating ${totalDomains} domains`);
    
    // Extract domain entries using regex pattern matching
    // Pattern matches: domainname.cl followed by a date
    const domainEntries = [];
    const pattern = /([a-z0-9-]+\.cl)([^\n]*?)(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d+)/g;
    
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const domain = match[1].trim();
      const dateStr = match[3].trim();
      
      // Parse date string to standard ISO format
      const dateParts = dateStr.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})\.(\d+)/);
      if (dateParts) {
        const year = dateParts[1];
        const month = dateParts[2];
        const day = dateParts[3];
        const hour = dateParts[4];
        const minute = dateParts[5];
        const second = dateParts[6];
        
        const isoDate = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
        
        domainEntries.push({
          d: domain,
          date: isoDate
        });
      }
    }
    
    console.log(`Extracted ${domainEntries.length} domains with their registration dates`);
    
    if (domainEntries.length === 0) {
      throw new Error("Could not extract domain entries from the page");
    }
    
    // Sort by date (newest first)
    domainEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return domainEntries;
  } catch (error) {
    console.error("Error fetching domains from NIC.cl:", error);
    // Return empty array in case of error
    return [];
  }
}

// Alternative: Fetch from the XML feed as backup
async function fetchDomainsFromXml() {
  try {
    const { parse } = await import("fast-xml-parser");
    const FEED = "https://www.nic.cl/registry/UltimosDominios.xml";
    const xml = await fetch(FEED).then(r => r.text());
    const feed = parse(xml, { ignoreAttributes: false });

    const domains = (feed.rss.channel.item || [])
      .map(i => ({ 
        d: i.title.toLowerCase(), 
        date: i.pubDate 
      }));
    
    return domains;
  } catch (error) {
    console.error("Error fetching domains from XML:", error);
    return [];
  }
}

// Main function to run the script
async function main() {
  console.log("Fetching domains from NIC.cl...");
  
  // Try to fetch from the HTML page first
  let domains = await fetchDomainsFromNic();
  
  // If HTML fetching failed or returned no domains, try XML as fallback
  if (domains.length === 0) {
    console.log("Falling back to XML feed...");
    domains = await fetchDomainsFromXml();
  }
  
  if (domains.length === 0) {
    console.error("Failed to fetch domains from both sources.");
    process.exit(1);
  }
  
  console.log(`Successfully fetched ${domains.length} domains.`);
  
  // Limit to a reasonable number for performance (e.g., 200)
  const domainsToSave = domains.slice(0, 400);
  
  // Write to a JSON file in the public directory
  writeFileSync(`${dataDir}/latest.json`, JSON.stringify(domainsToSave, null, 2));
  
  console.log(`Guardados ${domainsToSave.length} dominios recientes de NIC.cl en ${dataDir}/latest.json`);
}

// Run the script
main().catch(error => {
  console.error("Script failed:", error);
  process.exit(1);
});
