/* ---- CAREERS: taxi, bus, pizza delivery, farm hand and pilot. Shifts in set hours, XP, five ranks each, pay rises with rank.
   Start and end shifts from the CAREERS app on the phone. ---- */
const CR={xp:{taxi:0,bus:0,pizza:0,farm:0,pilot:0},done:{taxi:0,bus:0,pizza:0,farm:0,pilot:0},earned:0};
const CRANK=[0,60,160,320,560],CMULT=[1,1.3,1.6,2,2.5];
const CDEF={
 taxi:{n:'TAXI DRIVER',ic:'🚕',h:[6,24],per:5,unit:'FARES',ranks:['LEARNER CABBIE','CABBIE','SENIOR CABBIE','EXECUTIVE DRIVER','CHAUFFEUR'],info:'Pick up passengers anywhere in the village and drop them off. Be quick for a tip.'},
 bus:{n:'BUS DRIVER',ic:'🚌',h:[6,20],per:9,unit:'STOPS',ranks:['TRAINEE','BUS DRIVER','SENIOR DRIVER','ROUTE INSPECTOR','DEPOT MANAGER'],info:'Drive the High Street route and stop at every bus stop to pick people up.'},
 pizza:{n:'PIZZA DELIVERY',ic:'🍕',h:[11,23.5],per:4,unit:'RUNS',ranks:['DELIVERY ROOKIE','DELIVERY DRIVER','FAST FEET','PIZZA PRO','PIZZA LEGEND'],info:"Collect hot pizzas from Luigi's on the High Street and deliver them before they go cold."},
 farm:{n:'FARM HAND',ic:'🚜',h:[5,19],per:3,unit:'TASKS',ranks:['FARM HELPER','FARM HAND','HERDSMAN','HEAD HAND','FARM MANAGER'],info:"Help Farmer Holt: bale hay, herd the sheep and milk the cows. Each task pays a wage on top."},
 pilot:{n:'PILOT',ic:'✈',h:[6,22],per:2,unit:'FLIGHTS',ranks:['CADET','FIRST OFFICER','CAPTAIN','SENIOR CAPTAIN','CHIEF PILOT'],info:'Fly passengers between Cozy Airfield and Marlowe. Start your shift at either airport.'}};
const crLvl=k=>{let l=0;for(let i=0;i<CRANK.length;i++)if(CR.xp[k]>=CRANK[i])l=i;return l};
const crMult=k=>CMULT[crLvl(k)];
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.cr=CR;return o};cozyLoad=function(z){l0(z);if(z&&z.cr){Object.assign(CR.xp,z.cr.xp||{});Object.assign(CR.done,z.cr.done||{});CR.earned=z.cr.earned|0}}}
let SH=null; /* the active shift */
const crHud=(()=>{const e=document.createElement('div');e.style.cssText='position:fixed;left:50%;top:74px;transform:translateX(-50%);z-index:25;background:rgba(40,20,4,.88);border:2px solid #ffb43a;border-radius:12px;color:#fff;font:bold 12px ui-monospace,monospace;padding:5px 12px;text-align:center;display:none;max-width:92vw;line-height:1.35;pointer-events:none';document.body.appendChild(e);return e})();
const crPos=()=>GS.onFoot?{x:P.x,z:P.z}:{x:GS.x,z:GS.z};
const crStopped=(x,z,r)=>{if(GS.onFoot||GS.inside)return false;return Math.hypot(GS.x-x,GS.z-z)<(r||6)&&Math.abs(GS.speed)<1.6};
const crWay=(x,z,n)=>{PH.way={x,z,n,keep:1};phWay()};
const crNames=['MRS JONES','MR PATEL','OLD TOM','NANA JOY','KEV','DR OKAFOR','MRS COLLINS','LILY','MR HUGHES','AUNTIE PAM','SAM','MEG','MR CHEN','PRIYA','DAVE','ROSIE'];
const crPick=n=>n[Math.floor(Math.random()*n.length)];
function crAddr(minD,maxD,avoid){const p=avoid||crPos();let best=null;for(let k=0;k<60;k++){const t=TG[Math.floor(Math.random()*TG.length)];if(!t)continue;const d=Math.hypot(t.dx-p.x,t.dz-p.z);if(d>=minD&&d<=maxD){best=t;break}}return best||TG[Math.floor(Math.random()*TG.length)]}
function crPay(k,base,msg){const m=crMult(k),p=Math.round(base*m);cash+=p;CR.earned+=p;const l0=crLvl(k);CR.xp[k]+=Math.round(10+base*.4);const l1=crLvl(k);toast(msg+' +£'+p);beep(880,.08,'square',.05);setTimeout(()=>beep(1180,.1,'square',.05),90);
 if(l1>l0){setTimeout(()=>{toast('PROMOTED! YOU ARE NOW A '+CDEF[k].ranks[l1]);phText(k==='farm'?'FARMER HOLT':k==='pilot'?'COZY AIRWAYS':k==='pizza'?'LUIGI':k==='bus'?'COZY BUSES':'COZY CABS','Congratulations on your promotion to '+CDEF[k].ranks[l1]+'! Your pay is now x'+CMULT[l1]+'.');for(let i=0;i<4;i++)setTimeout(()=>beep(600+i*160,.1,'square',.05),i*110)},1400)}
 return p}
