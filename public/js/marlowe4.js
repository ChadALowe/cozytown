/* ===== MARLOWE: places you can go into.
   · Hotels (THE GRAND MARLOWE, RIVERSIDE INN, BUDGET BEDS): book 1/2/3/7 nights at reception, the key works until 11:00 on checkout day.
   · MARLOWE ESTATES on the High Street sells four city homes (studio, riverside apartment, townhouse, sky penthouse).
     Homes have a bed (sleep + save), fridge, wardrobe and a garage panel (swap car / call your car to the door).
   · MARLOWE MOTORS on Terminal Road: buy any of the cars and drive the one you want; it's brought round to the kerb.
   · Cafés, takeaways and a pub along the shopping streets.
   Every door is a SHOPD entry (so doors.js gives it an arrow and the usual ENTER prompt works); interiors are built in SG. ===== */
(function(){
const MW=window.MARLOWE,M=MW.M,{OX,OZ,CITY}=MW,A=window.AIRPORT,Y=G0;
const cvx=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t};
const pw=r=>r.w>=20?6:4.5;
/* a door on the facade of block (c,r), side s, at fraction f along it */
function doorAt(c,r,s,f){const b=MW.BLK.find(x=>x.c===c&&x.r===r);const iu0=b.u0+pw(b.sw),iu1=b.u1-pw(b.se),iv0=b.v0+pw(b.ss),iv1=b.v1-pw(b.sn);let fu,fv,ou,ov,road;
 if(s==='s'){fu=iu0+f*(iu1-iu0);fv=iv0;ou=0;ov=-1;road=b.ss}else if(s==='n'){fu=iu0+f*(iu1-iu0);fv=iv1;ou=0;ov=1;road=b.sn}else if(s==='w'){fu=iu0;fv=iv0+f*(iv1-iv0);ou=-1;ov=0;road=b.sw}else{fu=iu1;fv=iv0+f*(iv1-iv0);ou=1;ov=0;road=b.se}
 const u=fu+ou*1.4,v=fv+ov*1.4,p=pw(road);return{u,v,x:OX+u,z:OZ+v,psi:Math.atan2(ou,ov),ou,ov,fu,fv,pw:p,road}}
/* ------------------------------------------------------------------ the places */
const HOT=[{t:'THE GRAND MARLOWE',tier:2,price:120,at:[2,8,'e',.3],bg:'#1a1424',fg:'#e8c060',stars:'★★★★★'},{t:'RIVERSIDE INN',tier:1,price:55,at:[6,9,'e',.5],bg:'#163a3a',fg:'#f0f0e0',stars:'★★★'},{t:'BUDGET BEDS',tier:0,price:25,at:[0,2,'e',.5],bg:'#f0a020',fg:'#1a1a1a',stars:'★'}];
const HOMES=[{id:'studio',t:'STUDIO FLAT · 12 ROPE WALK',sn:'STUDIO FLAT',tier:0,price:2500,at:[3,2,'s',.5],area:'THE DOCKS',desc:'COSY WAREHOUSE LOFT: BED, KITCHENETTE, SOFA'},
 {id:'river',t:'RIVERSIDE APARTMENT · EAST EMBANKMENT',sn:'RIVERSIDE APARTMENT',tier:1,price:5500,at:[4,7,'w',.3],area:'DOWNTOWN · RIVER VIEWS',desc:'BRIGHT 1-BED WITH VIEWS OVER THE MARLE'},
 {id:'town',t:"TOWNHOUSE · QUEEN'S ROAD",sn:'OLD TOWN TOWNHOUSE',tier:2,price:9000,at:[9,6,'e',.5],area:'OLD TOWN',desc:'GEORGIAN HOUSE: FIREPLACE, LIBRARY, BIG KITCHEN'},
 {id:'pent',t:'SKY PENTHOUSE · GEORGE STREET',sn:'SKY PENTHOUSE',tier:3,price:18000,at:[3,11,'s',.4],area:'DOWNTOWN · TOP FLOOR',desc:'FLOOR 38. GLASS WALL, GRAND PIANO, THE WHOLE CITY BELOW'}];
const FOODV=[{t:'THE COFFEE HOUSE',at:[1,3,'n',.35],h:[6,22],th:[0x5a3a24,0xe8dcc8],items:[['FLAT WHITE',3,4,22],['CROISSANT',2,18,4],['BANANA BREAD',3,24,6],['BACON ROLL',4,34,6],['ICED LATTE',4,4,26]]},
 {t:'MARLOWE FISH BAR',at:[7,3,'w',.5],h:[11,23],th:[0x1a4a8a,0xf2f2ee],items:[['FISH & CHIPS',8,62,8],['CHIPS & CURRY SAUCE',4,38,4],['MUSHY PEAS',2,14,2],['BATTERED SAUSAGE',4,30,4]]},
 {t:'SUSHI BAR',at:[1,9,'w',.3],h:[11,23],th:[0x1a1a1a,0xe8e0d0],items:[['SALMON NIGIRI',6,24,6],['CALIFORNIA ROLL',7,32,6],['MISO SOUP',3,12,8],['BENTO BOX',12,58,10],['GREEN TEA',2,2,16]]},
 {t:'BURGER BAR',at:[8,12,'e',.5],h:[11,24],th:[0xc8301a,0xf8e8c0],items:[['CHEESEBURGER',6,44,6],['DOUBLE STACK',9,62,6],['FRIES',3,22,2],['MILKSHAKE',4,18,14],['VEGGIE BURGER',6,40,6]]},
 {t:'THE TEA ROOM',at:[8,6,'e',.5],h:[8,18],th:[0x5a8a7a,0xf6efe2],items:[['POT OF TEA',3,4,20],['CREAM TEA (SCONES)',6,34,10],['VICTORIA SPONGE',4,26,6],['CUCUMBER SANDWICHES',5,30,4]]},
 {t:'THE CROWN',at:[7,5,'n',.5],h:[11,24],th:[0x1e3a26,0xe8c25a],pub:1,items:[['PINT OF BITTER',5,6,10],['GLASS OF WINE',6,4,8],['PIE & MASH',10,58,8],['PLOUGHMAN\'S',8,44,6],['PACKET OF CRISPS',1,12,2]]},
 {t:'NOODLE HOUSE',at:[2,1,'n',.5],h:[11,23],th:[0xd8a020,0x2a1a10],items:[['RAMEN',9,52,10],['PAD THAI',8,48,8],['DUMPLINGS',5,28,4],['BUBBLE TEA',4,10,16]]}];
const SHOP={t:'MARLOWE ESTATES',at:[7,4,'w',.5],h:[9,18]},MOT={t:'MARLOWE MOTORS',at:[0,1,'e',.5],h:[8,21]};
const ALL=[];
function reg(def,kind,extra){const d=doorAt(...def.at);const o=Object.assign({x:d.x,z:d.z,psi:d.psi,t:def.t,bg:def.bg||'#1a2c44',fg:def.fg||'#ffe9a8',mc:kind,def,door:d,rx:6,rz:4.6,sz:3.0},extra||{});SHOPD.push(o);ALL.push(o);HRS[def.t]=def.h||[0,24];return o}
for(const h of HOT)reg(h,'hotel',{rx:[5.5,6.5,8][h.tier],rz:[4.4,5,6][h.tier],sz:[3.4,4,5][h.tier]});
for(const h of HOMES)reg(h,'home',{rx:[4.6,6,7,9][h.tier],rz:[3.8,4.8,5.5,6.5][h.tier],sz:[2.9,3.9,4.6,5.6][h.tier],bg:'#2a2418',fg:'#e8d8a0'});
for(const f of FOODV)reg(f,'food',{rx:6,rz:4.6,sz:3.7});
reg(SHOP,'estate',{rx:6,rz:4.6,sz:3.7,bg:'#3a1a4a',fg:'#ffffff'});reg(MOT,'motors',{rx:9,rz:6,sz:5.1,bg:'#101820',fg:'#ff5a3a'});
/* on the city map + as cab destinations */
const ICO={hotel:'🏨',home:'🏠',food:'🍽',estate:'🔑',motors:'🚗'};for(const o of ALL)CITY.poi.push({n:o.mc==='home'?o.def.sn:o.t,u:o.door.u,v:o.door.v,ic:o.t==='THE CROWN'?'🍺':o.t==='THE COFFEE HOUSE'?'☕':ICO[o.mc],kind:o.mc});
/* ------------------------------------------------------------------ state + save */
const MS={own:{},stay:{},room:0,gar:'home'};window.MARLOWE4={MS,ALL,HOT,HOMES};
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.m4={own:MS.own,stay:MS.stay};return o};cozyLoad=function(z){l0(z);if(z&&z.m4){MS.own=z.m4.own||{};MS.stay=z.m4.stay||{}}}}
const stayOK=t=>{const s=MS.stay[t];return !!s&&(DAY<s.d||(DAY===s.d&&GT<11))};
const stayTxt=t=>{const s=MS.stay[t];if(!stayOK(t))return 'NO ROOM BOOKED';const n=s.d-DAY;return 'ROOM BOOKED UNTIL 11:00 '+(n<=0?'TODAY':n===1?'TOMORROW':DOWS[(dow()+n)%7]+' (DAY '+s.d+')')};
/* labels, hours, locked homes */
{const sl0=shopLabel;shopLabel=function(o){if(!o||!o.mc)return sl0(o);if(o.mc==='home')return MS.own[o.def.id]?'ENTER YOUR HOME':'FOR SALE £'+o.def.price.toLocaleString('en-GB')+' · SEE MARLOWE ESTATES';return shopOpen(o).open?'ENTER '+o.t:'CLOSED'}}
{const e0=enterShop;enterShop=function(o,imm){if(o&&o.mc==='home'&&!MS.own[o.def.id]){toast('FOR SALE: '+o.def.sn+' · £'+o.def.price.toLocaleString('en-GB')+'. BUY IT AT MARLOWE ESTATES ON THE HIGH STREET');return}if(o&&o.mc)MS.room=0;return e0(o,imm)}}
/* ------------------------------------------------------------------ interior kit */
const B=(x,y,z,w,h,d,hex)=>sbox(x,y,z,w,h,d,fmc(hex));
function shell(o,wall,floor){while(SG.children.length)SG.remove(SG.children[0]);RX=o.rx;RZ=o.rz;SHK=null;const Hh=IH+.9;
 SG.add(new THREE.Mesh(new THREE.PlaneGeometry(2*RX,2*RZ).rotateX(-Math.PI/2),imat(FLR[floor]())));const wm=tx=>{const m=imat(tx);m.color.setHex(wall);return m};
 splane(2*RX,Hh,0,Hh/2,-RZ,0,wm(sWl));splane(2*RX,Hh,0,Hh/2,RZ,Math.PI,wm(sWl));splane(2*RZ,Hh,RX,Hh/2,0,-Math.PI/2,wm(sWl2));splane(2*RZ,Hh,-RX,Hh/2,0,Math.PI/2,wm(sWl2));
 const vd=new THREE.Mesh(new THREE.BoxGeometry(90,70,90),new THREE.MeshBasicMaterial({color:0x0a0c12,side:THREE.BackSide,fog:false}));vd.position.y=Hh/2;SG.add(vd);
 splane(1.1,2.2,0,1.1,RZ-.02,Math.PI,imat(T_FDOOR));IROOM.splice(0,IROOM.length,[-RX-1,RX+1,-RZ-1,-RZ+.25],[-RX-1,-RX+.25,-RZ,RZ],[RX-.25,RX+1,-RZ,RZ]);IA.splice(0,IA.length);return Hh}
