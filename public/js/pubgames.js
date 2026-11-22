/* ---- PUB GAMES: the table and bar games that give each pub its own character.
   Chess (vs The Colonel), dominoes, cribbage, arm wrestling, bar billiards, the quiz machine, shove ha'penny,
   skittles, pinball, a rhythm engine for shanty nights and open mic, and the jukebox.
   Every game runs in its own overlay with a LEAVE button (Escape presses it), pays out through cash and reports
   wins to window.PUBS.win(game, level) so the pub league can count them. ---- */
(function(){
const PUBG={};window.PUBG=PUBG;
const rnd=(a,b)=>a+Math.random()*(b-a),ri=n=>Math.floor(Math.random()*n),pk=a=>a[ri(a.length)];
const bp=(f,d,t,v)=>{try{beep(f,d,t||'square',v||.05)}catch(e){}};
const money=()=>{try{cashUI()}catch(e){}};
const pay=p=>{if(cash<p){toast('NOT ENOUGH CASH (£'+p+')');return false}cash-=p;money();return true};
const won=(game,lvl,prize,msg)=>{if(prize){cash+=prize;money()}try{window.PUBS&&PUBS.win(game,lvl||0)}catch(e){czErr(e,'pubgames.js')}if(msg)toast(msg)};

/* ------------------------------------------------------------------ overlay kit */
/* gameOv(title,{w,h,bg}) -> {ov,cv,g,W,H,top,bar,info,btn(label,fn),clear(),close(),loop(fn),on(ev,fn)} */
function gameOv(title,o){o=o||{};if(PUBG.cur)PUBG.cur.close();busy=1;try{inp.gas=inp.brk=inp.hand=inp.pad=0}catch(e){}
 const ov=document.createElement('div');ov.className='pgov';
 ov.style.cssText='position:fixed;inset:0;z-index:72;background:'+(o.bg||'rgba(16,10,6,.97)')+';display:flex;flex-direction:column;align-items:center;justify-content:center;font:bold 13px ui-monospace,monospace;color:#fff;touch-action:none;user-select:none;-webkit-user-select:none;gap:6px;padding:6px;box-sizing:border-box';
 const top=document.createElement('div');top.style.cssText='display:flex;align-items:center;gap:10px;width:100%;max-width:640px;justify-content:space-between';
 const tt=document.createElement('div');tt.textContent=title;tt.style.cssText='color:#ffd870;font-size:15px;letter-spacing:.06em;text-shadow:2px 2px 0 #000';
 const lv=document.createElement('button');lv.textContent='LEAVE';lv.style.cssText='font:bold 12px ui-monospace,monospace;padding:7px 12px;border-radius:9px;border:2px solid #fff;background:#3a2a1e;color:#fff';
 top.append(tt,lv);ov.appendChild(top);
 const info=document.createElement('div');info.style.cssText='min-height:18px;color:#f4e8c8;text-align:center;max-width:640px;font-size:12px;line-height:1.35';ov.appendChild(info);
 const vw=Math.min(innerWidth-12,o.maxW||640),vh=Math.min(innerHeight-150,o.maxH||520),ar=(o.w||600)/(o.h||440),cw=Math.min(vw,vh*ar),ch=cw/ar;
 const cv=document.createElement('canvas');cv.width=o.w||600;cv.height=o.h||440;cv.style.cssText='width:'+cw+'px;height:'+ch+'px;border-radius:10px;background:#000;touch-action:none';ov.appendChild(cv);
 const bar=document.createElement('div');bar.style.cssText='display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:640px;min-height:34px';ov.appendChild(bar);
 document.body.appendChild(ov);
 const S={ov,cv,g:cv.getContext('2d'),W:cv.width,H:cv.height,top,bar,info,raf:0,closed:false,onclose:null,
  btn(label,fn,col){const b=document.createElement('button');b.textContent=label;b.style.cssText='font:bold 12px ui-monospace,monospace;padding:8px 12px;border-radius:9px;border:2px solid #fff;background:'+(col||'#2a5a8a')+';color:#fff;min-width:64px';b.onclick=e=>{e.stopPropagation();fn()};bar.appendChild(b);return b},
  clear(){bar.innerHTML=''},msg(t){info.innerHTML=t},
  pt(e){const r=cv.getBoundingClientRect(),t=e.touches?e.touches[0]||e.changedTouches[0]:e;return[(t.clientX-r.left)/r.width*cv.width,(t.clientY-r.top)/r.height*cv.height]},
  on(ev,fn){cv.addEventListener(ev,e=>{e.preventDefault();fn(S.pt(e),e)},{passive:false})},
  loop(fn){let l=performance.now();const f=t=>{if(S.closed)return;const dt=Math.min(.05,(t-l)/1000);l=t;fn(dt,t/1000);S.raf=requestAnimationFrame(f)};S.raf=requestAnimationFrame(f)},
  close(){if(S.closed)return;S.closed=true;cancelAnimationFrame(S.raf);ov.remove();if(PUBG.cur===S)PUBG.cur=null;busy=0;money();try{S.onclose&&S.onclose()}catch(e){czErr(e,'pubgames.js')}}};
 lv.onclick=()=>S.close();PUBG.cur=S;return S}
PUBG.gameOv=gameOv;
/* a felt/wood background for card and tile games */
function feltBg(g,W,H,c1,c2){const gr=g.createRadialGradient(W/2,H/2,40,W/2,H/2,Math.max(W,H)*.7);gr.addColorStop(0,c1||'#2f6b3a');gr.addColorStop(1,c2||'#173d20');g.fillStyle=gr;g.fillRect(0,0,W,H)}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}

/* ================================================================== CHESS vs THE COLONEL */
/* board: 64 chars, index = r*8+c, r=0 is black's back rank (top). White (you) moves up. */
const PV={p:100,n:320,b:330,r:500,q:900,k:0};
const PST_N=[-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,5,5,0,-20,-40,-30,5,10,15,15,10,5,-30,-30,0,15,20,20,15,0,-30,-30,5,15,20,20,15,5,-30,-30,0,10,15,15,10,0,-30,-40,-20,0,0,0,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50];
const PST_P=[0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0];
const isW=p=>p!=='.'&&p===p.toUpperCase(),isB=p=>p!=='.'&&p===p.toLowerCase();
function chNew(){return{b:('rnbqkbnr'+'pppppppp'+'........'.repeat(4)+'PPPPPPPP'+'RNBQKBNR').split(''),w:true,ck:{K:1,Q:1,k:1,q:1},ep:-1,n:0}}
function attacked(b,sq,byWhite){const r=sq>>3,c=sq&7,own=byWhite?isW:isB,at=(rr_,cc)=>rr_>=0&&rr_<8&&cc>=0&&cc<8?b[rr_*8+cc]:null;
 const pr=byWhite?r+1:r-1;for(const dc of[-1,1]){const p=at(pr,c+dc);if(p&&own(p)&&p.toLowerCase()==='p')return true}
 for(const[dr,dc]of[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]]){const p=at(r+dr,c+dc);if(p&&own(p)&&p.toLowerCase()==='n')return true}
 for(const[dr,dc]of[[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]){let k=1;for(;;){const p=at(r+dr*k,c+dc*k);if(p===null)break;if(p!=='.'){if(own(p)){const t=p.toLowerCase(),diag=dr&&dc;if(t==='q'||(diag&&t==='b')||(!diag&&t==='r')||(k===1&&t==='k'))return true}break}k++}}
 return false}
function genMoves(S){const b=S.b,w=S.w,own=w?isW:isB,opp=w?isB:isW,M=[];
 for(let s=0;s<64;s++){const p=b[s];if(p==='.'||!own(p))continue;const t=p.toLowerCase(),r=s>>3,c=s&7;
  const add=(to,f)=>M.push({f:s,t:to,p,cap:b[to],fl:f||0});
  if(t==='p'){const d=w?-1:1,r1=r+d;if(r1>=0&&r1<8&&b[r1*8+c]==='.'){add(r1*8+c);const sr=w?6:1;if(r===sr&&b[(r+2*d)*8+c]==='.')add((r+2*d)*8+c,2)}
   for(const dc of[-1,1]){const cc=c+dc;if(cc<0||cc>7||r1<0||r1>7)continue;const to=r1*8+cc;if(b[to]!=='.'&&opp(b[to]))add(to);else if(to===S.ep)M.push({f:s,t:to,p,cap:w?'p':'P',fl:3})}}
  else if(t==='n'||t==='k'){const D=t==='n'?[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]]:[[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
   for(const[dr,dc]of D){const rr_=r+dr,cc=c+dc;if(rr_<0||rr_>7||cc<0||cc>7)continue;const to=rr_*8+cc;if(b[to]==='.'||opp(b[to]))add(to)}
   if(t==='k'){const row=w?7:0,K=w?'K':'k',Q=w?'Q':'q';if(s===row*8+4&&!attacked(b,s,!w)){
    if(S.ck[K]&&b[row*8+5]==='.'&&b[row*8+6]==='.'&&b[row*8+7]===(w?'R':'r')&&!attacked(b,row*8+5,!w))add(row*8+6,4);
    if(S.ck[Q]&&b[row*8+3]==='.'&&b[row*8+2]==='.'&&b[row*8+1]==='.'&&b[row*8]===(w?'R':'r')&&!attacked(b,row*8+3,!w))add(row*8+2,5)}}}
  else{const D=t==='b'?[[1,1],[1,-1],[-1,1],[-1,-1]]:t==='r'?[[1,0],[-1,0],[0,1],[0,-1]]:[[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
   for(const[dr,dc]of D){let k=1;for(;;){const rr_=r+dr*k,cc=c+dc*k;if(rr_<0||rr_>7||cc<0||cc>7)break;const to=rr_*8+cc;if(b[to]==='.'){add(to);k++;continue}if(opp(b[to]))add(to);break}}}}
 return M}
function mk(S,m){const b=S.b.slice(),ck=Object.assign({},S.ck);b[m.t]=m.p;b[m.f]='.';
 if(m.fl===3)b[m.t+(S.w?8:-8)]='.';if(m.p.toLowerCase()==='p'&&(m.t<8||m.t>55))b[m.t]=S.w?'Q':'q';
 if(m.fl===4){b[m.t-1]=b[m.t+1];b[m.t+1]='.'}if(m.fl===5){b[m.t+1]=b[m.t-2];b[m.t-2]='.'}
 if(m.p==='K')ck.K=ck.Q=0;if(m.p==='k')ck.k=ck.q=0;for(const[sq,k]of[[63,'K'],[56,'Q'],[7,'k'],[0,'q']])if(m.f===sq||m.t===sq)ck[k]=0;
 return{b,w:!S.w,ck,ep:m.fl===2?(m.f+m.t)/2:-1,n:S.n+1}}
const kingSq=(b,w)=>b.indexOf(w?'K':'k');
function legal(S){return genMoves(S).filter(m=>{const N=mk(S,m);return !attacked(N.b,kingSq(N.b,S.w),!S.w)})}
function evalB(b){let s=0;for(let i=0;i<64;i++){const p=b[i];if(p==='.')continue;const t=p.toLowerCase(),w=p!==t,ix=w?i:(7-(i>>3))*8+(i&7);let v=PV[t];if(t==='n'||t==='b')v+=PST_N[ix]*.5;if(t==='p')v+=PST_P[ix];s+=w?v:-v}return s}
function search(S,d,a,be,ply){const M=legal(S);if(!M.length)return attacked(S.b,kingSq(S.b,S.w),!S.w)?-99999+ply:0;
 if(d===0){const e=evalB(S.b);return S.w?e:-e}
 M.sort((x,y)=>(PV[(y.cap||'.').toLowerCase()]||0)-(PV[(x.cap||'.').toLowerCase()]||0));
 let best=-1e9;for(const m of M){const v=-search(mk(S,m),d-1,-be,-a,ply+1);if(v>best)best=v;if(v>a)a=v;if(a>=be)break}return best}
function aiMove(S,lvl){const M=legal(S);if(!M.length)return null;const d=[1,2,3][lvl];let best=null,bv=-1e9;
 for(const m of M){let v=-search(mk(S,m),d-1,-1e9,1e9,1);if(lvl===0)v+=rnd(-120,120);else if(lvl===1)v+=rnd(-25,25);if(v>bv){bv=v;best=m}}return best}
const GLY={K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙',k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'};
PUBG.chess=function(){const R=window.PUBS&&PUBS.st.chess||{w:[0,0,0],l:[0,0,0]};
 const O=gameOv('CHESS vs THE COLONEL',{w:480,h:480,bg:'rgba(20,12,6,.97)'});const g=O.g;let S=null,lvl=0,sel=-1,targets=[],over=0,last=null,think=0;
 const LV=['A FRIENDLY GAME','CLUB STRENGTH','THE COLONEL AT HIS BEST'],PR=[15,40,120];
 function menu(){O.clear();O.msg('"Fancy a game? I was regimental champion, you know." Pick how hard he plays. Win to collect the prize.<br>YOUR RECORD: '+[0,1,2].map(i=>R.w[i]+'-'+R.l[i]).join(' · '));
  [0,1,2].forEach(i=>O.btn(LV[i]+' · WIN £'+PR[i],()=>start(i),['#2a6a3a','#8a6a1a','#8a2a1a'][i]));draw()}
 function start(l){lvl=l;S=chNew();sel=-1;targets=[];over=0;last=null;O.clear();O.btn('RESIGN',()=>{if(!over)end(-1,'You resign. "Good game, old chap."')},'#6a2a2a');O.msg('You are white. Tap a piece, then tap where it goes.');draw()}
 function end(res,txt){over=1;O.clear();if(res>0){R.w[lvl]++;won('chess',lvl,PR[lvl],'♟ YOU BEAT THE COLONEL! +£'+PR[lvl]);if(lvl===2)try{TOWNSHOPS.col["THE COLONEL'S MEDAL"]=1}catch(e){}}else if(res<0)R.l[lvl]++;
  if(window.PUBS)PUBS.st.chess=R;O.msg(txt);O.btn('PLAY AGAIN',menu,'#2a5a8a');draw()}
 function after(){const M=legal(S);if(!M.length){const chk=attacked(S.b,kingSq(S.b,S.w),!S.w);if(S.w)end(chk?-1:0,chk?'Checkmate. "Steady on, you nearly had me there."':'Stalemate. A draw.');else end(chk?1:0,chk?'CHECKMATE! The Colonel shakes your hand.':'Stalemate. A draw.');return true}if(S.n>200){end(0,'A long game. You agree a draw.');return true}return false}
 function aiTurn(){think=1;draw();setTimeout(()=>{if(O.closed||over)return;const m=aiMove(S,lvl);think=0;if(m){S=mk(S,m);last=m;bp(330,.05,'triangle')}if(!after()){const chk=attacked(S.b,kingSq(S.b,true),false);O.msg(chk?'CHECK! Your king is under attack.':'Your move.')}draw()},60)}
 O.on('pointerdown',([x,y])=>{if(!S||over||!S.w||think)return;const c=Math.floor(x/60),r=Math.floor(y/60);if(c<0||c>7||r<0||r>7)return;const sq=r*8+c;
  const mv=targets.find(m=>m.t===sq);if(mv){S=mk(S,mv);last=mv;sel=-1;targets=[];bp(440,.05,'triangle');draw();if(!after())aiTurn();return}
  if(isW(S.b[sq])){sel=sq;targets=legal(S).filter(m=>m.f===sq)}else{sel=-1;targets=[]}draw()});
 function draw(){g.clearRect(0,0,480,480);for(let r=0;r<8;r++)for(let c=0;c<8;c++){const sq=r*8+c;g.fillStyle=(r+c)%2?'#8a5a32':'#e8d2a8';if(last&&(sq===last.f||sq===last.t))g.fillStyle=(r+c)%2?'#a08a2a':'#e8e08a';if(sq===sel)g.fillStyle='#6aa04a';g.fillRect(c*60,r*60,60,60)}
  if(S){for(const m of targets){const c=m.t&7,r=m.t>>3;g.fillStyle=m.cap&&m.cap!=='.'?'rgba(200,40,40,.55)':'rgba(40,120,40,.55)';g.beginPath();g.arc(c*60+30,r*60+30,m.cap&&m.cap!=='.'?26:10,0,7);g.fill()}
   g.textAlign='center';g.textBaseline='middle';g.font='46px "Segoe UI Symbol","Noto Sans Symbols2","DejaVu Sans",serif';
   for(let i=0;i<64;i++){const p=S.b[i];if(p==='.')continue;const c=i&7,r=i>>3,ch=GLY[p.toLowerCase()]+'︎';g.lineWidth=3;g.strokeStyle=isW(p)?'#1a1208':'#f4ead4';g.strokeText(ch,c*60+30,r*60+33);g.fillStyle=isW(p)?'#fffaf0':'#141010';g.fillText(ch,c*60+30,r*60+33)}
   if(think){g.fillStyle='rgba(0,0,0,.45)';g.fillRect(0,215,480,50);g.fillStyle='#ffd870';g.font='bold 18px monospace';g.fillText('THE COLONEL IS THINKING...',240,240)}}
  else{g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,0,480,480);g.fillStyle='#ffd870';g.textAlign='center';g.font='bold 22px Georgia';g.fillText('THE DUKE OF WELLINGTON',240,210);g.font='16px Georgia';g.fillText('chess club · Wednesdays',240,240)}}
 menu()};

/* ================================================================== DOMINOES (double six, draw game) */
PUBG.dominoes=function(stake){stake=stake||2;const O=gameOv('DOMINOES vs THE OLD BOYS',{w:600,h:420,bg:'rgba(12,16,10,.97)'}),g=O.g;
 let Bone,me,ai,chain,L,Rt,over,pick=-1,turn;
 function deal(){if(!pay(stake))return O.close();Bone=[];for(let a=0;a<=6;a++)for(let b=a;b<=6;b++)Bone.push([a,b]);Bone.sort(()=>Math.random()-.5);me=Bone.splice(0,7);ai=Bone.splice(0,7);chain=[];over=0;pick=-1;
  /* highest double leads */let lead=null,who=0;for(let d=6;d>=0&&!lead;d--){const i=me.findIndex(t=>t[0]===d&&t[1]===d),j=ai.findIndex(t=>t[0]===d&&t[1]===d);if(i>=0){lead=me.splice(i,1)[0];who=0}else if(j>=0){lead=ai.splice(j,1)[0];who=1}}
  if(!lead){lead=me.splice(0,1)[0];who=0}chain=[lead];L=lead[0];Rt=lead[1];turn=who?0:1;O.msg((who?'Old Bert':'You')+' led the '+lead.join('-')+'.');if(turn===1)setTimeout(aiPlay,700);buttons();draw()}
 const fits=t=>t[0]===L||t[1]===L||t[0]===Rt||t[1]===Rt;
 function place(t,side){if(side==='L'){if(t[1]===L){chain.unshift(t);L=t[0]}else{chain.unshift([t[1],t[0]]);L=t[1]}}else{if(t[0]===Rt){chain.push(t);Rt=t[1]}else{chain.push([t[1],t[0]]);Rt=t[0]}}bp(500,.04,'square')}
 const pips=h=>h.reduce((s,t)=>s+t[0]+t[1],0);
 function check(){if(!me.length)return fin(1,'You knocked out your last domino!');if(!ai.length)return fin(-1,'Old Bert is out. "Chalk it up, lad."');
  const canMe=me.some(fits)||Bone.length,canAi=ai.some(fits)||Bone.length;if(!canMe&&!canAi){const a=pips(me),b=pips(ai);return fin(a<b?1:a>b?-1:0,'Blocked! Your spots: '+a+' · Bert\'s: '+b)}return false}
 function fin(r,t){over=1;if(r>0)won('dominoes',0,stake*2,'🁫 YOU WIN THE DOMINOES! +£'+stake*2);else if(r===0){cash+=stake;money()}O.msg(t+(r>0?' You win £'+stake*2+'.':r<0?' You lose.':' A draw, stake back.'));buttons();draw();return true}
 function aiPlay(){if(over||O.closed)return;let opts=ai.map((t,i)=>[t,i]).filter(([t])=>fits(t));while(!opts.length&&Bone.length){ai.push(Bone.pop());opts=ai.map((t,i)=>[t,i]).filter(([t])=>fits(t))}
  if(opts.length){opts.sort((a,b)=>b[0][0]+b[0][1]-a[0][0]-a[0][1]);const[t,i]=opts[0];ai.splice(i,1);place(t,(t[0]===Rt||t[1]===Rt)?'R':'L');O.msg('Bert plays the '+t.join('-')+'. Your turn.')}else O.msg('Bert knocks (can\'t go). Your turn.');
  turn=0;if(!check()){if(!me.some(fits)&&!Bone.length){O.msg('You can\'t go either.');turn=1;setTimeout(aiPlay,700)}}buttons();draw()}
 function myPlay(i,side){const t=me[i];me.splice(i,1);place(t,side);pick=-1;turn=1;buttons();draw();if(!check())setTimeout(aiPlay,650)}
 function buttons(){O.clear();if(over){O.btn('ANOTHER GAME (£'+stake+')',deal,'#2a6a3a');return}
  if(turn===0){if(pick>=0){const t=me[pick],l=t[0]===L||t[1]===L,r=t[0]===Rt||t[1]===Rt;if(l)O.btn('◀ PLAY LEFT',()=>myPlay(pick,'L'),'#2a6a3a');if(r)O.btn('PLAY RIGHT ▶',()=>myPlay(pick,'R'),'#2a6a3a')}
   if(!me.some(fits)){if(Bone.length)O.btn('DRAW FROM THE BONEYARD ('+Bone.length+')',()=>{me.push(Bone.pop());bp(300,.04);buttons();draw()},'#6a4a1a');else O.btn('KNOCK (PASS)',()=>{turn=1;buttons();setTimeout(aiPlay,500)},'#6a2a2a')}}}
 O.on('pointerdown',([x,y])=>{if(over||turn!==0)return;const n=me.length,tw=46,gap=8,x0=(600-(n*(tw+gap)-gap))/2;if(y<330||y>410)return;const i=Math.floor((x-x0)/(tw+gap));if(i<0||i>=n)return;
  if(!fits(me[i])){O.msg('That one doesn\'t fit either end ('+L+' or '+Rt+').');return}const t=me[i],l=t[0]===L||t[1]===L,r=t[0]===Rt||t[1]===Rt;if(l!==r){myPlay(i,l?'L':'R');return}pick=i;O.msg('Fits both ends. Choose a side.');buttons();draw()});
 function tile(x,y,w,h,a,b,hi,back){g.fillStyle=back?'#2a2a30':'#f6f2e6';rr(g,x,y,w,h,6);g.fill();g.lineWidth=2;g.strokeStyle=hi?'#ffd040':'#2a2420';g.stroke();if(back)return;
  const hz=w>h;g.strokeStyle='#2a2420';g.beginPath();if(hz){g.moveTo(x+w/2,y+4);g.lineTo(x+w/2,y+h-4)}else{g.moveTo(x+4,y+h/2);g.lineTo(x+w-4,y+h/2)}g.stroke();
  const pipsAt=(n,cx,cy,s)=>{const P={0:[],1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]}[n];g.fillStyle='#1a1410';for(const[px,py]of P){g.beginPath();g.arc(cx+px*s,cy+py*s,s*.42,0,7);g.fill()}};
  if(hz){pipsAt(a,x+w/4,y+h/2,h/5);pipsAt(b,x+3*w/4,y+h/2,h/5)}else{pipsAt(a,x+w/2,y+h/4,w/5);pipsAt(b,x+w/2,y+3*h/4,w/5)}}
 function draw(){feltBg(g,600,420,'#3a5a2a','#1a2a12');g.fillStyle='#d8c890';g.font='bold 13px monospace';g.textAlign='left';g.fillText('OLD BERT · '+ai.length+' LEFT',12,22);g.textAlign='right';g.fillText('BONEYARD '+Bone.length,588,22);
  for(let i=0;i<ai.length;i++)tile(16+i*22,30,18,34,0,0,0,1);
  /* the chain, snaking in rows */const tw=40,th=20,per=13;const rows=Math.ceil(chain.length/per);let y0=150-rows*14;chain.forEach((t,i)=>{const row=Math.floor(i/per),col=i%per,x=row%2?600-30-(col+1)*(tw+3):30+col*(tw+3);tile(x,y0+row*30,tw,th,row%2?t[1]:t[0],row%2?t[0]:t[1],0)});
  g.fillStyle='#ffd870';g.textAlign='center';g.font='bold 14px monospace';g.fillText('ENDS:  '+L+'  ·  '+Rt,300,300);
  const n=me.length,w=46,gap=8,x0=(600-(n*(w+gap)-gap))/2;me.forEach((t,i)=>tile(x0+i*(w+gap),330,w,80,t[0],t[1],i===pick||(turn===0&&!over&&fits(t))))}
 deal()};

/* ================================================================== CRIBBAGE (to 61, vs Major Briggs) */
const SU=['♠','♥','♦','♣'],RK=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const cv_=c=>Math.min(10,c.r+1);
function crScore(hand,st,crib){const all=st?hand.concat([st]):hand.slice();let s=0;const n=all.length;
 for(let m=1;m<(1<<n);m++){let t=0;for(let i=0;i<n;i++)if(m>>i&1)t+=cv_(all[i]);if(t===15)s+=2}
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(all[i].r===all[j].r)s+=2;
 const cnt=Array(13).fill(0);for(const c of all)cnt[c.r]++;let best=0,mult=0;for(let i=0;i<13;i++){let j=i,m=1;while(j<13&&cnt[j]){m*=cnt[j];j++}const len=j-i;if(len>=3&&len>best){best=len;mult=m}}s+=best*mult;
 if(hand.length===4&&hand.every(c=>c.s===hand[0].s)){if(st&&st.s===hand[0].s)s+=5;else if(!crib)s+=4}
 if(st)for(const c of hand)if(c.r===10&&c.s===st.s)s+=1;return s}
function pegPts(pile,count){let s=0;if(count===15)s+=2;if(count===31)s+=2;const n=pile.length;
 let k=1;while(k<n&&pile[n-1-k].r===pile[n-1].r)k++;s+=[0,0,2,6,12][k];
 for(let L=n;L>=3;L--){const last=pile.slice(n-L).map(c=>c.r).sort((a,b)=>a-b);let ok=true;for(let i=1;i<L;i++)if(last[i]!==last[0]+i){ok=false;break}if(ok){s+=L;break}}return s}
PUBG.cribbage=function(stake){stake=stake||2;const O=gameOv('CRIBBAGE vs MAJOR BRIGGS',{w:600,h:420,bg:'rgba(10,14,20,.97)'}),g=O.g;
 let deck,me,ai,crib,st,dealer=1,sc=[0,0],phase='',sel=[],pile=[],count=0,played=[[],[]],turn=0,goSaid=[0,0],lastBy=-1,log='',over=0;
 const card=(x,y,c,hi,back,sm)=>{const w=sm?34:48,h=sm?50:70;g.fillStyle=back?'#7a1a2a':'#fbfaf6';rr(g,x,y,w,h,6);g.fill();g.lineWidth=2;g.strokeStyle=hi?'#ffd040':'#333';g.stroke();if(back){g.strokeStyle='#e8c070';g.strokeRect(x+5,y+5,w-10,h-10);return}g.fillStyle=c.s===1||c.s===2?'#c81e1e':'#141414';g.font='bold '+(sm?13:17)+'px Georgia';g.textAlign='left';g.fillText(RK[c.r],x+4,y+(sm?15:20));g.font=(sm?18:26)+'px serif';g.textAlign='center';g.fillText(SU[c.s],x+w/2,y+h*.68)};
 function add(p,n,why){if(!n)return false;sc[p]+=n;log=(p?'Major Briggs':'You')+': '+why+' +'+n;bp(p?300:660,.06);if(sc[p]>=61){finish(p);return true}return false}
 function finish(p){over=1;phase='done';if(p===0)won('cribbage',0,stake*2,'🃏 YOU WIN AT CRIBBAGE! +£'+stake*2);O.msg(p===0?'You peg out first and win £'+stake*2+'! "Well played, that man."':'The Major pegs out. "Skunked you there, almost."');O.clear();O.btn('ANOTHER GAME (£'+stake+')',newGame,'#2a6a3a');draw()}
 function newGame(){if(!pay(stake))return O.close();sc=[0,0];over=0;dealer=Math.random()<.5?0:1;round()}
 function round(){deck=[];for(let s=0;s<4;s++)for(let r=0;r<13;r++)deck.push({r,s});deck.sort(()=>Math.random()-.5);me=deck.splice(0,6);ai=deck.splice(0,6);me.sort((a,b)=>a.r-b.r);crib=[];st=null;sel=[];pile=[];count=0;played=[[],[]];goSaid=[0,0];log='';
  /* the Major keeps the four that score best */let bk=null,bv=-1;for(let i=0;i<6;i++)for(let j=i+1;j<6;j++){const k=ai.filter((_,x)=>x!==i&&x!==j),v=crScore(k,null,false)+(dealer===1?1:-1)*(cv_(ai[i])+cv_(ai[j])===15?2:0);if(v>bv){bv=v;bk=[i,j]}}crib.push(ai[bk[0]],ai[bk[1]]);ai=ai.filter((_,x)=>x!==bk[0]&&x!==bk[1]);
  phase='discard';O.msg((dealer?'The Major deals. ':'You deal. ')+'Pick two cards for '+(dealer?'HIS':'YOUR')+' crib.');O.clear();O.btn('PUT THEM IN THE CRIB',discard,'#2a5a8a');draw()}
 function discard(){if(sel.length!==2){O.msg('Pick exactly two cards.');return}crib.push(...sel.map(i=>me[i]));me=me.filter((_,i)=>!sel.includes(i));sel=[];st=deck.pop();
  if(st.r===10&&add(dealer,2,'his heels'))return;phase='peg';turn=dealer?0:1;O.clear();O.msg('Pegging: play cards to 31. Tap a card to play it.');draw();if(turn===1)setTimeout(aiPeg,700)}
 const canPlay=p=>(p?ai:me).some(c=>!played[p].includes(c)&&count+cv_(c)<=31);
 const left=p=>(p?ai:me).filter(c=>!played[p].includes(c));
 function playCard(p,c){played[p].push(c);pile.push(c);count+=cv_(c);lastBy=p;bp(520,.04);if(add(p,pegPts(pile,count),count===31?'thirty-one':count===15?'fifteen':'pegging'))return true;if(count===31)resetCount();return false}
 function resetCount(){pile=[];count=0;goSaid=[0,0]}
 function next(){if(over)return;if(!left(0).length&&!left(1).length){if(count>0&&count<31&&add(lastBy,1,'last card'))return;show();return}
  const o=1-turn;if(canPlay(o)){turn=o}else if(canPlay(turn)){/* other says go */goSaid[o]=1}else{if(count>0&&count<31&&add(lastBy,1,'go'))return;resetCount();turn=lastBy===0?1:0;if(!left(turn).length)turn=1-turn}
  draw();if(turn===1)setTimeout(aiPeg,650);else if(!canPlay(0)){setTimeout(next,500)}}
 function aiPeg(){if(over||O.closed||phase!=='peg')return;const L=left(1).filter(c=>count+cv_(c)<=31);if(!L.length){next();return}let best=L[0],bv=-1;for(const c of L){const v=pegPts(pile.concat([c]),count+cv_(c))*10+(count+cv_(c)===5||count+cv_(c)===21?-3:0)+cv_(c)*.1;if(v>bv){bv=v;best=c}}if(playCard(1,best))return;draw();next()}
 O.on('pointerdown',([x,y])=>{if(over)return;if(phase==='discard'){const n=me.length,w=48,gap=10,x0=(600-(n*(w+gap)-gap))/2;if(y<330||y>400)return;const i=Math.floor((x-x0)/(w+gap));if(i<0||i>=n)return;const k=sel.indexOf(i);if(k>=0)sel.splice(k,1);else if(sel.length<2)sel.push(i);draw();return}
  if(phase==='peg'&&turn===0){const L=left(0),w=48,gap=10,x0=(600-(L.length*(w+gap)-gap))/2;if(y<330||y>400)return;const i=Math.floor((x-x0)/(w+gap));if(i<0||i>=L.length)return;const c=L[i];if(count+cv_(c)>31){O.msg('Too high: the count would go over 31.');return}if(playCard(0,c))return;O.msg('Count '+count+'.');draw();next()}});
 function show(){phase='show';const pone=1-dealer,steps=[[pone,pone?ai:me,false,(pone?'The Major\'s':'Your')+' hand'],[dealer,dealer?ai:me,false,(dealer?'The Major\'s':'Your')+' hand'],[dealer,crib,true,(dealer?'The Major\'s':'Your')+' crib']];let k=0;
  const stepFn=()=>{if(over)return;if(k>=steps.length){dealer=1-dealer;O.clear();O.btn('NEXT HAND',round,'#2a5a8a');O.msg('Hand over. '+(dealer?'The Major':'You')+' deal next.');draw();return}const[p,h,isC,nm]=steps[k++];const v=crScore(h,st,isC);O.msg(nm+' with the '+RK[st.r]+SU[st.s]+' scores '+v+'.');showing=h;if(add(p,v,nm.toLowerCase()))return;draw();O.clear();O.btn('CONTINUE',stepFn,'#2a5a8a')};let showing=null;showH=()=>showing;O.clear();stepFn()};
 let showH=()=>null;
 function draw(){feltBg(g,600,420,'#1f4a6a','#0e2236');
  /* score board */g.fillStyle='#3a2414';rr(g,10,8,580,34,8);g.fill();for(let p=0;p<2;p++){const y=18+p*12;g.fillStyle='#5a3a24';g.fillRect(70,y,500,6);g.fillStyle=p?'#e04040':'#40c0ff';g.fillRect(70,y,500*Math.min(61,sc[p])/61,6)}
  g.fillStyle='#fff';g.font='bold 11px monospace';g.textAlign='left';g.fillText('YOU '+sc[0],14,25);g.fillText('MAJ '+sc[1],14,38);
  /* opponent hand */const oh=phase==='show'&&showH()===ai?ai:null;(phase==='peg'?left(1):ai).forEach((c,i)=>card(170+i*40,54,c,0,!oh,1));
  if(st)card(40,150,st,0,0);else card(40,150,null,0,1);g.fillStyle='#dde';g.font='11px monospace';g.textAlign='center';g.fillText('STARTER',64,236);
  if(phase==='show'&&showH()===crib)crib.forEach((c,i)=>card(470+(i%2)*40,130+Math.floor(i/2)*58,c,0,0,1));else{g.fillStyle='#dde';g.fillText((dealer?'MAJOR\'S':'YOUR')+' CRIB',530,236);for(let i=0;i<Math.min(4,crib.length);i++)card(500+i*4,150+i*2,null,0,1,1)}
  if(phase==='peg'){pile.forEach((c,i)=>card(140+i*36,150,c,0,0,1));g.fillStyle='#ffd870';g.font='bold 22px monospace';g.textAlign='center';g.fillText('COUNT '+count,300,280)}
  g.fillStyle='#f4e8c8';g.font='12px monospace';g.textAlign='center';g.fillText(log,300,310);
  const mine=phase==='peg'?left(0):me,w=48,gap=10,x0=(600-(mine.length*(w+gap)-gap))/2;mine.forEach((c,i)=>card(x0+i*(w+gap),330-(phase==='discard'&&sel.includes(i)?12:0),c,phase==='discard'&&sel.includes(i)||(phase==='peg'&&turn===0&&count+cv_(c)<=31),0))}
 O.msg('First to 61 wins. £'+stake+' a game.');O.clear();O.btn('DEAL (£'+stake+')',newGame,'#2a6a3a');g.fillStyle='#0e2236';g.fillRect(0,0,600,420);g.fillStyle='#ffd870';g.font='bold 20px Georgia';g.textAlign='center';g.fillText('Fifteen two, fifteen four...',300,210)};

/* ================================================================== ARM WRESTLING */
PUBG.arm=function(foe,stake){stake=stake||5;foe=foe||{n:'BIG MICK',str:1};const O=gameOv('ARM WRESTLE '+foe.n,{w:520,h:360,bg:'rgba(26,10,8,.97)'}),g=O.g;
 let st=null;const myStr=()=>{try{const B=window.BOXING&&BOXING.st||window.BOXING;return 1+Math.min(.6,((B&&(B.pow||B.power||0))|0)/60)}catch(e){return 1}};
 function start(){if(!pay(stake))return O.close();st={pos:0,t:0,ring:0,taps:0,res:0,flash:0,foeP:.55*foe.str};O.clear();O.msg('TAP fast to push. Tap when the ring turns GREEN for a big heave.');}
 O.on('pointerdown',()=>{if(!st||st.res)return;const green=Math.abs(Math.sin(st.ring))>.92;st.pos+=(green?.07:.022)*myStr();st.flash=green?.25:0;bp(green?700:420,.03)});
 O.loop((dt)=>{g.fillStyle='#2a1410';g.fillRect(0,0,520,360);g.fillStyle='#5a3420';g.fillRect(60,210,400,30);
  if(st&&!st.res){st.t+=dt;st.ring+=dt*(2.2+st.t*.08);st.pos-=dt*st.foeP*(.8+.4*Math.sin(st.t*1.7)+st.t*.02);if(st.pos>1){st.res=1;won('arm',0,stake*2,'💪 YOU BEAT '+foe.n+'! +£'+stake*2);O.msg('YOU WIN! '+foe.n+' rubs his arm. "Rematch next week."');O.clear();O.btn('AGAIN (£'+stake+')',start,'#8a2a1a')}else if(st.pos<-1){st.res=-1;O.msg(foe.n+' slams your hand down. "Better luck next time, pal."');O.clear();O.btn('AGAIN (£'+stake+')',start,'#8a2a1a')}}
  const a=st?st.pos:0,ang=-a*1.1;g.save();g.translate(260,215);g.rotate(ang);g.fillStyle='#e0b090';g.fillRect(-14,-120,28,120);g.beginPath();g.arc(0,-124,22,0,7);g.fill();g.restore();
  g.fillStyle='#c89060';g.fillRect(70,190,170,26);g.fillStyle='#d8a070';g.fillRect(280,190,170,26);
  g.fillStyle='#fff';g.font='bold 14px monospace';g.textAlign='left';g.fillText('YOU',70,180);g.textAlign='right';g.fillText(foe.n,450,180);
  g.fillStyle='#333';g.fillRect(110,300,300,16);g.fillStyle=a>=0?'#40c060':'#d04040';g.fillRect(260,300,a*150,16);g.strokeStyle='#fff';g.strokeRect(110,300,300,16);
  if(st&&!st.res){const green=Math.abs(Math.sin(st.ring))>.92;g.strokeStyle=green?'#40ff60':'#ffd040';g.lineWidth=6;g.beginPath();g.arc(260,90,20+Math.abs(Math.sin(st.ring))*22,0,7);g.stroke();g.lineWidth=1}
  if(st&&st.flash>0){st.flash-=dt;g.fillStyle='rgba(120,255,120,.18)';g.fillRect(0,0,520,360)}});
 O.msg(foe.n+' cracks his knuckles. £'+stake+' says you can\'t beat him.');O.clear();O.btn('TAKE HIM ON (£'+stake+')',start,'#8a2a1a')};

/* ================================================================== BAR BILLIARDS */
PUBG.barBilliards=function(stake){stake=stake||2;const W=360,H=600,O=gameOv('BAR BILLIARDS vs STAN',{w:W,h:H,maxW:420,bg:'rgba(14,20,12,.97)'}),g=O.g;
 const HOLES=[[180,110,200],[120,170,100],[240,170,100],[180,230,50],[100,290,25],[260,290,25],[180,330,10],[140,380,10],[220,380,10]].map(([x,y,v])=>({x,y,v}));
 const PINS=[[180,145,'black'],[150,200,'white'],[210,200,'white']].map(([x,y,c])=>({x,y,c,down:0}));
 let balls=[],shots=0,score=0,timer=0,aim=null,drag=null,state='menu',target=0,left=0;const R=8;
 function start(){if(!pay(stake))return O.close();target=ri(4)*50+350;balls=[];left=7;score=0;timer=75;state='play';for(const p of PINS)p.down=0;cue();O.clear();O.msg('Stan scored '+target+'. Beat him before the table locks. Drag back from the white ball to aim, let go to shoot.')}
 function cue(){if(left<=0)return;left--;balls.push({x:180,y:540,vx:0,vy:0,red:left===0,in:0,cue:1})}
 const moving=()=>balls.some(b=>!b.in&&(Math.abs(b.vx)>2||Math.abs(b.vy)>2));
 const cueBall=()=>balls.find(b=>b.cue&&!b.in);
 O.on('pointerdown',p=>{if(state!=='play'||moving())return;const c=cueBall();if(c&&Math.hypot(p[0]-c.x,p[1]-c.y)<60)drag=p});
 O.on('pointermove',p=>{if(drag)aim=p});
 O.on('pointerup',()=>{if(!drag||!aim){drag=null;return}const c=cueBall();const dx=drag[0]-aim[0],dy=drag[1]-aim[1],l=Math.min(160,Math.hypot(dx,dy));if(c&&l>8){c.vx=dx/Math.hypot(dx,dy)*l*7;c.vy=dy/Math.hypot(dx,dy)*l*7;c.cue=0;shots++;bp(220,.05,'triangle')}drag=aim=null});
 O.loop(dt=>{if(state==='play'){timer-=dt;for(let k=0;k<3;k++)step(dt/3);if(!moving()&&!cueBall()){if(timer<=0||left<=0){end()}else cue()}if(timer<=0&&!moving())end()}draw()});
 function step(dt){for(const b of balls){if(b.in)continue;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(.42,dt);b.vy*=Math.pow(.42,dt);if(b.x<30+R){b.x=30+R;b.vx=-b.vx*.8}if(b.x>W-30-R){b.x=W-30-R;b.vx=-b.vx*.8}if(b.y<40+R){b.y=40+R;b.vy=-b.vy*.8}if(b.y>H-30-R){b.y=H-30-R;b.vy=-b.vy*.8}
   for(const h of HOLES)if(Math.hypot(b.x-h.x,b.y-h.y)<11&&Math.hypot(b.vx,b.vy)<900){b.in=1;const v=h.v*(b.red?2:1);score+=v;bp(600+h.v,.08);break}
   for(const p of PINS)if(!p.down&&Math.hypot(b.x-p.x,b.y-p.y)<R+5){p.down=1;bp(150,.2,'sawtooth');if(p.c==='black'){score=0;O.msg('You knocked the BLACK mushroom: your score is wiped!')}else{score=Math.max(0,score-50);O.msg('A white mushroom: minus 50.')}b.vx=-b.vx*.5;b.vy=-b.vy*.5}}
  for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){const a=balls[i],b=balls[j];if(a.in||b.in)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d<2*R&&d>0){const nx=dx/d,ny=dy/d,p=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;if(p>0){a.vx-=p*nx;a.vy-=p*ny;b.vx+=p*nx;b.vy+=p*ny}const o=(2*R-d)/2;a.x-=nx*o;a.y-=ny*o;b.x+=nx*o;b.y+=ny*o}}}
 function end(){if(state!=='play')return;state='over';const w=score>target;if(w)won('barbilliards',0,stake*2,'🎱 BAR BILLIARDS WIN! '+score+' vs '+target+' · +£'+stake*2);O.msg((w?'You win, '+score+' to '+target+'!':'The table locks. '+score+' to Stan\'s '+target+'.'));O.clear();O.btn('AGAIN (£'+stake+')',start,'#2a6a3a')}
 function draw(){g.fillStyle='#3a2414';g.fillRect(0,0,W,H);g.fillStyle='#1f6a34';g.fillRect(30,40,W-60,H-70);g.strokeStyle='#d8c890';g.beginPath();g.moveTo(30,500);g.lineTo(W-30,500);g.stroke();
  for(const h of HOLES){g.fillStyle='#050505';g.beginPath();g.arc(h.x,h.y,10,0,7);g.fill();g.fillStyle='#f0e0a0';g.font='bold 10px monospace';g.textAlign='center';g.fillText(h.v,h.x,h.y-14)}
  for(const p of PINS){if(p.down)continue;g.fillStyle=p.c==='black'?'#111':'#f4f4f4';g.strokeStyle='#888';g.beginPath();g.arc(p.x,p.y,6,0,7);g.fill();g.stroke()}
  for(const b of balls){if(b.in)continue;g.fillStyle=b.red?'#d02020':'#f8f8f0';g.beginPath();g.arc(b.x,b.y,R,0,7);g.fill()}
  const c=cueBall();if(drag&&aim&&c){g.strokeStyle='rgba(255,255,255,.6)';g.beginPath();g.moveTo(c.x,c.y);g.lineTo(c.x+(drag[0]-aim[0])*1.6,c.y+(drag[1]-aim[1])*1.6);g.stroke()}
  g.fillStyle='#fff';g.font='bold 14px monospace';g.textAlign='left';g.fillText('SCORE '+score,34,26);g.textAlign='right';g.fillText(state==='play'?'BALLS '+left+' · '+Math.max(0,Math.ceil(timer))+'s':'',W-34,26);if(target){g.textAlign='center';g.fillText('STAN '+target,W/2,26)}}
 O.msg('The old English table: pot balls in the holes for points (the red counts double), but don\'t knock the mushrooms. A black one wipes your score.');O.clear();O.btn('PLAY STAN (£'+stake+')',start,'#2a6a3a');draw()};

