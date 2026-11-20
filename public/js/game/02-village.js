/* ---------- village generation ---------- */
const mObj=wmat(null,null,objTex),mBrick=hmat(T_BRICK,1),mStone=hmat(T_CONC,1),mRoof=hmat(T_ROOF,1),mGlass=wmat([.3,.38,.52],{vertexColors:false}),mRoad=wmat(null,{polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2},roadTex);
const gLit=new THREE.MeshBasicMaterial({color:0x4d607f,side:THREE.DoubleSide}),lampM=new THREE.MeshBasicMaterial({color:0xbbbbb0,side:THREE.DoubleSide});
const CHK=[],CHL=[];
function ck(x,z){const i=clamp(Math.floor((x+HALF)/CH),0,NCH-1),j=clamp(Math.floor((z+HALF)/CH),0,NCH-1),k=j*NCH+i;let c=CHK[k];if(!c){c=CHK[k]={cx:-HALF+(i+.5)*CH,cz:-HALF+(j+.5)*CH,o:new Builder(3),b:new Builder(2),s:new Builder(2),r:new Builder(2),g:new Builder(3),l:new Builder(3),rd:new Builder(4),x:[]};CHL.push(c)}return c}
function obbHit(a,b){const dx=b.x-a.x,dz=b.z-a.z;for(const o of[a,b])for(const ang of[o.rot,o.rot+Math.PI/2]){const ax=Math.sin(ang),az=Math.cos(ang);const ra=a.hw*Math.abs(Math.cos(a.rot)*ax-Math.sin(a.rot)*az)+a.hd*Math.abs(Math.sin(a.rot)*ax+Math.cos(a.rot)*az),rb=b.hw*Math.abs(Math.cos(b.rot)*ax-Math.sin(b.rot)*az)+b.hd*Math.abs(Math.sin(b.rot)*ax+Math.cos(b.rot)*az);if(Math.abs(dx*ax+dz*az)>=ra+rb)return false}return true}
const PLACED=[],BLD=[],OBS=[];
PLACED.push({x:LW(3.5,-2.5)[0],z:LW(3.5,-2.5)[1],rot:HM.th,hw:8,hd:7.5});
function footOK(cx,cz,rot,hw,hd){if(Math.abs(cx)>HALF-16||Math.abs(cz)>HALF-16)return false;if(Math.hypot(cx-GRC[0],cz-GRC[1])<GRR+hw+3)return false;
 const c=Math.cos(rot),s=Math.sin(rot),pts=[[0,0],[-1,-1],[1,-1],[1,1],[-1,1],[0,-1],[0,1],[-1,0],[1,0]];for(const[a,b]of pts){const x=cx+a*hw*c+b*hd*s,z=cz-a*hw*s+b*hd*c;if(roadDist(x,z)<RW+PW+.4)return false}
 for(const o of ROADS)if(o.head&&Math.hypot(cx-o.head[0],cz-o.head[1])<o.head[2]+PW+hw+2)return false;
 const me={x:cx,z:cz,rot,hw,hd};for(const p of PLACED)if(Math.hypot(p.x-cx,p.z-cz)<p.hw+p.hd+hw+hd+2&&obbHit(me,p))return false;return true}
/* ---- roads ---- */
function quadXZ(B,a,b,c,d,col,y){B.tri([a[0],y,a[1]],[b[0],y,b[1]],[c[0],y,c[1]],col,null,null,true);B.tri([a[0],y,a[1]],[c[0],y,c[1]],[d[0],y,d[1]],col,null,null,true)}
function band(B,x0,z0,x1,z1,o0,o1,col,y){const dx=x1-x0,dz=z1-z0,l=Math.hypot(dx,dz),nx=-dz/l,nz=dx/l;quadXZ(B,[x0+nx*o0,z0+nz*o0],[x0+nx*o1,z0+nz*o1],[x1+nx*o1,z1+nz*o1],[x1+nx*o0,z1+nz*o0],col,y)}
function disc(B,x,z,r,col,y,n){n=n||12;for(let i=0;i<n;i++){const a=i/n*6.2832,b=(i+1)/n*6.2832;B.tri([x,y,z],[x+Math.cos(a)*r,y,z+Math.sin(a)*r],[x+Math.cos(b)*r,y,z+Math.sin(b)*r],col,null,null,true)}}
function distOther(x,z,ri){let b=1e9;for(const s of SEG)if(s.ri!==ri){const q=segDist(x,z,s);if(q.d<b)b=q.d}return b}
const Y0=G0,CPAV=[.6,.6,.58],CKERB=[.78,.78,.74],CASP=[.27,.27,.3],CWHT=[.9,.9,.84],CYEL=[.92,.76,.14];
for(const s of SEG){const r=ROADS[s.ri];for(let t=0;t<s.l;t+=15){const t1=Math.min(s.l,t+15),x0=s.a[0]+s.dx*t,z0=s.a[1]+s.dz*t,x1=s.a[0]+s.dx*t1,z1=s.a[1]+s.dz*t1,K=ck((x0+x1)/2,(z0+z1)/2),B=K.rd,mx=(x0+x1)/2,mz=(z0+z1)/2;
 band(B,x0,z0,x1,z1,-RW-PW,RW+PW,CPAV,Y0+.03);band(B,x0,z0,x1,z1,-RW-.15,-RW,CKERB,Y0+.045);band(B,x0,z0,x1,z1,RW,RW+.15,CKERB,Y0+.045);
 band(B,x0,z0,x1,z1,-RW,RW,CASP,Y0+.06);
 if(distOther(mx,mz,s.ri)>RW+3){if(r.lines){for(const o of[-1,1]){band(B,x0,z0,x1,z1,o*(RW-.28),o*(RW-.18),CYEL,Y0+.09);band(B,x0,z0,x1,z1,o*(RW-.5),o*(RW-.4),CYEL,Y0+.09)}}
  for(let u=t;u<t1;u+=4){const u1=Math.min(t1,u+1.8);band(B,s.a[0]+s.dx*u,s.a[1]+s.dz*u,s.a[0]+s.dx*u1,s.a[1]+s.dz*u1,-.07,.07,CWHT,Y0+.09)}}}}
for(const r of ROADS){const pts=r.p;for(let i=0;i<pts.length;i++){const q=pts[i],K=ck(q[0],q[1]);disc(K.rd,q[0],q[1],RW+PW,CPAV,Y0+.03,14);disc(K.rd,q[0],q[1],RW,CASP,Y0+.06,14)}
 if(r.head){const K=ck(r.head[0],r.head[1]);disc(K.rd,r.head[0],r.head[1],r.head[2]+PW,CPAV,Y0+.03,24);disc(K.rd,r.head[0],r.head[1],r.head[2],CASP,Y0+.06,24)}}
/* village green: pond + path */
{const K=ck(GRC[0],GRC[1]);disc(K.rd,GRC[0]+9,GRC[1]-6,5.5,[.25,.42,.55],Y0+.05,16);for(let a=0;a<4;a++){const ang=a*1.5708+.6,x1=GRC[0]+Math.cos(ang)*GRR,z1=GRC[1]+Math.sin(ang)*GRR;band(K.rd,GRC[0],GRC[1],x1,z1,-.9,.9,[.7,.65,.55],Y0+.035)}}
/* zebra crossings + beacons */
for(const zx of[-8,-62]){const K=ck(zx,0);for(let i=0;i<8;i++)quadXZ(K.rd,[zx+i*.8-3,-RW+.2],[zx+i*.8-2.5,-RW+.2],[zx+i*.8-2.5,RW-.2],[zx+i*.8-3,RW-.2],CWHT,Y0+.095);
 for(const sd of[-1,1]){const px=zx+3.6,pz=sd*(RW+.8);for(let q=0;q<4;q++)pbox(K.o,px,Y0+q*.65,pz,.16,.65,.16,q%2?[.1,.1,.1]:[.95,.95,.95]);poct(K.o,px,Y0+2.7,pz,.32,.32,.32,[1,.55,.1],0);COL.push([px,pz,.3])}}
