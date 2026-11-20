/* ---- BUSINESSES: buy the café, the pub, Penny's and more. Set prices, hire staff, refurbish, collect the takings.
   Each new day the business trades: customers depend on price, staff, refurb level and reputation; profit lands in the till.
   Manage from the OFFICE desk inside the shop or from the BUSINESS app on the phone. ---- */
const BZD={
 'CAFE':{p:6000,c:80,s:4.5,cost:.35,ic:'☕'},
 'THE ROYAL OAK':{p:15000,c:120,s:8,cost:.4,ic:'🍺'},
 "PENNY'S BARGAINS":{p:9000,c:60,s:14,cost:.5,ic:'🏷'},
 'BAKERY':{p:5000,c:90,s:3.5,cost:.35,ic:'🥖'},
 "FRANKIE'S FISH & CHIPS":{p:8000,c:85,s:7,cost:.4,ic:'🍟'},
 "LUIGI'S PIZZA":{p:9000,c:70,s:10,cost:.4,ic:'🍕'},
 'DELI':{p:6500,c:50,s:8,cost:.45,ic:'🧀'},
 'FLORIST':{p:4000,c:30,s:12,cost:.4,ic:'🌸'},
 'BOOKSHOP':{p:4500,c:35,s:11,cost:.5,ic:'📚'},
 'HARRINGTON & CO':{p:30000,c:22,s:95,cost:.55,ic:'🧥'},
 "MAISON D'OR":{p:80000,c:8,s:520,cost:.55,ic:'👑'},
 "RANI'S SILK HOUSE":{p:20000,c:20,s:70,cost:.5,ic:'🥻'},
 'STRIKE BOWL':{p:25000,c:90,s:12,cost:.3,ic:'🎳'},
 'NEON ARCADE':{p:18000,c:110,s:6,cost:.25,ic:'🕹'}};
const BZPRICE=[['BARGAIN',.75,1.35],['FAIR',1,1],['PRICEY',1.25,.78],['PREMIUM',1.6,.55]];/* name, price mult, customer mult */
const BZSTAFF=['JUST YOU (NOBODY)','1 ASSISTANT','2 STAFF','3 STAFF + MANAGER'],BZWAGE=[0,55,105,170],BZCAP=[.55,.8,1,1.15];
const BZREF=[['ORIGINAL',0],['SPRUCED UP',.25],['REFURBISHED',.4],['FLAGSHIP',.6]];/* name, cost as share of price */
const BZNAMES=['ELLIE','JAMAL','PRIYA','TOM','GRACE','OWEN','AISHA','BEN','CHLOE','RAVI'];
const BIZ={own:{}}; /* own[name]={pr,st,rf,rep,till,days,last,life} */
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.bz=BIZ;return o};cozyLoad=function(z){l0(z);if(z&&z.bz)BIZ.own=z.bz.own||{}}}
const bzMoney=v=>'£'+Math.round(v).toLocaleString('en-GB');
function bzBuy(n){const d=BZD[n];if(BIZ.own[n])return 'YOU ALREADY OWN IT';if(cash<d.p)return 'NOT ENOUGH CASH (NEED '+bzMoney(d.p)+')';cash-=d.p;BIZ.own[n]={pr:1,st:1,rf:0,rep:50,till:0,days:0,last:null,life:0,mgr:BZNAMES[Math.floor(Math.random()*BZNAMES.length)]};
 toast('YOU NOW OWN '+n+'!');for(let i=0;i<4;i++)setTimeout(()=>beep(620+i*150,.1,'square',.05),i*110);phText(n,"Congratulations, boss! The keys are yours. I'll keep things running - check the BUSINESS app on your phone.");bzDress();return ''}
