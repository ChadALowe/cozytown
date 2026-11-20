/* ---------- village life: customers, shops ---------- */
const CUST=[['MRS PATEL',["Lovely, you're a star!","Chai's on, shame you can't stay."]],['MR HUGHES',["About time! Joking. Thanks.","Mind the badger on Mill Road."]],['OLD TOM',["Ooh, a Citroën. Reminds me of my youth.","Eh? Oh, the parcel! Ta."]],['MISS ADEBAYO',["Perfect timing, thank you!","Five stars from me."]],['THE VICAR',["Bless you, my child.","Mind the church lane puddles."]],['DAVE & SUE',["Cheers mate!","We'll order again, promise."]],['MRS COLLINS',["Is it raining? Come in a sec!","My cat likes your car."]],['MR OKAFOR',["Right on time. Respect.","Nice little motor, that."]],['KEV THE BUILDER',["Champion. Cheers pal.","That's the one I was after."]],['LADY HARGREAVES',["Do put it on the hall table.","Quite punctual. Splendid."]],['LITTLE JOSH',["Is it a toy?! Awesome!","Can I sit in your car?"]],['NANA JOY',["Ooh lovely, have a sweet.","You look thin, dear. Eat more."]]];
function custOf(a){let h=0;for(let i=0;i<a.length;i++)h=(h*31+a.charCodeAt(i))>>>0;const c=CUST[h%CUST.length];return{n:c[0],l:c[1],h}}
var _cb=null,_ct=0;
function say(n,t,ms){if(!_cb){_cb=document.createElement('div');_cb.style.cssText='position:fixed;left:50%;bottom:30%;transform:translateX(-50%);max-width:82%;padding:8px 12px;background:rgba(0,0,20,.82);color:#fff;border:2px solid #f5e6a0;font:bold 13px monospace;text-align:center;z-index:30;pointer-events:none;display:none';document.body.appendChild(_cb)}
 _cb.innerHTML='<span style="color:#f5e6a0">'+n+'</span><br>'+t;_cb.style.display='block';clearTimeout(_ct);_ct=setTimeout(()=>{_cb.style.display='none'},ms||3400)}
function custSay(s){const c=custOf(s.addr);let t=c.l[(c.h>>3)%2];const r=Math.random();friendGain(c.n,1);const lv=lvl(c.n);if(lv>0){cash+=lv}
 if(r<.5){if(JOB.kind==='rush')t="Just in time! Cheers!";else if(JOB.kind==='fragile'&&JOB.dmg)t="Hmm, it rattles. Hope it's fine...";else if(rainI>0)t="You're soaked! Thanks for coming out.";else if(todI===2)t="Bit late for deliveries, but cheers!"}
 if(lv>=3&&r>=.5)t=WARM[(c.h>>2)%4];say(c.n,t+(lv>0?'  ♥+£'+lv:''))}
/* shop interiors */
const SG=new THREE.Group();SG.position.set(3200,500,3000);SG.visible=false;scene.add(SG);
var SHOPCUR=null,SHK=null,_hR=null,_hA=null;
function sbox(x,y,z,w,h,d,mat,sh){const g=new THREE.BoxGeometry(w,h,d),col=new Float32Array(g.attributes.position.count*3),F=[.82,.7,1,.45,.9,.74];for(let f=0;f<6;f++)for(let v=0;v<4;v++){const i=(f*4+v)*3,c=F[f]*(sh||1);col[i]=col[i+1]=col[i+2]=c}g.setAttribute('color',new THREE.BufferAttribute(col,3));const m=new THREE.Mesh(g,mat);m.position.set(x,y+h/2,z);SG.add(m);return m}
function splane(w,h,x,y,z,ry,mat){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x,y,z);m.rotation.y=ry;SG.add(m);return m}
function shopNear(){let b=null,bd=1e9;for(const o of SHOPD){const d=Math.hypot(P.x-o.x,P.z-o.z);if(d<bd){bd=d;b=o}}return b?{o:b,d:bd}:null}
const sFl=tFloor();sFl.repeat.set(5,4);const sWl=tWall(4,1.4),sWl2=tWall(3,1.4);
const _shS={};function shopSignTex(o){if(_shS[o.t])return _shS[o.t];const fs=Math.min(18,Math.floor(176/(o.t.length*.62)));return _shS[o.t]=ptex(192,32,c=>{c.fillStyle=o.bg;c.fillRect(0,0,192,32);c.fillStyle=o.fg;c.font='bold '+fs+'px monospace';c.textAlign='center';c.fillText(o.t,96,21);c.strokeStyle=o.fg;c.strokeRect(2,2,188,28)},false)}
const KEEP={'POST OFFICE':['MR SHAH','Parcels? Pick a job off my board, then reverse round the back to the loading bay.'],'CO-OP':['JANICE','Members get nothing, but it is cheaper.'],'CHEMIST':['MR LEE','Rest those legs. Stamina is half the job.'],"FRANKIE'S FISH & CHIPS":['FRANKIE','Hot orders pay best. Mind the vinegar.'],'BAKERY':['MARTHA','Buns fresh at six. Night shifts pay more, mind.'],'THE ROYAL OAK':['THE LANDLORD','Fragile parcels? Drive like it is a pint of Guinness.']};
const KGEN=[['PAUL','Busy day. Rush orders pay a mint.'],['RUTH','Night shifts pay extra, if you dare.'],['SAM','Old Tom reckons the C1 is a classic.'],['MEG','Mrs Collins always tips in the rain.']];
var _kg=0;
const _fmC={};function fmc(h){return _fmC[h]||(_fmC[h]=fm(h))}
const _dtx={};function dtex(k,w,h,fn){return _dtx[k]||(_dtx[k]=ptex(w,h,fn,false))}
const tTile=ptex(32,32,c=>{c.fillStyle='#e9e9e4';c.fillRect(0,0,32,32);c.fillStyle='#2a2d33';c.fillRect(0,0,16,16);c.fillRect(16,16,16,16)});
const tTile2=ptex(32,32,c=>{c.fillStyle='#f0f0ec';c.fillRect(0,0,32,32);c.fillStyle='#c8ccd0';c.fillRect(0,0,16,16);c.fillRect(16,16,16,16);c.fillStyle='#9aa0a6';c.fillRect(15,0,2,32);c.fillRect(0,15,32,2)});
const tCarp=ptex(16,16,c=>{c.fillStyle='#4a5870';c.fillRect(0,0,16,16);c.fillStyle='#566580';for(let k=0;k<30;k++)c.fillRect((k*7)%16,(k*11)%16,1,1);c.fillStyle='#3e4b60';for(let k=0;k<20;k++)c.fillRect((k*5+3)%16,(k*3)%16,1,1)});
const tFlag=ptex(32,32,c=>{c.fillStyle='#8a8d8a';c.fillRect(0,0,32,32);c.fillStyle='#707370';c.fillRect(0,15,32,2);c.fillRect(15,0,2,32);c.fillStyle='#9a9d9a';for(let k=0;k<14;k++)c.fillRect((k*9)%32,(k*13)%32,3,2)});
[tTile,tTile2,tCarp,tFlag].forEach(t=>{});
const FLR={wood:()=>{sFl.repeat.set(5,4);return sFl},tile:()=>{tTile.repeat.set(4,3);return tTile},tile2:()=>{tTile2.repeat.set(4,3);return tTile2},carpet:()=>{tCarp.repeat.set(10,8);return tCarp},stone:()=>{tFlag.repeat.set(5,4);return tFlag}};
const TH={
 'POST OFFICE':{wall:0xf6e8e4,fl:'carpet',cnt:0xb81818,top:0xdedede,pal:[0xb08850,0xc89a60,0xd8d0c0,0xc02020],sh:0xb81818},
 'CO-OP':{wall:0xe6f0e8,fl:'tile2',cnt:0x0e6a3a,top:0xe6e6e6,pal:[0xd04030,0x3070d0,0xe0c030,0x40a050,0xe08030],back:1,left:0,sh:0x0e6a3a},
 'CHEMIST':{wall:0xe8f4ee,fl:'tile2',cnt:0xeeeeee,top:0x8fc9a8,pal:[0xffffff,0x40a070,0x70b0e0,0xf0f0f0,0xe8c0c0],sh:0xf0f0f0},
 "FRANKIE'S FISH & CHIPS":{wall:0xf4ecc0,fl:'tile',cnt:0xaab2b8,top:0xd8dcde,pal:[0xe0c030,0xc02020,0xf0f0f0],back:0,left:0,sh:0xf2f2f2},
 'BAKERY':{wall:0xf2dcbc,fl:'wood',cnt:0x9a6a3a,top:0xc8e4f0,pal:[0xc89048,0xe0b060,0x8a5a28,0xf0d8a0,0xd8a050],sh:0xffffff},
 'NEWSAGENT':{wall:0xe6e4f2,fl:'carpet',cnt:0x1a3a7a,top:0xc9c9d4,pal:[0xd04030,0x3070d0,0xe0c030,0x40a050,0xf0f0f0,0x9050b0],left:0,sh:0x2a4a8a},
 'CAFE':{wall:0xe8d0ae,fl:'wood',cnt:0x5a3a22,top:0xc8a070,pal:[0xf0e0c0,0xa06030],back:0,left:0,sh:0x8a3a2a},
 'HAIRDRESSER':{wall:0xf2dcea,fl:'tile',cnt:0xf0f0f4,top:0xe0a0c0,pal:[0xd070a0,0x70b0e0,0xf0f0f0],back:0,left:0,sh:0x222230},
 'BUTCHER':{wall:0xf4f4f0,fl:'tile2',cnt:0xf0f0f0,top:0xc8c8cc,pal:[0xb03030,0xd05050],back:0,left:0,sh:0xffffff},
 'FLORIST':{wall:0xe0f0d8,fl:'stone',cnt:0xc8a878,top:0xdac090,pal:[0xe04070,0xf0c030,0xa050c0],back:0,left:0,sh:0x3a7a3a},
 'ESTATE AGENT':{wall:0xdee4ee,fl:'carpet',cnt:0xcfd4dc,top:0x40485a,pal:[0xffffff],back:0,left:0,sh:0x222a3a},
 'DELI':{wall:0xe8d0a4,fl:'wood',cnt:0x5a3a22,top:0xd8b078,pal:[0xd0a040,0x8a2a2a,0xe8d890,0x6a8a3a],sh:0xf0f0e0},
 'BOOKSHOP':{wall:0xc8aa86,fl:'wood',cnt:0x4a2c18,top:0x7a5030,pal:[0x3a5a8a],back:0,left:0,sh:0x3a4a6a},
 'VET':{wall:0xe0f0f4,fl:'tile2',cnt:0xf4f4f4,top:0x70b8c8,pal:[0xffffff,0x70b8c8],back:0,left:0,sh:0x1a8a9a},
 'THE ROYAL OAK':{wall:0x7a5030,fl:'wood',cnt:0x3a2210,top:0x6a4020,pal:[0x2a6a2a,0x7a3a10,0xd0d0c0],back:0,left:0,sh:0xb04a3a}};
