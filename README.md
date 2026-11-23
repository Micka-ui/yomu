# Yomu 読む

Textes japonais courts sur **tes** centres d'intérêt, annotés mot par mot (lecture, sens, grammaire),
et leçons de grammaire JLPT N5→N1. Un bouton « Générer » demande à Claude Code (dans GitHub Actions)
d'ajouter un texte ou une leçon.

## En local
```bash
npm install
npm run dev        # http://localhost:5173
npm run validate   # vérifie le contenu
```

## Mise en ligne (une seule fois)
1. Crée un dépôt GitHub (privé ou public) nommé par ex. `yomu`, puis :
   ```bash
   git remote add origin https://github.com/<toi>/yomu.git
   git push -u origin main
   ```
2. **Settings → Pages → Source : GitHub Actions**. L'app sera sur `https://<toi>.github.io/yomu/`.
   (Pages sur un dépôt privé nécessite GitHub Pro ; sinon mets le dépôt en public.)
3. **Jeton Claude** : sur un PC avec Claude Code, lance `claude setup-token`, puis ajoute le jeton
   dans **Settings → Secrets and variables → Actions → New secret** sous le nom
   `CLAUDE_CODE_OAUTH_TOKEN`.
4. **Jeton pour le bouton** : GitHub → Settings → Developer settings → *Fine-grained tokens* →
   accès **uniquement à ce dépôt**, permission **Actions : Read and write**. Colle-le dans
   l'onglet Réglages de l'app sur ton téléphone (il reste stocké sur l'appareil).
5. Sur le téléphone, ouvre l'URL puis « Ajouter à l'écran d'accueil ».

Sans le bouton, tu peux aussi lancer **Actions → Générer du contenu → Run workflow** depuis
l'app GitHub mobile.

## Rythme
Pas de génération automatique par défaut. Pour un texte chaque lundi, décommente le bloc
`schedule` dans `.github/workflows/generate.yml`.
