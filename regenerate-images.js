const fs = require('fs');
const path = require('path');

const root = path.join(__dirname);
const imageDir = path.join(root, 'd24images');
const outputFile = path.join(root, 'images.js');
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']);

if (!fs.existsSync(imageDir) || !fs.statSync(imageDir).isDirectory()) {
  console.error('Error: d24images directory not found in', root);
  process.exit(1);
}

const files = fs.readdirSync(imageDir, { withFileTypes: true })
  .filter(dirent => dirent.isFile())
  .map(dirent => dirent.name)
  .filter(name => allowedExtensions.has(path.extname(name).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

const content = `window.galleryImages = ${JSON.stringify(files, null, 2)};\n`;
fs.writeFileSync(outputFile, content, 'utf8');
console.log(`Regenerated ${path.relative(root, outputFile)} with ${files.length} image${files.length === 1 ? '' : 's'}.`);
