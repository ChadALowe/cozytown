/* ===== MARLOWE: MORE TO DO
   · 50 GOLDEN PIGEONS hidden round the city (only the nearest few are ever drawn), rewards every 10.
   · MARLOWE 100%: achievements + a completion tracker app on the phone.
   · New jobs: MARLOWE BUS DRIVER (real stops, waiting people get on), MARLOWE EXPRESS COURIER (scooter), PARAMEDIC (ambulance).
   · Street life: pickpockets to chase, lost tourists to guide, broken-down cars to push, busker battles.
   · City weather: rain (slippery roads, fares +30%) and river fog (also shortens the draw distance).
   · Contacts call with favours: the Don, the Sergeant, the racers, the Tourist Board, your estate agent and your managers.
   · THE BIG ONE: a three-step bank heist for the Family.
   · Property: let your homes out, furnish them, throw a house party. Businesses: put on entertainment, see the night's takings.
   · Your own boat: moor it at the South Pier and run river-taxi fares between the piers. ===== */
(function(){
const MW=window.MARLOWE,M=MW.M,{OX,OZ,CITY,KH}=MW,Y=G0,W=(u,v)=>[OX+u,OZ+v],TAU=Math.PI*2;
const pos=()=>GS.onFoot?P:GS;
const inReg=()=>{const p=pos();return M.built&&MW.inReg(p.x,p.z)};
const inM=()=>inReg()&&!GS.inside;
const pk=a=>a[(Math.random()*a.length)|0];
const M3=()=>window.MARLOWE3,M4=()=>window.MARLOWE4,M5=()=>window.MARLOWE5,M6=()=>window.MARLOWE6,M7=()=>window.MARLOWE7;
const actOn=()=>!!(M5()&&M5().ACT.on),racing=()=>!!(M7()&&M7().race);
const hY=(x,z)=>MW.mh(x-OX,z-OZ)>Y?Y+KH:Y;
function man(seed,x,z,face,o){const g=mkPerson(pSpec(seed,Object.assign({scarf:null,bp:false,bag:0,old:false},o||{})),mObj,scene);g.position.set(x,hY(x,z),z);g.rotation.y=face||0;g.scale.setScalar(.95);return g}
function drop(g){if(!g)return;if(g.parent)g.parent.remove(g);g.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
function beacon(col){const m=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,14,12,1,true),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.32,side:THREE.DoubleSide,depthWrite:false,fog:false}));scene.add(m);return m}
const setWay=(x,z,n)=>{PH.way={x,z,n,keep:1,x8:1};phWay()};
const clearWay=()=>{if(PH.way&&PH.way.x8){PH.way=null;phWay()}};
const spotAt=(u,v,n)=>{const s=M3()&&M3().snap(u,v);if(!s)return null;const p=W(s.cu,s.cv);return Object.assign(s,{x:p[0],z:p[1],name:n})};
function nearSpot(a,b){const p=pos();for(let t=0;t<60;t++){const r=a+Math.random()*(b-a),an=Math.random()*TAU,u=p.x-OX+Math.sin(an)*r,v=p.z-OZ+Math.cos(an)*r,s=M3().snap(u,v);if(!s)continue;if(MW.mh(s.cu,s.cv)!==Y||MW.mh(s.pu,s.pv)<=Y)continue;const w=W(s.cu,s.cv),d=Math.hypot(w[0]-p.x,w[1]-p.z);if(d<a*.7||d>b*1.3)continue;s.x=w[0];s.z=w[1];s.name=s.r.n||'THE STREET';return s}return null}
function cheer(){for(let i=0;i<3;i++)setTimeout(()=>beep(784+i*196,.12,'square',.05),i*120)}
/* ------------------------------------------------------------------ saved state */
const X={pig:{},ach:{},helped:0,sj:0,heist:{st:0,done:0,last:-99,shots:{}},let:{},furn:{},party:0,gigs:0,ent:{},boat:0,ferry:0};
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.m8=X;return o};cozyLoad=function(z){l0(z);if(z&&z.m8)for(const k in z.m8)X[k]=z.m8[k];X.heist.shots=X.heist.shots||{}}}
window.M8={X,hook(k){if(k==='gig')X.gigs++}};
/* one HUD pill for everything in this file */
const xHud=(()=>{const e=document.createElement('div');e.style.cssText='position:fixed;left:50%;top:74px;transform:translateX(-50%);z-index:25;background:rgba(10,30,40,.9);border:2px solid #4ad8ff;border-radius:12px;color:#fff;font:bold 12px ui-monospace,monospace;padding:5px 12px;text-align:center;display:none;max-width:92vw;line-height:1.35;pointer-events:none;white-space:pre-line';document.body.appendChild(e);return e})();
/* ================================================================== GOLDEN PIGEONS */
const PIGS=[];
function genPigs(){let s=1234567;const r=()=>(s=(s*16807)%2147483647)/2147483647;const B=MW.BLK.filter(b=>b.u1-b.u0>36&&b.v1-b.v0>36);let guard=0;
 while(PIGS.length<50&&guard++<6000){const b=B[(r()*B.length)|0],side=(r()*4)|0,al=side<2,a0=al?b.u0:b.v0,a1=al?b.u1:b.v1,t=a0+9+r()*(a1-a0-18);
  const u=al?t:side===2?b.u0+2.2:b.u1-2.2,v=al?(side===0?b.v0+2.2:b.v1-2.2):t;
  if(MW.mh(u,v)<=Y)continue;const q=MW.cResolve(OX+u,OZ+v,.7);if(Math.hypot(q[0]-OX-u,q[1]-OZ-v)>.01)continue;if(PIGS.some(p=>Math.hypot(p.u-u,p.v-v)<110))continue;PIGS.push({u,v,i:PIGS.length})}}
function pigMesh(){const g=new THREE.Group(),m=new THREE.MeshBasicMaterial({color:0xffc830}),d=new THREE.MeshBasicMaterial({color:0xb08010});
 const b=new THREE.Mesh(new THREE.SphereGeometry(.22,8,6),m);b.scale.set(1,.85,1.4);b.position.y=.62;g.add(b);
 const h=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),m);h.position.set(0,.84,.24);g.add(h);
 const k=new THREE.Mesh(new THREE.ConeGeometry(.04,.12,5),d);k.rotation.x=Math.PI/2;k.position.set(0,.83,.38);g.add(k);
 const t=new THREE.Mesh(new THREE.BoxGeometry(.2,.04,.24),m);t.position.set(0,.66,-.32);t.rotation.x=.4;g.add(t);
 const p=new THREE.Mesh(new THREE.CylinderGeometry(.22,.26,.4,8),new THREE.MeshBasicMaterial({color:0x6a6a70}));p.position.y=.2;g.add(p);
 const gl=new THREE.Mesh(new THREE.SphereGeometry(.55,8,6),new THREE.MeshBasicMaterial({color:0xffe080,transparent:true,opacity:.2,depthWrite:false,fog:false}));gl.position.y=.7;g.add(gl);g.visible=false;scene.add(g);return g}
const POOL=[];let pigT=0,pigNear=1e9,cooT=0;
function pigTick(dt){if(!inM()){for(const g of POOL)g.visible=false;return}if(!PIGS.length)genPigs();if(!POOL.length)for(let i=0;i<4;i++)POOL.push(pigMesh());
 const p=pos();pigT-=dt;if(pigT<=0){pigT=.4;const L=PIGS.filter(q=>!X.pig[q.i]).map(q=>({q,d:Math.hypot(OX+q.u-p.x,OZ+q.v-p.z)})).sort((a,b)=>a.d-b.d);pigNear=L.length?L[0].d:1e9;
  POOL.forEach((g,i)=>{const o=L[i];if(o&&o.d<70){g.visible=true;g.userData.q=o.q;const w=W(o.q.u,o.q.v);g.position.set(w[0],Y+KH,w[1])}else g.visible=false})}
 const t=performance.now()/1000;for(const g of POOL){if(!g.visible)continue;g.rotation.y=t*1.6;if(Math.hypot(g.position.x-p.x,g.position.z-p.z)<(GS.onFoot?1.7:3.2)){X.pig[g.userData.q.i]=1;g.visible=false;pigT=0;gotPig()}}
 cooT-=dt;if(pigNear<30&&cooT<=0&&snd){cooT=2.6;for(let i=0;i<3;i++)setTimeout(()=>beep(480-i*30,.18,'sine',.02),i*170)}}
function gotPig(){const n=Object.keys(X.pig).length;beep(1318,.1,'square',.05);setTimeout(()=>beep(1760,.14,'square',.05),110);
 if(n%10===0){const r=n===50?2500:250;cash+=r;toast('🕊 GOLDEN PIGEON '+n+'/50! SET OF 10: +£'+r);cheer();try{phText('MARLOWE TOURIST BOARD',n===50?'All 50 golden pigeons! You know every corner of Marlowe. Here\'s £2,500.':'That\'s '+n+' golden pigeons found. Here\'s £'+r+' for your trouble. '+(50-n)+' to go!',true)}catch(e){czErr(e,"marlowe8.js")}if(window.REP)REP.add('tourist',2)}
 else toast('🕊 GOLDEN PIGEON '+n+'/50')}
/* ================================================================== MARLOWE 100% */
const MBIZ=['THE COFFEE HOUSE','MARLOWE FISH BAR','SUSHI BAR','BURGER BAR','THE TEA ROOM','THE CROWN','NOODLE HOUSE','BUDGET BEDS','RIVERSIDE INN','THE GRAND MARLOWE'];
const ACH=[
 ['passport','MARLOWE PASSPORT COMPLETE',()=>[Object.keys(M5().PASS.st).length,5]],
 ['cab','FINISH A MARLOWE CAB SHIFT',()=>[CR.done.mcab|0,1]],
 ['bus','FINISH A MARLOWE BUS SHIFT',()=>[CR.done.mbus|0,1]],
 ['cour','FINISH A COURIER SHIFT',()=>[CR.done.courier|0,1]],
 ['amb','FINISH A PARAMEDIC SHIFT',()=>[CR.done.amb|0,1]],
 ['cop','MAKE 10 ARRESTS',()=>[window.MPOLICE?MPOLICE.POL.arrests|0:0,10]],
 ['story','FINISH THE DON\'S STORY',()=>[Math.min(6,M6().MAF.ch|0),6]],
 ['heist','PULL OFF THE BIG ONE',()=>[X.heist.done?1:0,1]],
 ['race','WIN A STREET RACE ON ALL 3 ROUTES',()=>[Object.keys(M7().RC.best).length,3]],
 ['pig','FIND ALL 50 GOLDEN PIGEONS',()=>[Object.keys(X.pig).length,50]],
 ['home','OWN A HOME IN MARLOWE',()=>[Object.keys(M4().MS.own).length?1:0,1]],
 ['biz','OWN A MARLOWE BUSINESS',()=>[MBIZ.some(n=>BIZ.own[n])?1:0,1]],
 ['boat','5 RIVER TAXI FARES IN YOUR OWN BOAT',()=>[X.ferry,5]],
 ['help','HELP 10 PEOPLE ON THE STREET',()=>[X.helped,10]],
 ['sj','DO 5 FAVOURS FOR YOUR CONTACTS',()=>[X.sj,5]],
 ['gig','SEE A CONCERT AT THE ARENA',()=>[X.gigs?1:0,1]],
 ['party','THROW A HOUSE PARTY',()=>[X.party?1:0,1]],
 ['speed','SPEEDBOAT RUN UNDER 70 SECONDS',()=>[M5().PASS.best&&M5().PASS.best<70?1:0,1]],
 ['star','TOURIST REPUTATION 80+',()=>[Math.min(80,Math.round(REP.get('tourist'))),80]]];
