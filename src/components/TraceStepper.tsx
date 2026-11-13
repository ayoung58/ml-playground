import { useId, useMemo, useState } from 'react';
import { walkNumber } from '../lib/ml/numberWalk';
import { useStepper } from '../lib/hooks/useStepper';

const CSS = `
.trace-stepper .ts-row { display: flex; gap: 0.75rem; flex-wrap: wrap; margin: 1rem 0; }
.trace-stepper .ts-box {
  flex: 1 1 8rem;
  min-height: 5.5rem;
  padding: 0.75rem;
  border: 2px solid var(--sl-color-gray-5);
  border-radius: 0.5rem;
  background: var(--sl-color-bg);
  color: var(--sl-color-text);
  transition: opacity 300ms ease, border-color 300ms ease, background-color 300ms ease;
}
.trace-stepper .ts-box.is-future { opacity: 0.4; }
.trace-stepper .ts-box.is-past { border-color: var(--sl-color-gray-3); background: var(--sl-color-gray-6); }
.trace-stepper .ts-box.is-current {
  border-color: var(--sl-color-accent);
  background: var(--sl-color-accent-low);
}
.trace-stepper .ts-badge {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.1rem 0.6rem;
  border: 1px solid var(--sl-color-gray-3);
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}
.trace-stepper .ts-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
.trace-stepper button {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--sl-color-gray-4);
  border-radius: 0.25rem;
  background: var(--sl-color-gray-6);
  color: var(--sl-color-text);
  cursor: pointer;
}
.trace-stepper button:disabled { opacity: 0.4; cursor: not-allowed; }
.trace-stepper .ts-input { width: 6rem; margin-left: 0.5rem; }
@media (prefers-reduced-motion: reduce) {
  .trace-stepper .ts-box { transition: none; }
}
`;

export default function TraceStepper() {
  const [raw, setRaw] = useState('37');
  const [x, setX] = useState(37);
  const inputId = useId();

  const { label, trace } = useMemo(() => walkNumber(x), [x]);
  const stepper = useStepper(trace.length);
  const { i, playing } = stepper;
  const last = trace.length - 1;

  const parsed = Number(raw);
  const valid = raw.trim() !== '' && Number.isInteger(parsed);

  const onInput = (value: string) => {
    setRaw(value);
    const n = Number(value);
    if (value.trim() !== '' && Number.isInteger(n)) {
      setX(n);
      stepper.reset();
    }
  };

  return (
    <div className="trace-stepper" style={{ margin: '1rem 0' }}>
      <style>{CSS}</style>

      <label htmlFor={inputId} style={{ color: 'var(--sl-color-text)' }}>
        Number x
        <input
          id={inputId}
          className="ts-input"
          type="number"
          step={1}
          value={raw}
          onChange={(e) => onInput(e.target.value)}
          aria-invalid={!valid}
          style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid var(--sl-color-gray-4)',
            borderRadius: '0.25rem',
            background: 'var(--sl-color-bg)',
            color: 'var(--sl-color-text)',
          }}
        />
      </label>
      {!valid && (
        <span style={{ marginLeft: '0.75rem', color: 'var(--sl-color-gray-3)', fontSize: '0.85rem' }}>
          Enter an integer (showing x = {x}).
        </span>
      )}

      <ol className="ts-row" style={{ listStyle: 'none', padding: 0 }}>
        {trace.map((step, idx) => {
          const status = idx < i ? 'is-past' : idx === i ? 'is-current' : 'is-future';
          const isLeaf = idx === last;
          return (
            <li
              key={step.nodeId}
              className={`ts-box ${status}`}
              aria-current={idx === i ? 'step' : undefined}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--sl-color-gray-2)' }}>
                {isLeaf ? 'Result' : `Question ${idx + 1}`}
              </div>
              {isLeaf ? (
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>
                  {idx <= i ? (step.label ?? label) : '?'}
                </div>
              ) : (
                <>
                  <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{step.question}</div>
                  {idx < i && <span className="ts-badge">{step.answer ? 'Yes' : 'No'}</span>}
                </>
              )}
            </li>
          );
        })}
      </ol>

      <div className="ts-controls">
        <button type="button" onClick={stepper.play} disabled={playing}>
          Play
        </button>
        <button type="button" onClick={stepper.pause} disabled={!playing}>
          Pause
        </button>
        <button type="button" onClick={stepper.prev} disabled={i === 0}>
          Back
        </button>
        <button type="button" onClick={stepper.next} disabled={i === last}>
          Next
        </button>
        <button type="button" onClick={stepper.reset} disabled={i === 0 && !playing}>
          Reset
        </button>
        <span aria-live="polite" style={{ marginLeft: '0.5rem', color: 'var(--sl-color-gray-2)' }}>
          Step {i + 1} of {trace.length}
        </span>
      </div>
    </div>
  );
}
