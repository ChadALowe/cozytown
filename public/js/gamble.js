/* ===== Fruit machine + scratch card polish =====
   Fruit machine: replaces sltDraw with a chrome-and-gold cabinet (chasing marquee bulbs, glossy glass, curved reels with
   motion blur while spinning, glowing payline, winning symbols pulsing in gold boxes, lamps for HOLD / NUDGE, a coin shower
   on wins and a gold flash for a jackpot).  Reel geometry is unchanged so the HOLD / NUDGE buttons still line up.
   Scratch cards: new ticket artwork (perforated edge, ribbon header, glowing winning panels), better silver foil, a coin that
   follows your finger, foil flakes as you scratch and confetti on a win.  Odds and payouts are untouched. */
(function(){
const rnd=n=>{n=Math.imul(n^n>>>15,2246822519);n=Math.imul(n^n>>>13,3266489917);return((n^n>>>16)>>>0)/4294967296};
const cl=(x,a,b)=>x<a?a:x>b?b:x;
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function gold(g,x0,y0,x1,y1){const gr=g.createLinearGradient(x0,y0,x1,y1);gr.addColorStop(0,'#fff0a0');gr.addColorStop(.3,'#f0c030');gr.addColorStop(.6,'#b8860b');gr.addColorStop(1,'#f8d860');return gr}
function coin(g,x,y,r,rot){g.save();g.translate(x,y);g.scale(Math.abs(Math.cos(rot))*.9+.1,1);g.fillStyle='#b8860b';g.beginPath();g.arc(0,0,r,0,6.3);g.fill();g.fillStyle='#f6d040';g.beginPath();g.arc(0,0,r*.84,0,6.3);g.fill();g.strokeStyle='#c89a1a';g.lineWidth=r*.14;g.beginPath();g.arc(0,0,r*.58,0,6.3);g.stroke();g.fillStyle='#fff6b0';g.fillRect(-r*.1,-r*.32,r*.2,r*.64);g.restore()}

/* ================= FRUIT MACHINE ================= */
function sQ(S){return S._x||(S._x={pts:[],lt:performance.now(),pp:[S.pos[0],S.pos[1],S.pos[2]],sp:[0,0,0],wl:0,flashG:0})}
const slr0=sltResult;
sltResult=function(){slr0();const S=SLT;if(!S)return;const q=sQ(S);if(S.win>0&&q.wl!==S.win+':'+SLTS.n){q.wl=S.win+':'+SLTS.n;const big=S.flash>=4,n=big?70:S.win>S.stake?26:8;for(let i=0;i<n;i++)q.pts.push({x:240+(Math.random()-.5)*200,y:-10-Math.random()*90,vx:(Math.random()-.5)*90,vy:Math.random()*60,r:6+Math.random()*3,rot:Math.random()*6,vr:6+Math.random()*8,b:0,l:3+Math.random()*1.5});if(big)q.flashG=1}};

sltDraw=function(){const S=SLT,g=S.g,W=480,H=394,t=performance.now()/1000,q=sQ(S),dt=Math.min(.05,(performance.now()-q.lt)/1000);q.lt=performance.now();
 for(let i=0;i<3;i++){q.sp[i]=dt>0?Math.abs(S.pos[i]-q.pp[i])/dt:0;q.pp[i]=S.pos[i]}
 /* cabinet */
 let gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#d42020');gr.addColorStop(.5,'#a81414');gr.addColorStop(1,'#5a0a0e');g.fillStyle=gr;g.fillRect(0,0,W,H);
 g.fillStyle='rgba(255,255,255,.05)';for(let i=0;i<24;i++)g.fillRect(i*20,0,8,H);
 g.strokeStyle=gold(g,0,0,W,H);g.lineWidth=6;rr(g,3,3,W-6,H-6,12);g.stroke();
 /* marquee panel */
 g.fillStyle='#1a0602';rr(g,14,8,452,66,8);g.fill();g.strokeStyle=gold(g,14,8,466,74);g.lineWidth=3;rr(g,14,8,452,66,8);g.stroke();
 g.font='bold 36px Georgia,serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='rgba(0,0,0,.7)';g.fillText('FRUITY FORTUNE',W/2+2,44);g.fillStyle=gold(g,0,24,0,60);g.fillText('FRUITY FORTUNE',W/2,41);
 g.fillStyle='#fff';g.globalAlpha=.5+.5*Math.sin(t*6);for(const[sx,sy]of[[110,30],[372,52],[330,28]]){g.fillRect(sx-5,sy-.7,10,1.4);g.fillRect(sx-.7,sy-5,1.4,10)}g.globalAlpha=1;
 const bulbs=[];for(let i=0;i<19;i++){bulbs.push([24+i*24,18],[24+i*24,64])}for(let i=0;i<3;i++){bulbs.push([22,28+i*14],[458,28+i*14])}
 bulbs.forEach((b,i)=>{const on=((i>>1)+Math.floor(t*6))%3===0;g.fillStyle=on?'#fff6a0':'#5a3a10';g.beginPath();g.arc(b[0],b[1],3.6,0,6.3);g.fill();if(on){g.fillStyle='rgba(255,240,150,.25)';g.beginPath();g.arc(b[0],b[1],8,0,6.3);g.fill()}});
 /* reel window */
 const winL=S.win>0&&!S.busy,sy=S.idx.map(i=>SLSTRIP[i]),wr=[0,0,0];if(winL){if(sy[0]===sy[1]&&sy[1]===sy[2])wr[0]=wr[1]=wr[2]=1;else sy.forEach((s,i)=>{if(s===0)wr[i]=1})}
 g.fillStyle='#0c0404';rr(g,30,88,420,186,10);g.fill();g.strokeStyle=S.flash>0&&((t*8)|0)%2?'#fff':gold(g,30,88,450,274);g.lineWidth=5;rr(g,30,88,420,186,10);g.stroke();
 for(let i=0;i<3;i++){const rx=52+i*130,rw=116,p=S.pos[i],v=q.sp[i],blur=cl((v-6)/18,0,1);g.save();g.beginPath();g.rect(rx,100,rw,162);g.clip();
  const bgr=g.createLinearGradient(rx,0,rx+rw,0);bgr.addColorStop(0,'#e8e0c8');bgr.addColorStop(.5,'#fffaf0');bgr.addColorStop(1,'#e8e0c8');g.fillStyle=bgr;g.fillRect(rx,100,rw,162);
  if(wr[i]){g.fillStyle='rgba(255,220,80,'+(.35+.25*Math.sin(t*10))+')';g.fillRect(rx,100,rw,162)}
  for(let j=Math.floor(p)-3;j<=Math.floor(p)+4;j++){const off=(j-p),y=181+off*62,sc=Math.max(.38,Math.cos(cl(off*.4,-1.2,1.2))),pul=wr[i]&&Math.abs(off)<.5?1+.12*Math.sin(t*10):1;
   const draw=(dy,al)=>{g.globalAlpha=al;g.save();g.translate(rx+rw/2,y+dy);g.scale(pul,sc*pul);drawSym(g,SLSTRIP[slmod(j)],0,0,25);g.restore()};
   if(blur>0){draw(-blur*22,.3);draw(blur*22,.3);draw(0,1-blur*.55)}else draw(0,1)}
  g.globalAlpha=1;if(blur>0){g.fillStyle='rgba(255,255,255,'+blur*.18+')';for(let k=0;k<6;k++)g.fillRect(rx,100+((t*900+k*31+i*70)%162),rw,2)}
  let sh=g.createLinearGradient(0,100,0,262);sh.addColorStop(0,'rgba(0,0,0,.7)');sh.addColorStop(.28,'rgba(0,0,0,.05)');sh.addColorStop(.5,'rgba(255,255,255,.08)');sh.addColorStop(.72,'rgba(0,0,0,.05)');sh.addColorStop(1,'rgba(0,0,0,.7)');g.fillStyle=sh;g.fillRect(rx,100,rw,162);g.restore();
  g.strokeStyle='#201008';g.lineWidth=3;g.strokeRect(rx,100,rw,162);g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=1;g.strokeRect(rx+2,102,rw-4,158);
  if(S.hold[i]&&S.holdLit){g.fillStyle='#ffd840';rr(g,rx+rw/2-26,243,52,16,5);g.fill();g.fillStyle='#4a2a00';g.font='bold 12px monospace';g.fillText('HELD',rx+rw/2,251.5)}}
 /* glass reflection */
 g.save();g.beginPath();rr(g,32,90,416,182,8);g.clip();g.fillStyle='rgba(255,255,255,.07)';g.beginPath();g.moveTo(32,90);g.lineTo(220,90);g.lineTo(110,272);g.lineTo(32,272);g.fill();g.restore();
 /* payline */
 const pg=.55+.25*Math.sin(t*4)+(winL?.3:0);g.strokeStyle='rgba(255,40,40,'+pg+')';g.lineWidth=winL?3:2;g.shadowColor='#f22';g.shadowBlur=winL?12:4;g.beginPath();g.moveTo(40,181);g.lineTo(440,181);g.stroke();g.shadowBlur=0;
 g.fillStyle='#f01818';for(const sd of[-1,1]){const x=sd<0?34:446;g.beginPath();g.moveTo(x,170);g.lineTo(x-sd*-12,181);g.lineTo(x,192);g.fill()}
 /* paytable */
 g.fillStyle='#1a0602';rr(g,14,282,452,70,8);g.fill();g.strokeStyle=gold(g,14,282,466,352);g.lineWidth=2;rr(g,14,282,452,70,8);g.stroke();
 for(let k=5;k>=0;k--){const x=48+(5-k)*76,hit=winL&&sy[0]===k&&sy[1]===k&&sy[2]===k;if(hit){g.fillStyle='rgba(255,220,80,'+(.2+.15*Math.sin(t*10))+')';g.fillRect(x-34,286,68,62)}drawSym(g,k,x,305,13);g.fillStyle=k>=4?'#ffd840':'#ffe890';g.font='bold 15px monospace';g.textAlign='center';g.fillText('×'+SLPAY[k]*S.stake,x,330)}
 g.fillStyle='#e8c8a0';g.font='bold 11px monospace';g.fillText('3 THE SAME PAYS · ANY 2 CHERRIES = STAKE BACK',W/2,346);
 /* message */
 g.font='bold 24px monospace';const mc=S.win>0?(Math.floor(t*6)%2?'#ffd840':'#fff'):'#ffe0a0';g.fillStyle='rgba(0,0,0,.6)';g.fillText(S.msg||'',W/2+2,376);g.fillStyle=mc;g.fillText(S.msg||'',W/2,374);
 /* lamps */
 const lamp=(x,on,col,txt,al)=>{g.fillStyle=on?col:'#3a2020';g.beginPath();g.arc(x,82,5,0,6.3);g.fill();if(on){g.fillStyle=col+'44';g.beginPath();g.arc(x,82,11,0,6.3);g.fill()}g.fillStyle=on?'#fff':'#8a6a6a';g.font='bold 11px monospace';g.textAlign=al;g.fillText(txt,al==='left'?x+10:x-10,83)};
 lamp(26,S.holdLit&&!S.busy,'#40ff60','HOLD','left');lamp(454,S.nudgeLit&&!S.busy,'#ffd040','NUDGE','right');g.textAlign='center';
 /* coins */
 for(let i=q.pts.length-1;i>=0;i--){const p=q.pts[i];p.l-=dt;if(p.l<=0||p.y>H+20){q.pts.splice(i,1);continue}p.vy+=420*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;if(p.y>300&&p.vy>0&&p.b<2){p.vy*=-.45;p.b++}coin(g,p.x,p.y,p.r,p.rot)}
 if(q.flashG>0){q.flashG-=dt*1.4;g.fillStyle='rgba(255,230,120,'+Math.max(0,q.flashG)*.35+')';g.fillRect(0,0,W,H)}};

/* ================= SCRATCH CARDS ================= */
function xq(S){return S._x||(S._x={pts:[],cur:null,conf:0,t:0})}
scrBase=function(hl){const S=SCR,g=S.bg,W=330,H=340,gd=S.stake>1,P=SCP;
 let gr=g.createLinearGradient(0,0,W,H);if(gd){gr.addColorStop(0,'#f8e070');gr.addColorStop(.5,'#d8a820');gr.addColorStop(1,'#a87808')}else{gr.addColorStop(0,'#62d474');gr.addColorStop(.5,'#2e9a4a');gr.addColorStop(1,'#146a30')}g.fillStyle=gr;g.fillRect(0,0,W,H);
 g.fillStyle='rgba(255,255,255,.10)';for(let i=0;i<18;i++){g.save();g.translate(i*26-60,0);g.rotate(.35);g.fillRect(0,-20,10,H*1.4);g.restore()}
 /* clover / star wallpaper */
 for(let i=0;i<26;i++){const x=rnd(i)*W,y=rnd(i+50)*H;g.globalAlpha=.12;drawSym(g,gd?7:6,x,y,9+rnd(i+9)*6)}g.globalAlpha=1;
 /* ribbon header */
 const ink=gd?'#5a3a00':'#0e4a22';g.fillStyle='rgba(0,0,0,.28)';rr(g,12,10,W-24,58,8);g.fill();g.fillStyle=gd?'#fff2b0':'#fdfbe8';rr(g,10,6,W-20,56,8);g.fill();g.strokeStyle=ink;g.lineWidth=2;rr(g,14,10,W-28,48,6);g.stroke();
 g.textAlign='center';g.textBaseline='middle';g.fillStyle=ink;g.font='bold 28px Georgia,serif';g.fillText(gd?'GOLDEN TICKET':'LUCKY CLOVER',W/2,31);
 g.font='bold 11px monospace';g.fillText('FIND 3 THE SAME TO WIN!',W/2,52);drawSym(g,gd?7:6,32,34,13);drawSym(g,gd?7:6,W-32,34,13);
 g.fillStyle=gd?'#7a1a00':'#fff';g.font='bold 15px monospace';g.fillText('£'+S.stake+' TICKET',W/2,78);
 /* panels */
 P.forEach((p,i)=>{const win=hl&&hl.includes(i);g.fillStyle='rgba(0,0,0,.3)';rr(g,p[0]+2,p[1]+3,p[2],p[3],8);g.fill();
  const pg=g.createLinearGradient(0,p[1],0,p[1]+p[3]);pg.addColorStop(0,win?'#fff6c0':'#fffdf0');pg.addColorStop(1,win?'#ffe070':'#efe8cc');g.fillStyle=pg;rr(g,p[0],p[1],p[2],p[3],8);g.fill();
  if(win){g.save();g.shadowColor='#ffd23a';g.shadowBlur=14;g.strokeStyle='#ff9a10';g.lineWidth=4;rr(g,p[0],p[1],p[2],p[3],8);g.stroke();g.restore()}else{g.strokeStyle='rgba(0,0,0,.28)';g.lineWidth=2;rr(g,p[0],p[1],p[2],p[3],8);g.stroke()}
  drawSym(g,SCSYM[S.card.a[i]],p[0]+p[2]/2,p[1]+p[3]/2,30*(win?1.08:1))});
 /* prize table */
 g.fillStyle='rgba(0,0,0,.4)';rr(g,8,280,314,54,8);g.fill();g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=1.5;rr(g,8,280,314,54,8);g.stroke();
 g.fillStyle='#fff';g.font='bold 8px monospace';g.fillText('3 MATCHING SYMBOLS WIN',W/2,288);
 SCSYM.forEach((s,i)=>{const x=30+i*45;drawSym(g,s,x,306,10);g.fillStyle=i>=5?'#ffe27a':'#fff';g.font='bold 12px monospace';g.fillText('£'+SCPR[i]*S.stake,x,324)});
 /* perforated edge */
 g.fillStyle='#14100a';for(let i=0;i<=W/14;i++){g.beginPath();g.arc(i*14+4,0,4,0,6.3);g.fill();g.beginPath();g.arc(i*14+4,H,4,0,6.3);g.fill()}for(let i=0;i<=H/14;i++){g.beginPath();g.arc(0,i*14+4,4,0,6.3);g.fill();g.beginPath();g.arc(W,i*14+4,4,0,6.3);g.fill()}};

function foil(S){const g=S.sg;g.globalCompositeOperation='source-over';g.clearRect(0,0,330,340);
 SCP.forEach((p,pi)=>{const gr=g.createLinearGradient(p[0],p[1],p[0]+p[2],p[1]+p[3]);gr.addColorStop(0,'#eceff4');gr.addColorStop(.25,'#aeb4c0');gr.addColorStop(.5,'#dfe3ea');gr.addColorStop(.75,'#9aa0ac');gr.addColorStop(1,'#d4d8e0');g.fillStyle=gr;rr(g,p[0],p[1],p[2],p[3],8);g.fill();
  g.save();rr(g,p[0],p[1],p[2],p[3],8);g.clip();
  g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=1;for(let i=0;i<34;i++){const y=p[1]+rnd(pi*100+i)*p[3];g.beginPath();g.moveTo(p[0],y);g.lineTo(p[0]+p[2],y+(rnd(pi*100+i+50)-.5)*8);g.stroke()}
  g.fillStyle='rgba(0,0,0,.08)';for(let i=0;i<70;i++)g.fillRect(p[0]+rnd(pi*300+i)*p[2],p[1]+rnd(pi*300+i+150)*p[3],1.5,1.5);
  g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.moveTo(p[0]+p[2]*.15,p[1]);g.lineTo(p[0]+p[2]*.4,p[1]);g.lineTo(p[0]+p[2]*.1,p[1]+p[3]);g.lineTo(p[0],p[1]+p[3]);g.lineTo(p[0],p[1]+p[3]*.6);g.fill();g.restore();
  g.fillStyle='rgba(70,76,92,.6)';g.font='bold 13px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText('SCRATCH',p[0]+p[2]/2,p[1]+p[3]/2+8);drawSym(g,6,p[0]+p[2]/2,p[1]+p[3]/2-14,9);
  g.strokeStyle='rgba(60,66,80,.55)';g.lineWidth=1.5;rr(g,p[0]+1,p[1]+1,p[2]-2,p[3]-2,8);g.stroke()})}

const so0=scrOpen;
scrOpen=function(stake){const before=SCR;so0(stake);const S=SCR;if(!S||S===before)return;const q=xq(S);foil(S);
 const fx=document.createElement('canvas');fx.width=330;fx.height=340;fx.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none';S.sc.parentNode.append(fx);const g=fx.getContext('2d');q.fx=fx;let lt=performance.now();
 const track=e=>{const b=S.sc.getBoundingClientRect();q.cur=[(e.clientX-b.left)*330/b.width,(e.clientY-b.top)*340/b.height]};
 S.sc.addEventListener('pointerdown',track);S.sc.addEventListener('pointermove',e=>{if(S.last)track(e)});S.sc.addEventListener('pointerup',()=>{q.cur=null});S.sc.addEventListener('pointercancel',()=>{q.cur=null});
 const loop=now=>{if(SCR!==S)return;const dt=Math.min(.05,(now-lt)/1000);lt=now;g.clearRect(0,0,330,340);
  for(let i=q.pts.length-1;i>=0;i--){const p=q.pts[i];p.l-=dt;if(p.l<=0||p.y>350){q.pts.splice(i,1);continue}p.vy+=(p.conf?90:380)*dt;p.x+=p.vx*dt+(p.conf?Math.sin(p.l*5+p.r)*20*dt:0);p.y+=p.vy*dt;p.rot+=p.vr*dt;g.save();g.translate(p.x,p.y);g.rotate(p.rot);g.globalAlpha=cl(p.l*2,0,1);g.fillStyle=p.c;g.fillRect(-p.r,-p.r*.5,p.r*2,p.r)  ;g.restore()}g.globalAlpha=1;
  if(q.cur&&!S.done){g.save();g.translate(q.cur[0]+10,q.cur[1]+10);g.rotate(.5);g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(3,4,17,17,0,0,6.3);g.fill();g.fillStyle='#b8860b';g.beginPath();g.arc(0,0,17,0,6.3);g.fill();g.fillStyle='#f6d040';g.beginPath();g.arc(0,0,14.5,0,6.3);g.fill();g.strokeStyle='#c89a1a';g.lineWidth=2;g.beginPath();g.arc(0,0,10,0,6.3);g.stroke();g.fillStyle='#fff6b0';g.font='bold 14px Georgia';g.textAlign='center';g.textBaseline='middle';g.fillText('£',0,1);g.restore()}
  requestAnimationFrame(loop)};requestAnimationFrame(loop)};

const ss0=scrScr;
scrScr=function(a,b){ss0(a,b);const S=SCR;if(!S)return;const q=xq(S);if(Math.random()<.7)q.pts.push({x:b[0],y:b[1],vx:(Math.random()-.5)*110,vy:-30-Math.random()*50,r:1.6+Math.random()*2,rot:Math.random()*6,vr:(Math.random()-.5)*12,l:.5+Math.random()*.4,c:Math.random()<.5?'#d8dce4':'#9aa0ac'})};

const sf0=scrFin;
scrFin=function(){const S=SCR,was=S&&S.done;sf0();if(!S||was)return;const q=xq(S);q.cur=null;if(S.res&&/WIN/.test(S.res.textContent)){const C=['#ffd23a','#ff5a5a','#5ac8ff','#7aff7a','#ff9af0','#fff'];for(let i=0;i<90;i++)q.pts.push({conf:1,x:Math.random()*330,y:-10-Math.random()*120,vx:(Math.random()-.5)*50,vy:20+Math.random()*60,r:2.5+Math.random()*2.5,rot:Math.random()*6,vr:(Math.random()-.5)*10,l:2.5+Math.random()*1.5,c:C[i%6]})}};
})();
