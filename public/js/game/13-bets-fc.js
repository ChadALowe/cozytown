/* ---- LUCKY BETS: bookmaker with live TVs (horses, greyhounds, football) ---- */
Object.assign(HRS,{'LUCKY BETS':[8,22]});
TH['LUCKY BETS']={wall:0x7a3a3a,fl:'tile',cnt:0x20242c,top:0xc8c8d0,sh:0x5a2a2a};
const BK={T0:1700000000000,CH:[{k:'HORSES',cyc:75,open:42,live:22},{k:'DOGS',cyc:48,open:24,live:14},{k:'FOOTBALL',cyc:120,open:50,live:58}]};
const BKHN=['GOLDEN GRAVY','BLUSHING BERT','SIR TROTSALOT','PINT OF BITTER','FISH SUPPER','MRS PEACOCK','DUSTY ROAD','LIGHTNING LARRY','WELLY BOOT','TEA AND TOAST','NIGHT BUS','HEDGEROW HARRY','TURNIP TOP','LUCKY CLOVER','SUNDAY ROAST','PUDDLE JUMPER','CUSTARD CREAM','OLD TOM'],
 BKDN=['CRUMB','BISCUIT','ROCKET RON','SPARKY','WAFFLE','MUDLARK','FLAPJACK','SHADOW','POPPY','TOASTY','PICKLE','BANGER','DAISY MAE','NIPPER'],
 BKTM=['VILLAGE ROVERS','RIVERSIDE UNITED','HIGH ST ATHLETIC','MILL ROAD CITY','THE GREEN FC','STATION TOWN','ORCHARD WANDERERS','CHURCH LANE VILLA','OAK END','BRIDGE ALBION'],
 BKCOL=['#d02020','#2050d0','#e8d020','#20a040','#f08020','#a040c0'],BKDC=['#d02020','#2050d0','#f4f4f4','#222','#f08020','#999'],
 BKFR=[[1,5],[1,4],[1,3],[4,9],[1,2],[4,6],[4,5],[1,1],[6,5],[5,4],[11,8],[6,4],[7,4],[2,1],[9,4],[5,2],[3,1],[7,2],[4,1],[9,2],[5,1],[6,1],[7,1],[8,1],[10,1],[12,1],[16,1],[20,1],[25,1],[33,1]];
function bkRng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function bkSnap(d){let b=BKFR[0],bd=9;for(const f of BKFR){const e=Math.abs(1+f[0]/f[1]-d);if(e<bd){bd=e;b=f}}return b}
function bkFrS(f){return f[0]===1&&f[1]===1?'EVENS':f[0]+'/'+f[1]}
function bkDec(f){return 1+f[0]/f[1]}
const BKE={};
function bkEv(c,n){const k=c+':'+n;if(BKE[k])return BKE[k];const r=bkRng(c*1000003+n*7919+17);let ev;
 if(c<2){const names=(c===0?BKHN:BKDN).slice(),runners=[];for(let i=0;i<6;i++){const j=Math.floor(r()*names.length);runners.push({num:i+1,name:names.splice(j,1)[0],s:.4+r()*1.3,amp:.03,b:1.2+r()*1.4,ph:r()})}
  const w=x=>Math.pow(x.s,1.7),tot=runners.reduce((a,x)=>a+w(x),0);runners.forEach(x=>{x.p=w(x)/tot;x.fr=bkSnap(.89/x.p);x.dec=bkDec(x.fr)});
  const left=runners.slice(),order=[];while(left.length){const T=left.reduce((a,x)=>a+w(x),0);let u=r()*T,j=0;for(;j<left.length;j++){u-=w(left[j]);if(u<=0)break}order.push(left.splice(Math.min(j,left.length-1),1)[0])}
  const lv=BK.CH[c].live;order.forEach((x,i)=>{x.rank=i;x.T=lv*(.78+.032*i)+r()*.2});
  ev={c,n,runners,order,title:c===0?'RACE '+(n%99+1)+' · '+['KEMPTON','ASCOT','AINTREE','EPSOM','NEWBURY'][n%5]:'RACE '+(n%99+1)+' · '+['ROMFORD','HOVE','SHEFFIELD','PERRY BARR'][n%4],sels:runners.map(x=>({lab:'#'+x.num+' '+x.name,fr:x.fr,dec:x.dec,win:o=>o.order[0].num===x.num}))}}
 else{const tm=BKTM.slice(),h=tm.splice(Math.floor(r()*tm.length),1)[0],a=tm.splice(Math.floor(r()*tm.length),1)[0],ah=.8+r()*.9,aa=.8+r()*.9,lh=Math.min(3,1.1*ah*1.15),la=Math.min(3,1.0*aa*.95),pois=(l,k)=>{let p=Math.exp(-l);for(let i=1;i<=k;i++)p*=l/i;return p};
  let pH=0,pD=0,pA=0,pU=0;for(let i=0;i<9;i++)for(let j=0;j<9;j++){const q=pois(lh,i)*pois(la,j);if(i>j)pH+=q;else if(i===j)pD+=q;else pA+=q;if(i+j<=2)pU+=q}
  const ps=(l)=>{let u=r(),k=0,p=Math.exp(-l),s=p;while(u>s&&k<9){k++;p*=l/k;s+=p}return k};const hg=ps(lh),ag=ps(la),goals=[];for(let i=0;i<hg;i++)goals.push({m:1+Math.floor(r()*89),t:0});for(let i=0;i<ag;i++)goals.push({m:1+Math.floor(r()*89),t:1});goals.sort((x,y)=>x.m-y.m);
  const mk=(lab,p,win)=>{const fr=bkSnap(.9/Math.max(.02,p));return{lab,fr,dec:bkDec(fr),win}};
  ev={c,n,h,a,hg,ag,goals,ph1:r()*6,ph2:r()*6,ph3:r()*6,title:h+' v '+a,sels:[mk(h+' WIN',pH,o=>o.hg>o.ag),mk('DRAW',pD,o=>o.hg===o.ag),mk(a+' WIN',pA,o=>o.hg<o.ag),mk('OVER 2.5 GOALS',1-pU,o=>o.hg+o.ag>=3),mk('UNDER 2.5 GOALS',pU,o=>o.hg+o.ag<=2)]}}
 return BKE[k]=ev}
