export type Level = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export const LEVELS: Level[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

/** Un mot (ou une ponctuation) d'un texte, déjà découpé et annoté. */
export interface Token {
  /** Surface : tel qu'écrit dans le texte. */
  s: string;
  /** Lecture en hiragana (seulement si la surface contient des kanji). */
  r?: string;
  /** Forme du dictionnaire, si différente de la surface (verbe conjugué…). */
  base?: string;
  /** Lecture de la forme du dictionnaire. */
  baseR?: string;
  /** Nature : noun, verb, i-adj, na-adj, adv, particle, aux, conj, counter, expr, name, punct… */
  pos?: string;
  /** Sens en français. Absent pour la ponctuation. */
  gloss?: string;
  /** Points de grammaire liés (ids de leçons). */
  grammar?: string[];
  /** Explication contextuelle (conjugaison, nuance…). */
  note?: string;
}

export interface Paragraph {
  tokens: Token[];
  /** Traduction française du paragraphe. */
  fr: string;
}

export interface TextImage {
  src: string;
  alt: string;
  credit?: string;
}

export interface Text {
  id: string;
  date: string; // YYYY-MM-DD
  level: Level;
  interest: string; // id de content/interests.json
  title: Token[];
  titleFr: string;
  summary: string; // résumé en français (1 phrase), sans spoiler
  image?: TextImage;
  paragraphs: Paragraph[];
  /** Points de grammaire utilisés (ids). Calculé par le script de validation. */
  grammarUsed: string[];
}

export interface TextMeta {
  id: string;
  date: string;
  level: Level;
  interest: string;
  title: string;
  titleFr: string;
  summary: string;
  image?: TextImage;
  grammarUsed: string[];
  chars: number;
}

export interface Example {
  tokens: Token[];
  fr: string;
}

export interface GrammarLesson {
  id: string;
  level: Level;
  /** Forme courte, ex. 「〜ようにする」 */
  title: string;
  /** Sens en une ligne, ex. « faire en sorte de » */
  meaning: string;
  /** Schémas de construction, ex. ["Verbe (forme dico) + ようにする"] */
  structure: string[];
  /** Explication en markdown léger (paragraphes, **gras**). */
  explanation: string;
  /** Points d'attention / nuances (optionnel). */
  nuances?: string[];
  examples: Example[];
  related?: string[];
}

export interface GrammarMeta {
  id: string;
  level: Level;
  title: string;
  meaning: string;
}

export interface Interest {
  id: string;
  label: string;
  emoji: string;
  description: string;
  active: boolean;
}
