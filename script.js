// Variables
let money = 0;
const buildings = [];
const buildingTypes = {
  house: {cost:10,income:1},
  factory: {cost:50,income:5},
  shop: {cost:100,income:10},
  park: {cost:30,income:2},
  school: {cost:200,income:15},
  hospital: {cost:500,income:25},
  airport: {cost:2000,income:100}
};

// DOM elements
const moneyEl = document.getElementById("money");
const buildingsEl = document.getElementById("buildings");
const buildBtns = document.querySelectorAll(".build-btn");
const resetBtn = document.getElementById("resetBtn");

// Load saved game
const save = JSON.parse(localStorage.getItem("idleCitySave"));
if(save){
  money = save.money;
  save.buildings.forEach(b => buildings.push(b));
}

// Save game
function saveGame(){
  localStorage.setItem("idleCitySave", JSON.stringify({money,buildings}));
}

// Update money display
function updateUI(){ moneyEl.textContent = Math.floor(money); }

// Render buildings
function renderBuildings(){
  buildingsEl.innerHTML = "";
  buildings.forEach(b => {
    const div = document.createElement("div");
    div.className = "building " + b.type;
    const lbl = document.createElement("div");
    lbl.className = "label";
    lbl.textContent = `+${buildingTypes[b.type].income}/sec`;
    div.appendChild(lbl);
    buildingsEl.appendChild(div);
  });
}

// Buy building
buildBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;
    const cost = buildingTypes[type].cost;
    if(money >= cost){
      money -= cost;
      buildings.push({type});
      renderBuildings();
      updateUI();
      saveGame();
    } else {
      alert("Not enough money!");
    }
  });
});

// Reset game
resetBtn.addEventListener("click", () => {
  if(confirm("Are you sure you want to reset the city?")){
    localStorage.removeItem("idleCitySave");
    location.reload();
  }
});

// Passive income
setInterval(() => {
  let income = buildings.reduce((sum,b)=>sum+buildingTypes[b.type].income,0);
  money += income;
  updateUI();
},1000);

// Initial render
renderBuildings();
updateUI();
