const fs = require('fs');
const path = require('path');

const contentDir = 'D:/digital-garden-quartz/content';

// Get all markdown files
function getMdFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...getMdFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getMdFiles(contentDir);
console.log(`Found ${files.length} markdown files`);

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');

  // Fix literal \n in frontmatter
  let fixed = content.replace(/\\n/g, '\n');

  // Check if file already has proper BOM
  const hasBom = content.charCodeAt(0) === 0xFEFF;

  if (fixed !== content) {
    // Write back with BOM if original had BOM
    if (hasBom) {
      fs.writeFileSync(file, '\uFEFF' + fixed, 'utf8');
    } else {
      fs.writeFileSync(file, fixed, 'utf8');
    }
    console.log(`Fixed: ${file}`);
  }
}

console.log('Done!');