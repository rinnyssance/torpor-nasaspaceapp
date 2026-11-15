import { createFileRoute } from '@tanstack/react-router';
import { StudyDetail } from '@/components/research/datasets';
import { metadata } from '@/lib/research';
import { studiesQuery } from '@/lib/research.functions';
export const Route = createFileRoute('/datasets/$studyId')({ head: ({ params }) => metadata(params.studyId + ' Study', 'Inspect source metadata and imported analyses for ' + params.studyId + '.'), loader: ({ context }) => context.queryClient.ensureQueryData(studiesQuery), component: Page });
function Page() {const {studyId}=Route.useParams();return <StudyDetail studyId={studyId}/>;}
