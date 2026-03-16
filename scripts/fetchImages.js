import fs from 'fs';

async function getImageUrl(query) {
  const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=1`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.results && json.results.length > 0 && json.results[0].urls && json.results[0].urls.regular) {
      return json.results[0].urls.regular;
    }
  } catch(e) {
    console.error(e);
  }
  return `https://images.unsplash.com/photo-1596423735880-5a3d7bc1c99b?ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfH`; // Fallback placeholder
}

async function main() {
  const file = '/Users/saiakshith/Documents/PLANIT frontend /plan-it-today/src/data/tier1Cities.ts';
  let content = fs.readFileSync(file, 'utf-8');

  // Find all heroImageQuery and imageQuery
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Process heroImageQuery
    const hMatch = line.match(/(.*?)\bheroImageQuery\s*:\s*"(.*)"(.*)/);
    if (hMatch) {
      let query = hMatch[2];
      
      // Override some queries for better unsplash results
      if (query.includes("Gateway of India")) query = "Gateway of India skyline";
      else if (query.includes("India Gate Delhi memorial")) query = "India Gate Delhi";
      else if (query.includes("Bengaluru Lalbagh")) query = "Bangalore city skyline";
      else if (query.includes("Charminar Hyderabad illuminated")) query = "Charminar Hyderabad";
      else if (query.includes("Marina Beach Chennai Bay of Bengal longest")) query = "Marina Beach Chennai";
      else if (query.includes("Victoria Memorial Kolkata")) query = "Howrah Bridge Kolkata";

      const url = await getImageUrl(query);
      lines[i] = `${hMatch[1]}heroImage: "${url}"${hMatch[3]}`;
      console.log(`Replaced heroImage: ${query}`);
      continue;
    }

    // Process imageQuery
    const iMatch = line.match(/(.*?)\bimageQuery\s*:\s*"(.*)"(.*)/);
    if (iMatch) {
      const query = iMatch[2];
      const url = await getImageUrl(query);
      lines[i] = `${iMatch[1]}image: "${url}"${iMatch[3]}`;
      console.log(`Replaced attraction image: ${query}`);
      continue;
    }
  }

  // Update interface declarations
  const newContent = lines.join('\n')
    .replace(/heroImageQuery:\s*string;/g, 'heroImage: string;')
    .replace(/imageQuery:\s*string;/g, 'image: string;');

  fs.writeFileSync(file, newContent);
}

main().then(() => console.log('Done'));
