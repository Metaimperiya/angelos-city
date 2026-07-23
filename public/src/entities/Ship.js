// ============================================================
// КОРАБЛЬ (ПОСАЖЕН НА ВОДУ + ТОЧНЫЙ СПАВН НА ПАЛУБЕ)
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from '../core/scene.js';
import { playerPos } from './Player/index.js';
import { sendPosition } from '../network/sync.js';

export let mainShip = null;
export let shipSpawnPoint = { x: 0, z: 0, y: 5 };

export function loadShip() {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/karablik_Untitled.glb',
      (gltf) => {
        const shipModel = gltf.scene;
        const shipContainer = new THREE.Group();

        // 1. Центрируем геометрию
        const box = new THREE.Box3().setFromObject(shipModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        shipModel.position.x = -center.x;
        shipModel.position.z = -center.z;
        shipModel.position.y = -box.min.y;

        shipContainer.add(shipModel);

        // 2. Увеличиваем размер до 130м (оптимальный игрой масштаб)
        const TARGET_SIZE = 130; 
        const maxDim = Math.max(size.x, size.z);
        const scale = TARGET_SIZE / (maxDim || 1);
        shipContainer.scale.set(scale, scale, scale);

        shipModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.metalness = 0.3;
              child.material.roughness = 0.6;
            }
          }
        });

        // 3. 🌊 СПУСКАЕМ НА ВОДУ (опускаем ниже уровня Y=0, чтобы киль ушел в воду)
        const shipHeight = size.y * scale;
        shipContainer.position.set(0, -shipHeight * 0.35, 0);

        scene.add(shipContainer);
        mainShip = shipContainer;

        // 4. Находим точную высоту палубы (Raycast сверху вниз)
        const raycaster = new THREE.Raycaster(
          new THREE.Vector3(0, 100, 0),
          new THREE.Vector3(0, -1, 0)
        );
        const hits = raycaster.intersectObject(shipContainer, true);

        if (hits.length > 0) {
          shipSpawnPoint = { x: 0, y: hits[0].point.y + 0.5, z: 0 };
        } else {
          shipSpawnPoint = { x: 0, y: 5, z: 0 };
        }

        // 💥 МГНОВЕННО ТЕЛЕПОРТИРУЕМ ИГРОКА НА ПАЛУБЕ ПОСЛЕ ЗАГРУЗКИ МОДЕЛИ
        if (playerPos) {
          playerPos.x = shipSpawnPoint.x + (Math.random() - 0.5) * 4;
          playerPos.z = shipSpawnPoint.z + (Math.random() - 0.5) * 4;
          playerPos.y = shipSpawnPoint.y;
          sendPosition(playerPos.x, playerPos.y, playerPos.z, 0);
        }

        console.log('✅ Корабль опущен на воду! Палуба на Y:', shipSpawnPoint.y);
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
  return { ...shipSpawnPoint };
}
