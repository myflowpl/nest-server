export interface ImageType {
  mimeType: string;
  extension: string;
}

/** Rozpoznaje JPEG, PNG i WebP po pierwszych bajtach pliku (nagłówek Content-Type od klienta można podrobić). */
export function detectImageType(buffer: Buffer): ImageType | null {
  if (buffer.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) {
    return { mimeType: 'image/png', extension: 'png' };
  }
  if (buffer.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex'))) {
    return { mimeType: 'image/jpeg', extension: 'jpg' };
  }
  if (buffer.subarray(0, 4).toString('latin1') === 'RIFF' && buffer.subarray(8, 12).toString('latin1') === 'WEBP') {
    return { mimeType: 'image/webp', extension: 'webp' };
  }
  return null;
}
