import {
  CHANGE_REVIEW_STORAGE_KEY,
  DECISION_STATUSES,
  ENTITY_TYPES,
  RISK_LEVELS,
  buildChangeReviewBundle,
  buildChangeWorklist,
  changeReviewBundleMarkdown,
  createDecisionLedger,
  createGraphSnapshot,
  diffGraphSnapshots,
  exportGraphSnapshot,
  importChangeReviewFile,
  loadChangeReviewState,
  removeDecision,
  saveChangeReviewState,
  summarizeChangeSet,
  summarizeDecisions,
  upsertDecision,
  validateChangeReviewFile,
} from './lib/change-review.js';

const STRINGS = {
  en: {
    'nav.skip': 'Skip to canonical change review', 'nav.primary': 'Primary navigation',
    'nav.research': 'Research graph', 'nav.learning': 'Learning map', 'nav.workbench': 'Workbench',
    'nav.evidence': 'Evidence review', 'nav.changes': 'Change review', 'nav.repository': 'Repository',
    'app.tagline': 'Review graph evolution before canonical promotion', 'header.language': 'Interface language',
    'header.theme': 'Change theme', 'header.help': 'Canonical change review help',
    loading: 'Fingerprinting the current canonical graph…',
    'controls.eyebrow': 'Local review state', 'controls.title': 'Canonical change review',
    'baseline.title': 'Baseline snapshot', 'baseline.download': 'Download current snapshot',
    'baseline.useCurrent': 'Use current graph as baseline', 'baseline.import': 'Import snapshot or review bundle',
    'baseline.clear': 'Clear baseline', 'baseline.file': 'Canonical snapshot or change-review bundle file',
    'baseline.none': 'No baseline loaded', 'baseline.loaded': 'Baseline {fingerprint} · {date}',
    'summary.title': 'Change summary', 'summary.total': 'Changes', 'summary.critical': 'Critical',
    'summary.high': 'High', 'summary.promotions': 'Promotions', 'summary.referenceLosses': 'Reference losses',
    'summary.reviewed': 'Reviewed',
    'filters.title': 'Filter changes', 'filters.clear': 'Clear', 'filters.search': 'Search changes',
    'filters.placeholder': 'ID, title, field, flag or review note', 'filters.risk': 'Risk',
    'filters.entity': 'Entity', 'filters.change': 'Change type', 'filters.status': 'Decision',
    'filters.sort': 'Sort worklist', 'filters.all': 'All', 'filters.sortRisk': 'Risk first',
    'filters.sortEntity': 'Entity and ID', 'filters.sortStatus': 'Decision status',
    'packet.title': 'Review packet', 'packet.selected': 'selected changes',
    'packet.selectVisible': 'Select visible', 'packet.clearSelection': 'Clear selection',
    'packet.needsWork': 'Mark needs work', 'packet.exportJson': 'Export packet JSON',
    'packet.exportMarkdown': 'Export packet Markdown',
    'hero.eyebrow': 'Canonical governance', 'hero.title': 'Detect risky graph drift before it becomes canonical',
    'hero.body': 'The reviewer flags confidence promotions, endpoint rewrites, reference losses, contract changes and removals. Flags prioritize human review; they do not decide scientific correctness.',
    'hero.local': 'Local-only decisions',
    'empty.title': 'Import an earlier canonical snapshot',
    'empty.body': 'Download today’s snapshot now, then import it after a future graph update. Review bundles can also restore a baseline and its local decisions.',
    'worklist.title': 'Canonical change worklist', 'worklist.toggle': 'Toggle visible',
    'worklist.noChangesTitle': 'No changes match',
    'worklist.noChangesBody': 'Clear filters, or the baseline and current graph may be identical.',
    'worklist.visible': '{visible} of {total} changes visible', 'worklist.fields': '{count} changed fields',
    'worklist.review': 'Review', 'worklist.noFields': 'Whole entity added or removed',
    'decision.eyebrow': 'Local review decision', 'decision.close': 'Close decision editor',
    'decision.status': 'Decision', 'decision.notes': 'Review notes',
    'decision.notesPlaceholder': 'Why is this acceptable, blocked, or rejected? Which verification is still required?',
    'decision.warning': 'This local decision does not edit canonical JSON or approve a scientific claim.',
    'decision.reset': 'Reset to pending', 'decision.cancel': 'Cancel', 'decision.save': 'Save decision',
    'help.title': 'How canonical change review behaves',
    'help.snapshot': 'Snapshots fingerprint normalized graph data, independent of array order.',
    'help.flags': 'Risk flags identify governance-sensitive edits, not mathematical truth.',
    'help.local': 'Decisions remain browser-local unless exported in a review packet.',
    'help.readonly': 'The reviewer never mutates graph JSON or confidence labels.', 'help.close': 'Close',
    'clear.title': 'Clear the local baseline and decisions?',
    'clear.body': 'The canonical graph is unaffected. Export a review packet first when needed.',
    'clear.cancel': 'Cancel', 'clear.confirm': 'Clear local review',
    'status.pending': 'Pending', 'status.accepted': 'Accepted', 'status.needs-work': 'Needs work',
    'status.rejected': 'Rejected', 'risk.critical': 'Critical', 'risk.high': 'High',
    'risk.medium': 'Medium', 'risk.low': 'Low', 'risk.info': 'Info',
    'entity.metadata': 'Metadata', 'entity.node': 'Node', 'entity.edge': 'Edge',
    'entity.research_move': 'Research move', 'entity.collection': 'Collection',
    'change.added': 'Added', 'change.removed': 'Removed', 'change.modified': 'Modified',
    'toast.saved': 'Local review saved.', 'toast.snapshot': 'Current snapshot downloaded.',
    'toast.imported': 'Baseline and review state imported.', 'toast.cleared': 'Local baseline cleared.',
    'toast.packet': 'Review packet exported.', 'toast.failed': 'The file could not be imported.',
    'toast.selected': 'Visible changes selected.', 'toast.needsWork': 'Selected changes marked needs work.',
    'save.saved': 'Saved locally', 'error.title': 'Canonical data could not be loaded',
    'error.body': 'The reviewer remains closed because its canonical inputs failed validation.',
  },
  es: {
    'nav.skip': 'Saltar a la revisión de cambios canónicos', 'nav.primary': 'Navegación principal',
    'nav.research': 'Grafo de investigación', 'nav.learning': 'Mapa de aprendizaje', 'nav.workbench': 'Banco',
    'nav.evidence': 'Revisión de evidencia', 'nav.changes': 'Revisión de cambios', 'nav.repository': 'Repositorio',
    'app.tagline': 'Revisa la evolución del grafo antes de promoverla', 'header.language': 'Idioma de la interfaz',
    'header.theme': 'Cambiar tema', 'header.help': 'Ayuda de revisión de cambios canónicos',
    loading: 'Calculando la huella del grafo canónico actual…',
    'controls.eyebrow': 'Estado local de revisión', 'controls.title': 'Revisión de cambios canónicos',
    'baseline.title': 'Snapshot base', 'baseline.download': 'Descargar snapshot actual',
    'baseline.useCurrent': 'Usar el grafo actual como base', 'baseline.import': 'Importar snapshot o paquete de revisión',
    'baseline.clear': 'Borrar base', 'baseline.file': 'Archivo de snapshot canónico o paquete de revisión',
    'baseline.none': 'No hay snapshot base', 'baseline.loaded': 'Base {fingerprint} · {date}',
    'summary.title': 'Resumen de cambios', 'summary.total': 'Cambios', 'summary.critical': 'Críticos',
    'summary.high': 'Altos', 'summary.promotions': 'Promociones', 'summary.referenceLosses': 'Pérdidas de referencias',
    'summary.reviewed': 'Revisados',
    'filters.title': 'Filtrar cambios', 'filters.clear': 'Limpiar', 'filters.search': 'Buscar cambios',
    'filters.placeholder': 'ID, título, campo, alerta o nota', 'filters.risk': 'Riesgo',
    'filters.entity': 'Entidad', 'filters.change': 'Tipo de cambio', 'filters.status': 'Decisión',
    'filters.sort': 'Ordenar cola', 'filters.all': 'Todos', 'filters.sortRisk': 'Riesgo primero',
    'filters.sortEntity': 'Entidad e ID', 'filters.sortStatus': 'Estado de decisión',
    'packet.title': 'Paquete de revisión', 'packet.selected': 'cambios seleccionados',
    'packet.selectVisible': 'Seleccionar visibles', 'packet.clearSelection': 'Limpiar selección',
    'packet.needsWork': 'Marcar como pendiente', 'packet.exportJson': 'Exportar paquete JSON',
    'packet.exportMarkdown': 'Exportar paquete Markdown',
    'hero.eyebrow': 'Gobernanza canónica', 'hero.title': 'Detecta deriva arriesgada antes de hacerla canónica',
    'hero.body': 'El revisor señala promociones de confianza, cambios de extremos, pérdidas de referencias, cambios de contrato y borrados. Las alertas priorizan revisión humana; no deciden la corrección científica.',
    'hero.local': 'Decisiones solo locales',
    'empty.title': 'Importa un snapshot canónico anterior',
    'empty.body': 'Descarga el snapshot de hoy y vuelve a importarlo tras una futura actualización. Los paquetes también restauran la base y sus decisiones locales.',
    'worklist.title': 'Cola de cambios canónicos', 'worklist.toggle': 'Alternar visibles',
    'worklist.noChangesTitle': 'Ningún cambio coincide',
    'worklist.noChangesBody': 'Limpia los filtros o la base y el grafo actual pueden ser idénticos.',
    'worklist.visible': '{visible} de {total} cambios visibles', 'worklist.fields': '{count} campos modificados',
    'worklist.review': 'Revisar', 'worklist.noFields': 'Entidad completa añadida o eliminada',
    'decision.eyebrow': 'Decisión local de revisión', 'decision.close': 'Cerrar editor de decisión',
    'decision.status': 'Decisión', 'decision.notes': 'Notas de revisión',
    'decision.notesPlaceholder': '¿Por qué es aceptable, está bloqueado o debe rechazarse? ¿Qué verificación falta?',
    'decision.warning': 'Esta decisión local no edita el JSON canónico ni aprueba una afirmación científica.',
    'decision.reset': 'Volver a pendiente', 'decision.cancel': 'Cancelar', 'decision.save': 'Guardar decisión',
    'help.title': 'Cómo funciona la revisión de cambios',
    'help.snapshot': 'Los snapshots usan la huella de datos normalizados, independientemente del orden de arrays.',
    'help.flags': 'Las alertas detectan ediciones sensibles de gobernanza, no verdad matemática.',
    'help.local': 'Las decisiones permanecen locales salvo exportación explícita.',
    'help.readonly': 'El revisor nunca modifica el JSON ni las etiquetas de confianza.', 'help.close': 'Cerrar',
    'clear.title': '¿Borrar la base local y las decisiones?',
    'clear.body': 'El grafo canónico no se modifica. Exporta antes el paquete cuando sea necesario.',
    'clear.cancel': 'Cancelar', 'clear.confirm': 'Borrar revisión local',
    'status.pending': 'Pendiente', 'status.accepted': 'Aceptado', 'status.needs-work': 'Requiere trabajo',
    'status.rejected': 'Rechazado', 'risk.critical': 'Crítico', 'risk.high': 'Alto',
    'risk.medium': 'Medio', 'risk.low': 'Bajo', 'risk.info': 'Información',
    'entity.metadata': 'Metadatos', 'entity.node': 'Nodo', 'entity.edge': 'Arista',
    'entity.research_move': 'Movimiento', 'entity.collection': 'Colección',
    'change.added': 'Añadido', 'change.removed': 'Eliminado', 'change.modified': 'Modificado',
    'toast.saved': 'Revisión local guardada.', 'toast.snapshot': 'Snapshot actual descargado.',
    'toast.imported': 'Base y decisiones importadas.', 'toast.cleared': 'Base local borrada.',
    'toast.packet': 'Paquete de revisión exportado.', 'toast.failed': 'No se pudo importar el archivo.',
    'toast.selected': 'Cambios visibles seleccionados.', 'toast.needsWork': 'Cambios seleccionados marcados como pendientes.',
    'save.saved': 'Guardado localmente', 'error.title': 'No se pudieron cargar los datos canónicos',
    'error.body': 'El revisor permanece cerrado porque falló la validación de sus entradas.',
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
  loading: byId('loading'), center: byId('change-center'), language: byId('language'), theme: byId('theme'), help: byId('help'),
  helpDialog: byId('help-dialog'), saveState: byId('save-state'), baselineStatus: byId('baseline-status'),
  downloadCurrent: byId('download-current'), useCurrent: byId('use-current'), importBaseline: byId('import-baseline'),
  clearBaseline: byId('clear-baseline'), baselineFile: byId('baseline-file'), clearDialog: byId('clear-dialog'),
  statTotal: byId('stat-total'), statCritical: byId('stat-critical'), statHigh: byId('stat-high'),
  statPromotions: byId('stat-promotions'), statReferenceLosses: byId('stat-reference-losses'), statReviewed: byId('stat-reviewed'),
  search: byId('search'), riskFilter: byId('risk-filter'), entityFilter: byId('entity-filter'),
  changeFilter: byId('change-filter'), statusFilter: byId('status-filter'), sort: byId('sort'), clearFilters: byId('clear-filters'),
  selectedCount: byId('selected-count'), selectVisible: byId('select-visible'), clearSelection: byId('clear-selection'),
  markNeedsWork: byId('mark-needs-work'), exportJson: byId('export-json'), exportMarkdown: byId('export-markdown'),
  emptyBaseline: byId('empty-baseline'), worklistCard: byId('worklist-card'), visibleSummary: byId('visible-summary'),
  toggleVisible: byId('toggle-visible'), changeList: byId('change-list'), noChanges: byId('no-changes'),
  decisionDialog: byId('decision-dialog'), decisionTitle: byId('decision-title'), decisionKey: byId('decision-key'),
  decisionStatus: byId('decision-status'), decisionNotes: byId('decision-notes'), saveDecision: byId('save-decision'),
  resetDecision: byId('reset-decision'), toasts: byId('toasts'),
};

const state = {
  language: detectLanguage(), theme: readSetting('theme', 'system'), current: null, baseline: null,
  changes: [], ledger: null, selected: new Set(), activeKey: '', visibleItems: [],
};

function readSetting(key, fallback) {
  try { return localStorage.getItem(`physmath.changes.${key}`) ?? fallback; } catch { return fallback; }
}
function saveSetting(key, value) {
  try { localStorage.setItem(`physmath.changes.${key}`, value); } catch { /* Optional preference. */ }
}
function detectLanguage() {
  const saved = readSetting('language', '');
  if (saved === 'en' || saved === 'es') return saved;
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}
function t(key, variables = {}) {
  let value = STRINGS[state.language]?.[key] ?? STRINGS.en[key] ?? key;
  for (const [name, replacement] of Object.entries(variables)) value = value.replaceAll(`{${name}}`, String(replacement));
  return value;
}
function translateDocument() {
  document.documentElement.lang = state.language;
  for (const node of document.querySelectorAll('[data-i18n]')) node.textContent = t(node.dataset.i18n);
  for (const node of document.querySelectorAll('[data-i18n-aria]')) node.setAttribute('aria-label', t(node.dataset.i18nAria));
  for (const node of document.querySelectorAll('[data-i18n-placeholder]')) node.setAttribute('placeholder', t(node.dataset.i18nPlaceholder));
  document.title = state.language === 'es'
    ? 'PhysMath Knowledge Tree — Revisión de cambios canónicos'
    : 'PhysMath Knowledge Tree — Canonical change review';
  ui.language.value = state.language;
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
    const [index, nodes, edges, researchMoves, collections] = await Promise.all([
      loadJson('./graph/index.json'), loadJson('./graph/nodes/core.json'), loadJson('./graph/edges.json'),
      loadJson('./graph/research_moves.json'), loadJson('./graph/collections.json'),
    ]);
    state.current = await createGraphSnapshot({ index, nodes, edges, research_moves: researchMoves, collections });
    const saved = await loadChangeReviewState(localStorage, state.current);
    if (saved.baseline) applyBaseline(saved.baseline, saved.ledger, false);
    buildOptions();
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
  const detail = element('code'); detail.textContent = error instanceof Error ? error.message : String(error);
  wrapper.append(title, body, detail);
  ui.loading.replaceChildren(wrapper);
  ui.loading.classList.add('load-error');
}

function option(value, label) {
  const item = element('option', { value });
  item.textContent = label;
  return item;
}
function replaceOptions(select, entries, currentValue = '') {
  select.replaceChildren(...entries.map(([value, label]) => option(value, label)));
  if ([...select.options].some(({ value }) => value === currentValue)) select.value = currentValue;
}
function buildOptions() {
  const current = {
    risk: ui.riskFilter.value, entity: ui.entityFilter.value, change: ui.changeFilter.value,
    status: ui.statusFilter.value, sort: ui.sort.value, decision: ui.decisionStatus.value,
  };
  replaceOptions(ui.riskFilter, [['all', t('filters.all')], ...RISK_LEVELS.map((risk) => [risk, t(`risk.${risk}`)])], current.risk || 'all');
  replaceOptions(ui.entityFilter, [['all', t('filters.all')], ...ENTITY_TYPES.map((entity) => [entity, t(`entity.${entity}`)])], current.entity || 'all');
  replaceOptions(ui.changeFilter, [['all', t('filters.all')], ...['added', 'removed', 'modified'].map((change) => [change, t(`change.${change}`)])], current.change || 'all');
  replaceOptions(ui.statusFilter, [['all', t('filters.all')], ...DECISION_STATUSES.map((status) => [status, t(`status.${status}`)])], current.status || 'all');
  replaceOptions(ui.sort, [['risk', t('filters.sortRisk')], ['entity', t('filters.sortEntity')], ['status', t('filters.sortStatus')]], current.sort || 'risk');
  replaceOptions(ui.decisionStatus, DECISION_STATUSES.map((status) => [status, t(`status.${status}`)]), current.decision || 'pending');
}

function applyBaseline(baseline, ledger = null, persist = true) {
  state.baseline = baseline;
  state.changes = diffGraphSnapshots(baseline, state.current);
  state.ledger = ledger ?? createDecisionLedger(baseline.fingerprint, state.current.fingerprint);
  state.selected.clear();
  if (persist) persistState();
}
async function persistState() {
  if (!state.baseline) return;
  await saveChangeReviewState(localStorage, state.baseline, state.ledger, state.current);
  ui.saveState.textContent = t('save.saved');
  setTimeout(() => { ui.saveState.textContent = ''; }, 1800);
}

function filters() {
  return {
    query: ui.search.value, risk: ui.riskFilter.value, entity: ui.entityFilter.value,
    changeType: ui.changeFilter.value, status: ui.statusFilter.value, sort: ui.sort.value,
  };
}

function render() {
  const hasBaseline = Boolean(state.baseline);
  ui.baselineStatus.textContent = hasBaseline
    ? t('baseline.loaded', { fingerprint: state.baseline.fingerprint.slice(0, 12), date: state.baseline.captured_at.slice(0, 10) })
    : t('baseline.none');
  ui.clearBaseline.disabled = !hasBaseline;
  ui.emptyBaseline.hidden = hasBaseline;
  ui.worklistCard.hidden = !hasBaseline;
  const changeSummary = hasBaseline ? summarizeChangeSet(state.changes) : {
    total: 0, by_risk: { critical: 0, high: 0 }, confidence_promotions: 0, reference_losses: 0,
  };
  const decisionSummary = hasBaseline ? summarizeDecisions(state.changes, state.ledger) : { reviewed: 0 };
  ui.statTotal.textContent = String(changeSummary.total);
  ui.statCritical.textContent = String(changeSummary.by_risk.critical);
  ui.statHigh.textContent = String(changeSummary.by_risk.high);
  ui.statPromotions.textContent = String(changeSummary.confidence_promotions);
  ui.statReferenceLosses.textContent = String(changeSummary.reference_losses);
  ui.statReviewed.textContent = String(decisionSummary.reviewed);
  if (!hasBaseline) {
    state.visibleItems = [];
    renderSelection();
    return;
  }
  state.visibleItems = buildChangeWorklist(state.changes, state.ledger, filters());
  const validKeys = new Set(state.changes.map(({ key }) => key));
  for (const key of [...state.selected]) if (!validKeys.has(key)) state.selected.delete(key);
  ui.visibleSummary.textContent = t('worklist.visible', { visible: state.visibleItems.length, total: state.changes.length });
  ui.noChanges.hidden = state.visibleItems.length > 0;
  ui.changeList.replaceChildren(...state.visibleItems.map(renderChangeCard));
  const visibleKeys = state.visibleItems.map(({ change }) => change.key);
  ui.toggleVisible.checked = visibleKeys.length > 0 && visibleKeys.every((key) => state.selected.has(key));
  ui.toggleVisible.indeterminate = visibleKeys.some((key) => state.selected.has(key)) && !ui.toggleVisible.checked;
  renderSelection();
}

function renderSelection() {
  ui.selectedCount.textContent = String(state.selected.size);
  const hasVisible = state.visibleItems.length > 0;
  const hasSelected = state.selected.size > 0;
  ui.selectVisible.disabled = !hasVisible;
  ui.clearSelection.disabled = !hasSelected;
  ui.markNeedsWork.disabled = !hasSelected;
  ui.exportJson.disabled = !hasSelected;
  ui.exportMarkdown.disabled = !hasSelected;
}

function renderChangeCard({ change, decision }) {
  const card = element('article', { class: `change-card${state.selected.has(change.key) ? ' selected' : ''}` });
  const checkbox = element('input', { type: 'checkbox', 'aria-label': `${t('packet.selected')}: ${change.title}` });
  checkbox.checked = state.selected.has(change.key);
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) state.selected.add(change.key); else state.selected.delete(change.key);
    render();
  });
  const main = element('div', { class: 'change-main' });
  const title = element('h3'); title.textContent = change.title;
  const key = element('p', { class: 'change-key' }); key.textContent = change.key;
  const badges = element('div', { class: 'badges' });
  const values = [
    [`risk-${change.risk}`, t(`risk.${change.risk}`)],
    ['', t(`entity.${change.entity_type}`)],
    ['', t(`change.${change.change_type}`)],
    [`status-${decision.status}`, t(`status.${decision.status}`)],
  ];
  for (const [className, label] of values) {
    const badge = element('span', { class: `badge ${className}`.trim() }); badge.textContent = label; badges.append(badge);
  }
  const fields = element('div', { class: 'field-preview' });
  if (change.fields.length === 0) {
    const row = element('p', { class: 'flag-list' }); row.textContent = t('worklist.noFields'); fields.append(row);
  } else {
    for (const field of change.fields.slice(0, 4)) {
      const row = element('div', { class: 'field-row' });
      const path = element('code'); path.textContent = field.path;
      const value = element('span', { class: 'field-values' }); value.textContent = `${formatValue(field.before)} → ${formatValue(field.after)}`;
      row.append(path, value); fields.append(row);
    }
    if (change.fields.length > 4) {
      const more = element('p', { class: 'flag-list' }); more.textContent = t('worklist.fields', { count: change.fields.length }); fields.append(more);
    }
  }
  if (change.flags.length) {
    const flags = element('p', { class: 'flag-list' }); flags.textContent = change.flags.join(' · '); main.append(title, key, badges, fields, flags);
  } else main.append(title, key, badges, fields);
  const actions = element('div', { class: 'change-actions' });
  const review = element('button', { type: 'button', class: 'secondary-button' }); review.textContent = t('worklist.review');
  review.addEventListener('click', () => openDecision(change.key));
  actions.append(review);
  if (decision.notes) {
    const note = element('span', { class: 'decision-note' }); note.textContent = decision.notes.slice(0, 140); actions.append(note);
  }
  card.append(checkbox, main, actions);
  return card;
}

