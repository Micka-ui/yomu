# Générer une leçon de grammaire

Format inspiré des bonnes fiches de grammaire (structure claire, nuances, beaucoup d'exemples),
mais **contenu entièrement original**.

1. Lis `content/grammar/index.json`. Si un point précis est demandé et existe déjà, enrichis la
   leçon existante (exemples, nuances) au lieu d'en créer une autre.
2. Sinon, choisis un point **important et fréquent** du niveau demandé qui n'existe pas encore,
   en priorité un point déjà rencontré dans les textes (`content/texts/*.json`).
3. Écris `content/grammar/<niveau>/<id>.json` (`id` = `n4-te-oku`, `n3-wake-da`… en romaji) :
   - `title` : la forme (`〜わけだ`), `meaning` : sens en une ligne
   - `structure` : 1 à 4 schémas de construction (`Verbe (forme neutre) + わけだ`)
   - `explanation` : 2 à 4 paragraphes en français. Markdown léger autorisé : `**gras**`,
     `` `japonais` `` (surligné), listes `- `. Explique *quand* et *pourquoi* on l'utilise.
   - `nuances` : pièges, registre, confusions fréquentes (facultatif)
   - `examples` : **3 à 5 phrases** naturelles, variées, au vocabulaire du niveau, tokenisées
     comme les textes. Au moins un token par exemple porte `grammar: ["<id>"]`.
   - `related` : ids de leçons proches existantes
4. `npm run validate` jusqu'à zéro erreur.
