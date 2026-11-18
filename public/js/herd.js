/* ===== Sheep-herding mini-game polish =====
   Replaces herdDraw (flat circles) with a proper top-down farm scene: striped meadow with tufts and flowers, a dirt track to
   the gate, a pond with reeds / lily pads / ripples, a fenced straw pen with trough and swung-open gate, hedge border.
   Sheep are fluffy with heads, ears, trotting hooves and "BAA!" bubbles when scared; the collie has a white chest and blaze,
   running legs, wagging tail, tongue, dust and a bark shockwave with cooldown ring.  Floating "IN!" pops, a sheep counter,
   a time bar and a star-rated results panel.  Movement physics / scoring in app.js are untouched: the wrappers only read state. */
(function(){
const sm=(a,b,t)=>a+(b-a)*t,cl=(x,a,b)=>x<a?a:x>b?b:x;
const rnd=n=>{n=Math.imul(n^n>>>15,2246822519);n=Math.imul(n^n>>>13,3266489917);return((n^n>>>16)>>>0)/4294967296};
const ang=(a,b)=>{let d=b-a;while(d>Math.PI)d-=6.2832;while(d<-Math.PI)d+=6.2832;return d};
function X(){const h=HG;if(!h._x)h._x={t:0,lt:performance.now(),pts:[],pops:[],bg:null,bark:0,dp:0,tail:0,baa:0,res:null,dx:h.dog.x,dy:h.dog.y,ds:0};return h._x}

const bark0=herdBark;
herdBark=function(){const h=HG,was=h&&h.barkC;bark0();if(!h)return;if(h.barkT>.4&&!(was>0)){const q=X();q.bark=.6;q.pops.push({x:h.dog.x,y:h.dog.y-h.W*.06,t:.8,m:.8,s:'WOOF!',c:'#fff'})}};
const end0=herdEnd;
herdEnd=function(win){const h=HG,c0=cash;end0(win);if(!HG)return;const q=X();q.res={win:!!win,n:h.sh.filter(s=>s.in).length,pay:Math.round(cash-c0),left:Math.max(0,Math.ceil(h.t)),best:HERD.best};
 if(win)[660,880,1180].forEach((f,i)=>setTimeout(()=>beep(f,.12,'square',.05),i*110))};

/* ---------- static background ---------- */
function ell(g,x,y,rx,ry,c,rot){g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,rot||0,0,6.2832);g.fill()}
function buildBg(h){const{W,H,pen,pond}=h,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 let gr=g.createLinearGradient(0,0,W,H);gr.addColorStop(0,'#6cac44');gr.addColorStop(1,'#5a9a3a');g.fillStyle=gr;g.fillRect(0,0,W,H);
 for(let i=0;i<12;i++){g.fillStyle=i%2?'rgba(0,0,0,.045)':'rgba(255,255,255,.04)';g.fillRect(i*W/12,0,W/12,H)}
 /* dirt track to the gate */
 const P=[[0,.68],[.18,.74],[.38,.8],[.56,.7],[.7,.56],[pen[0]/W-.005,.5]];
 const trace=()=>{g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0]*W,p[1]*H):g.moveTo(p[0]*W,p[1]*H))};
 g.lineCap='round';g.lineJoin='round';g.strokeStyle='#8f7640';g.lineWidth=W*.062;trace();g.stroke();g.strokeStyle='#bd9d62';g.lineWidth=W*.05;trace();g.stroke();g.strokeStyle='#cdb074';g.lineWidth=W*.03;trace();g.stroke();
 for(let i=0;i<60;i++){const u=rnd(i+5)*(P.length-1),k=Math.floor(u),f=u-k,a=P[k],b=P[Math.min(P.length-1,k+1)];ell(g,sm(a[0],b[0],f)*W+(rnd(i+80)-.5)*W*.04,sm(a[1],b[1],f)*H+(rnd(i+160)-.5)*W*.04,W*.003,W*.002,i%2?'#8a7040':'#e0c88c')}
 /* grass tufts + flowers */
 for(let i=0;i<300;i++){const x=rnd(i)*W,y=rnd(i+999)*H,l=W*.008;g.strokeStyle=i%3?'#4a8a30':'#82bf58';g.lineWidth=1.3;g.beginPath();g.moveTo(x-l*.5,y);g.lineTo(x-l*.7,y-l);g.moveTo(x,y);g.lineTo(x,y-l*1.3);g.moveTo(x+l*.5,y);g.lineTo(x+l*.8,y-l);g.stroke()}
 const FC=['#fff','#ffe14a','#ff9ab8','#b08aff'];for(let k=0;k<14;k++){const cx=rnd(k+400)*W*.75+W*.03,cy=rnd(k+500)*H*.85+H*.06,col=FC[k%4];for(let j=0;j<6;j++){const fx=cx+(rnd(k*9+j)-.5)*W*.05,fy=cy+(rnd(k*9+j+50)-.5)*W*.04;ell(g,fx,fy,W*.004,W*.004,col);ell(g,fx,fy,W*.0016,W*.0016,'#e8a020')}}
 /* pond bank, rocks, reeds */
 ell(g,pond[0],pond[1],pond[2]+W*.016,(pond[2]+W*.016)*.92,'#6a5a34');ell(g,pond[0],pond[1],pond[2]+W*.008,(pond[2]+W*.008)*.92,'#8a7444');
 for(let i=0;i<9;i++){const a=i*.7+.3,rr=pond[2]+W*.02,x=pond[0]+Math.cos(a)*rr,y=pond[1]+Math.sin(a)*rr*.95;ell(g,x,y,W*(.008+rnd(i)*.006),W*(.006+rnd(i+9)*.004),i%2?'#8a8c92':'#a4a6ac');ell(g,x-1,y-1.5,W*.004,W*.0025,'rgba(255,255,255,.35)')}
 for(let i=0;i<11;i++){const a=2.2+i*.34,rr=pond[2]+W*.012,x=pond[0]+Math.cos(a)*rr,y=pond[1]+Math.sin(a)*rr*.95;for(let j=0;j<3;j++){g.strokeStyle='#3a6a28';g.lineWidth=2;g.beginPath();g.moveTo(x+j*3,y);g.lineTo(x+j*3+(j-1)*3,y-W*.026-j*2);g.stroke()}ell(g,x+3,y-W*.03,2.2,5,'#6a4a22')}
 /* pen: straw floor, trough */
 const pw=pen[2]-pen[0],ph=pen[3]-pen[1];g.fillStyle='#c8a868';g.fillRect(pen[0],pen[1],pw,ph);
 for(let i=0;i<110;i++){const x=pen[0]+rnd(i+700)*pw,y=pen[1]+rnd(i+800)*ph,a=rnd(i+900)*3;g.strokeStyle=i%3?'#e0c880':'#9a7a40';g.lineWidth=1.3;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*W*.014,y+Math.sin(a)*W*.006);g.stroke()}
 g.fillStyle='#6a4220';g.fillRect(pen[2]-W*.075,pen[1]+ph*.08,W*.06,ph*.16);g.fillStyle='#3a8aa8';g.fillRect(pen[2]-W*.07,pen[1]+ph*.1,W*.05,ph*.12);g.fillStyle='rgba(255,255,255,.3)';g.fillRect(pen[2]-W*.07,pen[1]+ph*.1,W*.05,2);
 ell(g,pen[2]-W*.06,pen[3]-ph*.14,W*.028,ph*.07,'#d8b84a');for(let i=0;i<12;i++){g.strokeStyle='#a88a34';g.lineWidth=1;g.beginPath();g.moveTo(pen[2]-W*.085+rnd(i)*W*.05,pen[3]-ph*.18+rnd(i+3)*ph*.08);g.lineTo(pen[2]-W*.08+rnd(i+6)*W*.05,pen[3]-ph*.2+rnd(i+9)*ph*.08);g.stroke()}
 g.fillStyle='rgba(255,255,255,.55)';g.font='bold '+Math.round(W*.02)+'px monospace';g.textAlign='center';g.fillText('PEN',(pen[0]+pen[2])/2-W*.01,(pen[1]+pen[3])/2+W*.007);
 /* fence */
 const rail=(x0,y0,x1,y1)=>{g.lineCap='butt';g.strokeStyle='#6a4220';g.lineWidth=W*.0075;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();g.strokeStyle='#9a6a38';g.lineWidth=W*.0045;g.beginPath();g.moveTo(x0,y0-1);g.lineTo(x1,y1-1);g.stroke()};
 const post=(x,y,s)=>{g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x-s/2+2,y-s/2+3,s,s);g.fillStyle='#5a3a1a';g.fillRect(x-s/2,y-s/2,s,s);g.fillStyle='#a8784a';g.fillRect(x-s/2+1,y-s/2+1,s-3,s-3)};
 rail(pen[0],pen[1],pen[2],pen[1]);rail(pen[2],pen[1],pen[2],pen[3]);rail(pen[0],pen[3],pen[2],pen[3]);
 const ps=W*.036;for(let x=pen[0];x<=pen[2]+1;x+=ps){post(x,pen[1],W*.011);post(x,pen[3],W*.011)}for(let y=pen[1];y<=pen[3]+1;y+=ps*.9)post(pen[2],y,W*.011);
 post(pen[0],pen[1],W*.018);post(pen[0],pen[3],W*.018);
 for(const sd of[-1,1]){const y0=sd<0?pen[1]:pen[3],x1=pen[0]-W*.045,y1=y0+sd*H*.075;rail(pen[0],y0,x1,y1);g.strokeStyle='#6a4220';g.lineWidth=W*.004;g.beginPath();g.moveTo(pen[0]-W*.012,y0+sd*H*.016);g.lineTo(x1+W*.006,y1-sd*H*.005);g.stroke()}
 /* hedge border */
 const m=W*.03;for(let i=0;i<Math.ceil(W/(m*.9));i++){for(const y of[m*.3,H-m*.3]){const x=i*m*.9;ell(g,x,y,m*.7,m*.65,i%2?'#2f6a2a':'#3a7a32');ell(g,x-m*.15,y-m*.18,m*.4,m*.3,'#4a8a3a')}}
 for(let i=0;i<Math.ceil(H/(m*.9));i++){for(const x of[m*.3,W-m*.3]){const y=i*m*.9;ell(g,x,y,m*.65,m*.7,i%2?'#2f6a2a':'#3a7a32');ell(g,x-m*.15,y-m*.18,m*.3,m*.4,'#4a8a3a')}}
 for(let i=0;i<22;i++){const e=i%4,x=e<2?rnd(i+30)*W:(e===2?m*.3:W-m*.3),y=e<2?(e?H-m*.3:m*.3):rnd(i+60)*H;ell(g,x,y,2.2,2.2,i%2?'#d83a3a':'#f0f0f0')}
 g.strokeStyle='#244a18';g.lineWidth=4;g.strokeRect(0,0,W,H);
 return c}

