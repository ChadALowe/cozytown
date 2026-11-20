/* ---- CHARACTER: player built like the villagers + customiser ---- */
var CHR=null,CHM=null,CHS=null;
function chPalTop(){return[[.09,.63,.42]].concat(PTC)}
function chPalBot(){return[[.17,.43,.55]].concat(PBC)}
function chPalHair(){return PHR.concat([[.85,.3,.55],[.25,.45,.85],[.93,.93,.9]])}
const CH_BD=[.92,1,1.1],CH_HT=[.93,1,1.07],CH_TS=['T-SHIRT','LONG SLEEVE','HOODIE','COAT','DRESS'],CH_HS=['SHORT','LONG','BUN','RECEDING','FLAT CAP','BOBBLE HAT','AFRO','PONYTAIL','BUZZ CUT','BOB','MOHAWK','QUIFF','PIGTAILS','CURLY','SLICKED BACK','SPIKY','MESSY CROP','BERET','FEDORA','TOP HAT','CROWN'],CH_HAIR=[0,8,16,1,9,13,2,12,7,3,6,10,11,14,15,4,5];
function chDefault(){return{f:false,bd:1,ht:1,sk:PSK[1].slice(),hr:PHR[1].slice(),hs:0,beard:false,gl:false,ts:1,tc:[.09,.63,.42],bc:[.17,.43,.55],sh:false,sc:PSH[2].slice(),scarf:null,bag:0,bp:false,outI:0,ss:0,bs:0,hc:null,nk:false}}
function chSpec(){return chSpecOf(CHR)}
function chSpecOf(c){return{f:c.f,w:(c.f?.92:1)*CH_BD[c.bd],h:CH_HT[c.ht],sk:c.sk,hr:c.hr,hs:c.hs,beard:!c.f&&c.beard,ts:c.ts,tc:c.tc,bc:c.bc,sc:c.sc,scarf:c.scarf,gl:c.gl,bag:c.bag,bp:c.bp,st:0,sh:c.sh,old:false,ss:c.ss|0,bs:c.bs|0,hc:c.hc,nk:c.nk}}
function chBuild(){if(!CHR)return;if(CHM){man.remove(CHM);CHM.traverse(o=>{if(o.geometry)o.geometry.dispose()})}CHM=mkPerson(chSpec(),mObj,man)}
function chSave(){try{localStorage.setItem('c1look',JSON.stringify(CHR))}catch(e){}}
function chLoad(){CHR=chDefault();try{const d=JSON.parse(localStorage.getItem('c1look')||'null');if(d&&typeof d==='object')for(const k in CHR)if(k in d&&d[k]!==undefined)CHR[k]=d[k]}catch(e){}}
chLoad();
for(const c of man.children){if(c.geometry&&c.geometry.type==='PlaneGeometry'||c===carryBox)continue;c.visible=false}
chBuild();
{const u0=updateMan;updateMan=function(){u0();if(!man.visible||!CHM)return;const sp_=Math.max(Math.abs(legL.rotation.x),Math.abs(legR.rotation.x)),k=Math.min(1,P.speed/3),r=clamp((P.speed-3.8)/2.2,0,1);
 CHM.l2.rotation.x=legL.rotation.x;CHM.l1.rotation.x=legR.rotation.x;CHM.a2.rotation.x=armL.rotation.x*.9;CHM.a1.rotation.x=armR.rotation.x*.9;CHM.up.rotation.y=Math.sin(P.phase)*.09*k;
 man.position.y=P.y-.45*.9*(1-Math.cos(Math.min(1,sp_*.95)))*.5+Math.abs(Math.cos(P.phase))*.03*(1+r)*k}}
/* bought outfits recolour jacket + trousers (only when the outfit actually changes) */
{const OC=[[[.09,.63,.42],[.17,.43,.55]],[[.78,.15,.15],[.17,.43,.55]],[[.15,.3,.75],[.1,.1,.12]],[[.92,.78,.2],[.17,.43,.55]],[[.5,.25,.6],[.5,.43,.3]],[[.92,.5,.15],[.35,.35,.38]]];
 applyOutfit=function(){if(!CHR)return;if(CHR.outI===outfitI)return;CHR.outI=outfitI;const o=OC[outfitI]||OC[0];CHR.tc=o[0].slice();CHR.bc=o[1].slice();chBuild();chSave()}}
