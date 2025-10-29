import { Link } from 'react-router-dom';
import type { Topic } from '@data/topics';

type Props = {
  topic: Topic;
  progress?: number;
};

export default function DataStructureCard({ topic, progress = 0 }: Props) {
  return (
    <Link
      to={`/learn/${topic.slug}`}
      className="block rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:shadow-sm transition"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-lg">{topic.title}</h3>
        <span className="text-xs text-gray-500 uppercase tracking-wide">{topic.category}</span>
      </div>
      <p className="text-sm mt-1 text-gray-600 dark:text-gray-400 line-clamp-2">{topic.description}</p>
      <div className="mt-3 h-2 bg-gray-100 dark:bg-gray-900 rounded">
        <div
          className="h-2 bg-blue-500 rounded"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-gray-500">{Math.round(progress * 100)}% complete</div>
    </Link>
  );
}

