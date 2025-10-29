import { useState } from 'react';

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<string[]>([]);
  const [val, setVal] = useState('');

  const insertHead = () => { if (!val) return; setNodes(n => [val, ...n]); setVal(''); };
  const insertTail = () => { if (!val) return; setNodes(n => [...n, val]); setVal(''); };
  const deleteVal = () => { if (!val) return; setNodes(n => n.filter(x => x !== val)); setVal(''); };
  const clear = () => setNodes([]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <input className="border rounded px-2 py-1 w-40 bg-white dark:bg-gray-900" placeholder="value" value={val} onChange={e => setVal(e.target.value)} />
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={insertHead}>Insert Head</button>
        <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={insertTail}>Insert Tail</button>
        <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={deleteVal} disabled={!nodes.length}>Delete Value</button>
        <button className="px-3 py-1 rounded bg-gray-600 text-white" onClick={clear} disabled={!nodes.length}>Clear</button>
      </div>
      <div className="overflow-auto">
        <svg width={Math.max(360, nodes.length * 120)} height={120} className="text-gray-700 dark:text-gray-300">
          {nodes.map((v, i) => {
            const x = 40 + i * 110; const y = 60;
            const nextX = 40 + (i + 1) * 110;
            return (
              <g key={i}>
                {i < nodes.length - 1 && <line x1={x + 40} y1={y} x2={nextX - 40} y2={y} stroke="currentColor" strokeWidth={2} markerEnd="url(#arrow)" />}
                <rect x={x - 40} y={y - 20} width={80} height={40} rx={6} fill="#fff" stroke="currentColor" strokeWidth={2} />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={12}>{v}</text>
              </g>
            );
          })}
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L6,3 z" fill="currentColor" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
}