function formatValue(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  if (text === undefined) return '∅';
  return text.length > 150 ? `${text.slice(0, 147)}…` : text;
}

function currentDecision(key) {
  return state.ledger?.decisions.find((decision) => decision.key === key) ?? { key, status: 'pending', notes: '' };
}
function openDecision(key) {
  const change = state.changes.find((candidate) => candidate.key === key);
  if (!change) return;
  state.activeKey = key;
  const decision = currentDecision(key);
  ui.decisionTitle.textContent = change.title;
  ui.decisionKey.textContent = key;
  ui.decisionStatus.value = decision.status;
  ui.decisionNotes.value = decision.notes;
  ui.decisionDialog.showModal();
}

async function saveActiveDecision() {
  if (!state.activeKey || !state.baseline) return;
  const keys = new Set(state.changes.map(({ key }) => key));
  state.ledger = upsertDecision(state.ledger, {
    key: state.activeKey, status: ui.decisionStatus.value, notes: ui.decisionNotes.value,
  }, keys, state.baseline.fingerprint, state.current.fingerprint);
  await persistState();
  ui.decisionDialog.close();
  render();
  toast(t('toast.saved'));
}
async function resetActiveDecision() {
  if (!state.activeKey || !state.baseline) return;
  const keys = new Set(state.changes.map(({ key }) => key));
  state.ledger = removeDecision(state.ledger, state.activeKey, keys, state.baseline.fingerprint, state.current.fingerprint);
  await persistState();
  ui.decisionDialog.close();
  render();
}

