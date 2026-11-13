import { describe, expect, it } from 'vitest';
import { walkNumber } from '../src/lib/ml/numberWalk';

describe('walkNumber', () => {
  it.each([
    [37, 'small odd'],
    [20, 'small even'],
    [60, 'medium'],
    [90, 'large'],
  ])('x = %i gives label "%s" with a 3-step trace', (x, expected) => {
    const { label, trace } = walkNumber(x);
    expect(label).toBe(expected);
    expect(trace).toHaveLength(3);
    const final = trace[2];
    expect(final.answer).toBeNull();
    expect(final.label).toBe(expected);
  });

  it('records the questions and answers along the path for x = 37', () => {
    const { trace } = walkNumber(37);
    expect(trace[0]).toMatchObject({ question: 'x < 50?', answer: true });
    expect(trace[1]).toMatchObject({ question: 'x is even?', answer: false });
  });

  it('always produces exactly 3 steps', () => {
    for (const x of [-10, -3, 0, 1, 49, 50, 79, 80, 81, 100, 1000, 2.5]) {
      expect(walkNumber(x).trace).toHaveLength(3);
    }
  });
});
