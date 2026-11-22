/* ---- PUB VARIETY: each town pub gets its own room, games and regulars, built on top of the standard pub.
     THE RAILWAY TAVERN       rough and noisy: arm wrestling, bar billiards, a quiz machine, railway posters, a model train
     THE DUKE OF WELLINGTON   old and posh: chess vs The Colonel, dominoes, cribbage, fireplace, panelling, grandfather clock
     THE SHIP INN             on the harbour: shove ha'penny, shanty singalong, a message in a bottle, nets, portholes, a ship's wheel
     THE NARROWBOAT           canal pub: pinball, a jukebox and open mic night
     THE PLOUGH               country pub: a skittles alley and Bramble the pub dog
     THE ROYAL OAK            keeps its classic games, plus Patch the dog and the pub league trophy cabinet
   Every pub has a weekly events board, and wins count towards the PUB LEAGUE (a phone app). ---- */
(function(){
if(typeof buildShop!=='function'||!window.PUBG)return;
const G=window.PUBG,B=(x,y,z,w,h,d,hex)=>sbox(x,y,z,w,h,d,fmc(hex)),rnd=(a,b)=>a+Math.random()*(b-a),pk=a=>a[Math.floor(Math.random()*a.length)];
const PUBS={st:{chess:{w:[0,0,0],l:[0,0,0]}},pts:0,season:0,cups:0,wins:{}};window.PUBS=PUBS;
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.pubs=PUBS;return o};cozyLoad=function(z){l0(z);if(z&&z.pubs){Object.assign(PUBS,z.pubs);PUBS.st=Object.assign({chess:{w:[0,0,0],l:[0,0,0]}},z.pubs.st||{})}}}
const cur=()=>window.SHOPCUR&&SHOPCUR.o&&SHOPCUR.o.t;
const feed=(f,e,msg)=>{if(typeof fed==='function')fed(f,e,msg);else{try{HN.food=Math.min(100,HN.food+f);HN.en=Math.min(100,HN.en+e)}catch(_){}toast(msg)}};

/* ------------------------------------------------------------------ weekly events (from 6pm) */
const EV=[{d:0,p:'THE PLOUGH',n:'SKITTLES NIGHT',g:'skittles'},{d:1,p:'THE ROYAL OAK',n:'QUIZ NIGHT',g:'quiz'},{d:2,p:'THE DUKE OF WELLINGTON',n:'CHESS CLUB',g:'chess'},
 {d:3,p:'THE RAILWAY TAVERN',n:'ARM WRESTLING TOURNAMENT',g:'arm'},{d:4,p:'THE NARROWBOAT',n:'OPEN MIC NIGHT',g:'openmic'},{d:5,p:'THE SHIP INN',n:'SHANTY NIGHT',g:'shanty'},{d:6,p:'THE RAILWAY TAVERN',n:'SUNDAY MEAT RAFFLE',g:'raffle'}];
const tonight=()=>{try{return GT>=18?EV.find(e=>e.d===dow()):null}catch(e){return null}};
PUBS.events=EV;PUBS.tonight=tonight;

/* ------------------------------------------------------------------ the pub league */
const RIV=[['BIG MICK',.95],['THE COLONEL',.85],['OLD SALT',.75],['FARMER JOHN',.7],['DOT FROM THE LAUNDERETTE',.55]];
const season=()=>Math.floor(((typeof DAY==='number'?DAY:1)-1)/7);
const rivalPts=(i,d)=>{const day=((typeof DAY==='number'?DAY:1)-1)%7+1;return Math.round(RIV[i][1]*day*4+((season()*7+i*3)%5))};
const PTS={chess:[4,7,12],arm:[4],barbilliards:[3],quizmachine:[1],dominoes:[3],cribbage:[4],shove:[3],skittles:[4],pinball:[2],shanty:[3],openmic:[3]};
PUBS.win=function(game,lvl){if(PUBS.season!==season()){PUBS.season=season();PUBS.pts=0}let p=(PTS[game]||[2])[Math.min(lvl||0,(PTS[game]||[2]).length-1)];const ev=tonight();if(ev&&ev.g===game&&ev.p===cur())p*=2;PUBS.pts+=p;PUBS.wins[game]=(PUBS.wins[game]|0)+1;setTimeout(()=>toast('🏆 PUB LEAGUE +'+p+(ev&&ev.g===game?' (EVENT NIGHT, DOUBLE!)':'')+' · '+PUBS.pts+' THIS WEEK'),1800)};
const table=()=>{const t=RIV.map((r,i)=>[r[0],rivalPts(i)]);t.push(['YOU',PUBS.season===season()?PUBS.pts:0]);return t.sort((a,b)=>b[1]-a[1])};
/* the season ends at the end of each week: top the table to win the cup */
{const n0=newDay;newDay=function(){const before=season(),tb=table(),me=tb.findIndex(r=>r[0]==='YOU');n0();if(season()!==before){if(me===0&&PUBS.pts>0){PUBS.cups++;cash+=250;try{TOWNSHOPS.col['PUB LEAGUE CUP · WEEK '+(before+1)]=1}catch(e){}setTimeout(()=>toast('🏆 YOU WON THE PUB LEAGUE! +£250 AND A CUP FOR THE CABINET'),2600)}PUBS.pts=0;PUBS.season=season()}const ev=EV.find(e=>e.d===dow());if(ev)setTimeout(()=>toast('🍺 TONIGHT FROM 6PM: '+ev.n+' AT '+ev.p),4800)}}
if(typeof PHX!=='undefined')PHX.push({k:'publeague',ic:'🍺',n:'PUB LEAGUE',bg:'#7a4a1a',render({el}){el('div','phH','COZYTOWN PUB LEAGUE · WEEK '+(season()+1));
 table().forEach((r,i)=>{const row=el('div','phR phK');el('span',null,(i+1)+'. '+r[0],row).style.color=r[0]==='YOU'?'#ffe14a':'';el('span',null,r[1]+' PTS',row)});
 el('small',null,'Beat the regulars at each pub\'s games to score. Event nights score double. Top the table by Sunday night to win the cup. Cups won: '+PUBS.cups).style.marginTop='8px';
 el('div','phH','THIS WEEK').style.marginTop='10px';const d=dow();for(const e of EV){const r=el('div','phR');r.textContent=DOWS[e.d]+' · '+e.n+' · '+e.p.replace('THE ','');if(e.d===d)r.style.borderColor='#ffe14a'}}});

