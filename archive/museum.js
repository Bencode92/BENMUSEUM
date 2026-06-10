import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/* =========================================================================
   Musée de l'Histoire de l'Art — visite première personne
   Structure : Période (étage) → Salles (par artiste ou thématiques) → Œuvres
   Supports : mur (tableau) · socle (sculpture : vraie 3D si .glb, sinon photo)
              · plafond (fresque, on lève la tête)
   Déplacement guidé : clic sol = on glisse · clic œuvre = on s'approche
   Glisser souris = regarder · ZQSD = marcher · portails = salle/étage suivants
   Avatar-guide stylisé dans chaque salle : clic = discussion IA
   ========================================================================= */

const ROOM = { w: 22, d: 30, h: 6.5 };
const EYE = 1.65;
const MARGIN = 1.6;

const AMBIANCE = {
  prehistoire:               { wall: 0x2a2420, floor: 0x352c24, ceil: 0x1a1612, amb: [0x6b4a2a, .55], spot: 0xffb066, fog: [0x1a1410, 0.012], frame: "stone" },
  "antiquite-orient":        { wall: 0xcdb98e, floor: 0xb8a070, ceil: 0xe6d9b8, amb: [0xfff0c0, .8],  spot: 0xfff2cc, fog: [0xe6d9b8, 0.004], frame: "stone" },
  "antiquite-greco-romaine": { wall: 0xe9e6df, floor: 0xcfcabd, ceil: 0xf4f2ec, amb: [0xffffff, .9],  spot: 0xffffff, fog: [0xeeede8, 0.003], frame: "stone" },
  "moyen-age":               { wall: 0x2e2433, floor: 0x241c28, ceil: 0x171019, amb: [0x6a4fa0, .45], spot: 0xd9b8ff, fog: [0x140e18, 0.016], frame: "gold" },
  renaissance:               { wall: 0x294a3a, floor: 0x6b5436, ceil: 0x14241c, amb: [0xfff0d0, .7],  spot: 0xffe9b8, fog: [0x14241c, 0.006], frame: "gold" },
  baroque:                   { wall: 0x2a1c12, floor: 0x3a2616, ceil: 0x140d08, amb: [0xffaa55, .5],  spot: 0xffcc88, fog: [0x120b06, 0.014], frame: "gold" },
  xixe:                      { wall: 0xf2ece2, floor: 0xddd3c4, ceil: 0xfbf8f1, amb: [0xfff8ee, .95], spot: 0xffffff, fog: [0xf2ece2, 0.003], frame: "gold" },
  moderne:                   { wall: 0xf6f6f6, floor: 0xdedede, ceil: 0xffffff, amb: [0xffffff, 1.0], spot: 0xffffff, fog: [0xf6f6f6, 0.002], frame: "black" },
};
const FRAME_COLOR = { gold: 0xc9a14a, black: 0x111111, stone: 0x8a8275, wood: 0x5a3d22 };

/* ---------- état ---------- */
let floors = [];
let rooms = [];           // salles aplaties : { fi, floor, salle }
let current = 0;

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 200);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const texLoader = new THREE.TextureLoader(); texLoader.setCrossOrigin("anonymous");
const gltfLoader = new GLTFLoader();

let roomGroup = new THREE.Group(); scene.add(roomGroup);
let pickables = [];
let spinners = [];        // objets 3D qui tournent (sculptures)
let avatar = null;        // référence pour l'animation
let currentEnv = "gallery";
const torches = [];       // lampes de torche à faire vaciller
let caveRockMat = null;   // matériau roche partagé (grotte)

// environnement par étage (les autres = galerie ; thématisables ensuite)
const ENV = { prehistoire: "cave" };

let yaw = 0, pitch = 0, targetYaw = 0, targetPitch = 0;
const targetPos = new THREE.Vector3();

/* =========================================================================
   Données + démarrage
   ========================================================================= */
const ready = fetch("data/periods.json")
  .then(r => { if (!r.ok) throw new Error("periods.json introuvable (HTTP " + r.status + ")"); return r.json(); })
  .then(data => {
    floors = data.floors;
    rooms = [];
    floors.forEach((f, fi) => f.salles.forEach(salle => rooms.push({ fi, floor: f, salle })));
    buildFloorMenu();
  });

document.getElementById("enterBtn").addEventListener("click", async () => {
  const msg = document.getElementById("loadingMsg");
  msg.hidden = false; msg.textContent = "Chargement de la première salle…";
  try {
    await ready;                 // attend que les données soient prêtes
    await loadRoom(0);
    document.getElementById("intro").hidden = true;
    document.getElementById("hud").hidden = false;
  } catch (err) {
    console.error("[musée] échec du chargement :", err);
    msg.textContent = "⚠️ " + (err && err.message ? err.message : err);
  }
});

