import {
  buildRunPacket,
  createEmptyRunLedger,
  filterRuns,
  mergeRunLedgers,
  normalizeRun,
  normalizeRunLedger,
  parseRunImport,
  removeRun,
  RUN_KINDS,
  RUN_STATUSES,
  summarizeRunLedger,
  validateRunFile,
  verifyRunFingerprint,
  withRunFingerprint,
} from './lib/run-ledger.js';

const STORAGE_KEY = 'physmath.research.runs.v1';
const SETTING_PREFIX = 'physmath.runs.';
const byId = (id) => document.getElementById(id);
const ui = Object.fromEntries([
  'loading', 'run-center', 'language', 'theme', 'help', 'help-dialog', 'save-state',
  'stat-total', 'stat-passed', 'stat-failed', 'stat-inconclusive', 'stat-fingerprinted', 'stat-reproducible',
  'search', 'status-filter', 'kind-filter', 'node-filter', 'sort', 'clear-filters',
  'selected-count', 'select-visible', 'clear-selection', 'mark-inconclusive', 'export-packet',
  'import-mode', 'export-ledger', 'import-ledger', 'reset-ledger', 'ledger-file', 'reset-dialog',
  'new-run', 'visible-summary', 'toggle-visible', 'run-list', 'empty',
  'run-dialog', 'run-form', 'run-title', 'run-id', 'run-name', 'run-kind', 'run-status', 'run-started',
  'run-completed', 'run-exit', 'run-cwd', 'run-nodes', 'run-command', 'run-artifacts', 'run-notes',
  'remove-run', 'save-run', 'fingerprint-run', 'detail-dialog', 'detail-title', 'detail-content',
  'verify-run', 'edit-run', 'toasts',
].map((id) => [id.replaceAll('-', '_'), byId(id)]));

