/* ===== CASINO GAMES: roulette (3D wheel + ball), blackjack (3D cards + dealer) and a bank of fruit machines =====
   Furnishes the empty casino hall built in casino.js. Same pattern as the pub's pool table: walk up to a table, press the
   button, the camera glides over it and a small overlay takes the bets. Money is the normal `cash`.
   Roulette: European single-zero wheel, straight-up (35:1), red/black, odd/even, 1-18/19-36 (1:1), dozens and columns (2:1).
   Blackjack: 6-deck shoe, dealer stands on 17, blackjack pays 3:2, double down on any first two cards.
   Fruit machines reuse the pub's fruit machine (sltOpen). */
(function(){
const TAU=Math.PI*2,lerpf=(a,b,t)=>a+(b-a)*t,clampf=(v,a,b)=>v<a?a:v>b?b:v,ease=t=>1-Math.pow(1-t,3);
const WO=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const REDS=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const colOf=n=>n===0?'g':REDS.has(n)?'r':'b',HEX={g:'#0e8a3a',r:'#c01428',b:'#15151a'};
const GG=new THREE.Group(),PEOPLE=[];let built=false;
const WG={aw:0,idx:0,ab:0,r:.39,y:0},HIST=[];                    // wheel angle, resting pocket, ball angle / radius / lift
const WX=-7.55,WZ=-4.4,TY=.9,RTX=-6.2,RTZ=-4.4;                   // wheel centre, table-top height, roulette table centre
const BX=6.2,BZ=-5.0;                                              // blackjack table: flat (dealer) edge centre
const SLOTZ=[.9,1.95,3.0];
/* ---------- tiny helpers ---------- */
function bxg(x,y,z,w,h,d,hex,P){const g=new THREE.BoxGeometry(w,h,d),col=new Float32Array(g.attributes.position.count*3),F=[.82,.7,1,.45,.9,.74];for(let f=0;f<6;f++)for(let v=0;v<4;v++){const i=(f*4+v)*3;col[i]=col[i+1]=col[i+2]=F[f]}g.setAttribute('color',new THREE.BufferAttribute(col,3));const m=new THREE.Mesh(g,fmc(hex));m.position.set(x,y+h/2,z);(P||GG).add(m);return m}
function cvx(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;return t}
const bmat=(o)=>new THREE.MeshBasicMaterial(Object.assign({fog:false,side:THREE.DoubleSide},o));
function flat(w,h,x,y,z,tex,P,o){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h).rotateX(-Math.PI/2),bmat(Object.assign({map:tex},o||{})));m.position.set(x,y,z);(P||GG).add(m);return m}
function wall(w,h,x,y,z,ry,tex){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),bmat({map:tex}));m.position.set(x,y,z);m.rotation.y=ry;GG.add(m);return m}
function mk(tag,css,txt,par){const e=document.createElement(tag);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;if(par)par.appendChild(e);return e}
const BTN='font:bold 13px monospace;border:2px solid #f5e6a0;border-radius:8px;color:#fff;background:#333;padding:6px 10px;touch-action:manipulation;pointer-events:auto;';
const money=n=>'£'+Math.round(n);
const refreshCash=()=>{try{cashUI()}catch(e){}};
function sign(t,w,bg,fg){return cvx(512,Math.round(512*.25*w/2),(g,W,H)=>{g.fillStyle=bg;g.fillRect(0,0,W,H);g.strokeStyle=fg;g.lineWidth=6;g.strokeRect(6,6,W-12,H-12);g.fillStyle=fg;g.font='900 '+Math.round(H*.55)+'px Impact,"Arial Black",Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,W/2,H/2+3)})}
/* ---------- textures ---------- */
function wheelFace(){return cvx(512,512,g=>{g.translate(256,256);g.fillStyle='#2a1608';g.beginPath();g.arc(0,0,256,0,TAU);g.fill();
 for(let i=0;i<37;i++){const a0=i/37*TAU,a1=(i+1)/37*TAU,n=WO[i];g.fillStyle=HEX[colOf(n)];g.beginPath();g.moveTo(Math.cos(a0)*150,Math.sin(a0)*150);g.arc(0,0,250,a0,a1);g.lineTo(Math.cos(a1)*150,Math.sin(a1)*150);g.arc(0,0,150,a1,a0,true);g.closePath();g.fill();
  g.strokeStyle='#e8c050';g.lineWidth=2;g.beginPath();g.moveTo(Math.cos(a0)*150,Math.sin(a0)*150);g.lineTo(Math.cos(a0)*250,Math.sin(a0)*250);g.stroke();
  const am=(i+.5)/37*TAU;g.save();g.translate(Math.cos(am)*214,Math.sin(am)*214);g.rotate(am+Math.PI/2);g.fillStyle='#fff';g.font='bold 22px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText(String(n),0,0);g.restore()}
 g.strokeStyle='#e8c050';g.lineWidth=5;g.beginPath();g.arc(0,0,150,0,TAU);g.stroke();g.fillStyle='#3a2410';g.beginPath();g.arc(0,0,148,0,TAU);g.fill();
 for(let r=138;r>30;r-=22){g.fillStyle=(r%44)?'#e8c050':'#b8892a';g.beginPath();g.arc(0,0,r,0,TAU);g.fill()}
 g.strokeStyle='#f6d878';g.lineWidth=8;for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a)*140,Math.sin(a)*140);g.stroke()}
 g.fillStyle='#f6d878';g.beginPath();g.arc(0,0,26,0,TAU);g.fill();g.fillStyle='#8a5a14';g.beginPath();g.arc(0,0,12,0,TAU);g.fill();g.strokeStyle='#e8c050';g.lineWidth=8;g.beginPath();g.arc(0,0,252,0,TAU);g.stroke()})}
function layoutTex(){return cvx(780,350,(g,W,H)=>{g.fillStyle='#146a34';g.fillRect(0,0,W,H);g.strokeStyle='#e8d8a0';g.lineWidth=3;g.strokeRect(8,8,W-16,H-16);
 const x0=18,y0=18,cw=(W-36)/14,rh=70,rh2=50,cell=(c,r,sp,label,bg,h)=>{const x=x0+c*cw,y=r<3?y0+r*rh:y0+3*rh+(r-3)*rh2,w=cw*sp,hh=h||(r<3?rh:rh2);g.fillStyle=bg;g.fillRect(x,y,w,hh);g.strokeStyle='#e8d8a0';g.lineWidth=2;g.strokeRect(x,y,w,hh);g.fillStyle='#fff';g.font='bold '+(r<3?30:22)+'px Georgia,serif';g.textAlign='center';g.textBaseline='middle';g.fillText(label,x+w/2,y+hh/2+2)};
 cell(0,0,1,'0','#0e8a3a',rh*3);for(let c=1;c<=12;c++)for(let r=0;r<3;r++){const n=3*c-r;cell(c,r,1,String(n),HEX[colOf(n)])}for(let r=0;r<3;r++)cell(13,r,1,'2:1','#146a34');
 ['1st 12','2nd 12','3rd 12'].forEach((t,i)=>cell(1+i*4,3,4,t,'#146a34'));
 [['1-18','#146a34'],['EVEN','#146a34'],['',HEX.r],['',HEX.b],['ODD','#146a34'],['19-36','#146a34']].forEach((a,i)=>cell(1+i*2,4,2,a[0],a[1]));
 g.fillStyle='#c01428';g.save();g.translate(x0+(1+4)*cw,y0+3*rh+rh2+rh2/2);g.rotate(Math.PI/4);g.fillRect(-12,-12,24,24);g.restore();g.fillStyle='#15151a';g.save();g.translate(x0+(1+6)*cw,y0+3*rh+rh2+rh2/2);g.rotate(Math.PI/4);g.fillRect(-12,-12,24,24);g.restore()})}
/* ---------- the hall furnishings ---------- */
function buildGames(){built=true;
 /* roulette table + wheel */
 bxg(RTX,0,RTZ,4.7,.82,1.7,0x2a160a);bxg(RTX,.82,RTZ,4.8,.08,1.8,0x4a2812);
 flat(4.6,1.6,RTX,TY+.004,RTZ,cvx(8,8,(g)=>{g.fillStyle='#146a34';g.fillRect(0,0,8,8)}));
 flat(2.9,1.3,-5.25,TY+.008,RTZ,layoutTex());
 for(const[x,z,w,d]of[[RTX,RTZ-.86,4.8,.1],[RTX,RTZ+.86,4.8,.1],[RTX-2.35,RTZ,.1,1.8],[RTX+2.35,RTZ,.1,1.8]])bxg(x,TY,z,w,.06,d,0x6a3a18);
 bxg(RTX,TY+.06,RTZ+.9,4.8,.02,.04,0xe8bf4a);
 const wb=new THREE.Mesh(new THREE.CylinderGeometry(.7,.74,.15,36),fmc(0x3a1c0c));wb.position.set(WX,TY+.075,WZ);GG.add(wb);
 const track=new THREE.Mesh(new THREE.CircleGeometry(.64,36).rotateX(-Math.PI/2),bmat({color:0x5a3418}));track.position.set(WX,TY+.157,WZ);GG.add(track);
 const ring=new THREE.Mesh(new THREE.RingGeometry(.6,.64,36).rotateX(-Math.PI/2),bmat({color:0xe8bf4a}));ring.position.set(WX,TY+.16,WZ);GG.add(ring);
 const wr=new THREE.Group();wr.position.set(WX,TY+.17,WZ);GG.add(wr);WG.rot=wr;
 wr.add(new THREE.Mesh(new THREE.CircleGeometry(.5,48).rotateX(-Math.PI/2),bmat({map:wheelFace()})));
 const tur=new THREE.Mesh(new THREE.ConeGeometry(.07,.13,10),bmat({color:0xf0c030}));tur.position.y=.065;wr.add(tur);const kn=new THREE.Mesh(new THREE.SphereGeometry(.024,8,6),bmat({color:0xfff0a0}));kn.position.y=.14;wr.add(kn);
 const ball=new THREE.Mesh(new THREE.SphereGeometry(.021,10,8),bmat({color:0xffffff}));GG.add(ball);WG.ball=ball;
 /* chips on the felt */
 const stack=(x,z,cols)=>cols.forEach((c,i)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,.008,12),bmat({color:c}));m.position.set(x,TY+.012+i*.009,z);GG.add(m)});
 stack(-4.4,RTZ+.55,[0xd02020,0xd02020,0xf0f0f0,0xd02020]);stack(-4.9,RTZ-.5,[0x2050c0,0x2050c0,0x2050c0]);stack(-5.6,RTZ+.45,[0x20a040,0xf0f0f0,0x20a040,0x20a040,0x20a040]);
 /* blackjack table (half-round, flat edge to the dealer) */
 const hb=new THREE.Mesh(new THREE.CylinderGeometry(1.7,1.7,.82,30,1,false,-Math.PI/2,Math.PI),bmat({color:0x2a160a}));hb.position.set(BX,.41,BZ);GG.add(hb);
 bxg(BX,.0,BZ,3.4,.82,.04,0x2a160a);
 const ht=new THREE.Mesh(new THREE.CylinderGeometry(1.76,1.76,.08,30,1,false,-Math.PI/2,Math.PI),bmat({color:0x4a2812}));ht.position.set(BX,.86,BZ);GG.add(ht);bxg(BX,.82,BZ,3.52,.08,.04,0x4a2812);
 const felt=new THREE.Mesh(new THREE.CircleGeometry(1.62,32,Math.PI,Math.PI).rotateX(-Math.PI/2),bmat({map:cvx(512,512,(g)=>{g.fillStyle='#146a34';g.fillRect(0,0,512,512);g.strokeStyle='#e8d8a0';g.lineWidth=5;g.beginPath();g.arc(256,256,246,0,Math.PI);g.stroke();g.lineWidth=2;g.beginPath();g.arc(256,256,226,0,Math.PI);g.stroke();
  g.fillStyle='#e8d8a0';g.textAlign='center';g.textBaseline='middle';g.font='bold 22px Georgia,serif';g.fillText('BLACKJACK PAYS 3 TO 2',256,318);g.font='15px Georgia,serif';g.fillText('DEALER MUST STAND ON 17',256,346);g.strokeStyle='#f0c030';g.lineWidth=3;g.beginPath();g.arc(256,440,34,0,TAU);g.stroke();
  g.strokeStyle='#e8d8a0';g.lineWidth=2;g.strokeRect(190,268-58,132,0);g.strokeStyle='rgba(232,216,160,.5)';g.strokeRect(210,262,92,18)})}));felt.position.set(BX,.906,BZ);GG.add(felt);
 const shoe=bxg(BX+1.28,.9,BZ+.22,.22,.12,.3,0x1a1a20);shoe.rotation.y=.4;
 stack(BX-1.1,BZ+.5,[0xf0f0f0,0xf0f0f0,0xd02020]);stack(BX+.9,BZ+.6,[0x20a040,0x20a040,0x2050c0]);
 /* fruit machines along both side walls */
 for(const sd of[-1,1])SLOTZ.forEach((z,i)=>{const wx=sd*10.42,fx=sd*10.1,col=[0xa01818,0x1a4aa0,0x6a1a8a][(i+(sd>0?1:0))%3];
  bxg(wx,0,z,.62,1.9,.9,col);bxg(wx,0,z,.7,.3,.96,0x2a2a30);bxg(wx,1.9,z,.7,.1,.96,0xe8bf4a);bxg(fx,.95,z,.14,.1,.8,0x222228);
  const ft=cvx(256,420,(g,W,H)=>{const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#'+(col+0x1000000).toString(16).slice(1));gr.addColorStop(1,'#2a0608');g.fillStyle=gr;g.fillRect(0,0,W,H);g.fillStyle='#1a0602';g.fillRect(14,14,W-28,70);g.strokeStyle='#f0c030';g.lineWidth=4;g.strokeRect(14,14,W-28,70);g.fillStyle='#ffd840';g.font='bold 36px Georgia,serif';g.textAlign='center';g.textBaseline='middle';g.fillText('FRUITY',W/2,38);g.fillText('FORTUNE',W/2,70);
   for(let k=0;k<12;k++){g.fillStyle=k%2?'#fff6a0':'#6a4a10';g.beginPath();g.arc(24+k*19,100,5,0,TAU);g.fill()}
   g.fillStyle='#0c0404';g.fillRect(20,118,W-40,150);g.strokeStyle='#f0c030';g.lineWidth=5;g.strokeRect(20,118,W-40,150);for(let r=0;r<3;r++){g.fillStyle='#f6f0dc';g.fillRect(30+r*72,128,64,130);try{drawSym(g,(r*3+i*2+(sd>0?4:0))%10,62+r*72,193,20)}catch(e){}}
   g.fillStyle='#f01818';g.fillRect(24,192,W-48,3);g.fillStyle='#ffe8a0';g.font='bold 20px monospace';g.fillText('£1 A GO',W/2,300);g.fillStyle='#e8bf4a';g.fillRect(70,330,116,40);g.fillStyle='#4a2a00';g.font='bold 22px monospace';g.fillText('SPIN',W/2,351)});
  const p=new THREE.Mesh(new THREE.PlaneGeometry(.84,1.38),bmat({map:ft}));p.position.set(sd*10.08,1.0,z);p.rotation.y=-sd*Math.PI/2;GG.add(p)});
 /* wall signs */
 wall(2.6,.65,RTX,3.6,-7.88,0,sign('ROULETTE',2.6,'#3a0610','#ffd24a'));wall(2.6,.65,BX,3.6,-7.88,0,sign('BLACKJACK',2.6,'#3a0610','#ffd24a'));
 wall(2.6,.65,-10.86,3.6,2,Math.PI/2,sign('FRUIT MACHINES',2.6,'#1a0a30','#ff5ae8'));wall(2.6,.65,10.86,3.6,2,-Math.PI/2,sign('FRUIT MACHINES',2.6,'#1a0a30','#ff5ae8'));
 /* the staff */
 const sp1=pSpec(8841,{f:true,hs:1,ts:1,gl:false,scarf:null,bp:false,bag:0,old:false,tc:[.12,.05,.1],sk:PSK[1]}),sp2=pSpec(3321,{f:false,hs:0,ts:1,beard:false,gl:false,scarf:null,bp:false,bag:0,old:false,tc:[.1,.1,.14],sk:PSK[2]});
 PEOPLE.push(personIn(sp1,-5.2,-5.7,0),personIn(sp2,BX,BZ-.45,0))}
