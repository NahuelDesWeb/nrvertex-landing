import fs from 'fs';
import path from 'path';

function check(filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const hrefs = content.match(/href="([^"]+)"/g);
  console.log(`\nLinks in ${filename}:`);
  if (hrefs) {
    hrefs.forEach(h => {
      if (h.includes('.html')) {
        console.log('  ' + h);
      }
    });
  }
}

check('index.html');
check('blog.html');
