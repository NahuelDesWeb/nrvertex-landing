import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = process.cwd();

// List of HTML directories/files to modify
const FILES_TO_PROCESS = [
  path.join(PROJECT_ROOT, 'index.html'),
  path.join(PROJECT_ROOT, 'blog.html'),
  path.join(PROJECT_ROOT, 'contacto.html'),
  path.join(PROJECT_ROOT, 'code.html'), // backup
];

const DIRS_TO_PROCESS = [
  path.join(PROJECT_ROOT, 'blog'),
  path.join(PROJECT_ROOT, 'src', 'casos')
];

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

// Gather all HTML files
let htmlFiles = [...FILES_TO_PROCESS];
DIRS_TO_PROCESS.forEach(dir => {
  htmlFiles = htmlFiles.concat(getHtmlFiles(dir));
});

// Filter only files that exist
htmlFiles = htmlFiles.filter(f => fs.existsSync(f));

console.log(`Found ${htmlFiles.length} HTML files to inspect and update.`);

// We want to replace PNG extensions with WebP for our specific images
// A general regex pattern to match our specific PNGs or any PNG in public/img or src/assets
const PNG_REPLACE_RULES = [
  { from: /como_hacer_maps\.png/g, to: 'como_hacer_maps.webp' },
  { from: /mi_negocio_no_maps\.png/g, to: 'mi_negocio_no_maps.webp' },
  { from: /seo_local_caba\.png/g, to: 'seo_local_caba.webp' },
  { from: /google_profile_pymes\.png/g, to: 'google_profile_pymes.webp' },
  { from: /aparecer_primero_google\.png/g, to: 'aparecer_primero_google.webp' },
  { from: /floreria-preview\.png/g, to: 'floreria-preview.webp' },
  { from: /obras-preview\.png/g, to: 'obras-preview.webp' },
  { from: /screen\.png/g, to: 'screen.webp' },
  { from: /hero\.png/g, to: 'hero.webp' },
  // All case studies images
  { from: /floreria-antes-interacciones\.png/g, to: 'floreria-antes-interacciones.webp' },
  { from: /floreria-despues-search\.png/g, to: 'floreria-despues-search.webp' },
  { from: /floreria-gbp-direcciones\.png/g, to: 'floreria-gbp-direcciones.webp' },
  { from: /floreria-gbp-interacciones\.png/g, to: 'floreria-gbp-interacciones.webp' },
  { from: /floreria-gbp-llamadas\.png/g, to: 'floreria-gbp-llamadas.webp' },
  { from: /obras-antes-clics\.png/g, to: 'obras-antes-clics.webp' },
  { from: /obras-antes-interacciones\.png/g, to: 'obras-antes-interacciones.webp' },
  { from: /obras-antes-llamadas\.png/g, to: 'obras-antes-llamadas.webp' },
  { from: /obras-despues-search\.png/g, to: 'obras-despues-search.webp' },
  { from: /obras-gbp-clics\.png/g, to: 'obras-gbp-clics.webp' },
  { from: /obras-gbp-interacciones\.png/g, to: 'obras-gbp-interacciones.webp' },
  { from: /obras-gbp-llamadas\.png/g, to: 'obras-gbp-llamadas.webp' },
];

htmlFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  let modificationsCount = 0;

  PNG_REPLACE_RULES.forEach(rule => {
    const matches = newContent.match(rule.from);
    if (matches) {
      newContent = newContent.replace(rule.from, rule.to);
      modificationsCount += matches.length;
    }
  });

  if (modificationsCount > 0) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    console.log(`Updated ${relativePath}: made ${modificationsCount} replacements.`);
  }
});

console.log('HTML references updated successfully.');