const blk=(x0,x1,z0,z1)=>IROOM.push([x0,x1,z0,z1]);
const ia=(x0,x1,z0,z1,label,fn)=>IA.push({r:[x0,x1,z0,z1],label,fn});
const leave=()=>ia(-1.0,1.0,RZ-.35,RZ,'LEAVE',()=>leaveShop());
const sign=(w,h,x,y,z,ry,bg,fg,txt,sz)=>sPlane(w,h,x,y,z,ry,txtTex(512,Math.round(512*h/w),bg,fg,txt,sz));
function skyTex(w,h){const night=todI===2,dusk=todI===1;return cvx(w,h,(g,W_,H_)=>{const gr=g.createLinearGradient(0,0,0,H_);if(night){gr.addColorStop(0,'#05081a');gr.addColorStop(1,'#1a2240')}else if(dusk){gr.addColorStop(0,'#2a3a6a');gr.addColorStop(1,'#f0905a')}else{gr.addColorStop(0,'#5a9ae0');gr.addColorStop(1,'#cfe6f8')}g.fillStyle=gr;g.fillRect(0,0,W_,H_);
 let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;for(let layer=0;layer<2;layer++){let x=0;while(x<W_){const bw=14+r()*40,bh=H_*(layer?.25+r()*.45:.15+r()*.3);g.fillStyle=layer?(night?'#0c1018':'#5a6478'):(night?'#141a28':'#8a94a8');g.fillRect(x,H_-bh,bw,bh);
  for(let yy=H_-bh+4;yy<H_-3;yy+=6)for(let xx=x+3;xx<x+bw-3;xx+=5)if(r()<(night?.38:.15)){g.fillStyle=night?(r()<.7?'#ffd890':'#cfe4ff'):'rgba(255,255,255,.35)';g.fillRect(xx,yy,2,3)}x+=bw+1}}})}
