import path, { resolve } from 'path';
import { fileURLToPath } from 'url';

export function fixConfig() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl?.startsWith('file:')) return;
  
  // Przekształć ścieżkę względną względem root projektu
  const filePath = fileURLToPath(new URL(dbUrl, `file://${process.cwd()}/`));
  const absPath = resolve(filePath);
  
  process.env.DATABASE_URL = `file:${absPath}`;
}
