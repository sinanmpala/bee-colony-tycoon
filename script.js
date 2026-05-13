const SAVE_KEY = "beeColonyTycoonSaveV3";

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
    golden: 80,
    red: 350,
    blue: 900,
    royal: 3000,
    queen: 12000
  },

  hiveLevel: 1,
  hiveCost: 120,

  factories: 0,
  factoryCost: 1000,

  autoSellers: 0,
  autoSellerCost: 2500,

  manualPower: 1,
  totalClicks: 0,
  totalHoneyCollected: 0,
  totalHoneySold: 0,
  playerLevel: 1,
  questIndex: 0,
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

const quests = [
  {
    text: "Collect 50 honey",
    check: () => game.totalHoneyCollected >= 50,
    reward: () => {
      game.money += 25;
      setMessage("Quest complete. Reward: $25.");
    }
  },
  {
    text: "Sell 100 honey",
    check: () => game.totalHoneySold >= 100,
    reward: () => {
      game.eggs += 1;
      setMessage("Quest complete. Reward: 1 egg.");
    }
  },
  {
    text: "Buy 3 Worker Bees",
    check: () => game.bees.worker >= 3,
    reward: () => {
      game.money += 75;
      setMessage("Quest complete. Reward: $75.");
    }
  },
  {
    text: "Buy 1 Golden Bee",
    check: () => game.bees.golden >= 1,
    reward: () => {
      game.eggs += 1;
      setMessage("Quest complete. Reward: 1 egg.");
    }
  },
  {
    text: "Reach Hive Level 2",
    check: () => game.hiveLevel >= 2,
    reward: () => {
      game.money += 200;
      setMessage("Quest complete. Reward: $200.");
    }
  },
  {
    text: "Buy 1 Factory",
    check: () => game.factories >= 1,
    reward: () => {
      game.eggs += 2;
      setMessage("Quest complete. Reward: 2 eggs.");
    }
  },
  {
    text: "Buy 1 Queen Bee",
    check: () => game.bees.queen >= 1,
    reward: () => {
      game.money += 2500;
      game.eggs += 5;
      setMessage("Quest complete. Reward: $2500 and 5 eggs.");
    }
  }
];

function getEl(id) {
  return document.getElementById(id);
}

function formatNumber(number) {
  return Math.floor(number).toLocaleString();
}

