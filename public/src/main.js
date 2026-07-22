// ============================================================
// ГЛАВНЫЙ ФАЙЛ (точка входа)
// ============================================================

import { initScene, scene, camera, renderer } from './core/scene.js';
import { createWorld } from './core/world.js';
import { initSocket } from './network/socket.js';
import { initChat } from './ui/chat.js';
import { updateHUD } from './ui/hud.js';
import { createPlayer, updatePlayer, getPlayerPos } from './entities/Player.js';
import { loadShips, updateShips, getMainShip, teleportToMainShip } from './entities/Ship.js';

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================

// 1. Сцена
initScene();

// 2. Мир (море)
createWorld();

// 3. Корабли
await loadShips();

// 4. Игрок
createPlayer();

// 5. Сокет (мультиплеер)
initSocket();

// 6. Чат
initChat();

// 7. HUD (счётчик игроков)
updateHUD(1);

// ============================================================
// ГЛАВНЫЙ ЦИКЛ
// ============================================================

function animate() {
  requestAnimationFrame(animate);

  // Движение кораблей
  updateShips();

  // Обновление игрока
  updatePlayer();

  // Рендер
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