/* =========================================================================
   Construction d'une salle
   ========================================================================= */
async function loadRoom(index) {
  current = index;
  const { floor, salle } = rooms[index];
  const amb = AMBIANCE[floor.id] || AMBIANCE.moderne;

  disposeRoom();
  pickables = []; spinners = []; avatar = null; torches.length = 0;
  currentEnv = ENV[floor.id] || "gallery";

  const { w, d, h } = ROOM;

  if (currentEnv === "cave") {
    scene.fog = new THREE.FogExp2(0x140d07, 0.028);
    scene.background = new THREE.Color(0x0a0805);
    buildCave();
  } else {
    scene.fog = new THREE.FogExp2(amb.fog[0], amb.fog[1] * 0.4);
    scene.background = new THREE.Color(amb.fog[0]);

    roomGroup.add(new THREE.AmbientLight(amb.amb[0], Math.max(amb.amb[1] * 1.7, 1.0)));
    roomGroup.add(new THREE.HemisphereLight(0xffffff, amb.floor, 0.55));
    [-10, -3, 4, 10].forEach(z => {
      const p = new THREE.PointLight(0xfff2e0, 0.9, 0, 0);
      p.position.set(0, h - 0.5, z); roomGroup.add(p);
    });

    const matWall = new THREE.MeshStandardMaterial({ color: amb.wall, roughness: .95 });
    const matFloor = new THREE.MeshStandardMaterial({ color: amb.floor, roughness: .8, metalness: .05 });
    const matCeil = new THREE.MeshStandardMaterial({ color: amb.ceil, roughness: 1 });

    const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), matFloor);
    floorMesh.rotation.x = -Math.PI / 2; floorMesh.userData = { type: "floor" };
    roomGroup.add(floorMesh); pickables.push(floorMesh);

    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(w, d), matCeil);
    ceil.rotation.x = Math.PI / 2; ceil.position.y = h; roomGroup.add(ceil);

    addWall(matWall, w, h, 0, h / 2, -d / 2, 0);
    addWall(matWall, w, h, 0, h / 2,  d / 2, Math.PI);
    addWall(matWall, d, h, -w / 2, h / 2, 0, Math.PI / 2);
    addWall(matWall, d, h,  w / 2, h / 2, 0, -Math.PI / 2);

    const accent = new THREE.PointLight(parseInt((floor.couleur || "#c9a14a").slice(1), 16), 0.6, 45);
    accent.position.set(0, h - 0.4, 0); roomGroup.add(accent);

    buildArchitecture(amb);
  }

  // titre de la salle, haut du mur du fond
  roomGroup.add(makeLabel(salle.nom.toUpperCase(), 0, h - 0.8, -d / 2 + 0.05, 1.5, amb.spot, floor.nom));

  // répartition des œuvres par support
  const murs = salle.oeuvres.filter(o => o.support === "mur");
  const socles = salle.oeuvres.filter(o => o.support === "socle");
  const plafonds = salle.oeuvres.filter(o => o.support === "plafond");

  // œuvre maîtresse au fond → on lui fait face en entrant
  if (murs.length) addArtwork(murs[0], 0, 0, -d / 2 + 0.12, amb);
  const rest = murs.slice(1);
  placeWall(rest.filter((_, i) => i % 2 === 0), -w / 2 + 0.12, Math.PI / 2, amb);
  placeWall(rest.filter((_, i) => i % 2 === 1),  w / 2 - 0.12, -Math.PI / 2, amb);
  placePedestals(socles, amb);
  plafonds.forEach(o => placeCeiling(o, h));

  // avatar-guide
  addAvatar(amb, floor);

  // portails : suivant = porte sur le mur droit (fond) · précédent = mur gauche (entrée)
  if (index < rooms.length - 1) addPortal(w / 2 - 0.15, EYE, -d / 2 + 4.5, +1, portalLabel(index + 1), amb.spot, -Math.PI / 2);
  if (index > 0)                addPortal(-w / 2 + 0.15, EYE,  d / 2 - 4.5, -1, portalLabel(index - 1), amb.spot, Math.PI / 2);

  const entryZ = d / 2 - 2.5;
  camera.position.set(0, EYE, entryZ);
  targetPos.set(0, EYE, entryZ);
  yaw = targetYaw = Math.PI; pitch = targetPitch = 0;
  applyOrientation();

  document.getElementById("floorName").textContent = floor.nom;
  document.getElementById("floorEra").textContent = (salle.type === "artiste" ? "Salle " + salle.nom + " · " : "") + floor.epoque;

  await new Promise(res => setTimeout(res, 40));
}

