// Game Variables
let money = 0;
let houses = 0;
let factories = 0;
let shops = 0;

let houseCost = 10;
let factoryCost = 50;
let shopCost = 100;

// DOM
const moneyEl = document.getElementById("money");
const housesEl = document.getElementById("houses");
const factoriesEl = document.getElementById("factories");
const shopsEl = document.getElementById("shops");
const buildingsEl = document.getElementById("buildings");

const workBtn = document.getElementById("workBtn");
const buyHouseBtn = document.getElementById("buyHouse");
const buyFactoryBtn = document.getElementById("buyFactory");
const buyShopBtn = document.getElementById("buyShop");
const resetBtn = document.getElementById("resetBtn");

const clickSound = document.getElementById("clickSound");
const buildSound = document.getElementById("buildSound");

// Load Save
const save = JSON.parse(localStorage.getItem("idleCitySave"));
if (save) {
  money = save.money;
  houses = save.houses;
  factories = save.factories;
  shops = save.shops;
  houseCost = save.houseCost;
  factoryCost = save.factoryCost;
  shopCost = save.shopCost;
}

// Save
function saveGame() {
  localStorage.setItem("idleCitySave", JSON.stringify({
    money, houses, factories, shops, houseCost, factoryCost, shopCost
  }));
}

// Update UI
function updateUI() {
  moneyEl.textContent = Math.floor(money);
  housesEl.textContent = houses;
  factoriesEl.textContent = factories;
  shopsEl.textContent = shops;

  buyHouseBtn.textContent = `Buy House (${houseCost})`;
  buyFactoryBtn.textContent = `Buy Factory (${factoryCost})`;
  buyShopBtn.textContent = `Buy Shop (${shopCost})`;
}

// Render Buildings
function renderBuildings() {
  buildingsEl.innerHTML = "";
  for (let i=0;i<houses;i++){
    const b = document.createElement("div");
    b.className="building house";
    buildingsEl.appendChild(b);
  }
  for (let i=0;i<factories;i++){
    const b = document.createElement("div");
    b.className="building factory";
    buildingsEl.appendChild(b);
  }
  for (let i=0;i<shops;i++){
    const b = document.createElement("div");
    b.className="building shop";
    buildingsEl.appendChild(b);
  }
}

// Floating Money
function showMoneyEffect(x,y){
  const el = document.createElement("div");
  el.className="money-float";
  el.textContent="+1";
  el.style.left=x+"px";
  el.style.top=y+"px";
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1000);
}

// Work
workBtn.onclick=(e)=>{
  money++;
  showMoneyEffect(e.clientX,e.clientY);
  clickSound.play();
  updateUI();
  saveGame();
}

// Buy Building
buyHouseBtn.onclick=()=>{
  if(money>=houseCost){
    money-=houseCost;
    houses++;
    houseCost=Math.floor(houseCost*1.5);
    buildSound.play();
    renderBuildings();
    updateUI();
    saveGame();
  }
}
buyFactoryBtn.onclick=()=>{
  if(money>=factoryCost){
    money-=factoryCost;
    factories++;
    factoryCost=Math.floor(factoryCost*1.7);
    buildSound.play();
    renderBuildings();
    updateUI();
    saveGame();
  }
}
buyShopBtn.onclick=()=>{
  if(money>=shopCost){
    money-=shopCost;
    shops++;
    shopCost=Math.floor(shopCost*2);
    buildSound.play();
    renderBuildings();
    updateUI();
    saveGame();
  }
}

// Reset
resetBtn.onclick=()=>{
  localStorage.removeItem("idleCitySave");
  location.reload();
}

// Passive Income
setInterval(()=>{
  money += houses + factories*5 + shops*10;
  updateUI();
  saveGame();
},1000);

// Day/Night cycle
let dayTime = 0;
setInterval(()=>{
  dayTime = (dayTime+1)%60;
  const sky = document.querySelector('.city');
  if(dayTime<30) sky.style.background='linear-gradient(#7ec8ff,#dff3ff)';
  else sky.style.background='linear-gradient(#001a33,#334466)';
},1000);

// Init
updateUI();
renderBuildings();
