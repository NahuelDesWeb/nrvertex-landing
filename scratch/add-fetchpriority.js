import fs from 'fs';
import path from 'path';

const files = [
  'blog/como-aparecer-google-maps.html',
  'blog/como-aparecer-primero-google.html',
  'blog/google-business-profile-pymes.html',
  'blog/porque-mi-negocio-no-aparece.html',
  'blog/seo-local-caba.html',
  'src/casos/albornoz-obras.html',
  'src/casos/florerializ.html'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the first <img> tag that has class containing "hero-img" or is in the header/article top
  // In our articles, it has class="article-hero-img" or similar
  const imgRegex = /<img([^>]+class="[^"]*hero-img[^"]*"[^>]*)>/gi;
  if (imgRegex.test(content)) {
    content = content.replace(imgRegex, (match, p1) => {
      if (!p1.includes('fetchpriority')) {
        return `<img${p1} fetchpriority="high">`;
      }
      return match;
    });
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Added fetchpriority="high" to hero image in: ${file}`);
  } else {
    // If not found, let's find the first image in the document
    const firstImgRegex = /<img([^>]+width="1024"[^>]*)>/gi;
    if (firstImgRegex.test(content)) {
      content = content.replace(firstImgRegex, (match, p1) => {
        if (!p1.includes('fetchpriority')) {
          return `<img${p1} fetchpriority="high">`;
        }
        return match;
      });
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Added fetchpriority="high" to 1024px image in: ${file}`);
    } else {
      console.log(`No hero image pattern matched in: ${file}`);
    }
  }
});