const MESSAGES = {
  en: {
    'nav.skip': 'Skip to reproducible runs', 'nav.primary': 'Primary navigation', 'nav.research': 'Research graph',
    'nav.learning': 'Learning map', 'nav.workbench': 'Workbench', 'nav.evidence': 'Evidence', 'nav.changes': 'Changes',
    'nav.formalization': 'Lean audit', 'nav.dossiers': 'Dossiers', 'nav.runs': 'Runs', 'nav.repository': 'Repository',
    'app.tagline': 'Commands, artifacts and outcomes with traceable hashes', 'header.language': 'Interface language',
    'header.theme': 'Change theme', 'header.help': 'Reproducible run help', 'loading': 'Loading canonical nodes and local runs…',
    'controls.eyebrow': 'Local execution memory', 'controls.title': 'Run ledger', 'summary.title': 'Run summary',
    'summary.total': 'Runs', 'summary.passed': 'Passed', 'summary.failed': 'Failed', 'summary.inconclusive': 'Inconclusive',
    'summary.fingerprinted': 'Fingerprinted', 'summary.reproducible': 'Reproducible', 'filters.title': 'Filter runs',
    'filters.clear': 'Clear', 'filters.search': 'Search runs', 'filters.placeholder': 'Title, command, artifact or node',
    'filters.status': 'Status', 'filters.kind': 'Kind', 'filters.node': 'Canonical node', 'filters.sort': 'Sort',
    'selection.title': 'Portable packet', 'selection.count': 'selected runs', 'selection.selectVisible': 'Select visible',
    'selection.clear': 'Clear selection', 'selection.inconclusive': 'Mark inconclusive', 'selection.export': 'Export run packet',
    'portable.title': 'Portable ledger', 'portable.mode': 'Import mode', 'portable.merge': 'Merge newest runs',
    'portable.replace': 'Replace local ledger', 'portable.export': 'Export ledger JSON',
    'portable.import': 'Import ledger or manifest', 'portable.reset': 'Clear local runs', 'portable.file': 'Run ledger import file',
    'hero.eyebrow': 'Compute campaign discipline', 'hero.title': 'Record what actually ran, not what was intended',
    'hero.body': 'Commands are argument vectors, artifacts are content-addressed, and outcomes remain distinct from mathematical proof.',
    'hero.local': 'Local-first ledger', 'hero.new': 'New run plan', 'queue.title': 'Execution history', 'queue.toggle': 'Toggle visible',
    'queue.emptyTitle': 'No runs match', 'queue.emptyBody': 'Clear filters or create a run plan.', 'editor.eyebrow': 'Local record',
    'editor.title': 'Run plan or outcome', 'editor.close': 'Close run editor', 'editor.id': 'Stable ID', 'editor.name': 'Title',
    'editor.kind': 'Kind', 'editor.status': 'Status', 'editor.started': 'Started', 'editor.completed': 'Completed',
    'editor.exit': 'Exit code', 'editor.cwd': 'Working directory', 'editor.nodes': 'Canonical nodes',
    'editor.command': 'Command arguments — one per line', 'editor.commandPlaceholder': 'lake\nbuild',
    'editor.artifacts': 'Artifacts — role | path | sha256 | bytes | media type',
    'editor.artifactPlaceholder': 'output | artifacts/result.json | <sha256> | 512 | application/json', 'editor.notes': 'Notes',
    'editor.warning': 'A passed computation is evidence about this execution, not an automatic proof or confidence promotion.',
    'editor.remove': 'Remove', 'editor.cancel': 'Cancel', 'editor.save': 'Save', 'editor.fingerprint': 'Fingerprint & save',
    'detail.verify': 'Verify fingerprint', 'detail.edit': 'Edit', 'help.title': 'How reproducible runs behave',
    'help.browser': 'The browser records and verifies manifests; it never executes commands.',
    'help.cli': 'The CLI uses shell:false, bounded timeouts and repository-relative artifacts.',
    'help.secrets': 'Environment variables are opt-in and sensitive names are rejected.',
    'help.claims': 'Run success never promotes graph confidence or proves a scientific claim.', 'help.close': 'Close',
    'reset.title': 'Clear all local runs?', 'reset.body': 'Export the ledger first when these records matter.',
    'reset.cancel': 'Cancel', 'reset.confirm': 'Clear runs', 'option.all': 'All', 'sort.updated': 'Recently updated',
    'sort.started': 'Recently started', 'sort.title': 'Title', 'saved': 'Saved locally', 'notSaved': 'Storage unavailable',
    'visible': '{visible} of {total} runs', 'selected': '{count} selected', 'fingerprinted': 'fingerprinted',
    'artifacts': '{count} artifacts', 'nodes': '{count} nodes', 'noCommand': 'No command recorded',
    'imported': 'Run data imported', 'exported': 'Export prepared', 'verified': 'Fingerprint verified',
    'invalidFingerprint': 'Fingerprint missing or invalid', 'removed': 'Run removed', 'cleared': 'Local runs cleared',
    'marked': 'Selected runs marked inconclusive', 'error': 'Operation failed',
  },
  es: {
    'nav.skip': 'Saltar a ejecuciones reproducibles', 'nav.primary': 'Navegación principal', 'nav.research': 'Grafo de investigación',
    'nav.learning': 'Mapa de aprendizaje', 'nav.workbench': 'Banco', 'nav.evidence': 'Evidencia', 'nav.changes': 'Cambios',
    'nav.formalization': 'Auditoría Lean', 'nav.dossiers': 'Dossiers', 'nav.runs': 'Ejecuciones', 'nav.repository': 'Repositorio',
    'app.tagline': 'Comandos, artefactos y resultados con hashes trazables', 'header.language': 'Idioma de la interfaz',
    'header.theme': 'Cambiar tema', 'header.help': 'Ayuda de ejecuciones reproducibles', 'loading': 'Cargando nodos canónicos y ejecuciones locales…',
    'controls.eyebrow': 'Memoria local de ejecución', 'controls.title': 'Registro de ejecuciones', 'summary.title': 'Resumen',
    'summary.total': 'Ejecuciones', 'summary.passed': 'Correctas', 'summary.failed': 'Fallidas', 'summary.inconclusive': 'Inconclusas',
    'summary.fingerprinted': 'Con huella', 'summary.reproducible': 'Reproducibles', 'filters.title': 'Filtrar ejecuciones',
    'filters.clear': 'Limpiar', 'filters.search': 'Buscar ejecuciones', 'filters.placeholder': 'Título, comando, artefacto o nodo',
    'filters.status': 'Estado', 'filters.kind': 'Tipo', 'filters.node': 'Nodo canónico', 'filters.sort': 'Orden',
    'selection.title': 'Paquete portable', 'selection.count': 'ejecuciones seleccionadas', 'selection.selectVisible': 'Seleccionar visibles',
    'selection.clear': 'Limpiar selección', 'selection.inconclusive': 'Marcar inconclusas', 'selection.export': 'Exportar paquete',
    'portable.title': 'Registro portable', 'portable.mode': 'Modo de importación', 'portable.merge': 'Fusionar las más recientes',
    'portable.replace': 'Reemplazar registro local', 'portable.export': 'Exportar registro JSON',
    'portable.import': 'Importar registro o manifiesto', 'portable.reset': 'Borrar ejecuciones locales', 'portable.file': 'Archivo de importación',
    'hero.eyebrow': 'Disciplina de campañas de cómputo', 'hero.title': 'Registra lo que realmente se ejecutó',
    'hero.body': 'Los comandos son vectores de argumentos, los artefactos se direccionan por contenido y los resultados no equivalen a una prueba matemática.',
    'hero.local': 'Registro local', 'hero.new': 'Nuevo plan', 'queue.title': 'Historial de ejecución', 'queue.toggle': 'Alternar visibles',
    'queue.emptyTitle': 'No hay coincidencias', 'queue.emptyBody': 'Limpia los filtros o crea un plan.', 'editor.eyebrow': 'Registro local',
    'editor.title': 'Plan o resultado', 'editor.close': 'Cerrar editor', 'editor.id': 'ID estable', 'editor.name': 'Título',
    'editor.kind': 'Tipo', 'editor.status': 'Estado', 'editor.started': 'Inicio', 'editor.completed': 'Fin',
    'editor.exit': 'Código de salida', 'editor.cwd': 'Directorio de trabajo', 'editor.nodes': 'Nodos canónicos',
    'editor.command': 'Argumentos del comando — uno por línea', 'editor.commandPlaceholder': 'lake\nbuild',
    'editor.artifacts': 'Artefactos — rol | ruta | sha256 | bytes | tipo MIME',
    'editor.artifactPlaceholder': 'output | artifacts/result.json | <sha256> | 512 | application/json', 'editor.notes': 'Notas',
    'editor.warning': 'Una ejecución correcta informa sobre esa ejecución; no demuestra ni eleva automáticamente una afirmación.',
    'editor.remove': 'Eliminar', 'editor.cancel': 'Cancelar', 'editor.save': 'Guardar', 'editor.fingerprint': 'Crear huella y guardar',
    'detail.verify': 'Verificar huella', 'detail.edit': 'Editar', 'help.title': 'Cómo funciona el registro',
    'help.browser': 'El navegador registra y verifica manifiestos; nunca ejecuta comandos.',
    'help.cli': 'La CLI usa shell:false, tiempos acotados y artefactos relativos a la repo.',
    'help.secrets': 'Las variables de entorno son optativas y los nombres sensibles se rechazan.',
    'help.claims': 'El éxito de una ejecución no eleva la confianza del grafo ni demuestra una afirmación.', 'help.close': 'Cerrar',
    'reset.title': '¿Borrar todas las ejecuciones locales?', 'reset.body': 'Exporta antes el registro cuando importe conservarlo.',
    'reset.cancel': 'Cancelar', 'reset.confirm': 'Borrar', 'option.all': 'Todos', 'sort.updated': 'Actualizadas recientemente',
    'sort.started': 'Iniciadas recientemente', 'sort.title': 'Título', 'saved': 'Guardado localmente', 'notSaved': 'Almacenamiento no disponible',
    'visible': '{visible} de {total} ejecuciones', 'selected': '{count} seleccionadas', 'fingerprinted': 'con huella',
    'artifacts': '{count} artefactos', 'nodes': '{count} nodos', 'noCommand': 'Sin comando registrado',
    'imported': 'Datos importados', 'exported': 'Exportación preparada', 'verified': 'Huella verificada',
    'invalidFingerprint': 'Huella ausente o inválida', 'removed': 'Ejecución eliminada', 'cleared': 'Ejecuciones locales borradas',
    'marked': 'Selección marcada como inconclusa', 'error': 'La operación falló',
  },
};

