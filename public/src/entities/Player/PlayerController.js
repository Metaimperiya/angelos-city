import * as THREE from 'three';

export class PlayerController {
  constructor(playerMesh, playerCamera) {
    this.mesh = playerMesh;
    this.playerCamera = playerCamera;
    this.speed = 0.15; // Скорость перемещения
  }

  update(input) {
    const moveDir = new THREE.Vector3(0, 0, 0);

    // В Three.js: -Z это ВПРЕД, +Z это НАЗАД, -X это ВЛЕВО, +X это ВПРАВО
    if (input.keys.forward) moveDir.z -= 1;  // W — Вперед (-Z)
    if (input.keys.backward) moveDir.z += 1; // S — Назад (+Z)
    if (input.keys.left) moveDir.x -= 1;     // A — Влево (-X)
    if (input.keys.right) moveDir.x += 1;    // D — Вправо (+X)

    // Если ничего не нажато — выходим
    if (moveDir.lengthSq() === 0) return;

    // Нормализуем, чтобы по диагонали не бегать быстрее
    moveDir.normalize();

    // Разворачиваем вектор движения по направлению взгляда камеры (ось Y)
    moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerCamera.yaw);

    // Применяем перемещение к мешу игрока
    this.mesh.position.addScaledVector(moveDir, this.speed);
  }
}
