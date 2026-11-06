// Tworzy uszkodzone zdjęcie testowe: PNG z poprawnym nagłówkiem, ale uciętymi danymi (storage/demo/uszkodzone.png).
// Przejdzie walidację uploadu (nagłówek jest dobry), a wywróci sharp w workerze. Uruchom: npm run extra:broken-image
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

mkdirSync('storage/demo', { recursive: true });
const png = await sharp({ create: { width: 800, height: 600, channels: 3, background: '#808080', noise: { type: 'gaussian', mean: 128, sigma: 50 } } })
  .png()
  .toBuffer();
writeFileSync('storage/demo/uszkodzone.png', png.subarray(0, Math.floor(png.length * 0.6)));
console.log('✓ storage/demo/uszkodzone.png (PNG z uciętymi danymi)');
