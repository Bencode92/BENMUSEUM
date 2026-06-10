# BENMUSEUM — Optimiser pour l'apprentissage dynamique
### L'avis de Claude : où on en est, et comment en faire un vrai outil d'apprentissage

---

## 1. Le constat honnête

**Ce qui est déjà très bon :**
- Le **contenu** est excellent et complet : les 27 chapitres de Gombrich, 22 dossiers riches (contexte, mentalités, mouvements, œuvres décortiquées, artistes, index, auto-test), 214 images enregistrées.
- L'**architecture de lecture** est saine : Parcours (fil rouge) → Chapitre → Dossier → Œuvre, toujours contextuel.
- Les **fondations d'archivage** existent : notes qui enrichissent les fiches, favoris.

**Le vrai problème à résoudre maintenant :**
> Le site est aujourd'hui un **excellent livre numérique**. Mais lire ≠ apprendre. On retient ce qu'on **récupère activement**, pas ce qu'on relit. Tout le levier est désormais dans la **boucle d'apprentissage**, pas dans plus de contenu.

C'est la bascule clé : passer de **« consulter »** à **« pratiquer »**.

---

## 2. Les 5 fonctions, et comment les optimiser

Tu as toi-même nommé l'ambition : *découverte, compréhension, discussion, archivage, référence*. Voici comment optimiser chacune.

### 🧭 DÉCOUVERTE — donner envie d'entrer
- ✅ Le **Parcours** (fil rouge) est la bonne porte.
- ➕ **Frise visuelle** horizontale des 27 chapitres (ligne de temps colorée, cliquable) : voir d'un coup d'œil toute l'histoire.
- ➕ **« Œuvre du jour »** sur l'accueil : une image + une question d'accroche → on plonge.
- ➕ **Mode flânerie** : un bouton « Surprends-moi » qui ouvre une œuvre au hasard.

