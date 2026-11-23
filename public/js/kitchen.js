/* ---- THE KITCHEN: free cooking at home. No recipes to pick: open the cupboards, take out pans and food, chop,
   whisk, fry, boil, roast and bake, then plate up. The game works out what you made and how well you made it.
     FRIDGE         your eggs, milk, fish and veg (from the farm, the allotment and fishing), plus a COZCO delivery
                    for anything you haven't got
     PANTRY         flour, sugar, rice, pasta, bread, oil, beans, oats, chocolate (always stocked)
     PAN CUPBOARD   frying pan, saucepan, wok, roasting tin, baking dish
     SPICE RACK     salt, pepper, herbs, chilli, curry powder
     BOARD · BOWL · SINK · HOB (four rings, tap the knobs) · OVEN (tap the knob, close the door) · PLATE · BIN
   Tap something to pick it up, tap where it goes. Tap a pan, the board or the bowl to see what you can do with it.
   Opened from the fridge in any home you own. ---- */
(function(){
if(typeof openShop!=='function'||!window.THREE)return;
const rnd=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>v<a?a:v>b?b:v,bp=(f,d,t,v)=>{try{beep(f,d,t||'square',v||.04)}catch(e){}};
const CK={book:{},left:[],xp:0,dishes:0};window.KITCHEN=CK;
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.kitchen=CK;return o};cozyLoad=function(z){l0(z);if(z&&z.kitchen){Object.assign(CK,z.kitchen);CK.book=Object.assign({},z.kitchen.book||{});CK.left=(z.kitchen.left||[]).slice()}}}

/* ------------------------------------------------------------------ ingredients
   t: what kind of thing it is · c: needs cooking to be safe/nice · ch: can be chopped · f/e: food and energy · p: COZCO price */
const ING={
 egg:{n:'EGG',i:'🥚',t:'egg',c:1,f:8,e:3,p:1},milk:{n:'MILK',i:'🥛',t:'dairy',f:4,e:2,p:1},cheese:{n:'CHEESE',i:'🧀',t:'dairy',ch:1,f:8,e:2,p:2},butter:{n:'BUTTER',i:'🧈',t:'fat',f:3,e:1,p:1},
 bacon:{n:'BACON',i:'🥓',t:'meat',c:1,ch:1,f:12,e:3,p:2},sausage:{n:'SAUSAGES',i:'🌭',t:'meat',c:1,ch:1,f:14,e:3,p:2},chicken:{n:'CHICKEN',i:'🍗',t:'meat',c:1,ch:1,f:20,e:5,p:4},mince:{n:'BEEF MINCE',i:'🥩',t:'meat',c:1,f:18,e:4,p:3},
 cod:{n:'COD FILLET',i:'🐟',t:'fish',c:1,f:16,e:4,p:3},roach:{n:'ROACH',i:'🐟',t:'fish',c:1,f:12,e:3},perch:{n:'PERCH',i:'🐟',t:'fish',c:1,f:13,e:3},trout:{n:'TROUT',i:'🐟',t:'fish',c:1,f:16,e:4},pike:{n:'PIKE',i:'🐟',t:'fish',c:1,f:18,e:4},carp:{n:'GOLDEN CARP',i:'🐠',t:'fish',c:1,f:30,e:12},
 potato:{n:'POTATO',i:'🥔',t:'veg',c:1,ch:1,f:12,e:4,p:1},carrot:{n:'CARROT',i:'🥕',t:'veg',ch:1,f:6,e:2,p:1},tomato:{n:'TOMATO',i:'🍅',t:'veg',ch:1,f:5,e:2,p:1},onion:{n:'ONION',i:'🧅',t:'veg',ch:1,f:3,e:1,p:1},
 mushroom:{n:'MUSHROOMS',i:'🍄',t:'veg',ch:1,f:4,e:1,p:1},pepper:{n:'RED PEPPER',i:'🫑',t:'veg',ch:1,f:4,e:2,p:1},lettuce:{n:'LETTUCE',i:'🥬',t:'veg',ch:1,f:3,e:1,p:1},pumpkin:{n:'PUMPKIN',i:'🎃',t:'veg',c:1,ch:1,f:14,e:4},
 apple:{n:'APPLE',i:'🍎',t:'fruit',ch:1,f:5,e:3,p:1},lemon:{n:'LEMON',i:'🍋',t:'fruit',ch:1,f:1,e:1,p:1},
 flour:{n:'FLOUR',i:'🌾',t:'dry',c:1,f:8,e:3},sugar:{n:'SUGAR',i:'🍬',t:'sweet',f:3,e:6},rice:{n:'RICE',i:'🍚',t:'grain',c:1,f:14,e:4},pasta:{n:'PASTA',i:'🍝',t:'grain',c:1,f:14,e:4},
 bread:{n:'BREAD',i:'🍞',t:'bread',f:10,e:3},oil:{n:'OLIVE OIL',i:'🫒',t:'fat',f:1,e:0},beans:{n:'BAKED BEANS',i:'🥫',t:'veg',f:10,e:3},oats:{n:'OATS',i:'🥣',t:'grain',c:1,f:10,e:6},choc:{n:'CHOCOLATE',i:'🍫',t:'sweet',ch:1,f:6,e:8},
 salt:{n:'SALT',i:'🧂',t:'spice',f:0,e:0},bpep:{n:'BLACK PEPPER',i:'⚫',t:'spice',f:0,e:0},herbs:{n:'HERBS',i:'🌿',t:'spice',f:0,e:0},chilli:{n:'CHILLI',i:'🌶',t:'spice',f:0,e:1},curry:{n:'CURRY POWDER',i:'🟠',t:'spice',f:0,e:1}};
const FRIDGE=['egg','milk','cheese','butter','bacon','sausage','chicken','mince','cod','potato','carrot','tomato','onion','mushroom','pepper','lettuce','apple','lemon','pumpkin','roach','perch','trout','pike','carp'];
const PANTRY=['flour','sugar','rice','pasta','bread','oil','beans','oats','choc'],SPICE=['salt','bpep','herbs','chilli','curry'];
const PANS={fry:{n:'FRYING PAN',i:'🍳'},sauce:{n:'SAUCEPAN',i:'🥘'},wok:{n:'WOK',i:'🥢'},tin:{n:'ROASTING TIN',i:'▭'},dish:{n:'BAKING DISH',i:'🥧'}};
const inv=k=>(INV&&INV[k])|0,FREE=new Set([...PANTRY,...SPICE]);
const mkItem=k=>({k,cut:0,cook:0,m:{},stick:0});
const nameOf=it=>it.k==='mix'?it.mixName:(it.cut?'CHOPPED ':'')+ING[it.k].n;
const iconOf=it=>it.k==='mix'?it.mixIcon:it.k==='egg'&&it.cook>.5?'🍳':it.k==='potato'&&it.cut&&it.m.fry>.5?'🍟':it.k==='bread'&&it.cook>.5?'🥪':ING[it.k].i;

