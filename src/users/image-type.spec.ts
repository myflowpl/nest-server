import { detectImageType } from './image-type.js';

describe('detectImageType', () => {
  it('rozpoznaje PNG, JPEG i WebP po pierwszych bajtach', () => {
    expect(detectImageType(Buffer.from('89504e470d0a1a0a00', 'hex'))).toEqual({ mimeType: 'image/png', extension: 'png' });
    expect(detectImageType(Buffer.from('ffd8ffe000', 'hex'))).toEqual({ mimeType: 'image/jpeg', extension: 'jpg' });
    expect(detectImageType(Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBP')]))).toEqual({ mimeType: 'image/webp', extension: 'webp' });
  });

  it('inne dane i za krótkie bufory to null', () => {
    expect(detectImageType(Buffer.from('GIF89a'))).toBeNull();
    expect(detectImageType(Buffer.from('tekst'))).toBeNull();
    expect(detectImageType(Buffer.alloc(0))).toBeNull();
    expect(detectImageType(Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WAVE')]))).toBeNull();
  });
});
