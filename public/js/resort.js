/* ===== SUNHAVEN BAY: a seaside resort island. Fly in from the village or Marlowe.
   Local frame like every airfield (u = east/west, v = north/south, world = ox+u, oz+v). The airport is in the east;
   the pastel town, the beach and the pier are in the west; Castle Hill and Lighthouse Point in the north; the harbour,
   South Down and the hidden Smuggler's Cove in the south; a shipwreck on a sandbar out in the bay.
   The island has real hills (hAt follows them), turquoise shallows, and you can swim. ===== */
(function(){
const A=window.AIRPORT,AF=window.AIRFIELDS,chunk=A.chunk,TAU=Math.PI*2,Y=G0,SL=Y-2.4,SWIM=SL-1.15;
const RM=A.registerMap({id:'sunhaven',city:'SUNHAVEN BAY',airfield:'SUNHAVEN AIRPORT',ox:-1400,oz:-2700,reg:[-1300,420,-1250,1250],style:'resort',welcome:'WELCOME TO SUNHAVEN BAY'});
const OX=RM.ox,OZ=RM.oz,W=(u,v)=>[OX+u,OZ+v];
RM.gen=window.AIRFIELDGEN;AF.ROUTES.home.push('sunhaven');AF.ROUTES.marlowe.push('sunhaven');AF.ROUTES.sunhaven=['home','marlowe'];
let rs=4242;const rnd=()=>(rs=(rs*16807)%2147483647)/2147483647,rr=(a,b)=>a+rnd()*(b-a),pick=a=>a[(rnd()*a.length)|0];
const hsh=(a,b)=>{let h=(a*374761393+b*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296};
const vn=(u,v,s)=>{const x=u/s,y=v/s,i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),a=hsh(i,j),b=hsh(i+1,j),c=hsh(i,j+1),d=hsh(i+1,j+1);return a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy};
const ss=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
/* ------------------------------------------------------------------ the shape of the island */
const sdBox=(u,v,cu,cv,hw,hh,r)=>{const qx=Math.abs(u-cu)-hw+r,qy=Math.abs(v-cv)-hh+r;return Math.hypot(Math.max(qx,0),Math.max(qy,0))+Math.min(Math.max(qx,qy),0)-r};
const shoreU=v=>-700+9*Math.sin(v/83)+5*Math.sin(v/37+1);              /* where the main beach meets the sea */
const HILLN={u:-430,v:770,r:310,h:32},HILLS={u:-300,v:-830,r:240,h:22},LPT={u:-800,v:930,r:105,h:17},COVE={u:-445,v:-955,r:68},BAR={u:-1010,v:260,r:38};
const HARB={u0:-545,u1:-395,v0:-640,v1:-455};
const SEAB=Y-13;
function H(u,v){
 /* plateau (town + airport) with steep edges, except the west where the beach is */
 const sp=sdBox(u,v,-215,0,385,625,70);let h=sp<0?Y:Y-sp*.42;
 /* the main beach */
 if(u<-598&&v>-590&&v<590){const su=shoreU(v),m=1-ss(530,590,Math.abs(v));let b;if(u>-614)b=Y;else if(u>su){const t=(-614-u)/(-614-su);b=Y-1.3-(Y-1.3-SL+.15)*Math.pow(t,1.15)}else b=SL-.15-(su-u)*.085;b=b*m+h*(1-m);h=Math.max(h,b)}
 /* Castle Hill, South Down, Lighthouse Point and the ridge to it */
 for(const o of[HILLN,HILLS]){const d=Math.hypot(u-o.u,v-o.v)/o.r;const x=d<1?Y+o.h*Math.pow(1-d*d,1.6)+(vn(u,v,40)-.5)*2*(1-d):Y-(d-1)*o.r*.55;h=Math.max(h,x)}
 {const d=Math.hypot(u-LPT.u,v-LPT.v)/LPT.r;h=Math.max(h,d<.75?Y+LPT.h:d<1?Y+LPT.h-(d-.75)*4*LPT.h*.35:Y+LPT.h*.65-(d-1)*LPT.r*1.6)}
 {const ax=-560,az=840,bx=-760,bz=905,t=Math.max(0,Math.min(1,((u-ax)*(bx-ax)+(v-az)*(bz-az))/((bx-ax)**2+(bz-az)**2))),d=Math.hypot(u-(ax+(bx-ax)*t),v-(az+(bz-az)*t));h=Math.max(h,d<42?Y+12-(d/42)**2*6:Y+6-(d-42)*.6)}
 /* Smuggler's Cove: a sandy bowl cut into South Down */
 {const d=Math.hypot(u-COVE.u,v-COVE.v);if(d<COVE.r*1.25){const fl=SL+.35-Math.max(0,(v-COVE.v+COVE.r*.3)*-.04),bowl=fl+Math.pow(d/COVE.r,5)*30;h=Math.min(h,bowl)}}
 /* the harbour basin */
 if(u>HARB.u0&&u<HARB.u1&&v>HARB.v0&&v<HARB.v1)h=Math.min(h,SL-3.2);
 /* sandbar with the wreck */
 {const d=Math.hypot(u-BAR.u,v-BAR.v)/BAR.r;if(d<1.6)h=Math.max(h,SL+.55-d*d*1.8)}
 return Math.max(SEAB,h)}
const PIER={u0:-960,u1:-606,v0:-6,v1:6,e0:-960,e1:-872,ev0:-34,ev1:34};
const onPier=(u,v)=>(u>PIER.u0&&u<PIER.u1&&v>PIER.v0&&v<PIER.v1)||(u>PIER.e0&&u<PIER.e1&&v>PIER.ev0&&v<PIER.ev1);
const inReg=(x,z)=>{const u=x-OX,v=z-OZ;return u>RM.reg[0]&&u<RM.reg[1]&&v>RM.reg[2]&&v<RM.reg[3]};
const walk=(u,v)=>onPier(u,v)?Y:Math.max(H(u,v),SWIM);
{const h0=hAt;hAt=function(x,z){return inReg(x,z)&&RM.built?walk(x-OX,z-OZ):h0(x,z)}}
/* roads */
const NS=[[-235,12,'AIRPORT ROAD'],[-350,10,'CHURCH ROAD'],[-460,12,'HIGH STREET'],[-600,14,'THE ESPLANADE']].map(([u,w,n],i)=>({i,u,w,h:w/2,n,ax:0}));
const EW=[[-380,10,'HARBOUR ROAD'],[-190,10,'ROCK LANE'],[0,14,'PIER APPROACH'],[190,10,'SHELL STREET'],[380,10,'CASTLE ROAD']].map(([v,w,n],j)=>({j,v,w,h:w/2,n,ax:1}));
const onRoad=(u,v)=>{for(const r of NS)if(Math.abs(u-r.u)<r.h+.2&&v>-392&&v<392)return r;for(const r of EW)if(Math.abs(v-r.v)<r.h+.2&&u>-608&&u<-229)return r;return null};
{const d0=dAt;dAt=function(x,z){if(!(inReg(x,z)&&RM.built))return d0(x,z);const u=x-OX,v=z-OZ;if(u>-230||onRoad(u,v)||onPier(u,v)||(u>-614&&u<-600&&Math.abs(v)<590))return 0;const h=H(u,v);return h>SL+1.2&&h<Y+.01&&u>-600?3:8}}
/* ------------------------------------------------------------------ colliders */
const CG=new Map(),CGC=16,ck=(a,b)=>a*8192+b;
function cAdd(o){for(let a=Math.floor(o.u0/CGC);a<=Math.floor(o.u1/CGC);a++)for(let b=Math.floor(o.v0/CGC);b<=Math.floor(o.v1/CGC);b++){const k=ck(a,b);let L=CG.get(k);if(!L)CG.set(k,L=[]);L.push(o)}}
const BOXES=[];const cBox=(u0,u1,v0,v1)=>(BOXES.push([Math.min(u0,u1),Math.max(u0,u1),Math.min(v0,v1),Math.max(v0,v1)]),cAdd({u0:Math.min(u0,u1),u1:Math.max(u0,u1),v0:Math.min(v0,v1),v1:Math.max(v0,v1)}));
const cCirc=(u,v,r)=>cAdd({u0:u-r,u1:u+r,v0:v-r,v1:v+r,r,cu:u,cv:v});
function cResolve(x,z,rad){let u=x-OX,v=z-OZ,hit=0,nx=0,nz=0;const seen=new Set();
 for(let a=Math.floor((u-rad)/CGC);a<=Math.floor((u+rad)/CGC);a++)for(let b=Math.floor((v-rad)/CGC);b<=Math.floor((v+rad)/CGC);b++){const L=CG.get(ck(a,b));if(!L)continue;for(const o of L){if(seen.has(o))continue;seen.add(o);
  if(o.r){const dx=u-o.cu,dz=v-o.cv,d=Math.hypot(dx,dz),m=o.r+rad;if(d<m&&d>1e-4){u=o.cu+dx/d*m;v=o.cv+dz/d*m;nx=dx/d;nz=dz/d;hit=1}continue}
  const cx=Math.max(o.u0,Math.min(o.u1,u)),cz=Math.max(o.v0,Math.min(o.v1,v)),dx=u-cx,dz=v-cz,d=Math.hypot(dx,dz);
  if(d<rad){if(d>1e-4){u=cx+dx/d*rad;v=cz+dz/d*rad;nx=dx/d;nz=dz/d}else{const l=u-o.u0,r_=o.u1-u,b_=v-o.v0,t=o.v1-v,mn=Math.min(l,r_,b_,t);if(mn===l){u=o.u0-rad;nx=-1;nz=0}else if(mn===r_){u=o.u1+rad;nx=1;nz=0}else if(mn===b_){v=o.v0-rad;nx=0;nz=-1}else{v=o.v1+rad;nx=0;nz=1}}hit=1}}}
 return[OX+u,OZ+v,nx,nz,hit]}
{const s0=step;step=function(dt){const x0=GS.x,z0=GS.z,act=!GS.onFoot&&RM.built&&inReg(GS.x,GS.z);s0(dt);if(!act||GS.onFoot)return;
 const u=GS.x-OX,v=GS.z-OZ;if(!onPier(u,v)&&H(u,v)<SL-.35){GS.x=x0;GS.z=z0;GS.vx*=-.25;GS.vz*=-.25;return}
 const fx=Math.sin(GS.psi),fz=Math.cos(GS.psi);let bang=0;for(const off of[1.25,0,-1.25]){const px=GS.x+fx*off,pz=GS.z+fz*off,r=cResolve(px,pz,.95);if(!r[4])continue;GS.x+=r[0]-px;GS.z+=r[1]-pz;const n_=GS.vx*r[2]+GS.vz*r[3];if(n_<0){GS.vx-=n_*r[2]*1.3;GS.vz-=n_*r[3]*1.3;GS.vx*=.92;GS.vz*=.92;bang=Math.max(bang,-n_)}}if(bang>3)beep(70,.22,'sawtooth',.12)}}
const ST={swim:0};
{const f0=stepFoot;stepFoot=function(dt){const sw=RM.built&&inReg(P.x,P.z)&&!onPier(P.x-OX,P.z-OZ)&&H(P.x-OX,P.z-OZ)<SWIM+.05;if(sw)P.speed=Math.min(P.speed,2.4);f0(dt);if(!RM.built||!inReg(P.x,P.z))return;const r=cResolve(P.x,P.z,.36);P.x=r[0];P.z=r[1];
 ST.swim=sw?1:0;if(sw)P.y=SWIM+Math.sin(performance.now()/420)*.06}}
/* ------------------------------------------------------------------ builders */
const PAL=[['#bfe6d0','#3a7a5a'],['#f4c2c8','#b04a5a'],['#f6e3a0','#c07a1a'],['#bcdcf0','#2a5a9a'],['#f4f2ea','#2a6a8a'],['#d8c8ec','#6a4a9a'],['#f6c9a4','#c0502a'],['#9ed6c8','#1a6a6a']];
const ATL=A.cvx?A.cvx(256,1024,(g)=>{PAL.forEach(([wall,sh],r)=>{for(let c=0;c<2;c++){const x=c*128,y=r*128;g.fillStyle=wall;g.fillRect(x,y,128,128);g.fillStyle='rgba(0,0,0,.05)';for(let k=0;k<128;k+=8)g.fillRect(x,y+k,128,1);
  g.fillStyle='rgba(255,255,255,.55)';g.fillRect(x,y+120,128,8);
  if(c===0){g.fillStyle='#f8f8f4';g.fillRect(x+34,y+22,60,72);g.fillStyle='#2a4a6a';g.fillRect(x+40,y+28,48,60);g.fillStyle='#86b4d8';g.fillRect(x+42,y+30,20,26);g.fillRect(x+66,y+30,20,26);g.fillStyle='#f8f8f4';g.fillRect(x+62,y+28,4,60);g.fillRect(x+40,y+56,48,4);
   g.fillStyle=sh;g.fillRect(x+18,y+24,14,68);g.fillRect(x+96,y+24,14,68);g.fillStyle='rgba(0,0,0,.18)';for(let k=0;k<6;k++){g.fillRect(x+18,y+30+k*10,14,2);g.fillRect(x+96,y+30+k*10,14,2)}
   g.fillStyle='#8a5a3a';g.fillRect(x+32,y+96,64,8);for(let k=0;k<6;k++){g.fillStyle=['#e83a5a','#f0d040','#ffffff','#ff8a3a'][k%4];g.beginPath();g.arc(x+38+k*10,y+94,4,0,TAU);g.fill()}g.fillStyle='#3a8a3a';g.fillRect(x+34,y+96,60,3)}
  else{g.fillStyle=sh;g.fillRect(x+14,y+20,46,100);g.fillStyle='rgba(255,255,255,.25)';g.fillRect(x+20,y+28,34,40);g.fillStyle='#ffd24a';g.beginPath();g.arc(x+52,y+76,3,0,TAU);g.fill();
   g.fillStyle='#f8f8f4';g.fillRect(x+70,y+30,50,62);g.fillStyle='#2a4a6a';g.fillRect(x+74,y+34,42,54);g.fillStyle='#9ac4e4';g.fillRect(x+76,y+36,38,24);g.fillStyle='#f8f8f4';g.fillRect(x+94,y+34,3,54)}}})}):null;
ATL.magFilter=THREE.NearestFilter;
const FM=wmat([1.06,1.06,1.06],{vertexColors:true},ATL);
function TBld(){return{p:[],t:[],c:[],q(A_,B_,C_,D_,u0,v0,u1,v1,col){this.p.push(...A_,...B_,...C_,...A_,...C_,...D_);this.t.push(u0,v0,u1,v0,u1,v1,u0,v0,u1,v1,u0,v1);for(let i=0;i<6;i++)this.c.push(...col)},mesh(m){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(this.t,2));g.setAttribute('color',new THREE.Float32BufferAttribute(this.c,3));return new THREE.Mesh(g,m)}}}
/* tiles: each 300m square gets its own merged meshes and is culled by distance */
const TL=300,TILES=new Map(),CHUNKS=[];
function T(u,v){const a=Math.floor((u+1300)/TL),b=Math.floor((v+1250)/TL),k=a*100+b;let t=TILES.get(k);if(!t)TILES.set(k,t={a,b,o:new Builder(3),r:new Builder(2),f:TBld(),x:[]});return t}
const bx=(u,y,v,w,h,d,col,rot)=>{const p=W(u,v);pbox(T(u,v).o,p[0],y,p[1],w,h,d,col,rot||0)};
const cy=(u,y,v,r,h,sg,col)=>{const p=W(u,v);pcyl(T(u,v).o,p[0],y,p[1],r,h,sg,col)};
const cn=(u,y,v,r,h,sg,col,rot)=>{const p=W(u,v);pcone(T(u,v).o,p[0],y,p[1],r,h,sg,col,rot||0)};
const tri=(u,a,b,c,col)=>T(u[0],u[1]).o.tri(a,b,c,col,col,col,true);
const P3=(u,y,v)=>{const p=W(u,v);return[p[0],y,p[1]]};
const flat=(u0,v0,u1,v1,col,y,road)=>{const t=T((u0+u1)/2,(v0+v1)/2);quadXZ(road?t.r:t.o,W(u0,v0),W(u1,v0),W(u1,v1),W(u0,v1),col,y)};
const special=(u,v,obj)=>T(u,v).x.push(obj);
function sign(u,v,y,txt,w,h,ry,bg,fg,font){const tx=A.cvx(1024,Math.max(64,Math.round(1024*h/w)),(g,W_,H_)=>{g.fillStyle=bg;g.fillRect(0,0,W_,H_);g.strokeStyle=fg;g.lineWidth=Math.max(4,H_*.06);g.strokeRect(g.lineWidth,g.lineWidth,W_-2*g.lineWidth,H_-2*g.lineWidth);g.fillStyle=fg;g.font='bold '+Math.round(H_*.56)+'px '+(font||'Georgia,serif');g.textAlign='center';g.textBaseline='middle';g.fillText(txt,W_/2,H_/2+2)});
 const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),wmat([1.1,1.1,1.1],{vertexColors:false},tx)),p=W(u,v);m.position.set(p[0],y,p[1]);m.rotation.y=ry||0;special(u,v,m);return m}
