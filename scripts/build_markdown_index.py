from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def main() -> None:
    nodes = load_json(ROOT / "graph" / "nodes" / "core.json")
    edges = load_json(ROOT / "graph" / "edges.json")

    by_kind: dict[str, list[dict]] = defaultdict(list)
    outgoing: dict[str, list[dict]] = defaultdict(list)
    for node in nodes:
        by_kind[node["kind"]].append(node)
    for edge in edges:
        outgoing[edge["source"]].append(edge)

    lines: list[str] = [
        "# Generated Index",
        "",
        "Generated from `graph/nodes/core.json` and `graph/edges.json`.",
        "",
    ]

    for kind in sorted(by_kind):
        lines.append(f"## {kind.title()}s")
        lines.append("")
        for node in sorted(by_kind[kind], key=lambda item: item["id"]):
            lines.append(f"### {node['title']}")
            lines.append("")
            lines.append(f"- ID: `{node['id']}`")
            lines.append(f"- Confidence: `{node['confidence']}`")
            lines.append(f"- Summary: {node['summary']}")
            if node["lean"]["imports"]:
                imports = ", ".join(f"`{name}`" for name in node["lean"]["imports"])
                lines.append(f"- Lean imports: {imports}")
            node_edges = outgoing.get(node["id"], [])
            if node_edges:
                edge_text = ", ".join(f"{edge['relation']} -> `{edge['target']}`" for edge in node_edges)
                lines.append(f"- Outgoing: {edge_text}")
            lines.append("")

    output = ROOT / "views" / "generated-index.md"
    output.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    print(f"Wrote {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

