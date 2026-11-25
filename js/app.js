/* ==========================================================================
   HotelSafe. — Main Application Controller
   Bilingual (TH / EN) • Smooth Camera Transitions • 3D-to-2D Projected Pins
   ========================================================================== */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createHotelSafeSceneManager } from './scenes.js';

const DATA = window.HOTELSAFE_DATA;

const state = {
  lang: 'th',
  view: 'overview', // 'overview' | 'zone'
  activeZoneId: 'lobby',
  activeDeviceId: 'lobby-1',
  hoveredZoneId: null,
  fovEnabled: false,
  catalogFilter: 'all'
};

/* ---------- DOM Elements ---------- */
const els = {
  loadingOverlay: document.getElementById('loadingOverlay'),
  brandBtn: document.getElementById('brandBtn'),
  backOverviewBtn: document.getElementById('backOverviewBtn'),
  overviewNav: document.getElementById('overviewNav'),
  navOverviewBtn: document.getElementById('navOverviewBtn'),
  navZonesBtn: document.getElementById('navZonesBtn'),
  navStandardsBtn: document.getElementById('navStandardsBtn'),
  zonePillsNav: document.getElementById('zonePillsNav'),
  langThBtn: document.getElementById('langThBtn'),
  langEnBtn: document.getElementById('langEnBtn'),
  openCatalogTopBtn: document.getElementById('openCatalogTopBtn'),
  exploreTopBtn: document.getElementById('exploreTopBtn'),
  enterLobbyBtn: document.getElementById('enterLobbyBtn'),
  openCatalogHeroBtn: document.getElementById('openCatalogHeroBtn'),
  heroZoneGrid: document.getElementById('heroZoneGrid'),
  canvasHost: document.getElementById('canvasHost'),
  pinsContainer: document.getElementById('pinsContainer'),
  stageHint: document.getElementById('stageHint'),
  toggleFovBtn: document.getElementById('toggleFovBtn'),
  resetCamBtn: document.getElementById('resetCamBtn'),
  inspectorCard: document.getElementById('inspectorCard'),
  inspBreadcrumb: document.getElementById('inspBreadcrumb'),
  inspCategoryTag: document.getElementById('inspCategoryTag'),
  inspDeviceName: document.getElementById('inspDeviceName'),
  inspModelSample: document.getElementById('inspModelSample'),
  openLightboxTrigger: document.getElementById('openLightboxTrigger'),
  inspHardwareImg: document.getElementById('inspHardwareImg'),
  inspStandardCode: document.getElementById('inspStandardCode'),
  inspPlacementText: document.getElementById('inspPlacementText'),
  inspFunctionText: document.getElementById('inspFunctionText'),
  inspInterlockText: document.getElementById('inspInterlockText'),
  inspDeviceChips: document.getElementById('inspDeviceChips'),
  inspZoneGallery: document.getElementById('inspZoneGallery'),
  catalogModal: document.getElementById('catalogModal'),
  closeCatalogBtn: document.getElementById('closeCatalogBtn'),
  catalogFilterBar: document.getElementById('catalogFilterBar'),
  catalogCardsGrid: document.getElementById('catalogCardsGrid'),
  standardsSummarySection: document.getElementById('standardsSummarySection'),
  standardsCardsRow: document.getElementById('standardsCardsRow'),
  lightboxModal: document.getElementById('lightboxModal'),
  closeLightboxBtn: document.getElementById('closeLightboxBtn'),
  lightboxImg: document.getElementById('lightboxImg'),
  lightboxTitle: document.getElementById('lightboxTitle'),
  lightboxSub: document.getElementById('lightboxSub')
};

/* ---------- Three.js Renderer, Camera & Smooth Orbit Setup ---------- */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(27, 1, 0.2, 95);
const OVERVIEW_CAM = { pos: new THREE.Vector3(14.2, 10.6, 15.6), target: new THREE.Vector3(-0.25, 2.35, 0.15) };

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.04;
els.canvasHost.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.maxPolarAngle = Math.PI * 0.475;
controls.minPolarAngle = Math.PI * 0.12;
controls.minDistance = 4.2;
controls.maxDistance = 24;

const sceneManager = createHotelSafeSceneManager(renderer, scene);

