/* KashSec Academy — optional cloud sync via Supabase.
   ============================================================
   This is entirely optional. If SUPABASE_URL / SUPABASE_ANON_KEY
   are left blank, SupabaseSync.CONFIGURED is false and every method
   below safely no-ops — the site works exactly as it does today,
   fully offline via localStorage. Nothing about the core course
   experience depends on this file.

   To turn sync on: create a free project at supabase.com, run the
   SQL in SUPABASE_SETUP.md, then paste your Project URL and anon
   public key into the two constants below. Full walkthrough in
   SUPABASE_SETUP.md.
   ============================================================ */
const SUPABASE_URL = 'https://rmddbrobcxttrqdrvtbg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZGRicm9iY3h0dHJxZHJ2dGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNzAxNTUsImV4cCI6MjA5OTc0NjE1NX0.zP5JxNGorbwSA87VfwqiuqRYmpn0IROdye-l6rQk_4s';

const SupabaseSync = (function(){
  const CONFIGURED = !!(SUPABASE_URL && SUPABASE_ANON_KEY);
  let client = null;
  let clientLoadPromise = null;
  let currentUser = null;
  let pushTimer = null;
  const listeners = [];

  function onAuthChange(fn){ listeners.push(fn); }
  function notify(){ listeners.forEach(fn=>{ try{ fn(currentUser); }catch(e){ console.warn('[Sync] listener error', e); } }); }

  function loadClientLib(){
    if(!CONFIGURED) return Promise.reject(new Error('Supabase not configured'));
    if(client) return Promise.resolve(client);
    if(clientLoadPromise) return clientLoadPromise;
    clientLoadPromise = new Promise((resolve,reject)=>{
      if(window.supabase && window.supabase.createClient){
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return resolve(client);
      }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      s.onload = ()=>{
        try{
          client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          resolve(client);
        }catch(e){ reject(e); }
      };
      s.onerror = ()=>reject(new Error('Failed to load the Supabase client library'));
      document.head.appendChild(s);
    });
    return clientLoadPromise;
  }

  /* True if the current URL looks like an auth callback (magic link
     or OAuth redirect landing back on the site with tokens attached),
     so the app's own router can wait instead of treating it as a 404. */
  function isAuthCallbackUrl(){
    return /access_token=|refresh_token=|[?&]code=|type=recovery|type=magiclink/.test(location.hash + location.search);
  }

  async function init(){
    if(!CONFIGURED) return;
    try{
      const sb = await loadClientLib();
      const { data:{ session } } = await sb.auth.getSession();
      currentUser = session ? session.user : null;
      notify();
      sb.auth.onAuthStateChange((event, session)=>{
        currentUser = session ? session.user : null;
        notify();
      });
    }catch(e){
      console.warn('[Sync] init failed', e);
    }
  }

  async function signInWithEmail(email){
    const sb = await loadClientLib();
    const { error } = await sb.auth.signInWithOtp({
      email,
      options:{ emailRedirectTo: location.origin + location.pathname }
    });
    if(error) throw error;
  }

  async function signInWithGoogle(){
    const sb = await loadClientLib();
    const { error } = await sb.auth.signInWithOAuth({
      provider:'google',
      options:{ redirectTo: location.origin + location.pathname }
    });
    if(error) throw error;
  }

  async function signOut(){
    if(!client) return;
    await client.auth.signOut();
    currentUser = null;
    notify();
  }

  function isSignedIn(){ return !!currentUser; }
  function userEmail(){ return currentUser ? (currentUser.email || 'Signed in') : null; }

  /* Safe, additive merge: union every collection so a fresh sign-in
     on a new device never silently discards progress from either
     side. Conflicts favor whichever record represents more progress
     (higher quiz score, "passed" over "not passed") rather than
     blindly preferring one device over the other. */
  function mergeState(local, remote){
    if(!remote) return local;
    const merged = JSON.parse(JSON.stringify(local));
    const unionFlat = (key)=>{ merged[key] = Object.assign({}, remote[key]||{}, local[key]||{}); };
    unionFlat('completed');
    unionFlat('bookmarks');
    unionFlat('notes');
    unionFlat('achievements');
    unionFlat('visitDays');
    unionFlat('certTracker');
    unionFlat('labsCompleted');
    unionFlat('playgroundCompleted');
    unionFlat('weeklyChain');
    unionFlat('pomodoroSessions');
    unionFlat('lessonRatings');
    unionFlat('missedQuestions');
    // Case drafts are independent: keep the newest saved record for each case.
    merged.investigations = {...(local.investigations || {})};
    Object.entries(remote.investigations || {}).forEach(([id, record])=>{
      if(!record || typeof record !== 'object' || Array.isArray(record) ||
        typeof record.notes !== 'string' || !record.answers || typeof record.answers !== 'object' || Array.isArray(record.answers) ||
        record.notes.length > 12000 || !Array.isArray(record.reviewed) || !Number.isFinite(record.updatedAt) || record.updatedAt < 0 || record.updatedAt > 8.64e15 ||
        !Number.isFinite(record.submittedAt) || record.submittedAt < 0 || record.submittedAt > 8.64e15 || !Number.isSafeInteger(record.attempts) || record.attempts < 0 ||
        !Number.isInteger(record.bestScore) || record.bestScore < 0 || record.bestScore > 100) return;
      const localRecord = merged.investigations[id];
      const winner = !localRecord || record.updatedAt > localRecord.updatedAt ? record : localRecord;
      merged.investigations[id] = {...winner,
        reviewed:[...new Set([...(localRecord?.reviewed || []),...record.reviewed])],
        bestScore:Math.max(localRecord?.bestScore || 0,record.bestScore),
        attempts:Math.max(localRecord?.attempts || 0,record.attempts)};
    });

    merged.quizScores = Object.assign({}, remote.quizScores||{});
    Object.entries(local.quizScores||{}).forEach(([pathId, score])=>{
      const r = merged.quizScores[pathId];
      if(!r || score.pct > r.pct) merged.quizScores[pathId] = score;
    });

    if(remote.finalQuiz && local.finalQuiz){
      if(local.finalQuiz.passed && !remote.finalQuiz.passed) merged.finalQuiz = local.finalQuiz;
      else if(remote.finalQuiz.passed && !local.finalQuiz.passed) merged.finalQuiz = remote.finalQuiz;
      else merged.finalQuiz = local.finalQuiz.pct >= remote.finalQuiz.pct ? local.finalQuiz : remote.finalQuiz;
    } else {
      merged.finalQuiz = local.finalQuiz || remote.finalQuiz || null;
    }

    const localTs = local.lastVisited ? local.lastVisited.ts : 0;
    const remoteTs = remote.lastVisited ? remote.lastVisited.ts : 0;
    merged.lastVisited = localTs >= remoteTs ? (local.lastVisited || remote.lastVisited) : remote.lastVisited;
    merged.theme = local.theme || remote.theme || null;
    merged.certName = local.certName || remote.certName || '';
    merged.usedSearch = !!(local.usedSearch || remote.usedSearch);
    // Only a complete, valid saved preference can supersede this device's plan.
    const planTs = plan => typeof plan?.pathId === 'string' && /^[a-z0-9-]+$/.test(plan.pathId) &&
      Number.isInteger(plan.dailyGoal) && plan.dailyGoal >= 1 && plan.dailyGoal <= 10 &&
      Number.isFinite(plan.updatedAt) && plan.updatedAt >= 0 ? plan.updatedAt : 0;
    if(planTs(remote.studyPlan) > planTs(local.studyPlan)) merged.studyPlan = remote.studyPlan;
    const guideTs = guide => ['new','some','practice'].includes(guide?.experience) &&
      ['basics','web','defense'].includes(guide.focus) && Number.isFinite(guide.updatedAt) &&
      guide.updatedAt >= 0 && guide.updatedAt <= 8.64e15 ? guide.updatedAt : 0;
    if(guideTs(remote.learningGuide) > guideTs(local.learningGuide)) merged.learningGuide = remote.learningGuide;

    return merged;
  }

  /* Called once right after sign-in: pulls whatever's stored for this
     account, merges with local, pushes the merged result back up so
     both sides converge, and returns the merged state for the app to
     adopt locally. */
  async function pullAndMerge(localState){
    if(!CONFIGURED || !currentUser) return localState;
    try{
      const sb = await loadClientLib();
      const { data, error } = await sb.from('user_state').select('state').eq('user_id', currentUser.id).maybeSingle();
      if(error) throw error;
      const remoteState = data ? data.state : null;
      const merged = mergeState(localState, remoteState);
      await pushNow(merged);
      return merged;
    }catch(e){
      console.warn('[Sync] pull/merge failed', e);
      return localState;
    }
  }

  async function pushNow(stateObj){
    if(!CONFIGURED || !currentUser) return;
    try{
      const sb = await loadClientLib();
      const { error } = await sb.from('user_state').upsert({ user_id: currentUser.id, state: stateObj }, { onConflict:'user_id' });
      if(error) throw error;
    }catch(e){
      console.warn('[Sync] push failed', e);
    }
  }

  /* Debounced background push — call this from saveState() on every
     change; rapid edits (e.g. typing a note) coalesce into one write. */
  function pushState(stateObj){
    if(!CONFIGURED || !currentUser) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(()=>pushNow(stateObj), 900);
  }

  /* Optional public leaderboard — a user opts in explicitly (see the
     Progress hub). If the leaderboard table hasn't been created yet
     (see SUPABASE_SETUP.md), these just fail silently and the UI
     hides the section — same no-op-safe pattern as the rest of sync. */
  async function pushLeaderboardEntry(displayName, lessonsDone){
    if(!CONFIGURED || !currentUser) return false;
    try{
      const sb = await loadClientLib();
      const { error } = await sb.from('leaderboard').upsert({
        user_id: currentUser.id, display_name: displayName, lessons_done: lessonsDone
      }, { onConflict:'user_id' });
      if(error) throw error;
      return true;
    }catch(e){
      console.warn('[Sync] leaderboard push failed', e);
      return false;
    }
  }

  async function removeLeaderboardEntry(){
    if(!CONFIGURED || !currentUser) return;
    try{
      const sb = await loadClientLib();
      await sb.from('leaderboard').delete().eq('user_id', currentUser.id);
    }catch(e){
      console.warn('[Sync] leaderboard remove failed', e);
    }
  }

  /* Lesson feedback. Ratings are stored per-user so someone can change
     their mind, but the point is the aggregate: the site owner queries
     this table to find which lessons are consistently rated unhelpful.
     Nothing here is publicly readable — see SUPABASE_SETUP.md §9. */
  async function pushLessonRating(lessonKey, rating){
    if(!CONFIGURED || !currentUser) return false;
    try{
      const sb = await loadClientLib();
      if(rating){
        const { error } = await sb.from('lesson_ratings').upsert(
          { user_id: currentUser.id, lesson_key: lessonKey, rating },
          { onConflict: 'user_id,lesson_key' });
        if(error) throw error;
      } else {
        // Rating cleared — remove the row rather than storing a null.
        const { error } = await sb.from('lesson_ratings').delete()
          .eq('user_id', currentUser.id).eq('lesson_key', lessonKey);
        if(error) throw error;
      }
      return true;
    }catch(e){
      console.warn('[Sync] lesson rating push failed', e);
      return false;
    }
  }

  async function fetchProfile(userId){
    if(!CONFIGURED) return null;
    try{
      const sb = await loadClientLib();
      const { data, error } = await sb.from('leaderboard')
        .select('display_name, lessons_done')
        .eq('user_id', userId)
        .maybeSingle();
      if(error) throw error;
      return data;
    }catch(e){
      return null;
    }
  }

  async function fetchLeaderboard(limit){
    if(!CONFIGURED) return null;
    try{
      const sb = await loadClientLib();
      const { data, error } = await sb.from('leaderboard')
        .select('display_name, lessons_done')
        .order('lessons_done', { ascending:false })
        .limit(limit || 10);
      if(error) throw error;
      return data;
    }catch(e){
      return null; // table likely not created yet — caller hides the section
    }
  }

  return {
    CONFIGURED, init, onAuthChange, isAuthCallbackUrl,
    signInWithEmail, signInWithGoogle, signOut,
    isSignedIn, userEmail, pullAndMerge, pushState, pushNow,
    pushLeaderboardEntry, removeLeaderboardEntry, fetchLeaderboard, fetchProfile,
    pushLessonRating,
    get currentUser(){ return currentUser; }
  };
})();
