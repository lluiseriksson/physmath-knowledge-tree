import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const defaultRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

const securityHeaders = {
  'Cache-Control': 'no-store',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'",
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
};

/** Resolve an HTTP request URL without allowing traversal outside the server root. */
export function resolveRequestPath(root, rawUrl) {
  const url = new URL(rawUrl || '/', 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = resolve(root, `.${pathname}`);
  const rel = relative(root, file);
  if (rel === '' || rel.startsWith('..') || isAbsolute(rel)) return null;
  return file;
}

/** Create the dependency-free static server used by `npm run dev`. */
export function createStaticServer(root = defaultRoot) {
  const absoluteRoot = resolve(root);
  return createServer((request, response) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method ?? 'GET')) {
        response.writeHead(405, { ...securityHeaders, Allow: 'GET, HEAD' });
        response.end();
        return;
      }

      const file = resolveRequestPath(absoluteRoot, request.url ?? '/');
      if (!file) {
        response.writeHead(403, { ...securityHeaders, 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Forbidden');
        return;
      }
      if (!existsSync(file) || !statSync(file).isFile()) {
        response.writeHead(404, { ...securityHeaders, 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
      }

      response.writeHead(200, {
        ...securityHeaders,
        'Content-Length': statSync(file).size,
        'Content-Type': mime[extname(file)] ?? 'application/octet-stream',
      });
      if (request.method === 'HEAD') response.end();
      else createReadStream(file).pipe(response);
    } catch (error) {
      const status = error instanceof URIError ? 400 : 500;
      response.writeHead(status, { ...securityHeaders, 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(status === 400 ? 'Bad request' : 'Internal server error');
      if (status === 500) console.error(error);
    }
  });
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMain) {
  const root = resolve(process.argv[2] || defaultRoot);
  const port = Number(process.env.PORT || 4173);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error(`Invalid PORT: ${process.env.PORT}`);
  createStaticServer(root).listen(port, '127.0.0.1', () => {
    console.log(`PhysMath Knowledge Tree: http://127.0.0.1:${port}`);
  });
}
