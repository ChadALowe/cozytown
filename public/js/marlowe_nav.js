/* ===== MARLOWE: sat-nav, reputation, fleeing-car AI and the MARLOWE POLICE career.
   Loaded after marlowe5.js and before marlowe6.js (the Family uses REP and RUNNER from here).
   · SATNAV: shortest road route to the phone waypoint (Dijkstra over the street grid), drawn on the minimap and the city map.
   · REP: four reputations (POLICE, THE FAMILY, THE SERPENTS, TOURIST BOARD) 0-100, phone app, small effects on pay, prices and access.
   · RUNNER: a car that drives the streets on its own (lane-following, turns at junctions), used for police chases and the story.
   · POLICE: join at MARLOWE POLICE STATION (King's Avenue); patrol calls and suspect chases in a liveried patrol car. ===== */
(function(){
const MW=window.MARLOWE,M=MW.M,{OX,OZ,NS,EW,NODE,CITY,KH,nsEdge,ewEdge,lanes}=MW,Y=G0,W=(u,v)=>[OX+u,OZ+v];
const inM=()=>{const p=GS.onFoot?P:GS;return M.built&&!GS.inside&&MW.inReg(p.x,p.z)};
/* ------------------------------------------------------------------ SAT-NAV */
const NL=[];for(let i=0;i<12;i++)for(let j=0;j<16;j++)NL.push(NODE[i][j]);
const nb=n=>{const o=[],i=n.i,j=n.j;if(nsEdge(i,j))o.push(NODE[i][j+1]);if(nsEdge(i,j-1))o.push(NODE[i][j-1]);if(ewEdge(j,i))o.push(NODE[i+1][j]);if(ewEdge(j,i-1))o.push(NODE[i-1][j]);return o};
const bank=u=>u>-730?0:1;
function nearNode(u,v){let b=null,bd=1e9;const bk=bank(u),onBr=u<-685&&u>-775;for(const n of NL){let d=Math.hypot(n.u-u,n.v-v);if(!onBr&&bank(n.u)!==bk)d+=400;if(d<bd){bd=d;b=n}}return b}
function route(u0,v0,u1,v1){const a=nearNode(u0,v0),b=nearNode(u1,v1);if(!a||!b)return null;const D=new Map(),Pv=new Map(),done=new Set();D.set(a,0);
 while(true){let c=null,cd=1e9;for(const[n,d]of D)if(!done.has(n)&&d<cd){cd=d;c=n}if(!c||c===b)break;done.add(c);for(const m of nb(c)){const nd=cd+Math.hypot(m.u-c.u,m.v-c.v);if(nd<(D.get(m)??1e9)){D.set(m,nd);Pv.set(m,c)}}}
 const path=[];let c=b;while(c){path.unshift([c.u,c.v]);if(c===a)break;c=Pv.get(c)}if(path[0][0]!==a.u||path[0][1]!==a.v)return null;
 /* trim the first node if we're already past it along the same road */if(path.length>1){const[p0,p1]=path;const dx=p1[0]-p0[0],dz=p1[1]-p0[1],t=((u0-p0[0])*dx+(v0-p0[1])*dz)/(dx*dx+dz*dz||1);if(t>0&&t<1&&Math.abs((u0-p0[0])*dz-(v0-p0[1])*dx)/Math.hypot(dx,dz)<16)path.shift()}
 return[[u0,v0],...path,[u1,v1]]}
const NAV={pts:null,t:0,key:''};
function navTick(dt){NAV.t-=dt;if(NAV.t>0)return;NAV.t=.8;const w=PH.way,p=GS.onFoot?P:GS;if(!w||!inM()||!MW.inReg(w.x,w.z)){NAV.pts=null;return}NAV.pts=route(p.x-OX,p.z-OZ,w.x-OX,w.z-OZ)}
function navMini(mc,T,k){if(!NAV.pts)return;const L=NAV.pts.map(([u,v])=>[(OX+u-T.x)*k+MMS/2,-(OZ+v-T.z)*k+MMS/2]);mc.lineCap='round';mc.lineJoin='round';
 for(const[c,wd]of[['#0a2a40',5.5],['#3ae0ff',3]]){mc.strokeStyle=c;mc.lineWidth=wd;mc.beginPath();L.forEach((q,i)=>i?mc.lineTo(q[0],q[1]):mc.moveTo(q[0],q[1]));mc.stroke()}}
window.SATNAV={route,get pts(){return NAV.pts},drawFull(g,toS){if(!NAV.pts)return;g.lineCap='round';g.lineJoin='round';for(const[c,wd]of[['#0a2a40',8],['#3ae0ff',4.5]]){g.strokeStyle=c;g.lineWidth=wd;g.beginPath();NAV.pts.forEach(([u,v],i)=>{const s=toS(u,v);i?g.lineTo(s[0],s[1]):g.moveTo(s[0],s[1])});g.stroke()}}};
{const w=window.MARLOWE3,m0=w.mm;w.mm=function(mc,T,k){navMini(mc,T,k);m0(mc,T,k)}}
/* ------------------------------------------------------------------ REPUTATION */
const R={police:50,family:50,serpents:50,tourist:50};const RN={police:['MARLOWE POLICE','👮'],family:['THE FAMILY','🎩'],serpents:['THE SERPENTS','🐍'],tourist:['TOURIST BOARD','🗺']};
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.rep=R;return o};cozyLoad=function(z){l0(z);if(z&&z.rep)Object.assign(R,z.rep)}}
let repMsg=[],repT=0;
const REP=window.REP={R,get:k=>R[k],add(k,d){if(!d)return;R[k]=Math.max(0,Math.min(100,R[k]+d));repMsg.push((d>0?'▲ ':'▼ ')+RN[k][0]+' '+(d>0?'+':'')+d)},
 mult:k=>1+(R[k]-50)/250,word:v=>v>=85?'ADORED':v>=70?'RESPECTED':v>=55?'LIKED':v>=40?'NEUTRAL':v>=25?'WARY':v>=10?'DISLIKED':'HATED',
 disc:()=>R.tourist>=75?.9:1};
