// ============================================================
// ФИЗИКА + ДВИЖЕНИЕ
// ============================================================

import * as THREE from 'three';
import { PlayerCamera } from './PlayerCamera.js';
import { checkShipCollision } from '../Ship.js';

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
    let moveX = input.moveX;
    let moveZ = input.moveZ;

    const speed = 10; // Слегка увеличим скорость под масштаб корабля
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

      const nextX = this.pos.x + dx;
      const nextZ = this.pos.z + dz;

      // Проверка на столкновение с бортами
      if (!checkShipCollision(nextX, this.pos.z, this.pos.y)) {
        this.pos.x = nextX;
      }
      if (!checkShipCollision(this.pos.x, nextZ, this.pos.y)) {
        this.pos.z = nextZ;
      }

      moved = true;

      this.rotation = Math.atan2(dx, dz);
      this.group.rotation.y = this.rotation;
    }

    // Прыжок и гравитация
    const jumpForce = 6;
    const gravity = -18;

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
