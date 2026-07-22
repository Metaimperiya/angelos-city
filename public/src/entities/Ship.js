// ============================================================
// КОРАБЛЬ
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from '../core/scene.js';

export let mainShip = null;

export function loadShip() {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/karablik_Untitled.glb',
      (gltf) => {
        const ship = gltf.scene;
        const box = new THREE.Box3().setFromObject(ship);
        const center = box.getCenter(new THREE.Vector3());
        ship.position.sub(center);
        ship.position.y = 0.5;

        // Увеличиваем масштаб
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 8 / maxDim;
        ship.scale.set(scale, scale, scale);

        ship.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.metalness = 0.6;
              child.material.roughness = 0.3;
            }
          }
        });

        scene.add(ship);
        mainShip = ship;

        // Невидимая платформа
        const platformGeo = new THREE.BoxGeometry(3, 0.2, 2);
        const platformMat = new THREE.MeshPhongMaterial({
          color: 0x00ff88,
          transparent: true,
          opacity: 0.0
        });
        const platform = new THREE.Mesh(platformGeo, platformMat);
        platform.position.set(0, 1.5, 0);
        ship.add(platform);

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
  if (!mainShip) return null;
  const worldPos = new THREE.Vector3(0, 1.8, 0);
  mainShip.localToWorld(worldPos);
  return worldPos;
}