async function importBaselineFile(file) {
  validateChangeReviewFile(file);
  const imported = await importChangeReviewFile(await file.text(), state.current);
  if (imported.kind === 'bundle') applyBaseline(imported.baseline, imported.ledger, false);
  else applyBaseline(imported.baseline, null, false);
  await persistState();
  render();
  toast(t('toast.imported'));
}

async function downloadCurrentSnapshot() {
  downloadText('physmath-canonical-graph-snapshot.json', await exportGraphSnapshot(state.current), 'application/json');
  toast(t('toast.snapshot'));
}

async function useCurrentBaseline() {
  applyBaseline(state.current, null, false);
  await persistState();
  render();
  toast(t('toast.saved'));
}

async function clearLocalBaseline() {
  state.baseline = null; state.changes = []; state.ledger = null; state.selected.clear();
  try { localStorage.removeItem(CHANGE_REVIEW_STORAGE_KEY); } catch { /* Optional storage. */ }
  render();
  toast(t('toast.cleared'));
}

function selectVisible(value = true) {
  for (const { change } of state.visibleItems) {
    if (value) state.selected.add(change.key); else state.selected.delete(change.key);
  }
  render();
}

async function markSelectedNeedsWork() {
  if (!state.baseline) return;
  const keys = new Set(state.changes.map(({ key }) => key));
  const timestamp = new Date().toISOString();
  for (const key of state.selected) {
    const current = currentDecision(key);
    state.ledger = upsertDecision(state.ledger, { key, status: 'needs-work', notes: current.notes }, keys,
      state.baseline.fingerprint, state.current.fingerprint, timestamp);
  }
  await persistState();
  render();
  toast(t('toast.needsWork'));
}

