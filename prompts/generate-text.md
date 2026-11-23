# Générer un texte de lecture

1. **Contexte** : lis `content/interests.json` et `content/texts/index.json` (titres, niveaux,
   intérêts des textes existants) et `content/grammar/index.json` (leçons disponibles).
2. **Intérêt** : si l'intérêt demandé est un id existant, utilise-le. Si c'est un texte libre qui
   ne correspond à aucun id, ajoute une entrée à `interests.json` (id en kebab-case sans accents,
   emoji pertinent, `active: true`). Si aucun intérêt n'est donné, choisis un intérêt actif
   différent de celui des 2 derniers textes.
3. **Sujet** : un sujet concret, curieux, qui donne envie de lire (une anecdote, une histoire,
   une personne, une invention, un objet…), **différent des textes existants**. Pas d'actualité
   brûlante. Vérifie les faits avec WebSearch.
4. **Calibrage par niveau** :
   | Niveau | Paragraphes | Caractères ≈ | Kanji / grammaire |
   |---|---|---|---|
   | N5 | 3 | 150–220 | kanji N5, forme polie, phrases courtes |
   | N4 | 3–4 | 220–320 | kanji N5–N4, ～て/～たら/passif/potentiel… |
   | N3 | 4 | 280–420 | kanji jusqu'à N3, forme neutre possible, connecteurs |
   | N2 | 4–5 | 400–600 | style écrit, vocabulaire abstrait |
   | N1 | 4–6 | 500–800 | style journalistique/essai |
   Réutilise de préférence des points de grammaire déjà enseignés ; vise 3 à 6 points du niveau
   (ou du niveau juste en dessous) marqués avec `grammar`.
5. **Leçons manquantes** : si le texte utilise un point de grammaire important du niveau qui n'a
   pas encore de leçon, crée-la en suivant `prompts/generate-grammar.md` (1 à 2 leçons max).
6. **Écris** `content/texts/<date du jour>-<slug>.json` (date via `date +%F`) avec : `title` (tokens),
   `titleFr`, `summary` (1 phrase FR qui donne envie, sans tout dévoiler), `paragraphs`
   (`tokens` + `fr` : traduction naturelle et fidèle), `grammarUsed: []` (rempli par validate).
7. Lance `npm run validate` et corrige jusqu'à ce qu'il n'y ait **plus aucune erreur**.
8. Relis chaque lecture `r` : c'est l'erreur la plus fréquente (lectures on/kun, rendaku, 一日 = ついたち…).
