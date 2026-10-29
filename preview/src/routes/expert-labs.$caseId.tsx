import { createFileRoute } from "@tanstack/react-router";
import { ExpertLabs } from "@/components/expert-labs";
export const Route = createFileRoute("/expert-labs/$caseId")({
  head: () => ({ meta: [{ title: "Expert case · KashSec" }] }),
  component: CasePage,
});
function CasePage() { const { caseId } = Route.useParams(); return <ExpertLabs id={caseId} />; }