/* ================================================================== QUIZ MACHINE */
const QM=[['WHICH PLANET IS KNOWN AS THE RED PLANET?',['MARS','VENUS','JUPITER','SATURN']],['HOW MANY SIDES HAS A HEXAGON?',['6','5','7','8']],['WHAT IS THE CAPITAL OF SCOTLAND?',['EDINBURGH','GLASGOW','ABERDEEN','DUNDEE']],['WHICH IS THE LONGEST RIVER IN THE UK?',['SEVERN','THAMES','TRENT','WYE']],['HOW MANY PLAYERS IN A CRICKET TEAM?',['11','10','12','9']],
 ['WHAT DO BEES MAKE?',['HONEY','JAM','WAX FRUIT','SYRUP']],['WHICH METAL IS LIQUID AT ROOM TEMPERATURE?',['MERCURY','IRON','TIN','LEAD']],['WHAT COLOUR IS A LONDON BUS?',['RED','BLUE','GREEN','YELLOW']],['HOW MANY MINUTES IN A DAY?',['1440','1200','1000','1600']],['WHAT IS FROZEN WATER CALLED?',['ICE','STEAM','FROST','SLEET']],
 ['WHICH BIRD IS A SYMBOL OF PEACE?',['DOVE','CROW','EAGLE','ROBIN']],['WHAT IS 7 x 8?',['56','54','58','64']],['IN WHICH SPORT IS A SHUTTLECOCK USED?',['BADMINTON','TENNIS','SQUASH','CROQUET']],['WHAT IS THE LARGEST OCEAN?',['PACIFIC','ATLANTIC','INDIAN','ARCTIC']],['HOW MANY STRINGS ON A VIOLIN?',['4','5','6','3']],
 ['WHAT GAS DO PLANTS BREATHE IN?',['CARBON DIOXIDE','OXYGEN','HELIUM','NITROGEN']],['WHICH ANIMAL IS THE TALLEST?',['GIRAFFE','ELEPHANT','CAMEL','HORSE']],['WHAT YEAR DID THE TITANIC SINK?',['1912','1905','1921','1899']],['HOW MANY HOURS IN A WEEK?',['168','148','172','160']],['WHAT IS THE HARDEST NATURAL SUBSTANCE?',['DIAMOND','GRANITE','STEEL','QUARTZ']]];
