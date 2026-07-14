const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = process.cwd();
const SOURCES = ['public', 'dist'];
const OUT_SUFFIX = '_optimized';
const MIN_BYTES = 500 * 1024; // 500 KB
const MAX_WIDTH = 1920;

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, filelist);
    else filelist.push({ path: full, size: stat.size });
  });
  return filelist;
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

async function processFile(file) {
  const rel = path.relative(ROOT, file.path);
  const ext = path.extname(file.path).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) return;

  const outRoot = rel.split(path.sep)[0] + OUT_SUFFIX;
  const outPath = path.join(ROOT, outRoot, rel.split(path.sep).slice(1).join(path.sep));

  ensureDir(outPath);

  if (file.size < MIN_BYTES) {
    // copy small files
    fs.copyFileSync(file.path, outPath);
    console.log(`copied   ${rel} -> ${path.relative(ROOT, outPath)}`);
    return;
  }

  // Skip animated GIFs (sharp doesn't preserve animation)
  if (ext === '.gif') {
    fs.copyFileSync(file.path, outPath);
    console.log(`gif copied (not resized) ${rel}`);
    return;
  }

  try {
    const img = sharp(file.path);
    const meta = await img.metadata();
    const width = meta.width || MAX_WIDTH;
    const targetWidth = Math.min(width, MAX_WIDTH);

    let pipeline = img;
    if (targetWidth < width) pipeline = pipeline.resize({ width: targetWidth });

    if (ext === '.jpg' || ext === '.jpeg') pipeline = pipeline.jpeg({ quality: 80 });
    else if (ext === '.png') pipeline = pipeline.png({ compressionLevel: 9, quality: 80 });
    else if (ext === '.webp') pipeline = pipeline.webp({ quality: 80 });

    await pipeline.toFile(outPath);
    console.log(`resized  ${rel} -> ${path.relative(ROOT, outPath)}`);
  } catch (err) {
    console.error(`error processing ${rel}:`, err.message);
    // fallback: copy
    try { fs.copyFileSync(file.path, outPath); } catch(e){}
  }
}

async function main() {
  const tasks = [];
  for (const src of SOURCES) {
    const dir = path.join(ROOT, src);
    if (!fs.existsSync(dir)) continue;
    const files = walk(dir).filter(f => ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(path.extname(f.path).toLowerCase()));
    for (const f of files) tasks.push(processFile(f));
  }

  await Promise.allSettled(tasks);
  console.log('done');
}

main().catch(e => { console.error(e); process.exit(1); });
