// ============================================================
// СЦЕНА, КАМЕРА, РЕНДЕРЕР И ОСВЕЩЕНИЕ
// ============================================================

import * as THREE from 'three';

export let scene;
export let camera;
export let renderer;

export function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Небо

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 15, 30);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  if (!document.body.contains(renderer.domElement)) {
    document.body.appendChild(renderer.domElement);
  }

  // Свет
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
  sunLight.position.set(50, 100, 50);
  sunLight.castShadow = true;
  scene.add(sunLight);

  console.log('🎬 Сцена, свет и камера инициализированы');
}
