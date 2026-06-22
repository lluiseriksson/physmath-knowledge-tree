// Curated source data. Keep topics in topological order.
export const catalog = Object.freeze({
  "domains": [
    {
      "id": "math",
      "label": {
        "en": "Mathematics",
        "es": "Matemáticas"
      }
    },
    {
      "id": "bridge",
      "label": {
        "en": "Cross-cutting methods",
        "es": "Métodos transversales"
      }
    },
    {
      "id": "physics",
      "label": {
        "en": "Physics",
        "es": "Física"
      }
    }
  ],
  "levels": [
    {
      "id": "foundation",
      "label": {
        "en": "Foundation",
        "es": "Fundamentos"
      }
    },
    {
      "id": "intermediate",
      "label": {
        "en": "Intermediate",
        "es": "Intermedio"
      }
    },
    {
      "id": "advanced",
      "label": {
        "en": "Advanced",
        "es": "Avanzado"
      }
    }
  ],
  "areas": [
    {
      "id": "math-foundations",
      "label": {
        "en": "Mathematical foundations",
        "es": "Fundamentos matemáticos"
      }
    },
    {
      "id": "algebra",
      "label": {
        "en": "Algebra",
        "es": "Álgebra"
      }
    },
    {
      "id": "geometry",
      "label": {
        "en": "Geometry",
        "es": "Geometría"
      }
    },
    {
      "id": "calculus",
      "label": {
        "en": "Calculus and differential equations",
        "es": "Cálculo y ecuaciones diferenciales"
      }
    },
    {
      "id": "analysis",
      "label": {
        "en": "Analysis",
        "es": "Análisis"
      }
    },
    {
      "id": "discrete",
      "label": {
        "en": "Discrete mathematics",
        "es": "Matemática discreta"
      }
    },
    {
      "id": "probability-statistics",
      "label": {
        "en": "Probability and statistics",
        "es": "Probabilidad y estadística"
      }
    },
    {
      "id": "scientific-methods",
      "label": {
        "en": "Scientific methods",
        "es": "Métodos científicos"
      }
    },
    {
      "id": "mathematical-methods",
      "label": {
        "en": "Mathematical methods",
        "es": "Métodos matemáticos"
      }
    },
    {
      "id": "computation",
      "label": {
        "en": "Computation",
        "es": "Computación"
      }
    },
    {
      "id": "physics-foundations",
      "label": {
        "en": "Physics foundations",
        "es": "Fundamentos de física"
      }
    },
    {
      "id": "mechanics",
      "label": {
        "en": "Mechanics",
        "es": "Mecánica"
      }
    },
    {
      "id": "waves",
      "label": {
        "en": "Waves and sound",
        "es": "Ondas y sonido"
      }
    },
    {
      "id": "thermal-physics",
      "label": {
        "en": "Thermal physics",
        "es": "Física térmica"
      }
    },
    {
      "id": "electromagnetism",
      "label": {
        "en": "Electromagnetism",
        "es": "Electromagnetismo"
      }
    },
    {
      "id": "optics",
      "label": {
        "en": "Optics",
        "es": "Óptica"
      }
    },
    {
      "id": "relativity",
      "label": {
        "en": "Relativity",
        "es": "Relatividad"
      }
    },
    {
      "id": "quantum-physics",
      "label": {
        "en": "Quantum physics",
        "es": "Física cuántica"
      }
    },
    {
      "id": "condensed-matter",
      "label": {
        "en": "Condensed matter",
        "es": "Materia condensada"
      }
    },
    {
      "id": "nuclear-particle",
      "label": {
        "en": "Nuclear and particle physics",
        "es": "Física nuclear y de partículas"
      }
    },
    {
      "id": "astrophysics",
      "label": {
        "en": "Astrophysics and cosmology",
        "es": "Astrofísica y cosmología"
      }
    },
    {
      "id": "complex-systems",
      "label": {
        "en": "Complex systems",
        "es": "Sistemas complejos"
      }
    }
  ]
});

