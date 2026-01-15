// Variables
let money = 10;
const buildings = [];
const buildingTypes = {
  house:{cost:10,income:1,level:1},
  factory:{cost:50,income:5,level:1},
  shop:{cost:100,income:10,level:1},
  park:{cost:30,income:2,level:1},
  school:{cost:200,income:15,level:1},
  hospital:{cost:500,income:25,level:1},
  airport:{cost:2000,income:100,level:1}
};

// DOM
const moneyEl = document.getElementById("money");
const buildingsEl = document.getElementById("buildings");
const buildMenu = document.getElementById("buildMenu");
const resetBtn = document.getElementById("resetBtn");
const terrainCanvas = document.getElementById("terrainCanvas");
const ctx = terrainCanvas.getContext("2d");

// Initialize terrain
function drawTerrain(){
  terrainCanvas.width = 20000;
  terrainCanvas.height = 300;
  // Grass
  ctx.fillStyle="#4caf50";
  ctx.fillRect(0,0,terrainCanvas.width,terrainCanvas.height);
  // Roads
  ctx.fillStyle="#7f8c8d";
  for(let i=0;i<terrainCanvas.width;i+=300){
    ctx.fillRect(i,terrainCanvas.height-50,200,50);
  }
  // Trees
  for(let i=50;i<terrainCanvas.width;i+=400){
    ctx.fillStyle="#27ae60"; ctx.beginPath();
    ctx.arc(i,terrainCanvas.height-70,20,0,Math.PI*2);
    ctx.fill();
  }
}
drawTerrain();

// Load saved game
const save = JSON.parse(localStorage.getItem("idleCitySave"));
if(save){
  money = save.money;
  save.buildings.forEach(b=>buildings.push(b));
}

// Save game
function saveGame(){
  localStorage.setItem("idleCitySave",JSON.stringify({money,buildings}));
}

// Update money display
function updateUI(){ moneyEl.textContent = Math.floor(money); }

// Render buildings
function renderBuildings(){
  buildingsEl.innerHTML="";
  buildings.forEach(b=>{
    const div = document.createElement("div");
    div.className = "building "+b.type;
    const lbl = document.createElement("div");
    lbl.className = "label";
    lbl.textContent = `+${buildingTypes[b.type].income*b.level}/sec L${b.level}`;
    div.appendChild(lbl);
    buildingsEl.appendChild(div);
  });
}

// Add build buttons
Object.keys(buildingTypes).forEach(type=>{
  const btn = document.createElement("button");
  btn.className = "build-btn";
  btn.textContent = `${type.charAt(0).toUpperCase()+type.slice(1)} (${buildingTypes[type].cost})`;
  btn.onclick = () => buyBuilding(type);
  buildMenu.appendChild(btn);
});

// Buy or upgrade building
function buyBuilding(type){
  const cost = buildingTypes[type].cost;
  const existing = buildings.find(b=>b.type===type);
  if(existing){
    // Upgrade building
    const upgradeCost = Math.floor(cost*existing.level*1.5);
    if(money>=upgradeCost){
      money-=upgradeCost;
      existing.level++;
      renderBuildings();
      updateUI();
      saveGame();
    } else alert("Not enough money to upgrade!");
  } else {
    // Buy new
    if(money>=cost){
      money-=cost;
      buildings.push({type,level:1});
      renderBuildings();
      updateUI();
      saveGame();
    } else alert("Not enough money!");
  }
}

// Reset
resetBtn.onclick = ()=>{
  if(confirm("Reset everything?")){
    localStorage.removeItem("idleCitySave");
    location.reload();
  }
};

// Passive income
setInterval(()=>{
  let income = buildings.reduce((sum,b)=>sum + buildingTypes[b.type].income*b.level,0);
  money += income;
  updateUI();
},1000);

// Initial render
renderBuildings();
updateUI();
