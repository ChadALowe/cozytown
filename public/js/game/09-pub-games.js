/* ---- pub fruit machine, chippy arcade cabinet, newsagent scratch cards ---- */
var SLTS={n:0,won:0,spent:0,best:0},ARXS={hi:0,n:0},SCRS={n:0,won:0,spent:0,best:0},SLT=null,ARX=null,SCR=null;
function ovMk(id,bg){const ov=document.createElement('div');ov.id=id;ov.style.cssText='position:fixed;inset:0;z-index:70;background:'+(bg||'rgba(10,6,12,.97)')+';display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;font:bold 13px monospace;color:#fff;touch-action:none;user-select:none;-webkit-user-select:none;padding:6px;box-sizing:border-box';document.body.appendChild(ov);return ov}
function bt(txt,css,fn){const b=document.createElement('button');b.textContent=txt;b.style.cssText='font:bold 13px monospace;padding:9px 12px;border:3px solid #f5e6a0;border-radius:10px;color:#fff;background:#333;touch-action:manipulation;'+(css||'');b.onclick=fn;return b}
/* shared symbols (0 cherry 1 lemon 2 bell 3 bar 4 seven 5 diamond 6 clover 7 star 8 horseshoe 9 heart) */
function drawSym(g,k,x,y,s){g.save();g.translate(x,y);g.lineJoin='round';g.lineCap='round';
 if(k===0){g.strokeStyle='#3a7a20';g.lineWidth=s*.12;g.beginPath();g.moveTo(-s*.3,s*.25);g.quadraticCurveTo(-s*.1,-s*.5,s*.15,-s*.7);g.moveTo(s*.3,s*.3);g.quadraticCurveTo(s*.3,-s*.4,s*.15,-s*.7);g.stroke();g.fillStyle='#4aa02a';g.beginPath();g.ellipse(s*.35,-s*.62,s*.3,s*.14,-.3,0,7);g.fill();for(const[cx,cy]of[[-s*.3,s*.3],[s*.3,s*.4]]){g.fillStyle='#d01828';g.beginPath();g.arc(cx,cy,s*.33,0,7);g.fill();g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.arc(cx-s*.1,cy-s*.1,s*.09,0,7);g.fill()}}
 else if(k===1){g.rotate(-.35);g.fillStyle='#f4dc2a';g.strokeStyle='#b89a10';g.lineWidth=s*.08;g.beginPath();g.moveTo(-s*.75,0);g.quadraticCurveTo(-s*.5,-s*.55,0,-s*.55);g.quadraticCurveTo(s*.5,-s*.55,s*.75,0);g.quadraticCurveTo(s*.5,s*.55,0,s*.55);g.quadraticCurveTo(-s*.5,s*.55,-s*.75,0);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.ellipse(-s*.1,-s*.25,s*.3,s*.09,0,0,7);g.fill()}
 else if(k===2){g.fillStyle='#f0b820';g.strokeStyle='#9a6a08';g.lineWidth=s*.08;g.beginPath();g.moveTo(-s*.7,s*.45);g.quadraticCurveTo(-s*.5,s*.3,-s*.45,-s*.2);g.quadraticCurveTo(-s*.4,-s*.7,0,-s*.7);g.quadraticCurveTo(s*.4,-s*.7,s*.45,-s*.2);g.quadraticCurveTo(s*.5,s*.3,s*.7,s*.45);g.closePath();g.fill();g.stroke();g.fillStyle='#8a5a10';g.beginPath();g.arc(0,s*.6,s*.16,0,7);g.fill();g.fillStyle='rgba(255,255,255,.5)';g.fillRect(-s*.3,-s*.4,s*.1,s*.4)}
 else if(k===3){g.fillStyle='#14141a';g.strokeStyle='#f0c830';g.lineWidth=s*.1;g.fillRect(-s*.8,-s*.38,s*1.6,s*.76);g.strokeRect(-s*.8,-s*.38,s*1.6,s*.76);g.fillStyle='#f0c830';g.font='bold '+Math.round(s*.6)+'px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('BAR',0,s*.04)}
 else if(k===4){g.font='bold '+Math.round(s*1.7)+'px Arial';g.textAlign='center';g.textBaseline='middle';g.lineWidth=s*.14;g.strokeStyle='#fff';g.strokeText('7',0,s*.05);g.fillStyle='#e01020';g.fillText('7',0,s*.05)}
 else if(k===5){g.fillStyle='#50d8f8';g.strokeStyle='#1a7a9a';g.lineWidth=s*.08;g.beginPath();g.moveTo(-s*.5,-s*.55);g.lineTo(s*.5,-s*.55);g.lineTo(s*.8,-s*.1);g.lineTo(0,s*.75);g.lineTo(-s*.8,-s*.1);g.closePath();g.fill();g.stroke();g.strokeStyle='rgba(255,255,255,.8)';g.beginPath();g.moveTo(-s*.8,-s*.1);g.lineTo(s*.8,-s*.1);g.moveTo(-s*.25,-s*.55);g.lineTo(-s*.1,-s*.1);g.lineTo(0,s*.75);g.stroke()}
 else if(k===6){g.strokeStyle='#2a7a2a';g.lineWidth=s*.12;g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(s*.1,s*.5,s*.35,s*.75);g.stroke();g.fillStyle='#3cb040';for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]]){g.beginPath();g.arc(a*s*.3,b*s*.3,s*.33,0,7);g.fill()}g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.arc(-s*.38,-s*.4,s*.1,0,7);g.fill()}
 else if(k===7){g.fillStyle='#f8d020';g.strokeStyle='#b08808';g.lineWidth=s*.08;g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?s*.35:s*.8;g.lineTo(Math.cos(a)*r,Math.sin(a)*r+s*.05)}g.closePath();g.fill();g.stroke()}
 else if(k===8){g.strokeStyle='#8a929c';g.lineWidth=s*.24;g.beginPath();g.arc(0,s*.05,s*.5,Math.PI*.12,Math.PI*.88,true);g.stroke();g.strokeStyle='#c8d0d8';g.lineWidth=s*.08;g.beginPath();g.arc(0,s*.05,s*.5,Math.PI*.12,Math.PI*.88,true);g.stroke();g.fillStyle='#5a626c';g.fillRect(-s*.62,s*.38,s*.24,s*.18);g.fillRect(s*.38,s*.38,s*.24,s*.18)}
 else if(k===9){g.fillStyle='#e82a4a';g.strokeStyle='#8a1228';g.lineWidth=s*.08;g.beginPath();g.moveTo(0,s*.7);g.bezierCurveTo(-s*1.1,-s*.1,-s*.5,-s*.85,0,-s*.3);g.bezierCurveTo(s*.5,-s*.85,s*1.1,-s*.1,0,s*.7);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.arc(-s*.3,-s*.3,s*.1,0,7);g.fill()}
 g.restore()}
