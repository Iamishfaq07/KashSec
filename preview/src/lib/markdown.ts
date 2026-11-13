import DOMPurify from "dompurify";
import { Marked } from "marked";
import { slug } from "@/lib/catalog";

const marked = new Marked({ gfm: true });
let headingIds = new Map<string, number>();

marked.use({
  renderer: {
    code({ text, lang }) {
      if (lang === "mermaid") {
        return `<figure class="diagram"><figcaption>Diagram</figcaption><pre class="mermaid-src">${escapeHtml(text)}</pre></figure>`;
      }
      const label = lang
        ? `<span class="code-lang">${escapeHtml(lang)}</span>`
        : "<span></span>";
      return `<div class="code-block"><div class="code-bar">${label}<button type="button" class="copy-code">Copy</button></div><pre><code>${escapeHtml(text)}</code></pre></div>`;
    },
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const plain = text.replace(/<[^>]+>/g, "");
      const base = slug(plain) || "section";
      const count = (headingIds.get(base) ?? 0) + 1;
      headingIds.set(base, count);
      const id = count === 1 ? base : `${base}-${count}`;
      return `<h${depth} id="${id}">${text}</h${depth}>`;
    },
  },
});

const AMP = "\u0026";

function escapeHtml(value: string) {
  return value
    .replace(/\u0026/g, AMP + "amp;")
    .replace(/</g, AMP + "lt;")
    .replace(/>/g, AMP + "gt;");
}

function rewriteLinks(markdown: string) {
  return markdown
    .replace(/\]\(\/expert-labs\/([a-z0-9-]+)\.html\)/g, "](/expert-labs/$1)")
    .replace(/\]\(\/expert-labs\/\)/g, "](/expert-labs)")
    .replace(/\]\(\/lesson\/([a-z0-9-]+)\/([a-z0-9-]+)\.html\)/g, "](/lesson/$1/$2)")
    .replace(/\]\(\/tools\/([a-z0-9-]+)\.html\)/g, "](https://kashsec.vercel.app/tools/$1.html)")
    .replace(/\]\(#\/playground\/([a-z0-9-]+)\)/g, "](https://kashsec.vercel.app/#/playground/$1)")
    .replace(/\]\(#\/lesson\/([a-z0-9-]+)\/([a-z0-9-]+)\)/g, "](/lesson/$1/$2)")
    .replace(/\]\(#\/lesson\/([a-z0-9-]+)\)/g, "](/paths/$1)")
    .replace(/\]\(#\/careers[^)]*\)/g, "](/paths/20-career-prep)")
    .replace(/\]\(#\/progress[^)]*\)/g, "](/progress)")
    .replace(/\]\(#\/(?:course|roadmap|tracks)[^)]*\)/g, "](/paths)");
}

function sanitizeSvg(source: string) {
  return source
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/javascript:/gi, "");
}

function liftSvg(markdown: string) {
  return markdown.replace(
    /^~~~svg[ \t]*([^\n]*)\n([\s\S]*?)^~~~[ \t]*$/gm,
    (_all, caption: string, body: string) => {
      const trimmed = body.trim();
      if (!trimmed.startsWith("<svg")) {
        return `\n\n*Diagram${caption ? `: ${caption}` : ""}*\n\n`;
      }
      const label = caption.trim()
        ? `<figcaption>${escapeHtml(caption.trim())}</figcaption>`
        : "";
      return `\n\n<figure class="svg-frame">${label}${sanitizeSvg(trimmed)}</figure>\n\n`;
    },
  );
}

const CALLOUT = /^:::(\w+)[ \t]*([^\n]*)\n([\s\S]*?)^:::[ \t]*$/gm;

const LABELS: Record<string, string> = {
  tip: "Tip",
  note: "Note",
  warn: "Watch out",
  warning: "Watch out",
  danger: "Do not skip",
  challenge: "Test yourself",
  lab: "Lab",
};

function parseChunk(markdown: string) {
  return marked.parse(markdown, { async: false }) as string;
}

export function renderLesson(markdown: string) {
  headingIds = new Map();
  let source = rewriteLinks(liftSvg(markdown.replace(/^(\s*<!-- coderabbit-ai-generated:v1 -->\s*)?#\s+.+\n+/, "$1")));
  source = source.replace(
    /^\?\?\?refs\n([\s\S]*?)^\?\?\?[ \t]*$/gm,
    (_all, body: string) => {
      return `\n\n## Further reading\n\n${body.trim()}\n\n`;
    },
  );

  let html = "";
  let last = 0;
  for (const match of source.matchAll(CALLOUT)) {
    const index = match.index ?? 0;
    html += parseChunk(source.slice(last, index));
    const type = match[1].toLowerCase();
    const kind = type === "warning" ? "warn" : type;
    const custom = match[2].trim();
    const label = custom || LABELS[type] || "Note";
    const body = parseChunk(match[3].trim());
    html += `<aside class="callout callout-${kind}"><p class="callout-label">${escapeHtml(label)}</p>${body}</aside>`;
    last = index + match[0].length;
  }
  html += parseChunk(source.slice(last));
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true, svg: true },
    FORBID_TAGS: [
      "script",
      "style",
      "iframe",
      "object",
      "embed",
      "form",
      "foreignObject",
    ],
    FORBID_ATTR: ["style"],
  });
}
