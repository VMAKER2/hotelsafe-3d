/* ==========================================================================
   HotelSafe. — Sculptural Architectural 3D Hotel & 4 Room Cutaway Dioramas
   Built with Three.js + RoundedBoxGeometry + RoomEnvironment Studio Lighting
   ========================================================================== */

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* ---------- Procedural Matte Architectural Studio Textures ---------- */
function createStudioTextures() {
  function makeCanvasTex(w, h, drawFn, repeatX = 1, repeatY = 1) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    drawFn(ctx, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    return tex;
  }

  // 1. Warm Travertine Tile (Lobby)
  const travertine = makeCanvasTex(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#E2DACB';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 160; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,252,246,0.16)' : 'rgba(186,172,150,0.14)';
      ctx.fillRect(Math.random() * w, Math.random() * h, 45 + Math.random() * 90, 3 + Math.random() * 8);
    }
    ctx.strokeStyle = 'rgba(155,144,126,0.32)';
    ctx.lineWidth = 2;
    for (let x = 0; x <= w; x += 128) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += 128) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
  }, 3, 2.5);

  // 2. Hygienic Commercial Kitchen Tile
  const kitchenTile = makeCanvasTex(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#DFDFDB';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(150,152,146,0.42)';
    ctx.lineWidth = 2;
    for (let x = 0; x <= w; x += 85.33) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += 85.33) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
  }, 3.2, 2.6);

  // 3. Natural Warm Oak Plank (Guest Room)
  const oakWood = makeCanvasTex(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#CFA878';
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 64) {
      ctx.fillStyle = (y / 64) % 2 === 0 ? 'rgba(255,235,205,0.14)' : 'rgba(148,104,58,0.12)';
      ctx.fillRect(0, y, w, 62);
      ctx.strokeStyle = 'rgba(120,82,42,0.28)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = 'rgba(130,88,45,0.09)';
      ctx.fillRect(Math.random() * w, Math.random() * h, 70 + Math.random() * 110, 2);
    }
  }, 2.4, 2.4);

  // 4. Deep Walnut Wood (Check-in Counter)
  const walnut = makeCanvasTex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#6B462D';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 140; i++) {
      ctx.fillStyle = i % 2 ? 'rgba(42,24,12,0.22)' : 'rgba(135,92,58,0.15)';
      ctx.fillRect(0, Math.random() * h, w, 2 + Math.random() * 4);
    }
  }, 1, 1);

  // 5. SOC Raised Floor Grid
  const socFloor = makeCanvasTex(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#DBDCD8';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(125,128,122,0.38)';
    ctx.lineWidth = 2;
    for (let x = 0; x <= w; x += 102.4) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += 102.4) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
  }, 3, 2.5);

  // 6. VMS Multi-Camera Live Monitor Texture
  const vmsScreen = makeCanvasTex(512, 320, (ctx, w, h) => {
    ctx.fillStyle = '#181C20';
    ctx.fillRect(0, 0, w, h);
    const cells = [
      { x: 10, y: 10, cw: 240, ch: 145, bg: '#CFC7B8', title: 'CAM 01 • LOBBY' },
      { x: 262, y: 10, cw: 240, ch: 145, bg: '#C6C8C4', title: 'CAM 02 • KITCHEN' },
      { x: 10, y: 165, cw: 240, ch: 145, bg: '#C8B89E', title: 'CAM 03 • CORRIDOR' },
      { x: 262, y: 165, cw: 240, ch: 145, bg: '#BEC6CC', title: 'CAM 04 • ENTRANCE' }
    ];
    cells.forEach((c) => {
      ctx.fillStyle = c.bg;
      ctx.fillRect(c.x, c.y, c.cw, c.ch);
      ctx.fillStyle = 'rgba(25,28,30,0.22)';
      ctx.fillRect(c.x + 30, c.y + 40, c.cw - 60, c.ch - 55);
      ctx.fillStyle = 'rgba(20,22,24,0.78)';
      ctx.fillRect(c.x, c.y, c.cw, 24);
      ctx.fillStyle = '#57C97A';
      ctx.beginPath(); ctx.arc(c.x + 13, c.y + 12, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F3F4F2';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(c.title, c.x + 24, c.y + 16);
    });
  });

  // 7. Hotel Sign Plaque Texture
  const hotelSign = makeCanvasTex(512, 128, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#FAF8F3';
    ctx.font = '800 78px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HOTEL', w / 2, h / 2 + 4);
  });

  return { travertine, kitchenTile, oakWood, walnut, socFloor, vmsScreen, hotelSign };
}

