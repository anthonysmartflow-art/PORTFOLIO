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
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      const isRecovering = window.location.hash.includes('type=recovery');
      setRecoveryMode(isRecovering && hasSession);
      setSignedIn(hasSession && !isRecovering);
      if (hasSession && !isRecovering) await loadHeadline();
      setCheckingSession(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
        setSignedIn(false);
        setCheckingSession(false);
      }
    });

    void checkSession();

    return () => authListener.subscription.unsubscribe();
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

  const sendPasswordReset = async () => {
    if (!supabase || busy) return;

    setBusy(true);
    setStatus('Sending reset email…');

    const { error } = await supabase.auth.resetPasswordForEmail(adminEmail, {
      redirectTo: 'https://anthonyrosenberger.com/admin',
    });

    setStatus(
      error
        ? 'The reset email could not be sent. Please try again.'
        : 'Check rosenant@bc.edu for the password-reset email.',
    );
    setBusy(false);
  };

  const updatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || busy) return;

    if (newPassword !== confirmPassword) {
      setStatus('The two passwords do not match.');
      return;
    }

    setBusy(true);
    setStatus('Updating password…');

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setStatus('The password could not be updated. Please request a new reset email.');
      setBusy(false);
      return;
    }

    window.history.replaceState({}, '', '/admin');
    setNewPassword('');
    setConfirmPassword('');
    setRecoveryMode(false);
    setSignedIn(true);
    await loadHeadline();
    setStatus('Password updated. You are signed in.');
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
    setRecoveryMode(false);
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
        ) : recoveryMode ? (
          <form onSubmit={updatePassword}>
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
            <label htmlFor="confirm-password">Confirm new password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
            <button className="admin-primary" type="submit" disabled={busy}>
              {busy ? 'Updating…' : 'Set new password'}
            </button>
          </form>
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
            <div className="admin-actions">
              <button className="admin-primary" type="submit" disabled={busy || !supabase}>
                {busy ? 'Working…' : 'Sign in'}
              </button>
              <button
                className="admin-secondary"
                type="button"
                onClick={sendPasswordReset}
                disabled={busy || !supabase}
              >
                Forgot password
              </button>
            </div>
          </form>
        )}

        {status && <p className="admin-status" role="status">{status}</p>}
      </section>
    </main>
  );
}
