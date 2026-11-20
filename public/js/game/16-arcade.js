/* ---------- building ---------- */
function arPix(w,h,fn){const f=cvT(w,h),g=f.cv.getContext('2d');g.imageSmoothingEnabled=false;fn(g,w,h);f.tx.magFilter=THREE.NearestFilter;f.tx.needsUpdate=true;return f.tx}
function arScreenTex(k){return arPix(64,48,(g,w,h)=>{g.fillStyle='#05050c';g.fillRect(0,0,w,h);const R=(x,y,a,b,c)=>{g.fillStyle=c;g.fillRect(x,y,a,b)};for(let i=0;i<14;i++)R((i*37)%64,(i*17)%48,1,1,'#fff');
 if(k===0){for(let r=0;r<3;r++)for(let c=0;c<6;c++)R(8+c*8,8+r*7,5,4,['#40ff60','#40d0ff','#ff4060'][r]);R(28,40,8,3,'#ffa020')}
 else if(k===1){for(let r=0;r<4;r++)for(let c=0;c<7;c++)R(5+c*8,6+r*4,7,3,['#ff4060','#ffa020','#ffe040','#40e060'][r]);R(26,42,12,2,'#fff');R(30,30,2,2,'#fff')}
 else if(k===2){R(14,0,36,48,'#303038');for(let i=0;i<4;i++)R(31,i*12,2,6,'#fff');R(22,36,8,8,'#ffa020');R(36,14,8,8,'#40a0ff');R(38,2,3,3,'#ffe040')}
 else if(k===3){for(let r=0;r<2;r++)for(let c=0;c<3;c++){R(8+c*17,10+r*18,12,6,'#201008');R(11+c*17,(r+c)%2?6+r*18:10+r*18,6,6,'#a06030')}}
 else if(k===5){R(6,4,52,40,'#1a3a7a');R(31,4,2,40,'#f44');R(26,20,12,8,'#2060c0');R(30,22,4,4,'#fff');R(24,34,6,6,'#f44');R(34,8,6,6,'#40c0ff')}
 else if(k===6){R(0,34,64,14,'#303040');R(10,14,8,20,'#ff9020');R(12,8,5,6,'#e0a070');R(18,18,10,4,'#e0a070');R(44,16,8,18,'#a040c0');R(46,10,5,6,'#e0a070');R(40,20,4,3,'#e0a070')}
 else if(k===7){for(let i=0;i<10;i++)R(10+i*3,20,3,3,i?'#60ff40':'#e0ff80');R(40,20,3,3,'#f44');R(40,22,3,10,'#60ff40');R(20,32,10,3,'#60ff40')}
 else if(k===9){R(0,24,64,24,'#30a040');R(14,24,36,24,'#555a66');R(31,24,2,24,'#fff');R(0,0,64,24,'#4a8ae0');R(26,34,12,8,'#ff9020')}
 else if(k===10){R(4,4,56,40,'#201050');R(16,10,8,8,'#ff40c0');R(36,14,8,8,'#40e0ff');R(26,24,8,8,'#ffe040');R(14,38,12,3,'#ddd');R(38,38,12,3,'#ddd');R(31,30,3,3,'#fff')}
 else if(k===8){R(0,36,64,12,'#306a30');R(14,26,14,8,'#c08040');R(26,22,6,6,'#c08040');R(18,34,3,6,'#a06030');R(24,34,3,6,'#a06030');R(44,30,6,6,'#808088');R(52,16,8,3,'#ffd040')}
 else{R(6,6,52,36,'#1a2a50');for(let i=0;i<6;i++)R(8+i*8,30+(i%2)*4,6,8,['#ff4090','#40e0ff','#ffe040'][i%3]);R(30,4,2,16,'#c0c0c8');R(26,20,10,3,'#c0c0c8')}})}
function arCab(x,z,ry,k,decor){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;SG.add(g);const B=(px,py,pz,w,h,d,hex)=>gbox(g,px,py,pz,w,h,d,hex),col=decor?[0xff4040,0x40a0ff,0xffd020,0x40e060][k%4]:ARC[k];
 B(0,0,0,1.0,1.25,.8,0x16161e);B(0,1.25,-.12,1.0,.8,.56,0x16161e);B(-.52,0,0,.05,2.0,.8,col);B(.52,0,0,.05,2.0,.8,col);B(0,2.05,-.1,1.04,.3,.6,col);
 const mq=new THREE.Mesh(new THREE.PlaneGeometry(.9,.24),new THREE.MeshBasicMaterial({map:txtTex(128,34,'#0a0a12','#ffffff',decor?['STAR RAID','PIT STOP','DRAGON','GALAXY'][k%4]:ARN[k],decor?18:13),fog:false}));mq.position.set(0,2.2,.205);g.add(mq);
 const sc=new THREE.Mesh(new THREE.PlaneGeometry(.82,.62),new THREE.MeshBasicMaterial({map:arScreenTex(decor?(k+1)%5:k),fog:false}));sc.position.set(0,1.62,.17);sc.rotation.x=-.28;g.add(sc);
 B(0,1.05,.2,1.0,.1,.5,0x2a2a34);B(-.2,1.15,.3,.04,.14,.04,0xc0c0c8);B(-.2,1.27,.3,.09,.09,.09,0xff2020);for(let i=0;i<3;i++)B(.06+i*.14,1.15,.3,.08,.04,.08,[0xff4040,0x4080ff,0xffe040][i]);
 B(0,.45,.41,.26,.34,.03,0x707078);B(0,.58,.43,.04,.1,.02,0x101014);B(0,.2,.41,.5,.04,.03,col);return g}
function arClaw(x,z,ry){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;SG.add(g);const B=(px,py,pz,w,h,d,hex)=>gbox(g,px,py,pz,w,h,d,hex);
 B(0,0,0,1.7,.9,1.5,0x6a1a8a);B(0,.9,0,1.7,.06,1.5,0x2a2a34);for(const sx of[-.82,.82])for(const sz of[-.72,.72])B(sx,.9,sz,.06,1.5,.06,0xc0c0c8);B(0,2.4,0,1.74,.22,1.54,0xc060ff);
 const gl=new THREE.Mesh(new THREE.BoxGeometry(1.64,1.4,1.4),new THREE.MeshBasicMaterial({color:0x80d0ff,transparent:true,opacity:.22,fog:false,depthWrite:false}));gl.position.set(0,1.62,0);g.add(gl);
 for(let i=0;i<18;i++){B(-.7+(i%6)*.28,.96+((i*7)%3)*.12*(i%2),-.5+Math.floor(i/6)*.4,.22,.22,.22,[0xff4090,0x40e0ff,0xffe040,0x60ff60,0xff8030][i%5])}
 B(.1,1.9,0,.05,.35,.05,0xe0e0e8);B(.1,1.84,0,.22,.05,.05,0xe0e0e8);B(0,2.15,0,1.4,.05,.1,0x808088);
 const ttl=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.3),new THREE.MeshBasicMaterial({map:txtTex(160,34,'#c060ff','#fff','CLAW GRABBER',16),fog:false}));ttl.position.set(0,2.51,.78);g.add(ttl);
 B(0,1.0,.8,.6,.16,.4,0x2a2a34);B(-.15,1.16,.8,.04,.14,.04,0xc0c0c8);B(.12,1.16,.8,.1,.05,.1,0xff2020);return g}
function buildArcade(o){while(SG.children.length)SG.remove(SG.children[0]);o.rx=7;o.rz=10;o.sz=8.3;RX=7;RZ=10;IA.splice(0,IA.length);IROOM.splice(0,IROOM.length);
 const W=(x,y,z,w,h,d,hex)=>gbox(SG,x,y,z,w,h,d,hex);
 const fl=cvT(256,256),g=fl.cv.getContext('2d');g.fillStyle='#120a24';g.fillRect(0,0,256,256);const cl=['#ff40c0','#20e0ff','#ffe040','#60ff60','#c060ff'];for(let i=0;i<90;i++){g.fillStyle=cl[i%5];const x=(i*53)%250,y=(i*97)%250;g.globalAlpha=.8;if(i%3===0)g.fillRect(x,y,6,6);else if(i%3===1){g.fillRect(x,y,12,3)}else{g.beginPath();g.moveTo(x,y);g.lineTo(x+8,y+4);g.lineTo(x+2,y+9);g.fill()}}g.globalAlpha=1;fl.tx.magFilter=THREE.NearestFilter;fl.tx.wrapS=fl.tx.wrapT=THREE.RepeatWrapping;fl.tx.repeat.set(4,5);
 const fm=new THREE.Mesh(new THREE.PlaneGeometry(14,20).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:fl.tx}));fm.position.set(0,.02,0);SG.add(fm);
 W(0,0,-10.2,14.8,4.4,.4,0x30205a);W(0,0,10.2,14.8,4.4,.4,0x2a1a4a);W(-7.2,0,0,.4,4.4,20.4,0x3a2470);W(7.2,0,0,.4,4.4,20.4,0x3a2470);W(0,4.3,0,14.8,.3,20.4,0x0c0818);
 for(let i=0;i<7;i++){W(0,4.15,-8.5+i*2.8,13,.06,.12,[0xff40c0,0x20e0ff][i%2])}
 W(-7.0,1.2,0,.08,.1,20,0xff40c0);W(7.0,1.2,0,.08,.1,20,0xff40c0);W(-7.0,3.6,0,.08,.1,20,0x20e0ff);W(7.0,3.6,0,.08,.1,20,0x20e0ff);
 W(-3.2,0,9.9,7.6,4.2,.4,0x2a1a4a);W(4.6,0,9.9,5.8,4.2,.4,0x2a1a4a);W(1.6,3.2,9.9,2.4,1,.4,0x2a1a4a);sPlane(1.2,.45,1.6,3.45,9.65,Math.PI,txtTex(128,40,'#14141a','#30e060','EXIT',26));
 sPlane(4.6,1.0,-3.4,2.8,9.65,Math.PI,txtTex(300,64,'#14082a','#ff50e8','NEON ARCADE',38));sPlane(2.6,.5,4.6,2.4,9.65,Math.PI,txtTex(192,34,'#14082a','#20e0ff','£1 A GO · WIN TICKETS',14));
 sPlane(6.4,1.1,0,3.6,-9.95,0,txtTex(420,76,'#14082a','#ffe040','★ NEON ARCADE ★',42));
 const bx=[-4.8,-1.6,1.6,4.8];for(let i=0;i<4;i++){arCab(bx[i],-9.3,0,i);IROOM.push([bx[i]-.6,bx[i]+.6,-10,-8.4]);IA.push({r:[bx[i]-1.1,bx[i]+1.1,-8.4,-6.6],label:()=>'PLAY '+ARN[i]+' · £1'+(ARP.best[i]?' · BEST '+ARP.best[i]:''),fn:()=>arOpen(i)})}
 const lz=[[6,-6.4],[7,-4.2],[8,-2.0],[9,4.9],[10,6.9]];for(const [k,z] of lz){arCab(-6.5,z,Math.PI/2,k);IROOM.push([-7,-5.9,z-.6,z+.6]);IA.push({r:[-5.9,-4.4,z-1.0,z+1.0],label:()=>'PLAY '+ARN[k]+' · £1'+(ARP.best[k]?' · BEST '+ARP.best[k]:''),fn:()=>arOpen(k)})}
 arClaw(-6.4,2.2,Math.PI/2);IROOM.push([-7,-5.5,1.3,3.1]);IA.push({r:[-5.4,-3.8,1.0,3.4],label:()=>'PLAY '+ARN[4]+' · £1'+(ARP.best[4]?' · BEST '+ARP.best[4]:''),fn:()=>arOpen(4)});
 // air hockey table (playable)
 W(0,0,-3.2,1.7,.8,3.2,0x1a3a6a);W(0,.8,-3.2,1.5,.05,3.0,0xe8f0ff);W(0,.85,-3.2,.04,.02,3.0,0xff4040);W(0,.85,-3.2,.5,.02,.5,0x20a0ff);W(0,.86,-3.2,.12,.04,.12,0x202020);W(-.4,.86,-2.5,.2,.06,.2,0xff4040);W(.4,.86,-3.9,.2,.06,.2,0x4080ff);for(const s of[-.82,.82])W(s,.8,-3.2,.06,.12,3.1,0xc0c0c8);
 W(0,2.1,-3.2,1.4,.06,.1,0xff40c0);W(0,1.7,-3.2,.04,.4,.04,0x606068);sPlane(1.4,.3,0,2.35,-3.2,0,txtTex(128,28,'#14082a','#fff','AIR HOCKEY',14));
 IROOM.push([-1.0,1.0,-4.9,-1.5]);IA.push({r:[-1.6,1.6,-1.5,0],label:()=>'PLAY AIR HOCKEY · £1'+(ARP.best[5]?' · BEST '+ARP.best[5]:''),fn:()=>arOpen(5)});
 // change machine + prize counter (right)
 W(6.5,0,-6.2,.8,2,1.2,0x2a6a3a);W(6.08,1.2,-6.2,.1,.5,.8,0x101014);sPlane(1.1,.4,6.02,1.75,-6.2,-Math.PI/2,txtTex(128,40,'#14141a','#60ff60','£ CHANGE',18));IROOM.push([6,7,-6.9,-5.5]);
 W(5.3,0,1.0,.9,1.0,6.0,0x3a1a5a);W(5.3,1.0,1.0,1.0,.08,6.2,0xff40c0);W(6.7,0,1.0,.6,2.2,6.2,0x1a1030);
 const pc=[0xff4090,0x40e0ff,0xffe040,0x60ff60,0xff8030,0xc060ff];for(let r=0;r<3;r++)for(let c=0;c<6;c++)W(6.4,.4+r*.6,-1.4+c*.9,.3,.42,.6,pc[(r*3+c)%6]);
 sPlane(2.6,.6,6.98,3.3,1,-Math.PI/2,txtTex(192,44,'#14082a','#ffe040','PRIZE COUNTER',22));IROOM.push([4.7,7,-2.4,4.4]);
 {const pp=pSpec(7200,{f:false,gl:false,scarf:null,bp:false,bag:0,old:false,ts:1,tc:[.9,.2,.6],bc:[.15,.15,.2],sc:[.1,.1,.1],sh:false,hs:1,beard:false});personIn(pp,6.0,1.2,-Math.PI/2,false)}
 IA.push({r:[3.2,4.6,-.6,3.4],label:()=>'PRIZE COUNTER · '+ARP.tix+' TICKETS',fn:()=>openShop('arcprize')});
 IA.push({r:[4.6,6,-7.2,-5.2],label:'CHANGE MACHINE (JUST FOR LOOKS)',fn:()=>say('KEV','Games are £1 each - the cash comes straight out of your pocket.',3400)});
 IA.push(LEAVE_IA());
 for(const [x,z,c] of [[-4,-6,0xff40c0],[4,-6,0x20e0ff],[-4,4,0x20e0ff],[4,5,0xff40c0],[0,0,0xffe040]])W(x,4.1,z,1.4,.08,.14,c)}
CUSTB['NEON ARCADE']={rx:7,fn:o=>buildArcade(o)};
/* ---------- prize counter ---------- */
const ARPZ=[{n:'£5 CASH-IN',t:40,fn:()=>{cash+=5;return '£5 INTO YOUR POCKET'}},{n:'£15 CASH-IN',t:100,fn:()=>{cash+=15;return '£15 INTO YOUR POCKET'}},{n:'NEON PINK SCARF',t:80,id:'acc:arp'},{n:'ARCADE CYAN SCARF',t:80,id:'acc:arc'},{n:'GOLDEN WINNER SHIRT',t:250,id:'top:arg'}];
CUSTOM_SHOP.arcprize=function(msg){document.getElementById('shT').textContent='PRIZE COUNTER';document.getElementById('shMsg').textContent=msg||'YOU HAVE '+ARP.tix+' TICKETS · WIN THEM IN THE GAMES';
 for(const p of ARPZ){const own=p.id&&CLOWN[p.id];dRow(p.n+'  ·  '+p.t+' TICKETS',[[own?'OWNED':'SWAP '+p.t,()=>{if(own)return;if(ARP.tix<p.t){beep(120,.2,'sawtooth',.08);return renderShop('NOT ENOUGH TICKETS')}ARP.tix-=p.t;arSave();let m;if(p.id){CLOWN[p.id]=1;try{cloSave()}catch(e){}m='YOURS! FIND IT IN THE CLOTHES SHOP'}else m=p.fn();beep(880,.1,'square',.06);setTimeout(()=>beep(1320,.14,'square',.06),90);renderShop(m)},own]])}};
