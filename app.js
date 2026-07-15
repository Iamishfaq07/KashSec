/* KashSec Academy v2.6 — Multiple Quizzes + Phase 3 Started */ 

/* ... existing code ... */

/* --- Expanded Quizzes for Multiple Paths --- */
const QUIZZES = {
  "00-fresher-basics": {
    title: "Computer Basics & Security Mindset Quiz",
    questions: [
      { q: "What is the main purpose of an operating system?", options: ["Run applications and manage hardware", "Browse the internet", "Store files only", "Protect against viruses only"], answer: 0 },
      { q: "Which of these is a strong password practice?", options: ["Use the same password everywhere", "Use a long unique password + 2FA", "Write it on a sticky note", "Use your birth year"], answer: 1 },
      { q: "What is phishing?", options: ["A type of fishing", "A social engineering attack to steal information", "A programming language", "A type of malware"], answer: 1 }
    ]
  },

  "01-introduction": {
    title: "Introduction to Cybersecurity Quiz",
    questions: [
      { q: "What does the 'C' in CIA Triad stand for?", options: ["Confidentiality", "Control", "Connectivity", "Cloud"], answer: 0 },
      { q: "Which type of hacker has permission to test systems?", options: ["Black Hat", "White Hat", "Grey Hat", "Script Kiddie"], answer: 1 },
      { q: "What is the most important rule in ethical hacking?", options: ["Get permission", "Find as many bugs as possible", "Post everything online", "Use only free tools"], answer: 0 }
    ]
  },

  "02-networking": {
    title: "Networking Fundamentals Quiz",
    questions: [
      { q: "What does IP stand for?", options: ["Internet Protocol", "Internal Process", "Information Packet", "Integrated Port"], answer: 0 },
      { q: "Which protocol is connection-oriented and reliable?", options: ["UDP", "TCP", "ICMP", "ARP"], answer: 1 },
      { q: "What is the main purpose of DNS?", options: ["Encrypt traffic", "Translate domain names to IP addresses", "Block hackers", "Speed up internet"], answer: 1 }
    ]
  },

  "06-fundamentals": {
    title: "Cybersecurity Fundamentals Quiz",
    questions: [
      { q: "What does the CIA Triad stand for?", options: ["Control, Integrity, Availability", "Confidentiality, Integrity, Availability", "Confidentiality, Information, Access", "Cyber, Integrity, Attack"], answer: 1 },
      { q: "What is the main goal of hashing passwords?", options: ["Make them faster to type", "Store them securely so they can't be easily reversed", "Share them with others", "Make them shorter"], answer: 1 },
      { q: "Which is a common social engineering attack?", options: ["SQL Injection", "Phishing", "Buffer Overflow", "Man-in-the-Middle"], answer: 1 }
    ]
  },

  "07-web-security": {
    title: "Web Security Quiz",
    questions: [
      { q: "What does OWASP stand for?", options: ["Open Web Application Security Project", "Online Web Attack Security Program", "Open Website Attack Safety Protocol", "Organized Web App Security Panel"], answer: 0 },
      { q: "Which attack involves injecting malicious scripts into web pages?", options: ["SQL Injection", "XSS (Cross-Site Scripting)", "CSRF", "IDOR"], answer: 1 },
      { q: "What is the main purpose of Burp Suite?", options: ["Writing code", "Web application security testing", "Making websites faster", "Hosting websites"], answer: 1 }
    ]
  },

  "12-ai-security": {
    title: "AI & LLM Security Quiz",
    questions: [
      { q: "What is prompt injection?", options: ["A way to speed up AI", "Tricking an LLM into ignoring its rules or leaking data", "A type of hardware attack", "A method to train AI faster"], answer: 1 },
      { q: "Which is part of the OWASP LLM Top 10?", options: ["Prompt Injection", "SQL Injection", "Buffer Overflow", "Phishing"], answer: 0 },
      { q: "Why is AI security becoming more important?", options: ["AI is not used much", "AI systems are being widely adopted and can be attacked in new ways", "Traditional security is enough", "AI cannot be hacked"], answer: 1 }
    ]
  },

  "13-career-prep": {
    title: "Career & Job Prep Quiz",
    questions: [
      { q: "What is one of the most recognized entry-level security certifications?", options: ["OSCP", "Security+", "OSWE", "CISSP"], answer: 1 },
      { q: "Why are projects and GitHub important for a security career?", options: ["They are not important", "They demonstrate practical skills to employers", "Only certificates matter", "They are only for developers"], answer: 1 },
      { q: "What should you do in your first 90 days of a security job?", options: ["Try to change everything immediately", "Learn the environment, build relationships, and find quick wins", "Stay quiet and do nothing", "Only focus on certifications"], answer: 1 }
    ]
  }
};

/* Render Quiz function remains the same as before */

function renderQuiz(pathId) {
  const quiz = QUIZZES[pathId];
  if (!quiz) {
    app.innerHTML = `<section class="sec"><h2>Quiz coming soon for this path</h2><p>We're adding more quizzes regularly.</p><a href="#/course" class="btn-ghost">Back to Course</a></section>`;
    return;
  }

  // ... (same quiz logic as before)
  let currentQuestion = 0;
  let score = 0;

  function showQuestion() { /* ... existing question rendering ... */ }
  function showResults() { /* ... existing results ... */ }

  showQuestion();
}

/* --- Phase 3 Started: Certificate + Interactive Roadmap Planning --- */
// Certificate Generator and Interactive Roadmap will be added next.
// These are more advanced features.

/* You can now call renderQuiz('path-id') from buttons in path overviews */

/* ... rest of app.js ... */
