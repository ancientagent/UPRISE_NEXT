'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import type { User } from '@uprise/types';
import { api } from '@/lib/api';
import { loadAccountEntryDestination } from '@/lib/auth/entry-routing';
import { useAuthStore } from '@/store/auth';

type AuthMode = 'create' | 'sign-in';

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export default function EntryAccountPanel() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [mode, setMode] = useState<AuthMode>('create');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (mode === 'create' && password !== confirmPassword) {
      setError('Passwords must match.');
      return;
    }

    setSubmitting(true);
    try {
      const response =
        mode === 'create'
          ? await api.post<AuthResponse>('/auth/register', {
              email,
              username,
              displayName,
              password,
              confirmPassword,
            })
          : await api.post<AuthResponse>('/auth/login', { email, password });
      const tokens = response.data;
      if (!tokens?.accessToken) {
        throw new Error('Account session could not be created.');
      }

      const [me, destination] = await Promise.all([
        api.get<User>('/users/me', { token: tokens.accessToken }),
        loadAccountEntryDestination(tokens.accessToken),
      ]);
      if (!me.data) {
        throw new Error('Account profile could not be loaded.');
      }

      setAuth(me.data, tokens.accessToken);
      router.push(destination);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Account setup could not be completed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-md border-2 border-black bg-[#f7f3e9] p-5 shadow-[7px_7px_0_#111] sm:p-7">
      <div className="flex border-b-2 border-black text-sm font-bold uppercase tracking-[0.12em]">
        <button
          type="button"
          onClick={() => setMode('create')}
          className={`min-h-11 flex-1 border-r-2 border-black px-3 ${mode === 'create' ? 'bg-[#d7f52a]' : 'bg-transparent'}`}
        >
          Create account
        </button>
        <button
          type="button"
          onClick={() => setMode('sign-in')}
          className={`min-h-11 flex-1 px-3 ${mode === 'sign-in' ? 'bg-[#d7f52a]' : 'bg-transparent'}`}
        >
          Sign in
        </button>
      </div>

      <form className="mt-6 space-y-4" onSubmit={submit}>
        {mode === 'create' ? (
          <>
            <label className="block text-xs font-bold uppercase tracking-[0.12em]">
              Display name
              <input
                required
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="mt-1.5 w-full border-2 border-black bg-white px-3 py-2.5 text-base normal-case tracking-normal outline-none focus:ring-2 focus:ring-[#d7f52a]"
                autoComplete="name"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-[0.12em]">
              UPRISE handle
              <input
                required
                minLength={3}
                maxLength={30}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-1.5 w-full border-2 border-black bg-white px-3 py-2.5 text-base normal-case tracking-normal outline-none focus:ring-2 focus:ring-[#d7f52a]"
                autoComplete="username"
              />
              <span className="mt-1 block text-[11px] font-normal normal-case tracking-normal text-black/60">
                Your unique handle. Your name remains the primary profile label.
              </span>
            </label>
          </>
        ) : null}
        <label className="block text-xs font-bold uppercase tracking-[0.12em]">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 w-full border-2 border-black bg-white px-3 py-2.5 text-base normal-case tracking-normal outline-none focus:ring-2 focus:ring-[#d7f52a]"
            autoComplete="email"
          />
        </label>
        <label className="block text-xs font-bold uppercase tracking-[0.12em]">
          Password
          <input
            required
            minLength={mode === 'create' ? 8 : 1}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 w-full border-2 border-black bg-white px-3 py-2.5 text-base normal-case tracking-normal outline-none focus:ring-2 focus:ring-[#d7f52a]"
            autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
          />
        </label>
        {mode === 'create' ? (
          <label className="block text-xs font-bold uppercase tracking-[0.12em]">
            Confirm password
            <input
              required
              minLength={8}
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-1.5 w-full border-2 border-black bg-white px-3 py-2.5 text-base normal-case tracking-normal outline-none focus:ring-2 focus:ring-[#d7f52a]"
              autoComplete="new-password"
            />
          </label>
        ) : null}
        {error ? <p className="border-l-4 border-red-700 pl-3 text-sm text-red-800">{error}</p> : null}
        <Button className="w-full rounded-none" size="lg" disabled={submitting} type="submit">
          {submitting ? 'Opening account...' : mode === 'create' ? 'Start Home Scene setup' : 'Continue'}
        </Button>
      </form>
    </section>
  );
}
