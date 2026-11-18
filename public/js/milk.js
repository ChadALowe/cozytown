/* ===== Milking mini-game polish =====
   Replaces milkDraw (a flat blob cow) with a barn scene: planked wall, window light, hay, straw floor, a cow with a face that
   reacts to how restless she is (calm -> wide-eyed -> "MOO!" -> kick), per-cow coat colours, a swishing tail, farmer's hands
   and sleeves that squeeze on each tap, streams of milk with splashes, a glass pail with foam, floating PERFECT/GOOD text,
   a combo counter and a results panel.  Game rules / scoring in app.js are untouched; this wraps milkTap + milkEnd only
   to read what just happened. */
(function(){
const COAT=[['#ecebe2','#26262c','#e8a0a8'],['#c98a4e','#f2dfbc','#e8a89a'],['#3a2a26','#efe7d6','#d89a9a']];
const sm=(a,b,t)=>a+(b-a)*t,cl=(x,a,b)=>x<a?a:x>b?b:x;
const rnd=(n)=>{n=Math.imul(n^n>>>15,2246822519);n=Math.imul(n^n>>>13,3266489917);return((n^n>>>16)>>>0)/4294967296};

function X(){const m=MG;if(!m._x){m._x={pops:[],pts:[],sq:[0,0],combo:0,best:0,t:0,lt:performance.now(),moo:0,res:null,flash:0,spill:0,blink:3};}return m._x}
function pail(W,H){return{bx:W*.5,by:H*.975,bw:W*.23,bh:H*.215}}
function teats(W,H){return{tx:[W*.44,W*.56],ty:H*.64}}
function surfY(W,H,fill){const p=pail(W,H);return p.by-p.bh*.06-p.bh*.84*fill/100}
function puff(x,y,n,c,sp){const q=X();for(let i=0;i<n;i++){const a=Math.random()*6.283,v=(.3+Math.random())*sp;q.pts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-sp*.8,l:.5+Math.random()*.4,m:.9,c,r:1.5+Math.random()*2.2,g:1})}}

/* ---- wrap tap: infer result from state change ---- */
const tap0=milkTap;
milkTap=function(s){const m=MG;if(!m||m.ph!=='play')return tap0(s);const f0=m.fill,r0=m.rest;tap0(s);if(!MG)return;
 const q=X(),{tx,ty}=teats(m.W,m.H),df=m.fill-f0,dr=m.rest-r0;let txt,col;
 if(m.fill-f0<=0&&dr>=20){txt='WRONG SIDE!';col='#ff6a5a';q.combo=0;q.flash=.25}
 else{const k=Math.round(df/1.55);q.sq[s]=1;
  if(k>=3){txt='PERFECT!';col='#ffe27a';q.combo++;puff(tx[s],ty,10,'#ffe27a',70)}
  else if(k===2){txt='GOOD';col='#9fe8a0';q.combo++}
  else{txt='OFF BEAT';col='#ffb06a';q.combo=0}
  q.best=Math.max(q.best,q.combo);
  const p=pail(m.W,m.H),sy=surfY(m.W,m.H,m.fill),ex=p.bx+(s?1:-1)*p.bw*.1;
  for(let i=0;i<3+k*2;i++)q.pts.push({x:ex,y:sy,vx:(Math.random()-.5)*50,vy:-30-Math.random()*50*k*.6,l:.4,m:.4,c:'#fff',r:1.4+Math.random()*1.4,g:1})}
 q.pops.push({x:tx[s]+(s?1:-1)*m.W*.07,y:ty-m.H*.06,t:.7,m:.7,s:txt,c:col});
 if(q.combo===5||q.combo===10||q.combo===20){q.pops.push({x:m.W*.5,y:m.H*.14,t:1,m:1,s:'COMBO x'+q.combo+'!',c:'#9fe8ff'});beep(880,.07,'square',.04)}};

const end0=milkEnd;
milkEnd=function(kicked){const m=MG,b=INV.milk|0;end0(kicked);if(!MG)return;const q=X();q.res={n:(INV.milk|0)-b,kicked:!!kicked,fill:m.fill,perfect:m.perfect,best:q.best};
 if(kicked){beep(120,.35,'sawtooth',.07);setTimeout(()=>beep(90,.3,'sawtooth',.06),150)}else if(q.res.n>=3){[660,880,1180].forEach((f,i)=>setTimeout(()=>beep(f,.12,'square',.05),i*110))}};

