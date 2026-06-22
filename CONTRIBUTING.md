# Contributing

Every contribution should improve one of these layers:

- graph data
- human-readable view
- Lean formalization
- reproducible prompt
- validation or generation script

## Node Rules

- Use stable lowercase dotted IDs.
- Write a short, operational summary.
- Declare `confidence`.
- Include `lean`, even if it is empty.
- Include at least one live question or extension path.

## Edge Rules

- The edge must explain the mechanism, not merely say "related".
- Use `confidence`.
- If it is speculative, add a falsifier in `notes`.

## Pull requests

Before opening a PR:

```bash
python scripts/validate_graph.py
python scripts/build_markdown_index.py
```

If you touch Lean:

```bash
lake build
```
