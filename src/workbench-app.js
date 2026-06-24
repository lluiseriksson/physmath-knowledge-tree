import { connectedNeighborhood, indexById, searchNodes } from './lib/research-graph.js';
import { CONFIDENCE_LEVELS, planResearchRoute, summarizeRouteEvidence } from './lib/route-planner.js';
import {
  compareNodeSets,
  createWorkspace,
  exportWorkspaceLibrary,
  importWorkspaceLibrary,
  loadWorkspaceLibrary,
  mergeWorkspaceLibraries,
  saveWorkspaceLibrary,
  touchWorkspace,
  validateWorkspaceFile,
} from './lib/workspace.js';
import { compareNormalizedText, compareText } from './lib/text.js';

const STRINGS = {
  en: {
    'nav.skip': 'Skip to the research workbench',
    'nav.primary': 'Primary navigation',
    'nav.research': 'Research graph',
    'nav.learning': 'Learning map',
    'nav.workbench': 'Workbench',
    'nav.repository': 'Repository',
    'app.tagline': 'Private, traceable research workspaces',
    'header.language': 'Interface language',
    'header.theme': 'Change theme',
    'header.help': 'Workbench help',
    loading: 'Loading the canonical research graph…',
    'workspace.eyebrow': 'Local research memory',
    'workspace.title': 'Workspaces',
    'workspace.current': 'Current workspace',
    'workspace.name': 'Workspace name',
    'workspace.new': 'New',
    'workspace.delete': 'Delete',
    'workspace.summary': 'Workspace summary',
    'stats.nodes': 'Nodes',
    'stats.drafts': 'Drafts',
    'stats.results': 'Negative results',
    'portable.title': 'Portable workspace data',
    'portable.body': 'Data stays in this browser unless you export it.',
    'portable.mode': 'Import mode',
    'portable.merge': 'Merge by newest update',
    'portable.replace': 'Replace local library',
    'portable.export': 'Export JSON',
    'portable.import': 'Import JSON',
    'portable.file': 'Workspace import file',
    'active.eyebrow': 'Active investigation',
    'active.body': 'Collect canonical nodes, compare nearby structures, preserve failed approaches and export a reproducible handoff.',
    'active.private': 'Local-only by default',
    'nodes.title': 'Collect canonical nodes',
    'nodes.body': 'Search the graph and pin the smallest useful subgraph.',
    'nodes.search': 'Search nodes',
    'nodes.placeholder': 'Search titles, IDs, tags or questions',
    'nodes.selected': 'Selected nodes',
    'nodes.clear': 'Clear',
    'nodes.none': 'No nodes selected yet.',
    'nodes.noResults': 'No matching nodes.',
    'nodes.add': 'Add',
    'nodes.added': 'Added',
    'nodes.remove': 'Remove {title}',
    'neighborhood.title': 'Compare neighborhoods',
    'neighborhood.body': 'Expose shared and unique context at a controlled graph radius.',
    'neighborhood.radius': 'Radius',
    'neighborhood.addUnion': 'Add union to workspace',
    'neighborhood.leftOnly': 'Left only',
    'neighborhood.shared': 'Shared',
    'neighborhood.rightOnly': 'Right only',
    'neighborhood.empty': 'No nodes in this partition.',
    'compare.left': 'Left seed',
    'compare.right': 'Right seed',
    'compare.run': 'Compare',
    'route.title': 'Compare evidence-aware routes',
    'route.body': 'Contrast route objectives without hiding their weakest evidence.',
    'route.source': 'From',
    'route.target': 'To',
    'route.policyA': 'Route A objective',
    'route.policyB': 'Route B objective',
    'route.evidence': 'Evidence gate',
    'route.shortest': 'Fewest edges',
    'route.balanced': 'Balanced',
    'route.strongest': 'Strongest evidence',
    'route.all': 'All levels',
    'route.sourced': 'Formal and literature',
    'route.formal': 'Formal only',
    'route.directed': 'Respect edge direction',
    'route.none': 'No route satisfies this evidence gate.',
    'route.hops': '{count} edges',
    'route.weakest': 'Weakest: {value}',
    'route.references': '{count} references',
    'route.shared': '{count} shared edges',
    'route.add': 'Add route nodes',
    'confidence.formal': 'formal',
    'confidence.literature': 'literature',
    'confidence.heuristic': 'heuristic',
    'confidence.speculative': 'speculative',
    'confidence.none': 'none',
    'notes.title': 'Keep working notes',
    'notes.body': 'Record assumptions, invariants, source gaps and the next bounded test.',
    'notes.label': 'Workspace notes',
    'notes.placeholder': 'Assumptions, definitions, open questions, computations…',
    'drafts.title': 'Bridge-card drafts',
    'drafts.body': 'Store exploratory Markdown without promoting it to a canonical claim.',
    'drafts.name': 'Draft title',
    'drafts.markdown': 'Markdown',
    'drafts.placeholder': '# Bridge Card…',
    'drafts.save': 'Save draft',
    'drafts.clear': 'Clear editor',
    'drafts.none': 'No bridge drafts in this workspace.',
    'drafts.edit': 'Edit',
    'drafts.download': 'Download',
    'drafts.delete': 'Delete',
    'negative.title': 'Negative-results ledger',
    'negative.body': 'Preserve failed mechanisms and inconclusive tests as reusable knowledge.',
    'negative.name': 'Result title',
    'negative.status': 'Status',
    'negative.observed': 'Observed failure',
    'negative.inconclusive': 'Inconclusive',
    'negative.falsified': 'Mechanism falsified',
    'negative.nodes': 'Related selected nodes',
    'negative.observation': 'Observation',
    'negative.mechanism': 'Challenged mechanism or invariant',
    'negative.next': 'Next discriminating test',
    'negative.save': 'Record result',
    'negative.none': 'No negative results recorded yet.',
    'negative.delete': 'Delete',
    'negative.mechanismLabel': 'Challenged mechanism',
    'negative.nextLabel': 'Next test',
    'help.title': 'How the workbench behaves',
    'help.local': 'Workspaces are stored only in this browser unless exported.',
    'help.canonical': 'Pinned nodes always reference stable canonical graph IDs.',
    'help.evidence': 'Route comparison reports the weakest evidence instead of upgrading it.',
    'help.negative': 'Negative results remain local records until reviewed and promoted deliberately.',
    'help.close': 'Close',
    'delete.title': 'Delete this workspace?',
    'delete.body': 'This removes its local notes, drafts and negative results. Export first when needed.',
    'delete.cancel': 'Cancel',
    'delete.confirm': 'Delete',
    'toast.saved': 'Saved locally',
    'toast.created': 'Workspace created',
    'toast.deleted': 'Workspace deleted',
    'toast.nodesAdded': 'Nodes added to the workspace',
    'toast.exported': 'Workspace library exported',
    'toast.imported': 'Workspace library imported',
    'toast.importFailed': 'Import failed: {message}',
    'toast.draftSaved': 'Bridge draft saved',
    'toast.resultSaved': 'Negative result recorded',
    'toast.needDraft': 'Add a title or Markdown before saving.',
    'toast.needObservation': 'Describe the observed or inconclusive result first.',
    'toast.theme': 'Theme: {value}',
    'error.title': 'The workbench could not load',
    'error.body': 'The canonical graph files are unavailable or invalid.',
  },
  es: {
    'nav.skip': 'Saltar al banco de investigación',
    'nav.primary': 'Navegación principal',
    'nav.research': 'Grafo de investigación',
    'nav.learning': 'Mapa de aprendizaje',
    'nav.workbench': 'Banco de trabajo',
    'nav.repository': 'Repositorio',
    'app.tagline': 'Espacios de investigación privados y trazables',
    'header.language': 'Idioma de la interfaz',
    'header.theme': 'Cambiar tema',
    'header.help': 'Ayuda del banco de trabajo',
    loading: 'Cargando el grafo canónico de investigación…',
    'workspace.eyebrow': 'Memoria local de investigación',
    'workspace.title': 'Espacios de trabajo',
    'workspace.current': 'Espacio actual',
    'workspace.name': 'Nombre del espacio',
    'workspace.new': 'Nuevo',
    'workspace.delete': 'Eliminar',
    'workspace.summary': 'Resumen del espacio',
    'stats.nodes': 'Nodos',
    'stats.drafts': 'Borradores',
    'stats.results': 'Resultados negativos',
    'portable.title': 'Datos portátiles',
    'portable.body': 'Los datos permanecen en este navegador salvo que los exportes.',
    'portable.mode': 'Modo de importación',
    'portable.merge': 'Fusionar por actualización más reciente',
    'portable.replace': 'Sustituir la biblioteca local',
    'portable.export': 'Exportar JSON',
    'portable.import': 'Importar JSON',
    'portable.file': 'Archivo de importación de espacios',
    'active.eyebrow': 'Investigación activa',
    'active.body': 'Reúne nodos canónicos, compara estructuras cercanas, conserva intentos fallidos y exporta un relevo reproducible.',
    'active.private': 'Local por defecto',
    'nodes.title': 'Reunir nodos canónicos',
    'nodes.body': 'Busca en el grafo y fija el subgrafo útil más pequeño.',
    'nodes.search': 'Buscar nodos',
    'nodes.placeholder': 'Buscar títulos, ID, etiquetas o preguntas',
    'nodes.selected': 'Nodos seleccionados',
    'nodes.clear': 'Vaciar',
    'nodes.none': 'Todavía no hay nodos seleccionados.',
    'nodes.noResults': 'No hay nodos coincidentes.',
    'nodes.add': 'Añadir',
    'nodes.added': 'Añadido',
    'nodes.remove': 'Quitar {title}',
    'neighborhood.title': 'Comparar vecindarios',
    'neighborhood.body': 'Muestra el contexto común y exclusivo con un radio controlado.',
    'neighborhood.radius': 'Radio',
    'neighborhood.addUnion': 'Añadir la unión al espacio',
    'neighborhood.leftOnly': 'Solo izquierda',
    'neighborhood.shared': 'Comunes',
    'neighborhood.rightOnly': 'Solo derecha',
    'neighborhood.empty': 'No hay nodos en esta parte.',
    'compare.left': 'Semilla izquierda',
    'compare.right': 'Semilla derecha',
    'compare.run': 'Comparar',
    'route.title': 'Comparar rutas según la evidencia',
    'route.body': 'Contrasta objetivos de ruta sin ocultar su evidencia más débil.',
    'route.source': 'Desde',
    'route.target': 'Hasta',
    'route.policyA': 'Objetivo de la ruta A',
    'route.policyB': 'Objetivo de la ruta B',
    'route.evidence': 'Filtro de evidencia',
    'route.shortest': 'Menos aristas',
    'route.balanced': 'Equilibrada',
    'route.strongest': 'Evidencia más fuerte',
    'route.all': 'Todos los niveles',
    'route.sourced': 'Formal y bibliográfica',
    'route.formal': 'Solo formal',
    'route.directed': 'Respetar la dirección',
    'route.none': 'Ninguna ruta satisface este filtro de evidencia.',
    'route.hops': '{count} aristas',
    'route.weakest': 'Más débil: {value}',
    'route.references': '{count} referencias',
    'route.shared': '{count} aristas comunes',
    'route.add': 'Añadir nodos de la ruta',
    'confidence.formal': 'formal',
    'confidence.literature': 'bibliográfica',
    'confidence.heuristic': 'heurística',
    'confidence.speculative': 'especulativa',
    'confidence.none': 'ninguna',
    'notes.title': 'Conservar notas de trabajo',
    'notes.body': 'Registra supuestos, invariantes, lagunas de fuentes y la siguiente prueba acotada.',
    'notes.label': 'Notas del espacio',
    'notes.placeholder': 'Supuestos, definiciones, preguntas abiertas, cálculos…',
    'drafts.title': 'Borradores de tarjetas puente',
    'drafts.body': 'Guarda Markdown exploratorio sin promoverlo a afirmación canónica.',
    'drafts.name': 'Título del borrador',
    'drafts.markdown': 'Markdown',
    'drafts.placeholder': '# Tarjeta puente…',
    'drafts.save': 'Guardar borrador',
    'drafts.clear': 'Limpiar editor',
    'drafts.none': 'No hay borradores de puente en este espacio.',
    'drafts.edit': 'Editar',
    'drafts.download': 'Descargar',
    'drafts.delete': 'Eliminar',
    'negative.title': 'Registro de resultados negativos',
    'negative.body': 'Conserva mecanismos fallidos y pruebas inconclusas como conocimiento reutilizable.',
    'negative.name': 'Título del resultado',
    'negative.status': 'Estado',
    'negative.observed': 'Fallo observado',
    'negative.inconclusive': 'Inconcluso',
    'negative.falsified': 'Mecanismo refutado',
    'negative.nodes': 'Nodos seleccionados relacionados',
    'negative.observation': 'Observación',
    'negative.mechanism': 'Mecanismo o invariante cuestionado',
    'negative.next': 'Siguiente prueba discriminante',
    'negative.save': 'Registrar resultado',
    'negative.none': 'Todavía no hay resultados negativos.',
    'negative.delete': 'Eliminar',
    'negative.mechanismLabel': 'Mecanismo cuestionado',
    'negative.nextLabel': 'Siguiente prueba',
    'help.title': 'Cómo funciona el banco de trabajo',
    'help.local': 'Los espacios se guardan solo en este navegador salvo que se exporten.',
    'help.canonical': 'Los nodos fijados siempre apuntan a ID canónicos estables.',
    'help.evidence': 'La comparación de rutas informa de la evidencia más débil sin mejorarla artificialmente.',
    'help.negative': 'Los resultados negativos siguen siendo registros locales hasta una revisión y promoción deliberadas.',
    'help.close': 'Cerrar',
    'delete.title': '¿Eliminar este espacio?',
    'delete.body': 'Se borrarán sus notas, borradores y resultados negativos locales. Exporta antes cuando sea necesario.',
    'delete.cancel': 'Cancelar',
    'delete.confirm': 'Eliminar',
    'toast.saved': 'Guardado localmente',
    'toast.created': 'Espacio creado',
    'toast.deleted': 'Espacio eliminado',
    'toast.nodesAdded': 'Nodos añadidos al espacio',
    'toast.exported': 'Biblioteca exportada',
    'toast.imported': 'Biblioteca importada',
    'toast.importFailed': 'Falló la importación: {message}',
    'toast.draftSaved': 'Borrador de puente guardado',
    'toast.resultSaved': 'Resultado negativo registrado',
    'toast.needDraft': 'Añade un título o Markdown antes de guardar.',
    'toast.needObservation': 'Describe primero el resultado observado o inconcluso.',
    'toast.theme': 'Tema: {value}',
    'error.title': 'No se pudo cargar el banco de trabajo',
    'error.body': 'Los archivos del grafo canónico no están disponibles o no son válidos.',
  },
};

