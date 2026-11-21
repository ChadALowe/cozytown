/* COZYTOWN CRIME CORE
   - a road graph + route finder (used by the police and the GPS)
   - a GPS line painted on the road to your waypoint
   - district names as you drive into each part of town, and places that appear on the map once you find them
   - the wanted level: up to five stars, police patrols and chases with sirens, being BUSTED, the police station
   - a shared objective panel, hold-to-do actions with a progress bar, and minimap blips */
(function(){
const T=window.TOWN;if(!T)return;const TAU=Math.PI*2;
const pos=()=>GS.onFoot?P:GS;
const LAST={x:0,z:0};
const inTownP=(x,z)=>x>TB.x0-40&&x<TB.x1+40&&z>TB.z0-40&&z<320;
const moonOn=()=>!!(window.MOON&&MOON.MN&&MOON.MN.on);
const inTown=()=>{if(GS.inside||moonOn())return false;const p=pos();return inTownP(p.x,p.z)};
const pk=a=>a[Math.floor(Math.random()*a.length)];

/* ================================================================ road graph */
const NODES=[],ADJ=[],SEGN=new Map();
const nodeAt=(x,z)=>{for(let i=0;i<NODES.length;i++){const n=NODES[i];if(Math.abs(n[0]-x)<3.2&&Math.abs(n[1]-z)<3.2)return i}NODES.push([x,z]);ADJ.push([]);return NODES.length-1};
function buildGraph(){NODES.length=0;ADJ.length=0;SEGN.clear();
 for(const s of SEG){const ts=[0,s.l];for(const o of SEG){if(o===s)continue;const den=s.dx*o.dz-s.dz*o.dx;if(Math.abs(den)>1e-4){const ex=o.a[0]-s.a[0],ez=o.a[1]-s.a[1],t=(ex*o.dz-ez*o.dx)/den,u=(ex*s.dz-ez*s.dx)/den;if(t>-1&&t<s.l+1&&u>-1&&u<o.l+1)ts.push(Math.max(0,Math.min(s.l,t)))}
   for(const e of[o.a,o.b]){const q=segDist(e[0],e[1],s);if(q.d<2.5)ts.push(q.t)}}
  ts.sort((a,b)=>a-b);const L=[];for(const t of ts){if(L.length&&t-L[L.length-1][0]<2)continue;L.push([t,nodeAt(s.a[0]+s.dx*t,s.a[1]+s.dz*t)])}SEGN.set(s,L);
  for(let i=0;i<L.length-1;i++){const a=L[i][1],b=L[i+1][1],w=L[i+1][0]-L[i][0];if(a===b)continue;ADJ[a].push([b,w]);ADJ[b].push([a,w])}}}
buildGraph();
function dijkstra(src,dst){const n=NODES.length,D=new Float64Array(n).fill(1e18),PV=new Int32Array(n).fill(-1),done=new Uint8Array(n);const H=[];
 const push=(i,d)=>{H.push([d,i]);let k=H.length-1;while(k>0){const p=(k-1)>>1;if(H[p][0]<=H[k][0])break;[H[p],H[k]]=[H[k],H[p]];k=p}};
 const pop=()=>{const top=H[0],last=H.pop();if(H.length){H[0]=last;let k=0;for(;;){const l=k*2+1,r=l+1;let m=k;if(l<H.length&&H[l][0]<H[m][0])m=l;if(r<H.length&&H[r][0]<H[m][0])m=r;if(m===k)break;[H[m],H[k]]=[H[k],H[m]];k=m}}return top};
 for(const[i,c]of src){if(c<D[i]){D[i]=c;push(i,c)}}const goal=new Map(dst.map(([i,c])=>[i,c]));let best=-1,bc=1e18;
 while(H.length){const[d,i]=pop();if(done[i])continue;done[i]=1;if(d>=bc)break;if(goal.has(i)&&d+goal.get(i)<bc){bc=d+goal.get(i);best=i}for(const[j,w]of ADJ[i]){const nd=d+w;if(nd<D[j]){D[j]=nd;PV[j]=i;push(j,nd)}}}
 if(best<0)return null;const path=[];for(let i=best;i>=0;i=PV[i])path.push(i);return path.reverse()}
function ends(x,z){const r=roadNear(x,z);if(!r.s)return{pt:[x,z],L:[]};const L=SEGN.get(r.s)||[],t=r.q.t,o=[];let lo=null,hi=null;for(const e of L){if(e[0]<=t)lo=e;if(e[0]>=t&&!hi)hi=e}if(lo)o.push([lo[1],t-lo[0]+r.d]);if(hi)o.push([hi[1],hi[0]-t+r.d]);return{pt:[r.q.px,r.q.pz],L:o,d:r.d}}
function route(x0,z0,x1,z1){const A=ends(x0,z0),B=ends(x1,z1);if(!A.L.length||!B.L.length)return[[x0,z0],[x1,z1]];
 const p=dijkstra(A.L,B.L);if(!p)return[[x0,z0],[x1,z1]];const out=[[x0,z0],A.pt];for(const i of p)out.push(NODES[i]);out.push(B.pt,[x1,z1]);
 /* trim back-tracking at the ends */if(out.length>4){const a=out[1],b=out[2],c=out[3];if(Math.hypot(a[0]-c[0],a[1]-c[1])<Math.hypot(b[0]-c[0],b[1]-c[1]))out.splice(2,1)}
 const n=out.length;if(n>4){const a=out[n-2],b=out[n-3],c=out[n-4];if(Math.hypot(a[0]-c[0],a[1]-c[1])<Math.hypot(b[0]-c[0],b[1]-c[1]))out.splice(n-3,1)}return out}

/* ================================================================ GPS line on the road */
const GPS={mesh:null,t:0,len:0};{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(9*300),3));g.setDrawRange(0,0);
 GPS.mat=new THREE.MeshBasicMaterial({color:0x40c8ff,transparent:true,opacity:.85,depthWrite:false,side:THREE.DoubleSide,fog:false,polygonOffset:true,polygonOffsetFactor:-6,polygonOffsetUnits:-6});GPS.mesh=new THREE.Mesh(g,GPS.mat);GPS.mesh.frustumCulled=false;GPS.mesh.renderOrder=5;scene.add(GPS.mesh)}
