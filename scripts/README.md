# NASA source preparation

`prepare_nasa_results.py` extracts documented contrasts from downloaded NASA processed files. Requirements: Python 3, openpyxl, scipy, numpy. Download the source URLs recorded in the public catalog to `/tmp/osd324-analysis.xlsx` and `/tmp/osd238-de.csv`, then run the script. Output contains source hashes and exact column/method provenance.

OSD-324: 2-day flight versus ground, log2FC computed from the source's mean log2 expression; source p and FDR q(all) retained. No q<0.05 probes in this contrast. OSD-238: ground versus flight microgravity on standard chow, source log2FC/p/adjusted p retained; 168 adjusted-p<0.05 genes. Lowest 2,000 valid adjusted p-values shown for each study, not a full transcriptome.

GO over-representation is separately computed, not a NASA supplied enrichment table. Fisher exact test, p-adjusted<0.05 foreground, all valid source identifiers as background, BH over all tested source GO terms. Microarray probes and RNA-seq genes are different analysis units; GO and GO slim differ. Empty bone foreground gives p=q=1, not enrichment. Term names were resolved from EBI QuickGO.

Cross-study mapping uses only source Entrez IDs and unambiguous exact source-symbol matches. Duplicate mappings must be excluded. Source identifiers remain visible; no matched-study or pooled-response claim is valid.

Curated entries are public read-only records. Editing saves an owner-private copy. Public catalog values are imported once; pages do not seed data or run sequencing analysis.
