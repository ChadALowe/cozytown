/* ===== THE FAMILY: a cartoon crime career in Marlowe (no weapons, no violence: driving jobs and police chases).
   Meet DON VITTORIO at the back table of VITTORIO'S TRATTORIA (Old Town, High Street). Once you've agreed to help,
   start a shift by talking to him (or from CAREERS on the phone) and get in your car:
   · THE DELIVERY: collect an unmarked crate of "olive oil" at the docks and drop it across town. A patrol may spot you: lose them first.
   · THE GETAWAY (from ASSOCIATE): pick up the crew outside the bank, the alarm goes off, lose the police, get to the safehouse.
   Police follow your trail with lights and sirens. Get far enough away for long enough to lose them; if they box you in, you're BUSTED. ===== */
(function(){
const MW=window.MARLOWE,M=MW.M,{OX,OZ,CITY,KH}=MW,Y=G0,W=(u,v)=>[OX+u,OZ+v];
const inM=()=>{const p=crPos();return M.built&&MW.inReg(p.x,p.z)};
const cvx=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t};
const MAF={met:0,pend:0,busts:0,jobs:0};
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.m6=MAF;return o};cozyLoad=function(z){l0(z);if(z&&z.m6)Object.assign(MAF,z.m6,{pend:0})}}
CDEF.mafia={n:'THE FAMILY',ic:'🎩',h:[0,24],per:3,unit:'JOBS',ranks:['ERRAND RUNNER','ASSOCIATE','SOLDIER','CAPO','CONSIGLIERE'],info:''};
Object.defineProperty(CDEF.mafia,'info',{get(){return MAF.met?'Driving jobs for Don Vittorio: deliveries from the docks and getaways. Lose the police or get busted. Busted '+MAF.busts+' time'+(MAF.busts===1?'':'s')+'.':'Somebody in Marlowe\'s Old Town is looking for a good driver who keeps quiet. Try the trattoria on the High Street.'}});
CR.xp.mafia=CR.xp.mafia||0;CR.done.mafia=CR.done.mafia||0;
/* careers glue: who texts you on promotion */
let PK=null;{const p0=phText;phText=function(from,...a){if(from==='COZY CABS'&&PK)from=PK==='mafia'?'DON VITTORIO':PK==='mcab'?'MARLOWE CABS':from;return p0(from,...a)}}
{const c0=crPay;crPay=function(k,...a){PK=k;setTimeout(()=>{if(PK===k)PK=null},3000);return c0(k,...a)}}
{const c0=crCan;crCan=function(k){if(k!=='mafia')return c0(k);if(!MAF.met)return 'FIND SOMEONE WHO NEEDS A DRIVER IN MARLOWE\'S OLD TOWN';if(SH)return 'FINISH YOUR '+CDEF[SH.k].n+' SHIFT FIRST';if(!inM())return 'THE FAMILY ONLY WORKS IN MARLOWE';if(GS.inside)return 'GO OUTSIDE FIRST';if(GS.onFoot)return 'GET IN YOUR CAR FIRST';return ''}}
/* ------------------------------------------------------------------ the trattoria */
const b=MW.BLK.find(x=>x.c===8&&x.r===4),pw=r=>r.w>=20?6:4.5,fu=b.u1-pw(b.se),fv=b.v0+pw(b.ss)+.4*((b.v1-pw(b.sn))-(b.v0+pw(b.ss)));
const TR={x:OX+fu+1.4,z:OZ+fv,psi:Math.PI/2,t:"VITTORIO'S TRATTORIA",bg:'#1e4a2a',fg:'#f4e8c8',vit:1,rx:6.6,rz:5,sz:4.1};SHOPD.push(TR);HRS[TR.t]=[11,24];
CITY.poi.push({n:TR.t,u:fu+1.4,v:fv,ic:'🍝'});
{const sl0=shopLabel;shopLabel=function(o){return o&&o.vit?(shopOpen(o).open?'ENTER '+o.t:'CLOSED (OPENS 11:00)'):sl0(o)}}
const DONL=['"Family is everything. And so is punctuality."','"The olive oil business is... very competitive."','"You drive like my cousin Sal. That is a compliment."','"Never talk business on an empty stomach. Try the lasagne."','"The police? Pfft. They couldn\'t catch a cold."'];
const FOOD=[['SPAGHETTI MEATBALLS',9,58,6],['LASAGNE',10,62,6],['MARGHERITA PIZZA',8,52,6],['TIRAMISU',5,24,10],['ESPRESSO',2,2,24]];
CUSTOM_SHOP.vitfood=function(msg){$('shT').textContent=TR.t;$('shMsg').textContent=msg||'MANGIA! EVERYTHING IS MADE BY NONNA';for(const[n,p,h,e]of FOOD)dRow(n+'  FOOD +'+h+(e?'  ENERGY +'+e:''),[['£'+p,()=>{if(cash<p)return renderShop('NOT ENOUGH CASH');cash-=p;fed(h,e,n+'! (-£'+p+')');renderShop('BUON APPETITO!')}]]);dRow('',[['BACK',()=>closeShop()]])};
let dl=0;
CUSTOM_SHOP.don=function(msg){$('shT').textContent='🎩 DON VITTORIO';
 if(!MAF.met){$('shMsg').textContent=msg||'"Sit, sit. My nephew says you know the streets of Marlowe. I have deliveries that need... discretion. Good money. Nobody gets hurt. You help the Family, the Family helps you."';
  dRow('"I\'M IN. WHAT DO YOU NEED?"',[['HELP THE FAMILY',()=>{MAF.met=1;beep(330,.2,'triangle',.05);setTimeout(()=>beep(262,.3,'triangle',.05),220);renderShop('"Bene! Welcome to the Family. When you want work, come and talk to me, or use that phone of yours."')}]]);
  dRow('"NO THANKS, JUST HERE FOR THE PASTA"',[['LEAVE IT',()=>{closeShop();say('DON VITTORIO','"Of course. The door is always open... for now."',3200)}]]);return}
 const lv=crLvl('mafia');$('shMsg').textContent=msg||('"'+CDEF.mafia.ranks[lv]+', good to see you." · JOBS DONE '+MAF.jobs+' · BUSTED '+MAF.busts);
 if(SH&&SH.k==='mafia')dRow('YOU ARE ON A JOB FOR THE FAMILY',[['GIVE UP',()=>{crEnd(false);renderShop('"Hmm. Disappointing."')}]]);
 else dRow('"ANY WORK FOR ME, DON?"',[['YES',()=>{if(SH){renderShop('FINISH YOUR '+CDEF[SH.k].n+' SHIFT FIRST');return}MAF.pend=1;closeShop();say('DON VITTORIO','"Go to your car. I\'ll text you where to go."',3400)}]]);
 if(!SH)dRow('"THE SERPENTS ARE TAKING OVER THE DOCKS." (TURF WAR)',[['DEAL WITH THEM',()=>{MAF.next='war';MAF.pend=1;closeShop();say('DON VITTORIO','"Get your car. Show them who runs South Quay."',3400)}]]);
 dRow('CHAT',[['TALK',()=>renderShop(DONL[dl++%DONL.length])]]);dRow('',[['BACK',()=>closeShop()]])};
{const b0=buildShop;buildShop=function(o){if(!o||!o.vit)return b0(o);while(SG.children.length)SG.remove(SG.children[0]);RX=o.rx;RZ=o.rz;SHK=null;const Hh=IH+.9,B=(x,y,z,w,h,d,hex)=>sbox(x,y,z,w,h,d,fmc(hex));
 SG.add(new THREE.Mesh(new THREE.PlaneGeometry(2*RX,2*RZ).rotateX(-Math.PI/2),imat(FLR.tile2())));const wm=tx=>{const m=imat(tx);m.color.setHex(0xc8a070);return m};
 splane(2*RX,Hh,0,Hh/2,-RZ,0,wm(sWl));splane(2*RX,Hh,0,Hh/2,RZ,Math.PI,wm(sWl));splane(2*RZ,Hh,RX,Hh/2,0,-Math.PI/2,wm(sWl2));splane(2*RZ,Hh,-RX,Hh/2,0,Math.PI/2,wm(sWl2));
 const vd=new THREE.Mesh(new THREE.BoxGeometry(90,70,90),new THREE.MeshBasicMaterial({color:0x0a0806,side:THREE.BackSide,fog:false}));vd.position.y=Hh/2;SG.add(vd);splane(1.1,2.2,0,1.1,RZ-.02,Math.PI,imat(T_FDOOR));
 IROOM.splice(0,IROOM.length,[-RX-1,RX+1,-RZ-1,-RZ+.25],[-RX-1,-RX+.25,-RZ,RZ],[RX-.25,RX+1,-RZ,RZ]);IA.splice(0,IA.length);
 /* checked tablecloths */const chk=cvx(64,64,(g)=>{for(let i=0;i<8;i++)for(let j=0;j<8;j++){g.fillStyle=(i+j)%2?'#c81e1e':'#f4f0e8';g.fillRect(i*8,j*8,8,8)}});chk.magFilter=THREE.NearestFilter;
 const table=(x,z)=>{B(x,0,z,.12,.72,.12,0x3a2a1a);const t=new THREE.Mesh(new THREE.BoxGeometry(1.1,.06,1.1),new THREE.MeshBasicMaterial({map:chk}));t.position.set(x,.75,z);SG.add(t);B(x,.78,z,.12,.22,.12,0x2a6a2a);B(x,1.0,z,.08,.08,.08,0xffe9a0);for(const s of[-1,1])B(x+s*.8,0,z,.42,.46,.42,0x5a3a24);IROOM.push([x-1.05,x+1.05,z-.6,z+.6])};
 for(const[x,z]of[[-4,-.6],[-4,2.2],[-1.2,1.4],[1.6,2.4],[4,1.6]])table(x,z);
 /* the counter + pasta board */B(-3.6,0,-RZ+.9,3.6,1.0,.6,0x2a4a2a);B(-3.6,1.0,-RZ+.9,3.7,.06,.7,0xd8c8a0);IROOM.push([-5.5,-1.7,-RZ,-RZ+1.3]);sPlane(3,.6,-3.6,2.4,-RZ+.03,0,txtTex(512,100,'#1e4a2a','#f4e8c8',"VITTORIO'S",56));
 personIn(pSpec(4410,{f:true,old:true,hs:3,ts:1,tc:[.9,.9,.9],gl:false,scarf:null,bp:false,bag:0}),-3.6,-RZ+.35,0);
 /* the Don's back table, behind a velvet rope */const dx=3.6,dz=-RZ+1.6;const t=new THREE.Mesh(new THREE.BoxGeometry(1.8,.06,1.1),new THREE.MeshBasicMaterial({map:chk}));t.position.set(dx,.75,dz);SG.add(t);B(dx,0,dz,.14,.72,.14,0x2a1a10);B(dx,.78,dz,.3,.06,.3,0xf4f4f0);B(dx+.4,.78,dz,.06,.24,.06,0x6a1a2a);
 B(dx,0,dz-.85,.9,.5,.5,0x6a1a2a);B(dx,.5,dz-1.08,.9,.7,.12,0x6a1a2a);IROOM.push([dx-1.2,dx+1.2,dz-1.3,dz+.6]);
 const don=personIn(pSpec(4420,{f:false,old:true,beard:false,hs:19,hc:[.14,.12,.1],ts:3,tc:[.92,.9,.86],bc:[.9,.88,.84],gl:false,scarf:null,bp:false,bag:0,sk:[.86,.7,.58]}),dx,dz-.75,0,true);
 for(const s of[-1,1])personIn(pSpec(4430+s,{f:false,hs:8,ts:3,tc:[.06,.06,.08],bc:[.06,.06,.08],gl:true,scarf:null,bp:false,bag:0}),dx+s*1.7,dz-.2,s>0?-Math.PI/2:Math.PI/2);IROOM.push([dx-2.05,dx-1.4,dz-.5,dz+.1],[dx+1.4,dx+2.05,dz-.5,dz+.1]);
 for(const z of[dz+1.1])for(let x=dx-1.6;x<=dx+1.6;x+=.8)B(x,0,z,.08,.9,.08,0xd8c070);B(dx,.8,dz+1.1,3.2,.06,.06,0x8a1a2a);IROOM.push([dx-1.7,dx+1.7,dz+1.05,dz+1.15]);
 sPlane(1.6,1.0,dx,2.0,-RZ+.03,0,cvx(256,160,(g,W_,H_)=>{g.fillStyle='#3a2a14';g.fillRect(0,0,W_,H_);g.fillStyle='#d8b060';g.fillRect(8,8,W_-16,H_-16);g.fillStyle='#5a7a9a';g.fillRect(16,16,W_-32,H_-32);g.fillStyle='#e8d8b0';g.beginPath();g.arc(W_/2,H_*.5,30,0,7);g.fill();g.fillStyle='#2a1a10';g.font='bold 14px Georgia';g.textAlign='center';g.fillText('NONNA, 1952',W_/2,H_-24)}));
 SHOPCUR={o,k:['WAITER','Benvenuto! A table for one?']};
 IA.push({r:[-5.4,-1.8,-RZ+1.3,-RZ+2.3],label:'ORDER FOOD',fn:()=>openShop('vitfood')},{r:[dx-1.8,dx+1.8,dz+1.2,dz+2.2],label:()=>MAF.met?'TALK TO DON VITTORIO':'THE MAN IN THE WHITE SUIT',fn:()=>openShop('don')},{r:[-1.0,1.0,RZ-.35,RZ],label:'LEAVE',fn:()=>leaveShop()});
 try{addVisitors(o)}catch(e){}}}