function gpsUpd(dt){GPS.t-=dt;const w=PH.way;if(!w||!inTown()||!inTownP(w.x,w.z)){GPS.mesh.visible=false;return}GPS.mesh.visible=true;GPS.mat.opacity=.6+.3*Math.sin(performance.now()/260);
 if(GPS.t>0)return;GPS.t=.7;const p=pos(),R=route(p.x,p.z,w.x,w.z),A=GPS.mesh.geometry.attributes.position.array;let n=0,acc=0,carry=6;GPS.mat.color.setHex(w.crime?0xff5040:0x40c8ff);
 for(let i=0;i<R.length-1&&n<300;i++){const a=R[i],b=R[i+1],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);if(l<.01)continue;const ux=dx/l,uz=dz/l;let t=carry;
  while(t<l&&n<300){if(acc+t>650)break;const cx=a[0]+ux*t,cz=a[1]+uz*t,y=G0+.22,s=1.9;
   /* chevron = 3 verts of a triangle pointing along the route */A.set([cx+ux*s,y,cz+uz*s,cx-ux*s*.5-uz*s,y,cz-uz*s*.5+ux*s,cx-ux*s*.5+uz*s,y,cz-uz*s*.5-ux*s],n*9);n++;t+=4.2}
  carry=t-l;acc+=l;if(acc>650)break}
 GPS.mesh.geometry.setDrawRange(0,n*3);GPS.mesh.geometry.attributes.position.needsUpdate=true;GPS.len=acc}

