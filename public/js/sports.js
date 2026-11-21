/* ===== SUNHAVEN SPORTS PARK (east of the runway): TENNIS, BASKETBALL, ARCHERY, 100M SPRINT, CRICKET, CLIMBING WALL.
   Every sport has bronze / silver / gold medals with prize money the first time, records, and a SPORTS app on the phone. ===== */
(function(){
const RS=window.RESORT,R2=window.RESORT2,TAU=Math.PI*2,Y=G0;
const SP={best:{},medal:{}};{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.sp=SP;return o};cozyLoad=function(z){l0(z);if(z&&z.sp)for(const k in z.sp)SP[k]=z.sp[k]}}
const MED=['','🥉 BRONZE','🥈 SILVER','🥇 GOLD'],PRZ=[0,20,40,80];
/* score → medal; lower=better for timed events */
const DEF={tennis:{n:'TENNIS',ic:'🎾',m:[1,3,5],u:'POINTS WON',hi:1},bball:{n:'BASKETBALL',ic:'🏀',m:[8,14,20],u:'POINTS',hi:1},archery:{n:'ARCHERY',ic:'🏹',m:[30,42,52],u:'POINTS',hi:1},sprint:{n:'100M SPRINT',ic:'🏃',m:[14,12,10.5],u:'SECONDS',hi:0},cricket:{n:'CRICKET',ic:'🏏',m:[8,16,26],u:'RUNS',hi:1},climb:{n:'CLIMBING WALL',ic:'🧗',m:[10,20,30],u:'METRES',hi:1}};
function award(k,score){const d=DEF[k],m=d.hi?(score>=d.m[2]?3:score>=d.m[1]?2:score>=d.m[0]?1:0):(score<=d.m[2]?3:score<=d.m[1]?2:score<=d.m[0]?1:0);const b=SP.best[k];if(b==null||(d.hi?score>b:score<b))SP.best[k]=score;let msg=m?MED[m]+'!':'NO MEDAL THIS TIME.';const old=SP.medal[k]|0;if(m>old){let p=0;for(let i=old+1;i<=m;i++)p+=PRZ[i];SP.medal[k]=m;cash+=p;msg+=' NEW MEDAL: +£'+p;R2.cheer()}if(Object.values(SP.medal).filter(x=>x===3).length===6&&!SP.champ){SP.champ=1;cash+=500;msg+=' · 🏆 ALL SIX GOLDS! SPORTS CHAMPION +£500'}return msg}
const MG=R2.MG,txt=(g,t,x,y,s,c,a)=>{g.fillStyle=c||'#fff';g.font='bold '+(s||16)+'px monospace';g.textAlign=a||'center';g.fillText(t,x,y)};
/* ---------------- TENNIS: first to 5 games… well, points. Drag or ◀ ▶ to move. */
function tennis(){const st={px:240,ax:240,b:{x:240,y:470,vx:0,vy:0},sv:1,me:0,ai:0,dir:0,rally:0,wait:1.2};
 const serve=who=>{st.b={x:who?st.px:st.ax,y:who?520:120,vx:(Math.random()-.5)*200,vy:who?-380:380};st.wait=.9;st.rally=0};serve(1);
 MG('🎾 TENNIS · FIRST TO 5',{init(S){S.info('MOVE WITH ◀ ▶ OR DRAG. THE BALL BOUNCES OFF YOUR RACKET: HIT IT WITH THE EDGE TO ANGLE IT!');S.btns([['◀',()=>st.dir=-1,()=>st.dir=0],['▶',()=>st.dir=1,()=>st.dir=0]])},move(S,x){st.px=Math.max(60,Math.min(420,x))},key(S,k,d){if(k==='ArrowLeft')st.dir=d?-1:0;if(k==='ArrowRight')st.dir=d?1:0},
  step(S,dt){st.px=Math.max(60,Math.min(420,st.px+st.dir*360*dt));if(st.wait>0){st.wait-=dt;return}const b=st.b;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<52||b.x>428){b.vx*=-1;b.x=Math.max(52,Math.min(428,b.x))}
   const aiS=260+st.ai*0+st.rally*6;st.ax+=Math.max(-aiS*dt,Math.min(aiS*dt,(b.vy<0?b.x:240)-st.ax));
   if(b.vy>0&&b.y>540&&b.y<560&&Math.abs(b.x-st.px)<46){b.vy=-Math.min(720,Math.abs(b.vy)*1.06+10);b.vx=(b.x-st.px)*8;st.rally++;beep(520,.04,'square',.04)}
   if(b.vy<0&&b.y<100&&b.y>80&&Math.abs(b.x-st.ax)<42){b.vy=Math.min(720,Math.abs(b.vy)*1.05+8);b.vx=(Math.random()-.5)*420+(b.x-st.ax)*4;st.rally++;beep(420,.04,'square',.04)}
   if(b.y>640){st.ai++;beep(150,.2,'sawtooth',.04);serve(1)}if(b.y<0){st.me++;beep(880,.1,'square',.05);serve(0)}if(st.me>=5||st.ai>=5)S.end((st.me>=5?'YOU WIN '+st.me+'-'+st.ai+'! ':'YOU LOSE '+st.me+'-'+st.ai+'. ')+award('tennis',st.me))},
  draw(S,g){g.fillStyle='#2a7a4a';g.fillRect(0,0,480,640);g.fillStyle='#3a6ac0';g.fillRect(40,30,400,580);g.strokeStyle='#fff';g.lineWidth=3;g.strokeRect(40,30,400,580);g.beginPath();g.moveTo(40,320);g.lineTo(440,320);g.stroke();g.beginPath();g.moveTo(240,170);g.lineTo(240,470);g.stroke();g.strokeRect(40,170,400,300);
   g.fillStyle='#ddd';g.fillRect(40,316,400,8);g.fillStyle='#ffe040';g.beginPath();g.arc(st.b.x,st.b.y,8,0,TAU);g.fill();g.fillStyle='#ff5050';g.fillRect(st.px-42,546,84,12);g.fillStyle='#ffe9a8';g.fillRect(st.ax-38,84,76,12);txt(g,'YOU '+st.me+'  ·  '+st.ai+' CPU',240,22,16)}})}