/* door dressing outside */
let dressed=0;function dress(){dressed=1;const g=new THREE.Group(),y0=Y+KH,fx=OX+fu+.06,fz=OZ+fv,mk=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({color:c}));m.position.set(x,y,z);g.add(m);return m};
 mk(.12,2.6,1.7,0xd8d0c0,fx,y0+1.3,fz);mk(.16,2.4,1.4,0x1e3a26,fx,y0+1.2,fz);mk(1.6,.16,3.4,0x1e4a2a,fx+.8,y0+3.05,fz);for(let k=0;k<6;k++)mk(1.62,.05,.28,k%2?0xf4f0e8:0xc81e1e,fx+.8,y0+3.15,fz-1.4+k*.56);
 const s=new THREE.Mesh(new THREE.PlaneGeometry(4.2,.8),new THREE.MeshBasicMaterial({map:txtTex(512,96,'#1e4a2a','#f4e8c8',"VITTORIO'S TRATTORIA",40)}));s.position.set(fx+.05,y0+3.7,fz);s.rotation.y=Math.PI/2;g.add(s);
 /* a black saloon parked outside, as you'd expect */const cb=new Builder(3),p=[OX+NSu()-7.6,OZ+fv+7];pbox(cb,p[0],Y+.3,p[1],1.8,.62,4.8,[.04,.04,.05],0);pbox(cb,p[0],Y+.92,p[1]-.2,1.6,.55,2.4,[.1,.12,.16],0);for(const z of[1.5,-1.5])pbox(cb,p[0],Y+.04,p[1]+z,1.88,.5,.68,[.02,.02,.02],0);g.add(cb.mesh(mObj));MW.cAdd({t:1,x:p[0],z:p[1]+1.3,r:.95});MW.cAdd({t:1,x:p[0],z:p[1]-1.3,r:.95});
 window.AIRPORT.chunk(M,g)}
