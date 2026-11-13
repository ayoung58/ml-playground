export type WalkStep = {
  nodeId: number;
  question: string;
  answer: boolean | null;
  label?: string;
};

/**
 * Node ids of the tiny decision tree:
 *
 *            0: x < 50?
 *         yes /      \ no
 *   1: x is even?    2: x < 80?
 *     yes/  \no       yes/  \no
 *     3      4         5     6
 *  small   small    medium  large
 *   even    odd
 */
const NODE = {
  root: 0,
  isEven: 1,
  lessThan80: 2,
  smallEven: 3,
  smallOdd: 4,
  medium: 5,
  large: 6,
} as const;

/**
 * Walk x down the tree and record every step. The trace always has exactly
 * 3 steps: root question, second question, then a leaf step whose answer is
 * null and whose label is the prediction. "Even" means x mod 2 = 0, so any
 * non-integer counts as odd.
 */
export function walkNumber(x: number): { label: string; trace: WalkStep[] } {
  const trace: WalkStep[] = [];

  const small = x < 50;
  trace.push({ nodeId: NODE.root, question: 'x < 50?', answer: small });

  let label: string;
  let leafId: number;
  if (small) {
    const even = x % 2 === 0;
    trace.push({ nodeId: NODE.isEven, question: 'x is even?', answer: even });
    label = even ? 'small even' : 'small odd';
    leafId = even ? NODE.smallEven : NODE.smallOdd;
  } else {
    const medium = x < 80;
    trace.push({ nodeId: NODE.lessThan80, question: 'x < 80?', answer: medium });
    label = medium ? 'medium' : 'large';
    leafId = medium ? NODE.medium : NODE.large;
  }

  trace.push({ nodeId: leafId, question: 'Prediction', answer: null, label });
  return { label, trace };
}
