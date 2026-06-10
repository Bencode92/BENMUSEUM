# BENMUSEUM — Document global d'optimisation pour l'apprentissage dynamique
### Référence complète : état du projet, architecture, contenu, stratégie pédagogique et feuille de route détaillée
*Rédigé par Claude. Document autonome : il contient tout le contexte nécessaire pour comprendre et faire évoluer le projet.*

---

## SOMMAIRE
1. Vision et résumé du projet
2. Historique : comment on en est arrivé là
3. Architecture technique (fichiers, données, app, déploiement)
4. Inventaire complet du contenu (27 chapitres, 22 dossiers, 214 images)
5. La philosophie d'apprentissage
6. Les 5 fonctions à optimiser (en détail)
7. Science cognitive appliquée
8. Spécifications détaillées des fonctionnalités à venir
9. Feuille de route priorisée
10. Conventions & mode d'emploi pour faire évoluer le projet
11. Recommandation finale (l'avis de Claude)

---

## 1. VISION ET RÉSUMÉ DU PROJET

**BENMUSEUM** est une plateforme web personnelle (non commerciale) pour **apprendre l'histoire de l'art** en suivant fidèlement la structure du livre de référence **E. H. Gombrich, *Histoire de l'art* (*The Story of Art*)** et ses 27 chapitres.

**Objectif déclaré par l'utilisateur :** que ce soit *un lieu de découverte, de discussion, d'archivage et de référence*. On lit, on pose des questions, l'IA répond, on ajoute des notes qui enrichissent les fiches, on fait des QCM, on met en favori artistes et œuvres.

- **En ligne :** https://bencode92.github.io/BENMUSEUM/
- **Dépôt :** https://github.com/Bencode92/BENMUSEUM
- **Hébergement :** GitHub Pages (statique, gratuit).
- **Pile :** HTML + CSS + JavaScript pur (zéro build, zéro framework) ; Node.js pour le serveur IA local optionnel ; API Wikimedia pour les images (domaine public).

---

## 2. HISTORIQUE : COMMENT ON EN EST ARRIVÉ LÀ

Le projet a beaucoup pivoté ; comprendre ce chemin évite de refaire les mêmes détours.

1. **Départ — musée 3D première personne** (Three.js) : impressionnant mais **lourd à maintenir** (~600 lignes de WebGL fragile) et **mauvais pour apprendre** (la 3D ralentit). Plusieurs itérations (grotte procédurale pour la préhistoire, éclairage, ambiances). **Abandonné et archivé** dans `archive/`.
2. **Pivot — plateforme d'apprentissage 2D** : pilotée par le contenu, maintenable (tout en JSON).
3. **Structure Gombrich** : adoption des **27 chapitres** comme colonne vertébrale (titre FR + EN, portée, page, idée centrale).
4. **Index des artistes par chapitre** : 161 entrées (★ central / ○ secondaire) + notion de chaque chapitre, cochables (suivi local).
5. **Dossiers riches** : l'utilisateur fournit des fichiers `.md` structurés (un par grande période). Ingérés en **22 dossiers** couvrant les 27 chapitres.
6. **Favoris + Notes** : étoiles sur œuvres/artistes/dossiers/chapitres ; notes qui « agrandissent » les fiches ; bouton « + Ajouter aux notes » sur les réponses du guide IA.
7. **Images enregistrées** : manifeste `data/images.json` (214/217 images résolues via Wikimedia, avec format/dimensions).
8. **Parcours (fil rouge)** : page narrative accessible (6 actes) + bloc « Le fil » sur chaque chapitre.

**Leçon transversale :** chaque fois qu'on a voulu « plus immersif » ou « plus joli » (3D, ambiances), c'était coûteux et peu utile à l'apprentissage. Chaque fois qu'on a investi dans **le contenu structuré et la navigation**, c'était payant.

---

## 3. ARCHITECTURE TECHNIQUE

### 3.1 Arborescence
```
musee-art/
├── index.html              # coquille : header (onglets), rail des chapitres, zone de vue
├── css/app.css             # tout le style
├── js/app.js               # toute la logique (SPA à routage par hash)
├── data/
│   ├── art.json            # 27 chapitres : idée, notion, roster ★/○, œuvres en fiche
│   ├── dossiers.json       # 22 dossiers riches (modules d'apprentissage complets)
│   └── images.json         # manifeste : titre Wikipédia → URL image + format
├── server.js               # mini-serveur Node : sert le site + proxy IA /api/ask (clé côté serveur)
├── package.json            # type:module, script start
├── docs/optimisation-apprentissage.md   # CE document
├── archive/                # ancien musée 3D (non maintenu)
├── sources/                # dépôt des .md fournis avant ingestion
└── README.md
```

### 3.2 Modèle de données — `data/art.json`
```jsonc
{
  "chapitres": [
    {
      "num": 12,
      "titre": "La conquête de la réalité",   // FR
      "titre_en": "The Conquest of Reality",
      "portee": "Le début du XVe siècle",       // ce que le chapitre couvre
      "page": 161,                               // page dans Gombrich
      "couleur": "#3f9a6a",
      "idee": "…",                               // thèse centrale du chapitre
      "notion": "La perspective + le réalisme.", // la notion-clé
      "dossier": "renaissance",                  // id du dossier détaillé (si existe)
      "roster": [                                 // l'index « qui/quoi couvre ce chapitre »
        { "nom": "Van Eyck", "niveau": "★", "detail": "conquête par l'huile (Nord)" }
      ],
      "oeuvres": [                                // œuvres en fiche
        { "titre": "…", "wiki": "Arnolfini Portrait", "artiste": "Van Eyck",
          "annee": "1434", "explication": "…", "contexte": "…", "elements": ["…","…"] }
      ]
    }
  ]
}
```
- `wiki` = **titre exact de l'article Wikipédia anglais** (sert de clé pour l'image).
- `roster[].niveau` = `"★"` | `"○"` | `""`.

