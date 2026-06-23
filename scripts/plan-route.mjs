import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  CONFIDENCE_LEVELS,
  ROUTE_POLICIES,
  planResearchRoute,
  DEFAULT_MAX_ROUTE_STATES,
  summarizeRouteEvidence,
} from '../src/lib/route-planner.js';
import { compareText } from '../src/lib/text.js';

const root = fileURLToPath(new URL('..', import.meta.url));

export const ROUTE_USAGE = `Usage:
  npm run route:plan -- <source-id> <target-id> [options]
  npm run route:plan -- --from <source-id> --to <target-id> [options]

Options:
  --policy shortest|balanced|strongest   Route objective (default: strongest)
  --compare                              Emit all three policies side by side
  --allow formal,literature,...          Permitted evidence classes
  --directed                             Follow edge direction only
  --max-edges N                          Hard route-length ceiling
  --max-states N                         Search safety ceiling (default: 50000)
  --format markdown|json                 Output format (default: markdown)
  --nodes PATH                           Alternate node JSON file
  --edges PATH                           Alternate edge JSON file
  --output PATH                          Write output to a file
  --help                                 Show this help
`;

/** @param {string[]} argv */
export function parseRouteArguments(argv) {
  const result = {
    source: null,
    target: null,
    policy: 'strongest',
    compare: false,
    allowedConfidence: undefined,
    directed: false,
    maxEdges: undefined,
    maxStates: DEFAULT_MAX_ROUTE_STATES,
    format: 'markdown',
    nodesPath: resolve(root, 'graph/nodes/core.json'),
    edgesPath: resolve(root, 'graph/edges.json'),
    outputPath: null,
    help: false,
  };
  const positional = [];

  const takeValue = (argument, index) => {
    const separator = argument.indexOf('=');
    if (separator >= 0) return { value: argument.slice(separator + 1), consumed: 0 };
    if (index + 1 >= argv.length) throw new Error(`Missing value for ${argument}`);
    return { value: argv[index + 1], consumed: 1 };
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') {
      result.help = true;
      continue;
    }
    if (argument === '--directed') {
      result.directed = true;
      continue;
    }
    if (argument === '--compare') {
      result.compare = true;
      continue;
    }
    if (!argument.startsWith('-')) {
      positional.push(argument);
      continue;
    }

    const name = argument.split('=', 1)[0];
    const { value, consumed } = takeValue(argument, index);
    index += consumed;
    if (name === '--from') result.source = value;
    else if (name === '--to') result.target = value;
    else if (name === '--policy') result.policy = value;
    else if (name === '--allow') result.allowedConfidence = value.split(',').map((item) => item.trim()).filter(Boolean);
    else if (name === '--max-edges') result.maxEdges = Number(value);
    else if (name === '--max-states') result.maxStates = Number(value);
    else if (name === '--format') result.format = value;
    else if (name === '--nodes') result.nodesPath = resolve(value);
    else if (name === '--edges') result.edgesPath = resolve(value);
    else if (name === '--output') result.outputPath = resolve(value);
    else throw new Error(`Unknown option: ${name}`);
  }

  if (!result.source && positional.length > 0) result.source = positional.shift();
  if (!result.target && positional.length > 0) result.target = positional.shift();
  if (positional.length > 0) throw new Error(`Unexpected positional arguments: ${positional.join(' ')}`);
  if (!ROUTE_POLICIES.includes(result.policy)) throw new Error(`Unknown route policy: ${result.policy}`);
  if (!['markdown', 'json'].includes(result.format)) throw new Error(`Unknown output format: ${result.format}`);
  if (result.allowedConfidence?.some((value) => !CONFIDENCE_LEVELS.includes(value))) {
    throw new Error(`Unknown confidence in --allow: ${result.allowedConfidence.join(',')}`);
  }
  if (result.maxEdges !== undefined && (!Number.isInteger(result.maxEdges) || result.maxEdges < 0)) {
    throw new Error('--max-edges must be a non-negative integer');
  }
  if (!Number.isInteger(result.maxStates) || result.maxStates < 1) {
    throw new Error('--max-states must be a positive integer');
  }
  return result;
}

/** @param {Array<Record<string, any>>} edges @param {{edges:string[]}} route */
function routeReferences(edges, route) {
  const edgeById = new Map(edges.map((edge) => [edge.id, edge]));
  const references = [];
  const seen = new Set();
  for (const edgeId of route.edges) {
    const edge = edgeById.get(edgeId);
    for (const reference of edge?.references ?? []) {
      const key = `${reference.url ?? ''}\0${reference.label ?? ''}`;
      if (seen.has(key)) continue;
      seen.add(key);
      references.push(reference);
    }
  }
  return references.sort((left, right) =>
    compareText(String(left.url ?? ''), String(right.url ?? ''))
    || compareText(String(left.label ?? ''), String(right.label ?? ''))
    || compareText(String(left.scope ?? ''), String(right.scope ?? ''))
    || compareText(String(left.type ?? ''), String(right.type ?? '')));
}

/** @param {Array<Record<string, any>>} nodes @param {Array<Record<string, any>>} edges @param {any} route */
function routeStepLines(nodes, edges, route) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const edgeById = new Map(edges.map((edge) => [edge.id, edge]));
  const lines = [];
  route.nodes.forEach((nodeId, index) => {
    const node = nodeById.get(nodeId);
    lines.push(`${index + 1}. **${node?.title ?? nodeId}** (\`${nodeId}\`)`);
    const edgeId = route.edges[index];
    if (!edgeId) return;
    const edge = edgeById.get(edgeId);
    if (!edge) {
      lines.push(`   - Missing edge metadata: \`${edgeId}\``);
      return;
    }
    lines.push(`   - ${edge.relation ?? 'connects'} - **${edge.confidence ?? 'unknown'}** - \`${edge.id}\``);
    if (edge.mechanism) lines.push(`   - ${edge.mechanism}`);
  });
  return lines;
}

