# Reproduce the finite circuit controls

This supplement publishes **own** checkers839/840 and their original expected outputs. It supports the [unscored classification audit](../../notes/2026-10-27-equimodular-converse.md). No manuscript score, novelty certificate, formal theorem or complete campaign Research Capsule is supplied by running it.

The analytic mechanism is separate: classical equimodularity normalization gives sufficiency from LMY3.1, while a primitive circuit with a coefficient of magnitude at least2 gives a common-box positive-count witness(1,1,2) and exact negative monomial defect. The all-ambient-RHS statement additionally requires odd lattice index. The integer-fiber promise and allowance for fixed coordinates are essential. See the note for proof scope, antecedents and falsifiers.

## Run

Use Python3.12 with SymPy. The successful author reproduction used Python3.12.14 and SymPy1.14.0. Other combinations have not been certified here. No network access is required after obtaining SymPy and this folder.

```text
python reproduce.py --output /path/to/a/new/output-directory
```

The output directory must not already exist. The wrapper verifies the native archive hashes before extracting the four named files, runs copies of both original scripts, preserves stdout/stderr, compares the results and writes `REPRODUCTION857.json`. It never runs a foreign paper's source or changes the frozen input. Reproduction may take several seconds and produces a JSONL certificate file in the chosen directory.

`native-controls857.zip` retains the original script bytes and original expected outputs, including original line endings. `NATIVE-MANIFEST857.json` binds those bytes. The two generated result timestamps and the auditor script's elapsed time naturally differ; every other expected JSON field is checked, and all16,828 generated positive certificates must reproduce the original JSONL SHA256 exactly. Script hashes remain unchanged. Do not compare this generated elapsed time as a performance benchmark.

The original controls include15,024 full-row-rank2-by-3 matrices over[-2,2],16 directed matrices in839 and14 additional crafted matrices in840. The second checker uses a separate elementary circuit enumeration for2-by-3 matrices. SymPy is used for crafted cases. It checks127,608 nonempty triples coefficientwise and46,362 binary centers. These finite scopes do not prove a universal classification; the proof is analytical. The checker identities do not establish independent model runtimes or human replication.

## Evidence layers and limits

- **Literature:** classical circuit/equimodular equivalence, lattice normalization and the cited LMY inequality. Full selected reading depths remain in the linked audit.
- **Own analytic inference:** explicit positive circuit witness and the bounded universal classification supported by audit840, conditional on LMY3.1.
- **Finite computation:** exact checker outputs and certificate hashes reproduced here. A failed assertion is a falsifier for that computation and triggers investigation; it is not resolved by discarding the failed run.
- **Formal:** no Lean proof or canonical graph confidence change.
- **Speculative:** significance and worldwide priority. A matching earlier converse abandons the novelty claim; more finite tables do not supply novelty.

The package is research evidence rather than a new paper or an independent model vote. A small algebra subgraph was retrieved before this supplement. No third-party paper body is redistributed. Preserve adverse original reports and bind any later manuscript grade only to its exact PDF.
