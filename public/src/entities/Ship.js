// ============================================================
// КОРАБЛЬ
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from '../core/scene.js';

export let mainShip = null;
export let shipSpawnPoint = { x: 0, y: 4, z: 0 };

export function loadShip() {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/karablik_Untitled.glb',
      (gltf) => {
        const model = gltf.scene;
        const container = new THREE.Group();

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);
        container.add(model);

        const scale = 90 / Math.max(size.x, size.z);
        container.scale.set(scale, scale, scale);
        container.position.set(0, -3.5, 0);

        scene.add(container);
        mainShip = container;

        shipSpawnPoint.y = (size.y * scale) * 0.35 - 3.5;

        console.log('✅ Корабль загружен!');
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
  return mainShip ? { x: 0, y: shipSpawnPoint.y, z: 0 } : { x: 0, y: 4, z: 0 };
}
