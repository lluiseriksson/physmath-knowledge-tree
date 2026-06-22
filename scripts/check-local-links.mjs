import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join,normalize} from 'node:path';
const root=fileURLToPath(new URL('..',import.meta.url)),errors=[];
function checkFile(file){const absolute=join(root,file),text=readFileSync(absolute,'utf8');for(const match of text.matchAll(/(?:href|src)=["']([^"']+)["']/g)){const value=match[1];if(/^(?:https?:|data:|mailto:|#)/.test(value))continue;const clean=value.split(/[?#]/)[0];if(!clean)continue;const target=normalize(join(dirname(absolute),clean));if(!target.startsWith(root)||!existsSync(target))errors.push(`${file}: missing ${value}`);}if(file==='index.html'){if(/<script(?![^>]*\bsrc=)/i.test(text))errors.push('index.html: inline script violates CSP');if(/<style\b/i.test(text)||/\sstyle=["']/i.test(text))errors.push('index.html: inline style violates CSP');}}
checkFile('index.html');checkFile('404.html');
const sw=readFileSync(join(root,'sw.js'),'utf8');for(const match of sw.matchAll(/["'](\.\/[^"']+)["']/g)){const path=match[1];if(path==='./')continue;if(!existsSync(join(root,path)))errors.push(`sw.js: missing cached asset ${path}`);}
if(errors.length)throw new Error(errors.join('\n'));console.log('Local links and service-worker assets validated.');