/* ---- vehicle dressing: taxi roof sign, pizza box, bus body ---- */
function crTex(txt,bg,fg){const c=document.createElement('canvas');c.width=256;c.height=96;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,256,96);g.fillStyle=fg;g.font='bold 64px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,128,52);return new THREE.CanvasTexture(c)}
function crDress(kind){crUndress();const g=new THREE.Group();g.userData.cr=1;car.updateMatrixWorld(true);const bb=new THREE.Box3();car.traverse(o=>{if(o.isMesh&&o.visible&&!(o.material&&o.material.transparent)&&!o.userData.cr){o.geometry.computeBoundingBox();const b2=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);if(b2.max.y-car.position.y<2.6)bb.union(b2)}});const top=(bb.isEmpty()?1.5:bb.max.y-car.position.y);
 const bm=(w,h,d,col,x,y,z,tex)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),tex?[0,1,2,3,4,5].map(i=>new THREE.MeshBasicMaterial(i===0||i===1||i===4||i===5?{map:tex}:{color:col})):new THREE.MeshBasicMaterial({color:col}));m.position.set(x,y,z);g.add(m);return m};
 if(kind==='taxi'){bm(.75,.26,.32,0xffd820,0,top+.13,-.1,crTex('TAXI','#ffd820','#111'))}
 else if(kind==='pizza'){bm(.6,.3,.5,0xffffff,0,top+.15,-.3,crTex('PIZZA','#c81e1e','#fff'))}
 else if(kind==='bus'){SH.hid=[];for(const c of car.children){if(c.userData.cr)continue;if(c.visible){SH.hid.push(c);c.visible=false}}
  const L=7.2,W=2.45,H=2.7,gr=0x1f7a3a,cr=0xf2ead0;bm(W,H*.45,L,gr,0,.35+H*.225,0);bm(W+.02,H*.38,L-.2,0x1a2430,0,.35+H*.45+H*.19,0);bm(W,.12,L,cr,0,.35+H*.45,0);bm(W,H*.17,L,cr,0,.35+H*.83+H*.085,0);bm(W-.1,.08,L-.1,0xdedede,0,.35+H+.04,0);
  bm(W+.04,.5,.06,0x111111,0,.35+H*.83,L/2+.01,crTex('1  HIGH ST','#111','#ffb020'));bm(W+.04,.35,L*.5,0,0,.35+H*.28,0);g.children[g.children.length-1].material=new THREE.MeshBasicMaterial({map:crTex('COZY BUS','#1f7a3a','#f2ead0')});g.children[g.children.length-1].scale.set(1.01,1,1);
  for(const sx of[-1,1])for(const sz of[-L*.32,L*.32]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.34,14).rotateZ(Math.PI/2),new THREE.MeshBasicMaterial({color:0x141414}));w.position.set(sx*(W/2-.12),.48,sz);g.add(w)}
  bm(.4,.2,.05,0xfff2b0,-.8,.7,L/2+.02);bm(.4,.2,.05,0xfff2b0,.8,.7,L/2+.02);bm(.3,.2,.05,0xd02020,-.9,.7,-L/2-.02);bm(.3,.2,.05,0xd02020,.9,.7,-L/2-.02)}
 car.add(g);SH.dress=g}
