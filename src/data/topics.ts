export type Topic = {
  slug: string;
  title: string;
  category: 'Linear' | 'Tree' | 'Hash/Graph';
  description: string;
  operations: string[];
  diagram: string; // Mermaid code
};

const topics: Topic[] = [
  {
    slug: 'array',
    title: 'Array',
    category: 'Linear',
    description: 'Contiguous memory structure with O(1) access by index.',
    operations: ['access', 'insert', 'delete', 'search', 'iterate'],
    diagram: 'flowchart LR\nA[Index]-->B[Value]',
  },
  {
    slug: 'linked-list',
    title: 'Linked List',
    category: 'Linear',
    description: 'Nodes pointing to next nodes, efficient inserts/removals.',
    operations: ['insertHead', 'insertTail', 'delete', 'search', 'traverse'],
    diagram: 'flowchart LR\nA((1))-->|next|B((2))-->|next|C((3))',
  },
  {
    slug: 'stack',
    title: 'Stack',
    category: 'Linear',
    description: 'LIFO structure supporting push/pop on the top.',
    operations: ['push', 'pop', 'peek', 'isEmpty'],
    diagram: 'flowchart TB\nA[top]-->B[item]\nB-->C[item]\nC-->D[bottom]',
  },
  {
    slug: 'queue',
    title: 'Queue',
    category: 'Linear',
    description: 'FIFO structure with enqueue at rear, dequeue at front.',
    operations: ['enqueue', 'dequeue', 'peek', 'isEmpty'],
    diagram: 'flowchart LR\nfront-->A[item]-->B[item]-->rear',
  },
  {
    slug: 'tree',
    title: 'Tree',
    category: 'Tree',
    description: 'Hierarchical structure with parent-child relationships.',
    operations: ['traverse', 'insert', 'delete', 'search'],
    diagram: 'graph TD\nA-->B\nA-->C\nB-->D\nB-->E',
  },
  {
    slug: 'bst',
    title: 'Binary Search Tree',
    category: 'Tree',
    description: 'Binary tree with ordered keys enabling O(log n) average search.',
    operations: ['insert', 'search', 'delete', 'inorder'],
    diagram: 'graph TD\n  A((8))-->B((3))\n  A-->C((10))\n  B-->D((1))\n  B-->E((6))',
  },
  {
    slug: 'heap',
    title: 'Heap',
    category: 'Tree',
    description: 'Complete binary tree maintaining heap property (min/max).',
    operations: ['insert', 'extract', 'heapify'],
    diagram: 'graph TD\nA((1))-->B((3))\nA-->C((5))',
  },
  {
    slug: 'graph',
    title: 'Graph',
    category: 'Hash/Graph',
    description: 'Vertices connected by edges, directed or undirected.',
    operations: ['addVertex', 'addEdge', 'BFS', 'DFS'],
    diagram: 'graph LR\nA--B\nA--C\nB--D\nC--D',
  },
  {
    slug: 'hash',
    title: 'Hash Table',
    category: 'Hash/Graph',
    description: 'Key-value store with hashing for fast average access.',
    operations: ['put', 'get', 'delete'],
    diagram: 'flowchart LR\nK[key]-->H[hash]\nH-->B[bucket]',
  },
  {
    slug: 'trie',
    title: 'Trie',
    category: 'Tree',
    description: 'Prefix tree storing strings efficiently for prefix queries.',
    operations: ['insert', 'search', 'startsWith'],
    diagram: 'graph TD\nroot-->a\nroot-->b\na-->at\na-->an',
  },
  {
    slug: 'avl',
    title: 'AVL Tree',
    category: 'Tree',
    description: 'Self-balancing BST with rotations to keep height O(log n).',
    operations: ['insert', 'rotate', 'search', 'inorder'],
    diagram: 'graph TD\n  A((30))-->B((20))\n  A-->C((40))\n  B-->D((10))\n  B-->E((25))',
  },
];

export default topics;
