import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import topics from '@data/topics';
import MermaidDiagram from '@components/MermaidDiagram';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markVisited } from '@utils/storage';
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

const summaryUrl = '/content/summary.md';

function useSummarySection(slug: string) {
  const [content, setContent] = useState<string | null>(null);
  useEffect(() => {
    fetch(summaryUrl)
      .then(r => (r.ok ? r.text() : ''))
      .then(text => {
        if (!text) return setContent(null);
        const parts = text.split(/\n## Topic: /g).map(s => s.trim());
        const match = parts.find(p => p.toLowerCase().startsWith(topics.find(t => t.slug === slug)?.title || ''));
        setContent(match ? `## Topic: ${match}` : null);
      })
      .catch(() => setContent(null));
  }, [slug]);
  return content;
}

export default function Learn() {
  const { topic: slug = '' } = useParams();
  const t = topics.find(x => x.slug === slug);
  const summary = useSummarySection(slug);

  if (!t) return <div>Topic not found.</div>;
  markVisited(slug);

  const Visual =
    t.slug === 'array' ? ArrayVisualizer :
    t.slug === 'linked-list' ? LinkedListVisualizer :
    t.slug === 'queue' ? QueueVisualizer :
    t.slug === 'stack' ? StackVisualizer :
    t.slug === 'tree' ? TreeVisualizer :
    t.slug === 'bst' ? BSTVisualizer :
    t.slug === 'avl' ? AVLVisualizer :
    t.slug === 'heap' ? HeapVisualizer :
    t.slug === 'hash' ? HashVisualizer :
    t.slug === 'graph' ? GraphVisualizer :
    t.slug === 'trie' ? TrieVisualizer :
    StackVisualizer;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <div className="rounded border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
          <h2 className="font-semibold mb-2">Diagram</h2>
          <MermaidDiagram code={t.diagram} />
        </div>
        <article className="prose dark:prose-invert max-w-none">
          {summary ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
          ) : (
            <div>
              <h2>Overview</h2>
              <p>{t.description}</p>
              <h3>Operations</h3>
              <ul>
                {t.operations.map(o => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </div>
      <aside className="space-y-3">
        <div className="rounded border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
          <h2 className="font-semibold mb-2">Try It</h2>
          <Visual />
        </div>
        <div className="rounded border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950 text-sm text-gray-600 dark:text-gray-400">
          Use the Visualizer to practice operations step-by-step.
        </div>
      </aside>
    </div>
  );
}
