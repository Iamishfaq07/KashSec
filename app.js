/* KashSec Academy v2.6 — Interactive Roadmap Added */ 

/* In renderHome(), after the main roadmap section, add this Interactive Roadmap: */

/*
<section class="sec">
  <div class="sec-head" data-reveal>
    <div class="sec-eyebrow">Your Progress</div>
    <h2>Interactive Roadmap</h2>
    <p class="sec-lead">See how far you've come. Click any path to continue.</p>
  </div>

  <div class="interactive-roadmap">
    ${PATHS.map(p => {
      const prog = getPathProgress(p.id);
      return `
      <a href="#/lesson/${p.id}" class="roadmap-item" data-reveal>
        <div class="roadmap-header">
          <span class="roadmap-num">PATH ${p.n}</span>
          <span class="roadmap-progress">${prog.percent}%</span>
        </div>
        <div class="roadmap-title">${p.title}</div>
        <div class="roadmap-bar">
          <div class="roadmap-fill" style="width: ${prog.percent}%;"></div>
        </div>
        <div class="roadmap-meta">${prog.completed}/${prog.total} lessons</div>
      </a>`;
    }).join('')}
  </div>
</section>
*/

/* Note: Full styled version with CSS will be added. This gives a clear visual roadmap with progress. */

/* ... rest of file ... */