const TH0={wall:0xffffff,fl:'wood',cnt:0x8a5a2e,top:0xc9a070,pal:[0xd04030,0x3070d0,0xe0c030,0x40a050,0xe08030,0xf0f0f0,0x9050b0],sh:0x3a6ab0};
function spineTex(){return dtex('spine',64,64,c=>{for(let r=0;r<4;r++){c.fillStyle='#2a1a10';c.fillRect(0,r*16+14,64,2);let x=0;while(x<64){const w=2+((x*7+r*5)%4),h=9+((x*3+r)%5),k=(x*37+r*91)%8;c.fillStyle=['#a03030','#2a5a9a','#d0a030','#3a7a4a','#e0d8b0','#6a3a7a','#2a2a30','#c06a30'][k];c.fillRect(x,r*16+14-h,w,h);x+=w+(x%3?0:1)}}})}
function menuTex(t){return dtex('mn'+t,96,64,c=>{c.fillStyle='#1c2a24';c.fillRect(0,0,96,64);c.fillStyle='#f0e8c0';c.font='bold 10px monospace';c.textAlign='left';const L=t==='fish'?['MENU','COD & CHIPS 6.50','SAUSAGE   3.00','CHIPS     2.50','PEAS      1.00']:['TODAY','TEA       1.50','BACON ROLL 3.50','CAKE      2.50','SOUP      4.00'];L.forEach((s,i)=>c.fillText(s,6,13+i*12))})}
function dartTex(){return dtex('dart',32,32,c=>{c.fillStyle='#2a1a10';c.fillRect(0,0,32,32);const cs=['#1a1a1a','#e8e0c0','#b02020','#20803a'];for(let r=15;r>1;r-=3){c.fillStyle=cs[(r/3|0)%4];c.beginPath();c.arc(16,16,r,0,6.3);c.fill()}c.fillStyle='#b02020';c.beginPath();c.arc(16,16,2,0,6.3);c.fill()})}
function houseTex(){return dtex('hp',64,48,c=>{c.fillStyle='#e8eef4';c.fillRect(0,0,64,48);for(let i=0;i<6;i++){const x=(i%3)*21+2,y=(i/3|0)*24+2;c.fillStyle=['#c9a','#9bc','#bd9','#dc9','#acd','#dab'][i];c.fillRect(x,y,19,22);c.fillStyle='#8a4030';c.fillRect(x+3,y+4,13,8);c.fillStyle='#d8d0b8';c.fillRect(x+3,y+12,13,8)}})}
function buildShop(o){while(SG.children.length)SG.remove(SG.children[0]);
 const T=Object.assign({},TH0,TH[o.t]||{}),wood=imat(tWood,1),pub=!!o.pub,B=(x,y,z,w,h,d,hex)=>sbox(x,y,z,w,h,d,fmc(hex)),R=[];
 let hs=0;for(const ch of o.t)hs=(hs*31+ch.charCodeAt(0))>>>0;const rr=()=>(hs=(hs*1664525+1013904223)>>>0)/4294967296,pk=()=>T.pal[Math.floor(rr()*T.pal.length)];
 const fl=new THREE.Mesh(new THREE.PlaneGeometry(2*RX,2*RZ).rotateX(-Math.PI/2),imat(FLR[T.fl]()));SG.add(fl);
 const wm=(tx)=>{const m=imat(tx);m.color.setHex(T.wall);return m};
 splane(2*RX,IH,0,IH/2,-RZ,0,wm(sWl));splane(2*RX,IH,0,IH/2,RZ,Math.PI,wm(sWl));splane(2*RZ,IH,RX,IH/2,0,-Math.PI/2,wm(sWl2));splane(2*RZ,IH,-RX,IH/2,0,Math.PI/2,wm(sWl2));
 const vd=new THREE.Mesh(new THREE.BoxGeometry(90,70,90),new THREE.MeshBasicMaterial({color:0x0d0f18,side:THREE.BackSide,fog:false}));vd.position.y=IH/2;SG.add(vd);
 splane(1.1,2.2,1.6,1.1,RZ-.02,Math.PI,imat(T_FDOOR));splane(1.4,1.1,-2.0,1.5,RZ-.02,Math.PI,inWin);
 splane(3.2,.5,0,2.3,-RZ+.02,0,imat(shopSignTex(o)));
 // counter
 B(0,0,-1.2,5.4,1.0,.7,T.cnt);B(0,1.0,-1.2,5.5,.07,.8,T.top);
 // generic shelving
 if(T.back!==0)for(let sx=-3.4;sx<=3.4;sx+=1.7){sbox(sx,0,-RZ+.35,1.5,1.7,.5,wood);for(let r=0;r<3;r++)for(let k=0;k<4;k++)B(sx-.55+k*.37,.2+r*.5,-RZ+.65,.3,.3,.15,pk())}
 if(T.left!==0){for(let sz=-.2;sz<=1.8;sz+=1.0){sbox(-RX+.3,0,sz,.5,1.5,.9,wood);for(let r=0;r<3;r++)B(-RX+.62,.2+r*.45,sz,.15,.3,.7,pk())};R.push([-RX,-RX+.8,-.9,2.6])}
 // per-shop furnishing
 const K=o.t;
 if(K==='POST OFFICE'){for(const x of[-1.3,1.3])B(x,1.07,-.95,1.0,.6,.03,0xbcd8e8);B(-3.6,0,1.9,.55,1.15,.55,0xc01818);B(-3.6,1.15,1.9,.6,.1,.6,0x801010);R.push([-3.9,-3.3,1.6,2.2]);for(const x of[-1.6,-.2]){B(x,0,.35,.08,.9,.08,0x303038);}B(-.9,.85,.35,1.5,.04,.03,0xd03030);
  splane(1.6,1.1,-RX+.02,1.7,-1.4,Math.PI/2,imat(houseTex()));R.push([-RX,-RX+.6,-.9,1.6])}
 else if(K==='CO-OP'){for(const[ax,az]of[[-2.2,.3],[.3,.3]]){B(ax,0,az,2.2,1.4,.5,0xdcd0b0);for(let r=0;r<3;r++)for(let k=0;k<5;k++)B(ax-.9+k*.45,.2+r*.45,az-.3,.34,.3,.1,pk());R.push([ax-1.1,ax+1.1,az-.3,az+.3])}
  B(3.9,0,.6,.5,1.9,2.4,0xdde8ee);for(let k=0;k<3;k++)B(3.64,.15+k*.6,.6,.04,.5,2.2,0x8ab8d8);R.push([3.6,RX,-.6,1.8]);B(-3.5,0,2.6,.5,.4,.4,0xe03020);B(-3.5,.4,2.6,.5,.4,.4,0xe03020);R.push([-RX,-3.2,-.9,2.6])}
 else if(K==='CHEMIST'){B(-2.6,0,1.0,.5,1.5,.5,0xf0f0f0);for(let r=0;r<3;r++)B(-2.6,.25+r*.45,1.0,.6,.3,.6,pk());R.push([-2.9,-2.3,.7,1.3]);B(RX-.02,1.2,.2,.04,1.1,.3,0x20a050);B(RX-.02,1.55,.2,.04,.3,1.1,0x20a050)}
 else if(K==="FRANKIE'S FISH & CHIPS"){B(0,0,-2.4,3.4,.9,.7,0xa8aeb4);B(-.9,.9,-2.4,.8,.12,.55,0x303338);B(.9,.9,-2.4,.8,.12,.55,0x303338);B(0,1.2,-2.4,2.6,.08,.4,0xffa030);splane(2.2,.95,0,1.5,-RZ+.03,0,imat(menuTex('fish')));B(-1.4,1.07,-1.2,.1,.22,.1,0x2a5a2a);B(-1.15,1.07,-1.2,.1,.22,.1,0x6a3a1a);
  for(const z of[1.2,2.2]){B(-3.5,0,z,.45,.55,.45,0xc02020);B(-3.5,.55,z,.5,.06,.5,0x303030)}R.push([-3.8,-3.1,.9,2.5]);B(-3.5,0,-.2,.5,.4,.5,0xe0c030);R.push([-3.8,-3.1,-.6,.1])}
 else if(K==='BAKERY'){B(0,1.07,-1.2,5.2,.4,.6,0xcde8f4);for(let k=0;k<9;k++)B(-2.3+k*.57,1.07,-1.2,.4,.2,.4,[0xd8a050,0xf0e0b0,0xb06030,0xe8c0c0][k%4]);B(3.5,0,.6,.8,.5,.8,0xa87838);B(3.5,.5,.6,.9,.1,.9,0xc89048);for(let k=0;k<4;k++)B(3.3+(k%2)*.35,.6,.5+(k>>1)*.3,.3,.2,.2,0xd0a050);R.push([3.0,4.0,.1,1.1]);B(-3.5,0,.4,.6,.6,.6,0xf0f0e8);R.push([-3.8,-3.2,.1,.7])}
 else if(K==='NEWSAGENT'){for(let r=0;r<4;r++)for(let k=0;k<9;k++)B(-RX+.5,.3+r*.42,-.5+k*.3,.1,.36,.26,[0xd04030,0x3070d0,0xe0c030,0x40a050,0xf0f0f0,0x9050b0][(k*3+r*2)%6]);B(-RX+.25,0,.8,.5,1.7,3.0,0x8a6a40);R.push([-RX,-RX+.7,-.9,2.4]);B(2.4,0,1.2,.9,.7,.5,0xc9c9d4);for(let k=0;k<4;k++)B(2.1+k*.2,.7,1.2,.18,.05,.4,k%2?0xf0f0f0:0xb8b8c0);R.push([1.9,2.9,.9,1.5]);
  for(let k=0;k<5;k++)B(-2.2+k*.35,1.07,-1.2,.2,.3,.2,[0xd04030,0xe0c030,0x40a050,0xe08030,0x9050b0][k])}
 else if(K==='CAFE'){for(const[tx,tz]of[[-3.0,.3],[-3.0,1.8],[2.9,.7]]){B(tx,0,tz,.8,.7,.8,0xa06030);for(const[cx,cz]of[[-.7,0],[.7,0]])B(tx+cx,0,tz+cz,.4,.45,.4,0x6a3a1a);R.push([tx-.5,tx+.5,tz-.5,tz+.5])}B(-1.0,1.07,-1.2,.6,.5,.5,0xb8b8c0);B(-1.0,1.57,-1.2,.3,.2,.3,0x202024);B(1.0,1.07,-1.2,.5,.3,.4,0xf0e0c0);splane(2.0,.95,0,1.5,-RZ+.03,0,imat(menuTex('cafe')));
  for(let k=0;k<5;k++)B(-3.3+k*.3,1.6,-RZ+.2,.2,.3,.2,0xf0e8d0)}
 else if(K==='HAIRDRESSER'){splane(.01,1.2,-RX+.03,1.5,.6,Math.PI/2,imat(dtex('mir',16,16,c=>{c.fillStyle='#b8d4e4';c.fillRect(0,0,16,16);c.fillStyle='#e8f4fa';c.fillRect(2,2,5,12)})));splane(3.4,1.3,-RX+.03,1.5,.6,Math.PI/2,imat(dtex('mir',16,16,()=>{})));
  for(const z of[-.1,1.5]){B(-3.3,0,z,.7,.45,.6,0x802030);B(-3.65,.45,z,.12,.8,.6,0x802030);B(-3.3,0,z,.2,.3,.2,0x909098);R.push([-3.7,-2.9,z-.4,z+.4])}B(-2.4,0,2.5,.7,.9,.5,0xf4f4f8);R.push([-2.8,-2.0,2.2,2.8]);B(2.9,0,.5,.8,.5,.8,0xe0a0c0);B(2.9,.5,.5,.9,.04,.9,0xf8f8f8);R.push([2.4,3.4,.1,.9])}
 else if(K==='BUTCHER'){for(let k=0;k<6;k++)B(-2.3+k*.8,1.07,-1.2,.5,.16,.4,k%2?0xb03030:0xd05050);for(let k=0;k<5;k++){B(-2+k*1.0,1.55,-RZ+.3,.05,.9,.05,0x909090);B(-2+k*1.0,.6,-RZ+.3,.3,.9,.2,[0xb83838,0xd06060,0xa02828][k%3])}B(2.9,0,.8,.8,.8,.8,0x8a5a2e);B(2.9,.8,.8,.85,.06,.85,0xc8a070);R.push([2.4,3.4,.3,1.3]);B(-3.4,0,1.2,.9,.9,.5,0xe8e8ec);B(-3.4,.9,1.2,.9,.06,.5,0xb0b0b8);R.push([-3.9,-2.9,.9,1.5])}
 else if(K==='FLORIST'){let n=0;for(const[fx,fz]of[[-3.3,.2],[-3.3,1.6],[-2.0,2.2],[3.2,.4],[3.2,1.7],[0,.8]]){B(fx,0,fz,.7,.45,.7,0x3a7a3a);for(let k=0;k<5;k++)B(fx-.22+(k%3)*.22,.45,fz-.15+(k>>1)*.18,.2,.55+(k%2)*.15,.2,[0xe04070,0xf0c030,0xa050c0,0xf08040,0xf0f0f0][(k+n)%5]);n++;R.push([fx-.4,fx+.4,fz-.4,fz+.4])}for(let k=0;k<5;k++)B(-2+k*1.0,1.5,-RZ+.2,.4,.4,.4,0x4a9a4a)}
 else if(K==='ESTATE AGENT'){B(-1.6,1.07,-1.2,.6,.4,.05,0x202228);B(1.4,1.07,-1.2,.6,.4,.05,0x202228);for(const x of[-2.2,0,2.2])splane(1.5,1.1,x,1.7,-RZ+.03,0,imat(houseTex()));B(-3.4,0,1.5,.8,.5,1.6,0x3a4a6a);B(-3.7,.5,1.5,.2,.5,1.6,0x3a4a6a);R.push([-3.9,-3.0,.7,2.3]);B(2.9,0,.4,.6,.7,.6,0x2a2a30);B(2.9,.7,.4,.5,.05,.5,0xd8d8dc);R.push([2.5,3.3,.1,.7])}
 else if(K==='DELI'){for(let k=0;k<7;k++)B(-2.4+k*.8,1.35,-RZ+.3,.1,.5,.1,k%2?0x802828:0xa04030);B(0,1.9,-RZ+.3,5.2,.05,.05,0x303030);for(let k=0;k<5;k++)B(-2+k*.9,1.07,-1.2,.5,.2,.5,[0xe0c050,0xd8b040,0xe8d070][k%3]);for(const[cx,cz]of[[3.4,.4],[3.4,1.3]]){B(cx,0,cz,.7,.5,.7,0x9a6a38);B(cx+.05,.5,cz,.6,.4,.6,0x8a5a28);R.push([cx-.4,cx+.4,cz-.4,cz+.4])}B(-3.4,0,.4,.6,.9,.6,0x6a4a28);R.push([-3.8,-3.0,.0,.8])}
 else if(K==='BOOKSHOP'){for(const x of[-3.0,-1.0,1.0,3.0]){B(x,0,-RZ+.3,1.8,2.1,.45,0x5a3a20);splane(1.7,1.9,x,1.1,-RZ+.55,0,imat(spineTex()))}splane(1.8,1.9,-RX+.5,1.1,1.0,Math.PI/2,imat(spineTex()));B(-RX+.25,0,1.0,.5,2.1,1.9,0x5a3a20);R.push([-RX,-RX+.8,.0,2.0]);B(2.7,0,.9,.8,.75,.8,0x7a3a30);B(2.7,.75,.9,.8,.3,.15,0x7a3a30);R.push([2.3,3.1,.5,1.3])}
 else if(K==='VET'){B(-2.5,0,1.1,1.4,.9,.8,0xc4ccd4);B(-2.5,.9,1.1,1.5,.05,.9,0x70b8c8);R.push([-3.3,-1.7,.6,1.6]);for(let k=0;k<3;k++){B(3.3,k*.5,.4,.8,.45,.7,0x90989e);B(3.0,.1+k*.5,.4,.04,.3,.6,0x303038)}R.push([2.8,3.8,.0,.8]);B(1.0,0,2.0,.5,.15,.5,0x606068);splane(.9,.9,RX-.02,1.6,-.2,-Math.PI/2,imat(dtex('paw',16,16,c=>{c.fillStyle='#70b8c8';c.fillRect(0,0,16,16);c.fillStyle='#fff';c.beginPath();c.arc(8,10,3.5,0,6.3);c.arc(4,6,1.6,0,6.3);c.arc(8,4,1.6,0,6.3);c.arc(12,6,1.6,0,6.3);c.fill()})))}
 else if(pub){for(const[tx,tz]of[[2.6,.9],[-2.2,1.9]]){B(tx,0,tz,.8,.75,.8,0x5a3a20);for(const[sx,sz]of[[-.8,0],[.8,0]])B(tx+sx,0,tz+sz,.4,.45,.4,0x703820);R.push([tx-.5,tx+.5,tz-.5,tz+.5])}
  for(let k=0;k<3;k++)B(-.8+k*.8,1.07,-1.2,.08,.28,.08,0xc8c8cc);for(let k=0;k<14;k++)B(-3.0+k*.45,1.45,-RZ+.3,.14,.42,.14,[0x2a6a2a,0x6a3a10,0x7a8a3a][k%3]);B(-2.8,1.35,-RZ+.3,.0,0,0,0);B(0,1.3,-RZ+.3,6.4,.05,.4,0x3a2210);
  B(3.9,0,-.6,.5,1.3,1.6,0x6a6a6a);B(3.64,.15,-.6,.04,.7,1.0,0xff7020);R.push([3.5,RX,-1.4,.2]);splane(.9,.9,-RX+.03,1.6,.6,Math.PI/2,imat(dartTex()));B(-3.4,0,-.2,.6,1.3,.6,0x5a3a20);R.push([-3.8,-3.0,-.6,.2])}
 // keeper
 const kp=KEEP[o.t]||KGEN[(_kg++)%4];SHOPCUR={o:o,k:kp};
 const shc=T.sh;
 SHK=new THREE.Group();const kb=[[0,0,0,.55,1.0,.32,shc],[0,1.0,0,.3,.3,.3,0xe0b090],[0,1.27,0,.33,.1,.33,[0x3a2a1a,0xb0b0b0,0xc08040][hs%3]]];
 for(const q of kb){const m=sbox(q[0],q[1],q[2],q[3],q[4],q[5],fmc(q[6]));SG.remove(m);SHK.add(m)}
 SHK.position.set(0,0,-2.1);SG.add(SHK);
 const sR=[[-RX-1,RX+1,-RZ-1,-.9]].concat(R);
 IROOM.splice(0,IROOM.length,...sR);
 const wares=pub?['A CUPPA',2]:o.t.indexOf('FISH')>=0?['CHIPS',3]:o.t==='BAKERY'?['A BUN',2]:o.t==='CHEMIST'?['LUCOZADE',2]:o.t==='CAFE'?['A TEA',2]:o.t==='BUTCHER'?['A PASTY',2]:o.t==='FLORIST'?['A DAISY',1]:o.t==='BOOKSHOP'?['A COMIC',1]:o.t==='DELI'?['CHEESE ROLL',3]:['SNACK',1];
 IA.splice(0,IA.length,{r:[-2.6,-.2,-.9,-.3],label:'TALK TO '+kp[0],fn:()=>{say(kp[0],kp[1],3600)}},{r:[.2,2.6,-.9,-.3],label:'BUY '+wares[0]+' £'+wares[1],fn:()=>{if(cash<wares[1]){toast('NOT ENOUGH CASH');return}cash-=wares[1];ST=100;exh=0;beep(520,.12,'square',.06);toast('MMM. STAMINA FULL (-£'+wares[1]+')')}},{r:[1.0,2.2,RZ-.3,RZ],label:'LEAVE',fn:()=>leaveShop()});addVisitors(o)}
