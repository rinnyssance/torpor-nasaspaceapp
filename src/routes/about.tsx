import { createFileRoute } from '@tanstack/react-router';
import { About } from '@/components/research/resources';
import { metadata } from '@/lib/research';
import { studiesQuery } from '@/lib/research.functions';
export const Route = createFileRoute('/about')({  head: () => metadata('About TORPOR', 'Evidence-led translational space biology research and scientific boundaries.'), loader: ({ context }) => context.queryClient.ensureQueryData(studiesQuery), component: Page });
function Page() {  return <About/>; }
