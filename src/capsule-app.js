import {
  buildResearchCapsule,
  importResearchCapsule,
  researchCapsuleMarkdown,
} from './lib/research-capsule.js';
import { importResearchDossier } from './lib/research-dossier.js';
import {
  mergeRunLedgers,
  normalizeRunLedger,
  parseRunImport,
} from './lib/run-ledger.js';

const RUN_STORAGE_KEY = 'physmath.research.runs.v1';
const SETTING_PREFIX = 'physmath.capsules.';
const MAX_FILE_BYTES = 20_000_000;
const byId = (id) => document.getElementById(id);
const ui = Object.fromEntries([
  'loading', 'capsule-center', 'language', 'theme', 'help', 'help-dialog', 'capsule-title',
  'import-dossier', 'load-local-runs', 'import-runs', 'dossier-file', 'run-file', 'input-status',
  'stat-scope', 'stat-relevant', 'stat-selected', 'stat-passed', 'stat-artifacts', 'stat-actions',
  'select-relevant', 'select-ready', 'clear-selection', 'build-capsule', 'export-json', 'export-markdown',
  'verify-import', 'capsule-file', 'readiness-badge', 'dossier-summary', 'run-count', 'run-list',
  'run-empty', 'gate-list', 'action-list', 'toasts',
].map((id) => [id.replaceAll('-', '_'), byId(id)]));

