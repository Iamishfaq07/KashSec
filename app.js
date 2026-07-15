/* KashSec Academy v2.6 — Achievements/Badges System Added */ 

/* ... existing code ... */

/* --- Achievements / Badges System --- */
const BADGES = [
  {
    id: "getting-started",
    title: "Getting Started",
    desc: "Completed Path 00 (Computer Basics)",
    icon: "🚀",
    condition: () => getPathProgress("00-fresher-basics").percent === 100
  },
  {
    id: "linux-explorer",
    title: "Linux Explorer",
    desc: "Completed Path 03 (Linux)",
    icon: "🐧",
    condition: () => getPathProgress("03-linux").percent === 100
  },
  {
    id: "web-security-pro",
    title: "Web Security Pro",
    desc: "Completed Path 07 (Web Security)",
    icon: "🕸️",
    condition: () => getPathProgress("07-web-security").percent === 100
  },
  {
    id: "bug-bounty-ready",
    title: "Bug Bounty Ready",
    desc: "Completed Path 10 (Bug Bounty)",
    icon: "🎯",
    condition: () => getPathProgress("10-bug-bounty").percent === 100
  },
  {
    id: "ai-aware",
    title: "AI Security Aware",
    desc: "Completed Path 12 (AI Security)",
    icon: "🤖",
    condition: () => getPathProgress("12-ai-security").percent === 100
  },
  {
    id: "course-completer",
    title: "Course Completer",
    desc: "Passed the Final Quiz + High Progress",
    icon: "🏆",
    condition: () => {
      const progress = getOverallProgress();
      const finalPassed = localStorage.getItem('kashsec_final_quiz_passed') === 'true';
      return progress.percent >= 80 && finalPassed;
    }
  }
];

function getEarnedBadges() {
  return BADGES.filter(badge => badge.condition());
}

/* Update renderHome to show Achievements section */
// In renderHome(), after the roadmap section, add:
// 
// <section class="sec">
//   <div class="sec-head">
//     <h2>Your Achievements</h2>
//   </div>
//   <div class="badges">
//     ${getEarnedBadges().map(b => `
//       <div class="badge-card">
//         <div class="badge-icon">${b.icon}</div>
//         <div class="badge-title">${b.title}</div>
//         <div class="badge-desc">${b.desc}</div>
//       </div>
//     `).join('')}
//   </div>
// </section>

/* Note: Full integration in renderHome will be added in next update */

/* ... rest of the file ... */