/* ---- drawing helpers ---- */
function ell(g,x,y,rx,ry,c,rot){g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,rot||0,0,6.2832);g.fill()}

function bg(g,W,H,q){
 /* planked wall */
 g.fillStyle='#5c3e22';g.fillRect(0,0,W,H);
 const pw=W/16;for(let i=0;i<16;i++){g.fillStyle=i%2?'#74502c':'#6a4828';g.fillRect(i*pw,0,pw-1.5,H*.8);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(i*pw+pw*.3,0,1,H*.8);
  for(let k=0;k<3;k++){const ky=rnd(i*9+k)*H*.7;g.fillStyle='rgba(40,24,10,.35)';g.beginPath();g.ellipse(i*pw+pw*.5,ky,2.5,5,0,0,6.3);g.fill()}}
 g.fillStyle='#3a2612';g.fillRect(0,H*.4,W,H*.014);g.fillRect(0,H*.7,W,H*.014);
 /* window + light */
 const wx=W*.05,wy=H*.07,ww=W*.17,wh=H*.27;g.fillStyle='#2a1a0c';g.fillRect(wx-5,wy-5,ww+10,wh+10);
 const sk=g.createLinearGradient(0,wy,0,wy+wh);sk.addColorStop(0,'#8ac8ff');sk.addColorStop(1,'#d8f0ff');g.fillStyle=sk;g.fillRect(wx,wy,ww,wh);
 g.fillStyle='#fff';g.globalAlpha=.8;g.beginPath();g.ellipse(wx+ww*.35,wy+wh*.3,ww*.2,wh*.07,0,0,6.3);g.fill();g.globalAlpha=1;
 g.fillStyle='#5a9a48';g.fillRect(wx,wy+wh*.78,ww,wh*.22);g.fillStyle='#2a1a0c';g.fillRect(wx+ww/2-2,wy,4,wh);g.fillRect(wx,wy+wh/2-2,ww,4);
 g.fillStyle='rgba(255,240,190,.10)';g.beginPath();g.moveTo(wx,wy+wh);g.lineTo(wx+ww,wy+wh);g.lineTo(W*.62,H*.82);g.lineTo(W*.22,H*.82);g.closePath();g.fill();
 /* lantern */
 g.fillStyle='#222';g.fillRect(W*.83-1.5,0,3,H*.12);ell(g,W*.83,H*.17,W*.022,H*.04,'#ffd070');g.fillStyle='rgba(255,210,120,.18)';g.beginPath();g.arc(W*.83,H*.17,W*.09+Math.sin(q.t*3)*2,0,6.3);g.fill();g.fillStyle='#222';g.fillRect(W*.83-W*.026,H*.12,W*.052,H*.012);g.fillRect(W*.83-W*.026,H*.21,W*.052,H*.012);
 /* hay bales */
 for(const[x,y,w,h]of[[.8,.58,.18,.22],[.86,.4,.12,.18]]){g.fillStyle='#d8b85a';g.fillRect(W*x,H*y,W*w,H*h);g.strokeStyle='#a88a34';g.lineWidth=1.2;for(let i=1;i<7;i++){g.beginPath();g.moveTo(W*x,H*y+H*h*i/7);g.lineTo(W*(x+w),H*y+H*h*i/7+((i&1)?2:-2));g.stroke()}g.fillStyle='#6a4a22';g.fillRect(W*x,H*y+H*h*.3,W*w,3);g.fillRect(W*x,H*y+H*h*.7,W*w,3)}
 /* floor */
 g.fillStyle='#b8985a';g.fillRect(0,H*.8,W,H*.2);g.fillStyle='#a08040';g.fillRect(0,H*.8,W,H*.012);
 for(let i=0;i<90;i++){const sx=rnd(i)*W,sy=H*.81+rnd(i+300)*H*.19,a=rnd(i+700)*3;g.strokeStyle=i%3?'#d8b868':'#8a6a30';g.lineWidth=1.3;g.beginPath();g.moveTo(sx,sy);g.lineTo(sx+Math.cos(a)*W*.03,sy+Math.sin(a)*3);g.stroke()}
 /* stool */
 g.fillStyle='#8a5a2a';g.fillRect(W*.07,H*.88,W*.11,H*.03);g.fillRect(W*.075,H*.91,W*.012,H*.08);g.fillRect(W*.165,H*.91,W*.012,H*.08)}

