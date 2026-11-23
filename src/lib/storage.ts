import { signal, effect } from '@preact/signals';
import type { Token } from '../types';

function persisted<T>(key: string, initial: T) {
  let start = initial;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      start = Array.isArray(initial) ? parsed : ({ ...initial, ...parsed } as T);
    }
  } catch {
    /* ignore */
  }
  const s = signal<T>(start);
  effect(() => localStorage.setItem(key, JSON.stringify(s.value)));
  return s;
}

export type FuriganaMode = 'all' | 'unknown' | 'none';

export interface Settings {
  furigana: FuriganaMode;
  showTranslations: boolean;
  repo: string; // "owner/name"
  token: string; // PAT GitHub (reste sur l'appareil)
  defaultLevel: string;
}

export const settings = persisted<Settings>('yomu.settings', {
  furigana: 'unknown',
  showTranslations: false,
  repo: import.meta.env.VITE_REPO || '',
  token: '',
  defaultLevel: 'N4',
});

export interface SavedWord {
  key: string; // base || s
  s: string;
  r?: string;
  gloss?: string;
  pos?: string;
  from?: string; // id du texte
  addedAt: number;
  /** Boîte de Leitner simple (0 = à revoir souvent). */
  box: number;
  due: number;
}

export const savedWords = persisted<SavedWord[]>('yomu.words', []);
/** Mots marqués « je connais » : leurs furigana sont masqués en mode « unknown ». */
export const knownWords = persisted<string[]>('yomu.known', []);
export const readTexts = persisted<string[]>('yomu.read', []);

export const wordKey = (t: Token) => t.base || t.s;

export function isSaved(t: Token) {
  return savedWords.value.some((w) => w.key === wordKey(t));
}

export function toggleSaved(t: Token, from?: string) {
  const key = wordKey(t);
  if (isSaved(t)) {
    savedWords.value = savedWords.value.filter((w) => w.key !== key);
  } else {
    savedWords.value = [
      ...savedWords.value,
      {
        key,
        s: t.base || t.s,
        r: t.base ? t.baseR : t.r,
        gloss: t.gloss,
        pos: t.pos,
        from,
        addedAt: Date.now(),
        box: 0,
        due: Date.now(),
      },
    ];
  }
}

export function isKnown(t: Token) {
  return knownWords.value.includes(wordKey(t));
}

export function toggleKnown(t: Token) {
  const key = wordKey(t);
  knownWords.value = isKnown(t) ? knownWords.value.filter((k) => k !== key) : [...knownWords.value, key];
}

export function markRead(id: string) {
  if (!readTexts.value.includes(id)) readTexts.value = [...readTexts.value, id];
}
