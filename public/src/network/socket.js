// ============================================================
// WEB SOCKET (МУЛЬТИПЛЕЕР)
// ============================================================

import * as THREE from 'three';
import { scene } from '../core/scene.js';

export let socket;
export let myId = '';
export let isConnected = false;
export const remotePlayers = {};
export const remoteMeshes = {};

let lastSend = 0;
const TICK_RATE = 20;

// Функция для создания Mesh удалённого игрока (перенесена из game.js)
function createRemotePlayerMesh(color = 0xff4488) {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshPhongMaterial({ color, flatShading: true });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.6), bodyMat);
  body.position.y = 0.7;
  body.castShadow = true;
  group.add(body);
  const headMat = new THREE.MeshPhongMaterial({ color: 0xffccaa, flatShading: true });
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), headMat);
  head.position.y = 1.5;
  head.castShadow = true;
  group.add(head);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  for (let side = -1; side <= 1; side += 2) {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), eyeMat);
    eye.position.set(side * 0.2, 1.6, 0.35);
    group.add(eye);
    const pupil = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), pupilMat);
    pupil.position.set(side * 0.2, 1.6, 0.45);
    group.add(pupil);
  }
  return group;
}

export function initSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  socket = new WebSocket(`${protocol}//${host}`);

  socket.onopen = () => {
    isConnected = true;
    console.log('🟢 Подключено к серверу');
    document.getElementById('loading').textContent = '✅ Подключено!';
    
    // Отправляем приветствие серверу
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
// УДАЛЁННЫЕ ИГРОКИ (ТЕПЕРЬ РАБОТАЮТ)
// ============================================================

function addRemotePlayer(id, data) {
  if (remoteMeshes[id]) return;
  console.log('➕ Создаём Mesh для игрока:', id, data);
  
  const color = data.color || 0xff4488;
  const mesh = createRemotePlayerMesh(color);
  mesh.position.set(data.x || 0, 0, data.z || 0);
  scene.add(mesh);
  remoteMeshes[id] = mesh;
  
  // Сохраняем данные игрока
  remotePlayers[id] = data;
}

function updateRemotePlayer(id, data) {
  if (remoteMeshes[id]) {
    remoteMeshes[id].position.set(data.x || 0, 0, data.z || 0);
    if (data.rotation !== undefined) {
      remoteMeshes[id].rotation.y = data.rotation;
    }
  }
}

function removeRemotePlayer(id) {
  console.log('➖ Удаляем игрока:', id);
  if (remoteMeshes[id]) {
    scene.remove(remoteMeshes[id]);
    delete remoteMeshes[id];
    delete remotePlayers[id];
  }
}
