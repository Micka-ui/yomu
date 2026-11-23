import { useState } from 'preact/hooks';
import { savedWords, type SavedWord } from '../lib/storage';
import { POS_LABELS } from '../lib/kana';

const DAY = 24 * 3600 * 1000;
const INTERVALS = [0, 1, 3, 7, 16, 35]; // jours, par boîte

function Review({ onExit }: { onExit: () => void }) {
  const due = savedWords.value.filter((w) => w.due <= Date.now());
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [queue] = useState<SavedWord[]>(() => [...due].sort(() => Math.random() - 0.5));
  const w = queue[idx];
  if (!w)
    return (
      <div class="review">
        <p>Révision terminée 🎉</p>
        <button class="btn btn-primary" onClick={onExit}>
          Retour
        </button>
      </div>
    );
  const answer = (ok: boolean) => {
    const box = ok ? Math.min(w.box + 1, INTERVALS.length - 1) : 0;
    savedWords.value = savedWords.value.map((x) =>
      x.key === w.key ? { ...x, box, due: Date.now() + INTERVALS[box] * DAY } : x,
    );
    setFlipped(false);
    setIdx(idx + 1);
  };
  return (
    <div class="review">
      <div class="muted small">
        {idx + 1} / {queue.length}
      </div>
      <div class="flashcard" onClick={() => setFlipped(true)}>
        <div class="jp flash-word">{w.s}</div>
        {flipped ? (
          <>
            {w.r && <div class="sheet-reading">{w.r}</div>}
            <div class="sheet-gloss">{w.gloss}</div>
          </>
        ) : (
          <div class="muted">Touche pour révéler</div>
        )}
      </div>
      {flipped && (
        <div class="sheet-actions">
          <button class="btn" onClick={() => answer(false)}>
            À revoir
          </button>
          <button class="btn btn-primary" onClick={() => answer(true)}>
            Je savais
          </button>
        </div>
      )}
      <button class="btn-link" onClick={onExit}>
        Arrêter
      </button>
    </div>
  );
}

export function Words() {
  const [reviewing, setReviewing] = useState(false);
  const words = [...savedWords.value].sort((a, b) => b.addedAt - a.addedAt);
  const dueCount = words.filter((w) => w.due <= Date.now()).length;
  if (reviewing) return <div class="page"><Review onExit={() => setReviewing(false)} /></div>;
  return (
    <div class="page">
      <h1>
        単語 <span class="muted h-sub">Mes mots</span>
      </h1>
      {words.length === 0 ? (
        <p class="muted">
          Touche un mot dans un texte puis « ☆ Sauvegarder » pour le retrouver ici.
        </p>
      ) : (
        <button class="btn btn-primary wide" disabled={!dueCount} onClick={() => setReviewing(true)}>
          {dueCount ? `Réviser (${dueCount})` : 'Rien à réviser pour le moment'}
        </button>
      )}
      <ul class="list">
        {words.map((w) => (
          <li key={w.key} class="word-row">
            <div>
              <span class="jp word-s">{w.s}</span> {w.r && <span class="muted">{w.r}</span>}
              <div class="small">
                {w.gloss} {w.pos && <span class="muted">· {POS_LABELS[w.pos] ?? w.pos}</span>}
              </div>
            </div>
            <div class="word-side">
              {w.from && (
                <a class="muted small" href={`#/t/${w.from}`}>
                  texte →
                </a>
              )}
              <button
                class="icon-btn"
                aria-label="Supprimer"
                onClick={() => (savedWords.value = savedWords.value.filter((x) => x.key !== w.key))}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