function bkNow(){return(Date.now()-BK.T0)/1000}
function bkSt(c,t){const C=BK.CH[c],n=Math.floor(t/C.cyc),r=t-n*C.cyc;let ph,tl,rem;if(r<C.open){ph=0;tl=r;rem=C.open-r}else if(r<C.open+C.live){ph=1;tl=r-C.open;rem=C.open+C.live-r}else{ph=2;tl=r-C.open-C.live;rem=C.cyc-r}return{c,n,ph,tl,rem,C,ev:bkEv(c,n)}}
function bkProg(x,t){if(t>=x.T)return 1;const u=t/x.T;return u+x.amp*Math.sin(6.2832*(x.b*u+x.ph))*Math.sin(Math.PI*u)}
function bkClock(s){s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
/* bets */
var BKB={bets:[],st:0,wn:0};try{const d=JSON.parse(localStorage.getItem('c1bets')||'null');if(d&&d.bets)BKB=d}catch(e){czErr(e,"13-bets-fc.js")}
function bkSave(){try{localStorage.setItem('c1bets',JSON.stringify(BKB))}catch(e){czErr(e,"13-bets-fc.js")}}
function bkDone(b){const C=BK.CH[b.c];return bkNow()>=b.n*C.cyc+C.open+C.live}
function bkWon(b){const ev=bkEv(b.c,b.n);return ev.sels[b.sel].win(b.c<2?ev:ev)}
function bkDue(){let s=0;for(const b of BKB.bets)if(!b.paid&&bkDone(b)&&bkWon(b))s+=b.stake*b.dec;return Math.round(s*100)/100}
function bkCollect(q){let s=0,nw=0;for(const b of BKB.bets)if(!b.paid&&bkDone(b)){b.paid=1;if(bkWon(b)){s+=b.stake*b.dec;nw++;BKB.wn+=b.stake*b.dec}}
 s=Math.round(s*100)/100;if(s>0){cash+=s;if(!q){toast('COLLECTED £'+s.toFixed(2));beep(880,.1,'square',.06);setTimeout(()=>beep(1320,.16,'square',.06),100)}}
 BKB.bets=BKB.bets.filter((b,i,a)=>!b.paid||i>=a.length-12);bkSave();return s}
/* TV drawing */
function bkTvRace(g,w,h,st,k){const ev=st.ev,C=st.C,dog=st.c===1,top=34*k,bot=h-30*k,lh=(bot-top)/6,x0=44*k,x1=w-24*k;
 g.fillStyle=dog?'#3a2a14':'#1e5a28';g.fillRect(0,top,w,bot-top);
 for(let i=0;i<6;i++){g.fillStyle=i%2?'rgba(255,255,255,.06)':'rgba(0,0,0,.1)';g.fillRect(0,top+i*lh,w,lh)}
 g.fillStyle='#f4f4f4';for(let i=0;i<14;i++){g.fillStyle=i%2?'#111':'#f4f4f4';g.fillRect(x1,top+i*(bot-top)/14,5*k,(bot-top)/14)}
 const rs=ev.runners;let lead=rs[0],lp=-1;
 for(let i=0;i<6;i++){const x=rs[i],y=top+i*lh+lh/2;let p=st.ph===0?0:st.ph===1?bkProg(x,st.tl):1-x.rank*.035;if(p>lp){lp=p;lead=x}
  const px=x0+(x1-x0-12*k)*p,col=dog?BKDC[i]:BKCOL[i];g.fillStyle='#fff';g.font='bold '+(11*k)+'px monospace';g.textAlign='left';g.fillText(x.num,8*k,y+4*k);
  if(dog){g.fillStyle='#8a6a40';g.fillRect(px,y-3*k,13*k,6*k);g.fillStyle=col;g.fillRect(px+3*k,y-4*k,6*k,8*k);g.fillStyle='#8a6a40';g.fillRect(px+12*k,y-2*k,5*k,3*k)}
  else{g.fillStyle='#6a3a16';g.beginPath();g.ellipse(px+8*k,y,9*k,4.5*k,0,0,7);g.fill();g.fillRect(px+13*k,y-7*k,4*k,7*k);g.fillStyle=col;g.fillRect(px+4*k,y-7*k,6*k,7*k);g.fillStyle='#f0d0a0';g.fillRect(px+5*k,y-10*k,4*k,3*k)}
  if(st.ph===0){g.fillStyle='#ffd840';g.textAlign='right';g.font='bold '+(11*k)+'px monospace';g.fillText(bkFrS(x.fr),w-8*k,y+4*k);g.textAlign='left'}}
 g.fillStyle='#10203a';g.fillRect(0,0,w,top-2*k);g.fillStyle='#ffd840';g.font='bold '+(14*k)+'px monospace';g.fillText((dog?'GREYHOUNDS · ':'HORSES · ')+ev.title,8*k,22*k);
 if(st.ph===1){g.fillStyle='#e02020';g.beginPath();g.arc(w-60*k,17*k,5*k,0,7);g.fill();g.fillStyle='#fff';g.fillText('LIVE',w-52*k,22*k)}
 g.fillStyle='#000';g.fillRect(0,bot,w,h-bot);g.fillStyle='#fff';g.font='bold '+(13*k)+'px monospace';
 let tx;if(st.ph===0)tx='OFF IN '+bkClock(st.rem)+' · BETS OPEN';else if(st.ph===1)tx=st.tl>C.live*.8?'COMING TO THE LINE... '+lead.name:lead.name+' LEADS';else tx='RESULT: '+ev.order[0].name+' WINS';g.fillText(tx,8*k,h-10*k);
 if(st.ph===2){g.fillStyle='rgba(0,0,0,.72)';g.fillRect(w*.2,top+6*k,w*.6,lh*4.2);g.fillStyle='#ffd840';g.font='bold '+(13*k)+'px monospace';g.fillText('FINAL RESULT',w*.2+10*k,top+24*k);g.fillStyle='#fff';[0,1,2].forEach(i=>{const x=ev.order[i];g.fillText((i+1)+'. #'+x.num+' '+x.name+'  '+bkFrS(x.fr),w*.2+10*k,top+44*k+i*(18*k))})}}
function bkScore(ev,tl,live){const m=Math.min(90,tl/live*90);let h=0,a=0;for(const q of ev.goals)if(q.m<=m){if(q.t===0)h++;else a++}return{m,h,a}}
function bkTvFoot(g,w,h,st,k){const ev=st.ev,C=st.C,px=10*k,py=44*k,pw=w-20*k,ph=h-py-12*k;
 g.fillStyle='#10203a';g.fillRect(0,0,w,h);g.fillStyle='#2a8a3a';g.fillRect(px,py,pw,ph);for(let i=0;i<8;i++){g.fillStyle=i%2?'rgba(0,0,0,.08)':'rgba(255,255,255,.05)';g.fillRect(px+i*pw/8,py,pw/8,ph)}
 g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=1.5*k;g.strokeRect(px,py,pw,ph);g.beginPath();g.moveTo(px+pw/2,py);g.lineTo(px+pw/2,py+ph);g.stroke();g.beginPath();g.arc(px+pw/2,py+ph/2,ph*.15,0,7);g.stroke();g.strokeRect(px,py+ph*.22,pw*.14,ph*.56);g.strokeRect(px+pw*.86,py+ph*.22,pw*.14,ph*.56);
 const sc=st.ph===0?{m:0,h:0,a:0}:st.ph===1?bkScore(ev,st.tl,C.live):{m:90,h:ev.hg,a:ev.ag};
 let bx=.5+.33*Math.sin(st.tl*.8+ev.ph1)*Math.cos(st.tl*.31+ev.ph2),by=.5+.3*Math.sin(st.tl*1.1+ev.ph3),flash='';
 if(st.ph===1)for(const q of ev.goals){const gt=q.m/90*C.live;if(st.tl>=gt&&st.tl<gt+2.6){bx=q.t===0?.97:.03;by=.5;flash=(q.t===0?ev.h:ev.a)+' SCORE!'}}
 const dots=(team,col)=>{g.fillStyle=col;for(let i=0;i<10;i++){const fx=team===0?[.08,.2,.2,.2,.2,.4,.4,.4,.4,.55][i]:[.92,.8,.8,.8,.8,.6,.6,.6,.6,.45][i],fy=[.5,.2,.4,.6,.8,.2,.4,.6,.8,.5][i],x=fx+(bx-fx)*.22,y=fy+(by-fy)*.18;g.beginPath();g.arc(px+pw*x,py+ph*y,3*k,0,7);g.fill()}g.fillStyle=col;g.beginPath();g.arc(px+pw*(team===0?.02:.98),py+ph*.5,3*k,0,7);g.fill()};
 if(st.ph>0){dots(0,'#e03030');dots(1,'#3060e0');g.fillStyle='#fff';g.beginPath();g.arc(px+pw*bx,py+ph*by,3.6*k,0,7);g.fill()}
 g.fillStyle='#fff';g.font='bold '+(13*k)+'px monospace';g.textAlign='left';g.fillText(ev.h,8*k,20*k);g.textAlign='right';g.fillText(ev.a,w-8*k,20*k);g.textAlign='center';g.font='bold '+(22*k)+'px monospace';g.fillStyle='#ffd840';g.fillText(sc.h+' - '+sc.a,w/2,30*k);
 g.font='bold '+(12*k)+'px monospace';g.fillStyle='#9fe';g.fillText(st.ph===0?'KICK-OFF IN '+bkClock(st.rem):st.ph===1?Math.floor(sc.m)+"'":'FULL TIME',w/2,14*k);
 if(st.ph===1){g.fillStyle='#e02020';g.beginPath();g.arc(w-24*k,34*k,4*k,0,7);g.fill();g.fillStyle='#fff';g.textAlign='right';g.font='bold '+(10*k)+'px monospace';g.fillText('LIVE',w-30*k,38*k)}
 if(st.ph===0){g.fillStyle='rgba(0,0,0,.6)';g.fillRect(px,py+ph*.62,pw,ph*.38);g.fillStyle='#ffd840';g.textAlign='center';g.font='bold '+(12*k)+'px monospace';g.fillText('HOME '+bkFrS(ev.sels[0].fr)+'   DRAW '+bkFrS(ev.sels[1].fr)+'   AWAY '+bkFrS(ev.sels[2].fr),w/2,py+ph*.78);g.fillText('OVER 2.5  '+bkFrS(ev.sels[3].fr)+'   UNDER  '+bkFrS(ev.sels[4].fr),w/2,py+ph*.93)}
 if(flash){g.fillStyle='rgba(0,0,0,.55)';g.fillRect(px,py+ph*.35,pw,ph*.3);g.fillStyle='#ffd840';g.font='bold '+(22*k)+'px monospace';g.textAlign='center';g.fillText('GOAL! '+flash,w/2,py+ph*.56)}
 g.textAlign='left'}
function bkTvDraw(tv){const st=bkSt(tv.c,bkNow()),g=tv.g,w=tv.cv.width,h=tv.cv.height,k=w/384;g.textAlign='left';g.fillStyle='#0a0f18';g.fillRect(0,0,w,h);if(tv.c<2)bkTvRace(g,w,h,st,k);else bkTvFoot(g,w,h,st,k);tv.tx.needsUpdate=true;return st}
/* interior */
var BKTV=null,BKTT=0;
const BKTVX=[-4.3,4.3,0];
function buildBets(o){IA.splice(0,IA.length,LEAVE_IA());IROOM.splice(0,IROOM.length,[-9,9,-4.2,-2.9],[5.4,6.5,-1.6,1.6],[-6.4,-5.0,1.1,1.8]);
 BKTV=[0,1,2].map(c=>{const big=c===2,tw=big?2.3:1.7,th=big?1.3:.96,x=BKTVX[c],y=big?.85:1.0,f=big?cvT(768,432):cvT(640,360),g=f.cv.getContext('2d');
  gbox(SG,x,y-.06,-RZ+.04,tw+.12,th+.12,.06,0x111114);const m=new THREE.Mesh(new THREE.PlaneGeometry(tw,th),new THREE.MeshBasicMaterial({map:f.tx,fog:false}));m.position.set(x,y+th/2-.06+.06,-RZ+.08);SG.add(m);
  sPlane(1.5,.26,x,y-.28,-RZ+.04,0,txtTex(256,44,'#20242c','#ffe040',BK.CH[c].k==='FOOTBALL'?'LIVE FOOTBALL':BK.CH[c].k==='HORSES'?'HORSE RACING':'GREYHOUND RACING',24));return{c,cv:f.cv,g,tx:f.tx,mesh:m,tw,th,x,y}});
 BKTV.forEach(bkTvDraw);
 // counter + cashier
 gbox(SG,5.9,0,0,.8,1.0,3.2,0x20242c);gbox(SG,5.9,1.0,0,.9,.06,3.3,0xc8c8d0);gbox(SG,5.6,1.06,-.5,.3,.3,.3,0x181c24);gbox(SG,5.6,1.06,.6,.3,.3,.3,0x181c24);
 window.SHK=personIn(pSpec(9801,{f:true,gl:true,scarf:null,bp:false,bag:0,old:false,tc:[.75,.15,.18],hs:2}),6.7,0,-Math.PI/2);
 gbox(SG,6.95,.6,-1.2,.04,1.6,1.4,0x3a3030);
 // slip desks and terminal
 for(const z of[-1.2,0.4]){gbox(SG,-6.7,0,z,.6,1.05,1.0,0x5a4a3a);gbox(SG,-6.7,1.05,z,.7,.05,1.1,0xd8d0c0);for(let j=0;j<3;j++)gbox(SG,-6.6,1.1,z-.3+j*.3,.2,.01,.14,0xf4f4ee)}
 gbox(SG,-5.7,0,1.45,.5,1.3,.4,0x303038);gbox(SG,-5.7,1.0,1.28,.46,.32,.04,0x20a0e0);gbox(SG,-5.7,.8,1.28,.4,.06,.1,0xffd040);
 // posters
 sPlane(1.1,.8,-7.15,1.6,-2.0,Math.PI/2,txtTex(256,192,'#f4e8c0','#802020',"TODAY'S RACING",26));sPlane(1.1,.8,7.15,1.6,-2.2,-Math.PI/2,txtTex(256,192,'#20204a','#ffe040','BET RESPONSIBLY',24));
 for(const sx of[-2.4,2.4]){gbox(SG,sx,0,-1.8,1.2,.45,.4,0x30343c)}
 IA.push({r:[4.2,5.5,-1.5,1.5],label:()=>'BET AT THE COUNTER'+(bkDue()>0?' · COLLECT £'+bkDue().toFixed(2):''),fn:()=>bkOpen(0)},{r:[-6.3,-4.7,.7,2.2],label:'BETTING TERMINAL',fn:()=>bkOpen(0)},{r:[-3.6,3.6,-2.6,-.9],label:'WATCH LIVE ON THE TELLY',fn:()=>bkWatch(2)});
 IROOM.push([-3.0,-1.8,-2.0,-1.6],[1.8,3.0,-2.0,-1.6])}
CUSTB['LUCKY BETS']={rx:7.2,fn:buildBets};
{const u0=updCozy;updCozy=function(dt){u0(dt);if(GS.inside&&SHOPCUR&&SHOPCUR.o.t==='LUCKY BETS'&&BKTV){BKTT+=dt;if(BKTT>.09){BKTT=0;for(const tv of BKTV)bkTvDraw(tv)}}}}
{const b0=buildShop;buildShop=function(o){BKTV=null;b0(o);if(o.t==='LUCKY BETS'){const s=bkCollect(1);if(s>0)setTimeout(()=>{toast('WINNINGS COLLECTED £'+s.toFixed(2))},900)}}}
/* ---- betting panel ---- */
var BKP=null;
function bkCss(){return'#bkov{position:fixed;inset:0;z-index:62;background:rgba(5,8,20,.72);display:flex;align-items:center;justify-content:center;font:bold 13px ui-monospace,Menlo,monospace;color:#fff}#bkc{width:min(94vw,520px);max-height:94vh;background:#10162c;border:3px solid #fff;box-shadow:5px 5px 0 #000;border-radius:10px;padding:8px;display:flex;flex-direction:column}#bkc button{font:800 13px ui-monospace,monospace;color:#fff;background:#223;border:2px solid #667;border-radius:7px;padding:8px 9px}#bkc button.on{background:#d9a21a;color:#111;border-color:#fff}#bkc button:disabled{opacity:.4}.bkt{display:flex;gap:4px;margin:6px 0}.bkt button{flex:1;padding:8px 2px!important}#bkb{overflow-y:auto;flex:1;-webkit-overflow-scrolling:touch}.bkr{display:flex;justify-content:space-between;align-items:center;padding:8px 8px;margin:3px 0;background:#1a2244;border:2px solid #334;border-radius:7px}.bkr.on{border-color:#ffd840;background:#2a3060}.bkr i{display:inline-block;width:11px;height:11px;border-radius:6px;margin-right:6px;border:1px solid #fff}.bkd{display:flex;gap:6px;margin-top:6px}.bkd button{flex:1}'}
function bkOpen(ch){if(BKP||(busy&&!menuOpen))return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;const s=bkCollect(0);
 const ov=document.createElement('div');ov.id='bkov';ov.innerHTML='<style>'+bkCss()+'</style><div id="bkc"></div>';document.body.appendChild(ov);
 BKP={ov,tab:ch||0,sel:null,stake:2,n:-1,tick:setInterval(bkTick,500)};ov.addEventListener('pointerdown',e=>{if(e.target===ov)bkClose()});bkRender()}
function bkClose(){if(!BKP)return;clearInterval(BKP.tick);BKP.ov.remove();BKP=null;busy=0}
function bkRender(){const P=BKP;if(!P)return;const c=document.getElementById('bkc'),t=P.tab,tabs=['HORSES','DOGS','FOOTBALL','MY BETS'];
 let h='<div style="display:flex;justify-content:space-between;align-items:center"><div style="color:#ffd840;font-size:15px">LUCKY BETS</div><div id="bkCash">£'+cash.toFixed(2)+'</div></div><div class="bkt">'+tabs.map((x,i)=>'<button data-t="'+i+'" class="'+(t===i?'on':'')+'">'+x+'</button>').join('')+'</div><div id="bkb">';
 if(t<3){const st=bkSt(t,bkNow());P.n=st.n;h+='<div style="margin:2px 0 6px"><div style="color:#9fe">'+st.ev.title+'</div><div id="bkSt" style="color:#ffd840"></div></div>';
  st.ev.sels.forEach((s,i)=>{h+='<div class="bkr'+(P.sel===i?' on':'')+'" data-s="'+i+'"><span>'+(t<2?'<i style="background:'+(t===0?BKCOL:BKDC)[i]+'"></i>':'')+s.lab+'</span><span style="color:#ffd840">'+bkFrS(s.fr)+'</span></div>'});
  h+='<div class="bkd" id="bkStk">'+[1,2,5,10,20].map(v=>'<button data-v="'+v+'" class="'+(P.stake===v?'on':'')+'">£'+v+'</button>').join('')+'</div><div class="bkd"><button id="bkGo" style="background:#1f8a3a"></button><button id="bkW">WATCH LIVE</button></div>'}
 else{const bs=BKB.bets.slice().reverse(),due=bkDue();h+='<div style="color:#9fe;margin:4px 0">STAKED £'+BKB.st.toFixed(2)+' · WON £'+BKB.wn.toFixed(2)+'</div>';
  if(!bs.length)h+='<div class="bkr">NO BETS YET</div>';
  for(const b of bs){const ev=bkEv(b.c,b.n),d=bkDone(b),w=d&&bkWon(b);h+='<div class="bkr"><span>'+BK.CH[b.c].k+' · '+ev.sels[b.sel].lab+'<br><small style="color:#aab">£'+b.stake+' @ '+bkFrS(ev.sels[b.sel].fr)+'</small></span><span style="color:'+(w?'#6fe06f':d?'#e66':'#ffd840')+'">'+(d?(w?'WON £'+(b.stake*b.dec).toFixed(2):'LOST'):'RUNNING')+'</span></div>'}
  h+='<div class="bkd"><button id="bkCol" '+(due>0?'':'disabled')+' style="background:#1f8a3a">COLLECT £'+due.toFixed(2)+'</button></div>'}
 h+='</div><div class="bkd"><button id="bkX" style="background:#7a2a2a">CLOSE</button></div>';c.innerHTML=h;
 for(const b of c.querySelectorAll('.bkt button'))b.onclick=()=>{P.tab=+b.dataset.t;P.sel=null;bkRender()};
 for(const r of c.querySelectorAll('.bkr[data-s]'))r.onclick=()=>{P.sel=+r.dataset.s;bkRender()};
 for(const b of c.querySelectorAll('#bkStk button'))b.onclick=()=>{P.stake=+b.dataset.v;bkRender()};
 const go=document.getElementById('bkGo');if(go)go.onclick=bkPlace;const wb=document.getElementById('bkW');if(wb)wb.onclick=()=>{const tb=P.tab;bkClose();bkWatch(tb)};
 const cb=document.getElementById('bkCol');if(cb)cb.onclick=()=>{bkCollect(0);bkRender()};document.getElementById('bkX').onclick=bkClose;bkTick()}
function bkTick(){const P=BKP;if(!P)return;const cs=document.getElementById('bkCash');if(cs)cs.textContent='£'+cash.toFixed(2);if(P.tab>=3)return;const st=bkSt(P.tab,bkNow());if(st.n!==P.n){P.sel=null;bkRender();return}
 const e=document.getElementById('bkSt'),go=document.getElementById('bkGo');if(!e)return;const open=st.ph===0&&st.rem>3;e.textContent=st.ph===0?(open?'BETS CLOSE IN '+bkClock(st.rem):'OFF!'):st.ph===1?'● LIVE NOW':'RESULT: '+bkResText(st.ev)+' · NEXT RACE '+bkClock(st.rem);
 if(go){const sel=P.sel!==null?st.ev.sels[P.sel]:null;go.disabled=!open||!sel||cash<P.stake;go.textContent=sel?'PLACE £'+P.stake+' · WINS £'+(P.stake*sel.dec).toFixed(2):'PICK A SELECTION'}}
function bkResText(ev){return ev.c<2?'#'+ev.order[0].num+' '+ev.order[0].name:ev.h+' '+ev.hg+'-'+ev.ag+' '+ev.a}
function bkPlace(){const P=BKP;if(!P||P.sel===null)return;const st=bkSt(P.tab,bkNow());if(!(st.ph===0&&st.rem>3)){toast('BETS CLOSED');return}if(cash<P.stake){toast('NOT ENOUGH CASH');return}
 const s=st.ev.sels[P.sel];cash-=P.stake;BKB.st+=P.stake;BKB.bets.push({c:P.tab,n:st.n,sel:P.sel,stake:P.stake,dec:s.dec,paid:0});bkSave();toast('BET PLACED £'+P.stake+' @ '+bkFrS(s.fr));beep(660,.08,'square',.06);setTimeout(()=>beep(990,.1,'square',.06),80);P.sel=null;bkRender()}
/* ---- watch live ---- */
var BKW=null;
function bkWatch(c){if(BKW||!BKTV)return;if(BKP)bkClose();busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;document.body.classList.add('dz');man.visible=false;
 const ov=document.createElement('div');ov.id='bkw';ov.style.cssText='position:fixed;inset:0;z-index:62;pointer-events:none;font:bold 13px ui-monospace,monospace;color:#fff';
 ov.innerHTML='<div id="bkwT" style="position:absolute;left:0;right:0;top:0;text-align:center;padding:7px 4px 2px;background:rgba(0,0,0,.6);font-size:14px;color:#ffd840"></div><div id="bkwM" style="position:absolute;left:0;right:0;top:30px;text-align:center;padding:2px 4px 6px;background:rgba(0,0,0,.6);font-size:12px;color:#9fe"></div><div style="position:absolute;left:0;right:0;bottom:10px;display:flex;gap:6px;justify-content:center;pointer-events:auto"><button id="bkwL">◀</button><button id="bkwB" style="background:#1f8a3a">BET</button><button id="bkwR">▶</button><button id="bkwX" style="background:#7a2a2a">BACK</button></div><style>#bkw button{font:800 15px ui-monospace,monospace;color:#fff;background:#1c4fa0;border:3px solid #fff;border-radius:8px;box-shadow:3px 3px 0 #000;padding:11px 16px}</style>';
 document.body.appendChild(ov);BKW={ov,c,raf:0};
 document.getElementById('bkwL').onclick=()=>{BKW.c=(BKW.c+2)%3};document.getElementById('bkwR').onclick=()=>{BKW.c=(BKW.c+1)%3};document.getElementById('bkwX').onclick=bkWatchEnd;document.getElementById('bkwB').onclick=()=>{const cc=BKW.c;bkWatchEnd();bkOpen(cc)};
 BKW.kd=e=>{if(e.key==='Escape')bkWatchEnd();else if(e.key==='ArrowLeft')BKW.c=(BKW.c+2)%3;else if(e.key==='ArrowRight')BKW.c=(BKW.c+1)%3};addEventListener('keydown',BKW.kd);
 DZ.fn=bkCam;DZ.fov=46;DZ.tp=bkCam();DZ.look=new THREE.Vector3();DZ.on=1;bkCam();BKW.raf=requestAnimationFrame(bkWLoop)}
function bkCam(){const W=BKW;if(!W)return new THREE.Vector3();const tv=BKTV[W.c],asp=cam.aspect||1.6,d=Math.max(Math.min(4.6,tv.th/(2*.4245*.8)),tv.tw/(2*.4245*asp*.92)),cy=tv.y+tv.th/2;
 if(!W.cp){W.cp=new THREE.Vector3(tv.x,cy,-RZ+d);W.cl=new THREE.Vector3(tv.x,cy,-RZ)}const tp=new THREE.Vector3(tv.x,cy,-RZ+d),tl=new THREE.Vector3(tv.x,cy,-RZ);W.cp.lerp(tp,.12);W.cl.lerp(tl,.12);DZ.look=SG.localToWorld(W.cl.clone());return SG.localToWorld(W.cp.clone())}
function bkWLoop(){const W=BKW;if(!W)return;const st=bkSt(W.c,bkNow()),T=document.getElementById('bkwT'),M=document.getElementById('bkwM');if(T)T.textContent=BK.CH[W.c].k+' · '+st.ev.title;
 if(M){const my=BKB.bets.filter(b=>b.c===W.c&&b.n===st.n).map(b=>st.ev.sels[b.sel].lab+' £'+b.stake);M.textContent=(my.length?'YOUR BETS: '+my.join(' | '):'NO BET ON THIS ONE')}
 W.raf=requestAnimationFrame(bkWLoop)}
function bkWatchEnd(){const W=BKW;if(!W)return;cancelAnimationFrame(W.raf);removeEventListener('keydown',W.kd);W.ov.remove();BKW=null;DZ.fn=null;DZ.fov=46;DZ.on=0;DZ.exit=1;document.body.classList.remove('dz');man.visible=true;busy=0}
/* ---- VILLAGE ROVERS FC: fixtures, ground entrance, fixture board ---- */
Object.assign(HRS,{'VILLAGE ROVERS FC':[0,24]});
TH['VILLAGE ROVERS FC']={wall:0x9a9aa0,fl:'stone',cnt:0x303038,top:0x888890,sh:0x2a2a30};
const FCG={T:470,PRE:150,LIVE:240,POST:80,T0:1700000000000,HOME:'VILLAGE ROVERS'};
function fcNow(){return(Date.now()-FCG.T0)/1000}
const FCF={};

function fcSt(t){const n=Math.floor(t/FCG.T),r=t-n*FCG.T;let ph,tl,rem;if(r<FCG.PRE){ph=0;tl=r;rem=FCG.PRE-r}else if(r<FCG.PRE+FCG.LIVE){ph=1;tl=r-FCG.PRE;rem=FCG.PRE+FCG.LIVE-r}else{ph=2;tl=r-FCG.PRE-FCG.LIVE;rem=FCG.T-r}return{n,ph,tl,rem,fx:fcFix(n)}}
function fcScore(fx,tl){let h=0,a=0;for(const e of fx.ev)if(e.kind==='goal'&&e.te+.8<=tl){if(e.team===0)h++;else a++}return[h,a]}
/* fan progress */
var FAN={xp:0,tk:-1,lv:0};try{const d=JSON.parse(localStorage.getItem('c1fan')||'null');if(d)FAN=Object.assign(FAN,d)}catch(e){czErr(e,"13-bets-fc.js")}
function fanSave(){try{localStorage.setItem('c1fan',JSON.stringify(FAN))}catch(e){czErr(e,"13-bets-fc.js")}}
function fanLevel(){return Math.floor(FAN.xp/100)}
/* clock text */

/* outdoor fixture board next to the ground entrance */
var FBOARD=null;const FCFG=26,FCW=26;
function fcBoardInit(){const o=SHOPD.find(s=>s.t==='VILLAGE ROVERS FC');if(!o)return;const f=cvT(512,288),g=f.cv.getContext('2d');
 const out=[Math.sin(o.psi),Math.cos(o.psi)],rt=[Math.cos(o.psi),-Math.sin(o.psi)],bx=o.x+out[0]*(FCFG-1.6)+rt[0]*(FCW/2+2),bz=o.z+out[1]*(FCFG-1.6)+rt[1]*(FCW/2+2),by=gH(bx,bz);
 const grp=new THREE.Group();grp.position.set(bx,by,bz);grp.rotation.y=o.psi;
 const bm=new THREE.MeshBasicMaterial({color:0x2a1a10}),pm=new THREE.MeshBasicMaterial({color:0x14120e});
 for(const sx of[-1,1]){const p=new THREE.Mesh(new THREE.BoxGeometry(.12,2.6,.12),bm);p.position.set(sx*1.3,1.3,0);grp.add(p)}
 const fr=new THREE.Mesh(new THREE.BoxGeometry(2.9,1.75,.1),pm);fr.position.set(0,2.0,-.02);grp.add(fr);
 const sc=new THREE.Mesh(new THREE.PlaneGeometry(2.7,1.52),new THREE.MeshBasicMaterial({map:f.tx,fog:false}));sc.position.set(0,2.0,.05);grp.add(sc);
 scene.add(grp);FBOARD={g,cv:f.cv,tx:f.tx,o,grp,t:0,key:''};try{fcExt(o)}catch(e){console.error('fcExt',e.message)}}
function fcExt(o){const grp=new THREE.Group(),out=[Math.sin(o.psi),Math.cos(o.psi)];grp.position.set(o.x,gH(o.x,o.z),o.z);grp.rotation.y=o.psi;
 const MC={},mb=(x,y,z,w,h,d,hex,rx)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),MC[hex]||(MC[hex]=new THREE.MeshBasicMaterial({color:hex})));m.position.set(x,y+h/2,z);if(rx)m.rotation.x=rx;grp.add(m);return m};
 const bl=BLD.reduce((a,b)=>Math.hypot(b.x-o.x,b.z-o.z)<Math.hypot(a.x-o.x,a.z-o.z)?b:a),rt=[Math.cos(o.psi),-Math.sin(o.psi)],CX=(bl.x-o.x)*rt[0]+(bl.z-o.z)*rt[1],BW=bl.w;
 // banner band with club name and crest
 {const f=cvT(1024,96),g=f.cv.getContext('2d');g.fillStyle='#a01418';g.fillRect(0,0,1024,96);g.fillStyle='#fff';g.fillRect(0,0,1024,6);g.fillRect(0,90,1024,6);g.font='bold 52px Georgia,serif';g.textAlign='center';g.textBaseline='middle';g.fillText('VILLAGE ROVERS FOOTBALL CLUB',512,50);const m=new THREE.Mesh(new THREE.PlaneGeometry(Math.min(BW-1,17),1.6),new THREE.MeshBasicMaterial({map:f.tx}));m.position.set(CX,7.4,.9);grp.add(m)}
 {const f=cvT(128,160),g=f.cv.getContext('2d');g.fillStyle='#a01418';g.beginPath();g.moveTo(6,6);g.lineTo(122,6);g.lineTo(122,90);g.quadraticCurveTo(64,170,6,90);g.closePath();g.fill();g.strokeStyle='#fff';g.lineWidth=6;g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(64,66,28,0,7);g.fill();g.fillStyle='#10301c';g.beginPath();g.arc(64,66,22,0,7);g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.moveTo(42,66);g.lineTo(86,66);g.stroke();g.fillStyle='#ffd840';g.font='bold 15px Georgia';g.textAlign='center';g.fillText('ROVERS',64,124);const m=new THREE.Mesh(new THREE.PlaneGeometry(2.4,3),new THREE.MeshBasicMaterial({map:f.tx,transparent:true}));m.position.set(CX,4.6,1.0);grp.add(m)}
 // flat roof edge + parapet
 mb(CX,8.6,-4.5,BW+1.4,.5,10.4,0x44464e);mb(CX,9.1,.45,BW+1.4,.7,.4,0xa01418);
 // seating stand rising behind
 const rows=7,st=new THREE.MeshBasicMaterial({map:(()=>{const f=cvT(64,16),g=f.cv.getContext('2d');g.fillStyle='#8a1418';g.fillRect(0,0,64,16);for(let i=0;i<40;i++){g.fillStyle=['#e8e8e8','#a01418','#555','#d83030'][i%4];g.fillRect(Math.random()*62,Math.random()*14,3,3)}f.tx.magFilter=THREE.NearestFilter;return f.tx})()});
 for(let i=0;i<rows;i++){const y=9+i*1.5,z=-9-i*2.4;const m=new THREE.Mesh(new THREE.BoxGeometry(BW+6,1.5,2.4),st);m.position.set(CX,y+.75,z-1.2);grp.add(m);mb(CX,0,z-1.2,BW+6,y,2.4,0x6a6a72)}
 mb(CX-BW/2-3.2,0,-17,.4,19.5,18,0x5a5a62);mb(CX+BW/2+3.2,0,-17,.4,19.5,18,0x5a5a62);
 // cantilever roof over the stand
 mb(CX,19.2,-19,BW+7,.45,14,0x30343c,-.12);mb(CX,19.6,-12.2,BW+7,.4,.5,0xa01418);
 for(const sx of[-BW/2-2.5,BW/2+2.5,-BW/4,BW/4])mb(CX+sx,9,-9.5,.6,10.5,.6,0x707078);
 // floodlight pylons
 const lamp=(()=>{const f=cvT(64,32),g=f.cv.getContext('2d');g.fillStyle='#222';g.fillRect(0,0,64,32);for(let x=0;x<8;x++)for(let y=0;y<4;y++){g.fillStyle='#fffbe0';g.fillRect(x*8+1,y*8+1,6,6)}f.tx.magFilter=THREE.NearestFilter;return f.tx})();
 for(const[sx,sz]of[[-BW/2-8,-3],[BW/2+8,-3],[-BW/2-8,-24],[BW/2+8,-24]]){mb(CX+sx,0,sz,.7,25,.7,0x808088);const h=new THREE.Mesh(new THREE.BoxGeometry(5,2.6,.4),new THREE.MeshBasicMaterial({map:lamp}));h.position.set(CX+sx,26.5,sz);h.rotation.x=-.2;grp.add(h);mb(CX+sx,25,sz,1,1.5,1,0x606068)}
 // turnstile fence & gate in front
 for(let i=0;i<9;i++){const x=CX-BW/2+1+i*(BW-2)/8;if(Math.abs(x-CX)<1.4)continue;mb(x,0,3.2,.12,1.7,.12,0x202028)}
 for(const sg of[-1,1]){const L=BW/2-1.4,cx=CX+sg*(1.4+L/2);mb(cx,1.5,3.2,L,.12,.1,0x202028);mb(cx,.5,3.2,L,.08,.1,0x202028)}
 for(const sx of[-1.1,1.1]){mb(CX+sx,0,3.2,.5,1.1,.7,0x606068);mb(CX+sx,1.1,3.2,.6,.12,.8,0xa01418);for(let k=0;k<3;k++){const b=mb(CX+sx,1.25+k*.0,3.2,.04,.04,.9,0xc0c0c8);b.rotation.y=0}}
 // flags
 for(const sx of[-BW/2+1,BW/2-1]){mb(CX+sx,0,2.2,.1,10.8,.1,0xd8d8d8);mb(CX+sx+.9,9.4,2.2,1.7,1.0,.04,sx<0?0xa01418:0xf2f2f2)}
 fcPark(grp,mb,CX,BW);bakeGroup(grp);scene.add(grp);return grp}
