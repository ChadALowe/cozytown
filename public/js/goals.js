/* ---- LIFE GOALS: a ladder from £800 and a bike-shed C1 to the Sky Penthouse.
   Each goal pays a bonus when you reach it, the phone's GOALS app shows the ladder, and each morning reminds you
   what's next. Goals are checked from the game's own state, so anything you've already done counts straight away. ---- */
(function(){
const GL={done:{}};window.GOALS=GL;
const n=(v)=>typeof v==='number'?v:0;
const owned=()=>{try{return (OWN.car||[]).filter(Boolean).length}catch(e){return 1}};
const homes=()=>{try{return window.MARLHOMES?MARLHOMES.own:{}}catch(e){return {}}};
const maxRank=()=>{try{let m=0;for(const k in CR.xp)m=Math.max(m,crLvl(k));return m}catch(e){return 0}};
const L=[
 {id:'wages',n:'FIRST WAGES',d:'Finish a parcel round',hint:'Pick a round off the jobs board in the Post Office.',r:25,ok:()=>{try{return n(dels)>=1}catch(e){return false}}},
 {id:'job',n:'GET A JOB',d:'Earn £100 from a career',hint:'Open the CAREERS app and start a taxi, bus, pizza, farm or pilot shift.',r:50,ok:()=>{try{return n(CR.earned)>=100}catch(e){return false}}},
 {id:'egg',n:'NEST EGG',d:'Have £2,500 in your pocket',hint:'Keep working shifts. The bank and building society pay interest every morning.',r:100,ok:()=>n(cash)>=2500},
 {id:'car2',n:'SECOND SET OF WHEELS',d:'Own two vehicles',hint:'Village Motors and the Marlowe dealers have cars from a few hundred pounds.',r:150,ok:()=>owned()>=2},
 {id:'promo',n:'PROMOTION',d:'Reach rank 2 in any career',hint:'Every shift earns XP. Rank 2 pays 30% more.',r:200,ok:()=>maxRank()>=1},
 {id:'city',n:'CITY LIVING',d:'Buy a home in Marlowe',hint:'Fly to Marlowe and visit MARLOWE ESTATES on the High Street. The studio flat is £2,500.',r:300,ok:()=>Object.keys(homes()).some(k=>homes()[k])},
 {id:'boss',n:'BE THE BOSS',d:'Own a business',hint:'Open the BUSINESS app to see what is for sale.',r:500,ok:()=>{try{return Object.keys(BIZ.own).length>=1}catch(e){return false}}},
 {id:'col',n:'CAR COLLECTOR',d:'Own ten vehicles',hint:'Eight dealers in Marlowe, Village Motors, and bikes at TWO WHEELS.',r:750,ok:()=>owned()>=10},
 {id:'pent',n:'TOP OF THE TOWN',d:'Own the Sky Penthouse',hint:'£18,000 at Marlowe Estates. Floor 38, glass wall, grand piano.',r:1000,ok:()=>!!homes().pent},
 {id:'tycoon',n:'COZY TYCOON',d:'Have £100,000 in your pocket',hint:'Businesses, shares and top-rank careers add up.',r:2500,ok:()=>n(cash)>=100000}];
const next=()=>L.find(g=>!GL.done[g.id]);
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.goals=GL.done;return o};cozyLoad=function(z){l0(z);if(z&&z.goals)GL.done=Object.assign({},z.goals)}}
let t=0,quiet=4;
function check(){for(const g of L){if(GL.done[g.id])continue;let ok=false;try{ok=g.ok()}catch(e){czErr(e,"goals.js")}if(!ok)continue;GL.done[g.id]=DAY||1;
  cash+=g.r;toast('🏆 GOAL REACHED: '+g.n+'  ·  BONUS £'+g.r.toLocaleString('en-GB'));try{beep(784,.1,'square',.05);setTimeout(()=>beep(1047,.16,'square',.05),110);setTimeout(()=>beep(1319,.22,'square',.05),240)}catch(e){czErr(e,"goals.js")}
  const nx=next();if(nx)setTimeout(()=>toast('🎯 NEXT GOAL: '+nx.n+' · '+nx.d.toUpperCase()),3200);return}}
{const u0=updCozy;updCozy=function(dt){u0(dt);if(!GS.started)return;if(quiet>0){quiet-=dt;return}t-=dt;if(t>0)return;t=1.5;check()}}
{const n0=newDay;newDay=function(){n0();const nx=next();if(nx)setTimeout(()=>toast('🎯 TODAY\'S GOAL: '+nx.n+' · '+nx.d.toUpperCase()),2500)}}
if(typeof PHX!=='undefined')PHX.push({k:'goals',ic:'🎯',n:'GOALS',bg:'#2a7a4a',render({el}){
 const dn=L.filter(g=>GL.done[g.id]).length;el('div','phH','LIFE GOALS · '+dn+'/'+L.length);const nx=next();
 if(nx){const r=el('div','phR');r.style.borderColor='#ffe14a';el('div',null,'🎯 NEXT: '+nx.n,r).style.color='#ffe14a';el('small',null,nx.d+' · BONUS £'+nx.r.toLocaleString('en-GB'),r);el('div',null,nx.hint,r).style.cssText='font-size:11px;color:#cde;margin-top:4px;text-transform:none'}
 else el('div','phR','🏆 EVERY GOAL REACHED. COZYTOWN SALUTES YOU.');
 for(const g of L){const r=el('div','phR phK'),d=GL.done[g.id];el('span',null,(d?'✅ ':'⬜ ')+g.n,r);el('span',null,d?'DAY '+d:'£'+g.r.toLocaleString('en-GB'),r).style.color=d?'#9fe89f':'#cde'}}});
})();