/* ---------------- BASKETBALL: 10 shots from 3 spots; stop the meter in the green */
function bball(){const st={shot:0,pts:0,ph:'aim',m:0,b:null,spot:0,msg:''};const SPOTS=[[90,520,2],[160,540,2],[60,480,3]];const HOOP={x:400,y:250};
 MG('🏀 BASKETBALL · 10 SHOTS',{init(S){S.info('TAP TO SHOOT WHEN THE POWER BAR HITS THE GREEN. 3-POINTERS FROM THE FAR SPOT!')},
  down(S){if(st.ph!=='aim')return;const sp=SPOTS[st.spot],ideal=.62+st.spot*.06,err=st.m-ideal;const dx=HOOP.x-sp[0],dy=HOOP.y-sp[1],T=1.05,vx=dx/T*(1+err*.9),vy=(dy-.5*900*T*T)/T*(1+err*.6);st.b={x:sp[0],y:sp[1],vx,vy,ok:Math.abs(err)<.06,rim:Math.abs(err)<.11};st.ph='fly';beep(300,.05,'square',.04)},
  step(S,dt){if(st.ph==='aim'){st.m=Math.sin(S.t*2.4)*.5+.5;return}const b=st.b;b.vy+=900*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;
   if(!b.done&&b.vy>0&&Math.abs(b.y-HOOP.y)<10&&b.x>HOOP.x-34&&b.x<HOOP.x+30){b.done=1;if(b.ok||(b.rim&&Math.random()<.45)){const p=SPOTS[st.spot][2];st.pts+=p;st.msg=p===3?'SWISH! THREE POINTS!':'SCORE!';b.vx*=.1;beep(988,.1,'square',.05)}else{st.msg=b.rim?'OFF THE RIM!':'MISS!';b.vx*=-.4;beep(200,.08,'square',.04)}}
   if(b.y>660||b.x>500||b.x<-20){st.shot++;st.ph='aim';st.spot=(st.spot+1)%3;if(st.shot>=10)S.end('YOU SCORED '+st.pts+' POINTS. '+award('bball',st.pts))}},
  draw(S,g){g.fillStyle='#c87a3a';g.fillRect(0,0,480,640);g.fillStyle='#d88a4a';for(let x=0;x<480;x+=40)g.fillRect(x,560,20,80);g.fillStyle='#223';g.fillRect(0,0,480,200);g.fillStyle='#fff';g.fillRect(440,150,10,450);g.fillRect(424,180,24,110);g.strokeStyle='#e83a2a';g.lineWidth=4;g.beginPath();g.moveTo(HOOP.x-34,HOOP.y);g.lineTo(HOOP.x+30,HOOP.y);g.stroke();g.strokeStyle='#eee';g.lineWidth=1;for(let k=0;k<6;k++){g.beginPath();g.moveTo(HOOP.x-32+k*12,HOOP.y);g.lineTo(HOOP.x-26+k*9,HOOP.y+30);g.stroke()}
   const sp=SPOTS[st.spot];g.fillStyle='rgba(255,255,255,.4)';g.beginPath();g.arc(sp[0],sp[1]+30,16,0,TAU);g.fill();const b=st.ph==='fly'?st.b:{x:sp[0],y:sp[1]};g.fillStyle='#f08a20';g.beginPath();g.arc(b.x,b.y,13,0,TAU);g.fill();g.strokeStyle='#5a2a0a';g.lineWidth=2;g.beginPath();g.moveTo(b.x-13,b.y);g.lineTo(b.x+13,b.y);g.stroke();
   if(st.ph==='aim'){g.fillStyle='#222';g.fillRect(30,600,300,18);const id=.62+st.spot*.06;g.fillStyle='#2a8a3a';g.fillRect(30+300*(id-.06),600,300*.12,18);g.fillStyle='#fff';g.fillRect(30+300*st.m-3,596,6,26)}txt(g,'SHOT '+Math.min(10,st.shot+1)+'/10 · POINTS '+st.pts+(st.spot===2?' · 3PT SPOT':''),240,30,16);txt(g,st.msg,240,60,20,'#ffe060')}})}