/* ---- signs (canvas planes) ---- */
const signCache={};
function signTex(txt,bg,fg,w,h,fs){const key=txt+bg+fg+w;if(signCache[key])return signCache[key];const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,w,h);x.strokeStyle=fg;x.lineWidth=3;x.strokeRect(3,3,w-6,h-6);x.fillStyle=fg;x.font='bold '+(fs||Math.floor(h*.55))+'px ui-monospace,Menlo,monospace';x.textAlign='center';x.textBaseline='middle';let f=fs||Math.floor(h*.55);while(x.measureText(txt).width>w-14&&f>8){f-=2;x.font='bold '+f+'px ui-monospace,Menlo,monospace'}x.fillText(txt,w/2,h/2+1);const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.LinearFilter;return signCache[key]=t}
var _showTex=null;function showTex(){if(_showTex)return _showTex;const W=1120,H=232,cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');
 let gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#f4f6fa');gr.addColorStop(.62,'#dde3ec');gr.addColorStop(.63,'#aeb4be');gr.addColorStop(1,'#8e95a1');g.fillStyle=gr;g.fillRect(0,0,W,H);
 for(let y=0;y<4;y++)for(let x=-2;x<W/36+2;x++){if((x+y)&1){g.fillStyle='rgba(255,255,255,.18)';g.fillRect(x*36+y*10,H*.63+y*(H*.37/4),36,H*.37/4)}}
 g.fillStyle='#2a2f3a';g.fillRect(0,0,W,12);for(let x=30;x<W;x+=150){g.fillStyle='#fff';g.fillRect(x,3,70,6)}
 g.fillStyle='rgba(120,130,150,.35)';for(let x=0;x<W;x+=280)g.fillRect(x,12,3,H*.51);
 const car=(cx,w,h,body,kind)=>{const gy=H*.86,bh=h*.46,wr=h*.27,x0=cx-w/2;
  g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(cx,gy+2,w*.55,6,0,0,6.3);g.fill();
  g.fillStyle=body;g.beginPath();g.roundRect(x0,gy-wr*1.2-bh,w,bh,h*.12);g.fill();
  const top=gy-wr*1.2-bh;g.fillStyle=body;g.beginPath();
  if(kind==='estate'){g.moveTo(x0+w*.2,top);g.lineTo(x0+w*.3,top-h*.4);g.lineTo(x0+w*.9,top-h*.4);g.lineTo(x0+w*.95,top)}
  else if(kind==='coupe'){g.moveTo(x0+w*.3,top);g.lineTo(x0+w*.45,top-h*.3);g.lineTo(x0+w*.75,top-h*.3);g.lineTo(x0+w*.88,top)}
  else if(kind==='van'){g.moveTo(x0+w*.05,top);g.lineTo(x0+w*.1,top-h*.5);g.lineTo(x0+w*.97,top-h*.5);g.lineTo(x0+w*.98,top)}
  else{g.moveTo(x0+w*.22,top);g.lineTo(x0+w*.34,top-h*.36);g.lineTo(x0+w*.78,top-h*.36);g.lineTo(x0+w*.92,top)}
  g.closePath();g.fill();
  g.fillStyle='#27303e';g.beginPath();
  if(kind==='estate'){g.moveTo(x0+w*.27,top);g.lineTo(x0+w*.34,top-h*.33);g.lineTo(x0+w*.86,top-h*.33);g.lineTo(x0+w*.9,top)}
  else if(kind==='coupe'){g.moveTo(x0+w*.37,top);g.lineTo(x0+w*.48,top-h*.24);g.lineTo(x0+w*.72,top-h*.24);g.lineTo(x0+w*.82,top)}
  else if(kind==='van'){g.moveTo(x0+w*.1,top);g.lineTo(x0+w*.14,top-h*.4);g.lineTo(x0+w*.35,top-h*.4);g.lineTo(x0+w*.35,top)}
  else{g.moveTo(x0+w*.3,top);g.lineTo(x0+w*.38,top-h*.3);g.lineTo(x0+w*.74,top-h*.3);g.lineTo(x0+w*.85,top)}
  g.closePath();g.fill();
  g.fillStyle='rgba(255,255,255,.28)';g.fillRect(x0+w*.06,gy-wr*1.2-bh*.78,w*.88,bh*.12);
  for(const wx of[.22,.78]){g.fillStyle='#14161b';g.beginPath();g.arc(x0+w*wx,gy-wr*.75,wr,0,6.3);g.fill();g.fillStyle='#9aa0aa';g.beginPath();g.arc(x0+w*wx,gy-wr*.75,wr*.5,0,6.3);g.fill()}
  g.fillStyle='#ffe9a0';g.fillRect(x0+w-8,top+bh*.2,8,bh*.22)};
 car(150,230,86,'#c8202a','coupe');car(440,300,92,'#a9b0ba','estate');car(740,250,92,'#2a5aa0','hatch');car(1000,250,90,'#e8e9ee','hatch');
 g.fillStyle='rgba(170,205,240,.14)';g.fillRect(0,0,W,H);
 g.fillStyle='rgba(255,255,255,.2)';g.beginPath();g.moveTo(60,0);g.lineTo(190,0);g.lineTo(90,H);g.lineTo(-40,H);g.fill();g.beginPath();g.moveTo(520,0);g.lineTo(600,0);g.lineTo(500,H);g.lineTo(420,H);g.fill();
 const t=new THREE.CanvasTexture(cv);t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearFilter;return _showTex=t}