function fcPark(grp,mb,CX,BW){fcPark.M=fcPark.M||{};const L=FCFG,PW2=BW+14,f=cvT(512,512),g=f.cv.getContext('2d');g.fillStyle='#3c3c42';g.fillRect(0,0,512,512);for(let i=0;i<4000;i++){g.fillStyle=i%2?'#46464c':'#34343a';g.fillRect(Math.random()*512,Math.random()*512,2,2)}g.strokeStyle='#e8e8e8';g.lineWidth=3;
 for(const y of[40,330]){for(let x=16;x<=496;x+=32){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+100);g.stroke()}g.beginPath();g.moveTo(16,y);g.lineTo(496,y);g.stroke()}g.fillStyle='#e8d040';for(let x=40;x<480;x+=60)g.fillRect(x,250,30,5);f.tx.wrapS=f.tx.wrapT=THREE.RepeatWrapping;f.tx.magFilter=THREE.NearestFilter;f.tx.needsUpdate=true;
 const m=new THREE.Mesh(new THREE.PlaneGeometry(PW2,L-3).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:f.tx,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));m.position.set(CX,.07,3+(L-3)/2);grp.add(m);
 // kerbs and hedge edge
 mb(CX-PW2/2,0,3+(L-3)/2,.4,.25,L-3,0xb0b0b0);mb(CX+PW2/2,0,3+(L-3)/2,.4,.25,L-3,0xb0b0b0);
 // cars in bays
 const cols=[0xc02020,0x2050b0,0xe0e0e0,0x202020,0xd8c020,0x20804a,0x808890,0xe07020,0x6a2a7a],cx0=CX-PW2/2+2;let k=0;
 const car=(x,z,ry,c)=>{const G=new THREE.Group();const b=(xx,yy,zz,w,h,d,hex)=>{const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),fcPark.M[hex]||(fcPark.M[hex]=new THREE.MeshBasicMaterial({color:hex})));q.position.set(xx,yy+h/2,zz);G.add(q)};b(0,.3,0,1.75,.65,4,c);b(0,.9,-.1,1.55,.55,2.2,0x9ab8cc);b(0,.35,1.98,1.6,.25,.05,0xf0f0d0);for(const sx of[-.9,.9])for(const sz of[-1.3,1.3])b(sx,.05,sz,.2,.55,.55,0x151515);G.position.set(x,.07,z);G.rotation.y=ry;grp.add(G)};
 const rnd2=(()=>{let s=77;return()=>(s=(s*16807)%2147483647)/2147483647})();
 const GW=(lx,lz)=>{const c=Math.cos(grp.rotation.y),sn=Math.sin(grp.rotation.y);return[grp.position.x+lx*c+lz*sn,grp.position.z-lx*sn+lz*c]};
 for(const yc of[90,380]){const zz=3+yc/512*(L-3);for(let i=0;i<15;i++){const xx=CX-PW2/2+(16+32*(i+.5))/512*PW2;if(rnd2()<.62){car(xx,zz,rnd2()<.5?0:Math.PI,cols[Math.floor(rnd2()*cols.length)]);for(const dz of[-1.25,1.25]){const w=GW(xx,zz+dz);COL.push([w[0],w[1],1.15])}}}}
 // coach, parked across the middle aisle
 {const cxx=CX+PW2/2-10,czz=3+235/512*(L-3);mb(cxx,.4,czz,12,3.2,3.2,0xf0f0f0);mb(cxx,.4+2.0,czz,10,.9,3.25,0x30404a);mb(cxx,1.0,czz,12.05,.5,3.25,0xa01418);for(const dx of[-4.5,-2.25,0,2.25,4.5]){const w=GW(cxx+dx,czz);COL.push([w[0],w[1],1.9])}}
 // lamp posts
 for(const x of[-PW2/2+1,0,PW2/2-1])for(const z of[8,L-6]){mb(CX+x,0,z,.2,6,.2,0x505058);mb(CX+x,6,z,1.4,.25,.5,0xfff0c0)}
 // entrance sign
 {const t=cvT(256,64),c=t.cv.getContext('2d');c.fillStyle='#14141a';c.fillRect(0,0,256,64);c.fillStyle='#ffd840';c.font='bold 22px monospace';c.textAlign='center';c.fillText('MATCHDAY PARKING',128,28);c.fillStyle='#fff';c.font='bold 18px monospace';c.fillText('FREE · ROVERS FANS',128,52);const q=new THREE.Mesh(new THREE.PlaneGeometry(3.6,.9),new THREE.MeshBasicMaterial({map:t.tx}));q.position.set(CX-PW2/2+2,3.3,L-1);grp.add(q);mb(CX-PW2/2+.6,0,L-1,.15,3,.15,0x505058);mb(CX-PW2/2+3.4,0,L-1,.15,3,.15,0x505058)}}