function windowView(w,h,x,y,z,ry){const m=new THREE.MeshBasicMaterial({map:skyTex(512,Math.round(512*h/w)),fog:false});splane(w,h,x,y,z,ry,m);/* frame */const fr=.08;B(x,y-h/2-fr,z+(ry===0?.03:0),w+.2,fr,.08,0xf2f2f0);B(x,y+h/2,z+(ry===0?.03:0),w+.2,fr,.08,0xf2f2f0)}
function plant(x,z){B(x,0,z,.45,.45,.45,0x8a5a3a);B(x,.45,z,.7,.9,.7,0x2f7a3a);B(x,1.2,z,.45,.4,.45,0x3f9a4a);blk(x-.3,x+.3,z-.3,z+.3)}
function sofa(x,z,w,col,ry){if(!ry){B(x,0,z,w,.45,.9,col);B(x,.45,z-.35,w,.5,.2,col);B(x-w/2+.1,.45,z,.2,.25,.9,col);B(x+w/2-.1,.45,z,.2,.25,.9,col);blk(x-w/2,x+w/2,z-.45,z+.45)}else{B(x,0,z,.9,.45,w,col);B(x+ry*.35,.45,z,.2,.5,w,col);blk(x-.45,x+.45,z-w/2,z+w/2)}}
function bed(x,z,w,col){B(x,0,z,w+.2,.35,2.2,0x5a3a24);B(x,.35,z,w,.25,2.0,0xf4f2ee);B(x,.6,z+.25,w,.08,1.45,col);for(const s of w>1.2?[-.42,.42]:[0])B(x+s*w*.8/1.2*.75,.6,z-.75,w>1.2?.6:.7,.15,.35,0xffffff);B(x,0,z-1.12,w+.2,1.1,.08,0x5a3a24);blk(x-w/2-.1,x+w/2+.1,z-1.15,z+1.1)}
function tvWall(x,z,ry){/* ry: wall facing direction: 1 = on the right wall facing -x */if(ry===1){B(x-.25,0,z,.5,.6,1.8,0x3a2a1e);B(x-.08,1.1,z,.06,.8,1.4,0x101014);B(x-.11,1.15,z,.02,.7,1.3,0x2a4a6a)}else{B(x,0,z+.25,1.8,.6,.5,0x3a2a1e);B(x,1.1,z+.08,1.4,.8,.06,0x101014);B(x,1.15,z+.11,1.3,.7,.02,0x2a4a6a)}}
function kitchen(x0,x1,z,col){const w=x1-x0;B((x0+x1)/2,0,z,w,.9,.65,col);B((x0+x1)/2,.9,z,w+.05,.05,.7,0xd8d4cc);B(x0+.5,.95,z,.5,.05,.4,0x222);B(x1-.7,.92,z,.6,.12,.45,0xc0c4c8);B((x0+x1)/2,1.5,z-.12,w,.7,.38,col);B(x1+.4,0,z,.75,1.9,.68,0xe8ecee);blk(x0,x1+.8,z-.35,z+.35)}
function npc(seed,x,z,ry,o){return personIn(pSpec(seed,Object.assign({ts:1,gl:false,scarf:null,bp:false,bag:0,old:false},o||{})),x,z,ry||0)}
/* ------------------------------------------------------------------ builders */
function buildHotelLobby(o){const T=o.def.tier,lux=T===2,H=shell(o,lux?0x2a2234:T?0xe8dcc4:0xf0e8d8,lux?'stone':T?'wood':'tile');
 if(lux){B(0,0,0,RX*1.2,.02,RZ*.9,0x6a1a2a);for(const s of[-1,1]){B(s*(RX-.15),0,0,.1,H,2*RZ,0x3a2e44);B(s*(RX-1.2),0,-RZ+.5,.5,H,.5,0xd8c890)}}
 /* reception desk */B(0,0,-RZ+1.6,4.4,1.05,.7,lux?0x3a2a1a:T?0x6a4a2a:0xf0a020);B(0,1.05,-RZ+1.6,4.5,.06,.8,lux?0xd8c070:0xe8e4dc);B(1.3,1.11,-RZ+1.6,.4,.3,.3,0x202228);B(-1.4,1.11,-RZ+1.55,.15,.25,.15,0xe8c060);blk(-2.3,2.3,-RZ,-RZ+2.0);
 npc(T*31+5100,0,-RZ+.9,0,{f:T!==1,ts:3,tc:lux?[.1,.08,.14]:T?[.2,.3,.3]:[.9,.55,.1],hs:lux?9:2});
 sign(4.8,.8,0,2.6,-RZ+.03,0,o.bg,o.fg,o.t+'  '+o.def.stars,lux?40:44);sign(1.6,.4,-RX+.03,2.3,0,Math.PI/2,'#222','#fff','ROOMS →',26);
 /* lift doors */B(-RX+.1,0,0,.12,2.3,1.6,lux?0xc8b070:0x9aa0a8);B(-RX+.17,0,0,.03,2.3,.04,0x333);
 for(const[x,z]of[[-RX+1.6,RZ-1.4],[RX-1.6,RZ-1.4]])plant(x,z);sofa(RX-2,.4,2.2,lux?0x5a1a2a:T?0x2a5a5a:0x2a4a8a,-1);sofa(-RX+2.8,1.6,2.2,lux?0x5a1a2a:T?0x2a5a5a:0x2a4a8a,0);
 if(lux){for(const x of[-3,3])B(x,H-.4,0,.6,.2,.6,0xffe9a0);B(0,0,1.4,1.2,.5,.6,0xd8c890)}
 SHOPCUR={o,k:['RECEPTION','Welcome to '+o.t+'! Rooms are £'+o.def.price+' a night.']};
 ia(-2.2,2.2,-RZ+2.0,-RZ+3.0,()=>'RECEPTION · '+(stayOK(o.t)?'YOUR STAY':'BOOK A ROOM £'+o.def.price+'/NIGHT'),()=>openShop('mhotel'));
 ia(-RX+.2,-RX+1.6,-1.2,1.2,()=>stayOK(o.t)?'GO UP TO YOUR ROOM':'ROOMS (GUESTS ONLY)',()=>{if(!stayOK(o.t)){toast('BOOK A ROOM AT RECEPTION FIRST');return}goRoom(o)});leave()}