function signPlane(K,txt,bg,fg,wm,hm,x,y,z,ry,pw,ph){{const p0=pw||256,h0=ph||64,r=wm/hm;if(Math.abs(r-p0/h0)>.3){const np=Math.min(1100,Math.round(h0*r));pw=np;if(np<h0*r)wm=np/h0*hm}}const m=wmat([1,1,1],{vertexColors:false},signTex(txt,bg,fg,pw||256,ph||64));const p=new THREE.Mesh(new THREE.PlaneGeometry(wm,hm),m);p.position.set(x,y,z);p.rotation.y=ry;K.x.push(p);return p}
/* ---- buildings ---- */
const DOORC=[[.1,.1,.12],[.12,.2,.45],[.55,.08,.08],[.12,.35,.2],[.9,.88,.8],[.35,.2,.1]],RENDER=[[.93,.9,.78],[.86,.92,.86],[.96,.86,.78],[.84,.88,.96],[.95,.95,.9]],BRICKV=[[1,1,1],[1.1,.95,.85],[.9,.85,.82]];
const TG=[],addrCt={};
function nextNo(road,side){const k=road+side;addrCt[k]=(addrCt[k]||0)+1;return addrCt[k]*2-(side>0?1:0)}
function perimCol(cx,cz,rot,hw,hd,r,sp){const c=Math.cos(rot),s=Math.sin(rot),pt=(a,b)=>COL.push([cx+a*c+b*s,cz-a*s+b*c,r]);const ix=hw-.2,iz=hd-.2;for(let a=-ix;a<=ix+.01;a+=sp){pt(a,-iz);pt(a,iz)}for(let b=-iz+sp;b<iz-.01;b+=sp){pt(-ix,b);pt(ix,b)}}
function bld(cx,cz,rot,o){
 const c=Math.cos(rot),s=Math.sin(rot),w=o.w,d=o.d,H=o.eaves,y0=Y0,K=ck(cx,cz),W=(lx,ly,lz)=>[cx+lx*c+lz*s,y0+ly,cz-lx*s+lz*c];
 const WB=o.wall==='brick'?K.b:o.wall==='stone'?K.s:K.o,wc=o.wc||[1,1,1],n=o.units||1,uw=w/n;
 pbox(WB,...W(0,0,0),w,H,d,wc,rot);
 // roof
 const oh=.3,rh=o.ridge,x0=-w/2-oh,x1=w/2+oh,z0=-d/2-oh,z1=d/2+oh,thatch=o.roof==='thatch',RB=thatch?K.o:K.r,rc=thatch?[.78,.66,.34]:o.roof==='tile'?[1.7,1,.8]:[.92,.97,1.08];
 if(!o.hip){const A=W(x0,H,z1),B=W(x1,H,z1),C=W(x1,H+rh,0),D=W(x0,H+rh,0),E=W(x0,H,z0),F=W(x1,H,z0);RB.tri(A,B,C,rc,null,null,true);RB.tri(A,C,D,rc,null,null,true);RB.tri(E,F,C,rc,null,null,true);RB.tri(E,C,D,rc,null,null,true);
  for(const sg of[-1,1]){const cen=W(0,H+rh*.3,0);WB.tri(W(sg*w/2,H,d/2),W(sg*w/2,H,-d/2),W(sg*w/2,H+rh,0),wc,null,null,false,cen)}}
 else{const rl=Math.max(.3,(w-d)/2),R1=W(-rl,H+rh,0),R2=W(rl,H+rh,0),C1=W(x0,H,z0),C2=W(x1,H,z0),C3=W(x1,H,z1),C4=W(x0,H,z1);RB.tri(C4,C3,R2,rc,null,null,true);RB.tri(C4,R2,R1,rc,null,null,true);RB.tri(C1,C2,R2,rc,null,null,true);RB.tri(C1,R2,R1,rc,null,null,true);RB.tri(C1,C4,R1,rc,null,null,true);RB.tri(C2,C3,R2,rc,null,null,true)}
 const white=[.96,.96,.93],frame=(lx,yb,lz,sg,ww,hh,lit)=>{const z=lz+sg*.03;pbox(K.o,...W(lx,yb,z),ww+.3,hh+.3,.08,white,rot);pbox(lit?K.l:K.g,...W(lx,yb+.15,z+sg*.035),ww,hh,.08,[1,1,1],rot);pbox(K.o,...W(lx,yb+.15,z+sg*.075),.07,hh,.04,white,rot);pbox(K.o,...W(lx,yb+.15+hh*.55,z+sg*.075),ww,.06,.04,white,rot)};
 const win=(lx,yb,sg,ww,hh)=>frame(lx,yb,sg>0?d/2:-d/2,sg,ww||1,hh||1.25,rnd()<.4);
 const chim=(lx)=>{pbox(K.o,...W(lx,H+rh*.35,0),.9,rh*.75+1.3,.9,[.5,.28,.2],rot);pbox(K.o,...W(lx,H+rh*.35+rh*.75+1.3,0),1.05,.14,1.05,[.3,.3,.3],rot)};
 const door=(lx,col,wd)=>{wd=wd||1.0;const zf=d/2,kd=o.kind,big=wd>1.5,sty=kd==='shop'?1:(big?4:(Math.abs(Math.floor(lx*13+cx*7+cz*3))%4)),
  lt=[Math.min(1,col[0]*1.28+.04),Math.min(1,col[1]*1.28+.04),Math.min(1,col[2]*1.28+.04)],dk=shd(col,.62),brass=[.9,.72,.24],iron=[.1,.1,.11],stone=[.66,.65,.62],
  P=(x,y,z,w,h,dd,c,B)=>pbox(B||K.o,...W(lx+x,y,zf+z),w,h,dd,c,rot);
  /* steps */ P(0,0,.5,wd+.6,.09,1.0,[.58,.57,.55]);P(0,0,.36,wd+.36,.18,.6,stone);
  /* architrave */ for(const sg2 of[-1,1])P(sg2*(wd/2+.07),0,.05,.14,2.2,.14,white);P(0,2.1,.05,wd+.42,.2,.16,white);P(0,2.28,.06,wd+.58,.07,.22,white);
  /* slab */ P(0,0,.03,wd,2.1,.06,col);P(0,0,.06,wd,.04,.07,dk);
  if(sty===0||sty===2){const pw=wd*.34,xo=wd*.215;
   if(sty===0){for(const sg2 of[-1,1]){P(sg2*xo,1.2,.075,pw,.78,.03,lt);P(sg2*xo,.2,.075,pw,.8,.03,lt);P(sg2*xo,1.28,.095,pw-.14,.62,.02,dk);P(sg2*xo,.28,.095,pw-.14,.64,.02,dk)}}
   else{for(const sg2 of[-1,1])for(const yy of[.2,.8,1.4]){P(sg2*xo,yy,.075,pw,.52,.03,lt);P(sg2*xo,yy+.07,.095,pw-.14,.38,.02,dk)}
    P(0,2.5,.5,wd+.9,.1,1.0,[.3,.3,.34]);P(0,2.6,.5,wd+.7,.08,.8,[.36,.36,.4]);for(const sg2 of[-1,1])P(sg2*(wd/2+.42),0,.9,.1,2.5,.1,white);
    P(wd/2+.62,1.7,.1,.16,.24,.16,[1,.88,.5],K.l);P(wd/2+.62,1.64,.1,.04,.04,.04,iron)}
   P(wd*.34,.95,.11,.1,.1,.09,brass);P(wd*.34,.9,.09,.1,.24,.03,brass);P(0,1.06,.09,.34,.07,.03,brass);P(0,1.78,.11,.1,.15,.05,brass);P(wd*.34,.82,.095,.03,.05,.02,iron);
   for(const sg2 of[-1,1]){P(sg2*(wd/2+.6),0,.7,.34,.36,.34,[.72,.36,.2]);P(sg2*(wd/2+.6),.36,.7,.4,.34,.4,[.16,.42,.16]);P(sg2*(wd/2+.6),.5,.7,.22,.3,.22,[.9,.35,.45])}}
  else if(sty===1){P(0,0,.075,wd-.16,.62,.03,lt);const lit=kd==='shop';P(0,.7,.075,wd-.2,1.3,.03,[1,1,1],lit?K.l:K.g);P(0,.7,.1,.05,1.3,.03,white);P(0,1.3,.1,wd-.2,.05,.03,white);P(0,.68,.1,wd-.2,.05,.03,white);
   P(-wd*.34,.98,.14,.05,.55,.06,brass);P(-wd*.34,.9,.17,.1,.05,.03,brass);P(0,2.05,.075,wd*.5,.05,.03,[.95,.95,.9]);P(0,.62,.09,wd-.1,.06,.04,brass)}
  else if(sty===3){const n4=4;for(let i=0;i<n4;i++)P(-wd/2+wd/n4*(i+.5),0,.075,wd/n4-.03,2.05,.03,i%2?lt:col);for(const yy of[.4,1.5])P(0,yy,.1,wd,.1,.025,iron);for(const yy of[.4,1.5])P(-wd*.42,yy-.04,.115,.22,.18,.02,iron);
   P(wd*.3,.95,.11,.14,.14,.04,iron);P(wd*.3,.88,.13,.05,.28,.03,iron);P(0,2.05,.075,wd*.8,.04,.03,dk);P(wd/2+.1,1.9,.12,.1,.22,.1,[1,.88,.5],K.l);P(-wd/2-.5,0,.5,.34,.36,.34,[.72,.36,.2]);P(-wd/2-.5,.36,.5,.4,.34,.4,[.7,.2,.3]);P(wd/2+.5,0,.5,.34,.36,.34,[.72,.36,.2]);P(wd/2+.5,.36,.5,.4,.34,.4,[.16,.42,.16])}
  else{/* double doors */P(0,0,.075,.03,2.05,.03,dk);for(const sg2 of[-1,1]){const xo=sg2*wd*.25;P(xo,1.1,.075,wd*.4,.9,.03,lt);P(xo,1.18,.095,wd*.4-.16,.72,.02,dk);P(xo,.18,.075,wd*.4,.8,.03,lt);P(xo,.26,.095,wd*.4-.16,.64,.02,dk);P(xo,0,.08,wd*.46,.14,.035,brass);P(sg2*.12,.95,.11,.05,.4,.05,brass);P(sg2*.3,1.9,.075,wd*.18,.08,.03,brass)}
   P(0,2.45,.5,wd+1.0,.1,.9,[.24,.18,.12]);for(const sg2 of[-1,1]){P(sg2*(wd/2+.46),0,.88,.12,2.45,.12,white);P(sg2*(wd/2+.62),1.9,.1,.16,.24,.16,[1,.88,.5],K.l)}}
 };
 /* FASHION SHOPS: 1 budget, 2 high end, 3 ultra luxury */
 const FPAL=[[.8,.2,.2],[.2,.4,.8],[.9,.8,.2],[.2,.6,.3],[.9,.5,.2],[.95,.95,.95],[.6,.3,.7],[.9,.5,.6],[.2,.7,.7],[.5,.5,.5],[.3,.2,.5],[.8,.3,.4]],fashFront=(ux,nm,uw,t)=>{const zf=d/2,dx=ux+uw*.3,p=(x,y,z,sx,sy,sz,c,B)=>pbox(B||K.o,...W(x,y,z),sx,sy,sz,c,rot),gold=[.86,.68,.22],brass=[.78,.6,.2],X0=ux-uw/2;
  const GLT=()=>{if(window.__FGL)return window.__FGL;const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.fillStyle='rgba(170,210,235,.05)';g.fillRect(0,0,128,128);g.fillStyle='rgba(255,255,255,.16)';for(const[x0,wd]of[[10,14],[34,6],[78,22]]){g.beginPath();g.moveTo(x0+30,0);g.lineTo(x0+30+wd,0);g.lineTo(x0+wd,128);g.lineTo(x0,128);g.fill()}const tx=new THREE.CanvasTexture(c);return window.__FGL=tx};
  /* a proper shop window: lit backdrop, riser, frame, a shallow display box and a pane of glass in front of everything */
  const winBox=(cx,y,w,h,fc,riser,bg,flr)=>{const zo=zf+.74;p(cx,0,zf+.4,w+.34,y,.8,riser);p(cx,y,zf+.05,w,h,.05,bg,K.l);p(cx,y,zf+.38,w,.05,.66,flr);
   p(cx,y-.08,zo,w+.34,.14,.22,fc);p(cx,y+h-.04,zo,w+.34,.16,.22,fc);p(cx-w/2-.08,y,zo,.14,h,.22,fc);p(cx+w/2+.08,y,zo,.14,h,.22,fc);
   const gm=wmat([1,1,1],{vertexColors:false,transparent:true,depthWrite:false},GLT()),pl=new THREE.Mesh(new THREE.PlaneGeometry(w,h),gm),q=W(cx,y+h/2,zf+.72);pl.position.set(q[0],q[1],q[2]);pl.rotation.y=rot;pl.renderOrder=2;K.x.push(pl)};
  const mann=(mx,y0,cc,sc,pc)=>{const z0=zf+.38;p(mx,y0,z0,.6*sc,.06,.6*sc,[.12,.1,.1]);p(mx,y0+.06,z0,.07,.8*sc,.07,pc||[.7,.55,.2]);p(mx,y0+.4*sc,z0,.34*sc,.7*sc,.2*sc,[.16,.16,.2]);p(mx,y0+.86*sc,z0,.4*sc,.62*sc,.22*sc,cc);p(mx,y0+1.46*sc,z0,.15*sc,.12*sc,.15*sc,[.9,.8,.7]);p(mx,y0+1.58*sc,z0,.2*sc,.24*sc,.2*sc,[.9,.82,.72]);p(mx+.27*sc,y0+.9*sc,z0,.08*sc,.55*sc,.1*sc,cc);p(mx-.27*sc,y0+.9*sc,z0,.08*sc,.55*sc,.1*sc,cc)};
  const topWin=()=>{frame(ux-uw*.14,4.35,d/2,1,1.3,1.2,0);frame(ux+uw*.3,4.35,d/2,1,1.1,1.2,0)};
  if(t===1){ /* BUDGET: bright yellow and red, striped awning, sale posters, rails on the pavement */
   door(dx,[.8,.14,.14],1.0);
   p(ux,3.0,zf+.3,uw-.2,1.15,.5,[.98,.82,.08]);p(ux,2.95,zf+.58,uw-.2,.08,.06,[.8,.1,.1]);p(ux,4.07,zf+.58,uw-.2,.08,.06,[.8,.1,.1]);
   {const f=W(ux,3.58,zf+.58);signPlane(K,nm.t,'#f8d010','#c01010',uw-.7,.95,f[0],f[1],f[2],rot,512,56)}
   for(let i=0;i<14;i++){const aw=(uw-.2)/14;p(X0+.1+aw*(i+.5),2.55,zf+.55,aw,.12,1.1,i%2?[.96,.96,.96]:[.82,.1,.1])}
   {const cx=ux-uw*.22,ww=uw*.4;winBox(cx,.5,ww,1.78,[.8,.1,.1],[.55,.12,.1],[1,.95,.6],[.7,.62,.45]);p(cx,1.6,zf+.35,ww-.3,.04,.04,[.6,.6,.65]);for(let i=0;i<14;i++)p(cx-ww/2+.5+i*(ww-1)/13,1.0,zf+.35,.3,.72,.1,FPAL[(i*5+2)%12]);for(let k=0;k<3;k++)for(let j=0;j<4;j++)p(cx-ww/2+.7+k*.6,.56+j*.12,zf+.4,.5,.1,.4,FPAL[(k*4+j*3)%12]);mann(cx+ww/2-.8,.56,[.95,.8,.1],.75);mann(cx+ww/2-1.9,.56,[.82,.15,.15],.75,[.6,.6,.65])}
   {const f=W(ux-uw*.22-1.0,2.1,zf+.12);signPlane(K,'SALE  50% OFF','#d01010','#ffffff',uw*.2,.5,f[0],f[1],f[2],rot,256,64)}
   
   for(let k=0;k<2;k++){const rx=X0+1.2+k*2.2;p(rx-.9,0,zf+1.6,.05,1.5,.05,[.6,.6,.65]);p(rx+.9,0,zf+1.6,.05,1.5,.05,[.6,.6,.65]);p(rx,1.5,zf+1.6,1.85,.04,.04,[.7,.7,.75]);for(let i=0;i<6;i++){const cc=FPAL[(i*3+k*5)%12];p(rx-.7+i*.28,.7,zf+1.6,.2,.8,.08,cc)}}
   p(X0+uw*.45,0,zf+1.7,.9,1.05,.1,[.9,.8,.5]);{const f=W(X0+uw*.45,.62,zf+1.77);signPlane(K,'SALE','#c01010','#fff',.75,.55,f[0],f[1],f[2],rot,128,64)}
   for(let i=0;i<16;i++)p(X0+.4+(uw-.8)*i/15,3.95-Math.abs(Math.sin(i*.4))*.14,zf+1.0,.18,.24,.03,FPAL[(i*5)%12]);
   topWin()}
  else if(t===2){ /* HIGH END: deep green, brass, big display windows with mannequins, bay trees */
   door(dx,[.08,.22,.14],1.0);
   p(ux,2.95,zf+.28,uw-.2,1.2,.5,[.07,.2,.14]);p(ux,2.9,zf+.55,uw-.2,.07,.06,brass);p(ux,4.1,zf+.55,uw-.2,.07,.06,brass);
   {const f=W(ux,3.55,zf+.55);signPlane(K,nm.t,'#0f3324','#e8c860',uw-.8,.95,f[0],f[1],f[2],rot,512,56)}
   for(let i=0;i<9;i++){const aw=(uw-.4)/9;p(X0+.2+aw*(i+.5),2.45,zf+.6,aw*.92,.1,1.1,i%2?[.1,.3,.2]:[.06,.2,.14]);p(X0+.2+aw*(i+.5),2.38,zf+1.12,aw*.92,.14,.06,brass)}
   const wx0=X0+.5,wx1=dx-1.1,wc=(wx0+wx1)/2,ww=wx1-wx0;
   winBox(wc,.5,ww,1.78,brass,[.05,.16,.11],[.98,.9,.72],[.35,.24,.14]);p(wc,2.1,zf+.36,ww-.6,.05,.05,brass);for(let m=0;m<3;m++){const mx=wx0+ww*(m+.5)/3;mann(mx,.56,[[.5,.1,.2],[.12,.2,.4],[.85,.8,.7]][m],.9);p(mx,2.0,zf+.35,.16,.12,.16,[1,.88,.5],K.l)}for(let k=0;k<2;k++)for(let j=0;j<3;j++)p(wx0+.5+k*.55,.56+j*.12,zf+.45,.5,.1,.4,[[.6,.1,.2],[.1,.2,.45],[.85,.8,.7]][(j+k)%3]);
   for(const sg of[-1,1]){const tx=dx+sg*1.5;p(tx,0,zf+.9,.45,.4,.45,[.2,.2,.24]);p(tx,.4,zf+.9,.08,.7,.08,[.35,.22,.1]);p(tx,1.0,zf+.9,.6,.6,.6,[.12,.4,.16]);p(dx+sg*.85,1.7,zf+.25,.14,.3,.14,[1,.88,.5],K.l)}
   p(dx,0,zf+.55,1.5,.08,1.0,[.35,.35,.38]);
   topWin()}
  else if(t===4){ /* SILK HOUSE: magenta and gold fascia, scalloped arches, marigold garlands, draped silks in the window */
   const mg=[.54,.1,.29],sf=[.98,.6,.1];door(dx,[.5,.08,.22],1.0);
   p(ux,2.95,zf+.3,uw-.2,1.2,.5,mg);p(ux,2.9,zf+.57,uw-.2,.07,.06,gold);p(ux,4.12,zf+.57,uw-.2,.07,.06,gold);
   {const f=W(ux,3.55,zf+.57);signPlane(K,nm.t,'#8a1a4a','#ffd24a',uw-.8,.95,f[0],f[1],f[2],rot,512,56)}
   for(let i=0;i<12;i++){const aw=(uw-.4)/12,ax=X0+.2+aw*(i+.5);p(ax,2.62,zf+.56,aw*.8,.22,.08,gold);p(ax,2.5,zf+.56,aw*.45,.12,.08,gold)}
   for(let g2=0;g2<4;g2++){const gx0=X0+.4+g2*(uw-.8)/4,gw=(uw-.8)/4;for(let k=0;k<=8;k++){const t=k/8;p(gx0+gw*t,2.3-Math.sin(t*Math.PI)*.35,zf+.62,.13,.13,.13,k%2?sf:[1,.82,.15])}}
   const wx0=X0+.5,wx1=dx-1.1,wc=(wx0+wx1)/2,ww=wx1-wx0;winBox(wc,.5,ww,1.68,gold,[.36,.06,.18],[1,.9,.7],[.5,.12,.2]);
   for(let m=0;m<6;m++){const mx=wx0+.3+m*(ww-.6)/5,cc=[[.8,.1,.15],[.05,.4,.6],[.98,.62,.1],[.8,.1,.5],[.1,.45,.25],[.9,.7,.2]][m];p(mx,.56,zf+.3,.38,1.55,.06,cc);p(mx,.56,zf+.34,.38,.08,.06,gold);p(mx,2.06,zf+.32,.42,.06,.08,gold)}
   mann(wc,.56,[.8,.1,.5],.85,gold);
   for(const sg of[-1,1]){p(dx+sg*.75,0,zf+.15,.16,2.5,.16,gold);p(dx+sg*1.3,0,zf+.6,.45,.4,.45,[.62,.28,.14]);p(dx+sg*1.3,.4,zf+.6,.55,.3,.55,[.98,.62,.1]);p(dx+sg*1.0,2.05,zf+.4,.22,.3,.22,[1,.82,.4],K.l)}
   p(dx,2.45,zf+.12,1.7,.12,.12,gold);for(let k=0;k<7;k++)p(dx-.6+k*.2,2.28-Math.sin(k/6*Math.PI)*.1,zf+.2,.11,.11,.11,k%2?sf:[1,.82,.15]);
   topWin()}
  else{ /* ULTRA: pale stone, four columns, black and gold fascia, glass front, red carpet */
   p(ux,0,zf+1.7,uw+.4,.14,2.6,[.82,.8,.76]);p(ux,.14,zf+1.5,uw,.14,2.2,[.88,.86,.82]);
   p(ux,.2,zf+.08,uw-.6,3.0,.06,[.95,.82,.55],K.l);
   for(let i=0;i<7;i++)p(X0+.6+(uw-1.2)*i/6,.2,zf+.28,.1,3.0,.1,gold);
   {const wx0=X0+1.0,wx1=dx-1.6,wc=(wx0+wx1)/2,ww=wx1-wx0;winBox(wc,.4,ww,2.68,gold,[.04,.04,.06],[.92,.78,.5],[.1,.1,.12]);for(let m=0;m<6;m++){const mx=wx0+ww*(m+.5)/6,dc=[[.85,.68,.2],[.05,.05,.08],[.6,.05,.12],[.9,.88,.84],[.85,.68,.2],[.12,.12,.4]][m];mann(mx,.46,dc,1.15);p(mx,2.95,zf+.35,.25,.1,.25,[1,.9,.6],K.l)}for(let i=1;i<6;i++)p(wx0+ww*i/6,.4,zf+.74,.06,2.8,.1,gold)}
   p(ux,3.3,zf+.45,uw,1.1,.9,[.05,.05,.07]);p(ux,3.22,zf+.92,uw,.08,.06,gold);p(ux,4.38,zf+.92,uw,.08,.06,gold);
   {const f=W(ux,3.85,zf+.93);signPlane(K,nm.t,'#0a0a10','#f2c84a',uw-1.8,.9,f[0],f[1],f[2],rot,640,56)}
   p(ux,4.45,zf+.2,uw+.6,.3,1.9,[.92,.9,.84]);p(ux,4.75,zf+.2,uw+.8,.12,2.1,gold);
   for(let i=0;i<5;i++){const cx=X0+.3+(uw-.6)*i/4;p(cx,.28,zf+1.9,.8,.18,.8,[.92,.9,.86]);p(cx,.46,zf+1.9,.62,3.9,.62,[.97,.95,.9]);p(cx,4.36,zf+1.9,.8,.18,.8,gold)}
   p(ux,3.7,zf+1.95,uw-.4,.12,.3,[.92,.9,.84]);
   door(dx,[.05,.05,.07],1.2);p(dx,0,zf+.2,2.0,2.55,.1,gold);
   p(dx,.1,zf+3.2,1.6,.05,4.4,[.62,.04,.1]);
   for(let k=0;k<4;k++)for(const sg of[-1,1]){const zz=zf+1.9+k*1.2;p(dx+sg*1.05,.1,zz,.1,.95,.1,gold);p(dx+sg*1.05,1.05,zz,.18,.18,.18,gold);if(k<3)p(dx+sg*1.05,.7,zz+.6,.04,.04,1.2,[.55,.05,.1])}
   for(const sg of[-1,1]){const tx=dx+sg*3.0;if(Math.abs(tx-ux)<uw/2-.8){p(tx,.1,zf+3.0,.7,.6,.7,[.1,.1,.12]);p(tx,.7,zf+3.0,.7,.05,.7,gold);p(tx,.75,zf+3.0,.6,.9,.6,[.12,.45,.2])}}
   for(let i=0;i<6;i++)p(X0+1+(uw-2)*i/5,4.9,zf+1.1,.16,.16,.16,[1,.9,.6],K.l)}
 };
 /* VILLAGE MOTORS: a proper glass showroom front */
 const showFront=(ux,nm,col)=>{const zf=d/2,gx0=-9.5,gx1=4.5,gw=gx1-gx0,gc=(gx0+gx1)/2,gy=.35,gh=2.9,dk=[.07,.09,.13];
  pbox(K.o,...W(gc,0,zf+.1),gw+.5,.35,.3,dk,rot);pbox(K.o,...W(gc,gy+gh,zf+.1),gw+.5,.3,.3,dk,rot);
  for(let i=0;i<=4;i++)pbox(K.o,...W(gx0+gw*i/4,.2,zf+.1),.18,gh+.3,.22,dk,rot);
  {const m=wmat([1,1,1],{vertexColors:false},showTex()),p=new THREE.Mesh(new THREE.PlaneGeometry(gw,gh),m),q=W(gc,gy+gh/2,zf+.07);p.position.set(q[0],q[1],q[2]);p.rotation.y=rot;K.x.push(p)}
  door(ux+uw*.3,[.07,.09,.13],1.6);
  pbox(K.o,...W(gc+.6,3.75,zf+.15),gw+3.4,1.25,.4,dk,rot);pbox(K.o,...W(gc+.6,3.68,zf+.37),gw+3.4,.09,.06,[.8,.1,.12],rot);
  {const f=W(gc+.6,4.38,zf+.37);signPlane(K,nm.t,nm.bg||'#101820',nm.fg||'#f0c840',gw+2.4,.95,f[0],f[1],f[2],rot,512,56)}
  for(const lx of[-8.2,-2.5,3.2])pbox(K.o,...W(lx,5.2,zf+.05),1.6,.5,.1,[.92,.92,.95],rot)};
 const k=o.kind;
 if(k==='terr'||k==='semi'||k==='det'||k==='cot'||k==='bung'){
  for(let i=0;i<n;i++){const ux=-w/2+uw*(i+.5),sg=(i%2?-1:1),two=H>4.5,mid=k==='det'||k==='cot'||k==='bung',a=uw*(mid?.27:.22),dx=mid?ux:ux+sg*a;
   door(dx,o.door||DOORC[Math.floor(rnd()*DOORC.length)]);
   if(mid){win(ux-a,.95,1,1.1,1.2);win(ux+a,.95,1,1.1,1.2);if(two){win(ux-a,3.1,1,.95,1.1);win(ux,3.1,1,.95,1.1);win(ux+a,3.1,1,.95,1.1)}}
   else{win(ux-sg*a,.95,1,1.1,1.2);win(ux-a,3.1,1,.95,1.1);win(ux+a,3.1,1,.95,1.1)}
   win(ux-a,.95,-1,1.1,1.2);win(ux+a,.95,-1,1.1,1.2);if(two){win(ux-a,3.1,-1,.95,1.1);win(ux+a,3.1,-1,.95,1.1)}
   if(o.road){const dw=W(dx,0,d/2+1.4),no=nextNo(o.road,o.side),np=roadNear(dw[0],dw[2]),q=np.q,dxv=dw[0]-q.px,dzv=dw[2]-q.pz,dl=Math.hypot(dxv,dzv)||1;TG.push({x:dw[0],z:dw[2],dx:q.px+dxv/dl*(RW-1.7),dz:q.pz+dzv/dl*(RW-1.7),addr:no+' '+o.road})}
   if(o.fg>1.2){const gz=d/2+o.fg-.55,hedge=(i+Math.floor(cx))%2===0,gc=hedge?[.14,.4,.15]:[.5,.28,.2],gh=hedge?1:.75,gt=hedge?.8:.3,sgm=(a,b)=>{if(b-a>.3)pbox(K.o,...W((a+b)/2,0,gz),b-a,gh,gt,gc,rot)};sgm(ux-uw/2-(i===0?.3:0),dx-.8);sgm(dx+.8,ux+uw/2+(i===n-1?.3:0));const pa=W(dx,0,d/2+.5),pb=W(dx,0,d/2+o.fg+.2);quadXZ(K.rd,[pa[0]-.55*c,pa[2]+.55*s],[pa[0]+.55*c,pa[2]-.55*s],[pb[0]+.55*c,pb[2]-.55*s],[pb[0]-.55*c,pb[2]+.55*s],CPAV,Y0+.04)}}
  for(let i=0;i<=n;i+=2){if(i<n||n===1)chim(n===1?w*.28:-w/2+uw*Math.min(i+1,n))}
 }else if(k==='shop'){
  const names=o.names;
  for(let i=0;i<n;i++){const ux=-w/2+uw*(i+.5),nm=names[i],col=nm.col||[.2,.3,.5];
   if(o.showroom)showFront(ux,nm,col);else if(o.fash)fashFront(ux,nm,uw,o.fash);else{
   frame(ux-uw*.14,.5,d/2,1,3.3,2.1,rnd()<.3);door(ux+uw*.3,DOORC[(i*2)%6],1.0);
   pbox(K.o,...W(ux,2.95,d/2+.5),uw-.2,.14,1.1,i%2?[.8,.15,.15]:[.15,.35,.6],rot);pbox(K.o,...W(ux,3.1,d/2+.12),uw-.1,.95,.2,col,rot);
   {const f=W(ux,3.55,d/2+.25);signPlane(K,nm.t,nm.bg||'#20304a',nm.fg||'#f5f0d8',uw-.5,.8,f[0],f[1],f[2],rot,256,52)}
   frame(ux-uw*.14,4.25,d/2,1,1.3,1.25,rnd()<.4);frame(ux+uw*.3,4.25,d/2,1,1.1,1.25,rnd()<.4)}
   frame(ux-uw*.14,.9,-d/2,-1,1.4,1.2,0);frame(ux+uw*.3,.9,-d/2,-1,1.1,1.2,0);frame(ux-uw*.14,4.25,-d/2,-1,1.3,1.25,0);frame(ux+uw*.3,4.25,-d/2,-1,1.1,1.25,0);
   {const a=W(ux+uw*.3,0,d/2+1.4),b2=W(ux+uw*.3,0,d/2-.5);SHOPD.push({x:a[0],z:a[2],psi:Math.atan2(a[0]-b2[0],a[2]-b2[2]),t:nm.t,bg:nm.bg||'#20304a',fg:nm.fg||'#f5f0d8'})}
   if(nm.depot){const dw=W(ux+uw*.3,0,d/2+1.4),np=roadNear(dw[0],dw[2]),q=np.q,dxv=dw[0]-q.px,dzv=dw[2]-q.pz,dl=Math.hypot(dxv,dzv)||1;DEPOTS.push({name:nm.t,type:nm.depot,x:q.px+dxv/dl*(RW-1.7),z:q.pz+dzv/dl*(RW-1.7),dx:dw[0],dz:dw[2]})}}
  for(let i=1;i<n;i+=2)chim(-w/2+uw*i);
 }else if(k==='pub'){
  for(const bx of[-6,-3,3,6]){frame(w/15*bx,.95,d/2,1,1.4,1.3,rnd()<.5);frame(w/15*bx,3.3,d/2,1,1.2,1.3,rnd()<.5)}
  {const a=W(0,0,d/2+1.4),b2=W(0,0,d/2-.5);SHOPD.push({x:a[0],z:a[2],psi:Math.atan2(a[0]-b2[0],a[2]-b2[2]),t:'THE ROYAL OAK',bg:'#1c3a24',fg:'#f0d070',pub:1})}
  door(0,DOORC[0],1.8);for(const yy of[2.6,5.2])pbox(K.o,...W(0,yy,d/2+.05),w+.1,.2,.1,[.18,.13,.09],rot);for(let i=0;i<=5;i++)pbox(K.o,...W(-w/2+i*w/5,0,d/2+.05),.22,H,.1,[.18,.13,.09],rot);
  chim(-w*.3);chim(w*.3);{const f=W(0,4.1,d/2+.12);signPlane(K,'THE ROYAL OAK','#1c3a24','#f0d070',2.8,.9,f[0],f[1],f[2],rot,256,64)}
  {const f=W(w/2+.3,3.8,d/2+1.2);signPlane(K,'THE ROYAL OAK','#6a1a1a','#f0d070',1.5,1.2,f[0],f[1],f[2],rot+Math.PI/2,128,100);signPlane(K,'THE ROYAL OAK','#6a1a1a','#f0d070',1.5,1.2,f[0],f[1],f[2],rot-Math.PI/2,128,100);pbox(K.o,...W(w/2+.3,5.1,d/2+.7),.1,.1,1.2,[.2,.15,.1],rot)}
  for(let t=0;t<3;t++){const f=W(-4+t*3.5,0,d/2+3.2);pbox(K.o,f[0],f[1]+.7,f[2],1.8,.08,.9,[.45,.3,.15],rot);pbox(K.o,f[0],f[1],f[2],.15,.7,.7,[.3,.2,.1],rot);COL.push([f[0],f[2],.9])}
 }else if(k==='church'){
  const sw=[.66,.64,.58];for(const cx2 of[-7,-3.5,0,3.5])frame(cx2,1.2,d/2,1,1,2.6,0);door(w/2-3.5,[.25,.15,.08],1.8);
  pbox(K.s,...W(-w/2-2,0,0),5,15,5,sw,rot);for(const[a,b]of[[-1,-1],[1,-1],[1,1],[-1,1]])pbox(K.s,...W(-w/2-2+a*2.2,15,b*2.2),.9,.9,.9,sw,rot);
  {const p=W(-w/2-2,15,0);pcone(K.r,p[0],p[1],p[2],3.5,8,4,[.7,.76,.88],rot+.7854)}for(const yy of[8.5])for(const sg of[1,-1]){frame(-w/2-2,yy,2.5*sg,sg,.9,2.2,0)}
  const gx=W(0,0,-d/2-11);const gy=ck(gx[0],gx[2]);for(let i=0;i<5;i++)for(let j=0;j<5;j++){if((i*7+j*3)%5===0)continue;const q=W(-w/2+3+i*3.2,0,-d/2-3-j*3);pbox(K.o,q[0],q[1],q[2],.6,1.1,.16,[.5,.5,.52],rot+(((i+j)%3)-1)*.06)}
 }else if(k==='school'){
  for(const sx of[-10.5,-7,-3.5,3.5,7,10.5])frame(sx,1.0,d/2,1,1.8,1.5,rnd()<.2);door(0,[.12,.2,.45],2.0);{const f=W(0,3.3,d/2+.12);signPlane(K,'VILLAGE SCHOOL','#1d4a8a','#ffffff',5.6,.9,f[0],f[1],f[2],rot,256,48)}
  const pg=W(0,0,-d/2-9),gk=ck(pg[0],pg[2]);const cc=[pg[0],pg[2]];quadXZ(gk.rd,[cc[0]-w/2,cc[1]-7],[cc[0]+w/2,cc[1]-7],[cc[0]+w/2,cc[1]+7],[cc[0]-w/2,cc[1]+7],[.34,.34,.38],Y0+.05);
 }
 // colliders + footprint
 perimCol(cx,cz,rot,w/2,d/2,.5,1.2);PLACED.push({x:cx,z:cz,rot,hw:w/2+.8,hd:d/2+.8});BLD.push({x:cx,z:cz,rot,w,d,k:o.kind,n:o.units||1});OBS.push({x:cx,z:cz,c,s,hw:w/2,hd:d/2});if(k==='church')OBS.push({x:W(-w/2-2,0,0)[0],z:W(-w/2-2,0,0)[2],c,s,hw:2.5,hd:2.5});

}
const DEPOTS=[],SHOPD=[];
/* ---- placement ---- */
function frontage(px,pz,dx,dz,sd,fg,d){const nx=-dz*sd,nz=dx*sd;return{cx:px+nx*(RW+PW+fg+d/2),cz:pz+nz*(RW+PW+fg+d/2),rot:Math.atan2(-nx,-nz)}}
function fin(o){const r=rnd();if(o.kind==='cot'){o.wall=r<.55?'stone':'render';o.roof=rnd()<.35?'thatch':'slate'}else{o.wall=r<.62?'brick':'render';o.roof=rnd()<.55?'slate':'tile'}
 if(o.wall==='brick')o.wc=BRICKV[Math.floor(rnd()*3)];else if(o.wall==='stone')o.wc=[1,.94,.8];else o.wc=RENDER[Math.floor(rnd()*RENDER.length)];return o}
