/* ---- PHONE: tap the 📱 button (or press P). Messages, map, bank, stocks, camera + photos, jobs board with waypoints. ---- */
const PH={msgs:[],way:null,photos:[],log:[],lastCash:null,lastNews:'',hrT:0,seen:{}};
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.ph={msgs:PH.msgs.slice(0,40),way:PH.way,seen:PH.seen};return o};cozyLoad=function(z){l0(z);if(z&&z.ph){PH.msgs=z.ph.msgs||[];PH.way=z.ph.way||null;PH.seen=z.ph.seen||{}}phBadge()}}
const phClock=()=>{const h=Math.floor(GT),m=Math.floor((GT-h)*60);return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')};
const phMoney=v=>'£'+Math.round(v).toLocaleString('en-GB');
function phText(from,txt,quiet){PH.msgs.unshift({f:from,t:txt,d:DAY,h:phClock(),r:0});PH.msgs.length=Math.min(PH.msgs.length,40);phBadge();if(!quiet&&!PHN.ov){toast('📱 NEW MESSAGE FROM '+from);beep(1320,.05,'square',.04);setTimeout(()=>beep(1760,.06,'square',.04),90)}}
function phBadge(){const b=document.getElementById('phBadge');if(!b)return;const n=PH.msgs.filter(m=>!m.r).length;b.textContent=n;b.style.display=n?'block':'none'}
/* ---- villagers who text you ---- */
const PHTX=[['MR SINGH','Fresh samosas just out of the fryer. Pop in!'],['FARMER HOLT','Could use a hand baling hay if you are free. Pays £7 a bale.'],['FRANKIE','Busy night at the chippy. Food deliveries pay well tonight.'],['MR SHAH','The parcels board is full. Come and grab a round.'],['KEV THE BUILDER','Quiz night at the Royal Oak. You in?'],['RANI','New silk saris and sherwanis in this week!'],['JOE',"Got some new turbo kits in at the garage."],['MUM','Are you eating properly? Ring me sometime x'],['OLD TOM','Rovers at home this weekend. Save me a seat.'],['RUTH & CO','House prices are up. Thinking of buying?'],['CASINO ROYALE','Your table is waiting. Gold card holders get comps.'],['COZY KARTS','Track is quiet. Come and set a lap record.']];
{const nd0=newDay;newDay=function(){nd0();try{
 if(window.PROP){const p=Object.values(PROP.PR.pend||{}).reduce((a,b)=>a+(+b||0),0);if(p>0)phText('RUTH & CO','You have '+phMoney(p)+' of rent waiting to collect at the estate agent.')}
 const t=PHTX[(DAY*7+3)%PHTX.length];phText(t[0],t[1])}catch(e){czErr(e,"19-phone.js")}}}
/* ---- waypoint: a light beam in the world and a pill under the HUD ---- */
const phBeam=(()=>{const g=new THREE.Group(),m=new THREE.MeshBasicMaterial({color:0x40c8ff,transparent:true,opacity:.45,depthWrite:false,fog:false});const c=new THREE.Mesh(new THREE.CylinderGeometry(.6,.6,60,10,1,true),m);c.position.y=30;g.add(c);const r=new THREE.Mesh(new THREE.RingGeometry(1.4,2.2,24).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x40c8ff,transparent:true,opacity:.8,side:THREE.DoubleSide,fog:false}));r.position.y=.15;g.add(r);g.visible=false;scene.add(g);return g})();
const phPill=(()=>{const e=document.createElement('div');e.style.cssText='position:fixed;left:50%;top:44px;transform:translateX(-50%);z-index:25;background:rgba(10,40,70,.85);border:2px solid #40c8ff;border-radius:14px;color:#fff;font:bold 12px ui-monospace,monospace;padding:3px 10px;pointer-events:auto;display:none;cursor:pointer';e.title='Tap to clear';e.onclick=()=>{if(PH.way&&PH.way.keep)return;PH.way=null;phWay()};document.body.appendChild(e);return e})();
function phWay(){const w=PH.way;phBeam.visible=!!w&&!GS.inside;if(w)phBeam.position.set(w.x,G0,w.z);if(!w)phPill.style.display='none'}
/* ---- jobs board ---- */
function phDoor(n){const o=SHOPD.find(s=>s.t===n);return o?{x:o.x,z:o.z}:null}
function phJobs(){const L=[];const add=(n,pay,info,pos,st)=>{if(pos)L.push({n,pay,info,pos,st})};
 add('PARCEL DELIVERIES','£15 - £60 A ROUND','Pick a job off the board in the Post Office, load up at the bay round the back.',phDoor('POST OFFICE'),JOB.on&&JOB.type!=='food'?'ON A ROUND · '+JOB.stops.filter(s=>!s.done).length+' STOPS LEFT':'');
 add('FOOD DELIVERIES',"TIPS IF YOU'RE QUICK","Collect hot orders from Frankie's and deliver them before they go cold.",phDoor("FRANKIE'S FISH & CHIPS"),JOB.on&&JOB.type==='food'?'DELIVERING FOOD':'');
 add('CAFE SHIFT','£ PER DRINK + TIPS','Take orders and serve drinks at the café. Open 8am - 4pm.',phDoor('CAFE'),'');
 add('HAY BALING','£7 A BALE','Drive the tractor and baler over the windrows at the hay field.',{x:-102,z:200},window.HAY&&HAY.on?'BALING NOW':'');
 if(window.KARTS)add('GO-KART RACES','PRIZE MONEY','Race the karts on the track off the High Street.',{x:KARTS.KIOSK.x,z:KARTS.KIOSK.z},'');
 add('MOTOR RACING','PRIZES + CHAMPIONSHIP','Book a race at the clubhouse and race your own car.',phDoor('COZY MOTORSPORT CLUB'),'');
 add('FISHING & CARGO','CATCH, SALVAGE, CONTRACTS','Take the ferry to the harbour, then fish shoals and run cargo.',phDoor('COZY HARBOUR FERRY'),'');
 add('PROPERTY','RENT EVERY DAY','Buy houses from Ruth & Co, renovate them and collect the rent.',phDoor('ESTATE AGENT'),'');
 add('STOCK TRADING','BUY LOW, SELL HIGH','Trade shares in ten village companies at the exchange, or in the Stocks app.',phDoor('COZY STOCK EXCHANGE'),'');
 add('FLIGHTS','TRAVEL','Fly to Marlowe City from the airport at the end of Airport Road.',phDoor('COZY AIRWAYS'),'');
 return L}