const repPill=(()=>{const e=document.createElement('div');e.style.cssText='position:fixed;right:12px;top:150px;z-index:26;background:rgba(40,20,60,.85);border:2px solid #c890ff;border-radius:10px;color:#fff;font:bold 11px ui-monospace,monospace;padding:4px 9px;display:none;pointer-events:none;white-space:pre-line;text-align:right';document.body.appendChild(e);return e})();
PHX.push({k:'rep',ic:'⭐',n:'REPUTATION',bg:'#5a2a7a',render({el}){el('div','phH','REPUTATION');el('small',null,'HOW MARLOWE SEES YOU').style.marginBottom='8px';
 for(const k of Object.keys(R)){const r=el('div','phR');const t=el('div','phK',null,r);el('span',null,RN[k][1]+' '+RN[k][0],t);const s=el('small',null,REP.word(R[k])+' · '+Math.round(R[k]),t);s.style.color=R[k]>=55?'#9fe89f':R[k]<40?'#ff9a8a':'#ffd24a';
  const bar=el('div',null,null,r);bar.style.cssText='height:7px;background:#2a3248;border-radius:4px;margin-top:5px;overflow:hidden';const fl=el('div',null,null,bar);fl.style.cssText='height:100%;width:'+R[k]+'%;background:'+(k==='serpents'?'#40c040':k==='family'?'#d0a040':k==='police'?'#3a7aff':'#c890ff');
  el('small',null,{police:'Rises with police work. Falls with Family jobs and getting busted. Below 25 the police won\'t hire you.',family:'Rises with jobs for Don Vittorio (better pay). Below 15 the Don won\'t take your calls.',serpents:'The rival gang. Every turf war you win makes them hate you more.',tourist:'Rises with 5-star cab rides, busking, hotel stays and Passport stamps. At 75+ you get 10% off food and hotels.'}[k],r)}}});
