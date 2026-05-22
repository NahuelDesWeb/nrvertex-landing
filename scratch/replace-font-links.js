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

const targetUrl = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';
const replacementUrl = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=add,arrow_back,arrow_forward,bolt,calendar_today,call,check,check_circle,close,directions,expand_more,image,info,keyboard_arrow_down,language,location_on,menu,photo_camera,query_stats,reviews,search,send,share,shield,star,verified,warning&display=swap';

htmlFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(targetUrl)) {
    // Replace all occurrences in this file
    const newContent = content.replaceAll(targetUrl, replacementUrl);
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated Material Symbols URL in: ${file}`);
  } else {
    console.log(`Target URL not found in: ${file} (or already updated)`);
  }
});