function bxm(x,y,z,w,h,d,hex){return sbox(x,y,z,w,h,d,fmc(hex))}
function fpl(w,h,x,y,z,tex){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,fog:false}));m.rotation.y=-Math.PI/2;m.position.set(x,y,z);SG.add(m);return m}
function cvT(w,h){const cv=document.createElement('canvas');cv.width=w;cv.height=h;const tx=new THREE.CanvasTexture(cv);tx.anisotropy=4;return{cv,tx}}
function cashUI(){document.querySelectorAll('.fxcash').forEach(e=>e.textContent='CASH £'+Math.round(cash))}
/* ================= FRUIT MACHINE ================= */
const SLN=20,SLSTRIP=[0,1,2,0,3,1,0,2,1,4,0,1,2,0,5,1,0,3,2,4],SLPAY=[5,8,15,30,60,150],SLNM=['CHERRY','LEMON','BELL','BAR','SEVEN','DIAMOND'];
const slmod=j=>((j%SLN)+SLN)%SLN;
function sltDraw(){const S=SLT,g=S.g,W=480,H=394,t=performance.now()/1000;
 let gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#c01c1c');gr.addColorStop(1,'#6a0c10');g.fillStyle=gr;g.fillRect(0,0,W,H);
 g.fillStyle='#2a0a02';g.fillRect(14,10,452,62);g.strokeStyle='#f0c030';g.lineWidth=3;g.strokeRect(14,10,452,62);
 g.font='bold 34px Georgia,serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#ffd840';g.fillText('FRUITY FORTUNE',W/2,42);
 for(let i=0;i<30;i++){const x=i<13?24+i*34:i<17?24+12*34:24+(29-i)*34,on=((i+Math.floor(t*5))%2)===0;g.fillStyle=on?'#fff6a0':'#6a4a10';g.beginPath();g.arc(i<15?24+i*31:24+(29-i)*31,i<15?16:66,4,0,7);g.fill()}
 g.fillStyle='#120606';g.fillRect(34,92,412,178);g.strokeStyle=S.flash>0&&((t*8)|0)%2?'#fff':'#f0c030';g.lineWidth=4;g.strokeRect(34,92,412,178);
 for(let i=0;i<3;i++){const rx=52+i*130,rw=116,p=S.pos[i];g.save();g.beginPath();g.rect(rx,100,rw,162);g.clip();g.fillStyle='#fdf8ea';g.fillRect(rx,100,rw,162);
  for(let j=Math.floor(p)-2;j<=Math.floor(p)+3;j++)drawSym(g,SLSTRIP[slmod(j)],rx+rw/2,181+(j-p)*62,25);
  let sh=g.createLinearGradient(0,100,0,262);sh.addColorStop(0,'rgba(0,0,0,.55)');sh.addColorStop(.3,'rgba(0,0,0,0)');sh.addColorStop(.7,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=sh;g.fillRect(rx,100,rw,162);g.restore();
  g.strokeStyle='#000';g.lineWidth=2;g.strokeRect(rx,100,rw,162);
  if(S.hold[i]&&S.holdLit){g.fillStyle='#ffd840';g.font='bold 15px monospace';g.fillText('HELD',rx+rw/2,252)}}
 g.strokeStyle='rgba(230,20,20,.9)';g.lineWidth=2;g.beginPath();g.moveTo(40,181);g.lineTo(440,181);g.stroke();g.fillStyle='#e01010';g.beginPath();g.moveTo(34,170);g.lineTo(46,181);g.lineTo(34,192);g.fill();g.beginPath();g.moveTo(446,170);g.lineTo(434,181);g.lineTo(446,192);g.fill();
 g.fillStyle='#2a0a02';g.fillRect(14,282,452,70);g.strokeStyle='#f0c030';g.lineWidth=2;g.strokeRect(14,282,452,70);
 for(let k=5;k>=0;k--){const x=48+(5-k)*76;drawSym(g,k,x,305,13);g.fillStyle='#ffe890';g.font='bold 15px monospace';g.fillText('×'+SLPAY[k]*S.stake,x,330)}
 g.fillStyle='#fff';g.font='bold 12px monospace';g.fillText('3 THE SAME PAYS · ANY 2 CHERRIES = STAKE BACK',W/2,346);
 g.font='bold 22px monospace';const m=S.win>0?(Math.floor(t*6)%2?'#ffd840':'#fff'):'#ffe0a0';g.fillStyle=m;g.fillText(S.msg||'',W/2,374);
 if(S.holdLit&&!S.busy){g.fillStyle='#40ff60';g.font='bold 14px monospace';g.textAlign='left';g.fillText('HOLD LIT',24,90);g.textAlign='center'}
 if(S.nudgeLit&&!S.busy){g.fillStyle='#ffd040';g.font='bold 14px monospace';g.textAlign='right';g.fillText('NUDGE LIT',456,90);g.textAlign='center'}}
function sltUI(){const S=SLT;if(!S)return;cashUI();S.hb.forEach((b,i)=>{b.disabled=!(S.holdLit&&!S.busy);b.style.opacity=b.disabled?.35:1;b.style.background=S.hold[i]&&S.holdLit?'#c8a010':'#2a6a2a'});S.nb.forEach(b=>{b.disabled=!(S.nudgeLit&&!S.busy);b.style.opacity=b.disabled?.35:1;b.style.background='#7a3a8a'});S.spinB.disabled=S.busy;S.spinB.style.opacity=S.busy?.5:1}
function sltOpen(){if(SLT)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;const ov=ovMk('sltov','rgba(22,4,6,.97)');
 const port=innerWidth<innerHeight,W=Math.floor(port?innerWidth-14:Math.min(innerWidth*.6,(innerHeight-84)*1.22)),H=Math.floor(W*394/480);
 const col=document.createElement('div');col.style.cssText='display:flex;flex-direction:column;gap:4px;width:'+W+'px';
 const cv=document.createElement('canvas');cv.width=480;cv.height=394;cv.style.cssText='width:'+W+'px;height:'+H+'px;border:3px solid #e8b830;border-radius:10px;box-sizing:content-box;margin-left:-3px';
 const mk=(n)=>{const r=document.createElement('div');r.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:'+Math.round(W*14/480)+'px;padding:0 '+Math.round(W*52/480)+'px';return r};
 const hr=mk(),nr=mk(),S=SLT={ov,cv,g:cv.getContext('2d'),idx:[3,7,12],pos:[3,7,12],an:[null,null,null],hold:[0,0,0],holdLit:0,nudgeLit:0,busy:0,stake:1,win:0,msg:'PRESS SPIN',flash:0,last:performance.now(),hb:[],nb:[]};
 for(let i=0;i<3;i++){const h=bt('HOLD','padding:7px 2px;font-size:12px;border-width:2px',()=>{if(S.holdLit&&!S.busy){S.hold[i]^=1;if(S.hold.filter(x=>x).length>2){S.hold[i]=0}beep(500,.05,'square',.04);sltUI()}});S.hb.push(h);hr.append(h);
  const n=bt('NUDGE ▼','padding:7px 2px;font-size:12px;border-width:2px',()=>sltNudge(i));S.nb.push(n);nr.append(n)}
 col.append(cv,hr,nr);
 const side=document.createElement('div');side.style.cssText='display:flex;flex-direction:'+(port?'row':'column')+';flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;'+(port?'width:100%':'width:150px');
 const cs=document.createElement('div');cs.className='fxcash';cs.style.cssText='color:#ffe890;font-size:15px;width:100%;text-align:center';
 const st=bt('STAKE £1','background:#444',()=>{if(S.busy)return;S.stake=S.stake===1?2:S.stake===2?5:1;st.textContent='STAKE £'+S.stake;beep(520,.05,'square',.04)});
 S.spinB=bt('SPIN','background:#d02020;font-size:20px;padding:12px 26px',sltSpin);const lv=bt('LEAVE','',()=>sltClose());
 const inf=document.createElement('div');inf.id='sltinf';inf.style.cssText='font-size:11px;color:#c8a0a0;width:100%;text-align:center';
 side.append(cs,S.spinB,st,lv,inf);ov.append(col,side);sltUI();sltInf();
 const loop=now=>{if(!SLT)return;const dt=Math.min(.05,(now-S.last)/1000);S.last=now;sltStep(dt);sltDraw();S.raf=requestAnimationFrame(loop)};S.raf=requestAnimationFrame(loop)}
function sltInf(){const e=document.getElementById('sltinf');if(e)e.textContent='SPINS '+SLTS.n+' · WON £'+SLTS.won+' · BEST £'+SLTS.best}
function sltStep(dt){const S=SLT;if(S.flash>0)S.flash-=dt;let any=0;for(let i=0;i<3;i++){const a=S.an[i];if(!a)continue;any=1;a.t+=dt;const u=Math.min(1,a.t/a.dur),e=1-Math.pow(1-u,3);S.pos[i]=a.p0-a.d*e;if(Math.floor(a.t*14)!==Math.floor((a.t-dt)*14))beep(300+i*40,.02,'square',.012);if(u>=1){S.pos[i]=a.tgt;S.idx[i]=a.tgt;S.an[i]=null;beep(420+i*90,.07,'square',.05)}}
 if(S.busy&&!any){S.busy=0;sltResult()}}
function sltSpin(){const S=SLT;if(!S||S.busy)return;if(cash<S.stake){toast('NOT ENOUGH CASH');return}cash-=S.stake;SLTS.n++;SLTS.spent+=S.stake;S.win=0;S.nudgeLit=0;S.msg='';S.nudged=0;
 for(let i=0;i<3;i++){if(S.holdLit&&S.hold[i])continue;const tgt=Math.floor(Math.random()*SLN),p0=S.pos[i],d=(((p0-tgt)%SLN)+SLN)%SLN+SLN*(2+i);S.an[i]={p0,d,t:0,dur:1.0+i*.45,tgt}}
 S.holdLit=0;S.hold=[0,0,0];S.busy=1;beep(260,.1,'sawtooth',.05);sltUI()}
function sltNudge(i){const S=SLT;if(!S||!S.nudgeLit||S.busy)return;S.nudgeLit=0;S.nudged=1;const p0=S.pos[i];S.an[i]={p0,d:1,t:0,dur:.35,tgt:slmod(p0-1)};S.busy=1;S.msg='';beep(380,.08,'square',.05);sltUI()}
function sltResult(){const S=SLT,sy=S.idx.map(i=>SLSTRIP[i]);let w=0,nm='';
 if(sy[0]===sy[1]&&sy[1]===sy[2]){w=SLPAY[sy[0]]*S.stake;nm='3 '+SLNM[sy[0]]+'S!'}else if(sy.filter(x=>x===0).length===2){w=S.stake;nm='2 CHERRIES'}
 S.win=w;if(w>0){cash+=w;SLTS.won+=w;if(w>SLTS.best)SLTS.best=w;S.flash=w>=S.stake*15?4:1.5;S.msg='WIN £'+w+'  '+nm;
  if(w<=S.stake){beep(700,.1,'square',.06)}else{[0,1,2,3,4].forEach(k=>setTimeout(()=>beep(600+k*140,.12,'square',.06),k*110))}
  if(w>=S.stake*60){toast('JACKPOT! £'+w);for(let k=0;k<10;k++)setTimeout(()=>beep(500+(k%4)*220,.1,'square',.06),500+k*100)}else if(w>S.stake)toast('WINNER! +£'+w);}
 else{S.msg=S.nudged?'NO LUCK':'NO WIN';if(!S.nudged&&Math.random()<.4){S.nudgeLit=1;S.msg='NUDGE LIT!'}}
 if(!S.nudged&&Math.random()<.3){S.holdLit=1;if(!S.nudgeLit&&!w)S.msg='HOLD LIT!'}
 sltUI();sltInf()}
function sltClose(){const S=SLT;if(!S)return;cancelAnimationFrame(S.raf);S.ov.remove();SLT=null;busy=0}
/* ================= ARCADE: SEAGULL RAID ================= */
const AXW=224,AXH=256,GULA=['#....##....#','##..####..##','.##########.','..########..','...######...','....#..#....'],GULB=['....####....','.##########.','############','##.######.##','#..######..#','....#..#....'];
function arxNew(){const A=ARX;A.gl=[];for(let r=0;r<4;r++)for(let c=0;c<8;c++)A.gl.push({r,c,a:1});A.ox=24;A.oy=44+Math.min(20,(A.wave-1)*4);A.dir=1;A.sh=[];A.bm=[];A.bt=1.2;A.ufo=null;A.ut=7+Math.random()*6}
function arxOpen(){if(ARX)return;if(cash<1){toast('NEED £1 FOR THE ARCADE');return}cash-=1;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;ARXS.n++;const ov=ovMk('arxov','#05060c');
 const port=innerWidth<innerHeight,hh=Math.floor(port?Math.min(innerHeight-170,(innerWidth-26)*AXH/AXW):innerHeight-20),ww=Math.floor(hh*AXW/AXH);
 const fr=document.createElement('div');fr.style.cssText='position:relative;width:'+ww+'px;height:'+hh+'px;border:6px solid #2a2a8a;border-radius:14px;box-shadow:0 0 24px #3a4aff88;overflow:hidden;background:#000';
 const cv=document.createElement('canvas');cv.width=AXW;cv.height=AXH;cv.style.cssText='width:100%;height:100%;image-rendering:pixelated;display:block';
 const sc=document.createElement('div');sc.style.cssText='position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px)';fr.append(cv,sc);
 const side=document.createElement('div');side.style.cssText='display:flex;flex-direction:column;gap:8px;align-items:center;text-align:center;max-width:170px';
 const ttl=document.createElement('div');ttl.innerHTML='<div style="color:#ffd840;font-size:16px">SEAGULL RAID</div><div style="color:#9ab;font-size:11px;margin-top:4px">DRAG LEFT / RIGHT TO MOVE.<br>SALT SHAKER FIRES BY ITSELF.<br>£1 A GO. £1 PER 250 PTS (MAX £8)</div>';
 const msg=document.createElement('div');msg.id='arxm';msg.style.cssText='color:#fff;min-height:36px;font-size:13px';const cs=document.createElement('div');cs.className='fxcash';cs.style.color='#ffe890';
 const lv=bt('LEAVE','',()=>arxClose());side.append(ttl,msg,cs,lv);ov.append(fr,side);
 const stars=[];for(let i=0;i<40;i++)stars.push([Math.random()*AXW,Math.random()*AXH,Math.random()*6]);
 const A=ARX={ov,cv,g:cv.getContext('2d'),fr,side,msg,lv,x:AXW/2,tx:AXW/2,lives:3,score:0,wave:1,ph:'ready',pt:1.2,inv:0,fc:.3,t:0,stars,keys:{},last:performance.now(),ag:null};
 arxNew();cashUI();
 const pt=e=>{const b=cv.getBoundingClientRect();return Math.max(8,Math.min(AXW-8,(e.clientX-b.left)*AXW/b.width))};
 ov.onpointerdown=e=>{if(e.target.tagName==='BUTTON')return;A.tx=pt(e);A.drag=1};ov.onpointermove=e=>{if(A.drag)A.tx=pt(e)};ov.onpointerup=()=>{A.drag=0};
 A.kd=e=>{A.keys[e.key]=1;if(e.key===' ')A.fire=1};A.ku=e=>{A.keys[e.key]=0};window.addEventListener('keydown',A.kd);window.addEventListener('keyup',A.ku);
 const loop=now=>{if(!ARX)return;const dt=Math.min(.033,(now-A.last)/1000);A.last=now;arxStep(dt);arxDraw();A.raf=requestAnimationFrame(loop)};A.raf=requestAnimationFrame(loop)}
function arxStep(dt){const A=ARX;A.t+=dt;if(A.ph==='over')return;
 if(A.ph==='ready'||A.ph==='clear'){A.pt-=dt;if(A.pt<=0){if(A.ph==='clear'){A.wave++;arxNew()}A.ph='play'}}
 if(A.keys.ArrowLeft||A.keys.a)A.tx=Math.max(8,A.tx-220*dt);if(A.keys.ArrowRight||A.keys.d)A.tx=Math.min(AXW-8,A.tx+220*dt);
 A.x+=Math.max(-250*dt,Math.min(250*dt,A.tx-A.x));if(A.inv>0)A.inv-=dt;
 if(A.ph!=='play')return;
 A.fc-=dt;if((A.fc<=0||A.fire)&&A.sh.length<3){A.sh.push({x:A.x,y:226});A.fc=.42;A.fire=0;beep(900,.04,'square',.02)}A.fire=0;
 const al=A.gl.filter(g=>g.a);const n=al.length;
 if(n){const sp=14+(32-n)*2.6+(A.wave-1)*7;A.ox+=A.dir*sp*dt;const mn=Math.min(...al.map(g=>g.c)),mx=Math.max(...al.map(g=>g.c));if(A.ox+mn*20<6&&A.dir<0||A.ox+mx*20+12>218&&A.dir>0){A.dir*=-1;A.oy+=8;A.ox=Math.max(6-mn*20,Math.min(218-12-mx*20,A.ox))}
  const low=Math.max(...al.map(g=>g.r));if(A.oy+low*16+7>=228){A.lives=0;arxEnd();return}
  A.bt-=dt;if(A.bt<=0&&A.bm.length<4){const c=al[Math.floor(Math.random()*al.length)].c,col=al.filter(g=>g.c===c).sort((a,b)=>b.r-a.r)[0];A.bm.push({x:A.ox+col.c*20+6,y:A.oy+col.r*16+7});A.bt=Math.max(.35,1.3-A.wave*.12-(32-n)*.012)+Math.random()*.5}}
 else{A.ph='clear';A.pt=1.2;A.score+=100;A.sh=[];A.bm=[];toast('WAVE '+A.wave+' CLEARED! +100');[0,1,2].forEach(k=>setTimeout(()=>beep(600+k*200,.12,'square',.05),k*120));return}
 for(const s of A.sh){s.y-=230*dt;for(const g of A.gl){if(!g.a)continue;const gx=A.ox+g.c*20+6,gy=A.oy+g.r*16+3;if(Math.abs(s.x-gx)<8&&Math.abs(s.y-gy)<6){g.a=0;s.y=-99;A.score+=[40,30,20,10][g.r];beep(220,.07,'sawtooth',.05);A.pf=(A.pf||[]);A.pf.push({x:gx,y:gy,t:.3});break}}
  if(A.ufo&&Math.abs(s.x-A.ufo.x)<10&&Math.abs(s.y-26)<6){const v=100+50*Math.floor(Math.random()*3);A.score+=v;A.pf=(A.pf||[]);A.pf.push({x:A.ufo.x,y:26,t:.5,v});A.ufo=null;s.y=-99;beep(800,.15,'square',.06);setTimeout(()=>beep(1100,.15,'square',.06),120)}}
 A.sh=A.sh.filter(s=>s.y>-10);
 for(const b of A.bm){b.y+=70*dt;if(A.inv<=0&&b.y>226&&b.y<246&&Math.abs(b.x-A.x)<8){b.y=999;A.lives--;A.inv=1.6;beep(120,.35,'sawtooth',.08);if(A.lives<=0){arxEnd();return}}}
 A.bm=A.bm.filter(b=>b.y<256);
 A.ut-=dt;if(A.ut<=0&&!A.ufo){A.ufo={x:Math.random()<.5?-12:236,d:0};A.ufo.d=A.ufo.x<0?1:-1;A.ut=12+Math.random()*8}
 if(A.ufo){A.ufo.x+=A.ufo.d*48*dt;if(A.ufo.x<-16||A.ufo.x>240)A.ufo=null}
 if(A.pf)A.pf.forEach(p=>p.t-=dt);if(A.pf)A.pf=A.pf.filter(p=>p.t>0)}
function arxEnd(){const A=ARX;A.ph='over';const pay=Math.min(8,Math.floor(A.score/250));let bonus=0;if(A.score>ARXS.hi&&A.score>=250){bonus=2;ARXS.hi=A.score}else if(A.score>ARXS.hi)ARXS.hi=A.score;cash+=pay+bonus;
 A.pay=pay+bonus;A.msg.innerHTML='GAME OVER<br>SCORE '+A.score+(bonus?'<br><span style="color:#ffd840">NEW HI-SCORE! +£2</span>':'')+'<br>PRIZE TOKENS: £'+(pay+bonus);cashUI();beep(200,.4,'sawtooth',.06);
 const ag=bt('PLAY AGAIN (£1)','background:#2a7a3a',()=>{if(cash<1){toast('NEED £1');return}const ov=A.ov,fr=A.fr;arxClose();arxOpen()});A.side.insertBefore(ag,A.lv);A.ag=ag}
function arxDraw(){const A=ARX,g=A.g,t=A.t;g.fillStyle='#04050e';g.fillRect(0,0,AXW,AXH);for(const s of A.stars){g.fillStyle=((t*2+s[2])%3<2)?'#556':'#aab';g.fillRect(s[0],s[1],1,1)}
 const px=(rows,x,y,col)=>{g.fillStyle=col;for(let j=0;j<rows.length;j++)for(let i=0;i<rows[j].length;i++)if(rows[j][i]==='#')g.fillRect(Math.round(x+i),Math.round(y+j),1,1)};
 const cols=['#ff8a8a','#ffd060','#80e0ff','#ffffff'],fr=Math.floor(t*2.2)%2;
 for(const q of A.gl)if(q.a)px(fr?GULA:GULB,A.ox+q.c*20,A.oy+q.r*16,cols[q.r]);
 if(A.ufo){px(fr?GULA:GULB,A.ufo.x-6,22,'#ff4040');g.fillStyle='#ff4040';g.fillRect(A.ufo.x-9,28,18,1)}
 g.fillStyle='#fff';for(const s of A.sh)g.fillRect(Math.round(s.x)-1,Math.round(s.y),2,5);
 g.fillStyle='#ffe050';for(const b of A.bm){g.fillRect(Math.round(b.x)-1,Math.round(b.y),3,7);g.fillStyle='#d09020';g.fillRect(Math.round(b.x)-1,Math.round(b.y)+5,3,2);g.fillStyle='#ffe050'}
 if(A.ph!=='over'&&(A.inv<=0||Math.floor(t*12)%2)){const x=Math.round(A.x);g.fillStyle='#d8e8f0';g.fillRect(x-5,232,10,12);g.fillStyle='#9ab0c0';g.fillRect(x-5,232,10,2);g.fillStyle='#c0c8d0';g.fillRect(x-4,228,8,4);g.fillStyle='#606870';g.fillRect(x-2,229,1,1);g.fillRect(x+1,229,1,1);g.fillRect(x-1,226,2,2)}
 if(A.pf)for(const p of A.pf){g.fillStyle='#ffd040';if(p.v){g.font='bold 9px monospace';g.textAlign='center';g.fillText(''+p.v,p.x,p.y)}else{g.fillRect(p.x-4,p.y-3,2,2);g.fillRect(p.x+3,p.y-3,2,2);g.fillRect(p.x-1,p.y+2,2,2)}}
 g.fillStyle='#2a6a2a';g.fillRect(0,248,AXW,1);
 g.font='bold 9px monospace';g.textAlign='left';g.fillStyle='#fff';g.fillText('SCORE '+A.score,5,10);g.textAlign='center';g.fillStyle='#ffd840';g.fillText('HI '+Math.max(ARXS.hi,A.score),AXW/2+14,10);g.textAlign='right';g.fillStyle='#9fd0ff';g.fillText('WAVE '+A.wave,AXW-5,10);
 g.fillStyle='#c0c8d0';for(let i=0;i<A.lives;i++)g.fillRect(6+i*10,252,6,3);
 g.textAlign='center';g.font='bold 14px monospace';if(A.ph==='ready'){g.fillStyle='#fff';g.fillText('GET READY',AXW/2,130)}if(A.ph==='over'){g.fillStyle='#ff6060';g.fillText('GAME OVER',AXW/2,120);g.font='bold 9px monospace';g.fillStyle='#fff';g.fillText(A.lives<=0&&A.oy+0>200?'THE GULLS GOT YOUR CHIPS':'THE GULLS WIN',AXW/2,138)}}
function arxClose(){const A=ARX;if(!A)return;cancelAnimationFrame(A.raf);window.removeEventListener('keydown',A.kd);window.removeEventListener('keyup',A.ku);A.ov.remove();ARX=null;busy=0}
/* ================= SCRATCH CARDS ================= */
const SCSYM=[6,0,2,8,9,7,5],SCPR=[1,2,3,5,10,25,100],SCPB=[.14,.08,.04,.03,.012,.004,.0006],SCNM=['CLOVER','CHERRY','BELL','HORSESHOE','HEART','STAR','DIAMOND'];
function scrRoll(){let r=Math.random(),k=-1;for(let i=0;i<SCPB.length;i++){if(r<SCPB[i]){k=i;break}r-=SCPB[i]}
 const cnt={},pick=(ex)=>{for(;;){const s=Math.floor(Math.random()*7);if((cnt[s]|0)<2&&s!==ex){cnt[s]=(cnt[s]|0)+1;return s}}};const a=[];
 if(k>=0){for(let i=0;i<3;i++)a.push(k);cnt[k]=3;for(let i=0;i<3;i++)a.push(pick(k))}else for(let i=0;i<6;i++)a.push(pick(-1));
 for(let i=5;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return{a,k}}
const SCP=[];for(let j=0;j<2;j++)for(let i=0;i<3;i++)SCP.push([15+i*105,92+j*94,96,84]);
function scrBase(hl){const S=SCR,g=S.bg,W=330,H=340,gold=S.stake>1;let gr=g.createLinearGradient(0,0,W,H);if(gold){gr.addColorStop(0,'#f6d860');gr.addColorStop(1,'#b8860b')}else{gr.addColorStop(0,'#58c868');gr.addColorStop(1,'#1e7a38')}g.fillStyle=gr;g.fillRect(0,0,W,H);
 g.fillStyle='rgba(255,255,255,.12)';for(let i=0;i<14;i++)g.fillRect(0,i*26,W,10);
 g.textAlign='center';g.textBaseline='middle';g.fillStyle=gold?'#5a3a00':'#fff';g.font='bold 30px Georgia,serif';g.fillText(gold?'GOLDEN TICKET':'LUCKY CLOVER',W/2,28);g.font='bold 14px monospace';g.fillText('FIND 3 THE SAME TO WIN!   £'+S.stake,W/2,62);
 SCP.forEach((p,i)=>{g.fillStyle='#fffbe8';g.fillRect(p[0],p[1],p[2],p[3]);g.strokeStyle=hl&&hl.includes(i)?'#ff2a2a':'#00000055';g.lineWidth=hl&&hl.includes(i)?5:2;g.strokeRect(p[0],p[1],p[2],p[3]);drawSym(g,SCSYM[S.card.a[i]],p[0]+p[2]/2,p[1]+p[3]/2,30)});
 g.fillStyle='rgba(0,0,0,.32)';g.fillRect(8,282,314,52);SCSYM.forEach((s,i)=>{const x=30+i*45;drawSym(g,s,x,300,11);g.fillStyle='#fff';g.font='bold 12px monospace';g.fillText('£'+SCPR[i]*S.stake,x,322)})}
function scrOpen(stake){if(SCR)return;if(cash<stake){toast('NOT ENOUGH CASH');return}cash-=stake;SCRS.n++;SCRS.spent+=stake;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;const ov=ovMk('scrov','rgba(16,12,6,.97)');
 const port=innerWidth<innerHeight,W=Math.floor(port?Math.min(innerWidth-20,innerHeight*.5):Math.min(innerHeight-16,innerWidth*.5)*330/340),H=Math.floor(W*340/330);
 const wrap=document.createElement('div');wrap.style.cssText='position:relative;width:'+W+'px;height:'+H+'px;border-radius:12px;overflow:hidden;box-shadow:0 6px 24px #000;transform:rotate(-1deg)';
 const mk=()=>{const c=document.createElement('canvas');c.width=330;c.height=340;c.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%';return c};
 const bc=mk(),sc=mk();wrap.append(bc,sc);
 const side=document.createElement('div');side.style.cssText='display:flex;flex-direction:column;gap:8px;align-items:center;text-align:center;max-width:180px';
 const cs=document.createElement('div');cs.className='fxcash';cs.style.color='#ffe890';const res=document.createElement('div');res.style.cssText='font-size:16px;min-height:44px;color:#fff';res.textContent='SCRATCH THE SILVER WITH YOUR FINGER';
 const S=SCR={ov,bc,sc,bg:bc.getContext('2d'),sg:sc.getContext('2d'),stake,card:scrRoll(),rev:[0,0,0,0,0,0],done:0,res,last:null,lt:0};
 const rv=bt('REVEAL ALL','background:#555',()=>scrAll());S.rv=rv;const nx=bt('BUY ANOTHER £'+stake,'background:#2a7a3a;display:none',()=>{if(cash<stake){toast('NOT ENOUGH CASH');return}scrClose();scrOpen(stake)});S.nx=nx;const lv=bt('LEAVE','',()=>scrClose());
 side.append(res,cs,rv,nx,lv);ov.append(wrap,side);cashUI();scrBase();
 const g=S.sg;SCP.forEach(p=>{const gr=g.createLinearGradient(p[0],p[1],p[0]+p[2],p[1]+p[3]);gr.addColorStop(0,'#d8dce4');gr.addColorStop(.5,'#a4aab6');gr.addColorStop(1,'#cfd3da');g.fillStyle=gr;g.fillRect(p[0],p[1],p[2],p[3]);g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=1;for(let i=0;i<16;i++){const y=p[1]+Math.random()*p[3];g.beginPath();g.moveTo(p[0],y);g.lineTo(p[0]+p[2],y+(Math.random()-.5)*10);g.stroke()}g.fillStyle='rgba(60,66,80,.55)';g.font='bold 15px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText('SCRATCH',p[0]+p[2]/2,p[1]+p[3]/2)});
 const pt=e=>{const b=sc.getBoundingClientRect();return[(e.clientX-b.left)*330/b.width,(e.clientY-b.top)*340/b.height]};
 sc.onpointerdown=e=>{e.preventDefault();S.last=pt(e);try{sc.setPointerCapture(e.pointerId)}catch(_){}scrScr(S.last,S.last)};
 sc.onpointermove=e=>{if(!S.last)return;const p=pt(e);scrScr(S.last,p);S.last=p};sc.onpointerup=sc.onpointercancel=()=>{S.last=null;scrChk()}}
function scrScr(a,b){const S=SCR,g=S.sg;g.globalCompositeOperation='destination-out';g.lineWidth=30;g.lineCap='round';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0]+.01,b[1]);g.stroke();g.globalCompositeOperation='source-over';const n=performance.now();if(n-S.lt>140){S.lt=n;scrChk();if(Math.random()<.4)beep(1500+Math.random()*500,.015,'square',.01)}}
function scrChk(){const S=SCR;if(!S||S.done)return;SCP.forEach((p,i)=>{if(S.rev[i])return;const d=S.sg.getImageData(p[0],p[1],p[2],p[3]).data;let c=0,n=0;for(let k=3;k<d.length;k+=28){n++;if(d[k]<40)c++}if(c/n>.55){S.rev[i]=1;S.sg.globalCompositeOperation='destination-out';S.sg.fillRect(p[0]-2,p[1]-2,p[2]+4,p[3]+4);S.sg.globalCompositeOperation='source-over';beep(700+i*60,.05,'square',.04)}});if(S.rev.every(x=>x))scrFin()}
function scrAll(){const S=SCR;if(!S||S.done)return;S.sg.clearRect(0,0,330,340);S.rev=[1,1,1,1,1,1];scrFin()}
function scrFin(){const S=SCR;if(S.done)return;S.done=1;S.sg.clearRect(0,0,330,340);const c={};S.card.a.forEach((s,i)=>(c[s]=c[s]||[]).push(i));let k=-1;for(const s in c)if(c[s].length>=3)k=+s;
 if(k>=0){const w=SCPR[k]*S.stake;cash+=w;SCRS.won+=w;if(w>SCRS.best)SCRS.best=w;scrBase(c[k]);S.res.innerHTML='<span style="color:#7aff7a">3 '+SCNM[k]+'S!<br>YOU WIN £'+w+'</span>';[0,1,2,3,4,5].forEach(i=>setTimeout(()=>beep(500+i*130,.12,'square',.06),i*100));if(w>=25*S.stake)toast('BIG WIN! £'+w+' ON A SCRATCH CARD')}
 else{scrBase();S.res.innerHTML='<span style="color:#ffb0a0">NO WIN. NEVER MIND.</span>';beep(200,.25,'sawtooth',.05)}
 S.rv.style.display='none';S.nx.style.display='';cashUI()}
function scrClose(){const S=SCR;if(!S)return;if(!S.done)scrFin();S.ov.remove();SCR=null;busy=0}
/* ================= 3D props & hooks ================= */
function fruitFront(){const F=window.SLF;if(!F)return;const g=F.cv.getContext('2d'),W=F.cv.width,H=F.cv.height,t=performance.now()/1000;let gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#c81c1c');gr.addColorStop(1,'#701010');g.fillStyle=gr;g.fillRect(0,0,W,H);
 g.fillStyle='#240a02';g.fillRect(12,10,W-24,90);g.fillStyle='#ffd840';g.font='bold 30px Georgia';g.textAlign='center';g.textBaseline='middle';g.fillText('FRUITY',W/2,38);g.fillText('FORTUNE',W/2,74);
 for(let i=0;i<14;i++){g.fillStyle=((i+Math.floor(t*4))%2)?'#fff4a0':'#6a4a10';g.beginPath();g.arc(20+i*(W-40)/13,16,4,0,7);g.fill();g.beginPath();g.arc(20+i*(W-40)/13,94,4,0,7);g.fill()}
 g.fillStyle='#100';g.fillRect(16,120,W-32,150);const q=Math.floor(t*1.2);for(let i=0;i<3;i++){g.fillStyle='#fdf8ea';g.fillRect(24+i*80,128,72,134);drawSym(g,SLSTRIP[(q*7+i*5)%SLN],60+i*80,195,22)}
 g.fillStyle='#e01010';g.fillRect(20,194,W-40,2);
 for(let i=0;i<3;i++){g.fillStyle=((q+i)%3===0)?'#ffe040':'#5a4a10';g.fillRect(28+i*80,288,64,26);g.fillStyle='#000';g.font='bold 14px monospace';g.fillText('HOLD',60+i*80,301)}
 g.fillStyle='#2a8a2a';g.fillRect(70,330,W-140,40);g.fillStyle='#fff';g.font='bold 20px monospace';g.fillText('SPIN',W/2,350);
 g.fillStyle='#1a1010';g.fillRect(40,400,W-80,18);g.fillStyle='#d8b020';g.fillRect(W/2-26,386,52,6);g.fillStyle='#1a0808';g.fillRect(30,460,W-60,90);g.fillStyle='#8a8a90';g.fillRect(40,470,W-80,60);g.fillStyle='#fff';g.font='bold 14px monospace';g.fillText('£1 A GO',W/2,560);F.tx.needsUpdate=true}
function arxScreen(){const F=window.ARF;if(!F)return;const g=F.cv.getContext('2d'),t=performance.now()/1000;g.fillStyle='#04050e';g.fillRect(0,0,128,128);const fr=Math.floor(t*2)%2;g.fillStyle='#fff';for(let r=0;r<3;r++)for(let c=0;c<6;c++){const x=10+c*18+(Math.floor(t)%3)*2,y=18+r*14;g.fillRect(x,y,10,4);g.fillRect(x+(fr?0:1),y+4,fr?2:1,2);g.fillRect(x+10-(fr?2:1),y+4,fr?2:1,2)}g.fillStyle='#d8e8f0';g.fillRect(60+Math.round(Math.sin(t)*30),104,8,10);g.fillStyle='#ffe050';g.font='bold 8px monospace';g.textAlign='center';if(Math.floor(t*1.5)%2)g.fillText('INSERT COIN',64,80);F.tx.needsUpdate=true}
{const b0=buildShop;buildShop=function(o){b0(o);
 if(o.pub){const f=cvT(280,580);window.SLF=f;fruitFront();bxm(3.9,0,2.0,.6,1.75,.75,0xa01818);bxm(3.9,1.75,2.0,.62,.06,.77,0xe8b830);fpl(.72,1.5,3.59,.88,2.0,f.tx);IROOM.push([3.4,4.2,1.55,2.45]);
  IA.push({r:[2.75,4.2,1.1,2.9],label:'FRUIT MACHINE (£1)',fn:()=>sltOpen()})}
 else if(o.t==="FRANKIE'S FISH & CHIPS"){const sc=cvT(128,128),mq=cvT(256,48);window.ARF=sc;arxScreen();const g=mq.cv.getContext('2d');g.fillStyle='#1a1a60';g.fillRect(0,0,256,48);g.fillStyle='#ffd840';g.font='bold 30px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText('SEAGULL RAID',128,26);mq.tx.needsUpdate=true;
  bxm(3.9,0,1.5,.6,.95,.7,0x1a2a7a);bxm(3.95,.95,1.5,.45,.95,.68,0x1a2a7a);bxm(3.82,.95,1.5,.45,.12,.72,0x2a3a9a);fpl(.54,.5,3.715,1.5,1.5,sc.tx);bxm(3.88,1.9,1.5,.4,.22,.7,0xf0b020);fpl(.66,.2,3.665,2.0,1.5,mq.tx);
  bxm(3.64,1.07,1.38,.06,.14,.06,0x181818);bxm(3.64,1.2,1.38,.1,.06,.1,0xd02020);bxm(3.64,1.07,1.64,.08,.04,.08,0xe03030);bxm(3.64,1.07,1.76,.08,.04,.08,0x30a0e0);IROOM.push([3.45,4.2,1.1,1.9]);
  IA.push({r:[2.75,4.2,.75,2.3],label:'ARCADE: SEAGULL RAID (£1)',fn:()=>arxOpen()})}
 else if(o.t==='NEWSAGENT'){const rk=cvT(200,340);const g=rk.cv.getContext('2d');g.fillStyle='#143a24';g.fillRect(0,0,200,340);g.fillStyle='#ffd840';g.font='bold 22px Georgia';g.textAlign='center';g.textBaseline='middle';g.fillText('SCRATCH',100,26);g.fillText('& WIN!',100,54);
  for(let r=0;r<5;r++)for(let c=0;c<3;c++){const x=10+c*62,y=84+r*50;g.fillStyle=['#e0c040','#58c868','#d84a4a','#4a8ad8','#d890d8'][(r+c*2)%5];g.fillRect(x,y,54,42);g.fillStyle='#fff';g.fillRect(x+4,y+4,46,16);g.fillStyle='#c0c4cc';g.fillRect(x+6,y+24,42,12)}rk.tx.needsUpdate=true;
  bxm(3.95,0,.05,.5,1.55,.9,0x1a5a34);fpl(.84,1.4,3.69,.8,.05,rk.tx);IROOM.push([3.55,4.2,-.45,.55]);
  IA.push({r:[2.9,4.2,-.8,.8],label:'SCRATCH CARDS',fn:()=>openShop('scratch')})}}}
CUSTOM_SHOP.scratch=function(msg){document.getElementById('shT').textContent='SCRATCH CARDS';document.getElementById('shMsg').textContent=msg||'FIND 3 THE SAME. PLAY RESPONSIBLY - IT IS ALL PRETEND POUNDS!';
 dRow('LUCKY CLOVER CARD  £1  (WIN UP TO £100)',[['BUY',()=>{if(cash<1)return renderShop('NEED £1');closeShop();scrOpen(1)},cash>=1]]);
 dRow('GOLDEN TICKET  £3  (WIN UP TO £300)',[['BUY',()=>{if(cash<3)return renderShop('NEED £3');closeShop();scrOpen(3)},cash>=3]]);
 dRow('CARDS BOUGHT '+SCRS.n+'  WON £'+SCRS.won+'  BIGGEST £'+SCRS.best,[['OK',()=>renderShop()]]);dRow('',[['BACK',()=>closeShop()]])};
{let acc=0;const u0=updCozy;updCozy=function(dt){u0(dt);if(!GS.inside||menuOpen||!SHOPCUR){return}acc+=dt;if(acc>.45){acc=0;if(SHOPCUR.o.pub)fruitFront();else if(window.ARF&&SHOPCUR.o.t==="FRANKIE'S FISH & CHIPS")arxScreen()}}}
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.sl=SLTS;o.ax=ARXS;o.sk=SCRS;return o};cozyLoad=function(z){l0(z);if(z){if(z.sl)SLTS=z.sl;if(z.ax)ARXS=z.ax;if(z.sk)SCRS=z.sk}}}
/* ---- bigger pub + 3D pool table you can actually play ---- */
var PDX=0,POOLS={w:0,l:0,n:0},PL=null;
const PLTC=[3.7,1.0],PTY=.8,PHL=1.0,PHW=.5,PBR=.035,PVM=3.7;
const PPOCK=[[-PHL,-PHW,.085],[PHL,-PHW,.085],[-PHL,PHW,.085],[PHL,PHW,.085],[0,-PHW,.075],[0,PHW,.075]];
const PLCOL=['#f4f0e8','#f2c820','#2050c0','#d02020','#6a2a9a','#f07820','#208040','#8a2a1a','#151515'];
const pGrp=n=>n<8?0:1;
function pubExpand(){const ch=SG.children,DX=2.1;
 const fix=m=>{const mm=m.material.clone();if(mm.map){mm.map=mm.map.clone();mm.map.repeat.x*=1.5;mm.map.needsUpdate=true}m.material=mm;m.scale.x=1.5};
 fix(ch[0]);fix(ch[1]);fix(ch[2]);ch[3].position.x=6.3;ch[4].position.x=-6.3;
 for(let i=6;i<ch.length;i++){const m=ch[i];if(m.position.z>3.0)continue;m.position.x+=m.position.x>3.3?DX:-DX}
 IA.forEach(a=>{if(a.r[2]>2.8)return;const d=(a.r[0]+a.r[1])/2>3.3?DX:-DX;a.r[0]+=d;a.r[1]+=d});
 for(let i=1;i<IROOM.length;i++){const r=IROOM[i],d=(r[0]+r[1])/2>3.3?DX:-DX;r[0]+=d;r[1]+=d}
 IROOM[0]=[-7.3,7.3,-4.2,-.9];RX=6.3;PDX=-DX}
const BALLVS='varying vec3 vO;varying vec3 vV;void main(){vO=normalize(position);vV=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
const BALLFS='uniform sampler2D map;varying vec3 vO;varying vec3 vV;void main(){float u=atan(vO.z,vO.x)/6.2831853+.5;float v=asin(clamp(vO.y,-1.,1.))/3.1415927+.5;vec3 c=texture2D(map,vec2(u,v)).rgb;vec3 n=normalize(vV);vec3 L=normalize(vec3(-.3,.8,.5));float d=max(0.,dot(n,L));float sp=pow(max(0.,dot(reflect(-L,n),vec3(0.,0.,1.))),22.);gl_FragColor=vec4(c*(.45+.65*d)+vec3(.4)*sp,1.);}';
function poolBallTex(n){const cv=document.createElement('canvas');cv.width=128;cv.height=64;const g=cv.getContext('2d'),base=PLCOL[n>8?n-8:n];g.fillStyle=n>8||n===0?'#f4f0e8':base;g.fillRect(0,0,128,64);if(n>8){g.fillStyle=base;g.fillRect(0,16,128,32)}
 for(const cx of[32,96]){if(n===0){g.fillStyle='#d02020';g.beginPath();g.arc(cx,32,5,0,7);g.fill()}else{g.fillStyle='#f8f4ea';g.beginPath();g.arc(cx,32,12,0,7);g.fill();g.fillStyle='#111';g.font='bold 15px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(''+n,cx,33)}}
 const tx=new THREE.CanvasTexture(cv);tx.minFilter=tx.magFilter=THREE.LinearFilter;tx.generateMipmaps=false;return tx}
function poolBuild(){const X=PLTC[0],Z=PLTC[1],Y=PTY,wood=0x5a3416,cush=0x1a5a2a;
 for(const[sx,sz]of[[-1,-1],[1,-1],[-1,1],[1,1]])bxm(X+sx*1.04,0,Z+sz*.54,.14,Y-.16,.14,0x3a2210);
 bxm(X,Y-.34,Z,2.26,.18,1.26,0x4a2a12);
 const pr=(x,z,w,d,c)=>bxm(x,Y-.0,z,w,.055,d,c);
 pr(X,Z-.61,2.32,.1,wood);pr(X,Z+.61,2.32,.1,wood);pr(X-1.11,Z,.1,1.12,wood);pr(X+1.11,Z,.1,1.12,wood);
 const cu=(x,z,w,d)=>bxm(x,Y,z,w,.035,d,cush);
 for(const sg of[-1,1]){cu(X-.5+.0,Z+sg*(PHW+.03),.82,.06);cu(X+.5,Z+sg*(PHW+.03),.82,.06);cu(X+sg*(PHL+.03),Z,.06,.82)}
 const cl=document.createElement('canvas');cl.width=128;cl.height=64;{const g=cl.getContext('2d');g.fillStyle='#1f8a40';g.fillRect(0,0,128,64);for(let i=0;i<500;i++){g.fillStyle='rgba('+(Math.random()<.5?'0,0,0':'255,255,255')+','+Math.random()*.05+')';g.fillRect(Math.random()*128,Math.random()*64,1+Math.random()*2,1)}g.fillStyle='rgba(255,255,255,.35)';g.fillRect(32,30,2,4);g.fillRect(96,30,2,4);g.fillRect(31,0,1,64)}
 const ct=new THREE.CanvasTexture(cl);ct.magFilter=THREE.NearestFilter;const cloth=new THREE.Mesh(new THREE.PlaneGeometry(2*PHL+.12,2*PHW+.12).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:ct}));cloth.position.set(X,Y+.002,Z);SG.add(cloth);
 const blk=new THREE.MeshBasicMaterial({color:0x060606});
 for(const[u,v,r]of PPOCK){const d=new THREE.Mesh(new THREE.CircleGeometry(r,14).rotateX(-Math.PI/2),blk);d.position.set(X+u,Y+.005,Z+v);SG.add(d);const d2=new THREE.Mesh(new THREE.CircleGeometry(r*.8,12).rotateX(-Math.PI/2),blk);d2.position.set(X+u*1.04,Y+.058,Z+v*1.12);SG.add(d2)}
 bxm(X,2.15,Z,.04,.55,.04,0x222222);bxm(X,2.12,Z,1.1,.07,.3,0x2a6a3a);bxm(X,2.09,Z,1.0,.03,.24,0xfff4c0);
 const PG=new THREE.Group();PG.position.set(X,Y,Z);SG.add(PG);window.PG=PG;
 const geo=new THREE.SphereGeometry(PBR,14,10);window.PBALLS=[];window.PBTX=window.PBTX||[];
 for(let n=0;n<16;n++){if(!PBTX[n])PBTX[n]=poolBallTex(n);const m=new THREE.Mesh(geo,new THREE.ShaderMaterial({uniforms:{map:{value:PBTX[n]}},vertexShader:BALLVS,fragmentShader:BALLFS}));PG.add(m);PBALLS.push(m)}
 const cue=new THREE.Group(),inner=new THREE.Group(),mb=c=>new THREE.MeshBasicMaterial({color:c}),cg=(a,b,h,off,c)=>{const q=new THREE.Mesh(new THREE.CylinderGeometry(a,b,h,6).rotateZ(Math.PI/2).translate(-off,0,0),mb(c));inner.add(q)};
 cg(.0065,.0065,.016,.008,0x3a8ad8);cg(.01,.0065,.62,.016+.31,0xe8d0a0);cg(.016,.011,.514,.636+.257,0x3a2010);inner.rotation.z=-.1;cue.add(inner);cue.visible=false;PG.add(cue);window.PCUE=cue;
 const lm=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.75}),gl=new THREE.Mesh(new THREE.BoxGeometry(1,.003,.005),lm),gh=new THREE.Mesh(new THREE.RingGeometry(PBR*.85,PBR,16).rotateX(-Math.PI/2),lm),tl=new THREE.Mesh(new THREE.BoxGeometry(1,.003,.005),new THREE.MeshBasicMaterial({color:0xffe060,transparent:true,opacity:.85}));
 for(const q of[gl,gh,tl]){q.visible=false;q.position.y=.006;PG.add(q)}window.PGL=[gl,gh,tl];
 const sp=pSpec(7121,{f:false,hs:4,ts:1,beard:true,gl:false,scarf:null,bp:false,bag:0,old:true,hr:PHR[4],tc:[.45,.3,.2],sk:PSK[0],w:1.08});window.PMAN=personIn(sp,X-1.6,Z+.8,Math.PI/2);PMAN.visible=false;
 IROOM.push([X-1.18,X+1.18,Z-.68,Z+.68]);IA.push({r:[X-1.5,X+1.5,Z-1.1,Z+1.2],label:'PLAY POOL vs ARTHUR (£2)',fn:()=>poolOpen()});
 poolRackStatic()}
