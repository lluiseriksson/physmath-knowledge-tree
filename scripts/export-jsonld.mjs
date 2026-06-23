import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildJsonLd, DEFAULT_ENTITY_BASE } from '../src/lib/jsonld.js';

const root = fileURLToPath(new URL('..', import.meta.url));
export const CANONICAL_JSONLD_PATH = 'graph/knowledge-graph.jsonld';

export const JSONLD_USAGE = `Usage:
  npm run export:jsonld -- [options]
  npm run generate:jsonld

Options:
  --output PATH   Write JSON-LD to a file instead of stdout
  --base URL      Override the stable entity IRI base
  --compact       Emit compact JSON instead of indented JSON
  --check         Confirm the committed canonical projection is current
  --help          Show this help
`;

/** @param {string[]} argv */
export function parseJsonLdArguments(argv) {
  const options = {
    outputPath: null,
    entityBase: DEFAULT_ENTITY_BASE,
    pretty: true,
    check: false,
    help: false,
  };
  const takeValue = (argument, index) => {
    const separator = argument.indexOf('=');
    if (separator >= 0) {
      const value = argument.slice(separator + 1);
      if (!value) throw new Error(`Missing value for ${argument.slice(0, separator)}`);
      return { value, consumed: 0 };
    }
    if (index + 1 >= argv.length) throw new Error(`Missing value for ${argument}`);
    return { value: argv[index + 1], consumed: 1 };
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') options.help = true;
    else if (argument === '--compact') options.pretty = false;
    else if (argument === '--check') options.check = true;
    else {
      const name = argument.split('=', 1)[0];
      if (!['--output', '--base'].includes(name)) throw new Error(`Unknown option: ${name}`);
      const { value, consumed } = takeValue(argument, index);
      index += consumed;
      if (name === '--output') options.outputPath = resolve(value);
      else options.entityBase = value;
    }
  }
  if (options.check && (options.outputPath || !options.pretty || options.entityBase !== DEFAULT_ENTITY_BASE)) {
    throw new Error('--check validates the canonical pretty projection and cannot be combined with output, base or compact options');
  }
  return options;
}

/** @param {string} repositoryRoot @param {string} path */
function readJson(repositoryRoot, path) {
  return JSON.parse(readFileSync(resolve(repositoryRoot, path), 'utf8'));
}

/** @param {string} repositoryRoot @param {string} entityBase */
export function buildCanonicalJsonLd(repositoryRoot = root, entityBase = DEFAULT_ENTITY_BASE) {
  const index = readJson(repositoryRoot, 'graph/index.json');
  const pkg = readJson(repositoryRoot, 'package.json');
  return buildJsonLd({
    index,
    packageVersion: pkg.version,
    nodes: readJson(repositoryRoot, index.canonical_files.nodes),
    edges: readJson(repositoryRoot, index.canonical_files.edges),
    moves: readJson(repositoryRoot, index.canonical_files.research_moves),
    collections: readJson(repositoryRoot, index.canonical_files.collections),
    entityBase,
  });
}

/** @param {ReturnType<typeof parseJsonLdArguments>} options @param {string} [repositoryRoot] */
export function executeJsonLdExport(options, repositoryRoot = root) {
  if (options.help) return { exitCode: 0, output: JSONLD_USAGE, entities: 0 };
  const document = buildCanonicalJsonLd(repositoryRoot, options.entityBase);
  const output = `${JSON.stringify(document, null, options.pretty ? 2 : 0)}\n`;
  const entities = document['@graph'].length;

  if (options.check) {
    const canonicalPath = resolve(repositoryRoot, CANONICAL_JSONLD_PATH);
    if (!existsSync(canonicalPath)) throw new Error(`Missing generated JSON-LD projection: ${CANONICAL_JSONLD_PATH}`);
    if (readFileSync(canonicalPath, 'utf8') !== output) {
      throw new Error(`Stale generated JSON-LD projection: run npm run generate:jsonld`);
    }
    return {
      exitCode: 0,
      output: `Validated deterministic JSON-LD projection with ${entities} entities.\n`,
      entities,
    };
  }

  if (options.outputPath) writeFileSync(options.outputPath, output);
  return { exitCode: 0, output, entities };
}

const invokedAsScript = process.argv[1]
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (invokedAsScript) {
  try {
    const options = parseJsonLdArguments(process.argv.slice(2));
    const result = executeJsonLdExport(options);
    if (!options.outputPath || options.check) process.stdout.write(result.output);
    process.exitCode = result.exitCode;
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 2;
  }
}
