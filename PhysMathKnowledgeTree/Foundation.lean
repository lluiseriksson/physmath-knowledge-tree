import Mathlib

namespace PhysMathKnowledgeTree

inductive Confidence where
  | formal
  | literature
  | heuristic
  | speculative
  deriving Repr, BEq

inductive NodeKind where
  | domain
  | theory
  | concept
  | theorem
  | formula
  | method
  | problem
  | bridge
  deriving Repr, BEq

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
  deriving Repr, BEq

structure LeanTarget where
  importName : String
  declaration : String
  goal : String
  deriving Repr

structure KnowledgeNode where
  id : String
  title : String
  kind : NodeKind
  confidence : Confidence
  summary : String
  leanTargets : List LeanTarget := []
  deriving Repr

structure KnowledgeEdge where
  source : String
  target : String
  kind : EdgeKind
  confidence : Confidence
  mechanism : String
  deriving Repr

end PhysMathKnowledgeTree

