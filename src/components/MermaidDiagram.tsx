import { useEffect, useId, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'base' });

type Props = {
  code: string;
};

export default function MermaidDiagram({ code }: Props) {
  const id = useId().replace(/:/g, '');
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const { svg } = await mermaid.render(`m-${id}`, code);
        if (mounted) setSvg(svg);
      } catch (e) {
        setSvg(`<pre class='p-2 bg-red-50 dark:bg-red-950 text-red-600 overflow-auto'>Mermaid render error: ${String(e)}</pre>`);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [code, id]);

  return (
    <div className="overflow-auto" dangerouslySetInnerHTML={{ __html: svg }} />
  );
}

