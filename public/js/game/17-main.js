/* ---------- civilian traffic: real car models near the player, simple shapes far away ---------- */
const CIVN=[0,1,2];
function c1Inst(col){const g=new THREE.Group(),tint=new THREE.Vector3(col[0],col[1],col[2]),cl=new Map();
 const cm=m=>{if(!m.isShaderMaterial)return m;if(cl.has(m))return cl.get(m);const u=Object.assign({},m.uniforms,{uCI:{value:new THREE.Matrix4()}});if(u.uTint)u.uTint={value:tint};if(u.uSp)u.uSp={value:0};const n=new THREE.ShaderMaterial({uniforms:u,vertexShader:m.vertexShader,fragmentShader:m.fragmentShader,side:m.side,transparent:m.transparent});n.userData.ci=u.uCI;cl.set(m,n);return n};
 for(const k of c1Kids){if(!k.isMesh||k.geometry.type==='CircleGeometry'||(k.geometry.type==='CylinderGeometry'&&k.geometry.parameters.openEnded))continue;const m=new THREE.Mesh(k.geometry,Array.isArray(k.material)?k.material.map(cm):cm(k.material));m.position.copy(k.position);m.rotation.copy(k.rotation);m.scale.copy(k.scale);g.add(m)}
 g.userData.upd=()=>{g.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(g.matrixWorld).invert();for(const n of cl.values())n.userData.ci.value.copy(inv)};return g}
const FCOL=[[.7,.1,.1],[.1,.2,.5],[.1,.1,.12]],FSTY=[0,0,3,4];
function civInst(c){if(c.m>=10&&window.TRI)return TRI.civ(c.m-10,c.col);if(c.m===0)return c1Inst(c.col);if(c.m===1){let b=0,bd=9;for(let i=0;i<3;i++){const d=Math.abs(FCOL[i][0]-c.col[0])+Math.abs(FCOL[i][1]-c.col[1])+Math.abs(FCOL[i][2]-c.col[2]);if(d<bd){bd=d;b=i}}return window.fiesInst(PCOL[[1,2,7][b]][1])}if(c.m===3)return window.lrInst(c.vi);return window.vanInst()}
function updCiv(){if(GS.inside)return;const cx=cam.position.x,cz=cam.position.z,F=scene.fog.far+30,cand=[];
 for(const c of CIV){c.d=Math.hypot(c.x-cx,c.z-cz);if(c.d<40)cand.push(c)}
 cand.sort((a,b)=>a.d-b.d);const det=new Set();for(let i=0;i<cand.length&&det.size<6;i++){const c=cand[i];if(!c.inst&&!c.fail){const g=civInst(c);if(g){c.inst=g;g.visible=false;scene.add(g)}}if(c.inst)det.add(c)}
 const l=U.uLight.value;if(window.fiesCivUpd){fiesCivUpd(l);vanCivUpd(l);lrCivUpd(l)}
 for(const c of CIV){const d=det.has(c);if(c.inst){c.inst.visible=d;if(d){c.inst.position.set(c.x,G0,c.z);c.inst.rotation.y=c.rot;if(c.inst.userData.upd)c.inst.userData.upd()}}
  const far=!d&&c.d<F;if(far&&!c.far){c.far=aiCar(c.col,FSTY[c.m]);c.far.visible=true}if(c.far){c.far.visible=far;if(far){c.far.position.set(c.x,G0,c.z);c.far.rotation.y=c.rot}}}}