/* ------------------------------------------------------------------ the dish judge */
const has=(L,k)=>L.some(x=>x.k===k);
function judge(items){/* flatten mixtures: their parts take the mixture's cooking */const L=[];for(const it of items){if(it.k==='mix')for(const p of it.parts)L.push(Object.assign({},p,{cook:it.cook,m:Object.assign({},p.m,it.m),mixed:1}));else L.push(it)}
 if(!L.length)return null;const K=new Set(L.map(x=>x.k)),cnt=f=>L.filter(f).length,T=k=>ING[k].t;
 const meth={};for(const x of L){for(const m in x.m)if(x.m[m]>.3)meth[m]=(meth[m]||0)+x.m[m]}const M=Object.keys(meth).sort((a,b)=>meth[b]-meth[a])[0]||'raw';
 const did=(k,m)=>L.some(x=>x.k===k&&x.m[m]>.3),cooked=k=>L.some(x=>x.k===k&&x.cook>.6);
 const meats=[...K].filter(k=>T(k)==='meat'),fish=[...K].filter(k=>T(k)==='fish'),veg=[...K].filter(k=>T(k)==='veg'&&k!=='beans');
 const cap=s=>s.charAt(0)+s.slice(1).toLowerCase(),list=a=>{a=a.map(k=>cap(ING[k].n.replace('BEEF ','').replace(' FILLET','')));return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' & '+a.at(-1)};
 const mainMeat=meats[0]||fish[0];let name=null,special=0;
 const sp=(n)=>{name=n;special=1};
 if(K.has('egg')&&K.has('flour')&&K.has('milk')&&(M==='fry'))sp('Pancakes'+(K.has('lemon')||K.has('sugar')?' with Lemon & Sugar':K.has('choc')?' with Chocolate':''));
 else if(K.has('egg')&&K.has('flour')&&K.has('sugar')&&M==='bake')sp(K.has('choc')?'Chocolate Cake':'Victoria Sponge');
 else if(K.has('flour')&&(K.has('butter')||K.has('oil'))&&M==='bake'&&(K.has('pumpkin')||K.has('apple')||mainMeat))sp(K.has('pumpkin')?'Pumpkin Pie':K.has('apple')?'Apple Pie':cap(ING[mainMeat].n.replace('BEEF ',''))+' Pie');
 else if(K.has('oats')&&K.has('milk')&&M==='boil')sp('Porridge'+(K.has('sugar')||K.has('choc')?' with a Sweet Topping':''));
 else if(K.has('egg')&&L.some(x=>x.k==='egg'&&x.mixed)&&(M==='fry'||M==='wok')&&!K.has('flour')){const ex=[...K].filter(k=>!['egg','milk','salt','bpep','herbs','butter','oil'].includes(k));sp(L.some(x=>x.scr)?'Scrambled Eggs'+(K.has('bread')?' on Toast':''):(ex.length?list(ex)+' ':'')+'Omelette')}
 else if(['egg','bacon','sausage','beans','mushroom','tomato','bread'].filter(k=>K.has(k)).length>=4&&(M==='fry'||M==='boil'))sp('Full English Breakfast');
 else if(fish.length&&K.has('potato')&&did('potato','fry')&&L.some(x=>x.k==='potato'&&x.cut))sp('Fish & Chips');
 else if(K.has('pasta')&&did('pasta','boil')){if(K.has('mince')&&K.has('tomato'))sp('Spaghetti Bolognese');else if(K.has('cheese')&&K.has('milk'))sp('Macaroni Cheese');else{const ex=[...K].filter(k=>!['pasta','salt','bpep','herbs','oil','butter'].includes(k));name='Pasta'+(ex.length?' with '+list(ex):'');special=ex.length>=2?1:0}}
 else if(K.has('rice')&&did('rice','boil')&&K.has('curry'))sp((mainMeat?cap(ING[mainMeat].n.replace('BEEF ','')):'Vegetable')+' Curry with Rice');
 else if(K.has('rice')&&K.has('egg')&&(M==='wok'||M==='fry'))sp('Egg Fried Rice');
 else if(K.has('beans')&&K.has('bread'))sp('Beans on Toast');
 else if(K.has('cheese')&&K.has('bread')&&(M==='fry'||M==='bake'))sp('Cheese Toastie');
 else if(K.has('bread')&&M==='raw'&&K.size>=2){const ex=[...K].filter(k=>k!=='bread'&&T(k)!=='spice'&&T(k)!=='fat');name=list(ex)+' Sandwich';special=1}
 else if(M==='wok'&&(meats.length||veg.length>=2))sp((K.has('chilli')?'Spicy ':'')+(mainMeat?cap(ING[mainMeat].n.replace('BEEF ','')):'Vegetable')+' Stir-Fry');
 else if(M==='roast'&&mainMeat)sp('Roast '+cap(ING[mainMeat].n.replace('BEEF ','').replace(' FILLET',''))+(veg.length?' with '+list(veg):''));
 else if(M==='roast'&&veg.length)sp('Roast '+(veg.length>1?'Vegetables':cap(ING[veg[0]].n)));
 else if(M==='boil'&&veg.length>=2&&!K.has('pasta')&&!K.has('rice'))sp(list(veg)+' Soup');
 else if(M==='boil'&&K.has('pumpkin'))sp('Pumpkin Soup');
 else if(K.has('potato')&&did('potato','fry')&&L.some(x=>x.k==='potato'&&x.cut))sp('Chips');
 else if(M==='raw'&&veg.length>=2&&L.filter(x=>T(x.k)==='veg').every(x=>x.cut))sp((K.has('cheese')?'Cheese ':'')+'Salad');
 else if(K.size===1&&K.has('egg')&&M==='fry')sp('Fried Egg');
 if(!name){const word={fry:'Fried',boil:'Boiled',roast:'Roast',bake:'Baked',wok:'Stir-fried',raw:'Raw'}[M];const main=[...K].filter(k=>T(k)!=='spice'&&T(k)!=='fat');name=word+' '+list(main.length?main:[...K])}
 /* how well it went */let s=3,notes=[],raw=0,burnt=0,perfect=0,danger=0;
 for(const x of L){const g=ING[x.k];if(T(x.k)==='spice'||T(x.k)==='fat')continue;const ck=x.cook;
  if(g.c&&ck<.65){raw++;if(T(x.k)==='meat'||T(x.k)==='fish'||x.k==='egg')danger=1}else if(ck>1.45)burnt++;else if(g.c&&ck>=.85&&ck<=1.25)perfect++}
 if(raw){s-=1.5*Math.min(2,raw);const rw=L.find(x=>ING[x.k].c&&x.cook<.65);notes.push(raw>1?'some of it is still raw':'the '+ING[rw.k].n.toLowerCase()+' is underdone')}
 if(burnt){s-=1.2*Math.min(2,burnt);notes.push(burnt>1?'it\'s burnt':'a bit burnt')}
 if(perfect){s+=Math.min(1,perfect*.35);notes.push('cooked just right')}
 const seas=['salt','bpep','herbs','chilli','curry'].filter(k=>K.has(k)).length;if(seas){s+=Math.min(1,seas*.5);notes.push('nicely seasoned')}else if(M!=='raw'&&!K.has('sugar'))s-=.3;
 if(special){s+=.8}if(K.size>=4)s+=.4;if(L.filter(x=>ING[x.k].ch&&x.cut&&T(x.k)==='veg').length>=2)s+=.3;
 const stars=Math.round(cl(s,1,5));let food=0,en=0;for(const x of L){food+=ING[x.k].f;en+=ING[x.k].e}const q=.55+stars*.12;
 return{name,stars,food:Math.round(Math.min(95,food*q)),en:Math.round(Math.min(40,en*q)),notes,danger,special,M}}

/* ------------------------------------------------------------------ the kitchen in 3D
   A little fitted kitchen built off-map, lit with baked shading like the rest of the game. Tap things in it. */
const K0=new THREE.Vector3(7000,600,800),LDIR=new THREE.Vector3(.35,.85,.55).normalize();
const VC=new THREE.MeshBasicMaterial({vertexColors:true}),VCB=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide}),VCD=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide});
const HM=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,colorWrite:false});
function M(par,g,col,x,y,z,o){o=o||{};const c=new THREE.Color(col),n=g.attributes.normal,a=new Float32Array(n.count*3),f=o.flip?-1:1,am=o.amb==null?.58:o.amb;
 for(let i=0;i<n.count;i++){const d=f*(n.getX(i)*LDIR.x+n.getY(i)*LDIR.y+n.getZ(i)*LDIR.z),s=Math.min(1.05,am+.45*Math.max(0,d));a[i*3]=c.r*s;a[i*3+1]=c.g*s;a[i*3+2]=c.b*s}
 g.setAttribute('color',new THREE.BufferAttribute(a,3));const m=new THREE.Mesh(g,o.mat||(o.flip?VCB:VC));m.position.set(x,y,z);par.add(m);return m}
const B=(par,x,y,z,w,h,d,col,o)=>M(par,new THREE.BoxGeometry(w,h,d),col,x,y,z,o);
const C=(par,x,y,z,rt,rb,h,col,o)=>M(par,new THREE.CylinderGeometry(rt,rb,h,(o&&o.seg)||20,1,!!(o&&o.open)),col,x,y,z,o);
const ctex=(w,h,fn,rep)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1])}t._cv=c;return t};
const TP=(par,x,y,z,w,h,tex,o)=>{o=o||{};const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),o.mat||new THREE.MeshBasicMaterial({map:tex,transparent:!!o.tr,side:o.ds?THREE.DoubleSide:THREE.FrontSide}));m.position.set(x,y,z);if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;par.add(m);return m};
const hit=(par,x,y,z,w,h,d,t,i)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),HM);m.position.set(x,y,z);m.userData.h={t,i};par.add(m);return m};
const ET={},etex=i=>ET[i]||(ET[i]=ctex(96,96,g=>{g.font='74px serif';g.textAlign='center';g.textBaseline='middle';g.fillText(i,48,54)}));
const doorTex=(col,label,hx)=>ctex(256,256,(g,w,h)=>{g.fillStyle=col;g.fillRect(0,0,w,h);g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=6;g.strokeRect(22,22,w-44,h-44);g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=2;g.strokeRect(30,30,w-60,h-60);
 g.fillStyle='#b8a888';if(hx!=null)g.fillRect(hx,96,12,64);if(label){g.fillStyle='rgba(40,28,18,.85)';g.font='bold 30px ui-monospace,monospace';g.textAlign='center';g.fillText(label,w/2,h/2+10)}});