/* ================================================================ HUD: stars, objective, hold-to-do */
const css=document.createElement('style');css.textContent=`
#crSt{position:fixed;top:22px;left:50%;transform:translateX(-50%);z-index:26;font:bold 22px ui-monospace,monospace;letter-spacing:2px;text-shadow:2px 2px 0 #000;pointer-events:none;display:none}
#crObj{position:fixed;bottom:10px;left:50%;transform:translateX(-50%);z-index:26;background:rgba(20,10,14,.88);border:2px solid #ff5040;border-radius:12px;color:#fff;font:bold 12px ui-monospace,monospace;padding:5px 12px;text-align:center;display:none;max-width:86vw;pointer-events:none;line-height:1.35}
#crBar{position:fixed;left:50%;bottom:24%;transform:translateX(-50%);z-index:27;width:220px;background:rgba(0,0,0,.75);border:2px solid #fff;border-radius:10px;padding:6px;display:none;font:bold 12px ui-monospace,monospace;color:#fff;text-align:center;pointer-events:none}
#crBar i{display:block;height:10px;background:#ffd24a;border-radius:5px;margin-top:4px;width:0}
#crDis{position:fixed;top:30%;left:50%;transform:translateX(-50%);z-index:24;font:bold 30px Georgia,serif;color:#fff8e0;text-shadow:3px 3px 0 #000,0 0 18px #000;letter-spacing:.06em;opacity:0;transition:opacity .8s;pointer-events:none;text-align:center;white-space:nowrap}
#crDis small{display:block;font:bold 12px ui-monospace,monospace;letter-spacing:.3em;color:#ffd24a}
#crBig{position:fixed;inset:0;z-index:80;display:none;align-items:center;justify-content:center;flex-direction:column;background:rgba(0,0,0,.35);pointer-events:none;font:bold 64px Georgia,serif;color:#ff3030;text-shadow:4px 4px 0 #000;letter-spacing:.08em}
#crBig small{font:bold 15px ui-monospace,monospace;color:#fff;letter-spacing:.1em;margin-top:10px}`;document.head.appendChild(css);
const mk=(id,tag)=>{const e=document.createElement(tag||'div');e.id=id;document.body.appendChild(e);return e};
const stEl=mk('crSt'),objEl=mk('crObj'),barEl=mk('crBar'),disEl=mk('crDis'),bigEl=mk('crBig');barEl.innerHTML='<span></span><i></i>';
const OBJ={t:''};function obj(t){OBJ.t=t||''}
function big(t,sub,ms){bigEl.innerHTML=t+(sub?'<small>'+sub+'</small>':'');bigEl.style.display='flex';setTimeout(()=>bigEl.style.display='none',ms||2200)}
/* hold-to-do: stand still (or stay close) for secs */
const HOLD={on:0};function hold(label,secs,fn,o){o=o||{};if(HOLD.on||busy)return;const p=pos();Object.assign(HOLD,{on:1,label,secs,t:0,fn,x:p.x,z:p.z,r:o.r||1.6,fail:o.fail});barEl.firstChild.textContent=label;barEl.style.display='block'}
function holdUpd(dt){if(!HOLD.on)return;const p=pos();if(Math.hypot(p.x-HOLD.x,p.z-HOLD.z)>HOLD.r||busy||GS.inside){HOLD.on=0;barEl.style.display='none';toast('INTERRUPTED');HOLD.fail&&HOLD.fail();return}
 HOLD.t+=dt;barEl.lastChild.style.width=Math.min(100,HOLD.t/HOLD.secs*100)+'%';if(HOLD.t>=HOLD.secs){HOLD.on=0;barEl.style.display='none';HOLD.fn()}}

