/* Full-screen village map: tap the minimap (or press M). Drag to pan, wheel / pinch / +- to zoom, tap a place for its name. */
(function(){
const HALFW=HALF;
const CAT={
 food:{c:'#ff9a3c',i:'🍴',n:'FOOD & DRINK'},
 shop:{c:'#ffd24a',i:'🛍',n:'SHOPS'},
 serv:{c:'#4aa8ff',i:'✉',n:'SERVICES'},
 fun:{c:'#c070ff',i:'🎯',n:'FUN & GAMES'},
 cash:{c:'#3ad07a',i:'£',n:'MONEY & BETS'},
 car:{c:'#ff5a4a',i:'🔧',n:'CARS & RACING'},
 trav:{c:'#35d0e0',i:'✈',n:'TRAVEL'},
 farm:{c:'#9ad33a',i:'🚜',n:'FARMLAND'},
 home:{c:'#ffffff',i:'🏠',n:'YOUR HOME'},
 church:{c:'#c8c8d0',i:'⛪',n:'CHURCH'},
 school:{c:'#e8d070',i:'🏫',n:'SCHOOL'}
};
const catOf=t=>{t=t.toUpperCase();
 if(/FISH|BAKERY|CAFE|DELI|BUTCHER|CO-OP|ROYAL OAK|INN\b|TAVERN|PLOUGH|NARROWBOAT|WELLINGTON|CHIP|KEBAB|TEA ROOMS|BURGER|TAKEAWAY|GREENGROCER|FUDGE|SUPERSTORE/.test(t))return'food';
 if(/POST|CHEMIST|HAIR|ESTATE|VET|NEWS/.test(t))return'serv';
 if(/FLORIST|BOOK|PENNY|HARRINGTON|MAISON|RANI|SINGH/.test(t))return'shop';
 if(/BOWL|BULLSEYE|ARCADE|FC|CASINO|ROXY|AMUSEMENT|TOY/.test(t))return t==='CASINO'?'cash':'fun';
 if(/LUCKY|STOCK/.test(t))return'cash';
 if(/MOTORS|GARAGE|MOTORSPORT/.test(t))return'car';
 if(/AIRWAYS|FERRY|AIRPORT/.test(t))return'trav';return'shop'};
const ICON={'THE ROYAL OAK':'🍺','POST OFFICE':'📮','CHEMIST':'💊','HAIRDRESSER':'✂','VET':'🐾','BOOKSHOP':'📚','FLORIST':'🌸',"PENNY'S BARGAINS":'🏷','HARRINGTON & CO':'🧥',"MAISON D'OR":'👑',"RANI'S SILK HOUSE":'🥻',"SINGH'S CORNER SHOP":'🏪','STRIKE BOWL':'🎳','BULLSEYE RANGE':'🎯','NEON ARCADE':'🕹','VILLAGE ROVERS FC':'⚽','CASINO':'🎰','LUCKY BETS':'🎲','COZY STOCK EXCHANGE':'📈','VILLAGE MOTORS':'🚗',"JOE'S GARAGE":'🔧','COZY MOTORSPORT CLUB':'🏁','COZY HARBOUR FERRY':'⛴','COZY AIRWAYS':'✈','BAKERY':'🥖','CAFE':'☕',"FRANKIE'S FISH & CHIPS":'🍟','BUTCHER':'🥩','DELI':'🧀','CO-OP':'🛒','NEWSAGENT':'📰','ESTATE AGENT':'🔑'};
const BC={station:'#5a6a8a',townhall:'#c8bca0',shop:'#b08a5a',pub:'#9a5a3a',church:'#8a8a94',school:'#c8b060',terr:'#a2705c',semi:'#a2705c',cot:'#b88a6a',det:'#9a6a5a',bung:'#b08a78',casino:'#7a3a9a',club:'#8a4a4a',stocks:'#3a7a5a',ferry:'#3a7a9a',airport:'#3a8a9a'};
let OVR=null,pts=null;
function places(){if(pts)return pts;pts=[];const seen={};
 for(const s of SHOPD){if(s.x<TB.x0||s.x>TB.x1||s.z<TB.z0||s.z>300)continue;const c=catOf(s.t);pts.push({x:s.x,z:s.z,n:s.t,c,ic:ICON[s.t]||CAT[c].i})}
 for(const b of BLD){if(b.k==='church'&&!seen.ch){seen.ch=1;pts.push({x:b.x,z:b.z,n:'CHURCH',c:'church',ic:CAT.church.i})}if(b.k==='school'&&!seen.sc){seen.sc=1;pts.push({x:b.x,z:b.z,n:'SCHOOL',c:'school',ic:CAT.school.i})}}
 if(typeof HM!=='undefined')pts.push({x:HM.x,z:HM.z,n:'YOUR HOME',c:'home',ic:'🏠'});if(window.TOWN&&TOWN.pois)for(const q of TOWN.pois)pts.push(q);
 pts.push({x:-102,z:141.5,n:'FARMLAND ROAD (DRIVE HERE)',c:'farm',ic:'🚜'});
 return pts}
function open(){if(OVR||busy||CIN_ON()||menuOpen)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;places();
 const ov=document.createElement('div');ov.id='fmap';ov.style.cssText='position:fixed;inset:0;z-index:80;background:#0b1a10;touch-action:none;user-select:none;font:bold 12px ui-monospace,monospace;color:#fff';
 const cv=document.createElement('canvas');cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;cursor:grab';ov.appendChild(cv);
 const bar=document.createElement('div');bar.style.cssText='position:absolute;left:0;right:0;top:0;display:flex;align-items:center;gap:8px;padding:8px 10px;background:linear-gradient(#000c,#0000);pointer-events:none';
 const ttl=document.createElement('div');ttl.textContent='COZYTOWN MAP';ttl.style.cssText='font-size:15px;letter-spacing:.12em;color:#ffd24a;flex:1;text-shadow:0 2px 0 #000';bar.appendChild(ttl);
 const bt=(t,f,w)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='pointer-events:auto;font:bold 18px ui-monospace,monospace;min-width:'+(w||42)+'px;height:42px;border:3px solid #f5e6a0;border-radius:10px;background:#1b2a3acc;color:#fff;cursor:pointer;padding:0 8px';b.onclick=f;bar.appendChild(b);return b};
 const leg=document.createElement('div');leg.style.cssText='position:absolute;left:10px;bottom:10px;max-width:min(260px,70vw);background:#0b1420ee;border:3px solid #f5e6a0;border-radius:10px;padding:8px 10px;max-height:60vh;overflow:auto';
 const lt=document.createElement('div');lt.textContent='LEGEND';lt.style.cssText='color:#ffd24a;letter-spacing:.1em;margin-bottom:4px';leg.appendChild(lt);
 const rows=document.createElement('div');leg.appendChild(rows);
 const addRow=(sw,ic,t)=>{const r=document.createElement('div');r.style.cssText='display:flex;align-items:center;gap:7px;margin:3px 0;font-size:11px';const s=document.createElement('span');s.style.cssText='display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:'+sw+';color:#000;font-size:12px;flex:none;border:2px solid #000a';s.textContent=ic;const x=document.createElement('span');x.textContent=t;r.append(s,x);rows.appendChild(r)};
 for(const k of['home','food','shop','serv','fun','cash','car','trav','farm','church','school'])addRow(CAT[k].c,CAT[k].i,CAT[k].n);
 addRow('#4af','▲','YOU (ON FOOT)');addRow('#fff','➤','YOUR CAR / DIRECTION');addRow('#ff4a2a','●','DELIVERY STOP');
 const sw2=(c,t)=>{const r=document.createElement('div');r.style.cssText='display:flex;align-items:center;gap:7px;margin:3px 0;font-size:11px';const s=document.createElement('span');s.style.cssText='width:20px;height:8px;background:'+c+';flex:none;border-radius:2px';const x=document.createElement('span');x.textContent=t;r.append(s,x);rows.appendChild(r)};
 sw2('#d8d8d0','ROAD');sw2('#5aa648','THE GREEN / PARK');sw2('#4a82b4','POND');sw2('#a2705c','HOUSES');
 const lb=bt('LEGEND',()=>{rows.style.display=rows.style.display==='none'?'block':'none'},92);
 const info=document.createElement('div');info.style.cssText='position:absolute;right:10px;bottom:10px;background:#0b1420ee;border:3px solid #f5e6a0;border-radius:10px;padding:8px 12px;font-size:13px;display:none;max-width:60vw';
 ov.append(bar,leg,info);
 const M={ov,cv,g:cv.getContext('2d'),s:1.7,cx:0,cz:0,ptr:new Map(),info,sel:null,raf:0,drag:0,pd:0};
 const play=()=>{const T=GS.inside&&typeof HM!=='undefined'?{x:HM.x,z:HM.z}:GS.onFoot?P:GS;return T};
 const fit=()=>{const r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);cv.width=r.width*d;cv.height=r.height*d;M.d=d};
 const T0=play();M.cx=T0.x;M.cz=T0.z;
 const clampV=()=>{M.cx=Math.max(-HALFW,Math.min(HALFW,M.cx));M.cz=Math.max(-HALFW,Math.min(HALFW,M.cz))};
 const zoom=(f,px,py)=>{const r=cv.getBoundingClientRect(),w2=r.width/2,h2=r.height/2,px_=px==null?w2:px,py_=py==null?h2:py,ns=Math.max(.9,Math.min(14,M.s*f));
  const wx=M.cx+(px_-w2)/M.s,wz=M.cz+(py_-h2)/M.s;M.s=ns;M.cx=wx-(px_-w2)/M.s;M.cz=wz-(py_-h2)/M.s;clampV()};
 bt('+',()=>zoom(1.5),42);bt('−',()=>zoom(1/1.5),42);bt('⌖',()=>{const t=play();M.cx=t.x;M.cz=t.z;M.s=Math.max(M.s,3)},42);bt('▣',()=>{const r=cv.getBoundingClientRect();M.s=Math.min(r.width/(TB.x1-TB.x0+60),r.height/(260-TB.z0+60));M.cx=(TB.x0+TB.x1)/2;M.cz=(TB.z0+260)/2},42);bt('✕',close,42);
 const w2s=(x,z)=>{const r=cv.getBoundingClientRect();return[(x-M.cx)*M.s+r.width/2,(z-M.cz)*M.s+r.height/2]};
 const pick=(px,py)=>{let b=null,bd=26;for(const p of pts){const q=w2s(p.x,p.z),d=Math.hypot(q[0]-px,q[1]-py);if(d<bd){bd=d;b=p}}return b};
 cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);M.ptr.set(e.pointerId,{x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY});M.drag=0;if(M.ptr.size===2){const a=[...M.ptr.values()];M.pd=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}cv.style.cursor='grabbing'});
 cv.addEventListener('pointermove',e=>{const p=M.ptr.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
  if(M.ptr.size===1){if(Math.hypot(e.clientX-p.sx,e.clientY-p.sy)>6)M.drag=1;M.cx-=dx/M.s;M.cz-=dy/M.s;clampV()}
  else if(M.ptr.size===2){M.drag=1;const a=[...M.ptr.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),r=cv.getBoundingClientRect();if(M.pd>0)zoom(d/M.pd,(a[0].x+a[1].x)/2-r.left,(a[0].y+a[1].y)/2-r.top);M.pd=d}});
 const up=e=>{const p=M.ptr.get(e.pointerId);if(p&&!M.drag&&M.ptr.size===1){const r=cv.getBoundingClientRect(),pl=pick(e.clientX-r.left,e.clientY-r.top);M.sel=pl;if(pl){const t=play(),d=Math.round(Math.hypot(pl.x-t.x,pl.z-t.z));info.style.display='block';info.innerHTML='';const a=document.createElement('div');a.style.cssText='color:'+CAT[pl.c].c;a.textContent=pl.ic+' '+pl.n;const b=document.createElement('div');b.style.cssText='font-size:11px;color:#9ab;margin-top:3px';b.textContent=CAT[pl.c].n+'  ·  '+d+' m AWAY';info.append(a,b)}else info.style.display='none'}
  M.ptr.delete(e.pointerId);M.pd=0;if(!M.ptr.size)cv.style.cursor='grab'};
 cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 cv.addEventListener('wheel',e=>{e.preventDefault();const r=cv.getBoundingClientRect();zoom(e.deltaY<0?1.2:1/1.2,e.clientX-r.left,e.clientY-r.top)},{passive:false});
 M.kd=e=>{if(e.key==='Escape'||e.key==='m'||e.key==='M'){e.preventDefault();e.stopPropagation();close()}else if(e.key==='+'||e.key==='=')zoom(1.3);else if(e.key==='-')zoom(1/1.3)};addEventListener('keydown',M.kd,true);
 M.rs=fit;addEventListener('resize',fit);
 if(innerWidth<700)rows.style.display='none';document.body.appendChild(ov);fit();OVR=M;
 const draw=()=>{M.raf=requestAnimationFrame(draw);const g=M.g,d=M.d,r=cv.getBoundingClientRect(),W=r.width,H=r.height,s=M.s;g.setTransform(d,0,0,d,0,0);
  g.fillStyle='#2f6a2c';g.fillRect(0,0,W,H);
  const X=x=>(x-M.cx)*s+W/2,Z=z=>(z-M.cz)*s+H/2;
  /* world edge */
  g.fillStyle='#2a6a8a';g.fillRect(0,0,W,H);townMap(g,X,Z,s);g.fillStyle='#3f7a35';g.fillRect(X(-VH),Z(-VH),2*VH*s,2*VH*s);
  /* green + pond */
  g.fillStyle='#5aa648';g.beginPath();g.arc(X(GRC[0]),Z(GRC[1]),GRR*s,0,6.3);g.fill();g.fillStyle='#4a82b4';g.beginPath();g.arc(X(GRC[0]+9),Z(GRC[1]-6),9*s/1.0*.6,0,6.3);g.fill();
  /* roads */
  g.lineCap='round';g.lineJoin='round';for(const pass of[0,1]){g.strokeStyle=pass?'#d8d8d0':'#2a2a30';g.lineWidth=(pass?9:11)*s;for(const rd of ROADS){g.beginPath();rd.p.forEach((q,i)=>i?g.lineTo(X(q[0]),Z(q[1])):g.moveTo(X(q[0]),Z(q[1])));g.stroke()}}
  g.strokeStyle='#e8c840';g.lineWidth=Math.max(1,.5*s);g.setLineDash([3*s,3*s]);for(const rd of ROADS){if(!rd.lines)continue;g.beginPath();rd.p.forEach((q,i)=>i?g.lineTo(X(q[0]),Z(q[1])):g.moveTo(X(q[0]),Z(q[1])));g.stroke()}g.setLineDash([]);
  if(s>1.6){g.fillStyle='#fff';g.strokeStyle='#000';g.lineWidth=3;g.font='bold '+Math.min(14,5+s*1.4)+'px ui-monospace,monospace';g.textAlign='center';for(const rd of ROADS){if(rd.ring)continue;const a=rd.p[0],b=rd.p[rd.p.length>2?1:rd.p.length-1],mxp=(a[0]+b[0])/2,mzp=(a[1]+b[1])/2,x=X(mxp),z=Z(mzp);if(x<-60||z<-30||x>W+60||z>H+30)continue;g.save();g.translate(x,z);let an=Math.atan2(b[1]-a[1],b[0]-a[0]);if(an>Math.PI/2||an<-Math.PI/2)an+=Math.PI;g.rotate(an);g.strokeText(rd.n,0,-1);g.fillText(rd.n,0,-1);g.restore()}}
  /* buildings */
  for(const b of BLD){if(b.k==='airport'&&Math.abs(b.x)>400)continue;const x=X(b.x),z=Z(b.z);if(x<-80||z<-80||x>W+80||z>H+80)continue;g.save();g.translate(x,z);g.rotate(b.rot);g.fillStyle=BC[b.k]||'#a2705c';g.strokeStyle='#0007';g.lineWidth=1;g.fillRect(-b.w/2*s,-b.d/2*s,b.w*s,b.d*s);g.strokeRect(-b.w/2*s,-b.d/2*s,b.w*s,b.d*s);g.restore()}
  /* delivery stops + depots */
  if(JOB.on)for(const st of JOB.stops){if(st.done)continue;g.fillStyle='#ff4a2a';g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.arc(X(st.dx),Z(st.dz),Math.max(5,2.2*s),0,6.3);g.fill();g.stroke()}
  /* places */
  const R=Math.max(9,Math.min(17,s*2.6)),labels=s>5.5;g.textAlign='center';g.textBaseline='middle';
  for(const p of pts){const x=X(p.x),z=Z(p.z+(p.c!=='home'&&Math.abs(p.z)<8&&Math.abs(p.x)<200?(p.z>0?5:-5):0));if(x<-40||z<-40||x>W+40||z>H+40)continue;const cc=CAT[p.c];g.fillStyle=cc.c;g.strokeStyle=p===M.sel?'#fff':'#000c';g.lineWidth=p===M.sel?4:2.5;g.beginPath();g.arc(x,z,R,0,6.3);g.fill();g.stroke();g.font=Math.round(R*1.05)+'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';g.fillStyle='#000';g.fillText(p.ic,x,z+1);
   if(labels||p===M.sel){g.font='bold 11px ui-monospace,monospace';g.fillStyle='#fff';g.strokeStyle='#000';g.lineWidth=3;g.strokeText(p.n,x,z+R+9);g.fillText(p.n,x,z+R+9)}}
  /* you */
  const t=play();if(GS.onFoot&&!GS.inside){g.fillStyle='#4af';g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.arc(X(GS.x),Z(GS.z),Math.max(5,1.8*s),0,6.3);g.fill();g.stroke()}
  g.save();g.translate(X(t.x),Z(t.z));{const ps=GS.inside||GS.onFoot?P.psi:GS.psi;g.rotate(Math.atan2(-Math.cos(ps),Math.sin(ps)))}const q=Math.max(9,Math.min(16,4+s*2));g.fillStyle='#fff';g.strokeStyle='#d00';g.lineWidth=2.5;g.beginPath();g.moveTo(q,0);g.lineTo(-q*.7,-q*.6);g.lineTo(-q*.45,0);g.lineTo(-q*.7,q*.6);g.closePath();g.fill();g.stroke();g.restore();
  /* scale bar */
  g.fillStyle='#fff';g.strokeStyle='#000';g.lineWidth=3;g.font='bold 11px ui-monospace,monospace';g.textAlign='left';const sbL=50*s,sx=W-sbL-16,sy=H-40;g.fillStyle='#000a';g.fillRect(sx-4,sy-14,sbL+8,22);g.fillStyle='#fff';g.fillRect(sx,sy+2,sbL,3);g.fillText('50 m',sx,sy-4);
  g.textAlign='left';g.fillText('N ↑',W-44,70)};
 draw()}
function close(){if(!OVR)return;cancelAnimationFrame(OVR.raf);removeEventListener('keydown',OVR.kd,true);removeEventListener('resize',OVR.rs);OVR.ov.remove();OVR=null;busy=0}
function CIN_ON(){return !!(window.AIRPORT&&AIRPORT.CIN&&AIRPORT.CIN.on)}
{const m=document.getElementById('mm');m.style.cursor='pointer';m.style.pointerEvents='auto';m.addEventListener('click',e=>{e.stopPropagation();open()});
 addEventListener('keydown',e=>{if((e.key==='m'||e.key==='M')&&!OVR&&!e.repeat&&!e.ctrlKey&&!e.metaKey){const t=e.target;if(t&&/INPUT|TEXTAREA/.test(t.tagName))return;open()}})}
window.FMAP={open,close};
})();