function poolRackStatic(){const B=poolNewBalls(Math.random);poolSyncMeshes(B)}
function poolNewBalls(rn){const o=[1,2,3,4,5,6,7,9,10,11,12,13,14,15];for(let i=o.length-1;i>0;i--){const j=Math.floor(rn()*(i+1));[o[i],o[j]]=[o[j],o[i]]}
 const cs=o.find(n=>n<8),ct=o.find(n=>n>8),rest=o.filter(n=>n!==cs&&n!==ct),d=PBR*1.745+.0008,w=PBR*2.01,B=[{n:0,x:-.5,y:0,vx:0,vy:0,a:1,pk:0}];
 for(let r=0;r<5;r++)for(let c=0;c<=r;c++){const n=r===2&&c===1?8:r===4&&c===0?cs:r===4&&c===4?ct:rest.shift();B.push({n,x:.5+r*d,y:(c-r/2)*w,vx:0,vy:0,a:1,pk:0})}
 B.sort((a,b)=>a.n-b.n);return B}
function poolSyncMeshes(B){B.forEach((b,i)=>{const m=PBALLS[b.n];m.position.set(b.x,PBR,b.y);m.scale.setScalar(1);m.visible=b.a&&!b.pk||false;b.m=m})}
/* ---------- game ---------- */
const pCanEight=g=>PL.b.filter(b=>b.a&&!b.pk&&b.n>0&&b.n!==8&&pGrp(b.n)===g).length===0;
function pLegal(n,who){const g=PL.grp[who];if(g===null)return n!==8;if(pCanEight(g))return n===8;return n!==8&&pGrp(n)===g}
function poolOpen(){if(PL||!window.PG)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;document.body.classList.add('dz');man.visible=false;if(window.DMAN)DMAN.visible=false;PMAN.visible=true;
 const stake=cash>=2?2:0;if(stake)cash-=2;POOLS.n++;
 const B=poolNewBalls(Math.random);poolSyncMeshes(B);
 const ov=document.createElement('div');ov.id='plov';ov.style.cssText='position:fixed;inset:0;z-index:60;font:bold 13px monospace;color:#fff;touch-action:none;user-select:none;-webkit-user-select:none';
 const hud=document.createElement('div');hud.style.cssText='position:absolute;left:0;right:0;top:6px;text-align:center;pointer-events:none;text-shadow:2px 2px 0 #000';hud.innerHTML='<div style="color:#f5e6a0;font-size:15px">POOL vs OLD ARTHUR'+(stake?' · STAKE £'+stake:' · PRACTICE')+'</div><div id="plS" style="font-size:13px;margin-top:2px"></div><div id="plM" style="min-height:20px;color:#9fe;font-size:13px"></div>';
 const grp=document.createElement('div');grp.id='plG';grp.style.cssText='position:absolute;left:6px;top:64px;pointer-events:none;text-shadow:1px 1px 0 #000;font-size:11px;background:rgba(0,0,0,.35);padding:4px 6px;border-radius:6px';
 const bs='position:absolute;font:bold 16px monospace;border:3px solid #f5e6a0;border-radius:10px;color:#fff;touch-action:manipulation;pointer-events:auto;';
 const mkb=(t,css,fn)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText=bs+css;b.onclick=fn;return b};
 const lv=mkb('LEAVE','right:8px;top:6px;font-size:12px;padding:7px 10px;background:#333',()=>poolClose(1));
 const sh=mkb('SHOOT','right:12px;bottom:12px;padding:16px 22px;font-size:20px;background:#b02020',()=>poolGo());
 const pw=document.createElement('div');pw.style.cssText='position:absolute;right:14px;bottom:100px;width:46px;height:'+Math.min(170,innerHeight*.34)+'px;border:3px solid #f5e6a0;border-radius:10px;background:rgba(0,0,0,.5);pointer-events:auto;touch-action:none;overflow:hidden';
 const pf=document.createElement('div');pf.style.cssText='position:absolute;left:0;right:0;bottom:0;background:linear-gradient(0deg,#3a3,#fd3,#e33);height:60%';pw.append(pf);const pl=document.createElement('div');pl.textContent='POWER';pl.style.cssText='position:absolute;right:8px;bottom:'+(100+Math.min(170,innerHeight*.34)+10)+'px;font-size:11px;pointer-events:none;text-shadow:1px 1px 0 #000;width:60px;text-align:center';
 const setPw=e=>{const r=pw.getBoundingClientRect();PL.pw=Math.max(.08,Math.min(1,1-(e.clientY-r.top)/r.height));pf.style.height=PL.pw*100+'%'};
 pw.onpointerdown=e=>{e.stopPropagation();pw.setPointerCapture(e.pointerId);PL.pd=1;setPw(e)};pw.onpointermove=e=>{if(PL.pd)setPw(e)};pw.onpointerup=()=>{PL.pd=0};
 const fa=(d)=>{const b=mkb(d<0?'◀':'▶',(d<0?'left:12px':'left:72px')+';bottom:14px;padding:14px 18px;font-size:20px;background:#335',()=>{});b.onpointerdown=e=>{e.stopPropagation();PL.fine=d;try{b.setPointerCapture(e.pointerId)}catch(_){}};b.onpointerup=b.onpointercancel=()=>{PL.fine=0};return b};
 ov.append(hud,grp,lv,pw,pl,sh,fa(-1),fa(1));document.body.append(ov);
 const P=PL={ov,b:B,a:0,pw:.6,pf,cur:0,grp:[null,null],ph:'zoom',t:0,pot:[],first:null,brk:1,stake,last:performance.now(),cp:[0,0,0],cl:[0,0,0],cpI:0,fine:0,drag:0,msg:'',keys:{},aiS:0,over:0,st:0,shotP:0,gt:0};
 ov.onpointerdown=e=>{if(P.ph!=='aim')return;P.drag=1;P.lx=e.clientX;try{ov.setPointerCapture(e.pointerId)}catch(_){}};ov.onpointermove=e=>{if(P.drag&&P.ph==='aim'){P.a+=(e.clientX-P.lx)*.0042;P.lx=e.clientX}};ov.onpointerup=()=>{P.drag=0};
 P.kd=e=>{P.keys[e.key]=1;if(e.key===' ')poolGo()};P.ku=e=>{P.keys[e.key]=0};addEventListener('keydown',P.kd);addEventListener('keyup',P.ku);
 poolDefAim();poolCamSet(1);DZ.fn=poolCam;DZ.fov=58;DZ.tp=poolCam();DZ.look=new THREE.Vector3();DZ.on=1;poolCam();poolHud();
 P.raf=requestAnimationFrame(poolLoop)}
