// ============================================================
// ФИЗИКА + ДВИЖЕНИЕ
// ============================================================

import * as THREE from 'three';
import { PlayerCamera } from './PlayerCamera.js';

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
    let moveX = input.moveX; // A (-1) / D (+1)
    let moveZ = input.moveZ; // S (-1) / W (+1)

    const speed = 8;
    let moved = false;

    if (Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05) {
      // Нормализуем ввод, чтобы по диагонали не бегать быстрее
      const len = Math.hypot(moveX, moveZ);
      const normX = moveX / len;
      const normZ = moveZ / len;

      // Угол взгляда камеры по горизонтали
      const yaw = PlayerCamera.euler.y;

      // Считаем направление относительно угла камеры
      // normZ > 0 (W) бежит вперед (-sin, -cos)
      const sin = Math.sin(yaw);
      const cos = Math.cos(yaw);

      const dx = (-normZ * sin + normX * cos) * speed * delta;
      const dz = (-normZ * cos - normX * sin) * speed * delta;

      this.pos.x += dx;
      this.pos.z += dz;
      moved = true;

      // Разворачиваем 3D-модельку игрока по направлению его хода
      this.rotation = Math.atan2(-dx, -dz);
      this.group.rotation.y = this.rotation;
    }

    // Прыжок и гравитация
    const jumpForce = 5;
    const gravity = -15;

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