function wheelUpdate(){const w=WG;w.rot.rotation.y=-w.aw;w.ball.position.set(WX+Math.cos(w.ab)*w.r,TY+.2+w.y,WZ+Math.sin(w.ab)*w.r)}
/* ---------- shared: open / close a table game ---------- */
function gOpen(camFn,fov){busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;document.body.classList.add('dz');man.visible=false;const h=document.getElementById('hud');if(h){h._dd=h.style.display;h.style.display='none'}DZ.fn=camFn;DZ.fov=fov;DZ.look=DZ.look||new THREE.Vector3();DZ.tp=camFn();DZ.on=1}
function gClose(){DZ.fn=null;DZ.fov=46;DZ.on=0;document.body.classList.remove('dz');man.visible=true;const h=document.getElementById('hud');if(h)h.style.display=h._dd||'';DZ.exit=1}
const wv=a=>SG.localToWorld(new THREE.Vector3(a[0],a[1],a[2]));
function chipRow(par,vals,sel,fn){const els=[];vals.forEach(v=>{const b=mk('button',BTN+'border-radius:50%;width:min(8.5vh,40px);height:min(8.5vh,40px);padding:0;font-size:12px;background:'+({1:'#e8e8e8',5:'#d02020',10:'#2050c0',25:'#20a040',100:'#222'}[v]||'#888')+';'+(v===1?'color:#222;':''),'£'+v,par);b.onclick=e=>{e.stopPropagation();els.forEach(x=>x.style.outline='');b.style.outline='3px solid #ffe060';fn(v)};if(v===sel)b.style.outline='3px solid #ffe060';els.push(b)});return els}
/* =================================================== ROULETTE =================================================== */
let RG=null;
function rouCam(){DZ.look.copy(wv(RG.cl));return wv(RG.cp)}
function rouMult(k,n){if(k==='n'+n)return 36;switch(k){case'red':return colOf(n)==='r'?2:0;case'black':return colOf(n)==='b'?2:0;case'odd':return n>0&&n%2?2:0;case'even':return n>0&&n%2===0?2:0;case'low':return n>=1&&n<=18?2:0;case'high':return n>=19?2:0;
 case'd1':return n>=1&&n<=12?3:0;case'd2':return n>=13&&n<=24?3:0;case'd3':return n>=25?3:0;case'c1':return n>0&&n%3===1?3:0;case'c2':return n>0&&n%3===2?3:0;case'c3':return n>0&&n%3===0?3:0}return 0}