function poolMsg(t,ms){PL.msg=t;const e=document.getElementById('plM');if(e)e.textContent=t;PL.mt=ms||2500}
function poolDefAim(){const P=PL,c=P.b[0];let best=null,bd=9;for(const b of P.b){if(!b.a||b.pk||b.n===0||!pLegal(b.n,P.cur))continue;const d=Math.hypot(b.x-c.x,b.y-c.y);if(d<bd){bd=d;best=b}}if(best)P.a=Math.atan2(best.y-c.y,best.x-c.x)}
function poolGo(){const P=PL;if(!P||P.ph!=='aim'||P.cur!==0)return;poolFire(P.a,P.pw)}
function poolFire(a,pw){const P=PL;P.shA=a;P.shP=pw;P.pot=[];P.first=null;P.canEight=P.grp[P.cur]!==null&&pCanEight(P.grp[P.cur]);P.ph='stroke';P.st=0;P.a=a;P.pw=pw;PGL.forEach(q=>q.visible=false)}
function poolCam(){const P=PL;if(!P)return new THREE.Vector3();DZ.look=SG.localToWorld(new THREE.Vector3(P.cl[0],P.cl[1],P.cl[2]));return SG.localToWorld(new THREE.Vector3(P.cp[0],P.cp[1],P.cp[2]))}
function poolCamTgt(){const P=PL,c=P.b[0],X=PLTC[0],Z=PLTC[1],aim=P.ph==='aim'||P.ph==='stroke'||P.ph==='zoom'||(P.ph==='ai'&&P.aiS<2)||(P.ph==='pause'&&P.cur===0&&0);let ep,lp;
 if(aim){const dx=Math.cos(P.a),dz=Math.sin(P.a),cx=X+c.x,cz=Z+c.y;ep=[cx-dx*1.25,PTY+.72,cz-dz*1.25];lp=[cx+dx*.7,PTY+.03,cz+dz*.7]}
 else if((cam.aspect||1.6)<1){ep=[X-1.8,PTY+1.75,Z];lp=[X+.1,PTY,Z]}else{ep=[X,PTY+1.6,Z+1.5];lp=[X,PTY,Z-.05]}return[ep,lp,aim]}
