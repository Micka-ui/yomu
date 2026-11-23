import { settings, type FuriganaMode } from '../lib/storage';

const LABELS: Record<FuriganaMode, string> = { all: 'ふりがな : tout', unknown: 'ふりがな : inconnus', none: 'ふりがな : non' };
const NEXT: Record<FuriganaMode, FuriganaMode> = { all: 'unknown', unknown: 'none', none: 'all' };

export function FuriganaToggle() {
  const m = settings.value.furigana;
  return (
    <button class="chip" onClick={() => (settings.value = { ...settings.value, furigana: NEXT[m] })}>
      {LABELS[m]}
    </button>
  );
}
