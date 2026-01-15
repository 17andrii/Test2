let money = 0;
let houses = 0;
let houseCost = 10;

const moneyEl = document.getElementById("money");
const housesEl = document.getElementById("houses");
const buildingsEl = document.getElementById("buildings");

const workBtn = document.getElementById("workBtn");
const buyHouseBtn = document.getElementById("buyHouse");
const resetBtn = document.getElementById("resetBtn");

// Load save
const save = JSON.parse(localStorage.getItem("idleCitySave"));
if (save) {
  money = save.money;
  houses = save.houses;
  houseCost = save.houseCost;
}

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
  buyHouseBtn.textContent = `Buy House (${houseCost})`;
}

function renderBuildings() {
  buildingsEl.innerHTML = "";
  for (let i = 0; i < houses; i++) {
    const house = document.createElement("div");
    house.className = "house";
    buildingsEl.appendChild(house);
  }
}

// Floating money effect
function showMoneyEffect(x, y) {
  const el = document.createElement("div");
  el.className = "money-float";
  el.textContent = "+1";
  el.style.left = x + "px";
  el.style.top = y + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

// Work
workBtn.onclick = (e) => {
  money++;
  showMoneyEffect(e.clientX, e.clientY);
  updateUI();
  saveGame();
};

// Buy house
buyHouseBtn.onclick = () => {
  if (money >= houseCost) {
    money -= houseCost;
    houses++;
    houseCost = Math.floor(houseCost * 1.5);
    renderBuildings();
    updateUI();
    saveGame();
  }
};

// Passive income
setInterval(() => {
  if (houses > 0) {
    money += houses;
    updateUI();
    saveGame();
  }
}, 1000);

// RESET FIX
resetBtn.onclick = () => {
  localStorage.removeItem("idleCitySave");
  location.reload();
};

// Init
updateUI();
renderBuildings();