function buildHotelRoom(o){const T=o.def.tier,lux=T===2;o.rx=[4.2,5,6.5][T];o.rz=[3.6,4.2,5][T];const H=shell(o,lux?0x3a3040:T?0xe8dcc4:0xe4ddd0,lux?'carpet':T?'wood':'carpet');o.rx=[5.5,6.5,8][T];o.rz=[4.4,5,6][T];
 bed(0,-RZ+1.3,T?1.6:1.0,lux?0x6a1a2a:T?0x2a6a6a:0x2a4a8a);B(-1.4,0,-RZ+.4,.5,.55,.45,0x4a3a2a);B(1.4,0,-RZ+.4,.5,.55,.45,0x4a3a2a);B(-1.4,.55,-RZ+.4,.2,.4,.2,0xffe9a0);B(1.4,.55,-RZ+.4,.2,.4,.2,0xffe9a0);blk(-1.7,-1.1,-RZ,-RZ+.7);blk(1.1,1.7,-RZ,-RZ+.7);
 windowView(lux?4:2.2,lux?2.2:1.5,lux?-RX+2.6:-RX+1.6,1.7,-RZ+.02,0);if(lux)windowView(2.4,2.2,RX-1.6,1.7,-RZ+.02,0);
 tvWall(RX-.05,.4,1);blk(RX-.55,RX,-.5,1.3);sofa(-RX+1,.9,T?1.8:1.2,lux?0xd8c890:0x6a5a4a,1);
 if(T)B(RX-.5,0,RZ-1.3,.5,.85,.6,0x2a2a2a);/* minibar */if(T)blk(RX-.8,RX,RZ-1.65,RZ-.95);
 if(lux){B(-RX+2.6,0,RZ-1.4,1.2,.75,.7,0x4a3a2a);plant(RX-1,-RZ+1.2);sign(2.2,.5,0,2.8,-RZ+.03,0,'#3a3040','#e8c060','THE GRAND MARLOWE',30)}
 const room=['ROOM 4','ROOM 12','SUITE 38'][T];toast(room+' · '+stayTxt(o.t));
 ia(-1.6,1.6,-RZ+2.3,-RZ+3.1,'BED: SLEEP',()=>openShop('mbed'));if(T)ia(RX-1.6,RX,RZ-2.2,RZ-.6,'MINIBAR',()=>openShop('mbar'));
 ia(RX-1.4,RX,-.6,1.4,'WATCH TV',()=>toast(pk(['MARLOWE NEWS: TRAFFIC IS CALM ON KING\'S AVENUE','THE WEATHER: MILD, WITH A CHANCE OF PIGEONS','FOOTBALL: VILLAGE ROVERS TOP THE LEAGUE','QUIZ SHOW: "WHAT IS THE CAPITAL OF MARLOWE?"'])));
 ia(-1.0,1.0,RZ-.35,RZ,'BACK TO THE LOBBY',()=>goLobby(o))}
