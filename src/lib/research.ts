import Papa from 'papaparse';
import { z } from 'zod';

export const statuses = ['Supported', 'Preliminary', 'Not established', 'Not assessed'] as const;
export const dimensions = ['Biological relevance', 'Technical feasibility', 'Validation evidence', 'Mission practicality'];
export const categories = ['DNA damage response', 'Oxidative stress', 'Inflammation', 'Extracellular matrix regulation', 'Cellular repair', 'Tissue remodeling', 'Apoptosis', 'Cellular senescence'];
export const stages = ['Biological discovery', 'Measurement feasibility', 'Experimental validation', 'Wearable engineering', 'Countermeasure research'];
const probability = z.coerce.number().min(0).max(1);
export const geneSchema = z.object({ gene_identifier: z.string().min(1), gene_symbol: z.string().optional().default(''), log2_fold_change: z.coerce.number().finite(), p_value: probability.optional(), adjusted_p_value: probability, annotation: z.string().optional().default('') });
export const pathwaySchema = z.object({ pathway_identifier: z.string().min(1), pathway_name: z.string().min(1), enrichment_p_value: probability.optional(), adjusted_p_value: probability, gene_count: z.coerce.number().int().nonnegative(), source_database: z.string().min(1) });
export type Gene = z.infer<typeof geneSchema>;
export type Pathway = z.infer<typeof pathwaySchema>;
export function parseAnalysis(text: string, format: string, type: string) {
  let rows: unknown;
  if (format === 'json') { rows = JSON.parse(text); }
  else { const parsed = Papa.parse(text, { header: true, skipEmptyLines: true, transformHeader: h => h.trim() }); if (parsed.errors.length) throw new Error('CSV could not be parsed. Check delimiters and column counts.'); rows = parsed.data; }
  if (!Array.isArray(rows) || !rows.length) throw new Error('The file must contain a nonempty array of results.');
  if (rows.length > 50000) throw new Error('Import at most 50,000 prepared results per file.');
  const schema = type === 'gene' ? geneSchema : pathwaySchema;
  return rows.map((row, i) => { const result = schema.safeParse(row); if (!result.success) throw new Error(`Row ${i + 1}: ${result.error.issues.map(x => `${x.path.join('.')}: ${x.message}`).join('; ')}`); return result.data; });
}
export function validateAssessment(status: string, justification: string, citation: string) {
  return statuses.includes(status as typeof statuses[number]) && (status === 'Not assessed' || (justification.trim().length > 0 && /^https:\/\//.test(citation)));
}
export function sharedGenes(a: Gene[], b: Gene[]) { const ids = new Set(b.map(g => g.gene_identifier)); return a.filter(g => ids.has(g.gene_identifier)); }
export function exportFile(name: string, data: unknown) { const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); }
export function metadata(title: string, description: string) { return { meta: [{ title: `${title} | TORPOR` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} | TORPOR` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }; }