/* ---- customiser UI ---- */
function chEq(a,b){return a&&b&&Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2])<.01}
function chOpen(){if(CHS||busy&&!menuOpen)return;if(GS.inside){toast('GO OUTSIDE FIRST');return}
 const wasFoot=GS.onFoot,wasVis=man.visible;let sx,sz;
 if(!GS.onFoot){const lx=Math.cos(GS.psi),lz=-Math.sin(GS.psi);sx=GS.x+lx*2.6;sz=GS.z+lz*2.6;P.x=sx;P.z=sz;P.y=gH(sx,sz);P.psi=GS.psi+Math.PI/2*0+(-Math.PI/2);P.speed=0;man.visible=true}
 else P.speed=0;
 setMenu(false);busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;document.body.classList.add('dz');
 CHS={tab:0,ca:P.psi,rot:0,drag:0,t:0,wasFoot,wasVis,ox:P.x,oz:P.z,raf:0,last:performance.now()};
 const ov=document.createElement('div');ov.id='chov';ov.style.cssText='position:fixed;inset:0;z-index:40;touch-action:none;user-select:none;font:bold 13px ui-monospace,Menlo,monospace;color:#fff';
 const st=document.createElement('style');st.textContent='#chp{position:absolute;background:rgba(10,14,32,.93);border:3px solid #fff;box-shadow:4px 4px 0 #000;display:flex;flex-direction:column;box-sizing:border-box;padding:6px}#chp.pt{left:0;right:0;bottom:0;height:46%;border-width:3px 0 0 0}#chp.ls{right:0;top:0;bottom:0;width:46%;border-width:0 0 0 3px}#chtabs{display:flex;gap:4px;margin-bottom:6px}#chtabs button{flex:1;padding:7px 2px;font:800 12px ui-monospace,monospace;background:#223;color:#9ab;border:2px solid #556;border-radius:6px}#chtabs button.on{background:#1c4fa0;color:#fff;border-color:#fff}#chbody{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch}#chbody .r{margin:0 0 8px}#chbody .l{color:#ffe14a;font-size:11px;letter-spacing:.08em;margin:0 0 3px}#chbody .c{display:flex;flex-wrap:wrap;gap:4px}#chbody .c button{padding:7px 9px;font:800 12px ui-monospace,monospace;background:#223;color:#cde;border:2px solid #556;border-radius:6px}#chbody .c button.on{background:#d9a21a;color:#111;border-color:#fff}#chbody .c i{display:inline-block;width:32px;height:32px;border-radius:16px;border:3px solid #556;box-sizing:border-box}#chbody .c i.on{border-color:#fff;box-shadow:0 0 0 2px #1c4fa0}#chact{display:flex;gap:6px;margin-top:6px}#chact button{flex:1;padding:10px;font:800 14px ui-monospace,monospace;border:3px solid #fff;border-radius:8px;box-shadow:3px 3px 0 #000;color:#fff;background:#1c4fa0}#chact button.g{background:#1f8a3a}#chhint{position:absolute;left:0;right:0;top:12px;text-align:center;font-size:12px;color:#fff;text-shadow:2px 2px 0 #000;pointer-events:none}';ov.appendChild(st);
 const hint=document.createElement('div');hint.id='chhint';hint.textContent='DRAG TO TURN YOUR CHARACTER';ov.appendChild(hint);
 const pn=document.createElement('div');pn.id='chp';ov.appendChild(pn);document.body.appendChild(ov);CHS.ov=ov;CHS.pn=pn;
 const dn=e=>{if(pn.contains(e.target))return;CHS.drag=1;CHS.lx=e.clientX;CHS.dt=0;try{ov.setPointerCapture(e.pointerId)}catch(_){}};
 ov.addEventListener('pointerdown',dn);ov.addEventListener('pointermove',e=>{if(!CHS||!CHS.drag)return;CHS.rot+=(e.clientX-CHS.lx)*.012;CHS.lx=e.clientX;CHS.idle=0});ov.addEventListener('pointerup',()=>{if(CHS)CHS.drag=0});ov.addEventListener('pointercancel',()=>{if(CHS)CHS.drag=0});
 CHS.kd=e=>{if(e.key==='Escape')chClose()};addEventListener('keydown',CHS.kd);
 chLayout();chTabs();
 DZ.fn=chCam;DZ.fov=46;DZ.tp=chCam();DZ.look=new THREE.Vector3(P.x,P.y+1,P.z);DZ.on=1;chCam();
 CHS.last=performance.now();CHS.raf=requestAnimationFrame(chLoop)}
function chLayout(){const pn=CHS.pn,land=innerWidth>innerHeight*1.15,h=document.getElementById('chhint');pn.className=land?'ls':'pt';if(h){h.style.right=land?'46%':'0';h.style.top=land?'10px':'10px'}}
function chCam(){const S=CHS;if(!S)return new THREE.Vector3();const asp=cam.aspect||1.6,land=asp>1.15,d=land?3.5:4.7,fx=Math.sin(S.ca),fz=Math.cos(S.ca),rx=fz,rz=-fx,sh=land?1.15:0,ly=land?.95:.12,cy=land?1.15:1.0;
 DZ.look=new THREE.Vector3(S.ox+rx*sh,P.y+ly,S.oz+rz*sh);return new THREE.Vector3(S.ox+fx*d+rx*sh,P.y+cy,S.oz+fz*d+rz*sh)}
function chLoop(now){const S=CHS;if(!S)return;const dt=Math.min(.05,(now-S.last)/1000);S.last=now;S.t+=dt;if(S.drag)S.idle=0;else{S.idle=(S.idle||0)+dt;if(S.idle>2.5)S.rot+=(Math.sin(S.t*.7)*.5-S.rot)*Math.min(1,dt*.8)}
 P.psi=S.ca+S.rot;P.speed=0;P.x=S.ox;P.z=S.oz;if(S.ov.dataset.w!==innerWidth+'x'+innerHeight){S.ov.dataset.w=innerWidth+'x'+innerHeight;chLayout()}S.raf=requestAnimationFrame(chLoop)}
function chClose(){const S=CHS;if(!S)return;cancelAnimationFrame(S.raf);removeEventListener('keydown',S.kd);S.ov.remove();chSave();DZ.fn=null;DZ.fov=46;DZ.on=0;DZ.exit=1;document.body.classList.remove('dz');busy=0;
 if(!S.wasFoot)man.visible=S.wasVis;else{P.psi=S.ca}CHS=null;toast('LOOK SAVED');beep(660,.1,'square',.06)}
function chTabs(){const S=CHS,tb=['BODY','HAIR','CLOTHES','EXTRAS'];S.pn.innerHTML='<div id="chtabs">'+tb.map((t,i)=>'<button data-t="'+i+'" class="'+(S.tab===i?'on':'')+'">'+t+'</button>').join('')+'</div><div id="chbody"></div><div id="chact"><button data-a="rnd">RANDOM</button><button data-a="done" class="g">DONE</button></div>';
 for(const b of S.pn.querySelectorAll('#chtabs button'))b.onclick=()=>{S.tab=+b.dataset.t;chTabs()};
 S.pn.querySelector('[data-a=rnd]').onclick=chRandom;S.pn.querySelector('[data-a=done]').onclick=chClose;chBody()}