const pk=a=>a[(Math.random()*a.length)|0];
function buildHome(o){const T=o.def.tier,pent=T===3,town=T===2;const H=shell(o,pent?0xf4f4f2:town?0xd8c8a8:T?0xeae6dc:0xb8a088,pent?'tile':town?'wood':T?'wood':'stone');
 if(pent){/* glass wall with the whole city */windowView(2*RX-.4,H-.3,0,H/2+.05,-RZ+.03,0);for(let x=-RX+.2;x<=RX;x+=2.4)B(x,0,-RZ+.06,.08,H,.08,0x222428)}
 else if(T===1){windowView(2.4,1.6,-RX+2.2,1.6,-RZ+.02,0);windowView(2.4,1.6,RX-2.2,1.6,-RZ+.02,0)}else windowView(T?2:1.6,1.4,0,1.7,-RZ+.02,0);
 if(T===0){/* studio loft: brick, bed in the corner */bed(-RX+1.2,-RZ+1.3,1.4,0x3a6a9a);kitchen(RX-3.2,RX-1.2,-RZ+.35,0x2a2a2a);sofa(0,1.0,1.8,0x8a3a2a,0);tvWall(0,RZ-.9,0);B(0,0,-.3,.9,.4,.5,0x5a3a24);blk(-.45,.45,-.55,-.05)}
 else if(T===1){bed(-RX+1.4,-RZ+1.3,1.6,0x2a6a6a);kitchen(RX-3.6,RX-1.4,-RZ+.35,0xf0f0ee);B(RX-2.4,0,0,1.6,.9,.8,0xf0f0ee);B(RX-2.4,.9,0,1.7,.05,.9,0xd8d4cc);blk(RX-3.2,RX-1.6,-.4,.4);sofa(0,1.6,2.2,0x4a5a7a,0);tvWall(0,RZ-.9,0);plant(-RX+.6,RZ-1)}
 else if(town){bed(-RX+1.5,-RZ+1.3,1.6,0x6a2a2a);B(0,0,-RZ+.3,1.8,1.1,.5,0x8a7a6a);B(0,0,-RZ+.25,1,.7,.3,0x1a1a1a);B(0,.2,-RZ+.3,.6,.25,.2,0xff8a2a);B(0,1.1,-RZ+.3,2,.08,.6,0x6a5a4a);blk(-1,1,-RZ,-RZ+.6);
  for(let k=0;k<3;k++)B(RX-.3,0,-2+k*1.3,.5,2.2,1.2,0x5a3a24);for(let k=0;k<3;k++)for(let r=0;r<4;r++)B(RX-.5,.2+r*.5,-2+k*1.3,.1,.32,1.0,[0x8a2020,0x204a8a,0x2a6a3a,0xc8a040][(k+r)%4]);blk(RX-.6,RX,-2.7,1.7);
  kitchen(-3.2,-1,RZ-1.8,0x3a5a4a);sofa(1.8,1.6,2.0,0x2a4a3a,0);sofa(-1.2,.9,1.6,0x2a4a3a,1);plant(RX-.6,RZ-1)}
 else{bed(-RX+1.6,-RZ+1.6,1.8,0xf0f0f0);sofa(1,.8,3,0xf4f4f0,0);sofa(3.6,-.4,2,0xf4f4f0,-1);B(1,0,-.4,1.4,.35,.8,0x1a1a1a);kitchen(-3,0,RZ-1.6,0x1a1a1a);B(-1.5,0,RZ-3,2.6,.95,.9,0xf0f0f0);B(-1.5,.95,RZ-3,2.7,.05,1.0,0x2a2a2a);blk(-2.8,-.2,RZ-3.45,RZ-2.55);
  /* grand piano */B(RX-1.6,0,RZ-2.2,1.5,1.0,1.9,0x0a0a0a);B(RX-1.6,1.0,RZ-2.6,1.4,.5,.05,0x0a0a0a);blk(RX-2.4,RX-.8,RZ-3.2,RZ-1.2);plant(RX-.6,-RZ+1);plant(-RX+.6,RZ-1);tvWall(RX-.05,-1.8,1);
  B(-RX+.08,1,1,.04,1.4,2,0xd04a2a);B(-RX+.08,1,3.4,.04,1.2,1.4,0x2a6ad0)}
 /* wardrobe + garage panel by the door */B(-RX+.4,0,RZ-1.6,.7,2.1,1.2,0x6a4a2a);blk(-RX,-RX+.8,RZ-2.2,RZ-1.0);B(RX-.12,1,RZ-1.2,.06,.8,.6,0x202830);B(RX-.15,1.2,RZ-1.2,.02,.5,.5,0x40c080);
 sign(1.6,.35,0,2.55,RZ-.04,Math.PI,'#2a2418','#e8d8a0',o.def.sn,20);
 SHOPCUR={o,k:['HOME',"Home sweet home."]};
 const bz=T===0?[-RX+.2,-RX+2.4]:[-RX+.2,-RX+2.8];ia(bz[0],bz[1],-RZ+2.3,-RZ+3.2,'BED: SLEEP',()=>openShop('mbed'));
 const kx=T===3?[-3,0.2,RZ-2.4,RZ-1.3]:T===2?[-3.3,-.8,RZ-2.6,RZ-2.1]:[RX-3.4,RX-.6,-RZ+.7,-RZ+1.5];ia(...kx,'OPEN FRIDGE',()=>openShop('fridge'));
 ia(-RX+.8,-RX+1.8,RZ-2.2,RZ-1.0,'WARDROBE',()=>{if(CUSTOM_SHOP.cward)openShop('cward');else toast('YOUR CLOTHES ARE ALL HERE')});
 ia(RX-1.4,RX,RZ-1.9,RZ-.5,'GARAGE: YOUR CARS',()=>{MS.gar='home';openShop('mgar')});
 if(pent)ia(RX-2.6,RX-.6,RZ-1.2,RZ-.4,'PLAY THE PIANO',()=>{for(let i=0;i<8;i++)setTimeout(()=>beep([523,587,659,698,784,698,659,523][i],.18,'triangle',.06),i*190);toast('♪ A LITTLE NIGHT MUSIC ♪')});
 leave();toast(o.def.sn+' · WELCOME HOME')}
function buildFood(o){const f=o.def,[c1,c2]=f.th,H=shell(o,c2,f.pub?'wood':'tile');
 B(0,0,-RZ+1.5,5,1.0,.7,c1);B(0,1.0,-RZ+1.5,5.1,.06,.8,f.pub?0x8a6a3a:0xe8e4dc);blk(-2.6,2.6,-RZ,-RZ+1.9);
 if(f.pub){for(let k=0;k<6;k++)B(-2+k*.8,1.06,-RZ+1.3,.08,.5,.08,0xd8c070);B(0,1.6,-RZ+.3,4.6,.9,.3,0x3a2a1a);for(let k=0;k<10;k++)B(-2.1+k*.47,1.65,-RZ+.36,.12,.32,.12,[0x2a6a3a,0x8a2a1a,0xd8a020][k%3])}
 else{B(0,1.06,-RZ+1.5,.8,.35,.5,0xc0c4c8);B(1.6,1.06,-RZ+1.5,.4,.3,.35,0x202228)}
 const menu=f.items.map(i=>i[0]+'  £'+i[1]).join('   ');sign(4.6,.9,0,2.5,-RZ+.03,0,'#14141a','#ffe9a8',f.t,46);sign(5.4,.32,0,1.85,-RZ+.04,0,'#14141a','#ffffff',menu,13);
 npc(f.t.length*97+3,0,-RZ+.85,0,{f:f.t.length%2===0,ts:1,tc:[(c1>>16&255)/255,(c1>>8&255)/255,(c1&255)/255],hs:f.t.length%5});
 for(const[x,z]of[[-3.2,0],[0,1.2],[3.2,0],[-3.2,2.6],[3.2,2.6]]){B(x,0,z,.9,.75,.9,f.pub?0x4a2a14:0xf0f0ee);B(x,0,z,.12,.73,.12,0x333);for(const s of[-1,1])B(x+s*.75,0,z,.4,.45,.4,c1);blk(x-1,x+1,z-.5,z+.5)}
 SHOPCUR={o,k:[f.pub?'LANDLORD':'STAFF',f.pub?'What\'ll it be?':'Hi! What can I get you?']};
 ia(-2.4,2.4,-RZ+1.9,-RZ+2.9,f.pub?'ORDER AT THE BAR':'ORDER',()=>openShop('mfood'));leave()}
