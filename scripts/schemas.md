# Import schemas

Illustrative structure only; numeric example values below are schema examples, not research findings. Never seed these examples into the public catalog.

Gene JSON array (CSV supported for scalar fields):
```json
[{"gene_identifier":"SOURCE_ID","gene_symbol":"","log2_fold_change":0,"p_value":1,"adjusted_p_value":1,"annotation":"","comparison_identifier":"","pathway_annotations":[]}]
```
Pathway JSON array:
```json
[{"pathway_identifier":"GO:SOURCE_ID","pathway_name":"Source term","enrichment_p_value":1,"adjusted_p_value":1,"gene_count":0,"source_database":"GO source annotations","gene_identifiers":[],"background_count":5,"background_total":100,"foreground_total":0}]
```
Expression JSON array:
```json
[{"gene_identifier":"SOURCE_ID","gene_symbol":"","samples":[{"sample_identifier":"SOURCE_SAMPLE_ID","group":"Source experimental group","value":0}]}]
```

All matrix rows must share unique, ordered sample identifiers. Values must be finite and nonnegative. Imports reject malformed rows atomically. Record contrast, assay, statistical test, multiple-testing method, source version and URL in the import methodology; preserve optional manifest and source hashes with the research workflow.
