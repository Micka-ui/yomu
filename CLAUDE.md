# Yomu — lecteur japonais personnel

App statique (Vite + Preact + TS, PWA) hébergée sur GitHub Pages. Elle sert des textes japonais
**pré-annotés mot par mot** et des leçons de grammaire JLPT. Lecteur : francophone, niveau ~N4
(grammaire) / N3 (lecture encore fragile). Toutes les explications sont **en français**.

## Commandes
- `npm run dev` : serveur local
- `npm run validate` : valide `content/` et régénère les index (**à lancer après toute modif de contenu**)
- `npm run build` : validate + typecheck + build

## Contenu (`content/`)
- `interests.json` : centres d'intérêt `{ id, label, emoji, description, active }`
- `texts/<YYYY-MM-DD>-<slug>.json` : un texte (le nom de fichier = `id`)
- `grammar/<N5..N1>/<id>.json` : une leçon (id du type `n3-wake-da`)
- `texts/index.json`, `grammar/index.json` : **générés** par `npm run validate`, ne pas éditer

Les types font foi : `src/types.ts`. Regarde un fichier existant avant d'en écrire un nouveau
(ex. `content/texts/2026-11-23-shinkansen.json`, `content/grammar/N3/n3-to-shite.json`).

### Règles de découpage en tokens (`Token`)
- Un token = un mot tel qu'il apparaît. Verbes et adjectifs **conjugués restent en un seul token**
  (`発売されました`), avec `base` / `baseR` = forme du dictionnaire (`発売する` / `はつばいする`).
  Exception : on sépare un auxiliaire qui porte un point de grammaire (`やって` + `しまった`,
  `見られる` + `ようになった`) pour pouvoir lui attacher `grammar`.
- `r` = lecture **en hiragana** de la surface, obligatoire si la surface contient un kanji, absente sinon.
  Elle doit être cohérente avec les kana de la surface (`食べた` → `たべた`).
- Les nombres en chiffres sont des tokens séparés de leur compteur : `1983` (`pos: number`) + `年` (`ねん`).
- Ponctuation : `{ "s": "。", "pos": "punct" }` (plusieurs signes collés possibles : `"、「"`).
- `pos` ∈ noun, verb, i-adj, na-adj, adv, particle, aux, conj, counter, expr, name, pron, prefix,
  suffix, number, interj, punct.
- `gloss` : sens **en contexte**, en français, court. `note` : explication utile (conjugaison, nuance).
- `grammar` : ids de leçons existantes. Ne référence qu'une leçon qui existe (sinon crée-la).
- Particules : gloss adapté au rôle dans la phrase. Le `で` copule (forme liée de だ) a `pos: aux`, `base: だ`.

### Qualité
- Faits **vérifiés** (WebSearch si besoin). Pas d'invention de dates, chiffres ou citations ;
  si incertain, formuler avec `〜と言われている` / `〜らしい` ou retirer.
- Contenu **original** : ne recopie pas de textes ni d'exemples de Satori Reader, NHK, manuels, etc.
- Images : seulement si libre de droits (Wikimedia Commons, domaine public / CC) avec `credit`
  indiquant auteur + licence ; sinon pas d'image.
