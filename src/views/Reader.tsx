import { useEffect, useState } from 'preact/hooks';
import type { Text } from '../types';
import { grammarMeta, interestById, loadText } from '../lib/content';
import { markRead, readTexts, settings } from '../lib/storage';
import { TokenText } from '../components/TokenText';
import { FuriganaToggle } from '../components/FuriganaToggle';

export function Reader({ id }: { id: string }) {
  const [text, setText] = useState<Text | null | undefined>(undefined);
  const [openTr, setOpenTr] = useState<Set<number>>(new Set());
  useEffect(() => {
    loadText(id).then((t) => setText(t ?? null));
    window.scrollTo(0, 0);
  }, [id]);

  if (text === undefined) return <div class="page muted">Chargement…</div>;
  if (text === null) return <div class="page">Texte introuvable. <a href="#/">Retour</a></div>;

  const allTr = settings.value.showTranslations;
  const isRead = readTexts.value.includes(id);
  const it = interestById(text.interest);
  const toggle = (i: number) => {
    const n = new Set(openTr);
    n.has(i) ? n.delete(i) : n.add(i);
    setOpenTr(n);
  };

  return (
    <div class="page reader">
      <div class="toolbar">
        <a href="#/" class="back">
          ← Textes
        </a>
        <FuriganaToggle />
      </div>
      <div class="card-meta">
        <span class="pill">{text.level}</span>
        {it && (
          <span class="muted">
            {it.emoji} {it.label}
          </span>
        )}
        <span class="muted">{text.date}</span>
      </div>
      <h1 class="reader-title">
        <TokenText tokens={text.title} from={id} large />
      </h1>
      <div class="muted">{text.titleFr}</div>
      {text.image && (
        <figure>
          <img src={text.image.src} alt={text.image.alt} />
          {text.image.credit && <figcaption>{text.image.credit}</figcaption>}
        </figure>
      )}
      {text.paragraphs.map((p, i) => (
        <div class="para" key={i}>
          <p>
            <TokenText tokens={p.tokens} from={id} large />
          </p>
          <button class="tr-btn" onClick={() => toggle(i)}>
            {allTr || openTr.has(i) ? '▾ Traduction' : '▸ Traduction'}
          </button>
          {(allTr || openTr.has(i)) && <p class="tr">{p.fr}</p>}
        </div>
      ))}

      {text.grammarUsed.length > 0 && (
        <section class="section">
          <h2>Grammaire du texte</h2>
          <ul class="list">
            {text.grammarUsed.map((g) => {
              const m = grammarMeta(g);
              return m ? (
                <li key={g}>
                  <a href={`#/g/${g}`}>
                    <span class="jp">{m.title}</span> <span class="pill small">{m.level}</span>
                    <div class="muted small">{m.meaning}</div>
                  </a>
                </li>
              ) : null;
            })}
          </ul>
        </section>
      )}

      <button class={isRead ? 'btn btn-on wide' : 'btn btn-primary wide'} onClick={() => markRead(id)} disabled={isRead}>
        {isRead ? '✓ Lu' : 'Marquer comme lu'}
      </button>
    </div>
  );
}