const KIND={terr:()=>{const n=2+Math.floor(rnd()*3);return fin({kind:'terr',units:n,w:5*n,d:7.2,eaves:5.2,ridge:2.4,fg:2.2})},semi:()=>fin({kind:'semi',units:2,w:11,d:8.2,eaves:5.2,ridge:2.6,fg:5}),det:()=>fin({kind:'det',units:1,w:9.5,d:8.5,eaves:5.2,ridge:3,fg:6.5,hip:1}),cot:()=>fin({kind:'cot',units:1,w:7.5,d:6,eaves:3.8,ridge:3,fg:3}),bung:()=>fin({kind:'bung',units:1,w:9,d:7.5,eaves:2.7,ridge:2.2,fg:5.5,hip:1})};
const MIX={'HIGH STREET':['terr','terr','terr','cot','cot','cot','semi','semi','det'],'CHURCH LANE':['cot','cot','cot','semi','semi','det','det','terr'],'MILL ROAD':['det','det','det','det','semi','semi','bung','bung'],'THE GREEN':['cot','cot','cot','det','det','semi','semi','terr'],'GREEN LANE':['semi','semi','terr','terr'],'STATION ROAD':['terr','terr','terr','terr','semi','semi'],'ORCHARD CLOSE':['det','det','det','semi','semi','bung','bung'],'SCHOOL LANE':['semi','semi','semi','bung','bung'],'BACK LANE':['bung','bung','bung','det','det','cot']};
const SHOPS_S=[{t:'POST OFFICE',bg:'#b81818',fg:'#ffffff',col:[.7,.08,.08],depot:'parcel'},{t:'CO-OP',bg:'#0e6a3a',fg:'#ffffff',col:[.05,.4,.22]},{t:'CHEMIST',bg:'#1a8a4a',fg:'#ffffff',col:[.1,.5,.28]},{t:"FRANKIE'S FISH & CHIPS",bg:'#f2c814',fg:'#a01010',col:[.9,.78,.1],depot:'food'},{t:'BAKERY',bg:'#7a4a22',fg:'#fff0d0',col:[.45,.28,.14]},{t:'NEWSAGENT',bg:'#1a3a7a',fg:'#ffffff',col:[.1,.22,.48]},{t:'CAFE',bg:'#5a2a2a',fg:'#ffe8c0',col:[.35,.16,.16]},{t:'HAIRDRESSER',bg:'#6a2a6a',fg:'#ffffff',col:[.42,.16,.42]}];
const SHOPS_N=[{t:'BUTCHER',bg:'#8a1c1c',fg:'#ffffff',col:[.55,.1,.1]},{t:'FLORIST',bg:'#2a7a3a',fg:'#ffe8f0',col:[.16,.48,.22]},{t:'ESTATE AGENT',bg:'#222a3a',fg:'#ffffff',col:[.13,.16,.23]},{t:'DELI',bg:'#9a6a1a',fg:'#ffffff',col:[.6,.4,.1]},{t:'BOOKSHOP',bg:'#2a3a6a',fg:'#f0e8c8',col:[.16,.22,.42]},{t:'VET',bg:'#1a6a7a',fg:'#ffffff',col:[.1,.42,.48]}];
function special(o,px,pz,dx,dz,sd){const f=frontage(px,pz,dx,dz,sd,o.fg,o.d);o.road=o.road||null;if(!footOK(f.cx,f.cz,f.rot,o.w/2,o.d/2))console.warn('special blocked',o.kind,o.names&&o.names[0].t);o.side=sd;bld(f.cx,f.cz,f.rot,o)}
special({kind:'shop',units:8,w:50,d:9,eaves:6.2,ridge:3.2,fg:.6,wall:'brick',wc:[1,.95,.9],roof:'slate',names:SHOPS_S},27,0,1,0,1);
special({kind:'shop',units:6,w:37.5,d:9,eaves:6.2,ridge:3.2,fg:.6,wall:'render',wc:[.93,.9,.8],roof:'tile',names:SHOPS_N},33,0,1,0,-1);
special({kind:'pub',w:15,d:10,eaves:5.6,ridge:2.8,fg:1.5,wall:'render',wc:[.95,.93,.86],roof:'slate',hip:1},-46,0,1,0,-1);
special({kind:'church',w:20,d:8.5,eaves:6.5,ridge:3.8,fg:6,wall:'stone',wc:[1.2,1.15,1.05],roof:'slate'},-20,-60,0,1,-1);
special({kind:'school',w:30,d:9,eaves:3.6,ridge:2.2,fg:4,wall:'brick',wc:[1,.92,.85],roof:'tile',hip:1},5,125,1,0,1);
RNDALT=1;
special({kind:'shop',units:1,w:20,d:10,eaves:6.2,ridge:3.2,fg:.6,wall:'render',wc:[.96,.96,.98],roof:'tile',showroom:1,names:[{t:'VILLAGE MOTORS',bg:'#101820',fg:'#f0c840',col:[.08,.12,.2]}]},-62,0,1,0,1);
special({kind:'shop',units:1,w:22,d:11,eaves:5.4,ridge:2.6,fg:12,wall:'brick',wc:[.9,.78,.7],roof:'slate',names:[{t:"JOE'S GARAGE",bg:'#c82020',fg:'#ffffff',col:[.6,.1,.1]}]},-100,0,1,0,-1);
PLACED.push({x:-100,z:-11,rot:0,hw:15,hd:7.5});
special({kind:'shop',units:1,w:26,d:12,eaves:6.4,ridge:3.4,fg:.6,wall:'render',wc:[.9,.9,1],roof:'tile',names:[{t:'STRIKE BOWL',bg:'#5a1a8a',fg:'#ffe040',col:[.3,.1,.5]}]},78,0,1,0,-1);
special({kind:'shop',units:1,w:16,d:10,eaves:6,ridge:3,fg:.6,wall:'render',wc:[1.05,.78,.6],roof:'tile',fash:4,names:[{t:"RANI'S SILK HOUSE",bg:'#8a1a4a',fg:'#ffd24a',col:[.54,.1,.29]}]},198,0,1,0,1);
special({kind:'shop',units:1,w:18,d:10,eaves:6,ridge:3,fg:.6,wall:'brick',wc:[1,.72,.55],roof:'tile',fash:1,names:[{t:"PENNY'S BARGAINS",bg:'#f8d010',fg:'#c01010',col:[.9,.75,.1]}]},-86,0,1,0,1);
special({kind:'shop',units:1,w:20,d:10,eaves:6.2,ridge:3.2,fg:2.2,wall:'brick',wc:[.62,.74,.66],roof:'slate',fash:2,names:[{t:'HARRINGTON & CO',bg:'#0f3324',fg:'#e8c860',col:[.07,.2,.14]}]},-125,0,1,0,1);
special({kind:'shop',units:1,w:24,d:11,eaves:6.8,ridge:1.2,fg:5.2,wall:'stone',wc:[1.7,1.65,1.52],roof:'slate',fash:3,names:[{t:"MAISON D'OR",bg:'#0a0a10',fg:'#f2c84a',col:[.05,.05,.07]}]},-150,0,1,0,1);
special({kind:'shop',units:1,w:16,d:10,eaves:5.8,ridge:2.8,fg:.6,wall:'brick',wc:[.85,.7,.66],roof:'slate',names:[{t:'LUCKY BETS',bg:'#b01020',fg:'#ffe040',col:[.65,.1,.14]}]},-72,0,1,0,-1);
special({kind:'shop',units:1,w:26,d:10,eaves:8.6,ridge:.5,fg:26,wall:'stone',wc:[.82,.82,.88],roof:'slate',names:[{t:'VILLAGE ROVERS FC',bg:'#a01418',fg:'#ffffff',col:[.6,.08,.1]}]},-190,0,1,0,-1);
special({kind:'shop',units:1,w:18,d:10,eaves:5.8,ridge:2.8,fg:.6,wall:'brick',wc:[.62,.5,.44],roof:'slate',names:[{t:'BULLSEYE RANGE',bg:'#183a22',fg:'#ffe040',col:[.1,.24,.14]}]},-124,0,1,0,-1);
PLACED.push({x:-160,z:-90,rot:0,hw:5.5,hd:85},{x:-160,z:-166,rot:0,hw:26,hd:21});/* keep Airport Road and the terminal forecourt clear */
special({kind:'shop',units:1,w:16,d:10,eaves:6,ridge:3,fg:.6,wall:'render',wc:[.42,.3,.62],roof:'slate',names:[{t:'NEON ARCADE',bg:'#1a0a30',fg:'#ff50e8',col:[.1,.04,.19]}]},-146,0,1,0,-1);
PLACED.push({x:-193,z:-17,rot:0,hw:18,hd:15},{x:-193,z:-60,rot:0,hw:17,hd:16});
RNDALT=0;
for(const dp of DEPOTS)console.log('depot',dp.name,dp.x.toFixed(0),dp.z.toFixed(0));
/* post office yard: any house overlapping the loading yard is built into a throw-away chunk so the world's random layout stays the same */
{const ckA=ck,KDY=new Proxy({},{get:(t,k)=>t[k]||(t[k]=new Builder(3))});let YZ=0;ck=function(x,z){return YZ?KDY:ckA(x,z)};
 const bA=bld;bld=function(cx,cz,rot,o){const r=Math.max(o.w,o.d)/2;
  if(o.kind!=='shop'&&o.kind!=='pub'&&o.kind!=='church'&&o.kind!=='school'&&cx+r>43&&cx-r<60&&cz+r>15&&cz-r<31){const nc=COL.length,no=OBS.length,nb=BLD.length,nt=TG.length;YZ=1;try{bA(cx,cz,rot,o)}finally{YZ=0}COL.length=nc;OBS.length=no;BLD.length=nb;TG.length=nt;return}
  bA(cx,cz,rot,o)}}