const NSu=()=>MW.NS[8].u;
/* ------------------------------------------------------------------ police */
const COPS=[];let TRAIL=[],trailT=0,heat=0,lostT=0,bustT=0,sirenT=0;
function copMesh(){const B=new Builder(3),Wt=[.97,.97,.98],bl=[.08,.22,.72],yl=[.98,.84,.08],gl=[.14,.18,.24],dk=[.05,.05,.06],E=(x,y,z,w,h,d,c)=>pbox(B,x,y,z,w,h,d,c,0);
 E(0,.28,0,1.82,.62,4.5,Wt);E(0,.9,-.25,1.66,.5,2.4,gl);E(0,1.38,-.25,1.6,.1,2.3,Wt);E(0,.9,.97,1.6,.48,.08,gl);E(0,.32,2.26,1.5,.3,.05,[.2,.2,.22]);
 for(const sx of[-1,1]){for(let k=0;k<7;k++){E(sx*.915,.36,-1.95+k*.65,.03,.34,.64,k%2?bl:yl);E(sx*.915,.7,-1.95+k*.65,.03,.16,.64,k%2?yl:bl)}for(const z of[1.45,-1.45])E(sx*.82,0,z,.26,.62,.64,dk);E(sx*.6,.5,2.26,.34,.18,.05,[1,1,.85]);E(sx*.65,.5,-2.26,.3,.18,.05,[.9,.08,.08])}
 for(let k=0;k<5;k++)E(-.8+k*.4,.92,2.0,.38,.04,.8,k%2?bl:yl);
 const g=new THREE.Group();g.add(B.mesh(mObj));const lb=new THREE.Mesh(new THREE.BoxGeometry(1.2,.12,.32),new THREE.MeshBasicMaterial({color:0x222222}));lb.position.set(0,1.5,-.3);g.add(lb);
 const L=[0x2a6aff,0x2a6aff].map((c,i)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.5,.16,.34),new THREE.MeshBasicMaterial({color:c,fog:false}));m.position.set(i?.32:-.32,1.6,-.3);g.add(m);return m});g.userData.L=L;scene.add(g);return g}
