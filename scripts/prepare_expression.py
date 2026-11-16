"""Extract real normalized sample values matched by original source identifiers.
No statistical model is fitted and no values are inferred from summary results.
"""
import argparse, csv, hashlib, json
from pathlib import Path
p = argparse.ArgumentParser()
p.add_argument('--matrix', required=True)
p.add_argument('--genes', required=True, help='Prepared differential expression JSON array')
p.add_argument('--output-dir', required=True)
p.add_argument('--limit', type=int, default=6)
a = p.parse_args()
genes = json.loads(Path(a.genes).read_text())
# Same six source-matched example genes used in the first normalized-expression catalog.
preferred = ['Col3a1', 'Loxl2', 'Col5a1', 'Fn1', 'Aldh1l2', 'C1qtnf6']
chosen = [g for name in preferred for g in genes if g['gene_symbol'] == name][:a.limit]
ids = {g['gene_identifier']:g for g in chosen}
rows = []
with open(a.matrix) as f:
    reader = csv.DictReader(f)
    samples = [s for s in reader.fieldnames if '_FLT_uG_JC_' in s or '_GC_1G_JC_' in s]
    if len(samples) != 6: raise ValueError('Expected three flight and three ground standard-chow samples')
    for r in reader:
        if r[''] not in ids: continue
        rows.append({'gene_identifier':r[''], 'gene_symbol':ids[r['']]['gene_symbol'], 'samples':[
            {'sample_identifier':s, 'group':'Flight microgravity · standard chow' if '_FLT_' in s else 'Ground 1g · standard chow', 'value':float(r[s])} for s in samples]})
if len(rows) != len(ids): raise ValueError('Missing normalized-expression source identifiers')
out = Path(a.output_dir); out.mkdir(parents=True, exist_ok=True)
(out/'OSD-238-expression.json').write_text(json.dumps(rows,indent=2))
(out/'OSD-238-expression-provenance.json').write_text(json.dumps({
 'study_id':'OSD-238', 'source_file':'GLDS-238_rna_seq_Normalized_Counts_GLbulkRNAseq.csv',
 'source_url':'https://osdr.nasa.gov/geode-py/ws/studies/OSD-238/download?source=datamanager&file=GLDS-238_rna_seq_Normalized_Counts_GLbulkRNAseq.csv',
 'sha256':hashlib.sha256(Path(a.matrix).read_bytes()).hexdigest(),
 'method':'Source normalized counts, untransformed; six original gene IDs, six source samples; no model fitted.',
 'selection':preferred[:a.limit], 'sample_metadata':rows[0]['samples'] if rows else []},indent=2))
print(f'Extracted {len(rows)} genes across {len(samples)} source samples')
