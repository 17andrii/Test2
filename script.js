let money = 0;
let houses = 0;
let houseCost = 10;

// Load saved data
if (localStorage.getItem("idleCitySave")) {
  const save = JSON.parse(localStorage.getItem("idleCitySave"));
  money = save.money;
  houses = save.houses;
}

const moneyEl = document.getElementById("money");
const housesEl = document.getElementById("houses");
const buyHouseBtn = document.getElementById("buyHouse");

function updateUI() {
  moneyEl.textContent = Math.floor(money);
  housesEl.textContent = houses;
  buyHouseBtn.textContent = `Buy House (Cost: ${houseCost})`;
}

function saveGame() {
  localStorage.setItem(
    "idleCitySave",
    JSON.stringify({ money, houses })
  );
}

// Buy house
buyHouseBtn.addEventListener("click", () => {
  if (money >= houseCost) {
    money -= houseCost;
    houses++;
    houseCost = Math.floor(houseCost * 1.5);
    updateUI();
    saveGame();
  }
});

// Generate money every second
setInterval(() => {
  money += houses;
  updateUI();
  saveGame();
}, 1000);

updateUI();