function spawnCop(delay){const n=TRAIL.length;const back=Math.min(n-1,24+COPS.length*8);let ti=Math.max(0,n-1-back);const p=TRAIL[ti]||{x:GS.x-Math.sin(GS.psi)*60,z:GS.z-Math.cos(GS.psi)*60};
 const c={g:copMesh(),ti,x:p.x,z:p.z,psi:GS.psi,sp:8,wait:delay||0};COPS.push(c);c.g.position.set(c.x,Y,c.z);return c}
function clearCops(){for(const c of COPS)scene.remove(c.g);COPS.length=0;heat=0;lostT=0;bustT=0}
function setHeat(h,why){if(h<=heat)return;heat=h;lostT=0;toast('🚨 '+why);for(let i=COPS.length;i<h;i++)spawnCop(i*2.5);beep(880,.25,'square',.06);setTimeout(()=>beep(660,.25,'square',.06),260)}
function copTick(dt){const p=crPos();trailT+=dt;if(trailT>.25){trailT=0;const l=TRAIL[TRAIL.length-1];if(!l||Math.hypot(l.x-p.x,l.z-p.z)>2.5)TRAIL.push({x:p.x,z:p.z});if(TRAIL.length>400)TRAIL.splice(0,TRAIL.length-400)}
 if(!heat)return;const t=performance.now()/1000;let near=1e9;
 for(const c of COPS){c.g.userData.L.forEach((m,i)=>m.visible=((t*4|0)+i)%2===0);if(c.wait>0){c.wait-=dt;continue}
  const d=Math.hypot(p.x-c.x,p.z-c.z);near=Math.min(near,d);let tx,tz;
  if(d<14){tx=p.x;tz=p.z}else{/* follow your trail */while(c.ti<TRAIL.length-1&&Math.hypot(TRAIL[c.ti].x-c.x,TRAIL[c.ti].z-c.z)<4)c.ti++;const q=TRAIL[c.ti]||p;tx=q.x;tz=q.z}
  const want=Math.atan2(tx-c.x,tz-c.z);let da=Math.atan2(Math.sin(want-c.psi),Math.cos(want-c.psi));c.psi+=Math.max(-2.6*dt,Math.min(2.6*dt,da));
  const lim=d<14?Math.max(4,Math.abs(GS.speed)+2):Math.min(27,9+heat*3+Math.max(0,(d-60)*.05));c.sp+=Math.max(-14*dt,Math.min(7*dt,lim-c.sp));const sp=c.sp*(Math.abs(da)>1.2?.4:1);
  c.x+=Math.sin(c.psi)*sp*dt;c.z+=Math.cos(c.psi)*sp*dt;if(MW.inReg(c.x,c.z)){const r=MW.cResolve(c.x,c.z,.9);c.x=r[0];c.z=r[1]}
  if(d<2.6){/* bump */const k=(2.6-d)/2.6;GS.vx+=(p.x-c.x)/(d||1)*k*2;GS.vz+=(p.z-c.z)/(d||1)*k*2}
  c.g.position.set(c.x,Y+.02,c.z);c.g.rotation.y=c.psi}
 /* lose them or get busted */
 if(near>170||!COPS.length){lostT+=dt;if(lostT>9){toast('😎 YOU LOST THE POLICE!');clearCops();beep(523,.12,'square',.05);setTimeout(()=>beep(784,.16,'square',.05),130)}}else lostT=Math.max(0,lostT-dt*.5);
 const slow=GS.onFoot||Math.abs(GS.speed)<3.5;if(near<5&&slow){bustT+=dt;if(bustT>2.2)busted()}else bustT=Math.max(0,bustT-dt);
 sirenT-=dt;if(sirenT<=0&&near<180){sirenT=.42;beep((t*2|0)%2?720:960,.32,'triangle',.022)}}
function busted(){const fine=Math.round(80+heat*60+crLvl('mafia')*40);cash=Math.max(0,cash-fine);MAF.busts++;toast('🚔 BUSTED! FINED £'+fine+'. THE CARGO WAS CONFISCATED.');clearCops();beep(150,.6,'sawtooth',.08);
 setTimeout(()=>{try{phText('DON VITTORIO','"You got caught? Madonna... We say nothing, you say nothing. Come back when you\'re ready."')}catch(e){}},2500);if(SH&&SH.k==='mafia')crEnd(false)}
