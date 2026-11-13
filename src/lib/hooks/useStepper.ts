import { useCallback, useEffect, useState } from 'react';

export type Stepper = {
  i: number;
  playing: boolean;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  seek: (index: number) => void;
};

/**
 * Step index with auto-play. `i` is always within [0, length - 1].
 * Playback advances one step every `msPerStep` ms and stops by itself on the
 * last step. If `length` changes, the stepper resets to step 0 and stops.
 */
export function useStepper(length: number, msPerStep = 900): Stepper {
  const last = Math.max(0, length - 1);
  const [rawIndex, setRawIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Clamp on read so a stale index is never exposed for a render after
  // `length` shrinks (the reset effect below runs after that render).
  const i = Math.min(Math.max(rawIndex, 0), last);

  useEffect(() => {
    setRawIndex(0);
    setPlaying(false);
  }, [length]);

  // One timeout per step; cleanup clears it on pause, step change, or unmount.
  useEffect(() => {
    if (!playing) return;
    if (i >= last) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setRawIndex(i + 1), msPerStep);
    return () => clearTimeout(id);
  }, [playing, i, last, msPerStep]);

  const play = useCallback(() => {
    if (i >= last) setRawIndex(0); // replay from the start
    setPlaying(true);
  }, [i, last]);
  const pause = useCallback(() => setPlaying(false), []);
  const next = useCallback(() => setRawIndex(Math.min(i + 1, last)), [i, last]);
  const prev = useCallback(() => setRawIndex(Math.max(i - 1, 0)), [i]);
  const reset = useCallback(() => {
    setRawIndex(0);
    setPlaying(false);
  }, []);
  const seek = useCallback(
    (index: number) => setRawIndex(Math.min(Math.max(Math.trunc(index), 0), last)),
    [last],
  );

  return { i, playing, play, pause, next, prev, reset, seek };
}
