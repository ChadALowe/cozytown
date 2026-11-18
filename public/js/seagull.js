/* ===== Seagull Raid polish =====
   Replaces arxDraw (flat one-colour pixel blobs on black) with a seaside-at-dusk arcade scene in the same chunky pixel style:
   banded sky with moon and drifting stars, an animated sea, a pier deck with lamp posts, proper two-frame gull sprites
   (white body, wings, orange beak, eyes, row-coloured scarves), a salt-shaker cannon with a muzzle flash, falling chips as
   the gulls' bombs, salt-grain shots with sparkle trails, feather puffs when gulls are hit, a big bonus gull, screen shake
   and a red flash when you lose a life, wave banners and a game-over panel.  Movement, collisions and scoring are untouched:
   the draw only reads game state. */
(function(){
const PAL={w:'#f6f6f2',W:'#ffffff',g:null,G:'#8a96a6',k:'#1a1a22',o:'#ff9a1a',e:'#101018',c:'#c4ccd6',h:'#4a525c',r:'#d83030',l:'#a8e0ff'};
const GA=['G....ww....G','GG..wwww..GG','.GGwewwewGG.','..gwwoowwg..','...gwwwwg...','....o..o....'];
const GB=['............','....wwww....','GGGwewwewGGG','.GGgwoowgGG.','...gwwwwg...','....o..o....'];
const SHK=['...cccc...','..chcchc..','..cccccc..','..rrrrrr..','.gwwwwwwg.','.gwWwwwwg.','.gwWwwwwg.','.gwwwwwwg.','.gwwwwwwg.','.gwwwwwwg.','.gggggggg.'];
const ROWC=['#ff6a6a','#ffc040','#60d8ff','#b8ffb8'];
const rnd=n=>{n=Math.imul(n^n>>>15,2246822519);n=Math.imul(n^n>>>13,3266489917);return((n^n>>>16)>>>0)/4294967296};
function Q(A){return A._x||(A._x={pts:[],alive:A.gl.map(g=>g.a),lives:A.lives,ufo:false,shake:0,flash:0,fl:0,ph:A.ph,wavePrev:A.wave,sc:A.score,pops:[]})}
function spr(g,rows,x,y,pal,gcol){for(let j=0;j<rows.length;j++){const r=rows[j];for(let i=0;i<r.length;i++){const ch=r[i];if(ch==='.')continue;g.fillStyle=ch==='g'?gcol:(pal[ch]||'#f0f');g.fillRect(Math.round(x+i),Math.round(y+j),1,1)}}}
function feathers(q,x,y,col,n){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=20+Math.random()*50;q.pts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-25,l:.6+Math.random()*.5,m:1,c:i%3?'#ffffff':(i%2?col:'#c8d0dc'),g:70})}}

