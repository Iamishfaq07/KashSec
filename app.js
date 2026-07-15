/* KashSec Academy v2.6 — Phase 1 Complete: Progress + Bookmarks + Search */ 

/* ... existing code ... */

/* --- Phase 1: Search --- */
function searchLessons(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results = [];

  PATHS.forEach(path => {
    path.subs.forEach(sub => {
      const titleMatch = sub.title.toLowerCase().includes(q);
      const descMatch = sub.desc.toLowerCase().includes(q);
      if (titleMatch || descMatch) {
        results.push({
          pathId: path.id,
          subId: sub.id,
          pathTitle: path.title,
          subTitle: sub.title,
          desc: sub.desc
        });
      }
    });
  });
  return results;
}

/* Add search input to home and course pages */
function addSearchBar(container) {
  const searchHTML = `
    <div style="margin-bottom: 1.5rem;">
      <input type="text" id="globalSearch" placeholder="Search lessons..." 
             style="width: 100%; max-width: 400px; padding: 0.6rem 1rem; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0;">
      <div id="searchResults" style="margin-top: 0.5rem; max-height: 300px; overflow-y: auto;"></div>
    </div>
  `;
  container.insertAdjacentHTML('afterbegin', searchHTML);

  const input = document.getElementById('globalSearch');
  const resultsDiv = document.getElementById('searchResults');

  input.addEventListener('input', () => {
    const query = input.value.trim();
    if (query.length < 2) {
      resultsDiv.innerHTML = '';
      return;
    }
    const matches = searchLessons(query);
    if (matches.length === 0) {
      resultsDiv.innerHTML = `<p style="color:#64748b; padding:0.5rem;">No results found.</p>`;
      return;
    }
    resultsDiv.innerHTML = matches.map(m => `
      <a href="#/lesson/${m.pathId}/${m.subId}" style="display:block; padding:0.6rem; border-radius:6px; margin-bottom:4px; background:#1e2937; color:#e2e8f0; text-decoration:none;">
        <strong>${m.subTitle}</strong><br>
        <span style="font-size:0.85rem; color:#94a3b8;">${m.pathTitle}</span>
      </a>
    `).join('');
  });
}

/* Update renderHome and renderCourseIndex to include search */
// (In real implementation, call addSearchBar after rendering content)

/* ... rest of the file remains the same ... */
