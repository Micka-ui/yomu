import { useState } from 'preact/hooks';
import { grammar } from '../lib/content';
import { settings } from '../lib/storage';
import { LEVELS, type Level } from '../types';

export function Grammar() {
  const [level, setLevel] = useState<Level>((settings.value.defaultLevel as Level) || 'N4');
  const list = grammar.filter((g) => g.level === level);
  return (
    <div class="page">
      <h1>
        文法 <span class="muted h-sub">Grammaire</span>
      </h1>
      <div class="chips">
        {LEVELS.map((l) => (
          <button key={l} class={level === l ? 'chip on' : 'chip'} onClick={() => setLevel(l)}>
            {l} <span class="muted small">{grammar.filter((g) => g.level === l).length}</span>
          </button>
        ))}
      </div>
      {list.length === 0 && (
        <p class="muted">
          Pas encore de leçon {level}. Tu peux en demander une depuis l'onglet <a href="#/generer">Générer</a>.
        </p>
      )}
      <ul class="list">
        {list.map((g) => (
          <li key={g.id}>
            <a href={`#/g/${g.id}`}>
              <span class="jp gram-title">{g.title}</span>
              <div class="muted small">{g.meaning}</div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
