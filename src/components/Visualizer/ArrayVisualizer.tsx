import { useState } from 'react';

export default function ArrayVisualizer() {
  const [arr, setArr] = useState<string[]>([]);
  const [val, setVal] = useState('');
  const [idx, setIdx] = useState('0');

  const push = () => {
    if (!val) return; setArr(a => [...a, val]); setVal('');
  };
  const insertAt = () => {
    const i = Number(idx); if (!Number.isInteger(i) || i < 0 || i > arr.length) return;
    const a = arr.slice(); a.splice(i, 0, val || ''); setArr(a); setVal('');
  };
  const removeAt = () => {
    const i = Number(idx); if (!Number.isInteger(i) || i < 0 || i >= arr.length) return;
    const a = arr.slice(); a.splice(i, 1); setArr(a);
  };
  const setAt = () => {
    const i = Number(idx); if (!Number.isInteger(i) || i < 0 || i >= arr.length) return;
    const a = arr.slice(); a[i] = val; setArr(a); setVal('');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <input className="border rounded px-2 py-1 w-32 bg-white dark:bg-gray-900" placeholder="value" value={val} onChange={e => setVal(e.target.value)} />
        <input className="border rounded px-2 py-1 w-20 bg-white dark:bg-gray-900" placeholder="index" value={idx} onChange={e => setIdx(e.target.value)} />
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={push}>Push</button>
        <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={insertAt}>Insert@i</button>
        <button className="px-3 py-1 rounded bg-amber-600 text-white" onClick={setAt}>Set@i</button>
        <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={removeAt} disabled={!arr.length}>Remove@i</button>
        <button className="px-3 py-1 rounded bg-gray-600 text-white" onClick={() => setArr([])} disabled={!arr.length}>Clear</button>
      </div>
      <div className="overflow-auto">
        <div className="flex items-stretch">
          {arr.map((v, i) => (
            <div key={i} className="m-1">
              <div className="text-center text-xs text-gray-500">{i}</div>
              <div className="w-20 h-12 border rounded flex items-center justify-center bg-white dark:bg-gray-900">
                {v}
              </div>
            </div>
          ))}
          {arr.length === 0 && <div className="text-sm text-gray-500">(empty array)</div>}
        </div>
      </div>
    </div>
  );
}

