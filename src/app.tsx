import { useEffect, useState } from 'preact/hooks';
import { Library } from './views/Library';
import { Reader } from './views/Reader';
import { Grammar } from './views/Grammar';
import { Lesson } from './views/Lesson';
import { Words } from './views/Words';
import { Generate } from './views/Generate';
import { Settings } from './views/Settings';
import { WordSheet, selected } from './components/WordSheet';

function useHash() {
  const [hash, setHash] = useState(location.hash.slice(1) || '/');
  useEffect(() => {
    const on = () => {
      setHash(location.hash.slice(1) || '/');
      selected.value = null;
    };
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return hash;
}

const TABS = [
  { href: '#/', match: ['/', '/t/'], icon: '読', label: 'Lire' },
  { href: '#/grammaire', match: ['/grammaire', '/g/'], icon: '文', label: 'Grammaire' },
  { href: '#/mots', match: ['/mots'], icon: '単', label: 'Mots' },
  { href: '#/generer', match: ['/generer'], icon: '＋', label: 'Générer' },
  { href: '#/reglages', match: ['/reglages'], icon: '⚙', label: 'Réglages' },
];

export function App() {
  const path = useHash();
  let view;
  if (path.startsWith('/t/')) view = <Reader id={decodeURIComponent(path.slice(3))} />;
  else if (path.startsWith('/g/')) view = <Lesson id={decodeURIComponent(path.slice(3))} />;
  else if (path === '/grammaire') view = <Grammar />;
  else if (path === '/mots') view = <Words />;
  else if (path === '/generer') view = <Generate />;
  else if (path === '/reglages') view = <Settings />;
  else view = <Library />;

  const active = (m: string[]) => m.some((x) => (x.endsWith('/') && x !== '/' ? path.startsWith(x) : path === x));

  return (
    <>
      <main>{view}</main>
      <WordSheet />
      <nav class="tabbar">
        {TABS.map((t) => (
          <a key={t.href} href={t.href} class={active(t.match) ? 'tab on' : 'tab'}>
            <span class="tab-icon">{t.icon}</span>
            <span class="tab-label">{t.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