function buildEstate(o){const H=shell(o,0xf2eef4,'carpet');B(0,0,-RZ+1.6,3.4,.78,1.0,0x3a1a4a);B(0,.78,-RZ+1.6,3.5,.05,1.1,0xf0f0f0);B(.9,.83,-RZ+1.5,.5,.35,.05,0x202228);blk(-1.8,1.8,-RZ,-RZ+2.2);
 npc(9191,0,-RZ+.8,0,{f:true,ts:3,tc:[.25,.1,.3],hs:9,gl:true});sign(4,.7,0,2.6,-RZ+.03,0,'#3a1a4a','#ffffff','MARLOWE ESTATES',44);
 HOMES.forEach((h,i)=>{const x=-RX+.04,z=-2.4+i*1.6;const tx=cvx(256,192,(g,W_,H_)=>{const gr=g.createLinearGradient(0,0,0,H_);gr.addColorStop(0,'#8ac0f0');gr.addColorStop(1,'#e8f0f8');g.fillStyle=gr;g.fillRect(0,0,W_,H_);g.fillStyle=['#7a4a34','#d8dce0','#efe4cc','#8a98b0'][i];const bw=[120,100,140,70][i],bh=[80,120,90,170][i];g.fillRect(W_/2-bw/2,H_-bh,bw,bh);g.fillStyle='#2a3a4a';for(let y=H_-bh+10;y<H_-12;y+=18)for(let x2=W_/2-bw/2+8;x2<W_/2+bw/2-10;x2+=16)g.fillRect(x2,y,8,10);g.fillStyle='#3a1a4a';g.fillRect(0,H_-34,W_,34);g.fillStyle='#fff';g.font='bold 15px Arial';g.textAlign='center';g.fillText(h.sn+' £'+h.price.toLocaleString('en-GB'),W_/2,H_-12);if(MS.own[h.id]){g.fillStyle='#c8102e';g.font='bold 34px Arial';g.save();g.translate(W_/2,70);g.rotate(-.3);g.fillText('SOLD',0,0);g.restore()}});
  sPlane(1.3,1.0,x,1.6,z,Math.PI/2,tx)});
 for(const x of[-1,1])B(x*.9,0,-RZ+3.1,.5,.45,.5,0x5a3a6a);plant(RX-.6,RZ-1);plant(RX-.6,-RZ+.6);
 SHOPCUR={o,k:['ESTATE AGENT','Looking for a place in Marlowe? Take a look at our listings.']};ia(-1.8,1.8,-RZ+2.2,-RZ+3.2,'BROWSE HOMES FOR SALE',()=>openShop('mest'));ia(-RX,-RX+1.2,-3,3,'LOOK AT THE LISTINGS',()=>openShop('mest'));leave()}
function buildMotors(o){const H=shell(o,0xe8eaee,'tile');B(0,0,-RZ+1.4,4,1.0,.8,0x101820);B(0,1.0,-RZ+1.4,4.1,.06,.9,0xd0d4d8);blk(-2.1,2.1,-RZ,-RZ+1.9);
 npc(7717,0,-RZ+.7,0,{f:false,ts:3,tc:[.12,.12,.16],hs:1});sign(5,.8,0,2.6,-RZ+.03,0,'#101820','#ff5a3a','MARLOWE MOTORS',46);
 const cols=[0xc8102e,0x1d56b8,0xf0f0f0];[-5,0,5].forEach((x,i)=>{const z=1.2,c=cols[i];B(x,0,z,3.2,.08,4.8,0x9aa0a8);B(x,.35,z,1.8,.65,4.2,c);B(x,1.0,z-.2,1.6,.55,2.2,0x1a2430);B(x,1.52,z-.2,1.5,.06,2.0,c);for(const sx of[-.85,.85])for(const sz of[-1.35,1.35])B(x+sx,.05,z+sz,.25,.6,.62,0x111111);blk(x-1.1,x+1.1,z-2.2,z+2.2)});
 for(const x of[-RX+.6,RX-.6])plant(x,RZ-1);
 SHOPCUR={o,k:['DEALER','Every model on the forecourt. Buy one or swap to a car you already own.']};ia(-2,2,-RZ+1.9,-RZ+2.9,'BUY OR SWAP CARS',()=>{MS.gar='dealer';openShop('mgar')});leave()}
{const b0=buildShop;buildShop=function(o){if(!o||!o.mc)return b0(o);
 if(o.mc==='hotel')(MS.room?buildHotelRoom:buildHotelLobby)(o);else if(o.mc==='home')buildHome(o);else if(o.mc==='food')buildFood(o);else if(o.mc==='estate')buildEstate(o);else if(o.mc==='motors')buildMotors(o);
 try{if(o.mc==='food'||o.mc==='hotel'&&!MS.room)addVisitors(o)}catch(e){}}}
