/**
 * Valide tout le contenu de content/ et reconstruit les index.
 *   npm run validate
 * Sort en erreur (code 1) si quelque chose ne va pas — utilisé par la CI et par
 * Claude après chaque génération.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { hasKanji } from '../src/lib/kana';
import { LEVELS, type GrammarLesson, type GrammarMeta, type Interest, type Text, type TextMeta, type Token } from '../src/types';

const ROOT = join(import.meta.dirname, '..', 'content');
const errors: string[] = [];
const warnings: string[] = [];
const err = (where: string, msg: string) => errors.push(`✗ ${where} : ${msg}`);
const warn = (where: string, msg: string) => warnings.push(`! ${where} : ${msg}`);

const readJson = <T>(p: string): T | undefined => {
  try {
    return JSON.parse(readFileSync(p, 'utf8')) as T;
  } catch (e) {
    err(p, `JSON invalide (${(e as Error).message})`);
  }
};
const writeJson = (p: string, data: unknown) => writeFileSync(p, JSON.stringify(data, null, 2) + '\n');

const POS = new Set(['noun', 'verb', 'i-adj', 'na-adj', 'adv', 'particle', 'aux', 'conj', 'counter', 'expr', 'name', 'pron', 'prefix', 'suffix', 'number', 'interj', 'punct']);
const KANA_ONLY = /^[぀-ゟ゠-ヿー・]+$/;
const toHira = (s: string) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** La lecture doit être compatible avec les kana écrits dans la surface (okurigana). */
function readingFits(surface: string, reading: string) {
  const pattern = [...surface]
    .map((ch) => (/[぀-ゟ゠-ヿ]/.test(ch) ? escapeRe(toHira(ch)) : /[㐀-鿿々ヶ]/.test(ch) ? '.+' : escapeRe(ch)))
    .join('')
    .replace(/(\.\+)+/g, '.+');
  return new RegExp(`^${pattern}$`).test(toHira(reading));
}

// ---------- intérêts ----------
const interests = readJson<Interest[]>(join(ROOT, 'interests.json')) ?? [];
const interestIds = new Set(interests.map((i) => i.id));

// ---------- grammaire ----------
const lessons: GrammarLesson[] = [];
for (const level of LEVELS) {
  const dir = join(ROOT, 'grammar', level);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const p = join(dir, f);
    const l = readJson<GrammarLesson>(p);
    if (!l) continue;
    if (l.id !== basename(f, '.json')) err(p, `id "${l.id}" ≠ nom du fichier`);
    if (l.level !== level) err(p, `niveau "${l.level}" ≠ dossier ${level}`);
    for (const k of ['title', 'meaning', 'explanation'] as const) if (!l[k]) err(p, `champ "${k}" manquant`);
    if (!l.structure?.length) err(p, 'structure vide');
    if (!l.examples || l.examples.length < 3) err(p, 'au moins 3 exemples requis');
    lessons.push(l);
  }
}
const lessonIds = new Set(lessons.map((l) => l.id));
const dup = lessons.map((l) => l.id).filter((id, i, a) => a.indexOf(id) !== i);
for (const d of dup) err('grammar', `id dupliqué "${d}"`);

function checkTokens(where: string, tokens: Token[], used: Set<string>) {
  if (!Array.isArray(tokens) || tokens.length === 0) return err(where, 'aucun token');
  tokens.forEach((t, i) => {
    const w = `${where} token ${i} «${t.s}»`;
    if (!t.s) return err(w, 'surface vide');
    if (t.pos && !POS.has(t.pos)) err(w, `pos inconnu "${t.pos}"`);
    if (t.pos === 'punct') return;
    if (!t.gloss) err(w, 'gloss manquant (ou pos "punct" si ponctuation)');
    if (hasKanji(t.s)) {
      if (!t.r) err(w, 'lecture "r" manquante pour un mot avec kanji');
      else if (!KANA_ONLY.test(t.r)) err(w, `lecture "${t.r}" non-kana`);
      else if (!readingFits(t.s, t.r)) err(w, `lecture "${t.r}" incompatible avec la surface`);
    } else if (t.r && t.r !== t.s) warn(w, 'lecture inutile sur un mot sans kanji');
    if (t.base && hasKanji(t.base) && !t.baseR) err(w, `baseR manquant pour "${t.base}"`);
    if (t.baseR && !KANA_ONLY.test(t.baseR)) err(w, `baseR "${t.baseR}" non-kana`);
    for (const g of t.grammar ?? []) {
      if (!lessonIds.has(g)) err(w, `leçon de grammaire inconnue "${g}"`);
      used.add(g);
    }
  });
}