/* ---------- game framework ---------- */
var AR=null;const AW=240,AH=320;
function arOpen(k){if(AR)return;if(cash<1){toast('NEED £1');beep(120,.2,'sawtooth',.08);return}cash-=1;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;beep(660,.08,'square',.05);
 const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:70;background:radial-gradient(#1a1030,#05030a);display:flex;flex-direction:column;align-items:center;justify-content:center;touch-action:none;user-select:none;-webkit-user-select:none;font:bold 13px ui-monospace,Menlo,monospace;color:#fff';
 ov.innerHTML='<div style="font-size:13px;color:'+'#'+ARC[k].toString(16).padStart(6,'0')+';text-shadow:2px 2px 0 #000;margin:4px 0">'+ARN[k]+'</div><div id="arw" style="position:relative;border:4px solid #444;border-radius:8px;box-shadow:0 0 18px #'+ARC[k].toString(16).padStart(6,'0')+'"><canvas id="arc" width="'+AW+'" height="'+AH+'" style="display:block;image-rendering:pixelated;background:#000;height:min(62vh,calc(100vh - 190px));aspect-ratio:3/4"></canvas><div style="position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0,rgba(0,0,0,.18) 1px,transparent 1px,transparent 3px)"></div><div id="arov" style="position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,.82);text-align:center;pointer-events:auto"></div></div><div id="arb" style="display:flex;gap:7px;margin-top:10px;flex-wrap:wrap;justify-content:center;max-width:100vw"></div>';
 document.body.appendChild(ov);const cv=ov.querySelector('#arc'),g=cv.getContext('2d');g.imageSmoothingEnabled=false;
 const S={k,w:AW,h:AH,sc:0,over:0,t:0,in:{l:0,r:0,f:0,x:null,y:null,tap:null,fp:0}};AR={ov,cv,g,S,raf:0,last:performance.now(),def:ARG[k]};AR.def.init(S);
 const btn=(t,key,dn,up)=>{const b=document.createElement('div');b.textContent=t;b.style.cssText='min-width:'+((AR.def.ui||[1,2,3]).length>4?50:t.length>2?84:60)+'px;padding:'+((AR.def.ui||[1,2,3]).length>4?'14px 5px':'15px 8px')+';text-align:center;border:3px solid #fff;border-radius:12px;background:'+(key==='f'?'#b02020':key==='k'?'#a05010':key==='j'?'#1a8a3a':'#1c4fa0')+';box-shadow:3px 3px 0 #000;touch-action:none;font-size:'+((AR.def.ui||[1,2,3]).length>4?10:t.length>2?11:15)+'px';b.onpointerdown=e=>{e.preventDefault();e.stopPropagation();dn()};b.onpointerup=b.onpointercancel=b.onpointerleave=e=>{up()};ov.querySelector('#arb').appendChild(b)};
 for(const [t,key] of (AR.def.ui||[['◀','l'],['FIRE','f'],['▶','r']]))btn(t,key,()=>{S.in[key]=1;S.in[key+'p']=1},()=>{S.in[key]=0});
 const ex=document.createElement('div');ex.textContent='EXIT';ex.style.cssText='position:absolute;right:8px;top:8px;padding:6px 10px;border:2px solid #fff;border-radius:8px;background:#333;font-size:11px';ex.onpointerdown=e=>{e.stopPropagation();arClose()};ov.appendChild(ex);
 const pt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]};
 cv.onpointerdown=e=>{e.preventDefault();const p=pt(e);S.in.x=p[0];S.in.y=p[1];S.in.tap=[p[0]*AW,p[1]*AH];S.in.fp=1;S.in.drag=1;S.in.sx=e.clientX;S.in.sy=e.clientY;try{cv.setPointerCapture(e.pointerId)}catch(_){}};cv.onpointermove=e=>{if(S.in.drag){const p=pt(e);S.in.x=p[0];S.in.y=p[1];const dx=e.clientX-S.in.sx,dy=e.clientY-S.in.sy;if(Math.hypot(dx,dy)>16){S.in.swd=Math.abs(dx)>Math.abs(dy)?(dx>0?'r':'l'):(dy>0?'d':'u');S.in.sx=e.clientX;S.in.sy=e.clientY}}};cv.onpointerup=cv.onpointercancel=()=>{S.in.drag=0};
 AR.kd=e=>{const S=AR.S;if(e.key==='Escape')arClose();else if(e.key==='ArrowLeft'||e.key==='a'){S.in.l=1;S.in.lp=1}else if(e.key==='ArrowRight'||e.key==='d'){S.in.r=1;S.in.rp=1}else if(e.key==='ArrowUp'||e.key==='w'){e.preventDefault();S.in.u=1;S.in.up=1;S.in.j=1;S.in.jp=1}else if(e.key==='ArrowDown'||e.key==='s'){e.preventDefault();S.in.d=1;S.in.dp=1}else if(e.key==='x'){S.in.k=1;S.in.kp=1}else if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!S.in.f){S.in.fp=1}S.in.f=1}};AR.ku=e=>{const S=AR.S;if(e.key==='ArrowLeft'||e.key==='a')S.in.l=0;else if(e.key==='ArrowRight'||e.key==='d')S.in.r=0;else if(e.key==='ArrowUp'||e.key==='w'){S.in.u=0;S.in.j=0}else if(e.key==='ArrowDown'||e.key==='s')S.in.d=0;else if(e.key==='x')S.in.k=0;else if(e.key===' '||e.key==='Enter')S.in.f=0};addEventListener('keydown',AR.kd);addEventListener('keyup',AR.ku);
 if(AR.def.sk3)x3Begin(AR);AR.raf=requestAnimationFrame(arLoop)}
function arLoop(now){const A=AR;if(!A)return;const dt=Math.max(0,Math.min(.05,(now-A.last)/1000));A.last=now;const S=A.S;S.t+=dt;if(!S.over){A.def.step(S,dt);if(S.over)arEnd()}S.in.fp=S.in.jp=S.in.kp=S.in.up=S.in.dp=S.in.lp=S.in.rp=0;S.in.tap=null;S.in.swd=null;if(A.def.sk3)A.def.sk3.upd(S,dt,A);else{A.g.fillStyle='#05050c';A.g.fillRect(0,0,AW,AH);A.def.draw(A.g,S)}A.raf=requestAnimationFrame(arLoop)}
function arTxt(g,t,x,y,c,sz,al){g.fillStyle=c||'#fff';g.font='bold '+(sz||10)+'px monospace';g.textAlign=al||'left';g.fillText(t,x,y)}
function arEnd(){const A=AR,S=A.S,d=A.def;S.over=1;const sc=S.sc,tx=d.tk?d.tk(S):Math.floor(sc/d.div),pb=sc>(ARP.best[S.k]||0);if(pb)ARP.best[S.k]=sc;ARP.tix+=tx;arSave();beep(sc>0?880:200,.2,'square',.06);
 const o=A.ov.querySelector('#arov');o.style.display='flex';o.innerHTML='<div style="font-size:18px;color:#ffe040">GAME OVER</div><div style="font-size:34px;margin:6px 0">'+sc+'</div>'+(pb?'<div style="color:#7f7">NEW BEST!</div>':'')+'<div style="color:#ff90e0;margin:6px 0">+'+tx+' TICKETS (TOTAL '+ARP.tix+')</div>';
 const mk=(t,f,c)=>{const b=document.createElement('div');b.textContent=t;b.style.cssText='margin:5px;padding:11px 18px;border:3px solid #fff;border-radius:10px;background:'+c+';box-shadow:3px 3px 0 #000';b.onpointerdown=e=>{e.stopPropagation();e.preventDefault();f()};o.appendChild(b)};
 mk('AGAIN  -£1',()=>{if(cash<1){toast('NEED £1');return}cash-=1;const k=S.k;arResetS(k)},'#1a8a3a');mk('LEAVE',()=>arClose(),'#444')}
function arResetS(k){const A=AR;const S=A.S;for(const q in S)if(q!=='in'&&q!=='k'&&q!=='w'&&q!=='h')delete S[q];S.sc=0;S.over=0;S.t=0;A.def.init(S);if(A.def.sk3&&A.def.sk3.reset)A.def.sk3.reset(S,A);A.ov.querySelector('#arov').style.display='none';A.last=performance.now()}
function arClose(){const A=AR;if(!A)return;cancelAnimationFrame(A.raf);removeEventListener('keydown',A.kd);removeEventListener('keyup',A.ku);A.ov.remove();if(A.G){SG.remove(A.G);DZ.fn=null;DZ.on=0;DZ.exit=1;document.body.classList.remove('dz')}AR=null;busy=0}
/* ---------- the games ---------- */
const ARG=[];
// 0: ROVER INVADERS
ARG[0]={div:60,init(S){S.x=120;S.b=[];S.bm=[];S.cd=0;S.lv=3;S.wave=1;S.inv=0;this.wave(S)},wave(S){S.al=[];for(let r=0;r<4;r++)for(let c=0;c<8;c++)S.al.push({x:28+c*23,y:36+r*17,r,a:1});S.dir=1;S.mt=0;S.fr=0;S.bt=1},
 step(S,dt){const I=S.in;let mv=(I.r-I.l)*120*dt;if(I.drag&&I.x!=null)S.x+=(I.x*S.w-S.x)*Math.min(1,dt*14);else S.x+=mv;S.x=Math.max(10,Math.min(S.w-10,S.x));S.cd-=dt;S.inv-=dt;
  if((I.fp||I.f&&S.cd<=0)&&S.cd<=0&&S.b.length<3){S.b.push({x:S.x,y:286});S.cd=.32;beep(900,.04,'square',.03)}
  const al=S.al.filter(a=>a.a),n=al.length;S.mt-=dt;const iv=Math.max(.04,.55*n/32/(1+S.wave*.25));if(S.mt<=0){S.mt=iv;S.fr^=1;let hit=false;for(const a of al){if(a.x+S.dir*5>S.w-10||a.x+S.dir*5<10){hit=true;break}}if(hit){S.dir*=-1;for(const a of al)a.y+=8}else for(const a of al)a.x+=S.dir*5}
  S.bt-=dt;if(S.bt<=0&&n){S.bt=Math.max(.3,1.1-S.wave*.1)*(.6+Math.random()*.8);const cols={};for(const a of al)if(!cols[a.x|0]||a.y>cols[a.x|0].y)cols[a.x|0]=a;const ks=Object.keys(cols),a=cols[ks[Math.floor(Math.random()*ks.length)]];S.bm.push({x:a.x,y:a.y+6})}
  for(const b of S.b){b.y-=260*dt;for(const a of al)if(a.a&&Math.abs(b.x-a.x)<8&&Math.abs(b.y-a.y)<6){a.a=0;b.y=-9;S.sc+=10+(3-a.r)*5;beep(300+a.r*100,.05,'sawtooth',.04)}}S.b=S.b.filter(b=>b.y>-4);
  for(const m of S.bm){m.y+=95*dt;if(S.inv<=0&&Math.abs(m.x-S.x)<9&&m.y>280&&m.y<300){m.y=999;S.lv--;S.inv=1.5;beep(120,.25,'sawtooth',.08);if(S.lv<=0)S.over=1}}S.bm=S.bm.filter(m=>m.y<310);
  if(al.some(a=>a.y>270))S.over=1;if(!n){S.wave++;S.sc+=50;this.wave(S);S.bm.length=0}},
 draw(g,S){for(let i=0;i<30;i++){g.fillStyle='#667';g.fillRect((i*47)%240,(i*31+S.t*10)%320,1,1)}
  const cl=['#ff4060','#ffa020','#40e060','#40d0ff'];for(const a of S.al)if(a.a){g.fillStyle=cl[a.r];const x=a.x-7,y=a.y-4;g.fillRect(x+2,y,10,6);g.fillRect(x,y+2,14,3);g.fillStyle='#000';g.fillRect(x+3,y+1,2,2);g.fillRect(x+9,y+1,2,2);g.fillStyle=cl[a.r];if(S.fr){g.fillRect(x,y+5,2,3);g.fillRect(x+12,y+5,2,3)}else{g.fillRect(x+3,y+6,2,2);g.fillRect(x+9,y+6,2,2)}}
  g.fillStyle='#fff';for(const b of S.b)g.fillRect(b.x-1,b.y,2,6);g.fillStyle='#ffe040';for(const m of S.bm)g.fillRect(m.x-1,m.y,2,6);
  if(S.inv<=0||Math.floor(S.t*10)%2){g.fillStyle='#ffa020';g.fillRect(S.x-9,290,18,6);g.fillRect(S.x-6,286,12,5);g.fillStyle='#8cf';g.fillRect(S.x-4,287,8,3);g.fillStyle='#111';g.fillRect(S.x-9,295,4,3);g.fillRect(S.x+5,295,4,3)}
  arTxt(g,'SCORE '+S.sc,6,12,'#fff');arTxt(g,'WAVE '+S.wave,120,12,'#8cf','10','center');arTxt(g,'♥'.repeat(Math.max(0,S.lv)),234,12,'#f44',10,'right')}};
// 1: BRICK BASH
ARG[1]={div:40,init(S){S.px=120;S.pw=40;S.lv=3;S.br=[];for(let r=0;r<6;r++)for(let c=0;c<10;c++)S.br.push({x:c*23+3,y:30+r*10,r,a:1});S.sv=1;S.bx=120;S.by=290;S.vx=0;S.vy=0;S.sp=140},
 step(S,dt){const I=S.in;if(I.drag&&I.x!=null)S.px+=(I.x*S.w-S.px)*Math.min(1,dt*18);else S.px+=(I.r-I.l)*190*dt;S.px=Math.max(S.pw/2,Math.min(S.w-S.pw/2,S.px));
  if(S.sv){S.bx=S.px;S.by=290;if(I.fp){S.sv=0;S.vx=(Math.random()-.5)*60;S.vy=-S.sp;beep(700,.05,'square',.04)}return}
  S.bx+=S.vx*dt;S.by+=S.vy*dt;if(S.bx<3){S.bx=3;S.vx=Math.abs(S.vx)}if(S.bx>S.w-3){S.bx=S.w-3;S.vx=-Math.abs(S.vx)}if(S.by<20){S.by=20;S.vy=Math.abs(S.vy)}
  if(S.vy>0&&S.by>294&&S.by<302&&Math.abs(S.bx-S.px)<S.pw/2+3){const o=(S.bx-S.px)/(S.pw/2);const a=o*1.05,sp=Math.min(260,Math.hypot(S.vx,S.vy)*1.012);S.vx=Math.sin(a)*sp;S.vy=-Math.cos(a)*sp;S.by=294;beep(500,.04,'square',.04)}
  for(const b of S.br)if(b.a&&S.bx>b.x-3&&S.bx<b.x+21&&S.by>b.y-3&&S.by<b.y+9){b.a=0;S.sc+=10+(5-b.r)*4;const dx=Math.min(S.bx-b.x+3,b.x+21-S.bx),dy=Math.min(S.by-b.y+3,b.y+9-S.by);if(dx<dy)S.vx*=-1;else S.vy*=-1;beep(600+b.r*80,.04,'square',.04);break}
  if(S.by>320){S.lv--;beep(120,.25,'sawtooth',.08);if(S.lv<=0)S.over=1;else{S.sv=1}}
  if(!S.br.some(b=>b.a)){S.sc+=100;S.sp=Math.min(220,S.sp+25);const sc=S.sc,l=S.lv;this.init(S);S.sc=sc;S.lv=l}},
 draw(g,S){const cl=['#ff4060','#ff8030','#ffe040','#60e060','#40c0ff','#a060ff'];for(const b of S.br)if(b.a){g.fillStyle=cl[b.r];g.fillRect(b.x,b.y,21,8);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(b.x,b.y,21,2)}
  g.fillStyle='#ddd';g.fillRect(S.px-S.pw/2,298,S.pw,5);g.fillStyle='#ffa020';g.fillRect(S.px-S.pw/2,298,6,5);g.fillRect(S.px+S.pw/2-6,298,6,5);g.fillStyle='#fff';g.fillRect(S.bx-2,S.by-2,5,5);if(S.sv)arTxt(g,'TAP / FIRE TO SERVE',120,200,'#ffe040',10,'center');
  arTxt(g,'SCORE '+S.sc,6,12,'#fff');arTxt(g,'♥'.repeat(Math.max(0,S.lv)),234,12,'#f44',10,'right')}};
// 2: C1 RUSH
ARG[2]={div:50,init(S){S.x=120;S.sp=95;S.d=0;S.tr=[];S.cn=[];S.nt=.5;S.lv=3;S.inv=0;S.sx=0},
 step(S,dt){const I=S.in;if(I.drag&&I.x!=null)S.x+=(I.x*S.w-S.x)*Math.min(1,dt*10);else S.x+=(I.r-I.l)*130*dt;S.x=Math.max(56,Math.min(184,S.x));S.sp=Math.min(230,95+S.d*.018);S.d+=S.sp*dt;S.sc=Math.floor(S.d/10)+(S.cb|0);S.inv-=dt;S.sx=(S.sx+S.sp*dt)%24;
  S.nt-=dt;if(S.nt<=0){S.nt=Math.max(.35,1.0-S.d*.00008)*(.6+Math.random()*.7);const ln=Math.floor(Math.random()*4),x=60+ln*40+20;if(Math.random()<.22)S.cn.push({x,y:-10});else S.tr.push({x,y:-26,c:['#e03040','#3080e0','#40c060','#e0e040','#d060e0'][Math.floor(Math.random()*5)],v:.35+Math.random()*.3})}
  for(const t of S.tr){t.y+=(S.sp*(1-t.v*.8))*dt;if(S.inv<=0&&Math.abs(t.x-S.x)<16&&Math.abs(t.y-272)<24){t.y=999;S.lv--;S.inv=1.4;beep(100,.3,'sawtooth',.09);if(S.lv<=0)S.over=1}}S.tr=S.tr.filter(t=>t.y<340);
  for(const c of S.cn){c.y+=S.sp*dt;if(Math.abs(c.x-S.x)<13&&Math.abs(c.y-272)<16){c.y=999;S.cb=(S.cb|0)+10;beep(1100,.05,'square',.04)}}S.cn=S.cn.filter(c=>c.y<340)},
 draw(g,S){g.fillStyle='#206a30';g.fillRect(0,0,240,320);g.fillStyle='#3a3a42';g.fillRect(40,0,160,320);g.fillStyle='#e8e8e8';g.fillRect(38,0,3,320);g.fillRect(199,0,3,320);g.fillStyle='#c8c8a0';for(let l=1;l<4;l++)for(let y=-24;y<320;y+=24)g.fillRect(40+l*40-1,y+S.sx,3,12);
  const car=(x,y,c,pl)=>{g.fillStyle='#111';g.fillRect(x-11,y-12,4,8);g.fillRect(x+7,y-12,4,8);g.fillRect(x-11,y+5,4,8);g.fillRect(x+7,y+5,4,8);g.fillStyle=c;g.fillRect(x-9,y-16,18,32);g.fillStyle='rgba(0,0,0,.55)';g.fillRect(x-6,y-8,12,8);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(x-9,y-16,18,2);if(pl){g.fillStyle='#ffe';g.fillRect(x-8,y-17,4,2);g.fillRect(x+4,y-17,4,2)}else{g.fillStyle='#f33';g.fillRect(x-8,y+15,4,2);g.fillRect(x+4,y+15,4,2)}};
  for(const t of S.tr)car(t.x,t.y,t.c,0);for(const c of S.cn){g.fillStyle='#ffd020';g.beginPath();g.arc(c.x,c.y,6,0,6.3);g.fill();g.fillStyle='#a07010';g.fillRect(c.x-1,c.y-3,2,6)}
  if(S.inv<=0||Math.floor(S.t*12)%2)car(S.x,272,'#ff9a20',1);arTxt(g,'SCORE '+S.sc,6,12,'#fff');arTxt(g,'♥'.repeat(Math.max(0,S.lv)),234,12,'#f44',10,'right');arTxt(g,Math.round(S.sp*.5)+' MPH',6,310,'#ffe040',9)}};