/* ------------------------------------------------------------------ room kit */
function clearR(rects){const b=new THREE.Box3(),c=new THREE.Vector3(),s=new THREE.Vector3(),inR=(x,z)=>rects.some(r=>x>=r[0]&&x<=r[1]&&z>=r[2]&&z<=r[3]);
 SG.updateMatrixWorld(true);for(const o of SG.children.slice()){b.setFromObject(o);if(b.isEmpty())continue;b.getCenter(c);b.getSize(s);c.sub(SG.position);if(Math.max(s.x,s.z)<3.6&&inR(c.x,c.z))SG.remove(o)}
 for(let i=IA.length-1;i>=0;i--){const r=IA[i].r;if(inR((r[0]+r[1])/2,(r[2]+r[3])/2))IA.splice(i,1)}
 for(let i=IROOM.length-1;i>=1;i--){const r=IROOM[i];if(inR((r[0]+r[1])/2,(r[2]+r[3])/2))IROOM.splice(i,1)}}
function restyle(wall,floor){for(const o of SG.children){if(!o.geometry||o.geometry.type!=='PlaneGeometry')continue;const p=o.geometry.parameters;if(floor&&p.width>=8&&p.height>=6&&o.position.y<.05&&o.material.map&&p.height!==2.7){o.material=imat(FLR[floor]())}
  else if(wall!=null&&p.height>2.5&&p.height<3&&p.width>=6&&o.material&&o.material.color)o.material.color.setHex(wall)}}
const BK=-3.2,Z0=-2,Z1=4.4;
const ia=(x0,x1,z0,z1,label,fn)=>IA.push({r:[x0,x1,z0,z1],label,fn});const blk=(x0,x1,z0,z1)=>IROOM.push([x0,x1,z0,z1]);
const tex=(w,h,fn)=>{const f=cvT(w,h),g=f.cv.getContext('2d');fn(g,w,h);f.tx.needsUpdate=true;return f.tx};
/* a picture on a side wall (x = +-RX) or the door wall */
const wallPic=(x,y,z,w,h,t)=>{const m=sPlane(w,h,x+(x<0?.03:-.03),y,z,x<0?Math.PI/2:-Math.PI/2,t);return m};
const stool=(x,z,col)=>{B(x,0,z,.08,.7,.08,0x444);B(x,.7,z,.4,.07,.4,col||0x5a3a20);blk(x-.22,x+.22,z-.22,z+.22)};
const chair=(x,z,col,face)=>{B(x,0,z,.5,.45,.5,col);B(x+(face==='x'?-.22:0),.45,z+(face==='z'?-.22:face==='-z'?.22:0),face==='x'?.08:.5,.5,face==='x'?.5:.08,col);blk(x-.28,x+.28,z-.28,z+.28)};
const seat=(seed,x,z,ry,o)=>{try{return personIn(pSpec(seed,Object.assign({gl:false,scarf:null,bp:false,bag:0},o||{})),x,z,ry,true)}catch(e){czErr(e,'pubkit.js');return null}};
const stand=(seed,x,z,ry,o)=>{try{return personIn(pSpec(seed,Object.assign({gl:false,scarf:null,bp:false,bag:0},o||{})),x,z,ry)}catch(e){czErr(e,'pubkit.js');return null}};
function board(name){/* weekly events chalkboard on the right of the door */const t=tex(256,320,(g,W,H)=>{g.fillStyle='#1a2a1e';g.fillRect(0,0,W,H);g.strokeStyle='#8a5a2a';g.lineWidth=12;g.strokeRect(0,0,W,H);g.fillStyle='#f4f0e0';g.font='bold 22px Georgia';g.textAlign='center';g.fillText('THIS WEEK',W/2,36);g.font='15px Georgia';
  let y=66;for(const e of EV){g.fillStyle=e.p===name?'#ffd870':'#d8d8c8';g.textAlign='left';g.fillText(DOWS[e.d],16,y);g.fillText(e.n.length>20?e.n.slice(0,19)+'.':e.n,62,y);y+=22;g.font='11px Georgia';g.fillStyle='#a8b0a0';g.fillText('  '+e.p.replace('THE ',''),62,y-8);g.font='15px Georgia';y+=12}g.fillStyle='#f4f0e0';g.textAlign='center';g.font='italic 13px Georgia';g.fillText('from 6pm · league points x2',W/2,H-14)});
 sPlane(.9,1.12,3.6,1.55,RZ-.03,Math.PI,t)}