const achVal=f=>{try{return f()}catch(e){return[0,1]}};
const achPct=()=>Math.round(ACH.reduce((s,a)=>{const[x,y]=achVal(a[2]);return s+Math.min(1,x/y)},0)/ACH.length*100);
let achT=4;function achTick(dt){achT-=dt;if(achT>0)return;achT=3;for(const[k,n,f]of ACH){if(X.ach[k])continue;const[a,b]=achVal(f);if(a>=b){X.ach[k]=DAY||1;toast('🏆 ACHIEVEMENT: '+n+' · MARLOWE '+achPct()+'%');cheer();break}}}
PHX.push({k:'m100',ic:'🏆',n:'MARLOWE 100%',bg:'#a07a10',render({el}){const pc=achPct();el('div','phH','MARLOWE '+pc+'% COMPLETE');
 const bar=el('div');bar.style.cssText='height:10px;background:#2a3248;border-radius:5px;overflow:hidden;margin:4px 0 10px';const f=el('div',null,null,bar);f.style.cssText='height:100%;background:#ffd24a;width:'+pc+'%';
 for(const[k,n,fn]of ACH){const[a,b]=achVal(fn),r=el('div','phR phK');el('span',null,(a>=b?'✅ ':'⬜ ')+n,r);el('span',null,Math.min(a,b)+'/'+b,r).style.color=a>=b?'#9fe89f':'#cde'}
 const left=PIGS.filter(q=>!X.pig[q.i]);if(left.length&&inReg()){const p=pos(),q=left.map(q=>({q,d:Math.hypot(OX+q.u-p.x,OZ+q.v-p.z)})).sort((a,b)=>a.d-b.d)[0],s=M3().snap(q.q.u,q.q.v);
  el('div','phR','🕊 PIGEON RADAR: THE NEAREST GOLDEN PIGEON IS ON '+(s&&s.r.n?s.r.n:'A STREET NEARBY')+', ABOUT '+Math.round(q.d/10)*10+'M AWAY. LISTEN FOR THE COOING!').style.marginTop='10px'}
 else if(!PIGS.length||!inReg())el('small',null,'Golden pigeon radar works when you\'re in Marlowe.').style.marginTop='10px'}});
/* ================================================================== JOBS: BUS, COURIER, PARAMEDIC */
CDEF.mbus={n:'MARLOWE BUS DRIVER',ic:'🚌',h:[6,23],per:6,unit:'STOPS',ranks:['TRAINEE','BUS DRIVER','SENIOR DRIVER','ROUTE INSPECTOR','GARAGE MANAGER'],info:'Drive a red Marlowe bus round the city\'s bus stops. Everyone waiting at a stop gets on.'};
CDEF.courier={n:'MARLOWE COURIER',ic:'🛵',h:[7,22],per:3,unit:'ROUNDS',ranks:['NEW RIDER','RIDER','EXPRESS RIDER','TOP RIDER','COURIER KING'],info:'Ride a MARLOWE EXPRESS scooter: collect parcels and race them round the city before the clock runs out.'};
CDEF.amb={n:'PARAMEDIC',ic:'🚑',h:[0,24],per:4,unit:'PATIENTS',ranks:['TRAINEE','EMERGENCY TECH','PARAMEDIC','SENIOR PARAMEDIC','CHIEF PARAMEDIC'],info:'Answer 999 calls in an ambulance: pick patients up and rush them to MARLOWE GENERAL HOSPITAL.'};
const MK=['mbus','courier','amb'],NM8={mbus:'MARLOWE BUSES',courier:'MARLOWE EXPRESS',amb:'MARLOWE GENERAL HOSPITAL'};
for(const k of MK){CR.xp[k]=CR.xp[k]||0;CR.done[k]=CR.done[k]||0}
{const l0=cozyLoad;cozyLoad=function(z){l0(z);for(const k of MK){CR.xp[k]=CR.xp[k]||0;CR.done[k]=CR.done[k]||0}}}
let K8=null;
{const c0=crPay;crPay=function(k,base,msg){K8=k;setTimeout(()=>{if(K8===k)K8=null},3000);if(wxHere&&WX.k==='rain'&&(k==='mcab'||k==='mbus'||k==='courier')){base*=1.3;msg+=' ☔ RAIN +30%'}return c0(k,base,msg)}}
{const p0=phText;phText=function(from,...a){if(from==='COZY CABS'&&K8&&NM8[K8])from=NM8[K8];return p0(from,...a)}}
const hrs=d=>String(d.h[0]).padStart(2,'0')+':00 - '+(d.h[1]>=24?'MIDNIGHT':String(d.h[1]).padStart(2,'0')+':00');
{const c0=crCan;crCan=function(k){if(!MK.includes(k))return c0(k);const d=CDEF[k];if(SH)return 'FINISH YOUR '+CDEF[SH.k].n+' SHIFT FIRST';if(GT<d.h[0]||GT>=d.h[1])return 'SHIFTS RUN '+hrs(d);if(!inM())return 'THIS JOB IS IN MARLOWE · GO OUTSIDE IN THE CITY';if(GS.onFoot)return 'GET IN YOUR CAR FIRST';return ''}}
let JB={};
function hideCar(){SH.hid=[];for(const c of car.children){if(c.userData.cr)continue;if(c.visible){SH.hid.push(c);c.visible=false}}}
function jbClear(){for(const g of JB.peds||[])drop(g);if(JB.mk)scene.remove(JB.mk);JB={}}
{const s0=crStart;crStart=function(k){if(!MK.includes(k))return s0(k);const why=crCan(k);if(why){toast(why);return false}SH={k,n:0,t:0,st:'go',stage:0};JB={peds:[]};
 if(k==='mbus'){crDress('bus');busPaint();busRoute();busNext()}else if(k==='courier'){scootDress();courRound()}else{ambDress();ambCall()}
 toast(CDEF[k].ic+' '+CDEF[k].n+' SHIFT STARTED · '+CDEF[k].ranks[crLvl(k)]);return true}}
{const e0=crEnd;crEnd=function(done){if(SH&&MK.includes(SH.k))jbClear();e0(done)}}
/* -- bus -- */
function busPaint(){const g=SH.dress;if(!g)return;g.traverse(o=>{for(const m of[].concat(o.material||[]))if(m&&m.color&&m.color.getHex()===0x1f7a3a)m.color.setHex(0xc81e1e)});const L=7.2,Wd=2.45,H=2.7;
 const s=new THREE.Mesh(new THREE.PlaneGeometry(2.3,.46),new THREE.MeshBasicMaterial({map:crTex('24 MARLOWE','#111','#ffb020')}));s.position.set(0,.35+H*.83,L/2+.05);g.add(s);
 for(const sx of[-1,1]){const p=new THREE.Mesh(new THREE.PlaneGeometry(L*.5,.36),new THREE.MeshBasicMaterial({map:crTex('MARLOWE','#c81e1e','#fff')}));p.position.set(sx*(Wd/2+.04),.35+H*.28,0);p.rotation.y=sx*Math.PI/2;g.add(p)}}
function busRoute(){const S=CITY.stops,p=crPos();let cur={u:p.x-OX,v:p.z-OZ};const used=new Set(),R=[];
 for(let i=0;i<CDEF.mbus.per;i++){let best=null,bd=1e9;for(const s of S){if(used.has(s))continue;const d=Math.hypot(s.u-cur.u,s.v-cur.v),w=i?Math.abs(d-260):Math.abs(d-90);if(w<bd){bd=w;best=s}}if(!best)break;used.add(best);R.push(best);cur=best}JB.R=R;JB.i=0}
function busNext(){const s=JB.R[JB.i];if(!s)return crEnd(true);const w=W(s.u,s.v);JB.s=s;JB.x=w[0];JB.z=w[1];JB.w=0;crWay(w[0],w[1],'BUS STOP '+(JB.i+1)+'/'+JB.R.length)}
function busTick(dt){if(crStopped(JB.x,JB.z,8)){JB.w+=dt;if(JB.w>2.5){const wl=(M7()&&M7().waiting.get(JB.s))||[];for(const g of wl)scene.remove(g);if(M7())M7().waiting.set(JB.s,[]);const n=wl.length+1+((Math.random()*3)|0);
   crPay('mbus',n*2.2,n+' PASSENGER'+(n>1?'S':'')+' ON BOARD');beep(660,.08,'square',.04);SH.n++;JB.i++;if(SH.n>=CDEF.mbus.per||JB.i>=JB.R.length)return crEnd(true);busNext()}return 'BOARDING… '+Math.max(0,Math.ceil(2.5-JB.w))}
 JB.w=0;return 'DRIVE TO BUS STOP '+(JB.i+1)+'/'+JB.R.length+' · '+Math.round(Math.hypot(JB.x-GS.x,JB.z-GS.z))+'M · STOP BY THE SHELTER'}
{const u0=updateCam;updateCam=function(dt){u0(dt);if(SH&&SH.k==='mbus'&&SH.dress&&!GS.onFoot&&!GS.inside&&!menuOpen&&!actOn()){const d=13,h=5.2;cam.position.set(GS.x-Math.sin(camAng)*d,GS.y+h,GS.z-Math.cos(camAng)*d);cam.lookAt(GS.x,GS.y+1.6,GS.z);skyG.position.copy(cam.position)}}}
/* -- courier -- */
function scootDress(){hideCar();const g=new THREE.Group();g.userData.cr=1;const bm=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({color:c}));m.position.set(x,y,z);g.add(m);return m};
 for(const z of[-.62,.62]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.27,.27,.14,12).rotateZ(Math.PI/2),new THREE.MeshBasicMaterial({color:0x151515}));w.position.set(0,.27,z);g.add(w)}
 bm(.36,.18,1.15,0xe8a020,0,.42,-.05);bm(.42,.34,.55,0xe8a020,0,.64,-.42);bm(.32,.1,.5,0x222222,0,.85,-.38);bm(.08,.72,.08,0x888888,0,.78,.56);bm(.64,.06,.06,0x222222,0,1.14,.56);bm(.3,.24,.14,0xe8a020,0,.62,.62);bm(.16,.1,.04,0xfff2b0,0,.7,.7);
 bm(.52,.42,.46,0xffd24a,0,1.18,-.86);const bx=new THREE.Mesh(new THREE.PlaneGeometry(.46,.36),new THREE.MeshBasicMaterial({map:crTex('EXPRESS','#ffd24a','#c81e1e')}));bx.position.set(0,1.18,-1.1);bx.rotation.y=Math.PI;g.add(bx);
 try{const r=mkPerson(pSpec(77,{scarf:null,bp:false,bag:0,old:false,ts:3,tc:[.9,.6,.1]}),mObj,scene);scene.remove(r);r.position.set(0,.4,-.3);r.l1.rotation.x=r.l2.rotation.x=-1.3;r.a1.rotation.x=r.a2.rotation.x=-1.15;g.add(r)}catch(e){czErr(e,"marlowe8.js")}
 car.add(g);SH.dress=g}
