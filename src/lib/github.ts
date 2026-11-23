import { settings } from './storage';

export interface GenerateRequest {
  type: 'text' | 'grammar';
  interest?: string;
  level: string;
  /** Précision libre (sujet précis, point de grammaire voulu…). */
  topic?: string;
}

const WORKFLOW = 'generate.yml';

function headers() {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${settings.value.token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export async function dispatchGeneration(req: GenerateRequest): Promise<void> {
  const { repo, token } = settings.value;
  if (!repo || !token) throw new Error('Renseigne le dépôt et le jeton GitHub dans Réglages.');
  const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/${WORKFLOW}/dispatches`, {
    method: 'POST',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ref: 'main',
      inputs: {
        type: req.type,
        interest: req.interest ?? '',
        level: req.level,
        topic: req.topic ?? '',
      },
    }),
  });
  if (res.status !== 204) {
    const body = await res.text();
    throw new Error(`GitHub a répondu ${res.status} : ${body.slice(0, 200)}`);
  }
}

export interface RunInfo {
  id: number;
  status: string; // queued | in_progress | completed
  conclusion: string | null; // success | failure | …
  created_at: string;
  html_url: string;
  display_title: string;
}

export async function recentRuns(): Promise<RunInfo[]> {
  const { repo, token } = settings.value;
  if (!repo || !token) return [];
  const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/${WORKFLOW}/runs?per_page=5`, {
    headers: headers(),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.workflow_runs as RunInfo[];
}