function fcBoardDraw(){const B=FBOARD;if(!B)return;const st=fcSt(fcNow()),fx=st.fx,g=B.g,w=512,h=288;const sec=Math.floor(st.rem);const key=st.n+':'+st.ph+':'+sec+':'+Math.floor(st.tl/ (st.ph===1?3:99));if(key===B.key)return;B.key=key;
 g.fillStyle='#10301c';g.fillRect(0,0,w,h);g.strokeStyle='#e8d890';g.lineWidth=5;g.strokeRect(6,6,w-12,h-12);g.fillStyle='#e8d890';g.font='bold 24px Georgia,serif';g.textAlign='center';g.fillText('VILLAGE ROVERS F.C.',w/2,42);g.font='bold 15px monospace';g.fillStyle='#a8d0b0';g.fillText('THE RECREATION GROUND · TURNSTILES OPEN',w/2,64);
 g.fillStyle='#fff';g.font='bold 30px monospace';g.fillText('ROVERS',w/2-110,128);g.fillText(fx.opp.length>14?fx.opp.slice(0,14):fx.opp,w/2+100,128);g.font='bold 22px monospace';g.fillStyle='#e8d890';g.fillText('v',w/2,126);
 let l1,l2,col='#ffd840';
 if(st.ph===0){l1='KICK-OFF IN '+bkClock(st.rem);l2='TICKETS FROM £3 · GATES OPEN'}else if(st.ph===1){const s=fcScore(fx,st.tl);l1='LIVE  '+s[0]+' - '+s[1]+'   '+fcMin(st)+"'";l2='COME ON YOU ROVERS!';col='#ff7070'}else{l1='FULL TIME  '+fx.hg+' - '+fx.ag;l2='NEXT MATCH IN '+bkClock(st.rem);col='#9fe'}
 g.fillStyle=col;g.font='bold 40px monospace';g.fillText(l1,w/2,196);g.fillStyle='#cde';g.font='bold 18px monospace';g.fillText(l2,w/2,238);B.tx.needsUpdate=true}
{const u0=updCozy;updCozy=function(dt){u0(dt);if(!FBOARD&&typeof SHOPD!=='undefined')try{fcBoardInit()}catch(e){czErr(e,"13-bets-fc.js")}if(FBOARD&&!GS.inside){FBOARD.t-=dt;if(FBOARD.t<=0){FBOARD.t=.5;if(Math.hypot(P.x-FBOARD.grp.position.x,P.z-FBOARD.grp.position.z)<90&&GS.onFoot||Math.hypot(GS.x-FBOARD.grp.position.x,GS.z-FBOARD.grp.position.z)<90)fcBoardDraw()}}}}
CUSTB['VILLAGE ROVERS FC']={rx:26,fn:o=>buildGround(o)};
/* ---- stadium geometry, crowd, match visuals ---- */
const FL=56,FW=34,FCZ=-35,FHL=28,FHW=17;
const FSLOT=[[.02,.5],[.2,.14],[.2,.38],[.2,.62],[.2,.86],[.4,.14],[.4,.38],[.4,.62],[.4,.86],[.58,.34],[.58,.66]];
var FCV=null;
function fcSky(){const c=document.createElement('canvas');c.width=4;c.height=256;const g=c.getContext('2d'),T=[['#2a6ec0','#9cc8f0','#cfe4f4'],['#3a2a5a','#d86a3a','#f0c08a'],['#04061a','#101a3a','#26305a']][Math.min(2,todI||0)],gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,T[0]);gr.addColorStop(.6,T[1]);gr.addColorStop(1,T[2]);g.fillStyle=gr;g.fillRect(0,0,4,256);const tx=new THREE.CanvasTexture(c);return tx}
function fcPitchTex(){const W=1120,H=680,f=cvT(W,H),g=f.cv.getContext('2d');for(let i=0;i<14;i++){g.fillStyle=i%2?'#2f8a3a':'#37963f';g.fillRect(i*W/14,0,W/14+1,H)}
 g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=5;const X=x=>(x+FHL)/FL*W,Z=z=>(z+FHW)/FW*H;g.strokeRect(X(-FHL)+3,3,W-6,H-6);g.beginPath();g.moveTo(X(0),0);g.lineTo(X(0),H);g.stroke();g.beginPath();g.arc(X(0),Z(0),5*W/FL,0,7);g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(X(0),Z(0),6,0,7);g.fill();
 for(const s of[-1,1]){const bx=s<0?X(-FHL):X(FHL-9),by=Z(-10),bw=9*W/FL,bh=20*H/FW;g.strokeRect(bx+(s<0?2:-2),by,bw,bh);const sx=s<0?X(-FHL):X(FHL-3.4);g.strokeRect(sx+(s<0?2:-2),Z(-4.6),3.4*W/FL,9.2*H/FW);g.beginPath();g.arc(s<0?X(-FHL+6.5):X(FHL-6.5),Z(0),3.4*W/FL,s<0?-.9:Math.PI-.9,s<0?.9:Math.PI+.9);g.stroke();g.beginPath();g.arc(s<0?X(-FHL+6.5):X(FHL-6.5),Z(0),5,0,7);g.fill()}
 f.tx.anisotropy=4;return f.tx}
