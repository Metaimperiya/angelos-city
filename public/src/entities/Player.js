// ============================================================
// ИГРОК + УПРАВЛЕНИЕ
// ============================================================

import * as THREE from 'three';
import { scene, camera } from '../core/scene.js';
import { teleportToShip } from './Ship.js';

export let playerPos = { x: 0, z: 0, y: 0 };
let playerGroup;
let velocityY = 0;
let isGrounded = true;
const speed = 0.15;

// Клавиатура
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
  keys[e.code] = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
  keys[e.code] = false;
});

// Мышь
let isPointerLocked = false;
let euler = { x: 0, y: 0 };

export function initControls() {
  document.addEventListener('click', () => {
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

  // Глаза
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

  // Телепорт на корабль
  const spawn = teleportToShip();
  if (spawn) {
    playerPos.x = spawn.x;
    playerPos.z = spawn.z;
  }

  playerGroup.position.set(playerPos.x, playerPos.y, playerPos.z);
  initControls();
}

export function updatePlayer() {
  // Направление
  const forward = new THREE.Vector3(0, 0, -1);
  forward.applyQuaternion(camera.quaternion);
  forward.y = 0;
  forward.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(forward, camera.up).normalize();

  let moveX = 0, moveZ = 0;
  if (keys['w'] || keys['arrowup']) moveZ += 1;
  if (keys['s'] || keys['arrowdown']) moveZ -= 1;
  if (keys['a'] || keys['arrowleft']) moveX -= 1;
  if (keys['d'] || keys['arrowright']) moveX += 1;

  let moved = false;
  if (Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05) {
    const len = Math.hypot(moveX, moveZ);
    moveX /= len;
    moveZ /= len;

    const dx = (forward.x * moveZ + right.x * moveX) * speed;
    const dz = (forward.z * moveZ + right.z * moveX) * speed;

    playerPos.x += dx;
    playerPos.z += dz;
    moved = true;
    const angle = Math.atan2(moveX, moveZ);
    playerGroup.rotation.y = angle;
  }

  // Прыжок
  let jump = keys['space'] || keys['Space'];
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

  // Камера
  const offset = new THREE.Vector3(0, 2.5, 6);
  offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), euler.y);
  offset.x += playerPos.x;
  offset.y += playerPos.y;
  offset.z += playerPos.z;

  camera.position.lerp(offset, 0.1);
  camera.lookAt(playerPos.x, playerPos.y + 1.5, playerPos.z);
}

export function getPlayerPos() {
  return playerPos;
}
