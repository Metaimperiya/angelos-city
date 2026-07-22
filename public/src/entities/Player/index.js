// ============================================================
// УНИВЕРСАЛЬНЫЙ МОДУЛЬ ВВОДА (Клавиатура + Мобильный тач)
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