const POI=[];const poi=(n,u,v,ic)=>POI.push({n,u,v,ic});
/* lights that come on at night */
const NL=[],NLB=[];
/* building: pastel terrace with a pitched roof; front = side facing the street ('s','n','e','w') */
const SHADE={s:1,n:.8,e:.92,w:.86};
function house(u0,v0,u1,v1,fl,pal,front,o){o=o||{};const t=T((u0+u1)/2,(v0+v1)/2),y0=o.y0!=null?o.y0:Y,FH=3.2,top=y0+fl*FH,row=pal*128/1024;
 const sides=[['s',[u0,v0],[u1,v0]],['e',[u1,v0],[u1,v1]],['n',[u1,v1],[u0,v1]],['w',[u0,v1],[u0,v0]]];
 for(const[k,a,b]of sides){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(L/3.3)),sh=SHADE[k],col=[sh,sh,sh];
  for(let i=0;i<n;i++){const f0=i/n,f1=(i+1)/n,pa=[a[0]+(b[0]-a[0])*f0,a[1]+(b[1]-a[1])*f0],pb_=[a[0]+(b[0]-a[0])*f1,a[1]+(b[1]-a[1])*f1];
   for(let f=0;f<fl;f++){const gf=f===0&&(k===front||o.allShop),c0=gf?.5:0,y_=y0+f*FH;const A_=P3(pa[0],y_,pa[1]),B_=P3(pb_[0],y_,pb_[1]),C_=P3(pb_[0],y_+FH,pb_[1]),D_=P3(pa[0],y_+FH,pa[1]);t.f.q(A_,B_,C_,D_,c0,1-row-1/8,c0+.5,1-row,col)}}}
 const rc=o.roof||pick([[.72,.34,.24],[.36,.38,.44],[.62,.3,.22],[.3,.44,.5]]),ridgeU=(u1-u0)>(v1-v0),rh=o.flat?0:Math.min(3.2,Math.min(u1-u0,v1-v0)*.42),wc=PAL[pal][0],wcv=[parseInt(wc.slice(1,3),16)/255,parseInt(wc.slice(3,5),16)/255,parseInt(wc.slice(5,7),16)/255];
 if(o.flat){flat(u0-.2,v0-.2,u1+.2,v1+.2,[.86,.86,.84],top+.05);bx((u0+u1)/2,top,(v0+v1)/2,u1-u0+.5,.6,v1-v0+.5,[.95,.95,.93])}
 else if(ridgeU){const vm=(v0+v1)/2,a=P3(u0-.3,top,v0-.4),b=P3(u1+.3,top,v0-.4),c=P3(u1+.3,top+rh,vm),d=P3(u0-.3,top+rh,vm),e=P3(u0-.3,top,v1+.4),f=P3(u1+.3,top,v1+.4);t.o.tri(a,b,c,rc,rc,rc,true);t.o.tri(a,c,d,rc,rc,rc,true);const r2=rc.map(x=>x*.82);t.o.tri(f,e,d,r2,r2,r2,true);t.o.tri(f,d,c,r2,r2,r2,true);
  for(const uu of[u0,u1]){t.o.tri(P3(uu,top,v0),P3(uu,top,v1),P3(uu,top+rh,vm),wcv,wcv,wcv,true)}}
 else{const um=(u0+u1)/2,a=P3(u0-.4,top,v0-.3),b=P3(um,top+rh,v0-.3),c=P3(um,top+rh,v1+.3),d=P3(u0-.4,top,v1+.3),e=P3(u1+.4,top,v0-.3),f=P3(u1+.4,top,v1+.3);t.o.tri(a,b,c,rc,rc,rc,true);t.o.tri(a,c,d,rc,rc,rc,true);const r2=rc.map(x=>x*.82);t.o.tri(e,f,c,r2,r2,r2,true);t.o.tri(e,c,b,r2,r2,r2,true);
  for(const vv of[v0,v1]){t.o.tri(P3(u0,top,vv),P3(u1,top,vv),P3(um,top+rh,vv),wcv,wcv,wcv,true)}}
 if(!o.flat&&rnd()<.7)bx(u0+(u1-u0)*rr(.2,.8),top+rh*.4,v0+(v1-v0)*rr(.3,.7),.9,rh*.8+1.2,.9,[.6,.42,.34]);
 cBox(u0,u1,v0,v1);return top}
