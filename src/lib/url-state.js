// @ts-check

const RESEARCH_ROUTE_POLICIES = new Set(['shortest', 'balanced', 'strongest']);
const RESEARCH_EVIDENCE_GATES = new Set(['all', 'sourced', 'formal']);

/** @param {unknown} value */
function normalizedId(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

/** @param {unknown} value */
function normalizedFocus(value) {
  return value === 'path' || value === 'neighborhood' ? value : null;
}

/** @param {unknown} value */
function normalizedView(value) {
  return value === 'list' ? 'list' : 'graph';
}

/** @param {unknown} value */
function normalizedRoutePolicy(value) {
  return RESEARCH_ROUTE_POLICIES.has(String(value)) ? String(value) : 'shortest';
}

/** @param {unknown} value */
function normalizedEvidenceGate(value) {
  return RESEARCH_EVIDENCE_GATES.has(String(value)) ? String(value) : 'all';
}

/** Commit a URL without creating duplicate history entries. */
function commitUrl(url, mode, currentUrl, historyApi) {
  const current = new URL(currentUrl);
  const method = mode === 'push' && url.href !== current.href ? 'pushState' : 'replaceState';
  historyApi[method]({}, '', url);
}

export function readUrlState(url = new URL(window.location.href)) {
  const topic = normalizedId(url.searchParams.get('topic'));
  const focus = topic ? normalizedFocus(url.searchParams.get('focus')) : null;
  return {
    topic,
    focus,
    view: normalizedView(url.searchParams.get('view')),
  };
}

export function writeUrlState(
  state,
  mode = 'replace',
  currentUrl = window.location.href,
  historyApi = history,
) {
  const url = new URL(currentUrl);
  const topic = normalizedId(state.topic);
  const focus = topic ? normalizedFocus(state.focus) : null;
  if (topic) url.searchParams.set('topic', topic);
  else url.searchParams.delete('topic');
  if (focus) url.searchParams.set('focus', focus);
  else url.searchParams.delete('focus');
  if (normalizedView(state.view) === 'list') url.searchParams.set('view', 'list');
  else url.searchParams.delete('view');
  commitUrl(url, mode, currentUrl, historyApi);
  return url;
}

/** Read the research explorer's shareable state without validating graph IDs. */
export function readResearchUrlState(url = new URL(window.location.href)) {
  const source = normalizedId(url.searchParams.get('from'));
  const target = normalizedId(url.searchParams.get('to'));
  const route = source && target && source !== target ? {
    source,
    target,
    policy: normalizedRoutePolicy(url.searchParams.get('policy')),
    evidence: normalizedEvidenceGate(url.searchParams.get('evidence')),
    directed: url.searchParams.get('directed') === '1',
  } : null;
  return {
    collection: normalizedId(url.searchParams.get('collection')),
    node: normalizedId(url.searchParams.get('node')),
    view: normalizedView(url.searchParams.get('view')),
    route,
  };
}

/** Write research state while preserving campaign parameters, hashes and unrelated query data. */
export function writeResearchUrlState(
  state,
  mode = 'replace',
  currentUrl = window.location.href,
  historyApi = history,
) {
  const url = new URL(currentUrl);
  const collection = normalizedId(state.collection);
  const node = normalizedId(state.node);
  if (collection) url.searchParams.set('collection', collection);
  else url.searchParams.delete('collection');
  if (node) url.searchParams.set('node', node);
  else url.searchParams.delete('node');
  if (normalizedView(state.view) === 'list') url.searchParams.set('view', 'list');
  else url.searchParams.delete('view');

  const source = normalizedId(state.route?.source);
  const target = normalizedId(state.route?.target);
  if (source && target && source !== target) {
    const policy = normalizedRoutePolicy(state.route?.policy);
    const evidence = normalizedEvidenceGate(state.route?.evidence);
    url.searchParams.set('from', source);
    url.searchParams.set('to', target);
    if (policy !== 'shortest') url.searchParams.set('policy', policy);
    else url.searchParams.delete('policy');
    if (evidence !== 'all') url.searchParams.set('evidence', evidence);
    else url.searchParams.delete('evidence');
    if (state.route?.directed === true) url.searchParams.set('directed', '1');
    else url.searchParams.delete('directed');
  } else {
    for (const key of ['from', 'to', 'policy', 'evidence', 'directed']) url.searchParams.delete(key);
  }
  commitUrl(url, mode, currentUrl, historyApi);
  return url;
}
