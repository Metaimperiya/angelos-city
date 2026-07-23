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
      const len = Math.hypot(moveX, moveZ);
      const normX = moveX / len;
      const normZ = moveZ / len;

      const yaw = PlayerCamera.euler.y;
      const sin = Math.sin(yaw);
      const cos = Math.cos(yaw);

      const dx = (-normZ * sin + normX * cos) * speed * delta;
      const dz = (-normZ * cos - normX * sin) * speed * delta;

      this.pos.x += dx;
      this.pos.z += dz;
      moved = true;

      // ⬇️ ПРАВИЛЬНЫЙ ПОВОРОТ ПЕРСОНАЖА ⬇️
      // Используем dx и dz (они учитывают угол камеры) без минусов, чтобы лицо смотрело вперёд
      this.rotation = Math.atan2(dx, dz);
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
