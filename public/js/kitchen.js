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
if(!window.PUBG||typeof openShop!=='function')return;
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
const iconOf=it=>it.k==='mix'?it.mixIcon:ING[it.k].i;

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

/* ------------------------------------------------------------------ the kitchen overlay */
function open(){const W=640,H=470,O=PUBG.gameOv('YOUR KITCHEN',{w:W,h:H,bg:'rgba(20,14,10,.98)',maxH:560}),g=O.g;
 const S={hand:null,board:null,chop:0,bowl:[],bowlMix:0,hob:[{pan:null,h:0},{pan:null,h:0},{pan:null,h:0},{pan:null,h:0}],oven:{pan:null,h:0,door:1},plate:[],sel:null,panel:null,t:0,fx:[],msg:''};
 /* regions */const R={fridge:[8,8,110,124],pantry:[124,8,110,124],pans:[240,8,110,124],spice:[356,8,92,124],left:[454,8,92,124],bin:[552,8,80,124],
  board:[10,146,190,92],bowl:[212,146,110,92],plate:[334,146,150,92],sink:[496,146,136,92],
  hob:[[20,262,140,86],[170,262,140,86],[20,356,140,86],[170,356,140,86]],knob:[[20,444,70,20],[92,444,70,20],[164,444,70,20],[236,444,70,20]],oven:[330,262,200,180],oknob:[330,444,90,20],odoor:[440,444,90,20],help:[548,262,84,180]};
 const inR=(p,r)=>p[0]>=r[0]&&p[0]<=r[0]+r[2]&&p[1]>=r[1]&&p[1]<=r[1]+r[3];
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
   O.btn('PICK UP THE '+PANS[p.k].n,()=>{if(s.t==='oven'&&!S.oven.door)return say('Open the oven door first.');if(take({pan:p})){slot.pan=null;S.sel=null;O.clear()}},'#2a5a8a');
   say(PANS[p.k].n+(p.water?' (water'+(p.water<.3?' nearly boiled dry':'')+')':'')+': '+(p.items.length?p.items.map(it=>nameOf(it)+' '+doneWord(it)).join(', '):'empty')+'.')}
  if(s.t==='plate'){if(S.plate.length){O.btn('🍽 SERVE IT',serve,'#2a7a3a');O.btn('SCRAPE INTO THE BIN',()=>{S.plate=[];S.sel=null;hint();O.clear()},'#6a2a2a')}say(S.plate.length?'On the plate: '+S.plate.map(nameOf).join(', ')+'.':'An empty plate. Tip a pan onto it, or put food straight on.')}}
 const doneWord=it=>{const c=it.cook;if(it.k!=='mix'&&(!ING[it.k]||!ING[it.k].c&&c<.2||ING[it.k].t==='spice'||ING[it.k].t==='fat'))return'';if(c<.2)return'(raw)';if(c<.65)return'(cooking)';if(c<=1.25)return'(done)';if(c<=1.45)return'(well done)';return'(BURNT)'};
 function chop(){if(!S.board||!ING[S.board.k].ch||S.board.cut)return;S.chop+=.26;bp(900+Math.random()*200,.02,'square',.04);S.fx.push({t:.25,x:105,y:190,k:'chop'});if(S.chop>=1){S.board.cut=1;S.chop=0;say(ING[S.board.k].n+' chopped.');selBtns()}}
 function whisk(){if(!S.bowl.length||S.bowlMixed)return;S.bowlMix+=.2;bp(600,.02,'triangle',.03);S.fx.push({t:.25,x:267,y:190,k:'whisk'});if(S.bowlMix>=1){const parts=S.bowl.slice(),ks=new Set(parts.map(p=>p.k));
   const nm=ks.has('flour')&&ks.has('egg')&&ks.has('milk')?(ks.has('sugar')?'CAKE MIX':'PANCAKE BATTER'):ks.has('flour')&&(ks.has('butter')||ks.has('oil'))?'PASTRY':ks.has('egg')&&[...ks].every(k=>['egg','milk','cheese','salt','bpep','herbs'].includes(k))?'WHISKED EGGS':ks.has('oats')?'PORRIDGE MIX':'MIXTURE';
   const icon=nm==='PASTRY'?'🥮':nm==='WHISKED EGGS'?'🍳':nm.includes('BATTER')||nm==='CAKE MIX'?'🥣':'🥣';S.bowl=[{k:'mix',parts,mixName:nm,mixIcon:icon,cook:0,m:{},cut:0}];S.bowlMixed=1;S.bowlMix=0;say('Whisked into '+nm.toLowerCase()+'. Pick up the bowl to pour it.');selBtns()}}
 /* put whatever you're holding onto a target */
 function drop(t,i){const h=S.hand;if(!h)return false;
  if(t==='bin'){S.hand=null;bp(200,.06);say('In the bin.');return true}
  if(h.bowl){/* a bowl of unmixed bits: pour into a pan or onto the plate */const into=t==='hob'?S.hob[i].pan:t==='oven'?S.oven.pan:null;if(into){into.items.push(...h.bowl);S.hand=null;say('Poured into the '+PANS[into.k].n+'.');return true}if(t==='plate'){S.plate.push(...h.bowl);S.hand=null;return true}if(t==='bowl'){S.bowl=h.bowl;S.hand=null;return true}say('Pour it into a pan, onto the plate, or back in the bowl.');return true}
  if(h.pan){const p=h.pan;if(t==='hob'){if(S.hob[i].pan)return say('There\'s already a pan on that ring.'),true;if(p.k==='tin'||p.k==='dish')return say('That goes in the oven.'),true;S.hob[i].pan=p;S.hand=null;bp(250,.06);say(PANS[p.k].n+' on the hob. Tap its knob to turn the heat up.');return true}
   if(t==='oven'){if(!S.oven.door)return say('Open the oven door first.'),true;if(S.oven.pan)return say('The oven\'s full.'),true;S.oven.pan=p;S.hand=null;bp(250,.06);say('In the oven. Close the door and turn the knob.');return true}
   if(t==='sink'){if(p.k!=='sauce'&&p.k!=='wok')return say('Fill the saucepan at the sink.'),true;p.water=1;bp(400,.3,'sine',.03);say('Filled with water. Put it on the hob and bring it to the boil.');return true}
   if(t==='plate'){if(!p.items.length)return say('The pan is empty.'),true;for(const it of p.items)S.plate.push(it);p.items=[];p.water=0;p.oil=0;S.hand=null;bp(500,.05);say('Tipped onto the plate. The pan goes in the sink. Tap the plate to serve, or add more.');return true}
   if(t==='pans'){S.hand=null;say('Pan put away.');return true}return false}
  /* an ingredient */const it=h;
  if(t==='board'){if(S.board)return say('The board is in use.'),true;S.board=it;S.hand=null;S.sel={t:'board'};selBtns();return true}
  if(t==='bowl'){if(S.bowlMixed)return say('Pick up the mixture first.'),true;S.bowl.push(it);S.hand=null;bp(450,.03);S.sel={t:'bowl'};selBtns();return true}
  if(t==='hob'){const p=S.hob[i].pan;if(!p)return say('Put a pan on that ring first.'),true;if(it.k==='oil'){p.oil=1;S.hand=null;return true}p.items.push(it);S.hand=null;bp(it.k==='egg'?700:500,.05);return true}
  if(t==='oven'){const p=S.oven.pan;if(!p||!S.oven.door)return say(p?'Open the oven door first.':'Put a tin or dish in the oven first.'),true;p.items.push(it);S.hand=null;return true}
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
 O.on('pointerdown',p=>{if(S.panel)closeP();
  const hit=(t,r,i)=>inR(p,r)?{t,i}:null;let h=null;for(const k of['fridge','pantry','pans','spice','left','bin','board','bowl','plate','sink','oven'])if(!h)h=hit(k,R[k]);
  for(let i=0;i<4&&!h;i++)h=hit('knob',R.knob[i],i);for(let i=0;i<4&&!h;i++)h=hit('hob',R.hob[i],i);if(!h)h=hit('oknob',R.oknob)||hit('odoor',R.odoor)||hit('help',R.help);if(!h)return;
  if(h.t==='knob'){S.hob[h.i].h=(S.hob[h.i].h+1)%4;bp(300+S.hob[h.i].h*120,.03);say('Ring '+(h.i+1)+': '+['OFF','LOW','MEDIUM','HIGH'][S.hob[h.i].h]+'.');return}
  if(h.t==='oknob'){S.oven.h=(S.oven.h+1)%4;bp(300+S.oven.h*120,.03);say('Oven: '+['OFF','160°C','200°C','230°C'][S.oven.h]+'.');return}
  if(h.t==='odoor'){S.oven.door=1-S.oven.door;bp(180,.08,'triangle');say(S.oven.door?'Oven door open.':'Oven door shut.'+(S.oven.h?'':' Turn the knob to heat it.'));return}
  if(h.t==='help'){say('<b>HOW IT WORKS:</b> there are no recipes. Fry in a pan with oil, boil in a saucepan of water, roast in the tin, bake in the dish. Chop veg, whisk eggs. Stir so it doesn\'t stick. Season it. Raw chicken is a bad idea, and so is burnt toast.');return}
  if(S.hand){const used=drop(h.t,h.i);if(used!==false){if(S.sel&&S.sel.t==='board'||S.sel&&S.sel.t==='bowl')selBtns();else if(!S.hand)hint();return}}
  if(['fridge','pantry','pans','spice','left'].includes(h.t)){S.sel=null;bp(260,.05,'triangle');panel(h.t);return}
  if(h.t==='board'&&S.board&&S.sel&&S.sel.t==='board'&&ING[S.board.k].ch&&!S.board.cut){chop();return}
  if(h.t==='bowl'&&S.bowl.length&&S.sel&&S.sel.t==='bowl'&&!S.bowlMixed){whisk();return}
  if(['board','bowl','plate','hob','oven'].includes(h.t)){S.sel={t:h.t,i:h.i};selBtns();return}
  if(h.t==='sink')say(S.hand?'':'The sink. Bring the saucepan here to fill it with water.');if(h.t==='bin')say('The bin.')});
 /* cooking */
 const heat=[0,.045,.08,.13],oheat=[0,.05,.075,.1];
 function cookPan(p,rate,method,dt){if(!p||!p.items.length&&!p.water)return;let r=rate;p.stir=Math.max(0,p.stir-dt);
  if(p.water){p.water-=dt*rate*.06;if(p.water<=0){p.water=0;say('⚠ The saucepan has boiled dry!')}}
  const m=p.water>0?'boil':method;const burnF=p.water>0?0:(p.k==='fry'||p.k==='wok')&&!p.oil?1.6:1,stirF=p.stir>0?.55:1;
  for(const it of p.items){if(ING[it.k]&&(ING[it.k].t==='spice'))continue;const sp=(it.cut?1.45:1)*(it.k==='potato'&&!it.cut?.55:1)*(it.k==='pasta'||it.k==='rice'?(m==='boil'?1.2:.2):1);
   let d=r*sp*dt;if(it.cook>1&&m!=='boil')d*=burnF*stirF;if(m==='boil'&&it.cook>1.2)d*=.15;it.cook+=d;it.m[m==='fry'&&p.k==='wok'?'wok':m]=(it.m[m==='fry'&&p.k==='wok'?'wok':m]||0)+d}
  if(Math.random()<dt*2)S.fx.push({t:.8,x:0,y:0,k:p.water>0?'steam':p.items.some(i=>i.cook>1.4)?'smoke':'sizzle',p})}
 O.loop(dt=>{S.t+=dt;S.hob.forEach(b=>{if(b.pan&&b.h)cookPan(b.pan,heat[b.h],(b.pan.k==='sauce'?'fry':'fry'),dt)});if(S.oven.pan&&S.oven.h&&!S.oven.door)cookPan(S.oven.pan,oheat[S.oven.h],S.oven.pan.k==='dish'?'bake':'roast',dt);
  if(Math.random()<dt*1.2&&S.hob.some(b=>b.pan&&b.h&&b.pan.items.length&&!b.pan.water))bp(1800+Math.random()*900,.015,'sawtooth',.008);
  if(S.hob.some(b=>b.pan&&b.pan.items.some(i=>i.cook>1.55))&&Math.random()<dt*.8)bp(2400,.08,'square',.02);
  draw()});
 /* drawing */
 const box=(r,c,lab,sub)=>{g.fillStyle=c;g.fillRect(r[0],r[1],r[2],r[3]);g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=2;g.strokeRect(r[0]+1,r[1]+1,r[2]-2,r[3]-2);if(lab){const lt=/^#[ef]/.test(c);g.fillStyle=lt?'#3a3028':'#fff';g.font='bold 11px monospace';g.textAlign='center';g.fillText(lab,r[0]+r[2]/2,r[1]+r[3]-7)}if(sub){g.font='26px serif';g.fillText(sub,r[0]+r[2]/2,r[1]+r[3]/2+6)}};
 const food=(it,x,y,sz)=>{g.font=(sz||24)+'px serif';g.textAlign='center';g.textBaseline='middle';g.fillText(iconOf(it),x,y);const c=it.cook||0;if(c>.25){g.fillStyle=c>1.45?'rgba(20,10,5,'+Math.min(.8,(c-1.45)*1.5+.4)+')':'rgba(150,90,30,'+Math.min(.35,(c-.25)*.4)+')';g.beginPath();g.arc(x,y,(sz||24)*.48,0,7);g.fill()}if(it.cut){g.fillStyle='#fff';g.font='bold 9px monospace';g.fillText('✂',x+(sz||24)*.45,y+(sz||24)*.4)}g.textBaseline='alphabetic'};
 const panDraw=(p,x,y,w)=>{g.fillStyle='#2a2a30';g.beginPath();g.ellipse(x,y,w*.42,w*.3,0,0,7);g.fill();g.fillStyle=p.water>0?'rgba(120,170,230,.75)':'#3a3a42';g.beginPath();g.ellipse(x,y,w*.36,w*.24,0,0,7);g.fill();g.fillStyle='#222';g.fillRect(x+w*.38,y-4,w*.3,8);
  p.items.forEach((it,i)=>food(it,x-w*.2+(i%4)*w*.14,y-6+Math.floor(i/4)*14,18));g.fillStyle='#ccc';g.font='9px monospace';g.textAlign='center';g.fillText(PANS[p.k].n,x,y+w*.3+10)};
 function draw(){g.fillStyle='#e8dcc4';g.fillRect(0,0,W,H);for(let x=0;x<W;x+=32)for(let y=136;y<254;y+=32){g.fillStyle=((x+y)/32)%2?'#f4f0e8':'#e8e4dc';g.fillRect(x,y,32,32)}
  box(R.fridge,'#d8dde4','FRIDGE','🧊');box(R.pantry,'#8a6a44','PANTRY','🥫');box(R.pans,'#6a5a4a','PAN CUPBOARD','🍳');box(R.spice,'#7a4a2a','SPICE RACK','🧂');box(R.left,'#5a6a7a','LEFTOVERS '+CK.left.length,'🍱');box(R.bin,'#4a4a4a','BIN','🗑');
  g.fillStyle='#b89870';g.fillRect(0,136,W,4);
  box(R.board,'#c89a5a','CHOPPING BOARD');if(S.board){food(S.board,R.board[0]+R.board[2]/2,R.board[1]+40,38);if(S.chop>0){g.fillStyle='#333';g.fillRect(R.board[0]+40,R.board[1]+74,110,6);g.fillStyle='#ffd040';g.fillRect(R.board[0]+40,R.board[1]+74,110*S.chop,6)}}
  box(R.bowl,'#f0f0f4','MIXING BOWL');g.fillStyle='#d8d8e0';g.beginPath();g.ellipse(R.bowl[0]+55,R.bowl[1]+42,42,26,0,0,7);g.fill();S.bowl.forEach((it,i)=>food(it,R.bowl[0]+30+(i%3)*24,R.bowl[1]+34+Math.floor(i/3)*14,20));if(S.bowlMix>0){g.fillStyle='#333';g.fillRect(R.bowl[0]+15,R.bowl[1]+70,80,6);g.fillStyle='#ffd040';g.fillRect(R.bowl[0]+15,R.bowl[1]+70,80*S.bowlMix,6)}
  box(R.plate,'#e8e0d4','PLATE');g.fillStyle='#fff';g.beginPath();g.ellipse(R.plate[0]+75,R.plate[1]+42,62,32,0,0,7);g.fill();g.strokeStyle='#d0c8bc';g.stroke();S.plate.forEach((it,i)=>food(it,R.plate[0]+35+(i%5)*20,R.plate[1]+34+Math.floor(i/5)*16,20));
  box(R.sink,'#b8c4cc','SINK','🚰');
  g.fillStyle='#3a3a42';g.fillRect(10,254,312,214);S.hob.forEach((b,i)=>{const r=R.hob[i],cx=r[0]+r[2]/2,cy=r[1]+r[3]/2-4;g.strokeStyle=b.h?['#000','#a04020','#e05020','#ff7020'][b.h]:'#55555c';g.lineWidth=5;g.beginPath();g.arc(cx,cy,30,0,7);g.stroke();g.lineWidth=2;g.beginPath();g.arc(cx,cy,18,0,7);g.stroke();g.fillStyle='#8a8a92';g.font='bold 12px monospace';g.textAlign='left';g.fillText(String(i+1),r[0]+4,r[1]+14);if(b.pan)panDraw(b.pan,cx,cy,r[2]*.9);
   const k=R.knob[i];g.fillStyle='#222';g.fillRect(k[0],k[1],k[2],k[3]);g.fillStyle=b.h?'#ffb040':'#999';g.font='bold 10px monospace';g.textAlign='center';g.fillText('RING '+(i+1)+' '+['OFF','LO','MED','HI'][b.h],k[0]+k[2]/2,k[1]+14);if(S.sel&&S.sel.t==='hob'&&S.sel.i===i){g.strokeStyle='#ffd040';g.lineWidth=3;g.strokeRect(r[0],r[1],r[2],r[3])}});
  const ov=R.oven;g.fillStyle='#2a2a30';g.fillRect(ov[0],ov[1],ov[2],ov[3]);g.fillStyle=S.oven.door?'#111':(S.oven.h?'rgba(255,120,40,.55)':'#3a3a42');g.fillRect(ov[0]+14,ov[1]+18,ov[2]-28,ov[3]-46);if(S.oven.pan)panDraw(S.oven.pan,ov[0]+ov[2]/2,ov[1]+ov[3]/2,120);
  g.fillStyle='#fff';g.font='bold 11px monospace';g.textAlign='center';g.fillText('OVEN'+(S.oven.door?' (DOOR OPEN)':''),ov[0]+ov[2]/2,ov[1]+12);
  g.fillStyle='#222';g.fillRect(...R.oknob);g.fillRect(...R.odoor);g.fillStyle=S.oven.h?'#ffb040':'#999';g.font='bold 10px monospace';g.fillText(['OFF','160°C','200°C','230°C'][S.oven.h],R.oknob[0]+45,R.oknob[1]+14);g.fillStyle='#ccc';g.fillText(S.oven.door?'SHUT DOOR':'OPEN DOOR',R.odoor[0]+45,R.odoor[1]+14);
  box(R.help,'#4a6a4a',null,'❓');g.fillStyle='#fff';g.font='bold 11px monospace';g.fillText('HOW IT',R.help[0]+42,R.help[1]+R.help[3]-22);g.fillText('WORKS',R.help[0]+42,R.help[1]+R.help[3]-8);
  /* effects */for(let i=S.fx.length-1;i>=0;i--){const f=S.fx[i];f.t-=1/60;if(f.t<=0){S.fx.splice(i,1);continue}let x=f.x,y=f.y;if(f.p){const hb=S.hob.findIndex(b=>b.pan===f.p);if(hb>=0){const r=R.hob[hb];x=r[0]+r[2]/2+rnd(-20,20);y=r[1]+20-(.8-f.t)*40}else if(S.oven.pan===f.p){x=ov[0]+ov[2]/2;y=ov[1]+30}else continue}
   g.font='20px serif';g.textAlign='center';g.globalAlpha=Math.min(1,f.t*2);g.fillText({chop:'🔪',whisk:'🥄',steam:'💨',smoke:'🌫',sizzle:'✨'}[f.k],x,y);g.globalAlpha=1}
  if(S.hand){g.fillStyle='rgba(0,0,0,.55)';g.fillRect(W-170,H-36,166,32);g.fillStyle='#ffd870';g.font='bold 11px monospace';g.textAlign='left';g.fillText('HOLDING:',W-164,H-15);if(S.hand.pan)g.fillText(PANS[S.hand.pan.k].n,W-104,H-15);else if(S.hand.bowl)g.fillText('THE BOWL',W-104,H-15);else food(S.hand,W-90,H-20,22)}}
 CK._S=S;hint()}
PUBG.kitchen=open;window.KITCHEN.open=open;window.KITCHEN.judge=judge;
/* the fridge in any of your homes now opens the kitchen */
{const o0=openShop;openShop=function(m){if(m==='fridge'){try{open();return}catch(e){czErr(e,'kitchen.js')}}return o0.apply(this,arguments)}}
{/* relabel the fridge action so you know */const relabel=()=>{for(const arr of[typeof IA!=='undefined'?IA:null,typeof HOUSE_A!=='undefined'?HOUSE_A:null])if(arr)for(const a of arr)if(a.label==='OPEN FRIDGE')a.label='🍳 THE KITCHEN (COOK ANYTHING)'};const u0=updCozy;let t=0;updCozy=function(dt){u0(dt);if(!GS.inside)return;t-=dt;if(t>0)return;t=.5;relabel()}}
})();