/* ---------- cash shop (garage + wardrobe) ---------- */
var OWN={paint:[1,0,0,0,0,0,0,0],out:[1,0,0,0,0,0],car:[1,0]},ENG=0,TYR=0,shopMode='';
const DEFP=420,VANP=380,CARP=220,MXP=480,VOP=400,ENGP=[60,120,200],TYRP=[40,90],PAINTP=8,OUTP=12;
function applyUpg(){MAXV=[38,42,46,50][ENG];ACCM=[1,1.12,1.25,1.4][ENG];GRIPM=[1,1.25,1.5][TYR];if(CARI===1){MAXV+=4;ACCM*=1.12;GRIPM*=1.1}else if(CARI===2){MAXV-=2;ACCM*=.88;GRIPM*=.97}else if(CARI===3){MAXV-=1;ACCM*=.95;GRIPM*=1.15}else if(CARI===4){MAXV+=7;ACCM*=1.18;GRIPM*=1.12}else if(CARI===5){MAXV+=2;ACCM*=1.05;GRIPM*=1.1}else if(CARI>=6&&window.TRI){const s=TRI.stat(CARI);MAXV+=s[0];ACCM*=s[1];GRIPM*=s[2]}}
function openShop(m){if(window._cb)_cb.style.display='none';shopMode=m;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;$('shop').style.display='flex';renderShop('')}
function closeShop(){busy=0;$('shop').style.display='none'}
function shRow(lbl,btn,fn,on,sw){const r=document.createElement('div');r.className='shrow';const l=document.createElement('span');l.textContent=lbl;if(sw){const d=document.createElement('i');d.style.background=sw;l.prepend(d)}const b=document.createElement('button');b.textContent=btn;if(on)b.className='on';b.onclick=fn;r.append(l,b);$('shList').append(r)}
function renderShop(msg){$('shList').innerHTML='';$('shCash').textContent='CASH £'+Math.round(cash);$('shMsg').textContent=msg||'';if(CUSTOM_SHOP[shopMode])return CUSTOM_SHOP[shopMode](msg);
 if(shopMode==='garage'){$('shT').textContent='GARAGE';
  shRow('CITROËN C1',CARI?'USE':'DRIVING',()=>{setCar(0);renderShop('DRIVING THE C1')},!CARI);
  shRow('FORD FIESTA  (FASTER, GRIPPIER)',CARI===1?'DRIVING':OWN.car[1]?'USE':'BUY £'+CARP,()=>{if(!OWN.car[1]){if(cash<CARP)return renderShop('NOT ENOUGH CASH');cash-=CARP;OWN.car[1]=1}setCar(1);renderShop('DRIVING THE FIESTA')},CARI===1);
  shRow('ROYAL MAIL VAN  (+25% PARCEL PAY)',CARI===2?'DRIVING':OWN.car[2]?'USE':'BUY £'+VANP,()=>{if(!OWN.car[2]){if(cash<VANP)return renderShop('NOT ENOUGH CASH');cash-=VANP;OWN.car[2]=1}setCar(2);renderShop('DRIVING THE ROYAL MAIL VAN')},CARI===2);
  shRow('LAND ROVER DEFENDER  (GRIPPY, TOUGH)',CARI===3?'DRIVING':OWN.car[3]?'USE':'BUY £'+DEFP,()=>{if(!OWN.car[3]){if(cash<DEFP)return renderShop('NOT ENOUGH CASH');cash-=DEFP;OWN.car[3]=1}setCar(3);renderShop('DRIVING THE DEFENDER')},CARI===3);
  shRow('MAZDA MX-5  (QUICK, SPORTY)',CARI===4?'DRIVING':OWN.car[4]?'USE':'BUY £'+MXP,()=>{if(!OWN.car[4]){if(cash<MXP)return renderShop('NOT ENOUGH CASH');cash-=MXP;OWN.car[4]=1}setCar(4);renderShop('DRIVING THE MX-5')},CARI===4);
  shRow('VOLVO V60 ESTATE  (ROOMY, STEADY)',CARI===5?'DRIVING':OWN.car[5]?'USE':'BUY £'+VOP,()=>{if(!OWN.car[5]){if(cash<VOP)return renderShop('NOT ENOUGH CASH');cash-=VOP;OWN.car[5]=1}setCar(5);renderShop('DRIVING THE VOLVO')},CARI===5);
  if(window.TRI)for(const i of TRI.ids)if(OWN.car[i])shRow(CARN[i]+'  ('+CARSD[i]+')',CARI===i?'DRIVING':OWN.car[i]?'USE':'BUY £'+CPR(i),()=>{if(!OWN.car[i]){if(cash<CPR(i))return renderShop('NOT ENOUGH CASH');cash-=CPR(i);OWN.car[i]=1}setCar(i);renderShop('DRIVING THE '+CARN[i])},CARI===i);
  PCOL.forEach((c,i)=>{const cur=paintC===c[1];shRow('PAINT '+(CARI===3&&!i?'STOCK GREEN':CARI>=6&&!i?'STOCK COLOUR':CARI>=4&&!i?'STOCK SILVER':PN[i]),cur?'WEARING':OWN.paint[i]?'USE':'BUY £'+PAINTP,()=>{if(!OWN.paint[i]){if(cash<PAINTP)return renderShop('NOT ENOUGH CASH');cash-=PAINTP;OWN.paint[i]=1}paintC=c[1];applyPaint();renderShop('PAINTED '+PN[i])},cur,c[0])});
  shRow('ENGINE TUNE '+(ENG+1<4?'STAGE '+(ENG+1):'MAXED'),ENG>=3?'MAXED':'BUY £'+ENGP[ENG],()=>{if(ENG>=3)return;if(cash<ENGP[ENG])return renderShop('NOT ENOUGH CASH');cash-=ENGP[ENG];ENG++;applyUpg();renderShop('ENGINE UPGRADED: FASTER!')},ENG>=3);
  shRow('GRIP TYRES '+(TYR+1<3?'STAGE '+(TYR+1):'MAXED'),TYR>=2?'MAXED':'BUY £'+TYRP[TYR],()=>{if(TYR>=2)return;if(cash<TYRP[TYR])return renderShop('NOT ENOUGH CASH');cash-=TYRP[TYR];TYR++;applyUpg();renderShop('TYRES UPGRADED: MORE GRIP')},TYR>=2)}
 else{$('shT').textContent='WARDROBE';OUTF.forEach((o,i)=>{const cur=outfitI===i;shRow(o[0],cur?'WEARING':OWN.out[i]?'WEAR':'BUY £'+OUTP,()=>{if(!OWN.out[i]){if(cash<OUTP)return renderShop('NOT ENOUGH CASH');cash-=OUTP;OWN.out[i]=1}outfitI=i;applyOutfit();renderShop('NEW LOOK!')},cur)})}}
