// ============================================================
// ИГРОК И КАМЕРА
// ============================================================

import * as THREE from 'three';
import { scene, camera } from '../../core/scene.js';
import { getInput, initControls } from './PlayerInput.js';

export { initControls };

export let playerMesh = null;
let delta = 0.016;

export function setDelta(d) {
  delta = d;
}

export function createPlayer() {
  if (playerMesh) return playerMesh;

  const group = new THREE.Group();
  
  // Тело игрока
  const bodyGeo = new THREE.BoxGeometry(1, 2, 1);
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0x00ff88 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 1;
  body.castShadow = true;
  group.add(body);

  group.position.set(0, 2, 0);
  scene.add(group);
  playerMesh = group;

  console.log('👤 Игрок создан в точке (0, 2, 0)');
  return playerMesh;
}

export function updatePlayer() {
  if (!playerMesh) return;

  const input = getInput();
  const speed = 10 * delta;

  // Движение
  if (input.moveX !== 0 || input.moveZ !== 0) {
    playerMesh.position.x += input.moveX * speed;
    playerMesh.position.z -= input.moveZ * speed;
    playerMesh.rotation.y = Math.atan2(input.moveX, input.moveZ);
  }

  // Слежение камеры без пропадания координат
  if (!isNaN(playerMesh.position.x)) {
    camera.position.x = playerMesh.position.x;
    camera.position.y = playerMesh.position.y + 8;
    camera.position.z = playerMesh.position.z + 20;
    camera.lookAt(playerMesh.position.x, playerMesh.position.y + 1, playerMesh.position.z);
  }
}
