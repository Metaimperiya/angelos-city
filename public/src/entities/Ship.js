// ============================================================
// КОРАБЛИ
// ============================================================

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
import { scene } from '../core/scene.js';

export let ships = [];
export let mainShip = null;

const shipConfigs = [
  { radius: 15, speed: 0.3, angle: 0 },
  { radius: 20, speed: -0.2, angle: 2 },
  { radius: 10, speed: 0.4, angle: 4 }
];

export function loadShips() {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    let loaded = 0;

    shipConfigs.forEach((cfg, index) => {
      loader.load(
        '/assets/models/karablik_Untitled.glb',
        (gltf) => {
          const ship = gltf.scene;
          const box = new THREE.Box3().setFromObject(ship);
          const center = box.getCenter(new THREE.Vector3());
          ship.position.sub(center);
          ship.position.y = 0.5;

          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 5) {
            const scale = 5 / maxDim;
            ship.scale.set(scale, scale, scale);
          }

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

          ships.push({
            mesh: ship,
            radius: cfg.radius,
            speed: cfg.speed,
            angle: cfg.angle
          });

          scene.add(ship);

          if (index === 0) {
            mainShip = ship;
            // Платформа для спавна
            const platformGeo = new THREE.BoxGeometry(3, 0.2, 2);
            const platformMat = new THREE.MeshPhongMaterial({
              color: 0x00ff88,
              transparent: true,
              opacity: 0.0
            });
            const platform = new THREE.Mesh(platformGeo, platformMat);
            platform.position.set(0, 1.5, 0);
            ship.add(platform);
          }

          loaded++;
          if (loaded === shipConfigs.length) {
            resolve();
          }
        },
        undefined,
        (error) => {
          console.error('Ошибка загрузки корабля:', error);
          loaded++;
          if (loaded === shipConfigs.length) resolve();
        }
      );
    });
  });
}

export function updateShips() {
  const time = Date.now() / 1000;
  ships.forEach((shipData) => {
    const angle = time * shipData.speed + shipData.angle;
    shipData.mesh.position.x = Math.cos(angle) * shipData.radius;
    shipData.mesh.position.z = Math.sin(angle) * shipData.radius;
    shipData.mesh.rotation.y = -angle;
  });
}

export function getMainShip() {
  return mainShip;
}

export function teleportToMainShip() {
  if (!mainShip) return null;
  const worldPos = new THREE.Vector3(0, 1.5, 0);
  mainShip.localToWorld(worldPos);
  return worldPos;
}
