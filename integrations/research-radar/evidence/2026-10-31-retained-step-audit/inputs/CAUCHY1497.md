# Source current-norm radius and the two terms in the old-action Hessian

30 October2026. CMP109 printed272–275 Eq3.10–3.27 read as selected definitions/statements. SHA2561c2d2e500fd1e6a1a7981fed259cc2354ebcf64e473fd564bfc3f2c4d7dfbe2a. No complete source proof audit, independent review, new paper or grade.

There is an actual quantitative source margin, not merely an unspecified analyticity assertion. Eq3.14 requires the maximum of |A|, |P A|, |covariant gradient A| and |covariant Laplacian A| on X to be less than alpha2. Printed273 assumes the base Hj(B(t)) satisfies those conditions with alpha2/3. For the localized insertion deltaHj in3.15 it chooses a Cauchy contour with radius r such that r*||deltaHj||_(3.14,X)=alpha2/4. The resulting perturbed output field has norm at most7alpha2/12, leaving5alpha2/12 to the3.14 boundary. These are output-field/current norms; r is not automatically a permissible radius in every raw input coordinate of the nonlinear background solution. Eq3.17 is a localized first insertion bound, not an already stated raw Hessian theorem.

Let F_X(A) denote the source analytic polymer function after the FULL substitution (U',J') of3.10–3.13, not E_X(U,J) with J held fixed. Its output-field analytic window includes the current chain by definition. If the actual common window3.14 is admitted, two output directions v,w with the3.14 norm can be inserted with radii alpha2/(6||v||) and alpha2/(6||w||) at a base bounded by alpha2/3. Their total norm is at most2alpha2/3. Cauchy's mixed derivative formula yields

    |D²F_X(A)[v,w]| <=36 E0/alpha2² *exp(-kappa d_j(X)) ||v|| ||w||,

and a first derivative bound <=C E0/alpha2 *exp(-kappa d_j(X))||v|| (e.g. C=4 from the source quarter-radius). For a repeated direction, use two independent complex parameters along that direction; this bounds the same bilinear second derivative without an extra factorial. This is a local output-window deduction; it must not expand a distant raw bond by an arbitrarily large amount outside the global nonlinear solution chart.

The ACTUAL old-action composition F_X(Hj(B)) has TWO raw Hessian terms:

    partial_b partial_c(F_X o Hj)
      =D²F_X(Hj)[Hj_b,Hj_c]+DF_X(Hj)[Hj_bc].

Here the derivatives of Hj include the selected coarse nonlinear reconstruction and all actual background/current chains; define the symbols for that complete composition. Source3.9/3.17 suggest the first-derivative output-norm envelopes K_b(X)=||Hj_b||_(3.14,X), with the appropriate source distances/scales. A uniform global input-chart radius r0 and the SAME first-derivative bounds throughout its complex extension would additionally imply by Cauchy and symmetry

    ||Hj_bc||_(3.14,X) <=min(K_b(X),K_c(X))/r0,

with constants enlarged if one uses an interior fraction of the common radius. A real-only derivative estimate is insufficient for this step. The existence/value of this shared complex r0 with the required current/Laplacian norm bounds has not yet been certified from the selected passages.

Consequently the explicit candidate polymer Hessian envelope is

    |partial_b partial_c(F_X o Hj)|
      <=E0 exp(-kappa d_j(X))
          [36 K_b(X)K_c(X)/alpha2²
             +C min(K_b(X),K_c(X))/(alpha2*r0)].

The second term is essential. A product of two first-derivative tails alone misses the nonlinear background Hessian. Two raw a derivatives add g1² after the physical x=g1 C a chain, with the corresponding finite selected-coordinate terms also retained. Sum this expression over the actual polymer domains X and j before assigning C_E,L or a weighted row moment. Long domains can reach both inputs even if both K's are large; source exp(-kappa d_j(X)) and rooted polymer incidence/entropy must pay for that case. Small distant domains instead use the K tails. No per-volume sum is an adequate substitute.

Decision: source3.15 supplies a concrete output/current Cauchy margin and a two-term old-action Hessian formula. The remaining obligations have narrowed to the common complex INPUT radius/current-norm kernel envelope and its weighted polymer sum. Do not collapse output-direction radius into a raw-coordinate radius, omit Hj_bc, or claim the full correction budget established. Next verify those two conditions at k=1 with actual source scale factors, then combine with1495's Gaussian gap and1496's physical action cutoff budget. Outer histories and global transport remain open.

Falsifiers: holding J fixed, using real-only K estimates for complex Cauchy, extending input beyond its chart, dropping the second reconstruction derivative, or unsummed polymer incidence. Levels: literature—selected source radius/current localization statements; heuristic—participating-agent output Cauchy/Hessian-chain calculation; speculative—complex input norm/entropy closure and global covariance; formal—none new.