export const topics = Object.freeze([
  {
    "id": "arithmetic",
    "title": {
      "en": "Arithmetic",
      "es": "Aritmética"
    },
    "domain": "math",
    "area": "math-foundations",
    "level": "foundation",
    "estimatedHours": 10,
    "prerequisites": [],
    "concepts": {
      "en": [
        "fractions",
        "ratios",
        "powers"
      ],
      "es": [
        "fracciones",
        "razones",
        "potencias"
      ]
    },
    "summary": {
      "en": "Build a working understanding of arithmetic through fractions, ratios, and powers.",
      "es": "Construye una comprensión práctica de aritmética mediante fracciones, razones y potencias."
    },
    "keywords": [
      "arithmetic",
      "aritmética",
      "fractions",
      "ratios",
      "powers",
      "fracciones",
      "razones",
      "potencias"
    ]
  },
  {
    "id": "elementary-algebra",
    "title": {
      "en": "Elementary algebra",
      "es": "Álgebra elemental"
    },
    "domain": "math",
    "area": "algebra",
    "level": "foundation",
    "estimatedHours": 16,
    "prerequisites": [
      "arithmetic"
    ],
    "concepts": {
      "en": [
        "equations",
        "factoring",
        "inequalities"
      ],
      "es": [
        "ecuaciones",
        "factorización",
        "desigualdades"
      ]
    },
    "summary": {
      "en": "Build a working understanding of elementary algebra through equations, factoring, and inequalities.",
      "es": "Construye una comprensión práctica de álgebra elemental mediante ecuaciones, factorización y desigualdades."
    },
    "keywords": [
      "elementary algebra",
      "álgebra elemental",
      "equations",
      "factoring",
      "inequalities",
      "ecuaciones",
      "factorización",
      "desigualdades"
    ]
  },
  {
    "id": "functions-graphs",
    "title": {
      "en": "Functions and graphs",
      "es": "Funciones y gráficas"
    },
    "domain": "math",
    "area": "algebra",
    "level": "foundation",
    "estimatedHours": 14,
    "prerequisites": [
      "elementary-algebra"
    ],
    "concepts": {
      "en": [
        "domain and range",
        "transformations",
        "inverse functions"
      ],
      "es": [
        "dominio y recorrido",
        "transformaciones",
        "funciones inversas"
      ]
    },
    "summary": {
      "en": "Build a working understanding of functions and graphs through domain and range, transformations, and inverse functions.",
      "es": "Construye una comprensión práctica de funciones y gráficas mediante dominio y recorrido, transformaciones y funciones inversas."
    },
    "keywords": [
      "functions and graphs",
      "funciones y gráficas",
      "domain and range",
      "transformations",
      "inverse functions",
      "dominio y recorrido",
      "transformaciones",
      "funciones inversas"
    ]
  },
  {
    "id": "euclidean-geometry",
    "title": {
      "en": "Euclidean geometry",
      "es": "Geometría euclídea"
    },
    "domain": "math",
    "area": "geometry",
    "level": "foundation",
    "estimatedHours": 14,
    "prerequisites": [
      "arithmetic"
    ],
    "concepts": {
      "en": [
        "congruence",
        "similarity",
        "area"
      ],
      "es": [
        "congruencia",
        "semejanza",
        "área"
      ]
    },
    "summary": {
      "en": "Build a working understanding of euclidean geometry through congruence, similarity, and area.",
      "es": "Construye una comprensión práctica de geometría euclídea mediante congruencia, semejanza y área."
    },
    "keywords": [
      "euclidean geometry",
      "geometría euclídea",
      "congruence",
      "similarity",
      "area",
      "congruencia",
      "semejanza",
      "área"
    ]
  },
  {
    "id": "logic-proof",
    "title": {
      "en": "Logic and proof",
      "es": "Lógica y demostración"
    },
    "domain": "math",
    "area": "math-foundations",
    "level": "foundation",
    "estimatedHours": 18,
    "prerequisites": [
      "elementary-algebra"
    ],
    "concepts": {
      "en": [
        "quantifiers",
        "induction",
        "contradiction"
      ],
      "es": [
        "cuantificadores",
        "inducción",
        "contradicción"
      ]
    },
    "summary": {
      "en": "Build a working understanding of logic and proof through quantifiers, induction, and contradiction.",
      "es": "Construye una comprensión práctica de lógica y demostración mediante cuantificadores, inducción y contradicción."
    },
    "keywords": [
      "logic and proof",
      "lógica y demostración",
      "quantifiers",
      "induction",
      "contradiction",
      "cuantificadores",
      "inducción",
      "contradicción"
    ]
  },
  {
    "id": "trigonometry",
    "title": {
      "en": "Trigonometry",
      "es": "Trigonometría"
    },
    "domain": "math",
    "area": "geometry",
    "level": "foundation",
    "estimatedHours": 16,
    "prerequisites": [
      "elementary-algebra",
      "euclidean-geometry"
    ],
    "concepts": {
      "en": [
        "unit circle",
        "identities",
        "sinusoids"
      ],
      "es": [
        "circunferencia unidad",
        "identidades",
        "sinusoides"
      ]
    },
    "summary": {
      "en": "Build a working understanding of trigonometry through unit circle, identities, and sinusoids.",
      "es": "Construye una comprensión práctica de trigonometría mediante circunferencia unidad, identidades y sinusoides."
    },
    "keywords": [
      "trigonometry",
      "trigonometría",
      "unit circle",
      "identities",
      "sinusoids",
      "circunferencia unidad",
      "identidades",
      "sinusoides"
    ]
  },
  {
    "id": "vectors",
    "title": {
      "en": "Vectors",
      "es": "Vectores"
    },
    "domain": "math",
    "area": "algebra",
    "level": "foundation",
    "estimatedHours": 14,
    "prerequisites": [
      "trigonometry",
      "elementary-algebra"
    ],
    "concepts": {
      "en": [
        "components",
        "dot product",
        "cross product"
      ],
      "es": [
        "componentes",
        "producto escalar",
        "producto vectorial"
      ]
    },
    "summary": {
      "en": "Build a working understanding of vectors through components, dot product, and cross product.",
      "es": "Construye una comprensión práctica de vectores mediante componentes, producto escalar y producto vectorial."
    },
    "keywords": [
      "vectors",
      "vectores",
      "components",
      "dot product",
      "cross product",
      "componentes",
      "producto escalar",
      "producto vectorial"
    ]
  },
  {
    "id": "analytic-geometry",
    "title": {
      "en": "Analytic geometry",
      "es": "Geometría analítica"
    },
    "domain": "math",
    "area": "geometry",
    "level": "foundation",
    "estimatedHours": 12,
    "prerequisites": [
      "functions-graphs",
      "euclidean-geometry"
    ],
    "concepts": {
      "en": [
        "conic sections",
        "coordinate systems",
        "distance"
      ],
      "es": [
        "cónicas",
        "sistemas de coordenadas",
        "distancia"
      ]
    },
    "summary": {
      "en": "Build a working understanding of analytic geometry through conic sections, coordinate systems, and distance.",
      "es": "Construye una comprensión práctica de geometría analítica mediante cónicas, sistemas de coordenadas y distancia."
    },
    "keywords": [
      "analytic geometry",
      "geometría analítica",
      "conic sections",
      "coordinate systems",
      "distance",
      "cónicas",
      "sistemas de coordenadas",
      "distancia"
    ]
  },
  {
    "id": "complex-numbers",
    "title": {
      "en": "Complex numbers",
      "es": "Números complejos"
    },
    "domain": "math",
    "area": "algebra",
    "level": "intermediate",
    "estimatedHours": 12,
    "prerequisites": [
      "elementary-algebra",
      "trigonometry"
    ],
    "concepts": {
      "en": [
        "complex plane",
        "Euler formula",
        "roots"
      ],
      "es": [
        "plano complejo",
        "fórmula de Euler",
        "raíces"
      ]
    },
    "summary": {
      "en": "Build a working understanding of complex numbers through complex plane, Euler formula, and roots.",
      "es": "Construye una comprensión práctica de números complejos mediante plano complejo, fórmula de Euler y raíces."
    },
    "keywords": [
      "complex numbers",
      "números complejos",
      "complex plane",
      "euler formula",
      "roots",
      "plano complejo",
      "fórmula de euler",
      "raíces"
    ]
  },
  {
    "id": "combinatorics",
    "title": {
      "en": "Combinatorics",
      "es": "Combinatoria"
    },
    "domain": "math",
    "area": "discrete",
    "level": "foundation",
    "estimatedHours": 16,
    "prerequisites": [
      "arithmetic",
      "elementary-algebra"
    ],
    "concepts": {
      "en": [
        "counting",
        "recurrences",
        "binomial coefficients"
      ],
      "es": [
        "conteo",
        "recurrencias",
        "coeficientes binomiales"
      ]
    },
    "summary": {
      "en": "Build a working understanding of combinatorics through counting, recurrences, and binomial coefficients.",
      "es": "Construye una comprensión práctica de combinatoria mediante conteo, recurrencias y coeficientes binomiales."
    },
    "keywords": [
      "combinatorics",
      "combinatoria",
      "counting",
      "recurrences",
      "binomial coefficients",
      "conteo",
      "recurrencias",
      "coeficientes binomiales"
    ]
  },
  {
    "id": "set-theory",
    "title": {
      "en": "Set theory",
      "es": "Teoría de conjuntos"
    },
    "domain": "math",
    "area": "math-foundations",
    "level": "intermediate",
    "estimatedHours": 14,
    "prerequisites": [
      "logic-proof"
    ],
    "concepts": {
      "en": [
        "relations",
        "cardinality",
        "power sets"
      ],
      "es": [
        "relaciones",
        "cardinalidad",
        "conjuntos potencia"
      ]
    },
    "summary": {
      "en": "Build a working understanding of set theory through relations, cardinality, and power sets.",
      "es": "Construye una comprensión práctica de teoría de conjuntos mediante relaciones, cardinalidad y conjuntos potencia."
    },
    "keywords": [
      "set theory",
      "teoría de conjuntos",
      "relations",
      "cardinality",
      "power sets",
      "relaciones",
      "cardinalidad",
      "conjuntos potencia"
    ]
  },
  {
    "id": "discrete-math",
    "title": {
      "en": "Discrete mathematics",
      "es": "Matemática discreta"
    },
    "domain": "math",
    "area": "discrete",
    "level": "intermediate",
    "estimatedHours": 20,
    "prerequisites": [
      "logic-proof",
      "combinatorics"
    ],
    "concepts": {
      "en": [
        "graph theory",
        "algorithms",
        "recurrences"
      ],
      "es": [
        "teoría de grafos",
        "algoritmos",
        "recurrencias"
      ]
    },
    "summary": {
      "en": "Build a working understanding of discrete mathematics through graph theory, algorithms, and recurrences.",
      "es": "Construye una comprensión práctica de matemática discreta mediante teoría de grafos, algoritmos y recurrencias."
    },
    "keywords": [
      "discrete mathematics",
      "matemática discreta",
      "graph theory",
      "algorithms",
      "recurrences",
      "teoría de grafos",
      "algoritmos",
      "recurrencias"
    ]
  },
  {
    "id": "limits-continuity",
    "title": {
      "en": "Limits and continuity",
      "es": "Límites y continuidad"
    },
    "domain": "math",
    "area": "calculus",
    "level": "foundation",
    "estimatedHours": 18,
    "prerequisites": [
      "functions-graphs",
      "trigonometry"
    ],
    "concepts": {
      "en": [
        "limits",
        "continuity",
        "asymptotics"
      ],
      "es": [
        "límites",
        "continuidad",
        "asintótica"
      ]
    },
    "summary": {
      "en": "Build a working understanding of limits and continuity through limits, continuity, and asymptotics.",
      "es": "Construye una comprensión práctica de límites y continuidad mediante límites, continuidad y asintótica."
    },
    "keywords": [
      "limits and continuity",
      "límites y continuidad",
      "limits",
      "continuity",
      "asymptotics",
      "límites",
      "continuidad",
      "asintótica"
    ]
  },
  {
    "id": "differential-calculus",
    "title": {
      "en": "Differential calculus",
      "es": "Cálculo diferencial"
    },
    "domain": "math",
    "area": "calculus",
    "level": "foundation",
    "estimatedHours": 22,
    "prerequisites": [
      "limits-continuity"
    ],
    "concepts": {
      "en": [
        "derivatives",
        "chain rule",
        "Taylor approximation"
      ],
      "es": [
        "derivadas",
        "regla de la cadena",
        "aproximación de Taylor"
      ]
    },
    "summary": {
      "en": "Build a working understanding of differential calculus through derivatives, chain rule, and Taylor approximation.",
      "es": "Construye una comprensión práctica de cálculo diferencial mediante derivadas, regla de la cadena y aproximación de Taylor."
    },
    "keywords": [
      "differential calculus",
      "cálculo diferencial",
      "derivatives",
      "chain rule",
      "taylor approximation",
      "derivadas",
      "regla de la cadena",
      "aproximación de taylor"
    ]
  },
  {
    "id": "integral-calculus",
    "title": {
      "en": "Integral calculus",
      "es": "Cálculo integral"
    },
    "domain": "math",
    "area": "calculus",
    "level": "foundation",
    "estimatedHours": 24,
    "prerequisites": [
      "differential-calculus"
    ],
    "concepts": {
      "en": [
        "fundamental theorem",
        "integration techniques",
        "improper integrals"
      ],
      "es": [
        "teorema fundamental",
        "técnicas de integración",
        "integrales impropias"
      ]
    },
    "summary": {
      "en": "Build a working understanding of integral calculus through fundamental theorem, integration techniques, and improper integrals.",
      "es": "Construye una comprensión práctica de cálculo integral mediante teorema fundamental, técnicas de integración y integrales impropias."
    },
    "keywords": [
      "integral calculus",
      "cálculo integral",
      "fundamental theorem",
      "integration techniques",
      "improper integrals",
      "teorema fundamental",
      "técnicas de integración",
      "integrales impropias"
    ]
  },
  {
    "id": "sequences-series",
    "title": {
      "en": "Sequences and series",
      "es": "Sucesiones y series"
    },
    "domain": "math",
    "area": "analysis",
    "level": "intermediate",
    "estimatedHours": 18,
    "prerequisites": [
      "limits-continuity",
      "elementary-algebra"
    ],
    "concepts": {
      "en": [
        "convergence tests",
        "power series",
        "Taylor series"
      ],
      "es": [
        "criterios de convergencia",
        "series de potencias",
        "series de Taylor"
      ]
    },
    "summary": {
      "en": "Build a working understanding of sequences and series through convergence tests, power series, and Taylor series.",
      "es": "Construye una comprensión práctica de sucesiones y series mediante criterios de convergencia, series de potencias y series de Taylor."
    },
    "keywords": [
      "sequences and series",
      "sucesiones y series",
      "convergence tests",
      "power series",
      "taylor series",
      "criterios de convergencia",
      "series de potencias",
      "series de taylor"
    ]
  },
  {
    "id": "linear-algebra",
    "title": {
      "en": "Linear algebra",
      "es": "Álgebra lineal"
    },
    "domain": "math",
    "area": "algebra",
    "level": "intermediate",
    "estimatedHours": 28,
    "prerequisites": [
      "vectors",
      "elementary-algebra"
    ],
    "concepts": {
      "en": [
        "vector spaces",
        "eigenvalues",
        "matrix decompositions"
      ],
      "es": [
        "espacios vectoriales",
        "autovalores",
        "descomposiciones matriciales"
      ]
    },
    "summary": {
      "en": "Build a working understanding of linear algebra through vector spaces, eigenvalues, and matrix decompositions.",
      "es": "Construye una comprensión práctica de álgebra lineal mediante espacios vectoriales, autovalores y descomposiciones matriciales."
    },
    "keywords": [
      "linear algebra",
      "álgebra lineal",
      "vector spaces",
      "eigenvalues",
      "matrix decompositions",
      "espacios vectoriales",
      "autovalores",
      "descomposiciones matriciales"
    ]
  },
  {
    "id": "probability",
    "title": {
      "en": "Probability",
      "es": "Probabilidad"
    },
    "domain": "math",
    "area": "probability-statistics",
    "level": "intermediate",
    "estimatedHours": 24,
    "prerequisites": [
      "combinatorics",
      "functions-graphs"
    ],
    "concepts": {
      "en": [
        "random variables",
        "Bayes theorem",
        "expectation"
      ],
      "es": [
        "variables aleatorias",
        "teorema de Bayes",
        "esperanza"
      ]
    },
    "summary": {
      "en": "Build a working understanding of probability through random variables, Bayes theorem, and expectation.",
      "es": "Construye una comprensión práctica de probabilidad mediante variables aleatorias, teorema de Bayes y esperanza."
    },
    "keywords": [
      "probability",
      "probabilidad",
      "random variables",
      "bayes theorem",
      "expectation",
      "variables aleatorias",
      "teorema de bayes",
      "esperanza"
    ]
  },
  {
    "id": "statistics",
    "title": {
      "en": "Statistics",
      "es": "Estadística"
    },
    "domain": "math",
    "area": "probability-statistics",
    "level": "intermediate",
    "estimatedHours": 24,
    "prerequisites": [
      "probability",
      "elementary-algebra"
    ],
    "concepts": {
      "en": [
        "estimation",
        "regression",
        "hypothesis testing"
      ],
      "es": [
        "estimación",
        "regresión",
        "contraste de hipótesis"
      ]
    },
    "summary": {
      "en": "Build a working understanding of statistics through estimation, regression, and hypothesis testing.",
      "es": "Construye una comprensión práctica de estadística mediante estimación, regresión y contraste de hipótesis."
    },
    "keywords": [
      "statistics",
      "estadística",
      "estimation",
      "regression",
      "hypothesis testing",
      "estimación",
      "regresión",
      "contraste de hipótesis"
    ]
  },
  {
    "id": "multivariable-calculus",
    "title": {
      "en": "Multivariable calculus",
      "es": "Cálculo multivariable"
    },
    "domain": "math",
    "area": "calculus",
    "level": "intermediate",
    "estimatedHours": 28,
    "prerequisites": [
      "integral-calculus",
      "linear-algebra"
    ],
    "concepts": {
      "en": [
        "partial derivatives",
        "multiple integrals",
        "Jacobian"
      ],
      "es": [
        "derivadas parciales",
        "integrales múltiples",
        "jacobiano"
      ]
    },
    "summary": {
      "en": "Build a working understanding of multivariable calculus through partial derivatives, multiple integrals, and Jacobian.",
      "es": "Construye una comprensión práctica de cálculo multivariable mediante derivadas parciales, integrales múltiples y jacobiano."
    },
    "keywords": [
      "multivariable calculus",
      "cálculo multivariable",
      "partial derivatives",
      "multiple integrals",
      "jacobian",
      "derivadas parciales",
      "integrales múltiples",
      "jacobiano"
    ]
  },
  {
    "id": "ordinary-differential-equations",
    "title": {
      "en": "Ordinary differential equations",
      "es": "Ecuaciones diferenciales ordinarias"
    },
    "domain": "math",
    "area": "calculus",
    "level": "intermediate",
    "estimatedHours": 28,
    "prerequisites": [
      "integral-calculus",
      "linear-algebra"
    ],
    "concepts": {
      "en": [
        "initial-value problems",
        "phase space",
        "stability"
      ],
      "es": [
        "problemas de valor inicial",
        "espacio de fases",
        "estabilidad"
      ]
    },
    "summary": {
      "en": "Build a working understanding of ordinary differential equations through initial-value problems, phase space, and stability.",
      "es": "Construye una comprensión práctica de ecuaciones diferenciales ordinarias mediante problemas de valor inicial, espacio de fases y estabilidad."
    },
    "keywords": [
      "ordinary differential equations",
      "ecuaciones diferenciales ordinarias",
      "initial-value problems",
      "phase space",
      "stability",
      "problemas de valor inicial",
      "espacio de fases",
      "estabilidad"
    ]
  },
  {
    "id": "vector-calculus",
    "title": {
      "en": "Vector calculus",
      "es": "Cálculo vectorial"
    },
    "domain": "math",
    "area": "calculus",
    "level": "intermediate",
    "estimatedHours": 24,
    "prerequisites": [
      "multivariable-calculus",
      "vectors"
    ],
    "concepts": {
      "en": [
        "gradient",
        "divergence and curl",
        "Stokes theorem"
      ],
      "es": [
        "gradiente",
        "divergencia y rotacional",
        "teorema de Stokes"
      ]
    },
    "summary": {
      "en": "Build a working understanding of vector calculus through gradient, divergence and curl, and Stokes theorem.",
      "es": "Construye una comprensión práctica de cálculo vectorial mediante gradiente, divergencia y rotacional y teorema de Stokes."
    },
    "keywords": [
      "vector calculus",
      "cálculo vectorial",
      "gradient",
      "divergence and curl",
      "stokes theorem",
      "gradiente",
      "divergencia y rotacional",
      "teorema de stokes"
    ]
  },
  {
    "id": "numerical-methods",
    "title": {
      "en": "Numerical methods",
      "es": "Métodos numéricos"
    },
    "domain": "math",
    "area": "computation",
    "level": "intermediate",
    "estimatedHours": 24,
    "prerequisites": [
      "differential-calculus",
      "linear-algebra"
    ],
    "concepts": {
      "en": [
        "root finding",
        "numerical integration",
        "conditioning"
      ],
      "es": [
        "búsqueda de raíces",
        "integración numérica",
        "condicionamiento"
      ]
    },
    "summary": {
      "en": "Build a working understanding of numerical methods through root finding, numerical integration, and conditioning.",
      "es": "Construye una comprensión práctica de métodos numéricos mediante búsqueda de raíces, integración numérica y condicionamiento."
    },
    "keywords": [
      "numerical methods",
      "métodos numéricos",
      "root finding",
      "numerical integration",
      "conditioning",
      "búsqueda de raíces",
      "integración numérica",
      "condicionamiento"
    ]
  },
  {
    "id": "optimization",
    "title": {
      "en": "Optimization",
      "es": "Optimización"
    },
    "domain": "math",
    "area": "computation",
    "level": "intermediate",
    "estimatedHours": 22,
    "prerequisites": [
      "multivariable-calculus",
      "linear-algebra"
    ],
    "concepts": {
      "en": [
        "convexity",
        "Lagrange multipliers",
        "gradient methods"
      ],
      "es": [
        "convexidad",
        "multiplicadores de Lagrange",
        "métodos de gradiente"
      ]
    },
    "summary": {
      "en": "Build a working understanding of optimization through convexity, Lagrange multipliers, and gradient methods.",
      "es": "Construye una comprensión práctica de optimización mediante convexidad, multiplicadores de Lagrange y métodos de gradiente."
    },
    "keywords": [
      "optimization",
      "optimización",
      "convexity",
      "lagrange multipliers",
      "gradient methods",
      "convexidad",
      "multiplicadores de lagrange",
      "métodos de gradiente"
    ]
  },
  {
    "id": "real-analysis",
    "title": {
      "en": "Real analysis",
      "es": "Análisis real"
    },
    "domain": "math",
    "area": "analysis",
    "level": "advanced",
    "estimatedHours": 36,
    "prerequisites": [
      "logic-proof",
      "sequences-series",
      "integral-calculus"
    ],
    "concepts": {
      "en": [
        "epsilon-delta proofs",
        "uniform convergence",
        "compactness"
      ],
      "es": [
        "pruebas épsilon-delta",
        "convergencia uniforme",
        "compacidad"
      ]
    },
    "summary": {
      "en": "Build a working understanding of real analysis through epsilon-delta proofs, uniform convergence, and compactness.",
      "es": "Construye una comprensión práctica de análisis real mediante pruebas épsilon-delta, convergencia uniforme y compacidad."
    },
    "keywords": [
      "real analysis",
      "análisis real",
      "epsilon-delta proofs",
      "uniform convergence",
      "compactness",
      "pruebas épsilon-delta",
      "convergencia uniforme",
      "compacidad"
    ]
  },
  {
    "id": "abstract-algebra",
    "title": {
      "en": "Abstract algebra",
      "es": "Álgebra abstracta"
    },
    "domain": "math",
    "area": "algebra",
    "level": "advanced",
    "estimatedHours": 34,
    "prerequisites": [
      "logic-proof",
      "set-theory",
      "linear-algebra"
    ],
    "concepts": {
      "en": [
        "groups",
        "rings",
        "fields"
      ],
      "es": [
        "grupos",
        "anillos",
        "cuerpos"
      ]
    },
    "summary": {
      "en": "Build a working understanding of abstract algebra through groups, rings, and fields.",
      "es": "Construye una comprensión práctica de álgebra abstracta mediante grupos, anillos y cuerpos."
    },
    "keywords": [
      "abstract algebra",
      "álgebra abstracta",
      "groups",
      "rings",
      "fields",
      "grupos",
      "anillos",
      "cuerpos"
    ]
  },
  {
    "id": "complex-analysis",
    "title": {
      "en": "Complex analysis",
      "es": "Análisis complejo"
    },
    "domain": "math",
    "area": "analysis",
    "level": "advanced",
    "estimatedHours": 34,
    "prerequisites": [
      "real-analysis",
      "complex-numbers"
    ],
    "concepts": {
      "en": [
        "holomorphic functions",
        "residues",
        "conformal maps"
      ],
      "es": [
        "funciones holomorfas",
        "residuos",
        "aplicaciones conformes"
      ]
    },
    "summary": {
      "en": "Build a working understanding of complex analysis through holomorphic functions, residues, and conformal maps.",
      "es": "Construye una comprensión práctica de análisis complejo mediante funciones holomorfas, residuos y aplicaciones conformes."
    },
    "keywords": [
      "complex analysis",
      "análisis complejo",
      "holomorphic functions",
      "residues",
      "conformal maps",
      "funciones holomorfas",
      "residuos",
      "aplicaciones conformes"
    ]
  },
  {
    "id": "topology",
    "title": {
      "en": "Topology",
      "es": "Topología"
    },
    "domain": "math",
    "area": "analysis",
    "level": "advanced",
    "estimatedHours": 34,
    "prerequisites": [
      "real-analysis",
      "set-theory"
    ],
    "concepts": {
      "en": [
        "topological spaces",
        "compactness",
        "connectedness"
      ],
      "es": [
        "espacios topológicos",
        "compacidad",
        "conexidad"
      ]
    },
    "summary": {
      "en": "Build a working understanding of topology through topological spaces, compactness, and connectedness.",
      "es": "Construye una comprensión práctica de topología mediante espacios topológicos, compacidad y conexidad."
    },
    "keywords": [
      "topology",
      "topología",
      "topological spaces",
      "compactness",
      "connectedness",
      "espacios topológicos",
      "compacidad",
      "conexidad"
    ]
  },
  {
    "id": "measure-theory",
    "title": {
      "en": "Measure theory",
      "es": "Teoría de la medida"
    },
    "domain": "math",
    "area": "analysis",
    "level": "advanced",
    "estimatedHours": 36,
    "prerequisites": [
      "real-analysis",
      "set-theory"
    ],
    "concepts": {
      "en": [
        "measurable sets",
        "Lebesgue integral",
        "convergence theorems"
      ],
      "es": [
        "conjuntos medibles",
        "integral de Lebesgue",
        "teoremas de convergencia"
      ]
    },
    "summary": {
      "en": "Build a working understanding of measure theory through measurable sets, Lebesgue integral, and convergence theorems.",
      "es": "Construye una comprensión práctica de teoría de la medida mediante conjuntos medibles, integral de Lebesgue y teoremas de convergencia."
    },
    "keywords": [
      "measure theory",
      "teoría de la medida",
      "measurable sets",
      "lebesgue integral",
      "convergence theorems",
      "conjuntos medibles",
      "integral de lebesgue",
      "teoremas de convergencia"
    ]
  },
  {
    "id": "functional-analysis",
    "title": {
      "en": "Functional analysis",
      "es": "Análisis funcional"
    },
    "domain": "math",
    "area": "analysis",
    "level": "advanced",
    "estimatedHours": 42,
    "prerequisites": [
      "measure-theory",
      "linear-algebra",
      "topology"
    ],
    "concepts": {
      "en": [
        "Banach spaces",
        "Hilbert spaces",
        "operators"
      ],
      "es": [
        "espacios de Banach",
        "espacios de Hilbert",
        "operadores"
      ]
    },
    "summary": {
      "en": "Build a working understanding of functional analysis through Banach spaces, Hilbert spaces, and operators.",
      "es": "Construye una comprensión práctica de análisis funcional mediante espacios de Banach, espacios de Hilbert y operadores."
    },
    "keywords": [
      "functional analysis",
      "análisis funcional",
      "banach spaces",
      "hilbert spaces",
      "operators",
      "espacios de banach",
      "espacios de hilbert",
      "operadores"
    ]
  },
  {
    "id": "differential-geometry",
    "title": {
      "en": "Differential geometry",
      "es": "Geometría diferencial"
    },
    "domain": "math",
    "area": "geometry",
    "level": "advanced",
    "estimatedHours": 40,
    "prerequisites": [
      "multivariable-calculus",
      "linear-algebra",
      "topology"
    ],
    "concepts": {
      "en": [
        "manifolds",
        "curvature",
        "geodesics"
      ],
      "es": [
        "variedades",
        "curvatura",
        "geodésicas"
      ]
    },
    "summary": {
      "en": "Build a working understanding of differential geometry through manifolds, curvature, and geodesics.",
      "es": "Construye una comprensión práctica de geometría diferencial mediante variedades, curvatura y geodésicas."
    },
    "keywords": [
      "differential geometry",
      "geometría diferencial",
      "manifolds",
      "curvature",
      "geodesics",
      "variedades",
      "curvatura",
      "geodésicas"
    ]
  },
  {
    "id": "tensor-calculus",
    "title": {
      "en": "Tensor calculus",
      "es": "Cálculo tensorial"
    },
    "domain": "math",
    "area": "geometry",
    "level": "advanced",
    "estimatedHours": 30,
    "prerequisites": [
      "linear-algebra",
      "multivariable-calculus"
    ],
    "concepts": {
      "en": [
        "tensors",
        "index notation",
        "covariant derivative"
      ],
      "es": [
        "tensores",
        "notación indicial",
        "derivada covariante"
      ]
    },
    "summary": {
      "en": "Build a working understanding of tensor calculus through tensors, index notation, and covariant derivative.",
      "es": "Construye una comprensión práctica de cálculo tensorial mediante tensores, notación indicial y derivada covariante."
    },
    "keywords": [
      "tensor calculus",
      "cálculo tensorial",
      "tensors",
      "index notation",
      "covariant derivative",
      "tensores",
      "notación indicial",
      "derivada covariante"
    ]
  },
  {
    "id": "stochastic-processes",
    "title": {
      "en": "Stochastic processes",
      "es": "Procesos estocásticos"
    },
    "domain": "math",
    "area": "probability-statistics",
    "level": "advanced",
    "estimatedHours": 34,
    "prerequisites": [
      "probability",
      "differential-calculus",
      "linear-algebra"
    ],
    "concepts": {
      "en": [
        "Markov chains",
        "Brownian motion",
        "martingales"
      ],
      "es": [
        "cadenas de Markov",
        "movimiento browniano",
        "martingalas"
      ]
    },
    "summary": {
      "en": "Build a working understanding of stochastic processes through Markov chains, Brownian motion, and martingales.",
      "es": "Construye una comprensión práctica de procesos estocásticos mediante cadenas de Markov, movimiento browniano y martingalas."
    },
    "keywords": [
      "stochastic processes",
      "procesos estocásticos",
      "markov chains",
      "brownian motion",
      "martingales",
      "cadenas de markov",
      "movimiento browniano",
      "martingalas"
    ]
  },
  {
    "id": "partial-differential-equations",
    "title": {
      "en": "Partial differential equations",
      "es": "Ecuaciones en derivadas parciales"
    },
    "domain": "math",
    "area": "calculus",
    "level": "advanced",
    "estimatedHours": 38,
    "prerequisites": [
      "ordinary-differential-equations",
      "multivariable-calculus",
      "linear-algebra"
    ],
    "concepts": {
      "en": [
        "boundary-value problems",
        "wave equation",
        "diffusion equation"
      ],
      "es": [
        "problemas de contorno",
        "ecuación de ondas",
        "ecuación de difusión"
      ]
    },
    "summary": {
      "en": "Build a working understanding of partial differential equations through boundary-value problems, wave equation, and diffusion equation.",
      "es": "Construye una comprensión práctica de ecuaciones en derivadas parciales mediante problemas de contorno, ecuación de ondas y ecuación de difusión."
    },
    "keywords": [
      "partial differential equations",
      "ecuaciones en derivadas parciales",
      "boundary-value problems",
      "wave equation",
      "diffusion equation",
      "problemas de contorno",
      "ecuación de ondas",
      "ecuación de difusión"
    ]
  },
  {
    "id": "group-theory",
    "title": {
      "en": "Group theory",
      "es": "Teoría de grupos"
    },
    "domain": "math",
    "area": "algebra",
    "level": "advanced",
    "estimatedHours": 28,
    "prerequisites": [
      "abstract-algebra"
    ],
    "concepts": {
      "en": [
        "group actions",
        "representations",
        "Lie groups"
      ],
      "es": [
        "acciones de grupo",
        "representaciones",
        "grupos de Lie"
      ]
    },
    "summary": {
      "en": "Build a working understanding of group theory through group actions, representations, and Lie groups.",
      "es": "Construye una comprensión práctica de teoría de grupos mediante acciones de grupo, representaciones y grupos de Lie."
    },
    "keywords": [
      "group theory",
      "teoría de grupos",
      "group actions",
      "representations",
      "lie groups",
      "acciones de grupo",
      "representaciones",
      "grupos de lie"
    ]
  },
  {
    "id": "distributions",
    "title": {
      "en": "Distributions",
      "es": "Distribuciones generalizadas"
    },
    "domain": "math",
    "area": "analysis",
    "level": "advanced",
    "estimatedHours": 26,
    "prerequisites": [
      "real-analysis",
      "partial-differential-equations"
    ],
    "concepts": {
      "en": [
        "test functions",
        "delta distribution",
        "weak derivatives"
      ],
      "es": [
        "funciones de prueba",
        "distribución delta",
        "derivadas débiles"
      ]
    },
    "summary": {
      "en": "Build a working understanding of distributions through test functions, delta distribution, and weak derivatives.",
      "es": "Construye una comprensión práctica de distribuciones generalizadas mediante funciones de prueba, distribución delta y derivadas débiles."
    },
    "keywords": [
      "distributions",
      "distribuciones generalizadas",
      "test functions",
      "delta distribution",
      "weak derivatives",
      "funciones de prueba",
      "distribución delta",
      "derivadas débiles"
    ]
  },
  {
    "id": "units-dimensions",
    "title": {
      "en": "Units and dimensional analysis",
      "es": "Unidades y análisis dimensional"
    },
    "domain": "bridge",
    "area": "scientific-methods",
    "level": "foundation",
    "estimatedHours": 10,
    "prerequisites": [
      "arithmetic",
      "elementary-algebra"
    ],
    "concepts": {
      "en": [
        "SI units",
        "dimensional consistency",
        "Buckingham Pi"
      ],
      "es": [
        "unidades SI",
        "consistencia dimensional",
        "teorema Pi de Buckingham"
      ]
    },
    "summary": {
      "en": "Build a working understanding of units and dimensional analysis through SI units, dimensional consistency, and Buckingham Pi.",
      "es": "Construye una comprensión práctica de unidades y análisis dimensional mediante unidades SI, consistencia dimensional y teorema Pi de Buckingham."
    },
    "keywords": [
      "units and dimensional analysis",
      "unidades y análisis dimensional",
      "si units",
      "dimensional consistency",
      "buckingham pi",
      "unidades si",
      "consistencia dimensional",
      "teorema pi de buckingham"
    ]
  },
  {
    "id": "estimation-scaling",
    "title": {
      "en": "Estimation and scaling",
      "es": "Estimación y escalado"
    },
    "domain": "bridge",
    "area": "scientific-methods",
    "level": "foundation",
    "estimatedHours": 12,
    "prerequisites": [
      "units-dimensions",
      "functions-graphs"
    ],
    "concepts": {
      "en": [
        "Fermi estimates",
        "power laws",
        "nondimensionalization"
      ],
      "es": [
        "estimaciones de Fermi",
        "leyes de potencia",
        "adimensionalización"
      ]
    },
    "summary": {
      "en": "Build a working understanding of estimation and scaling through Fermi estimates, power laws, and nondimensionalization.",
      "es": "Construye una comprensión práctica de estimación y escalado mediante estimaciones de Fermi, leyes de potencia y adimensionalización."
    },
    "keywords": [
      "estimation and scaling",
      "estimación y escalado",
      "fermi estimates",
      "power laws",
      "nondimensionalization",
      "estimaciones de fermi",
      "leyes de potencia",
      "adimensionalización"
    ]
  },
  {
    "id": "physical-measurement",
    "title": {
      "en": "Physical measurement",
      "es": "Medición física"
    },
    "domain": "physics",
    "area": "physics-foundations",
    "level": "foundation",
    "estimatedHours": 14,
    "prerequisites": [
      "units-dimensions",
      "statistics"
    ],
    "concepts": {
      "en": [
        "uncertainty",
        "significant figures",
        "calibration"
      ],
      "es": [
        "incertidumbre",
        "cifras significativas",
        "calibración"
      ]
    },
    "summary": {
      "en": "Build a working understanding of physical measurement through uncertainty, significant figures, and calibration.",
      "es": "Construye una comprensión práctica de medición física mediante incertidumbre, cifras significativas y calibración."
    },
    "keywords": [
      "physical measurement",
      "medición física",
      "uncertainty",
      "significant figures",
      "calibration",
      "incertidumbre",
      "cifras significativas",
      "calibración"
    ]
  },
  {
    "id": "conservation-laws",
    "title": {
      "en": "Conservation laws",
      "es": "Leyes de conservación"
    },
    "domain": "bridge",
    "area": "scientific-methods",
    "level": "intermediate",
    "estimatedHours": 14,
    "prerequisites": [
      "differential-calculus",
      "vectors"
    ],
    "concepts": {
      "en": [
        "energy",
        "momentum",
        "continuity equations"
      ],
      "es": [
        "energía",
        "momento",
        "ecuaciones de continuidad"
      ]
    },
    "summary": {
      "en": "Build a working understanding of conservation laws through energy, momentum, and continuity equations.",
      "es": "Construye una comprensión práctica de leyes de conservación mediante energía, momento y ecuaciones de continuidad."
    },
    "keywords": [
      "conservation laws",
      "leyes de conservación",
      "energy",
      "momentum",
      "continuity equations",
      "energía",
      "momento",
      "ecuaciones de continuidad"
    ]
  },
  {
    "id": "fourier-analysis",
    "title": {
      "en": "Fourier analysis",
      "es": "Análisis de Fourier"
    },
    "domain": "bridge",
    "area": "mathematical-methods",
    "level": "advanced",
    "estimatedHours": 28,
    "prerequisites": [
      "sequences-series",
      "integral-calculus",
      "complex-numbers"
    ],
    "concepts": {
      "en": [
        "Fourier series",
        "Fourier transform",
        "spectra"
      ],
      "es": [
        "series de Fourier",
        "transformada de Fourier",
        "espectros"
      ]
    },
    "summary": {
      "en": "Build a working understanding of fourier analysis through Fourier series, Fourier transform, and spectra.",
      "es": "Construye una comprensión práctica de análisis de fourier mediante series de Fourier, transformada de Fourier y espectros."
    },
    "keywords": [
      "fourier analysis",
      "análisis de fourier",
      "fourier series",
      "fourier transform",
      "spectra",
      "series de fourier",
      "transformada de fourier",
      "espectros"
    ]
  },
  {
    "id": "variational-principles",
    "title": {
      "en": "Variational principles",
      "es": "Principios variacionales"
    },
    "domain": "bridge",
    "area": "mathematical-methods",
    "level": "advanced",
    "estimatedHours": 24,
    "prerequisites": [
      "multivariable-calculus",
      "ordinary-differential-equations"
    ],
    "concepts": {
      "en": [
        "functionals",
        "Euler–Lagrange equation",
        "least action"
      ],
      "es": [
        "funcionales",
        "ecuación de Euler–Lagrange",
        "mínima acción"
      ]
    },
    "summary": {
      "en": "Build a working understanding of variational principles through functionals, Euler–Lagrange equation, and least action.",
      "es": "Construye una comprensión práctica de principios variacionales mediante funcionales, ecuación de Euler–Lagrange y mínima acción."
    },
    "keywords": [
      "variational principles",
      "principios variacionales",
      "functionals",
      "euler–lagrange equation",
      "least action",
      "funcionales",
      "ecuación de euler–lagrange",
      "mínima acción"
    ]
  },
  {
    "id": "symmetry-invariance",
    "title": {
      "en": "Symmetry and invariance",
      "es": "Simetría e invariancia"
    },
    "domain": "bridge",
    "area": "mathematical-methods",
    "level": "advanced",
    "estimatedHours": 28,
    "prerequisites": [
      "linear-algebra",
      "group-theory"
    ],
    "concepts": {
      "en": [
        "transformations",
        "representations",
        "Noether theorem"
      ],
      "es": [
        "transformaciones",
        "representaciones",
        "teorema de Noether"
      ]
    },
    "summary": {
      "en": "Build a working understanding of symmetry and invariance through transformations, representations, and Noether theorem.",
      "es": "Construye una comprensión práctica de simetría e invariancia mediante transformaciones, representaciones y teorema de Noether."
    },
    "keywords": [
      "symmetry and invariance",
      "simetría e invariancia",
      "transformations",
      "representations",
      "noether theorem",
      "transformaciones",
      "representaciones",
      "teorema de noether"
    ]
  },
  {
    "id": "perturbation-methods",
    "title": {
      "en": "Perturbation methods",
      "es": "Métodos perturbativos"
    },
    "domain": "bridge",
    "area": "mathematical-methods",
    "level": "advanced",
    "estimatedHours": 24,
    "prerequisites": [
      "ordinary-differential-equations",
      "sequences-series"
    ],
    "concepts": {
      "en": [
        "asymptotic expansions",
        "small parameters",
        "multiple scales"
      ],
      "es": [
        "expansiones asintóticas",
        "parámetros pequeños",
        "escalas múltiples"
      ]
    },
    "summary": {
      "en": "Build a working understanding of perturbation methods through asymptotic expansions, small parameters, and multiple scales.",
      "es": "Construye una comprensión práctica de métodos perturbativos mediante expansiones asintóticas, parámetros pequeños y escalas múltiples."
    },
    "keywords": [
      "perturbation methods",
      "métodos perturbativos",
      "asymptotic expansions",
      "small parameters",
      "multiple scales",
      "expansiones asintóticas",
      "parámetros pequeños",
      "escalas múltiples"
    ]
  },
  {
    "id": "scientific-computing",
    "title": {
      "en": "Scientific computing",
      "es": "Computación científica"
    },
    "domain": "bridge",
    "area": "computation",
    "level": "intermediate",
    "estimatedHours": 24,
    "prerequisites": [
      "numerical-methods",
      "elementary-algebra"
    ],
    "concepts": {
      "en": [
        "algorithms",
        "reproducibility",
        "error analysis"
      ],
      "es": [
        "algoritmos",
        "reproducibilidad",
        "análisis de errores"
      ]
    },
    "summary": {
      "en": "Build a working understanding of scientific computing through algorithms, reproducibility, and error analysis.",
      "es": "Construye una comprensión práctica de computación científica mediante algoritmos, reproducibilidad y análisis de errores."
    },
    "keywords": [
      "scientific computing",
      "computación científica",
      "algorithms",
      "reproducibility",
      "error analysis",
      "algoritmos",
      "reproducibilidad",
      "análisis de errores"
    ]
  },
  {
    "id": "data-modeling",
    "title": {
      "en": "Data modeling",
      "es": "Modelado de datos"
    },
    "domain": "bridge",
    "area": "computation",
    "level": "intermediate",
    "estimatedHours": 22,
    "prerequisites": [
      "statistics",
      "numerical-methods"
    ],
    "concepts": {
      "en": [
        "model selection",
        "parameter estimation",
        "validation"
      ],
      "es": [
        "selección de modelos",
        "estimación de parámetros",
        "validación"
      ]
    },
    "summary": {
      "en": "Build a working understanding of data modeling through model selection, parameter estimation, and validation.",
      "es": "Construye una comprensión práctica de modelado de datos mediante selección de modelos, estimación de parámetros y validación."
    },
    "keywords": [
      "data modeling",
      "modelado de datos",
      "model selection",
      "parameter estimation",
      "validation",
      "selección de modelos",
      "estimación de parámetros",
      "validación"
    ]
  },
  {
    "id": "green-functions",
    "title": {
      "en": "Green functions",
      "es": "Funciones de Green"
    },
    "domain": "bridge",
    "area": "mathematical-methods",
    "level": "advanced",
    "estimatedHours": 30,
    "prerequisites": [
      "partial-differential-equations",
      "distributions",
      "fourier-analysis"
    ],
    "concepts": {
      "en": [
        "fundamental solutions",
        "convolution",
        "boundary conditions"
      ],
      "es": [
        "soluciones fundamentales",
        "convolución",
        "condiciones de contorno"
      ]
    },
    "summary": {
      "en": "Build a working understanding of green functions through fundamental solutions, convolution, and boundary conditions.",
      "es": "Construye una comprensión práctica de funciones de green mediante soluciones fundamentales, convolución y condiciones de contorno."
    },
    "keywords": [
      "green functions",
      "funciones de green",
      "fundamental solutions",
      "convolution",
      "boundary conditions",
      "soluciones fundamentales",
      "convolución",
      "condiciones de contorno"
    ]
  },
  {
    "id": "kinematics",
    "title": {
      "en": "Kinematics",
      "es": "Cinemática"
    },
    "domain": "physics",
    "area": "mechanics",
    "level": "foundation",
    "estimatedHours": 18,
    "prerequisites": [
      "vectors",
      "differential-calculus",
      "physical-measurement"
    ],
    "concepts": {
      "en": [
        "position and velocity",
        "acceleration",
        "reference frames"
      ],
      "es": [
        "posición y velocidad",
        "aceleración",
        "sistemas de referencia"
      ]
    },
    "summary": {
      "en": "Build a working understanding of kinematics through position and velocity, acceleration, and reference frames.",
      "es": "Construye una comprensión práctica de cinemática mediante posición y velocidad, aceleración y sistemas de referencia."
    },
    "keywords": [
      "kinematics",
      "cinemática",
      "position and velocity",
      "acceleration",
      "reference frames",
      "posición y velocidad",
      "aceleración",
      "sistemas de referencia"
    ]
  },
  {
    "id": "newtonian-dynamics",
    "title": {
      "en": "Newtonian dynamics",
      "es": "Dinámica newtoniana"
    },
    "domain": "physics",
    "area": "mechanics",
    "level": "foundation",
    "estimatedHours": 24,
    "prerequisites": [
      "kinematics",
      "conservation-laws"
    ],
    "concepts": {
      "en": [
        "Newton laws",
        "forces",
        "free-body diagrams"
      ],
      "es": [
        "leyes de Newton",
        "fuerzas",
        "diagramas de cuerpo libre"
      ]
    },
    "summary": {
      "en": "Build a working understanding of newtonian dynamics through Newton laws, forces, and free-body diagrams.",
      "es": "Construye una comprensión práctica de dinámica newtoniana mediante leyes de Newton, fuerzas y diagramas de cuerpo libre."
    },
    "keywords": [
      "newtonian dynamics",
      "dinámica newtoniana",
      "newton laws",
      "forces",
      "free-body diagrams",
      "leyes de newton",
      "fuerzas",
      "diagramas de cuerpo libre"
    ]
  },
  {
    "id": "work-energy-momentum",
    "title": {
      "en": "Work, energy, and momentum",
      "es": "Trabajo, energía y momento"
    },
    "domain": "physics",
    "area": "mechanics",
    "level": "intermediate",
    "estimatedHours": 22,
    "prerequisites": [
      "newtonian-dynamics",
      "integral-calculus"
    ],
    "concepts": {
      "en": [
        "work-energy theorem",
        "impulse",
        "collisions"
      ],
      "es": [
        "teorema trabajo-energía",
        "impulso",
        "colisiones"
      ]
    },
    "summary": {
      "en": "Build a working understanding of work, energy, and momentum through work-energy theorem, impulse, and collisions.",
      "es": "Construye una comprensión práctica de trabajo, energía y momento mediante teorema trabajo-energía, impulso y colisiones."
    },
    "keywords": [
      "work, energy, and momentum",
      "trabajo, energía y momento",
      "work-energy theorem",
      "impulse",
      "collisions",
      "teorema trabajo-energía",
      "impulso",
      "colisiones"
    ]
  },
  {
    "id": "rotational-dynamics",
    "title": {
      "en": "Rotational dynamics",
      "es": "Dinámica de rotación"
    },
    "domain": "physics",
    "area": "mechanics",
    "level": "intermediate",
    "estimatedHours": 22,
    "prerequisites": [
      "work-energy-momentum",
      "linear-algebra"
    ],
    "concepts": {
      "en": [
        "torque",
        "angular momentum",
        "inertia tensor"
      ],
      "es": [
        "torque",
        "momento angular",
        "tensor de inercia"
      ]
    },
    "summary": {
      "en": "Build a working understanding of rotational dynamics through torque, angular momentum, and inertia tensor.",
      "es": "Construye una comprensión práctica de dinámica de rotación mediante torque, momento angular y tensor de inercia."
    },
    "keywords": [
      "rotational dynamics",
      "dinámica de rotación",
      "torque",
      "angular momentum",
      "inertia tensor",
      "momento angular",
      "tensor de inercia"
    ]
  },
  {
    "id": "oscillations",
    "title": {
      "en": "Oscillations",
      "es": "Oscilaciones"
    },
    "domain": "physics",
    "area": "waves",
    "level": "intermediate",
    "estimatedHours": 20,
    "prerequisites": [
      "ordinary-differential-equations",
      "newtonian-dynamics"
    ],
    "concepts": {
      "en": [
        "harmonic motion",
        "resonance",
        "normal modes"
      ],
      "es": [
        "movimiento armónico",
        "resonancia",
        "modos normales"
      ]
    },
    "summary": {
      "en": "Build a working understanding of oscillations through harmonic motion, resonance, and normal modes.",
      "es": "Construye una comprensión práctica de oscilaciones mediante movimiento armónico, resonancia y modos normales."
    },
    "keywords": [
      "oscillations",
      "oscilaciones",
      "harmonic motion",
      "resonance",
      "normal modes",
      "movimiento armónico",
      "resonancia",
      "modos normales"
    ]
  },
  {
    "id": "central-force-motion",
    "title": {
      "en": "Central-force motion",
      "es": "Movimiento bajo fuerzas centrales"
    },
    "domain": "physics",
    "area": "mechanics",
    "level": "advanced",
    "estimatedHours": 24,
    "prerequisites": [
      "rotational-dynamics",
      "ordinary-differential-equations"
    ],
    "concepts": {
      "en": [
        "orbits",
        "effective potential",
        "Kepler problem"
      ],
      "es": [
        "órbitas",
        "potencial efectivo",
        "problema de Kepler"
      ]
    },
    "summary": {
      "en": "Build a working understanding of central-force motion through orbits, effective potential, and Kepler problem.",
      "es": "Construye una comprensión práctica de movimiento bajo fuerzas centrales mediante órbitas, potencial efectivo y problema de Kepler."
    },
    "keywords": [
      "central-force motion",
      "movimiento bajo fuerzas centrales",
      "orbits",
      "effective potential",
      "kepler problem",
      "órbitas",
      "potencial efectivo",
      "problema de kepler"
    ]
  },
  {
    "id": "lagrangian-mechanics",
    "title": {
      "en": "Lagrangian mechanics",
      "es": "Mecánica lagrangiana"
    },
    "domain": "physics",
    "area": "mechanics",
    "level": "advanced",
    "estimatedHours": 30,
    "prerequisites": [
      "variational-principles",
      "work-energy-momentum"
    ],
    "concepts": {
      "en": [
        "generalized coordinates",
        "Lagrangian",
        "constraints"
      ],
      "es": [
        "coordenadas generalizadas",
        "lagrangiano",
        "restricciones"
      ]
    },
    "summary": {
      "en": "Build a working understanding of lagrangian mechanics through generalized coordinates, Lagrangian, and constraints.",
      "es": "Construye una comprensión práctica de mecánica lagrangiana mediante coordenadas generalizadas, lagrangiano y restricciones."
    },
    "keywords": [
      "lagrangian mechanics",
      "mecánica lagrangiana",
      "generalized coordinates",
      "lagrangian",
      "constraints",
      "coordenadas generalizadas",
      "lagrangiano",
      "restricciones"
    ]
  },
  {
    "id": "hamiltonian-mechanics",
    "title": {
      "en": "Hamiltonian mechanics",
      "es": "Mecánica hamiltoniana"
    },
    "domain": "physics",
    "area": "mechanics",
    "level": "advanced",
    "estimatedHours": 30,
    "prerequisites": [
      "lagrangian-mechanics",
      "multivariable-calculus"
    ],
    "concepts": {
      "en": [
        "phase space",
        "Poisson brackets",
        "canonical transformations"
      ],
      "es": [
        "espacio de fases",
        "corchetes de Poisson",
        "transformaciones canónicas"
      ]
    },
    "summary": {
      "en": "Build a working understanding of hamiltonian mechanics through phase space, Poisson brackets, and canonical transformations.",
      "es": "Construye una comprensión práctica de mecánica hamiltoniana mediante espacio de fases, corchetes de Poisson y transformaciones canónicas."
    },
    "keywords": [
      "hamiltonian mechanics",
      "mecánica hamiltoniana",
      "phase space",
      "poisson brackets",
      "canonical transformations",
      "espacio de fases",
      "corchetes de poisson",
      "transformaciones canónicas"
    ]
  },
  {
    "id": "continuum-mechanics",
    "title": {
      "en": "Continuum mechanics",
      "es": "Mecánica de medios continuos"
    },
    "domain": "physics",
    "area": "mechanics",
    "level": "advanced",
    "estimatedHours": 34,
    "prerequisites": [
      "tensor-calculus",
      "newtonian-dynamics",
      "partial-differential-equations"
    ],
    "concepts": {
      "en": [
        "stress tensor",
        "strain",
        "constitutive laws"
      ],
      "es": [
        "tensor de tensiones",
        "deformación",
        "leyes constitutivas"
      ]
    },
    "summary": {
      "en": "Build a working understanding of continuum mechanics through stress tensor, strain, and constitutive laws.",
      "es": "Construye una comprensión práctica de mecánica de medios continuos mediante tensor de tensiones, deformación y leyes constitutivas."
    },
    "keywords": [
      "continuum mechanics",
      "mecánica de medios continuos",
      "stress tensor",
      "strain",
      "constitutive laws",
      "tensor de tensiones",
      "deformación",
      "leyes constitutivas"
    ]
  },
  {
    "id": "fluid-dynamics",
    "title": {
      "en": "Fluid dynamics",
      "es": "Dinámica de fluidos"
    },
    "domain": "physics",
    "area": "mechanics",
    "level": "advanced",
    "estimatedHours": 34,
    "prerequisites": [
      "continuum-mechanics",
      "vector-calculus"
    ],
    "concepts": {
      "en": [
        "Navier–Stokes equations",
        "viscosity",
        "vorticity"
      ],
      "es": [
        "ecuaciones de Navier–Stokes",
        "viscosidad",
        "vorticidad"
      ]
    },
    "summary": {
      "en": "Build a working understanding of fluid dynamics through Navier–Stokes equations, viscosity, and vorticity.",
      "es": "Construye una comprensión práctica de dinámica de fluidos mediante ecuaciones de Navier–Stokes, viscosidad y vorticidad."
    },
    "keywords": [
      "fluid dynamics",
      "dinámica de fluidos",
      "navier–stokes equations",
      "viscosity",
      "vorticity",
      "ecuaciones de navier–stokes",
      "viscosidad",
      "vorticidad"
    ]
  },
  {
    "id": "wave-physics",
    "title": {
      "en": "Wave physics",
      "es": "Física de ondas"
    },
    "domain": "physics",
    "area": "waves",
    "level": "intermediate",
    "estimatedHours": 28,
    "prerequisites": [
      "oscillations",
      "partial-differential-equations",
      "fourier-analysis"
    ],
    "concepts": {
      "en": [
        "wave equation",
        "dispersion",
        "interference"
      ],
      "es": [
        "ecuación de ondas",
        "dispersión",
        "interferencia"
      ]
    },
    "summary": {
      "en": "Build a working understanding of wave physics through wave equation, dispersion, and interference.",
      "es": "Construye una comprensión práctica de física de ondas mediante ecuación de ondas, dispersión y interferencia."
    },
    "keywords": [
      "wave physics",
      "física de ondas",
      "wave equation",
      "dispersion",
      "interference",
      "ecuación de ondas",
      "dispersión",
      "interferencia"
    ]
  },
  {
    "id": "acoustics",
    "title": {
      "en": "Acoustics",
      "es": "Acústica"
    },
    "domain": "physics",
    "area": "waves",
    "level": "advanced",
    "estimatedHours": 20,
    "prerequisites": [
      "wave-physics",
      "fluid-dynamics"
    ],
    "concepts": {
      "en": [
        "sound pressure",
        "resonators",
        "room acoustics"
      ],
      "es": [
        "presión sonora",
        "resonadores",
        "acústica de salas"
      ]
    },
    "summary": {
      "en": "Build a working understanding of acoustics through sound pressure, resonators, and room acoustics.",
      "es": "Construye una comprensión práctica de acústica mediante presión sonora, resonadores y acústica de salas."
    },
    "keywords": [
      "acoustics",
      "acústica",
      "sound pressure",
      "resonators",
      "room acoustics",
      "presión sonora",
      "resonadores",
      "acústica de salas"
    ]
  },
  {
    "id": "temperature-heat",
    "title": {
      "en": "Temperature and heat",
      "es": "Temperatura y calor"
    },
    "domain": "physics",
    "area": "thermal-physics",
    "level": "foundation",
    "estimatedHours": 18,
    "prerequisites": [
      "physical-measurement",
      "integral-calculus"
    ],
    "concepts": {
      "en": [
        "temperature scales",
        "heat capacity",
        "heat transfer"
      ],
      "es": [
        "escalas de temperatura",
        "capacidad calorífica",
        "transferencia de calor"
      ]
    },
    "summary": {
      "en": "Build a working understanding of temperature and heat through temperature scales, heat capacity, and heat transfer.",
      "es": "Construye una comprensión práctica de temperatura y calor mediante escalas de temperatura, capacidad calorífica y transferencia de calor."
    },
    "keywords": [
      "temperature and heat",
      "temperatura y calor",
      "temperature scales",
      "heat capacity",
      "heat transfer",
      "escalas de temperatura",
      "capacidad calorífica",
      "transferencia de calor"
    ]
  },
  {
    "id": "thermodynamics",
    "title": {
      "en": "Thermodynamics",
      "es": "Termodinámica"
    },
    "domain": "physics",
    "area": "thermal-physics",
    "level": "intermediate",
    "estimatedHours": 26,
    "prerequisites": [
      "temperature-heat",
      "work-energy-momentum"
    ],
    "concepts": {
      "en": [
        "entropy",
        "state functions",
        "thermodynamic cycles"
      ],
      "es": [
        "entropía",
        "funciones de estado",
        "ciclos termodinámicos"
      ]
    },
    "summary": {
      "en": "Build a working understanding of thermodynamics through entropy, state functions, and thermodynamic cycles.",
      "es": "Construye una comprensión práctica de termodinámica mediante entropía, funciones de estado y ciclos termodinámicos."
    },
    "keywords": [
      "thermodynamics",
      "termodinámica",
      "entropy",
      "state functions",
      "thermodynamic cycles",
      "entropía",
      "funciones de estado",
      "ciclos termodinámicos"
    ]
  },
  {
    "id": "kinetic-theory",
    "title": {
      "en": "Kinetic theory",
      "es": "Teoría cinética"
    },
    "domain": "physics",
    "area": "thermal-physics",
    "level": "advanced",
    "estimatedHours": 24,
    "prerequisites": [
      "thermodynamics",
      "probability",
      "newtonian-dynamics"
    ],
    "concepts": {
      "en": [
        "molecular collisions",
        "Maxwell distribution",
        "transport coefficients"
      ],
      "es": [
        "colisiones moleculares",
        "distribución de Maxwell",
        "coeficientes de transporte"
      ]
    },
    "summary": {
      "en": "Build a working understanding of kinetic theory through molecular collisions, Maxwell distribution, and transport coefficients.",
      "es": "Construye una comprensión práctica de teoría cinética mediante colisiones moleculares, distribución de Maxwell y coeficientes de transporte."
    },
    "keywords": [
      "kinetic theory",
      "teoría cinética",
      "molecular collisions",
      "maxwell distribution",
      "transport coefficients",
      "colisiones moleculares",
      "distribución de maxwell",
      "coeficientes de transporte"
    ]
  },
  {
    "id": "statistical-mechanics",
    "title": {
      "en": "Statistical mechanics",
      "es": "Mecánica estadística"
    },
    "domain": "physics",
    "area": "thermal-physics",
    "level": "advanced",
    "estimatedHours": 36,
    "prerequisites": [
      "thermodynamics",
      "probability",
      "sequences-series"
    ],
    "concepts": {
      "en": [
        "ensembles",
        "partition function",
        "phase transitions"
      ],
      "es": [
        "ensembles",
        "función de partición",
        "transiciones de fase"
      ]
    },
    "summary": {
      "en": "Build a working understanding of statistical mechanics through ensembles, partition function, and phase transitions.",
      "es": "Construye una comprensión práctica de mecánica estadística mediante ensembles, función de partición y transiciones de fase."
    },
    "keywords": [
      "statistical mechanics",
      "mecánica estadística",
      "ensembles",
      "partition function",
      "phase transitions",
      "función de partición",
      "transiciones de fase"
    ]
  },
  {
    "id": "electrostatics",
    "title": {
      "en": "Electrostatics",
      "es": "Electrostática"
    },
    "domain": "physics",
    "area": "electromagnetism",
    "level": "intermediate",
    "estimatedHours": 24,
    "prerequisites": [
      "vector-calculus",
      "physical-measurement"
    ],
    "concepts": {
      "en": [
        "Coulomb law",
        "Gauss law",
        "electric potential"
      ],
      "es": [
        "ley de Coulomb",
        "ley de Gauss",
        "potencial eléctrico"
      ]
    },
    "summary": {
      "en": "Build a working understanding of electrostatics through Coulomb law, Gauss law, and electric potential.",
      "es": "Construye una comprensión práctica de electrostática mediante ley de Coulomb, ley de Gauss y potencial eléctrico."
    },
    "keywords": [
      "electrostatics",
      "electrostática",
      "coulomb law",
      "gauss law",
      "electric potential",
      "ley de coulomb",
      "ley de gauss",
      "potencial eléctrico"
    ]
  },
  {
    "id": "electric-circuits",
    "title": {
      "en": "Electric circuits",
      "es": "Circuitos eléctricos"
    },
    "domain": "physics",
    "area": "electromagnetism",
    "level": "intermediate",
    "estimatedHours": 22,
    "prerequisites": [
      "electrostatics",
      "ordinary-differential-equations"
    ],
    "concepts": {
      "en": [
        "Kirchhoff laws",
        "RC and RLC circuits",
        "impedance"
      ],
      "es": [
        "leyes de Kirchhoff",
        "circuitos RC y RLC",
        "impedancia"
      ]
    },
    "summary": {
      "en": "Build a working understanding of electric circuits through Kirchhoff laws, RC and RLC circuits, and impedance.",
      "es": "Construye una comprensión práctica de circuitos eléctricos mediante leyes de Kirchhoff, circuitos RC y RLC y impedancia."
    },
    "keywords": [
      "electric circuits",
      "circuitos eléctricos",
      "kirchhoff laws",
      "rc and rlc circuits",
      "impedance",
      "leyes de kirchhoff",
      "circuitos rc y rlc",
      "impedancia"
    ]
  },
  {
    "id": "magnetostatics",
    "title": {
      "en": "Magnetostatics",
      "es": "Magnetostática"
    },
    "domain": "physics",
    "area": "electromagnetism",
    "level": "intermediate",
    "estimatedHours": 22,
    "prerequisites": [
      "electrostatics",
      "vector-calculus"
    ],
    "concepts": {
      "en": [
        "Biot–Savart law",
        "Ampère law",
        "vector potential"
      ],
      "es": [
        "ley de Biot–Savart",
        "ley de Ampère",
        "potencial vector"
      ]
    },
    "summary": {
      "en": "Build a working understanding of magnetostatics through Biot–Savart law, Ampère law, and vector potential.",
      "es": "Construye una comprensión práctica de magnetostática mediante ley de Biot–Savart, ley de Ampère y potencial vector."
    },
    "keywords": [
      "magnetostatics",
      "magnetostática",
      "biot–savart law",
      "ampère law",
      "vector potential",
      "ley de biot–savart",
      "ley de ampère",
      "potencial vector"
    ]
  },
  {
    "id": "maxwell-equations",
    "title": {
      "en": "Maxwell equations",
      "es": "Ecuaciones de Maxwell"
    },
    "domain": "physics",
    "area": "electromagnetism",
    "level": "advanced",
    "estimatedHours": 34,
    "prerequisites": [
      "magnetostatics",
      "partial-differential-equations",
      "vector-calculus"
    ],
    "concepts": {
      "en": [
        "electromagnetic induction",
        "displacement current",
        "boundary conditions"
      ],
      "es": [
        "inducción electromagnética",
        "corriente de desplazamiento",
        "condiciones de contorno"
      ]
    },
    "summary": {
      "en": "Build a working understanding of maxwell equations through electromagnetic induction, displacement current, and boundary conditions.",
      "es": "Construye una comprensión práctica de ecuaciones de maxwell mediante inducción electromagnética, corriente de desplazamiento y condiciones de contorno."
    },
    "keywords": [
      "maxwell equations",
      "ecuaciones de maxwell",
      "electromagnetic induction",
      "displacement current",
      "boundary conditions",
      "inducción electromagnética",
      "corriente de desplazamiento",
      "condiciones de contorno"
    ]
  },
  {
    "id": "electromagnetic-waves",
    "title": {
      "en": "Electromagnetic waves",
      "es": "Ondas electromagnéticas"
    },
    "domain": "physics",
    "area": "electromagnetism",
    "level": "advanced",
    "estimatedHours": 24,
    "prerequisites": [
      "maxwell-equations",
      "wave-physics"
    ],
    "concepts": {
      "en": [
        "polarization",
        "Poynting vector",
        "radiation"
      ],
      "es": [
        "polarización",
        "vector de Poynting",
        "radiación"
      ]
    },
    "summary": {
      "en": "Build a working understanding of electromagnetic waves through polarization, Poynting vector, and radiation.",
      "es": "Construye una comprensión práctica de ondas electromagnéticas mediante polarización, vector de Poynting y radiación."
    },
    "keywords": [
      "electromagnetic waves",
      "ondas electromagnéticas",
      "polarization",
      "poynting vector",
      "radiation",
      "polarización",
      "vector de poynting",
      "radiación"
    ]
  },
  {
    "id": "geometric-optics",
    "title": {
      "en": "Geometric optics",
      "es": "Óptica geométrica"
    },
    "domain": "physics",
    "area": "optics",
    "level": "foundation",
    "estimatedHours": 18,
    "prerequisites": [
      "trigonometry",
      "physical-measurement"
    ],
    "concepts": {
      "en": [
        "Snell law",
        "thin lenses",
        "optical instruments"
      ],
      "es": [
        "ley de Snell",
        "lentes delgadas",
        "instrumentos ópticos"
      ]
    },
    "summary": {
      "en": "Build a working understanding of geometric optics through Snell law, thin lenses, and optical instruments.",
      "es": "Construye una comprensión práctica de óptica geométrica mediante ley de Snell, lentes delgadas y instrumentos ópticos."
    },
    "keywords": [
      "geometric optics",
      "óptica geométrica",
      "snell law",
      "thin lenses",
      "optical instruments",
      "ley de snell",
      "lentes delgadas",
      "instrumentos ópticos"
    ]
  },
  {
    "id": "wave-optics",
    "title": {
      "en": "Wave optics",
      "es": "Óptica ondulatoria"
    },
    "domain": "physics",
    "area": "optics",
    "level": "advanced",
    "estimatedHours": 26,
    "prerequisites": [
      "geometric-optics",
      "electromagnetic-waves",
      "fourier-analysis"
    ],
    "concepts": {
      "en": [
        "diffraction",
        "coherence",
        "Fourier optics"
      ],
      "es": [
        "difracción",
        "coherencia",
        "óptica de Fourier"
      ]
    },
    "summary": {
      "en": "Build a working understanding of wave optics through diffraction, coherence, and Fourier optics.",
      "es": "Construye una comprensión práctica de óptica ondulatoria mediante difracción, coherencia y óptica de Fourier."
    },
    "keywords": [
      "wave optics",
      "óptica ondulatoria",
      "diffraction",
      "coherence",
      "fourier optics",
      "difracción",
      "coherencia",
      "óptica de fourier"
    ]
  },
  {
    "id": "special-relativity",
    "title": {
      "en": "Special relativity",
      "es": "Relatividad especial"
    },
    "domain": "physics",
    "area": "relativity",
    "level": "intermediate",
    "estimatedHours": 24,
    "prerequisites": [
      "vectors",
      "functions-graphs",
      "physical-measurement"
    ],
    "concepts": {
      "en": [
        "Lorentz transformations",
        "spacetime interval",
        "four-momentum"
      ],
      "es": [
        "transformaciones de Lorentz",
        "intervalo espacio-temporal",
        "cuadrimomento"
      ]
    },
    "summary": {
      "en": "Build a working understanding of special relativity through Lorentz transformations, spacetime interval, and four-momentum.",
      "es": "Construye una comprensión práctica de relatividad especial mediante transformaciones de Lorentz, intervalo espacio-temporal y cuadrimomento."
    },
    "keywords": [
      "special relativity",
      "relatividad especial",
      "lorentz transformations",
      "spacetime interval",
      "four-momentum",
      "transformaciones de lorentz",
      "intervalo espacio-temporal",
      "cuadrimomento"
    ]
  },
  {
    "id": "quantum-foundations",
    "title": {
      "en": "Quantum foundations",
      "es": "Fundamentos cuánticos"
    },
    "domain": "physics",
    "area": "quantum-physics",
    "level": "intermediate",
    "estimatedHours": 30,
    "prerequisites": [
      "wave-physics",
      "linear-algebra",
      "probability",
      "complex-numbers"
    ],
    "concepts": {
      "en": [
        "state vectors",
        "operators",
        "measurement"
      ],
      "es": [
        "vectores de estado",
        "operadores",
        "medición"
      ]
    },
    "summary": {
      "en": "Build a working understanding of quantum foundations through state vectors, operators, and measurement.",
      "es": "Construye una comprensión práctica de fundamentos cuánticos mediante vectores de estado, operadores y medición."
    },
    "keywords": [
      "quantum foundations",
      "fundamentos cuánticos",
      "state vectors",
      "operators",
      "measurement",
      "vectores de estado",
      "operadores",
      "medición"
    ]
  },
  {
    "id": "schrodinger-equation",
    "title": {
      "en": "Schrödinger equation",
      "es": "Ecuación de Schrödinger"
    },
    "domain": "physics",
    "area": "quantum-physics",
    "level": "advanced",
    "estimatedHours": 34,
    "prerequisites": [
      "quantum-foundations",
      "ordinary-differential-equations"
    ],
    "concepts": {
      "en": [
        "wave functions",
        "bound states",
        "tunneling"
      ],
      "es": [
        "funciones de onda",
        "estados ligados",
        "efecto túnel"
      ]
    },
    "summary": {
      "en": "Build a working understanding of schrödinger equation through wave functions, bound states, and tunneling.",
      "es": "Construye una comprensión práctica de ecuación de schrödinger mediante funciones de onda, estados ligados y efecto túnel."
    },
    "keywords": [
      "schrödinger equation",
      "ecuación de schrödinger",
      "wave functions",
      "bound states",
      "tunneling",
      "funciones de onda",
      "estados ligados",
      "efecto túnel"
    ]
  },
  {
    "id": "quantum-angular-momentum",
    "title": {
      "en": "Quantum angular momentum",
      "es": "Momento angular cuántico"
    },
    "domain": "physics",
    "area": "quantum-physics",
    "level": "advanced",
    "estimatedHours": 28,
    "prerequisites": [
      "schrodinger-equation",
      "symmetry-invariance"
    ],
    "concepts": {
      "en": [
        "commutators",
        "ladder operators",
        "spherical harmonics"
      ],
      "es": [
        "conmutadores",
        "operadores escalera",
        "armónicos esféricos"
      ]
    },
    "summary": {
      "en": "Build a working understanding of quantum angular momentum through commutators, ladder operators, and spherical harmonics.",
      "es": "Construye una comprensión práctica de momento angular cuántico mediante conmutadores, operadores escalera y armónicos esféricos."
    },
    "keywords": [
      "quantum angular momentum",
      "momento angular cuántico",
      "commutators",
      "ladder operators",
      "spherical harmonics",
      "conmutadores",
      "operadores escalera",
      "armónicos esféricos"
    ]
  },
  {
    "id": "spin",
    "title": {
      "en": "Spin",
      "es": "Espín"
    },
    "domain": "physics",
    "area": "quantum-physics",
    "level": "advanced",
    "estimatedHours": 24,
    "prerequisites": [
      "quantum-angular-momentum",
      "linear-algebra"
    ],
    "concepts": {
      "en": [
        "Pauli matrices",
        "spinors",
        "addition of angular momentum"
      ],
      "es": [
        "matrices de Pauli",
        "espinores",
        "suma de momentos angulares"
      ]
    },
    "summary": {
      "en": "Build a working understanding of spin through Pauli matrices, spinors, and addition of angular momentum.",
      "es": "Construye una comprensión práctica de espín mediante matrices de Pauli, espinores y suma de momentos angulares."
    },
    "keywords": [
      "spin",
      "espín",
      "pauli matrices",
      "spinors",
      "addition of angular momentum",
      "matrices de pauli",
      "espinores",
      "suma de momentos angulares"
    ]
  },
  {
    "id": "atomic-physics",
    "title": {
      "en": "Atomic physics",
      "es": "Física atómica"
    },
    "domain": "physics",
    "area": "quantum-physics",
    "level": "advanced",
    "estimatedHours": 30,
    "prerequisites": [
      "schrodinger-equation",
      "quantum-angular-momentum",
      "electrostatics"
    ],
    "concepts": {
      "en": [
        "hydrogen atom",
        "selection rules",
        "spectroscopy"
      ],
      "es": [
        "átomo de hidrógeno",
        "reglas de selección",
        "espectroscopia"
      ]
    },
    "summary": {
      "en": "Build a working understanding of atomic physics through hydrogen atom, selection rules, and spectroscopy.",
      "es": "Construye una comprensión práctica de física atómica mediante átomo de hidrógeno, reglas de selección y espectroscopia."
    },
    "keywords": [
      "atomic physics",
      "física atómica",
      "hydrogen atom",
      "selection rules",
      "spectroscopy",
      "átomo de hidrógeno",
      "reglas de selección",
      "espectroscopia"
    ]
  },
  {
    "id": "quantum-approximation",
    "title": {
      "en": "Quantum approximation methods",
      "es": "Métodos de aproximación cuántica"
    },
    "domain": "physics",
    "area": "quantum-physics",
    "level": "advanced",
    "estimatedHours": 30,
    "prerequisites": [
      "schrodinger-equation",
      "perturbation-methods"
    ],
    "concepts": {
      "en": [
        "perturbation theory",
        "variational method",
        "WKB"
      ],
      "es": [
        "teoría de perturbaciones",
        "método variacional",
        "WKB"
      ]
    },
    "summary": {
      "en": "Build a working understanding of quantum approximation methods through perturbation theory, variational method, and WKB.",
      "es": "Construye una comprensión práctica de métodos de aproximación cuántica mediante teoría de perturbaciones, método variacional y WKB."
    },
    "keywords": [
      "quantum approximation methods",
      "métodos de aproximación cuántica",
      "perturbation theory",
      "variational method",
      "wkb",
      "teoría de perturbaciones",
      "método variacional"
    ]
  },
  {
    "id": "quantum-statistics",
    "title": {
      "en": "Quantum statistics",
      "es": "Estadística cuántica"
    },
    "domain": "physics",
    "area": "quantum-physics",
    "level": "advanced",
    "estimatedHours": 28,
    "prerequisites": [
      "statistical-mechanics",
      "quantum-foundations"
    ],
    "concepts": {
      "en": [
        "bosons",
        "fermions",
        "degenerate gases"
      ],
      "es": [
        "bosones",
        "fermiones",
        "gases degenerados"
      ]
    },
    "summary": {
      "en": "Build a working understanding of quantum statistics through bosons, fermions, and degenerate gases.",
      "es": "Construye una comprensión práctica de estadística cuántica mediante bosones, fermiones y gases degenerados."
    },
    "keywords": [
      "quantum statistics",
      "estadística cuántica",
      "bosons",
      "fermions",
      "degenerate gases",
      "bosones",
      "fermiones",
      "gases degenerados"
    ]
  },
  {
    "id": "solid-state-physics",
    "title": {
      "en": "Solid-state physics",
      "es": "Física del estado sólido"
    },
    "domain": "physics",
    "area": "condensed-matter",
    "level": "advanced",
    "estimatedHours": 36,
    "prerequisites": [
      "quantum-statistics",
      "atomic-physics",
      "fourier-analysis"
    ],
    "concepts": {
      "en": [
        "crystals",
        "phonons",
        "band structure"
      ],
      "es": [
        "cristales",
        "fonones",
        "estructura de bandas"
      ]
    },
    "summary": {
      "en": "Build a working understanding of solid-state physics through crystals, phonons, and band structure.",
      "es": "Construye una comprensión práctica de física del estado sólido mediante cristales, fonones y estructura de bandas."
    },
    "keywords": [
      "solid-state physics",
      "física del estado sólido",
      "crystals",
      "phonons",
      "band structure",
      "cristales",
      "fonones",
      "estructura de bandas"
    ]
  },
  {
    "id": "semiconductor-physics",
    "title": {
      "en": "Semiconductor physics",
      "es": "Física de semiconductores"
    },
    "domain": "physics",
    "area": "condensed-matter",
    "level": "advanced",
    "estimatedHours": 26,
    "prerequisites": [
      "solid-state-physics",
      "electric-circuits"
    ],
    "concepts": {
      "en": [
        "charge carriers",
        "p–n junction",
        "transistors"
      ],
      "es": [
        "portadores de carga",
        "unión p–n",
        "transistores"
      ]
    },
    "summary": {
      "en": "Build a working understanding of semiconductor physics through charge carriers, p–n junction, and transistors.",
      "es": "Construye una comprensión práctica de física de semiconductores mediante portadores de carga, unión p–n y transistores."
    },
    "keywords": [
      "semiconductor physics",
      "física de semiconductores",
      "charge carriers",
      "p–n junction",
      "transistors",
      "portadores de carga",
      "unión p–n",
      "transistores"
    ]
  },
  {
    "id": "superconductivity",
    "title": {
      "en": "Superconductivity",
      "es": "Superconductividad"
    },
    "domain": "physics",
    "area": "condensed-matter",
    "level": "advanced",
    "estimatedHours": 26,
    "prerequisites": [
      "solid-state-physics",
      "quantum-statistics"
    ],
    "concepts": {
      "en": [
        "Meissner effect",
        "Cooper pairs",
        "flux quantization"
      ],
      "es": [
        "efecto Meissner",
        "pares de Cooper",
        "cuantización del flujo"
      ]
    },
    "summary": {
      "en": "Build a working understanding of superconductivity through Meissner effect, Cooper pairs, and flux quantization.",
      "es": "Construye una comprensión práctica de superconductividad mediante efecto Meissner, pares de Cooper y cuantización del flujo."
    },
    "keywords": [
      "superconductivity",
      "superconductividad",
      "meissner effect",
      "cooper pairs",
      "flux quantization",
      "efecto meissner",
      "pares de cooper",
      "cuantización del flujo"
    ]
  },
  {
    "id": "nuclear-physics",
    "title": {
      "en": "Nuclear physics",
      "es": "Física nuclear"
    },
    "domain": "physics",
    "area": "nuclear-particle",
    "level": "advanced",
    "estimatedHours": 32,
    "prerequisites": [
      "quantum-angular-momentum",
      "special-relativity"
    ],
    "concepts": {
      "en": [
        "nuclear models",
        "radioactive decay",
        "nuclear reactions"
      ],
      "es": [
        "modelos nucleares",
        "desintegración radiactiva",
        "reacciones nucleares"
      ]
    },
    "summary": {
      "en": "Build a working understanding of nuclear physics through nuclear models, radioactive decay, and nuclear reactions.",
      "es": "Construye una comprensión práctica de física nuclear mediante modelos nucleares, desintegración radiactiva y reacciones nucleares."
    },
    "keywords": [
      "nuclear physics",
      "física nuclear",
      "nuclear models",
      "radioactive decay",
      "nuclear reactions",
      "modelos nucleares",
      "desintegración radiactiva",
      "reacciones nucleares"
    ]
  },
  {
    "id": "particle-physics",
    "title": {
      "en": "Particle physics",
      "es": "Física de partículas"
    },
    "domain": "physics",
    "area": "nuclear-particle",
    "level": "advanced",
    "estimatedHours": 38,
    "prerequisites": [
      "nuclear-physics",
      "symmetry-invariance",
      "special-relativity"
    ],
    "concepts": {
      "en": [
        "Standard Model",
        "gauge symmetries",
        "scattering"
      ],
      "es": [
        "Modelo Estándar",
        "simetrías gauge",
        "dispersión"
      ]
    },
    "summary": {
      "en": "Build a working understanding of particle physics through Standard Model, gauge symmetries, and scattering.",
      "es": "Construye una comprensión práctica de física de partículas mediante Modelo Estándar, simetrías gauge y dispersión."
    },
    "keywords": [
      "particle physics",
      "física de partículas",
      "standard model",
      "gauge symmetries",
      "scattering",
      "modelo estándar",
      "simetrías gauge",
      "dispersión"
    ]
  },
  {
    "id": "quantum-field-theory",
    "title": {
      "en": "Quantum field theory",
      "es": "Teoría cuántica de campos"
    },
    "domain": "physics",
    "area": "nuclear-particle",
    "level": "advanced",
    "estimatedHours": 48,
    "prerequisites": [
      "particle-physics",
      "quantum-foundations",
      "special-relativity",
      "fourier-analysis"
    ],
    "concepts": {
      "en": [
        "field quantization",
        "Feynman diagrams",
        "renormalization"
      ],
      "es": [
        "cuantización de campos",
        "diagramas de Feynman",
        "renormalización"
      ]
    },
    "summary": {
      "en": "Build a working understanding of quantum field theory through field quantization, Feynman diagrams, and renormalization.",
      "es": "Construye una comprensión práctica de teoría cuántica de campos mediante cuantización de campos, diagramas de Feynman y renormalización."
    },
    "keywords": [
      "quantum field theory",
      "teoría cuántica de campos",
      "field quantization",
      "feynman diagrams",
      "renormalization",
      "cuantización de campos",
      "diagramas de feynman",
      "renormalización"
    ]
  },
  {
    "id": "general-relativity",
    "title": {
      "en": "General relativity",
      "es": "Relatividad general"
    },
    "domain": "physics",
    "area": "relativity",
    "level": "advanced",
    "estimatedHours": 44,
    "prerequisites": [
      "differential-geometry",
      "tensor-calculus",
      "special-relativity"
    ],
    "concepts": {
      "en": [
        "curved spacetime",
        "Einstein equations",
        "black holes"
      ],
      "es": [
        "espacio-tiempo curvo",
        "ecuaciones de Einstein",
        "agujeros negros"
      ]
    },
    "summary": {
      "en": "Build a working understanding of general relativity through curved spacetime, Einstein equations, and black holes.",
      "es": "Construye una comprensión práctica de relatividad general mediante espacio-tiempo curvo, ecuaciones de Einstein y agujeros negros."
    },
    "keywords": [
      "general relativity",
      "relatividad general",
      "curved spacetime",
      "einstein equations",
      "black holes",
      "espacio-tiempo curvo",
      "ecuaciones de einstein",
      "agujeros negros"
    ]
  },
  {
    "id": "cosmology",
    "title": {
      "en": "Cosmology",
      "es": "Cosmología"
    },
    "domain": "physics",
    "area": "astrophysics",
    "level": "advanced",
    "estimatedHours": 38,
    "prerequisites": [
      "general-relativity",
      "thermodynamics",
      "statistical-mechanics"
    ],
    "concepts": {
      "en": [
        "expanding universe",
        "cosmic microwave background",
        "structure formation"
      ],
      "es": [
        "universo en expansión",
        "fondo cósmico de microondas",
        "formación de estructura"
      ]
    },
    "summary": {
      "en": "Build a working understanding of cosmology through expanding universe, cosmic microwave background, and structure formation.",
      "es": "Construye una comprensión práctica de cosmología mediante universo en expansión, fondo cósmico de microondas y formación de estructura."
    },
    "keywords": [
      "cosmology",
      "cosmología",
      "expanding universe",
      "cosmic microwave background",
      "structure formation",
      "universo en expansión",
      "fondo cósmico de microondas",
      "formación de estructura"
    ]
  },
  {
    "id": "astrophysics",
    "title": {
      "en": "Astrophysics",
      "es": "Astrofísica"
    },
    "domain": "physics",
    "area": "astrophysics",
    "level": "advanced",
    "estimatedHours": 36,
    "prerequisites": [
      "central-force-motion",
      "maxwell-equations",
      "thermodynamics"
    ],
    "concepts": {
      "en": [
        "stellar structure",
        "radiative processes",
        "galactic dynamics"
      ],
      "es": [
        "estructura estelar",
        "procesos radiativos",
        "dinámica galáctica"
      ]
    },
    "summary": {
      "en": "Build a working understanding of astrophysics through stellar structure, radiative processes, and galactic dynamics.",
      "es": "Construye una comprensión práctica de astrofísica mediante estructura estelar, procesos radiativos y dinámica galáctica."
    },
    "keywords": [
      "astrophysics",
      "astrofísica",
      "stellar structure",
      "radiative processes",
      "galactic dynamics",
      "estructura estelar",
      "procesos radiativos",
      "dinámica galáctica"
    ]
  },
  {
    "id": "plasma-physics",
    "title": {
      "en": "Plasma physics",
      "es": "Física de plasmas"
    },
    "domain": "physics",
    "area": "condensed-matter",
    "level": "advanced",
    "estimatedHours": 34,
    "prerequisites": [
      "fluid-dynamics",
      "maxwell-equations",
      "statistical-mechanics"
    ],
    "concepts": {
      "en": [
        "Debye screening",
        "magnetohydrodynamics",
        "plasma waves"
      ],
      "es": [
        "apantallamiento de Debye",
        "magnetohidrodinámica",
        "ondas de plasma"
      ]
    },
    "summary": {
      "en": "Build a working understanding of plasma physics through Debye screening, magnetohydrodynamics, and plasma waves.",
      "es": "Construye una comprensión práctica de física de plasmas mediante apantallamiento de Debye, magnetohidrodinámica y ondas de plasma."
    },
    "keywords": [
      "plasma physics",
      "física de plasmas",
      "debye screening",
      "magnetohydrodynamics",
      "plasma waves",
      "apantallamiento de debye",
      "magnetohidrodinámica",
      "ondas de plasma"
    ]
  },
  {
    "id": "chaos-dynamical-systems",
    "title": {
      "en": "Chaos and dynamical systems",
      "es": "Caos y sistemas dinámicos"
    },
    "domain": "physics",
    "area": "complex-systems",
    "level": "advanced",
    "estimatedHours": 30,
    "prerequisites": [
      "ordinary-differential-equations",
      "numerical-methods",
      "oscillations"
    ],
    "concepts": {
      "en": [
        "phase portraits",
        "bifurcations",
        "strange attractors"
      ],
      "es": [
        "retratos de fase",
        "bifurcaciones",
        "atractores extraños"
      ]
    },
    "summary": {
      "en": "Build a working understanding of chaos and dynamical systems through phase portraits, bifurcations, and strange attractors.",
      "es": "Construye una comprensión práctica de caos y sistemas dinámicos mediante retratos de fase, bifurcaciones y atractores extraños."
    },
    "keywords": [
      "chaos and dynamical systems",
      "caos y sistemas dinámicos",
      "phase portraits",
      "bifurcations",
      "strange attractors",
      "retratos de fase",
      "bifurcaciones",
      "atractores extraños"
    ]
  },
  {
    "id": "computational-physics",
    "title": {
      "en": "Computational physics",
      "es": "Física computacional"
    },
    "domain": "physics",
    "area": "computation",
    "level": "advanced",
    "estimatedHours": 34,
    "prerequisites": [
      "scientific-computing",
      "data-modeling",
      "numerical-methods"
    ],
    "concepts": {
      "en": [
        "simulation",
        "verification and validation",
        "Monte Carlo"
      ],
      "es": [
        "simulación",
        "verificación y validación",
        "Monte Carlo"
      ]
    },
    "summary": {
      "en": "Build a working understanding of computational physics through simulation, verification and validation, and Monte Carlo.",
      "es": "Construye una comprensión práctica de física computacional mediante simulación, verificación y validación y Monte Carlo."
    },
    "keywords": [
      "computational physics",
      "física computacional",
      "simulation",
      "verification and validation",
      "monte carlo",
      "simulación",
      "verificación y validación"
    ]
  }
]);
