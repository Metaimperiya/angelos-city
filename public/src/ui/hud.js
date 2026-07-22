// ============================================================
// HUD (СЧЁТЧИК ИГРОКОВ)
// ============================================================

import { remotePlayers } from '../network/sync.js';

export function updateHUD(count) {
  const el = document.getElementById('count-display');
  if (el) el.textContent = count;
}

// Автоматический перерасчет онлайна на основе подключенных игроков
export function refreshHUD() {
  const totalOnline = 1 + Object.keys(remotePlayers).length;
  updateHUD(totalOnline);
}