/* Smooth Camera Tween State */
const camTween = {
  active: false,
  fromPos: new THREE.Vector3(),
  toPos: new THREE.Vector3(),
  fromTarget: new THREE.Vector3(),
  toTarget: new THREE.Vector3(),
  progress: 0,
  duration: 0.68
};

function animateCameraTo(posArr, targetArr, duration = 0.68) {
  camTween.fromPos.copy(camera.position);
  camTween.toPos.set(posArr[0], posArr[1], posArr[2]);
  camTween.fromTarget.copy(controls.target);
  camTween.toTarget.set(targetArr[0], targetArr[1], targetArr[2]);
  camTween.progress = 0;
  camTween.duration = duration;
  camTween.active = true;
}

controls.addEventListener('start', () => {
  camTween.active = false;
});

/* ---------- Helpers ---------- */
function t(key) {
  return DATA.i18n[state.lang][key] || key;
}

function getZone(zoneId) {
  return DATA.zones.find((z) => z.id === zoneId) || DATA.zones[0];
}

function getDevice(zone, devId) {
  return zone.devices.find((d) => d.id === devId) || zone.devices[0];
}

function resizeViewport() {
  const rect = els.canvasHost.getBoundingClientRect();
  if (rect.width < 10 || rect.height < 10) return;
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
  renderer.setSize(rect.width, rect.height, false);
}

/* ---------- Projected 2D Callouts & Numbered Pins ---------- */
let activePinNodes = [];

function rebuildStagePins() {
  els.pinsContainer.innerHTML = '';
  activePinNodes = [];

  if (state.view === 'overview') {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'overview-callout-svg');
    els.pinsContainer.appendChild(svg);

    DATA.zones.forEach((zone) => {
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('class', 'callout-line');
      const dot = document.createElementNS(svgNS, 'circle');
      dot.setAttribute('class', 'callout-anchor-dot');
      dot.setAttribute('r', '4');
      svg.appendChild(line);
      svg.appendChild(dot);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hotel-zone-pin';
      btn.dataset.zonePin = zone.id;
      const labelText = state.lang === 'th' ? zone.cardTh : zone.cardEn;
      btn.innerHTML = `<span>${zone.num}</span><span class="pin-zone-label">${labelText}</span>`;

      btn.addEventListener('mouseenter', () => setHoveredZone(zone.id));
      btn.addEventListener('mouseleave', () => setHoveredZone(null));
      btn.addEventListener('click', () => enterZone(zone.id));

      els.pinsContainer.appendChild(btn);

      activePinNodes.push({
        type: 'overview',
        zoneId: zone.id,
        anchor: new THREE.Vector3(...zone.hotelAnchor),
        badge: new THREE.Vector3(...zone.hotelBadgePos),
        btn,
        line,
        dot
      });
    });
  } else {
    const zone = getZone(state.activeZoneId);
    zone.devices.forEach((dev) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'device-pin' + (dev.id === state.activeDeviceId ? ' active' : '');
      btn.dataset.devPin = dev.id;
      const tip = state.lang === 'th' ? dev.nameTh : dev.nameEn;
      btn.innerHTML = `${dev.pin}<span class="device-pin-tooltip">${tip}</span>`;
      btn.addEventListener('click', () => selectDevice(dev.id, true));
      els.pinsContainer.appendChild(btn);

      activePinNodes.push({
        type: 'device',
        devId: dev.id,
        pos: new THREE.Vector3(...dev.pos3d),
        btn
      });
    });
  }
}

const projVecA = new THREE.Vector3();
const projVecB = new THREE.Vector3();

function updateProjectedPins() {
  const rect = els.canvasHost.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  if (w < 10 || h < 10) return;

  activePinNodes.forEach((item) => {
    if (item.type === 'overview') {
      projVecA.copy(item.anchor).project(camera);
      projVecB.copy(item.badge).project(camera);
      if (projVecA.z > 1 || projVecB.z > 1) {
        item.btn.style.display = 'none';
        item.line.style.display = 'none';
        item.dot.style.display = 'none';
        return;
      }
      const ax = (projVecA.x * 0.5 + 0.5) * w;
      const ay = (-projVecA.y * 0.5 + 0.5) * h;
      const bx = (projVecB.x * 0.5 + 0.5) * w;
      const by = (-projVecB.y * 0.5 + 0.5) * h;

      item.btn.style.display = 'inline-flex';
      item.btn.style.left = `${bx}px`;
      item.btn.style.top = `${by}px`;

      item.line.style.display = 'block';
      item.line.setAttribute('x1', ax.toFixed(1));
      item.line.setAttribute('y1', ay.toFixed(1));
      item.line.setAttribute('x2', bx.toFixed(1));
      item.line.setAttribute('y2', by.toFixed(1));

      item.dot.style.display = 'block';
      item.dot.setAttribute('cx', ax.toFixed(1));
      item.dot.setAttribute('cy', ay.toFixed(1));
    } else {
      projVecA.copy(item.pos).project(camera);
      if (projVecA.z > 1) {
        item.btn.style.display = 'none';
        return;
      }
      const px = (projVecA.x * 0.5 + 0.5) * w;
      const py = (-projVecA.y * 0.5 + 0.5) * h;
      item.btn.style.display = 'flex';
      item.btn.style.left = `${px}px`;
      item.btn.style.top = `${py}px`;
    }
  });
}

