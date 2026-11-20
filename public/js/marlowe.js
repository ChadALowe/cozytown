/* ===== MARLOWE CITY: an island city on the river Marle, east of the airport. Replaces the old grid in airfields.js.
   Layout (local u = east/west, v = north/south, world = ox+u, oz+v):
     airport (u > -217) | east bank: downtown towers, midtown offices, docks, north apartments | the river Marle with 3 bridges |
     west bank: Old Town (cathedral, town hall, High Street) and Westbank townhouses, park and arena.
   Roads are at G0, pavements/blocks are real 15 cm kerbs (hAt knows them), water is -3 (you can't drive into the river).
   Dynamic parts (traffic, walkers, minimap, valet car, night lights) are in marlowe2.js. ===== */
(function(){
const A=window.AIRPORT,AF=window.AIRFIELDS,M=AF.MARL,OX=M.ox,OZ=M.oz,Y=G0,TAU=Math.PI*2,KH=.15,chunk=A.chunk;
M.reg=[-1330,300,-740,1140];
let rs=9187;const rnd=()=>(rs=(rs*16807)%2147483647)/2147483647,rr=(a,b)=>a+rnd()*(b-a),pick=a=>a[(rnd()*a.length)|0];
const hsh=(a,b,c)=>{let h=(a*374761393+b*668265263+(c||0)*1274126177)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296};
const W=(u,v)=>[OX+u,OZ+v];
/* ------------------------------------------------------------------ the plan */
const LAND={u0:-1250,u1:70,v0:-650,v1:1050},RIV={u0:-768,u1:-692};
const NS=[[-225,16,'TERMINAL ROAD'],[-320,14,'CANNON STREET'],[-420,26,"KING'S AVENUE"],[-520,14,'REGENT ROW'],[-610,14,'MERCHANT STREET'],[-678,14,'EAST EMBANKMENT'],
 [-782,14,'WEST EMBANKMENT'],[-870,14,'CHURCH STREET'],[-960,20,'HIGH STREET'],[-1050,14,"QUEEN'S ROAD"],[-1140,14,'PARK LANE'],[-1228,14,'COAST ROAD']].map(([u,w,n],i)=>({i,u,w,h:w/2,n,ax:0}));
const EW=[[-628,14,'SOUTH QUAY'],[-520,14,'MILL STREET'],[-410,14,'ROPE WALK'],[-300,14,'CHAPEL STREET'],[-200,28,'AIRPORT WAY'],[-90,14,'STATION ROAD'],[20,14,'MARKET STREET'],[130,14,'CASTLE STREET'],
 [240,20,'MARLOWE ROAD'],[350,14,'ALBERT STREET'],[460,14,'VICTORIA STREET'],[570,14,'GEORGE STREET'],[680,14,'CROWN STREET'],[790,20,'NORTH ROAD'],[900,14,'ARENA WAY'],[1028,14,'NORTH QUAY']].map(([v,w,n],j)=>({j,v,w,h:w/2,n,ax:1}));
const BRIDGE=new Set([4,8,13]),REM=new Set(['n9_14','e10_9']);
const nsEdge=(i,j)=>i>=0&&i<12&&j>=0&&j<15&&!REM.has('n'+i+'_'+j);
const ewEdge=(j,i)=>j>=0&&j<16&&i>=0&&i<11&&(i!==5||BRIDGE.has(j))&&!REM.has('e'+j+'_'+i);
const lanes=r=>r.w>=26?[3.2,6.6]:r.w>=20?[3.4]:[3.0];
const BUSR=new Set(['n2','e4','n8','e8']);                                       /* roads with a bus lane / bus stops */
const SHOPST=new Set(['n8','n7','e4','e6','e8','n2','e13']);                       /* shopping streets: shopfronts on the ground floor */
const pw=r=>r.w>=20?6:4.5;                                                         /* pavement width */
const NODE=[];for(let i=0;i<12;i++){NODE[i]=[];for(let j=0;j<16;j++){const d=[nsEdge(i,j),nsEdge(i,j-1),ewEdge(j,i-1),ewEdge(j,i)];NODE[i][j]={i,j,u:NS[i].u,v:EW[j].v,ex:d,deg:d.filter(Boolean).length,lights:d.every(Boolean)}}}
/* blocks */
let BLK=[];
for(const c of[0,1,2,3,4,6,7,8,9,10])for(let r=0;r<15;r++){const E=NS[c],Wr=NS[c+1];BLK.push({c,r,u0:Wr.u+Wr.h,u1:E.u-E.h,v0:EW[r].v+EW[r].h,v1:EW[r+1].v-EW[r+1].h,se:E,sw:Wr,ss:EW[r],sn:EW[r+1]})}
const bget=(c,r)=>BLK.find(b=>b.c===c&&b.r===r);
function merge(a,b){const m=Object.assign({},a,{u0:Math.min(a.u0,b.u0),u1:Math.max(a.u1,b.u1),v0:Math.min(a.v0,b.v0),v1:Math.max(a.v1,b.v1)});if(b.u1>a.u1)m.se=b.se;if(b.u0<a.u0)m.sw=b.sw;if(b.v1>a.v1)m.sn=b.sn;if(b.v0<a.v0)m.ss=b.ss;BLK=BLK.filter(x=>x!==a&&x!==b);BLK.push(m);return m}
const ARENA=merge(bget(8,14),bget(9,14));ARENA.sp='arena';
const PARKW=merge(bget(9,9),bget(9,10));PARKW.sp='parkw';
bget(4,9).sp='parke';bget(1,4).sp='station';bget(2,10).sp='skytower';bget(7,6).sp='cathedral';bget(8,5).sp='townhall';bget(7,7).sp='square';
function district(b){const u=(b.u0+b.u1)/2,v=(b.v0+b.v1)/2;if(u>-685){if(Math.hypot(u+470,(v-470)*.85)<330)return'down';if(v<-300)return'docks';if(v>790)return'north';return'mid'}return(v>-300&&v<350)?'old':'west'}
BLK.forEach(b=>b.d=district(b));
/* raised (kerbed) areas: blocks, promenades, coast strips, medians, the airport plaza; water: ponds */
const RAISE=[],WATER=[];
for(const b of BLK)RAISE.push(b);
const strip=(u0,u1,v0,v1,k)=>{const o={u0,u1,v0,v1,k:k||'pav'};RAISE.push(o);return o};
const brSpan=j=>[EW[j].v-EW[j].h,EW[j].v+EW[j].h];
for(const[u0,u1]of[[-692,-685],[-775,-768]]){let v=LAND.v0;for(const j of[...BRIDGE].sort((a,b)=>a-b)){const s=brSpan(j);strip(u0,u1,v,s[0],'prom');v=s[1]}strip(u0,u1,v,LAND.v1,'prom')}
strip(-685,-217,LAND.v0,-635,'coast');strip(-1250,-775,LAND.v0,-635,'coast');strip(-685,-217,1035,LAND.v1,'coast');strip(-1250,-775,1035,LAND.v1,'coast');strip(-1250,-1235,-635,1035,'coast');
for(const j of BRIDGE){const e=EW[j];strip(-768,-692,e.v-e.h-4,e.v-e.h,'bridge');strip(-768,-692,e.v+e.h,e.v+e.h+4,'bridge')}
for(let j=0;j<15;j++)if(nsEdge(2,j))strip(-421.2,-418.8,EW[j].v+EW[j].h+4,EW[j+1].v-EW[j+1].h-4,'med');
for(let i=0;i<11;i++)if(i!==5&&ewEdge(4,i))strip(NS[i+1].u+NS[i+1].h+4,NS[i].u-NS[i].h-4,-201.2,-198.8,'med');
const PLAZA=strip(-217,-164,-290,-110,'plaza');
const POND={u0:-1112,u1:-1078,v0:425,v1:495,wat:1};WATER.push(POND);
/* lookup grid for heights */
const RG=new Map(),RGC=40;const rgAdd=o=>{for(let a=Math.floor(o.u0/RGC);a<=Math.floor(o.u1/RGC);a++)for(let b=Math.floor(o.v0/RGC);b<=Math.floor(o.v1/RGC);b++){const k=a*4096+b;let L=RG.get(k);if(!L)RG.set(k,L=[]);L.push(o)}};
WATER.forEach(rgAdd);RAISE.forEach(rgAdd);
const onBridge=v=>{for(const j of BRIDGE){const e=EW[j];if(Math.abs(v-e.v)<e.h+4)return true}return false};
function mh(u,v){if(u<LAND.u0||u>LAND.u1||v<LAND.v0||v>LAND.v1)return -3;if(u>RIV.u0&&u<RIV.u1&&!onBridge(v))return -3;
 const L=RG.get(Math.floor(u/RGC)*4096+Math.floor(v/RGC));if(L)for(const o of L)if(u>=o.u0&&u<=o.u1&&v>=o.v0&&v<=o.v1)return o.wat?-3:Y+KH;return Y}
const inReg=(x,z)=>{const u=x-OX,v=z-OZ;return u>M.reg[0]&&u<M.reg[1]&&v>M.reg[2]&&v<M.reg[3]};
{const h0=hAt;hAt=function(x,z){return inReg(x,z)?mh(x-OX,z-OZ):h0(x,z)}}
/* car-friendly surface: everything flat in the city counts as tarmac */
{const d0=dAt;dAt=function(x,z){return inReg(x,z)?0:d0(x,z)}}
/* ------------------------------------------------------------------ colliders (Marlowe only, spatial hash) */
const CG=new Map(),CGC=16;const cgKey=(a,b)=>a*8192+b;
function cAdd(o){const x0=o.t?o.x-o.r:o.x0,x1=o.t?o.x+o.r:o.x1,z0=o.t?o.z-o.r:o.z0,z1=o.t?o.z+o.r:o.z1;for(let a=Math.floor(x0/CGC);a<=Math.floor(x1/CGC);a++)for(let b=Math.floor(z0/CGC);b<=Math.floor(z1/CGC);b++){const k=cgKey(a,b);let L=CG.get(k);if(!L)CG.set(k,L=[]);L.push(o)}}
const cBox=(u0,u1,v0,v1)=>cAdd({t:0,x0:OX+Math.min(u0,u1),x1:OX+Math.max(u0,u1),z0:OZ+Math.min(v0,v1),z1:OZ+Math.max(v0,v1)});
const cCirc=(u,v,r)=>cAdd({t:1,x:OX+u,z:OZ+v,r});
/* push a circle (x,z,rad) out of everything; returns [x,z,nx,nz,hit] */
function cResolve(x,z,rad){let hit=0,nx=0,nz=0;const seen=new Set();for(let a=Math.floor((x-rad)/CGC);a<=Math.floor((x+rad)/CGC);a++)for(let b=Math.floor((z-rad)/CGC);b<=Math.floor((z+rad)/CGC);b++){const L=CG.get(cgKey(a,b));if(!L)continue;for(const o of L){if(seen.has(o))continue;seen.add(o);
  if(o.t){const dx=x-o.x,dz=z-o.z,d=Math.hypot(dx,dz),r=o.r+rad;if(d<r&&d>1e-4){x+=dx/d*(r-d);z+=dz/d*(r-d);nx+=dx/d;nz+=dz/d;hit=1}}
  else{const cx=Math.max(o.x0,Math.min(x,o.x1)),cz=Math.max(o.z0,Math.min(z,o.z1)),dx=x-cx,dz=z-cz,d=Math.hypot(dx,dz);
   if(d<rad){if(d>1e-4){x+=dx/d*(rad-d);z+=dz/d*(rad-d);nx+=dx/d;nz+=dz/d}else{const e=[x-o.x0,o.x1-x,z-o.z0,o.z1-z],m=Math.min(...e),k=e.indexOf(m);if(k===0){x=o.x0-rad;nx-=1}else if(k===1){x=o.x1+rad;nx+=1}else if(k===2){z=o.z0-rad;nz-=1}else{z=o.z1+rad;nz+=1}}hit=1}}}}
 const l=Math.hypot(nx,nz)||1;return[x,z,nx/l,nz/l,hit]}
/* ------------------------------------------------------------------ textures */
const ANI=Math.min(4,R.capabilities.getMaxAnisotropy?R.capabilities.getMaxAnisotropy():1);
function T2(w,h,fn,o){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=(o&&o.lin)?THREE.LinearFilter:THREE.NearestFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.anisotropy=ANI;t.userData={cv:c};return t}
const FAC=[
 {k:'glass',bw:3.0,fh:3.6,a:'#8cb8d8',b:'#3c6c96',sp:'#2a3e52',mu:'#dfe8ee',n0:'#0e1824',lp:.5},
 {k:'glass',bw:3.0,fh:3.6,a:'#9cd2c8',b:'#2c6a6c',sp:'#22403c',mu:'#d8ece6',n0:'#0c1a1c',lp:.45},
 {k:'ribbon',bw:3.2,fh:3.6,wall:'#e6e4de',wn:'#4c4c52',gl:'#30485c',lp:.5},
 {k:'brick',bw:3.2,fh:3.3,wall:'#9c4c34',mortar:'#7c3c2a',wn:'#3a1e16',mn:'#2c1610',fr:'#f2efe6',gl:'#2c3a48',lp:.4},
 {k:'stucco',bw:3.4,fh:3.5,wall:'#efe7d2',wn:'#4e4a40',fr:'#ffffff',gl:'#2a3644',lp:.4},
 {k:'deco',bw:3.0,fh:3.6,wall:'#d4c29c',pier:'#e6d6b2',wn:'#4a4232',gl:'#28384a',lp:.45},
 {k:'ware',bw:4.0,fh:4.0,wall:'#6a4030',mortar:'#4e2e22',wn:'#2a1a14',mn:'#1e120c',fr:'#2a2a2a',gl:'#3a4850',lp:.35},
 {k:'pastel',bw:3.2,fh:3.2,wall:'#f6f2ea',wn:'#54504a',fr:'#ffffff',gl:'#34404c',lp:.4},
 {k:'apt',bw:3.6,fh:3.2,wall:'#efefea',wn:'#48484c',gl:'#2e4456',lp:.5},
 {k:'glass',bw:3.0,fh:3.8,a:'#6a7682',b:'#1e252e',sp:'#14181c',mu:'#9aa2aa',n0:'#080b10',lp:.4},
 {k:'goth',bw:4.0,fh:6.0,wall:'#cfc6b0',wn:'#48443a',gl:'#2a3444',lp:1},
 {k:'arena',bw:6.0,fh:5.0,wall:'#c8ccd0',wn:'#3a3e44',gl:'#2a3444',lp:.8},
 {k:'station',bw:6.0,fh:7.0,wall:'#d8ccb0',wn:'#4a4436',gl:'#2a3a4c',lp:.9}];
function facTex(k,night){const S=FAC[k];return T2(256,256,g=>{
 const lit=(cx,cy)=>night&&hsh(cx,cy,k*7+3)<S.lp,lc=(cx,cy)=>{const h=hsh(cy+9,cx+5,k);return h<.5?'#ffdc94':h<.8?'#fff0c8':'#d4e8ff'};
 const glass=(x,y,w,h,cx,cy)=>{if(lit(cx,cy)){g.fillStyle=lc(cx,cy);g.fillRect(x,y,w,h);g.fillStyle='rgba(255,255,240,.6)';g.fillRect(x,y,w,Math.max(2,h*.08));if(hsh(cx,cy,99)<.4){g.fillStyle='rgba(120,80,40,.35)';g.fillRect(x,y,w,h*.45)}}
  else{const gr=g.createLinearGradient(x,y,x+w*.6,y+h);gr.addColorStop(0,night?'#1a2430':'#8aa4bc');gr.addColorStop(.45,night?'#121a24':S.gl);gr.addColorStop(1,night?'#0c1218':S.gl);g.fillStyle=gr;g.fillRect(x,y,w,h)}};
 const bricks=(wc,mc)=>{g.fillStyle=wc;g.fillRect(0,0,256,256);for(let y=0;y<256;y+=5){g.fillStyle=mc;g.fillRect(0,y,256,1);for(let x=((y/5)&1)*5;x<256;x+=10)g.fillRect(x,y,1,5)}if(!night)for(let i=0;i<260;i++){g.fillStyle=hsh(i,7,k)<.5?'rgba(0,0,0,.08)':'rgba(255,220,200,.07)';g.fillRect(((hsh(i,1,k)*25)|0)*10,((hsh(i,2,k)*51)|0)*5+1,9,4)}};
 const C4=f=>{for(let cy=0;cy<4;cy++)for(let cx=0;cx<4;cx++)f(cx*64,cy*64,cx,cy)};
 switch(S.k){
 case'glass':{if(!night){const gr=g.createLinearGradient(0,0,256,256);gr.addColorStop(0,S.a);gr.addColorStop(.5,S.b);gr.addColorStop(1,S.a);g.fillStyle=gr;g.fillRect(0,0,256,256);g.fillStyle='rgba(255,255,255,.11)';for(let i=-2;i<7;i++){g.beginPath();g.moveTo(i*64,0);g.lineTo(i*64+36,0);g.lineTo(i*64-64,256);g.lineTo(i*64-100,256);g.fill()}}else{g.fillStyle=S.n0;g.fillRect(0,0,256,256)}
  C4((x,y,cx,cy)=>{if(lit(cx,cy)){g.fillStyle=lc(cx,cy);g.fillRect(x+2,y+1,62,51);g.fillStyle='rgba(255,255,245,.7)';g.fillRect(x+2,y+1,62,3);if(hsh(cx,cy,5)<.35){g.fillStyle='rgba(40,30,20,.3)';for(let s=0;s<6;s++)g.fillRect(x+2,y+8+s*7,62,2)}}
   g.fillStyle=night?'#0a0e14':S.sp;g.fillRect(x,y+52,64,12);g.fillStyle=night?'#1c242e':S.mu;g.fillRect(x,y,2,64);g.fillRect(x+32,y,1,52);g.fillRect(x,y+52,64,1)});break}
 case'ribbon':{g.fillStyle=night?S.wn:S.wall;g.fillRect(0,0,256,256);C4((x,y,cx,cy)=>{for(let s=0;s<4;s++){const lt=night&&hsh(cx*4+s,cy,k)<S.lp;if(lt){g.fillStyle=lc(cx*4+s,cy);g.fillRect(x+s*16,y+16,16,30)}else{const gr=g.createLinearGradient(x,y+16,x,y+46);gr.addColorStop(0,night?'#16202c':'#6a8aa6');gr.addColorStop(1,night?'#0c1218':S.gl);g.fillStyle=gr;g.fillRect(x+s*16,y+16,16,30)}}
   g.fillStyle=night?S.wn:'#d4d2cc';for(let s=0;s<4;s++)g.fillRect(x+s*16,y+16,2,30);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x,y+46,64,2)});break}
 case'brick':case'ware':{bricks(night?S.wn:S.wall,night?S.mn:S.mortar);C4((x,y,cx,cy)=>{if(S.k==='brick'){const wx=x+19,wy=y+12,ww=26,wh=38;g.fillStyle=night?'#6a6458':'#e2d8c6';g.fillRect(wx-3,wy-5,ww+6,5);g.fillRect(wx-2,wy+wh,ww+4,3);g.fillStyle=night?'#8a8a86':S.fr;g.fillRect(wx,wy,ww,wh);glass(wx+3,wy+3,ww-6,wh-6,cx,cy);g.fillStyle=night?'#8a8a86':S.fr;g.fillRect(wx,wy+wh/2-1,ww,2);g.fillRect(wx+ww/2-1,wy,2,wh)}
   else{const wx=x+14,wy=y+14,ww=36,wh=42,r=ww/2;g.fillStyle=night?'#4a3a30':'#a88a70';g.beginPath();g.moveTo(wx-3,wy+wh+2);g.lineTo(wx-3,wy+r);g.arc(wx+r,wy+r,r+3,Math.PI,0);g.lineTo(wx+ww+3,wy+wh+2);g.closePath();g.fill();
    g.save();g.beginPath();g.moveTo(wx,wy+wh);g.lineTo(wx,wy+r);g.arc(wx+r,wy+r,r,Math.PI,0);g.lineTo(wx+ww,wy+wh);g.closePath();g.clip();glass(wx,wy,ww,wh,cx,cy);g.fillStyle=S.fr;for(let q=1;q<4;q++)g.fillRect(wx+q*ww/4-1,wy,2,wh);for(let q=1;q<4;q++)g.fillRect(wx,wy+r+q*(wh-r)/4,ww,2);g.restore()}});break}
 case'stucco':{g.fillStyle=night?S.wn:S.wall;g.fillRect(0,0,256,256);C4((x,y,cx,cy)=>{g.fillStyle=night?'#3a3830':'#dcd2bc';g.fillRect(x,y+60,64,4);const wx=x+21,wy=y+8,ww=22,wh=44;g.fillStyle=night?'#77746c':S.fr;g.fillRect(wx-2,wy-2,ww+4,wh+4);glass(wx+1,wy+1,ww-2,wh-2,cx,cy);g.fillStyle=night?'#77746c':S.fr;g.fillRect(wx,wy+wh*.45,ww,2);
   g.fillStyle='#1a1a1c';g.fillRect(x+15,y+50,34,2);g.fillRect(x+15,y+58,34,1);for(let q=0;q<9;q++)g.fillRect(x+15+q*4,y+50,1,9)});break}
 case'deco':{g.fillStyle=night?S.wn:S.wall;g.fillRect(0,0,256,256);C4((x,y,cx,cy)=>{g.fillStyle=night?'#5a5240':S.pier;g.fillRect(x,y,12,64);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x+11,y,2,64);glass(x+16,y+8,44,44,cx,cy);g.fillStyle=night?'#4a4232':'#b8a680';g.fillRect(x+30,y+8,2,44);g.fillRect(x+45,y+8,2,44);g.fillStyle=night?'#3a3428':'#a8946c';g.fillRect(x+14,y+52,48,12);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(x+18,y+55,40,2)});break}
 case'pastel':{g.fillStyle=night?S.wn:S.wall;g.fillRect(0,0,256,256);C4((x,y,cx,cy)=>{g.fillStyle=night?'#44403a':'#e6e0d4';g.fillRect(x,y+60,64,4);const wx=x+20,wy=y+14,ww=24,wh=34;g.fillStyle=night?'#888':'#ffffff';g.fillRect(wx-3,wy-3,ww+6,wh+6);g.beginPath();g.moveTo(wx-5,wy-4);g.lineTo(wx+ww/2,wy-11);g.lineTo(wx+ww+5,wy-4);g.fill();glass(wx,wy,ww,wh,cx,cy);g.fillStyle=night?'#888':'#ffffff';g.fillRect(wx,wy+wh/2-1,ww,2);g.fillRect(wx+ww/2-1,wy,2,wh)});break}
 case'apt':{g.fillStyle=night?S.wn:S.wall;g.fillRect(0,0,256,256);C4((x,y,cx,cy)=>{glass(x+8,y+6,48,42,cx,cy);g.fillStyle=night?'#2a3038':'#8a98a4';g.fillRect(x+31,y+6,2,42);g.fillStyle=night?'rgba(120,150,170,.25)':'rgba(170,205,225,.55)';g.fillRect(x+4,y+36,56,12);g.fillStyle=night?'#555':'#9a9a96';g.fillRect(x+4,y+35,56,2);g.fillStyle=night?'#3a3a3e':'#c8c8c4';g.fillRect(x,y+48,64,6);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(x,y+54,64,2)});break}
 case'goth':{g.fillStyle=night?S.wn:S.wall;g.fillRect(0,0,256,256);g.fillStyle='rgba(0,0,0,.06)';for(let y=0;y<256;y+=8)g.fillRect(0,y,256,1);
  for(let cx=0;cx<4;cx++)for(let cy=0;cy<2;cy++){const x=cx*64,y=cy*128,wx=x+18,wy=y+22,ww=28,wh=90;g.fillStyle=night?'#2a261e':'#a89c84';g.fillRect(x,y,8,128);g.beginPath();g.moveTo(wx,wy+wh);g.lineTo(wx,wy+20);g.quadraticCurveTo(wx,wy-4,wx+ww/2,wy-14);g.quadraticCurveTo(wx+ww,wy-4,wx+ww,wy+20);g.lineTo(wx+ww,wy+wh);g.closePath();
   const cols=night?['#ffcf6a','#ff7a5a','#7aa8ff','#ffe9a0']:['#2a3a6a','#6a2030','#2a5a4a','#4a3a6a'];g.fillStyle=cols[(cx+cy)%4];g.fill();g.strokeStyle=night?'#3a3020':'#6a604c';g.lineWidth=2;g.stroke();g.fillStyle=night?'rgba(255,240,180,.5)':'rgba(255,255,255,.12)';for(let q=0;q<6;q++)g.fillRect(wx+2,wy+10+q*14,ww-4,1);g.fillRect(wx+ww/2-1,wy-8,2,wh+8)}break}
 case'arena':{g.fillStyle=night?S.wn:S.wall;g.fillRect(0,0,256,256);C4((x,y,cx,cy)=>{g.fillStyle=night?(cy%2?'#ffd890':'#2a3a5a'):(cy%2?'#24384e':'#b8bcc2');g.fillRect(x+6,y+10,52,44);if(cy%2===0){g.fillStyle=['#c8202c','#1d56b8','#e8b020','#2a9a4a'][cx];g.fillRect(x+10,y+16,44,32)}g.fillStyle=night?'#22262c':'#9aa0a8';g.fillRect(x,y,6,64);g.fillRect(x,y+56,64,8)});break}
 case'station':{g.fillStyle=night?S.wn:S.wall;g.fillRect(0,0,256,256);g.fillStyle='rgba(0,0,0,.07)';for(let y=0;y<256;y+=6)g.fillRect(0,y,256,1);for(let cx=0;cx<4;cx++)for(let cy=0;cy<4;cy++){const x=cx*64,y=cy*64,wx=x+14,wy=y+18,ww=36,wh=40,r=18;g.fillStyle=night?'#3a3428':'#b4a684';g.fillRect(x,y,8,64);g.fillRect(x,y+58,64,6);
   g.save();g.beginPath();g.moveTo(wx,wy+wh);g.lineTo(wx,wy+r);g.arc(wx+r,wy+r,r,Math.PI,0);g.lineTo(wx+ww,wy+wh);g.closePath();g.clip();glass(wx,wy,ww,wh,cx,cy);g.fillStyle=night?'#3a3428':'#8a7c60';for(let q=1;q<3;q++)g.fillRect(wx+q*ww/3,wy,2,wh);g.restore()}break}}
},{lin:false})}
/* shopfront atlas: 2 rows x 12 shops (170x128 px each) */
const SHOPN=['THE COFFEE HOUSE','MARLOWE BANK','PHARMACY',"LUIGI'S PIZZA",'BOOKS & CO','FLOWERS','NEWSAGENT','FISH & CHIPS','BAKERY','BARBER','THE CROWN','SUSHI BAR','TAILOR','JEWELLER','ESTATE AGENT','BURGER BAR','DELI','SHOES','GADGETS','WINE BAR','TEA ROOM','NOODLES','RECEPTION','MARLOWE HOUSE'];
const SHOPC=['#2a4a3a','#1a2a5a','#1a7a4a','#a01a1a','#3a2a5a','#c04a7a','#1a3a7a','#1a4a8a','#a8642a','#2a2a2a','#1e3a26','#e8e8e0','#2a2a3a','#14141a','#5a1a4a','#c8301a','#3a5a2a','#4a2a1a','#1a1a1a','#5a0a1a','#5a8a7a','#d8a020','#2a3440','#2a3440'];
function shopTex(night){return T2(2048,256,g=>{g.fillStyle='#1a1a1a';g.fillRect(0,0,2048,256);SHOPN.forEach((n,i)=>{const x=(i%12)*170,y=(i/12|0)*128,lob=i>=22;
 g.fillStyle=night?'#3a362e':'#d6ccb8';g.fillRect(x,y,170,128);g.fillStyle=night?'#2a2620':'#b8ae9a';g.fillRect(x,y,8,128);g.fillRect(x+162,y,8,128);
 if(!lob){g.fillStyle=SHOPC[i];g.fillRect(x+8,y+6,154,28);g.fillStyle=(i===11)?'#a01a1a':(i===10||i===13||i===19)?'#e8c25a':'#ffffff';if(night){g.shadowColor=g.fillStyle;g.shadowBlur=8}g.font='bold '+(n.length>12?15:18)+'px Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(n,x+85,y+21);g.shadowBlur=0}
 else{g.fillStyle=night?'#2a2a2a':'#3a3a3a';g.fillRect(x+8,y+6,154,20);g.fillStyle=night?'#ffe9a8':'#e8e0c8';g.font='bold 14px Georgia,serif';g.textAlign='center';g.textBaseline='middle';g.fillText(n,x+85,y+16)}
 const wy=y+38,wh=78;const gr=g.createLinearGradient(x,wy,x+60,wy+wh);if(night){gr.addColorStop(0,'#fff2c8');gr.addColorStop(1,'#e8b86a')}else{gr.addColorStop(0,'#9ab4c8');gr.addColorStop(.5,'#3a4e62');gr.addColorStop(1,'#26323e')}g.fillStyle=gr;g.fillRect(x+12,wy,lob?146:104,wh);
 if(!lob){for(let s=0;s<3;s++){g.fillStyle=night?'rgba(80,50,20,.35)':'rgba(255,255,255,.18)';g.fillRect(x+14,wy+20+s*22,100,2);for(let q=0;q<5;q++){g.fillStyle=['#e84a4a','#f0c040','#4a9ae8','#6ac06a','#e8e8e0'][(i+q+s)%5];g.globalAlpha=night?.8:.55;g.fillRect(x+18+q*19,wy+8+s*22,10,11);g.globalAlpha=1}}
  g.fillStyle=night?'#4a3a28':'#2a2a2e';g.fillRect(x+122,wy-2,36,wh+12);g.fillStyle=night?'#ffe0a0':'#6a8aa0';g.fillRect(x+127,wy+4,26,40);g.fillStyle='#c8a040';g.fillRect(x+148,wy+50,3,8)}
 else{g.fillStyle=night?'#a88a50':'#1e2a36';for(let q=1;q<4;q++)g.fillRect(x+12+q*36,wy,2,wh);g.fillStyle='#c8a040';g.fillRect(x+82,wy+40,2,10);g.fillRect(x+86,wy+40,2,10)}
 g.fillStyle=night?'#1a1814':'#3a3630';g.fillRect(x+8,y+116,154,12)})},{lin:false})}
/* sign atlas: street names (white plates) + metro + misc, 512 x 1024, rows of 32 px */
const SIGNS=[...NS.map(r=>r.n),...EW.map(r=>r.n),'MARLOWE METRO','TAXI RANK','BUS STOP'];
const sigRow=n=>SIGNS.indexOf(n);
const signTex=T2(512,1024,g=>{g.fillStyle='#fff';g.fillRect(0,0,512,1024);SIGNS.forEach((n,i)=>{const y=i*32;const metro=n==='MARLOWE METRO',taxi=n==='TAXI RANK',bus=n==='BUS STOP';
 g.fillStyle=metro?'#1d3e8a':taxi?'#1a1a1a':bus?'#c8102e':'#ffffff';g.fillRect(0,y,512,32);g.strokeStyle=metro||taxi||bus?'#ffffff':'#111';g.lineWidth=3;g.strokeRect(3,y+3,506,26);g.fillStyle=metro||bus?'#ffffff':taxi?'#ffd24a':'#111';g.font='bold 22px Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText((metro?'Ⓜ  ':'')+n,256,y+17);if(!metro&&!taxi&&!bus){g.fillStyle='#c8102e';g.font='bold 11px Arial';g.textAlign='right';g.fillText('M1',500,y+24)}})},{lin:true});
/* ------------------------------------------------------------------ geometry stores (per 350 m tile, flushed into chunks) */
function MB(){return{p:[],c:[],u:[],i:[],n:0}}
function bmesh(b,mat){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(b.p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(b.c,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(b.u,2));g.setIndex(b.i);g.computeBoundingSphere();return new THREE.Mesh(g,mat)}
function q4(b,P,UV,C){const k=b.n;for(let q=0;q<4;q++){b.p.push(P[q][0],P[q][1],P[q][2]);b.u.push(UV[q][0],UV[q][1]);const c=C[q];b.c.push(c[0],c[1],c[2])}b.i.push(k,k+1,k+2,k,k+2,k+3);b.n+=4}
const TL=350,TILES=new Map();
function T(u,v){const a=Math.floor((u+1330)/TL),b=Math.floor((v+740)/TL),k=a+'_'+b;let t=TILES.get(k);if(!t){t={k,a,b,f:{},s:MB(),gl:MB(),sg:MB(),o:new Builder(3),p:new Builder(2),mk:new Builder(2),gr:new Builder(3)};TILES.set(k,t)}return t}
const lit=(nx,nz)=>.5+.58*Math.max(0,nx*SUN.x+nz*SUN.z);
const sh=(c,k)=>[c[0]*k,c[1]*k,c[2]*k];
/* a textured facade wall from (u0,v0) to (u1,v1) (outward normal on the right-hand side of travel = (dv,-du)) */
function fwall(t,st,u0,v0,u1,v1,y0,y1,vb,tint,uo,vo){const S=FAC[st],L=Math.hypot(u1-u0,v1-v0);if(L<.05||y1-y0<.05)return;const nb=Math.max(1,Math.round(L/S.bw)),nx=(v1-v0)/L,nz=-(u1-u0)/L,lt=lit(nx,nz)*.98,
 ua=uo+nb/4,ub=uo,va=vo+(y0-vb)/(4*S.fh),vt=vo+(y1-vb)/(4*S.fh),c0=sh(tint,lt*(y0-Y<1?.8:1)),c1=sh(tint,lt);
 const b=t.f[st]||(t.f[st]=MB()),a=W(u0,v0),c=W(u1,v1);q4(b,[[a[0],y0,a[1]],[c[0],y0,c[1]],[c[0],y1,c[1]],[a[0],y1,a[1]]],[[ua,va],[ub,va],[ub,vt],[ua,vt]],[c0,c0,c1,c1])}
/* shopfront row along a wall */
function swall(t,u0,v0,u1,v1,y0,gh,kinds,tint,seed){const L=Math.hypot(u1-u0,v1-v0);if(L<1)return;const n=Math.max(1,Math.round(L/6.5)),nx=(v1-v0)/L,nz=-(u1-u0)/L,lt=lit(nx,nz)*1.02,c0=sh(tint,lt*.85),c1=sh(tint,lt);
 for(let q=0;q<n;q++){const f0=q/n,f1=(q+1)/n,a=W(u0+(u1-u0)*f0,v0+(v1-v0)*f0),c=W(u0+(u1-u0)*f1,v0+(v1-v0)*f1),idx=kinds[(hsh(seed,q,3)*kinds.length)|0],cx=(idx%12)*170/2048,cw=170/2048,row=idx/12|0,vt=row?.5:1,vb_=row?0:.5;
  q4(t.s,[[a[0],y0,a[1]],[c[0],y0,c[1]],[c[0],y0+gh,c[1]],[a[0],y0+gh,a[1]]],[[cx+cw,vb_],[cx,vb_],[cx,vt],[cx+cw,vt]],[c0,c0,c1,c1])}}
const SHOPK=[...Array(22).keys()],LOBK=[22,23];
/* geometry helpers on Builders (vertex coloured, lit by the sun) */
const bx=(B,u,y,v,su,sy,sv,col,rot)=>{const p=W(u,v);pbox(B,p[0],y,p[1],su,sy,sv,col,rot||0)};
const cy_=(B,u,y,v,r,h,sg,col)=>{const p=W(u,v);pcyl(B,p[0],y,p[1],r,h,sg,col)};
const cn=(B,u,y,v,r,h,sg,col,rot)=>{const p=W(u,v);pcone(B,p[0],y,p[1],r,h,sg,col,rot||0)};
const oc=(B,u,y,v,r,col,j)=>{const p=W(u,v);poct(B,p[0],y,p[1],r,r*.9,r,col,j||.25)};
const qz=(B,u0,v0,u1,v1,col,y)=>quadXZ(B,W(u0,v0),W(u1,v0),W(u1,v1),W(u0,v1),col,y);
function vq(B,u0,v0,u1,v1,y0,y1,col,cu,cv){const a=W(u0,v0),b=W(u1,v1),cen=W(cu,cv);const P=[[a[0],y0,a[1]],[b[0],y0,b[1]],[b[0],y1,b[1]],[a[0],y1,a[1]]],cc=[cen[0],(y0+y1)/2,cen[1]];B.tri(P[0],P[1],P[2],col,col,col,false,cc);B.tri(P[0],P[2],P[3],col,col,col,false,cc)}
/* a box between two 3D points (cables, beams) */
function beam(B,a,b,th,col){const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],L=Math.hypot(dx,dy,dz)||1,f=[dx/L,dy/L,dz/L];let up=Math.abs(f[1])>.9?[1,0,0]:[0,1,0];
 let r=[f[1]*up[2]-f[2]*up[1],f[2]*up[0]-f[0]*up[2],f[0]*up[1]-f[1]*up[0]];const rl=Math.hypot(...r);r=r.map(x=>x/rl*th/2);const u=[r[1]*f[2]-r[2]*f[1],r[2]*f[0]-r[0]*f[2],r[0]*f[1]-r[1]*f[0]].map(x=>x/(th/2)*th/2);
 const P=[];for(const e of[a,b])for(const[s1,s2]of[[-1,-1],[1,-1],[1,1],[-1,1]])P.push([e[0]+r[0]*s1+u[0]*s2,e[1]+r[1]*s1+u[1]*s2,e[2]+r[2]*s1+u[2]*s2]);const cen=[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2];
 for(const[i0,i1,i2,i3]of[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]]){B.tri(P[i0],P[i1],P[i2],col,col,col,false,cen);B.tri(P[i0],P[i2],P[i3],col,col,col,false,cen)}}
/* ------------------------------------------------------------------ dynamic-light lists filled while building (used by marlowe2.js) */
const LGLOW=[],LPOOL=[],RLIGHT=[],TLAMP=[[[],[],[]],[[],[],[]]],SIGNQ=[];
/* ------------------------------------------------------------------ street furniture */
const POLE=[.2,.24,.22];
function lamp(u,v,du,dv,dbl){const t=T(u,v),B=t.o,y=Y+KH;bx(B,u,y,v,.16,6.4,.16,POLE);for(const s of dbl?[1,-1]:[1]){const hu=u+du*1.3*s,hv=v+dv*1.3*s;bx(B,u+du*.75*s,y+6.05,v+dv*.75*s,Math.abs(du)>.5?1.5:.4,.24,Math.abs(dv)>.5?1.5:.4,[.9,.88,.78]);
  const p=W(hu,hv);LGLOW.push([p[0],y+5.95,p[1]]);LPOOL.push([p[0],p[1]])}cCirc(u,v,.22)}
const TREEC=[[.2,.42,.18],[.25,.48,.2],[.18,.38,.2],[.3,.5,.22],[.22,.44,.26]];
function tree(u,v,s,grate,park){const t=T(u,v),B=t.o,y=mh(u,v);const h=(park?3.4:5.0)*s;bx(B,u,y,v,.34*s,h+.6,.34*s,[.36,.28,.2],rnd()*3);const c=pick(TREEC);oc(B,u,y+h+1.2*s,v,2.4*s,c,.3);oc(B,u+.7*s,y+h+.3*s,v-.4*s,1.8*s,sh(c,.88),.3);
 if(grate)qz(t.mk,u-.7,v-.7,u+.7,v+.7,[.16,.15,.14],y+.012);cCirc(u,v,.35*s)}
function phoneBox(u,v,ry){const t=T(u,v),B=t.o,y=Y+KH,R_=[.74,.05,.06];bx(B,u,y,v,1.0,2.45,1.0,R_,ry);bx(B,u,y+2.45,v,1.08,.16,1.08,[.62,.04,.05],ry);bx(B,u,y+2.61,v,.8,.1,.8,[.62,.04,.05],ry);bx(B,u,y+.9,v,1.03,1.25,.86,[.55,.72,.8],ry);bx(B,u,y+.9,v,.86,1.25,1.03,[.55,.72,.8],ry);bx(B,u,y+2.22,v,1.04,.16,.6,[.96,.96,.9],ry);bx(B,u,y+2.22,v,.6,.16,1.04,[.96,.96,.9],ry);cBox(u-.55,u+.55,v-.55,v+.55)}
function postBox(u,v){const t=T(u,v),B=t.o,y=Y+KH;cy_(B,u,y,v,.28,1.25,10,[.78,.06,.06]);cy_(B,u,y+1.25,v,.32,.12,10,[.7,.05,.05]);bx(B,u,y+.95,v,.3,.05,.6,[.1,.1,.1]);cCirc(u,v,.32)}
function bin(u,v){const t=T(u,v);cy_(t.o,u,Y+KH,v,.26,.95,8,[.12,.24,.16]);cCirc(u,v,.28)}
function bench(u,v,alongU){const t=T(u,v),B=t.o,y=Y+KH,su=alongU?1.8:.5,sv=alongU?.5:1.8;bx(B,u,y+.42,v,su,.08,sv,[.48,.32,.2]);bx(B,u+(alongU?0:.22),y+.5,v+(alongU?.22:0),alongU?1.8:.06,.45,alongU?.06:1.8,[.48,.32,.2]);for(const s of[-.75,.75])bx(B,u+(alongU?s:0),y,v+(alongU?0:s),.08,.45,.08,[.15,.15,.16]);cBox(u-su/2,u+su/2,v-sv/2,v+sv/2)}
function shelter(u,v,du,dv){const t=T(u,v),B=t.o,y=Y+KH,al=Math.abs(du)<.5;const su=al?1.4:4,sv=al?4:1.4;bx(B,u,y+2.4,v,su+.2,.12,sv+.2,[.2,.22,.24]);for(const a of[-1,1])for(const b of[-1,1])bx(B,u+(al?a*.65:a*1.9),y,v+(al?b*1.9:b*.65),.08,2.4,.08,[.25,.27,.3]);
 const bu=u-du*.65,bv=v-dv*.65;const gq=t.gl,a=W(bu-(al?0:2),bv-(al?2:0)),c=W(bu+(al?0:2),bv+(al?2:0));const col=[.7,.85,.95];q4(gq,[[a[0],y+.2,a[1]],[c[0],y+.2,c[1]],[c[0],y+2.3,c[1]],[a[0],y+2.3,a[1]]],[[0,0],[1,0],[1,1],[0,1]],[col,col,col,col]);
 bx(B,u-du*.4,y+.45,v-dv*.4,al?.4:3,.06,al?3:.4,[.3,.3,.32]);cBox(bu-(al?.15:2),bu+(al?.15:2),bv-(al?2:.15),bv+(al?2:.15));
 const fu=u+du*.2+(al?0:2.6),fv=v+dv*.2+(al?2.6:0);cy_(B,fu,y,fv,.05,3,5,[.3,.3,.32]);signPlate(fu,fv,y+2.6,'BUS STOP',1.1,.32,al?0:Math.PI/2)}
function belisha(u,v){const t=T(u,v),B=t.o,y=Y+KH;for(let k=0;k<6;k++)cy_(B,u,y+k*.45,v,.07,.45,6,k%2?[.08,.08,.08]:[.95,.95,.95]);oc(B,u,y+2.95,v,.26,[1,.62,.12],.05);const p=W(u,v);LGLOW.push([p[0],y+2.95,p[1],1]);cCirc(u,v,.15)}
/* a sign plate from the atlas, double-sided; ry = rotation about Y (0: plate faces +v/-v) */
function signPlate(u,v,yc,name,w,h,ry){const t=T(u,v),row=sigRow(name);if(row<0)return;const v0=1-(row+1)*32/1024,v1=1-row*32/1024,c=Math.cos(ry),s=Math.sin(ry),p=W(u,v),hw=w/2,col=[1,1,1];
 const P=(a,b,dd)=>[p[0]+a*c+dd*s,yc+b,p[1]-a*s+dd*c];q4(t.sg,[P(-hw,-h/2,.05),P(hw,-h/2,.05),P(hw,h/2,.05),P(-hw,h/2,.05)],[[0,v0],[1,v0],[1,v1],[0,v1]],[col,col,col,col]);q4(t.sg,[P(hw,-h/2,-.05),P(-hw,-h/2,-.05),P(-hw,h/2,-.05),P(hw,h/2,-.05)],[[0,v0],[1,v0],[1,v1],[0,v1]],[col,col,col,col]);
 bx(t.o,u,yc-h/2-.02,v,Math.abs(c)*(w+.06)+Math.abs(s)*.06,h+.04,Math.abs(s)*(w+.06)+Math.abs(c)*.06,[.15,.15,.15])}
function streetSign(u,v,name,ry,n2){const t=T(u,v);cy_(t.o,u,Y+KH,v,.05,n2?2.75:2.3,5,[.18,.18,.18]);signPlate(u,v,Y+KH+2.05,name,2.6,.34,ry);if(n2)signPlate(u,v,Y+KH+2.5,n2,2.6,.34,ry+Math.PI/2);cCirc(u,v,.1)}
/* traffic signal: pole on the corner, head facing (fu,fv) = towards approaching traffic; axis 0 = NS traffic, 1 = EW traffic */
function signal(u,v,fu,fv,ax){const t=T(u,v),B=t.o,y=Y+KH;bx(B,u,y,v,.16,3.3,.16,[.14,.14,.15]);bx(B,u,y+2.3,v,.34,1.0,.34,[.06,.06,.07]);cCirc(u,v,.18);
 const p=W(u+fu*.18,v+fv*.18),ru=fv,rv=-fu;for(let k=0;k<3;k++){const yc=y+3.0-k*.32,q=[[p[0]-ru*.11*1,yc-.11,p[1]+(-rv)*.11*-1]];const a=[p[0]-ru*.11,yc-.11,p[1]-rv*.11],b=[p[0]+ru*.11,yc-.11,p[1]+rv*.11],c=[p[0]+ru*.11,yc+.11,p[1]+rv*.11],d=[p[0]-ru*.11,yc+.11,p[1]-rv*.11];TLAMP[ax][k].push(a,b,c,d)}}
/* static parked car (cheap: 8 boxes) */
function parked(u,v,ry,col,cab){const t=T(u,v),B=t.o,p=W(u,v),c=Math.cos(ry),s=Math.sin(ry),E=(lx,ly,lz,sx,sy,sz,cc)=>pbox(B,p[0]+lx*c+lz*s,Y+ly,p[1]-lx*s+lz*c,sx,sy,sz,cc,ry);
 E(0,.3,0,1.76,.6,4.3,col);E(0,.9,-.25,1.56,cab?.72:.56,2.2,[.16,.2,.26]);if(cab){E(0,1.62,-.25,1.6,.07,2.3,col);E(0,1.69,.2,.56,.17,.24,[1,.82,.15])}for(const z of[1.35,-1.35])E(0,.04,z,1.84,.5,.66,[.06,.06,.07]);
 const h=1.3;cAdd({t:1,x:p[0]+h*s,z:p[1]+h*c,r:.95});cAdd({t:1,x:p[0]-h*s,z:p[1]-h*c,r:.95})}
const CARC=[[.7,.08,.08],[.12,.22,.5],[.86,.86,.88],[.1,.1,.12],[.5,.52,.56],[.2,.4,.28],[.85,.7,.2],[.36,.18,.12],[.9,.9,.9],[.15,.15,.18]];
/* ------------------------------------------------------------------ buildings */
const ROOFS=[[.34,.35,.38],[.42,.42,.44],[.5,.48,.45],[.3,.3,.32],[.38,.46,.34],[.46,.44,.4]],ROOF=[.42,.42,.44],STONE=[.86,.82,.74],SLATE=[.3,.32,.37],TILE=[.52,.3,.22];
const PAST=[[1,.84,.84],[.84,.92,1],[.88,1,.86],[1,.96,.78],[.94,.86,1],[1,.9,.8],[.82,.96,.96]];
const wallRGB=(st,t,k)=>{const h=FAC[st].wall||'#c0c0c0',n=parseInt(h.slice(1),16);return[(n>>16&255)/255*t[0]*k,(n>>8&255)/255*t[1]*k,(n&255)/255*t[2]*k]};
const tintOf=st=>st===7?pick(PAST):[.92+rnd()*.14,.92+rnd()*.14,.92+rnd()*.14];
/* b: {u0,u1,v0,v1,y0,st,fl,gh,shop:{s,e,n,w},tint,roof,ridge('u'|'v'),crown,lob} */
function building(b){const t=T((b.u0+b.u1)/2,(b.v0+b.v1)/2),S=FAC[b.st],y0=b.y0==null?Y+KH:b.y0,gh=b.gh||0,top=y0+gh+b.fl*S.fh,tint=b.tint||tintOf(b.st),uo=((rnd()*4)|0)/4,vo=((rnd()*4)|0)/4,vb=y0+gh,seed=(rnd()*1e6)|0;
 const sides=[['s',b.u0,b.v0,b.u1,b.v0],['e',b.u1,b.v0,b.u1,b.v1],['n',b.u1,b.v1,b.u0,b.v1],['w',b.u0,b.v1,b.u0,b.v0]];
 for(const[k,a0,c0,a1,c1]of sides){if(gh>0){if(b.shop&&b.shop[k])swall(t,a0,c0,a1,c1,y0,gh,b.lob?LOBK:SHOPK,[1,1,1],seed+k.charCodeAt(0));else fwall(t,b.st,a0,c0,a1,c1,y0,y0+gh,y0+gh-4*S.fh,tint,uo,vo)}fwall(t,b.st,a0,c0,a1,c1,y0+gh,top,vb,tint,uo,vo)}
 if(gh>0){/* ground-floor band + fascia ledge */const L=.28;bx(t.o,(b.u0+b.u1)/2,y0+gh-.05,(b.v0+b.v1)/2,b.u1-b.u0+L,.3,b.v1-b.v0+L,b.st===9||b.st<=1?[.2,.22,.25]:STONE)}
 /* awnings on some shops */
 if(b.shop&&gh>0&&b.awn!==0)for(const[k,a0,c0,a1,c1]of sides){if(!b.shop[k]||rnd()<.45)continue;const L=Math.hypot(a1-a0,c1-c0),n=Math.max(1,Math.round(L/6.5)),nx=(c1-c0)/L,nz=-(a1-a0)/L;for(let q=0;q<n;q++){if(hsh(seed,q,7)<.5)continue;const f=(q+.5)/n,cu=a0+(a1-a0)*f+nx*.7,cv=c0+(c1-c0)*f+nz*.7,ac=pick([[.6,.1,.12],[.12,.36,.2],[.15,.2,.45],[.85,.85,.8],[.2,.2,.22]]);bx(t.o,cu,y0+3.05,cv,Math.abs(nx)>.5?1.4:L/n-.9,.12,Math.abs(nz)>.5?1.4:L/n-.9,ac)}}
 /* roof */
 const cu=(b.u0+b.u1)/2,cv=(b.v0+b.v1)/2,wu=b.u1-b.u0,wv=b.v1-b.v0;
 if(b.roof==='pitch'){const rh=Math.min(wu,wv)*.38,col=b.rc||SLATE,cen=[...W(cu,cv)];const P=(u,yy,v)=>{const p=W(u,v);return[p[0],yy,p[1]]};const cc=[cen[0],top-1,cen[1]];
  if(b.ridge==='u'){const a=P(b.u0,top,b.v0),c=P(b.u1,top,b.v0),d=P(b.u1,top+rh,cv),e=P(b.u0,top+rh,cv),f=P(b.u1,top,b.v1),g2=P(b.u0,top,b.v1);t.o.tri(a,c,d,col,col,col,false,cc);t.o.tri(a,d,e,col,col,col,false,cc);t.o.tri(g2,f,d,col,col,col,false,cc);t.o.tri(g2,d,e,col,col,col,false,cc);const gc=wallRGB(b.st,tint,.82);t.o.tri(a,g2,e,gc,gc,gc,false,cc);t.o.tri(c,f,d,gc,gc,gc,false,cc);
   for(const s of[-1,1])bx(t.o,cu+s*(wu/2-1),top+rh*.6,cv,.7,rh*.5+1.2,1.0,[.5,.3,.24])}
  else{const a=P(b.u0,top,b.v0),c=P(b.u0,top,b.v1),d=P(cu,top+rh,b.v1),e=P(cu,top+rh,b.v0),f=P(b.u1,top,b.v1),g2=P(b.u1,top,b.v0);t.o.tri(a,c,d,col,col,col,false,cc);t.o.tri(a,d,e,col,col,col,false,cc);t.o.tri(g2,f,d,col,col,col,false,cc);t.o.tri(g2,d,e,col,col,col,false,cc);const gc=wallRGB(b.st,tint,.72);t.o.tri(a,g2,e,gc,gc,gc,false,cc);t.o.tri(c,f,d,gc,gc,gc,false,cc);
   for(const s of[-1,1])bx(t.o,cu,top+rh*.6,cv+s*(wv/2-1),1.0,rh*.5+1.2,.7,[.5,.3,.24])}}
 else{const pc=b.st<=1||b.st===9?[.55,.6,.66]:b.st===2||b.st===8?[.82,.82,.8]:STONE;
  qz(t.o,b.u0,b.v0,b.u1,b.v1,pick(ROOFS),top+.04);vq(t.o,b.u0,b.v0,b.u1,b.v0,top,top+.9,pc,cu,cv);vq(t.o,b.u1,b.v0,b.u1,b.v1,top,top+.9,pc,cu,cv);vq(t.o,b.u1,b.v1,b.u0,b.v1,top,top+.9,pc,cu,cv);vq(t.o,b.u0,b.v1,b.u0,b.v0,top,top+.9,pc,cu,cv);
  if((b.st===3||b.st===4||b.st===5)&&wu*wv>150)bx(t.o,cu,top-.35,cv,wu+.5,.35,wv+.5,pc);
  if(!b.noClutter){const n=Math.min(3,(wu*wv/400)|0);for(let q=0;q<n;q++)bx(t.o,cu+rr(-wu/3,wu/3),top,cv+rr(-wv/3,wv/3),rr(1.5,3),rr(1,2),rr(1.5,3),[.62,.63,.65]);
   if(b.st===6||(b.wt&&rnd()<.7)){const wu_=cu+rr(-wu/4,wu/4),wv_=cv+rr(-wv/4,wv/4);for(const[a,c]of[[-1,-1],[1,-1],[1,1],[-1,1]])bx(t.o,wu_+a*1.3,top,wv_+c*1.3,.15,3,.15,[.25,.2,.16]);cy_(t.o,wu_,top+3,wv_,1.8,3.2,10,[.46,.34,.24]);cn(t.o,wu_,top+6.2,wv_,2.0,1.4,10,[.3,.24,.2])}}}
 if(b.crown)crown(t,b,top);
 cBox(b.u0,b.u1,b.v0,b.v1);return top}
function crown(t,b,top){const cu=(b.u0+b.u1)/2,cv=(b.v0+b.v1)/2,wu=b.u1-b.u0,wv=b.v1-b.v0,B=t.o;
 switch(b.crown){case'heli':{cy_(B,cu,top+.9,cv,Math.min(wu,wv)*.36,.3,16,[.3,.32,.34]);const p=W(cu,cv),r=Math.min(wu,wv)*.2;bx(B,cu-r*.4,top+1.2,cv,.8,.04,r*1.6,[.95,.95,.9]);bx(B,cu+r*.4,top+1.2,cv,.8,.04,r*1.6,[.95,.95,.9]);bx(B,cu,top+1.2,cv,r*.8,.04,.6,[.95,.95,.9]);RLIGHT.push([p[0],top+1.4,p[1]]);break}
  case'spire':{bx(B,cu,top,cv,wu*.5,4,wv*.5,[.6,.64,.7]);cn(B,cu,top+4,cv,Math.min(wu,wv)*.25,18,4,[.7,.74,.78],Math.PI/4);cy_(B,cu,top+22,cv,.25,14,5,[.8,.8,.82]);const p=W(cu,cv);RLIGHT.push([p[0],top+36,p[1]]);break}
  case'pyr':{cn(B,cu,top+.9,cv,Math.min(wu,wv)*.62,Math.min(wu,wv)*.55,4,[.52,.56,.6],Math.PI/4);break}
  case'mast':{bx(B,cu,top,cv,6,3,6,[.55,.56,.58]);cy_(B,cu,top+3,cv,.3,20,5,[.75,.75,.78]);const p=W(cu,cv);RLIGHT.push([p[0],top+23,p[1]]);break}
  case'crownbox':{bx(B,cu,top,cv,wu*.8,5,wv*.8,[.62,.66,.72]);bx(B,cu,top+5,cv,wu*.55,4,wv*.55,[.7,.74,.8]);const p=W(cu,cv);RLIGHT.push([p[0],top+9.5,p[1]]);break}}}
/* perimeter lots for terraces / mid-rise blocks */
function lots(iu0,iu1,iv0,iv1,dp,w0,w1){const out=[],Wd=iu1-iu0,Dd=iv1-iv0;dp=Math.min(dp,Wd/2,Dd/2);
 const split=(a,b)=>{const r=[];let x=a;while(b-x>w1){const w=rr(w0,w1);r.push([x,x+w]);x+=w}if(b-x>0){if(r.length&&b-x<w0*.6)r[r.length-1][1]=b;else r.push([x,b])}return r};
 out.push({u0:iu0,u1:iu0+dp,v0:iv0,v1:iv0+dp,f:'sw'},{u0:iu1-dp,u1:iu1,v0:iv0,v1:iv0+dp,f:'se'},{u0:iu1-dp,u1:iu1,v0:iv1-dp,v1:iv1,f:'ne'},{u0:iu0,u1:iu0+dp,v0:iv1-dp,v1:iv1,f:'nw'});
 if(iu1-iu0>2*dp+1)for(const[a,b]of split(iu0+dp,iu1-dp)){out.push({u0:a,u1:b,v0:iv0,v1:iv0+dp,f:'s'},{u0:a,u1:b,v0:iv1-dp,v1:iv1,f:'n'})}
 if(iv1-iv0>2*dp+1)for(const[a,b]of split(iv0+dp,iv1-dp)){out.push({u0:iu0,u1:iu0+dp,v0:a,v1:b,f:'w'},{u0:iu1-dp,u1:iu1,v0:a,v1:b,f:'e'})}
 return out}
const isShopRoad=r=>SHOPST.has((r.ax?'e':'n')+(r.ax?r.j:r.i));
function inner(b){return[b.u0+pw(b.sw),b.u1-pw(b.se),b.v0+pw(b.ss),b.v1-pw(b.sn)]}
/* towers for downtown */
function towers(b){const[iu0,iu1,iv0,iv1]=inner(b),wu=iu1-iu0,wv=iv1-iv0,cu=(iu0+iu1)/2,cv=(iv0+iv1)/2,core=Math.max(0,1-Math.hypot(cu+470,(cv-470)*.85)/340);
 const nu=wu>70?2:1,nv=wv>70?2:1;const pu=wu/nu,pv=wv/nv;
 for(let a=0;a<nu;a++)for(let c=0;c<nv;c++){const u0=iu0+a*pu+(a?2:0),u1=iu0+(a+1)*pu-(a<nu-1?2:0),v0=iv0+c*pv+(c?2:0),v1=iv0+(c+1)*pv-(c<nv-1?2:0);
  const st=pick([0,0,1,9,9,2,5]),H=30+Math.pow(core,1.3)*160*rr(.6,1.15)+rr(0,25),S=FAC[st],shop={s:Math.abs(v0-iv0)<1,n:Math.abs(v1-iv1)<1,w:Math.abs(u0-iu0)<1,e:Math.abs(u1-iu1)<1};
  /* podium */
  const pst=st===5?5:pick([5,2,4]),pfl=2;const ptop=building({u0,u1,v0,v1,st:pst,fl:pfl,gh:4.5,shop,lob:rnd()<.35,noClutter:1,awn:0});
  const m=rr(2.5,6),tu0=u0+m,tu1=u1-m,tv0=v0+m,tv1=v1-m;if(tu1-tu0<10||tv1-tv0<10)continue;
  const fl=Math.max(6,Math.round((H-ptop+Y)/S.fh));
  if(rnd()<.18&&Math.abs((tu1-tu0)-(tv1-tv0))<12)cylTower(st,(tu0+tu1)/2,(tv0+tv1)/2,Math.min(tu1-tu0,tv1-tv0)/2,ptop,fl);
  else{const tiers=fl>30?3:fl>18?2:1;let y=ptop,f0=Math.round(fl/tiers),k=1,uu0=tu0,uu1=tu1,vv0=tv0,vv1=tv1,tp=y;
   for(let q=0;q<tiers;q++){const ff=q===tiers-1?fl-f0*(tiers-1):f0;const last=q===tiers-1;tp=building({u0:uu0,u1:uu1,v0:vv0,v1:vv1,y0:y,st,fl:ff,gh:0,crown:last?pick(['heli','spire','pyr','mast','crownbox',null]):null,noClutter:!last});y=tp;const s=rr(.12,.2);const du=(uu1-uu0)*s,dv=(vv1-vv0)*s;uu0+=du;uu1-=du;vv0+=dv;vv1-=dv}}}}
function cylTower(st,cu,cv,r,y0,fl){const t=T(cu,cv),S=FAC[st],n=20,top=y0+fl*S.fh,tint=[1,1,1],circ=TAU*r,nb=Math.round(circ/S.bw);
 for(let k=0;k<n;k++){const a0=k/n*TAU,a1=(k+1)/n*TAU,u0=cu+Math.cos(a0)*r,v0=cv+Math.sin(a0)*r,u1=cu+Math.cos(a1)*r,v1=cv+Math.sin(a1)*r;
  const b=t.f[st]||(t.f[st]=MB()),A_=W(u0,v0),C_=W(u1,v1),nx=Math.cos((a0+a1)/2),nz=Math.sin((a0+a1)/2),lt=lit(nx,nz),c=sh(tint,lt),ua=k/n*nb/4,ub=(k+1)/n*nb/4,vt=fl/4;
  q4(b,[[C_[0],y0,C_[1]],[A_[0],y0,A_[1]],[A_[0],top,A_[1]],[C_[0],top,C_[1]]],[[ua,0],[ub,0],[ub,vt],[ua,vt]],[c,c,c,c])}
 cy_(t.o,cu,top,cv,r*1.02,1.2,n,[.55,.6,.66]);cy_(t.o,cu,top+1.2,cv,r*.7,3,n,[.62,.66,.72]);cy_(t.o,cu,top+4.2,cv,.4,16,5,[.8,.8,.82]);const p=W(cu,cv);RLIGHT.push([p[0],top+20.5,p[1]]);cCirc(cu,cv,r)}
/* perimeter blocks (mid-rise, terraces, warehouses, apartments) */
function perim(b,o){const[iu0,iu1,iv0,iv1]=inner(b);const L=lots(iu0,iu1,iv0,iv1,o.dp,o.w0,o.w1);
 for(const l of L){const st=typeof o.st==='function'?o.st(l):pick(o.st),fs=o.fl[0]+((rnd()*(o.fl[1]-o.fl[0]+1))|0);const shop={};let any=false;
  for(const ch of l.f){const road={s:b.ss,n:b.sn,e:b.se,w:b.sw}[ch];if(o.shops==='all'||(o.shops&&isShopRoad(road))){shop[ch]=1;any=true}}
  const pitch=o.pitch&&rnd()<o.pitch&&l.f.length===1;
  building({u0:l.u0,u1:l.u1,v0:l.v0,v1:l.v1,st,fl:fs-(any?0:0),gh:any?4.5:0,shop:any?shop:null,lob:o.lob&&rnd()<o.lob,roof:pitch?'pitch':null,ridge:(l.f==='s'||l.f==='n')?'u':'v',rc:rnd()<.3?TILE:SLATE,wt:o.wt})}
 /* courtyard floor */
 const t=T((iu0+iu1)/2,(iv0+iv1)/2);qz(t.o,iu0+o.dp-1,iv0+o.dp-1,iu1-o.dp+1,iv1-o.dp+1,[.4,.42,.36],Y+KH+.01)}
/* ------------------------------------------------------------------ ground: blocks, kerbs, pavements, grass, plaza */
const PAVC=[.72,.71,.68],KERB=[.62,.62,.6];
function slab(o,top,col,mat){const t=T((o.u0+o.u1)/2,(o.v0+o.v1)/2);qz(mat==='g'?t.gr:t.p,o.u0,o.v0,o.u1,o.v1,col,top);
 const cu=(o.u0+o.u1)/2,cv=(o.v0+o.v1)/2;vq(t.o,o.u0,o.v0,o.u1,o.v0,Y-.05,top,KERB,cu,cv);vq(t.o,o.u1,o.v0,o.u1,o.v1,Y-.05,top,KERB,cu,cv);vq(t.o,o.u1,o.v1,o.u0,o.v1,Y-.05,top,KERB,cu,cv);vq(t.o,o.u0,o.v1,o.u0,o.v0,Y-.05,top,KERB,cu,cv)}
/* ------------------------------------------------------------------ the generator */
let FM=null,SM=null,mPave,mMark,mGlass,mSign,mWater,waterTex;
function mats(){FM=FAC.map((S,k)=>{const d=facTex(k,0),n=facTex(k,1),m=new THREE.MeshBasicMaterial({map:d,vertexColors:true,side:THREE.DoubleSide});m.userData={d,n};return m});
 {const d=shopTex(0),n=shopTex(1);SM=new THREE.MeshBasicMaterial({map:d,vertexColors:true,side:THREE.DoubleSide});SM.userData={d,n}}
 const pv=T2(64,64,(g)=>{g.fillStyle='#b8b6b0';g.fillRect(0,0,64,64);for(let i=0;i<4;i++)for(let j=0;j<4;j++){const v=176+((hsh(i,j,3)*26)|0);g.fillStyle=`rgb(${v},${v-2},${v-6})`;g.fillRect(i*16+1,j*16+1,15,15)}g.fillStyle='rgba(0,0,0,.05)';for(let k=0;k<40;k++)g.fillRect((hsh(k,1)*64)|0,(hsh(k,2)*64)|0,2,2)});
 mPave=wmat(null,{polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1},pv);
 mMark=wmat([1,1,1],{polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-8},roadTex);
 mGlass=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.42,side:THREE.DoubleSide,depthWrite:false});
 mSign=new THREE.MeshBasicMaterial({map:signTex,vertexColors:true,side:THREE.DoubleSide});
 waterTex=T2(128,128,(g)=>{g.fillStyle='#3a6a86';g.fillRect(0,0,128,128);for(let k=0;k<90;k++){const x=hsh(k,3)*128,y=hsh(k,4)*128;g.fillStyle=hsh(k,5)<.5?'rgba(255,255,255,.16)':'rgba(10,40,70,.25)';g.fillRect(x,y,8+hsh(k,6)*14,1.5)}},{lin:true});
 mWater=wmat([.95,1,1.05],{vertexColors:false},waterTex)}
const ROADB=new Builder(2),WATB=new Builder(8),CHUNKS=[];
function* gen(m,c){mats();yield;
 /* sea (under everything), airport grass, asphalt */
 {const b=WATB;quadXZ(b,W(-1330,-2200),W(1800,-2200),W(1800,2600),W(-1330,2600),[1,1,1],Y-3.4)}
 {const g=new Builder(6);qz(g,-217,LAND.v0,LAND.u1,LAND.v1,[.34,.5,.26],Y-.06);const gm=new THREE.Group();gm.add(g.mesh(mObj));chunk(m,gm)}
 const AS=[.27,.27,.29];qz(ROADB,-685,-635,-217,1035,AS,Y+.01);qz(ROADB,-1235,-635,-775,1035,AS,Y+.01);for(const j of BRIDGE){const e=EW[j];qz(ROADB,-775,e.v-e.h,-685,e.v+e.h,AS,Y+.01)}
 /* car park south of the terminal */
 qz(ROADB,-217,-420,-150,-296,[.3,.3,.32],Y+.01);yield;
 /* raised areas */
 for(const o of RAISE){if(o.k==='med'){slab(o,Y+KH,PAVC);continue}
  if(o.sp==='parkw'||o.sp==='parke'){slab(o,Y+KH,[.36,.56,.28],'g');continue}
  if(o.k==='plaza'||o.sp==='square'||o.sp==='cathedral'){slab(o,Y+KH,[.8,.76,.68]);continue}
  slab(o,Y+KH,PAVC)}
 yield;
 /* embankment + sea walls and stone parapets */
 const wallC=[.6,.58,.54];
 const wallRun=(u0,v0,u1,v1,cu,cv,top)=>{const t=T((u0+u1)/2,(v0+v1)/2);vq(t.o,u0,v0,u1,v1,Y-4.6,top,wallC,cu,cv)};
 for(const[u,su]of[[-692,1],[-768,-1]]){let v=LAND.v0;const segs=[];for(const j of[...BRIDGE].sort((a,b)=>a-b)){const e=EW[j];segs.push([v,e.v-e.h-4]);v=e.v+e.h+4}segs.push([v,LAND.v1]);
  for(const[a,b]of segs){for(let s=a;s<b;s+=40){const e=Math.min(b,s+40);wallRun(u,s,u,e,u+su*5,(s+e)/2,Y+KH);const t=T(u,s);bx(t.o,u+su*.2,Y+KH,(s+e)/2,.4,.95,e-s-.3,[.78,.75,.68]);cBox(u+su*.4-.01,u,s,e)}}}
 /* coast: south, north (city part), west */
 const coast=(u0,v0,u1,v1,nu,nv)=>{const L=Math.hypot(u1-u0,v1-v0),n=Math.ceil(L/40);for(let k=0;k<n;k++){const ua=u0+(u1-u0)*k/n,va=v0+(v1-v0)*k/n,ub=u0+(u1-u0)*(k+1)/n,vb=v0+(v1-v0)*(k+1)/n,t=T(ua,va),air=(ua+ub)/2>-217,top=air?Y:Y+KH;
  vq(t.o,ua,va,ub,vb,Y-4.6,top,wallC,(ua+ub)/2-nu*5,(va+vb)/2-nv*5);if(air)continue;const mu=(ua+ub)/2-nu*.2,mv=(va+vb)/2-nv*.2,su=Math.abs(nu)>.5?.4:Math.abs(ub-ua)-.2,sv=Math.abs(nv)>.5?.4:Math.abs(vb-va)-.2;bx(t.o,mu,top,mv,su,.95,sv,[.78,.75,.68]);cBox(mu-su/2,mu+su/2,mv-sv/2,mv+sv/2)}};
 coast(-1250,LAND.v0,-768,LAND.v0,0,-1);coast(-692,LAND.v0,LAND.u1,LAND.v0,0,-1);coast(-1250,LAND.v1,-768,LAND.v1,0,1);coast(-692,LAND.v1,LAND.u1,LAND.v1,0,1);coast(-1250,LAND.v0,-1250,LAND.v1,-1,0);coast(LAND.u1,LAND.v0,LAND.u1,LAND.v1,1,0);
 yield;
 /* bridges: deck fascia, parapets, piers, the suspension towers on Airport Way */
 for(const j of BRIDGE){const e=EW[j],v0=e.v-e.h-4,v1=e.v+e.h+4,t=T(-730,e.v);for(const[v,s]of[[v0,-1],[v1,1]]){vq(t.o,-768,v,-692,v,Y-.6,Y+KH,[.7,.7,.72],-730,e.v);bx(t.o,-730,Y+KH,v-s*.2,76,1.0,.4,[.8,.78,.72]);cBox(-768,-692,Math.min(v,v-s*.4),Math.max(v,v-s*.4))}
  qz(t.o,-768,v0,-692,v1,[.5,.5,.52],Y-.6);
  if(j===4){/* cable-stayed: two twin-leg towers with fans of stays */for(const u of[-704,-756]){for(const sd of[-1,1]){const lv=e.v+sd*(e.h+5.2);bx(t.o,u,Y-4,lv,2.4,54,2.4,[.72,.7,.66]);cBox(u-1.3,u+1.3,lv-1.3,lv+1.3);
     for(let k=1;k<=6;k++)for(const dir of[-1,1]){const du=u+dir*k*4.6;if(du<-767||du>-693)continue;beam(t.o,[OX+u,Y+48-k*1.6,OZ+lv],[OX+du,Y+KH+1.1,OZ+e.v+sd*(e.h+4)],.14,[.92,.92,.94])}}
    for(const y of[22,44,50])bx(t.o,u,Y+y,e.v,2,2.2,2*(e.h+6.4),[.66,.64,.6]);const p=W(u,e.v);RLIGHT.push([p[0],Y+52.4,p[1]])}}
  else{for(const u of[-718,-742])bx(t.o,u,Y-4.6,e.v,4,4.0,v1-v0,[.66,.62,.56]);
   for(const[a,b2]of[[-768,-742],[-742,-718],[-718,-692]])for(const v of[v0-.05,v1+.05]){let pr=null;for(let k=0;k<=10;k++){const u=a+(b2-a)*k/10,p=[OX+u,Y-3.6+Math.sin(k/10*Math.PI)*2.9,OZ+v];if(pr)beam(t.o,pr,p,.4,[.74,.7,.62]);pr=p}}}}
 yield;
 /* road markings, crossings, junction furniture */
 const WH=[.95,.95,.93],YL=[.95,.78,.12],RED=[.4,.15,.14];
 const mkT=(u,v)=>T(u,v).mk;
 const lineU=(u0,u1,v,wd,col,dash,gap)=>{if(u1<u0)[u0,u1]=[u1,u0];if(!dash){for(let a=u0;a<u1;a+=60){const b=Math.min(u1,a+60);qz(mkT(a,v),a,v-wd/2,b,v+wd/2,col,Y+.02)}return}for(let a=u0;a<u1;a+=dash+gap)qz(mkT(a,v),a,v-wd/2,Math.min(u1,a+dash),v+wd/2,col,Y+.02)};
 const lineV=(v0,v1,u,wd,col,dash,gap)=>{if(v1<v0)[v0,v1]=[v1,v0];if(!dash){for(let a=v0;a<v1;a+=60){const b=Math.min(v1,a+60);qz(mkT(u,a),u-wd/2,a,u+wd/2,b,col,Y+.02)}return}for(let a=v0;a<v1;a+=dash+gap)qz(mkT(u,a),u-wd/2,a,u+wd/2,Math.min(v1,a+dash),col,Y+.02)};
 /* NS edges */
 for(let i=0;i<12;i++)for(let j=0;j<15;j++){if(!nsEdge(i,j))continue;const r=NS[i],a=EW[j].v+EW[j].h,b=EW[j+1].v-EW[j+1].h,blv=r.w>=26;
  const s0=a+(NODE[i][j].deg>2?4:0),s1=b-(NODE[i][j+1].deg>2?4:0);
  if(blv){for(const s of[-1,1]){lineV(s0+6,s1-6,r.u+s*4.9,.13,WH,3,5);lineV(s0,s1,r.u+s*8.5,.22,WH);qz(mkT(r.u,(s0+s1)/2),...(s>0?[r.u+8.6,s0,r.u+r.h-.1,s1]:[r.u-r.h+.1,s0,r.u-8.6,s1]),RED,Y+.015)}}
  else lineV(s0+6,s1-6,r.u,.13,WH,3,6);
  if(!blv)for(const s of[-1,1]){lineV(s0,s1,r.u+s*(r.h-.35),.1,YL);lineV(s0,s1,r.u+s*(r.h-.6),.1,YL)}
  /* zebra crossings at the ends that meet a junction */
  for(const[end,dir]of[[a,1],[b,-1]]){const nd=dir>0?NODE[i][j]:NODE[i][j+1];if(nd.deg<3)continue;const s=end+dir*.6;for(let q=-r.h+.6;q<r.h-.4;q+=1.1)qz(mkT(r.u,s),r.u+q,Math.min(s,s+dir*3),r.u+q+.55,Math.max(s,s+dir*3),WH,Y+.02);
   /* stop line on the approaching (left) half */const sl=end+dir*4.4;qz(mkT(r.u,sl),dir>0?r.u-r.h+.3:r.u+.15,sl-.2,dir>0?r.u-.15:r.u+r.h-.3,sl+.2,WH,Y+.02);if(!blv)lineV(dir>0?end+4.6:end-14,dir>0?end+14:end-4.6,r.u,.13,WH)}}
 /* EW edges */
 for(let j=0;j<16;j++)for(let i=0;i<11;i++){if(!ewEdge(j,i))continue;const r=EW[j],a=NS[i+1].u+NS[i+1].h,b=NS[i].u-NS[i].h,blv=r.w>=26;const s0=a+(NODE[i+1][j].deg>2?4:0),s1=b-(NODE[i][j].deg>2?4:0);
  if(blv&&i!==5){for(const s of[-1,1]){lineU(s0+6,s1-6,r.v+s*4.9,.13,WH,3,5);lineU(s0,s1,r.v+s*8.5,.22,WH);qz(mkT((s0+s1)/2,r.v),...(s>0?[s0,r.v+8.6,s1,r.v+r.h-.1]:[s0,r.v-r.h+.1,s1,r.v-8.6]),RED,Y+.015)}}
  else lineU(s0+6,s1-6,r.v,.13,WH,3,6);
  if(!blv)for(const s of[-1,1]){lineU(s0,s1,r.v+s*(r.h-.35),.1,YL);lineU(s0,s1,r.v+s*(r.h-.6),.1,YL)}
  if(blv&&i===5){lineU(s0,s1,r.v,.13,WH,3,5);lineU(s0,s1,r.v-4.9,.13,WH,3,5);lineU(s0,s1,r.v+4.9,.13,WH,3,5)}
  for(const[end,dir]of[[a,1],[b,-1]]){const nd=dir>0?NODE[i+1][j]:NODE[i][j];if(nd.deg<3)continue;const s=end+dir*.6;for(let q=-r.h+.6;q<r.h-.4;q+=1.1)qz(mkT(s,r.v),Math.min(s,s+dir*3),r.v+q,Math.max(s,s+dir*3),r.v+q+.55,WH,Y+.02);
   const sl=end+dir*4.4;qz(mkT(sl,r.v),sl-.2,dir>0?r.v+.15:r.v-r.h+.3,sl+.2,dir>0?r.v+r.h-.3:r.v-.15,WH,Y+.02)}}
 /* yellow box junction at Marlowe Circus */
 {const n=NODE[2][4],hu=NS[2].h,hv=EW[4].h;lineU(n.u-hu,n.u+hu,n.v-hv+.3,.25,YL);lineU(n.u-hu,n.u+hu,n.v+hv-.3,.25,YL);lineV(n.v-hv,n.v+hv,n.u-hu+.3,.25,YL);lineV(n.v-hv,n.v+hv,n.u+hu-.3,.25,YL);
  const t=T(n.u,n.v);
  for(let k=0;k<14;k++){const f=k/13;for(const s of[-1,1]){const u0=n.u-hu+f*2*hu,v0=n.v-hv,u1=u0+s*2*hv,v1=n.v+hv;if(u1<n.u-hu-.1||u1>n.u+hu+.1)continue;const d=[u1-u0,v1-v0],L=Math.hypot(...d),nx=-d[1]/L*.12,nz=d[0]/L*.12,A_=W(u0+nx,v0+nz),B_=W(u0-nx,v0-nz),C_=W(u1-nx,v1-nz),D_=W(u1+nx,v1+nz);quadXZ(t.mk,A_,B_,C_,D_,YL,Y+.021)}}}
 /* car park bays */
 for(let v=-412;v<-304;v+=3)for(const u of[-205,-185,-165]){qz(mkT(u,v),u-2.6,v-.06,u+2.6,v+.06,WH,Y+.02)}
 yield;
 /* junction furniture: signals, street signs */
 for(let i=0;i<12;i++)for(let j=0;j<16;j++){const n=NODE[i][j];if(n.deg<3)continue;const hu=NS[i].h,hv=EW[j].h;
  if(n.lights){for(const[du,dv]of[[0,1],[0,-1],[1,0],[-1,0]]){const Lu=dv,Lv=-du,ax=du===0?0:1,ch=ax===0?hv:hu,rh=ax===0?hu:hv;const pu=n.u+Lu*(rh+.9)-du*(ch+1.4),pv=n.v+Lv*(rh+.9)-dv*(ch+1.4);signal(pu,pv,-du,-dv,ax)}}
  const cu=n.u+hu+2.2,cv=n.v+hv+2.2;if(mh(cu,cv)>Y)streetSign(cu,cv,NS[i].n,Math.PI/2,EW[j].n)}
 yield;
 /* buildings by block, with pavement furniture */
 let nb=0;for(const b of BLK){blockFill(b);if(++nb%2===0)yield}
 /* promenade + coast furniture */
 for(const o of RAISE){if(o.k==='prom'){const u=(o.u0+o.u1)/2;for(let v=o.v0+12;v<o.v1-8;v+=32){lamp(u,v,0,0,false)}for(let v=o.v0+26;v<o.v1-8;v+=64){bench(u+(o.u0>-700?2.1:-2.1),v,false);if(rnd()<.5)bin(u+(o.u0>-700?2.4:-2.4),v+3)}}
  if(o.k==='coast'&&o.v1-o.v0<20){const v=(o.v0+o.v1)/2;for(let u=o.u0+10;u<o.u1-6;u+=32)lamp(u,v-3,0,0,false);for(let u=o.u0+26;u<o.u1-6;u+=64)bench(u,v+3,true)}
  if(o.k==='coast'&&o.u1-o.u0<20){const u=(o.u0+o.u1)/2;for(let v=o.v0+10;v<o.v1-6;v+=32)lamp(u+3,v,0,0,false)}
  if(o.k==='med'){const al=o.u1-o.u0<4;if(al){const u=(o.u0+o.u1)/2;for(let v=o.v0+8;v<o.v1-4;v+=26)lamp(u,v,1,0,true);for(let v=o.v0+21;v<o.v1-4;v+=26)tree(u,v,.85)}else{const v=(o.v0+o.v1)/2;for(let u=o.u0+8;u<o.u1-4;u+=26)lamp(u,v,0,1,true);for(let u=o.u0+21;u<o.u1-4;u+=26)tree(u,v,.85)}}
  if(o.k==='bridge'){const v=(o.v0+o.v1)/2;for(let u=-760;u<-692;u+=17)lamp(u,v,0,0,false)}}
 yield;
 extras();yield;
 landmarks();yield;
 airportPlaza();yield;
 /* flush tiles */
 const glowG=new THREE.Group();{const g=new THREE.BufferGeometry(),a=new Float32Array(LGLOW.length*3);LGLOW.forEach((p,i)=>{a[i*3]=p[0];a[i*3+1]=p[1];a[i*3+2]=p[2]});g.setAttribute('position',new THREE.BufferAttribute(a,3));const pm=new THREE.Points(g,new THREE.PointsMaterial({color:0xfff0c0,size:5,sizeAttenuation:false,fog:true}));glowG.add(pm)}
 {const ROADM=ROADB.mesh(mRoad),WAT=WATB.mesh(mWater),g=new THREE.Group();g.add(ROADM,WAT);chunk(m,g);CITY.water=WAT}
 for(const t of TILES.values()){const g=new THREE.Group();for(const k in t.f)if(t.f[k].n)g.add(bmesh(t.f[k],FM[k]));if(t.s.n)g.add(bmesh(t.s,SM));if(t.gl.n){const gm=bmesh(t.gl,mGlass);gm.renderOrder=2;g.add(gm)}if(t.sg.n)g.add(bmesh(t.sg,mSign));
  if(t.o.p.length)g.add(t.o.mesh(mObj));if(t.p.p.length)g.add(t.p.mesh(mPave));if(t.gr.p.length)g.add(t.gr.mesh(mObj));if(t.mk.p.length)g.add(t.mk.mesh(mMark));
  g.userData.cx=OX+(t.a+.5)*TL-1330;g.userData.cz=OZ+(t.b+.5)*TL-740;chunk(m,g);CHUNKS.push(g);yield}
 CITY.glow=glowG;chunk(m,glowG);CITY.built=1;
 if(window.MARLOWE2)MARLOWE2.onBuilt()}
/* ------------------------------------------------------------------ what goes in each block */
function blockFill(b){
 const sideList=[['s',b.ss,b.u0,b.u1,b.v0,0,-1],['n',b.sn,b.u0,b.u1,b.v1,0,1],['w',b.sw,b.v0,b.v1,b.u0,-1,0],['e',b.se,b.v0,b.v1,b.u1,1,0]];
 /* pavement furniture along each side */
 for(const[k,r,a0,a1,e,nu,nv]of sideList){const al=k==='s'||k==='n';const big=r.w>=20,trees=big||b.d==='old'||b.d==='west';
  for(let s=a0+9;s<a1-7;s+=34){const pu=al?s:e-nu*.75,pv=al?e-nv*.75:s;lamp(pu,pv,nu,nv,false)}
  if(trees&&!(b.sp==='station'&&k==='s'))for(let s=a0+24;s<a1-12;s+=(big?15:24)){if(!big&&(s-a0)%30<6)continue;const pu=al?s:e-nu*1.7,pv=al?e-nv*1.7:s;tree(pu,pv,big?.95:.8,true)}
  /* bus shelters on the bus routes, near the middle of the side */
  const key=(r.ax?'e':'n')+(r.ax?r.j:r.i);if(BUSR.has(key)&&a1-a0>60&&rnd()<.6){const s=(a0+a1)/2+rr(-8,8),pu=al?s:e-nu*2.8,pv=al?e-nv*2.8:s;shelter(pu,pv,nu,nv);CITY.stops.push({u:al?s:e+nu*3,v:al?e+nv*3:s,road:key})}
  if((b.d==='old'||b.d==='mid'||b.d==='down')&&rnd()<.25){const s=a0+rr(12,a1-a0-12),pu=al?s:e-nu*1.1,pv=al?e-nv*1.1:s;rnd()<.5?phoneBox(pu,pv,0):postBox(pu,pv)}
  if(rnd()<.3){const s=a0+rr(6,a1-a0-6),pu=al?s:e-nu*1.0,pv=al?e-nv*1.0:s;bin(pu,pv)}}
 /* parked cars along the kerb of normal streets (left-hand traffic, so they face the flow of their side) */
 for(const[k,r,a0,a1,e,nu,nv]of sideList){if(r.w>=26||(b.sp==='station'&&k==='s'))continue;const al=k==='s'||k==='n',off=r.w>=20?7.6:r.w>=16?5.9:5.2;
  for(let s=a0+10;s<a1-10;s+=6.4){if(rnd()>(b.d==='down'?.1:.24))continue;if(al){const v=r.v-nv*off;parked(s,v,v>r.v?-Math.PI/2:Math.PI/2,pick(CARC))}else{const u=r.u-nu*off;parked(u,s,u>r.u?0:Math.PI,pick(CARC))}}}
 /* the buildings */
 if(b.sp){special(b);return}
 switch(b.d){
  case'down':towers(b);break;
  case'mid':perim(b,{dp:rr(20,26),w0:14,w1:30,st:[2,5,4,3,8,5],fl:[5,11],shops:true,lob:.4});break;
  case'docks':perim(b,{dp:rr(20,26),w0:18,w1:34,st:[6,6,8,2,6],fl:[4,8],shops:false,wt:1});break;
  case'north':perim(b,{dp:rr(18,24),w0:16,w1:30,st:[8,8,2,1,8],fl:[7,15],shops:true});break;
  case'old':perim(b,{dp:rr(13,16),w0:6,w1:11,st:[3,3,4,7,5,3],fl:[3,5],shops:true,pitch:.55});break;
  case'west':if(rnd()<.18)perim(b,{dp:16,w0:16,w1:28,st:[8,2],fl:[6,9],shops:false});else perim(b,{dp:rr(11,13),w0:5.5,w1:8,st:[7,7,7,3,4],fl:[3,3],shops:false,pitch:.85});break}}
/* ------------------------------------------------------------------ landmarks */
const CITY={built:0,stops:[],poi:[]};
function special(b){const[iu0,iu1,iv0,iv1]=inner(b),cu=(iu0+iu1)/2,cv=(iv0+iv1)/2,t=T(cu,cv);
 switch(b.sp){
 case'station':{/* MARLOWE CENTRAL: stone front on Airport Way, glass train shed behind, clock tower */
  const f0=iv0,fr=iv0+24;building({u0:iu0,u1:iu1,v0:f0,v1:fr,st:12,fl:2,gh:0,tint:[1,1,1],noClutter:1});const top=Y+KH+14;
  bx(t.o,cu,top,f0+.2,iu1-iu0+.6,1.2,.8,STONE);
  /* barrel vault */const R_=(iu1-iu0)/2,n=14,v0=fr,v1=iv1;for(let k=0;k<n;k++){const a0=k/n*Math.PI,a1=(k+1)/n*Math.PI,u0=cu-Math.cos(a0)*R_,u1=cu-Math.cos(a1)*R_,y0=top-4+Math.sin(a0)*12,y1=top-4+Math.sin(a1)*12,A_=W(u0,v0),B_=W(u1,v0),C_=W(u1,v1),D_=W(u0,v1),col=[.62,.78,.9];
   q4(t.gl,[[A_[0],y0,A_[1]],[B_[0],y1,B_[1]],[C_[0],y1,C_[1]],[D_[0],y0,D_[1]]],[[0,0],[1,0],[1,1],[0,1]],[col,col,col,col])}
  {const ce=W(cu,v0);for(let k=0;k<n;k++){const a0=k/n*Math.PI,a1=(k+1)/n*Math.PI,A_=W(cu-Math.cos(a0)*R_,v0),B_=W(cu-Math.cos(a1)*R_,v0),col=[.62,.78,.9];q4(t.gl,[[ce[0],top-4,ce[1]],[ce[0],top-4,ce[1]],[B_[0],top-4+Math.sin(a1)*12,B_[1]],[A_[0],top-4+Math.sin(a0)*12,A_[1]]],[[0,0],[1,0],[1,1],[0,1]],[col,col,col,col])}}
  for(let v=v0;v<=v1+.1;v+=6){let pr=null;for(let k=0;k<=n;k++){const a=k/n*Math.PI,p=[...W(cu-Math.cos(a)*R_,v)];const P_=[p[0],top-4+Math.sin(a)*12,p[1]];if(pr)beam(t.o,pr,P_,.35,[.3,.32,.36]);pr=P_}}
  for(const s of[-1,1])bx(t.o,cu+s*R_,Y+KH,(v0+v1)/2,1.2,top-4-Y-KH,v1-v0,[.7,.66,.58]);bx(t.o,cu,Y+KH,v1-.5,iu1-iu0,top-4-Y,1,[.7,.66,.58]);
  cBox(iu0,iu1,iv0,iv1);
  /* clock tower */const tu=iu0+5,tv=iv0+5;building({u0:tu-5,u1:tu+5,v0:tv-5,v1:tv+5,st:12,fl:4,gh:0,tint:[1,1,1],noClutter:1});cn(t.o,tu,Y+KH+28,tv,7.4,9,4,[.36,.4,.46],Math.PI/4);clock(tu,tv,Y+KH+24,5.05);
  signBoard(cu,f0-.05,Y+KH+11.2,'MARLOWE CENTRAL',30,2.4,0,'#1a2c4a','#ffe9a8');
  /* taxi rank in the bus lane in front */for(let k=0;k<4;k++)parked(iu0+18+k*7,EW[4].v+EW[4].h-2.2,-Math.PI/2,[.06,.06,.07],1);streetSign(iu0+14,f0-2.5,'TAXI RANK',0);
  CITY.poi.push({n:'MARLOWE CENTRAL STATION',u:cu,v:EW[4].v+EW[4].h-2.5,taxi:1});break}
 case'skytower':{const B=t.o,y=Y+KH;qz(t.o,iu0,iv0,iu1,iv1,[.8,.78,.72],y+.01);cy_(B,cu,y,cv,12,6,24,[.72,.72,.74]);cy_(B,cu,y+6,cv,8,34,20,[.8,.8,.83]);cy_(B,cu,y+40,cv,5.6,120,20,[.85,.86,.88]);
  cy_(B,cu,y+160,cv,16,3,28,[.32,.36,.44]);cy_(B,cu,y+163,cv,18,2,28,[.86,.88,.9]);cy_(B,cu,y+165,cv,14,7,28,[.3,.34,.42]);cy_(B,cu,y+172,cv,15.5,1.6,28,[.86,.88,.9]);cy_(B,cu,y+173.6,cv,9,5,20,[.6,.62,.66]);cy_(B,cu,y+178.6,cv,.9,70,6,[.78,.78,.8]);
  {const n=28;for(let k=0;k<n;k++){const a0=k/n*TAU,a1=(k+1)/n*TAU,r=14.05,A_=W(cu+Math.cos(a0)*r,cv+Math.sin(a0)*r),C_=W(cu+Math.cos(a1)*r,cv+Math.sin(a1)*r),bf=t.f[0]||(t.f[0]=MB()),c=[1,1,1];q4(bf,[[C_[0],y+165.1,C_[1]],[A_[0],y+165.1,A_[1]],[A_[0],y+171.9,A_[1]],[C_[0],y+171.9,C_[1]]],[[k/n*8,0],[(k+1)/n*8,0],[(k+1)/n*8,.47],[k/n*8,.47]],[c,c,c,c])}}
  const p=W(cu,cv);RLIGHT.push([p[0],y+249,p[1]],[p[0],y+190,p[1]]);cCirc(cu,cv,12.2);signBoard(cu,cv-12.1,y+5,'MARLOWE SKY TOWER',14,1.5,0,'#12202e','#ffe9a8');
  for(let k=0;k<8;k++){const a=k/8*TAU;tree(cu+Math.cos(a)*24,cv+Math.sin(a)*24*.9,.9,true)}for(let k=0;k<6;k++)bench(cu+Math.cos(k+.4)*18,cv+Math.sin(k+.4)*18,k%2===0);
  CITY.poi.push({n:'MARLOWE SKY TOWER',u:cu,v:iv0-2});break}
 case'cathedral':{const y=Y+KH,nu0=cu-13,nu1=cu+13,nv0=cv-22,nv1=cv+38;building({u0:nu0,u1:nu1,v0:nv0,v1:nv1,st:10,fl:3,gh:0,tint:[1,1,1],roof:'pitch',ridge:'v',rc:[.36,.4,.42],noClutter:1});
  building({u0:cu-24,u1:cu+24,v0:cv+6,v1:cv+18,st:10,fl:3,gh:0,tint:[1,1,1],roof:'pitch',ridge:'u',rc:[.36,.4,.42],noClutter:1});
  building({u0:cu-7,u1:cu+7,v0:nv0-12,v1:nv0+1,st:10,fl:6,gh:0,tint:[1,1,1],noClutter:1});const tt=y+36;for(const[a,c]of[[-1,-1],[1,-1],[1,1],[-1,1]])cn(t.o,cu+a*6,tt,nv0-5.5+c*6,1.1,5,4,[.78,.74,.64]);cn(t.o,cu,tt,nv0-5.5,6.2,34,8,[.4,.44,.48],Math.PI/8);
  const p=W(cu,nv0-5.5);RLIGHT.push([p[0],tt+34.5,p[1]]);
  for(let k=0;k<8;k++){tree(k%2?iu0+rr(3,7):iu1-rr(3,7),rr(iv0+6,iv1-4),rr(.8,1.1),false)}for(let k=0;k<6;k++)bench(cu-30+k*12,iv0+4,true);
  signBoard(cu,nv0-12.1,y+3.2,"ST MARLOWE'S CATHEDRAL",9,1,0,'#2a2418','#e8d8a0');CITY.poi.push({n:"ST MARLOWE'S CATHEDRAL",u:cu,v:iv0-2});break}
 case'square':{/* market square next to the cathedral: stalls + fountain */const y=Y+KH;qz(t.o,iu0,iv0,iu1,iv1,[.74,.7,.62],y+.01);cy_(t.o,cu,y,cv,6,.7,20,[.62,.6,.58]);cy_(t.o,cu,y+.6,cv,5.4,.12,20,[.3,.55,.72]);cy_(t.o,cu,y,cv,.8,3.6,10,[.7,.7,.72]);cy_(t.o,cu,y+3.6,cv,1.8,.4,12,[.6,.62,.66]);cCirc(cu,cv,6);
  const cols=[[.8,.15,.15],[.15,.35,.7],[.2,.55,.3],[.9,.75,.2],[.95,.95,.92]];for(let k=0;k<10;k++){const su=cu-30+(k%5)*15,sv=k<5?iv0+12:iv1-12;bx(t.o,su,y,sv,3.4,.95,2,[.45,.32,.2]);bx(t.o,su,y+2.3,sv,3.8,.12,2.6,cols[k%5]);for(const[a,c]of[[-1,-1],[1,-1],[1,1],[-1,1]])bx(t.o,su+a*1.7,y,sv+c*1.1,.08,2.3,.08,[.3,.3,.3]);cBox(su-1.8,su+1.8,sv-1.1,sv+1.1)}
  for(let k=0;k<6;k++)tree(iu0+6+rnd()*(iu1-iu0-12),k<3?iv0+3:iv1-3,.8,true);CITY.poi.push({n:'MARKET SQUARE',u:cu,v:iv0-2});break}
 case'townhall':{const y=Y+KH;building({u0:iu0,u1:iu1,v0:iv0,v1:iv1,st:4,fl:4,gh:0,tint:[1.02,1,.96],noClutter:1});const fu=iu1;
  for(let k=0;k<6;k++){cy_(t.o,fu+2.2,y,cv-14+k*5.6,.55,11,10,[.92,.9,.84]);cCirc(fu+2.2,cv-14+k*5.6,.6)}bx(t.o,fu+2.2,y+11,cv,3.4,1.4,32,[.9,.88,.82]);bx(t.o,fu+.6,y,cv,4,.5,30,[.8,.78,.72]);
  {const P=(u,yy,v)=>{const p=W(u,v);return[p[0],yy,p[1]]};const a=P(fu+3.9,y+12.4,cv-16),b2=P(fu+3.9,y+12.4,cv+16),c=P(fu+3.9,y+17,cv),cc=P(fu,y+12,cv),col=[.9,.88,.82];t.o.tri(a,b2,c,col,col,col,false,cc)}
  const top=y+4*3.5;building({u0:cu-6,u1:cu+6,v0:cv-6,v1:cv+6,y0:top,st:4,fl:4,gh:0,tint:[1.02,1,.96],noClutter:1});clock(cu,cv,top+10.5,6.05);cy_(t.o,cu,top+14,cv,4.6,4,12,[.86,.84,.78]);oc(t.o,cu,top+18.5,cv,4.4,[.36,.5,.44],.02);cy_(t.o,cu,top+21.5,cv,.3,5,5,[.85,.75,.3]);
  signBoard(fu+.05,cv,y+5.2,'MARLOWE TOWN HALL',12,1.2,-Math.PI/2,'#2a2418','#e8d8a0');CITY.poi.push({n:'MARLOWE TOWN HALL',u:fu+8,v:cv});break}
 case'arena':{const y=Y+KH,ra=68,rb=46,n=48;const bf=t.f[11]||(t.f[11]=MB());for(let k=0;k<n;k++){const a0=k/n*TAU,a1=(k+1)/n*TAU,P0=W(cu+Math.cos(a0)*ra,cv+Math.sin(a0)*rb),P1=W(cu+Math.cos(a1)*ra,cv+Math.sin(a1)*rb),nx=Math.cos((a0+a1)/2),nz=Math.sin((a0+a1)/2),c=sh([1,1,1],lit(nx,nz));
   q4(bf,[[P1[0],y,P1[1]],[P0[0],y,P0[1]],[P0[0],y+22,P0[1]],[P1[0],y+22,P1[1]]],[[(k+1)*.5,0],[k*.5,0],[k*.5,1.1],[(k+1)*.5,1.1]],[c,c,c,c]);
   const Q0=W(cu+Math.cos(a0)*ra*1.04,cv+Math.sin(a0)*rb*1.04),Q1=W(cu+Math.cos(a1)*ra*1.04,cv+Math.sin(a1)*rb*1.04),I0=W(cu+Math.cos(a0)*ra*.7,cv+Math.sin(a0)*rb*.7),I1=W(cu+Math.cos(a1)*ra*.7,cv+Math.sin(a1)*rb*.7),rc=[.86,.88,.9],cc=[...W(cu,cv)];
   t.o.tri([Q0[0],y+23.5,Q0[1]],[Q1[0],y+23.5,Q1[1]],[I1[0],y+20,I1[1]],rc,rc,rc,true);t.o.tri([Q0[0],y+23.5,Q0[1]],[I1[0],y+20,I1[1]],[I0[0],y+20,I0[1]],rc,rc,rc,true);
   const mu=cu+Math.cos(a0)*ra,mv=cv+Math.sin(a0)*rb;cCirc(mu,mv,4.2);if(k%4===0){const p=W(cu+Math.cos(a0)*(ra+.5),cv+Math.sin(a0)*(rb+.5));RLIGHT.push([p[0],y+24,p[1]])}}
  qz(t.o,cu-ra*.66,cv-rb*.66,cu+ra*.66,cv+rb*.66,[.3,.6,.28],y+3);for(const[a,s]of[[0,1],[Math.PI,-1]]){}
  signBoard(cu,cv-rb-.6,y+16,'MARLOWE ARENA',26,3,0,'#101828','#ffffff');signBoard(cu,cv+rb+.6,y+16,'MARLOWE ARENA',26,3,Math.PI,'#101828','#ffffff');CITY.poi.push({n:'MARLOWE ARENA',u:cu,v:b.v0-3});break}
 case'parkw':{const y=Y+KH;const pond=POND;qz(t.o,pond.u0-1.2,pond.v0-1.2,pond.u1+1.2,pond.v1+1.2,[.7,.68,.62],y+.02);{const wb=new Builder(6);qz(wb,pond.u0,pond.v0,pond.u1,pond.v1,[1,1,1],y+.05);const g=new THREE.Group();g.add(wb.mesh(mWater));chunk(M,g)}cBox(pond.u0,pond.u1,pond.v0,pond.v1);
  qz(t.mk,cu-1.6,iv0-6,cu+1.6,pond.v0-1.2,[.78,.72,.58],y+.015);qz(t.mk,cu-1.6,pond.v1+1.2,cu+1.6,iv1+6,[.78,.72,.58],y+.015);qz(t.mk,iu0-6,cv-1.6,pond.u0-1.2,cv+1.6,[.78,.72,.58],y+.015);qz(t.mk,pond.u1+1.2,cv-1.6,iu1+6,cv+1.6,[.78,.72,.58],y+.015);
  for(let k=0;k<70;k++){const u=rr(iu0-3,iu1+3),v=rr(iv0-3,iv1+3);if(u>pond.u0-5&&u<pond.u1+5&&v>pond.v0-5&&v<pond.v1+5)continue;if(Math.abs(u-cu)<4||Math.abs(v-cv)<4)continue;tree(u,v,rr(.8,1.3),false,1)}
  /* bandstand */const bu=cu+0,bv=iv1-22;cy_(t.o,bu,y,bv,5,.6,8,[.86,.84,.8]);for(let k=0;k<8;k++){const a=k/8*TAU;cy_(t.o,bu+Math.cos(a)*4.4,y+.6,bv+Math.sin(a)*4.4,.12,3,5,[.2,.4,.3])}cn(t.o,bu,y+3.6,bv,5.4,2.4,8,[.2,.42,.32],Math.PI/8);cCirc(bu,bv,5);
  for(let k=0;k<10;k++)bench(cu+(k%2?2.6:-2.6),iv0+12+k*18,false);CITY.poi.push({n:'WESTBANK PARK',u:iu1+4,v:cv});break}
 case'parke':{const y=Y+KH;qz(t.mk,iu0-4,cv-1.4,iu1+4,cv+1.4,[.78,.72,.58],y+.015);for(let k=0;k<26;k++){const u=rr(iu0,iu1),v=rr(iv0,iv1);if(Math.abs(v-cv)<4)continue;tree(u,v,rr(.8,1.2),false,1)}for(let k=0;k<6;k++)bench(iu0+6+k*8,cv+2.6,true);CITY.poi.push({n:'RIVERSIDE GARDENS',u:iu1+2,v:cv});break}}}
function clock(u,v,yc,r){const t=T(u,v);const tex=CITY.clockTex||(CITY.clockTex=T2(128,128,g=>{g.fillStyle='#2a3040';g.fillRect(0,0,128,128);g.fillStyle='#f4efe0';g.beginPath();g.arc(64,64,58,0,TAU);g.fill();g.strokeStyle='#c8a040';g.lineWidth=5;g.stroke();g.fillStyle='#111';for(let k=0;k<12;k++){const a=k/12*TAU;g.save();g.translate(64+Math.cos(a)*48,64+Math.sin(a)*48);g.rotate(a);g.fillRect(-5,-1.5,10,3);g.restore()}g.lineCap='round';g.strokeStyle='#111';g.lineWidth=5;g.beginPath();g.moveTo(64,64);g.lineTo(40,48);g.stroke();g.lineWidth=3;g.beginPath();g.moveTo(64,64);g.lineTo(88,40);g.stroke()},{lin:true}));
 const m=new THREE.MeshBasicMaterial({map:tex});const g=new THREE.Group();for(const[a,du,dv]of[[0,0,1],[Math.PI,0,-1],[Math.PI/2,1,0],[-Math.PI/2,-1,0]]){const pl=new THREE.Mesh(new THREE.PlaneGeometry(5.6,5.6),m),p=W(u+du*r,v+dv*r);pl.position.set(p[0],yc,p[1]);pl.rotation.y=a;g.add(pl)}chunk(M,g)}
function signBoard(u,v,yc,txt,w,h,ry,bg,fg){const tx=T2(1024,Math.round(1024*h/w),(g,W_,H_)=>{g.fillStyle=bg;g.fillRect(0,0,W_,H_);g.strokeStyle=fg;g.lineWidth=Math.max(3,H_*.05);g.strokeRect(g.lineWidth,g.lineWidth,W_-2*g.lineWidth,H_-2*g.lineWidth);g.fillStyle=fg;g.font='bold '+Math.round(H_*.58)+'px Georgia,serif';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,W_/2,H_/2+2)},{lin:true});
 const pl=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide})),p=W(u,v);pl.position.set(p[0],yc,p[1]);pl.rotation.y=ry+Math.PI;const g=new THREE.Group();g.add(pl);chunk(M,g)}
