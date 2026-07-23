// ============================================================
// WEB SOCKET (МУЛЬТИПЛЕЕР)
// ============================================================

export let socket;
export let myId = '';
export let isConnected = false;
export const remotePlayers = {};
export const remoteMeshes = {};

export function initSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  socket = new WebSocket(`${protocol}//${host}`);

  socket.onopen = () => {
    isConnected = true;
    console.log('🟢 Подключено к серверу');
    document.getElementById('loading').textContent = '✅ Подключено!';
    setTimeout(() => {
      const el = document.getElementById('loading');
      if (el) el.style.display = 'none';
    }, 1000);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'init') {
        myId = data.myId;
        console.log('Мой ID:', myId);
        // Создаём удалённых игроков
        for (const id in data.players) {
          if (id !== myId) {
            addRemotePlayer(id, data.players[id]);
          }
        }
      }
      if (data.type === 'playerJoin') {
        addRemotePlayer(data.id, data);
      }
      if (data.type === 'playerMove') {
        updateRemotePlayer(data.id, data);
      }
      if (data.type === 'playerLeave') {
        removeRemotePlayer(data.id);
      }
    } catch (e) {
      console.error('Ошибка парсинга:', e);
    }
  };

  socket.onclose = () => {
    isConnected = false;
    console.log('🔴 Отключено от сервера');
  };

  socket.onerror = (error) => {
    console.error('❌ Ошибка WebSocket:', error);
  };
}

// ============================================================
// ОТПРАВКА ПОЗИЦИИ
// ============================================================
export function sendPosition(x, z, rotation) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'move',
      x: x,
      z: z,
      rotation: rotation || 0
    }));
  }
}

// ============================================================
// УДАЛЁННЫЕ ИГРОКИ (ПОКА ЗАГЛУШКА)
// ============================================================
function addRemotePlayer(id, data) {
  console.log('👤 Новый игрок:', id);
  // Здесь будет создание Mesh для удалённого игрока
}

function updateRemotePlayer(id, data) {
  // Здесь будет обновление позиции
}

function removeRemotePlayer(id) {
  console.log('👤 Игрок ушёл:', id);
}