/* ---- the phone itself ---- */
const PHN={ov:null,app:'home',sub:null};var PHX=[];
(function(){const st=document.createElement('style');st.textContent=`
#phB{position:relative}#phBadge{position:absolute;right:-4px;top:-4px;background:#e02030;color:#fff;border-radius:9px;font:bold 10px monospace;min-width:16px;height:16px;line-height:16px;text-align:center;display:none;border:1px solid #fff}
#phO{position:fixed;inset:0;z-index:70;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;font:bold 13px ui-monospace,Menlo,monospace;color:#fff;touch-action:manipulation}
#phD{width:min(330px,92vw);height:min(640px,94vh);background:#0c0f18;border:6px solid #2a2e3a;border-radius:34px;box-shadow:0 0 0 2px #000,8px 10px 0 rgba(0,0,0,.4);display:flex;flex-direction:column;overflow:hidden;position:relative}
#phS{display:flex;justify-content:space-between;padding:10px 18px 6px;font-size:12px;color:#cde;background:#0c0f18}
#phC{flex:1;overflow-y:auto;padding:8px 12px 12px;-webkit-overflow-scrolling:touch}
#phN{display:flex;justify-content:space-around;padding:8px 0 12px;border-top:1px solid #222838}
#phN button{background:none;border:0;color:#cde;font:bold 13px monospace;padding:6px 14px}
.phG{display:grid;grid-template-columns:repeat(3,1fr);gap:16px 8px;padding-top:14px}
.phA{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:0;color:#fff;font:bold 10px monospace;position:relative}
.phA i{display:flex;width:58px;height:58px;border-radius:16px;align-items:center;justify-content:center;font-style:normal;font-size:28px;box-shadow:2px 3px 0 rgba(0,0,0,.45)}
.phA b{position:absolute;top:-4px;right:8px;background:#e02030;border-radius:9px;min-width:18px;height:18px;line-height:18px;font-size:10px;border:1px solid #fff}
.phH{font-size:16px;color:#ffe14a;margin:4px 0 10px;letter-spacing:.05em}
.phR{background:#161b28;border:1px solid #2a3248;border-radius:12px;padding:9px 10px;margin-bottom:8px}
.phR small{display:block;color:#8fa0c0;font-size:10px;margin-top:3px}
.bt{margin:7px 0;display:flex;gap:6px;flex-wrap:wrap}
.bt button,.phBtn{background:#1c4fa0;color:#fff;border:2px solid #fff;border-radius:8px;font:bold 11px monospace;padding:5px 9px;box-shadow:2px 2px 0 #000}
.phK{display:flex;justify-content:space-between;align-items:center}
.phBig{font-size:30px;color:#9fe89f;margin:6px 0 12px}
.phPh{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}.phPh img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px}
#photoUI{position:fixed;inset:0;z-index:69;touch-action:none;user-select:none}
#photoUI .sh{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);width:74px;height:74px;border-radius:50%;background:#fff;border:6px solid #aaa;box-shadow:0 0 0 3px #000}
#photoUI .x{position:absolute;right:14px;top:14px}#photoUI .hint{position:absolute;left:0;right:0;top:16px;text-align:center;font:bold 12px monospace;color:#fff;text-shadow:2px 2px 0 #000}
#photoUI .fl{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;transition:opacity .25s}
body.photo #hud,body.photo #pedals,body.photo #pad,body.photo #top,body.photo #bUse,body.photo #speed,body.photo #hnhud,body.photo #toast,body.photo #jobhud,body.photo .fpsd{visibility:hidden!important}`;document.head.appendChild(st);
 const tb=document.getElementById('topbtns');if(tb){const b=document.createElement('button');b.className='ib';b.id='phB';b.innerHTML='📱<span id="phBadge"></span>';b.onclick=e=>{e.stopPropagation();phOpen()};tb.appendChild(b)}})();
