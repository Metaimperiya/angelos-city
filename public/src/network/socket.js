// ============================================================
// WEB SOCKET (МУЛЬТИПЛЕЕР)
// ============================================================

export let socket;
export let myId = '';
export let isConnected = false;
export const remotePlayers = {};
export const remoteMeshes = {};

let lastSend = 0;
const TICK_RATE = 20; // 20 обновлений в секунду

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

// ФИКС 2: Tick Rate
export function sendPosition(x, z, rotation) {
  const now = performance.now();
  if (now - lastSend < 1000 / TICK_RATE) return;
  lastSend = now;

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
// УДАЛЁННЫЕ ИГРОКИ (ЗАГОТОВКА ПОД ИНТЕРПОЛЯЦИЮ)
// ============================================================
function addRemotePlayer(id, data) {
  console.log('👤 Новый игрок:', id);
  // Здесь будет создание Mesh
}

function updateRemotePlayer(id, data) {
  // ФИКС 5: Будет использоваться Lerp
  // remoteMeshes[id].position.lerp(target, 0.2);
}

function removeRemotePlayer(id) {
  console.log('👤 Игрок ушёл:', id);
}
