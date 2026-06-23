import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const base = path.join(root, 'integrations', 'yang-mills');
const read = rel => JSON.parse(fs.readFileSync(path.join(base, rel), 'utf8'));
const writeOrCheck = (rel, text, check) => {
  const p = path.join(base, rel);
  if (check) {
    const old = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
    if (old !== text) throw new Error(`generated file is stale: ${rel}`);
  } else {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, text);
  }
};
const esc = s => String(s).replaceAll('|', '\\|').replaceAll('\n', ' ');
const check = process.argv.includes('--check');
const state = read('data/repository-state.json');
const decls = read('data/declarations.json').declarations;
const pipeline = read('data/theorem-pipeline.json');
const frontier = read('data/hypothesis-frontier.json').obligations;
const roadmap = read('data/commit-roadmap.json').commits;
const rules = read('data/decision-rules.json');

const verified = decls.filter(x => x.status === 'verified');
const planned = decls.filter(x => x.status === 'planned');
const next = roadmap.find(x => x.status === 'next');

const context = `# Compact Yang–Mills agent context\n\n` +
`- Inspected HEAD: \`${state.snapshot.head}\` (${state.snapshot.head_message})\n` +
`- Ledger: Addendum ${state.snapshot.ledger_addendum}; verified core ${state.snapshot.verified_core_jobs} jobs.\n` +
`- Current frontier: ${state.current_frontier}\n` +
`- Next commit: **${next.title}** (risk: ${next.risk}).\n` +
`- Preferred physical follow-up: named marginal SingleScaleUVDecay consumer.\n\n` +
`## Verified declaration path\n\n` + verified.map(x => `- \`${x.name}\` — ${x.role}`).join('\n') +
`\n\n## Planned declarations\n\n` + planned.map(x => `- \`${x.name}\` — ${x.role}`).join('\n') +
`\n\n## Next commit contract\n\n` +
`**Files:** ${next.files.map(x => `\`${x}\``).join(', ')}\n\n` +
`**Conclusion:** ${next.conclusion}\n\n` +
`**Still conditional:** ${next.remains_conditional.join(', ')}.\n\n` +
`## Hard guardrails\n\n` + rules.rules.map(x => `- ${x.must ?? `Do not: ${x.must_not}`}`).join('\n') +
`\n\n## Refresh before use\n\n` + state.refresh_protocol.map(x => `1. ${x}`).join('\n') + '\n';

const table = '# Yang–Mills analytic frontier\n\n| ID | Obligation | Status | Lean shape | Source anchor | Uniformity |\n|---|---|---|---|---|---|\n' +
frontier.map(x => `| ${esc(x.id)} | ${esc(x.label)} | ${esc(x.status)} | ${esc(x.lean_shape)} | ${esc(x.source_anchor)} | ${esc(x.uniformity.join(', '))} |`).join('\n') + '\n';

const road = '# Yang–Mills commit roadmap\n\n' + roadmap.map(c =>
`## ${c.order}. ${c.title}\n\n- Status: ${c.status}\n- Risk: ${c.risk}\n- Files: ${c.files.map(x => `\`${x}\``).join(', ')}\n- Conclusion: ${c.conclusion}\n- Remains conditional: ${c.remains_conditional.join(', ')}\n- Verification:\n${c.verification.map(v => `  - \`${v}\``).join('\n')}\n`).join('\n');

writeOrCheck('generated/agent-context.md', context, check);
writeOrCheck('generated/frontier-table.md', table, check);
writeOrCheck('generated/roadmap.md', road, check);
console.log(check ? 'Yang–Mills generated context is current.' : 'Generated Yang–Mills agent context.');