// 3: WHACK-A-MOLE
ARG[3]={ui:[['TAP MOLES','f']],div:60,init(S){S.m=[];for(let i=0;i<9;i++)S.m.push({u:0,t:0,hit:0});S.nx=.5;S.tl=30;S.hm=null},
 step(S,dt){S.tl-=dt;if(S.tl<=0){S.over=1;return}S.nx-=dt;const el=30-S.tl;if(S.nx<=0){S.nx=Math.max(.28,.8-el*.018);const f=S.m.filter(m=>!m.u&&!m.hit);if(f.length){const m=f[Math.floor(Math.random()*f.length)];m.u=1;m.t=Math.max(.5,1.15-el*.02)}}
  for(const m of S.m){if(m.u){m.t-=dt;if(m.t<=0)m.u=0}if(m.hit>0)m.hit-=dt}
  if(S.in.tap){const [x,y]=S.in.tap;S.hm=[x,y,.12];for(let i=0;i<9;i++){const cx=50+(i%3)*70,cy=100+Math.floor(i/3)*70,m=S.m[i];if(m.u&&Math.abs(x-cx)<28&&Math.abs(y-(cy-8))<30){m.u=0;m.hit=.25;S.sc+=10;beep(500,.06,'square',.05);S.hm=[cx,cy-8,.12]}}}if(S.hm){S.hm[2]-=dt;if(S.hm[2]<=0)S.hm=null}},
 draw(g,S){g.fillStyle='#2a6a2a';g.fillRect(0,0,240,320);for(let i=0;i<9;i++){const cx=50+(i%3)*70,cy=100+Math.floor(i/3)*70,m=S.m[i];g.fillStyle='#143a14';g.beginPath();g.ellipse(cx,cy+8,26,10,0,0,6.3);g.fill();
  if(m.u||m.hit>0){const k=m.hit>0?.5:Math.min(1,(1.2-m.t)*6+.4);g.save();g.beginPath();g.rect(cx-30,cy-40,60,48);g.clip();g.fillStyle=m.hit>0?'#c08050':'#8a5a30';g.beginPath();g.arc(cx,cy+22-k*34,20,0,6.3);g.fill();g.fillStyle='#fff';g.fillRect(cx-9,cy-k*34+10,6,6);g.fillRect(cx+3,cy-k*34+10,6,6);g.fillStyle='#000';g.fillRect(cx-7,cy-k*34+12,3,3);g.fillRect(cx+5,cy-k*34+12,3,3);g.fillStyle='#f88';g.fillRect(cx-3,cy-k*34+18,6,4);g.restore()}
  g.fillStyle='#143a14';g.beginPath();g.ellipse(cx,cy+9,26,7,0,0,3.15);g.fill()}
  if(S.hm){g.fillStyle='#d0d0d8';g.fillRect(S.hm[0]-14,S.hm[1]-22,28,14);g.fillStyle='#8a5a2a';g.fillRect(S.hm[0]-2,S.hm[1]-8,4,24)}
  arTxt(g,'SCORE '+S.sc,6,14,'#fff');arTxt(g,Math.ceil(S.tl)+'s',234,14,S.tl<8?'#f66':'#ffe040',12,'right');arTxt(g,'TAP THE MOLES!',120,300,'#ffe040',10,'center')}};
// 4: CLAW GRABBER (v2: stacking prizes, grip strength, slips, timer)
ARG[4]={ui:[['◀','l'],['DROP','f'],['▶','r']],
 init(S){S.cx=120;S.cy=44;S.ph=0;S.go=5;S.tix=0;S.hold=null;S.mt='';S.mtT=0;S.tl=12;S.open=1;S.pt=0;S.pz=[];const T=[{w:22,h:22,v:10,gr:.92,ty:0},{w:30,h:30,v:20,gr:.7,ty:1},{w:38,h:40,v:40,gr:.45,ty:1},{w:26,h:26,v:25,gr:.62,ty:2}],cols=['#ff4090','#40e0ff','#ffe040','#60ff60','#ff8030','#c060ff'];
  for(let i=0;i<16;i++){const t=T[[0,0,0,1,1,1,3,3,2,0,1,3,0,1,2,0][i]];S.pz.push({x:58+Math.random()*165,y:60+Math.random()*120,vy:0,w:t.w,h:t.h,v:t.v,gr:t.gr,ty:t.ty,c:cols[i%6],g:0})}for(let k=0;k<260;k++)this.settle(S,.04)},
 settle(S,dt){const a=S.pz.slice().sort((p,q)=>q.y-p.y);for(const p of a){if(p.g)continue;let rest=288-p.h/2;for(const q of S.pz){if(q===p||q.g)continue;if(q.y>p.y-2&&Math.abs(p.x-q.x)<(p.w+q.w)*.38)rest=Math.min(rest,q.y-q.h/2-p.h/2)}
   for(const q of S.pz){if(q===p||q.g)continue;const dx=p.x-q.x,dy=p.y-q.y;if(Math.abs(dx)<(p.w+q.w)*.3&&Math.abs(dy)<(p.h+q.h)*.3){p.x+=(dx>=0?1:-1)*30*dt}}
   p.vy+=500*dt;p.y+=p.vy*dt;if(p.y>=rest){p.y=rest;p.vy=0}p.x=Math.max(14+p.w/2,Math.min(226-p.w/2,p.x))}},
 tk(S){return S.tix},
 topUnder(S){let t=288;for(const p of S.pz)if(!p.g&&Math.abs(p.x-S.cx)<p.w*.5+7)t=Math.min(t,p.y-p.h/2);return t},
 step(S,dt){const I=S.in;S.mtT-=dt;this.settle(S,dt);
  if(S.ph===0){S.tl-=dt;if(I.drag&&I.x!=null)S.cx+=(I.x*S.w-S.cx)*Math.min(1,dt*10);else S.cx+=(I.r-I.l)*95*dt;S.cx=Math.max(24,Math.min(224,S.cx));if(I.fp&&!I.drag||S.tl<=0||(I.fp&&I.tap&&I.tap[1]<60)){S.ph=1;S.open=1;beep(500,.06,'square',.05)}}
  else if(S.ph===1){S.cy+=150*dt;const t=this.topUnder(S);if(S.cy+30>=t){S.cy=t-30;S.ph=2;S.pt=.5}}
  else if(S.ph===2){S.pt-=dt;S.open=Math.max(0,S.pt/.5);if(S.pt<=0){let b=null;for(const p of S.pz)if(!p.g&&Math.abs(p.x-S.cx)<p.w*.5+4&&Math.abs(p.y-p.h/2-(S.cy+30))<24&&(!b||p.y<b.y))b=p;
    if(b&&Math.random()<b.gr*(1-Math.abs(b.x-S.cx)/(b.w+6)*.7)){S.hold=b;b.g=1;S.mt='GOT ONE!';beep(900,.06,'square',.05)}else{S.mt='MISSED!';beep(160,.2,'sawtooth',.06)}S.mtT=1;S.ph=3}}
  else if(S.ph===3){S.cy-=115*dt;if(S.hold){S.hold.x=S.cx;S.hold.y=S.cy+30+S.hold.h/2-6;if(Math.random()<dt*(1-S.hold.gr)*1.4){this.slip(S)}}if(S.cy<=44){S.cy=44;S.ph=4}}
  else if(S.ph===4){const tx=26;S.cx-=Math.min(110*dt,S.cx-tx);if(S.hold){S.hold.x=S.cx+Math.sin(S.t*9)*3;S.hold.y=S.cy+30+S.hold.h/2-6;if(Math.random()<dt*(1-S.hold.gr)*.9)this.slip(S)}if(S.cx<=tx+.5){S.ph=5;S.pt=1.1;S.open=1;if(S.hold){S.hold.g=0;S.hold.vy=0;S.hold=null}}}
  else if(S.ph===5){S.pt-=dt;if(S.pt<=0)this.next(S)}
  for(let i=S.pz.length-1;i>=0;i--){const p=S.pz[i];if(!p.g&&p.x<44&&p.y>=288-p.h/2-1){S.tix+=p.v;S.sc=S.tix;S.mt='+'+p.v+' TICKETS!';S.mtT=1.4;beep(1000,.1,'square',.06);setTimeout(()=>beep(1400,.15,'square',.06),90);S.pz.splice(i,1);if(p.v>=40){S.go++;S.mt='JACKPOT! +1 GO'}this.refill(S)}}},
 slip(S){if(!S.hold)return;S.hold.g=0;S.hold.vy=0;S.hold=null;S.mt='IT SLIPPED!';S.mtT=1;beep(220,.2,'sawtooth',.06)},
 refill(S){const T=[[22,22,10,.92,0],[30,30,20,.7,1],[26,26,25,.62,2],[22,22,10,.92,0]][Math.floor(Math.random()*4)];S.pz.push({x:70+Math.random()*140,y:20,vy:0,w:T[0],h:T[1],v:T[2],gr:T[3],ty:T[4],c:['#ff4090','#40e0ff','#ffe040','#60ff60','#ff8030','#c060ff'][Math.floor(Math.random()*6)],g:0})},
 next(S){S.go--;if(S.go<=0){S.over=1;return}S.ph=0;S.cx=120;S.cy=44;S.tl=12;S.open=1},
 draw(g,S){g.fillStyle='#14224a';g.fillRect(0,0,240,320);for(let i=0;i<10;i++){g.fillStyle=i%2?'#ff40c0':'#20e0ff';g.fillRect(6+i*24,8,6,6)}g.fillStyle='#1a3060';g.fillRect(8,30,224,262);g.fillStyle='#2a3a70';g.fillRect(8,30,224,3);g.fillStyle='#3a3a54';g.fillRect(8,288,224,12);g.fillStyle='#0a0a14';g.fillRect(8,262,38,26);g.fillStyle='#ffe040';g.fillRect(14,268,26,3);arTxt(g,'PRIZE',27,282,'#ffe040',8,'center');
  for(const p of S.pz){const x=p.x,y=p.y,w=p.w,h=p.h;if(p.ty===0){g.fillStyle=p.c;g.beginPath();g.arc(x,y,w/2,0,6.3);g.fill();g.fillStyle='rgba(255,255,255,.4)';g.beginPath();g.arc(x-w*.15,y-w*.2,w*.18,0,6.3);g.fill();g.fillStyle='#000';g.fillRect(x-w*.22,y-1,3,3);g.fillRect(x+w*.12,y-1,3,3)}
   else if(p.ty===1){g.fillStyle=p.c;g.fillRect(x-w*.4,y-h*.05,w*.8,h*.5);g.beginPath();g.arc(x,y-h*.22,w*.32,0,6.3);g.fill();g.beginPath();g.arc(x-w*.26,y-h*.46,w*.13,0,6.3);g.arc(x+w*.26,y-h*.46,w*.13,0,6.3);g.fill();g.fillStyle='#fff';g.fillRect(x-w*.14,y-h*.26,4,4);g.fillRect(x+w*.06,y-h*.26,4,4);g.fillStyle='#000';g.fillRect(x-w*.12,y-h*.24,2,2);g.fillRect(x+w*.08,y-h*.24,2,2);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x-w*.1,y-h*.14,w*.2,3)}
   else{g.fillStyle=p.c;g.fillRect(x-w/2,y-h/2,w,h);g.fillStyle='rgba(255,255,255,.4)';g.fillRect(x-w/2,y-h/2,w,4);g.fillStyle='#fff';g.fillRect(x-2,y-h/2,4,h);g.fillRect(x-w/2,y-2,w,4);g.fillStyle='#000';g.fillRect(x-6,y-6,3,3);g.fillRect(x+3,y-6,3,3)}
   if(p.v>=25){g.fillStyle='#ffe040';g.fillRect(x-7,y-h/2-8,14,7);arTxt(g,''+p.v,x,y-h/2-2,'#000',7,'center')}}
  g.fillStyle='#bbb';g.fillRect(8,26,224,5);g.fillStyle='#888';g.fillRect(S.cx-7,26,14,8);g.fillStyle='#ccc';g.fillRect(S.cx-1,32,2,S.cy-32);const sp=3+S.open*13;g.strokeStyle='#e8e8f0';g.lineWidth=3;g.beginPath();g.moveTo(S.cx,S.cy);g.lineTo(S.cx-sp,S.cy+22);g.lineTo(S.cx-sp*.55,S.cy+32);g.moveTo(S.cx,S.cy);g.lineTo(S.cx+sp,S.cy+22);g.lineTo(S.cx+sp*.55,S.cy+32);g.moveTo(S.cx,S.cy);g.lineTo(S.cx,S.cy+18);g.stroke();g.fillStyle='#ddd';g.fillRect(S.cx-5,S.cy-4,10,8);
  g.fillStyle='rgba(180,220,255,.07)';g.fillRect(8,30,224,262);arTxt(g,'TICKETS '+S.tix,6,22,'#fff',10);arTxt(g,'GOES '+S.go,234,22,'#ffe040',10,'right');
  if(S.ph===0){g.fillStyle='#222';g.fillRect(70,300,100,6);g.fillStyle=S.tl<4?'#f44':'#6f6';g.fillRect(70,300,100*S.tl/12,6);arTxt(g,'AIM · THEN DROP',120,316,'#ffe040',9,'center')}
  if(S.mtT>0&&S.mt)arTxt(g,S.mt,120,170,'#ffe040',15,'center')}};
// 5: AIR HOCKEY
ARG[5]={ui:[],div:25,
 init(S){S.pl=[120,270];S.ai=[120,50];S.pk=[120,160];S.kv=[0,0];S.ps=0;S.as=0;S.fz=1;S.tl=120;S.msg='';S.mT=0;S.av=[0,0];S.pv=[0,0];S.stk=0},
 step(S,dt){const I=S.in;S.tl-=dt;if(S.tl<=0){if(S.ps>S.as)S.sc+=100;S.over=1;return}
  if(S.fz>0){S.fz-=dt}S.mT-=dt;
  const n=3,h=dt/n;for(let it=0;it<n;it++){
   // player mallet
   let tx=S.pl[0],ty=S.pl[1];if(I.drag&&I.x!=null){tx=I.x*240;ty=I.y*320}else{tx+=(I.r-I.l)*200*h*1;ty+=((I.d||0)-(I.u||0))*200*h}tx=Math.max(26,Math.min(214,tx));ty=Math.max(172,Math.min(298,ty));
   let dx=tx-S.pl[0],dy=ty-S.pl[1];const dl=Math.hypot(dx,dy),mx=620*h;if(dl>mx&&dl>0){dx*=mx/dl;dy*=mx/dl}S.pv=[dx/h,dy/h];S.pl[0]+=dx;S.pl[1]+=dy;
   // AI mallet
   const lv=Math.min(4,S.ps),sp=(105+lv*22)*h;let ax=S.ai[0],ay=S.ai[1],px=S.pk[0],py=S.pk[1];let gx,gy;
   if(py<165&&S.fz<=0){gx=px+S.kv[0]*.05;gy=Math.min(150,py-14);if(Math.abs(S.ai[0]-px)<10&&py>S.ai[1])gy=py+4;if(py<S.ai[1]-4){gx=px+(px<120?22:-22);gy=Math.max(26,py-20)}}else{gx=120+(px-120)*.4;gy=48}
   gx=Math.max(26,Math.min(214,gx));gy=Math.max(26,Math.min(150,gy));let ex=gx-ax,ey=gy-ay,el=Math.hypot(ex,ey);if(el>sp){ex*=sp/el;ey*=sp/el}S.av=[ex/h,ey/h];S.ai[0]+=ex;S.ai[1]+=ey;
   // puck
   if(S.fz<=0){S.pk[0]+=S.kv[0]*h;S.pk[1]+=S.kv[1]*h;const f=1-.22*h;S.kv[0]*=f;S.kv[1]*=f}
   const pk=S.pk,kv=S.kv;if(pk[0]<20){pk[0]=20;kv[0]=Math.abs(kv[0])*.95}if(pk[0]>220){pk[0]=220;kv[0]=-Math.abs(kv[0])*.95}
   const inG=pk[0]>82&&pk[0]<158;if(pk[1]<14&&!inG){pk[1]=14;kv[1]=Math.abs(kv[1])*.95}if(pk[1]>306&&!inG){pk[1]=306;kv[1]=-Math.abs(kv[1])*.95}
   for(const [m,mv] of [[S.pl,S.pv],[S.ai,S.av]]){const ddx=pk[0]-m[0],ddy=pk[1]-m[1],d=Math.hypot(ddx,ddy),R=21;if(d<R&&d>.01){const nx=ddx/d,ny=ddy/d;pk[0]=m[0]+nx*R;pk[1]=m[1]+ny*R;const vn=(kv[0]-mv[0])*nx+(kv[1]-mv[1])*ny;if(vn<0){kv[0]-=1.85*vn*nx;kv[1]-=1.85*vn*ny;const sp2=Math.hypot(kv[0],kv[1]);if(sp2>440){kv[0]*=440/sp2;kv[1]*=440/sp2}if(sp2<70){kv[0]=nx*90;kv[1]=ny*90}beep(300+Math.min(300,sp2),.03,'square',.04)}}}
   if(pk[1]<-4){S.ps++;S.sc+=40;S.msg='GOAL!';S.mT=1.2;this.serve(S,1);beep(1000,.15,'square',.06)}else if(pk[1]>324){S.as++;S.msg='THEY SCORE';S.mT=1.2;this.serve(S,-1);beep(180,.3,'sawtooth',.07)}}
  if(S.ps>=5){S.sc+=100;S.over=1}else if(S.as>=5)S.over=1;
  if(Math.hypot(S.kv[0],S.kv[1])<10&&S.fz<=0){S.stk+=dt;if(S.stk>1.5){S.kv=[(Math.random()-.5)*120,S.pk[1]<160?90:-90];S.stk=0}}else S.stk=0},
 serve(S,to){S.pk=[120+(Math.random()-.5)*60,to>0?200:120];S.kv=[0,0];S.fz=1.1;S.stk=0},
 draw(g,S){g.fillStyle='#0a2a5a';g.fillRect(0,0,240,320);g.fillStyle='#d8ecff';g.fillRect(10,10,220,300);g.fillStyle='rgba(120,170,230,.4)';for(let i=0;i<60;i++)g.fillRect((i*47)%210+14,(i*31)%290+14,2,1);
  g.fillStyle='#e04040';g.fillRect(10,158,220,3);g.strokeStyle='#e04040';g.lineWidth=2;g.beginPath();g.arc(120,160,30,0,6.3);g.stroke();g.strokeStyle='#4080e0';g.beginPath();g.arc(120,10,38,0,3.15);g.stroke();g.beginPath();g.arc(120,310,38,3.15,6.3);g.stroke();
  g.fillStyle='#0a1830';g.fillRect(82,4,76,9);g.fillRect(82,307,76,9);g.fillStyle='#a0b0c8';g.fillRect(4,4,78,9);g.fillRect(158,4,78,9);g.fillRect(4,307,78,9);g.fillRect(158,307,78,9);g.fillRect(4,4,7,312);g.fillRect(229,4,7,312);
  const mal=(m,c,c2)=>{g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.arc(m[0]+2,m[1]+3,19,0,6.3);g.fill();g.fillStyle=c;g.beginPath();g.arc(m[0],m[1],18,0,6.3);g.fill();g.fillStyle=c2;g.beginPath();g.arc(m[0],m[1],10,0,6.3);g.fill();g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.arc(m[0]-5,m[1]-6,4,0,6.3);g.fill()};mal(S.ai,'#2060d0','#4090ff');mal(S.pl,'#d02828','#ff6060');
  g.fillStyle='#111';g.beginPath();g.arc(S.pk[0],S.pk[1],10,0,6.3);g.fill();g.fillStyle='#555';g.beginPath();g.arc(S.pk[0],S.pk[1],6,0,6.3);g.fill();
  arTxt(g,''+S.as,24,140,'rgba(40,80,160,.6)',34,'center');arTxt(g,''+S.ps,24,200,'rgba(200,40,40,.6)',34,'center');arTxt(g,'FIRST TO 5 · '+Math.ceil(S.tl)+'s',120,170,'rgba(0,0,0,.5)',9,'center');if(S.mT>0)arTxt(g,S.msg,120,150,'#ffe040',18,'center');if(S.t<4)arTxt(g,'DRAG YOUR MALLET',120,250,'#c02020',10,'center')}};
