// ============================================================
// ГЛАВНЫЙ ФАЙЛ (упрощённый)
// ============================================================

import { initScene, scene, camera, renderer } from './core/scene.js';
import { createWorld } from './core/world.js';
import { loadShip, teleportToShip } from './entities/Ship.js';
import { createPlayer, updatePlayer, getPlayerPos } from './entities/Player.js';
import { initSocket } from './network/socket.js';
import { initChat } from './ui/chat.js';
import { updateHUD } from './ui/hud.js';

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================

// 1. Сцена
initScene();

// 2. Мир (море)
createWorld();

// 3. Загружаем один корабль
await loadShip();

// 4. Создаём игрока и ставим на палубу
createPlayer();
const spawnPos = teleportToShip();
if (spawnPos) {
  const playerPos = getPlayerPos();
  playerPos.x = spawnPos.x;
  playerPos.z = spawnPos.z;
}

// 5. Сокет
initSocket();

// 6. Чат
initChat();

// 7. HUD
updateHUD(1);

// ============================================================
// ГЛАВНЫЙ ЦИКЛ
// ============================================================

function animate() {
  requestAnimationFrame(animate);

  // Обновление игрока
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
