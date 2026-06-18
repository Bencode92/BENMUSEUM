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

const DV = "47"; // bump à chaque mise à jour de contenu pour court-circuiter le cache
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
    // enrichir le pool du quiz avec les œuvres des fiches d'artistes (a.oeuvres),
    // rattachées au 1er chapitre de leur dossier, dédupliquées par image
    {
      const seenW = new Set(FLAT.map(x => x.oeuvre.wiki));
      const chapOf = {};
      CHAPITRES.forEach((c, ci) => { if (c.dossier && !(c.dossier in chapOf)) chapOf[c.dossier] = { c, ci }; });
      DOSSIERS.forEach(d => {
        const ref = chapOf[d.id]; if (!ref) return;
        (d.artistes || []).forEach(a => (a.oeuvres || []).forEach(o => {
          if (!o.wiki || seenW.has(o.wiki)) return;
          seenW.add(o.wiki);
          FLAT.push({ ci: ref.ci, oi: -1, chap: ref.c, oeuvre: { ...o, artiste: o.artiste || a.nom } });
        }));
      });
    }
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
  const c = CHAPITRES[ci];
  document.documentElement.style.setProperty("--chap", c ? c.couleur : "var(--accent)");
  const active = document.querySelector("#floorList li.active");
  if (active) active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
}

/* ---------- routage ---------- */
addEventListener("hashchange", route);
document.addEventListener("click", e => {
  if (e.target.closest("[data-fav]")) return; // géré par le handler favoris
  const z = e.target.closest("[data-zoom]");
  if (z) { e.preventDefault(); e.stopPropagation(); openZoom(z.dataset.zoom, z.dataset.cap || ""); return; }
  const t = e.target.closest("[data-nav]");
  if (t) { e.preventDefault(); location.hash = t.dataset.nav; }
});

/* ---------- visionneuse plein écran (zoom immersif) ---------- */
function openZoom(wiki, cap) {
  const lb = $("lightbox"); if (!lb) return;
  $("lbcap").textContent = cap || ""; $("lbimg").src = "";
  lb.hidden = false;
  const hi = IMAGES[wiki] && (IMAGES[wiki].url || IMAGES[wiki].thumb);
  if (hi) $("lbimg").src = hi; else getImageUrl(wiki).then(u => { if (u) $("lbimg").src = u; });
}
function closeZoom() { const lb = $("lightbox"); if (lb) { lb.hidden = true; $("lbimg").src = ""; } }
if ($("lightbox")) {
  $("lbclose").onclick = closeZoom;
  $("lightbox").addEventListener("click", e => { if (e.target.id === "lightbox" || e.target.id === "lbclose") closeZoom(); });
  addEventListener("keydown", e => { if (e.key === "Escape") closeZoom(); });
}

/* ---------- DISCUSSION IA flottante (toujours accessible) ---------- */
let chatMsgs = [];        // historique de la discussion en cours
let CHATCTX = null;        // contexte de la page (sujet + fiche + scope)