function goRoom(o){fade(()=>{MS.room=1;buildShop(o);P.x=IX;P.z=IZ+RZ-1.1;P.y=IY+.02;P.psi=Math.PI;P.speed=0;camAng=P.psi;setLabels()})}
function goLobby(o){fade(()=>{MS.room=0;buildShop(o);P.x=IX-RX+2;P.z=IZ;P.y=IY+.02;P.psi=Math.PI/2;P.speed=0;camAng=P.psi;setLabels()})}
/* ------------------------------------------------------------------ menus */
const H$=id=>document.getElementById(id);
CUSTOM_SHOP.mhotel=function(msg){const o=SHOPCUR.o,h=o.def;H$('shT').textContent=o.t+'  '+h.stars;H$('shMsg').textContent=msg||stayTxt(o.t)+'  ·  CHECK-OUT 11:00';
 const ok=stayOK(o.t);const rd=window.REP?REP.disc():1;for(const[n,lbl,disc]of[[1,'1 NIGHT · UNTIL TOMORROW MORNING',1],[2,'2 NIGHTS',1],[3,'3 NIGHTS',.95],[7,'1 WEEK (7 NIGHTS) · 1 NIGHT FREE',6/7]]){const p=Math.round(h.price*n*disc*rd);
  dRow((ok?'EXTEND: ':'')+lbl,[['£'+p,()=>{if(cash<p)return renderShop('NOT ENOUGH CASH');cash-=p;const base=ok?MS.stay[o.t].d:(GT<6?DAY-1:DAY);MS.stay[o.t]={d:base+n,h:11};if(window.REP)REP.add('tourist',1);beep(880,.08,'square',.05);renderShop('THANK YOU! '+stayTxt(o.t)+'. THE LIFT IS TO YOUR LEFT.')}]])}
 if(ok){dRow('GO UP TO YOUR ROOM',[['GO',()=>{closeShop();goRoom(o)}]]);dRow('CHECK OUT NOW',[['CHECK OUT',()=>{delete MS.stay[o.t];renderShop('THANK YOU FOR STAYING WITH US!')}]])}
 dRow('',[['BACK',()=>closeShop()]])};
function citySleep(){HN.en=100;HN.food=Math.max(25,HN.food-22);fade(()=>{if(GT>=6)newDay();GT=7;const b=hband();todI=b;applyTOD(b);if(SHOPCUR&&SHOPCUR.o)buildShop(SHOPCUR.o);saveGame();toast('GOOD MORNING, MARLOWE!')})}
CUSTOM_SHOP.mbed=function(msg){H$('shT').textContent='BED';H$('shMsg').textContent=msg||('ENERGY '+Math.round(HN.en)+'/100   FOOD '+Math.round(HN.food)+'/100');
 dRow('SLEEP UNTIL MORNING & SAVE',[['SLEEP',()=>{closeShop();citySleep()}]]);
 dRow('QUICK NAP (1 HOUR, ENERGY +25)',[['NAP',()=>{closeShop();fade(()=>{GT+=1;if(GT>=24){GT-=24;newDay()}HN.en=Math.min(100,HN.en+25);HN.food=Math.max(0,HN.food-6);const b=hband();todI=b;applyTOD(b);toast('ZZZ... ENERGY +25')})}]]);
 dRow('SAVE GAME ONLY',[['SAVE',()=>{closeShop();saveGame()}]]);dRow('',[['BACK',()=>closeShop()]])};
CUSTOM_SHOP.mbar=function(msg){H$('shT').textContent='MINIBAR';H$('shMsg').textContent=msg||'HELP YOURSELF (ADDED TO YOUR BILL)';const lux=SHOPCUR.o.def.tier===2;
 for(const[n,p,h,e]of[['CHOCOLATE',lux?0:3,16,4],['SALTED NUTS',lux?0:3,14,2],['SPARKLING WATER',lux?0:2,0,10],['CHAMPAGNE (MINI)',lux?0:12,4,6]])dRow(n+(h?'  FOOD +'+h:'')+(e?'  ENERGY +'+e:''),[[p?'£'+p:'FREE',()=>{if(cash<p)return renderShop('NOT ENOUGH CASH');cash-=p;fed(h,e,n+'!'+(p?' (-£'+p+')':''));renderShop('ENJOY!')}]]);dRow('',[['BACK',()=>closeShop()]])};
CUSTOM_SHOP.mfood=function(msg){const o=SHOPCUR.o,f=o.def;H$('shT').textContent=f.t;H$('shMsg').textContent=msg||(f.pub?'PUB GRUB & DRINKS':'EAT IN OR TAKE AWAY');
 const rd=window.REP?REP.disc():1;for(const[n,p0,h,e]of f.items){const p=Math.max(1,Math.round(p0*rd));dRow(n+(h?'  FOOD +'+h:'')+(e?'  ENERGY +'+e:''),[['£'+p,()=>{if(cash<p)return renderShop('NOT ENOUGH CASH');cash-=p;fed(h,e,n+'! (-£'+p+')');renderShop('ENJOY!')}]])}dRow('',[['BACK',()=>closeShop()]])};
CUSTOM_SHOP.mest=function(msg){H$('shT').textContent='MARLOWE ESTATES';H$('shMsg').textContent=msg||'HOMES FOR SALE IN MARLOWE  ·  CASH £'+Math.round(cash).toLocaleString('en-GB');
 for(const h of HOMES){const own=MS.own[h.id],o=ALL.find(x=>x.def===h);dRow(h.sn+' · '+h.area+' · '+h.desc,own?[['OWNED ✓',()=>{},1],['SHOW ME',()=>{closeShop();crWay(o.x,o.z,h.sn)}],['SELL £'+Math.round(h.price*.8).toLocaleString('en-GB'),()=>{delete MS.own[h.id];cash+=Math.round(h.price*.8);renderShop('SOLD. £'+Math.round(h.price*.8).toLocaleString('en-GB')+' PAID TO YOU.')}]]:
  [['BUY £'+h.price.toLocaleString('en-GB'),()=>{if(cash<h.price)return renderShop('YOU NEED £'+h.price.toLocaleString('en-GB')+' FOR THE '+h.sn);cash-=h.price;MS.own[h.id]=1;for(let i=0;i<4;i++)setTimeout(()=>beep(600+i*160,.1,'square',.05),i*110);renderShop('CONGRATULATIONS! THE KEYS TO YOUR '+h.sn+' ARE YOURS.');try{phText('MARLOWE ESTATES','Your new '+h.sn.toLowerCase()+' is ready. I\'ve put it on your map.')}catch(e){}buildShop(SHOPCUR.o)}],['SHOW ME',()=>{closeShop();crWay(o.x,o.z,h.sn)}]])}
 dRow('',[['BACK',()=>closeShop()]])};
