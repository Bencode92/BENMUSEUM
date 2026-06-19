/* =========================================================================
   BENMUSEUM — Cloudflare Worker : proxy vers l'API Claude + écriture partagée GitHub
   Secrets (jamais dans le navigateur) :
     - ANTHROPIC_API_KEY : clé Claude (discussion / quiz / enrichissement)
     - GITHUB_TOKEN      : jeton GitHub fine-grained (Contents: read/write sur BENMUSEUM) — pour le mode "save"
     - EDIT_PASSWORD     : phrase de passe qui autorise l'écriture partagée (anti-vandalisme)
   Le mode "save" ajoute une entrée à data/community.json (couche partagée, visible par tous).
   Déploiement : voir worker/README.md
   ========================================================================= */

const DEFAULT_MODEL = "claude-sonnet-4-6";
const GH_REPO = "Bencode92/BENMUSEUM";
const GH_PATH = "data/community.json";
const GH_BRANCH = "main";

const ALLOWED = [
  "https://bencode92.github.io",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];
function corsHeaders(origin) {
  const allow = ALLOWED.includes(origin) ? origin : ALLOWED[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Vary": "Origin",
  };
}
function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), { status, headers: { ...cors, "content-type": "application/json" } });
}
// base64 UTF-8 (les fiches contiennent des accents)
const b64encode = str => btoa(unescape(encodeURIComponent(str)));
const b64decode = b64 => decodeURIComponent(escape(atob((b64 || "").replace(/\n/g, ""))));