PUBG.quizMachine=function(){const O=gameOv('QUIZ MACHINE · £1',{w:520,h:340,bg:'rgba(8,10,30,.97)'}),g=O.g;const LAD=[0,1,2,3,5,8,12,20];let st=null;
 function start(){if(!pay(1))return O.close();const pool=(window.PASTIMES2&&PASTIMES2.QS||[]).map(q=>[q[0],q[1].slice(),q[2]]).map(q=>{const c=q[1][q[2]];return[q[0],[c,...q[1].filter((_,i)=>i!==q[2])]]}).concat(QM).sort(()=>Math.random()-.5);st={q:pool,i:0,lvl:0,t:10,ans:null};ask()}
 function ask(){const q=st.q[st.i];st.t=10;st.opts=q[1].slice().sort(()=>Math.random()-.5);st.correct=q[1][0];O.clear();st.opts.forEach(o=>O.btn(o,()=>answer(o),'#2a3a8a'));if(st.lvl>0)O.btn('COLLECT £'+LAD[st.lvl],collect,'#2a7a3a');O.msg('QUESTION '+(st.lvl+1)+' · NEXT RUNG £'+LAD[st.lvl+1])}
 function answer(o){if(!st||st.ans)return;if(o===st.correct){st.lvl++;bp(880,.08);if(st.lvl>=LAD.length-1){collect();return}st.i++;ask()}else{bp(150,.3,'sawtooth');O.msg('WRONG! It was '+st.correct+'. You lose the lot.');st.ans=1;O.clear();O.btn('ANOTHER GO (£1)',start,'#2a3a8a')}}
 function collect(){const w=LAD[st.lvl];won('quizmachine',0,w,w?'🧠 QUIZ MACHINE PAYS £'+w:null);O.msg('You collect £'+w+'.');st.ans=1;O.clear();O.btn('ANOTHER GO (£1)',start,'#2a3a8a')}
 O.loop(dt=>{g.fillStyle='#0a0c2a';g.fillRect(0,0,520,340);for(let i=0;i<LAD.length;i++){const y=300-i*36;g.fillStyle=st&&i===st.lvl?'#ffd040':st&&i<st.lvl?'#2a8a3a':'#1a2050';g.fillRect(20,y,80,28);g.fillStyle='#fff';g.font='bold 13px monospace';g.textAlign='center';g.fillText('£'+LAD[i],60,y+19)}
  if(st&&!st.ans){st.t-=dt;if(st.t<=0){answer('__')}const q=st.q[st.i];g.fillStyle='#fff';g.font='bold 15px monospace';g.textAlign='left';const words=q[0].split(' ');let line='',y=60;for(const w of words){if((line+w).length>34){g.fillText(line,120,y);line='';y+=24}line+=w+' '}g.fillText(line,120,y);
   g.fillStyle='#333';g.fillRect(120,280,370,14);g.fillStyle=st.t>3?'#40c0ff':'#ff4040';g.fillRect(120,280,370*st.t/10,14)}
  else{g.fillStyle='#8ab0ff';g.font='bold 22px monospace';g.textAlign='center';g.fillText('QUIZ  MACHINE',310,150);g.font='13px monospace';g.fillText('climb the ladder · collect any time',310,180)}});
 O.msg('Answer before the timer runs out. Collect any time, or risk it for the next rung. Top prize £20.');O.clear();O.btn('PLAY (£1)',start,'#2a3a8a')};

