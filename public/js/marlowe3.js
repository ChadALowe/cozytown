/* ===== MARLOWE CABS: the city taxi career. Start a shift from the phone (CAREERS) while in your car in Marlowe.
   Passengers hail you from the kerb at street addresses and landmarks; the meter runs on the distance you drive;
   they rate you out of 5 stars (bumps, crashes and lateness cost stars and tips). Rush fares and airport runs pay more.
   Uses the careers system in game/20-careers.js (CDEF, CR, SH, crStart/crEnd/crPay, crHud, crDress) and the city in marlowe.js. ===== */
(function(){
const MW=window.MARLOWE,M=MW.M,{OX,OZ,NS,EW,CITY,lanes}=MW,Y=G0,KH=MW.KH;
CDEF.mcab={n:'MARLOWE CAB DRIVER',ic:'🚖',h:[0,24],per:6,unit:'FARES',ranks:['NEW CABBIE','LICENSED CABBIE','KNOWLEDGE MASTER','BLACK CAB VETERAN','CITY LEGEND'],info:''};
Object.defineProperty(CDEF.mcab,'info',{get(){const s=CR.mstar||[],avg=s.length?s.reduce((a,b)=>a+b,0)/s.length:0;return 'Drive a cab around Marlowe, day or night. Find the passenger waving at the kerb, then get them there quickly and smoothly for a tip and 5 stars.'+(s.length?' Your rating: '+avg.toFixed(1)+'★ from '+s.length+' fares.':'')+' Start in Marlowe, in your car.'}});
CR.xp.mcab=CR.xp.mcab||0;CR.done.mcab=CR.done.mcab||0;CR.mstar=CR.mstar||[];
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.mstar=CR.mstar.slice(-60);return o};cozyLoad=function(z){l0(z);if(z&&z.mstar)CR.mstar=z.mstar}}
const inM=()=>{const p=crPos();return M.built&&MW.inReg(p.x,p.z)};
/* job gating: the cab job is city-only, the village jobs stay in the village */
{const c0=crCan;crCan=function(k){if(k==='mcab'){if(SH)return 'FINISH YOUR '+CDEF[SH.k].n+' SHIFT FIRST';if(!inM())return 'FLY TO MARLOWE TO DRIVE A CAB';if(GS.inside)return 'GO OUTSIDE FIRST';if(GS.onFoot)return 'GET IN YOUR CAR FIRST';return ''}
 if(!SH&&inM()&&(k==='taxi'||k==='bus'||k==='pizza'||k==='farm'))return k==='taxi'?'IN MARLOWE, DRIVE FOR MARLOWE CABS INSTEAD':'THAT JOB IS BACK IN THE VILLAGE';return c0(k)}}
/* ------------------------------------------------------------------ places: kerbside addresses and landmarks */
const lane=r=>{const L=lanes(r);return L[L.length-1]};
/* nearest road that actually runs past the point */
function snap(u,v){let best=null,bd=1e9;
 for(const r of NS){if(v<-628||v>1028)continue;const d=Math.abs(u-r.u)-r.h;if(d<bd){bd=d;best=r}}
 for(const r of EW){const east=u>NS[5].u&&u<NS[0].u,west=u<NS[6].u&&u>NS[11].u,br=MW.BRIDGE.has(r.j)&&u<=NS[5].u&&u>=NS[6].u;if(!east&&!west&&!br)continue;const d=Math.abs(v-r.v)-r.h;if(d<bd){bd=d;best=r}}
 if(!best)return null;const r=best,sg=r.ax===0?Math.sign(u-r.u)||1:Math.sign(v-r.v)||1;
 return r.ax===0?{r,cu:r.u+sg*lane(r),cv:v,pu:r.u+sg*(r.h+1.3),pv:v}:{r,cu:u,cv:r.v+sg*lane(r),pu:u,pv:r.v+sg*(r.h+1.3)}}
