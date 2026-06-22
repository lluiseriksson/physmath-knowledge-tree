# Lean 4 and mathlib integration

## Reproducible toolchain

The repository pins Lean and mathlib to `v4.31.0` through:

- `lean-toolchain`;
- `lakefile.toml`;
- `lake-manifest.json`.

Build with:

```bash
lake build
```

For a fresh environment, mathlib's binary cache can reduce setup time:

```bash
lake exe cache get
lake build
```

## Current formal scope

`PhysMathKnowledgeTree/Foundation.lean` defines typed metadata for confidence levels, node kinds, edge kinds, Lean targets, knowledge nodes and knowledge edges. Other modules provide representative bridge and problem cards plus schema metadata.

This formal layer guarantees that the examples are well-typed records. It does **not** prove the informal scientific mechanisms represented by JSON edges.

## Adding a formal target

1. Start with the smallest import likely to contain the required definitions.
2. State all assumptions explicitly.
3. Prefer a finite, algebraic or elementary toy theorem.
4. Avoid using an unproved research claim as a premise unless it is visibly named as an assumption.
5. Add the module to `PhysMathKnowledgeTree.lean` when it is part of the public library.
6. Run `lake build` and keep warnings at zero.

## CI policy

The Lean CI job uses the pinned toolchain, mathlib cache, warnings-as-errors and `mk_all` coverage. Web tests and Lean checks run as separate jobs so a static-site change cannot hide a formalization failure. Lean's bundled `leanchecker` remains a useful heavier manual check via `lake env leanchecker`, but it is not part of the required push gate because GitHub-hosted runners can cancel it after otherwise successful builds.

## Updating Lean/mathlib

Perform upgrades in a dedicated pull request:

1. update `lean-toolchain` and the mathlib revision in `lakefile.toml`;
2. regenerate `lake-manifest.json` with Lake;
3. run `lake exe cache get` and `lake build`;
4. review declaration/import changes;
5. update this document and the changelog.

Do not manually mix a new toolchain with an old manifest.
