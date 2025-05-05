import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
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
    console.log("Attempting to fetch from NIC.cl main source...");
    // This is the URL for the latest domains (last day)
    const response = await fetch("https://www.nic.cl/registry/Ultimos.do?t=1d", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EligeTuHostingBot/1.0; +https://eligetuhosting.cl/)'
      },
      timeout: 30000 // 30 second timeout
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch domains: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch domains: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Log a sample of the HTML to help with debugging
    console.log("Sample of HTML response (first 500 chars):", html.substring(0, 500));
    
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Strategy 1: Parse table directly if available
    const domainRows = document.querySelectorAll("table tr");
    if (domainRows && domainRows.length > 1) {
      console.log(`Found ${domainRows.length} rows in table`);
      
      const domainEntries = [];
      // Skip header row
      for (let i = 1; i < domainRows.length; i++) {
        const cells = domainRows[i].querySelectorAll("td");
        if (cells.length >= 2) {
          const domain = cells[0].textContent.trim();
          const dateStr = cells[1].textContent.trim();
          
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
        console.log(`Extracted ${domainEntries.length} domains from table`);
        return domainEntries;
      }
    }
    
    // Strategy 2: Extract domain entries using regex pattern matching
    const domainEntries = [];
    console.log("Table strategy failed, trying regex pattern matching");
    
    // Get the content of the page
    const content = document.body.textContent || html;
    
    // More flexible pattern to match domain followed by date (updated for more formats)
    const patterns = [
      // Pattern 1: Standard format
      /([a-z0-9-]+\.cl)[^\n]*?(\d{2})[-\/](\d{2})[-\/](\d{4})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/g,
      // Pattern 2: Alternative format with year first
      /([a-z0-9-]+\.cl)[^\n]*?(\d{4})[-\/](\d{2})[-\/](\d{2})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/g,
      // Pattern 3: Simple domain with nearby date
      /([a-z0-9-]+\.cl)(?:[^\n]*?)(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/g
    ];
    
    // Try each pattern until we find domains
    for (const pattern of patterns) {
      let match;
      pattern.lastIndex = 0; // Reset the regex state
      
      while ((match = pattern.exec(content)) !== null) {
        const domain = match[1].trim();
        
        try {
          let isoDate;
          
          if (match.length >= 7) {
            // Full date and time capture
            if (match[4].length === 4) {
              // YYYY-MM-DD format (Pattern 2)
              const year = match[2];
              const month = match[3].padStart(2, '0');
              const day = match[4].padStart(2, '0');
              const hour = match[5] ? match[5].padStart(2, '0') : '00';
              const minute = match[6] ? match[6].padStart(2, '0') : '00';
              const second = match[7] ? match[7].padStart(2, '0') : '00';
              
              isoDate = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
            } else {
              // DD-MM-YYYY format (Pattern 1)
              const day = match[2].padStart(2, '0');
              const month = match[3].padStart(2, '0');
              const year = match[4];
              const hour = match[5] ? match[5].padStart(2, '0') : '00';
              const minute = match[6] ? match[6].padStart(2, '0') : '00';
              const second = match[7] ? match[7].padStart(2, '0') : '00';
              
              isoDate = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
            }
          } else if (match.length >= 5) {
            // Simple date format (Pattern 3)
            let day, month, year;
            
            // Try to determine the date format
            if (match[4].length === 4) {
              // DD/MM/YYYY
              day = match[2].padStart(2, '0');
              month = match[3].padStart(2, '0');
              year = match[4];
            } else {
              // Handle 2-digit year
              day = match[2].padStart(2, '0');
              month = match[3].padStart(2, '0');
              year = match[4].length === 2 ? `20${match[4]}` : match[4];
            }
            
            isoDate = `${year}-${month}-${day}T00:00:00Z`;
          } else {
            // Fallback if we can't parse the date
            throw new Error("Insufficient date parts captured");
          }
          
          domainEntries.push({
            d: domain,
            date: isoDate
          });
        } catch (e) {
          console.warn(`Could not parse date for ${domain}:`, e);
          domainEntries.push({
            d: domain,
            date: new Date().toISOString() // Use current date as fallback
          });
        }
      }
      
      if (domainEntries.length > 0) {
        console.log(`Found ${domainEntries.length} domains using pattern index ${patterns.indexOf(pattern)}`);
        break;
      }
    }
    
    console.log(`Extracted ${domainEntries.length} domains using regex`);
    
    if (domainEntries.length === 0) {
      throw new Error("Could not extract domain entries from the page. Site format may have changed.");
    }
    
    // Sort by date (newest first)
    domainEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return domainEntries;
  } catch (error) {
    console.error("Error fetching domains from NIC.cl:", error);
    throw error; // Re-throw to be handled by the caller
  }
}

// Alternative: Fetch from the XML feed as backup
async function fetchDomainsFromXml() {
  try {
    console.log("Attempting to fetch from NIC.cl XML feed...");
    const { parse } = await import("fast-xml-parser");
    const FEED = "https://www.nic.cl/registry/UltimosDominios.xml";
    const xml = await fetch(FEED, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EligeTuHostingBot/1.0; +https://eligetuhosting.cl/)'
      },
      timeout: 30000 // 30 second timeout
    }).then(r => r.text());
    
    // Log a sample of the XML to help with debugging
    console.log("Sample of XML response (first 500 chars):", xml.substring(0, 500));
    
    const feed = parse(xml, { ignoreAttributes: false });

    if (!feed.rss || !feed.rss.channel || !feed.rss.channel.item) {
      console.error("XML feed has unexpected structure:", JSON.stringify(feed).substring(0, 200) + "...");
      throw new Error("XML feed has unexpected structure");
    }

    const items = Array.isArray(feed.rss.channel.item) ? feed.rss.channel.item : [feed.rss.channel.item];
    console.log(`Found ${items.length} items in XML feed`);

    const domains = items.map(i => ({ 
      d: i.title.toLowerCase(), 
      date: i.pubDate 
    }));
    
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
      const match = href.match(domainPattern);
      if (match) {
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

// Main function to run the script
async function main() {
  console.log("Starting domain fetch process...");
  console.log("Date:", new Date().toISOString());
  
  let domains = [];
  let sourceName = "unknown";
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
        console.error("All methods failed");
        errorMessage = `${errorMessage}; Scraping failed: ${error3.message}`;
        // Let all methods fail before giving up
      }
    }
  }
  
  if (domains.length === 0) {
    console.error("Failed to fetch domains from all sources.");
    
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
  
  console.log(`Successfully fetched ${domains.length} domains.`);
  
  // Limit to a reasonable number for performance (e.g., 400)
  const domainsToSave = domains.slice(0, 400);
  
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
  
  console.log(`Guardados ${domainsToSave.length} dominios recientes de NIC.cl en ${dataDir}/latest.json`);
}

// Run the script
main().catch(error => {
  console.error("Script failed:", error);
  process.exit(1);
});