// 6: STREET BRAWLER (side-scrolling fighter)
ARG[6]={ui:[['◀','l'],['▶','r'],['PUNCH','f'],['KICK','k'],['JUMP','j']],div:120,
 init(S){S.W=560;S.h={x:60,y:0,vy:0,f:1,hp:100,st:'idle',tm:0,hit:0,inv:0,wk:0,cb:0,cbT:0};S.en=[];S.wave=1;S.q=0;S.sp=0;S.cam=0;S.clr=0;S.flash=0;S.last=null;S.msg='WAVE 1';S.mT=1.6;this.setWave(S)},
 setWave(S){S.q=3+S.wave*2;S.sp=.4;S.boss=S.wave%4===0},
 spawn(S){const side=Math.random()<.5?-1:1;let t=S.boss&&S.q===1?2:(Math.random()<.3+S.wave*.04?1:0);const hp=t===2?110:t===1?18:26;S.en.push({x:Math.max(10,Math.min(S.W-10,S.cam+120+side*160)),y:0,f:-side,hp,mx:hp,t,st:'walk',tm:0,cd:.8+Math.random(),wk:Math.random()*6,vx:0,hit:0,sp:t===2?36:t===1?62:40});S.q--},
 hurtE(S,e,dmg,kb,down){e.hp-=dmg;e.hit=.15;e.vx=kb*S.h.f;S.last=e;S.h.cbT=1.2;S.h.cb++;S.sc+=dmg;beep(220+dmg*10,.05,'square',.05);if(e.hp<=0){e.st='dead';e.tm=.6;S.sc+=e.t===2?1000:e.t===1?150:100;beep(110,.15,'sawtooth',.06)}else if(down||dmg>=14){e.st='down';e.tm=.6}else if(e.t!==2){e.st='hurt';e.tm=.25}},
 step(S,dt){const H=S.h,I=S.in;S.mT-=dt;H.inv-=dt;H.cbT-=dt;if(H.cbT<=0)H.cb=0;
  // hero
  if(H.st==='hurt'||H.st==='punch'||H.st==='kick'){H.tm-=dt;if(H.tm<=0)H.st='idle'}
  const air=H.y<0;
  if(H.st!=='hurt'){if(I.jp&&!air){H.vy=-250;beep(500,.05,'square',.04)}
   if((H.st==='idle'||H.st==='walk'||air)&&H.st!=='punch'&&H.st!=='kick'){if(I.fp&&!I.tap){H.st='punch';H.tm=.26;H.did=0}else if(I.kp){H.st='kick';H.tm=.4;H.did=0}}
   const mv=(I.r-I.l);if(H.st==='idle'||H.st==='walk'||air){H.x+=mv*(air?60:78)*dt;if(mv){H.f=mv;if(!air)H.st='walk'}else if(!air)H.st='idle';H.wk+=dt*9}}
  if(I.tap&&!I.drag){}
  H.x=Math.max(10,Math.min(S.W-10,H.x));H.vy+=720*dt;H.y+=H.vy*dt;if(H.y>=0){H.y=0;H.vy=0}
  if((H.st==='punch'&&H.tm<.17||H.st==='kick'&&H.tm<.27)&&!H.did){H.did=1;const kick=H.st==='kick',rg=kick?32:26;for(const e of S.en){if(e.st==='dead')continue;const dx=(e.x-H.x)*H.f;if(dx>-4&&dx<rg&&Math.abs(e.y-H.y)<24){this.hurtE(S,e,kick?14:(8+(H.cb>2?3:0)),kick?90:36,kick);if(!kick)break}}}
  // enemies
  S.sp-=dt;if(S.q>0&&S.sp<=0&&S.en.filter(e=>e.st!=='dead').length<3+Math.min(2,S.wave>>1)){this.spawn(S);S.sp=1.1}
  for(let i=S.en.length-1;i>=0;i--){const e=S.en[i];e.tm-=dt;e.hit-=dt;e.cd-=dt;e.x+=e.vx*dt;e.vx*=Math.pow(.02,dt);e.x=Math.max(6,Math.min(S.W-6,e.x));
   if(e.st==='dead'){if(e.tm<=0)S.en.splice(i,1);continue}
   if(e.st==='down'){if(e.tm<=0)e.st='walk';continue}if(e.st==='hurt'){if(e.tm<=0)e.st='walk';continue}
   const dx=H.x-e.x,ad=Math.abs(dx);e.f=dx>=0?1:-1;
   if(e.st==='walk'){const keep=e.t===2?24:20;if(ad>keep){e.x+=e.f*e.sp*dt;e.wk+=dt*8}if(ad<=keep+4&&e.cd<=0&&H.st!=='dead'){e.st='wind';e.tm=e.t===2?.5:.35}for(const o of S.en)if(o!==e&&o.st!=='dead'&&Math.abs(o.x-e.x)<12)e.x+=(e.x>=o.x?1:-1)*30*dt}
   else if(e.st==='wind'){if(e.tm<=0){if(ad<(e.t===2?34:28)&&H.y>-16&&H.inv<=0){const d=e.t===2?14:e.t===1?5:8;H.hp-=d;H.st='hurt';H.tm=.3;H.inv=.7;H.x+=e.f*10;S.flash=.15;beep(130,.12,'sawtooth',.07);H.cb=0;if(H.hp<=0){H.hp=0;S.over=1}}e.st='walk';e.cd=(e.t===2?1.1:e.t===1?.8:1.4)*(.8+Math.random()*.5)}}}
  // wave clear
  if(S.q<=0&&!S.en.some(e=>e.st!=='dead')&&!S.clr){S.clr=1;S.sc+=S.wave*100;S.mT=1.8;S.msg='WAVE '+S.wave+' CLEAR!';H.hp=Math.min(100,H.hp+18);setTimeout(()=>{if(AR&&AR.S===S&&!S.over){S.wave++;S.clr=0;S.msg='WAVE '+S.wave+(S.wave%4===0?' · BOSS!':'');S.mT=1.6;this.setWave(S)}},1300)}
  S.cam+=((Math.max(0,Math.min(S.W-240,H.x-120)))-S.cam)*Math.min(1,dt*5);S.flash-=dt},
 fig(g,x,y,f,c,e){const o=e||{};const sc=o.sc||1;g.save();g.translate(Math.round(x),Math.round(y));g.scale(f*sc,sc);
  const st=o.st||'idle',w=Math.sin(o.wk||0)*3,hit=o.hit>0;const col=hit?'#fff':c[0],lc=hit?'#fff':c[1],sk=hit?'#fff':'#e8b080';
  g.fillStyle='rgba(0,0,0,.3)';g.fillRect(-9,-1,18,3);
  if(st==='down'||st==='dead'){g.rotate(-1.4);g.translate(0,-6)}
  g.fillStyle=lc;if(st==='kick'){g.fillRect(-2,-12,4,12);g.fillRect(2,-20,16,4)}else{g.fillRect(-4+(w>0?w:0)*.5,-12,4,12);g.fillRect(1-(w<0?w:0)*.5,-12,4,12)}
  g.fillStyle=col;g.fillRect(-5,-26,11,15);g.fillStyle=sk;g.fillRect(-3,-34,8,8);g.fillStyle='#222';g.fillRect(2,-31,2,2);g.fillStyle=c[2]||'#222';g.fillRect(-4,-35,9,3);
  g.fillStyle=sk;if(st==='punch'||st==='wind'){g.fillRect(4,-24,(st==='punch'?15:9),4)}else{g.fillRect(4,-22+(w>0?1:0),4,9);g.fillRect(-6,-22,3,9)}
  g.restore()},
 draw(g,S){const cam=S.cam;g.fillStyle='#2a1850';g.fillRect(0,0,240,150);g.fillStyle='#4a2a78';g.fillRect(0,100,240,50);for(let i=0;i<8;i++){const x=((i*70-cam*.25)%560+560)%560-60;g.fillStyle='#1a1038';g.fillRect(x,70+(i%3)*12,44,90);g.fillStyle='#ffd860';for(let j=0;j<6;j++)if((i+j)%3)g.fillRect(x+6+(j%3)*12,80+(i%3)*12+Math.floor(j/3)*18,6,8)}
  for(let i=0;i<5;i++){const x=((i*120-cam*.6)%600+600)%600-80;g.fillStyle='#3a2a58';g.fillRect(x,130,100,40);g.fillStyle=['#e04050','#40a0e0','#e0c040','#40c070','#c060e0'][i];g.fillRect(x,126,100,8);g.fillStyle='#14102a';g.fillRect(x+10,142,22,28);g.fillRect(x+54,140,30,22)}
  g.fillStyle='#3a3a48';g.fillRect(0,170,240,150);g.fillStyle='#4a4a58';g.fillRect(0,170,240,8);g.fillStyle='#d8d060';for(let i=-1;i<8;i++)g.fillRect(((i*60-cam)%60+60)%60+i*0-0,300,30,3);
  const GY=272,all=[{k:'h',y:0}].concat(S.en.map(e=>({k:e,y:e.x})));
  for(const e of S.en)this.fig(g,e.x-cam,GY,e.f,e.t===2?['#b02020','#401010','#111']:e.t===1?['#30a050','#204030','#e0e060']:['#8040b0','#302040','#222'],{st:e.st,hit:e.hit,wk:e.wk,sc:e.t===2?1.45:1});
  const H=S.h;if(H.inv<=0||Math.floor(S.t*14)%2)this.fig(g,H.x-cam,GY+H.y,H.f,['#ff9a20','#2a3a6a','#a04000'],{st:H.st,wk:H.wk});
  // HUD
  g.fillStyle='#000';g.fillRect(6,6,84,9);g.fillStyle=H.hp>35?'#40e060':'#f44';g.fillRect(7,7,82*H.hp/100,7);arTxt(g,'ROVER',8,24,'#fff',8);arTxt(g,'SCORE '+S.sc,234,14,'#fff',10,'right');
  if(S.last&&S.last.hp>0&&S.en.includes(S.last)){g.fillStyle='#000';g.fillRect(150,20,84,7);g.fillStyle='#e04040';g.fillRect(151,21,82*S.last.hp/S.last.mx,5)}
  if(H.cb>1)arTxt(g,H.cb+' HIT COMBO!',120,50,'#ffe040',12,'center');if(S.mT>0)arTxt(g,S.msg,120,90,'#ffe040',16,'center');if(S.clr&&Math.floor(S.t*3)%2)arTxt(g,'GO ▶',220,60,'#fff',14,'right');if(S.flash>0){g.fillStyle='rgba(255,0,0,.25)';g.fillRect(0,0,240,320)}}};
// 7: SNAKE BITE
ARG[7]={ui:[['◀','l'],['▲','u'],['▼','d'],['▶','r']],div:30,
 init(S){S.sn=[[8,10],[7,10],[6,10]];S.dr=[1,0];S.nd=[1,0];S.tm=0;S.fd=this.food(S);S.bn=null;S.bt=0},
 food(S){for(;;){const f=[Math.floor(Math.random()*16),Math.floor(Math.random()*19)];if(!S.sn.some(p=>p[0]===f[0]&&p[1]===f[1]))return f}},
 step(S,dt){const I=S.in;const set=d=>{const m={l:[-1,0],r:[1,0],u:[0,-1],d:[0,1]}[d];if(m&&!(m[0]===-S.dr[0]&&m[1]===-S.dr[1]))S.nd=m};if(I.lp)set('l');if(I.rp)set('r');if(I.up)set('u');if(I.dp)set('d');if(I.swd)set(I.swd);
  S.bt-=dt;if(S.bn&&S.bt<=0)S.bn=null;S.tm+=dt;const iv=Math.max(.065,.17-S.sn.length*.0025);if(S.tm<iv)return;S.tm-=iv;S.dr=S.nd;const h=S.sn[0],n=[h[0]+S.dr[0],h[1]+S.dr[1]];
  if(n[0]<0||n[0]>15||n[1]<0||n[1]>18||S.sn.some((p,i)=>i<S.sn.length-1&&p[0]===n[0]&&p[1]===n[1])){S.over=1;beep(100,.3,'sawtooth',.08);return}
  S.sn.unshift(n);if(n[0]===S.fd[0]&&n[1]===S.fd[1]){S.sc+=10;S.fd=this.food(S);beep(800,.05,'square',.05);if(!S.bn&&Math.random()<.25){S.bn=this.food(S);S.bt=6}}else if(S.bn&&n[0]===S.bn[0]&&n[1]===S.bn[1]){S.sc+=40;S.bn=null;beep(1200,.1,'square',.06);S.sn.push(S.sn[S.sn.length-1].slice())}else S.sn.pop()},
 draw(g,S){g.fillStyle='#0c1a0c';g.fillRect(0,0,240,320);g.fillStyle='#143014';g.fillRect(0,20,240,285);g.fillStyle='#1a3a1a';for(let x=0;x<16;x++)for(let y=0;y<19;y++)if((x+y)%2)g.fillRect(x*15,20+y*15,15,15);
  g.strokeStyle='#80e060';g.lineWidth=2;g.strokeRect(1,21,238,283);
  const cx=(p,i)=>{g.fillStyle=i===0?'#d0ff60':`hsl(${105+(i%6)*4},80%,${50-Math.min(20,i*.6)}%)`;g.fillRect(p[0]*15+1,20+p[1]*15+1,13,13)};for(let i=S.sn.length-1;i>=0;i--)cx(S.sn[i],i);
  const h=S.sn[0];g.fillStyle='#000';g.fillRect(h[0]*15+3+(S.dr[0]>0?5:0),20+h[1]*15+3,3,3);g.fillRect(h[0]*15+3+(S.dr[0]>0?5:0),20+h[1]*15+9,3,3);
  g.fillStyle='#ff3040';g.beginPath();g.arc(S.fd[0]*15+7.5,20+S.fd[1]*15+8,6,0,6.3);g.fill();g.fillStyle='#40d040';g.fillRect(S.fd[0]*15+7,20+S.fd[1]*15+1,4,3);
  if(S.bn){g.fillStyle=Math.floor(S.t*8)%2?'#ffe040':'#ffa020';g.fillRect(S.bn[0]*15+2,20+S.bn[1]*15+2,11,11);arTxt(g,'$',S.bn[0]*15+7.5,20+S.bn[1]*15+12,'#000',9,'center')}
  arTxt(g,'SCORE '+S.sc,6,14,'#fff');arTxt(g,'LENGTH '+S.sn.length,234,14,'#8f8',10,'right');if(S.t<3)arTxt(g,'SWIPE OR USE ARROWS',120,170,'#ffe040',10,'center')}};
// 8: ROVER RUNNER
ARG[8]={ui:[['DUCK','d'],['JUMP','j']],div:40,
 init(S){S.y=0;S.vy=0;S.dk=0;S.sp=120;S.d=0;S.ob=[];S.bo=[];S.nt=1;S.lv=3;S.inv=0;S.bn=0;S.ph=0},
 step(S,dt){const I=S.in;S.sp=Math.min(270,120+S.d*.012);S.d+=S.sp*dt;S.ph+=dt*(8+S.sp*.02);S.inv-=dt;const gr=S.y>=0;S.dk=I.d&&gr?1:0;
  if((I.jp||I.tap)&&gr){S.vy=-370;beep(600,.05,'square',.04)}if(I.d&&!gr)S.vy+=900*dt;S.vy+=1050*dt;S.y+=S.vy*dt;if(S.y>=0){S.y=0;S.vy=0}
  S.sc=Math.floor(S.d/9)+S.bn*10;S.nt-=dt;if(S.nt<=0){S.nt=(.85+Math.random()*.9)*(150/S.sp)+.25;const r=Math.random(),x=260;if(r<.28)S.ob.push({x,w:16,h:22,t:'bird',y:-17-Math.random()*3});else S.ob.push({x,w:r<.6?14:r<.8?10:26,h:r<.6?18:r<.8?14:12,t:r<.6?'bin':r<.8?'cone':'bush',y:0});if(Math.random()<.6){const by=-30-Math.random()*40;for(let i=0;i<3;i++)S.bo.push({x:x+60+i*18,y:by-(i===1?8:0)})}}
  for(const o of S.ob){o.x-=S.sp*dt;const hx=48,hw=S.dk?20:16,hh=S.dk?11:20,top=S.y-hh,bot=S.y;const oy=o.t==='bird'?o.y:0,ot=oy-o.h,ob=oy;if(S.inv<=0&&o.x<hx+hw/2&&o.x+o.w>hx-hw/2&&bot>ot+2&&top<ob-1){S.lv--;S.inv=1;beep(110,.3,'sawtooth',.08);if(S.lv<=0)S.over=1}}S.ob=S.ob.filter(o=>o.x>-40);
  for(const b of S.bo){b.x-=S.sp*dt;if(Math.abs(b.x-52)<12&&Math.abs(b.y-(S.y-10))<18){b.x=-99;S.bn++;beep(1100,.04,'square',.04)}}S.bo=S.bo.filter(b=>b.x>-20)},
 draw(g,S){const GY=270;g.fillStyle='#5a8ad0';g.fillRect(0,0,240,150);g.fillStyle='#8ab0e8';g.fillRect(0,110,240,60);for(let i=0;i<4;i++){const x=((i*90-S.d*.05)%360+360)%360-60;g.fillStyle='#fff';g.fillRect(x,30+i*14,40,8);g.fillRect(x+8,24+i*14,24,6)}
  for(let i=0;i<5;i++){const x=((i*80-S.d*.18)%400+400)%400-70;g.fillStyle='#4a7a4a';g.beginPath();g.moveTo(x,200);g.lineTo(x+50,130+(i%3)*10);g.lineTo(x+100,200);g.fill()}
  for(let i=0;i<5;i++){const x=((i*70-S.d*.45)%350+350)%350-60;g.fillStyle=['#a04030','#c0a060','#6080a0','#b07050','#907090'][i];g.fillRect(x,GY-64,50,64);g.fillStyle='#402018';g.beginPath();g.moveTo(x-4,GY-64);g.lineTo(x+25,GY-84);g.lineTo(x+54,GY-64);g.fill();g.fillStyle='#ffe8a0';g.fillRect(x+8,GY-50,10,12);g.fillRect(x+30,GY-50,10,12)}
  g.fillStyle='#8a8a98';g.fillRect(0,GY,240,10);g.fillStyle='#4a4a56';g.fillRect(0,GY+10,240,60);g.fillStyle='#e0e0a0';for(let i=-1;i<8;i++)g.fillRect(((i*40-S.d)%40+40)%40-10,GY+34,20,3);
  for(const b of S.bo){const y=GY+b.y;g.fillStyle='#f4f0e0';g.fillRect(b.x-6,y-2,12,4);g.fillRect(b.x-8,y-5,4,4);g.fillRect(b.x-8,y+1,4,4);g.fillRect(b.x+4,y-5,4,4);g.fillRect(b.x+4,y+1,4,4)}
  for(const o of S.ob){const y=GY+(o.t==='bird'?o.y:0);if(o.t==='bin'){g.fillStyle='#3a8a4a';g.fillRect(o.x,y-o.h,o.w,o.h);g.fillStyle='#2a6a38';g.fillRect(o.x-2,y-o.h-3,o.w+4,4);g.fillStyle='#fff';g.fillRect(o.x+4,y-o.h+5,6,5)}else if(o.t==='cone'){g.fillStyle='#ff7020';g.beginPath();g.moveTo(o.x,y);g.lineTo(o.x+o.w,y);g.lineTo(o.x+o.w/2,y-o.h);g.fill();g.fillStyle='#fff';g.fillRect(o.x+2,y-7,o.w-4,3)}else if(o.t==='bush'){g.fillStyle='#2a7a2a';g.fillRect(o.x,y-o.h,o.w,o.h);g.fillStyle='#3a9a3a';g.fillRect(o.x+3,y-o.h-3,o.w-8,5)}else{const fl=Math.floor(S.t*10)%2;g.fillStyle='#889';g.fillRect(o.x,y-12,o.w,8);g.fillRect(o.x+o.w-4,y-16,6,6);g.fillStyle='#fa0';g.fillRect(o.x-4,y-11,4,2);g.fillStyle='#667';g.fillRect(o.x+4,y-(fl?20:8),8,fl?8:4);g.fillStyle='#000';g.fillRect(o.x+2,y-14,2,2)}}
  if(S.inv<=0||Math.floor(S.t*14)%2){const x=48,y=GY+S.y,dk=S.dk,lg=Math.sin(S.ph)*4;g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x-14,GY-1,28,3);g.fillStyle='#b07030';
   if(dk){g.fillRect(x-14,y-10,28,8);g.fillRect(x+10,y-13,10,8);g.fillStyle='#704010';g.fillRect(x+16,y-14,4,5);g.fillStyle='#000';g.fillRect(x+16,y-11,2,2);g.fillStyle='#b07030';g.fillRect(x-12,y-2,5,2+(lg>0?0:0));g.fillRect(x+6,y-2,5,2)}
   else{g.fillRect(x-13,y-18,24,9);g.fillRect(x+7,y-24,11,10);g.fillStyle='#704010';g.fillRect(x+13,y-27,4,7);g.fillStyle='#000';g.fillRect(x+14,y-20,2,2);g.fillRect(x+17,y-17,2,2);g.fillStyle='#b07030';g.fillRect(x-13+lg,y-9,4,9-Math.max(0,-lg));g.fillRect(x-4-lg,y-9,4,9-Math.max(0,lg));g.fillRect(x+4+lg,y-9,4,9-Math.max(0,-lg));g.fillRect(x+9-lg,y-9,4,9-Math.max(0,lg));g.fillRect(x-17,y-24+Math.sin(S.t*18)*2,4,9)}}
  arTxt(g,'SCORE '+S.sc,6,14,'#fff');arTxt(g,'♥'.repeat(Math.max(0,S.lv)),234,14,'#f44',10,'right');arTxt(g,'🦴'+S.bn,120,14,'#ffe',10,'center');if(S.t<3.5)arTxt(g,'JUMP: TAP SCREEN · DUCK UNDER BIRDS',120,200,'#fff',9,'center')}};

