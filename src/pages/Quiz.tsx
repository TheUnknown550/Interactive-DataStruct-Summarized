import { useMemo, useState } from 'react';
import questions from '@data/questions';
import topics from '@data/topics';
import { saveQuizResult } from '@utils/storage';

export default function Quiz() {
  const pool = useMemo(() => questions, []);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const q = pool[idx];

  const submit = (i: number) => {
    if (selected !== null) return; // already answered
    setSelected(i);
    const isCorrect = i === q.answer;
    if (isCorrect) setCorrect(c => c + 1);
    const topicSlug = q.topic;
    saveQuizResult(topicSlug, isCorrect);
  };

  const next = () => {
    setSelected(null);
    setIdx(i => (i + 1) % pool.length);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="text-2xl font-bold">Quiz</h1>
      <div className="text-sm text-gray-600 dark:text-gray-400">Question {idx + 1} of {pool.length} • Score: {correct}</div>
      <div className="rounded border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">{topics.find(t => t.slug === q.topic)?.title}</div>
        <h2 className="font-semibold mb-3">{q.text}</h2>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const state = selected === null ? '' : i === q.answer ? 'border-green-600 bg-green-50/50 dark:bg-green-950/30' : i === selected ? 'border-red-600 bg-red-50/50 dark:bg-red-950/30' : 'opacity-70';
            return (
              <button
                key={i}
                onClick={() => submit(i)}
                className={`block w-full text-left border rounded px-3 py-2 ${state}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={next} className="px-3 py-1 rounded bg-blue-600 text-white">Next</button>
        </div>
      </div>
    </div>
  );
}

