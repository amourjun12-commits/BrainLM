# Guide de déploiement BrainLM sur Netlify

## 🚀 Déploiement automatique

### 1. Préparer le repository
- Assurez-vous que votre code est sur GitHub
- Vérifiez que tous les fichiers sont commités

### 2. Connecter à Netlify
1. Allez sur [netlify.com](https://netlify.com)
2. Cliquez sur "New site from Git"
3. Choisissez votre repository GitHub
4. Configurez les paramètres de build :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
5. Cliquez sur "Deploy site"

### 3. Configuration automatique
Le fichier `netlify.toml` configure automatiquement :
- Les redirections pour le SPA
- Les headers de sécurité
- Le cache des assets
- Les permissions pour le microphone

## 🔧 Configuration manuelle

### Variables d'environnement (optionnel)
Dans les paramètres Netlify, vous pouvez ajouter :
```
NODE_VERSION=18
```

### Domain personnalisé
1. Dans les paramètres du site Netlify
2. Allez dans "Domain management"
3. Ajoutez votre domaine personnalisé

## 📱 Test de l'application

### Fonctionnalités à tester
1. **Navigation** : Vérifiez que toutes les pages fonctionnent
2. **Enregistrement vocal** : Testez l'accès au microphone
3. **Stockage local** : Créez une réflexion et vérifiez qu'elle persiste
4. **Responsive** : Testez sur mobile et desktop

### Problèmes courants
- **Microphone non autorisé** : Vérifiez que le site est en HTTPS
- **Erreurs de build** : Vérifiez les logs de build dans Netlify
- **Problèmes de cache** : Utilisez "Clear cache and deploy" dans Netlify

## 🔄 Mise à jour

### Déploiement automatique
- Chaque push sur la branche principale déclenche un nouveau déploiement
- Les pull requests créent des previews automatiques

### Déploiement manuel
1. Dans le dashboard Netlify
2. Cliquez sur "Deploys"
3. Cliquez sur "Trigger deploy" > "Deploy site"

## 📊 Monitoring

### Analytics Netlify
- Activez les analytics dans les paramètres du site
- Surveillez les performances et l'utilisation

### Logs
- Consultez les logs de build dans l'onglet "Deploys"
- Surveillez les erreurs dans la console du navigateur

## 🔒 Sécurité

Le fichier `netlify.toml` configure automatiquement :
- Headers de sécurité (XSS, CSRF, etc.)
- Permissions strictes pour le microphone
- Cache sécurisé des assets

## 🎯 Optimisations

### Performance
- Les assets sont automatiquement minifiés et compressés
- Le cache est configuré pour une durée optimale
- Le service worker améliore les performances hors ligne

### SEO
- Meta tags optimisés pour mobile
- Manifest PWA configuré
- Structure HTML sémantique

---

**Votre application BrainLM est maintenant prête à être déployée ! 🎉**
