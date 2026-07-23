// ============================================================
// WEB SOCKET (МУЛЬТИПЛЕЕР)
// ============================================================

export let socket;
export let myId = '';
export let isConnected = false;
export const remotePlayers = {};
export const remoteMeshes = {};

export function initSocket() {
  socket = new WebSocket(`wss://${window.location.hostname}`);

  socket.onopen = () => {
    isConnected = true;
    console.log('🟢 Подключено к серверу');
    // Здесь будет логика подключения
  };

  socket.onmessage = (event) => {
    // Обработка сообщений
  };

  socket.onclose = () => {
    isConnected = false;
    console.log('🔴 Отключено от сервера');
  };
}
