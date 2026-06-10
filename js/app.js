/* =========================================================================
   Histoire de l'Art — plateforme d'apprentissage (2D, sans 3D)
   Hiérarchie : Période → Style/Mouvement → Artiste → Œuvre, toujours contextuelle.
   Données : data/art.json (un seul fichier, facile à maintenir).
   ========================================================================= */

let PERIODES = [];
let FLAT = [];               // toutes les œuvres aplaties (pour le quiz)
const $ = id => document.getElementById(id);

fetch("data/art.json")
  .then(r => r.json())
  .then(data => {
    PERIODES = data.periodes;
    PERIODES.forEach((p, pi) => p.styles.forEach((s, si) => s.artistes.forEach((a, ai) => a.oeuvres.forEach((o, oi) =>
      FLAT.push({ pi, si, ai, oi, periode: p, style: s, artiste: a, oeuvre: o })))));
    buildFloors();
    route();
  })
  .catch(() => $("view").innerHTML = "<p>Impossible de charger data/art.json — lance le site via un serveur (voir README), pas en file://.</p>");

/* ---------- images libres (API Wikipédia, CORS OK) ---------- */
const imgCache = new Map();
async function getImageUrl(title) {
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

/* ---------- rail des étages ---------- */
function buildFloors() {
  $("floorList").innerHTML = PERIODES.map((p, pi) =>
    `<li data-nav="#/p/${pi}" data-floor="${pi}">
       <span class="dot" style="background:${p.couleur}"></span>
       <span><span class="fl-nom">${esc(p.nom)}</span><span class="fl-ep">${esc(p.epoque)}</span></span>
     </li>`).join("");
}
function setActiveFloor(pi) {
  document.querySelectorAll("#floorList li").forEach(li =>
    li.classList.toggle("active", li.dataset.floor == pi));
}

/* ---------- routage ---------- */
addEventListener("hashchange", route);
document.addEventListener("click", e => {
  const t = e.target.closest("[data-nav]");
  if (t) { e.preventDefault(); location.hash = t.dataset.nav; }
});

function route() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  document.querySelectorAll(".tab").forEach(b =>
    b.classList.toggle("active", b.dataset.nav === "#/" + (parts[0] === "quiz" ? "quiz" : "")));
  scrollTo(0, 0);

  if (parts[0] === "quiz") { setActiveFloor(-1); return renderQuiz(); }
  if (parts[0] === "p") {
    const pi = +parts[1]; setActiveFloor(pi);
    if (parts[2] === "s") {
      const si = +parts[3];
      if (parts[4] === "a") {
        const ai = +parts[5];
        if (parts[6] === "o") return renderOeuvre(pi, si, ai, +parts[7]);
        return renderArtiste(pi, si, ai);
      }
      return renderStyle(pi, si);
    }
    return renderPeriode(pi);
  }
  setActiveFloor(-1); return renderHome();
}

/* ---------- fil d'Ariane ---------- */
function crumb(items) {
  $("breadcrumb").innerHTML = items.map((it, i) =>
    (i ? '<span class="sep">›</span>' : "") +
    (it.nav ? `<a data-nav="${it.nav}">${esc(it.label)}</a>` : `<span>${esc(it.label)}</span>`)
  ).join(" ");
}

/* ---------- ACCUEIL : la frise des périodes ---------- */
function renderHome() {
  crumb([{ label: "Accueil" }]);
  $("view").innerHTML = `
    <div class="pagehead">
      <h1>Comprendre l'histoire de l'art</h1>
      <p class="lead">Monte les étages du temps. Chaque période a son contexte et ses styles ; chaque œuvre se comprend dans son époque.</p>
    </div>
    <div class="grid cols">
      ${PERIODES.map((p, pi) => `
        <div class="card" data-nav="#/p/${pi}">
          <div class="thumb" data-wiki="${esc(firstWiki(p))}"></div>
          <div class="body">
            <div class="t">${esc(p.nom)}</div>
            <div class="s">${esc(p.epoque)}</div>
            <div class="r">${p.styles.length} style${p.styles.length > 1 ? "s" : ""} · ${countWorks(p)} œuvres</div>
          </div>
        </div>`).join("")}
    </div>`;
  loadImages($("view"));
}

