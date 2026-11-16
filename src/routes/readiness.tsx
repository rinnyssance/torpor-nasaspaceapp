import { createFileRoute } from '@tanstack/react-router';
import { Readiness } from '@/components/research/readiness';
import { metadata } from '@/lib/research';
import { studiesQuery } from '@/lib/research.functions';
export const Route = createFileRoute('/readiness')({  validateSearch: (search:Record<string,unknown>):{process?:string}=>typeof search['process']==='string'?{process:search['process']}:{}, head: () => metadata('Measurement Readiness Lab', 'Evaluate candidate measurement evidence and validation requirements.'), loader: ({ context }) => context.queryClient.ensureQueryData(studiesQuery), component: Page });
function Page() {  const {process}=Route.useSearch();return <Readiness process={process}/>; }