function labelS(par,x,y,z,txt,sc){const t=ctex(256,64,()=>{});const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));s.scale.set(.26*(sc||1),.065*(sc||1),1);s.position.set(x,y,z);s.renderOrder=5;par.add(s);
 s.userData.set=v=>{if(s.userData.v===v)return;s.userData.v=v;const g=t._cv.getContext('2d');g.clearRect(0,0,256,64);g.fillStyle='rgba(20,14,10,.62)';g.beginPath();g.roundRect?g.roundRect(4,8,248,48,14):g.rect(4,8,248,48);g.fill();g.fillStyle='#fff';g.font='bold '+(v.length>11?22:28)+'px ui-monospace,monospace';g.textAlign='center';g.textBaseline='middle';g.fillText(v,128,33);t.needsUpdate=true};s.userData.set(txt);return s}
function shell(par,cx,cy,cz,w,h,d,col,colIn){const t=.025;B(par,cx,cy,cz-d/2+t/2,w,h,t,colIn);B(par,cx-w/2+t/2,cy,cz,t,h,d,col);B(par,cx+w/2-t/2,cy,cz,t,h,d,col);B(par,cx,cy+h/2-t/2,cz,w,t,d,col);B(par,cx,cy-h/2+t/2,cz,w,t,d,col)}
const RP=[[.93,-.5],[1.27,-.5],[.93,-.2],[1.27,-.2]],KX=[.82,.96,1.1,1.24,1.4];
let K=null;
function build3d(){const G=new THREE.Group();G.position.copy(K0);scene.add(G);const k={G,hits:[],ring:[],tubs:[]};const H=(...a)=>{const m=hit(...a);k.hits.push(m);return m};
 /* the room */B(G,.4,1.35,1.35,6.2,2.7,4.2,0xf0e2c8,{flip:1,amb:.7});
 TP(G,.4,.003,1.35,6.2,4.2,ctex(128,128,(g)=>{for(let i=0;i<2;i++)for(let j=0;j<2;j++){g.fillStyle=(i+j)%2?'#c8b49a':'#8a5a3a';g.fillRect(i*64,j*64,64,64)}g.strokeStyle='rgba(0,0,0,.18)';g.strokeRect(0,0,128,128)},[12,8]),{rx:-Math.PI/2});
 TP(G,.4,1.12,-.693,5.2,.5,ctex(128,64,(g)=>{g.fillStyle='#d8dcd8';g.fillRect(0,0,128,64);g.fillStyle='#f6f6f2';for(let r=0;r<2;r++)for(let c=-1;c<3;c++)g.fillRect(c*64+(r?32:0)+3,r*32+3,58,26)},[20,4]));
 /* a window on the left wall */TP(G,-2.79,1.45,.6,1.0,.8,ctex(128,96,(g)=>{const gr=g.createLinearGradient(0,0,0,96);gr.addColorStop(0,'#8ac4ec');gr.addColorStop(1,'#d8eef8');g.fillStyle=gr;g.fillRect(0,0,128,96);g.fillStyle='#6aa860';g.fillRect(0,70,128,26);g.fillStyle='#fff';g.fillRect(0,0,128,6);g.fillRect(0,90,128,6);g.fillRect(0,0,6,96);g.fillRect(122,0,6,96);g.fillRect(61,0,6,96);g.fillRect(0,45,128,5)}),{ry:Math.PI/2});
 /* base units, split round the oven */B(G,-.315,.47,-.36,2.07,.78,.6,0xe9dfc8);B(G,1.965,.47,-.36,.97,.78,.6,0xe9dfc8);B(G,.55,.04,-.38,3.8,.08,.56,0x3a3028);
 B(G,.55,.88,-.355,3.84,.04,.66,0x6b4a32);B(G,.55,.862,-.022,3.84,.008,.01,0x4a3020);
 for(const[x,w]of[[-1.05,.58],[-.4,.68],[.33,.68],[1.72,.46],[2.2,.46]])TP(G,x,.47,-.058,w-.02,.74,doorTex('#e4d8be',null,x>1.5?118:x<0?210:34));
 /* the oven, under the hob */B(G,1.1,.79,-.36,.76,.14,.6,0x2c2c30);B(G,1.1,.1,-.36,.76,.04,.6,0x2c2c30);B(G,.735,.43,-.36,.03,.62,.6,0x2c2c30);B(G,1.465,.43,-.36,.03,.62,.6,0x2c2c30);
 B(G,1.1,.43,-.37,.7,.62,.58,0x1a1a1e,{flip:1,amb:.5});k.glow=TP(G,1.1,.42,-.655,.64,.56,null,{mat:new THREE.MeshBasicMaterial({color:0x202024})});B(G,1.1,.27,-.37,.66,.01,.5,0x9a9aa2);
 k.ctrl=ctex(512,84,()=>{});TP(G,1.1,.79,-.058,.74,.12,k.ctrl);
 for(let i=0;i<5;i++)H(G,KX[i],.79,-.05,.13,.13,.06,i<4?'knob':'oknob',i);
 const DO=new THREE.Group();DO.position.set(1.1,.12,-.05);G.add(DO);k.doorO=DO;
 B(DO,0,.04,0,.72,.08,.03,0x34343a);B(DO,0,.535,0,.72,.07,.03,0x34343a);B(DO,-.33,.29,0,.06,.42,.03,0x34343a);B(DO,.33,.29,0,.06,.42,.03,0x34343a);
 TP(DO,0,.29,.005,.6,.42,null,{mat:new THREE.MeshBasicMaterial({color:0x101014,transparent:true,opacity:.42,side:THREE.DoubleSide,depthWrite:false})});B(DO,0,.5,.045,.5,.022,.022,0xc8c8d0);
 H(DO,0,.5,.05,.62,.1,.08,'odoor');H(G,1.1,.42,-.12,.66,.56,.06,'oven');
 /* the hob */B(G,1.1,.905,-.355,.72,.012,.58,0x141418);for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.RingGeometry(.062,.09,32).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x48484e}));r.position.set(RP[i][0],.913,RP[i][1]);G.add(r);k.ring.push(r);
  const r2=new THREE.Mesh(new THREE.RingGeometry(.028,.04,24).rotateX(-Math.PI/2),r.material);r2.position.copy(r.position);G.add(r2);H(G,RP[i][0],.95,RP[i][1],.32,.12,.28,'hob',i)}
 for(let i=0;i<4;i++)labelS(G,RP[i][0]-.12,.93,RP[i][1]+.08,String(i+1),.5);
 B(G,1.1,1.5,-.5,.74,.12,.36,0xb8bcc4);B(G,1.1,2.1,-.6,.26,1.1,.18,0xb0b4bc);
 /* fridge: a tall one, door hinged on the left */shell(G,-1.73,.98,-.375,.66,1.96,.63,0xdfe4ea,0xf2f6fa);for(const y of[.45,.9,1.35])B(G,-1.73,y,-.4,.6,.015,.52,0xe8f0f8,{amb:.8});
 B(G,-1.9,.5,-.45,.1,.18,.07,0xffffff);B(G,-1.62,.96,-.45,.16,.08,.11,0xe8d090);C(G,-1.85,1.0,-.45,.03,.03,.16,0xc84a3a);B(G,-1.6,1.44,-.45,.2,.1,.14,0x6a9a5a);
 const DF=new THREE.Group();DF.position.set(-2.06,0,-.055);G.add(DF);k.doorF=DF;B(DF,.33,.98,0,.65,1.94,.04,0xe8ecf0);B(DF,.33,1.36,.022,.62,.006,.003,0xb8bcc4);B(DF,.58,1.12,.04,.025,.46,.025,0xa0a4ac);
 TP(DF,.3,1.62,.022,.22,.1,ctex(128,64,(g)=>{g.fillStyle='#ffd040';g.fillRect(0,0,128,64);g.fillStyle='#3a2a10';g.font='bold 30px ui-monospace,monospace';g.textAlign='center';g.fillText('FRIDGE',64,43)}));
 TP(DF,.2,1.2,.022,.12,.14,ctex(64,80,(g)=>{g.fillStyle='#fff';g.fillRect(0,0,64,80);g.fillStyle='#e04040';g.font='bold 12px monospace';g.fillText('MILK',6,20);g.fillText('EGGS',6,38);g.fillText('???',6,56)}));
 H(G,-1.73,1.0,-.05,.68,1.95,.12,'fridge');
 /* wall cupboards */const wallC=(cx,w,lab,col,kind,inner)=>{shell(G,cx,1.625,-.53,w,.55,.32,0xe4d8be,0xb89a70);B(G,cx,1.56,-.55,w-.06,.012,.26,0xc8aa80);if(inner)inner(cx);
  const D=new THREE.Group();D.position.set(cx-w/2,1.625,-.365);G.add(D);TP(D,w/2,0,0,w-.01,.54,doorTex('#e8dcc2',lab,lab?200:200),{ds:1});H(G,cx,1.625,-.36,w,.56,.08,kind);return D};
 k.doorP=wallC(-1.01,.64,'PANTRY','#e8dcc2','pantry',cx=>{for(let i=0;i<4;i++)C(G,cx-.2+i*.13,1.43,-.55,.035,.035,.12,[0xc84a3a,0xe8c84a,0x4a8ac8,0xd8d8d0][i]);B(G,cx,1.68,-.55,.3,.18,.12,0xd8b878)});
 k.doorPan=wallC(-.33,.64,'PANS','#e8dcc2','pans',cx=>{C(G,cx-.12,1.45,-.55,.1,.09,.06,0x2a2a30);C(G,cx+.14,1.47,-.55,.08,.08,.1,0xa8aeb6);C(G,cx,1.65,-.55,.12,.06,.06,0x2a2a2e)});
 wallC(2.0,.9,null,'#e8dcc2','decor');
 /* spice rack: open shelves */B(G,.35,1.62,-.675,.62,.52,.025,0x8a5a32);for(const y of[1.42,1.66]){B(G,.35,y,-.6,.62,.02,.16,0x7a4a2a);for(let i=0;i<5;i++){C(G,.13+i*.11,y+.05,-.6,.025,.025,.08,[0xd85a2a,0x2a2a2a,0x5aa04a,0xd02020,0xe0a020][i]);C(G,.13+i*.11,y+.095,-.6,.027,.027,.015,0x2a2a2a)}}
 labelS(G,.35,1.94,-.6,'SPICE RACK',1.6);H(G,.35,1.6,-.55,.62,.52,.2,'spice');
 /* board, bowl, sink, plate, leftovers, bin, the note on the wall */
 B(G,-1.02,.912,-.33,.44,.022,.28,0xd8b07a);B(G,-.72,.905,-.15,.18,.006,.03,0xc0c4cc);B(G,-.6,.908,-.15,.08,.014,.03,0x2a2a2a);H(G,-1.02,.95,-.33,.5,.1,.34,'board');
 M(G,new THREE.SphereGeometry(.13,24,10,0,Math.PI*2,Math.PI/2,Math.PI/2),0xe6eef6,-.42,1.03,-.33,{mat:VCD});H(G,-.42,.98,-.33,.32,.16,.32,'bowl');
 B(G,.33,.903,-.36,.52,.008,.4,0xb4bac2);TP(G,.33,.908,-.36,.42,.3,null,{rx:-Math.PI/2,mat:new THREE.MeshBasicMaterial({color:0x6a7078})});C(G,.33,1.0,-.62,.018,.018,.2,0xc8ccd4);B(G,.33,1.1,-.55,.03,.03,.16,0xc8ccd4);H(G,.33,.95,-.36,.52,.1,.4,'sink');
 C(G,1.86,.908,-.34,.15,.12,.016,0xffffff,{seg:32,amb:.8});C(G,1.86,.917,-.34,.1,.1,.002,0xeeeae4,{seg:32,amb:.85});H(G,1.86,.94,-.34,.36,.08,.36,'plate');
 for(let i=0;i<6;i++){const t=new THREE.Group();t.position.set(2.27,.9+i*.068,-.42);G.add(t);B(t,0,.028,0,.17,.056,.13,0xcfe0e8,{amb:.75});B(t,0,.062,0,.18,.012,.14,[0x4a8ad0,0xd05a4a,0x5aa05a][i%3]);k.tubs.push(t)}H(G,2.27,1.05,-.42,.3,.35,.3,'left');
 C(G,2.78,.3,-.3,.17,.15,.6,0xb8bcc4);C(G,2.78,.615,-.3,.175,.175,.03,0x9aa0a8);B(G,2.78,.03,-.12,.1,.02,.06,0x555);H(G,2.78,.35,-.3,.4,.7,.4,'bin');
 B(G,.33,1.13,-.684,.36,.22,.02,0xb08a5a);TP(G,.33,1.13,-.672,.3,.17,ctex(160,96,(g)=>{g.fillStyle='#fffbe8';g.fillRect(0,0,160,96);g.fillStyle='#d03030';g.beginPath();g.arc(80,8,5,0,7);g.fill();g.fillStyle='#2a2a6a';g.font='bold 15px ui-monospace,monospace';g.textAlign='center';g.fillText('NO RECIPES.',80,36);g.fillText('JUST COOK!',80,58);g.font='12px ui-monospace,monospace';g.fillText('(tap for help)',80,82)}));H(G,.33,1.13,-.66,.36,.22,.05,'help');
 const L=(x,t,z)=>labelS(G,x,.95,z==null?-.0:z,t,1.9);L(-1.02,'CHOPPING BOARD');L(-.42,'MIXING BOWL');L(.33,'SINK');L(1.86,'PLATE');k.leftL=labelS(G,2.27,1.24,-.38,'LEFTOVERS',1.5);labelS(G,2.78,.74,-.3,'BIN',.9);
 /* the "you are here" marker */k.mark=new THREE.Mesh(new THREE.ConeGeometry(.03,.07,12).rotateX(Math.PI),new THREE.MeshBasicMaterial({color:0xffd040}));k.mark.renderOrder=6;G.add(k.mark);
 G.visible=false;return k}
