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
    // This is the URL for the latest domains (last day)
    const response = await fetch("https://www.nic.cl/registry/Ultimos.do?t=1d", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EligeTuHostingBot/1.0; +https://eligetuhosting.cl/)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch domains: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Find the domains in the content
    const content = document.body.textContent;
    
    // Try different parsing strategies
    
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
              
              const isoDate = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
              
              domainEntries.push({
                d: domain,
                date: isoDate
              });
            } catch (e) {
              console.warn(`Could not parse date for ${domain}: ${dateStr}`);
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
    
    // Strategy 2: Extract domain entries using regex pattern matching (original approach)
    const domainEntries = [];
    console.log("Table strategy failed, trying regex pattern matching");
    
    // More flexible pattern to match domain followed by date
    const pattern = /([a-z0-9-]+\.cl)([^\n]*?)(\d{2,4}[-\/]\d{1,2}[-\/]\d{1,4}\s+\d{1,2}:\d{1,2}(:\d{1,2})?(\.\d+)?)/g;
    
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const domain = match[1].trim();
      let dateStr = match[3].trim();
      
      // Parse date string to standard ISO format
      try {
        let year, month, day, hour, minute, second;
        // Handle DD-MM-YYYY and YYYY-MM-DD formats
        if (dateStr.match(/^\d{2}[-\/]\d{2}[-\/]\d{4}/)) {
          // DD-MM-YYYY format
          const dateParts = dateStr.match(/^(\d{2})[-\/](\d{2})[-\/](\d{4})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
          if (dateParts) {
            day = dateParts[1];
            month = dateParts[2];
            year = dateParts[3];
            hour = dateParts[4].padStart(2, '0');
            minute = dateParts[5].padStart(2, '0');
            second = dateParts[6] ? dateParts[6].padStart(2, '0') : '00';
          }
        } else {
          // YYYY-MM-DD format or other
          const dateParts = dateStr.match(/^(\d{4})[-\/](\d{2})[-\/](\d{2})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
          if (dateParts) {
            year = dateParts[1];
            month = dateParts[2];
            day = dateParts[3];
            hour = dateParts[4].padStart(2, '0');
            minute = dateParts[5].padStart(2, '0');
            second = dateParts[6] ? dateParts[6].padStart(2, '0') : '00';
          }
        }
        
        if (year && month && day) {
          const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour}:${minute}:${second}Z`;
          
          domainEntries.push({
            d: domain,
            date: isoDate
          });
        } else {
          throw new Error(`Invalid date format: ${dateStr}`);
        }
      } catch (e) {
        console.warn(`Could not parse date for ${domain}: ${dateStr}, error: ${e.message}`);
        // Add domain with current date as fallback
        domainEntries.push({
          d: domain,
          date: new Date().toISOString()
        });
      }
    }
    
    console.log(`Extracted ${domainEntries.length} domains with their registration dates using regex`);
    
    if (domainEntries.length === 0) {
      throw new Error("Could not extract domain entries from the page. Site format may have changed.");
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
    const xml = await fetch(FEED, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EligeTuHostingBot/1.0; +https://eligetuhosting.cl/)'
      }
    }).then(r => r.text());
    const feed = parse(xml, { ignoreAttributes: false });

    const domains = (feed.rss?.channel?.item || [])
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
    
    // If we already have a file, keep the old data but mark it as stale
    if (existsSync(`${dataDir}/latest.json`)) {
      try {
        const oldData = JSON.parse(readFileSync(`${dataDir}/latest.json`, 'utf8'));
        
        // Add update metadata
        const metaData = {
          lastAttempt: new Date().toISOString(),
          status: "error",
          message: "Failed to fetch fresh data, using cached data"
        };
        
        writeFileSync(`${dataDir}/latest.json`, JSON.stringify({
          meta: metaData,
          domains: oldData.domains || oldData
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
    count: domainsToSave.length,
    status: "success",
    source: domains.length === 0 ? "xml" : "html"
  };
  
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
