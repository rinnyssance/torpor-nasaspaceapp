# NASA source preparation

`prepare_nasa_results.py` extracts documented contrasts from downloaded NASA processed files. Requirements: Python 3, openpyxl, scipy, numpy. Download the source URLs recorded in the public catalog to `/tmp/osd324-analysis.xlsx` and `/tmp/osd238-de.csv`, then run the script. Output contains source hashes and exact column/method provenance.

OSD-324: 2-day flight versus ground, log2FC computed from the source's mean log2 expression; source p and FDR q(all) retained. No q<0.05 probes in this contrast. OSD-238: ground versus flight microgravity on standard chow, source log2FC/p/adjusted p retained; 168 adjusted-p<0.05 genes. Lowest 2,000 valid adjusted p-values shown for each study, not a full transcriptome.

GO over-representation is separately computed, not a NASA supplied enrichment table. Fisher exact test, p-adjusted<0.05 foreground, all valid source identifiers as background, BH over all tested source GO terms. Microarray probes and RNA-seq genes are different analysis units; GO and GO slim differ. Empty bone foreground gives p=q=1, not enrichment. Term names were resolved from EBI QuickGO.

Cross-study mapping uses only source Entrez IDs and unambiguous exact source-symbol matches. Duplicate mappings must be excluded. Source identifiers remain visible; no matched-study or pooled-response claim is valid.

Curated entries are public read-only records. Editing saves an owner-private copy. Public catalog values are imported once; pages do not seed data or run sequencing analysis.


## Reproduce downloads and normalized matrix
Install isolated Python dependencies with `python3 -m pip install -r scripts/requirements.txt`. Public NASA files are unrestricted; download with `curl -L` (the repository redirects to time-limited download URLs; do not record those signed URLs).

```sh
curl -L --fail 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-324/download?source=datamanager&file=GLDS-324_microarray_2015-10-07_Pajevic_analysis.xlsx' -o /tmp/osd324-analysis.xlsx
curl -L --fail 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-238/download?source=datamanager&file=GLDS-238_rna_seq_differential_expression_GLbulkRNAseq.csv' -o /tmp/osd238-de.csv
python3 scripts/prepare_nasa_results.py --input-dir /tmp --output-dir /tmp/torpor-results
curl -L --fail 'https://osdr.nasa.gov/geode-py/ws/studies/OSD-238/download?source=datamanager&file=GLDS-238_rna_seq_Normalized_Counts_GLbulkRNAseq.csv' -o /tmp/normalized.csv
python3 scripts/prepare_expression.py --matrix /tmp/normalized.csv --genes /tmp/torpor-results/OSD-238-genes.json --output-dir /tmp/torpor-results
```

Normalized source SHA256: `937403ff8667882adb14dbe4a83fb3a67bc860e9c6bfc20350b1e89c27bc30e1`. Source values are untransformed; heatmap colors use within-row ranks only. Matrix/sample output is available for OSD-238, not yet extracted for OSD-324.

Full and selected differential-expression and enrichment arrays are produced separately; full arrays may exceed the current 50,000-row app import limit and need an explicitly documented subset. Enrichment exports retain foreground identifiers and background counts. Historical GO annotations may include obsolete terms; do not silently replace identifiers. Names may be resolved against QuickGO; without a resolution step, original GO IDs remain authoritative.

This is a processed-result extraction pipeline, not a reanalysis using DESeq2 or limma. For future raw RNA-seq analysis use a design-aware DESeq2 count workflow; for raw Affymetrix data use platform-aware normalization and limma. Neither is claimed to run here. Contrast choice, normalization, model design and multiple-testing correction must be documented before importing new results. No RNA-seq count model is applied to microarrays.