function awning(u,v,len,ry,cols){const n=Math.max(3,Math.round(len/.9));for(let i=0;i<n;i++){const f=(i+.5)/n-.5,du=Math.cos(ry)*f*len,dv=-Math.sin(ry)*f*len,p=W(u+du,v+dv);pbox(T(u,v).o,p[0],Y+2.7,p[1],len/n+.02,.35,1.6,i%2?cols[0]:cols[1],ry)}}
function palm(u,v,s){s=s||1;const t=T(u,v),h=7*s,lean=rr(-.6,.6),lean2=rr(-.6,.6);let pu=u,pv=v,py=Y;for(let k=0;k<5;k++){const nu=u+lean*(k+1)*(k+1)*.06*s,nv=v+lean2*(k+1)*(k+1)*.06*s,ny=Y+h*(k+1)/5,p=W(pu,pv);pcyl(t.o,p[0],py,p[1],.22*s*(1-k*.08),h/5+.05,6,k%2?[.55,.42,.28]:[.5,.38,.25]);pu=nu;pv=nv;py=ny}
 const top=P3(pu,py,pv),gr=[[.25,.55,.2],[.3,.62,.22],[.22,.5,.18]];for(let k=0;k<8;k++){const a=k/8*TAU+rnd(),L=3.2*s,tipy=py-1.2*s,mid=[top[0]+Math.cos(a)*L*.55,py+.5*s,top[2]+Math.sin(a)*L*.55],tip=[top[0]+Math.cos(a)*L,tipy,top[2]+Math.sin(a)*L],sd=[-Math.sin(a)*.6*s,0,Math.cos(a)*.6*s],c=gr[k%3];
  t.o.tri(top,[mid[0]+sd[0],mid[1],mid[2]+sd[2]],mid,c,c,c,true);t.o.tri(top,mid,[mid[0]-sd[0],mid[1],mid[2]-sd[2]],c,c,c,true);t.o.tri(mid,[mid[0]+sd[0],mid[1],mid[2]+sd[2]],tip,c,c,c,true);t.o.tri(mid,tip,[mid[0]-sd[0],mid[1],mid[2]-sd[2]],c,c,c,true)}
 for(let k=0;k<3;k++){const a=k/3*TAU;pbox(t.o,top[0]+Math.cos(a)*.25,py-.45,top[2]+Math.sin(a)*.25,.28,.28,.28,[.45,.32,.18])}cCirc(u,v,.4)}
function pine(u,v,s){const h=H(u,v),t=T(u,v),p=W(u,v);pcyl(t.o,p[0],h,p[1],.25*s,2*s,6,[.4,.28,.2]);pcone(t.o,p[0],h+1.4*s,p[1],2.2*s,3.4*s,7,[.18,.4,.24],rnd());pcone(t.o,p[0],h+3.2*s,p[1],1.6*s,2.8*s,7,[.2,.45,.26],rnd());cCirc(u,v,.4)}
function lamp(u,v,ry){const p=W(u,v),t=T(u,v);pcyl(t.o,p[0],Y,p[1],.09,4.2,6,[.12,.24,.3]);pbox(t.o,p[0],Y+4.1,p[1],.42,.5,.42,[.95,.92,.7]);pcone(t.o,p[0],Y+4.6,p[1],.34,.4,6,[.12,.24,.3]);NL.push([p[0],Y+4.35,p[1]]);cCirc(u,v,.2)}
function bench(u,v,ry){const p=W(u,v),t=T(u,v),c=Math.cos(ry),s=Math.sin(ry);pbox(t.o,p[0],Y+.45,p[1],1.8,.08,.5,[.72,.52,.32],ry);pbox(t.o,p[0]-s*.22,Y+.5,p[1]-c*.22,1.8,.5,.06,[.72,.52,.32],ry);for(const k of[-.8,.8])pbox(t.o,p[0]+c*k,Y,p[1]-s*k,.08,.45,.45,[.15,.2,.24],ry)}
function rock(u,v,s,col){const h=H(u,v),p=W(u,v);poct(T(u,v).o,p[0],h+s*.3,p[1],s,s*.7,s*.9,col||[.5,.48,.44],.4)}
/* ------------------------------------------------------------------ the generator */
function* gen(m){
 /* sea */{const seaT=A.cvx(256,256,(g,w,h)=>{g.fillStyle='#2a9ab8';g.fillRect(0,0,w,h);for(let k=0;k<420;k++){g.fillStyle='rgba(255,255,255,'+(.04+Math.random()*.1)+')';g.fillRect(Math.random()*w,Math.random()*h,2+Math.random()*10,1+Math.random()*2)}});seaT.wrapS=seaT.wrapT=THREE.RepeatWrapping;seaT.repeat.set(60,60);
  const sea=new THREE.Mesh(new THREE.PlaneGeometry(5200,5200).rotateX(-Math.PI/2),wmat([.82,1,1.02],{vertexColors:false,transparent:true,opacity:.78,depthWrite:false},seaT));const p=W(-400,0);sea.position.set(p[0],SL,p[1]);sea.renderOrder=2;const g=new THREE.Group();g.add(sea);chunk(m,g);RS.sea=sea}
 yield;
 /* terrain: flat plateau cells are merged, everything else is a 10m grid */
 {const CS=10,u0=-1290,v0=-1240,nu=170,nv=248,HG=new Float32Array((nu+1)*(nv+1));for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++)HG[i*(nv+1)+j]=H(u0+i*CS,v0+j*CS);const hg=(i,j)=>HG[i*(nv+1)+j];
  const colAt=(u,v,h,sl)=>{const n=vn(u,v,23)*.12-.06,n2=vn(u,v,7)*.06;if(h<SL-.2){const d=Math.min(1,(SL-h)/9);return[.86-d*.5+n2,.82-d*.38+n2,.62-d*.12+n2]}
   const beach=(u<-604&&Math.abs(v)<600)||Math.hypot(u-COVE.u,v-COVE.v)<COVE.r*1.05||Math.hypot(u-BAR.u,v-BAR.v)<BAR.r*1.6;if(beach&&h<Y-.6||h<SL+.5){const wet=ss(SL+.7,SL,h);return[.95-wet*.18+n2,.87-wet*.17+n2,.64-wet*.12+n2]}
   if(sl>.55)return[.58+n,.55+n,.5+n];const hi=ss(Y+4,Y+26,h);return[.42+n-hi*.04+n2,.66+n-hi*.08,.3+n*.5+hi*.04]};
  for(let i=0;i<nu;i++){for(let j=0;j<nv;j++){const a=hg(i,j),b=hg(i+1,j),c=hg(i+1,j+1),d=hg(i,j+1);if(Math.max(a,b,c,d)<SL-6.5)continue;const u=u0+i*CS,v=v0+j*CS;
    if(a===Y&&b===Y&&c===Y&&d===Y&&u>-598)continue;
    const sl=Math.max(Math.abs(b-a),Math.abs(d-a),Math.abs(c-b))/CS,t=T(u+5,v+5),P_=(du,dv,h)=>{const p=W(u+du,v+dv);return[p[0],h,p[1]]};
    t.o.tri(P_(0,0,a),P_(CS,0,b),P_(CS,CS,c),colAt(u,v,a,sl),colAt(u+CS,v,b,sl),colAt(u+CS,v+CS,c,sl),true);t.o.tri(P_(0,0,a),P_(CS,CS,c),P_(0,CS,d),colAt(u,v,a,sl),colAt(u+CS,v+CS,c,sl),colAt(u,v+CS,d,sl),true)}if(i%20===19)yield}
  /* flat plateau as 50m tiles with slightly varied greens */
  for(let u=-598;u<170;u+=50)for(let v=-620;v<620;v+=50){const u1=Math.min(u+50,170),v1=Math.min(v+50,620);let ok=true;for(const[uu,vv]of[[u,v],[u1,v],[u1,v1],[u,v1],[(u+u1)/2,(v+v1)/2]])if(H(uu,vv)!==Y)ok=false;if(!ok){for(let a=u;a<u1;a+=10)for(let b=v;b<v1;b+=10){if(H(a,b)===Y&&H(a+10,b)===Y&&H(a+10,b+10)===Y&&H(a,b+10)===Y){const n=vn(a,b,30)*.1-.05;flat(a,b,a+10,b+10,[.43+n,.66+n,.3+n*.5],Y)}}continue}
   const n=vn(u,v,90)*.1-.05;flat(u,v,u1,v1,[.43+n,.66+n,.3+n*.5],Y)}}
 yield;
 /* foam along the main beach and the cove */{const ft=A.cvx(64,64,(g,w,h)=>{const gr=g.createLinearGradient(0,0,w,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h)});
  const pts=[];for(let v=-580;v<=580;v+=6)pts.push([shoreU(v),v]);const pos=[],uv=[];for(let i=0;i<pts.length-1;i++){const[a,b]=[pts[i],pts[i+1]];for(const[du0,du1,k]of[[-3,3,0]]){const A_=W(a[0]+du0,a[1]),B_=W(a[0]+du1,a[1]),C_=W(b[0]+du1,b[1]),D_=W(b[0]+du0,b[1]);pos.push(A_[0],SL+.04,A_[1],B_[0],SL+.04,B_[1],C_[0],SL+.04,C_[1],A_[0],SL+.04,A_[1],C_[0],SL+.04,C_[1],D_[0],SL+.04,D_[1]);uv.push(0,0,1,0,1,1,0,0,1,1,0,1)}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));const fm=new THREE.MeshBasicMaterial({map:ft,transparent:true,depthWrite:false,opacity:.8,side:THREE.DoubleSide});const mesh=new THREE.Mesh(g,fm);mesh.renderOrder=3;const gg=new THREE.Group();gg.add(mesh);chunk(m,gg);RS.foam=mesh}
 /* roads, pavements, the promenade */
 const RW=[.22,.22,.24],PV=[.82,.78,.7],WT=[.95,.95,.92],YL=[.95,.78,.1];
 for(const r of NS){const a=-392,b=392;for(let v=a;v<b;v+=40){const v1=Math.min(b,v+40);flat(r.u-r.h,v,r.u+r.h,v1,RW,Y+.04,1);for(let k=v;k<v1;k+=8)flat(r.u-.12,k,r.u+.12,k+4,WT,Y+.06,1);if(r.i!==3){flat(r.u-r.h-3,v,r.u-r.h,v1,PV,Y+.03);flat(r.u+r.h,v,r.u+r.h+3,v1,PV,Y+.03)}else flat(r.u+r.h,v,r.u+r.h+3,v1,PV,Y+.03)}}
 for(const r of EW){for(let u=-607;u<-229;u+=40){const u1=Math.min(-229,u+40);flat(u,r.v-r.h,u1,r.v+r.h,RW,Y+.045,1);for(let k=u;k<u1;k+=8)flat(k,r.v-.12,k+4,r.v+.12,WT,Y+.065,1);flat(u,r.v-r.h-3,u1,r.v-r.h,PV,Y+.03);flat(u,r.v+r.h,u1,r.v+r.h+3,PV,Y+.03)}}
 /* esplanade promenade: wide paving with a blue railing, lamps and palms along the sea wall */
 for(let v=-590;v<590;v+=30){const v1=Math.min(590,v+30);flat(-614,v,-607,v1,[.88,.84,.74],Y+.035);for(let k=v;k<v1;k+=3)flat(-614,k,-607,k+1.5,[.84,.8,.7],Y+.037)}
 for(let v=-588;v<588;v+=2.5){bx(-614.3,Y,v,.12,1.0,.12,[.15,.55,.75])}for(let v=-588;v<588;v+=24)bx(-614.3,Y+.95,v+12,.14,.1,24,[.15,.55,.75]);
 {const sw=[.75,.7,.6];for(let v=-588;v<588;v+=24)bx(-614.6,Y-1.9,v+12,.7,1.95,24,sw)}cBox(-615,-614.1,-590,-6.2);cBox(-615,-614.1,6.2,590);
 for(let v=-570;v<=570;v+=30){if(Math.abs(v)<12)continue;lamp(-612,v,0);if(Math.abs(v%60)<1)palm(-609.5,v+15,rr(.9,1.15));else bench(-611,v+15,Math.PI/2)}
 /* steps down to the sand */for(const v of[-450,-250,-90,90,250,450]){for(let k=0;k<5;k++)bx(-616-k*.6,Y-1.3+.26*(4-k)-.26,v,.6,.26,3.2,[.8,.76,.66])}
 yield;
 /* ---- the town blocks ---- */
 const COLS=[[NS[0],NS[1]],[NS[1],NS[2]],[NS[2],NS[3]]],ROWS=[[EW[0],EW[1]],[EW[1],EW[2]],[EW[2],EW[3]],[EW[3],EW[4]]];
 const SPEC={'2,1':'shops','2,2':'hotel','1,2':'green','2,3':'golf','1,3':'church','0,0':'station','2,0':'bnb','1,0':'market'};
 for(let c=0;c<3;c++)for(let r=0;r<4;r++){const[E,Wr]=COLS[c],[S,N]=ROWS[r],b={u0:Wr.u+Wr.h+3,u1:E.u-E.h-3,v0:S.v+S.h+3,v1:N.v-N.h-3,c,r},sp=SPEC[c+','+r];
  flat(b.u0,b.v0,b.u1,b.v1,[.86,.84,.78],Y+.02);if(sp)yield*specialBlock(b,sp);else terraces(b);yield}
 yield*landmarks(m);
 /* glowing lights at night */{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(NL.flat(),3));RS.lights=new THREE.Points(g,new THREE.PointsMaterial({color:0xffe6a0,size:5,sizeAttenuation:false,fog:false}));
  const g2=new THREE.BufferGeometry();g2.setAttribute('position',new THREE.Float32BufferAttribute(NLB.flat(),3));RS.bulbs=new THREE.Points(g2,new THREE.PointsMaterial({vertexColors:false,color:0xfff2c0,size:3,sizeAttenuation:false,fog:false}));const gg=new THREE.Group();gg.add(RS.lights,RS.bulbs);chunk(m,gg)}
 /* flush every tile */
 for(const t of TILES.values()){const g=new THREE.Group();if(t.o.p.length)g.add(t.o.mesh(mObj));if(t.r.p.length)g.add(t.r.mesh(mRoad));if(t.f.p.length)g.add(t.f.mesh(FM));for(const x of t.x)g.add(x);g.userData.cx=OX-1300+(t.a+.5)*TL;g.userData.cz=OZ-1250+(t.b+.5)*TL;chunk(m,g);CHUNKS.push(g);yield}
 RS.built=1;if(RS.onBuilt)RS.onBuilt()}
