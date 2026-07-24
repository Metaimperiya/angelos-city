// ============================================================
// ГЛАВНЫЙ ФАЙЛ
// ============================================================

import * as THREE from 'three';
import { initScene, scene, camera, renderer } from './core/scene.js';
import { createWorld } from './core/world.js';
import { loadShip } from './entities/Ship.js';
import { loadVoxelModel } from './entities/VoxelModel.js';
import { createPlayer, initControls, updatePlayer, setDelta } from './entities/Player/index.js';
import { initSocket, socket } from './network/socket.js';
import { initSync } from './network/sync.js';
import { initChat } from './ui/chat.js';
import { updateHUD } from './ui/hud.js';

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================

console.log('🚀 Запуск Angelos City...');

initScene();
createWorld();

// 🎯 1. СНАЧАЛА СЕТЬ, ИНТЕРФЕЙС И ЧАТ (чтобы всё работало мгновенно)
initSocket();
initSync(socket);
initControls();
createPlayer();
initChat();
updateHUD(1);

// 🎯 2. ЗАТЕМ АСИНХРОННАЯ ЗАГРУЗКА 3D-МОДЕЛЕЙ (не блокирует скрипты)
loadShip().then(() => console.log('🚢 Корабль загружен'));
loadVoxelModel().then(() => console.log('🏝️ Остров загружен'));

console.log('✅ Все системы инициализированы');

// ============================================================
// ГЛАВНЫЙ ЦИКЛ
// ============================================================

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.05);
  setDelta(delta);
  updatePlayer();
  renderer.render(scene, camera);
}

animate();

// ============================================================
// RESIZE
// ============================================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('🚢 Angelos City загружен и готов к работе!');