function cow(g,W,H,q,m){
 const [coat,patch,pink]=COAT[m.ci],rest=m.rest,t=q.t,kick=m.ph==='kick'?1-m.kick:0,ku=Math.sin(Math.min(1,kick*1.4)*Math.PI);
 const shade='rgba(0,0,0,.13)';
 /* hind legs */
 const leg=(x,sd)=>{g.save();const px=W*x,py=H*.5;g.translate(px,py);if(sd===1)g.rotate(-ku*.9);
  g.fillStyle=coat;g.beginPath();g.moveTo(-W*.055,0);g.lineTo(W*.055,0);g.lineTo(W*.036,H*.27);g.lineTo(-W*.036,H*.27);g.closePath();g.fill();
  g.fillStyle=shade;g.beginPath();g.moveTo(sd?-W*.01:W*.012,0);g.lineTo(W*.055,0);g.lineTo(W*.036,H*.27);g.lineTo(sd?-W*.01:W*.012,H*.27);g.closePath();g.fill();
  g.fillStyle='#2a2428';g.fillRect(-W*.04,H*.255,W*.08,H*.045);g.restore()};
 leg(.31,0);leg(.69,1);
 /* body */
 const body=()=>{g.beginPath();g.ellipse(W*.5,H*.33,W*.29,H*.33,0,0,6.3);g.moveTo(W*.5+W*.17,H*.28);g.ellipse(W*.65,H*.3,W*.15,H*.25,0,0,6.3);g.moveTo(W*.35+W*.15,H*.3);g.ellipse(W*.35,H*.3,W*.15,H*.25,0,0,6.3)};
 g.fillStyle=coat;body();g.fill();
 g.save();body();g.clip();g.fillStyle=patch;
 const pat=[[.36,.2,.1,.14,.4],[.62,.16,.12,.1,-.3],[.5,.46,.08,.07,0],[.7,.4,.07,.12,.5],[.3,.42,.06,.08,-.4]];
 for(const[x,y,rx,ry,rot]of pat){g.beginPath();g.ellipse(W*x,H*y,W*rx,H*ry,rot,0,6.3);g.fill()}
 const gr=g.createLinearGradient(0,H*.05,0,H*.65);gr.addColorStop(0,'rgba(255,255,255,.12)');gr.addColorStop(.6,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.22)');g.fillStyle=gr;g.fillRect(0,0,W,H);g.restore();
 g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=2;g.beginPath();g.moveTo(W*.5,H*.04);g.lineTo(W*.5,H*.5);g.stroke();
 /* tail */
 const sw=Math.sin(t*(2.4+rest*.07))*W*(.035+rest*.0012);g.strokeStyle=coat===COAT[0][0]?'#d0cfc4':shade;g.strokeStyle=patch;g.lineWidth=W*.013;g.lineCap='round';
 g.beginPath();g.moveTo(W*.5,H*.1);g.quadraticCurveTo(W*.5+sw*.4,H*.3,W*.5+sw,H*.5);g.stroke();ell(g,W*.5+sw,H*.52,W*.016,H*.045,'#1e1a1c',sw*.01);
 /* udder */
 ell(g,W*.5,H*.585,W*.14,H*.09,pink);ell(g,W*.5,H*.565,W*.1,H*.04,'rgba(255,255,255,.22)');g.strokeStyle='rgba(0,0,0,.14)';g.lineWidth=1.5;g.beginPath();g.moveTo(W*.5,H*.52);g.lineTo(W*.5,H*.66);g.stroke();
 const{tx,ty}=teats(W,H);
 for(let i=0;i<2;i++){const act=m.side===i&&m.ph==='play',sqz=q.sq[i];const len=H*.05*(1+sqz*.35),wd=W*.017*(1-sqz*.25);ell(g,tx[i],ty,wd,len,act?'#ffe27a':'#d88a98');ell(g,tx[i]-wd*.3,ty-len*.3,wd*.3,len*.4,'rgba(255,255,255,.35)')}
 /* head peeking round the flank */
 const hx=W*.135,hy=H*.38,calm=rest<35,wide=rest>=65,mood=cl(rest/100,0,1);
 g.save();g.translate(hx,hy);g.rotate(-.35);
 ell(g,W*.045,-H*.02,W*.065,H*.12,coat,.25);/* neck */
 g.fillStyle=coat;g.beginPath();g.ellipse(0,0,W*.07,H*.12,0,0,6.3);g.fill();
 g.fillStyle=patch;g.beginPath();g.ellipse(-W*.01,-H*.07,W*.04,H*.045,0,0,6.3);g.fill();
 ell(g,-W*.07,-H*.07+Math.sin(t*5)*(wide?2:0),W*.045,H*.022,coat,.6);ell(g,-W*.07,-H*.07,W*.03,H*.012,pink,.6);/* ear */
 g.fillStyle='#f0e6c8';g.beginPath();g.moveTo(W*.02,-H*.115);g.lineTo(W*.04,-H*.17);g.lineTo(W*.055,-H*.11);g.closePath();g.fill();
 ell(g,-W*.005,H*.075,W*.05,H*.05,pink);ell(g,-W*.02,H*.08,W*.007,H*.008,'#6a3a44');ell(g,W*.01,H*.08,W*.007,H*.008,'#6a3a44');
 const ex=W*.012,ey=-H*.02;ell(g,ex,ey,W*.02,H*.028,'#fff');ell(g,ex+W*.006,ey+(wide?0:H*.004),W*.009,H*.016,'#1a1a1a');
 if(calm){g.fillStyle=coat;g.beginPath();g.ellipse(ex,ey-H*.012,W*.022,H*.018,0,0,Math.PI);g.fill();const bl=q.blink<.12;if(bl){g.fillStyle=coat;g.fillRect(ex-W*.021,ey-H*.028,W*.042,H*.056)}}
 g.strokeStyle='#2a1a1a';g.lineWidth=2;g.beginPath();if(wide){g.moveTo(ex-W*.02,ey-H*.04);g.lineTo(ex+W*.02,ey-H*.03)}else{g.moveTo(ex-W*.02,ey-H*.035);g.lineTo(ex+W*.02,ey-H*.038)}g.stroke();
 g.beginPath();if(calm)g.arc(-W*.005,H*.1,W*.022,.2,Math.PI-.2);else if(wide){g.moveTo(-W*.025,H*.115);g.lineTo(W*.015,H*.1)}else{g.moveTo(-W*.02,H*.105);g.lineTo(W*.01,H*.105)}g.stroke();
 if(rest>50){ell(g,W*.052,-H*.045+((t*30)%6),W*.007,H*.014,'#7ac8ff')}
 g.restore();
 if(rest>75&&Math.floor(t*4)%2===0&&m.ph==='play'){const bx=W*.17,by=H*.16;g.fillStyle='#fff';g.strokeStyle='#222';g.lineWidth=2;g.beginPath();g.ellipse(bx,by,W*.06,H*.06,0,0,6.3);g.fill();g.stroke();g.beginPath();g.moveTo(bx-W*.015,by+H*.055);g.lineTo(bx-W*.03,by+H*.1);g.lineTo(bx+W*.01,by+H*.057);g.fill();g.fillStyle='#222';g.font='bold '+Math.round(W*.03)+'px monospace';g.textAlign='center';g.fillText('MOO!',bx,by+H*.012)}
}

