/** Markdown minimal : paragraphes, **gras**, `code` (affiché en japonais), listes « - ». */
function inline(s: string) {
  const out: (string | preact.JSX.Element)[] = [];
  const re = /\*\*(.+?)\*\*|`(.+?)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(m[1] ? <strong key={k++}>{m[1]}</strong> : <span key={k++} class="jp hl">{m[2]}</span>);
    last = re.lastIndex;
  }
  out.push(s.slice(last));
  return out;
}

export function Markdown({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n{2,}/).map((block, i) => {
        const lines = block.split('\n');
        if (lines.every((l) => l.startsWith('- ')))
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.slice(2))}</li>
              ))}
            </ul>
          );
        return <p key={i}>{inline(block)}</p>;
      })}
    </>
  );
}