function sign(w,h,x,y,z,ry,bg,fg,txt,sz){return sPlane(w,h,x,y,z,ry,txtTex(512,Math.round(512*h/w),bg,fg,txt,sz))}

/* ------------------------------------------------------------------ the pub dog */
let DOG=null;
function dogMesh(c,d){const Bd=new Builder(3);pbox(Bd,0,.28,0,.26,.24,.58,c);pbox(Bd,0,.45,.32,.22,.22,.24,c);pbox(Bd,0,.42,.47,.12,.1,.14,d);pbox(Bd,.08,.6,.3,.05,.12,.05,d);pbox(Bd,-.08,.6,.3,.05,.12,.05,d);for(const[x,z]of[[-.08,-.2],[.08,-.2],[-.08,.2],[.08,.2]])pbox(Bd,x,0,z,.07,.28,.07,d);pbox(Bd,0,.42,-.32,.05,.05,.22,c,.6);return Bd.mesh(mObj)}
function addDog(name,c,d){const g=dogMesh(c,d);g.position.set(-3.8,0,3.2);SG.add(g);DOG={g,name,tx:-3.8,tz:3.2,t:0,follow:0};
 IA.push({r:[0,0,0,0],dog:1,label:()=>'PET '+name+(DOG&&DOG.follow>0?' (FOLLOWING YOU)':''),fn:()=>{DOG.follow=40;try{say(name,pk(['*wags tail*','*rolls over for a belly rub*','*licks your hand*','*brings you a beer mat*']),2600)}catch(e){}try{beep(880,.06,'triangle',.05)}catch(e){}}})}
{const u0=updCozy;updCozy=function(dt){u0(dt);if(!DOG)return;if(!GS.inside||!DOG.g.parent){DOG=null;return}const D=DOG;D.t-=dt;let tx=D.tx,tz=D.tz;
 if(D.follow>0){D.follow-=dt;tx=P.x-IX+Math.sin(P.psi)*.9;tz=P.z-IZ+Math.cos(P.psi)*.9}else if(D.t<=0){D.t=rnd(3,7);D.tx=rnd(-5,1);D.tz=rnd(.2,5)}
 const dx=tx-D.g.position.x,dz=tz-D.g.position.z,l=Math.hypot(dx,dz);if(l>.25){const sp=Math.min(l,(D.follow>0?2.2:.9)*dt);D.g.position.x+=dx/l*sp;D.g.position.z+=dz/l*sp;D.g.rotation.y=Math.atan2(dx,dz)}
 const a=IA.find(q=>q.dog);if(a){const x=D.g.position.x,z=D.g.position.z;a.r=[x-.9,x+.9,z-.9,z+.9]}}}