function crUndress(){if(SH&&SH.dress){car.remove(SH.dress);SH.dress=null}if(SH&&SH.hid){for(const c of SH.hid)c.visible=true;SH.hid=null}}
/* ---- passengers standing at the kerb ---- */
function crPerson(x,z,seed){const g=mkPerson(pSpec(seed||Math.floor(Math.random()*9000)+50),mObj,scene);g.position.set(x,G0,z);return g}
function crDrop(g){if(g){scene.remove(g);g.traverse(o=>{if(o.geometry)o.geometry.dispose()})}}
const kerb=t=>{const vx=t.x-t.dx,vz=t.z-t.dz,l=Math.hypot(vx,vz)||1;return{x:t.dx+vx/l*2.2,z:t.dz+vz/l*2.2,rx:t.dx,rz:t.dz}};
/* ---- bus route + stops in the world ---- */
const BSTOPS=[[-140,-1],[-60,-1],[20,-1],[85,-1],[140,-1],[130,1],[35,1],[-45,1],[-125,1]].map(([x,s])=>({x,z:s*2.1,pz:s*4.15,dir:s<0?'EASTBOUND':'WESTBOUND'}));
{const tex=crTex('BUS','#1f7a3a','#fff');for(const b of BSTOPS){const p=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,2.6,6),new THREE.MeshBasicMaterial({color:0x8a8a90}));p.position.set(b.x+1.6,G0+1.3,b.pz);scene.add(p);const f=new THREE.Mesh(new THREE.BoxGeometry(.7,.45,.05),[0,1,2,3,4,5].map(i=>new THREE.MeshBasicMaterial(i>=4?{map:tex}:{color:0x1f7a3a})));f.position.set(b.x+1.6,G0+2.45,b.pz);f.rotation.y=Math.PI/2;scene.add(f)}}
/* ---- shift control ---- */
function crCan(k){const d=CDEF[k];if(SH)return 'FINISH YOUR '+CDEF[SH.k].n+' SHIFT FIRST';if(GT<d.h[0]||GT>=d.h[1])return 'SHIFTS RUN '+String(d.h[0]).padStart(2,'0')+':00 - '+(d.h[1]>=24?'MIDNIGHT':String(Math.floor(d.h[1])).padStart(2,'0')+':'+(d.h[1]%1?'30':'00'));
 if((k==='taxi'||k==='bus'||k==='pizza')&&GS.onFoot)return 'GET IN YOUR CAR FIRST';if(GS.inside&&k!=='pilot')return 'GO OUTSIDE FIRST';
 if(k==='pilot'){const p=crPos(),m=AIRPORT.mapAt(p.x,p.z),air=SHOPD.find(s=>s.t==='COZY AIRWAYS');if(!(m&&m.id==='marlowe')&&!(air&&Math.hypot(air.x-p.x,air.z-p.z)<70))return 'GO TO AN AIRPORT TO START'}return ''}
function crStart(k){const why=crCan(k);if(why){toast(why);return false}SH={k,n:0,t:0,st:'go',stage:0};const d=CDEF[k];toast(d.ic+' '+d.n+' SHIFT STARTED · '+d.ranks[crLvl(k)]);
 if(k==='taxi'){crDress('taxi');crNextFare()}
 else if(k==='bus'){crDress('bus');SH.i=0;crBusNext()}
 else if(k==='pizza'){crDress('pizza');crPizzaCollect()}
 else if(k==='farm'){SH.hay=window.HAY?HAY.on:0;crWay(-102,200,'HAY FIELD');SH.msg='DO 3 FARM TASKS: BALE HAY, HERD SHEEP OR MILK THE COWS'}
 else if(k==='pilot'){crFly()}
 return true}