function hands(g,W,H,q,m){const{tx,ty}=teats(W,H);
 for(let s=0;s<2;s++){const sz=q.sq[s],dir=s?1:-1,hx=tx[s]+dir*W*.028-dir*sz*W*.008,hy=ty+H*.055;
  const sx=s?W*.8:W*.2,sy=H*1.06;
  g.lineCap='round';g.strokeStyle='#2c5290';g.lineWidth=W*.058;g.beginPath();g.moveTo(sx,sy);g.lineTo(hx+dir*W*.05,hy+H*.1);g.stroke();
  g.strokeStyle='#3a68b0';g.lineWidth=W*.046;g.beginPath();g.moveTo(sx,sy);g.lineTo(hx+dir*W*.05,hy+H*.1);g.stroke();
  g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=3;for(let i=0;i<5;i++){const u=.15+i*.17;g.beginPath();g.moveTo(sm(sx,hx+dir*W*.05,u)-W*.03,sm(sy,hy+H*.1,u));g.lineTo(sm(sx,hx+dir*W*.05,u)+W*.03,sm(sy,hy+H*.1,u));g.stroke()}
  ell(g,hx+dir*W*.045,hy+H*.075,W*.04,H*.03,'#f4f0e8');/* cuff */
  const r=W*.032*(1-sz*.14);ell(g,hx,hy,r,r*1.15,'#f0c8a0');
  g.strokeStyle='#d8a880';g.lineWidth=1.5;for(let i=0;i<3;i++){g.beginPath();g.arc(hx-dir*r*.1,hy-r*.45+i*r*.5,r*.75,s?Math.PI*.6:-Math.PI*.4,s?Math.PI*1.4:Math.PI*.4);g.stroke()}
  ell(g,hx+dir*r*.7,hy-r*.8,r*.3,r*.55,'#f0c8a0',dir*.4)}}

