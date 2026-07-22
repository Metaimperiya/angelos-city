// ============================================================
// ФИЗИКА + ДВИЖЕНИЕ
// ============================================================

import * as THREE from 'three';
import { camera } from '../../core/scene.js';

export const PlayerController = {
  group: null,
  pos: null,
  velocityY: 0,
  isGrounded: true,
  rotation: 0,

  init(group, pos) {
    this.group = group;
    this.pos = pos;
  },

  update(input, delta) {
    // Получаем направление камеры
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    // Входные данные
    let moveX = input.moveX; // A/D или влево/вправо
    let moveZ = input.moveZ; // W/S или вперёд/назад

    const speed = 8;
    let moved = false;

    if (Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05) {
      const len = Math.hypot(moveX, moveZ);
      moveX /= len;
      moveZ /= len;

      // Движение относительно камеры
      const dx = (forward.x * moveZ + right.x * moveX) * speed * delta;
      const dz = (forward.z * moveZ + right.z * moveX) * speed * delta;

      this.pos.x += dx;
      this.pos.z += dz;
      moved = true;

      // Поворот персонажа в сторону движения
      this.rotation = Math.atan2(moveX, moveZ);
      this.group.rotation.y = this.rotation;
    }

    // Прыжок и гравитация
    const jumpForce = 4.5;
    const gravity = -12;

    if (input.jump && this.isGrounded) {
      this.velocityY = jumpForce;
      this.isGrounded = false;
    }

    if (!this.isGrounded) {
      this.velocityY += gravity * delta;
      this.pos.y += this.velocityY * delta;
      if (this.pos.y <= 0) {
        this.pos.y = 0;
        this.velocityY = 0;
        this.isGrounded = true;
      }
    }

    this.group.position.set(this.pos.x, this.pos.y, this.pos.z);

    return moved;
  },

  getRotation() {
    return this.rotation;
  }
};
