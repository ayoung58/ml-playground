import { describe, expect, it } from 'vitest';
import { makeBlobs } from '../src/lib/data/blobs';

const CENTERS: [number, number][] = [
  [-2, -1],
  [2, -1],
  [0, 2.5],
];

describe('makeBlobs', () => {
  it('is deterministic for the same seed and options', () => {
    const opts = { seed: 42, nPerClass: 30, noise: 0.5 };
    expect(makeBlobs(opts)).toEqual(makeBlobs(opts));
  });

  it('produces different output for different seeds', () => {
    expect(makeBlobs({ seed: 1 })).not.toEqual(makeBlobs({ seed: 2 }));
  });

  it('returns nPerClass * number of centers points', () => {
    expect(makeBlobs({ seed: 7 })).toHaveLength(50 * 3);
    expect(makeBlobs({ seed: 7, nPerClass: 12, centers: [[0, 0], [1, 1]] })).toHaveLength(24);
  });

  it('places every point exactly on its center when noise is 0', () => {
    const points = makeBlobs({ seed: 3, noise: 0 });
    for (const p of points) {
      const [cx, cy] = CENTERS[p.label];
      expect(p.x).toBe(cx);
      expect(p.y).toBe(cy);
    }
  });

  it('has class sample means within 0.1 of the centers for large n', () => {
    const points = makeBlobs({ seed: 123, nPerClass: 5000, noise: 0.6 });
    CENTERS.forEach(([cx, cy], label) => {
      const cls = points.filter((p) => p.label === label);
      const mx = cls.reduce((s, p) => s + p.x, 0) / cls.length;
      const my = cls.reduce((s, p) => s + p.y, 0) / cls.length;
      expect(Math.abs(mx - cx)).toBeLessThan(0.1);
      expect(Math.abs(my - cy)).toBeLessThan(0.1);
    });
  });
});
