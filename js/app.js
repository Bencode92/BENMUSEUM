/* =========================================================================
   Histoire de l'Art — d'après la structure de Gombrich (27 chapitres)
   Niveaux : Chapitre (étage) → Œuvre. Toujours contextuel (fil d'Ariane).
   Données : data/art.json (un seul fichier, facile à maintenir).
   ========================================================================= */

let CHAPITRES = [];
let DOSSIERS = [];
let FLAT = [];               // toutes les œuvres aplaties (pour le quiz)
const $ = id => document.getElementById(id);

const DV = "11"; // bump à chaque mise à jour de contenu pour court-circuiter le cache
Promise.all([
  fetch("data/art.json?v=" + DV).then(r => r.json()),
  fetch("data/dossiers.json?v=" + DV).then(r => r.json()).catch(() => ({ dossiers: [] })),
])
  .then(([art, dos]) => {
    CHAPITRES = art.chapitres;
    CHAPITRES.forEach((c, ci) => (c.oeuvres || []).forEach((o, oi) =>
      FLAT.push({ ci, oi, chap: c, oeuvre: o })));
    DOSSIERS = dos.dossiers || [];
    buildFloors();
    route();
  })
  .catch(() => $("view").innerHTML = "<p>Impossible de charger les données — lance le site via un serveur (voir README), pas en file://.</p>");

/* ---------- images libres (API Wikipédia, CORS OK) ---------- */
const imgCache = new Map();
async function getImageUrl(title) {
  if (!title) return null;
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
      <h1>${esc(c.titre)}</h1>
      <p class="lead">${esc(c.portee)}</p>
    </div>
    <div class="block"><h3>L'idée du chapitre</h3><p>${esc(c.idee)}</p></div>
    ${c.notion ? `<div class="memo"><b>Notion :</b> ${esc(c.notion)}</div>` : ""}
    ${dossier ? `<a class="dossier-link" data-nav="#/d/${dossier.id}">📚 Dossier complet : ${esc(dossier.titre)} →</a>` : ""}
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
        </div>`).join("")}</div>` : ""}`;
  loadImages($("view"));
  wireChecklist();
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
        <h1>${esc(o.titre)}</h1>
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
        <div class="navworks">
          <button ${prev ? `data-nav="${prev}"` : "disabled"}>← Œuvre précédente</button>
          <button ${next ? `data-nav="${next}"` : "disabled"}>Œuvre suivante →</button>
        </div>
      </div>
    </div>`;
  loadImages($("view"));
  wireGuide(c, o);
}

function wireGuide(c, o) {
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

  P.push(`<div class="pagehead"><div class="ep">${esc(d.periode)}</div><h1>${esc(d.titre)}</h1>
    ${d.sous_titre ? `<p class="lead">${esc(d.sous_titre)}</p>` : ""}</div>`);

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
        <div class="body"><div class="t">${esc(o.titre)}</div>
        <div class="s">${esc(o.artiste)} · ${esc(o.annee)}${o.lieu ? ` · ${esc(o.lieu)}` : ""}</div>
        <p style="font-size:13px;margin-top:8px">${esc(o.genie)}</p></div></div>`).join("")}</div>`));

  if (d.artistes) P.push(sec("👤 Les artistes",
    `<div class="grid cols">${d.artistes.map(a => `
      <div class="card"><div class="thumb" data-wiki="${esc(a.wiki)}"></div>
        <div class="body"><div class="t">${a.niveau ? `<span class="lvl ${a.niveau === "★" ? "star" : ""}">${a.niveau}</span> ` : ""}${esc(a.nom)}</div>
        <div class="s">${esc(a.dates)}${a.role ? ` — ${esc(a.role)}` : ""}</div>
        <p style="font-size:13px;margin-top:8px">${esc(a.portrait)}</p></div></div>`).join("")}</div>`));

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
}