function chBody(){const S=CHS,c=CHR,el=S.pn.querySelector('#chbody');el.innerHTML='';
 const row=(label)=>{const r=document.createElement('div');r.className='r';r.innerHTML='<div class="l">'+label+'</div><div class="c"></div>';el.appendChild(r);return r.lastChild};
 const chips=(label,names,cur,set)=>{const w=row(label);names.forEach((n,i)=>{const b=document.createElement('button');b.textContent=n;if(cur===i)b.className='on';b.onclick=()=>{set(i);chBuild();chBody();beep(520+i*40,.05,'square',.04)};w.appendChild(b)})};
 const sw=(label,pal,cur,set,none)=>{const w=row(label);if(none){const b=document.createElement('button');b.textContent='NONE';if(cur==null)b.className='on';b.onclick=()=>{set(null);chBuild();chBody()};w.appendChild(b)}pal.forEach(p=>{const i=document.createElement('i');i.style.background='rgb('+p.map(v=>Math.round(v*255)).join(',')+')';if(chEq(cur,p))i.className='on';i.onclick=()=>{set(p.slice());chBuild();chBody();beep(700,.04,'square',.04)};w.appendChild(i)})};
 if(S.tab===0){chips('FIGURE',['MASCULINE','FEMININE'],c.f?1:0,i=>c.f=!!i);chips('BUILD',['SLIM','AVERAGE','BROAD'],c.bd,i=>c.bd=i);chips('HEIGHT',['SHORT','MEDIUM','TALL'],c.ht,i=>c.ht=i);sw('SKIN TONE',PSK,c.sk,p=>c.sk=p)}
 else if(S.tab===1){chips('HAIR STYLE',CH_HAIR.map(i=>CH_HS[i]),CH_HAIR.indexOf(c.hs),i=>{c.hs=CH_HAIR[i];if(c.hs===4||c.hs===5)c.hc=null});sw('HAIR COLOUR',chPalHair(),c.hr,p=>c.hr=p);chips('FACIAL HAIR',['NONE','BEARD'],c.beard?1:0,i=>c.beard=!!i);chips('GLASSES',['NONE','GLASSES'],c.gl?1:0,i=>c.gl=!!i)}
 else{chWard(S,el)}}