const MESSAGES = {
  en: {
    'nav.skip': 'Skip to research capsules', 'nav.primary': 'Primary navigation', 'nav.research': 'Research graph',
    'nav.learning': 'Learning map', 'nav.workbench': 'Workbench', 'nav.evidence': 'Evidence', 'nav.changes': 'Changes',
    'nav.formalization': 'Lean audit', 'nav.dossiers': 'Dossiers', 'nav.runs': 'Runs', 'nav.capsules': 'Capsules', 'nav.repository': 'Repository',
    'app.tagline': 'Fingerprint dossiers, runs and artifacts together', 'header.language': 'Interface language',
    'header.theme': 'Change theme', 'header.help': 'Research capsule help', 'loading': 'Loading canonical nodes and local runs…',
    'controls.eyebrow': 'Portable research handoff', 'controls.title': 'Capsule builder', 'inputs.title': 'Inputs',
    'inputs.name': 'Capsule title', 'inputs.namePlaceholder': 'Research capsule', 'inputs.dossier': 'Import dossier JSON',
    'inputs.localRuns': 'Reload local run ledger', 'inputs.runFile': 'Import run ledger or manifest',
    'inputs.dossierFile': 'Research dossier import file', 'inputs.runImportFile': 'Run ledger import file',
    'summary.title': 'Capsule summary', 'summary.scope': 'Scope nodes', 'summary.relevant': 'Relevant runs',
    'summary.selected': 'Selected runs', 'summary.passed': 'Passed', 'summary.artifacts': 'Artifacts', 'summary.actions': 'Open actions',
    'selection.title': 'Run selection', 'selection.relevant': 'Select scope-linked', 'selection.ready': 'Select passed & fingerprinted',
    'selection.clear': 'Clear selection', 'export.title': 'Build and verify', 'export.build': 'Build capsule',
    'export.json': 'Export capsule JSON', 'export.markdown': 'Export capsule Markdown', 'export.verify': 'Verify capsule JSON',
    'export.file': 'Research capsule verification file', 'hero.eyebrow': 'Reproducible campaign boundary',
    'hero.title': 'Bind intent, execution and artifacts into one verifiable handoff',
    'hero.body': 'A capsule carries the verified dossier and selected run manifests. It can expose gaps, but never turns successful commands into mathematical proof.',
    'hero.empty': 'Import a dossier', 'dossier.eyebrow': 'Source dossier', 'dossier.title': 'Campaign scope',
    'dossier.empty': 'Import a fingerprinted research dossier to begin.', 'runs.eyebrow': 'Execution evidence',
    'runs.title': 'Run manifests', 'runs.emptyTitle': 'No scope-linked runs',
    'runs.emptyBody': 'Import or record runs with canonical node IDs from the dossier.', 'gates.eyebrow': 'Release discipline',
    'gates.title': 'Capsule gates', 'gates.empty': 'Build a capsule to evaluate its gates.', 'actions.eyebrow': 'Next work',
    'actions.title': 'Open actions', 'actions.empty': 'No capsule has been built.', 'help.title': 'How research capsules behave',
    'help.dossier': 'The imported dossier fingerprint is verified before use.',
    'help.runs': 'Run fingerprints, scope links and artifact metadata are checked independently.',
    'help.files': 'The browser verifies metadata only; use capsule:verify to hash local artifact files.',
    'help.claims': 'A ready capsule is a reproducibility handoff, not proof or confidence promotion.', 'help.close': 'Close',
    'status.localRuns': 'Loaded {count} local runs.', 'status.dossier': 'Loaded dossier “{title}”.', 'status.runs': 'Merged {count} runs.',
    'status.verified': 'Capsule fingerprint verified.', 'status.built': 'Capsule built: {state}.', 'status.error': 'Could not complete the operation.',
    'run.linked': 'scope-linked', 'run.unlinked': 'unlinked', 'run.fingerprint': 'fingerprint', 'run.artifacts': '{count} artifacts',
    'ready': 'ready', 'attention': 'attention', 'blocked': 'blocked', 'not-applicable': 'not applicable',
  },
  es: {
    'nav.skip': 'Saltar a las cápsulas de investigación', 'nav.primary': 'Navegación principal', 'nav.research': 'Grafo de investigación',
    'nav.learning': 'Mapa de aprendizaje', 'nav.workbench': 'Banco', 'nav.evidence': 'Evidencia', 'nav.changes': 'Cambios',
    'nav.formalization': 'Auditoría Lean', 'nav.dossiers': 'Dossiers', 'nav.runs': 'Ejecuciones', 'nav.capsules': 'Cápsulas', 'nav.repository': 'Repositorio',
    'app.tagline': 'Une dossiers, ejecuciones y artefactos con una huella', 'header.language': 'Idioma de la interfaz',
    'header.theme': 'Cambiar tema', 'header.help': 'Ayuda de cápsulas', 'loading': 'Cargando nodos canónicos y ejecuciones locales…',
    'controls.eyebrow': 'Entrega portátil de investigación', 'controls.title': 'Constructor de cápsulas', 'inputs.title': 'Entradas',
    'inputs.name': 'Título de la cápsula', 'inputs.namePlaceholder': 'Cápsula de investigación', 'inputs.dossier': 'Importar dossier JSON',
    'inputs.localRuns': 'Recargar ejecuciones locales', 'inputs.runFile': 'Importar registro o manifiesto',
    'inputs.dossierFile': 'Archivo de dossier', 'inputs.runImportFile': 'Archivo de ejecuciones',
    'summary.title': 'Resumen de la cápsula', 'summary.scope': 'Nodos del alcance', 'summary.relevant': 'Ejecuciones relevantes',
    'summary.selected': 'Ejecuciones seleccionadas', 'summary.passed': 'Superadas', 'summary.artifacts': 'Artefactos', 'summary.actions': 'Acciones abiertas',
    'selection.title': 'Selección de ejecuciones', 'selection.relevant': 'Seleccionar vinculadas', 'selection.ready': 'Seleccionar superadas y firmadas',
    'selection.clear': 'Limpiar selección', 'export.title': 'Construir y verificar', 'export.build': 'Construir cápsula',
    'export.json': 'Exportar JSON', 'export.markdown': 'Exportar Markdown', 'export.verify': 'Verificar cápsula JSON',
    'export.file': 'Archivo de cápsula para verificar', 'hero.eyebrow': 'Límite reproducible de campaña',
    'hero.title': 'Une intención, ejecución y artefactos en una entrega verificable',
    'hero.body': 'La cápsula conserva el dossier verificado y los manifiestos seleccionados. Expone carencias, pero no convierte una ejecución correcta en demostración matemática.',
    'hero.empty': 'Importa un dossier', 'dossier.eyebrow': 'Dossier de origen', 'dossier.title': 'Alcance de la campaña',
    'dossier.empty': 'Importa un dossier con huella para comenzar.', 'runs.eyebrow': 'Evidencia de ejecución',
    'runs.title': 'Manifiestos de ejecución', 'runs.emptyTitle': 'No hay ejecuciones vinculadas',
    'runs.emptyBody': 'Importa o registra ejecuciones con IDs canónicos del dossier.', 'gates.eyebrow': 'Disciplina de entrega',
    'gates.title': 'Puertas de la cápsula', 'gates.empty': 'Construye una cápsula para evaluar sus puertas.', 'actions.eyebrow': 'Trabajo siguiente',
    'actions.title': 'Acciones abiertas', 'actions.empty': 'Todavía no se ha construido una cápsula.', 'help.title': 'Cómo funcionan las cápsulas',
    'help.dossier': 'La huella del dossier se verifica antes de usarlo.',
    'help.runs': 'Las huellas, vínculos de alcance y metadatos de artefactos se comprueban por separado.',
    'help.files': 'El navegador verifica metadatos; usa capsule:verify para calcular hashes de archivos locales.',
    'help.claims': 'Una cápsula lista es una entrega reproducible, no una demostración ni una promoción de confianza.', 'help.close': 'Cerrar',
    'status.localRuns': 'Se cargaron {count} ejecuciones locales.', 'status.dossier': 'Se cargó el dossier «{title}».', 'status.runs': 'Se fusionaron {count} ejecuciones.',
    'status.verified': 'Huella de la cápsula verificada.', 'status.built': 'Cápsula construida: {state}.', 'status.error': 'No se pudo completar la operación.',
    'run.linked': 'vinculada', 'run.unlinked': 'sin vínculo', 'run.fingerprint': 'huella', 'run.artifacts': '{count} artefactos',
    'ready': 'lista', 'attention': 'atención', 'blocked': 'bloqueada', 'not-applicable': 'no aplicable',
  },
};