function bzSell(n){const b=BIZ.own[n];if(!b)return;const v=bzValue(n);cash+=v+b.till;delete BIZ.own[n];toast('SOLD '+n+' FOR '+bzMoney(v));bzDress()}
function bzValue(n){const b=BIZ.own[n],d=BZD[n];return Math.round(d.p*(.8+BZREF[b.rf][1]*.9+(b.rep-50)/400))}
/* one day of trading */
function bzTrade(n){const b=BIZ.own[n],d=BZD[n],P=BZPRICE[b.pr],ref=1+b.rf*.18,rep=.6+b.rep/125,dow_=(typeof dow==='function'?dow():0),wk=dow_>=5?1.2:1,luck=.8+Math.random()*.4;
 let cust=Math.round(d.c*P[2]*ref*rep*wk*luck*BZCAP[b.st]);const ev=Math.random();let note='';
 if(ev<.06){cust=Math.round(cust*1.6);note='A COACH TRIP STOPPED BY!'}else if(ev<.1){cust=Math.round(cust*.55);note='QUIET DAY - RAIN ALL AFTERNOON.'}else if(ev<.13&&b.st===0){cust=Math.round(cust*.6);note='YOU HAD NO STAFF, SO THE QUEUE WALKED OUT.'}
 const rev=cust*d.s*P[1],stock=rev*d.cost,wage=BZWAGE[b.st],upkeep=Math.round(d.p*.004),prof=Math.round(rev-stock-wage-upkeep);
 /* reputation drifts: good value and staff help, gouging and no staff hurt */
 b.rep=Math.max(5,Math.min(100,b.rep+(P[1]<1?1.5:P[1]>1.3?-1.8:P[1]>1?-.6:.6)+(b.st>=2?.8:b.st===0?-1.2:0)+b.rf*.4));
 b.till+=Math.max(0,prof);if(prof<0)cash+=prof;b.days++;b.life+=prof;b.last={cust,rev:Math.round(rev),stock:Math.round(stock),wage,upkeep,prof,note,d:DAY};return b.last}
{const nd0=newDay;newDay=function(){nd0();try{const L=[];let tot=0;for(const n in BIZ.own){const r=bzTrade(n);tot+=r.prof;L.push(n+': '+r.cust+' customers, '+(r.prof>=0?'+':'−')+bzMoney(Math.abs(r.prof))+(r.note?' ('+r.note+')':''))}
 if(L.length)phText('BUSINESS REPORT','Yesterday: '+(tot>=0?'profit ':'loss ')+bzMoney(Math.abs(tot))+'. '+L.join(' · ')+' Collect your takings from the tills or the BUSINESS app.')}catch(e){console.error(e)}}}
