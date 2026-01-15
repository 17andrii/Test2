// Variables
let money=0,houses=0,factories=0,shops=0,parks=0;
let houseCost=10,factoryCost=50,shopCost=100,parkCost=30;

// DOM
const moneyEl=document.getElementById("money");
const housesEl=document.getElementById("houses");
const factoriesEl=document.getElementById("factories");
const shopsEl=document.getElementById("shops");
const parksEl=document.getElementById("parks");
const buildingsEl=document.getElementById("buildings");

const workBtn=document.getElementById("workBtn");
const buyHouseBtn=document.getElementById("buyHouse");
const buyFactoryBtn=document.getElementById("buyFactory");
const buyShopBtn=document.getElementById("buyShop");
const buyParkBtn=document.getElementById("buyPark");
const resetBtn=document.getElementById("resetBtn");

const clickSound=document.getElementById("clickSound");
const buildSound=document.getElementById("buildSound");

// Load Save & Offline Earnings
const save=JSON.parse(localStorage.getItem("idleCitySave"));
let lastTime = Date.now();
if(save){
    money=save.money; houses=save.houses; factories=save.factories; shops=save.shops; parks=save.parks;
    houseCost=save.houseCost; factoryCost=save.factoryCost; shopCost=save.shopCost; parkCost=save.parkCost;
    if(save.lastTime){
        const elapsed=Math.floor((Date.now()-save.lastTime)/1000);
        money+=elapsed*(houses+factories*5+shops*10+parks*2);
        alert(`💰 You earned ${elapsed*(houses+factories*5+shops*10+parks*2)} while away!`);
    }
}

// Save
function saveGame(){ localStorage.setItem("idleCitySave",JSON.stringify({money,houses,factories,shops,parks,houseCost,factoryCost,shopCost,parkCost,lastTime:Date.now()})); }

// Update UI
function updateUI(){
    moneyEl.textContent=Math.floor(money);
    housesEl.textContent=houses;
    factoriesEl.textContent=factories;
    shopsEl.textContent=shops;
    parksEl.textContent=parks;

    buyHouseBtn.textContent=`Buy House (${houseCost})`;
    buyFactoryBtn.textContent=`Buy Factory (${factoryCost})`;
    buyShopBtn.textContent=`Buy Shop (${shopCost})`;
    buyParkBtn.textContent=`Buy Park (${parkCost})`;
}

// Render Buildings
function renderBuildings(){
    buildingsEl.innerHTML="";
    for(let i=0;i<houses;i++){
        const b=document.createElement("div");b.className="building house";buildingsEl.appendChild(b);
    }
    for(let i=0;i<factories;i++){
        const b=document.createElement("div");b.className="building factory";buildingsEl.appendChild(b);
    }
    for(let i=0;i<shops;i++){
        const b=document.createElement("div");b.className="building shop";buildingsEl.appendChild(b);
    }
    for(let i=0;i<parks;i++){
        const b=document.createElement("div");b.className="building park";buildingsEl.appendChild(b);
    }
}

// Floating money
function showMoneyEffect(x,y){ const el=document.createElement("div"); el.className="money-float"; el.textContent="+1"; el.style.left=x+"px"; el.style.top=y+"px"; document.body.appendChild(el); setTimeout(()=>el.remove(),1000); }

// Pop animation when building generates money
function popBuildings(){
    document.querySelectorAll(".building").forEach(b=>{ b.style.animation="pop 0.3s"; setTimeout(()=>b.style.animation="",300); });
}

// Work button
workBtn.onclick=(e)=>{ money++; clickSound.play(); showMoneyEffect(e.clientX,e.clientY); updateUI(); saveGame(); }

// Buy buildings
buyHouseBtn.onclick=()=>{ if(money>=houseCost){ money-=houseCost; houses++; houseCost=Math.floor(houseCost*1.5); buildSound.play(); renderBuildings(); updateUI(); saveGame(); }}
buyFactoryBtn.onclick=()=>{ if(money>=factoryCost){ money-=factoryCost; factories++; factoryCost=Math.floor(factoryCost*1.7); buildSound.play(); renderBuildings(); updateUI(); saveGame(); }}
buyShopBtn.onclick=()=>{ if(money>=shopCost){ money-=shopCost; shops++; shopCost=Math.floor(shopCost*2); buildSound.play(); renderBuildings(); updateUI(); saveGame(); }}
buyParkBtn.onclick=()=>{ if(money>=parkCost){ money-=parkCost; parks++; parkCost=Math.floor(parkCost*1.5); buildSound.play(); renderBuildings(); updateUI(); saveGame(); }}

// Reset
resetBtn.onclick=()=>{ localStorage.removeItem("idleCitySave"); location.reload(); }

// Passive income + animation
setInterval(()=>{ 
    let income=houses+factories*5+shops*10+parks*2;
    money+=income;
    popBuildings();
    updateUI();
    saveGame();
},1000);

// Smooth day/night cycle
let time=0;
setInterval(()=>{
    time=(time+1)%600;
    const city=document.querySelector(".city");
    const ratio=Math.abs(Math.sin(Math.PI*time/600));
    const dayColor=`rgba(${Math.floor(126+129*ratio)},${Math.floor(200+55*ratio)},255,1)`;
    const nightColor=`rgba(${Math.floor(0+50*ratio)},${Math.floor(26+50*ratio)},${Math.floor(51+50*ratio)},1)`;
    city.style.background=`linear-gradient(${dayColor},${nightColor})`;
},1000);

// Init
updateUI();
renderBuildings();