/* ================================================================== SHOVE HA'PENNY */
PUBG.shove=function(stake){stake=stake||1;const W=340,H=600,O=gameOv('SHOVE HA\'PENNY vs OLD SALT',{w:W,h:H,maxW:400,bg:'rgba(8,14,22,.97)'}),g=O.g;
 const BED0=110,BH=38,NB=9;let coins=[],turn=0,left=5,marks=[Array(NB).fill(0),Array(NB).fill(0)],state='menu',drag=null,rounds=0;
 function start(){if(!pay(stake))return O.close();marks=[Array(NB).fill(0),Array(NB).fill(0)];rounds=0;turn=0;newTurn();state='play';O.clear();O.msg('Flick each coin up the board: put your thumb on the coin and swipe up. A coin wholly inside a bed scores a chalk mark (3 max per bed).')}
 function newTurn(){coins=[];left=5;place()}
 function place(){coins.push({x:W/2,y:H-60,vx:0,vy:0,live:1,who:turn})}
 const cur=()=>coins[coins.length-1];
 O.on('pointerdown',p=>{if(state!=='play'||turn!==0)return;const c=cur();if(c&&c.live&&!c.moving&&Math.hypot(p[0]-c.x,p[1]-c.y)<50)drag={p,t:performance.now()}});
 O.on('pointermove',p=>{if(drag){const c=cur();c.x=Math.max(40,Math.min(W-40,p[0]))}});
 O.on('pointerup',p=>{if(!drag)return;const c=cur(),dt=Math.max(30,performance.now()-drag.t),dy=drag.p[1]-p[1];drag=null;if(dy<10)return;c.vy=-Math.min(1300,dy/dt*1000*.9);c.vx=(p[0]-drag_x(c))*0;c.moving=1;bp(300,.04)});
 const drag_x=c=>c.x;
 function settle(){const c=cur();c.moving=0;c.live=0;left--;
  for(const k of coins){if(k===c)continue;}if(left<=0){score();if(state!=='play')return;turn=1-turn;if(turn===0)rounds++;if(rounds>=3){fin();return}newTurn();if(turn===1)setTimeout(aiShot,700)}else{place();if(turn===1)setTimeout(aiShot,600)}}
 function score(){for(const c of coins){const off=c.y-BED0;if(off<0)continue;const b=Math.floor(off/BH),inside=off-b*BH;if(b>=0&&b<NB&&inside>9&&inside<BH-9&&marks[c.who][NB-1-b]<3){marks[c.who][NB-1-b]++;bp(700,.05)}}
  if(marks.some(m=>m.every(v=>v>=3)))fin()}
 function fin(){if(state!=='play')return;state='over';const a=marks[0].reduce((s,v)=>s+v,0),b=marks[1].reduce((s,v)=>s+v,0);if(a>b)won('shove',0,stake*2,'🪙 SHOVE HA\'PENNY WIN! +£'+stake*2);else if(a===b){cash+=stake;money()}O.msg((a>b?'You win! ':a<b?'Old Salt wins. ':'A draw. ')+a+' marks to '+b+'.');O.clear();O.btn('AGAIN (£'+stake+')',start,'#2a5a8a')}
 function aiShot(){if(state!=='play'||turn!==1||O.closed)return;const c=cur();const bed=ri(NB),ty=BED0+bed*BH+BH/2+rnd(-14,14);c.x=W/2+rnd(-60,60);/* solve v for friction stop at ty */const d=c.y-ty;c.vy=-Math.sqrt(2*FR*d);c.moving=1}
 const FR=900;
 O.loop(dt=>{if(state==='play'){const c=cur();if(c&&c.moving){const sp=Math.abs(c.vy);const nv=Math.max(0,sp-FR*dt);c.y-=((sp+nv)/2)*dt;c.vy=-nv;for(const k of coins){if(k===c||k.live)continue;if(Math.hypot(k.x-c.x,k.y-c.y)<26){k.y-=6;c.vy*=.5}}if(c.y<40){c.live=0;c.moving=0;c.y=-100;left--;settleOff()}else if(nv<=0)settle()}}draw()});
 function settleOff(){if(left<=0){score();if(state!=='play')return;turn=1-turn;if(turn===0)rounds++;if(rounds>=3){fin();return}newTurn();if(turn===1)setTimeout(aiShot,700)}else{place();if(turn===1)setTimeout(aiShot,600)}}
 function draw(){const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#8a5a2a');gr.addColorStop(1,'#c08a50');g.fillStyle=gr;g.fillRect(0,0,W,H);
  for(let b=0;b<=NB;b++){g.strokeStyle='#3a2410';g.lineWidth=2;g.beginPath();g.moveTo(30,BED0+b*BH);g.lineTo(W-30,BED0+b*BH);g.stroke()}
  for(let b=0;b<NB;b++){const y=BED0+b*BH+BH/2,i=NB-1-b;g.font='bold 12px monospace';g.textAlign='left';g.fillStyle='#fff';g.fillText('I'.repeat(marks[0][i]),6,y+4);g.textAlign='right';g.fillStyle='#ffd0a0';g.fillText('I'.repeat(marks[1][i]),W-6,y+4)}
  for(const c of coins){if(c.y<0)continue;g.fillStyle=c.who?'#c8a060':'#d8d8d8';g.strokeStyle='#555';g.beginPath();g.arc(c.x,c.y,13,0,7);g.fill();g.stroke()}
  g.fillStyle='#fff';g.font='bold 13px monospace';g.textAlign='center';g.fillText(state==='play'?(turn?'OLD SALT':'YOUR')+' TURN · '+left+' COINS · ROUND '+(rounds+1)+'/3':'',W/2,30);g.fillText('YOU (LEFT) · OLD SALT (RIGHT)',W/2,H-14)}
 O.msg('A Ship Inn tradition. Three turns of five coins each; most chalk marks wins.');O.clear();O.btn('PLAY (£'+stake+')',start,'#2a5a8a');draw()};

