import * as THREE from 'three';

// ============================================================
// ЕДИНЫЙ ПОЛНЫЙ МОДУЛЬ ИГРОКА (Управление + Delta + Корабль)
// ============================================================

const inputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  run: false
};

let currentDelta = 0;

export function getInput() {
  return inputState;
}

// Функция, которую ждёт main.js для передачи времени кадра
export function setDelta(delta) {
  currentDelta = delta;
}

// Экспортируем позицию игрока для Ship.js
export const playerPos = new THREE.Vector3(0, 5, -15);

export function initControls() {
  window.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp': inputState.forward = true; break;
      case 'KeyS': case 'ArrowDown': inputState.backward = true; break;
      case 'KeyA': case 'ArrowLeft': inputState.left = true; break;
      case 'KeyD': case 'ArrowRight': inputState.right = true; break;
      case 'Space': inputState.jump = true; break;
      case 'ShiftLeft': case 'ShiftRight': inputState.run = true; break;
    }
  });

  window.addEventListener('keyup', (e) => {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp': inputState.forward = false; break;
      case 'KeyS': case 'ArrowDown': inputState.backward = false; break;
      case 'KeyA': case 'ArrowLeft': inputState.left = false; break;
      case 'KeyD': case 'ArrowRight': inputState.right = false; break;
      case 'Space': inputState.jump = false; break;
      case 'ShiftLeft': case 'ShiftRight': inputState.run = false; break;
    }
  });
}

// Запускаем слушатели управления
initControls();

export function createPlayer(scene) {
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const playerMesh = new THREE.Mesh(geometry, material);
  
  playerMesh.position.copy(playerPos);
  if (scene) {
    scene.add(playerMesh);
  }
  
  return playerMesh;
}

export function updatePlayer(shipContainer, playerMesh) {
  const delta = currentDelta || 0.016;
  const moveSpeed = 6.0 * delta;

  if (inputState.forward) playerPos.z -= moveSpeed;
  if (inputState.backward) playerPos.z += moveSpeed;
  if (inputState.left) playerPos.x -= moveSpeed;
  if (inputState.right) playerPos.x += moveSpeed;

  // Привязка к движущемуся кораблю через localToWorld
  if (shipContainer) {
    shipContainer.localToWorld(playerPos);
  }

  // Синхронизируем позицию меша с математической позицией
  if (playerMesh) {
    playerMesh.position.copy(playerPos);
  }
}
