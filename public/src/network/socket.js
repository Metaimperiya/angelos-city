// ============================================================
// WEB SOCKET (МУЛЬТИПЛЕЕР)
// ============================================================

import { scene } from '../core/scene.js';
import { createRemotePlayerMesh } from '../entities/Player.js';
import { updateHUD } from '../ui/hud.js';

export let socket;
export let myId = '';
export let isConnected = false;
export const remotePlayers = {};
export const remoteMeshes = {};

export function initSocket() {
  // Динамический URL: если локально — подключается к localhost, если в сети — к Render
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `${protocol}//${window.location.host}`
    : 'wss://angelos-city-3.onrender.com';

  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    isConnected = true;
    console.log('🟢 Подключено к серверу');
    const loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.style.display = 'none';
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'init':
          myId = data.myId;
          Object.keys(data.players).forEach((id) => {
            if (id !== myId) spawnRemotePlayer(id, data.players[id]);
          });
          updateHUD(Object.keys(data.players).length);
          break;

        case 'playerJoin':
          if (data.id !== myId) {
            spawnRemotePlayer(data.id, data);
            if (window.addChatMessage) window.addChatMessage('Система', `${data.name} вошел в игру`, '#ff007f');
          }
          break;

        case 'playerMove':
          if (remoteMeshes[data.id]) {
            remoteMeshes[data.id].position.x = data.x;
            remoteMeshes[data.id].position.z = data.z;
            if (data.rotation !== undefined) remoteMeshes[data.id].rotation.y = data.rotation;
          }
          break;

        case 'playerLeave':
          if (remoteMeshes[data.id]) {
            scene.remove(remoteMeshes[data.id]);
            delete remoteMeshes[data.id];
            delete remotePlayers[data.id];
          }
          break;

        case 'chat':
          if (window.addChatMessage) window.addChatMessage(data.name, data.text);
          break;
      }
    } catch (e) {
      console.error('Ошибка обработки WebSocket:', e);
    }
  };

  socket.onclose = () => { isConnected = false; };
  socket.onerror = (err) => console.error('❌ Ошибка сокета:', err);
}

export function sendMove(x, z, rotation) {
  if (isConnected && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'move', x, z, rotation }));
  }
}

function spawnRemotePlayer(id, data) {
  remotePlayers[id] = data;
  const mesh = createRemotePlayerMesh(data.color);
  mesh.position.set(data.x, 0, data.z);
  remoteMeshes[id] = mesh;
}
