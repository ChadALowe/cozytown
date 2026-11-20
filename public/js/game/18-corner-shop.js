/* ---- SINGH'S CORNER SHOP: groceries, snacks, drinks, papers and scratch cards. Mr Singh serves from behind the counter. ---- */
const CSN="SINGH'S CORNER SHOP";
Object.assign(HRS,{[CSN]:[7,23]});
TH[CSN]={wall:0xf2ecd8,fl:'tile2',cnt:0x0e5a2e,top:0xd8d4c8,sh:0x0e5a2e};
const CSITEMS=[
 ['CRISPS',1,14,0,'CRUNCH! FOOD +14'],['CHOCOLATE BAR',1,16,4,'CHOCOLATEY. FOOD +16 ENERGY +4'],['BAG OF SWEETS',1,10,6,'SUGAR RUSH! FOOD +10 ENERGY +6'],
 ['SAMOSAS (2)',2,30,3,'HOT AND SPICY. FOOD +30'],['MEAL DEAL',4,48,8,'SANDWICH, CRISPS AND A DRINK. FOOD +48'],['BANANA',1,12,4,'HEALTHY! FOOD +12'],
 ['FIZZY DRINK',1,4,14,'FIZZ! ENERGY +14'],['ENERGY DRINK',2,2,34,'WIDE AWAKE! ENERGY +34'],['CUP OF CHAI',1,8,16,'MR SINGH\'S MASALA CHAI. ENERGY +16'],
 ['PINT OF MILK',1,10,4,'FOOD +10'],['LOAF OF BREAD',1,22,2,'FOOD +22']];
const CSLINES=['Sat sri akal! What can I get you today?','Samosas are fresh this morning. My wife makes them.','Open seven till late, every day of the year.','Scratch cards are lucky today, I can feel it.','You look tired. Have a cup of chai, on me next time.'];
let csLine=0;
CUSTOM_SHOP.corner=function(msg){document.getElementById('shT').textContent="SINGH'S CORNER SHOP";document.getElementById('shMsg').textContent=msg||'SNACKS, DRINKS AND ESSENTIALS';
 for(const[n,p,h,e,m]of CSITEMS)dRow(n+(h?'  FOOD +'+h:'')+(e?'  ENERGY +'+e:''),[['BUY £'+p,()=>{if(cash<p)return renderShop('NOT ENOUGH CASH');cash-=p;fed(h,e,m+' (-£'+p+')');renderShop('THANK YOU!')}]]);
 dRow('NEWSPAPER  (THE COZY GAZETTE)',[['BUY £1',()=>{if(cash<1)return renderShop('NOT ENOUGH CASH');cash-=1;renderShop('HEADLINE: '+['VILLAGE ROVERS WIN AGAIN!','HOLT FARM RECORD HARVEST','CASINO JACKPOT STILL GROWING','NEW FLIGHTS TO MARLOWE','RANI\'S SILK HOUSE OPENS ON HIGH STREET'][Math.floor(Math.random()*5)])}]]);
 dRow('SCRATCH CARD',[['£1',()=>{closeShop();scrOpen(1)}],['GOLD £5',()=>{closeShop();scrOpen(5)}]])};
