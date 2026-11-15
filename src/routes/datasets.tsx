import { createFileRoute } from '@tanstack/react-router';
import { Datasets } from '@/components/research/datasets';
import { metadata } from '@/lib/research';
import { studiesQuery } from '@/lib/research.functions';
export const Route = createFileRoute('/datasets')({ validateSearch: (search: Record<string, unknown>) => ({ tissue: typeof search['tissue'] === "string" ? search['tissue'] : "all" }), head: () => metadata('NASA Dataset Explorer', 'Source-traceable NASA space biology studies.'), loader: ({ context }) => context.queryClient.ensureQueryData(studiesQuery), component: Page });
function Page() { const { tissue } = Route.useSearch(); return <Datasets initialTissue={tissue}/>; }