function chRandom(){const c=CHR,pk=a=>a[Math.floor(Math.random()*a.length)];c.f=Math.random()<.5;c.bd=Math.floor(Math.random()*3);c.ht=Math.floor(Math.random()*3);c.sk=pk(PSK).slice();c.hs=[0,1,2,3,6,7,8,9,10,11,12,13,14,15,16][Math.floor(Math.random()*15)];c.hr=pk(chPalHair()).slice();c.beard=!c.f&&Math.random()<.3;c.gl=Math.random()<.25;chBuild();chBody();beep(880,.08,'square',.05)}
{const d=document.createElement('div');d.className='mb';d.innerHTML='<button id="chB" class="sec">CHARACTER</button>';const o=document.getElementById('optB');o.parentNode.parentNode.insertBefore(d,o.parentNode);document.getElementById('chB').onclick=chOpen}
/* ---- THREADS: clothes shop (browse racks, try on, buy) ---- */
Object.assign(HRS,{"PENNY'S BARGAINS":[8,19],'HARRINGTON & CO':[9.5,18],"MAISON D'OR":[10,17.5]});
const CFSH={"PENNY'S BARGAINS":'BUDGET','HARRINGTON & CO':'HIGH END',"MAISON D'OR":'ULTRA'};
TH["PENNY'S BARGAINS"]={wall:0xf4e8b0,fl:'tile',cnt:0xc01818,top:0xf8d010,sh:0xc01818};
TH['HARRINGTON & CO']={wall:0x3a5646,fl:'wood',cnt:0x2a1a10,top:0x4a3020,sh:0x0f3324};
TH["MAISON D'OR"]={wall:0x1e1c24,fl:'tile2',cnt:0x101014,top:0xd4af37,sh:0x0a0a10};
var CLOWN={};try{CLOWN=JSON.parse(localStorage.getItem('c1clo')||'{}')||{}}catch(e){}
function cloSave(){try{localStorage.setItem('c1clo',JSON.stringify(CLOWN))}catch(e){}}
const CLOCAT=['TOPS','BOTTOMS','SHOES','ACCESSORIES'];
var CLOIT=null;
function cloItems(){if(CLOIT)return CLOIT;const cn=['RED','BLUE','YELLOW','GREEN','WHITE','PURPLE','ORANGE','TEAL','SLATE','PINK','TAN','BLACK'],TSN=['T-SHIRT','LONG SLEEVE TEE','HOODIE','COAT','SUMMER DRESS'],TSP=[12,18,30,60,45];
 const tops=[{id:'top:s',n:'STARTER JACKET (GREEN)',p:0,ap:c=>{c.ts=1;c.tc=[.09,.63,.42]},has:c=>c.ts===1&&chEq(c.tc,[.09,.63,.42])}];
 for(let ts=0;ts<5;ts++)for(let j=0;j<4;j++){const ci=(ts*3+j)%12,col=PTC[ci];tops.push({id:'top:'+ts+':'+ci,n:cn[ci]+' '+TSN[ts],p:TSP[ts],ap:c=>{c.ts=ts;c.tc=col.slice()},has:c=>c.ts===ts&&chEq(c.tc,col)})}
 const BN=['BLUE JEANS','BLACK JEANS','CHINOS','GREY TROUSERS','DARK DENIM','BROWN CORDS','OLIVE CARGOS'],BP=[20,22,25,25,28,30,32],bots=[{id:'bot:s',n:'STARTER JEANS',p:0,ap:c=>{c.bc=[.17,.43,.55];c.sh=false;c.bs=0},has:c=>!c.sh&&!c.bs&&chEq(c.bc,[.17,.43,.55])}];
 BN.forEach((n,i)=>{const col=PBC[i];bots.push({id:'bot:'+i,n,p:BP[i],ap:c=>{c.bc=col.slice();c.sh=false;c.bs=0},has:c=>!c.sh&&!c.bs&&chEq(c.bc,col)})});
 [['DENIM SHORTS',0,14],['CHINO SHORTS',2,16],['BLACK SHORTS',1,16]].forEach(([n,i,p])=>{const col=PBC[i];bots.push({id:'sht:'+i,n,p,ap:c=>{c.bc=col.slice();c.sh=true;c.bs=0},has:c=>c.sh&&chEq(c.bc,col)})});
 const SH=[['BLACK BOOTS',[.12,.1,.1],32],['BROWN BOOTS',[.4,.25,.15],34],['WHITE TRAINERS',[.85,.85,.85],25],['RED TRAINERS',[.5,.12,.12],28],['YELLOW TRAINERS',[.9,.9,.2],28],['BLUE TRAINERS',[.2,.5,.9],28],['PINK TRAINERS',[.95,.6,.7],28],['GREEN TRAINERS',[.2,.7,.35],28]],shoes=[{id:'sho:s',n:'STARTER TRAINERS',p:0,ap:c=>{c.sc=PSH[2].slice();c.ss=0},has:c=>!c.ss&&chEq(c.sc,PSH[2])}];
 SH.forEach(([n,col,p],i)=>shoes.push({id:'sho:'+i,n,p,ap:c=>{c.sc=col.slice();c.ss=0},has:c=>!c.ss&&chEq(c.sc,col)}));
 const acc=[{id:'acc:gl',n:'READING GLASSES',p:15,ap:c=>{c.gl=1},rm:c=>{c.gl=false},has:c=>c.gl===1||c.gl===true},{id:'acc:cap',n:'FLAT CAP',p:18,ap:c=>{c.hs=4;c.hc=null},rm:c=>{c.hs=0},has:c=>c.hs===4},{id:'acc:bob',n:'BOBBLE HAT',p:14,ap:c=>{c.hs=5;c.hc=null},rm:c=>{c.hs=0},has:c=>c.hs===5}];
 [0,1,3,5,9,11].forEach(ci=>{const col=PTC[ci];acc.push({id:'acc:sc'+ci,n:cn[ci]+' SCARF',p:14,ap:c=>{c.scarf=col.slice()},rm:c=>{c.scarf=null},has:c=>chEq(c.scarf,col)})});
 acc.push({id:'acc:bp',n:'BACKPACK',p:35,ap:c=>{c.bp=true},rm:c=>{c.bp=false},has:c=>!!c.bp},{id:'acc:bag',n:'SHOULDER BAG',p:30,ap:c=>{c.bag=1},rm:c=>{c.bag=0},has:c=>!!c.bag});
 /* ---- HIGH END and ULTRA ranges ---- */
 {const E=(arr,t,id,n,p,ap,has,rm)=>{const o={id,n,p,t,ap,has};if(rm)o.rm=rm;arr.push(o)};
  const HE='HIGH END',UL='ULTRA',nm=(n,c)=>c+' '+n;
  const topSet=(ts,list,t,p,label)=>list.forEach(([cn_,col])=>E(tops,t,'top:'+ts+':'+cn_,nm(label,cn_),p,c=>{c.ts=ts;c.tc=col.slice()},c=>c.ts===ts&&chEq(c.tc,col)));
  topSet(5,[['NAVY',[.1,.15,.35]],['CHARCOAL',[.2,.2,.23]],['BURGUNDY',[.4,.08,.14]],['CAMEL',[.7,.5,.3]]],HE,140,'BLAZER');
  topSet(6,[['BLACK',[.08,.08,.1]],['BROWN',[.35,.2,.1]],['OXBLOOD',[.35,.08,.08]]],HE,180,'LEATHER JACKET');
  topSet(9,[['CREAM',[.9,.86,.75]],['BLACK',[.1,.1,.12]],['FOREST',[.1,.3,.18]],['RUST',[.65,.3,.12]]],HE,95,'ROLL-NECK JUMPER');
  topSet(7,[['BLACK',[.04,.04,.06]],['IVORY',[.93,.9,.8]],['MIDNIGHT',[.06,.08,.22]]],UL,650,'TUXEDO');
  topSet(8,[['WHITE',[.9,.9,.92]],['MINK',[.4,.27,.18]],['BLACK',[.08,.08,.09]]],UL,1250,'FUR COAT');
  topSet(5,[['GOLD',[.85,.68,.2]]],UL,820,'LAME BLAZER');
  const botSet=(bs,list,t,p,label)=>list.forEach(([cn_,col])=>E(bots,t,'bot:'+bs+cn_,nm(label,cn_),p,c=>{c.bc=col.slice();c.sh=false;c.bs=bs},c=>!c.sh&&c.bs===bs&&chEq(c.bc,col)));
  botSet(1,[['CHARCOAL',[.2,.2,.23]],['NAVY',[.1,.14,.3]],['CAMEL',[.65,.5,.32]],['BLACK',[.08,.08,.1]]],HE,85,'TAILORED TROUSERS');
  botSet(3,[['BLACK',[.07,.07,.09]],['BROWN',[.3,.18,.1]]],HE,150,'LEATHER TROUSERS');
  botSet(2,[['BLACK',[.05,.05,.07]]],UL,350,'TUXEDO TROUSERS');
  botSet(4,[['WHITE',[.9,.9,.88]],['BLACK',[.07,.07,.09]]],UL,520,'GOLD-STRIPE TROUSERS');
  const shSet=(ss,list,t,p,label)=>list.forEach(([cn_,col])=>E(shoes,t,'sho:'+ss+cn_,nm(label,cn_),p,c=>{c.sc=col.slice();c.ss=ss},c=>c.ss===ss&&chEq(c.sc,col)));
  shSet(1,[['BROWN',[.4,.24,.12]],['BLACK',[.1,.09,.09]],['TAN',[.7,.5,.3]]],HE,120,'LEATHER BOOTS');
  shSet(2,[['BLACK',[.07,.07,.08]],['BROWN',[.35,.2,.1]],['OXBLOOD',[.34,.08,.1]]],HE,110,'OXFORD SHOES');
  shSet(3,[['WHITE',[.93,.93,.93]],['BLACK',[.1,.1,.12]],['RED',[.75,.12,.15]]],UL,380,'DESIGNER SNEAKERS');
  shSet(4,[['GOLD',[.92,.75,.2]],['SILVER',[.8,.82,.86]]],UL,900,'LUXURY LOAFERS');
  shSet(1,[['EMERALD',[.05,.45,.28]]],UL,650,'CROCODILE BOOTS');
  const hat=(id,n,p,t,hs,col)=>E(acc,t,id,n,p,c=>{c.hs=hs;c.hc=col?col.slice():null},c=>c.hs===hs,c=>{c.hs=0;c.hc=null});
  E(acc,HE,'acc:sun','SUNGLASSES',60,c=>{c.gl=2},c=>c.gl===2,c=>{c.gl=false});
  hat('acc:ber','BERET',45,HE,17,[.15,.2,.45]);hat('acc:fed','FEDORA',85,HE,18,[.4,.33,.25]);
  E(acc,UL,'acc:avi','GOLD AVIATORS',320,c=>{c.gl=3},c=>c.gl===3,c=>{c.gl=false});
  E(acc,UL,'acc:chn','GOLD CHAIN',480,c=>{c.nk=true},c=>!!c.nk,c=>{c.nk=false});
  hat('acc:top','TOP HAT',350,UL,19);hat('acc:crn','GOLD CROWN',2500,UL,20)}
 for(const cat of[tops,bots,shoes,acc])for(const it of cat)if(!it.t)it.t='BUDGET';
 return CLOIT=[tops,bots,shoes,acc]}
