'use client';

import type { FormEvent } from 'react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '../../lib/supabase';

const adminEmail = 'rosenant@bc.edu';

export default function AdminPage() {
  const supabase = getSupabaseBrowserClient();
  const [checkingSession, setCheckingSession] = useState(Boolean(supabase));
  const [signedIn, setSignedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const [status, setStatus] = useState(supabase ? '' : 'Supabase is not connected yet.');
  const [busy, setBusy] = useState(false);

  const loadHeadline = useCallback(async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'hero_headline')
      .single();

    if (error) {
      setStatus('The headline could not be loaded.');
      return;
    }

    setHeadline(data.content);
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const hasSession = Boolean(data.session);
      setSignedIn(hasSession);
      if (hasSession) await loadHeadline();
      setCheckingSession(false);
    };

    void checkSession();
  }, [loadHeadline, supabase]);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || busy) return;

    setBusy(true);
    setStatus('');

    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password,
    });

    if (error) {
      setStatus('That password did not work.');
      setBusy(false);
      return;
    }

    setPassword('');
    setSignedIn(true);
    await loadHeadline();
    setBusy(false);
  };

  const saveHeadline = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || busy) return;

    const cleanHeadline = headline.trim();
    if (!cleanHeadline) {
      setStatus('The headline cannot be empty.');
      return;
    }

    setBusy(true);
    setStatus('Saving…');

    const { data, error } = await supabase
      .from('site_content')
      .update({ content: cleanHeadline })
      .eq('id', 'hero_headline')
      .select('content')
      .maybeSingle();

    if (error || !data) {
      setStatus('The headline could not be saved.');
      setBusy(false);
      return;
    }

    setHeadline(data.content);
    setStatus('Saved. Refresh the homepage to see it.');
    setBusy(false);
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSignedIn(false);
    setHeadline('');
    setStatus('Signed out.');
  };

  return (
    <main className="admin-page">
      <section className="admin-card" aria-labelledby="admin-title">
        <Link className="admin-back" href="/">← Back to website</Link>
        <p className="section-label">Private editor</p>
        <h1 id="admin-title">Homepage headline</h1>

        {checkingSession ? (
          <p>Checking your login…</p>
        ) : signedIn ? (
          <form onSubmit={saveHeadline}>
            <label htmlFor="headline">Headline</label>
            <textarea
              id="headline"
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              maxLength={160}
              rows={4}
              required
            />
            <div className="admin-actions">
              <button className="admin-primary" type="submit" disabled={busy}>
                {busy ? 'Saving…' : 'Save headline'}
              </button>
              <button className="admin-secondary" type="button" onClick={signOut}>
                Sign out
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={signIn}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={adminEmail} readOnly />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
            <button className="admin-primary" type="submit" disabled={busy || !supabase}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        {status && <p className="admin-status" role="status">{status}</p>}
      </section>
    </main>
  );
}