addEventListener('keydown',e=>{if((e.key==='p'||e.key==='P')&&!e.repeat){if(PHN.ov){phClose();return}if(!busy&&!menuOpen&&!document.querySelector('#brov,#photoUI'))phOpen()}});
function phOpen(){if(PHN.ov||menuOpen||busy)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;const o=document.createElement('div');o.id='phO';o.innerHTML='<div id="phD"><div id="phS"><span id="phT"></span><span id="phM"></span></div><div id="phC"></div><div id="phN"><button data-a="back">◀</button><button data-a="home">●</button><button data-a="close">✕</button></div></div>';
 o.addEventListener('click',e=>{if(e.target===o)phClose()});o.querySelector('[data-a=back]').onclick=()=>{if(PHN.sub!=null){PHN.sub=null;phRender()}else phGo('home')};o.querySelector('[data-a=home]').onclick=()=>phGo('home');o.querySelector('[data-a=close]').onclick=phClose;
 document.body.appendChild(o);PHN.ov=o;phGo('home');beep(900,.04,'square',.03)}
function phClose(){if(!PHN.ov)return;PHN.ov.remove();PHN.ov=null;busy=0;phBadge()}
function phGo(a){PHN.app=a;PHN.sub=null;phRender()}
function phRender(){const o=PHN.ov;if(!o)return;o.querySelector('#phT').textContent=phClock()+'  DAY '+DAY;o.querySelector('#phM').textContent=phMoney(cash);const C=o.querySelector('#phC');C.innerHTML='';C.scrollTop=0;const el=(t,cl,txt,par)=>{const e=document.createElement(t);if(cl)e.className=cl;if(txt!=null)e.textContent=txt;(par||C).appendChild(e);return e};
 const btn=(par,txt,fn,bg)=>{const b=el('button',null,txt,par);if(bg)b.style.background=bg;b.onclick=fn;return b};
 const a=PHN.app;
 if(a==='home'){const un=PH.msgs.filter(m=>!m.r).length;el('div','phH','COZY PHONE');const g=el('div','phG');
  for(const[k,ic,n,bg]of[['msg','💬','MESSAGES','#2a9a4a'],['map','🗺','MAP','#2a6ad0'],['bank','💷','BANK','#c89020'],['stk','📈','STOCKS','#1a7a6a'],['cam','📷','CAMERA','#505a70'],['pho','🖼','PHOTOS','#a03a8a'],['job','🧰','JOBS','#c05020'],...PHX.map(x=>[x.k,x.ic,x.n,x.bg])]){const b=el('button','phA',null,g);const i=el('i',null,ic,b);i.style.background=bg;el('span',null,n,b);if(k==='msg'&&un)el('b',null,String(un),b);
   b.onclick=()=>{if(k==='map'){phClose();FMAP.open();return}if(k==='cam'){phClose();phPhoto();return}phGo(k)}}
  if(PH.way){const r=el('div','phR');r.style.marginTop='18px';el('div',null,'WAYPOINT: '+PH.way.n,r);const bt=el('div','bt',null,r);btn(bt,'CLEAR',()=>{PH.way=null;phWay();phRender()})}}
 else if(PHX.some(x=>x.k===a)){PHX.find(x=>x.k===a).render({el,btn,C})}
 else if(a==='msg'){if(PHN.sub!=null){const m=PH.msgs[PHN.sub];if(!m)return phGo('msg');m.r=1;el('div','phH',m.f);const r=el('div','phR');el('div',null,m.t,r);el('small',null,'DAY '+m.d+' · '+m.h,r);return}
  el('div','phH','MESSAGES');if(!PH.msgs.length)el('div','phR','No messages yet.');PH.msgs.forEach((m,i)=>{const r=el('div','phR');r.style.cursor='pointer';if(!m.r)r.style.borderColor='#3aa0ff';const k=el('div','phK',null,r);el('span',null,(m.r?'':'● ')+m.f,k);el('small',null,'DAY '+m.d+' '+m.h,k);el('small',null,m.t.length>46?m.t.slice(0,44)+'…':m.t,r);r.onclick=()=>{PHN.sub=i;phRender()}});
  if(PH.msgs.length){const bt=el('div','bt');btn(bt,'MARK ALL READ',()=>{PH.msgs.forEach(m=>m.r=1);phRender()})}}
 else if(a==='bank'){let sv=0,own=0,pend=0,chips=0;try{const S=STOCKS.ST;for(const c of STOCKS.CO)sv+=S.sh[c[0]]*S.px[c[0]]}catch(e){czErr(e,"19-phone.js")}try{own=Object.keys(PROP.PR.own).length;pend=Object.values(PROP.PR.pend).reduce((x,y)=>x+(+y||0),0)}catch(e){czErr(e,"19-phone.js")}try{chips=CG.S.chips||0}catch(e){czErr(e,"19-phone.js")}
  let pv=0;try{for(const k in PROP.PR.own)pv+=PROP.price(+k)}catch(e){czErr(e,"19-phone.js")}
  el('div','phH','BLUEBELL BANK');el('div',null,'CURRENT ACCOUNT');el('div','phBig',phMoney(cash));
  for(const[n,v]of[['SHARES',sv],['CASINO CHIPS',chips],['PROPERTY ('+own+' HOUSE'+(own===1?'':'S')+')',pv],['RENT WAITING',pend]]){const r=el('div','phR phK');el('span',null,n,r);el('span',null,phMoney(v),r)}
  const r=el('div','phR phK');r.style.borderColor='#ffd24a';el('span',null,'NET WORTH',r);el('span',null,phMoney(cash+sv+chips+pv+pend),r);
  el('div','phH','RECENT ACTIVITY').style.marginTop='14px';if(!PH.log.length)el('div','phR','Nothing yet today.');for(const t of PH.log){const q=el('div','phR phK');el('span',null,'DAY '+t.d+' '+t.h,q);const s=el('span',null,(t.v>0?'+':'−')+phMoney(Math.abs(t.v)),q);s.style.color=t.v>0?'#9fe89f':'#ff8a8a'}}
 else if(a==='stk'){if(!window.STOCKS){el('div','phR','The exchange is closed.');return}const S=STOCKS.ST;el('div','phH','STOCKS');
  for(const c of STOCKS.CO){const id=c[0],h=S.hist[id],p=S.px[id],ch=h[h.length-1]/h[Math.max(0,h.length-13)]-1,r=el('div','phR');const k=el('div','phK',null,r);el('span',null,id+'  '+c[1],k);const pv=el('span',null,'£'+p.toFixed(2),k);
   const sm=el('small',null,(ch>=0?'▲ ':'▼ ')+(ch*100).toFixed(1)+'%'+(S.sh[id]?'   ·   YOU OWN '+S.sh[id]:''),r);sm.style.color=ch>=0?'#9fe89f':'#ff8a8a';
   const bt=el('div','bt',null,r);btn(bt,'BUY 1',()=>{if(!STOCKS.buy(id,1))toast('NOT ENOUGH CASH');phRender()});btn(bt,'BUY 10',()=>{if(!STOCKS.buy(id,10))toast('NOT ENOUGH CASH');phRender()});if(S.sh[id]){btn(bt,'SELL 1',()=>{STOCKS.sell(id,1);phRender()},'#a03030');btn(bt,'SELL ALL',()=>{STOCKS.sell(id,S.sh[id]);phRender()},'#a03030')}}
  if(S.news&&S.news.length){el('div','phH','NEWS').style.marginTop='12px';for(const n of S.news.slice(0,6))el('div','phR',n)}
  el('small',null,'A small dealing fee applies to every trade.')}
 else if(a==='pho'){el('div','phH','PHOTOS');if(PHN.sub!=null){const p=PH.photos[PHN.sub];if(!p)return phGo('pho');const im=el('img');im.src=p;im.style.cssText='width:100%;border-radius:10px';const bt=el('div','bt');bt.style.cssText='display:flex;gap:8px;margin-top:10px';const dl=el('a','phBtn','SAVE TO DEVICE',bt);dl.href=p;dl.download='cozytown-photo-'+(PHN.sub+1)+'.jpg';dl.style.textDecoration='none';btn(bt,'DELETE',()=>{PH.photos.splice(PHN.sub,1);PHN.sub=null;phRender()},'#a03030');return}
  if(!PH.photos.length){el('div','phR','No photos yet. Open the Camera app to take one.');return}const g=el('div','phPh');PH.photos.forEach((p,i)=>{const im=el('img',null,null,g);im.src=p;im.onclick=()=>{PHN.sub=i;phRender()}});el('small',null,'Photos stay on the phone until you close the game. Tap one to save it.').style.marginTop='8px'}
 else if(a==='job'){el('div','phH','JOBS BOARD');for(const j of phJobs()){const r=el('div','phR');const k=el('div','phK',null,r);el('span',null,j.n,k);const pay=el('small',null,j.pay,k);pay.style.color='#9fe89f';el('small',null,j.info,r);if(j.st){const s=el('small',null,'● '+j.st,r);s.style.color='#ffd24a'}
  const d=Math.hypot(j.pos.x-(GS.onFoot?P.x:GS.x),j.pos.z-(GS.onFoot?P.z:GS.z));const bt=el('div','bt',null,r);btn(bt,PH.way&&PH.way.n===j.n?'WAYPOINT SET ✓':'SET WAYPOINT ('+Math.round(d)+'m)',()=>{PH.way={x:j.pos.x,z:j.pos.z,n:j.n};phWay();toast('WAYPOINT SET: '+j.n);phRender()})}}}
