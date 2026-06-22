import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const workflowDir = path.join(root, '.github', 'workflows');
const files = (await readdir(workflowDir)).filter((name) => /\.ya?ml$/u.test(name)).sort();
const errors = [];
let externalActions = 0;

for (const file of files) {
  const relative = path.posix.join('.github/workflows', file);
  const lines = (await readFile(path.join(workflowDir, file), 'utf8')).split(/\r?\n/u);
  const text = lines.join('\n');

  if (!/^permissions:\s*$/mu.test(text)) {
    errors.push(`${relative}: missing explicit workflow permissions`);
  }

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^\s*-?\s*uses:\s*([^\s#]+)(?:\s+#\s*(.+))?\s*$/u);
    if (!match) continue;
    const action = match[1];
    if (action.startsWith('./')) continue;
    externalActions += 1;
    const separator = action.lastIndexOf('@');
    const revision = separator >= 0 ? action.slice(separator + 1) : '';
    if (!/^[0-9a-f]{40}$/u.test(revision)) {
      errors.push(`${relative}:${index + 1}: external action must be pinned to a full commit SHA`);
    }
    if (!match[2] || !/^v\d/u.test(match[2])) {
      errors.push(`${relative}:${index + 1}: pinned action needs a readable version comment`);
    }

    if (action.startsWith('actions/checkout@')) {
      const following = lines.slice(index + 1, index + 5).join('\n');
      if (!/persist-credentials:\s*false/u.test(following)) {
        errors.push(`${relative}:${index + 1}: checkout must disable persisted credentials`);
      }
    }
  }
}

if (errors.length) throw new Error(errors.join('\n'));
console.log(`Validated ${files.length} workflows and ${externalActions} SHA-pinned external action uses.`);
