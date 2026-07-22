// ============================================================
// ГЛАВНЫЙ ФАЙЛ
// ============================================================

import { initScene, scene, camera, renderer } from './core/scene.js';
import { createWorld } from './core/world.js';
import { loadShip } from './entities/Ship.js';
import { createPlayer, initControls, updatePlayer } from './entities/Player.js';
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

// 3. Загружаем корабль
await loadShip();

// 4. Управление (мышь + телефон)
initControls();

// 5. Создаём игрока
createPlayer();

// 6. Сокет
initSocket();

// 7. Чат
initChat();

// 8. HUD
updateHUD(1);

// ============================================================
// ГЛАВНЫЙ ЦИКЛ
// ============================================================

function animate() {
  requestAnimationFrame(animate);

  // Обновление игрока (движение, камера)
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
