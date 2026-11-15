import { createFileRoute } from '@tanstack/react-router';
import { Library } from '@/components/research/resources';
import { metadata } from '@/lib/research';
import { studiesQuery } from '@/lib/research.functions';
export const Route = createFileRoute('/library')({  head: () => metadata('Research Library', 'Manage scientific sources and research notes.'), loader: ({ context }) => context.queryClient.ensureQueryData(studiesQuery), component: Page });
function Page() {  return <Library/>; }
