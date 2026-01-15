let money = 0;
let houses = 0;
let houseCost = 10;

// Load save
const save = JSON.parse(localStorage.getItem("idleCitySave"));
if (save) {
  money = save.money;
  houses = save.houses;
  houseCost = save.houseCost;
}

const moneyEl = document.getElementById("money");
const housesEl = document.getElementById("houses");
const buildingsEl = document.getElementById("buildings");

const workBtn = document.getElementById("workBtn");
const buyHouseBtn = document.getElementById("buyHouse");

function saveGame() {
  localStorage.setItem("idleCitySave", JSON.stringify({
    money,
    houses,
    houseCost
  }));
}

function updateUI() {
  moneyEl.textContent = Math.floor(money);
  housesEl.textContent = houses;
  buyHouseBtn.textContent = `Buy House (Cost: ${houseCost})`;
}

// Visual buildings
function renderBuildings() {
  buildingsEl.innerHTML = "";
  for (let i = 0; i < houses; i++) {
    const house = document.createElement("div");
    house.className = "house";
    buildingsEl.appendChild(house);
  }
}

// Work button (starter income)
workBtn.addEventListener("click", () => {
  money += 1;
  updateUI();
  saveGame();
});

// Buy house
buyHouseBtn.addEventListener("click", () => {
  if (money >= houseCost) {
    money -= houseCost;
    houses++;
    houseCost = Math.floor(houseCost * 1.5);
    renderBuildings();
    updateUI();
    saveGame();
  }
});

// Passive income
setInterval(() => {
  money += houses;
  updateUI();
  saveGame();
}, 1000);

// Init
updateUI();
renderBuildings();
