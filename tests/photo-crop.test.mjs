import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
const exports = {};
vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../lib/photo-crop.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports });
const { cropRectangle } = exports;

test('portrait output is 4:5 and zoom reduces the selected area', () => {
  const full = cropRectangle(2000, 3000, { zoom: 1, x: 50, y: 0 });
  const tight = cropRectangle(2000, 3000, { zoom: 4, x: 50, y: 0 });
  assert.equal(full.width / full.height, 0.8);
  assert.equal(tight.width, full.width / 4);
  assert.equal(tight.y, 0);
});
test('all positions remain inside portrait, landscape and square images', () => {
  for (const [w,h] of [[2000,3000],[3000,2000],[2000,2000]]) {
    for (const zoom of [1, 1.5, 4]) for (const x of [0,50,100]) for (const y of [0,50,100]) {
      const r = cropRectangle(w,h,{zoom,x,y});
      assert.ok(r.x >= 0 && r.y >= 0 && r.x+r.width <= w+0.001 && r.y+r.height <= h+0.001);
    }
  }
});
test('saved crop matches CSS cover, scale and percentage origin preview', () => {
  for (const [w,h] of [[2000,3000],[3000,2000]]) for (const zoom of [1,2,4]) {
    const crop={zoom,x:37,y:12};
    const scale=Math.max(300/w,375/h)*zoom;
    const r=cropRectangle(w,h,crop);
    assert.ok(Math.abs(r.width-300/scale)<0.001);
    assert.ok(Math.abs(r.x-((w*scale-300)*crop.x/100)/scale)<0.001);
    assert.ok(Math.abs(r.y-((h*scale-375)*crop.y/100)/scale)<0.001);
  }
});
test('invalid dimensions are rejected', () => {
  assert.throws(()=>cropRectangle(0,300,{zoom:1,x:50,y:50}));
});
