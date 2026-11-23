import { useEffect, useState } from 'preact/hooks';
import { interestList } from '../lib/content';
import { dispatchGeneration, recentRuns, type RunInfo } from '../lib/github';
import { settings } from '../lib/storage';
import { LEVELS } from '../types';

const STATUS: Record<string, string> = {
  queued: '⏳ en attente',
  in_progress: '✍️ Claude écrit…',
  completed: 'terminé',
};

export function Generate() {
  const [type, setType] = useState<'text' | 'grammar'>('text');
  const [interest, setInterest] = useState(interestList.find((i) => i.active)?.id ?? '');
  const [custom, setCustom] = useState('');
  const [level, setLevel] = useState(settings.value.defaultLevel || 'N4');
  const [topic, setTopic] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [runs, setRuns] = useState<RunInfo[]>([]);
  const configured = !!(settings.value.repo && settings.value.token);

  const refresh = () => recentRuns().then(setRuns).catch(() => {});
  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, []);

  const submit = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await dispatchGeneration({
        type,
        level,
        interest: type === 'text' ? (interest === '__custom' ? custom.trim() : interest) : undefined,
        topic: topic.trim() || undefined,
      });
      setMsg({ ok: true, text: 'C\'est parti ! Le nouveau contenu apparaîtra dans quelques minutes (recharge l\'app).' });
      setTopic('');
      setTimeout(refresh, 4000);
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div class="page">
      <h1>
        作る <span class="muted h-sub">Générer</span>
      </h1>
      {!configured && (
        <p class="warn">
          Pour utiliser ce bouton, renseigne d'abord le dépôt et ton jeton GitHub dans <a href="#/reglages">Réglages</a>.
        </p>
      )}
      <div class="form">
        <div class="chips">
          <button class={type === 'text' ? 'chip on' : 'chip'} onClick={() => setType('text')}>
            📖 Un texte
          </button>
          <button class={type === 'grammar' ? 'chip on' : 'chip'} onClick={() => setType('grammar')}>
            🧩 Une leçon de grammaire
          </button>
        </div>

        <label>Niveau</label>
        <div class="chips">
          {LEVELS.map((l) => (
            <button key={l} class={level === l ? 'chip on' : 'chip'} onClick={() => setLevel(l)}>
              {l}
            </button>
          ))}
        </div>

        {type === 'text' && (
          <>
            <label>Centre d'intérêt</label>
            <div class="chips">
              {interestList
                .filter((i) => i.active)
                .map((i) => (
                  <button key={i.id} class={interest === i.id ? 'chip on' : 'chip'} onClick={() => setInterest(i.id)}>
                    {i.emoji} {i.label}
                  </button>
                ))}
              <button class={interest === '__custom' ? 'chip on' : 'chip'} onClick={() => setInterest('__custom')}>
                ＋ Autre…
              </button>
            </div>
            {interest === '__custom' && (
              <input
                placeholder="ex. astronomie, cyclisme, musique de jeux vidéo…"
                value={custom}
                onInput={(e) => setCustom((e.target as HTMLInputElement).value)}
              />
            )}
          </>
        )}

        <label>{type === 'text' ? 'Sujet précis (facultatif)' : 'Point de grammaire voulu (facultatif)'}</label>
        <input
          placeholder={type === 'text' ? 'ex. l\'histoire de la Famicom, les tanuki dans le folklore…' : 'ex. 〜ばかり, 〜わけではない… (vide = au choix)'}
          value={topic}
          onInput={(e) => setTopic((e.target as HTMLInputElement).value)}
        />

        <button
          class="btn btn-primary wide"
          disabled={!configured || busy || (type === 'text' && interest === '__custom' && !custom.trim())}
          onClick={submit}
        >
          {busy ? 'Envoi…' : type === 'text' ? '✨ Demander un nouveau texte' : '✨ Demander une leçon'}
        </button>
        {msg && <p class={msg.ok ? 'ok' : 'warn'}>{msg.text}</p>}
      </div>

      {runs.length > 0 && (
        <section class="section">
          <h2>Dernières demandes</h2>
          <ul class="list">
            {runs.map((r) => (
              <li key={r.id}>
                <a href={r.html_url} target="_blank" rel="noreferrer">
                  {r.display_title}
                  <div class="muted small">
                    {new Date(r.created_at).toLocaleString('fr-FR')} ·{' '}
                    {r.status === 'completed' ? (r.conclusion === 'success' ? '✅ ajouté' : `❌ ${r.conclusion}`) : STATUS[r.status] ?? r.status}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
