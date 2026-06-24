import {
  IDENTIFIER_KINDS,
  REVIEW_STATUSES,
  SOURCE_CLASSES,
  buildEvidenceWorklist,
  buildReviewPacket,
  createReviewLedger,
  exportReviewLedger,
  importReviewLedger,
  loadReviewLedger,
  mergeReviewLedgers,
  normalizeReferenceRegistry,
  removeReview,
  saveReviewLedger,
  summarizeEvidenceReviews,
  upsertReview,
  validateReviewFile,
} from './lib/evidence-review.js';

const STRINGS = {
  en: {
    'nav.skip': 'Skip to evidence review', 'nav.primary': 'Primary navigation',
    'nav.research': 'Research graph', 'nav.learning': 'Learning map', 'nav.workbench': 'Workbench',
    'nav.evidence': 'Evidence review', 'nav.repository': 'Repository',
    'app.tagline': 'Audit references without promoting claims', 'header.language': 'Interface language',
    'header.theme': 'Change theme', 'header.help': 'Evidence review help',
    loading: 'Loading the canonical reference registry…',
    'controls.eyebrow': 'Local review state', 'controls.title': 'Evidence queue',
    'summary.title': 'Review summary', 'summary.total': 'References', 'summary.reviewed': 'Reviewed',
    'summary.followup': 'Follow-up', 'summary.verified': 'Verified', 'summary.highImpact': 'High-impact open',
    'summary.identifiers': 'Identifiers',
    'filters.title': 'Filter worklist', 'filters.clear': 'Clear', 'filters.search': 'Search references',
    'filters.placeholder': 'Title, URL, identifier or canonical usage', 'filters.status': 'Review status',
    'filters.scope': 'Reference scope', 'filters.type': 'Source type', 'filters.usage': 'Used by',
    'filters.sort': 'Sort queue', 'filters.all': 'All', 'filters.claim': 'Claim',
    'filters.context': 'Context', 'filters.formalization': 'Formalization', 'filters.nodes': 'Nodes',
    'filters.edges': 'Edges', 'filters.mixed': 'Nodes and edges', 'filters.priority': 'Review priority',
    'filters.usageCount': 'Canonical reuse', 'filters.label': 'Label', 'filters.statusSort': 'Status',
    'filters.updated': 'Last local update',
    'status.unreviewed': 'Unreviewed', 'status.verified': 'Verified',
    'status.needs-follow-up': 'Needs follow-up', 'status.superseded': 'Superseded',
    'class.unknown': 'Not classified', 'class.primary': 'Primary source', 'class.secondary': 'Secondary source',
    'class.official': 'Official documentation', 'identifier.none': 'No identifier',
    'identifier.doi': 'DOI', 'identifier.arxiv': 'arXiv', 'identifier.isbn': 'ISBN', 'identifier.other': 'Other',
    'selection.title': 'Review packet', 'selection.count': 'selected references',
    'selection.selectVisible': 'Select visible', 'selection.clear': 'Clear selection',
    'selection.followup': 'Mark for follow-up', 'selection.export': 'Export review packet',
    'portable.title': 'Portable local reviews', 'portable.body': 'Review notes stay in this browser unless exported.',
    'portable.mode': 'Import mode', 'portable.merge': 'Merge newest records', 'portable.replace': 'Replace local ledger',
    'portable.export': 'Export ledger JSON', 'portable.import': 'Import ledger JSON',
    'portable.reset': 'Clear local reviews', 'portable.file': 'Evidence review import file',
    'hero.eyebrow': 'Reference governance', 'hero.title': 'Review evidence where it carries the most graph impact',
    'hero.body': 'Priorities combine review state, claim scope and canonical reuse. They are a curation queue, not a new scientific confidence score.',
    'hero.local': 'Local-only review notes', 'queue.title': 'Reference worklist',
    'queue.toggle': 'Toggle visible', 'queue.emptyTitle': 'No references match',
    'queue.emptyBody': 'Clear filters or choose another review state.',
    'queue.visible': '{visible} of {total} references shown', 'queue.priority': 'Priority {score}',
    'queue.usages': '{count} canonical uses', 'queue.nodes': '{count} nodes', 'queue.edges': '{count} edges',
    'queue.review': 'Review', 'queue.identifierSuggested': 'Suggested {kind}: {value}',
    'review.eyebrow': 'Local record', 'review.close': 'Close review editor', 'review.status': 'Status',
    'review.class': 'Source class', 'review.checked': 'Checked date', 'review.identifierKind': 'Identifier kind',
    'review.identifierValue': 'Identifier value', 'review.notes': 'Review notes',
    'review.notesPlaceholder': 'What was checked, what remains uncertain, and which canonical claims are affected?',
    'review.warning': 'Saving this record does not change graph confidence or canonical references.',
    'review.remove': 'Remove local record', 'review.cancel': 'Cancel', 'review.save': 'Save review',
    'help.title': 'How evidence review behaves', 'help.registry': 'The canonical reference registry remains read-only.',
    'help.priority': 'Priority is a worklist heuristic based on scope, reuse and local review status.',
    'help.identifiers': 'DOI and arXiv values are inferred only as editable suggestions.',
    'help.portable': 'Exported packets preserve canonical usages and local notes for deliberate curation.',
    'help.close': 'Close', 'reset.title': 'Clear all local evidence reviews?',
    'reset.body': 'Canonical references are unaffected. Export the ledger first when needed.',
    'reset.cancel': 'Cancel', 'reset.confirm': 'Clear reviews',
    'toast.saved': 'Review saved locally', 'toast.removed': 'Local review removed',
    'toast.followup': 'Selected references marked for follow-up', 'toast.exported': 'Review data exported',
    'toast.imported': 'Review ledger imported', 'toast.importFailed': 'Import failed: {message}',
    'toast.reset': 'Local review ledger cleared', 'toast.theme': 'Theme: {value}',
    'save.saved': 'Saved locally', 'error.title': 'Evidence review could not load',
    'error.body': 'The canonical reference registry or graph files are unavailable or invalid.',
  },
  es: {
    'nav.skip': 'Saltar a la revisión de evidencia', 'nav.primary': 'Navegación principal',
    'nav.research': 'Grafo de investigación', 'nav.learning': 'Mapa de aprendizaje',
    'nav.workbench': 'Banco de trabajo', 'nav.evidence': 'Revisión de evidencia', 'nav.repository': 'Repositorio',
    'app.tagline': 'Audita referencias sin elevar afirmaciones', 'header.language': 'Idioma de la interfaz',
    'header.theme': 'Cambiar tema', 'header.help': 'Ayuda de revisión de evidencia',
    loading: 'Cargando el registro canónico de referencias…',
    'controls.eyebrow': 'Estado local de revisión', 'controls.title': 'Cola de evidencia',
    'summary.title': 'Resumen de revisión', 'summary.total': 'Referencias', 'summary.reviewed': 'Revisadas',
    'summary.followup': 'Seguimiento', 'summary.verified': 'Verificadas', 'summary.highImpact': 'Alto impacto abiertas',
    'summary.identifiers': 'Identificadores',
    'filters.title': 'Filtrar cola', 'filters.clear': 'Limpiar', 'filters.search': 'Buscar referencias',
    'filters.placeholder': 'Título, URL, identificador o uso canónico', 'filters.status': 'Estado de revisión',
    'filters.scope': 'Alcance de la referencia', 'filters.type': 'Tipo de fuente', 'filters.usage': 'Usada por',
    'filters.sort': 'Ordenar cola', 'filters.all': 'Todas', 'filters.claim': 'Afirmación',
    'filters.context': 'Contexto', 'filters.formalization': 'Formalización', 'filters.nodes': 'Nodos',
    'filters.edges': 'Aristas', 'filters.mixed': 'Nodos y aristas', 'filters.priority': 'Prioridad de revisión',
    'filters.usageCount': 'Reutilización canónica', 'filters.label': 'Etiqueta', 'filters.statusSort': 'Estado',
    'filters.updated': 'Última actualización local',
    'status.unreviewed': 'Sin revisar', 'status.verified': 'Verificada',
    'status.needs-follow-up': 'Requiere seguimiento', 'status.superseded': 'Sustituida',
    'class.unknown': 'Sin clasificar', 'class.primary': 'Fuente primaria', 'class.secondary': 'Fuente secundaria',
    'class.official': 'Documentación oficial', 'identifier.none': 'Sin identificador',
    'identifier.doi': 'DOI', 'identifier.arxiv': 'arXiv', 'identifier.isbn': 'ISBN', 'identifier.other': 'Otro',
    'selection.title': 'Paquete de revisión', 'selection.count': 'referencias seleccionadas',
    'selection.selectVisible': 'Seleccionar visibles', 'selection.clear': 'Vaciar selección',
    'selection.followup': 'Marcar para seguimiento', 'selection.export': 'Exportar paquete de revisión',
    'portable.title': 'Revisiones locales portátiles', 'portable.body': 'Las notas permanecen en este navegador salvo exportación.',
    'portable.mode': 'Modo de importación', 'portable.merge': 'Fusionar registros más recientes',
    'portable.replace': 'Sustituir libro local', 'portable.export': 'Exportar libro JSON',
    'portable.import': 'Importar libro JSON', 'portable.reset': 'Borrar revisiones locales',
    'portable.file': 'Archivo de importación de revisiones',
    'hero.eyebrow': 'Gobernanza de referencias', 'hero.title': 'Revisa la evidencia donde tiene mayor impacto en el grafo',
    'hero.body': 'La prioridad combina estado local, alcance y reutilización canónica. Es una cola de curación, no una nueva puntuación científica.',
    'hero.local': 'Notas locales de revisión', 'queue.title': 'Cola de referencias',
    'queue.toggle': 'Alternar visibles', 'queue.emptyTitle': 'Ninguna referencia coincide',
    'queue.emptyBody': 'Limpia los filtros o elige otro estado.',
    'queue.visible': 'Se muestran {visible} de {total} referencias', 'queue.priority': 'Prioridad {score}',
    'queue.usages': '{count} usos canónicos', 'queue.nodes': '{count} nodos', 'queue.edges': '{count} aristas',
    'queue.review': 'Revisar', 'queue.identifierSuggested': '{kind} sugerido: {value}',
    'review.eyebrow': 'Registro local', 'review.close': 'Cerrar editor de revisión', 'review.status': 'Estado',
    'review.class': 'Clase de fuente', 'review.checked': 'Fecha de comprobación',
    'review.identifierKind': 'Tipo de identificador', 'review.identifierValue': 'Valor del identificador',
    'review.notes': 'Notas de revisión',
    'review.notesPlaceholder': 'Qué se comprobó, qué sigue incierto y qué afirmaciones canónicas quedan afectadas',
    'review.warning': 'Guardar este registro no cambia la confianza ni las referencias canónicas.',
    'review.remove': 'Eliminar registro local', 'review.cancel': 'Cancelar', 'review.save': 'Guardar revisión',
    'help.title': 'Cómo funciona la revisión', 'help.registry': 'El registro canónico permanece en modo de solo lectura.',
    'help.priority': 'La prioridad es una heurística basada en alcance, reutilización y estado local.',
    'help.identifiers': 'DOI y arXiv se infieren solo como sugerencias editables.',
    'help.portable': 'Los paquetes exportados conservan usos canónicos y notas locales para una curación deliberada.',
    'help.close': 'Cerrar', 'reset.title': '¿Borrar todas las revisiones locales?',
    'reset.body': 'Las referencias canónicas no cambian. Exporta antes cuando sea necesario.',
    'reset.cancel': 'Cancelar', 'reset.confirm': 'Borrar revisiones',
    'toast.saved': 'Revisión guardada localmente', 'toast.removed': 'Revisión local eliminada',
    'toast.followup': 'Referencias seleccionadas marcadas para seguimiento', 'toast.exported': 'Datos de revisión exportados',
    'toast.imported': 'Libro de revisiones importado', 'toast.importFailed': 'Error de importación: {message}',
    'toast.reset': 'Libro local de revisiones borrado', 'toast.theme': 'Tema: {value}',
    'save.saved': 'Guardado localmente', 'error.title': 'No se pudo cargar la revisión de evidencia',
    'error.body': 'El registro canónico o los archivos del grafo no están disponibles o no son válidos.',
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
  loading: byId('loading'), center: byId('evidence-center'), language: byId('language'), theme: byId('theme'), help: byId('help'),
  saveState: byId('save-state'), search: byId('search'), statusFilter: byId('status-filter'), scopeFilter: byId('scope-filter'),
  typeFilter: byId('type-filter'), usageFilter: byId('usage-filter'), sort: byId('sort'), clearFilters: byId('clear-filters'),
  statTotal: byId('stat-total'), statReviewed: byId('stat-reviewed'), statFollowup: byId('stat-followup'),
  statVerified: byId('stat-verified'), statHighImpact: byId('stat-high-impact'), statIdentifiers: byId('stat-identifiers'),
  selectedCount: byId('selected-count'), selectVisible: byId('select-visible'), clearSelection: byId('clear-selection'),
  markFollowup: byId('mark-followup'), exportPacket: byId('export-packet'), importMode: byId('import-mode'),
  exportLedger: byId('export-ledger'), importLedger: byId('import-ledger'), resetLedger: byId('reset-ledger'), ledgerFile: byId('ledger-file'),
  visibleSummary: byId('visible-summary'), toggleVisible: byId('toggle-visible'), list: byId('reference-list'), empty: byId('empty'),
  reviewDialog: byId('review-dialog'), reviewTitle: byId('review-title'), reviewUrl: byId('review-url'), reviewUsage: byId('review-usage'),
  reviewStatus: byId('review-status'), sourceClass: byId('source-class'), checkedAt: byId('checked-at'),
  identifierKind: byId('identifier-kind'), identifierValue: byId('identifier-value'), reviewNotes: byId('review-notes'),
  removeReview: byId('remove-review'), saveReview: byId('save-review'), helpDialog: byId('help-dialog'), resetDialog: byId('reset-dialog'),
  toasts: byId('toasts'),
};

const memoryStorage = (() => {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)) };
})();

