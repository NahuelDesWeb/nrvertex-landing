// scratch/setup-seo-clean-urls.cjs
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');
const domain = 'https://nrvertex.com';

const htmlFiles = [
  'index.html',
  'blog.html',
  'contacto.html',
  'src/casos/albornoz-obras.html',
  'src/casos/florerializ.html',
  'blog/como-aparecer-google-maps.html',
  'blog/como-aparecer-primero-google.html',
  'blog/google-business-profile-pymes.html',
  'blog/porque-mi-negocio-no-aparece.html',
  'blog/seo-local-caba.html'
];

console.log('--- Starting SEO Clean URLs and Canonical Tags Setup ---');

// 1. Process HTML files: add canonical link, clean internal links
htmlFiles.forEach(fileRelPath => {
  const filePath = path.join(baseDir, fileRelPath);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Compute canonical URL
  let canonicalPath = fileRelPath.replace(/\.html$/, '');
  if (canonicalPath === 'index') {
    canonicalPath = '';
  }
  const canonicalUrl = `${domain}/${canonicalPath}`;

  // Remove existing canonical tag if it exists (for safety/idempotency)
  content = content.replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']+["']\s*\/?>\n?/gi, '');

  // Insert canonical link in the <head> section
  const canonicalTag = `  <link rel="canonical" href="${canonicalUrl}" />\n`;
  
  // Insert right after <head> or after charset/viewport/title
  if (content.includes('<head>')) {
    content = content.replace('<head>', `<head>\n${canonicalTag}`);
  } else {
    console.error(`No <head> tag found in ${fileRelPath}`);
    return;
  }

  // Clean internal links (.html references)
  const replacements = [
    { from: /\/index\.html(#\w+)?/g, to: '/$1' },
    { from: /\/blog\.html/g, to: '/blog' },
    { from: /\/contacto\.html/g, to: '/contacto' },
    { from: /"contacto\.html"/g, to: '"/contacto"' },
    { from: /'contacto\.html'/g, to: '"/contacto"' },
    { from: /\/src\/casos\/florerializ\.html/g, to: '/src/casos/florerializ' },
    { from: /\/src\/casos\/albornoz-obras\.html/g, to: '/src/casos/albornoz-obras' },
    { from: /\/blog\/como-aparecer-google-maps\.html/g, to: '/blog/como-aparecer-google-maps' },
    { from: /\/blog\/como-aparecer-primero-google\.html/g, to: '/blog/como-aparecer-primero-google' },
    { from: /\/blog\/google-business-profile-pymes\.html/g, to: '/blog/google-business-profile-pymes' },
    { from: /\/blog\/porque-mi-negocio-no-aparece\.html/g, to: '/blog/porque-mi-negocio-no-aparece' },
    { from: /\/blog\/seo-local-caba\.html/g, to: '/blog/seo-local-caba' },
  ];

  replacements.forEach(rep => {
    content = content.replace(rep.from, rep.to);
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated ${fileRelPath} with Canonical: ${canonicalUrl} and pretty links.`);
});

// 2. Process sitemap.xml
const sitemapPath = path.join(baseDir, 'public/sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  sitemapContent = sitemapContent
    .replace(/<loc>https:\/\/nrvertex\.com\/blog\.html<\/loc>/g, '<loc>https://nrvertex.com/blog</loc>')
    .replace(/<loc>https:\/\/nrvertex\.com\/contacto\.html<\/loc>/g, '<loc>https://nrvertex.com/contacto</loc>')
    .replace(/<loc>https:\/\/nrvertex\.com\/src\/casos\/florerializ\.html<\/loc>/g, '<loc>https://nrvertex.com/src/casos/florerializ</loc>')
    .replace(/<loc>https:\/\/nrvertex\.com\/src\/casos\/albornoz-obras\.html<\/loc>/g, '<loc>https://nrvertex.com/src/casos/albornoz-obras</loc>')
    .replace(/<loc>https:\/\/nrvertex\.com\/blog\/como-aparecer-google-maps\.html<\/loc>/g, '<loc>https://nrvertex.com/blog/como-aparecer-google-maps</loc>')
    .replace(/<loc>https:\/\/nrvertex\.com\/blog\/porque-mi-negocio-no-aparece\.html<\/loc>/g, '<loc>https://nrvertex.com/blog/porque-mi-negocio-no-aparece</loc>')
    .replace(/<loc>https:\/\/nrvertex\.com\/blog\/seo-local-caba\.html<\/loc>/g, '<loc>https://nrvertex.com/blog/seo-local-caba</loc>')
    .replace(/<loc>https:\/\/nrvertex\.com\/blog\/google-business-profile-pymes\.html<\/loc>/g, '<loc>https://nrvertex.com/blog/google-business-profile-pymes</loc>')
    .replace(/<loc>https:\/\/nrvertex\.com\/blog\/como-aparecer-primero-google\.html<\/loc>/g, '<loc>https://nrvertex.com/blog/como-aparecer-primero-google</loc>');

  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
  console.log('Successfully updated public/sitemap.xml with pretty URLs.');
}

// 3. Process llms.txt
const llmsPath = path.join(baseDir, 'public/llms.txt');
if (fs.existsSync(llmsPath)) {
  let llmsContent = fs.readFileSync(llmsPath, 'utf8');
  llmsContent = llmsContent
    .replace(/contacto\.html/g, 'contacto')
    .replace(/src\/casos\/florerializ\.html/g, 'src/casos/florerializ')
    .replace(/src\/casos\/albornoz-obras\.html/g, 'src/casos/albornoz-obras')
    .replace(/blog\/como-aparecer-google-maps\.html/g, 'blog/como-aparecer-google-maps')
    .replace(/blog\/porque-mi-negocio-no-aparece\.html/g, 'blog/porque-mi-negocio-no-aparece')
    .replace(/blog\/seo-local-caba\.html/g, 'blog/seo-local-caba')
    .replace(/blog\/google-business-profile-pymes\.html/g, 'blog/google-business-profile-pymes')
    .replace(/blog\/como-aparecer-primero-google\.html/g, 'blog/como-aparecer-primero-google');

  fs.writeFileSync(llmsPath, llmsContent, 'utf8');
  console.log('Successfully updated public/llms.txt with pretty URLs.');
}

console.log('--- Canonical Tags and Pretty URLs Setup Finished ---');