/* ------------------------------------------------------------------ the pubs */
const POOL=[1.9,5.4,-.3,2.5],FOOTY=[-3.95,-2.05,3.1,5.6],KARA=[3.1,5.7,3.2,5.3],FRUIT=[5.3,6.3,1.0,3.0],DARTS=[-6.3,-4.7,-.7,2.1],CIG=[-3.9,-2.9,-.28,.3];
const LOOK={
'THE RAILWAY TAVERN':{wall:0x6a3a2a,floor:'tile2',clear:[POOL,FOOTY,KARA],build(){
  /* railway posters, a station clock, a model train running round a shelf */
  const post=(txt,c1,c2)=>tex(200,280,(g,W,H)=>{g.fillStyle=c1;g.fillRect(0,0,W,H);g.fillStyle=c2;g.fillRect(0,H*.55,W,H*.45);g.fillStyle='#fff';g.font='bold 22px Georgia';g.textAlign='center';g.fillText(txt[0],W/2,40);g.font='15px Georgia';g.fillText(txt[1],W/2,66);g.fillStyle='#222';g.fillRect(30,H*.55-30,W-60,30);g.fillStyle='#c82020';g.fillRect(40,H*.55-26,40,22);g.fillStyle='#ffd040';g.font='bold 14px Georgia';g.fillText('COZY RAILWAYS',W/2,H-20)});
  wallPic(-RX,1.6,-0.2,.7,.95,post(['SUNNY','SUNHAVEN'],'#2a6aa0','#e8c070'));wallPic(-RX,1.6,3.2,.7,.95,post(['MARLOWE','BY EXPRESS'],'#6a2a5a','#4a4a5a'));wallPic(RX,1.6,4.4,.7,.95,post(['THE MOORS','FRESH AIR!'],'#3a6a2a','#7a9a4a'));
  const clk=tex(128,128,(g,W)=>{g.fillStyle='#f4f0e4';g.beginPath();g.arc(64,64,60,0,7);g.fill();g.lineWidth=6;g.strokeStyle='#111';g.stroke();g.fillStyle='#111';for(let i=0;i<12;i++){const a=i/12*6.283;g.fillRect(64+Math.sin(a)*48-2,64-Math.cos(a)*48-2,4,4)}const h=(GT%12)/12*6.283,m=(GT%1)*6.283;g.lineWidth=5;g.beginPath();g.moveTo(64,64);g.lineTo(64+Math.sin(h)*28,64-Math.cos(h)*28);g.stroke();g.lineWidth=3;g.beginPath();g.moveTo(64,64);g.lineTo(64+Math.sin(m)*44,64-Math.cos(m)*44);g.stroke()});
  sPlane(.6,.6,2.6,2.2,BK+.04,0,clk);
  /* shelf round three walls and a little train */for(const[x,z,w,d]of[[-RX+.12,(Z0+Z1)/2,.24,Z1-Z0],[RX-.12,(Z0+Z1)/2,.24,Z1-Z0]])B(x,2.18,z,w,.05,d,0x3a2414);
  const tr=new THREE.Group();tr.visible=true;const tb=(x,y,z,w,h,d,c)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({color:c}));m.position.set(x,y,z);tr.add(m)};tb(0,.07,0,.12,.1,.3,0x1a4a2a);tb(0,.14,-.08,.1,.08,.12,0x1a4a2a);tb(0,.18,.1,.04,.08,.04,0x111);tb(0,.07,-.36,.12,.1,.32,0x8a1a1a);tb(0,.07,-.72,.12,.1,.32,0x8a6a1a);SG.add(tr);RW.train=tr;RW.t=0;
  /* a dartboard stays; dark lino, smoke-stained ceiling */
  /* bar billiards (where the pool table was) */B(3.7,0,1.0,.12,.78,.12,0x3a2414);B(2.7,0,1.0,.12,.78,.12,0x3a2414);B(4.7,0,1.0,.12,.78,.12,0x3a2414);B(3.7,.78,1.0,2.6,.1,1.1,0x4a2a14);B(3.7,.88,1.0,2.4,.02,.9,0x1f6a34);
  for(const[dx,dz]of[[-.8,0],[-.4,-.25],[-.4,.25],[0,0],[.4,-.3],[.4,.3],[.8,0]])B(3.7+dx,.9,1.0+dz,.06,.01,.06,0x050505);for(const dz of[-.15,0,.15])B(3.2,.9,1.0+dz,.03,.06,.03,dz?0xf4f4f4:0x111);
  blk(2.3,5.1,.4,1.6);ia(2.2,5.2,1.6,2.5,'BAR BILLIARDS vs STAN (£2)',()=>G.barBilliards(2));stand(5151,5.4,1.9,-Math.PI/2,{f:false,hs:6,old:true,tc:[.3,.25,.2]});
  /* arm wrestling table (where the football table was) */B(-3,0,4.4,.9,.75,.9,0x5a3a20);B(-3,.75,4.4,1.0,.05,1.0,0x6a4a2a);stool(-3,3.6,0x3a2010);B(-3,0,5.1,.42,.7,.42,0x3a2010);blk(-3.6,-2.4,3.85,4.95);
  seat(4242+7,-3,5.05,Math.PI,{f:false,hs:2,beard:true,tc:[.12,.12,.14],w:1.15});
  ia(-3.9,-2.1,3.0,3.85,()=>'ARM WRESTLE BIG MICK (£5)'+(tonight()&&tonight().g==='arm'&&cur()==='THE RAILWAY TAVERN'?' · TOURNAMENT NIGHT':''),()=>G.arm({n:'BIG MICK',str:tonight()&&tonight().g==='arm'?1.25:1},5));
  /* quiz machine on the right wall */B(6.0,0,4.2,.5,1.7,.8,0x1a2a6a);B(5.74,.9,4.2,.02,.6,.6,0x40a0ff);B(5.74,1.6,4.2,.02,.2,.7,0xffd040);blk(5.6,6.3,3.75,4.65);ia(4.9,6.3,3.6,4.9,'QUIZ MACHINE (£1)',()=>G.quizMachine());
  /* sunday meat raffle */ia(.6,2.0,-.9,-.3,()=>{const e=tonight();return e&&e.g==='raffle'?'MEAT RAFFLE TICKET (£1)':'BUY A PORK SCRATCHING £1'},()=>{if(cash<1)return toast('NOT ENOUGH CASH');cash-=1;try{cashUI()}catch(e){}const e=tonight();if(e&&e.g==='raffle'){if(Math.random()<.22)feed(60,10,'🥩 YOUR TICKET WINS! A WHOLE SUNDAY ROAST. FOOD +60');else toast('🎟 NOT THIS TIME. "Next week, love."')}else feed(6,2,'PORK SCRATCHINGS. CRUNCH. (-£1)')})}},
