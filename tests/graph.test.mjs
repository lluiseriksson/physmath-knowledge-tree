import test from 'node:test';
import assert from 'node:assert/strict';
import {topics} from '../src/data/topics.js';
import {computeDepths,createEdgePath,createLayout,getAncestors,getDescendants,getLearningPath,getProgressStats,getRecommendedTopics,indexTopics,isUnlocked,topologicalSort} from '../src/lib/graph.js';

test('catalog is a valid DAG',()=>{
 const ordered=topologicalSort(topics);
 assert.equal(ordered.length,topics.length);
 const seen=new Set();
 for(const topic of ordered){for(const prerequisite of topic.prerequisites)assert.ok(seen.has(prerequisite));seen.add(topic.id);}
});
test('depth and layout cover every topic',()=>{
 const depths=computeDepths(topics),layout=createLayout(topics);
 assert.equal(depths.size,topics.length);
 assert.equal(layout.positions.size,topics.length);
 assert.ok(layout.width>1000);
 assert.ok(layout.height>500);
 for(const point of layout.positions.values()){assert.ok(Number.isFinite(point.x));assert.ok(Number.isFinite(point.y));}
});

test('learning path contains target and all ancestors in order',()=>{
 const path=getLearningPath('quantum-field-theory',topics),ids=new Set(path.map(x=>x.id));
 assert.equal(path.at(-1)?.id,'quantum-field-theory');
 assert.ok(ids.has('arithmetic'));
 assert.ok(ids.has('special-relativity'));
 assert.ok(ids.has('fourier-analysis'));
 for(const topic of path)for(const prerequisite of topic.prerequisites)assert.ok(ids.has(prerequisite));
});

test('ancestor and descendant traversal is directional',()=>{
 const byId=indexTopics(topics),ancestors=getAncestors('general-relativity',byId),descendants=getDescendants('arithmetic',topics);
 assert.ok(ancestors.has('differential-geometry'));
 assert.ok(ancestors.has('special-relativity'));
 assert.ok(!ancestors.has('cosmology'));
 assert.ok(descendants.has('cosmology'));
 assert.ok(!descendants.has('arithmetic'));
});

test('unlock and recommendation logic respects mastered prerequisites',()=>{
 const arithmetic=topics.find(x=>x.id==='arithmetic'),algebra=topics.find(x=>x.id==='elementary-algebra');
 assert.ok(arithmetic&&algebra);
 assert.equal(isUnlocked(arithmetic,{}),true);
 assert.equal(isUnlocked(algebra,{}),false);
 assert.equal(isUnlocked(algebra,{arithmetic:'mastered'}),true);
 const recommendations=getRecommendedTopics(topics,{arithmetic:'mastered'},20);
 assert.ok(recommendations.some(x=>x.id==='elementary-algebra'));
});

test('progress stats and edge paths are deterministic',()=>{
 const stats=getProgressStats(topics,{arithmetic:'mastered','elementary-algebra':'learning'});
 assert.equal(stats.mastered,1);assert.equal(stats.learning,1);assert.equal(stats.total,topics.length);
 assert.match(createEdgePath({x:0,y:0,depth:0,order:0},{x:300,y:100,depth:1,order:0}),/^M /);
});

test('graph helpers reject malformed DAGs and handle empty or unknown targets', () => {
  const missing = [{ id: 'child', prerequisites: ['missing'] }];
  assert.throws(() => topologicalSort(/** @type {any} */ (missing)), /missing prerequisite/);

  const cycle = [
    { id: 'root', prerequisites: [] },
    { id: 'a', prerequisites: ['b'] },
    { id: 'b', prerequisites: ['a'] },
  ];
  assert.throws(() => topologicalSort(/** @type {any} */ (cycle)), /Cycle detected: a, b/);

  assert.deepEqual(topologicalSort([]), []);
  assert.deepEqual(getLearningPath('missing', topics), []);
  assert.deepEqual([...getAncestors('missing', indexTopics(topics))], []);
  assert.deepEqual([...getDescendants('missing', topics)], []);
  assert.deepEqual(getProgressStats([], {}), {
    mastered: 0, learning: 0, notStarted: 0, total: 0, percent: 0,
  });
});

test('layout and recommendation tie-breakers are deterministic on small fixtures', () => {
  const fixture = [
    {
      id: 'root', prerequisites: [], domain: 'unknown', area: 'z', level: 'foundation',
      estimatedHours: 1,
    },
    {
      id: 'alpha', prerequisites: ['root'], domain: 'math', area: 'a', level: 'intermediate',
      estimatedHours: 3,
    },
    {
      id: 'beta', prerequisites: ['root'], domain: 'math', area: 'a', level: 'intermediate',
      estimatedHours: 3,
    },
    {
      id: 'mystery-a', prerequisites: ['root'], domain: 'unknown', area: 'a', level: 'experimental',
      estimatedHours: 4,
    },
    {
      id: 'mystery-b', prerequisites: ['root'], domain: 'unknown', area: 'a', level: 'experimental',
      estimatedHours: 5,
    },
  ];
  const layout = createLayout(/** @type {any} */ (fixture), {
    horizontalGap: 10, verticalGap: 5, margin: 20,
  });
  assert.equal(layout.maxDepth, 1);
  assert.equal(layout.positions.size, 5);

  const recommended = getRecommendedTopics(
    /** @type {any} */ (fixture),
    { root: 'mastered', beta: 'learning' },
    2,
  );
  assert.deepEqual(recommended.map((topic) => topic.id), ['beta', 'alpha']);

  const tied = getRecommendedTopics(
    /** @type {any} */ (fixture),
    { root: 'mastered' },
    2,
  );
  assert.deepEqual(tied.map((topic) => topic.id), ['alpha', 'beta']);

  const unknownLevel = [{
    id: 'unknown-level', prerequisites: [], domain: 'math', area: 'a',
    level: 'experimental', estimatedHours: 1,
  }];
  assert.deepEqual(
    getRecommendedTopics(/** @type {any} */ (unknownLevel), {}, 1).map((topic) => topic.id),
    ['unknown-level'],
  );

  const mixedLevels = [
    ...unknownLevel,
    {
      id: 'known-level', prerequisites: [], domain: 'math', area: 'a',
      level: 'foundation', estimatedHours: 1,
    },
    {
      id: 'unknown-level-2', prerequisites: [], domain: 'math', area: 'a',
      level: 'experimental', estimatedHours: 2,
    },
  ];
  assert.deepEqual(
    getRecommendedTopics(/** @type {any} */ (mixedLevels), {}, 3).map((topic) => topic.id),
    ['known-level', 'unknown-level', 'unknown-level-2'],
  );
});