### 3.3 Modèle de données — `data/dossiers.json`
Un dossier = un **module d'apprentissage complet**. Le moteur de rendu est **flexible** : chaque section ne s'affiche que si le champ existe. Champs possibles :
```jsonc
{
  "id": "renaissance", "titre": "…", "periode": "…", "couleur": "#…", "sous_titre": "…",
  "carte": [["Dates","…"], …],                  // tableau carte d'identité
  "contexte": ["…", …],                          // bullets  OU
  "bascule": "… prose …",                        // prose "contexte & mentalités"
  "phrase": "… phrase-clé …",
  "mentalites": { "avant": "…", "renversements": ["…"], "phrase": "…" }, // (Renaissance)
  "probleme": "…",                               // le problème central
  "caracteristiques": ["…"],                     // liste (maniérisme, baroque…)
  "genres": ["…"],                               // liste (Hollande)
  "innovations": [["nom","qui/quand","résout"]], // tableau (Renaissance)
  "memo_outils": "…", "memo_geo": "…",
  "courants": [["nom","desc"]],
  "mouvements": [["mvt","vers","idée","figures"]], // tableau (XXe)
  "oeuvres": [{ "titre","artiste","annee","lieu","wiki","genie" }],
  "artistes": [{ "niveau","nom","dates","role","wiki","portrait" }],
  "artistes_note": "… (pour chapitres anonymes)",
  "index": [{ "ecole":"", "items": [["nom", true/false (★), "dates", "détail"]] }],
  "incontournables": [["œuvre","artiste","où la voir"]],
  "liens": { "d_ou": "…", "mene": "…" },         // les cycles
  "memos": ["…"], "autotest": ["question 1", …]  // ← source idéale pour les QCM
}
```

### 3.4 Modèle de données — `data/images.json`
```jsonc
{
  "Mona Lisa": { "thumb": "https://…/1000px.jpg", "thumb_w":1000, "thumb_h":1493,
                 "url": "https://…/original.jpg", "w":2835, "h":4289,
                 "format": "jpg", "file": "Mona_Lisa.jpg" }
}
```
Clé = champ `wiki`. L'app lit l'image ici **en priorité** (instantané), avec repli sur l'API live. 3 œuvres du XXe (Guernica, Persistance de la mémoire, Roue de bicyclette) n'ont **pas d'image libre** (copyright) — absence assumée.

### 3.5 `js/app.js` — structure
- **Chargement** : `Promise.all` fetch art.json + dossiers.json + images.json (avec `?v=DV` pour le cache).
- **Routage par hash** (`route()`), onglets actifs, rail des chapitres.
- Routes : `#/` (accueil 27 chapitres) · `#/parcours` · `#/c/{i}` (chapitre) · `#/c/{i}/o/{j}` (œuvre) · `#/d/{id}` (dossier) · `#/dossiers` · `#/favoris` · `#/quiz`.
- **Render** : `renderHome`, `renderParcours`, `renderChapitre`, `renderOeuvre`, `renderDossier`, `renderDossiersList`, `renderFavoris`, `renderQuiz`.
- **Helpers** : `getImageUrl` (manifeste→live), `loadImages`, favoris (`favs/favBtn`), notes (`notesBlock/wireNotes`), checklist (`wireChecklist`), guide IA (`wireGuide`).
- `const DV` (version de données) + `js/app.js?v=N` dans index.html : **bumpés à chaque mise à jour** pour court-circuiter le cache de GitHub Pages.

