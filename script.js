// Variables
let money=0,houses=0,factories=0,shops=0,parks=0;
let houseCost=10,factoryCost=50,shopCost=100,parkCost=30;

// DOM
const moneyEl=document.getElementById("money");
const buildingsEl=document.getElementById("buildings");
const workBtn=document.getElementById("workBtn");
const clickSound=document.getElementById("clickSound");
const buildSound=document.getElementById("buildSound");

// Load Save & Offline Earnings
const save=JSON.parse(localStorage.getItem("idleCitySave"));
if(save){
    money=save.money;
    houses=save.houses;
    factories=save.factories;
    shops=save.shops;
    parks=save.parks;
    houseCost=save.houseCost;
    factoryCost=save.factoryCost;
    shopCost=save.shopCost;
    parkCost=save.parkCost;
    if(save.lastTime){
        const elapsed=Math.floor((Date.now()-save.lastTime)/1000);
        money+=elapsed*(houses+factories*5+shops*10+parks*2);
        alert(`💰 You earned ${elapsed*(houses+factories*5+shops*10+parks*2)} while away!`);
    }
}

// Save
function saveGame(){ localStorage.setItem("idleCitySave",JSON.stringify({money,houses,factories,shops,parks,houseCost,factoryCost,shopCost,parkCost,lastTime:Date.now()})); }

// Update UI
function updateUI(){ moneyEl.textContent=Math.floor(money); }

// Render Buildings
function renderBuildings(){
    buildingsEl.innerHTML="";
    const createBuilding=(count,type,label)=>{
        for(let i=0;i<count;i++){
            const b=document.createElement("div");
            b.className="building "+type;
            const lbl=document.createElement("div"); lbl.className="label"; lbl.textContent=label;
            b.appendChild(lbl);
            buildingsEl.appendChild(b);
        }
    }
    createBuilding(houses,"house",`+1/sec`);
    createBuilding(factories,"factory",`+5/sec`);
    createBuilding(shops,"shop",`+10/sec`);
    createBuilding(parks,"park",`+2/sec`);
}

// Floating money
function showMoneyEffect(x,y){ 
    const el=document.createElement("div"); 
    el.className="money-float"; 
    el.textContent="+1"; el.style.left=x+"px"; el.style.top=y+"px"; 
    document.body.appendChild(el); setTimeout(()=>el.remove(),1000); 
}

// Work
workBtn.onclick=(e)=>{
    money++;
    clickSound.play();
    showMoneyEffect(e.clientX,e.clientY);
    updateUI();
    saveGame();
}

// Buy building function
function buyBuilding(type){
    let cost, income;
    if(type==="house"){ if(money<houseCost) return; money-=houseCost; houses++; houseCost=Math.floor(houseCost*1.5); }
    else if(type==="factory"){ if(money<factoryCost) return; money-=factoryCost; factories++; factoryCost=Math.floor(factoryCost*1.7); }
    else if(type==="shop"){ if(money<shopCost) return; money-=shopCost; shops++; shopCost=Math.floor(shopCost*2); }
    else if(type==="park"){ if(money<parkCost) return; money-=parkCost; parks++; parkCost=Math.floor(parkCost*1.5); }
    buildSound.play(); renderBuildings(); updateUI(); saveGame();
}

// Setup initial buildings
renderBuildings();

// Passive income every second with label update
setInterval(()=>{
    let income=houses+factories*5+shops*10+parks*2;
    money+=income;
    updateUI();
},1000);

// Day/night smooth cycle
let time=0;
setInterval(()=>{
    time=(time+1)%600;
    const city=document.querySelector(".city");
    const ratio=Math.abs(Math.sin(Math.PI*time/600));
    const dayColor=`rgba(${Math.floor(126+129*ratio)},${Math.floor(200+55*ratio)},255,1)`;
    const nightColor=`rgba(${Math.floor(0+50*ratio)},${Math.floor(26+50*ratio)},${Math.floor(51+50*ratio)},1)`;
    city.style.background=`linear-gradient(${dayColor},${nightColor})`;
},1000);

// Save periodically
setInterval(()=>saveGame(),5000);

// Buy buttons (you can add UI buttons in the HUD if needed)
document.body.addEventListener("keydown",(e)=>{
    if(e.key==="1") buyBuilding("house");
    else if(e.key==="2") buyBuilding("factory");
    else if(e.key==="3") buyBuilding("shop");
    else if(e.key==="4") buyBuilding("park");
});

