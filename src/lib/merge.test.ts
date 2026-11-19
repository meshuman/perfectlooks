import { describe, expect, it } from 'vitest';
import { canMove, emptyBoard, move, newGame, spawn } from './merge';

const board = (rows: number[][]) => rows.flat();

describe('merge puzzle', () => {
  it('slides tiles to the edge', () => {
    const b = board([[0, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
    expect(move(b, 'left').board.slice(0, 4)).toEqual([1, 0, 0, 0]);
  });

  it('merges two equal tiles into the next tier and scores it', () => {
    const b = board([[1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
    const result = move(b, 'left');
    expect(result.board.slice(0, 4)).toEqual([2, 0, 0, 0]);
    expect(result.gained).toBe(4);
  });

  it('merges a tile only once per move', () => {
    const b = board([[1, 1, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
    expect(move(b, 'left').board.slice(0, 4)).toEqual([2, 2, 0, 0]);
  });

  it('works in every direction', () => {
    const b = board([[1, 0, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
    expect(move(b, 'down').board[12]).toBe(2);
    expect(move(b, 'up').board[0]).toBe(2);
    expect(move(board([[0, 0, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'right').board[3]).toBe(2);
  });

  it('reports a move that changes nothing', () => {
    const b = board([[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
    expect(move(b, 'left').moved).toBe(false);
  });

  it('adds one tile in an empty cell and starts with two', () => {
    expect(newGame().filter(Boolean)).toHaveLength(2);
    expect(spawn(emptyBoard()).filter(Boolean)).toHaveLength(1);
  });

  it('knows when no move is left', () => {
    const stuck = board([[1, 2, 1, 2], [2, 1, 2, 1], [1, 2, 1, 2], [2, 1, 2, 1]]);
    expect(canMove(stuck)).toBe(false);
    expect(canMove(board([[1, 1, 1, 2], [2, 1, 2, 1], [1, 2, 1, 2], [2, 1, 2, 1]]))).toBe(true);
  });
});