function cloOwn(it){return !it.p||!!CLOWN[it.id]}
function cloWear(it){it.ap(CHR);chBuild();chSave()}
/* customiser wardrobe: owned items only */
function chWard(S,el){const IT=cloItems(),cats=S.tab===2?[0,1,2]:[3];
 for(const ci of cats){const r=document.createElement('div');r.className='r';r.innerHTML='<div class="l">'+CLOCAT[ci]+'</div><div class="c"></div>';el.appendChild(r);const w=r.lastChild;
  if(ci===3){for(const [n,f] of [['NO HAT',c=>{if(c.hs===4||c.hs===5)c.hs=0}],['NO GLASSES',c=>c.gl=false],['NO SCARF',c=>c.scarf=null],['NO BAG',c=>{c.bag=0;c.bp=false}]]){const b=document.createElement('button');b.textContent=n;b.onclick=()=>{f(CHR);chBuild();chBody()};w.appendChild(b)}}
  for(const it of IT[ci]){if(!cloOwn(it))continue;const b=document.createElement('button');b.textContent=it.n;if(it.has(CHR))b.className='on';b.onclick=()=>{if(it.has(CHR)&&it.rm)it.rm(CHR);else it.ap(CHR);chBuild();chBody();beep(600,.05,'square',.04)};w.appendChild(b)}}
 const h=document.createElement('div');h.className='l';h.style.marginTop='6px';h.textContent='MORE CLOTHES: PENNY\'S BARGAINS, HARRINGTON & CO, MAISON D\'OR';el.appendChild(h)}