### 3.6 Serveur IA — `server.js`
- Node ≥ 18, sans dépendance. Sert les fichiers statiques + endpoint `POST /api/ask`.
- `/api/ask` relaie vers l'API Claude (`https://api.anthropic.com/v1/messages`), **clé `ANTHROPIC_API_KEY` côté serveur** (jamais exposée au navigateur). Modèle par défaut `claude-sonnet-4-6`.
- Lancement local : `ANTHROPIC_API_KEY=sk-ant-… node server.js` → http://localhost:8080.
- **Limite :** ne fonctionne pas sur GitHub Pages (statique). Pour l'IA en ligne, il faut un proxy serverless (voir §8.3).

### 3.7 Déploiement
- Push sur `main` → GitHub Pages reconstruit (~1–3 min).
- Pour forcer le rafraîchissement : bump de `DV` (données) et de `?v=` (script).

---

## 4. INVENTAIRE COMPLET DU CONTENU

### 4.1 Les 27 chapitres (squelette + index ★/○ pour tous)
| Ch. | Titre | Dossier détaillé |
|----|-------|------------------|
| 1 | Étranges débuts | `prehistoire` |
| 2 | L'art pour l'éternité | `egypte-mesopotamie` |
| 3 | Le grand éveil | `grece-classique` |
| 4 | Le royaume de la beauté | `grece-hellenistique` |
| 5 | Les conquérants du monde | `rome-chretiens` |
| 6 | Une séparation des chemins | `rome-byzance` |
| 7 | Le regard vers l'Orient | `islam-chine` |
| 8 | L'art occidental dans le creuset | `haut-moyen-age` |
| 9 | L'Église militante | `art-roman` |
| 10 | L'Église triomphante | `art-gothique` |
| 11 | Courtisans et bourgeois | `xive-giotto` |
| 12–17 | Renaissance (conquête du réel → Nord) | `renaissance` |
| 18 | Une crise de l'art (maniérisme) | `manierisme` |
| 19 | Vision et visions (baroque catholique) | `baroque-catholique` |
| 20 | Le miroir de la nature (Hollande) | `hollande` |
| 21 | Pouvoir et gloire (Italie) | `baroque-tardif-italie` |
| 22 | Pouvoir et gloire (France/Rococo) | `rococo-versailles` |
| 23 | L'âge de la raison | `age-de-raison` |
| 24 | La rupture de la tradition | `rupture-tradition` |
| 25 | Révolution permanente (XIXe) | `xixe-romantisme-realisme` |
| 26 | En quête de nouveaux critères | `impressionnisme` |
| 27 | L'art expérimental (XXe) | `xxe-experimental` |

**22 dossiers détaillés couvrent les 27 chapitres** (la Renaissance en couvre 6). **214 images** enregistrées.

---

## 5. LA PHILOSOPHIE D'APPRENTISSAGE

> **Le site est aujourd'hui un excellent livre numérique. Mais lire ≠ apprendre.** On retient ce qu'on **récupère activement**, pas ce qu'on relit. Le levier n'est plus dans le contenu (complet) mais dans la **boucle de pratique**.

Bascule à viser : de **« consulter »** vers **« pratiquer »**. Chaque fiche devrait basculer en un clic entre **lire**, **se faire tester**, et **discuter**.

---

## 6. LES 5 FONCTIONS À OPTIMISER (DÉTAIL)

### 🧭 Découverte
- ✅ Parcours (fil rouge).
- ➕ Frise visuelle horizontale des 27 chapitres (ligne de temps colorée, cliquable).
- ➕ « Œuvre du jour » sur l'accueil (image + question d'accroche).
- ➕ Bouton « Surprends-moi » (œuvre au hasard).