/* ---- camera / photo mode ---- */
const PHC={on:0,a:0,p:.35,d:6};
function phPhoto(){if(PHC.on)return;PHC.on=1;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;const T=GS.onFoot?P:GS;PHC.a=(T.psi||0)+Math.PI;PHC.p=.32;PHC.d=GS.onFoot?5:8;document.body.classList.add('photo');
 const u=document.createElement('div');u.id='photoUI';u.innerHTML='<div class="hint">DRAG TO MOVE THE CAMERA · PINCH OR SCROLL TO ZOOM</div><button class="phBtn x">✕ CLOSE</button><button class="sh" aria-label="Take photo"></button><div class="fl"></div>';document.body.appendChild(u);PHC.ui=u;
 const ptr=new Map();let pd=0;u.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;ptr.set(e.pointerId,[e.clientX,e.clientY]);try{u.setPointerCapture(e.pointerId)}catch(_){czErr(_,"19-phone.js")}});
 u.addEventListener('pointermove',e=>{if(!ptr.has(e.pointerId))return;const o=ptr.get(e.pointerId);if(ptr.size===2){ptr.set(e.pointerId,[e.clientX,e.clientY]);const [p1,p2]=[...ptr.values()],dd=Math.hypot(p1[0]-p2[0],p1[1]-p2[1]);if(pd)PHC.d=clamp(PHC.d*pd/dd,1.5,30);pd=dd;return}PHC.a-=(e.clientX-o[0])*.008;PHC.p=clamp(PHC.p+(e.clientY-o[1])*.005,-.15,1.35);ptr.set(e.pointerId,[e.clientX,e.clientY])});
 const up=e=>{ptr.delete(e.pointerId);pd=0};u.addEventListener('pointerup',up);u.addEventListener('pointercancel',up);
 u.addEventListener('wheel',e=>{PHC.d=clamp(PHC.d*(e.deltaY>0?1.1:.9),1.5,30);e.preventDefault()},{passive:false});
 u.querySelector('.x').onclick=phPhotoEnd;u.querySelector('.sh').onclick=phSnap;PHC.kd=e=>{if(e.key==='Escape')phPhotoEnd();else if(e.key===' '||e.key==='Enter')phSnap()};addEventListener('keydown',PHC.kd);
 DZ.fn=()=>{const T=GS.onFoot?P:GS,ty=(GS.onFoot?P.y:GS.y)+1.2,cp=Math.cos(PHC.p);DZ.look=new THREE.Vector3(T.x,ty,T.z);return new THREE.Vector3(T.x+Math.sin(PHC.a)*PHC.d*cp,ty+Math.sin(PHC.p)*PHC.d,T.z+Math.cos(PHC.a)*PHC.d*cp)};DZ.fov=55;DZ.tp=DZ.fn();DZ.on=1}