function reviewBundle() {
  return buildChangeReviewBundle(state.baseline, state.current, state.changes, state.ledger, [...state.selected]);
}
function exportPacketJson() {
  const bundle = reviewBundle();
  downloadText('physmath-canonical-change-review.json', `${JSON.stringify(bundle, null, 2)}\n`, 'application/json');
  toast(t('toast.packet'));
}
function exportPacketMarkdown() {
  downloadText('physmath-canonical-change-review.md', changeReviewBundleMarkdown(reviewBundle()), 'text/markdown');
  toast(t('toast.packet'));
}

function downloadText(filename, text, type) {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = element('a', { href: url, download: filename });
  document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function clearFilters() {
  ui.search.value = ''; ui.riskFilter.value = 'all'; ui.entityFilter.value = 'all';
  ui.changeFilter.value = 'all'; ui.statusFilter.value = 'all'; ui.sort.value = 'risk'; render();
}
function cycleTheme() {
  const choices = ['system', 'light', 'dark'];
  state.theme = choices[(choices.indexOf(state.theme) + 1) % choices.length];
  document.documentElement.dataset.theme = state.theme;
  saveSetting('theme', state.theme);
}
function toast(message) {
  const item = element('div', { class: 'toast' }); item.textContent = message; ui.toasts.append(item);
  setTimeout(() => item.remove(), 2800);
}

function bindEvents() {
  ui.language.addEventListener('change', () => {
    state.language = ui.language.value === 'es' ? 'es' : 'en'; saveSetting('language', state.language);
    translateDocument(); buildOptions(); render();
  });
  ui.theme.addEventListener('click', cycleTheme);
  ui.help.addEventListener('click', () => ui.helpDialog.showModal());
  ui.downloadCurrent.addEventListener('click', downloadCurrentSnapshot);
  ui.useCurrent.addEventListener('click', useCurrentBaseline);
  ui.importBaseline.addEventListener('click', () => ui.baselineFile.click());
  ui.baselineFile.addEventListener('change', async () => {
    const [file] = ui.baselineFile.files;
    if (!file) return;
    try { await importBaselineFile(file); } catch (error) { console.error(error); toast(t('toast.failed')); }
    finally { ui.baselineFile.value = ''; }
  });
  ui.clearBaseline.addEventListener('click', () => ui.clearDialog.showModal());
  ui.clearDialog.addEventListener('close', () => { if (ui.clearDialog.returnValue === 'confirm') clearLocalBaseline(); });
  for (const control of [ui.search, ui.riskFilter, ui.entityFilter, ui.changeFilter, ui.statusFilter, ui.sort]) {
    control.addEventListener(control === ui.search ? 'input' : 'change', render);
  }
  ui.clearFilters.addEventListener('click', clearFilters);
  ui.selectVisible.addEventListener('click', () => { selectVisible(true); toast(t('toast.selected')); });
  ui.clearSelection.addEventListener('click', () => { state.selected.clear(); render(); });
  ui.toggleVisible.addEventListener('change', () => selectVisible(ui.toggleVisible.checked));
  ui.markNeedsWork.addEventListener('click', markSelectedNeedsWork);
  ui.exportJson.addEventListener('click', exportPacketJson);
  ui.exportMarkdown.addEventListener('click', exportPacketMarkdown);
  ui.saveDecision.addEventListener('click', saveActiveDecision);
  ui.resetDecision.addEventListener('click', resetActiveDecision);
  document.addEventListener('keydown', (event) => {
    const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement;
    if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) { event.preventDefault(); ui.search.focus(); }
    if (event.key === 'Escape' && ui.decisionDialog.open) ui.decisionDialog.close();
  });
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  try { await navigator.serviceWorker.register('./sw.js', { scope: './' }); }
  catch (error) { console.warn('Service worker registration failed:', error); }
}

init();
