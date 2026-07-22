// ============================================================
// КОРАБЛЬ (УВЕЛИЧЕННЫЙ И С ХИТБОКСОМ)
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from '../core/scene.js';

export let mainShip = null;
export let shipSpawnPoint = { x: 0, z: 0, y: 0 };
export let shipBoundingBox = new THREE.Box3(); // Хитбокс корабля для коллизий

export function loadShip() {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/karablik_Untitled.glb',
      (gltf) => {
        const shipModel = gltf.scene;
        const shipContainer = new THREE.Group();

        // 1. Считаем размеры модели
        const box = new THREE.Box3().setFromObject(shipModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // 2. Центрируем модель внутри группы по X и Z, а Y ставим на дно
        shipModel.position.x = -center.x;
        shipModel.position.z = -center.z;
        shipModel.position.y = -box.min.y; // Дно корабля на уровне 0 внутри группы

        shipContainer.add(shipModel);

        // 3. УВЕЛИЧИВАЕМ КОРАБЛЬ (ставь 45 - 50 для нормального масштаба)
        const TARGET_SIZE = 48; 
        const maxDim = Math.max(size.x, size.z); // Опираемся на длину/ширину
        const scale = TARGET_SIZE / (maxDim || 1);
        shipContainer.scale.set(scale, scale, scale);

        // Материалы и тени
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

        // 4. ПОДНИМАЕМ КОРАБЛЬ НАД ВОДОЙ
        // Корпус будет погружён совсем чуть-чуть, а палуба окажется сверху
        const shipY = 1.2; 
        shipContainer.position.set(0, shipY, 0);

        scene.add(shipContainer);
        mainShip = shipContainer;

        // 5. ОБНОВЛЯЕМ ХИТБОКС ДЛЯ КОЛЛИЗИЙ С ИГРОКОМ
        shipBoundingBox.setFromObject(shipContainer);
        
        // Точка спавна игрока на палубе
        shipSpawnPoint = { 
          x: 0, 
          y: shipContainer.position.y + (size.y * scale * 0.3), 
          z: 0 
        };

        console.log('✅ Корабль увеличен и вытащен из воды!');
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
  if (!mainShip) return { x: 0, y: 3, z: 0 };
  return { ...shipSpawnPoint };
}

// Проверка: находится ли точка внутри стен корабля
export function checkShipCollision(nextX, nextZ, playerY) {
  if (!mainShip || shipBoundingBox.isEmpty()) return false;

  // Расширяем хитбокс с учётом радиуса игрока
  const padding = 0.6;
  const minX = shipBoundingBox.min.x - padding;
  const maxX = shipBoundingBox.max.x + padding;
  const minZ = shipBoundingBox.min.z - padding;
  const maxZ = shipBoundingBox.max.z + padding;

  // Проверяем, врезается ли игрок в бока корабля (если он идет по воде/земле ниже палубы)
  const isInsideHorizontal = nextX >= minX && nextX <= maxX && nextZ >= minZ && nextZ <= maxZ;
  
  // Если игрок находится ниже уровня палубы — корабль работает как твердое препятствие
  const isBelowDeck = playerY < shipSpawnPoint.y - 0.5;

  return isInsideHorizontal && isBelowDeck;
}