function portalLabel(i) {
  const r = rooms[i];
  return r.salle.type === "artiste" ? r.salle.nom : r.floor.nom;
}

function addWall(mat, length, height, x, y, z, rotY) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(length, height), mat);
  m.position.set(x, y, z); m.rotation.y = rotY; roomGroup.add(m);
}

/* ---------- MUR : tableaux ---------- */
function placeWall(list, wallX, rotY, amb) {
  const span = ROOM.d - 8;
  list.forEach((work, i) => {
    const z = list.length <= 1 ? 0 : -span / 2 + (span / (list.length - 1)) * i;
    addArtwork(work, wallX, rotY, z, amb);
  });
}

function addArtwork(work, x, rotY, z, amb) {
  const group = new THREE.Group();
  group.position.set(x, EYE + 0.25, z); group.rotation.y = rotY;
  const cave = currentEnv === "cave";
  const frameCol = FRAME_COLOR[amb.frame] || FRAME_COLOR.gold;
  let W = 2.4, H = 1.8;
  let frame = null, mat = null;

  if (!cave) {
    frame = new THREE.Mesh(new THREE.BoxGeometry(W + 0.34, H + 0.34, 0.16),
      new THREE.MeshStandardMaterial({ color: frameCol, roughness: .5, metalness: amb.frame === "gold" ? .7 : .2 }));
    group.add(frame);
    mat = new THREE.Mesh(new THREE.PlaneGeometry(W + 0.16, H + 0.16),
      new THREE.MeshStandardMaterial({ color: 0xf2ece0, roughness: .95 }));
    mat.position.z = 0.085; group.add(mat);
  }

  const picMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a, roughness: .9,
    emissive: cave ? 0x2a1d10 : 0x000000, emissiveIntensity: cave ? 0.35 : 0,
  });
  const pic = new THREE.Mesh(new THREE.PlaneGeometry(W, H), picMat);
  pic.position.z = cave ? 0.6 : 0.095;   // décollé de la paroi bosselée
  pic.userData = { type: "art", work, normal: new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY) };
  group.add(pic); pickables.push(pic);

  if (cave) {
    const gl = new THREE.PointLight(0xffb060, 6, 7, 2); gl.position.set(0, 0.2, 1.3); group.add(gl);
  } else {
    const spot = new THREE.SpotLight(amb.spot, 6, 14, Math.PI / 6, 0.5, 0);
    spot.position.set(0, 2.0, 1.8); spot.target = pic; group.add(spot, spot.target);
  }

  group.add(makeLabel(work.titre, 0, -H / 2 - 0.4, cave ? 0.62 : 0.1, 0.5, 0xffffff, work.annee));
  roomGroup.add(group);

  loadArtImage(work.wiki, tex => {
    picMat.map = tex; picMat.color.set(0xffffff); picMat.needsUpdate = true;
    const ar = tex.image.width / tex.image.height;
    let nh = 2.6, nw = 2.6 * ar; const maxW = 3.4;
    if (nw > maxW) { nw = maxW; nh = maxW / ar; }
    pic.scale.set(nw / W, nh / H, 1);
    if (mat) mat.scale.set((nw + 0.16) / (W + 0.16), (nh + 0.16) / (H + 0.16), 1);
    if (frame) frame.scale.set((nw + 0.34) / (W + 0.34), (nh + 0.34) / (H + 0.34), 1);
  });
}

/* ---------- SOCLE : sculptures (vraie 3D si modèle, sinon photo) ---------- */
function placePedestals(list, amb) {
  if (!list.length) return;
  if (list.length === 1) { addPedestal(list[0], 0, 0, amb); return; }
  // deux colonnes (x = ±4) pour garder l'allée centrale dégagée
  const rows = Math.ceil(list.length / 2);
  const span = Math.min(ROOM.d - 12, rows * 5);
  list.forEach((work, i) => {
    const x = i % 2 === 0 ? -4 : 4;
    const row = Math.floor(i / 2);
    const z = rows === 1 ? 0 : -span / 2 + (span / (rows - 1)) * row;
    addPedestal(work, x, z, amb);
  });
}

