// ============================================================
// КОРАБЛЬ (АВТОМАТИЧЕСКИЙ СПАВН СТРОГО НАД ПАЛУБОЙ)
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from '../core/scene.js';
import { playerPos } from './Player/index.js';
import { sendPosition } from '../network/sync.js';

export let mainShip = null;
export let shipSpawnPoint = { x: 0, y: 15, z: 0 };

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

        // 4. 🔥 АВТО-ПОИСК ВЕРХНЕЙ ТОЧКИ ПАЛУБЫ
        // Сканируем сверху вниз с высоты 150м по центру корабля
        const raycaster = new THREE.Raycaster(
          new THREE.Vector3(0, 150, 0),
          new THREE.Vector3(0, -1, 0)
        );
        const hits = raycaster.intersectObject(shipContainer, true);

        if (hits.length > 0) {
          // Ставим игрока на 1.5 метра ВЫШЕ поверхности палубы
          shipSpawnPoint = { 
            x: hits[0].point.x, 
            y: hits[0].point.y + 1.5, 
            z: hits[0].point.z 
          };
        } else {
          shipSpawnPoint = { x: 0, y: 18, z: 0 };
        }

        // Спавним игрока
        if (playerPos) {
          playerPos.x = shipSpawnPoint.x;
          playerPos.y = shipSpawnPoint.y;
          playerPos.z = shipSpawnPoint.z;
          sendPosition(playerPos.x, playerPos.y, playerPos.z, 0);
        }

        console.log('✅ Игрок заспавнен над палубой:', shipSpawnPoint);
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
  return { ...shipSpawnPoint };
}
