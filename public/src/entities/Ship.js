// ============================================================
// КОРАБЛЬ (220М + ИДЕАЛЬНАЯ ПОСАДКА + ЛОКАЛЬНЫЕ КООРДИНАТЫ + КЛАВИША P)
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from '../core/scene.js';
import { playerPos } from './Player/index.js';
import { sendPosition } from '../network/sync.js';

export let mainShip = null;

// ЛОКАЛЬНАЯ точка спавна относительно центра корабля
export const shipLocalSpawn = { x: 0, y: 14, z: -5 };

export function loadShip() {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/karablik_Untitled.glb',
      (gltf) => {
        const shipModel = gltf.scene;
        const shipContainer = new THREE.Group();

        // 1. Центрируем модель внутри контейнера
        const box = new THREE.Box3().setFromObject(shipModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        shipModel.position.x = -center.x;
        shipModel.position.z = -center.z;
        shipModel.position.y = -box.min.y;

        shipContainer.add(shipModel);

        // 2. 💥 УВЕЛИЧИВАЕМ ДО 220 МЕТРОВ (Огромный корабль)
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

        // 3. 🌊 ЗОЛОТАЯ СЕРЕДИНА ПОСАДКИ (опустили чуть ниже)
        const shipHeight = size.y * scale;
        shipContainer.position.set(0, -shipHeight * 0.26, 0);

        scene.add(shipContainer);
        mainShip = shipContainer;

        // 4. Переводим локальную точку спавна в мировые координаты для игрока
        const localSpawnVec = new THREE.Vector3(shipLocalSpawn.x, shipLocalSpawn.y, shipLocalSpawn.z);
        const worldSpawnVec = shipContainer.localToWorld(localSpawnVec.clone());

        // Спавним игрока
        if (playerPos) {
          playerPos.x = worldSpawnVec.x + (Math.random() - 0.5) * 2;
          playerPos.z = worldSpawnVec.z + (Math.random() - 0.5) * 2;
          playerPos.y = worldSpawnVec.y;
          sendPosition(playerPos.x, playerPos.y, playerPos.z, 0);
        }

        console.log('✅ Огромный корабль (220м) готов!');
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

// 📍 СКАНЕР ТОЧЕК НА КОРАБЛЕ (Нажми 'P' в игре!)
window.addEventListener('keydown', (e) => {
  if ((e.code === 'KeyP' || e.key === 'p' || e.key === 'з') && mainShip && playerPos) {
    const playerWorldVec = new THREE.Vector3(playerPos.x, playerPos.y, playerPos.z);
    
    // Переводим текущие мировые координаты игрока в локальные координаты корабля
    const shipLocalVec = mainShip.worldToLocal(playerWorldVec.clone());

    const coordsString = `x: ${shipLocalVec.x.toFixed(2)}, y: ${shipLocalVec.y.toFixed(2)}, z: ${shipLocalVec.z.toFixed(2)}`;
    
    console.log('%c 🎯 ЛОКАЛЬНАЯ ТОЧКА НА КОРАБЛЕ:', 'background: #222; color: #bada55; font-size: 16px');
    console.log(coordsString);

    alert(`📍 Координаты точки на корабле:\n\n${coordsString}\n\n(Запомни или скопируй из F12)`);
  }
});

export function teleportToShip() {
  if (mainShip) {
    const localVec = new THREE.Vector3(shipLocalSpawn.x, shipLocalSpawn.y, shipLocalSpawn.z);
    const worldVec = mainShip.localToWorld(localVec);
    return { x: worldVec.x, y: worldVec.y, z: worldVec.z };
  }
  return { x: 0, y: 10, z: 0 };
}
