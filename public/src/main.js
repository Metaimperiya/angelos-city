import * as THREE from 'three';
import { scene } from '../../core/scene.js';

// ============================================================
// МОДУЛЬ ИГРОКА (Точно под сигнатуры из main.js)
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
let playerMesh = null;

export function getInput() {
  return inputState;
}

// Принимает дельту из главного цикла анимации
export function setDelta(delta) {
  if (delta !== undefined) {
    currentDelta = delta;
  }
}

export const playerPos = new THREE.Vector3(0, 5, -15);

export function initControls() {
  // Защита от повторной навески слушателей
  if (window._controlsInitialized) return;
  window._controlsInitialized = true;

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

  console.log('✅ Управление игроком инициализировано');
}

// Вызывается в main.js как createPlayer() без аргументов
export function createPlayer() {
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  playerMesh = new THREE.Mesh(geometry, material);
  
  playerMesh.position.copy(playerPos);
  
  if (scene) {
    scene.add(playerMesh);
    console.log('🟢 Игрок успешно добавлен на сцену');
  } else {
    console.error('❌ Ошибка: Сцена не найдена для создания игрока!');
  }
  
  return playerMesh;
}

// Вызывается в main.js как updatePlayer() без аргументов в цикле animate()
export function updatePlayer() {
  const delta = currentDelta || 0.016;
  const moveSpeed = 6.0 * delta;

  if (inputState.forward) playerPos.z -= moveSpeed;
  if (inputState.backward) playerPos.z += moveSpeed;
  if (inputState.left) playerPos.x -= moveSpeed;
  if (inputState.right) playerPos.x += moveSpeed;

  // Синхронизируем визуальный меш с позицией
  if (playerMesh) {
    playerMesh.position.copy(playerPos);
  }
}
