// ============================================================
// HUD (СЧЁТЧИК ИГРОКОВ)
// ============================================================

export function updateHUD(count) {
  const el = document.getElementById('count-display');
  if (el) el.textContent = count;
}
