# Optional: turn on cloud sync (Supabase)

By default, KashSec Academy tracks your progress, bookmarks, notes, and
quiz scores entirely in your browser's `localStorage` — no account, no
server, no setup. This guide is only for turning on the **optional**
"sign in to sync across devices" feature. Skip it entirely and the site
works exactly as it does today.

Everything below is free on Supabase's permanent free tier.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (free).
2. Click **New project**. Pick any name/region, set a database password
   (save it somewhere — you won't need it for this setup, but it's good
   practice), and wait ~2 minutes for it to provision.

## 2. Create the database table

In your project, open **SQL Editor** (left sidebar) → **New query**, paste
the block below, and click **Run**.

```sql
create table if not exists public.user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;

create policy "Users can view their own state"
  on public.user_state for select
  using (auth.uid() = user_id);

create policy "Users can insert their own state"
  on public.user_state for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own state"
  on public.user_state for update
  using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists user_state_updated_at on public.user_state;
create trigger user_state_updated_at
  before update on public.user_state
  for each row execute function public.set_updated_at();
```

This creates one row per signed-in user, storing their entire progress
blob as JSON, with Row Level Security so a user can only ever read or
write their own row — nobody, including you as the project owner via the
public API, can see another user's data through the anon key.

## 3. Configure the redirect URL

Magic-link emails and Google sign-in both redirect back to your site, so
Supabase needs to know it's allowed.

1. **Authentication → URL Configuration**.
2. Set **Site URL** to your deployed site, e.g.
   `https://kashsec.vercel.app`
3. Under **Redirect URLs**, add the same URL again (and
   `http://localhost:8000/` too, if you want magic links to work while
   testing locally).

## 4. Enable email sign-in (magic link)

**Authentication → Providers → Email** should already be enabled by
default — that's all you need for magic-link sign-in. No further setup.

## 5. Enable Google sign-in (optional — can skip and add later)

Google login needs a Google Cloud OAuth app in addition to the Supabase
toggle:

1. Go to [console.cloud.google.com](https://console.cloud.google.com),
   create a project (or use an existing one).
2. **APIs & Services → OAuth consent screen** — set it up for "External"
   users, fill in the required fields (app name, support email).
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**,
   application type **Web application**.
4. In Supabase, go to **Authentication → Providers → Google** and copy the
   **Callback URL** shown there.
5. Paste that callback URL into the Google OAuth client's
   **Authorized redirect URIs**, save, then copy the Google **Client ID**
   and **Client Secret** into the matching fields in Supabase's Google
   provider settings, and toggle it on.

If you'd rather skip this for now, magic-link sign-in works completely
on its own — the "Continue with Google" button will just show an error
if someone clicks it before this step is done.

## 6. Get your API keys

**Project Settings → API**. You need two values:

- **Project URL** (looks like `https://xxxxx.supabase.co`)
- **anon public** key (a long string — this is meant to be public;
  it's safe to ship in client-side code because Row Level Security
  is what actually protects the data, not secrecy of this key)

## 7. Wire it into the site

Open `sync.js` and fill in the two constants at the top:

```js
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
```

That's it — commit and deploy. The "Sign in" link appears in the nav
automatically once these two values are non-empty; it stays hidden
otherwise. Everyone who doesn't sign in keeps using the site exactly as
before, purely offline.

## 8. Optional: community leaderboard

The Progress hub has an opt-in "join the leaderboard" toggle that shows a
public top-10 of lessons completed, by display name. It's off until you
run this SQL — until then the leaderboard section just doesn't render
(the site detects the missing table and hides it, no error shown to
visitors).

```sql
create table if not exists public.leaderboard (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  lessons_done int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.leaderboard enable row level security;

create policy "Anyone can view the leaderboard"
  on public.leaderboard for select
  using (true);

create policy "Users can insert their own leaderboard row"
  on public.leaderboard for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own leaderboard row"
  on public.leaderboard for update
  using (auth.uid() = user_id);

create policy "Users can delete their own leaderboard row"
  on public.leaderboard for delete
  using (auth.uid() = user_id);
```

Note this table is intentionally public-readable (`display_name` and
`lessons_done` only) since that's the whole point of a leaderboard —
nobody's email, notes, or other progress details are ever in it, and a
user only appears here at all if they explicitly opt in.

## How merging works

When someone signs in for the first time on a given browser, the app
merges local progress with whatever's already stored for their account
(if anything) — it's a **union**, not an overwrite, so nothing gets
silently discarded: completed lessons, bookmarks, notes, and unlocked
achievements from both sides are combined, and for quiz scores it keeps
whichever attempt scored higher. After that, changes sync to the cloud
automatically in the background (debounced ~1 second) every time
progress changes.
