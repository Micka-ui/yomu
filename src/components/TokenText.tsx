import type { Token } from '../types';
import { Furigana } from './Furigana';
import { isKnown, knownWords, settings } from '../lib/storage';
import { selected } from './WordSheet';

export function TokenText({ tokens, from, large }: { tokens: Token[]; from?: string; large?: boolean }) {
  const mode = settings.value.furigana;
  knownWords.value; // abonnement au signal
  const sel = selected.value?.token;
  return (
    <span class={large ? 'jp jp-large' : 'jp'}>
      {tokens.map((t, i) => {
        if (t.pos === 'punct' || !t.gloss) return <span key={i}>{t.s}</span>;
        const show = mode === 'all' || (mode === 'unknown' && !isKnown(t));
        return (
          <span
            key={i}
            class={`tok${sel === t ? ' tok-sel' : ''}${t.grammar?.length ? ' tok-gram' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              selected.value = { token: t, from };
            }}
          >
            <Furigana s={t.s} r={t.r} show={show} />
          </span>
        );
      })}
    </span>
  );
}
