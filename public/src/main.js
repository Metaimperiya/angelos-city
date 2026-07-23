// ============================================================
// ГЛАВНЫЙ ФАЙЛ
// ============================================================

import * as THREE from 'three';
import { initScene, scene, camera, renderer } from './src/core/scene.js';
import { createWorld } from './src/core/world.js';
import { loadShip } from './src/entities/Ship.js';
import { createPlayer, initControls, updatePlayer, setDelta } from './src/entities/Player/index.js';
import { initSocket, socket } from './src/network/socket.js';
import { initSync } from './src/network/sync.js';
import { initChat } from './src/ui/chat.js';
import { updateHUD } from './src/ui/hud.js';

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================

console.log('🚀 Запуск Angelos City...');

initScene();
createWorld();
await loadShip();
initControls();
createPlayer();
initSocket();
initSync(socket); // ← ПЕРЕДАЁМ СОКЕТ В СИНХРОНИЗАЦИЮ
initChat();
updateHUD(1);

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
