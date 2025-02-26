/**
 * Only significant events:
 * - Loot pickup,
 * - Enemy attacks/death,
 * - Exiting the dungeon,
 * - Activation of bonus doors, etc.
 */
function logEvent(message) {
  const eventLog = document.getElementById("eventLog");
  if (!eventLog) return;

  const p = document.createElement("p");
  const timestamp = new Date().toLocaleTimeString();
  p.textContent = `[${timestamp}] ${message}`;
  eventLog.appendChild(p);
  eventLog.scrollTop = eventLog.scrollHeight;
}