const state = {
  language: readSetting('language', navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'),
  theme: readSetting('theme', 'system'), nodes: [], nodeById: new Map(), validNodeIds: new Set(),
  ledger: null, visible: [], selected: new Set(), editingId: '', detailId: '',
};

function element(name, attributes = {}) {
  const output = document.createElement(name);
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'class') output.className = String(value);
    else output.setAttribute(key, String(value));
  }
  return output;
}
function readSetting(key, fallback) { try { return localStorage.getItem(`${SETTING_PREFIX}${key}`) ?? fallback; } catch { return fallback; } }
function saveSetting(key, value) { try { localStorage.setItem(`${SETTING_PREFIX}${key}`, value); } catch { /* Optional. */ } }
function t(key, variables = {}) {
  let message = MESSAGES[state.language]?.[key] ?? MESSAGES.en[key] ?? key;
  for (const [name, value] of Object.entries(variables)) message = message.replaceAll(`{${name}}`, String(value));
  return message;
}
function translateDocument() {
  document.documentElement.lang = state.language;
  document.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach((node) => node.setAttribute('aria-label', t(node.dataset.i18nAria)));
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => node.setAttribute('placeholder', t(node.dataset.i18nPlaceholder)));
  document.title = state.language === 'es' ? 'PhysMath Knowledge Tree — Ejecuciones reproducibles' : 'PhysMath Knowledge Tree — Reproducible runs';
  ui.language.value = state.language;
}
function statusLabel(status) { return state.language === 'es' ? ({ planned: 'Planificada', running: 'En curso', passed: 'Correcta', failed: 'Fallida', inconclusive: 'Inconclusa', cancelled: 'Cancelada' }[status] ?? status) : status[0].toUpperCase() + status.slice(1); }
function kindLabel(kind) { return state.language === 'es' ? ({ lean: 'Lean', node: 'Node', python: 'Python', shell: 'Shell', browser: 'Navegador', simulation: 'Simulación', symbolic: 'Simbólico', manual: 'Manual' }[kind] ?? kind) : kind[0].toUpperCase() + kind.slice(1); }
function option(select, value, label) { const item = element('option', { value }); item.textContent = label; select.append(item); }

