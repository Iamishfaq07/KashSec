# Learning and search research — 30 October 2026

## Scope and method

Reviewed the current primary-source pages below and compared them with KashSec's catalog, source, generated HTML and routing. This is a focused implementation review, not a job-market survey, keyword-volume study, independent subject-matter review of all lessons, or proof of search rankings. Search Console performance and indexing data were not available in this session. Two public `site:kashsec.vercel.app` searches returned no results during this snapshot; that is not a definitive indexing diagnosis. URL Inspection is the authoritative next owner check.

## Findings and decisions

| Finding | Evidence | Shipped response |
|---|---|---|
| Agents add an application permission boundary, not just a prompt problem. | MCP security guidance addresses token audience, forbidden token passthrough, consent and SSRF; OWASP has separate LLM and agentic guidance. | Add an MCP/tool authorization lesson and an expert gateway case with a positive authorized read and negative tenant, object, tool and spoofed-approval tests. |
| Retrieval relevance and document access are different decisions. | The current OWASP LLM framework includes vector/embedding and disclosure risks. | Add a RAG isolation lesson and a runnable eligibility lab. Document cache, revocation and real vector-store integration limits. |
| Candidates need evidence of work, with explicit limitations. | NICE describes capability through tasks, knowledge and skills. | Add a release-gate lesson connecting deterministic policy tests, variable model evaluations and reproducible reports. This is a teaching application of the framework, not an official NICE alignment assessment. |
| The homepage HTTP response contained only “Loading…” as its main content. | Repository inspection; Google's JavaScript guidance explains crawling and rendering as separate stages. | Generate a useful visible homepage with native links, requirements, candidate entry points and the complete path list. Test without JavaScript. |
| Primary shared navigation still used fragment URLs even where static canonical pages existed. | Repository inspection and Google's link-discovery guidance. | Reuse the app's canonical mapping during prerendering and preserve client navigation and active states. |
| Content growth can leave share cards and metadata counts stale. | Repository metadata/card comparison. | Regenerate the homepage and AI path social cards, update counts from the catalog, and retain integrity checks. |
| FAQ rich results are no longer a supported Google feature as of May 2026. | Google's current documentation update log. | Remove the obsolete generator comment promising a FAQ rich result. Keep useful FAQ text and descriptive semantic markup; do not claim special search display. |
| No special AI schema or llms.txt addition is required for Google's AI search features. | Google AI features guidance and current update log. | Improve visible content, ordinary internal links, canonicals and metadata. Keep the existing llms.txt as a convenience without claiming a ranking benefit. |

## Primary sources consulted

Accessed 30 October 2026. These are references, not endorsements or affiliations.

1. [MCP security best practices, versioned documentation](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices). The `latest` security URL redirected here during review. Protocol details must be checked against the version actually deployed.
2. [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/), including its downloadable guide. Used to select application-boundary topics, not to assert conformance.
3. [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/). The existing KashSec Top 10 lesson already names the 2026 edition; this pass adds applied exercises rather than relabeling the same list as new.
4. [OWASP Agentic Security Initiative](https://genai.owasp.org/initiatives/agentic-security-initiative/). Shows additional maintained agentic resources, including the Agent Control Standard. Full ACS implementation is outside these local fixtures.
5. [NIST NICE Framework overview](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/about). Basis for task-oriented evidence rather than invented job guarantees.
6. [NIST NICE latest updates](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/about/nice-framework-latest-updates). The latest-updates and release notice identify the April 2026 component update; the current-versions page has a conflicting date label. No date-sensitive credential or job claims were built from that discrepancy.
7. [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics). Used for HTML content and link discovery.
8. [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features). Ordinary SEO fundamentals apply; eligibility does not guarantee indexing or inclusion.
9. [Google helpful, reliable content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). Used to prioritize original exercises, plain wording, evidence, attribution and honest limitations over high-volume generated landing pages.
10. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap). Canonical absolute URLs, significant modification dates and owner submission workflow.
11. [Google course-list structured data](https://developers.google.com/search/docs/appearance/structured-data/course). Describes eligibility conditions; this self-paced site does not invent an instructor roster or claim guaranteed course rich results.
12. [Google documentation updates](https://developers.google.com/search/updates). Confirms FAQ feature retirement and clarifies that llms.txt is not a Google ranking optimization.

## Candidate discovery and quality plan

The beginner, AppSec and AI security paths are visible entry points on the homepage. Learners can move from an introductory explanation to a lab, then export a report with their own results. Existing graphical path stages and optional credential notes remain connected; the AI path's last stage now covers the new lessons and its offline practice file.

The Python suites deliberately test small control contracts. They do not run an LLM, implement OAuth, validate MCP interoperability, query a vector database or establish prompt-injection resistance. Model-based evaluation would require versioned fixtures, repeated runs, cost controls, privacy review and separately configured provider access. No external model service was added or called.

Next useful work, after observing learner behavior: add more held-out policy fixtures, get independent technical review of the new lessons, and prioritize future labs using actual search queries and learner feedback. Avoid adding a generic chatbot or large sets of near-duplicate pages solely for SEO.

## Owner actions and measurement

The repository now supplies the technical content and sitemap. Search Console ownership cannot be verified or a sitemap submitted through the available GitHub connection. The site owner should:

1. Add the URL-prefix property `https://kashsec.vercel.app/` in Google Search Console and complete Google's ownership method. Do not publish a guessed verification token.
2. Submit `https://kashsec.vercel.app/sitemap.xml` there. Use URL Inspection for the homepage, the AI path, one new lesson and each new expert case; request indexing where appropriate.
3. Review indexing exclusions, canonical selection, mobile/Core Web Vitals field data, impressions, clicks and click-through rate over the following weeks. Compare beginner, AppSec and AI entry pages without assuming an immediate ranking improvement.
4. Use aggregated search data to improve weak explanations and navigation. Do not add fabricated reviews, salary guarantees, certification claims or paid backlinks.

Live Lighthouse/CrUX scores and Google Rich Results Test certification are not claimed. Build/browser checks are documented in the PR and audit. A sitemap, structured data and good implementation improve eligibility and usability; they cannot guarantee traffic.
