import { useMemo, useState } from 'react';

export default function ArrayVisualizer() {
  const [arr, setArr] = useState<string[]>([]);
  const [val, setVal] = useState('');
  const [idx, setIdx] = useState('0');
  const [cap, setCap] = useState<number>(4);
  const [capInput, setCapInput] = useState('4');
  const [error, setError] = useState<string | null>(null);

  const n = arr.length;
  const iNum = useMemo(() => Number(idx), [idx]);
  const idxIsInt = Number.isInteger(iNum) && iNum >= 0;
  const idxValidForSet = idxIsInt && iNum < cap; // allow setting within capacity
  const idxValidForInsert = idxIsInt && iNum <= n && n < cap; // insert shifts, must have space

  const clearErrorSoon = () => setTimeout(() => setError(null), 1500);

  const applySize = () => {
    const next = Number(capInput);
    if (!Number.isInteger(next) || next < 0 || next > 50) {
      setError('Size must be an integer 0..50');
      clearErrorSoon();
      return;
    }
    setCap(next);
    if (next < arr.length) setArr(a => a.slice(0, next));
  };

  const push = () => {
    if (!val) return;
    if (n >= cap) { setError('Array is full'); clearErrorSoon(); return; }
    setArr(a => [...a, val]); setVal('');
  };
  const insertAt = () => {
    if (!idxIsInt) { setError('Index must be an integer'); clearErrorSoon(); return; }
    if (n >= cap) { setError('Array is full'); clearErrorSoon(); return; }
    if (iNum < 0 || iNum > n) { setError(`Insert index must be 0..${n}`); clearErrorSoon(); return; }
    const a = arr.slice(); a.splice(iNum, 0, val || ''); setArr(a); setVal('');
  };
  const removeAt = () => {
    if (!idxIsInt || iNum < 0 || iNum >= n) { setError(`Remove index must be 0..${Math.max(0, n - 1)}`); clearErrorSoon(); return; }
    const a = arr.slice(); a.splice(iNum, 1); setArr(a);
  };
  const setAt = () => {
    if (!idxIsInt || iNum < 0 || iNum >= cap) { setError(`Set index must be 0..${Math.max(0, cap - 1)}`); clearErrorSoon(); return; }
    // Setting beyond current length expands up to cap by filling empty slots
    const a = arr.slice();
    while (a.length < iNum) a.push('');
    if (iNum === a.length && a.length >= cap) { setError('Array is full'); clearErrorSoon(); return; }
    a[iNum] = val;
    if (iNum === arr.length) {
      // grew by one
      if (a.length > cap) { setError('Array is full'); clearErrorSoon(); return; }
    }
    setArr(a);
    setVal('');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <input className="border rounded px-2 py-1 w-32 bg-white dark:bg-gray-900" placeholder="value" value={val} onChange={e => setVal(e.target.value)} />
        <input className="border rounded px-2 py-1 w-24 bg-white dark:bg-gray-900" placeholder={`index`} value={idx} onChange={e => setIdx(e.target.value)} />
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={push}>Push</button>
        <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={insertAt}>Insert@i</button>
        <button className="px-3 py-1 rounded bg-amber-600 text-white" onClick={setAt} disabled={!idxValidForSet}>Set@i</button>
        <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={removeAt} disabled={n === 0}>Remove@i</button>
        <button className="px-3 py-1 rounded bg-gray-600 text-white" onClick={() => setArr([])} disabled={!arr.length}>Clear</button>
        <span className="ml-4 text-xs text-gray-500">Size</span>
        <input className="border rounded px-2 py-1 w-20 bg-white dark:bg-gray-900" value={capInput} onChange={e => setCapInput(e.target.value)} />
        <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700" onClick={applySize}>Apply</button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      <div className="overflow-auto">
        <div className="flex items-stretch">
          {Array.from({ length: cap }).map((_, i) => (
            <div key={i} className="m-1 text-center">
              <div className="text-center text-xs text-gray-500">{i}</div>
              <div className={`w-20 h-12 border rounded flex items-center justify-center bg-white dark:bg-gray-900 ${i === iNum && idxValidForSet ? 'ring-2 ring-blue-500' : ''}`}>
                {arr[i] ?? ''}
              </div>
            </div>
          ))}
          {cap === 0 && <div className="text-sm text-gray-500">(size = 0)</div>}
        </div>
      </div>
      <div className="text-xs text-gray-500">length = {n} • capacity = {cap}</div>
      <div className="text-xs text-gray-500">Insert index range: 0..{n} • Set index range: 0..{Math.max(0, cap - 1)}</div>
    </div>
  );
}