function enterShop(o,imm){if(imm!==true){const so=shopOpen(o);if(!so.open){toast('CLOSED'+so.msg);return}}const go=()=>{buildShop(o);if(!_hR){_hR=1}SG.visible=true;GS.inside=1;rain.visible=false;snow.visible=false;IX=3200;P.x=IX+1.6;P.z=IZ+(o.sz||2.3);P.y=IY+.02;P.psi=Math.PI;P.speed=0;P.dir=1;camAng=P.psi;lightMan();setLabels();toast('WELCOME IN!')};imm===true?go():fade(go)}
function leaveShop(imm){const o=SHOPCUR.o,go=()=>{SG.visible=false;GS.inside=0;IX=3000;IROOM.splice(0,IROOM.length,...HOUSE_R);IA.splice(0,IA.length,...HOUSE_A);const sn=Math.sin(o.psi),cs=Math.cos(o.psi);P.x=o.x+sn*.8;P.z=o.z+cs*.8;P.y=gH(P.x,P.z)+.02;P.psi=o.psi;P.speed=0;camAng=o.psi;snow.visible=!!seasonI;applyTOD(todI);setLabels();SHOPCUR=null};imm===true?go():fade(go)}
const HOUSE_R=IROOM.slice(),HOUSE_A=IA.slice();
function updShop(now){if(SHK)SHK.position.y=Math.sin(now*.003)*.015}
/* ---------- cozy life: clock, residents, decor, garden ---------- */
var GT=9,DAY=1,_clk=0,FR={},CHATD={},INV={},DEC={a:0,b:0,c:0,fl:0,co:0,rg:0,li:0},DOWN={};
const DOWS=['MON','TUE','WED','THU','FRI','SAT','SUN'];
function dow(){return(DAY-1)%7}
function hband(){const h=GT;return h<6?2:h<7.5?1:h<17?0:h<19.5?1:2}
function fmtH(h){const a=Math.floor(h),m=Math.round((h-a)*60);return String(a).padStart(2,'0')+':'+String(m).padStart(2,'0')}
const clkEl=document.createElement('div');clkEl.style.cssText='position:absolute;left:max(12px,env(safe-area-inset-left));top:calc(10px + 10vmin);font:bold 2.4vmin monospace;color:#fff;text-shadow:1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000;pointer-events:none;text-align:right';document.getElementById('hud').appendChild(clkEl);
function setClock(i){GT=[12,18,22][i]||12}
function hash(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h}
/* shop hours */
const HRS={"THE ROYAL OAK":[9,23.5],CAFE:[8,16],"FRANKIE'S FISH & CHIPS":[9,21.5],BAKERY:[7,16],NEWSAGENT:[6.5,19],'CO-OP':[7,21],DELI:[8,17],HAIRDRESSER:[9,17]};
const SUNC=['POST OFFICE','BUTCHER','ESTATE AGENT','BOOKSHOP','VET','CHEMIST','HAIRDRESSER','DELI','BAKERY'];
function shopOpen(o){const h=HRS[o.t]||[8,18],sun=dow()===6&&SUNC.includes(o.t),ok=!sun&&GT>=h[0]&&GT<h[1];return{open:ok,msg:sun?' (SUNDAY)':' · OPENS '+fmtH(h[0])}}
function shopLabel(o){return shopOpen(o).open?(o.pub?'ENTER PUB':'ENTER SHOP'):'CLOSED'}
/* friendship */
function lvl(n){return Math.min(5,Math.floor((FR[n]||0)/3))}
function hearts(n){const l=lvl(n);return'♥'.repeat(l)+'♡'.repeat(5-l)}
function friendGain(n,a){const o=lvl(n);FR[n]=(FR[n]||0)+a;if(lvl(n)>o)toast('♥ '+n+' LIKES YOU MORE!')}
const WARM=["Come round for tea anytime!","You're practically family now.","Take this, it's homemade!","The village loves you, you know."];
const SCHED=[{n:'OLD TOM',v:'THE ROYAL OAK',h:[17,23]},{n:'KEV THE BUILDER',v:'THE ROYAL OAK',h:[18,23]},{n:'MRS PATEL',v:'CAFE',h:[9,14]},{n:'NANA JOY',v:'CAFE',h:[10,15]},{n:'MRS COLLINS',v:'BAKERY',h:[8,12]},{n:'MR HUGHES',v:'NEWSAGENT',h:[7,10]},{n:'MISS ADEBAYO',v:'POST OFFICE',h:[10,16]},{n:'DAVE & SUE',v:"FRANKIE'S FISH & CHIPS",h:[12,20]},{n:'LADY HARGREAVES',v:'FLORIST',h:[11,15]},{n:'MR OKAFOR',v:'CHEMIST',h:[9,17]},{n:'LITTLE JOSH',v:'CO-OP',h:[15,18]},{n:'THE VICAR',v:'DELI',h:[12,14]}];
const PRODN={carrot:'bunch of carrots',tomato:'basket of tomatoes',flower:'sunflower',pumpkin:'pumpkin'};
function giftItem(){for(const k of['flower','pumpkin','tomato','carrot'])if((INV[k]|0)>0)return k;return null}
function chat(n){const c=CUST.find(q=>q[0]===n),l=lvl(n);if(CHATD[n]===DAY){say(n,'Lovely to see you again. Catch up tomorrow?');return}CHATD[n]=DAY;let g=0,t;const it=giftItem();if(it){INV[it]--;g=(typeof GIFTV!=='undefined'&&GIFTV[it])||2;t='Oh, a '+PRODN[it]+'! How thoughtful.'}else t=l>=3?WARM[hash(n+DAY)%4]:c[1][l%2];friendGain(n,1+g);say(n,t,3800)}
function visitor(n,x,z){const hs=hash(n),sh=[0x3a6ab0,0xb04a3a,0x4a8a4a,0x8a5aa0,0xc09030][hs%5],hr=[0x3a2a1a,0xb0b0b0,0xc08040,0x201810][hs%4];
 const P_=[[0,0,.4,.5,.3,0x303040],[0,.5,.5,.58,.3,sh],[0,1.05,.3,.3,.3,0xe0b090],[0,1.32,.33,.1,.33,hr]];for(const q of P_)sbox(x+q[0],q[1],z,q[2],q[3],q[4],fmc(q[5]));
 IROOM.push([x-.28,x+.28,z-.28,z+.28]);IA.push({r:[x-.7,x+.7,z-.7,z+.7],label:()=>'CHAT: '+n+' '+hearts(n),fn:()=>chat(n)})}
function addVisitors(o){let k=0;for(const s of SCHED){if(s.v!==o.t||GT<s.h[0]||GT>=s.h[1])continue;const x=[-.4,.9,-1.8][k++];if(x==null)break;visitor(s.n,x,1.5)}}
/* panel helpers */
function dRow(lbl,btns){const r=document.createElement('div');r.className='shrow';const l=document.createElement('span');l.textContent=lbl;r.append(l);for(const b of btns){const e=document.createElement('button');e.textContent=b[0];if(b[2])e.className='on';e.onclick=b[1];r.append(e)}document.getElementById('shList').append(r)}
const CUSTOM_SHOP={};
CUSTOM_SHOP.book=function(msg){const T=document.getElementById('shT');T.textContent='VILLAGE BOOK';document.getElementById('shMsg').textContent=msg||(DOWS[dow()]+' '+fmtH(GT)+' · HEARTS GROW WHEN YOU DELIVER & CHAT');for(const c of CUST){const n=c[0],at=SCHED.find(s=>s.n===n&&GT>=s.h[0]&&GT<s.h[1]);dRow(n+'  '+hearts(n),[[at?'AT '+at.v.split(' ')[0]:'AT HOME',()=>{const s=SCHED.find(q=>q.n===n);renderShop(s?'USUALLY AT '+s.v+' '+fmtH(s.h[0])+'-'+fmtH(s.h[1]):'USUALLY AT HOME')},!!at]])}};
/* ---- decor ---- */
const ARTN=[['NONE',0],['LANDSCAPE',8],['SUNFLOWERS',8],['CAT PORTRAIT',10],['STARRY NIGHT',12],['VILLAGE MAP',10]];
const FLN=[['NONE',0],['ARMCHAIR',25],['BEANBAG',15],['SIDE TABLE & VASE',12],['GRAMOPHONE',20]];
const CON=[['NONE',0],['BOOKCASE',30],['TALL PLANT',12]];
const RGN=[['NONE',0],['BLUE CHECK RUG',15],['GREEN STRIPE RUG',15],['PINK RUG',15]];
const LIN=[['NONE',0],['FAIRY LIGHTS',18]];
const DSL=[['a','WALL ART 1',ARTN],['b','WALL ART 2',ARTN],['c','WALL ART 3',ARTN],['fl','FLOOR',FLN],['co','CORNER',CON],['rg','RUG',RGN],['li','LIGHTS',LIN]];
const artTex=[null,
 ptex(32,24,c=>{c.fillStyle='#8cc4ee';c.fillRect(0,0,32,24);c.fillStyle='#6a9a4e';c.fillRect(0,14,32,10);c.fillStyle='#4a7a3a';c.fillRect(2,9,12,7);c.fillStyle='#fff';c.fillRect(20,3,7,3)},false),
 ptex(32,24,c=>{c.fillStyle='#4a7a9a';c.fillRect(0,0,32,24);for(let i=0;i<4;i++){c.fillStyle='#f0c020';c.fillRect(3+i*7,5+(i%2)*3,6,6);c.fillStyle='#5a3a1a';c.fillRect(5+i*7,8+(i%2)*3,2,2);c.fillStyle='#3a8a3a';c.fillRect(5+i*7,11+(i%2)*3,2,10)}},false),
 ptex(32,24,c=>{c.fillStyle='#d8c8a8';c.fillRect(0,0,32,24);c.fillStyle='#808088';c.fillRect(9,6,14,13);c.fillRect(9,3,3,4);c.fillRect(20,3,3,4);c.fillStyle='#e8e0a0';c.fillRect(12,10,3,3);c.fillRect(18,10,3,3);c.fillStyle='#e08080';c.fillRect(15,14,3,2)},false),
 ptex(32,24,c=>{c.fillStyle='#101850';c.fillRect(0,0,32,24);c.fillStyle='#f0e060';for(const[x,y]of[[5,5],[12,10],[20,6],[26,14],[8,17],[16,3]])c.fillRect(x,y,2,2);c.fillStyle='#3060c0';c.fillRect(0,18,32,6)},false),
 ptex(32,24,c=>{c.fillStyle='#e8d8a8';c.fillRect(0,0,32,24);c.fillStyle='#8a6a3a';c.fillRect(4,4,24,1);c.fillRect(4,19,24,1);c.fillStyle='#6a8a5a';c.fillRect(6,8,8,6);c.fillStyle='#4a7ab0';c.fillRect(16,6,9,10);c.fillStyle='#b03030';c.fillRect(13,12,2,2)},false)];
const rugTex=[null,ptex(16,16,c=>{c.fillStyle='#3a5a9a';c.fillRect(0,0,16,16);c.fillStyle='#7a9ad0';for(let x=0;x<16;x+=4)for(let y=0;y<16;y+=4)if((x+y)%8===0)c.fillRect(x,y,4,4)},false),ptex(16,16,c=>{c.fillStyle='#4a8a4a';c.fillRect(0,0,16,16);c.fillStyle='#a8d8a0';for(let x=0;x<16;x+=4)c.fillRect(x,0,2,16)},false),ptex(16,16,c=>{c.fillStyle='#e8a8c0';c.fillRect(0,0,16,16);c.fillStyle='#f8d0e0';c.fillRect(2,2,12,12);c.fillStyle='#e8a8c0';c.fillRect(6,6,4,4)},false)];
const DM={a:null,b:null,c:null,fl:[],co:[],rg:null,li:null};let DECR=[];
{const wd=imat(tWood,1);
 const slots=[[3.35,1.55,Math.PI,0,-1],[-3.5,1.55,Math.PI,0,-1],[RX-.03,1.5,-Math.PI/2,1,0]];
 ['a','b','c'].forEach((k,i)=>{const s=slots[i],g=new THREE.Group(),m=imat(artTex[1]);const pl=new THREE.Mesh(new THREE.PlaneGeometry(.8,.6),m);const fr=new THREE.Mesh(new THREE.PlaneGeometry(.9,.7),imat(null));fr.material.color.setHex(0x5a3a20);
  g.add(fr,pl);pl.position.z=.005;fr.position.z=0;g.position.set(s[0],s[1],i===2?s[0]:RZ-.03);if(i===2){g.position.set(RX-.03,1.5,1.45)}g.rotation.y=s[2];if(i===0)g.position.x=3.35;if(i===1)g.position.x=-3.5;g.visible=false;inG.add(g);DM[k]={g,m}});
 // floor items
 const mk=(fn)=>{const g=new THREE.Group();const keep=inG.children.length;fn();const mv=inG.children.splice(keep);for(const m of mv)g.add(m);g.visible=false;inG.add(g);return g};
 DM.fl[1]=mk(()=>{ibox(2.45,0,.55,.9,.4,.9,fm(0x3a7a4a));ibox(2.45,.4,.95,.9,.6,.2,fm(0x3a7a4a));ibox(2.0,.4,.55,.15,.3,.9,fm(0x2f6a3a));ibox(2.9,.4,.55,.15,.3,.9,fm(0x2f6a3a))});
 DM.fl[2]=mk(()=>{ibox(2.45,0,.55,.8,.5,.8,fm(0xd06a5a));ibox(2.45,.5,.55,.55,.15,.55,fm(0xe08a7a))});
 DM.fl[3]=mk(()=>{ibox(2.45,0,.55,.6,.55,.6,wd);ibox(2.45,.55,.55,.2,.28,.2,fm(0x5a8ab8));ibox(2.45,.83,.55,.06,.25,.06,fm(0x3a8a3a));ibox(2.45,1.0,.55,.2,.15,.2,fm(0xe04070))});
 DM.fl[4]=mk(()=>{ibox(2.45,0,.55,.6,.7,.6,wd);ibox(2.45,.7,.55,.5,.25,.5,fm(0x2a2a30));ibox(2.55,.95,.55,.4,.25,.05,fm(0xd0a030));ibox(2.4,.95,.5,.04,.2,.04,fm(0x909090))});
 DM.co[1]=mk(()=>{ibox(3.82,0,1.55,.5,1.9,1.1,fm(0x5a3a20));const pl=new THREE.Mesh(new THREE.PlaneGeometry(1.0,1.7),imat(spineTex()));pl.position.set(3.56,1.0,1.55);pl.rotation.y=-Math.PI/2;inG.add(pl)});
 DM.co[2]=mk(()=>{ibox(3.8,0,1.55,.5,.45,.5,fm(0xb05a30));ibox(3.8,.45,1.55,.12,.9,.12,fm(0x3a7a2a));ibox(3.8,1.1,1.55,.7,.5,.7,fm(0x3a9a3a));ibox(3.8,1.5,1.55,.45,.4,.45,fm(0x4aaa4a))});
 const rg=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.6).rotateX(-Math.PI/2),imat(rugTex[1]));rg.position.set(.9,.03,.6);rg.visible=false;inG.add(rg);DM.rg=rg;
 DM.li=mk(()=>{for(let i=0;i<16;i++){ibox(-4+i*.5,2.45-Math.abs(Math.sin(i*.9))*.12,-RZ+.06,.07,.07,.05,fm(i%2?0xfff0a0:0xffc080))}for(let i=0;i<12;i++)ibox(RX-.06,2.45-Math.abs(Math.sin(i*.9))*.12,-3.0+i*.5,.05,.07,.07,fm(i%2?0xfff0a0:0xffc080))});
}
function dTrace(){try{for(const r of DECR){for(const A of[IROOM,HOUSE_R]){const i=A.indexOf(r);if(i>=0)A.splice(i,1)}}}catch(e){for(const r of DECR){const i=IROOM.indexOf(r);if(i>=0)IROOM.splice(i,1)}}DECR=[]}
function applyDecor(){['a','b','c'].forEach(k=>{const i=DEC[k],o=DM[k];o.g.visible=i>0;if(i>0){o.m.map=artTex[i];o.m.needsUpdate=true}});
 DM.fl.forEach((g,i)=>{if(g)g.visible=DEC.fl===i});DM.co.forEach((g,i)=>{if(g)g.visible=DEC.co===i});if(DEC.rg>0){DM.rg.material.map=rugTex[DEC.rg];DM.rg.material.needsUpdate=true}DM.rg.visible=DEC.rg>0;DM.li.visible=DEC.li>0;
 dTrace();const add=r=>{DECR.push(r);if(!SHOPCUR&&!(GS.inside&&SG.visible))IROOM.push(r);try{HOUSE_R.push(r)}catch(e){}};
 if(DEC.fl>0)add([2.0,2.9,.1,1.0]);if(DEC.co===1)add([3.55,4.1,.95,2.15]);if(DEC.co===2)add([3.5,4.1,1.25,1.85])}
