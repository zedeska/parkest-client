# 🚗 Parkest - Application de Gestion de Parking

Parkest est une application web et mobile (PWA/Android) permettant de localiser des places de parking en fonction de critères spécifiques (PMR, bornes électriques, gratuité). 



---

## 🚀 Architecture du Projet

L'application repose sur une architecture **Full-Stack** moderne :

* **Front-end :** Développé avec **Svelte 5** et **Tailwind CSS**. Hébergé sur **Vercel**.
* **Back-end :** API REST construite avec **Node.js** et **Express**. Hébergée sur **Render**.
* **Base de données :** **MongoDB Atlas** (NoSQL) pour le stockage des utilisateurs et de leurs préférences.
* **Mobile :** Porté sur Android via **Capacitor**.
  
[🚀 Accéder à l'API sur GitHub](https://github.com/capitainekiwi88-glitch/parking-api)
---

## 🛠️ Configuration et Installation

### Pré-requis (Développeur)
* Node.js installé
* Un compte MongoDB Atlas
* Android Studio (pour la partie APK)

### Installation du Serveur (API)
1. Aller dans le dossier serveur.
2. Installer les dépendances : `npm install`
3. Créer une variable d'environnement `MONGO_URI` sur Render (ou un fichier `.env` en local).
4. Lancer le serveur : `node server.js`

### Installation du Client (Interface)
1. Aller dans le dossier client.
2. Installer les dépendances : `npm install`
3. Lancer le mode développement : `npm run dev`

---

## 📱 Déploiement Mobile (Android)

Pour générer l'APK avec Capacitor :

1.  **Build du projet :** `npm run build`
2.  **Synchronisation :** `npx cap sync`
3.  **Ouverture Android Studio :** `npx cap open android`
4.  **Génération :** `Build > Build APK(s)`

---

## 🔒 Sécurité et Variables d'Environnement

Le projet utilise des variables d'environnement pour protéger les données sensibles.
> **Important :** Ne jamais pousser le lien de connexion MongoDB (`mongodb+srv://...`) directement dans le code GitHub. Utilisez toujours `process.env.MONGO_URI`.

---

## 🗺️ Fonctionnalités Actuelles
- [x] Inscription et Connexion sécurisées.
- [x] Carte interactive avec géolocalisation.
- [x] Filtres personnalisés (PMR, Électrique, Gratuit).
- [x] Sauvegarde des préférences utilisateur en base de données.
- [x] Interface responsive et adaptée aux encoches mobiles (Safe Areas).

---

## 📝 À Savoir (Notes Techniques)
* **Cold Start :** Sur Render (version gratuite), l'API peut mettre 30 secondes à répondre lors de la première requête après une inactivité.
* **CORS :** L'API est configurée pour accepter les requêtes provenant du domaine Vercel.
* **Permissions :** La géolocalisation nécessite une connexion HTTPS (fournie par Vercel) pour fonctionner sur navigateur mobile.


