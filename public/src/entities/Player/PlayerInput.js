export class PlayerInput {
  constructor() {
    this.keys = {
      forward: false,  // W
      backward: false, // S
      left: false,     // A
      right: false     // D
    };
    
    this.mouseDelta = { x: 0, y: 0 };
    this.initListeners();
  }

  initListeners() {
    // Нажатия клавиш
    window.addEventListener('keydown', (e) => this.handleKey(e.code, true));
    window.addEventListener('keyup', (e) => this.handleKey(e.code, false));

    // Лок мыши при клике на экран
    window.addEventListener('click', () => {
      if (document.pointerLockElement !== document.body) {
        document.body.requestPointerLock();
      }
    });

    // Движение мыши (работает только при активном Pointer Lock)
    window.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === document.body) {
        this.mouseDelta.x += e.movementX;
        this.mouseDelta.y += e.movementY;
      }
    });
  }

  handleKey(code, isPressed) {
    switch (code) {
      case 'KeyW':
        this.keys.forward = isPressed;
        break;
      case 'KeyS':
        this.keys.backward = isPressed;
        break;
      case 'KeyA':
        this.keys.left = isPressed;
        break;
      case 'KeyD':
        this.keys.right = isPressed;
        break;
    }
  }

  // Забираем и сбрасываем дельту мыши за кадр
  getAndResetMouseDelta() {
    const delta = { ...this.mouseDelta };
    this.mouseDelta.x = 0;
    this.mouseDelta.y = 0;
    return delta;
  }
}