/* ---------------- ARCHERY: 6 arrows, the sight sways in the wind */
function archery(){const st={n:6,pts:0,hits:[],wind:(Math.random()-.5)*2,cx:240,cy:300};
 MG('🏹 ARCHERY · 6 ARROWS',{init(S){S.info('THE SIGHT SWAYS (WATCH THE WIND!). TAP TO LOOSE AN ARROW.')},
  down(S){if(!st.n||S.done)return;const x=st.cx+st.wind*18,y=st.cy,d=Math.hypot(x-240,y-300),sc=Math.max(0,10-Math.floor(d/14));st.hits.push([x,y,sc]);st.pts+=sc;st.n--;beep(sc>=9?1200:500,.06,'square',.04);if(!st.n)setTimeout(()=>S.end('YOU SCORED '+st.pts+'/60. '+award('archery',st.pts)),600)},
  step(S,dt){const t=S.t;st.cx=240+Math.sin(t*1.3)*48+Math.sin(t*3.1)*16+st.wind*10;st.cy=300+Math.cos(t*1.7)*40+Math.sin(t*2.6)*12},
  draw(S,g){g.fillStyle='#8ad0f0';g.fillRect(0,0,480,640);g.fillStyle='#4a9a4a';g.fillRect(0,470,480,170);const C=['#fff','#fff','#222','#222','#3a8ad8','#3a8ad8','#e83a3a','#e83a3a','#ffd24a','#ffd24a'];for(let i=0;i<10;i++){g.fillStyle=C[i];g.beginPath();g.arc(240,300,140-i*14,0,TAU);g.fill()}
   for(const[x,y]of st.hits){g.fillStyle='#5a3a1a';g.beginPath();g.arc(x,y,5,0,TAU);g.fill()}g.strokeStyle='#000';g.lineWidth=2;g.beginPath();g.arc(st.cx,st.cy,16,0,TAU);g.moveTo(st.cx-26,st.cy);g.lineTo(st.cx+26,st.cy);g.moveTo(st.cx,st.cy-26);g.lineTo(st.cx,st.cy+26);g.stroke();
   txt(g,'ARROWS '+st.n+' · SCORE '+st.pts+' · WIND '+(st.wind>0?'→':'←')+' '+Math.abs(st.wind*10).toFixed(0)+' MPH',240,30,15,'#123')}})}
