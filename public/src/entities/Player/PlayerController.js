// ============================================================
// ФИЗИКА И ДВИЖЕНИЕ (БЕЗ МЕРТВЫХ БЛОКИРОВОК ХОДЬБЫ)
// ============================================================

import * as THREE from 'three';
import { PlayerCamera } from './PlayerCamera.js';
import { mainShip } from '../Ship.js';

const downRaycaster = new THREE.Raycaster();
const forwardRaycaster = new THREE.Raycaster();
const downVector = new THREE.Vector3(0, -1, 0);
const moveVector = new THREE.Vector3();
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

    const speed = 12;
    let moved = false;

    if (Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05) {
      const len = Math.hypot(moveX, moveZ);
      const normX = moveX / len;
      const normZ = moveZ / len;

      const yaw = PlayerCamera.euler.y;
      const sin = Math.sin(yaw);
      const cos = Math.cos(yaw);

      let dx = (-normZ * sin + normX * cos) * speed * delta;
      let dz = (-normZ * cos - normX * sin) * speed * delta;

      // 🛑 ПРОВЕРКА СТЕН (луч на уровне груди +1.2м, исключая блокировку пола)
      if (mainShip) {
        if (dx !== 0) {
          moveVector.set(Math.sign(dx), 0, 0);
          rayOrigin.set(this.pos.x, this.pos.y + 1.2, this.pos.z);
          forwardRaycaster.set(rayOrigin, moveVector);
          const hits = forwardRaycaster.intersectObject(mainShip, true);
          if (hits.length > 0 && hits[0].distance > 0.25 && hits[0].distance < 0.6) {
            if (Math.abs(hits[0].face.normal.y) < 0.3) dx = 0;
          }
        }
        if (dz !== 0) {
          moveVector.set(0, 0, Math.sign(dz));
          rayOrigin.set(this.pos.x + dx, this.pos.y + 1.2, this.pos.z);
          forwardRaycaster.set(rayOrigin, moveVector);
          const hits = forwardRaycaster.intersectObject(mainShip, true);
          if (hits.length > 0 && hits[0].distance > 0.25 && hits[0].distance < 0.6) {
            if (Math.abs(hits[0].face.normal.y) < 0.3) dz = 0;
          }
        }
      }

      this.pos.x += dx;
      this.pos.z += dz;
      moved = true;

      this.rotation = Math.atan2(dx, dz);
      this.group.rotation.y = this.rotation;
    }

    // 🌊 ПОИСК ПАЛУБЫ ПОД НОГАМИ
    let floorY = 0; // Вода по умолчанию
    if (mainShip) {
      rayOrigin.set(this.pos.x, this.pos.y + 5.0, this.pos.z);
      downRaycaster.set(rayOrigin, downVector);
      const hits = downRaycaster.intersectObject(mainShip, true);

      if (hits.length > 0) {
        for (let i = 0; i < hits.length; i++) {
          if (hits[i].point.y <= this.pos.y + 2.0) {
            floorY = hits[i].point.y;
            break;
          }
        }
      }
    }

    // 🥾 ПРЫЖКИ И ГРАВИТАЦИЯ
    const jumpForce = 8;
    const gravity = -22;

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
