export default function ArrayComparison() {
  const rows: { label: string; static: string; dynamic: string }[] = [
    { label: 'Capacity', static: 'Fixed at allocation time', dynamic: 'Grows automatically (resizes when full)' },
    { label: 'Access by index', static: 'O(1)', dynamic: 'O(1)' },
    { label: 'Append (average)', static: 'O(1) if space remains, else impossible', dynamic: 'O(1) amortized' },
    { label: 'Append (worst case)', static: 'N/A (no growth)', dynamic: 'O(n) during resize + copy' },
    { label: 'Insert/delete in middle', static: 'O(n) (shift elements)', dynamic: 'O(n) (shift elements)' },
    { label: 'Memory overhead', static: 'Exact size only', dynamic: 'Extra capacity (unused slots)' },
    { label: 'Typical implementation', static: 'Stack/heap-allocated fixed buffer', dynamic: 'Resizable buffer (e.g., doubling strategy)' },
    { label: 'Great for', static: 'Known size, tight memory, fixed buffers', dynamic: 'Unknown size, frequent appends' },
  ];

  return (
    <section className="rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-semibold">Static vs Dynamic Arrays</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Key differences, performance, and trade‑offs.</p>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        <div className="grid grid-cols-3 text-sm px-4 py-2 font-medium">
          <div className="text-gray-500">Factor</div>
          <div>Static Array</div>
          <div>Dynamic Array</div>
        </div>
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-3 text-sm px-4 py-2">
            <div className="text-gray-500">{r.label}</div>
            <div>{r.static}</div>
            <div>{r.dynamic}</div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
        Amortized O(1) means most appends are O(1), with occasional O(n) when the array resizes and copies elements.
      </div>
    </section>
  );
}

