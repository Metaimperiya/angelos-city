// ============================================================
// КОРАБЛЬ (СПАВН НА ОТКРЫТОЙ ПАЛУБЕ)
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from '../core/scene.js';
import { playerPos } from './Player/index.js';
import { sendPosition } from '../network/sync.js';

export let mainShip = null;
export let shipSpawnPoint = { x: 0, y: 15, z: -15 };

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

        // 2. Размер 220м
        const TARGET_SIZE = 220; 
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

        // 3. Посадка в воду
        const shipHeight = size.y * scale;
        shipContainer.position.set(0, -shipHeight * 0.24, 0);

        scene.add(shipContainer);
        mainShip = shipContainer;

        // 4. Ищем пол на открытой части палубы (z: -15)
        const raycaster = new THREE.Raycaster(
          new THREE.Vector3(0, 150, -15),
          new THREE.Vector3(0, -1, 0)
        );
        const hits = raycaster.intersectObject(shipContainer, true);

        if (hits.length > 0) {
          shipSpawnPoint = { 
            x: 0, 
            y: hits[0].point.y + 1.0, 
            z: -15 
          };
        } else {
          shipSpawnPoint = { x: 0, y: 15, z: -15 };
        }

        // Спавним игрока
        if (playerPos) {
          playerPos.x = shipSpawnPoint.x;
          playerPos.y = shipSpawnPoint.y;
          playerPos.z = shipSpawnPoint.z;
          sendPosition(playerPos.x, playerPos.y, playerPos.z, 0);
        }

        console.log('✅ Заспавнен на свободной палубе:', shipSpawnPoint);
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

// 📍 СКАНЕР ТОЧЕК НА КОРАБЛЕ (Клавиша 'P')
window.addEventListener('keydown', (e) => {
  if ((e.code === 'KeyP' || e.key === 'p' || e.key === 'з') && mainShip && playerPos) {
    const playerWorldVec = new THREE.Vector3(playerPos.x, playerPos.y, playerPos.z);
    const shipLocalVec = mainShip.worldToLocal(playerWorldVec.clone());

    const coordsString = `x: ${shipLocalVec.x.toFixed(2)}, y: ${shipLocalVec.y.toFixed(2)}, z: ${shipLocalVec.z.toFixed(2)}`;
    
    console.log('🎯 ЛОКАЛЬНАЯ ТОЧКА:', coordsString);
    alert(`📍 Координаты точки на корабле:\n\n${coordsString}\n\n(Скопируй из F12)`);
  }
});

export function teleportToShip() {
  return { ...shipSpawnPoint };
}
