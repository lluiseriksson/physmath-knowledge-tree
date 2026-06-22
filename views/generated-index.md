# Generated Index

Generated from `graph/nodes/core.json` and `graph/edges.json`.

## Bridges

### Geometric Langlands transfer

- ID: `bridge.geometric_langlands_transfer`
- Confidence: `literature`
- Summary: Transforms arithmetic and representation-theoretic questions into geometric categorical language.
- Lean imports: `Mathlib.CategoryTheory.Category.Basic`
- Outgoing: bridge -> `domain.automorphic_forms`, suggests -> `problem.hodge_conjecture`

### Motives, periods and Hodge structures

- ID: `bridge.motives_periods_hodge`
- Confidence: `literature`
- Summary: Connects algebraic cycles, cohomology, periods and arithmetic shadows.
- Lean imports: `Mathlib.AlgebraicGeometry.Scheme`
- Outgoing: suggests -> `problem.hodge_conjecture`

### Proof complexity and geometry

- ID: `bridge.proof_complexity_geometry`
- Confidence: `literature`
- Summary: Studies computational lower bounds through algebraic, geometric and proof-system obstructions.
- Lean imports: `Mathlib.Computability.Basic`
- Outgoing: suggests -> `problem.p_vs_np`

### Random matrices, zeta zeros and spectra

- ID: `bridge.random_matrix_zeta_spectra`
- Confidence: `heuristic`
- Summary: Compares statistical behavior of zeta zeros with eigenvalue statistics from random matrix ensembles.
- Lean imports: `Mathlib.Probability.ProbabilityMassFunction.Basic`, `Mathlib.LinearAlgebra.Matrix.Spectrum`
- Outgoing: suggests -> `problem.riemann_hypothesis`

### Scaling and renormalization for critical PDE

- ID: `bridge.renormalization_scaling_pde`
- Confidence: `heuristic`
- Summary: Uses scaling, compactness and energy flow across scales to compare PDE and field-theoretic phenomena.
- Lean imports: `Mathlib.Analysis.Normed.Module.Basic`
- Outgoing: suggests -> `problem.navier_stokes`

### Trace formula as spectral arithmetic bridge

- ID: `bridge.trace_formula_spectral_arithmetic`
- Confidence: `literature`
- Summary: Relates spectral data, orbital/geometric data and arithmetic counting through trace identities.
- Lean imports: `Mathlib`
- Outgoing: suggests -> `problem.riemann_hypothesis`

## Domains

### Algebra

- ID: `domain.algebra`
- Confidence: `literature`
- Summary: Groups, rings, modules, fields, algebras and their structure-preserving maps.
- Lean imports: `Mathlib.Algebra.Group.Basic`, `Mathlib.RingTheory.Ideal.Basic`
- Outgoing: uses -> `domain.representation_theory`

### Algebraic geometry

- ID: `domain.algebraic_geometry`
- Confidence: `literature`
- Summary: Varieties, schemes, sheaves, cohomology and geometric encoding of algebraic data.
- Lean imports: `Mathlib.AlgebraicGeometry.Scheme`
- Outgoing: uses -> `domain.arithmetic_geometry`, uses -> `problem.hodge_conjecture`

### Analysis

- ID: `domain.analysis`
- Confidence: `literature`
- Summary: Limits, differentiability, integration, measure and analytic estimates.
- Lean imports: `Mathlib.Analysis.Calculus.Deriv.Basic`, `Mathlib.MeasureTheory.Measure.MeasureSpace`
- Outgoing: uses -> `domain.functional_analysis`, uses -> `domain.harmonic_analysis`

### Arithmetic geometry

- ID: `domain.arithmetic_geometry`
- Confidence: `literature`
- Summary: Number theory through geometric objects over fields, rings and schemes.
- Lean imports: `Mathlib.AlgebraicGeometry.Scheme`, `Mathlib.NumberTheory.NumberField.Basic`
- Outgoing: uses -> `problem.birch_swinnerton_dyer`

### Automorphic forms

- ID: `domain.automorphic_forms`
- Confidence: `literature`
- Summary: Symmetries, representations and analytic functions connecting geometry and arithmetic.
- Lean imports: `Mathlib.NumberTheory.ModularForms.Basic`
- Outgoing: bridge -> `domain.number_theory`, suggests -> `problem.riemann_hypothesis`, suggests -> `problem.birch_swinnerton_dyer`

