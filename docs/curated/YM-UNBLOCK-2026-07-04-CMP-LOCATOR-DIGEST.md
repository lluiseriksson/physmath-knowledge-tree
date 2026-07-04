# CMP locator digest - Yang-Mills unblock batch 2026-07-04

This digest narrows `v1_cmp_source_packet` to primary-source locator targets.
It does not verify the requested equations or definitions, and it does not
promote `claim.p4_contract_activity` beyond heuristic staging.

## Boundary

- Queue id: `v1_cmp_source_packet`
- Blocking issue: https://github.com/lluiseriksson/physmath-knowledge-tree/issues/6
- Curation record: `curation/records/ym-unblock-2026-07-03.json`
- Source queue: `docs/curated/YM-UNBLOCK-2026-07-03-SOURCE-QUEUE.md`
- Candidate blocked by this packet: `claim.p4_contract_activity`

The next agent should use these records as a locator checklist only. A usable
source recovery still needs exact page, equation, lemma, definition or section
references from the full primary text.

## Primary locator checklist

| Packet item | Primary locator candidate | Why it is in scope | Status |
| --- | --- | --- | --- |
| One-step fluctuation integral and cluster expansion terms | T. Balaban, "Renormalization group approach to lattice gauge field theories. II. Cluster expansions", Commun. Math. Phys. 116, 1-22 (1988), DOI https://doi.org/10.1007/BF01239022 | The public abstract says Part II represents the Part I fluctuation field integral by an exponentiated cluster expansion and proves the expansion terms satisfy the inductive assumptions. | `pending-full-text-check` |
| Effective actions, coupling recursion and Part I setup | T. Balaban, "Renormalization group approach to lattice gauge field theories. I. Generation of effective actions in a small field approximation and a coupling constant renormalization in four dimensions", Commun. Math. Phys. 109, 249-301 (1987), DOI https://doi.org/10.1007/BF01215223 | The public abstract identifies four-dimensional pure gauge fields, small-field approximation, localized effective actions, one-step renormalization transformations and recursive coupling equations. | `pending-full-text-check` |
| Background field/minimizer and fixed-average variational setup | T. Balaban, "The variational problem and background fields in renormalization group method for lattice gauge theories", Commun. Math. Phys. 102, 277-309 (1985), DOI https://doi.org/10.1007/BF01229381 | The public abstract identifies fixed averages, existence of a minimum, uniqueness up to gauge transformations and the background field used for expansion. | `pending-full-text-check` |
| Gauge-fixing convention and regular field space | T. Balaban, "Spaces of regular gauge field configurations on a lattice and gauge fixing conditions", Commun. Math. Phys. 99, 75-102 (1985), cited from the 1987 Part I reference list | The title and Part I reference list make it the likely primary locator for regular-configuration and gauge-fixing definitions. | `pending-doi-and-full-text-check` |
| Propagator/operator before later estimates | T. Balaban, "Propagators and renormalization transformations for lattice gauge theories. I", Commun. Math. Phys. 95, 17-40 (1984), and "II", Commun. Math. Phys. 96, 223-250 (1984), cited from the 1987 Part I reference list | The titles and Part I reference list make these likely locators for the operator/propagator definitions that precede later CMP estimates. | `pending-doi-and-full-text-check` |
| Wilson action second variation seed | K. G. Wilson, "Quantum chromodynamics on a lattice", in Quantum Field Theory and Statistical Mechanics, Cargese 1976, pp. 143-172, cited from the 1985 variational-problem reference list | The 1985 variational-problem paper cites Wilson's lattice QCD source; the actual second-variation statement still needs full-text verification. | `pending-full-text-check` |

## Exact blocker to leave visible

Do not treat this digest as a source packet. The unresolved work is still:

- transcribe the exact Wilson second variation statement;
- identify the gauge-fixing convention used for the relevant field space;
- name the nonlinear block map definition;
- locate the flat periodic Hodge/Poincare constants;
- name the small-background defect norm;
- identify the operator defined before the CMP95 estimates;
- locate the CMP109/CMP116 one-step fluctuation integral statement;
- record the Omega restriction/enlargement convention.

If any row cannot be resolved from an accessible primary text, comment on issue
#6 with the attempted source, missing symbol or statement, and the access
boundary. Do not replace the missing source packet with a generic activity
assumption.