for (const l of lessons) {
  const where = `grammar/${l.level}/${l.id}`;
  l.examples?.forEach((ex, i) => {
    checkTokens(`${where} ex ${i}`, ex.tokens, new Set());
    if (!ex.fr) err(`${where} ex ${i}`, 'traduction manquante');
    if (!ex.tokens?.some((t) => t.grammar?.includes(l.id))) warn(`${where} ex ${i}`, `aucun token ne pointe vers "${l.id}"`);
  });
  for (const r of l.related ?? []) if (!lessonIds.has(r)) warn(where, `related inconnu "${r}"`);
}

// ---------- textes ----------
const textDir = join(ROOT, 'texts');
const metas: TextMeta[] = [];
for (const f of readdirSync(textDir).filter((f) => f.endsWith('.json') && f !== 'index.json')) {
  const p = join(textDir, f);
  const t = readJson<Text>(p);
  if (!t) continue;
  if (t.id !== basename(f, '.json')) err(p, `id "${t.id}" ≠ nom du fichier`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t.date ?? '')) err(p, 'date au format YYYY-MM-DD requise');
  if (!LEVELS.includes(t.level)) err(p, `niveau invalide "${t.level}"`);
  if (!interestIds.has(t.interest)) err(p, `intérêt "${t.interest}" absent de interests.json`);
  for (const k of ['titleFr', 'summary'] as const) if (!t[k]) err(p, `champ "${k}" manquant`);
  if (t.image) {
    if (!t.image.src || !t.image.alt) err(p, 'image : src et alt requis');
    if (/^https?:/.test(t.image.src) && !t.image.credit) err(p, 'image externe : crédit/licence requis');
  }
  const used = new Set<string>();
  checkTokens(`${f} titre`, t.title, used);
  if (!t.paragraphs?.length) err(p, 'aucun paragraphe');
  t.paragraphs?.forEach((para, i) => {
    checkTokens(`${f} §${i}`, para.tokens, used);
    if (!para.fr) err(`${f} §${i}`, 'traduction manquante');
  });
  const grammarUsed = [...used].sort();
  if (JSON.stringify(grammarUsed) !== JSON.stringify(t.grammarUsed)) {
    t.grammarUsed = grammarUsed;
    writeJson(p, t);
  }
  const plain = (tk: Token[]) => tk.map((x) => x.s).join('');
  metas.push({
    id: t.id,
    date: t.date,
    level: t.level,
    interest: t.interest,
    title: plain(t.title ?? []),
    titleFr: t.titleFr,
    summary: t.summary,
    image: t.image,
    grammarUsed,
    chars: (t.paragraphs ?? []).reduce((n, para) => n + plain(para.tokens ?? []).length, 0),
  });
}

// ---------- sortie ----------
metas.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
const order = (l: GrammarLesson) => LEVELS.indexOf(l.level);
const gmetas: GrammarMeta[] = lessons
  .sort((a, b) => order(a) - order(b) || a.id.localeCompare(b.id))
  .map(({ id, level, title, meaning }) => ({ id, level, title, meaning }));

if (warnings.length) console.log(warnings.join('\n'));
if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} erreur(s).`);
  process.exit(1);
}
writeJson(join(textDir, 'index.json'), metas);
writeJson(join(ROOT, 'grammar', 'index.json'), gmetas);
console.log(`✓ ${metas.length} textes, ${gmetas.length} leçons, ${interests.length} centres d'intérêt — index à jour.`);