function addPedestal(work, x, z, amb) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const cave = currentEnv === "cave";
  const baseH = 1.0;

  const base = cave
    ? new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.95, baseH, 7), caveRockMat)
    : new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.95, baseH, 24),
        new THREE.MeshStandardMaterial({ color: 0xded6c8, roughness: .85 }));
  base.position.y = baseH / 2; group.add(base);

  // éclairage de l'œuvre
  if (cave) {
    const gl = new THREE.PointLight(0xffb060, 7, 8, 2); gl.position.set(0, 3, 0.3); group.add(gl);
  } else {
    const spot = new THREE.SpotLight(amb.spot, 8, 16, Math.PI / 6, 0.6, 0);
    spot.position.set(0, 5, 0.01); spot.target = base; group.add(spot, spot.target);
  }

  // zone cliquable autour de l'œuvre
  const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.4, 12),
    new THREE.MeshBasicMaterial({ visible: false }));
  hit.position.y = baseH + 1.2; hit.userData = { type: "art", work, normal: new THREE.Vector3(0, 0, 1) };
  group.add(hit); pickables.push(hit);

  group.add(makeLabel(work.titre, 0, baseH - 0.15, 0.96, 0.42, 0xffffff, work.annee));
  roomGroup.add(group);

  if (work.model) {
    // vraie 3D
    gltfLoader.load(work.model, gltf => {
      const obj = gltf.scene;
      fitOnPedestal(obj, baseH, 1.9);
      const spin = new THREE.Group(); spin.position.y = baseH; spin.add(obj);
      group.add(spin); spinners.push(spin);
    }, undefined, () => photoStandee(group, work, baseH)); // échec → photo
  } else {
    photoStandee(group, work, baseH);
  }
}

function fitOnPedestal(obj, baseH, targetH) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3(); box.getSize(size);
  const center = new THREE.Vector3(); box.getCenter(center);
  const s = targetH / Math.max(size.x, size.y, size.z);
  obj.scale.setScalar(s);
  obj.position.set(-center.x * s, -box.min.y * s, -center.z * s); // base posée sur le socle
}

function photoStandee(group, work, baseH) {
  const W = 1.6, H = 2.0;
  const mat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: .9, transparent: true, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(W, H), mat);
  plane.position.set(0, baseH + H / 2, 0);
  group.add(plane);
  loadArtImage(work.wiki, tex => {
    mat.map = tex; mat.color.set(0xffffff); mat.needsUpdate = true;
    const ar = tex.image.width / tex.image.height;
    let nh = 2.0, nw = 2.0 * ar; const maxW = 1.8;
    if (nw > maxW) { nw = maxW; nh = maxW / ar; }
    plane.scale.set(nw / W, nh / H, 1);
    plane.position.y = baseH + nh / 2;
  });
}

/* ---------- PLAFOND : fresques (on lève la tête) ---------- */
function placeCeiling(work, h) {
  const W = 9, H = 5;
  const mat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: .95, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(W, H), mat);
  plane.position.set(0, h - 0.12, -2);
  plane.rotation.x = Math.PI / 2;
  plane.userData = { type: "art", work, normal: new THREE.Vector3(0, -1, 0) };
  roomGroup.add(plane); pickables.push(plane);

  const up = new THREE.PointLight(0xfff0d0, 1.4, 0, 0); up.position.set(0, h - 1.5, -2); roomGroup.add(up);

  loadArtImage(work.wiki, tex => {
    mat.map = tex; mat.color.set(0xffffff); mat.needsUpdate = true;
    const ar = tex.image.width / tex.image.height;
    let nw = W, nh = W / ar; if (nh > 6) { nh = 6; nw = 6 * ar; }
    plane.scale.set(nw / W, nh / H, 1);
  });
}

/* ---------- AVATAR-GUIDE ---------- */
function addAvatar(amb, floor) {
  const g = new THREE.Group();
  g.position.set(2.6, 0, ROOM.d / 2 - 5);
  const col = parseInt((floor.couleur || "#c9a14a").slice(1), 16);
  const mat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: .45, roughness: .4 });

  const body = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.5, 24), mat);
  body.position.y = 0.75; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 16), mat);
  head.position.y = 1.7; g.add(head);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.03, 12, 32),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: .6 }));
  halo.position.y = 2.05; halo.rotation.x = Math.PI / 2; g.add(halo);

  const light = new THREE.PointLight(col, 0.7, 8); light.position.y = 1.4; g.add(light);

  // zone cliquable
  const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.2, 8),
    new THREE.MeshBasicMaterial({ visible: false }));
  hit.position.y = 1.1; hit.userData = { type: "guide" }; g.add(hit); pickables.push(hit);

  g.add(makeLabel("Guide — parle-moi", 0, 2.5, 0, 0.5, 0xffffff));
  roomGroup.add(g);
  avatar = g;
}

