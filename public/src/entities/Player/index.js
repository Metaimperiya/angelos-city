// ============================================================
// ИГРОК (СБОРКА)
// ============================================================

import * as THREE from 'three';
import { scene, camera } from '../../core/scene.js';
import { teleportToShip } from '../Ship.js';
import { getInput, initControls } from './PlayerInput.js';
import { sendPosition } from '../../network/sync.js';

export let playerPos = new THREE.Vector3(0, 15, -15);
let playerGroup;
let delta = 0;

export function setDelta(d) { delta = d; }

export function createPlayer() {
  playerGroup = new THREE.Group();
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshLambertMaterial({ color: 0x00ff88 })
  );
  mesh.position.y = 1;
  mesh.castShadow = true;
  playerGroup.add(mesh);
  playerGroup.position.copy(playerPos);
  scene.add(playerGroup);
}

export function initControlsWrapper() {
  initControls();
}

export function updatePlayer() {
  if (!playerGroup) return;

  const input = getInput();
  const speed = 6 * delta;

  // Движение
  playerPos.x += input.moveX * speed;
  playerPos.z += input.moveZ * speed;

  // Привязка к кораблю
  const shipPos = teleportToShip();
  if (shipPos) {
    // Если нужно привязать к кораблю — добавим позже
  }

  playerGroup.position.copy(playerPos);

  // Отправка позиции на сервер
  sendPosition(playerPos.x, playerPos.y, playerPos.z);
}
