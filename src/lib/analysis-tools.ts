export { validateExpression, type ExpressionRow } from './expression';
import { significant, type Gene, type Pathway } from './research';
export function summarizeGenes(genes: Gene[], q: number, fold: number) {
  const passing = genes.filter(g => significant(g, q, fold));
  return { analyzed: genes.length, passing: passing.length, positive: passing.filter(g => g.log2_fold_change > 0).length, negative: passing.filter(g => g.log2_fold_change < 0).length };
}
export function enrichedOverlap(a: Pathway[], b: Pathway[], q: number) {
  return a.filter(p => p.adjusted_p_value < q && b.some(t => t.pathway_identifier === p.pathway_identifier && t.adjusted_p_value < q));
}
export function csvResults(rows: Gene[]) {
  const columns = ['gene_identifier','gene_symbol','log2_fold_change','p_value','adjusted_p_value','annotation'] as const;
  const quote = (value: unknown) => { const s = String(value ?? ''); return '"' + (typeof value==='string' && /^[=+@\-]/.test(s) ? "'" + s : s).replaceAll('"','""') + '"'; };
  return [columns.join(','), ...rows.map(r => columns.map(c => quote(r[c])).join(','))].join('\n');
}
export function downloadCsv(name: string, rows: Gene[]) {
  const url = URL.createObjectURL(new Blob([csvResults(rows)], {type:'text/csv'}));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
}