function courRound(){const s=M3().pickSpot(120,520);if(!s){setTimeout(()=>{if(SH&&SH.k==='courier')courRound()},500);return}JB.st='collect';JB.a=s;JB.w=0;crWay(s.x,s.z,'COLLECT PARCELS · '+s.name)}
function courTick(dt){if(JB.st==='collect'){if(crStopped(JB.a.x,JB.a.z,8)){JB.w+=dt;if(JB.w>1.5){let from=JB.a,tot=0;JB.drops=[];for(let i=0;i<3;i++){const d=M3().pickSpot(140,430,from);if(!d)continue;tot+=Math.hypot(d.x-from.x,d.z-from.z);JB.drops.push(d);from=d}
    JB.st='deliver';JB.t=0;JB.tmax=Math.round(tot/10.5+18*JB.drops.length);crWay(JB.drops[0].x,JB.drops[0].z,'PARCEL FOR '+JB.drops[0].name);toast('🛵 '+JB.drops.length+' PARCELS · '+fmtT(JB.tmax)+' ON THE CLOCK!')}return 'GRABBING THE PARCELS…'}JB.w=0;return 'COLLECT PARCELS · '+JB.a.name}
 JB.t+=dt;const d=JB.drops[0],left=JB.tmax-JB.t;if(crStopped(d.x,d.z,8)){crPay('courier',8+(left>0?4+left*.1:0),left>0?'PARCEL DELIVERED ON TIME':'PARCEL DELIVERED (LATE)');JB.drops.shift();
  if(JB.drops.length)crWay(JB.drops[0].x,JB.drops[0].z,'PARCEL FOR '+JB.drops[0].name);else{SH.n++;if(SH.n>=CDEF.courier.per)return crEnd(true);courRound()}return ''}
 return '📦 '+d.name+' · '+(left>0?fmtT(left):'LATE!')+(JB.drops.length>1?' · +'+(JB.drops.length-1)+' MORE':'')}
/* -- paramedic -- */
let HOSP=null;
function hospBuild(){if(HOSP||!M.built)return;const s=spotAt(-560,160,'MARLOWE GENERAL HOSPITAL');if(!s)return;HOSP=s;const g=new THREE.Group(),w=W(s.pu,s.pv),y0=Y+KH;
 const pole=new THREE.Mesh(new THREE.BoxGeometry(.16,3.2,.16),new THREE.MeshBasicMaterial({color:0x8a8a90}));pole.position.set(w[0],y0+1.6,w[1]);g.add(pole);
 const b=new THREE.Mesh(new THREE.BoxGeometry(2.8,1.1,.12),[0,1,2,3,4,5].map(i=>new THREE.MeshBasicMaterial(i>=4?{map:crTex('+ HOSPITAL','#1a5ad0','#fff')}:{color:0x1a5ad0})));b.position.set(w[0],y0+3.4,w[1]);b.rotation.y=s.r.ax===0?Math.PI/2:0;g.add(b);
 const c=new THREE.Mesh(new THREE.BoxGeometry(.9,.9,.9),new THREE.MeshBasicMaterial({color:0xd01818,fog:false}));c.position.set(w[0],y0+4.5,w[1]);g.add(c);g.userData.c=c;scene.add(g);HOSP.g=g;
 CITY.poi.push({n:'MARLOWE GENERAL HOSPITAL',u:s.pu,v:s.pv,ic:'🏥'})}
function ambDress(){hideCar();const yl=[.98,.84,.08],gr=[.1,.6,.25];const g=MCARMESH([.98,.96,.55],null,E=>{for(const sx of[-1,1])for(let k=0;k<7;k++){E(sx*.915,.34,-1.95+k*.62,.03,.32,.6,k%2?gr:yl);E(sx*.915,.66,-1.95+k*.62,.03,.14,.6,k%2?yl:gr)}});g.userData.cr=1;
 const L=[0,1].map(i=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.48,.16,.32),new THREE.MeshBasicMaterial({color:0x2a6aff,fog:false}));m.position.set(i?.3:-.3,1.52,-.3);g.add(m);return m});g.userData.L=L;car.add(g);SH.dress=g}
const ILL=['A TWISTED ANKLE','A NASTY FALL','SOMEONE WHO FAINTED','A BEE STING ALLERGY','A CYCLIST WHO CRASHED','A BUMP ON THE HEAD','A DOG BITE'];
function ambCall(){hospBuild();const s=M3().pickSpot(150,620);if(!s||!HOSP){setTimeout(()=>{if(SH&&SH.k==='amb')ambCall()},600);return}for(const g of JB.peds)drop(g);JB.peds=[];
 const w=W(s.pu,s.pv),pt=man(5100+((Math.random()*500)|0),w[0],w[1],0);pt.rotation.z=Math.PI/2;pt.position.y+=.2;const by=man(5700,w[0]+1.2,w[1]+.6,0);by.a1.rotation.x=-2.6;JB.peds.push(pt,by);
 JB.st='go';JB.s=s;JB.w=0;JB.t=0;JB.what=pk(ILL);JB.tmax=Math.round(Math.hypot(s.x-GS.x,s.z-GS.z)/10+28);crWay(s.x,s.z,'999: '+s.name);toast('🚑 999 CALL: '+JB.what+' ON '+s.name+'!')}
let sir8=0;
function ambTick(dt){const t=performance.now()/1000;if(SH.dress&&SH.dress.userData.L)SH.dress.userData.L.forEach((m,i)=>m.material.color.setHex(((t*4|0)+i)%2?0x2a6aff:0xffffff));
 sir8-=dt;if(sir8<=0&&!GS.onFoot&&JB.st!=='wait'){sir8=.6;beep((t*1.6|0)%2?660:880,.5,'triangle',.018)}JB.t+=dt;
 if(JB.st==='go'){const left=JB.tmax-JB.t;if(crStopped(JB.s.x,JB.s.z,9)){JB.w+=dt;if(JB.w>3){for(const g of JB.peds)drop(g);JB.peds=[];JB.st='hosp';JB.w=0;JB.bonus=left>0?left*.4:0;JB.t=0;JB.tmax=Math.round(Math.hypot(HOSP.x-GS.x,HOSP.z-GS.z)/10+25);crWay(HOSP.x,HOSP.z,'MARLOWE GENERAL HOSPITAL');toast('PATIENT LOADED. TO THE HOSPITAL, QUICK!')}return 'LOADING THE PATIENT… '+Math.max(0,Math.ceil(3-JB.w))}JB.w=0;return '🚑 '+JB.what+' · '+JB.s.name+' · '+(left>0?fmtT(left):'HURRY!')}
 if(JB.st==='hosp'){const left=JB.tmax-JB.t;if(crStopped(HOSP.x,HOSP.z,10)){JB.w+=dt;if(JB.w>2){crPay('amb',40+JB.bonus+(left>0?left*.6:0),left>0?'PATIENT SAVED! QUICK WORK':'PATIENT DELIVERED');if(window.REP)REP.add('tourist',1);SH.n++;if(SH.n>=CDEF.amb.per)return crEnd(true);JB.st='wait';setTimeout(()=>{if(SH&&SH.k==='amb')ambCall()},2500)}return 'HANDING OVER TO THE DOCTORS…'}JB.w=0;return '🏥 TO MARLOWE GENERAL · '+(left>0?fmtT(left):'HURRY!')+' · '+Math.round(Math.hypot(HOSP.x-GS.x,HOSP.z-GS.z))+'M'}
 return 'WAITING FOR THE NEXT 999 CALL…'}
function jobTick(dt){if(HOSP&&HOSP.g)HOSP.g.userData.c.rotation.y+=dt;if(!SH||!MK.includes(SH.k))return;const k=SH.k,d=CDEF[k];
 if(!inReg()&&!AIRPORT.CIN.on){toast('YOU LEFT MARLOWE · SHIFT ENDED');return crEnd(false)}SH.t+=dt;
 const line=k==='mbus'?busTick(dt):k==='courier'?courTick(dt):ambTick(dt);if(!SH)return;
 crHud.style.display=menuOpen||GS.inside?'none':'block';crHud.style.whiteSpace='pre-line';crHud.textContent=d.ic+' '+d.ranks[crLvl(k)]+' · '+SH.n+'/'+d.per+' '+d.unit+'\n'+(line||'')}
