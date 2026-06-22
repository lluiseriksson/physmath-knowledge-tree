import {
  connectedNeighborhood,
  createResearchLayout,
  indexById,
  inducedSubgraph,
  searchNodes,
  shortestPath,
} from './lib/research-graph.js';
import { detectLanguage, supportedLanguage, t, translateDocument } from './lib/research-i18n.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const STORAGE_PREFIX = 'physmath.research.';
const KIND_ORDER = ['domain', 'bridge', 'problem'];
const CONFIDENCE_ORDER = ['formal', 'literature', 'heuristic', 'speculative'];

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
/** @param {string} name @param {Record<string,string|number>} [attributes] */
function svgElement(name, attributes = {}) {
  const result = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) result.setAttribute(key, String(value));
  return result;
}

const ui = {
  loading: byId('loading'),
  shell: byId('app-shell'),
  panel: byId('control-panel'),
  openPanel: byId('open-panel'),
  closePanel: byId('close-panel'),
  language: byId('language'),
  theme: byId('theme'),
  help: byId('help'),
  shortcuts: byId('shortcuts'),
  search: byId('search'),
  searchResults: byId('search-results'),
  collection: byId('collection'),
  clearView: byId('clear-view'),
  kindFilters: byId('kind-filters'),
  confidenceFilters: byId('confidence-filters'),
  pathSource: byId('path-source'),
  pathTarget: byId('path-target'),
  pathDirected: byId('path-directed'),
  findPath: byId('find-path'),
  clearPath: byId('clear-path'),
  pathResult: byId('path-result'),
  move: byId('move'),
  moveTarget: byId('move-target'),
  generateCard: byId('generate-card'),
  exportVisible: byId('export-visible'),
  graphViewButton: byId('graph-view-button'),
  listViewButton: byId('list-view-button'),
  visibleSummary: byId('visible-summary'),
  graphControls: byId('graph-controls'),
  zoomOut: byId('zoom-out'),
  zoomIn: byId('zoom-in'),
  fit: byId('fit'),
  graphStage: byId('graph-stage'),
  graph: byId('graph'),
  viewport: byId('viewport'),
  edgeLayer: byId('edge-layer'),
  nodeLayer: byId('node-layer'),
  graphEmpty: byId('graph-empty'),
  listView: byId('list-view'),
  details: byId('details'),
  detailEyebrow: byId('detail-eyebrow'),
  detailTitle: byId('detail-title'),
  detailContent: byId('detail-content'),
  closeDetails: byId('close-details'),
  cardDialog: byId('bridge-card-dialog'),
  cardOutput: byId('bridge-card-output'),
  downloadCard: byId('download-card'),
  copyCard: byId('copy-card'),
  toasts: byId('toasts'),
};

const state = {
  language: detectLanguage(),
  theme: readSetting('theme', 'system'),
  nodes: [],
  edges: [],
  moves: [],
  collections: [],
  nodeById: new Map(),
  edgeById: new Map(),
  moveById: new Map(),
  collectionById: new Map(),
  layout: null,
  visible: { nodes: [], edges: [] },
  activeKinds: new Set(KIND_ORDER),
  activeConfidences: new Set(CONFIDENCE_ORDER),
  collection: '',
  selectedNode: '',
  path: null,
  view: 'graph',
  transform: { x: 0, y: 0, scale: 1 },
  panning: null,
  cardMarkdown: '',
};