function terraces(b){const{u0,u1,v0,v1}=b;let pal=(b.c*3+b.r)%8;
 /* along the long west/east frontages (NS streets) */
 for(const[side,uu,dir]of[['w',u0,1],['e',u1,-1]]){let v=v0+1;while(v<v1-8){const w=rr(7,10),fl=rnd()<.25?3:2,d=rr(9,12);const a=side==='w'?uu:uu-d,bq=side==='w'?uu+d:uu;house(a,v,bq,v+w,fl,pal=(pal+1+((rnd()*3)|0))%8,side,{});v+=w+(rnd()<.18?6:0)}}
 /* along the short south/north frontages */
 for(const[side,vv]of[['s',v0],['n',v1]]){let u=u0+13;while(u<u1-21){const w=rr(7,10),d=rr(8,10),fl=2;const a=side==='s'?vv:vv-d,bq=side==='s'?vv+d:vv;house(u,a,u+w,bq,fl,pal=(pal+3)%8,side,{});u+=w}}
 /* gardens in the middle */const cu=(u0+u1)/2,cv=(v0+v1)/2;flat(u0+13,v0+12,u1-13,v1-12,[.42,.64,.3],Y+.025);for(let k=0;k<6;k++){const u=rr(u0+16,u1-16),v=rr(v0+15,v1-15);if(rnd()<.5)palm(u,v,rr(.7,.9));else{const p=W(u,v);pcyl(T(u,v).o,p[0],Y,p[1],.2,2,6,[.4,.3,.2]);poct(T(u,v).o,p[0],Y+2.8,p[1],1.8,1.5,1.8,[.3,.56,.26],.3);cCirc(u,v,.4)}}}
const SHOPS=[];
function shop(u0,v0,u1,v1,name,pal,front,col,o){const top=house(u0,v0,u1,v1,2,pal,front,{});const cu=(u0+u1)/2,cv=(v0+v1)/2,len=front==='w'||front==='e'?v1-v0:u1-u0,ry=front==='w'?-Math.PI/2:front==='e'?Math.PI/2:front==='s'?Math.PI:0;
 const fu=front==='w'?u0-.8:front==='e'?u1+.8:cu,fv=front==='s'?v0-.8:front==='n'?v1+.8:cv;awning(fu,fv,len-.6,ry+Math.PI/2*(front==='w'||front==='e'?1:0)*0,col);
 sign(front==='w'?u0-.06:front==='e'?u1+.06:cu,front==='s'?v0-.06:front==='n'?v1+.06:cv,Y+3.8,name,Math.min(len-1,10),1,ry,col[0],'#ffffff');
 const du=front==='w'?-2.2:front==='e'?2.2:0,dv=front==='s'?-2.2:front==='n'?2.2:0;SHOPS.push(Object.assign({n:name,u:cu+du+(front==='w'?u0-cu:front==='e'?u1-cu:0),v:cv+dv+(front==='s'?v0-cv:front==='n'?v1-cv:0)},o||{}));return top}
const css=a=>'#'+a.map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('');
function* specialBlock(b,sp){const{u0,u1,v0,v1}=b,cu=(u0+u1)/2,cv=(v0+v1)/2;
 if(sp==='shops'){/* seafront: fish & chips, ice cream parlour, rock shop, arcade (facing the Esplanade, west side) */
  const L=[['SANDY\'S FISH & CHIPS',[[.1,.3,.6],[.95,.95,.95]],'chips'],['GELATO BELLA',[[.9,.4,.6],[.98,.95,.9]],'ice'],['SUNHAVEN ROCK CO.',[[.85,.2,.3],[.98,.98,.98]],'rock'],['GOLDEN SANDS ARCADE',[[.7,.5,.1],[.2,.1,.4]],'arcade'],['THE SALTY DOG',[[.1,.4,.3],[.95,.9,.7]],'pub']];
  let v=v0+2;for(const[n,c,k]of L){const w=k==='arcade'?28:24;shop(u0,v,u0+16,v+w,n,(SHOPS.length*3)%8,'w',[css(c[0]),css(c[1])],{k});v+=w+4}
  terraces({u0:u0+24,u1,v0,v1,c:9,r:9})}
 else if(sp==='hotel'){/* THE GRAND HOTEL: big white seafront hotel with a green roof and flags */
  const a=u0,b2=u0+40,c0=v0+10,c1=v1-10;house(a,c0,b2,c1,5,4,'w',{roof:[.2,.5,.42]});sign(a-.08,cv,Y+17,'THE GRAND HOTEL',26,2.6,-Math.PI/2,'#1a3a5a','#ffe9a8');
  for(const vv of[c0+8,cv,c1-8]){cy(a-3,Y,vv,.25,3.4,8,[.95,.95,.92])}bx(a-3,Y+3.4,cv,4,.35,c1-c0-12,[.2,.5,.42]);
  for(const vv of[c0+4,c1-4]){const p=W(a+20,vv);cy(a+20,Y+16+3.2,vv,.07,6,4,[.9,.9,.9]);bx(a+20.7,Y+16+8,vv,1.4,.9,.05,[.9,.2,.2])}
  SHOPS.push({n:'THE GRAND HOTEL',u:a-2.4,v:cv,k:'hotel'});terraces({u0:b2+8,u1,v0,v1,c:7,r:7})}
 else if(sp==='green'){/* the town green with a bandstand */flat(u0,v0,u1,v1,[.45,.68,.32],Y+.025);const p=W(cu,cv);cy(cu,Y,cv,6,.7,12,[.95,.95,.92]);for(let k=0;k<8;k++){const a=k/8*TAU;cy(cu+Math.cos(a)*5.4,Y+.7,cv+Math.sin(a)*5.4,.14,3.2,6,[.95,.95,.92])}cn(cu,Y+3.9,cv,6.6,2.6,8,[.2,.5,.45],Math.PI/8);cCirc(cu,cv,6);
  for(let k=0;k<14;k++){const a=k/14*TAU;palm(cu+Math.cos(a)*34,cv+Math.sin(a)*60,rr(.8,1))}for(let k=0;k<8;k++){const a=k/8*TAU+.2;bench(cu+Math.cos(a)*14,cv+Math.sin(a)*14,a+Math.PI/2)}
  {const fl=[[.95,.3,.4],[.98,.85,.2],[.7,.4,.9],[.95,.95,.95]];for(let k=0;k<60;k++){const a=rnd()*TAU,r=rr(20,26);bx(cu+Math.cos(a)*r,Y,cv+Math.sin(a)*r*1.6,.5,.25,.5,pick(fl))}}poi('THE TOWN GREEN',cu,cv,'🎵')}
 else if(sp==='golf'){/* CRAZY GOLF facing the Esplanade */flat(u0,v0,u1-30,v1,[.3,.62,.3],Y+.025);const gc=[.2,.55,.25];for(let k=0;k<6;k++){const hu=u0+8+(k%2)*28,hv=v0+14+Math.floor(k/2)*52;flat(hu,hv,hu+20,hv+36,[.24,.66,.3],Y+.04);bx(hu,Y,hv+18,.4,.4,36.4,[.85,.85,.85]);bx(hu+20,Y,hv+18,.4,.4,36.4,[.85,.85,.85])}
  /* windmill */const wu=u0+38,wv=v0+70;cy(wu,Y,wv,2.4,5,8,[.9,.86,.78]);cn(wu,Y+5,wv,2.8,2.4,8,[.7,.3,.2]);RS.mill={u:wu,v:wv};cCirc(wu,wv,2.6);
  /* a lighthouse, a pirate ship and a volcano obstacle */cy(u0+10,Y,v0+150,1,4,8,[.95,.95,.95]);cy(u0+10,Y+2,v0+150,1.02,1,8,[.85,.2,.2]);bx(u0+36,Y,v0+125,5,1.6,2,[.5,.32,.18]);cy(u0+36,Y+1.6,v0+125,.1,4,4,[.4,.3,.2]);cn(u0+18,Y,v0+40,3,3,8,[.5,.4,.32]);
  sign(u0-.1,v0+30,Y+3.2,'SUNHAVEN CRAZY GOLF',12,1.6,-Math.PI/2,'#1a5a2a','#ffe060');SHOPS.push({n:'CRAZY GOLF',u:u0-2,v:v0+30,k:'golf'});terraces({u0:u1-28,u1,v0,v1,c:5,r:5});poi('CRAZY GOLF',u0,v0+30,'⛳')}
 else if(sp==='church'){const a=cu-8,b2=cu+8;house(a,cv-20,b2,cv+14,3,4,'s',{roof:[.4,.42,.46]});const tu=cu,tv=cv-26;house(tu-4.5,tv-4.5,tu+4.5,tv+4.5,5,4,'s',{flat:1});cn(tu,Y+16.6,tv,4.4,12,4,[.36,.4,.44],Math.PI/4);sign(tu,tv-4.6,Y+3.8,'ST PETROC\'S',7,.9,Math.PI,'#2a2418','#e8d8a0');
  for(let k=0;k<10;k++)rock(cu+rr(-20,20),cv+rr(16,40),.45,[.7,.7,.68]);terraces({u0,u1,v0:cv+44,v1,c:3,r:3});poi('ST PETROC\'S CHURCH',tu,tv-6,'⛪')}
 else if(sp==='station'){/* the bus & coach station by the airport road */flat(u0,v0,u1,v1,[.3,.3,.32],Y+.03);for(let k=0;k<5;k++){bx(u1-6,Y,v0+20+k*28,2,3,14,[.85,.85,.8]);bx(u1-6,Y+3,v0+20+k*28,4,.25,16,[.95,.7,.2])}sign(u1-1,cv,Y+5,'SUNHAVEN COACH STATION',16,1.6,Math.PI/2,'#1a3a6a','#ffffff');poi('COACH STATION',u1+2,cv,'🚌');terraces({u0,u1:u0+30,v0,v1,c:1,r:1})}
 else if(sp==='bnb'){shop(u0,v0+20,u0+18,v0+44,'SEAVIEW B&B',2,'w',['#2a6a8a','#ffffff'],{k:'bnb'});terraces({u0:u0+26,u1,v0,v1,c:4,r:4});house(u0,v0+52,u0+16,v0+70,3,5,'w',{});house(u0,v0+74,u0+16,v0+92,3,7,'w',{})}
 else if(sp==='market'){/* fish market by the harbour */flat(u0,v0,u1,v1,[.7,.68,.62],Y+.025);bx(cu,Y,cv-30,40,5,18,[.86,.84,.8]);bx(cu,Y+5,cv-30,42,.6,20,[.3,.4,.5]);cBox(cu-20,cu+20,cv-39,cv-21);sign(cu,cv-39.1,Y+4,'FISH MARKET',14,1.6,Math.PI,'#1a3a5a','#ffffff');SHOPS.push({n:'FISH MARKET',u:cu,v:cv-41.5,k:'fishmkt'});
  terraces({u0,u1,v0:cv-10,v1,c:2,r:2})}
 yield}
