import {cpSync,existsSync,mkdirSync,rmSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('..',import.meta.url)),dist=join(root,'dist');
rmSync(dist,{recursive:true,force:true});mkdirSync(dist,{recursive:true});
for(const item of ['index.html','404.html','manifest.webmanifest','robots.txt','sw.js','.nojekyll','assets','src']){const from=join(root,item);if(!existsSync(from))throw new Error(`Missing build input: ${item}`);cpSync(from,join(dist,item),{recursive:true});}
writeFileSync(join(dist,'_headers'),`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Cross-Origin-Opener-Policy: same-origin\n\n/sw.js\n  Cache-Control: no-cache\n`);
console.log('Static build created in dist/.');