/* ------------------------------------------------------------------ RUNNER: a car that drives itself round the streets */
const road=(ax,k)=>ax?EW[k]:NS[k],nodeC=(ax,idx)=>ax?NS[idx].u:EW[idx].v;
function nextIdx(ax,s,d){if(ax===0){if(d>0){for(let j=0;j<16;j++)if(EW[j].v>s+.01)return j;return -1}for(let j=15;j>=0;j--)if(EW[j].v<s-.01)return j;return -1}if(d>0){for(let i=11;i>=0;i--)if(NS[i].u>s+.01)return i;return -1}for(let i=0;i<12;i++)if(NS[i].u<s-.01)return i;return -1}
function goes(ax,k,idx,d){if(ax===0)return d>0?nsEdge(k,idx):nsEdge(k,idx-1);return d>0?ewEdge(k,idx-1):ewEdge(k,idx)}
function lanePos(ax,k,d,ln,s){const r=road(ax,k),L=lanes(r),off=L[Math.min(ln,L.length-1)];return ax===0?[r.u+d*off,s]:[s,r.v-d*off]}
function carMesh(body,trim,extra){const B=new Builder(3),gl=[.12,.16,.22],dk=[.04,.04,.05],E=(x,y,z,w,h,d,c)=>pbox(B,x,y,z,w,h,d,c,0);
 E(0,.26,0,1.82,.58,4.4,body);E(0,.82,-.3,1.62,.48,2.2,gl);E(0,1.28,-.3,1.56,.08,2.0,body);E(0,.86,.84,1.56,.42,.08,gl);for(const sx of[-1,1]){for(const z of[1.4,-1.4])E(sx*.82,0,z,.26,.6,.62,dk);E(sx*.6,.48,2.21,.34,.16,.05,[1,1,.85]);E(sx*.65,.48,-2.21,.3,.16,.05,[.9,.08,.08])}
 if(trim)for(const sx of[-1,1])E(sx*.915,.42,0,.03,.12,4.2,trim);if(extra)extra(E);const g=new THREE.Group();g.add(B.mesh(mObj));return g}
