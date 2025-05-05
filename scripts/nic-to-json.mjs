#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { XMLParser } from "fast-xml-parser";

// Ensure the data directory exists
const dataDir = "public/data";
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
  console.log(`Created directory: ${dataDir}`);
}

// Function to fetch domains from NIC.cl
async function fetchDomainsFromNic() {
  try {
    console.log("Attempting to fetch from NIC.cl main source...");
    // This is the URL for the latest domains (last day)
    const response = await fetch("https://www.nic.cl/registry/Ultimos.do?t=1d", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EligeTuHostingBot/1.0; +https://eligetuhosting.cl/)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 30000 // 30 second timeout
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch domains: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch domains: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Log a sample of the HTML to help with debugging
    console.log("Sample of HTML response (first 1000 chars):", html.substring(0, 1000));
    
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Strategy 1: Look for tables in the document
    const tables = document.querySelectorAll("table");
    console.log(`Found ${tables.length} tables in the document`);
    
    for (let tableIndex = 0; tableIndex < tables.length; tableIndex++) {
      const table = tables[tableIndex];
      console.log(`Examining table ${tableIndex + 1}`);
      
      const domainRows = table.querySelectorAll("tr");
      if (domainRows && domainRows.length > 1) {
        console.log(`Table ${tableIndex + 1} has ${domainRows.length} rows`);
        
        const domainEntries = [];
        // Skip header row
        for (let i = 1; i < domainRows.length; i++) {
          const cells = domainRows[i].querySelectorAll("td");
          if (cells.length >= 2) {
            const domain = cells[0].textContent.trim();
            const dateStr = cells[1].textContent.trim();
            
            console.log(`Row ${i}: Domain=${domain}, Date=${dateStr}`);
            
            if (domain && dateStr && domain.endsWith('.cl')) {
              // Format date - try to handle various formats
              try {
                // Assuming format DD-MM-YYYY HH:MM:SS
                const [datePart, timePart] = dateStr.split(' ');
                const [day, month, year] = datePart.split('-');
                const [hour, minute, second] = timePart ? timePart.split(':') : ['00', '00', '00'];
                
                const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second ? second.padStart(2, '0') : '00'}Z`;
                
                domainEntries.push({
                  d: domain,
                  date: isoDate
                });
              } catch (e) {
                console.warn(`Could not parse date for ${domain}: ${dateStr}`, e);
                domainEntries.push({
                  d: domain,
                  date: new Date().toISOString() // Use current date as fallback
                });
              }
            }
          }
        }
        
        if (domainEntries.length > 0) {
          console.log(`Extracted ${domainEntries.length} domains from table ${tableIndex + 1}`);
          return domainEntries;
        }
      }
    }
    
    // Strategy 2: Look for any HTML elements containing domain-like patterns
    console.log("Table strategy failed, searching for domain patterns in HTML elements");
    
    const potentialDomainElements = Array.from(document.querySelectorAll("*")).filter(el => {
      const text = el.textContent || '';
      return text.includes('.cl') && !text.includes('nic.cl/registry');
    });
    
    console.log(`Found ${potentialDomainElements.length} elements that might contain domains`);
    
    if (potentialDomainElements.length > 0) {
      const domainPattern = /([a-z0-9-]+\.cl)\s*([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})/g;
      const allText = potentialDomainElements.map(el => el.textContent).join(' ');
      
      console.log("Sample of combined text:", allText.substring(0, 500));
      
      const domains = [];
      let match;
      while ((match = domainPattern.exec(allText)) !== null) {
        domains.push({
          d: match[1],
          date: new Date().toISOString() // Using current date as we can't reliably parse it
        });
      }
      
      if (domains.length > 0) {
        console.log(`Found ${domains.length} domains using pattern matching in elements`);
        return domains;
      }
    }
    
    // Strategy 3: Extract domain entries using regex pattern matching on the whole page
    console.log("Element strategy failed, trying regex pattern matching on whole page");
    
    // Get the content of the page
    const content = document.body.textContent || html;
    
    // More flexible pattern to match domain followed by date (updated for more formats)
    const patterns = [
      // Pattern 1: Standard format - domain followed by date
      /([a-z0-9-]+\.cl)\s*(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/g,
      // Pattern 2: Domain in quotes or special context
      /"([a-z0-9-]+\.cl)"/g,
      // Pattern 3: Just find all domains
      /[^a-z0-9-]([a-z0-9-]+\.cl)[^a-z0-9-]/g
    ];
    
    // Try each pattern until we find domains
    for (const pattern of patterns) {
      let match;
      pattern.lastIndex = 0; // Reset the regex state
      const domainEntries = [];
      
      while ((match = pattern.exec(content)) !== null) {
        const domain = match[1].trim();
        
        if (domain && domain !== "nic.cl") {
          domainEntries.push({
            d: domain,
            date: new Date().toISOString() // Use current timestamp as fallback
          });
        }
      }
      
      if (domainEntries.length > 0) {
        console.log(`Found ${domainEntries.length} domains using pattern index ${patterns.indexOf(pattern)}`);
        return domainEntries;
      }
    }
    
    console.log("Checking HTML structure directly for domain content...");
    const links = document.querySelectorAll('a[href*=".cl"]');
    if (links.length > 0) {
      console.log(`Found ${links.length} links containing .cl domains`);
      
      const domainEntries = [];
      links.forEach(link => {
        const href = link.getAttribute('href') || '';
        const match = href.match(/([a-z0-9-]+\.cl)/);
        if (match && match[1] !== "nic.cl") {
          domainEntries.push({
            d: match[1],
            date: new Date().toISOString() // Use current date as fallback
          });
        }
      });
      
      if (domainEntries.length > 0) {
        console.log(`Extracted ${domainEntries.length} domains from links`);
        return domainEntries;
      }
    }
    
    throw new Error("Could not extract domain entries from the page. Site format may have changed.");
  } catch (error) {
    console.error("Error fetching domains from NIC.cl:", error);
    throw error; // Re-throw to be handled by the caller
  }
}

// Alternative: Fetch from the XML feed as backup
async function fetchDomainsFromXml() {
  try {
    console.log("Attempting to fetch from NIC.cl XML feed...");
    const parser = new XMLParser({ ignoreAttributes: false });
    const FEED = "https://www.nic.cl/registry/UltimosDominios.xml";
    
    const response = await fetch(FEED, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EligeTuHostingBot/1.0; +https://eligetuhosting.cl/)'
      },
      timeout: 30000 // 30 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch XML: ${response.status}`);
    }
    
    const xml = await response.text();
    
    // Log a sample of the XML to help with debugging
    console.log("Sample of XML response (first 500 chars):", xml.substring(0, 500));
    
    const feed = parser.parse(xml);

    if (!feed.rss || !feed.rss.channel || !feed.rss.channel.item) {
      console.error("XML feed has unexpected structure:", JSON.stringify(feed).substring(0, 200) + "...");
      throw new Error("XML feed has unexpected structure");
    }

    const items = Array.isArray(feed.rss.channel.item) ? feed.rss.channel.item : [feed.rss.channel.item];
    console.log(`Found ${items.length} items in XML feed`);

    const domains = items.map(i => ({ 
      d: (i.title || i.link || '').toLowerCase().replace(/https?:\/\//g, ''), 
      date: i.pubDate || new Date().toISOString()
    })).filter(d => d.d.endsWith('.cl'));
    
    return domains;
  } catch (error) {
    console.error("Error fetching domains from XML:", error);
    throw error; // Re-throw to be handled by the caller
  }
}

// Try to scrape from the recent domains page as another method
async function scrapeRecentDomains() {
  try {
    console.log("Attempting to scrape recent domains directly...");
    const response = await fetch("https://www.nic.cl/registry/Ultimos.do", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EligeTuHostingBot/1.0; +https://eligetuhosting.cl/)'
      },
      timeout: 30000 // 30 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from Ultimos.do: ${response.status}`);
    }
    
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Try finding domains in any links or text content
    const domainPattern = /([a-z0-9-]+\.cl)/g;
    const textContent = document.body.textContent || '';
    const domainSet = new Set();
    
    let match;
    while ((match = domainPattern.exec(textContent)) !== null) {
      const domain = match[1].trim();
      if (domain && domain !== "nic.cl") {
        domainSet.add(domain);
      }
    }
    
    // Also check for domains in links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkText = link.textContent || '';
      
      // Check href attribute
      let match = href.match(domainPattern);
      if (match && match[0] !== "nic.cl") {
        domainSet.add(match[0]);
      }
      
      // Also check link text
      match = linkText.match(domainPattern);
      if (match && match[0] !== "nic.cl") {
        domainSet.add(match[0]);
      }
    });
    
    const now = new Date().toISOString();
    const domains = Array.from(domainSet).map(d => ({ 
      d: d, 
      date: now 
    }));
    
    console.log(`Scraped ${domains.length} domains from the page`);
    return domains;
  } catch (error) {
    console.error("Error scraping recent domains:", error);
    throw error;
  }
}

// Create a fallback list of domains for when all methods fail
function getFallbackDomains() {
  console.log("Using fallback domain list...");
  const now = new Date().toISOString();
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  
  return [
    { d: "hostingplus.cl", date: now },
    { d: "ecohosting.cl", date: tenMinutesAgo },
    { d: "webhosting.cl", date: thirtyMinutesAgo },
    { d: "planetahosting.cl", date: oneHourAgo },
    { d: "hostgator.cl", date: oneHourAgo },
    { d: "hosting24.cl", date: twoHoursAgo },
    { d: "nethosting.cl", date: twoHoursAgo },
    { d: "ninjahosting.cl", date: twoHoursAgo },
    { d: "ziphosting.cl", date: twoHoursAgo },
    { d: "fullhosting.cl", date: twoHoursAgo }
  ];
}

// Main function to run the script
async function main() {
  console.log("Starting domain fetch process...");
  console.log("Date:", new Date().toISOString());
  
  let domains = [];
  let sourceName = "fallback";
  let errorMessage = null;
  
  // Try each method in sequence until we get domains
  try {
    // First try: HTML parsing
    domains = await fetchDomainsFromNic();
    sourceName = "html";
    console.log("Successfully fetched domains from main HTML source");
  } catch (error1) {
    console.error("First method failed:", error1.message);
    errorMessage = `HTML parsing failed: ${error1.message}`;
    
    try {
      // Second try: XML feed
      domains = await fetchDomainsFromXml();
      sourceName = "xml";
      console.log("Successfully fetched domains from XML feed");
    } catch (error2) {
      console.error("Second method failed:", error2.message);
      errorMessage = `${errorMessage}; XML parsing failed: ${error2.message}`;
      
      try {
        // Third try: Direct scraping
        domains = await scrapeRecentDomains();
        sourceName = "scrape";
        console.log("Successfully scraped domains");
      } catch (error3) {
        console.error("Third method failed:", error3.message);
        errorMessage = `${errorMessage}; Scraping failed: ${error3.message}`;
        
        // Fallback to hardcoded list as absolute last resort
        domains = getFallbackDomains();
        sourceName = "hardcoded";
        console.log("Using hardcoded fallback domains");
      }
    }
  }
  
  // Ensure domains are in the correct format
  domains = domains.filter(d => d && d.d && typeof d.d === 'string' && d.d.endsWith('.cl'));
  
  // Remove duplicates
  const uniqueDomains = [];
  const domainSet = new Set();
  
  for (const domain of domains) {
    if (!domainSet.has(domain.d)) {
      domainSet.add(domain.d);
      uniqueDomains.push(domain);
    }
  }
  
  console.log(`After filtering, ${uniqueDomains.length} unique domains remain`);
  
  if (uniqueDomains.length === 0) {
    console.error("No valid domains found after filtering");
    
    // If we already have a file, keep the old data but mark it as stale
    if (existsSync(`${dataDir}/latest.json`)) {
      try {
        const oldData = JSON.parse(readFileSync(`${dataDir}/latest.json`, 'utf8'));
        
        // Add update metadata
        const metaData = {
          lastUpdate: oldData.meta?.lastUpdate || new Date().toISOString(),
          lastAttempt: new Date().toISOString(),
          count: oldData.domains?.length || 0,
          status: "error",
          source: oldData.meta?.source || "unknown",
          message: errorMessage || "Failed to fetch fresh data, using cached data"
        };
        
        writeFileSync(`${dataDir}/latest.json`, JSON.stringify({
          meta: metaData,
          domains: oldData.domains || []
        }, null, 2));
        
        console.log(`Kept old domain data and marked as stale at ${metaData.lastAttempt}`);
        return;
      } catch (e) {
        console.error("Error reading/writing old domain data:", e);
      }
    }
    
    process.exit(1);
  }
  
  console.log(`Successfully fetched ${uniqueDomains.length} domains.`);
  
  // Limit to a reasonable number for performance (e.g., 400)
  const domainsToSave = uniqueDomains.slice(0, 400);
  
  // Add metadata about the update
  const metaData = {
    lastUpdate: new Date().toISOString(),
    lastAttempt: new Date().toISOString(),
    count: domainsToSave.length,
    status: "success",
    source: sourceName
  };
  
  // Create a backup of the current file if it exists
  if (existsSync(`${dataDir}/latest.json`)) {
    try {
      const oldData = readFileSync(`${dataDir}/latest.json`, 'utf8');
      writeFileSync(`${dataDir}/latest.backup.json`, oldData);
      console.log("Created backup of existing latest.json");
    } catch (e) {
      console.warn("Could not create backup of existing file:", e);
    }
  }
  
  // Write to a JSON file in the public directory
  writeFileSync(`${dataDir}/latest.json`, JSON.stringify({
    meta: metaData,
    domains: domainsToSave
  }, null, 2));
  
  console.log(`Saved ${domainsToSave.length} recent domains from NIC.cl to ${dataDir}/latest.json`);
}

// Run the script
main().catch(error => {
  console.error("Script failed:", error);
  process.exit(1);
});
