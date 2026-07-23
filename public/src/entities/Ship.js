// ============================================================
// КОРАБЛЬ (ГИГАНТСКИЙ И НА ВОДЕ)
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from '../core/scene.js';

export let mainShip = null;
export let shipSpawnPoint = { x: 0, z: 0, y: 4 };
export let shipBoundingBox = new THREE.Box3();

export function loadShip() {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/karablik_Untitled.glb',
      (gltf) => {
        const shipModel = gltf.scene;
        const shipContainer = new THREE.Group();

        // 1. Считаем размеры
        const box = new THREE.Box3().setFromObject(shipModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // 2. Центрируем модель
        shipModel.position.x = -center.x;
        shipModel.position.z = -center.z;
        shipModel.position.y = -box.min.y; // Дно на уровне 0 группы

        shipContainer.add(shipModel);

        // 3. УВЕЛИЧИВАЕМ ДО 90 (Гигантский масштаб)
        const TARGET_SIZE = 90; 
        const maxDim = Math.max(size.x, size.z);
        const scale = TARGET_SIZE / (maxDim || 1);
        shipContainer.scale.set(scale, scale, scale);

        // Настройка теней и блеска
        shipModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.metalness = 0.4;
              child.material.roughness = 0.5;
            }
          }
        });

        // 4. ОПУСКАЕМ НА ВОДУ (киль уходит чуть под воду)
        shipContainer.position.set(0, -3.5, 0);

        scene.add(shipContainer);
        mainShip = shipContainer;

        // Пересчитываем хитбокс
        shipBoundingBox.setFromObject(shipContainer);

        // Точка спавна на палубе
        const deckY = (size.y * scale) * 0.35 - 3.5;
        shipSpawnPoint = { 
          x: 0, 
          y: Math.max(deckY, 3.5), 
          z: 0 
        };

        console.log('✅ Корабль увеличен до 90м и опущен на воду!');
        resolve();
      },
      undefined,
      (error) => {
        console.error('❌ Ошибка загрузки корабля:', error);
        resolve();
      }
    );
  });
}

export function teleportToShip() {
  if (!mainShip) return { x: 0, y: 4, z: 0 };
  return { ...shipSpawnPoint };
}

// Починенная проверка коллизий — больше не зажимает игрока в тиски
export function checkShipCollision(nextX, nextZ, playerY) {
  if (!mainShip || shipBoundingBox.isEmpty()) return false;

  // Если игрок уже на палубе или выше воды — не блокируем
  if (playerY >= shipSpawnPoint.y - 1.0) return false;

  // Безопасные границы корпуса (учитываем только сам центр корабля)
  const minX = shipBoundingBox.min.x + 3;
  const maxX = shipBoundingBox.max.x - 3;
  const minZ = shipBoundingBox.min.z + 3;
  const maxZ = shipBoundingBox.max.z - 3;

  return (nextX > minX && nextX < maxX && nextZ > minZ && nextZ < maxZ);
}