function generic() { return { label: "Histoire de l'art", scope: "general", fiche: "", ask: { floorName: "Histoire de l'art" } }; }
function pageContext() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "c") {
    const ci = +parts[1], c = CHAPITRES[ci]; if (!c) return generic();
    if (parts[2] === "o") {
      const o = c.oeuvres && c.oeuvres[+parts[3]]; if (o) return {
        label: `${o.titre} — ${o.artiste}`, scope: `oeuvre:${ci}:${+parts[3]}`,
        fiche: `« ${o.titre} » — ${o.artiste}, ${o.annee}. ${o.explication} ${o.contexte} Éléments : ${(o.elements || []).join(" ; ")}. Chapitre ${c.num} (${c.titre}) : ${c.idee}`,
        ask: { floorName: `${c.titre} (chap. ${c.num})`, epoque: c.portee, salle: { nom: c.titre, presentation: c.idee }, work: { titre: o.titre, artiste: o.artiste, annee: o.annee, note: o.explication + " " + o.contexte } },
      };
    }
    return { label: `Chapitre ${c.num} — ${c.titre}`, scope: `chap:${c.num}`,
      fiche: `Chapitre ${c.num} — ${c.titre}. ${c.idee} ${c.notion || ""}`,
      ask: { floorName: `${c.titre} (chap. ${c.num})`, epoque: c.portee, salle: { nom: c.titre, presentation: c.idee } } };
  }
  if (parts[0] === "d") {
    const d = DOSSIERS.find(x => x.id === parts[1]); if (!d) return generic();
    if (parts[2] === "a") {
      const a = d.artistes && d.artistes[+parts[3]]; if (a) return {
        label: a.nom, scope: `artiste:${d.id}:${+parts[3]}`,
        fiche: `${a.nom} (${a.dates}). ${a.portrait || ""} ${(a.bio_sections || []).map(s => `${s.h} : ${s.p}`).join(" ") || a.bio_longue || ""}`,
        ask: { floorName: d.titre, salle: { nom: a.nom, presentation: a.portrait || "" } } };
    }
    return { label: d.titre, scope: `dossier:${d.id}`,
      fiche: `${d.titre} (${d.periode}). ${d.sous_titre || ""} ${d.probleme || ""} ` + (d.recit || []).map(s => `${s.h} : ${s.p}`).join(" "),
      ask: { floorName: d.titre, epoque: d.periode, salle: { nom: d.titre, presentation: d.sous_titre || d.probleme || "" } } };
  }
  return generic();
}
function initChat() {
  if ($("chatfab")) return;
  const fab = document.createElement("button");
  fab.id = "chatfab"; fab.textContent = "💬 Discuter"; document.body.appendChild(fab);
  const dr = document.createElement("aside");
  dr.id = "chatdrawer"; dr.hidden = true;
  dr.innerHTML = `
    <header><span id="chattitle">Discuter</span><button id="chatclose" aria-label="Fermer">×</button></header>
    <div id="chatlog2"></div>
    <form id="chatform2"><input id="chatin" autocomplete="off" placeholder="Discute du sujet de cette page…" /><button type="submit">→</button></form>
    <div id="chatanalyse"><button id="chatanalyze">🔎 Analyser les points clés à ajouter à la fiche</button><div id="chatares"></div></div>`;
  document.body.appendChild(dr);
  fab.onclick = openChat;
  $("chatclose").onclick = () => { dr.hidden = true; };
  $("chatform2").onsubmit = e => { e.preventDefault(); sendChat(); };
  $("chatanalyze").onclick = analyseChat;
}
function addCmsg(role, text) {
  const log = $("chatlog2"); const div = document.createElement("div");
  div.className = "cmsg " + (role === "me" ? "me" : "bot"); div.textContent = text;
  log.appendChild(div); log.scrollTop = log.scrollHeight; return div;
}
function openChat() {
  CHATCTX = pageContext();
  $("chattitle").textContent = "Discuter — " + CHATCTX.label;
  $("chatdrawer").hidden = false;
  if (!chatMsgs.length && !$("chatlog2").children.length)
    addCmsg("bot", `Parlons de « ${CHATCTX.label} ». Pose une question, demande une précision, ou lance une idée — puis « Analyser les points clés » pour enrichir la fiche.`).classList.add("dim");
  $("chatin").focus();
}
function resetChat() {
  chatMsgs = []; CHATCTX = null;
  if ($("chatlog2")) $("chatlog2").innerHTML = "";
  if ($("chatares")) $("chatares").innerHTML = "";
}
async function sendChat() {
  const inp = $("chatin"); const q = inp.value.trim(); if (!q) return;
  const ctx = CHATCTX || (CHATCTX = pageContext());
  inp.value = ""; addCmsg("me", q);
  const thinking = addCmsg("bot", "…"); thinking.classList.add("dim");
  const history = chatMsgs.map(m => ({ role: m.role, text: m.text }));
  try {
    const r = await fetch(aiEndpoint(), { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...ctx.ask, question: q, history }) });
    if (!r.ok) throw new Error();
    const j = await r.json();
    thinking.classList.remove("dim"); thinking.textContent = j.answer;
    chatMsgs.push({ role: "user", text: q }, { role: "assistant", text: j.answer });
  } catch {
    thinking.classList.remove("dim");
    thinking.innerHTML = "⚠️ IA hors ligne. <button class='linkbtn' id='cfgc'>Configurer l'IA en ligne</button>";
    const b = $("cfgc"); if (b) b.onclick = setAiUrl;
  }
}
async function analyseChat() {
  const ctx = CHATCTX || (CHATCTX = pageContext());
  const res = $("chatares");
  if (!chatMsgs.length) { res.textContent = "Discute d'abord un peu, puis lance l'analyse."; return; }
  res.textContent = "Analyse en cours…";
  const transcript = chatMsgs.map(m => (m.role === "user" ? "Moi : " : "Guide : ") + m.text).join("\n");
  try {
    const r = await fetch(aiEndpoint(), { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode: "enrich", fiche: ctx.fiche, texte: transcript }) });
    if (!r.ok) throw new Error();
    const j = await r.json();
    res.textContent = j.answer;
    const add = document.createElement("button");
    add.className = "optbtn"; add.style.marginTop = "10px"; add.textContent = "➕ Ajouter ces points à la fiche";
    add.onclick = () => {
      addNote(ctx.scope, `Issu d'une discussion :\n${j.answer}`);
      const box = $("view").querySelector(`.notes[data-scope="${ctx.scope}"]`);
      if (box) renderNotesList(box, ctx.scope);
      add.textContent = "✓ Ajouté à la fiche"; add.disabled = true;
    };
    res.after(add);
  } catch {
    res.innerHTML = "⚠️ IA hors ligne. <button class='linkbtn' id='cfgc2'>Configurer l'IA en ligne</button>";
    const b = $("cfgc2"); if (b) b.onclick = setAiUrl;
  }
}
initChat();

