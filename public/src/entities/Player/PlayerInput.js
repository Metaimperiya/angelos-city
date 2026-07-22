// ============================================================
// ВВОД (ПОЛНЫЙ ФАЙЛ — РАБОТАЕТ НА ЛЮБОЙ РАСКЛАДКЕ + СТРЕЛКИ)
// ============================================================

export const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false
};

export const inputState = {
  moveX: 0,
  moveZ: 0,
  jump: false
};

function handleKey(code, isPressed) {
  // e.code реагирует на ФИЗИЧЕСКУЮ КНОПКУ, ему пофиг RU или EN раскладка!
  switch (code) {
    case 'KeyW':
    case 'ArrowUp':
      keys.forward = isPressed;
      break;
    case 'KeyS':
    case 'ArrowDown':
      keys.backward = isPressed;
      break;
    case 'KeyA':
    case 'ArrowLeft':
      keys.left = isPressed;
      break;
    case 'KeyD':
    case 'ArrowRight':
      keys.right = isPressed;
      break;
    case 'Space':
      keys.jump = isPressed;
      break;
  }

  // Считаем вектор движения
  inputState.moveX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  inputState.moveZ = (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0);
  inputState.jump = keys.jump;
}

export function initControls() {
  window.addEventListener('keydown', (e) => handleKey(e.code, true));
  window.addEventListener('keyup', (e) => handleKey(e.code, false));

  // Если свернул окно — сбрасываем нажатия, чтобы персонаж не бежал сам
  window.addEventListener('blur', () => {
    keys.forward = keys.backward = keys.left = keys.right = keys.jump = false;
    inputState.moveX = inputState.moveZ = 0;
    inputState.jump = false;
  });
}

export function getInput() {
  return inputState;
}