// 9: ROVER RACER (pseudo-3D)
ARG[9]={ui:[['◀','l'],['NITRO','f'],['▶','r']],div:60,
 curve(z){return Math.sin(z*.0021)*1.7+Math.sin(z*.0007+1.3)*1.4},
 init(S){S.d=0;S.px=0;S.sp=0;S.tl=40;S.tr=[];S.nt=1;S.cp=1800;S.cpn=0;S.cpm='';S.cpT=0;S.shake=0;S.pass=0;S.nit=1;S.bg=0},
 step(S,dt){const I=S.in,nit=I.f&&S.nit>0;S.nit=nit?Math.max(0,S.nit-dt*.35):Math.min(1,S.nit+dt*.1);const mx=205*(nit?1.3:1),off=Math.abs(S.px)>1.05;S.sp+=((off?70:mx)-S.sp)*Math.min(1,dt*(off?3:.9));
  let st=I.r-I.l;if(I.drag&&I.x!=null)st=(I.x-.5)*2.2;S.px+=st*dt*(1.2+S.sp*.004);S.px-=this.curve(S.d)*S.sp*dt*.0026;S.px=Math.max(-1.7,Math.min(1.7,S.px));S.bg+=this.curve(S.d)*S.sp*dt*.06;S.d+=S.sp*dt;S.tl-=dt;S.shake-=dt;S.cpT-=dt;
  if(S.d>=S.cp){S.cp+=1800;S.tl+=12;S.cpn++;S.cpm='CHECKPOINT +12s';S.cpT=1.6;beep(1000,.1,'square',.06);setTimeout(()=>beep(1400,.15,'square',.06),90)}
  S.nt-=dt;if(S.nt<=0){S.nt=.5+Math.random()*.9;S.tr.push({d:S.d+400,l:[-.55,0,.55][Math.floor(Math.random()*3)]+(Math.random()-.5)*.1,v:85+Math.random()*45,c:['#e03040','#3080e0','#40c060','#e0e040','#d060e0','#eee'][Math.floor(Math.random()*6)]})}
  for(let i=S.tr.length-1;i>=0;i--){const c=S.tr[i];c.d+=c.v*dt;const ad=c.d-S.d;if(ad>-6&&ad<9&&Math.abs(c.l-S.px)<.3){S.sp*=.3;S.shake=.4;S.tr.splice(i,1);beep(100,.3,'sawtooth',.09);continue}if(ad<-30){S.pass++;S.tr.splice(i,1)}}
  S.sc=Math.floor(S.d/10)+S.cpn*100+S.pass*5;if(S.tl<=0){S.tl=0;S.over=1}},
 draw(g,S){const H=128,rows=[];g.fillStyle='#4a8ae0';g.fillRect(0,0,240,H);g.fillStyle='#8ab8f0';g.fillRect(0,70,240,H-70);g.fillStyle='#ffd890';g.fillRect(0,H-26,240,26);
  for(let i=-1;i<5;i++){const x=((i*70+S.bg)%350+350)%350-60;g.fillStyle='#5a7a9a';g.beginPath();g.moveTo(x,H);g.lineTo(x+40,H-44-(i&1)*12);g.lineTo(x+90,H);g.fill()}
  let dxx=0,sh=0;for(let y=320,k=0;y>=H;y-=2,k++){const t=(y-H)/(320-H),D=14/(t+.02);dxx+=this.curve(S.d+D)*.0042;sh+=dxx;const w=6+t*150;rows[k]={y,w,cx:120-S.px*w*.9+sh*.9,D}}
  for(let k=rows.length-1;k>=0;k--){const r=rows[k],z=Math.floor((S.d+r.D)/16)%2,x=r.cx,w=r.w;g.fillStyle=z?'#2f9a3f':'#2a8a38';g.fillRect(0,r.y,240,2);g.fillStyle=z?'#e8e8e8':'#d03030';g.fillRect(x-w*1.12,r.y,w*2.24,2);g.fillStyle=z?'#555a66':'#4e5460';g.fillRect(x-w,r.y,w*2,2);if(Math.floor((S.d+r.D)/10)%2){g.fillStyle='#d8d8c0';g.fillRect(x-w*.34-1,r.y,2,2);g.fillRect(x+w*.34-1,r.y,2,2)}}
  const put=(ad,lat,fn)=>{if(ad<14||ad>690)return;const t=14/ad-.02,k=Math.round((1-t)*(rows.length-1));const r=rows[Math.max(0,Math.min(rows.length-1,k))];fn(r.cx+lat*r.w,r.y,t)};
  for(let n=0;n<10;n++){const dd=Math.floor(S.d/40)*40+40*(n+1)+0;for(const sd of[-1.7,1.7]){put(dd-S.d,sd,(x,y,t)=>{const sz=4+t*34;g.fillStyle='#5a3a1a';g.fillRect(x-sz*.07,y-sz*.5,sz*.14,sz*.5);g.fillStyle='#1f7a2f';g.fillRect(x-sz*.3,y-sz*1.1,sz*.6,sz*.65)})}}
  const trs=S.tr.slice().sort((a,b)=>b.d-a.d);for(const c of trs)put(c.d-S.d,c.l,(x,y,t)=>{const w=3+t*28,h=w*.7;g.fillStyle='#111';g.fillRect(x-w*.55,y-h*.3,w*.2,h*.3);g.fillRect(x+w*.35,y-h*.3,w*.2,h*.3);g.fillStyle=c.c;g.fillRect(x-w*.5,y-h,w,h*.8);g.fillStyle='rgba(0,0,0,.55)';g.fillRect(x-w*.38,y-h*.9,w*.76,h*.3);g.fillStyle='#f33';g.fillRect(x-w*.46,y-h*.35,w*.2,h*.15);g.fillRect(x+w*.26,y-h*.35,w*.2,h*.15)});
  const sx=120+(S.shake>0?Math.sin(S.t*60)*3:0),st=(S.in.r-S.in.l)*2;g.fillStyle='#111';g.fillRect(sx-22,292,8,10);g.fillRect(sx+14,292,8,10);g.fillStyle='#ff9a20';g.fillRect(sx-19,276,38,20);g.fillStyle='#ffb040';g.fillRect(sx-14,270,28,10);g.fillStyle='rgba(30,40,60,.85)';g.fillRect(sx-12,272,24,7);g.fillStyle='#f22';g.fillRect(sx-18,284,8,4);g.fillRect(sx+10,284,8,4);if(S.sp>200){g.fillStyle='rgba(120,200,255,.8)';g.fillRect(sx-10,300,6,6+Math.random()*6);g.fillRect(sx+4,300,6,6+Math.random()*6)}
  arTxt(g,'TIME '+Math.ceil(S.tl),6,14,S.tl<8?'#f66':'#ffe040',12);arTxt(g,'SCORE '+S.sc,234,14,'#fff',10,'right');arTxt(g,Math.round(S.sp*.7)+' MPH',6,312,'#fff',10);g.fillStyle='#222';g.fillRect(150,304,84,7);g.fillStyle='#40c0ff';g.fillRect(150,304,84*S.nit,7);arTxt(g,'NITRO',192,300,'#8cf',7,'center');if(S.cpT>0)arTxt(g,S.cpm,120,90,'#ffe040',14,'center');if(S.t<3)arTxt(g,'STEER · HOLD NITRO TO BOOST',120,170,'#fff',9,'center')}};
// 10: PINBALL
ARG[10]={ui:[['◀ FLIP','l'],['PLUNGE','f'],['FLIP ▶','r']],div:400,
 init(S){S.b=[222,298];S.v=[0,0];S.ball=3;S.pw=0;S.lane=1;S.fl=[{p:[70,288],a0:.52,a1:-.45,a:.52,w:0},{p:[154,288],a0:Math.PI-.52,a1:Math.PI+.45,a:Math.PI-.52,w:0}];S.lit=[0,0,0];S.mult=1;S.msg='';S.mT=0;S.bf=[0,0,0];S.pf=0;S.sc=0},
 segs:[[11,120,11,246],[11,246,68,288],[213,96,213,246],[213,246,156,288],[229,70,229,314],[213,314,229,314]],
 bump:[[120,98,12],[86,134,12],[154,134,12]],
 hitSeg(S,x1,y1,x2,y2,e,vx,vy,ex){const b=S.b,v=S.v,dx=x2-x1,dy=y2-y1,l2=dx*dx+dy*dy;let t=((b[0]-x1)*dx+(b[1]-y1)*dy)/l2;t=Math.max(0,Math.min(1,t));const px=x1+dx*t,py=y1+dy*t;let nx=b[0]-px,ny=b[1]-py,d=Math.hypot(nx,ny);const R=5+(ex||0);if(d<R&&d>.0001){nx/=d;ny/=d;b[0]=px+nx*R;b[1]=py+ny*R;const rv=(v[0]-(vx||0))*nx+(v[1]-(vy||0))*ny;if(rv<0){v[0]-=(1+e)*rv*nx;v[1]-=(1+e)*rv*ny}return true}return false},
 step(S,dt){const I=S.in;S.mT-=dt;S.pf-=dt;
  for(let i=0;i<2;i++){const f=S.fl[i],on=i===0?I.l:I.r,tg=on?f.a1:f.a0,old=f.a,sp=22*dt;f.a+=Math.max(-sp,Math.min(sp,tg-f.a));f.w=(f.a-old)/Math.max(dt,.001);if((i===0?I.lp:I.rp))beep(220,.03,'square',.04)}
  if(S.lane&&S.b[0]>=214&&S.b[1]>=296){if(I.f){S.pw=Math.min(1,S.pw+dt*1.2)}else if(S.pw>.05){S.v=[0,-(330+S.pw*560)];S.pw=0;S.lane=0;beep(300,.1,'square',.06)}else S.pw=0;if(S.lane){S.b=[222,298+S.pw*8];S.v=[0,0];return}}
  const n=4,h=dt/n;for(let it=0;it<n;it++){const b=S.b,v=S.v;v[1]+=360*h;const sp=Math.hypot(v[0],v[1]);if(sp>560){v[0]*=560/sp;v[1]*=560/sp}b[0]+=v[0]*h;b[1]+=v[1]*h;
   if(b[1]<120){const dx=b[0]-120,dy=b[1]-120,d=Math.hypot(dx,dy),R=110-5;if(d>R){const ox=dx/d,oy=dy/d;b[0]=120+ox*R;b[1]=120+oy*R;const vo=v[0]*ox+v[1]*oy;if(vo>0){v[0]-=1.5*vo*ox;v[1]-=1.5*vo*oy}}}
   for(const sg of this.segs)this.hitSeg(S,sg[0],sg[1],sg[2],sg[3],.55);
   for(let i=0;i<2;i++){const f=S.fl[i],L=38,tx=f.p[0]+Math.cos(f.a)*L,ty=f.p[1]+Math.sin(f.a)*L;const hit=this.hitSeg(S,f.p[0],f.p[1],tx,ty,.35,0,0,3);if(hit&&Math.abs(f.w)>2){const rx=b[0]-f.p[0],ry=b[1]-f.p[1];v[0]+=-f.w*ry*.7;v[1]+=f.w*rx*.7;const s2=Math.hypot(v[0],v[1]);if(s2>560){v[0]*=560/s2;v[1]*=560/s2}}}
   this.bump.forEach((q,i)=>{const dx=b[0]-q[0],dy=b[1]-q[1],d=Math.hypot(dx,dy);if(d<q[2]+5&&d>.001){const nx=dx/d,ny=dy/d;b[0]=q[0]+nx*(q[2]+5);b[1]=q[1]+ny*(q[2]+5);const vn=v[0]*nx+v[1]*ny;if(vn<0){v[0]-=(1+.4)*vn*nx;v[1]-=(1+.4)*vn*ny}v[0]+=nx*140;v[1]+=ny*140;S.bf[i]=.18;S.sc+=100*S.mult;beep(500+i*120,.05,'square',.05)}});
   for(const [px,py] of [[40,190],[184,190],[60,70],[180,70]]){const dx=b[0]-px,dy=b[1]-py,d=Math.hypot(dx,dy);if(d<5+5&&d>.001){const nx=dx/d,ny=dy/d;b[0]=px+nx*10;b[1]=py+ny*10;const vn=v[0]*nx+v[1]*ny;if(vn<0){v[0]-=1.8*vn*nx;v[1]-=1.8*vn*ny}S.sc+=10;beep(700,.03,'square',.03)}}
   [[80,44],[120,36],[160,44]].forEach(([rx,ry],i)=>{if(!S.lit[i]&&Math.hypot(b[0]-rx,b[1]-ry)<9){S.lit[i]=1;S.sc+=50*S.mult;beep(900+i*100,.05,'square',.04);if(S.lit.every(x=>x)){S.mult=Math.min(5,S.mult+1);S.sc+=500;S.msg='x'+S.mult+' BONUS!';S.mT=1.4;S.lit=[0,0,0];beep(1300,.15,'square',.06)}}})}
  for(let i=0;i<3;i++)S.bf[i]-=dt;
  if(S.b[1]>326&&S.b[0]<213||S.b[1]>340){S.ball--;S.msg=S.ball>0?'BALL LOST':'';S.mT=1.2;beep(150,.3,'sawtooth',.07);if(S.ball<=0){S.over=1;return}S.b=[222,298];S.v=[0,0];S.lane=1;S.lit=[0,0,0];S.mult=1}
  else if(!S.lane&&S.b[0]>214&&S.b[1]>=300&&Math.hypot(S.v[0],S.v[1])<40){S.lane=1;S.v=[0,0]}},
 draw(g,S){g.fillStyle='#08041a';g.fillRect(0,0,240,320);g.fillStyle='#1a1050';g.beginPath();g.moveTo(11,314);g.lineTo(11,120);g.arc(120,120,110,Math.PI,0);g.lineTo(229,314);g.closePath();g.fill();g.fillStyle='#120a38';g.fillRect(214,70,15,244);
  g.strokeStyle='#40e0ff';g.lineWidth=2;g.beginPath();g.moveTo(11,246);g.lineTo(11,120);g.arc(120,120,110,Math.PI,0);g.lineTo(229,314);g.stroke();g.strokeStyle='#ff40c0';for(const sg of this.segs.slice(1,4)){g.beginPath();g.moveTo(sg[0],sg[1]);g.lineTo(sg[2],sg[3]);g.stroke()}g.beginPath();g.moveTo(11,246);g.lineTo(68,288);g.stroke();
  g.fillStyle='rgba(255,255,255,.06)';for(let i=0;i<8;i++)g.fillRect(40+i*18,160+(i%3)*20,2,2);
  [[80,44],[120,36],[160,44]].forEach(([x,y],i)=>{g.fillStyle=S.lit[i]?'#ffe040':'#403010';g.beginPath();g.arc(x,y,6,0,6.3);g.fill();g.strokeStyle='#888';g.lineWidth=1;g.stroke()});
  for(const [x,y] of [[40,190],[184,190],[60,70],[180,70]]){g.fillStyle='#c0c0d0';g.beginPath();g.arc(x,y,5,0,6.3);g.fill()}
  this.bump.forEach((q,i)=>{g.fillStyle=S.bf[i]>0?'#fff':['#ff3070','#30c0ff','#ffd030'][i];g.beginPath();g.arc(q[0],q[1],q[2],0,6.3);g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.arc(q[0],q[1],q[2]-4,0,6.3);g.stroke()});
  g.lineCap='round';g.lineWidth=8;for(let i=0;i<2;i++){const f=S.fl[i];g.strokeStyle='#e8e8f0';g.beginPath();g.moveTo(f.p[0],f.p[1]);g.lineTo(f.p[0]+Math.cos(f.a)*38,f.p[1]+Math.sin(f.a)*38);g.stroke();g.fillStyle='#ff4060';g.beginPath();g.arc(f.p[0],f.p[1],4,0,6.3);g.fill()}g.lineCap='butt';
  g.fillStyle='#888';g.fillRect(218,302+S.pw*8,8,10);g.fillStyle='#444';g.fillRect(220,312+S.pw*8,4,4);
  g.fillStyle='#f8f8ff';g.beginPath();g.arc(S.b[0],S.b[1],5,0,6.3);g.fill();g.fillStyle='rgba(120,120,200,.6)';g.beginPath();g.arc(S.b[0]+1.5,S.b[1]+1.5,3,0,6.3);g.fill();g.fillStyle='#fff';g.fillRect(S.b[0]-2,S.b[1]-3,2,2);
  arTxt(g,'SCORE '+S.sc,6,14,'#fff');arTxt(g,'BALLS '+'●'.repeat(Math.max(0,S.ball)),234,14,'#ffe040',10,'right');if(S.mult>1)arTxt(g,'x'+S.mult,120,200,'#ff80ff',20,'center');if(S.mT>0&&S.msg)arTxt(g,S.msg,120,170,'#ffe040',16,'center');if(S.lane&&S.t<6)arTxt(g,'HOLD PLUNGE, RELEASE TO LAUNCH',120,308,'#ffe040',8,'center')}};