function setMessage(text) {
  const box = getEl("message");
  if (box) box.textContent = text;
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

function updateText(id, value) {
  const element = getEl(id);
  if (element) element.textContent = value;
}

function updateQuestScreen() {
  const quest = quests[game.questIndex];

  if (!quest) {
    updateText("questText", "All quests completed. Build your colony.");
  } else {
    updateText("questText", quest.text);
  }

  updateText("playerLevel", formatNumber(game.playerLevel));
}

function updateScreen() {
  updateText("honey", formatNumber(game.honey));
  updateText("money", formatNumber(game.money));
  updateText("eggs", formatNumber(game.eggs));
  updateText("production", formatNumber(getProduction()));

  updateText("workerBees", formatNumber(game.bees.worker));
  updateText("goldenBees", formatNumber(game.bees.golden));
  updateText("redBees", formatNumber(game.bees.red));
  updateText("blueBees", formatNumber(game.bees.blue));
  updateText("royalBees", formatNumber(game.bees.royal));
  updateText("queenBees", formatNumber(game.bees.queen));

  updateText("workerCost", formatNumber(game.costs.worker));
  updateText("goldenCost", formatNumber(game.costs.golden));
  updateText("redCost", formatNumber(game.costs.red));
  updateText("blueCost", formatNumber(game.costs.blue));
  updateText("royalCost", formatNumber(game.costs.royal));
  updateText("queenCost", formatNumber(game.costs.queen));

  updateText("hiveLevel", formatNumber(game.hiveLevel));
  updateText("hiveCost", formatNumber(game.hiveCost));

  updateText("factories", formatNumber(game.factories));
  updateText("factoryCost", formatNumber(game.factoryCost));

  updateText("autoSellers", formatNumber(game.autoSellers));
  updateText("autoSellerCost", formatNumber(game.autoSellerCost));

  updateQuestScreen();
}

function collectHoney() {
  const amount = game.manualPower + game.hiveLevel;
  game.honey += amount;
  game.totalClicks += 1;
  game.totalHoneyCollected += amount;

  setMessage("Collected +" + formatNumber(amount) + " honey.");

  updateScreen();
  saveGame(false);
}

function sellHoney() {
  if (game.honey <= 0) {
    setMessage("You do not have honey to sell yet.");
    return;
  }

  game.money += game.honey;
  game.totalHoneySold += game.honey;
  game.honey = 0;

  setMessage("Honey sold. Buy bees or upgrades.");
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
  game.manualPower += 1;
  game.hiveCost = Math.floor(game.hiveCost * 1.75);

  setMessage("Hive upgraded. Tap power and production increased.");
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

  setMessage("Factory purchased. Production increased.");
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

  if (roll < 45) beeType = "worker";
  else if (roll < 70) beeType = "golden";
  else if (roll < 85) beeType = "red";
  else if (roll < 95) beeType = "blue";
  else if (roll < 99) beeType = "royal";
  else beeType = "queen";

  game.bees[beeType] += 1;
  setMessage("Egg hatched: " + beeType.toUpperCase() + " Bee.");
  updateScreen();
  saveGame(false);
}

function claimQuest() {
  const quest = quests[game.questIndex];

  if (!quest) {
    setMessage("All quests are already completed.");
    return;
  }

  if (!quest.check()) {
    setMessage("Quest is not completed yet.");
    return;
  }

  quest.reward();
  game.questIndex += 1;
  game.playerLevel += 1;

  updateScreen();
  saveGame(false);
}

function showScreen(screenName) {
  const screens = ["hive", "bees", "factory"];

  screens.forEach(function(name) {
    const screen = getEl(name + "Screen");
    const tab = getEl(name + "Tab");

    if (screen) screen.classList.remove("active");
    if (tab) tab.classList.remove("active-tab");
  });

  const selectedScreen = getEl(screenName + "Screen");
  const selectedTab = getEl(screenName + "Tab");

  if (selectedScreen) selectedScreen.classList.add("active");
  if (selectedTab) selectedTab.classList.add("active-tab");

  setMessage(screenName.toUpperCase() + " menu opened.");
}

function saveGame(showMessage = true) {
  game.lastSaved = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(game));

  if (showMessage) setMessage("Game saved.");
}

function loadGame() {
  const savedData = localStorage.getItem(SAVE_KEY);

  if (!savedData) {
    updateScreen();
    setMessage("Start by collecting honey.");
    return;
  }

  try {
    const savedGame = JSON.parse(savedData);

    game = {
      ...game,
      ...savedGame,
      bees: { ...game.bees, ...savedGame.bees },
      costs: { ...game.costs, ...savedGame.costs }
    };

    const now = Date.now();
    const offlineSeconds = Math.floor((now - game.lastSaved) / 1000);

    if (offlineSeconds > 5) {
      const maxOfflineSeconds = Math.min(offlineSeconds, 3600);
      const offlineHoney = getProduction() * maxOfflineSeconds;
      game.honey += offlineHoney;
      game.totalHoneyCollected += offlineHoney;
      setMessage("Offline bonus: +" + formatNumber(offlineHoney) + " honey.");
    } else {
      setMessage("Save loaded.");
    }

    updateScreen();
    saveGame(false);
  } catch (error) {
    setMessage("Save could not be loaded. Starting new game.");
    updateScreen();
  }
}

function resetGame() {
  const confirmReset = confirm("Are you sure you want to reset your game?");

  if (!confirmReset) return;

  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

setInterval(function() {
  const production = getProduction();
  game.honey += production;
  game.totalHoneyCollected += production;
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
    game.totalHoneySold += amountToSell;
    setMessage("Auto seller sold " + formatNumber(amountToSell) + " honey.");
    updateScreen();
    saveGame(false);
  }
}, 5000);

setInterval(function() {
  saveGame(false);
}, 15000);

document.addEventListener("DOMContentLoaded", function() {
  loadGame();

  const hiveVisual = document.querySelector(".hive-area");

  if (hiveVisual) {
    hiveVisual.addEventListener("click", collectHoney);
  }

  showScreen("hive");
});
