import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPathInside, resolveRealPathInside } from './lib/fs-safety.mjs';

export { isPathInside };

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
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

/** Resolve an HTTP request URL without allowing traversal outside the server root. */
export function resolveRequestPath(root, rawUrl = '/') {
  const requestUrl = rawUrl === '' ? '/' : rawUrl;
  const url = new URL(requestUrl, 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.includes('\\') || pathname.includes('\0')) throw new URIError('Invalid request path');
  if (pathname.endsWith('/')) pathname += 'index.html';
  const absoluteRoot = resolve(root);
  const file = resolve(absoluteRoot, `.${pathname}`);
  return isPathInside(absoluteRoot, file) ? file : null;
}

/** Handle one request for the dependency-free static server. */
export function handleStaticRequest(absoluteRoot, request, response) {
  try {
    const method = request.method ?? 'GET';
    if (!['GET', 'HEAD'].includes(method)) {
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
    if (!existsSync(file)) {
      response.writeHead(404, { ...securityHeaders, 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    const realFile = resolveRealPathInside(absoluteRoot, file);
    if (!realFile) {
      response.writeHead(403, { ...securityHeaders, 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Forbidden');
      return;
    }
    if (!statSync(realFile).isFile()) {
      response.writeHead(404, { ...securityHeaders, 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      ...securityHeaders,
      'Content-Length': statSync(realFile).size,
      'Content-Type': mime[extname(realFile)] ?? 'application/octet-stream',
    });
    if (method === 'HEAD') response.end();
    else createReadStream(realFile).pipe(response);
  } catch (error) {
    const status = error instanceof URIError ? 400 : 500;
    response.writeHead(status, { ...securityHeaders, 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(status === 400 ? 'Bad request' : 'Internal server error');
    if (status === 500) console.error(error);
  }
}

/** Create the dependency-free static server used by `npm run dev`. */
export function createStaticServer(root = defaultRoot) {
  const absoluteRoot = resolve(root);
  return createServer((request, response) => handleStaticRequest(absoluteRoot, request, response));
}

/** Parse and validate the development server port. */
export function parsePort(value = process.env.PORT) {
  const candidate = value === undefined || value === '' ? 4173 : value;
  const port = Number(candidate);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`Invalid PORT: ${value}`);
  }
  return port;
}

/** Resolve the effective TCP port from `server.address()`. */
export function resolveBoundPort(address, requestedPort) {
  return address && typeof address === 'object' ? address.port : requestedPort;
}

/** Start the local server and report the actual bound port (including ephemeral port 0). */
export function startStaticServer(root = defaultRoot, port = parsePort(), log = console.log) {
  const server = createStaticServer(root);
  server.listen(port, '127.0.0.1', () => {
    const boundPort = resolveBoundPort(server.address(), port);
    log(`PhysMath Knowledge Tree: http://127.0.0.1:${boundPort}`);
  });
  return server;
}