async function ghGet(env) {
  const r = await fetch(`https://api.github.com/repos/${GH_REPO}/contents/${GH_PATH}?ref=${GH_BRANCH}`, {
    headers: { Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json", "User-Agent": "benmuseum-worker" },
  });
  if (r.status === 404) return { list: [], sha: null };
  if (!r.ok) throw new Error("GitHub GET " + r.status);
  const j = await r.json();
  let list = []; try { list = JSON.parse(b64decode(j.content)); } catch { list = []; }
  return { list: Array.isArray(list) ? list : [], sha: j.sha };
}
async function ghPut(env, list, sha, msg) {
  const body = { message: msg, content: b64encode(JSON.stringify(list, null, 2) + "\n"), branch: GH_BRANCH };
  if (sha) body.sha = sha;
  return fetch(`https://api.github.com/repos/${GH_REPO}/contents/${GH_PATH}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json", "User-Agent": "benmuseum-worker", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request.headers.get("Origin") || "");
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ error: "POST uniquement" }, 405, cors);

    let b;
    try { b = await request.json(); } catch { return json({ error: "JSON invalide" }, 400, cors); }
    const { mode } = b;

    /* ---------- mode "save" : écriture partagée dans community.json ---------- */
    if (mode === "save") {
      if (!env.GITHUB_TOKEN) return json({ error: "GITHUB_TOKEN absent (secret Worker)" }, 500, cors);
      if (!env.EDIT_PASSWORD || b.password !== env.EDIT_PASSWORD) return json({ error: "Phrase de passe incorrecte" }, 403, cors);
      const entry = b.entry;
      if (!entry || !entry.scope || !entry.type) return json({ error: "Entrée invalide" }, 400, cors);
      try {
        for (let attempt = 0; attempt < 2; attempt++) {
          const { list, sha } = await ghGet(env);
          list.push({ ...entry, ts: new Date().toISOString().slice(0, 10) });
          const r = await ghPut(env, list, sha, `community: +${entry.type} (${entry.scope})`);
          if (r.ok) return json({ ok: true, count: list.length }, 200, cors);
          if (r.status === 409 && attempt === 0) continue; // sha périmé → on relit et réessaie
          const e = await r.text();
          return json({ error: "GitHub " + r.status + " " + e.slice(0, 200) }, 502, cors);
        }
        return json({ error: "Conflit d'écriture, réessaie" }, 409, cors);
      } catch (e) { return json({ error: String(e) }, 500, cors); }
    }

    /* ---------- modes IA (nécessitent la clé Claude) ---------- */
    if (!env.ANTHROPIC_API_KEY) return json({ error: "Clé absente (configurer le secret ANTHROPIC_API_KEY)" }, 500, cors);

    let system, messages, maxTokens = 700;

    if (mode === "quiz") {
      const n = Math.min(Math.max(parseInt(b.n) || 4, 2), 10);
      system =
        "Tu es un professeur d'histoire de l'art. À partir du CONTENU fourni, rédige " + n + " questions de QCM en français, " +
        "VARIÉES, couvrant plusieurs angles : le CONTEXTE de l'époque (ce qui se passait, le mécénat, le pourquoi), " +
        "les ARTISTES (qui ils sont, leur rôle, leur vie), les ŒUVRES (description, détails à repérer), " +
        "l'ATTRIBUTION (« Qui a peint / sculpté telle œuvre ? », « De quel artiste est… ? ») " +
        "et la COMPRÉHENSION (« Pourquoi… ? », « Qu'est-ce que cette œuvre change ? », l'enjeu, le problème résolu). " +
        "Mélange les niveaux (faciles et plus fins). Questions claires et non ambiguës, portant uniquement sur des faits présents dans le contenu. " +
        "Chaque question a 4 options dont UNE seule correcte, et une courte explication. " +
        "Réponds UNIQUEMENT par un JSON valide, sans aucun texte autour, de la forme exacte : " +
        '{"questions":[{"q":"…","options":["…","…","…","…"],"answer":0,"explication":"…"}]} ' +
        "où answer est l'index (0-3) de la bonne option.";
      messages = [{ role: "user", content: "CONTENU :\n" + (b.contenu || "") }];
      maxTokens = 1400;
    } else if (mode === "enrich") {
      system =
        "Tu es un vérificateur de contenu d'histoire de l'art. On te donne le CONTENU EXISTANT d'une fiche, puis un TEXTE proposé par l'utilisateur. " +
        "Réponds en français, en 3 sections courtes :\n" +
        "✅ NOUVEAU (faits exacts absents de la fiche, à ajouter)\n" +
        "↺ DÉJÀ COUVERT (ce qui répète la fiche)\n" +
        "⚠️ À VÉRIFIER (ce qui semble douteux ou faux).\n" +
        "Sois concis et factuel.";
      messages = [{ role: "user", content: `CONTENU EXISTANT :\n${b.fiche || ""}\n\nTEXTE PROPOSÉ :\n${b.texte || ""}` }];
      maxTokens = 800;
    } else {
      const ctx = [
        b.floorName ? `Période / chapitre : ${b.floorName}${b.epoque ? ` (${b.epoque})` : ""}.` : "",
        b.salle ? `Sujet : ${b.salle.nom}. ${b.salle.presentation || ""}` : "",
        b.work ? `Œuvre devant le visiteur : « ${b.work.titre} » — ${b.work.artiste}, ${b.work.annee}. ${b.work.note || ""}` : "",
      ].filter(Boolean).join("\n");
      system =
        "Tu es le guide d'un musée virtuel d'histoire de l'art, dans l'esprit de Gombrich : tu expliques ce que chaque artiste cherchait à résoudre, sans jargon, avec chaleur et précision. " +
        "Réponds en français, de façon concise (3 à 6 phrases), concrète et vivante. Appuie-toi sur le contexte ci-dessous ; si on te demande autre chose, réponds quand même utilement.\n\n" + ctx;
      const history = Array.isArray(b.history) ? b.history : [];
      messages = [
        ...history.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text })),
        { role: "user", content: b.question || "" },
      ];
    }

    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({ model: env.MODEL || DEFAULT_MODEL, max_tokens: maxTokens, system, messages }),
      });
      const data = await r.json();
      if (!r.ok) return json({ error: data }, 502, cors);
      const answer = (data.content || []).filter(x => x.type === "text").map(x => x.text).join("\n").trim();
      return json({ answer }, 200, cors);
    } catch (e) {
      return json({ error: String(e) }, 500, cors);
    }
  },
};
