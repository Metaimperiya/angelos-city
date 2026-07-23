// ============================================================
// СТАРАЯ РАБОЧАЯ ВЕРСИЯ (ВСЁ В ОДНОМ ФАЙЛЕ)
// ============================================================

// ============================================================
// 1. ПОДКЛЮЧЕНИЕ К СЕРВЕРУ
// ============================================================
const socket = new WebSocket(`wss://${window.location.hostname}`);
let myId = '';
let isConnected = false;
const remotePlayers = {};
const remoteMeshes = {};
let playerName = 'Игрок_' + Math.random().toString(36).substr(2, 4);

// ============================================================
// 2. СЦЕНА
// ============================================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1a);
scene.fog = new THREE.FogExp2(0x0a0a1a, 0.008);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 3, 8);
camera.rotation.order = 'YXZ';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.prepend(renderer.domElement);

// ============================================================
// 3. СВЕТ
// ============================================================
const ambient = new THREE.AmbientLight(0x222244, 0.6);
scene.add(ambient);
const dirLight = new THREE.DirectionalLight(0x88ccff, 1.5);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
scene.add(dirLight);
const backLight = new THREE.DirectionalLight(0xff4488, 0.4);
backLight.position.set(-5, 5, -10);
scene.add(backLight);
const bottomLight = new THREE.PointLight(0x00f3ff, 0.8, 20);
bottomLight.position.set(0, -2, 0);
scene.add(bottomLight);

// ============================================================
// 4. ПОЛ
// ============================================================
const gridHelper = new THREE.GridHelper(100, 40, 0x00f3ff, 0x334466);
gridHelper.position.y = -0.5;
scene.add(gridHelper);

const planeGeo = new THREE.PlaneGeometry(200, 200);
const planeMat = new THREE.MeshPhongMaterial({
  color: 0x0a0a1a,
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.5;
plane.receiveShadow = true;
scene.add(plane);

// ============================================================
// 5. ПЕРСОНАЖ
// ============================================================
const playerGroup = new THREE.Group();
scene.add(playerGroup);

function createPlayerMesh(color = 0x00ff88) {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshPhongMaterial({ color, flatShading: true });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.6), bodyMat);
  body.position.y = 0.7;
  body.castShadow = true;
  group.add(body);
  const headMat = new THREE.MeshPhongMaterial({ color: 0xffccaa, flatShading: true });
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), headMat);
  head.position.y = 1.5;
  head.castShadow = true;
  group.add(head);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  for (let side = -1; side <= 1; side += 2) {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), eyeMat);
    eye.position.set(side * 0.2, 1.6, 0.35);
    group.add(eye);
    const pupil = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), pupilMat);
    pupil.position.set(side * 0.2, 1.6, 0.45);
    group.add(pupil);
  }
  return group;
}

const localPlayer = createPlayerMesh(0x00ff88);
playerGroup.add(localPlayer);
const playerPos = { x: 0, z: 0, y: 0 };

// ============================================================
// 6. УДАЛЁННЫЕ ИГРОКИ
// ============================================================
function addRemotePlayer(id, x, z, color) {
  if (remoteMeshes[id]) return;
  const mesh = createPlayerMesh(color);
  mesh.position.set(x || 0, 0, z || 0);
  scene.add(mesh);
  remoteMeshes[id] = mesh;
  return mesh;
}

function removeRemotePlayer(id) {
  if (remoteMeshes[id]) {
    scene.remove(remoteMeshes[id]);
    delete remoteMeshes[id];
  }
}

// ============================================================
// 7. ЗАГРУЗКА КОРАБЛЯ
// ============================================================
const loader = new THREE.GLTFLoader();
const loadingEl = document.getElementById('loading');

loader.load(
  '/assets/models/karablik_Untitled.glb',
  (gltf) => {
    const ship = gltf.scene;
    const box = new THREE.Box3().setFromObject(ship);
    const center = box.getCenter(new THREE.Vector3());
    ship.position.sub(center);
    ship.position.y = 0;
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 5) {
      const scale = 5 / maxDim;
      ship.scale.set(scale, scale, scale);
    }
    ship.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.metalness = 0.6;
          child.material.roughness = 0.3;
        }
      }
    });
    ship.position.set(5, 0, 5);
    scene.add(ship);
    console.log('✅ Корабль загружен!');
    loadingEl.textContent = '✅ Корабль загружен!';
    setTimeout(() => { if (loadingEl.textContent.includes('Корабль')) loadingEl.style.display = 'none'; }, 1500);
  },
  (xhr) => {
    const progress = Math.round((xhr.loaded / xhr.total) * 100);
    loadingEl.textContent = `⏳ Корабль: ${progress}%`;
  },
  (error) => {
    console.error('❌ Ошибка загрузки корабля:', error);
    loadingEl.textContent = '⚠️ Корабль не загружен, но игра работает';
    setTimeout(() => { loadingEl.style.display = 'none'; }, 3000);
  }
);

