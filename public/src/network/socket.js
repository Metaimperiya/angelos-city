// ============================================================
// WEB SOCKET (МУЛЬТИПЛЕЕР)
// ============================================================

export let socket;
export let myId = '';
export let isConnected = false;
export const remotePlayers = {};
export const remoteMeshes = {};

export function initSocket() {
  // ПРАВИЛЬНЫЙ АДРЕС ДЛЯ RENDER
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  socket = new WebSocket(`${protocol}//${host}`);

  socket.onopen = () => {
    isConnected = true;
    console.log('🟢 Подключено к серверу');
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
    // Обработка сообщений будет добавлена позже
  };

  socket.onclose = () => {
    isConnected = false;
    console.log('🔴 Отключено от сервера');
  };

  socket.onerror = (error) => {
    console.error('❌ Ошибка WebSocket:', error);
  };
}