/* ------------------------------------------------------------------ jobs */
let J=null;const crew=[];
const snapTo=(u,v,n)=>{const s=window.MARLOWE3&&MARLOWE3.snap(u,v);if(!s)return null;const p=W(s.cu,s.cv);return Object.assign(s,{x:p[0],z:p[1],name:n})};
const DOCKS=[[-560,-560,'THE DOCKS · WAREHOUSE 7'],[-300,-470,'THE DOCKS · LOADING BAY'],[-470,-600,'SOUTH QUAY · CONTAINER YARD']],BANKS=[[-560,300,'MARLOWE BANK · REGENT ROW'],[-320,520,'MARLOWE BANK · CANNON STREET'],[-960,-40,'MARLOWE BANK · HIGH STREET']],SAFE=[[-600,-430,'THE SAFEHOUSE GARAGE'],[-1180,800,'THE SAFEHOUSE GARAGE'],[-330,920,'THE SAFEHOUSE GARAGE']];
const pick=a=>a[(Math.random()*a.length)|0];
function newJob(){const lv=crLvl('mafia'),get=lv>=1&&Math.random()<.45;clearCops();TRAIL.length=0;
 if(MAF.next==='war'||(lv>=1&&Math.random()<.25)){MAF.next=0;warJob();SH.st='job';return}
 if(get){const bk=snapTo(...pick(BANKS));J={k:'get',st:'go',a:bk,t:0};crWay(bk.x,bk.z,'THE CREW: '+bk.name);phText('DON VITTORIO','"My nephews are making a withdrawal at '+bk.name+'. Pick them up out front. Then lose anyone who follows."',true);toast('🎩 GETAWAY JOB: PICK UP THE CREW AT '+bk.name)}
 else{const dk=snapTo(...pick(DOCKS));J={k:'del',st:'go',a:dk,t:0};crWay(dk.x,dk.z,'COLLECT: '+dk.name);phText('DON VITTORIO','"There\'s a crate of olive oil at '+dk.name+'. Very special olive oil. Don\'t open it."',true);toast('🎩 DELIVERY JOB: COLLECT A CRATE AT '+dk.name)}
 SH.st='job'}
{const s0=crStart;crStart=function(k){if(k!=='mafia')return s0(k);const why=crCan(k);if(why){toast(why);return false}SH={k,n:0,t:0,st:'job',stage:0};toast('🎩 THE FAMILY · '+CDEF.mafia.ranks[crLvl('mafia')]);newJob();return true}}
{const e0=crEnd;crEnd=function(done){if(SH&&SH.k==='mafia'){clearCops();yardClear();for(const g of crew){scene.remove(g)}crew.length=0;J=null;MAF.pend=0}e0(done)}}
function jobPay(base,msg){MAF.jobs++;crPay('mafia',base,msg);SH.n++;if(SH.n>=CDEF.mafia.per){crEnd(true);return}setTimeout(()=>{if(SH&&SH.k==='mafia')newJob()},2500);J=null}
{const u0=updCozy;updCozy=function(dt){u0(dt);if(!dressed&&MW.CITY.built)dress();
 if(MAF.pend&&!SH&&inM()&&!GS.onFoot&&!GS.inside){MAF.pend=0;crStart('mafia')}
 if(!SH||SH.k!=='mafia'){if(COPS.length)clearCops();return}
 if(!inM()&&!AIRPORT.CIN.on){toast('YOU LEFT MARLOWE · THE JOB IS OFF');return crEnd(false)}
 if(!GS.inside)copTick(dt);if(!SH||SH.k!=='mafia')return;const stars='★'.repeat(heat)+'☆'.repeat(3-heat);let line='WAITING FOR THE DON\'S NEXT CALL...';
 if(J){J.t+=dt;
  if(J.k==='war'){const l=warLine(dt);if(!SH)return;if(l)line=l}
  else if(J.k==='del'){if(J.st==='go'){line='COLLECT THE CRATE · '+J.a.name;if(crStopped(J.a.x,J.a.z,8)){J.st='load';J.w=0}}
   else if(J.st==='load'){J.w+=dt;line='LOADING THE "OLIVE OIL"… '+Math.max(0,Math.ceil(2.2-J.w));if(!crStopped(J.a.x,J.a.z,9)){J.st='go'}else if(J.w>2.2){const d=MARLOWE3.pickSpot(450,950,{x:J.a.x,z:J.a.z});J.b=d;J.st='drop';J.t=0;J.dist=Math.hypot(d.x-J.a.x,d.z-J.a.z);J.tmax=Math.round(J.dist/8+30);J.spotAt=.3+Math.random()*.35;J.spotted=0;crWay(d.x,d.z,'DROP: '+d.name);toast('CRATE LOADED. TAKE IT TO '+d.name+'. DRIVE CAREFULLY…')}}
   else if(J.st==='drop'){const left=J.tmax-J.t,dd=Math.hypot(J.b.x-GS.x,J.b.z-GS.z);if(!J.spotted&&dd<J.dist*(1-J.spotAt)&&Math.random()<.6*dt*3){J.spotted=1;if(Math.random()<.65+crLvl('mafia')*.05)setHeat(1,'A PATROL CAR SPOTTED YOU! LOSE THEM BEFORE THE DROP');}
    line='DELIVER TO '+J.b.name+' · '+(left>0?fmtT(left):'LATE')+(heat?'\n🚨 LOSE THE POLICE FIRST!':'');
    if(crStopped(J.b.x,J.b.z,8)){if(heat){if(!J.warn||J.t-J.warn>3){J.warn=J.t;toast('NOT WITH THE POLICE ON YOUR TAIL! LOSE THEM FIRST')}}else{const bonus=left>0?Math.round(20+left*.6):0;jobPay(55+J.dist*.06+bonus,bonus?'DELIVERED ON TIME!':'DELIVERED (LATE)')}}}}
  else{if(J.st==='go'){line='PICK UP THE CREW · '+J.a.name;if(!J.crew){J.crew=1;for(let i=0;i<2;i++){const g=mkPerson(pSpec(4600+i,{f:false,hs:8,ts:3,tc:[.06,.06,.08],bc:[.06,.06,.08],gl:true,scarf:null,bp:false,bag:1,old:false}),mObj,scene);const p=W(J.a.pu+(i?.8:-.8),J.a.pv);g.position.set(p[0],Y+KH,p[1]);g.rotation.y=Math.atan2(J.a.cu-J.a.pu,J.a.cv-J.a.pv);crew.push(g)}}
    if(crStopped(J.a.x,J.a.z,8)){for(const g of crew)scene.remove(g);crew.length=0;J.st='alarm';J.w=0;toast('THE CREW JUMP IN: "GO GO GO!"');beep(1200,.12,'square',.05)}}
   else if(J.st==='alarm'){J.w+=dt;line='🔔 THE ALARM IS RINGING… DRIVE!';if(J.w>2.5){setHeat(2,'THE ALARM WENT OFF! TWO POLICE CARS ARE COMING');const s=snapTo(...pick(SAFE.filter(q=>Math.hypot(OX+q[0]-GS.x,OZ+q[1]-GS.z)>350)));J.b=s;J.st='run';crWay(s.x,s.z,s.name)}}
   else if(J.st==='run'){const dd=Math.round(Math.hypot(J.b.x-GS.x,J.b.z-GS.z));line=(heat?'🚨 LOSE THE POLICE, THEN ':'')+'GET TO '+J.b.name+' · '+dd+'M';if(crStopped(J.b.x,J.b.z,9)){if(heat)toast('DON\'T LEAD THEM TO THE SAFEHOUSE! LOSE THEM FIRST');else jobPay(150+J.t*.3,'CLEAN GETAWAY! THE DON IS DELIGHTED')}}}}
 crHud.style.display=menuOpen||GS.inside?'none':'block';crHud.style.whiteSpace='pre-line';crHud.textContent='🎩 '+CDEF.mafia.ranks[crLvl('mafia')]+' · '+SH.n+'/'+CDEF.mafia.per+' JOBS · HEAT '+stars+(heat&&lostT>0?' · LOSING THEM '+Math.round(lostT/9*100)+'%':'')+'\n'+line}}

