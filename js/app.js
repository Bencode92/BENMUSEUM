/* =========================================================================
   Histoire de l'Art — d'après la structure de Gombrich (27 chapitres)
   Niveaux : Chapitre (étage) → Œuvre. Toujours contextuel (fil d'Ariane).
   Données : data/art.json (un seul fichier, facile à maintenir).
   ========================================================================= */

let CHAPITRES = [];
let DOSSIERS = [];
let IMAGES = {};             // manifeste des images résolues (data/images.json)
let FLAT = [];               // toutes les œuvres aplaties (pour le quiz)
const $ = id => document.getElementById(id);

const DV = "14"; // bump à chaque mise à jour de contenu pour court-circuiter le cache
Promise.all([
  fetch("data/art.json?v=" + DV).then(r => r.json()),
  fetch("data/dossiers.json?v=" + DV).then(r => r.json()).catch(() => ({ dossiers: [] })),
  fetch("data/images.json?v=" + DV).then(r => r.json()).catch(() => ({})),
])
  .then(([art, dos, img]) => {
    CHAPITRES = art.chapitres;
    CHAPITRES.forEach((c, ci) => (c.oeuvres || []).forEach((o, oi) =>
      FLAT.push({ ci, oi, chap: c, oeuvre: o })));
    DOSSIERS = dos.dossiers || [];
    IMAGES = img || {};
    buildFloors();
    route();
  })
  .catch(() => $("view").innerHTML = "<p>Impossible de charger les données — lance le site via un serveur (voir README), pas en file://.</p>");

