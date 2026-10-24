export const READING_STATES = new Set([
  'catalogued', 'abstract_read', 'announcement_read', 'readme_read',
  'selected_sections_read', 'own_proof_previously_audited',
]);

function requireCondition(value, message) {
  if (!value) throw new Error(message);
}

function uniqueIds(items, label) {
  const ids = items.map((item) => item.id);
  requireCondition(ids.every((id) => typeof id === 'string' && id.length), `${label}: missing ID`);
  requireCondition(new Set(ids).size === ids.length, `${label}: duplicate ID`);
  return new Set(ids);
}

export function validateResearchRadar(registry, catalogue, inventory, nodeIds) {
  requireCondition(registry.schema_version === '1.0', 'Unsupported radar schema');
  requireCondition(/^\d{4}-\d{2}-\d{2}$/.test(registry.observed_on), 'Missing observation date');
  requireCondition(Array.isArray(registry.source_cards) && registry.source_cards.length, 'No source cards');
  requireCondition(Array.isArray(registry.candidates), 'Missing candidate list');
  const sourceIds = uniqueIds(registry.source_cards, 'sources');
  uniqueIds(registry.candidates, 'candidates');
  const knownNodes = new Set(nodeIds);
  for (const source of registry.source_cards) {
    requireCondition(READING_STATES.has(source.reading_status), `${source.id}: invalid reading scope`);
    requireCondition(source.evidence === 'literature', `${source.id}: source metadata cannot certify a proof`);
    requireCondition(new URL(source.url).protocol === 'https:', `${source.id}: require HTTPS source`);
    for (const field of ['claim', 'limits', 'reuse', 'observed_on']) {
      requireCondition(typeof source[field] === 'string' && source[field].length, `${source.id}: missing ${field}`);
    }
    requireCondition(source.observed_on <= registry.observed_on, `${source.id}: future observation`);
    requireCondition(source.anchors.every((id) => knownNodes.has(id)), `${source.id}: unknown graph anchor`);
  }
  for (const candidate of registry.candidates) {
    requireCondition(['under_audit', 'queued', 'refuted', 'abandoned'].includes(candidate.status), `${candidate.id}: invalid status`);
    requireCondition(candidate.confidence === 'speculative', `${candidate.id}: hypothesis evidence promotion`);
    requireCondition(candidate.paper_score === null, `${candidate.id}: unreviewed hypothesis cannot carry a paper score`);
    requireCondition(candidate.source_ids.length > 0 && candidate.source_ids.every((id) => sourceIds.has(id)), `${candidate.id}: unresolved source`);
    requireCondition(candidate.node_ids.length > 0 && candidate.node_ids.every((id) => knownNodes.has(id)), `${candidate.id}: unknown graph node`);
    for (const field of ['dictionary', 'preserved', 'lost_or_unproved', 'hypothesis_to_remove', 'falsifier', 'next_finite_task', 'review_packet']) {
      requireCondition(typeof candidate[field] === 'string' && candidate[field].length, `${candidate.id}: missing ${field}`);
    }
  }
  requireCondition(/^[a-f0-9]{40}$/.test(catalogue.commit), 'Catalogue lacks immutable commit');
  requireCondition(/^[a-f0-9]{40}$/.test(catalogue.source_git_blob), 'Catalogue lacks source blob');
  requireCondition(catalogue.records.length === catalogue.reported_families, 'Family count mismatch');
  const familyIds = catalogue.records.map((record) => record.family);
  requireCondition(new Set(familyIds).size === familyIds.length, 'Duplicate catalogue family');
  const papers = catalogue.records.flatMap((record) => record.manuscripts);
  requireCondition(papers.length === catalogue.reported_manuscripts, 'Manuscript count mismatch');
  for (const paper of papers) {
    requireCondition(paper.title && paper.reading_status === 'catalogued' && paper.validity === 'not_audited', 'Catalogue entry overstates reading or validity');
    requireCondition(paper.url.startsWith(`https://github.com/openai/math/blob/${catalogue.commit}/preprints/`), 'Unpinned manuscript URL');
  }
  requireCondition(catalogue.withdrawal_notices.titles.length > 0, 'Missing withdrawal history');
  uniqueIds(inventory.repositories, 'repository inventory');
  requireCondition(inventory.repositories.every((repo) => repo.visibility === 'public'), 'Public radar contains a private repository');
  return { sources: sourceIds.size, candidates: registry.candidates.length, families: familyIds.length, manuscripts: papers.length, repositories: inventory.repositories.length };
}

export function searchResearchRadar(registry, catalogue, query) {
  const term = query.trim().toLocaleLowerCase('en');
  if (!term) return [];
  const sources = registry.source_cards.filter((card) => `${card.title} ${card.claim}`.toLocaleLowerCase('en').includes(term))
    .map((card) => ({ title: card.title, url: card.url, reading_status: card.reading_status }));
  const papers = catalogue.records.flatMap((family) => family.manuscripts
    .filter((paper) => `${family.family_title} ${paper.title}`.toLocaleLowerCase('en').includes(term))
    .map((paper) => ({ family: family.family, ...paper })));
  return [...sources, ...papers];
}
