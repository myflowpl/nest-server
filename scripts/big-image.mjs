// Tworzy duże zdjęcie testowe (losowy szum, 6000x4000 px) w storage/demo/big.jpg.
// Uruchom: npm run extra:big-image
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

mkdirSync('storage/demo', { recursive: true });
const started = Date.now();
await sharp({ create: { width: 6000, height: 4000, channels: 3, background: '#808080', noise: { type: 'gaussian', mean: 128, sigma: 40 } } })
  .jpeg({ quality: 90 })
  .toFile('storage/demo/big.jpg');
console.log(`✓ storage/demo/big.jpg (6000x4000) w ${Date.now() - started} ms`);