$('shX').onclick=closeShop;

/* ---------- camera ---------- */
const CAMS=[{d:7.2,h:2.9,f:58},{d:12.5,h:5.2,f:56},{d:4.5,h:1.5,f:68}];

function updateCar(){for(const w of wheels){w.userData.wu.uSp.value=GS_SPIN;if(w.userData.front)w.rotation.y=GS.steer*.5}car.position.set(GS.x,GS.y,GS.z);car.rotation.set(GS.pitch+GS.dp,GS.psi,GS.roll+GS.dr,'YXZ');car.updateMatrixWorld(true);U.uCI.value.copy(car.matrixWorld).invert();if(CARI===1)fiesUpd();else if(CARI===2)vanUpd();else if(CARI===3)lrUpd();else if(CARI>=4&&window.NC)NC.upd();lampsUpd()}

/* ---------- audio ---------- */
let AC=null,eng=null,snd=true;
function initAudio(){if(AC){if(AC.state==='suspended')AC.resume();return}try{AC=new(window.AudioContext||window.webkitAudioContext)();const o1=AC.createOscillator(),o2=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();o1.type='sawtooth';o2.type='square';f.type='lowpass';f.frequency.value=650;g.gain.value=0;o1.connect(f);o2.connect(f);f.connect(g);g.connect(AC.destination);o1.start();o2.start();eng={o1,o2,f,g}}catch(e){czErr(e,"17-main.js")}}
function beep(f,dur,type,v){if(!AC||!snd)return;const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type=type||'square';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(v||.07,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(AC.destination);o.start();o.stop(t+dur)}
function updAudio(){if(!eng)return;const t=AC.currentTime,sp=Math.abs(GS.vf||0),gear=Math.min(4,Math.floor(sp/8)),r=(sp-gear*8)/8,fr=48+r*62+gear*9+(inp.gas||keys.up?16:0);eng.o1.frequency.setTargetAtTime(fr,t,.05);eng.o2.frequency.setTargetAtTime(fr*.5,t,.05);eng.f.frequency.setTargetAtTime(420+r*300+(inp.gas||keys.up?250:0),t,.08);eng.g.gain.setTargetAtTime(menuOpen||!snd||GS.onFoot?0:.035+(inp.gas||keys.up?.03:0),t,.1)}

/* ---------- UI ---------- */
function applyRes(){const w=innerWidth||1,h=innerHeight||1,hh=Math.min(RES,h*2),ww=Math.round(hh*w/h);R.setPixelRatio(1);R.setSize(ww,Math.round(hh),false);cam.aspect=w/h;cam.updateProjectionMatrix();stage.classList.toggle('px',RES<=480)}
addEventListener('resize',applyRes);
function bindHold(id,key){const el=$(id);const on=e=>{e.preventDefault();inp[key]=1;el.classList.add('p');initAudio();try{el.setPointerCapture(e.pointerId)}catch(_){czErr(_,"17-main.js")}},off=()=>{inp[key]=0;el.classList.remove('p')};el.addEventListener('pointerdown',on);for(const ev of['pointerup','pointercancel','lostpointercapture'])el.addEventListener(ev,off)}
bindHold('gas','gas');bindHold('brk','brk');bindHold('hand','hand');
{const pad=$('pad'),knob=$('knob');const set=e=>{const r=pad.getBoundingClientRect(),v=clamp((e.clientX-(r.left+r.width/2))/(r.width*.4),-1,1);inp.pad=-v;knob.style.transform='translateX('+(v*r.width*.4)+'px)'};
 pad.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();try{pad.setPointerCapture(e.pointerId)}catch(_){czErr(_,"17-main.js")}pad.classList.add('p');set(e)});
 pad.addEventListener('pointermove',e=>{if(pad.classList.contains('p'))set(e)});
 const off=()=>{inp.pad=0;knob.style.transform='';pad.classList.remove('p')};for(const ev of['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(ev,off)}
addEventListener('keydown',e=>{const k=e.key;if(k==='ArrowUp'||k==='w'||k==='W')keys.up=1;else if(k==='ArrowDown'||k==='s'||k==='S')keys.down=1;else if(k==='ArrowLeft'||k==='a'||k==='A')keys.left=1;else if(k==='ArrowRight'||k==='d'||k==='D')keys.right=1;else if(k===' ')keys.space=1;else if(k==='c'||k==='C')camMode=(camMode+1)%CAMS.length;else if(k==='r'||k==='R')resetAll();else if(k==='f'||k==='F'||k==='e'||k==='E')useBtn();else if(k==='Escape')setMenu(!menuOpen);else return;initAudio();e.preventDefault()});
addEventListener('keyup',e=>{const k=e.key;if(k==='ArrowUp'||k==='w'||k==='W')keys.up=0;else if(k==='ArrowDown'||k==='s'||k==='S')keys.down=0;else if(k==='ArrowLeft'||k==='a'||k==='A')keys.left=0;else if(k==='ArrowRight'||k==='d'||k==='D')keys.right=0;else if(k===' ')keys.space=0});
addEventListener('contextmenu',e=>e.preventDefault());
let hasSave=false;function saveExists(){try{return !!localStorage.getItem('c1save')}catch(e){return false}}
function saveSummary(){try{const d=JSON.parse(localStorage.getItem('c1save'));const dy=d.cz&&d.cz.dy;return (dy?'DAY '+dy+'  ·  ':'')+'£'+Math.round((d.c|0)+(d.gf?0:1000))}catch(e){return ''}}
function setMenu(v){document.body.classList.toggle('mo',v);$('menu').classList.toggle('paused',!!GS.started);document.body.classList.toggle('mo',v);if(v){$('mainCard').style.display='';$('optCard').style.display='none'}menuOpen=v;$('menu').style.display=v?'flex':'none';hasSave=saveExists();$('go').textContent=GS.started?'▶ RESUME':hasSave?'▶ CONTINUE':'▶ NEW GAME';$('newB').style.display=!GS.started&&hasSave?'':'none';$('newB').textContent='NEW GAME';$('newB').classList.remove('warn');$('saveInfo').textContent=!GS.started&&hasSave?saveSummary():'';$('savB').style.display=GS.started&&!GS.inside?'':'none';inp.gas=inp.brk=inp.hand=inp.pad=0}
for(const b of document.querySelectorAll('[data-wx]'))b.onclick=()=>{for(const o of document.querySelectorAll('[data-wx]'))o.classList.remove('on');b.classList.add('on');rainI=+b.dataset.wx;applyTOD(todI)};for(const b of document.querySelectorAll('[data-mus]'))b.onclick=()=>{for(const o of document.querySelectorAll('[data-mus]'))o.classList.remove('on');b.classList.add('on');musOn=+b.dataset.mus};if(Q.get('dbgc'))window.DBGC=Q.get('dbgc').split(',').map(Number);if(Q.get('rain')==='1')rainI=1;if(Q.get('gallery')==='1')setTimeout(openGallery,300);if(Q.get('car')==='1')setCar(1);$('optB').onclick=()=>{$('mainCard').style.display='none';$('optCard').style.display=''};$('optBack').onclick=()=>{$('mainCard').style.display='';$('optCard').style.display='none'};$('bPause').onclick=()=>setMenu(true);function resetAll(){if(GS.inside)leaveHouse(true);GS.onFoot=0;man.visible=false;setLabels();respawn(true)}
$('bReset').onclick=resetAll;$('bUse').onclick=useBtn;$('bCam').onclick=()=>{camMode=(camMode+1)%CAMS.length};$('bSnd').onclick=()=>{snd=!snd;$('bSnd').style.opacity=snd?1:.4;initAudio()};
function beginPlay(){GS.started=1;initAudio();setMenu(false);try{if(!(window.matchMedia&&matchMedia('(pointer:coarse)').matches))return;const e=document.documentElement;(e.requestFullscreen||e.webkitRequestFullscreen||function(){}).call(e);if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{})}catch(_){czErr(_,"17-main.js")}}
$('go').onclick=()=>{if(!GS.started&&saveExists()){if(loadGame()){beginPlay();return}}beginPlay()};
let nbT=0;$('newB').onclick=()=>{const b=$('newB');if(!b.classList.contains('warn')){b.classList.add('warn');b.textContent='TAP AGAIN: START FRESH';clearTimeout(nbT);nbT=setTimeout(()=>{b.classList.remove('warn');b.textContent='NEW GAME'},3200);return}if(window.CZSAVE&&saveExists()){b.textContent='STARTING FRESH…';return CZSAVE.newGame()}beginPlay()};
for(const b of document.querySelectorAll('[data-tod]'))b.onclick=()=>{for(const o of document.querySelectorAll('[data-tod]'))o.classList.remove('on');b.classList.add('on');applyTOD(+b.dataset.tod);setClock(+b.dataset.tod)};
for(const b of document.querySelectorAll('[data-season]'))b.onclick=()=>{for(const o of document.querySelectorAll('[data-season]'))o.classList.remove('on');b.classList.add('on');applySeason(+b.dataset.season)};
for(const b of document.querySelectorAll('[data-res]'))b.onclick=()=>{for(const o of document.querySelectorAll('[data-res]'))o.classList.remove('on');b.classList.add('on');RES=+b.dataset.res;applyRes()};
const PCOL=[['#ffffff',[1,1,1]],['#c8102e',[.85,.07,.12]],['#1c4fa0',[.12,.28,.8]],['#e8c11a',[1,.76,.06]],['#2a9d58',[.1,.58,.27]],['#f08a24',[1,.42,.06]],['#8b8f96',[.5,.52,.56]],['#1a1a1d',[.1,.1,.11]]];
PCOL.forEach((c,i)=>{const b=document.createElement('button');b.className='sw'+(i===0?' on':'');b.style.background=c[0];b.onclick=()=>{for(const o of $('sw').children)o.classList.remove('on');b.classList.add('on');paintC=c[1];applyPaint()};$('sw').appendChild(b)});
// minimap
const MMS=128,MBS=1600,mm=$('mm'),mc=mm.getContext('2d'),mb=document.createElement('canvas');mm.width=mm.height=MMS;mb.width=mb.height=MBS;
const mx=x=>(x+HALF)/SIZE*MBS,mz=z=>(HALF-z)/SIZE*MBS;
{const x=mb.getContext('2d'),k=MBS/SIZE;x.fillStyle='#2a6a8a';x.fillRect(0,0,MBS,MBS);townMap(x,mx,mz,k);x.fillStyle='#5aa648';x.beginPath();x.arc(mx(GRC[0]),mz(GRC[1]),GRR*k,0,6.3);x.fill();x.fillStyle='#4a82b4';x.beginPath();x.arc(mx(GRC[0]+9),mz(GRC[1]-6),4*k,0,6.3);x.fill();
 x.strokeStyle='#d8d8d0';x.lineCap='round';x.lineJoin='round';x.lineWidth=9*k;for(const r of ROADS){x.strokeStyle=r.rural?'#c8bc98':'#d8d8d0';x.beginPath();r.p.forEach((q,i)=>i?x.lineTo(mx(q[0]),mz(q[1])):x.moveTo(mx(q[0]),mz(q[1])));x.stroke();if(r.head){x.fillStyle='#d8d8d0';x.beginPath();x.arc(mx(r.head[0]),mz(r.head[1]),r.head[2]*k,0,6.3);x.fill()}}
 x.fillStyle='#8a6a5c';for(const b of BLD){x.save();x.translate(mx(b.x),mz(b.z));x.rotate(b.rot);x.fillRect(-b.w/2*k,-b.d/2*k,b.w*k,b.d*k);x.restore()}}
function drawMap(){const T0=GS.inside?{x:HM.x,z:HM.z}:GS.onFoot?P:GS,VW=MMS*1.9,sc=MMS/VW;mc.setTransform(1,0,0,1,0,0);mc.fillStyle='#2a6a8a';mc.fillRect(0,0,MMS,MMS);mc.setTransform(sc,0,0,sc,MMS/2-mx(T0.x)*sc,MMS/2-mz(T0.z)*sc);mc.drawImage(mb,0,0);
 for(const d of DEPOTS){mc.fillStyle=d.type==='food'?'#ffd23a':'#4aa8ff';mc.fillRect(mx(d.x)-2.5,mz(d.z)-2.5,5,5)}
 if(JOB.on)for(const s of JOB.stops){if(s.done)continue;mc.fillStyle='#ff4a2a';mc.beginPath();mc.arc(mx(s.dx),mz(s.dz),3,0,6.3);mc.fill()}
 const T=GS.inside?{x:HM.x,z:HM.z,psi:P.psi}:GS.onFoot?P:GS;if(GS.onFoot){mc.fillStyle='#4af';mc.fillRect(mx(GS.x)-2,mz(GS.z)-2,5,5)}
 mc.save();mc.translate(mx(T.x),mz(T.z));mc.rotate(Math.atan2(-Math.cos(T.psi),Math.sin(T.psi)));mc.fillStyle='#fff';mc.strokeStyle='#d00';mc.lineWidth=1.5;mc.beginPath();mc.moveTo(6/sc,0);mc.lineTo(-4/sc,-3.5/sc);mc.lineTo(-4/sc,3.5/sc);mc.closePath();mc.fill();mc.stroke();mc.restore();for(const f of MMH)try{f(mc,mx,mz,sc)}catch(e){czErr(e,"17-main.js")}mc.setTransform(1,0,0,1,0,0)}
var MMH=[];

/* ---------- main loop ---------- */
let last=performance.now(),hudT=0;
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;
 if(!menuOpen&&!busy){step(dt);GS_SPIN+=(GS.vf||0)*dt/.275;if(GS.onFoot)GS.inside?stepIn(dt):stepFoot(dt);else ST=Math.min(100,ST+6*dt)}
 updateMan();updHome(dt);updJob(dt);updTraffic(dt);updGallery(dt);updPeds(dt,now);updRain(dt);updMusic(dt);cullChunks();if(GS.inside){updIn(now);updShop(now)}
 for(const g of GEMS){if(!g.visible)continue;g.rotation.y+=dt*2.2;g.position.y=hAt(g.userData.x,g.userData.z)+1.5+Math.sin(now*.003+g.userData.x)*.25}
 for(const p of dust){if(p.age>=p.life){p.s.visible=false;continue}p.age+=dt;const t=p.age/p.life;p.s.position.x+=p.vx*dt;p.s.position.y+=p.vy*dt*(1-t);p.s.position.z+=p.vz*dt;p.s.scale.setScalar(1+t*3.2);p.s.material.opacity=.55*(1-t)}
 clouds.rotation.y+=dt*.003;if(seasonI)updSnow(dt,now);updateCar();updateCam(dt);updAudio();
 if(toastT>0){toastT-=dt;if(toastT<=0)$('toast').style.opacity=0}
 hudT-=dt;if(hudT<=0){hudT=.08;$('mph').textContent=Math.round(GS.speed*2.237);$('gcount').textContent=GS.gems+'/'+GEMS.length;updUse();updJobHUD();$('gcount').textContent=Math.round(cash);$('gdel').textContent=dels+' DELIVERED  '+'★'.repeat(repStars())+'☆'.repeat(5-repStars());$('sta').style.display=GS.onFoot?'block':'none';{const b=$('stab');b.style.width=ST+'%';b.style.background=exh?'#e04040':ST<35?'#e8b020':'#4cd964'}}
 drawMap();R.render(scene,cam);window.FRAMES=(window.FRAMES||0)+1}

