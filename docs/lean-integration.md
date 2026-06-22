# Lean 4 and mathlib Integration

This repo uses a small Lean package to anchor future formalization.

## Setup

Install Lean through `elan`, then from the repo root:

```bash
lake update
lake exe cache get
lake build
```

The `lean-toolchain` file is pinned to the current mathlib master toolchain as
checked on 2026-06-22. To update later:

```bash
curl https://raw.githubusercontent.com/leanprover-community/mathlib4/master/lean-toolchain -o lean-toolchain
lake update
lake exe cache get
```

Official references:

- mathlib dependency guide: https://github.com/leanprover-community/mathlib4/wiki/Using-mathlib4-as-a-dependency
- Lake reference: https://lean-lang.org/doc/reference/latest/Build-Tools-and-Distribution/Lake/

## Strategy

Do not try to formalize a Millennium Problem directly.

Instead:

1. Map a graph node to mathlib imports.
2. Find the smallest toy statement that has the same shape.
3. Formalize the toy statement.
4. Record what broke.
5. Promote only stable pieces into more ambitious targets.

## Lean target format

Each node has:

```json
"lean": {
  "imports": ["Mathlib"],
  "declarations": [],
  "targets": ["Find the minimal import for ..."]
}
```

Use `Mathlib` first while exploring. Later, replace it with minimal imports.