/* ---------- PÉRIODE : contexte général + styles ---------- */
function renderPeriode(pi) {
  const p = PERIODES[pi]; if (!p) return renderHome();
  crumb([{ label: "Accueil", nav: "#/" }, { label: p.nom }]);
  $("view").innerHTML = `
    <div class="pagehead"><div class="ep">${esc(p.epoque)}</div><h1>${esc(p.nom)}</h1></div>
    <div class="block"><h3>Le contexte</h3><p>${esc(p.contexte)}</p></div>
    <div class="block"><h3>Ce que l'art y cherche</h3><p>${esc(p.apport)}</p></div>
    <h2 style="margin:22px 0 0;font-size:20px">Les styles & mouvements</h2>
    <div class="grid cols">
      ${p.styles.map((s, si) => `
        <div class="card" data-nav="#/p/${pi}/s/${si}">
          <div class="thumb" data-wiki="${esc(firstWikiStyle(s))}"></div>
          <div class="body">
            <div class="t">${esc(s.nom)}</div>
            <div class="s">${esc(s.resume)}</div>
            <div class="r">${s.artistes.length} artiste${s.artistes.length > 1 ? "s" : ""}</div>
          </div>
        </div>`).join("")}
    </div>`;
  loadImages($("view"));
}

/* ---------- STYLE : explication du mouvement + artistes ---------- */
function renderStyle(pi, si) {
  const p = PERIODES[pi], s = p?.styles[si]; if (!s) return renderPeriode(pi);
  crumb([{ label: "Accueil", nav: "#/" }, { label: p.nom, nav: `#/p/${pi}` }, { label: s.nom }]);
  $("view").innerHTML = `
    <div class="pagehead"><div class="ep">${esc(p.nom)}</div><h1>${esc(s.nom)}</h1><p class="lead">${esc(s.resume)}</p></div>
    <div class="block"><h3>Le style</h3><p>${esc(s.explication)}</p></div>
    <div class="block"><h3>Le contexte du mouvement</h3><p>${esc(s.contexte)}</p></div>
    <h2 style="margin:22px 0 0;font-size:20px">Les artistes</h2>
    <div class="grid cols">
      ${s.artistes.map((a, ai) => `
        <div class="card" data-nav="#/p/${pi}/s/${si}/a/${ai}">
          <div class="thumb" data-wiki="${esc(a.oeuvres[0]?.wiki || "")}"></div>
          <div class="body">
            <div class="t">${esc(a.nom)}</div>
            <div class="r">${a.oeuvres.length} œuvre${a.oeuvres.length > 1 ? "s" : ""}</div>
          </div>
        </div>`).join("")}
    </div>`;
  loadImages($("view"));
}

/* ---------- ARTISTE : bio + œuvres ---------- */
function renderArtiste(pi, si, ai) {
  const p = PERIODES[pi], s = p?.styles[si], a = s?.artistes[ai]; if (!a) return renderStyle(pi, si);
  crumb([{ label: "Accueil", nav: "#/" }, { label: p.nom, nav: `#/p/${pi}` }, { label: s.nom, nav: `#/p/${pi}/s/${si}` }, { label: a.nom }]);
  $("view").innerHTML = `
    <div class="pagehead"><div class="ep">${esc(s.nom)} · ${esc(p.nom)}</div><h1>${esc(a.nom)}</h1></div>
    <div class="block"><h3>L'artiste</h3><p>${esc(a.bio)}</p></div>
    <h2 style="margin:22px 0 0;font-size:20px">Ses œuvres</h2>
    <div class="grid cols">
      ${a.oeuvres.map((o, oi) => `
        <div class="card" data-nav="#/p/${pi}/s/${si}/a/${ai}/o/${oi}">
          <div class="thumb" data-wiki="${esc(o.wiki)}"></div>
          <div class="body"><div class="t">${esc(o.titre)}</div><div class="s">${esc(o.annee)}</div></div>
        </div>`).join("")}
    </div>`;
  loadImages($("view"));
}

