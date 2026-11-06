import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('row column and box duplicates', () => {
  const g = Array(81).fill(0);
  g[0] = 1;
  g[1] = 1;
  g[9] = 1;
  assert.deepEqual(api.sudokuConflicts(g), [0, 1, 9]);
});
test('empty grid candidates', () => {
  assert.deepEqual(api.sudokuCandidates(Array(81).fill(0), 0), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('known standard puzzle', () => {
  const g = '530070000600195000098000060800060003400803001700020006060000280000419005000080079'
      .split('')
      .map(Number),
    r = api.solveSudoku(g);
  assert.equal(
    r.join(''),
    '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
  );
  assert.equal(g[2], 0);
});
test('solved copy', () => {
  const g = Array.from(
      { length: 81 },
      (_, i) => ((Math.floor(i / 9) * 3 + Math.floor(Math.floor(i / 9) / 3) + (i % 9)) % 9) + 1,
    ),
    r = api.solveSudoku(g);
  assert.deepEqual(r, g);
  assert.notEqual(r, g);
});
test('validation and work cap', () => {
  assert.throws(() => api.solveSudoku(Array(80).fill(0)));
  assert.throws(() => api.solveSudoku(Array(81).fill(1)));
  assert.throws(() => api.solveSudoku(Array(81).fill(0), 1));
});
test('candidate set oracle', () => {
  const g = Array(81).fill(0);
  g[0] = 1;
  g[10] = 2;
  g[18] = 3;
  const c = api.sudokuCandidates(g, 1);
  assert.deepEqual(c, [4, 5, 6, 7, 8, 9]);
});
