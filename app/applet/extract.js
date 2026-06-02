import fs from 'fs';

const content = fs.readFileSync('original_js.js', 'utf8');

const doubleQuotes = content.match(/"([^"\\]|\\.)*"/g) || [];
const singleQuotes = content.match(/'([^'\\]|\\.)*'/g) || [];

const allRaw = [...doubleQuotes, ...singleQuotes];

const cleanStrings = [];

for (const raw of allRaw) {
  const str = raw.slice(1, -1).trim();
  
  if (str.length < 15 || str.length > 800) continue;
  
  if (str.startsWith('http') || str.startsWith('d=') || str.startsWith('M') || str.includes('xmlns') || str.includes('class=') || str.includes('px') || str.includes('transform')) {
    continue;
  }
  
  if (/[a-zA-Záéíóúâêôãõç]{3,}/.test(str)) {
    cleanStrings.push(str);
  }
}

fs.writeFileSync('extracted_strings.json', JSON.stringify(cleanStrings, null, 2));
console.log('Total de textos importantes extraídos:', cleanStrings.length);

const uniqueStrings = Array.from(new Set(cleanStrings));
console.log('\n--- Demonstração de Copywriting do seu Site ---');
uniqueStrings.slice(0, 100).forEach((s, idx) => {
  if (s.includes(' ')) {
    console.log(`[${idx}]: ${s}`);
  }
});
