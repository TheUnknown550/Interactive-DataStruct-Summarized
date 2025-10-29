import { useMemo, useState } from 'react';

function heapifyUp(a: number[], i: number) {
  while (i > 0) {
    const p = Math.floor((i - 1) / 2);
    if (a[p] <= a[i]) break;
    [a[p], a[i]] = [a[i], a[p]];
    i = p;
  }
}

function heapifyDown(a: number[], i: number) {
  const n = a.length;
  while (true) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    let smallest = i;
    if (l < n && a[l] < a[smallest]) smallest = l;
    if (r < n && a[r] < a[smallest]) smallest = r;
    if (smallest === i) break;
    [a[i], a[smallest]] = [a[smallest], a[i]];
    i = smallest;
  }
}

export default function HeapVisualizer() {
  const [heap, setHeap] = useState<number[]>([]);
  const [val, setVal] = useState('');

  const insert = () => {
    const n = Number(val);
    if (!Number.isFinite(n)) return;
    const a = heap.slice();
    a.push(n);
    heapifyUp(a, a.length - 1);
    setHeap(a);
    setVal('');
  };

  const extract = () => {
    if (heap.length === 0) return;
    const a = heap.slice();
    const last = a.pop()!;
    if (a.length) {
      a[0] = last;
      heapifyDown(a, 0);
    }
    setHeap(a);
  };

  const levels = useMemo(() => {
    const res: number[][] = [];
    let i = 0;
    let level = 0;
    while (i < heap.length) {
      const count = 1 << level;
      res.push(heap.slice(i, i + count));
      i += count;
      level++;
    }
    return res;
  }, [heap]);

  const width = Math.max(360, Math.pow(2, Math.max(1, levels.length)) * 40);
  const height = Math.max(220, levels.length * 80 + 40);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <input className="border rounded px-2 py-1 w-32 bg-white dark:bg-gray-900" placeholder="number" value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && insert()} />
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={insert}>Insert</button>
        <button className="px-3 py-1 rounded bg-amber-600 text-white" onClick={extract} disabled={!heap.length}>Extract Min</button>
        <button className="px-3 py-1 rounded bg-gray-600 text-white" onClick={() => setHeap([])} disabled={!heap.length}>Clear</button>
      </div>
      <div className="overflow-auto border rounded bg-gray-50 dark:bg-gray-900">
        <svg width={width} height={height} className="text-gray-700 dark:text-gray-300">
          {levels.map((arr, level) => (
            arr.map((v, idx) => {
              const total = 1 << level;
              const gap = width / (total + 1);
              const x = Math.round((idx + 1) * gap);
              const y = 40 + level * 80;
              const i = (1 << level) - 1 + idx;
              const p = Math.floor((i - 1) / 2);
              const hasParent = i > 0 && p < heap.length;
              const px = (() => {
                const pl = Math.floor(Math.log2(p + 1));
                const pIdx = p - ((1 << pl) - 1);
                const t = 1 << pl;
                const g = width / (t + 1);
                return Math.round((pIdx + 1) * g);
              })();
              const py = 40 + (level - 1) * 80;
              return (
                <g key={`${level}-${idx}`}>
                  {hasParent && <line x1={px} y1={py} x2={x} y2={y} stroke="currentColor" strokeWidth={2} />}
                  <circle cx={x} cy={y} r={18} fill="#fff" stroke="currentColor" strokeWidth={2} />
                  <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={12}>{v}</text>
                </g>
              );
            })
          ))}
        </svg>
      </div>
      <div>
        <div className="text-xs text-gray-500">Array: [{heap.join(', ')}]</div>
      </div>
    </div>
  );
}

