// ============================================================
// ИГРОК + УПРАВЛЕНИЕ (ВСЕ ФИКСЫ)
// ============================================================

import * as THREE from 'three';
import { scene, camera, renderer } from '../core/scene.js';
import { teleportToShip } from './Ship.js';
import { sendPosition, socket } from '../network/socket.js';

export let playerPos = { x: 0, z: 0, y: 0 };
let playerGroup;
let velocityY = 0;
let isGrounded = true;
let delta = 0;

export function setDelta(value) {
  delta = value;
}

// ============================================================
// КЛАВИАТУРА
// ============================================================
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
  keys[e.code] = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
  keys[e.code] = false;
});

// ============================================================
// МЫШЬ (ФИКС 2)
// ============================================================
let isPointerLocked = false;
let euler = { x: 0, y: 0 };

export function initControls() {
  renderer.domElement.addEventListener('click', () => {
    renderer.domElement.requestPointerLock();
  });
  document.addEventListener('pointerlockchange', () => {
    isPointerLocked = document.pointerLockElement === renderer.domElement;
  });
  document.addEventListener('mousemove', (e) => {
    if (!isPointerLocked) return;
    euler.y -= e.movementX * 0.002;
    euler.x -= e.movementY * 0.002;
    euler.x = Math.max(-1.2, Math.min(1.2, euler.x));
    camera.rotation.order = 'YXZ';
    camera.rotation.x = euler.x;
    camera.rotation.y = euler.y;
  });
}

// ============================================================
// ТЕЛЕФОН
// ============================================================
let touchMove = { x: 0, y: 0 };
let touchLook = { x: 0, y: 0 };
let jumpPressed = false;

export function initTouchControls() {
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

  moveZone.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    touchMoveId = touch.identifier;
    lastMovePos = { x: touch.clientX, y: touch.clientY };
    touchMove = { x: 0, y: 0 };
  });

  moveZone.addEventListener('touchmove', (e) => {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      if (touch.identifier === touchMoveId) {
        const dx = touch.clientX - lastMovePos.x;
        const dy = touch.clientY - lastMovePos.y;
        touchMove.x = dx;
        touchMove.y = dy;
        lastMovePos = { x: touch.clientX, y: touch.clientY };
      }
    }
  });

  moveZone.addEventListener('touchend', (e) => {
    for (const touch of e.changedTouches) {
      if (touch.identifier === touchMoveId) {
        touchMoveId = null;
        touchMove = { x: 0, y: 0 };
      }
    }
  });

  moveZone.addEventListener('touchcancel', () => {
    touchMoveId = null;
    touchMove = { x: 0, y: 0 };
  });

  lookZone.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    touchLookId = touch.identifier;
    lastLookPos = { x: touch.clientX, y: touch.clientY };
    touchLook = { x: 0, y: 0 };
  });

  lookZone.addEventListener('touchmove', (e) => {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      if (touch.identifier === touchLookId) {
        const dx = touch.clientX - lastLookPos.x;
        const dy = touch.clientY - lastLookPos.y;
        touchLook.x += dx;
        touchLook.y += dy;
        lastLookPos = { x: touch.clientX, y: touch.clientY };
      }
    }
  });

  lookZone.addEventListener('touchend', (e) => {
    for (const touch of e.changedTouches) {
      if (touch.identifier === touchLookId) {
        touchLookId = null;
        touchLook = { x: 0, y: 0 };
      }
    }
  });

  lookZone.addEventListener('touchcancel', () => {
    touchLookId = null;
    touchLook = { x: 0, y: 0 };
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
}

// ============================================================
// СОЗДАНИЕ ИГРОКА
// ============================================================
export function createPlayer() {
  playerGroup = new THREE.Group();
  scene.add(playerGroup);

  const color = 0x00ff88;
  const bodyMat = new THREE.MeshPhongMaterial({ color, flatShading: true });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.6), bodyMat);
  body.position.y = 0.7;
  body.castShadow = true;
  playerGroup.add(body);

  const headMat = new THREE.MeshPhongMaterial({ color: 0xffccaa, flatShading: true });
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), headMat);
  head.position.y = 1.5;
  head.castShadow = true;
  playerGroup.add(head);

  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  for (let side = -1; side <= 1; side += 2) {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), eyeMat);
    eye.position.set(side * 0.2, 1.6, 0.35);
    playerGroup.add(eye);
    const pupil = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), pupilMat);
    pupil.position.set(side * 0.2, 1.6, 0.45);
    playerGroup.add(pupil);
  }

  // ФИКС 3: Телепорт на корабль при спавне
  const spawn = teleportToShip();
  if (spawn) {
    playerPos.x = spawn.x + (Math.random() - 0.5) * 1.5;
    playerPos.z = spawn.z + (Math.random() - 0.5) * 1.5;
  } else {
    playerPos.x = 0;
    playerPos.z = 0;
  }

  playerGroup.position.set(playerPos.x, playerPos.y, playerPos.z);
  initTouchControls();
}