/* ================================================================ districts + discovering places */
const DIST=[['THE OLD VILLAGE','HISTORIC HEART',(x,z)=>x>-VH&&x<VH&&z>-VH&&z<VH],['MARKET PLACE','TOWN CENTRE',(x,z)=>x>-90&&x<50&&z>-370&&z<-232],['THE SEAFRONT','COZYTOWN-ON-SEA',(x,z)=>z>188],
 ['COZY PARK','GARDENS & BANDSTAND',(x,z)=>x>-1045&&x<-405&&z>18&&z<195],['VICTORIAN QUARTER','TERRACES & CORNER SHOPS',(x,z)=>x>-1070&&x<-460&&z>-570&&z<0],['MEADOW ESTATE','SEMIS & CUL-DE-SACS',(x,z)=>x>240&&x<870&&z>-445&&z<-50],
 ['THE RETAIL PARK','SHOP TILL YOU DROP',(x,z)=>x>580&&x<870&&z>-20&&z<170],['CANALSIDE','LOCKS & NARROWBOATS',(x,z)=>z>-500&&z<-420],['THE CRICKET GROUND','EST. 1878',(x,z)=>Math.hypot((x+185)/70,(z+558)/50)<1],
 ['COZE WOOD','MIND THE GAMEKEEPER',(x,z)=>x>-560&&x<-250&&z>-1160&&z<-700],['WINDMILL HILL','',(x,z)=>Math.hypot(x-630,z+1140)<80],['HOLLOW FARM','KEEP OUT',(x,z)=>Math.hypot(x+1005,z+780)<45],['THE OLD QUARRY','DANGER · DEEP WATER',(x,z)=>Math.hypot(x-922,z+800)<50],
 ['THE MOORS','COUNTRYSIDE',(x,z)=>z<-690],['CHAPEL STREET','',(x,z)=>z>-420&&z<-340],['COZYTOWN','',()=>true]];
const DS={cur:'',cand:'',t:0};
function distUpd(dt){if(!inTown()){DS.cur='';return}const p=pos();let d=null;for(const q of DIST)if(q[2](p.x,p.z)){d=q;break}if(!d)return;if(d[0]===DS.cur){DS.t=0;return}if(d[0]!==DS.cand){DS.cand=d[0];DS.t=0}DS.t+=dt;if(DS.t>1.2){DS.cur=d[0];disEl.innerHTML=d[0]+(d[1]?'<small>'+d[1]+'</small>':'');disEl.style.opacity=1;clearTimeout(DS.h);DS.h=setTimeout(()=>disEl.style.opacity=0,2600)}}
let discT=0;function discUpd(dt){discT-=dt;if(discT>0||!inTown())return;discT=.5;const p=pos();for(const q of T.pois){if(q.d)continue;if(Math.hypot(p.x-q.x,p.z-q.z)<(q.r||70)){q.d=1;toast('🗺 DISCOVERED: '+q.n+' (ADDED TO YOUR MAP)');beep(880,.08,'square',.04);setTimeout(()=>beep(1175,.12,'square',.04),90)}}}
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.tdisc=T.pois.filter(q=>q.d).map(q=>q.n);o.wanted=0;return o};cozyLoad=function(z){l0(z);if(z&&z.tdisc)for(const q of T.pois)if(z.tdisc.includes(q.n))q.d=1}}

/* ================================================================ police */
const W={st:0,lose:0,seen:0,cops:[],bustT:0,lastHit:0,sirenT:0,clear:0};
const COP_CAP=[0,1,2,3,4,5];
function copMesh(){const g=aiCar([.95,.95,.97],1);const B=new Builder(3);pbox(B,0,1.33,-.1,1.4,.12,.5,[.15,.15,.18]);pbox(B,0,.5,0,1.76,.1,4.41,[.1,.3,.85]);pbox(B,0,.6,0,1.76,.1,4.41,[.95,.85,.1]);const m=B.mesh(mObj);m.position.y=0;g.add(m);
 const L=new THREE.MeshBasicMaterial({color:0xff2020}),R=new THREE.MeshBasicMaterial({color:0x2040ff});const a=new THREE.Mesh(new THREE.BoxGeometry(.6,.2,.4),L),b=new THREE.Mesh(new THREE.BoxGeometry(.6,.2,.4),R);a.position.set(-.38,1.52,-.1);b.position.set(.38,1.52,-.1);g.add(a,b);g.userData.l=[a,b];g.visible=false;return g}
