import { useState } from 'react';
import StackVisualizer from '@components/Visualizer/StackVisualizer';
import BSTVisualizer from '@components/Visualizer/BSTVisualizer';
import AVLVisualizer from '@components/Visualizer/AVLVisualizer';
import TreeVisualizer from '@components/Visualizer/TreeVisualizer';
import HeapVisualizer from '@components/Visualizer/HeapVisualizer';
import HashVisualizer from '@components/Visualizer/HashVisualizer';
import ArrayVisualizer from '@components/Visualizer/ArrayVisualizer';
import LinkedListVisualizer from '@components/Visualizer/LinkedListVisualizer';
import QueueVisualizer from '@components/Visualizer/QueueVisualizer';
import GraphVisualizer from '@components/Visualizer/GraphVisualizer';
import TrieVisualizer from '@components/Visualizer/TrieVisualizer';

const items = [
  { key: 'array', label: 'Array', Comp: ArrayVisualizer },
  { key: 'linked-list', label: 'Linked List', Comp: LinkedListVisualizer },
  { key: 'queue', label: 'Queue', Comp: QueueVisualizer },
  { key: 'stack', label: 'Stack', Comp: StackVisualizer },
  { key: 'tree', label: 'Tree', Comp: TreeVisualizer },
  { key: 'bst', label: 'Binary Search Tree', Comp: BSTVisualizer },
  { key: 'avl', label: 'AVL Tree', Comp: AVLVisualizer },
  { key: 'heap', label: 'Heap', Comp: HeapVisualizer },
  { key: 'hash', label: 'Hash Table', Comp: HashVisualizer },
  { key: 'graph', label: 'Graph', Comp: GraphVisualizer },
  { key: 'trie', label: 'Trie', Comp: TrieVisualizer },
];

export default function Visualizer() {
  const [key, setKey] = useState('stack');
  const active = items.find(i => i.key === key) ?? items[0];
  const Comp = active.Comp;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Interactive Visualizer</h1>
      <div className="flex gap-2">
        {items.map(i => (
          <button
            key={i.key}
            onClick={() => setKey(i.key)}
            className={`px-3 py-1 rounded border ${i.key === key ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-700'}`}
          >
            {i.label}
          </button>
        ))}
      </div>
      <div className="rounded border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
        <Comp />
      </div>
    </div>
  );
}