### 💡 COMPRÉHENSION — relier, pas empiler
La compréhension naît des **liens**, pas des faits isolés.
- ✅ Le bloc **« Le fil »** (d'où ça vient → où ça mène) est exactement ça.
- ➕ **Comparer deux œuvres côte à côte** (ex. une figure égyptienne vs un kouros grec, un Caravage vs un Poussin) : la compréhension explose dans le contraste.
- ➕ **« Explique-moi comme si j'avais 12 ans »** : un bouton qui demande au guide une reformulation simple.
- ➕ **Glossaire transversal** (sfumato, contrapposto, ténébrisme, quadratura…) : un terme cliquable partout → sa définition + les œuvres où il apparaît.

### 💬 DISCUSSION — le cœur du dynamisme (priorité haute)
C'est ici que « dynamique » prend tout son sens : un échange, pas une lecture.
- ⚙️ **Tuteur IA en ligne** (aujourd'hui local seulement) → via un proxy serverless gratuit, il répond partout.
- ➕ **Mode socratique** : le guide te pose **des questions** plutôt que de tout donner — il te fait formuler, puis corrige. (Le *generation effect* : on retient ce qu'on a produit soi-même.)
- ➕ **Enrichissement** (l'idée studyforge) : tu colles un texte/une remarque → l'IA la **compare** au dossier, signale ce qui est nouveau, et l'**intègre** à la fiche. La fiche grandit *avec vérification*.

### 🔁 MÉMORISATION — la boucle qui fait apprendre (priorité haute)
C'est ce qui manque le plus aujourd'hui. Trois mécanismes prouvés :
- **Active recall** (se tester) > relire. → QCM, flashcards, questions ouvertes corrigées par l'IA.
- **Répétition espacée** : revoir une carte juste avant de l'oublier. → un algorithme simple (type Leitner / SM-2 allégé) qui programme les révisions.
- **Interleaving** : mélanger les époques plutôt que réviser un bloc d'affilée. → un quiz « tout le musée » qui pioche partout.
- ➕ **QCM enrichis** : à partir de l'auto-test des dossiers (déjà écrit !), des images (« quel mouvement ? »), de l'index ★/○.
- ➕ **Tableau de progression** : % de chaque chapitre « su », série de jours, cartes à revoir aujourd'hui.

### 📌 ARCHIVAGE & RÉFÉRENCE — ta mémoire externe
- ✅ Notes + favoris existent.
- ➕ **Export** de tes notes et favoris (Markdown/JSON) — ta synthèse personnelle, réutilisable.
- ➕ **Recherche globale** (un champ qui cherche dans œuvres, artistes, notions, tes notes).
- ➕ **Synchronisation** (plus tard) : tes notes versionnées sur GitHub plutôt que dans un seul navigateur.

---

## 3. Les principes de science cognitive (et leur traduction concrète)

| Principe | Ce que ça dit | Dans BENMUSEUM |
|---|---|---|
| **Active recall** | Se tester ancre 2× mieux que relire | QCM, flashcards, questions IA |
| **Spaced repetition** | Revoir avant d'oublier | File de révision datée (Leitner) |
| **Interleaving** | Mélanger > bloquer | Quiz transversal « tout le musée » |
| **Elaboration** | Expliquer le *pourquoi* | Le bloc « Le fil », le mode socratique |
| **Dual coding** | Image + mot = +rétention | Fiche = grande image **+** explication (déjà là) |
| **Generation effect** | Produire > recevoir | Questions ouvertes, l'IA te fait formuler |
| **Contrast** | Comparer révèle | Vue « deux œuvres côte à côte » |

---

## 4. Feuille de route priorisée (impact × effort)

**Phase 1 — La boucle d'apprentissage (impact maximal) ⭐**
1. **QCM enrichis** : choix multiple + flashcards + questions ouvertes ; sources = auto-tests + index + images. *(client-side, gratuit)*
2. **Répétition espacée** : file « à revoir aujourd'hui » + progression par chapitre. *(client-side)*

**Phase 2 — La discussion vivante ⭐**
3. **Tuteur IA en ligne** (proxy Cloudflare/Vercel) + **mode socratique**.
4. **Enrichissement vérifié** des fiches (compare & intègre).

**Phase 3 — Comprendre en reliant**
5. **Frise visuelle** + **comparateur d'œuvres** + **glossaire**.

**Phase 4 — Confort & pérennité**
6. **Recherche globale**, **export** des notes/favoris, **synchro GitHub**.

---

## 5. Ma recommandation (l'avis de Claude)

**Arrête d'ajouter du contenu : le livre est complet. Investis dans la BOUCLE.**

Concrètement, dans cet ordre :

1. **D'abord la mémorisation (Phase 1).** C'est le plus grand écart entre « je lis » et « je sais ». Tes dossiers contiennent **déjà** les auto-tests : on les transforme en QCM + flashcards avec répétition espacée. Effort modéré, impact énorme. **C'est par là que je commencerais.**

2. **Ensuite la discussion (Phase 2).** C'est ce qui rend l'expérience *dynamique* au sens où tu l'entends : tu poses une question, ça répond, ça t'interroge en retour, et ça enrichit ta fiche. Nécessite le proxy IA en ligne (une connexion de ta part, une fois).

3. **La compréhension visuelle (Phase 3)** vient après : elle est agréable mais secondaire tant que la boucle test/discussion n'existe pas.

**Le principe directeur :** chaque page devrait pouvoir basculer de *« je lis »* à *« teste-moi »* ou *« discutons-en »* en un clic. Le jour où, sur n'importe quelle fiche, tu peux soit lire, soit te faire interroger, soit débattre avec le guide — et où le système sait quoi te refaire réviser demain — BENMUSEUM cesse d'être un beau livre pour devenir un **professeur particulier**.

---

*Document de référence — à faire évoluer. Prochaine étape recommandée : Phase 1 (QCM + répétition espacée), en réutilisant les auto-tests déjà présents dans les dossiers.*