function setHoveredZone(zoneId) {
  state.hoveredZoneId = zoneId;
  document.querySelectorAll('[data-zone-card]').forEach((el) => {
    el.classList.toggle('is-hovered', el.dataset.zoneCard === zoneId);
  });
  document.querySelectorAll('[data-zone-pin]').forEach((el) => {
    el.classList.toggle('is-hovered', el.dataset.zonePin === zoneId);
  });
}

/* ---------- UI Rendering & Bilingual Updates ---------- */
function renderHeroZoneButtons() {
  els.heroZoneGrid.innerHTML = '';
  DATA.zones.forEach((zone) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hero-zone-card';
    btn.dataset.zoneCard = zone.id;
    const title = state.lang === 'th' ? zone.cardTh : zone.cardEn;
    btn.innerHTML = `
      <span class="zone-card-num">${zone.num}</span>
      <span class="zone-card-title">${title}</span>
    `;
    btn.addEventListener('mouseenter', () => setHoveredZone(zone.id));
    btn.addEventListener('mouseleave', () => setHoveredZone(null));
    btn.addEventListener('click', () => enterZone(zone.id));
    els.heroZoneGrid.appendChild(btn);
  });
}

function renderZonePillsBar() {
  els.zonePillsNav.innerHTML = '';
  DATA.zones.forEach((zone) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'zone-pill-btn' + (zone.id === state.activeZoneId ? ' active' : '');
    btn.textContent = state.lang === 'th' ? zone.tabTh : zone.tabEn;
    btn.addEventListener('click', () => enterZone(zone.id));
    els.zonePillsNav.appendChild(btn);
  });
}

function renderInspector() {
  if (state.view !== 'zone') return;
  const zone = getZone(state.activeZoneId);
  const dev = getDevice(zone, state.activeDeviceId);
  const idx = zone.devices.findIndex((d) => d.id === dev.id) + 1;
  const total = String(zone.devices.length).padStart(2, '0');
  const idxStr = String(idx).padStart(2, '0');

  const zoneTitle = state.lang === 'th' ? zone.nameTh : zone.nameEn;
  els.inspBreadcrumb.textContent = `${zoneTitle} • ${t('deviceWord')} ${idxStr} / ${total}`;

  const catObj = DATA.categories[dev.cat];
  els.inspCategoryTag.textContent = catObj ? catObj[state.lang] : dev.cat.toUpperCase();

  els.inspDeviceName.textContent = state.lang === 'th' ? dev.nameTh : dev.nameEn;
  els.inspModelSample.textContent = state.lang === 'th' ? dev.modelRefTh : dev.modelRefEn;
  els.inspHardwareImg.src = dev.image;
  els.inspHardwareImg.alt = state.lang === 'th' ? dev.nameTh : dev.nameEn;
  els.inspStandardCode.textContent = dev.codeRef;

  els.inspPlacementText.textContent = state.lang === 'th' ? dev.placementTh : dev.placementEn;
  els.inspFunctionText.textContent = state.lang === 'th' ? dev.functionTh : dev.functionEn;
  els.inspInterlockText.textContent = state.lang === 'th' ? dev.interlockTh : dev.interlockEn;

  // Numbered Chips
  els.inspDeviceChips.innerHTML = '';
  zone.devices.forEach((item) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'insp-chip-btn' + (item.id === dev.id ? ' active' : '');
    chip.textContent = state.lang === 'th' ? item.chipTh : item.chipEn;
    chip.addEventListener('click', () => selectDevice(item.id, true));
    els.inspDeviceChips.appendChild(chip);
  });

  // Real Hardware Gallery in This Zone
  els.inspZoneGallery.innerHTML = '';
  zone.devices.forEach((item) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'zone-hw-thumb' + (item.id === dev.id ? ' active' : '');
    const shortTitle = state.lang === 'th' ? item.chipTh : item.chipEn;
    card.innerHTML = `
      <img src="${item.image}" alt="${shortTitle}" loading="lazy" />
      <div class="zone-hw-thumb-cap">${shortTitle}</div>
    `;
    card.addEventListener('click', () => selectDevice(item.id, true));
    els.inspZoneGallery.appendChild(card);
  });

  // Sync active pin styling
  document.querySelectorAll('[data-dev-pin]').forEach((pinEl) => {
    pinEl.classList.toggle('active', pinEl.dataset.devPin === dev.id);
  });
}

