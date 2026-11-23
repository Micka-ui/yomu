import { signal } from '@preact/signals';
import { useState } from 'preact/hooks';
import type { Token } from '../types';
import { grammarMeta } from '../lib/content';
import { POS_LABELS } from '../lib/kana';
import { isKnown, isSaved, savedWords, knownWords, toggleKnown, toggleSaved } from '../lib/storage';

export const selected = signal<{ token: Token; from?: string } | null>(null);

export function WordSheet() {
  const cur = selected.value;
  const [openGram, setOpenGram] = useState(true);
  savedWords.value;
  knownWords.value;
  if (!cur) return null;
  const t = cur.token;
  const lessons = (t.grammar ?? []).map(grammarMeta).filter((g) => !!g);
  return (
    <>
      <div class="sheet-backdrop" onClick={() => (selected.value = null)} />
      <div class="sheet" role="dialog">
        <div class="sheet-handle" />
        <div class="sheet-head">
          <div>
            <div class="sheet-word jp">{t.s}</div>
            {t.r && <div class="sheet-reading">{t.r}</div>}
          </div>
          <button class="icon-btn" aria-label="Fermer" onClick={() => (selected.value = null)}>
            ✕
          </button>
        </div>
        {t.base && t.base !== t.s && (
          <div class="sheet-base">
            Forme dictionnaire : <span class="jp">{t.base}</span>
            {t.baseR && <span class="muted"> ({t.baseR})</span>}
          </div>
        )}
        {t.pos && <div class="pill">{POS_LABELS[t.pos] ?? t.pos}</div>}
        <div class="sheet-gloss">{t.gloss}</div>
        {t.note && <div class="sheet-note">{t.note}</div>}

        {lessons.length > 0 && (
          <div class="sheet-gram">
            <button class="disclosure" onClick={() => setOpenGram(!openGram)}>
              {openGram ? '▾' : '▸'} Grammaire
            </button>
            {openGram && (
              <ul>
                {lessons.map((g) => (
                  <li key={g!.id}>
                    <a href={`#/g/${g!.id}`} onClick={() => (selected.value = null)}>
                      <span class="jp">{g!.title}</span>
                      <span class="pill small">{g!.level}</span>
                      <div class="muted">{g!.meaning}</div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div class="sheet-actions">
          <button class={isSaved(t) ? 'btn btn-on' : 'btn'} onClick={() => toggleSaved(t, cur.from)}>
            {isSaved(t) ? '★ Sauvegardé' : '☆ Sauvegarder'}
          </button>
          <button class={isKnown(t) ? 'btn btn-on' : 'btn'} onClick={() => toggleKnown(t)}>
            {isKnown(t) ? '✓ Connu' : 'Je connais'}
          </button>
        </div>
      </div>
    </>
  );
}
