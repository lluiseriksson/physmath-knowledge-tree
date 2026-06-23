import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
const base = path.join(process.cwd(), 'integrations', 'yang-mills');
const read = rel => JSON.parse(fs.readFileSync(path.join(base, rel), 'utf8'));
const state = read('data/repository-state.json');
const declarations = read('data/declarations.json').declarations;
const pipeline = read('data/theorem-pipeline.json');
const frontier = read('data/hypothesis-frontier.json').obligations;
const roadmap = read('data/commit-roadmap.json').commits;
const rules = read('data/decision-rules.json');
const [command = 'help', arg] = process.argv.slice(2);
const out = x => console.log(typeof x === 'string' ? x : JSON.stringify(x, null, 2));
if (command === 'status') out(state);
else if (command === 'next-commit') out(roadmap.find(x => x.status === 'next'));
else if (command === 'roadmap') out(roadmap);
else if (command === 'declaration') {
  const hits = declarations.filter(x => x.id.includes(arg ?? '') || x.name.includes(arg ?? ''));
  if (!hits.length) process.exitCode = 2;
  out(hits);
} else if (command === 'obligation') {
  const hits = frontier.filter(x => x.id.includes(arg ?? '') || x.label.toLowerCase().includes((arg ?? '').toLowerCase()));
  if (!hits.length) process.exitCode = 2;
  out(hits);
} else if (command === 'route') {
  const hits = pipeline.routes.filter(x => x.id.includes(arg ?? '') || x.purpose.toLowerCase().includes((arg ?? '').toLowerCase()));
  if (!hits.length) process.exitCode = 2;
  out(hits);
} else if (command === 'guardrails') out({ rules: rules.rules, forbidden: rules.forbidden_phrases_without_proof });
else out(`Commands:\n  status\n  next-commit\n  roadmap\n  declaration <name-or-id>\n  obligation <name-or-id>\n  route <geometric|marginal|single-scale>\n  guardrails`);