const POS={board:[-1.02,.925,-.33,.1,.11],bowl:[-.42,1.0,-.33,.06,.08],plate:[1.86,.925,-.34,.08,.085],sink:[.33,.92,-.36],oven:[1.1,.28,-.38],left:[2.27,1.0,-.42],bin:[2.78,.65,-.3],fridge:[-1.73,1.2,-.05],pantry:[-1.01,1.95,-.4],pans:[-.33,1.95,-.4],spice:[.35,1.95,-.55]};
const tgtPos=s=>s.t==='hob'?[RP[s.i][0],.92,RP[s.i][1]]:POS[s.t];
/* a pan you can see */
function mkPan(k){const g=new THREE.Group();let top=.04,r=.07;
 if(k==='fry'){C(g,0,.018,0,.12,.1,.035,0x2a2a30,{seg:24});B(g,.21,.032,0,.18,.016,.03,0x1a1a1e);top=.037}
 if(k==='sauce'){C(g,0,.06,0,.1,.1,.12,0xa8aeb6,{open:1,mat:VCD,seg:24});C(g,0,.003,0,.1,.1,.006,0x6a6e76);B(g,.2,.11,0,.2,.016,.03,0x222226);top=.1;r=.055}
 if(k==='wok'){C(g,0,.04,0,.16,.07,.08,0x2a2a2e,{open:1,mat:VCD,seg:24});C(g,0,.003,0,.07,.07,.006,0x222226);B(g,.26,.075,0,.2,.018,.03,0x6a4a2a);top=.06;r=.08}
 if(k==='tin'){B(g,0,.025,0,.32,.05,.22,0x9aa0a8);top=.052;r=.1}
 if(k==='dish'){B(g,0,.03,0,.26,.06,.19,0xf2e6d0);top=.062;r=.08}
 const sf=new THREE.Mesh(k==='tin'||k==='dish'?new THREE.PlaneGeometry(k==='tin'?.29:.23,k==='tin'?.19:.16):new THREE.CircleGeometry(k==='wok'?.14:k==='sauce'?.095:.105,24),new THREE.MeshBasicMaterial({color:k==='dish'?0xd8c4a4:0x3a3a42,transparent:true,opacity:1}));
 sf.rotation.x=-Math.PI/2;sf.position.y=top+.001;g.add(sf);g.userData={sf,top,r,k};return g}
