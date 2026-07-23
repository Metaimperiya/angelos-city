// ============================================================
// КОРАБЛЬ (ОДИН, СТОИТ НА МЕСТЕ)
// ============================================================

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
import { scene } from '../core/scene.js';

export let mainShip = null;
export let shipPosition = { x: 0, z: 0 };

export function loadShip() {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/karablik_Untitled.glb',
      (gltf) => {
        const ship = gltf.scene;
        
        // Центрируем корабль
        const box = new THREE.Box3().setFromObject(ship);
        const center = box.getCenter(new THREE.Vector3());
        ship.position.sub(center);
        
        // Ставим на воду
        ship.position.y = 0.5;
        
        // Масштабируем (увеличиваем, чтобы был больше)
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 8 / maxDim; // Увеличили с 5 до 8
        ship.scale.set(scale, scale, scale);

        // Тени и материалы
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

        // Добавляем в сцену
        scene.add(ship);
        mainShip = ship;
        shipPosition = { x: 0, z: 0 };

        // Невидимая платформа для ходьбы
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
        resolve(); // даже если ошибка — идём дальше
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