// procedural fill
for(const r of ROADS){if(r.n==='HIGH STREET'&&false)continue}
const cnt={};
for(const s of SEG){const r=ROADS[s.ri],mix=MIX[r.n];for(const sd of[1,-1]){let t=5+rnd()*4;while(t<s.l-5){const o=KIND[mix[Math.floor(rnd()*mix.length)]](),px=s.a[0]+s.dx*(t+o.w/2),pz=s.a[1]+s.dz*(t+o.w/2),f=frontage(px,pz,s.dx,s.dz,sd,o.fg,o.d),cd=Math.hypot(f.cx,f.cz);
  if(rnd()<clamp(1.45-cd/170,.2,1)&&footOK(f.cx,f.cz,f.rot,o.w/2+.8,o.d/2+.8)){o.road=r.n;o.side=sd;bld(f.cx,f.cz,f.rot,o);cnt[r.n]=(cnt[r.n]||0)+1;t+=o.w+1+rnd()*4}else t+=4}}}
/* home driveway */
{const K=ck(HM.x,HM.z),a=LW(-2.2,.3),b=LW(2.2,.3),c2=LW(2.2,5.2),d2=LW(-2.2,5.2);quadXZ(K.rd,a,b,c2,d2,CPAV,Y0+.04)}
/* ---- street furniture ---- */
var CIV=[];var LVC=[[.28,.4,.28],[.12,.2,.5],[.6,.1,.1],[.75,.68,.5],[.1,.1,.12],[.5,.52,.55]];function civAdd(o){if(o.m===3){const k=(((Math.floor(o.x*3.7)+Math.floor(o.z*5.3)+CIV.length*7)%6)+6)%6;o.vi=k;o.col=LVC[k]}o.far=null;o.inst=null;o.d=1e9;CIV.push(o);return o}
const CST=[{L:3.8,W:1.66,bh:.55,ch:.5,z0:-1.55,z1:.7},{L:4.4,W:1.74,bh:.55,ch:.46,z0:-1.0,z1:.75},{L:4.5,W:1.74,bh:.55,ch:.52,z0:-2.0,z1:.7,rail:1},{L:4.5,W:1.8,van:1,bh:.55,ch:0,z0:-2.2,z1:.85},{L:4.2,W:1.82,bh:.68,ch:.5,z0:-1.7,z1:.75,rail:1,tall:1}];
function carParts(E,si,col){const T=CST[si%5],L=T.L,W=T.W,y0=T.tall?.32:.22,bh=T.bh,yt=y0+bh,dk=[.07,.07,.08],gr=[.2,.2,.23],ch=[.72,.74,.78],gl=[1,1,1];
 E('o',0,y0-.1,0,W-.3,.14,L-.4,dk);
 if(T.van){const rl=L/2+T.z1;E('o',0,y0,(-L/2+T.z1)/2,W,1.45,rl,col);E('o',0,y0,(T.z1+L/2)/2,W,bh,L/2-T.z1,col);E('g',0,y0+.62,T.z1+.01,W-.22,.68,.06,gl);E('g',0,y0+.7,T.z1-.45,W+.02,.5,.5,gl);E('o',0,y0+1.4,-L/2+(rl)/2,W-.1,.08,rl-.1,[.9,.9,.92]);E('o',0,y0+.5,-L/2-.01,.02,.9,.02,dk)}
 else{const cz=(T.z0+T.z1)/2,cl=T.z1-T.z0;E('o',0,y0,0,W,bh,L,col);E('o',0,yt,cz,W-.2,T.ch,cl-.1,col);E('g',0,yt+.04,cz,W-.12,T.ch-.12,cl-.14,gl);E('o',0,yt+.04,cz-.1,W-.1,T.ch-.1,.07,col);E('o',0,yt+T.ch-.02,cz,W-.14,.08,cl,col);
  E('o',0,yt-.01,T.z1+.35,W-.12,.06,.5,col);
  for(const sx of[-1,1]){E('o',sx*(W/2+.005),y0+.05,T.z1-.15,.012,.5,.018,dk);E('o',sx*(W/2+.005),y0+.05,cz-.12,.012,.5,.018,dk);E('o',sx*(W/2+.012),yt-.12,cz+.2,.02,.04,.16,ch);E('o',sx*(W/2+.09),yt+.1,T.z1-.12,.1,.1,.17,col);if(T.rail)E('o',sx*(W/2-.2),yt+T.ch+.05,cz,.05,.05,cl-.25,dk)}}
 E('o',0,y0-.02,L/2,W+.02,.24,.12,gr);E('o',0,y0-.02,-L/2,W+.02,.24,.12,gr);E('o',0,y0+.2,L/2+.01,.52,.15,.05,dk);
 E('o',0,y0+.0,L/2+.075,.46,.11,.03,[.95,.95,.95]);E('o',0,y0+.0,-L/2-.075,.46,.11,.03,[.95,.8,.1]);E('o',.5,.1,-L/2-.12,.08,.08,.2,ch);
 const ty=T.tall?.7:.62;
 for(const sx of[-1,1]){E('l',sx*(W/2-.27),y0+.22,L/2+.02,.36,.15,.06,[1,1,.85]);E('l',sx*(W/2-.24),y0+.3,-L/2-.02,.34,.15,.06,[.92,.08,.08]);E('l',sx*(W/2-.06),y0+.22,L/2+.02,.12,.1,.06,[1,.6,.1]);
  for(const z of[L/2-.85,-L/2+.85]){E('o',sx*(W/2-.04),0,z,.26,ty,ty,[.06,.06,.07]);E('o',sx*(W/2+.1),ty/2-.14,z,.04,.28,.28,ch)}}}
