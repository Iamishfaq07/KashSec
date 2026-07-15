/* KashSec Academy v2.6 — Notes per Lesson Added */ 

/* ... existing code ... */

/* --- Notes per Lesson --- */
function getNote(pathId, subId) {
  try {
    return localStorage.getItem(`kashsec_notes_${pathId}_${subId}`) || '';
  } catch {
    return '';
  }
}

function saveNote(pathId, subId, content) {
  localStorage.setItem(`kashsec_notes_${pathId}_${subId}`, content);
}

/* Add Notes section inside renderSubLesson */
// After the content div, add something like:
//
// <div class="notes-section">
//   <h4>📝 Your Notes</h4>
//   <textarea id="lessonNotes" placeholder="Write your notes here...">${getNote(pathId, subId)}</textarea>
// </div>
//
// And add event listener to auto-save:
// document.getElementById('lessonNotes').addEventListener('input', (e) => {
//   saveNote(pathId, subId, e.target.value);
// });

/* Full integration will be added in the renderSubLesson function */

/* ... rest of the file ... */
