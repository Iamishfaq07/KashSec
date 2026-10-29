import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/shell";

type ExpertModule = {
  prepareExpertStyles?: () => Promise<void>;
  EXPERT_LABS: { id: string; title: string }[];
  mountExpertLabs: (options: {
    root: HTMLDivElement;
    id?: string;
    href: (lab: string | null) => string;
    lessonHref: (key: string) => string;
    navigate: (lab: string | null) => void;
  }) => () => void;
};
declare global { interface Window { KashExpertLabs?: ExpertModule } }

export function ExpertLabs({ id }: { id?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    let cancelled = false;
    let timedOut = false;
    let cleanup: (() => void) | undefined;
    setStatus("loading");
    root.current?.replaceChildren();
    const url = "/expert-labs.js" + (attempt ? `?retry=${attempt}` : "");
    const timer = setTimeout(() => { timedOut = true; if (!cancelled) setStatus("error"); }, 12000);
    let script: HTMLScriptElement | undefined;
    const load = window.KashExpertLabs ? Promise.resolve(window.KashExpertLabs) : new Promise<ExpertModule>((resolve, reject) => {
      script = document.createElement("script");
      script.type = "module";
      script.src = url;
      script.onload = () => window.KashExpertLabs ? resolve(window.KashExpertLabs) : reject(new Error("Expert module unavailable"));
      script.onerror = () => reject(new Error("Expert module unavailable"));
      document.head.append(script);
    });
    void load.then(async (module) => {
      if (module.prepareExpertStyles) await module.prepareExpertStyles();
      if (cancelled || timedOut || !root.current) return;
      clearTimeout(timer);
      cleanup = module.mountExpertLabs({
        root: root.current,
        id,
        href: (lab: string | null) => lab ? `/expert-labs/${lab}` : "/expert-labs",
        lessonHref: (key: string) => `/lesson/${key}`,
        navigate: (lab: string | null) => {
          if (lab) void navigate({ to: "/expert-labs/$caseId", params: { caseId: lab } });
          else void navigate({ to: "/expert-labs" });
        },
      });
      const title = module.EXPERT_LABS.find((lab: { id: string }) => lab.id === id)?.title ?? "Expert Labs";
      document.title = `${title} · KashSec`;
      setStatus("ready");
    }).catch(() => { if (!cancelled) { clearTimeout(timer); setStatus("error"); } });
    return () => { cancelled = true; clearTimeout(timer); script?.remove(); cleanup?.(); };
  }, [id, attempt, navigate]);
  return (
    <Shell>
      {status === "loading" ? <p role="status">Opening Expert Labs…</p> : null}
      {status === "error" ? <div role="status"><h1>Expert Labs could not open</h1><p>Check your connection and try again.</p><button type="button" onClick={() => setAttempt(value => value + 1)}>Retry Expert Labs</button></div> : null}
      <div ref={root} />
    </Shell>
  );
}