'THE DUKE OF WELLINGTON':{wall:0x5a3a24,floor:'carpet',clear:[POOL,FOOTY,KARA,FRUIT,DARTS,CIG,[-4.95,-3.65,1.25,2.55]],build(){
  /* dark panelling, a fireplace with the chess table beside it, oil paintings, a grandfather clock */
  for(const[x,z,w,d]of[[0,RZ-.06,2*RX,.06],[-RX+.06,(Z0+Z1)/2,.06,Z1-Z0],[RX-.06,(Z0+Z1)/2,.06,Z1-Z0]])B(x,0,z,w,1.15,d,0x3a2416),B(x,1.15,z,w,.06,d+.02,0x2a1a0e);
  B(-RX+.35,0,1.4,.6,1.25,1.9,0x5a4a3a);B(-RX+.5,.12,1.4,.32,.62,1.1,0x111);B(-RX+.56,.16,1.4,.2,.28,.7,0xff7a2a);B(-RX+.56,.2,1.4,.12,.4,.4,0xffc040);B(-RX+.35,1.25,1.4,.75,.1,2.1,0x3a2414);blk(-RX,-RX+.8,.4,2.4);
  const oil=(c1,c2,kind)=>tex(200,160,(g,W,H)=>{g.fillStyle='#6a4a1a';g.fillRect(0,0,W,H);g.fillStyle=c1;g.fillRect(12,12,W-24,H-24);g.fillStyle=c2;if(kind===0){g.beginPath();g.arc(W/2,H*.45,30,0,7);g.fill();g.fillRect(W/2-34,H*.6,68,50)}else{g.fillRect(12,H*.62,W-24,H*.38-12);g.fillStyle='#2a3a1a';g.beginPath();g.moveTo(40,H*.62);g.lineTo(80,40);g.lineTo(120,H*.62);g.fill()}});
  wallPic(-RX+.04,1.95,-0.2,.9,.72,oil('#3a2a20','#c8a080',0));wallPic(-RX+.04,1.95,3.2,.9,.72,oil('#6a8ab0','#4a6a2a',1));wallPic(RX-.04,1.95,.4,.9,.72,oil('#2a2018','#d8b890',0));
  sign(1.3,.32,-RX+.06,1.95,1.4,Math.PI/2,'#2a1a0e','#e8c870','THE IRON DUKE',30);
  /* chess table by the fire */B(-4.2,0,1.4,.12,.7,.12,0x3a2414);B(-4.2,.7,1.4,.9,.05,.9,0x2a1a0e);const cb=tex(128,128,(g)=>{for(let r=0;r<8;r++)for(let c=0;c<8;c++){g.fillStyle=(r+c)%2?'#5a3a20':'#e8d2a8';g.fillRect(c*16,r*16,16,16)}});const cm=new THREE.Mesh(new THREE.PlaneGeometry(.6,.6).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:cb}));cm.position.set(-4.2,.76,1.4);SG.add(cm);
  for(let i=0;i<8;i++){B(-4.47+i*.077,.76,1.17,.04,.07,.04,0xf4ecd8);B(-4.47+i*.077,.76,1.63,.04,.07,.04,0x1a1410)}
  B(-4.2,0,2.25,.7,.42,.6,0x6a1a1a);B(-4.2,.42,2.52,.7,.6,.12,0x6a1a1a);blk(-4.7,-3.7,.9,2.6);seat(9001,-4.2,2.2,Math.PI,{f:false,hs:5,old:true,tc:[.2,.24,.18],beard:true});
  ia(-4.8,-3.4,.0,.9,()=>'PLAY CHESS vs THE COLONEL'+(tonight()&&tonight().g==='chess'&&cur()==='THE DUKE OF WELLINGTON'?' · CHESS CLUB NIGHT':''),()=>G.chess());
  const lad=tex(256,128,(g,W,H)=>{const R=PUBS.st.chess||{w:[0,0,0],l:[0,0,0]};g.fillStyle='#1a1208';g.fillRect(0,0,W,H);g.fillStyle='#e8c870';g.font='bold 20px Georgia';g.textAlign='center';g.fillText("THE COLONEL'S LADDER",W/2,26);g.font='16px Georgia';['FRIENDLY','CLUB','HIS BEST'].forEach((n,i)=>g.fillText(n+'  ·  YOU '+R.w[i]+' - '+R.l[i],W/2,56+i*24))});wallPic(-RX+.04,1.55,-1.0+.4,.8,.4,lad);
  /* dominoes with the old boys */B(3.6,0,1.0,.12,.72,.12,0x3a2414);B(3.6,.72,1.0,1.1,.05,.8,0x4a2a14);for(let i=0;i<7;i++)B(3.25+i*.11,.77,.85,.05,.02,.1,0xf4f0e0);chair(4.5,1.0,0x3a2a1a,'x');blk(3.0,4.2,.55,1.45);seat(9100,4.5,1.0,-Math.PI/2,{f:false,old:true,hs:5});
  ia(2.6,4.6,1.5,2.4,'DOMINOES vs THE OLD BOYS (£2)',()=>G.dominoes(2));
  /* cribbage */B(3.6,0,4.0,.12,.72,.12,0x3a2414);B(3.6,.72,4.0,1.0,.05,.8,0x4a2a14);B(3.6,.77,4.0,.5,.04,.14,0x8a5a2a);chair(4.5,4.0,0x3a2a1a,'x');blk(3.05,4.15,3.55,4.45);seat(9200,4.5,4.0,-Math.PI/2,{f:false,old:true,hs:7,tc:[.15,.2,.35]});
  ia(2.6,4.6,4.5,5.3,'CRIBBAGE vs MAJOR BRIGGS (£2)',()=>G.cribbage(2));
  /* grandfather clock and armchairs */B(RX-.3,0,2.4,.45,2.1,.4,0x4a2a14);B(RX-.53,1.5,2.4,.02,.32,.32,0xf4f0e4);B(RX-.53,.4,2.4,.02,.7,.2,0xc8a040);blk(RX-.55,RX,2.15,2.65);
  for(const z of[-.3])chair(-1.8,4.6,0x6a1a1a,'-z');B(0,0,4.4,1.8,.02,1.2,0x7a1a1a)}},
