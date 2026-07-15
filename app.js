/* KashSec Academy v2.6 — Phase 1: Progress + Bookmarks */ 

 document.getElementById('year').textContent = new Date().getFullYear();
document.body.classList.add('reveal-ready');

/* Init Mermaid with KashSec theme */
if(typeof mermaid !== 'undefined'){
  mermaid.initialize({
    startOnLoad:false,
    theme:'base',
    themeVariables:{
      primaryColor:'#111927', primaryTextColor:'#E9EEF3', primaryBorderColor:'#3FB6A8',
      lineColor:'#8496A6', secondaryColor:'#152131', tertiaryColor:'#0C1119',
      background:'#152131', mainBkg:'#111927', secondBkg:'#152131',
      fontFamily:'Inter, system-ui, sans-serif', fontSize:'14px'
    },
    flowchart:{curve:'basis',padding:15},
    sequence:{actorFontFamily:'Inter',noteFontFamily:'Inter',messageFontFamily:'Inter'}
  });
}

/* --- Course structure — each path has sub-lessons --- */
const PATHS = [ /* ... same as before ... */ ];

/* --- Phase 1: Progress Tracking --- */
const PROGRESS_KEY = 'kashsec_progress';

function getProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []; } catch { return []; }
}

function saveProgress(completed) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed)); }

function isLessonCompleted(pathId, subId) {
  return getProgress().includes(`${pathId}/${subId}`);
}

function toggleLessonComplete(pathId, subId) {
  const key = `${pathId}/${subId}`;
  let completed = getProgress();
  if (completed.includes(key)) completed = completed.filter(k => k !== key);
  else completed.push(key);
  saveProgress(completed);
  return completed.includes(key);
}

function getPathProgress(pathId) {
  const path = findPath(pathId);
  if (!path) return { completed: 0, total: 0, percent: 0 };
  const completed = getProgress().filter(key => key.startsWith(pathId + '/')).length;
  const total = path.subs.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percent };
}

function getOverallProgress() {
  const total = totalSubLessons();
  const completed = getProgress().length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percent };
}

/* --- Phase 1: Bookmarks --- */
const BOOKMARK_KEY = 'kashsec_bookmarks';

function getBookmarks() {
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || []; } catch { return []; }
}

function saveBookmarks(bookmarks) { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks)); }

function isBookmarked(pathId, subId) {
  return getBookmarks().includes(`${pathId}/${subId}`);
}

function toggleBookmark(pathId, subId) {
  const key = `${pathId}/${subId}`;
  let bookmarks = getBookmarks();
  if (bookmarks.includes(key)) {
    bookmarks = bookmarks.filter(k => k !== key);
  } else {
    bookmarks.push(key);
  }
  saveBookmarks(bookmarks);
  return bookmarks.includes(key);
}

function getBookmarkedLessons() {
  const bookmarks = getBookmarks();
  const results = [];
  bookmarks.forEach(key => {
    const [pathId, subId] = key.split('/');
    const path = findPath(pathId);
    if (path) {
      const sub = path.subs.find(s => s.id === subId);
      if (sub) {
        results.push({ pathId, subId, pathTitle: path.title, subTitle: sub.title });
      }
    }
  });
  return results;
}

/* --- Helpers --- */
const app = document.getElementById('app');

/* ... rest of helpers same ... */

function findPath(id){ return PATHS.find(p=>p.id===id); }

function findSubContext(pathId, subId){ /* same as before */ }

/* --- Router & Views (updated with bookmarks) --- */

async function renderSubLesson(pathId, subId){
  const ctx = findSubContext(pathId, subId);
  if(!ctx) return renderNotFound();

  const isCompleted = isLessonCompleted(pathId, subId);
  const isBookmarked = isBookmarked(pathId, subId);

  app.innerHTML = `
    <div class="reader-progress" id="rprog" style="width:0%"></div>
    <div class="reader-wrap">
      <aside class="sidebar" id="sidebar">
        <div class="sb-head">All paths</div>
        <div id="sbNav"></div>
      </aside>
      <div class="reader">
        <div class="reader-nav-top">
          <div class="reader-crumb">
            <a href="#/lesson/${ctx.path.id}" style="color:var(--teal);text-decoration:none">Path ${ctx.path.n}: ${ctx.path.title}</a>
            &nbsp;·&nbsp; Sub-lesson ${ctx.path.n}.${ctx.sub.n}
          </div>
          <button class="btn-ghost sm mobile-only" id="menuBtn">☰ Lessons</button>
        </div>

        <div style="display:flex; gap:0.5rem; margin-bottom:1rem; flex-wrap:wrap;">
          <button id="completeBtn" class="btn-ghost sm">
            ${isCompleted ? '✓ Completed' : 'Mark as Complete'}
          </button>
          <button id="bookmarkBtn" class="btn-ghost sm">
            ${isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
          </button>
        </div>

        <div class="md" id="content"><div class="loading">Loading…</div></div>

        <div class="reader-nav">
          ${ctx.prev ? `<a class="btn-ghost sm" href="#/lesson/${ctx.prev.pathId}/${ctx.prev.subId}">← ${ctx.prev.pathN}.${ctx.prev.subN} ${ctx.prev.subTitle}</a>` : `<span></span>`}
          ${ctx.next ? `<a class="btn-amber sm" href="#/lesson/${ctx.next.pathId}/${ctx.next.subId}">${ctx.next.pathN}.${ctx.next.subN} ${ctx.next.subTitle} →</a>` : `<span></span>`}
        </div>
      </div>
    </div>
  `;

  renderSidebar(pathId, subId);
  document.getElementById('menuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
  wireProgress();

  // Complete button
  const completeBtn = document.getElementById('completeBtn');
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      const nowCompleted = toggleLessonComplete(pathId, subId);
      completeBtn.textContent = nowCompleted ? '✓ Completed' : 'Mark as Complete';
    });
  }

  // Bookmark button
  const bookmarkBtn = document.getElementById('bookmarkBtn');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      const nowBookmarked = toggleBookmark(pathId, subId);
      bookmarkBtn.textContent = nowBookmarked ? '★ Bookmarked' : '☆ Bookmark';
    });
  }

  try {
    const res = await fetch(`course/${pathId}/${subId}.md`);
    if (!res.ok) throw new Error(res.status);
    const md = await res.text();
    document.getElementById('content').innerHTML = enrichMarkdown(md);
    if (typeof mermaid !== 'undefined') {
      try { await mermaid.run({querySelector:'.mermaid'}); } catch(e){}
    }
  } catch(e) {
    document.getElementById('content').innerHTML = `<h1>Coming soon</h1><p>This lesson is being written.</p>`;
  }
}

/* ... other functions remain the same ... */

function renderSidebar(activePathId, activeSubId){ /* same, with checkmarks */ }

/* Add a simple Bookmarks section on home or new route if needed later */

/* ... rest of the file (enrichMarkdown, etc.) stays the same ... */
