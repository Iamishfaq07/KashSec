import { createFileRoute } from "@tanstack/react-router";
import { ExpertLabs } from "@/components/expert-labs";
export const Route = createFileRoute("/expert-labs/")({
  head: () => ({ meta: [{ title: "Expert Labs · KashSec" }] }),
  component: () => <ExpertLabs />,
});
