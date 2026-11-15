import { createFileRoute } from '@tanstack/react-router';
import { Roadmap } from '@/components/research/resources';
import { metadata } from '@/lib/research';
import { studiesQuery } from '@/lib/research.functions';
export const Route = createFileRoute('/roadmap')({  head: () => metadata('Wearable Roadmap', 'Plan biological discovery, validation and wearable research.'), loader: ({ context }) => context.queryClient.ensureQueryData(studiesQuery), component: Page });
function Page() {  return <Roadmap/>; }
