import { createFileRoute } from '@tanstack/react-router';
import { Findings } from '@/components/research/findings';
import { metadata } from '@/lib/research';
import { studiesQuery } from '@/lib/research.functions';
export const Route = createFileRoute('/findings')({head:()=>metadata('Research Findings','Organize source-traceable numerical results, interpretations and follow-up research questions.'),loader:({context})=>context.queryClient.ensureQueryData(studiesQuery),component:Findings});