<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>🚢 Angelos City</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; touch-action: none; }
    body { overflow: hidden; background: #020208; font-family: monospace; }
    #loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #00f3ff;
      font-size: 20px;
      z-index: 50;
      text-shadow: 0 0 30px #00f3ff;
      animation: blink 1s infinite alternate;
    }
    @keyframes blink {
      0% { opacity: 0.3; }
      100% { opacity: 1; }
    }
    #info {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: #00f0ff;
      background: rgba(0,0,0,0.7);
      padding: 6px 16px;
      border-radius: 10px;
      font-size: 11px;
      z-index: 100;
      border: 1px solid #00f0ff;
      text-align: center;
      pointer-events: none;
      white-space: nowrap;
    }
    #controls {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      color: #ff007f;
      background: rgba(0,0,0,0.7);
      padding: 4px 12px;
      border-radius: 8px;
      font-size: 11px;
      z-index: 100;
      border: 1px solid #ff007f;
      text-align: center;
      pointer-events: none;
      white-space: nowrap;
    }
    #players-count {
      position: absolute;
      top: 60px;
      right: 15px;
      color: #00ff88;
      background: rgba(0,0,0,0.7);
      padding: 4px 12px;
      border-radius: 8px;
      font-size: 12px;
      z-index: 100;
      border: 1px solid #00ff88;
      pointer-events: none;
    }

    /* ===== МОБИЛЬНЫЙ ДЖОЙСТИК ===== */
    #joystick-area {
      position: absolute;
      bottom: 30px;
      left: 30px;
      width: 130px;
      height: 130px;
      border-radius: 50%;
      background: rgba(0, 243, 255, 0.15);
      border: 2px solid rgba(0, 243, 255, 0.3);
      z-index: 50;
      touch-action: none;
      display: none;
    }
    #joystick-knob {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(0, 243, 255, 0.5);
      transform: translate(-50%, -50%);
      box-shadow: 0 0 20px rgba(0, 243, 255, 0.2);
      pointer-events: none;
    }

    /* ===== КНОПКА ПРЫЖКА ===== */
    #jump-btn {
      position: absolute;
      bottom: 40px;
      right: 30px;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: rgba(255, 0, 127, 0.25);
      border: 2px solid rgba(255, 0, 127, 0.5);
      color: #ff007f;
      font-size: 16px;
      font-weight: bold;
      z-index: 50;
      display: none;
      justify-content: center;
      align-items: center;
      touch-action: none;
      user-select: none;
      font-family: monospace;
      box-shadow: 0 0 30px rgba(255, 0, 127, 0.1);
    }
    #jump-btn:active {
      background: rgba(255, 0, 127, 0.4);
      transform: scale(0.92);
    }

    /* ===== ЧАТ ===== */
    #chat {
      position: absolute;
      bottom: 80px;
      left: 10px;
      width: calc(100% - 20px);
      max-width: 320px;
      max-height: 180px;
      z-index: 100;
      display: none;
      flex-direction: column;
      background: rgba(0,0,0,0.85);
      border: 1px solid #00f3ff;
      border-radius: 12px;
      padding: 8px;
    }
    #chat-log {
      flex: 1;
      overflow-y: auto;
      max-height: 120px;
      color: #aabbdd;
      font-size: 12px;
      line-height: 1.5;
      margin-bottom: 6px;
    }
    #chat-log .msg .name { color: #00f3ff; font-weight: bold; }
    #chat-log .msg .text { color: #ffffff; }
    #chat-log .system { color: #ff007f; font-style: italic; }
    #chat-input-row { display: flex; gap: 6px; }
    #chat-input {
      flex: 1;
      background: transparent;
      border: 1px solid #334466;
      color: #fff;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      font-family: monospace;
      min-height: 36px;
    }
    #chat-input:focus { border-color: #00f3ff; }
    #chat-send {
      background: transparent;
      border: 1px solid #00f3ff;
      color: #00f3ff;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-family: monospace;
      font-size: 14px;
    }
    #chat-send:hover { background: #00f3ff; color: #000; }
    #chat-toggle {
      position: absolute;
      bottom: 10px;
      left: 10px;
      z-index: 99;
      background: rgba(0,0,0,0.7);
      border: 1px solid #00f3ff;
      color: #00f3ff;
      padding: 6px 14px;
      border-radius: 20px;
      cursor: pointer;
      font-family: monospace;
      font-size: 12px;
      display: none;
    }
    #chat-toggle:hover { background: #00f3ff; color: #000; }

    @media (max-width: 768px) {
      #joystick-area { display: block; width: 110px; height: 110px; bottom: 20px; left: 20px; }
      #joystick-knob { width: 40px; height: 40px; }
      #jump-btn { display: flex; width: 60px; height: 60px; bottom: 25px; right: 20px; font-size: 14px; }
      #controls { font-size: 10px; top: 8px; padding: 3px 10px; }
      #info { font-size: 10px; bottom: 80px; padding: 4px 12px; white-space: normal; }
      #players-count { top: 50px; right: 10px; font-size: 11px; padding: 3px 10px; }
    }
    @media (pointer: coarse) {
      #joystick-area { display: block; }
      #jump-btn { display: flex; }
    }

    /* ===== ДЛЯ ФРЕЙМА ===== */
    #frame-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 200;
      background: transparent;
      display: none;
      cursor: pointer;
    }
    #frame-hint {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #00f3ff;
      font-size: 18px;
      font-family: monospace;
      text-shadow: 0 0 30px #00f3ff;
      z-index: 201;
      display: none;
      background: rgba(0,0,0,0.7);
      padding: 12px 24px;
      border-radius: 12px;
      border: 1px solid #00f3ff;
      pointer-events: none;
    }
  </style>