const POOL=[];for(let i=0;i<6;i++)POOL.push(copMesh());
function farNode(p,lo,hi,behind){let best=null,bs=-1e9;for(let k=0;k<60;k++){const n=NODES[Math.floor(Math.random()*NODES.length)],d=Math.hypot(n[0]-p.x,n[1]-p.z);if(d<lo||d>hi||!inTownP(n[0],n[1]))continue;const sc=(behind?-((n[0]-p.x)*Math.sin(p.psi||0)+(n[1]-p.z)*Math.cos(p.psi||0))/d:0)+Math.random()*.6;if(sc>bs){bs=sc;best=n}}return best}
function spawnCop(patrol){const g=POOL.find(q=>!q.userData.used);if(!g)return null;const p=pos(),n=farNode(p,patrol?90:110,patrol?260:200,!patrol);if(!n)return null;g.userData.used=1;g.visible=true;
 const c={g,x:n[0],z:n[1],psi:0,v:patrol?8:16,path:null,pi:0,rt:0,patrol,stuck:0,wander:null,hitT:0};W.cops.push(c);return c}
function dropCop(c){c.g.visible=false;c.g.userData.used=0;W.cops.splice(W.cops.indexOf(c),1)}
function wantedN(){return Math.min(5,W.st)}
function heat(n,why,o){o=o||{};if(!inTown())return;const p=pos();const witness=o.always||W.st>0||W.cops.some(c=>Math.hypot(c.x-p.x,c.z-p.z)<(o.r||90))||Math.random()<(o.chance!=null?o.chance:.35);
 if(!witness){if(why)toast('😅 NOBODY SAW THAT...');return false}const was=W.st;W.st=Math.min(5,Math.max(W.st,0)+n);W.lose=0;W.seen=1;if(W.st>was){beep(220,.25,'sawtooth',.08);toast('🚨 WANTED'+(why?': '+why:''))}return true}
function clearWanted(msg){if(!W.st)return;W.st=0;W.lose=0;for(const c of W.cops)if(!c.patrol){c.leave=1}if(msg)toast(msg)}
function copStep(c,dt,tx,tz,chasing){const p=pos();let gx=tx,gz=tz;const dP=Math.hypot(tx-c.x,tz-c.z);
 const playerRoad=roadDist(tx,tz)<RW+PW+22;
 if(chasing&&dP<38&&playerRoad){gx=tx;gz=tz}
 else{c.rt-=dt;if(c.rt<0||!c.path){c.rt=chasing?1.1:4;const R=route(c.x,c.z,tx,tz);c.path=R;c.pi=1}
  while(c.path&&c.pi<c.path.length-1&&Math.hypot(c.path[c.pi][0]-c.x,c.path[c.pi][1]-c.z)<6)c.pi++;const q=c.path&&c.path[Math.min(c.pi,c.path.length-1)];if(q){gx=q[0];gz=q[1]}
  /* police cars don't plough across fields: stop at the road edge */if(chasing&&!playerRoad&&c.pi>=c.path.length-2){gx=c.path[c.path.length-2][0];gz=c.path[c.path.length-2][1]}}
 const want=Math.atan2(gx-c.x,gz-c.z);let da=want-c.psi;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;c.psi+=Math.max(-2.6*dt,Math.min(2.6*dt,da));
 const dg=Math.hypot(gx-c.x,gz-c.z),vmax=chasing?(17+W.st*2.2):9;let vt=vmax*(1-Math.min(.75,Math.abs(da)/1.4));if(chasing&&dP<30){const ps=GS.onFoot?0:Math.abs(GS.speed||0);vt=Math.min(vt,dP<5.6&&ps<4?0:Math.max(1.5,ps+(dP-4.6)*.9))}if(dg<3&&!chasing)vt=0;
 c.v+=Math.max(-16*dt,Math.min(7*dt,vt-c.v));c.x+=Math.sin(c.psi)*c.v*dt;c.z+=Math.cos(c.psi)*c.v*dt;
 /* buildings, trees, water */const L=colQ(c.x,c.z);for(let i=0;i<L.length;i++){const k=L[i];if(k.cop)continue;const dx=c.x-k[0],dz=c.z-k[1],d=Math.hypot(dx,dz),r=k[2]+1.3;if(d<r&&d>1e-3){c.x+=dx/d*(r-d);c.z+=dz/d*(r-d);c.v*=.96}}
 if(hAt(c.x,c.z)<.5){c.x-=Math.sin(c.psi)*c.v*dt*1.5;c.z-=Math.cos(c.psi)*c.v*dt*1.5;c.v*=-.3}
 if(c.v<1.5&&vt>4){c.stuck+=dt;if(c.stuck>2.5){c.stuck=0;c.psi+=Math.PI*.6;c.v=-4;c.path=null}}else c.stuck=0}