function drawPail(g,W,H,q,m){const p=pail(W,H);let{bx,by,bw,bh}=p;
 const kick=m.ph==='kick'?1-m.kick:0,ku=Math.sin(Math.min(1,kick*1.4)*Math.PI);
 g.save();g.translate(bx+W*.1*ku,by);g.rotate(ku*.45);g.translate(-bx,-by);
 const tl=bx-bw/2,tr=bx+bw/2,bl=bx-bw*.4,br=bx+bw*.4,top=by-bh;
 /* handle */
 g.strokeStyle='#9a9ea8';g.lineWidth=3;g.beginPath();g.arc(bx,top,bw*.5,Math.PI,0);g.stroke();
 /* glass body */
 g.fillStyle='rgba(190,205,230,.28)';g.beginPath();g.moveTo(tl,top);g.lineTo(tr,top);g.lineTo(br,by);g.lineTo(bl,by);g.closePath();g.fill();
 /* milk */
 const f=m.fill/100,fh=bh*.84*f,sy=by-bh*.06-fh,k=(sy-top)/bh,lx=sm(tl,bl,k),rx=sm(tr,br,k);
 if(f>0){g.fillStyle='#f6f4ec';g.beginPath();g.moveTo(lx,sy);g.lineTo(rx,sy);g.lineTo(br-bw*.03,by-bh*.06);g.lineTo(bl+bw*.03,by-bh*.06);g.closePath();g.fill();
  g.fillStyle='rgba(120,150,220,.12)';g.fillRect(lx,sy,(rx-lx)*.25,fh);
  g.fillStyle='#fff';const wv=Math.sin(q.t*6)*1.4;g.beginPath();g.ellipse((lx+rx)/2,sy+wv*.3,(rx-lx)/2,bh*.05,0,0,6.3);g.fill();
  for(let i=0;i<7;i++){const fx=lx+(rx-lx)*(.1+i*.13),fr=bh*.035+rnd(i+m.ci*7)*bh*.02;g.beginPath();g.arc(fx,sy-bh*.01+wv*.2,fr,0,6.3);g.fill()}}
 /* ticks + rim + base */
 g.strokeStyle='rgba(60,70,90,.6)';g.lineWidth=1.5;for(let i=1;i<4;i++){const y=by-bh*.06-bh*.84*i/4,kk=(y-top)/bh,a=sm(tl,bl,kk);g.beginPath();g.moveTo(a,y);g.lineTo(a+bw*.07,y);g.stroke()}
 g.strokeStyle='#868b96';g.lineWidth=3;g.beginPath();g.moveTo(tl,top);g.lineTo(bl,by);g.moveTo(tr,top);g.lineTo(br,by);g.stroke();
 g.fillStyle='#a2a6b0';g.fillRect(tl-3,top-3,bw+6,5);g.fillStyle='#70747e';g.fillRect(bl-2,by-4,bw*.8+4,6);
 g.fillStyle='rgba(255,255,255,.35)';g.fillRect(tl+bw*.1,top+6,3,bh*.6);
 g.restore()}

