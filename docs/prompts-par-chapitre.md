# BENMUSEUM — Prompts de développement, chapitre par chapitre
> À envoyer à Claude Opus 4.6, **un chapitre à la fois**. Chaque prompt rappelle ce qu'on a déjà
> et demande de compléter. Colle ensuite le JSON obtenu dans la session BENMUSEUM, je l'intègre
> (images via wiki_en, regroupement par école, déploiement).



---

## Chapitre 1 — « Étranges débuts » — Peuples préhistoriques et primitifs ; Amérique ancienne

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 1 — « Étranges débuts » — Peuples préhistoriques et primitifs ; Amérique ancienne.
Idée-clé : Pour les premiers artistes, l'image n'est pas belle mais utile : peindre l'animal, c'est s'assurer la chasse. L'art naît du besoin et de la magie, pas du goût.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : (art anonyme — Aucun nom : l'art est collectif, rituel, transmis. C'est justement ce qui le dis…).
- Œuvres déjà décortiquées : « Grottes de Lascaux & Altamira », « Masques et statues tribaux », « Art précolombien ».
- Thèmes du récit déjà couverts : L'art avant l'« art » : agir sur le monde · Lascaux : des chefs-d'œuvre cachés dans le noir · Les Vénus : le corps réduit à son pouvoir · La main soufflée : « j'étais là » · Un art déjà universel · Un art sans nom.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 2 — « L'art de l'éternité » — Égypte, Mésopotamie, Crète

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 2 — « L'art de l'éternité » — Égypte, Mésopotamie, Crète.
Idée-clé : L'Égyptien ne dessine pas ce qu'il voit mais ce qu'il sait, selon des règles immuables : un art conçu pour l'éternité, pas pour l'instant.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : (art anonyme — Quasi anonymes. Imhotep (architecte de la première pyramide) est l'un des rares …).
- Œuvres déjà décortiquées : « Peintures et reliefs de tombes », « La révolution d'Akhenaton / Amarna », « Fresques de Knossos ».
- Thèmes du récit déjà couverts : Un art conçu pour l'éternité · Peindre ce qu'on sait, pas ce qu'on voit · La loi du profil · La hiérarchie d'échelle : la taille dit l'importance · La parenthèse d'Amarna · La Mésopotamie : le pouvoir gravé.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 3 — « Le grand éveil » — Grèce, VIIᵉ au Vᵉ siècle av. J.-C.

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 3 — « Le grand éveil » — Grèce, VIIᵉ au Vᵉ siècle av. J.-C..
Idée-clé : La Grèce ose, pour la première fois, représenter le corps tel que l'œil le voit : le raccourci, le poids, le mouvement. L'art apprend à regarder.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Myron (Ve s. av.) ; Phidias (~480-430 av.) ; Polyclète (Ve s. av.).
- Œuvres déjà décortiquées : « Le Discobole », « Le Parthénon & Phidias », « Le contrapposto (Kritios) ».
- Thèmes du récit déjà couverts : Le grand éveil : l'art ouvre les yeux · Du kouros raide à l'homme vivant · Saisir le mouvement · Le canon et le contrapposto · Le Parthénon : observation et idéal réunis · Pourquoi la Grèce a tout changé.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 4 — « Le royaume de la beauté » — Grèce et monde grec, IVᵉ s. av. J.-C. au Iᵉ s. apr. J.-C.

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 4 — « Le royaume de la beauté » — Grèce et monde grec, IVᵉ s. av. J.-C. au Iᵉ s. apr. J.-C..
Idée-clé : L'art grec passe de la rigueur à la grâce, puis au mouvement et à l'émotion intenses de l'époque hellénistique.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Praxitèle (IVe s. av.) ; Lysippe (IVe s. av.) ; Hagésandros, Athénodore, Polydore (Iᵉʳ s. av.).
- Œuvres déjà décortiquées : « Hermès portant Dionysos », « Le Laocoon », « La Vénus de Milo ».
- Thèmes du récit déjà couverts : Après l'idéal, charmer puis bouleverser · La grâce et la sensualité · Le souffle et le mouvement · Le portrait et l'individu · Le pathos : la souffrance mise en scène · Un art qui conquiert le monde.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 5 — « Les conquérants du monde » — Romains, bouddhistes, juifs et chrétiens, Iᵉ au IVᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 5 — « Les conquérants du monde » — Romains, bouddhistes, juifs et chrétiens, Iᵉ au IVᵉ siècle.
Idée-clé : Rome diffuse l'art grec et le tourne vers l'utile et le pouvoir ; les premières images chrétiennes naissent, simples et symboliques.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : (art anonyme — Largement anonymes : l'art romain est collectif et fonctionnel ; l'art chrétien …).
- Œuvres déjà décortiquées : « Le Panthéon », « La colonne Trajane », « Peintures des catacombes ».
- Thèmes du récit déjà couverts : Rome hérite de la Grèce — et l'utilise · Le réalisme du portrait · Le génie de l'architecture · Le béton : une révolution de l'espace · L'art comme propagande · Les premières images chrétiennes : le tournant.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 6 — « La séparation des chemins » — Rome et Byzance, Vᵉ au XIIIᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 6 — « La séparation des chemins » — Rome et Byzance, Vᵉ au XIIIᵉ siècle.
Idée-clé : À Byzance, l'image devient icône sacrée, frontale et hiératique : on ne cherche plus la ressemblance mais la présence du divin.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : (art anonyme — Anonymes : l'icône byzantine refuse l'originalité individuelle ; le moine-peintr…).
- Œuvres déjà décortiquées : « Mosaïques de Ravenne », « L'icône byzantine ».
- Thèmes du récit déjà couverts : L'Empire se fait chrétien · Le message avant la beauté · Byzance et l'or des mosaïques · L'icône et le hiératisme · La querelle des images · Un art pour mille ans.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 7 — « Le regard vers l'Orient » — Islam, Chine, IIᵉ au XIIIᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 7 — « Le regard vers l'Orient » — Islam, Chine, IIᵉ au XIIIᵉ siècle.
Idée-clé : Privé de la figure, l'islam porte l'ornement et la calligraphie à la perfection ; la Chine fait de la peinture de paysage une méditation sur la nature.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Ku K'ai-chi (~344-406) — Chine ; Ma Yuan (Song) — Chine ; Kao K'o-kung (Song/Yuan) — Chine ; Art islamique (—) — anonyme.
- Œuvres déjà décortiquées : « Décor de mosquée / arabesque », « Paysage chinois (Song) ».
- Thèmes du récit déjà couverts : Deux grandes voies hors de l'Occident · L'Islam : l'interdit de l'image, le génie de l'ornement · L'Alhambra, paradis sur terre · La Chine : peindre l'esprit, pas l'apparence · Le paysage et le vide · Une leçon pour l'Occident, des siècles plus tard.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 8 — « Le creuset occidental » — Europe, VIᵉ au XIᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 8 — « Le creuset occidental » — Europe, VIᵉ au XIᵉ siècle.
Idée-clé : Dans l'Europe troublée du haut Moyen Âge, l'art monastique fond traditions barbares et chrétiennes : l'entrelacs et l'enluminure.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : (art anonyme — Moines anonymes, copistes et enlumineurs. L'individu s'efface derrière l'œuvre c…).
- Œuvres déjà décortiquées : « Les Évangiles de Lindisfarne », « La chapelle Palatine d'Aix ».
- Thèmes du récit déjà couverts : Après la chute de Rome · Le génie de l'entrelacs · Les îles : l'enluminure irlandaise · La renaissance carolingienne · Le livre comme trésor · Le creuset de l'Occident.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 9 — « L'Église militante » — Le XIIᵉ siècle (art roman)

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 9 — « L'Église militante » — Le XIIᵉ siècle (art roman).
Idée-clé : L'art roman, massif et clair, raconte l'histoire sainte sur les murs et les tympans, sans souci du réalisme : c'est la « Bible des illettrés ».

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : (art anonyme — Majoritairement anonymes. Rare exception : Gislebertus, qui a signé le tympan d'…).
- Œuvres déjà décortiquées : « Cathédrale de Durham », « Tympan d'Autun (Jugement dernier) ».
- Thèmes du récit déjà couverts : L'an mil : la pierre revient · L'Église militante · La sculpture renaît au portail · La déformation au service du sens · Le mur peint et l'enseignement · Vers la lumière.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 10 — « L'Église triomphante » — Le XIIIᵉ siècle (art gothique)

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 10 — « L'Église triomphante » — Le XIIIᵉ siècle (art gothique).
Idée-clé : Le gothique élance la pierre et dissout les murs en vitraux : la cathédrale devient une image du ciel inondée de lumière colorée.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : (art anonyme — Largement anonymes (maîtres d'œuvre, ateliers de tailleurs). Quelques noms émerg…).
- Œuvres déjà décortiquées : « Cathédrale de Chartres », « Statues-colonnes des portails ».
- Thèmes du récit déjà couverts : L'Église triomphante · La révolution technique · La lumière comme matière · L'élévation vertige · La sculpture s'adoucit · Un art qui gagne l'Europe.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 11 — « Courtisans et bourgeois » — Le XIVᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 11 — « Courtisans et bourgeois » — Le XIVᵉ siècle.
Idée-clé : L'art gothique tardif se fait gracieux et délicat ; mais en Italie, Giotto redonne aux figures un poids réel et une émotion vraie.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Giotto (~1267-1337) — la charnière ; Duccio (~1255-1319) — Sienne ; Simone Martini (~1284-1344) — gothique int. ; Les frères Lorenzetti (XIVe s.) — Sienne ; Frères Limbourg (~1400) — cour.
- Œuvres déjà décortiquées : « Fresques de la chapelle des Scrovegni », « Le gothique international ».
- Thèmes du récit déjà couverts : Courtisans et bourgeois · Giotto rend le poids au monde · Sienne : la grâce et l'or · L'élégance courtoise : le gothique international · Le monde réel entre par la fenêtre · Le seuil de la Renaissance.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 12 — « La conquête du réel » — Le début du XVᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 12 — « La conquête du réel » — Le début du XVᵉ siècle.
Idée-clé : Au début du XVe, l'art conquiert le réel : la perspective mathématique à Florence, le miroir minutieux du monde chez Van Eyck au Nord.
(NB : le dossier « La Renaissance » couvre les chapitres 12/13/14/15/16/17 — concentre-toi sur le sous-thème de CE chapitre : « Au début du XVe, l'art conquiert le réel : la perspective mathématique à Florence, le miroir minutieux du monde chez Van Eyck au Nord.».)

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Giotto (~1267-1337) — le grand-père ; Masaccio (1401-1428) — le pionnier foudroyé ; Donatello (~1386-1466) — le sculpteur révolutionnaire ; Botticelli (1445-1510) — la grâce, puis le doute ; Léonard de Vinci (1452-1519) — le génie universel ; Michel-Ange (1475-1564) — la force et le tourment ; Raphaël (1483-1520) — l'harmonie incarnée ; Titien (~1488-1576) — le roi de la couleur (Venise) ; Albrecht Dürer (1471-1528) — le pont Nord-Sud ; Brunelleschi (1377-1446) — architecte ; Fra Angelico (~1395-1455) ; Piero della Francesca (~1415-1492) ; Mantegna (~1431-1506) ; Bramante (1444-1514) — architecte ; Giovanni Bellini (~1430-1516) ; Giorgione (~1477-1510) ; Véronèse (1528-1588) ; Van Eyck (~1390-1441) ; Van der Weyden (~1400-1464) ; Jérôme Bosch (~1450-1516) ; Holbein le Jeune (~1497-1543) ; Bruegel l'Ancien (~1525-1569) ; Le Corrège (1489-1534).
- Œuvres déjà décortiquées : « La Trinité », « Les Époux Arnolfini », « La Naissance de Vénus », « La Joconde », « La Cène », « David », « La Pietà », « L'École d'Athènes », « La Vénus d'Urbin », « Le Jardin des délices ».
- Thèmes du récit déjà couverts : Le point de départ : un monde qui bascule · Giotto rouvre les yeux (vers 1300) · Masaccio invente l'espace (vers 1427) · Van Eyck et le miroir du monde (1434) · Botticelli et la grâce antique · Léonard, le premier des géants · Michel-Ange, la force · Raphaël, l'harmonie accomplie · Venise : la couleur contre le dessin · Le Nord, et la naissance de l'artiste-génie.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 13 — « Tradition et innovation (Italie) » — La fin du XVᵉ siècle en Italie

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 13 — « Tradition et innovation (Italie) » — La fin du XVᵉ siècle en Italie.
Idée-clé : Les Italiens concilient la science nouvelle (perspective, anatomie) avec l'harmonie et la grâce héritées de l'Antiquité.
(NB : le dossier « La Renaissance » couvre les chapitres 12/13/14/15/16/17 — concentre-toi sur le sous-thème de CE chapitre : « Les Italiens concilient la science nouvelle (perspective, anatomie) avec l'harmonie et la grâce héritées de l'Antiquité.».)

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Giotto (~1267-1337) — le grand-père ; Masaccio (1401-1428) — le pionnier foudroyé ; Donatello (~1386-1466) — le sculpteur révolutionnaire ; Botticelli (1445-1510) — la grâce, puis le doute ; Léonard de Vinci (1452-1519) — le génie universel ; Michel-Ange (1475-1564) — la force et le tourment ; Raphaël (1483-1520) — l'harmonie incarnée ; Titien (~1488-1576) — le roi de la couleur (Venise) ; Albrecht Dürer (1471-1528) — le pont Nord-Sud ; Brunelleschi (1377-1446) — architecte ; Fra Angelico (~1395-1455) ; Piero della Francesca (~1415-1492) ; Mantegna (~1431-1506) ; Bramante (1444-1514) — architecte ; Giovanni Bellini (~1430-1516) ; Giorgione (~1477-1510) ; Véronèse (1528-1588) ; Van Eyck (~1390-1441) ; Van der Weyden (~1400-1464) ; Jérôme Bosch (~1450-1516) ; Holbein le Jeune (~1497-1543) ; Bruegel l'Ancien (~1525-1569) ; Le Corrège (1489-1534).
- Œuvres déjà décortiquées : « La Trinité », « Les Époux Arnolfini », « La Naissance de Vénus », « La Joconde », « La Cène », « David », « La Pietà », « L'École d'Athènes », « La Vénus d'Urbin », « Le Jardin des délices ».
- Thèmes du récit déjà couverts : Le point de départ : un monde qui bascule · Giotto rouvre les yeux (vers 1300) · Masaccio invente l'espace (vers 1427) · Van Eyck et le miroir du monde (1434) · Botticelli et la grâce antique · Léonard, le premier des géants · Michel-Ange, la force · Raphaël, l'harmonie accomplie · Venise : la couleur contre le dessin · Le Nord, et la naissance de l'artiste-génie.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 14 — « Tradition et innovation (Nord) » — Le XVᵉ siècle dans le Nord

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 14 — « Tradition et innovation (Nord) » — Le XVᵉ siècle dans le Nord.
Idée-clé : Au nord des Alpes, on cherche moins la perspective théorique que le détail minutieux, le réalisme concret et l'imagination débordante.
(NB : le dossier « La Renaissance » couvre les chapitres 12/13/14/15/16/17 — concentre-toi sur le sous-thème de CE chapitre : « Au nord des Alpes, on cherche moins la perspective théorique que le détail minutieux, le réalisme concret et l'imagination débordante.».)

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Giotto (~1267-1337) — le grand-père ; Masaccio (1401-1428) — le pionnier foudroyé ; Donatello (~1386-1466) — le sculpteur révolutionnaire ; Botticelli (1445-1510) — la grâce, puis le doute ; Léonard de Vinci (1452-1519) — le génie universel ; Michel-Ange (1475-1564) — la force et le tourment ; Raphaël (1483-1520) — l'harmonie incarnée ; Titien (~1488-1576) — le roi de la couleur (Venise) ; Albrecht Dürer (1471-1528) — le pont Nord-Sud ; Brunelleschi (1377-1446) — architecte ; Fra Angelico (~1395-1455) ; Piero della Francesca (~1415-1492) ; Mantegna (~1431-1506) ; Bramante (1444-1514) — architecte ; Giovanni Bellini (~1430-1516) ; Giorgione (~1477-1510) ; Véronèse (1528-1588) ; Van Eyck (~1390-1441) ; Van der Weyden (~1400-1464) ; Jérôme Bosch (~1450-1516) ; Holbein le Jeune (~1497-1543) ; Bruegel l'Ancien (~1525-1569) ; Le Corrège (1489-1534).
- Œuvres déjà décortiquées : « La Trinité », « Les Époux Arnolfini », « La Naissance de Vénus », « La Joconde », « La Cène », « David », « La Pietà », « L'École d'Athènes », « La Vénus d'Urbin », « Le Jardin des délices ».
- Thèmes du récit déjà couverts : Le point de départ : un monde qui bascule · Giotto rouvre les yeux (vers 1300) · Masaccio invente l'espace (vers 1427) · Van Eyck et le miroir du monde (1434) · Botticelli et la grâce antique · Léonard, le premier des géants · Michel-Ange, la force · Raphaël, l'harmonie accomplie · Venise : la couleur contre le dessin · Le Nord, et la naissance de l'artiste-génie.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 15 — « L'harmonie atteinte » — Toscane et Rome, début du XVIᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 15 — « L'harmonie atteinte » — Toscane et Rome, début du XVIᵉ siècle.
Idée-clé : Léonard, Michel-Ange et Raphaël atteignent l'équilibre parfait entre science, beauté et expression : le sommet de la Haute Renaissance.
(NB : le dossier « La Renaissance » couvre les chapitres 12/13/14/15/16/17 — concentre-toi sur le sous-thème de CE chapitre : « Léonard, Michel-Ange et Raphaël atteignent l'équilibre parfait entre science, beauté et expression : le sommet de la Haute Renaissance.».)

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Giotto (~1267-1337) — le grand-père ; Masaccio (1401-1428) — le pionnier foudroyé ; Donatello (~1386-1466) — le sculpteur révolutionnaire ; Botticelli (1445-1510) — la grâce, puis le doute ; Léonard de Vinci (1452-1519) — le génie universel ; Michel-Ange (1475-1564) — la force et le tourment ; Raphaël (1483-1520) — l'harmonie incarnée ; Titien (~1488-1576) — le roi de la couleur (Venise) ; Albrecht Dürer (1471-1528) — le pont Nord-Sud ; Brunelleschi (1377-1446) — architecte ; Fra Angelico (~1395-1455) ; Piero della Francesca (~1415-1492) ; Mantegna (~1431-1506) ; Bramante (1444-1514) — architecte ; Giovanni Bellini (~1430-1516) ; Giorgione (~1477-1510) ; Véronèse (1528-1588) ; Van Eyck (~1390-1441) ; Van der Weyden (~1400-1464) ; Jérôme Bosch (~1450-1516) ; Holbein le Jeune (~1497-1543) ; Bruegel l'Ancien (~1525-1569) ; Le Corrège (1489-1534).
- Œuvres déjà décortiquées : « La Trinité », « Les Époux Arnolfini », « La Naissance de Vénus », « La Joconde », « La Cène », « David », « La Pietà », « L'École d'Athènes », « La Vénus d'Urbin », « Le Jardin des délices ».
- Thèmes du récit déjà couverts : Le point de départ : un monde qui bascule · Giotto rouvre les yeux (vers 1300) · Masaccio invente l'espace (vers 1427) · Van Eyck et le miroir du monde (1434) · Botticelli et la grâce antique · Léonard, le premier des géants · Michel-Ange, la force · Raphaël, l'harmonie accomplie · Venise : la couleur contre le dessin · Le Nord, et la naissance de l'artiste-génie.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 16 — « Lumière et couleur » — Venise et l'Italie du Nord, début du XVIᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 16 — « Lumière et couleur » — Venise et l'Italie du Nord, début du XVIᵉ siècle.
Idée-clé : À Venise, Titien et Giorgione font de la couleur et de la lumière, plus que du dessin, le véritable cœur de la peinture.
(NB : le dossier « La Renaissance » couvre les chapitres 12/13/14/15/16/17 — concentre-toi sur le sous-thème de CE chapitre : « À Venise, Titien et Giorgione font de la couleur et de la lumière, plus que du dessin, le véritable cœur de la peinture.».)

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Giotto (~1267-1337) — le grand-père ; Masaccio (1401-1428) — le pionnier foudroyé ; Donatello (~1386-1466) — le sculpteur révolutionnaire ; Botticelli (1445-1510) — la grâce, puis le doute ; Léonard de Vinci (1452-1519) — le génie universel ; Michel-Ange (1475-1564) — la force et le tourment ; Raphaël (1483-1520) — l'harmonie incarnée ; Titien (~1488-1576) — le roi de la couleur (Venise) ; Albrecht Dürer (1471-1528) — le pont Nord-Sud ; Brunelleschi (1377-1446) — architecte ; Fra Angelico (~1395-1455) ; Piero della Francesca (~1415-1492) ; Mantegna (~1431-1506) ; Bramante (1444-1514) — architecte ; Giovanni Bellini (~1430-1516) ; Giorgione (~1477-1510) ; Véronèse (1528-1588) ; Van Eyck (~1390-1441) ; Van der Weyden (~1400-1464) ; Jérôme Bosch (~1450-1516) ; Holbein le Jeune (~1497-1543) ; Bruegel l'Ancien (~1525-1569) ; Le Corrège (1489-1534).
- Œuvres déjà décortiquées : « La Trinité », « Les Époux Arnolfini », « La Naissance de Vénus », « La Joconde », « La Cène », « David », « La Pietà », « L'École d'Athènes », « La Vénus d'Urbin », « Le Jardin des délices ».
- Thèmes du récit déjà couverts : Le point de départ : un monde qui bascule · Giotto rouvre les yeux (vers 1300) · Masaccio invente l'espace (vers 1427) · Van Eyck et le miroir du monde (1434) · Botticelli et la grâce antique · Léonard, le premier des géants · Michel-Ange, la force · Raphaël, l'harmonie accomplie · Venise : la couleur contre le dessin · Le Nord, et la naissance de l'artiste-génie.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 17 — « La diffusion du savoir nouveau » — Allemagne et Pays-Bas, début du XVIᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 17 — « La diffusion du savoir nouveau » — Allemagne et Pays-Bas, début du XVIᵉ siècle.
Idée-clé : Au nord, Dürer et Holbein absorbent la science italienne tout en gardant le génie nordique du détail et de l'observation.
(NB : le dossier « La Renaissance » couvre les chapitres 12/13/14/15/16/17 — concentre-toi sur le sous-thème de CE chapitre : « Au nord, Dürer et Holbein absorbent la science italienne tout en gardant le génie nordique du détail et de l'observation.».)

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Giotto (~1267-1337) — le grand-père ; Masaccio (1401-1428) — le pionnier foudroyé ; Donatello (~1386-1466) — le sculpteur révolutionnaire ; Botticelli (1445-1510) — la grâce, puis le doute ; Léonard de Vinci (1452-1519) — le génie universel ; Michel-Ange (1475-1564) — la force et le tourment ; Raphaël (1483-1520) — l'harmonie incarnée ; Titien (~1488-1576) — le roi de la couleur (Venise) ; Albrecht Dürer (1471-1528) — le pont Nord-Sud ; Brunelleschi (1377-1446) — architecte ; Fra Angelico (~1395-1455) ; Piero della Francesca (~1415-1492) ; Mantegna (~1431-1506) ; Bramante (1444-1514) — architecte ; Giovanni Bellini (~1430-1516) ; Giorgione (~1477-1510) ; Véronèse (1528-1588) ; Van Eyck (~1390-1441) ; Van der Weyden (~1400-1464) ; Jérôme Bosch (~1450-1516) ; Holbein le Jeune (~1497-1543) ; Bruegel l'Ancien (~1525-1569) ; Le Corrège (1489-1534).
- Œuvres déjà décortiquées : « La Trinité », « Les Époux Arnolfini », « La Naissance de Vénus », « La Joconde », « La Cène », « David », « La Pietà », « L'École d'Athènes », « La Vénus d'Urbin », « Le Jardin des délices ».
- Thèmes du récit déjà couverts : Le point de départ : un monde qui bascule · Giotto rouvre les yeux (vers 1300) · Masaccio invente l'espace (vers 1427) · Van Eyck et le miroir du monde (1434) · Botticelli et la grâce antique · Léonard, le premier des géants · Michel-Ange, la force · Raphaël, l'harmonie accomplie · Venise : la couleur contre le dessin · Le Nord, et la naissance de l'artiste-génie.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 18 — « Une crise de l'art » — L'Europe, fin du XVIᵉ siècle (maniérisme)

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 18 — « Une crise de l'art » — L'Europe, fin du XVIᵉ siècle (maniérisme).
Idée-clé : Après la perfection des grands maîtres, le maniérisme cherche volontairement l'étrange, l'artifice et la tension : la règle se brise pour étonner.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Pontormo (1494-1557) ; Bronzino (1503-1572) ; Parmesan (Parmigianino) (1503-1540) ; Cellini (1500-1571) ; Giambologna (1529-1608) ; Tintoret (Tintoretto) (1518-1594) ; Le Greco (El Greco) (1541-1614) ; Bruegel l'Ancien (~1525-1569) ; Vasari (1511-1574).
- Œuvres déjà décortiquées : « La Madone au long cou », « L'Enterrement du comte d'Orgaz », « L'Enlèvement des Sabines ».
- Thèmes du récit déjà couverts : Que faire après la perfection ? · Une époque d'angoisse · Les codes du maniérisme · El Greco, le visionnaire · Tintoret, Bruegel, et la naissance de l'histoire de l'art.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 19 — « Vision et visions » — L'Europe catholique, première moitié du XVIIᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 19 — « Vision et visions » — L'Europe catholique, première moitié du XVIIᵉ siècle.
Idée-clé : Le Baroque catholique veut émouvoir et convaincre : Caravage par sa lumière crue, d'autres par le mouvement et l'extase.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Caravage (1571-1610) ; Annibal Carrache (1560-1609) ; Le Bernin (1598-1680) ; Borromini (1599-1667) ; Rubens (1577-1640) ; Van Dyck (1599-1641) ; Vélasquez (1599-1660) ; Zurbarán · Ribera · Murillo (XVIIᵉ) ; Poussin (1594-1665) ; Le Lorrain (Claude) (1600-1682).
- Œuvres déjà décortiquées : « La Vocation de saint Matthieu », « L'Extase de sainte Thérèse », « Les Ménines ».
- Thèmes du récit déjà couverts : La Contre-Réforme : un art de combat · Caravage : la lumière qui fait le drame · Le Bernin : le théâtre total · Rubens : l'énergie et la chair · Vélasquez : le peintre-roi · Poussin : le baroque qui pense.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 20 — « Le miroir de la nature » — La Hollande au XVIIᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 20 — « Le miroir de la nature » — La Hollande au XVIIᵉ siècle.
Idée-clé : Dans la Hollande protestante et marchande, on peint la vie quotidienne, les portraits et les paysages : l'art du regard patient sur le réel.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Rembrandt (1606-1669) ; Vermeer (1632-1675) ; Frans Hals (~1582-1666) ; Jacob van Ruisdael (1628-1682) ; Jan Steen (1626-1679) ; Pieter de Hooch (1629-1684) ; Willem Kalf (1619-1693).
- Œuvres déjà décortiquées : « La Ronde de nuit », « Autoportraits de Rembrandt », « La Laitière ».
- Thèmes du récit déjà couverts : Un pays sans roi ni Église pour commander · Le premier marché libre de l'art · Le quotidien devient digne d'être peint · Rembrandt : la lumière de l'âme · Vermeer : le silence et la lumière.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 21 — « Pouvoir et gloire (Italie) » — Italie, fin du XVIIᵉ et XVIIIᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 21 — « Pouvoir et gloire (Italie) » — Italie, fin du XVIIᵉ et XVIIIᵉ siècle.
Idée-clé : Le Baroque tardif italien éblouit : plafonds en trompe-l'œil qui ouvrent l'église sur le ciel, théâtre de la foi et du pouvoir.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Tiepolo (1696-1770) ; Gaulli (Baciccio) (1639-1709) ; Canaletto (1697-1768) ; Guardi (1712-1793).
- Œuvres déjà décortiquées : « Le Triomphe du nom de Jésus », « Fresques de Tiepolo », « Vues de Venise ».
- Thèmes du récit déjà couverts : Après le grand Baroque : éblouir, non plus convertir · Le plafond qui déchire le ciel : la quadratura · Tiepolo : le dernier sommet de la fresque · Venise se vend : la naissance de la veduta · Guardi et la fin d'un monde.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 22 — « Pouvoir et gloire (France) » — France, Allemagne, Autriche, fin XVIIᵉ - début XVIIIᵉ

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 22 — « Pouvoir et gloire (France) » — France, Allemagne, Autriche, fin XVIIᵉ - début XVIIIᵉ.
Idée-clé : L'art de cour met la grandeur en scène (Versailles), puis le rococo l'allège en grâce, plaisir et légèreté.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Watteau (1684-1721) ; Boucher (1703-1770) ; Balthasar Neumann (1687-1753) — architecte ; Fischer von Erlach (1656-1723) — architecte ; Prandtauer (1660-1726) — architecte.
- Œuvres déjà décortiquées : « Château de Versailles », « L'Embarquement pour Cythère », « Églises rococo d'Europe centrale ».
- Thèmes du récit déjà couverts : Versailles : l'art comme machine de pouvoir · 1715 : la mort du Roi-Soleil, et le ton change · Watteau et la fête galante · Le Rococo d'Europe centrale : l'architecture en fête · L'envers du décor.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 23 — « L'âge de raison » — Angleterre et France, XVIIIᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 23 — « L'âge de raison » — Angleterre et France, XVIIIᵉ siècle.
Idée-clé : Au siècle des Lumières, l'art se fait plus sobre et bourgeois : portrait anglais, scènes intimes, regard observateur et parfois critique.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Chardin (1699-1779) — France ; Fragonard (1732-1806) — France ; Hogarth (1697-1764) — Angleterre ; Reynolds (1723-1792) — Angleterre ; Gainsborough (1727-1788) — Angleterre ; Houdon (1741-1828) — France.
- Œuvres déjà décortiquées : « La Raie / natures mortes », « Mariage à la mode », « Portraits de Gainsborough ».
- Thèmes du récit déjà couverts : Le siècle des Lumières change le public de l'art · Chardin : la dignité du banal · Hogarth : l'art qui raconte et qui juge · L'âge d'or du portrait anglais · Vers la rupture.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 24 — « La rupture de la tradition » — Angleterre, Amérique, France, fin XVIIIᵉ - début XIXᵉ

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 24 — « La rupture de la tradition » — Angleterre, Amérique, France, fin XVIIIᵉ - début XIXᵉ.
Idée-clé : Les révolutions brisent les conventions : le néoclassicisme prône la vertu antique, le romantisme la passion. L'artiste choisit désormais son sujet et son style.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : David (1748-1825) — France ; Goya (1746-1828) — Espagne ; Blake (1757-1827) — Angleterre ; Constable (1776-1837) — Angleterre ; Turner (1775-1851) — Angleterre ; Copley, West (XVIIIᵉ) — Amérique.
- Œuvres déjà décortiquées : « Le Serment des Horaces », « Tres de Mayo », « Pluie, vapeur et vitesse ».
- Thèmes du récit déjà couverts : Le moment où la chaîne se brise · David : le retour à l'antique et à la vertu · Goya : la naissance de la barbarie moderne · L'Angleterre découvre le paysage · Turner : la lumière qui dévore la forme.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 25 — « La révolution permanente » — Le XIXᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 25 — « La révolution permanente » — Le XIXᵉ siècle.
Idée-clé : Au XIXe, les ruptures s'enchaînent : le réalisme peint le réel sans le farder, puis l'impressionnisme saisit la sensation lumineuse de l'instant.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Ingres (1780-1867) — Néoclassique ; Géricault (1791-1824) — Romantisme ; Delacroix (1798-1863) — Romantisme ; Corot (1796-1875) — Paysage ; Millet (1814-1875) — Réalisme ; Courbet (1819-1877) — Réalisme ; Daumier (1808-1879) — Réalisme/satire ; Préraphaélites (~1850) — Angleterre ; Whistler (1834-1903) — Art pour l'art.
- Œuvres déjà décortiquées : « Le Radeau de la Méduse », « La Liberté guidant le peuple », « Un enterrement à Ornans ».
- Thèmes du récit déjà couverts : Le siècle des batailles de styles · Ingres contre Delacroix : la ligne contre la couleur · Le romantisme : la passion et l'actualité · Le réalisme : le peuple grandeur nature · La photographie change tout.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 26 — « En quête de nouveaux critères » — La fin du XIXᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 26 — « En quête de nouveaux critères » — La fin du XIXᵉ siècle.
Idée-clé : Après l'impressionnisme, Cézanne, Van Gogh et Gauguin cherchent au-delà de l'impression : une structure solide, une émotion, une couleur libérée.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : aucun groupe formel — À DÉFINIR.
- Artistes déjà présents : Manet (1832-1883) — Précurseur ; Monet (1840-1926) — Impressionnisme ; Renoir (1841-1919) — Impressionnisme ; Degas (1834-1917) — Impressionnisme ; Pissarro (1830-1903) — Impressionnisme ; Cézanne (1839-1906) — Post-impr. (structure) ; Van Gogh (1853-1890) — Post-impr. (émotion) ; Gauguin (1848-1903) — Post-impr. (symbole) ; Seurat (1859-1891) — Pointillisme ; Toulouse-Lautrec (1864-1901) — Affiche ; Rodin (1840-1917) — Sculpture.
- Œuvres déjà décortiquées : « Impression, soleil levant », « La Montagne Sainte-Victoire », « La Nuit étoilée ».
- Thèmes du récit déjà couverts : Le refus et la naissance d'un mot (1874) · Peindre dehors : la lumière comme sujet · Manet, le père scandaleux · Monet : la lumière obsédante · Le post-impressionnisme : aller plus loin · Pourquoi ils sont les pères de l'art moderne.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 27 — « L'art expérimental » — Le XXᵉ siècle

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 27 — « L'art expérimental » — Le XXᵉ siècle.
Idée-clé : Au XXe, plus aucune règle n'est sûre : cubisme, abstraction, surréalisme, readymade. L'expérimentation elle-même devient le sujet de l'art.

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : 8 mouvements listés.
- Artistes déjà présents : Matisse (1869-1954) — Fauvisme ; Picasso (1881-1973) — Cubisme ; Braque (1882-1963) — Cubisme ; Munch (1863-1944) — Expressionnisme ; Kokoschka (1886-1980) — Expressionnisme ; Kandinsky (1866-1944) — Abstraction ; Mondrian (1872-1944) — Abstraction géométrique ; Klee (1879-1940) — Bauhaus ; Dalí (1904-1989) — Surréalisme ; Chagall (1887-1985) — Rêve/symbole ; Feininger (1871-1956) — Cubisme/Bauhaus ; Henry Moore (1898-1986) — Sculpture ; Giacometti (1901-1966) — Sculpture ; Gropius / Bauhaus (dès 1919) — Design/archi ; Frank Lloyd Wright (1867-1959) — Architecture ; Duchamp (1887-1968) — Dada / readymade.
- Œuvres déjà décortiquées : « Les Demoiselles d'Avignon », « La Danse », « Composition VII », « Fontaine ».
- Thèmes du récit déjà couverts : La rupture : pourquoi l'art cesse d'imiter · Le fauvisme (1905) : la couleur prend le pouvoir · Le cubisme (1907-1914) : briser le point de vue unique · Cubisme analytique puis synthétique · L'abstraction (années 1910) : l'art sans sujet · Dada (1916) : l'art se moque de l'art · Le surréalisme (1924) : le règne du rêve · Bauhaus et après : la fin d'une histoire, le début d'une autre.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```


---

## Chapitre 28 — « L'art contemporain » — De 1945 à aujourd'hui

```
Tu es un historien de l'art expert, dans l'esprit d'E.H. Gombrich (tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision).

CHAPITRE : 28 — « L'art contemporain » — De 1945 à aujourd'hui.
Idée-clé : Après-guerre, le centre passe de Paris à New York. L'art éclate en mille directions — geste pur, image de masse, idée, provocation, installation, marché mondial — et interroge sans cesse : qu'est-ce qui est encore de l'art ?

DÉJÀ FAIT dans la plateforme (ne te contente pas de répéter — COMPLÈTE et DÉVELOPPE) :
- Groupes/écoles déjà notés : 5 mouvements listés.
- Artistes déjà présents : Jackson Pollock (1912-1956) — Expressionnisme abstrait ; Mark Rothko (1903-1970) — Color field painting ; Willem de Kooning (1904-1997) — Expressionnisme abstrait ; Andy Warhol (1928-1987) — Pop Art ; Roy Lichtenstein (1923-1997) — Pop Art ; Francis Bacon (1909-1992) — Nouvelle figuration ; Jean-Michel Basquiat (1960-1988) — Néo-expressionnisme ; David Hockney (1937-) — Nouvelle figuration / Pop ; Jeff Koons (1955-) — Néo-pop / Kitsch ; Damien Hirst (1965-) — Young British Artists ; Yayoi Kusama (1929-) — Pois, infini, installation ; Ai Weiwei (1957-) — Art engagé / installation ; Banksy (v. 1974-) — Street art.
- Œuvres déjà décortiquées : « Sunflower Seeds (Graines de tournesol) », « Maman ».
- Thèmes du récit déjà couverts : 1945 : New York prend la tête · Le geste pur : l'expressionnisme abstrait · L'image de masse : le Pop Art · L'idée comme œuvre · Le retour du corps et du cri · L'art-monde : provocation, installation, marché.

TA MISSION — développe ce chapitre au niveau prépa :
1) le CONTEXTE historique global de la période ;
2) les différents GROUPES / écoles / courants (et à quel groupe rattacher chaque artiste) ;
3) les ARTISTES marquants qui MANQUENT (en plus de ceux déjà là) — sois exhaustif ;
4) pour chacun : biographie profonde + ANECDOTES + ses CHEFS-D'ŒUVRE avec ANALYSE ;
5) les œuvres clés (avec leur titre d'article Wikipédia anglais pour l'image).

Réponds UNIQUEMENT par un objet JSON valide, sans aucun texte autour, au format EXACT :
{
  "chapitre": <num>,
  "contexte": "paragraphe dense (4-6 phrases) : la bascule de l'époque, pourquoi on crée, l'état du monde",
  "groupes": ["Nom du groupe/école/mouvement : description en une phrase", "..."],
  "artistes": [
    {
      "nom": "Nom complet", "dates": "1452-1519", "niveau": "★ ou ○",
      "groupe": "le mouvement/école (sert à regrouper sur la fiche)",
      "role": "rôle en 3-4 mots", "wiki_en": "Titre EXACT de l'article Wikipédia ANGLAIS de l'ARTISTE",
      "portrait": "une phrase d'accroche",
      "bio_sections": [
        {"h":"L'enfance / les origines","p":"3-4 phrases"},
        {"h":"Le déclic","p":"..."},
        {"h":"Sa technique / son style","p":"..."},
        {"h":"Son message","p":"..."},
        {"h":"Pourquoi il compte, selon les experts","p":"..."},
        {"h":"Ce qui le différencie","p":"..."}
      ],
      "oeuvres": [
        {"titre":"Titre FR","annee":"...","lieu":"musée, ville","wiki_en":"Titre EXACT article Wikipédia ANGLAIS de l'ŒUVRE","analyse":"2-3 phrases : sujet, anecdote, ce qu'il faut repérer","droits":"libre OU sous-droits"}
      ]
    }
  ],
  "oeuvres_majeures_anonymes": [
    {"titre":"...","annee":"...","lieu":"...","wiki_en":"...","analyse":"...","droits":"libre"}
  ]
}

RÈGLES :
- Période d'art ANONYME (préhistoire, médiéval…) → "artistes": [] et remplis "oeuvres_majeures_anonymes".
- "wiki_en" = titre EXACT de l'article Wikipédia anglais (ex : "Lascaux", "The Birth of Venus"), sinon pas d'image possible.
- Sois EXHAUSTIF : ajoute TOUS les artistes marquants qui manquent (voir « DÉJÀ FAIT » ci-dessus, ne les répète pas inutilement — complète-les seulement si tu as mieux).
- 6 à 8 sections de bio par artiste ; n'invente jamais une date ou une œuvre incertaine.
- JSON strictement valide (guillemets droits, pas de virgule finale).
```
