import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../lib/admin-session.ts', import.meta.url), 'utf8');
const exports = {};
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
  { exports, URLSearchParams, require: createRequire(import.meta.url) });
const { beginAdminVisit, isRecoveryLink } = exports;

function fakeAuth(session, failure = null) {
  const calls = [];
  return {
    calls,
    getSession: async () => ({ data: { session }, error: null }),
    signOut: async options => { calls.push(options.scope); return { error: failure }; },
  };
}

test('normal return visit revokes the in-memory session', async () => {
  const auth = fakeAuth({ user: {} });
  assert.equal(await beginAdminVisit(auth, false), false);
  assert.deepEqual(auth.calls, ['local']);
});
test('fresh load has no session and stays signed out', async () => {
  const auth = fakeAuth(null);
  assert.equal(await beginAdminVisit(auth, false), false);
  assert.equal(auth.calls.length, 0);
});
test('valid recovery session is preserved for choosing a new password', async () => {
  const auth = fakeAuth({ user: {} });
  assert.equal(await beginAdminVisit(auth, true), true);
  assert.equal(auth.calls.length, 0);
});
test('recovery URL without a valid session does not open recovery', async () => {
  assert.equal(await beginAdminVisit(fakeAuth(null), true), false);
  assert.equal(isRecoveryLink('#type=recovery'), false);
  assert.equal(isRecoveryLink('#type=recovery&access_token=test&refresh_token=test'), true);
});
test('signout failure rejects rather than accepting a restored login', async () => {
  await assert.rejects(beginAdminVisit(fakeAuth({}, new Error('offline')), false));
});
test('client does not persist sessions across page loads', () => {
  const client = readFileSync(new URL('../lib/supabase.ts', import.meta.url), 'utf8');
  assert.match(client, /persistSession:\s*false/);
});
