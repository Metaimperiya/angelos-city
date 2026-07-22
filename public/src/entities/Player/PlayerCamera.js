// ============================================================
// КАМЕРА ОТ ТРЕТЬЕГО ЛИЦА
// ============================================================

import * as THREE from 'three';

export const PlayerCamera = {
  camera: null,
  euler: { x: 0, y: 0 },
  sensitivity: 0.002,

  init(camera) {
    this.camera = camera;
    this.camera.rotation.order = 'YXZ';
  },

  update(playerPos, input) {
    this.euler.y -= input.mouseX * this.sensitivity;
    this.euler.x -= input.mouseY * this.sensitivity;

    if (Math.abs(input.touchLookX) > 2 || Math.abs(input.touchLookY) > 2) {
      this.euler.y -= input.touchLookX * this.sensitivity * 2.5;
      this.euler.x -= input.touchLookY * this.sensitivity * 2.5;
    }

    this.euler.x = Math.max(-1.2, Math.min(1.2, this.euler.x));

    this.camera.rotation.x = this.euler.x;
    this.camera.rotation.y = this.euler.y;

    const offset = new THREE.Vector3(0, 2.5, 6);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.euler.y);
    offset.x += playerPos.x;
    offset.y += playerPos.y;
    offset.z += playerPos.z;

    this.camera.position.lerp(offset, 0.1);
    this.camera.lookAt(playerPos.x, playerPos.y + 1.5, playerPos.z);
  }
};
