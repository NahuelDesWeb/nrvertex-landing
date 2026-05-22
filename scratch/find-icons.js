import fs from 'fs';
import path from 'path';

function getHtmlFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
        results = results.concat(getHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = [
  'index.html',
  'blog.html',
  'contacto.html',
  ...getHtmlFiles('blog'),
  ...getHtmlFiles('src')
];

const icons = new Set();
htmlFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  // Find all elements with class material-symbols-outlined
  const regex = /class="[^"]*material-symbols-outlined[^"]*"[^>]*>([^<]+)<\/span>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    icons.add(match[1].trim());
  }
});

console.log('Used Material Icons:', Array.from(icons));
