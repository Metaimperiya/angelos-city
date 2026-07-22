// ============================================================
// ИГРОК
// ============================================================

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { scene, camera } from '../core/scene.js';
import { teleportToMainShip } from './Ship.js';

export let playerPos = { x: 0, z: 0, y: 0 };
let playerGroup;
let velocityY = 0;
let isGrounded = true;
const speed = 0.15;

export function createPlayer() {
  playerGroup = new THREE.Group();
  scene.add(playerGroup);

  const color = 0x00ff88;
  const bodyMat = new THREE.MeshPhongMaterial({ color, flatShading: true });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.6), bodyMat);
  body.position.y = 0.7;
  body.castShadow = true;
  playerGroup.add(body);

  const headMat = new THREE.MeshPhongMaterial({ color: 0xffccaa, flatShading: true });
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), headMat);
  head.position.y = 1.5;
  head.castShadow = true;
  playerGroup.add(head);

  // Глаза
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  for (let side = -1; side <= 1; side += 2) {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), eyeMat);
    eye.position.set(side * 0.2, 1.6, 0.35);
    playerGroup.add(eye);
    const pupil = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), pupilMat);
    pupil.position.set(side * 0.2, 1.6, 0.45);
    playerGroup.add(pupil);
  }

  // Телепорт на главный корабль
  const spawn = teleportToMainShip();
  if (spawn) {
    playerPos.x = spawn.x;
    playerPos.z = spawn.z;
  }

  playerGroup.position.set(playerPos.x, playerPos.y, playerPos.z);
}

export function updatePlayer(keys, moveDelta, jumpPressed, euler) {
  // Здесь будет логика движения (пока заглушка)
  // Мы её перенесём из game.js позже
}

export function getPlayerPos() {
  return playerPos;
}
