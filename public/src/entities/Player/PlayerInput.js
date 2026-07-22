// ============================================================
// ВВОД (КЛАВИАТУРА, МЫШЬ, ТЕЛЕФОН)
// ============================================================

import { renderer } from '../../core/scene.js';

export const PlayerInput = {
  keys: {},
  mouseX: 0,
  mouseY: 0,
  mouseLocked: false,
  touchMove: { x: 0, y: 0 },
  touchLook: { x: 0, y: 0 },
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

    // МЫШЬ — ЭТА ЧАСТЬ ОТВЕЧАЕТ ЗА ЗАХВАТ И ДВИЖЕНИЕ
    renderer.domElement.addEventListener('click', () => {
      renderer.domElement.requestPointerLock();
    });
    document.addEventListener('pointerlockchange', () => {
      this.mouseLocked = document.pointerLockElement === renderer.domElement;
    });
    document.addEventListener('mousemove', (e) => {
      if (!this.mouseLocked) return;
      this.mouseX += e.movementX;
      this.mouseY += e.movementY;
    });

    // Телефон
    this.initTouch();
  },

  initTouch() {
    const moveZone = document.createElement('div');
    moveZone.style.cssText = 'position:absolute;top:0;left:0;width:75%;height:100%;z-index:40;touch-action:none;';
    document.body.appendChild(moveZone);

    const lookZone = document.createElement('div');
    lookZone.style.cssText = 'position:absolute;top:0;right:0;width:25%;height:100%;z-index:40;touch-action:none;';
    document.body.appendChild(lookZone);

    let moveId = null, lookId = null;
    let lastMove = { x: 0, y: 0 };
    let lastLook = { x: 0, y: 0 };

    moveZone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      moveId = t.identifier;
      lastMove = { x: t.clientX, y: t.clientY };
      this.touchMove = { x: 0, y: 0 };
    });

    moveZone.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (t.identifier === moveId) {
          this.touchMove.x = t.clientX - lastMove.x;
          this.touchMove.y = t.clientY - lastMove.y;
          lastMove = { x: t.clientX, y: t.clientY };
        }
      }
    });

    moveZone.addEventListener('touchend', (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === moveId) {
          moveId = null;
          this.touchMove = { x: 0, y: 0 };
        }
      }
    });

    moveZone.addEventListener('touchcancel', () => {
      moveId = null;
      this.touchMove = { x: 0, y: 0 };
    });

    lookZone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      lookId = t.identifier;
      lastLook = { x: t.clientX, y: t.clientY };
      this.touchLook = { x: 0, y: 0 };
    });

    lookZone.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (t.identifier === lookId) {
          this.touchLook.x += t.clientX - lastLook.x;
          this.touchLook.y += t.clientY - lastLook.y;
          lastLook = { x: t.clientX, y: t.clientY };
        }
      }
    });

    lookZone.addEventListener('touchend', (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === lookId) {
          lookId = null;
          this.touchLook = { x: 0, y: 0 };
        }
      }
    });

    lookZone.addEventListener('touchcancel', () => {
      lookId = null;
      this.touchLook = { x: 0, y: 0 };
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

    const tx = this.touchMove.x * 0.02;
    const tz = this.touchMove.y * 0.02;

    const result = {
      moveX: moveX + tx,
      moveZ: moveZ + tz,
      mouseX: this.mouseX,
      mouseY: this.mouseY,
      touchLookX: this.touchLook.x,
      touchLookY: this.touchLook.y,
      jump: this.keys['space'] || this.keys['Space'] || this.jump,
      moved: Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05 || Math.abs(tx) > 0.05 || Math.abs(tz) > 0.05
    };

    // ⬇️ ЭТА СТРОЧКА СБРАСЫВАЕТ НАКОПЛЕНИЕ МЫШИ, ЧТОБЫ ОНА НЕ УЛЕТАЛА
    this.resetMouse();

    return result;
  },

  resetMouse() {
    this.mouseX = 0;
    this.mouseY = 0;
  }
};