const W2=(u,v)=>[OX+u,OZ+v];
function streetSpot(){const b=MW.BLK[(Math.random()*MW.BLK.length)|0];const sides=[['s',b.ss,0,-1,b.u0,b.u1,b.v0],['n',b.sn,0,1,b.u0,b.u1,b.v1],['w',b.sw,-1,0,b.v0,b.v1,b.u0],['e',b.se,1,0,b.v0,b.v1,b.u1]];
 const[k,r,nu,nv,a0,a1,e]=sides[(Math.random()*4)|0];if(a1-a0<30)return null;const s=a0+12+Math.random()*(a1-a0-24),al=k==='s'||k==='n';
 const pu=al?s:e-nu*1.3,pv=al?e-nv*1.3:s,cu=al?s:r.u-nu*lane(r),cv=al?r.v-nv*lane(r):s;
 const n=2*Math.floor(Math.abs(s+(al?1300:700))/9)+(k==='n'||k==='e'?1:2);return{name:n+' '+r.n,pu,pv,cu,cv,r}}
function landmark(q){const s=snap(q.u,q.v);if(!s)return null;s.name=q.n;return s}
const POIS=()=>CITY.poi.filter(p=>!p.metro);
function pickSpot(minD,maxD,from,opts){const f=from||crPos();for(let t=0;t<120;t++){let s=null;
  if(opts&&opts.airport){const a=POIS().find(p=>p.n==='MARLOWE AIRPORT');s=a&&landmark(a)}
  else if(Math.random()<.38){const ps=POIS();s=landmark(ps[(Math.random()*ps.length)|0])}else s=streetSpot();
  if(!s)continue;if(MW.mh(s.cu,s.cv)!==Y||MW.mh(s.pu,s.pv)<=Y)continue;const p=W2(s.cu,s.cv),d=Math.hypot(p[0]-f.x,p[1]-f.z);if(!(opts&&opts.airport)&&(d<minD||d>maxD))continue;s.x=p[0];s.z=p[1];return s}return null}
