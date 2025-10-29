import { useMemo, useState } from 'react';

type Node = {
  key: number;
  left?: Node;
  right?: Node;
  h: number; // height
};

const height = (n?: Node) => (n ? n.h : 0);
const update = (n: Node) => {
  n.h = Math.max(height(n.left), height(n.right)) + 1;
  return n;
};

function rotateRight(y: Node): Node {
  const x = y.left!;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  update(y);
  return update(x);
}

function rotateLeft(x: Node): Node {
  const y = x.right!;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  update(x);
  return update(y);
}

function balance(n: Node): Node {
  update(n);
  const bf = height(n.left) - height(n.right);
  if (bf > 1) {
    if (height(n.left?.right) > height(n.left?.left)) n.left = n.left && rotateLeft(n.left);
    return rotateRight(n);
  }
  if (bf < -1) {
    if (height(n.right?.left) > height(n.right?.right)) n.right = n.right && rotateRight(n.right);
    return rotateLeft(n);
  }
  return n;
}

function insert(root: Node | undefined, key: number): Node {
  if (!root) return { key, h: 1 };
  if (key < root.key) root.left = insert(root.left, key);
  else if (key > root.key) root.right = insert(root.right, key);
  return balance(root);
}

function find(root: Node | undefined, key: number): Node | undefined {
  if (!root) return undefined;
  if (key === root.key) return root;
  return key < root.key ? find(root.left, key) : find(root.right, key);
}

type PositionedNode = Node & { x: number; y: number };

function layout(root: Node | undefined): PositionedNode[] {
  const nodes: PositionedNode[] = [];
  let x = 0;
  const walk = (n: Node | undefined, d: number) => {
    if (!n) return;
    walk(n.left, d + 1);
    nodes.push({ ...n, x: x++ * 60 + 30, y: d * 80 + 30 });
    walk(n.right, d + 1);
  };
  walk(root, 0);
  return nodes;
}

export default function AVLVisualizer() {
  const [root, setRoot] = useState<Node | undefined>();
  const [val, setVal] = useState('');
  const [query, setQuery] = useState('');

  const nodes = useMemo(() => layout(root), [root]);
  const edges = useMemo(() => {
    const map = new Map<number, PositionedNode>();
    nodes.forEach(n => map.set(n.key, n));
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const walk = (n?: Node) => {
      if (!n) return;
      const p = map.get(n.key)!;
      if (n.left) {
        const c = map.get(n.left.key)!;
        lines.push({ x1: p.x, y1: p.y, x2: c.x, y2: c.y });
        walk(n.left);
      }
      if (n.right) {
        const c = map.get(n.right.key)!;
        lines.push({ x1: p.x, y1: p.y, x2: c.x, y2: c.y });
        walk(n.right);
      }
    };
    walk(root);
    return lines;
  }, [nodes, root]);

  const clone = (n?: Node): Node | undefined => (n ? { key: n.key, h: n.h, left: clone(n.left), right: clone(n.right) } : undefined);

  const onInsert = () => {
    const n = Number(val);
    if (Number.isFinite(n)) {
      setRoot(r => insert(clone(r), n));
      setVal('');
    }
  };

  const width = Math.max(360, (nodes.length + 1) * 60);
  const heightSvg = Math.max(220, (Math.max(0, ...nodes.map(n => n.y)) + 60));
  const highlight = query ? Number(query) : undefined;
  const foundKey = highlight !== undefined ? find(root, highlight)?.key : undefined;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 w-32 bg-white dark:bg-gray-900"
          placeholder="number"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onInsert()}
        />
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={onInsert}>Insert</button>
        <input
          className="border rounded px-2 py-1 w-32 bg-white dark:bg-gray-900"
          placeholder="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="px-3 py-1 rounded bg-gray-600 text-white" onClick={() => setRoot(undefined)}>Clear</button>
      </div>
      <div className="overflow-auto border rounded bg-gray-50 dark:bg-gray-900">
        <svg width={width} height={heightSvg} className="text-gray-700 dark:text-gray-300">
          {edges.map((e, i) => (
            <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="currentColor" strokeWidth="2" />
          ))}
          {nodes.map(n => (
            <g key={n.key} transform={`translate(${n.x}, ${n.y})`}>
              <circle r={18} fill={n.key === foundKey ? '#22C55E' : '#fff'} stroke="currentColor" strokeWidth="2" />
              <text textAnchor="middle" dominantBaseline="central" fontSize="12">{n.key}</text>
              <text x={20} y={-12} fontSize="10" fill="currentColor">h={n.h}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

