/* KashSec Academy v2.6 — Final Quiz + Certificate System */ 

/* ... existing code ... */

/* --- Final Comprehensive Quiz --- */
QUIZZES['final-course'] = {
  title: "KashSec Final Course Quiz",
  questions: [
    { q: "What is the primary goal of the CIA Triad?", options: ["To make systems faster", "To ensure Confidentiality, Integrity, and Availability of information", "To block all internet traffic", "To create more vulnerabilities"], answer: 1 },
    { q: "Which attack involves tricking users into revealing sensitive information?", options: ["SQL Injection", "Phishing / Social Engineering", "Buffer Overflow", "Man-in-the-Middle"], answer: 1 },
    { q: "What does prompt injection target?", options: ["Operating Systems", "Large Language Models (LLMs)", "Network Firewalls", "Web Servers only"], answer: 1 },
    { q: "Which protocol is considered more secure for web traffic?", options: ["HTTP", "HTTPS", "FTP", "Telnet"], answer: 1 },
    { q: "What is the recommended first step before testing any system ethically?", options: ["Start scanning immediately", "Get written permission / Scope", "Post findings on social media", "Use only open source tools"], answer: 1 },
    { q: "What is a key benefit of using localStorage for progress in this course?", options: ["It syncs across all devices automatically", "It saves your progress in the browser", "It requires an account", "It deletes data after 24 hours"], answer: 1 },
    { q: "Which of the following is part of good password hygiene?", options: ["Reusing passwords across sites", "Using long, unique passwords + MFA", "Writing passwords in a notebook", "Using only your name + birth year"], answer: 1 },
    { q: "What does OWASP primarily focus on?", options: ["Hardware security", "Web application security", "Cloud infrastructure only", "Mobile app development"], answer: 1 }
  ]
};

/* --- Certificate Unlock Logic --- */
function canUnlockCertificate() {
  const progress = getOverallProgress();
  const finalQuizPassed = localStorage.getItem('kashsec_final_quiz_passed') === 'true';

  // Require at least 70% overall progress + passing the final quiz
  return progress.percent >= 70 && finalQuizPassed;
}

function markFinalQuizPassed() {
  localStorage.setItem('kashsec_final_quiz_passed', 'true');
}

/* --- Certificate Generator (using Canvas) --- */
function generateCertificate() {
  if (!canUnlockCertificate()) {
    alert("You need to complete at least 70% of the course and pass the Final Quiz to unlock the certificate.");
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Inter, Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Certificate of Completion', canvas.width / 2, 180);

  // Subtitle
  ctx.font = '28px Inter, Arial';
  ctx.fillText('This is to certify that', canvas.width / 2, 260);

  // Name (placeholder - can be improved later)
  ctx.font = 'bold 42px Inter, Arial';
  ctx.fillStyle = '#60a5fa';
  ctx.fillText('Ishfaq Ahmad Bhat', canvas.width / 2, 340);   // ← You can make this dynamic later

  // Course name
  ctx.fillStyle = '#ffffff';
  ctx.font = '32px Inter, Arial';
  ctx.fillText('has successfully completed the', canvas.width / 2, 420);
  ctx.font = 'bold 36px Inter, Arial';
  ctx.fillText('KashSec Cybersecurity Course', canvas.width / 2, 480);

  // Date
  ctx.font = '24px Inter, Arial';
  ctx.fillText('Completed on: ' + new Date().toLocaleDateString(), canvas.width / 2, 580);

  // Footer
  ctx.font = '20px Inter, Arial';
  ctx.fillText('KashSec Academy — Free Cybersecurity Education', canvas.width / 2, 700);

  // Download
  const link = document.createElement('a');
  link.download = 'KashSec_Certificate.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/* You can now add a button somewhere (e.g. home or new route) that calls generateCertificate() */

/* ... rest of the code ... */
