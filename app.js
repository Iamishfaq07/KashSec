function canUnlockCertificate() {
  const progress = getOverallProgress();
  const finalQuizPassed = localStorage.getItem('kashsec_final_quiz_passed') === 'true';

  // Require high completion (85%+) + passing the final quiz
  return progress.percent >= 85 && finalQuizPassed;
}