/* ================================================================== WEATHER */
const WX={k:'clear',h:2};let wxBase=null,wxLast=GT,wxFog=0,wxHere=0;
function wxTick(){let dh=GT-wxLast;if(dh<0)dh+=24;wxLast=GT;if(dh>3)dh=0;WX.h-=dh;wxHere=inReg()?1:0;
 if(WX.h<=0){const r=Math.random(),old=WX.k;WX.k=r<.3?'rain':r<.45&&(GT<10||GT>17)?'fog':'clear';WX.h=WX.k==='clear'?3+Math.random()*5:1.5+Math.random()*3;
  if(wxHere&&WX.k!==old&&!GS.inside)toast(WX.k==='rain'?'☔ RAIN IN MARLOWE: ROADS ARE SLIPPERY, FARES +30%':WX.k==='fog'?'🌫 FOG IS ROLLING IN OFF THE RIVER':'⛅ THE SKIES ARE CLEARING OVER MARLOWE')}
 if(wxHere){if(wxBase===null)wxBase=rainI;const want=WX.k==='rain'?(rainI||1):wxBase;if(rainI!==want){rainI=want;applyTOD(todI)}
  if(WX.k==='fog'&&!GS.inside&&scene.fog&&!actOn()){scene.fog.far=Math.min(scene.fog.far,150);scene.fog.near=Math.min(scene.fog.near,18);wxFog=1}else if(wxFog){wxFog=0;applyTOD(todI)}}
 else if(wxBase!==null){rainI=wxBase;wxBase=null;wxFog=0;applyTOD(todI)}}
{const s0=step;step=function(dt){if(wxHere&&WX.k==='rain'&&!GS.onFoot){const g=GRIPM,m=MAXV;GRIPM*=.6;if(HE8.fast)MAXV+=6;s0(dt);GRIPM=g;MAXV=m}else if(HE8.fast&&wxHere){const m=MAXV;MAXV+=6;s0(dt);MAXV=m}else s0(dt)}}
const HE8={fast:0};
/* ================================================================== STREET EVENTS */
let EV=null,evT=50;const BUSK={u:-403.2,v:-236};
const evFree=()=>inM()&&!SH&&!busy&&!menuOpen&&!actOn()&&!racing()&&!SJ&&!EV&&!X.heist.pend&&!(MARLOWE6&&MARLOWE6.COPS&&MARLOWE6.COPS.length);
function evEnd(){if(!EV)return;for(const g of EV.g||[])drop(g);if(EV.m)scene.remove(EV.m);clearWay();EV=null}
const evWin=(msg,c,rep)=>{cash+=c;toast('👍 '+msg+' +£'+c);X.helped++;if(rep&&window.REP)for(const k in rep)REP.add(k,rep[k]);cheer();evEnd();return ''};
const evFail=msg=>{toast(msg);evEnd();return ''};
function evThief(){const s=nearSpot(15,45);if(!s)return 0;const vi=W(s.pu,s.pv),p=P;const victim=man(4400+((Math.random()*80)|0),vi[0],vi[1],0,{old:Math.random()<.5}),th=man(4500,vi[0]+.7,vi[1]+.3,0,{hs:8,ts:3,tc:[.1,.1,.12],bc:[.1,.1,.12]});
 let dir=s.r.ax===0?[0,1]:[1,0];if((vi[0]-p.x)*dir[0]+(vi[1]-p.z)*dir[1]<0)dir=[-dir[0],-dir[1]];victim.a1.rotation.x=-2.7;
 EV={k:'thief',t:0,g:[victim,th],dir,sp:6.9,tick(dt){if(!GS.onFoot)return evFail('THE THIEF GOT AWAY (YOU CAN\'T CHASE HIM IN A CAR!)');const d=Math.hypot(th.position.x-P.x,th.position.z-P.z);this.sp=Math.max(5.4,this.sp-dt*.05);
  let nx=th.position.x+this.dir[0]*this.sp*dt,nz=th.position.z+this.dir[1]*this.sp*dt;const r=MW.cResolve(nx,nz,.4),blocked=Math.hypot(r[0]-nx,r[1]-nz)>.05||MW.mh(nx-OX,nz-OZ)<Y-.5||!MW.inReg(nx,nz);
  if(blocked){const s=Math.random()<.5?1:-1;this.dir=[this.dir[1]*s,-this.dir[0]*s];nx=th.position.x;nz=th.position.z}th.position.set(nx,hY(nx,nz),nz);th.rotation.y=Math.atan2(this.dir[0],this.dir[1]);
  const a=Math.sin(this.t*14)*.8;th.l1.rotation.x=a;th.l2.rotation.x=-a;th.a1.rotation.x=-a;th.a2.rotation.x=a;if(((this.t*4)|0)!==this.wt){this.wt=(this.t*4)|0;setWay(nx,nz,'THIEF')}
  if(d<1.8)return evWin('GOT HIM! YOU GAVE THE BAG BACK',30,{police:2,tourist:1});if(d>75||this.t>40)return evFail('THE THIEF GOT AWAY…');return '🏃 STOP, THIEF! RUN AFTER HIM · '+Math.round(d)+'M'}};
 toast('🗣 "STOP, THIEF! HE\'S GOT MY BAG!"');beep(1200,.1,'square',.06);setTimeout(()=>beep(1200,.1,'square',.06),150);return 1}
function evLost(){const s=nearSpot(20,70);if(!s)return 0;const w=W(s.pu,s.pv),g=man(4700+((Math.random()*99)|0),w[0],w[1],0,{bag:1,bp:true});
 EV={k:'lost',t:0,g:[g],st:'ask',tick(dt){const pp=pos();
  if(this.st==='ask'){const d=Math.hypot(w[0]-pp.x,w[1]-pp.z);g.a1.rotation.x=-2.6+Math.sin(this.t*6)*.4;if(this.t>120)return evFail('THE LOST TOURIST ASKED SOMEONE ELSE');
   if(GS.onFoot?d<3.2:crStopped(w[0],w[1],9)){const D=CITY.poi.filter(q=>!q.metro&&q.n&&!/RACING|STATION$/.test(q.n)).map(q=>({q,d:Math.hypot(OX+q.u-w[0],OZ+q.v-w[1])})).filter(o=>o.d>250&&o.d<900);if(!D.length)return evFail('"OH, NEVER MIND, I FOUND IT!"');
    this.dest=pk(D).q;this.st='lead';this.t=0;g.a1.rotation.x=0;toast('🗺 "'+pk(['Excuse me! ','Sorry to bother you, ','Hello! '])+'I\'m lost. Can you take me to '+this.dest.n+'?"'+(GS.onFoot?'':' (THEY HOP IN)'));setWay(OX+this.dest.u,OZ+this.dest.v,this.dest.n)}
   return '🗺 A LOST TOURIST IS WAVING AT YOU · '+Math.round(d)+'M'}
  const dd=Math.hypot(OX+this.dest.u-pp.x,OZ+this.dest.v-pp.z);
  if(GS.onFoot){g.visible=true;const bx=P.x-Math.sin(P.psi)*1.6,bz=P.z-Math.cos(P.psi)*1.6,dx=bx-g.position.x,dz=bz-g.position.z,l=Math.hypot(dx,dz);if(l>14){g.position.x=bx;g.position.z=bz}else if(l>.35){const st=Math.min(l*2.6,7.6)*dt;g.position.x+=dx/l*st;g.position.z+=dz/l*st;g.rotation.y=Math.atan2(dx,dz);const a=Math.sin(this.t*10)*.5;g.l1.rotation.x=a;g.l2.rotation.x=-a}g.position.y=hY(g.position.x,g.position.z)}else g.visible=false;
  if(dd<24){g.visible=true;g.position.set(pp.x+1.2,hY(pp.x+1.2,pp.z),pp.z);return evWin('"Thank you so much! Here, for your trouble."',25,{tourist:3})}
  if(this.t>300)return evFail('THE TOURIST GAVE UP AND CALLED A CAB');return '🗺 TAKE THE TOURIST TO '+this.dest.n+' · '+Math.round(dd)+'M'}};return 1}
function evBreak(){const s=nearSpot(60,170);if(!s)return 0;const A=s.r.ax===0?[0,1]:[1,0],w=W(s.cu,s.cv);const m=MCARMESH(pk([[.62,.62,.64],[.2,.3,.6],[.5,.15,.1],[.15,.4,.2]]),null);m.position.set(w[0],Y+.02,w[1]);m.rotation.y=s.r.ax===0?0:Math.PI/2;scene.add(m);
 const hz=new THREE.Mesh(new THREE.BoxGeometry(.5,.14,.3),new THREE.MeshBasicMaterial({color:0xff9a20,fog:false}));hz.position.set(0,1.5,0);m.add(hz);const p2=W(s.pu,s.pv),dr=man(4800,p2[0],p2[1],0);
 EV={k:'break',t:0,g:[dr],m,off:0,o0:[w[0],w[1]],tick(dt){hz.visible=((this.t*2.5)|0)%2===0;dr.a1.rotation.x=-2.5+Math.sin(this.t*5)*.4;if(this.t>200)return evFail('A TOW TRUCK GOT THERE FIRST');
  const dd=Math.hypot(GS.x-m.position.x,GS.z-m.position.z);if(GS.onFoot)return '🚗 A BROKEN-DOWN CAR NEEDS A PUSH · GET IN YOUR CAR · '+Math.round(dd)+'M';
  if(dd<3.1&&dd>.01){const nx=(GS.x-m.position.x)/dd,nz=(GS.z-m.position.z)/dd,pen=3.1-dd,k=-(nx*A[0]+nz*A[1]);this.off+=k*pen;m.position.x=this.o0[0]+A[0]*this.off;m.position.z=this.o0[1]+A[1]*this.off;
   const d2=Math.hypot(GS.x-m.position.x,GS.z-m.position.z);if(d2<3.1){GS.x=m.position.x+nx*3.1;GS.z=m.position.z+nz*3.1}GS.vx*=.985;GS.vz*=.985;if(Math.random()<dt*3)beep(80,.1,'sawtooth',.03)}
  const pushed=Math.abs(this.off);if(pushed>=20){beep(110,.4,'sawtooth',.05);return evWin('"VROOM! IT STARTED! YOU\'RE A STAR!"',25,{tourist:1})}
  return '🚗 PUSH-START THE BROKEN-DOWN CAR · '+(dd>14?Math.round(dd)+'M AWAY':'NUDGE IT FROM BEHIND · '+Math.round(pushed)+'/20M')}};
 setWay(w[0],w[1],'BROKEN-DOWN CAR');toast('📢 A CAR HAS BROKEN DOWN NEARBY. GIVE IT A PUSH START!');return 1}
const RIVALB=['FIDDLING FIONA','DJ DECKCHAIR','BANJO BARRY','THE KAZOO KID','OPERA OLLIE'];
function evBusk(){if(Math.hypot(OX+BUSK.u-P.x,OZ+BUSK.v-P.z)>650)return 0;const nm=pk(RIVALB),tgt=40+((Math.random()*40)|0),w=W(BUSK.u-1.2,BUSK.v+3.6),g=man(4900+((Math.random()*50)|0),w[0],w[1],Math.PI/2,{hs:5});
 EV={k:'busk',t:0,g:[g],nm,tgt,st:'wait',tick(){g.a1.rotation.x=-1.3+Math.sin(this.t*9)*.35;g.a2.rotation.x=-1.0+Math.cos(this.t*9)*.3;if(this.st!=='wait')return '';if(this.t>260)return evFail(nm+' PACKED UP AND WENT HOME');
  return '🎸 BUSKER BATTLE vs '+nm+' AT MARLOWE CIRCUS · BEAT £'+tgt+' IN TIPS · '+Math.round(Math.hypot(OX+BUSK.u-P.x,OZ+BUSK.v-P.z))+'M'}};
 setWay(OX+BUSK.u,OZ+BUSK.v,'BUSKER BATTLE');try{phText(nm,'"Oi! Think you can busk? Meet me at Marlowe Circus. Whoever gets more tips wins £50."')}catch(e){czErr(e,"marlowe8.js")}return 1}