CUSTOM_SHOP.decor=function(msg){document.getElementById('shT').textContent='DECOR CATALOGUE';document.getElementById('shMsg').textContent=msg||'◀ ▶ TO BROWSE · BUY OR PLACE';
 for(const[k,nm,L]of DSL){const sel=DOWN['s'+k]==null?DEC[k]:DOWN['s'+k],it=L[sel],own=sel===0||DOWN[k+sel];
  dRow(nm+': '+it[0],[['◀',()=>{DOWN['s'+k]=(sel+L.length-1)%L.length;renderShop()}],['▶',()=>{DOWN['s'+k]=(sel+1)%L.length;renderShop()}],[DEC[k]===sel?'PLACED':own?'PLACE':'BUY £'+it[1],()=>{if(DEC[k]===sel)return;if(!own){if(cash<it[1])return renderShop('NOT ENOUGH CASH');cash-=it[1];DOWN[k+sel]=1}DEC[k]=sel;applyDecor();beep(660,.1,'square',.05);renderShop('NICE! LOOKS COZY')},DEC[k]===sel]])}};
/* ---- garden ---- */
const CROPS=[{n:'CARROTS',p:1,d:2,v:4,col:[.95,.5,.15],k:'carrot'},{n:'TOMATOES',p:2,d:3,v:7,col:[.85,.15,.15],k:'tomato'},{n:'SUNFLOWERS',p:2,d:3,v:9,col:[1,.8,.1],k:'flower'},{n:'PUMPKINS',p:4,d:5,v:20,col:[.92,.5,.1],k:'pumpkin'}];
const GPL=[],gSoil=wmat([.4,.27,.16],{vertexColors:false}),gWet=wmat([.22,.15,.09],{vertexColors:false}),gLeaf=wmat([.25,.6,.2],{vertexColors:false}),gFence=wmat([.55,.4,.25],{vertexColors:false}),gFruit=CROPS.map(c=>wmat(c.col,{vertexColors:false}));
{const gx=[5.0,6.7,8.4],gz=[-10.2,-11.9];for(const lz of gz)for(const lx of gx){const w=LW(lx,lz),g=new THREE.Group();g.position.set(w[0],gH(w[0],w[1])+.02,w[1]);g.rotation.y=HM.th;const soil=new THREE.Mesh(new THREE.BoxGeometry(1.35,.1,1.35),gSoil);soil.position.y=.05;g.add(soil);const pl=[];for(let i=0;i<4;i++){const px=(i%2?.3:-.3),pz=(i>>1?.3:-.3),st=new THREE.Mesh(new THREE.BoxGeometry(.14,1,.14),gLeaf);st.position.set(px,.1,pz);const fr=new THREE.Mesh(new THREE.BoxGeometry(.2,.2,.2),gFruit[0]);fr.position.set(px,.2,pz);g.add(st,fr);pl.push([st,fr])}scene.add(g);GPL.push({g,soil,pl,x:w[0],z:w[1],crop:-1,gr:0,wet:0})}
 // British fences: white picket (front / gate side) + close-boarded timber (back / west)
 const pkT=new THREE.CanvasTexture((()=>{const c=document.createElement('canvas');c.width=48;c.height=32;const x=c.getContext('2d');x.fillStyle='#d8d8d0';x.fillRect(0,9,48,2);x.fillRect(0,23,48,2);x.fillStyle='#f4f4ee';for(let i=0;i<6;i++){const px=i*8+1;x.fillRect(px,6,6,26);x.beginPath();x.moveTo(px,6);x.lineTo(px+3,1);x.lineTo(px+6,6);x.fill();x.fillStyle='#c8c8c0';x.fillRect(px+5,6,1,26);x.fillStyle='#f4f4ee'}return c})()),cbT=new THREE.CanvasTexture((()=>{const c=document.createElement('canvas');c.width=32;c.height=64;const x=c.getContext('2d');const cs=['#7a5a38','#6a4a2c','#8a6a44','#74522f'];for(let i=0;i<8;i++){x.fillStyle=cs[i%4];x.fillRect(i*4,0,4,64);x.fillStyle='#3a2814';x.fillRect(i*4+3,0,1,64)}x.fillStyle='#4a3420';x.fillRect(0,56,32,8);x.fillStyle='#5a4228';x.fillRect(0,0,32,3);return c})());
 for(const t of[pkT,cbT]){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter}
 const pkM=wmat([1.1,1.1,1.1],{vertexColors:false,alphaTest:.5},pkT),cbM=wmat([1,1,1],{vertexColors:false},cbT),pPost=wmat([.95,.95,.92],{vertexColors:false}),tPost=wmat([.38,.27,.16],{vertexColors:false});
 const fence=(a,b,h,pick)=>{const A=LW(a[0],a[1]),Bp=LW(b[0],b[1]),len=Math.hypot(Bp[0]-A[0],Bp[1]-A[1]),mx=(A[0]+Bp[0])/2,mz=(A[1]+Bp[1])/2,gg=new THREE.PlaneGeometry(len,h),uv=gg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)*len*(pick?1:.9));const m=new THREE.Mesh(gg,pick?pkM:cbM);m.position.set(mx,gH(mx,mz)+h/2,mz);m.rotation.y=Math.atan2(-(Bp[1]-A[1]),Bp[0]-A[0]);scene.add(m);
  const n=Math.max(1,Math.round(len/2));for(let i=0;i<=n;i++){const px=A[0]+(Bp[0]-A[0])*i/n,pz=A[1]+(Bp[1]-A[1])*i/n,p=new THREE.Mesh(new THREE.BoxGeometry(.13,h+.12,.13),pick?pPost:tPost);p.position.set(px,gH(px,pz)+(h+.12)/2,pz);scene.add(p)}
  const nc=Math.max(1,Math.round(len/.7));for(let i=0;i<=nc;i++)COL.push([A[0]+(Bp[0]-A[0])*i/nc,A[1]+(Bp[1]-A[1])*i/nc,.32])};
 const x0=3.6,x1=9.7,zN=-8.2,zS=-15.6;
 fence([x0,zS],[x1,zS],1.35,0);fence([x0,zN],[x0,zS],1.35,0);fence([x1,zN],[x1,-9.4],.95,1);fence([x1,-12.0],[x1,zS],.95,1)}
function plotVis(p){p.soil.material=p.wet?gWet:gSoil;const c=p.crop>=0?CROPS[p.crop]:null,f=c?Math.min(1,p.gr/c.d):0,ready=c&&p.gr>=c.d;for(const[st,fr]of p.pl){st.visible=!!c;fr.visible=!!c;if(!c)continue;const h=.08+f*(c.k==='flower'?.9:c.k==='tomato'?.6:.35);st.scale.y=h;st.position.y=.1+h/2;fr.material=gFruit[p.crop];fr.visible=!!ready||(c.k==='flower'&&f>.5);const s=c.k==='pumpkin'?1.6:c.k==='flower'?1.5:1;fr.scale.set(s*(ready?1:.5),s*(ready?(c.k==='flower'?.4:1):.5),s*(ready?1:.5));fr.position.y=c.k==='flower'?.1+h:ready?.2:.15+h*.4}}
function gardenNear(){let b=null,bd=1e9;if(!GS.onFoot)return null;const bw=LW(5.6,-9.0),dd=Math.hypot(P.x-bw[0],P.z-bw[1]);if(dd<1.7)return{d:dd*.5,btn:{label:'ENTER HOUSE',fn:backIn}};for(const p of GPL){const d=Math.hypot(P.x-p.x,P.z-p.z);if(d<bd){bd=d;b=p}}if(!b||bd>1.5)return null;const p=b,c=p.crop>=0?CROPS[p.crop]:null;
 let btn;if(!c)btn={label:'PLANT SEEDS',fn:()=>{GSEL=p;openShop('seeds')}};else if(p.gr>=c.d)btn={label:'HARVEST '+c.n,fn:()=>{cash+=c.v;INV[c.k]=(INV[c.k]|0)+1;p.crop=-1;p.gr=0;p.wet=0;plotVis(p);beep(880,.1,'square',.06);toast('HARVESTED +£'+c.v+' (KEPT 1 FOR GIFTS)')}};else if(!p.wet)btn={label:'WATER '+c.n,fn:()=>{p.wet=1;plotVis(p);beep(420,.1,'sine',.05);toast('WATERED. GROWS OVERNIGHT')}};else btn={label:c.n+': '+(c.d-p.gr)+' DAY(S) LEFT',fn:()=>toast('GROWING NICELY...')};
 return{d:bd,btn}}
var GSEL=null;
CUSTOM_SHOP.seeds=function(msg){document.getElementById('shT').textContent='SEED STALL';document.getElementById('shMsg').textContent=msg||'WATER DAILY. RAIN HELPS TOO.';CROPS.forEach((c,i)=>dRow(c.n+'  '+c.d+' DAYS · SELLS £'+c.v,[['PLANT £'+c.p,()=>{if(cash<c.p)return renderShop('NOT ENOUGH CASH');cash-=c.p;GSEL.crop=i;GSEL.gr=0;GSEL.wet=0;plotVis(GSEL);closeShop();toast('PLANTED '+c.n)}]]))};
function gardenTick(){let rdy=0;for(const p of GPL){if(p.crop<0)continue;if(p.wet||rainI>0)p.gr++;p.wet=0;if(p.gr>=CROPS[p.crop].d)rdy++;plotVis(p)}return rdy}
function newDay(){DAY++;const r=gardenTick();toast('A NEW DAY: '+DOWS[dow()]+(r?' · '+r+' CROP(S) READY!':''))}
function sleepNow(){fade(()=>{if(GT>=6)newDay();GT=7;const b=hband();todI=b;applyTOD(b);inG.visible=true;saveGame()})}
{const bed=IA.find(a=>a.label==='SAVE GAME');if(bed){bed.label='SLEEP & SAVE';bed.fn=sleepNow}
 const nA=[{r:[-2.8,-2.0,.5,1.5],label:'DECOR CATALOGUE',fn:()=>openShop('decor')},{r:[-1.65,-.75,-.15,2.15],label:'VILLAGE BOOK',fn:()=>openShop('book')}];IA.push(...nA);HOUSE_A.push(...nA)}
function updCozy(dt){{const t=performance.now()*.0015;CLS.forEach((g,i)=>{g.rotation.x=Math.sin(t+i*.8)*.1})}if(!_clk){_clk=1;GT=[9,18,22][todI]||9}
 if(!menuOpen&&!busy&&!GAL.on)GT+=dt/30;if(GT>=24){GT-=24;newDay()}
 const b=hband();if(b!==todI&&!GS.inside&&!menuOpen&&!GAL.on&&!busy)applyTOD(b);
 clkEl.textContent=fmtH(GT)+' '+DOWS[dow()]+' · DAY '+DAY}
function cozySave(){return{gt:+GT.toFixed(2),dy:DAY,fr:FR,cd:CHATD,iv:INV,dc:DEC,do:DOWN,gd:GPL.map(p=>[p.crop,p.gr,p.wet])}}
function cozyLoad(z){if(!z)return;GT=z.gt==null?9:z.gt;DAY=z.dy||1;FR=z.fr||{};CHATD=z.cd||{};INV=z.iv||{};Object.assign(DEC,z.dc||{});DOWN=z.do||{};(z.gd||[]).forEach((a,i)=>{if(GPL[i]){GPL[i].crop=a[0];GPL[i].gr=a[1];GPL[i].wet=a[2];plotVis(GPL[i])}});_clk=1;applyDecor();const b=hband();if(b!==todI)applyTOD(b)}
GPL.forEach(plotVis);applyDecor();

/* ---- back door, patio, shed, washing line ---- */
iplane(1.1,2.2,2.2,1.1,-RZ+.04,0,imat(T_FDOOR));
{const bd={r:[1.5,2.9,-RZ,-RZ+.6],label:'BACK DOOR TO GARDEN',fn:()=>goGarden()};IA.push(bd);HOUSE_A.push(bd)}
function goGarden(){fade(()=>{GS.inside=0;inG.visible=false;const w=LW(5.6,-9.0);P.x=w[0];P.z=w[1];P.y=gH(P.x,P.z)+.02;P.psi=Math.atan2(-HM.s,-HM.c);P.speed=0;camAng=P.psi;snow.visible=!!seasonI;applyTOD(todI);setLabels()})}
function backIn(){fade(()=>{GS.inside=1;inG.visible=true;rain.visible=false;snow.visible=false;IX=3000;P.x=IX+2.2;P.z=IZ-2.0;P.y=IY+.02;P.psi=0;P.speed=0;P.dir=1;camAng=P.psi;lightMan();setLabels()})}
const CLS=[];
{const W=(lx,lz)=>LW(lx,lz),put=(g,lx,lz,y,ry)=>{const w=W(lx,lz);g.position.set(w[0],gH(w[0],w[1])+y,w[1]);g.rotation.y=ry==null?HM.th:ry;scene.add(g);return g},bx=(w,h,d,m)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m),at=(m,x,y,z)=>{m.position.set(x,y,z);return m};
 const mSl=wmat([.62,.62,.6],{vertexColors:false}),mWd=wmat([.5,.36,.22],{vertexColors:false}),mWd2=wmat([.62,.46,.28],{vertexColors:false}),mRf=wmat([.28,.3,.32],{vertexColors:false}),mMt=wmat([.5,.52,.55],{vertexColors:false}),mTx=wmat([.85,.85,.82],{vertexColors:false});
 const th=Math.atan2(-HM.s,-HM.c);const door=new THREE.Mesh(new THREE.PlaneGeometry(1.1,2.2),wmat([1,1,1],{vertexColors:false,side:THREE.DoubleSide},T_FDOOR));put(door,5.6,-8.22,1.1,th);
 put(bx(3.6,.05,1.3,mSl),5.9,-8.85,.03);put(bx(1.2,.05,3.2,mSl),9.0+.0,-10.9,.02);put(bx(.9,.05,1.0,mSl),5.6,-9.65,.02);
 // patio table + chairs
 const tb=new THREE.Group();tb.add(at(bx(.85,.06,.85,mWd2),0,.72,0));tb.add(at(bx(.1,.72,.1,mMt),0,.36,0));for(const sx of[-.75,.75]){const c=new THREE.Group();c.add(at(bx(.42,.06,.42,mWd2),0,.45,0));c.add(at(bx(.42,.45,.05,mWd2),0,.7,-.2*Math.sign(sx)));c.position.x=sx;tb.add(c)}put(tb,8.0,-8.95,.05);{const w=W(8.0,-8.95);COL.push([w[0],w[1],.7])}
 // shed
 const sh=new THREE.Group();sh.add(at(bx(1.8,1.85,1.35,mWd),0,.93,0));sh.add(at(bx(.7,1.55,.04,mWd2),-.3,.8,.69));sh.add(at(bx(.04,.06,.2,mMt),-.05,.85,.72));sh.add(at(bx(.4,.35,.04,mTx),.5,1.15,.69));
 for(const sg of[1,-1]){const rp=at(bx(2.1,.07,.95,mRf),0,2.1,sg*.42);rp.rotation.x=-sg*.42;sh.add(rp)}put(sh,5.1,-14.7,0);for(const lx of[4.4,5.1,5.8]){const w=W(lx,-14.7);COL.push([w[0],w[1],.55])}
 // washing line
 for(const lx of[6.9,9.3]){put(bx(.08,2.0,.08,mMt),lx,-14.9,1.0);const w=W(lx,-14.9);COL.push([w[0],w[1],.2])}put(bx(2.4,.02,.02,mTx),8.1,-14.9,1.95);
 [0xd04a4a,0xf0f0f0,0x4a7ac0,0xe8c840,0xf0f0f0,0x7ab04a].forEach((c,i)=>{const g=new THREE.Group(),m=bx(.32,.46,.03,wmat([(c>>16&255)/255,(c>>8&255)/255,(c&255)/255],{vertexColors:false}));m.position.y=-.23;g.add(m);g.rotation.order='YXZ';put(g,7.0+i*.4,-14.9,1.93);CLS.push(g)})}
