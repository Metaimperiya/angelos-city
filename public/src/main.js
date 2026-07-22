// ============================================================
// ГЛАВНЫЙ ФАЙЛ
// ============================================================

import { initScene, scene, camera, renderer } from './core/scene.js';
import { createWorld } from './core/world.js';
import { loadShip } from './entities/Ship.js';
import { createPlayer, initControls, updatePlayer, setDelta } from './entities/Player.js';
import { initSocket } from './network/socket.js';
import { initChat } from './ui/chat.js';
import { updateHUD } from './ui/hud.js';

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================

initScene();
createWorld();
await loadShip();

// ФИКС 2: Включаем управление мышью
initControls();

createPlayer();
initSocket();
initChat();
updateHUD(1);

// ============================================================
// ГЛАВНЫЙ ЦИКЛ
// ============================================================

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
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

console.log('🚢 Angelos City загружен!');
