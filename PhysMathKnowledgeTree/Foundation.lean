import Mathlib

namespace PhysMathKnowledgeTree

/-- Evidence level attached to a knowledge-graph claim. -/
inductive Confidence where
  | formal
  | literature
  | heuristic
  | speculative
  deriving Repr, BEq, DecidableEq

/-- Reserved superset of node categories for the Lean layer; the current JSON schema uses `domain`, `problem` and `bridge`. -/
inductive NodeKind where
  | domain
  | theory
  | concept
  | theorem
  | formula
  | method
  | problem
  | bridge
  deriving Repr, BEq, DecidableEq

/-- Typed counterpart of the relation names accepted by `graph/schemas/edge.schema.json`. -/
inductive EdgeKind where
  | dependsOn
  | specializes
  | generalizes
  | analogousTo
  | dualTo
  | formalizesAs
  | transfersVia
  | obstructs
  | suggests
  | tests
  | uses
  | bridge
  deriving Repr, BEq, DecidableEq

/-- A deliberately small formalization target attached to a graph node. -/
structure LeanTarget where
  importName : String
  declaration : String
  goal : String
  deriving Repr, BEq

/-- Minimal Lean representation of a canonical knowledge node. -/
structure KnowledgeNode where
  id : String
  title : String
  kind : NodeKind
  confidence : Confidence
  summary : String
  leanTargets : List LeanTarget := []
  deriving Repr, BEq

/-- Minimal Lean representation of a directed knowledge edge. -/
structure KnowledgeEdge where
  source : String
  target : String
  kind : EdgeKind
  confidence : Confidence
  mechanism : String
  deriving Repr, BEq

end PhysMathKnowledgeTree
