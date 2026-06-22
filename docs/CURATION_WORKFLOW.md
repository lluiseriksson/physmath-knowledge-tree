# Documentation and image curation workflow

The repository treats raw TXT, Markdown and PNG files as **temporary source material**, not as canonical knowledge. The goal is to preserve every unique mathematical idea while removing duplication, stale plans and unsupported claims.

## 1. Register without copying

A source is identified by its filename, media type, byte count and SHA-256 hash. Raw files remain outside Git or inside the ignored `curation/inbox/` directory.

```bash
npm run curation:register -- /absolute/path/to/source.txt source_id
```

Registration creates a draft JSON record only. It never copies the original.

## 2. Split into atomic claims

Each independent claim is assigned one evidence class:

- `formal`: derivable from explicit definitions and hypotheses;
- `literature`: supported by a primary mathematical or scientific source;
- `heuristic`: a plausible transfer mechanism that is not a theorem;
- `speculative`: an exploratory analogy or proposed mechanism with a clear failure condition;
- discarded: duplicate, superseded, malformed, unrelated or impossible to audit.

A long roadmap is not one claim. Theorems, dependencies, source requests and strategic opinions are separated.

## 3. Choose the smallest destination

| Material | Canonical destination |
| --- | --- |
| Reusable concept or open problem | `graph/nodes/core.json` |
| Typed mechanism between concepts | `graph/edges.json` |
| Repeatable research operation | `graph/research_moves.json` |
| Nuanced explanation or audit | `docs/curated/` |
| Unverified but potentially useful idea | curation record and quarantine document |
| Raw code snapshot from another repository | discard after extracting declarations and dependencies |

Canonical graph data must remain concise. It must not become a transcript archive.

## 4. Requirements for mathematical promotion

A promoted item must have:

1. an explicit statement or mechanism;
2. assumptions separated from conclusions;
3. an evidence class;
4. a bounded Lean target or finite falsification test;
5. source line ranges in its curation record;
6. no contradiction with a newer reviewed record.

Literature-dependent constants, theorem numbers and physical identifications remain in the verification queue until checked against primary sources.

## 5. PNG and diagram protocol

For each image:

1. record SHA-256, dimensions and provenance;
2. identify independent panels, equations and diagrams;
3. crop only the mathematically relevant region;
4. preserve a crop manifest with pixel coordinates and transformation history;
5. write a caption and alt text describing mathematical content rather than visual appearance alone;
6. redraw simple graphs or commutative diagrams as SVG/Mermaid when possible;
7. promote the represented nodes and edges separately from the bitmap;
8. quarantine images with uncertain rights, unreadable labels or ambiguous notation.

The original PNG may be deleted only after the reviewed crop or redraw preserves every needed detail.

## 6. Deletion gate

A source is deletion-safe when:

- its hash and metadata are recorded;
- every unique claim is promoted, quarantined or discarded with a reason;
- all promoted destinations validate;
- all unresolved citations appear in `verification_queue`;
- generated graph views and tests pass;
- the user has reviewed the extract and quarantine report.

The curation record then moves from `curated` to `reviewed`, and its retention field may become `deleted-after-review`.

## 7. Quality gate

```bash
npm run validate:curation
npm run check
```

The first command validates provenance records and destinations. The second validates the complete graph, documentation, tests and static build.
