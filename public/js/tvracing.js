/* ===== Betting-office TV: broadcast-style horse + greyhound racing =====
   Replaces bkTvRace (coloured blobs sliding along lanes) with a side-on tracking camera that follows the pack:
   galloping horses with jockeys in silks, greyhounds in bibs chasing a lure, starting stalls / traps, rails, stands full of
   crowd, ad boards, finish post, live running order and results.  Every position is a pure function of (race, time) built from
   the same bkProg() / runner.T values as before, so the finishing order still matches what bets are settled on. */
(function(){
const HC=['#6a3a1a','#3a2412','#8a5a2a','#262626','#a07040','#c8b090'];
const DC=['#c8a070','#2a2a2e','#f0f0f0','#8a8a92','#8a4a22','#b0b0b8'];
const BIBT=['#fff','#fff','#222','#fff','#222','#fff'];
const SKIN='#f0c8a0',CROWD=['#c83030','#2850c8','#e8e8e8','#e8c828','#3a3a44','#28a060','#d87820','#9a4ab8','#f0a0a0','#6a8ad8'];
const ADS=[['LUCKY BETS','#d02020','#fff'],['COZY TOWN','#18407a','#ffe040'],["FRANKIE'S",'#f0c020','#222'],['NEON ARCADE','#6a20a8','#ff90f0'],['BULLSEYE','#1a5a2a','#ffe040'],['COZY KARTS','#222','#ffd23a'],['THREADS','#2a8a8a','#fff'],['VILLAGE BREW','#7a4a20','#fff']];
const hh=n=>{n=Math.imul(n^n>>>15,2246822519);n=Math.imul(n^n>>>13,3266489917);return((n^n>>>16)>>>0)/4294967296};
const ss=x=>{x=x<0?0:x>1?1:x;return x*x*(3-2*x)};

function drawRace(g,w,h,st,k){
 const ev=st.ev,C=st.C,dog=st.c===1,f=h/360,rs=ev.runners;
 const LT=dog?260:420,V=dog?40:46,sx=w/V,stride=dog?4.2:6.0,RO=.5,FIN=dog?.9:1.5;
 const t=st.ph===0?0:st.ph===1?st.tl:C.live+st.tl;
 const X=(x,tt)=>tt<x.T?bkProg(x,tt)*LT:LT+LT/x.T*RO*(1-Math.exp(-(tt-x.T)/RO));
 const xs=rs.map(r=>X(r,t)),sp=rs.map((r,i)=>(X(r,t+.06)-xs[i])/.06);
 let lead=0,mean=0,li=0;xs.forEach((v,i)=>{mean+=v/6;if(v>lead||i===0){lead=v;li=i}});
 const cx=Math.max(-V*.35,Math.min(lead*.55+mean*.45-V*.58,LT-V*.64));
 const SX=wx=>(wx-cx)*sx;
 const Y0=130*f,Y1=300*f,laneY=i=>(152+i*26)*f,lsc=i=>1+i*.045;
 /* ---- sky, hills, stands ---- */
 let gr=g.createLinearGradient(0,0,0,128*f);
 if(dog){gr.addColorStop(0,'#070b24');gr.addColorStop(1,'#1c2a58')}else{gr.addColorStop(0,'#6fb4ee');gr.addColorStop(1,'#d4ecff')}
 g.fillStyle=gr;g.fillRect(0,0,w,Y0);
 if(dog){g.fillStyle='#fff';for(let i=0;i<26;i++){g.globalAlpha=.4+.6*hh(i+9);g.fillRect(hh(i*3)*w,hh(i*7+1)*60*f,1.4*f,1.4*f)}g.globalAlpha=1}
 else{g.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<5;i++){const cxp=((hh(i)*w*2-cx*sx*.05)%(w*1.4)+w*1.4)%(w*1.4)-w*.2,cyp=(20+hh(i+4)*26)*f;g.beginPath();g.ellipse(cxp,cyp,30*f,7*f,0,0,7);g.ellipse(cxp+14*f,cyp-4*f,18*f,6*f,0,0,7);g.fill()}
  g.fillStyle='#4a7e4a';g.beginPath();g.moveTo(0,Y0);for(let x=0;x<=w;x+=10){const wx=x+cx*sx*.12;g.lineTo(x,Y0-(34+14*Math.sin(wx*.013)+8*Math.sin(wx*.047))*f)}g.lineTo(w,Y0);g.fill();
  g.fillStyle='#3a6a3c';for(let x=0;x<w;x+=14){const wx=x+cx*sx*.12;if(hh(Math.floor(wx/14))<.5){const th=(34+14*Math.sin(wx*.013)+8*Math.sin(wx*.047)),y=Y0-th*f;g.beginPath();g.arc(x,y,6*f,0,7);g.fill()}}}
 /* stand: back wall, roof, crowd (parallax) */
 g.fillStyle=dog?'#262a3c':'#6a6a74';g.fillRect(0,80*f,w,48*f);
 g.fillStyle=dog?'#12142a':'#9a2a2a';g.fillRect(0,70*f,w,10*f);g.fillStyle=dog?'#3a3e58':'#c8c8d0';g.fillRect(0,68*f,w,2.5*f);
 const par=cx*sx*.45,cs=7*f;
 for(let row=0;row<6;row++){const y=86*f+row*7*f,j0=Math.floor((par-row*3)/cs);for(let j=0;j<=w/cs+1;j++){const id=j0+j,hx=hh(id*13+row*101+7);
   const bob=st.ph===1&&t>C.live*.6?Math.sin(t*9+id)*1.1*f*(hx>.5?1:0):0;
   g.fillStyle=CROWD[Math.floor(hx*CROWD.length)];g.fillRect(id*cs-par+row*3,y+bob,4.2*f,5*f);g.fillStyle=SKIN;g.fillRect(id*cs-par+row*3+1*f,y-2.2*f+bob,2.2*f,2.2*f)}}
 g.fillStyle='rgba(0,0,0,.28)';g.fillRect(0,122*f,w,6*f);
 if(dog){/* floodlights */for(let i=-2;i<8;i++){const wx=i*30*sx;const px=((wx-cx*sx*.3)%(w+240*f)+w+240*f)%(w+240*f)-120*f;g.fillStyle='#2a2e44';g.fillRect(px-1.5*f,24*f,3*f,104*f);g.fillStyle='#fff6c0';g.fillRect(px-8*f,18*f,16*f,7*f);g.fillStyle='rgba(255,246,190,.12)';g.beginPath();g.arc(px,22*f,22*f,0,7);g.fill()}}
 /* ---- track ---- */
 gr=g.createLinearGradient(0,Y0,0,Y1);
 if(dog){gr.addColorStop(0,'#a07c48');gr.addColorStop(1,'#d2b078')}else{gr.addColorStop(0,'#256a2e');gr.addColorStop(1,'#3a9444')}
 g.fillStyle=gr;g.fillRect(0,Y0,w,Y1-Y0);
 const band=dog?7:12;for(let b=Math.floor(cx/band)-1;b<=Math.ceil((cx+V)/band);b++){if(b&1){g.fillStyle=dog?'rgba(255,240,200,.12)':'rgba(255,255,255,.07)';g.fillRect(SX(b*band),Y0,band*sx,Y1-Y0)}}
 for(let i=0;i<6;i++){g.fillStyle=i&1?'rgba(0,0,0,.05)':'rgba(255,255,255,.03)';g.fillRect(0,laneY(i)-13*f,w,26*f)}
 if(dog){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,(128)*f,w,6*f)}
 /* start line, furlong posts, finish */
 const stripe=(wx,ww,n)=>{const x=SX(wx);if(x<-30||x>w+30)return;const hgt=(Y1-Y0)/n;for(let i=0;i<n;i++){g.fillStyle=i&1?'#111':'#f4f4f4';g.fillRect(x,Y0+i*hgt,ww*sx,hgt)}};
 g.fillStyle='rgba(255,255,255,.55)';g.fillRect(SX(0)-.12*sx,Y0,.24*sx,Y1-Y0);
 for(let d=LT/6;d<LT-1;d+=LT/6){const x=SX(d);if(x>-10&&x<w+10){g.fillStyle='rgba(255,255,255,.25)';g.fillRect(x,Y0,1.5*f,Y1-Y0);g.fillStyle='#fff';g.font='bold '+(8*f)+'px monospace';g.textAlign='center';g.fillText(Math.round(LT-d)+'m',x,Y1-3*f)}}
 stripe(LT,1.1,14);
 if(SX(LT)>-40&&SX(LT)<w+40){const x=SX(LT);g.fillStyle='#e8e8e8';g.fillRect(x-1.2*f,Y0-26*f,2.4*f,28*f);g.fillStyle='#111';g.fillRect(x-14*f,Y0-30*f,28*f,9*f);g.fillStyle='#ffe040';g.font='bold '+(7*f)+'px monospace';g.textAlign='center';g.fillText('FINISH',x,Y0-23*f)}
 /* far rail */
 g.fillStyle='#f4f4f4';g.fillRect(0,Y0-3*f,w,3*f);
 for(let p=Math.floor(cx/6)-1;p<=Math.ceil((cx+V)/6);p++){g.fillRect(SX(p*6)-1*f,Y0-1*f,2*f,-9*f)}
 g.fillStyle='#f4f4f4';g.fillRect(0,Y0-9*f,w,2*f);
 /* ---- lure hare on the rail (dogs) ---- */
 if(dog&&st.ph>0){const hx=SX(Math.min(lead+11,LT+24)),hy=Y0-13*f,b=Math.abs(Math.sin(t*14))*3*f*(st.ph===1?1:0);g.fillStyle='#8a5a30';g.beginPath();g.ellipse(hx,hy-b,6*f,3*f,0,0,7);g.fill();g.beginPath();g.ellipse(hx+5*f,hy-b-2*f,2.6*f,1.8*f,0,0,7);g.fill();g.fillRect(hx+3*f,hy-b-9*f,1.6*f,7*f);g.fillStyle='#fff';g.fillRect(hx-7*f,hy-b-1.5*f,2*f,2*f)}
 /* ---- starting stalls / traps (back) ---- */
 const gates=st.ph===0||(st.ph===1&&t<.7);
 const sw=dog?3.0:4.4,sh=dog?1.15:2.9;
 if(gates)for(let i=0;i<6;i++){const u=sx*lsc(i),y=laneY(i)+4*f,x=SX(-sw+.3);g.fillStyle='rgba(20,20,26,.78)';g.fillRect(x,y-sh*u,sw*sx,sh*u);g.fillStyle='#4a4a56';g.fillRect(x,y-sh*u-3*f,sw*sx,3*f);
  g.fillStyle=dog?BKDC[i]:BKCOL[i];g.fillRect(x+sw*sx*.3,y-sh*u-10*f,14*f,8*f);g.fillStyle=dog?BIBT[i]:'#fff';g.font='bold '+(7*f)+'px monospace';g.textAlign='center';g.fillText(i+1,x+sw*sx*.3+7*f,y-sh*u-3.5*f)}
 /* ---- runners (far lane to near lane) ---- */
 const sprite=(i)=>{const r=rs[i],u=sx*lsc(i)*(dog?1.35:1),yb=laneY(i)+4*f,moving=sp[i]>3,amp=Math.min(1,sp[i]/9),
   ph=(xs[i]/stride)*6.2832+i,fx=SX(xs[i]),cxs=fx-(dog?.9:1.55)*u*.5/(sx/(sx))*(1),
   body=Math.sin(ph*2)*.06*u*amp*(dog?1.7:1),by=yb+body-Math.abs(Math.sin(ph))*0;
   const ox=fx-(dog?1.0:1.65)*u;
   /* shadow */g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(ox,yb-1*f,(dog?.8:1.2)*u,(dog?.12:.2)*u,0,0,7);g.fill();
   const P=(pts,col)=>{g.fillStyle=col;g.beginPath();pts.forEach((q,n)=>n?g.lineTo(ox+q[0]*u,by+q[1]*u):g.moveTo(ox+q[0]*u,by+q[1]*u));g.closePath();g.fill()};
   const E=(ex,ey,rx,ry,col,rot)=>{g.fillStyle=col;g.beginPath();g.ellipse(ox+ex*u,by+ey*u,rx*u,ry*u,rot||0,0,7);g.fill()};
   const leg=(hx,hy,off,col,L1,L2,wd)=>{const a1=Math.sin(ph+off)*.95*amp,a2=a1-.85*Math.max(0,Math.sin(ph+off+1.5))*amp-.08;
     const kx=hx+Math.sin(a1)*L1,ky=hy+Math.cos(a1)*L1,fx2=kx+Math.sin(a2)*L2,fy2=ky+Math.cos(a2)*L2;
     g.strokeStyle=col;g.lineCap='round';g.lineWidth=wd*u;g.beginPath();g.moveTo(ox+hx*u,by+hy*u);g.lineTo(ox+kx*u,by+ky*u);g.lineTo(ox+fx2*u,by+fy2*u);g.stroke();
     g.fillStyle='#1a1a1a';g.fillRect(ox+(fx2-.06)*u,by+(fy2-.04)*u,.18*u,.1*u)};
   const dim=c=>c;
   if(dog){const coat=DC[i],dk='rgba(0,0,0,.35)';
    leg(.45,-.5,.45,coat,.38,.4,.1);leg(-.4,-.55,Math.PI*.9+.45,coat,.4,.4,.11);
    E(.05,-.66,.62,.2,coat,-.04);E(.36,-.6,.3,.25,coat,0);E(-.34,-.6,.26,.17,coat,.1);
    P([[.55,-.85],[.82,-.88],[1.12,-.7],[1.14,-.62],[.88,-.64],[.58,-.7]],coat);P([[1.0,-.72],[1.16,-.68],[1.15,-.6],[1.0,-.62]],'#1a1a1c');
    P([[.7,-.88],[.78,-1.0],[.84,-.88]],coat);
    g.strokeStyle=coat;g.lineWidth=.07*u;g.lineCap='round';g.beginPath();g.moveTo(ox-.55*u,by-.72*u);g.quadraticCurveTo(ox-1.05*u,by-.62*u,ox-1.2*u,by-.88*u+Math.sin(ph)*.06*u);g.stroke();
    leg(.62,-.46,0,coat,.38,.4,.1);leg(-.52,-.5,Math.PI*.9,coat,.4,.4,.11);
    g.fillStyle=DC[i]==='#2a2a2e'?'rgba(255,255,255,.15)':dk;g.fillRect(ox+.1*u,by-.78*u,.5*u,.05*u);
    /* bib */g.fillStyle=BKDC[i];g.fillRect(ox+.0*u,by-.82*u,.42*u,.34*u);if(i===5){g.fillStyle='#222';for(let s=0;s<3;s++)g.fillRect(ox+.0*u,by-.78*u+s*.1*u,.42*u,.05*u)}
    g.fillStyle=BIBT[i];g.font='bold '+(.3*u)+'px monospace';g.textAlign='center';g.fillText(i+1,ox+.21*u,by-.55*u);
    /* eye */g.fillStyle='#fff';g.fillRect(ox+.86*u,by-.82*u,.05*u,.05*u)}
   else{const coat=HC[i],mane=coat==='#c8b090'?'#6a5a40':'#1a1008',silk=BKCOL[i];
    leg(.85,-1.05,.5,coat,.62,.6,.15);leg(-.75,-1.1,Math.PI*.9+.5,coat,.62,.6,.17);
    E(0,-1.3,1.05,.46,coat,-.04);E(.78,-1.3,.34,.4,coat,0);E(-.78,-1.35,.4,.42,coat,0);
    P([[.72,-1.55],[1.2,-2.12],[1.42,-2.12],[1.0,-1.35]],coat);P([[1.28,-2.25],[1.95,-1.9],[1.97,-1.72],[1.55,-1.7],[1.3,-1.95]],coat);
    P([[1.3,-2.25],[1.38,-2.45],[1.46,-2.2]],coat);
    g.strokeStyle=mane;g.lineWidth=.12*u;g.beginPath();g.moveTo(ox+.8*u,by-1.7*u);g.lineTo(ox+1.28*u,by-2.2*u);g.stroke();
    g.strokeStyle=mane;g.lineWidth=.16*u;g.beginPath();g.moveTo(ox-1.0*u,by-1.45*u);g.quadraticCurveTo(ox-1.7*u,by-1.4*u+Math.sin(ph)*.1*u,ox-1.85*u,by-.9*u+Math.sin(ph+1)*.12*u);g.stroke();
    g.fillStyle='#111';g.fillRect(ox+1.55*u,by-2.06*u,.07*u,.07*u);
    leg(1.0,-1.0,0,coat,.62,.6,.15);leg(-.9,-1.05,Math.PI*.9,coat,.62,.6,.17);
    g.fillStyle='#fff';g.fillRect(ox-.35*u,by-1.62*u,.7*u,.4*u);g.fillStyle='#111';g.font='bold '+(.34*u)+'px monospace';g.textAlign='center';g.fillText(i+1,ox,by-1.3*u);
    g.fillStyle=silk;g.fillRect(ox-.4*u,by-1.0*u,.8*u,.1*u);
    /* jockey */
    const jb=Math.sin(ph*2+.5)*.04*u*amp;
    g.strokeStyle='#f4f4f4';g.lineWidth=.16*u;g.beginPath();g.moveTo(ox-.1*u,by-1.65*u);g.lineTo(ox+.15*u,by-1.35*u);g.lineTo(ox+.05*u,by-1.1*u);g.stroke();
    g.strokeStyle=silk;g.lineWidth=.5*u;g.lineCap='round';g.beginPath();g.moveTo(ox-.15*u,by-1.8*u+jb);g.lineTo(ox+.6*u,by-2.35*u+jb);g.stroke();
    g.strokeStyle=r.num%2?'#f4f4f4':'#ffe040';g.lineWidth=.12*u;g.beginPath();g.moveTo(ox+.15*u,by-1.95*u+jb);g.lineTo(ox+.35*u,by-2.15*u+jb);g.stroke();
    g.strokeStyle=silk;g.lineWidth=.14*u;g.beginPath();g.moveTo(ox+.5*u,by-2.25*u+jb);g.lineTo(ox+1.15*u,by-1.95*u);g.stroke();
    g.fillStyle=SKIN;g.beginPath();g.arc(ox+.78*u,by-2.55*u+jb,.17*u,0,7);g.fill();
    g.fillStyle=silk;g.beginPath();g.arc(ox+.78*u,by-2.6*u+jb,.19*u,Math.PI,0);g.fill();g.fillStyle='#111';g.fillRect(ox+.8*u,by-2.62*u+jb,.22*u,.05*u)}
   /* dust */
   if(moving&&sp[i]>6){for(let n=0;n<4;n++){const a=((ph/6.2832)*1.5+n*.25)%1;g.fillStyle=dog?'rgba(230,200,150,'+(.35*(1-a))+')':'rgba(190,170,120,'+(.3*(1-a))+')';g.beginPath();g.arc(ox-(dog?.9:1.5)*u-a*u*1.6,yb-.12*u-a*.5*u,(.14+a*.3)*u,0,7);g.fill()}}
   return{x:ox,y:yb,u}};
 for(let i=0;i<6;i++)sprite(i);
 /* trap/stall front bars */
 if(gates)for(let i=0;i<6;i++){const u=sx*lsc(i),y=laneY(i)+4*f,x=SX(-sw+.3);g.fillStyle='rgba(170,170,180,.7)';for(let b=0;b<=6;b++)g.fillRect(x+sw*sx*(b/6)-.5*f,y-sh*u,1*f,sh*u);g.fillRect(x,y-sh*u,sw*sx,1.5*f)}
 /* near rail + ad boards */
 g.fillStyle='#f4f4f4';g.fillRect(0,Y1,w,3*f);g.fillStyle='#d0d0d8';g.fillRect(0,Y1+3*f,w,2*f);
 for(let p=Math.floor(cx/6)-1;p<=Math.ceil((cx+V)/6);p++){g.fillStyle='#f4f4f4';g.fillRect(SX(p*6)-1.2*f,Y1-12*f,2.4*f,12*f)}
 g.fillStyle='#f4f4f4';g.fillRect(0,Y1-12*f,w,2*f);
 const bw=14;for(let b=Math.floor(cx/bw)-1;b<=Math.ceil((cx+V)/bw);b++){const ad=ADS[((b%ADS.length)+ADS.length)%ADS.length],x=SX(b*bw);g.fillStyle=ad[1];g.fillRect(x,Y1+5*f,bw*sx-1.5*f,28*f);g.fillStyle=ad[2];g.font='bold '+(11*f)+'px Georgia,serif';g.textAlign='center';g.fillText(ad[0],x+bw*sx/2,Y1+24*f)}
 /* ---- overlays ---- */
 const order=rs.map((r,i)=>i).sort((a,b)=>xs[b]-xs[a]);
 g.fillStyle='rgba(8,16,40,.92)';g.fillRect(0,0,w,26*f);g.fillStyle='#ffd840';g.font='bold '+(14*f)+'px monospace';g.textAlign='left';g.fillText((dog?'GREYHOUNDS · ':'HORSES · ')+ev.title,8*f,18*f);
 if(st.ph===1){g.fillStyle='#e02020';g.beginPath();g.arc(w-52*f,13*f,4.5*f,0,7);g.fill();g.fillStyle='#fff';g.font='bold '+(11*f)+'px monospace';g.textAlign='left';g.fillText('LIVE',w-44*f,17*f)}
 if(st.ph===1&&t>1){g.textAlign='right';g.fillStyle='#9fe';g.font='bold '+(11*f)+'px monospace';g.fillText(Math.max(0,Math.round(LT-lead))+'m TO GO',w-62*f,17*f);g.textAlign='left'}
 if(st.ph>=1){const bx=6*f,by=32*f;g.fillStyle='rgba(8,16,40,.78)';g.fillRect(bx,by,104*f,12*f+6*13*f);g.font='bold '+(9.5*f)+'px monospace';g.textAlign='left';
  order.forEach((i,pos)=>{const y=by+10*f+pos*13*f,r=rs[i];g.fillStyle=pos===0?'#ffd840':'#fff';g.fillText((pos+1)+'',bx+4*f,y+2*f);g.fillStyle=dog?BKDC[i]:BKCOL[i];g.fillRect(bx+14*f,y-7*f,10*f,10*f);g.fillStyle=dog?BIBT[i]:'#fff';g.font='bold '+(8*f)+'px monospace';g.textAlign='center';g.fillText(r.num,bx+19*f,y+1*f);g.textAlign='left';g.font='bold '+(9.5*f)+'px monospace';g.fillStyle=pos===0?'#ffd840':'#fff';g.fillText(r.name.slice(0,11),bx+28*f,y+2*f)})}
 /* pre-race odds board */
 if(st.ph===0){const bx=w*.55,by=34*f,bw2=w*.43,bh=6*20*f+20*f;g.fillStyle='rgba(8,16,40,.86)';g.fillRect(bx,by,bw2,bh);g.strokeStyle='#ffd840';g.lineWidth=1.5*f;g.strokeRect(bx,by,bw2,bh);
  g.fillStyle='#ffd840';g.font='bold '+(10*f)+'px monospace';g.textAlign='left';g.fillText('RUNNERS & PRICES',bx+8*f,by+14*f);
  rs.forEach((r,i)=>{const y=by+36*f+i*20*f-2*f;g.fillStyle=dog?BKDC[i]:BKCOL[i];g.fillRect(bx+8*f,y-11*f,14*f,14*f);g.fillStyle=dog?BIBT[i]:'#fff';g.font='bold '+(10*f)+'px monospace';g.textAlign='center';g.fillText(r.num,bx+15*f,y);
   g.textAlign='left';g.fillStyle='#fff';g.fillText(r.name,bx+28*f,y);g.textAlign='right';g.fillStyle='#ffd840';g.fillText(bkFrS(r.fr),bx+bw2-8*f,y)})}
 /* ticker */
 g.fillStyle='#000';g.fillRect(0,334*f,w,26*f);g.fillStyle='#fff';g.font='bold '+(13*f)+'px monospace';g.textAlign='left';
 const lead0=rs[li];let tx;
 if(st.ph===0)tx='OFF IN '+bkClock(st.rem)+' · BETS OPEN';
 else if(st.ph===1)tx=t<1.2?"AND THEY'RE OFF!":(LT-lead<LT*.12?'COMING TO THE LINE... '+lead0.name:lead0.name+' LEADS');
 else tx='RESULT: '+ev.order[0].name+' WINS';
 g.fillText(tx,8*f,352*f);
 if(st.ph===2){g.fillStyle='rgba(8,16,40,.88)';const px=w*.5,py=40*f,pw=w*.48,ph2=84*f;g.fillRect(px,py,pw,ph2);g.strokeStyle='#ffd840';g.lineWidth=1.5*f;g.strokeRect(px,py,pw,ph2);
  g.fillStyle='#ffd840';g.font='bold '+(13*f)+'px monospace';g.fillText('FINAL RESULT',px+10*f,py+17*f);g.font='bold '+(11*f)+'px monospace';
  [0,1,2].forEach(n=>{const x=ev.order[n],y=py+36*f+n*19*f;g.fillStyle=['#ffd840','#d8d8e0','#d89a58'][n];g.fillText((n+1)+'.',px+10*f,y);g.fillStyle=dog?BKDC[x.num-1]:BKCOL[x.num-1];g.fillRect(px+28*f,y-9*f,12*f,12*f);g.fillStyle=dog?BIBT[x.num-1]:'#fff';g.textAlign='center';g.fillText(x.num,px+34*f,y);g.textAlign='left';g.fillStyle='#fff';g.fillText(x.name,px+46*f,y);g.textAlign='right';g.fillStyle='#ffd840';g.fillText(bkFrS(x.fr),px+pw-8*f,y);g.textAlign='left'})}
 /* TV finish: vignette + scanlines */
 g.fillStyle='rgba(0,0,0,.07)';for(let y=0;y<h;y+=3)g.fillRect(0,y,w,1);
 gr=g.createRadialGradient(w/2,h/2,h*.45,w/2,h/2,h*.95);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.35)');g.fillStyle=gr;g.fillRect(0,0,w,h);
 g.textAlign='left'}

const orig=bkTvRace;
bkTvRace=function(g,w,h,st,k){try{drawRace(g,w,h,st,k)}catch(e){if(!bkTvRace._e){bkTvRace._e=1;console.error('tv racing',e)}orig(g,w,h,st,k)}};
})();