/* ---- shop interior ---- */
const THX=[-5.2,-1.7,1.8,5.3];
function thPose(){const o=SG;return o}
function buildThreads(o){const tier=CFSH[o.t]||'BUDGET',TM={BUDGET:{rail:0xb4b4bc,bar:0xc8c8d0,shelf:0xc8a070,sbg:'#c01818',sfg:'#fff2a0',hd:'#f8d010',hf:'#c01010',tag:'BARGAINS  ·  EVERYTHING UNDER £60',cn:0xc01818},'HIGH END':{rail:0xc8a040,bar:0xd8b050,shelf:0x4a3020,sbg:'#0f3324',sfg:'#e8c860',hd:'#0f3324',hf:'#e8c860',tag:'HARRINGTON & CO  ·  TAILORING & FINE KNIT',cn:0x2a1a10},ULTRA:{rail:0xd4af37,bar:0xf0cc50,shelf:0x16161c,sbg:'#0a0a10',sfg:'#f2c84a',hd:'#0a0a10',hf:'#f2c84a',tag:"MAISON D'OR  ·  COUTURE  ·  BY APPOINTMENT",cn:0x101014}}[tier];IA.splice(0,IA.length,LEAVE_IA());IROOM.splice(0,IROOM.length,[-8,8,-4.2,-2.35]);
 const rail=(x)=>{gbox(SG,x-1.28,0,-2.85,.05,1.65,.05,TM.rail);gbox(SG,x+1.28,0,-2.85,.05,1.65,.05,TM.rail);gbox(SG,x-1.28,1.62,-2.85,2.56,.04,.04,TM.bar)};
 sPlane(5.6,.34,0,2.3,-RZ+.03,0,txtTex(512,40,TM.hd,TM.hf,TM.tag,tier==='BUDGET'?22:19));
 THX.forEach((x,si)=>{
  sPlane(1.7,.3,x,1.9,-RZ+.03,0,txtTex(256,48,TM.sbg,TM.sfg,CLOCAT[si],30));
  if(si===0){rail(x);for(let i=0;i<8;i++){const xi=x-1.05+i*.3,c=PTC[(i*3+si)%12];gbox(SG,xi,1.55,-2.85,.02,.06,.02,0xaaaaaa);gbox(SG,xi,1.0,-2.85,.24,.52,.07,fmcRGB(c));gbox(SG,xi-.15,1.2,-2.85,.07,.3,.07,fmcRGB(c));gbox(SG,xi+.15,1.2,-2.85,.07,.3,.07,fmcRGB(c))}}
  else if(si===1){rail(x);for(let i=0;i<8;i++){const xi=x-1.05+i*.3,c=PBC[i%7],sh=i>5;gbox(SG,xi,1.55,-2.85,.02,.06,.02,0xaaaaaa);gbox(SG,xi,sh?.95:.7,-2.85,.2,sh?.5:.85,.07,fmcRGB(c))}}
  else if(si===2){for(let s=0;s<3;s++){gbox(SG,x,.3+s*.6,-3.0,2.6,.04,.36,TM.shelf);for(let j=0;j<7;j++){const c=[[.12,.1,.1],[.4,.25,.15],[.85,.85,.85],[.5,.12,.12],[.9,.9,.2],[.2,.5,.9],[.95,.6,.7]][(j+s*2)%7];gbox(SG,x-1.1+j*.36,.34+s*.6,-3.0,.14,.1,.27,fmcRGB(c))}}gbox(SG,x-1.3,0,-3.1,.04,1.9,.3,TM.shelf);gbox(SG,x+1.3,0,-3.1,.04,1.9,.3,TM.shelf)}
  else{gbox(SG,x,0,-2.75,2.2,.9,.7,TM.cn);gbox(SG,x,.9,-2.75,2.3,.05,.8,tier==='ULTRA'?0xd4af37:0xe0d8e8);for(let j=0;j<4;j++)gbox(SG,x-.8+j*.5,.95,-2.7,.28,.05,.1,0x18181c);rail(x);for(let j=0;j<6;j++){const c=PTC[[0,1,3,5,9,11][j]];gbox(SG,x-1.0+j*.4,1.2,-2.85,.12,.4,.05,fmcRGB(c))}gbox(SG,x-.95,1.0,-2.7,.3,.35,.12,0x8a5a2a);gbox(SG,x+.95,1.0,-2.7,.28,.38,.14,0x3a4a6a)}
  IROOM.push([x-1.4,x+1.4,-4.2,-2.0]);IA.push({r:[x-1.4,x+1.4,-2.0,.7],label:'BROWSE '+CLOCAT[si],fn:()=>thBrowse(si,tier)})});
 gbox(SG,-6.1,0,2.0,.7,.95,2.0,TM.cn);gbox(SG,-6.1,.95,2.0,.8,.05,2.1,tier==='ULTRA'?0xd4af37:0xe0d8e8);gbox(SG,-6.1,1.0,1.6,.3,.25,.25,0x20242c);
 window.SHK=personIn(pSpec(9411,{f:true,gl:true,scarf:null,bp:false,bag:0,old:false,tc:[.55,.25,.5],hs:2}),-6.9,2.0,Math.PI/2);
 IROOM.push([-6.5,-5.7,.95,3.1]);IA.push({r:[-5.7,-4.6,1.2,2.9],label:'TALK TO '+(tier==='BUDGET'?'PENNY':tier==='ULTRA'?'ADRIEN':'KAREN'),fn:()=>say(tier==='BUDGET'?'PENNY':tier==='ULTRA'?'ADRIEN':'KAREN',{BUDGET:'Everything is a bargain! Grab a basket.',"HIGH END":'May I help you find the right fit, sir or madam?',ULTRA:'Welcome to Maison d\'Or. Champagne is on its way.'}[tier],3400)});
 const mq=(x,z,ry,tc,bc)=>{personIn(pSpec(9500+x,{sk:[.8,.78,.74],hr:[.75,.72,.7],hs:0,beard:false,gl:false,scarf:null,bp:false,bag:0,old:false,f:z>1,ts:z>1?4:2,tc,bc,sc:[.5,.5,.52]}),x,z,ry);IROOM.push([x-.3,x+.3,z-.3,z+.3])};mq(4.2,.9,Math.PI,[.2,.5,.55],[.14,.18,.3]);mq(-3.4,1.2,0,[.8,.3,.35],[.5,.43,.3]);
 gbox(SG,RX-.12,0,-1.0,.06,2.1,1.3,0xe8e8f0);{const m=new THREE.Mesh(new THREE.PlaneGeometry(1.15,1.95),new THREE.MeshBasicMaterial({color:0xaac8dc}));m.position.set(RX-.16,1.02,-1.0);m.rotation.y=-Math.PI/2;SG.add(m)}

 if(tier==='BUDGET'){for(let i=0;i<9;i++)gbox(SG,-6.6+i*1.65,3.15,-RZ+.08,.9,.3,.02,i%2?0xd01818:0xf8e020);
  for(const[bx,bz]of[[-1.4,2.4],[3.5,2.2]]){gbox(SG,bx,0,bz,1.4,.55,.9,0xc8a070);for(let j=0;j<7;j++)gbox(SG,bx-.55+j*.18,.55,bz+(j%2?.1:-.1),.16,.12,.34,fmcRGB(PTC[(j*2+bx*3|0)%12&11]||[.8,.2,.2]));IROOM.push([bx-.75,bx+.75,bz-.5,bz+.5])}
  sPlane(2.2,.6,5.9,3.05,-RZ+.03,0,txtTex(256,72,'#d01010','#ffffff','SALE!  50% OFF',34));sPlane(2.2,.6,-5.9,3.05,-RZ+.03,0,txtTex(256,72,'#f8e020','#101010','BUY 2 GET 1 FREE',24))}
 else if(tier==='HIGH END'){gbox(SG,0,0,.6,5.6,.02,3.6,0x1c2c4a);gbox(SG,0,.02,.6,5.2,.01,3.2,0x28406a);
  for(const px of[-7,7]){gbox(SG,px,0,-3.2,.5,.5,.5,0x2a2a30);gbox(SG,px,.5,-3.2,.08,.8,.08,0x5a3a1a);gbox(SG,px,1.0,-3.2,.7,.7,.7,0x1a5a2a)}
  for(let i=0;i<3;i++){gbox(SG,-1+i*1.0,2.3,-RZ+.06,.7,.5,.03,0x6a4a20);gbox(SG,-1+i*1.0,2.34,-RZ+.07,.6,.42,.02,[0x8a6a50,0x405a70,0x706040][i])}}
 else{gbox(SG,0,0,.6,5.2,.02,5.2,0x8a0c1c);gbox(SG,0,.025,.6,4.8,.01,4.8,0xa80f22);
  for(const px of[-7,-3.5,0,3.5,7]){gbox(SG,px,0,-RZ+.35,.55,3.3,.5,0x2a2830);gbox(SG,px,.0,-RZ+.35,.65,.14,.6,0xd4af37);gbox(SG,px,3.2,-RZ+.35,.65,.1,.6,0xd4af37)}
  for(let i=0;i<7;i++){const a=i/7*6.283;gbox(SG,Math.cos(a)*.55,2.9+(i%2)*.08,.6+Math.sin(a)*.55,.12,.4,.12,0xffe9a0)}gbox(SG,0,3.35,.6,.1,.5,.1,0xd4af37);gbox(SG,0,3.0,.6,.28,.28,.28,0xfff0b0);
  for(const px of[-4.5,4.5]){gbox(SG,px,0,1.6,.5,1.0,.5,0xf4f0e8);gbox(SG,px,1.0,1.6,.6,.06,.6,0xd4af37)}}
}
function fmcRGB(c){return(Math.round(c[0]*255)<<16)|(Math.round(c[1]*255)<<8)|Math.round(c[2]*255)}
for(const n of Object.keys(CFSH))CUSTB[n]={rx:7.4,fn:buildThreads};
/* ---- browse / try on ---- */
var BRW=null;
function thIT(B){const L=cloItems()[B.si];return B.tier?L.filter(it=>it.t===B.tier):L}
function thBrowse(si,tier){if(BRW||!SHOPCUR)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;document.body.classList.add('dz');P.speed=0;const mv0=man.visible;man.visible=false;
 const IT=cloItems()[si].filter(it=>!tier||it.t===tier);let cur=IT.findIndex(it=>it.has(CHR));if(cur<0)cur=0;
 BRW={mv:mv0,si,tier,i:cur,x:THX[si],rot:0,drag:0,t:0,idle:0,dbl:null,last:performance.now(),raf:0};
 const ov=document.createElement('div');ov.id='brov';ov.style.cssText='position:fixed;inset:0;z-index:60;touch-action:none;user-select:none;font:bold 13px ui-monospace,Menlo,monospace;color:#fff';
 ov.innerHTML='<style>#brov button{font:800 14px ui-monospace,monospace;border:3px solid #fff;border-radius:8px;box-shadow:3px 3px 0 #000;color:#fff;background:#1c4fa0;padding:10px 14px}#brov .ar{position:absolute;top:38%;width:54px;height:72px;font-size:26px;padding:0;background:rgba(20,26,60,.8)}#brp{position:absolute;left:0;right:0;bottom:0;background:rgba(10,14,32,.92);border-top:3px solid #fff;padding:8px 10px;text-align:center;padding-bottom:max(8px,env(safe-area-inset-bottom))}#brtr{display:flex;gap:6px;justify-content:center;margin-bottom:6px}#brtr button{padding:5px 9px;font-size:11px;box-shadow:2px 2px 0 #000;background:#223}#brn{font-size:17px;color:#ffe14a;letter-spacing:.06em}#brs{font-size:13px;margin:3px 0 8px;color:#cde}#brr{display:flex;gap:8px;justify-content:center}#brr button{flex:1;max-width:220px}#brt{position:absolute;left:0;right:0;top:10px;text-align:center;font-size:13px;text-shadow:2px 2px 0 #000;pointer-events:none}</style><div id="brt"></div><button class="ar" id="brL" style="left:8px">◀</button><button class="ar" id="brR" style="right:8px">▶</button><div id="brp"><div id="brtr"></div><div id="brn"></div><div id="brs"></div><div id="brr"><button id="brA" style="background:#1f8a3a">BUY</button><button id="brB" style="background:#7a2a2a">BACK</button></div></div>';
 document.body.appendChild(ov);BRW.ov=ov;
 {const tr=ov.querySelector('#brtr');['BUDGET','HIGH END','ULTRA'].forEach(t=>{const b=document.createElement('button');b.textContent=t;b.dataset.t=t;b.onclick=()=>{const IT=thIT(BRW),k=IT.findIndex(it=>it.t===t);if(k>=0){BRW.i=k;thShow();beep(620,.05,'square',.04)}};tr.appendChild(b)})}
 ov.addEventListener('pointerdown',e=>{if(e.target.closest('#brp')||e.target.closest('.ar'))return;BRW.drag=1;BRW.lx=e.clientX;BRW.sx=e.clientX;try{ov.setPointerCapture(e.pointerId)}catch(_){}});
 ov.addEventListener('pointermove',e=>{if(!BRW||!BRW.drag)return;BRW.rot+=(e.clientX-BRW.lx)*.012;BRW.lx=e.clientX;BRW.idle=0});
 const up=e=>{if(!BRW||!BRW.drag)return;BRW.drag=0;const dx=e.clientX-BRW.sx;if(Math.abs(dx)>110){thFlick(dx<0?1:-1)}};ov.addEventListener('pointerup',up);ov.addEventListener('pointercancel',()=>{if(BRW)BRW.drag=0});
 document.getElementById('brL').onclick=()=>thFlick(-1);document.getElementById('brR').onclick=()=>thFlick(1);document.getElementById('brB').onclick=thEnd;document.getElementById('brA').onclick=thAct;
 BRW.kd=e=>{if(e.key==='Escape')thEnd();else if(e.key==='ArrowLeft')thFlick(-1);else if(e.key==='ArrowRight')thFlick(1);else if(e.key==='Enter')thAct()};addEventListener('keydown',BRW.kd);
 thShow();DZ.fn=thCam;DZ.fov=46;DZ.tp=thCam();DZ.look=new THREE.Vector3();DZ.on=1;thCam();BRW.last=performance.now();BRW.raf=requestAnimationFrame(thLoop)}
