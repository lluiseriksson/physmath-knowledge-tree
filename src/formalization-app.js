import {
  LEAN_AUDIT_STATUSES,
  LEAN_ITEM_TYPES,
  buildLeanAuditPacket,
  buildLeanAuditWorklist,
  buildLeanProbe,
  createLeanAuditLedger,
  exportLeanAuditLedger,
  exportLeanAuditPacketMarkdown,
  filterLeanAuditWorklist,
  importLeanAuditLedger,
  loadLeanAuditLedger,
  mergeLeanAuditLedgers,
  normalizeLeanCatalog,
  removeLeanAuditRecord,
  saveLeanAuditLedger,
  summarizeLeanAudit,
  upsertLeanAuditRecord,
  validateLeanAuditFile,
} from './lib/lean-target-audit.js';

const STORAGE_PREFIX = 'physmath.formalization.';
const dictionaries = {
  en: {
    'nav.skip': 'Skip to Lean target audit', 'nav.primary': 'Primary navigation', 'nav.research': 'Research graph',
    'nav.learning': 'Learning map', 'nav.workbench': 'Workbench', 'nav.evidence': 'Evidence review',
    'nav.changes': 'Change review', 'nav.formalization': 'Lean audit', 'nav.repository': 'Repository',
    'app.tagline': 'Turn candidate Lean metadata into reproducible probes', 'header.language': 'Interface language',
    'header.theme': 'Change theme', 'header.help': 'Lean audit help', 'loading': 'Loading canonical Lean targets…',
    'controls.eyebrow': 'Local verification state', 'controls.title': 'Lean target queue', 'summary.title': 'Audit summary',
    'summary.total': 'Items', 'summary.reviewed': 'Reviewed', 'summary.verified': 'Verified', 'summary.open': 'Open',
    'summary.declarations': 'Declarations', 'summary.imports': 'Imports', 'filters.title': 'Filter audit queue',
    'filters.clear': 'Clear', 'filters.search': 'Search Lean metadata',
    'filters.placeholder': 'Node, import, declaration, target or note', 'filters.status': 'Audit status',
    'filters.type': 'Item type', 'filters.kind': 'Node kind', 'filters.confidence': 'Graph evidence',
    'filters.sort': 'Sort queue', 'selection.title': 'Probe selection', 'selection.count': 'selected items',
    'selection.toolchain': 'Toolchain note', 'selection.toolchainPlaceholder': 'leanprover/lean4:v4.31.0',
    'selection.selectVisible': 'Select visible', 'selection.clear': 'Clear selection',
    'selection.preview': 'Preview Lean probe', 'selection.exportJson': 'Export packet JSON',
    'selection.exportMarkdown': 'Export packet Markdown', 'portable.title': 'Portable local audit',
    'portable.body': 'Audit records stay in this browser unless exported.', 'portable.mode': 'Import mode',
    'portable.merge': 'Merge newest records', 'portable.replace': 'Replace local ledger',
    'portable.export': 'Export ledger JSON', 'portable.import': 'Import ledger JSON',
    'portable.reset': 'Clear local audit', 'portable.file': 'Lean audit import file',
    'hero.eyebrow': 'Formalization governance', 'hero.title': 'Check that candidate imports and declarations still exist',
    'hero.body': 'The queue prioritizes unresolved names and can generate a bounded Lean file with imports and #check commands. Passing that file verifies names only, not the surrounding theorem or research claim.',
    'hero.local': 'Local-only audit records', 'queue.title': 'Canonical Lean metadata', 'queue.toggle': 'Toggle visible',
    'queue.emptyTitle': 'No Lean items match', 'queue.emptyBody': 'Clear filters or choose another audit state.',
    'audit.eyebrow': 'Local record', 'audit.close': 'Close Lean audit editor', 'audit.status': 'Status',
    'audit.checked': 'Checked date', 'audit.toolchain': 'Toolchain or mathlib revision',
    'audit.replacement': 'Replacement import or declaration', 'audit.notes': 'Audit notes',
    'audit.notesPlaceholder': 'What command was run, what failed, and what should replace this candidate?',
    'audit.warning': 'Saving this record does not change graph metadata or certify the associated mathematical claim.',
    'audit.remove': 'Remove local record', 'audit.cancel': 'Cancel', 'audit.save': 'Save audit',
    'probe.eyebrow': 'Reproducible output', 'probe.title': 'Generated Lean probe', 'probe.close': 'Close Lean probe',
    'probe.output': 'Generated Lean probe source', 'probe.copy': 'Copy', 'probe.download': 'Download .lean',
    'help.title': 'How Lean target audit behaves', 'help.readonly': 'Canonical graph data remains read-only.',
    'help.probe': 'Generated probes check imports and names with #check; they do not prove graph claims.',
    'help.status': 'Verified means a human recorded a successful check against the stated toolchain.',
    'help.cli': 'The same probe can be generated with npm run lean:probe.', 'help.close': 'Close',
    'reset.title': 'Clear all local Lean audit records?',
    'reset.body': 'Canonical Lean metadata is unaffected. Export the ledger first when needed.',
    'reset.cancel': 'Cancel', 'reset.confirm': 'Clear audit', 'status.all': 'All statuses',
    'status.unreviewed': 'Unreviewed', 'status.verified': 'Verified', 'status.missing': 'Missing',
    'status.renamed': 'Renamed', 'status.blocked': 'Blocked', 'type.all': 'All item types',
    'type.import': 'Import', 'type.declaration': 'Declaration', 'type.target': 'Formalization target',
    'kind.all': 'All node kinds', 'confidence.all': 'All evidence levels', 'sort.priority': 'Highest audit priority',
    'sort.node': 'Node title', 'sort.status': 'Audit status', 'sort.value': 'Candidate value',
    'queue.visible': '{visible} of {total} items visible', 'item.edit': 'Review', 'item.reused': 'used by {count} nodes',
    'item.unsafe': 'probe-unsafe syntax', 'item.checked': 'Checked {date}', 'item.unchecked': 'No recorded check',
    'save.saved': 'Saved locally', 'toast.saved': 'Lean audit saved.', 'toast.removed': 'Local audit record removed.',
    'toast.exported': 'Export created.', 'toast.imported': 'Lean audit imported.', 'toast.reset': 'Local Lean audit cleared.',
    'toast.copied': 'Lean probe copied.', 'toast.failed': 'The operation could not be completed.',
  },
  es: {
    'nav.skip': 'Saltar a la auditoría Lean', 'nav.primary': 'Navegación principal', 'nav.research': 'Grafo de investigación',
    'nav.learning': 'Mapa de aprendizaje', 'nav.workbench': 'Banco de investigación', 'nav.evidence': 'Revisión de evidencia',
    'nav.changes': 'Revisión de cambios', 'nav.formalization': 'Auditoría Lean', 'nav.repository': 'Repositorio',
    'app.tagline': 'Convierte metadatos Lean candidatos en pruebas reproducibles', 'header.language': 'Idioma de la interfaz',
    'header.theme': 'Cambiar tema', 'header.help': 'Ayuda de auditoría Lean', 'loading': 'Cargando objetivos Lean canónicos…',
    'controls.eyebrow': 'Estado local de verificación', 'controls.title': 'Cola de objetivos Lean', 'summary.title': 'Resumen de auditoría',
    'summary.total': 'Elementos', 'summary.reviewed': 'Revisados', 'summary.verified': 'Verificados', 'summary.open': 'Abiertos',
    'summary.declarations': 'Declaraciones', 'summary.imports': 'Imports', 'filters.title': 'Filtrar cola de auditoría',
    'filters.clear': 'Limpiar', 'filters.search': 'Buscar metadatos Lean',
    'filters.placeholder': 'Nodo, import, declaración, objetivo o nota', 'filters.status': 'Estado de auditoría',
    'filters.type': 'Tipo de elemento', 'filters.kind': 'Tipo de nodo', 'filters.confidence': 'Evidencia del grafo',
    'filters.sort': 'Ordenar cola', 'selection.title': 'Selección del probe', 'selection.count': 'elementos seleccionados',
    'selection.toolchain': 'Nota de toolchain', 'selection.toolchainPlaceholder': 'leanprover/lean4:v4.31.0',
    'selection.selectVisible': 'Seleccionar visibles', 'selection.clear': 'Limpiar selección',
    'selection.preview': 'Previsualizar probe Lean', 'selection.exportJson': 'Exportar paquete JSON',
    'selection.exportMarkdown': 'Exportar paquete Markdown', 'portable.title': 'Auditoría local portable',
    'portable.body': 'Los registros permanecen en este navegador salvo exportación.', 'portable.mode': 'Modo de importación',
    'portable.merge': 'Fusionar registros más recientes', 'portable.replace': 'Reemplazar libro local',
    'portable.export': 'Exportar libro JSON', 'portable.import': 'Importar libro JSON',
    'portable.reset': 'Borrar auditoría local', 'portable.file': 'Archivo de importación de auditoría Lean',
    'hero.eyebrow': 'Gobernanza de formalización', 'hero.title': 'Comprueba que imports y declaraciones candidatas siguen existiendo',
    'hero.body': 'La cola prioriza nombres no resueltos y genera un archivo Lean acotado con imports y comandos #check. Que compile verifica nombres, no el teorema ni la afirmación de investigación asociada.',
    'hero.local': 'Registros locales', 'queue.title': 'Metadatos Lean canónicos', 'queue.toggle': 'Alternar visibles',
    'queue.emptyTitle': 'Ningún elemento Lean coincide', 'queue.emptyBody': 'Limpia los filtros o elige otro estado.',
    'audit.eyebrow': 'Registro local', 'audit.close': 'Cerrar editor de auditoría Lean', 'audit.status': 'Estado',
    'audit.checked': 'Fecha de comprobación', 'audit.toolchain': 'Toolchain o revisión de mathlib',
    'audit.replacement': 'Import o declaración sustituta', 'audit.notes': 'Notas de auditoría',
    'audit.notesPlaceholder': '¿Qué comando se ejecutó, qué falló y qué debe sustituir al candidato?',
    'audit.warning': 'Guardar este registro no cambia el grafo ni certifica la afirmación matemática asociada.',
    'audit.remove': 'Eliminar registro local', 'audit.cancel': 'Cancelar', 'audit.save': 'Guardar auditoría',
    'probe.eyebrow': 'Salida reproducible', 'probe.title': 'Probe Lean generado', 'probe.close': 'Cerrar probe Lean',
    'probe.output': 'Código fuente del probe Lean', 'probe.copy': 'Copiar', 'probe.download': 'Descargar .lean',
    'help.title': 'Cómo funciona la auditoría Lean', 'help.readonly': 'Los datos canónicos permanecen en modo lectura.',
    'help.probe': 'Los probes comprueban imports y nombres con #check; no demuestran afirmaciones del grafo.',
    'help.status': 'Verificado significa que una persona registró una comprobación correcta con el toolchain indicado.',
    'help.cli': 'El mismo probe se genera con npm run lean:probe.', 'help.close': 'Cerrar',
    'reset.title': '¿Borrar todos los registros locales de auditoría Lean?',
    'reset.body': 'Los metadatos canónicos no cambian. Exporta el libro antes cuando sea necesario.',
    'reset.cancel': 'Cancelar', 'reset.confirm': 'Borrar auditoría', 'status.all': 'Todos los estados',
    'status.unreviewed': 'Sin revisar', 'status.verified': 'Verificado', 'status.missing': 'Ausente',
    'status.renamed': 'Renombrado', 'status.blocked': 'Bloqueado', 'type.all': 'Todos los tipos',
    'type.import': 'Import', 'type.declaration': 'Declaración', 'type.target': 'Objetivo de formalización',
    'kind.all': 'Todos los tipos de nodo', 'confidence.all': 'Todos los niveles de evidencia',
    'sort.priority': 'Mayor prioridad de auditoría', 'sort.node': 'Título del nodo',
    'sort.status': 'Estado de auditoría', 'sort.value': 'Valor candidato',
    'queue.visible': '{visible} de {total} elementos visibles', 'item.edit': 'Revisar',
    'item.reused': 'usado por {count} nodos', 'item.unsafe': 'sintaxis no segura para probe',
    'item.checked': 'Comprobado {date}', 'item.unchecked': 'Sin comprobación registrada',
    'save.saved': 'Guardado localmente', 'toast.saved': 'Auditoría Lean guardada.',
    'toast.removed': 'Registro local eliminado.', 'toast.exported': 'Exportación creada.',
    'toast.imported': 'Auditoría Lean importada.', 'toast.reset': 'Auditoría Lean local borrada.',
    'toast.copied': 'Probe Lean copiado.', 'toast.failed': 'No se pudo completar la operación.',
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
  loading: byId('loading'), center: byId('lean-audit-center'), language: byId('language'), theme: byId('theme'), help: byId('help'),
  helpDialog: byId('help-dialog'), saveState: byId('save-state'), search: byId('search'), statusFilter: byId('status-filter'),
  typeFilter: byId('type-filter'), kindFilter: byId('kind-filter'), confidenceFilter: byId('confidence-filter'), sort: byId('sort'),
  clearFilters: byId('clear-filters'), total: byId('stat-total'), reviewed: byId('stat-reviewed'), verified: byId('stat-verified'),
  open: byId('stat-open'), declarations: byId('stat-declarations'), imports: byId('stat-imports'), selectedCount: byId('selected-count'),
  toolchain: byId('probe-toolchain'), selectVisible: byId('select-visible'), clearSelection: byId('clear-selection'),
  previewProbe: byId('preview-probe'), exportPacketJson: byId('export-packet-json'), exportPacketMarkdown: byId('export-packet-markdown'),
  importMode: byId('import-mode'), exportLedger: byId('export-ledger'), importLedger: byId('import-ledger'), resetLedger: byId('reset-ledger'),
  ledgerFile: byId('ledger-file'), visibleSummary: byId('visible-summary'), toggleVisible: byId('toggle-visible'), itemList: byId('item-list'),
  empty: byId('empty'), auditDialog: byId('audit-dialog'), auditTitle: byId('audit-title'), auditContext: byId('audit-context'),
  auditStatus: byId('audit-status'), auditChecked: byId('audit-checked'), auditToolchain: byId('audit-toolchain'),
  auditReplacement: byId('audit-replacement'), auditNotes: byId('audit-notes'), removeAudit: byId('remove-audit'), saveAudit: byId('save-audit'),
  probeDialog: byId('probe-dialog'), probeOutput: byId('probe-output'), copyProbe: byId('copy-probe'), downloadProbe: byId('download-probe'),
  resetDialog: byId('reset-dialog'), toasts: byId('toasts'),
};

const state = {
  language: readSetting('language', navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'),
  theme: readSetting('theme', 'system'), catalog: null, validItemIds: new Set(), ledger: null,
  worklist: [], visible: [], selected: new Set(), activeItemId: '', probe: '',
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
  document.title = state.language === 'es' ? 'PhysMath Knowledge Tree — Auditoría de objetivos Lean' : 'PhysMath Knowledge Tree — Lean target audit';
  for (const node of document.querySelectorAll('[data-i18n]')) node.textContent = tr(node.dataset.i18n);
  for (const node of document.querySelectorAll('[data-i18n-placeholder]')) node.setAttribute('placeholder', tr(node.dataset.i18nPlaceholder));
  for (const node of document.querySelectorAll('[data-i18n-aria]')) node.setAttribute('aria-label', tr(node.dataset.i18nAria));
  ui.language.value = state.language;
}
async function loadJson(path) {
  const response = await fetch(path, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}
function addOption(select, value, label) {
  const option = element('option', { value });
  option.textContent = label;
  select.append(option);
}
function buildOptions() {
  ui.statusFilter.replaceChildren();
  addOption(ui.statusFilter, 'all', tr('status.all'));
  for (const status of LEAN_AUDIT_STATUSES) addOption(ui.statusFilter, status, tr(`status.${status}`));
  ui.auditStatus.replaceChildren();
  for (const status of LEAN_AUDIT_STATUSES) addOption(ui.auditStatus, status, tr(`status.${status}`));
  ui.typeFilter.replaceChildren();
  addOption(ui.typeFilter, 'all', tr('type.all'));
  for (const type of LEAN_ITEM_TYPES) addOption(ui.typeFilter, type, tr(`type.${type}`));
  ui.kindFilter.replaceChildren();
  addOption(ui.kindFilter, 'all', tr('kind.all'));
  for (const kind of [...new Set(state.catalog.nodes.map(({ kind: value }) => value))].sort()) addOption(ui.kindFilter, kind, kind);
  ui.confidenceFilter.replaceChildren();
  addOption(ui.confidenceFilter, 'all', tr('confidence.all'));
  for (const confidence of [...new Set(state.catalog.nodes.map(({ confidence: value }) => value))].sort()) addOption(ui.confidenceFilter, confidence, confidence);
  ui.sort.replaceChildren();
  for (const sort of ['priority', 'node', 'status', 'value']) addOption(ui.sort, sort, tr(`sort.${sort}`));
}
function recordById(itemId) { return state.ledger.records.find((record) => record.item_id === itemId) ?? null; }
function persist(ledger, message = true) {
  state.ledger = saveLeanAuditLedger(localStorage, ledger, state.validItemIds);
  if (message) {
    ui.saveState.textContent = tr('save.saved');
    setTimeout(() => { ui.saveState.textContent = ''; }, 1600);
  }
}
function filters() {
  return {
    search: ui.search.value, status: ui.statusFilter.value, itemType: ui.typeFilter.value,
    nodeKind: ui.kindFilter.value, confidence: ui.confidenceFilter.value, sort: ui.sort.value,
  };
}
function renderAll() {
  state.worklist = buildLeanAuditWorklist(state.catalog, state.ledger);
  state.visible = filterLeanAuditWorklist(state.worklist, filters());
  renderSummary(); renderSelection(); renderList();
}
function renderSummary() {
  const summary = summarizeLeanAudit(state.worklist);
  ui.total.textContent = String(summary.total); ui.reviewed.textContent = String(summary.reviewed);
  ui.verified.textContent = String(summary.by_status.verified); ui.open.textContent = String(summary.open);
  ui.declarations.textContent = String(summary.by_type.declaration); ui.imports.textContent = String(summary.by_type.import);
  ui.visibleSummary.textContent = tr('queue.visible', { visible: state.visible.length, total: state.worklist.length });
}
function renderSelection() {
  for (const itemId of [...state.selected]) if (!state.validItemIds.has(itemId)) state.selected.delete(itemId);
  const count = state.selected.size;
  ui.selectedCount.textContent = String(count);
  ui.previewProbe.disabled = count === 0; ui.exportPacketJson.disabled = count === 0; ui.exportPacketMarkdown.disabled = count === 0;
  const visibleIds = state.visible.map(({ id }) => id);
  const selectedVisible = visibleIds.filter((id) => state.selected.has(id)).length;
  ui.toggleVisible.checked = visibleIds.length > 0 && selectedVisible === visibleIds.length;
  ui.toggleVisible.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
}
function badge(text, className = '') {
  const node = element('span', { class: `badge ${className}`.trim() }); node.textContent = text; return node;
}
function renderList() {
  const fragment = document.createDocumentFragment();
  for (const item of state.visible) {
    const card = element('article', { class: `audit-card${state.selected.has(item.id) ? ' selected' : ''}` });
    const checkbox = element('input', { type: 'checkbox', 'aria-label': `${item.node_title}: ${item.value}` });
    checkbox.checked = state.selected.has(item.id);
    checkbox.addEventListener('change', () => { checkbox.checked ? state.selected.add(item.id) : state.selected.delete(item.id); renderAll(); });
    const main = element('div', { class: 'audit-main' });
    const title = element('h3'); title.textContent = item.node_title;
    const value = element('pre', { class: 'audit-value' }); value.textContent = item.value;
    const badges = element('div', { class: 'badges' });
    badges.append(badge(tr(`status.${item.status}`), `status-${item.status}`), badge(tr(`type.${item.item_type}`)), badge(item.node_kind), badge(item.node_confidence));
    if (item.reuse_count > 1) badges.append(badge(tr('item.reused', { count: item.reuse_count })));
    if (item.item_type !== 'target' && !item.probe_safe) badges.append(badge(tr('item.unsafe'), 'unsafe'));
    main.append(title, value, badges);
    if (item.notes) { const note = element('p', { class: 'audit-note' }); note.textContent = item.notes; main.append(note); }
    const actions = element('div', { class: 'audit-actions' });
    const edit = element('button', { type: 'button', class: 'secondary-button' }); edit.textContent = tr('item.edit');
    edit.addEventListener('click', () => openEditor(item.id));
    const meta = element('span', { class: 'audit-meta' });
    meta.textContent = item.checked_at ? tr('item.checked', { date: item.checked_at.slice(0, 10) }) : tr('item.unchecked');
    actions.append(edit, meta); card.append(checkbox, main, actions); fragment.append(card);
  }
  ui.itemList.replaceChildren(fragment); ui.empty.hidden = state.visible.length !== 0;
}
function openEditor(itemId) {
  const item = state.worklist.find(({ id }) => id === itemId); if (!item) return;
  state.activeItemId = itemId; const record = recordById(itemId);
  ui.auditTitle.textContent = item.value; ui.auditContext.textContent = `${item.node_title} · ${item.node_id} · ${tr(`type.${item.item_type}`)}`;
  ui.auditStatus.value = record?.status ?? 'unreviewed'; ui.auditChecked.value = record?.checked_at?.slice(0, 10) ?? '';
  ui.auditToolchain.value = record?.toolchain ?? ''; ui.auditReplacement.value = record?.replacement ?? ''; ui.auditNotes.value = record?.notes ?? '';
  ui.removeAudit.hidden = !record; ui.auditDialog.showModal();
}
function saveEditor() {
  if (!state.activeItemId) return;
  const checked = ui.auditChecked.value ? `${ui.auditChecked.value}T00:00:00.000Z` : null;
  const ledger = upsertLeanAuditRecord(state.ledger, {
    item_id: state.activeItemId, status: ui.auditStatus.value, checked_at: checked,
    toolchain: ui.auditToolchain.value, replacement: ui.auditReplacement.value, notes: ui.auditNotes.value,
  }, state.validItemIds);
  persist(ledger); ui.auditDialog.close(); renderAll(); toast(tr('toast.saved'));
}
function removeEditor() {
  if (!state.activeItemId) return;
  persist(removeLeanAuditRecord(state.ledger, state.activeItemId, state.validItemIds));
  ui.auditDialog.close(); renderAll(); toast(tr('toast.removed'));
}
function selectedIds() { return [...state.selected].sort(); }
function currentToolchain() { return ui.toolchain.value.trim(); }
function previewProbe() {
  state.probe = buildLeanProbe(state.catalog, selectedIds(), state.ledger, { toolchain: currentToolchain(), generatedAt: new Date().toISOString() });
  ui.probeOutput.value = state.probe; ui.probeDialog.showModal();
}
function exportPacket(format) {
  const packet = buildLeanAuditPacket(state.catalog, selectedIds(), state.ledger, { toolchain: currentToolchain(), generatedAt: new Date().toISOString() });
  if (format === 'markdown') downloadText('physmath-lean-target-audit.md', exportLeanAuditPacketMarkdown(packet), 'text/markdown');
  else downloadText('physmath-lean-target-audit.json', `${JSON.stringify(packet, null, 2)}\n`, 'application/json');
  toast(tr('toast.exported'));
}
function exportLedger() { downloadText('physmath-lean-audit-ledger.json', `${exportLeanAuditLedger(state.ledger, state.validItemIds)}\n`, 'application/json'); toast(tr('toast.exported')); }
async function importLedgerFile(file) {
  validateLeanAuditFile(file); const incoming = importLeanAuditLedger(await file.text(), state.validItemIds);
  const next = ui.importMode.value === 'replace' ? incoming : mergeLeanAuditLedgers(state.ledger, incoming, state.validItemIds);
  persist(next); renderAll(); toast(tr('toast.imported'));
}
function downloadText(filename, text, type) {
  const blob = new Blob([text], { type: `${type};charset=utf-8` }); const url = URL.createObjectURL(blob);
  const anchor = element('a', { href: url, download: filename }); document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function copyProbe() {
  try { await navigator.clipboard.writeText(state.probe); }
  catch { ui.probeOutput.focus(); ui.probeOutput.select(); document.execCommand('copy'); }
  toast(tr('toast.copied'));
}
function toast(message) { const node = element('div', { class: 'toast' }); node.textContent = message; ui.toasts.append(node); setTimeout(() => node.remove(), 2800); }
function clearFilters() { ui.search.value = ''; ui.statusFilter.value = 'all'; ui.typeFilter.value = 'all'; ui.kindFilter.value = 'all'; ui.confidenceFilter.value = 'all'; ui.sort.value = 'priority'; renderAll(); }
function bindEvents() {
  for (const control of [ui.search, ui.statusFilter, ui.typeFilter, ui.kindFilter, ui.confidenceFilter, ui.sort]) control.addEventListener('input', renderAll);
  ui.clearFilters.addEventListener('click', clearFilters);
  ui.selectVisible.addEventListener('click', () => { for (const item of state.visible) state.selected.add(item.id); renderAll(); });
  ui.clearSelection.addEventListener('click', () => { state.selected.clear(); renderAll(); });
  ui.toggleVisible.addEventListener('change', () => { for (const item of state.visible) ui.toggleVisible.checked ? state.selected.add(item.id) : state.selected.delete(item.id); renderAll(); });
  ui.previewProbe.addEventListener('click', previewProbe); ui.exportPacketJson.addEventListener('click', () => exportPacket('json'));
  ui.exportPacketMarkdown.addEventListener('click', () => exportPacket('markdown')); ui.saveAudit.addEventListener('click', saveEditor);
  ui.removeAudit.addEventListener('click', removeEditor); ui.copyProbe.addEventListener('click', copyProbe);
  ui.downloadProbe.addEventListener('click', () => downloadText('PhysMathLeanTargetAudit.lean', state.probe, 'text/plain'));
  ui.exportLedger.addEventListener('click', exportLedger); ui.importLedger.addEventListener('click', () => ui.ledgerFile.click());
  ui.ledgerFile.addEventListener('change', async () => { const file = ui.ledgerFile.files?.[0]; ui.ledgerFile.value = ''; if (!file) return; try { await importLedgerFile(file); } catch (error) { console.error(error); toast(tr('toast.failed')); } });
  ui.resetLedger.addEventListener('click', () => ui.resetDialog.showModal());
  ui.resetDialog.addEventListener('close', () => { if (ui.resetDialog.returnValue !== 'confirm') return; persist(createLeanAuditLedger()); state.selected.clear(); renderAll(); toast(tr('toast.reset')); });
  ui.help.addEventListener('click', () => ui.helpDialog.showModal());
  ui.language.addEventListener('change', () => { state.language = ui.language.value === 'es' ? 'es' : 'en'; saveSetting('language', state.language); translateDocument(); buildOptions(); renderAll(); });
  ui.theme.addEventListener('click', () => { const values = ['system', 'light', 'dark']; state.theme = values[(values.indexOf(state.theme) + 1) % values.length]; document.documentElement.dataset.theme = state.theme; saveSetting('theme', state.theme); });
}
function showLoadError(error) {
  const wrapper = element('div'); const title = element('strong'); title.textContent = state.language === 'es' ? 'No se pudo cargar la auditoría Lean.' : 'Lean audit could not load.';
  const code = element('code'); code.textContent = error instanceof Error ? error.message : String(error); wrapper.append(title, code);
  ui.loading.replaceChildren(wrapper); ui.loading.classList.add('load-error');
}
async function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  try { await navigator.serviceWorker.register('./sw.js', { scope: './' }); } catch (error) { console.warn('Service worker registration failed:', error); }
}
async function init() {
  document.documentElement.dataset.theme = state.theme; translateDocument();
  try {
    state.catalog = normalizeLeanCatalog(await loadJson('./graph/nodes/core.json'));
    state.validItemIds = new Set(state.catalog.items.map(({ id }) => id)); state.ledger = loadLeanAuditLedger(localStorage, state.validItemIds);
    buildOptions(); bindEvents(); renderAll(); ui.loading.hidden = true; ui.center.hidden = false; registerServiceWorker();
  } catch (error) { console.error(error); showLoadError(error); }
}

init();