function pcar(x,z,rot,col,si){si=si==null?Math.floor(rnd()*5):si;const K=ck(x,z),c=Math.cos(rot),s=Math.sin(rot),W=(lx,ly,lz)=>[x+lx*c+lz*s,Y0+ly,z-lx*s+lz*c];carParts((k,lx,ly,lz,sx,sy,sz,cc)=>pbox(K[k],...W(lx,ly,lz),sx,sy,sz,cc,rot),si,col);const h=CST[si].L/2-.9;for(const zz of[-h,0,h])COL.push([x+zz*s,z+zz*c,.85])}
{const cols=[[.7,.1,.1],[.1,.2,.5],[.85,.85,.88],[.1,.1,.12],[.3,.5,.3],[.9,.75,.1],[.5,.5,.55]];let n=0;for(let q=0;q<400&&n<30;q++){const s=SEG[Math.floor(rnd()*SEG.length)],t=6+rnd()*(s.l-12),sd=rnd()<.5?1:-1,px=s.a[0]+s.dx*t,pz=s.a[1]+s.dz*t;if(distOther(px,pz,s.ri)<RW+PW+9)continue;const lat=sd*(RW-.75),x=px-s.dz*lat,z=pz+s.dx*lat;if(Math.hypot(x-HM.x,z-HM.z)<14)continue;if(DEPOTS.some(d=>Math.hypot(d.x-x,d.z-z)<9))continue;if(COL.some(c=>Math.hypot(c[0]-x,c[1]-z)<1.8))continue;
 {const mi=(()=>{const r=rnd();return r<.36?0:r<.72?1:r<.86?2:3})(),rot=Math.atan2(s.dx,s.dz)+(sd>0?0:Math.PI),lp=[3.46,3.95,4.4,3.9][mi]/2-.85,cs=Math.sin(rot),cc=Math.cos(rot);civAdd({m:mi,col:cols[Math.floor(rnd()*cols.length)],x,z,rot,parked:1});for(const zz of[-lp,0,lp])COL.push([x+zz*cs,z+zz*cc,.85])}n++}}
{for(const s of SEG){for(let t=14,k=0;t<s.l-6;t+=38,k++){const sd=k%2?1:-1,px=s.a[0]+s.dx*t,pz=s.a[1]+s.dz*t;if(distOther(px,pz,s.ri)<RW+PW+3)continue;const o=RW+.9,x=px-s.dz*sd*o,z=pz+s.dx*sd*o,K=ck(x,z),rt=Math.atan2(s.dx,s.dz),ax=x+s.dz*sd*.45,az=z-s.dx*sd*.45;pbox(K.o,x,Y0,z,.14,5.4,.14,[.25,.27,.3]);pbox(K.o,(x+ax)/2,Y0+5.3,(z+az)/2,.5,.08,.1,[.25,.27,.3],rt);pbox(K.l,ax,Y0+5.2,az,.5,.18,.4,[1,1,1],rt);COL.push([x,z,.22])}}}
// junction name plates
{const seen=[];for(let i=0;i<SEG.length;i++)for(let j=i+1;j<SEG.length;j++){const a=SEG[i],b=SEG[j];if(a.ri===b.ri)continue;const den=a.dx*b.dz-a.dz*b.dx;if(Math.abs(den)<1e-3)continue;const ex=b.a[0]-a.a[0],ez=b.a[1]-a.a[1],t=(ex*b.dz-ez*b.dx)/den,u=(ex*a.dz-ez*a.dx)/den;if(t<-1.5||t>a.l+1.5||u<-1.5||u>b.l+1.5)continue;const X=a.a[0]+a.dx*t,Z=a.a[1]+a.dz*t;if(seen.some(q=>Math.hypot(q[0]-X,q[1]-Z)<6))continue;seen.push([X,Z]);
 const px=X+(a.dx+b.dx)*4.8,pz=Z+(a.dz+b.dz)*4.8,K=ck(px,pz);pbox(K.o,px,Y0,pz,.12,2.8,.12,[.3,.3,.32]);COL.push([px,pz,.2]);const ry=Math.atan2(X-px,Z-pz);
 signPlane(K,ROADS[a.ri].n,'#f4f4ee','#101018',1.5,.34,px,Y0+2.55,pz,ry,256,56);signPlane(K,ROADS[b.ri].n,'#f4f4ee','#101018',1.5,.34,px,Y0+2.12,pz,ry,256,56)}}