/* ================================================================== SKITTLES */
PUBG.skittles=function(stake){stake=stake||2;const W=340,H=600,O=gameOv('SKITTLES vs FARMER JOHN',{w:W,h:H,maxW:400,bg:'rgba(20,14,6,.97)'}),g=O.g;
 let pins,ball=null,state='menu',balls=3,hand=0,tot=[0,0],turn=0,drag=null,aiT=0;
 const setPins=()=>{pins=[];const cx=W/2,cy=120,s=34;for(const[i,j]of[[0,-2],[-1,-1],[1,-1],[-2,0],[0,0],[2,0],[-1,1],[1,1],[0,2]])pins.push({x:cx+i*s*.72,y:cy+j*s*.72,vx:0,vy:0,down:0})};
 function start(){if(!pay(stake))return O.close();tot=[0,0];hand=0;turn=0;state='play';newHand();O.clear();O.msg('Swipe up from the ball to roll it. Curve your swipe to spin it. Three balls a hand, three hands each.')}
 function newHand(){setPins();balls=3;ball={x:W/2,y:H-50,vx:0,vy:0,roll:0};if(turn===1)setTimeout(ai,800)}
 O.on('pointerdown',p=>{if(state!=='play'||turn!==0||ball.roll)return;drag={p,t:performance.now(),x0:p[0]}});
 O.on('pointerup',p=>{if(!drag)return;const dt=Math.max(40,performance.now()-drag.t),dx=p[0]-drag.p[0],dy=drag.p[1]-p[1];drag=null;if(dy<20)return;ball.vy=-Math.min(900,dy/dt*1000*.8);ball.vx=dx/dt*1000*.25;ball.roll=1;bp(200,.08,'triangle')});
 function ai(){if(state!=='play'||turn!==1||O.closed)return;ball.vx=rnd(-60,60);ball.vy=-rnd(600,820);ball.roll=1}
 O.loop(dt=>{if(state==='play'&&ball.roll){for(let k=0;k<4;k++)phys(dt/4);if(ball.y<40||(Math.abs(ball.vy)<20&&ball.y<H-60))afterBall()}draw()});
 function phys(dt){ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;ball.vy*=Math.pow(.85,dt);if(ball.x<60||ball.x>W-60){ball.vx=-ball.vx*.6;ball.x=Math.max(60,Math.min(W-60,ball.x))}
  for(const p of pins){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.2,dt);p.vy*=Math.pow(.2,dt);const d=Math.hypot(p.x-ball.x,p.y-ball.y);if(d<20){const nx=(p.x-ball.x)/d,ny=(p.y-ball.y)/d;p.vx+=nx*Math.abs(ball.vy)*.9;p.vy+=ny*Math.abs(ball.vy)*.9;ball.vy*=.85;if(!p.down){p.down=1;bp(260+ri(200),.05)}}}
  for(const a of pins)for(const b of pins){if(a===b)continue;const d=Math.hypot(a.x-b.x,a.y-b.y);if(d<14&&(Math.hypot(a.vx,a.vy)>40)){b.vx+=a.vx*.6;b.vy+=a.vy*.6;if(!b.down){b.down=1;bp(300+ri(200),.04)}}}}
 function afterBall(){ball.roll=0;balls--;const n=pins.filter(p=>p.down).length;if(n===9||balls<=0){tot[turn]+=n;O.msg((turn?'Farmer John':'You')+' scored '+n+(n===9?' · A FLOORER!':'')+'.');hand+=turn;turn=1-turn;if(hand>=3&&turn===0){fin();return}newHand()}else{ball={x:W/2,y:H-50,vx:0,vy:0,roll:0};if(turn===1)setTimeout(ai,700)}}
 function fin(){state='over';const w=tot[0]>tot[1];if(w)won('skittles',0,stake*2,'🎳 SKITTLES WIN! +£'+stake*2);else if(tot[0]===tot[1]){cash+=stake;money()}O.msg((w?'You win ':tot[0]<tot[1]?'Farmer John wins ':'A draw, ')+tot[0]+' to '+tot[1]+'.');O.clear();O.btn('AGAIN (£'+stake+')',start,'#6a4a1a')}
 function draw(){g.fillStyle='#2a1a0a';g.fillRect(0,0,W,H);g.fillStyle='#c89a5a';g.fillRect(55,20,W-110,H-30);for(let x=70;x<W-60;x+=22){g.fillStyle='rgba(0,0,0,.08)';g.fillRect(x,20,2,H-30)}
  for(const p of pins){g.save();g.translate(p.x,p.y);if(p.down){g.rotate(.9);g.fillStyle='#b8a888'}else g.fillStyle='#f4ead4';g.beginPath();g.ellipse(0,0,7,p.down?14:9,0,0,7);g.fill();g.restore()}
  if(ball){g.fillStyle='#4a2a14';g.beginPath();g.arc(ball.x,ball.y,13,0,7);g.fill()}
  g.fillStyle='#fff';g.font='bold 13px monospace';g.textAlign='center';g.fillText('YOU '+tot[0]+'  ·  JOHN '+tot[1]+(state==='play'?'  ·  '+(turn?'JOHN':'YOU')+' · BALLS '+balls:''),W/2,14)}
 O.msg('Down at The Plough: nine pins, three balls a hand, three hands each.');O.clear();O.btn('PLAY (£'+stake+')',start,'#6a4a1a');setPins();draw()};

