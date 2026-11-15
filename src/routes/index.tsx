import { createFileRoute } from "@tanstack/react-router";
import { Overview } from '@/components/research/overview';
import { metadata } from '@/lib/research';
import { studiesQuery } from '@/lib/research.functions';
export const Route = createFileRoute("/")({
  head: () => metadata('Research Overview', 'TORPOR connects space biology evidence to candidate measurements and future wearable validation research.'),
  loader: ({ context }) => context.queryClient.ensureQueryData(studiesQuery),
  component: Overview,
});