const rouTotal=()=>Object.values(RG.bets).reduce((a,b)=>a+b,0);
function rouOpen(){if(RG||busy)return;rouStart()}
function rouStart(){
 const R=RG={ph:'bet',bets:{},stack:[],chip:5,rebet:null,res:null,t:0,cells:{},last:performance.now(),cp:[-6.0,2.75,-1.3],cl:[-6.0,.55,-3.4],tcp:null,tcl:null,msgT:0};
 gOpen(rouCam,52);R.tcp=R.cp.slice();R.tcl=R.cl.slice();
 const ov=R.ov=mk('div','position:fixed;inset:0;z-index:60;font:bold 13px monospace;color:#fff;pointer-events:none;user-select:none;-webkit-user-select:none;touch-action:none');document.body.appendChild(ov);
 const top=mk('div','position:absolute;left:0;right:0;top:6px;display:flex;justify-content:space-between;align-items:flex-start;padding:0 8px;text-shadow:2px 2px 0 #000',null,ov);
 R.bal=mk('div','font-size:16px;color:#ffe890;min-width:110px',null,top);const mid=mk('div','text-align:center;flex:1',null,top);mk('div','color:#f5e6a0;font-size:15px','ROULETTE',mid);R.msg=mk('div','min-height:18px;color:#9fe;margin-top:2px',null,mid);R.hist=mk('div','margin-top:3px',null,mid);
 R.lv=mk('button',BTN+'font-size:12px;background:#333;min-width:60px','LEAVE',top);R.lv.onclick=()=>rouClose();
 R.big=mk('div','position:absolute;left:50%;top:30%;transform:translate(-50%,-50%);display:none;width:min(22vh,110px);height:min(22vh,110px);line-height:min(22vh,110px);border-radius:50%;text-align:center;font:900 min(10vh,52px)/min(22vh,110px) Impact,Arial,sans-serif;border:4px solid #ffe060;text-shadow:2px 2px 0 #000',null,ov);
 const pn=mk('div','position:absolute;left:0;right:0;bottom:0;padding:4px 6px 6px;background:linear-gradient(0deg,rgba(0,0,0,.88),rgba(0,0,0,.5));pointer-events:auto',null,ov);pn.onpointerdown=e=>e.stopPropagation();
 const bd=mk('div','display:grid;grid-template-columns:1.2fr repeat(12,1fr) 1.3fr;grid-template-rows:repeat(3,var(--rh)) var(--rh2) var(--rh2);gap:2px;--rh:min(6.2vh,32px);--rh2:min(5vh,25px);margin:0 auto;max-width:920px',null,pn);
 const cell=(k,label,bg,gc,gr)=>{const c=mk('div','position:relative;display:flex;align-items:center;justify-content:center;background:'+bg+';border:1px solid #e8c050;border-radius:3px;font-size:min(3.3vh,14px);cursor:pointer;grid-column:'+gc+';grid-row:'+gr,label,bd);c.onpointerdown=e=>{e.stopPropagation();rouBet(k)};const b=mk('i','position:absolute;right:-2px;top:-3px;min-width:15px;height:15px;line-height:15px;border-radius:8px;background:#ffd040;color:#111;font:bold 10px/15px monospace;font-style:normal;padding:0 3px;text-align:center;display:none;z-index:2',null,c);R.cells[k]={c,b};return c};
 cell('n0','0',HEX.g,'1','1 / span 3');
 for(let c=1;c<=12;c++)for(let r=1;r<=3;r++){const n=3*c-(r-1);cell('n'+n,String(n),HEX[colOf(n)],String(c+1),String(r))}
 [['c3',1],['c2',2],['c1',3]].forEach(a=>cell(a[0],'2:1','#146a34','14',String(a[1])));
 ['d1','d2','d3'].forEach((k,i)=>cell(k,['1st 12','2nd 12','3rd 12'][i],'#146a34',(2+i*4)+' / span 4','4'));
 [['low','1-18','#146a34'],['even','EVEN','#146a34'],['red','RED',HEX.r],['black','BLACK','#15151a'],['odd','ODD','#146a34'],['high','19-36','#146a34']].forEach((a,i)=>cell(a[0],a[1],a[2],(2+i*2)+' / span 2','5'));
 const ctl=mk('div','display:flex;gap:6px;justify-content:center;align-items:center;margin-top:5px;flex-wrap:wrap',null,pn);
 chipRow(ctl,[1,5,10,25,100],5,v=>{R.chip=v});
 R.bClr=mk('button',BTN+'background:#7a2a2a','CLEAR',ctl);R.bClr.onclick=()=>rouClear();R.bUn=mk('button',BTN+'background:#445','UNDO',ctl);R.bUn.onclick=()=>rouUndo();R.bRe=mk('button',BTN+'background:#445','REBET',ctl);R.bRe.onclick=()=>rouRebet();
 R.tot=mk('div','color:#ffe890;min-width:84px;text-align:center',null,ctl);R.bSp=mk('button',BTN+'background:#2a8a3a;font-size:15px;padding:7px 18px','SPIN',ctl);R.bSp.onclick=()=>rouSpin();
 R.kd=e=>{if(e.key==='Escape')rouClose()};addEventListener('keydown',R.kd);
 rouRefresh();rouHist();R.raf=requestAnimationFrame(rouLoop)}
