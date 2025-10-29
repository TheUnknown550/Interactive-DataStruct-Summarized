import { useState } from 'react';

export default function QueueVisualizer() {
  const [q, setQ] = useState<string[]>([]);
  const [val, setVal] = useState('');

  const enqueue = () => { if (!val) return; setQ(a => [...a, val]); setVal(''); };
  const dequeue = () => { if (!q.length) return; setQ(a => a.slice(1)); };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <input className="border rounded px-2 py-1 w-40 bg-white dark:bg-gray-900" placeholder="value" value={val} onChange={e => setVal(e.target.value)} />
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={enqueue}>Enqueue</button>
        <button className="px-3 py-1 rounded bg-amber-600 text-white" onClick={dequeue} disabled={!q.length}>Dequeue</button>
        <button className="px-3 py-1 rounded bg-gray-600 text-white" onClick={() => setQ([])} disabled={!q.length}>Clear</button>
      </div>
      <div className="overflow-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">front</span>
          {q.map((v, i) => (
            <div key={i} className="w-20 h-12 border rounded flex items-center justify-center bg-white dark:bg-gray-900">{v}</div>
          ))}
          {q.length === 0 && <div className="text-sm text-gray-500">(empty queue)</div>}
          <span className="text-xs text-gray-500">rear</span>
        </div>
      </div>
    </div>
  );
}

