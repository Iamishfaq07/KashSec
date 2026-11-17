# Skills graph

Starter graph in `studio/model.js` (`SKILLS`). Seven skills, stable IDs, prerequisite links, and pointers to existing lessons, labs, tools, expert labs, research cards, certification objectives, and career roadmap IDs.

`validateStudio()` fails on duplicate IDs, missing references, prerequisite cycles, questions whose answer index is outside the choices, and an invoice policy whose secure version fails or whose vulnerable version passes.

`explainNext(masteredIds)` returns the shortest ready skill and a sentence that names the prerequisites you already marked. Marking is explicit. Opening a lesson does not mark the skill. Passing Fix & Verify adds `web.authz.object-level` because that check is automatic.

Progress is `localStorage` key `kashsec_studio_v1`. It is not written into `kashsec_state_v1`, so course completion, notes, and sync are left alone.

This is not a map of all 491 lessons.