function rouRefresh(){const R=RG;if(!R)return;R.bal.textContent='CASH '+money(cash);for(const k in R.cells){const v=R.bets[k]||0,b=R.cells[k].b;b.style.display=v?'block':'none';b.textContent=v||''}
 const t=rouTotal(),bet=R.ph==='bet';R.tot.textContent=t?'BET '+money(t):'PLACE BETS';R.bSp.style.opacity=bet&&t?1:.4;R.bClr.style.opacity=R.bUn.style.opacity=bet&&t?1:.4;R.bRe.style.opacity=bet&&R.rebet&&!t?1:.4;R.lv.style.opacity=bet?1:.35}
function rouHist(){const R=RG;R.hist.textContent='';HIST.slice(-12).forEach(n=>{mk('span','display:inline-block;min-width:22px;padding:1px 3px;margin:0 1px;border-radius:9px;background:'+HEX[colOf(n)]+';border:1px solid #e8c050;font-size:11px',String(n),R.hist)})}
function rouMsg(t,ms){RG.msg.textContent=t;RG.msgT=ms||0}
function rouBet(k){const R=RG;if(!R||R.ph!=='bet')return;if(cash<R.chip){toast('NOT ENOUGH CASH');return}R.big.style.display='none';cash-=R.chip;R.bets[k]=(R.bets[k]||0)+R.chip;R.stack.push([k,R.chip]);beep(760,.05,'square',.04);refreshCash();rouRefresh()}
function rouUndo(){const R=RG;if(!R||R.ph!=='bet'||!R.stack.length)return;const[k,v]=R.stack.pop();R.bets[k]-=v;if(!R.bets[k])delete R.bets[k];cash+=v;refreshCash();rouRefresh()}
function rouClear(){const R=RG;if(!R||R.ph!=='bet')return;cash+=rouTotal();R.bets={};R.stack=[];refreshCash();rouRefresh()}
function rouRebet(){const R=RG;if(!R||R.ph!=='bet'||!R.rebet||rouTotal())return;const t=R.rebet.stack.reduce((a,b)=>a+b[1],0);if(cash<t){toast('NOT ENOUGH CASH');return}R.big.style.display='none';cash-=t;R.bets=Object.assign({},R.rebet.bets);R.stack=R.rebet.stack.map(a=>a.slice());beep(760,.05,'square',.04);refreshCash();rouRefresh()}
function rouSpin(){const R=RG;if(!R||R.ph!=='bet')return;if(!rouTotal()){toast('PLACE A BET FIRST');return}R.big.style.display='none';R.rebet={bets:Object.assign({},R.bets),stack:R.stack.map(a=>a.slice())};
 R.res=Math.floor(Math.random()*37);R.idx=WO.indexOf(R.res);R.ph='spin';R.sp=1;R.t=0;R.w0=10.5+Math.random()*2;WG.ab=WG.aw+Math.random()*TAU;WG.r=.575;WG.y=0;R.tcp=[WX,1.95,WZ+.95];R.tcl=[WX,.92,WZ-.02];rouMsg('NO MORE BETS!');beep(300,.2,'sawtooth',.05);rouRefresh()}