/* ---------------- 100M SPRINT: tap ◀ ▶ alternately as fast as you can */
function sprint(){const st={go:-3,x:0,v:0,last:0,t:0,ai:[0,0,0],av:[9.2+Math.random()*.6,8.6+Math.random()*.6,9.8+Math.random()*.4],fin:0};
 const tap=s=>{if(st.go<0){st.v=0;return}if(s!==st.last){st.v=Math.min(10.8,st.v+.85);st.last=s}else st.v*=.85};
 MG('🏃 100M SPRINT',{init(S){S.info('TAP ◀ ▶ ◀ ▶ ALTERNATELY AS FAST AS YOU CAN! (ARROW KEYS TOO)');S.btns([['◀ LEFT',()=>tap(-1)],['RIGHT ▶',()=>tap(1)]])},key(S,k,d){if(!d)return;if(k==='ArrowLeft')tap(-1);if(k==='ArrowRight')tap(1)},
  step(S,dt){const c=Math.ceil(-st.go);st.go+=dt;if(st.go<0){if(c!==st._c){st._c=c;beep(440,.15,'square',.05)}return}if(!st._g){st._g=1;beep(880,.3,'square',.06)}if(!st.fin)st.t+=dt;st.v*=Math.exp(-.9*dt);st.x+=st.v*dt;st.ai=st.ai.map((x,i)=>Math.min(100,x+Math.min(st.av[i],st.go*4)*dt));
   if(st.x>=100&&!st.fin){st.fin=1;const pl=1+st.ai.filter(x=>x>=100).length,tm=+st.t.toFixed(2);S.end('YOU FINISHED '+['1ST','2ND','3RD','4TH'][pl-1]+' IN '+tm+'s. '+award('sprint',tm))}if(st.t>30&&!st.fin){st.fin=1;S.end('TOO SLOW! TRY AGAIN.')}},
  draw(S,g){g.fillStyle='#4a9a4a';g.fillRect(0,0,480,640);for(let i=0;i<4;i++){g.fillStyle=i%2?'#c84a3a':'#d85a4a';g.fillRect(0,180+i*90,480,90);g.fillStyle='#fff';g.fillRect(0,180+i*90,480,2)}const X=d=>30+d*4.2;g.fillStyle='#fff';g.fillRect(X(100),180,6,360);
   const R=(d,i,c,t)=>{const x=X(Math.min(100,d)),y=225+i*90,s=Math.sin(S.t*18+i)*8;g.fillStyle=c;g.fillRect(x-8,y-30,16,30);g.beginPath();g.arc(x,y-38,9,0,TAU);g.fill();g.fillRect(x-6+s,y,5,18);g.fillRect(x+1-s,y,5,18);txt(g,t,x,y+38,11)};st.ai.forEach((d,i)=>R(d,i+1,['#3a6ad8','#e8c030','#8a3ad8'][i],['BOLT-ISH','FLO','ZOOM'][i]));R(st.x,0,'#ff4040','YOU');
   txt(g,st.go<0?'ON YOUR MARKS… '+Math.ceil(-st.go):st.t.toFixed(2)+'s',240,80,28,'#ffe060');txt(g,'SPEED '+'█'.repeat(Math.round(st.v))+'░'.repeat(Math.max(0,11-Math.round(st.v))),240,130,14)}})}