function open(){const A=window.MARLOWE5;if(!A)return;if(!K)K=build3d();
 if(!A.actStart('kitchen',{fov:55,fog:40},1))return;const ACT=A.ACT;K.G.visible=true;
 if(!document.getElementById('kit3dcss')){const st=document.createElement('style');st.id='kit3dcss';st.textContent='body.kit3d #hud,body.kit3d #pad,body.kit3d #pedals,body.kit3d #top,body.kit3d #topbtns,body.kit3d #mm,body.kit3d #bUse,body.kit3d #speed,body.kit3d #hnhud,body.kit3d #jobhud,body.kit3d #crDis,body.kit3d .fpsd{visibility:hidden!important}body.kit3d #toast{visibility:visible!important}';document.head.appendChild(st)}
 document.body.classList.add('kit3d');const ah=[...document.body.children].find(e=>e.style.zIndex==='70'&&e.style.inset==='0px');if(ah)ah.style.visibility='hidden';
 const S={hand:null,board:null,chop:0,bowl:[],bowlMix:0,hob:[{pan:null,h:0},{pan:null,h:0},{pan:null,h:0},{pan:null,h:0}],oven:{pan:null,h:0,door:0},plate:[],sel:null,panel:null,t:0,fx:[],msg:''};
 /* the screen: a message at the top, buttons at the bottom, tap the kitchen itself */
 const ui=document.createElement('div');ui.className='kitchen3d';ui.style.cssText='position:fixed;inset:0;z-index:69;touch-action:none;user-select:none;-webkit-user-select:none';document.body.appendChild(ui);
 const info=document.createElement('div');info.style.cssText='position:absolute;left:50%;top:10px;transform:translateX(-50%);width:max-content;max-width:min(620px,78vw);background:rgba(24,16,10,.86);border:2px solid #f5e6a0;border-radius:12px;padding:7px 12px;font:12px/1.45 ui-monospace,monospace;color:#fff;pointer-events:none;text-align:center';ui.appendChild(info);
 const bar=document.createElement('div');bar.style.cssText='position:absolute;left:0;right:0;bottom:10px;display:flex;flex-wrap:wrap;justify-content:center;gap:6px;padding:0 8px;pointer-events:none;max-height:46vh;overflow:hidden';ui.appendChild(bar);
 const bst='pointer-events:auto;font:bold 12px ui-monospace,monospace;padding:8px 10px;border:2px solid #f5e6a0;border-radius:10px;color:#fff;cursor:pointer;touch-action:manipulation';
 const lv=document.createElement('button');lv.textContent='LEAVE';lv.style.cssText=bst+';position:absolute;right:10px;top:10px;background:#3a2a1a';lv.onclick=()=>A.actEnd();ui.appendChild(lv);
 for(const d of[-1,1]){const b=document.createElement('button');b.textContent=d<0?'◀':'▶';b.className='kpan';b.style.cssText=bst+';position:absolute;top:50%;'+(d<0?'left':'right')+':6px;background:#3a2a1acc;padding:14px 10px;font-size:16px';b.onclick=e=>{e.stopPropagation();camX+=d*hw*.9};ui.appendChild(b)}
 const O={msg:h=>{info.innerHTML='<b style="color:#ffd870">🍳 YOUR KITCHEN</b><br>'+h},btn:(l,fn,col)=>{const b=document.createElement('button');b.innerHTML=l;b.style.cssText=bst+';background:'+(col||'#333')+'dd';b.onclick=e=>{e.stopPropagation();fn()};bar.appendChild(b);return b},clear:()=>{bar.innerHTML=''},close:()=>A.actEnd()};
 const say=t=>{S.msg=t;O.msg(t)};const hint=()=>say(S.hand?'Holding: <b>'+(S.hand.pan?PANS[S.hand.pan.k].n+(S.hand.pan.items.length?' ('+S.hand.pan.items.length+' things in it)':''):S.hand.bowl?'THE BOWL':nameOf(S.hand))+'</b>. Tap where it goes (or the bin).':'Tap a cupboard to take something out. Tap a pan, the board or the bowl to work with it.');
 const take=x=>{if(S.hand){say('Your hands are full. Put that down first.');return false}S.hand=x;bp(520,.03);hint();return true};
 function panel(kind){S.panel=kind;O.clear();const add=(k,label,fn,col)=>O.btn(label,fn,col);
  if(kind==='fridge'){for(const k of FRIDGE){const n=inv(k),g_=ING[k];if(n>0)add(k,g_.i+' '+g_.n+' ×'+n,()=>{INV[k]--;take(mkItem(k));closeP()},'#2a5a3a');else if(g_.p)add(k,g_.i+' '+g_.n+' · £'+g_.p,()=>{if(cash<g_.p)return say('NOT ENOUGH CASH');cash-=g_.p;try{cashUI()}catch(e){}take(mkItem(k));closeP()},'#3a3a4a')}say('THE FRIDGE. Green: yours (from the farm, the garden and fishing). Grey: a COZCO delivery, at the price shown.')}
  if(kind==='pantry'){for(const k of PANTRY)add(k,ING[k].i+' '+ING[k].n,()=>{take(mkItem(k));closeP()},'#6a4a1a');say('THE PANTRY. Always stocked.')}
  if(kind==='spice'){for(const k of SPICE)add(k,ING[k].i+' '+ING[k].n,()=>{take(mkItem(k));closeP()},'#6a2a1a');say('THE SPICE RACK. Add a pinch to a pan, the bowl or the plate.')}
  if(kind==='pans'){for(const k in PANS)add(k,PANS[k].i+' '+PANS[k].n,()=>{take({pan:{k,items:[],water:0,oil:0,stir:0,stirs:0}});closeP()},'#4a4a5a');say('THE PAN CUPBOARD. Frying pan and wok for frying, saucepan for boiling (fill it at the sink), tin and dish for the oven.')}
  if(kind==='left'){if(!CK.left.length)say('No leftovers. Cook something and save some for later.');for(let i=0;i<CK.left.length;i++){const d=CK.left[i];add('l'+i,'🍱 '+d.name+' '+'★'.repeat(d.stars),()=>{CK.left.splice(i,1);try{fed(d.food,d.en,'🍱 LEFTOVER '+d.name.toUpperCase()+' · FOOD +'+d.food)}catch(e){toast('YOU EAT THE LEFTOVERS')}O.close()},'#2a4a6a')}if(CK.left.length)say('LEFTOVERS. Tap one to eat it now.')}
  add('x','✕ CLOSE',closeP,'#333')}
 const closeP=()=>{S.panel=null;O.clear();if(S.sel)selBtns();else hint()};
 /* what you can do with the thing you tapped */
 function selBtns(){O.clear();const s=S.sel;if(!s)return hint();
  if(s.t==='board'){if(S.board){if(ING[S.board.k]&&ING[S.board.k].ch&&!S.board.cut)O.btn('🔪 CHOP',()=>{chop()},'#8a2a1a');O.btn('PICK IT UP',()=>{if(take(S.board)){S.board=null;S.chop=0;S.sel=null;O.clear()}},'#2a5a8a')}say(S.board?nameOf(S.board)+' on the board.'+(ING[S.board.k]&&ING[S.board.k].ch&&!S.board.cut?' Tap CHOP (or tap the board) a few times.':''):'The chopping board is empty. Put something on it.')}
  if(s.t==='bowl'){if(S.bowl.length){if(S.bowl.length&&!S.bowlMixed)O.btn('🥄 WHISK / MIX',()=>whisk(),'#8a6a1a');O.btn('PICK UP THE BOWL',()=>{if(take(S.bowlMixed?S.bowl[0]:{bowl:S.bowl.slice()})){S.bowl=[];S.bowlMix=0;S.bowlMixed=0;S.sel=null;O.clear()}},'#2a5a8a')}say(S.bowl.length?'The bowl: '+S.bowl.map(nameOf).join(', ')+'.':'The mixing bowl is empty. Crack eggs, add flour, milk...')}
  if(s.t==='hob'||s.t==='oven'){const slot=s.t==='hob'?S.hob[s.i]:S.oven,p=slot.pan;if(!p){say(s.t==='hob'?'An empty ring. Put a pan on it.':'The oven is empty. Open the door and put a tin or dish in.');O.btn('✕',()=>{S.sel=null;hint();O.clear()},'#333');return}
   if(s.t==='hob'&&p.items.length)O.btn('🥄 STIR',()=>{p.stir=2.5;p.stirs++;for(const it of p.items)if(it.k==='mix'&&it.parts.some(q=>q.k==='egg'))it.scr=p.stirs>=4;bp(300,.05,'triangle')},'#8a6a1a');
   if(p.k==='fry'||p.k==='wok')O.btn(p.oil?'🫒 OILED':'🫒 ADD A SPLASH OF OIL',()=>{p.oil=1;bp(700,.04)},'#5a6a2a');
   O.btn('PICK UP THE '+PANS[p.k].n,()=>{if(s.t==='oven')S.oven.door=1;if(take({pan:p})){slot.pan=null;S.sel=null;O.clear()}},'#2a5a8a');
   say(PANS[p.k].n+(p.water?' (water'+(p.water<.3?' nearly boiled dry':'')+')':'')+': '+(p.items.length?p.items.map(it=>nameOf(it)+' '+doneWord(it)).join(', '):'empty')+'.')}
  if(s.t==='plate'){if(S.plate.length){O.btn('🍽 SERVE IT',serve,'#2a7a3a');O.btn('SCRAPE INTO THE BIN',()=>{S.plate=[];S.sel=null;hint();O.clear()},'#6a2a2a')}say(S.plate.length?'On the plate: '+S.plate.map(nameOf).join(', ')+'.':'An empty plate. Tip a pan onto it, or put food straight on.')}}
 const doneWord=it=>{const c=it.cook;if(it.k!=='mix'&&(!ING[it.k]||!ING[it.k].c&&c<.2||ING[it.k].t==='spice'||ING[it.k].t==='fat'))return'';if(c<.2)return'(raw)';if(c<.65)return'(cooking)';if(c<=1.25)return'(done)';if(c<=1.45)return'(well done)';return'(BURNT)'};
 function chop(){if(!S.board||!ING[S.board.k].ch||S.board.cut)return;S.chop+=.26;bp(900+Math.random()*200,.02,'square',.04);S.fx.push({t:.3,k:'chop'});if(S.chop<1)say('Chopping the '+ING[S.board.k].n.toLowerCase()+'... '+'▮'.repeat(Math.round(S.chop*4))+'▯'.repeat(4-Math.round(S.chop*4)));if(S.chop>=1){S.board.cut=1;S.chop=0;say(ING[S.board.k].n+' chopped.');selBtns()}}
 function whisk(){if(!S.bowl.length||S.bowlMixed)return;S.bowlMix+=.2;bp(600,.02,'triangle',.03);S.fx.push({t:.4,k:'whisk'});if(S.bowlMix<1)say('Whisking... '+'▮'.repeat(Math.round(S.bowlMix*5))+'▯'.repeat(5-Math.round(S.bowlMix*5)));if(S.bowlMix>=1){const parts=S.bowl.slice(),ks=new Set(parts.map(p=>p.k));
   const nm=ks.has('flour')&&ks.has('egg')&&ks.has('milk')?(ks.has('sugar')?'CAKE MIX':'PANCAKE BATTER'):ks.has('flour')&&(ks.has('butter')||ks.has('oil'))?'PASTRY':ks.has('egg')&&[...ks].every(k=>['egg','milk','cheese','salt','bpep','herbs'].includes(k))?'WHISKED EGGS':ks.has('oats')?'PORRIDGE MIX':'MIXTURE';
   const icon=nm==='PASTRY'?'🥮':nm==='WHISKED EGGS'?'🍳':nm.includes('BATTER')||nm==='CAKE MIX'?'🥣':'🥣';S.bowl=[{k:'mix',parts,mixName:nm,mixIcon:icon,cook:0,m:{},cut:0}];S.bowlMixed=1;S.bowlMix=0;say('Whisked into '+nm.toLowerCase()+'. Pick up the bowl to pour it.');selBtns()}}
 /* put whatever you're holding onto a target */
 function drop(t,i){const h=S.hand;if(!h)return false;
  if(t==='bin'){S.hand=null;bp(200,.06);say('In the bin.');return true}
  if(h.bowl){/* a bowl of unmixed bits: pour into a pan or onto the plate */const into=t==='hob'?S.hob[i].pan:t==='oven'?S.oven.pan:null;if(into){into.items.push(...h.bowl);S.hand=null;say('Poured into the '+PANS[into.k].n+'.');return true}if(t==='plate'){S.plate.push(...h.bowl);S.hand=null;return true}if(t==='bowl'){S.bowl=h.bowl;S.hand=null;return true}say('Pour it into a pan, onto the plate, or back in the bowl.');return true}
  if(h.pan){const p=h.pan;if(t==='hob'){if(S.hob[i].pan)return say('There\'s already a pan on that ring.'),true;if(p.k==='tin'||p.k==='dish')return say('That goes in the oven.'),true;S.hob[i].pan=p;S.hand=null;bp(250,.06);say(PANS[p.k].n+' on the hob. Tap its knob to turn the heat up.');return true}
   if(t==='oven'){S.oven.door=1;if(S.oven.pan)return say('The oven\'s full.'),true;S.oven.pan=p;S.hand=null;bp(250,.06);say('In the oven. Shut the door (tap the handle) and turn the oven knob.');return true}
   if(t==='sink'){if(p.k!=='sauce'&&p.k!=='wok')return say('Fill the saucepan at the sink.'),true;p.water=1;bp(400,.3,'sine',.03);for(let i=0;i<5;i++)S.fx.push({t:.4+i*.1,k:'water'});say('Filled with water. Put it on the hob and bring it to the boil.');return true}
   if(t==='plate'){if(!p.items.length)return say('The pan is empty.'),true;for(const it of p.items)S.plate.push(it);p.items=[];p.water=0;p.oil=0;S.hand=null;bp(500,.05);say('Tipped onto the plate. The pan goes in the sink. Tap the plate to serve, or add more.');return true}
   if(t==='pans'){S.hand=null;say('Pan put away.');return true}return false}
  /* an ingredient */const it=h;
  if(t==='board'){if(S.board)return say('The board is in use.'),true;S.board=it;S.hand=null;S.sel={t:'board'};selBtns();return true}
  if(t==='bowl'){if(S.bowlMixed)return say('Pick up the mixture first.'),true;S.bowl.push(it);S.hand=null;bp(450,.03);S.sel={t:'bowl'};selBtns();return true}
  if(t==='hob'){const p=S.hob[i].pan;if(!p)return say('Put a pan on that ring first.'),true;if(it.k==='oil'){p.oil=1;S.hand=null;return true}p.items.push(it);S.hand=null;bp(it.k==='egg'?700:500,.05);return true}
  if(t==='oven'){const p=S.oven.pan;if(!p)return say('Put a tin or dish in the oven first.'),true;S.oven.door=1;p.items.push(it);S.hand=null;return true}
  if(t==='plate'){S.plate.push(it);S.hand=null;return true}
  if(t==='fridge'||t==='pantry'||t==='spice'){if(FREE.has(it.k)||it.k==='mix'){S.hand=null;say('Put back.');return true}if(!it.cut&&!it.cook&&FRIDGE.includes(it.k)){INV[it.k]=inv(it.k)+1;S.hand=null;say('Back in the fridge.');return true}say('You can\'t put that back now. Use it, or bin it.');return true}
  return false}
 function serve(){const d=judge(S.plate);if(!d)return;S.plate=[];S.sel=null;CK.dishes++;CK.xp+=d.stars;const b=CK.book[d.name]||{n:0,best:0};b.n++;b.best=Math.max(b.best,d.stars);const first=b.n===1;CK.book[d.name]=b;
  O.clear();bp(660,.08);setTimeout(()=>bp(880,.1),100);if(d.stars>=4)setTimeout(()=>bp(1175,.14),220);
  O.msg('<b style="font-size:15px;color:#ffd870">'+d.name.toUpperCase()+'</b>  '+'★'.repeat(d.stars)+'☆'.repeat(5-d.stars)+(first?' · <b style="color:#9fe89f">NEW IN YOUR COOKBOOK!</b>':'')+'<br>'+(d.notes.length?cap1(d.notes.join(', '))+'.':'')+' FOOD +'+d.food+' · ENERGY +'+d.en);
  O.btn('🍴 EAT IT NOW',()=>{try{fed(d.food,d.en,'🍽 '+d.name.toUpperCase()+' '+'★'.repeat(d.stars)+' · FOOD +'+d.food)}catch(e){toast('YOU EAT YOUR '+d.name.toUpperCase())}if(d.danger)setTimeout(()=>{try{HN.en=Math.max(0,HN.en-15)}catch(e){}toast('🤢 HMM... THAT WASN\'T COOKED PROPERLY. ENERGY -15')},2500);O.close()},'#2a7a3a');
  O.btn('🍱 SAVE AS LEFTOVERS',()=>{if(CK.left.length>=6)return say('The fridge is full of leftovers. Eat some first.');CK.left.push(d);toast('🍱 '+d.name.toUpperCase()+' GOES IN THE FRIDGE');O.clear();hint()},'#2a4a6a');
  O.btn('📖 COOKBOOK',book,'#5a3a6a')}
 const cap1=s=>s.charAt(0).toUpperCase()+s.slice(1);
 function book(){O.clear();const e=Object.entries(CK.book).sort((a,b)=>b[1].best-a[1].best);O.msg('<b>YOUR COOKBOOK</b> · '+e.length+' dishes discovered · '+CK.dishes+' cooked<br>'+(e.length?e.slice(0,18).map(([n,b])=>n+' '+'★'.repeat(b.best)+' ×'+b.n).join('<br>'):'Nothing yet. There\'s no recipe list: just cook, and see what you make.'));O.btn('◀ BACK',()=>{O.clear();hint()},'#444')}
 /* tapping the kitchen */
 function tapH(h){if(S.panel)closeP();if(!h)return;
  if(h.t==='knob'){S.hob[h.i].h=(S.hob[h.i].h+1)%4;bp(300+S.hob[h.i].h*120,.03);say('Ring '+(h.i+1)+': '+['OFF','LOW','MEDIUM','HIGH'][S.hob[h.i].h]+'.');return}
  if(h.t==='oknob'){S.oven.h=(S.oven.h+1)%4;bp(300+S.oven.h*120,.03);say('Oven: '+['OFF','160°C','200°C','230°C'][S.oven.h]+'.'+(S.oven.h&&S.oven.door?' Shut the door so it heats up.':''));return}
  if(h.t==='odoor'){S.oven.door=1-S.oven.door;bp(180,.08,'triangle');say(S.oven.door?'Oven door open.':'Oven door shut.'+(S.oven.h?'':' Turn the oven knob to heat it.'));return}
  if(h.t==='help'){say('<b>HOW IT WORKS:</b> there are no recipes. Fry in a pan with oil, boil in a saucepan of water, roast in the tin, bake in the dish. Chop veg, whisk eggs. Stir so it doesn\'t stick. Season it. Raw chicken is a bad idea, and so is burnt toast.');return}
  if(h.t==='decor'){bp(260,.05,'triangle');say('Just mugs and plates in this one.');return}
  if(S.hand){const used=drop(h.t,h.i);if(used!==false){if(S.sel&&S.sel.t==='board'||S.sel&&S.sel.t==='bowl')selBtns();else if(!S.hand)hint();return}}
  if(['fridge','pantry','pans','spice','left'].includes(h.t)){S.sel=null;bp(260,.05,'triangle');panel(h.t);return}
  if(h.t==='board'&&S.board&&S.sel&&S.sel.t==='board'&&ING[S.board.k].ch&&!S.board.cut){chop();return}
  if(h.t==='bowl'&&S.bowl.length&&S.sel&&S.sel.t==='bowl'&&!S.bowlMixed){whisk();return}
  if(['board','bowl','plate','hob','oven'].includes(h.t)){S.sel={t:h.t,i:h.i};selBtns();return}
  if(h.t==='sink')say(S.hand?'':'The sink. Bring the saucepan here to fill it with water.');if(h.t==='bin')say('The bin.')}
 const ray=new THREE.Raycaster(),nd=new THREE.Vector2();let pd=null,camX=.4,hw=2;
 ui.addEventListener('pointerdown',e=>{if(e.target!==ui)return;pd={x:e.clientX,y:e.clientY,cx:camX,mv:0}});
 ui.addEventListener('pointermove',e=>{if(!pd)return;const dx=e.clientX-pd.x;if(Math.abs(dx)>10)pd.mv=1;if(pd.mv)camX=pd.cx-dx/innerWidth*2*hw});
 ui.addEventListener('pointerup',e=>{const p=pd;pd=null;if(!p||p.mv||e.target!==ui)return;const r=R.domElement.getBoundingClientRect();nd.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
  cam.updateMatrixWorld();ray.setFromCamera(nd,cam);const I=ray.intersectObjects(K.hits,false);tapH(I.length?I[0].object.userData.h:null)});
 CK.tap=(t,i)=>tapH({t,i});
 /* cooking */
 const heat=[0,.045,.08,.13],oheat=[0,.05,.075,.1];
 function cookPan(p,rate,method,dt){if(!p||!p.items.length&&!p.water)return;let r=rate;p.stir=Math.max(0,p.stir-dt);
  if(p.water){p.water-=dt*rate*.06;if(p.water<=0){p.water=0;say('⚠ The saucepan has boiled dry!')}}
  const m=p.water>0?'boil':method;const burnF=p.water>0?0:(p.k==='fry'||p.k==='wok')&&!p.oil?1.6:1,stirF=p.stir>0?.55:1;
  for(const it of p.items){if(ING[it.k]&&(ING[it.k].t==='spice'))continue;const sp=(it.cut?1.45:1)*(it.k==='potato'&&!it.cut?.55:1)*(it.k==='pasta'||it.k==='rice'?(m==='boil'?1.2:.2):1);
   let d=r*sp*dt;if(it.cook>1&&m!=='boil')d*=burnF*stirF;if(m==='boil'&&it.cook>1.2)d*=.15;it.cook+=d;it.m[m==='fry'&&p.k==='wok'?'wok':m]=(it.m[m==='fry'&&p.k==='wok'?'wok':m]||0)+d}
  if(Math.random()<dt*2)S.fx.push({t:.9,k:p.water>0?'steam':p.items.some(i=>i.cook>1.4)?'smoke':'sizzle',p})}
 ACT.cam=()=>{const asp=cam.aspect||1.6,tv=Math.tan(cam.fov*Math.PI/360),D=cl(2.6/(tv*asp),1.8,asp<1.2?3.8:2.9);hw=tv*asp*D*.86;const x0=-2.15+hw,x1=2.98-hw;camX=x0>x1?(x0+x1)/2:cl(camX,x0,x1);const fit=x0>x1-.05;for(const b of ui.querySelectorAll('.kpan'))b.style.display=fit?'none':'';
  cam.position.set(K0.x+camX,K0.y+.95+D*.45,K0.z-.3+D*.9);cam.lookAt(K0.x+camX,K0.y+.98,K0.z-.4)};
 ACT.quit=()=>A.actEnd();
 ACT.tick=dt=>{dt=Math.min(dt,.1);S.t+=dt;S.hob.forEach(b=>{if(b.pan&&b.h)cookPan(b.pan,heat[b.h],'fry',dt)});if(S.oven.pan&&S.oven.h&&!S.oven.door)cookPan(S.oven.pan,oheat[S.oven.h],S.oven.pan.k==='dish'?'bake':'roast',dt);
  if(Math.random()<dt*1.2&&S.hob.some(b=>b.pan&&b.h&&b.pan.items.length&&!b.pan.water))bp(1800+Math.random()*900,.015,'sawtooth',.008);
  if(S.hob.some(b=>b.pan&&b.pan.items.some(i=>i.cook>1.55))&&Math.random()<dt*.8)bp(2400,.08,'square',.02);
  sync(dt)};
 ACT.end=()=>{ui.remove();document.body.classList.remove('kit3d');if(ah)ah.style.visibility='';for(const v of VIS.values())K.G.remove(v.g);for(const v of PV.values())K.G.remove(v);for(const f of S.fx)if(f.s)K.G.remove(f.s);VIS.clear();PV.clear();K.G.visible=false;K.doorF.rotation.y=K.doorP.rotation.y=K.doorPan.rotation.y=0;CK._S=null;CK.tap=null};
 /* keeping the 3D kitchen in step with what's going on */
 const VIS=new Map(),PV=new Map(),seen=new Set(),W1=new THREE.Color(1,1,1),BR=new THREE.Color(1,.78,.55),BK=new THREE.Color(.22,.16,.11),tc=new THREE.Color();
 const mkVis=(icon,cut)=>{const g=new THREE.Group(),sp=(x,z,s)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:etex(icon),transparent:true,depthWrite:false}));m.scale.set(s,s,1);m.position.set(x,0,z);m.renderOrder=3;g.add(m)};
  if(cut){sp(-.3,.1,.6);sp(.3,.05,.6);sp(0,-.25,.6)}else sp(0,0,1);return g};
 function place(it,x,y,z,s){let v=VIS.get(it);const ic=iconOf(it),key=ic+(it.cut?'c':'');if(!v||v.key!==key){if(v)K.G.remove(v.g);v={g:mkVis(ic,it.cut),key};VIS.set(it,v);K.G.add(v.g)}
  v.g.position.set(x,y+s*.42,z);v.g.scale.setScalar(s);const c=it.cook||0;if(c<.25)tc.copy(W1);else if(c<=1.45)tc.copy(W1).lerp(BR,Math.min(1,(c-.25)/1.2));else tc.copy(BR).lerp(BK,Math.min(1,(c-1.45)*1.6));
  for(const m of v.g.children)m.material.color.copy(tc);seen.add(it)}
 function spread(list,x,y,z,r,s){const n=list.length;list.forEach((it,i)=>{let ox=0,oz=0;if(n>1){const a=i/n*Math.PI*2+.5,rr=r*(n>5?.8:.62);ox=Math.cos(a)*rr;oz=Math.sin(a)*rr*.75}place(it,x+ox,y,z+oz,s)})}
 function placePan(p,x,y,z,sc,ry){let g=PV.get(p);if(!g){g=mkPan(p.k);PV.set(p,g);K.G.add(g)}g.position.set(x,y,z);g.scale.setScalar(sc);g.rotation.y=ry||0;const u=g.userData;
  u.sf.material.color.setHex(p.water>0?0x5a9ad8:p.oil?0x8a7a30:(u.k==='dish'?0xd8c4a4:0x3a3a42));u.sf.position.y=p.water>0&&u.k==='sauce'?.02+.075*Math.min(1,p.water):u.top+.001;
  spread(p.items,x,y+u.top*sc,z,u.r*sc,.075*sc);seen.add(p)}
 const hv=new THREE.Vector3(),ctrlKey={v:''},RC=[0x48484e,0x8a2a10,0xd04018,0xff7020];
 function sync(dt){seen.clear();const lerp=(o,k,v)=>{o[k]+=(v-o[k])*Math.min(1,dt*7)};
  /* doors */lerp(K.doorF.rotation,'y',S.panel==='fridge'?-1.75:0);lerp(K.doorP.rotation,'y',S.panel==='pantry'?-1.6:0);lerp(K.doorPan.rotation,'y',S.panel==='pans'?-1.6:0);lerp(K.doorO.rotation,'x',S.oven.door?1.42:0);
  /* rings, oven, knobs */S.hob.forEach((b,i)=>{K.ring[i].material.color.setHex(RC[b.h]);if(b.h===3)K.ring[i].material.color.multiplyScalar(.9+.1*Math.sin(S.t*6))});
  K.glow.material.color.setHex(!S.oven.h?0x202024:S.oven.door?0x3a2a20:[0,0x6a3014,0xa84a18,0xe06a20][S.oven.h]);
  const ck=S.hob.map(b=>b.h).join()+S.oven.h;if(ck!==ctrlKey.v){ctrlKey.v=ck;const g=K.ctrl._cv.getContext('2d');g.fillStyle='#2c2c30';g.fillRect(0,0,512,84);
   for(let i=0;i<5;i++){const u=(KX[i]-.73)/.74*512,hh=i<4?S.hob[i].h:S.oven.h;g.fillStyle='#55555c';g.beginPath();g.arc(u,32,22,0,7);g.fill();g.fillStyle='#c8c8d0';g.beginPath();g.arc(u,32,18,0,7);g.fill();
    const a=-Math.PI/2+hh*.9;g.strokeStyle=hh?'#e04010':'#333';g.lineWidth=5;g.beginPath();g.moveTo(u,32);g.lineTo(u+Math.cos(a)*16,32+Math.sin(a)*16);g.stroke();
    g.fillStyle=hh?'#ffb040':'#bbb';g.font='bold 19px ui-monospace,monospace';g.textAlign='center';g.fillText(i<4?(i+1)+':'+['OFF','LO','MED','HI'][hh]:['OVEN','160°','200°','230°'][hh],u,79)}K.ctrl.needsUpdate=true}
  /* food on the board, in the bowl, on the plate */
  if(S.board)place(S.board,POS.board[0],POS.board[1],POS.board[2],.12);spread(S.bowl,POS.bowl[0],POS.bowl[1],POS.bowl[2],POS.bowl[3],POS.bowl[4]);spread(S.plate,POS.plate[0],POS.plate[1],POS.plate[2],POS.plate[3],POS.plate[4]);
  S.hob.forEach((b,i)=>{if(b.pan)placePan(b.pan,RP[i][0],.912,RP[i][1],1,0)});if(S.oven.pan)placePan(S.oven.pan,POS.oven[0],POS.oven[1],POS.oven[2],1,0);
  /* whatever you're holding floats in front of you */
  if(S.hand){cam.updateMatrixWorld();hv.set(.15,-.15,-.45).applyMatrix4(cam.matrixWorld);K.G.worldToLocal(hv);const h=S.hand;if(h.pan)placePan(h.pan,hv.x,hv.y-.03,hv.z,.7,.3);else if(h.bowl)spread(h.bowl,hv.x,hv.y,hv.z,.04,.06);else place(h,hv.x,hv.y,hv.z,.08)}
  for(const[it,v]of VIS)if(!seen.has(it)){K.G.remove(v.g);VIS.delete(it)}for(const[p,g]of PV)if(!seen.has(p)){K.G.remove(g);PV.delete(p)}
  /* leftovers, the marker */K.tubs.forEach((t,i)=>t.visible=i<Math.max(1,CK.left.length));K.leftL.userData.set('LEFTOVERS '+CK.left.length);
  const sp=S.sel&&tgtPos(S.sel);K.mark.visible=!!sp;if(sp)K.mark.position.set(sp[0],sp[1]+.22+Math.sin(S.t*5)*.02,sp[2]);
  /* steam, smoke, sizzle, knives, whisks */if(S.fx.length>40)S.fx.splice(0,S.fx.length-40);
  for(let i=S.fx.length-1;i>=0;i--){const f=S.fx[i];if(!f.s){const ic={chop:'🔪',whisk:'🥄',steam:'💨',smoke:'🌫',sizzle:'✨',water:'💧'}[f.k];f.s=new THREE.Sprite(new THREE.SpriteMaterial({map:etex(ic),transparent:true,depthWrite:false}));f.s.renderOrder=4;f.t0=f.t;K.G.add(f.s);
    let o=f.k==='chop'?POS.board:f.k==='whisk'?POS.bowl:f.k==='water'?POS.sink:null;if(f.p){const g=PV.get(f.p);if(!g){K.G.remove(f.s);S.fx.splice(i,1);continue}o=[g.position.x,g.position.y+.05,g.position.z]}f.o=[o[0]+rnd(-.04,.04),o[1]+.06,o[2]+rnd(-.03,.03)];f.sz=f.k==='chop'||f.k==='whisk'?.1:.07}
   f.t-=dt;if(f.t<=0){K.G.remove(f.s);S.fx.splice(i,1);continue}const a=1-f.t/f.t0,up=f.k==='chop'?-.03*Math.sin(a*Math.PI*2):f.k==='whisk'?0:a*.22;
   f.s.position.set(f.o[0]+(f.k==='whisk'?Math.cos(a*12)*.04:0),f.o[1]+up,f.o[2]+(f.k==='whisk'?Math.sin(a*12)*.03:0));f.s.scale.setScalar(f.sz*(f.k==='steam'||f.k==='smoke'?1+a:1));f.s.material.opacity=Math.min(1,f.t*3)}}
 CK._S=S;hint();bp(330,.06,'triangle');setTimeout(()=>bp(440,.08,'triangle'),90)}
if(window.PUBG)PUBG.kitchen=open;window.KITCHEN.open=open;window.KITCHEN.judge=judge;
/* the fridge in any of your homes now opens the kitchen */
{const o0=openShop;openShop=function(m){if(m==='fridge'){try{open();return}catch(e){czErr(e,'kitchen.js')}}return o0.apply(this,arguments)}}
{/* relabel the fridge action so you know */const relabel=()=>{for(const arr of[typeof IA!=='undefined'?IA:null,typeof HOUSE_A!=='undefined'?HOUSE_A:null])if(arr)for(const a of arr)if(a.label==='OPEN FRIDGE')a.label='🍳 THE KITCHEN (COOK ANYTHING)'};const u0=updCozy;let t=0;updCozy=function(dt){u0(dt);if(!GS.inside)return;t-=dt;if(t>0)return;t=.5;relabel()}}
})();
