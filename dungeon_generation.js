// dungeon_generation.js

// Map dimensions (in tiles)
const mapWidth = 25;
const mapHeight = 18;

// Possible loot types (with prices, bonuses, etc.)
const lootTypes = [
  {
    name: "Quinaria",
    description: "Ancient Sentry currency.",
    type: "coin",
    price: 1,
  },
  {
    name: "Weapon",
    description: "A sword that increases attack.",
    type: "sword",
    attackBonus: 3,
    price: 8,
  },
  {
    name: "Potion",
    description: "A healing potion (restores health).",
    type: "potion",
    price: 4,
  },
  {
    name: "Key",
    description: "Opens the bonus level door.",
    type: "key",
    price: 6,
  },
  {
    name: "Armour",
    description: "Increases defence.",
    type: "armor",
    defenseBonus: 3,
    price: 8,
  },
];

// Returns a random loot item from the array
function getRandomLoot() {
  return lootTypes[Math.floor(Math.random() * lootTypes.length)];
}

/**
 * Generates a dungeon as a 2D array (map[y][x]),
 * where each element is an object { type: 'wall'|'floor'|'loot'|... }.
 */
function generateDungeon() {
  const map = [];
  for (let y = 0; y < mapHeight; y++) {
    map[y] = [];
    for (let x = 0; x < mapWidth; x++) {
      // Make the boundaries walls
      if (x === 0 || y === 0 || x === mapWidth - 1 || y === mapHeight - 1) {
        map[y][x] = { type: "wall" };
      } else {
        const rand = Math.random();
        if (rand < 0.1) {
          map[y][x] = { type: "wall" };
        } else if (rand < 0.15) {
          map[y][x] = { type: "loot", loot: getRandomLoot() };
        } else {
          map[y][x] = { type: "floor" };
        }
      }
    }
  }
  placeExitDoor(map);
  return map;
}

/**
 * Places the exit door (exitDoor) on an outer wall.
 */
function placeExitDoor(map) {
  const borderTiles = [];
  // Top and bottom rows (excluding corners)
  for (let x = 1; x < mapWidth - 1; x++) {
    borderTiles.push({ x: x, y: 0 });
    borderTiles.push({ x: x, y: mapHeight - 1 });
  }
  // Left and right columns (excluding corners)
  for (let y = 1; y < mapHeight - 1; y++) {
    borderTiles.push({ x: 0, y: y });
    borderTiles.push({ x: mapWidth - 1, y: y });
  }
  const chosen = borderTiles[Math.floor(Math.random() * borderTiles.length)];
  map[chosen.y][chosen.x] = { type: "exitDoor" };
}

/**
 * Updates (or creates) the bonus door if the player has picked up a key.
 */
function updateBonusDoor() {
  // Check if a bonus door already exists
  let bonusExists = false;
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (dungeonMap[y][x].type === "bonusDoor") {
        bonusExists = true;
        break;
      }
    }
    if (bonusExists) break;
  }
  if (!bonusExists) {
    // Look for a floor tile inside the dungeon
    const floorTiles = [];
    for (let y = 1; y < mapHeight - 1; y++) {
      for (let x = 1; x < mapWidth - 1; x++) {
        if (dungeonMap[y][x].type === "floor") {
          floorTiles.push({ x, y });
        }
      }
    }
    if (floorTiles.length > 0) {
      const chosen = floorTiles[Math.floor(Math.random() * floorTiles.length)];
      dungeonMap[chosen.y][chosen.x] = { type: "bonusDoor" };
      if (typeof logEvent === "function") {
        logEvent("Bonus door has appeared.");
      }
    }
  }
}

// The generated global dungeon map
const dungeonMap = generateDungeon();

// Global inventory
const inventory = [];

/**
 * Adds an item to the global inventory (aggregating similar items).
 */
function addToInventory(item) {
  const existing = inventory.find((i) => i.name === item.name);
  if (existing) {
    existing.count++;
  } else {
    inventory.push({ ...item, count: 1 });
  }
  updateInventoryPanel();
  // Apply item effects (e.g. increase attack)
  if (typeof applyItemEffects === "function") {
    applyItemEffects(item);
  }
  // If it is a key, update (or create) the bonus door
  if (item.type === "key") {
    updateBonusDoor();
  }
}

/**
 * Checks whether there is loot on this tile and, if so, picks it up.
 */
function pickupLoot(tileX, tileY) {
  const tile = dungeonMap[tileY][tileX];
  if (tile.type === "loot") {
    addToInventory(tile.loot);
    dungeonMap[tileY][tileX] = { type: "floor" };
    if (typeof logEvent === "function") {
      logEvent(`Picked up: ${tile.loot.name}`);
    }
  }
}