class Runner{constructor(o){Object.assign(this,{sp:8,vmax:o.vmax||21,turnV:9,on:1,tn:null},o);this.g=o.mesh||carMesh(o.col||[.75,.1,.1]);scene.add(this.g);this.place(o.near,o.rmin||90,o.rmax||180)}
 place(near,rmin,rmax){for(let t=0;t<200;t++){const ax=Math.random()<.5?0:1,k=ax?(Math.random()*16)|0:(Math.random()*12)|0,r=road(ax,k),s=ax===0?-620+Math.random()*1640:-1220+Math.random()*1000,d=Math.random()<.5?1:-1,lp=lanePos(ax,k,d,0,s);
  if(MW.mh(lp[0],lp[1])!==Y)continue;const x=OX+lp[0],z=OZ+lp[1],dist=Math.hypot(x-near.x,z-near.z);if(dist<rmin||dist>rmax)continue;const idx=nextIdx(ax,s,d),prev=nextIdx(ax,s,-d);if(idx<0||prev<0||!goes(ax,k,prev,d))continue;
  Object.assign(this,{ax,k,d,s,ln:0});this.plan();this.pos();return}this.on=0}
 plan(){const idx=nextIdx(this.ax,this.s,this.d);this.ni=idx;this.pl=null;if(idx<0)return;const opts=[],ax2=1-this.ax;if(goes(this.ax,this.k,idx,this.d))opts.push({w:.5,t:'s'});const eL=this.ax===0?this.d:-this.d;for(const e of[eL,-eL])if(goes(ax2,idx,this.k,e))opts.push({w:.25,t:'t',e});
  if(!opts.length){this.pl={t:'u'};return}let r=Math.random()*opts.reduce((a,o)=>a+o.w,0);for(const o of opts){r-=o.w;if(r<=0){this.pl=o;return}}this.pl=opts[0]}
 pos(){if(this.tn){const T=this.tn,t=T.t,q=1-t;const u=q*q*T.P0[0]+2*q*t*T.P1[0]+t*t*T.P2[0],v=q*q*T.P0[1]+2*q*t*T.P1[1]+t*t*T.P2[1],du=2*q*(T.P1[0]-T.P0[0])+2*t*(T.P2[0]-T.P1[0]),dv=2*q*(T.P1[1]-T.P0[1])+2*t*(T.P2[1]-T.P1[1]);this.x=OX+u;this.z=OZ+v;this.psi=Math.atan2(du,dv)}
  else{const p=lanePos(this.ax,this.k,this.d,this.ln,this.s);this.x=OX+p[0];this.z=OZ+p[1];this.psi=this.ax===0?(this.d>0?0:Math.PI):(this.d>0?Math.PI/2:-Math.PI/2)}this.g.position.set(this.x,Y+.02,this.z);this.g.rotation.y=this.psi}
 step(dt,target){if(!this.on)return;if(this.stopped){this.sp=Math.max(0,this.sp-12*dt);if(this.tn){this.tn.t=Math.min(1,this.tn.t+this.sp*dt/this.tn.len)}else this.s+=this.d*this.sp*dt;this.pos();return}
  const near=target?Math.hypot(target.x-this.x,target.z-this.z):999,vm=this.vmax+(near<60?4:0)*(this.flee?1:0);
  if(this.tn){this.tn.t+=this.sp*dt/this.tn.len;this.sp+=Math.max(-12*dt,Math.min(4*dt,this.turnV-this.sp));if(this.tn.t>=1){const T=this.tn;Object.assign(this,{ax:T.ax,k:T.k,d:T.d,s:T.s,ln:0,tn:null});this.plan()}this.pos();return}
  if(this.ni<0){this.d=-this.d;this.plan()}const nc=nodeC(this.ax,this.ni),cr=road(1-this.ax,this.ni),toN=(nc-this.s)*this.d,turnAt=cr.h+1.2;let vt=vm;if(this.pl&&this.pl.t!=='s')vt=Math.min(vt,this.turnV+Math.max(0,toN-turnAt)*.45);
  this.sp+=Math.max(-12*dt,Math.min(5*dt,vt-this.sp));this.s+=this.d*this.sp*dt;
  if(toN<=turnAt){const pl=this.pl||{t:'s'};if(pl.t==='s'){this.s=nc+this.d*(cr.h+1.3);this.plan();this.pos();return}
   const r=road(this.ax,this.k),ax2=1-this.ax,k2=this.ni,e=pl.t==='u'?-this.d:pl.e,s2=nodeC(ax2,this.k)+e*(r.h+1.2);const P0=lanePos(this.ax,this.k,this.d,0,this.s),P2=lanePos(ax2,k2,e,0,s2),P1=this.ax===0?[P0[0],P2[1]]:[P2[0],P0[1]];
   this.tn={P0,P1,P2,t:0,len:Math.max(4,(Math.hypot(P1[0]-P0[0],P1[1]-P0[1])+Math.hypot(P2[0]-P1[0],P2[1]-P1[1]))*.9),ax:ax2,k:k2,d:e,s:s2}}this.pos()}
 remove(){this.on=0;scene.remove(this.g)}}