/* ------------------------------------------------------------------ TURF WAR: the Serpents want the docks. Pistol on foot, they shoot back.
   Cartoon rules: no blood; people who are hit enough times are knocked out, fall over and are carted off. ===== */
const YARD={u:-470,v:-643},WB=[];let foes=[],props=null,fireCd=0,gun=null,hp=100,fireBtn=null,hpRegen=0;
const box3=(w,h,d,c)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({color:c}));
function yardBuild(){props=new THREE.Group();WB.length=0;const cols=[0xc8102e,0x1d56b8,0x2a8a3a,0xe8a020,0x6a2a8a,0xd8d8d8];
 [[-512,-646.5],[-494,-639],[-476,-646.5],[-458,-639],[-440,-646.5],[-422,-639]].forEach(([u,v],i)=>{const m=box3(6,2.6,2.4,cols[i%6]),p=W(u,v);m.position.set(p[0],Y+KH+1.3,p[1]);props.add(m);for(let k=0;k<5;k++){const r=box3(.08,2.4,2.42,0x000000);r.material.transparent=true;r.material.opacity=.25;r.position.set(p[0]-2.4+k*1.2,Y+KH+1.3,p[1]);props.add(r)}WB.push({x0:p[0]-3,x1:p[0]+3,z0:p[1]-1.2,z1:p[1]+1.2})});
 const sg=new THREE.Mesh(new THREE.PlaneGeometry(5,1),new THREE.MeshBasicMaterial({map:txtTex(512,100,'#1a1a1a','#7aff4a','SERPENTS TURF',50),side:THREE.DoubleSide}));const q=W(YARD.u,-636.2);sg.position.set(q[0],Y+KH+3.3,q[1]);props.add(sg);
 scene.add(props);
 foes=[];const spots=[[-512,-649.2],[-494,-636.4],[-476,-649.2],[-458,-636.4],[-440,-649.2],[-422,-636.4],[-503,-643],[-449,-643]];
 spots.forEach(([u,v],i)=>{const g=mkPerson(pSpec(4700+i*11,{f:i%3===2,hs:20,hc:[.1,.4,.1],ts:3,tc:[.1,.35,.12],bc:[.08,.08,.1],gl:i%2===0,scarf:null,bp:false,bag:0,old:false}),mObj,scene),p=W(u,v);g.position.set(p[0],Y+KH,p[1]);g.scale.setScalar(.96);
  const gm=box3(.08,.14,.32,0x111111);gm.position.set(-.22,1.22,.42);g.add(gm);foes.push({g,x:p[0],z:p[1],hp:3,cd:1.5+Math.random()*2,down:0,ph:Math.random()*6,hx:p[0],hz:p[1]})})}
