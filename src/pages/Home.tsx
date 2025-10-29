import { useMemo, useState } from 'react';
import topics from '@data/topics';
import DataStructureCard from '@components/DataStructureCard';
import { getProgress } from '@utils/storage';

export default function Home() {
  const [q, setQ] = useState('');
  const list = useMemo(() => topics.filter(t => t.title.toLowerCase().includes(q.toLowerCase())), [q]);
  return (
    <div>
      <section className="mb-8 card p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Master Data Structures with
              <span className="brand-gradient"> Visual Intuition</span>
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-prose">
              Interactive simulations, Mermaid diagrams, concise notes, and quizzes — all in one place.
            </p>
            <div className="mt-4 flex gap-2">
              <a href="/visualizer" className="btn-primary">Open Visualizer</a>
              <a href="/quiz" className="btn-secondary">Take a Quiz</a>
            </div>
          </div>
          <div className="w-full md:w-80">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              className="input w-full"
              placeholder="Search data structures..."
            />
            <div className="mt-2 text-xs text-gray-500">Try "heap", "hash", or "trie"</div>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(t => (
          <DataStructureCard key={t.slug} topic={t} progress={getProgress(t.slug)} />
        ))}
      </section>
    </div>
  );
}