arxDraw=function(){const A=ARX;if(!A)return;const g=A.g,t=A.t,q=Q(A),W=224,H=256,now=performance.now();const dt=Math.min(.05,(now-(q.lt||now))/1000);q.lt=now;
 /* ---- detect events from state changes ---- */
 A.gl.forEach((o,i)=>{if(q.alive[i]&&!o.a){const x=A.ox+o.c*20+6,y=A.oy+o.r*16+3;feathers(q,x,y,ROWC[o.r],12);q.shake=Math.max(q.shake,1.2)}q.alive[i]=o.a});
 if(A.wave!==q.wavePrev||A.ph==='ready'&&q.ph!=='ready'){q.alive=A.gl.map(o=>o.a);q.wavePrev=A.wave}
 if(A.lives<q.lives){q.shake=5;q.flash=.6;for(let i=0;i<10;i++)q.pts.push({x:A.x,y:236,vx:(Math.random()-.5)*110,vy:-40-Math.random()*60,l:.9,m:.9,c:i%2?'#ffe050':'#d09020',g:160,chip:1})}q.lives=A.lives;
 const hasU=!!A.ufo;if(q.ufo&&!hasU&&A.score>q.sc&&A.ufo===null&&q.ux>-10&&q.ux<234){feathers(q,q.ux,26,'#ff4040',22);q.shake=Math.max(q.shake,2)}q.ufo=hasU;if(hasU)q.ux=A.ufo.x;q.sc=A.score;
 if(A.fc>.36&&A.sh.length&&A.ph==='play')q.fl=.08;q.fl-=dt;q.shake=Math.max(0,q.shake-dt*14);q.flash=Math.max(0,q.flash-dt);
 g.save();if(q.shake>0)g.translate((Math.random()-.5)*q.shake,(Math.random()-.5)*q.shake);
 /* ---- sky bands ---- */
 const SKY=['#07091f','#0a0d2a','#0e1236','#141a44','#1c2152','#2a2a62','#3c3270','#53407a','#6e4a7c','#8c5678','#a86472','#c47a68','#dc9060'];
 for(let i=0;i<SKY.length;i++){g.fillStyle=SKY[i];g.fillRect(0,i*15,W,16)}
 for(const s of A.stars){const tw=((t*2+s[2])%3<2);g.fillStyle=tw?'#7a7aa0':'#e8e8ff';g.fillRect((s[0]+t*1.5)%W|0,s[1]*.65|0,1,1)}
 /* moon */
 g.fillStyle='#f4f0d0';g.beginPath();g.arc(184,44,15,0,6.3);g.fill();g.fillStyle='#d8d4b0';for(const[x,y,r]of[[179,40,3],[190,48,4],[186,36,2]]){g.beginPath();g.arc(x,y,r,0,6.3);g.fill()}g.fillStyle='rgba(244,240,208,.12)';g.beginPath();g.arc(184,44,24,0,6.3);g.fill();
 /* distant lighthouse */
 g.fillStyle='#e8e0d0';g.fillRect(28,172,6,26);g.fillStyle='#c84040';g.fillRect(28,178,6,4);g.fillRect(28,188,6,4);g.fillStyle='#303848';g.fillRect(27,168,8,4);const lg=(Math.sin(t*2)+1)/2;g.fillStyle='rgba(255,240,150,'+(.25+.5*lg)+')';g.fillRect(31,169,2,2);g.beginPath();g.moveTo(31,170);g.lineTo(31+60*lg,160);g.lineTo(31+60*lg,176);g.closePath();g.fillStyle='rgba(255,240,150,.08)';g.fill();
 /* sea */
 for(let i=0;i<7;i++){g.fillStyle=['#2a4a7a','#244470','#1e3c66','#1a345c','#162c52','#122448','#0e1c3c'][i];g.fillRect(0,198+i*7,W,7)}
 g.fillStyle='rgba(255,255,255,.5)';for(let i=0;i<22;i++){const row=i%6,y=200+row*8,x=((i*37+t*(6+row*3))%(W+20))-10;g.fillRect(x|0,y,5+row,1)}
 g.fillStyle='rgba(255,220,150,.35)';for(let i=0;i<8;i++){g.fillRect(168+Math.sin(t*3+i)*6+i*.5|0,200+i*5,14-i,1)}
 /* pier deck + lamps */
 g.fillStyle='#4a3020';g.fillRect(0,246,W,10);g.fillStyle='#6a4a2a';g.fillRect(0,246,W,2);g.fillStyle='#32200f';for(let x=0;x<W;x+=12)g.fillRect(x,248,1,8);
 g.fillStyle='#1a1008';for(const x of[16,208]){g.fillRect(x,226,2,20);g.fillRect(x-2,224,6,3);g.fillStyle='rgba(255,230,150,.9)';g.fillRect(x-1,222,4,3);g.fillStyle='rgba(255,230,150,.12)';g.beginPath();g.arc(x+1,224,12,0,6.3);g.fill();g.fillStyle='#1a1008'}
 /* ---- gulls ---- */
 const fr=Math.floor(t*2.2)%2;
 for(const o of A.gl)if(o.a)spr(g,fr?GA:GB,A.ox+o.c*20,A.oy+o.r*16,{...PAL,G:'#8a96a6'},ROWC[o.r]);
 if(A.ufo){const x=A.ufo.x-12,y=19,f2=Math.floor(t*6)%2;g.save();g.translate(x,y);g.scale(2,2);spr(g,f2?GA:GB,0,0,{...PAL,w:'#ffd0d0'},'#ff4040');g.restore();g.fillStyle='#ffe050';g.fillRect(A.ufo.x-5,19,10,2);g.fillStyle='#ff4040';g.fillRect(A.ufo.x-4,17,8,3);g.fillStyle='rgba(255,200,80,.5)';for(let i=0;i<4;i++)g.fillRect(A.ufo.x-A.ufo.d*(14+i*5)+Math.sin(t*20+i)*2,32+i*2,2,2)}
 /* ---- chips (bombs) ---- */
 for(const b of A.bm){g.save();g.translate(Math.round(b.x),Math.round(b.y)+3);g.rotate(Math.sin(t*10+b.x)*.4);g.fillStyle='#ffe050';g.fillRect(-1,-4,3,8);g.fillStyle='#e0a020';g.fillRect(-1,2,3,2);g.fillStyle='#fff6a0';g.fillRect(-1,-4,1,5);g.restore()}
 /* ---- salt shots ---- */
 for(const s of A.sh){g.fillStyle='rgba(255,255,255,.25)';g.fillRect(Math.round(s.x)-1,Math.round(s.y)+5,2,9);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(Math.round(s.x)-1,Math.round(s.y)+14,2,8);g.fillStyle='#fff';g.fillRect(Math.round(s.x)-1,Math.round(s.y),2,5);g.fillStyle='#bfe8ff';g.fillRect(Math.round(s.x)-2+(Math.sin(t*40+s.y)>0?1:0),Math.round(s.y)+1,1,1)}
 /* ---- player ---- */
 if(A.ph!=='over'&&(A.inv<=0||Math.floor(t*12)%2)){const x=Math.round(A.x)-5,y=233,lean=Math.max(-1,Math.min(1,(A.tx-A.x)/30));g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x-1,244,12,2);g.save();g.translate(x+5,y+11);g.rotate(lean*.12);g.translate(-5,-11);spr(g,SHK,0,0,PAL,'#b0c0d0');g.restore();
  if(q.fl>0){g.fillStyle='#fff';g.fillRect(x+3,y-5,4,4);g.fillStyle='rgba(255,255,255,.4)';g.fillRect(x+1,y-8,8,3)}}
 /* ---- particles ---- */
 for(let i=q.pts.length-1;i>=0;i--){const p=q.pts[i];p.l-=dt;if(p.l<=0){q.pts.splice(i,1);continue}p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;g.globalAlpha=Math.min(1,p.l*2.4);g.fillStyle=p.c;if(p.chip)g.fillRect(p.x|0,p.y|0,2,5);else g.fillRect(p.x|0,p.y|0,2,2)}g.globalAlpha=1;
 g.textAlign='center';g.font='bold 9px monospace';if(A.pf)for(const p of A.pf)if(p.v){g.fillStyle='#000';g.fillText('+'+p.v,p.x+1,p.y+1);g.fillStyle='#ffe050';g.fillText('+'+p.v,p.x,p.y)}
 /* ---- HUD ---- */
 g.fillStyle='rgba(0,0,0,.45)';g.fillRect(0,0,W,15);g.font='bold 9px monospace';g.textAlign='left';g.fillStyle='#fff';g.fillText('SCORE '+String(A.score).padStart(5,'0'),5,10);g.textAlign='center';g.fillStyle='#ffd840';g.fillText('HI '+Math.max(ARXS.hi,A.score),W/2+14,10);g.textAlign='right';g.fillStyle='#9fd0ff';g.fillText('WAVE '+A.wave,W-5,10);
 for(let i=0;i<A.lives;i++){const x=6+i*11,y=247;g.fillStyle='#c4ccd6';g.fillRect(x+1,y,4,1);g.fillStyle='#f6f6f2';g.fillRect(x,y+1,6,6);g.fillStyle='#d83030';g.fillRect(x,y+1,6,1)}
 /* ---- banners ---- */
 g.textAlign='center';
 if(A.ph==='ready'||A.ph==='clear'){const w=A.ph==='clear'?A.wave:A.wave;g.fillStyle='rgba(0,0,0,.5)';g.fillRect(0,106,W,34);g.font='bold 16px monospace';g.fillStyle='#000';g.fillText(A.ph==='clear'?'WAVE CLEARED!':'WAVE '+w,W/2+1,127);g.fillStyle=A.ph==='clear'?'#7aff7a':'#ffd840';g.fillText(A.ph==='clear'?'WAVE CLEARED!':'WAVE '+w,W/2,126);g.font='bold 8px monospace';g.fillStyle='#fff';g.fillText(A.ph==='clear'?'+100 BONUS':'GET READY',W/2,136)}
 if(A.ph==='over'){g.fillStyle='rgba(0,0,0,.62)';g.fillRect(20,86,W-40,86);g.strokeStyle='#ff6060';g.lineWidth=2;g.strokeRect(20,86,W-40,86);g.font='bold 18px monospace';g.fillStyle='#ff6060';g.fillText('GAME OVER',W/2,112);g.font='bold 9px monospace';g.fillStyle='#fff';g.fillText(A.lives<=0&&A.oy>200?'THE GULLS GOT YOUR CHIPS':'THE GULLS WIN',W/2,128);g.fillStyle='#ffd840';g.fillText('SCORE '+A.score,W/2,144);g.fillStyle='#9fd0ff';g.fillText('HI '+Math.max(ARXS.hi,A.score),W/2,158)}
 g.restore();
 if(q.flash>0){g.fillStyle='rgba(255,40,40,'+q.flash*.5+')';g.fillRect(0,0,W,H)}
 const vg=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.35)');g.fillStyle=vg;g.fillRect(0,0,W,H)};
})();
