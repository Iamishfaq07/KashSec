import type { ComponentType } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui";
import { getLab } from "@/data/labs";
import { CsrfLab, IdorLab, JwtLab, PhishLab, PromptLab, RedirectLab, SqliLab, TraversalLab } from "@/components/play-labs";
import { ClickjackLab, CmdLab, MassLab, OauthLab, RaceLab, RateLab, SsrfLab, TerminalLab, WebhookLab, XxeLab } from "@/components/more-labs";
import { BolaLab, CrackLab, DeserialLab, DnsLab, GraphqlLab, IamLab, LinuxLab, LogLab, SecretLab, YaraLab } from "@/components/story-labs";
import { AdLab, AgentLab, DockerLab, IndirectLab, JailLab, OsintLab, PcapLab, RoastLab, StringsLab, TabletopLab, TakeoverLab, VendorLab, WebLab, WinLab } from "@/components/field-labs";
import { useProgress } from "@/lib/progress";

const benches: Record<string, ComponentType> = {
  sqli: SqliLab,
  phishing: PhishLab,
  jwt: JwtLab,
  "prompt-injection": PromptLab,
  idor: IdorLab,
  traversal: TraversalLab,
  openredirect: RedirectLab,
  csrf: CsrfLab,
  cmdinjection: CmdLab,
  "mass-assignment": MassLab,
  ssrf: SsrfLab,
  racecondition: RaceLab,
  webhookforge: WebhookLab,
  clickjacking: ClickjackLab,
  oauthredirect: OauthLab,
  xxe: XxeLab,
  "rate-limit-bypass": RateLab,
  terminal: TerminalLab,
  clouddockersecrets: SecretLab,
  "graphql-introspection": GraphqlLab,
  loganalysis: LogLab,
  passwordcrack: CrackLab,
  yarabuilder: YaraLab,
  dnsrecon: DnsLab,
  "bola-bfla": BolaLab,
  linuxprivesc: LinuxLab,
  deserialization: DeserialLab,
  iammisconfig: IamLab,
  "ad-attack": AdLab,
  "agentic-risk": AgentLab,
  dockerescape: DockerLab,
  "indirect-injection": IndirectLab,
  irtabletop: TabletopLab,
  jailbreak: JailLab,
  kerberoast: RoastLab,
  malwarestrings: StringsLab,
  osint: OsintLab,
  pcap: PcapLab,
  subdomaintakeover: TakeoverLab,
  vendortiering: VendorLab,
  webapp: WebLab,
  winprivesc: WinLab,
};

export const Route = createFileRoute("/labs/$labId")({
  head: ({ params }) => ({
    meta: [{ title: `${getLab(params.labId)?.title ?? "Lab"} · KashSec` }],
  }),
  component: LabPage,
});

function LabPage() {
  const { labId } = Route.useParams();
  const lab = getLab(labId);
  const markLab = useProgress((state) => state.markLab);
  const practiced = useProgress((state) => Boolean(state.labs[labId]));

  if (!lab) {
    return (
      <Shell>
        <h1 className="font-display text-4xl">That lab is not on the list.</h1>
      </Shell>
    );
  }

  const Bench = benches[lab.id];

  return (
    <Shell>
      <Link to="/labs" className="text-sm text-amber">
        All labs
      </Link>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">{lab.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">{lab.summary}</p>
      <ol className="mt-4 grid gap-1 text-sm text-faint">
        {lab.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div className="mt-6">
        {Bench ? (
          <>
            <p className="mb-4 text-sm text-faint">Nothing here leaves the browser. No command, request, or file is run against a real system.</p>
            <Bench />
          </>
        ) : null}
      </div>
      <div className="mt-6">
        <Button tone={practiced ? "teal" : "ghost"} onClick={() => markLab(lab.id)}>
          {practiced ? "Marked practiced" : "Mark practiced"}
        </Button>
      </div>
    </Shell>
  );
}
