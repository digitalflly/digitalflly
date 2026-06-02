import fs from 'fs';

const content = fs.readFileSync('original_js.js', 'utf8');

// Regex supporting double quotes, single quotes, and template literals
// We escape backticks or we can target strings of length 15-600.
const doubleQuotes = content.match(/"([^"\\]|\\.)*"/g) || [];
const singleQuotes = content.match(/'([^'\\]|\\.)*'/g) || [];
const templateLiterals = content.match(/`([^`\\]|\\.)*`/g) || [];

const allRaw = [...doubleQuotes, ...singleQuotes, ...templateLiterals];

const cleanStrings: string[] = [];

for (const raw of allRaw) {
  // Remove outer quotes
  const str = raw.slice(1, -1).trim();
  
  if (str.length < 15 || str.length > 800) continue;
  
  // Filter out non-Portuguese content, paths, code fragments, URLs
  if (str.startsWith('http') || str.startsWith('d=') || str.startsWith('M') || str.includes('xmlns') || str.includes('class=') || str.includes('px') || str.includes('transform')) {
    continue;
  }
  
  // Basic Portuguese letter checking to make sure it's normal text
  if (/[a-zA-Záéíóúâêôãõç]{3,}/.test(str)) {
    cleanStrings.push(str);
  }
}

// Write to a JSON file or display
fs.writeFileSync('extracted_strings.json', JSON.stringify(cleanStrings, null, 2));
console.log('Total de textos importantes extraídos:', cleanStrings.length);

// Let's print the longest/most descriptive ones to see sections
const uniqueStrings = Array.from(new Set(cleanStrings));
console.log('\n--- Demonstração de Copywriting do seu Site ---');
uniqueStrings.slice(0, 80).forEach((s, idx) => {
  if (s.includes(' ')) {
    console.log(`[${idx}]: ${s}`);
  }
});
