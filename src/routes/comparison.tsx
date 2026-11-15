import { createFileRoute } from '@tanstack/react-router';
import { Comparison } from '@/components/research/comparison';
import { metadata } from '@/lib/research';
import { studiesQuery } from '@/lib/research.functions';
export const Route = createFileRoute('/comparison')({  head: () => metadata('Tissue Comparison', 'Compare bone and skin analysis results with preserved study limitations.'), loader: ({ context }) => context.queryClient.ensureQueryData(studiesQuery), component: Page });
function Page() {  return <Comparison/>; }