function metro(u,v,al){const t=T(u,v),B=t.o,y=Y+KH,lu=al?5:2.2,lv=al?2.2:5;qz(t.mk,u-lu/2,v-lv/2,u+lu/2,v+lv/2,[.06,.06,.07],y+.02);for(let k=0;k<5;k++){const f=k/5;qz(t.mk,al?u-lu/2+f*lu:u-lu/2,al?v-lv/2:v-lv/2+f*lv,al?u-lu/2+f*lu+.4:u+lu/2,al?v+lv/2:v-lv/2+f*lv+.4,[.32,.32,.34],y+.021)}
 for(const[a,c,su,sv]of al?[[u,v-lv/2-.05,lu,.06],[u,v+lv/2+.05,lu,.06],[u+lu/2+.05,v,.06,lv]]:[[u-lu/2-.05,v,.06,lv],[u+lu/2+.05,v,.06,lv],[u,v+lv/2+.05,lu,.06]])bx(B,a,y,c,su+.06,1.05,sv+.06,[.2,.22,.4]);cBox(u-lu/2-.1,u+lu/2+.1,v-lv/2-.1,v+lv/2+.1);
 const pu=al?u-lu/2-.6:u+lu/2+.6,pv=al?v+lv/2+.6:v-lv/2-.6;cy_(B,pu,y,pv,.07,3.2,5,[.2,.22,.4]);signPlate(pu,pv,y+3.0,'MARLOWE METRO',1.9,.36,al?0:Math.PI/2);CITY.poi.push({n:'METRO: '+(CITY.metN=(CITY.metN||0)+1),u,v,metro:1})}