function streams(g,W,H,q,m){const{tx,ty}=teats(W,H),sy=surfY(W,H,m.fill),p=pail(W,H);
 for(const f of m.flows){const s=f.s,ex=p.bx+(s?1:-1)*p.bw*.1,sx=tx[s],y0=ty+H*.045,w=W*.0075*(.5+f.t/.18);
  g.lineCap='round';g.strokeStyle='#bcc8e0';g.lineWidth=w*1.8;g.beginPath();g.moveTo(sx,y0);g.quadraticCurveTo(sx,(y0+sy)/2,ex,sy);g.stroke();
  g.strokeStyle='#fff';g.lineWidth=w;g.beginPath();g.moveTo(sx,y0);g.quadraticCurveTo(sx,(y0+sy)/2,ex,sy);g.stroke()}}

function parts(g,W,H,q,dt){
 for(let i=q.pts.length-1;i>=0;i--){const p=q.pts[i];p.l-=dt;if(p.l<=0){q.pts.splice(i,1);continue}p.vy+=240*dt*p.g;p.x+=p.vx*dt;p.y+=p.vy*dt;g.globalAlpha=Math.min(1,p.l/p.m*1.6);g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,p.r,0,6.3);g.fill()}
 g.globalAlpha=1;
 g.textAlign='center';g.font='bold '+Math.round(W*.03)+'px monospace';
 for(let i=q.pops.length-1;i>=0;i--){const p=q.pops[i];p.t-=dt;if(p.t<=0){q.pops.splice(i,1);continue}const u=1-p.t/p.m;g.globalAlpha=Math.min(1,p.t/p.m*2);g.lineWidth=4;g.strokeStyle='rgba(0,0,0,.7)';g.strokeText(p.s,p.x,p.y-u*H*.1);g.fillStyle=p.c;g.fillText(p.s,p.x,p.y-u*H*.1)}
 g.globalAlpha=1}

function hud(g,W,H,q,m){
 /* time bar */
 const tb=W*.3,tx0=W*.5-tb/2,ty0=H*.025;g.fillStyle='rgba(0,0,0,.5)';g.fillRect(tx0-2,ty0-2,tb+4,10);g.fillStyle=m.t<8?'#ff9a4a':'#9fe8a0';g.fillRect(tx0,ty0,tb*cl(m.t/30,0,1),6);
 g.fillStyle='#fff';g.font='bold '+Math.round(W*.022)+'px monospace';g.textAlign='center';g.fillText(Math.max(0,Math.ceil(m.t))+'s',W*.5,ty0+H*.05);
 /* restless */
 const bx=W*.05,by=H*.935-H*.0,bw=W*.2;g.fillStyle='rgba(0,0,0,.55)';g.fillRect(bx-3,H*.035-3,bw+6,16);g.fillStyle=m.rest>60?'#d83030':m.rest>35?'#e8b040':'#6ac05a';g.fillRect(bx,H*.035,bw*Math.min(1,m.rest/100),10);
 g.fillStyle='#fff';g.font='bold '+Math.round(W*.018)+'px monospace';g.textAlign='left';g.fillText('RESTLESS',bx,H*.035+H*.045);
 /* combo */
 if(q.combo>=3){g.textAlign='right';g.fillStyle='#9fe8ff';g.font='bold '+Math.round(W*.034)+'px monospace';g.fillText('x'+q.combo,W*.95,H*.08);g.font='bold '+Math.round(W*.016)+'px monospace';g.fillText('COMBO',W*.95,H*.11)}
 /* beat ring */
 if(m.ph==='play'){const{tx,ty}=teats(W,H),k=cl((m.nb-m.beat)/m.per,0,1),cx=tx[m.side],near=Math.min(Math.abs(m.beat-(m.nbPrev||0)),Math.abs(m.nb-m.beat))<.13;
  g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=3;g.beginPath();g.arc(cx,ty,W*.022+k*W*.07,0,6.3);g.stroke();
  g.strokeStyle=near?'#ffe27a':'rgba(255,226,122,.6)';g.lineWidth=near?5:3;g.beginPath();g.arc(cx,ty,W*.024,0,6.3);g.stroke();
  if(near){g.fillStyle='rgba(255,226,122,.18)';g.beginPath();g.arc(cx,ty,W*.045,0,6.3);g.fill()}
  const dir=m.side?'RIGHT':'LEFT';g.fillStyle='rgba(255,255,255,.75)';g.font='bold '+Math.round(W*.018)+'px monospace';g.textAlign='center';g.fillText(dir,cx,ty+H*.13)}}

