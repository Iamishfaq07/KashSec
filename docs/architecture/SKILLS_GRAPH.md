# Skills graph

Starter graph in `studio/model.js` (`SKILLS`). Stable IDs, prerequisite links, and pointers to existing lessons, labs, tools, expert labs, research cards, certification objectives, and career roadmap IDs. The count is whatever `SKILLS.length` is. It is not a map of all 491 lessons.

`validateStudio()` fails on duplicate IDs, missing references, prerequisite cycles, questions whose answer index is outside the choices, an invoice policy whose secure version fails or whose vulnerable version passes, and the same check for the Northbridge billing role.

`explainNext(masteredIds)` returns the shortest ready skill and a sentence that names the prerequisites you already marked. Marking is explicit. Opening a lesson does not mark the skill. Passing Fix & Verify adds `web.authz.object-level`. Passing the analyst desk adds `soc.triage.logs`. Passing the cloud desk adds `cloud.iam.least-privilege`. Those automatic marks are still not instructor reviews.

`/passport/` lists read, practiced, auto-verified, and self-reported evidence from `kashsec_studio_v1`. `/coach/` answers three fixed questions from that same state. Neither page calls a model or uploads the note.

Progress is `localStorage` key `kashsec_studio_v1`. It is not written into `kashsec_state_v1`, so course completion, notes, and sync are left alone.