const state = {
  language: readSetting('language', navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'),
  theme: readSetting('theme', 'system'), nodes: [], validNodeIds: new Set(), dossier: null,
  ledger: null, selected: new Set(), capsule: null,
};

function readSetting(key, fallback) {
  try { return localStorage.getItem(`${SETTING_PREFIX}${key}`) ?? fallback; } catch { return fallback; }
}
function saveSetting(key, value) {
  try { localStorage.setItem(`${SETTING_PREFIX}${key}`, value); } catch { /* Optional. */ }
}
function t(key, variables = {}) {
  let value = MESSAGES[state.language]?.[key] ?? MESSAGES.en[key] ?? key;
  for (const [name, replacement] of Object.entries(variables)) value = value.replaceAll(`{${name}}`, String(replacement));
  return value;
}
function translateDocument() {
  document.documentElement.lang = state.language;
  for (const element of document.querySelectorAll('[data-i18n]')) element.textContent = t(element.dataset.i18n);
  for (const element of document.querySelectorAll('[data-i18n-aria]')) element.setAttribute('aria-label', t(element.dataset.i18nAria));
  for (const element of document.querySelectorAll('[data-i18n-placeholder]')) element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
  ui.language.value = state.language;
  document.title = state.language === 'es' ? 'PhysMath Knowledge Tree — Cápsulas de investigación' : 'PhysMath Knowledge Tree — Research capsules';
}
function element(name, attributes = {}) {
  const node = document.createElement(name);
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'class') node.className = String(value);
    else node.setAttribute(key, String(value));
  }
  return node;
}
function toast(message) {
  const item = element('div', { class: 'toast' }); item.textContent = message; ui.toasts.append(item); setTimeout(() => item.remove(), 3000);
}
function fileText(file) {
  if (!file || typeof file.size !== 'number' || !Number.isFinite(file.size) || file.size < 0) throw new Error('Invalid import file');
  if (file.size > MAX_FILE_BYTES) throw new Error('File exceeds the size limit');
  if (file.name && !file.name.toLowerCase().endsWith('.json')) throw new Error('File must end in .json');
  const type = String(file.type ?? '').split(';', 1)[0].trim().toLowerCase();
  const compatible = new Set(['application/json', 'text/json', 'application/octet-stream', 'text/plain']);
  if (type && !compatible.has(type) && !type.endsWith('+json')) throw new Error('File must use a JSON-compatible media type');
  return file.text();
}
function emptyLedger() {
  return { application: 'PhysMath Knowledge Tree', schema_version: 1, updated_at: new Date().toISOString(), runs: [] };
}
function loadLocalLedger() {
  let raw = null;
  try { raw = localStorage.getItem(RUN_STORAGE_KEY); } catch { /* Storage unavailable. */ }
  try {
    state.ledger = normalizeRunLedger(raw ? JSON.parse(raw) : emptyLedger(), state.validNodeIds);
  } catch (error) {
    console.warn('Ignoring invalid local run ledger:', error);
    state.ledger = normalizeRunLedger(emptyLedger(), state.validNodeIds);
  }
  ui.input_status.textContent = t('status.localRuns', { count: state.ledger.runs.length });
  refreshSelection(false); render();
}
function scopeIds() {
  return new Set((state.dossier?.scope?.nodes ?? []).map(({ id }) => id));
}
function relevantRuns() {
  const scope = scopeIds();
  return (state.ledger?.runs ?? []).filter((run) => run.node_ids.some((id) => scope.has(id)));
}
function refreshSelection(selectAll = true) {
  const relevant = relevantRuns();
  const available = new Set(relevant.map(({ id }) => id));
  state.selected = selectAll ? available : new Set([...state.selected].filter((id) => available.has(id)));
  state.capsule = null;
}
function renderDossier() {
  if (!state.dossier) {
    ui.dossier_summary.className = 'placeholder'; ui.dossier_summary.textContent = t('dossier.empty'); return;
  }
  const meta = element('div', { class: 'dossier-meta' });
  const entries = [
    [state.dossier.workspace.title, state.dossier.workspace.id],
    [String(state.dossier.scope.node_count), state.language === 'es' ? 'nodos' : 'nodes'],
    [String(state.dossier.scope.edge_count), state.language === 'es' ? 'aristas' : 'edges'],
    [state.dossier.readiness.overall, state.language === 'es' ? 'preparación' : 'readiness'],
  ];
  for (const [value, label] of entries) { const box = element('div'); const strong = element('strong'); strong.textContent = value; const small = element('small'); small.textContent = label; box.append(strong, small); meta.append(box); }
  const fingerprint = element('p', { class: 'fingerprint' }); fingerprint.textContent = state.dossier.content_fingerprint;
  ui.dossier_summary.className = ''; ui.dossier_summary.replaceChildren(meta, fingerprint);
}
function renderRuns() {
  const runs = relevantRuns(); ui.run_list.replaceChildren(); ui.run_empty.hidden = runs.length > 0;
  ui.run_count.textContent = `${runs.length}`;
  for (const run of runs) {
    const card = element('article', { class: 'capsule-run' });
    const checkbox = element('input', { type: 'checkbox', 'aria-label': run.title }); checkbox.checked = state.selected.has(run.id);
    checkbox.addEventListener('change', () => { checkbox.checked ? state.selected.add(run.id) : state.selected.delete(run.id); state.capsule = null; renderSummary(); renderCapsule(); });
    const body = element('div'); const title = element('h3'); title.textContent = run.title;
    const command = element('p'); command.textContent = run.command.length ? run.command.join(' ') : run.id;
    const nodes = element('p'); nodes.textContent = run.node_ids.join(', ') || '—'; body.append(title, command, nodes);
    const badges = element('div', { class: 'capsule-badges' });
    for (const [text, klass] of [[run.status, run.status === 'passed' ? 'ready' : run.status === 'failed' ? 'blocked' : 'attention'], [run.fingerprint ? t('run.fingerprint') : 'no fingerprint', run.fingerprint ? 'ready' : 'attention'], [t('run.artifacts', { count: run.artifacts.length }), run.artifacts.length ? 'ready' : 'attention']]) {
      const badge = element('span', { class: `capsule-badge ${klass}` }); badge.textContent = text; badges.append(badge);
    }
    card.append(checkbox, body, badges); ui.run_list.append(card);
  }
}
function renderSummary() {
  const relevant = relevantRuns();
  ui.stat_scope.textContent = String(state.dossier?.scope?.node_count ?? 0);
  ui.stat_relevant.textContent = String(relevant.length);
  ui.stat_selected.textContent = String(state.selected.size);
  ui.stat_passed.textContent = String(state.capsule?.execution?.passed ?? relevant.filter(({ id, status }) => state.selected.has(id) && status === 'passed').length);
  ui.stat_artifacts.textContent = String(state.capsule?.verification?.artifact_count ?? relevant.filter(({ id }) => state.selected.has(id)).reduce((sum, run) => sum + run.artifacts.length, 0));
  ui.stat_actions.textContent = String(state.capsule?.readiness?.action_count ?? 0);
  ui.build_capsule.disabled = !state.dossier;
  ui.export_json.disabled = !state.capsule; ui.export_markdown.disabled = !state.capsule;
}
function renderCapsule() {
  if (!state.capsule) {
    ui.readiness_badge.textContent = t('hero.empty'); ui.readiness_badge.className = 'privacy-badge';
    const gatePlaceholder = element('p', { class: 'placeholder' }); gatePlaceholder.textContent = t('gates.empty'); ui.gate_list.replaceChildren(gatePlaceholder);
    const actionPlaceholder = element('p', { class: 'placeholder' }); actionPlaceholder.textContent = t('actions.empty'); ui.action_list.replaceChildren(actionPlaceholder); return;
  }
  ui.readiness_badge.textContent = t(state.capsule.readiness.overall); ui.readiness_badge.className = `privacy-badge ${state.capsule.readiness.overall}`;
  ui.gate_list.replaceChildren(...state.capsule.readiness.gates.map((item) => {
    const card = element('article', { class: `gate-card ${item.state}` }); const title = element('h3'); title.textContent = `${item.label} · ${t(item.state)}`;
    const progress = element('strong'); progress.textContent = `${item.completed}/${item.total}`; const detail = element('p'); detail.textContent = item.detail; card.append(title, progress, detail); return card;
  }));
  if (state.capsule.readiness.actions.length) {
    ui.action_list.replaceChildren(...state.capsule.readiness.actions.map((action) => {
      const card = element('article', { class: `action-item ${action.severity}` }); const title = element('h3'); title.textContent = `${action.kind}: ${action.title}`;
      const detail = element('p'); detail.textContent = `${action.target} — ${action.detail}`; card.append(title, detail); return card;
    }));
  } else { const item = element('p'); item.textContent = state.language === 'es' ? 'No hay acciones abiertas.' : 'No open actions.'; ui.action_list.replaceChildren(item); }
}
function render() { renderDossier(); renderRuns(); renderSummary(); renderCapsule(); }
function downloadText(filename, text, type) {
  const blob = new Blob([text], { type: `${type};charset=utf-8` }); const url = URL.createObjectURL(blob);
  const anchor = element('a', { href: url, download: filename }); document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function handleDossier(file) {
  try {
    state.dossier = await importResearchDossier(await fileText(file));
    ui.capsule_title.value = `Research capsule: ${state.dossier.workspace.title}`;
    ui.input_status.textContent = t('status.dossier', { title: state.dossier.workspace.title }); refreshSelection(true); render();
  } catch (error) { console.error(error); toast(error instanceof Error ? error.message : t('status.error')); }
}
async function handleRuns(file) {
  try {
    const incoming = parseRunImport(await fileText(file), state.validNodeIds);
    state.ledger = mergeRunLedgers(state.ledger, incoming, state.validNodeIds);
    ui.input_status.textContent = t('status.runs', { count: incoming.runs.length }); refreshSelection(true); render();
  } catch (error) { console.error(error); toast(error instanceof Error ? error.message : t('status.error')); }
}
async function buildCapsule() {
  try {
    state.capsule = await buildResearchCapsule({
      dossier: state.dossier, runLedger: state.ledger, validNodeIds: state.validNodeIds,
      selectedRunIds: state.selected, generatedAt: new Date().toISOString(), title: ui.capsule_title.value,
    });
    ui.input_status.textContent = t('status.built', { state: t(state.capsule.readiness.overall) }); render();
  } catch (error) { console.error(error); toast(error instanceof Error ? error.message : t('status.error')); }
}
async function verifyImported(file) {
  try {
    state.capsule = await importResearchCapsule(await fileText(file));
    state.dossier = state.capsule.dossier;
    const embeddedLedger = {
      application: 'PhysMath Knowledge Tree', schema_version: 1, updated_at: state.capsule.generated_at,
      runs: state.capsule.execution.runs.map(({ run }) => run),
    };
    state.ledger = mergeRunLedgers(state.ledger ?? emptyLedger(), embeddedLedger, state.validNodeIds, state.capsule.generated_at);
    state.selected = new Set(state.capsule.verification.selected_run_ids);
    ui.capsule_title.value = state.capsule.title;
    ui.input_status.textContent = t('status.verified');
    render();
  } catch (error) { console.error(error); toast(error instanceof Error ? error.message : t('status.error')); }
}
function bindEvents() {
  ui.import_dossier.addEventListener('click', () => ui.dossier_file.click()); ui.dossier_file.addEventListener('change', () => { const [file] = ui.dossier_file.files; if (file) handleDossier(file); ui.dossier_file.value = ''; });
  ui.import_runs.addEventListener('click', () => ui.run_file.click()); ui.run_file.addEventListener('change', () => { const [file] = ui.run_file.files; if (file) handleRuns(file); ui.run_file.value = ''; });
  ui.load_local_runs.addEventListener('click', loadLocalLedger);
  ui.select_relevant.addEventListener('click', () => { state.selected = new Set(relevantRuns().map(({ id }) => id)); state.capsule = null; render(); });
  ui.select_ready.addEventListener('click', () => { state.selected = new Set(relevantRuns().filter((run) => run.status === 'passed' && run.fingerprint).map(({ id }) => id)); state.capsule = null; render(); });
  ui.clear_selection.addEventListener('click', () => { state.selected.clear(); state.capsule = null; render(); });
  ui.build_capsule.addEventListener('click', buildCapsule);
  ui.export_json.addEventListener('click', () => state.capsule && downloadText('physmath-research-capsule.json', `${JSON.stringify(state.capsule, null, 2)}\n`, 'application/json'));
  ui.export_markdown.addEventListener('click', () => state.capsule && downloadText('physmath-research-capsule.md', `${researchCapsuleMarkdown(state.capsule)}\n`, 'text/markdown'));
  ui.verify_import.addEventListener('click', () => ui.capsule_file.click()); ui.capsule_file.addEventListener('change', () => { const [file] = ui.capsule_file.files; if (file) verifyImported(file); ui.capsule_file.value = ''; });
  ui.help.addEventListener('click', () => ui.help_dialog.showModal());
  ui.language.addEventListener('change', () => { state.language = ui.language.value === 'es' ? 'es' : 'en'; saveSetting('language', state.language); translateDocument(); render(); });
  ui.theme.addEventListener('click', () => { const choices = ['system', 'light', 'dark']; state.theme = choices[(choices.indexOf(state.theme) + 1) % choices.length]; document.documentElement.dataset.theme = state.theme; saveSetting('theme', state.theme); });
}
async function init() {
  document.documentElement.dataset.theme = state.theme; translateDocument(); bindEvents();
  try {
    const response = await fetch('./graph/nodes/core.json', { headers: { Accept: 'application/json' } }); if (!response.ok) throw new Error(`nodes: HTTP ${response.status}`);
    state.nodes = await response.json(); state.validNodeIds = new Set(state.nodes.map(({ id }) => id));
    loadLocalLedger(); ui.loading.hidden = true; ui.capsule_center.hidden = false;
    if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('./sw.js', { scope: './' }).catch((error) => console.warn('Service worker registration failed:', error));
  } catch (error) {
    console.error(error); ui.loading.classList.add('load-error'); ui.loading.textContent = error instanceof Error ? error.message : String(error);
  }
}

init();