/* cars: buy, swap and have the car brought to the kerb outside the door you're at */
function kerbSpot(o){const d=o.door,k=d.pw-1.4+2.6;return{x:d.x+d.ou*k,z:d.z+d.ov*k,psi:d.psi+Math.PI/2}}
function deliver(o){const s=kerbSpot(o);GS.x=s.x;GS.z=s.z;GS.psi=s.psi;GS.vx=GS.vz=GS.vy=0;GS.speed=0;GS.y=gH(s.x,s.z)+.1;GS.prevGY=GS.y;GS.pitch=GS.roll=0}
CUSTOM_SHOP.mgar=function(msg){const o=SHOPCUR.o,dealer=MS.gar==='dealer';H$('shT').textContent=dealer?'MARLOWE MOTORS':'YOUR GARAGE';H$('shMsg').textContent=msg||('DRIVING: '+CARN[CARI]+'  ·  YOUR CAR IS BROUGHT ROUND TO THE KERB');
 CARN.forEach((n,i)=>{const own=OWN.car[i];const b=[];if(own)b.push(i===CARI?['DRIVING',()=>{},1]:['DRIVE IT',()=>{setCar(i);deliver(o);renderShop('YOUR '+n+' IS WAITING OUTSIDE')}]);
  else if(dealer)b.push(['BUY £'+CPR(i).toLocaleString('en-GB'),()=>{const p=CPR(i);if(cash<p)return renderShop('NOT ENOUGH CASH FOR THE '+n);cash-=p;OWN.car[i]=1;setCar(i);deliver(o);beep(880,.1,'square',.05);renderShop('SOLD! YOUR NEW '+n+' IS OUTSIDE')}]);else b.push(['NOT OWNED',()=>renderShop('BUY IT AT MARLOWE MOTORS ON TERMINAL ROAD')]);
  dRow(n+' · '+CARSD[i],b)});
 dRow('BRING MY CAR TO THE DOOR',[['CALL IT',()=>{deliver(o);renderShop('YOUR '+CARN[CARI]+' IS PARKED OUTSIDE')}]]);dRow('',[['BACK',()=>closeShop()]])};
/* hotel checkout while you're in your room */
let ckT=0;{const u0=updCozy;updCozy=function(dt){u0(dt);
 if(GS.inside&&SHOPCUR&&SHOPCUR.o&&SHOPCUR.o.mc==='hotel'&&MS.room){ckT+=dt;if(ckT>1){ckT=0;if(!stayOK(SHOPCUR.o.t)){toast('IT\'S CHECK-OUT TIME. THANK YOU FOR STAYING!');goLobby(SHOPCUR.o)}}}
 if(!decor&&MW.CITY.built)dress()}}
/* ------------------------------------------------------------------ the doors in the street: door, canopy and sign; FOR SALE boards on homes */
let decor=null;const SALE={};
function dress(){decor=new THREE.Group();const mk=(w,h,d,col,x,y,z,ry,tex)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),tex?new THREE.MeshBasicMaterial({map:tex}):new THREE.MeshBasicMaterial({color:col}));m.position.set(x,y,z);m.rotation.y=ry||0;decor.add(m);return m};
 for(const o of ALL){const d=o.door,fx=OX+d.fu+d.ou*.06,fz=OZ+d.fv+d.ov*.06,ry=d.psi,y0=Y+MW.KH,lux=o.mc==='hotel'&&o.def.tier===2;
  const dc=o.mc==='home'?0x1e3a2a:o.mc==='hotel'?0x2a2030:0x2a2a2e;mk(1.7,2.6,.12,0xd8d0c0,fx,y0+1.3,fz,ry);mk(1.4,2.4,.16,dc,fx,y0+1.2,fz,ry);mk(.1,.1,.2,0xd8c070,fx+Math.cos(ry)*.45,y0+1.15,fz-Math.sin(ry)*.45,ry);
  if(o.mc!=='home'){const cw=lux?5:3.2,cd=lux?2.6:1.5;mk(cw,.18,cd,lux?0xd8c070:new THREE.Color(o.bg).getHex(),fx+d.ou*cd/2,y0+3.05,fz+d.ov*cd/2,ry);if(lux)for(const s of[-1,1])mk(.12,3.05,.12,0xd8c070,fx+d.ou*(cd-.15)+Math.cos(ry)*s*2.3,y0+1.52,fz+d.ov*(cd-.15)-Math.sin(ry)*s*2.3,ry);
   const tx=txtTex(512,96,o.bg,o.fg,o.t,o.t.length>14?40:50);const sg=new THREE.Mesh(new THREE.PlaneGeometry(4.2,.8),new THREE.MeshBasicMaterial({map:tx}));sg.position.set(fx+d.ou*.04,y0+3.65,fz+d.ov*.04);sg.rotation.y=ry;decor.add(sg)}
  else{const pl=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.32),new THREE.MeshBasicMaterial({map:txtTex(256,68,'#2a2418','#e8d8a0',o.def.sn,o.def.sn.length>14?20:24)}));pl.position.set(fx+d.ou*.12,y0+2.75,fz+d.ov*.12);pl.rotation.y=ry;decor.add(pl);
   /* estate agent's board on a post at the edge of the pavement */const bx=o.x+d.ou*.9+Math.cos(ry)*1.6,bz=o.z+d.ov*.9-Math.sin(ry)*1.6;const g=new THREE.Group();g.position.set(bx,y0,bz);g.rotation.y=ry;
   const post=new THREE.Mesh(new THREE.BoxGeometry(.1,2.6,.1),new THREE.MeshBasicMaterial({color:0xf0f0f0}));post.position.y=1.3;g.add(post);const bd=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.75),new THREE.MeshBasicMaterial({map:txtTex(256,176,'#3a1a4a','#ffffff','FOR SALE',54),side:THREE.DoubleSide}));bd.position.set(.6,2.2,0);bd.rotation.y=Math.PI/2;g.add(bd);decor.add(g);SALE[o.def.id]=g}}
 A.chunk(M,decor)}
{const u0=updCozy;updCozy=function(dt){u0(dt);for(const id in SALE)SALE[id].visible=!MS.own[id]}}
})();
