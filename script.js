const SAVE_KEY = "beeColonyTycoonSave";

let game = {
  honey: 0,
  money: 0,
  eggs: 0,

  bees: {
    worker: 1,
    golden: 0,
    red: 0,
    blue: 0,
    royal: 0,
    queen: 0
  },

  costs: {
    worker: 10,
    golden: 100,
    red: 500,
    blue: 1500,
    royal: 5000,
    queen: 25000
  },

  hiveLevel: 1,
  hiveCost: 250,

  factories: 0,
  factoryCost: 2000,

  autoSellers: 0,
  autoSellerCost: 5000,

  lastSaved: Date.now()
};

const beePower = {
  worker: 1,
  golden: 5,
  red: 20,
  blue: 50,
  royal: 150,
  queen: 500
};

function formatNumber(number) {
  return Math.floor(number).toLocaleString();
}

function setMessage(text) {
  document.getElementById("message").textContent = text;
}

function getProduction() {
  const beeProduction =
    game.bees.worker * beePower.worker +
    game.bees.golden * beePower.golden +
    game.bees.red * beePower.red +
    game.bees.blue * beePower.blue +
    game.bees.royal * beePower.royal +
    game.bees.queen * beePower.queen;

  const factoryProduction = game.factories * 100;
  const hiveMultiplier = 1 + (game.hiveLevel - 1) * 0.15;

  return Math.floor((beeProduction + factoryProduction) * hiveMultiplier);
}

function updateScreen() {
  document.getElementById("honey").textContent = formatNumber(game.honey);
  document.getElementById("money").textContent = formatNumber(game.money);
  document.getElementById("eggs").textContent = formatNumber(game.eggs);
  document.getElementById("production").textContent = formatNumber(getProduction());

  document.getElementById("workerBees").textContent = formatNumber(game.bees.worker);
  document.getElementById("goldenBees").textContent = formatNumber(game.bees.golden);
  document.getElementById("redBees").textContent = formatNumber(game.bees.red);
  document.getElementById("blueBees").textContent = formatNumber(game.bees.blue);
  document.getElementById("royalBees").textContent = formatNumber(game.bees.royal);
  document.getElementById("queenBees").textContent = formatNumber(game.bees.queen);

  document.getElementById("workerCost").textContent = formatNumber(game.costs.worker);
  document.getElementById("goldenCost").textContent = formatNumber(game.costs.golden);
  document.getElementById("redCost").textContent = formatNumber(game.costs.red);
  document.getElementById("blueCost").textContent = formatNumber(game.costs.blue);
  document.getElementById("royalCost").textContent = formatNumber(game.costs.royal);
  document.getElementById("queenCost").textContent = formatNumber(game.costs.queen);

  document.getElementById("hiveLevel").textContent = game.hiveLevel;
  document.getElementById("hiveCost").textContent = formatNumber(game.hiveCost);

  document.getElementById("factories").textContent = formatNumber(game.factories);
  document.getElementById("factoryCost").textContent = formatNumber(game.factoryCost);

  document.getElementById("autoSellers").textContent = formatNumber(game.autoSellers);
  document.getElementById("autoSellerCost").textContent = formatNumber(game.autoSellerCost);
}

function sellHoney() {
  if (game.honey <= 0) {
    setMessage("You do not have honey to sell yet.");
    return;
  }

  game.money += game.honey;
  game.honey = 0;
  setMessage("Honey sold successfully.");
  updateScreen();
  saveGame(false);
}

function buyBee(type) {
  const cost = game.costs[type];

  if (game.money < cost) {
    setMessage("Not enough money.");
    return;
  }

  game.money -= cost;
  game.bees[type] += 1;
  game.costs[type] = Math.floor(cost * 1.25);

  setMessage(type.toUpperCase() + " Bee purchased.");
  updateScreen();
  saveGame(false);
}

function upgradeHive() {
  if (game.money < game.hiveCost) {
    setMessage("Not enough money for hive upgrade.");
    return;
  }

  game.money -= game.hiveCost;
  game.hiveLevel += 1;
  game.hiveCost = Math.floor(game.hiveCost * 1.8);

  setMessage("Hive upgraded. Production increased.");
  updateScreen();
  saveGame(false);
}

