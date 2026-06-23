// @ts-check

/** @param {unknown} value */
function normalizedTopic(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

/** @param {unknown} value */
function normalizedFocus(value) {
  return value === 'path' || value === 'neighborhood' ? value : null;
}

export function readUrlState(url = new URL(window.location.href)) {
  const topic = normalizedTopic(url.searchParams.get('topic'));
  const focus = topic ? normalizedFocus(url.searchParams.get('focus')) : null;
  return {
    topic,
    focus,
    view: url.searchParams.get('view') === 'list' ? 'list' : 'graph',
  };
}

export function writeUrlState(
  state,
  mode = 'replace',
  currentUrl = window.location.href,
  historyApi = history,
) {
  const url = new URL(currentUrl);
  const topic = normalizedTopic(state.topic);
  const focus = topic ? normalizedFocus(state.focus) : null;
  if (topic) url.searchParams.set('topic', topic);
  else url.searchParams.delete('topic');
  if (focus) url.searchParams.set('focus', focus);
  else url.searchParams.delete('focus');
  if (state.view === 'list') url.searchParams.set('view', 'list');
  else url.searchParams.delete('view');
  historyApi[mode === 'push' ? 'pushState' : 'replaceState']({}, '', url);
  return url;
}