/* ------------------------------------------------------------------ passengers */
const NAMES=['MS OKONJO','MR FAIRBAIRN','DR SINGH','LUCY','TOMASZ','MRS AKHTAR','JAMIE','PROFESSOR GREY','BELLA','MR O\'NEILL','AIKO','GRANDPA FRED','SOPHIE','RAJ','MRS DELACROIX','BEN','CHLOE','MR ADEYEMI'];
const SAY_IN=['"{D}, please!"','"Could you take me to {D}?"','"{D}, and step on it!"','"Evening! {D}, cheers."','"Morning! {D}, please."','"I need to get to {D}."','"Do you know {D}? Take me there!"'];
const SAY_RUSH=['"{D}! I\'m late, please hurry!"','"{D}, quick as you can, my meeting starts soon!"','"Hurry! {D} before it\'s too late!"'];
const SAY_OK=['"Lovely driving, thank you!"','"Brilliant, keep the change!"','"Smooth as silk. Five stars!"','"Cheers, driver!"'],SAY_MEH=['"We got there in the end."','"Bit of a bumpy one..."','"Hmm. Thanks, I suppose."'],SAY_BAD=['"Never again!"','"My coffee went everywhere!"','"I\'ll walk next time."'];
const pk=a=>a[(Math.random()*a.length)|0];
function person(u,v,face){const g=mkPerson(pSpec(Math.floor(Math.random()*9000)+300),mObj,scene);const p=W2(u,v);g.position.set(p[0],mhAt(u,v),p[1]);g.rotation.y=face||0;g.scale.setScalar(.96);return g}
const mhAt=(u,v)=>{const h=MW.mh(u,v);return h<0?Y:h};
function drop(g){if(!g)return;scene.remove(g);g.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
const WALKERS=[];/* passengers walking to / from the cab */
function walkTo(g,x,z,secs,done){WALKERS.push({g,x0:g.position.x,z0:g.position.z,x,z,t:0,T:secs,done})}
/* ------------------------------------------------------------------ the shift */
let F=null;/* the current fare */
function newFare(first){const near=first&&CITY.poi.filter(p=>p.taxi).map(landmark).find(s=>{if(!s)return false;const p=W2(s.cu,s.cv),c=crPos();return Math.hypot(p[0]-c.x,p[1]-c.z)<40});
 const a=near?Object.assign(near,{x:W2(near.cu,near.cv)[0],z:W2(near.cu,near.cv)[1]}):pickSpot(110,480);if(!a){toast('NO FARES RIGHT NOW');return}
 const face=Math.atan2(a.cu-a.pu,a.cv-a.pv);F={st:'pick',a,who:pk(NAMES),g:person(a.pu,a.pv,face),wave:0,t:0};crWay(a.x,a.z,'PICK UP '+F.who);
 SH.st='pick';if(near)toast('THERE\'S A FARE WAITING AT THE RANK!')}
function startRide(){const a=F.a;const air=Math.random()<.14&&a.name!=='MARLOWE AIRPORT'&&Math.hypot(a.x-W2(-222,-205)[0],a.z-W2(-222,-205)[1])>450;const rush=!air&&Math.random()<.25;
 const b=pickSpot(rush?220:260,rush?650:950,{x:a.x,z:a.z},air?{airport:1}:null);if(!b){F=null;newFare();return}
 const d=Math.hypot(b.x-a.x,b.z-a.z);Object.assign(F,{st:'ride',b,rush,air,dist:0,straight:d,tmax:Math.round(rush?d/11+14:d/7.5+28),t:0,stars:5,bumps:0,lastBump:-9,lx:GS.x,lz:GS.z,ps:GS.speed});
 const line=(rush?pk(SAY_RUSH):pk(SAY_IN)).replace('{D}',air?'MARLOWE AIRPORT':b.name);toast(F.who+': '+line);crWay(b.x,b.z,'DROP OFF: '+b.name);SH.st='ride';beep(660,.06,'square',.04)}
function meter(){return 3.5+F.dist*.012+(F.air?18:0)}
function finishRide(){const left=F.tmax-F.t;if(left<0)F.stars-=F.rush?2:1;F.stars=Math.max(1,Math.min(5,F.stars));
 const fare=meter(),tip=left>0?Math.round((2+left*.14)*(F.rush?2:1)*F.stars/5):0;const paid=crPay('mcab',fare+tip,(F.rush&&left>0?'RUSH FARE':F.air?'AIRPORT RUN':'FARE')+(tip?' + TIP':''));
 CR.mstar.push(F.stars);if(window.REP)REP.add('tourist',F.stars>=5?1:F.stars<=2?-1:0);if(CR.mstar.length>60)CR.mstar.shift();SH.n++;
 const say=F.stars>=4?pk(SAY_OK):F.stars>=3?pk(SAY_MEH):pk(SAY_BAD),who=F.who,stars=F.stars;setTimeout(()=>toast(who+' '+'★'.repeat(stars)+'☆'.repeat(5-stars)+' '+say),1600);
 /* the passenger steps out onto the pavement and walks off */
 const b=F.b,fx=Math.sin(GS.psi),fz=Math.cos(GS.psi),g=person(0,0,0);g.position.set(GS.x-fz*1.2,Y,GS.z+fx*1.2);const p=W2(b.pu,b.pv);walkTo(g,p[0],p[1],1.6,()=>{g.position.y=Y+KH;const q=[p[0]+(p[0]-GS.x)*.6,p[1]+(p[1]-GS.z)*.6];walkTo(g,q[0],q[1],2.6,()=>drop(g))});
 F=null;if(SH.n>=CDEF.mcab.per)return crEnd(true);setTimeout(()=>{if(SH&&SH.k==='mcab'&&!F)newFare()},2200);SH.st='free'}
{const s0=crStart;crStart=function(k){if(k!=='mcab')return s0(k);const why=crCan(k);if(why){toast(why);return false}SH={k,n:0,t:0,st:'free',stage:0};crDress('taxi');toast('🚖 MARLOWE CABS · '+CDEF.mcab.ranks[crLvl('mcab')]+' · YOUR LIGHT IS ON');newFare(true);return true}}
{const e0=crEnd;crEnd=function(done){if(SH&&SH.k==='mcab'&&F){drop(F.g);F=null}e0(done)}}
/* ------------------------------------------------------------------ tick */
{const u0=updCozy;updCozy=function(dt){u0(dt);
 for(let i=WALKERS.length-1;i>=0;i--){const w=WALKERS[i];w.t+=dt;const f=Math.min(1,w.t/w.T),g=w.g;g.position.x=w.x0+(w.x-w.x0)*f;g.position.z=w.z0+(w.z-w.z0)*f;g.rotation.y=Math.atan2(w.x-w.x0,w.z-w.z0);const s=Math.sin(w.t*8)*.5;if(g.l1){g.l1.rotation.x=s;g.l2.rotation.x=-s;g.a1.rotation.x=-s*.7;g.a2.rotation.x=s*.7}if(f>=1){WALKERS.splice(i,1);w.done&&w.done()}}
 if(!SH||SH.k!=='mcab')return;const d=CDEF.mcab;
 if(!inM()&&!AIRPORT.CIN.on){toast('YOU LEFT MARLOWE · CAB SHIFT ENDED');return crEnd(false)}
 let line='FOR HIRE · LOOKING FOR A FARE...';
 if(F&&F.st==='pick'){const a=F.a,dd=Math.hypot(a.x-crPos().x,a.z-crPos().z);F.wave+=dt;if(F.g.a1){F.g.a1.rotation.x=-2.7+Math.sin(F.wave*6)*.25;F.g.a1.rotation.z=.2}
  line='PICK UP '+F.who+' · '+a.name+' · '+(dd>1000?(dd/1000).toFixed(1)+'KM':Math.round(dd)+'M');
  if(crStopped(a.x,a.z,7.5)){F.st='board';const g=F.g;F.g=null;if(g.a1)g.a1.rotation.x=0;const fx=Math.sin(GS.psi),fz=Math.cos(GS.psi);walkTo(g,GS.x-fz*1.3,GS.z+fx*1.3,1.1,()=>{drop(g);if(F&&F.st==='board')startRide()});line=F.who+' IS GETTING IN...'}}
 else if(F&&F.st==='board')line=F.who+' IS GETTING IN...';
 else if(F&&F.st==='ride'){F.t+=dt;const step_=Math.hypot(GS.x-F.lx,GS.z-F.lz);if(step_<20)F.dist+=step_;F.lx=GS.x;F.lz=GS.z;
  /* a sudden stop is a crash: passengers don't like that */const sp=GS.speed;if(F.ps-sp>5.5&&F.t-F.lastBump>2){F.bumps++;F.lastBump=F.t;F.stars-=1;toast(F.who+': '+pk(['"Ouch! Careful!"','"Watch where you\'re going!"','"Steady on!"','"My neck!"']))}F.ps=sp;
  const left=F.tmax-F.t,st=Math.max(1,F.stars-(left<0?(F.rush?2:1):0));line=(F.air?'✈ ':F.rush?'⚡ RUSH · ':'')+'→ '+F.b.name+' · '+(left>0?fmtT(left):'LATE')+'\nMETER £'+meter().toFixed(2)+' · '+'★'.repeat(st)+'☆'.repeat(5-st);
  if(crStopped(F.b.x,F.b.z,7.5))finishRide()}
 crHud.style.display=menuOpen||GS.inside?'none':'block';crHud.style.whiteSpace='pre-line';crHud.textContent=d.ic+' '+d.ranks[crLvl('mcab')]+' · '+SH.n+'/'+d.per+' '+d.unit+'\n'+line}}
/* minimap markers */
window.MARLOWE3={mm(mc,T,k){if(!SH||SH.k!=='mcab'||!F)return;const tg=F.st==='ride'?F.b:F.a;if(!tg)return;let gx=(tg.x-T.x)*k+MMS/2,gz=-(tg.z-T.z)*k+MMS/2;const off=gx<4||gx>MMS-4||gz<4||gz>MMS-17;gx=Math.max(4,Math.min(MMS-4,gx));gz=Math.max(4,Math.min(MMS-17,gz));
 mc.fillStyle=F.st==='ride'?'#3ad07a':'#ffd24a';mc.strokeStyle='#000';mc.lineWidth=1.5;mc.beginPath();mc.arc(gx,gz,off?3:4.5,0,6.3);mc.fill();mc.stroke()},get F(){return F},newFare,pickSpot,snap};
})();