### Category theory

- ID: `domain.category_theory`
- Confidence: `literature`
- Summary: Language of objects, morphisms, functors, natural transformations, adjunctions and universal properties.
- Lean imports: `Mathlib.CategoryTheory.Category.Basic`
- Outgoing: generalizes -> `domain.algebra`, uses -> `domain.algebraic_geometry`, suggests -> `problem.p_vs_np`

### Complexity theory

- ID: `domain.complexity_theory`
- Confidence: `literature`
- Summary: Resources needed for computation, reductions, circuits, proof systems and barriers.
- Lean imports: `Mathlib.Computability.Basic`
- Outgoing: uses -> `problem.p_vs_np`

### Differential geometry

- ID: `domain.differential_geometry`
- Confidence: `literature`
- Summary: Manifolds, tangent structures, connections, curvature and geometric flows.
- Lean imports: `Mathlib.Geometry.Manifold.Basic.SmoothManifoldWithCorners`
- Outgoing: uses -> `domain.gauge_theory`, uses -> `domain.general_relativity`, uses -> `problem.poincare_conjecture`

### Foundations, logic and type theory

- ID: `domain.foundation_logic`
- Confidence: `literature`
- Summary: Logical foundations, dependent type theory, proof terms and the formal substrate used by Lean.
- Lean imports: `Mathlib`
- Outgoing: uses -> `domain.category_theory`

### Functional analysis

- ID: `domain.functional_analysis`
- Confidence: `literature`
- Summary: Normed spaces, Banach and Hilbert spaces, operators and weak convergence.
- Lean imports: `Mathlib.Analysis.Normed.Module.Basic`, `Mathlib.Analysis.InnerProductSpace.Basic`
- Outgoing: uses -> `domain.spectral_theory`

### Gauge theory

- ID: `domain.gauge_theory`
- Confidence: `literature`
- Summary: Connections, curvature, principal bundles, gauge symmetry and Yang-Mills functionals.
- Lean imports: `Mathlib.Geometry.Manifold.VectorBundle.Basic`
- Outgoing: uses -> `domain.quantum_field_theory`, uses -> `problem.yang_mills_mass_gap`

### General relativity

- ID: `domain.general_relativity`
- Confidence: `literature`
- Summary: Lorentzian geometry, curvature, Einstein equations and geometric analysis.
- Lean imports: `Mathlib.Geometry.Manifold.Basic.SmoothManifoldWithCorners`

### Harmonic analysis

- ID: `domain.harmonic_analysis`
- Confidence: `literature`
- Summary: Fourier analysis, singular integrals, oscillation and scale-sensitive decomposition.
- Lean imports: `Mathlib.Analysis.Fourier.FourierTransform`
- Outgoing: uses -> `domain.pde`, uses -> `problem.navier_stokes`

### Noncommutative geometry

- ID: `domain.noncommutative_geometry`
- Confidence: `literature`
- Summary: Geometric reasoning where coordinate algebras need not commute.
- Lean imports: `Mathlib.Analysis.CStarAlgebra.Basic`
- Outgoing: suggests -> `problem.riemann_hypothesis`, bridge -> `domain.quantum_field_theory`

### Number theory

- ID: `domain.number_theory`
- Confidence: `literature`
- Summary: Integers, primes, zeta functions, arithmetic functions and Diophantine structure.
- Lean imports: `Mathlib.NumberTheory.ArithmeticFunction`, `Mathlib.NumberTheory.LSeries.RiemannZeta`
- Outgoing: bridge -> `domain.arithmetic_geometry`, uses -> `problem.riemann_hypothesis`, uses -> `problem.birch_swinnerton_dyer`

### Optimal transport

- ID: `domain.optimal_transport`
- Confidence: `literature`
- Summary: Geometry of probability measures, transport cost, Wasserstein spaces and curvature-like flow ideas.
- Lean imports: `Mathlib.MeasureTheory.Measure.MeasureSpace`
- Outgoing: bridge -> `domain.pde`

### Partial differential equations

- ID: `domain.pde`
- Confidence: `literature`
- Summary: Equations involving functions and derivatives across space, time and boundary data.
- Lean imports: `Mathlib.Analysis.Calculus.FDeriv.Basic`
- Outgoing: uses -> `problem.navier_stokes`

