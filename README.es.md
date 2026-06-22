# Árbol de conocimiento Físico-Matemático

[English version](./README.md) · [Grafo de investigación](https://lluiseriksson.github.io/physmath-knowledge-tree/) · [Mapa de aprendizaje](https://lluiseriksson.github.io/physmath-knowledge-tree/learning.html)

Grafo computable y etiquetado por evidencia para explorar conexiones entre física, matemáticas, problemas abiertos y objetivos de formalización en Lean. La repo también incluye un mapa bilingüe de prerrequisitos para estudiar de forma estructurada.

![Interfaz del grafo de investigación](./docs/research-screenshot.png)

## Dos experiencias complementarias

### Grafo de investigación — `index.html`

La interfaz consume directamente el JSON canónico e incorpora:

- 36 nodos de dominio, puente y problema unidos por 61 aristas tipadas.
- Búsqueda por títulos, IDs, etiquetas, resúmenes y preguntas abiertas.
- Colecciones curadas, filtros de tipo/evidencia y vistas de grafo o lista accesible.
- Camino mínimo dirigido o no dirigido.
- Fichas con preguntas, referencias, mecanismos entrantes/salientes y objetivos Lean.
- Generador de *bridge cards* que produce borradores Markdown explícitamente exploratorios.
- Exportación del subgrafo visible, estado compartible por URL, interfaz bilingüe, modo oscuro y caché offline.

Los niveles `formal`, `literature`, `heuristic` y `speculative` forman parte del modelo. Una conexión visual nunca equivale por sí sola a un teorema.

### Mapa de aprendizaje — `learning.html`

Incluye 90 temas bilingües y 199 prerrequisitos, desde aritmética hasta matemáticas y física avanzadas. Ofrece búsqueda, filtros, grafo/lista, progreso local, favoritos, recomendaciones, rutas hacia objetivos, importación/exportación JSON y funcionamiento offline.

## Datos canónicos

`graph/nodes/core.json`, `graph/edges.json`, `graph/research_moves.json` y `graph/collections.json` son la fuente de verdad. Los esquemas JSON 2020-12 están en `graph/schemas/`; las vistas de `views/` se generan automáticamente.

Cada nodo tiene ID estable, resumen, etiquetas, preguntas vivas y objetivos Lean acotados. Cada arista declara un mecanismo concreto y un nivel de evidencia.

## Lean

La capa Lean refleja la ontología estable sin fingir que formaliza las conjeturas de investigación. Está fijada a Lean/mathlib `v4.31.0`.

```bash
lake build
```

CI compila con los avisos tratados como errores y verifica el entorno Lean.

## Uso local

Se necesita Node.js 22 o posterior. La web no tiene dependencias npm de ejecución.

```bash
npm ci
npm run dev
```

Abre `http://127.0.0.1:4173`.

Batería completa de calidad:

```bash
npm run check
```

Build para GitHub Pages:

```bash
npm run build
```

## Calidad y seguridad

La repo valida IDs, referencias, endpoints, niveles de evidencia, colecciones, estadísticas, traducciones, taxonomías y ausencia de ciclos. Las pruebas cubren recorridos, caminos mínimos, búsqueda, layout, persistencia y datos. También se verifican enlaces locales, CSP, caché offline, formato, build, CodeQL y despliegue Pages.

No hay analítica, cuentas, cookies, fuentes remotas ni scripts de terceros. El progreso educativo permanece en el navegador salvo exportación explícita. Los resultados reproducibles están en [`docs/VERIFICATION.md`](./docs/VERIFICATION.md).

## Protocolo de investigación

Consulta [`AGENTS.md`](./AGENTS.md) y [`docs/agent-protocol.md`](./docs/agent-protocol.md). Toda hipótesis nueva debe distinguir hechos, inferencias y especulación; conservar el nivel de evidencia; incluir un posible falsador; y terminar en una prueba finita o un objetivo Lean delimitado.

## Licencias

El código fuente usa MIT. El contenido curado del grafo y la documentación usa CC BY 4.0. Consulta [`LICENSE.md`](./LICENSE.md) y [`CITATION.cff`](./CITATION.cff).
