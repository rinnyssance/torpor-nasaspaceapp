"""Reproducible extraction of NASA processed results; no raw sequencing analysis.
Run: python3 scripts/prepare_nasa_results.py --input-dir /tmp --output-dir /tmp/torpor-data
Inputs are downloaded from links in the generated provenance manifest.
"""
import argparse,csv,json,math,hashlib
from pathlib import Path
import openpyxl
from scipy.stats import fisher_exact
import numpy as np
p=argparse.ArgumentParser();p.add_argument('--input-dir',default='/tmp');p.add_argument('--output-dir',default='/tmp/torpor-data');args=p.parse_args();root=Path(args.input_dir);out=Path(args.output_dir);out.mkdir(parents=True,exist_ok=True)
rows=[];contrast='(Ground Control & 1G on Earth & JAXA Chow)v(Space Flight & uG & JAXA Chow)'
with open(root/'osd238-de.csv') as f:
 for r in csv.DictReader(f):
  try:fc=float(r['Log2fc_'+contrast]);pv=float(r['P.value_'+contrast]);q=float(r['Adj.p.value_'+contrast])
  except ValueError:continue
  if not all(math.isfinite(x) for x in [fc,pv,q]):continue
  rows.append(dict(gene_identifier=r['ENSEMBL'],gene_symbol=r['SYMBOL'],log2_fold_change=fc,p_value=pv,adjusted_p_value=q,annotation=r['GENENAME'],comparison_identifier=r['ENTREZID'],pathway_annotations=r['GOSLIM_IDS'].split('|')))
skin=rows
symbolmap={r['gene_symbol']:r['comparison_identifier'] for r in skin if r['comparison_identifier'].isdigit() and r['gene_symbol'] and '|' not in r['gene_symbol']}
w=openpyxl.load_workbook(root/'osd324-analysis.xlsx',read_only=True,data_only=True);bone=[]
for r in w.active.iter_rows(min_row=3,values_only=True):
 try:fc=(float(r[67])+float(r[68]))/2-(float(r[61])+float(r[62]))/2;pv=float(r[48]);q=float(r[49])
 except (TypeError,ValueError):continue
 if not all(math.isfinite(x) for x in [fc,pv,q]):continue
 ann=str(r[5] or '');terms=sorted(set(__import__('re').findall(r'GO:\d+',ann)))
 bone.append(dict(gene_identifier=str(r[0]),gene_symbol=str(r[1] or ''),log2_fold_change=fc,p_value=pv,adjusted_p_value=q,annotation=str(r[2] or ''),comparison_identifier=symbolmap.get(str(r[1]),''),pathway_annotations=terms))
manifest=[]
for accession,genes,file,method in [('OSD-324',bone,'GLDS-324_microarray_2015-10-07_Pajevic_analysis.xlsx','Source worksheet 2015-10-07_Pajevic; contrast 2d flight vs ground. log2 fold change is mean of source log2 expression columns 67–68 minus columns 61–62 (zero-based). Raw p and FDR q (all) are source columns 48 and 49; not recomputed. Ocy454 microarray probes are original identifiers. Cross-study Entrez mapping is via unambiguous exact gene-symbol matches to OSD-238 source annotations; unmatched probes excluded from mapped comparisons.'),('OSD-238',skin,'GLDS-238_rna_seq_differential_expression_GLbulkRNAseq.csv','NASA GeneLab GLbulkRNAseq v2 processed RNA-seq. Exact contrast '+contrast+'. Source Log2fc, P.value, Adj.p.value retained without sign reversal. Ground control vs flight microgravity, standard chow, three samples per group. Missing/nonfinite statistics excluded. Original Ensembl and source Entrez identifiers retained.')]:
 source='https://osdr.nasa.gov/geode-py/ws/studies/'+accession+'/download?source=datamanager&file='+file
 genes.sort(key=lambda g:g['adjusted_p_value']); selected=genes[:2000]
 (out/(accession+'-genes.json')).write_text(json.dumps(selected,separators=(',',':')))
 # Enrichment uses the complete valid-result population and each row as an analysis unit.
 # This is annotation over-representation, not a direction-of-activity result.
 termsets={}
 for g in genes:
  for t in set(g['pathway_annotations']):
   if t.startswith('GO:'):termsets.setdefault(t,set()).add(g['gene_identifier'])
 allids={g['gene_identifier'] for g in genes};sig={g['gene_identifier'] for g in genes if g['adjusted_p_value']<.05};N=len(allids);K=len(sig);tested=[]
 for term,members in termsets.items():
  M=len(members);a=len(members&sig)
  if M<5 or M>N*.8:continue
  pv=fisher_exact([[a,K-a],[M-a,N-K-M+a]],alternative='greater').pvalue
  tested.append(dict(pathway_identifier=term,pathway_name=term,gene_count=a,enrichment_p_value=pv,source_database='GO source annotations' if accession=='OSD-324' else 'GO slim source annotations'))
 tested.sort(key=lambda x:x['enrichment_p_value']);m=len(tested);prev=1
 for i in range(m-1,-1,-1):prev=min(prev,tested[i]['enrichment_p_value']*m/(i+1));tested[i]['adjusted_p_value']=prev
 (out/(accession+'-pathways.json')).write_text(json.dumps(tested[:100],separators=(',',':')))
 manifest.append(dict(study_id=accession,source_file=file,source_url=source,methodology=method,total_valid_results=len(genes),displayed_results=len(selected),selection='Lowest 2,000 adjusted p-values from all valid source rows; an explicit subset, not a complete transcriptome.',enrichment_method=f'One-sided Fisher exact over-representation; adjusted p<0.05 foreground ({K} units); all {N} valid-result identifiers background; source GO annotations; terms with 5 to 80% background members; BH correction across {m} tested terms. Top 100 terms displayed. Probe-level vs gene-level and GO vs GO slim differences prevent equivalent enrichment interpretation.',source_sha256=hashlib.sha256((root/('osd324-analysis.xlsx' if accession=='OSD-324' else 'osd238-de.csv')).read_bytes()).hexdigest()))
(out/'manifest.json').write_text(json.dumps(manifest,indent=2));print(json.dumps(manifest,indent=2))