window.RUNNER=Runner;window.MCARMESH=carMesh;
/* bump the player's car when a runner touches it */
window.RUNBUMP=(r)=>{if(GS.onFoot)return;const d=Math.hypot(GS.x-r.x,GS.z-r.z);if(d<2.4&&d>1e-3){const k=(2.4-d)/2.4;GS.vx+=(GS.x-r.x)/d*k*2.5;GS.vz+=(GS.z-r.z)/d*k*2.5}};
/* ------------------------------------------------------------------ MARLOWE POLICE */
const POL={joined:0,calls:0,arrests:0,pend:0};
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.pol=POL;return o};cozyLoad=function(z){l0(z);if(z&&z.pol)Object.assign(POL,z.pol,{pend:0})}}
CDEF.police={n:'POLICE OFFICER',ic:'👮',h:[0,24],per:4,unit:'CALLS',ranks:['PROBATIONER','CONSTABLE','SERGEANT','INSPECTOR','CHIEF INSPECTOR'],info:''};
Object.defineProperty(CDEF.police,'info',{get(){return POL.joined?'Answer 999 calls around Marlowe in a patrol car: disturbances and suspect chases. Arrests so far: '+POL.arrests+'.':'Join at MARLOWE POLICE STATION on King\'s Avenue. Needs a clean-ish record (police reputation 25+).'}});
CR.xp.police=CR.xp.police||0;CR.done.police=CR.done.police||0;
{const c0=crCan;crCan=function(k){if(k!=='police')return c0(k);if(!POL.joined)return 'JOIN AT MARLOWE POLICE STATION, KING\'S AVENUE';if(R.police<25)return 'SUSPENDED: YOUR POLICE REPUTATION IS TOO LOW';if(SH)return 'FINISH YOUR '+CDEF[SH.k].n+' SHIFT FIRST';if(!inM())return 'MARLOWE POLICE ONLY WORK IN MARLOWE';if(GS.inside)return 'GO OUTSIDE FIRST';if(GS.onFoot)return 'GET IN YOUR CAR FIRST';return ''}}
/* the station */
const sb=MW.BLK.find(b=>b.c===1&&b.r===6),pw=r=>r.w>=20?6:4.5,sfu=sb.u0+pw(sb.sw),sfv=(sb.v0+pw(sb.ss)+sb.v1-pw(sb.sn))/2;
const ST={x:OX+sfu-1.4,z:OZ+sfv,psi:-Math.PI/2,t:'MARLOWE POLICE STATION',bg:'#0a2a6a',fg:'#ffffff',pol:1,rx:6,rz:4.6,sz:3.7};SHOPD.push(ST);HRS[ST.t]=[0,24];CITY.poi.push({n:ST.t,u:sfu-1.4,v:sfv,ic:'👮'});
{const sl0=shopLabel;shopLabel=function(o){return o&&o.pol?'ENTER '+o.t:sl0(o)}}
CUSTOM_SHOP.poldesk=function(msg){$('shT').textContent='👮 FRONT DESK';
 if(!POL.joined){$('shMsg').textContent=msg||'"Thinking of joining up? We\'re short of drivers who know the streets. Your record: '+REP.word(R.police)+'."';
  dRow('JOIN MARLOWE POLICE',[['SIGN UP',()=>{if(R.police<25)return renderShop('"With a record like yours? I don\'t think so." (POLICE REP '+Math.round(R.police)+', NEED 25)');POL.joined=1;REP.add('police',5);REP.add('family',-5);renderShop('"Welcome to the force, Probationer! Ask me for a shift any time, or use your phone."')}]])}
 else{$('shMsg').textContent=msg||'"'+CDEF.police.ranks[crLvl('police')]+'. Calls answered '+POL.calls+', arrests '+POL.arrests+'."';
  if(SH&&SH.k==='police')dRow('YOU ARE ON SHIFT',[['END SHIFT',()=>{crEnd(false);renderShop('"Get some rest."')}]]);else dRow('START A PATROL SHIFT',[['ON DUTY',()=>{if(SH)return renderShop('FINISH YOUR '+CDEF[SH.k].n+' SHIFT FIRST');POL.pend=1;closeShop();say('DESK SERGEANT','"Your patrol car will be waiting. Get in your car and we\'ll fit the lights."',3400)}]])}
 dRow('READ THE NOTICE BOARD',[['READ',()=>renderShop(pk(['WANTED: "VIPER", LEADER OF THE SERPENTS GANG.','REWARD FOR INFORMATION ON OLIVE OIL SMUGGLING ON SOUTH QUAY.','LOST: ONE PIGEON, ANSWERS TO "GERALD".','STREET RACING UNDER THE AIRPORT WAY BRIDGE MUST STOP.']))]]);dRow('',[['BACK',()=>closeShop()]])};
