import * as THREE from 'three';

// ============================================================
// ПОЛНЫЙ МОДУЛЬ ИГРОКА И ВВОДА (Клавиатура + Позиция для корабля)
// ============================================================

const inputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  run: false
};

export function getInput() {
  return inputState;
}

// Экспортируем позицию, которую ждёт Ship.js, чтобы убрать ошибку импорта
export const playerPos = new THREE.Vector3(0, 5, -15);

export function initControls() {
  // Обработка клавиатуры (layout-agnostic через e.code)
  window.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        inputState.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        inputState.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        inputState.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        inputState.right = true;
        break;
      case 'Space':
        inputState.jump = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        inputState.run = true;
        break;
    }
  });

  window.addEventListener('keyup', (e) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        inputState.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        inputState.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        inputState.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        inputState.right = false;
        break;
      case 'Space':
        inputState.jump = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        inputState.run = false;
        break;
    }
  });

  console.log('✅ Модуль ввода (PlayerInput) успешно инициализирован.');
}

// Автоматически запускаем опрос клавиш при загрузке модуля
initControls();

export function updatePlayer(delta, shipContainer) {
  const moveSpeed = 6.0 * delta;

  if (inputState.forward) playerPos.z -= moveSpeed;
  if (inputState.backward) playerPos.z += moveSpeed;
  if (inputState.left) playerPos.x -= moveSpeed;
  if (inputState.right) playerPos.x += moveSpeed;

  // Если передан контейнер корабля, применяем трансформацию localToWorld
  if (shipContainer) {
    shipContainer.localToWorld(playerPos);
  }
}