function fcAdTex(){const f=cvT(2048,64),g=f.cv.getContext('2d'),A=[['LUCKY BETS','#b01020','#ffe040'],["MAISON D'OR",'#0a0a10','#f2c84a'],['STRIKE BOWL','#5a1a8a','#ffe040'],["JOE'S GARAGE",'#c82020','#fff'],['THE ROYAL OAK','#1c3a24','#f0d070'],['VILLAGE MOTORS','#101820','#f0c840'],["FRANKIE'S",'#f2c814','#a01010'],['CO-OP','#0e6a3a','#fff']];
 A.forEach((a,i)=>{g.fillStyle=a[1];g.fillRect(i*256,0,256,64);g.fillStyle=a[2];g.font='bold 26px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText(a[0],i*256+128,34)});f.tx.wrapS=THREE.RepeatWrapping;f.tx.repeat.x=2;f.tx.needsUpdate=true;return f.tx}
function fcNetTex(){const f=cvT(128,128),g=f.cv.getContext('2d');g.clearRect(0,0,128,128);g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=2;for(let i=0;i<=128;i+=16){g.beginPath();g.moveTo(i,0);g.lineTo(i,128);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(128,i);g.stroke()}f.tx.wrapS=f.tx.wrapT=THREE.RepeatWrapping;f.tx.repeat.set(5,3);f.tx.needsUpdate=true;return f.tx}
function fcMerge(bs){const pos=[],idx=[];let o=0;for(const b of bs){const p=b.attributes.position,ix=b.index;for(let i=0;i<p.count;i++)pos.push(p.getX(i),p.getY(i),p.getZ(i));for(let i=0;i<ix.count;i++)idx.push(ix.getX(i)+o);o+=p.count}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);return g}
function buildGround(o){while(SG.children.length)SG.remove(SG.children[0]);o.rz=9.6;RZ=9.6;IA.splice(0,IA.length);IROOM.splice(0,IROOM.length);
 const ST=new THREE.Group();SG.add(ST);const W=(x,y,z,w,h,d,hex)=>gbox(ST,x,y,z,w,h,d,hex);
 const sky=new THREE.Mesh(new THREE.SphereGeometry(300,16,12),new THREE.MeshBasicMaterial({map:fcSky(),side:THREE.BackSide,fog:false}));sky.position.set(0,0,-20);ST.add(sky);
 const gr=new THREE.Mesh(new THREE.PlaneGeometry(500,500).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x4a7a3a}));gr.position.set(0,-.04,-20);ST.add(gr);
 const pit=new THREE.Mesh(new THREE.PlaneGeometry(FL,FW).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:fcPitchTex()}));pit.position.set(0,.03,FCZ);ST.add(pit);
 const con=new THREE.Mesh(new THREE.PlaneGeometry(52,11.8).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x8a8a90}));con.position.set(0,.02,3.8);ST.add(con);
 // stands
 const rows=9,conc=[0x9a9aa2,0x8e8e96];
 for(let i=0;i<rows;i++){const y=.5+i*.58;W(0,0,-14.2+i*1.2,60,y,1.2,conc[i%2]);W(0,y,-14.2+i*1.2,60,.08,1.2,i%2?0xb02a2a:0xd8d8d8);W(0,0,-55.8-i*1.2,60,y,1.2,conc[i%2]);W(0,y,-55.8-i*1.2,60,.08,1.2,i%2?0xb02a2a:0xd8d8d8);
  const yt=.45+i*.5;W(-32.6-i*1.2,0,-35,1.2,yt,43,conc[i%2]);W(32.6+i*1.2,0,-35,1.2,yt,43,conc[i%2])}
 W(0,0,-2.4,62,11,.7,0xa8a8b0);W(0,0,-67.4,62,11,.7,0x8a8a92);W(-44.4,0,-35,.7,9,46,0x8a8a92);W(44.4,0,-35,.7,9,46,0x8a8a92);
 W(0,9.4,-8.8,62,.4,13.5,0x2e3238);W(0,9.4,-61.5,62,.4,13.5,0x2e3238);for(const x of[-26,-17,-9.5,9.5,17,26]){W(x,0,-14.6,.4,9.4,.4,0x606068);W(x,0,-55.4,.4,9.4,.4,0x606068)}
 // floodlights
 for(const sx of[-36,36])for(const sz of[-12.5,-57.5]){W(sx,0,sz,.6,23,.6,0x707078);W(sx,23,sz,4,2.2,.5,0xfff2c8);W(sx,25.2,sz,4,.3,.5,0xd8d8d8)}
 // players tunnel
 W(0,0,-14.35,5.2,2.8,.3,0x0c0c10);W(0,2.8,-14.3,5.8,.4,.5,0xa01418);W(-2.8,0,-14.3,.4,3.2,.5,0xa01418);W(2.8,0,-14.3,.4,3.2,.5,0xa01418);W(0,0,-14.1,4,.05,1.4,0x303038);
 // ad boards
 const adt=fcAdTex();for(const z of[-17.6,-52.4]){const m=new THREE.Mesh(new THREE.PlaneGeometry(56,.9),new THREE.MeshBasicMaterial({map:adt,side:THREE.DoubleSide}));m.position.set(0,.5,z);if(z<-40)m.rotation.y=Math.PI;ST.add(m)}
 for(const x of[-29.4,29.4]){const t2=adt.clone();t2.repeat.x=1;t2.needsUpdate=true;const m=new THREE.Mesh(new THREE.PlaneGeometry(34,.9),new THREE.MeshBasicMaterial({map:t2,side:THREE.DoubleSide}));m.rotation.y=x<0?-Math.PI/2:Math.PI/2;m.position.set(x,.5,FCZ);ST.add(m)}
 // goals
 const net=fcNetTex(),nm=new THREE.MeshBasicMaterial({map:net,transparent:true,side:THREE.DoubleSide,depthWrite:false});
 for(const s of[-1,1]){const gx=s*FHL;W(gx,0,FCZ-2.7,.14,2.1,.14,0xf4f4f4);W(gx,0,FCZ+2.7,.14,2.1,.14,0xf4f4f4);W(gx,2.1,FCZ,.14,.14,5.54,0xf4f4f4);
  const bk=new THREE.Mesh(new THREE.PlaneGeometry(5.4,2.1),nm);bk.rotation.y=Math.PI/2;bk.position.set(gx+s*2.2,1.05,FCZ);ST.add(bk);const top=new THREE.Mesh(new THREE.PlaneGeometry(2.2,5.4).rotateX(-Math.PI/2),nm);top.position.set(gx+s*1.1,2.1,FCZ);ST.add(top);
  for(const sz of[-1,1]){const sd=new THREE.Mesh(new THREE.PlaneGeometry(2.2,2.1),nm);sd.position.set(gx+s*1.1,1.05,FCZ+sz*2.7);ST.add(sd)}
  for(const sz of[-1,1]){W(s*FHL,0,FCZ+sz*FHW,.06,1.3,.06,0xf0e040);W(s*FHL,1.0,FCZ+sz*FHW,.5,.3,.04,0xd02020)}}
 // dugouts
 for(const x of[-7,7]){W(x,0,-16.3,5,.5,1.0,0x303038);W(x,1.9,-16.3,5.4,.12,1.5,0x40444c);W(x,0,-15.6,5,1.9,.08,0x505058)}
 // scoreboard
 const sbf=cvT(512,160);const sb=new THREE.Mesh(new THREE.PlaneGeometry(11,3.4),new THREE.MeshBasicMaterial({map:sbf.tx}));sb.position.set(0,6.8,-55.0);ST.add(sb);
 // concourse: walls, ceiling, gates, turnstiles, ticket booths
 fcConc(ST,W);
 // crowd
 FCV={ST,sbf,pl:[[],[]],ref:null,ball:null,ph:null,t:0,sbk:'',mood:[{j:0,a:0,s:0,d:0},{j:0,a:0,s:0,d:0},{j:0,a:0,s:0,d:0},{j:0,a:0,s:0,d:0}],wave:0,wavet:0};
 fcCrowd(ST);fcActors(ST);
 // interaction
 const lab=(base,seat)=>()=>{const st=fcSt(fcNow());return base+(FAN.tk===st.n?' · TICKET':'')+(st.ph===1?' · LIVE':st.ph===0?' · KICK-OFF '+bkClock(st.rem):'')};
 IROOM.push([-26,26,-3,-2],[-22,-14,-.4,2.4],[14,22,-.4,2.4]);
 IA.push(LEAVE_IA(),{r:[-3.8,3.8,-1.8,1.4],label:lab('MAIN STAND SEAT (£5)'),fn:()=>fcSeat(0)},{r:[-14.5,-7.5,-1.8,1.4],label:lab('THE TERRACE (£3)'),fn:()=>fcSeat(1)},{r:[7.5,14.5,-1.8,1.4],label:lab('PITCHSIDE (£8)'),fn:()=>fcSeat(2)},
  {r:[14,22,-.4,3.2],label:'BUY A MATCHDAY PIE £3',fn:()=>{if(cash<3){toast('NOT ENOUGH CASH');return}cash-=3;eat();say('PIE MAN','Steak and ale. Cures all ills.',2600)}},
  {r:[-22,-14,-.4,3.2],label:'MATCH PROGRAMME £1',fn:()=>{const st=fcSt(fcNow());if(cash<1){toast('NOT ENOUGH CASH');return}cash-=1;say('PROGRAMME',"TODAY: ROVERS v "+st.fx.opp+". FAN LEVEL "+fanLevel()+". "+(st.ph===1?'LIVE NOW!':'KICK-OFF IN '+bkClock(st.rem)),4200)}})}
/* crowd */
function fcCrowd(ST){const sp=[],r=bkRng(4242),skins=[[.96,.78,.66],[.89,.69,.54],[.78,.57,.41],[.6,.42,.3],[.44,.3,.21]],home=[[.8,.1,.12],[.85,.85,.88],[.7,.1,.1],[.95,.95,.95],[.2,.2,.24]],away=[[.15,.3,.8],[.2,.4,.9],[.9,.9,.95],[.1,.15,.5]],mix=[[.2,.5,.3],[.9,.8,.2],[.5,.3,.6],[.9,.5,.2],[.2,.2,.2],[.6,.6,.65]];
 const add=(reg,x,y,z,pos)=>{const q=r(),pick=reg===3?(q<.88?away:mix):reg===2?(q<.95?home:mix):(q<.75?home:q<.88?away:mix),c=pick[Math.floor(r()*pick.length)];sp.push({reg,x,y,z,ph:r()*6.28,u:r(),c,sk:skins[Math.floor(r()*5)],pos})};
 for(let i=0;i<9;i++){const y=.5+i*.58;for(let x=-27.6;x<=27.6;x+=.86){if(r()<.1)continue;if(i<4&&Math.abs(x)<2.8)continue;add(0,x+(r()-.5)*.2,y,-14.2+i*1.2,(x+30)/60);if(r()>.1)add(1,x+(r()-.5)*.2,y,-55.8-i*1.2,.5+(30-x)/60/2+.25)}
  const yt=.45+i*.5;for(let z=-54.6;z<=-15.4;z+=.8){if(r()<.1)continue;add(2,-32.6-i*1.2,yt,z+(r()-.5)*.2,0);add(3,32.6+i*1.2,yt,z+(r()-.5)*.2,0)}}
 const n=sp.length;for(const s of sp){s.ang=Math.atan2(s.z-FCZ,s.x)/6.2832+.5}
 const bm=new THREE.MeshBasicMaterial({color:0xffffff}),mk=(g)=>{const m=new THREE.InstancedMesh(g,bm,n);m.frustumCulled=false;ST.add(m);return m};
 const body=mk(new THREE.BoxGeometry(.5,.75,.36)),head=mk(new THREE.BoxGeometry(.3,.3,.3)),arms=mk(fcMerge([new THREE.BoxGeometry(.1,.6,.1).translate(-.3,0,0),new THREE.BoxGeometry(.1,.6,.1).translate(.3,0,0)]));
 const col=new THREE.Color();sp.forEach((s,i)=>{col.setRGB(s.c[0],s.c[1],s.c[2]);body.setColorAt(i,col);col.setRGB(s.sk[0],s.sk[1],s.sk[2]);head.setColorAt(i,col);arms.setColorAt(i,col)});
 FCV.sp=sp;FCV.im={body,head,arms}}
