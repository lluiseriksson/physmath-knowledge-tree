import Mathlib

namespace PhysMathKnowledgeTree

/-!
Small formal lemmas tied to graph nodes.

These theorems are intentionally modest: they verify finite algebraic mechanisms
that the graph can safely point to without claiming a solution of any open
scientific problem.
-/

/-- The exact Appendix-F bookkeeping identity used by the rate-budget node. -/
theorem appendixFRateBudgetIdentity (kappa kappaZero : Int) :
    kappa - kappaZero - 2 =
      (kappa - 3 * kappaZero - 3) + (2 * kappaZero + 1) := by
  ring

/--
Dimensionless lattice decay and physical decay agree when lattice distance is
converted by the same spacing factor used to convert mass.
-/
theorem physicalExponentIdentity (mPhys spacing latticeDistance : Rat) :
    (mPhys * spacing) * latticeDistance =
      mPhys * (spacing * latticeDistance) := by
  ring

/--
A coarse cluster budget that records only rooted and total masses cannot see a
separate target-diameter field.
-/
structure TargetProfile where
  rootMass : Nat
  totalMass : Nat
  targetDiameter : Nat
  deriving Repr, BEq

/-- Coarse vertex budget after the target geometry has been erased. -/
def coarseVertexBudget (profile : TargetProfile) (order : Nat) : Nat :=
  profile.rootMass * profile.totalMass ^ order

/-- Equal rooted and total masses force equal coarse budgets, regardless of target data. -/
theorem coarseBudgetEqualOfSameMasses {left right : TargetProfile} {order : Nat}
    (hRoot : left.rootMass = right.rootMass)
    (hTotal : left.totalMass = right.totalMass) :
    coarseVertexBudget left order = coarseVertexBudget right order := by
  simp [coarseVertexBudget, hRoot, hTotal]

/--
Once a nonselective finite operation has been reduced to a complete effect,
the distant observable collapses to its original value.
-/
theorem nonselectiveExpectationCollapse {index algebra : Type*}
    [Fintype index] [DecidableEq index] [Semiring algebra]
    (effect : index -> algebra) (observable : algebra)
    (complete : (Finset.univ.sum effect) = 1) :
    (Finset.univ.sum effect) * observable = observable := by
  rw [complete, one_mul]

/-- Congruence for the child-factorial product that appears in rooted tree sums. -/
theorem childFactorialProductCongr {vertex : Type*} [Fintype vertex] [DecidableEq vertex]
    (leftChildren rightChildren : vertex -> Nat)
    (sameChildren : forall vertex, leftChildren vertex = rightChildren vertex) :
    (Finset.univ.prod fun vertex => Nat.factorial (leftChildren vertex)) =
      (Finset.univ.prod fun vertex => Nat.factorial (rightChildren vertex)) := by
  simp [sameChildren]

/-- Noncommutative commutator used to expose localization boundary defects. -/
def commutator {algebra : Type*} [Mul algebra] [Sub algebra] (left right : algebra) : algebra :=
  left * right - right * left

/--
Ungraded localization identity: moving a global homotopy past a projector
produces exactly the two commutator-supported boundary terms.
-/
theorem localizedHomotopyBoundaryDefect {algebra : Type*} [Ring algebra]
    (projector differential homotopy : algebra) :
    projector * (differential * homotopy + homotopy * differential) =
      differential * (projector * homotopy) +
        homotopy * (projector * differential) +
          commutator projector differential * homotopy +
            commutator projector homotopy * differential := by
  unfold commutator
  noncomm_ring

end PhysMathKnowledgeTree
