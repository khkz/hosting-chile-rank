
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
    // This is the URL you provided that shows recent domains
    const response = await fetch("https://www.nic.cl/registry/Ultimos.do?t=1w");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch domains: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Find all the domain rows in the table
    const rows = document.querySelectorAll("table.tablesorter tbody tr");
    
    const domains = [];
    
    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 2) {
        // First cell contains domain name, second cell contains date
        const domain = cells[0].textContent.trim();
        const dateStr = cells[1].textContent.trim();
        
        // Parse the date (format is DD-MM-YYYY)
        const [day, month, year] = dateStr.split("-");
        const date = new Date(`${year}-${month}-${day}`);
        
        domains.push({
          d: domain.toLowerCase(),
          date: date.toISOString()
        });
      }
    });
    
    return domains;
  } catch (error) {
    console.error("Error fetching domains:", error);
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
  
  // If HTML fetching failed, try XML as fallback
  if (domains.length === 0) {
    console.log("Falling back to XML feed...");
    domains = await fetchDomainsFromXml();
  }
  
  if (domains.length === 0) {
    console.error("Failed to fetch domains from both sources.");
    process.exit(1);
  }
  
  console.log(`Successfully fetched ${domains.length} domains.`);
  
  // Write to a JSON file in the public directory
  writeFileSync(`${dataDir}/latest.json`, JSON.stringify(domains, null, 2));
  
  console.log(`Guardados ${domains.length} dominios recientes de NIC.cl en ${dataDir}/latest.json`);
}

// Run the script
main().catch(error => {
  console.error("Script failed:", error);
  process.exit(1);
});
