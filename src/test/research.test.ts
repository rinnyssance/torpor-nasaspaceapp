import { describe, expect, it } from 'vitest';
import { parseAnalysis, validateAssessment, sharedGenes } from '@/lib/research';
describe('Scientific data integrity', () => {
  it('requires adjusted p-values in gene results', () => { expect(() => parseAnalysis('[{"gene_identifier":"A","log2_fold_change":1}]', 'json', 'gene')).toThrow('adjusted_p_value'); });
  it('rejects probabilities outside zero to one', () => { expect(() => parseAnalysis('[{"gene_identifier":"A","log2_fold_change":1,"adjusted_p_value":1.2}]', 'json', 'gene')).toThrow(); });
  it('requires justification and citation for supported assessments', () => { expect(validateAssessment('Supported', '', '')).toBe(false); expect(validateAssessment('Supported', 'Comparison with reference instrument', 'https://doi.org/10.example')).toBe(true); });
  it('uses only the four evidence categories', () => { expect(validateAssessment('Validated', 'Evidence', 'https://doi.org/10.example')).toBe(false); expect(validateAssessment('Not assessed', '', '')).toBe(true); });
  it('does not invent results for empty files', () => { expect(() => parseAnalysis('[]', 'json', 'gene')).toThrow(); });
  it('compares original identifiers, not coincident symbols', () => { const a = { gene_identifier: 'A', gene_symbol: 'X', log2_fold_change: 1, adjusted_p_value: 0.05, annotation: '' }; expect(sharedGenes([a], [{ ...a, gene_identifier: 'B' }])).toEqual([]); });
});