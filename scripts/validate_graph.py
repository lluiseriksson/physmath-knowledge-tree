from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

CONFIDENCE = {"formal", "literature", "heuristic", "speculative"}
NODE_KINDS = {"domain", "theory", "concept", "theorem", "formula", "method", "problem", "bridge"}
RELATIONS = {
    "depends_on",
    "generalizes",
    "specializes",
    "analogy",
    "dual",
    "formalizes_as",
    "transfers_via",
    "obstructs",
    "suggests",
    "tests",
    "uses",
    "bridge",
}


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def require_fields(item: dict, fields: set[str], label: str) -> None:
    missing = sorted(fields - set(item))
    if missing:
        fail(f"{label} missing fields: {', '.join(missing)}")


def main() -> None:
    nodes = load_json(ROOT / "graph" / "nodes" / "core.json")
    edges = load_json(ROOT / "graph" / "edges.json")
    moves = load_json(ROOT / "graph" / "research_moves.json")

    node_fields = {"id", "kind", "title", "summary", "confidence", "tags", "lean", "questions"}
    edge_fields = {"id", "source", "target", "relation", "confidence", "mechanism"}
    move_fields = {"id", "title", "description", "good_for", "output", "risks", "lean_test"}

    seen_nodes: set[str] = set()
    for node in nodes:
        require_fields(node, node_fields, f"node {node.get('id', '<unknown>')}")
        node_id = node["id"]
        if node_id in seen_nodes:
            fail(f"duplicate node id: {node_id}")
        seen_nodes.add(node_id)
        if node["kind"] not in NODE_KINDS:
            fail(f"node {node_id} has invalid kind {node['kind']}")
        if node["confidence"] not in CONFIDENCE:
            fail(f"node {node_id} has invalid confidence {node['confidence']}")
        lean = node["lean"]
        require_fields(lean, {"imports", "declarations", "targets"}, f"node {node_id}.lean")
        for key in ("tags", "questions"):
            if not isinstance(node[key], list):
                fail(f"node {node_id}.{key} must be a list")

    seen_edges: set[str] = set()
    for edge in edges:
        require_fields(edge, edge_fields, f"edge {edge.get('id', '<unknown>')}")
        edge_id = edge["id"]
        if edge_id in seen_edges:
            fail(f"duplicate edge id: {edge_id}")
        seen_edges.add(edge_id)
        if edge["source"] not in seen_nodes:
            fail(f"edge {edge_id} source does not exist: {edge['source']}")
        if edge["target"] not in seen_nodes:
            fail(f"edge {edge_id} target does not exist: {edge['target']}")
        if edge["relation"] not in RELATIONS:
            fail(f"edge {edge_id} has invalid relation {edge['relation']}")
        if edge["confidence"] not in CONFIDENCE:
            fail(f"edge {edge_id} has invalid confidence {edge['confidence']}")

    seen_moves: set[str] = set()
    for move in moves:
        require_fields(move, move_fields, f"move {move.get('id', '<unknown>')}")
        move_id = move["id"]
        if move_id in seen_moves:
            fail(f"duplicate move id: {move_id}")
        seen_moves.add(move_id)
        for node_id in move["good_for"]:
            if node_id not in seen_nodes:
                fail(f"move {move_id} references missing node {node_id}")

    print(f"OK: {len(nodes)} nodes, {len(edges)} edges, {len(moves)} research moves.")


if __name__ == "__main__":
    main()