/* ---- BISCUIT, the house cat ---- */
const CATN='BISCUIT',CAT={pa:0,pD:0,pDay:0,gift:0,loc:'in',x:.75,z:-1.75,psi:2.6,st:'sleep',t:70,love:0,full:0,fD:0,fDay:0,arr:0,goal:null,gt:0,mv:0,ph:0,hp:0,stuck:0};
const CBED=[.75,-1.75],CDIN=[2.2,-RZ+.55],CDOUT=[5.6,-8.75],CNAP=[4.7,-8.95];
// basket
ibox(CBED[0],0,CBED[1],.62,.12,.52,fm(0x8a5a30));ibox(CBED[0],.1,CBED[1],.5,.05,.4,fm(0xb04a4a));
function catMk(M){const g=new THREE.Group(),mc={},mt=c=>mc[c]||(mc[c]=M(c));
 const bx=(w,h,d,c,x,y,z,p)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mt(c));m.position.set(x,y,z);(p||g).add(m);return m};
 const O=0xd98a2e,D=0xa85a1a,W=0xf3eee4,K=0x1a1a10;
 const body=new THREE.Group();body.position.set(0,.1,-.14);g.add(body);
 bx(.15,.15,.34,O,0,.08,.17,body);for(const z of[.07,.17,.27])bx(.152,.02,.05,D,0,.162,z,body);bx(.1,.09,.06,W,0,.06,.33,body);
 const legs=[];for(const[x,z]of[[-.055,.29],[.055,.29],[-.055,.05],[.055,.05]]){const l=new THREE.Group();l.position.set(x,.01,z);bx(.05,.11,.05,O,0,-.055,0,l);bx(.052,.04,.052,W,0,-.09,0,l);body.add(l);legs.push(l)}
 const head=new THREE.Group();head.position.set(0,.14,.36);body.add(head);bx(.15,.13,.12,O,0,0,0,head);
 for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.ConeGeometry(.04,.08,4),mt(O));e.position.set(s*.05,.1,0);e.rotation.y=Math.PI/4;head.add(e);bx(.022,.025,.01,K,s*.04,.015,.062,head)}
 bx(.025,.018,.01,0xf08a8a,0,-.012,.063,head);bx(.07,.035,.01,W,0,-.035,.06,head);
 const tail=new THREE.Group();tail.position.set(0,.11,0);body.add(tail);bx(.04,.04,.14,O,0,0,-.07,tail);
 const t2=new THREE.Group();t2.position.set(0,0,-.14);tail.add(t2);bx(.04,.04,.12,O,0,0,-.06,t2);bx(.042,.042,.03,D,0,0,-.13,t2);
 const spr=(draw)=>{const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');draw(x);const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,fog:false,depthWrite:false}));s.scale.set(.2,.2,1);s.visible=false;g.add(s);return s};
 const hs=spr(x=>{x.fillStyle='#e8344a';x.strokeStyle='#300';x.lineWidth=2;x.beginPath();x.moveTo(16,27);x.bezierCurveTo(2,17,4,5,12,6);x.bezierCurveTo(15,6,16,9,16,10);x.bezierCurveTo(16,9,17,6,20,6);x.bezierCurveTo(28,5,30,17,16,27);x.fill();x.stroke()});
 const zs=spr(x=>{x.font='bold 24px monospace';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#fff';x.strokeStyle='#235';x.lineWidth=4;x.strokeText('z',16,17);x.fillText('z',16,17)});
 g.scale.setScalar(1.2);g.visible=false;return{g,body,head,legs,tail,t2,hs,zs}}
const cIn=catMk(c=>new THREE.MeshBasicMaterial({color:c,fog:false})),cOut=catMk(c=>wmat([(c>>16&255)/255,(c>>8&255)/255,(c&255)/255],{vertexColors:false}));
inG.add(cIn.g);scene.add(cOut.g);
const catLv=()=>Math.min(5,Math.floor(CAT.love/4));
const catHearts=()=>'♥'.repeat(catLv())+'♡'.repeat(5-catLv());
function meow(){beep(760,.1,'sine',.05);setTimeout(()=>beep(560,.18,'sine',.05),90)}
function catNight(){return GT>=22.5||GT<6.5}
function catWhere(){if(GS.inside&&IX===3000)return'in';if(!GS.inside&&GS.onFoot){const dx=P.x-HM.x,dz=P.z-HM.z,lx=dx*HM.c-dz*HM.s,lz=dx*HM.s+dz*HM.c;if(lx>3.2&&lx<10.2&&lz>-16&&lz<-7.6)return'out'}return null}
function catPl(){const w=catWhere();if(!w||w!==CAT.loc)return null;if(w==='in')return[P.x-IX,P.z-IZ];const dx=P.x-HM.x,dz=P.z-HM.z;return[dx*HM.c-dz*HM.s,dx*HM.s+dz*HM.c]}
function catBound(){const R=.16;if(CAT.loc==='in'){CAT.x=Math.max(-3.9,Math.min(3.9,CAT.x));CAT.z=Math.max(-3.0,Math.min(2.9,CAT.z));for(const r of HOUSE_R){const cx=Math.max(r[0],Math.min(CAT.x,r[1])),cz=Math.max(r[2],Math.min(CAT.z,r[3])),dx=CAT.x-cx,dz=CAT.z-cz,dd=Math.hypot(dx,dz);if(dd<R){if(dd>1e-4){CAT.x+=dx/dd*(R-dd);CAT.z+=dz/dd*(R-dd)}else{const a=[CAT.x-r[0],r[1]-CAT.x,CAT.z-r[2],r[3]-CAT.z],m=Math.min(...a),i=a.indexOf(m);if(i===0)CAT.x=r[0]-R;else if(i===1)CAT.x=r[1]+R;else if(i===2)CAT.z=r[2]-R;else CAT.z=r[3]+R}}}}
 else{CAT.x=Math.max(3.9,Math.min(9.4,CAT.x));CAT.z=Math.max(-13.7,Math.min(-8.5,CAT.z));const dx=CAT.x-8.0,dz=CAT.z+8.95,dd=Math.hypot(dx,dz);if(dd<.6&&dd>1e-4){CAT.x=8.0+dx/dd*.6;CAT.z=-8.95+dz/dd*.6}}}
function catFree(x,z){const o=[CAT.x,CAT.z];CAT.x=x;CAT.z=z;catBound();const ok=Math.hypot(CAT.x-x,CAT.z-z)<.02;CAT.x=o[0];CAT.z=o[1];return ok}
function catTurn(a,dt){let d=a-CAT.psi;d=Math.atan2(Math.sin(d),Math.cos(d));CAT.psi+=d*Math.min(1,dt*9)}
function catStep(gx,gz,sp,dt){const dx=gx-CAT.x,dz=gz-CAT.z,d=Math.hypot(dx,dz);if(d<.04)return 0;catTurn(Math.atan2(dx,dz),dt);const s=Math.min(d,sp*dt);CAT.x+=dx/d*s;CAT.z+=dz/d*s;CAT.mv=sp;CAT.ph+=sp*dt*9;catBound();return d-s}
function catSwitch(l){CAT.loc=l;const d=l==='in'?CDIN:CDOUT;CAT.x=d[0];CAT.z=d[1];CAT.goal=null;CAT.psi=l==='in'?0:Math.PI}
function catGo(x,z,sp,cb){CAT.st='go';CAT.gt=0;CAT.goal={x,z,sp,cb}}
function catGoSleep(){const sl=()=>{CAT.st='sleep';CAT.t=catNight()?30:55+Math.random()*50;CAT.psi=Math.random()*6.28};
 if(CAT.loc==='out'){if(catNight()||Math.random()<.5)catGo(CDOUT[0],CDOUT[1],1.5,()=>{catSwitch('in');catGoSleep()});else catGo(CNAP[0],CNAP[1],1.5,sl)}
 else catGo(CBED[0],CBED[1],1.5,sl)}
function catWander(pl){const b=CAT.loc==='in'?[-3.6,3.6,-2.7,2.6]:[4.2,9.0,-13.2,-8.9],cx=pl?pl[0]:CAT.x,cz=pl?pl[1]:CAT.z;CAT.st='wander';CAT.t=9;CAT.gt=0;CAT.goal={x:Math.max(b[0],Math.min(b[1],cx+(Math.random()-.5)*5)),z:Math.max(b[2],Math.min(b[3],cz+(Math.random()-.5)*5)),sp:1.1,cb:()=>{CAT.st='sit';CAT.t=5+Math.random()*8}}}
function catBored(pl){const r=Math.random();if(r<.45)catWander(pl);else if(r<.8)catGoSleep();else{CAT.st='sit';CAT.t=12}}
function catAfter(pl){const r=catNight()?0:Math.random();if(r<.4)catGoSleep();else if(r<.7){if(CAT.loc==='out')catGo(CDOUT[0],CDOUT[1],1.5,()=>{catSwitch('in');catWander(null)});else catWander(pl)}else{CAT.st=pl?'follow':'sit';CAT.t=20}}
function catWarp(pl){for(let k=0;k<12;k++){const a=Math.random()*6.28,x=pl[0]+Math.sin(a)*1.1,z=pl[1]+Math.cos(a)*1.1;if(catFree(x,z)){CAT.x=x;CAT.z=z;break}}CAT.stuck=0}
function updCat(dt){if(menuOpen||GAL.on||!(dt>0))return;dt=Math.min(dt,.1);CAT.t-=dt;CAT.full-=dt;if(CAT.hp>0)CAT.hp-=dt;CAT.mv=0;
 const night=catNight(),wh=catWhere(),S=CAT.st;let pl=catPl();
 if(wh&&wh!==CAT.loc&&S!=='sleep'&&!night){CAT.arr+=dt;if(CAT.arr>2.5){CAT.arr=0;catSwitch(wh);CAT.st='follow';pl=catPl();if(catLv()>=2)meow()}}else CAT.arr=0;
 if(night&&(S==='sit'||S==='follow'||S==='wander'))catGoSleep();
 const s=CAT.st;
 if(s==='sleep'){if(night)CAT.t=Math.max(CAT.t,3);if(CAT.t<=0){CAT.st=pl?'follow':'sit';CAT.t=20;meow()}}
 else if(s==='purr'||s==='eat'){if(pl)catTurn(Math.atan2(pl[0]-CAT.x,pl[1]-CAT.z),dt);if(CAT.t<=0){if(s==='eat'){CAT.st=pl?'follow':'sit';CAT.t=25}else catAfter(pl)}}
 else if(s==='sit'){if(pl){catTurn(Math.atan2(pl[0]-CAT.x,pl[1]-CAT.z),dt);if(Math.hypot(pl[0]-CAT.x,pl[1]-CAT.z)>2.2){CAT.st='follow';CAT.stuck=0}}if(CAT.st==='sit'&&CAT.t<=0)catBored(pl)}
 else if(s==='follow'){if(!pl){CAT.st='sit';CAT.t=15}else{const dx=pl[0]-CAT.x,dz=pl[1]-CAT.z,d=Math.hypot(dx,dz);if(d<1.0){CAT.st='sit';CAT.t=18+Math.random()*25;CAT.stuck=0}else{catStep(pl[0]-dx/d*.8,pl[1]-dz/d*.8,d>4?3:1.6,dt);CAT.stuck+=dt;if(CAT.stuck>7&&d>2.5)catWarp(pl)}}}
 else if(s==='play'){if(!pl||CAT.t<=0){TOY.on=0;CAT.st='sit';CAT.t=3;if(pl)catAfter(pl)}else{CAT.pa+=dt*2.2;TOY.x=pl[0]+Math.sin(CAT.pa)*1.7;TOY.z=pl[1]+Math.cos(CAT.pa)*1.7;TOY.on=1;catStep(TOY.x,TOY.z,3.2,dt)}}
 else if(s==='wander'||s==='go'){CAT.gt+=dt;const g=CAT.goal;if(!g){CAT.st='sit';CAT.t=8}else{const r=catStep(g.x,g.z,g.sp,dt);if(r<.08||CAT.gt>14||(s==='wander'&&CAT.t<=0)){CAT.goal=null;g.cb&&g.cb()}}}
 if(CAT.gift&&pl&&(CAT.st==='sit'||CAT.st==='follow')&&Math.hypot(pl[0]-CAT.x,pl[1]-CAT.z)<1.4)catGiftNow();
 // interaction rect (indoors)
 CATIA.r=(CAT.loc==='in'&&GS.inside&&IX===3000)?[CAT.x-.3,CAT.x+.3,CAT.z-.3,CAT.z+.3]:[99,99,99,99];
 catRender()}
function catRender(){const C=CAT.loc==='in'?cIn:cOut,o=CAT.loc==='in'?cOut:cIn;o.g.visible=false;C.g.visible=true;const st=CAT.st,sl=st==='sleep',sit=st==='sit'||st==='purr',eat=st==='eat',mv=CAT.mv>0.05,t=performance.now()*.001;
 if(CAT.loc==='in'){C.g.position.set(CAT.x,sl?.1:0,CAT.z);C.g.rotation.y=CAT.psi}
 else{const w=LW(CAT.x,CAT.z),a=CAT.psi;C.g.position.set(w[0],gH(w[0],w[1]),w[1]);C.g.rotation.y=Math.atan2(Math.sin(a)*HM.c+Math.cos(a)*HM.s,-Math.sin(a)*HM.s+Math.cos(a)*HM.c)}
 C.legs.forEach((l,i)=>{l.visible=!sl&&!(sit&&i>1);l.rotation.x=mv?Math.sin(CAT.ph+(i===1||i===2?Math.PI:0))*.7:(sit&&i<2?.85:0)});
 C.body.rotation.x=sit?-.85:eat?.3:0;C.body.position.y=sl?.02:sit?.07:.1+(mv?Math.sin(CAT.ph*2)*.008:0);C.body.scale.set(1,sl?.8:1,sl?.75:1);
 C.head.position.set(0,sl?.07:.14,sl?.3:.36);C.head.rotation.x=sl?.7:eat?.9:(sit?.8:0);C.head.rotation.z=st==='purr'?Math.sin(t*8)*.12:0;
 C.tail.rotation.set(sl?.1:.5,sl?1.3:Math.sin(t*(mv?5:2.5))*.3,0);C.t2.rotation.set(sl?0:.7,sl?.9:0,0);
 C.g.scale.set(1.2,1.2*(st==='purr'?1+Math.sin(t*50)*.015:1),1.2);
 C.zs.visible=sl;if(sl){C.zs.position.set(.12,.45+Math.sin(t*1.5)*.04,0)}
 C.hs.visible=CAT.hp>0;if(CAT.hp>0){C.hs.position.set(0,.4+(1.4-CAT.hp)*.3,0);C.hs.material.opacity=Math.min(1,CAT.hp*1.4)}}
// interactions
const CATIA={r:[99,99,99,99],label:()=>CATN+(CAT.st==='sleep'?' (ZZZ) ':' ')+catHearts(),fn:()=>openShop('cat')};IA.push(CATIA);HOUSE_A.push(CATIA);
function catLove(n){const o=catLv();CAT.love+=n;if(catLv()>o)toast('♥ '+CATN+' LOVES YOU MORE!')}
function catFace(){const pl=catPl();if(pl)CAT.psi=Math.atan2(pl[0]-CAT.x,pl[1]-CAT.z)}
function catDoFuss(){closeShop();if(CAT.fDay!==DAY){CAT.fDay=DAY;CAT.fD=0}const sl=CAT.st==='sleep';if(CAT.fD<3){CAT.fD++;catLove(1)}CAT.goal=null;CAT.st='purr';CAT.t=3.4;CAT.hp=1.4;catFace();beep(90,.5,'sawtooth',.025);setTimeout(()=>meow(),250);toast(sl?CATN+' WAKES UP... PURRRR':'PURRRR ♥')}
function catDoTreat(){if(CAT.full>0)return renderShop(CATN+' IS FULL UP. LATER!');if(cash<1)return renderShop('NOT ENOUGH CASH');cash-=1;CAT.full=80;closeShop();CAT.goal=null;CAT.st='eat';CAT.t=2.4;CAT.hp=1.4;catFace();catLove(2);beep(520,.06,'square',.04);toast('NOM NOM NOM ♥')}
CUSTOM_SHOP.cat=function(msg){const lv=catLv();document.getElementById('shT').textContent=CATN+' THE CAT';document.getElementById('shMsg').textContent=msg||(CAT.st==='sleep'?'ZZZ... FAST ASLEEP':CAT.full>0?'CONTENT AND FULL OF TREATS':'LOOKS A BIT PECKISH');
 dRow('LOVE  '+catHearts(),[[CAT.st==='sleep'?'WAKE & FUSS':'FUSS',catDoFuss]]);dRow('CAT TREAT  £1',[['GIVE TREAT',catDoTreat]])};
// garden: cat is a use-target outside
{const g0=gardenNear;gardenNear=function(){const g=g0();if(CAT.loc==='out'&&GS.onFoot&&!GS.inside){const pl=catPl();if(pl){const d=Math.hypot(pl[0]-CAT.x,pl[1]-CAT.z);if(d<1.7&&(!g||d*.5<g.d))return{d:d*.5,btn:{label:CATN+(CAT.st==='sleep'?' (ZZZ) ':' ')+catHearts(),fn:()=>openShop('cat')}}}}return g}}
{const u0=updCozy;updCozy=function(dt){u0(dt);updCat(dt)}}
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.cat={l:CAT.love,fd:CAT.fD,fy:CAT.fDay};return o};cozyLoad=function(z){l0(z);if(z&&z.cat){CAT.love=z.cat.l||0;CAT.fD=z.cat.fd||0;CAT.fDay=z.cat.fy||0}}}