/* ===== vD9: COIN PUSHER (3D) ===== */
const CPW=2.0,CPZF=3.0,CNR=.15,CPMAX=220;
var CP=null;
function cpCoinTex(){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),r=g.createRadialGradient(64,64,4,64,64,64);r.addColorStop(0,'#fff0a0');r.addColorStop(.6,'#f0c030');r.addColorStop(1,'#b07810');g.fillStyle=r;g.fillRect(0,0,128,128);g.strokeStyle='#8a5a08';g.lineWidth=7;g.beginPath();g.arc(64,64,58,0,6.3);g.stroke();g.strokeStyle='#ffe888';g.lineWidth=3;g.beginPath();g.arc(64,64,47,0,6.3);g.stroke();g.fillStyle='#a06a0a';g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?13:30;g.lineTo(64+Math.cos(a)*rr,64+Math.sin(a)*rr)}g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.28)';g.beginPath();g.ellipse(46,40,20,9,-.6,0,6.3);g.fill();const tx=new THREE.CanvasTexture(c);tx.anisotropy=4;return tx}
function cpDeckTex(){const f=cvT(256,256),g=f.cv.getContext('2d');g.fillStyle='#140c30';g.fillRect(0,0,256,256);g.strokeStyle='#3a2a80';g.lineWidth=1;for(let i=0;i<=16;i++){g.beginPath();g.moveTo(i*16,0);g.lineTo(i*16,256);g.stroke();g.beginPath();g.moveTo(0,i*16);g.lineTo(256,i*16);g.stroke()}g.strokeStyle='#ff40c0';g.lineWidth=3;for(let y=30;y<256;y+=60){g.beginPath();g.moveTo(88,y);g.lineTo(128,y+22);g.lineTo(168,y);g.stroke()}g.strokeStyle='#20e0ff';g.lineWidth=4;g.strokeRect(4,4,248,248);f.tx.needsUpdate=true;return f.tx}
function cpBuild(){const G=new THREE.Group();G.position.set(0,-40,0);SG.add(G);const T={},mb=(c,o)=>new THREE.MeshBasicMaterial(Object.assign({color:c,fog:false},o||{}));
 const room=new THREE.Mesh(new THREE.BoxGeometry(34,18,34),mb(0x160a32,{side:THREE.BackSide}));room.position.set(0,6,0);G.add(room);
 for(let i=0;i<6;i++){vB(G,.12,.12,32,i%2?0xff40c0:0x20e0ff,-9+i*3.6,7+(i%2)*2,0)}for(let i=-6;i<=6;i++)vB(G,.1,6,.1,i%2?0x6a40ff:0xff40c0,i*2.6,0,-16);
 const fl=new THREE.Mesh(new THREE.PlaneGeometry(34,34).rotateX(-Math.PI/2),mb(0x0c0620));fl.position.y=-1.8;G.add(fl);
 // cabinet
 vB(G,2*CPW+.5,1.8,CPZF+1.9,0x241448,0,-.92,(CPZF-.9)/2);const dk=new THREE.Mesh(new THREE.PlaneGeometry(2*CPW,CPZF+.7).rotateX(-Math.PI/2),mb(0xffffff,{map:cpDeckTex()}));dk.position.set(0,.002,(CPZF-.7)/2);G.add(dk);
 
 for(const sx of[-1,1]){vB(G,.14,1.0,CPZF+1.2,0x2a1858,sx*(CPW+.07),.45,(CPZF-.4)/2);vB(G,.16,.06,CPZF+1.2,sx>0?0xff40c0:0x20e0ff,sx*(CPW+.07),.95,(CPZF-.4)/2)}
 vB(G,2*CPW+.3,3.2,.2,0x1e1040,0,1.6,-1.0);vB(G,2*CPW+.3,.08,.22,0xff40c0,0,3.2,-1.0);vB(G,2*CPW+.3,.08,.22,0x20e0ff,0,1.0,-.99);
 const mq=new THREE.Mesh(new THREE.PlaneGeometry(3.4,.9),mb(0xffffff,{map:txtTex(320,84,'#14082a','#ffe040','COIN PUSHER',44)}));mq.position.set(0,2.2,-.88);G.add(mq);
 for(let i=0;i<14;i++)vB(G,.12,.12,.04,[0xff4060,0xffe040,0x40e0ff][i%3],-1.9+i*.29,2.72,-.86);
 // lip, chute, tray
 vB(G,2*CPW+.1,.3,.2,0x3a2a70,0,-.15,CPZF+.1);vB(G,2*CPW+.1,.05,.2,0xff40c0,0,.0,CPZF+.1);
 vB(G,2*CPW+.1,.06,1.0,0x201040,0,-1.05,CPZF+.55,.5);vB(G,2*CPW+.3,.5,1.0,0x50506a,0,-1.5,CPZF+1.1);vB(G,2*CPW,.06,.9,0x8a8aa0,0,-1.05,CPZF+1.15);
 for(const sx of[-1,1])vB(G,.1,.5,1.1,0x6a6a80,sx*(CPW+.05),-1.05,CPZF+1.1);
 // pusher
 const PU=new THREE.Group();G.add(PU);vB(PU,2*CPW-.04,.2,1.8,0x3a3a7a,0,.1,-.9);vB(PU,2*CPW-.04,.06,.06,0xff40c0,0,.17,.0);for(let i=0;i<10;i++)vB(PU,.3,.2,.04,i%2?0x20e0ff:0xffe040,-1.8+i*.4,.1,.02);vB(PU,2*CPW-.04,.02,1.8,0x5a5aa0,0,.205,-.9);T.PU=PU;
 // dropper
 const DR=new THREE.Group();G.add(DR);vB(DR,.3,.3,.3,0x888898,0,0,0);vB(DR,.2,.06,.2,0xffa020,0,-.04,0);vB(DR,.1,.5,.1,0x666678,0,.3,0);vB(DR,.12,.08,.34,0x888898,0,.78,-.5);T.DR=DR;vB(G,2*CPW+.2,.1,.16,0x666678,0,2.0,-.62);
 // coins
 const geo=new THREE.CylinderGeometry(CNR,CNR,.045,22),mat=new THREE.MeshBasicMaterial({map:cpCoinTex(),fog:false});const IM=new THREE.InstancedMesh(geo,mat,CPMAX);IM.frustumCulled=false;IM.count=0;G.add(IM);T.IM=IM;T.dm=new THREE.Object3D();T.col=new THREE.Color();
 T.G=G;T.itm=[];return T}
function cpItem(T,k,x,z){let m,r,v;if(k===0){m=new THREE.Mesh(new THREE.CylinderGeometry(.33,.33,.09,28),new THREE.MeshBasicMaterial({map:T.IM.material.map,fog:false,color:0xfff0b0}));r=.33;v=50}
 else if(k===1){m=new THREE.Group();vB(m,.46,.4,.46,0xe03050,0,0,0);vB(m,.48,.1,.1,0xffd040,0,.15,0);vB(m,.1,.42,.48,0xffd040,0,0,0);vB(m,.2,.1,.2,0xffd040,0,.4,0);r=.28;v=8}
 else{m=new THREE.Mesh(vmShade(new THREE.OctahedronGeometry(.27),0x40e0ff),VMM);m.scale.y=1.3;r=.26;v=15}
 m.traverse(o=>o.frustumCulled=false);T.G.add(m);return{ty:1+k,x,z,vx:0,vz:0,y:.1,vy:0,st:'tab',r,m,v,k,sp:0}}
function cpOpen(){if(CP)return;if(cash<2){toast('NEED £2 FOR 20 COINS');beep(120,.2,'sawtooth',.08);return}cash-=2;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;document.body.classList.add('dz');beep(660,.08,'square',.05);
 const T=cpBuild(),S={T,t:0,coins:20,won:0,bonus:0,aim:0,cs:[],fl:[],msg:'',mT:0,idle:0,over:0,drop:0,last:performance.now(),raf:0,pz:.6,pv:0,hold:0,sh:0};CP=S;
 for(let i=0;i<58;i++){const row=Math.floor(i/9),col=i%9;S.cs.push({ty:0,x:-1.7+col*.42+(row%2)*.2+(Math.random()-.5)*.06,z:1.5+row*.33+(Math.random()-.5)*.05,vx:0,vz:0,y:.0225,vy:0,st:'tab',r:CNR,tilt:[(Math.random()-.5)*.16,Math.random()*6.3,(Math.random()-.5)*.16],pr:0})}
 S.items=[cpItem(T,0,0,2.15),cpItem(T,1,-1.1,1.75),cpItem(T,1,1.15,2.05),cpItem(T,2,.65,1.7),cpItem(T,2,-.7,2.4)];
 const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:70;font:bold 13px ui-monospace,Menlo,monospace;color:#fff;touch-action:none;user-select:none;-webkit-user-select:none';
 ov.innerHTML='<div id="cph" style="position:absolute;left:0;right:0;top:8px;text-align:center;text-shadow:2px 2px 0 #000;font-size:14px;pointer-events:none"></div><div id="cpm" style="position:absolute;left:0;right:0;top:30%;text-align:center;font-size:26px;color:#ffe040;text-shadow:3px 3px 0 #000;pointer-events:none;opacity:0"></div><div id="cpb" style="position:absolute;left:0;right:0;bottom:16px;display:flex;gap:10px;justify-content:center"></div><div id="cpr" style="display:none;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(90vw,340px);background:rgba(10,14,24,.96);border:3px solid #fff;box-shadow:5px 5px 0 #000;padding:14px;text-align:center"></div>';document.body.appendChild(ov);S.ov=ov;
 const btn=(t,col,dn,up)=>{const b=document.createElement('div');b.textContent=t;b.style.cssText='min-width:'+(t.length>3?100:64)+'px;padding:16px 10px;text-align:center;border:3px solid #fff;border-radius:12px;background:'+col+';box-shadow:3px 3px 0 #000;touch-action:none;pointer-events:auto';b.onpointerdown=e=>{e.preventDefault();e.stopPropagation();dn()};b.onpointerup=b.onpointercancel=b.onpointerleave=()=>{up&&up()};ov.querySelector('#cpb').appendChild(b)};
 S.l=S.r=0;btn('◀','#1c4fa0',()=>S.l=1,()=>S.l=0);btn('DROP','#b02020',()=>{S.hold=1;cpDrop()},()=>S.hold=0);btn('▶','#1c4fa0',()=>S.r=1,()=>S.r=0);
 const ex=document.createElement('div');ex.textContent='CASH OUT';ex.style.cssText='position:absolute;right:8px;top:40px;padding:7px 10px;border:2px solid #fff;border-radius:8px;background:#6a3a8a;font-size:11px;pointer-events:auto';ex.onpointerdown=e=>{e.stopPropagation();cpEnd()};ov.appendChild(ex);
 const lv=document.createElement('div');lv.textContent='EXIT';lv.style.cssText='position:absolute;left:8px;top:40px;padding:7px 10px;border:2px solid #fff;border-radius:8px;background:#333;font-size:11px;pointer-events:auto';lv.onpointerdown=e=>{e.stopPropagation();cpClose(1)};ov.appendChild(lv);
 ov.onpointerdown=e=>{S.dr=1;S.aim=Math.max(-CPW+.3,Math.min(CPW-.3,(e.clientX/innerWidth-.5)*2*(CPW+.25)))};ov.onpointermove=e=>{if(S.dr)S.aim=Math.max(-CPW+.3,Math.min(CPW-.3,(e.clientX/innerWidth-.5)*2*(CPW+.25)))};ov.onpointerup=ov.onpointercancel=()=>{S.dr=0};
 S.kd=e=>{if(e.key==='Escape')cpClose(1);else if(e.key==='ArrowLeft'||e.key==='a')S.l=1;else if(e.key==='ArrowRight'||e.key==='d')S.r=1;else if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!S.hold){S.hold=1;cpDrop()}}};S.ku=e=>{if(e.key==='ArrowLeft'||e.key==='a')S.l=0;else if(e.key==='ArrowRight'||e.key==='d')S.r=0;else if(e.key===' '||e.key==='Enter')S.hold=0};addEventListener('keydown',S.kd);addEventListener('keyup',S.ku);
 DZ.fn=cpCam;DZ.fov=52;DZ.tp=cpCam();DZ.look=new THREE.Vector3();DZ.on=1;cpCam();S.last=performance.now();S.raf=requestAnimationFrame(cpLoop)}
function cpCam(){const S=CP;if(!S)return new THREE.Vector3();const asp=innerWidth/innerHeight,por=asp<.9,y0=-40,p=por?[0,6.2,7.4]:[0,3.9,5.8],l=por?[0,-.2,1.2]:[0,-.15,1.15];DZ.look=SG.localToWorld(new THREE.Vector3(l[0]+(S.sh>0?(Math.random()-.5)*.08:0),l[1]+y0,l[2]));DZ.fov=por?60:50;return SG.localToWorld(new THREE.Vector3(p[0],p[1]+y0,p[2]))}
function cpDrop(){const S=CP;if(!S||S.over||S.coins<=0||S.cs.length>=CPMAX-4)return;if(S.fl.some(f=>f.age<.12))return;S.coins--;S.idle=0;S.fl.push({x:S.aim,z:1.5,y:1.75,vy:0,age:0});beep(760,.05,'square',.05)}
function cpMsg(t,c){const e=CP&&CP.ov.querySelector('#cpm');if(!e)return;e.textContent=t;e.style.color=c||'#ffe040';e.style.opacity=1;clearTimeout(CP.mt);CP.mt=setTimeout(()=>{if(e)e.style.opacity=0},900)}
function cpPhys(S,dt){const W=CPW,t=S.t,T=3.6,a=.5,b=1.3,om=6.2832/T;S.pz=a+(b-a)*(.5-.5*Math.cos(t*om));S.pv=(b-a)*.5*Math.sin(t*om)*om;S.T.PU.position.z=S.pz;
 const all=S.cs.concat(S.items.filter(i=>i.st==='tab'));
 for(const c of all){if(c.st!=='tab')continue;c.x+=c.vx*dt;c.z+=c.vz*dt;const f=Math.exp(-5.5*dt);c.vx*=f;c.vz*=f;c.pr=0}
 for(let it=0;it<4;it++){for(const c of all){if(c.st!=='tab')continue;const r=c.r;if(c.x<-W+r){c.x=-W+r;c.vx=Math.abs(c.vx)*.2}if(c.x>W-r){c.x=W-r;c.vx=-Math.abs(c.vx)*.2}if(c.z-r<S.pz+.01){c.z=S.pz+.01+r;if(c.vz<S.pv)c.vz=S.pv}}
  for(let i=0;i<all.length;i++){const p=all[i];if(p.st!=='tab')continue;for(let j=i+1;j<all.length;j++){const q=all[j];if(q.st!=='tab')continue;const dx=q.x-p.x,dz=q.z-p.z,m=p.r+q.r;if(Math.abs(dx)>m||Math.abs(dz)>m)continue;const d2=dx*dx+dz*dz;if(d2>=m*m)continue;const d=Math.sqrt(d2)||.0001,nx=dx/d,nz=dz/d,ov=m-d,mp=p.r*p.r,mq=q.r*q.r,wp=mq/(mp+mq),wq=mp/(mp+mq);p.x-=nx*ov*wp;p.z-=nz*ov*wp;q.x+=nx*ov*wq;q.z+=nz*ov*wq;p.pr+=ov;q.pr+=ov;const vn=(q.vx-p.vx)*nx+(q.vz-p.vz)*nz;if(vn<0){const j2=-vn*1.1/(1/mp+1/mq);p.vx-=nx*j2/mp;p.vz-=nz*j2/mp;q.vx+=nx*j2/mq;q.vz+=nz*j2/mq}}}}
 for(const c of all){if(c.st==='tab'&&c.z>CPZF){c.st='fall';c.vy=0;c.sp=(Math.random()-.5)*8}}
 const fall=a2=>{for(const c of a2){if(c.st!=='fall')continue;c.x+=c.vx*dt;c.z+=c.vz*dt;c.vy-=9.8*dt;c.y+=c.vy*dt;if(c.y<-1.05&&c.z<CPZF+.9){c.vy=0;c.y=-1.05;c.st='tray';c.tm=.3}if(c.z>CPZF+1.0){c.vz=-.5}}};fall(S.cs);fall(S.items);
 for(const list of [S.cs,S.items]){for(let i=list.length-1;i>=0;i--){const c=list[i];if(c.st==='tray'){c.tm-=dt;if(c.tm<=0){if(c.ty===0){S.won++;S.coins++;beep(1250+Math.random()*200,.05,'square',.05);if(S.won%5===0)cpMsg('+5 COINS')}else{S.bonus+=c.v;cpMsg(c.k===0?'JACKPOT! +'+c.v+' TICKETS':'PRIZE! +'+c.v+' TICKETS','#ff90ff');beep(1000,.1,'square',.06);setTimeout(()=>beep(1500,.2,'square',.06),100);setTimeout(()=>beep(2000,.25,'square',.06),220);S.sh=.6;if(c.m.parent)c.m.parent.remove(c.m)}list.splice(i,1)}}}}}
