import { createHash } from 'node:crypto';
import { basename, extname } from 'node:path';

const MEDIA_TYPES = new Map([
  ['.txt', 'text/plain'],
  ['.md', 'text/markdown'],
  ['.png', 'image/png'],
]);

/** @param {string} value */
export function normalizeSourceId(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/** @param {Buffer|Uint8Array} bytes */
export function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

/** @param {Buffer} bytes */
export function inspectPng(bytes) {
  if (bytes.length < 24 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    throw new Error('Invalid PNG header');
  }
  if (bytes.readUInt32BE(8) !== 13 || bytes.subarray(12, 16).toString('ascii') !== 'IHDR') {
    throw new Error('PNG must begin with a valid IHDR chunk');
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width < 1 || height < 1) throw new Error('PNG dimensions must be positive');
  return { width, height };
}

/**
 * Build deterministic source metadata without retaining the source itself.
 * @param {string} sourcePath
 * @param {Buffer} bytes
 */
export function inspectSource(sourcePath, bytes) {
  const extension = extname(sourcePath).toLowerCase();
  const mediaType = MEDIA_TYPES.get(extension);
  if (!mediaType) throw new Error(`Unsupported source extension: ${extension || '(none)'}`);
  const source = {
    filename: basename(sourcePath),
    media_type: mediaType,
    sha256: sha256(bytes),
    bytes: bytes.length,
  };
  if (mediaType.startsWith('text/')) {
    let text;
    try {
      text = new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/\r\n?/g, '\n');
    } catch {
      throw new Error('Text source must be valid UTF-8');
    }
    const newlineCount = (text.match(/\n/g) ?? []).length;
    source.lines = text.length === 0 ? 1 : newlineCount + (text.endsWith('\n') ? 0 : 1);
  } else if (mediaType === 'image/png') {
    Object.assign(source, inspectPng(bytes));
  }
  return source;
}

/** @param {Record<string, unknown>} expected @param {Record<string, unknown>} actual */
export function compareSourceMetadata(expected, actual) {
  const fields = ['media_type', 'sha256', 'bytes', 'lines', 'width', 'height'];
  const differences = [];
  for (const field of fields) {
    if (expected[field] === undefined && actual[field] === undefined) continue;
    if (expected[field] !== actual[field]) {
      differences.push(`${field}: expected ${String(expected[field])}, got ${String(actual[field])}`);
    }
  }
  return differences;
}