function renderCatalogModal() {
  // Filter pills
  els.catalogFilterBar.innerHTML = '';
  const filters = [
    { id: 'all', label: t('filterAll') },
    ...DATA.zones.map((z) => ({ id: z.id, label: `${z.num} ${state.lang === 'th' ? z.cardTh : z.cardEn}` })),
    { id: 'bonus', label: t('filterBonus') }
  ];

  filters.forEach((f) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-pill' + (state.catalogFilter === f.id ? ' active' : '');
    btn.textContent = f.label;
    btn.addEventListener('click', () => {
      state.catalogFilter = f.id;
      renderCatalogModal();
    });
    els.catalogFilterBar.appendChild(btn);
  });

  // Hardware Cards
  els.catalogCardsGrid.innerHTML = '';
  const items = [];

  DATA.zones.forEach((zone) => {
    if (state.catalogFilter === 'all' || state.catalogFilter === zone.id) {
      zone.devices.forEach((dev) => {
        items.push({ type: 'zone', zone, dev });
      });
    }
  });

  if (state.catalogFilter === 'all' || state.catalogFilter === 'bonus') {
    DATA.bonusHardware.forEach((b) => {
      items.push({ type: 'bonus', dev: b });
    });
  }

  items.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'catalog-card';
    const d = entry.dev;
    const title = state.lang === 'th' ? d.nameTh : d.nameEn;
    const model = state.lang === 'th' ? d.modelRefTh : d.modelRefEn;

    if (entry.type === 'zone') {
      const zName = `${entry.zone.num} • ${state.lang === 'th' ? entry.zone.cardTh : entry.zone.cardEn}`;
      const desc = state.lang === 'th' ? d.functionTh : d.functionEn;
      card.innerHTML = `
        <div class="catalog-card-img-wrap">
          <img src="${d.image}" alt="${title}" loading="lazy" />
          <span class="catalog-zone-tag">${zName}</span>
        </div>
        <div class="catalog-card-body">
          <h3 class="catalog-card-title">${title}</h3>
          <div class="catalog-card-model">${model}</div>
          <p class="catalog-card-desc">${desc}</p>
          <button type="button" class="catalog-jump-btn">${t('jumpTo3D')}</button>
        </div>
      `;
      card.querySelector('.catalog-jump-btn').addEventListener('click', () => {
        closeCatalogModal();
        enterZone(entry.zone.id, d.id);
      });
      card.querySelector('.catalog-card-img-wrap').style.cursor = 'zoom-in';
      card.querySelector('.catalog-card-img-wrap').addEventListener('click', () => {
        openLightbox(d.image, title, model);
      });
    } else {
      const desc = state.lang === 'th' ? d.descTh : d.descEn;
      card.innerHTML = `
        <div class="catalog-card-img-wrap" style="cursor:zoom-in">
          <img src="${d.image}" alt="${title}" loading="lazy" />
          <span class="catalog-zone-tag">${t('generalBuildingTag')}</span>
        </div>
        <div class="catalog-card-body">
          <h3 class="catalog-card-title">${title}</h3>
          <div class="catalog-card-model">${model}</div>
          <p class="catalog-card-desc">${desc}</p>
        </div>
      `;
      card.querySelector('.catalog-card-img-wrap').addEventListener('click', () => {
        openLightbox(d.image, title, model);
      });
    }

    els.catalogCardsGrid.appendChild(card);
  });

  // Standards Cards
  els.standardsCardsRow.innerHTML = '';
  DATA.standards.forEach((st) => {
    const div = document.createElement('div');
    div.className = 'standard-item-card';
    div.innerHTML = `
      <h4>${state.lang === 'th' ? st.titleTh : st.titleEn}</h4>
      <p>${state.lang === 'th' ? st.bodyTh : st.bodyEn}</p>
    `;
    els.standardsCardsRow.appendChild(div);
  });
}

