import { createGraphSnapshot, diffGraphSnapshots, loadChangeReviewState } from './lib/change-review.js';
import { loadReviewLedger, normalizeReferenceRegistry } from './lib/evidence-review.js';
import { loadLeanAuditLedger, normalizeLeanCatalog } from './lib/lean-target-audit.js';
import { buildResearchDossier, researchDossierMarkdown } from './lib/research-dossier.js';
import { loadWorkspaceLibrary } from './lib/workspace.js';

const STORAGE_PREFIX = 'physmath.dossiers.';

const dictionaries = {
  en: {
    'nav.skip': 'Skip to research dossier', 'nav.primary': 'Primary navigation', 'nav.research': 'Research graph',
    'nav.learning': 'Learning map', 'nav.workbench': 'Workbench', 'nav.evidence': 'Evidence review',
    'nav.changes': 'Change review', 'nav.formalization': 'Lean audit', 'nav.dossiers': 'Dossiers', 'nav.repository': 'Repository',
    'app.tagline': 'Join local research records into one auditable handoff', 'header.language': 'Interface language',
    'header.theme': 'Change theme', 'header.help': 'Research dossier help',
    loading: 'Loading canonical graph and local review ledgers…', 'controls.eyebrow': 'Integrated local state',
    'controls.title': 'Research dossier', 'workspace.title': 'Workspace source', 'workspace.label': 'Research workspace',
    'workspace.refresh': 'Refresh local ledgers', 'workspace.body': 'The dossier reads same-origin browser storage but never edits any source ledger.',
    'summary.title': 'Dossier summary', 'summary.nodes': 'Nodes', 'summary.edges': 'Edges', 'summary.references': 'References',
    'summary.lean': 'Lean items', 'summary.changes': 'Changes', 'summary.actions': 'Actions',
    'portable.title': 'Portable handoff', 'portable.body': 'Exports contain the scoped canonical data and matching local review records.',
    'portable.json': 'Export dossier JSON', 'portable.markdown': 'Export dossier Markdown', 'portable.fingerprint': 'Copy content fingerprint',
    'sources.title': 'Source tools', 'sources.workbench': 'Edit workspace scope and notes', 'sources.evidence': 'Review canonical references',
    'sources.changes': 'Review canonical changes', 'sources.lean': 'Audit Lean targets',
    'hero.eyebrow': 'Campaign readiness', 'hero.title': 'One scope, one evidence trail, one formalization handoff',
    'hero.body': 'A dossier combines local records without promoting confidence, certifying sources or mutating canonical JSON.',
    'gates.eyebrow': 'Explicit gates', 'gates.title': 'Readiness checks', 'actions.eyebrow': 'Next discriminating work',
    'actions.title': 'Open actions', 'actions.emptyTitle': 'No open actions', 'actions.emptyBody': 'The current local ledgers satisfy every applicable gate.',
    'scope.title': 'Canonical scope', 'evidence.title': 'Evidence state', 'lean.title': 'Lean audit state',
    'changes.title': 'Change governance', 'records.title': 'Workspace research record',
    'help.title': 'How integrated dossiers behave', 'help.readonly': 'The Workbench, evidence, change and Lean ledgers remain read-only.',
    'help.scope': 'Only selected workspace nodes, induced edges and their matching records are included.',
    'help.fingerprint': 'The SHA-256 fingerprint covers dossier content but excludes the export timestamp.',
    'help.boundary': 'Readiness is a workflow signal, not a proof or scientific confidence score.', 'help.close': 'Close',
    'status.ready': 'Ready', 'status.attention': 'Attention', 'status.blocked': 'Blocked', 'status.not-applicable': 'Not applicable',
    'gate.scope': 'Scope', 'gate.mechanism': 'Mechanism', 'gate.falsifiability': 'Falsifiability',
    'gate.evidence': 'Evidence', 'gate.lean': 'Lean names', 'gate.changes': 'Canonical changes',
    'gate.scope.ready': '{count} canonical nodes selected.', 'gate.scope.blocked': 'Select at least one canonical node in the Workbench.',
    'gate.mechanism.ready': 'Working notes or a bridge-card draft document the mechanism.',
    'gate.mechanism.attention': 'Add working notes or a bridge-card draft.',
    'gate.falsifiability.ready': 'A falsifier or next discriminating test is recorded.',
    'gate.falsifiability.attention': 'Record a falsifier or next discriminating test.',
    'gate.evidence.not-applicable': 'No claim/formalization references are attached to this scope.',
    'gate.evidence.ready': 'Every source-bearing reference is locally verified.',
    'gate.evidence.attention': '{open} source-bearing references still need verification.',
    'gate.evidence.blocked': '{open} source-bearing references are marked superseded.',
    'gate.lean.not-applicable': 'No Lean import or declaration candidates are attached to this scope.',
    'gate.lean.ready': 'Every import/declaration has a verified or replacement name.',
    'gate.lean.attention': '{open} import/declaration candidates remain unaudited.',
    'gate.lean.blocked': '{open} import/declaration candidates are missing or blocked.',
    'gate.changes.not-applicable': 'No local canonical-change baseline is available.',
    'gate.changes.ready': 'No unresolved high/critical canonical change affects this scope.',
    'gate.changes.attention': '{open} high/critical changes remain pending.',
    'gate.changes.blocked': '{open} high/critical changes require work.',
    'progress': '{done}/{total}', 'action.scope': 'Define the campaign scope', 'action.mechanism': 'Document the mechanism',
    'action.falsifiability': 'Add a discriminating test', 'action.evidence': 'Review a source-bearing reference',
    'action.evidence.blocked': 'Replace a superseded source', 'action.lean': 'Audit or repair a Lean name',
    'action.change': 'Review a risky canonical change', 'action.change.blocked': 'Resolve a risky canonical change',
    'action.experiment': 'Run the next discriminating test', 'empty.scope': 'No canonical nodes selected.',
    'empty.evidence': 'No references in the selected scope.', 'empty.lean': 'No Lean items in the selected scope.',
    'empty.changes': 'No relevant canonical changes or no local baseline.', 'records.notes': 'Working notes',
    'records.noNotes': 'No working notes recorded.', 'records.cards': 'Bridge-card drafts', 'records.noCards': 'No bridge-card drafts recorded.',
    'records.results': 'Negative and inconclusive results', 'records.noResults': 'No negative or inconclusive results recorded.',
    'records.observation': 'Observation', 'records.mechanism': 'Challenged mechanism', 'records.next': 'Next test',
    'refresh.done': 'Local ledgers refreshed', 'toast.json': 'Dossier JSON exported.', 'toast.markdown': 'Dossier Markdown exported.',
    'toast.copied': 'Fingerprint copied.', 'toast.failed': 'The operation could not be completed.',
  },
  es: {
    'nav.skip': 'Saltar al dossier de investigación', 'nav.primary': 'Navegación principal', 'nav.research': 'Grafo de investigación',
    'nav.learning': 'Mapa de aprendizaje', 'nav.workbench': 'Banco de trabajo', 'nav.evidence': 'Revisión de evidencia',
    'nav.changes': 'Revisión de cambios', 'nav.formalization': 'Auditoría Lean', 'nav.dossiers': 'Dossiers', 'nav.repository': 'Repositorio',
    'app.tagline': 'Une registros locales en una entrega auditable', 'header.language': 'Idioma de la interfaz',
    'header.theme': 'Cambiar tema', 'header.help': 'Ayuda del dossier de investigación',
    loading: 'Cargando el grafo canónico y los libros locales…', 'controls.eyebrow': 'Estado local integrado',
    'controls.title': 'Dossier de investigación', 'workspace.title': 'Workspace de origen', 'workspace.label': 'Workspace de investigación',
    'workspace.refresh': 'Actualizar libros locales', 'workspace.body': 'El dossier lee el almacenamiento del mismo origen, pero nunca edita los libros fuente.',
    'summary.title': 'Resumen del dossier', 'summary.nodes': 'Nodos', 'summary.edges': 'Aristas', 'summary.references': 'Referencias',
    'summary.lean': 'Elementos Lean', 'summary.changes': 'Cambios', 'summary.actions': 'Acciones',
    'portable.title': 'Entrega portable', 'portable.body': 'Las exportaciones contienen los datos canónicos acotados y los registros locales correspondientes.',
    'portable.json': 'Exportar dossier JSON', 'portable.markdown': 'Exportar dossier Markdown', 'portable.fingerprint': 'Copiar huella del contenido',
    'sources.title': 'Herramientas fuente', 'sources.workbench': 'Editar alcance y notas', 'sources.evidence': 'Revisar referencias canónicas',
    'sources.changes': 'Revisar cambios canónicos', 'sources.lean': 'Auditar objetivos Lean',
    'hero.eyebrow': 'Preparación de campaña', 'hero.title': 'Un alcance, una traza de evidencia y una entrega de formalización',
    'hero.body': 'El dossier combina registros locales sin elevar confianza, certificar fuentes ni modificar el JSON canónico.',
    'gates.eyebrow': 'Puertas explícitas', 'gates.title': 'Comprobaciones de preparación', 'actions.eyebrow': 'Siguiente trabajo discriminante',
    'actions.title': 'Acciones abiertas', 'actions.emptyTitle': 'No hay acciones abiertas', 'actions.emptyBody': 'Los libros locales actuales satisfacen todas las puertas aplicables.',
    'scope.title': 'Alcance canónico', 'evidence.title': 'Estado de evidencia', 'lean.title': 'Estado de auditoría Lean',
    'changes.title': 'Gobernanza de cambios', 'records.title': 'Registro de investigación del workspace',
    'help.title': 'Cómo funcionan los dossiers integrados', 'help.readonly': 'Los libros del Workbench, evidencia, cambios y Lean permanecen en modo lectura.',
    'help.scope': 'Solo se incluyen los nodos elegidos, sus aristas inducidas y los registros correspondientes.',
    'help.fingerprint': 'La huella SHA-256 cubre el contenido del dossier, pero excluye la fecha de exportación.',
    'help.boundary': 'La preparación es una señal de flujo de trabajo, no una prueba ni una puntuación científica.', 'help.close': 'Cerrar',
    'status.ready': 'Preparado', 'status.attention': 'Atención', 'status.blocked': 'Bloqueado', 'status.not-applicable': 'No aplicable',
    'gate.scope': 'Alcance', 'gate.mechanism': 'Mecanismo', 'gate.falsifiability': 'Falsabilidad',
    'gate.evidence': 'Evidencia', 'gate.lean': 'Nombres Lean', 'gate.changes': 'Cambios canónicos',
    'gate.scope.ready': '{count} nodos canónicos seleccionados.', 'gate.scope.blocked': 'Selecciona al menos un nodo canónico en el Workbench.',
    'gate.mechanism.ready': 'Las notas o una tarjeta puente documentan el mecanismo.',
    'gate.mechanism.attention': 'Añade notas de trabajo o una tarjeta puente.',
    'gate.falsifiability.ready': 'Hay un falsador o una siguiente prueba discriminante.',
    'gate.falsifiability.attention': 'Registra un falsador o una prueba discriminante.',
    'gate.evidence.not-applicable': 'No hay referencias de afirmación/formalización en este alcance.',
    'gate.evidence.ready': 'Todas las referencias que sostienen afirmaciones están verificadas localmente.',
    'gate.evidence.attention': '{open} referencias todavía requieren verificación.',
    'gate.evidence.blocked': '{open} referencias están marcadas como reemplazadas.',
    'gate.lean.not-applicable': 'No hay imports ni declaraciones Lean en este alcance.',
    'gate.lean.ready': 'Cada import/declaración tiene un nombre verificado o sustituto.',
    'gate.lean.attention': '{open} candidatos Lean siguen sin auditar.',
    'gate.lean.blocked': '{open} candidatos Lean están ausentes o bloqueados.',
    'gate.changes.not-applicable': 'No hay una línea base local de cambios canónicos.',
    'gate.changes.ready': 'Ningún cambio alto/crítico sin resolver afecta al alcance.',
    'gate.changes.attention': '{open} cambios altos/críticos siguen pendientes.',
    'gate.changes.blocked': '{open} cambios altos/críticos requieren trabajo.',
    progress: '{done}/{total}', 'action.scope': 'Definir el alcance de la campaña', 'action.mechanism': 'Documentar el mecanismo',
    'action.falsifiability': 'Añadir una prueba discriminante', 'action.evidence': 'Revisar una referencia que sostiene afirmaciones',
    'action.evidence.blocked': 'Sustituir una fuente reemplazada', 'action.lean': 'Auditar o reparar un nombre Lean',
    'action.change': 'Revisar un cambio canónico arriesgado', 'action.change.blocked': 'Resolver un cambio canónico arriesgado',
    'action.experiment': 'Ejecutar la siguiente prueba discriminante', 'empty.scope': 'No hay nodos canónicos seleccionados.',
    'empty.evidence': 'No hay referencias en el alcance seleccionado.', 'empty.lean': 'No hay elementos Lean en el alcance.',
    'empty.changes': 'No hay cambios canónicos relevantes o no existe línea base.', 'records.notes': 'Notas de trabajo',
    'records.noNotes': 'No hay notas de trabajo.', 'records.cards': 'Borradores de tarjetas puente', 'records.noCards': 'No hay borradores de tarjetas puente.',
    'records.results': 'Resultados negativos e inconclusos', 'records.noResults': 'No hay resultados negativos o inconclusos.',
    'records.observation': 'Observación', 'records.mechanism': 'Mecanismo cuestionado', 'records.next': 'Siguiente prueba',
    'refresh.done': 'Libros locales actualizados', 'toast.json': 'Dossier JSON exportado.', 'toast.markdown': 'Dossier Markdown exportado.',
    'toast.copied': 'Huella copiada.', 'toast.failed': 'No se pudo completar la operación.',
  },
};