function yardClear(){if(props){scene.remove(props);props=null}for(const f of foes)scene.remove(f.g);foes=[];WB.length=0;if(gun){scene.remove(gun);gun=null}if(fireBtn)fireBtn.style.display='none'}
/* containers are solid */
{const f0=stepFoot;stepFoot=function(dt){f0(dt);for(const b of WB){const cx=Math.max(b.x0,Math.min(P.x,b.x1)),cz=Math.max(b.z0,Math.min(P.z,b.z1)),dx=P.x-cx,dz=P.z-cz,d=Math.hypot(dx,dz);if(d<.4){if(d>1e-4){P.x=cx+dx/d*.4;P.z=cz+dz/d*.4}else{const e=[P.x-b.x0,b.x1-P.x,P.z-b.z0,b.z1-P.z],m=Math.min(...e),k=e.indexOf(m);if(k===0)P.x=b.x0-.4;else if(k===1)P.x=b.x1+.4;else if(k===2)P.z=b.z0-.4;else P.z=b.z1+.4}}}}}
{const s0=step;step=function(dt){s0(dt);if(GS.onFoot)return;for(const b of WB){const cx=Math.max(b.x0,Math.min(GS.x,b.x1)),cz=Math.max(b.z0,Math.min(GS.z,b.z1)),dx=GS.x-cx,dz=GS.z-cz,d=Math.hypot(dx,dz);if(d<1.2&&d>1e-4){GS.x=cx+dx/d*1.2;GS.z=cz+dz/d*1.2;GS.vx*=.5;GS.vz*=.5}}}}
const blocked=(ax,az,bx,bz)=>{for(const b of WB){/* slab test along the segment */let t0=0,t1=1;const dx=bx-ax,dz=bz-az;for(const[p,d,lo,hi]of[[ax,dx,b.x0,b.x1],[az,dz,b.z0,b.z1]]){if(Math.abs(d)<1e-6){if(p<lo||p>hi){t0=2;break}continue}let a=(lo-p)/d,c=(hi-p)/d;if(a>c)[a,c]=[c,a];t0=Math.max(t0,a);t1=Math.min(t1,c);if(t0>t1)break}if(t0<=t1&&t0<1&&t1>0)return true}return false};
function tracer(ax,ay,az,bx,by,bz,col){const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(ax,ay,az),new THREE.Vector3(bx,by,bz)]),l=new THREE.Line(g,new THREE.LineBasicMaterial({color:col||0xffe070}));scene.add(l);
 const fl=box3(.22,.22,.22,0xffd040);fl.position.set(ax,ay,az);scene.add(fl);setTimeout(()=>{scene.remove(l);scene.remove(fl);g.dispose()},90)}
function shoot(){if(!J||J.k!=='war'||!GS.onFoot||GS.inside||fireCd>0||hp<=0)return;fireCd=.32;const fx=Math.sin(P.psi),fz=Math.cos(P.psi),gx=P.x+fx*.5+fz*.3,gz=P.z+fz*.5-fx*.3,gy=P.y+1.25;
 let best=null,bs=1e9;for(const f of foes){if(f.down)continue;const dx=f.x-P.x,dz=f.z-P.z,d=Math.hypot(dx,dz);if(d>46)continue;const ang=Math.abs(Math.atan2(Math.sin(Math.atan2(dx,dz)-P.psi),Math.cos(Math.atan2(dx,dz)-P.psi)));if(ang>.75)continue;const sc=d+ang*30+(blocked(gx,gz,f.x,f.z)?60:0);if(sc<bs){bs=sc;best=f}}
 beep(140,.07,'square',.09);setTimeout(()=>beep(90,.05,'sawtooth',.05),30);
 if(best){const cover=blocked(gx,gz,best.x,best.z),d=Math.hypot(best.x-P.x,best.z-P.z),hit=!cover&&Math.random()<.9-d*.011;
  if(hit){tracer(gx,gy,gz,best.x,Y+KH+1.2,best.z);best.hp--;best.flash=.15;if(best.hp<=0){best.down=1;best.dt=0;toast(pk(['KNOCKED OUT!','ONE SERPENT DOWN!','"OOF!"','DOWN HE GOES!']));const left=foes.filter(f=>!f.down).length;if(!left)warWon()}}
  else{const ox=(Math.random()-.5)*2.5;tracer(gx,gy,gz,best.x+ox,Y+KH+1.2+Math.random(),best.z+ox);if(cover&&Math.random()<.3)toast('THEY\'RE BEHIND COVER! MOVE AROUND')}}
 else tracer(gx,gy,gz,gx+fx*30,gy,gz+fz*30)}