function applyLanguage(lang) {
  state.lang = lang;
  document.documentElement.lang = lang;
  document.body.dataset.lang = lang;

  els.langThBtn.classList.toggle('active', lang === 'th');
  els.langEnBtn.classList.toggle('active', lang === 'en');

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (DATA.i18n[lang][key]) {
      node.textContent = DATA.i18n[lang][key];
    }
  });

  els.stageHint.textContent = state.view === 'overview' ? t('stageHintOverview') : t('stageHintZone');

  renderHeroZoneButtons();
  renderZonePillsBar();
  rebuildStagePins();
  renderInspector();
  if (!els.catalogModal.classList.contains('hidden')) {
    renderCatalogModal();
  }
}

/* ---------- Navigation Transitions ---------- */
function enterOverview() {
  state.view = 'overview';
  document.body.dataset.view = 'overview';

  els.backOverviewBtn.classList.add('hidden');
  els.zonePillsNav.classList.add('hidden');
  els.overviewNav.classList.remove('hidden');
  els.inspectorCard.classList.add('hidden');
  els.toggleFovBtn.classList.add('hidden');
  els.exploreTopBtn.classList.remove('hidden');
  els.stageHint.textContent = t('stageHintOverview');

  sceneManager.loadOverview();
  resizeViewport();
  rebuildStagePins();
  animateCameraTo(OVERVIEW_CAM.pos.toArray(), OVERVIEW_CAM.target.toArray(), 0.72);
}

function enterZone(zoneId, specificDevId = null) {
  const zone = getZone(zoneId);
  state.view = 'zone';
  state.activeZoneId = zone.id;
  state.activeDeviceId = specificDevId || zone.devices[0].id;
  document.body.dataset.view = 'zone';

  els.backOverviewBtn.classList.remove('hidden');
  els.overviewNav.classList.add('hidden');
  els.zonePillsNav.classList.remove('hidden');
  els.inspectorCard.classList.remove('hidden');
  els.exploreTopBtn.classList.add('hidden');
  els.stageHint.textContent = t('stageHintZone');

  sceneManager.loadZone(zone);
  sceneManager.setFovVisible(state.fovEnabled);

  if (sceneManager.hasFovInCurrentZone()) {
    els.toggleFovBtn.classList.remove('hidden');
    els.toggleFovBtn.classList.toggle('active', state.fovEnabled);
  } else {
    els.toggleFovBtn.classList.add('hidden');
  }

  renderZonePillsBar();
  resizeViewport();
  rebuildStagePins();
  renderInspector();

  if (specificDevId) {
    const dev = getDevice(zone, specificDevId);
    animateCameraTo(dev.focusCam || zone.camPos, dev.focusTarget || zone.camTarget, 0.7);
  } else {
    animateCameraTo(zone.camPos, zone.camTarget, 0.7);
  }
}

function selectDevice(devId, focus3D = true) {
  const zone = getZone(state.activeZoneId);
  const dev = getDevice(zone, devId);
  state.activeDeviceId = dev.id;
  renderInspector();

  if (focus3D && dev.focusCam && dev.focusTarget) {
    animateCameraTo(dev.focusCam, dev.focusTarget, 0.58);
  }
}

