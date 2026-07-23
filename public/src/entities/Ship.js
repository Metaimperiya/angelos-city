// ============================================================
// КОРАБЛЬ (ИСПРАВЛЕННЫЙ)
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from '../core/scene.js';

export let mainShip = null;
export let shipSpawnPoint = { x: 0, z: 0 };

export function loadShip() {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/karablik_Untitled.glb',
      (gltf) => {
        const shipModel = gltf.scene;

        // Создаем контейнер-оболочку для чистой работы с координатами
        const shipContainer = new THREE.Group();

        // Считаем размер и центр исходной 3D-модели
        const box = new THREE.Box3().setFromObject(shipModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Сдвигаем модель ВНУТРИ контейнера, чтобы её центр был в (0,0,0)
        shipModel.position.sub(center);
        shipContainer.add(shipModel);

        // Масштабируем весь контейнер
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 8 / (maxDim || 1);
        shipContainer.scale.set(scale, scale, scale);

        // Включаем тени и настраиваем материалы
        shipModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.metalness = 0.6;
              child.material.roughness = 0.3;
            }
          }
        });

        // Ставим контейнер с кораблем СТРОГО в центр мира (0, 0, 0)
        shipContainer.position.set(0, 0, 0);
        shipSpawnPoint = { x: 0, z: 0 };

        scene.add(shipContainer);
        mainShip = shipContainer;

        // Невидимая платформа для ходьбы (чтобы игрок не проваливался)
        const platformGeo = new THREE.BoxGeometry(4, 0.2, 3);
        const platformMat = new THREE.MeshPhongMaterial({
          color: 0x00ff88,
          transparent: true,
          opacity: 0.0
        });
        const platform = new THREE.Mesh(platformGeo, platformMat);
        platform.position.set(0, 0.2, 0);
        shipContainer.add(platform);

        console.log('✅ Корабль загружен и встал ровно в (0, 0, 0)!');
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

// Защищенный телепорт — если корабль еще не загрузился, отдаст безопасные (0, 1.8, 0)
export function teleportToShip() {
  if (!mainShip) return { x: 0, y: 1.8, z: 0 };
  const worldPos = new THREE.Vector3(0, 1.8, 0);
  mainShip.localToWorld(worldPos);
  return worldPos;
}

export function getShipPosition() {
  return shipSpawnPoint;
}
