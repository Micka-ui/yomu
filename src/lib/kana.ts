const KANA = /^[぀-ゟ゠-ヿー]$/;
const HAS_KANJI = /[㐀-鿿々ヶ]/; // kanji, 々, ヶ

export const isKana = (ch: string) => KANA.test(ch);
export const hasKanji = (s: string) => HAS_KANJI.test(s);

const toHira = (s: string) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

export type RubyPart = { text: string; rt?: string };

/**
 * Découpe une surface en parties avec/sans furigana en retirant les kana
 * communs au début et à la fin (okurigana). Ex. 食べた / たべた → [食|た] べた
 */
export function splitRuby(surface: string, reading?: string): RubyPart[] {
  if (!reading || !hasKanji(surface)) return [{ text: surface }];
  const s = [...surface];
  const r = [...reading];
  let head = 0;
  while (head < s.length - 1 && head < r.length && isKana(s[head]) && toHira(s[head]) === toHira(r[head])) head++;
  let tail = 0;
  while (
    tail < s.length - head - 1 &&
    tail < r.length - head - 1 &&
    isKana(s[s.length - 1 - tail]) &&
    toHira(s[s.length - 1 - tail]) === toHira(r[r.length - 1 - tail])
  )
    tail++;
  const parts: RubyPart[] = [];
  if (head) parts.push({ text: s.slice(0, head).join('') });
  parts.push({ text: s.slice(head, s.length - tail).join(''), rt: r.slice(head, r.length - tail).join('') });
  if (tail) parts.push({ text: s.slice(s.length - tail).join('') });
  return parts;
}

export const POS_LABELS: Record<string, string> = {
  noun: 'nom',
  verb: 'verbe',
  'i-adj': 'adjectif en い',
  'na-adj': 'adjectif en な',
  adv: 'adverbe',
  particle: 'particule',
  aux: 'auxiliaire',
  conj: 'conjonction',
  counter: 'compteur',
  expr: 'expression',
  name: 'nom propre',
  pron: 'pronom',
  prefix: 'préfixe',
  suffix: 'suffixe',
  number: 'nombre',
  interj: 'interjection',
};