/* an "OWNED BY YOU" plaque on the shop fronts you own */
const BZPL={};
function bzDress(){for(const k in BZPL){scene.remove(BZPL[k]);delete BZPL[k]}for(const n in BIZ.own){const o=SHOPD.find(s=>s.t===n);if(!o)continue;
 const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');g.fillStyle='#ffd24a';g.fillRect(0,0,256,64);g.fillStyle='#2a1a04';g.fillRect(6,6,244,52);g.fillStyle='#ffd24a';g.font='bold 30px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('★ OWNED BY YOU ★',128,34);
 const m=new THREE.Mesh(new THREE.PlaneGeometry(1.6,.4),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide}));const fx=Math.sin(o.psi),fz=Math.cos(o.psi);m.position.set(o.x-fx*1.3+fz*1.3,G0+2.55,o.z-fz*1.3-fx*1.3);m.rotation.y=o.psi;scene.add(m);BZPL[n]=m}}
{const l0=cozyLoad;cozyLoad=function(z){l0(z);bzDress()}}
/* inside an ownable shop: the office desk, a till to empty, and your staff behind the counter */
function bzHook(){const b0=buildShop;buildShop=function(o){b0(o);const n=o.t;if(!BZD[n]||o.apt)return;const own=BIZ.own[n];
 const z1=RZ-.25,x0=-RX+.4;gbox(SG,x0+.45,0,z1-.55,.9,.78,.5,0x5a3a1e);gbox(SG,x0+.45,.78,z1-.55,1.0,.05,.6,0x2a1a0c);
 {const c=document.createElement('canvas');c.width=256;c.height=96;const g=c.getContext('2d');g.fillStyle=own?'#2a1a04':'#1a2a3a';g.fillRect(0,0,256,96);g.fillStyle='#ffd24a';g.font='bold 30px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(own?'OFFICE':'FOR SALE',128,34);g.font='bold 22px Arial';g.fillStyle='#fff';g.fillText(own?'TILL '+bzMoney(own.till):bzMoney(BZD[n].p),128,70);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(.9,.34),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}));m.position.set(x0+.45,1.25,RZ-.05);m.rotation.y=Math.PI;SG.add(m)}
 IA.push({r:[x0-.1,x0+1.2,z1-1.3,z1+.05],label:()=>BIZ.own[n]?'MANAGE BUSINESS'+(BIZ.own[n].till>0?' · TILL '+bzMoney(BIZ.own[n].till):''):'BUY THIS BUSINESS '+bzMoney(BZD[n].p),fn:()=>{phOpen();PHN.app='biz';PHN.sub=n;phRender()}});
 if(own&&own.st>0&&!o.casino){const pos=CFSH&&CFSH[n]?[[-6.2,.7],[-5.4,3.0],[-4.6,.4]]:[[1.9,-1.85],[-1.9,-1.85],[2.9,-1.85]];for(let i=0;i<Math.min(own.st,pos.length);i++){try{const sp=pSpec(hash(n)%999+i*31+7,{ts:1,tc:TH[n]&&TH[n].sh!=null?[(TH[n].sh>>16&255)/255,(TH[n].sh>>8&255)/255,(TH[n].sh&255)/255]:[.3,.4,.6],bag:0,bp:false,scarf:null,old:false});personIn(sp,pos[i][0],pos[i][1],0)}catch(e){}}}}}
/* installed on the first game tick, after every other script has wrapped buildShop, so the desk survives their IA rebuilds */
{let hk=0;const u0=updCozy;updCozy=function(dt){if(!hk){hk=1;bzHook()}u0(dt)}}
/* ---- phone app ---- */
PHX.push({k:'biz',ic:'🏪',n:'BUSINESS',bg:'#7a3aa0',render({el,btn}){const n=PHN.sub;
 if(n&&BZD[n]){const d=BZD[n],b=BIZ.own[n];el('div','phH',d.ic+' '+n);
  if(!b){el('div','phR','Up for sale. About '+d.c+' customers a day spending around £'+d.s+' each.');const r=el('div','phR phK');el('span',null,'ASKING PRICE',r);el('span',null,bzMoney(d.p),r);
   const bt=el('div','bt');btn(bt,'BUY FOR '+bzMoney(d.p),()=>{const e=bzBuy(n);if(e)toast(e);phRender()});return}
  const box=(k,v,c)=>{const r=el('div','phR phK');el('span',null,k,r);const s=el('span',null,v,r);if(c)s.style.color=c;return r};
  box('TILL',bzMoney(b.till),'#9fe89f');{const bt=el('div','bt');btn(bt,'COLLECT TAKINGS',()=>{if(b.till<=0){toast('THE TILL IS EMPTY');return}cash+=b.till;toast('COLLECTED '+bzMoney(b.till));beep(990,.1,'square',.05);b.till=0;phRender()})}
  box('REPUTATION',Math.round(b.rep)+'%',b.rep>65?'#9fe89f':b.rep<35?'#ff8a8a':'#ffd24a');box('MANAGER',b.mgr);box('DAYS TRADING',String(b.days));box('LIFETIME PROFIT',(b.life<0?'−':'')+bzMoney(Math.abs(b.life)),b.life>=0?'#9fe89f':'#ff8a8a');
  if(b.last){const r=el('div','phR');el('div',null,'YESTERDAY (DAY '+b.last.d+')',r);el('small',null,b.last.cust+' customers · takings '+bzMoney(b.last.rev)+' · stock '+bzMoney(b.last.stock)+' · wages '+bzMoney(b.last.wage)+' · upkeep '+bzMoney(b.last.upkeep),r);const p=el('small',null,'PROFIT '+(b.last.prof<0?'−':'')+bzMoney(Math.abs(b.last.prof)),r);p.style.color=b.last.prof>=0?'#9fe89f':'#ff8a8a';if(b.last.note)el('small',null,b.last.note,r).style.color='#ffd24a'}
  el('div','phH','PRICES').style.marginTop='10px';{const bt=el('div','bt');BZPRICE.forEach((p,i)=>btn(bt,p[0],()=>{b.pr=i;phRender()},b.pr===i?'#2a8a3a':null));el('small',null,['Cheap: lots of customers, thin margins, reputation rises.','Normal prices.','Higher prices, fewer customers.','Top prices: few but rich customers, reputation falls.'][b.pr])}
  el('div','phH','STAFF').style.marginTop='10px';{const bt=el('div','bt');BZSTAFF.forEach((s,i)=>btn(bt,i?String(i):'0',()=>{b.st=i;phRender()},b.st===i?'#2a8a3a':null));el('small',null,BZSTAFF[b.st]+' · WAGES '+bzMoney(BZWAGE[b.st])+' A DAY · '+['You can only serve about half the customers.','Serves most customers.','Serves everyone, reputation rises.','Serves everyone and handles the rush.'][b.st])}
  el('div','phH','REFURBISH').style.marginTop='10px';{const nx=b.rf+1,r=el('div','phR');el('div',null,'NOW: '+BZREF[b.rf][0],r);if(nx<BZREF.length){const c=Math.round(d.p*BZREF[nx][1]/50)*50;el('small',null,'UPGRADE TO '+BZREF[nx][0]+': more customers and a higher sale value.',r);const bt=el('div','bt',null,r);btn(bt,'REFURBISH '+bzMoney(c),()=>{if(cash<c){toast('NOT ENOUGH CASH');return}cash-=c;b.rf=nx;toast(n+' IS NOW '+BZREF[nx][0]);phRender()})}else el('small',null,'FULLY REFURBISHED.',r)}
  {const r=el('div','phR');r.style.marginTop='10px';el('small',null,'SELL THE BUSINESS FOR ABOUT '+bzMoney(bzValue(n))+' (PLUS WHAT IS IN THE TILL).',r);const bt=el('div','bt',null,r);btn(bt,'SELL',()=>{if(confirmSell===n){bzSell(n);confirmSell=null;PHN.sub=null;phRender()}else{confirmSell=n;toast('TAP SELL AGAIN TO CONFIRM')}},'#a03030')}
  return}
 el('div','phH','MY BUSINESSES');let tot=0,mine=0;for(const k in BIZ.own){tot+=BIZ.own[k].till;mine++}
 if(mine){const r=el('div','phR phK');el('span',null,'IN THE TILLS',r);el('span',null,bzMoney(tot),r).style.color='#9fe89f';const bt=el('div','bt');btn(bt,'COLLECT ALL',()=>{if(!tot){toast('THE TILLS ARE EMPTY');return}cash+=tot;for(const k in BIZ.own)BIZ.own[k].till=0;toast('COLLECTED '+bzMoney(tot));phRender()})}else el('div','phR','You do not own a business yet. Pick one below, or walk into the shop and use the desk by the door.');
 for(const k of Object.keys(BZD)){const d=BZD[k],b=BIZ.own[k],r=el('div','phR');r.style.cursor='pointer';if(b)r.style.borderColor='#ffd24a';const t=el('div','phK',null,r);el('span',null,d.ic+' '+k,t);el('small',null,b?'TILL '+bzMoney(b.till):bzMoney(d.p),t).style.color=b?'#9fe89f':'#cde';
  el('small',null,b?'REP '+Math.round(b.rep)+'% · '+BZPRICE[b.pr][0]+' PRICES · '+BZSTAFF[b.st]+' · '+BZREF[b.rf][0]:'FOR SALE · ~'+d.c+' CUSTOMERS A DAY',r);r.onclick=()=>{PHN.sub=k;phRender()}}}});
var confirmSell=null;
bzDress();
