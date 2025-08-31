# BrainLM - Ancrez vos apprentissages

Une application mobile moderne pour transformer vos contenus quotidiens en actions concrètes grâce à des réflexions structurées.

## 🎯 Concept

BrainLM vous aide à ancrer vos apprentissages en répondant à trois questions clés après chaque contenu consommé :

1. **Qu'est-ce que j'ai appris spécifiquement de ce contenu ?**
2. **En quoi cela est-il important pour moi ?**
3. **Qu'est-ce que je vais faire différemment à cause de ce que je viens d'apprendre ?**

## ✨ Fonctionnalités

### 🎤 Enregistrement vocal
- Enregistrez vos réflexions vocalement
- Transcription automatique (simulation)
- Écoutez et modifiez vos enregistrements

### 📱 Interface mobile-first
- Design adapté aux mobiles
- Navigation intuitive
- Animations fluides

### 🔍 Gestion des réflexions
- Création de nouvelles réflexions
- Modification et suppression
- Historique avec filtres
- Recherche avancée

### 💾 Stockage local
- Sauvegarde automatique dans le navigateur
- Pas de compte requis
- Données privées

## 🚀 Installation et développement

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd BrainLM

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### Scripts disponibles
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run lint         # Linter le code
```

## 🏗️ Architecture

### Technologies utilisées
- **React 18** - Framework frontend
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Framework CSS
- **React Router** - Navigation
- **Lucide React** - Icônes
- **date-fns** - Manipulation des dates

### Structure du projet
```
src/
├── components/          # Composants réutilisables
│   ├── QuestionCard.jsx
│   └── VoiceRecorder.jsx
├── context/            # Context React
│   └── ReflectionContext.jsx
├── hooks/              # Hooks personnalisés
│   └── useVoiceRecorder.js
├── pages/              # Pages de l'application
│   ├── HomePage.jsx
│   ├── NewReflectionPage.jsx
│   ├── ReflectionDetailPage.jsx
│   └── HistoryPage.jsx
├── App.jsx             # Composant principal
├── main.jsx           # Point d'entrée
└── index.css          # Styles globaux
```

## 📱 Fonctionnalités détaillées

### Enregistrement vocal
L'application utilise l'API Web Audio pour l'enregistrement vocal :
- Accès au microphone via `getUserMedia()`
- Enregistrement avec `MediaRecorder`
- Stockage en Blob
- Interface utilisateur intuitive

### Gestion des données
- Context React pour l'état global
- localStorage pour la persistance
- Gestion des erreurs
- Validation des données

### Interface utilisateur
- Design system cohérent
- Composants réutilisables
- Responsive design
- Animations CSS

## 🚀 Déploiement sur Netlify

### Configuration automatique
Le projet est configuré pour un déploiement automatique sur Netlify :

1. Connectez votre repository GitHub à Netlify
2. Configurez les paramètres de build :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
3. Déployez !

### Configuration manuelle
```bash
# Build de production
npm run build

# Le dossier `dist` contient les fichiers à déployer
```

## 🔧 Configuration avancée

### Variables d'environnement
Créez un fichier `.env.local` pour les variables locales :
```env
VITE_APP_TITLE=BrainLM
VITE_APP_VERSION=1.0.0
```

### Personnalisation des couleurs
Modifiez `tailwind.config.js` pour changer la palette de couleurs :
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Vos couleurs personnalisées
      }
    }
  }
}
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [Lucide](https://lucide.dev/) pour les icônes
- [Tailwind CSS](https://tailwindcss.com/) pour le framework CSS
- [date-fns](https://date-fns.org/) pour la manipulation des dates

## 📞 Support

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

---

**BrainLM** - Transformez vos apprentissages en actions concrètes 🚀