/* ================================================================== PINBALL */
PUBG.pinball=function(){const W=360,H=600,O=gameOv('PINBALL · COZY INVADERS',{w:W,h:H,maxW:400,bg:'rgba(10,4,20,.97)'}),g=O.g;
 const BUMP=[[120,170,22,100],[240,170,22,100],[180,240,24,150],[90,320,16,50],[270,320,16,50]].map(([x,y,r,v])=>({x,y,r,v,f:0}));
 const fl=[{x:110,y:540,a:.45,up:0,s:1},{x:250,y:540,a:.45,up:0,s:-1}],FLL=62;let b=null,score=0,balls=0,state='menu',best=(window.PUBS&&PUBS.st.pin)|0;
 function start(){if(!pay(1))return O.close();score=0;balls=3;state='play';launch();O.clear();O.btn('◀ LEFT',()=>{},'#6a2a8a').onpointerdown=()=>fl[0].up=1;const r=O.btn('RIGHT ▶',()=>{},'#6a2a8a');r.onpointerdown=()=>fl[1].up=1;for(const x of O.bar.children)x.onpointerup=x.onpointerleave=()=>{fl[0].up=fl[1].up=0};O.msg('Tap the left or right half of the table (or ← →) to flip.')}
 function launch(){/* the ball drops in from the top hatch onto the bumpers */b={x:rnd(140,220),y:46,vx:rnd(-160,160),vy:rnd(0,80)};bp(880,.05)}
 O.on('pointerdown',p=>{if(p[0]<W/2)fl[0].up=1;else fl[1].up=1});O.on('pointerup',()=>{fl[0].up=fl[1].up=0});
 const kd=e=>{if(e.key==='ArrowLeft'||e.key==='z')fl[0].up=1;if(e.key==='ArrowRight'||e.key==='/')fl[1].up=1},ku=e=>{if(e.key==='ArrowLeft'||e.key==='z')fl[0].up=0;if(e.key==='ArrowRight'||e.key==='/')fl[1].up=0};addEventListener('keydown',kd);addEventListener('keyup',ku);O.onclose=()=>{removeEventListener('keydown',kd);removeEventListener('keyup',ku)};
 function seg(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy)));return[ax+dx*t,ay+dy*t]}
 O.loop(dt=>{if(state==='play'&&b){for(let k=0;k<6;k++)step(dt/6)}draw()});
 function step(dt){for(const f of fl){const tgt=f.up?-.5:.45,o=f.a;f.a+=(tgt-f.a)*Math.min(1,dt*30);f.w=(f.a-o)/dt}
  b.vy+=700*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;const R=9;
  if(b.x<24+R){b.x=24+R;b.vx=Math.abs(b.vx)*.85}if(b.x>W-24-R){b.x=W-24-R;b.vx=-Math.abs(b.vx)*.85}if(b.y<24+R){b.y=24+R;b.vy=Math.abs(b.vy)*.85}
  for(const q of BUMP){const dx=b.x-q.x,dy=b.y-q.y,d=Math.hypot(dx,dy);if(d<q.r+R){const nx=dx/d,ny=dy/d;b.x=q.x+nx*(q.r+R);const vn=b.vx*nx+b.vy*ny;b.vx-=2*vn*nx;b.vy-=2*vn*ny;b.vx+=nx*260;b.vy+=ny*260;score+=q.v;q.f=.15;bp(500+q.v*2,.03)}}
  /* slings toward the flippers */for(const[ax,ay,bx,by]of[[24,430,110,540],[W-24,430,250,540]]){const[cx,cy]=seg(b.x,b.y,ax,ay,bx,by),dx=b.x-cx,dy=b.y-cy,d=Math.hypot(dx,dy);if(d<R){const nx=dx/d,ny=dy/d,vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=1.8*vn*nx;b.vy-=1.8*vn*ny}b.x=cx+nx*R;b.y=cy+ny*R}}
  for(const f of fl){const ex=f.x+Math.cos(f.a)*FLL*f.s,ey=f.y+Math.sin(f.a)*FLL;const[cx,cy]=seg(b.x,b.y,f.x,f.y,ex,ey),dx=b.x-cx,dy=b.y-cy,d=Math.hypot(dx,dy);if(d<R+4){const nx=dx/(d||1),ny=dy/(d||1);b.x=cx+nx*(R+4);b.y=cy+ny*(R+4);const vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=1.6*vn*nx;b.vy-=1.6*vn*ny}if(f.up&&f.w<-1){const l=Math.hypot(cx-f.x,cy-f.y);b.vy-=Math.abs(f.w)*l*.9;b.vx+=f.s*(-Math.abs(f.w))*l*.25}}}
  const sp=Math.hypot(b.vx,b.vy);if(sp>1500){b.vx*=1500/sp;b.vy*=1500/sp}
  if(b.y>H+20){balls--;bp(120,.3,'sawtooth');if(balls<=0){state='over';const prize=score>=20000?10:score>=10000?5:score>=5000?2:0;if(score>best){best=score;if(window.PUBS)PUBS.st.pin=best}won('pinball',0,prize,prize?'🕹 PINBALL PAYS £'+prize:null);O.msg('GAME OVER · '+score+' points'+(prize?' · £'+prize+' won':'')+' · BEST '+best);O.clear();O.btn('AGAIN (£1)',start,'#6a2a8a');b=null}else launch()}}
 function draw(){g.fillStyle='#14082a';g.fillRect(0,0,W,H);g.strokeStyle='#ff50e8';g.lineWidth=4;g.strokeRect(22,22,W-44,H-10);g.lineWidth=1;g.fillStyle='rgba(255,80,232,.15)';g.font='bold 34px monospace';g.textAlign='center';g.fillText('COZY',W/2,90);g.fillText('INVADERS',W/2,126);
  for(const q of BUMP){if(q.f>0)q.f-=1/60;g.fillStyle=q.f>0?'#fff':'#20e0ff';g.beginPath();g.arc(q.x,q.y,q.r,0,7);g.fill();g.fillStyle='#14082a';g.font='bold 11px monospace';g.fillText(q.v,q.x,q.y+4)}
  g.strokeStyle='#ffd040';g.lineWidth=5;g.beginPath();g.moveTo(24,430);g.lineTo(110,540);g.moveTo(W-24,430);g.lineTo(250,540);g.stroke();
  g.strokeStyle='#ff5050';g.lineWidth=10;g.lineCap='round';for(const f of fl){g.beginPath();g.moveTo(f.x,f.y);g.lineTo(f.x+Math.cos(f.a)*FLL*f.s,f.y+Math.sin(f.a)*FLL);g.stroke()}g.lineWidth=1;
  if(b){g.fillStyle='#e8e8f0';g.beginPath();g.arc(b.x,b.y,9,0,7);g.fill()}
  g.fillStyle='#fff';g.font='bold 14px monospace';g.textAlign='left';g.fillText(String(score).padStart(6,'0'),30,18);g.textAlign='right';g.fillText('BALLS '+Math.max(0,balls),W-30,18)}
 O.msg('£1 a game, three balls. 5,000 pays £2, 10,000 pays £5, 20,000 pays £10. Best: '+best);O.clear();O.btn('PLAY (£1)',start,'#6a2a8a');draw()};