Promise.all(['side','top','front','rear','mask','paint'].map(loadTex)).then(()=>{
 for(const k of['mask','paint']){tex[k].generateMipmaps=false;tex[k].minFilter=tex[k].magFilter=THREE.LinearFilter;tex[k].needsUpdate=true}
 U.tM.value=tex.mask;U.tP.value=tex.paint;delete tex.mask;delete tex.paint;
 U.tS.value=tex.side;U.tT.value=tex.top;U.tF.value=tex.front;U.tR.value=tex.rear;filt();
 cam.near=.3;cam.far=1400;
 if(Q.has('res'))RES=+Q.get('res');
 applyRes();applyTOD(Q.has('tod')?+Q.get('tod'):0);if(Q.has('season'))applySeason(+Q.get('season'));if(Q.has('color')){const c=PCOL[+Q.get('color')];if(c){paintC=c[1];applyPaint()}}
 if(Q.has('cam'))camMode=+Q.get('cam');
 if(Q.get('auto')==='1'||SHOT){menuOpen=false;document.body.classList.remove('mo');GS.started=1;$('menu').style.display='none'}
 if(SHOT){$('hud').style.display='none'}
 if(Q.get('gas')==='1')inp.gas=1;if(Q.get('hand')==='1')inp.hand=1;if(Q.has('pad'))inp.pad=+Q.get('pad');
 if(Q.has('x')){GS.x=+Q.get('x');GS.z=+Q.get('z');GS.psi=+Q.get('psi')||0;GS.y=gH(GS.x,GS.z)+.1;GS.prevGY=GS.y}
 if(Q.get('foot')==='1')exitCar();
 if(Q.get('in')==='1'){GS.onFoot=1;man.visible=true;enterHouse(true)}
 if(Q.has('sim')){const n=Math.round(+Q.get('sim')*60);for(let i=0;i<n;i++){if(Q.has('padat')&&i===Math.round(+Q.get('padat')*60))inp.pad=+Q.get('pad2');step(1/60);if(GS.onFoot)stepFoot(1/60)}camAng=(GS.onFoot?P:GS).psi}
 window.GS=GS;requestAnimationFrame(loop);window.READY=true;if(window.__bootDone){const g=$('go');g.disabled=false;setMenu(true)}});
