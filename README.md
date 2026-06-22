# PhysMath Knowledge Tree

Repositorio semilla para construir un atlas computable de fisica-matematica:
conceptos, teoremas, formulas, problemas abiertos, puentes entre dominios y
"research moves" que agentes puedan usar para buscar ideas fuera de los
caminos habituales.

La intuicion es un arbol de ajedrez de la ciencia. La implementacion base es
un grafo: los arboles son vistas parciales, pero el conocimiento real tiene
puentes, ciclos, dualidades, analogias y cambios de lenguaje.

## Objetivo

- Organizar toda la matematica y fisica-matematica en nodos reutilizables.
- Conectar cada nodo con referencias, imports Lean/mathlib y preguntas vivas.
- Separar hechos formales, literatura consolidada, heuristicas y especulacion.
- Dar a agentes una ruta clara para generar hipotesis, falsarlas y formalizar.
- Crear tableros de problemas profundos, incluyendo los Millennium Problems.

## Inicio rapido para agentes

1. Lee [AGENTS.md](AGENTS.md).
2. Carga [graph/index.json](graph/index.json).
3. Valida el grafo:

```bash
python scripts/validate_graph.py
```

4. Explora las vistas humanas:

- [views/tree.md](views/tree.md)
- [views/domain-matrix.md](views/domain-matrix.md)
- [views/millennium-map.md](views/millennium-map.md)

5. Usa los prompts:

- [prompts/agent-discovery.md](prompts/agent-discovery.md)
- [prompts/hypothesis-generation.md](prompts/hypothesis-generation.md)
- [prompts/lean-formalization.md](prompts/lean-formalization.md)

## Lean 4 / mathlib

Este repo incluye un paquete Lean minimo:

```bash
lake update
lake exe cache get
lake build
```

El setup sigue la guia oficial de mathlib para usar mathlib como dependencia:
https://github.com/leanprover-community/mathlib4/wiki/Using-mathlib4-as-a-dependency

## Estructura

```text
graph/      Datos canonicos del grafo en JSON.
views/      Vistas navegables para humanos.
docs/       Diseno, ontologia y protocolos de investigacion.
prompts/    Prompts para agentes.
scripts/    Validacion y generacion de indices.
PhysMathKnowledgeTree/  Capa Lean inicial.
```

## Regla de oro

Una idea especulativa puede entrar si esta marcada como especulativa, tiene un
test posible y no se presenta como teorema. El valor del repo no es "tener la
respuesta", sino convertir intuiciones en rutas de busqueda trazables.