### Probability and stochastic processes

- ID: `domain.probability_stochastics`
- Confidence: `literature`
- Summary: Random variables, stochastic dynamics, concentration and probabilistic method.
- Lean imports: `Mathlib.Probability.ProbabilityMassFunction.Basic`
- Outgoing: bridge -> `domain.pde`, suggests -> `problem.navier_stokes`

### Quantum field theory

- ID: `domain.quantum_field_theory`
- Confidence: `heuristic`
- Summary: Fields, quantization, path integrals, operator algebras and renormalization heuristics.
- Lean imports: `Mathlib`
- Outgoing: uses -> `problem.yang_mills_mass_gap`

### Representation theory

- ID: `domain.representation_theory`
- Confidence: `literature`
- Summary: Study of algebraic structures through their actions on spaces.
- Lean imports: `Mathlib.RepresentationTheory.Basic`
- Outgoing: uses -> `domain.automorphic_forms`, suggests -> `problem.yang_mills_mass_gap`

### Spectral theory

- ID: `domain.spectral_theory`
- Confidence: `literature`
- Summary: Eigenvalues, spectra of operators, spectral gaps and trace information.
- Lean imports: `Mathlib.Analysis.InnerProductSpace.Spectrum`
- Outgoing: suggests -> `problem.riemann_hypothesis`, suggests -> `problem.yang_mills_mass_gap`

### Symplectic geometry

- ID: `domain.symplectic_geometry`
- Confidence: `literature`
- Summary: Hamiltonian geometry, phase space, symplectic forms and quantization shadows.
- Lean imports: `Mathlib.Geometry.Manifold.Algebra.SmoothFunctions`
- Outgoing: suggests -> `domain.quantum_field_theory`

### Topology

- ID: `domain.topology`
- Confidence: `literature`
- Summary: Continuity, compactness, connectedness, homotopy and global qualitative structure.
- Lean imports: `Mathlib.Topology.Basic`
- Outgoing: uses -> `domain.differential_geometry`, uses -> `problem.hodge_conjecture`, uses -> `problem.poincare_conjecture`

## Problems

### Birch and Swinnerton-Dyer Conjecture

- ID: `problem.birch_swinnerton_dyer`
- Confidence: `literature`
- Summary: The rank of an elliptic curve over the rationals should equal the order of vanishing of its L-function at one.
- Lean imports: `Mathlib.NumberTheory.EllipticCurve.Basic`

### Hodge Conjecture

- ID: `problem.hodge_conjecture`
- Confidence: `literature`
- Summary: Certain rational cohomology classes on smooth projective complex varieties should come from algebraic cycles.
- Lean imports: `Mathlib.AlgebraicGeometry.Scheme`

### Navier-Stokes existence and smoothness

- ID: `problem.navier_stokes`
- Confidence: `literature`
- Summary: Determine global existence and smoothness, or finite-time breakdown, for 3D incompressible Navier-Stokes.
- Lean imports: `Mathlib.Analysis.Calculus.FDeriv.Basic`

### P vs NP

- ID: `problem.p_vs_np`
- Confidence: `literature`
- Summary: Determine whether every efficiently verifiable problem is efficiently solvable.
- Lean imports: `Mathlib.Computability.Basic`

### Poincare Conjecture

- ID: `problem.poincare_conjecture`
- Confidence: `literature`
- Summary: Every closed simply connected 3-manifold is homeomorphic to the 3-sphere; solved by Perelman.
- Lean imports: `Mathlib.Geometry.Manifold.Basic.SmoothManifoldWithCorners`
- Outgoing: tests -> `problem.navier_stokes`

### Riemann Hypothesis

- ID: `problem.riemann_hypothesis`
- Confidence: `literature`
- Summary: Nontrivial zeros of the Riemann zeta function are expected to lie on the critical line.
- Lean imports: `Mathlib.NumberTheory.LSeries.RiemannZeta`

### Yang-Mills existence and mass gap

- ID: `problem.yang_mills_mass_gap`
- Confidence: `literature`
- Summary: Construct quantum Yang-Mills theory on four-dimensional space-time and prove a positive mass gap.
- Lean imports: `Mathlib`
