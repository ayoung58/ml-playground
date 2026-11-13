/**
 * Seeded pseudo-random number generator (mulberry32).
 * Returns a function that yields floats in [0, 1). The same seed always
 * produces the same sequence, so datasets and algorithm traces are reproducible.
 */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0; // coerce to an unsigned 32-bit integer
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; // divide by 2^32
  };
}

/**
 * Standard normal sample, N(0, 1), via the Box-Muller transform.
 *
 * Given independent U_1, U_2 ~ Uniform(0, 1):
 *
 *   \[ Z = \sqrt{-2 \ln U_1} \, \cos(2 \pi U_2) \]
 *
 * Why it works: (U_1, U_2) -> (R, \Theta) with R = \sqrt{-2 \ln U_1} and
 * \Theta = 2 \pi U_2 gives a point in polar coordinates whose radius has
 * density r e^{-r^2/2} (the Rayleigh law) and whose angle is uniform. Converting
 * back, X = R \cos\Theta and Y = R \sin\Theta are two independent N(0, 1)
 * variables, because the joint density factorises as
 * \( \frac{1}{2\pi} e^{-(x^2 + y^2)/2} \). We use only the cosine (X) output and
 * discard the sine partner, which keeps the function stateless.
 *
 * Guard: \ln(0) = -\infty, and rng() can return exactly 0, so U_1 is redrawn
 * until it is strictly positive.
 */
export function gaussian(rng: () => number): number {
  let u1 = rng();
  while (u1 === 0) {
    u1 = rng();
  }
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