function extras(){/* metro entrances + zebra crossings with Belisha beacons on the shopping streets */
 for(const[c,r]of[[2,3],[1,9],[3,11],[8,3],[7,8],[4,13],[0,1]]){const b=BLK.find(x=>x.c===c&&x.r===r);if(!b)continue;metro((b.u0+b.u1)/2+7,b.v0+pw(b.ss)*.5,true)}
 for(const i of[8,7])for(let j=1;j<14;j+=2){if(!nsEdge(i,j))continue;const r=NS[i],a=EW[j].v+EW[j].h,b2=EW[j+1].v-EW[j+1].h,s=(a+b2)/2+9;for(let q=-r.h+.6;q<r.h-.4;q+=1.1)qz(T(r.u,s).mk,r.u+q,s-1.5,r.u+q+.55,s+1.5,[.95,.95,.93],Y+.02);for(const sd of[-1,1])belisha(r.u+sd*(r.h+.5),s+1.8)}}
/* the Marlowe Eye (wheel) + big screens at Marlowe Circus: dynamic, animated by marlowe2.js */
function landmarks(){
 /* wheel */const hu=-688.5,hv=405,hy=Y+36,R_=31;const t=T(hu,hv),B=t.o;
 for(const s of[-1,1]){beam(B,[OX+hu,Y+KH,OZ+hv+s*20],[OX+hu,hy,OZ+hv],.9,[.9,.9,.92]);beam(B,[OX+hu+3,Y+KH,OZ+hv+s*20],[OX+hu+.8,hy,OZ+hv],.6,[.9,.9,.92])}cBox(hu-1.5,hu+3.5,hv-21,hv-19);cBox(hu-1.5,hu+3.5,hv+19,hv+21);
 bx(B,hu,Y+KH,hv,6,.25,46,[.75,.75,.78]);
 const wb=new Builder(3),n=48,wc=[.94,.94,.96];let pr=null;for(let k=0;k<=n;k++){const a=k/n*TAU,p=[0,Math.sin(a)*R_,Math.cos(a)*R_];if(pr){beam(wb,pr,p,.45,wc);beam(wb,[pr[0]+1.4,pr[1],pr[2]],[p[0]+1.4,p[1],p[2]],.3,wc)}pr=p}
 for(let k=0;k<24;k++){const a=k/24*TAU;beam(wb,[0,0,0],[0,Math.sin(a)*R_,Math.cos(a)*R_],.12,[.8,.8,.84])}pcyl(wb,-1,-.0,0,1.6,2.6,10,[.6,.6,.64]);
 const wheel=new THREE.Group(),rim=wb.mesh(mObj);wheel.add(rim);const pods=[];const pb_=new Builder(3);pbox(pb_,0,-1.6,0,2.4,2.2,3.6,[.92,.94,.96]);pbox(pb_,0,-1.2,0,2.5,1.2,3.7,[.4,.6,.78]);const podGeo=pb_.mesh(mObj).geometry;
 for(let k=0;k<24;k++){const a=k/24*TAU,pm=new THREE.Mesh(podGeo,mObj);pm.position.set(.7,Math.sin(a)*(R_+.2),Math.cos(a)*(R_+.2));wheel.add(pm);pods.push(pm)}
 const wp=W(hu,hv);wheel.position.set(wp[0],hy,wp[1]);const g=new THREE.Group();g.add(wheel);chunk(M,g);CITY.wheel={g:wheel,pods,R:R_};
 {const lp=[];for(let k=0;k<48;k++){const a=k/48*TAU;lp.push([0,Math.sin(a)*R_,Math.cos(a)*R_])}const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute(lp.flat(),3));const pts=new THREE.Points(gg,new THREE.PointsMaterial({color:0x9ad0ff,size:4,sizeAttenuation:false}));wheel.add(pts);CITY.wheelLights=pts}
 signBoard(hu+4,hv,Y+KH+2.6,'THE MARLOWE EYE',8,1,-Math.PI/2,'#0c2a4a','#ffffff');CITY.poi.push({n:'THE MARLOWE EYE',u:-672,v:hv});
 /* big screens on the corner buildings of Marlowe Circus */
 const n2=NODE[2][4],hw=NS[2].h,hv2=EW[4].h;const scr=[];for(const[du,dv]of[[1,-1],[-1,1],[-1,-1]]){const cu=n2.u+du*(hw+6),cv=n2.v+dv*(hv2+6);const pl=new THREE.Mesh(new THREE.PlaneGeometry(14,8),new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide}));const p=W(cu-du*1.3,cv-dv*1.3);pl.position.set(p[0],Y+KH+14,p[1]);pl.rotation.y=Math.atan2(-du,-dv);const g2=new THREE.Group();g2.add(pl);
  const fr=new Builder(3);pbox(fr,p[0],Y+KH+9.6,p[1],1.2,.4,1.2,[.1,.1,.12]);g2.add(fr.mesh(mObj));chunk(M,g2);scr.push(pl)}CITY.screens=scr;CITY.poi.push({n:'MARLOWE CIRCUS',u:n2.u+hw+3,v:n2.v-hv2-3})}
