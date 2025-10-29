import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StackVisualizer() {
  const [input, setInput] = useState('');
  const [stack, setStack] = useState<string[]>([]);

  const push = () => {
    if (!input.trim()) return;
    setStack(s => [input.trim(), ...s]);
    setInput('');
  };
  const pop = () => setStack(s => s.slice(1));
  const clear = () => setStack([]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 w-40 bg-white dark:bg-gray-900"
          placeholder="value"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && push()}
        />
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={push}>Push</button>
        <button className="px-3 py-1 rounded bg-amber-600 text-white" onClick={pop} disabled={!stack.length}>Pop</button>
        <button className="px-3 py-1 rounded bg-gray-600 text-white" onClick={clear} disabled={!stack.length}>Clear</button>
      </div>
      <div className="border rounded p-3 min-h-[160px] w-64 bg-gray-50 dark:bg-gray-900 flex flex-col-reverse items-stretch relative">
        <span className="absolute -left-2 top-2 text-xs text-gray-500 rotate-90">Top →</span>
        <AnimatePresence>
          {stack.map((v, i) => (
            <motion.div
              key={v + i}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="m-1 p-2 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center"
            >
              {v}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

