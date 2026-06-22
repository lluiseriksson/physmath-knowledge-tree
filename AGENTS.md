# Agent Protocol

Este repositorio esta disenado para agentes que buscan conexiones matematicas
profundas, especialmente cuando una busqueda frontal se atasca.

## Contrato operativo

1. No confundas especulacion con verdad.
2. Cada propuesta debe declarar sus nodos de origen, puente, tipo de evidencia,
   posible falsador y proximo objetivo Lean.
3. Prefiere mapas pequenos y verificables antes que narrativas enormes.
4. Cuando uses mathlib, cita imports y declaraciones candidatas.
5. Si una idea depende de fisica no rigurosa, etiquetala como `heuristic` o
   `speculative`.

## Ciclo recomendado

1. Escoge un problema o dominio en `graph/nodes/core.json`.
2. Recupera nodos a distancia 1 y 2 usando `graph/edges.json`.
3. Aplica 2 o 3 movimientos de `graph/research_moves.json`.
4. Produce una "bridge card":
   - problema
   - dominios combinados
   - mecanismo de transferencia
   - por que podria funcionar
   - que lo podria destruir
   - objetivo Lean minimo
5. Si la idea sobrevive, crea una PR con:
   - nuevo nodo o arista
   - evidencia
   - prompt reproducible
   - formalizacion parcial, si existe

## Formato de salida para ideas

```markdown
## Bridge Card: <titulo>

- Source nodes:
- Target problem:
- Move:
- Confidence: formal | literature | heuristic | speculative
- Mechanism:
- Possible payoff:
- Falsifier:
- Lean target:
- Next computation:
```

## Prohibiciones utiles

- No uses "parece profundo" como evidencia.
- No mezcles notacion de dominios distintos sin escribir el traductor.
- No propongas una gran teoria si antes no puedes formular un micro-lema.
- No borres incertidumbre: ponle nombre.

