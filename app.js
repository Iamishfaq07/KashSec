/* KashSec Academy v2.6 — All Phases Complete (Search + Progress + Bookmarks + Quizzes + Certificate) */ 

/* ... existing code for PATHS, Progress, Bookmarks, Search, Quizzes ... */

/* --- Final Enhanced Certificate Flow --- */

let pendingCertificateName = '';

// Called after user passes the Final Quiz
function showNameInputForCertificate() {
  app.innerHTML = `
    <section class="sec" style="max-width: 600px; margin: 0 auto; text-align: center;">
      <h2>🎉 Congratulations!</h2>
      <p style="font-size: 1.1rem; margin: 1.5rem 0;">
        You have successfully completed the Final Quiz.<br>
        Please enter your full name to generate your official certificate.
      </p>

      <div style="margin: 2rem 0;">
        <input type="text" id="fullNameInput" placeholder="Enter your full name" 
               style="width: 100%; max-width: 400px; padding: 1rem; font-size: 1.1rem; border-radius: 10px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0;">
      </div>

      <button onclick="generateFinalCertificate()" class="btn-amber" style="padding: 1rem 2.5rem; font-size: 1.1rem;">
        Generate My Certificate
      </button>
    </section>
  `;
}

function generateFinalCertificate() {
  const input = document.getElementById('fullNameInput');
  if (!input || !input.value.trim()) {
    alert('Please enter your full name');
    return;
  }

  const userName = input.value.trim();

  // Create high-quality certificate
  const canvas = document.createElement('canvas');
  canvas.width = 1400;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');

  // Dark professional background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Elegant border
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 12;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  // Inner border
  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 3;
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px Inter, system-ui, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 180);

  // Subtitle
  ctx.font = '26px Inter, system-ui, Arial, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('This is to certify that', canvas.width / 2, 260);

  // Name
  ctx.fillStyle = '#60a5fa';
  ctx.font = 'bold 52px Inter, system-ui, Arial, sans-serif';
  ctx.fillText(userName, canvas.width / 2, 360);

  // Course name
  ctx.fillStyle = '#ffffff';
  ctx.font = '30px Inter, system-ui, Arial, sans-serif';
  ctx.fillText('has successfully completed the', canvas.width / 2, 440);

  ctx.font = 'bold 38px Inter, system-ui, Arial, sans-serif';
  ctx.fillText('KashSec Cybersecurity Academy', canvas.width / 2, 510);

  // Date
  ctx.font = '24px Inter, system-ui, Arial, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Completed on ' + new Date().toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  }), canvas.width / 2, 600);

  // Footer
  ctx.font = '20px Inter, system-ui, Arial, sans-serif';
  ctx.fillText('KashSec Academy • Free World-Class Cybersecurity Education', canvas.width / 2, 720);

  // Buttons container
  const btnContainer = document.createElement('div');
  btnContainer.style.textAlign = 'center';
  btnContainer.style.marginTop = '2rem';

  // PNG Button
  const pngBtn = createDownloadButton('Download PNG', () => {
    const link = document.createElement('a');
    link.download = `KashSec_Certificate_${userName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
  btnContainer.appendChild(pngBtn);

  // PDF Button (opens print dialog)
  const pdfBtn = createDownloadButton('Download / Print as PDF', () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>KashSec Certificate</title></head>
        <body style="margin:0; display:flex; justify-content:center; align-items:center; background:#111827;">
          <img src="${canvas.toDataURL('image/png')}" style="max-width:100%; height:auto;">
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  });
  btnContainer.appendChild(pdfBtn);

  // LinkedIn Share
  const linkedinBtn = createDownloadButton('Share on LinkedIn', () => {
    const text = encodeURIComponent(`I just completed the KashSec Cybersecurity Course and earned my certificate!`);
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
  });
  btnContainer.appendChild(linkedinBtn);

  app.innerHTML = '';
  app.appendChild(canvas);
  app.appendChild(btnContainer);
}

function createDownloadButton(text, onClick) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.style.margin = '0 0.5rem 0.5rem 0';
  btn.style.padding = '0.9rem 1.8rem';
  btn.style.fontSize = '1rem';
  btn.style.borderRadius = '8px';
  btn.style.cursor = 'pointer';
  btn.style.border = 'none';
  btn.style.background = '#1e40af';
  btn.style.color = 'white';
  btn.onclick = onClick;
  return btn;
}

/* Helper: Call this after user passes Final Quiz */
// Example: if (passed) { showNameInputForCertificate(); }

/* All phases are now complete: */
/* Phase 1: Search + Progress + Bookmarks */
/* Phase 2: Quizzes (multiple paths + Final Quiz) */
/* Phase 3: Certificate with name input, PNG/PDF, LinkedIn share */