function* landmarks(m){
 /* ---- the pier ---- */
 const dk=[.66,.5,.34],rl=[.95,.95,.95],pile=[.32,.26,.2];
 for(let u=PIER.u0;u<PIER.u1;u+=6){bx(u+3,Y-.25,0,6.05,.25,12,u%12?dk:[.62,.46,.3])}for(let u=PIER.e0;u<PIER.e1;u+=6)bx(u+3,Y-.25,0,6.05,.25,68,dk);
 for(let u=PIER.u0+2;u<PIER.u1;u+=8)for(const s of[-5.4,5.4])cy(u,SEAB,s,.32,Y-SEAB-.2,6,pile);for(let u=PIER.e0+3;u<PIER.e1;u+=10)for(let s=-30;s<=30;s+=10)cy(u,SEAB,s,.4,Y-SEAB-.2,6,pile);
 for(const s of[-6,6]){for(let u=PIER.e1;u<PIER.u1;u+=2)bx(u,Y,s,.1,1.05,.1,rl);bx((PIER.e1+PIER.u1)/2,Y+1,s,PIER.u1-PIER.e1,.1,.1,rl)}
 for(const s of[-34,34]){for(let u=PIER.e0;u<PIER.e1;u+=2)bx(u,Y,s,.1,1.05,.1,rl);bx((PIER.e0+PIER.e1)/2,Y+1,s,PIER.e1-PIER.e0,.1,.1,rl)}for(let s=-34;s<34;s+=2)bx(PIER.e0,Y,s,.1,1.05,.1,rl);bx(PIER.e0,Y+1,0,.1,.1,68,rl);
 for(const s of[[-34,-6],[6,34]]){for(let v=s[0];v<s[1];v+=2)bx(PIER.e1,Y,v,.1,1.05,.1,rl);bx(PIER.e1,Y+1,(s[0]+s[1])/2,.1,.1,s[1]-s[0],rl)}
 cBox(PIER.e1,PIER.u1,-6.4,-5.9);cBox(PIER.e1,PIER.u1,5.9,6.4);cBox(PIER.e0,PIER.e1,-34.4,-33.9);cBox(PIER.e0,PIER.e1,33.9,34.4);cBox(PIER.e0-.4,PIER.e0,-34,34);cBox(PIER.e1-.2,PIER.e1+.3,-34,-6);cBox(PIER.e1-.2,PIER.e1+.3,6,34);
 /* string bulbs + lamps along the pier */for(let u=PIER.e1;u<PIER.u1;u+=16){for(const s of[-5.6,5.6]){const p=W(u,s);pcyl(T(u,s).o,p[0],Y,p[1],.08,4,5,[.9,.9,.9]);NL.push([p[0],Y+4,p[1]])}for(let k=1;k<8;k++){const p=W(u+k*2,-5.6),q=W(u+k*2,5.6),sag=Math.sin(k/8*Math.PI)*.6;NLB.push([p[0],Y+4-sag,p[1]],[q[0],Y+4-sag,q[1]])}}
 /* entrance arch */{const au=-609;for(const s of[-6.5,6.5]){bx(au,Y,s,1.2,7,1.2,[.95,.95,.95]);cn(au,Y+7,s,.9,1.4,6,[.2,.5,.6])}bx(au,Y+6,0,1,1.6,13.4,[.95,.95,.95]);sign(au-.56,0,Y+6.8,'SUNHAVEN PIER',12,1.4,-Math.PI/2,'#c81e3a','#ffffff');sign(au+.56,0,Y+6.8,'SUNHAVEN PIER',12,1.4,Math.PI/2,'#c81e3a','#ffffff');for(let s=-6;s<=6;s+=1)NLB.push([...P3(au-.6,Y+7.6,s)])}
 /* pavilion (the arcade + café) at the end */{const pu=-940,pv=0;bx(pu,Y,pv,20,6,30,[.96,.94,.88]);for(let k=0;k<6;k++)bx(pu+10.05,Y+1,pv-12.5+k*5,.1,3,3,[.3,.5,.7]);bx(pu,Y+6,pv,21,.5,31,[.2,.5,.6]);cy(pu,Y+6.4,pv,7,2,16,[.95,.95,.92]);const dp=W(pu,pv);const dome=new THREE.Mesh(new THREE.SphereGeometry(7,16,10,0,TAU,0,Math.PI/2),wmat([.2,.55,.62],{vertexColors:false}));dome.position.set(dp[0],Y+8.4,dp[1]);special(pu,pv,dome);cy(pu,Y+15,pv,.08,3,4,[.9,.9,.9]);
  sign(pu+10.12,pv,Y+4.6,'THE PIER PAVILION',14,1.3,Math.PI/2,'#1a5a6a','#ffffff');cBox(pu-10,pu+10,pv-15,pv-2);cBox(pu-10,pu+10,pv+2,pv+15);cBox(pu-10,pu-4,pv-2,pv+2);SHOPS.push({n:'PIER PAVILION',u:pu+11.5,v:pv,k:'pavilion'});poi('THE PIER PAVILION',pu,pv,'🎰')}
 /* helter skelter */{const hu=-892,hv=-22,n=56;cy(hu,Y,hv,2.4,14,10,[.95,.92,.8]);for(let k=0;k<7;k++)cy(hu,Y+k*2,hv,2.45,1,10,k%2?[.85,.15,.2]:[.98,.98,.98]);cn(hu,Y+14,hv,3.4,4,10,[.85,.15,.2]);cy(hu,Y+18,hv,.06,2,4,[.9,.9,.9]);bx(hu,Y+19.2,hv,.05,.7,1.1,[.2,.5,.95]);
  for(let k=0;k<n;k++){const a=k/n*TAU*3.2,y=Y+13.2-k*(12.6/n),p=[hu+Math.cos(a)*3.6,hv+Math.sin(a)*3.6];bx(p[0],y,p[1],1.5,.18,1.1,[.95,.78,.2],-a)}cCirc(hu,hv,3);RS.helter={u:hu,v:hv};poi('HELTER SKELTER',hu,hv,'🌀')}
 /* carousel (animated) */{const cu=-895,cv=20,g=new THREE.Group(),B=new Builder(3);pcyl(B,0,0,0,6,.5,16,[.85,.75,.4]);pcyl(B,0,.5,0,.4,4,8,[.9,.8,.3]);pcone(B,0,4.5,0,6.6,2.4,16,[.85,.2,.3],0);for(let k=0;k<16;k++){const a=k/16*TAU;pbox(B,Math.cos(a)*6.4,4.3,Math.sin(a)*6.4,.6,.4,.1,k%2?[.98,.95,.9]:[.95,.4,.5],-a)}
  const H_=[];for(let k=0;k<8;k++){const a=k/8*TAU,hb=new Builder(3),col=[[.98,.98,.98],[.95,.8,.5],[.6,.4,.3],[.95,.6,.7]][k%4];pbox(hb,0,0,0,.5,.55,1.4,col);pbox(hb,0,.4,.6,.35,.6,.4,col);pbox(hb,0,-.6,-.5,.12,.6,.12,col);pbox(hb,0,-.6,.5,.12,.6,.12,col);pcyl(hb,0,-1.2,0,.05,4.6,4,[.9,.8,.3]);const hm=hb.mesh(mObj);hm.position.set(Math.cos(a)*4.4,1.8,Math.sin(a)*4.4);hm.rotation.y=-a;g.add(hm);H_.push(hm)}
  g.add(B.mesh(mObj));const p=W(cu,cv);g.position.set(p[0],Y,p[1]);special(cu,cv,g);RS.carousel={g,H:H_,u:cu,v:cv};cCirc(cu,cv,6.2);poi('THE CAROUSEL',cu,cv,'🎠')}
 /* stalls on the pier: coconut shy, hook-a-duck, fortune teller */{const ST_=[['COCONUT SHY',-915,-28,[.8,.2,.2]],['HOOK-A-DUCK',-915,28,[.2,.5,.9]],['MADAME ZELDA',-878,-28,[.5,.2,.6]]];for(const[n,u,v,c]of ST_){bx(u,Y,v,6,1,3,[.6,.42,.28]);for(let k=0;k<6;k++)bx(u-2.5+k,Y+2.6,v,1,.3,3.4,k%2?c:[.98,.98,.98]);for(const a of[-2.8,2.8])for(const b of[-1.4,1.4])bx(u+a,Y,v+b,.1,2.6,.1,[.9,.9,.9]);sign(u,v+(v<0?-1.75:1.75),Y+3.3,n,5.6,.7,v<0?Math.PI:0,css(c),'#ffffff');cBox(u-3,u+3,v-1.5,v+1.5);SHOPS.push({n,u,v:v+(v<0?2.6:-2.6),k:n})}}
 for(let u=PIER.e1+10;u<PIER.u1-10;u+=40)for(const s of[-4.8,4.8])bench(u,s,s<0?0:Math.PI);
 yield;
 /* ---- the beach: huts, umbrellas, towels, lifeguard towers, a volleyball net ---- */
 const HC=[[.95,.35,.4],[.3,.6,.9],[.98,.85,.25],[.45,.8,.55],[.95,.6,.3],[.8,.5,.9],[.98,.98,.98]];
 for(const[a,b]of[[-560,-40],[40,560]]){let k=0;for(let v=a;v<b;v+=5.2){if(rnd()<.12)continue;const c=HC[k++%HC.length],h=Y-1.3,u=-618.5;const t=T(u,v),p=W(u,v);pbox(t.o,p[0],h,p[1],3,2.4,4,c);pbox(t.o,p[0]-1.52,h,p[1],.05,2,1.6,[.98,.98,.95]);const r0=P3(u-1.7,h+2.4,v-2.2),r1=P3(u+1.7,h+2.4,v-2.2),r2=P3(u+1.7,h+2.4,v+2.2),r3=P3(u-1.7,h+2.4,v+2.2),rt=P3(u,h+3.4,v-2.2),rt2=P3(u,h+3.4,v+2.2),rc=c.map(x=>x*.78);t.o.tri(r0,r1,rt,[.98,.98,.96],[.98,.98,.96],[.98,.98,.96],true);t.o.tri(r3,r2,rt2,[.98,.98,.96],[.98,.98,.96],[.98,.98,.96],true);t.o.tri(r0,rt,rt2,rc,rc,rc,true);t.o.tri(r0,rt2,r3,rc,rc,rc,true);t.o.tri(r1,r2,rt2,rc,rc,rc,true);t.o.tri(r1,rt2,rt,rc,rc,rc,true);cBox(u-1.5,u+1.5,v-2,v+2)}}
 const UC=[[[.95,.3,.3],[.98,.98,.98]],[[.2,.5,.9],[.98,.98,.98]],[[.98,.8,.2],[.2,.6,.4]],[[.9,.4,.7],[.98,.9,.4]]];
 for(let k=0;k<110;k++){const v=rr(-540,540);if(Math.abs(v)<20)continue;const su=shoreU(v),u=rr(su+14,-630),h=H(u,v);if(h<SL+.4)continue;const c=pick(UC),t=T(u,v),p=W(u,v);pcyl(t.o,p[0],h,p[1],.04,2.4,4,[.9,.9,.9]);for(let s=0;s<8;s++){const a0=s/8*TAU,a1=(s+1)/8*TAU,R=1.6;t.o.tri([p[0],h+2.6,p[1]],[p[0]+Math.cos(a0)*R,h+2.1,p[1]+Math.sin(a0)*R],[p[0]+Math.cos(a1)*R,h+2.1,p[1]+Math.sin(a1)*R],c[s%2],c[s%2],c[s%2],true)}
  const tc=pick(HC),ta=rnd()*TAU,co=Math.cos(ta),si=Math.sin(ta),q=(x,z)=>[p[0]+1.2+x*co-z*si,h+.03,p[1]+x*si+z*co];t.o.tri(q(-.5,-.9),q(.5,-.9),q(.5,.9),tc,tc,tc,true);t.o.tri(q(-.5,-.9),q(.5,.9),q(-.5,.9),tc,tc,tc,true);if(rnd()<.3){const bc=pick(HC);pbox(t.o,p[0]-1,h,p[1]+.8,.5,.3,.35,bc)}}
 for(const v of[-160,260]){const u=-660,h=H(u,v);for(const a of[-1,1])for(const b of[-1,1])bx(u+a,h,v+b,.15,3,.15,[.95,.95,.95]);bx(u,h+3,v,2.4,.2,2.4,[.9,.2,.2]);bx(u,h+3.2,v,2,1.4,2,[.95,.95,.95]);cn(u,h+4.6,v,1.8,1,4,[.9,.2,.2],Math.PI/4);cy(u+1.3,h+3,v+1.3,.05,3,4,[.9,.9,.9]);bx(u+1.9,h+5.4,v+1.3,1,.6,.05,[.95,.85,.2]);cBox(u-1.2,u+1.2,v-1.2,v+1.2);poi('LIFEGUARD TOWER',u,v,'🛟')}
 {const u=-655,v=-320,h=H(u,v);for(const s of[-4,4])bx(u,h,v+s,.12,2.4,.12,[.9,.9,.9]);bx(u,h+1.6,v,.04,.8,8,[.95,.95,.95]);poi('BEACH VOLLEYBALL',u,v,'🏐')}
 {const u=-650,v=130,h=H(u,v);for(let k=0;k<14;k++){const a=k/14*TAU;bx(u+Math.cos(a)*8,h,v+Math.sin(a)*8,.12,1.1,.12,[.72,.55,.35])}poi('DONKEY RIDES',u,v,'🫏')}
 {const u=-665,v=-470,h=H(u,v);flat(u-8,v-8,u+8,v+8,[.95,.86,.6],h+.05);poi('SANDCASTLE CONTEST',u,v,'🏰')}
 {const u=-640,v=-262,h=H(u,v);bx(u-2,h,v,3,2.4,4,[.2,.7,.8]);for(let k=0;k<4;k++)bx(u-3.7,h,v-1.5+k,.12,2.4,.5,[[.95,.4,.2],[.2,.7,.9],[.95,.85,.2],[.9,.3,.6]][k],.2);sign(u-.45,v,h+2.8,'SURF SHACK',3.4,.6,Math.PI/2,'#1a8aa0','#ffffff');cBox(u-3.5,u-.5,v-2,v+2);poi('SURF SHACK',u,v,'🏄')}
 yield;
 /* ---- the harbour ---- */
 {const q=[.62,.6,.56];const{u0,u1,v0,v1}=HARB;flat(u0-12,v1,u1+12,v1+14,q,Y+.02);flat(u0-12,v0-2,u0,v1,q,Y+.02);flat(u1,v0-2,u1+12,v1,q,Y+.02);
  for(const[a,b,c_,d]of[[u0-1,u0,v0,v1],[u1,u1+1,v0,v1],[u0,u1,v1,v1+1]]){bx((a+b)/2,SL-3.4,(c_+d)/2,b-a,Y-SL+3.4,d-c_,[.55,.52,.48])}
  for(let u=u0;u<=u1;u+=12)bx(u,Y,v1+.6,.4,.5,.4,[.2,.2,.22]);
  /* breakwater with a little harbour light */for(let v=v0-60;v<v0;v+=4)rock(u0-6+(v-v0)*-.0,v,2.2,[.5,.48,.45]);bx(u0-6,Y,v0-62,2.2,4,2.2,[.95,.95,.92]);bx(u0-6,Y+4,v0-62,1.4,1,1.4,[.9,.2,.2]);NL.push([...P3(u0-6,Y+4.6,v0-62)]);
  /* moored fishing boats */const BC=[[.2,.4,.75],[.85,.25,.2],[.95,.95,.9],[.2,.6,.45],[.95,.75,.2]];for(let k=0;k<7;k++){const u=u0+12+k*20,v=v1-10-(k%2)*30,c=BC[k%5],t=T(u,v),p=W(u,v),g=new THREE.Group(),B=new Builder(3);pbox(B,0,0,0,2.6,1.1,7,c);pbox(B,0,.1,0,2.7,.18,7.1,[.98,.98,.98]);pbox(B,0,1.1,-1,1.8,1.4,2.2,[.95,.95,.92]);pcyl(B,0,1.1,1.5,.07,4,4,[.85,.85,.85]);g.add(B.mesh(mObj));g.position.set(p[0],SL-.4,p[1]);g.rotation.y=rr(-.2,.2);special(u,v,g);(RS.boats=RS.boats||[]).push(g)}
  for(let k=0;k<12;k++){const u=rr(u0+4,u1-4),v=v1+rr(3,11);bx(u,Y,v,.8,.6,.8,[.5,.35,.2])}
  /* jet ski hire hut */bx(u0-6,Y,v1-14,4,2.6,5,[.95,.6,.2]);sign(u0-3.95,v1-14,Y+2,'JET SKI HIRE',4.6,.7,Math.PI/2,'#d04a10','#ffffff');cBox(u0-8,u0-4,v1-16.5,v1-11.5);SHOPS.push({n:'JET SKI HIRE',u:u0-2.6,v:v1-14,k:'jetski'});
  poi('THE HARBOUR',(u0+u1)/2,v1+6,'⚓');poi('JET SKI HIRE',u0-3,v1-14,'🌊')}
 yield;
 /* ---- Castle Hill: ruined castle on top, pines on the slopes, a footpath up from Castle Road ---- */
 {const cu=HILLN.u,cv=HILLN.v,h0=H(cu,cv),st=[.66,.63,.56],st2=[.58,.55,.5];for(let k=0;k<20;k++){if(k%5===3)continue;const a=k/20*TAU,a1=(k+1)/20*TAU,r=26,u=cu+Math.cos((a+a1)/2)*r,v=cv+Math.sin((a+a1)/2)*r,hh=rr(2.5,6);bx(u,H(u,v)-1,v,8.6,hh+1,2,k%2?st:st2,-(a+a1)/2+Math.PI/2);cCirc(u,v,2.2)}
  for(const[du,dv]of[[26,0],[-26,0],[0,26],[0,-26]]){const u=cu+du,v=cv+dv;cy(u,H(u,v)-1,v,4,rr(7,10),8,st)}cy(cu,h0-1,cv,7,13,10,st2);cCirc(cu,cv,7);cy(cu,h0+12,cv,.08,5,4,[.9,.9,.9]);{const f=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.4),wmat([1,1,1],{vertexColors:false},A.cvx(64,40,(g,w,h)=>{g.fillStyle='#1a6aba';g.fillRect(0,0,w,h);g.fillStyle='#ffd24a';g.beginPath();g.arc(w/2,h/2,10,0,TAU);g.fill()}))),p=W(cu+1.25,cv);f.position.set(p[0],h0+16.2,p[1]);special(cu,cv,f);RS.flag=f}
  sign(cu,cv-34,H(cu,cv-34)+1.5,'SUNHAVEN CASTLE · RUINS',8,1,Math.PI,'#3a3020','#e8d8a0');poi('SUNHAVEN CASTLE',cu,cv,'🏰');
  /* footpath */const path=[[-420,386],[-420,440],[-440,520],[-425,600],[-430,690],[-430,736]];for(let i=0;i<path.length-1;i++){const[a,b]=[path[i],path[i+1]],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/4);for(let k=0;k<n;k++){const u=a[0]+(b[0]-a[0])*k/n,v=a[1]+(b[1]-a[1])*k/n;const pp=W(u,v);pbox(T(u,v).o,pp[0],H(u,v)-.15,pp[1],3,.2,4.4,[.72,.62,.45],Math.atan2(b[0]-a[0],b[1]-a[1]))}}
  for(let k=0;k<90;k++){const a=rnd()*TAU,r=rr(60,280),u=cu+Math.cos(a)*r,v=cv+Math.sin(a)*r;if(H(u,v)<Y+1||Math.abs(u+425)<10&&v<740)continue;pine(u,v,rr(.8,1.3))}}
 /* ---- Lighthouse Point ---- */{const lu=LPT.u-10,lv=LPT.v+10,h=H(lu,lv);for(let k=0;k<8;k++)cy(lu,h+k*2.8,lv,3.2-k*.12,2.85,12,k%2?[.85,.15,.2]:[.98,.98,.96]);cy(lu,h+22.4,lv,3.4,.4,12,[.15,.15,.18]);for(let k=0;k<12;k++){const a=k/12*TAU;bx(lu+Math.cos(a)*3.3,h+22.8,lv+Math.sin(a)*3.3,.08,1,.08,[.15,.15,.18])}
  const lr=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,2.4,10),new THREE.MeshBasicMaterial({color:0xfff2b0,fog:false}));const p=W(lu,lv);lr.position.set(p[0],h+24.2,p[1]);special(lu,lv,lr);cn(lu,h+25.4,lv,2.2,2,10,[.15,.15,.18]);
  const beam=new THREE.Mesh(new THREE.ConeGeometry(9,90,16,1,true).translate(0,-45,0).rotateZ(Math.PI/2),new THREE.MeshBasicMaterial({color:0xfff2b0,transparent:true,opacity:.14,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false}));const bg=new THREE.Group();bg.add(beam);bg.position.set(p[0],h+24.2,p[1]);special(lu,lv,bg);RS.beam=bg;RS.lamp=lr;cCirc(lu,lv,3.4);
  house(lu+8,lv-12,lu+18,lv-4,1,4,'s',{roof:[.3,.3,.34],y0:H(lu+13,lv-8)-.2});sign(lu+13,lv-12.1,H(lu+13,lv-12)+2.6,"KEEPER'S COTTAGE",6,.7,Math.PI,'#2a2418','#e8d8a0');poi('THE LIGHTHOUSE',lu,lv,'🗼');RS.lh={u:lu,v:lv,h};SHOPS.push({n:"KEEPER'S COTTAGE",u:lu+13,v:lv-14.5,k:'keeper'})}
 /* ---- South Down + Smuggler's Cove + the cave mouth ---- */
 {for(let k=0;k<50;k++){const a=rnd()*TAU,r=rr(40,220),u=HILLS.u+Math.cos(a)*r,v=HILLS.v+Math.sin(a)*r;if(H(u,v)<Y+1||Math.hypot(u-COVE.u,v-COVE.v)<COVE.r*1.3)continue;if(rnd()<.6)pine(u,v,rr(.8,1.2));else rock(u,v,rr(.8,1.6))}
  const dir=[HILLS.u-COVE.u,HILLS.v-COVE.v],dl=Math.hypot(dir[0],dir[1]),cu=COVE.u+dir[0]/dl*COVE.r*.9,cv=COVE.v+dir[1]/dl*COVE.r*.9,face=Math.atan2(-dir[0],-dir[1]),h=H(cu-dir[0]/dl*6,cv-dir[1]/dl*6);
  const g=new THREE.Group(),B=new Builder(3);for(let k=0;k<9;k++){const a=k/8*Math.PI;pbox(B,Math.cos(a)*3.4,Math.sin(a)*3.4,0,1.6,1.6,2.4,[.42,.4,.36])}pbox(B,0,0,.6,6,3.6,.2,[.03,.03,.04]);const mm=B.mesh(mObj);g.add(mm);const pp=W(cu-dir[0]/dl*4,cv-dir[1]/dl*4);g.position.set(pp[0],h,pp[1]);g.rotation.y=face;special(cu,cv,g);
  RS.cave={u:cu-dir[0]/dl*5.5,v:cv-dir[1]/dl*5.5,psi:face};for(let k=0;k<26;k++){const a=rnd()*TAU,r=rr(10,COVE.r*.85),u=COVE.u+Math.cos(a)*r,v=COVE.v+Math.sin(a)*r;rock(u,v,rr(.4,1.2),[.46,.44,.4])}
  {const wu=COVE.u-10,wv=COVE.v-20,hh=H(wu,wv);bx(wu,hh,wv,1.2,.8,2,[.4,.28,.16],.6);bx(wu+1.6,hh,wv+.5,.9,.6,.9,[.45,.3,.18])}poi("SMUGGLER'S COVE",COVE.u,COVE.v,'🏴‍☠️')}
 /* ---- the shipwreck on the sandbar ---- */{const u=BAR.u+4,v=BAR.v,h=SL+.2,g=new THREE.Group(),B=new Builder(3),wd=[.36,.26,.18],wd2=[.3,.2,.14];for(let k=0;k<9;k++){const z=-8+k*2;const w=3.2*Math.sin((k+1)/10*Math.PI);pbox(B,-w,0,z,.3,2.4,2.1,k%2?wd:wd2);if(k!==4&&k!==5)pbox(B,w,0,z,.3,2.4,2.1,k%2?wd:wd2)}pbox(B,0,0,0,5,.3,18,wd2);pcyl(B,0,0,-2,.18,9,6,wd);pbox(B,0,7,-2,4,.14,.14,wd);pbox(B,0,2.2,-7.5,4,1,3,wd);
  const mm=B.mesh(mObj);g.add(mm);const p=W(u,v);g.position.set(p[0],h-.6,p[1]);g.rotation.set(.12,.7,.16);special(u,v,g);cCirc(u,v,5);RS.wreck={u,v};poi('THE WRECK OF THE MARY ROSE',u,v,'⚓')}
 /* ---- rock pools at the north end of the beach ---- */{for(let k=0;k<30;k++){const u=rr(-735,-660),v=rr(560,620);if(H(u,v)>Y-1)continue;rock(u,v,rr(.6,1.8),[.42,.4,.36])}poi('ROCK POOLS',-695,585,'🦀')}
 /* ---- clifftop campsite (east of the runway) ---- */{const TC=[[.95,.6,.2],[.2,.6,.4],[.3,.5,.9],[.9,.3,.3]];for(let k=0;k<12;k++){const u=rr(70,150),v=rr(250,520),c=pick(TC),t=T(u,v),p=W(u,v);if(k<5){pbox(t.o,p[0],Y,p[1],2.2,2,4.4,[.95,.95,.92],rnd());pbox(t.o,p[0],Y+.9,p[1],2.24,.3,4.44,c,0);cBox(u-1.6,u+1.6,v-2.6,v+2.6)}else{const a=P3(u-1.2,Y,v-1.4),b=P3(u+1.2,Y,v-1.4),cc=P3(u,Y+1.6,v-1.4),d=P3(u-1.2,Y,v+1.4),e=P3(u+1.2,Y,v+1.4),f=P3(u,Y+1.6,v+1.4);t.o.tri(a,cc,f,c,c,c,true);t.o.tri(a,f,d,c,c,c,true);t.o.tri(b,e,f,c,c,c,true);t.o.tri(b,f,cc,c,c,c,true)}}
  {const u=110,v=230;cy(u,Y,v,1.2,.4,8,[.5,.5,.5]);for(let k=0;k<6;k++)bx(u+Math.cos(k)*.6,Y+.3,v+Math.sin(k)*.6,.15,.15,1,[.4,.25,.15],k);RS.fire={u,v}}poi('CLIFFTOP CAMPSITE',110,380,'⛺')}
 /* ---- welcome plaza outside the terminal ---- */{flat(-217,-262,-168,-138,[.86,.82,.72],Y+.03);for(let k=0;k<6;k++){palm(-212,-255+k*22,1);palm(-175,-255+k*22,.9)}sign(-206,-138.5,Y+4.2,'WELCOME TO SUNHAVEN BAY',14,1.8,0,'#1a6a8a','#ffffff');for(const s of[-6.4,6.4])cy(-206+s,Y,-138.5,.15,4.2,6,[.9,.9,.9]);cy(-192,Y,-200,5,.6,16,[.9,.86,.78]);cy(-192,Y+.55,-200,4.4,.1,16,[.3,.7,.85]);cCirc(-192,-200,5)}
 /* airport car park (your car waits here) */{flat(-229,-336,-186,-286,[.24,.24,.26],Y+.035,1);for(let u=-226;u<=-190;u+=4){flat(u-.08,-334,u+.08,-326,[.95,.95,.92],Y+.06,1);flat(u-.08,-296,u+.08,-288,[.95,.95,.92],Y+.06,1)}flat(-229,-311.2,-186,-310.8,[.95,.8,.2],Y+.06,1);
  for(const v of[-338,-284])for(let u=-229;u<=-186;u+=3)bx(u,Y,v,.12,.7,.12,[.9,.9,.9]);cy(-188,Y,-284.5,.08,3.4,6,[.3,.3,.32]);sign(-188,-284.4,Y+3.2,'P  CAR PARK',4.4,1,0,'#1a4aa0','#ffffff','Arial');poi('CAR PARK',-205,-310,'🅿')}
 /* palms along the main streets */for(const r of NS)if(r.i<3)for(let v=-370;v<370;v+=36){if(Math.abs(v)<14)continue;palm(r.u+r.h+1.6,v,rr(.8,1))}
 yield}
