import * as THREE from 'three';

export class PlayerCamera {
  constructor(camera) {
    this.camera = camera;
    this.yaw = 0;   // Поворот вокруг оси Y
    this.pitch = 0; // Поворот вокруг оси X
    this.sensitivity = 0.002; // Чувствительность мыши
  }

  update(mouseDelta) {
    if (mouseDelta.x === 0 && mouseDelta.y === 0) return;

    this.yaw -= mouseDelta.x * this.sensitivity;
    this.pitch -= mouseDelta.y * this.sensitivity;

    // Ограничиваем взгляд вверх/вниз, чтобы камера не выворачивалась наизнанку
    const maxPitch = Math.PI / 2 - 0.01;
    this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

    // Применяем вращение к камере в порядке YXZ
    const euler = new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ');
    this.camera.quaternion.setFromEuler(euler);
  }
}
