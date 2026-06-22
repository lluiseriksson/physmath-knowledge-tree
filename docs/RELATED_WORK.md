# Related work and positioning

PhysMath Knowledge Tree complements established discovery, knowledge-base, graph-analysis and formal-search systems. The comparison below concerns product scope and data model, not a claim of overall superiority.

| System | Primary object | Main strength | Boundary relative to this repository |
| --- | --- | --- | --- |
| [OpenAlex](https://developers.openalex.org/) | Scholarly works, authors, institutions and topics | Open scholarly catalog exposed as a heterogeneous graph and API | Excellent source-discovery layer; it does not encode this repository's curated mechanism, falsifier and Lean-target contract. |
| [ResearchRabbit](https://www.researchrabbit.ai/) | Papers and citation neighborhoods | Interactive literature exploration, collections and visual discovery | Paper-centric discovery rather than a canonical graph of mathematical mechanisms and formalization targets. |
| [Connected Papers](https://www.connectedpapers.com/about) | Similarity neighborhoods around papers | Visual maps for finding related literature | Similarity is useful for discovery but is not an evidence-labelled implication or dependency relation. |
| [Open Knowledge Maps](https://openknowledgemaps.org/) | Topic maps derived from literature | Fast visual overview of concepts and relevant resources | Topic overview rather than hand-audited transfer mechanisms between domains and open problems. |
| [Wikidata](https://www.wikidata.org/wiki/Wikidata:Introduction) | General structured entities and statements | Collaborative, multilingual, machine-readable knowledge base with sources | Broader and community-scale; this repository uses a narrow ontology and stronger research-workflow constraints. |
| [Cytoscape](https://cytoscape.org/what_is_cytoscape.html) | General networks | Mature network analysis, visualization and extensibility | A graph platform rather than a physics-mathematics dataset with evidence semantics. Canonical data can be exported for downstream analysis. |
| [LeanSearch](https://leansearch.net/) and [mathlib](https://leanprover-community.github.io/mathlib4_docs/) | Formal declarations and theorem statements | Natural-language theorem search and a large checked mathematical library | Formal search begins once a target is sufficiently precise; this repository helps define and bound that target. |
| PhysMath Knowledge Tree | Domains, mechanisms, problems, research moves and Lean targets | Evidence-separated routes from research questions to finite checks | Small curated scope; it relies on the systems above for literature retrieval, general graph analytics and deep formal libraries. |

## Distinctive contribution

The repository's distinctive unit is not a paper, keyword or generic adjacency. It is a **typed research bridge** with:

- source and target identifiers;
- direction and relation type;
- a written transfer mechanism;
- an evidence class;
- scoped references;
- a falsifier when speculative;
- implications for a bounded Lean or computational target.

This design makes the graph suitable as a coordination layer between literature discovery, human mathematical judgment and formal proof search. It should be integrated with, not positioned as a replacement for, the systems listed above.