/* ---------- Modals ---------- */
function openCatalogModal(scrollToStandards = false) {
  renderCatalogModal();
  els.catalogModal.classList.remove('hidden');
  if (scrollToStandards) {
    requestAnimationFrame(() => {
      els.standardsSummarySection.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

function closeCatalogModal() {
  els.catalogModal.classList.add('hidden');
}

function openLightbox(src, title, sub) {
  els.lightboxImg.src = src;
  els.lightboxTitle.textContent = title;
  els.lightboxSub.textContent = sub || '';
  els.lightboxModal.classList.remove('hidden');
}

function closeLightbox() {
  els.lightboxModal.classList.add('hidden');
}

/* ---------- Event Listeners ---------- */
els.brandBtn.addEventListener('click', enterOverview);
els.backOverviewBtn.addEventListener('click', enterOverview);
els.navOverviewBtn.addEventListener('click', enterOverview);
els.navZonesBtn.addEventListener('click', () => enterZone('lobby'));
els.navStandardsBtn.addEventListener('click', () => openCatalogModal(true));

els.exploreTopBtn.addEventListener('click', () => enterZone('lobby'));
els.enterLobbyBtn.addEventListener('click', () => enterZone('lobby'));

els.openCatalogTopBtn.addEventListener('click', () => openCatalogModal(false));
els.openCatalogHeroBtn.addEventListener('click', () => openCatalogModal(false));
els.closeCatalogBtn.addEventListener('click', closeCatalogModal);
els.catalogModal.addEventListener('click', (e) => {
  if (e.target === els.catalogModal) closeCatalogModal();
});

els.langThBtn.addEventListener('click', () => applyLanguage('th'));
els.langEnBtn.addEventListener('click', () => applyLanguage('en'));

els.toggleFovBtn.addEventListener('click', () => {
  state.fovEnabled = !state.fovEnabled;
  els.toggleFovBtn.classList.toggle('active', state.fovEnabled);
  sceneManager.setFovVisible(state.fovEnabled);
});

els.resetCamBtn.addEventListener('click', () => {
  if (state.view === 'overview') {
    animateCameraTo(OVERVIEW_CAM.pos.toArray(), OVERVIEW_CAM.target.toArray(), 0.6);
  } else {
    const zone = getZone(state.activeZoneId);
    animateCameraTo(zone.camPos, zone.camTarget, 0.6);
  }
});

els.openLightboxTrigger.addEventListener('click', () => {
  const zone = getZone(state.activeZoneId);
  const dev = getDevice(zone, state.activeDeviceId);
  openLightbox(
    dev.image,
    state.lang === 'th' ? dev.nameTh : dev.nameEn,
    state.lang === 'th' ? dev.modelRefTh : dev.modelRefEn
  );
});

els.closeLightboxBtn.addEventListener('click', closeLightbox);
els.lightboxModal.addEventListener('click', (e) => {
  if (e.target === els.lightboxModal) closeLightbox();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeCatalogModal();
  }
});

window.addEventListener('resize', resizeViewport);
if (window.ResizeObserver) {
  new ResizeObserver(() => resizeViewport()).observe(els.canvasHost);
}

/* ---------- Render Loop ---------- */
const clock = new THREE.Clock();

function renderLoop() {
  requestAnimationFrame(renderLoop);
  const dt = Math.min(clock.getDelta(), 0.05);

  if (camTween.active) {
    camTween.progress = Math.min(1, camTween.progress + dt / camTween.duration);
    const ease = 1 - Math.pow(1 - camTween.progress, 3);
    camera.position.lerpVectors(camTween.fromPos, camTween.toPos, ease);
    controls.target.lerpVectors(camTween.fromTarget, camTween.toTarget, ease);
    if (camTween.progress >= 1) camTween.active = false;
  }

  controls.update();
  renderer.render(scene, camera);
  updateProjectedPins();
}

/* ---------- Boot & URL Deep-Link Support ---------- */
function applyUrlHash() {
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw) return false;
  const params = new URLSearchParams(raw.includes('=') ? raw : `view=${raw}`);
  const langParam = params.get('lang');
  if (langParam === 'en' || langParam === 'th') {
    applyLanguage(langParam);
  }
  if (params.get('fov') === '1') {
    state.fovEnabled = true;
  }
  const zoneParam = params.get('zone');
  const devParam = params.get('dev');
  if (zoneParam) {
    enterZone(zoneParam, devParam || null);
    // Snap camera immediately when deep-linking
    if (camTween.active) {
      camera.position.copy(camTween.toPos);
      controls.target.copy(camTween.toTarget);
      camTween.active = false;
    }
    return true;
  }
  return false;
}

function init() {
  camera.position.copy(OVERVIEW_CAM.pos);
  controls.target.copy(OVERVIEW_CAM.target);
  sceneManager.loadOverview();
  applyLanguage('th');
  applyUrlHash();
  resizeViewport();
  renderLoop();

  window.addEventListener('hashchange', applyUrlHash);

  setTimeout(() => {
    els.loadingOverlay.classList.add('is-hidden');
  }, 180);
}

init();