const pk=a=>a[(Math.random()*a.length)|0];
{const b0=buildShop;buildShop=function(o){if(!o||!o.pol)return b0(o);while(SG.children.length)SG.remove(SG.children[0]);RX=o.rx;RZ=o.rz;SHK=null;const Hh=IH+.9,B=(x,y,z,w,h,d,hex)=>sbox(x,y,z,w,h,d,fmc(hex));
 SG.add(new THREE.Mesh(new THREE.PlaneGeometry(2*RX,2*RZ).rotateX(-Math.PI/2),imat(FLR.tile())));const wm=tx=>{const m=imat(tx);m.color.setHex(0xdfe6ee);return m};
 splane(2*RX,Hh,0,Hh/2,-RZ,0,wm(sWl));splane(2*RX,Hh,0,Hh/2,RZ,Math.PI,wm(sWl));splane(2*RZ,Hh,RX,Hh/2,0,-Math.PI/2,wm(sWl2));splane(2*RZ,Hh,-RX,Hh/2,0,Math.PI/2,wm(sWl2));
 const vd=new THREE.Mesh(new THREE.BoxGeometry(90,70,90),new THREE.MeshBasicMaterial({color:0x080a12,side:THREE.BackSide,fog:false}));vd.position.y=Hh/2;SG.add(vd);splane(1.1,2.2,0,1.1,RZ-.02,Math.PI,imat(T_FDOOR));
 IROOM.splice(0,IROOM.length,[-RX-1,RX+1,-RZ-1,-RZ+.25],[-RX-1,-RX+.25,-RZ,RZ],[RX-.25,RX+1,-RZ,RZ]);IA.splice(0,IA.length);
 B(0,0,-RZ+1.6,4.4,1.05,.7,0x0a2a6a);B(0,1.05,-RZ+1.6,4.5,.06,.8,0xe8e8e8);B(1.4,1.11,-RZ+1.6,.4,.3,.3,0x202228);IROOM.push([-2.3,2.3,-RZ,-RZ+2]);
 personIn(pSpec(3131,{f:false,hs:2,hc:[.05,.08,.2],ts:3,tc:[.06,.1,.28],bc:[.06,.08,.18],gl:false,scarf:null,bp:false,bag:0,old:false}),0,-RZ+.9,0);
 sPlane(4.6,.8,0,2.6,-RZ+.03,0,txtTex(512,90,'#0a2a6a','#ffffff','MARLOWE POLICE',50));
 sPlane(1.6,1.2,-RX+.03,1.7,-1,Math.PI/2,txtTex(256,192,'#e8dcc0','#202020','WANTED: VIPER',28));sPlane(1.4,1,-RX+.03,1.6,1.2,Math.PI/2,txtTex(256,180,'#f4f4f0','#c81e1e','STOP STREET RACING',22));
 for(const[x,z]of[[-3,2],[3,2]]){B(x,0,z,1.8,.45,.6,0x2a3a5a);B(x,.45,z-.25,1.8,.5,.12,0x2a3a5a);IROOM.push([x-.9,x+.9,z-.3,z+.3])}
 SHOPCUR={o,k:['DESK SERGEANT','"Evening. What can we do for you?"']};
 IA.push({r:[-2.2,2.2,-RZ+2,-RZ+3],label:()=>POL.joined?(SH&&SH.k==='police'?'FRONT DESK (ON DUTY)':'FRONT DESK: START A SHIFT'):'FRONT DESK: JOIN THE POLICE',fn:()=>openShop('poldesk')},{r:[-1,1,RZ-.35,RZ],label:'LEAVE',fn:()=>leaveShop()})}}
let decor=0;function dressStation(){decor=1;const g=new THREE.Group(),y0=Y+KH,fx=OX+sfu-.06,fz=OZ+sfv,mk=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({color:c}));m.position.set(x,y,z);g.add(m);return m};
 mk(.12,2.6,1.8,0xd8d0c0,fx,y0+1.3,fz);mk(.16,2.4,1.5,0x0a2a6a,fx,y0+1.2,fz);mk(.1,.5,.5,0x1d56ff,fx-.3,y0+3.0,fz-1.2);mk(.1,.5,.5,0x1d56ff,fx-.3,y0+3.0,fz+1.2);
 const s=new THREE.Mesh(new THREE.PlaneGeometry(4.4,.8),new THREE.MeshBasicMaterial({map:txtTex(512,96,'#0a2a6a','#ffffff','POLICE',60)}));s.position.set(fx-.06,y0+3.6,fz);s.rotation.y=-Math.PI/2;g.add(s);
 window.AIRPORT.chunk(M,g)}