/* ---------- sprites ---------- */
function sheep(g,s,r,t,scared){const a=s._a||0,wob=Math.sin(s._w*2)*r*.05,blk=s.blk;
 const wool=blk?'#2a2a2e':'#f3f0e6',shade=blk?'#17171b':'#cfcabb',hi=blk?'#4a4a54':'#ffffff',face=blk?'#1a1a1e':'#5a4a44',mz=blk?'#4a3e3a':'#7a6a62';
 g.save();g.translate(s.x,s.y+wob);g.rotate(a);
 g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(2,r*.55,r*1.15,r*.7,0,0,6.3);g.fill();
 /* hooves */
 const st=Math.sin(s._w*2);g.fillStyle='#1a1414';for(const[ox,oy,ph]of[[.55,-.62,0],[.55,.62,Math.PI],[-.55,-.62,Math.PI],[-.55,.62,0]])g.fillRect(r*(ox+Math.sin(s._w*2+ph)*.22)-r*.1,r*oy-r*.12,r*.22,r*.24);
 /* wool body */
 g.fillStyle=shade;g.beginPath();g.ellipse(0,r*.08,r*1.15,r*.92,0,0,6.3);g.fill();
 const lumps=[[0,0],[.6,-.4],[.6,.4],[-.6,-.4],[-.6,.4],[0,-.62],[0,.62],[.2,.2],[-.3,-.1],[-.9,0]];
 for(const[lx,ly]of lumps){g.fillStyle=wool;g.beginPath();g.arc(r*lx*.82,r*ly*.82,r*.52,0,6.3);g.fill()}
 for(const[lx,ly]of lumps.slice(0,6)){g.fillStyle=hi;g.beginPath();g.arc(r*lx*.8-r*.1,r*ly*.8-r*.12,r*.22,0,6.3);g.fill()}
 /* head */
 const hx=r*1.12;g.fillStyle=face;g.beginPath();g.ellipse(hx,0,r*.46,r*.36,0,0,6.3);g.fill();g.fillStyle=mz;g.beginPath();g.ellipse(hx+r*.22,0,r*.2,r*.2,0,0,6.3);g.fill();
 g.fillStyle=face;for(const sd of[-1,1]){g.save();g.translate(hx-r*.12,sd*r*.38);g.rotate(sd*.7);g.beginPath();g.ellipse(0,0,r*.3,r*.13,0,0,6.3);g.fill();g.restore()}
 g.fillStyle=wool;g.beginPath();g.arc(hx-r*.2,0,r*.26,0,6.3);g.fill();
 if(scared){for(const sd of[-1,1]){g.fillStyle='#fff';g.beginPath();g.arc(hx+r*.1,sd*r*.17,r*.12,0,6.3);g.fill();g.fillStyle='#111';g.beginPath();g.arc(hx+r*.13,sd*r*.17,r*.06,0,6.3);g.fill()}}
 else{g.fillStyle='#111';for(const sd of[-1,1]){g.beginPath();g.arc(hx+r*.12,sd*r*.17,r*.06,0,6.3);g.fill()}}
 g.restore()}