// pillar boxes, phone boxes, bus stops, bins, green furniture
function furn(x,z,fn){fn(ck(x,z),x,z)}
for(const[x,z]of[[-30,-4.4],[75,4.4],[-15.6,-80],[-65.8,72],[114.4,-60]])furn(x,z,(K,x,z)=>{pbox(K.o,x,Y0,z,.7,1.3,.7,[.8,.08,.08]);pbox(K.o,x,Y0+1.3,z,.8,.14,.8,[.7,.05,.05]);COL.push([x,z,.5])});
for(const[x,z]of[[-72,-4.4],[-34,4.4],[100,-4.4]])furn(x,z,(K,x,z)=>{pbox(K.o,x,Y0,z,1,2.3,1,[.8,.08,.08]);pbox(K.g,x,Y0+.5,z,1.02,1.5,1.02,[1,1,1]);pbox(K.o,x,Y0+2.3,z,1.1,.14,1.1,[.7,.05,.05]);COL.push([x,z,.65])});
for(const[x,z,sd]of[[-85,4.2,1],[80,-4.2,-1]])furn(x,z,(K,x,z)=>{pbox(K.o,x,Y0,z,.12,2.4,.12,[.25,.27,.3]);pbox(K.o,x+2.2,Y0,z,.12,2.4,.12,[.25,.27,.3]);pbox(K.o,x+1.1,Y0+2.4,z+sd*.2,2.8,.14,1.4,[.3,.32,.4]);pbox(K.g,x+1.1,Y0+.6,z+sd*.6,2.1,1.6,.06,[1,1,1]);pbox(K.o,x+1.1,Y0,z+sd*.5,1.8,.45,.5,[.5,.3,.15]);COL.push([x+1.1,z+sd*.5,1.1])});
for(let q=0;q<14;q++){const s=SEG[Math.floor(rnd()*SEG.length)],t=8+rnd()*(s.l-16),px=s.a[0]+s.dx*t,pz=s.a[1]+s.dz*t,sd=rnd()<.5?1:-1;if(distOther(px,pz,s.ri)<RW+PW+4)continue;const o=RW+1.5,x=px-s.dz*sd*o,z=pz+s.dx*sd*o;if(COL.some(c=>Math.hypot(c[0]-x,c[1]-z)<1.5))continue;furn(x,z,(K,x,z)=>{pbox(K.o,x,Y0,z,.6,.9,.6,rnd()<.5?[.2,.4,.25]:[.3,.3,.33]);COL.push([x,z,.4])})}
furn(GRC[0],GRC[1],(K,x,z)=>{pbox(K.s,x,Y0,z,2.2,.5,2.2,[.7,.7,.66]);pbox(K.s,x,Y0+.5,z,1.4,.5,1.4,[.7,.7,.66]);pbox(K.s,x,Y0+1,z,.6,3,.6,[.72,.72,.68]);pbox(K.s,x,Y0+2.2,z,1.6,.4,.5,[.72,.72,.68]);COL.push([x,z,1.5])});
for(let a=0;a<4;a++){const ang=a*1.5708+1.4,x=GRC[0]+Math.cos(ang)*(GRR-3.5),z=GRC[1]+Math.sin(ang)*(GRR-3.5);furn(x,z,(K,x,z)=>{pbox(K.o,x,Y0+.4,z,1.8,.1,.6,[.45,.3,.15],ang+1.5708);pbox(K.o,x,Y0,z,1.5,.4,.5,[.3,.2,.1],ang+1.5708)})}
/* ---- trees ---- */
function tree(x,z,s,col){const K=ck(x,z),y=Y0-.1;pcyl(K.o,x,y,z,.28*s,2.6*s,5,[.35,.24,.14]);col=col||mix3([.12,.34,.12],[.2,.46,.16],rnd());poct(K.o,x,y+3.4*s,z,2.3*s,2*s,2.3*s,col,.3);poct(K.o,x+.8*s,y+2.7*s,z+.5*s,1.5*s,1.3*s,1.5*s,shd(col,1.1),.3)}
function conifer(x,z,s){const K=ck(x,z),c=mix3([.08,.28,.14],[.12,.36,.18],rnd());pcyl(K.o,x,Y0-.1,z,.25*s,1.8*s,5,[.35,.24,.14]);for(let q=0;q<3;q++)pcone(K.o,x,Y0+(1.2+q*1.4)*s,z,(2.1-q*.55)*s,2.5*s,7,c,rnd()*6)}
/* kart track zone: trees here are still generated (keeps the random world identical) but drawn into a throwaway chunk and given no collider */
var KZN=0;function kartZone(x,z){return(x>-150&&x<-40&&z>-96&&z<-6)||(x>96&&x<232&&z>116&&z<234)} // 2nd rect = the casino grounds (south-east, past the end of Back Lane)
{const ck0=ck,KDUM=new Proxy({},{get:(t,k)=>t[k]||(t[k]=new Builder(3))});ck=function(x,z){return KZN?KDUM:ck0(x,z)}}
function inAnyBld(x,z,m){const me={x,z,rot:0,hw:m,hd:m};for(const p of PLACED)if(Math.hypot(p.x-x,p.z-z)<p.hw+p.hd+m*2&&obbHit(me,p))return true;return false}
for(let a=0;a<7;a++){const ang=a*.9+.3,rr=8+(a%3)*7;tree(GRC[0]+Math.cos(ang)*rr,GRC[1]+Math.sin(ang)*rr,1.15);COL.push([GRC[0]+Math.cos(ang)*rr,GRC[1]+Math.sin(ang)*rr,.7])}
for(let q=0,n=0;q<2500&&n<230;q++){const x=(rnd()-.5)*(SIZE-30),z=(rnd()-.5)*(SIZE-30);if(roadDist(x,z)<RW+PW+2.2||inAnyBld(x,z,3)||Math.hypot(x-GRC[0],z-GRC[1])<GRR+2&&Math.hypot(x-GRC[0],z-GRC[1])>GRR-1)continue;if(Math.hypot(x-GRC[0],z-GRC[1])<GRR-1)continue;if(Math.hypot(x-HM.cx,z-HM.cz)<13)continue;if(Math.hypot(x-GRC[0]-9,z-GRC[1]+6)<6)continue;
 const cd=Math.hypot(x,z),p=clamp(.35+cd/260,.2,1);if(rnd()>p)continue;KZN=kartZone(x,z);if(rnd()<.2)conifer(x,z,1+rnd()*.6);else tree(x,z,.9+rnd()*.7);KZN=0;if(!kartZone(x,z))COL.push([x,z,.6]);n++}