function copsUpd(dt){const p=pos(),now=performance.now();const town=inTown();
 /* patrols: two cruisers about town when you're here */
 const pat=W.cops.filter(c=>c.patrol).length;if(town&&pat<2&&Math.random()<dt*.5)spawnCop(1);
 const need=COP_CAP[wantedN()],chasers=W.cops.filter(c=>!c.patrol&&!c.leave).length;if(town&&W.st>0&&chasers<need&&Math.random()<dt*1.2){const c=spawnCop(0);if(c&&W.st>=2)c.v=20}
 if(W.st>0)for(const c of W.cops)if(c.patrol&&Math.hypot(c.x-p.x,c.z-p.z)<160&&W.cops.filter(q=>!q.patrol&&!q.leave).length<need+1)c.patrol=0;/* patrols join in */
 let seen=0,nearest=1e9;
 for(const c of [...W.cops]){const d=Math.hypot(c.x-p.x,c.z-p.z);nearest=Math.min(nearest,d);
  if(!town||d>(c.patrol?420:520)||(c.leave&&d>140)){dropCop(c);continue}
  if(c.patrol&&!c.leave){if(!c.wander||Math.hypot(c.wander[0]-c.x,c.wander[1]-c.z)<12){const n=farNode({x:c.x,z:c.z},60,220);c.wander=n||[p.x,p.z];c.path=null}copStep(c,dt,c.wander[0],c.wander[1],0)}
  else if(c.leave){if(!c.wander){c.wander=farNode(p,300,450)||[c.x+300,c.z];c.path=null}copStep(c,dt,c.wander[0],c.wander[1],0)}
  else{copStep(c,dt,W.st&&W.seen?p.x:(W.lx||p.x),W.st&&W.seen?p.z:(W.lz||p.z),1);if(d<(GS.onFoot?60:95))seen=1}
  c.g.position.set(c.x,G0,c.z);c.g.rotation.y=c.psi;const on=!c.patrol&&!c.leave&&W.st>0,f=(now/170|0)%2;c.g.userData.l[0].material.color.setHex(on?(f?0xff2020:0x400000):0x601010);c.g.userData.l[1].material.color.setHex(on?(f?0x100040:0x2050ff):0x102060);
  c.g.visible=d<scene.fog.far+30;
  /* bumping the player car */if(!GS.onFoot&&!GS.inside&&d<2.8){const nx=(p.x-c.x)/(d||1),nz=(p.z-c.z)/(d||1),rv=(GS.vx||0)*nx+(GS.vz||0)*nz-(Math.sin(c.psi)*c.v*nx+Math.cos(c.psi)*c.v*nz);const m=(2.8-d)/2;GS.x+=nx*m;GS.z+=nz*m;c.x-=nx*m;c.z-=nz*m;if(rv<-2){GS.vx-=rv*nx*.6;GS.vz-=rv*nz*.6}c.v*=.5;
   if(rv<-6&&now-W.lastHit>4000){W.lastHit=now;beep(80,.3,'sawtooth',.14);if(c.patrol||W.st===0)heat(1,'RAMMING A POLICE CAR',{always:1});else if(W.st<5&&Math.random()<.3)heat(1,'RAMMING A POLICE CAR',{always:1})}}}
 /* cops keep each other apart */for(let i=0;i<W.cops.length;i++)for(let j=i+1;j<W.cops.length;j++){const a=W.cops[i],b=W.cops[j],dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);if(d<4.4&&d>1e-3){const m=(4.4-d)/2;a.x-=dx/d*m;a.z-=dz/d*m;b.x+=dx/d*m;b.z+=dz/d*m}}
 /* evading */
 if(W.st>0){if(seen){W.seen=1;W.lose=0;W.lx=p.x;W.lz=p.z}else{W.seen=0;W.lose+=dt;if(W.lose>7+W.st*2.2){W.st--;W.lose=0;if(W.st===0){toast('😮‍💨 YOU LOST THE POLICE');clearWanted()}else toast('★ DOWN TO '+W.st+' STAR'+(W.st>1?'S':''))}}
  /* hiding indoors clears up to two stars */if(GS.inside){W.inT=(W.inT||0)+dt;if(W.st<=2&&W.inT>6){clearWanted('🤫 THE SHOPKEEPER HID YOU. THE HEAT IS OFF.')}}else W.inT=0;
  /* busted */const slow=GS.onFoot?P.speed<1.6:Math.abs(GS.speed||0)<3.2;const close=W.cops.some(c=>!c.patrol&&!c.leave&&Math.hypot(c.x-p.x,c.z-p.z)<(GS.onFoot?5:7.5));
  if(close&&slow&&!GS.inside){W.bustT+=dt;if(W.bustT>2.2)busted()}else W.bustT=Math.max(0,W.bustT-dt*2)}
 /* siren */W.sirenT-=dt;if(W.st>0&&nearest<150&&W.sirenT<0){W.sirenT=.42;W.hi=!W.hi;beep(W.hi?960:720,.38,'triangle',Math.max(.012,.055*(1-nearest/150)))}
 /* HUD */const ev=W.st>0&&!W.seen&&(now/300|0)%2;stEl.style.display=W.st>0?'block':'none';stEl.innerHTML='<span style="color:'+(ev?'#fff8':'#ffd24a')+'">'+'★'.repeat(W.st)+'</span><span style="color:#fff3">'+'★'.repeat(5-W.st)+'</span>'+(W.bustT>0?' <span style="color:#ff4040">STOP! '+Math.max(0,2.2-W.bustT).toFixed(1)+'</span>':'')}