function buskBattle(){const c0=cash;EV.st='play';M5().buskGo();const A=M5().ACT;if(!A.on||A.k!=='busk'){EV.st='wait';return}const e0=A.end;A.end=()=>{e0&&e0();const got=Math.round(cash-c0);if(!EV||EV.k!=='busk')return;if(got>=EV.tgt){cash+=50;X.helped++;toast('🎸 YOU BEAT '+EV.nm+'! £'+got+' vs £'+EV.tgt+' · +£50 PRIZE');cheer();if(window.REP)REP.add('tourist',3);evEnd()}else{toast('🎸 '+EV.nm+' WINS (£'+EV.tgt+' vs YOUR £'+got+'). TRY AGAIN?');EV.st='wait';EV.t=Math.min(EV.t,200)}}}
function evTick(dt){if(EV){if(!inReg()&&EV.k!=='busk'){evEnd();return ''}EV.t+=dt;return EV.tick(dt)||''}if(!evFree())return '';evT-=dt;if(evT>0)return '';evT=75+Math.random()*90;
 const T=GS.onFoot?['thief','lost','lost','busk']:['break','break','lost'];const k=pk(T);(k==='thief'?evThief:k==='lost'?evLost:k==='break'?evBreak:evBusk)()||(evT=12);return ''}
/* ================================================================== CONTACTS: FAVOURS */
let SJ=null,sjT=140,offer=null;
const card=(()=>{const e=document.createElement('div');e.style.cssText='position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:60;background:#14202e;border:3px solid #4ad8ff;border-radius:14px;color:#fff;font:bold 13px ui-monospace,monospace;padding:10px 14px;max-width:88vw;width:380px;display:none;text-align:center;line-height:1.4';document.body.appendChild(e);return e})();
function sjSpot(min,max){const s=M3().pickSpot(min,max);return s}
const CONTACTS=[
 {n:'DON VITTORIO',ok:()=>M6().MAF.met,mk(){const a=sjSpot(150,600),tr=M6().TR,b=tr&&spotAt(tr.x-OX,tr.z-OZ,'VITTORIO\'S TRATTORIA');if(!a||!b)return null;return{msg:'"My nephew Marco needs a lift home to the trattoria. He\'s waiting on '+a.name+'. Don\'t let him talk you into anything."',legs:[{s:a,w:1.5,ped:1,t:'PICK UP MARCO · '+a.name},{s:b,w:1.5,t:'DROP MARCO AT THE TRATTORIA'}],pay:70,rep:{family:2}}}},
 {n:'DESK SERGEANT',ok:()=>window.MPOLICE&&MPOLICE.POL.joined,mk(){const a=sjSpot(200,650);if(!a)return null;return{msg:'"Off duty? Do us a favour: park up on '+a.name+' and keep an eye out for joyriders. Ten seconds, then report back."',legs:[{s:a,w:10,t:'STAKE-OUT ON '+a.name+' · STAY STOPPED'}],pay:60,rep:{police:2}}}},
 {n:'"TURBO" TERRY',ok:()=>Object.keys(M7().RC.best).length||GT>=20||GT<4,mk(){const a=sjSpot(250,700),b=spotAt(-782,-262,'THE MEET UNDER THE BRIDGE');if(!a||!b)return null;return{msg:'"Mate, I need my spare tyres from '+a.name+' down to the meet under the bridge. Quick, before the cops see."',legs:[{s:a,w:2,t:'COLLECT TERRY\'S TYRES · '+a.name},{s:b,w:1.5,t:'DELIVER THE TYRES TO THE MEET'}],pay:50,rep:{police:-1}}}},
 {n:'MARLOWE TOURIST BOARD',ok:()=>1,mk(){const a=sjSpot(150,500),q=pk(CITY.poi.filter(p=>!p.metro&&/EYE|TOWER|CATHEDRAL|ARENA|PARK|SQUARE|HALL/.test(p.n))),b=q&&spotAt(q.u,q.v,q.n);if(!a||!b)return null;return{msg:'"A VIP visitor needs a lift from '+a.name+' to '+q.n+'. Best behaviour, please!"',legs:[{s:a,w:1.5,ped:1,t:'PICK UP THE VIP · '+a.name},{s:b,w:1.5,t:'TAKE THE VIP TO '+q.n}],pay:55,rep:{tourist:2}}}},
 {n:'MARLOWE ESTATES',ok:()=>Object.keys(M4().MS.own).length,mk(){const id=pk(Object.keys(M4().MS.own)),o=M4().ALL.find(x=>x.def&&x.def.id===id),a=sjSpot(150,600),b=o&&spotAt(o.x-OX,o.z-OZ,'YOUR '+o.def.sn);if(!a||!b)return null;return{msg:'"A surveyor needs to see your '+o.def.sn+'. Could you drive him over from '+a.name+'? There\'s a valuation fee in it."',legs:[{s:a,w:1.5,ped:1,t:'PICK UP THE SURVEYOR · '+a.name},{s:b,w:2,t:'SHOW HIM YOUR '+o.def.sn}],pay:45}}},
 {n:'YOUR MANAGER',ok:()=>MBIZ.some(n=>BIZ.own[n]),mk(){const n=pk(MBIZ.filter(n=>BIZ.own[n])),o=SHOPD.find(s=>s.t===n),a=spotAt(-300,-470,'THE DOCKS · CASH & CARRY'),b=o&&spotAt(o.x-OX,o.z-OZ,n);if(!a||!b)return null;return{from:BIZ.own[n].mgr+' ('+n+')',msg:'"Boss, we\'re running out of stock at '+n+'! Can you fetch some from the cash & carry at the docks?"',legs:[{s:a,w:2.5,t:'LOAD UP AT THE CASH & CARRY'},{s:b,w:2,t:'DELIVER THE STOCK TO '+n}],pay:30,biz:n}}}];
function sjOffer(){const L=CONTACTS.filter(c=>{try{return c.ok()}catch(e){return false}});if(!L.length)return;const c=pk(L);let j=null;try{j=c.mk()}catch(e){czErr(e,"marlowe8.js")}if(!j)return;offer={c,j,t:20};const from=j.from||c.n;
 card.innerHTML='<div style="color:#4ad8ff">📞 '+from+' IS CALLING…</div><div style="margin:6px 0 10px;font-weight:normal">'+j.msg+'</div>';const bt=document.createElement('div');bt.style.cssText='display:flex;gap:10px;justify-content:center';
 const mkb=(t,c,fn)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='font:bold 14px ui-monospace,monospace;border:2px solid #fff;border-radius:10px;padding:6px 14px;color:#fff;background:'+c;b.onclick=e=>{e.stopPropagation();fn()};bt.appendChild(b)};
 mkb('✔ ACCEPT (£'+j.pay+')','#2a8a3a',()=>sjAccept());mkb('✕ DECLINE','#8a2a2a',()=>{offer=null;card.style.display='none';toast('YOU LET IT RING OUT')});card.appendChild(bt);card.style.display='block';for(let i=0;i<4;i++)setTimeout(()=>beep(i%2?880:1046,.12,'square',.04),i*160)}
function sjAccept(){if(!offer)return;card.style.display='none';const{c,j}=offer;offer=null;SJ=Object.assign({c,i:0,w:0,t:0,peds:[]},j);sjLeg();toast('📞 FAVOUR FOR '+(j.from||c.n)+(GS.onFoot?' · GET IN YOUR CAR':''))}
function sjLeg(){const l=SJ.legs[SJ.i];SJ.w=0;setWay(l.s.x,l.s.z,l.t);if(l.ped){const w=W(l.s.pu,l.s.pv);SJ.peds.push(man(6100+SJ.i*7+((Math.random()*90)|0),w[0],w[1],Math.atan2(l.s.cu-l.s.pu,l.s.cv-l.s.pv),{ts:3,tc:[.15,.15,.2]}))}}
function sjEnd(){if(!SJ)return;for(const g of SJ.peds)drop(g);clearWay();SJ=null}
function sjTick(dt){if(offer){offer.t-=dt;if(offer.t<=0||!inM()){offer=null;card.style.display='none'}return ''}
 if(!SJ){if(!evFree())return '';sjT-=dt;if(sjT<=0){sjT=170+Math.random()*120;sjOffer()}return ''}
 SJ.t+=dt;if(SJ.t>420||(!inReg()&&!AIRPORT.CIN.on)){toast('📞 FAVOUR CANCELLED: TOOK TOO LONG');sjEnd();return ''}if(SH){sjEnd();return ''}const l=SJ.legs[SJ.i];
 if(GS.onFoot)return '📞 '+l.t+' · GET IN YOUR CAR';
 if(crStopped(l.s.x,l.s.z,9)){SJ.w+=dt;if(SJ.w>=l.w){if(l.ped){for(const g of SJ.peds)drop(g);SJ.peds=[]}SJ.i++;beep(880,.08,'square',.04);
   if(SJ.i>=SJ.legs.length){cash+=SJ.pay;X.sj++;if(SJ.rep&&window.REP)for(const k in SJ.rep)REP.add(k,SJ.rep[k]);if(SJ.biz&&BIZ.own[SJ.biz])BIZ.own[SJ.biz].rep=Math.min(100,BIZ.own[SJ.biz].rep+6);toast('📞 FAVOUR DONE! +£'+SJ.pay+(SJ.biz?' · '+SJ.biz+' REPUTATION UP':''));cheer();try{phText(SJ.from||SJ.c.n,pk(['"Thanks, I owe you one."','"Grazie. You are a good friend."','"Legend. Cheers!"','"Much appreciated!"']),true)}catch(e){czErr(e,"marlowe8.js")}sjEnd();return ''}sjLeg()}
  return l.w>3?'⏳ '+l.t+' · '+Math.max(0,Math.ceil(l.w-SJ.w))+'s':'…'}SJ.w=0;
 return '📞 '+l.t+' · '+Math.round(Math.hypot(l.s.x-GS.x,l.s.z-GS.z))+'M'}
