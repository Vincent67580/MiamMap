# 🍔 MiamMap

**MiamMap** est une application web interactive haute performance développée en React (Vite) permettant de rechercher, filtrer et géolocaliser des restaurants en temps réel grâce aux données libres d'**OpenStreetMap** (Nominatim et Overpass API).

![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=flat-square&logo=vite&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-Mapping-199900?style=flat-square&logo=leaflet&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)

---

## ✨ Fonctionnalités principales

- **Recherche par adresse ou ville :** Géocodage précis via l'API Nominatim d'OpenStreetMap.
- **Géolocalisation en un clic :** Trouvez instantanément les restaurants situés autour de votre position actuelle.
- **Requêtes Overpass résilientes :** Interrogation simultanée (`Promise.any`) de plusieurs serveurs miroirs Overpass en méthode `POST` pour contourner les blocages CORS et optimiser la vitesse.
- **Capture complète des données :** Récupération intelligente des `nodes` et des `ways` (bâtiments) pour ne rater aucun établissement.
- **Rayon de recherche dynamique :** Ajustez le périmètre de recherche (de 1 km à 20 km) avec un zoom automatique adapté sur la carte.
- **Filtres par type de cuisine :** Filtrage instantané côté client après le chargement des données.
- **Détails riches :** Affichage des horaires d'ouverture, contacts téléphoniques, site web et badges d'accessibilité (PMR, terrasse).
- **Mode sombre natif & Design system :** Interface moderne, responsive et élégante s'adaptant aux préférences du système.

---

## 🛠️ Stack technique

- **Front-end :** React, Vite, JavaScript (ES6+)
- **Cartographie :** Leaflet & React-Leaflet
- **APIs & Données :** 
  - *Nominatim API* (Recherche de lieux)
  - *Overpass API / OpenStreetMap* (Extraction des restaurants)
- **Style :** CSS personnalisé avec variables globales (`:root` / Dark mode support)

---

## 🚀 Installation et lancement en local

Suivez ces étapes pour exécuter le projet sur votre machine :

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/ton-nom-d-utilisateur/MiamMap.git
   cd MiamMap
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```

4. **Ouvrir l'application :**
   Rendez-vous sur l'adresse indiquée dans votre terminal (généralement `http://localhost:5173`).

---

## 📂 Structure du projet

```text
miam-map/
├── public/               # Ressources statiques
├── src/
│   ├── components/       # Composants React (SearchBar, RestaurantList, MapView, Spinner...)
│   ├── services/         # Appels API (Nominatim & Overpass)
│   ├── styles/           # Feuilles de style CSS spécifiques
│   ├── App.jsx           # Composant principal et gestion d'état
│   ├── App.css           # Styles globaux de l'application
│   └── main.jsx          # Point d'entrée React
├── package.json
└── README.md
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une *issue* ou à proposer une *pull request* pour améliorer l'application.

---

## 📄 Licence

Ce projet est sous licence **MIT**. Libre à vous de l'utiliser et de le modifier.