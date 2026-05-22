import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';

const PROJECT_ROOT = process.cwd();
const INPUT_VIDEO = path.join(PROJECT_ROOT, 'Digital_agency_commercial_nrvertex_202605201425.mp4');
const OUTPUT_MP4 = path.join(PROJECT_ROOT, 'public', 'Digital_agency_commercial_nrvertex_202605201425.mp4');
const OUTPUT_WEBM = path.join(PROJECT_ROOT, 'public', 'Digital_agency_commercial_nrvertex_202605201425.webm');

// 1. Optimize video
function optimizeVideo() {
  return new Promise((resolve, reject) => {
    console.log('--- Optimizing Video ---');
    console.log('Input video:', INPUT_VIDEO);
    if (!fs.existsSync(INPUT_VIDEO)) {
      console.error('Input video not found in root directory!');
      return reject(new Error('Input video not found'));
    }

    console.log('Encoding MP4 (H.264, scale=960:-2, CRF=32, no audio)...');
    const mp4Args = [
      '-i', INPUT_VIDEO,
      '-c:v', 'libx264',
      '-preset', 'slow',
      '-crf', '32',
      '-vf', 'scale=960:-2',
      '-an',
      '-y',
      OUTPUT_MP4
    ];

    execFile(ffmpegPath, mp4Args, (error, stdout, stderr) => {
      if (error) {
        console.error('Error encoding MP4:', error);
        return reject(error);
      }
      console.log('MP4 encoded successfully.');
      const origSize = fs.statSync(INPUT_VIDEO).size;
      const mp4Size = fs.statSync(OUTPUT_MP4).size;
      console.log(`Original size: ${(origSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Optimized MP4 size: ${(mp4Size / 1024).toFixed(2)} KB`);

      console.log('Encoding WebM (VP9, scale=960:-2, CRF=42, no audio)...');
      const webmArgs = [
        '-i', INPUT_VIDEO,
        '-c:v', 'libvpx-vp9',
        '-crf', '42',
        '-b:v', '0',
        '-vf', 'scale=960:-2',
        '-an',
        '-y',
        OUTPUT_WEBM
      ];

      execFile(ffmpegPath, webmArgs, (error, stdout, stderr) => {
        if (error) {
          console.error('Error encoding WebM:', error);
          return reject(error);
        }
        console.log('WebM encoded successfully.');
        const webmSize = fs.statSync(OUTPUT_WEBM).size;
        console.log(`Optimized WebM size: ${(webmSize / 1024).toFixed(2)} KB`);
        resolve();
      });
    });
  });
}

// 2. Find and optimize images recursively
const IMAGE_DIRS = [
  path.join(PROJECT_ROOT, 'public', 'img'),
  path.join(PROJECT_ROOT, 'src', 'assets')
];

function getPngFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getPngFiles(fullPath));
    } else if (file.endsWith('.png')) {
      results.push(fullPath);
    }
  });
  return results;
}

async function optimizeImages() {
  console.log('\n--- Optimizing Images ---');
  let pngFiles = [];
  IMAGE_DIRS.forEach(dir => {
    pngFiles = pngFiles.concat(getPngFiles(dir));
  });

  console.log(`Found ${pngFiles.length} PNG files to optimize.`);

  for (const file of pngFiles) {
    const relativePath = path.relative(PROJECT_ROOT, file);
    const webpPath = file.substring(0, file.lastIndexOf('.')) + '.webp';
    const relativeWebpPath = path.relative(PROJECT_ROOT, webpPath);

    console.log(`Converting ${relativePath} to WebP...`);
    try {
      const info = await sharp(file)
        .webp({ quality: 80 })
        .toFile(webpPath);
      
      const origSize = fs.statSync(file).size;
      const webpSize = fs.statSync(webpPath).size;
      const savings = ((1 - webpSize / origSize) * 100).toFixed(1);
      console.log(`  Saved: ${relativeWebpPath} | Size: ${(webpSize / 1024).toFixed(1)} KB (orig: ${(origSize / 1024).toFixed(1)} KB, -${savings}%)`);
    } catch (err) {
      console.error(`  Error converting ${relativePath}:`, err);
    }
  }
}

// Main execution
async function main() {
  try {
    await optimizeVideo();
    await optimizeImages();
    console.log('\nAsset optimization completed successfully.');
  } catch (err) {
    console.error('Optimization failed:', err);
  }
}

main();