const BUSTH=[];
function busted(){W.bustT=0;const fine=Math.min(Math.floor(cash),50+W.st*40+Math.floor(cash*.05));const lost=[];for(const f of BUSTH){try{const r=f();if(r)lost.push(r)}catch(e){}}W.st=0;for(const c of[...W.cops])if(!c.patrol)dropCop(c);
 big('BUSTED','FINE £'+fine+(lost.length?' · CONFISCATED: '+lost.join(', '):''),3000);beep(150,.6,'sawtooth',.1);
 setTimeout(()=>fade(()=>{cash-=fine;const st=SHOPD.find(s=>s.t==='COZYTOWN POLICE');if(st){if(!GS.onFoot){GS.onFoot=1;man.visible=true}GS.x=st.x+7;GS.z=st.z+4;GS.vx=GS.vz=0;GS.speed=0;GS.psi=0;P.x=st.x;P.z=st.z+1.5;P.psi=0;setLabels()}GT+=2;if(GT>=24){GT-=24;newDay()}toast('A NIGHT IN THE CELLS. YOUR CAR IS IN THE POLICE CAR PARK.');obj('')}),1400)}
/* police station front desk */
TH['COZYTOWN POLICE']={wall:0xdde4ee,fl:'tile2',cnt:0x0a2a6a,top:0xc8ccd4,pal:[0x0a2a6a,0xf0f0f0],back:0,left:0,sh:0x0a2a6a};KEEP['COZYTOWN POLICE']=['SGT BAKER','Evening all. Behave yourself and we\'ll get along fine.'];HRS['COZYTOWN POLICE']=[0,24];
CUSTOM_SHOP.cpol=function(msg){$id('shT').textContent='👮 COZYTOWN POLICE';$id('shMsg').textContent=msg||'"Evening all."';
 dRow(W.st?'TURN YOURSELF IN (CLEARS '+W.st+'★ · FINE £'+(W.st*60)+')':'YOU ARE NOT WANTED. "Keep it that way."',[[W.st?'£'+W.st*60:'OK',()=>{if(!W.st)return renderShop('"Off you go then."');if(cash<W.st*60)return renderShop('"You can\'t afford the fine. Hand yourself in properly."');cash-=W.st*60;clearWanted();renderShop('"Sensible. Don\'t let me see you again."')}]]);
 dRow('READ THE NOTICE BOARD',[['READ',()=>renderShop(pk(['WANTED: INFORMATION ON A RED VAN SEEN NEAR HOLLOW FARM AT NIGHT.','REMINDER: POACHING IN COZE WOOD IS A CRIMINAL OFFENCE.','REWARD: BIG TERRY? NEVER HEARD OF HIM. - SGT BAKER','STREET RACING ON KING\'S WAY WILL BE PROSECUTED.','LOST PROPERTY CAN BE HANDED IN AT THIS DESK.']))]]);
 for(const f of DESK)f();dRow('',[['DONE',()=>closeShop()]])};