/* ---------- apparitions au défilement (cinématique léger) ---------- */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); } });
}, { threshold: 0.06, rootMargin: "0px 0px -8% 0px" });
function armReveals() {
  $("view").querySelectorAll(".dossier-hero, .pagehead, .recit-block, .acte, .block, .grid > .card, .sess-card, h2.sec, .session-cta")
    .forEach(el => {
      if (el.dataset.rev) return; el.dataset.rev = "1"; el.classList.add("reveal");
      revealIO.observe(el);
      setTimeout(() => el.classList.add("in"), 1400); // filet de sécurité : jamais invisible
    });
}
if ($("view")) { new MutationObserver(armReveals).observe($("view"), { childList: true, subtree: true }); }
function route() {
  resetChat();
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
  if (top === "d") {
    setActiveFloor(-1);
    if (parts[2] === "a") return renderArtiste(parts[1], +parts[3]);
    return renderDossier(parts[1]);
  }
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
  // consulter une œuvre en détail l'inscrit dans la révision espacée (si illustrée)
  if (o.wiki && IMAGES[o.wiki]) introduceCard(`w:${o.wiki}`);
  crumb([{ label: "Accueil", nav: "#/" }, { label: `${c.num}. ${c.titre}`, nav: `#/c/${ci}` }, { label: o.titre }]);
  const prev = oi > 0 ? `#/c/${ci}/o/${oi - 1}` : null;
  const next = oi < c.oeuvres.length - 1 ? `#/c/${ci}/o/${oi + 1}` : null;
  $("view").innerHTML = `
    <div class="fiche">
      <img class="img zoomable" alt="${esc(o.titre)}" data-wiki="${esc(o.wiki)}" data-zoom="${esc(o.wiki)}" data-cap="${esc(o.titre)} — ${esc(o.artiste)}" />
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
        <div class="block guide enrich">
          <h3>✨ Enrichir cette fiche</h3>
          <p class="guidehint">Colle un texte (un passage, tes notes) : l'IA le compare à la fiche et te dit ce qui est nouveau, déjà couvert ou à vérifier.</p>
          <textarea id="eq" placeholder="Colle un texte à intégrer…"></textarea>
          <button class="ask" id="eask">Comparer & intégrer</button>
          <div class="answer" id="eans"></div>
        </div>
        ${aiQuizBlock("oeuvre")}
        ${notesBlock(`oeuvre:${ci}:${oi}`)}
        <div class="navworks">
          <button ${prev ? `data-nav="${prev}"` : "disabled"}>← Œuvre précédente</button>
          <button ${next ? `data-nav="${next}"` : "disabled"}>Œuvre suivante →</button>
        </div>
      </div>
    </div>`;
  loadImages($("view"));
  wireGuide(c, o, `oeuvre:${ci}:${oi}`);
  wireEnrich(c, o, `oeuvre:${ci}:${oi}`);
  wireAiQuiz("oeuvre", `« ${o.titre} » — ${o.artiste}, ${o.annee}. ${o.explication} ${o.contexte} Éléments : ${(o.elements || []).join(" ; ")}. Chapitre ${c.num} (${c.titre}) : ${c.idee}`);
  wireNotes();
}

function wireEnrich(c, o, scope) {
  const btn = $("eask"), ans = $("eans"); if (!btn) return;
  const fiche = `« ${o.titre} » — ${o.artiste}, ${o.annee}. ${o.explication} ${o.contexte} `
    + `Éléments à repérer : ${(o.elements || []).join(" ; ")}. Idée du chapitre : ${c.idee}`;
  btn.onclick = async () => {
    const texte = $("eq").value.trim(); if (!texte) return;
    ans.className = "answer dim"; ans.textContent = "…";
    try {
      const r = await fetch(aiEndpoint(), {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "enrich", fiche, texte }),
      });
      if (!r.ok) throw new Error();
      const j = await r.json();
      ans.className = "answer"; ans.textContent = j.answer;
      const add = document.createElement("button");
      add.className = "addnotebtn"; add.style.marginTop = "8px"; add.textContent = "+ Ajouter ce que j'ai appris aux notes";
      add.onclick = () => {
        addNote(scope, `Enrichissement :\n${texte}\n\nAnalyse IA :\n${j.answer}`);
        const box = $("view").querySelector(`.notes[data-scope="${scope}"]`);
        if (box) renderNotesList(box, scope);
        add.textContent = "✓ Ajouté"; add.disabled = true;
      };
      ans.after(add);
    } catch {
      ans.className = "answer dim";
      ans.innerHTML = "⚠️ IA hors ligne. <button id='aicfg2' class='linkbtn'>Configurer l'IA en ligne</button> (Cloudflare Worker).";
      const cfg = document.getElementById("aicfg2"); if (cfg) cfg.onclick = setAiUrl;
    }
  };
}

/* ---------- QCM généré par l'IA (à partir du contenu d'une fiche/section) ---------- */
function parseQuizJSON(t) { try { const m = (t || "").match(/\{[\s\S]*\}/); return JSON.parse(m ? m[0] : t); } catch { return null; } }
function aiQuizBlock(id) {
  return `<div class="block aiquiz" id="aq-${id}">
    <h3>🧠 Teste-toi (QCM généré par l'IA)</h3>
    <button class="ask aqgen">Générer un QCM</button>
    <div class="aqout"></div>
  </div>`;
}
function renderMCQ(box, questions) {
  box.innerHTML = questions.map((q, qi) => `
    <div class="mcq" data-qi="${qi}">
      <div class="mcq-q">${qi + 1}. ${esc(q.q)}</div>
      <div class="mcq-opts">${(q.options || []).map((op, oi) => `<button class="opt" data-oi="${oi}">${esc(op)}</button>`).join("")}</div>
      <div class="mcq-exp" hidden>💡 ${esc(q.explication || "")}</div>
    </div>`).join("");
  box.querySelectorAll(".mcq").forEach((m, qi) => {
    const q = questions[qi]; let done = false;
    m.querySelectorAll(".opt").forEach(b => b.onclick = () => {
      if (done) return; done = true;
      m.querySelectorAll(".opt").forEach((x, oi) => { if (oi === q.answer) x.classList.add("good"); else if (x === b) x.classList.add("bad"); x.disabled = true; });
      m.querySelector(".mcq-exp").hidden = false;
    });
  });
}
function wireAiQuiz(id, contenu) {
  const block = $(`aq-${id}`); if (!block) return;
  const btn = block.querySelector(".aqgen"), out = block.querySelector(".aqout");
  btn.onclick = async () => {
    btn.disabled = true; btn.textContent = "Génération…"; out.innerHTML = "";
    try {
      const r = await fetch(aiEndpoint(), {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "quiz", contenu, n: 5 }),
      });
      if (!r.ok) throw new Error();
      const j = await r.json();
      const data = parseQuizJSON(j.answer);
      if (!data || !Array.isArray(data.questions) || !data.questions.length) throw new Error("format");
      renderMCQ(out, data.questions);
      btn.textContent = "↻ Regénérer"; btn.disabled = false;
    } catch {
      out.innerHTML = `<p class="answer dim">⚠️ IA hors ligne ou réponse illisible. <button class="linkbtn aqcfg">Configurer l'IA en ligne</button></p>`;
      const c = out.querySelector(".aqcfg"); if (c) c.onclick = setAiUrl;
      btn.textContent = "Générer un QCM"; btn.disabled = false;
    }
  };
}