/* ------------------------------------------------------------------ state + arrival */
const RS=window.RESORT={M:RM,OX,OZ,W,H,SL,SWIM,Y,inReg,onPier,cResolve,cBox,cCirc,POI,SHOPS,ST,NS,EW,shoreU,HILLN,HILLS,LPT,COVE,BAR,HARB,PIER,CHUNKS,T,sign,built:0};
window.RESORTGEN=function*(m,c){yield*gen(m)};
const STERM={x:OX-163.8,z:OZ-200,psi:-Math.PI/2,t:'SUNHAVEN AIRPORT',bg:'#1a6a8a',fg:'#ffffff',apt:2,rx:12.5,rz:6,sz:3.4,dest:'COZY VILLAGE · MARLOWE',greet:'Welcome to Sunhaven Bay! Check in here for your flight home.'};SHOPD.push(STERM);HRS['SUNHAVEN AIRPORT']=[0,24];
RM.arrive=function(){if(!RM.built){while(!A.pump(RM,1e9));}A.AP.at='sunhaven';GS.inside=0;GS.onFoot=1;man.visible=true;P.x=STERM.x;P.z=STERM.z;P.y=G0;P.speed=0;SHOPCUR={o:STERM,k:[]};enterShop(STERM,true);toast('☀ WELCOME TO SUNHAVEN BAY ☀')};
/* ------------------------------------------------------------------ per frame: culling, sea, rides, night */
let OUTER=null,t0=0;
{const u0=updCozy;updCozy=function(dt){u0(dt);if(!RS.built)return;const act=!!RM.active;if(!OUTER)OUTER=scene.children.find(o=>o.material===outerMat)||1;if(OUTER!==1&&act&&OUTER.visible)OUTER.visible=false;
 if(!act)return;t0+=dt;const cx=cam.position.x,cz=cam.position.z,far=(scene.fog?scene.fog.far:600)+120;for(const g of CHUNKS){const dx=Math.max(0,Math.abs(cx-g.userData.cx)-150),dz=Math.max(0,Math.abs(cz-g.userData.cz)-150);g.visible=Math.hypot(dx,dz)<far}
 if(RS.sea){const m=RS.sea.material.map;m.offset.x=(m.offset.x+dt*.004)%1;m.offset.y=(m.offset.y+dt*.0025)%1}
 if(RS.foam){RS.foam.material.opacity=.45+.4*Math.sin(t0*1.3);const s=Math.sin(t0*.65)*1.6;RS.foam.position.x=s}
 if(RS.carousel)RS.carousel.g.rotation.y+=dt*.5,RS.carousel.H.forEach((h,i)=>h.position.y=1.8+Math.sin(t0*2+i)*.35);
 if(RS.boats)RS.boats.forEach((b,i)=>{b.position.y=SL-.4+Math.sin(t0*1.2+i)*.08;b.rotation.z=Math.sin(t0*.9+i*2)*.04});
 if(RS.flag)RS.flag.scale.x=1+Math.sin(t0*6)*.06;
 const night=todI>0;if(RS.lights){RS.lights.visible=night;RS.bulbs.visible=night;RS.bulbs.material.color.setHSL((t0*.05)%1,.6,.75)}if(RS.beam){RS.beam.visible=night;RS.beam.rotation.y+=dt*.8}if(RS.lamp)RS.lamp.material.color.setHex(night?0xfff2b0:0xd8d8c8)}}