function readSetting(key, fallback) {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${key}`) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveSetting(key, value) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
  } catch {
    // The app remains functional when persistent storage is blocked.
  }
}

function translate(key, variables = {}) {
  return t(state.language, key, variables);
}

function applyTranslations() {
  translateDocument(state.language);
  ui.language.value = state.language;
  ui.theme.setAttribute('aria-label', state.language === 'es' ? 'Cambiar tema' : 'Change theme');
  ui.openPanel.setAttribute('aria-label', state.language === 'es' ? 'Abrir controles' : 'Open controls');
  ui.closePanel.setAttribute('aria-label', state.language === 'es' ? 'Cerrar controles' : 'Close controls');
  ui.closeDetails.setAttribute('aria-label', state.language === 'es' ? 'Cerrar detalles' : 'Close details');
  document.title = state.language === 'es'
    ? 'PhysMath Knowledge Tree — Grafo de investigación'
    : 'PhysMath Knowledge Tree — Research graph';
}

async function loadJson(path) {
  const response = await fetch(path, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}

async function init() {
  document.documentElement.dataset.theme = state.theme;
  applyTranslations();
  try {
    const [nodes, edges, moves, collections] = await Promise.all([
      loadJson('./graph/nodes/core.json'),
      loadJson('./graph/edges.json'),
      loadJson('./graph/research_moves.json'),
      loadJson('./graph/collections.json'),
    ]);
    state.nodes = nodes;
    state.edges = edges;
    state.moves = moves;
    state.collections = collections;
    state.nodeById = indexById(nodes);
    state.edgeById = indexById(edges);
    state.moveById = indexById(moves);
    state.collectionById = indexById(collections);
    state.layout = createResearchLayout(nodes, edges);

    hydrateUrlState();
    buildControls();
    bindEvents();
    renderAll();
    ui.loading.hidden = true;
    ui.shell.hidden = false;
    requestAnimationFrame(() => fitGraph());
    registerServiceWorker();
  } catch (error) {
    console.error(error);
    showLoadError(error);
  }
}

function showLoadError(error) {
  const wrapper = element('div');
  const title = element('strong');
  title.textContent = translate('error.title');
  const body = element('p');
  body.textContent = translate('error.body');
  const technical = element('code');
  technical.textContent = error instanceof Error ? error.message : String(error);
  wrapper.append(title, body, technical);
  ui.loading.replaceChildren(wrapper);
  ui.loading.classList.add('load-error');
}

function hydrateUrlState() {
  const params = new URLSearchParams(location.search);
  const collection = params.get('collection');
  if (collection && state.collectionById.has(collection)) state.collection = collection;
  const node = params.get('node');
  if (node && state.nodeById.has(node)) state.selectedNode = node;
  const view = params.get('view');
  if (view === 'list' || view === 'graph') state.view = view;
}

function syncUrl() {
  const params = new URLSearchParams();
  if (state.collection) params.set('collection', state.collection);
  if (state.selectedNode) params.set('node', state.selectedNode);
  if (state.view !== 'graph') params.set('view', state.view);
  const query = params.toString();
  history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
}

function buildControls() {
  buildCollectionOptions();
  buildFilterControls();
  buildNodeSelect(ui.pathSource);
  buildNodeSelect(ui.pathTarget);
  buildNodeSelect(ui.moveTarget);
  buildMoveOptions();

  ui.collection.value = state.collection;
  const problems = state.nodes.filter((node) => node.kind === 'problem');
  ui.pathSource.value = problems.find((node) => node.id === 'problem.riemann_hypothesis')?.id ?? state.nodes[0]?.id ?? '';
  ui.pathTarget.value = problems.find((node) => node.id === 'problem.p_vs_np')?.id ?? state.nodes[1]?.id ?? '';
  ui.moveTarget.value = problems[0]?.id ?? state.nodes[0]?.id ?? '';
  ui.move.value = state.moves[0]?.id ?? '';
}

function buildCollectionOptions() {
  const fragment = document.createDocumentFragment();
  const all = element('option', { value: '' });
  all.textContent = translate('collections.all');
  fragment.append(all);
  for (const collection of state.collections) {
    const option = element('option', { value: collection.id });
    option.textContent = collection.title;
    fragment.append(option);
  }
  ui.collection.replaceChildren(fragment);
}

function buildNodeSelect(select) {
  const fragment = document.createDocumentFragment();
  for (const kind of KIND_ORDER) {
    const group = element('optgroup', { label: translate(`kind.${kind}`) });
    for (const node of state.nodes.filter((item) => item.kind === kind).sort((a, b) => a.title.localeCompare(b.title))) {
      const option = element('option', { value: node.id });
      option.textContent = node.title;
      group.append(option);
    }
    fragment.append(group);
  }
  select.replaceChildren(fragment);
}

function buildMoveOptions() {
  const fragment = document.createDocumentFragment();
  for (const move of state.moves) {
    const option = element('option', { value: move.id });
    option.textContent = move.title;
    fragment.append(option);
  }
  ui.move.replaceChildren(fragment);
}

function buildFilterControls() {
  const kindFragment = document.createDocumentFragment();
  for (const kind of KIND_ORDER) {
    kindFragment.append(createFilterChip('kind', kind, state.activeKinds.has(kind)));
  }
  ui.kindFilters.replaceChildren(kindFragment);

  const confidenceFragment = document.createDocumentFragment();
  for (const confidence of CONFIDENCE_ORDER) {
    confidenceFragment.append(createFilterChip('confidence', confidence, state.activeConfidences.has(confidence)));
  }
  ui.confidenceFilters.replaceChildren(confidenceFragment);
}

function createFilterChip(group, value, checked) {
  const label = element('label', { class: 'filter-chip' });
  const input = element('input', { type: 'checkbox', value, 'data-filter-group': group });
  input.checked = checked;
  const span = element('span');
  const dot = element('i');
  dot.className = value;
  span.append(dot, document.createTextNode(translate(`${group === 'kind' ? 'kind' : 'confidence'}.${value}`)));
  label.append(input, span);
  return label;
}

function bindEvents() {
  ui.language.addEventListener('change', () => {
    state.language = supportedLanguage(ui.language.value);
    saveSetting('language', state.language);
    applyTranslations();
    buildControlsPreservingValues();
    renderAll();
  });
  ui.theme.addEventListener('click', cycleTheme);
  ui.help.addEventListener('click', () => ui.shortcuts.showModal());
  ui.openPanel.addEventListener('click', () => ui.panel.classList.add('open'));
  ui.closePanel.addEventListener('click', () => ui.panel.classList.remove('open'));

  ui.search.addEventListener('input', renderSearchResults);
  ui.search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const first = searchNodes(state.nodes, ui.search.value, 1)[0];
      if (first) revealNode(first.node.id);
    }
  });

  ui.collection.addEventListener('change', () => {
    state.collection = ui.collection.value;
    state.path = null;
    renderAll(true);
    syncUrl();
  });
  ui.clearView.addEventListener('click', resetView);
  ui.kindFilters.addEventListener('change', handleFilterChange);
  ui.confidenceFilters.addEventListener('change', handleFilterChange);

  ui.findPath.addEventListener('click', findSelectedPath);
  ui.clearPath.addEventListener('click', clearPath);
  ui.generateCard.addEventListener('click', generateBridgeCard);
  ui.downloadCard.addEventListener('click', () => downloadText('bridge-card.md', state.cardMarkdown, 'text/markdown'));
  ui.copyCard.addEventListener('click', copyBridgeCard);
  ui.exportVisible.addEventListener('click', exportVisibleSubgraph);

  ui.graphViewButton.addEventListener('click', () => setView('graph'));
  ui.listViewButton.addEventListener('click', () => setView('list'));
  ui.zoomIn.addEventListener('click', () => zoomBy(1.2));
  ui.zoomOut.addEventListener('click', () => zoomBy(1 / 1.2));
  ui.fit.addEventListener('click', fitGraph);
  ui.closeDetails.addEventListener('click', closeDetails);

  ui.graph.addEventListener('wheel', handleWheel, { passive: false });
  ui.graph.addEventListener('pointerdown', startPan);
  ui.graph.addEventListener('pointermove', movePan);
  ui.graph.addEventListener('pointerup', endPan);
  ui.graph.addEventListener('pointercancel', endPan);
  window.addEventListener('resize', () => requestAnimationFrame(fitGraph));
  document.addEventListener('keydown', handleKeyboard);
}

function buildControlsPreservingValues() {
  const values = {
    collection: ui.collection.value,
    pathSource: ui.pathSource.value,
    pathTarget: ui.pathTarget.value,
    move: ui.move.value,
    moveTarget: ui.moveTarget.value,
  };
  buildCollectionOptions();
  buildFilterControls();
  buildNodeSelect(ui.pathSource);
  buildNodeSelect(ui.pathTarget);
  buildNodeSelect(ui.moveTarget);
  buildMoveOptions();
  ui.collection.value = values.collection;
  ui.pathSource.value = values.pathSource;
  ui.pathTarget.value = values.pathTarget;
  ui.move.value = values.move;
  ui.moveTarget.value = values.moveTarget;
}

function handleFilterChange(event) {
  const input = event.target.closest('input[data-filter-group]');
  if (!input) return;
  const set = input.dataset.filterGroup === 'kind' ? state.activeKinds : state.activeConfidences;
  if (input.checked) set.add(input.value);
  else set.delete(input.value);
  renderAll(true);
}

function resetView() {
  state.collection = '';
  state.path = null;
  state.activeKinds = new Set(KIND_ORDER);
  state.activeConfidences = new Set(CONFIDENCE_ORDER);
  ui.collection.value = '';
  ui.pathResult.replaceChildren();
  buildFilterControls();
  renderAll(true);
  syncUrl();
}

function getVisibleSubgraph() {
  const collectionNodeIds = state.collection
    ? new Set(state.collectionById.get(state.collection)?.nodes ?? [])
    : new Set(state.nodes.map((node) => node.id));

  const visibleIds = new Set(
    state.nodes
      .filter((node) => collectionNodeIds.has(node.id))
      .filter((node) => state.activeKinds.has(node.kind))
      .filter((node) => state.activeConfidences.has(node.confidence))
      .map((node) => node.id),
  );

  if (state.path) for (const id of state.path.nodes) visibleIds.add(id);
  if (state.selectedNode && state.nodeById.has(state.selectedNode)) visibleIds.add(state.selectedNode);
  return inducedSubgraph(state.nodes, state.edges, visibleIds);
}

function renderAll(shouldFit = false) {
  state.visible = getVisibleSubgraph();
  ui.visibleSummary.textContent = translate('view.summary', {
    nodes: state.visible.nodes.length,
    edges: state.visible.edges.length,
  });
  renderGraph();
  renderList();
  renderPathResult();
  updateViewVisibility();
  if (state.selectedNode) renderDetails(state.selectedNode);
  if (shouldFit && state.view === 'graph') requestAnimationFrame(fitGraph);
}

function renderSearchResults() {
  const query = ui.search.value.trim();
  if (!query) {
    ui.searchResults.replaceChildren();
    return;
  }
  const matches = searchNodes(state.nodes, query, 8);
  const fragment = document.createDocumentFragment();
  if (matches.length === 0) {
    const message = element('small');
    message.textContent = translate('search.none');
    fragment.append(message);
  }
  for (const { node } of matches) {
    const button = element('button', { type: 'button', class: 'search-result' });
    const dot = element('i', { class: node.kind });
    const text = element('span');
    const title = element('strong');
    title.textContent = node.title;
    const meta = element('small');
    meta.textContent = `${translate(`kind.${node.kind}`)} · ${translate(`confidence.${node.confidence}`)}`;
    text.append(title, meta);
    button.append(dot, text);
    button.addEventListener('click', () => revealNode(node.id));
    fragment.append(button);
  }
  ui.searchResults.replaceChildren(fragment);
}

function revealNode(nodeId) {
  const node = state.nodeById.get(nodeId);
  if (!node) return;
  state.collection = '';
  ui.collection.value = '';
  state.activeKinds.add(node.kind);
  state.activeConfidences.add(node.confidence);
  buildFilterControls();
  selectNode(nodeId);
  renderAll();
  ui.search.value = '';
  ui.searchResults.replaceChildren();
  ui.panel.classList.remove('open');
  requestAnimationFrame(() => centerNode(nodeId));
}

function renderGraph() {
  const pathNodes = new Set(state.path?.nodes ?? []);
  const pathEdges = new Set(state.path?.edges ?? []);
  const selectedNeighborhood = state.selectedNode
    ? connectedNeighborhood(state.nodes, state.edges, state.selectedNode, 1)
    : new Set();

  const edgeFragment = document.createDocumentFragment();
  for (const edge of state.visible.edges) {
    const source = state.layout.positions.get(edge.source);
    const target = state.layout.positions.get(edge.target);
    if (!source || !target) continue;
    const line = svgElement('line', {
      x1: source.x,
      y1: source.y,
      x2: target.x,
      y2: target.y,
      class: `graph-edge ${edge.confidence}`,
      'data-edge-id': edge.id,
    });
    if (state.path && !pathEdges.has(edge.id)) line.classList.add('dimmed');
    if (pathEdges.has(edge.id)) line.classList.add('highlighted');
    if (!state.path && state.selectedNode && !(edge.source === state.selectedNode || edge.target === state.selectedNode)) {
      line.classList.add('dimmed');
    }
    const title = svgElement('title');
    title.textContent = `${edge.relation}: ${edge.mechanism}`;
    line.append(title);
    edgeFragment.append(line);
  }

  const nodeFragment = document.createDocumentFragment();
  for (const node of state.visible.nodes) {
    const point = state.layout.positions.get(node.id);
    if (!point) continue;
    const group = svgElement('g', {
      class: `graph-node ${node.kind}`,
      transform: `translate(${point.x} ${point.y})`,
      tabindex: '0',
      role: 'button',
      'aria-label': `${node.title}. ${translate(`kind.${node.kind}`)}. ${translate(`confidence.${node.confidence}`)}.`,
      'data-node-id': node.id,
    });
    if (node.id === state.selectedNode) group.classList.add('selected');
    if (pathNodes.has(node.id)) group.classList.add('highlighted');
    if (state.path && !pathNodes.has(node.id)) group.classList.add('dimmed');
    if (!state.path && state.selectedNode && !selectedNeighborhood.has(node.id)) group.classList.add('dimmed');

    const card = svgElement('rect', { class: 'node-card', x: -88, y: -31, width: 176, height: 62, rx: 12 });
    const title = svgElement('text', { class: 'node-title', x: -70, y: -7 });
    const titleLines = wrapTitle(node.title, 23);
    titleLines.slice(0, 2).forEach((line, index) => {
      const tspan = svgElement('tspan', { x: -70, dy: index === 0 ? 0 : 15 });
      tspan.textContent = line;
      title.append(tspan);
    });
    const meta = svgElement('text', { class: 'node-meta', x: -70, y: 21 });
    meta.textContent = translate(`kind.${node.kind}`);
    const confidence = svgElement('circle', {
      class: `confidence-dot ${node.confidence}`,
      cx: 70,
      cy: -17,
      r: 5,
    });
    group.append(card, title, meta, confidence);
    group.addEventListener('click', (event) => {
      event.stopPropagation();
      selectNode(node.id);
    });
    group.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectNode(node.id);
      }
    });
    nodeFragment.append(group);
  }
  ui.edgeLayer.replaceChildren(edgeFragment);
  ui.nodeLayer.replaceChildren(nodeFragment);
  ui.graphEmpty.hidden = state.visible.nodes.length > 0;
  applyTransform();
}

function wrapTitle(title, maxLength) {
  const words = title.split(/\s+/);
  const lines = [''];
  for (const word of words) {
    const current = lines[lines.length - 1];
    if (!current || `${current} ${word}`.length <= maxLength) lines[lines.length - 1] = current ? `${current} ${word}` : word;
    else lines.push(word);
  }
  if (lines.length > 2) {
    lines[1] = `${lines.slice(1).join(' ').slice(0, maxLength - 1).trim()}…`;
    return lines.slice(0, 2);
  }
  return lines;
}

function renderList() {
  const grid = element('div', { class: 'node-list-grid' });
  for (const node of [...state.visible.nodes].sort((a, b) => a.kind.localeCompare(b.kind) || a.title.localeCompare(b.title))) {
    const article = element('article', { class: `node-list-card ${node.kind}` });
    const heading = element('h3');
    const button = element('button', { type: 'button', class: 'text-button' });
    button.textContent = node.title;
    button.addEventListener('click', () => selectNode(node.id));
    heading.append(button);
    const summary = element('p');
    summary.textContent = node.summary;
    const meta = element('div', { class: 'card-meta' });
    meta.append(createBadge(translate(`kind.${node.kind}`), node.kind));
    meta.append(createBadge(translate(`confidence.${node.confidence}`), node.confidence));
    if (node.status) meta.append(createBadge(translate(`status.${node.status}`), ''));
    const tags = element('div', { class: 'tags' });
    for (const tag of node.tags.slice(0, 5)) {
      const chip = element('span', { class: 'tag' });
      chip.textContent = tag;
      tags.append(chip);
    }
    article.append(heading, meta, summary, tags);
    grid.append(article);
  }
  if (state.visible.nodes.length === 0) {
    const empty = element('div', { class: 'empty-state' });
    const title = element('strong');
    title.textContent = translate('empty.title');
    const body = element('p');
    body.textContent = translate('empty.body');
    empty.append(title, body);
    ui.listView.replaceChildren(empty);
  } else {
    ui.listView.replaceChildren(grid);
  }
}

function createBadge(text, className) {
  const badge = element('span', { class: `badge ${className}`.trim() });
  badge.textContent = text;
  return badge;
}

function selectNode(nodeId, sync = true) {
  if (!state.nodeById.has(nodeId)) return;
  state.selectedNode = nodeId;
  renderDetails(nodeId);
  renderGraph();
  if (sync) syncUrl();
}

function closeDetails() {
  state.selectedNode = '';
  ui.details.classList.remove('open');
  ui.details.setAttribute('aria-hidden', 'true');
  renderGraph();
  syncUrl();
}

function renderDetails(nodeId) {
  const node = state.nodeById.get(nodeId);
  if (!node) return;
  ui.detailEyebrow.textContent = `${translate(`kind.${node.kind}`)} · ${translate(`confidence.${node.confidence}`)}`;
  ui.detailTitle.textContent = node.title;
  const content = document.createDocumentFragment();
  const summary = element('p');
  summary.textContent = node.summary;
  content.append(summary);

  const meta = element('div', { class: 'badges' });
  meta.append(createBadge(translate(`kind.${node.kind}`), node.kind));
  meta.append(createBadge(translate(`confidence.${node.confidence}`), node.confidence));
  if (node.status) meta.append(createBadge(translate(`status.${node.status}`), ''));
  content.append(meta);

  if (node.tags?.length) {
    const section = detailSection(translate('detail.tags'));
    const tags = element('div', { class: 'tags' });
    for (const tag of node.tags) {
      const chip = element('span', { class: 'tag' });
      chip.textContent = tag;
      tags.append(chip);
    }
    section.append(tags);
    content.append(section);
  }

  if (node.questions?.length) {
    const section = detailSection(translate('detail.questions'));
    section.append(stringList(node.questions));
    content.append(section);
  }

  if (node.lean) {
    const section = detailSection(translate('detail.lean'));
    appendCodeGroup(section, translate('detail.imports'), node.lean.imports ?? []);
    appendCodeGroup(section, translate('detail.declarations'), node.lean.declarations ?? []);
    if (node.lean.targets?.length) {
      const heading = element('h4');
      heading.textContent = translate('detail.targets');
      section.append(heading, stringList(node.lean.targets));
    }
    content.append(section);
  }

  const incoming = state.edges.filter((edge) => edge.target === node.id);
  const outgoing = state.edges.filter((edge) => edge.source === node.id);
  if (incoming.length || outgoing.length) {
    const section = detailSection(translate('detail.connections'));
    if (incoming.length) section.append(connectionGroup(translate('detail.incoming'), incoming, 'source'));
    if (outgoing.length) section.append(connectionGroup(translate('detail.outgoing'), outgoing, 'target'));
    content.append(section);
  }

  if (node.references?.length) {
    const section = detailSection(translate('detail.references'));
    const list = element('ul');
    for (const reference of node.references) {
      const item = element('li');
      const link = element('a', { class: 'reference-link', href: reference.url, target: '_blank', rel: 'noreferrer' });
      link.textContent = reference.label;
      item.append(link);
      list.append(item);
    }
    section.append(list);
    content.append(section);
  }

  ui.detailContent.replaceChildren(content);
  ui.details.classList.add('open');
  ui.details.setAttribute('aria-hidden', 'false');
}

function detailSection(title) {
  const section = element('section', { class: 'detail-section' });
  const heading = element('h3');
  heading.textContent = title;
  section.append(heading);
  return section;
}

function stringList(items) {
  const list = element('ul');
  for (const value of items) {
    const item = element('li');
    item.textContent = value;
    list.append(item);
  }
  return list;
}

function appendCodeGroup(section, title, values) {
  if (!values.length) return;
  const heading = element('h4');
  heading.textContent = title;
  const list = element('div', { class: 'code-list' });
  for (const value of values) {
    const code = element('code');
    code.textContent = value;
    list.append(code);
  }
  section.append(heading, list);
}

function connectionGroup(title, edges, otherEndpoint) {
  const wrapper = element('div');
  const heading = element('h4');
  heading.textContent = title;
  const list = element('div', { class: 'edge-list' });
  for (const edge of edges.sort((a, b) => a.relation.localeCompare(b.relation))) {
    const other = state.nodeById.get(edge[otherEndpoint]);
    const button = element('button', { type: 'button', class: 'edge-item' });
    const label = element('strong');
    label.textContent = `${translate(`relation.${edge.relation}`)} · ${other?.title ?? edge[otherEndpoint]}`;
    const mechanism = element('small');
    mechanism.textContent = edge.mechanism;
    button.append(label, mechanism);
    button.addEventListener('click', () => selectNode(edge[otherEndpoint]));
    list.append(button);
  }
  wrapper.append(heading, list);
  return wrapper;
}

function findSelectedPath() {
  const source = ui.pathSource.value;
  const target = ui.pathTarget.value;
  if (!source || !target || source === target) {
    state.path = null;
    ui.pathResult.textContent = translate('path.choose');
    renderAll(true);
    return;
  }
  state.path = shortestPath(state.nodes, state.edges, source, target, ui.pathDirected.checked);
  renderAll(true);
  if (!state.path) {
    ui.pathResult.textContent = translate('path.none');
    return;
  }
  if (state.path) {
    state.collection = '';
    ui.collection.value = '';
    renderAll(true);
  }
}

function clearPath() {
  state.path = null;
  ui.pathResult.replaceChildren();
  renderAll();
}

function renderPathResult() {
  if (!state.path) return;
  const fragment = document.createDocumentFragment();
  const summary = element('strong');
  summary.textContent = translate('path.steps', { count: state.path.edges.length });
  const list = element('ol');
  for (const nodeId of state.path.nodes) {
    const item = element('li');
    const button = element('button', { type: 'button', class: 'text-button' });
    button.textContent = state.nodeById.get(nodeId)?.title ?? nodeId;
    button.addEventListener('click', () => selectNode(nodeId));
    item.append(button);
    list.append(item);
  }
  fragment.append(summary, list);
  ui.pathResult.replaceChildren(fragment);
}

function generateBridgeCard() {
  const move = state.moveById.get(ui.move.value);
  const target = state.nodeById.get(ui.moveTarget.value);
  if (!move || !target) return;
  const incident = state.edges.filter((edge) => edge.source === target.id || edge.target === target.id);
  const sources = [];
  for (const edge of incident) {
    const otherId = edge.source === target.id ? edge.target : edge.source;
    const other = state.nodeById.get(otherId);
    if (other && !sources.some((node) => node.id === other.id)) sources.push(other);
  }
  sources.sort((a, b) => {
    const kindRank = { domain: 0, bridge: 1, problem: 2 };
    return kindRank[a.kind] - kindRank[b.kind] || a.title.localeCompare(b.title);
  });
  const chosen = sources.slice(0, 3);
  const sourceText = chosen.length
    ? chosen.map((node) => `${node.title} (\`${node.id}\`)`).join(', ')
    : 'No canonical adjacent source selected; begin with a radius-2 retrieval.';
  const evidence = incident.slice(0, 4).map((edge) => `- ${edge.confidence}: ${edge.mechanism}`).join('\n') || '- No direct canonical edge; treat this as exploratory.';
  const leanTargets = [...(target.lean?.targets ?? []), move.lean_test].filter(Boolean);
  const risks = move.risks.map((risk) => `- ${risk}`).join('\n');
  const markdown = `# Bridge Card: ${move.title} → ${target.title}\n\n` +
    `> Generated scaffold, not a mathematical claim. Validate every step against primary literature and formal definitions.\n\n` +
    `- **Target node:** ${target.title} (\`${target.id}\`)\n` +
    `- **Source nodes:** ${sourceText}\n` +
    `- **Research move:** ${move.title} (\`${move.id}\`)\n` +
    `- **Current evidence label:** exploratory; inherit no stronger confidence than the cited canonical edges\n\n` +
    `## Mechanism\n\nApply “${move.description}” to ${target.title}. The expected output is ${move.output}.\n\n` +
    `## Canonical evidence nearby\n\n${evidence}\n\n` +
    `## Possible payoff\n\nA small, testable representation of the target obstruction in the language produced by this move.\n\n` +
    `## Falsifiers and risks\n\n${risks}\n\n` +
    `## Lean target\n\n${leanTargets.map((value) => `- ${value}`).join('\n')}\n\n` +
    `## Next computation\n\nConstruct the smallest finite example that preserves one stated mechanism; record both positive and negative results in the graph.\n`;
  state.cardMarkdown = markdown;
  ui.cardOutput.value = markdown;
  ui.cardDialog.showModal();
}