function addPortal(x, y, z, dir, label, color, rotY = (dir < 0 ? Math.PI : 0)) {
  const group = new THREE.Group();
  group.position.set(x, y, z); group.rotation.y = rotY;
  // chambranle clair pour faire « porte »
  const jambMat = new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: .8 });
  [-1.25, 1.25].forEach(jx => { const j = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.2, 0.3), jambMat); j.position.set(jx, 0.2, 0); group.add(j); });
  const lint = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.3, 0.3), jambMat); lint.position.set(0, 1.75, 0); group.add(lint);
  const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: .6, transparent: true, opacity: .82, side: THREE.DoubleSide });
  const arch = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3.0), mat);
  arch.userData = { type: "portal", dir }; group.add(arch); pickables.push(arch);
  group.add(makeLabel((dir > 0 ? "→ " : "← ") + label, 0, 2.1, 0.04, 0.7, color));
  roomGroup.add(group);
}

/* ---------- architecture de la salle ---------- */
function buildArchitecture(amb) {
  const { w, d, h } = ROOM;
  const trimCol = new THREE.Color(amb.wall).multiplyScalar(0.45);
  const trimMat = new THREE.MeshStandardMaterial({ color: trimCol, roughness: .7 });

  const strip = (len, x, z, ry, y, th) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, th, 0.14), trimMat);
    m.position.set(x, y, z); m.rotation.y = ry; roomGroup.add(m);
  };
  // plinthes
  strip(w, 0, -d / 2 + 0.07, 0, 0.13, 0.26); strip(w, 0, d / 2 - 0.07, 0, 0.13, 0.26);
  strip(d, -w / 2 + 0.07, 0, Math.PI / 2, 0.13, 0.26); strip(d, w / 2 - 0.07, 0, Math.PI / 2, 0.13, 0.26);
  // corniche
  strip(w, 0, -d / 2 + 0.07, 0, h - 0.2, 0.3); strip(w, 0, d / 2 - 0.07, 0, h - 0.2, 0.3);
  strip(d, -w / 2 + 0.07, 0, Math.PI / 2, h - 0.2, 0.3); strip(d, w / 2 - 0.07, 0, Math.PI / 2, h - 0.2, 0.3);

  // tapis central
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.4, d * 0.62),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(amb.floor).multiplyScalar(0.7), roughness: .98 }));
  rug.rotation.x = -Math.PI / 2; rug.position.y = 0.02; roomGroup.add(rug);

  // banc capitonné, près de l'entrée
  const benchMat = new THREE.MeshStandardMaterial({ color: 0x4a3826, roughness: .65 });
  const bench = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 1.0), benchMat);
  bench.position.set(0, 0.25, d / 2 - 6); roomGroup.add(bench);

  // colonnes encadrant le mur du fond
  const colMat = new THREE.MeshStandardMaterial({ color: 0xe2dccd, roughness: .85 });
  [-w / 2 + 2.2, w / 2 - 2.2].forEach(x => {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, h, 22), colMat);
    c.position.set(x, h / 2, -d / 2 + 1.6); roomGroup.add(c);
  });
}

/* ---------- environnement GROTTE (préhistoire) ---------- */
function buildCave() {
  const { w, d, h } = ROOM;
  caveRockMat = new THREE.MeshStandardMaterial({ map: makeRockTexture(), color: 0x7a6147, roughness: 1, metalness: 0 });

  // sol rocheux irrégulier (cliquable)
  const floorGeo = new THREE.PlaneGeometry(w + 2, d + 2, 36, 48); displace(floorGeo, 0.22);
  const floorMesh = new THREE.Mesh(floorGeo, caveRockMat);
  floorMesh.rotation.x = -Math.PI / 2; floorMesh.userData = { type: "floor" };
  roomGroup.add(floorMesh); pickables.push(floorMesh);

  // voûte basse et irrégulière
  const ceilGeo = new THREE.PlaneGeometry(w + 2, d + 2, 30, 40); displace(ceilGeo, 0.7);
  const ceil = new THREE.Mesh(ceilGeo, caveRockMat);
  ceil.rotation.x = Math.PI / 2; ceil.position.y = h - 0.9; roomGroup.add(ceil);

  // parois bosselées
  addCaveWall(w, h, 0, h / 2, -d / 2, 0);
  addCaveWall(w, h, 0, h / 2,  d / 2, Math.PI);
  addCaveWall(d, h, -w / 2, h / 2, 0, Math.PI / 2);
  addCaveWall(d, h,  w / 2, h / 2, 0, -Math.PI / 2);

  roomGroup.add(new THREE.AmbientLight(0x3a2614, 0.55));

  // torches le long des parois
  [[-w / 2 + 1.3, 6], [w / 2 - 1.3, 2], [-w / 2 + 1.3, -6], [w / 2 - 1.3, -10], [0, d / 2 - 3]]
    .forEach(([x, z]) => addTorch(x, z));

  // stalactites + stalagmites + rochers
  for (let i = 0; i < 18; i++) addStalactite((Math.random() - .5) * w * .85, h - 1.0, (Math.random() - .5) * d * .88);
  for (let i = 0; i < 10; i++) addRock((Math.random() - .5) * w * .8, (Math.random() - .5) * d * .85);
}

function makeRockTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = "#5b4836"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 12000; i++) {
    const x = Math.random() * 256, y = Math.random() * 256, v = Math.random();
    g.fillStyle = `rgba(${(50 + v * 70) | 0},${(38 + v * 50) | 0},${(26 + v * 34) | 0},0.5)`;
    g.fillRect(x, y, 2, 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 4); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function displace(geo, amt) {
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const n = Math.sin(x * 0.7) * Math.cos(y * 0.55) + Math.sin(x * 1.9 + 1.3) * 0.5 + (Math.random() - .5) * 0.7;
    p.setZ(i, n * amt);
  }
  p.needsUpdate = true; geo.computeVertexNormals();
}

function addCaveWall(length, height, x, y, z, rotY) {
  const geo = new THREE.PlaneGeometry(length, height, 28, 14); displace(geo, 0.5);
  const m = new THREE.Mesh(geo, caveRockMat);
  m.position.set(x, y, z); m.rotation.y = rotY; roomGroup.add(m);
}

function addTorch(x, z) {
  const light = new THREE.PointLight(0xff7a26, 14, 16, 2);
  light.position.set(x, 2.7, z); light.userData = { base: 14 };
  roomGroup.add(light); torches.push(light);
  const flame = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffb24a }));
  flame.position.copy(light.position); roomGroup.add(flame);
  const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.7, 6),
    new THREE.MeshStandardMaterial({ color: 0x2a1a0e, roughness: 1 }));
  holder.position.set(x, 2.3, z); roomGroup.add(holder);
}

function addStalactite(x, y, z) {
  const len = 0.5 + Math.random() * 1.4;
  const m = new THREE.Mesh(new THREE.ConeGeometry(0.15 + Math.random() * 0.2, len, 6), caveRockMat);
  m.position.set(x, y - len / 2, z); m.rotation.x = Math.PI; roomGroup.add(m);
}

function addRock(x, z) {
  const r = 0.35 + Math.random() * 0.6;
  const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), caveRockMat);
  m.position.set(x, r * 0.5, z); m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
  roomGroup.add(m);
}

/* ---------- étiquettes texte ---------- */
function makeLabel(text, x, y, z, scale, color = 0xffffff, sub = "") {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = sub ? 320 : 200;
  const g = c.getContext("2d");
  g.fillStyle = "#" + new THREE.Color(color).getHexString();
  g.textAlign = "center"; g.textBaseline = "middle";
  g.font = "bold 76px Georgia"; g.fillText(text, 512, sub ? 110 : 100, 980);
  if (sub) { g.font = "italic 52px Georgia"; g.globalAlpha = .8; g.fillText(sub, 512, 220, 980); }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  spr.position.set(x, y, z); spr.scale.set(scale * (c.width / c.height), scale, 1);
  return spr;
}

function disposeRoom() {
  roomGroup.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); });
  });
  scene.remove(roomGroup); roomGroup = new THREE.Group(); scene.add(roomGroup);
}

/* =========================================================================
   Images libres via l'API Wikipédia (CORS OK)
   ========================================================================= */