/* the minimap + a full map */
const MMK=4;let MMC=null;
function mmBuild(){const reg=RM.reg,w=Math.ceil((reg[1]-reg[0])/MMK),h=Math.ceil((reg[3]-reg[2])/MMK),c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),img=g.createImageData(w,h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const u=reg[0]+x*MMK,v=reg[3]-y*MMK,hh=onPier(u,v)?Y:H(u,v),i=(y*w+x)*4;let col;if(onPier(u,v))col=[170,130,90];else if(hh<SL)col=hh<SL-4?[40,120,170]:[70,170,200];else if(hh<Y-.5&&u<-600||hh<SL+.6)col=[238,220,160];else{const k=Math.min(1,(hh-Y)/30);col=[110-k*20,170-k*30,85-k*10]}if(onRoad(u,v))col=[90,90,96];if(u>-30&&u<30&&v>-575&&v<575)col=[130,130,134];img.data.set([...col,255],i)}
 g.putImageData(img,0,0);MMC=c}
const mmX=u=>(u-RM.reg[0])/MMK,mmZ=v=>(RM.reg[3]-v)/MMK;
function where(u,v){if(onPier(u,v))return 'SUNHAVEN PIER';const r=onRoad(u,v);if(r)return r.n;if(u>-217)return 'SUNHAVEN AIRPORT';if(H(u,v)<SWIM+.05)return 'IN THE SEA';if(Math.hypot(u-HILLN.u,v-HILLN.v)<HILLN.r)return 'CASTLE HILL';if(Math.hypot(u-LPT.u,v-LPT.v)<LPT.r*1.3)return 'LIGHTHOUSE POINT';if(Math.hypot(u-COVE.u,v-COVE.v)<COVE.r*1.2)return "SMUGGLER'S COVE";if(Math.hypot(u-HILLS.u,v-HILLS.v)<HILLS.r)return 'SOUTH DOWN';if(u<-604)return 'SUNHAVEN BEACH';return 'SUNHAVEN BAY'}
{const d0=drawMap;drawMap=function(){const T_=GS.onFoot?P:GS;if(RS.built&&!GS.inside&&inReg(T_.x,T_.z)){if(!MMC)mmBuild();const u=T_.x-OX,v=T_.z-OZ,S=150;mc.fillStyle='#2a8ab0';mc.fillRect(0,0,MMS,MMS);mc.drawImage(MMC,mmX(u)-S/2,mmZ(v)-S/2,S,S,0,0,MMS,MMS);const k=MMS/S/MMK;
  if(PH.way){const gx=(PH.way.x-T_.x)*k+MMS/2,gz=-(PH.way.z-T_.z)*k+MMS/2;mc.fillStyle='#ffd24a';mc.strokeStyle='#000';mc.beginPath();mc.arc(Math.max(5,Math.min(MMS-5,gx)),Math.max(5,Math.min(MMS-18,gz)),4.5,0,6.3);mc.fill();mc.stroke()}
  if(window.RESORT2&&RESORT2.mm)RESORT2.mm(mc,T_,k);
  mc.save();mc.translate(MMS/2,MMS/2);mc.rotate(Math.atan2(-Math.cos(T_.psi),Math.sin(T_.psi)));mc.fillStyle='#fff';mc.strokeStyle='#d00';mc.lineWidth=1.5;mc.beginPath();mc.moveTo(6,0);mc.lineTo(-4,-3.5);mc.lineTo(-4,3.5);mc.closePath();mc.fill();mc.stroke();mc.restore();
  mc.fillStyle='rgba(0,0,0,.55)';mc.fillRect(0,MMS-13,MMS,13);mc.fillStyle='#fff';mc.font='bold 9px monospace';mc.textAlign='center';mc.fillText(where(u,v),MMS/2,MMS-3.5)}else d0()}}
