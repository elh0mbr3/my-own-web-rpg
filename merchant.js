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
    name: "Stronger Armor",
    description: "Increases defense (+5).",
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
 * Shows the merchant screen (on the left).
 * Instead of the canvas, the player sees a purchase/sell menu.
 */
function openMerchantScreen() {
  let merchantScreen = document.getElementById("merchantScreen");
  if (!merchantScreen) {
    // If the element doesn't exist yet, create it
    merchantScreen = document.createElement("div");
    merchantScreen.id = "merchantScreen";
    merchantScreen.style.position = "absolute";
    merchantScreen.style.left = "0";
    merchantScreen.style.top = "0";
    merchantScreen.style.width = "300px";
    merchantScreen.style.height = "768px";
    merchantScreen.style.backgroundColor = "#fff";
    merchantScreen.style.color = "#000";
    merchantScreen.style.padding = "10px";
    merchantScreen.style.overflowY = "auto";
    merchantScreen.style.zIndex = "999";
    merchantScreen.style.fontSize = "16px";
    document.body.appendChild(merchantScreen);
  }
  merchantScreen.innerHTML = renderMerchantUI();
  merchantScreen.style.display = "block";
}

/** Hides the merchant screen */
function closeMerchantScreen() {
  const merchantScreen = document.getElementById("merchantScreen");
  if (merchantScreen) {
    merchantScreen.style.display = "none";
  }
}

/** Returns the HTML code for the merchant interface */
function renderMerchantUI() {
  let html = "<h2>Merchant</h2>";
  html += "<h3>Buy:</h3><ul>";
  merchantInventory.forEach((item, i) => {
    html += `<li>${item.name} - ${item.price} coins
          <button onclick="buyItem(${i})">Buy</button></li>`;
  });
  html += "</ul>";
  html += "<h3>Sell (click on an item in your inventory):</h3>";
  html += '<button onclick="closeMerchantScreen()">Return</button>';
  return html;
}

/** Buying an item */
function buyItem(index) {
  const item = merchantInventory[index];
  if (player.coins >= item.price) {
    player.coins -= item.price;
    addToInventory(item);
    updatePlayerStats();
    updateInventoryPanel();
    alert(`You purchased: ${item.name}`);
  } else {
    alert("Not enough coins to buy this item.");
  }
}

/** Selling an item (by clicking on it in the inventory) */
function sellItem(itemName) {
  const idx = inventory.findIndex((i) => i.name === itemName);
  if (idx > -1) {
    const it = inventory[idx];
    // Sell price = half of its original price (or 2 by default)
    const sellPrice = Math.floor((it.price || 4) / 2);
    player.coins += sellPrice;
    if (it.count > 1) {
      it.count--;
    } else {
      inventory.splice(idx, 1);
    }
    updatePlayerStats();
    updateInventoryPanel();
    alert(`You sold: ${it.name} for ${sellPrice} coins.`);
  }
}
