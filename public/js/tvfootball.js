/* ===== Betting-office TV: broadcast-style football =====
   Replaces bkTvFoot (the old "dots on a flat pitch" view) with a side-on TV camera that pans with the play:
   striped pitch, goals and nets, ad boards, a crowd, 22 players with kits and running animation, a ball with a shadow,
   keeper dives, goal celebrations and a score bug.  Everything is a pure function of (match, time) so the goals still land
   exactly when bkScore() says they do - bets are settled from the same event list. */
(function(){
const L=105,WD=68,GZ0=(WD-7.32)/2,SEG=2.4,PASS=.9,BU=3.0,AD=4.2;
const FORM=[[.03,.5],[.2,.14],[.2,.38],[.2,.62],[.2,.86],[.4,.14],[.4,.38],[.4,.62],[.4,.86],[.62,.36],[.62,.64]];
const ROLE=[0,1,1,1,1,2,2,2,2,3,3],SHIFT=[.04,.34,.5,.6],PZ=[.12,.22,.32,.3],NUMS=[1,2,4,5,3,7,8,6,11,9,10];
const SURN=['BAKER','HUGHES','COOPER','PRICE','TURNER','WARD','MORGAN','FOSTER','BELL','GRAY','PARSONS','DIXON','KEMP','HOLT'];
const SKIN=['#f0c8a0','#e2ac8a','#c68a64','#8a5a3a','#5a3820'],HAIR=['#2a1a10','#4a2a18','#8a6a2a','#c8a050','#161616','#7a3a1a'];
const ADS=[['LUCKY BETS','#d02020','#fff'],['COZY TOWN','#18407a','#ffe040'],["FRANKIE'S",'#f0c020','#222'],['NEON ARCADE','#6a20a8','#ff90f0'],['BULLSEYE','#1a5a2a','#ffe040'],['COZY KARTS','#222','#ffd23a'],['THREADS','#2a8a8a','#fff'],['VILLAGE BREW','#7a4a20','#fff']];
const CROWD=['#c83030','#2850c8','#e8e8e8','#e8c828','#3a3a44','#28a060','#d87820','#9a4ab8','#f0a0a0','#6a8ad8'];
const ss=x=>{x=x<0?0:x>1?1:x;return x*x*(3-2*x)},mx=(a,b,t)=>a+(b-a)*t,cl=(x,a,b)=>x<a?a:x>b?b:x;

/* ---------- match simulation (deterministic from event + time) ---------- */
function prep(ev,C){if(ev._m)return ev._m;const sd=ev.n*13+ev.c*7+5,goals=ev.goals.map(q=>{const h=(k)=>hash2(sd+k,q.m*3+q.t);
  const sx=q.t===0?L-17:17;return{q,gt:q.m/90*C.live,sc:[10,9,8,7][Math.floor(h(61)*4)],sx,sz:34+(h(31)-.5)*10,gx:q.t===0?L:0,gz:34+(h(41)-.5)*5.6,gy:.5+h(51)*1.4,name:SURN[Math.floor(h(71)*SURN.length)]}});
 return ev._m={sd,goals}}
function goalAt(M,t){let r=null;for(const g of M.goals)if(t>=g.gt-BU&&t<=g.gt+AD)r=g;return r}
function tgt(M,s){const p=hash2(M.sd+5,s)<.5?0:1,adv=.3+.5*hash2(M.sd+11,s);return[(p===0?adv:1-adv)*L,6+hash2(M.sd+23,s)*(WD-12)]}
function natFocus(M,t){const s=Math.floor(t/SEG),fr=t/SEG-s,a=tgt(M,s),b=tgt(M,s+1),e=ss(fr*1.5-.5);return[mx(a[0],b[0],e),mx(a[1],b[1],e)]}
function focus(M,t){const n=natFocus(M,t),g=goalAt(M,t);if(!g)return n;
 if(t<g.gt){const u=ss((t-(g.gt-BU))/BU);return[mx(n[0],g.sx,u),mx(n[1],g.sz,u)]}
 const u=ss((t-g.gt-1.8)/2.4);return[mx(g.q.t===0?L-6:6,n[0],u),mx(34,n[1],u)]}
function poss(M,t){const g=goalAt(M,t);if(g&&t<g.gt+1)return g.q.t;return hash2(M.sd+5,Math.floor(t/SEG))<.5?0:1}
function posBase(M,tm,i,t,F){const b=FORM[i],r=ROLE[i];let X=tm===0?b[0]*L:L-b[0]*L,Z=b[1]*WD;
 if(r===0)return[tm===0?2.5:L-2.5,34+(F[1]-34)*.22+Math.sin(t*.8+tm)*.6];
 X+=(F[0]-L/2)*SHIFT[r];Z+=(F[1]-Z)*PZ[r];
 const dx=F[0]-X,dz=F[1]-Z,d=Math.hypot(dx,dz);if(d<15){const k=(1-d/15)*.55;X+=dx*k;Z+=dz*k}
 X+=Math.sin(t*.7+i*2.1+tm*1.3)*1.4;Z+=Math.cos(t*.6+i*1.7+tm*.9)*1.6;
 return[cl(X,1,L-1),cl(Z,2,WD-2)]}
function pos(M,tm,i,t){const F=focus(M,t);let p=posBase(M,tm,i,t,F);const g=goalAt(M,t);if(!g)return p;const q=g.q;
 if(i===0){if(tm===1-q.t){const u=ss((t-(g.gt-1.1))/.9);p=[p[0],mx(p[1],g.gz+(g.gz>34?-1.4:1.4),u*.9)]}return p}
 if(tm===q.t){
  if(i===g.sc){if(t<g.gt){const u=ss((t-(g.gt-2.6))/1.2);p=[mx(p[0],g.sx,u),mx(p[1],g.sz,u)]}
   else{const a=ss((t-g.gt)/2.2),c=[q.t===0?L-2.5:2.5,g.sz>34?64.5:3.5],e=[mx(g.sx,c[0],a),mx(g.sz,c[1],a)],bk=ss((t-g.gt-2.4)/1.8);p=[mx(e[0],p[0],bk),mx(e[1],p[1],bk)]}}
  else if(t>g.gt+.2){const sp=pos(M,tm,g.sc,t),u=.6*ss((t-g.gt-.2)/1.5)*(1-ss((t-g.gt-2.2)/2.2));p=[mx(p[0],sp[0],u),mx(p[1],sp[1],u)]}}
 return p}
function holder(M,k){const t=k*PASS,tm=poss(M,t),F=focus(M,t),l=[];for(let i=1;i<11;i++){const p=pos(M,tm,i,t);l.push([Math.hypot(p[0]-F[0],p[1]-F[1]),i])}l.sort((a,b)=>a[0]-b[0]);return{tm,i:l[Math.floor(hash2(M.sd+77,k)*3)][1]}}
function ballNat(M,t){const k=Math.floor(t/PASS),u=t/PASS-k,h0=holder(M,k),h1=holder(M,k+1),tr=(k+.4)*PASS,R=pos(M,h0.tm,h0.i,tr),Lp=pos(M,h1.tm,h1.i,(k+1)*PASS),dir=Lp[0]>=R[0]?1:-1;
 if(u<.4){const p=pos(M,h0.tm,h0.i,t);return[p[0]+dir*.35,.11+Math.abs(Math.sin(t*9))*.08,p[1]]}
 const e=(u-.4)/.6,d=Math.hypot(Lp[0]-R[0],Lp[1]-R[1]);return[mx(R[0]+dir*.35,Lp[0],e),.11+cl(.4+d*.06,.4,4.5)*4*e*(1-e),mx(R[1],Lp[1],e)]}
function ball(M,t){const g=goalAt(M,t);if(!g)return ballNat(M,t);const q=g.q,face=q.t===0?1:-1;
 const net=()=>{const u=Math.min(1,(t-g.gt)/2.4);return[g.gx+face*(.9+.5*u),Math.max(.11,g.gy*Math.max(0,1-u*2.5)),g.gz+(g.gz>34?.3:-.3)*u]};
 if(t<g.gt-1.1){const sp=pos(M,q.t,g.sc,t),b=[sp[0]+face*.5,.11,sp[1]];if(t<g.gt-BU+1){const n=ballNat(M,t),u=ss(t-(g.gt-BU));return[mx(n[0],b[0],u),mx(n[1],b[1],u),mx(n[2],b[2],u)]}return b}
 if(t<g.gt){const u=(t-(g.gt-1.1))/1.1;return[mx(g.sx+face*.5,g.gx,u),.11+(g.gy-.11)*u*u+Math.sin(Math.PI*u)*.9,mx(g.sz,g.gz,u)]}
 if(t<g.gt+2.4)return net();
 const n=ballNat(M,t),b=net(),u=ss(t-g.gt-2.4);return[mx(b[0],n[0],u),mx(b[1],n[1],u),mx(b[2],n[2],u)]}

/* ---------- camera ---------- */
function mkCam(w,h,camX){const Cy=25,Cz=-48,th=.31,sn=Math.sin(th),cs=Math.cos(th),F=h*3.2,cx=w/2,cy=h*.5;
 return(X,Y,Z)=>{const vy=Y-Cy,vz=Z-Cz,zc=-vy*sn+vz*cs,yc=vy*cs+vz*sn,s=F/zc;return[cx+(X-camX)*s,cy-yc*s,s]}}

/* ---------- drawing ---------- */
function poly(g,pr,pts,close){g.beginPath();pts.forEach((p,i)=>{const q=pr(p[0],0,p[1]);i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1])});if(close)g.closePath()}
function drawStands(g,w,h,pr,camX,at,cheer,k){
 g.fillStyle='#161a24';g.fillRect(0,0,w,h*.5);
 const x0=Math.floor((camX-70)/.9),x1=Math.ceil((camX+70)/.9);
 for(let r=8;r>=0;r--){const Zs=73+r*1.7,Ys=1.5+r*1.3;
  for(let xi=x0;xi<x1;xi++){const X=xi*.9,q=pr(X,Ys,Zs);if(q[0]<-20||q[0]>w+20)continue;
   const hs=hash2(xi,r*19+3),c=hs<.16?'#c83030':hs<.3?'#2850c8':CROWD[Math.floor(hash2(xi*3,r+9)*CROWD.length)];
   const bob=cheer?Math.sin(at*13+xi*1.7)*q[2]*.22:Math.sin(at*2+xi)*q[2]*.04,sz=q[2]*.8;
   g.fillStyle='#232734';g.fillRect(q[0]-sz*.55,q[1]-sz*.15+bob+sz*.7,sz*1.1,sz*.9);
   g.fillStyle=c;g.fillRect(q[0]-sz*.45,q[1]-sz*.15+bob,sz*.9,sz*.75);
   g.fillStyle=SKIN[Math.floor(hash2(xi*7,r+2)*5)];g.fillRect(q[0]-sz*.22,q[1]-sz*.62+bob,sz*.44,sz*.46)}}
 // roof shadow band + floodlight glow
 const gr=g.createLinearGradient(0,0,0,h*.3);gr.addColorStop(0,'rgba(0,0,0,.75)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,w,h*.3)}
function drawBoards(g,w,h,pr,camX,k){
 for(let X=-8,i=0;X<L+10;X+=8,i++){const a=pr(X,0,70.4),b=pr(X+8,1.15,70.4);if(b[0]<-5||a[0]>w+5)continue;const ad=ADS[((i%ADS.length)+ADS.length)%ADS.length];
  g.fillStyle=ad[1];g.fillRect(a[0],b[1],b[0]-a[0]+1,a[1]-b[1]);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(a[0],b[1],b[0]-a[0]+1,(a[1]-b[1])*.12);
  if(b[0]-a[0]>46){g.fillStyle=ad[2];g.font='bold '+Math.max(8,(a[1]-b[1])*.55)+'px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText(ad[0],(a[0]+b[0])/2,(a[1]+b[1])/2+1);g.textBaseline='alphabetic';g.textAlign='left'}}}
function drawPitch(g,w,h,pr,k){
 // runoff + pitch
 const f0=pr(-30,0,WD+1.5),n0=pr(-30,0,-14);g.fillStyle='#2b7330';g.fillRect(0,f0[1],w,h-f0[1]);
 const NS=14;for(let i=0;i<NS;i++){const xa=i*L/NS,xb=(i+1)*L/NS,A=pr(xa,0,0),B=pr(xb,0,0),Cc=pr(xb,0,WD),D=pr(xa,0,WD);
  g.fillStyle=i%2?'#37913c':'#3f9d43';g.beginPath();g.moveTo(A[0],A[1]);g.lineTo(B[0],B[1]);g.lineTo(Cc[0],Cc[1]);g.lineTo(D[0],D[1]);g.closePath();g.fill()}
 // light haze toward far side
 const fl=pr(52,0,WD),nl=pr(52,0,0),gr=g.createLinearGradient(0,fl[1],0,nl[1]);gr.addColorStop(0,'rgba(255,255,255,.10)');gr.addColorStop(.5,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.14)');g.fillStyle=gr;g.fillRect(0,fl[1],w,nl[1]-fl[1]);
 g.strokeStyle='rgba(245,250,245,.92)';g.lineWidth=Math.max(1,1.25*k);g.lineJoin='round';
 poly(g,pr,[[0,0],[L,0],[L,WD],[0,WD]],1);g.stroke();poly(g,pr,[[L/2,0],[L/2,WD]]);g.stroke();
 const circ=[];for(let a=0;a<=36;a++)circ.push([L/2+9.15*Math.cos(a/36*6.2832),34+9.15*Math.sin(a/36*6.2832)]);poly(g,pr,circ);g.stroke();
 for(const s of[0,1]){const dx=s?-1:1,x0=s?L:0;
  poly(g,pr,[[x0,13.84],[x0+dx*16.5,13.84],[x0+dx*16.5,54.16],[x0,54.16]]);g.stroke();
  poly(g,pr,[[x0,24.84],[x0+dx*5.5,24.84],[x0+dx*5.5,43.16],[x0,43.16]]);g.stroke();
  const arc=[];for(let a=-53;a<=53;a+=8){const r=a*Math.PI/180;arc.push([x0+dx*(11+9.15*Math.cos(r)),34+9.15*Math.sin(r)])}poly(g,pr,arc);g.stroke();
  const sp=pr(x0+dx*11,0,34);g.fillStyle='#f4f8f4';g.beginPath();g.arc(sp[0],sp[1],Math.max(1,.25*sp[2]),0,7);g.fill()}
 const cs=pr(L/2,0,34);g.fillStyle='#f4f8f4';g.beginPath();g.arc(cs[0],cs[1],Math.max(1,.25*cs[2]),0,7);g.fill()}
function drawGoal(g,pr,side,k){const X=side?L:0,d=side?1:-1,bx=X+d*2.1,z0=GZ0,z1=GZ0+7.32,H=2.44;
 const a=pr(X,0,z0),b=pr(X,H,z0),c=pr(X,0,z1),e=pr(X,H,z1),ba=pr(bx,0,z0),bb=pr(bx,H,z0),bc=pr(bx,0,z1),be=pr(bx,H,z1);
 g.fillStyle='rgba(255,255,255,.10)';g.beginPath();g.moveTo(b[0],b[1]);g.lineTo(e[0],e[1]);g.lineTo(be[0],be[1]);g.lineTo(bb[0],bb[1]);g.closePath();g.fill();
 g.beginPath();g.moveTo(bb[0],bb[1]);g.lineTo(ba[0],ba[1]);g.lineTo(a[0],a[1]);g.moveTo(be[0],be[1]);g.lineTo(bc[0],bc[1]);g.lineTo(c[0],c[1]);g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=Math.max(1,k*.7);g.stroke();
 for(let i=1;i<8;i++){const u=i/8,p=pr(X+d*2.1*u,H,z0),q=pr(X+d*2.1*u,H,z1);g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke()}
 g.strokeStyle='#f6f6f6';g.lineWidth=Math.max(1.5,.14*a[2]);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(e[0],e[1]);g.lineTo(c[0],c[1]);g.stroke()}
function drawPlayer(g,sx,sy,s,o){
 const H=1.78*s,face=o.face,tm=o.tm,gk=o.gk;
 const shirt=gk?'#e8d020':tm===0?'#d83030':'#2a58d8',shorts=gk?'#1a1a1e':tm===0?'#f2f2f2':'#18246a',sock=gk?'#1a1a1e':tm===0?'#d83030':'#2a58d8',skin=SKIN[o.sk],hair=HAIR[o.hr];
 g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(sx,sy,.42*s,.13*s,0,0,7);g.fill();
 g.save();
 if(o.dive){g.translate(sx,sy-.45*H);g.rotate(o.dive*1.3);g.translate(-sx,-(sy-.45*H))}
 g.translate(sx,0);g.scale(face,1);g.translate(-sx,0);
 const ph=o.ph,amp=o.amp,lean=.07*H*amp,hipY=sy-.5*H,shY=sy-.82*H;
 const leg=(a,front)=>{const kx=sx+Math.sin(a)*.26*H,ky=hipY+.26*H,fx=sx+Math.sin(a*1.25)*.34*H+(a>0?.04*H:0)-(a<0?.02*H:0),fy=sy-(a>0?Math.max(0,Math.sin(a)*.12*H):0);
  g.lineCap='round';g.lineWidth=.12*H;g.strokeStyle=skin;g.beginPath();g.moveTo(sx,hipY);g.lineTo(kx,ky);g.stroke();
  g.strokeStyle=sock;g.beginPath();g.moveTo(kx,ky);g.lineTo(fx,fy-.03*H);g.stroke();
  g.fillStyle='#101010';g.fillRect(fx-.02*H,fy-.05*H,.15*H,.06*H)};
 const sw=Math.sin(ph)*amp*.75;
 leg(-sw,0);
 // torso
 g.fillStyle=shirt;g.fillRect(sx-.15*H+lean,shY,.3*H,.34*H);g.fillStyle='rgba(255,255,255,.18)';g.fillRect(sx-.15*H+lean,shY,.3*H,.05*H);
 g.fillStyle=shorts;g.fillRect(sx-.16*H+lean*.5,hipY-.04*H,.32*H,.17*H);
 leg(sw,1);
 // arms
 const arm=(a,cheer)=>{const ax=sx+lean,ay=shY+.04*H;let ex,ey;if(cheer){ex=ax+Math.sin(a*.3)*.05*H+.08*H;ey=ay-.34*H}else{ex=ax+Math.sin(a)*.3*H;ey=ay+.28*H}
  g.lineWidth=.09*H;g.strokeStyle=shirt;g.beginPath();g.moveTo(ax,ay);g.lineTo(ax+(ex-ax)*.55,ay+(ey-ay)*.55);g.stroke();g.strokeStyle=gk?'#f4f4f4':skin;g.beginPath();g.moveTo(ax+(ex-ax)*.55,ay+(ey-ay)*.55);g.lineTo(ex,ey);g.stroke()};
 arm(-sw*1.1,o.cheer);if(o.cheer)arm(sw,1);
 // head
 g.fillStyle=skin;g.beginPath();g.arc(sx+lean*1.3,sy-.92*H,.085*H,0,7);g.fill();
 g.fillStyle=hair;g.beginPath();g.arc(sx+lean*1.3-.01*H,sy-.94*H,.088*H,3.3,6.1);g.fill();
 g.restore()}
function drawBall(g,pr,b,k){const gp=pr(b[0],0,b[2]),bp=pr(b[0],b[1],b[2]),r=Math.max(2*k*.7,.2*gp[2]);
 g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(gp[0],gp[1],r*1.1,r*.4,0,0,7);g.fill();
 g.fillStyle='#fafafa';g.strokeStyle='#222';g.lineWidth=Math.max(1,r*.18);g.beginPath();g.arc(bp[0],bp[1],r,0,7);g.fill();g.stroke();
 g.fillStyle='#222';const a0=b[0]*1.3;for(let i=0;i<3;i++){const a=a0+i*2.1;g.beginPath();g.arc(bp[0]+Math.cos(a)*r*.5,bp[1]+Math.sin(a)*r*.5,r*.22,0,7);g.fill()}}

const abbr=n=>n.replace(/[^A-Z ]/g,'').split(' ')[0].slice(0,3);
function overlay(g,w,h,k,st,ev,C,sc,t,M,at){
 const gl=goalAt(M,t),goalOn=gl&&t>=gl.gt&&t<gl.gt+3.6;
 // vignette + scanlines
 const vg=g.createRadialGradient(w/2,h*.52,h*.35,w/2,h*.52,h*.95);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.42)');g.fillStyle=vg;g.fillRect(0,0,w,h);
 g.fillStyle='rgba(0,0,0,.06)';for(let y=0;y<h;y+=3)g.fillRect(0,y,w,1);
 // score bug
 const bx=10*k,by=8*k,bh=17*k;g.fillStyle='rgba(8,14,28,.93)';g.fillRect(bx,by,150*k,bh);
 g.fillStyle='#d83030';g.fillRect(bx,by,4*k,bh);g.fillStyle='#2a58d8';g.fillRect(bx+146*k,by,4*k,bh);
 g.font='bold '+10*k+'px monospace';g.textBaseline='middle';g.textAlign='left';g.fillStyle='#fff';g.fillText(abbr(ev.h),bx+8*k,by+bh/2+1);g.textAlign='right';g.fillText(abbr(ev.a),bx+142*k,by+bh/2+1);
 g.fillStyle='#ffd840';g.fillRect(bx+46*k,by+2*k,58*k,bh-4*k);g.fillStyle='#10203a';g.font='bold '+12*k+'px monospace';g.textAlign='center';g.fillText(sc.h+' - '+sc.a,bx+75*k,by+bh/2+1);
 // clock
 const mm=Math.floor(sc.m),ssx=Math.floor((sc.m-mm)*60),clock=st.ph===0?'KICK-OFF '+bkClock(st.rem):st.ph===1?(mm<10?'0':'')+mm+':'+(ssx<10?'0':'')+ssx:'FULL TIME';
 g.fillStyle='rgba(8,14,28,.93)';g.fillRect(bx,by+bh+2*k,st.ph===0?92*k:58*k,12*k);g.fillStyle='#9fe';g.font='bold '+9*k+'px monospace';g.textAlign='left';g.fillText(clock,bx+5*k,by+bh+8.5*k);
 if(st.ph===1){g.fillStyle='#e02020';g.beginPath();g.arc(bx+68*k,by+bh+8*k,3*k,0,7);g.fill();g.fillStyle='#fff';g.font='bold '+8*k+'px monospace';g.fillText('LIVE',bx+73*k,by+bh+8.5*k)}
 // channel logo
 g.textAlign='right';g.fillStyle='rgba(255,255,255,.75)';g.font='bold '+9*k+'px monospace';g.fillText('LUCKY BETS TV',w-10*k,by+6*k);
 // lower third
 g.fillStyle='rgba(8,14,28,.9)';g.fillRect(0,h-16*k,w,16*k);g.fillStyle='#ffd840';g.fillRect(0,h-16*k,w,1.5*k);
 g.textAlign='left';g.font='bold '+9*k+'px monospace';g.fillStyle='#fff';g.fillText(ev.h+'  v  '+ev.a,8*k,h-7.5*k);
 const tips=['LIVE FROM THE VILLAGE GROUND','PLACE YOUR BET AT THE COUNTER','BET RESPONSIBLY · 18+','FOOTBALL LIVE ON LUCKY BETS TV'];g.textAlign='right';g.fillStyle='#9fe';g.fillText(tips[Math.floor(at/5)%tips.length],w-8*k,h-7.5*k);
 // goal banner
 if(goalOn){const u=ss((t-gl.gt)/.35),yy=h*.16;g.fillStyle='rgba(120,10,16,.92)';g.fillRect(w*.5-(w*.34)*u,yy,w*.68*u,34*k);g.fillStyle='#ffd840';g.textAlign='center';g.font='bold '+22*k+'px monospace';if(u>.8){g.fillText('GOAL!',w/2,yy+13*k);g.fillStyle='#fff';g.font='bold '+9*k+'px monospace';g.fillText('#'+NUMS[gl.sc]+' '+gl.name+'  '+Math.round(gl.q.m)+"'  ·  "+(gl.q.t===0?ev.h:ev.a),w/2,yy+27*k)}}
 if(st.ph===0){g.fillStyle='rgba(0,0,0,.55)';g.fillRect(w*.12,h*.36,w*.76,h*.34);g.fillStyle='#ffd840';g.textAlign='center';g.font='bold '+13*k+'px monospace';g.fillText('KICK-OFF IN '+bkClock(st.rem),w/2,h*.43);
  g.fillStyle='#fff';g.font='bold '+10*k+'px monospace';g.fillText('HOME '+bkFrS(ev.sels[0].fr)+'   DRAW '+bkFrS(ev.sels[1].fr)+'   AWAY '+bkFrS(ev.sels[2].fr),w/2,h*.53);g.fillText('OVER 2.5  '+bkFrS(ev.sels[3].fr)+'   UNDER  '+bkFrS(ev.sels[4].fr),w/2,h*.62)}
 if(st.ph===2){g.fillStyle='rgba(0,0,0,.55)';g.fillRect(w*.2,h*.38,w*.6,h*.26);g.fillStyle='#ffd840';g.textAlign='center';g.font='bold '+16*k+'px monospace';g.fillText('FULL TIME',w/2,h*.46);g.fillStyle='#fff';g.font='bold '+13*k+'px monospace';g.fillText(ev.h+'  '+ev.hg+' - '+ev.ag+'  '+ev.a,w/2,h*.57)}
 g.textBaseline='alphabetic';g.textAlign='left'}

function drawFoot(g,w,h,st,k){
 const ev=st.ev,C=st.C,M=prep(ev,C),at=Date.now()/1000;
 const t=st.ph===1?st.tl:st.ph===0?-6:C.live+6;
 let cxs=0;for(let i=0;i<5;i++)cxs+=focus(M,t-.9+i*.25)[0];const camX=st.ph===1?cl(cxs/5,23,83):L/2;
 const pr=mkCam(w,h,camX),gl=goalAt(M,t),cheer=!!(gl&&t>=gl.gt&&t<gl.gt+4);
 const sc=st.ph===0?{m:0,h:0,a:0}:st.ph===1?bkScore(ev,st.tl,C.live):{m:90,h:ev.hg,a:ev.ag};
 drawStands(g,w,h,pr,camX,at,cheer,k);drawBoards(g,w,h,pr,camX,k);drawPitch(g,w,h,pr,k);
 drawGoal(g,pr,0,k);drawGoal(g,pr,1,k);
 // players, far to near, with the ball sorted in
 const list=[];
 for(let tm=0;tm<2;tm++)for(let i=0;i<11;i++){
  let p,p0;if(st.ph===1){p=pos(M,tm,i,t);p0=pos(M,tm,i,t-.14)}else{const F=[L/2,34],b=posBase(M,tm,i,t,F);p=b;p0=b}
  const vx=(p[0]-p0[0])/.14,vz=(p[1]-p0[1])/.14,sp=Math.hypot(vx,vz),F=focus(M,t);
  let dive=0,cheerP=false;
  if(gl&&i===0&&tm===1-gl.q.t&&t>=gl.gt-.4&&t<=gl.gt+1.2)dive=gl.gz>p[1]?1:-1;
  if(gl&&tm===gl.q.t&&i!==0&&t>=gl.gt+.15&&t<=gl.gt+3.0)cheerP=true;
  const face=sp>1.2?(vx>=0?1:-1):((F[0]>=p[0])?1:-1),id=tm*11+i;
  list.push({z:p[1],x:p[0],o:{tm,gk:i===0,face:tm===1&&sp<=1.2&&!cheerP?face:face,ph:t*10+i*1.3+tm*2,amp:cl(sp/4,.05,1),dive,cheer:cheerP,sk:Math.floor(hash2(id,5)*5),hr:Math.floor(hash2(id,9)*6)}})}
 const bl=st.ph===1?ball(M,t):[L/2,.11,34];list.push({z:bl[2]+.01,ball:bl});
 list.sort((a,b)=>b.z-a.z);
 for(const it of list){if(it.ball){drawBall(g,pr,it.ball,k);continue}const q=pr(it.x,0,it.z);if(q[0]<-30||q[0]>w+30)continue;drawPlayer(g,q[0],q[1],q[2],it.o)}
 overlay(g,w,h,k,st,ev,C,sc,t,M,at)}

const orig=bkTvFoot;
bkTvFoot=function(g,w,h,st,k){try{drawFoot(g,w,h,st,k)}catch(e){if(!bkTvFoot._e){bkTvFoot._e=1;console.error('tv football',e)}orig(g,w,h,st,k)}};
})();