</head>
<body>

<div id="loading">⏳ Подключение к серверу...</div>
<div id="controls">🎮 WASD — ходьба | Пробел — прыжок | Мышь — обзор</div>
<div id="info">🖱️ Нажми на экран, чтобы захватить мышь</div>
<div id="players-count">👥 <span id="count-display">1</span></div>

<!-- ФРЕЙМ-ОВЕРЛЕЙ (для захвата мыши во фрейме) -->
<div id="frame-overlay"></div>
<div id="frame-hint">🖱️ Нажми чтобы управлять</div>

<!-- МОБИЛЬНОЕ УПРАВЛЕНИЕ -->
<div id="joystick-area">
  <div id="joystick-knob"></div>
</div>
<div id="jump-btn">⬆</div>

<div id="chat">
  <div id="chat-log"></div>
  <div id="chat-input-row">
    <input id="chat-input" type="text" placeholder="Написать..." maxlength="100">
    <button id="chat-send">➤</button>
  </div>
</div>
<button id="chat-toggle">💬 Чат</button>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>

<script>
  // ============================================================
  // 0. ОПРЕДЕЛЕНИЕ ФРЕЙМА
  // ============================================================
  const isInFrame = window !== window.top;
  const frameOverlay = document.getElementById('frame-overlay');
  const frameHint = document.getElementById('frame-hint');

  if (isInFrame) {
    frameOverlay.style.display = 'block';
    frameHint.style.display = 'block';
    document.getElementById('info').textContent = '🖱️ Нажми на экран, чтобы управлять';
  }

  // ============================================================
  // 1. ПОДКЛЮЧЕНИЕ К СЕРВЕРУ
  // ============================================================
  const socket = new WebSocket(`wss://${window.location.host}`);
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
    '/models/karablik_Untitled.glb',
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
      ship.position.set(4, 0, 4);
      scene.add(ship);
      console.log('✅ Корабль загружен!');
    },
    (xhr) => {
      const progress = Math.round((xhr.loaded / xhr.total) * 100);
      if (loadingEl.textContent.includes('Загрузка корабля')) {
        loadingEl.textContent = `⏳ Загрузка корабля: ${progress}%`;
      }
    },
    (error) => {
      console.error('❌ Ошибка загрузки корабля:', error);
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
  
  // Захват мыши через клик (работает и во фрейме)
  function requestPointerLock() {
    renderer.domElement.requestPointerLock();
    if (isInFrame) {
      frameOverlay.style.display = 'none';
      frameHint.style.display = 'none';
    }
  }

  renderer.domElement.addEventListener('click', requestPointerLock);
  frameOverlay.addEventListener('click', requestPointerLock);

  document.addEventListener('pointerlockchange', () => {
    isPointerLocked = document.pointerLockElement === renderer.domElement;
    if (!isPointerLocked && isInFrame) {
      frameOverlay.style.display = 'block';
      frameHint.style.display = 'block';
    }
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
  // 9. МОБИЛЬНОЕ УПРАВЛЕНИЕ (ДЖОЙСТИК)
  // ============================================================
  const joystickArea = document.getElementById('joystick-area');
  const joystickKnob = document.getElementById('joystick-knob');
  const jumpBtn = document.getElementById('jump-btn');

  let touchMove = { x: 0, y: 0 };
  let joystickActive = false;
  let joystickId = null;

  joystickArea.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    joystickId = touch.identifier;
    joystickActive = true;
    updateJoystick(touch);
  });

  joystickArea.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!joystickActive) return;
    for (const touch of e.changedTouches) {
      if (touch.identifier === joystickId) {
        updateJoystick(touch);
      }
    }
  });

  joystickArea.addEventListener('touchend', (e) => {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      if (touch.identifier === joystickId) {
        joystickActive = false;
        joystickId = null;
        touchMove.x = 0;
        touchMove.y = 0;
        joystickKnob.style.transform = 'translate(-50%, -50%)';
        joystickKnob.style.background = 'rgba(0, 243, 255, 0.5)';
      }
    }
  });

  joystickArea.addEventListener('touchcancel', (e) => {
    joystickActive = false;
    joystickId = null;
    touchMove.x = 0;
    touchMove.y = 0;
    joystickKnob.style.transform = 'translate(-50%, -50%)';
    joystickKnob.style.background = 'rgba(0, 243, 255, 0.5)';
  });

  function updateJoystick(touch) {
    const rect = joystickArea.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = touch.clientX - cx;
    const dy = touch.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const maxDist = rect.width / 2 - 20;
    const clamped = Math.min(dist, maxDist);
    const angle = Math.atan2(dy, dx);
    const normX = (Math.cos(angle) * clamped) / maxDist;
    const normY = (Math.sin(angle) * clamped) / maxDist;
    touchMove.x = normX;
    touchMove.y = -normY;
    const knobX = Math.cos(angle) * clamped;
    const knobY = Math.sin(angle) * clamped;
    joystickKnob.style.transform = `translate(${-50 + (knobX / rect.width) * 100}%, ${-50 + (knobY / rect.height) * 100}%)`;
    joystickKnob.style.background = `rgba(0, 243, 255, ${0.3 + 0.7 * (clamped / maxDist)})`;
  }

  // Прыжок на мобильном
  let jumpPressed = false;
  jumpBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jumpPressed = true;
    jumpBtn.style.transform = 'scale(0.92)';
  });
  jumpBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    jumpPressed = false;
    jumpBtn.style.transform = 'scale(1)';
  });
  jumpBtn.addEventListener('touchcancel', (e) => {
    jumpPressed = false;
    jumpBtn.style.transform = 'scale(1)';
  });

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
    if (chatVisible) chatInput.focus();
  }

  chatToggle.addEventListener('click', toggleChat);
  chatSend.addEventListener('click', sendChat);
  chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });

  function sendChat() {
    const text = chatInput.value.trim();
    if (!text) return;
    addChatMessage('Я', text, '#00ff88');
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'chat', text }));
    }
    chatInput.value = '';
  }

  function addChatMessage(name, text, color = '#00f3ff') {
    const div = document.createElement('div');
    div.className = 'msg';
    div.innerHTML = `<span class="name" style="color:${color}">${name}:</span> <span class="text">${text}</span>`;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function addSystemMessage(text) {
    const div = document.createElement('div');
    div.className = 'system';
    div.textContent = '📢 ' + text;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function updateCount() {
    const count = Object.keys(remoteMeshes).length + 1;
    document.getElementById('count-display').textContent = count;
  }

  // ============================================================
  // 11. СОКЕТ СОБЫТИЯ
  // ============================================================
  socket.onopen = () => {
    isConnected = true;
    console.log('🟢 Подключено к серверу');
    loadingEl.textContent = '✅ Подключено!';
    socket.send(JSON.stringify({
      type: 'join',
      name: playerName,
      x: playerPos.x,
      z: playerPos.z
    }));
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      if (data.type === 'init') {
        myId = data.myId;
        for (const id in data.players) {
          if (id !== myId) {
            const player = data.players[id];
            addRemotePlayer(id, player.x || 0, player.z || 0, player.color || 0xff4488);
            remotePlayers[id] = player;
          }
        }
        updateCount();
        loadingEl.style.display = 'none';
        chatToggle.style.display = 'block';
        addSystemMessage('✅ Добро пожаловать в мир!');
        console.log('👥 Игроков в мире:', Object.keys(data.players).length);
      }
      
      if (data.type === 'playerJoin') {
        if (data.id === myId) return;
        addRemotePlayer(data.id, data.x || 0, data.z || 0, data.color || 0xff4488);
        remotePlayers[data.id] = { x: data.x || 0, z: data.z || 0 };
        addSystemMessage(`👤 ${data.name || 'Игрок'} вошёл в мир`);
        updateCount();
      }
      
      if (data.type === 'playerMove') {
        if (data.id === myId) return;
        if (remoteMeshes[data.id]) {
          remoteMeshes[data.id].position.set(data.x || 0, 0, data.z || 0);
          if (data.rotation !== undefined) {
            remoteMeshes[data.id].rotation.y = data.rotation;
          }
        }
      }
      
      if (data.type === 'playerLeave') {
        if (data.id === myId) return;
        removeRemotePlayer(data.id);
        delete remotePlayers[data.id];
        addSystemMessage(`👤 Игрок покинул мир`);
        updateCount();
      }
      
      if (data.type === 'chat') {
        if (data.id === myId) return;
        addChatMessage(data.name || 'Игрок', data.text, '#ffaa44');
      }
      
    } catch (e) {
      console.error('Ошибка парсинга:', e);
    }
  };

  socket.onclose = () => {
    isConnected = false;
    console.log('🔴 Отключено от сервера');
    loadingEl.textContent = '❌ Потеря соединения. Перезагрузи страницу.';
  };

  // ============================================================
  // 12. АНИМАЦИЯ
  // ============================================================
  const speed = 0.15;
  let velocityY = 0;
  let isGrounded = true;
  let lastSentTime = 0;

  function animate() {
    requestAnimationFrame(animate);

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    // ===== ОБЪЕДИНЯЕМ УПРАВЛЕНИЕ =====
    let moveX = 0, moveZ = 0;
    
    // Клавиатура
    if (keys['w'] || keys['arrowup']) moveZ += 1;
    if (keys['s'] || keys['arrowdown']) moveZ -= 1;
    if (keys['a'] || keys['arrowleft']) moveX -= 1;
    if (keys['d'] || keys['arrowright']) moveX += 1;
    
    // Мобильный джойстик (если активен)
    if (Math.abs(touchMove.x) > 0.05 || Math.abs(touchMove.y) > 0.05) {
      moveX += touchMove.x;
      moveZ += touchMove.y;
    }

    let moved = false;
    let angle = 0;

    if (Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05) {
      const len = Math.hypot(moveX, moveZ);
      moveX /= len;
      moveZ /= len;

      const dx = (forward.x * moveZ + right.x * moveX) * speed;
      const dz = (forward.z * moveZ + right.z * moveX) * speed;

      playerPos.x += dx;
      playerPos.z += dz;
      moved = true;
      angle = Math.atan2(moveX, moveZ);
      playerGroup.rotation.y = angle;
    }

    // Прыжок (клавиатура или мобильная кнопка)
    let jump = keys['space'] || keys['Space'] || jumpPressed;
    if (jump && isGrounded) {
      velocityY = 0.2;
      isGrounded = false;
    }

    if (!isGrounded) {
      velocityY -= 0.008;
      playerPos.y += velocityY;
      if (playerPos.y <= 0) {
        playerPos.y = 0;
        velocityY = 0;
        isGrounded = true;
      }
    }

    playerGroup.position.set(playerPos.x, playerPos.y, playerPos.z);

    const offset = new THREE.Vector3(0, 2.5, 6);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), euler.y);
    offset.x += playerPos.x;
    offset.y += playerPos.y;
    offset.z += playerPos.z;

    camera.position.lerp(offset, 0.1);
    camera.lookAt(playerPos.x, playerPos.y + 1.5, playerPos.z);

    if (moved && isConnected && Date.now() - lastSentTime > 50 && socket.readyState === WebSocket.OPEN) {
      lastSentTime = Date.now();
      socket.send(JSON.stringify({
        type: 'move',
        x: playerPos.x,
        z: playerPos.z,
        rotation: angle
      }));
    }

    renderer.render(scene, camera);
  }

  animate();

  // ============================================================
  // 13. RESIZE
  // ============================================================
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  console.log('🚢 Angelos City загружен!');

  // ============================================================
  // 14. СООБЩЕНИЕ РОДИТЕЛЬСКОМУ ФРЕЙМУ
  // ============================================================
  if (isInFrame) {
    window.parent.postMessage({
      type: 'angelos-city-ready',
      url: window.location.href
    }, '*');
  }
</script>
</body>
</html>