function buyFactory() {
  if (game.money < game.factoryCost) {
    setMessage("Not enough money for factory.");
    return;
  }

  game.money -= game.factoryCost;
  game.factories += 1;
  game.factoryCost = Math.floor(game.factoryCost * 1.7);

  setMessage("Factory purchased.");
  updateScreen();
  saveGame(false);
}

function buyAutoSeller() {
  if (game.money < game.autoSellerCost) {
    setMessage("Not enough money for auto seller.");
    return;
  }

  game.money -= game.autoSellerCost;
  game.autoSellers += 1;
  game.autoSellerCost = Math.floor(game.autoSellerCost * 2);

  setMessage("Auto seller purchased.");
  updateScreen();
  saveGame(false);
}

function hatchEgg() {
  if (game.eggs < 1) {
    setMessage("You need at least 1 egg.");
    return;
  }

  game.eggs -= 1;

  const roll = Math.random() * 100;
  let beeType = "worker";

  if (roll < 45) {
    beeType = "worker";
  } else if (roll < 70) {
    beeType = "golden";
  } else if (roll < 85) {
    beeType = "red";
  } else if (roll < 95) {
    beeType = "blue";
  } else if (roll < 99) {
    beeType = "royal";
  } else {
    beeType = "queen";
  }

  game.bees[beeType] += 1;
  setMessage("Egg hatched: " + beeType.toUpperCase() + " Bee!");
  updateScreen();
  saveGame(false);
}

function showScreen(screenName) {
  document.getElementById("hiveScreen").classList.remove("active");
  document.getElementById("beesScreen").classList.remove("active");
  document.getElementById("factoryScreen").classList.remove("active");

  document.getElementById("hiveTab").classList.remove("active-tab");
  document.getElementById("beesTab").classList.remove("active-tab");
  document.getElementById("factoryTab").classList.remove("active-tab");

  document.getElementById(screenName + "Screen").classList.add("active");
  document.getElementById(screenName + "Tab").classList.add("active-tab");
}

function saveGame(showMessage = true) {
  game.lastSaved = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(game));

  if (showMessage) {
    setMessage("Game saved.");
  }
}

function loadGame() {
  const savedData = localStorage.getItem(SAVE_KEY);

  if (!savedData) {
    updateScreen();
    return;
  }

  try {
    const savedGame = JSON.parse(savedData);
    game = { ...game, ...savedGame };

    const now = Date.now();
    const offlineSeconds = Math.floor((now - game.lastSaved) / 1000);

    if (offlineSeconds > 5) {
      const maxOfflineSeconds = Math.min(offlineSeconds, 3600);
      const offlineHoney = getProduction() * maxOfflineSeconds;
      game.honey += offlineHoney;

      setMessage("Offline bonus: +" + formatNumber(offlineHoney) + " honey.");
    } else {
      setMessage("Save loaded.");
    }

    updateScreen();
    saveGame(false);
  } catch (error) {
    setMessage("Save file could not be loaded.");
    updateScreen();
  }
}

function resetGame() {
  const confirmReset = confirm("Are you sure you want to reset your game?");

  if (!confirmReset) {
    return;
  }

  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

setInterval(function() {
  game.honey += getProduction();
  updateScreen();
}, 1000);

setInterval(function() {
  if (game.bees.queen > 0) {
    game.eggs += game.bees.queen;
    setMessage("Queen Bee produced eggs.");
    updateScreen();
    saveGame(false);
  }
}, 10000);

setInterval(function() {
  if (game.autoSellers > 0 && game.honey > 0) {
    const amountToSell = Math.floor(game.honey * Math.min(0.25 * game.autoSellers, 1));
    game.honey -= amountToSell;
    game.money += amountToSell;
    setMessage("Auto seller sold " + formatNumber(amountToSell) + " honey.");
    updateScreen();
    saveGame(false);
  }
}, 5000);

setInterval(function() {
  saveGame(false);
}, 15000);

loadGame();