/* ================================================================== THE BIG ONE */
const HE=X.heist;
function bankSpots(){const b=M6().snapTo(560-1120,300,'MARLOWE CITY BANK');if(!b)return null;const al=b.r.ax===0;return[['THE FRONT DOOR',0],['THE CCTV CAMERA',14],['THE SIDE DOOR',-14]].map(([n,o],i)=>({n,i,u:al?b.pu:b.pu+o,v:al?b.pv+o:b.pv}))}
let caseMk=[],carMk=null;
function heistTalk(){const H=X.heist;
 if(H.st===0){H.st=1;H.shots={};renderShop('"Marlowe City Bank on Regent Row. Three million in the vault. First, you go and look at it. ON FOOT. Photograph the front door, the CCTV camera and the side door."');try{phText('DON VITTORIO','"Case the bank on Regent Row. On foot. Three photos. Don\'t look suspicious."',true)}catch(e){czErr(e,"marlowe8.js")}return}
 if(H.st===1)return renderShop('"The bank on Regent Row. Three photos: the front door, the camera, the side door. Walk, don\'t drive."');
 if(H.st===2)return renderShop('"Now a getaway car nobody knows. There\'s a fast one parked at the docks loading bay. Take it, and drive it to the lockup on South Quay."');
 if(!(GT>=22||GT<4))return renderShop('"Not in daylight! Come back after 10 at night."');
 H.pend=1;closeShop();say('DON VITTORIO','"Tonight we make history. Get in the car. The crew are waiting outside the bank."',3600)}
{const d0=CUSTOM_SHOP.don;CUSTOM_SHOP.don=function(msg){d0(msg);const F=M6().MAF,H=X.heist;if((F.ch|0)<3)return;
 if(H.st===0&&H.done&&DAY-H.last<7){dRow('💰 THE BIG ONE: "THE BANK MUST FORGET YOUR FACE. '+(7-(DAY-H.last))+' MORE DAYS."',[['OK',()=>{}]]);return}
 const lab=['💰 THE BIG ONE: MARLOWE CITY BANK'+(H.done?' (AGAIN?)':''),'💰 THE BIG ONE · STEP 1/3: CASE THE BANK','💰 THE BIG ONE · STEP 2/3: A GETAWAY CAR','💰 THE BIG ONE · STEP 3/3: THE JOB (AFTER 10PM)'][H.st];
 dRow(lab,[[H.st===0?'TELL ME':H.st===3?'IT\'S TIME':'REMIND ME',()=>heistTalk()]])}}
function flashW(){const f=document.createElement('div');f.style.cssText='position:fixed;inset:0;background:#fff;z-index:90;pointer-events:none;transition:opacity .5s';document.body.appendChild(f);requestAnimationFrame(()=>{f.style.opacity=0});setTimeout(()=>f.remove(),600);beep(1400,.05,'square',.05)}
function heistTick(dt){const H=X.heist;
 if(H.st!==1&&caseMk.length){caseMk.forEach(m=>scene.remove(m));caseMk=[]}if(H.st!==2&&carMk){scene.remove(carMk);carMk=null}
 if(H.pend&&!SH&&inM()&&!GS.onFoot){H.pend=0;const why=M6().startHeist(0,()=>{const b=Math.round(4000*REP.mult('family'));cash+=b;H.st=0;H.done++;H.last=DAY;HE8.fast=0;REP.add('police',-6);REP.add('family',8);toast('💰 THE BIG ONE IS DONE! YOUR CUT: £'+b);cheer();setTimeout(()=>{try{phText('DON VITTORIO','"Three million. Not a scratch. You have made an old man very happy. Lie low for a week."')}catch(e){czErr(e,"marlowe8.js")}},2500)});if(why)toast(why)}
 if(!inM())return '';
 if(H.st===1){const S=bankSpots();if(!S)return '';if(!caseMk.length)for(const s of S){const m=beacon(0xff40ff);const w=W(s.u,s.v);m.position.set(w[0],Y+7,w[1]);m.userData.i=s.i;caseMk.push(m)}
  caseMk.forEach(m=>m.visible=!H.shots[m.userData.i]);const n=Object.keys(H.shots).length;let near=null,nd=1e9;for(const s of S){if(H.shots[s.i])continue;const w=W(s.u,s.v),d=Math.hypot(w[0]-P.x,w[1]-P.z);if(d<nd){nd=d;near=s}}
  if(GS.onFoot&&near&&nd<2.4){H.hold=(H.hold||0)+dt;if(H.hold>1.4){H.hold=0;H.shots[near.i]=1;flashW();toast('📸 PHOTO OF '+near.n+' ('+(n+1)+'/3)');if(n+1>=3){H.st=2;clearWay();setTimeout(()=>{try{phText('DON VITTORIO','"Good photos. Now steal us a fast car from the docks loading bay and bring it to the lockup on South Quay."')}catch(e){czErr(e,"marlowe8.js")}},1500)}}return '📸 HOLD STILL… PHOTOGRAPHING '+near.n}else H.hold=0;
  if(near){const w=W(near.u,near.v);if(!PH.way||PH.way.n!==near.n)setWay(w[0],w[1],near.n)}return '📸 CASE THE BANK ON FOOT: '+n+'/3 PHOTOS'+(near?' · NEXT: '+near.n+' '+Math.round(nd)+'M':'')+(GS.onFoot?'':' · GET OUT AND WALK')}
 if(H.st===2){const a=M6().snapTo(-300,-470,'THE DOCKS · LOADING BAY'),b=M6().snapTo(-600,-430,'THE LOCKUP · SOUTH QUAY');if(!a||!b)return '';
  if(!H.got){if(!carMk){carMk=MCARMESH([.05,.05,.06],null);carMk.position.set(a.x,Y+.02,a.z);carMk.rotation.y=a.r.ax===0?0:Math.PI/2;scene.add(carMk)}if(!PH.way||PH.way.n!=='THE GETAWAY CAR')setWay(a.x,a.z,'THE GETAWAY CAR');return '🚗 STEAL THE BLACK CAR AT THE DOCKS LOADING BAY (ON FOOT) · '+Math.round(Math.hypot(a.x-pos().x,a.z-pos().z))+'M'}
  if(!PH.way||PH.way.n!=='THE LOCKUP')setWay(b.x,b.z,'THE LOCKUP');if(crStopped(b.x,b.z,9)){H.st=3;H.got=0;clearWay();toast('🔒 THE CAR IS SAFE IN THE LOCKUP. SEE THE DON AFTER 10PM FOR THE JOB');try{phText('DON VITTORIO','"Perfect. Come and see me after 10 tonight. We do it then."')}catch(e){czErr(e,"marlowe8.js")}}
  return '🚗 DRIVE THE GETAWAY CAR TO THE LOCKUP ON SOUTH QUAY · '+Math.round(Math.hypot(b.x-GS.x,b.z-GS.z))+'M'}
 return ''}
function stealCar(){const H=X.heist;if(!carMk)return;fade(()=>{const p=carMk.position,ry=carMk.rotation.y;scene.remove(carMk);carMk=null;GS.x=p.x;GS.z=p.z;GS.psi=ry;GS.vx=GS.vz=0;GS.speed=0;P.x=p.x+2;P.z=p.z;enterCar();camAng=ry;H.got=1;HE8.fast=1;toast('🔑 HOT-WIRED! IT\'S QUICK. NOW GET IT TO THE LOCKUP');beep(110,.5,'sawtooth',.05)})}
/* ================================================================== BUSINESSES: ENTERTAINMENT + THE NIGHT'S TAKINGS */
const ENT=[['NOTHING ON',0,1],['JUKEBOX',15,1.08],['QUIZ NIGHT',40,1.16],['DJ NIGHT',70,1.26],['LIVE BAND',130,1.4]];
{const t0=bzTrade;bzTrade=function(n){const e=ENT[X.ent[n]|0],d=BZD[n],c0=d.c;d.c=Math.round(c0*e[2]);let r;try{r=t0(n)}finally{d.c=c0}if(e[1]&&r){const b=BIZ.own[n];b.till=Math.max(0,b.till-e[1]);b.life-=e[1];r.prof-=e[1];r.note=(r.note?r.note+' ':'')+e[0]+' (−£'+e[1]+')'}return r}}
{const a=PHX.find(x=>x.k==='biz');if(a){const r0=a.render;a.render=function(o){r0(o);const n=PHN.sub,b=n&&BIZ.own[n];if(!b||!BZD[n])return;
 o.el('div','phH',n==='THE CROWN'||/BAR|INN|ROYAL OAK/.test(n)?'MUSIC & ENTERTAINMENT':'ENTERTAINMENT').style.marginTop='10px';const bt=o.el('div','bt');ENT.forEach((e,i)=>o.btn(bt,e[0],()=>{X.ent[n]=i;phRender()},(X.ent[n]|0)===i?'#2a8a3a':null));
 const e=ENT[X.ent[n]|0];o.el('small',null,e[1]?e[0]+' every night: about +'+Math.round((e[2]-1)*100)+'% customers. Costs £'+e[1]+' a night.':'Nothing on. Put on some entertainment to bring more people in.')}}}
let report=null;
{const nd=newDay;newDay=function(){nd();try{rentDay()}catch(e){czErr(e,"marlowe8.js")}try{const L=[];for(const n in BIZ.own){const b=BIZ.own[n];if(b.last)L.push([n,b.last])}if(L.length)report=L}catch(e){czErr(e,"marlowe8.js")}}}
function reportTick(){if(!report||busy||menuOpen||GS.inside&&!inReg())return;const L=report;report=null;busy=1;const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;font:bold 13px ui-monospace,monospace;color:#fff';
 let tot=0,till=0;for(const n in BIZ.own)till+=BIZ.own[n].till;const rows=L.map(([n,r])=>{tot+=r.prof;return '<div style="display:flex;justify-content:space-between;gap:14px;padding:4px 0;border-bottom:1px solid #334"><span>'+(BZD[n]?BZD[n].ic:'')+' '+n+'<br><small style="color:#9ab;font-weight:normal">'+r.cust+' customers'+(r.note?' · '+r.note:'')+'</small></span><span style="color:'+(r.prof>=0?'#9fe89f':'#ff8a8a')+'">'+(r.prof<0?'−':'+')+'£'+Math.abs(r.prof).toLocaleString('en-GB')+'</span></div>'}).join('');
 ov.innerHTML='<div style="background:#1a1430;border:3px solid #ffd24a;border-radius:14px;padding:14px 16px;width:420px;max-width:92vw;max-height:80vh;overflow:auto"><div style="font-size:18px;color:#ffd24a;text-align:center;margin-bottom:8px">📊 LAST NIGHT\'S TAKINGS</div>'+rows+'<div style="display:flex;justify-content:space-between;margin-top:8px;font-size:15px"><span>TOTAL</span><span style="color:'+(tot>=0?'#9fe89f':'#ff8a8a')+'">'+(tot<0?'−':'')+'£'+Math.abs(tot).toLocaleString('en-GB')+'</span></div><div style="display:flex;gap:10px;justify-content:center;margin-top:12px" id="rp8"></div></div>';document.body.appendChild(ov);
 const bx=ov.querySelector('#rp8'),close=()=>{ov.remove();busy=0};const mkb=(t,c,fn)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='font:bold 14px ui-monospace,monospace;border:2px solid #fff;border-radius:10px;padding:7px 14px;color:#fff;background:'+c;b.onclick=fn;bx.appendChild(b)};
 if(till>0)mkb('COLLECT ALL £'+Math.round(till).toLocaleString('en-GB'),'#2a8a3a',()=>{let t=0;for(const n in BIZ.own){t+=BIZ.own[n].till;BIZ.own[n].till=0}cash+=t;toast('COLLECTED £'+Math.round(t).toLocaleString('en-GB'));beep(990,.1,'square',.05);close()});mkb('CLOSE','#444',close)}
