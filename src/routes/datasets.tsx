import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import { Datasets } from '@/components/research/datasets';
import { metadata } from '@/lib/research';
import { studiesQuery } from '@/lib/research.functions';
export const Route = createFileRoute('/datasets')({ validateSearch: (search: Record<string, unknown>): { tissue?: string } => typeof search['tissue'] === 'string' ? { tissue: search['tissue'] } : {}, head: () => metadata('NASA Dataset Explorer', 'Source-traceable NASA space biology studies.'), loader: ({ context }) => context.queryClient.ensureQueryData(studiesQuery), component: Page });
function Page() { const { tissue } = Route.useSearch(); const path=useLocation().pathname; return path === '/datasets' ? <><Datasets initialTissue={tissue??'all'}/><Outlet/></> : <Outlet/>; }
