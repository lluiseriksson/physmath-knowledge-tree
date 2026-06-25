# Árbol de conocimiento Físico-Matemático

[English version](./README.md) · [Grafo de investigación](https://lluiseriksson.github.io/physmath-knowledge-tree/) · [Mapa de aprendizaje](https://lluiseriksson.github.io/physmath-knowledge-tree/learning.html) · [Banco de investigación](https://lluiseriksson.github.io/physmath-knowledge-tree/workbench.html) · [Revisión de evidencia](https://lluiseriksson.github.io/physmath-knowledge-tree/evidence.html) · [Revisión de cambios](https://lluiseriksson.github.io/physmath-knowledge-tree/changes.html) · [Auditoría Lean](https://lluiseriksson.github.io/physmath-knowledge-tree/formalization.html) · [Dossiers de investigación](https://lluiseriksson.github.io/physmath-knowledge-tree/dossiers.html)

Grafo computable y etiquetado por evidencia para explorar conexiones entre física, matemáticas, problemas abiertos y objetivos de formalización en Lean. La repo también incluye un mapa bilingüe, herramientas locales de investigación, gobernanza de evidencia y una auditoría reproducible de objetivos Lean.

![Interfaz del grafo de investigación](./docs/research-screenshot.png)

## Siete experiencias complementarias

### Grafo de investigación — `index.html`

La interfaz consume directamente el JSON canónico e incorpora:

- 58 nodos de dominio, puente y problema unidos por 112 aristas tipadas.
- Búsqueda por títulos, IDs, etiquetas, resúmenes y preguntas abiertas.
- Colecciones curadas, filtros de tipo/evidencia y vistas de grafo o lista accesible.
- Camino mínimo dirigido o no dirigido.
- Fichas con preguntas, referencias, mecanismos entrantes/salientes y objetivos Lean.
- Generador de *bridge cards* que produce borradores Markdown explícitamente exploratorios.
- Exportación del subgrafo visible, estado compartible por URL, interfaz bilingüe, modo oscuro y caché offline.
- Referencias con alcance explícito en los 58 nodos y las 112 aristas: `claim`, `context` o `formalization`.

Los niveles `formal`, `literature`, `heuristic` y `speculative` forman parte del modelo. Una conexión visual nunca equivale por sí sola a un teorema.

### Banco de investigación — `workbench.html`

El banco local permite guardar varias investigaciones, fijar nodos por sus ID canónicos, comparar vecindarios y rutas según la evidencia, redactar tarjetas puente y conservar resultados negativos o inconclusos. La biblioteca se valida y se puede importar, fusionar o exportar como JSON sin cuentas, analítica ni sincronización remota.

Consulta [`docs/RESEARCH_WORKBENCH.md`](./docs/RESEARCH_WORKBENCH.md).

### Centro de revisión de evidencia — `evidence.html`

El centro transforma el registro generado de URLs en una cola local y determinista. Permite anotar fecha de comprobación, clase de fuente, identificadores de publicación y seguimiento sin editar la confianza ni las afirmaciones canónicas. Los libros locales y los paquetes seleccionados se validan, fusionan y exportan como JSON.

Consulta [`docs/EVIDENCE_REVIEW_CENTER.md`](./docs/EVIDENCE_REVIEW_CENTER.md).

### Revisión de cambios canónicos — `changes.html`

El revisor local calcula huellas de snapshots canónicos normalizados y los compara con el grafo actual. Prioriza promociones de confianza, reescrituras de extremos, pérdidas de referencias que sostienen afirmaciones, borrados y cambios del contrato del grafo; guarda decisiones locales acotadas; y exporta paquetes seleccionados en JSON o Markdown. Nunca modifica los datos canónicos.

Consulta [`docs/CANONICAL_CHANGE_REVIEW.md`](./docs/CANONICAL_CHANGE_REVIEW.md).

### Auditoría de objetivos Lean — `formalization.html`

La cola local enumera imports, declaraciones y objetivos Lean canónicos. Registra resultados ligados al toolchain, sustituciones de nombres y notas de bloqueo; además genera archivos Lean reproducibles con imports y comandos `#check`. Que el archivo compile comprueba nombres, no certifica una afirmación del grafo.

Consulta [`docs/LEAN_TARGET_AUDIT.md`](./docs/LEAN_TARGET_AUDIT.md).

### Centro de dossiers de investigación — `dossiers.html`

El centro combina una campaña del banco con sus revisiones de evidencia, auditorías de nombres Lean y decisiones sobre cambios canónicos. Calcula puertas de preparación acotadas y exporta entregas JSON o Markdown con huella, sin escribir en los almacenes de origen ni en el grafo canónico.

Consulta [`docs/RESEARCH_DOSSIER_CENTER.md`](./docs/RESEARCH_DOSSIER_CENTER.md).

### Mapa de aprendizaje — `learning.html`

Incluye 90 temas bilingües y 199 prerrequisitos, desde aritmética hasta matemáticas y física avanzadas. Ofrece búsqueda, filtros, grafo/lista, progreso local, favoritos, recomendaciones, rutas hacia objetivos, importación/exportación JSON y funcionamiento offline.

## Datos canónicos

`graph/nodes/core.json`, `graph/edges.json`, `graph/research_moves.json` y `graph/collections.json` son la fuente de verdad. Los esquemas JSON 2020-12 están en `graph/schemas/`; las vistas de `views/` se generan automáticamente.

Cada nodo tiene ID estable, resumen, etiquetas, preguntas vivas y objetivos Lean acotados. Cada arista declara un mecanismo concreto y un nivel de evidencia. La trazabilidad actual es 58/58 nodos y 112/112 aristas con referencias; todos los elementos `formal` o `literature` tienen una fuente de alcance `claim` o `formalization`. Una referencia de contexto no eleva el nivel de evidencia.

## Evaluación y posicionamiento

La repo incorpora una evaluación determinista además de la cobertura de código:

- 14 regresiones de búsqueda con top-1, recall@3 y rango recíproco medio.
- Cinco rutas dirigidas reproducibles con límite de aristas, control de evidencia, terminal y referencias.
- Una rúbrica de calidad controlable desde la repo que excluye explícitamente verdad científica, novedad publicable, adopción externa y resultados de estudios de usuarios aún no realizados.
- Declaración de necesidad, comparación con herramientas afines, guía de reproducibilidad y protocolo de evaluación con usuarios.

Consulta [`docs/EVALUATION.md`](./docs/EVALUATION.md), [`docs/USE_CASES.md`](./docs/USE_CASES.md), [`docs/QUALITY_SCORECARD.md`](./docs/QUALITY_SCORECARD.md), [`docs/STATEMENT_OF_NEED.md`](./docs/STATEMENT_OF_NEED.md), [`docs/RELATED_WORK.md`](./docs/RELATED_WORK.md) y [`docs/LIMITATIONS.md`](./docs/LIMITATIONS.md). Lista los casos con `npm run usecase:list`.

## Curación de fuentes

Los TXT, Markdown y PNG de investigación se tratan como material temporal de entrada. La auditoría generada de integridad y deuda de citas está en [`docs/GRAPH_AUDIT.md`](./docs/GRAPH_AUDIT.md). La repo conserva hashes SHA-256, decisiones atómicas y extractos matemáticos concisos, no volcados de conversaciones. Consulta [`docs/CURATION_WORKFLOW.md`](./docs/CURATION_WORKFLOW.md) y [`curation/`](./curation/README.md).

Una fuente solo es segura para borrar cuando toda idea única tiene destino, todos los destinos validan, la cola de verificación está cerrada y `review.status` registra la aprobación explícita del usuario.

```bash
npm run curation:register -- /ruta/al/archivo.png identificador
npm run curation:verify-source -- /ruta/al/original.png
npm run curation:report
npm run validate:curation
```

## Lean

La capa Lean refleja la ontología estable sin fingir que formaliza las conjeturas de investigación. Está fijada a Lean/mathlib `v4.31.0`.

```bash
lake build
```

CI compila con los avisos tratados como errores y verifica el entorno Lean.

`npm run lean:probe` convierte los imports y nombres candidatos del grafo en un probe Lean acotado; los resultados permanecen locales o portables hasta su revisión explícita.

## Uso local

Se necesita Node.js 22 o posterior. La web no tiene dependencias npm de ejecución; la compuerta completa de navegador requiere Chrome, Chromium o Edge.

```bash
npm ci
npm run dev
```

Abre `http://127.0.0.1:4173`.

Batería completa de calidad:

```bash
npm run test:coverage
npm run build
npm run test:e2e
npm run check
```

Build para GitHub Pages:

```bash
npm run build
```

## Calidad y seguridad

La repo valida IDs, referencias, endpoints, niveles de evidencia, colecciones, estadísticas, traducciones, taxonomías y ausencia de ciclos. Las pruebas cubren recorridos, caminos mínimos, búsqueda, evaluación, layout, persistencia, servidor y datos, con 100% de cobertura de líneas, ramas y funciones en el conjunto explícito de módulos instrumentados por Node. El artefacto `dist/` se prueba además en Chromium mediante búsqueda, fichas, rutas, cambio de idioma, accesibilidad dinámica, fallback offline, persistencia de progreso, el banco de investigación, las colas de evidencia/cambios, la auditoría de objetivos Lean y el centro de dossiers. También se verifican enlaces, accesibilidad estática, PWA, CSP, acciones fijadas por SHA, formato, build reproducible, CodeQL y despliegue Pages.

No hay analítica, cuentas, cookies, fuentes remotas ni scripts de terceros. El progreso educativo, los espacios de investigación, las notas de evidencia/cambios, los registros de auditoría Lean y las preferencias del dossier permanecen en el navegador salvo exportación explícita. Los resultados reproducibles están en [`docs/VERIFICATION.md`](./docs/VERIFICATION.md) y la metodología E2E en [`docs/BROWSER_TESTING.md`](./docs/BROWSER_TESTING.md).

## Protocolo de investigación

Consulta [`AGENTS.md`](./AGENTS.md) y [`docs/agent-protocol.md`](./docs/agent-protocol.md). Toda hipótesis nueva debe distinguir hechos, inferencias y especulación; conservar el nivel de evidencia; incluir un posible falsador; y terminar en una prueba finita o un objetivo Lean delimitado.

## Licencias

El código fuente usa MIT. El contenido curado del grafo y la documentación usa CC BY 4.0. Consulta [`LICENSE.md`](./LICENSE.md) y [`CITATION.cff`](./CITATION.cff).
