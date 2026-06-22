# Curated mathematical extract — `ideas3(8).txt`

This extract preserves the mathematically stable content of the source while removing duplicated repository snapshots, speculative cosmology, publication advice and unverified cross-domain programmes. The raw TXT is not copied into the repository; provenance is stored by SHA-256 in the curation record.

## 1. Parent-normalized rooted leaf summation

Let

\[
m(Q)=d_M(Q)+1>0
\]

and orient a finite incompatibility tree from a marked root. If a nonroot vertex \(v\) has \(c(v)\) children, normalize the child kernel by the parent metric:

\[
I_v(Q,Q')=
\frac{m(Q')^{c(v)}\,K(Q,Q')}{m(Q)}.
\]

A vertexwise walk estimate can then consume a parent-independent budget for \(I_v\). The denominator product is not discarded: every polymer appears as a parent exactly as many times as its rooted child count, so

\[
\prod_{v\ne0}m\bigl(X(p(v))\bigr)
=
\prod_a m(X(a))^{c(a)}.
\]

The root weight supplies the missing root power. All metric factors cancel exactly, leaving the original parent-child kernel product. This is a reusable finite mechanism; it does not prove the source activity or hole-geometry moment bounds.

## 2. Exact Catalan closure

For labelled trees on \(n+1\) vertices rooted at a fixed label, let \(c_T(v)\) be the number of rooted children. Ordering the children at every vertex turns a rooted labelled tree into a plane rooted labelled tree. Hence

\[
\sum_T\prod_v c_T(v)! = n!\,\operatorname{Cat}_n,
\]

and therefore

\[
\frac{n+1}{(n+1)!}
\sum_T\prod_v c_T(v)! = \operatorname{Cat}_n.
\]

If the fixed-tree analytic estimate contributes \(M^{2n+1}\varepsilon^{n+1}\), the complete second-gas majorant becomes

\[
M\varepsilon
\sum_{n\ge0}\operatorname{Cat}_n(M^2\varepsilon)^n.
\]

For \(0\le4M^2\varepsilon\le1\), this has the closed form

\[
\mathfrak B_M(\varepsilon)
=
\frac{1-\sqrt{1-4M^2\varepsilon}}{2M},
\qquad
\mathfrak B_M=M\varepsilon+M\mathfrak B_M^2.
\]

This replaces the coarser geometric closure based only on \(\operatorname{Cat}_n\le4^n\). The equality must still be checked against the exact tree, rooting and normalization conventions used by the consuming Lean theorem.

## 3. AQFT vacuum nonfactorization

Let \(\mathcal M_A\) and \(\mathcal M_C\) be commuting nontrivial local algebras and let \(\Omega\) be cyclic for \(\mathcal M_A\) and separating for \(\mathcal M_C\). Suppose the vacuum state factors:

\[
\omega_0(XY)=\omega_0(X)\omega_0(Y).
\]

For \(Y_0=Y-\omega_0(Y)1\), every \(X\in\mathcal M_A\) satisfies

\[
\langle X\Omega,Y_0\Omega\rangle=0.
\]

Cyclicity gives \(Y_0\Omega=0\), and separation gives \(Y_0=0\). Thus every element of \(\mathcal M_C\) would be scalar, contradicting nontriviality. Therefore the vacuum is not a product state across the two commuting local algebras.

This conclusion is compatible with causal locality: commuting algebras need not carry a product state.

## 4. Complete local operations do not signal

Let \(K_i\in\mathcal M_A\) satisfy

\[
\sum_iK_i^\dagger K_i=1
\]

and let \(Y\in\mathcal M_C\) commute with every \(K_i\). The nonselective post-operation expectation is

\[
\sum_i\omega(K_i^\dagger YK_i)
=
\omega\!\left(Y\sum_iK_i^\dagger K_i\right)
=
\omega(Y).
\]

A conditioned branch may differ, but the distant observer cannot identify that branch without the classical outcome. This finite algebraic identity should be kept separate from Bell nonlocality and from state preparation by postselection.

## 5. Recovery requires uniform quantifiers

Finite-dimensional recovery theorems relate small conditional mutual information \(I(A:C\mid B)\) to reconstruction of \(C\) from \(B\). For code or teleportation claims, the correct obligation is not

\[
\forall\rho\ \exists\mathcal R_\rho,
\]

but a single map

\[
\exists\mathcal R\ \forall\rho_{RQ}
\]

that preserves every superposition and the code's entanglement with a reference \(R\). Any AQFT/type-III version remains conditional until its split representation, entropy and recovery inequality are supplied explicitly.

## 6. Sparse Gaussian precision as a Markov blanket

For a nondegenerate finite Gaussian with variables \((\phi_A,\phi_B,\phi_C)\) and positive-definite precision

\[
K=
\begin{pmatrix}
K_{AA}&K_{AB}&0\\
K_{BA}&K_{BB}&K_{BC}\\
0&K_{CB}&K_{CC}
\end{pmatrix},
\]

conditioning on \(\phi_B\) removes every \(A\)-\(C\) cross term. Hence

\[
\mu(d\phi_A,d\phi_C\mid\phi_B)
=
\mu_A^{\phi_B}(d\phi_A)\otimes\mu_C^{\phi_B}(d\phi_C).
\]

This is exact conditional factorization. A separate inverse-kernel estimate controls how boundary values influence the conditional means. Gauge projectors, hard constraints or Schur complements can destroy the sparse block form, so the mechanism must be tested on the actual precision operator.

## 7. Boundary defect from a localized homotopy

Assume an ungraded global contraction identity

\[
I-ip=s\mathscr K+\mathscr Ks
\]

and a support projector \(\chi\). With \(\mathscr K_\chi=\chi\mathscr K\chi\), direct expansion gives

\[
\chi(I-ip)\chi-
\bigl(s\mathscr K_\chi+\mathscr K_\chi s\bigr)
=
-[s,\chi]\mathscr K\chi+
\chi\mathscr K[s,\chi].
\]

Thus the localized defect is an explicit commutator flow through the boundary. A graded BV/BRST version requires fixed degree conventions and Koszul signs; a useful Yang–Mills estimate additionally requires a concrete local differential, homotopy kernel and polymer-norm bound.

## 8. Why four dimensions are critical for Yang–Mills

Canonical power counting in \(d\) dimensions gives

\[
[A]=\frac{d-2}{2},
\qquad
[g]=\frac{4-d}{2}.
\]

Therefore \(d=4\) makes \(g\) dimensionless and marginal. Lower dimensions are superrenormalizable by power counting; higher dimensions have a negatively dimensioned coupling in the ordinary perturbative counting. This dimensional statement explains why the four-dimensional constructive problem needs marginal running and does not justify adding extra dimensions.

## 9. Material intentionally not promoted

The source repeatedly re-states fast-moving repository status, theorem names and commit plans. Those snapshots are not canonical mathematical knowledge. Everett/Deutsch interpretations, cabalistic metaphors, arithmetic RG proposals for RH, Schur-metric identifications for holes and mixed hard/soft forest expansions are retained only in quarantine with falsifiers and source requests.
