/* ===== COZY STOCK EXCHANGE: a trading hall in the east of the village. Ten listed companies drawn from the town, prices that
   move live (plus market mood, company news and daily dividends), live ticker board inside, buy/sell overlay, portfolio. ===== */
(function(){
var tickCv=null,boardCv=null,boardTex=null;const Y=G0,EX={cx:186,cz:-12,rot:0,w:18,d:12,h:6.2};
const W2=(lx,lz)=>{const c=Math.cos(EX.rot),s=Math.sin(EX.rot);return[EX.cx+lx*c+lz*s,EX.cz-lx*s+lz*c]};
const DOORP=W2(0,EX.d/2+1.4);
const CO=[['COLA','COZY COLA',42,.012,.004],['MOTR','VILLAGE MOTORS',88,.016,.003],['GRGE',"JOE'S GARAGE",31,.02,.005],['ALE','ROYAL OAK ALE',55,.011,.006],['PROP','RUTH & CO PROPERTY',120,.013,.004],['CHIP',"FRANKIE'S CHIPS",18,.026,.002],['CSNO','CASINO ROYALE',210,.03,.0],['RACE','COZY MOTORSPORT',66,.024,.002],['PWR','COZY ENERGY',95,.009,.007],['BANK','BLUEBELL BANK',140,.008,.008]];
const ST={px:{},hist:{},sh:{},cost:{},news:[],mood:0,real:0,tick:0};
CO.forEach(c=>{ST.px[c[0]]=c[2];ST.hist[c[0]]=Array(40).fill(c[2]);ST.sh[c[0]]=0;ST.cost[c[0]]=0});
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.sx=ST;return o};cozyLoad=function(z){l0(z);if(z&&z.sx){for(const k of['px','hist','sh','cost'])Object.assign(ST[k],z.sx[k]||{});ST.news=z.sx.news||[];ST.mood=z.sx.mood||0;ST.real=z.sx.real||0}}}
const gauss=()=>{let u=0;for(let i=0;i<6;i++)u+=Math.random();return (u-3)*1.41};
const NG=[['WINS A BIG CONTRACT',.09],['REPORTS RECORD PROFITS',.07],['IS TIPPED BY ANALYSTS',.05],['ANNOUNCES NEW BOSS',.03],['MISSES TARGETS',-.06],['RECALLS A PRODUCT',-.09],['FACES A STRIKE',-.07],['IS HIT BY A SCANDAL',-.12]];
function headline(c,g){return c[1]+' '+g[0]+(g[1]>0?' ▲':' ▼')}
function tick(big){ST.mood=ST.mood*.97+gauss()*.003;let moved=0;
 for(const c of CO){const id=c[0],v=c[3]*(big?3:1),p=ST.px[id];let np=p*Math.exp(ST.mood*(big?3:1)+gauss()*v+(c[2]/p-1)*.0015);np=Math.max(1,Math.round(np*100)/100);ST.px[id]=np;const h=ST.hist[id];h.push(np);if(h.length>80)h.shift()}
 if(Math.random()<(big?.7:.012)){const c=CO[Math.floor(Math.random()*CO.length)],g=NG[Math.floor(Math.random()*NG.length)];ST.px[c[0]]=Math.max(1,Math.round(ST.px[c[0]]*(1+g[1])*100)/100);ST.hist[c[0]].push(ST.px[c[0]]);ST.news.unshift(headline(c,g));ST.news.length=Math.min(ST.news.length,12);if(ST.sh[c[0]]>0)toast(headline(c,g))}}
{const n0=newDay;newDay=function(){const r=n0.apply(this,arguments);tick(true);let dv=0;for(const c of CO){const q=ST.sh[c[0]];if(q>0)dv+=q*ST.px[c[0]]*c[4]}dv=Math.round(dv);if(dv>0){cash+=dv;setTimeout(()=>toast('SHARE DIVIDENDS: +£'+dv),1800)}return r}}
{const u0=updCozy;updCozy=function(dt){u0(dt);ST.real+=dt;if(ST.real>=6){ST.real=0;tick(false);if(OV)render();boardDraw()}}}
const val=()=>CO.reduce((a,c)=>a+ST.sh[c[0]]*ST.px[c[0]],0),chg=id=>{const h=ST.hist[id];return h[h.length-1]/h[Math.max(0,h.length-13)]-1};
const fee=x=>Math.max(1,Math.round(x*.005*100)/100);
function buy(id,n){const p=ST.px[id],cost=p*n+fee(p*n);if(n<1||cash<cost)return false;cash-=cost;ST.cost[id]+=p*n;ST.sh[id]+=n;beep(880,.08,'square',.05);return true}
function sell(id,n){n=Math.min(n,ST.sh[id]);if(n<1)return false;const p=ST.px[id],avg=ST.cost[id]/ST.sh[id];cash+=p*n-fee(p*n);ST.cost[id]-=avg*n;ST.sh[id]-=n;if(!ST.sh[id])ST.cost[id]=0;beep(660,.08,'square',.05);return true}
/* ---------- building */
const cvx=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');fn(g,w,h);const t=new THREE.CanvasTexture(c);t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;return t};
{const Bo=new Builder(3),Br=new Builder(2),pb=(lx,y,lz,sx,sy,sz,col)=>{const p=W2(lx,lz);pbox(Bo,p[0],Y+y,p[1],sx,sy,sz,col,EX.rot)},{w,d,h}=EX,ST1=[.9,.88,.8],GD=[.85,.68,.2],GN=[.08,.26,.18],DK=[.12,.14,.14];
 pb(0,0,0,w,h,d,ST1);pb(0,0,d/2+.5,w+2,.5,3.2,[.7,.68,.62]);pb(0,.5,d/2+.5,w+1,.3,2.6,[.78,.76,.7]);
 for(let i=0;i<6;i++)pb(-w/2+1.4+i*(w-2.8)/5,.8,d/2+1.3,1.1,h-.8,1.1,[.97,.96,.92]);
 pb(0,h,d/2+.4,w+1.6,1.2,3.4,ST1);pb(0,h+1.2,d/2+.4,w+.8,.5,3,GD);for(let i=0;i<7;i++)pb(-w/2+1+i*(w-2)/6,h+1.7,d/2+.6,w/8,1.1-i%2*0,2.4,[.84,.82,.76]);
 pb(0,h+1.7,d/2+.6,w*.55,2.6,2.4,[.9,.88,.8]);pb(0,h+4.3,d/2+.6,w*.6,.4,2.7,GD);
 pb(0,h,0,w+.8,.6,d+.8,GN);pb(0,h+.6,0,w+.8,.2,d+.8,GD);pb(0,h+.8,-1,5,3.4,5,GN);pb(0,h+4.2,-1,5.4,.3,5.4,GD);
 const q0=W2(0,d/2+9);quadXZ(Br,[q0[0]-9,q0[1]-8],[q0[0]+9,q0[1]-8],[q0[0]+9,q0[1]+7],[q0[0]-9,q0[1]+7],[.3,.3,.32],Y+.055);
 const gr=new THREE.Group();scene.add(gr);gr.add(Br.mesh(mRoad));gr.add(Bo.mesh(mObj));
 const sign=(t,bg,fg,wd,ht,lx,y,lz,pw,ph,sz)=>{const p=W2(lx,lz),m=new THREE.Mesh(new THREE.PlaneGeometry(wd,ht),new THREE.MeshBasicMaterial({map:txtTex(pw,ph,bg,fg,t,sz),side:THREE.DoubleSide}));m.position.set(p[0],Y+y,p[1]);m.rotation.y=EX.rot;gr.add(m)};
 sign('COZY STOCK EXCHANGE','#0e2a1c','#e8c050',w-2,1.6,0,h+.5,d/2+2.18,768,90,40);sign('EST. 1888 · TRADING DAILY','#0e2a1c','#e8c050',7,.6,0,h+5,d/2+2.15,448,40,22);
 const gl=new THREE.Mesh(new THREE.PlaneGeometry(w-4,3.2),mGlass);{const p=W2(0,d/2+.03);gl.position.set(p[0],Y+2.2,p[1]);gl.rotation.y=EX.rot;gr.add(gl)}
 /* live ticker band across the facade */
 tickCv=cvx(1024,64,()=>{});const tm=new THREE.Mesh(new THREE.PlaneGeometry(w+1.4,1.1),new THREE.MeshBasicMaterial({map:tickCv,side:THREE.DoubleSide}));{const p=W2(0,d/2+2.25);tm.position.set(p[0],Y+h-.35,p[1]);tm.rotation.y=EX.rot;gr.add(tm)}
 setTimeout(()=>boardDraw(),0);
 perimCol(EX.cx,EX.cz,EX.rot,w/2,d/2,.5,1.2);OBS.push({x:EX.cx,z:EX.cz,c:1,s:0,hw:w/2,hd:d/2});BLD.push({x:EX.cx,z:EX.cz,rot:EX.rot,w,d,k:'stocks',n:1});
 SHOPD.push({x:DOORP[0],z:DOORP[1],psi:EX.rot+Math.PI/2*0,t:'COZY STOCK EXCHANGE',bg:'#0e2a1c',fg:'#e8c050',stk:1,rx:6.8,rz:5.2,sz:3.0});Object.assign(HRS,{'COZY STOCK EXCHANGE':[8,18]});
 const sl0=shopLabel;shopLabel=function(o){return o&&o.stk?(shopOpen(o).open?'ENTER STOCK EXCHANGE':sl0(o)):sl0(o)};
 const cone=new THREE.ConeGeometry(.34,.7,4);cone.rotateX(Math.PI);cone.translate(0,-.35,0);const stem=new THREE.BoxGeometry(.16,.5,.16);stem.translate(0,.25,0);const am=new THREE.MeshBasicMaterial({color:0x40e090,fog:false}),ag=new THREE.Group();ag.add(new THREE.Mesh(cone,am),new THREE.Mesh(stem,am));ag.visible=false;scene.add(ag);
 const u0=updCozy;updCozy=function(dt){u0(dt);const px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z,dist=Math.hypot(DOORP[0]-px,DOORP[1]-pz),t=performance.now()/1000;ag.visible=!GS.inside&&dist<38&&!menuOpen;if(ag.visible){ag.position.set(DOORP[0],G0+2.6+Math.sin(t*3.2)*.18,DOORP[1]);ag.rotation.y=t*1.2;ag.scale.setScalar(Math.max(.7,Math.min(1.3,dist/14)))}}}
