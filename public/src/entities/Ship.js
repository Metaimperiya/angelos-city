// ============================================================
// КОРАБЛЬ (ТОЧНЫЙ СПАВН ПО ТВОИМ ЛОКАЛЬНЫМ КООРДИНАТАМ)
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from '../core/scene.js';
import { playerPos } from './Player/index.js';
import { sendPosition } from '../network/sync.js';

export let mainShip = null;

// 🎯 НОВЫЕ ТОЧНЫЕ ЛОКАЛЬНЫЕ КООРДИНАТЫ (СО СКРИНШОТА)
export const SPAWN_LOCAL = { x: 0.49, y: 40.31, z: 36.01 };

export let shipSpawnPoint = { x: 0, y: 10, z: 0 };

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

        // 4. 🎯 ПЕРЕВОДИМ ТВОИ ЛОКАЛЬНЫЕ КООРДИНАТЫ В МИРОВЫЕ
        const localVec = new THREE.Vector3(SPAWN_LOCAL.x, SPAWN_LOCAL.y, SPAWN_LOCAL.z);
        const worldVec = shipContainer.localToWorld(localVec);

        shipSpawnPoint = { 
          x: worldVec.x, 
          y: worldVec.y, 
          z: worldVec.z 
        };

        // Спавним игрока строго в выбранной тобой точке на палубе
        if (playerPos) {
          playerPos.x = shipSpawnPoint.x;
          playerPos.y = shipSpawnPoint.y;
          playerPos.z = shipSpawnPoint.z;
          sendPosition(playerPos.x, playerPos.y, playerPos.z, 0);
        }

        console.log('✅ Спавн точно настроен по твоим точкам:', SPAWN_LOCAL);
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
    
    console.log('%c 🎯 ЛОКАЛЬНАЯ ТОЧКА НА КОРАБЛЕ:', 'background: #222; color: #bada55; font-size: 16px');
    console.log(coordsString);

    alert(`📍 Координаты точки на корабле:\n\n${coordsString}\n\n(Скопируй из F12)`);
  }
});

export function teleportToShip() {
  if (mainShip) {
    const localVec = new THREE.Vector3(SPAWN_LOCAL.x, SPAWN_LOCAL.y, SPAWN_LOCAL.z);
    const worldVec = mainShip.localToWorld(localVec);
    return { x: worldVec.x, y: worldVec.y, z: worldVec.z };
  }
  return { ...shipSpawnPoint };
}