/** @param {any} route @param {any} summary */
function routeMetadataLines(route, summary) {
  return [
    `- Policy: \`${route.score.policy}\``,
    `- Hops: ${route.score.hops}`,
    `- Weakest edge: ${summary.weakest_confidence ?? 'none'}`,
    `- References on route: ${summary.references} (${summary.source_bearing_references} claim/formalization)`,
  ];
}

/** @param {Array<Record<string, any>>} nodes @param {Array<Record<string, any>>} edges @param {any} route @param {any} summary */
export function formatRouteMarkdown(nodes, edges, route, summary) {
  const lines = [
    '# Evidence-aware research route',
    '',
    ...routeMetadataLines(route, summary),
    '',
    '> This is a graph-derived navigation aid, not a theorem or a promotion of any evidence label.',
    '',
    '## Route',
    '',
    ...routeStepLines(nodes, edges, route),
  ];
  const references = routeReferences(edges, route);
  if (references.length > 0) {
    lines.push('', '## References', '');
    for (const reference of references) {
      lines.push(`- [${reference.label ?? reference.url}](${reference.url}) -- ${reference.scope ?? 'context'}`);
    }
  }
  return `${lines.join('\n')}\n`;
}

/** @param {Array<Record<string, any>>} nodes @param {Array<Record<string, any>>} edges @param {Record<string, any>} plans */
export function formatRouteComparisonMarkdown(nodes, edges, plans) {
  const lines = [
    '# Evidence-aware route comparison',
    '',
    '> These are graph-derived navigation aids, not theorems or promotions of any evidence label.',
  ];
  for (const policy of ROUTE_POLICIES) {
    lines.push('', `## ${policy}`, '');
    const plan = plans[policy];
    if (!plan) {
      lines.push('No route satisfies the selected direction, evidence gate and edge budget.');
      continue;
    }
    lines.push(...routeMetadataLines(plan.route, plan.evidence), '', '### Route', '');
    lines.push(...routeStepLines(nodes, edges, plan.route));
    const references = routeReferences(edges, plan.route);
    if (references.length > 0) {
      lines.push('', '### References', '');
      for (const reference of references) {
        lines.push(`- [${reference.label ?? reference.url}](${reference.url}) -- ${reference.scope ?? 'context'}`);
      }
    }
  }
  return `${lines.join('\n')}\n`;
}

/** @param {ReturnType<typeof parseRouteArguments>} options */
function routeConstraints(options) {
  return {
    directed: options.directed,
    allowed_confidence: options.allowedConfidence ?? [...CONFIDENCE_LEVELS],
    maximum_edges: options.maxEdges ?? null,
    maximum_states: options.maxStates,
  };
}

/** @param {ReturnType<typeof parseRouteArguments>} options */
export function executeRoutePlan(options) {
  if (options.help) return { exitCode: 0, output: ROUTE_USAGE };
  if (!options.source || !options.target) return { exitCode: 2, output: ROUTE_USAGE };

  const nodes = JSON.parse(readFileSync(options.nodesPath, 'utf8'));
  const edges = JSON.parse(readFileSync(options.edgesPath, 'utf8'));
  if (!Array.isArray(nodes) || !Array.isArray(edges)) throw new Error('Node and edge inputs must be JSON arrays');

  const policies = options.compare ? ROUTE_POLICIES : [options.policy];
  const plans = {};
  for (const policy of policies) {
    const route = planResearchRoute(nodes, edges, options.source, options.target, {
      policy,
      directed: options.directed,
      allowedConfidence: options.allowedConfidence,
      maxEdges: options.maxEdges,
      maxStates: options.maxStates,
    });
    plans[policy] = route ? { route, evidence: summarizeRouteEvidence(route, edges) } : null;
  }
  if (policies.every((policy) => !plans[policy])) {
    return {
      exitCode: 3,
      output: `No route found from ${options.source} to ${options.target} under the selected policy.\n`,
    };
  }

  let output;
  if (options.compare) {
    const payload = {
      source: options.source,
      target: options.target,
      constraints: routeConstraints(options),
      routes: plans,
    };
    output = options.format === 'json'
      ? `${JSON.stringify(payload, null, 2)}\n`
      : formatRouteComparisonMarkdown(nodes, edges, plans);
  } else {
    const plan = plans[options.policy];
    const payload = {
      source: options.source,
      target: options.target,
      constraints: routeConstraints(options),
      route: plan.route,
      evidence: plan.evidence,
    };
    output = options.format === 'json'
      ? `${JSON.stringify(payload, null, 2)}\n`
      : formatRouteMarkdown(nodes, edges, plan.route, plan.evidence);
  }
  if (options.outputPath) writeFileSync(options.outputPath, output);
  return { exitCode: 0, output };
}

const invokedAsScript = process.argv[1]
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (invokedAsScript) {
  try {
    const options = parseRouteArguments(process.argv.slice(2));
    const result = executeRoutePlan(options);
    if (!options.outputPath || result.exitCode !== 0) {
      (result.exitCode === 0 ? process.stdout : process.stderr).write(result.output);
    }
    process.exitCode = result.exitCode;
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 2;
  }
}