function dogSpr(g,W,d,q,dt,moving,fast){const u=W*.01,a=d.a,ph=q.dp,wag=Math.sin(q.tail)*(moving?.4:.9);
 g.save();g.translate(d.x,d.y);g.rotate(a);
 g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(2,5,u*4.3,u*2.4,0,0,6.3);g.fill();
 /* legs */
 for(const[ox,oy,p]of[[2.2,-1.6,0],[2.2,1.6,Math.PI],[-2.2,-1.6,Math.PI],[-2.2,1.6,0]]){const sw=moving?Math.sin(ph+p)*u*1.3:0;g.fillStyle='#1c1c20';g.fillRect(u*(ox)+sw-u*.8,u*oy-u*.5,u*1.6,u);g.fillStyle='#f4f4f4';g.fillRect(u*ox+sw+u*.2,u*oy-u*.5,u*.8,u)}
 /* tail */
 g.strokeStyle='#1c1c20';g.lineWidth=u*1.2;g.lineCap='round';g.beginPath();g.moveTo(-u*3.6,0);g.quadraticCurveTo(-u*5,wag*u*2,-u*6.6,wag*u*3.2);g.stroke();ell(g,-u*6.6,wag*u*3.2,u*1.1,u*.9,'#f4f4f4');
 /* body */
 ell(g,0,0,u*4,u*2.3,'#1c1c20');ell(g,-u*.4,-u*.5,u*2.6,u*1.1,'#2c2c34');ell(g,u*2.1,0,u*1.5,u*1.7,'#f4f4f4');g.fillStyle='#c83a3a';g.beginPath();g.ellipse(u*3,0,u*.45,u*1.9,0,0,6.3);g.fill();
 /* head */
 ell(g,u*4.7,0,u*1.9,u*1.7,'#1c1c20');ell(g,u*6.2,0,u*1.2,u*.85,'#1c1c20');ell(g,u*5.6,0,u*1.4,u*.45,'#f4f4f4');ell(g,u*7.2,0,u*.45,u*.4,'#0a0a0a');
 g.fillStyle='#1c1c20';for(const sd of[-1,1]){g.beginPath();g.moveTo(u*3.6,sd*u*1.3);g.lineTo(u*2.6,sd*u*2.6);g.lineTo(u*4.7,sd*u*1.9);g.closePath();g.fill()}
 g.fillStyle='#fff';for(const sd of[-1,1]){g.beginPath();g.arc(u*5.4,sd*u*.9,u*.38,0,6.3);g.fill()}g.fillStyle='#111';for(const sd of[-1,1]){g.beginPath();g.arc(u*5.5,sd*u*.9,u*.2,0,6.3);g.fill()}
 if(fast){g.fillStyle='#ff8a9a';g.beginPath();g.ellipse(u*6.9,u*.1+Math.sin(q.t*20)*.3*u,u*.9,u*.45,0,0,6.3);g.fill()}
 g.restore()}


