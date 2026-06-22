import PhysMathKnowledgeTree.Foundation

namespace PhysMathKnowledgeTree

inductive ProblemStatus where
  | unsolved
  | solved
  | calibration
  deriving Repr, BEq

structure ProblemCard extends KnowledgeNode where
  status : ProblemStatus
  clayName : String
  nextFormalTarget : String
  deriving Repr

def riemannHypothesis : ProblemCard :=
  { id := "problem.riemann_hypothesis",
    title := "Riemann Hypothesis",
    kind := NodeKind.problem,
    confidence := Confidence.literature,
    summary := "Zeros of the Riemann zeta function in the critical strip should lie on the critical line.",
    leanTargets := [
      { importName := "Mathlib",
        declaration := "riemannZeta",
        goal := "Track current zeta-function formalization and isolate elementary equivalent statements." }
    ],
    status := ProblemStatus.unsolved,
    clayName := "Riemann Hypothesis",
    nextFormalTarget := "Build a formal map from zeta definitions to finite explicit formula toys." }

def poincareCalibration : ProblemCard :=
  { id := "problem.poincare_conjecture",
    title := "Poincare Conjecture",
    kind := NodeKind.problem,
    confidence := Confidence.literature,
    summary := "Solved by Perelman; retained as a calibration case for geometry, topology and flow-based proof strategies.",
    leanTargets := [
      { importName := "Mathlib",
        declaration := "Manifold",
        goal := "Use as a long-range benchmark rather than an immediate formal proof target." }
    ],
    status := ProblemStatus.solved,
    clayName := "Poincare Conjecture",
    nextFormalTarget := "Catalog the formal prerequisites for 3-manifold topology and Ricci flow." }

end PhysMathKnowledgeTree

