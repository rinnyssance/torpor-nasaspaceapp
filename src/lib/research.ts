import Papa from 'papaparse';
import { z } from 'zod';
import { validateExpression } from './expression';

export const statuses = ['Supported', 'Preliminary', 'Not established', 'Not assessed'] as const;
export const dimensions = ['Biological relevance', 'Technical feasibility', 'Validation evidence', 'Mission practicality'];
export const categories = ['DNA damage response', 'Oxidative stress', 'Inflammation', 'Extracellular matrix regulation', 'Cellular repair', 'Tissue remodeling', 'Apoptosis', 'Cellular senescence'];
export const stages = ['Biological discovery', 'Measurement feasibility', 'Experimental validation', 'Wearable engineering', 'Countermeasure research'];
const probability = z.coerce.number().min(0).max(1);
export const geneSchema = z.object({ gene_identifier: z.string().min(1), gene_symbol: z.string().optional().default(''), log2_fold_change: z.coerce.number().finite(), p_value: probability.optional(), adjusted_p_value: probability, annotation: z.string().optional().default(''), comparison_identifier: z.string().optional(), pathway_annotations: z.array(z.string()).optional() });
export const pathwaySchema = z.object({ pathway_identifier: z.string().min(1), pathway_name: z.string().min(1), enrichment_p_value: probability.optional(), adjusted_p_value: probability, gene_count: z.coerce.number().int().nonnegative(), source_database: z.string().min(1), gene_identifiers:z.array(z.string()).optional(), background_count:z.number().int().nonnegative().optional(), background_total:z.number().int().positive().optional(), foreground_total:z.number().int().nonnegative().optional() });
export type Gene = z.infer<typeof geneSchema>;
export type Pathway = z.infer<typeof pathwaySchema>;
export function parseAnalysis(text: string, format: string, type: string) {
  let rows: unknown;
  if (format === 'json') { rows = JSON.parse(text); }
  else { const parsed = Papa.parse(text, { header: true, skipEmptyLines: true, transformHeader: h => h.trim() }); if (parsed.errors.length) throw new Error('CSV could not be parsed. Check delimiters and column counts.'); rows = parsed.data; }
  if (!Array.isArray(rows) || !rows.length) throw new Error('The file must contain a nonempty array of results.');
  if (rows.length > 50000) throw new Error('Import at most 50,000 prepared results per file.');
  if(type==='expression') return validateExpression(rows);
  const schema = type === 'gene' ? geneSchema : pathwaySchema;
  return rows.map((row, i) => { const result = schema.safeParse(row); if (!result.success) throw new Error(`Row ${i + 1}: ${result.error.issues.map(x => `${x.path.join('.')}: ${x.message}`).join('; ')}`); return result.data; });
}
export function validateAssessment(status: string, justification: string, citation: string) {
  return statuses.includes(status as typeof statuses[number]) && (status === 'Not assessed' || (justification.trim().length > 0 && /^https:\/\//.test(citation)));
}
export function sharedGenes(a: Gene[], b: Gene[]) { const ids = new Set(b.map(g => g.gene_identifier)); return a.filter(g => ids.has(g.gene_identifier)); }
export function significant(g: Gene, q=.05, fold=1) { return g.adjusted_p_value < q && Math.abs(g.log2_fold_change) >= fold; }
export function mappedGenes(a: Gene[], b: Gene[]) { const groups=new Map<string,Gene[]>();for(const g of a){if(!g.comparison_identifier||!/^\d+$/.test(g.comparison_identifier))continue;groups.set(g.comparison_identifier,[...(groups.get(g.comparison_identifier)??[]),g]);}const bCounts=new Map<string,number>();for(const g of b)if(g.comparison_identifier)bCounts.set(g.comparison_identifier,(bCounts.get(g.comparison_identifier)??0)+1);return b.flatMap(g=>{const match=groups.get(g.comparison_identifier??'');return match?.length===1&&bCounts.get(g.comparison_identifier??'')===1?[{bone:match[0] as Gene,skin:g,identifier:g.comparison_identifier??''}]:[];}); }
export function exportFile(name: string, data: unknown) { const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); }
export function metadata(title: string, description: string) { return { meta: [{ title: `${title} | TORPOR` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} | TORPOR` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }; }