function rouStep(dt){const R=RG;WG.aw+=dt*(R.ph==='spin'?1.25:.5);
 if(R.ph==='spin'){R.t+=dt;const T1=5.0,T2=2.6;
  if(R.sp===1){const u=Math.min(1,R.t/T1),w=2.4+(R.w0-2.4)*Math.pow(1-u,1.5);WG.ab-=w*dt;WG.r=.575;if(R.t>=T1){R.sp=2;R.t2=0;R.relS=WG.ab-WG.aw;const pa=(R.idx+.5)/37*TAU,k=Math.ceil((pa-R.relS+1.5*TAU)/TAU);R.relE=pa-TAU*k;R.lastP=-1}}
  else if(R.sp===2){R.t2+=dt;const u=Math.min(1,R.t2/T2),e=ease(u),rel=R.relS+(R.relE-R.relS)*e;WG.ab=WG.aw+rel;WG.r=lerpf(.575,.39,clampf((u-.12)/.7,0,1)*clampf((u-.12)/.7,0,1)*(3-2*clampf((u-.12)/.7,0,1)));WG.y=u>.45?.012*Math.abs(Math.sin(u*TAU*4))*(1-u)*(1-u)*4:0;
   const pk=Math.floor(rel/TAU*37);if(pk!==R.lastP){R.lastP=pk;if(u>.3)beep(1500+(pk&3)*90,.018,'square',.025)}
   if(u>=1){R.sp=3;R.t3=0;WG.r=.39;WG.y=0;WG.idx=R.idx;beep(520,.1,'triangle',.07)}}
  else if(R.sp===3){WG.ab=WG.aw+(R.idx+.5)/37*TAU;R.t3+=dt;if(R.t3>.9)rouPay()}}
 else WG.ab=WG.aw+(WG.idx+.5)/37*TAU;
 wheelUpdate()}