function cpLoop(now){const S=CP;if(!S)return;const dt=Math.max(0,Math.min(.05,(now-S.last)/1000));S.last=now;S.t+=dt;S.sh-=dt;const T=S.T;
 if(!S.over){S.aim=Math.max(-CPW+.3,Math.min(CPW-.3,S.aim+(S.r-S.l)*2.4*dt));if(S.hold){S.hd=(S.hd||0)-dt;if(S.hd<=0){S.hd=.28;cpDrop()}}
  for(let i=S.fl.length-1;i>=0;i--){const f=S.fl[i];f.age+=dt;f.vy-=14*dt;f.y+=f.vy*dt;if(f.y<=.03){S.cs.push({ty:0,x:f.x,z:f.z,vx:0,vz:.2,y:.0225,vy:0,st:'tab',r:CNR,tilt:[(Math.random()-.5)*.16,Math.random()*6.3,(Math.random()-.5)*.16],pr:0});S.fl.splice(i,1);beep(420,.03,'square',.03)}}
  cpPhys(S,dt/2);cpPhys(S,dt/2);S.t+=0;
  if(S.coins<=0&&!S.fl.length){S.idle+=dt;if(S.idle>5)cpEnd()}}
 T.DR.position.set(S.aim,1.7,1.5);
 const im=T.IM,dm=T.dm,n=Math.min(CPMAX,S.cs.length+S.fl.length);im.count=n;let k=0;
 for(const c of S.cs){if(k>=n)break;const lift=Math.min(.07,c.pr*.5);dm.position.set(c.x,c.st==='tab'?c.y+lift:c.y,c.z);if(c.st==='fall'){dm.rotation.set(c.vy*.3+c.tilt[0],c.tilt[1]+c.sp*S.t,c.tilt[2])}else dm.rotation.set(c.tilt[0],c.tilt[1],c.tilt[2]);dm.updateMatrix();im.setMatrixAt(k,dm.matrix);k++}
 for(const f of S.fl){if(k>=n)break;dm.position.set(f.x,f.y,f.z);dm.rotation.set(f.age*9,0,0);dm.updateMatrix();im.setMatrixAt(k,dm.matrix);k++}
 im.instanceMatrix.needsUpdate=true;
 for(const c of S.items){c.m.position.set(c.x,c.y+(c.st==='tab'?Math.min(.05,c.pr*.3):0),c.z);c.m.rotation.y+=dt*(c.st==='tab'?0:3);if(c.st==='fall')c.m.rotation.x+=dt*4}
 const h=S.ov.querySelector('#cph');if(h&&Math.floor(S.t*6)!==S.hf){S.hf=Math.floor(S.t*6);h.innerHTML='<span style="color:#ffe040">COINS '+S.coins+'</span> · WON '+S.won+' · BONUS '+S.bonus+(S.coins<=0&&!S.over?'<br><span style="color:#f88;font-size:11px">OUT OF COINS - WATCH THE PILE...</span>':'<br><span style="font-size:11px;color:#9cf">DRAG TO AIM · HOLD DROP TO FIRE</span>')}
 S.raf=requestAnimationFrame(cpLoop)}
function cpEnd(){const S=CP;if(!S||S.over)return;S.over=1;const tix=Math.floor(S.won/2)+S.bonus,pb=tix>(ARP.best[11]||0);if(pb)ARP.best[11]=tix;ARP.tix+=tix;arSave();beep(tix>0?880:200,.2,'square',.06);
 const r=S.ov.querySelector('#cpr');r.style.display='block';r.innerHTML='<div style="font-size:16px;color:#ffe040">COIN PUSHER</div><div style="font-size:34px;margin:6px 0">'+tix+'<span style="font-size:14px"> TICKETS</span></div><div style="color:#9fd8b0">'+S.won+' COINS WON (2 = 1 TICKET) · '+S.bonus+' BONUS</div>'+(pb?'<div style="color:#7f7">NEW BEST!</div>':'')+'<div style="color:#ff90e0;margin:6px 0">TOTAL '+ARP.tix+' TICKETS</div>';
 const mk=(t,f,c)=>{const b=document.createElement('div');b.textContent=t;b.style.cssText='display:inline-block;margin:5px;padding:11px 16px;border:3px solid #fff;border-radius:10px;background:'+c+';box-shadow:3px 3px 0 #000';b.onpointerdown=e=>{e.stopPropagation();e.preventDefault();f()};r.appendChild(b)};
 mk('AGAIN  -£2',()=>{if(cash<2){toast('NEED £2');return}cpClose(0);cpOpen()},'#1a8a3a');mk('LEAVE',()=>cpClose(0),'#444')}
function cpClose(q){const S=CP;if(!S)return;if(q&&!S.over&&(Math.floor(S.won/2)+S.bonus)>0){S.over=1;const q2=Math.floor(S.won/2)+S.bonus;ARP.tix+=q2;arSave();toast('+'+q2+' TICKETS')}cancelAnimationFrame(S.raf);removeEventListener('keydown',S.kd);removeEventListener('keyup',S.ku);S.ov.remove();SG.remove(S.T.G);CP=null;DZ.fn=null;DZ.on=0;DZ.exit=1;document.body.classList.remove('dz');busy=0}
/* cabinet prop in the arcade */
{const b0=buildArcade;buildArcade=function(o){b0(o);const W=(x,y,z,w,h,d,hex)=>gbox(SG,x,y,z,w,h,d,hex),gx=3.0,gz=-4.6;
 W(gx,0,gz,1.7,1.1,1.5,0x2a1850);W(gx,1.1,gz-.1,1.7,1.0,1.3,0x1a1038);W(gx,2.1,gz,1.74,.4,1.5,0xff40c0);W(gx-.84,1.1,gz+.2,.06,.9,.6,0x20e0ff);W(gx+.84,1.1,gz+.2,.06,.9,.6,0x20e0ff);
 const gl=new THREE.Mesh(new THREE.BoxGeometry(1.6,.8,.5),new THREE.MeshBasicMaterial({color:0x80d0ff,transparent:true,opacity:.22,fog:false,depthWrite:false}));gl.position.set(gx,1.5,gz+.4);SG.add(gl);
 for(let i=0;i<12;i++)W(gx-.6+(i%6)*.24,1.12,gz+.15+Math.floor(i/6)*.25,.16,.03,.16,0xffd040);W(gx,1.12,gz+.52,.5,.04,.12,0xff40c0);
 sPlane(1.6,.36,gx,2.3,gz+.76,0,txtTex(192,44,'#14082a','#ffe040','COIN PUSHER',22));W(gx,.3,gz+.78,1.2,.1,.2,0x555560);W(gx+.7,.7,gz+.76,.1,.3,.03,0x101014);
 IROOM.push([gx-.9,gx+.9,gz-.8,gz+.8]);IA.push({r:[gx-1.2,gx+1.2,gz+.8,gz+2.5],label:()=>'PLAY COIN PUSHER · £2 FOR 20 COINS'+(ARP.best[11]?' · BEST '+ARP.best[11]:''),fn:()=>cpOpen()})}}
/* ===== vD10: 3D skins for arcade games (claw, air hockey, whack-a-mole, pinball) ===== */
function x3Room(G){const mb=(c,o)=>new THREE.MeshBasicMaterial(Object.assign({color:c,fog:false},o||{}));
 const room=new THREE.Mesh(new THREE.BoxGeometry(34,18,34),mb(0x160a32,{side:THREE.BackSide}));room.position.set(0,6,0);G.add(room);
 for(let i=0;i<6;i++)vB(G,.12,.12,32,i%2?0xff40c0:0x20e0ff,-9+i*3.6,7+(i%2)*2,0);for(let i=-6;i<=6;i++)vB(G,.1,6,.1,i%2?0x6a40ff:0xff40c0,i*2.6,3,-16);
 const fl=new THREE.Mesh(new THREE.PlaneGeometry(34,34).rotateX(-Math.PI/2),mb(0x0c0620));fl.position.y=-2.4;G.add(fl)}
function x3Begin(A){const S=A.S,sk=A.def.sk3,G=new THREE.Group();G.position.set(0,-40,0);SG.add(G);A.G=G;x3Room(G);A.X=sk.build(S,G,A);
 const ov=A.ov;ov.style.background='transparent';ov.style.justifyContent='space-between';ov.style.padding='4px 0 14px';const w=ov.querySelector('#arw');w.style.cssText='position:absolute;inset:0;border:none;box-shadow:none;border-radius:0';A.cv.style.display='none';if(w.children[1])w.children[1].style.display='none';
 w.onpointerdown=e=>{if(sk.ptr)sk.ptr(S,e,0,A)};w.onpointermove=e=>{if(sk.ptr)sk.ptr(S,e,1,A)};w.onpointerup=w.onpointercancel=e=>{if(sk.ptr)sk.ptr(S,e,2,A)};
 DZ.fn=()=>sk.cam(S,A);DZ.fov=52;DZ.tp=DZ.fn();DZ.look=new THREE.Vector3();DZ.on=1;DZ.fn()}
function x3Hit(e,A,ly){const r=new THREE.Raycaster(),v=new THREE.Vector2(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);cam.updateMatrixWorld();r.setFromCamera(v,cam);const o=A.G.localToWorld(new THREE.Vector3(0,ly||0,0)),pl=new THREE.Plane(new THREE.Vector3(0,1,0),-o.y),p=new THREE.Vector3();return r.ray.intersectPlane(pl,p)?A.G.worldToLocal(p):null}
function x3Cam(A,pl,ll,pp,lp,fl,fp){const por=innerWidth/innerHeight<.9,p=por?pp:pl,l=por?lp:ll;DZ.look=SG.localToWorld(new THREE.Vector3(l[0],l[1]-40,l[2]));DZ.fov=por?fp:fl;return SG.localToWorld(new THREE.Vector3(p[0],p[1]-40,p[2]))}
function x3Board(w,h,draw){const f=cvT(w,h);draw(f.cv.getContext('2d'),w,h);f.tx.needsUpdate=true;return f}
const X3C=[0xff4090,0x40e0ff,0xffe040,0x60ff60,0xff8030,0xc060ff];
/* ---------------- AIR HOCKEY 3D ---------------- */
ARG[5].sk3={
 build(S,G){const X={};vB(G,2.7,.9,4.5,0x14306a,0,-.47,0);
  const f=x3Board(220,360,(g,w,h)=>{g.fillStyle='#e4f2ff';g.fillRect(0,0,w,h);g.fillStyle='#bcd6ee';for(let x=4;x<w;x+=9)for(let y=4;y<h;y+=9)g.fillRect(x,y,2,2);g.strokeStyle='#e04040';g.lineWidth=4;g.beginPath();g.moveTo(0,180);g.lineTo(w,180);g.stroke();g.beginPath();g.arc(110,180,34,0,6.3);g.stroke();g.lineWidth=3;g.strokeStyle='#4080e0';g.beginPath();g.arc(110,0,44,0,3.15);g.stroke();g.beginPath();g.arc(110,360,44,3.15,6.3);g.stroke();g.fillStyle='#e04040';g.beginPath();g.arc(110,180,4,0,6.3);g.fill()});
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(2.2,3.6).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:f.tx,fog:false}));pl.position.y=.002;G.add(pl);
  for(const sx of[-1,1])vB(G,.14,.18,3.9,0x9aa8c0,sx*1.17,.07,0);for(const sz of[-1,1]){for(const sx of[-1,1])vB(G,.76,.18,.14,0x9aa8c0,sx*.78,.07,sz*1.87);vB(G,.8,.1,.2,0x050510,0,-.02,sz*1.93);vB(G,.8,.05,.05,sz>0?0xff4040:0x40a0ff,0,.1,sz*1.98)}
  for(const sx of[-1,1])for(const sz of[-1,1])vB(G,.14,.9,.14,0x8a98b0,sx*1.2,-.45,sz*2.1);
  vB(G,2.2,.7,.12,0x20204a,0,1.6,-2.4);const sb=x3Board(256,80,()=>{});X.sb=sb;const sm=new THREE.Mesh(new THREE.PlaneGeometry(2.0,.62),new THREE.MeshBasicMaterial({map:sb.tx,fog:false}));sm.position.set(0,1.6,-2.33);G.add(sm);
  const mal=(c1,c2)=>{const g=new THREE.Group();vC(g,.2,.2,.06,c1,0,.03,0,'y');vC(g,.13,.14,.03,c2,0,.07,0,'y');vC(g,.07,.07,.14,c2,0,.15,0,'y');vS(g,.075,c2,0,.24,0);G.add(g);return g};X.mp=mal(0xd02828,0xff6060);X.ma=mal(0x2060d0,0x4090ff);
  X.pk=new THREE.Group();vC(X.pk,.1,.1,.04,0x181820,0,.02,0,'y');vC(X.pk,.06,.06,.012,0xffa030,0,.046,0,'y');G.add(X.pk);X.key='';return X},
 upd(S,dt,A){const X=A.X,m=(o,c)=>o.position.set((c[0]-120)*.01,0,(c[1]-160)*.012);m(X.mp,S.pl);m(X.ma,S.ai);m(X.pk,S.pk);
  const k=S.as+'-'+S.ps+'-'+Math.ceil(S.tl);if(k!==X.key){X.key=k;const g=X.sb.cv.getContext('2d');g.fillStyle='#0a0820';g.fillRect(0,0,256,80);g.fillStyle='#4090ff';g.font='bold 40px monospace';g.textAlign='center';g.fillText(''+S.as,50,52);g.fillStyle='#ff5050';g.fillText(''+S.ps,206,52);g.fillStyle='#ffe040';g.font='bold 22px monospace';g.fillText(Math.ceil(S.tl)+'s',128,34);g.font='10px monospace';g.fillStyle='#9ab';g.fillText('CPU          YOU',128,70);X.sb.tx.needsUpdate=true}},
 ptr(S,e,ph,A){if(ph===2){S.in.drag=0;return}const p=x3Hit(e,A,0);if(!p)return;const cx=120+p.x*100,cy=160+p.z/.012;S.in.drag=1;S.in.x=Math.max(0,Math.min(1,cx/240));S.in.y=Math.max(0,Math.min(1,cy/320))},
 cam(S,A){return x3Cam(A,[0,2.9,4.0],[0,0,-.5],[0,4.2,4.9],[0,0,-.3],54,66)}};
/* ---------------- WHACK-A-MOLE 3D ---------------- */
ARG[3].sk3={
 build(S,G){const X={mo:[]};vB(G,4.0,.9,3.8,0x6a3a1a,0,-.47,0);vB(G,3.8,.12,3.6,0x3a9a3a,0,-.04,0);vB(G,4.1,.14,.14,0x8a5a2a,0,.02,1.85);
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){const x=(c-1)*.95,z=(r-1)*.85;vC(G,.4,.4,.02,0x2a1a0a,x,.006,z,'y');vC(G,.36,.36,.03,0x05030a,x,.016,z,'y')}
  vB(G,4.1,3.0,.14,0x4a2a6a,0,1.4,-2.0);vB(G,3.2,.7,.1,0xffe040,0,2.75,-1.9);const sg=new THREE.Mesh(new THREE.PlaneGeometry(3.0,.58),new THREE.MeshBasicMaterial({map:txtTex(300,58,'#c02020','#ffe040','WHACK-A-MOLE',30),fog:false}));sg.position.set(0,2.75,-1.83);G.add(sg);for(let i=0;i<14;i++)vS(G,.07,[0xff4060,0xffe040,0x40e0ff][i%3],-1.9+i*.29,2.35,-1.85);
  for(const sx of[-1,1])vB(G,.14,3.0,.14,0x8a5a2a,sx*2.0,1.4,-1.9);
  for(let i=0;i<9;i++){const g=new THREE.Group();const b=vmM(g,new THREE.SphereGeometry(.28,14,10),0x8a5a30,0,.12,0);b.scale.y=1.25;vmM(g,new THREE.SphereGeometry(.17,12,8),0xc89060,0,.05,.18).scale.set(1,1.1,.7);vS(g,.065,0xffffff,-.1,.4,.2);vS(g,.065,0xffffff,.1,.4,.2);vS(g,.03,0x000000,-.1,.4,.26);vS(g,.03,0x000000,.1,.4,.26);vS(g,.06,0xff7090,0,.3,.27);vB(g,.05,.07,.03,0xffffff,-.03,.22,.27);vB(g,.05,.07,.03,0xffffff,.03,.22,.27);vS(g,.07,0x6a4020,-.2,.48,0);vS(g,.07,0x6a4020,.2,.48,0);g.position.set(((i%3)-1)*.95,-.9,(Math.floor(i/3)-1)*.85);G.add(g);X.mo.push(g)}
  const H=new THREE.Group();vB(H,.09,.9,.09,0x9a6a2a,0,.45,0);vB(H,.5,.3,.3,0x8a8a98,0,.95,0);vB(H,.52,.06,.32,0xff4040,0,1.1,0);H.visible=false;G.add(H);X.H=H;return X},
 upd(S,dt,A){const X=A.X;for(let i=0;i<9;i++){const m=S.m[i],g=X.mo[i];let k=0;if(m.u)k=Math.min(1,(1.2-m.t)*6+.4);else if(m.hit>0)k=.35;const ty=-.9+k*.95;g.position.y+=(ty-g.position.y)*Math.min(1,dt*18);g.scale.set(1,m.hit>0?.55:1,1)}
  if(S.hm){const hx=(S.hm[0]-120)*.0136,hz=(S.hm[1]-170)*.01214,p=1-S.hm[2]/.12;X.H.visible=true;X.H.position.set(hx,.0,hz+.2);X.H.rotation.x=-1.0+p*1.2}else X.H.visible=false},
 ptr(S,e,ph,A){if(ph!==0)return;const r=new THREE.Raycaster(),v=new THREE.Vector2(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);cam.updateMatrixWorld();r.setFromCamera(v,cam);let best=-1,bd=.16;for(let i=0;i<9;i++){if(!S.m[i].u)continue;const p=A.G.localToWorld(new THREE.Vector3(((i%3)-1)*.95,.35,(Math.floor(i/3)-1)*.85)),d=r.ray.distanceSqToPoint(p);if(d<bd){bd=d;best=i}}
  if(best>=0){S.in.tap=[50+(best%3)*70,100+Math.floor(best/3)*70];S.in.fp=1;return}const p=x3Hit(e,A,0);if(p){S.in.tap=[120+p.x/.0136,170+p.z/.01214];S.in.fp=1}},
 cam(S,A){return x3Cam(A,[0,3.4,3.8],[0,0,.1],[0,4.4,4.9],[0,0,.1],52,64)}};