'THE SHIP INN':{wall:0xe8e4d8,floor:'wood',clear:[POOL,FOOTY,KARA],build(){
  /* nets on the ceiling, portholes with the sea, a ship's wheel, a low beam, buoys and a lifebuoy */
  for(let i=-5;i<=5;i++){B(i*1.1,IH-.12,1.2,.02,.02,7,0x5a4a3a)}for(let j=-2;j<=5;j++)B(0,IH-.12,j*.9,2*RX-.6,.02,.02,0x5a4a3a);
  
  const sea=tex(128,128,(g,W)=>{g.fillStyle='#4a3a2a';g.beginPath();g.arc(64,64,62,0,7);g.fill();g.save();g.beginPath();g.arc(64,64,50,0,7);g.clip();const gr=g.createLinearGradient(0,0,0,128);gr.addColorStop(0,'#9ad0f0');gr.addColorStop(.55,'#cfe6f4');gr.addColorStop(.56,'#2a6a9a');gr.addColorStop(1,'#143a5a');g.fillStyle=gr;g.fillRect(0,0,128,128);g.fillStyle='#fff';g.fillRect(70,60,22,6);g.fillRect(78,48,3,14);g.restore();g.lineWidth=8;g.strokeStyle='#c8a040';g.beginPath();g.arc(64,64,54,0,7);g.stroke()});
  for(const z of[-.3,1.8,3.9]){wallPic(-RX,1.6,z,.55,.55,sea);wallPic(RX,1.6,z,.55,.55,sea)}
  const wheel=tex(160,160,(g)=>{g.translate(80,80);g.strokeStyle='#6a3a1a';g.lineWidth=10;g.beginPath();g.arc(0,0,52,0,7);g.stroke();g.lineWidth=7;for(let i=0;i<8;i++){const a=i/8*6.283;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a)*76,Math.sin(a)*76);g.stroke()}g.fillStyle='#c8a040';g.beginPath();g.arc(0,0,12,0,7);g.fill()});
  sPlane(.9,.9,-1.5,1.75,RZ-.04,Math.PI,wheel);
  const ring=tex(128,128,(g)=>{g.lineWidth=22;for(let i=0;i<4;i++){g.strokeStyle=i%2?'#f4f4f0':'#d02a1a';g.beginPath();g.arc(64,64,44,i*Math.PI/2,(i+1)*Math.PI/2);g.stroke()}});sPlane(.55,.55,3.4,1.7,BK+.04,0,ring);
  for(const[x,z,c]of[[-RX+.25,5.2,0xff6a2a],[RX-.25,-.6,0xf0f0f0],[RX-.25,5.2,0xff6a2a]])B(x,2.0,z,.3,.38,.3,c);
  /* shove ha'penny board on a table */B(3.6,0,1.0,.12,.72,.12,0x3a2414);B(3.6,.72,1.0,.9,.05,1.3,0x5a3a20);B(3.6,.77,1.0,.42,.02,.9,0xc8904a);for(let k=0;k<9;k++)B(3.6,.79,.65+k*.08,.4,.004,.005,0x3a2410);
  stand(6060,4.7,1.2,-Math.PI/2,{f:false,old:true,beard:true,hs:6,tc:[.12,.2,.4]});blk(3.1,4.1,.3,1.7);ia(2.6,4.6,1.7,2.5,"SHOVE HA'PENNY vs OLD SALT (£1)",()=>G.shove(1));
  /* the shanty corner: a little stage with a squeezebox */B(4.0,0,4.4,2.2,.15,1.6,0x4a2a14);B(4.0,.15,4.9,.4,.4,.3,0x8a1a1a);sign(1.6,.32,4.0,2.15,RZ-.04,Math.PI,'#0a2a4a','#ffe9a8','SHANTY CORNER',30);blk(2.9,5.1,4.6,5.2);
  ia(2.9,5.1,3.3,4.2,()=>'SHANTY SINGALONG'+(tonight()&&tonight().g==='shanty'&&cur()==='THE SHIP INN'?' · SHANTY NIGHT!':''),()=>G.shanty());
  /* the message in a bottle behind the bar */B(2.3,1.07,-1.2,.1,.32,.1,0x3a8a4a);B(2.3,1.38,-1.2,.05,.08,.05,0x8a6a3a);
  ia(1.6,3.0,-.9,-.3,()=>BTL.st===0?'LOOK AT THE BOTTLE ON THE BAR':BTL.st<4?'THE BOTTLE MAP (CLUE '+BTL.st+'/3)':'THE BOTTLE (TREASURE FOUND)',bottle)}},