/* ---- toys, gifts, the shed tool store ---- */
const TL={can:0,wand:0,nip:0,fz:0},TOY={on:0,x:0,z:0};
const toyIn=new THREE.Mesh(new THREE.BoxGeometry(.05,.05,.22),new THREE.MeshBasicMaterial({color:0xe8508a,fog:false})),toyOut=new THREE.Mesh(new THREE.BoxGeometry(.05,.05,.22),wmat([.91,.31,.54],{vertexColors:false}));
toyIn.visible=toyOut.visible=false;inG.add(toyIn);scene.add(toyOut);
function toyRender(){toyIn.visible=toyOut.visible=false;if(!TOY.on||CAT.st!=='play')return;const t=performance.now()*.01;if(CAT.loc==='in'){toyIn.position.set(TOY.x,.18+Math.sin(t)*.05,TOY.z);toyIn.rotation.y=t*.3;toyIn.visible=true}else{const w=LW(TOY.x,TOY.z);toyOut.position.set(w[0],gH(w[0],w[1])+.18+Math.sin(t)*.05,w[1]);toyOut.rotation.y=t*.3;toyOut.visible=true}}
{const r0=catRender;catRender=function(){r0();toyRender()}}
function catPlay(kind){closeShop();if(kind==='nip'){if(!TL.nip)return;TL.nip--}else if(!TL.wand)return;if(CAT.pDay!==DAY){CAT.pDay=DAY;CAT.pD=0}CAT.goal=null;CAT.st='play';CAT.t=kind==='nip'?10:7;CAT.pa=0;CAT.hp=1.4;if(CAT.pD<2){CAT.pD++;catLove(kind==='nip'?3:2)}meow();toast(kind==='nip'?CATN+' GOES WILD FOR THE CATNIP!':'CHASE THE FEATHER!')}
{const c0=CUSTOM_SHOP.cat;CUSTOM_SHOP.cat=function(m){c0(m);if(TL.wand)dRow('FEATHER WAND',[['PLAY',()=>catPlay('wand')]]);if(TL.nip)dRow('CATNIP MOUSE x'+TL.nip,[['USE',()=>catPlay('nip')]]);if(!TL.wand&&!TL.nip)dRow('TOYS ARE SOLD IN THE GARDEN SHED',[['OK',()=>renderShop()]])}}
const GIFTS=[['A MOUSE (EEK!)',3],['A FEATHER',2],['A SHINY BUTTON',5],['A LEAF',1],['A SOCK',4],['A PRETTY STONE',8],['A SPRIG OF MINT',6],['A BOTTLE TOP',2]];
function catGiftNow(){CAT.gift=0;const g=GIFTS[Math.floor(Math.random()*GIFTS.length)];cash+=g[1];CAT.hp=1.4;meow();toast(CATN+' BROUGHT YOU '+g[0]+'! +£'+g[1])}
{const n0=newDay;newDay=function(){n0();if(catLv()>=5&&Math.random()<.7)CAT.gift=1}}
{const t0=gardenTick;gardenTick=function(){if(TL.fz){for(const p of GPL)if(p.crop>=0&&(p.wet||rainI>0))p.gr++;TL.fz=0}return t0()}}
CUSTOM_SHOP.shed=function(msg){document.getElementById('shT').textContent='GARDEN SHED';document.getElementById('shMsg').textContent=msg||'TOOLS & CAT TOYS';
 dRow('BIG WATERING CAN  £40',[[TL.can?'OWNED':'BUY',()=>{if(TL.can)return;if(cash<40)return renderShop('NOT ENOUGH CASH');cash-=40;TL.can=1;renderShop('WATERS ALL NEARBY PLOTS AT ONCE')},TL.can]]);
 dRow('FERTILISER  £8',[[TL.fz?'APPLIED':'USE ON ALL',()=>{if(TL.fz)return;if(cash<8)return renderShop('NOT ENOUGH CASH');cash-=8;TL.fz=1;renderShop('WATERED CROPS GROW 1 EXTRA DAY TONIGHT')},TL.fz]]);
 dRow('FEATHER WAND  £12',[[TL.wand?'OWNED':'BUY',()=>{if(TL.wand)return;if(cash<12)return renderShop('NOT ENOUGH CASH');cash-=12;TL.wand=1;renderShop('PLAY WITH '+CATN+' FROM ITS MENU')},TL.wand]]);
 dRow('CATNIP MOUSE  £6  (HAVE '+TL.nip+')',[['BUY',()=>{if(cash<6)return renderShop('NOT ENOUGH CASH');cash-=6;TL.nip++;renderShop('ONE USE. HIDE YOUR SLIPPERS')}]])};
{const g0=gardenNear;gardenNear=function(){let g=g0();if(!GS.onFoot||GS.inside)return g;const w=LW(4.8,-13.6),d=Math.hypot(P.x-w[0],P.z-w[1]);if(d<1.6&&(!g||d*.5<g.d))g={d:d*.5,btn:{label:'GARDEN SHED',fn:()=>openShop('shed')}};
 if(g&&TL.can&&g.btn&&String(g.btn.label).indexOf('WATER ')===0){const f=g.btn.fn;g={d:g.d,btn:{label:g.btn.label.replace('WATER ','WATER ALL · '),fn:()=>{let n=0;for(const p of GPL)if(p.crop>=0&&!p.wet&&p.gr<CROPS[p.crop].d&&Math.hypot(P.x-p.x,P.z-p.z)<2.6){p.wet=1;plotVis(p);n++}beep(420,.1,'sine',.05);toast('WATERED '+n+' PLOT(S). GROWS OVERNIGHT')}}}}
 return g}}
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.tl=[TL.can,TL.wand,TL.nip,TL.fz];o.cg=CAT.gift;return o};cozyLoad=function(z){l0(z);if(z&&z.tl){TL.can=z.tl[0]|0;TL.wand=z.tl[1]|0;TL.nip=z.tl[2]|0;TL.fz=z.tl[3]|0}CAT.gift=z&&z.cg?1:0}}

/* ---- camera occlusion: pull the camera in front of walls ---- */
{const ob=(l0,l1,z0,z1)=>{const a=LW((l0+l1)/2,(z0+z1)/2);OBS.push({x:a[0],z:a[1],c:HM.c,s:HM.s,hw:(l1-l0)/2,hd:(z1-z0)/2})};
 ob(2.5,9.5,-8,0);ob(-2.5,-2.2,-6.3,0);ob(-2.5,2.5,-6.3,-6.0);ob(-2.5,-1.8,-.15,.15);ob(1.8,2.5,-.15,.15);ob(4.2,6.0,-15.4,-14.0)}
let CDsm=4.4;
function camClip(T,d,dt){let tg=d;if(d>1.3){const sx=-Math.sin(camAng),sz=-Math.cos(camAng);for(let r=1.0;r<=d;r+=.25){const x=T.x+sx*r,z=T.z+sz*r;let hit=0;for(let i=0;i<OBS.length;i++){const o=OBS[i],dx=x-o.x,dz=z-o.z;if(dx*dx+dz*dz>900)continue;const lx=dx*o.c-dz*o.s,lz=dx*o.s+dz*o.c;if(Math.abs(lx)<o.hw+.3&&Math.abs(lz)<o.hd+.3){hit=1;break}}if(hit){tg=Math.max(1.0,r-.3);break}}}
 const k=Math.min(1,(dt||.016)*(tg<CDsm?14:2.5));CDsm+=(tg-CDsm)*k;if(CDsm>d)CDsm=d;window.CUP=Math.max(0,Math.min(.7,(3.2-CDsm)*.4));return CDsm}

/* ---- drag to look around, menu helpers ---- */
var CAMD={hold:0,el:0};
{const st=document.getElementById('stage');let id=null,lx=0,ly=0;
 st.addEventListener('pointerdown',e=>{if(id!==null||menuOpen||busy||GAL.on||GS.inside)return;id=e.pointerId;lx=e.clientX;ly=e.clientY;try{st.setPointerCapture(id)}catch(_){}});
 st.addEventListener('pointermove',e=>{if(e.pointerId!==id)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;camAng-=dx*.008;CAMD.el=Math.max(-.6,Math.min(3.2,CAMD.el+dy*.014));CAMD.hold=3.5});
 const up=e=>{if(e.pointerId===id)id=null};st.addEventListener('pointerup',up);st.addEventListener('pointercancel',up);st.addEventListener('lostpointercapture',up)}
document.getElementById('shop').addEventListener('click',e=>{if(e.target.id==='shop')closeShop()});
document.getElementById('savB').onclick=()=>{saveGame()};
var _hint=0;{const u0=updCozy;updCozy=function(dt){u0(dt);if(!_hint&&GS.started&&!menuOpen&&!GS.inside){_hint=1;toast('TIP: DRAG THE SCREEN TO LOOK AROUND')}}}
/* ---- fishing at the pond, village board (resident requests), village projects ---- */
const POND=[GRC[0]+9,GRC[1]-6],PR=5.5,BRD=[GRC[0]+16.5,GRC[1]];
const FISHD=[['ROACH','roach',3,40],['PERCH','perch',5,28],['TROUT','trout',9,16],['PIKE','pike',15,7],['GOLDEN CARP','carp',40,2],['OLD BOOT','boot',1,7]];
for(const f of FISHD)PRODN[f[1]]='fresh '+f[0].toLowerCase();
{const g0=giftItem;giftItem=function(){const g=g0();if(g)return g;for(const k of['carp','pike','trout','perch','roach'])if((INV[k]|0)>0)return k;return null}}
var VP=0,REQ=[],RQDAY=0,FLOG={},ROD=0;const RODN=['TWIG ROD','GOOD ROD','PRO ROD'],RODP=[0,45,120];
const RQN={milk:'BOTTLES OF MILK',egg:'EGGS',carrot:'CARROTS',tomato:'TOMATOES',flower:'SUNFLOWERS',pumpkin:'PUMPKINS',roach:'ROACH',perch:'PERCH',trout:'TROUT',pike:'PIKE'};
const RQW={milk:'for my tea',egg:'for a sponge cake',carrot:'for a big stew',tomato:'for the Sunday salad',flower:'to brighten my window',pumpkin:'for the harvest show',roach:'for my supper',perch:'for a fish pie',trout:'for the vicar\'s tea',pike:'for a special dinner'};
const RQV={milk:4,egg:3,carrot:4,tomato:7,flower:9,pumpkin:20,roach:3,perch:5,trout:9,pike:15};
function genReq(){const used=new Set(REQ.map(r=>r.who)),pool=CUST.filter(c=>!used.has(c[0]));if(!pool.length||REQ.length>=5)return;const c=pool[Math.floor(Math.random()*pool.length)],keys=['carrot','carrot','tomato','tomato','flower','roach','roach','perch','trout','milk','egg','milk','egg'].concat(lvl(c[0])>=2?['pumpkin','pike']:[]),k=keys[Math.floor(Math.random()*keys.length)],n=k==='pumpkin'||k==='pike'||k==='trout'?1:1+Math.floor(Math.random()*(k==='egg'?5:3));REQ.push({who:c[0],k,n,rew:Math.round(RQV[k]*n*1.7+3),vp:k==='pumpkin'||k==='pike'?2:1})}
function rqFill(){while(REQ.length<3)genReq()}
{const n0=newDay;newDay=function(){n0();genReq();if(REQ.length<3)genReq()}}
/* the village board on the green */
const PROJ=[[3,'BUNTING'],[7,'BENCHES BY THE POND'],[12,'FLOWER BEDS'],[18,'LANTERNS'],[26,'FOUNTAIN IN THE POND'],[36,'MARKET STALLS']];
const PRG=[];
{const gy=(x,z)=>gH(x,z),bx=(w,h,d,m)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m),put=(m,x,y,z,ry,grp)=>{m.position.set(x,gy(x,z)+y,z);m.rotation.y=ry||0;(grp||scene).add(m);return m};
 const at=(m,x,y,z)=>{m.position.set(x,y,z);return m};
 const mk=(c)=>wmat([(c>>16&255)/255,(c>>8&255)/255,(c&255)/255],{vertexColors:false});
 const mW=mk(0x7a5230),mW2=mk(0xa07a48),mP=mk(0xf0e8c8),mRd=mk(0xd04a4a),mBl=mk(0x4a7ac0),mYl=mk(0xe8c840),mGr=mk(0x4a9a4a),mPk=mk(0xe880b0),mSt=mk(0x9a9a98),mDk=mk(0x3a3a3c),mLt=mk(0xffe8a0),mWt=mk(0x8ac8f0);
 // board (always there)
 const B=new THREE.Group();for(const sx of[-.9,.9])B.add(at(bx(.12,2.1,.12,mW),sx,1.05,0));B.add(at(bx(2.1,1.3,.08,mW2),0,1.5,0));B.add(at(bx(2.4,.1,.3,mW),0,2.2,0));
 [[-.6,1.8,mP],[0,1.9,mYl],[.6,1.7,mP],[-.4,1.35,mYl],[.4,1.4,mP]].forEach(([x,y,m])=>{const p=bx(.38,.3,.01,m);p.position.set(x,y,.05);B.add(p)});put(B,BRD[0],0,BRD[1],-Math.PI/2);COL.push([BRD[0],BRD[1],1.3]);
 const reg=(i,fn)=>{const g=new THREE.Group();g.visible=false;scene.add(g);fn(g);PRG[i]=g};
 reg(0,g=>{const a=[BRD[0]-1,BRD[1]+3.5],b=[BRD[0]-1,BRD[1]-3.5];for(const p of[a,b])put(bx(.1,3,.1,mW),p[0],1.5,p[1],0,g);const N=14;for(let i=0;i<N;i++){const t=i/(N-1),z=a[1]+(b[1]-a[1])*t,y=2.9-Math.sin(t*Math.PI)*.45,f=bx(.02,.3,.22,[mRd,mBl,mYl,mGr,mPk][i%5]);f.position.set(a[0],gy(a[0],z)+y-.14,z);f.rotation.x=.3;g.add(f)}});
 reg(1,g=>{for(const[x,z,ry]of[[POND[0],POND[1]+PR+1.6,0],[POND[0]+PR+1.6,POND[1],-Math.PI/2],[POND[0]-PR-1.6,POND[1],Math.PI/2]]){const b=new THREE.Group();const s=bx(1.8,.08,.5,mW2);s.position.y=.45;b.add(s);const r=bx(1.8,.4,.06,mW2);r.position.set(0,.8,.25);b.add(r);for(const sx of[-.75,.75]){const l=bx(.08,.45,.45,mW);l.position.set(sx,.22,0);b.add(l)}put(b,x,0,z,ry,g);COL.push([x,z,.8])}});
 reg(2,g=>{for(const[x,z,c]of[[BRD[0]-3,BRD[1]-3.5,mPk],[BRD[0]-3,BRD[1]+3.5,mYl],[POND[0]-3,POND[1]-PR-2.4,mRd],[POND[0]+4,POND[1]-PR-2.4,mBl],[BRD[0]-6,BRD[1]+8,mPk]]){const bed=bx(2.4,.3,1.0,mDk);put(bed,x,.15,z,0,g);for(let i=0;i<7;i++){const f=bx(.22,.22,.22,c);put(f,x-1+i*.33,.45+(i%2)*.08,z+(i%3-1)*.2,0,g)}}});
 reg(3,g=>{for(let a=0;a<4;a++){const ang=a*1.5708+.7,x=POND[0]+Math.cos(ang)*(PR+3),z=POND[1]+Math.sin(ang)*(PR+3);put(bx(.1,2.6,.1,mDk),x,1.3,z,0,g);put(bx(.4,.5,.4,mLt),x,2.8,z,0,g);put(bx(.55,.1,.55,mDk),x,3.1,z,0,g)}});
 const FOUNT=[];reg(4,g=>{put(bx(.6,1.1,.6,mSt),POND[0],.6,POND[1],0,g);put(bx(1.6,.25,1.6,mSt),POND[0],1.2,POND[1],0,g);for(let i=0;i<8;i++){const d=bx(.12,.12,.12,mWt);put(d,POND[0],1.6,POND[1],0,g);FOUNT.push(d)}COL.push([POND[0],POND[1],.9])});
 PRG.fountain=FOUNT;
 reg(5,g=>{for(const[x,z,c]of[[BRD[0]+1,BRD[1]+9,mRd],[BRD[0]+5,BRD[1]+8,mBl]]){const s=new THREE.Group();s.add(at(bx(2.4,.9,1.2,mW2),0,.45,0));for(const[sx,sz]of[[-1.1,-.5],[1.1,-.5],[-1.1,.5],[1.1,.5]])s.add(at(bx(.08,2.2,.08,mW),sx,1.1,sz));for(let i=0;i<6;i++)s.add(at(bx(.45,.06,1.5,i%2?mP:c),-1.0+i*.4,2.3,0));for(let i=0;i<5;i++)s.add(at(bx(.3,.22,.3,[mRd,mYl,mGr,mPk,mBl][i]),-.8+i*.4,1.0,0));put(s,x,0,z,-Math.PI/2,g);COL.push([x,z,1.3])}})}
