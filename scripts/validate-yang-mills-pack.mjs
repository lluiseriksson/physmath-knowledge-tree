import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const base = path.join(root, 'integrations', 'yang-mills');
const read = rel => JSON.parse(fs.readFileSync(path.join(base, rel), 'utf8'));
const exists = rel => fs.existsSync(path.join(root, rel));
const fail = message => { throw new Error(message); };

const manifest = read('manifest.json');
const state = read('data/repository-state.json');
const declarationsDoc = read('data/declarations.json');
const pipeline = read('data/theorem-pipeline.json');
const frontier = read('data/hypothesis-frontier.json');
const roadmap = read('data/commit-roadmap.json');
const sources = read('data/source-map.json');
const moves = read('data/research-moves.json');
const rules = read('data/decision-rules.json');
const scenarios = read('evaluation/scenarios.json');

const gates = [];
const gate = (name, fn) => { fn(); gates.push({ name, pass: true }); };
const unique = (xs, label) => {
  const seen = new Set();
  for (const x of xs) {
    if (seen.has(x)) fail(`duplicate ${label}: ${x}`);
    seen.add(x);
  }
};

gate('json-and-manifest', () => {
  if (manifest.pack_version !== '1.0.0') fail('unexpected pack version');
  for (const rel of manifest.entrypoints) if (!exists(rel)) fail(`missing entrypoint: ${rel}`);
});

gate('unique-identifiers', () => {
  unique(declarationsDoc.declarations.map(x => x.id), 'declaration id');
  unique(declarationsDoc.declarations.map(x => x.name), 'declaration name');
  unique(frontier.obligations.map(x => x.id), 'obligation id');
  unique(roadmap.commits.map(x => x.id), 'commit id');
  unique(moves.moves.map(x => x.id), 'move id');
  unique(rules.rules.map(x => x.id), 'rule id');
  unique(scenarios.scenarios.map(x => x.id), 'scenario id');
});

gate('resolved-declaration-routes', () => {
  const ids = new Set(declarationsDoc.declarations.map(x => x.id));
  for (const route of pipeline.routes) {
    for (const step of route.steps) if (!ids.has(step)) fail(`unknown route step ${step}`);
  }
});

gate('resolved-obligations', () => {
  const ids = new Set(frontier.obligations.map(x => x.id));
  for (const route of pipeline.routes) {
    for (const id of route.remaining_obligations) if (!ids.has(id)) fail(`unknown obligation ${id}`);
  }
  for (const o of frontier.obligations) {
    for (const id of o.blocked_by ?? []) if (!ids.has(id)) fail(`unknown blocker ${id}`);
  }
});

gate('status-discipline', () => {
  for (const d of declarationsDoc.declarations) {
    if (!['verified', 'planned'].includes(d.status)) fail(`bad declaration status ${d.id}`);
    if (d.status === 'planned' && d.verified_at) fail(`planned declaration has verified_at: ${d.id}`);
    if (d.status === 'verified' && !d.verified_at) fail(`verified declaration lacks verified_at: ${d.id}`);
  }
});

gate('analytic-honesty', () => {
  const forbidden = new Set(['proved', 'lean-verified']);
  for (const s of sources.sources) if (forbidden.has(s.claim_status)) fail(`source overclaim: ${s.id}`);
  for (const o of frontier.obligations) {
    if (o.id !== 'obl.ir-input' && o.status === 'theorem-fed') fail(`unexpected theorem-fed analytic obligation: ${o.id}`);
  }
});

gate('branch-fidelity', () => {
  const names = declarationsDoc.declarations.map(x => x.name).join('\n');
  if (!names.includes('_geometric')) fail('missing geometric suffix');
  if (!names.includes('_marginal')) fail('missing marginal suffix');
  if (!pipeline.selection_rule.includes('Prefer the marginal route')) fail('missing branch selection rule');
});

gate('support-and-uniformity', () => {
  const support = frontier.obligations.find(x => x.id === 'obl.support-localization');
  const expected = ['spectator','fluctuation','physical-active','Omega','skeleton','full-target'];
  for (const role of expected) if (!support.support_roles.includes(role)) fail(`missing support role ${role}`);
  const uniform = frontier.obligations.find(x => x.id === 'obl.uniform-constants');
  if (!uniform.lean_shape.startsWith('exists constants, forall')) fail('bad uniformity quantifier order');
});

gate('guardrails-and-evaluation', () => {
  const guard = manifest.guardrails.join(' ') + rules.forbidden_phrases_without_proof.join(' ');
  for (const term of ['hRpoly','Clay','support','marginal','HEAD']) if (!guard.includes(term)) fail(`missing guardrail ${term}`);
  const score = scenarios.scenarios.reduce((n, s) => n + s.score, 0);
  if (score !== scenarios.maximum_score || score !== 100) fail(`evaluation score is ${score}`);
});

gate('roadmap-order-and-generation', () => {
  const orders = roadmap.commits.map(x => x.order);
  unique(orders, 'roadmap order');
  if (Math.min(...orders) !== 1 || Math.max(...orders) !== roadmap.commits.length) fail('roadmap order not contiguous');
  if (roadmap.commits[0].id !== state.recommended_next_commit) fail('state and roadmap disagree on next commit');
  for (const rel of ['integrations/yang-mills/generated/agent-context.md','integrations/yang-mills/generated/frontier-table.md','integrations/yang-mills/generated/roadmap.md']) {
    if (!exists(rel)) fail(`missing generated file ${rel}`);
  }
});

const score = gates.filter(x => x.pass).length * 10;
console.log(JSON.stringify({ score, maximum: 100, gates }, null, 2));
if (score !== 100) process.exitCode = 1;