/* the patrol car: hide your car's body and fit a liveried one with a light bar */
function policeDress(){if(!SH)return;crUndress&&crUndress();SH.hid=[];for(const c of car.children){if(c.userData.cr)continue;if(c.visible){SH.hid.push(c);c.visible=false}}
 const bl=[.08,.22,.72],yl=[.98,.84,.08];const g=carMesh([.97,.97,.98],null,E=>{for(const sx of[-1,1])for(let k=0;k<7;k++){E(sx*.915,.34,-1.95+k*.62,.03,.32,.6,k%2?bl:yl);E(sx*.915,.66,-1.95+k*.62,.03,.14,.6,k%2?yl:bl)}E(0,1.36,-.3,1.1,.12,.3,[.15,.15,.15])});g.userData.cr=1;
 const L=[0,1].map(i=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.48,.16,.32),new THREE.MeshBasicMaterial({color:0x2a6aff,fog:false}));m.position.set(i?.3:-.3,1.52,-.3);g.add(m);return m});g.userData.L=L;car.add(g);SH.dress=g}
const SHT={};/* shift state */
function newCall(){const ch=Math.random()<.55;if(SHT.run){SHT.run.remove();SHT.run=null}
 if(ch){const p=crPos();SHT.run=new Runner({near:p,rmin:120,rmax:220,col:pk([[.75,.08,.08],[.1,.1,.12],[.9,.75,.15],[.2,.5,.25]]),vmax:20+crLvl('police')*.8,flee:1});if(!SHT.run.on){SHT.run=null;return newCall()}
  SHT.st='chase';SHT.catchT=0;SHT.lostT=0;SHT.t=0;const why=pk(['A STOLEN CAR','A CAR THAT DROVE OFF FROM A PETROL STATION WITHOUT PAYING','A SERPENTS GETAWAY CAR','A SPEEDING DRIVER','A CAR WITH A SUSPICIOUS CRATE IN THE BOOT']);toast('📻 999 CALL: CHASE '+why+'! STAY CLOSE TO STOP IT');phText('MARLOWE POLICE','All units: '+why.toLowerCase()+'. Pursue and stop.',true)}
 else{const s=MARLOWE3.pickSpot(150,620);if(!s)return newCall();SHT.st='go';SHT.b=s;SHT.t=0;SHT.w=0;const what=pk(['A NOISE COMPLAINT','A LOST TOURIST','A SHOPLIFTER','A PARKING ROW','A STUCK CAT UP A LAMPPOST','A BROKEN SHOP ALARM']);SHT.what=what;SHT.tmax=Math.round(Math.hypot(s.x-crPos().x,s.z-crPos().z)/9+30);crWay(s.x,s.z,'CALL: '+what);toast('📻 999 CALL: '+what+' AT '+s.name)}}
{const s0=crStart;crStart=function(k){if(k!=='police')return s0(k);const why=crCan(k);if(why){toast(why);return false}SH={k,n:0,t:0,st:'patrol',stage:0};policeDress();toast('👮 ON DUTY · '+CDEF.police.ranks[crLvl('police')]);newCall();return true}}
{const e0=crEnd;crEnd=function(done){if(SH&&SH.k==='police'&&SHT.run){SHT.run.remove();SHT.run=null}e0(done)}}
function callDone(base,msg,arrest){POL.calls++;if(arrest)POL.arrests++;crPay('police',base*REP.mult('police'),msg);REP.add('police',arrest?4:2);if(arrest)REP.add('family',-1);SH.n++;if(SHT.run){SHT.run.remove();SHT.run=null}if(SH.n>=CDEF.police.per){crEnd(true);return}SHT.st='wait';setTimeout(()=>{if(SH&&SH.k==='police')newCall()},2600)}
let sir=0;
{const u0=updCozy;updCozy=function(dt){u0(dt);navTick(dt);if(!decor&&MW.CITY.built)dressStation();
 if(repMsg.length){repT-=dt;if(repT<=0){repPill.textContent=repMsg.splice(0,3).join('\n');repPill.style.display='block';repT=3.2;setTimeout(()=>{if(!repMsg.length)repPill.style.display='none'},3000)}}
 if(POL.pend&&!SH&&inM()&&!GS.onFoot){POL.pend=0;crStart('police')}
 if(!SH||SH.k!=='police')return;if(!inM()&&!AIRPORT.CIN.on&&!GS.inside){toast('YOU LEFT MARLOWE · SHIFT ENDED');return crEnd(false)}
 const t=performance.now()/1000;if(SH.dress&&SH.dress.userData.L)SH.dress.userData.L.forEach((m,i)=>m.material.color.setHex(((t*4|0)+i)%2?0x2a6aff:0xff2a2a));
 const p=crPos();let line='WAITING FOR THE NEXT CALL…';SHT.t+=dt;
 if(SHT.st==='chase'&&SHT.run){const r=SHT.run;r.step(dt,p);RUNBUMP(r);const d=Math.hypot(r.x-p.x,r.z-p.z);PH.way={x:r.x,z:r.z,n:'SUSPECT',keep:1};phWay();
  if(d<9&&!GS.onFoot&&Math.abs(GS.speed)>2){SHT.catchT+=dt;if(SHT.catchT>2.6){r.stopped=1;SHT.st='caught';SHT.w=0;toast('🚔 SUSPECT STOPPED! GREAT DRIVING');beep(988,.1,'square',.05)}}else SHT.catchT=Math.max(0,SHT.catchT-dt*.5);
  if(d>300){SHT.lostT+=dt;if(SHT.lostT>12){toast('THE SUSPECT GOT AWAY…');REP.add('police',-1);SH.n++;r.remove();SHT.run=null;if(PH.way&&PH.way.n==='SUSPECT'){PH.way=null;phWay()}if(SH.n>=CDEF.police.per)return crEnd(true);SHT.st='wait';setTimeout(()=>{if(SH&&SH.k==='police')newCall()},2500)}}else SHT.lostT=0;
  sir-=dt;if(sir<=0&&!GS.onFoot){sir=.5;beep((t*2|0)%2?740:980,.4,'triangle',.02)}
  line='🚨 CHASE THE SUSPECT · '+Math.round(d)+'M'+(SHT.catchT>0?' · STOPPING '+Math.round(SHT.catchT/2.6*100)+'%':'')+(SHT.lostT>0?' · LOSING THEM!':'')}
 else if(SHT.st==='caught'&&SHT.run){SHT.run.step(dt,p);SHT.w+=dt;line='ARRESTING THE DRIVER…';if(SHT.w>2.2){if(PH.way&&PH.way.n==='SUSPECT'){PH.way=null;phWay()}callDone(55+SHT.t*.2,'ARREST MADE',1)}}
 else if(SHT.st==='go'){const left=SHT.tmax-SHT.t;line='📻 '+SHT.what+' · '+SHT.b.name+' · '+(left>0?fmtT(left):'LATE');if(crStopped(SHT.b.x,SHT.b.z,9)){SHT.w+=dt;line='SORTING IT OUT… '+Math.max(0,Math.ceil(2.5-SHT.w));if(SHT.w>2.5){if(PH.way&&PH.way.keep){PH.way=null;phWay()}callDone(28+(left>0?left*.5:0),left>0?'CALL SORTED, QUICK RESPONSE!':'CALL SORTED')}}else SHT.w=0}
 crHud.style.display=menuOpen||GS.inside?'none':'block';crHud.style.whiteSpace='pre-line';crHud.textContent='👮 '+CDEF.police.ranks[crLvl('police')]+' · '+SH.n+'/'+CDEF.police.per+' CALLS\n'+line}}
/* minimap: the suspect */
{const w=window.MARLOWE3,m0=w.mm;w.mm=function(mc,T,k){m0(mc,T,k);if(SH&&SH.k==='police'&&SHT.run){const r=SHT.run,gx=Math.max(4,Math.min(MMS-4,(r.x-T.x)*k+MMS/2)),gz=Math.max(4,Math.min(MMS-17,-(r.z-T.z)*k+MMS/2));mc.fillStyle='#ff3030';mc.strokeStyle='#fff';mc.lineWidth=2;mc.beginPath();mc.arc(gx,gz,4.5,0,6.3);mc.fill();mc.stroke()}}}
window.MPOLICE={POL,ST,get SHT(){return SHT}};
})();
