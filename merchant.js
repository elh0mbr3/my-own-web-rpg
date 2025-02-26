// merchant.js

// Example merchant inventory
const merchantInventory = [
  {
    name: "More Powerful Sword",
    description: "Increases attack (+5).",
    type: "sword",
    attackBonus: 5,
    price: 10,
  },
  {
    name: "Stronger Armour",
    description: "Increases defence (+5).",
    type: "armor",
    defenseBonus: 5,
    price: 10,
  },
  {
    name: "Health Potion",
    description: "Restores 20 HP.",
    type: "potion",
    price: 5,
  },
];

/**
 * Opens (displays) the merchant screen:
 *  - Hides the game container (#gameContainer).
 *  - Shows or creates the #merchantScreen block with buy and sell menus.
 */
function openMerchantScreen() {
  // Hide the game container
  const gameContainer = document.getElementById("gameContainer");
  if (gameContainer) {
    gameContainer.style.display = "none";
  }

  // Find or create the merchant screen element
  let merchantScreen = document.getElementById("merchantScreen");
  if (!merchantScreen) {
    merchantScreen = document.createElement("div");
    merchantScreen.id = "merchantScreen";
    document.body.appendChild(merchantScreen);
  }

  // Style the merchant screen for readability
  merchantScreen.style.display = "block";
  merchantScreen.style.position = "absolute";
  merchantScreen.style.left = "0";
  merchantScreen.style.top = "0";
  merchantScreen.style.width = "100%";
  merchantScreen.style.height = "100%";
  merchantScreen.style.backgroundColor = "#000"; // dark background
  merchantScreen.style.color = "#fff"; // light text
  merchantScreen.style.padding = "20px";
  merchantScreen.style.fontSize = "18px";
  merchantScreen.style.overflowY = "auto";
  merchantScreen.style.zIndex = "999";

  // Generate the merchant UI, including the player's inventory for selling
  merchantScreen.innerHTML = `
      <h2>Merchant</h2>
  
      <h3>Buy:</h3>
      <ul>
        ${merchantInventory
          .map(
            (item, i) => `
            <li>
              ${item.name} - ${item.price} coins 
              <button onclick="buyItem(${i})">Buy</button>
            </li>
          `
          )
          .join("")}
      </ul>
  
      <h3>Sell (click an item in your inventory):</h3>
      ${renderPlayerInventoryForSelling()}
  
      <button onclick="closeMerchantScreen()">Return</button>
    `;
}

/**
 * Closes (hides) the merchant screen and returns to the game container.
 */
function closeMerchantScreen() {
  const merchantScreen = document.getElementById("merchantScreen");
  if (merchantScreen) {
    merchantScreen.style.display = "none";
  }

  const gameContainer = document.getElementById("gameContainer");
  if (gameContainer) {
    gameContainer.style.display = "block";
  }

  // If you use an inDungeon flag, reset it here so the game resumes
  inDungeon = true;
}

/**
 * Renders the player's current inventory items as a list for selling.
 */
function renderPlayerInventoryForSelling() {
  if (!inventory || inventory.length === 0) {
    return "<p>Your inventory is empty.</p>";
  }
  let html = "<ul>";
  inventory.forEach((item) => {
    html += `
        <li style="cursor:pointer;" onclick="sellItem('${item.name}')">
          ${item.name}${item.count > 1 ? " (" + item.count + ")" : ""}
          – ${item.description}
        </li>
      `;
  });
  html += "</ul>";
  return html;
}

/**
 * Buys an item from the merchant.
 */
function buyItem(index) {
  const item = merchantInventory[index];
  if (player.coins >= item.price) {
    player.coins -= item.price;
    addToInventory(item);
    updatePlayerStats();
    // If you also want to update your separate inventory panel, call updateInventoryPanel() here:
    // updateInventoryPanel();
    alert(`You purchased: ${item.name}`);
  } else {
    alert("Not enough coins to buy this item.");
  }
}

/**
 * Sells an item by name (click on an item in the player's inventory).
 */
function sellItem(itemName) {
  const idx = inventory.findIndex((i) => i.name === itemName);
  if (idx > -1) {
    const it = inventory[idx];
    // Sell price = half of the original price (or 2 by default)
    const sellPrice = Math.floor((it.price || 4) / 2);
    player.coins += sellPrice;

    if (it.count > 1) {
      it.count--;
    } else {
      inventory.splice(idx, 1);
    }

    updatePlayerStats();
    // Update any separate inventory panels or re-render the merchant screen
    // so the item disappears from the list:
    // updateInventoryPanel();
    document.getElementById("merchantScreen").innerHTML = `
        <h2>Merchant</h2>
  
        <h3>Buy:</h3>
        <ul>
          ${merchantInventory
            .map(
              (item, i) => `
              <li>
                ${item.name} - ${item.price} coins 
                <button onclick="buyItem(${i})">Buy</button>
              </li>
            `
            )
            .join("")}
        </ul>
  
        <h3>Sell (click an item in your inventory):</h3>
        ${renderPlayerInventoryForSelling()}
  
        <button onclick="closeMerchantScreen()">Return</button>
      `;
    alert(`You sold: ${it.name} for ${sellPrice} coins.`);
  }
}