function fcCrowdUpd(dt,t){const V=FCV,M=V.mood,sp=V.sp,A=V.im.body.instanceMatrix.array,H=V.im.head.instanceMatrix.array,R=V.im.arms.instanceMatrix.array,wt=V.wavet,wa=V.wave;
 for(let i=0;i<sp.length;i++){const s=sp[i],m=M[s.reg];if(s.hid){const o=i*16;for(const Z of[A,H,R]){Z[o]=Z[o+5]=Z[o+10]=0;Z[o+12]=s.x;Z[o+13]=-9;Z[o+14]=s.z;Z[o+15]=1}continue}let wv=0;if(wa>0){const q=Math.sin(6.2832*((wt*.28)-s.ang*2));wv=q>0?q*Math.min(1,wa):0}
  const stand=Math.max(0,Math.min(1,m.j*1.4-s.u*.4,1)),st2=Math.max(stand,wv),armsUp=(m.a*1.3-s.u*.6>.15||wv>.35)?1:0,jump=st2>.3?Math.abs(Math.sin(t*(wv>0?4:9)+s.ph))*(.14+.22*m.j)*(wv>.35?.4:1):0,sw=Math.sin(t*2.2+s.ph)*.08*m.s,dn=m.d,bob=Math.sin(t*1.3+s.ph)*.012;
  const sy=(1+.42*st2)*(1-.12*dn),by=s.y+.4*sy+jump*.6+bob,hx=s.x+sw,hy=s.y+.82+.3*st2+jump-.1*dn+bob,o=i*16;
  A[o]=1;A[o+5]=sy;A[o+10]=1;A[o+12]=s.x+sw;A[o+13]=by;A[o+14]=s.z;A[o+15]=1;
  H[o]=1;H[o+5]=1;H[o+10]=1;H[o+12]=hx;H[o+13]=hy;H[o+14]=s.z;H[o+15]=1;
  const ar=armsUp?1:.001;R[o]=1;R[o+5]=ar;R[o+10]=1;R[o+12]=s.x+sw;R[o+13]=hy+.1+jump*.3+(armsUp?.28:0)+Math.sin(t*7+s.ph)*.05*armsUp;R[o+14]=s.z;R[o+15]=1}
 V.im.body.instanceMatrix.needsUpdate=V.im.head.instanceMatrix.needsUpdate=V.im.arms.instanceMatrix.needsUpdate=true}
/* actors */
function fcActors(ST){const kits=[{tc:[.85,.1,.12],bc:[.95,.95,.95],gk:[.9,.8,.1]},{tc:[.15,.3,.85],bc:[.95,.95,.95],gk:[.2,.7,.3]}],r=bkRng(777);
 for(const tm of[0,1])for(let i=0;i<11;i++){const k=kits[tm],sp=pSpec(3000+tm*40+i,{f:false,gl:false,scarf:null,bp:false,bag:0,old:false,ts:0,tc:i===0?k.gk:k.tc,bc:i===0?[.1,.1,.12]:k.bc,sc:[.1,.1,.1],sh:true,hs:[0,0,3,0][i%4],beard:false});const g=mkPerson(sp,IMAT,ST);g.scale.setScalar(sp.h*1.35);FCV.pl[tm].push(g);g.ph=r()*6;{const q=fcPos(tm,i,[0,0],0,0);g.px=q[0]*.85;g.pz=FCZ+(q[1]-FCZ)*.8}g.position.set(g.px,0,g.pz);g.sp=0}
 const rf=mkPerson(pSpec(3999,{f:false,gl:false,scarf:null,bp:false,bag:0,old:false,ts:0,tc:[.08,.08,.1],bc:[.08,.08,.1],sc:[.1,.1,.1],sh:false,hs:0}),IMAT,ST);rf.scale.setScalar(1.35);rf.ph=1;rf.px=0;rf.pz=-35;rf.position.set(0,0,-35);FCV.ref=rf;
 const b=new THREE.Mesh(new THREE.SphereGeometry(.24,10,8),new THREE.MeshBasicMaterial({color:0xfafafa}));ST.add(b);FCV.ball=b;const bs=new THREE.Mesh(new THREE.CircleGeometry(.24,10).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.4}));ST.add(bs);FCV.bsh=bs}
/* match phases */
function fcChain(r,team,m,attack,last){const a=[];let cur=5+Math.floor(r()*4);a.push(cur);for(let k=1;k<=m;k++){let nx;if(k===m&&last!==undefined)nx=last;else{nx=attack?[5,6,7,8,9,10,8,9][Math.floor(r()*8)]:1+Math.floor(r()*10);if(nx===cur)nx=nx===10?9:nx+1}a.push(nx);cur=nx}return a}

const fcSm=u=>u<=0?0:u>=1?1:u*u*(3-2*u);

function fcPos(team,i,F,t,sp){const[u,v]=FSLOT[i];let x=team===0?-FHL+u*FL:FHL-u*FL,z=FCZ+(v-.5)*FW*(team===0?1:-1);const w=i===0?.03:i<5?.3:.55;x+=F[0]*w;z+=(F[1]-(z-FCZ))*.22*w*(i===0?.4:1);
 const jx=Math.sin(t*.9+i*1.7+team*3)*(sp?2.2:1.1),jz=Math.sin(t*.7+i*2.3+team)*(sp?2.4:1.3);x+=jx;z+=jz;return[Math.max(-FHL+.8,Math.min(FHL-.8,x)),Math.max(FCZ-FHW+.8,Math.min(FCZ+FHW-.8,z))]}
function fcTarget(e,def,F,t){const sg=e.team===0?1:-1;const fz=e.gz;
 if(e.kind==='goal')return[sg*(FHL+1.2),.9,FCZ+fz];if(e.kind==='save')return[sg*(FHL-1.4),.8,FCZ+Math.max(-2.3,Math.min(2.3,e.sz*.22))];if(e.kind==='wide')return[sg*(FHL+3),.7,FCZ+(e.sz>0?1:-1)*(3.6+Math.abs(e.sz)*.3)];
 if(e.kind==='block'){const q=fcPos(1-e.team,3,F,t,0);return[q[0],.3,q[1]]}if(e.kind==='corner')return[sg*(FHL-.5),.2,FCZ+(e.sz>0?FHW-.5:-(FHW-.5))];return null}
function fcBallAt(fx,t){const P=fcPhases(fx);let p=P[0];for(const q of P)if(t>=q.t0&&t<q.t1+.0001){p=q;break}if(t>=P[P.length-1].t1)p=P[P.length-1];
 const F=fcFoc(p,t),cp=(team,i,tt)=>{const pp=fcPhaseAt(P,tt),pos=fcPos(team,i,fcFoc(pp,tt),tt,0);return pos};
 if(p.k==='d'){const e=p.e,tg=fcTarget(e,0,fcFoc(p,e.te),e.te),sc=cp(e.team,p.shooter,e.te);if(!tg)return[sc[0],.24,sc[1],p];const u=Math.min(1,(t-e.te)/.7),ex=u<1?Math.sin(u*Math.PI)*.5:0;return[sc[0]+(tg[0]-sc[0])*u,.24+tg[1]*u*.5+ex+(tg[1]>.5?0:0),sc[1]+(tg[2]-sc[1])*u,p]}
 const ch=p.chain,m=ch.length-1,dt=(p.t1-p.t0)/(m+1),fl=Math.min(.6,dt*.45),k=Math.min(m,Math.floor((t-p.t0)/dt));let tk=p.t0+(k+1)*dt-fl;
 if(k<m&&t>=tk){const s=(t-tk)/fl,a=cp(p.team,ch[k],tk),b=cp(p.team,ch[k+1],tk+fl);return[a[0]+(b[0]-a[0])*s,.24+Math.sin(s*Math.PI)*.9,a[1]+(b[1]-a[1])*s,p]}
 const c=cp(p.team,ch[k],t),dr=p.team===0?1:-1;return[c[0]+dr*.5,.24,c[1],p]}
function fcPhaseAt(P,t){for(const q of P)if(t>=q.t0&&t<q.t1+.0001)return q;return t<P[0].t0?P[0]:P[P.length-1]}

function fcConc(ST,W){const tx=(w,h,bg,fg,t,sz)=>txtTex(w,h,bg,fg,t,sz);
 const flo=cvT(512,256),g=flo.cv.getContext('2d');g.fillStyle='#8a8a92';g.fillRect(0,0,512,256);for(let i=0;i<8;i++){g.fillStyle=i%2?'#7e7e86':'#92929a';g.fillRect(i*64,0,64,256)}g.fillStyle='#a01418';g.fillRect(0,126,512,4);flo.tx.wrapS=flo.tx.wrapT=THREE.RepeatWrapping;flo.tx.repeat.set(3,1);flo.tx.magFilter=THREE.NearestFilter;
 const fm=new THREE.Mesh(new THREE.PlaneGeometry(52,11.8).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:flo.tx}));fm.position.set(0,.03,3.9);ST.add(fm);
 const CONC=0xb4b4bc,DK=0x2e3238,RD=0xa01418;
 // back wall with three gate openings
 for(const[x0,x1]of[[-26,-13],[-9,-2],[2,9],[13,26]])W((x0+x1)/2,0,-2.0,x1-x0,9.4,.8,CONC);
 W(0,3.3,-2.0,52,6.1,.8,CONC);W(0,3.2,-1.55,52,.5,.1,RD);W(0,0,-1.55,52,.3,.1,DK);
 for(const x of[-11,0,11]){W(x-2.1,0,-1.55,.25,3.4,.2,RD);W(x+2.1,0,-1.55,.25,3.4,.2,RD);W(x,3.0,-1.55,4.45,.3,.2,RD);W(x,0,-4.2,4,.02,4,0x3a3a42)}
 // gate signs
 [[-11,'THE TERRACE','£3'],[0,'MAIN STAND','£5'],[11,'PITCHSIDE','£8']].forEach(([x,t,p])=>{sPlane(3.8,.75,x,4.1,-1.5,0,tx(256,50,'#14141a','#ffd840',t+'  '+p,24))});
 // turnstiles
 for(const x of[-11,0,11])for(const dx of[-1.15,1.15]){W(x+dx,0,-1.0,.55,1.05,.9,0x606068);W(x+dx,1.05,-1.0,.7,.1,1.0,RD);const b=gbox(SG,x+dx,1.15,-1.0,.05,.05,.8,0xd0d0d8);for(const a of[0,2.09,4.19]){const r=gbox(SG,x+dx,1.1,-1.0,.04,.04,.7,0xc8c8d0);r.rotation.x=a;r.rotation.y=0}W(x+dx,1.3,-1.0,.2,.1,.3,0x30e060)}
 // ceiling with light strips
 W(0,4.5,3.95,52,.3,12.1,DK);for(const x of[-18,-6,6,18])for(const z of[1,6])W(x,4.42,z,3.4,.08,.5,0xfff4c8);
 // side walls and front wall with exit
 for(const x of[-26,26])W(x,0,3.95,.6,4.7,12,CONC);
 W(-12.6,0,9.9,26.4,4.7,.5,CONC);W(14.4,0,9.9,23.2,4.7,.5,CONC);W(1.6,3.2,9.9,4.4,1.5,.5,CONC);W(1.6,3.15,9.6,4.4,.1,.1,RD);
 // ticket booths facing the gates
 for(const bx of[-8,12]){const z=7.4;W(bx,0,z+1.0,6,3.3,.2,0xcfcfd6);W(bx-3,0,z,.2,3.3,2.2,0xcfcfd6);W(bx+3,0,z,.2,3.3,2.2,0xcfcfd6);W(bx,3.3,z,6.6,.2,2.6,RD);W(bx,0,z-1.0,6,1.1,.3,RD);W(bx,1.05,z-1.0,6.2,.1,.5,0xe8e8e8);
  const gl=new THREE.Mesh(new THREE.PlaneGeometry(2.7,1.15),new THREE.MeshBasicMaterial({color:0x9ad0f0,transparent:true,opacity:.28,side:THREE.DoubleSide,depthWrite:false}));for(const k of[-1.5,1.5]){const m=gl.clone();m.position.set(bx+k,1.75,z-1.0);SG.add(m)}W(bx,1.15,z-1.0,.12,1.2,.12,0x303038);W(bx-3,1.15,z-1.0,.12,1.2,.12,0x303038);W(bx+3,1.15,z-1.0,.12,1.2,.12,0x303038);
  sPlane(5.2,.8,bx,4.2,z-1.2,0,tx(256,40,'#a01418','#fff','TICKETS',26));sPlane(1.3,1.2,bx-3.35,2.0,z-1.0,Math.PI/2,tx(96,96,'#14141a','#ffd840','TERRACE £3\nMAIN £5\nSIDE £8',12));
  for(const k of[-1.5,1.5]){const pp=pSpec(5100+bx+k*3,{f:false,gl:k<0,scarf:[.8,.1,.12],bp:false,bag:0,old:false,ts:2,tc:[.7,.1,.12],bc:[.17,.2,.3],sc:[.1,.1,.1],sh:false});personIn(pp,bx+k,z+.1,Math.PI,false)}}
 // rope barriers
 for(const x of[-11,0,11])for(const dx of[-2,2]){for(let z=1.5;z<=6;z+=1.5){W(x+dx,0,z,.08,.9,.08,0xd0b040);W(x+dx,.9,z,.2,.06,.2,0xd0b040)}W(x+dx,.75,3.75,.04,.04,4.5,0xa01418)}
 // wall decor
 sPlane(2.6,3.2,-18,2.6,-1.5,0,fcCrestTex());sPlane(2.6,3.2,18,2.6,-1.5,0,fcCrestTex());
 sPlane(3.4,2.2,-20,2.2,9.6,Math.PI,tx(256,160,'#14141a','#fff','FIXTURES\nSAT ROVERS v ...\nDERBY DAY\nSEASON TICKETS',14));
 sPlane(4,.7,-20,3.3,-1.5,0,tx(256,44,'#14141a','#ffd840','EST. 1923',26));
 sPlane(2.6,.7,1.6,4.0,9.6,Math.PI,tx(160,44,'#14141a','#30e060','EXIT',28));
 for(const x of[-20,-5,6,20]){const b=sPlane(1.6,2.4,x,3.0,4.4-0,0,tx(96,144,'#a01418','#fff','COME ON\nYOU\nROVERS',16));b.position.y=2.9}
 // kiosks
 W(-18,0,.6,4,2.2,1.6,0x8a5a2a);W(-18,2.2,.4,4.6,.15,2.2,0xd8d8d8);sPlane(3.4,.5,-18,2.8,-.5,0,tx(256,40,'#6a3a1a','#fff4d0','PROGRAMMES',24));
 W(18,0,.6,4.4,2.2,1.6,0xa02020);W(18,2.2,.4,5,.15,2.2,0xe8e8e8);sPlane(3.8,.5,18,2.8,-.5,0,tx(256,40,'#a02020','#fff','PIES & PINTS',24))}
