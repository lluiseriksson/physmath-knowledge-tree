# JSON-LD export

The canonical research graph can be projected into deterministic JSON-LD without changing the source JSON:

```bash
npm run export:jsonld -- --output physmath-knowledge-graph.jsonld
npm run export:jsonld -- --compact --output physmath-knowledge-graph.min.jsonld
npm run export:jsonld -- --base https://example.org/physmath/id/ --output graph.jsonld
npm run generate:jsonld
npm run validate:jsonld
```

The export contains nodes, typed edges, research moves and curated collections. Stable canonical IDs are retained as `stableId`, while every entity receives an HTTP(S) IRI. Edge endpoints and collection members become linked IRIs rather than duplicated strings.

Schema.org terms cover names, descriptions, dates, keywords, URLs and citations. Project-specific concepts such as confidence, relation, Lean targets and reference scope use the documented `pm:` namespace. Arrays and entities are ordered deterministically down to reference scope/type tie-breakers. Duplicate IDs, dangling endpoints, invalid collection membership, application-version drift and unusable entity bases are rejected before output is written.

The development server recognizes `.jsonld` as `application/ld+json`. Use `--base` to select a stable namespace for a downstream deployment. This projection is an interoperability artifact: canonical edits must still be made in the repository's source JSON files.
