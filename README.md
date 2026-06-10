# 🏛 Histoire de l'Art — plateforme d'apprentissage

Un outil **pour apprendre** l'histoire de l'art, dans le navigateur.
On « monte les étages » du temps : chaque **étage = une période**, et l'on descend
en profondeur de façon toujours contextuelle :

```
PÉRIODE (contexte de l'époque)
  └─ STYLE / MOUVEMENT (explication du style)
       └─ ARTISTE (qui il était)
            └─ ŒUVRE  →  image + explication + contexte de création + éléments à repérer
```

Plus un **mode Réviser** (quiz : période, style, auteur) pour mémoriser.

> Projet personnel, non commercial. Tout le contenu vit dans **`data/art.json`**
> (un seul fichier, facile à éditer). Les images sont chargées en direct depuis
> Wikipédia (domaine public) ; aucune image n'est stockée dans le dépôt.
> L'ancienne visite 3D est conservée dans `archive/` (non maintenue).

---

## 🚀 Lancer le musée

Le site est 100 % statique : il lui faut juste un serveur (jamais `file://`).

### Option A — avec le guide IA (recommandé)
Node 18+ requis. Aucune dépendance à installer.

```bash
cd musee-art
ANTHROPIC_API_KEY=sk-ant-xxxxx node server.js
# puis ouvre http://localhost:8080
```

Ta clé reste **côté serveur**, jamais exposée au navigateur.
Modèle par défaut : `claude-sonnet-4-6` (modifiable : `MODEL=claude-opus-4-8 node server.js`).

### Option B — sans IA (visite seule)
N'importe quel serveur statique suffit :

```bash
cd musee-art
python3 -m http.server 8080
# ou : npx serve .
```

La visite fonctionne ; le guide répondra simplement « hors ligne ».

---

## 🎮 Se déplacer

| Action | Effet |
|---|---|
| **Clic sur le sol** | tu glisses jusqu'au point |
| **Clic sur une œuvre** | tu t'en approches + panneau d'explication |
| **Clic sur l'avatar** | discussion avec le guide IA |
| **Glisser la souris** | regarder autour |
| **ZQSD / flèches** | marcher |
| **Portail au fond / à l'entrée** | salle suivante / précédente (change d'étage) |
| **Bouton 🛗 Étages** | plan du musée, saut direct |

---

## 🗿 Ajouter une vraie sculpture 3D

Par défaut, les sculptures s'affichent en **photo posée sur un socle**.
Pour passer une pièce en **vraie 3D** :

1. Télécharge un modèle **`.glb`** libre (CC0). Sources :
   - **Scan the World** (Sketchfab) — David, Vénus de Milo, etc.
   - **Smithsonian Open Access** — https://3d.si.edu/
2. Dépose le fichier dans `models/` (ex. `models/david.glb`).
3. Dans `data/periods.json`, renseigne le champ `model` de l'œuvre :
   ```json
   { "titre": "David", "support": "socle", "model": "models/david.glb", ... }
   ```
Si le modèle est absent ou ne charge pas → retour automatique à la photo-socle.

---

## ✏️ Enrichir le contenu

Tout le contenu est dans **`data/periods.json`** — structure :

```
floors[]            une période = un étage
 └─ salles[]        type "artiste" (bio dans "presentation") ou "theme"
     └─ oeuvres[]   titre, wiki (titre de l'article Wikipédia EN pour l'image),
                    artiste, annee, support ("mur"|"socle"|"plafond"), note, model
```

Les questions posées au guide et ses réponses sont enregistrées dans
`data/notes.json` (côté serveur) et dans le navigateur — de quoi enrichir
le contenu au fil des visites.

---

## ☁️ Déployer (optionnel)

- **Visite seule** → GitHub Pages (gratuit) : pousse le dossier, active Pages.
  Le guide IA sera « hors ligne » (Pages ne peut pas héberger la clé).
- **Avec guide IA** → déploie `server.js` sur un petit hébergeur Node
  (Render, Railway, Fly.io…) ou réécris `/api/ask` en fonction serverless
  (Cloudflare Workers, Vercel) avec la clé en variable d'environnement.

---

## 🧱 Pile technique
HTML / CSS / JavaScript · **Three.js** (3D navigateur) · API Wikipédia (images
domaine public) · API Claude (guide). Zéro build, zéro framework.
