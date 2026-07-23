import * as THREE from 'three';

// ============================================================
// ЕДИНЫЙ ПОЛНЫЙ МОДУЛЬ ИГРОКА (Управление + Позиция + Корабль)
// ============================================================

const inputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  run: false
};

// Экспортируем функцию получения состояния ввода
export function getInput() {
  return inputState;
}

// Экспортируем позицию игрока, которую ждёт Ship.js (убирает ошибку импорта)
export const playerPos = new THREE.Vector3(0, 5, -15);

// Инициализация слушателей клавиатуры
export function initControls() {
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

  console.log('✅ Модуль игрока и ввода полностью инициализирован.');
}

// Автоматически запускаем контроллер при старте
initControls();

// Главная функция обновления игрока в игровом цикле
export function updatePlayer(delta, shipContainer) {
  const moveSpeed = 6.0 * delta;

  // Изменяем локальные координаты на основе нажатых клавиш
  if (inputState.forward) {
    playerPos.z -= moveSpeed;
  }
  if (inputState.backward) {
    playerPos.z += moveSpeed;
  }
  if (inputState.left) {
    playerPos.x -= moveSpeed;
  }
  if (inputState.right) {
    playerPos.x += moveSpeed;
  }

  // Главная магия: переводим локальные координаты палубы в мировые с учётом движения корабля
  if (shipContainer) {
    shipContainer.localToWorld(playerPos);
  }
}
