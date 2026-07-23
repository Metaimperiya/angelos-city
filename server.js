wss.on('connection', (ws) => {
  // Отправляем новому игроку список всех игроков
  ws.send(JSON.stringify({
    type: 'init',
    players: players,
    myId: id
  }));

  // Сообщаем всем остальным, что новый игрок появился
  broadcast({
    type: 'playerJoin',
    id: id,
    x: players[id].x,
    z: players[id].z,
    color: players[id].color,
    name: players[id].name
  }, ws);
});