function boardDraw(){const draw=(c,W,H,rows)=>{const g=c.getContext('2d');g.fillStyle='#04100a';g.fillRect(0,0,W,H);if(rows){g.font='bold 15px monospace';let x=6;for(const co of CO){const id=co[0],ch=chg(id);g.fillStyle='#e8c050';g.fillText(id,x,24);g.fillStyle=ch>=0?'#40e060':'#ff5050';g.fillText(ST.px[id].toFixed(1)+(ch>=0?'▲':'▼'),x,48);x+=Math.floor(W/10)}}};
 if(tickCv){const c=tickCv.image;draw(c,1024,64,1);tickCv.needsUpdate=true}
 if(boardCv&&GS.inside){const c=boardCv.image,g=c.getContext('2d'),W=c.width,H=c.height;g.fillStyle='#04100a';g.fillRect(0,0,W,H);g.strokeStyle='#e8c050';g.lineWidth=4;g.strokeRect(3,3,W-6,H-6);g.font='bold 20px monospace';g.fillStyle='#e8c050';g.textAlign='left';g.fillText('COZY STOCK EXCHANGE — LIVE PRICES',14,28);g.font='bold 17px monospace';
  CO.forEach((co,i)=>{const id=co[0],ch=chg(id),col=i<5?0:1,row=i%5,x=14+col*300,y=62+row*30;g.fillStyle='#fff';g.fillText(id.padEnd(5)+ST.px[id].toFixed(2).padStart(8),x,y);g.fillStyle=ch>=0?'#40e060':'#ff5050';g.fillText((ch>=0?'+':'')+(ch*100).toFixed(1)+'%',x+195,y)});
  g.fillStyle='#9fe';g.fillText('MOOD '+(ST.mood>.002?'BULLISH':ST.mood<-.002?'BEARISH':'CALM'),14,H-8);if(ST.news[0]){g.fillStyle='#ffd24a';g.fillText(ST.news[0].slice(0,46),170,H-8)}boardTex.needsUpdate=true}}
{const b0=buildShop;buildShop=function(o){if(!o||!o.stk)return b0(o);
 while(SG.children.length)SG.remove(SG.children[0]);RX=o.rx;RZ=o.rz;SHK=null;const B=(x,y,z,w2,h2,d2,hex)=>sbox(x,y,z,w2,h2,d2,fmc(hex)),Hh=IH+.9;
 SG.add(new THREE.Mesh(new THREE.PlaneGeometry(2*RX,2*RZ).rotateX(-Math.PI/2),imat(FLR.tile())));
 const wm=tx=>{const m=imat(tx);m.color.setHex(0x1c3a2c);return m};
 splane(2*RX,Hh,0,Hh/2,-RZ,0,wm(sWl));splane(2*RX,Hh,0,Hh/2,RZ,Math.PI,wm(sWl));splane(2*RZ,Hh,RX,Hh/2,0,-Math.PI/2,wm(sWl2));splane(2*RZ,Hh,-RX,Hh/2,0,Math.PI/2,wm(sWl2));
 const vd=new THREE.Mesh(new THREE.BoxGeometry(90,70,90),new THREE.MeshBasicMaterial({color:0x08100c,side:THREE.BackSide,fog:false}));vd.position.y=Hh/2;SG.add(vd);
 splane(1.1,2.2,0,1.1,RZ-.02,Math.PI,imat(T_FDOOR));
 boardCv=cvx(600,230,()=>{});boardTex=boardCv;splane(5.6,2.15,0,2.0,-RZ+.03,0,new THREE.MeshBasicMaterial({map:boardTex,side:THREE.DoubleSide}));boardDraw();
 B(0,0,-RZ+2.4,5,1.0,.8,0x0e2a1c);B(0,1.0,-RZ+2.4,5.1,.07,.9,0xd8b040);B(-1.2,1.07,-RZ+2.4,.6,.4,.05,0x202228);B(1.2,1.07,-RZ+2.4,.6,.4,.05,0x202228);
 const cl=personIn(pSpec(8131,{f:false,hs:1,ts:2,gl:true,scarf:null,bp:false,bag:0,old:false,tc:[.1,.3,.2],sk:PSK[0]}),0,-RZ+1.6,0);SG.add(cl);
 for(const sx of[-1,1]){B(sx*(RX-.6),0,0,.8,.3,4,0x2a160a);B(sx*(RX-.6),.3,0,.8,1.0,4,0x0e2a1c);splane(3.8,1.4,sx*(RX-1.02),1.5,0,-sx*Math.PI/2,new THREE.MeshBasicMaterial({map:cvx(256,96,(g,W,H)=>{g.fillStyle='#04100a';g.fillRect(0,0,W,H);g.fillStyle='#e8c050';g.font='bold 18px monospace';g.fillText(sx<0?'"BUY LOW,':'SELL HIGH."',20,56)}),side:THREE.DoubleSide}))}
 for(const[x,z]of[[-3,1.5],[3,1.5]]){B(x,0,z,1.8,.45,.8,0x4a2a14);B(x,.45,z+.4,1.8,.5,.2,0x4a2a14)}
 IROOM.splice(0,IROOM.length,[-RX-1,RX+1,-RZ-1,-RZ+.9],[-2.6,2.6,-RZ+1.9,-RZ+2.9],[-RX,-RX+1.2,-2.2,2.2],[RX-1.2,RX,-2.2,2.2],[-3.9,-2.1,1.0,2.0],[2.1,3.9,1.0,2.0]);
 SHOPCUR={o:o,k:['BROKER',"Welcome to the Exchange. Buy low, sell high — and mind the news."]};
 IA.splice(0,IA.length,{r:[-2.4,2.4,-RZ+2.9,-RZ+3.8],label:'TRADE SHARES',fn:()=>open(0)},{r:[-1.0,1.0,RZ-.3,RZ],label:'LEAVE',fn:()=>leaveShop()});
 try{addVisitors(o)}catch(e){czErr(e,"stocks.js")}}}
{const u0=updCozy;updCozy=function(dt){u0(dt);if(GS.inside&&SHOPCUR&&SHOPCUR.o&&SHOPCUR.o.stk)boardDraw()}}
/* ---------- overlay */
let OV=null;
function open(tab){if(OV||busy)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;
 const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:60;background:rgba(0,0,10,.7);font:bold 13px monospace;color:#fff;display:flex;align-items:center;justify-content:center';document.body.appendChild(ov);
 const pn=document.createElement('div');pn.style.cssText='width:min(94vw,580px);max-height:92vh;overflow:auto;background:#0a1610;border:3px solid #e8c050;box-shadow:4px 4px 0 #000;padding:10px;box-sizing:border-box';ov.appendChild(pn);pn.onpointerdown=e=>e.stopPropagation();
 OV={ov,pn,tab:tab||0,sel:CO[0][0],msg:''};OV.kd=e=>{if(e.key==='Escape')close()};addEventListener('keydown',OV.kd);render()}
