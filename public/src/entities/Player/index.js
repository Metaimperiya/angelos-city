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

export function setDelta(d) {
  delta = d;
}

export function createPlayer() {
  playerGroup = new THREE.Group();

  // Визуальная заглушка персонажа (капсула/бокс)
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshLambertMaterial({ color: 0x00ff88 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 1; 
  mesh.castShadow = true;

  playerGroup.add(mesh);
  playerGroup.position.set(playerPos.x, playerPos.y, playerPos.z);

  scene.add(playerGroup);

  PlayerController.init(playerGroup, playerPos);
}

export function initControls() {
  initInputControls(); // Инициализация клавиш (WASD + touch)
  PlayerCamera.init(camera); // Инициализация мыши/камеры
}

export function updatePlayer() {
  if (!playerGroup) return;

  const input = getInput();
  const moved = PlayerController.update(input, delta);

  PlayerCamera.update(playerPos, input);

  // Отправка позиции по сокетам
  if (moved || !PlayerController.isGrounded) {
    sendPosition(playerPos.x, playerPos.y, playerPos.z, PlayerController.getRotation());
  }
}