function fcCrestTex(){const f=cvT(128,160),g=f.cv.getContext('2d');g.fillStyle='#14141a';g.fillRect(0,0,128,160);g.fillStyle='#a01418';g.beginPath();g.moveTo(10,10);g.lineTo(118,10);g.lineTo(118,90);g.quadraticCurveTo(64,166,10,90);g.closePath();g.fill();g.strokeStyle='#fff';g.lineWidth=5;g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(64,64,26,0,7);g.fill();g.fillStyle='#10301c';g.beginPath();g.arc(64,64,20,0,7);g.fill();g.fillStyle='#ffd840';g.font='bold 14px Georgia';g.textAlign='center';g.fillText('ROVERS',64,118);f.tx.needsUpdate=true;return f.tx}
/* ---- matchday: seats, camera, reactions, audio, commentary ---- */
var GW=null;
{const c0=cloItems;cloItems=function(){const fresh=!CLOIT,r=c0();if(fresh){r[0].push({id:'top:rov',n:'ROVERS REPLICA SHIRT',p:35,ap:c=>{c.ts=0;c.tc=[.8,.1,.12]},has:c=>c.ts===0&&chEq(c.tc,[.8,.1,.12])});r[3].push({id:'acc:rov',n:'ROVERS SCARF',p:14,ap:c=>{c.scarf=[.8,.1,.12]},rm:c=>{c.scarf=null},has:c=>chEq(c.scarf,[.8,.1,.12])})}return r}}
const FANRW={2:['acc:rov','ROVERS SCARF'],4:['top:rov','ROVERS REPLICA SHIRT']};
function fanAdd(n,why){const l0=fanLevel();FAN.xp+=n;const l1=fanLevel();fanSave();if(l1>l0){for(let l=l0+1;l<=l1;l++){if(FANRW[l]){CLOWN[FANRW[l][0]]=1;try{cloSave()}catch(e){czErr(e,"13-bets-fc.js")}toast('FAN LEVEL '+l+'! FREE '+FANRW[l][1]);}else toast('FAN LEVEL '+l+'!')}}else if(why)fcPop(why)}
function fcPop(t){const e=document.getElementById('fcP');if(!e)return;e.textContent=t;e.style.opacity=1;clearTimeout(GW&&GW.pt);if(GW)GW.pt=setTimeout(()=>{e.style.opacity=0},1100)}
/* audio */
function fcA(){try{initAudio()}catch(e){czErr(e,"13-bets-fc.js")}return AC}
function fcNoise(){if(!AC)return null;if(!GW.nb){const n=AC.sampleRate*2,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;GW.nb=b}return GW.nb}
function fcBurst(f0,f1,dur,vol,q,atk){const a=fcA();if(!a||!snd)return;const s=a.createBufferSource();s.buffer=fcNoise();s.loop=true;const f=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime;f.type='bandpass';f.Q.value=q||.7;f.frequency.setValueAtTime(f0,t);f.frequency.linearRampToValueAtTime(f1,t+dur);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+(atk||.25));g.gain.linearRampToValueAtTime(0,t+dur);s.connect(f);f.connect(g);g.connect(a.destination);s.start(t);s.stop(t+dur+.05)}
function fcClap(t0,vol){const a=AC;if(!a||!snd)return;const s=a.createBufferSource();s.buffer=fcNoise();const f=a.createBiquadFilter(),g=a.createGain();f.type='bandpass';f.frequency.value=1800+Math.random()*1200;f.Q.value=.9;g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.001,t0+.07);s.connect(f);f.connect(g);g.connect(a.destination);s.start(t0,Math.random());s.stop(t0+.1)}
function fcTone(f,t0,dur,vol,type,f2){const a=AC;if(!a||!snd)return;const o=a.createOscillator(),g=a.createGain();o.type=type||'triangle';o.frequency.setValueAtTime(f,t0);if(f2)o.frequency.linearRampToValueAtTime(f2,t0+dur);g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.001,t0+dur);o.connect(g);g.connect(a.destination);o.start(t0);o.stop(t0+dur+.05)}
function fcSnd(k,big){if(!fcA()||!snd)return;const t=AC.currentTime,v=big||1;
 if(k==='cheer'){fcBurst(500,1200,1.6,.11*v,.6,.2);fcBurst(900,700,1.3,.06*v,.9,.15)}
 else if(k==='goal'){fcBurst(400,1500,3.4,.16,.5,.3);fcBurst(800,900,3,.08,.9,.4);for(let i=0;i<10;i++)fcClap(t+.5+i*.2,.05)}
 else if(k==='boo'){fcBurst(260,200,1.8,.14*v,1.4,.2);for(const f of[92,98,104])fcTone(f,t,1.5,.05,'sawtooth',f*.9)}
 else if(k==='clap'){for(let i=0;i<34;i++)fcClap(t+i*(.08+Math.random()*.05),.05+Math.random()*.03)}
 else if(k==='chant'){for(let r=0;r<2;r++){const b=t+r*1.9;[0,.3,.6,.9,1.2].forEach((d,i)=>{if(i<3||i===3)fcTone(i<3?110:130,b+d,.22,.14,'triangle');else fcClap(b+d,.12)});fcBurst(300,380,1.6,.07,1.2,.1)}}
 else if(k==='ooh'){fcBurst(500,1000,.8,.1,1.1,.3);setTimeout(()=>{if(AC)fcBurst(1000,560,.7,.08,1.1,.1)},700)}
 else if(k==='groan'){fcBurst(420,220,1.3,.1,1.3,.15)}
 else if(k==='whistle'){fcTone(3100,t,.18,.1,'sine');fcTone(3100,t+.22,.5,.1,'sine',3300)}
 else if(k==='post'){fcTone(220,t,.25,.2,'square',140);fcClap(t,.2)}}
function fcBed(on){if(!AC||!snd)return;const G=GW;if(on&&!G.bed){const s=AC.createBufferSource();s.buffer=fcNoise();s.loop=true;const f=AC.createBiquadFilter(),g=AC.createGain();f.type='bandpass';f.frequency.value=650;f.Q.value=.5;g.gain.value=.02;s.connect(f);f.connect(g);g.connect(AC.destination);s.start();G.bed={s,g,f}}else if(!on&&G.bed){try{G.bed.s.stop()}catch(e){czErr(e,"13-bets-fc.js")}G.bed=null}}
/* camera */
const FSEAT=[{n:'MAIN STAND',pr:5,e:[15,4.5,-10.6],base:[0,1.2,-35],fov:58},{n:'THE TERRACE',pr:3,e:[-36.2,3.8,-34],base:[0,1.6,-35],fov:62},{n:'PITCHSIDE',pr:8,e:[5.5,1.5,-19.3],base:[0,.9,-35],fov:64}];

/* entering */
function fcSeat(k){if(GW)return;const st=fcSt(fcNow()),S=FSEAT[k];if(FAN.tk!==st.n){if(cash<S.pr){toast('TICKET £'+S.pr+' - NOT ENOUGH CASH');return}cash-=S.pr;FAN.tk=st.n;fanSave();beep(660,.1,'square',.06)}fcWatch(k)}
function fcWatch(k){busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;document.body.classList.add('dz');man.visible=false;if(window.CHM)CHM.visible=false;
 {const e=FSEAT[k].e,ey=k<2?e[1]-1.1:e[1];for(const q of FCV.sp)q.hid=Math.hypot(q.x-e[0],q.z-e[2])<1.7&&q.y>ey-1.6&&q.y<ey+.8}
 const G=GW={seat:k,ox:0,oy:0,op:0,cj:0,excite:0,ball:null,ev:0,last:performance.now(),t:0,st:fcSt(fcNow()),sbt:0,cd:0,lastEv:null,evT:-9,rx:0,tick:[],key:'',ph:-1,mn:-1,hf:0};
 FCV.wave=0;FCV.mood.forEach(m=>{m.j=m.a=m.s=m.d=0});
 const ov=document.createElement('div');G.ov=ov;ov.style.cssText='position:fixed;inset:0;z-index:60;font:bold 13px monospace;color:#fff;touch-action:none;user-select:none;-webkit-user-select:none';
 ov.innerHTML='<div style="position:absolute;left:0;right:0;top:4px;text-align:center;pointer-events:none;text-shadow:2px 2px 0 #000"><div id="fcT" style="font-size:13px;color:#f5e6a0"></div><div id="fcK" style="margin:3px auto 0;max-width:92%;font-size:13px;color:#fff;background:rgba(0,0,0,.5);border-radius:6px;padding:4px 8px;min-height:18px;line-height:1.25"></div></div><div id="fcP" style="position:absolute;left:0;right:0;top:36%;text-align:center;font-size:30px;color:#ffd840;text-shadow:3px 3px 0 #000;pointer-events:none;opacity:0;transition:opacity .25s"></div><div id="fcC" style="position:absolute;left:0;right:0;top:46%;text-align:center;font-size:26px;color:#fff;text-shadow:3px 3px 0 #000;pointer-events:none"></div><div id="fcF" style="position:absolute;left:8px;top:64px;font-size:11px;color:#cde;pointer-events:none;text-shadow:1px 1px 0 #000"></div>';
 const bs='font:bold 13px monospace;border:3px solid #f5e6a0;border-radius:10px;color:#fff;touch-action:manipulation;pointer-events:auto;padding:9px 4px;flex:1 1 30%;min-width:0;',bar=document.createElement('div');bar.style.cssText='position:absolute;left:6px;right:6px;bottom:22px;display:flex;flex-wrap:wrap;gap:6px;pointer-events:none';
 [['📣 CHEER','cheer','#a01820'],['😠 BOO','boo','#403048'],['👏 CLAP','clap','#2a5a8a'],['🎶 CHANT','chant','#a06a10'],['🌊 WAVE','wave','#1a7a5a'],['😮 OOH','ooh','#6a3a8a']].forEach(([t,a,c])=>{const b=document.createElement('button');b.textContent=t;b.style.cssText=bs+'background:'+c;b.onpointerdown=e=>{e.stopPropagation();fcReact(a)};bar.append(b)});
 const lv=document.createElement('button');lv.textContent='LEAVE';lv.style.cssText='position:absolute;right:6px;top:70px;font:bold 12px monospace;border:3px solid #f5e6a0;border-radius:8px;color:#fff;padding:6px 9px;background:#333;pointer-events:auto';lv.onpointerdown=e=>{e.stopPropagation();fcLeave()};
 ov.append(bar,lv);document.body.append(ov);
 let dr=null;ov.onpointerdown=e=>{dr={x:e.clientX,y:e.clientY,oy:G.oy,op:G.op};try{ov.setPointerCapture(e.pointerId)}catch(_){czErr(_,"13-bets-fc.js")}};ov.onpointermove=e=>{if(!dr)return;G.oy=Math.max(-1.1,Math.min(1.1,dr.oy-(e.clientX-dr.x)/260));G.op=Math.max(-3,Math.min(5,dr.op-(e.clientY-dr.y)/60))};ov.onpointerup=ov.onpointercancel=()=>{dr=null};
 G.kd=e=>{const m={'1':'cheer','2':'boo','3':'clap','4':'chant','5':'wave','6':'ooh'}[e.key];if(m)fcReact(m);if(e.key==='Escape')fcLeave()};addEventListener('keydown',G.kd);
 DZ.fn=fcCam;DZ.tp=fcCam();DZ.look=new THREE.Vector3();DZ.on=1;fcCam();fcBed(true);fcNow2(G);fcSnd('cheer',.3);
 fcSay(FSEAT[k].n+' · '+(G.st.ph===0?'KICK-OFF IN '+bkClock(G.st.rem):G.st.ph===1?'MATCH IS LIVE':'FULL TIME'));
 G.raf=requestAnimationFrame(fcLoop)}