function close(){if(!OV)return;removeEventListener('keydown',OV.kd);OV.ov.remove();OV=null;busy=0}
function spark(id,W,H){const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),h=ST.hist[id],mn=Math.min(...h),mx=Math.max(...h),r=mx-mn||1;g.strokeStyle=h[h.length-1]>=h[0]?'#40e060':'#ff5050';g.lineWidth=2;g.beginPath();h.forEach((v,i)=>{const x=i/(h.length-1)*(W-2)+1,y=H-3-(v-mn)/r*(H-6);i?g.lineTo(x,y):g.moveTo(x,y)});g.stroke();c.style.cssText='display:block';return c}
function render(){const pn=OV.pn;pn.textContent='';const el=(t,css,txt,par)=>{const e=document.createElement(t);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;(par||pn).appendChild(e);return e};
 const bt=(par,txt,on,fn,dis)=>{const b=el('button','font:bold 12px monospace;border:2px solid '+(on?'#e8c050':'#556')+';border-radius:6px;color:#fff;background:'+(on?'#1c4a30':'#242838')+';padding:6px 9px;margin:2px;touch-action:manipulation;'+(dis?'opacity:.4;':''),txt,par);b.onclick=e=>{e.stopPropagation();fn()};return b};
 const hd=el('div','display:flex;justify-content:space-between;align-items:center;margin-bottom:6px');el('div','font-size:16px;color:#e8c050','COZY STOCK EXCHANGE',hd);bt(hd,'CLOSE',0,close);
 const pv=val(),pl=CO.reduce((a,c)=>a+(ST.sh[c[0]]?ST.sh[c[0]]*ST.px[c[0]]-ST.cost[c[0]]:0),0);
 el('div','color:#9fe','CASH £'+Math.round(cash)+'  ·  SHARES £'+Math.round(pv)+'  ·  P/L '+(pl>=0?'+':'')+'£'+Math.round(pl));
 el('div','color:#9ab;font-size:11px','MARKET MOOD: '+(ST.mood>.002?'BULLISH':ST.mood<-.002?'BEARISH':'CALM')+'  ·  FEE 0.5%  ·  DIVIDENDS PAID EACH MORNING');
 if(OV.msg)el('div','color:#ffd24a;margin:3px 0',OV.msg);
 const tb=el('div','margin:6px 0');['MARKET','PORTFOLIO','NEWS'].forEach((t,i)=>bt(tb,t,OV.tab===i,()=>{OV.tab=i;render()}));
 if(OV.tab===2){if(!ST.news.length)el('div','color:#aab','NO NEWS YET. CHECK BACK TOMORROW.');ST.news.forEach(n=>el('div','padding:3px 0;border-top:1px solid #234;color:'+(n.includes('▲')?'#40e060':'#ff7070'),n));return}
 const rows=OV.tab===1?CO.filter(c=>ST.sh[c[0]]>0):CO;
 if(!rows.length)el('div','color:#aab;margin:8px','YOU OWN NO SHARES YET.');
 rows.forEach(c=>{const id=c[0],ch=chg(id),sel=OV.sel===id,r=el('div','display:flex;align-items:center;justify-content:space-between;border-top:1px solid #234;padding:4px 2px;cursor:pointer;'+(sel?'background:#12301f':''));r.onclick=()=>{OV.sel=id;render()};
  const L=el('div','',null,r);el('div','color:#fff',id+'  '+c[1],L);el('div','color:#9ab;font-size:11px','DIV '+(c[4]*100).toFixed(1)+'%/DAY'+(ST.sh[id]?'  ·  HOLD '+ST.sh[id]+(ST.sh[id]?'  AVG £'+(ST.cost[id]/ST.sh[id]).toFixed(2):''):''),L);
  const M=el('div','display:flex;align-items:center;gap:8px',null,r);M.appendChild(spark(id,70,26));el('div','text-align:right;min-width:78px;color:'+(ch>=0?'#40e060':'#ff6060'),'£'+ST.px[id].toFixed(2)+'\n'+(ch>=0?'+':'')+(ch*100).toFixed(1)+'%',M).style.whiteSpace='pre';
  if(sel){const a=el('div','width:100%;padding:4px 0',null,pn);}});
 const id=OV.sel,c=CO.find(x=>x[0]===id),p=ST.px[id],q=ST.sh[id];
 const dt=el('div','margin-top:8px;border:2px solid #e8c050;padding:8px');el('div','color:#e8c050',id+' · '+c[1]+' · £'+p.toFixed(2),dt);dt.appendChild(spark(id,520,70)).style.width='100%';
 const br=el('div','margin-top:4px',null,dt),bq=n=>bt(br,'BUY '+n,1,()=>{OV.msg=buy(id,n)?'BOUGHT '+n+' '+id:'NOT ENOUGH CASH';render()},cash<p*n);[1,10,50].forEach(bq);
 bt(br,'BUY MAX',1,()=>{const n=Math.floor(cash/(p*1.005));OV.msg=n>0&&buy(id,n)?'BOUGHT '+n+' '+id:'NOT ENOUGH CASH';render()},cash<p*1.005);
 const sr=el('div','',null,dt);[1,10].forEach(n=>bt(sr,'SELL '+n,0,()=>{OV.msg=sell(id,n)?'SOLD '+Math.min(n,q)+' '+id:'YOU HOLD NONE';render()},q<1));bt(sr,'SELL ALL ('+q+')',0,()=>{OV.msg=sell(id,q)?'SOLD ALL '+id:'YOU HOLD NONE';render()},q<1)}
boardDraw=boardDraw;
window.STOCKS={ST,CO,buy,sell,tick,open,close,val,EX};
})();
