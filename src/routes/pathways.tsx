import { createFileRoute } from '@tanstack/react-router';
import { Pathways } from '@/components/research/pathways';
import { metadata } from '@/lib/research';
import { studiesQuery } from '@/lib/research.functions';
export const Route = createFileRoute('/pathways')({  head: () => metadata('Molecular Pathways', 'Explore imported gene expression and pathway enrichment results.'), loader: ({ context }) => context.queryClient.ensureQueryData(studiesQuery), component: Page });
function Page() {  return <Pathways/>; }
