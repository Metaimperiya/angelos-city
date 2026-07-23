// ============================================================
// СЦЕНА, КАМЕРА, РЕНДЕРЕР И ОСВЕЩЕНИЕ
// ============================================================

import * as THREE from 'three';

export let scene;
export let camera;
export let renderer;

export function initScene() {
  // 1. Создаём сцену
  scene = new THREE.Scene();
  // Выставляем небесно-голубой фон (если экран станет голубым — значит 3D-сцена 100% работает!)
  scene.background = new THREE.Color(0x87ceeb);

  // 2. Настраиваем камеру (угол 60, позиции сзади и чуть сверху)
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 12, 25);
  camera.lookAt(0, 0, 0);

  // 3. Настраиваем рендерер
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  // Проверяем, добавлен ли canvas на страницу, чтобы не было дублей
  if (!document.body.contains(renderer.domElement)) {
    document.body.appendChild(renderer.domElement);
  }

  // 4. ДОБАВЛЯЕМ ОСВЕЩЕНИЕ (без него все объекты чёрные!)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
  sunLight.position.set(50, 100, 50);
  sunLight.castShadow = true;
  scene.add(sunLight);

  console.log('🎬 Сцена, свет и камера инициализированы');
}