// ============================================================
// ОБНОВЛЕНИЕ ИГРОКА (ФИКС 1)
// ============================================================
export function updatePlayer() {
  // ФИКС 1: Правильное направление вперёд
  const forward = new THREE.Vector3(0, 0, -1);
  forward.applyQuaternion(camera.quaternion);
  forward.y = 0;
  forward.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(forward, camera.up).normalize();

  let moveX = 0, moveZ = 0;

  // Клавиатура
  if (keys['w'] || keys['arrowup']) moveZ += 1;
  if (keys['s'] || keys['arrowdown']) moveZ -= 1;
  if (keys['a'] || keys['arrowleft']) moveX -= 1;
  if (keys['d'] || keys['arrowright']) moveX += 1;

  // Телефон
  if (Math.abs(touchMove.x) > 2 || Math.abs(touchMove.y) > 2) {
    moveX += touchMove.x * 0.02;
    moveZ += touchMove.y * 0.02;
  }

  // Телефон (камера)
  if (Math.abs(touchLook.x) > 2 || Math.abs(touchLook.y) > 2) {
    euler.y -= touchLook.x * 0.005;
    euler.x -= touchLook.y * 0.005;
    euler.x = Math.max(-1.2, Math.min(1.2, euler.x));
    camera.rotation.x = euler.x;
    camera.rotation.y = euler.y;
  }

  const speed = 8;
  let moved = false;

  if (Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05) {
    const len = Math.hypot(moveX, moveZ);
    moveX /= len;
    moveZ /= len;

    // ФИКС 1: Правильный расчёт движения
    const dx = (forward.x * moveZ + right.x * moveX) * speed * delta;
    const dz = (forward.z * moveZ + right.z * moveX) * speed * delta;

    playerPos.x += dx;
    playerPos.z += dz;
    moved = true;

    // ФИКС 1: Персонаж смотрит в сторону движения
    const angle = Math.atan2(moveX, moveZ);
    playerGroup.rotation.y = angle;
  }

  // Прыжок
  const jumpForce = 4.5;
  const gravity = -12;
  let jump = keys['space'] || keys['Space'] || jumpPressed;
  if (jump && isGrounded) {
    velocityY = jumpForce;
    isGrounded = false;
  }

  if (!isGrounded) {
    velocityY += gravity * delta;
    playerPos.y += velocityY * delta;
    if (playerPos.y <= 0) {
      playerPos.y = 0;
      velocityY = 0;
      isGrounded = true;
    }
  }

  playerGroup.position.set(playerPos.x, playerPos.y, playerPos.z);

  // Камера
  const offset = new THREE.Vector3(0, 2.5, 6);
  offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), euler.y);
  offset.x += playerPos.x;
  offset.y += playerPos.y;
  offset.z += playerPos.z;

  camera.position.lerp(offset, 0.1);
  camera.lookAt(playerPos.x, playerPos.y + 1.5, playerPos.z);

  // Отправка
  if (moved) {
    sendPosition(playerPos.x, playerPos.z, playerGroup.rotation.y);
  }
}

export function getPlayerPos() {
  return playerPos;
}