/* ================================================================== RHYTHM: shanty singalong / open mic */
const MEL={shanty:[[392,1],[392,.5],[392,.5],[392,1],[294,1],[330,1],[349,1],[392,2],[392,1],[440,1],[392,1],[349,1],[330,2]],
 folk:[[330,1],[392,1],[440,1],[392,.5],[330,.5],[294,1],[330,2],[392,1],[494,1],[440,1],[392,1],[330,2]],
 rock:[[330,.5],[330,.5],[392,.5],[330,.5],[440,1],[392,.5],[330,.5],[294,1],[330,1],[330,.5],[392,.5],[494,1],[440,2]]};
PUBG.rhythm=function(kind,title,songs,crowdName){const O=gameOv(title,{w:420,h:520,maxW:460,bg:'rgba(10,8,18,.97)'}),g=O.g;let st=null;
 function start(){const s=pk(songs),mel=MEL[s[2]]||MEL.folk,beat=60/s[1];const notes=[];let t=2,k=0;while(notes.length<40){const[f,d]=mel[k%mel.length];notes.push({t,l:[0,1,2][(f>>3)%3],f,h:0});t+=beat*d;k++}st={s,notes,t:0,sc:0,combo:0,crowd:.4,fb:'',fbT:0,end:t+1};O.clear();['◀','●','▶'].forEach((L,i)=>{const b=O.btn(L,()=>hit(i),'#3a2a6a');b.style.minWidth='90px';b.onpointerdown=e=>{e.preventDefault();hit(i)};b.onclick=null});O.msg('Now playing: '+s[0]+'. Hit each lane as the note reaches the line (or tap the lane).')}
 function hit(l){if(!st)return;const n=st.notes.find(n=>!n.h&&n.l===l&&Math.abs(n.t-st.t)<.22);if(n){n.h=1;const q=Math.abs(n.t-st.t)<.09;st.sc+=q?100:50;st.combo++;st.crowd=Math.min(1,st.crowd+.04);st.fb=q?'PERFECT!':'GOOD';st.fbT=.5;bp(n.f,.18,'triangle',.06)}else{st.combo=0;st.crowd=Math.max(0,st.crowd-.05);st.fb='MISS';st.fbT=.4;bp(110,.08,'sawtooth',.03)}}
 O.on('pointerdown',p=>hit(Math.max(0,Math.min(2,Math.floor(p[0]/140)))));
 const kd=e=>{const m={ArrowLeft:0,a:0,ArrowDown:1,s:1,' ':1,ArrowRight:2,d:2}[e.key];if(m!=null&&st){e.preventDefault();hit(m)}};addEventListener('keydown',kd);O.onclose=()=>removeEventListener('keydown',kd);
 O.loop(dt=>{g.fillStyle='#120a20';g.fillRect(0,0,420,520);for(let i=0;i<3;i++){g.fillStyle=i%2?'#1a1030':'#160c28';g.fillRect(i*140,0,140,520)}g.fillStyle='#ffd040';g.fillRect(0,440,420,4);
  if(st){st.t+=dt;for(const n of st.notes){if(n.h)continue;const y=440-(n.t-st.t)*260;if(y>470&&!n.miss){n.miss=1;st.combo=0;st.crowd=Math.max(0,st.crowd-.04)}if(y<-20||y>520)continue;g.fillStyle=['#ff6a5a','#ffd040','#5ad0ff'][n.l];g.beginPath();g.arc(n.l*140+70,y,20,0,7);g.fill()}
   if(st.fbT>0){st.fbT-=dt;g.fillStyle=st.fb==='MISS'?'#ff6060':'#80ff80';g.font='bold 26px monospace';g.textAlign='center';g.fillText(st.fb,210,380)}
   g.fillStyle='#fff';g.font='bold 14px monospace';g.textAlign='left';g.fillText('SCORE '+st.sc+'  COMBO '+st.combo,10,24);g.fillStyle='#333';g.fillRect(10,34,400,12);g.fillStyle='#40d070';g.fillRect(10,34,400*st.crowd,12);g.fillStyle='#fff';g.font='11px monospace';g.fillText(crowdName,12,60);
   /* the crowd: little heads that bob when they're into it */for(let i=0;i<14;i++){const x=20+i*29,bob=Math.sin(st.t*6+i)*st.crowd*6;g.fillStyle=i/14<st.crowd?'#e0b090':'#6a5a50';g.beginPath();g.arc(x,500-bob,9,0,7);g.fill()}
   if(st.t>st.end){const hits=st.notes.filter(n=>n.h).length,pc=hits/st.notes.length,prize=pc>.85?15:pc>.65?8:pc>.45?3:0;const ok=pc>.65;won(kind,0,prize,prize?'🎶 THE PUB LOVED IT! +£'+prize:null);if(ok&&window.PUBS)PUBS.st[kind]=(PUBS.st[kind]|0)+1;O.msg((ok?'The whole pub joins in! ':'A polite round of applause. ')+Math.round(pc*100)+'% of the notes'+(prize?' · £'+prize+' in the hat.':'.'));st=null;O.clear();O.btn('ANOTHER SONG',start,'#3a2a6a')}}
  else{g.fillStyle='#ffd870';g.font='bold 20px Georgia';g.textAlign='center';g.fillText(title,210,240)}});
 O.clear();O.btn('START',start,'#3a2a6a');O.msg('Three lanes. Tap a lane, or use ← ↓ → on a keyboard.')};
