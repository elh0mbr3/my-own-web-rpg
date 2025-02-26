// enemy.js

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = tileSize;
    this.height = tileSize;
    this.colour = "#00ff00"; // British: "colour" instead of "color"
    this.health = 20;
    this.attack = 2;
    // Starting position to limit movement radius
    this.initialX = x;
    this.initialY = y;
    this.moveRadius = tileSize * 3; // can move within 3 tiles from the start
    this.dead = false;
  }

  update() {
    // Random movement with a certain probability
    if (Math.random() < 0.3) {
      this.randomMove();
    }
    // Check collision with the player
    if (isColliding(this, player)) {
      // Exchange blows
      player.health -= this.attack;
      this.health -= player.attack;
      if (typeof logEvent === "function") {
        logEvent(
          `Enemy attacks! Player HP: ${player.health}, Enemy HP: ${this.health}`
        );
      }
      updatePlayerStats();
      if (player.health <= 0) {
        alert("You have died!");
      }
      if (this.health <= 0) {
        this.dead = true;
        if (typeof logEvent === "function") {
          logEvent("Enemy has perished!");
        }
      }
    }
  }

  /** Checks whether the enemy's next step is not into a wall or out of bounds */
  randomMove() {
    const dirs = [
      { dx: tileSize, dy: 0 },
      { dx: -tileSize, dy: 0 },
      { dx: 0, dy: tileSize },
      { dx: 0, dy: -tileSize },
    ];
    const move = dirs[Math.floor(Math.random() * dirs.length)];
    let newX = this.x + move.dx;
    let newY = this.y + move.dy;
    let tileX = Math.floor(newX / tileSize);
    let tileY = Math.floor(newY / tileSize);
    // Boundaries
    if (tileX < 0 || tileY < 0 || tileX >= mapWidth || tileY >= mapHeight) {
      return;
    }
    // Check if the target tile is not a wall
    const targetTile = dungeonMap[tileY][tileX];
    // The enemy can traverse floor, loot, bonusDoor (but not exitDoor or wall)
    const walkableTypes = ["floor", "loot", "bonusDoor"];
    if (!walkableTypes.includes(targetTile.type)) {
      return;
    }
    // Check the movement radius
    if (
      Math.abs(newX - this.initialX) > this.moveRadius ||
      Math.abs(newY - this.initialY) > this.moveRadius
    ) {
      return;
    }
    // If all is well, move the enemy
    this.x = newX;
    this.y = newY;
  }

  draw(ctx) {
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

/** Simple rectangle collision detection (enemy vs player) */
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Array of enemies
const enemies = [];

/** Spawn 3 enemies on random floor tiles */
function spawnEnemies() {
  for (let i = 0; i < 3; i++) {
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * mapWidth);
      const y = Math.floor(Math.random() * mapHeight);
      if (dungeonMap[y][x].type === "floor") {
        enemies.push(new Enemy(x * tileSize, y * tileSize));
        placed = true;
        if (typeof logEvent === "function") {
          logEvent("Enemy has appeared.");
        }
      }
    }
  }
}

/** Updates the state of enemies: movement, attacks, and death */
function updateEnemies() {
  enemies.forEach((e) => e.update());
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].dead) {
      enemies.splice(i, 1);
    }
  }
}