/* ---------------- CRICKET: 12 balls, 3 wickets, tap SWING as the ball reaches the bat */
function cricket(){const st={balls:12,wk:3,runs:0,b:null,wait:1.2,msg:'',sw:0};
 const bowl=()=>{st.b={y:80,v:380+Math.random()*180,x:240+(Math.random()-.5)*30,hit:0,swing:Math.random()<.4?(Math.random()-.5)*60:0}};
 MG('🏏 CRICKET NETS · 12 BALLS',{init(S){S.info('TAP SWING WHEN THE BALL REACHES THE BAT. PERFECT TIMING = SIX!');S.btns([['🏏 SWING!',()=>swing(S)]])},down(S){swing(S)},key(S,k,d){if(d&&k===' ')swing(S)},
  step(S,dt){st.sw=Math.max(0,st.sw-dt);if(!st.b){st.wait-=dt;if(st.wait<=0&&st.balls>0&&st.wk>0)bowl();return}const b=st.b;if(b.hit){b.y+=b.vy*dt;b.x+=b.vx*dt;if(b.y<-30||b.x<-30||b.x>510)next(S);return}b.y+=b.v*dt;b.x+=b.swing*dt*(b.y/560);if(b.y>590){st.wk--;st.msg='BOWLED! 💥';beep(100,.3,'sawtooth',.05);next(S)}},
  draw(S,g){g.fillStyle='#2a7a3a';g.fillRect(0,0,480,640);g.fillStyle='#c8b080';g.fillRect(180,40,120,580);g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=1;for(let x=0;x<480;x+=16){g.beginPath();g.moveTo(x,0);g.lineTo(x,640);g.stroke()}g.fillStyle='#e8d8a0';for(const x of[226,240,254])g.fillRect(x-2,590,4,34);g.fillStyle='#fff';g.fillRect(222,40,36,40);
   const bx=st.sw>0?240+(.3-st.sw)*160:210;g.fillStyle='#d8b070';g.save();g.translate(240,560);g.rotate(st.sw>0?-1.2+(.3-st.sw)*7:-.4);g.fillRect(-6,-70,12,70);g.restore();if(st.b){g.fillStyle='#c01a1a';g.beginPath();g.arc(st.b.x,st.b.y,9,0,TAU);g.fill()}
   txt(g,'RUNS '+st.runs+' · WICKETS '+st.wk+' · BALLS '+st.balls,240,24,16);txt(g,st.msg,240,320,30,'#ffe060')}});
 function swing(S){if(st.sw>0||S.done)return;st.sw=.3;beep(260,.04,'square',.03);const b=st.b;if(!b||b.hit)return;const d=560-b.y;if(Math.abs(d)<70){const q=Math.abs(d+5);const r=q<12?6:q<25?4:q<40?2:q<55?1:0;b.hit=1;b.vy=-500-r*60;b.vx=(Math.random()-.5)*500;st.runs+=r;st.msg=r===6?'SIX!! 🎉':r===4?'FOUR!':r?r+' RUN'+(r>1?'S':''):'DOT BALL';beep(r>=4?1100:600,.1,'square',.05);if(r===6)R2.cheer()}}
 function next(S){st.b=null;st.balls--;st.wait=1.1;if(st.balls<=0||st.wk<=0)S.end(st.runs+' RUNS ('+(3-st.wk)+' OUT). '+award('cricket',st.runs))}}