function crEnd(done){if(!SH)return;const k=SH.k,d=CDEF[k];crDrop(SH.ped);crUndress();if(PH.way&&PH.way.keep){PH.way=null;phWay()}
 if(done){const b=crPay(k,d.per*6,'SHIFT COMPLETE! BONUS');CR.done[k]++;phText('COZY CAREERS','Great '+d.n.toLowerCase()+' shift: '+SH.n+' '+d.unit.toLowerCase()+' done. Bonus £'+b+'.',true)}else toast(d.n+' SHIFT ENDED');SH=null;crHud.style.display='none'}
/* taxi */
function crNextFare(){const t=crAddr(40,180);const k=kerb(t);SH.st='pick';SH.a=t;SH.ped=crPerson(k.x,k.z);SH.who=crPick(crNames);crWay(k.rx,k.rz,'PICK UP '+SH.who);SH.t=0}
/* bus */
function crBusNext(){const b=BSTOPS[SH.i];SH.st='stop';SH.wait=0;crWay(b.x,b.z,'BUS STOP '+(SH.i+1)+'/'+BSTOPS.length);SH.ped=crPerson(b.x-.8,b.pz)}
/* pizza */
function crPizzaCollect(){const o=SHOPD.find(s=>s.t==="LUIGI'S PIZZA");SH.st='collect';SH.wait=0;SH.shop={x:o.x,z:o.z>0?2.1:-2.1};crWay(SH.shop.x,SH.shop.z,"COLLECT PIZZAS AT LUIGI'S")}
/* pilot */
function crFly(){const p=crPos(),m=AIRPORT.mapAt(p.x,p.z),from=m&&m.id==='marlowe'?'marlowe':'home',to=from==='home'?'marlowe':'home';if(GS.inside)leaveShop(true);SH.st='fly';SH.from=from;toast('CAPTAIN, YOUR AIRCRAFT IS READY');setTimeout(()=>{if(!AIRPORT.start(from,to)){toast('THE FLIGHT COULD NOT LEAVE');crEnd(false)}},600)}
/* farm task hooks */
{const h0=herdEnd;herdEnd=function(win){h0(win);if(SH&&SH.k==='farm')crFarmTask('SHEEP HERDED')}}
{const m0=milkEnd;milkEnd=function(k){m0(k);if(SH&&SH.k==='farm')crFarmTask('COWS MILKED')}}
function crFarmTask(what){SH.n++;crPay('farm',12,what+'! WAGE');if(SH.n>=CDEF.farm.per)crEnd(true)}
/* ---- tick ---- */
{const u0=updCozy;updCozy=function(dt){u0(dt);if(!SH){crHud.style.display='none';return}const k=SH.k,d=CDEF[k];SH.t+=dt;let line='';
 if(k==='taxi'){if(SH.st==='pick'){line='PICK UP '+SH.who;if(crStopped(SH.a.dx,SH.a.dz,7)){crDrop(SH.ped);SH.ped=null;const t=crAddr(120,320,{x:SH.a.dx,z:SH.a.dz});SH.b=t;SH.dist=Math.hypot(t.dx-SH.a.dx,t.dz-SH.a.dz);SH.tmax=Math.round(SH.dist/9+25);SH.t=0;SH.st='drop';crWay(t.dx,t.dz,'DROP OFF: '+t.addr);toast(SH.who+' GETS IN: "'+t.addr+', PLEASE!"')}}
  else if(SH.st==='drop'){const left=SH.tmax-SH.t;line=SH.who+' → '+SH.b.addr+' · '+(left>0?fmtT(left):'LATE');if(crStopped(SH.b.dx,SH.b.dz,7)){const fare=3+SH.dist*.05,tip=left>0?Math.round(2+left*.12):0;crPay('taxi',fare+tip,tip?'FARE + TIP':'FARE');SH.n++;const g=crPerson(kerb(SH.b).x,kerb(SH.b).z);setTimeout(()=>crDrop(g),6000);if(SH.n>=d.per)return crEnd(true);crNextFare()}}}
 else if(k==='bus'){const b=BSTOPS[SH.i];line='STOP '+(SH.i+1)+'/'+BSTOPS.length+' · '+b.dir+' · STOP AT THE GREEN SIGN';if(crStopped(b.x,b.z,7)){SH.wait+=dt;line='BOARDING... '+Math.max(0,Math.ceil(2.5-SH.wait));if(SH.wait>2.5){crDrop(SH.ped);SH.ped=null;const n=1+Math.floor(Math.random()*6);crPay('bus',n*1.6,n+' PASSENGER'+(n>1?'S':'')+' ON BOARD');SH.n++;SH.i++;if(SH.i>=BSTOPS.length)return crEnd(true);crBusNext()}}else SH.wait=0}
 else if(k==='pizza'){if(SH.st==='collect'){line="COLLECT PIZZAS FROM LUIGI'S";if(crStopped(SH.shop.x,SH.shop.z,8)){SH.wait+=dt;line='LOADING PIZZAS... '+Math.max(0,Math.ceil(2-SH.wait));if(SH.wait>2){const n=1+(Math.random()<.5?1:0);SH.drops=[];let from={x:SH.shop.x,z:SH.shop.z};for(let i=0;i<n;i++){const t=crAddr(80,260,from);SH.drops.push(t);from={x:t.dx,z:t.dz}}SH.st='deliver';SH.t=0;SH.tmax=Math.round(35+n*30);crWay(SH.drops[0].dx,SH.drops[0].dz,'PIZZA FOR '+SH.drops[0].addr);toast(n+' PIZZA'+(n>1?'S':'')+' TO DELIVER. KEEP THEM HOT!')}}else SH.wait=0}
  else{const t=SH.drops[0],left=SH.tmax-SH.t;line='🍕 '+t.addr+' · '+(left>0?fmtT(left):'COLD!')+(SH.drops.length>1?' · +'+(SH.drops.length-1)+' MORE':'');if(crStopped(t.dx,t.dz,7)){const tip=left>0?Math.round(3+left*.1):0;crPay('pizza',5+tip,tip?'PIZZA DELIVERED + TIP':'PIZZA DELIVERED (COLD)');SH.drops.shift();if(SH.drops.length){crWay(SH.drops[0].dx,SH.drops[0].dz,'PIZZA FOR '+SH.drops[0].addr)}else{SH.n++;if(SH.n>=d.per)return crEnd(true);crPizzaCollect()}}}}
 else if(k==='farm'){line=SH.n+'/'+d.per+' TASKS · BALE HAY, HERD SHEEP OR MILK COWS';const hn=window.HAY?HAY.on:0;if(SH.hay&&!hn)crFarmTask('HAY BALED');SH.hay=hn;if(hn&&PH.way&&PH.way.keep){PH.way=null;phWay()}}
 else if(k==='pilot'){if(SH.st==='fly'){line='IN FLIGHT · '+(SH.from==='home'?'COZY → MARLOWE':'MARLOWE → COZY');if(AIRPORT.CIN.on)SH.air=1;else if(SH.air){SH.air=0;SH.n++;crPay('pilot',70,'SAFE LANDING! PILOT PAY');if(SH.n>=d.per)return crEnd(true);SH.st='turn';SH.t=0}}
  else if(SH.st==='turn'){line='TURNAROUND · NEXT FLIGHT IN '+Math.max(0,Math.ceil(12-SH.t))+'s';if(SH.t>12){SH.st='fly';crFly()}}}
 crHud.style.display=menuOpen||GS.inside&&k!=='pilot'?'none':'block';crHud.textContent=d.ic+' '+d.ranks[crLvl(k)]+' · '+SH.n+'/'+d.per+' '+d.unit+'\n'+line;crHud.style.whiteSpace='pre-line'}}
