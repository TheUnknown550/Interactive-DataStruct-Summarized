import { useMemo, useState } from 'react';

type Entry = { key: string; value: string };

function hash(str: string, buckets: number) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % buckets;
}

export default function HashVisualizer() {
  const BUCKETS = 8;
  const [table, setTable] = useState<Entry[][]>(Array.from({ length: BUCKETS }, () => []));
  const [k, setK] = useState('');
  const [v, setV] = useState('');
  const [last, setLast] = useState<{ b: number; i: number } | null>(null);

  const put = () => {
    if (!k) return;
    const b = hash(k, BUCKETS);
    const t = table.map((b) => b.slice());
    const idx = t[b].findIndex(e => e.key === k);
    if (idx >= 0) t[b][idx].value = v; else t[b].push({ key: k, value: v });
    setTable(t);
    setLast({ b, i: idx >= 0 ? idx : t[b].length - 1 });
    setV('');
  };

  const get = () => {
    if (!k) return;
    const b = hash(k, BUCKETS);
    const idx = table[b].findIndex(e => e.key === k);
    setLast(idx >= 0 ? { b, i: idx } : null);
  };

  const del = () => {
    if (!k) return;
    const b = hash(k, BUCKETS);
    const t = table.map((b) => b.slice());
    const idx = t[b].findIndex(e => e.key === k);
    if (idx >= 0) t[b].splice(idx, 1);
    setTable(t);
    setLast(null);
  };

  const summary = useMemo(() => (last ? `bucket=${last.b}, index=${last.i}` : 'not found'), [last]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <input className="border rounded px-2 py-1 w-32 bg-white dark:bg-gray-900" placeholder="key" value={k} onChange={e => setK(e.target.value)} />
        <input className="border rounded px-2 py-1 w-40 bg-white dark:bg-gray-900" placeholder="value" value={v} onChange={e => setV(e.target.value)} />
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={put}>Put</button>
        <button className="px-3 py-1 rounded bg-amber-600 text-white" onClick={get}>Get</button>
        <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={del}>Delete</button>
        <button className="px-3 py-1 rounded bg-gray-600 text-white" onClick={() => { setTable(Array.from({ length: BUCKETS }, () => [])); setLast(null); }}>Clear</button>
        <span className="text-xs text-gray-500">{summary}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {table.map((bucket, bi) => (
          <div key={bi} className="rounded border border-gray-200 dark:border-gray-800 p-2 bg-white dark:bg-gray-950">
            <div className="text-xs font-semibold text-gray-500 mb-1">Bucket {bi}</div>
            <div className="space-y-1">
              {bucket.length === 0 && <div className="text-xs text-gray-500">(empty)</div>}
              {bucket.map((e, i) => (
                <div key={i} className={`text-sm px-2 py-1 rounded border ${last && last.b === bi && last.i === i ? 'border-green-600 bg-green-50/50 dark:bg-green-950/30' : 'border-gray-200 dark:border-gray-800'}`}>
                  <span className="font-mono">{e.key}</span>: {e.value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

