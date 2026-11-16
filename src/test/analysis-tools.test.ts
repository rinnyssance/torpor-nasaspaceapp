import { describe,it,expect } from 'vitest';
import { mappedGenes } from '@/lib/research';
import { summarizeGenes,enrichedOverlap,validateExpression,csvResults } from '@/lib/analysis-tools';
const gene={gene_identifier:'source1',gene_symbol:'X',annotation:'',log2_fold_change:2,adjusted_p_value:.01};
describe('Research result rules',()=>{
 it('counts threshold-passing positive and negative source contrasts separately',()=>{expect(summarizeGenes([gene,{...gene,gene_identifier:'source2',log2_fold_change:-2},{...gene,adjusted_p_value:.05}],.05,1)).toEqual({analyzed:3,passing:2,positive:1,negative:1})});
 it('does not call annotation overlap shared enrichment without significance in both',()=>{const p={pathway_identifier:'GO:1',pathway_name:'term',gene_count:2,source_database:'GO',adjusted_p_value:.01};expect(enrichedOverlap([p],[{...p,adjusted_p_value:1}],.05)).toEqual([]);expect(enrichedOverlap([p],[p],.05)).toHaveLength(1)});
 it('rejects inferred summary rows as sample heatmap input',()=>{expect(()=>validateExpression([gene])).toThrow()});
 it('requires consistent unique biological samples',()=>{const r={gene_identifier:'A',samples:[{sample_identifier:'S1',group:'Ground',value:3}]};expect(()=>validateExpression([r,{...r,gene_identifier:'B',samples:[{sample_identifier:'S2',group:'Flight',value:4}]}])).toThrow('same unique');expect(validateExpression([r])[0]?.samples[0]?.value).toBe(3)});
 it('excludes ambiguous mappings on the skin side too',()=>{const a={...gene,comparison_identifier:'123'};expect(mappedGenes([a],[{...a,gene_identifier:'B'},{...a,gene_identifier:'C'}])).toEqual([])});
 it('preserves negative numerical fold changes in CSV',()=>{expect(csvResults([{...gene,log2_fold_change:-2}])).toContain('"-2"');expect(csvResults([{...gene,log2_fold_change:-2}])).not.toContain("'-2")});
 it('exports actual statistics and safely quotes source identifiers',()=>{const csv=csvResults([{...gene,gene_symbol:'=SUM(1)'}]);expect(csv).toContain('"2"');expect(csv).toContain('"0.01"');expect(csv).toContain('"\'=SUM(1)"')});
});
