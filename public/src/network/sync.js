// Добавь эти импорты вверху public/src/network/sync.js:
import { addChatMessage } from '../ui/chat.js';
import { refreshHUD } from '../ui/hud.js';

// Внутри switch (data.type) в initSync добавь:
switch (data.type) {
  case 'init':
    myId = data.myId;
    for (const id in data.players) {
      if (id !== myId) addRemotePlayer(id, data.players[id]);
    }
    refreshHUD(); // ← Обновляем HUD
    break;

  case 'playerJoin':
    addRemotePlayer(data.id, data);
    addChatMessage('Сервер', `Игрок ${data.id.slice(0, 4)} присоединился`, '#ffaa00');
    refreshHUD(); // ← Обновляем HUD
    break;

  case 'playerLeave':
    removeRemotePlayer(data.id);
    addChatMessage('Сервер', `Игрок ${data.id.slice(0, 4)} вышел`, '#ff4444');
    refreshHUD(); // ← Обновляем HUD
    break;

  case 'chat':
    // Пришло сообщение от другого игрока
    addChatMessage(data.name || `Игрок [${data.id.slice(0, 4)}]`, data.text, '#00f3ff');
    break;
}
