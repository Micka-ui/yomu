import { settings, savedWords, knownWords, readTexts, type FuriganaMode } from '../lib/storage';
import { LEVELS } from '../types';

export function Settings() {
  const s = settings.value;
  const set = (patch: Partial<typeof s>) => (settings.value = { ...s, ...patch });
  return (
    <div class="page">
      <h1>
        設定 <span class="muted h-sub">Réglages</span>
      </h1>
      <div class="form">
        <label>Furigana</label>
        <div class="chips">
          {(
            [
              ['all', 'Toujours'],
              ['unknown', 'Sauf mots « connus »'],
              ['none', 'Jamais'],
            ] as [FuriganaMode, string][]
          ).map(([v, l]) => (
            <button key={v} class={s.furigana === v ? 'chip on' : 'chip'} onClick={() => set({ furigana: v })}>
              {l}
            </button>
          ))}
        </div>

        <label class="check">
          <input
            type="checkbox"
            checked={s.showTranslations}
            onChange={(e) => set({ showTranslations: (e.target as HTMLInputElement).checked })}
          />
          Afficher toutes les traductions par défaut
        </label>

        <label>Niveau par défaut</label>
        <div class="chips">
          {LEVELS.map((l) => (
            <button key={l} class={s.defaultLevel === l ? 'chip on' : 'chip'} onClick={() => set({ defaultLevel: l })}>
              {l}
            </button>
          ))}
        </div>

        <h2>Connexion GitHub (bouton Générer)</h2>
        <label>Dépôt (propriétaire/nom)</label>
        <input value={s.repo} placeholder="moncompte/yomu" onInput={(e) => set({ repo: (e.target as HTMLInputElement).value.trim() })} />
        <label>Jeton d'accès (fine-grained, Actions : lecture/écriture sur ce dépôt uniquement)</label>
        <input
          type="password"
          value={s.token}
          placeholder="github_pat_…"
          onInput={(e) => set({ token: (e.target as HTMLInputElement).value.trim() })}
        />
        <p class="muted small">Le jeton reste uniquement sur cet appareil (stockage local du navigateur).</p>

        <h2>Données</h2>
        <p class="muted small">
          {savedWords.value.length} mots sauvegardés · {knownWords.value.length} mots connus · {readTexts.value.length} textes lus
        </p>
        <button
          class="btn"
          onClick={() => {
            const blob = new Blob(
              [JSON.stringify({ words: savedWords.value, known: knownWords.value, read: readTexts.value }, null, 2)],
              { type: 'application/json' },
            );
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'yomu-sauvegarde.json';
            a.click();
          }}
        >
          Exporter ma progression
        </button>
      </div>
    </div>
  );
}