herdDraw=function(){const h=HG;if(!h)return;const q=X(),{g,W,H,sh,dog,pen,pond}=h,now=performance.now(),dt=Math.min(.05,(now-q.lt)/1000);q.lt=now;q.t+=dt;
 if(!q.bg||q.bg.width!==W)q.bg=buildBg(h);
 g.drawImage(q.bg,0,0);
 /* pond water */
 const px=pond[0],py=pond[1],pr=pond[2],py2=pr*.92;let gr=g.createRadialGradient(px-pr*.3,py-pr*.3,pr*.1,px,py,pr);gr.addColorStop(0,'#58b0c8');gr.addColorStop(1,'#2e7088');g.fillStyle=gr;g.beginPath();g.ellipse(px,py,pr,py2,0,0,6.3);g.fill();
 g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=1.5;for(let i=0;i<3;i++){const u=(q.t*.35+i/3)%1;g.globalAlpha=1-u;g.beginPath();g.ellipse(px+Math.sin(i*2)*pr*.2,py+Math.cos(i*3)*pr*.15,pr*.15+u*pr*.6,(pr*.15+u*pr*.6)*.92,0,0,6.3);g.stroke()}g.globalAlpha=1;
 g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=2;g.beginPath();g.arc(px,py,pr*.82,3.5+Math.sin(q.t)*.1,4.3);g.stroke();
 for(const[lx,ly,lr]of[[-.35,.25,.14],[.3,-.3,.11],[.1,.45,.1]]){const x=px+lx*pr,y=py+ly*pr+Math.sin(q.t*1.3+lx*9)*1.2;g.fillStyle='#3f8a3c';g.beginPath();g.moveTo(x,y);g.arc(x,y,pr*lr*1.5,.5,6);g.closePath();g.fill();if(lx>0){ell(g,x,y,pr*.05,pr*.05,'#ffb0c8');ell(g,x,y,pr*.02,pr*.02,'#ffe14a')}}
 /* sheep (sorted by y) */
 const barkR=W*.16*(h.barkT>0?1.9:1);const order=sh.slice().sort((a,b)=>a.y-b.y),r=W*.034;
 for(const s of order){const sp=Math.hypot(s.vx,s.vy);if(sp>4){s._a=(s._a||0)+ang(s._a||0,Math.atan2(s.vy,s.vx))*Math.min(1,dt*9)}s._w=(s._w||0)+sp*dt*.1;
  const dd=Math.hypot(s.x-dog.x,s.y-dog.y),scared=!s.in&&dd<barkR*(s.blk?1.25:1);
  if(s.in&&!s._cel){s._cel=1;q.pops.push({x:s.x,y:s.y-r*1.5,t:1,m:1,s:s.blk?'BLACK SHEEP IN!':'IN!',c:'#ffe27a'});for(let i=0;i<8;i++)q.pts.push({x:s.x,y:s.y,vx:(Math.random()-.5)*90,vy:-30-Math.random()*60,l:.7,m:.7,c:i%2?'#ffe27a':'#fff',r:2+Math.random()*1.6,g:.8,star:1})}
  s._b=(s._b||0)-dt;if(scared&&s._b<=0&&Math.random()<dt*.9&&q.baa<=0){s._b=2.5;q.baa=.7;q.pops.push({x:s.x,y:s.y-r*1.6,t:.7,m:.7,s:'BAA!',c:'#fff'});beep(s.blk?200:280,.1,'sawtooth',.03);setTimeout(()=>beep(s.blk?180:250,.12,'sawtooth',.03),90)}
  sheep(g,s,r,q.t,scared)}
 q.baa-=dt;
 /* dog */
 const ds=Math.hypot(dog.x-q.dx,dog.y-q.dy)/Math.max(dt,.001);q.ds=sm(q.ds,ds,.25);q.dx=dog.x;q.dy=dog.y;const mv=q.ds>W*.04,fast=q.ds>W*.3;q.dp+=q.ds*dt*.06;q.tail+=dt*(mv?14:7);
 if(mv&&Math.random()<dt*28)q.pts.push({x:dog.x-Math.cos(dog.a)*W*.05+(Math.random()-.5)*5,y:dog.y-Math.sin(dog.a)*W*.05+(Math.random()-.5)*5,vx:-Math.cos(dog.a)*12,vy:-Math.sin(dog.a)*12,l:.5,m:.5,c:'rgba(200,180,130,.6)',r:3,g:0});
 /* target marker */
 const tdx=dog.tx-dog.x,tdy=dog.ty-dog.y;if(Math.hypot(tdx,tdy)>12&&h.ph==='play'){const k=.5+.5*Math.sin(q.t*8);g.strokeStyle='rgba(255,255,255,'+(.35+k*.25)+')';g.lineWidth=2;g.beginPath();g.arc(dog.tx,dog.ty,W*.012+k*3,0,6.3);g.stroke();g.beginPath();g.moveTo(dog.tx-W*.008,dog.ty);g.lineTo(dog.tx+W*.008,dog.ty);g.moveTo(dog.tx,dog.ty-W*.008);g.lineTo(dog.tx,dog.ty+W*.008);g.stroke()}
 dogSpr(g,W,dog,q,dt,mv,fast);
 /* bark shockwave + cooldown ring */
 if(q.bark>0){q.bark-=dt;const u=1-q.bark/.6;for(let i=0;i<2;i++){const uu=cl(u-i*.18,0,1);g.strokeStyle='rgba(255,255,255,'+(1-uu)*.8+')';g.lineWidth=3-i;g.beginPath();g.arc(dog.x,dog.y,W*.04+uu*W*.28,0,6.3);g.stroke()}}
 if(h.barkC>0&&h.ph==='play'){g.strokeStyle='rgba(255,215,90,.8)';g.lineWidth=3;g.beginPath();g.arc(dog.x,dog.y,W*.058,-Math.PI/2,-Math.PI/2+6.283*(1-h.barkC/2.5));g.stroke()}
 /* particles + pops */
 for(let i=q.pts.length-1;i>=0;i--){const p=q.pts[i];p.l-=dt;if(p.l<=0){q.pts.splice(i,1);continue}p.vy+=160*dt*p.g;p.x+=p.vx*dt;p.y+=p.vy*dt;g.globalAlpha=Math.min(1,p.l/p.m*1.5);g.fillStyle=p.c;g.beginPath();if(p.star){g.rect(p.x-p.r,p.y-p.r,p.r*2,p.r*2)}else g.arc(p.x,p.y,p.r,0,6.3);g.fill()}g.globalAlpha=1;
 g.textAlign='center';g.font='bold '+Math.round(W*.022)+'px monospace';
 for(let i=q.pops.length-1;i>=0;i--){const p=q.pops[i];p.t-=dt;if(p.t<=0){q.pops.splice(i,1);continue}const u=1-p.t/p.m,y=p.y-u*H*.07;g.globalAlpha=Math.min(1,p.t/p.m*2);g.lineWidth=4;g.strokeStyle='rgba(0,0,0,.6)';g.strokeText(p.s,p.x,y);g.fillStyle=p.c;g.fillText(p.s,p.x,y)}g.globalAlpha=1;
 /* HUD */
 const tb=W*.3,tx0=W*.5-tb/2,ty0=H*.03;g.fillStyle='rgba(0,0,0,.5)';g.fillRect(tx0-2,ty0-2,tb+4,10);g.fillStyle=h.t<15?'#ff9a4a':'#9fe8a0';g.fillRect(tx0,ty0,tb*cl(h.t/70,0,1),6);
 for(let i=0;i<6;i++){const on=sh[i].in,x=W*.06+i*W*.035,y=H*.045,blk=sh[i].blk;g.globalAlpha=on?1:.4;g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.arc(x,y,W*.014,0,6.3);g.fill();g.fillStyle=blk?'#2a2a2e':'#f3f0e6';g.beginPath();g.arc(x,y,W*.011,0,6.3);g.fill();g.fillStyle=blk?'#555':'#5a4a44';g.beginPath();g.arc(x+W*.009,y,W*.006,0,6.3);g.fill()}g.globalAlpha=1;
 if(h.ph==='done'&&q.res){const r2=q.res,pw=W*.46,ph2=H*.46,px2=(W-pw)/2,py3=H*.22;g.fillStyle='rgba(10,20,8,.62)';g.fillRect(0,0,W,H);g.fillStyle='#3a2a14';g.fillRect(px2,py3,pw,ph2);g.strokeStyle='#f5e6a0';g.lineWidth=3;g.strokeRect(px2,py3,pw,ph2);
  g.textAlign='center';g.fillStyle=r2.win?'#ffe27a':'#ffb09a';g.font='bold '+Math.round(W*.032)+'px monospace';g.fillText(r2.win?'ALL SIX IN!':'TIME UP',W/2,py3+H*.1);
  const stars=r2.win?(r2.left>=30?3:r2.left>=15?2:1):0;for(let i=0;i<3;i++){const sx=W/2+(i-1)*W*.07,sy=py3+H*.2;g.fillStyle=i<stars?'#ffd23a':'#55503a';g.beginPath();for(let k=0;k<10;k++){const rr=k%2?W*.012:W*.027,a=-Math.PI/2+k*Math.PI/5;g.lineTo(sx+Math.cos(a)*rr,sy+Math.sin(a)*rr)}g.closePath();g.fill()}
  g.fillStyle='#fff';g.font='bold '+Math.round(W*.02)+'px monospace';g.fillText(r2.n+'/6 SHEEP PENNED',W/2,py3+H*.31);g.fillStyle='#9fe8a0';g.fillText('+£'+r2.pay,W/2,py3+H*.37);if(r2.win){g.fillStyle='#9fe8ff';g.font='bold '+Math.round(W*.015)+'px monospace';g.fillText('BEST TIME '+r2.best+'s',W/2,py3+H*.42)}}
};
})();
