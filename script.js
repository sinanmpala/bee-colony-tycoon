const beeImage = "assets/assets/bee-worker.svg";

let game = {
  money: 0,
  honey: 0,
  level: 1,
  xp: 0,

  stages: [
    {
      name: "Worker Bee",
      icon: "🐝",
      rate: 1,
      level: 1,
      price: 50,
      unlocked: true,
      color: "#ffd400"
    },

    {
      name: "Golden Bee",
      icon: "👑",
      rate: 5,
      level: 0,
      price: 250,
      unlocked: false,
      color: "#ffb300"
    },

    {
      name: "Red Bee",
      icon: "🔴",
      rate: 15,
      level: 0,
      price: 1000,
      unlocked: false,
      color: "#ff4444"
    },

    {
      name: "Blue Bee",
      icon: "🔵",
      rate: 40,
      level: 0,
      price: 4000,
      unlocked: false,
      color: "#57b8ff"
    },

    {
      name: "Royal Bee",
      icon: "💎",
      rate: 100,
      level: 0,
      price: 15000,
      unlocked: false,
      color: "#cf7bff"
    },

    {
      name: "Queen Bee",
      icon: "👑",
      rate: 300,
      level: 0,
      price: 50000,
      unlocked: false,
      color: "#ff8a00"
    }
  ]
};

/* UI */

const stagesContainer = document.getElementById("stagesContainer");

function renderStages(){

  stagesContainer.innerHTML = "";

  game.stages.forEach((stage,index)=>{

    if(!stage.unlocked) return;

    const stageCard = document.createElement("div");
    stageCard.className = "stageCard";

    stageCard.innerHTML = `
      <div class="stageInfo">

        <div class="stageTitle" style="color:${stage.color}">
          ${stage.icon} Stage ${index+1}
        </div>

        <div class="stageRate">
          ${stage.name}
        </div>

        <div class="stageRate">
          Lv. ${stage.level}
        </div>

        <div class="stageRate">
          +${stage.rate * Math.max(stage.level,1)} honey/sec
        </div>

      </div>

      <div class="honeyGrid">

        <div class="hexPattern"></div>

        <div class="stageBees" id="bees-${index}">
        </div>

      </div>

      <div class="stageRight">

        <button class="upgradeBtn"
          onclick="upgradeStage(${index})">
          Upgrade
        </button>

        <div class="priceTag">
          $${format(stage.price)}
        </div>

      </div>
    `;

    stagesContainer.appendChild(stageCard);

    generateBees(index, stage.level);

  });

}

/* BEE GENERATION */

function generateBees(index, level){

  const container = document.getElementById(`bees-${index}`);

  if(!container) return;

  container.innerHTML = "";

  let beeCount = Math.min(25, Math.max(4, level * 2));

  for(let i=0;i<beeCount;i++){

    const bee = document.createElement("div");

    bee.className = "gameBee";

    bee.style.backgroundImage = `url(${beeImage})`;

    bee.style.left = Math.random() * 85 + "%";
    bee.style.top = Math.random() * 70 + "%";

    bee.style.animationDelay =
      Math.random() * 4 + "s";

    bee.style.animationDuration =
      2 + Math.random() * 4 + "s";

    bee.style.transform =
      `scale(${0.5 + Math.random()})`;

    bee.style.filter =
      `hue-rotate(${index * 45}deg)
       drop-shadow(0 0 10px rgba(255,196,0,.35))`;

    container.appendChild(bee);

  }

}

/* UPGRADE */

function upgradeStage(index){

  let stage = game.stages[index];

  if(game.money < stage.price) return;

  game.money -= stage.price;

  stage.level++;

  game.xp += 10;

  stage.price = Math.floor(stage.price * 1.7);

  /* unlock next */

  if(index + 1 < game.stages.length){

    if(stage.level >= 5){

      game.stages[index + 1].unlocked = true;

      if(game.stages[index + 1].level === 0){
        game.stages[index + 1].level = 1;
      }

    }

  }

  updateLevel();

  render();

}

/* PLAYER LEVEL */

function updateLevel(){

  if(game.xp >= game.level * 100){

    game.xp = 0;

    game.level++;

  }

}

/* PRODUCTION */

function gameLoop(){

  let total = 0;

  game.stages.forEach(stage=>{

    if(stage.unlocked){

      total +=
        stage.rate *
        Math.max(stage.level,1);

    }

  });

  game.honey += total / 10;

  game.money += total / 20;

  renderTop();

}

/* TOP */

function renderTop(){

  document.getElementById("moneyText")
    .innerText =
    "$" + format(Math.floor(game.money));

  document.getElementById("honeyText")
    .innerText =
    format(Math.floor(game.honey));

  document.getElementById("levelText")
    .innerText =
    game.level;

  document.getElementById("xpFill")
    .style.width =
    (game.xp / (game.level * 100) * 100) + "%";

}

/* MAIN RENDER */

function render(){

  renderTop();

  renderStages();

}

/* FORMAT */

function format(num){

  if(num >= 1000000){

    return (num / 1000000).toFixed(1) + "M";

  }

  if(num >= 1000){

    return (num / 1000).toFixed(1) + "K";

  }

  return num;

}

/* PARTICLE BEES */

function createParticleBees(){

  const container =
    document.getElementById("beeParticles");

  for(let i=0;i<14;i++){

    const bee =
      document.createElement("div");

    bee.className = "particleBee";

    bee.style.backgroundImage =
      `url(${beeImage})`;

    bee.style.top =
      Math.random() * 100 + "vh";

    bee.style.left =
      (-100 - Math.random() * 400) + "px";

    bee.style.animationDuration =
      10 + Math.random() * 20 + "s";

    bee.style.animationDelay =
      Math.random() * 10 + "s";

    bee.style.transform =
      `scale(${0.3 + Math.random()})`;

    bee.style.filter =
      `hue-rotate(${Math.random()*360}deg)
       opacity(.7)`;

    container.appendChild(bee);

  }

}

/* SAVE */

function saveGame(){

  localStorage.setItem(
    "beeFactorySave",
    JSON.stringify(game)
  );

}

/* LOAD */

function loadGame(){

  const save =
    localStorage.getItem("beeFactorySave");

  if(save){

    game = JSON.parse(save);

  }

}

/* AUTO SAVE */

setInterval(()=>{

  saveGame();

},5000);

/* START */

loadGame();

render();

createParticleBees();

setInterval(gameLoop,100);
