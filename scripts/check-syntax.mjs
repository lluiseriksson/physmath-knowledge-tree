import {readdirSync,statSync} from 'node:fs';
import {join,relative} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
const files=[];
function walk(dir){for(const name of readdirSync(dir)){if(['dist','.git','node_modules'].includes(name))continue;const path=join(dir,name),stat=statSync(path);if(stat.isDirectory())walk(path);else if(/\.(?:js|mjs)$/.test(name))files.push(path);}}
walk(root);
for(const file of files){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(result.status!==0)throw new Error(`${relative(root,file)}\n${result.stderr}`);}
console.log(`Syntax checked ${files.length} JavaScript files.`);
