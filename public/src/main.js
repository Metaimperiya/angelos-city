// ============================================================
// ГЛАВНЫЙ ФАЙЛ (ПОЛНАЯ ВЕРСИЯ)
// ============================================================

import * as THREE from 'three';

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

console.log('🚀 Запуск Angelos City...');

// 1. Сцена, камера, рендерер
initScene();

// 2. Мир (море)
createWorld();

// 3. Загружаем корабль
await loadShip();

// 4. Управление (мышь)
initControls();

// 5. Создаём игрока
createPlayer();

// 6. Сокет (мультиплеер)
initSocket();

// 7. Чат
initChat();

// 8. HUD
updateHUD(1);

console.log('✅ Все системы инициализированы');

// ============================================================
// ГЛАВНЫЙ ЦИКЛ С DELTA TIME
// ============================================================

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05); // ограничиваем дельту
  setDelta(delta);

  // Обновляем игрока (движение, камера)
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

console.log('🚢 Angelos City загружен и готов к работе!');
