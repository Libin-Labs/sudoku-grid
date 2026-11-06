function finite(value: number, min = -Number.MAX_VALUE, max = Number.MAX_VALUE): number {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new TypeError('Expected finite number');
  if (value < min || value > max) throw new RangeError('Number outside supported bounds');
  return value;
}
function integer(value: number, min = 0, max = 1000000): number {
  if (!Number.isSafeInteger(value)) throw new RangeError('Expected safe integer');
  return finite(value, min, max);
}
function check(grid: readonly number[]): void {
  if (!Array.isArray(grid) || grid.length !== 81) throw new RangeError('81 cells required');
  for (const c of grid) integer(c, 0, 9);
}
function peers(a: number, b: number): boolean {
  return (
    Math.floor(a / 9) === Math.floor(b / 9) ||
    a % 9 === b % 9 ||
    (Math.floor(a / 27) === Math.floor(b / 27) &&
      Math.floor((a % 9) / 3) === Math.floor((b % 9) / 3))
  );
}
export function sudokuConflicts(grid: readonly number[]): number[] {
  check(grid);
  const bad = new Set<number>();
  for (let i = 0; i < 81; i++)
    if (grid[i])
      for (let j = i + 1; j < 81; j++)
        if (grid[i] === grid[j] && peers(i, j)) {
          bad.add(i);
          bad.add(j);
        }
  return [...bad].sort((a, b) => a - b);
}
function candidates(grid: readonly number[], index: number): number[] {
  if (grid[index] !== 0) return [];
  const used = new Set<number>();
  for (let i = 0; i < 81; i++) if (peers(i, index)) used.add(grid[i]!);
  return Array.from({ length: 9 }, (_, i) => i + 1).filter((n) => !used.has(n));
}
export function sudokuCandidates(grid: readonly number[], index: number): number[] {
  integer(index, 0, 80);
  if (sudokuConflicts(grid).length) throw new RangeError('Conflicting clues');
  return candidates(grid, index);
}
export function solveSudoku(grid: readonly number[], maxNodes = 100000): number[] | null {
  if (sudokuConflicts(grid).length) throw new RangeError('Conflicting clues');
  integer(maxNodes, 1, 1e6);
  const board = [...grid];
  let nodes = 0;
  function search(): boolean {
    if (++nodes > maxNodes) throw new RangeError('Sudoku work budget');
    let index = -1,
      options: number[] = [];
    for (let i = 0; i < 81; i++)
      if (board[i] === 0) {
        const c = candidates(board, i);
        if (!c.length) return false;
        if (index < 0 || c.length < options.length) {
          index = i;
          options = c;
          if (c.length === 1) break;
        }
      }
    if (index < 0) return true;
    for (const n of options) {
      board[index] = n;
      if (search()) return true;
    }
    board[index] = 0;
    return false;
  }
  return search() ? board : null;
}