const imgCache = new Map();
function loadArtImage(title, onTex) {
  getImageUrl(title).then(url => {
    if (!url) return;
    texLoader.load(url, tex => { tex.colorSpace = THREE.SRGBColorSpace; onTex(tex); });
  });
}
async function getImageUrl(title) {
  if (imgCache.has(title)) return imgCache.get(title);
  try {
    const u = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=1000&titles=${encodeURIComponent(title)}&origin=*`;
    const j = await (await fetch(u)).json();
    const pages = j.query.pages; const first = pages[Object.keys(pages)[0]];
    const url = first?.thumbnail?.source || null; imgCache.set(title, url); return url;
  } catch { return null; }
}

/* =========================================================================
   Interaction : déplacement guidé + regard
   ========================================================================= */
let downX = 0, downY = 0, dragging = false, moved = false;
canvas.addEventListener("pointerdown", e => { downX = e.clientX; downY = e.clientY; dragging = true; moved = false; });
canvas.addEventListener("pointermove", e => {
  if (!dragging) return;
  if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 6) moved = true;
  if (moved) {
    targetYaw -= (e.movementX || 0) * 0.0045;
    targetPitch -= (e.movementY || 0) * 0.0045;
    targetPitch = Math.max(-1.1, Math.min(1.1, targetPitch));
  }
});
canvas.addEventListener("pointerup", e => { dragging = false; if (!moved) handleClick(e); });

function handleClick(e) {
  pointer.x = (e.clientX / innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickables, false);
  if (!hits.length) return;
  const hit = hits[0]; const t = hit.object.userData.type;

  if (t === "floor") {
    targetPos.set(
      clamp(hit.point.x, -ROOM.w / 2 + MARGIN, ROOM.w / 2 - MARGIN), EYE,
      clamp(hit.point.z, -ROOM.d / 2 + MARGIN, ROOM.d / 2 - MARGIN));
  } else if (t === "art") {
    focusArt(hit.object);
  } else if (t === "guide") {
    goNear(hit.object, 2.6); openGuide();
  } else if (t === "portal") {
    const next = current + hit.object.userData.dir;
    if (next >= 0 && next < rooms.length) loadRoom(next);
  }
}

function focusArt(obj) {
  const center = new THREE.Vector3(); obj.getWorldPosition(center);
  const n = obj.userData.normal.clone().normalize();
  if (n.y < -0.5) {           // plafond : on se met dessous et on lève la tête
    targetPos.set(0, EYE, -1);
  } else {
    targetPos.copy(center).addScaledVector(n, 3.2); targetPos.y = EYE;
  }
  targetPos.x = clamp(targetPos.x, -ROOM.w / 2 + MARGIN, ROOM.w / 2 - MARGIN);
  targetPos.z = clamp(targetPos.z, -ROOM.d / 2 + MARGIN, ROOM.d / 2 - MARGIN);
  const dir = center.clone().sub(targetPos).normalize();
  targetYaw = Math.atan2(-dir.x, -dir.z);
  targetPitch = Math.asin(clamp(dir.y, -1, 1));
  openWork(obj.userData.work);
}

function goNear(obj, dist) {
  const c = new THREE.Vector3(); obj.getWorldPosition(c);
  const toCam = camera.position.clone().sub(c); toCam.y = 0; toCam.normalize();
  targetPos.copy(c).addScaledVector(toCam, dist); targetPos.y = EYE;
  targetPos.x = clamp(targetPos.x, -ROOM.w / 2 + MARGIN, ROOM.w / 2 - MARGIN);
  targetPos.z = clamp(targetPos.z, -ROOM.d / 2 + MARGIN, ROOM.d / 2 - MARGIN);
  const dir = c.clone().sub(targetPos).normalize();
  targetYaw = Math.atan2(-dir.x, -dir.z); targetPitch = 0;
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const keys = {};
addEventListener("keydown", e => { keys[e.key.toLowerCase()] = true; });
addEventListener("keyup", e => { keys[e.key.toLowerCase()] = false; });
function keyboardMove() {
  const f = (keys["z"] || keys["w"] || keys["arrowup"] ? 1 : 0) - (keys["s"] || keys["arrowdown"] ? 1 : 0);
  const s = (keys["d"] || keys["arrowright"] ? 1 : 0) - (keys["q"] || keys["a"] || keys["arrowleft"] ? 1 : 0);
  if (!f && !s) return;
  const fwd = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  targetPos.addScaledVector(fwd, f * 0.18).addScaledVector(right, s * 0.18);
  targetPos.x = clamp(targetPos.x, -ROOM.w / 2 + MARGIN, ROOM.w / 2 - MARGIN);
  targetPos.z = clamp(targetPos.z, -ROOM.d / 2 + MARGIN, ROOM.d / 2 - MARGIN);
}
function applyOrientation() { camera.rotation.set(pitch, yaw, 0, "YXZ"); }

/* =========================================================================
   Boucle de rendu
   ========================================================================= */
let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.016;
  keyboardMove();
  camera.position.lerp(targetPos, 0.09);
  yaw += (targetYaw - yaw) * 0.12;
  pitch += (targetPitch - pitch) * 0.12;
  applyOrientation();
  spinners.forEach(s => s.rotation.y += 0.004);
  if (avatar) avatar.position.y = Math.sin(t * 1.5) * 0.08;
  for (const l of torches) l.intensity = l.userData.base * (0.72 + Math.random() * 0.5);
  renderer.render(scene, camera);
}
animate();

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

/* =========================================================================
   UI : menu, panneau œuvre / guide, chat IA, mémoire
   ========================================================================= */
function buildFloorMenu() {
  const ul = document.getElementById("floorList"); ul.innerHTML = "";
  rooms.forEach((r, i) => {
    const li = document.createElement("li");
    const nom = r.salle.type === "artiste" ? r.salle.nom : r.salle.nom;
    li.innerHTML = `<span class="fl-name">${r.floor.etage}. ${nom}</span><span class="fl-era">${r.floor.nom}</span>`;
    li.addEventListener("click", () => { document.getElementById("floorMenu").hidden = true; loadRoom(i); });
    ul.appendChild(li);
  });
}
document.getElementById("mapBtn").addEventListener("click", () => document.getElementById("floorMenu").hidden = false);
document.getElementById("closeMenu").addEventListener("click", () => document.getElementById("floorMenu").hidden = true);

let ctx = null;  // { kind:'oeuvre'|'salle', work? }
function openWork(work) {
  ctx = { kind: "oeuvre", work };
  showPanel(work.titre, `${work.artiste} · ${work.annee}`, work.note);
}
function openGuide() {
  const { floor, salle } = rooms[current];
  ctx = { kind: "salle" };
  const meta = salle.type === "artiste" ? `${salle.nom} · ${floor.nom}` : `${floor.nom} · salle thématique`;
  showPanel(salle.type === "artiste" ? salle.nom : salle.nom, meta, salle.presentation);
}
function showPanel(title, meta, note) {
  document.getElementById("pTitle").textContent = title;
  document.getElementById("pMeta").textContent = meta;
  document.getElementById("pNote").textContent = note;
  const log = document.getElementById("chatLog"); log.innerHTML = "";
  loadNotes().forEach(m => addMsg(m.role, m.text));
  document.getElementById("panel").hidden = false;
  document.getElementById("chatInput").focus();
}
document.getElementById("closePanel").addEventListener("click", () => document.getElementById("panel").hidden = true);

function addMsg(role, text) {
  const log = document.getElementById("chatLog");
  const div = document.createElement("div");
  div.className = "msg " + (role === "user" ? "me" : "bot");
  div.textContent = text; log.appendChild(div); log.scrollTop = log.scrollHeight;
  return div;
}

document.getElementById("chatForm").addEventListener("submit", async e => {
  e.preventDefault();
  const input = document.getElementById("chatInput");
  const q = input.value.trim(); if (!q || !ctx) return;
  input.value = ""; addMsg("user", q); saveNote("user", q);
  const thinking = addMsg("bot", "…"); thinking.classList.add("thinking");

  const { floor, salle } = rooms[current];
  try {
    const r = await fetch("/api/ask", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({
        floorName: floor.nom, epoque: floor.epoque,
        salle: { type: salle.type, nom: salle.nom, presentation: salle.presentation },
        work: ctx.kind === "oeuvre" ? ctx.work : null,
        question: q, history: loadNotes().slice(-8),
      }),
    });
    if (!r.ok) throw new Error(await r.text());
    const j = await r.json();
    thinking.classList.remove("thinking"); thinking.textContent = j.answer;
    saveNote("assistant", j.answer);
  } catch {
    thinking.classList.remove("thinking");
    thinking.textContent = "⚠️ Guide hors ligne. Lance `node server.js` avec ta clé API pour l'activer (voir README). Ta question est gardée.";
  }
});

/* mémoire locale par salle/œuvre */
function noteKey() {
  const { floor, salle } = rooms[current];
  return "musee:" + floor.id + ":" + salle.nom + ":" + (ctx?.kind === "oeuvre" ? ctx.work.titre : "_salle");
}
function loadNotes() { try { return JSON.parse(localStorage.getItem(noteKey())) || []; } catch { return []; } }
function saveNote(role, text) { const a = loadNotes(); a.push({ role, text }); localStorage.setItem(noteKey(), JSON.stringify(a)); }

document.getElementById("guideHint").textContent = "Tes échanges sont mémorisés sur cet appareil et enrichissent le musée.";
