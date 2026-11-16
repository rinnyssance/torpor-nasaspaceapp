import { z } from 'zod';
export const expressionSchema = z.object({ gene_identifier: z.string().min(1), gene_symbol: z.string().default(''), samples: z.array(z.object({ sample_identifier: z.string().min(1), group: z.string().min(1), value: z.number().finite().nonnegative() })).min(1) });
export type ExpressionRow = z.infer<typeof expressionSchema>;
export function validateExpression(rows: unknown) {
  const result = z.array(expressionSchema).min(1).max(50000).parse(rows);
  const ids = result[0]?.samples.map(s => s.sample_identifier) ?? [];
  if (new Set(ids).size !== ids.length || result.some(r => r.samples.map(s => s.sample_identifier).join('|') !== ids.join('|'))) throw new Error('Every expression row must contain the same unique sample identifiers in the same order.');
  return result;
}
