import {readFileSync,readdirSync,statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join,relative} from 'node:path';
const root=fileURLToPath(new URL('..',import.meta.url)),errors=[];
const textExtensions=new Set(['.html','.css','.js','.mjs','.json','.md','.yml','.yaml','.txt','.svg','.webmanifest','.editorconfig','.gitignore','.gitattributes','.npmrc','.nvmrc']);
function ext(name){const i=name.lastIndexOf('.');return i>=0?name.slice(i):name;}
function walk(dir){for(const name of readdirSync(dir)){if(['dist','.git','node_modules'].includes(name))continue;const path=join(dir,name),s=statSync(path);if(s.isDirectory())walk(path);else if(textExtensions.has(ext(name))||name.startsWith('.')){let text;try{text=readFileSync(path,'utf8')}catch{continue}const rel=relative(root,path);if(text.includes('\r'))errors.push(`${rel}: CRLF line endings`);if(text&&!text.endsWith('\n'))errors.push(`${rel}: missing final newline`);text.split('\n').forEach((line,i)=>{if(/[ \t]+$/.test(line))errors.push(`${rel}:${i+1}: trailing whitespace`);});}}}
walk(root);if(errors.length)throw new Error(errors.slice(0,30).join('\n'));console.log('Formatting invariants passed.');