const pk=a=>a[(Math.random()*a.length)|0];
function warWon(){J.st='flee';toast('THE DOCKS BELONG TO THE FAMILY AGAIN!');setTimeout(()=>setHeat(2,'SHOTS FIRED AT SOUTH QUAY! THE POLICE ARE COMING. GET AWAY!'),1800);if(fireBtn)fireBtn.style.display='none'}
function knockedOut(){hp=0;toast('💫 YOU WERE KNOCKED OUT!');fade(()=>{yardClear();P.x=TR.x;P.z=TR.z;P.y=gH(P.x,P.z);P.psi=TR.psi;camAng=P.psi;const fee=120;cash=Math.max(0,cash-fee);hp=100;toast('THE DON\'S DOCTOR PATCHED YOU UP (-£'+fee+')');try{phText('DON VITTORIO','"The Serpents got lucky. Rest, eat something, then we try again."')}catch(e){}if(SH&&SH.k==='mafia')crEnd(false)})}
addEventListener('keydown',e=>{if((e.key==='f'||e.key==='F')&&J&&J.k==='war'&&!e.repeat){e.preventDefault();shoot()}});
function warTick(dt){fireCd-=dt;const onSite=Math.hypot(P.x-OX-YARD.u,P.z-OZ-YARD.v)<60&&GS.onFoot&&!GS.inside;
 if(!fireBtn){fireBtn=document.createElement('button');fireBtn.textContent='🔫 FIRE';fireBtn.style.cssText='position:fixed;right:18px;bottom:120px;z-index:40;width:96px;height:96px;border-radius:50%;border:4px solid #fff;background:#c8102ecc;color:#fff;font:bold 18px ui-monospace,monospace;touch-action:none;display:none';fireBtn.onpointerdown=e=>{e.preventDefault();e.stopPropagation();shoot();fireBtn._h=setInterval(shoot,330)};fireBtn.onpointerup=fireBtn.onpointerleave=fireBtn.onpointercancel=()=>clearInterval(fireBtn._h);document.body.appendChild(fireBtn)}
 fireBtn.style.display=J.st==='fight'&&GS.onFoot&&!GS.inside&&!menuOpen?'block':'none';
 if(J.st==='fight'){if(!gun){gun=box3(.08,.14,.34,0x111111);scene.add(gun)}gun.visible=GS.onFoot;const fx=Math.sin(P.psi),fz=Math.cos(P.psi);gun.position.set(P.x+fx*.45+fz*.3,P.y+1.2,P.z+fz*.45-fx*.3);gun.rotation.set(0,P.psi,0);
  hpRegen+=dt;if(hpRegen>1.5&&hp<100){hpRegen=0;hp=Math.min(100,hp+1)}}
 for(const f of foes){const g=f.g;if(f.down){f.dt+=dt;const k=Math.min(1,f.dt*2.2);g.rotation.x=-k*1.45;g.position.y=Y+KH+k*.1;if(f.dt>4){g.visible=false}continue}
  const dx=P.x-f.x,dz=P.z-f.z,d=Math.hypot(dx,dz);g.rotation.y=Math.atan2(dx,dz);if(g.a1){g.a1.rotation.x=d<48?-1.45:-.2}f.ph+=dt;
  /* pop out from cover a little */const s=Math.sin(f.ph*.9)*.9;g.position.x=f.hx+Math.cos(g.rotation.y)*s;g.position.z=f.hz-Math.sin(g.rotation.y)*s;f.x=g.position.x;f.z=g.position.z;
  if(J.st!=='fight'||!onSite&&d>48)continue;f.cd-=dt;if(f.cd<=0&&d<44){f.cd=1.3+Math.random()*1.6;const ax=f.x+Math.sin(g.rotation.y)*.45,az=f.z+Math.cos(g.rotation.y)*.45,ay=Y+KH+1.22;const cover=blocked(ax,az,P.x,P.z),mv=Math.min(1,Math.abs(P.speed||0)/4);
   beep(170,.06,'square',.05);if(!cover&&Math.random()<.34-mv*.16-d*.004){const dmg=6+(Math.random()*5|0);hp-=dmg;tracer(ax,ay,az,P.x,P.y+1.1,P.z,0xff7040);const fl=document.createElement('div');fl.style.cssText='position:fixed;inset:0;background:rgba(255,0,0,.25);z-index:30;pointer-events:none';document.body.appendChild(fl);setTimeout(()=>fl.remove(),120);if(hp<=0){knockedOut();return}}
   else{const o=(Math.random()-.5)*3;tracer(ax,ay,az,P.x+o,P.y+1+Math.random(),P.z+o,0xff7040)}}}}
/* the job */
function warJob(){yardBuild();hp=100;const s=snapTo(YARD.u,YARD.v,'SOUTH QUAY · CONTAINER YARD');J={k:'war',st:'go',a:s,t:0};crWay(s.x,s.z,'TURF WAR: '+s.name);
 phText('DON VITTORIO','"The Serpents have taken the container yard on South Quay. Our yard. Go down there and remind them whose docks these are."',true);toast('🎩 TURF WAR! THE SERPENTS HAVE TAKEN THE SOUTH QUAY CONTAINER YARD')}
function warLine(dt){const alive=foes.filter(f=>!f.down).length,dd=Math.hypot(P.x-OX-YARD.u,P.z-OZ-YARD.v),pp=crPos(),dc=Math.hypot(pp.x-OX-YARD.u,pp.z-OZ-YARD.v);warTick(dt);
 if(J.st==='go'){if(dc<70){J.st='fight';toast('GET OUT OF THE CAR AND CLEAR THE YARD! '+(innerWidth<800?'TAP 🔫 FIRE':'PRESS F TO FIRE')+' · USE THE CONTAINERS FOR COVER')}return 'DRIVE TO '+J.a.name+' · '+Math.round(dc)+'M'}
 if(J.st==='fight')return '🔫 TURF WAR · SERPENTS LEFT '+alive+'/'+foes.length+' · ❤ '+Math.max(0,Math.round(hp))+(GS.onFoot?'':'\nGET OUT OF THE CAR!');
 if(J.st==='flee'){if(!heat&&J.fled===undefined&&J.t>0){}if(!heat&&J.shot){yardClear();jobPay(260+crLvl('mafia')*40,'TURF WAR WON! THE DON SENDS HIS THANKS');return ''}if(heat)J.shot=1;return '🚨 GET AWAY FROM THE POLICE! · ❤ '+Math.round(hp)}
 return ''}
/* minimap: police dots */
{const w=window.MARLOWE3,m0=w.mm;w.mm=function(mc,T,k){m0(mc,T,k);if(!SH||SH.k!=='mafia')return;const dot=(x,z,c,r)=>{const gx=Math.max(4,Math.min(MMS-4,(x-T.x)*k+MMS/2)),gz=Math.max(4,Math.min(MMS-17,-(z-T.z)*k+MMS/2));mc.fillStyle=c;mc.strokeStyle='#000';mc.lineWidth=1.5;mc.beginPath();mc.arc(gx,gz,r,0,6.3);mc.fill();mc.stroke()};
 const tg=J&&(J.st==='drop'||J.st==='run'?J.b:J.a);if(tg)dot(tg.x,tg.z,'#c040ff',4.5);const t=performance.now()/250|0;for(const c of COPS)dot(c.x,c.z,t%2?'#2a6aff':'#ff2a2a',3.5)}}
window.MARLOWE6={MAF,COPS,setHeat,clearCops,get J(){return J},TR,get foes(){return foes},shoot,get hp(){return hp},set hp(v){hp=v}};
})();