function rouPay(){const R=RG,n=R.res;let ret=0;for(const k in R.bets)ret+=R.bets[k]*rouMult(k,n);const stake=rouTotal();cash+=ret;HIST.push(n);if(HIST.length>40)HIST.shift();
 R.big.textContent=String(n);R.big.style.background=HEX[colOf(n)];R.big.style.display='block';
 if(ret>stake){rouMsg(n+' '+({g:'GREEN',r:'RED',b:'BLACK'}[colOf(n)])+' - YOU WIN '+money(ret-stake)+'!');[0,1,2].forEach(i=>setTimeout(()=>beep(660+i*220,.12,'square',.06),i*110))}else if(ret===stake&&ret>0)rouMsg(n+' - YOU GET YOUR STAKE BACK');else rouMsg(n+' '+({g:'GREEN',r:'RED',b:'BLACK'}[colOf(n)])+' - HOUSE WINS');
 R.bets={};R.stack=[];R.ph='bet';R.tcp=[-6.0,2.75,-1.3];R.tcl=[-6.0,.55,-3.4];refreshCash();rouRefresh();rouHist()}
function rouLoop(now){const R=RG;if(!R)return;const dt=Math.min(.05,(now-R.last)/1000);R.last=now;rouStep(dt);const k=1-Math.exp(-dt*(R.ph==='spin'?2.6:2.2));for(let i=0;i<3;i++){R.cp[i]+=(R.tcp[i]-R.cp[i])*k;R.cl[i]+=(R.tcl[i]-R.cl[i])*k}R.raf=requestAnimationFrame(rouLoop)}
function rouClose(){const R=RG;if(!R||R.ph==='spin')return;rouClear();cancelAnimationFrame(R.raf);removeEventListener('keydown',R.kd);R.ov.remove();RG=null;gClose()}
/* =================================================== BLACKJACK =================================================== */
let BJ=null;const CARDS=new Map(),SUITS=['♠','♥','♦','♣'],RANKS=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
function cardTex(c){const key=c?c.r+c.s:'back';if(CARDS.has(key))return CARDS.get(key);const t=cvx(128,180,(g,W,H)=>{const rr=(x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
 if(!c){g.fillStyle='#f8f4ea';rr(2,2,W-4,H-4,10);g.fill();g.fillStyle='#a01428';rr(9,9,W-18,H-18,6);g.fill();g.strokeStyle='#e8c050';g.lineWidth=2;for(let i=-H;i<W;i+=14){g.beginPath();g.moveTo(i,0);g.lineTo(i+H,H);g.stroke();g.beginPath();g.moveTo(i+H,0);g.lineTo(i,H);g.stroke()}g.fillStyle='#a01428';g.beginPath();g.arc(W/2,H/2,20,0,TAU);g.fill();g.strokeStyle='#e8c050';g.lineWidth=3;g.stroke();return}
 g.fillStyle='#f8f4ea';rr(2,2,W-4,H-4,10);g.fill();g.strokeStyle='#999';g.lineWidth=2;g.stroke();const red=c.s==='♥'||c.s==='♦';g.fillStyle=red?'#c01428':'#15151a';g.textAlign='center';g.textBaseline='middle';
 g.font='bold 30px Georgia,serif';g.fillText(c.r,22,26);g.font='26px "DejaVu Sans",Arial,sans-serif';g.fillText(c.s,22,54);g.save();g.translate(W-22,H-26);g.rotate(Math.PI);g.font='bold 30px Georgia,serif';g.fillText(c.r,0,0);g.font='26px "DejaVu Sans",Arial,sans-serif';g.fillText(c.s,0,28);g.restore();g.font='72px "DejaVu Sans",Arial,sans-serif';g.fillText(c.s,W/2,H/2+4)});CARDS.set(key,t);return t}
const cval=c=>c.r==='A'?11:'JQK'.includes(c.r)?10:+c.r;
function hv(h){let t=0,a=0;for(const c of h){t+=cval(c);if(c.r==='A')a++}while(t>21&&a){t-=10;a--}return{t,soft:a>0}}
function newShoe(){const s=[];for(let d=0;d<6;d++)for(const su of SUITS)for(const r of RANKS)s.push({r,s:su});for(let i=s.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[s[i],s[j]]=[s[j],s[i]]}return s}
let SHOE=null;
function bjCam(){DZ.look.copy(wv(BJ.cl));return wv(BJ.cp)}
function bjOpen(){if(BJ||busy)return;if(!SHOE||SHOE.length<60)SHOE=newShoe();
 const B=BJ={ph:'bet',bet:0,chip:5,pl:[],de:[],meshes:[],cp:[BX,1.85,-3.15],cl:[BX,.9,-4.55],last:performance.now(),dbl:false,tm:[]};gOpen(bjCam,50);
 const ov=B.ov=mk('div','position:fixed;inset:0;z-index:60;font:bold 13px monospace;color:#fff;pointer-events:none;user-select:none;-webkit-user-select:none;touch-action:none');document.body.appendChild(ov);
 const top=mk('div','position:absolute;left:0;right:0;top:6px;display:flex;justify-content:space-between;align-items:flex-start;padding:0 8px;text-shadow:2px 2px 0 #000',null,ov);
 B.bal=mk('div','font-size:16px;color:#ffe890;min-width:110px',null,top);const mid=mk('div','text-align:center;flex:1',null,top);mk('div','color:#f5e6a0;font-size:15px','BLACKJACK',mid);B.msg=mk('div','min-height:18px;color:#9fe;margin-top:2px;font-size:14px',null,mid);
 B.lv=mk('button',BTN+'font-size:12px;min-width:60px','LEAVE',top);B.lv.onclick=()=>bjClose();
 B.sc=mk('div','position:absolute;left:8px;top:48px;font-size:14px;text-shadow:2px 2px 0 #000;line-height:1.5',null,ov);
 const pn=mk('div','position:absolute;left:0;right:0;bottom:0;padding:8px 6px 10px;background:linear-gradient(0deg,rgba(0,0,0,.85),rgba(0,0,0,.4));display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap;pointer-events:auto',null,ov);pn.onpointerdown=e=>e.stopPropagation();B.pn=pn;
 B.kd=e=>{if(e.key==='Escape')bjClose()};addEventListener('keydown',B.kd);bjUI();B.raf=requestAnimationFrame(bjLoop)}
function bjUI(){const B=BJ;B.pn.textContent='';B.bal.textContent='CASH '+money(cash);B.lv.style.opacity=B.ph==='bet'?1:.35;
 if(B.ph==='bet'){chipRow(B.pn,[1,5,25,100],B.chip,v=>{B.chip=v});const add=mk('button',BTN+'background:#445','ADD CHIP',B.pn);add.onclick=()=>{if(cash<B.chip){toast('NOT ENOUGH CASH');return}cash-=B.chip;B.bet+=B.chip;beep(760,.05,'square',.04);refreshCash();bjUI()};
  const clr=mk('button',BTN+'background:#7a2a2a','CLEAR',B.pn);clr.onclick=()=>{cash+=B.bet;B.bet=0;refreshCash();bjUI()};mk('div','color:#ffe890;min-width:84px;text-align:center','BET '+money(B.bet),B.pn);
  const dl=mk('button',BTN+'background:#2a8a3a;font-size:15px;padding:7px 18px','DEAL',B.pn);dl.style.opacity=B.bet?1:.4;dl.onclick=()=>bjDeal();
  if(B.lastBet&&!B.bet){const rb=mk('button',BTN+'background:#445','REBET '+money(B.lastBet),B.pn);rb.onclick=()=>{if(cash<B.lastBet){toast('NOT ENOUGH CASH');return}cash-=B.lastBet;B.bet=B.lastBet;refreshCash();bjUI()}}}
 else if(B.ph==='player'){const h=mk('button',BTN+'background:#2a6aa0;font-size:15px;padding:8px 18px','HIT',B.pn);h.onclick=()=>bjHit();const s=mk('button',BTN+'background:#a06a1a;font-size:15px;padding:8px 18px','STAND',B.pn);s.onclick=()=>bjStand();
  if(B.pl.length===2&&cash>=B.bet){const d=mk('button',BTN+'background:#7a2a7a;font-size:15px;padding:8px 18px','DOUBLE',B.pn);d.onclick=()=>bjDouble()}}
 B.bal.textContent='CASH '+money(cash);bjScore()}
function bjScore(){const B=BJ;if(!B)return;const p=hv(B.pl),dh=B.hole?hv(B.de.slice(0,1)):hv(B.de);B.sc.textContent=B.de.length?'DEALER '+(B.hole?cval(B.de[0])===11?'11':String(cval(B.de[0])):dh.t)+(B.pl.length?'\nYOU '+p.t+(p.soft&&p.t<21?' (soft)':'')+(B.bet?'   BET '+money(B.bet):''):''):'';B.sc.style.whiteSpace='pre'}
function later(ms,fn){const B=BJ;B.tm.push(setTimeout(()=>{if(BJ===B)fn()},ms))}
function cardMesh(c,fromP,toP,delay){const B=BJ,m=new THREE.Mesh(new THREE.PlaneGeometry(.1,.14).rotateX(-Math.PI/2),bmat({map:cardTex(c)}));m.userData={c,t:-delay,from:fromP,to:toP,tex:c?cardTex(c):null};m.position.set(fromP[0],fromP[1],fromP[2]);m.rotation.y=(Math.random()-.5)*.3;GG.add(m);B.meshes.push(m);return m}
function slotPos(who,i,n){const sp=n>5?.09:.11,x0=BX-(n-1)*sp/2;return who==='p'?[x0+i*sp,TY+.014+i*.0008,BZ+.7]:[x0+i*sp,TY+.014+i*.0008,BZ+.2]}
function reflow(who){const B=BJ,hand=who==='p'?B.pl:B.de,ms=B.meshes.filter(m=>m.userData.who===who);ms.forEach((m,i)=>{m.userData.to=slotPos(who,i,hand.length)})}
function dealTo(who,hidden){const B=BJ,hand=who==='p'?B.pl:B.de;if(SHOE.length<12)SHOE=newShoe();const c=SHOE.pop();hand.push(c);const m=cardMesh(hidden?null:c,[BX+1.3,TY+.2,BZ+.2],slotPos(who,hand.length-1,hand.length),0);m.userData.who=who;m.userData.real=c;m.userData.hid=!!hidden;reflow(who);beep(1100,.03,'square',.03);return c}
function bjDeal(){const B=BJ;if(B.ph!=='bet'||!B.bet)return;B.lastBet=B.bet;B.ph='deal';B.hole=true;B.msgT=0;B.msg.textContent='';B.pl=[];B.de=[];for(const m of B.meshes)GG.remove(m);B.meshes=[];bjChips();bjUI();
 later(150,()=>{dealTo('p');bjScore()});later(600,()=>{dealTo('d');bjScore()});later(1050,()=>{dealTo('p');bjScore()});later(1500,()=>{dealTo('d',true);bjScore();
  const p=hv(B.pl).t;later(500,()=>{if(p===21){bjFinish()}else{B.ph='player';bjUI()}})})}
function bjHit(){const B=BJ;if(B.ph!=='player')return;B.ph='deal';bjUI();dealTo('p');bjScore();later(450,()=>{const t=hv(B.pl).t;if(t>21)bjFinish();else if(t===21)bjStand(true);else{B.ph='player';bjUI()}})}
function bjDouble(){const B=BJ;if(B.ph!=='player'||B.pl.length!==2||cash<B.bet)return;cash-=B.bet;B.bet*=2;B.dbl=true;refreshCash();B.ph='deal';bjUI();bjChips();dealTo('p');bjScore();later(550,()=>bjStand(true))}
function bjStand(){const B=BJ;if(!(B.ph==='player'||B.ph==='deal'))return;B.ph='dealer';bjUI();later(250,()=>bjReveal(()=>bjDealerPlay()))}
function bjReveal(cb){const B=BJ;B.hole=false;const m=B.meshes.find(x=>x.userData.hid);if(m){m.userData.hid=false;m.material.map=cardTex(m.userData.real);m.material.needsUpdate=true;m.userData.pop=.3}beep(900,.05,'square',.04);bjScore();later(550,cb)}
function bjDealerPlay(){const B=BJ,p=hv(B.pl).t;if(p>21||(B.pl.length===2&&p===21&&B.de.length===2)){bjFinish();return}const t=hv(B.de);if(t.t<17){dealTo('d');bjScore();later(650,bjDealerPlay)}else bjFinish()}
function bjFinish(){const B=BJ;if(B.hole){bjReveal(bjFinish);return}const p=hv(B.pl).t,d=hv(B.de).t,pbj=B.pl.length===2&&p===21&&!B.dbl,dbj=B.de.length===2&&d===21;let ret=0,txt;
 if(p>21)txt='BUST! YOU LOSE '+money(B.bet);else if(pbj&&!dbj){ret=B.bet*2.5;txt='BLACKJACK! YOU WIN '+money(ret-B.bet)}else if(dbj&&!pbj)txt='DEALER HAS BLACKJACK';else if(d>21){ret=B.bet*2;txt='DEALER BUSTS! YOU WIN '+money(B.bet)}else if(p>d){ret=B.bet*2;txt='YOU WIN '+money(B.bet)+'!'}else if(p===d){ret=B.bet;txt='PUSH - STAKE BACK'}else txt='DEALER WINS WITH '+d;
 cash+=ret;if(ret>B.bet){[0,1,2].forEach(i=>setTimeout(()=>beep(660+i*220,.12,'square',.06),i*110))}B.msg.textContent=txt;B.bet=0;B.dbl=false;B.ph='bet';B.hole=false;bjChips();refreshCash();bjScore();bjUI()}
function bjChips(){const B=BJ;if(B.chipG)GG.remove(B.chipG);B.chipG=null;if(!B.bet)return;const g=new THREE.Group(),cols=[[100,0x222222],[25,0x20a040],[5,0xd02020],[1,0xf0f0f0]];let rem=B.bet,y=0,col=0;for(const[v,c]of cols){let n=Math.floor(rem/v);rem-=n*v;n=Math.min(n,8);for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.008,14),bmat({color:c}));m.position.set((col%3-1)*.07*0,TY+.012+y*.0085,0);g.add(m);y++}}g.position.set(BX,0,BZ+1.17);GG.add(g);B.chipG=g}
function bjLoop(now){const B=BJ;if(!B)return;const dt=Math.min(.05,(now-B.last)/1000);B.last=now;
 for(const m of B.meshes){const u=m.userData;if(u.t<1){u.t+=dt/.32;const e=ease(clampf(u.t,0,1));if(u.t>=0){const f=u.from,t=u.to;m.position.set(lerpf(f[0],t[0],e),lerpf(f[1],t[1],e)+Math.sin(e*Math.PI)*.12,lerpf(f[2],t[2],e));m.rotation.y*=(1-Math.min(1,dt*6))}}else{m.position.x+=(u.to[0]-m.position.x)*Math.min(1,dt*10);m.position.z+=(u.to[2]-m.position.z)*Math.min(1,dt*10)}
  if(u.pop>0){u.pop-=dt;m.position.y=u.to[1]+Math.sin(Math.max(0,u.pop)/.3*Math.PI)*.05}}
 B.raf=requestAnimationFrame(bjLoop)}
