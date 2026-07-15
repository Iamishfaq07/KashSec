/* KashSec Academy v2.6 — Phase 2: Quizzes added */ 

/* ... existing code for PATHS, Progress, Bookmarks, Search ... */

/* --- Phase 2: Quiz System --- */
const QUIZZES = {
  "01-introduction": {
    title: "Introduction to Cybersecurity Quiz",
    questions: [
      {
        q: "What does the 'C' in CIA Triad stand for?",
        options: ["Confidentiality", "Control", "Connectivity", "Cloud"],
        answer: 0
      },
      {
        q: "Which type of hacker has permission to test systems?",
        options: ["Black Hat", "White Hat", "Grey Hat", "Script Kiddie"],
        answer: 1
      },
      {
        q: "What is the most important rule in ethical hacking?",
        options: ["Get permission", "Find as many bugs as possible", "Post everything online", "Use only free tools"],
        answer: 0
      }
    ]
  }
};

function renderQuiz(pathId) {
  const quiz = QUIZZES[pathId];
  if (!quiz) {
    app.innerHTML = `<section class="sec"><h2>Quiz coming soon</h2><p>This path doesn't have a quiz yet.</p></section>`;
    return;
  }

  let currentQuestion = 0;
  let score = 0;
  let answers = [];

  function showQuestion() {
    const q = quiz.questions[currentQuestion];
    app.innerHTML = `
      <section class="sec">
        <h2>${quiz.title}</h2>
        <p>Question ${currentQuestion + 1} of ${quiz.questions.length}</p>
        <div style="margin: 2rem 0; font-size: 1.1rem;">${q.q}</div>
        <div>
          ${q.options.map((opt, i) => `
            <button class="quiz-option" data-index="${i}" style="display:block; width:100%; text-align:left; margin-bottom:0.5rem; padding:0.8rem; border-radius:8px; background:#1e2937; color:#e2e8f0; border:1px solid #334155;">
              ${opt}
            </button>
          `).join('')}
        </div>
        <div style="margin-top:1.5rem;">
          <button id="nextBtn" class="btn-ghost" disabled>Next</button>
        </div>
      </section>
    `;

    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = parseInt(btn.dataset.index);
        answers[currentQuestion] = selected;

        // Highlight correct/incorrect
        document.querySelectorAll('.quiz-option').forEach(b => b.style.border = '1px solid #334155');
        if (selected === q.answer) {
          btn.style.border = '2px solid #22c55e';
          score++;
        } else {
          btn.style.border = '2px solid #ef4444';
          document.querySelectorAll('.quiz-option')[q.answer].style.border = '2px solid #22c55e';
        }

        document.getElementById('nextBtn').disabled = false;
      });
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
      currentQuestion++;
      if (currentQuestion < quiz.questions.length) {
        showQuestion();
      } else {
        showResults();
      }
    });
  }

  function showResults() {
    const percent = Math.round((score / quiz.questions.length) * 100);
    app.innerHTML = `
      <section class="sec">
        <h2>Quiz Complete!</h2>
        <p style="font-size:1.5rem; margin:2rem 0;">Your Score: <strong>${score}/${quiz.questions.length}</strong> (${percent}%)</p>
        <a href="#/lesson/${pathId}" class="btn-amber">Back to Path</a>
      </section>
    `;
  }

  showQuestion();
}

/* Add a button in path overview to take quiz (example for Path 01) */
// You can call renderQuiz('01-introduction') from a button later

/* ... rest of the file ... */
