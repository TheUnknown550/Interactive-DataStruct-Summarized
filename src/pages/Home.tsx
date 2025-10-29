import { useMemo, useState } from 'react';
import topics from '@data/topics';
import DataStructureCard from '@components/DataStructureCard';
import { getProgress } from '@utils/storage';

export default function Home() {
  const [q, setQ] = useState('');
  const list = useMemo(() => topics.filter(t => t.title.toLowerCase().includes(q.toLowerCase())), [q]);
  return (
    <div>
      <section className="mb-6">
        <h1 className="text-2xl font-bold">Learn Data Structures Visually</h1>
        <p className="text-gray-600 dark:text-gray-400">Interactive simulations, diagrams, notes, and quizzes.</p>
        <div className="mt-4">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            className="w-full md:w-96 border rounded px-3 py-2 bg-white dark:bg-gray-900"
            placeholder="Search data structures..."
          />
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

