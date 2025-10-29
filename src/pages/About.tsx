export default function About() {
  return (
    <div className="prose dark:prose-invert max-w-3xl">
      <h1>About DataStructViz</h1>
      <p>
        DataStructViz is a learning tool that combines visual explanations, interactive simulators,
        and concise notes to help students master core data structures.
      </p>
      <h2>How to Use</h2>
      <ul>
        <li>Start on Home to pick a topic.</li>
        <li>Open Learn pages to view auto-summarized notes from your slides.</li>
        <li>Use the Visualizer to practice operations step-by-step.</li>
        <li>Try the Quiz to check understanding and track progress.</li>
      </ul>
      <h2>Credits</h2>
      <p>Built with React, Vite, Tailwind CSS, Mermaid, and pdf.js.</p>
    </div>
  );
}