// endpoint IA : ton Cloudflare Worker (en ligne) sinon le serveur local
function aiEndpoint() { return localStorage.getItem("museum:aiurl") || "/api/ask"; }
function setAiUrl() {
  const u = prompt("Colle l'URL de ton Cloudflare Worker (https://...workers.dev) — voir worker/README.md :", localStorage.getItem("museum:aiurl") || "");
  if (u !== null) { localStorage.setItem("museum:aiurl", u.trim()); alert(u.trim() ? "Guide IA en ligne configuré. Repose ta question." : "URL effacée."); }
}

function wireGuide(c, o, scope) {
  const btn = $("gask"), ans = $("gans");
  btn.onclick = async () => {
    const q = $("gq").value.trim(); if (!q) return;
    ans.className = "answer dim"; ans.textContent = "…";
    try {
      const r = await fetch(aiEndpoint(), {
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
      ans.innerHTML = "⚠️ Guide hors ligne. <button id='aicfg' class='linkbtn'>Configurer l'IA en ligne</button> (Cloudflare Worker) — ou lance <code>node server.js</code> en local.";
      const cfg = document.getElementById("aicfg"); if (cfg) cfg.onclick = setAiUrl;
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
// page Réviser : choisir la cible (chapitre / artiste / tout) puis le type de quiz
const ANON = /anonyme|atelier|moines|bâtisseurs|artisans|maîtres|sculpteurs|carolingien|byzantin|gothique|roman|romain|magdalénien|song|omeyyade|islamique|thoutmôsis|antioche|rhodes|callicratès/i;
const shuffle = a => a.slice().sort(() => Math.random() - 0.5);
let QZ = null;

function renderQuiz() {
  crumb([{ label: "Réviser" }]);
  const chapters = [...new Set(FLAT.map(x => x.chap.titre))];
  const artists = [...new Set(FLAT.map(x => x.oeuvre.artiste))]
    .filter(a => a && !ANON.test(a)).sort((a, b) => a.localeCompare(b, "fr"));
  const due = sessionStats();
  const tracked = Object.keys(srsStore()).length;
  $("view").innerHTML = `
    <div class="pagehead"><h1>Réviser</h1>
      <p class="lead">Deux modes : la <b>révision espacée du jour</b> (mémorisation durable, façon flashcards) et le <b>quiz libre</b> (s'entraîner sur une cible).</p></div>
    <div class="block" style="border-left:4px solid var(--gold)">
      <h3>🔁 Révision espacée du jour</h3>
      <p class="lead">${due ? `<b>${due}</b> carte${due > 1 ? "s" : ""} à revoir aujourd'hui.` : tracked ? "Rien à revoir aujourd'hui — reviens demain, tes cartes remonteront au bon moment." : "Première session : les œuvres que tu <b>consultes</b> ou que tu <b>rates au quiz</b> entrent ici et reviennent à intervalles croissants (1, 3, 7, 16, 35 jours)."}${tracked ? ` · ${tracked} œuvre${tracked > 1 ? "s" : ""} suivie${tracked > 1 ? "s" : ""}` : ""}</p>
      <div class="sess-actions">
        <button class="big" data-nav="#/session">▶ ${due ? "Réviser maintenant" : "Lancer une session"}</button>
      </div>
    </div>
    <div class="block">
      <h3>🎯 Quiz libre — cible</h3>
      <div class="quizcfg">
        <label>Chapitre / époque<br><select id="qchap"><option value="">Tout le musée</option>${chapters.map(c => `<option>${esc(c)}</option>`).join("")}</select></label>
        <label>Focus artiste<br><select id="qart"><option value="">— Aucun —</option>${artists.map(a => `<option>${esc(a)}</option>`).join("")}</select></label>
      </div>
      <div class="sess-actions">
        <button class="next" id="qstart">▶ Lancer le quiz (≈ 20 questions)</button>
      </div>
    </div>
    <div id="quizarea"></div>`;
  $("qstart").onclick = () => startQuiz();
}
function quizScope() {
  const chap = $("qchap") ? $("qchap").value : "";
  const art = $("qart") ? $("qart").value : "";
  let pool = FLAT;
  if (chap) pool = pool.filter(x => x.chap.titre === chap);
  if (art) pool = pool.filter(x => x.oeuvre.artiste === art);
  return { chap, art, pool };
}
// questions visuelles, fabriquées à partir des données (fiable, sans IA)
function buildVisualQuestions(pool, n) {
  const wp = pool.filter(x => IMAGES[x.oeuvre.wiki]);
  const allWithImg = FLAT.filter(x => IMAGES[x.oeuvre.wiki]);
  const allArtists = [...new Set(FLAT.map(x => x.oeuvre.artiste))].filter(a => a && !ANON.test(a));
  const allChapters = [...new Set(FLAT.map(x => x.chap.titre))];
  const qs = [], used = new Set(); let guard = 0;
  while (qs.length < n && guard++ < n * 10 && wp.length) {
    const it = wp[Math.floor(Math.random() * wp.length)];
    const known = it.oeuvre.artiste && !ANON.test(it.oeuvre.artiste);
    const kinds = ["titre", "periode"];
    if (known) kinds.push("auteur", "inverse");
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const key = kind + ":" + it.oeuvre.wiki; if (used.has(key)) continue; used.add(key);
    if (kind === "auteur") {
      const opts = shuffle([it.oeuvre.artiste, ...pick(allArtists.filter(a => a !== it.oeuvre.artiste), 3)]);
      qs.push({ kind: "img", img: it.oeuvre.wiki, q: "Qui a réalisé cette œuvre ?", options: opts, answer: opts.indexOf(it.oeuvre.artiste), meta: it });
    } else if (kind === "titre") {
      const opts = shuffle([it.oeuvre.titre, ...pick(allWithImg.map(x => x.oeuvre.titre).filter(t => t !== it.oeuvre.titre), 3)]);
      qs.push({ kind: "img", img: it.oeuvre.wiki, q: "Quelle est cette œuvre ?", options: opts, answer: opts.indexOf(it.oeuvre.titre), meta: it });
    } else if (kind === "periode") {
      const opts = shuffle([it.chap.titre, ...pick(allChapters.filter(c => c !== it.chap.titre), 3)]);
      qs.push({ kind: "img", img: it.oeuvre.wiki, q: "À quelle période / chapitre appartient-elle ?", options: opts, answer: opts.indexOf(it.chap.titre), meta: it });
    } else {
      const others = pick(allWithImg.filter(x => x.oeuvre.artiste !== it.oeuvre.artiste && x.oeuvre.wiki !== it.oeuvre.wiki), 3);
      if (others.length < 3) continue;
      const grid = shuffle([it, ...others]);
      qs.push({ kind: "grid", q: `Laquelle de ces œuvres est de ${it.oeuvre.artiste} ?`, options: grid.map(x => ({ wiki: x.oeuvre.wiki, cap: x.oeuvre.titre })), answer: grid.indexOf(it), meta: it });
    }
  }
  return qs;
}
async function startQuiz() {
  const { chap, art, pool } = quizScope();
  const box = $("quizarea"); if (!box) return;
  if (!pool.length) { box.innerHTML = `<p class="lead">Aucune œuvre pour cette cible.</p>`; return; }
  box.innerHTML = `<p class="lead">Préparation du quiz…</p>`;
  let qs = buildVisualQuestions(pool, 15);
  // questions de compréhension générées par l'IA (si le Worker est branché)
  try {
    const label = [art, chap].filter(Boolean).join(" — ") || "l'histoire de l'art";
    const contenu = `Sujet : ${label}.\n` + pool.slice(0, 14).map(x =>
      `« ${x.oeuvre.titre} » (${x.oeuvre.artiste}, ${x.oeuvre.annee}) : ${x.oeuvre.explication || x.oeuvre.analyse || ""} ${x.oeuvre.contexte || ""}`).join("\n")
      + "\n" + [...new Set(pool.map(x => x.chap.idee).filter(Boolean))].join(" ");
    const r = await fetch(aiEndpoint(), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "quiz", contenu, n: 7 }) });
    if (r.ok) { const d = parseQuizJSON((await r.json()).answer); if (d && Array.isArray(d.questions)) d.questions.forEach(q => qs.push({ kind: "text", q: q.q, options: q.options, answer: q.answer, explication: q.explication })); }
  } catch {}
  qs = shuffle(qs).slice(0, 20);
  if (!qs.length) { box.innerHTML = `<p class="lead">Pas assez de contenu illustré pour un quiz ici.</p>`; return; }
  QZ = { qs, i: 0, score: 0 };
  playQuestion();
}
function playQuestion() {
  const box = $("quizarea"); if (!box) return;
  const q = QZ.qs[QZ.i];
  if (!q) {
    const pct = Math.round(100 * QZ.score / QZ.qs.length);
    box.innerHTML = `<div class="quiz"><div class="q">Terminé !</div>
      <div class="score" style="font-size:24px;color:var(--gold)">${QZ.score} / ${QZ.qs.length} <small>(${pct}%)</small></div>
      <button class="next" id="qreplay">↻ Rejouer</button></div>`;
    $("qreplay").onclick = startQuiz; return;
  }
  let body;
  if (q.kind === "grid") {
    body = `<div class="q">${esc(q.q)}</div><div class="grid4">${q.options.map((o, oi) =>
      `<button class="imgopt" data-oi="${oi}"><span class="thumb" data-wiki="${esc(o.wiki)}"></span></button>`).join("")}</div>`;
  } else {
    body = `${q.kind === "img" ? `<img class="qimg" data-wiki="${esc(q.img)}" alt="" />` : ""}
      <div class="q">${esc(q.q)}</div>
      <div class="opts">${q.options.map(o => `<button class="opt">${esc(o)}</button>`).join("")}</div>`;
  }
  box.innerHTML = `<div class="quiz"><div class="score">Question ${QZ.i + 1} / ${QZ.qs.length} · score ${QZ.score}</div>${body}<div class="qexp" hidden></div></div>`;
  loadImages(box);
  let done = false;
  const opts = box.querySelectorAll(".opt, .imgopt");
  opts.forEach((b, oi) => b.onclick = () => {
    if (done) return; done = true;
    if (oi === q.answer) QZ.score++;
    // alimentation SRS : une œuvre ratée entre en révision espacée (sauf déjà connue)
    else if (q.meta && q.meta.oeuvre && q.meta.oeuvre.wiki) introduceCard(`w:${q.meta.oeuvre.wiki}`);
    opts.forEach((x, xi) => { if (xi === q.answer) x.classList.add("good"); else if (xi === oi) x.classList.add("bad"); x.disabled = true; });
    const exp = box.querySelector(".qexp"); exp.hidden = false;
    let txt = oi === q.answer ? "✓ Bonne réponse." : "✗ Raté — ajoutée à ta révision.";
    if (q.explication) txt += " " + q.explication;
    if (q.meta) txt += `  — ${q.meta.oeuvre.titre}, ${q.meta.oeuvre.artiste} (${q.meta.oeuvre.annee}).`;
    exp.textContent = txt;
    const nb = document.createElement("button"); nb.className = "next";
    nb.textContent = QZ.i + 1 < QZ.qs.length ? "Suivante →" : "Voir le score →";
    nb.onclick = () => { QZ.i++; playQuestion(); };
    box.querySelector(".quiz").appendChild(nb);
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

// trouve l'œuvre (ou à défaut l'artiste) évoquée dans un passage du récit, pour l'illustrer
function recitImage(d, text) {
  const t = text.toLowerCase(); let best = null, bestLen = 0;
  const clean = s => (s || "").replace(/\(.*?\)/g, "").replace(/^(Le |La |Les |L')/, "").trim();
  const tryN = (needles, wiki, caption) => {
    if (!IMAGES[wiki]) return;
    needles.forEach(nd => {
      const n = (nd || "").toLowerCase().trim();
      if (n.length >= 4 && t.includes(n) && n.length > bestLen) { best = { wiki, caption }; bestLen = n.length; }
    });
  };
  (d.oeuvres || []).forEach(o => {
    const nom = clean(o.artiste); const ndl = [o.titre];
    if (nom) { ndl.push(nom); nom.split(/\s+/).forEach(w => { if (w.length >= 4) ndl.push(w); }); }
    tryN(ndl, o.wiki, `${o.titre} — ${o.artiste}`);
  });
  if (!best) (d.artistes || []).forEach(a => {
    const nom = clean(a.nom); const ndl = [nom];
    nom.split(/\s+/).forEach(w => { if (w.length >= 4) ndl.push(w); });
    tryN(ndl, a.wiki, a.nom);
  });
  return best;
}

// deux noms désignent-ils le même artiste (tolérant) ?
function sameArtist(a, b) {
  const cl = s => (s || "").toLowerCase().replace(/\(.*?\)/g, "").replace(/^(le |la |les |l')/, "").trim();
  const A = cl(a), B = cl(b); if (!A || !B) return false;
  if (A === B || A.includes(B) || B.includes(A)) return true;
  const toks = s => s.split(/\s+/).filter(w => w.length >= 4);
  return toks(A).some(w => B.includes(w)) || toks(B).some(w => A.includes(w));
}

/* ---------- PAGE ARTISTE : sa vie en récit illustré + ses œuvres ---------- */
function renderArtiste(id, ai) {
  const d = DOSSIERS.find(x => x.id === id);
  const a = d && d.artistes && d.artistes[ai];
  if (!a) return d ? renderDossier(id) : renderDossiersList();
  crumb([{ label: "Dossiers", nav: "#/dossiers" }, { label: d.titre, nav: `#/d/${id}` }, { label: a.nom }]);
  // œuvres : celles du dossier signées par lui + ses œuvres propres (a.oeuvres), dédoublonnées par titre
  const merged = [...(d.oeuvres || []).filter(o => sameArtist(o.artiste, a.nom)), ...(a.oeuvres || [])];
  const seen = new Set();
  const works = merged.filter(o => { const k = (o.titre || "").toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
  const bioD = { oeuvres: works.map(o => ({ ...o, artiste: o.artiste || a.nom })), artistes: [a] };
  const P = [];

  P.push(`<div class="pagehead">
    <div class="ep">${esc(d.titre)} · ${esc(a.dates)}${a.role ? ` · ${esc(a.role)}` : ""}</div>
    <h1>${esc(a.nom)} ${favBtn(`artiste:${a.nom}`, a.nom, `#/d/${id}/a/${ai}`, "artiste")}</h1></div>`);

  // portrait + intro
  P.push(`<div class="recit-block illus">
    <figure class="recit-fig"><img class="recit-img" data-wiki="${esc(a.wiki)}" data-zoom="${esc(a.wiki)}" data-cap="${esc(a.nom)}" alt="${esc(a.nom)}" />
      <figcaption>${esc(a.nom)} <span class="zoomhint">🔍 agrandir</span></figcaption></figure>
    <div class="recit-txt"><p style="font-size:16px">${esc(a.portrait || "")}</p></div></div>`);

  // biographie illustrée : UNE œuvre distincte par paragraphe, jamais deux fois la même dans la fiche.
  // 1) correspondance contextuelle (le titre est cité dans le texte) parmi les œuvres non encore utilisées ;
  // 2) sinon, la prochaine œuvre non utilisée ; 3) sinon, pas d'image (plutôt qu'une répétition).
  if (Array.isArray(a.bio_sections)) {
    const imgPool = bioD.oeuvres.filter(o => o.wiki && IMAGES[o.wiki]);
    const usedImg = new Set();
    const cleanT = s => (s || "").toLowerCase().replace(/\(.*?\)/g, "").replace(/^(le |la |les |l'|the |a )/, "").trim();
    const imgs = new Array(a.bio_sections.length).fill(null);
    // passe 1 : correspondance contextuelle (le titre de l'œuvre est cité dans la section)
    a.bio_sections.forEach((s, i) => {
      const t = ((s.h || "") + " " + (s.p || "")).toLowerCase();
      let best = null, bl = 0;
      imgPool.forEach(o => {
        if (usedImg.has(o.wiki)) return;
        const n = cleanT(o.titre);
        if (n.length >= 5 && t.includes(n) && n.length > bl) { best = o; bl = n.length; }
      });
      if (best) { imgs[i] = best; usedImg.add(best.wiki); }
    });
    // passe 2 : combler les sections restantes avec les œuvres non encore utilisées (dans l'ordre)
    a.bio_sections.forEach((s, i) => {
      if (imgs[i]) return;
      const o = imgPool.find(x => !usedImg.has(x.wiki));
      if (o) { imgs[i] = o; usedImg.add(o.wiki); }
    });
    P.push(`<h2 class="sec">📖 Sa vie, son évolution <button class="optbtn" id="biotest" style="font-size:13px;padding:4px 10px;margin-left:10px;vertical-align:middle">🧠 Mode test</button></h2>
      <div id="biowrap">` + a.bio_sections.map((s, i) => {
      const o = imgs[i];
      const cap = o ? `${o.titre} — ${o.artiste || a.nom}` : "";
      return `<div class="recit-block${o ? " illus" : ""}">
        ${o ? `<figure class="recit-fig"><img class="recit-img" data-wiki="${esc(o.wiki)}" data-zoom="${esc(o.wiki)}" data-cap="${esc(cap)}" alt="${esc(cap)}" /><figcaption>${esc(cap)} <span class="zoomhint">🔍</span></figcaption></figure>` : ""}
        <div class="recit-txt"><h3>${esc(s.h)}</h3><button class="optbtn biorev" hidden>🧠 Réfléchis, puis révèle</button><p class="biop">${esc(s.p)}</p></div></div>`;
    }).join("") + `</div>`);
  } else if (a.bio_longue) {
    P.push(`<h2 class="sec">📖 Sa vie</h2><div class="block recit"><p style="font-size:15.5px;line-height:1.75">${esc(a.bio_longue)}</p></div>`);
  }

  // ses œuvres dans ce dossier
  if (works.length) P.push(`<h2 class="sec">🖼 Ses œuvres (${works.length})</h2>
    <div class="grid cols">${works.map(o => `
      <div class="card"><div class="thumb zoomable" data-wiki="${esc(o.wiki)}" data-zoom="${esc(o.wiki)}" data-cap="${esc(o.titre)} — ${esc(o.artiste)}"></div>
        <div class="body"><div class="t">${esc(o.titre)}</div><div class="s">${esc(o.annee)}${o.lieu ? ` · ${esc(o.lieu)}` : ""}</div>
        ${o.analyse ? `<details class="deep"><summary>📖 Analyse</summary><p>${esc(o.analyse)}</p></details>` : `<p style="font-size:13px;margin-top:6px">${esc(o.genie || "")}</p>`}</div></div>`).join("")}</div>`);

  P.push(`<div class="navworks"><button data-nav="#/d/${id}">← Retour au dossier ${esc(d.titre)}</button></div>`);
  $("view").innerHTML = `<div class="dossier">${P.join("")}</div>`;
  loadImages($("view"));
  // mode test : masque les réponses, on révèle section par section (rappel actif)
  const bt = $("biotest");
  if (bt) {
    let on = false;
    bt.onclick = () => {
      on = !on;
      bt.textContent = on ? "📖 Mode lecture" : "🧠 Mode test";
      bt.classList.toggle("good", on);
      $("view").querySelectorAll("#biowrap .biop").forEach(p => { p.hidden = on; });
      $("view").querySelectorAll("#biowrap .biorev").forEach(b => { b.hidden = !on; });
    };
    $("view").querySelectorAll("#biowrap .biorev").forEach(b => b.onclick = () => {
      const p = b.parentElement.querySelector(".biop"); if (p) p.hidden = false; b.hidden = true;
    });
  }
}

function renderDossier(id) {
  const d = DOSSIERS.find(x => x.id === id); if (!d) return renderDossiersList();
  crumb([{ label: "Dossiers", nav: "#/dossiers" }, { label: d.titre }]);
  const sec = (title, html) => html ? `<h2 class="sec">${title}</h2>${html}` : "";
  const ul = arr => `<ul class="dots">${arr.map(c => `<li>${esc(c)}</li>`).join("")}</ul>`;
  const P = [];

  const heroWiki = (d.oeuvres || []).map(o => o.wiki).find(w => IMAGES[w])
    || (d.artistes || []).map(a => a.wiki).find(w => IMAGES[w]) || "";
  P.push(`<div class="dossier-hero">
    ${heroWiki ? `<img class="hero-img" data-wiki="${esc(heroWiki)}" alt="" />` : ""}
    <div class="hero-overlay">
      <div class="ep">${esc(d.periode)}</div>
      <h1>${esc(d.titre)} ${favBtn(`dossier:${d.id}`, d.titre, `#/d/${d.id}`, "dossier")}</h1>
      ${d.sous_titre ? `<p class="lead">${esc(d.sous_titre)}</p>` : ""}
    </div></div>`);

  if (d.recit) P.push(sec("📖 Le récit, à travers les œuvres",
    d.recit.map(s => {
      const o = recitImage(d, (s.h || "") + " " + (s.p || ""));
      return `<div class="recit-block${o ? " illus" : ""}">
        ${o ? `<figure class="recit-fig"><img class="recit-img" data-wiki="${esc(o.wiki)}" data-zoom="${esc(o.wiki)}" data-cap="${esc(o.caption)}" alt="${esc(o.caption)}" />
          <figcaption>${esc(o.caption)} <span class="zoomhint">🔍 cliquer pour agrandir</span></figcaption></figure>` : ""}
        <div class="recit-txt"><h3>${esc(s.h)}</h3><p>${esc(s.p)}</p></div>
      </div>`;
    }).join("")));

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
    d.oeuvres.map(o => `
      <div class="recit-block illus oeuvre-grande">
        <figure class="recit-fig"><img class="recit-img" data-wiki="${esc(o.wiki)}" data-zoom="${esc(o.wiki)}" data-cap="${esc(o.titre)} — ${esc(o.artiste)}" alt="${esc(o.titre)}" />
          <figcaption>🔍 cliquer pour agrandir</figcaption></figure>
        <div class="recit-txt">
          <h3>${esc(o.titre)} ${favBtn(`oeuvre-d:${d.id}:${o.titre}`, `${o.titre} — ${o.artiste}`, `#/d/${d.id}`, "œuvre")}</h3>
          <div class="s" style="color:var(--muted);font-style:italic;margin-bottom:8px">${esc(o.artiste)} · ${esc(o.annee)}${o.lieu ? ` · ${esc(o.lieu)}` : ""}</div>
          <p style="font-weight:600">${esc(o.genie)}</p>
          ${o.analyse ? `<p>${esc(o.analyse)}</p>` : ""}
        </div>
      </div>`).join("")));

  if (d.artistes) {
    const aCard = a => {
      const ai = d.artistes.indexOf(a);
      const teaser = (a.portrait || "").split(/(?<=\.)\s/)[0];
      return `<div class="card">
        <div class="thumb zoomable" data-wiki="${esc(a.wiki)}" data-zoom="${esc(a.wiki)}" data-cap="${esc(a.nom)}"></div>
        <div class="body" data-nav="#/d/${d.id}/a/${ai}" style="cursor:pointer">
          <div class="t">${a.niveau ? `<span class="lvl ${a.niveau === "★" ? "star" : ""}">${a.niveau}</span> ` : ""}${esc(a.nom)} ${favBtn(`artiste:${a.nom}`, a.nom, `#/d/${d.id}/a/${ai}`, "artiste")}</div>
          <div class="s">${esc(a.dates)}${a.role ? ` — ${esc(a.role)}` : ""}</div>
          <p style="font-size:13px;margin-top:8px">${esc(teaser)}</p>
          <span class="seemore">📖 Voir sa vie & ses œuvres →</span>
        </div></div>`;
    };
    if (d.artistes.some(a => a.groupe)) {
      const groups = {};
      d.artistes.forEach(a => { (groups[a.groupe || "Autres"] ||= []).push(a); });
      P.push(sec("👤 Les artistes, par école", Object.entries(groups).map(([g, arr]) =>
        `<h3 class="grp">${esc(g)}</h3><div class="grid cols">${arr.map(aCard).join("")}</div>`).join("")));
    } else {
      P.push(sec("👤 Les artistes", `<div class="grid cols">${d.artistes.map(aCard).join("")}</div>`));
    }
  }

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

  P.push(aiQuizBlock("dossier"));

  $("view").innerHTML = `<div class="dossier">${P.join("")}</div>`;
  loadImages($("view"));
  wireNotes();
  const contenu = `${d.titre} (${d.periode}). ${d.sous_titre || ""} ${d.probleme || ""} `
    + (d.recit || []).map(s => `${s.h} : ${s.p}`).join(" ")
    + " " + (d.memos || []).join(" ");
  wireAiQuiz("dossier", contenu);
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

// cartes = toutes les œuvres illustrées (chapitres + fiches d'artistes), clé = image (stable)
let CARDS_CACHE = null;
function buildCards() {
  if (CARDS_CACHE) return CARDS_CACHE;
  const cards = [], seen = new Set();
  const add = card => { if (card.wiki && IMAGES[card.wiki] && !seen.has(card.wiki)) { seen.add(card.wiki); cards.push(card); } };
  // 1) œuvres de niveau chapitre (avec leurs « éléments à repérer »)
  CHAPITRES.forEach((c, ci) => (c.oeuvres || []).forEach((o, oi) =>
    add({ id: `w:${o.wiki}`, ci, oi, titre: o.titre, artiste: o.artiste, wiki: o.wiki, expl: o.explication || o.analyse || "", ctx: o.contexte || "", chNum: c.num, chTitre: c.titre })));
  // 2) œuvres des fiches d'artistes (a.oeuvres), rattachées au 1er chapitre de leur dossier
  const chapOf = {};
  CHAPITRES.forEach((c, ci) => { if (c.dossier && !(c.dossier in chapOf)) chapOf[c.dossier] = { c, ci }; });
  DOSSIERS.forEach(d => {
    const ref = chapOf[d.id]; if (!ref) return;
    (d.artistes || []).forEach(a => (a.oeuvres || []).forEach(o =>
      add({ id: `w:${o.wiki}`, ci: ref.ci, oi: -1, titre: o.titre, artiste: o.artiste || a.nom, wiki: o.wiki, expl: o.analyse || o.explication || "", ctx: "", chNum: ref.c.num, chTitre: ref.c.titre })));
  });
  CARDS_CACHE = cards;
  return cards;
}
const cardById = id => buildCards().find(c => c.id === id) || null;
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
  if (newCard) {
    steps.push({ type: "story", card: newCard });
    const nc = CHAPITRES[newCard.ci], no = nc && nc.oeuvres && newCard.oi >= 0 ? nc.oeuvres[newCard.oi] : null;
    if (no && (no.elements || []).length) steps.push({ type: "observe", card: newCard });
  }
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
