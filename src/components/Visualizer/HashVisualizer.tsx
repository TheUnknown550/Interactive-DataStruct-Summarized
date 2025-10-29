import { useMemo, useState } from 'react';

type Entry = { key: string; value: string };

function hash(str: string, buckets: number) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % buckets;
}

export default function HashVisualizer() {
  const [buckets, setBuckets] = useState<number>(8);
  const [table, setTable] = useState<Entry[][]>(Array.from({ length: 8 }, () => []));
  const [k, setK] = useState('');
  const [v, setV] = useState('');
  const [last, setLast] = useState<{ b: number; i: number } | null>(null);
  const [bInput, setBInput] = useState('8');

  const bIndex = useMemo(() => (k ? hash(k, buckets) : null), [k, buckets]);

  const put = () => {
    if (!k) return;
    const b = hash(k, buckets);
    const t = table.map((b) => b.slice());
    const idx = t[b].findIndex(e => e.key === k);
    if (idx >= 0) t[b][idx].value = v; else t[b].push({ key: k, value: v });
    setTable(t);
    setLast({ b, i: idx >= 0 ? idx : t[b].length - 1 });
    setV('');
  };

  const get = () => {
    if (!k) return;
    const b = hash(k, buckets);
    const idx = table[b].findIndex(e => e.key === k);
    setLast(idx >= 0 ? { b, i: idx } : null);
  };

  const del = () => {
    if (!k) return;
    const b = hash(k, buckets);
    const t = table.map((b) => b.slice());
    const idx = t[b].findIndex(e => e.key === k);
    if (idx >= 0) t[b].splice(idx, 1);
    setTable(t);
    setLast(null);
  };

  const summary = useMemo(() => (last ? `bucket=${last.b}, index=${last.i}` : 'not found'), [last]);

  const applyBuckets = () => {
    const n = Number(bInput);
    if (!Number.isInteger(n) || n < 1 || n > 32) {
      alert('Size must be an integer in 1..32');
      return;
    }
    // Rehash all entries
    const entries: Entry[] = table.flat();
    const next: Entry[][] = Array.from({ length: n }, () => []);
    for (const e of entries) {
      const b = hash(e.key, n);
      next[b].push({ key: e.key, value: e.value });
    }
    setBuckets(n);
    setTable(next);
    setLast(null);
  };

  // SVG layout: vertical array of buckets with chains to the right
  const bucketGapY = 60;
  const nodeWidth = 120;
  const nodeHeight = 34;
  const paddingLeft = 120; // space for bucket index column
  const paddingRight = 40;
  const paddingTop = 20;
  const chainGapX = 30;

  const longestChain = Math.max(1, ...table.map(b => b.length));
  const innerWidth = paddingLeft + (nodeWidth + chainGapX) * longestChain + paddingRight;
  const height = paddingTop * 2 + bucketGapY * buckets;

  // Precompute edge segments so we can render lines on top (not hidden)
  const edgeSegments: { x1: number; y1: number; x2: number; y2: number }[] = [];
  table.forEach((bucket, bi) => {
    const y = paddingTop + bi * bucketGapY + nodeHeight / 2;
    const headRight = paddingLeft - chainGapX; // right edge of bucket cell
    if (bucket.length > 0) {
      const firstLeft = paddingLeft + 0 * (nodeWidth + chainGapX);
      edgeSegments.push({ x1: headRight, y1: y, x2: firstLeft - 8, y2: y });
    }
    for (let i = 0; i < bucket.length - 1; i++) {
      const left1 = paddingLeft + i * (nodeWidth + chainGapX);
      const left2 = paddingLeft + (i + 1) * (nodeWidth + chainGapX);
      edgeSegments.push({ x1: left1 + nodeWidth, y1: y, x2: left2 - 8, y2: y });
    }
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <input className="border rounded px-2 py-1 w-32 bg-white dark:bg-gray-900" placeholder="key" value={k} onChange={e => setK(e.target.value)} />
        <input className="border rounded px-2 py-1 w-40 bg-white dark:bg-gray-900" placeholder="value" value={v} onChange={e => setV(e.target.value)} />
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={put}>Put</button>
        <button className="px-3 py-1 rounded bg-amber-600 text-white" onClick={get}>Get</button>
        <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={del}>Delete</button>
        <button className="px-3 py-1 rounded bg-gray-600 text-white" onClick={() => { setTable(Array.from({ length: buckets }, () => [])); setLast(null); }}>Clear</button>
        <span className="text-xs text-gray-500">{summary}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <span>{k ? `hash("${k}") % ${buckets} = ${bIndex}` : 'Enter a key to see hashed bucket'}</span>
        <span className="ml-3">Size</span>
        <input className="border rounded px-2 py-1 w-20 bg-white dark:bg-gray-900" value={bInput} onChange={e => setBInput(e.target.value)} />
        <button className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700" onClick={applyBuckets}>Apply</button>
      </div>
      <div className="overflow-auto border rounded bg-gray-50 dark:bg-gray-900">
        <svg width="100%" height={height} viewBox={`0 0 ${innerWidth} ${height}`} preserveAspectRatio="xMinYMin meet" className="text-gray-700 dark:text-gray-300">
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L6,3 z" fill="currentColor" />
            </marker>
          </defs>
          {table.map((bucket, bi) => {
            const y = paddingTop + bi * bucketGapY;
            const isHighlightedBucket = last && last.b === bi;
            // Draw bucket index cell
            const bucketX = 16;
            return (
              <g key={bi}>
                <text x={bucketX} y={y + nodeHeight / 2} textAnchor="start" dominantBaseline="central" fontSize={12} className="fill-current">[{bi}]</text>
                {/* Head cell */}
                <rect x={paddingLeft - nodeWidth - chainGapX} y={y} width={nodeWidth} height={nodeHeight} rx={6} fill="#fff" stroke={isHighlightedBucket ? '#16A34A' : 'currentColor'} strokeWidth={2} />
                <text x={paddingLeft - nodeWidth - chainGapX + 8} y={y + nodeHeight / 2} textAnchor="start" dominantBaseline="central" fontSize={12}>bucket</text>
                {/* Chain nodes */}
                {bucket.map((e, i) => {
                  const x = paddingLeft + i * (nodeWidth + chainGapX);
                  const isHighlightedNode = last && last.b === bi && last.i === i;
                  return (
                    <g key={i}>
                      <rect x={x} y={y} width={nodeWidth} height={nodeHeight} rx={6} fill="#fff" stroke={isHighlightedNode ? '#16A34A' : 'currentColor'} strokeWidth={2} />
                      <text x={x + 8} y={y + nodeHeight / 2} textAnchor="start" dominantBaseline="central" fontSize={12}>
                        <tspan className="font-mono">{e.key}</tspan>: {e.value}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
          {/* Render edges on top so they are not hidden under nodes */}
          {edgeSegments.map((e, i) => (
            <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="currentColor" strokeWidth={2} markerEnd="url(#arrow)" />
          ))}
        </svg>
      </div>
    </div>
  );
}