function poolCamSet(snap){const P=PL,[ep,lp]=poolCamTgt();P.cp=ep.slice();P.cl=lp.slice()}
function poolCamUpd(dt){const P=PL,[ep,lp,aim]=poolCamTgt(),k=1-Math.exp(-dt*(aim?9:2.8));for(let i=0;i<3;i++){P.cp[i]+=(ep[i]-P.cp[i])*k;P.cl[i]+=(lp[i]-P.cl[i])*k}}
function poolHud(){const P=PL,g=document.getElementById('plG');if(!g)return;const dot=(n,off)=>'<span style="display:inline-block;width:15px;height:15px;border-radius:8px;margin:0 1px;text-align:center;line-height:15px;font-size:9px;color:'+(n===8?'#fff':'#111')+';background:'+PLCOL[n>8?n-8:n]+';opacity:'+(off?.18:1)+';'+(n>8?'box-shadow:inset 0 0 0 3px #fff':'')+'">'+n+'</span>';
 const row=(who,nm)=>{const gr=P.grp[who];if(gr===null)return nm+': OPEN';const ns=gr===0?[1,2,3,4,5,6,7]:[9,10,11,12,13,14,15];ns.push(8);return nm+(gr===0?' (SOLIDS)':' (STRIPES)')+'<br>'+ns.map(n=>dot(n,P.b[n].pk||!P.b[n].a)).join('')};
 g.innerHTML=row(0,'YOU')+'<br>'+row(1,'ARTHUR');const s=document.getElementById('plS');if(s)s.textContent=P.over?'':P.cur===0?'YOUR SHOT':'ARTHUR\'S SHOT'}
