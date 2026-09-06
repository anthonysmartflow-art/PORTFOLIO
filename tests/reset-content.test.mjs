import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

function compile(path, dependencies = {}) {
  const exports = {};
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText, { exports, require: name => dependencies[name],
    URL: { createObjectURL: () => 'blob:preview', revokeObjectURL() {} },
    crypto: { randomUUID: () => 'new-photo' } });
  return exports;
}
const { resetContent } = compile('../lib/reset-content.ts');

function database() {
  const rows = { hero_headline: 'Original headline', profile_photo: 'original.webp' };
  const client = {
    failure: false, rows,
    from(table) {
      assert.equal(table, 'site_content');
      let value, id;
      const query = {
        update(payload) { value = payload.content; return query; },
        eq(column, key) { assert.equal(column, 'id'); id = key; return query; },
        select() { return query; },
        async maybeSingle() {
          if (client.failure) return { data: null, error: new Error('denied') };
          if (value !== undefined) rows[id] = value;
          return { data: { content: rows[id] }, error: null };
        },
      };
      return query;
    },
    storage: { from: () => ({ upload: async () => ({ error: null }) }) },
  };
  return client;
}

test('reset updates only the requested section and rejects denied writes', async () => {
  const db = database();
  await resetContent(db, 'hero_headline', 'Login headline');
  assert.equal(db.rows.hero_headline, 'Login headline');
  assert.equal(db.rows.profile_photo, 'original.webp');
  await resetContent(db, 'profile_photo', 'login-photo.webp');
  assert.equal(db.rows.hero_headline, 'Login headline');
  db.failure = true;
  await assert.rejects(resetContent(db, 'hero_headline', 'Wrong'));
  assert.equal(db.rows.hero_headline, 'Login headline');
});

// Exercise the component's handlers with isolated hooks and an in-memory API.
function photoEditor(db) {
  const slots = [], effects = [];
  let cursor = 0;
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
    },
    useRef(initial) { return react.useState({ current: initial })[0]; },
    useEffect(callback) { const index = cursor++; if (!(index in slots)) { slots[index] = true; effects.push(callback); } },
  };
  const jsx = (type, props) => ({ type, props });
  const Component = compile('../app/admin/ProfilePhotoEditor.tsx', {
    react, 'react/jsx-runtime': { jsx, jsxs: jsx }, 'next/image': { default: 'image' },
    '../../lib/supabase': { getSupabaseBrowserClient: () => db },
    '../../lib/profile-photo': { DEFAULT_PHOTO: 'default.webp', PHOTO_BUCKET: 'profile-photos',
      profilePhotoUrl: path => path, prepareProfilePhoto: async () => ({}) },
    '../../lib/photo-crop': { DEFAULT_CROP: { zoom: 1, x: 50, y: 24 } },
    '../../lib/reset-content': { resetContent },
  }).default;
  let tree;
  function render() { cursor = 0; tree = Component(); return tree; }
  function find(predicate, node = tree) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { for (const child of node) { const found = find(predicate, child); if (found) return found; } }
    else { if (predicate(node)) return node; return find(predicate, node.props?.children ?? null); }
  }
  async function settle() { await new Promise(resolve => setImmediate(resolve)); render(); }
  return { render, find, settle, async mount() { render(); effects.splice(0).forEach(fn => fn()); await settle(); } };
}

test('photo reset restores login photo after multiple saves and clears an unsaved crop', async () => {
  const db = database(), editor = photoEditor(db);
  await editor.mount();
  for (let n = 0; n < 2; n++) {
    editor.find(node => node.props?.id === 'profile-photo').props.onChange({ target: { files: [{}] } });
    await editor.settle();
    editor.find(node => node.props?.id === 'photo-zoom').props.onChange({ target: { value: '3' } });
    editor.render();
    editor.find(node => node.props?.children === 'Save photo').props.onClick();
    await editor.settle();
  }
  assert.equal(db.rows.profile_photo, 'portrait/new-photo.webp');
  editor.find(node => node.props?.id === 'profile-photo').props.onChange({ target: { files: [{}] } });
  await editor.settle();
  editor.find(node => node.props?.['aria-label'] === 'Reset photo').props.onClick();
  await editor.settle();
  assert.equal(db.rows.profile_photo, 'original.webp');
  assert.equal(db.rows.hero_headline, 'Original headline');
  assert.equal(editor.find(node => node.props?.alt === 'Profile photo preview').props.src, 'original.webp');
  assert.equal(editor.find(node => node.props?.id === 'photo-zoom'), undefined);
});

test('failed photo reset retains preview and offers retry; new login captures new baseline', async () => {
  const db = database();
  db.rows.profile_photo = 'next-login.webp';
  const editor = photoEditor(db);
  await editor.mount();
  editor.find(node => node.props?.id === 'profile-photo').props.onChange({ target: { files: [{}] } });
  await editor.settle();
  db.failure = true;
  editor.find(node => node.props?.['aria-label'] === 'Reset photo').props.onClick();
  await editor.settle();
  assert.equal(editor.find(node => node.props?.alt === 'Profile photo preview').props.src, 'blob:preview');
  assert.equal(editor.find(node => node.props?.['aria-label'] === 'Reset photo').props.disabled, false);
  db.failure = false;
  editor.find(node => node.props?.['aria-label'] === 'Reset photo').props.onClick();
  await editor.settle();
  assert.equal(db.rows.profile_photo, 'next-login.webp');
});

test('headline baseline is captured only by login load and cleared on signout, not Save or Reset', () => {
  const source = readFileSync(new URL('../app/admin/page.tsx', import.meta.url), 'utf8');
  assert.equal((source.match(/setInitialHeadline\(data.content\)/g) || []).length, 1);
  const save = source.slice(source.indexOf('const saveHeadline'), source.indexOf('const signOut'));
  const reset = source.slice(source.indexOf('const resetHeadline'), source.lastIndexOf('  return ('));
  assert.doesNotMatch(save + reset, /setInitialHeadline/);
  assert.match(reset, /resetContent\(supabase, 'hero_headline', initialHeadline\)/);
  assert.match(source, /setInitialHeadline\(null\)/);
});
