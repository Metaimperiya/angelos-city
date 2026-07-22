// ============================================================
// КОРАБЛЬ (ОГРОМНЫЙ ГАЛЕОН 180м)
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from '../core/scene.js';

export let mainShip = null;
export let shipSpawnPoint = { x: 0, z: 0, y: 10 };

export function loadShip() {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/karablik_Untitled.glb',
      (gltf) => {
        const shipModel = gltf.scene;
        const shipContainer = new THREE.Group();

        const box = new THREE.Box3().setFromObject(shipModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        shipModel.position.x = -center.x;
        shipModel.position.z = -center.z;
        shipModel.position.y = -box.min.y;

        shipContainer.add(shipModel);

        // 💥 УВЕЛИЧИВАЕМ В 2 РАЗА (180 МЕТРОВ)
        const TARGET_SIZE = 180; 
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

        // 🌊 Погружаем киль в воду
        shipContainer.position.set(0, -6.5, 0);

        scene.add(shipContainer);
        mainShip = shipContainer;

        // Автоматически находим высоту палубы в центре для идеального спавна
        const raycaster = new THREE.Raycaster(
          new THREE.Vector3(0, 100, 0),
          new THREE.Vector3(0, -1, 0)
        );
        const intersects = raycaster.intersectObject(shipContainer, true);

        if (intersects.length > 0) {
          shipSpawnPoint = { x: 0, y: intersects[0].point.y + 0.5, z: 0 };
        } else {
          shipSpawnPoint = { x: 0, y: 8, z: 0 };
        }

        console.log('✅ Огромный галеон готов! Точка спавна:', shipSpawnPoint);
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
