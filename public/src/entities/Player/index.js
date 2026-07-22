// ============================================================
// ИГРОК (ЭКСПОРТ, ИНИЦИАЛИЗАЦИЯ И СИНХРОНИЗАЦИЯ C КАМЕРОЙ)
// ============================================================

import * as THREE from 'three';
import { scene, camera } from '../../core/scene.js';
import { PlayerController } from './PlayerController.js';
import { PlayerCamera } from './PlayerCamera.js';
import { getInput, initControls as initInputControls } from './PlayerInput.js';
import { sendPosition } from '../../network/sync.js';

export let playerGroup = null;
export let playerPos = { x: 0, y: 15, z: -15 };
let delta = 0.016;

let prevPos = { x: 0, y: 0, z: 0 };
const EPSILON = 0.001;

export function setDelta(d) {
  delta = d;
}

export function resetSyncPosition() {
  prevPos.x = playerPos.x;
  prevPos.y = playerPos.y;
  prevPos.z = playerPos.z;
}

export function createPlayer() {
  playerGroup = new THREE.Group();

  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshLambertMaterial({ color: 0x00ff88 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 1;
  mesh.castShadow = true;

  playerGroup.add(mesh);
  playerGroup.position.set(playerPos.x, playerPos.y, playerPos.z);

  scene.add(playerGroup);

  PlayerController.init(playerGroup, playerPos);

  // Сброс синхронизации после создания
  resetSyncPosition();
}

export function initControls() {
  initInputControls();
  PlayerCamera.init(camera);
}

export function updatePlayer() {
  if (!playerGroup) return;

  const input = getInput();
  PlayerController.update(input, delta);
  PlayerCamera.update(playerPos, input);

  const hasMoved =
    Math.abs(playerPos.x - prevPos.x) > EPSILON ||
    Math.abs(playerPos.y - prevPos.y) > EPSILON ||
    Math.abs(playerPos.z - prevPos.z) > EPSILON;

  if (hasMoved) {
    sendPosition(playerPos.x, playerPos.y, playerPos.z, PlayerController.getRotation());

    prevPos.x = playerPos.x;
    prevPos.y = playerPos.y;
    prevPos.z = playerPos.z;
  }
}