function openMap(){if(busy||menuOpen||A.CIN.on)return;if(!MMC)mmBuild();busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:80;background:#1a6a8a;display:flex;align-items:center;justify-content:center;font:bold 12px ui-monospace,monospace;color:#fff';
 const wrap=document.createElement('div');wrap.style.cssText='position:relative;height:92vh;aspect-ratio:'+MMC.width+'/'+MMC.height+';max-width:96vw';const im=document.createElement('canvas');im.width=MMC.width*2;im.height=MMC.height*2;im.style.cssText='width:100%;height:100%;image-rendering:pixelated;border:3px solid #f5e6a0;border-radius:10px';const g=im.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(MMC,0,0,im.width,im.height);
 const sx=im.width/MMC.width;g.font='bold 15px Arial';g.textAlign='center';for(const p of POI){const x=mmX(p.u)*sx,y=mmZ(p.v)*sx;g.font='22px serif';g.fillText(p.ic||'●',x,y+7);g.font='bold 11px Arial';g.lineWidth=3;g.strokeStyle='#000';g.strokeText(p.n,x,y+22);g.fillStyle='#fff';g.fillText(p.n,x,y+22)}
 if(window.RESORT2&&RESORT2.fullmap)RESORT2.fullmap(g,(u)=>mmX(u)*sx,(v)=>mmZ(v)*sx);
 const T_=GS.onFoot?P:GS;g.fillStyle='#ff3030';g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();g.arc(mmX(T_.x-OX)*sx,mmZ(T_.z-OZ)*sx,8,0,TAU);g.fill();g.stroke();
 const ttl=document.createElement('div');ttl.textContent='☀ SUNHAVEN BAY ☀  ·  TAP TO CLOSE';ttl.style.cssText='position:absolute;left:0;right:0;top:-2px;text-align:center;font-size:15px;color:#ffe9a8;text-shadow:0 2px 0 #000;padding:6px';wrap.append(im,ttl);ov.appendChild(wrap);document.body.appendChild(ov);ov.onclick=()=>{ov.remove();busy=0}}
const inRes=()=>{const T_=GS.onFoot?P:GS;return RS.built&&!GS.inside&&inReg(T_.x,T_.z)};
addEventListener('click',e=>{if(e.target&&e.target.closest&&e.target.closest('#mm')&&inRes()){e.stopPropagation();e.preventDefault();RS.openMap()}},true);
addEventListener('keydown',e=>{if((e.key==='m'||e.key==='M')&&inRes()&&!e.repeat){const t=e.target;if(t&&/INPUT|TEXTAREA/.test(t.tagName))return;e.stopPropagation();RS.openMap()}},true);
Object.assign(RS,{openMap,where,inRes,mmBuild,onRoad,STERM,BOXES});
/* your car: parked in the Sunhaven Airport car park when you land, sent back home when you fly home */
function parkHere(){const p=W(-205,-310.5);GS.x=p[0];GS.z=p[1];GS.psi=-Math.PI/2;GS.vx=GS.vz=0;GS.y=Y+.1;GS.vy=0;GS.prevGY=GS.y;GS.pitch=GS.roll=0;GS.speed=0}
{const a0=RM.arrive;RM.arrive=function(sv){a0(sv);const V=window.MARLOWE2&&MARLOWE2.VAL,MW=window.MARLOWE;if(V&&!inReg(GS.x,GS.z)&&!(MW&&MW.inReg(GS.x,GS.z))){V.has=1;V.x=GS.x;V.z=GS.z;V.psi=GS.psi}parkHere();setTimeout(()=>{try{phText('COZY VALET',"Your car is waiting in the Sunhaven Airport car park, just south of the terminal. Enjoy the seaside!")}catch(e){}},2500)}}
{const H=window.AIRFIELDS.HOME,a0=H.arrive;H.arrive=function(sv){a0(sv);if(inReg(GS.x,GS.z)){const V=window.MARLOWE2&&MARLOWE2.VAL;if(V&&V.has){GS.x=V.x;GS.z=V.z;GS.psi=V.psi;V.has=0}else respawn(false);GS.vx=GS.vz=0;GS.y=gH(GS.x,GS.z)+.1;GS.prevGY=GS.y}}}
RS.parkHere=parkHere;
})();
