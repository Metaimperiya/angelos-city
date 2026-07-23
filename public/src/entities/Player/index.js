import * as THREE from 'three';
import { initControls, getInput } from './PlayerInput.js';

// Запускаем инициализацию клавиатуры и тача при старте модуля
initControls();

// Экспортируем позицию игрока, которую ждет Ship.js (ошибка исчезнет сразу)
export const playerPos = new THREE.Vector3(0, 5, -15);

export class Player {
    constructor(scene) {
        // Создаем базовый меш игрока (куб), чтобы было видно на палубе
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(geometry, material);
        
        // Устанавливаем начальные координаты
        this.mesh.position.copy(playerPos);
        scene.add(this.mesh);
    }

    update(delta, shipContainer) {
        const input = getInput();
        const moveSpeed = 6.0 * delta;

        // Простое движение по локальным осям
        if (input.forward) this.mesh.position.z -= moveSpeed;
        if (input.backward) this.mesh.position.z += moveSpeed;
        if (input.left) this.mesh.position.x -= moveSpeed;
        if (input.right) this.mesh.position.x += moveSpeed;

        // Обновляем экспортируемую позицию для синхронизации
        playerPos.copy(this.mesh.position);

        // Если игрок на корабле, можно привязать его через localToWorld прямо здесь:
        if (shipContainer) {
            // shipContainer.localToWorld(playerPos);
        }
    }
}
