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

// Gather all HTML files in the project
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

console.log(`Checking ${htmlFiles.length} HTML files...`);

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Simple regex to find .png matches
  const matches = content.match(/[\w\-\.\/]+\.png/gi);
  if (matches) {
    console.log(`\nFile: ${path.relative(PROJECT_ROOT, file)}`);
    matches.forEach(m => console.log(`  Found: ${m}`));
  }
});