function thCam(){const B=BRW;if(!B)return new THREE.Vector3();const asp=cam.aspect||1.6,land=asp>1.15;DZ.look=SG.localToWorld(new THREE.Vector3(B.x,land?.82:.5,-1.1));return SG.localToWorld(new THREE.Vector3(B.x,land?1.2:1.15,land?2.5:3.0))}
function thShow(){const B=BRW,IT=thIT(B),it=IT[B.i],c=JSON.parse(JSON.stringify(CHR));
 if(!(it.has(CHR)&&it.rm))it.ap(c);
 if(B.dbl){SG.remove(B.dbl);B.dbl.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
 B.dbl=personIn(chSpecOf(c),B.x,-1.1,0);
 const own=cloOwn(it),worn=it.has(CHR);
 document.getElementById('brt').textContent=CLOCAT[B.si]+'  ·  '+it.t+'  ·  '+(B.i+1)+'/'+IT.length;{const TC={'BUDGET':'#9fd89f','HIGH END':'#6ab4ff','ULTRA':'#ffd24a'},tn=document.getElementById('brn');tn.textContent=it.n;tn.style.color=TC[it.t]||'#ffe14a';for(const b of document.querySelectorAll('#brtr button')){const on=b.dataset.t===it.t;b.style.background=on?TC[b.dataset.t]:'#223';b.style.color=on?'#111':'#fff';b.style.display=!B.tier&&IT.some(x=>x.t===b.dataset.t)?'':'none'}}
 document.getElementById('brs').textContent=worn?'WEARING':own?'OWNED':'£'+it.p+'   (YOU HAVE £'+cash+')';
 const a=document.getElementById('brA');a.textContent=worn?(it.rm?'TAKE OFF':'WEARING'):own?'WEAR':'BUY £'+it.p;a.style.opacity=worn&&!it.rm?.5:1}
function thFlick(d){const B=BRW;if(!B)return;const n=thIT(B).length;B.i=(B.i+d+n)%n;thShow();beep(520+B.i*15,.05,'square',.04)}
function thAct(){const B=BRW;if(!B)return;const it=thIT(B)[B.i];
 if(it.has(CHR)){if(it.rm){it.rm(CHR);chBuild();chSave();toast('TAKEN OFF');thShow()}return}
 if(!cloOwn(it)){if(cash<it.p){toast('NOT ENOUGH CASH');beep(120,.2,'sawtooth',.08);return}cash-=it.p;CLOWN[it.id]=1;cloSave();toast('BOUGHT '+it.n+' -£'+it.p);beep(880,.1,'square',.06);setTimeout(()=>beep(1320,.14,'square',.06),90)}else{beep(700,.06,'square',.05)}
 cloWear(it);thShow()}
function thLoop(now){const B=BRW;if(!B)return;const dt=Math.min(.05,(now-B.last)/1000);B.last=now;B.t+=dt;if(B.drag)B.idle=0;else{B.idle+=dt;if(B.idle>2)B.rot+=(Math.sin(B.t*.8)*.45-B.rot)*Math.min(1,dt*.8)}if(B.dbl)B.dbl.rotation.y=B.rot;B.raf=requestAnimationFrame(thLoop)}
function thEnd(){const B=BRW;if(!B)return;cancelAnimationFrame(B.raf);removeEventListener('keydown',B.kd);B.ov.remove();if(B.dbl){SG.remove(B.dbl);B.dbl.traverse(o=>{if(o.geometry)o.geometry.dispose()})}DZ.fn=null;DZ.fov=46;DZ.on=0;DZ.exit=1;document.body.classList.remove('dz');man.visible=B.mv!==false;busy=0;BRW=null}
