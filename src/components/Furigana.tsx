import { splitRuby } from '../lib/kana';

export function Furigana({ s, r, show }: { s: string; r?: string; show: boolean }) {
  if (!show || !r) return <>{s}</>;
  return (
    <>
      {splitRuby(s, r).map((p, i) =>
        p.rt ? (
          <ruby key={i}>
            {p.text}
            <rt>{p.rt}</rt>
          </ruby>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}