function fcNow2(G){}
function fcLeave(){const G=GW;if(!G)return;cancelAnimationFrame(G.raf);removeEventListener('keydown',G.kd);G.ov.remove();fcBed(false);clearTimeout(G.pt);GW=null;if(FCV.pts)FCV.pts.visible=false;DZ.fn=null;DZ.fov=46;DZ.on=0;DZ.exit=1;document.body.classList.remove('dz');man.visible=true;if(window.CHM)CHM.visible=true;busy=0;
 const st=fcSt(fcNow());FCV.mood.forEach(m=>{m.j=m.a=m.s=m.d=0})}
function fcSay(t){const e=document.getElementById('fcK');if(e)e.textContent=t}
/* reactions */
function fcHome(m,j,a,s){for(const r of[0,1,2]){const q=FCV.mood[r];q.j=Math.max(q.j,m*j);q.a=Math.max(q.a,m*a);q.s=Math.max(q.s,s||0)}}
function fcAway(m,j,a){const q=FCV.mood[3];q.j=Math.max(q.j,m*j);q.a=Math.max(q.a,m*a)}
function fcReact(a){const G=GW;if(!G||G.cd>0&&a!=='wave'&&G.cd2>performance.now())return;G.cd2=performance.now()+900;const now=G.t,E=G.lastEv,rec=E&&now-G.evT<5,good=rec&&(a==='cheer'&&E.team===0&&E.kind==='goal'||a==='boo'&&E.team===1&&E.kind==='goal'||a==='ooh'&&E.kind!=='goal'&&E.kind!=='foul'||a==='boo'&&(E.kind==='foul'||E.kind==='offside')||a==='clap'&&E.team===0||a==='chant'&&E.kind==='goal');
 if(a==='cheer'){fcSnd('cheer');fcHome(1,.9,1);G.excite=Math.min(1,G.excite+.3)}
 else if(a==='boo'){fcSnd('boo');for(const r of[0,1,2]){FCV.mood[r].s=1;FCV.mood[r].d=.7}FCV.mood[3].a=.8}
 else if(a==='clap'){fcSnd('clap');fcHome(.5,.2,1)}
 else if(a==='chant'){fcSnd('chant');fcHome(.8,.5,.4,1);G.chant=7;G.chantn=0}
 else if(a==='wave'){if(FCV.wave>0){return}FCV.wave=1;FCV.wavet=0;G.wvt=11;fcSnd('cheer',.5);fcPop('THE WAVE!')}
 else if(a==='ooh'){fcSnd('ooh');for(let r=0;r<4;r++)FCV.mood[r].j=Math.max(FCV.mood[r].j,.35)}
 if(a!=='wave'){const t0=a==='cheer'?'CHEER!':a==='boo'?'BOOOO!':a==='clap'?'CLAP CLAP':a==='chant'?'ROVERS! ROVERS!':'OOOOH!';if(good){fanAdd(6,'PERFECT TIMING +6');}else fanAdd(1,t0)}else fanAdd(2)}

function fcEvent(e,fx,st){const G=GW,sc=fcScore(fx,st.tl+1),[txt,k]=fcEvText(e,fx);fcSay(fcMin(st)+"' "+txt);G.lastEv=e;G.evT=G.t;
 if(e.kind==='goal'){const home=e.team===0;fcSnd('goal');G.excite=1;if(home){fcHome(1,1,1);fcAway(.2,0,0);fcPop('GOAL!');fcConfetti(1)}else{for(const r of[0,1,2]){FCV.mood[r].d=1}fcAway(1,1,1);fcPop('THEY SCORE...');fcConfetti(0)}if(home)fanAdd(3);G.flash=1;G.sbk=''}
 else if(k==='boo'){fcSnd('boo',.6);for(const r of[0,1,2])FCV.mood[r].s=.6}
 else{fcSnd(k,1);for(let r=0;r<4;r++)FCV.mood[r].j=Math.max(FCV.mood[r].j,.3);G.excite=Math.max(G.excite,.4)}}
/* confetti / flares */
function fcConfetti(home){const V=FCV;if(!V.pts){const n=160,g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(n*3),3));V.pts=new THREE.Points(g,new THREE.PointsMaterial({size:5,vertexColors:true,sizeAttenuation:false,fog:false}));V.pts.frustumCulled=false;V.ST.add(V.pts);V.pv=new Float32Array(n*3)}
 V.pts.visible=true;const p=V.pts.geometry.attributes.position.array,c=V.pts.geometry.attributes.color.array,n=p.length/3;for(let i=0;i<n;i++){const hz=home?(i%2?-1:1)*(-FHL-6):FHL+6,z=Math.random()>.5;p[i*3]=home?(Math.random()-.5)*40:(32+Math.random()*6);p[i*3+1]=2+Math.random()*3;p[i*3+2]=home?(Math.random()<.5?-13:-56)+(Math.random()-.5)*4:-35+(Math.random()-.5)*30;V.pv[i*3]=(Math.random()-.5)*3;V.pv[i*3+1]=5+Math.random()*7;V.pv[i*3+2]=(Math.random()-.5)*3;const cl=home?[[1,.2,.2],[1,1,1],[1,.85,.2]][i%3]:[[.3,.5,1],[1,1,1]][i%2];c[i*3]=cl[0];c[i*3+1]=cl[1];c[i*3+2]=cl[2]}
 V.pts.geometry.attributes.position.needsUpdate=V.pts.geometry.attributes.color.needsUpdate=true;V.pt=3.5}
function fcPtsUpd(dt){const V=FCV;if(!V.pts||!V.pts.visible)return;V.pt-=dt;if(V.pt<=0){V.pts.visible=false;return}const p=V.pts.geometry.attributes.position.array,v=V.pv;for(let i=0;i<p.length/3;i++){v[i*3+1]-=9*dt;p[i*3]+=v[i*3]*dt;p[i*3+1]=Math.max(.1,p[i*3+1]+v[i*3+1]*dt);p[i*3+2]+=v[i*3+2]*dt}V.pts.geometry.attributes.position.needsUpdate=true}
/* scoreboard */
function fcSb(st,force){const V=FCV,g=V.sbf.cv.getContext('2d'),fx=st.fx,sc=st.ph===0?[0,0]:st.ph===1?fcScore(fx,st.tl):[fx.hg,fx.ag],mn=fcMin(st),key=st.n+':'+st.ph+':'+sc+':'+mn+':'+(st.ph===0?Math.floor(st.rem):0);if(key===V.sbk&&!force)return;V.sbk=key;
 g.fillStyle='#0a0e14';g.fillRect(0,0,512,160);g.strokeStyle='#ffd840';g.lineWidth=4;g.strokeRect(4,4,504,152);g.textAlign='center';g.font='bold 26px monospace';g.fillStyle='#fff';g.fillText('ROVERS',110,50);g.fillText(fx.opp.length>13?fx.opp.slice(0,13):fx.opp,402,50);g.font='bold 62px monospace';g.fillStyle='#ffb020';g.fillText(sc[0]+' - '+sc[1],256,80);
 g.font='bold 30px monospace';g.fillStyle=st.ph===1?'#7f7':'#9cf';g.fillText(st.ph===0?'KO '+bkClock(st.rem):st.ph===1?mn+"'":'FULL TIME',256,134);V.sbf.tx.needsUpdate=true}
/* actors per frame */
function fcActUpd(dt,st,t){const V=FCV,fx=st.fx,live=st.ph===1,P=live?fcPhases(fx):null,tm=live?st.tl:0;
 for(let team=0;team<2;team++)for(let i=0;i<11;i++){const g=V.pl[team][i];let x,z;
  if(live){const p=fcPhaseAt(P,tm),F=fcFoc(p,tm),q=fcPos(team,i,F,tm,p.team===team&&p.k!=='b'?1:0);x=q[0];z=q[1]}else if(st.ph===0){const k=Math.min(1,st.tl/6),w=fcPos(team,i,[0,0],t,0);x=w[0]*(.5+.5*k)+Math.sin(t*.8+i)*(1-k)*2;z=w[1]+Math.sin(t*.6+i*2)*.8;x=w[0]*.92+Math.sin(t*.5+i)*1.6;z=w[1]*.98+Math.cos(t*.4+i)*(.9)}else{const q=fcPos(team,i,[0,0],0,0);x=q[0]*.85;z=FCZ+(q[1]-FCZ)*.8;x+=Math.sin(t*.3+i)*.4}
  const dx=x-g.px,dz=z-g.pz,sp=Math.hypot(dx,dz)/Math.max(dt,.001);g.px=x;g.pz=z;g.position.set(x,0,z);if(sp>.4){const ty=Math.atan2(dx,dz);let d=ty-g.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));g.rotation.y+=d*Math.min(1,dt*8)}else{const tb=V.ballx!==undefined?Math.atan2(V.ballx-x,V.ballz-z):0;let d=tb-g.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));g.rotation.y+=d*Math.min(1,dt*3)}
  g.sp=g.sp*.8+Math.min(sp,9)*.2;g.ph+=dt*(3+g.sp*1.6);const a=Math.min(1,g.sp/4)*.9;g.l1.rotation.x=Math.sin(g.ph)*a;g.l2.rotation.x=-Math.sin(g.ph)*a;g.a1.rotation.x=-Math.sin(g.ph)*a*.7;g.a2.rotation.x=Math.sin(g.ph)*a*.7}
 const r=V.ref;{const bx=V.ballx||0,bz=V.ballz||FCZ,tx=bx*.7,tz=FCZ+(bz-FCZ)*.5+4,dx=tx-r.px,dz=tz-r.pz;r.px+=dx*Math.min(1,dt*1.4);r.pz+=dz*Math.min(1,dt*1.4);const sp=Math.hypot(dx,dz)*1.4;r.position.set(r.px,0,r.pz);const ty=Math.atan2(bx-r.px,bz-r.pz);let d=ty-r.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));r.rotation.y+=d*Math.min(1,dt*4);r.sp=r.sp*.8+Math.min(sp,7)*.2;r.ph+=dt*(3+r.sp*1.6);const a=Math.min(1,r.sp/3)*.8;r.l1.rotation.x=Math.sin(r.ph)*a;r.l2.rotation.x=-Math.sin(r.ph)*a;r.a1.rotation.x=-Math.sin(r.ph)*a*.6;r.a2.rotation.x=Math.sin(r.ph)*a*.6}
 let b;if(live){b=fcBallAt(fx,tm)}else b=[0,.24,FCZ];V.ballx=b[0];V.ballz=b[2];V.ball.position.set(b[0],b[1],b[2]);V.bsh.position.set(b[0],.05,b[2]);if(GW)GW.ball=[b[0],b[1],b[2]]}
/* main loop */