function buildCorner(o){IA.splice(0,IA.length,LEAVE_IA());IROOM.splice(0,IROOM.length,[-8,8,-RZ-1,-RZ+.75]);
 const pal=[0xd02828,0x2860d8,0xf0c020,0x28a048,0xf08020,0x9040b0,0xf0f0f0,0x20a0c0];let q=0;const pk=()=>pal[(q=(q+3)%101)%pal.length];
 /* back wall shelving packed with goods */
 for(let sx=-5.1;sx<=5.1;sx+=1.7){gbox(SG,sx,0,-RZ+.35,1.6,2.1,.55,0x8a6a44);for(let r=0;r<4;r++){gbox(SG,sx,.15+r*.5,-RZ+.38,1.55,.04,.55,0xd8d0c0);for(let k=0;k<6;k++)gbox(SG,sx-.62+k*.25,.19+r*.5,-RZ+.55,.2,.18+(k%3)*.06,.18,pk())}}
 sPlane(4.2,.5,0,2.4,-RZ+.03,0,txtTex(512,60,'#0e5a2e','#ffffff',"SINGH'S  ·  OPEN 7 TILL LATE",28));
 /* drinks fridges on the right wall */
 for(const fz of[-1.6,-.2,1.2]){gbox(SG,RX-.4,0,fz,.75,2.1,1.25,0xe8ecf0);gbox(SG,RX-.79,.15,fz,.03,1.85,1.12,0xb8e0f0);for(let r=0;r<4;r++)for(let k=0;k<5;k++)gbox(SG,RX-.55,.25+r*.45,fz-.45+k*.22,.12,.28,.12,[0xd02020,0x20a040,0xf0a010,0x2060d0,0x30c0e0][(k+r)%5])}
 IROOM.push([RX-.8,RX,-2.3,1.9]);
 /* counter on the left with the till, sweet jars and a scratch card stand */
 gbox(SG,-RX+2.1,0,.2,.8,1.0,3.2,0x0e5a2e);gbox(SG,-RX+2.1,1.0,.2,.9,.06,3.3,0xd8d4c8);
 gbox(SG,-RX+2.1,1.06,-.6,.45,.28,.4,0x222428);gbox(SG,-RX+2.25,1.34,-.6,.08,.2,.35,0x40a0f0);
 for(let k=0;k<4;k++){gbox(SG,-RX+2.1,1.06,.4+k*.28,.2,.3,.2,0xc8e0e8);gbox(SG,-RX+2.1,1.1,.4+k*.28,.16,.18,.16,[0xff4080,0xffd020,0x40e080,0xa060ff][k])}
 gbox(SG,-RX+2.1,1.06,1.55,.5,.5,.12,0xd02020);gbox(SG,-RX+2.1,1.15,1.58,.4,.3,.04,0xffe040);
 /* cigarette-free gantry behind: lottery and phone top-up signs */
 sPlane(1.6,.5,-RX+.03,2.0,.2,Math.PI/2,txtTex(256,80,'#d02020','#ffe040','LOTTO',44));sPlane(1.6,.4,-RX+.03,1.4,.2,Math.PI/2,txtTex(256,64,'#1a3a7a','#ffffff','PHONE TOP-UP',30));
 gbox(SG,-RX+.3,0,.2,.5,1.8,2.6,0x8a6a44);for(let r=0;r<3;r++)for(let k=0;k<8;k++)gbox(SG,-RX+.56,.25+r*.5,-.8+k*.28,.06,.3,.22,pk());
 IROOM.push([-RX,-RX+2.55,-1.4,1.85]);
 /* newspaper rack and a fruit stand in the aisle */
 gbox(SG,-1.6,0,2.3,1.2,.9,.5,0x6a4a2a);for(let k=0;k<4;k++)gbox(SG,-2.05+k*.3,.9,2.3,.26,.04,.38,[0xf4f4f0,0xe8e0c8,0xf4f4f0,0xffd8d8][k]);IROOM.push([-2.25,-.95,2.0,2.6]);
 gbox(SG,1.3,0,.8,2.6,1.1,.7,0x8a6a44);for(let r=0;r<2;r++)for(let k=0;k<8;k++)gbox(SG,.15+k*.32,.2+r*.5,.48,.26,.32,.06,pk());gbox(SG,1.3,1.1,.8,2.5,.05,.6,0xd8d0c0);for(let k=0;k<6;k++)gbox(SG,.4+k*.36,1.15,.8,.22,.16,.22,[0xf0c020,0xd02020,0x40a040][k%3]);IROOM.push([0,2.6,.45,1.15]);
 /* MR SINGH behind the counter, in his turban */
 window.SHK=personIn(pSpec(4242,{f:false,beard:true,hr:[.12,.1,.09],hs:21,hc:[.1,.14,.4],ts:1,tc:[.42,.32,.24],bc:[.15,.15,.18],gl:1,sk:[.62,.44,.32],scarf:null,bp:false,bag:0,old:false,sh:false,ss:0,sc:[.12,.1,.1]}),-RX+1.3,.2,Math.PI/2);
 IA.push({r:[-RX+2.5,-RX+3.6,-1.3,-.1],label:'TALK TO MR SINGH',fn:()=>say('MR SINGH',CSLINES[csLine++%CSLINES.length],3600)},
  {r:[-RX+2.5,-RX+3.6,-.1,1.8],label:'BUY SNACKS & DRINKS',fn:()=>openShop('corner')})}
CUSTB[CSN]={rx:6,fn:buildCorner};
KEEP[CSN]=['MR SINGH','Sat sri akal!'];
