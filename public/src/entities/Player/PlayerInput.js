// ============================================================
// ВВОД (КЛАВИАТУРА + МОБИЛЬНЫЙ ДЖОЙСТИК)
// ============================================================

export const inputState = {
  moveX: 0,
  moveZ: 0,
  jump: false
};

const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false
};

// Джойстик
let joystickTouchId = null;
let joystickOrigin = { x: 0, y: 0 };
let joystickMove = { x: 0, y: 0 };
const JOYSTICK_RADIUS = 50;

function updateInputState() {
  let kbX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  let kbZ = (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0);

  let finalX = kbX + joystickMove.x;
  let finalZ = kbZ + joystickMove.y;

  inputState.moveX = Math.max(-1, Math.min(1, finalX));
  inputState.moveZ = Math.max(-1, Math.min(1, finalZ));
  inputState.jump = keys.jump;
}

function handleKey(e, isPressed) {
  if (document.activeElement?.tagName === 'INPUT') return;

  switch (e.code) {
    case 'KeyW': case 'ArrowUp': keys.forward = isPressed; break;
    case 'KeyS': case 'ArrowDown': keys.backward = isPressed; break;
    case 'KeyA': case 'ArrowLeft': keys.left = isPressed; break;
    case 'KeyD': case 'ArrowRight': keys.right = isPressed; break;
    case 'Space': keys.jump = isPressed; break;
  }
  updateInputState();
}

export function initControls() {
  window.addEventListener('keydown', (e) => handleKey(e, true));
  window.addEventListener('keyup', (e) => handleKey(e, false));

  // Джойстик
  const zone = document.getElementById('joystick-zone');
  const knob = document.getElementById('joystick-knob');
  if (!zone || !knob) return;

  zone.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    joystickTouchId = touch.identifier;
    const rect = zone.getBoundingClientRect();
    joystickOrigin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  });

  window.addEventListener('touchmove', (e) => {
    if (joystickTouchId === null) return;
    for (const touch of e.changedTouches) {
      if (touch.identifier === joystickTouchId) {
        let dx = touch.clientX - joystickOrigin.x;
        let dy = touch.clientY - joystickOrigin.y;
        const dist = Math.hypot(dx, dy);
        if (dist > JOYSTICK_RADIUS) { dx *= JOYSTICK_RADIUS / dist; dy *= JOYSTICK_RADIUS / dist; }
        knob.style.transform = `translate(${dx}px, ${dy}px)`;
        joystickMove.x = dx / JOYSTICK_RADIUS;
        joystickMove.y = -dy / JOYSTICK_RADIUS;
        updateInputState();
        break;
      }
    }
  });

  const resetJoystick = () => {
    joystickTouchId = null;
    joystickMove.x = 0; joystickMove.y = 0;
    if (knob) knob.style.transform = 'translate(0px, 0px)';
    updateInputState();
  };

  window.addEventListener('touchend', (e) => {
    for (const touch of e.changedTouches) {
      if (touch.identifier === joystickTouchId) resetJoystick();
    }
  });
  window.addEventListener('touchcancel', resetJoystick);
}

export function getInput() {
  return inputState;
}
