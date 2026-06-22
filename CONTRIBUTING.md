# Contributing

Toda contribucion debe mejorar una de estas capas:

- datos del grafo
- vista humana
- formalizacion Lean
- prompt reproducible
- script de validacion o generacion

## Reglas para nodos

- Usa IDs estables, en minusculas, separados por puntos.
- Escribe un resumen corto y operacional.
- Declara `confidence`.
- Incluye `lean` aunque este vacio.
- Incluye al menos una pregunta viva o una ruta de extension.

## Reglas para aristas

- La arista debe explicar el mecanismo, no solo decir "relacionado".
- Usa `confidence`.
- Si es especulativa, anade un falsador en `notes`.

## Pull requests

Antes de abrir una PR:

```bash
python scripts/validate_graph.py
python scripts/build_markdown_index.py
```

Si tocas Lean:

```bash
lake build
```

