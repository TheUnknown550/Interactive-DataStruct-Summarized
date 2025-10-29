import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { Topic } from '@data/topics';

type Props = {
  topic: Topic;
  progress?: number;
};

export default function DataStructureCard({ topic, progress = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const complexity = topic.complexity || {};
  const keys = ['Access', 'Search', 'Insert', 'Delete', 'Push', 'Pop', 'Enqueue', 'Dequeue', 'Extract', 'Get', 'Put', 'Space', 'Traverse', 'Prefix', 'Peek'];
  const compPairs = keys.filter(k => complexity[k]).map(k => [k, complexity[k]!] as const);
  const useCases = (topic.useCases || []).slice(0, 3);
  const considerations = (topic.considerations || []).slice(0, 3);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-sm transition">
      <Link to={`/learn/${topic.slug}`} className="block p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-lg">{topic.title}</h3>
          <span className="text-xs text-gray-500 uppercase tracking-wide">{topic.category}</span>
        </div>
        <p className="text-sm mt-1 text-gray-600 dark:text-gray-400 line-clamp-2">{topic.description}</p>
        <div className="mt-3 h-2 bg-gray-100 dark:bg-gray-900 rounded">
          <div className="h-2 bg-blue-500 rounded" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        <div className="mt-2 text-xs text-gray-500">{Math.round(progress * 100)}% complete</div>
      </Link>
      <div className="px-4 pb-3 flex justify-between items-center gap-2">
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={(e) => { e.preventDefault(); setOpen(o => !o); }}
        >
          {open ? 'Hide details' : 'Quick details'}
        </button>
        <Link to={`/learn/${topic.slug}`} className="text-sm text-gray-600 dark:text-gray-400 hover:underline">Go to Learn →</Link>
      </div>
      {open && (
        <div className="px-4 pb-4 space-y-2 text-sm">
          {topic.how && (
            <div>
              <div className="text-xs font-semibold text-gray-500">How it works</div>
              <div className="text-gray-700 dark:text-gray-300">{topic.how}</div>
            </div>
          )}
          {compPairs.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-500">Time Complexity</div>
              <ul className="grid grid-cols-2 gap-x-4">
                {compPairs.map(([k, v]) => (
                  <li key={k} className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">{k}</span><span className="font-mono">{v}</span></li>
                ))}
              </ul>
            </div>
          )}
          {(useCases.length > 0 || considerations.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {useCases.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-500">Use Cases</div>
                  <ul className="list-disc ml-4">
                    {useCases.map(u => <li key={u}>{u}</li>)}
                  </ul>
                </div>
              )}
              {considerations.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-500">Considerations</div>
                  <ul className="list-disc ml-4">
                    {considerations.map(u => <li key={u}>{u}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
