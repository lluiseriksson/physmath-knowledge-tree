import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePort, startStaticServer } from './serve.mjs';

const defaultRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const root = resolve(process.argv[2] || defaultRoot);
startStaticServer(root, parsePort(process.env.PORT));