/* ---------------- CLIMBING WALL: tap the side the next hold is on, faster and faster */
function climb(){const st={h:0,next:Math.random()<.5?-1:1,t:2,T:2,fall:0,hold:[]};for(let i=0;i<40;i++)st.hold.push(Math.random()<.5?-1:1);st.next=st.hold[0];
 const grab=(S,s)=>{if(S.done||st.fall)return;if(s===st.hold[st.h]){st.h++;st.T=Math.max(.45,2-st.h*.05);st.t=st.T;beep(500+st.h*20,.05,'square',.04);if(st.h>=40)S.end('YOU RANG THE BELL AT THE TOP! 40M. '+award('climb',40))}else fall(S)};
 const fall=S=>{st.fall=1;beep(200,.5,'sawtooth',.05);setTimeout(()=>S.end('YOU SLIPPED AT '+st.h+'M! THE ROPE CAUGHT YOU. '+award('climb',st.h)),800)};
 MG('🧗 CLIMBING WALL · 40M',{init(S){S.info('TAP THE SIDE OF THE NEXT GLOWING HOLD BEFORE YOUR ARMS GET TIRED!');S.btns([['◀ LEFT',()=>grab(S,-1)],['RIGHT ▶',()=>grab(S,1)]])},key(S,k,d){if(!d)return;if(k==='ArrowLeft')grab(S,-1);if(k==='ArrowRight')grab(S,1)},
  step(S,dt){if(st.fall||S.done)return;st.t-=dt;if(st.t<=0)fall(S)},
  draw(S,g){g.fillStyle='#8a7a6a';g.fillRect(0,0,480,640);const off=st.h*60;for(let i=0;i<40;i++){const y=520-i*60+off;if(y<-30||y>660)continue;const x=240+st.hold[i]*90;g.fillStyle=i===st.h?'#ffe040':['#e83a5a','#3a8ad8','#3ad870','#d83ad8'][i%4];g.beginPath();g.arc(x,y,i===st.h?20:14,0,TAU);g.fill()}
   const py=540+(st.fall?Math.min(200,(S.t*100)%300):0);g.fillStyle='#ff6040';g.fillRect(226,py-40,28,40);g.fillStyle='#e8c8a0';g.beginPath();g.arc(240,py-50,12,0,TAU);g.fill();g.strokeStyle='#ff6040';g.lineWidth=6;g.beginPath();g.moveTo(230,py-36);g.lineTo(240+st.hold[Math.max(0,st.h-1)]*80,py-70);g.stroke();
   g.fillStyle='#222';g.fillRect(40,20,400,14);g.fillStyle=st.t/st.T>.35?'#3ad870':'#e83a3a';g.fillRect(40,20,400*Math.max(0,st.t/st.T),14);txt(g,'HEIGHT '+st.h+'M · GRIP',240,56,16)}})}