function storageBackend() {
  try {
    const candidate = window.localStorage;
    candidate.getItem('__physmath_probe__');
    return candidate;
  } catch {
    return memoryStorage;
  }
}

const state = {
  language: detectLanguage(), theme: readSetting('theme', 'system'), registry: null, validUrls: new Set(), ledger: null,
  nodes: new Map(), edges: new Map(), visible: [], selected: new Set(), activeUrl: '', storage: storageBackend(),
};

function detectLanguage() {
  const saved = readSetting('language', '');
  if (saved === 'en' || saved === 'es') return saved;
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}
function readSetting(key, fallback) {
  try { return localStorage.getItem(`physmath.evidence.${key}`) ?? fallback; } catch { return fallback; }
}
function saveSetting(key, value) {
  try { localStorage.setItem(`physmath.evidence.${key}`, value); } catch { /* Optional preference. */ }
}
function t(key, variables = {}) {
  let value = STRINGS[state.language]?.[key] ?? STRINGS.en[key] ?? key;
  for (const [name, replacement] of Object.entries(variables)) value = value.replaceAll(`{${name}}`, String(replacement));
  return value;
}
function translateDocument() {
  document.documentElement.lang = state.language;
  document.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach((node) => { node.setAttribute('aria-label', t(node.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => { node.setAttribute('placeholder', t(node.dataset.i18nPlaceholder)); });
  document.title = state.language === 'es' ? 'PhysMath Knowledge Tree — Revisión de evidencia' : 'PhysMath Knowledge Tree — Evidence review';
  ui.language.value = state.language;
}
function option(value, label) {
  const result = element('option', { value });
  result.textContent = label;
  return result;
}
function rebuildOptions() {
  const values = {
    status: ui.statusFilter.value || 'all', scope: ui.scopeFilter.value || 'all', type: ui.typeFilter.value || 'all',
    usage: ui.usageFilter.value || 'all', sort: ui.sort.value || 'priority', reviewStatus: ui.reviewStatus.value || 'unreviewed',
    sourceClass: ui.sourceClass.value || 'unknown', identifierKind: ui.identifierKind.value || '',
  };
  ui.statusFilter.replaceChildren(option('all', t('filters.all')), ...REVIEW_STATUSES.map((value) => option(value, t(`status.${value}`))));
  ui.scopeFilter.replaceChildren(option('all', t('filters.all')), option('claim', t('filters.claim')), option('context', t('filters.context')), option('formalization', t('filters.formalization')));
  const types = state.registry ? [...new Set(state.registry.references.map(({ type }) => type))].sort() : [];
  ui.typeFilter.replaceChildren(option('all', t('filters.all')), ...types.map((value) => option(value, value)));
  ui.usageFilter.replaceChildren(option('all', t('filters.all')), option('node', t('filters.nodes')), option('edge', t('filters.edges')), option('mixed', t('filters.mixed')));
  ui.sort.replaceChildren(option('priority', t('filters.priority')), option('usage', t('filters.usageCount')), option('label', t('filters.label')), option('status', t('filters.statusSort')), option('updated', t('filters.updated')));
  ui.reviewStatus.replaceChildren(...REVIEW_STATUSES.map((value) => option(value, t(`status.${value}`))));
  ui.sourceClass.replaceChildren(...SOURCE_CLASSES.map((value) => option(value, t(`class.${value}`))));
  ui.identifierKind.replaceChildren(option('', t('identifier.none')), ...IDENTIFIER_KINDS.map((value) => option(value, t(`identifier.${value}`))));
  ui.statusFilter.value = values.status; ui.scopeFilter.value = values.scope; ui.typeFilter.value = values.type;
  ui.usageFilter.value = values.usage; ui.sort.value = values.sort; ui.reviewStatus.value = values.reviewStatus;
  ui.sourceClass.value = values.sourceClass; ui.identifierKind.value = values.identifierKind;
}

async function loadJson(path) {
  const response = await fetch(path, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}

async function init() {
  document.documentElement.dataset.theme = state.theme;
  translateDocument();
  try {
    const [registry, nodes, edges] = await Promise.all([
      loadJson('./graph/reference-registry.json'), loadJson('./graph/nodes/core.json'), loadJson('./graph/edges.json'),
    ]);
    state.registry = normalizeReferenceRegistry(registry);
    state.validUrls = new Set(state.registry.references.map(({ url }) => url));
    state.nodes = new Map(nodes.map((node) => [node.id, node]));
    state.edges = new Map(edges.map((edge) => [edge.id, edge]));
    state.ledger = loadReviewLedger(state.storage, state.validUrls);
    rebuildOptions();
    bindEvents();
    render();
    ui.loading.hidden = true;
    ui.center.hidden = false;
    registerServiceWorker();
  } catch (error) {
    console.error(error);
    showLoadError(error);
  }
}
function showLoadError(error) {
  const wrapper = element('div');
  const title = element('strong'); title.textContent = t('error.title');
  const body = element('p'); body.textContent = t('error.body');
  const technical = element('code'); technical.textContent = error instanceof Error ? error.message : String(error);
  wrapper.append(title, body, technical);
  ui.loading.replaceChildren(wrapper);
  ui.loading.classList.add('load-error');
}

function render() {
  const summary = summarizeEvidenceReviews(state.registry, state.ledger);
  ui.statTotal.textContent = String(summary.total);
  ui.statReviewed.textContent = String(summary.reviewed);
  ui.statFollowup.textContent = String(summary.by_status['needs-follow-up']);
  ui.statVerified.textContent = String(summary.by_status.verified);
  ui.statHighImpact.textContent = String(summary.high_impact_unreviewed);
  ui.statIdentifiers.textContent = String(summary.recognized_identifiers);
  state.visible = buildEvidenceWorklist(state.registry, state.ledger, {
    query: ui.search.value, status: ui.statusFilter.value, scope: ui.scopeFilter.value,
    type: ui.typeFilter.value, usage: ui.usageFilter.value, sort: ui.sort.value,
  });
  renderList(summary.total);
  renderSelection();
}

function usageName(value) {
  const [kind, id] = value.split(':', 2);
  if (kind === 'node') return state.nodes.get(id)?.title ?? id;
  const edge = state.edges.get(id);
  if (!edge) return id;
  const source = state.nodes.get(edge.source)?.title ?? edge.source;
  const target = state.nodes.get(edge.target)?.title ?? edge.target;
  return `${source} → ${target}`;
}
function badge(text, className = '') {
  const node = element('span', { class: `badge ${className}`.trim() });
  node.textContent = text;
  return node;
}
function renderList(total) {
  const fragment = document.createDocumentFragment();
  for (const item of state.visible) {
    const card = element('article', { class: `reference-card${state.selected.has(item.reference.url) ? ' selected' : ''}` });
    const checkbox = element('input', { type: 'checkbox', 'aria-label': `Select ${item.reference.label}` });
    checkbox.checked = state.selected.has(item.reference.url);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) state.selected.add(item.reference.url); else state.selected.delete(item.reference.url);
      renderSelection(); card.classList.toggle('selected', checkbox.checked);
    });
    const main = element('div', { class: 'reference-main' });
    const heading = element('h3');
    const link = element('a', { href: item.reference.url, target: '_blank', rel: 'noreferrer' }); link.textContent = item.reference.label;
    heading.append(link);
    const domain = element('p', { class: 'reference-domain' }); domain.textContent = new URL(item.reference.url).hostname;
    const badges = element('div', { class: 'badges' });
    badges.append(
      badge(item.reference.type),
      ...item.reference.scopes.map((scope) => badge(scope)),
      badge(t(`status.${item.status}`), `status-${item.status}`),
      badge(t('queue.usages', { count: item.usage_count })),
    );
    const identifier = item.identifier ?? item.inferred_identifier;
    if (identifier) badges.append(badge(`${identifier.kind}: ${identifier.value}`));
    const preview = element('p', { class: 'usage-preview' });
    preview.textContent = item.reference.used_by.slice(0, 2).map(usageName).join(' · ');
    main.append(heading, domain, badges, preview);
    const actions = element('div', { class: 'reference-actions' });
    const priority = element('span', { class: 'priority' }); priority.textContent = t('queue.priority', { score: item.priority_score });
    const reviewButton = element('button', { class: 'secondary-button', type: 'button' }); reviewButton.textContent = t('queue.review');
    reviewButton.addEventListener('click', () => openReview(item.reference.url));
    actions.append(priority, reviewButton);
    card.append(checkbox, main, actions);
    fragment.append(card);
  }
  ui.list.replaceChildren(fragment);
  ui.empty.hidden = state.visible.length > 0;
  ui.visibleSummary.textContent = t('queue.visible', { visible: state.visible.length, total });
  const visibleUrls = state.visible.map((item) => item.reference.url);
  ui.toggleVisible.checked = visibleUrls.length > 0 && visibleUrls.every((url) => state.selected.has(url));
  ui.toggleVisible.indeterminate = visibleUrls.some((url) => state.selected.has(url)) && !ui.toggleVisible.checked;
}
function renderSelection() {
  ui.selectedCount.textContent = String(state.selected.size);
  ui.markFollowup.disabled = state.selected.size === 0;
  ui.exportPacket.disabled = state.selected.size === 0;
}

function reviewByUrl(url) { return state.ledger.reviews.find((review) => review.url === url) ?? null; }
function openReview(url) {
  const item = buildEvidenceWorklist(state.registry, state.ledger).find(({ reference }) => reference.url === url);
  if (!item) return;
  state.activeUrl = url;
  ui.reviewTitle.textContent = item.reference.label;
  ui.reviewUrl.textContent = item.reference.url;
  const metrics = [
    [t('queue.usages', { count: item.usage_count }), String(item.usage_count)],
    [t('filters.nodes'), String(item.node_usage)], [t('filters.edges'), String(item.edge_usage)],
  ];
  const fragment = document.createDocumentFragment();
  for (const [label, value] of metrics) {
    const wrapper = element('div'); const term = element('dt'); term.textContent = label; const detail = element('dd'); detail.textContent = value;
    wrapper.append(term, detail); fragment.append(wrapper);
  }
  ui.reviewUsage.replaceChildren(fragment);
  const existing = item.review;
  const suggestion = item.inferred_identifier;
  ui.reviewStatus.value = existing?.status ?? 'unreviewed';
  ui.sourceClass.value = existing?.source_class ?? 'unknown';
  ui.checkedAt.value = existing?.checked_at?.slice(0, 10) ?? '';
  ui.identifierKind.value = existing?.identifier?.kind ?? suggestion?.kind ?? '';
  ui.identifierValue.value = existing?.identifier?.value ?? suggestion?.value ?? '';
  ui.reviewNotes.value = existing?.notes ?? '';
  ui.removeReview.disabled = !existing;
  ui.reviewDialog.showModal();
}
function saveActiveReview() {
  if (!state.activeUrl) return;
  const identifier = ui.identifierKind.value && ui.identifierValue.value.trim()
    ? { kind: ui.identifierKind.value, value: ui.identifierValue.value.trim() }
    : null;
  const checkedAt = ui.checkedAt.value ? `${ui.checkedAt.value}T00:00:00.000Z` : null;
  state.ledger = upsertReview(state.ledger, {
    url: state.activeUrl, status: ui.reviewStatus.value, source_class: ui.sourceClass.value,
    identifier, checked_at: checkedAt, notes: ui.reviewNotes.value,
  }, state.validUrls);
  persist();
  ui.reviewDialog.close();
  render();
  toast(t('toast.saved'));
}
function removeActiveReview() {
  if (!state.activeUrl) return;
  state.ledger = removeReview(state.ledger, state.activeUrl, state.validUrls);
  persist();
  ui.reviewDialog.close();
  render();
  toast(t('toast.removed'));
}
function persist() {
  state.ledger = saveReviewLedger(state.storage, state.ledger, state.validUrls);
  ui.saveState.textContent = t('save.saved');
  setTimeout(() => { ui.saveState.textContent = ''; }, 1800);
}

function selectVisible(selected) {
  for (const item of state.visible) {
    if (selected) state.selected.add(item.reference.url); else state.selected.delete(item.reference.url);
  }
  render();
}
function markSelectedFollowup() {
  for (const url of state.selected) {
    const existing = reviewByUrl(url) ?? { url, source_class: 'unknown', identifier: null, checked_at: null, notes: '' };
    state.ledger = upsertReview(state.ledger, { ...existing, status: 'needs-follow-up' }, state.validUrls);
  }
  persist(); render(); toast(t('toast.followup'));
}
function exportPacket() {
  const packet = buildReviewPacket(state.registry, state.ledger, state.selected);
  downloadText('physmath-evidence-review-packet.json', `${JSON.stringify(packet, null, 2)}\n`, 'application/json');
  toast(t('toast.exported'));
}
function exportLedger() {
  downloadText('physmath-evidence-review-ledger.json', `${exportReviewLedger(state.ledger, state.validUrls)}\n`, 'application/json');
  toast(t('toast.exported'));
}
async function importLedgerFile(file) {
  try {
    validateReviewFile(file);
    const incoming = importReviewLedger(await file.text(), state.validUrls);
    state.ledger = ui.importMode.value === 'replace'
      ? incoming
      : mergeReviewLedgers(state.ledger, incoming, state.validUrls);
    persist(); render(); toast(t('toast.imported'));
  } catch (error) {
    toast(t('toast.importFailed', { message: error instanceof Error ? error.message : String(error) }));
  } finally {
    ui.ledgerFile.value = '';
  }
}
function downloadText(filename, text, type) {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = element('a', { href: url, download: filename });
  document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function toast(message) {
  const item = element('div', { class: 'toast' }); item.textContent = message; ui.toasts.append(item);
  setTimeout(() => item.remove(), 2800);
}
function cycleTheme() {
  const choices = ['system', 'light', 'dark'];
  state.theme = choices[(choices.indexOf(state.theme) + 1) % choices.length];
  document.documentElement.dataset.theme = state.theme; saveSetting('theme', state.theme);
  toast(t('toast.theme', { value: state.theme }));
}
function clearFilters() {
  ui.search.value = ''; ui.statusFilter.value = 'all'; ui.scopeFilter.value = 'all';
  ui.typeFilter.value = 'all'; ui.usageFilter.value = 'all'; ui.sort.value = 'priority'; render();
}
function bindEvents() {
  for (const control of [ui.search, ui.statusFilter, ui.scopeFilter, ui.typeFilter, ui.usageFilter, ui.sort]) {
    control.addEventListener(control === ui.search ? 'input' : 'change', render);
  }
  ui.clearFilters.addEventListener('click', clearFilters);
  ui.selectVisible.addEventListener('click', () => selectVisible(true));
  ui.clearSelection.addEventListener('click', () => { state.selected.clear(); render(); });
  ui.toggleVisible.addEventListener('change', () => selectVisible(ui.toggleVisible.checked));
  ui.markFollowup.addEventListener('click', markSelectedFollowup);
  ui.exportPacket.addEventListener('click', exportPacket);
  ui.exportLedger.addEventListener('click', exportLedger);
  ui.importLedger.addEventListener('click', () => ui.ledgerFile.click());
  ui.ledgerFile.addEventListener('change', () => { if (ui.ledgerFile.files?.[0]) importLedgerFile(ui.ledgerFile.files[0]); });
  ui.resetLedger.addEventListener('click', () => ui.resetDialog.showModal());
  ui.resetDialog.addEventListener('close', () => {
    if (ui.resetDialog.returnValue !== 'confirm') return;
    state.ledger = createReviewLedger(); persist(); render(); toast(t('toast.reset'));
  });
  ui.saveReview.addEventListener('click', saveActiveReview);
  ui.removeReview.addEventListener('click', removeActiveReview);
  ui.help.addEventListener('click', () => ui.helpDialog.showModal());
  ui.theme.addEventListener('click', cycleTheme);
  ui.language.addEventListener('change', () => {
    state.language = ui.language.value === 'es' ? 'es' : 'en'; saveSetting('language', state.language);
    translateDocument(); rebuildOptions(); render();
  });
}
async function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  try { await navigator.serviceWorker.register('./sw.js', { scope: './' }); }
  catch (error) { console.warn('Service worker registration failed:', error); }
}

init();
