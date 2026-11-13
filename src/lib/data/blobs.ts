import { gaussian, mulberry32 } from './rng';

export type Point = { x: number; y: number; label: number };

const DEFAULT_CENTERS: [number, number][] = [
  [-2, -1],
  [2, -1],
  [0, 2.5],
];

/**
 * Generate Gaussian blobs, one per center.
 *
 * Each point is \( (x, y) = (c_x, c_y) + \sigma \, (z_1, z_2) \) with
 * \( z_1, z_2 \sim N(0, 1) \) independent, so `noise` is the standard
 * deviation \( \sigma \) of each coordinate. `label` is the center's index.
 * Output is deterministic for the same options.
 */
export function makeBlobs(opts: {
  seed: number;
  nPerClass?: number;
  noise?: number;
  centers?: [number, number][];
}): Point[] {
  const nPerClass = opts.nPerClass ?? 50;
  const noise = opts.noise ?? 0.6;
  const centers = opts.centers ?? DEFAULT_CENTERS;
  const rng = mulberry32(opts.seed);

  const points: Point[] = [];
  centers.forEach(([cx, cy], label) => {
    for (let i = 0; i < nPerClass; i++) {
      const x = cx + noise * gaussian(rng);
      const y = cy + noise * gaussian(rng);
      points.push({ x, y, label });
    }
  });
  return points;
}
