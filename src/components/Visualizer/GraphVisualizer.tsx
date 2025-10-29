import { useMemo, useState } from 'react';

type Edge = { u: string; v: string };

export default function GraphVisualizer() {
  const [V, setV] = useState<string[]>(['A', 'B', 'C']);
  const [E, setE] = useState<Edge[]>([{ u: 'A', v: 'B' }, { u: 'A', v: 'C' }]);
  const [nv, setNv] = useState('D');
  const [u, setU] = useState('A');
  const [v, setVtx] = useState('B');

  const addVertex = () => {
    const s = nv.trim();
    if (!s || V.includes(s)) return;
    setV([...V, s]);
    setNv('');
  };
  const addEdge = () => {
    if (!u || !v || u === v) return;
    if (!V.includes(u) || !V.includes(v)) return;
    if (E.some(e => (e.u === u && e.v === v) || (e.u === v && e.v === u))) return;
    setE([...E, { u, v }]);
  };
  const clear = () => { setE([]); };

  const layout = useMemo(() => {
    const n = V.length;
    const R = Math.max(80, n * 18);
    const center = { x: R + 40, y: R + 40 };
    const nodes = V.map((name, i) => {
      const angle = (2 * Math.PI * i) / n;
      return { name, x: Math.round(center.x + R * Math.cos(angle)), y: Math.round(center.y + R * Math.sin(angle)) };
    });
    const idx = new Map(nodes.map((nd, i) => [nd.name, i] as const));
    const edges = E.map(e => ({ from: nodes[idx.get(e.u)!], to: nodes[idx.get(e.v)!] }));
    return { nodes, edges, width: center.x * 2, height: center.y * 2 };
  }, [V, E]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <input className="border rounded px-2 py-1 w-28 bg-white dark:bg-gray-900" placeholder="new vertex" value={nv} onChange={e => setNv(e.target.value)} />
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={addVertex}>Add Vertex</button>
        <select className="border rounded px-2 py-1 bg-white dark:bg-gray-900" value={u} onChange={e => setU(e.target.value)}>
          {V.map(x => <option key={x}>{x}</option>)}
        </select>
        <select className="border rounded px-2 py-1 bg-white dark:bg-gray-900" value={v} onChange={e => setVtx(e.target.value)}>
          {V.map(x => <option key={x}>{x}</option>)}
        </select>
        <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={addEdge}>Add Edge</button>
        <button className="px-3 py-1 rounded bg-gray-600 text-white" onClick={clear} disabled={!E.length}>Clear Edges</button>
      </div>
      <div className="overflow-auto border rounded bg-gray-50 dark:bg-gray-900">
        <svg width={layout.width} height={layout.height} className="text-gray-700 dark:text-gray-300">
          {layout.edges.map((e, i) => (
            <g key={i}>
              <line x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} stroke="currentColor" strokeWidth={2} />
            </g>
          ))}
          {layout.nodes.map(n => (
            <g key={n.name} transform={`translate(${n.x}, ${n.y})`}>
              <circle r={16} fill="#fff" stroke="currentColor" strokeWidth={2} />
              <text textAnchor="middle" dominantBaseline="central" fontSize={12}>{n.name}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