'THE NARROWBOAT':{wall:0x2a4a3a,floor:'wood',clear:[POOL,KARA,FRUIT],build(){
  /* roses-and-castles canal art, ropes, brass; pinball, jukebox and an open mic stage */
  const rc=tex(256,96,(g,W,H)=>{g.fillStyle='#1a3a2a';g.fillRect(0,0,W,H);g.strokeStyle='#e8c040';g.lineWidth=5;g.strokeRect(4,4,W-8,H-8);for(let i=0;i<4;i++){const x=32+i*64;g.fillStyle=['#d02a2a','#f4f0e0','#d8a020','#d02a2a'][i];g.beginPath();g.arc(x,48,16,0,7);g.fill();g.fillStyle='#2a8a3a';g.beginPath();g.ellipse(x+18,58,10,5,.4,0,7);g.fill()}});
  for(const z of[-.2,3.4]){wallPic(-RX,1.9,z,1.4,.52,rc)}
  /* pinball */B(5.7,0,1.6,.9,.9,1.5,0x2a0a4a);B(5.7,.9,1.6,.9,.08,1.5,0x14082a);B(6.1,.98,1.6,.1,.9,1.5,0xff50e8);B(6.05,1.5,1.6,.04,.5,1.3,0x20e0ff);blk(5.2,6.3,.85,2.35);ia(4.3,5.6,.9,2.3,'PINBALL (£1)',()=>G.pinball());
  /* jukebox */B(5.9,0,4.3,.6,1.5,.9,0x8a1a2a);B(5.58,.8,4.3,.02,.5,.6,0xffd040);B(5.58,1.35,4.3,.02,.15,.7,0xff8a3a);blk(5.55,6.3,3.85,4.75);ia(4.8,6.3,3.6,5.0,'JUKEBOX (£1)',()=>G.jukebox());
  /* open mic stage */B(3.3,0,4.6,2.0,.18,1.6,0x3a2414);B(3.3,.18,4.6,.04,1.2,.04,0x222);B(3.3,1.35,4.6,.1,.1,.1,0x888);B(2.6,.18,5.0,.5,.7,.35,0x1a1a1a);blk(2.3,4.3,4.0,5.4);
  sign(1.8,.34,3.3,2.15,RZ-.04,Math.PI,'#1a1a1a','#ffd040','OPEN MIC · FRIDAYS',28);
  ia(2.3,4.3,3.0,4.0,()=>{const e=tonight();return e&&e.g==='openmic'&&cur()==='THE NARROWBOAT'?'🎤 OPEN MIC: TAKE THE STAGE':'🎤 OPEN MIC (FRIDAYS FROM 6PM)'},()=>{const e=tonight();if(e&&e.g==='openmic'&&cur()==='THE NARROWBOAT')G.openMic();else{try{say('LANDLADY','"Open mic is Friday nights from six, love. Bring your best song."',3200)}catch(_){toast('OPEN MIC IS FRIDAY NIGHTS FROM 6PM')}}})}},
'THE PLOUGH':{wall:0xe4d8b8,floor:'stone',clear:[POOL,KARA,FRUIT],build(){
  /* beams with hop garlands, horse brasses, an inglenook glow; a skittles alley down the right side */
  B(0,IH-.18,-.6,2*RX,.18,.22,0x4a2a14);for(let i=-5;i<=5;i++)B(i*1.1,IH-.32,-.6,.16,.1,.16,0x8aa04a);
  for(const z of[.2,1.2,2.2])B(-RX+.05,1.6,z,.02,.18,.14,0xd8a830);
  B(4.95,0,2.4,1.25,.05,5.8,0xb8884a);for(const x of[4.32,5.58])B(x,0,2.4,.08,.14,5.8,0x5a3a20);for(const[dx,dz]of[[0,0],[-.15,.12],[.15,.12],[-.3,.24],[0,.24],[.3,.24],[-.15,.36],[.15,.36],[0,.48]])B(4.95+dx,.05,-.4+dz,.07,.28,.07,0xf4ead4);
  blk(4.25,5.65,-.6,5.3);ia(3.2,4.25,1.6,3.6,()=>'SKITTLES vs FARMER JOHN (£2)'+(tonight()&&tonight().g==='skittles'&&cur()==='THE PLOUGH'?' · SKITTLES NIGHT':''),()=>G.skittles(2));
  stand(7070,3.6,4.6,Math.PI,{f:false,hs:4,tc:[.3,.4,.2],beard:true});sign(1.5,.32,4.95,2.2,RZ-.04,Math.PI,'#3a2a10','#f0d070','SKITTLE ALLEY',30);
  addDog('BRAMBLE',[.18,.14,.12],[.95,.95,.92])}},