/* ---------- Shared Studio Materials & Helper Primitives ---------- */
function createMaterials(tex) {
  return {
    plinth: new THREE.MeshStandardMaterial({ color: 0xe1e1dc, roughness: 0.85, metalness: 0.02 }),
    cutawayWall: new THREE.MeshStandardMaterial({ color: 0xf4f2ed, roughness: 0.78, metalness: 0.02 }),
    stuccoCream: new THREE.MeshStandardMaterial({ color: 0xf0e7d5, roughness: 0.72, metalness: 0.02 }),
    ochreTop: new THREE.MeshStandardMaterial({ color: 0xdca968, roughness: 0.68, metalness: 0.03 }),
    terracotta: new THREE.MeshStandardMaterial({ color: 0xca6d5a, roughness: 0.62, metalness: 0.04 }),
    trimSand: new THREE.MeshStandardMaterial({ color: 0xe3cca6, roughness: 0.65, metalness: 0.03 }),
    windowGlass: new THREE.MeshPhysicalMaterial({
      color: 0x566573,
      roughness: 0.14,
      metalness: 0.18,
      transmission: 0.35,
      transparent: true,
      opacity: 0.82
    }),
    clearGlass: new THREE.MeshPhysicalMaterial({
      color: 0xd9e4ea,
      roughness: 0.08,
      metalness: 0.05,
      transparent: true,
      opacity: 0.42
    }),
    warmInteriorGlow: new THREE.MeshStandardMaterial({
      color: 0xf7e6c4,
      emissive: 0xf0d29c,
      emissiveIntensity: 0.38,
      roughness: 0.9
    }),
    travertineFloor: new THREE.MeshStandardMaterial({ map: tex.travertine, roughness: 0.62, metalness: 0.04 }),
    kitchenFloor: new THREE.MeshStandardMaterial({ map: tex.kitchenTile, roughness: 0.58, metalness: 0.05 }),
    oakFloor: new THREE.MeshStandardMaterial({ map: tex.oakWood, roughness: 0.56, metalness: 0.04 }),
    walnutWood: new THREE.MeshStandardMaterial({ map: tex.walnut, roughness: 0.48, metalness: 0.06 }),
    corridorCarpet: new THREE.MeshStandardMaterial({ color: 0xb6afa3, roughness: 0.92, metalness: 0.0 }),
    socFloor: new THREE.MeshStandardMaterial({ map: tex.socFloor, roughness: 0.55, metalness: 0.08 }),
    fabricSofa: new THREE.MeshStandardMaterial({ color: 0xdfd8cc, roughness: 0.88, metalness: 0.0 }),
    beddingCream: new THREE.MeshStandardMaterial({ color: 0xf1ece2, roughness: 0.86, metalness: 0.0 }),
    bedThrow: new THREE.MeshStandardMaterial({ color: 0xd4cab8, roughness: 0.88, metalness: 0.0 }),
    oakSolid: new THREE.MeshStandardMaterial({ color: 0xc59b6b, roughness: 0.55, metalness: 0.04 }),
    wardrobeMatte: new THREE.MeshStandardMaterial({ color: 0xe6e4de, roughness: 0.68, metalness: 0.03 }),
    brushedSteel: new THREE.MeshStandardMaterial({ color: 0xcfd4d8, roughness: 0.28, metalness: 0.82 }),
    darkAluminum: new THREE.MeshStandardMaterial({ color: 0x45494e, roughness: 0.38, metalness: 0.62 }),
    matteBlack: new THREE.MeshStandardMaterial({ color: 0x1e2022, roughness: 0.48, metalness: 0.25 }),
    whiteHousing: new THREE.MeshStandardMaterial({ color: 0xf5f5f2, roughness: 0.36, metalness: 0.08 }),
    smokedDome: new THREE.MeshPhysicalMaterial({
      color: 0x1e262e,
      roughness: 0.08,
      metalness: 0.12,
      transparent: true,
      opacity: 0.62
    }),
    fireRed: new THREE.MeshStandardMaterial({ color: 0xc63d2f, roughness: 0.36, metalness: 0.14 }),
    gasYellow: new THREE.MeshStandardMaterial({ color: 0xdfb23d, roughness: 0.35, metalness: 0.35 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xc9a24b, roughness: 0.25, metalness: 0.85 }),
    foliage: new THREE.MeshStandardMaterial({ color: 0x5c7c47, roughness: 0.82, metalness: 0.02 }),
    cabinetGrey: new THREE.MeshStandardMaterial({ color: 0x9fa5a8, roughness: 0.45, metalness: 0.42 }),
    ledGreen: new THREE.MeshBasicMaterial({ color: 0x4cd476 }),
    ledRed: new THREE.MeshBasicMaterial({ color: 0xeb4d3d }),
    ledAmber: new THREE.MeshBasicMaterial({ color: 0xe8a43a }),
    ledBlue: new THREE.MeshBasicMaterial({ color: 0x57a6eb }),
    vmsScreen: new THREE.MeshBasicMaterial({ map: tex.vmsScreen })
  };
}