function projVis(){PRG.forEach((g,i)=>{if(g)g.visible=VP>=PROJ[i][0]})}
function projNext(){for(const p of PROJ)if(VP<p[0])return p;return null}
function addVP(n){const o=VP;VP+=n;projVis();for(const p of PROJ)if(o<p[0]&&VP>=p[0])toast('VILLAGE PROJECT: '+p[1]+'!')}
function haveN(k){return INV[k]|0}
CUSTOM_SHOP.board=function(msg){const T=document.getElementById('shT');T.textContent='VILLAGE BOARD';const nx=projNext();document.getElementById('shMsg').textContent=msg||('VILLAGE PRIDE '+VP+(nx?' · NEXT AT '+nx[0]+': '+nx[1]:' · THE VILLAGE IS LOVELY!'));
 if(!REQ.length)dRow('NO REQUESTS RIGHT NOW',[['OK',()=>renderShop()]]);
 REQ.forEach((r,i)=>{const have=haveN(r.k),ok=have>=r.n;dRow(r.who+': '+r.n+' '+RQN[r.k]+' '+RQW[r.k]+'  £'+r.rew+' ♥',[[ok?'HAND IN':have+'/'+r.n,()=>{if(haveN(r.k)<r.n)return renderShop('YOU NEED '+r.n+' '+RQN[r.k]+' (HAVE '+haveN(r.k)+')');INV[r.k]-=r.n;cash+=r.rew;friendGain(r.who,2);addVP(r.vp);REQ.splice(i,1);beep(880,.1,'square',.06);setTimeout(()=>beep(1180,.14,'square',.05),110);renderShop(r.who+' SAYS THANKS! +£'+r.rew)},ok]])});
 {const ow=ROD<2?RODP[ROD+1]:0;if(ROD<2)dRow('UPGRADE TO '+RODN[ROD+1]+' (BITES FASTER, LONGER TO REEL) £'+ow,[['BUY',()=>{if(cash<ow)return renderShop('NEED £'+ow);cash-=ow;ROD++;renderShop('NOW USING A '+RODN[ROD])},cash>=ow]]);else dRow('YOUR ROD: '+RODN[ROD]+' (BEST)',[['OK',()=>renderShop()]]);dRow('FISH LOG '+Object.keys(FLOG).length+'/'+FISHD.length+': '+FISHD.map(f=>FLOG[f[1]]?f[0]+' x'+FLOG[f[1]]:'???').join(', '),[['OK',()=>renderShop()]])}
 let any=0;for(const f of FISHD){const n=haveN(f[1]);if(n>0&&f[1]!=='boot'||(f[1]==='boot'&&n>0)){any=1;dRow(f[0]+' x'+n+'  £'+f[2]+' EACH',[['SELL 1',()=>{INV[f[1]]--;cash+=f[2];renderShop('SOLD '+f[0]+' +£'+f[2])}],['ALL',()=>{cash+=f[2]*n;INV[f[1]]=0;renderShop('SOLD '+n+' '+f[0]+' +£'+f[2]*n)}]])}}
 if(!any)dRow('FISH FROM THE POND, THEN SELL HERE',[['OK',()=>renderShop()]])};
/* fishing */
const FSH={st:0,t:0,fish:null,tx:0,tz:0,ph:0,res:0};
const bobM=wmat([.9,.15,.15],{vertexColors:false}),bobW=wmat([1,1,1],{vertexColors:false}),ringM=wmat([.8,.9,1],{vertexColors:false,transparent:true,opacity:.7});
const BOB=new THREE.Group();{const a=new THREE.Mesh(new THREE.SphereGeometry(.11,8,6,0,6.283,0,1.571),bobM),b=new THREE.Mesh(new THREE.SphereGeometry(.11,8,6,0,6.283,1.571,1.571),bobW);BOB.add(a,b);BOB.visible=false;scene.add(BOB)}
const RIP=new THREE.Mesh(new THREE.RingGeometry(.2,.28,16).rotateX(-Math.PI/2),ringM);RIP.visible=false;scene.add(RIP);
const LINE=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3(0,1,0)]),new THREE.LineBasicMaterial({color:0xffffff,fog:false}));LINE.visible=false;LINE.frustumCulled=false;scene.add(LINE);

const rodM=wmat([.85,.6,.25],{vertexColors:false}),spM=wmat([.8,.92,1],{vertexColors:false}),FSC={roach:[.75,.78,.82,.5],perch:[.4,.5,.2,.55],trout:[.65,.45,.35,.7],pike:[.3,.45,.25,1],carp:[.95,.75,.1,.9],boot:[.3,.2,.1,.5]};
const ROD1=new THREE.Mesh(new THREE.BoxGeometry(.07,.07,1),rodM),ROD2=new THREE.Mesh(new THREE.BoxGeometry(.045,.045,1),rodM);ROD1.visible=ROD2.visible=false;scene.add(ROD1,ROD2);
const SPL=[];for(let i=0;i<14;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.07,.07,.07),spM);m.visible=false;scene.add(m);SPL.push({m,vx:0,vy:0,vz:0,l:0})}
function splash(x,z,n){let k=0;const y=gH(x,z)+.1;for(const p of SPL){if(p.l>0)continue;p.m.position.set(x,y,z);p.vx=(Math.random()-.5)*1.6;p.vz=(Math.random()-.5)*1.6;p.vy=1.8+Math.random()*1.8;p.l=.7;p.m.visible=true;if(++k>=n)break}RIP2.t=0;RIP2.x=x;RIP2.z=z;RIP2.on=1;beep(220,.12,'sine',.04)}
const RIP2=Object.assign(new THREE.Mesh(new THREE.RingGeometry(.2,.3,18).rotateX(-Math.PI/2),ringM),{t:0,x:0,z:0,on:0});RIP2.visible=false;scene.add(RIP2);
const FISHM=new THREE.Group();{const bd=new THREE.Mesh(new THREE.BoxGeometry(.18,.16,.55),new THREE.MeshBasicMaterial({color:0xffffff}));const tl=new THREE.Mesh(new THREE.BoxGeometry(.04,.22,.16),new THREE.MeshBasicMaterial({color:0xffffff}));tl.position.z=-.34;FISHM.add(bd,tl);FISHM.userData={bd,tl};FISHM.visible=false;scene.add(FISHM)}
function fishTint(f){const c=FSC[f[1]]||FSC.roach;FISHM.userData.bd.material.color.setRGB(c[0],c[1],c[2]);FISHM.userData.tl.material.color.setRGB(c[0]*.8,c[1]*.8,c[2]*.8);FISHM.scale.setScalar((c[3]+.4)*1.3)}
function pondD(){return Math.hypot(P.x-POND[0],P.z-POND[1])}
function pondNear(){if(!GS.onFoot||GS.inside)return null;const d=pondD();if(d>PR+2.6||d<PR-1.5)return null;
 if(FSH.st>=3)return null;if(FSH.st===0)return{d:Math.max(0,d-PR)*.4,btn:{label:'CAST LINE',fn:fishCast}};if(FSH.st===1)return{d:0,btn:{label:'WAITING...',fn:()=>{FSH.st=0;toast('TOO EARLY. NOTHING YET')}}};if(FSH.st===2)return{d:0,btn:{label:'REEL IN!',fn:fishReel}};return null}
function fishCast(){const dx=P.x-POND[0],dz=P.z-POND[1],dl=Math.hypot(dx,dz)||1;FSH.tx=POND[0]-dx/dl*(PR*.5)+(-dz/dl)*(Math.random()-.5)*3;FSH.tz=POND[1]-dz/dl*(PR*.5)+(dx/dl)*(Math.random()-.5)*3;FSH.st=4;FSH.fl=0;FSH.ph=0;P.psi=Math.atan2(-dx,-dz);beep(260,.18,'sawtooth',.03);setTimeout(()=>beep(520,.1,'sine',.03),120)}
function fishPick(){const h=GT,dusk=(h>=5&&h<8.5)||(h>=17&&h<20.5),rain=rainI>0;const w=FISHD.map(f=>{let x=f[3];if((f[1]==='trout'||f[1]==='pike')&&dusk)x*=2.2;if(f[1]==='carp'&&(dusk||rain))x*=2;if(f[1]==='boot'&&rain)x*=.5;return x});let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<w.length;i++){r-=w[i];if(r<=0)return FISHD[i]}return FISHD[0]}
function fishReel(){FSH.st=3;FSH.fl=0;FSH.ph=0;beep(500,.08,'square',.05);if(navigator.vibrate)try{navigator.vibrate(30)}catch(e){}splash(FSH.tx,FSH.tz,10)}
function fishLand(){const f=FSH.fish||FISHD[0];INV[f[1]]=(INV[f[1]]|0)+1;const first=!FLOG[f[1]];FLOG[f[1]]=(FLOG[f[1]]|0)+1;if(first){const b=f[2]*4;cash+=b;setTimeout(()=>toast('NEW IN FISH LOG! BONUS £'+b+' ('+Object.keys(FLOG).length+'/'+FISHD.length+')'),1500);if(Object.keys(FLOG).length===FISHD.length){cash+=100;addVP(3);setTimeout(()=>toast('FISH LOG COMPLETE! +£100'),4000)}}FSH.st=0;FSH.res=1.2;FSH.hold=1.4;FISHM.visible=true;beep(660,.1,'square',.06);setTimeout(()=>beep(880,.12,'square',.05),110);if(f[1]==='carp')setTimeout(()=>{beep(1180,.12,'square',.05);beep(1480,.2,'square',.05)},260);toast(f[1]==='boot'?'AN OLD BOOT. CLASSIC.':'CAUGHT '+(f[0]==='GOLDEN CARP'?'A GOLDEN CARP!!':'A '+f[0]+'!')+' £'+f[2])}
function updFish(dt){if(menuOpen||GAL.on)return;
 if(FSH.res>0)FSH.res-=dt;
 const hs=FSH.hold>0;if(hs)FSH.hold-=dt;
 for(const p of SPL){if(p.l>0){p.l-=dt;p.vy-=9*dt;p.m.position.x+=p.vx*dt;p.m.position.y+=p.vy*dt;p.m.position.z+=p.vz*dt;if(p.l<=0)p.m.visible=false}}
 if(RIP2.on){RIP2.t+=dt;const k=RIP2.t/.9;RIP2.visible=k<1;RIP2.position.set(RIP2.x,gH(RIP2.x,RIP2.z)+.12,RIP2.z);RIP2.scale.setScalar(1+k*5);ringM.opacity=.7*(1-k);if(k>=1){RIP2.on=0;ringM.opacity=.7}}
 if(FSH.st>0&&FSH.st<3){const sp=Math.abs(P.speed||0);if(!GS.onFoot||GS.inside||sp>.7||pondD()>PR+3.2){FSH.st=0}}
 FSH.ph+=dt;
 if(FSH.st>0||hs){let d=(P.psi+1.15)-camAng;d=Math.atan2(Math.sin(d),Math.cos(d));camAng+=d*Math.min(1,dt*3)}
 if(FSH.st===4){FSH.fl+=dt/.7;if(FSH.fl>=1){FSH.fl=1;FSH.st=1;FSH.t=(2.5+Math.random()*4.5)*(1-ROD*.25);FSH.rp=0;splash(FSH.tx,FSH.tz,7);toast('CAST...')}}
 else if(FSH.st===1){FSH.t-=dt;FSH.rp=(FSH.rp||0)+dt;if(FSH.rp>1.6){FSH.rp=0;RIP2.t=0;RIP2.x=FSH.tx;RIP2.z=FSH.tz;RIP2.on=1}if(FSH.t<=0){FSH.st=2;FSH.t=1.2+ROD*.35+Math.random()*.5;FSH.fish=fishPick();beep(900,.08,'square',.06);if(navigator.vibrate)try{navigator.vibrate([60,40,60])}catch(e){}splash(FSH.tx,FSH.tz,4);toast('A BITE! REEL IN!')}}
 else if(FSH.st===2){FSH.t-=dt;if(FSH.t<=0){FSH.st=0;toast('IT GOT AWAY...')}}
 else if(FSH.st===3){FSH.fl+=dt/.85;if(FSH.fl>=1){fishLand()}}
 const on=FSH.st>0||hs;
 // rod
 const rod=FSH.st>0;ROD1.visible=ROD2.visible=rod;BOB.visible=FSH.st>0&&FSH.st!==3&&FSH.st!==0;LINE.visible=FSH.st>0;RIP.visible=FSH.st===2;
 if(FSH.st===3||FSH.st===0)BOB.visible=false;
 if(rod){const sn=Math.sin(P.psi),cs=Math.cos(P.psi),rx=cs,rz=-sn;const hx=P.x+sn*.3+rx*.28,hz=P.z+cs*.3+rz*.28,hy=P.y+1.0;
  let lift=.9,bend=.25;if(FSH.st===4){lift=.9+Math.sin(FSH.fl*3.14)*.7;bend=-.3*Math.sin(FSH.fl*3.14)}if(FSH.st===2){bend=.9+Math.sin(FSH.ph*40)*.15;lift=.6}if(FSH.st===3){bend=1.1;lift=.75+Math.sin(FSH.fl*6)*.1}if(FSH.st===1)bend=.3+Math.sin(FSH.ph*1.7)*.04;
  const dirx=sn*1.1,dirz=cs*1.1,l1=1.7,l2=1.5;
  const e1x=hx+dirx*l1*.8,e1y=hy+lift*l1*.55,e1z=hz+dirz*l1*.8;
  ROD1.position.set((hx+e1x)/2,(hy+e1y)/2,(hz+e1z)/2);ROD1.scale.z=l1;ROD1.lookAt(e1x,e1y,e1z);
  const t2y=e1y+(lift*.5-bend*.9)*l2*.6,t2x=e1x+dirx*l2*.7,t2z=e1z+dirz*l2*.7;
  ROD2.position.set((e1x+t2x)/2,(e1y+t2y)/2,(e1z+t2z)/2);ROD2.scale.z=l2;ROD2.lookAt(t2x,t2y,t2z);
  const wy=gH(FSH.tx,FSH.tz)+.1;let bx=FSH.tx,by=wy,bz=FSH.tz;
  if(FSH.st===4){const k=FSH.fl;bx=t2x+(FSH.tx-t2x)*k;bz=t2z+(FSH.tz-t2z)*k;by=t2y+(wy-t2y)*k+Math.sin(k*3.14)*2.2}
  else if(FSH.st===2){by=wy+Math.sin(FSH.ph*30)*.06-.1;bx+=Math.sin(FSH.ph*23)*.05}
  else if(FSH.st===1)by=wy+Math.sin(FSH.ph*2.2)*.025;
  else if(FSH.st===3){const k=FSH.fl;bx=FSH.tx+(t2x-FSH.tx)*k;bz=FSH.tz+(t2z-FSH.tz)*k;by=wy+Math.sin(k*3.14)*1.6+(t2y-wy)*k*k;
   FISHM.visible=k>.1;FISHM.position.set(bx,by,bz);FISHM.rotation.set(Math.sin(k*9)*.4,Math.atan2(t2x-bx,t2z-bz),Math.cos(k*14)*.5);fishTint(FSH.fish||FISHD[0])}
  BOB.position.set(bx,by,bz);if(FSH.st===3)BOB.visible=false;
  const p=LINE.geometry.attributes.position;p.setXYZ(0,t2x,t2y,t2z);p.setXYZ(1,bx,by+.05,bz);p.needsUpdate=true;
  if(FSH.st===2){RIP.position.set(FSH.tx,wy+.02,FSH.tz);RIP.scale.setScalar(1+((FSH.ph*2)%1)*2.2)}}
 // held-up catch after landing
 if(hs&&FSH.st===0){const sn=Math.sin(P.psi),cs=Math.cos(P.psi);FISHM.position.set(P.x+sn*.2+cs*.55,P.y+2.0+Math.sin(performance.now()*.006)*.05,P.z+cs*.45);FISHM.rotation.set(0,P.psi+1.57,Math.sin(performance.now()*.01)*.15);fishTint(FSH.fish||FISHD[0]);FISHM.visible=true}
 else if(FSH.st===0)FISHM.visible=false;
 if(VP>=PROJ[4][0]&&PRG.fountain){const t=performance.now()*.004;PRG.fountain.forEach((d,i)=>{const ph=(t+i/8*6.28)%6.28,h=Math.sin(ph/2)*1.1;const a=i*.785;d.position.set(POND[0]+Math.cos(a)*(.25+ph*.11),gH(POND[0],POND[1])+1.6+h,POND[1]+Math.sin(a)*(.25+ph*.11))})}}