function result(g,W,H,q,m){const r=q.res;if(!r)return;g.fillStyle='rgba(10,6,2,.62)';g.fillRect(0,0,W,H);
 const pw=W*.5,ph=H*.52,px=W*.25,py=H*.2;g.fillStyle='#3a2612';g.fillRect(px,py,pw,ph);g.strokeStyle='#f5e6a0';g.lineWidth=3;g.strokeRect(px,py,pw,ph);
 g.textAlign='center';g.fillStyle=r.kicked?'#ff8a7a':'#ffe27a';g.font='bold '+Math.round(W*.035)+'px monospace';g.fillText(r.kicked?'SHE KICKED THE PAIL!':r.n>=4?'PERFECT PAIL!':'MILKING DONE',W*.5,py+H*.1);
 for(let i=0;i<4;i++){const bx=px+pw*(.16+i*.22),by=py+H*.14,on=i<r.n;g.globalAlpha=on?1:.25;g.fillStyle='#e8ecf4';g.fillRect(bx,by+H*.06,W*.05,H*.14);g.fillStyle=on?'#fff':'#888';g.fillRect(bx+2,by+H*.09,W*.05-4,H*.1);g.fillStyle='#d03030';g.fillRect(bx-1,by+H*.04,W*.05+2,H*.025);g.fillStyle='#e8ecf4';g.fillRect(bx+W*.012,by,W*.026,H*.045)}
 g.globalAlpha=1;g.fillStyle='#fff';g.font='bold '+Math.round(W*.022)+'px monospace';g.fillText(r.n?'+'+r.n+' BOTTLE'+(r.n>1?'S':'')+' OF MILK':'NO MILK THIS TIME',W*.5,py+H*.42);
 g.fillStyle='#9fe8ff';g.font='bold '+Math.round(W*.017)+'px monospace';g.fillText('PERFECT TAPS '+r.perfect+'   BEST COMBO '+r.best,W*.5,py+H*.48)}

milkDraw=function(){const m=MG;if(!m)return;const q=X(),{g,W,H}=m,now=performance.now(),dt=Math.min(.05,(now-q.lt)/1000);q.lt=now;q.t+=dt;q.blink=(q.blink-dt);if(q.blink<0)q.blink=2+Math.random()*3;q.sq[0]=Math.max(0,q.sq[0]-dt*6);q.sq[1]=Math.max(0,q.sq[1]-dt*6);q.flash=Math.max(0,q.flash-dt);
 if(m.rest>=60&&!q.moo&&m.ph==='play'){q.moo=1;beep(130,.3,'sawtooth',.05);setTimeout(()=>beep(100,.3,'sawtooth',.04),120)}if(m.rest<45)q.moo=0;
 if(m.ph==='kick'&&!q.spill){q.spill=1;const p=pail(W,H);puff(p.bx,p.by-p.bh*.5,26,'#fff',140)}
 bg(g,W,H,q);cow(g,W,H,q,m);streams(g,W,H,q,m);hands(g,W,H,q,m);drawPail(g,W,H,q,m);hud(g,W,H,q,m);
 if(m.ph==='kick'){g.fillStyle='#fff';g.font='bold '+Math.round(W*.05)+'px monospace';g.textAlign='center';g.lineWidth=5;g.strokeStyle='#a02020';g.strokeText('*KICK!*',W*.5,H*.14);g.fillText('*KICK!*',W*.5,H*.14)}
 parts(g,W,H,q,dt);
 if(q.flash>0){g.fillStyle='rgba(255,60,40,'+q.flash*.5+')';g.fillRect(0,0,W,H)}
 if(m.ph==='done')result(g,W,H,q,m)};
})();