function rbox(w, h, d, mat, radius = 0.025) {
  const r = Math.min(radius, w * 0.42, h * 0.42, d * 0.42);
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/* ---------- Detailed 3D Security Hardware Builders ---------- */
function buildHardwareMesh(hwType, m) {
  const g = new THREE.Group();

  switch (hwType) {
    case 'dome_cctv':
    case 'corridor_cctv': {
      const scale = hwType === 'corridor_cctv' ? 0.82 : 1.0;
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * scale, 0.17 * scale, 0.08 * scale, 24), m.whiteHousing);
      base.castShadow = true;
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.135 * scale, 24, 16, 0, Math.PI * 2, Math.PI * 0.48, Math.PI * 0.52), m.smokedDome);
      dome.position.y = -0.02 * scale;
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.04 * scale, 0.04 * scale, 0.06 * scale, 16), m.matteBlack);
      lens.rotation.x = 0.55;
      lens.position.set(0, -0.05 * scale, 0.03 * scale);
      g.add(base, dome, lens);
      break;
    }

    case 'rfid_maglock': {
      // Wall RFID Reader + Green LED
      const reader = rbox(0.11, 0.16, 0.03, m.matteBlack, 0.01);
      const led = rbox(0.06, 0.01, 0.008, m.ledGreen, 0.002);
      led.position.set(0, 0.055, 0.016);
      g.add(reader, led);
      // Companion overhead Maglock positioned relative to door top
      const maglock = rbox(0.36, 0.065, 0.055, m.brushedSteel, 0.008);
      maglock.position.set(-0.83, 1.04, -0.04);
      g.add(maglock);
      break;
    }

    case 'panic_button': {
      const box = rbox(0.14, 0.08, 0.05, m.brushedSteel, 0.008);
      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 18), m.fireRed);
      btn.rotation.x = Math.PI / 2;
      btn.position.set(-0.02, 0, 0.024);
      const key = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.02, 14), m.darkAluminum);
      key.rotation.x = Math.PI / 2;
      key.position.set(0.032, 0, 0.024);
      g.add(box, btn, key);
      break;
    }

    case 'pull_smoke': {
      // Red Manual Pull Station on left exit wall (facing +X)
      const station = rbox(0.05, 0.18, 0.14, m.fireRed, 0.01);
      const handle = rbox(0.018, 0.035, 0.085, m.whiteHousing, 0.004);
      handle.position.set(0.026, -0.01, 0);
      g.add(station, handle);
      break;
    }

    case 'elevator_reader': {
      const plate = rbox(0.13, 0.24, 0.025, m.brushedSteel, 0.008);
      const pad = rbox(0.09, 0.11, 0.015, m.matteBlack, 0.006);
      pad.position.set(0, 0.04, 0.012);
      const led = rbox(0.05, 0.008, 0.006, m.ledGreen, 0.002);
      led.position.set(0, 0.08, 0.02);
      g.add(plate, pad, led);
      break;
    }

    case 'hood_suppression': {
      // Nozzles inside kitchen hood
      for (let i = -1; i <= 1; i++) {
        const drop = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 12), m.brushedSteel);
        drop.position.set(i * 0.55, -0.06, -0.25);
        const noz = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.065, 14), m.brass);
        noz.position.set(i * 0.55, -0.15, -0.25);
        g.add(drop, noz);
      }
      break;
    }

    case 'heat_detector': {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.14, 0.05, 22), m.whiteHousing);
      base.rotation.x = Math.PI / 2;
      const fin = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.012, 10, 20), m.whiteHousing);
      fin.position.z = 0.035;
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 10), m.ledRed);
      led.position.set(0.075, 0, 0.03);
      g.add(base, fin, led);
      break;
    }

    case 'gas_valve': {
      // Low-mounted LPG detector box (facing +X)
      const sensor = rbox(0.07, 0.18, 0.13, m.whiteHousing, 0.012);
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.01, 10, 10), m.ledGreen);
      led.position.set(0.038, 0.04, 0.03);
      // Brass Solenoid Valve on nearby yellow pipe
      const brassBody = rbox(0.09, 0.09, 0.14, m.brass, 0.015);
      brassBody.position.set(-0.04, -0.04, 0.28);
      const coil = rbox(0.075, 0.09, 0.075, m.matteBlack, 0.01);
      coil.position.set(-0.04, 0.045, 0.28);
      g.add(sensor, led, brassBody, coil);
      break;
    }

    case 'kitchen_cctv': {
      const mount = rbox(0.04, 0.12, 0.12, m.whiteHousing, 0.01);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.22, 20), m.whiteHousing);
      body.rotation.z = -Math.PI / 2.4;
      body.rotation.y = -0.45;
      body.position.set(0.11, -0.02, -0.05);
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.02, 18), m.matteBlack);
      lens.rotation.copy(body.rotation);
      lens.position.set(0.19, -0.06, -0.09);
      g.add(mount, body, lens);
      break;
    }

    case 'rfid_lock': {
      // Escutcheon on interior + exterior of guest room door (partition along Z)
      const plateIn = rbox(0.03, 0.24, 0.08, m.brushedSteel, 0.008);
      const leverIn = rbox(0.06, 0.022, 0.13, m.brushedSteel, 0.006);
      leverIn.position.set(0.03, -0.03, -0.03);
      const readerPad = rbox(0.034, 0.09, 0.065, m.matteBlack, 0.006);
      readerPad.position.set(-0.24, 0.05, 0);
      g.add(plateIn, leverIn, readerPad);
      break;
    }

    case 'keycard_switch': {
      const wallPlate = rbox(0.025, 0.13, 0.11, m.whiteHousing, 0.008);
      const card = rbox(0.012, 0.10, 0.07, m.whiteHousing, 0.003);
      card.position.set(0.015, 0.04, 0);
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 8), m.ledAmber);
      led.position.set(0.016, -0.025, 0);
      g.add(wallPlate, card, led);
      break;
    }

    case 'smoke_strobe': {
      // Red Wall Fire Strobe + Adjacent White Optical Smoke Detector
      const strobe = rbox(0.045, 0.16, 0.13, m.fireRed, 0.01);
      const flash = rbox(0.02, 0.055, 0.07, m.clearGlass, 0.005);
      flash.position.set(0.022, -0.025, 0);
      const smoke = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.045, 22), m.whiteHousing);
      smoke.rotation.z = Math.PI / 2;
      smoke.position.set(0.01, 0.18, 0.35);
      g.add(strobe, flash, smoke);
      break;
    }

    case 'safe_sos': {
      const plate = rbox(0.11, 0.11, 0.025, m.whiteHousing, 0.008);
      const redBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.018, 16), m.fireRed);
      redBtn.rotation.x = Math.PI / 2;
      redBtn.position.z = 0.012;
      g.add(plate, redBtn);
      break;
    }

    case 'facp': {
      const cab = rbox(0.68, 0.86, 0.16, m.fireRed, 0.02);
      const bezel = rbox(0.42, 0.34, 0.02, m.matteBlack, 0.01);
      bezel.position.set(0, 0.12, 0.082);
      const lcd = rbox(0.28, 0.10, 0.01, m.ledGreen, 0.004);
      lcd.position.set(0, 0.19, 0.09);
      g.add(cab, bezel, lcd);
      break;
    }

    case 'nvr_vms': {
      // VMS dual-wide security wall monitor
      const screenFrame = rbox(1.55, 0.92, 0.06, m.matteBlack, 0.015);
      screenFrame.position.set(0.2, 0.55, -0.98);
      const display = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 0.82), m.vmsScreen);
      display.position.set(0.2, 0.55, -0.948);
      g.add(screenFrame, display);
      break;
    }

    case 'access_bms': {
      const cab = rbox(0.16, 0.72, 0.56, m.cabinetGrey, 0.018);
      const led1 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 10), m.ledGreen);
      led1.position.set(0.084, 0.18, 0.12);
      const led2 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 10), m.ledBlue);
      led2.position.set(0.084, 0.12, 0.12);
      g.add(cab, led1, led2);
      break;
    }

    case 'ups': {
      const tower = rbox(0.38, 0.78, 0.62, m.matteBlack, 0.025);
      tower.position.y = -0.13;
      const lcd = rbox(0.015, 0.11, 0.16, m.ledBlue, 0.004);
      lcd.position.set(0.192, 0.08, 0);
      g.add(tower, lcd);
      break;
    }
  }

  return g;
}