async function loadJson(path) {
  const response = await fetch(path, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}
function loadLedger() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeRunLedger(JSON.parse(raw), state.validNodeIds) : createEmptyRunLedger();
  } catch {
    return createEmptyRunLedger();
  }
}
function persistLedger() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.ledger)); ui.save_state.textContent = t('saved'); }
  catch { ui.save_state.textContent = t('notSaved'); }
}
function buildOptions() {
  for (const select of [ui.status_filter, ui.kind_filter, ui.node_filter, ui.sort, ui.run_kind, ui.run_status, ui.run_nodes]) select.replaceChildren();
  option(ui.status_filter, 'all', t('option.all')); RUN_STATUSES.forEach((status) => option(ui.status_filter, status, statusLabel(status)));
  option(ui.kind_filter, 'all', t('option.all')); RUN_KINDS.forEach((kind) => option(ui.kind_filter, kind, kindLabel(kind)));
  option(ui.node_filter, 'all', t('option.all'));
  state.nodes.forEach((node) => { option(ui.node_filter, node.id, node.title); option(ui.run_nodes, node.id, node.title); });
  option(ui.sort, 'updated-desc', t('sort.updated')); option(ui.sort, 'started-desc', t('sort.started')); option(ui.sort, 'title', t('sort.title'));
  RUN_KINDS.forEach((kind) => option(ui.run_kind, kind, kindLabel(kind)));
  RUN_STATUSES.forEach((status) => option(ui.run_status, status, statusLabel(status)));
}
function runById(id) { return state.ledger.runs.find((run) => run.id === id); }
function commandText(run) { return run.command.length ? run.command.map((part) => JSON.stringify(part)).join(' ') : t('noCommand'); }
function render() {
  const summary = summarizeRunLedger(state.ledger, state.validNodeIds);
  ui.stat_total.textContent = summary.total; ui.stat_passed.textContent = summary.by_status.passed; ui.stat_failed.textContent = summary.by_status.failed;
  ui.stat_inconclusive.textContent = summary.by_status.inconclusive; ui.stat_fingerprinted.textContent = summary.fingerprinted; ui.stat_reproducible.textContent = summary.reproducible;
  state.visible = filterRuns(state.ledger.runs, { query: ui.search.value, status: ui.status_filter.value, kind: ui.kind_filter.value, nodeId: ui.node_filter.value, sort: ui.sort.value });
  ui.visible_summary.textContent = t('visible', { visible: state.visible.length, total: state.ledger.runs.length });
  ui.selected_count.textContent = state.selected.size;
  ui.mark_inconclusive.disabled = state.selected.size === 0; ui.export_packet.disabled = state.selected.size === 0;
  ui.toggle_visible.checked = state.visible.length > 0 && state.visible.every(({ id }) => state.selected.has(id));
  ui.run_list.replaceChildren();
  for (const run of state.visible) {
    const card = element('article', { class: 'run-card' });
    const checkbox = element('input', { type: 'checkbox', 'aria-label': `${t('selection.count')}: ${run.title}` }); checkbox.checked = state.selected.has(run.id);
    checkbox.addEventListener('change', () => { checkbox.checked ? state.selected.add(run.id) : state.selected.delete(run.id); render(); });
    const content = element('div'); const heading = element('h3'); heading.textContent = run.title;
    const command = element('code'); command.textContent = commandText(run);
    const meta = element('div', { class: 'meta' });
    for (const text of [statusLabel(run.status), kindLabel(run.kind), t('nodes', { count: run.node_ids.length }), t('artifacts', { count: run.artifacts.length }), run.fingerprint ? t('fingerprinted') : '']) {
      if (!text) continue; const badge = element('span', { class: text === statusLabel(run.status) ? `badge status-${run.status}` : '' }); badge.textContent = text; meta.append(badge);
    }
    content.append(heading, command, meta);
    const open = element('button', { type: 'button', class: 'secondary-button' }); open.textContent = state.language === 'es' ? 'Abrir' : 'Open'; open.addEventListener('click', () => showDetails(run.id));
    card.append(checkbox, content, open); ui.run_list.append(card);
  }
  ui.empty.hidden = state.visible.length > 0;
}
function toast(message) { const item = element('div', { class: 'toast' }); item.textContent = message; ui.toasts.append(item); setTimeout(() => item.remove(), 2800); }
function localInput(iso) { if (!iso) return ''; const date = new Date(iso); const offset = date.getTimezoneOffset() * 60_000; return new Date(date.getTime() - offset).toISOString().slice(0, 16); }
function isoInput(value) { return value ? new Date(value).toISOString() : null; }
function defaultRunId() { return `run.${new Date().toISOString().replace(/[-:.TZ]/gu, '').slice(0, 14)}`; }
function artifactLines(artifacts) { return artifacts.map(({ role, path, sha256, bytes, media_type: mediaType }) => [role, path, sha256 ?? '', bytes ?? '', mediaType].join(' | ')).join('\n'); }
function parseArtifacts(text) {
  return text.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
    const [role = '', path = '', sha256 = '', bytes = '', mediaType = ''] = line.split('|').map((part) => part.trim());
    return { role, path, sha256: sha256 || null, bytes: bytes === '' ? null : Number(bytes), media_type: mediaType };
  });
}
function openEditor(id = '') {
  const existing = id ? runById(id) : null; state.editingId = existing?.id ?? '';
  ui.run_id.value = existing?.id ?? defaultRunId(); ui.run_id.disabled = Boolean(existing);
  ui.run_name.value = existing?.title ?? ''; ui.run_kind.value = existing?.kind ?? 'manual'; ui.run_status.value = existing?.status ?? 'planned';
  ui.run_started.value = localInput(existing?.started_at); ui.run_completed.value = localInput(existing?.completed_at); ui.run_exit.value = existing?.exit_code ?? '';
  ui.run_cwd.value = existing?.cwd ?? ''; ui.run_command.value = existing?.command.join('\n') ?? ''; ui.run_artifacts.value = artifactLines(existing?.artifacts ?? []); ui.run_notes.value = existing?.notes ?? '';
  for (const item of ui.run_nodes.options) item.selected = Boolean(existing?.node_ids.includes(item.value));
  ui.remove_run.hidden = !existing; ui.run_dialog.showModal();
}
function draftFromEditor(now) {
  const existing = state.editingId ? runById(state.editingId) : null;
  return {
    id: ui.run_id.value, title: ui.run_name.value, kind: ui.run_kind.value, status: ui.run_status.value,
    node_ids: [...ui.run_nodes.selectedOptions].map(({ value }) => value),
    command: ui.run_command.value.split('\n').map((line) => line.trim()).filter(Boolean), cwd: ui.run_cwd.value,
    environment: existing?.environment ?? {}, provenance: existing?.provenance ?? {}, started_at: isoInput(ui.run_started.value),
    completed_at: isoInput(ui.run_completed.value), duration_ms: null, exit_code: ui.run_exit.value === '' ? null : Number(ui.run_exit.value),
    signal: existing?.signal ?? '', timed_out: existing?.timed_out ?? false, artifacts: parseArtifacts(ui.run_artifacts.value),
    notes: ui.run_notes.value, fingerprint: null, created_at: existing?.created_at ?? now, updated_at: now,
  };
}
async function saveEditor(fingerprint) {
  try {
    const now = new Date().toISOString(); let next = normalizeRun(draftFromEditor(now), state.validNodeIds, now);
    if (fingerprint) next = await withRunFingerprint(next, state.validNodeIds, now);
    state.ledger = normalizeRunLedger({ ...state.ledger, updated_at: now, runs: [...state.ledger.runs.filter(({ id }) => id !== next.id), next] }, state.validNodeIds, now);
    persistLedger(); ui.run_dialog.close(); render();
  } catch (error) { console.error(error); toast(error instanceof Error ? error.message : t('error')); }
}
function appendDetail(list, label, value) { const term = element('dt'); term.textContent = label; const detail = element('dd'); detail.textContent = value || '—'; list.append(term, detail); }
function showDetails(id) {
  const run = runById(id); if (!run) return; state.detailId = id; ui.detail_title.textContent = run.title; ui.detail_content.replaceChildren();
  const list = element('dl', { class: 'detail-grid' });
  appendDetail(list, 'ID', run.id); appendDetail(list, state.language === 'es' ? 'Estado' : 'Status', statusLabel(run.status)); appendDetail(list, state.language === 'es' ? 'Tipo' : 'Kind', kindLabel(run.kind));
  appendDetail(list, state.language === 'es' ? 'Comando' : 'Command', commandText(run)); appendDetail(list, 'SHA-256', run.fingerprint ?? '—'); appendDetail(list, state.language === 'es' ? 'Notas' : 'Notes', run.notes);
  ui.detail_content.append(list);
  if (run.artifacts.length) {
    const table = element('table', { class: 'artifact-table' }); const head = element('tr');
    for (const label of ['Role', 'Path', 'SHA-256', 'Bytes']) { const cell = element('th'); cell.textContent = label; head.append(cell); }
    const thead = element('thead'); thead.append(head); const body = element('tbody');
    for (const artifact of run.artifacts) { const row = element('tr'); for (const value of [artifact.role, artifact.path, artifact.sha256 ?? '—', artifact.bytes ?? '—']) { const cell = element('td'); cell.textContent = String(value); row.append(cell); } body.append(row); }
    table.append(thead, body); ui.detail_content.append(table);
  }
  ui.detail_dialog.showModal();
}
function downloadText(filename, text, type) { const blob = new Blob([text], { type: `${type};charset=utf-8` }); const url = URL.createObjectURL(blob); const link = element('a', { href: url, download: filename }); document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
async function exportPacket() { try { const packet = await buildRunPacket(state.ledger, state.selected, state.validNodeIds); downloadText('physmath-run-packet.json', `${JSON.stringify(packet, null, 2)}\n`, 'application/json'); toast(t('exported')); } catch (error) { console.error(error); toast(t('error')); } }
function bulkInconclusive() {
  const now = new Date().toISOString();
  state.ledger = normalizeRunLedger({ ...state.ledger, updated_at: now, runs: state.ledger.runs.map((run) => state.selected.has(run.id) ? { ...run, status: 'inconclusive', fingerprint: null, updated_at: now } : run) }, state.validNodeIds, now);
  persistLedger(); render(); toast(t('marked'));
}
async function importFile(file) {
  try {
    validateRunFile(file); const incoming = parseRunImport(await file.text(), state.validNodeIds);
    state.ledger = ui.import_mode.value === 'replace' ? incoming : mergeRunLedgers(state.ledger, incoming, state.validNodeIds);
    persistLedger(); state.selected.clear(); render(); toast(t('imported'));
  } catch (error) { console.error(error); toast(error instanceof Error ? error.message : t('error')); }
}
function cycleTheme() { const values = ['system', 'light', 'dark']; state.theme = values[(values.indexOf(state.theme) + 1) % values.length]; document.documentElement.dataset.theme = state.theme; saveSetting('theme', state.theme); }
function bindEvents() {
  for (const control of [ui.search, ui.status_filter, ui.kind_filter, ui.node_filter, ui.sort]) control.addEventListener(control === ui.search ? 'input' : 'change', render);
  ui.clear_filters.addEventListener('click', () => { ui.search.value = ''; ui.status_filter.value = 'all'; ui.kind_filter.value = 'all'; ui.node_filter.value = 'all'; ui.sort.value = 'updated-desc'; render(); });
  ui.toggle_visible.addEventListener('change', () => { for (const { id } of state.visible) ui.toggle_visible.checked ? state.selected.add(id) : state.selected.delete(id); render(); });
  ui.select_visible.addEventListener('click', () => { state.visible.forEach(({ id }) => state.selected.add(id)); render(); });
  ui.clear_selection.addEventListener('click', () => { state.selected.clear(); render(); }); ui.mark_inconclusive.addEventListener('click', bulkInconclusive); ui.export_packet.addEventListener('click', exportPacket);
  ui.export_ledger.addEventListener('click', () => { downloadText('physmath-run-ledger.json', `${JSON.stringify(state.ledger, null, 2)}\n`, 'application/json'); toast(t('exported')); });
  ui.import_ledger.addEventListener('click', () => ui.ledger_file.click()); ui.ledger_file.addEventListener('change', () => { const [file] = ui.ledger_file.files; if (file) importFile(file); ui.ledger_file.value = ''; });
  ui.reset_ledger.addEventListener('click', () => ui.reset_dialog.showModal()); ui.reset_dialog.addEventListener('close', () => { if (ui.reset_dialog.returnValue !== 'confirm') return; state.ledger = createEmptyRunLedger(); state.selected.clear(); persistLedger(); render(); toast(t('cleared')); });
  ui.new_run.addEventListener('click', () => openEditor()); ui.save_run.addEventListener('click', () => saveEditor(false)); ui.fingerprint_run.addEventListener('click', () => saveEditor(true));
  ui.remove_run.addEventListener('click', () => { if (!state.editingId) return; state.ledger = removeRun(state.ledger, state.editingId, state.validNodeIds); state.selected.delete(state.editingId); persistLedger(); ui.run_dialog.close(); render(); toast(t('removed')); });
  ui.verify_run.addEventListener('click', async () => { const run = runById(state.detailId); toast(run && await verifyRunFingerprint(run, state.validNodeIds) ? t('verified') : t('invalidFingerprint')); });
  ui.edit_run.addEventListener('click', () => { const id = state.detailId; ui.detail_dialog.close(); openEditor(id); });
  ui.help.addEventListener('click', () => ui.help_dialog.showModal()); ui.theme.addEventListener('click', cycleTheme);
  ui.language.addEventListener('change', () => { state.language = ui.language.value === 'es' ? 'es' : 'en'; saveSetting('language', state.language); translateDocument(); buildOptions(); render(); });
}
async function registerServiceWorker() { if ('serviceWorker' in navigator && location.protocol !== 'file:') { try { await navigator.serviceWorker.register('./sw.js', { scope: './' }); } catch (error) { console.warn('Service worker registration failed:', error); } } }
async function init() {
  document.documentElement.dataset.theme = state.theme; translateDocument();
  try {
    state.nodes = await loadJson('./graph/nodes/core.json'); state.nodes.sort((left, right) => left.title.localeCompare(right.title) || left.id.localeCompare(right.id));
    state.nodeById = new Map(state.nodes.map((node) => [node.id, node])); state.validNodeIds = new Set(state.nodeById.keys()); state.ledger = loadLedger();
    buildOptions(); bindEvents(); render(); ui.loading.hidden = true; ui.run_center.hidden = false; registerServiceWorker();
  } catch (error) { console.error(error); ui.loading.textContent = error instanceof Error ? error.message : String(error); ui.loading.classList.add('load-error'); }
}

init();