function phSnap(){if(!PHC.on)return;try{R.render(scene,cam);const c=document.createElement('canvas'),src=R.domElement,s=Math.min(1,960/src.width);c.width=Math.round(src.width*s);c.height=Math.round(src.height*s);c.getContext('2d').drawImage(src,0,0,c.width,c.height);PH.photos.unshift(c.toDataURL('image/jpeg',.85));PH.photos.length=Math.min(PH.photos.length,24)}catch(e){toast('COULD NOT TAKE PHOTO');return}
 const f=PHC.ui.querySelector('.fl');f.style.transition='none';f.style.opacity=.9;requestAnimationFrame(()=>{f.style.transition='opacity .35s';f.style.opacity=0});beep(1800,.03,'square',.05);setTimeout(()=>beep(1200,.05,'square',.04),60);toast('PHOTO SAVED TO YOUR PHONE')}
function phPhotoEnd(){if(!PHC.on)return;PHC.on=0;removeEventListener('keydown',PHC.kd);PHC.ui.remove();document.body.classList.remove('photo');DZ.fn=null;DZ.on=0;DZ.exit=1;DZ.fov=46}
/* ---- ticking: cash log, stock news texts, waypoint distance, idle villager texts ---- */
{const u0=updCozy;updCozy=function(dt){u0(dt);
 if(PH.lastCash==null)PH.lastCash=cash;const dc=cash-PH.lastCash;if(Math.abs(dc)>=1){PH.log.unshift({v:dc,d:DAY,h:phClock()});PH.log.length=Math.min(PH.log.length,15);PH.lastCash=cash}
 try{const n=STOCKS.ST.news[0];if(n&&n!==PH.lastNews){if(PH.lastNews)phText('COZY MARKETS',n,true);PH.lastNews=n}}catch(e){czErr(e,"19-phone.js")}
 PH.hrT+=dt;if(PH.hrT>150){PH.hrT=0;if(Math.random()<.35){const t=PHTX[Math.floor(Math.random()*PHTX.length)];phText(t[0],t[1])}}
 if(!PH.seen.w){PH.seen.w=1;phText('MUM',"Hope the new place is cosy! I've put your phone on the 📱 button. Press P on a keyboard. Love you x",true)}
 const w=PH.way;phBeam.visible=!!w&&!GS.inside;if(w){const px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z,d=Math.hypot(w.x-px,w.z-pz);if(d<7&&!GS.inside&&!w.keep){toast('ARRIVED: '+w.n);PH.way=null;phWay()}else{phPill.style.display=GS.inside||menuOpen||PHC.on?'none':'block';phPill.textContent='📍 '+w.n+' · '+Math.round(d)+'m'+(w.keep?'':'   ✕');phBeam.children[1].rotation.y+=dt}}
 if(PHN.ov&&(PH._rt=(PH._rt||0)+dt)>1){PH._rt=0;const t=PHN.ov.querySelector('#phT');if(t)t.textContent=phClock()+'  DAY '+DAY;const m=PHN.ov.querySelector('#phM');if(m)m.textContent=phMoney(cash)}}}
phBadge();