function poolLoop(now){const P=PL;if(!P)return;const dt=Math.min(.05,(now-P.last)/1000);P.last=now;poolStep(dt);poolCamUpd(dt);poolDraw(dt);P.raf=requestAnimationFrame(poolLoop)}
function poolStep(dt){const P=PL;if(P.mt>0){P.mt-=dt*1000;if(P.mt<=0){const e=document.getElementById('plM');if(e)e.textContent=''}}
 if(P.ph==='zoom'){if(DZ.k>=.97){P.ph='aim';poolMsg('DRAG TO AIM. SET POWER. HIT SHOOT. BREAK THE RACK!',4500)}return}
 if(P.ph==='aim'){const f=P.fine||(P.keys.ArrowRight?1:P.keys.ArrowLeft?-1:0);if(f)P.a+=f*dt*(P.fine?.5:.8);if(P.keys.ArrowUp)P.pw=Math.min(1,P.pw+dt*.6);if(P.keys.ArrowDown)P.pw=Math.max(.08,P.pw-dt*.6);P.pf.style.height=P.pw*100+'%'}
 if(P.ph==='ai'){P.t-=dt;if(P.aiS===0&&P.t<=0){P.plan=poolPlan(1);P.aiS=1;P.t=1.0}else if(P.aiS===1){let d=P.plan.ang-P.a;while(d>Math.PI)d-=6.2832;while(d<-Math.PI)d+=6.2832;P.a+=d*Math.min(1,dt*4);P.t-=0;if(P.t<=0&&Math.abs(d)<.02){P.aiS=2;P.t=.35}else if(P.t<-1.6)P.aiS=2}else if(P.aiS===2&&P.t<=0){poolFire(P.a,P.plan.pw);P.aiS=3}else if(P.aiS===2)P.t-=0}
 if(P.ph==='stroke'){P.st+=dt;if(P.st>=.16){const c=P.b[0],v=PVM*Math.pow(P.shP,1.15);c.vx=Math.cos(P.shA)*v;c.vy=Math.sin(P.shA)*v;P.ph='roll';P.gt=0;beep(220,.06,'square',.06)}}
 if(P.ph==='roll'){P.gt+=dt;poolPhys(dt);let mv=0;for(const b of P.b)if(b.a&&!b.pk&&(b.vx||b.vy))mv=1;if((!mv&&P.gt>.25)||P.gt>16){for(const b of P.b){b.vx=b.vy=0}poolEval()}}
 if(P.ph==='pause'){P.t-=dt;if(P.t<=0){if(P.over)poolEnd();else poolTurn()}}
 for(const b of P.b){if(b.pk){b.pt+=dt;const u=Math.min(1,b.pt/.38);b.m.position.set(b.px*(1-u*.2)+b.x*0,PBR-u*.07,b.py*(1-u*.2));b.m.scale.setScalar(Math.max(.01,1-u*.9));if(u>=1){b.m.visible=false;b.pk=2;b.a=0}}}}