function bjClose(){const B=BJ;if(!B||(B.ph!=='bet'))return;cash+=B.bet;B.bet=0;refreshCash();cancelAnimationFrame(B.raf);B.tm.forEach(clearTimeout);removeEventListener('keydown',B.kd);for(const m of B.meshes)GG.remove(m);if(B.chipG)GG.remove(B.chipG);B.ov.remove();BJ=null;gClose()}
/* ---------- hook into the casino hall ---------- */
{const b0=buildShop;buildShop=function(o){b0(o);if(!o||!o.casino)return;if(!built)buildGames();SG.add(GG);for(const p of PEOPLE)SG.add(p);
 IROOM.push([-8.8,-3.6,-5.5,-3.3],[4.3,8.1,-5.8,-3.4]);
 for(const sd of[-1,1])for(const z of SLOTZ)IROOM.push([Math.min(sd*10.1,sd*10.73),Math.max(sd*10.1,sd*10.73),z-.46,z+.46]);
 IA.push({r:[-7.9,-3.8,-3.3,-2.7],label:'PLAY ROULETTE',fn:rouOpen},{r:[4.7,7.7,-3.4,-2.8],label:'PLAY BLACKJACK',fn:bjOpen});
 for(const sd of[-1,1])for(const z of SLOTZ)IA.push({r:[Math.min(sd*10.1,sd*10.73),Math.max(sd*10.1,sd*10.73),z-.46,z+.46],label:'FRUIT MACHINE (£1)',fn:()=>sltOpen()})}}
{const u0=updCozy;updCozy=function(dt){u0(dt);if(built&&GS.inside&&SHOPCUR&&SHOPCUR.o&&SHOPCUR.o.casino&&!RG){WG.aw+=dt*.5;WG.ab=WG.aw+(WG.idx+.5)/37*TAU;WG.r=.39;WG.y=0;wheelUpdate()}}}
window.CASINOGAMES={rouOpen,bjOpen,WG,get RG(){return RG},get BJ(){return BJ}};
})();
