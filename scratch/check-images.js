import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = process.cwd();

function getHtmlFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

let htmlFiles = [
  path.join(PROJECT_ROOT, 'index.html'),
  path.join(PROJECT_ROOT, 'blog.html'),
  path.join(PROJECT_ROOT, 'contacto.html'),
];

const subdirs = ['blog', 'src'];
subdirs.forEach(dir => {
  htmlFiles = htmlFiles.concat(getHtmlFiles(path.join(PROJECT_ROOT, dir)));
});

htmlFiles = htmlFiles.filter(f => fs.existsSync(f));

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Simple regex to extract <img ...> tags
  const imgRegex = /<img[^>]+>/gi;
  const matches = content.match(imgRegex);
  
  if (matches) {
    console.log(`\nFile: ${path.relative(PROJECT_ROOT, file)}`);
    matches.forEach(img => {
      const src = img.match(/src="([^"]+)"/i)?.[1] || 'no src';
      const width = img.match(/width="([^"]+)"/i)?.[1] || null;
      const height = img.match(/height="([^"]+)"/i)?.[1] || null;
      const alt = img.match(/alt="([^"]+)"/i)?.[1] || null;
      const loading = img.match(/loading="([^"]+)"/i)?.[1] || null;
      
      const missing = [];
      if (!width) missing.push('width');
      if (!height) missing.push('height');
      if (!alt) missing.push('alt');
      if (!loading) missing.push('loading');
      
      console.log(`  <img> src: ${src}`);
      if (missing.length > 0) {
        console.log(`    Missing: ${missing.join(', ')}`);
      } else {
        console.log(`    All attributes present!`);
      }
    });
  }
});
