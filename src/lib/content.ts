import type { GrammarLesson, GrammarMeta, Interest, Text, TextMeta } from '../types';
import textIndex from '../../content/texts/index.json';
import grammarIndex from '../../content/grammar/index.json';
import interests from '../../content/interests.json';

const textLoaders = import.meta.glob<Text>(['../../content/texts/*.json', '!../../content/texts/index.json'], { import: 'default' });
const grammarLoaders = import.meta.glob<GrammarLesson>('../../content/grammar/*/*.json', { import: 'default' });

export const texts = (textIndex as TextMeta[]).slice().sort((a, b) => b.date.localeCompare(a.date));
export const grammar = grammarIndex as GrammarMeta[];
export const interestList = interests as Interest[];

export function interestById(id: string): Interest | undefined {
  return interestList.find((i) => i.id === id);
}

export function grammarMeta(id: string): GrammarMeta | undefined {
  return grammar.find((g) => g.id === id);
}

export async function loadText(id: string): Promise<Text | undefined> {
  const loader = textLoaders[`../../content/texts/${id}.json`];
  return loader ? loader() : undefined;
}

export async function loadLesson(id: string): Promise<GrammarLesson | undefined> {
  const meta = grammarMeta(id);
  if (!meta) return undefined;
  const loader = grammarLoaders[`../../content/grammar/${meta.level}/${id}.json`];
  return loader ? loader() : undefined;
}

export function textsUsingGrammar(id: string): TextMeta[] {
  return texts.filter((t) => t.grammarUsed.includes(id));
}
