# Research radar

A dated, searchable bridge between primary-source discovery, the existing knowledge graph and bounded research tasks. It records what has actually been inspected. It does not assign scientific truth from a repository title, formal statement, model score or graph path.

The first snapshot, observed on **24 October 2026**, contains:

- Metadata for **719 OpenAI manuscripts in 372 families**, pinned to commit `1581d4cbdd69a0faf34b2089614fe2a814316a6a`. These are inventoried titles and links, not 719 reviewed proofs. Three withdrawal notices are preserved.
- Sixteen source cards spanning OpenAI, Anthropic, DeepMind, the author's catalogues and relevant primary mathematical literature. Dates distinguish older background from current observations.
- An inventory of 28 selected public research repositories. Three README files were read; the other entries are metadata only.
- Five explicitly speculative candidate bridges with a dictionary, preserved and missing structure, a hypothesis to remove, a falsifier and a next task. None carries a manuscript score.

## Use

```bash
npm run research:radar -- summary
npm run research:radar -- search hyperbolicity
npm run research:radar -- search Lyapunov
npm run research:radar -- next
npm run validate:research-radar
```

[Source cards and candidates](registry.json) · [Pinned manuscript catalogue](catalogue/openai-math-2026-10-24.json) · [Public repository inventory](repository-inventory.json) · [Retrieved graph context](retrieval-2026-10-24.json) · [Research update](../../docs/research-updates/2026-10-24.md).

## Update cycle

1. Read the previous snapshot and the research checkpoint; reconcile work from other author sessions before repeating a computation, assessment or deposit.
2. Consult the original lab/repository, arXiv version history and correction notices. Inventory first, then read selected statements and proofs. Record failed access rather than inventing missing content.
3. Pin repository commits, source blobs and versioned papers. Keep earlier snapshots, corrections, withdrawals, failed hypotheses and disagreeing reports.
4. Retrieve a small canonical subgraph. A candidate must identify what assumption it removes and provide a dictionary and an inexpensive falsifier. Nearby concepts alone imply nothing.
5. Perform an exact or controlled test. A finite test supports its stated finite claim; it does not establish the universal theorem or scientific novelty.
6. Write or expand one manuscript only after a substantive result survives audit. Group corollaries and reproductions with their parent work. A new repository needs a distinct reproducible artifact; the index remains central.
7. Review the exact manuscript and artifacts with the requested reviewer configuration, without a desired score. Preserve every valid report and its provenance. An internal score is not the public AIRR aggregate or editorial acceptance.
8. Validate changes and publish through a reviewed GitHub change. The app's continuation schedule is separate from this repository; no hidden API key, automatic model spending or unattended publication daemon is installed here.

## Evidence and reuse

Reading levels are explicit: catalogue, abstract, announcement, README, selected sections, or a previously audited own proof. `literature` means the card accurately attributes a source claim, not that this sweep verified the claim. Candidate bridges remain `speculative` until a separately documented change is justified.

The source registry contains bibliographic metadata and short original synthesis. It is not a redistributed full-text corpus or permission for model training. The existing frontier-corpus policy and per-source rights still apply to any later acquisition. Public inventories exclude private repositories and credentials.

The canonical graph's 59 nodes and 115 edges are unchanged in this snapshot. This sidecar is designed to accumulate source knowledge without silently promoting graph confidence or solved status. Aspiring to AIRR 7, 8, 9 or 10 does not establish any of those scores or guarantee a discovery.

## Follow-up on 24 October

The [partial entropy bounds and missing bridges](notes/2026-10-24-entropy-audits-and-missing-bridges.md) records two narrowly audited lemmas, an explicit fixed-tuple small-noise interval, larger GHZ falsifiers and the precise gaps in erasure and four-weight interpolation transfers. The general conjecture and the manuscript importance target remain unresolved.

The [reviewed reset outcome and spectral/Holevo follow-up](notes/2026-10-24-spectral-holevo-followup.md) records the exact manuscript's5.5 quality/4.5 importance assessment, the completed exact-spectrum mathematical audit, unresolved primary-source overlap, and a separately falsifiable single-letter Holevo candidate. Mathematical validity, importance and priority remain distinct.

The [quantitative certificate update](notes/2026-10-24-planar-rational.md) records the completed note audit, exact draft identity, two exact angular examples and a separate pending manuscript review. Candidate confidence remains speculative in this discovery registry. New source cards include the instrument-extraction survey and distinct algebraic Lyapunov antecedents.

The [audit and next-target update](notes/2026-10-24-audit44-next.md) preserves the actual draft1 score, the lower-bound attribution limit, selected circuit validity reading and a finite reproduction of prior branch decoding. None of these assigns a score to a speculative candidate.

The new [Reversible Branch Lab](https://github.com/lluiseriksson/reversible-branch-lab) is a distinct executable reference, pinned in the repository inventory. Windows and Linux replay pass. Its supplied control flag and finite oracle scope are explicit; no superior protocol or new theorem is claimed.
