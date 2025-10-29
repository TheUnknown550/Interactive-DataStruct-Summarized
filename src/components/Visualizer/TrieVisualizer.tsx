import { useMemo, useState } from 'react';

type TNode = {
  id: number;
  ch: string; // character from parent edge
  end: boolean; // end of word
  children: Map<string, TNode>;
};

let gid = 1;
function makeNode(ch: string): TNode {
  return { id: gid++, ch, end: false, children: new Map() };
}

function insert(root: TNode, word: string) {
  let cur = root;
  for (const c of word) {
    if (!cur.children.has(c)) cur.children.set(c, makeNode(c));
    cur = cur.children.get(c)!;
  }
  cur.end = true;
}

function findPath(root: TNode, query: string): TNode[] {
  const path: TNode[] = [root];
  let cur: TNode | undefined = root;
  for (const c of query) {
    cur = cur?.children.get(c);
    if (!cur) return [];
    path.push(cur);
  }
  return path;
}

type PNode = { id: number; label: string; x: number; y: number; end: boolean };

function layout(root: TNode): { nodes: PNode[]; edges: { from: number; to: number }[] } {
  const nodes: PNode[] = [];
  const edges: { from: number; to: number }[] = [];
  // arrange by depth and order of traversal
  const levels: TNode[][] = [];
  const queue: { n: TNode; d: number; p?: TNode }[] = [{ n: root, d: 0 }];
  while (queue.length) {
    const { n, d, p } = queue.shift()!;
    if (!levels[d]) levels[d] = [];
    levels[d].push(n);
    if (p) edges.push({ from: p.id, to: n.id });
    for (const child of n.children.values()) queue.push({ n: child, d: d + 1, p: n });
  }
  const width = Math.max(1, Math.max(...levels.map(l => l.length)));
  const gapX = 70;
  const gapY = 80;
  levels.forEach((lvl, d) => {
    const rowWidth = (lvl.length + 1) * gapX;
    lvl.forEach((n, i) => {
      nodes.push({ id: n.id, label: n.ch || '•', x: Math.round((i + 1) * (rowWidth / (lvl.length + 1))), y: 30 + d * gapY, end: n.end });
    });
  });
  // Normalize x positions to max width for a cleaner look
  const maxRowWidth = (width + 1) * gapX;
  nodes.forEach(nd => {
    const row = Math.round((nd.y - 30) / gapY);
    const lvl = levels[row] || [];
    const rowW = (lvl.length + 1) * gapX;
    const ratio = maxRowWidth / rowW;
    nd.x = Math.round(nd.x * ratio);
  });
  return { nodes, edges };
}

export default function TrieVisualizer() {
  const [root, setRoot] = useState<TNode>(() => makeNode(''));
  const [word, setWord] = useState('cat');
  const [query, setQuery] = useState('ca');

  const { nodes, edges } = useMemo(() => layout(root), [root]);
  const width = Math.max(360, (Math.max(1, ...nodes.map(n => n.x)) + 60));
  const height = Math.max(220, (Math.max(0, ...nodes.map(n => n.y)) + 60));

  const path = useMemo(() => findPath(root, query.trim()), [root, query]);
  const pathIds = new Set(path.map(n => n.id));

  const addWord = () => {
    const w = word.trim();
    if (!w) return;
    // clone minimal (rebuild structure arrays) for React state
    const clone = (n: TNode): TNode => {
      const c = makeNode(n.ch);
      c.id = n.id; // preserve id
      c.end = n.end;
      for (const [k, v] of n.children) c.children.set(k, clone(v));
      return c;
    };
    const r = clone(root);
    insert(r, w);
    setRoot(r);
    setWord('');
  };

  const clear = () => {
    gid = 1;
    setRoot(makeNode(''));
    setQuery('');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <input className="border rounded px-2 py-1 w-40 bg-white dark:bg-gray-900" placeholder="insert word" value={word} onChange={e => setWord(e.target.value)} onKeyDown={e => e.key === 'Enter' && addWord()} />
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={addWord}>Insert</button>
        <input className="border rounded px-2 py-1 w-40 bg-white dark:bg-gray-900" placeholder="search/prefix" value={query} onChange={e => setQuery(e.target.value)} />
        <button className="px-3 py-1 rounded bg-gray-600 text-white" onClick={clear}>Clear</button>
      </div>
      <div className="overflow-auto border rounded bg-gray-50 dark:bg-gray-900">
        <svg width={width} height={height} className="text-gray-700 dark:text-gray-300">
          {edges.map((e, i) => {
            const from = nodes.find(n => n.id === e.from)!;
            const to = nodes.find(n => n.id === e.to)!;
            return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="currentColor" strokeWidth={2} />;
          })}
          {nodes.map(n => (
            <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
              <circle r={16} fill={pathIds.has(n.id) ? '#22C55E' : '#fff'} stroke="currentColor" strokeWidth={2} />
              <text textAnchor="middle" dominantBaseline="central" fontSize={12}>{n.label}</text>
              {n.end && <circle r={20} fill="none" stroke="#3B82F6" strokeWidth={1} />}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

