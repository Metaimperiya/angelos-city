// ============================================================
// ФИЗИКА И ДВИЖЕНИЕ (БЕЗ МЕРТВЫХ БЛОКИРОВОК ХОДЬБЫ)
// ============================================================

import * as THREE from 'three';
import { PlayerCamera } from './PlayerCamera.js';
import { mainShip } from '../Ship.js';

const downRaycaster = new THREE.Raycaster();
const downVector = new THREE.Vector3(0, -1, 0);
const rayOrigin = new THREE.Vector3();

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

    const speed = 14; // Бодрая скорость бега
    let moved = false;

    if (Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05) {
      const len = Math.hypot(moveX, moveZ);
      const normX = moveX / len;
      const normZ = moveZ / len;

      const yaw = PlayerCamera.euler.y;
      const sin = Math.sin(yaw);
      const cos = Math.cos(yaw);

      // ПРЯМОЙ СДВИГ БЕЗ БЛОКИРОВОК — ИГРОК ТОЧНО БУДЕТ ХОДИТЬ!
      let dx = (-normZ * sin + normX * cos) * speed * delta;
      let dz = (-normZ * cos - normX * sin) * speed * delta;

      this.pos.x += dx;
      this.pos.z += dz;
      moved = true;

      this.rotation = Math.atan2(dx, dz);
      this.group.rotation.y = this.rotation;
    }

    // 🌊 ИЩЕМ ПАЛУБУ ПОД НОГАМИ (Примагничивание)
    let floorY = 0; // Вода по умолчанию
    if (mainShip) {
      rayOrigin.set(this.pos.x, this.pos.y + 5.0, this.pos.z);
      downRaycaster.set(rayOrigin, downVector);
      const hits = downRaycaster.intersectObject(mainShip, true);

      if (hits.length > 0) {
        floorY = hits[0].point.y;
      }
    }

    // 🥾 ПРЫЖКИ И ГРАВИТАЦИЯ
    const jumpForce = 9;
    const gravity = -24;

    if (input.jump && this.isGrounded) {
      this.velocityY = jumpForce;
      this.isGrounded = false;
    }

    if (this.pos.y > floorY + 0.3 && this.isGrounded) {
      this.isGrounded = false;
    }

    if (!this.isGrounded) {
      this.velocityY += gravity * delta;
      this.pos.y += this.velocityY * delta;

      if (this.pos.y <= floorY) {
        this.pos.y = floorY;
        this.velocityY = 0;
        this.isGrounded = true;
      }
    } else {
      this.pos.y = floorY;
    }

    this.group.position.set(this.pos.x, this.pos.y, this.pos.z);

    return moved;
  },

  getRotation() {
    return this.rotation;
  }
};
