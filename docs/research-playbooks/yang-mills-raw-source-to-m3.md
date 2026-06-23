# Playbook: raw-source CMP116/H# to M3

## Current verified endpoint

```text
raw-source package
→ canonical physical/CMP116 transport
→ Appendix-F support + hraw
→ scale-indexed localized family
→ H# source consumer
→ SingleScaleUVDecay
```

## Immediate move

Add `lattice_mass_gap_of_cmp116RawSource_hsharp_geometric` as a thin composition
of the verified H# producer and `lattice_mass_gap_of_singleScaleUVDecay_geometric`.
Derive only the final H# amplitude nonnegativity from existing positivity and
denominator hypotheses.

## Next physical move

Add `lattice_mass_gap_of_singleScaleUVDecay_marginal`, then
`lattice_mass_gap_of_cmp116RawSource_hsharp_marginal`. The marginal wrapper is
the faithful 4D route because it uses summability of `g_k ^ kappa0` under the
marginal recursion rather than assuming geometric coupling decay.

## Stop conditions

Do not proceed to a stronger claim when any of these remain unidentified:

- the actual physical `Rsc`;
- the rooted H# identity `hR`;
- support enlargement conventions;
- uniform constants;
- the cutoff domain of the raw activity estimate.

## Information-loss audit

`SingleScaleUVDecay` is an intentionally coarse scalar interface. Before using
it, consume all conclusions that require exact target, support, measure, signs
or source identity. After scalarization, those data cannot be reconstructed.
