import fs from 'fs';

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('Material+Symbols+Outlined')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
