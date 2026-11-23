import { useState } from 'preact/hooks';
import { interestById, interestList, texts } from '../lib/content';
import { readTexts } from '../lib/storage';
import { LEVELS } from '../types';

const WEEK = 7 * 24 * 3600 * 1000;

export function Library() {
  const [level, setLevel] = useState<string>('');
  const [interest, setInterest] = useState<string>('');
  const read = readTexts.value;
  const list = texts.filter((t) => (!level || t.level === level) && (!interest || t.interest === interest));
  const usedInterests = interestList.filter((i) => texts.some((t) => t.interest === i.id));

  return (
    <div class="page">
      <h1>
        読む <span class="muted h-sub">Lire</span>
      </h1>
      <div class="chips">
        <button class={!level ? 'chip on' : 'chip'} onClick={() => setLevel('')}>
          Tous
        </button>
        {LEVELS.map((l) => (
          <button key={l} class={level === l ? 'chip on' : 'chip'} onClick={() => setLevel(level === l ? '' : l)}>
            {l}
          </button>
        ))}
      </div>
      <div class="chips">
        {usedInterests.map((i) => (
          <button
            key={i.id}
            class={interest === i.id ? 'chip on' : 'chip'}
            onClick={() => setInterest(interest === i.id ? '' : i.id)}
          >
            {i.emoji} {i.label}
          </button>
        ))}
      </div>

      {list.length === 0 && <p class="muted">Aucun texte pour ce filtre.</p>}
      <div class="cards">
        {list.map((t) => {
          const isRead = read.includes(t.id);
          const isNew = !isRead && Date.now() - new Date(t.date).getTime() < WEEK;
          const it = interestById(t.interest);
          return (
            <a key={t.id} class={`card${isRead ? ' card-read' : ''}`} href={`#/t/${t.id}`}>
              {t.image && <img class="card-img" src={t.image.src} alt={t.image.alt} loading="lazy" />}
              <div class="card-body">
                <div class="card-meta">
                  <span class="pill">{t.level}</span>
                  {it && (
                    <span class="muted">
                      {it.emoji} {it.label}
                    </span>
                  )}
                  {isNew && <span class="pill pill-new">nouveau</span>}
                  {isRead && <span class="muted">✓ lu</span>}
                </div>
                <div class="card-title jp">{t.title}</div>
                <div class="card-sub">{t.titleFr}</div>
                <div class="muted small">{t.summary}</div>
                <div class="muted small">
                  {t.date} · {t.chars} caractères
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