PUBG.shanty=()=>PUBG.rhythm('shanty','SHANTY SINGALONG',[['"WELLERMAN (THE SHIP\'S VERSION)"',104,'shanty'],['"DRUNKEN SAILOR"',112,'shanty'],['"SPANISH LADIES"',96,'shanty'],['"LEAVE HER, JOHNNY"',88,'shanty']],'THE CREW JOINS IN');
PUBG.openMic=()=>PUBG.rhythm('openmic','OPEN MIC NIGHT',[['"CANALSIDE BLUES"',92,'folk'],['"NARROWBOAT NIGHTS"',100,'folk'],['"LOCK GATES ROCK"',126,'rock'],['"THE TOWPATH SONG"',84,'folk']],'THE AUDIENCE');

/* ================================================================== JUKEBOX */
const JB=[['"COZYTOWN SHUFFLE"',[392,440,494,440,392,330,392,294],.22,'square','The regulars tap their feet.'],['"LAST ORDERS"',[262,330,392,330,294,349,392,349],.3,'triangle','Somebody starts singing along.'],['"CANAL STREET STOMP"',[330,330,392,330,440,392,330,294],.18,'square','Two lads attempt a dance.'],['"MOONLIGHT OVER MARLOWE"',[523,494,440,392,349,392,440,494],.34,'sine','The pub goes all misty-eyed.'],['"THE BIG HEIST THEME"',[220,262,220,196,220,262,294,262],.2,'sawtooth','Everyone looks a bit shifty.']];
let jbT=null;PUBG.jukeboxStop=()=>{if(jbT){clearInterval(jbT);jbT=null}};
PUBG.jukebox=function(){const O=gameOv('JUKEBOX · £1 A TUNE',{w:420,h:300,bg:'rgba(30,8,10,.97)'}),g=O.g;O.msg('Pick a record. It plays while you stay in the pub.');O.clear();
 JB.forEach(s=>O.btn(s[0],()=>{if(!pay(1))return;PUBG.jukeboxStop();let i=0;jbT=setInterval(()=>{if(!GS.inside){PUBG.jukeboxStop();return}bp(s[1][i%s[1].length],s[2]*.9,s[3],.03);i++},s[2]*1000);toast('🎵 '+s[0]+' · '+s[4]);O.close()},'#8a2a2a'));O.btn('STOP THE MUSIC',()=>{PUBG.jukeboxStop();O.close()},'#444');
 const gr=g.createLinearGradient(0,0,0,300);gr.addColorStop(0,'#ff8a3a');gr.addColorStop(1,'#8a1a2a');g.fillStyle=gr;rr(g,90,20,240,270,110);g.fill();g.fillStyle='#200a0a';g.fillRect(130,110,160,120);for(let i=0;i<5;i++){g.fillStyle='#ffe0a0';g.fillRect(140,120+i*22,140,14)}};
})();