/* ---------- images libres (API Wikipédia, CORS OK) ---------- */
const imgCache = new Map();
async function getImageUrl(title) {
  if (!title) return null;
  if (IMAGES[title]) return IMAGES[title].thumb || IMAGES[title].url; // manifeste enregistré (instantané)
  if (imgCache.has(title)) return imgCache.get(title);
  try {
    const u = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=900&titles=${encodeURIComponent(title)}&origin=*`;
    const j = await (await fetch(u)).json();
    const pages = j.query.pages; const first = pages[Object.keys(pages)[0]];
    const url = first?.thumbnail?.source || null; imgCache.set(title, url); return url;
  } catch { return null; }
}
function loadImages(root = document) {
  root.querySelectorAll("[data-wiki]").forEach(el => {
    if (el.dataset.loaded) return; el.dataset.loaded = "1";
    getImageUrl(el.dataset.wiki).then(url => {
      if (!url) return;
      if (el.tagName === "IMG") el.src = url;
      else el.style.backgroundImage = `url("${url}")`;
    });
  });
}
const esc = s => (s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const firstWiki = c => c.oeuvres?.[0]?.wiki || "";
const countW = c => (c.oeuvres || []).length;

/* ---------- rail des chapitres (étages) ---------- */
function buildFloors() {
  $("floorList").innerHTML = CHAPITRES.map((c, ci) =>
    `<li data-nav="#/c/${ci}" data-floor="${ci}">
       <span class="dot" style="background:${c.couleur}"></span>
       <span><span class="fl-nom">${c.num}. ${esc(c.titre)}</span><span class="fl-ep">${esc(c.portee)}</span></span>
     </li>`).join("");
}
function setActiveFloor(ci) {
  document.querySelectorAll("#floorList li").forEach(li => li.classList.toggle("active", li.dataset.floor == ci));
}

/* ---------- routage ---------- */
addEventListener("hashchange", route);
document.addEventListener("click", e => {
  if (e.target.closest("[data-fav]")) return; // géré par le handler favoris
  const t = e.target.closest("[data-nav]");
  if (t) { e.preventDefault(); location.hash = t.dataset.nav; }
});
function route() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const top = parts[0] || "";
  const tabKey = top === "c" ? "" : (top === "d" ? "dossiers" : top);
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.nav === "#/" + tabKey));
  scrollTo(0, 0);
  if (top === "quiz") { setActiveFloor(-1); return renderQuiz(); }
  if (top === "session") { setActiveFloor(-1); return startSession(); }
  if (top === "parcours") { setActiveFloor(-1); return renderParcours(); }
  if (top === "favoris") { setActiveFloor(-1); return renderFavoris(); }
  if (top === "dossiers") { setActiveFloor(-1); return renderDossiersList(); }
  if (top === "d") { setActiveFloor(-1); return renderDossier(parts[1]); }
  if (top === "c") {
    const ci = +parts[1]; setActiveFloor(ci);
    if (parts[2] === "o") return renderOeuvre(ci, +parts[3]);
    return renderChapitre(ci);
  }
  setActiveFloor(-1); return renderHome();
}

/* ---------- fil d'Ariane ---------- */
function crumb(items) {
  $("breadcrumb").innerHTML = items.map((it, i) =>
    (i ? '<span class="sep">›</span>' : "") +
    (it.nav ? `<a data-nav="${it.nav}">${esc(it.label)}</a>` : `<span>${esc(it.label)}</span>`)).join(" ");
}

/* ---------- ACCUEIL : les 27 chapitres ---------- */
function renderHome() {
  crumb([{ label: "Accueil" }]);
  $("view").innerHTML = `
    <div class="pagehead">
      <h1>Histoire de l'art</h1>
      <p class="lead">D'après les 27 chapitres de Gombrich. Monte les étages du temps : chaque chapitre a son idée, ses œuvres, son contexte.</p>
    </div>
    <div class="grid cols">
      ${CHAPITRES.map((c, ci) => `
        <div class="card" data-nav="#/c/${ci}">
          <div class="thumb" data-wiki="${esc(firstWiki(c))}"></div>
          <div class="body">
            <div class="t"><span class="chapnum" style="background:${c.couleur}">${c.num}</span> ${esc(c.titre)}</div>
            <div class="s">${esc(c.portee)}</div>
            <div class="r">${countW(c)} œuvre${countW(c) > 1 ? "s" : ""}</div>
          </div>
        </div>`).join("")}
    </div>`;
  loadImages($("view"));
}

/* ---------- CHAPITRE : idée centrale + œuvres ---------- */
function renderChapitre(ci) {
  const c = CHAPITRES[ci]; if (!c) return renderHome();
  crumb([{ label: "Accueil", nav: "#/" }, { label: `${c.num}. ${c.titre}` }]);
  const works = c.oeuvres || [];
  const dossier = c.dossier && DOSSIERS.find(x => x.id === c.dossier);
  const roster = c.roster || [];
  $("view").innerHTML = `
    <div class="pagehead">
      <div class="ep">Chapitre ${c.num} · p. ${c.page} · ${esc(c.titre_en)}</div>
      <h1>${esc(c.titre)} ${favBtn(`chapitre:${c.num}`, `Ch. ${c.num} — ${c.titre}`, `#/c/${ci}`, "chapitre")}</h1>
      <p class="lead">${esc(c.portee)}</p>
    </div>
    <div class="block"><h3>L'idée du chapitre</h3><p>${esc(c.idee)}</p></div>
    ${c.notion ? `<div class="memo"><b>Notion :</b> ${esc(c.notion)}</div>` : ""}
    ${dossier ? `<a class="dossier-link" data-nav="#/d/${dossier.id}">📚 Dossier complet : ${esc(dossier.titre)} →</a>` : ""}
    ${dossier && (dossier.probleme || dossier.liens) ? `
      <div class="block fil">
        <h3>🧵 Le fil</h3>
        ${dossier.probleme ? `<p><b>Pourquoi on crée :</b> ${esc(dossier.probleme)}</p>` : ""}
        ${dossier.liens?.d_ou ? `<p><b>← D'où ça vient :</b> ${esc(dossier.liens.d_ou)}</p>` : ""}
        ${dossier.liens?.mene ? `<p><b>Où ça mène → :</b> ${esc(dossier.liens.mene)}</p>` : ""}
      </div>` : ""}
    ${roster.length ? `
      <h2 style="margin:22px 0 0;font-size:20px">Qui / quoi couvre ce chapitre <small style="font-weight:normal;color:var(--muted);font-size:13px">(★ central · ○ secondaire — coche ce que tu sais)</small></h2>
      <ul class="roster">${roster.map(it => {
        const k = `chk:${c.num}:${it.nom}`;
        return `<li><label class="chk" data-k="${k}">
          <input type="checkbox" data-k="${k}">
          <span><span class="lvl ${it.niveau === "★" ? "star" : ""}">${it.niveau || "·"}</span>
          <span class="nm">${esc(it.nom)}</span>${it.detail ? ` <span class="dt">— ${esc(it.detail)}</span>` : ""}</span>
        </label></li>`;
      }).join("")}</ul>` : ""}
    ${works.length ? `<h2 style="margin:24px 0 0;font-size:20px">Œuvres en fiche</h2>
      <div class="grid cols">${works.map((o, oi) => `
        <div class="card" data-nav="#/c/${ci}/o/${oi}">
          <div class="thumb" data-wiki="${esc(o.wiki)}"></div>
          <div class="body"><div class="t">${esc(o.titre)}</div><div class="s">${esc(o.artiste)} · ${esc(o.annee)}</div></div>
        </div>`).join("")}</div>` : ""}
    ${notesBlock("chap:" + c.num)}`;
  loadImages($("view"));
  wireChecklist();
  wireNotes();
}

function wireChecklist() {
  $("view").querySelectorAll(".chk input[type=checkbox]").forEach(cb => {
    const k = cb.dataset.k;
    cb.checked = localStorage.getItem(k) === "1";
    cb.closest(".chk").classList.toggle("done", cb.checked);
    cb.addEventListener("change", () => {
      localStorage.setItem(k, cb.checked ? "1" : "0");
      cb.closest(".chk").classList.toggle("done", cb.checked);
    });
  });
}

/* ---------- ŒUVRE : la fiche d'apprentissage ---------- */
function renderOeuvre(ci, oi) {
  const c = CHAPITRES[ci], o = c?.oeuvres?.[oi];
  if (!o) return renderChapitre(ci);
  crumb([{ label: "Accueil", nav: "#/" }, { label: `${c.num}. ${c.titre}`, nav: `#/c/${ci}` }, { label: o.titre }]);
  const prev = oi > 0 ? `#/c/${ci}/o/${oi - 1}` : null;
  const next = oi < c.oeuvres.length - 1 ? `#/c/${ci}/o/${oi + 1}` : null;
  $("view").innerHTML = `
    <div class="fiche">
      <img class="img" alt="${esc(o.titre)}" data-wiki="${esc(o.wiki)}" />
      <div class="info">
        <h1>${esc(o.titre)} ${favBtn(`oeuvre:${ci}:${oi}`, `${o.titre} — ${o.artiste}`, `#/c/${ci}/o/${oi}`, "œuvre")}</h1>
        <div class="meta">${esc(o.artiste)} · ${esc(o.annee)}</div>
        <div class="tagline">
          <span class="tag gold" data-nav="#/c/${ci}">Ch. ${c.num} — ${esc(c.titre)}</span>
          <span class="tag">${esc(c.portee)}</span>
        </div>
        <div class="block"><h3>📖 Explication</h3><p>${esc(o.explication)}</p></div>
        <div class="block"><h3>🌍 Contexte à la création</h3><p>${esc(o.contexte)}</p></div>
        <div class="block"><h3>🔍 Éléments à repérer</h3><ul class="dots">${(o.elements || []).map(e => `<li>${esc(e)}</li>`).join("")}</ul></div>
        <div class="block"><h3>📚 L'idée du chapitre</h3><p>${esc(c.idee)}</p></div>
        <div class="block guide">
          <h3>💬 Demander au guide</h3>
          <textarea id="gq" placeholder="Pose ta question sur cette œuvre…"></textarea>
          <button class="ask" id="gask">Envoyer</button>
          <div class="answer" id="gans"></div>
        </div>
        ${notesBlock(`oeuvre:${ci}:${oi}`)}
        <div class="navworks">
          <button ${prev ? `data-nav="${prev}"` : "disabled"}>← Œuvre précédente</button>
          <button ${next ? `data-nav="${next}"` : "disabled"}>Œuvre suivante →</button>
        </div>
      </div>
    </div>`;
  loadImages($("view"));
  wireGuide(c, o, `oeuvre:${ci}:${oi}`);
  wireNotes();
}

function wireGuide(c, o, scope) {
  const btn = $("gask"), ans = $("gans");
  btn.onclick = async () => {
    const q = $("gq").value.trim(); if (!q) return;
    ans.className = "answer dim"; ans.textContent = "…";
    try {
      const r = await fetch("/api/ask", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          floorName: `${c.titre} (chap. ${c.num}, ${c.titre_en})`, epoque: c.portee,
          salle: { type: "theme", nom: c.titre, presentation: c.idee },
          work: { titre: o.titre, artiste: o.artiste, annee: o.annee, note: o.explication + " " + o.contexte },
          question: q, history: [],
        }),
      });
      if (!r.ok) throw new Error();
      const j = await r.json();
      ans.className = "answer"; ans.textContent = j.answer;
      // enrichir la fiche : ajouter la réponse à mes notes
      const add = document.createElement("button");
      add.className = "addnotebtn"; add.style.marginTop = "8px"; add.textContent = "+ Ajouter aux notes";
      add.onclick = () => {
        addNote(scope, `Q : ${q}\nGuide : ${j.answer}`);
        const box = $("view").querySelector(`.notes[data-scope="${scope}"]`);
        if (box) renderNotesList(box, scope);
        add.textContent = "✓ Ajouté"; add.disabled = true;
      };
      ans.after(add);
    } catch {
      ans.className = "answer dim";
      ans.textContent = "⚠️ Guide hors ligne. Active-le en local : ANTHROPIC_API_KEY=... node server.js (voir README).";
    }
  };
}

/* ---------- QUIZ / RÉVISION ---------- */
let quizState = { score: 0, total: 0 };
function pick(arr, n, exclude) {
  const pool = arr.filter(x => x !== exclude); const out = [];
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return out;
}
function renderQuiz() {
  crumb([{ label: "Réviser" }]);
  const item = FLAT[Math.floor(Math.random() * FLAT.length)];
  const types = [
    { q: "À quel chapitre se rattache cette œuvre ?", val: x => x.chap.titre, all: () => [...new Set(FLAT.map(x => x.chap.titre))] },
    { q: "Qui en est l'auteur ?", val: x => x.oeuvre.artiste, all: () => [...new Set(FLAT.map(x => x.oeuvre.artiste))] },
  ];
  const type = types[Math.floor(Math.random() * types.length)];
  const correct = type.val(item);
  const options = [correct, ...pick(type.all(), 3, correct)].sort(() => Math.random() - 0.5);
  $("view").innerHTML = `
    <div class="quiz">
      <div class="score">Score : ${quizState.score} / ${quizState.total}</div>
      <img class="qimg" data-wiki="${esc(item.oeuvre.wiki)}" alt="œuvre à deviner" />
      <div class="q">${type.q}</div>
      <div class="opts">${options.map(op => `<button class="opt">${esc(op)}</button>`).join("")}</div>
    </div>`;
  loadImages($("view"));
  let answered = false;
  $("view").querySelectorAll(".opt").forEach(b => b.onclick = () => {
    if (answered) return; answered = true; quizState.total++;
    if (b.textContent === correct) quizState.score++;
    $("view").querySelectorAll(".opt").forEach(x => {
      if (x.textContent === correct) x.classList.add("good");
      else if (x === b) x.classList.add("bad");
      x.disabled = true;
    });
    const reveal = document.createElement("div");
    reveal.style.cssText = "text-align:center;margin-top:14px;color:var(--muted)";
    reveal.innerHTML = `<b>${esc(item.oeuvre.titre)}</b> — ${esc(item.oeuvre.artiste)}, ${esc(item.oeuvre.annee)}.
      <a data-nav="#/c/${item.ci}/o/${item.oi}" style="color:var(--gold);cursor:pointer">voir la fiche →</a>`;
    $("view").querySelector(".quiz").appendChild(reveal);
    const nb = document.createElement("button"); nb.className = "next"; nb.textContent = "Question suivante →";
    nb.onclick = renderQuiz; $("view").querySelector(".quiz").appendChild(nb);
  });
}

/* ---------- DOSSIERS (modules d'apprentissage riches) ---------- */
function renderDossiersList() {
  crumb([{ label: "Dossiers" }]);
  $("view").innerHTML = `
    <div class="pagehead"><h1>Dossiers d'apprentissage</h1>
      <p class="lead">Des modules complets par grande période : contexte, mentalités, innovations, œuvres décortiquées, artistes, index et auto-test.</p></div>
    ${DOSSIERS.length ? `<div class="grid cols">${DOSSIERS.map(d => `
      <div class="card" data-nav="#/d/${d.id}">
        <div class="thumb" data-wiki="${esc(d.oeuvres?.[0]?.wiki || "")}"></div>
        <div class="body"><div class="t">${esc(d.titre)}</div><div class="s">${esc(d.periode)}</div></div>
      </div>`).join("")}</div>`
    : `<p class="lead">Aucun dossier pour l'instant. Dépose un fichier .md dans <code>sources/</code> et je le convertis.</p>`}`;
  loadImages($("view"));
}

function renderDossier(id) {
  const d = DOSSIERS.find(x => x.id === id); if (!d) return renderDossiersList();
  crumb([{ label: "Dossiers", nav: "#/dossiers" }, { label: d.titre }]);
  const sec = (title, html) => html ? `<h2 class="sec">${title}</h2>${html}` : "";
  const ul = arr => `<ul class="dots">${arr.map(c => `<li>${esc(c)}</li>`).join("")}</ul>`;
  const P = [];

  P.push(`<div class="pagehead"><div class="ep">${esc(d.periode)}</div>
    <h1>${esc(d.titre)} ${favBtn(`dossier:${d.id}`, d.titre, `#/d/${d.id}`, "dossier")}</h1>
    ${d.sous_titre ? `<p class="lead">${esc(d.sous_titre)}</p>` : ""}</div>`);

  if (d.recit) P.push(sec("📖 Le récit",
    d.recit.map(s => `<div class="block recit"><h3>${esc(s.h)}</h3><p>${esc(s.p)}</p></div>`).join("")));

  if (d.carte) P.push(sec("🪪 Carte d'identité",
    `<table class="kv">${d.carte.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}</table>`));

  // contexte : bullets et/ou prose + phrase-clé
  let ctx = "";
  if (Array.isArray(d.contexte)) ctx += ul(d.contexte);
  if (d.bascule) ctx += `<p>${esc(d.bascule)}</p>`;
  if (d.phrase) ctx += `<div class="phrase">${esc(d.phrase)}</div>`;
  P.push(sec("🌍 Contexte & mentalités", ctx));

  if (d.mentalites) P.push(sec("🔄 La bascule des mentalités",
    `<div class="block"><h3>Avant — le Moyen Âge</h3><p>${esc(d.mentalites.avant)}</p></div>
     <p style="margin:6px 0"><b>Les renversements :</b></p>
     <ol class="rev">${d.mentalites.renversements.map(r => `<li>${esc(r)}</li>`).join("")}</ol>
     ${d.mentalites.phrase ? `<div class="phrase">${esc(d.mentalites.phrase)}</div>` : ""}`));

  if (d.probleme) P.push(sec("🎯 Le problème central", `<div class="phrase">${esc(d.probleme)}</div>`));
  if (d.caracteristiques) P.push(sec("👁 Caractéristiques visuelles", ul(d.caracteristiques)));
  if (d.genres) P.push(sec("🎭 Les genres", ul(d.genres)));

  if (d.mouvements) P.push(sec("🧭 Les grands mouvements",
    `<table class="tbl"><tr><th>Mouvement</th><th>Vers</th><th>Idée</th><th>Figures</th></tr>
     ${d.mouvements.map(([n, v, i, f]) => `<tr><td><b>${esc(n)}</b></td><td>${esc(v)}</td><td>${esc(i)}</td><td>${esc(f)}</td></tr>`).join("")}</table>`));

  if (d.innovations) P.push(sec("🛠 Les innovations techniques",
    `<table class="tbl"><tr><th>Innovation</th><th>Qui / quand</th><th>Ce que ça résout</th></tr>
     ${d.innovations.map(([n, q, r]) => `<tr><td><b>${esc(n)}</b></td><td>${esc(q)}</td><td>${esc(r)}</td></tr>`).join("")}</table>
     ${d.memo_outils ? `<div class="memo">${esc(d.memo_outils)}</div>` : ""}`));

  if (d.courants) P.push(sec("🗺 Les courants",
    `${d.courants.map(([n, desc]) => `<div class="block"><h3>${esc(n)}</h3><p>${esc(desc)}</p></div>`).join("")}
     ${d.memo_geo ? `<div class="memo">${esc(d.memo_geo)}</div>` : ""}`));

  if (d.oeuvres) P.push(sec("🖼 Pourquoi c'est du génie (œuvres décortiquées)",
    `<div class="grid cols">${d.oeuvres.map(o => `
      <div class="card"><div class="thumb" data-wiki="${esc(o.wiki)}"></div>
        <div class="body"><div class="t">${esc(o.titre)} ${favBtn(`oeuvre-d:${d.id}:${o.titre}`, `${o.titre} — ${o.artiste}`, `#/d/${d.id}`, "œuvre")}</div>
        <div class="s">${esc(o.artiste)} · ${esc(o.annee)}${o.lieu ? ` · ${esc(o.lieu)}` : ""}</div>
        <p style="font-size:13px;margin-top:8px">${esc(o.genie)}</p>
        ${o.analyse ? `<details class="deep"><summary>📖 Analyse approfondie</summary><p>${esc(o.analyse)}</p></details>` : ""}</div></div>`).join("")}</div>`));

  if (d.artistes) P.push(sec("👤 Les artistes",
    `<div class="grid cols">${d.artistes.map(a => `
      <div class="card"><div class="thumb" data-wiki="${esc(a.wiki)}"></div>
        <div class="body"><div class="t">${a.niveau ? `<span class="lvl ${a.niveau === "★" ? "star" : ""}">${a.niveau}</span> ` : ""}${esc(a.nom)} ${favBtn(`artiste:${a.nom}`, a.nom, `#/d/${d.id}`, "artiste")}</div>
        <div class="s">${esc(a.dates)}${a.role ? ` — ${esc(a.role)}` : ""}</div>
        <p style="font-size:13px;margin-top:8px">${esc(a.portrait)}</p>
        ${a.bio_longue ? `<details class="deep"><summary>📖 Lire son histoire</summary><p>${esc(a.bio_longue)}</p></details>` : ""}</div></div>`).join("")}</div>`));

  if (!d.artistes && d.artistes_note) P.push(sec("👤 Les artistes", `<p>${esc(d.artistes_note)}</p>`));

  if (d.index) P.push(sec("📑 Index de référence",
    d.index.map(g => `${g.ecole ? `<h3 style="font-family:Georgia;margin:16px 0 6px">${esc(g.ecole)}</h3>` : ""}
      <table class="tbl"><tr><th></th><th>Artiste</th><th>Dates</th><th>Œuvres & repères</th></tr>
      ${g.items.map(([n, star, dates, det]) => `<tr><td>${star ? '<span class="star">★</span>' : "○"}</td><td><b>${esc(n)}</b></td><td>${esc(dates)}</td><td>${esc(det)}</td></tr>`).join("")}</table>`).join("")));

  if (d.incontournables) P.push(sec("⭐ Les incontournables",
    `<table class="tbl"><tr><th>Œuvre</th><th>Artiste</th><th>Où la voir</th></tr>
     ${d.incontournables.map(([o, a, w]) => `<tr><td><b>${esc(o)}</b></td><td>${esc(a)}</td><td>${esc(w)}</td></tr>`).join("")}</table>`));

  if (d.liens) P.push(sec("🔗 Relier",
    `${d.liens.d_ou ? `<div class="block"><h3>D'où ça vient</h3><p>${esc(d.liens.d_ou)}</p></div>` : ""}
     ${d.liens.mene ? `<div class="block"><h3>Où ça mène</h3><p>${esc(d.liens.mene)}</p></div>` : ""}`));

  if (d.memos) P.push(sec("🧠 Mémos", `<ul class="dots">${d.memos.map(m => `<li><i>${esc(m)}</i></li>`).join("")}</ul>`));
  if (d.autotest) P.push(sec("✅ Auto-test", `<ol class="rev">${d.autotest.map(q => `<li>${esc(q)}</li>`).join("")}</ol>`));

  $("view").innerHTML = `<div class="dossier">${P.join("")}</div>`;
  loadImages($("view"));
  wireNotes();
}

/* =========================================================================
   FAVORIS (référence) — étoile sur œuvres, artistes, dossiers
   ========================================================================= */
function favs() { try { return JSON.parse(localStorage.getItem("museum:favs")) || {}; } catch { return {}; } }
function isFav(key) { return !!favs()[key]; }
function favBtn(key, label, nav, type) {
  return `<button class="fav ${isFav(key) ? "on" : ""}" data-fav="${esc(key)}" data-fav-label="${esc(label)}" data-fav-nav="${esc(nav)}" data-fav-type="${esc(type)}" title="Mettre en favori">${isFav(key) ? "★" : "☆"}</button>`;
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-fav]"); if (!b) return;
  e.preventDefault(); e.stopPropagation();
  const f = favs(); const k = b.dataset.fav;
  if (f[k]) delete f[k];
  else f[k] = { label: b.dataset.favLabel, nav: b.dataset.favNav, type: b.dataset.favType };
  localStorage.setItem("museum:favs", JSON.stringify(f));
  const on = !!favs()[k]; b.classList.toggle("on", on); b.textContent = on ? "★" : "☆";
});

function renderFavoris() {
  crumb([{ label: "Favoris" }]);
  const f = favs(); const keys = Object.keys(f);
  if (!keys.length) {
    $("view").innerHTML = `<div class="pagehead"><h1>Mes favoris</h1>
      <p class="lead">Aucun favori pour l'instant. Clique l'étoile ☆ sur une œuvre, un artiste ou un dossier pour le retrouver ici.</p></div>`;
    return;
  }
  const groups = {};
  keys.forEach(k => { const it = f[k]; (groups[it.type] ||= []).push({ k, ...it }); });
  const labels = { "œuvre": "Œuvres", "artiste": "Artistes", "dossier": "Dossiers", "chapitre": "Chapitres" };
  $("view").innerHTML = `<div class="pagehead"><h1>Mes favoris</h1>
    <p class="lead">${keys.length} élément${keys.length > 1 ? "s" : ""} mis de côté.</p></div>
    ${Object.entries(groups).map(([type, items]) => `
      <h2 style="margin:18px 0 6px;font-size:20px">${labels[type] || type}</h2>
      <ul class="favlist">${items.map(it => `
        <li><a data-nav="${esc(it.nav)}">${esc(it.label)}</a>
        <button class="fav on" data-fav="${esc(it.k)}" data-fav-label="${esc(it.label)}" data-fav-nav="${esc(it.nav)}" data-fav-type="${esc(type)}" title="Retirer">★</button></li>`).join("")}</ul>`).join("")}`;
}

/* =========================================================================
   MES NOTES (archivage) — la fiche s'enrichit
   ========================================================================= */
function notesKey(scope) { return "museum:notes:" + scope; }
function userNotes(scope) { try { return JSON.parse(localStorage.getItem(notesKey(scope))) || []; } catch { return []; } }
function notesBlock(scope) {
  return `<div class="block notes" data-scope="${esc(scope)}">
    <h3>📝 Mes notes — la fiche s'enrichit</h3>
    <ul class="usernotes"></ul>
    <div class="addnote"><textarea class="noteinput" placeholder="Ajoute une info, une remarque, ce que t'a dit le guide…"></textarea>
    <button class="addnotebtn">Ajouter</button></div>
  </div>`;
}
function renderNotesList(box, scope) {
  const arr = userNotes(scope);
  box.querySelector(".usernotes").innerHTML = arr.map((n, i) =>
    `<li>${esc(n)} <button class="delnote" data-i="${i}" title="Supprimer">×</button></li>`).join("");
  box.querySelectorAll(".delnote").forEach(b => b.onclick = () => {
    const a = userNotes(scope); a.splice(+b.dataset.i, 1); localStorage.setItem(notesKey(scope), JSON.stringify(a)); renderNotesList(box, scope);
  });
}
function addNote(scope, text) {
  const a = userNotes(scope); a.push(text); localStorage.setItem(notesKey(scope), JSON.stringify(a));
}
function wireNotes() {
  $("view").querySelectorAll(".notes").forEach(box => {
    const scope = box.dataset.scope;
    renderNotesList(box, scope);
    box.querySelector(".addnotebtn").onclick = () => {
      const ta = box.querySelector(".noteinput"); const v = ta.value.trim(); if (!v) return;
      addNote(scope, v); ta.value = ""; renderNotesList(box, scope);
    };
  });
}

/* =========================================================================
   PARCOURS — le fil rouge accessible (cycles, contexte, mouvements, pourquoi)
   ========================================================================= */
const ACTES = [
  { titre: "Acte I — Aux origines", ch: "1 → 2", chFrom: 1, couleur: "#b06a2c",
    contexte: "Avant l'État puis avec les premiers grands empires. L'art n'existe pas « pour le beau ».",
    pourquoi: "On crée pour AGIR sur le monde : magie de la chasse (préhistoire), survie dans l'au-delà (Égypte).",
    mouvements: ["Art pariétal", "Art égyptien", "Mésopotamie, Crète"],
    cle: "Représenter ce qu'on SAIT, pas ce qu'on voit." },
  { titre: "Acte II — Le grand regard", ch: "3 → 5", chFrom: 3, couleur: "#4f7fb5",
    contexte: "Cités grecques et démocratie, puis l'Empire romain.",
    pourquoi: "On crée pour COMPRENDRE et idéaliser le monde visible : le corps, le mouvement, la beauté.",
    mouvements: ["Classicisme grec", "Hellénistique (pathos)", "Art romain"],
    cle: "L'œil devient juge : on peint enfin ce qu'on VOIT." },
  { titre: "Acte III — L'âge du sacré", ch: "6 → 11", chFrom: 6, couleur: "#8a5ca0",
    contexte: "Chute de Rome, Église toute-puissante, Byzance — et en parallèle, l'Islam et la Chine.",
    pourquoi: "On crée pour CROIRE : l'image devient signe du divin. Le réalisme est volontairement abandonné… puis Giotto le ranime.",
    mouvements: ["Byzantin", "Islam / Chine", "Roman", "Gothique", "Giotto"],
    cle: "L'image au service de la foi ; le réalisme se perd, puis renaît." },
  { titre: "Acte IV — La conquête du réel", ch: "12 → 17", chFrom: 12, couleur: "#2f8f5a",
    contexte: "Florence des Médicis, Rome des papes, Venise, et la Renaissance du Nord.",
    pourquoi: "On crée pour MAÎTRISER le monde : perspective, anatomie, lumière. L'artiste devient un génie.",
    mouvements: ["Première Renaissance", "Haute Renaissance", "Venise (couleur)", "Nord (détail)"],
    cle: "Le réalisme reconquis et porté à la perfection." },
  { titre: "Acte V — Le drame et le pouvoir", ch: "18 → 23", chFrom: 18, couleur: "#b5642a",
    contexte: "Contre-Réforme, monarchies absolues, marché libre hollandais, Lumières.",
    pourquoi: "On crée pour ÉMOUVOIR et IMPRESSIONNER : après la perfection, on la tord, on frappe, on séduit, on observe.",
    mouvements: ["Maniérisme", "Baroque", "Hollande", "Rococo", "Âge de raison"],
    cle: "La perfection acquise : la déformer, l'émouvoir, l'observer." },
  { titre: "Acte VI — La liberté et l'expérience", ch: "24 → 27", chFrom: 24, couleur: "#c0392b",
    contexte: "Révolutions politiques et industrielles, invention de la photographie, XXe siècle.",
    pourquoi: "On crée pour S'EXPRIMER et CHERCHER : la tradition se brise, la photo prend l'imitation, l'art se demande ce qu'il peut être.",
    mouvements: ["Néoclassicisme / Romantisme", "Réalisme", "Impressionnisme", "Cubisme · Abstraction · Surréalisme · Dada"],
    cle: "L'artiste libre : l'art n'imite plus, il invente." },
];

function renderParcours() {
  crumb([{ label: "Parcours" }]);
  const chToIndex = n => { const i = CHAPITRES.findIndex(c => c.num === n); return i < 0 ? 0 : i; };
  const due = sessionStats();
  $("view").innerHTML = `
    <div class="session-cta">
      <div><h2>🎬 Session du jour</h2>
      <p>~10 min : une œuvre racontée, une observation, tes cartes à revoir, un cliffhanger.${due ? ` <b>${due} carte${due > 1 ? "s" : ""} à revoir aujourd'hui.</b>` : ""}</p></div>
      <button class="big" data-nav="#/session">▶ Continuer</button>
    </div>
    <div class="pagehead">
      <h1>Le fil de l'histoire de l'art</h1>
      <p class="lead">Toute l'histoire de l'art tient en une question qui évolue : <i>comment, et pourquoi, faire une image ?</i> Voici le fil rouge — le contexte, les mouvements et la motivation de chaque grande époque.</p>
    </div>
    <div class="phrase">🧵 <b>Le grand cycle :</b> la Grèce apprend à <b>voir</b> (Acte II), le Moyen Âge l'oublie volontairement pour <b>croire</b> (Acte III), la Renaissance <b>reconquiert</b> le réel (Acte IV), et le XXe siècle s'en <b>libère</b> (Acte VI). L'art respire entre <b>représenter</b> et <b>signifier</b>.</div>
    ${ACTES.map(a => `
      <div class="acte" style="border-left:5px solid ${a.couleur}">
        <h2 class="sec" style="border:none;margin:10px 0 4px">${esc(a.titre)} <small style="color:var(--muted);font-weight:normal;font-size:14px">· chapitres ${esc(a.ch)}</small></h2>
        <p><b>🌍 Contexte —</b> ${esc(a.contexte)}</p>
        <p><b>🎯 Pourquoi on crée —</b> ${esc(a.pourquoi)}</p>
        <p><b>🗺 Mouvements —</b> ${a.mouvements.map(m => `<span class="tag">${esc(m)}</span>`).join(" ")}</p>
        <div class="memo">${esc(a.cle)}</div>
        <a class="dossier-link" data-nav="#/c/${chToIndex(a.chFrom)}">Entrer dans l'Acte (ch. ${a.chFrom}) →</a>
      </div>`).join("")}`;
}

/* =========================================================================
   SESSION DU JOUR — récit + observation + répétition espacée (Leitner)
   « On ne choisit pas, on continue. »
   ========================================================================= */
const SRS_INTERVALS = [1, 3, 7, 16, 35]; // jours par boîte (1→5)
const today = () => new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const addDays = n => new Date(Date.now() + n * 86400000 - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
function srsStore() { try { return JSON.parse(localStorage.getItem("museum:srs")) || {}; } catch { return {}; } }
function srsSave(s) { localStorage.setItem("museum:srs", JSON.stringify(s)); }

// cartes = œuvres en fiche qui ont une image
function buildCards() {
  const cards = [];
  CHAPITRES.forEach((c, ci) => (c.oeuvres || []).forEach((o, oi) => {
    if (IMAGES[o.wiki]) cards.push({ id: `w:${ci}:${oi}`, ci, oi, titre: o.titre, artiste: o.artiste, wiki: o.wiki, expl: o.explication, ctx: o.contexte, chNum: c.num, chTitre: c.titre });
  }));
  return cards;
}
function introduceCard(id) {
  const s = srsStore(); if (s[id]) return; s[id] = { box: 1, due: addDays(1), seen: 1 }; srsSave(s);
}
function gradeCard(id, good) {
  const s = srsStore(); const cur = s[id] || { box: 1, seen: 0 };
  const box = good ? Math.min((cur.box || 1) + 1, 5) : 1;
  s[id] = { box, due: addDays(SRS_INTERVALS[box - 1]), seen: (cur.seen || 0) + 1 };
  srsSave(s);
}
function sessionStats() {
  const s = srsStore(), t = today();
  return buildCards().filter(c => s[c.id] && s[c.id].due <= t).length;
}

let SESSION = null;
function buildSession() {
  const cards = buildCards(); const s = srsStore(); const t = today();
  const seen = cards.filter(c => s[c.id]);
  const newCard = cards.find(c => !s[c.id]) || null;
  const due = seen.filter(c => s[c.id].due <= t).slice(0, 6);
  const steps = [];
  if (newCard) { steps.push({ type: "story", card: newCard }); steps.push({ type: "observe", card: newCard }); }
  due.forEach(card => steps.push({ type: "flash", card }));
  // si rien de neuf ni de dû, on révise quand même quelques cartes vues (ou un aperçu)
  if (!steps.length) {
    const pool = (seen.length ? seen : cards).sort(() => Math.random() - 0.5).slice(0, 5);
    pool.forEach(card => steps.push({ type: "flash", card }));
  }
  steps.push({ type: "end", card: newCard || due[0] || cards[0] });
  return steps;
}
function startSession() { SESSION = { steps: buildSession(), i: 0 }; renderSession(); }

function cliffhanger(card) {
  if (!card) return "";
  const c = CHAPITRES[card.ci]; const d = c && c.dossier && DOSSIERS.find(x => x.id === c.dossier);
  if (d && d.liens && d.liens.mene) return d.liens.mene;
  const nextCh = CHAPITRES.find(x => x.num === c.chNum + 1);
  return nextCh ? `Et après ? ${nextCh.num}. ${nextCh.titre} — ${nextCh.idee}` : "Tu as parcouru jusqu'au bout du fil.";
}

function renderSession() {
  if (!SESSION) return startSession();
  crumb([{ label: "Session du jour" }]);
  const step = SESSION.steps[SESSION.i];
  const n = SESSION.steps.length;
  const prog = `<div class="sess-prog">Étape ${Math.min(SESSION.i + 1, n)} / ${n}</div>`;

  if (!step || step.type === "end") {
    const tease = step ? cliffhanger(step.card) : "";
    $("view").innerHTML = `<div class="session">
      ${prog}
      <div class="sess-card">
        <h2>🎬 À suivre…</h2>
        <p class="phrase">${esc(tease)}</p>
        <p style="color:var(--muted)">Session terminée. Reviens demain : tes cartes remonteront au bon moment.</p>
        <div class="sess-actions">
          <button class="next" id="sessAgain">Encore une session →</button>
          <button class="optbtn" data-nav="#/parcours">Retour au parcours</button>
        </div>
      </div></div>`;
    $("sessAgain") && ($("sessAgain").onclick = startSession);
    return;
  }

  const card = step.card;
  const adv = () => { SESSION.i++; renderSession(); };

  if (step.type === "story") {
    introduceCard(card.id);
    $("view").innerHTML = `<div class="session">${prog}
      <div class="sess-card">
        <div class="ep">Épisode · Chapitre ${card.chNum} — ${esc(card.chTitre)}</div>
        <img class="sess-img" data-wiki="${esc(card.wiki)}" alt="${esc(card.titre)}" />
        <h2>${esc(card.titre)}</h2><div class="meta">${esc(card.artiste)}</div>
        <p>${esc(card.expl)}</p><p style="color:var(--muted)">${esc(card.ctx)}</p>
        <div class="sess-actions"><button class="next" id="cont">Continuer →</button></div>
      </div></div>`;
    loadImages($("view")); $("cont").onclick = adv; return;
  }

  if (step.type === "observe") {
    const c = CHAPITRES[card.ci]; const o = c.oeuvres[card.oi];
    $("view").innerHTML = `<div class="session">${prog}
      <div class="sess-card">
        <img class="sess-img" data-wiki="${esc(card.wiki)}" alt="" />
        <h2>Que remarques-tu ?</h2>
        <p style="color:var(--muted)">Observe l'œuvre quelques secondes avant de dévoiler.</p>
        <ul class="dots" id="obs" hidden>${(o.elements || []).map(e => `<li>${esc(e)}</li>`).join("")}</ul>
        <div class="sess-actions">
          <button class="optbtn" id="reveal">👁 Ce qu'il faut repérer</button>
          <button class="next" id="cont" hidden>Continuer →</button>
        </div>
      </div></div>`;
    loadImages($("view"));
    $("reveal").onclick = () => { $("obs").hidden = false; $("reveal").hidden = true; $("cont").hidden = false; };
    $("cont").onclick = adv; return;
  }

  if (step.type === "flash") {
    $("view").innerHTML = `<div class="session">${prog}
      <div class="sess-card">
        <div class="ep">Carte à réviser</div>
        <img class="sess-img" data-wiki="${esc(card.wiki)}" alt="" />
        <h2>Quelle est cette œuvre ? De quel chapitre ?</h2>
        <div id="verso" hidden>
          <p><b>${esc(card.titre)}</b> — ${esc(card.artiste)}</p>
          <p style="color:var(--muted)">Chapitre ${card.chNum} — ${esc(card.chTitre)}</p>
          <p>${esc(card.expl)}</p>
        </div>
        <div class="sess-actions">
          <button class="next" id="flip">Retourner la carte</button>
          <div id="grade" hidden>
            <button class="optbtn bad" id="again">↻ À revoir</button>
            <button class="optbtn good" id="known">✓ Je savais</button>
          </div>
        </div>
      </div></div>`;
    loadImages($("view"));
    $("flip").onclick = () => { $("verso").hidden = false; $("flip").hidden = true; $("grade").hidden = false; };
    $("again").onclick = () => { gradeCard(card.id, false); adv(); };
    $("known").onclick = () => { gradeCard(card.id, true); adv(); };
    return;
  }
}