/* ================================================================== PROPERTY: LETTING, FURNITURE, PARTIES */
const rentOf=h=>Math.round(h.price*.014);
function rentDay(){let t=0;for(const h of M4().HOMES)if(X.let[h.id]&&M4().MS.own[h.id])t+=rentOf(h);if(t){cash+=t;try{phText('MARLOWE ESTATES','Rent from your tenants: £'+t+' has been paid to you.',true)}catch(e){czErr(e,"marlowe8.js")}}}
{const m0=CUSTOM_SHOP.mest;CUSTOM_SHOP.mest=function(msg){m0(msg);const MS=M4().MS;for(const h of M4().HOMES){if(!MS.own[h.id])continue;const on=X.let[h.id];
 dRow((on?'🔑 LET OUT: ':'LET OUT YOUR ')+h.sn+' · £'+rentOf(h)+' A DAY'+(on?' (TENANTS LIVE THERE)':''),[[on?'END TENANCY':'FIND TENANTS',()=>{if(on)delete X.let[h.id];else X.let[h.id]=1;renderShop(on?'THE TENANTS HAVE MOVED OUT. IT\'S ALL YOURS AGAIN.':'TENANTS FOUND! RENT ARRIVES EVERY MORNING. (YOU CAN\'T STAY THERE WHILE IT\'S LET.)')}]])}}}
{const e0=enterShop;enterShop=function(o,imm){if(o&&o.mc==='home'&&o.def&&X.let[o.def.id]&&M4().MS.own[o.def.id]){toast('YOUR TENANTS LIVE HERE. END THE TENANCY AT MARLOWE ESTATES TO MOVE BACK IN');return}return e0(o,imm)}}
const FURN=[['rug','A BIG RUG',150],['plants','HOUSE PLANTS',80],['art','MODERN ART',300],['tv','A WALL TV',600],['arcade','AN ARCADE MACHINE',900],['disco','A DISCO BALL (PARTIES!)',250]];
let HOMECUR=null,DISCO=null;
function cv(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return new THREE.CanvasTexture(c)}
function furnAdd(k){const B=(x,y,z,w,h,d,hex)=>sbox(x,y,z,w,h,d,fmc(hex));
 if(k==='rug'){const m=new THREE.Mesh(new THREE.PlaneGeometry(Math.min(4,RX*.9),Math.min(3,RZ*.8)).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:cv(128,96,(g,w,h)=>{g.fillStyle='#7a1e2a';g.fillRect(0,0,w,h);g.strokeStyle='#e8c070';g.lineWidth=6;g.strokeRect(8,8,w-16,h-16);g.fillStyle='#1e3a6a';g.fillRect(28,26,w-56,h-52);g.fillStyle='#e8c070';g.beginPath();g.arc(w/2,h/2,12,0,TAU);g.fill()})}));m.position.set(0,.012,.3);SG.add(m)}
 else if(k==='plants'){for(const[x,z]of[[-RX+.45,RZ-.45],[RX-.45,RZ-.45]]){B(x,0,z,.42,.42,.42,0x8a4a2a);B(x,.42,z,.56,.75,.56,0x2a8a3a);B(x,1.1,z,.36,.3,.36,0x3aa04a);IROOM.push([x-.3,x+.3,z-.3,z+.3])}}
 else if(k==='art'){sPlane(1.4,1,RX-.03,1.65,-1.0,-Math.PI/2,cv(140,100,(g,w,h)=>{g.fillStyle='#f4f0e6';g.fillRect(0,0,w,h);for(const[c,x,y,s]of[['#d02a2a',20,18,40],['#2a5ad0',70,40,48],['#f0c020',40,60,30],['#111',100,14,20]]){g.fillStyle=c;g.fillRect(x,y,s,s*.8)}g.strokeStyle='#222';g.lineWidth=6;g.strokeRect(0,0,w,h)}));
  sPlane(.8,1.1,RX-.03,1.6,.9,-Math.PI/2,cv(80,110,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#ff8a3a');gr.addColorStop(1,'#3a1a6a');g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle='#ffe080';g.beginPath();g.arc(w/2,h*.45,14,0,TAU);g.fill();g.strokeStyle='#c8a050';g.lineWidth=6;g.strokeRect(0,0,w,h)}))}
 else if(k==='tv'){sPlane(1.9,1.1,-RX+.05,1.55,.4,Math.PI/2,cv(190,110,(g,w,h)=>{g.fillStyle='#0a0a0a';g.fillRect(0,0,w,h);const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#2a8ad8');gr.addColorStop(1,'#40e0a0');g.fillStyle=gr;g.fillRect(6,6,w-12,h-12);g.fillStyle='#fff';g.font='bold 18px Arial';g.fillText('MARLOWE NEWS',14,h-16)}))}
 else if(k==='arcade'){const x=RX-.55,z=RZ-1.7;B(x,0,z,.7,1.75,.62,0x2a1a6a);B(x,1.75,z,.72,.22,.64,0xff40ff);sPlane(.5,.42,x-.36,1.3,z,-Math.PI/2,cv(100,84,(g,w,h)=>{g.fillStyle='#000';g.fillRect(0,0,w,h);g.fillStyle='#ffe040';g.beginPath();g.arc(30,42,14,.5,5.8);g.lineTo(30,42);g.fill();for(let i=0;i<4;i++){g.fillStyle='#fff';g.fillRect(52+i*12,40,4,4)}}));IROOM.push([x-.4,x+.4,z-.35,z+.35])}
 else if(k==='disco'){DISCO=new THREE.Mesh(new THREE.IcosahedronGeometry(.32,1),new THREE.MeshBasicMaterial({color:0xe8e8f0,wireframe:false}));DISCO.position.set(0,IH+.35,0);SG.add(DISCO);const w=new THREE.Mesh(new THREE.CylinderGeometry(.01,.01,.6,4),new THREE.MeshBasicMaterial({color:0x888888}));w.position.set(0,IH+.8,0);SG.add(w)}}
{const b0=buildShop;buildShop=function(o){b0(o);DISCO=null;if(!o||o.mc!=='home'||!o.def||!M4().MS.own[o.def.id])return;HOMECUR=o;const f=X.furn[o.def.id]||{};for(const k in f)if(f[k])try{furnAdd(k)}catch(e){czErr(e,"marlowe8.js")}
 IA.push({r:[.8,2.4,RZ-1.6,RZ-.1],label:'HOME: DECORATE · THROW A PARTY',fn:()=>openShop('mhome8')})}}
CUSTOM_SHOP.mhome8=function(msg){const o=HOMECUR;if(!o)return closeShop();const f=X.furn[o.def.id]=X.furn[o.def.id]||{};$('shT').textContent='🏠 '+o.def.sn;$('shMsg').textContent=msg||'MAKE IT YOURS · CASH £'+Math.round(cash).toLocaleString('en-GB');
 for(const[k,n,p]of FURN)dRow(n,f[k]?[['OWNED ✓',()=>{},1]]:[['BUY £'+p,()=>{if(cash<p)return renderShop('NOT ENOUGH CASH');cash-=p;f[k]=1;try{furnAdd(k)}catch(e){czErr(e,"marlowe8.js")}beep(880,.08,'square',.05);renderShop(n+' DELIVERED AND FITTED!')}]]);
 dRow('🎉 THROW A HOUSE PARTY · £150 FOR SNACKS & DRINKS (AFTER 7PM)',[['PARTY!',()=>party()]]);dRow('',[['BACK',()=>closeShop()]])};
function party(){const o=HOMECUR;if(!(GT>=19||GT<2))return renderShop('PARTIES START AFTER 7PM');if(cash<150)return renderShop('YOU NEED £150 FOR SNACKS AND DRINKS');cash-=150;closeShop();busy=1;
 const T=o.def.tier,f=X.furn[o.def.id]||{},n=[4,6,8,10][T]+(f.disco?2:0)+(f.arcade?1:0),gs=[];
 for(let i=0;i<n;i++){const x=(Math.random()*2-1)*(RX-1.2),z=(Math.random()*2-1)*(RZ-1.4);try{gs.push(personIn(pSpec(8100+i*13+DAY,{scarf:null,bp:false,bag:0,old:false}),x,z,Math.random()*TAU))}catch(e){czErr(e,"marlowe8.js")}}
 const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:60;pointer-events:none;display:flex;align-items:flex-end;justify-content:center;padding-bottom:120px;font:bold 26px ui-monospace,monospace;color:#fff;text-shadow:0 0 12px #000';ov.textContent='🎉 HOUSE PARTY! 🎉';document.body.appendChild(ov);
 const P_=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]],N=m=>440*Math.pow(2,(m-69)/12);let k=0;
 const iv=setInterval(()=>{k++;ov.style.background=['#ff40ff','#40e0ff','#ffe040','#40ff80'][k%4]+'2a';gs.forEach((g,i)=>{g.position.y=Math.abs(Math.sin(k*.7+i))*.14;g.rotation.y+=.25*(i%2?1:-1);if(g.a1){g.a1.rotation.x=-2.4+Math.sin(k*.9+i)*.6;g.a2.rotation.x=-2.4+Math.cos(k*.9+i)*.6}});
  if(snd){const ch=P_[Math.floor(k/8)%4];if(k%2===0)beep(N(ch[0]-24),.18,'triangle',.04);beep(N(ch[k%3]+12),.12,'square',.014)}
  if(k>60){clearInterval(iv);busy=0;fade(()=>{ov.remove();gs.forEach(g=>SG.remove(g));GT+=3;if(GT>=24){GT-=24;newDay()}const b=hband();todI=b;applyTOD(b);HN.en=Math.max(5,HN.en-15);X.party++;if(window.REP)REP.add('tourist',2);
   toast('🎉 WHAT A PARTY! '+n+' GUESTS'+(f.disco?' AND A DISCO BALL':''));setTimeout(()=>{try{phText(pk(['LILY','JAMIE','RAJ','SOPHIE','TOMASZ']),pk(['"Best party in Marlowe!! When\'s the next one?"','"My head hurts. Totally worth it."','"Who knew you could dance like that?"','"Your place is AMAZING."']))}catch(e){czErr(e,"marlowe8.js")}},4000)})}},200)}
/* ================================================================== YOUR OWN BOAT: RIVER TAXI */
const MOOR={u:-771.5,v:-253};
const DOCKP=[{n:'SOUTH PIER',w:[-760,-262],l:[-771.5,-262]},{n:'EYE PIER',w:[-700,340],l:[-689.5,340]},{n:'NORTH PIER',w:[-760,945],l:[-772,945]}];
let moored=null;
CUSTOM_SHOP.mboat=function(msg){$('shT').textContent='🚤 MARLE BOATS';$('shMsg').textContent=msg||'"Your own boat, moored right here. Run river-taxi fares between the South, Eye and North piers." · CASH £'+Math.round(cash).toLocaleString('en-GB');
 dRow('"THE MARLE CRUISER" · 4 SEATS · TOP SPEED 58 MPH',X.boat?[['OWNED ✓',()=>{},1]]:[['BUY £4,000',()=>{if(cash<4000)return renderShop('YOU NEED £4,000');cash-=4000;X.boat=1;cheer();renderShop('SHE\'S YOURS! TAP "TAKE YOUR BOAT OUT" ON THE PIER.')}]]);dRow('',[['BACK',()=>closeShop()]])};
function myBoat(){const A=M5();if(!A||A.ACT.on)return;let di=0,bd=1e9;DOCKP.forEach((d,i)=>{const w=W(d.l[0],d.l[1]),q=Math.hypot(w[0]-P.x,w[1]-P.z);if(q<bd){bd=q;di=i}});
 if(!A.actStart('myboat',{fov:64}))return;const bt=A.boatMesh();scene.add(bt);if(moored)moored.visible=false;man.visible=false;let u=DOCKP[di].w[0]+(di===1?-22:22),v=DOCKP[di].w[1]+(di===2?-14:14),psi=di===2?Math.PI:0,sp=0;
 const PIERS=[];for(const j of MW.BRIDGE){const e=MW.EW[j];if(j===4){for(const pu of[-704,-756])for(const s of[-1,1])PIERS.push({c:1,u:pu,v:e.v+s*(e.h+5.2),r:1.8})}else for(const pu of[-718,-742])PIERS.push({c:0,u0:pu-2.2,u1:pu+2.2,v0:e.v-e.h-4.3,v1:e.v+e.h+4.3})}
 const ctl={g:0,b:0,l:0,r:0};A.btns([['◀',()=>ctl.l=1,()=>ctl.l=0],['▶',()=>ctl.r=1,()=>ctl.r=0],['BRAKE',()=>ctl.b=1,()=>ctl.b=0],['GAS',()=>ctl.g=1,()=>ctl.g=0],['✕ MOOR',()=>A.actEnd()]]);
 const mk=beacon(0x40ff80);mk.visible=false;let F=null,ped=null,earned=0,last=di;
 const newFare=()=>{let a=(Math.random()*3)|0;if(a===last)a=(a+1)%3;let b=(a+1+((Math.random()*2)|0))%3;F={a,b,st:'find',t:0,w:0};const L=DOCKP[a].l,w=W(L[0],L[1]);if(ped)drop(ped);ped=man(9300+((Math.random()*300)|0),w[0],w[1],Math.atan2(DOCKP[a].w[0]-L[0],DOCKP[a].w[1]-L[1]),{bag:1});const ww=W(...DOCKP[a].w);mk.position.set(ww[0],Y+4,ww[1]);mk.visible=true;toast('🚤 A PASSENGER IS WAITING AT THE '+DOCKP[a].n)};
 newFare();
 A.ACT.tick=dt=>{const g=(ctl.g||keys.up)?1:0,br=(ctl.b||keys.down)?1:0,s=((ctl.l||keys.left)?1:0)-((ctl.r||keys.right)?1:0);sp+=(g*14-br*18)*dt;sp-=sp*.35*dt;sp=Math.max(-4,Math.min(25,sp));psi+=s*dt*(.6+Math.min(1,Math.abs(sp)/10)*.9)*(sp<0?-1:1);
  let nu=u+Math.sin(psi)*sp*dt,nv=v+Math.cos(psi)*sp*dt;if(nu<-766.5||nu>-693.5){nu=Math.max(-766.5,Math.min(-693.5,nu));sp*=.55;beep(90,.15,'sawtooth',.06)}if(nv<-600||nv>1000){nv=Math.max(-600,Math.min(1000,nv));sp*=.4}
  for(const p of PIERS){if(p.c){const dx=nu-p.u,dv=nv-p.v,d=Math.hypot(dx,dv);if(d<p.r+1.1){nu=p.u+dx/d*(p.r+1.1);nv=p.v+dv/d*(p.r+1.1);sp*=.4}}else if(nu>p.u0-1.1&&nu<p.u1+1.1&&nv>p.v0&&nv<p.v1){nu=u;nv=v;sp*=-.3;beep(90,.15,'sawtooth',.06)}}u=nu;v=nv;
  const p=W(u,v);bt.position.set(p[0],Y-3.25+Math.sin(A.ACT.t*3)*.05,p[1]);bt.rotation.set(-Math.min(.12,Math.abs(sp)*.006),psi,((ctl.l||keys.left)?-.06:0)+((ctl.r||keys.right)?.06:0));mk.rotation.y+=dt;
  let line='🚤 YOUR BOAT · '+Math.round(Math.abs(sp)*2.24)+' MPH · EARNED £'+earned;
  if(F){F.t+=dt;const D=DOCKP[F.st==='find'?F.a:F.b],dd=Math.hypot(u-D.w[0],v-D.w[1]);
   if(dd<10&&Math.abs(sp)<2.5){F.w+=dt;if(F.w>1.6){F.w=0;if(F.st==='find'){F.st='ride';F.t=0;if(ped){drop(ped);ped=null}const ww=W(...DOCKP[F.b].w);mk.position.set(ww[0],Y+4,ww[1]);toast('ALL ABOARD! TO THE '+DOCKP[F.b].n);beep(880,.08,'square',.04)}
     else{const fare=Math.round(30+Math.max(0,90-F.t)*.5);cash+=fare;earned+=fare;X.ferry++;last=F.b;toast('🚤 FARE PAID: £'+fare+(F.t<60?' (SPEEDY!)':''));cheer();const L=DOCKP[F.b].l,w=W(L[0],L[1]),gg=man(9700,w[0],w[1],0);setTimeout(()=>drop(gg),5000);F=null;mk.visible=false;setTimeout(()=>{if(A.ACT.on&&A.ACT.k==='myboat')newFare()},2500)}}}else F.w=0;
   if(F)line+='\n'+(F.st==='find'?'PICK UP AT THE ':'DROP OFF AT THE ')+D.n+' · '+Math.round(dd)+'M'+(dd<10?' · SLOW DOWN AND STOP':'')}
  A.topTxt(line)};
 A.ACT.cam=dt=>{const b=bt.position,d=8.5+Math.abs(sp)*.12;camAng+=Math.atan2(Math.sin(psi-camAng),Math.cos(psi-camAng))*Math.min(1,dt*3);cam.position.set(b.x-Math.sin(camAng)*d,b.y+1.95,b.z-Math.cos(camAng)*d);cam.lookAt(b.x+Math.sin(camAng)*4,b.y+.9,b.z+Math.cos(camAng)*4)};
 A.ACT.end=()=>{scene.remove(bt);scene.remove(mk);if(ped)drop(ped);man.visible=true;if(moored)moored.visible=true;let bi=0,bd2=1e9;DOCKP.forEach((d,i)=>{const q=Math.hypot(u-d.w[0],v-d.w[1]);if(q<bd2){bd2=q;bi=i}});const L=DOCKP[bi].l,w=W(L[0],L[1]);P.x=w[0];P.z=w[1];P.y=gH(P.x,P.z);P.psi=0;camAng=0;if(earned)toast('MOORED AT THE '+DOCKP[bi].n+' · YOU EARNED £'+earned)}}
function moorTick(){if(!X.boat||!inM()){if(moored)moored.visible=false;return}const w=W(-764,-250);if(Math.hypot(w[0]-pos().x,w[1]-pos().z)>220){if(moored)moored.visible=false;return}if(!moored){moored=M5().boatMesh();moored.position.set(w[0],Y-3.25,w[1]);scene.add(moored)}if(!actOn())moored.visible=true;moored.position.y=Y-3.25+Math.sin(performance.now()/600)*.04}
CITY.poi.push({n:'MARLE BOATS · BUY A BOAT',u:MOOR.u,v:MOOR.v,ic:'⚓'});
/* ================================================================== use button */
{const c0=ctx;ctx=function(){const b=c0();if(!inM()||!GS.onFoot||busy)return b;const d=(u,v)=>Math.hypot(P.x-OX-u,P.z-OZ-v);
 if(d(MOOR.u,MOOR.v)<3)return X.boat?{label:'TAKE YOUR BOAT OUT (RIVER TAXI)',fn:myBoat}:{label:'MARLE BOATS: BUY YOUR OWN BOAT',fn:()=>openShop('mboat')};
 if(EV&&EV.k==='busk'&&EV.st==='wait'&&d(BUSK.u,BUSK.v)<3.2)return{label:'BUSKER BATTLE vs '+EV.nm+' (BEAT £'+EV.tgt+')',fn:buskBattle};
 if(carMk&&X.heist.st===2&&!X.heist.got&&Math.hypot(P.x-carMk.position.x,P.z-carMk.position.z)<6)return{label:'HOT-WIRE THE GETAWAY CAR',fn:stealCar};
 return b}}
/* ================================================================== tick */
{const u0=updCozy;updCozy=function(dt){u0(dt);if(!M.built)return;wxTick();hospBuild();pigTick(dt);achTick(dt);jobTick(dt);moorTick();reportTick();if(DISCO&&DISCO.parent)DISCO.rotation.y+=dt*1.2;
 const a=evTick(dt),b=sjTick(dt),c=heistTick(dt),line=a||b||c;xHud.style.display=line&&!menuOpen&&!actOn()&&!GS.inside&&!SH?'block':'none';if(line)xHud.textContent=line}}
window.MARLOWE8={hud:xHud,X,PIGS,ACH,achPct,WX,get EV(){return EV},get SJ(){return SJ},get offer(){return offer},sjOffer,sjAccept,evThief,evLost,evBreak,evBusk,buskBattle,heistTalk,stealCar,myBoat,party,DOCKP,MOOR,HOSP:()=>HOSP,bankSpots,CONTACTS,ENT};
})();
