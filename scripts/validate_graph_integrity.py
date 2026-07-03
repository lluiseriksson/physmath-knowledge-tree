#!/usr/bin/env python3
"""Independent graph integrity validator for physmath-knowledge-tree.

Run from the repository root. The Node validator remains the primary
application gate; this script gives CI a small independent check over the
canonical graph JSON and generated reference registry.
"""

from __future__ import annotations

import glob
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
ALLOWED_CONFIDENCE = {"formal", "literature", "heuristic", "speculative"}
USAGE_KINDS = {"node", "edge"}
errors: list[str] = []


def load_json(path: str) -> Any | None:
    try:
        return json.loads((ROOT / path).read_text(encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001
        errors.append(f"{path}: JSON parse failure: {exc}")
        return None


def collect_nodes() -> tuple[set[str], list[dict[str, Any]]]:
    node_ids: list[str] = []
    nodes: list[dict[str, Any]] = []
    for path in sorted(glob.glob(str(ROOT / "graph" / "nodes" / "*.json"))):
        relative = str(Path(path).relative_to(ROOT)).replace("\\", "/")
        data = load_json(relative)
        if data is None:
            continue
        items = data if isinstance(data, list) else data.get("nodes", [])
        if not isinstance(items, list):
            errors.append(f"{relative}: node document must be an array")
            continue
        for item in items:
            if not isinstance(item, dict):
                errors.append(f"{relative}: node item must be an object")
                continue
            node_id = item.get("id")
            if not isinstance(node_id, str):
                errors.append(f"{relative}: node id missing or non-string")
                continue
            node_ids.append(node_id)
            nodes.append(item)
            confidence = item.get("confidence")
            if confidence not in ALLOWED_CONFIDENCE:
                errors.append(f"node {node_id}: unknown confidence {confidence!r}")
    for node_id, count in Counter(node_ids).items():
        if count > 1:
            errors.append(f"duplicate node id: {node_id} (x{count})")
    return set(node_ids), nodes


def collect_edges(node_ids: set[str]) -> tuple[set[str], list[dict[str, Any]]]:
    data = load_json("graph/edges.json")
    edge_ids: list[str] = []
    edges: list[dict[str, Any]] = []
    if data is None:
        return set(), edges
    items = data if isinstance(data, list) else data.get("edges", [])
    if not isinstance(items, list):
        errors.append("graph/edges.json: edge document must be an array")
        return set(), edges
    for item in items:
        if not isinstance(item, dict):
            errors.append("graph/edges.json: edge item must be an object")
            continue
        edge_id = item.get("id")
        if not isinstance(edge_id, str):
            errors.append("graph/edges.json: edge id missing or non-string")
            continue
        edge_ids.append(edge_id)
        edges.append(item)
        confidence = item.get("confidence")
        if confidence not in ALLOWED_CONFIDENCE:
            errors.append(f"edge {edge_id}: unknown confidence {confidence!r}")
        for key in ("source", "target"):
            target = item.get(key)
            if target not in node_ids:
                errors.append(f"edge {edge_id}: dangling {key} -> {target}")
    for edge_id, count in Counter(edge_ids).items():
        if count > 1:
            errors.append(f"duplicate edge id: {edge_id} (x{count})")
    return set(edge_ids), edges


def validate_collections(node_ids: set[str]) -> None:
    data = load_json("graph/collections.json")
    if data is None:
        return
    items = data if isinstance(data, list) else data.get("collections", [])
    if not isinstance(items, list):
        errors.append("graph/collections.json: collection document must be an array")
        return
    for collection in items:
        if not isinstance(collection, dict):
            errors.append("graph/collections.json: collection item must be an object")
            continue
        collection_id = collection.get("id", "?")
        for node_id in collection.get("nodes", []):
            if node_id not in node_ids:
                errors.append(f"collection {collection_id}: missing node {node_id}")


def validate_reference_registry(node_ids: set[str], edge_ids: set[str]) -> None:
    data = load_json("graph/reference-registry.json")
    if data is None:
        return
    references = data.get("references") if isinstance(data, dict) else None
    if not isinstance(references, list):
        errors.append("graph/reference-registry.json: references must be an array")
        return
    for reference in references:
        url = reference.get("url", "<missing URL>") if isinstance(reference, dict) else "<invalid reference>"
        used_by = reference.get("used_by") if isinstance(reference, dict) else None
        if not isinstance(used_by, list) or not used_by:
            errors.append(f"registry {url}: used_by must be a non-empty array")
            continue
        for usage in used_by:
            if not isinstance(usage, str) or usage.count(":") != 1:
                errors.append(f"registry {url}: invalid usage target {usage!r}")
                continue
            kind, target = usage.split(":", 1)
            if kind not in USAGE_KINDS:
                errors.append(f"registry {url}: unsupported usage kind {usage}")
            elif kind == "node" and target not in node_ids:
                errors.append(f"registry {url}: orphan {usage}")
            elif kind == "edge" and target not in edge_ids:
                errors.append(f"registry {url}: orphan {usage}")


def validate_schema(path: str, document: Any) -> bool:
    try:
        import jsonschema
    except ImportError:
        return False
    schema = load_json(path)
    if schema is None:
        return True
    try:
        jsonschema.validate(document, schema)
    except jsonschema.ValidationError as exc:
        errors.append(f"schema({path}) violation: {exc.message[:160]}")
    return True


def main() -> int:
    node_ids, nodes = collect_nodes()
    edge_ids, edges = collect_edges(node_ids)
    validate_collections(node_ids)
    validate_reference_registry(node_ids, edge_ids)

    node_schema_checked = validate_schema("graph/schemas/node.schema.json", nodes)
    edge_schema_checked = validate_schema("graph/schemas/edge.schema.json", edges)
    if not (node_schema_checked and edge_schema_checked):
        print("note: python package 'jsonschema' not installed; schema validation skipped")

    if errors:
        print(f"GRAPH INTEGRITY: {len(errors)} violation(s)")
        for error in errors:
            print("  -", error)
        return 1

    schema_note = "schemas validated" if node_schema_checked and edge_schema_checked else "schema validation skipped"
    print(f"GRAPH INTEGRITY: OK ({len(node_ids)} nodes, {len(edge_ids)} edges, registry consistent, {schema_note})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