/** @param {string} id */
const byId = (id) => document.getElementById(id);
/** @param {string} name @param {Record<string,string|number>} [attributes] */
function element(name, attributes = {}) {
  const result = document.createElement(name);
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'class') result.className = String(value);
    else result.setAttribute(key, String(value));
  }
  return result;
}

const ui = {
  loading: byId('loading'), workbench: byId('workbench'), language: byId('language'), theme: byId('theme'), help: byId('help'),
  helpDialog: byId('help-dialog'), workspaceSelect: byId('workspace-select'), workspaceTitle: byId('workspace-title'),
  newWorkspace: byId('new-workspace'), deleteWorkspace: byId('delete-workspace'), deleteDialog: byId('confirm-delete'),
  saveState: byId('save-state'), activeTitle: byId('active-title'), statNodes: byId('stat-nodes'), statDrafts: byId('stat-drafts'),
  statResults: byId('stat-results'), importMode: byId('import-mode'), exportWorkspaces: byId('export-workspaces'),
  importWorkspaces: byId('import-workspaces'), workspaceFile: byId('workspace-file'), nodeSearch: byId('node-search'),
  nodeSearchResults: byId('node-search-results'), clearNodes: byId('clear-nodes'), selectedNodes: byId('selected-nodes'),
  neighborhoodLeft: byId('neighborhood-left'), neighborhoodRight: byId('neighborhood-right'), neighborhoodRadius: byId('neighborhood-radius'),
  compareNeighborhoods: byId('compare-neighborhoods'), addNeighborhoodUnion: byId('add-neighborhood-union'),
  neighborhoodResult: byId('neighborhood-result'), routeSource: byId('route-source'), routeTarget: byId('route-target'),
  routePolicyA: byId('route-policy-a'), routePolicyB: byId('route-policy-b'), routeEvidence: byId('route-evidence'),
  routeDirected: byId('route-directed'), compareRoutes: byId('compare-routes'), routeResult: byId('route-result'),
  workspaceNotes: byId('workspace-notes'), draftId: byId('draft-id'), draftTitle: byId('draft-title'),
  draftMarkdown: byId('draft-markdown'), saveDraft: byId('save-draft'), clearDraft: byId('clear-draft'), draftList: byId('draft-list'),
  negativeName: byId('negative-name'), negativeStatus: byId('negative-status'), negativeNodes: byId('negative-nodes'),
  negativeObservation: byId('negative-observation'), negativeMechanism: byId('negative-mechanism'), negativeNext: byId('negative-next'),
  saveNegative: byId('save-negative'), negativeList: byId('negative-list'), toasts: byId('toasts'),
};

