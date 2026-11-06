import { sudokuCandidates } from '@lp-labs/sudoku-grid';
if (sudokuCandidates(Array(81).fill(0), 0).length !== 9) throw new Error('Sudoku');
// @ts-expect-error invalid argument must be rejected by declarations
sudokuCandidates(['0'], 0);