const DESK=[];const $id=id=>document.getElementById(id);
{const b0=buildShop;buildShop=function(o){b0(o);if(!o||o.t!=='COZYTOWN POLICE')return;const B=(x,y,z,w,h,d,hex)=>sbox(x,y,z,w,h,d,fmc(hex));for(const x of[-1.6,1.6])B(x,1.07,-1.05,1.8,1.0,.04,0xbcd8e8);
 for(let k=0;k<5;k++)B(-RX+.3,0,-.6+k*.6,.5,.45,.5,0x2a3a5a);IROOM.push([-RX,-RX+.6,-.9,2.4]);splane(1.3,1.6,RX-.03,1.6,.6,-Math.PI/2,imat(dtex('wantedp',64,80,c=>{c.fillStyle='#e8dcc0';c.fillRect(0,0,64,80);c.fillStyle='#202020';c.font='bold 11px monospace';c.textAlign='center';c.fillText('WANTED',32,16);c.fillStyle='#806040';c.fillRect(16,24,32,32);c.fillStyle='#202020';c.font='bold 8px monospace';c.fillText('"BIG TERRY"',32,68);c.fillText('?',32,46)})));
 for(let k=0;k<4;k++)B(RX-.4,0,-.4+k*.8,.6,2.2,.06,0x707880);B(RX-.4,2.15,.8,.6,.06,2.6,0x707880);IROOM.push([RX-.8,RX,-.8,2.2]);
 for(const a of IA)if(typeof a.label==='string'&&/^BUY /.test(a.label)){a.label='👮 THE FRONT DESK';a.fn=()=>openShop('cpol')}}}

/* ================================================================ minimap blips */
MMH.push((g,mx,mz,sc)=>{if(!inTown())return;const now=performance.now(),f=(now/250|0)%2;for(const c of W.cops){if(!c.g.visible&&Math.hypot(c.x-pos().x,c.z-pos().z)>200)continue;const on=!c.patrol&&W.st>0;g.fillStyle=on?(f?'#ff3030':'#3060ff'):'#7090ff';g.beginPath();g.arc(mx(c.x),mz(c.z),(on?4:3)/sc,0,TAU);g.fill()}
 if(PH.way&&PH.way.crime){g.strokeStyle='#ff5040';g.lineWidth=2/sc;g.beginPath();g.arc(mx(PH.way.x),mz(PH.way.z),(5+2*f)/sc,0,TAU);g.stroke()}});

/* ================================================================ tick */
{const u0=updCozy;updCozy=function(dt){u0(dt);if(menuOpen)return;if(!GS.inside){const p=pos();LAST.x=p.x;LAST.z=p.z}
 gpsUpd(dt);holdUpd(dt);distUpd(dt);discUpd(dt);copsUpd(dt);
 if(OBJ.t&&!busy&&!GS.inside){let s=OBJ.t;if(PH.way&&inTown()){const p=pos(),d=Math.hypot(PH.way.x-p.x,PH.way.z-p.z);s+='  ·  '+(d>1000?(d/1000).toFixed(1)+' KM':Math.round(d)+' M')}if(objEl._t!==s){objEl._t=s;objEl.textContent=s}objEl.style.display='block'}else objEl.style.display='none'}}
window.CRIME={W,heat,clearWanted,busted,route,NODES,ADJ,obj,OBJ,big,hold,HOLD,inTown,pos,BUSTH,DESK,spawnCop,LAST,GPS};
})();
