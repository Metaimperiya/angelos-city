// ============================================================
// ЕДИНЫЙ МОДУЛЬ ВВОДА (КЛАВИАТУРА + МОБИЛЬНЫЙ ДЖОЙСТИК)
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

// Переменные для мобильного джойстика
let joystickTouchId = null;
let joystickOrigin = { x: 0, y: 0 };
let joystickMove = { x: 0, y: 0 };
const JOYSTICK_RADIUS = 50; // Радиус хода джойстика в px

// --- 1. КЛАВИАТУРА ---
function handleKey(e, isPressed) {
  if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
    return;
  }

  const code = e.code;
  let handled = true;

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
    default:
      handled = false;
      break;
  }

  if (handled && e.cancelable) {
    e.preventDefault();
  }

  updateInputState();
}

// --- 2. ОБНОВЛЕНИЕ ОБЩЕГО СОСТОЯНИЯ ---
function updateInputState() {
  // Клавиатурный вектор
  let kbX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  let kbZ = (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0);

  // Суммируем с мобильным джойстиком (если он активен)
  let finalX = kbX + joystickMove.x;
  let finalZ = kbZ + joystickMove.y;

  // Ограничиваем вектор от -1 до 1
  inputState.moveX = Math.max(-1, Math.min(1, finalX));
  inputState.moveZ = Math.max(-1, Math.min(1, finalZ));
  inputState.jump = keys.jump;
}

export function resetInput() {
  keys.forward = keys.backward = keys.left = keys.right = keys.jump = false;
  joystickMove.x = 0;
  joystickMove.y = 0;
  joystickTouchId = null;
  updateInputState();
}

// --- 3. ИНИЦИАЛИЗАЦИЯ (КЛАВА + ТАЧ-СОБЫТИЯ) ---
export function initControls() {
  // Инициализация клавиатуры
  window.addEventListener('keydown', (e) => handleKey(e, true));
  window.addEventListener('keyup', (e) => handleKey(e, false));
  window.addEventListener('blur', resetInput);

  // Настройка тач-управления для мобилок
  setupTouchControls();
}

function setupTouchControls() {
  const joystickZone = document.getElementById('joystick-zone');
  const joystickKnob = document.getElementById('joystick-knob');
  const jumpBtn = document.getElementById('jump-btn');

  // Сенсорная кнопка прыжка
  if (jumpBtn) {
    jumpBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      keys.jump = true;
      updateInputState();
    }, { passive: false });

    jumpBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      keys.jump = false;
      updateInputState();
    }, { passive: false });
  }

  // Виртуальный джойстик
  if (joystickZone && joystickKnob) {
    joystickZone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      joystickTouchId = touch.identifier;

      const rect = joystickZone.getBoundingClientRect();
      joystickOrigin = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (joystickTouchId === null) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === joystickTouchId) {
          let dx = touch.clientX - joystickOrigin.x;
          let dy = touch.clientY - joystickOrigin.y;

          let dist = Math.hypot(dx, dy);
          if (dist > JOYSTICK_RADIUS) {
            dx = (dx / dist) * JOYSTICK_RADIUS;
            dy = (dy / dist) * JOYSTICK_RADIUS;
          }

          // Визуальное смещение стика
          joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;

          // Переводим смещение в диапазон [-1, 1]
          // dx — это влево/вправо (moveX), dy — это вперед/назад (moveZ, поэтому инвертируем)
          joystickMove.x = dx / JOYSTICK_RADIUS;
          joystickMove.y = -dy / JOYSTICK_RADIUS; 

          updateInputState();
          break;
        }
      }
    }, { passive: false });

    const stopJoystick = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joystickTouchId) {
          joystickTouchId = null;
          joystickMove.x = 0;
          joystickMove.y = 0;
          if (joystickKnob) {
            joystickKnob.style.transform = 'translate(0px, 0px)';
          }
          updateInputState();
          break;
        }
      }
    };

    window.addEventListener('touchend', stopJoystick);
    window.addEventListener('touchcancel', stopJoystick);
  }
}

export function getInput() {
  return inputState;
}