function poolPhys(dt){const P=PL,B=P.b;let clk=0;for(let s=0;s<4;s++){const h=dt/4;
 for(const b of B){if(!b.a||b.pk)continue;const sp=Math.hypot(b.vx,b.vy);if(sp>0){const ns=sp-(.4+.35*sp)*h;if(ns<=.012){b.vx=b.vy=0}else{b.vx*=ns/sp;b.vy*=ns/sp}b.x+=b.vx*h;b.y+=b.vy*h}
  for(const pk of PPOCK){if(Math.hypot(b.x-pk[0],b.y-pk[1])<pk[2]){b.pk=1;b.pt=0;b.px=pk[0];b.py=pk[1];b.vx=b.vy=0;P.pot.push(b.n);beep(180,.15,'sine',.07);break}}
  if(b.pk)continue;const mx=PHL-PBR,my=PHW-PBR;if(b.x>mx){b.x=mx;b.vx=-Math.abs(b.vx)*.72;clk=1}else if(b.x<-mx){b.x=-mx;b.vx=Math.abs(b.vx)*.72;clk=1}if(b.y>my){b.y=my;b.vy=-Math.abs(b.vy)*.72;clk=1}else if(b.y<-my){b.y=-my;b.vy=Math.abs(b.vy)*.72;clk=1}}
 for(let i=0;i<16;i++){const A=B[i];if(!A.a||A.pk)continue;for(let j=i+1;j<16;j++){const C=B[j];if(!C.a||C.pk)continue;const dx=C.x-A.x,dy=C.y-A.y,d2=dx*dx+dy*dy,m=2*PBR;if(d2<m*m&&d2>1e-10){const d=Math.sqrt(d2),nx=dx/d,ny=dy/d,rv=(C.vx-A.vx)*nx+(C.vy-A.vy)*ny,ov=(m-d)/2;A.x-=nx*ov;A.y-=ny*ov;C.x+=nx*ov;C.y+=ny*ov;if(rv<0){const J=-(1+.95)*rv/2;A.vx-=J*nx;A.vy-=J*ny;C.vx+=J*nx;C.vy+=J*ny;if(P.first===null&&(A.n===0||C.n===0))P.first=A.n===0?C.n:A.n;if(-rv>.15)clk=Math.max(clk,-rv)}}}}}
 const now=performance.now();if(clk&&now-(P.ck||0)>45){P.ck=now;beep(1300+Math.random()*300,.025,'sine',Math.min(.07,.02+.02*clk))}}
