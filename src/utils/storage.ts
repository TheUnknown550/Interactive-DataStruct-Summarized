export function getProgress(slug: string): number {
  try {
    const k = `progress:${slug}`;
    const raw = localStorage.getItem(k);
    return raw ? Math.min(1, Math.max(0, Number(raw))) : 0;
  } catch {
    return 0;
  }
}

export function markVisited(slug: string) {
  try {
    const k = `progress:${slug}`;
    const v = Math.max(getProgress(slug), 0.1);
    localStorage.setItem(k, String(v));
  } catch {}
}

export function saveQuizResult(slug: string, correct: boolean) {
  try {
    const k = `quiz:${slug}`;
    const raw = localStorage.getItem(k);
    const data = raw ? JSON.parse(raw) : { correct: 0, total: 0 };
    data.total += 1;
    if (correct) data.correct += 1;
    localStorage.setItem(k, JSON.stringify(data));
    // Inflate progress a bit on quiz activity
    const progK = `progress:${slug}`;
    const p = Math.min(1, getProgress(slug) + (correct ? 0.2 : 0.05));
    localStorage.setItem(progK, String(p));
  } catch {}
}