'THE ROYAL OAK':{build(){addDog('PATCH',[.92,.9,.86],[.4,.26,.14]);
  /* the trophy cabinet: one cup for every pub league you win */B(-RX+.3,0,3.05,.5,1.8,.8,0x4a2a14);B(-RX+.56,.2,3.05,.02,1.5,.64,0x8ab8d8);const n=Math.min(6,PUBS.cups);for(let i=0;i<n;i++){B(-RX+.32,.35+Math.floor(i/2)*.5,2.88+(i%2)*.34,.1,.22,.1,0xd8b030);B(-RX+.32,.57+Math.floor(i/2)*.5,2.88+(i%2)*.34,.16,.06,.16,0xd8b030)}
  sign(1.0,.24,-RX+.06,2.05,3.05,Math.PI/2,'#1c3a24','#f0d070','PUB LEAGUE CUPS: '+PUBS.cups,24);blk(-RX,-RX+.6,2.6,3.5);
  ia(-RX+.6,-RX+1.5,2.6,3.5,'LOOK IN THE TROPHY CABINET',()=>toast(PUBS.cups?'🏆 '+PUBS.cups+' PUB LEAGUE CUP'+(PUBS.cups>1?'S':'')+'. THE LANDLORD IS VERY PROUD.':'AN EMPTY CABINET. "Win the pub league and your cup goes in here."'))}}};
const RW={train:null,t:0};
{const u0=updCozy;updCozy=function(dt){u0(dt);if(!RW.train||!RW.train.parent){RW.train=null;return}RW.t+=dt*.12;/* up one side wall, along the door wall, down the other, then back again */const L=[[-RX+.12,Z0+.3],[-RX+.12,Z1-.2],[RX-.12,Z1-.2],[RX-.12,Z0+.3]],u=RW.t%6,k=u<3?u:6-u,i=Math.min(2,Math.floor(k)),f=k-i,a=L[i],b=L[i+1],dir=u<3?1:-1;
 RW.train.position.set(a[0]+(b[0]-a[0])*f,2.2,a[1]+(b[1]-a[1])*f);RW.train.rotation.y=Math.atan2((b[0]-a[0])*dir,(b[1]-a[1])*dir)}}

/* ------------------------------------------------------------------ the message in a bottle */
const BTL={st:0,spots:null};
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.btl={st:BTL.st};return o};cozyLoad=function(z){l0(z);if(z&&z.btl)BTL.st=z.btl.st|0}}
function spots(){if(BTL.spots)return BTL.spots;const P_=(window.TOWN&&TOWN.pois)||[],want=['COZE MERE','WINDMILL HILL',"SMUGGLERS' CAVE"];const L=want.map(n=>P_.find(p=>p.n===n)).filter(Boolean);
 BTL.spots=L.length===3?L:[{x:-102,z:62,n:'THE FARM POND'},{x:630,z:-1140,n:'WINDMILL HILL'},{x:-725,z:106,n:'COZY PARK'}];return BTL.spots}
const CLUES=[n=>'"Where still water mirrors the sky and the anglers sit, look under the old bench." ('+n+')',n=>'"Where the sails turn and the miller once ground his flour, dig by the door." ('+n+')',n=>'"Where the smugglers hid their brandy, the last of it waits in the dark." ('+n+')'];
const wayTo=s=>{try{if(typeof PH!=='undefined'&&typeof phWay==='function'){PH.way={x:s.x,z:s.z,n:s.n,keep:1};phWay()}}catch(e){czErr(e,'pubkit.js')}};
function bottle(){if(BTL.st===0){BTL.st=1;const s=spots()[0];toast('📜 INSIDE THE BOTTLE: AN OLD SAILOR\'S MAP!');setTimeout(()=>toast('CLUE 1: '+CLUES[0](s.n)),2200);wayTo(s);return}
 if(BTL.st<4){const s=spots()[BTL.st-1];toast('CLUE '+BTL.st+': '+CLUES[BTL.st-1](s.n))}else toast('THE BOTTLE IS EMPTY NOW. "You found Captain Coze\'s treasure!"')}
{let t=0;const u0=updCozy;updCozy=function(dt){u0(dt);if(BTL.st<1||BTL.st>3||GS.inside)return;t-=dt;if(t>0)return;t=.5;const s=spots()[BTL.st-1],px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z;if(Math.hypot(px-s.x,pz-s.z)<22){
 BTL.st++;try{beep(660,.1,'square',.05);setTimeout(()=>beep(990,.14,'square',.05),110)}catch(e){}
 if(BTL.st===4){cash+=400;try{cashUI();TOWNSHOPS.col["CAPTAIN COZE'S DOUBLOON"]=1}catch(e){}toast('💰 CAPTAIN COZE\'S TREASURE! £400 AND A GOLD DOUBLOON');}
 else{const n=spots()[BTL.st-1];wayTo(n);toast('📜 ANOTHER SCRAP OF THE MAP! CLUE '+BTL.st+': '+CLUES[BTL.st-1](n.n))}}}}

/* ------------------------------------------------------------------ wire it into buildShop */
{const b0=buildShop;buildShop=function(o){b0(o);if(!o||!o.pub)return;G.jukeboxStop&&G.jukeboxStop();DOG=null;RW.train=null;const L=LOOK[o.t];
 try{if(L){if(L.clear)clearR(L.clear);restyle(L.wall,L.floor);L.build()}board(o.t)}catch(e){czErr(e,'pubkit.js')}
 const ev=tonight();if(ev&&ev.p===o.t)setTimeout(()=>toast('🍺 TONIGHT: '+ev.n+'! LEAGUE POINTS COUNT DOUBLE.'),1200)}}
{const l0=leaveShop;leaveShop=function(imm){try{G.jukeboxStop&&G.jukeboxStop();if(G.cur)G.cur.close()}catch(e){}return l0(imm)}}
})();