/* ---- phone app ---- */
PHX.push({k:'car',ic:'💼',n:'CAREERS',bg:'#8a5a1a',render({el,btn}){el('div','phH','CAREERS');el('small',null,'EARNED SO FAR: £'+CR.earned.toLocaleString('en-GB')).style.marginBottom='8px';
 for(const k of Object.keys(CDEF)){const d=CDEF[k],l=crLvl(k),r=el('div','phR');const t=el('div','phK',null,r);el('span',null,d.ic+' '+d.n,t);const p=el('small',null,'PAY x'+CMULT[l],t);p.style.color='#9fe89f';
  el('small',null,'RANK '+(l+1)+': '+d.ranks[l]+(l<4?'  ·  NEXT: '+d.ranks[l+1]:'  ·  TOP RANK'),r);
  const bar=el('div',null,null,r);bar.style.cssText='height:6px;background:#2a3248;border-radius:3px;margin-top:5px;overflow:hidden';const fl=el('div',null,null,bar);const a=CRANK[l],b=CRANK[l+1]||CRANK[l]+1;fl.style.cssText='height:100%;background:#ffb43a;width:'+Math.min(100,l>=4?100:(CR.xp[k]-a)/(b-a)*100)+'%';
  el('small',null,d.info+' Hours: '+String(d.h[0]).padStart(2,'0')+':00 - '+(d.h[1]>=24?'midnight':String(Math.floor(d.h[1])).padStart(2,'0')+':'+(d.h[1]%1?'30':'00'))+'. '+d.per+' '+d.unit.toLowerCase()+' a shift. Shifts done: '+CR.done[k]+'.',r);
  const bt=el('div','bt',null,r);if(SH&&SH.k===k)btn(bt,'END SHIFT',()=>{crEnd(false);phRender()},'#a03030');else{const why=crCan(k);const b2=btn(bt,'START SHIFT',()=>{if(crStart(k))phClose();else phRender()});if(why){b2.style.opacity=.55;el('small',null,why,r).style.color='#ffb43a'}}}}});