const GAMES={tennis,bball,archery,sprint,cricket,climb};
/* ================================================================== the park itself */
const PARK={u0:45,u1:160,v0:-600,v1:-250};let built=0;const STN=[];
function build(){if(built||!RS.built)return;built=1;const B=new Builder(3),W=RS.W,f=(u0,v0,u1,v1,c,y)=>quadXZ(B,W(u0,v0),W(u1,v0),W(u1,v1),W(u0,v1),c,Y+(y||.03)),bx=(u,y,v,w,h,d,c,r)=>{const p=W(u,v);pbox(B,p[0],y,p[1],w,h,d,c,r||0)},cy=(u,y,v,r,h,c)=>{const p=W(u,v);pcyl(B,p[0],y,p[1],r,h,8,c)};
 f(PARK.u0,PARK.v0,PARK.u1,PARK.v1,[.4,.62,.32],.02);
 /* tennis */{const u=60,v=-590;f(u,v,u+40,v+24,[.25,.45,.75],.04);f(u+19.8,v,u+20.2,v+24,[.95,.95,.95],.05);for(const s of[0,24])f(u,v+s-.15,u+40,v+s+.15,[.95,.95,.95],.05);bx(u+20,Y,v+12,.15,1,24,[.9,.9,.9]);STN.push({k:'tennis',u:u+20,v:v+26})}
 /* basketball */{const u=110,v=-590;f(u,v,u+40,v+24,[.85,.5,.25],.04);for(const s of[1,39]){bx(u+s,Y,v+12,.25,3.3,.25,[.3,.3,.32]);bx(u+s+(s<20?.5:-.5),Y+3.3,v+12,.12,1,1.8,[.95,.95,.95])}f(u+19.8,v,u+20.2,v+24,[.95,.95,.95],.05);STN.push({k:'bball',u:u+20,v:v+26})}
 /* archery */{const u=60,v=-545;f(u,v,u+90,v+20,[.45,.7,.35],.04);for(let k=0;k<5;k++){const tu=u+8+k*18;cy(tu,Y,v+18,.08,1.4,[.5,.35,.2]);const p=W(tu,v+18.5);for(let i=0;i<5;i++)pcyl(B,p[0],Y+1.8,p[1]-.02*i,1.2-i*.24,.05+i*.01,16,[[.95,.95,.95],[.15,.15,.15],[.2,.5,.9],[.9,.2,.2],[.98,.85,.2]][i])}STN.push({k:'archery',u:u+45,v:v-1})}
 /* sprint track */{const u=55,v=-505;f(u,v,u+100,v+14,[.78,.32,.26],.04);for(let k=0;k<=4;k++)f(u,v+k*3.5-.08,u+100,v+k*3.5+.08,[.95,.95,.95],.05);f(u+96,v,u+97,v+14,[.95,.95,.95],.055);STN.push({k:'sprint',u:u+2,v:v+16})}
 /* cricket nets */{const u=60,v=-470;f(u,v,u+6,v+30,[.75,.68,.5],.04);for(const s of[0,6])for(let k=0;k<=30;k+=5)bx(u+s,Y,v+k,.1,3.2,.1,[.3,.3,.3]);for(const s of[0,6])bx(u+s,Y+3.2,v+15,.06,.06,30,[.3,.3,.3]);bx(u+3,Y,v+29,.5,.8,.1,[.95,.9,.7]);STN.push({k:'cricket',u:u+3,v:v-1.5})}
 /* climbing wall */{const u=120,v=-460;bx(u,Y,v,14,16,2,[.55,.5,.46]);const HC=[[.9,.2,.3],[.2,.5,.9],[.2,.8,.4],[.9,.4,.9],[.98,.85,.2]];for(let k=0;k<70;k++)bx(u-6.5+((k*37)%130)/10,Y+.6+((k*53)%150)/10,v-1.1,.35,.3,.25,HC[k%5]);bx(u,Y+16,v,1,1.2,1,[.98,.8,.2]);STN.push({k:'climb',u,v:v-3})}
 /* clubhouse + sign */{const u=120,v=-300;bx(u,Y,v,24,5,12,[.95,.95,.92]);bx(u,Y+5,v,25,.6,13,[.2,.4,.75]);for(let k=0;k<5;k++)bx(u-10+k*5,Y+1.2,v-6.05,2.6,2,.1,[.3,.5,.7]);RS.cBox(u-12,u+12,v-6,v+6)}
 scene.add(B.mesh(mObj));scene.add(RS.sign(120,-306.2,Y+6.2,'SUNHAVEN SPORTS PARK',20,2,Math.PI,'#1a3a8a','#ffffff'));RS.POI.push({n:'SPORTS PARK',u:110,v:-420,ic:'🏅'})}
{const c0=ctx;ctx=function(){const b=c0();if(!built||!RS.inRes()||!GS.onFoot||busy)return b;for(const s of STN){if(Math.hypot(P.x-RS.OX-s.u,P.z-RS.OZ-s.v)<3.4){const d=DEF[s.k],m=SP.medal[s.k]|0;return{label:d.ic+' PLAY '+d.n+(m?' ('+MED[m]+')':''),fn:GAMES[s.k]}}}return b}}
{const u0=updCozy;updCozy=function(dt){u0(dt);build()}}
PHX.push({k:'sports',ic:'🏅',n:'SPORTS',bg:'#1a3a8a',render({el}){el('div','phH','SUNHAVEN SPORTS PARK');const g=Object.values(SP.medal).filter(x=>x===3).length;el('small',null,g+'/6 GOLD MEDALS'+(SP.champ?' · 🏆 SPORTS CHAMPION':'')+' · EAST OF THE SUNHAVEN RUNWAY');
 for(const k in DEF){const d=DEF[k],m=SP.medal[k]|0,r=el('div','phR phK');el('span',null,d.ic+' '+d.n,r);el('span',null,(m?MED[m]:'NO MEDAL')+(SP.best[k]!=null?' · BEST '+SP.best[k]+(d.hi?'':'s'):''),r).style.color=m===3?'#ffd24a':m?'#cde':'#889';el('small',null,'BRONZE '+d.m[0]+' · SILVER '+d.m[1]+' · GOLD '+d.m[2]+' '+d.u)}}});
window.SPORTS={SP,GAMES,DEF,STN,award,PARK};
})();