// ============================================================
// 8. УПРАВЛЕНИЕ (КЛАВИАТУРА + МЫШЬ)
// ============================================================
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
  keys[e.code] = true;
  if (e.key === 'Enter' && document.activeElement !== document.getElementById('chat-input')) {
    toggleChat();
  }
  if (e.key === 'Escape' && chatVisible) toggleChat();
});
window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
  keys[e.code] = false;
});

let isPointerLocked = false;
renderer.domElement.addEventListener('click', () => {
  renderer.domElement.requestPointerLock();
});
document.addEventListener('pointerlockchange', () => {
  isPointerLocked = document.pointerLockElement === renderer.domElement;
});

let euler = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
  if (!isPointerLocked) return;
  euler.y -= e.movementX * 0.002;
  euler.x -= e.movementY * 0.002;
  euler.x = Math.max(-1.2, Math.min(1.2, euler.x));
  camera.rotation.order = 'YXZ';
  camera.rotation.x = euler.x;
  camera.rotation.y = euler.y;
});

// ============================================================
// 9. МОБИЛЬНОЕ УПРАВЛЕНИЕ
// ============================================================
const moveZone = document.createElement('div');
moveZone.style.cssText = 'position:absolute;top:0;left:0;width:75%;height:100%;z-index:40;touch-action:none;';
document.body.appendChild(moveZone);

const lookZone = document.createElement('div');
lookZone.style.cssText = 'position:absolute;top:0;right:0;width:25%;height:100%;z-index:40;touch-action:none;';
document.body.appendChild(lookZone);

let touchMoveId = null;
let touchLookId = null;
let lastMovePos = { x: 0, y: 0 };
let lastLookPos = { x: 0, y: 0 };
let moveDelta = { x: 0, y: 0 };
let lookDelta = { x: 0, y: 0 };
let jumpPressed = false;

moveZone.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.changedTouches[0];
  touchMoveId = touch.identifier;
  lastMovePos = { x: touch.clientX, y: touch.clientY };
  moveDelta = { x: 0, y: 0 };
});

moveZone.addEventListener('touchmove', (e) => {
  e.preventDefault();
  for (const touch of e.changedTouches) {
    if (touch.identifier === touchMoveId) {
      const dx = touch.clientX - lastMovePos.x;
      const dy = touch.clientY - lastMovePos.y;
      moveDelta.x = dx;
      moveDelta.y = dy;
      lastMovePos = { x: touch.clientX, y: touch.clientY };
    }
  }
});

moveZone.addEventListener('touchend', (e) => {
  for (const touch of e.changedTouches) {
    if (touch.identifier === touchMoveId) {
      touchMoveId = null;
      moveDelta = { x: 0, y: 0 };
    }
  }
});

moveZone.addEventListener('touchcancel', () => {
  touchMoveId = null;
  moveDelta = { x: 0, y: 0 };
});

lookZone.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.changedTouches[0];
  touchLookId = touch.identifier;
  lastLookPos = { x: touch.clientX, y: touch.clientY };
  lookDelta = { x: 0, y: 0 };
});

lookZone.addEventListener('touchmove', (e) => {
  e.preventDefault();
  for (const touch of e.changedTouches) {
    if (touch.identifier === touchLookId) {
      const dy = touch.clientY - lastLookPos.y;
      lookDelta.y = dy;
      lastLookPos = { x: touch.clientX, y: touch.clientY };
    }
  }
});

lookZone.addEventListener('touchend', (e) => {
  for (const touch of e.changedTouches) {
    if (touch.identifier === touchLookId) {
      touchLookId = null;
      lookDelta = { x: 0, y: 0 };
    }
  }
});

lookZone.addEventListener('touchcancel', () => {
  touchLookId = null;
  lookDelta = { x: 0, y: 0 };
});

const jumpBtn = document.getElementById('jump-btn');
if (jumpBtn) {
  jumpBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jumpPressed = true;
    jumpBtn.style.transform = 'scale(0.92)';
    jumpBtn.style.background = 'rgba(255, 0, 127, 0.4)';
  });
  jumpBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    jumpPressed = false;
    jumpBtn.style.transform = 'scale(1)';
    jumpBtn.style.background = 'rgba(255, 0, 127, 0.25)';
  });
  jumpBtn.addEventListener('touchcancel', () => {
    jumpPressed = false;
    jumpBtn.style.transform = 'scale(1)';
    jumpBtn.style.background = 'rgba(255, 0, 127, 0.25)';
  });
}

// ============================================================
// 10. ЧАТ
// ============================================================
let chatVisible = false;
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatToggle = document.getElementById('chat-toggle');
const chatEl = document.getElementById('chat');

function toggleChat() {
  chatVisible = !chatVisible;
  chatEl.style.display = chatVisible ? 'flex' : 'none';
  if (chatVisible