### 💡 Compréhension
- ✅ Bloc « Le fil » (d'où ça vient → où ça mène) + pourquoi.
- ➕ **Comparateur** : deux œuvres côte à côte (ex. figure égyptienne vs kouros grec ; Caravage vs Poussin).
- ➕ « Explique-moi simplement » (reformulation IA).
- ➕ Glossaire transversal (sfumato, contrapposto, ténébrisme, quadratura…) cliquable partout.

### 💬 Discussion (cœur du « dynamique »)
- ⚙️ Tuteur IA **en ligne** (proxy).
- ➕ **Mode socratique** : l'IA pose des questions, te fait formuler, corrige.
- ➕ **Enrichissement** (idée studyforge) : tu colles un texte → l'IA compare au dossier, signale le neuf, l'intègre (avec vérification).

### 🔁 Mémorisation (ce qui manque le plus)
- ➕ **QCM enrichis** (choix multiple, flashcards, questions ouvertes corrigées par IA).
- ➕ **Répétition espacée** (revoir avant d'oublier).
- ➕ **Interleaving** (quiz transversal « tout le musée »).
- ➕ **Tableau de progression** (% su par chapitre, cartes à revoir aujourd'hui, série de jours).

### 📌 Archivage & référence
- ✅ Notes (qui enrichissent les fiches) + favoris.
- ➕ Export (Markdown/JSON) des notes et favoris.
- ➕ Recherche globale (œuvres, artistes, notions, notes).
- ➕ Synchronisation GitHub (au lieu d'un seul navigateur).

---

## 7. SCIENCE COGNITIVE APPLIQUÉE
| Principe | Ce que ça dit | Traduction concrète |
|---|---|---|
| Active recall | Se tester ancre ~2× mieux que relire | QCM, flashcards, questions IA |
| Répétition espacée | Revoir juste avant d'oublier | File de révision datée (Leitner/SM-2) |
| Interleaving | Mélanger > bloquer | Quiz transversal « tout le musée » |
| Élaboration | Expliquer le *pourquoi* | Bloc « Le fil », mode socratique |
| Dual coding | Image + mot = +rétention | Fiche = grande image + explication (déjà là) |
| Generation effect | Produire > recevoir | Questions ouvertes, l'IA fait formuler |
| Contraste | Comparer révèle | Vue deux œuvres côte à côte |

---

## 8. SPÉCIFICATIONS DÉTAILLÉES DES FONCTIONNALITÉS À VENIR

### 8.1 QCM enrichis *(client-side, gratuit, prioritaire)*
**Sources de questions (toutes déjà dans les données) :**
- `dossier.autotest` → questions ouvertes (auto-évaluation ou correction IA).
- `dossier.index` / `chapitre.roster` → « À quel mouvement appartient X ? », « Qui a peint Y ? ».
- `images.json` + œuvres → « Quelle est cette œuvre ? / quel chapitre ? / quel artiste ? » (visuel).
- `dossier.oeuvres[].genie` → « Quel verrou cette œuvre fait-elle sauter ? ».

**Formats :**
1. **Choix multiple** (4 options, distracteurs tirés des autres entrées). *(déjà partiellement là)*
2. **Flashcard** (recto image/nom, verso explication ; auto-note « su / à revoir »).
3. **Question ouverte** : l'utilisateur écrit, l'IA évalue (nécessite IA en ligne).

**UX :** bouton « Teste-moi » sur chaque chapitre/dossier (quiz limité au sujet) + onglet Réviser (transversal). Score, révélation de la réponse + lien fiche.

### 8.2 Répétition espacée *(client-side)*
**Algorithme conseillé : Leitner simplifié (5 boîtes).**
- Chaque « carte » (œuvre, artiste, notion) a une boîte (1→5) et une date de prochaine révision.
- Bonne réponse → boîte +1 (intervalle plus long : 1j, 3j, 7j, 16j, 35j). Mauvaise → retour boîte 1.
- **Modèle (localStorage)** : `srs:<cardId> = { box, due (timestamp ISO via Date passé en paramètre), seen }`.
- **File du jour** : cartes dont `due <= aujourd'hui`. Écran « À revoir aujourd'hui : N ».
- **Cartes** générées depuis le contenu (œuvres + roster ★ en priorité).
- *Note d'implémentation : `Date.now()` est interdit dans les scripts de workflow mais autorisé dans le navigateur (app.js) — donc OK ici.*

### 8.3 Tuteur IA en ligne *(nécessite une action de l'utilisateur, une fois)*
Le site étant statique, il faut un **proxy serverless** qui détient la clé API.
- **Option A — Cloudflare Workers (gratuit).** Un Worker reçoit `{question, contexte}`, appelle l'API Claude avec la clé stockée en *secret* CF, renvoie la réponse. L'app appelle `https://<worker>.workers.dev` au lieu de `/api/ask`.
- **Option B — Vercel Functions** (équivalent).
- **Sécurité :** la clé n'est jamais dans le navigateur ; restreindre l'origine (CORS) au domaine Pages.
- **Le code de `server.js` est déjà la logique de référence** à transposer dans le Worker.

### 8.4 Mode socratique *(prompt)*
Système : « Tu es un tuteur d'histoire de l'art. Au lieu de donner la réponse, **pose 1 question** qui aide l'élève à la trouver à partir du contexte fourni. S'il répond, valide/corrige brièvement et avance d'un cran. Reste concret, chaleureux, 2–4 phrases. » + contexte (chapitre, œuvre, idée).

### 8.5 Enrichissement vérifié des fiches *(idée studyforge)*
Flux : l'utilisateur colle un texte → l'IA reçoit `dossier + texte` → renvoie `{ nouveautés: [...], déjà_couvert: [...], à_corriger: [...] }` → l'app propose d'ajouter les « nouveautés » aux notes de la fiche (la fiche grandit, avec contrôle).

### 8.6 Frise visuelle / Comparateur / Glossaire
- **Frise** : 27 blocs colorés sur une ligne horizontale scrollable, largeur ∝ durée, clic → chapitre.
- **Comparateur** : route `#/vs/<wikiA>/<wikiB>`, deux images + deux explications côte à côte ; suggestions de paires pédagogiques.
- **Glossaire** : `data/glossaire.json` (terme → définition + œuvres concernées) ; termes soulignés cliquables.

### 8.7 Recherche, export, synchro
- **Recherche** : index en mémoire (titres, artistes, notions, notes) ; champ dans le header.
- **Export** : bouton → fichier `.md`/`.json` des favoris + notes.
- **Synchro** : (avancé) commit des notes via l'API GitHub avec un token personnel.

---

## 9. FEUILLE DE ROUTE PRIORISÉE (impact × effort)

**Phase 1 — La boucle d'apprentissage ⭐ (impact maximal, effort modéré, sans serveur)**
1. QCM enrichis (CM + flashcards) à partir des auto-tests + index + images.
2. Répétition espacée (Leitner) + tableau « à revoir aujourd'hui » + progression.

**Phase 2 — La discussion vivante ⭐ (nécessite le proxy IA)**
3. Tuteur IA en ligne (Cloudflare/Vercel) + mode socratique.
4. Enrichissement vérifié des fiches.

**Phase 3 — Comprendre en reliant**
5. Frise visuelle + comparateur d'œuvres + glossaire transversal.

**Phase 4 — Confort & pérennité**
6. Recherche globale + export + synchro GitHub.

---

## 10. CONVENTIONS & MODE D'EMPLOI POUR FAIRE ÉVOLUER LE PROJET

- **Ajouter/éditer un dossier** : fournir un `.md` structuré (carte, contexte/bascule, problème, caractéristiques/genres/mouvements, œuvres décortiquées, artistes, index, liens, mémos, auto-test) → conversion en objet dans `dossiers.json` → lier `chapitre.dossier`.
- **Ajouter une œuvre en fiche** : objet dans `chapitre.oeuvres` (titre, wiki, artiste, annee, explication, contexte, elements).
- **Images** : relancer le script de résolution (séquentiel, **User-Agent obligatoire** sinon Wikimedia throttle) ; il signale les titres sans image.
- **Après toute modif de données** : bumper `DV` dans `app.js` et `?v=` dans `index.html`, commit, push ; attendre le rebuild Pages.
- **Le moteur de dossier est tolérant** : ajouter une section = ajouter un champ + (si nouveau type) un bloc de rendu conditionnel dans `renderDossier`.

---

## 11. RECOMMANDATION FINALE — L'AVIS DE CLAUDE

**Le contenu est complet : arrête d'en ajouter. Investis dans la BOUCLE.**

Dans cet ordre précis :

1. **Phase 1 d'abord (mémorisation).** C'est le plus grand écart entre « je lis » et « je sais », et **tout le matériau existe déjà** (les auto-tests des dossiers, l'index ★/○, les images). On les transforme en QCM + flashcards avec répétition espacée. Effort modéré, **impact énorme**. **C'est par là qu'il faut commencer.**
2. **Phase 2 (discussion).** Ce qui rend l'expérience vraiment *dynamique* : tu poses une question, ça répond, ça t'interroge en retour (socratique), et ça enrichit ta fiche. Nécessite le proxy IA en ligne — une connexion de ta part, une seule fois.
3. **Phase 3 (compréhension visuelle).** Agréable mais secondaire tant que la boucle test/discussion n'existe pas.

**Principe directeur :** le jour où, sur n'importe quelle fiche, tu peux **lire**, **te faire interroger** ou **débattre** en un clic — et où le système sait **quoi te refaire réviser demain** — BENMUSEUM cesse d'être un beau livre pour devenir un **professeur particulier**.

---
*Fin du document. À faire évoluer au fil du projet. Prochaine étape recommandée : Phase 1.*