function boardNear(){if(!GS.onFoot||GS.inside)return null;const d=Math.hypot(P.x-BRD[0],P.z-BRD[1]);if(d>2.8)return null;return{d:d*.5,btn:{label:REQ.length?'VILLAGE BOARD ('+REQ.length+')':'VILLAGE BOARD',fn:()=>openShop('board')}}}
{const g0=gardenNear;gardenNear=function(){const g=g0();let r=g;for(const f of[pondNear,boardNear]){const c=f();if(c&&(!r||c.d<r.d))r=c}return r}}
{const u0=updCozy;updCozy=function(dt){u0(dt);updFish(dt)}}
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.rq=REQ;o.vp=VP;o.fl=FLOG;o.rod=ROD;return o};cozyLoad=function(z){l0(z);if(z&&z.rq){REQ=z.rq;VP=z.vp|0}if(z){FLOG=z.fl||{};ROD=z.rod|0}rqFill();projVis()}}
rqFill();
/* ---- café shift: take the order, make the drink, serve it ---- */
const DRK={TEA:{n:'TEA',st:['CUP','TEABAG','WATER','MILK'],p:4},COFFEE:{n:'COFFEE',st:['CUP','BEANS','WATER'],p:5},LATTE:{n:'LATTE',st:['CUP','BEANS','WATER','MILK'],p:6},CHOC:{n:'HOT CHOC',st:['CUP','CHOCOLATE','MILK'],p:6}};
const DKEYS=Object.keys(DRK),CTB=[[-3.0,.3],[-3.0,1.8],[2.9,.7]],CFN=['SAM','PRIYA','OLLIE','MAISIE','DEV','NELL','BERT','ZARA'],CFC=[0x4a6ab0,0xb04a4a,0x4aa060,0xc09040,0x8a5ab0];
var CF={on:0,cs:[null,null,null],hold:null,brew:[],done:0,earn:0,sp:0,msg:''};
function cafeHud(){let e=document.getElementById('cfhud');if(!e){e=document.createElement('div');e.id='cfhud';e.style.cssText='position:fixed;left:8px;top:132px;font-size:11px;z-index:25;font:bold 12px monospace;color:#fff;background:rgba(40,20,0,.75);border:2px solid #f5e6a0;padding:5px 8px;pointer-events:none;display:none;max-width:44%';document.body.appendChild(e)}
 if(!CF.on||!SHOPCUR){e.style.display='none';return}let t='CAFE SHIFT  '+CF.done+' SERVED  £'+CF.earn;CF.cs.forEach((c,i)=>{if(c)t+='\nTABLE '+(i+1)+': '+(c.st==='wait'?'WANTS TO ORDER':DRK[c.d].n+(CF.hold===c.d?' (YOU HAVE IT)':''))+(c.st!=='wait'?' '+Math.ceil(c.t)+'s':'')});if(CF.hold)t+='\nHOLDING: '+DRK[CF.hold].n;e.style.whiteSpace='pre';e.textContent=t;e.style.display='block'}
function cfSeat(i){const c=CF.cs[i];if(c.mesh)return;const[tx,tz]=CTB[i],sx=tx>0?-.7:.7,g=[],y0=.45,sh=CFC[Math.floor(Math.random()*5)];
 g.push(sbox(tx+sx,y0+.3,tz,.4,.55,.3,fmc(sh)));g.push(sbox(tx+sx,y0+.72,tz,.28,.28,.28,fmc(0xe8b890)));g.push(sbox(tx+sx,y0+.88,tz,.3,.1,.3,fmc([0x3a2a1a,0xc8a050,0x202020,0x8a4a2a][Math.floor(Math.random()*4)])));c.mesh=g}
function cfClear(i){const c=CF.cs[i];if(c&&c.mesh)for(const m of c.mesh)SG.remove(m);CF.cs[i]=null}
function cfNew(){const fr=[];CF.cs.forEach((c,i)=>{if(!c)fr.push(i)});if(!fr.length)return;const i=fr[Math.floor(Math.random()*fr.length)];CF.cs[i]={st:'wait',d:DKEYS[Math.floor(Math.random()*DKEYS.length)],t:45,nm:CFN[Math.floor(Math.random()*CFN.length)]};cfSeat(i);beep(700,.08,'sine',.05);toast('NEW CUSTOMER AT TABLE '+(i+1))}
function cfOrder(i){const c=CF.cs[i];c.st='made';c.t=70;toast(c.nm+': "'+DRK[c.d].n+', PLEASE!"');say(c.nm,'Could I get a '+DRK[c.d].n.toLowerCase()+', please?',2600)}
function cfServe(i){const c=CF.cs[i];if(CF.hold!==c.d){toast('THEY ORDERED '+DRK[c.d].n);return}const tip=c.t>40?3:c.t>20?1:0,pay=DRK[c.d].p+tip;cash+=pay;CF.earn+=pay;CF.done++;CF.hold=null;beep(880,.1,'square',.06);setTimeout(()=>beep(1180,.14,'square',.05),110);toast('SERVED! +£'+pay+(tip?' (TIP £'+tip+')':''));const o=CUST.find(x=>x[0]===c.nm);if(o)friendGain(c.nm,1);cfClear(i);CF.sp=2+Math.random()*3;if(CF.done%4===0)addVP(1)}
function cfEnd(){if(CF.on){toast('SHIFT OVER: '+CF.done+' SERVED, £'+CF.earn);if(CF.done>=5){cash+=10;toast('SHIFT OVER: '+CF.done+' SERVED, £'+CF.earn+' +£10 BONUS')};CF.cs.forEach((c,i)=>{if(c)cfClear(i)})}CF.on=0;CF.hold=null;CF.brew=[];cafeHud()}
CUSTOM_SHOP.brew=function(msg){document.getElementById('shT').textContent='COFFEE MACHINE';const rec=CF.cs.filter(c=>c&&c.st==='made').map(c=>DRK[c.d].n+' ('+DRK[c.d].st.slice(1).join('+')+')');document.getElementById('shMsg').textContent=msg||(rec.length?'ORDERS: '+rec.join(' · '):'TAKE AN ORDER AT A TABLE FIRST');
 dRow('CUP: ['+(CF.brew.join(' + ')||'EMPTY')+']',[['BIN IT',()=>{CF.brew=[];renderShop('TIPPED OUT')}]]);
 const cfDone=m=>{CF.hold=m;CF.brew=[];closeShop();toast('MADE A '+DRK[m].n+'! TAKE IT TO THE TABLE')};
 const add=ing=>()=>{CF.brew.push(ing);beep(400+CF.brew.length*80,.05,'square',.04);const m=DKEYS.find(k=>DRK[k].st.join()===CF.brew.join());if(m&&!DKEYS.some(k=>k!==m&&DRK[k].st.join().indexOf(CF.brew.join()+',')===0)){cfDone(m);return}const ok=DKEYS.some(k=>DRK[k].st.join().indexOf(CF.brew.join())===0);if(!ok){CF.brew=[];beep(150,.2,'sawtooth',.06);renderShop('THAT DOES NOT LOOK RIGHT. BINNED!');return}renderShop('ADDED '+ing)};
 {const em=DKEYS.find(k=>DRK[k].st.join()===CF.brew.join());if(em)dRow('LOOKS LIKE A '+DRK[em].n,[['FINISH IT',()=>cfDone(em),true]])}
 dRow('START',[['CUP',add('CUP')]]);dRow('BASE',[['TEABAG',add('TEABAG')],['BEANS',add('BEANS')],['CHOCOLATE',add('CHOCOLATE')]]);dRow('THEN',[['WATER',add('WATER')],['MILK',add('MILK')]]);
 dRow('TEA: CUP TEABAG WATER MILK',[]);dRow('COFFEE: CUP BEANS WATER',[]);dRow('LATTE: CUP BEANS WATER MILK',[]);dRow('HOT CHOC: CUP CHOCOLATE MILK',[]);dRow('',[['BACK',()=>closeShop()]])};
function cfLabels(){const f=(l,m)=>{const a=IA.find(x=>x.k===l);if(a)a.label=m};CTB.forEach((_,i)=>{const a=IA.find(x=>x.k==='T'+i);if(!a)return;const c=CF.cs[i];a.label=!CF.on?'TABLE':!c?'EMPTY TABLE':c.st==='wait'?'TAKE ORDER ('+c.nm+')':CF.hold===c.d?'SERVE '+DRK[c.d].n:'WAITING FOR '+DRK[c.d].n});const m=IA.find(x=>x.k==='M');if(m)m.label=CF.hold?'MAKE ANOTHER (HOLDING '+DRK[CF.hold].n+')':'MAKE A DRINK'}
function cafeSetup(){if(!SHOPCUR||SHOPCUR.o.t!=='CAFE')return;CF.cs=[null,null,null];const A=[];
 A.push({r:[-2.6,-.2,-.9,-.3],label:'TALK',fn:()=>{}});
 const t0=IA.find(a=>a.label.indexOf('TALK')===0);if(t0){const tf=t0.fn;t0.label=CF.on?'END SHIFT':'START SHIFT (£4+ DRINK)';t0.fn=()=>{if(CF.on){cfEnd();t0.label='START SHIFT (£4+ DRINK)';return}if(GT<7||GT>=19){toast('SHIFTS RUN 7AM-7PM');return}CF.on=1;CF.done=0;CF.earn=0;CF.hold=null;CF.brew=[];CF.sp=1;t0.label='END SHIFT';say(SHOPCUR.k[0],'Apron on! Take orders at the tables, make drinks at the machine.',3500)}}
 IA.push({k:'M',r:[-1.9,.1,-1.9,-.6],label:'MAKE A DRINK',fn:()=>{if(!CF.on){toast('START A SHIFT FIRST (TALK TO THE OWNER)');return}openShop('brew')}});
 CTB.forEach(([tx,tz],i)=>IA.push({k:'T'+i,r:[tx-1.4,tx+1.4,tz-1.0,tz+1.0],label:'TABLE',fn:()=>{const c=CF.cs[i];if(!CF.on)return toast('JUST A TABLE');if(!c)return toast('NOBODY HERE');if(c.st==='wait')cfOrder(i);else cfServe(i)}}));
 const U=IA.splice(IA.length-4,4);IA.unshift(...U);}
{const b0=buildShop;buildShop=function(o){b0(o);if(o.t==='CAFE'){if(CF.on)CF.on=1;cafeSetup()}else if(CF.on)cfEnd()}}
{const l0=leaveShop;leaveShop=function(i){if(CF.on)cfEnd();l0(i)}}
{const u0=updCozy;updCozy=function(dt){u0(dt);if(SHOPCUR&&SHOPCUR.o.t==='CAFE')cfLabels();if(!CF.on||!SHOPCUR||menuOpen){cafeHud();return}CF.sp-=dt;if(CF.sp<=0&&CF.cs.filter(Boolean).length<3){cfNew();CF.sp=7+Math.random()*7}
 CF.cs.forEach((c,i)=>{if(!c)return;if(c.st==='made'){c.t-=dt;if(c.t<=0){toast(c.nm+' GAVE UP AND LEFT');cfClear(i)}}else{c.t-=dt;if(c.t<=0){toast(c.nm+' LEFT, FED UP WAITING');cfClear(i)}}});cafeHud()}}
