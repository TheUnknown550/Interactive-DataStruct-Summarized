import { useMemo, useState } from 'react';

type Node = {
  id: number;
  label: string;
  children: Node[];
};

type PNode = Node & { x: number; y: number; parentId?: number };

function flatten(root: Node): Node[] {
  const out: Node[] = [];
  const walk = (n: Node) => {
    out.push(n);
    n.children.forEach(walk);
  };
  walk(root);
  return out;
}

function layout(root: Node): { nodes: PNode[]; edges: { from: number; to: number }[] } {
  const nodes: PNode[] = [];
  const edges: { from: number; to: number }[] = [];
  let x = 0;
  const walk = (n: Node, depth: number, parentId?: number) => {
    if (n.children.length === 0) {
      nodes.push({ ...n, x: x++ * 70 + 40, y: depth * 80 + 30, parentId });
      if (parentId) edges.push({ from: parentId, to: n.id });
      return { min: nodes[nodes.length - 1].x, max: nodes[nodes.length - 1].x };
    }
    let min = Infinity;
    let max = -Infinity;
    for (const c of n.children) {
      const span = walk(c, depth + 1, n.id);
      min = Math.min(min, span.min);
      max = Math.max(max, span.max);
    }
    const cx = Math.round((min + max) / 2);
    nodes.push({ ...n, x: isFinite(cx) ? cx : x++ * 70 + 40, y: depth * 80 + 30, parentId });
    if (parentId) edges.push({ from: parentId, to: n.id });
    return { min: Math.min(min, nodes[nodes.length - 1].x), max: Math.max(max, nodes[nodes.length - 1].x) };
  };
  walk(root, 0);
  return { nodes, edges };
}

export default function TreeVisualizer() {
  const [counter, setCounter] = useState(3);
  const [root, setRoot] = useState<Node>({ id: 1, label: 'root', children: [{ id: 2, label: 'A', children: [] }, { id: 3, label: 'B', children: [] }] });
  const [label, setLabel] = useState('C');
  const allNodes = useMemo(() => flatten(root), [root]);
  const [parentId, setParentId] = useState<number>(1);
  const [query, setQuery] = useState('');

  const { nodes, edges } = useMemo(() => layout(root), [root]);
  const width = Math.max(360, (nodes.length + 1) * 70);
  const height = Math.max(220, (Math.max(0, ...nodes.map(n => n.y)) + 60));
  const highlight = query.trim().toLowerCase();

  const addChild = () => {
    if (!label.trim()) return;
    const id = counter + 1;
    setCounter(id);
    const clone = (n: Node): Node => ({ id: n.id, label: n.label, children: n.children.map(clone) });
    const r = clone(root);
    const find = (n: Node): Node | undefined => (n.id === parentId ? n : n.children.map(find).find(Boolean));
    const p = find(r) || r;
    p.children.push({ id, label: label.trim(), children: [] });
    setRoot(r);
    setLabel('');
  };

  const removeLastChild = () => {
    const clone = (n: Node): Node => ({ id: n.id, label: n.label, children: n.children.map(clone) });
    const r = clone(root);
    const find = (n: Node): Node | undefined => (n.id === parentId ? n : n.children.map(find).find(Boolean));
    const p = find(r) || r;
    p.children.pop();
    setRoot(r);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <input className="border rounded px-2 py-1 w-32 bg-white dark:bg-gray-900" placeholder="label" value={label} onChange={e => setLabel(e.target.value)} />
        <select className="border rounded px-2 py-1 bg-white dark:bg-gray-900" value={parentId} onChange={e => setParentId(Number(e.target.value))}>
          {allNodes.map(n => (
            <option key={n.id} value={n.id}>parent: {n.label} (#{n.id})</option>
          ))}
        </select>
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={addChild}>Add Child</button>
        <button className="px-3 py-1 rounded bg-amber-600 text-white" onClick={removeLastChild}>Remove Last Child</button>
        <input className="border rounded px-2 py-1 w-32 bg-white dark:bg-gray-900 ml-auto" placeholder="search label" value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      <div className="overflow-auto border rounded bg-gray-50 dark:bg-gray-900">
        <svg width={width} height={height} className="text-gray-700 dark:text-gray-300">
          {edges.map((e, i) => {
            const from = nodes.find(n => n.id === e.from)!;
            const to = nodes.find(n => n.id === e.to)!;
            return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="currentColor" strokeWidth="2" />;
          })}
          {nodes.map(n => (
            <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
              <rect x={-20} y={-14} width={40} height={28} rx={6} fill={n.label.toLowerCase().includes(highlight) && highlight ? '#22C55E' : '#fff'} stroke="currentColor" strokeWidth="2" />
              <text textAnchor="middle" dominantBaseline="central" fontSize="12">{n.label}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