/* ---------------- PINBALL 3D ---------------- */
ARG[10].sk3={
 build(S,G){const X={},T=new THREE.Group();T.position.y=.5;T.rotation.x=.3;G.add(T);X.T=T;const s=.012,P=(cx,cy)=>[(cx-120)*s,(cy-160)*s];
  vB(T,3.0,.5,4.3,0x2a1060,0,-.28,0);
  const f=x3Board(220,320,(g,w,h)=>{g.fillStyle='#07031a';g.fillRect(0,0,w,h);const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#2a1a7a');gr.addColorStop(1,'#14084a');g.fillStyle=gr;g.beginPath();g.moveTo(1,h-6);g.lineTo(1,120);g.arc(110,120,109,Math.PI,0);g.lineTo(219,h-6);g.closePath();g.fill();g.fillStyle='#fff';for(let i=0;i<60;i++){g.globalAlpha=.3;g.fillRect((i*37)%210+4,(i*53)%300,2,2)}g.globalAlpha=1;g.strokeStyle='#ff40c0';g.lineWidth=2;g.beginPath();g.arc(110,200,40,0,6.3);g.stroke();g.strokeStyle='#40e0ff';g.beginPath();g.arc(110,200,24,0,6.3);g.stroke()});
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(220*s,320*s).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:f.tx,fog:false}));pl.position.set(0,.003,0);T.add(pl);
  const seg=(x1,y1,x2,y2,c,h)=>{const a=P(x1,y1),b=P(x2,y2),dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz);const m=vB(T,L,h||.14,.05,c,(a[0]+b[0])/2,(h||.14)/2,(a[1]+b[1])/2);m.rotation.y=-Math.atan2(dz,dx)};
  for(const q of ARG[10].segs)seg(q[0],q[1],q[2],q[3],0x40e0ff);
  for(let i=0;i<28;i++){const a0=Math.PI+i*Math.PI/28,a1=Math.PI+(i+1)*Math.PI/28;seg(120+110*Math.cos(a0),120+110*Math.sin(a0),120+110*Math.cos(a1),120+110*Math.sin(a1),i%2?0xff40c0:0x40e0ff)}
  X.bu=ARG[10].bump.map((q,i)=>{const p=P(q[0],q[1]),g=new THREE.Group();vC(g,q[2]*s,q[2]*s,.16,[0xff3070,0x30c0ff,0xffd030][i],0,.08,0,'y');vC(g,q[2]*s*.6,q[2]*s*.6,.04,0xffffff,0,.18,0,'y');g.position.set(p[0],0,p[1]);T.add(g);return g});
  for(const [x,y] of [[40,190],[184,190],[60,70],[180,70]]){const p=P(x,y);vC(T,.06,.06,.13,0xc0c0d0,p[0],.065,p[1],'y')}
  X.ro=[[80,44],[120,36],[160,44]].map(([x,y])=>{const p=P(x,y),m=vC(T,.07,.07,.02,0x403010,p[0],.012,p[1],'y');return m});
  X.fl=[0,1].map(i=>{const g=new THREE.Group(),L=38*s,p=P(...(i?[154,288]:[70,288]));g.position.set(p[0],0,p[1]);vB(g,L,.09,.08,0xe8e8f0,L/2,.06,0);vS(g,.05,0xff4060,0,.07,0);T.add(g);return g});
  X.ball=new THREE.Mesh(new THREE.SphereGeometry(.075,14,10),new THREE.MeshBasicMaterial({color:0xf0f0ff,fog:false}));T.add(X.ball);X.bs=new THREE.Mesh(new THREE.CircleGeometry(.07,10).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.4,fog:false}));T.add(X.bs);
  X.pl=vB(T,.1,.12,.1,0x888898,P(222,300)[0],.06,P(222,300)[1]);
  vB(T,3.1,.2,.2,0x40e0ff,0,.08,2.2);for(const sx of[-1,1])vB(T,.16,.4,4.4,0x6a40ff,sx*1.5,.0,0);vB(T,3.1,1.8,.12,0x14084a,0,1.0,-2.15);X.gb=x3Board(256,160,()=>{});const gm=new THREE.Mesh(new THREE.PlaneGeometry(2.9,1.6),new THREE.MeshBasicMaterial({map:X.gb.tx,fog:false}));gm.position.set(0,1.0,-2.08);T.add(gm);X.key='';X.P=P;return X},
 upd(S,dt,A){const X=A.X,P=X.P;X.ball.position.set(P(S.b[0],S.b[1])[0],.075,P(S.b[0],S.b[1])[1]);X.bs.position.set(X.ball.position.x+.02,.006,X.ball.position.z+.02);
  X.bu.forEach((g,i)=>{const k=S.bf[i]>0?1.25:1;g.scale.set(k,1,k)});X.ro.forEach((m,i)=>{m.material.color.setHex(S.lit[i]?0xffe040:0x403010);m.material.needsUpdate=false});
  for(let i=0;i<2;i++)X.fl[i].rotation.y=-S.fl[i].a;X.pl.position.z=P(222,300+S.pw*8)[1];
  const k=S.sc+'-'+S.ball+'-'+S.mult;if(k!==X.key){X.key=k;const g=X.gb.cv.getContext('2d');g.fillStyle='#0a0624';g.fillRect(0,0,256,160);g.fillStyle='#ff40c0';g.font='bold 34px monospace';g.textAlign='center';g.fillText('PINBALL',128,44);g.fillStyle='#ffe040';g.font='bold 40px monospace';g.fillText(''+S.sc,128,100);g.fillStyle='#40e0ff';g.font='16px monospace';g.fillText('BALLS '+'●'.repeat(Math.max(0,S.ball))+'   x'+S.mult,128,140);X.gb.tx.needsUpdate=true}},
 ptr(S,e,ph,A){const I=S.in;if(ph===2){I.l=I.r=0;return}if(ph===0){if(e.clientX<innerWidth/2){I.l=1;I.lp=1}else{I.r=1;I.rp=1}}},
 cam(S,A){return x3Cam(A,[0,3.3,4.6],[0,.5,.4],[0,4.6,5.6],[0,.4,.3],56,64)}};
/* ---------------- CLAW GRABBER 3D ---------------- */
ARG[4]={ui:[['◀','l'],['▲','u'],['▼','d'],['▶','r'],['DROP','f']],div:1,
 inCh(p){return p.x<-.95&&p.z>.5},
 init(S){S.go=5;S.tix=0;S.ph=0;S.cx=0;S.cz=0;S.cy=2.3;S.open=1;S.hold=null;S.tl=20;S.mt='';S.mtT=0;S.pt=0;S.pz=[];const T=[{r:.27,v:10,gr:.92,ty:0},{r:.36,v:20,gr:.7,ty:1},{r:.48,v:40,gr:.45,ty:1},{r:.3,v:25,gr:.6,ty:2}],seq=[0,0,0,1,1,1,3,3,2,0,1,3,0,1,2,0,0,1,3,1,0,3,1,0];
  for(let i=0;i<seq.length;i++){const t=T[seq[i]];let x=(Math.random()-.5)*2.2,z=(Math.random()-.5)*1.8;if(x<-.9&&z>.45)x=.2;S.pz.push({x,y:.5+Math.random()*2+i*.15,z,vx:0,vy:0,vz:0,r:t.r,v:t.v,gr:t.gr,ty:t.ty,ci:i%6,g:0,rot:Math.random()*6})}
  for(let k=0;k<420;k++)this.phys(S,1/60);for(const p of S.pz)p.vx=p.vy=p.vz=0},
 phys(S,dt){const P=S.pz;for(const p of P){if(p.g)continue;p.vy-=9.8*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;const ch=this.inCh(p);const lx=-1.5+p.r,hx=1.5-p.r,lz=-1.2+p.r,hz=1.2-p.r;if(p.x<lx){p.x=lx;p.vx*=-.2}if(p.x>hx){p.x=hx;p.vx*=-.2}if(p.z<lz){p.z=lz;p.vz*=-.2}if(p.z>hz){p.z=hz;p.vz*=-.2}if(!ch&&p.y<p.r){p.y=p.r;if(p.vy<0)p.vy=0;const f=Math.exp(-4*dt);p.vx*=f;p.vz*=f}const dm=Math.exp(-.6*dt);p.vx*=dm;p.vz*=dm}
  for(let it=0;it<2;it++)for(let i=0;i<P.length;i++){const a=P[i];if(a.g)continue;for(let j=i+1;j<P.length;j++){const b=P[j];if(b.g)continue;const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,m=(a.r+b.r)*.96,d2=dx*dx+dy*dy+dz*dz;if(d2>=m*m)continue;const d=Math.sqrt(d2)||.0001,nx=dx/d,ny=dy/d,nz=dz/d,ov=m-d,ma=a.r*a.r*a.r,mb=b.r*b.r*b.r,wa=mb/(ma+mb),wb=ma/(ma+mb);a.x-=nx*ov*wa;a.y-=ny*ov*wa;a.z-=nz*ov*wa;b.x+=nx*ov*wb;b.y+=ny*ov*wb;b.z+=nz*ov*wb;const vn=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny+(b.vz-a.vz)*nz;if(vn<0){const k=vn*.7;a.vx+=nx*k*wa;a.vy+=ny*k*wa;a.vz+=nz*k*wa;b.vx-=nx*k*wb;b.vy-=ny*k*wb;b.vz-=nz*k*wb}}}},
 top(S,x,z,rr){let t=.06;for(const p of S.pz)if(!p.g&&Math.hypot(p.x-x,p.z-z)<p.r+rr)t=Math.max(t,p.y+p.r);return t},
 step(S,dt){const I=S.in;S.mtT-=dt;this.phys(S,dt);
  if(S.ph===0){S.tl-=dt;if(I.drag&&I.tx!=null){S.cx+=(I.tx-S.cx)*Math.min(1,dt*8);S.cz+=(I.tz-S.cz)*Math.min(1,dt*8)}else{S.cx+=(I.r-I.l)*1.15*dt;S.cz+=((I.d||0)-(I.u||0))*1.15*dt}S.cx=Math.max(-1.3,Math.min(1.3,S.cx));S.cz=Math.max(-1.0,Math.min(1.0,S.cz));if((I.fp&&!I.drag)||S.tl<=0){S.ph=1;S.open=1;beep(500,.06,'square',.05)}}
  else if(S.ph===1){S.cy-=1.5*dt;const t=this.top(S,S.cx,S.cz,.2);if(S.cy-.5<=t+.03){S.cy=t+.53;S.ph=2;S.pt=.55}}
  else if(S.ph===2){S.pt-=dt;S.open=Math.max(0,S.pt/.55);if(S.pt<=0){let b=null,bd=9;for(const p of S.pz){if(p.g)continue;const d=Math.hypot(p.x-S.cx,p.z-S.cz);if(d<p.r*.8+.2&&p.y+p.r>S.cy-.85&&(!b||p.y>b.y)){b=p;bd=d}}if(b&&Math.random()<b.gr*(1-bd/(b.r+.25)*.5)){S.hold=b;b.g=1;S.mt='GOT ONE!';beep(900,.06,'square',.05)}else{S.mt='MISSED!';beep(160,.2,'sawtooth',.06)}S.mtT=1;S.ph=3}}
  else if(S.ph===3){S.cy=Math.min(2.3,S.cy+1.3*dt);this.follow(S,dt,1);if(S.cy>=2.3)S.ph=4}
  else if(S.ph===4){const tx=-1.25,tz=.9,dx=tx-S.cx,dz=tz-S.cz,d=Math.hypot(dx,dz),st=Math.min(d,1.25*dt);if(d>.001){S.cx+=dx/d*st;S.cz+=dz/d*st}this.follow(S,dt,.9);if(d<.02){S.ph=5;S.pt=1.5;S.open=1;if(S.hold){S.hold.g=0;S.hold.vx=S.hold.vy=S.hold.vz=0;S.hold=null}}}
  else if(S.ph===5){S.pt-=dt;if(S.pt<=0)this.next(S)}
  for(let i=S.pz.length-1;i>=0;i--){const p=S.pz[i];if(!p.g&&this.inCh(p)&&p.y<-.9){S.tix+=p.v;S.sc=S.tix;S.mt='+'+p.v+' TICKETS!';S.mtT=1.4;beep(1000,.1,'square',.06);setTimeout(()=>beep(1400,.15,'square',.06),90);if(p.m&&p.m.parent)p.m.parent.remove(p.m);S.pz.splice(i,1);if(p.v>=40){S.go++;S.mt='JACKPOT! +1 GO'}this.refill(S)}}},
 follow(S,dt,k){const p=S.hold;if(!p)return;p.x=S.cx;p.z=S.cz;p.y=S.cy-.5-p.r*.55;if(Math.random()<dt*(1-p.gr)*1.2*k){p.g=0;p.vx=p.vy=p.vz=0;S.hold=null;S.mt='IT SLIPPED!';S.mtT=1;beep(220,.2,'sawtooth',.06)}},
 refill(S){const T=[[.27,10,.92,0],[.36,20,.7,1],[.3,25,.62,2],[.27,10,.92,0]][Math.floor(Math.random()*4)];S.pz.push({x:-.6+Math.random()*1.5,y:2.1,z:(Math.random()-.5)*1.6,vx:0,vy:0,vz:0,r:T[0],v:T[1],gr:T[2],ty:T[3],ci:Math.floor(Math.random()*6),g:0,rot:Math.random()*6})},
 next(S){S.go--;if(S.go<=0){S.over=1;return}S.ph=0;S.cx=0;S.cz=0;S.cy=2.3;S.tl=20;S.open=1},
 tk(S){return S.tix},
 sk3:{
  mesh(p){const g=new THREE.Group(),c=X3C[p.ci],r=p.r;if(p.ty===0){vS(g,r,c,0,0,0);vS(g,r*.22,0xffffff,-r*.35,r*.4,r*.75);vB(g,r*.2,r*.2,r*.2,0x000000,-r*.3,r*.1,r*.9);vB(g,r*.2,r*.2,r*.2,0x000000,r*.3,r*.1,r*.9)}
   else if(p.ty===1){vS(g,r*.78,c,0,-r*.12,0);vS(g,r*.55,c,0,r*.62,0);vS(g,r*.22,c,-r*.42,r*1.05,0);vS(g,r*.22,c,r*.42,r*1.05,0);vS(g,r*.26,0xf0d0b0,0,r*.52,r*.45);vS(g,r*.08,0x000000,-r*.18,r*.78,r*.48);vS(g,r*.08,0x000000,r*.18,r*.78,r*.48);vS(g,r*.08,0x300000,0,r*.55,r*.68);vS(g,r*.2,c,-r*.55,-r*.1,r*.2);vS(g,r*.2,c,r*.55,-r*.1,r*.2)}
   else{vB(g,r*1.5,r*1.5,r*1.5,c,0,0,0);vB(g,r*1.55,r*.28,r*1.55,0xffe040,0,0,0);vB(g,r*.28,r*1.55,r*1.55,0xffe040,0,0,0);vS(g,r*.28,0xffe040,0,r*.85,0)}return g},
  build(S,G,A){const X={pm:[]},gl=()=>new THREE.MeshBasicMaterial({color:0x80d0ff,transparent:true,opacity:.14,fog:false,depthWrite:false});
   vB(G,3.4,1.0,2.0,0x6a1a8a,0,-.5,-.45);vB(G,2.7,1.0,.9,0x6a1a8a,.35,-.5,1.0);vB(G,3.4,.3,2.9,0x4a1260,0,-1.15,0);vB(G,.76,.04,.9,0x201030,-1.3,-.9,1.0);vB(G,.7,.5,.04,0xffe040,-1.3,-.5,1.47);vB(G,.7,.14,.04,0xff4060,-1.3,-.2,1.47);
   for(const [x,z] of [[-1.55,-1.25],[1.55,-1.25],[-1.55,1.25],[1.55,1.25]])vB(G,.1,2.6,.1,0xb8b8c8,x,1.3,z);
   const wa=new THREE.Mesh(new THREE.BoxGeometry(3.1,2.6,.02),gl());wa.position.set(0,1.3,-1.25);G.add(wa);const wf=wa.clone();wf.position.z=1.25;G.add(wf);const wl=new THREE.Mesh(new THREE.BoxGeometry(.02,2.6,2.5),gl());wl.position.set(-1.55,1.3,0);G.add(wl);const wr=wl.clone();wr.position.x=1.55;G.add(wr);
   vB(G,3.4,.4,2.9,0xc040a0,0,2.8,0);vB(G,3.4,.1,.1,0x20e0ff,0,2.55,1.45);const mq=new THREE.Mesh(new THREE.PlaneGeometry(2.4,.34),new THREE.MeshBasicMaterial({map:txtTex(256,36,'#c040a0','#fff','CLAW GRABBER',20),fog:false}));mq.position.set(0,2.8,1.46);G.add(mq);
   vB(G,3.2,.08,.08,0x888898,0,2.62,-1.2);vB(G,3.2,.08,.08,0x888898,0,2.62,1.2);
   X.br=vB(G,.1,.1,2.5,0x9a9aa8,0,2.6,0);X.ca=vB(G,.3,.14,.3,0xc0c0d0,0,2.55,0);X.cb=vB(G,.03,1,.03,0xe0e0e8,0,2,0);X.hub=vB(G,.26,.18,.26,0xd0d0e0,0,2,0);
   X.pr=[0,1,2].map(i=>{const g=new THREE.Group();vB(g,.07,.42,.09,0xe8e8f0,0,-.21,0);vB(g,.07,.2,.09,0xe8e8f0,0,-.46,.0,0,0,0);g.userData.ang=i*2.094;G.add(g);return g});
   for(const p of S.pz){p.m=this.mesh(p);G.add(p.m);X.pm.push(p.m)}X.key=0;return X},
  reset(S,A){const X=A.X;for(const m of X.pm)if(m.parent)m.parent.remove(m);X.pm.length=0;for(const p of S.pz){p.m=this.mesh(p);A.G.add(p.m);X.pm.push(p.m)}},
  upd(S,dt,A){const X=A.X;for(const p of S.pz){if(!p.m){p.m=this.mesh(p);A.G.add(p.m);X.pm.push(p.m)}p.m.position.set(p.x,p.y,p.z);p.m.rotation.y=p.rot}
   X.br.position.x=S.cx;X.ca.position.set(S.cx,2.55,S.cz);const ch=2.55-S.cy;X.cb.scale.y=Math.max(.01,ch);X.cb.position.set(S.cx,S.cy+ch/2,S.cz);X.hub.position.set(S.cx,S.cy,S.cz);
   const sp=.12+S.open*.2;for(const g of X.pr){g.position.set(S.cx+Math.cos(g.userData.ang)*sp,S.cy-.08,S.cz+Math.sin(g.userData.ang)*sp);g.rotation.set(0,-g.userData.ang+Math.PI/2,0);g.children[0].rotation.z=0;g.rotation.z=0;g.rotation.x=0;const t=(1-S.open)*.5-.1+S.open*.45;g.rotateX(-t*.0);g.children[0].position.x=0}
   A.mtM=S.mtT>0?S.mt:''},
  ptr(S,e,ph,A){const I=S.in;if(ph===2){I.drag=0;return}if(S.ph!==0)return;I.drag=1;I.tx=Math.max(-1.3,Math.min(1.3,(e.clientX/innerWidth-.5)*3.0));I.tz=Math.max(-1.0,Math.min(1.0,(e.clientY/innerHeight-.55)*3.2))},
  cam(S,A){return x3Cam(A,[0,2.8,5.8],[0,1.1,0],[0,3.9,8.0],[0,1.15,0],52,60)}}};
