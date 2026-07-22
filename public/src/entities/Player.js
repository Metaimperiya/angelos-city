// ============================================================
// ИГРОК (Управление + Камера)
// ============================================================

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { scene, camera } from '../core/scene.js';
import { sendMove, remoteMeshes } from '../network/socket.js';

export let playerPos = { x: 0, y: 0, z: 0 };
export let playerGroup;

const speed = 0.15;
const keys = {};

// Настройки камеры
let cameraRotation = { x: 0, y: 0 };
const mouseSensitivity = 0.002;

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

  // Слушатели клавиш
  window.addEventListener('keydown', (e) => { keys[e.code] = true; });
  window.addEventListener('keyup', (e) => { keys[e.code] = false; });

  // Включение за хвата мыши для вращения камеры
  document.body.addEventListener('click', () => {
    if (document.pointerLockElement !== document.body) {
      document.body.requestPointerLock();
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === document.body) {
      cameraRotation.y -= e.movementX * mouseSensitivity;
      cameraRotation.x -= e.movementY * mouseSensitivity;
      cameraRotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraRotation.x));
    }
  });
}

export function updatePlayer() {
  if (!playerGroup) return;

  let moveX = 0;
  let moveZ = 0;

  if (keys['KeyW'] || keys['ArrowUp']) moveZ -= 1;
  if (keys['KeyS'] || keys['ArrowDown']) moveZ += 1;
  if (keys['KeyA'] || keys['ArrowLeft']) moveX -= 1;
  if (keys['KeyD'] || keys['ArrowRight']) moveX += 1;

  if (moveX !== 0 || moveZ !== 0) {
    // Движение относительно поворота камеры
    const dir = new THREE.Vector3(moveX, 0, moveZ).normalize();
    dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraRotation.y);

    playerGroup.position.x += dir.x * speed;
    playerGroup.position.z += dir.z * speed;
    playerGroup.rotation.y = cameraRotation.y;

    playerPos.x = playerGroup.position.x;
    playerPos.z = playerGroup.position.z;

    // Отправляем движения на сервер
    sendMove(playerPos.x, playerPos.z, playerGroup.rotation.y);
  }

  // Камера следит за игроком
  const cameraOffset = new THREE.Vector3(0, 3, 7);
  cameraOffset.applyAxisAngle(new THREE.Vector3(1, 0, 0), cameraRotation.x);
  cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraRotation.y);

  camera.position.copy(playerGroup.position).add(cameraOffset);
  camera.lookAt(playerGroup.position.x, playerGroup.position.y + 1, playerGroup.position.z);
}

// Вспомогательная функция для спавна ДРУГИХ игроков
export function createRemotePlayerMesh(color = 0xff0055) {
  const group = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.6), mat);
  mesh.position.y = 0.7;
  group.add(mesh);
  scene.add(group);
  return group;
}