function airportPlaza(){const o=PLAZA,t=T(-190,-200),y=Y+KH;
 /* fountain + trees + planters */cy_(t.o,-192,y,-200,6,.7,24,[.6,.6,.62]);cy_(t.o,-192,y+.62,-200,5.3,.1,24,[.3,.55,.72]);cy_(t.o,-192,y,-200,.7,3.4,10,[.75,.75,.78]);cy_(t.o,-192,y+3.4,-200,1.6,.5,12,[.5,.74,.9]);cCirc(-192,-200,6);
 for(let k=0;k<7;k++){tree(-212,-280+k*26,.9,true);lamp(-207,-271+k*26,0,0,false)}for(const v of[-262,-138])for(let u=-205;u<-172;u+=11)tree(u,v,.8,true);
 for(let k=0;k<5;k++)bench(-200,-240+k*20,false);
 /* entrance canopy at the terminal door */bx(t.o,-166.5,y+4.1,-200,7,.4,14,[.2,.3,.5]);for(const s of[-1,1])cy_(t.o,-169.6,y,-200+s*6,.25,4.1,8,[.85,.85,.88]);signBoard(-170.1,-200,y+4.9,'ARRIVALS  ·  DEPARTURES',10,1,Math.PI/2,'#14223a','#ffd24a');
 signBoard(-200,-115,y+5,'WELCOME TO MARLOWE',14,1.8,0,'#101a2a','#e8d890');for(const s of[-6.4,6.4])cy_(t.o,-200+s,y,-115,.15,4.1,6,[.3,.3,.34]);
 /* taxi rank on Terminal Road */streetSign(-214.5,-232,'TAXI RANK',Math.PI/2);for(let k=0;k<3;k++)parked(-219.5,-236-k*7,0,[.06,.06,.07],1);
 /* car park furniture + parked cars */for(let v=-410.5;v<-305;v+=6)for(const u of[-205,-185,-165]){if(rnd()<.55&&!(u===-205&&v>-322))parked(u,v,rnd()<.5?Math.PI/2:-Math.PI/2,pick(CARC))}
 signBoard(-210,-296.5,Y+2.6,'CAR PARK · VALET',6,.8,Math.PI,'#1d3e8a','#ffffff');for(const s of[-2.8,2.8])cy_(t.o,-210+s,Y,-296.5,.08,2.2,5,[.3,.3,.32]);
 CITY.poi.push({n:'MARLOWE AIRPORT',u:-212,v:-205,taxi:1},{n:'HIGH STREET',u:-952,v:-150},{n:'KING\'S AVENUE',u:-430,v:300},{n:'THE DOCKS',u:-600,v:-470},{n:'NORTH QUAY',u:-400,v:1025})}
/* hand the generator to airfields.js */
window.MCITY=function*(m,c){yield*gen(m,c)};
/* arrive: finish building before the doors open */
{const a0=M.arrive;M.arrive=function(sv){if(!M.built){while(!A.pump(M,1e9));}a0(sv)}}
window.MARLOWE={M,OX,OZ,NS,EW,NODE,BLK,RAISE,BRIDGE,nsEdge,ewEdge,lanes,mh,inReg,cResolve,cAdd,KH,LGLOW,LPOOL,RLIGHT,TLAMP,CITY,CHUNKS,get FM(){return FM},get SM(){return SM},get mWater(){return mWater},W,LAND,BUSR,PLAZA,T2,hsh,isShopRoad};
})();
