import { useEffect, useState } from 'preact/hooks';
import type { GrammarLesson } from '../types';
import { grammarMeta, loadLesson, textsUsingGrammar } from '../lib/content';
import { TokenText } from '../components/TokenText';
import { FuriganaToggle } from '../components/FuriganaToggle';
import { Markdown } from '../lib/markdown';

export function Lesson({ id }: { id: string }) {
  const [lesson, setLesson] = useState<GrammarLesson | null | undefined>(undefined);
  const [shown, setShown] = useState<Set<number>>(new Set());
  useEffect(() => {
    setShown(new Set());
    loadLesson(id).then((l) => setLesson(l ?? null));
    window.scrollTo(0, 0);
  }, [id]);
  if (lesson === undefined) return <div class="page muted">Chargement…</div>;
  if (lesson === null) return <div class="page">Leçon introuvable. <a href="#/grammaire">Retour</a></div>;
  const inTexts = textsUsingGrammar(id);
  const toggle = (i: number) => {
    const n = new Set(shown);
    n.has(i) ? n.delete(i) : n.add(i);
    setShown(n);
  };

  return (
    <div class="page lesson">
      <div class="toolbar">
        <a href="#/grammaire" class="back">
          ← Grammaire
        </a>
        <FuriganaToggle />
      </div>
      <span class="pill">{lesson.level}</span>
      <h1 class="jp lesson-title">{lesson.title}</h1>
      <div class="lesson-meaning">{lesson.meaning}</div>

      <section class="section">
        <h2>Construction</h2>
        {lesson.structure.map((s, i) => (
          <div class="structure jp" key={i}>
            {s}
          </div>
        ))}
      </section>

      <section class="section prose">
        <h2>Explication</h2>
        <Markdown text={lesson.explanation} />
      </section>

      {lesson.nuances && lesson.nuances.length > 0 && (
        <section class="section prose">
          <h2>À retenir</h2>
          <ul>
            {lesson.nuances.map((n, i) => (
              <li key={i}>
                <Markdown text={n} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section class="section">
        <h2>Exemples</h2>
        {lesson.examples.map((ex, i) => (
          <div class="example" key={i}>
            <div>
              <TokenText tokens={ex.tokens} large />
            </div>
            <button class="tr-btn" onClick={() => toggle(i)}>
              {shown.has(i) ? '▾ Traduction' : '▸ Traduction'}
            </button>
            {shown.has(i) && <div class="tr">{ex.fr}</div>}
          </div>
        ))}
      </section>

      {lesson.related && lesson.related.length > 0 && (
        <section class="section">
          <h2>Voir aussi</h2>
          <ul class="list">
            {lesson.related.map((r) => {
              const m = grammarMeta(r);
              return m ? (
                <li key={r}>
                  <a href={`#/g/${r}`}>
                    <span class="jp">{m.title}</span> <span class="pill small">{m.level}</span>
                    <div class="muted small">{m.meaning}</div>
                  </a>
                </li>
              ) : null;
            })}
          </ul>
        </section>
      )}

      {inTexts.length > 0 && (
        <section class="section">
          <h2>Dans tes textes</h2>
          <ul class="list">
            {inTexts.map((t) => (
              <li key={t.id}>
                <a href={`#/t/${t.id}`}>
                  <span class="jp">{t.title}</span> <span class="pill small">{t.level}</span>
                  <div class="muted small">{t.titleFr}</div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
