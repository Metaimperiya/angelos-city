// ============================================================
// ВВОД (КЛАВИАТУРА + МЫШЬ + ТЕЛЕФОН)
// ============================================================

import { renderer } from '../../core/scene.js';

export const PlayerInput = {
  keys: {},
  mouse: { x: 0, y: 0, locked: false },
  touch: { move: { x: 0, y: 0 }, look: { x: 0, y: 0 } },
  jump: false,

  init() {
    // Клавиатура
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      this.keys[e.code] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.keys[e.code] = false;
    });

    // Мышь
    renderer.domElement.addEventListener('click', () => {
      renderer.domElement.requestPointerLock();
    });
    document.addEventListener('pointerlockchange', () => {
      this.mouse.locked = document.pointerLockElement === renderer.domElement;
    });
    document.addEventListener('mousemove', (e) => {
      if (!this.mouse.locked) return;
      this.mouse.x += e.movementX;
      this.mouse.y += e.movementY;
    });

    // Телефон
    this.initTouchControls();
  },

  initTouchControls() {
    const moveZone = document.createElement('div');
    moveZone.style.cssText = 'position:absolute;top:0;left:0;width:75%;height:100%;z-index:40;touch-action:none;';
    document.body.appendChild(moveZone);

    const lookZone = document.createElement('div');
    lookZone.style.cssText = 'position:absolute;top:0;right:0;width:25%;height:100%;z-index:40;touch-action:none;';
    document.body.appendChild(lookZone);

    let moveId = null, lookId = null;
    let lastMove = { x: 0, y: 0 }, lastLook = { x: 0, y: 0 };

    moveZone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      moveId = t.identifier;
      lastMove = { x: t.clientX, y: t.clientY };
      this.touch.move = { x: 0, y: 0 };
    });

    moveZone.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (t.identifier === moveId) {
          this.touch.move.x = t.clientX - lastMove.x;
          this.touch.move.y = t.clientY - lastMove.y;
          lastMove = { x: t.clientX, y: t.clientY };
        }
      }
    });

    moveZone.addEventListener('touchend', (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === moveId) {
          moveId = null;
          this.touch.move = { x: 0, y: 0 };
        }
      }
    });

    moveZone.addEventListener('touchcancel', () => {
      moveId = null;
      this.touch.move = { x: 0, y: 0 };
    });

    lookZone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      lookId = t.identifier;
      lastLook = { x: t.clientX, y: t.clientY };
      this.touch.look = { x: 0, y: 0 };
    });

    lookZone.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (t.identifier === lookId) {
          this.touch.look.x += t.clientX - lastLook.x;
          this.touch.look.y += t.clientY - lastLook.y;
          lastLook = { x: t.clientX, y: t.clientY };
        }
      }
    });

    lookZone.addEventListener('touchend', (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === lookId) {
          lookId = null;
          this.touch.look = { x: 0, y: 0 };
        }
      }
    });

    lookZone.addEventListener('touchcancel', () => {
      lookId = null;
      this.touch.look = { x: 0, y: 0 };
    });

    const jumpBtn = document.getElementById('jump-btn');
    if (jumpBtn) {
      jumpBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.jump = true;
        jumpBtn.style.transform = 'scale(0.92)';
        jumpBtn.style.background = 'rgba(255, 0, 127, 0.4)';
      });
      jumpBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.jump = false;
        jumpBtn.style.transform = 'scale(1)';
        jumpBtn.style.background = 'rgba(255, 0, 127, 0.25)';
      });
      jumpBtn.addEventListener('touchcancel', () => {
        this.jump = false;
        jumpBtn.style.transform = 'scale(1)';
        jumpBtn.style.background = 'rgba(255, 0, 127, 0.25)';
      });
    }
  },

  getInput() {
    const moveX = (this.keys['w'] || this.keys['arrowup']) ? 1 : 0
               - (this.keys['s'] || this.keys['arrowdown']) ? 1 : 0;
    const moveZ = (this.keys['a'] || this.keys['arrowleft']) ? 1 : 0
               - (this.keys['d'] || this.keys['arrowright']) ? 1 : 0;

    // Добавляем телефон
    const tx = this.touch.move.x * 0.02;
    const tz = this.touch.move.y * 0.02;

    return {
      moveX: moveX + tx,
      moveZ: moveZ + tz,
      mouseX: this.mouse.x,
      mouseY: this.mouse.y,
      touchLookX: this.touch.look.x,
      touchLookY: this.touch.look.y,
      jump: this.keys['space'] || this.keys['Space'] || this.jump,
      moved: Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05 || Math.abs(tx) > 0.05 || Math.abs(tz) > 0.05
    };
  },

  resetMouse() {
    this.mouse.x = 0;
    this.mouse.y = 0;
  }
};
