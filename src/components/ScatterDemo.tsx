import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { makeBlobs } from '../lib/data/blobs';

export type ScatterDemoProps = {
  nPerClass?: number;
  initialNoise?: number;
  initialSeed?: number;
  height?: number;
};

// Okabe-Ito colorblind-safe palette, indexed by class label.
const PALETTE = ['#0072B2', '#E69F00', '#009E73'];
const X_DOMAIN: [number, number] = [-6, 6];
const Y_DOMAIN: [number, number] = [-5, 6];
const POINT_RADIUS = 5;

export default function ScatterDemo({
  nPerClass = 50,
  initialNoise = 0.6,
  initialSeed = 42,
  height = 360,
}: ScatterDemoProps) {
  const [noise, setNoise] = useState(initialNoise);
  const [seed, setSeed] = useState(initialSeed);
  const [width, setWidth] = useState(0); // 0 until the container is measured (client only)
  const [themeVersion, setThemeVersion] = useState(0); // bumped when data-theme changes

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sliderId = useId();

  const points = useMemo(() => makeBlobs({ seed, noise, nPerClass }), [seed, noise, nPerClass]);

  // Track the container width so the canvas fills it.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Redraw when Starlight toggles light/dark via the data-theme attribute.
  useEffect(() => {
    const observer = new MutationObserver(() => setThemeVersion((v) => v + 1));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  // Draw. Theme colors are read from CSS variables at draw time.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI: back the canvas with dpr x more pixels, then scale the drawing context.
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const styles = getComputedStyle(document.documentElement);
    const bg = styles.getPropertyValue('--sl-color-bg').trim() || '#ffffff';
    const axisColor = styles.getPropertyValue('--sl-color-gray-3').trim() || '#888888';

    const xScale = scaleLinear().domain(X_DOMAIN).range([0, width]);
    const yScale = scaleLinear().domain(Y_DOMAIN).range([height, 0]); // flip: +y is up

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Faint axes at x = 0 and y = 0.
    ctx.save();
    ctx.strokeStyle = axisColor;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xScale(0), 0);
    ctx.lineTo(xScale(0), height);
    ctx.moveTo(0, yScale(0));
    ctx.lineTo(width, yScale(0));
    ctx.stroke();
    ctx.restore();

    for (const p of points) {
      ctx.fillStyle = PALETTE[p.label % PALETTE.length];
      ctx.beginPath();
      ctx.arc(xScale(p.x), yScale(p.y), POINT_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [points, width, height, themeVersion]);

  const reseed = () => setSeed(Math.floor(Math.random() * 2 ** 31));

  return (
    <div style={{ margin: '1rem 0' }}>
      <div ref={containerRef} style={{ width: '100%' }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Scatterplot of ${points.length} points in clusters`}
          style={{
            display: 'block',
            border: '1px solid var(--sl-color-gray-5)',
            borderRadius: '0.25rem',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '0.75rem',
          color: 'var(--sl-color-text)',
        }}
      >
        <label htmlFor={sliderId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Noise: {noise.toFixed(2)}
          <input
            id={sliderId}
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={noise}
            onChange={(e) => setNoise(Number(e.target.value))}
            style={{ accentColor: 'var(--sl-color-accent)' }}
          />
        </label>
        <button
          type="button"
          onClick={reseed}
          style={{
            padding: '0.25rem 0.75rem',
            border: '1px solid var(--sl-color-gray-4)',
            borderRadius: '0.25rem',
            background: 'var(--sl-color-gray-6)',
            color: 'var(--sl-color-text)',
            cursor: 'pointer',
          }}
        >
          Reseed
        </button>
      </div>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--sl-color-gray-3)' }}>
        seed: {seed}, points: {points.length}
      </p>
    </div>
  );
}
