// ============================================================
// WEB SOCKET (МУЛЬТИПЛЕЕР)
// ============================================================

export let socket;
export let myId = '';
export let isConnected = false;
export const remotePlayers = {};
export const remoteMeshes = {};

export function initSocket() {
  // ЖЁСТКИЙ АДРЕС ДЛЯ RENDER (ВПИШИ СВОЙ ДОМЕН)
  const wsUrl = 'wss://angelos-city-3.onrender.com';
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    isConnected = true;
    console.log('🟢 Подключено к серверу');
    document.getElementById('loading').textContent = '✅ Подключено!';
    setTimeout(() => {
      const el = document.getElementById('loading');
      if (el) el.style.display = 'none';
    }, 1000);
    // Отправляем приветствие серверу
    socket.send(JSON.stringify({
      type: 'join',
      name: 'Игрок_' + Math.random().toString(36).substr(2, 4),
      x: 0,
      z: 0
    }));
  };

  socket.onmessage = (event) => {
    console.log('📩 Получено сообщение:', event.data);
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'init') {
        console.log('✅ Инициализация получена, игроков:', Object.keys(data.players).length);
      }
    } catch (e) {
      console.error('Ошибка парсинга:', e);
    }
  };

  socket.onclose = () => {
    isConnected = false;
    console.log('🔴 Отключено от сервера');
    document.getElementById('loading').textContent = '❌ Потеря соединения';
  };

  socket.onerror = (error) => {
    console.error('❌ Ошибка WebSocket:', error);
    document.getElementById('loading').textContent = '❌ Ошибка подключения';
  };
}