const state = {
  language: readPreference('language', navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'),
  theme: readPreference('theme', 'system'),
  nodes: [], edges: [], nodeById: new Map(), validNodeIds: new Set(), library: null, storage: browserStorage(),
  neighborhoodComparison: null, routes: null, notesTimer: null,
};

function readPreference(key, fallback) {
  try { return localStorage.getItem(`physmath.workbench.${key}`) ?? fallback; } catch { return fallback; }
}
function savePreference(key, value) {
  try { localStorage.setItem(`physmath.workbench.${key}`, value); } catch { /* Optional preference. */ }
}
function browserStorage() {
  try { return window.localStorage; }
  catch { return { getItem: () => null, setItem: () => {} }; }
}
function translate(key, variables = {}) {
  const template = STRINGS[state.language]?.[key] ?? STRINGS.en[key] ?? key;
  return Object.entries(variables).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, String(replacement)), template);
}
function applyTranslations() {
  document.documentElement.lang = state.language;
  document.title = state.language === 'es'
    ? 'PhysMath Knowledge Tree — Banco de investigación'
    : 'PhysMath Knowledge Tree — Research workbench';
  for (const node of document.querySelectorAll('[data-i18n]')) node.textContent = translate(node.dataset.i18n);
  for (const node of document.querySelectorAll('[data-i18n-aria]')) node.setAttribute('aria-label', translate(node.dataset.i18nAria));
  for (const node of document.querySelectorAll('[data-i18n-placeholder]')) node.setAttribute('placeholder', translate(node.dataset.i18nPlaceholder));
  ui.language.value = state.language;
}
async function loadJson(path) {
  const response = await fetch(path, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}
function activeWorkspace() {
  return state.library.workspaces.find(({ id }) => id === state.library.active_workspace_id) ?? state.library.workspaces[0];
}
function makeId(prefix) {
  const suffix = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}.${suffix}`;
}
function nodeTitle(id) { return state.nodeById.get(id)?.title ?? id; }
function sortedNodes() {
  const kindRank = { domain: 0, bridge: 1, problem: 2 };
  return [...state.nodes].sort((left, right) => (kindRank[left.kind] ?? 9) - (kindRank[right.kind] ?? 9)
    || compareNormalizedText(left.title, right.title) || compareText(left.id, right.id));
}
function persist({ render = true, message = true } = {}) {
  state.library = saveWorkspaceLibrary(state.storage, state.library, state.validNodeIds);
  if (render) renderWorkspace();
  if (message) showSaved();
}
function updateActive(mutator, options = {}) {
  const current = activeWorkspace();
  mutator(current);
  const next = touchWorkspace(current, state.validNodeIds);
  state.library.workspaces = state.library.workspaces.map((workspace) => workspace.id === next.id ? next : workspace);
  persist(options);
}
function showSaved() {
  ui.saveState.textContent = translate('toast.saved');
  clearTimeout(showSaved.timer);
  showSaved.timer = setTimeout(() => { ui.saveState.textContent = ''; }, 1800);
}
function toast(message) {
  const item = element('div', { class: 'toast' });
  item.textContent = message;
  ui.toasts.append(item);
  setTimeout(() => item.remove(), 3600);
}
function downloadText(filename, text, type = 'text/plain') {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = element('a', { href: url, download: filename });
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function init() {
  document.documentElement.dataset.theme = state.theme;
  applyTranslations();
  try {
    const [nodes, edges] = await Promise.all([
      loadJson('./graph/nodes/core.json'),
      loadJson('./graph/edges.json'),
    ]);
    if (!Array.isArray(nodes) || !Array.isArray(edges)) throw new Error('Canonical graph payloads must be arrays');
    state.nodes = nodes;
    state.edges = edges;
    state.nodeById = indexById(nodes);
    state.validNodeIds = new Set(nodes.map(({ id }) => id));
    state.library = loadWorkspaceLibrary(state.storage, state.validNodeIds);
    buildNodeSelects();
    bindEvents();
    renderWorkspace();
    ui.loading.hidden = true;
    ui.workbench.hidden = false;
    registerServiceWorker();
  } catch (error) {
    console.error(error);
    const wrapper = element('div');
    const title = element('strong'); title.textContent = translate('error.title');
    const body = element('p'); body.textContent = translate('error.body');
    const technical = element('code'); technical.textContent = error instanceof Error ? error.message : String(error);
    wrapper.append(title, body, technical);
    ui.loading.replaceChildren(wrapper);
    ui.loading.classList.add('load-error');
  }
}

function buildNodeSelects() {
  const selects = [ui.neighborhoodLeft, ui.neighborhoodRight, ui.routeSource, ui.routeTarget];
  const nodes = sortedNodes();
  for (const select of selects) {
    const fragment = document.createDocumentFragment();
    let activeKind = null;
    let group = null;
    for (const node of nodes) {
      if (node.kind !== activeKind) {
        activeKind = node.kind;
        group = element('optgroup', { label: node.kind });
        fragment.append(group);
      }
      const option = element('option', { value: node.id });
      option.textContent = node.title;
      group.append(option);
    }
    select.replaceChildren(fragment);
  }
  const problems = nodes.filter(({ kind }) => kind === 'problem');
  const first = problems[0]?.id ?? nodes[0]?.id ?? '';
  const second = problems[1]?.id ?? nodes[1]?.id ?? first;
  ui.neighborhoodLeft.value = first;
  ui.neighborhoodRight.value = second;
  ui.routeSource.value = first;
  ui.routeTarget.value = second;
}

function renderWorkspace() {
  const workspace = activeWorkspace();
  const optionFragment = document.createDocumentFragment();
  for (const item of [...state.library.workspaces].sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))) {
    const option = element('option', { value: item.id });
    option.textContent = item.title;
    optionFragment.append(option);
  }
  ui.workspaceSelect.replaceChildren(optionFragment);
  ui.workspaceSelect.value = workspace.id;
  if (ui.workspaceTitle.value !== workspace.title) ui.workspaceTitle.value = workspace.title;
  if (ui.workspaceNotes.value !== workspace.notes) ui.workspaceNotes.value = workspace.notes;
  ui.activeTitle.textContent = workspace.title;
  ui.statNodes.textContent = String(workspace.node_ids.length);
  ui.statDrafts.textContent = String(workspace.bridge_cards.length);
  ui.statResults.textContent = String(workspace.negative_results.length);
  ui.deleteWorkspace.disabled = state.library.workspaces.length <= 1;
  renderSelectedNodes();
  renderNegativeNodeOptions();
  renderDrafts();
  renderNegativeResults();
  renderSearchResults();
}

function renderSearchResults() {
  const query = ui.nodeSearch.value.trim();
  if (!query) { ui.nodeSearchResults.replaceChildren(); return; }
  const workspace = activeWorkspace();
  const selected = new Set(workspace.node_ids);
  const matches = searchNodes(state.nodes, query, 10);
  if (matches.length === 0) {
    const empty = element('p', { class: 'empty-message' }); empty.textContent = translate('nodes.noResults');
    ui.nodeSearchResults.replaceChildren(empty); return;
  }
  const fragment = document.createDocumentFragment();
  for (const { node } of matches) {
    const row = element('div', { class: 'search-result', role: 'option' });
    const text = element('span');
    const title = element('strong'); title.textContent = node.title;
    const meta = element('small'); meta.textContent = `${node.id} · ${node.kind}`;
    text.append(title, meta);
    const button = element('button', { type: 'button', class: 'secondary-button' });
    button.textContent = selected.has(node.id) ? translate('nodes.added') : translate('nodes.add');
    button.disabled = selected.has(node.id);
    button.addEventListener('click', () => addNodes([node.id]));
    row.append(text, button); fragment.append(row);
  }
  ui.nodeSearchResults.replaceChildren(fragment);
}

function renderSelectedNodes() {
  const workspace = activeWorkspace();
  if (workspace.node_ids.length === 0) {
    const empty = element('p', { class: 'empty-message' }); empty.textContent = translate('nodes.none');
    ui.selectedNodes.replaceChildren(empty); return;
  }
  const fragment = document.createDocumentFragment();
  for (const id of [...workspace.node_ids].sort((a, b) => compareNormalizedText(nodeTitle(a), nodeTitle(b)))) {
    const chip = element('span', { class: 'node-chip' });
    const link = element('a', { href: `./?node=${encodeURIComponent(id)}` });
    link.textContent = nodeTitle(id);
    const remove = element('button', { type: 'button', 'aria-label': translate('nodes.remove', { title: nodeTitle(id) }) });
    remove.textContent = '×';
    remove.addEventListener('click', () => removeNode(id));
    chip.append(link, remove); fragment.append(chip);
  }
  ui.selectedNodes.replaceChildren(fragment);
}

function addNodes(ids) {
  const valid = ids.filter((id) => state.validNodeIds.has(id));
  if (valid.length === 0) return;
  updateActive((workspace) => { workspace.node_ids = [...new Set([...workspace.node_ids, ...valid])]; });
  toast(translate('toast.nodesAdded'));
}
function removeNode(id) {
  updateActive((workspace) => {
    workspace.node_ids = workspace.node_ids.filter((nodeId) => nodeId !== id);
    for (const result of workspace.negative_results) result.node_ids = result.node_ids.filter((nodeId) => nodeId !== id);
  });
}

function renderNegativeNodeOptions() {
  const selected = new Set([...ui.negativeNodes.selectedOptions].map(({ value }) => value));
  const workspace = activeWorkspace();
  const fragment = document.createDocumentFragment();
  for (const id of workspace.node_ids) {
    const option = element('option', { value: id });
    option.textContent = nodeTitle(id);
    option.selected = selected.has(id);
    fragment.append(option);
  }
  ui.negativeNodes.replaceChildren(fragment);
}

function compareNeighborhoods() {
  const left = connectedNeighborhood(state.nodes, state.edges, ui.neighborhoodLeft.value, Number(ui.neighborhoodRadius.value));
  const right = connectedNeighborhood(state.nodes, state.edges, ui.neighborhoodRight.value, Number(ui.neighborhoodRadius.value));
  state.neighborhoodComparison = compareNodeSets(left, right);
  ui.addNeighborhoodUnion.disabled = state.neighborhoodComparison.union.length === 0;
  renderNeighborhoodComparison();
}
function renderNeighborhoodComparison() {
  const comparison = state.neighborhoodComparison;
  if (!comparison) { ui.neighborhoodResult.replaceChildren(); return; }
  const columns = [
    ['neighborhood.leftOnly', comparison.left_only],
    ['neighborhood.shared', comparison.shared],
    ['neighborhood.rightOnly', comparison.right_only],
  ];
  const fragment = document.createDocumentFragment();
  for (const [label, ids] of columns) {
    const column = element('section', { class: 'comparison-column' });
    const heading = element('h3'); heading.textContent = `${translate(label)} · ${ids.length}`;
    column.append(heading, renderNodeList(ids)); fragment.append(column);
  }
  ui.neighborhoodResult.replaceChildren(fragment);
}
function renderNodeList(ids) {
  if (ids.length === 0) {
    const empty = element('p', { class: 'empty-message' }); empty.textContent = translate('neighborhood.empty'); return empty;
  }
  const list = element('ol');
  for (const id of ids.sort((a, b) => compareNormalizedText(nodeTitle(a), nodeTitle(b)))) {
    const item = element('li');
    const link = element('a', { href: `./?node=${encodeURIComponent(id)}` }); link.textContent = nodeTitle(id);
    item.append(link); list.append(item);
  }
  return list;
}

function allowedConfidence() {
  if (ui.routeEvidence.value === 'formal') return ['formal'];
  if (ui.routeEvidence.value === 'sourced') return ['formal', 'literature'];
  return [...CONFIDENCE_LEVELS];
}
function compareRoutes() {
  const source = ui.routeSource.value;
  const target = ui.routeTarget.value;
  const common = { directed: ui.routeDirected.checked, allowedConfidence: allowedConfidence() };
  const first = planResearchRoute(state.nodes, state.edges, source, target, { ...common, policy: ui.routePolicyA.value });
  const second = planResearchRoute(state.nodes, state.edges, source, target, { ...common, policy: ui.routePolicyB.value });
  state.routes = [first, second].map((route) => route ? { ...route, evidence: summarizeRouteEvidence(route, state.edges) } : null);
  renderRouteComparison();
}
function renderRouteComparison() {
  if (!state.routes) { ui.routeResult.replaceChildren(); return; }
  const fragment = document.createDocumentFragment();
  const edgeSets = state.routes.map((route) => new Set(route?.edges ?? []));
  const shared = [...edgeSets[0]].filter((id) => edgeSets[1].has(id)).length;
  const summary = element('p', { class: 'empty-message route-summary' });
  summary.textContent = translate('route.shared', { count: shared });
  fragment.append(summary);
  state.routes.forEach((route, index) => fragment.append(renderRouteCard(route, index === 0 ? ui.routePolicyA.value : ui.routePolicyB.value)));
  ui.routeResult.replaceChildren(fragment);
}
function renderRouteCard(route, policy) {
  const card = element('section', { class: 'route-card' });
  const heading = element('h3'); heading.textContent = translate(`route.${policy}`);
  card.append(heading);
  if (!route) {
    const empty = element('p', { class: 'empty-message' }); empty.textContent = translate('route.none'); card.append(empty); return card;
  }
  const metrics = element('div', { class: 'route-metrics' });
  const weakest = route.evidence.weakest_confidence
    ? translate(`confidence.${route.evidence.weakest_confidence}`)
    : translate('confidence.none');
  for (const value of [
    translate('route.hops', { count: route.edges.length }),
    translate('route.weakest', { value: weakest }),
    translate('route.references', { count: route.evidence.references }),
  ]) {
    const metric = element('span', { class: 'metric' }); metric.textContent = value; metrics.append(metric);
  }
  const list = element('ol');
  for (const id of route.nodes) {
    const item = element('li');
    const link = element('a', { href: `./?node=${encodeURIComponent(id)}` }); link.textContent = nodeTitle(id);
    item.append(link); list.append(item);
  }
  const add = element('button', { type: 'button', class: 'secondary-button' });
  add.textContent = translate('route.add'); add.addEventListener('click', () => addNodes(route.nodes));
  card.append(metrics, list, add); return card;
}

function clearDraftEditor() {
  ui.draftId.value = '';
  ui.draftTitle.value = '';
  ui.draftMarkdown.value = '';
}
function saveDraft() {
  const title = ui.draftTitle.value.trim();
  const markdown = ui.draftMarkdown.value.trim();
  if (!title && !markdown) { toast(translate('toast.needDraft')); return; }
  const id = ui.draftId.value || makeId('card');
  const now = new Date().toISOString();
  updateActive((workspace) => {
    const previous = workspace.bridge_cards.find((card) => card.id === id);
    const next = {
      id,
      title: title || 'Untitled bridge draft',
      markdown,
      node_ids: [...workspace.node_ids],
      created_at: previous?.created_at ?? now,
      updated_at: now,
    };
    workspace.bridge_cards = previous
      ? workspace.bridge_cards.map((card) => card.id === id ? next : card)
      : [next, ...workspace.bridge_cards];
  });
  clearDraftEditor(); toast(translate('toast.draftSaved'));
}
function renderDrafts() {
  const cards = [...activeWorkspace().bridge_cards].sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
  if (cards.length === 0) {
    const empty = element('p', { class: 'empty-message' }); empty.textContent = translate('drafts.none');
    ui.draftList.replaceChildren(empty); return;
  }
  const fragment = document.createDocumentFragment();
  for (const card of cards) {
    const article = element('article', { class: 'record-card' });
    const header = element('header');
    const text = element('div'); const title = element('h3'); title.textContent = card.title;
    const updated = element('small'); updated.textContent = new Date(card.updated_at).toLocaleString(state.language);
    text.append(title, updated);
    const actions = element('div', { class: 'record-actions' });
    const edit = element('button', { type: 'button', class: 'text-button' }); edit.textContent = translate('drafts.edit');
    edit.addEventListener('click', () => { ui.draftId.value = card.id; ui.draftTitle.value = card.title; ui.draftMarkdown.value = card.markdown; ui.draftTitle.focus(); });
    const download = element('button', { type: 'button', class: 'text-button' }); download.textContent = translate('drafts.download');
    download.addEventListener('click', () => downloadText(`${safeFilename(card.title)}.md`, `${card.markdown}\n`, 'text/markdown'));
    const remove = element('button', { type: 'button', class: 'text-button' }); remove.textContent = translate('drafts.delete');
    remove.addEventListener('click', () => updateActive((workspace) => { workspace.bridge_cards = workspace.bridge_cards.filter(({ id }) => id !== card.id); }));
    actions.append(edit, download, remove); header.append(text, actions); article.append(header);
    if (card.markdown) { const preview = element('p'); preview.textContent = card.markdown.slice(0, 320); article.append(preview); }
    fragment.append(article);
  }
  ui.draftList.replaceChildren(fragment);
}
function safeFilename(value) {
  const normalized = value.normalize('NFKD').replace(/[^a-z0-9._-]+/giu, '-').replace(/^-+|-+$/gu, '').slice(0, 80);
  return normalized || 'physmath-draft';
}

function saveNegativeResult() {
  const observation = ui.negativeObservation.value.trim();
  if (!observation) { toast(translate('toast.needObservation')); return; }
  const now = new Date().toISOString();
  const selectedNodeIds = [...ui.negativeNodes.selectedOptions].map(({ value }) => value);
  const result = {
    id: makeId('result'),
    title: ui.negativeName.value.trim() || 'Untitled negative result',
    status: ui.negativeStatus.value,
    node_ids: selectedNodeIds,
    observation,
    challenged_mechanism: ui.negativeMechanism.value.trim(),
    next_test: ui.negativeNext.value.trim(),
    created_at: now,
    updated_at: now,
  };
  updateActive((workspace) => { workspace.negative_results = [result, ...workspace.negative_results]; });
  ui.negativeName.value = '';
  ui.negativeObservation.value = '';
  ui.negativeMechanism.value = '';
  ui.negativeNext.value = '';
  for (const option of ui.negativeNodes.options) option.selected = false;
  toast(translate('toast.resultSaved'));
}
function renderNegativeResults() {
  const results = [...activeWorkspace().negative_results].sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
  if (results.length === 0) {
    const empty = element('p', { class: 'empty-message' }); empty.textContent = translate('negative.none');
    ui.negativeList.replaceChildren(empty); return;
  }
  const fragment = document.createDocumentFragment();
  for (const result of results) {
    const article = element('article', { class: 'record-card' });
    const header = element('header');
    const text = element('div'); const title = element('h3'); title.textContent = result.title;
    const updated = element('small'); updated.textContent = new Date(result.updated_at).toLocaleString(state.language);
    text.append(title, updated);
    const remove = element('button', { type: 'button', class: 'text-button' }); remove.textContent = translate('negative.delete');
    remove.addEventListener('click', () => updateActive((workspace) => { workspace.negative_results = workspace.negative_results.filter(({ id }) => id !== result.id); }));
    header.append(text, remove);
    const badge = element('span', { class: 'status-badge' }); badge.textContent = translate(`negative.${result.status}`);
    const observation = element('p'); observation.textContent = result.observation;
    article.append(header, badge, observation);
    if (result.node_ids.length) {
      const nodes = element('small'); nodes.textContent = result.node_ids.map(nodeTitle).join(' · '); article.append(nodes);
    }
    if (result.challenged_mechanism) {
      const mechanism = element('p'); mechanism.textContent = `${translate('negative.mechanismLabel')}: ${result.challenged_mechanism}`; article.append(mechanism);
    }
    if (result.next_test) {
      const next = element('p'); next.textContent = `${translate('negative.nextLabel')}: ${result.next_test}`; article.append(next);
    }
    fragment.append(article);
  }
  ui.negativeList.replaceChildren(fragment);
}

function createNewWorkspace() {
  const workspace = createWorkspace({
    id: makeId('workspace'),
    title: state.language === 'es' ? `Investigación ${state.library.workspaces.length + 1}` : `Investigation ${state.library.workspaces.length + 1}`,
  });
  state.library.workspaces.push(workspace);
  state.library.active_workspace_id = workspace.id;
  state.neighborhoodComparison = null;
  state.routes = null;
  clearDraftEditor(); persist(); toast(translate('toast.created'));
  ui.workspaceTitle.select();
}
function deleteCurrentWorkspace() {
  if (state.library.workspaces.length <= 1) return;
  const currentId = activeWorkspace().id;
  state.library.workspaces = state.library.workspaces.filter(({ id }) => id !== currentId);
  state.library.active_workspace_id = state.library.workspaces[0].id;
  state.neighborhoodComparison = null; state.routes = null; clearDraftEditor(); persist();
  renderNeighborhoodComparison(); renderRouteComparison(); toast(translate('toast.deleted'));
}
function exportAllWorkspaces() {
  const text = exportWorkspaceLibrary(state.library, state.validNodeIds);
  downloadText('physmath-research-workspaces.json', `${text}\n`, 'application/json');
  toast(translate('toast.exported'));
}
async function importAllWorkspaces(file) {
  try {
    validateWorkspaceFile(file);
    const imported = importWorkspaceLibrary(await file.text(), state.validNodeIds);
    state.library = ui.importMode.value === 'replace'
      ? imported
      : mergeWorkspaceLibraries(state.library, imported, state.validNodeIds);
    persist(); toast(translate('toast.imported'));
  } catch (error) {
    console.error(error);
    toast(translate('toast.importFailed', { message: error instanceof Error ? error.message : String(error) }));
  } finally {
    ui.workspaceFile.value = '';
  }
}

function cycleTheme() {
  const themes = ['system', 'light', 'dark'];
  state.theme = themes[(themes.indexOf(state.theme) + 1) % themes.length];
  document.documentElement.dataset.theme = state.theme;
  savePreference('theme', state.theme);
  toast(translate('toast.theme', { value: state.theme }));
}
function bindEvents() {
  ui.language.addEventListener('change', () => {
    state.language = ui.language.value === 'es' ? 'es' : 'en'; savePreference('language', state.language); applyTranslations();
    buildNodeSelects(); renderWorkspace(); renderNeighborhoodComparison(); renderRouteComparison();
  });
  ui.theme.addEventListener('click', cycleTheme);
  ui.help.addEventListener('click', () => ui.helpDialog.showModal());
  ui.workspaceSelect.addEventListener('change', () => {
    state.library.active_workspace_id = ui.workspaceSelect.value; state.neighborhoodComparison = null; state.routes = null;
    clearDraftEditor(); persist(); renderNeighborhoodComparison(); renderRouteComparison();
  });
  ui.workspaceTitle.addEventListener('change', () => updateActive((workspace) => { workspace.title = ui.workspaceTitle.value.trim() || workspace.title; }));
  ui.newWorkspace.addEventListener('click', createNewWorkspace);
  ui.deleteWorkspace.addEventListener('click', () => ui.deleteDialog.showModal());
  ui.deleteDialog.addEventListener('close', () => { if (ui.deleteDialog.returnValue === 'confirm') deleteCurrentWorkspace(); });
  ui.exportWorkspaces.addEventListener('click', exportAllWorkspaces);
  ui.importWorkspaces.addEventListener('click', () => ui.workspaceFile.click());
  ui.workspaceFile.addEventListener('change', () => { const [file] = ui.workspaceFile.files; if (file) importAllWorkspaces(file); });
  ui.nodeSearch.addEventListener('input', renderSearchResults);
  ui.clearNodes.addEventListener('click', () => updateActive((workspace) => { workspace.node_ids = []; }));
  ui.compareNeighborhoods.addEventListener('click', compareNeighborhoods);
  ui.addNeighborhoodUnion.addEventListener('click', () => addNodes(state.neighborhoodComparison?.union ?? []));
  ui.compareRoutes.addEventListener('click', compareRoutes);
  ui.workspaceNotes.addEventListener('input', () => {
    clearTimeout(state.notesTimer);
    state.notesTimer = setTimeout(() => updateActive((workspace) => { workspace.notes = ui.workspaceNotes.value; }, { render: false }), 350);
  });
  ui.workspaceNotes.addEventListener('change', () => {
    clearTimeout(state.notesTimer);
    updateActive((workspace) => { workspace.notes = ui.workspaceNotes.value; }, { render: false });
  });
  ui.saveDraft.addEventListener('click', saveDraft);
  ui.clearDraft.addEventListener('click', clearDraftEditor);
  ui.saveNegative.addEventListener('click', saveNegativeResult);
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  try { await navigator.serviceWorker.register('./sw.js', { scope: './' }); }
  catch (error) { console.warn('Service worker registration failed:', error); }
}

init();