for(let q=0;q<4;q++)for(let u=-HALF+8;u<HALF-6;u+=5+rnd()*2){const e=[[u,-HALF+5+rnd()*3],[u,HALF-5-rnd()*3],[-HALF+5+rnd()*3,u],[HALF-5-rnd()*3,u]][q];if(roadDist(e[0],e[1])<10)continue;if(rnd()<.6)conifer(e[0],e[1],1.2+rnd()*.8);else tree(e[0],e[1],1.2+rnd()*.6)}
/* ---- finalise chunks ---- */
for(const c of CHL){const g=new THREE.Group();c.grp=g;for(const[k,m]of[['o',mObj],['b',mBrick],['s',mStone],['r',mRoof],['g',mGlass],['l',gLit],['rd',mRoad]]){if(c[k].p.length)g.add(c[k].mesh(m));c[k].p=c[k].c=c[k].u=null}for(const e of c.x)g.add(e);scene.add(g)}
function cullChunks(){const R=scene.fog.far+50,R2=R*R,cx=cam.position.x,cz=cam.position.z;for(const c of CHL){const dx=c.cx-cx,dz=c.cz-cz;c.grp.visible=dx*dx+dz*dz<R2}homeG.visible=Math.hypot(HM.x-cx,HM.z-cz)<R+20}
window.VINFO={bld:BLD.length,tg:TG.length,col:COL.length,chunks:CHL.length,cnt};

const mountMat=new THREE.MeshBasicMaterial({visible:false});

/* ---------- sky ---------- */
const skyGeo=new THREE.SphereGeometry(1,20,12),skyMat=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false});
skyGeo.setAttribute('color',new THREE.Float32BufferAttribute(new Float32Array(skyGeo.attributes.position.count*3),3));
const skyG=new THREE.Group();scene.add(skyG);
const sky=new THREE.Mesh(skyGeo,skyMat);sky.scale.setScalar(900);sky.renderOrder=-10;skyG.add(sky);
const sunMat=new THREE.MeshBasicMaterial({color:0xffee99,fog:false,depthWrite:false}),sun=new THREE.Mesh(new THREE.CircleGeometry(1,28),sunMat);skyG.add(sun);
const starGeo=new THREE.BufferGeometry(),sp=[];for(let i=0;i<260;i++){const a=rnd()*6.283,e=Math.asin(.05+rnd()*.95);sp.push(Math.cos(a)*Math.cos(e)*850,Math.sin(e)*850,Math.sin(a)*Math.cos(e)*850)}
starGeo.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({size:2.4,sizeAttenuation:false,color:0xffffff,fog:false,depthWrite:false}));skyG.add(stars);
const cloudB=new Builder();for(let i=0;i<26;i++){const a=rnd()*6.283,r=120+rnd()*700,cx=Math.cos(a)*r,cz=Math.sin(a)*r,cy=140+rnd()*70;for(let q=0,n=3+Math.floor(rnd()*3);q<n;q++){const s=26+rnd()*30;poct(cloudB,cx+(q-n/2)*s*.9,cy+rnd()*6,cz+(rnd()-.5)*20,s,s*.28,s*.6,[1,1,1],.2)}}
const cloudMat=new THREE.MeshBasicMaterial({vertexColors:true,fog:false,side:THREE.DoubleSide}),clouds=cloudB.mesh(cloudMat);scene.add(clouds);

const snowN=700,snowGeo=new THREE.BufferGeometry(),snowArr=new Float32Array(snowN*3);for(let i=0;i<snowN;i++){snowArr[i*3]=(rnd()-.5)*80;snowArr[i*3+1]=rnd()*32;snowArr[i*3+2]=(rnd()-.5)*80}
snowGeo.setAttribute('position',new THREE.BufferAttribute(snowArr,3));const snow=new THREE.Points(snowGeo,new THREE.PointsMaterial({size:3,sizeAttenuation:false,color:0xffffff,fog:false}));snow.frustumCulled=false;snow.visible=false;scene.add(snow);
function updSnow(dt,now){const a=snowArr;for(let i=0;i<snowN;i++){const k=i*3;a[k+1]-=dt*(2.6+(i%5)*.45);a[k]+=Math.sin(now*.0012+i)*dt*.7;a[k+2]+=Math.cos(now*.001+i*1.7)*dt*.5;if(a[k+1]<0){a[k+1]+=32;a[k]=(rnd()-.5)*80;a[k+2]=(rnd()-.5)*80}}snowGeo.attributes.position.needsUpdate=true;snow.position.set(cam.position.x,cam.position.y-14,cam.position.z)}
/* ---------- gems (unused) ---------- */
const GEMS=[];function placeGem(){}