/* ---------- Helper: Build Standard Cutaway Room Shell ---------- */
function createCutawayShell(floorMat, m) {
  const group = new THREE.Group();

  // Floor Slab (Top walking surface = y: 0.0)
  const slab = rbox(8.4, 0.28, 6.8, floorMat, 0.02);
  slab.position.set(0, -0.14, 0);
  const baseTrim = rbox(8.52, 0.08, 6.92, m.plinth, 0.015);
  baseTrim.position.set(0, -0.26, 0);
  group.add(slab, baseTrim);

  // Back Cutaway Wall (inner face z = -3.16)
  const backWall = rbox(8.4, 3.15, 0.24, m.cutawayWall, 0.015);
  backWall.position.set(0, 1.575, -3.28);
  group.add(backWall);

  // Left Cutaway Wall (inner face x = -3.96)
  const leftWall = rbox(0.24, 3.15, 6.8, m.cutawayWall, 0.015);
  leftWall.position.set(-4.08, 1.575, 0);
  group.add(leftWall);

  return group;
}

/* ==========================================================================
   MAIN SCENE FACTORY EXPORT
   ========================================================================== */
export function createHotelSafeSceneManager(renderer, scene) {
  const tex = createStudioTextures();
  const m = createMaterials(tex);

  // Subtle realistic studio environment reflections
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.38;

  // Warm Architectural Studio Lighting
  const hemi = new THREE.HemisphereLight(0xfffdf9, 0xdad6cc, 0.96);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff6e8, 1.75);
  sun.position.set(11, 17, 13);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 2;
  sun.shadow.camera.far = 42;
  const sc = 8.5;
  sun.shadow.camera.left = -sc;
  sun.shadow.camera.right = sc;
  sun.shadow.camera.top = sc;
  sun.shadow.camera.bottom = -sc;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0xeef3f8, 0.42);
  fill.position.set(-10, 9, -8);
  scene.add(fill);

  // Ground shadow catcher
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(34, 34),
    new THREE.ShadowMaterial({ opacity: 0.13 })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -0.31;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  const activeRoot = new THREE.Group();
  scene.add(activeRoot);

  const fovGroup = new THREE.Group();
  fovGroup.visible = false;
  scene.add(fovGroup);

  const hardwareMap = new Map();

  /* ---------- SCENE 0: 3D BOUTIQUE HOTEL BUILDING (OVERVIEW) ---------- */
  function buildOverviewHotel() {
    const root = new THREE.Group();

    // Sculpted Architectural Plinth
    const plinth = rbox(9.2, 0.24, 7.6, m.plinth, 0.08);
    plinth.position.set(-0.2, -0.12, 0.2);
    root.add(plinth);

    // Main 4-Story Cream Stucco Hotel Block
    const mainBody = rbox(5.2, 3.65, 4.3, m.stuccoCream, 0.04);
    mainBody.position.set(0.35, 1.825, 0.0);
    root.add(mainBody);

    // Warm Ochre 4th-Story Upper Facade + Cornices
    const upperStory = rbox(5.32, 1.15, 4.42, m.ochreTop, 0.04);
    upperStory.position.set(0.35, 4.12, 0.0);
    const midCornice = rbox(5.42, 0.12, 4.52, m.trimSand, 0.02);
    midCornice.position.set(0.35, 3.55, 0.0);
    const roofParapet = rbox(5.46, 0.22, 4.56, m.trimSand, 0.03);
    roofParapet.position.set(0.35, 4.74, 0.0);
    root.add(upperStory, midCornice, roofParapet);

    // Architectural Recessed Windows (Front, Right & Left Facades)
    const frontCols = [-1.45, -0.25, 0.95, 2.15];
    const floorsY = [1.85, 2.85, 4.08];
    floorsY.forEach((fy, fIdx) => {
      frontCols.forEach((wx) => {
        const sill = rbox(0.68, 0.07, 0.12, m.trimSand, 0.01);
        sill.position.set(wx, fy - 0.36, 2.16);
        const pane = rbox(0.58, 0.66, 0.06, fIdx === 1 ? m.warmInteriorGlow : m.windowGlass, 0.02);
        pane.position.set(wx, fy, 2.14);
        root.add(sill, pane);
      });

      // Right side windows
      [-1.15, 0.0, 1.15].forEach((wz) => {
        const paneR = rbox(0.06, 0.66, 0.56, fIdx === 2 ? m.warmInteriorGlow : m.windowGlass, 0.02);
        paneR.position.set(2.96, fy, wz);
        root.add(paneR);
      });
    });

    // Front Ground-Floor Glass Lobby & Terracotta "HOTEL" Entrance Canopy
    const lobbyGlass = rbox(2.85, 1.28, 0.1, m.clearGlass, 0.01);
    lobbyGlass.position.set(0.35, 0.64, 2.15);
    const lobbyWarm = rbox(2.65, 1.18, 0.4, m.warmInteriorGlow, 0.01);
    lobbyWarm.position.set(0.35, 0.6, 1.85);
    root.add(lobbyGlass, lobbyWarm);

    const canopy = rbox(3.25, 0.34, 1.38, m.terracotta, 0.04);
    canopy.position.set(0.35, 1.32, 2.62);
    root.add(canopy);

    // Canopy Support Columns & Potted Entrance Trees
    [-1.08, 1.78].forEach((cx) => {
      const col = rbox(0.14, 1.2, 0.14, m.stuccoCream, 0.02);
      col.position.set(cx, 0.6, 3.16);
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.24, 18), m.whiteHousing);
      pot.position.set(cx + (cx < 0 ? -0.28 : 0.28), 0.12, 3.22);
      pot.castShadow = true;
      const tree = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.68, 18), m.foliage);
      tree.position.set(pot.position.x, 0.54, 3.22);
      tree.castShadow = true;
      root.add(col, pot, tree);
    });

    // Crisp Upright "HOTEL" Sign Plaque on Front Canopy Edge
    const signBacking = rbox(1.48, 0.34, 0.06, m.terracotta, 0.02);
    signBacking.position.set(0.35, 1.62, 3.24);
    const signMat = new THREE.MeshBasicMaterial({ map: tex.hotelSign, transparent: true });
    const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 0.34), signMat);
    signMesh.position.set(0.35, 1.62, 3.275);
    root.add(signBacking, signMesh);

    // Side Commercial Kitchen & Service Wing (Zone 02)
    const kitchenWing = rbox(2.15, 1.72, 3.35, m.stuccoCream, 0.04);
    kitchenWing.position.set(-3.15, 0.86, -0.25);
    const kitchenParapet = rbox(2.26, 0.16, 3.46, m.ochreTop, 0.03);
    kitchenParapet.position.set(-3.15, 1.78, -0.25);
    const serviceDoor = rbox(1.15, 1.15, 0.08, m.cabinetGrey, 0.01);
    serviceDoor.position.set(-3.2, 0.58, 1.42);
    const hoodFlue = rbox(0.34, 0.55, 0.95, m.brushedSteel, 0.03);
    hoodFlue.position.set(-3.05, 2.08, -0.65);
    root.add(kitchenWing, kitchenParapet, serviceDoor, hoodFlue);

    // Rooftop Architectural Pergola & Security Control Penthouse (Zone 04)
    const socPenthouse = rbox(1.85, 0.72, 1.65, m.wardrobeMatte, 0.03);
    socPenthouse.position.set(1.35, 5.15, -0.55);
    root.add(socPenthouse);

    const pergolaPosts = [
      [-1.85, -1.7], [2.55, -1.7], [-1.85, 1.6], [2.55, 1.6]
    ];
    pergolaPosts.forEach(([px, pz]) => {
      const post = rbox(0.1, 0.95, 0.1, m.whiteHousing, 0.01);
      post.position.set(px, 5.28, pz);
      root.add(post);
    });
    for (let z = -1.65; z <= 1.65; z += 0.33) {
      const slat = rbox(4.55, 0.06, 0.08, m.whiteHousing, 0.01);
      slat.position.set(0.35, 5.76, z);
      root.add(slat);
    }

    return root;
  }

  /* ---------- SCENE 1: LOBBY & CHECK-IN CUTAWAY ---------- */
  function buildLobbyRoom(zoneData) {
    const root = new THREE.Group();

    // Floor Slab + Base Trim
    const slab = rbox(8.4, 0.28, 6.8, m.travertineFloor, 0.02);
    slab.position.set(0, -0.14, 0);
    const baseTrim = rbox(8.52, 0.08, 6.92, m.plinth, 0.015);
    baseTrim.position.set(0, -0.26, 0);
    const backWall = rbox(8.4, 3.15, 0.24, m.cutawayWall, 0.015);
    backWall.position.set(0, 1.575, -3.28);
    root.add(slab, baseTrim, backWall);

    // Left Cutaway Wall WITH Open Glass Sliding Entrance (z = -0.95 to +1.85)
    const leftWallBack = rbox(0.24, 3.15, 2.45, m.cutawayWall, 0.015);
    leftWallBack.position.set(-4.08, 1.575, -2.175);
    const leftWallFront = rbox(0.24, 3.15, 1.55, m.cutawayWall, 0.015);
    leftWallFront.position.set(-4.08, 1.575, 2.625);
    const leftWallHeader = rbox(0.24, 0.68, 2.8, m.cutawayWall, 0.015);
    leftWallHeader.position.set(-4.08, 2.81, 0.45);
    root.add(leftWallBack, leftWallFront, leftWallHeader);

    // Aluminum Mullions & Transparent Sliding Glass Doors
    const topTransom = rbox(0.12, 0.07, 2.82, m.darkAluminum, 0.01);
    topTransom.position.set(-4.04, 2.44, 0.45);
    [-0.92, -0.22, 0.45, 1.12, 1.82].forEach((mz) => {
      const mullion = rbox(0.08, 2.44, 0.05, m.darkAluminum, 0.008);
      mullion.position.set(-4.04, 1.22, mz);
      root.add(mullion);
    });
    const glassPane = rbox(0.04, 2.38, 2.74, m.clearGlass, 0.005);
    glassPane.position.set(-4.04, 1.20, 0.45);
    root.add(topTransom, glassPane);

    // Staff Back-of-House Door on Back Wall
    const bohDoor = rbox(0.98, 2.22, 0.08, m.wardrobeMatte, 0.01);
    bohDoor.position.set(-2.05, 1.11, -3.13);
    const bohHandle = rbox(0.11, 0.025, 0.05, m.brushedSteel, 0.005);
    bohHandle.position.set(-1.68, 1.05, -3.08);
    root.add(bohDoor, bohHandle);

    // Twin Brushed-Steel Passenger Elevators on Back Wall
    [0.55, 2.42].forEach((ex) => {
      const surround = rbox(1.18, 2.38, 0.09, m.darkAluminum, 0.01);
      surround.position.set(ex, 1.19, -3.13);
      const doorL = rbox(0.51, 2.26, 0.06, m.brushedSteel, 0.006);
      doorL.position.set(ex - 0.26, 1.13, -3.09);
      const doorR = rbox(0.51, 2.26, 0.06, m.brushedSteel, 0.006);
      doorR.position.set(ex + 0.26, 1.13, -3.09);
      root.add(surround, doorL, doorR);
    });

    // Walnut Check-in Counter (with open staff cavity underneath for Pin 3!)
    const deskFront = rbox(2.55, 1.06, 0.62, m.walnutWood, 0.02);
    deskFront.position.set(-1.75, 0.53, -0.62);
    const deskSide = rbox(0.62, 1.06, 1.18, m.walnutWood, 0.02);
    deskSide.position.set(-0.68, 0.53, -1.12);
    const counterTop = rbox(2.62, 0.06, 0.72, m.plinth, 0.012);
    counterTop.position.set(-1.75, 1.08, -0.64);
    const posMonitor = rbox(0.46, 0.30, 0.04, m.matteBlack, 0.008);
    posMonitor.position.set(-1.85, 1.28, -0.72);
    posMonitor.rotation.y = 0.2;
    root.add(deskFront, deskSide, counterTop, posMonitor);

    // Minimalist Waiting Lounge Sofa & Coffee Table
    const sofaSeat1 = rbox(2.35, 0.42, 0.85, m.fabricSofa, 0.06);
    sofaSeat1.position.set(1.35, 0.24, 1.75);
    const sofaBack1 = rbox(2.35, 0.46, 0.22, m.fabricSofa, 0.05);
    sofaBack1.position.set(1.35, 0.56, 2.08);
    const sofaChaise = rbox(0.85, 0.42, 1.55, m.fabricSofa, 0.06);
    sofaChaise.position.set(0.58, 0.24, 1.38);
    const coffeeTbl = rbox(1.05, 0.28, 0.68, m.walnutWood, 0.03);
    coffeeTbl.position.set(1.55, 0.16, 0.72);
    root.add(sofaSeat1, sofaBack1, sofaChaise, coffeeTbl);

    attachZoneHardware(root, zoneData);
    return root;
  }

  /* ---------- SCENE 2: COMMERCIAL KITCHEN CUTAWAY ---------- */
  function buildKitchenRoom(zoneData) {
    const root = createCutawayShell(m.kitchenFloor, m);

    // Commercial 6-Burner Gas Range + Deep Fryer + Side Counter
    const stove = rbox(1.45, 0.88, 0.92, m.brushedSteel, 0.02);
    stove.position.set(-2.15, 0.44, -2.55);
    for (let bx = -2.6; bx <= -1.7; bx += 0.45) {
      for (let bz = -2.75; bz <= -2.35; bz += 0.38) {
        const grate = rbox(0.34, 0.04, 0.32, m.matteBlack, 0.006);
        grate.position.set(bx, 0.90, bz);
        root.add(grate);
      }
    }
    const fryer = rbox(0.82, 0.88, 0.92, m.brushedSteel, 0.02);
    fryer.position.set(-0.95, 0.44, -2.55);
    const sidePrep = rbox(1.25, 0.88, 0.88, m.brushedSteel, 0.02);
    sidePrep.position.set(0.15, 0.44, -2.57);
    root.add(stove, fryer, sidePrep);

    // Overhead Stainless Exhaust Hood Canopy + Ductwork
    const hood = rbox(2.95, 0.56, 1.18, m.brushedSteel, 0.025);
    hood.position.set(-1.52, 2.18, -2.48);
    const duct = rbox(2.65, 0.38, 0.48, m.brushedSteel, 0.02);
    duct.position.set(-1.52, 2.68, -2.82);
    root.add(hood, duct);

    // Ansul Wet Chemical Tank on Back Wall + Red Manual Release near Service Door
    const ansulTank = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.56, 20), m.fireRed);
    ansulTank.position.set(0.88, 1.72, -3.02);
    ansulTank.castShadow = true;
    const manualRelease = rbox(0.14, 0.16, 0.05, m.fireRed, 0.008);
    manualRelease.position.set(2.18, 1.22, -3.12);
    const exitDoor = rbox(1.02, 2.24, 0.08, m.whiteHousing, 0.01);
    exitDoor.position.set(2.98, 1.12, -3.12);
    root.add(ansulTank, manualRelease, exitDoor);

    // Yellow Commercial Gas Supply Pipe along Left Wall to Cooking Line
    const pipeVert = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 1.85, 14), m.gasYellow);
    pipeVert.position.set(-3.88, 1.32, 1.65);
    const pipeHoriz = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 4.25, 14), m.gasYellow);
    pipeHoriz.rotation.x = Math.PI / 2;
    pipeHoriz.position.set(-3.88, 0.42, -0.45);
    root.add(pipeVert, pipeHoriz);

    // Central Stainless Steel Prep Island Table
    const prepTop = rbox(2.25, 0.06, 1.05, m.brushedSteel, 0.012);
    prepTop.position.set(0.15, 0.88, 0.35);
    const prepShelf = rbox(2.12, 0.04, 0.92, m.brushedSteel, 0.008);
    prepShelf.position.set(0.15, 0.24, 0.35);
    [[-0.88, -0.1], [1.18, -0.1], [-0.88, 0.8], [1.18, 0.8]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.88, 12), m.brushedSteel);
      leg.position.set(lx, 0.44, lz);
      root.add(leg);
    });
    root.add(prepTop, prepShelf);

    attachZoneHardware(root, zoneData);
    return root;
  }

  /* ---------- SCENE 3: GUEST ROOM & CORRIDOR CUTAWAY ---------- */
  function buildGuestRoom(zoneData) {
    const root = createCutawayShell(m.oakFloor, m);

    // Distinct Hallway Corridor Carpet Strip on Left (x = -3.96 to -1.85)
    const carpet = rbox(2.08, 0.02, 6.52, m.corridorCarpet, 0.005);
    carpet.position.set(-2.92, 0.01, 0.08);
    root.add(carpet);

    // Partition Wall Separating Public Corridor from Private Guest Room
    const partBack = rbox(0.22, 3.05, 3.65, m.cutawayWall, 0.012);
    partBack.position.set(-1.82, 1.525, -1.32);
    const partFront = rbox(0.22, 3.05, 1.45, m.cutawayWall, 0.012);
    partFront.position.set(-1.82, 1.525, 2.55);
    const partHeader = rbox(0.22, 0.78, 1.35, m.cutawayWall, 0.012);
    partHeader.position.set(-1.82, 2.66, 1.18);
    const roomDoor = rbox(0.09, 2.26, 1.28, m.oakSolid, 0.01);
    roomDoor.position.set(-1.82, 1.13, 1.18);
    root.add(partBack, partFront, partHeader, roomDoor);

    // Open Architectural Wardrobe Cabinet + Matte-Black Electronic In-Room Safe
    const wLeft = rbox(0.06, 2.38, 0.66, m.wardrobeMatte, 0.01);
    wLeft.position.set(-1.15, 1.19, -2.76);
    const wRight = rbox(0.06, 2.38, 0.66, m.wardrobeMatte, 0.01);
    wRight.position.set(0.12, 1.19, -2.76);
    const wMid = rbox(0.05, 2.32, 0.64, m.wardrobeMatte, 0.01);
    wMid.position.set(-0.52, 1.18, -2.76);
    const wTop = rbox(1.33, 0.06, 0.68, m.wardrobeMatte, 0.01);
    wTop.position.set(-0.515, 2.36, -2.76);
    const wBottom = rbox(1.33, 0.12, 0.68, m.wardrobeMatte, 0.01);
    wBottom.position.set(-0.515, 0.06, -2.76);
    const wShelf = rbox(0.62, 0.04, 0.64, m.wardrobeMatte, 0.008);
    wShelf.position.set(-0.84, 0.62, -2.76);
    const safeBox = rbox(0.46, 0.32, 0.42, m.matteBlack, 0.015);
    safeBox.position.set(-0.84, 0.80, -2.70);
    root.add(wLeft, wRight, wMid, wTop, wBottom, wShelf, safeBox);

    // Double Bed + Headboard + Pillows + Nightstands
    const bedFrame = rbox(2.18, 0.28, 2.35, m.oakSolid, 0.03);
    bedFrame.position.set(1.88, 0.18, -1.42);
    const mattress = rbox(2.04, 0.28, 2.22, m.beddingCream, 0.06);
    mattress.position.set(1.88, 0.42, -1.42);
    const blanket = rbox(2.08, 0.30, 1.35, m.bedThrow, 0.06);
    blanket.position.set(1.88, 0.43, -0.95);
    const headboard = rbox(2.36, 1.18, 0.12, m.oakSolid, 0.025);
    headboard.position.set(1.88, 0.68, -2.62);
    [-0.46, 0.46].forEach((px) => {
      const pillow = rbox(0.76, 0.18, 0.44, m.whiteHousing, 0.06);
      pillow.position.set(1.88 + px, 0.62, -2.18);
      pillow.rotation.x = 0.22;
      root.add(pillow);
    });
    [0.45, 3.28].forEach((nx) => {
      const stand = rbox(0.52, 0.52, 0.46, m.wardrobeMatte, 0.02);
      stand.position.set(nx, 0.26, -2.48);
      root.add(stand);
    });
    root.add(bedFrame, mattress, blanket, headboard);

    attachZoneHardware(root, zoneData);
    return root;
  }

  /* ---------- SCENE 4: SECURITY CONTROL ROOM (SOC) CUTAWAY ---------- */
  function buildControlRoom(zoneData) {
    const root = createCutawayShell(m.socFloor, m);

    // 19-Inch Server & RAID NVR Rack
    const rack = rbox(0.78, 2.15, 0.85, m.matteBlack, 0.02);
    rack.position.set(-0.62, 1.075, -2.55);
    for (let ry = 0.45; ry <= 1.85; ry += 0.28) {
      const blade = rbox(0.68, 0.14, 0.04, m.darkAluminum, 0.006);
      blade.position.set(-0.62, ry, -2.12);
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), m.ledGreen);
      led.position.set(-0.36, ry, -2.09);
      root.add(blade, led);
    }
    root.add(rack);

    // VMS Operator Console Desk + Dual Desk Screens + Chair
    const deskTop = rbox(2.45, 0.07, 0.95, m.wardrobeMatte, 0.015);
    deskTop.position.set(1.48, 0.76, -1.35);
    const deskLegL = rbox(0.08, 0.74, 0.86, m.darkAluminum, 0.01);
    deskLegL.position.set(0.35, 0.37, -1.35);
    const deskLegR = rbox(0.08, 0.74, 0.86, m.darkAluminum, 0.01);
    deskLegR.position.set(2.60, 0.37, -1.35);
    [0.98, 1.98].forEach((mx) => {
      const mon = rbox(0.78, 0.46, 0.04, m.matteBlack, 0.01);
      mon.position.set(mx, 1.08, -1.52);
      root.add(mon);
    });
    const chairSeat = rbox(0.56, 0.1, 0.54, m.matteBlack, 0.03);
    chairSeat.position.set(1.48, 0.48, -0.45);
    const chairBack = rbox(0.52, 0.58, 0.09, m.matteBlack, 0.03);
    chairBack.position.set(1.48, 0.82, -0.2);
    root.add(deskTop, deskLegL, deskLegR, chairSeat, chairBack);

    // Fail-Secure Steel SOC Security Door
    const socDoor = rbox(1.02, 2.26, 0.09, m.cabinetGrey, 0.01);
    socDoor.position.set(3.25, 1.13, -3.12);
    root.add(socDoor);

    attachZoneHardware(root, zoneData);
    return root;
  }

  /* ---------- Attach 3D Hardware & Optional FOV Cones ---------- */
  function attachZoneHardware(root, zoneData) {
    zoneData.devices.forEach((dev) => {
      const mesh = buildHardwareMesh(dev.hwType, m);
      mesh.position.set(...dev.pos3d);
      mesh.userData.deviceId = dev.id;
      root.add(mesh);
      hardwareMap.set(dev.id, mesh);

      if (dev.fov) {
        const start = new THREE.Vector3(...dev.fov.origin);
        const end = new THREE.Vector3(...dev.fov.target);
        const dir = new THREE.Vector3().subVectors(end, start);
        const len = dir.length();
        const coneGeo = new THREE.ConeGeometry(dev.fov.radius, len, 28, 1, true);
        coneGeo.translate(0, -len / 2, 0);
        coneGeo.rotateX(-Math.PI / 2);
        const coneMat = new THREE.MeshBasicMaterial({
          color: dev.fov.color,
          transparent: true,
          opacity: 0.14,
          side: THREE.DoubleSide,
          depthWrite: false
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.copy(start);
        cone.lookAt(end);
        fovGroup.add(cone);
      }
    });
  }

  /* ---------- Public Scene Switching API ---------- */
  function clearStage() {
    while (activeRoot.children.length > 0) {
      activeRoot.remove(activeRoot.children[0]);
    }
    while (fovGroup.children.length > 0) {
      fovGroup.remove(fovGroup.children[0]);
    }
    hardwareMap.clear();
  }

  function loadOverview() {
    clearStage();
    fovGroup.visible = false;
    activeRoot.add(buildOverviewHotel());
  }

  function loadZone(zoneData) {
    clearStage();
    let built;
    if (zoneData.id === 'lobby') built = buildLobbyRoom(zoneData);
    else if (zoneData.id === 'kitchen') built = buildKitchenRoom(zoneData);
    else if (zoneData.id === 'guestroom') built = buildGuestRoom(zoneData);
    else built = buildControlRoom(zoneData);
    activeRoot.add(built);
  }

  function setFovVisible(visible) {
    fovGroup.visible = visible;
  }

  function hasFovInCurrentZone() {
    return fovGroup.children.length > 0;
  }

  return {
    loadOverview,
    loadZone,
    setFovVisible,
    hasFovInCurrentZone,
    hardwareMap
  };
}
