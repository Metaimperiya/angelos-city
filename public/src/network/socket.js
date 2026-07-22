// ============================================================
// WEB SOCKET (МУЛЬТИПЛЕЕР)
// ============================================================

export let socket;
export let myId = '';
export let isConnected = false;
export const remotePlayers = {};
export const remoteMeshes = {};

let lastSend = 0;
const TICK_RATE = 20;

export function initSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  socket = new WebSocket(`${protocol}//${host}`);

  socket.onopen = () => {
    isConnected = true;
    console.log('🟢 Подключено к серверу');
    document.getElementById('loading').textContent = '✅ Подключено!';
    
    // ⬇️ ЭТО САМОЕ ВАЖНОЕ: ОТПРАВЛЯЕМ ПРИВЕТСТВИЕ СЕРВЕРУ ⬇️
    socket.send(JSON.stringify({
      type: 'join',
      name: 'Игрок_' + Math.random().toString(36).substr(2, 4),
      x: 0,
      z: 0
    }));

    setTimeout(() => {
      const el = document.getElementById('loading');
      if (el) el.style.display = 'none';
    }, 1000);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('📩 Получено сообщение:', data.type, data);
      
      if (data.type === 'init') {
        myId = data.myId;
        console.log('Мой ID:', myId);
        // Создаём удалённых игроков из списка
        for (const id in data.players) {
          if (id !== myId) {
            addRemotePlayer(id, data.players[id]);
          }
        }
      }
      if (data.type === 'playerJoin') {
        console.log('👤 Новый игрок:', data.id);
        addRemotePlayer(data.id, data);
      }
      if (data.type === 'playerMove') {
        updateRemotePlayer(data.id, data);
      }
      if (data.type === 'playerLeave') {
        console.log('👤 Игрок ушёл:', data.id);
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
// УДАЛЁННЫЕ ИГРОКИ
// ============================================================

// Сюда мы будем добавлять создание Mesh для удалённых игроков
function addRemotePlayer(id, data) {
  console.log('➕ Добавляем игрока:', id, data);
  // Пока просто заглушка — позже добавим создание Mesh
}

function updateRemotePlayer(id, data) {
  // Пока заглушка — позже добавим обновление позиции
}

function removeRemotePlayer(id) {
  console.log('➖ Удаляем игрока:', id);
  // Пока заглушка — позже удалим Mesh
}