/* ---------- ŒUVRE : la fiche d'apprentissage ---------- */
function renderOeuvre(pi, si, ai, oi) {
  const p = PERIODES[pi], s = p?.styles[si], a = s?.artistes[ai], o = a?.oeuvres[oi];
  if (!o) return renderArtiste(pi, si, ai);
  crumb([{ label: "Accueil", nav: "#/" }, { label: p.nom, nav: `#/p/${pi}` }, { label: s.nom, nav: `#/p/${pi}/s/${si}` }, { label: a.nom, nav: `#/p/${pi}/s/${si}/a/${ai}` }, { label: o.titre }]);
  const prev = oi > 0 ? `#/p/${pi}/s/${si}/a/${ai}/o/${oi - 1}` : null;
  const next = oi < a.oeuvres.length - 1 ? `#/p/${pi}/s/${si}/a/${ai}/o/${oi + 1}` : null;
  $("view").innerHTML = `
    <div class="fiche">
      <img class="img" alt="${esc(o.titre)}" data-wiki="${esc(o.wiki)}" />
      <div class="info">
        <h1>${esc(o.titre)}</h1>
        <div class="meta">${esc(a.nom)} · ${esc(o.annee)}</div>
        <div class="tagline">
          <span class="tag gold" data-nav="#/p/${pi}">${esc(p.nom)}</span>
          <span class="tag" data-nav="#/p/${pi}/s/${si}">${esc(s.nom)}</span>
        </div>
        <div class="block"><h3>📖 Explication</h3><p>${esc(o.explication)}</p></div>
        <div class="block"><h3>🌍 Contexte à la création</h3><p>${esc(o.contexte)}</p></div>
        <div class="block"><h3>🔍 Éléments à repérer</h3><ul class="dots">${(o.elements || []).map(e => `<li>${esc(e)}</li>`).join("")}</ul></div>
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
  wireGuide(p, s, a, o);
}

function wireGuide(p, s, a, o) {
  const btn = $("gask"), ans = $("gans");
  btn.onclick = async () => {
    const q = $("gq").value.trim(); if (!q) return;
    ans.className = "answer dim"; ans.textContent = "…";
    try {
      const r = await fetch("/api/ask", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          floorName: p.nom, epoque: p.epoque,
          salle: { type: "artiste", nom: a.nom, presentation: a.bio + " — Mouvement : " + s.nom + ". " + s.explication },
          work: { titre: o.titre, artiste: a.nom, annee: o.annee, note: o.explication + " " + o.contexte },
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

/* ---------- helpers contenu ---------- */
function firstWiki(p) { return p.styles[0]?.artistes[0]?.oeuvres[0]?.wiki || ""; }
function firstWikiStyle(s) { return s.artistes[0]?.oeuvres[0]?.wiki || ""; }
function countWorks(p) { return p.styles.reduce((n, s) => n + s.artistes.reduce((m, a) => m + a.oeuvres.length, 0), 0); }

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
    { q: "À quelle période appartient cette œuvre ?", val: x => x.periode.nom, all: () => [...new Set(FLAT.map(x => x.periode.nom))] },
    { q: "À quel style / mouvement se rattache-t-elle ?", val: x => x.style.nom, all: () => [...new Set(FLAT.map(x => x.style.nom))] },
    { q: "Qui en est l'auteur ?", val: x => x.artiste.nom, all: () => [...new Set(FLAT.map(x => x.artiste.nom))] },
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
    if (answered) return; answered = true;
    quizState.total++;
    const ok = b.textContent === correct;
    if (ok) quizState.score++;
    $("view").querySelectorAll(".opt").forEach(x => {
      if (x.textContent === correct) x.classList.add("good");
      else if (x === b) x.classList.add("bad");
      x.disabled = true;
    });
    const reveal = document.createElement("div");
    reveal.style.cssText = "text-align:center;margin-top:14px;color:var(--muted)";
    reveal.innerHTML = `<b>${esc(item.oeuvre.titre)}</b> — ${esc(item.artiste.nom)}, ${esc(item.oeuvre.annee)}.
      <a data-nav="#/p/${item.pi}/s/${item.si}/a/${item.ai}/o/${item.oi}" style="color:var(--gold);cursor:pointer">voir la fiche →</a>`;
    $("view").querySelector(".quiz").appendChild(reveal);
    const nb = document.createElement("button"); nb.className = "next"; nb.textContent = "Question suivante →";
    nb.onclick = renderQuiz; $("view").querySelector(".quiz").appendChild(nb);
  });
}