/* Luigi's: a proper pizza counter in the generic shop */
TH["LUIGI'S PIZZA"]={wall:0xf6ecd8,fl:'tile',cnt:0xc81e1e,top:0xf0f0f0,pal:[0xf0c040,0xc81e1e,0x2a8a3a,0xf0f0f0],sh:0xc81e1e};
Object.assign(HRS,{"LUIGI'S PIZZA":[11,23.5]});KEEP["LUIGI'S PIZZA"]=['LUIGI','Mamma mia! Want to deliver for me? Start a pizza shift on your phone.'];
FOODT['A PIZZA SLICE']=[38,6];
{const b0=buildShop;buildShop=function(o){b0(o);if(o.t!=="LUIGI'S PIZZA")return;for(const a of IA)if(typeof a.label==='string'&&/^BUY /.test(a.label)){a.label='BUY A PIZZA SLICE £3';a.fn=()=>{if(cash<3){toast('NOT ENOUGH CASH');return}cash-=3;fed(38,6,'DELIZIOSO! FOOD +38 (-£3)')}}
 const B=(x,y,z,w,h,d,hex)=>gbox(SG,x,y,z,w,h,d,hex);B(2.6,0,-RZ+.5,1.4,1.3,.9,0x8a4a2a);B(2.6,1.3,-RZ+.5,1.0,.6,.7,0x3a2a24);B(2.6,1.45,-RZ+.86,.5,.3,.02,0xff7a20)}}
/* the bus is big: pull the chase camera back and up */
{const u0=updateCam;updateCam=function(dt){u0(dt);if(SH&&SH.k==='bus'&&SH.dress&&!GS.onFoot&&!GS.inside&&!DZ.on&&!menuOpen){const d=13,h=5.2;cam.position.set(GS.x-Math.sin(camAng)*d,GS.y+h,GS.z-Math.cos(camAng)*d);cam.lookAt(GS.x,GS.y+1.6,GS.z);skyG.position.copy(cam.position)}}}