async function copyBridgeCard() {
  try {
    await navigator.clipboard.writeText(state.cardMarkdown);
  } catch {
    ui.cardOutput.focus();
    ui.cardOutput.select();
    document.execCommand('copy');
  }
  toast(translate('moves.copied'));
}

function exportVisibleSubgraph() {
  const payload = {
    exported_at: new Date().toISOString(),
    source: 'PhysMath Knowledge Tree research explorer',
    filters: {
      collection: state.collection || null,
      kinds: [...state.activeKinds].sort(),
      confidence: [...state.activeConfidences].sort(),
    },
    nodes: state.visible.nodes,
    edges: state.visible.edges,
  };
  downloadText('physmath-visible-subgraph.json', `${JSON.stringify(payload, null, 2)}\n`, 'application/json');
  toast(translate('export.saved'));
}

function downloadText(filename, text, type) {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = element('a', { href: url, download: filename });
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function toast(message) {
  const item = element('div', { class: 'toast' });
  item.textContent = message;
  ui.toasts.append(item);
  setTimeout(() => item.remove(), 2800);
}

function setView(view) {
  state.view = view === 'list' ? 'list' : 'graph';
  updateViewVisibility();
  syncUrl();
  if (state.view === 'graph') requestAnimationFrame(fitGraph);
}

function updateViewVisibility() {
  const graphMode = state.view === 'graph';
  ui.graphViewButton.setAttribute('aria-pressed', String(graphMode));
  ui.listViewButton.setAttribute('aria-pressed', String(!graphMode));
  ui.graphStage.hidden = !graphMode;
  ui.graphControls.hidden = !graphMode;
  ui.listView.hidden = graphMode;
}

function applyTransform() {
  const { x, y, scale } = state.transform;
  ui.viewport.setAttribute('transform', `translate(${x} ${y}) scale(${scale})`);
}

function visibleBounds() {
  const points = state.visible.nodes.map((node) => state.layout.positions.get(node.id)).filter(Boolean);
  if (!points.length) return null;
  return {
    minX: Math.min(...points.map((point) => point.x)) - 110,
    maxX: Math.max(...points.map((point) => point.x)) + 110,
    minY: Math.min(...points.map((point) => point.y)) - 70,
    maxY: Math.max(...points.map((point) => point.y)) + 70,
  };
}

function fitGraph() {
  if (state.view !== 'graph') return;
  const bounds = visibleBounds();
  const rect = ui.graph.getBoundingClientRect();
  if (!bounds || rect.width <= 0 || rect.height <= 0) return;
  const contentWidth = Math.max(1, bounds.maxX - bounds.minX);
  const contentHeight = Math.max(1, bounds.maxY - bounds.minY);
  const scale = Math.min(1.35, Math.max(0.22, Math.min((rect.width - 50) / contentWidth, (rect.height - 50) / contentHeight)));
  state.transform.scale = scale;
  state.transform.x = rect.width / 2 - ((bounds.minX + bounds.maxX) / 2) * scale;
  state.transform.y = rect.height / 2 - ((bounds.minY + bounds.maxY) / 2) * scale;
  applyTransform();
}

function centerNode(nodeId) {
  const point = state.layout.positions.get(nodeId);
  const rect = ui.graph.getBoundingClientRect();
  if (!point || rect.width <= 0 || rect.height <= 0) return;
  state.transform.scale = Math.max(0.9, state.transform.scale);
  state.transform.x = rect.width / 2 - point.x * state.transform.scale;
  state.transform.y = rect.height / 2 - point.y * state.transform.scale;
  applyTransform();
}

function zoomBy(factor, clientPoint = null) {
  const rect = ui.graph.getBoundingClientRect();
  const px = clientPoint ? clientPoint.x - rect.left : rect.width / 2;
  const py = clientPoint ? clientPoint.y - rect.top : rect.height / 2;
  const oldScale = state.transform.scale;
  const newScale = Math.min(2.8, Math.max(0.18, oldScale * factor));
  const worldX = (px - state.transform.x) / oldScale;
  const worldY = (py - state.transform.y) / oldScale;
  state.transform.scale = newScale;
  state.transform.x = px - worldX * newScale;
  state.transform.y = py - worldY * newScale;
  applyTransform();
}

function handleWheel(event) {
  event.preventDefault();
  zoomBy(Math.exp(-event.deltaY * 0.0013), { x: event.clientX, y: event.clientY });
}

function startPan(event) {
  if (event.target.closest?.('.graph-node')) return;
  state.panning = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  ui.graph.setPointerCapture(event.pointerId);
  ui.graph.classList.add('panning');
}

function movePan(event) {
  if (!state.panning || state.panning.pointerId !== event.pointerId) return;
  state.transform.x += event.clientX - state.panning.x;
  state.transform.y += event.clientY - state.panning.y;
  state.panning.x = event.clientX;
  state.panning.y = event.clientY;
  applyTransform();
}

function endPan(event) {
  if (!state.panning || state.panning.pointerId !== event.pointerId) return;
  state.panning = null;
  ui.graph.classList.remove('panning');
  if (ui.graph.hasPointerCapture(event.pointerId)) ui.graph.releasePointerCapture(event.pointerId);
}

function cycleTheme() {
  const choices = ['system', 'light', 'dark'];
  const next = choices[(choices.indexOf(state.theme) + 1) % choices.length];
  state.theme = next;
  document.documentElement.dataset.theme = next;
  saveSetting('theme', next);
  const label = state.language === 'es' ? `Tema: ${next}` : `Theme: ${next}`;
  toast(label);
}

function handleKeyboard(event) {
  const target = event.target;
  const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
  if (event.key === 'Escape') {
    if (ui.details.classList.contains('open')) closeDetails();
    else if (ui.search.value) {
      ui.search.value = '';
      ui.searchResults.replaceChildren();
    }
    ui.panel.classList.remove('open');
    return;
  }
  if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.key === '/') {
    event.preventDefault();
    ui.search.focus();
  } else if (event.key.toLowerCase() === 'f') fitGraph();
  else if (event.key.toLowerCase() === 'g') setView('graph');
  else if (event.key.toLowerCase() === 'l') setView('list');
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  try {
    await navigator.serviceWorker.register('./sw.js', { scope: './' });
  } catch (error) {
    console.warn('Service worker registration failed:', error);
  }
}

init();
