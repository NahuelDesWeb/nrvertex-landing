import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const images = [
  'public/img/como_hacer_maps.webp',
  'public/img/mi_negocio_no_maps.webp',
  'public/img/seo_local_caba.webp',
  'public/img/google_profile_pymes.webp',
  'public/img/aparecer_primero_google.webp'
];

async function run() {
  for (const img of images) {
    const fullPath = path.resolve(img);
    if (fs.existsSync(fullPath)) {
      const meta = await sharp(fullPath).metadata();
      console.log(`${img}: ${meta.width}x${meta.height}`);
    } else {
      console.log(`${img}: NOT FOUND`);
    }
  }
}

run();
