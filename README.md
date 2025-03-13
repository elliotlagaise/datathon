
# Projet Power Charge

## Présentation

Le projet Power Charge vise à déterminer les meilleurs emplacements pour l'installation de bornes de recharge électrique dans les 20 plus grandes villes françaises. Ce projet a été réalisé par :

- Arbal Pierre
- Hayez Rémy
- Lagaise Elliot
- Servaege Ambre
- Noulet Clarisse

## Sommaire

- [Reformulation de la problématique](#reformulation-de-la-problématique)
- [MOSCOW](#moscow)
- [Schéma d'architecture](#schéma-d'architecture)
- [Récupération des données](#récupération-des-données)
- [Traitement des données](#traitement-des-données)
- [Traitement des données - Cartographie](#traitement-des-données---cartographie)
- [Traitement des données - Machine Learning](#traitement-des-données---machine-learning)
- [Problèmes rencontrés](#problèmes-rencontrés)
- [Améliorations](#améliorations)

## Reformulation de la problématique

La problématique initiale était de savoir comment identifier les potentielles implantations de hubs de recharge de batteries dans les 20 premières agglomérations françaises. La nouvelle problématique est de déterminer les meilleurs emplacements pour l'installation de bornes de recharge électrique dans les 20 plus grandes villes françaises.

## MOSCOW

| Must have this | - Récolter des données Enedis <br> - Faire les objectifs SMART <br> - Liste des parcelles qui rentrent dans le scoring <br> - Graphique avec un listing des entreprises de BTP <br> - Filtrage selon les critères <br> - Catégoriser les compromis fait <br> - Définir les 20 plus grandes villes de France <br> - Utilisation des jeux de données |
| :--: | :--: |
| Should have this if possible | - Possible réflexion sur d'autres critères <br> - Faire une couleur différente par parcelle avec des infobulles par parcelle <br> - Définir le nombre d'implantation par ville |
| Could have this if it does not affect anything else | - Listing des vendeurs et des concepteurs d'engins <br> - Détermination de la consommation électrique des hubs <br> - Corrélation avec la constructibilité du terrain <br> - Affinage de la proximité des différents réseaux |
| Would like but won't get time | - Définir un budget par constructions de borne de recharge <br> - Analyse prédictive des besoins de borne de chargement <br> - Estimer l'accessibilité des hubs <br> - Analyse de pics d'activité de l'utilisation des hubs |

## Schéma d'architecture

Le schéma d'architecture du projet est structuré comme suit :

- **Sources des données** : Bases de données XLS et API open sources
- **Transformation des données** : Extract, Load, Transform
- **Stockage** : JSON
- **Analyse Visualisation** : Dashboard BI, Graphiques, Modèle de prédiction

## Récupération des données

Nous avons récupéré les données d'ENEDIS, les données des cadastres pour chaque région et département, ainsi que les différentes données pour Strasbourg et ses environs. Nous avons utilisé des API pour obtenir des données fraîches et automatisées sur les axes autoroutiers, les réseaux électriques, les cadastres, et les parcelles disponibles dans les grandes villes.

## Traitement des données

Les données ont été filtrées pour ne garder que les informations intéressantes selon les critères définis, comme un terrain de minimum 4000 m². Nous avons également supprimé les colonnes erronées et les données inutiles.

## Traitement des données - Cartographie

Une cartographie interactive des différentes parcelles utilisables a été créée. La carte en HTML permet de sélectionner des critères en filtre, comme le scoring souhaité, la ville, ou la taille de la parcelle. Un bouton d'actualisation des données a été implémenté pour mettre à jour la carte.

## Traitement des données - Machine Learning

Le machine learning a permis de triangulariser les différentes sources de données et d'afficher un score de précision de 98%. Ce modèle permet d'automatiser le calcul du scoring en cas d'ajout de nouvelles données.

## Problèmes rencontrés

Nous avons rencontré plusieurs problèmes, notamment :
- Téléchargement de nombreux jeux de données (plusieurs millions de lignes)
- Données mal structurées et trop de villes à gérer
- Difficulté à identifier les zones urbaines avec des coordonnées précises

## Améliorations

Nous proposons les améliorations suivantes pour un éventuel lot 2 du projet :
- Amélioration du modèle de machine learning
- Meilleur cleaning des données
- Ajout des informations sur les vendeurs et les concepteurs
- Corrélation avec la constructibilité du terrain
- Internalisation des sources de données

## Lancement de l'application

Pour lancer l'application, exécutez les commandes suivantes dans le terminal :

```bash
npm install
npm start RECPA_file.py
```

Cela démarrera l'application principale du projet Power Charge.