const byId = (id) => document.getElementById(id);
function element(name, attributes = {}) {
  const node = document.createElement(name);
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'class') node.className = String(value);
    else node.setAttribute(key, String(value));
  }
  return node;
}

const ui = {
  loading: byId('loading'), center: byId('dossier-center'), language: byId('language'), theme: byId('theme'), help: byId('help'),
  helpDialog: byId('help-dialog'), workspace: byId('workspace'), refresh: byId('refresh'), refreshState: byId('refresh-state'),
  nodes: byId('stat-nodes'), edges: byId('stat-edges'), references: byId('stat-references'), lean: byId('stat-lean'),
  changes: byId('stat-changes'), actions: byId('stat-actions'), exportJson: byId('export-json'), exportMarkdown: byId('export-markdown'),
  copyFingerprint: byId('copy-fingerprint'), overall: byId('overall-status'), fingerprint: byId('fingerprint'), gateGrid: byId('gate-grid'),
  actionList: byId('action-list'), actionsEmpty: byId('actions-empty'), scopeList: byId('scope-list'), evidenceList: byId('evidence-list'),
  leanList: byId('lean-list'), changeList: byId('change-list'), workspaceRecord: byId('workspace-record'), toasts: byId('toasts'),
};

const state = {
  language: readSetting('language', navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'),
  theme: readSetting('theme', 'system'), index: null, nodes: [], edges: [], moves: [], collections: [], registry: null,
  currentSnapshot: null, workspaceLibrary: null, evidenceLedger: null, leanCatalog: null, leanLedger: null,
  changeReview: null, dossier: null, renderToken: 0,
};

function readSetting(key, fallback) {
  try { return localStorage.getItem(`${STORAGE_PREFIX}${key}`) ?? fallback; } catch { return fallback; }
}
function saveSetting(key, value) {
  try { localStorage.setItem(`${STORAGE_PREFIX}${key}`, value); } catch { /* Optional preference. */ }
}
function tr(key, variables = {}) {
  let value = dictionaries[state.language]?.[key] ?? dictionaries.en[key] ?? key;
  for (const [name, replacement] of Object.entries(variables)) value = value.replaceAll(`{${name}}`, String(replacement));
  return value;
}
function translateDocument() {
  document.documentElement.lang = state.language;
  document.title = state.language === 'es' ? 'PhysMath Knowledge Tree — Dossiers de investigación' : 'PhysMath Knowledge Tree — Research dossiers';
  for (const node of document.querySelectorAll('[data-i18n]')) node.textContent = tr(node.dataset.i18n);
  for (const node of document.querySelectorAll('[data-i18n-aria]')) node.setAttribute('aria-label', tr(node.dataset.i18nAria));
  ui.language.value = state.language;
}
async function loadJson(path) {
  const response = await fetch(path, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}
function storage() {
  try { return window.localStorage; } catch { return { getItem: () => null, setItem: () => {}, removeItem: () => {} }; }
}

async function refreshLocalState(message = true) {
  const store = storage();
  const validNodeIds = new Set(state.nodes.map(({ id }) => id));
  const validUrls = new Set(state.registry.references.map(({ url }) => url));
  const validLeanIds = new Set(state.leanCatalog.items.map(({ id }) => id));
  state.workspaceLibrary = loadWorkspaceLibrary(store, validNodeIds);
  state.evidenceLedger = loadReviewLedger(store, validUrls);
  state.leanLedger = loadLeanAuditLedger(store, validLeanIds);
  const savedChanges = await loadChangeReviewState(store, state.currentSnapshot);
  state.changeReview = savedChanges.baseline ? {
    changes: diffGraphSnapshots(savedChanges.baseline, state.currentSnapshot),
    ledger: savedChanges.ledger,
    baseline_fingerprint: savedChanges.baseline.fingerprint,
    current_fingerprint: state.currentSnapshot.fingerprint,
  } : null;
  buildWorkspaceOptions();
  await renderDossier();
  if (message) {
    ui.refreshState.textContent = tr('refresh.done');
    setTimeout(() => { ui.refreshState.textContent = ''; }, 1800);
  }
}

function buildWorkspaceOptions() {
  const requested = ui.workspace.value || readSetting('workspace', state.workspaceLibrary.active_workspace_id);
  ui.workspace.replaceChildren();
  const sorted = [...state.workspaceLibrary.workspaces].sort((left, right) =>
    Date.parse(right.updated_at) - Date.parse(left.updated_at) || left.title.localeCompare(right.title));
  for (const workspace of sorted) {
    const option = element('option', { value: workspace.id });
    option.textContent = `${workspace.title} · ${workspace.node_ids.length}`;
    ui.workspace.append(option);
  }
  ui.workspace.value = sorted.some(({ id }) => id === requested) ? requested : state.workspaceLibrary.active_workspace_id;
  saveSetting('workspace', ui.workspace.value);
}

async function renderDossier() {
  const token = ++state.renderToken;
  const dossier = await buildResearchDossier({
    index: state.index, nodes: state.nodes, edges: state.edges, referenceRegistry: state.registry,
    workspaceLibrary: state.workspaceLibrary, workspaceId: ui.workspace.value,
    evidenceLedger: state.evidenceLedger, leanLedger: state.leanLedger, changeReview: state.changeReview,
  });
  if (token !== state.renderToken) return;
  state.dossier = dossier;
  renderAll();
}

function gateDetail(item) {
  const open = Math.max(0, item.total - item.completed);
  if (item.id === 'scope') return tr(`gate.scope.${item.state}`, { count: item.total, open });
  if (item.id === 'mechanism') return tr(`gate.mechanism.${item.state}`, { open });
  if (item.id === 'falsifiability') return tr(`gate.falsifiability.${item.state}`, { open });
  if (item.id === 'evidence') return tr(`gate.evidence.${item.state}`, { open });
  if (item.id === 'lean') return tr(`gate.lean.${item.state}`, { open });
  if (item.id === 'changes') return tr(`gate.changes.${item.state}`, { open });
  return item.detail;
}

function badge(text, className = '') {
  const node = element('span', { class: `badge ${className}`.trim() });
  node.textContent = text;
  return node;
}

function renderAll() {
  const dossier = state.dossier;
  ui.nodes.textContent = String(dossier.scope.node_count);
  ui.edges.textContent = String(dossier.scope.edge_count);
  ui.references.textContent = String(dossier.evidence.reference_count);
  ui.lean.textContent = String(dossier.lean.item_count);
  ui.changes.textContent = String(dossier.changes.change_count);
  ui.actions.textContent = String(dossier.readiness.action_count);
  ui.exportJson.disabled = false; ui.exportMarkdown.disabled = false; ui.copyFingerprint.disabled = false;
  ui.overall.className = `overall-status ${dossier.readiness.overall}`;
  ui.overall.textContent = tr(`status.${dossier.readiness.overall}`);
  ui.fingerprint.textContent = dossier.content_fingerprint;
  ui.fingerprint.title = dossier.content_fingerprint;
  renderGates(); renderActions(); renderScope(); renderEvidence(); renderLean(); renderChanges(); renderWorkspaceRecord();
}

function renderGates() {
  const fragment = document.createDocumentFragment();
  for (const item of state.dossier.readiness.gates) {
    const card = element('article', { class: `gate-card ${item.state}` });
    const heading = element('div', { class: 'row' });
    const title = element('h3'); title.textContent = tr(`gate.${item.id}`);
    heading.append(title, badge(tr(`status.${item.state}`), item.state));
    const detail = element('p'); detail.textContent = gateDetail(item);
    const meta = element('div', { class: 'gate-meta' });
    const progress = element('span'); progress.textContent = tr('progress', { done: item.completed, total: item.total });
    const id = element('code'); id.textContent = item.id;
    meta.append(progress, id); card.append(heading, detail, meta); fragment.append(card);
  }
  ui.gateGrid.replaceChildren(fragment);
}

function actionTitle(action) {
  if (action.kind === 'evidence' && action.severity === 'blocked') return tr('action.evidence.blocked');
  if (action.kind === 'change' && action.severity === 'blocked') return tr('action.change.blocked');
  return tr(`action.${action.kind}`);
}
function renderActions() {
  const actions = state.dossier.readiness.actions;
  const fragment = document.createDocumentFragment();
  for (const action of actions) {
    const card = element('article', { class: `action-card ${action.severity}` });
    card.append(badge(tr(`status.${action.severity === 'info' ? 'attention' : action.severity}`), action.severity));
    const body = element('div'); const title = element('h3'); title.textContent = action.kind === 'experiment' ? `${tr('action.experiment')}: ${action.title}` : actionTitle(action);
    const detail = element('p'); detail.textContent = action.detail; body.append(title, detail); card.append(body); fragment.append(card);
  }
  ui.actionList.replaceChildren(fragment);
  ui.actionsEmpty.hidden = actions.length > 0;
}

function compactItem(titleText, bodyText, status = '', extra = '') {
  const item = element('article', { class: 'compact-item' });
  const row = element('div', { class: 'row' });
  const title = element('h3'); title.textContent = titleText; row.append(title);
  if (status) row.append(badge(tr(`status.${status}`) === `status.${status}` ? status : tr(`status.${status}`), `status-${status}`));
  const body = element('p'); body.textContent = bodyText;
  item.append(row, body);
  if (extra) { const detail = element('p'); detail.textContent = extra; item.append(detail); }
  return item;
}
function renderScope() {
  const fragment = document.createDocumentFragment();
  for (const node of state.dossier.scope.nodes) fragment.append(compactItem(node.title ?? node.id, node.summary ?? '', '', node.id));
  if (!state.dossier.scope.nodes.length) fragment.append(compactItem(tr('empty.scope'), '', ''));
  ui.scopeList.replaceChildren(fragment);
}
function renderEvidence() {
  const fragment = document.createDocumentFragment();
  for (const item of state.dossier.evidence.references) {
    fragment.append(compactItem(item.reference.label, item.reference.url, item.review.status, item.relevant_usages.join(', ')));
  }
  if (!state.dossier.evidence.references.length) fragment.append(compactItem(tr('empty.evidence'), '', ''));
  ui.evidenceList.replaceChildren(fragment);
}
function renderLean() {
  const fragment = document.createDocumentFragment();
  for (const item of state.dossier.lean.items.slice(0, 60)) {
    const replacement = item.audit.replacement ? ` → ${item.audit.replacement}` : '';
    fragment.append(compactItem(`${item.node_title} · ${item.item_type}`, `${item.value}${replacement}`, item.audit.status, item.audit.toolchain));
  }
  if (state.dossier.lean.items.length > 60) fragment.append(compactItem(`+${state.dossier.lean.items.length - 60}`, 'Additional items remain in the JSON export.'));
  if (!state.dossier.lean.items.length) fragment.append(compactItem(tr('empty.lean'), '', ''));
  ui.leanList.replaceChildren(fragment);
}
function renderChanges() {
  const fragment = document.createDocumentFragment();
  for (const item of state.dossier.changes.items.slice(0, 50)) {
    fragment.append(compactItem(`${item.change.entity_type}:${item.change.entity_id}`, item.change.title, item.decision.status, item.change.risk));
  }
  if (state.dossier.changes.items.length > 50) fragment.append(compactItem(`+${state.dossier.changes.items.length - 50}`, 'Additional changes remain in the JSON export.'));
  if (!state.dossier.changes.items.length) fragment.append(compactItem(tr('empty.changes'), '', ''));
  ui.changeList.replaceChildren(fragment);
}
function recordSection(titleText, content) {
  const section = element('section'); const title = element('h3'); title.textContent = titleText; section.append(title, content); return section;
}
function renderWorkspaceRecord() {
  const workspace = state.dossier.workspace;
  const fragment = document.createDocumentFragment();
  const notes = element('pre'); notes.textContent = workspace.notes || tr('records.noNotes');
  fragment.append(recordSection(tr('records.notes'), notes));

  const cards = element('div', { class: 'compact-list' });
  for (const card of workspace.bridge_cards) cards.append(compactItem(card.title, card.markdown || ''));
  if (!workspace.bridge_cards.length) cards.append(compactItem(tr('records.noCards'), ''));
  fragment.append(recordSection(tr('records.cards'), cards));

  const results = element('div', { class: 'compact-list' });
  for (const result of workspace.negative_results) {
    const body = [
      `${tr('records.observation')}: ${result.observation || '—'}`,
      `${tr('records.mechanism')}: ${result.challenged_mechanism || '—'}`,
      `${tr('records.next')}: ${result.next_test || '—'}`,
    ].join('\n');
    results.append(compactItem(result.title, body, result.status));
  }
  if (!workspace.negative_results.length) results.append(compactItem(tr('records.noResults'), ''));
  fragment.append(recordSection(tr('records.results'), results));
  ui.workspaceRecord.replaceChildren(fragment);
}

function safeName(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9._-]+/giu, '-').replace(/^-+|-+$/gu, '').slice(0, 100) || 'workspace';
}
function downloadText(filename, text, type) {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = element('a', { href: url, download: filename });
  document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function toast(message) {
  const item = element('div', { class: 'toast' }); item.textContent = message; ui.toasts.append(item); setTimeout(() => item.remove(), 2800);
}
function exportJson() {
  try {
    downloadText(`physmath-dossier-${safeName(state.dossier.workspace.id)}.json`, `${JSON.stringify(state.dossier, null, 2)}\n`, 'application/json');
    toast(tr('toast.json'));
  } catch (error) { console.error(error); toast(tr('toast.failed')); }
}
function exportMarkdown() {
  try {
    downloadText(`physmath-dossier-${safeName(state.dossier.workspace.id)}.md`, researchDossierMarkdown(state.dossier), 'text/markdown');
    toast(tr('toast.markdown'));
  } catch (error) { console.error(error); toast(tr('toast.failed')); }
}
async function copyFingerprint() {
  try {
    await navigator.clipboard.writeText(state.dossier.content_fingerprint);
    toast(tr('toast.copied'));
  } catch (error) { console.error(error); toast(tr('toast.failed')); }
}
function cycleTheme() {
  const choices = ['system', 'light', 'dark'];
  state.theme = choices[(choices.indexOf(state.theme) + 1) % choices.length];
  document.documentElement.dataset.theme = state.theme; saveSetting('theme', state.theme);
}
function showLoadError(error) {
  const wrapper = element('div'); const title = element('strong'); title.textContent = state.language === 'es' ? 'No se pudo cargar el dossier.' : 'The dossier could not be loaded.';
  const body = element('p'); body.textContent = state.language === 'es' ? 'Comprueba que el artefacto y los datos canónicos estén completos.' : 'Check that the artifact and canonical data are complete.';
  const technical = element('code'); technical.textContent = error instanceof Error ? error.message : String(error);
  wrapper.append(title, body, technical); ui.loading.replaceChildren(wrapper); ui.loading.classList.add('load-error');
}
function bindEvents() {
  ui.language.addEventListener('change', () => { state.language = ui.language.value === 'es' ? 'es' : 'en'; saveSetting('language', state.language); translateDocument(); renderAll(); });
  ui.theme.addEventListener('click', cycleTheme);
  ui.help.addEventListener('click', () => ui.helpDialog.showModal());
  ui.workspace.addEventListener('change', () => { saveSetting('workspace', ui.workspace.value); renderDossier().catch(showLoadError); });
  ui.refresh.addEventListener('click', () => refreshLocalState(true).catch(showLoadError));
  ui.exportJson.addEventListener('click', exportJson); ui.exportMarkdown.addEventListener('click', exportMarkdown);
  ui.copyFingerprint.addEventListener('click', copyFingerprint);
  window.addEventListener('storage', (event) => {
    if (event.key?.startsWith('physmath.')) refreshLocalState(false).catch((error) => console.error(error));
  });
}
async function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  try { await navigator.serviceWorker.register('./sw.js', { scope: './' }); } catch (error) { console.warn('Service worker registration failed:', error); }
}
async function init() {
  document.documentElement.dataset.theme = state.theme; translateDocument();
  try {
    const [index, nodes, edges, moves, collections, registryRaw] = await Promise.all([
      loadJson('./graph/index.json'), loadJson('./graph/nodes/core.json'), loadJson('./graph/edges.json'),
      loadJson('./graph/research_moves.json'), loadJson('./graph/collections.json'), loadJson('./graph/reference-registry.json'),
    ]);
    state.index = index; state.nodes = nodes; state.edges = edges; state.moves = moves; state.collections = collections;
    state.registry = normalizeReferenceRegistry(registryRaw); state.leanCatalog = normalizeLeanCatalog(nodes);
    state.currentSnapshot = await createGraphSnapshot({ index, nodes, edges, research_moves: moves, collections });
    bindEvents(); await refreshLocalState(false);
    ui.loading.hidden = true; ui.center.hidden = false; registerServiceWorker();
  } catch (error) { console.error(error); showLoadError(error); }
}

init();