function poolDraw(dt){const P=PL,gl=PGL[0],gh=PGL[1],tl=PGL[2];
 for(const b of P.b){if(!b.a||b.pk)continue;const m=b.m;m.position.set(b.x,PBR,b.y);const sp=Math.hypot(b.vx,b.vy);if(sp>.001){const ax=new THREE.Vector3(b.vy,0,-b.vx).normalize();m.rotateOnWorldAxis(ax,sp*dt/PBR)}}
 const c=P.b[0],cue=PCUE;
 if(P.ph==='aim'||P.ph==='stroke'||(P.ph==='ai'&&P.aiS<4)){cue.visible=c.a&&!c.pk;const dx=Math.cos(P.a),dz=Math.sin(P.a);let gap=.015+P.pw*.17;if(P.ph==='stroke')gap=Math.max(.0,(.015+P.shP*.17)*(1-P.st/.16));if(P.ph==='ai'&&P.aiS>=2)gap=.1;
  cue.position.set(c.x-dx*(PBR+gap),PBR*1.05,c.y-dz*(PBR+gap));cue.rotation.y=-P.a}else cue.visible=false;
 if(P.ph==='aim'&&c.a){const dx=Math.cos(P.a),dy=Math.sin(P.a),r=poolPredict(c,dx,dy);gl.visible=gh.visible=true;gl.scale.x=Math.max(.01,r.t);gl.position.set(c.x+dx*r.t/2,.006,c.y+dy*r.t/2);gl.rotation.y=-P.a;gh.position.set(c.x+dx*r.t,.006,c.y+dy*r.t);
  if(r.b){const nx=r.b.x-(c.x+dx*r.t),ny=r.b.y-(c.y+dy*r.t),L=Math.hypot(nx,ny)||1,ang=Math.atan2(ny,nx);tl.visible=true;tl.scale.x=.22;tl.position.set(r.b.x+nx/L*.11,.006,r.b.y+ny/L*.11);tl.rotation.y=-ang}else tl.visible=false}
 else if(P.ph!=='aim'){PGL.forEach(q=>q.visible=false)}
 if(PMAN){const tgtV=(P.ph==='ai'||P.ph==='roll'||P.ph==='stroke')&&P.cur===1;const X=PLTC[0],Z=PLTC[1];if(P.cur===1&&(P.ph==='ai'||P.ph==='stroke')){const dx=Math.cos(P.a),dz=Math.sin(P.a);PMAN.position.x=X+c.x-dx*.45+dz*.6;PMAN.position.z=Z+c.y-dz*.45-dx*.6;PMAN.rotation.y=Math.atan2(dx,dz)}else{PMAN.position.x+=(X-1.6-PMAN.position.x)*Math.min(1,dt*2);PMAN.position.z+=(Z+.9-PMAN.position.z)*Math.min(1,dt*2);PMAN.rotation.y=Math.PI/2}}}
function poolPredict(c,dx,dy){let t=9,bb=null;for(const b of PL.b){if(b.n===0||!b.a||b.pk)continue;const wx=b.x-c.x,wy=b.y-c.y,p=wx*dx+wy*dy;if(p<0)continue;const d2=wx*wx+wy*wy-p*p,m=2*PBR;if(d2>m*m)continue;const tt=p-Math.sqrt(m*m-d2);if(tt<t){t=tt;bb=b}}
 const mx=PHL-PBR,my=PHW-PBR;let tw=9;if(dx>1e-6)tw=Math.min(tw,(mx-c.x)/dx);else if(dx<-1e-6)tw=Math.min(tw,(-mx-c.x)/dx);if(dy>1e-6)tw=Math.min(tw,(my-c.y)/dy);else if(dy<-1e-6)tw=Math.min(tw,(-my-c.y)/dy);if(tw<t){t=tw;bb=null}return{t:Math.max(.02,t),b:bb}}
function poolEval(){const P=PL,me=P.cur,pot=P.pot.slice(),cueP=pot.includes(0),o8=pot.includes(8),obj=pot.filter(n=>n>0&&n!==8);let foul=false,msg='',lose=0,win=0;const mine=P.grp[me];
 if(P.brk&&o8){const b8=P.b[8];b8.a=1;b8.pk=0;b8.x=.5;b8.y=0;b8.vx=b8.vy=0;b8.m.visible=true;b8.m.scale.setScalar(1);pot.splice(pot.indexOf(8),1);msg='8 BALL RE-SPOTTED. '}
 else if(o8){if(P.canEight&&!cueP&&P.first===8)win=1;else lose=1}
 if(cueP){foul=true;msg+='SCRATCH! '}else if(P.first===null){foul=true;msg+='MISSED EVERYTHING! '}
 else if(!(P.brk)){const ok=mine===null?P.first!==8:(P.canEight?P.first===8:(P.first!==8&&pGrp(P.first)===mine));if(!ok){foul=true;msg+='WRONG BALL FIRST! '}}
 let good=0;if(!foul){if(mine===null&&obj.length){const g=pGrp(obj[0]);P.grp[me]=g;P.grp[1-me]=1-g;msg+=(me===0?'YOU ARE ':'ARTHUR IS ')+(g===0?'SOLIDS. ':'STRIPES. ');good=obj.length}else if(mine!==null)good=obj.filter(n=>pGrp(n)===mine).length}
 if(win||lose){P.over=1;P.won=win?me:1-me;poolMsg(win?(me===0?'YOU SINK THE 8 BALL!':'ARTHUR SINKS THE 8 BALL'):(me===0?'8 BALL TOO EARLY. YOU LOSE':'ARTHUR BLEW THE 8 BALL. YOU WIN!'),5000);P.ph='pause';P.t=1.8;poolHud();return}
 P.brk=0;let next=me;if(foul||!good){next=1-me;if(foul){msg+=me===0?'ARTHUR TAKES OVER.':'YOUR SHOT.';poolPlaceCue()}else msg+=me===0?'NOTHING POTTED. ARTHUR\'S GO.':'YOUR SHOT.'}else msg+=me===0?'NICE! GO AGAIN.':'ARTHUR POTS ANOTHER.';
 P.cur=next;poolMsg(msg,3500);poolHud();P.ph='pause';P.t=1.5}
function poolPlaceCue(){const c=PL.b[0];for(const[x,y]of[[-.5,0],[-.62,0],[-.5,.12],[-.5,-.12],[-.7,.1],[-.7,-.1],[-.3,0],[0,0]]){if(PL.b.every(b=>b.n===0||!b.a||b.pk||Math.hypot(b.x-x,b.y-y)>PBR*2.2)){c.x=x;c.y=y;break}}c.a=1;c.pk=0;c.vx=c.vy=0;c.m.visible=true;c.m.scale.setScalar(1)}
function poolTurn(){const P=PL;P.pot=[];P.first=null;if(P.cur===0){P.ph='aim';poolDefAim();P.pw=Math.max(.45,Math.min(.8,P.pw));P.pf.style.height=P.pw*100+'%'}else{P.ph='ai';P.aiS=0;P.t=1.1}poolHud()}
function poolPlan(who){const P=PL,cue=P.b[0],B=P.b,cands=B.filter(b=>b.a&&!b.pk&&b.n>0&&pLegal(b.n,who));let best=null;
 const segD=(ax,ay,bx,by,px,py)=>{const dx=bx-ax,dy=by-ay,L2=dx*dx+dy*dy||1e-9;let t=((px-ax)*dx+(py-ay)*dy)/L2;t=Math.max(0,Math.min(1,t));return Math.hypot(px-(ax+dx*t),py-(ay+dy*t))};
 for(const b of cands)for(const pk of PPOCK){const dx=pk[0]-b.x,dy=pk[1]-b.y,L=Math.hypot(dx,dy),gx=b.x-dx/L*2*PBR,gy=b.y-dy/L*2*PBR;if(Math.abs(gx)>PHL-PBR||Math.abs(gy)>PHW-PBR)continue;const cx=gx-cue.x,cy=gy-cue.y,D=Math.hypot(cx,cy),cs=(cx*dx+cy*dy)/(D*L+1e-9);if(cs<.4)continue;
  let ok=true;for(const o of B){if(!o.a||o.pk||o===cue||o===b)continue;if(segD(cue.x,cue.y,gx,gy,o.x,o.y)<2*PBR*.97||segD(b.x,b.y,pk[0],pk[1],o.x,o.y)<2*PBR*.97){ok=false;break}}if(!ok)continue;const sc=cs*2-D*.35-L*.3;if(!best||sc>best.sc)best={sc,ang:Math.atan2(cy,cx),D,L}}
 let hard=0;if(!best){hard=1;let bd=9,bb=null;for(const b of cands){const d=Math.hypot(b.x-cue.x,b.y-cue.y);if(d<bd){bd=d;bb=b}}if(!bb)bb=B[8];best={ang:Math.atan2(bb.y-cue.y,bb.x-cue.x),D:bd,L:.6}}
 const g=()=>(Math.random()+Math.random()+Math.random()-1.5)*.8;let ang=best.ang+g()*.03+(Math.random()<.12?g()*.12:0);const pw=Math.max(.32,Math.min(.95,(.3+(best.D+best.L)*.3)*(1+g()*.15)));return{ang,pw}}
function poolEnd(){const P=PL;POOLS[P.won===0?'w':'l']++;let t;if(P.won===0){const w=P.stake?P.stake*3:0;cash+=w;t='YOU WIN!'+(w?' +£'+w:'');beep(660,.12,'square',.06);setTimeout(()=>beep(880,.12,'square',.06),130);setTimeout(()=>beep(1180,.2,'square',.06),260)}else{t='ARTHUR WINS'+(P.stake?'. STAKE LOST':'.');beep(200,.4,'sawtooth',.06)}
 const d=document.createElement('div');d.style.cssText='position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);text-align:center;background:rgba(0,0,0,.75);border:3px solid #f5e6a0;border-radius:12px;padding:14px 20px;pointer-events:auto;font-size:16px';d.innerHTML='<div style="font-size:22px;color:#ffd840;margin-bottom:6px">'+t+'</div><div style="font-size:12px;color:#ccc;margin-bottom:10px">WON '+POOLS.w+' · LOST '+POOLS.l+'</div>';
 const bt2=(x,fn,c)=>{const b=document.createElement('button');b.textContent=x;b.style.cssText='font:bold 14px monospace;padding:10px 14px;margin:4px;border:3px solid #f5e6a0;border-radius:10px;color:#fff;background:'+c;b.onclick=fn;return b};
 d.append(bt2('REMATCH (£2)',()=>{poolClose(0);poolOpen()},'#2a7a3a'),bt2('LEAVE',()=>poolClose(0),'#333'));P.ov.append(d);P.ph='done'}
function poolClose(q){const P=PL;if(!P)return;cancelAnimationFrame(P.raf);removeEventListener('keydown',P.kd);removeEventListener('keyup',P.ku);P.ov.remove();if(q&&P.ph!=='done'&&P.stake)toast('YOU WALKED OFF. STAKE LOST');PL=null;PGL.forEach(q2=>q2.visible=false);PCUE.visible=false;PMAN.visible=false;if(window.DMAN)DMAN.visible=true;poolSyncMeshes(poolNewBalls(Math.random));DZ.fn=null;DZ.fov=46;DZ.on=0;document.body.classList.remove('dz');man.visible=true;DZ.exit=1}
{const b0=buildShop;buildShop=function(o){RX=o.rx||4.2;b0(o);if(!o.pub)return;pubExpand();poolBuild()}}
{const u0=updCozy;updCozy=function(dt){u0(dt);{const w=GS.inside&&SHOPCUR?(SHOPCUR.o.pub?6.3:(SHOPCUR.o.rx||4.2)):4.2;if(RX!==w)RX=w}}}
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.pl=POOLS;return o};cozyLoad=function(z){l0(z);if(z&&z.pl)POOLS=z.pl}}
