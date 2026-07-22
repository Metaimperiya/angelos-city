// ============================================================
// КАМЕРА ОТ ТРЕТЬЕГО ЛИЦА
// ============================================================

import * as THREE from 'three';

export const PlayerCamera = {
  camera: null,
  euler: { x: 0.2, y: 0 },
  sensitivity: 0.0025,
  distance: 6,

  init(camera) {
    this.camera = camera;
  },

  update(playerPos, input) {
    // Вращение от мыши
    this.euler.y -= input.mouseX * this.sensitivity;
    this.euler.x -= input.mouseY * this.sensitivity;

    // Вращение от тача
    if (Math.abs(input.touchLookX) > 0.1 || Math.abs(input.touchLookY) > 0.1) {
      this.euler.y -= input.touchLookX * this.sensitivity * 2;
      this.euler.x -= input.touchLookY * this.sensitivity * 2;
    }

    // Ограничение наклона вверх/вниз (чтобы камера не переворачивалась)
    this.euler.x = Math.max(-0.6, Math.min(1.2, this.euler.x));

    // Сферические координаты орбиты камеры вокруг игрока
    const horizDist = this.distance * Math.cos(this.euler.x);
    const vertDist = this.distance * Math.sin(this.euler.x);

    const targetY = playerPos.y + 1.5;

    const targetCamPos = new THREE.Vector3(
      playerPos.x + horizDist * Math.sin(this.euler.y),
      targetY + vertDist,
      playerPos.z + horizDist * Math.cos(this.euler.y)
    );

    this.camera.position.lerp(targetCamPos, 0.2);
    this.camera.lookAt(playerPos.x, targetY, playerPos.z);
  }
};
