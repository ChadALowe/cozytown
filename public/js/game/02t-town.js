/* ================= COZYTOWN =================
   The old village is now the historic heart of a much bigger British seaside town (about 2.1 x 1.4 km):
   the River Coze, a canal with locks and narrowboats, a railway with three stations, a market square with a
   town-hall clock tower, Victorian terraces, estates of semis and cul-de-sacs, a park with a bandstand and
   duck pond, allotments, a retail park, the seafront with beach huts, and hedgerowed countryside with a
   windmill and a country pub. Built into the same 60 m chunks as the village, so it is culled the same way. */
const TOWN={stations:[],xings:[],boats:[],moored:[],sails:null,clock:[],ducks:[],sheep:[]};
const inOld=(x,z,m)=>x>-VH-m&&x<VH+m&&z>-VH-m&&z<VH+m;
function landOK(cx,cz,rot,hw,hd){const c=Math.cos(rot),s=Math.sin(rot);
 for(let a=-1;a<=1.01;a+=.5)for(let b=-1;b<=1.01;b+=1){const lx=a*(hw+6),lz=b*(hd+6),x=cx+lx*c+lz*s,z=cz-lx*s+lz*c;
  if(!landAt(x,z)||inOld(x,z,0)||z>coastZ(x)-26||wetAt(x,z)||Math.abs(z-RAILZ)<9||x<TB.x0+26||x>TB.x1-26||z<TB.z0+26)return false}return true}
const mGrass=wmat(null,null,grassTex),mWater=wmat([1.05,1.05,1.05],{polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1},objTex);
const gk=(x,z)=>{const K=ck(x,z);return K.gr||(K.gr=new CBuilder(8,1))},wk=(x,z)=>{const K=ck(x,z);return K.wa||(K.wa=new CBuilder(6))};
const LWB=(cx,cz,rot)=>{const c=Math.cos(rot),s=Math.sin(rot);return(lx,ly,lz)=>[cx+lx*c+lz*s,Y0+ly,cz-lx*s+lz*c]};
const rr=(a,b)=>a+rnd()*(b-a);
const reserve=(x,z,hw,hd,rot)=>PLACED.push({x,z,rot:rot||0,hw,hd});
const ZONE={park:[-1040,-410,22,190],retail:[612,850,18,132],square:[-56,16,-330,-294],cricket:[-260,-110,-610,-505],windmill:[630,-1140,34],plough:[-790,-1150]};
const inZone=(z_,x,z)=>x>z_[0]&&x<z_[1]&&z>z_[2]&&z<z_[3];

/* ---------------------------------------------------------------- ground */
{const CS=16;for(let gx=-1152;gx<992;gx+=CS)for(let gz=-1184;gz<256;gz+=CS){
  if(gx>=-VH&&gx+CS<=VH&&gz>=-VH&&gz+CS<=VH)continue;const cx=gx+CS/2,cz=gz+CS/2;if(gz>coastZ(cx)+2)continue;
  const col=(x,z)=>{const t=fbm(x*.02+9,z*.02+4),u=fbm(x*.09+3,z*.09+8);let c=mix3([.2,.42,.15],[.28,.5,.2],t);c=mix3(c,[.24,.46,.17],u*.5);
   if(z<-690)c=mix3(c,[.32,.48,.2],.25);if(inZone(ZONE.park,x,z))c=mix3(c,[.3,.56,.22],.55);
   const cz_=coastZ(x),b=sstep(cz_-30,cz_-18,z);if(b>0&&!inOld(x,z,0))c=mix3(c,[.88,.8,.6],b);return c};
  const B=gk(cx,cz),y=Y0,a=[gx,y,gz],b=[gx+CS,y,gz],c=[gx,y,gz+CS],d=[gx+CS,y,gz+CS],chk=((gx/CS+gz/CS)&1)?1.03:.97;
  B.tri(a,b,c,shd(col(gx,gz),chk),shd(col(gx+CS,gz),chk),shd(col(gx,gz+CS),chk),true);B.tri(b,d,c,shd(col(gx+CS,gz),chk),shd(col(gx+CS,gz+CS),chk),shd(col(gx,gz+CS),chk),true)}}

/* ---------------------------------------------------------------- the sea */
{const S=new Builder(6),F=new Builder(6),y=Y0+.015;const cZ=x=>coastZ(Math.max(-1150,Math.min(980,x)));for(let x=-1700;x<1500;x+=10){const z0=cZ(x),z1=cZ(x+10);
  const a=[x,y,Math.min(z0,z1)-1],b=[x+10,y,Math.min(z0,z1)-1],c=[x,y,850],d=[x+10,y,850],col=[.2,.42,.56],cf=[.3,.55,.68];S.tri(a,b,c,cf,cf,col,true);S.tri(b,d,c,cf,col,col,true);
  quadXZ(F,[x,z0-1.2],[x+10,z1-1.2],[x+10,z1+.4],[x,z0+.4],[.92,.95,.96],y+.01)}
 const m=S.mesh(mWater);m.renderOrder=-1;scene.add(m);const fm=F.mesh(wmat([1.1,1.1,1.1],{polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2},objTex));scene.add(fm);TOWN.sea=m;TOWN.foam=fm}

/* ---------------------------------------------------------------- river, canal, ponds: water, embankments, bridges */
const onRoadish=(x,z,m)=>roadDist(x,z)<RW+PW+(m||0);
function waterLine(L,hwF,col,wall){let acc=0;for(let i=0;i<L.length-1;i++){const a=L[i],b=L[i+1],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz),ux=dx/l,uz=dz/l,nx=-uz,nz=ux;
  for(let t=0;t<l;t+=3){const t1=Math.min(l,t+3.2),x0=a[0]+ux*t,z0=a[1]+uz*t,x1=a[0]+ux*t1,z1=a[1]+uz*t1,mx=(x0+x1)/2,mz=(z0+z1)/2,hw=hwF(mz);
   if(onRoadish(mx,mz,.8))continue;const B=wk(mx,mz);quadXZ(B,[x0+nx*hw,z0+nz*hw],[x0-nx*hw,z0-nz*hw],[x1-nx*hw,z1-nz*hw],[x1+nx*hw,z1+nz*hw],shd(col,.96+.08*Math.sin(acc+t*.3)),Y0+.015);
   if(wall)for(const sd of[1,-1]){const ex=mx+nx*sd*(hw+.3),ez=mz+nz*sd*(hw+.3);if(onRoadish(ex,ez,1.2)||!landAt(ex,ez)||ez>coastZ(ex)-1)continue;const K=ck(ex,ez);pbox(K.s,ex,Y0-.1,ez,.55,.55,3.3,[.82,.8,.74],Math.atan2(ux,uz));if((t|0)%6===0)COL.push([ex,ez,.35])}}
  acc+=l}}
waterLine(RIV,z=>rivW(z),[.22,.42,.5],1);
waterLine(CAN,()=>4.2,[.22,.38,.36],1);
for(const p of PONDS){const B=wk(p[0],p[1]);for(let i=0;i<24;i++){const a=i/24*6.2832,b=(i+1)/24*6.2832;B.tri([p[0],Y0+.015,p[1]],[p[0]+Math.cos(a)*p[2],Y0+.015,p[1]+Math.sin(a)*p[3]],[p[0]+Math.cos(b)*p[2],Y0+.015,p[1]+Math.sin(b)*p[3]],[.24,.44,.52],null,null,true);
  const K=ck(p[0]+Math.cos(a)*p[2],p[1]+Math.sin(a)*p[3]);for(let k=0;k<3;k++){const q=a+k*.08,rx=p[0]+Math.cos(q)*(p[2]+.6),rz=p[1]+Math.sin(q)*(p[3]+.6);pbox(K.o,rx,Y0,rz,.12,rr(.8,1.4),.12,[.42,.5,.22])}}}
/* canal towpath (south bank) */
{for(let i=0;i<CAN.length-1;i++){const a=CAN[i],b=CAN[i+1],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz),ux=dx/l,uz=dz/l;for(let t=0;t<l;t+=10){const t1=Math.min(l,t+10.3),x0=a[0]+ux*t,z0=a[1]+uz*t,x1=a[0]+ux*t1,z1=a[1]+uz*t1;if(onRoadish((x0+x1)/2,(z0+z1)/2,1))continue;band(ck((x0+x1)/2,(z0+z1)/2).rd,x0,z0,x1,z1,4.6,7.4,[.62,.56,.44],Y0+.025)}}}
/* bridges: stone parapets wherever a road crosses water */
for(const s of SEG){if(!ROADS[s.ri].nw)continue;let st=-1;for(let t=0;t<=s.l+1;t+=1){const x=s.a[0]+s.dx*Math.min(t,s.l),z=s.a[1]+s.dz*Math.min(t,s.l),w=t<=s.l&&wetAt(x,z);
  if(w&&st<0)st=t;else if(!w&&st>=0){const t0=Math.max(0,st-3),t1=Math.min(s.l,t+3);for(const sd of[1,-1]){const o=RW+PW+.3;for(let u=t0;u<t1;u+=1.5){const x=s.a[0]+s.dx*u-s.dz*sd*o,z=s.a[1]+s.dz*u+s.dx*sd*o,K=ck(x,z);pbox(K.s,x,Y0,z,.5,1.05,1.6,[.86,.82,.72],Math.atan2(s.dx,s.dz));COL.push([x,z,.4])}
    const ex=s.a[0]+s.dx*t0-s.dz*sd*o,ez=s.a[1]+s.dz*t0+s.dx*sd*o;pbox(ck(ex,ez).s,ex,Y0,ez,.8,1.4,.8,[.8,.76,.66]);const fx=s.a[0]+s.dx*t1-s.dz*sd*o,fz=s.a[1]+s.dz*t1+s.dx*sd*o;pbox(ck(fx,fz).s,fx,Y0,fz,.8,1.4,.8,[.8,.76,.66])}
   TOWN.bridges=(TOWN.bridges||0)+1;st=-1}}}
/* canal locks */
for(const lx of[150,650]){const z=plDz(lx),K=ck(lx,z);for(const off of[-9,9])for(const sd of[1,-1]){const gx=lx+off,gz=z+sd*2.1;pbox(K.o,gx,Y0-.2,gz,.5,1.3,4.2,[.12,.1,.09],sd*.35);pbox(K.o,gx,Y0+1.1,gz+sd*3,.25,.25,4.5,[.15,.12,.1]);pbox(K.o,gx,Y0+1.1,gz+sd*5,.27,.27,.6,[.95,.95,.92])}
 for(const sd of[1,-1])pbox(K.s,lx,Y0-.15,z+sd*4.6,22,.4,1.2,[.78,.76,.7]);
 const W=LWB(lx-14,z+16,Math.PI);pbox(K.b,...W(0,0,0),7,3.6,6,[1,.9,.84],Math.PI);pbox(K.r,...W(0,3.6,0),7.6,.25,6.6,[.42,.3,.26],Math.PI);perimCol(lx-14,z+16,Math.PI,3.5,3,.5,1.2);
 reserve(lx-14,z+16,5,4);{const f=W(0,2.2,-3.1);signPlane(K,'LOCK '+(lx<300?'14':'15'),'#14301e','#f0e0a0',1.6,.5,f[0],f[1],f[2],0,128,40)}}
function plDz(x){for(let i=0;i<CAN.length-1;i++){const a=CAN[i],b=CAN[i+1];if(x>=a[0]&&x<=b[0])return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0])}return CAN[CAN.length-1][1]}

/* ---------------------------------------------------------------- the railway */
{const isX=x=>onRoadish(x,RAILZ,1.5);
 for(let x=RAILX0;x<RAILX1;x+=8){const x1=Math.min(RAILX1,x+8.1);if(isX(x+4))continue;const K=ck(x+4,RAILZ);quadXZ(K.rd,[x,RAILZ-2.4],[x1,RAILZ-2.4],[x1,RAILZ+2.4],[x,RAILZ+2.4],[.45,.41,.37],Y0+.035);
  for(const r of[-.72,.72])pbox(K.o,x+4,Y0+.04,RAILZ+r,8.1,.16,.12,[.5,.5,.54]);for(let s=0;s<8;s+=1.6)pbox(K.o,x+s+.4,Y0+.03,RAILZ,.35,.08,2.4,[.3,.22,.16])}
 /* crossings */
 for(const s of SEG){const za=Math.min(s.a[1],s.b[1]),zb=Math.max(s.a[1],s.b[1]);if(za>RAILZ||zb<RAILZ||Math.abs(s.dz)<.3)continue;const t=(RAILZ-s.a[1])/s.dz,x=s.a[0]+s.dx*t;if(x<RAILX0||x>RAILX1)continue;const K=ck(x,RAILZ);
  for(const r of[-.72,.72])pbox(K.o,x,Y0+.06,RAILZ+r,RW*2+2,.04,.12,[.55,.55,.58]);quadXZ(K.rd,[x-RW,RAILZ-2.6],[x+RW,RAILZ-2.6],[x+RW,RAILZ+2.6],[x-RW,RAILZ+2.6],[.3,.3,.32],Y0+.065);
  const X={x,arms:[],lights:[]};for(const sd of[1,-1]){const bx=x+sd*(RW+1.2),bz=RAILZ+sd*6;pbox(K.o,bx,Y0,bz,.3,1.2,.3,[.9,.9,.9]);COL.push([bx,bz,.35]);
   const arm=new THREE.Group();arm.position.set(bx,Y0+1.05,bz);const ab=new Builder(3);for(let i=0;i<6;i++)pbox(ab,-sd*(i+.5)*1.15,0,0,1.15,.18,.12,i%2?[.9,.1,.1]:[.96,.96,.96]);arm.add(ab.mesh(mObj));arm.userData.sd=sd;K.x.push(arm);X.arms.push(arm);
   const sg=new Builder(3);pbox(sg,0,0,0,.12,2.6,.12,[.15,.15,.15]);pbox(sg,0,2.1,0,1.1,.4,.12,[.1,.1,.1]);const sp=sg.mesh(mObj);sp.position.set(bx+sd*1,Y0,bz+sd*.4);K.x.push(sp);
   for(const lx of[-.35,.35]){const l=new THREE.Mesh(new THREE.SphereGeometry(.14,8,6),new THREE.MeshBasicMaterial({color:0x330000}));l.position.set(bx+sd*1+lx,Y0+2.3,bz+sd*.4+sd*.08);K.x.push(l);X.lights.push(l)}}
  TOWN.xings.push(X)}
 /* tunnel portals at each end */
 for(const ex of[RAILX0,RAILX1]){const K=ck(ex,RAILZ),sd=ex<0?-1:1;pbox(K.b,ex+sd*3,Y0,RAILZ,6,9,22,[.72,.4,.32]);pbox(K.o,ex,Y0,RAILZ,.3,5.2,4.4,[.04,.04,.05]);pbox(K.s,ex,Y0+5,RAILZ,.6,.9,6,[.8,.76,.68]);
  for(let k=0;k<14;k++){const z=RAILZ+rr(-30,30),x=ex+sd*rr(6,20);if(Math.abs(z-RAILZ)<4)continue;tree(x,z,1.1+rnd()*.6)}perimCol(ex+sd*3,RAILZ,0,3,11,.6,1.4)}
 /* stations */
 const ST=[{n:'COZYTOWN CENTRAL',bx:4,px:[-6,70],bg:'#0f2a5a',home:1},{n:'WESTBROOK HALT',bx:-738,px:[-750,-686],bg:'#5a1414'},{n:'EASTFIELD',bx:716,px:[690,760],bg:'#14402a'}];
 for(const S of ST){const bz=RAILZ+14,K=ck(S.bx,bz),W=LWB(S.bx,bz,0),w=S.home?26:18,d=9;
  quadXZ(K.rd,[S.px[0],RAILZ+2.6],[S.px[1],RAILZ+2.6],[S.px[1],RAILZ+7.2],[S.px[0],RAILZ+7.2],[.7,.68,.64],Y0+.25);band(K.rd,S.px[0],RAILZ+3,S.px[1],RAILZ+3,-.2,.2,[.95,.85,.2],Y0+.26);
  for(const z of[RAILZ+2.6,RAILZ+7.2])pbox(K.s,(S.px[0]+S.px[1])/2,Y0,z,S.px[1]-S.px[0],.25,.2,[.6,.58,.55]);
  for(let x=S.px[0]+6;x<S.px[1]-4;x+=8){pbox(K.o,x,Y0,RAILZ+6.4,.18,3.4,.18,[.1,.24,.16]);COL.push([x,RAILZ+6.4,.2])}
  pbox(K.o,(S.px[0]+S.px[1])/2,Y0+3.4,RAILZ+5.4,S.px[1]-S.px[0]-6,.18,4.6,[.86,.86,.8]);for(let x=S.px[0]+5;x<S.px[1]-5;x+=2)pbox(K.o,x,Y0+3.2,RAILZ+3.2,1.6,.3,.08,[.93,.93,.9]);
  pbox(K.b,...W(0,0,0),w,6.2,d,[1,.88,.8]);pbox(K.r,...W(0,6.2,0),w+.8,.3,d+.8,[.36,.32,.34]);for(let i=0;i<w/6;i++)pbox(K.o,...W(-w/2+3+i*6,6.5,0),.8,1.4,.8,[.6,.34,.26]);
  for(const sd of[1,-1])for(let i=0;i<Math.floor(w/3.2);i++){const lx=-w/2+1.8+i*3.2;if(sd>0&&Math.abs(lx)<1.6)continue;pbox(K.l,...W(lx,1.3,sd*(d/2+.03)),1.3,1.8,.08,[1,1,1]);pbox(K.o,...W(lx,3.3,sd*(d/2+.03)),1.6,.2,.1,[.96,.95,.9])}
  pbox(K.o,...W(0,0,d/2+.05),2,2.8,.1,[.14,.22,.4]);{const f=W(0,4.6,d/2+.14);signPlane(K,S.n,S.bg,'#ffffff',Math.min(w-2,S.n.length*.62),.9,f[0],f[1],f[2],0,512,56)}
  {const f=W(-w/2-2,2.6,d/2+3);pbox(K.o,f[0],Y0,f[2],.14,2.4,.14,[.2,.2,.2]);signPlane(K,'⇄ TRAINS','#c0141c','#ffffff',1.6,.5,f[0],f[1],f[2],0,128,40)}
  quadXZ(K.rd,[S.bx-w/2-6,bz+d/2],[S.bx+w/2+6,bz+d/2],[S.bx+w/2+6,bz+d/2+14],[S.bx-w/2-6,bz+d/2+14],[.55,.55,.56],Y0+.035);
  perimCol(S.bx,bz,0,w/2,d/2,.5,1.2);BLD.push({x:S.bx,z:bz,rot:0,w,d,k:'station',n:1});OBS.push({x:S.bx,z:bz,c:1,s:0,hw:w/2,hd:d/2});reserve(S.bx,bz+4,w/2+8,d/2+12);reserve((S.px[0]+S.px[1])/2,RAILZ+5,(S.px[1]-S.px[0])/2+2,4);
  S.door=[S.bx,bz+d/2+1.6];S.plat=[(S.px[0]+S.px[1])/2,RAILZ+5];TOWN.stations.push(S)}}

/* ---------------------------------------------------------------- reserved open spaces (so houses keep out) */
reserve(-725,106,318,86);/* crime + secret spots */reserve(-1005,-780,34,28);reserve(922,-800,40,34);reserve(-1095,222,10,10);reserve(938,232,26,16);reserve(731,75,120,58);reserve(-185,-558,80,56);reserve(ZONE.windmill[0],ZONE.windmill[1],40,40);reserve(-20,-312,44,26);reserve(90,-850,40,30);

/* ---------------------------------------------------------------- MARKET PLACE: cobbles, town hall + clock tower, stalls */
{const[x0,x1,z0,z1]=ZONE.square,K=ck(-20,-312);quadXZ(K.rd,[x0,z0],[x1,z0],[x1,z1],[x0,z1],[.6,.56,.5],Y0+.04);
 for(let x=x0+4;x<x1;x+=8)band(K.rd,x,z0,x,z1,-.12,.12,[.5,.47,.42],Y0+.045);
 /* market cross / war memorial */
 pbox(K.s,-20,Y0,-312,4,.5,4,[.8,.78,.72]);pbox(K.s,-20,Y0+.5,-312,2.6,.6,2.6,[.82,.8,.74]);pbox(K.s,-20,Y0+1.1,-312,1,5.5,1,[.85,.83,.77]);pbox(K.s,-20,Y0+5.2,-312,2.4,.5,.5,[.85,.83,.77]);COL.push([-20,-312,2.2]);
 /* stalls */
 const AW=[[[.85,.12,.12],[.96,.96,.94]],[[.1,.45,.2],[.96,.96,.94]],[[.15,.3,.7],[.96,.96,.94]],[[.9,.6,.1],[.96,.96,.94]]],GOODS=[[.85,.15,.1],[.95,.8,.1],[.3,.65,.2],[.6,.35,.2],[.9,.5,.1],[.7,.2,.5]];TOWN.stalls=[];
 for(let i=0;i<10;i++){const sx=x0+7+(i%5)*14.5,sz=i<5?z0+9:z1-9,ry=i<5?0:Math.PI,W=LWB(sx,sz,ry),aw=AW[i%4];
  for(const[a,b]of[[-1.8,-1],[1.8,-1],[-1.8,1],[1.8,1]])pbox(K.o,...W(a,0,b),.1,2.4,.1,[.35,.3,.25],ry);
  pbox(K.o,...W(0,.85,.3),3.8,.12,1.6,[.55,.4,.26],ry);for(let k=0;k<6;k++)pbox(K.o,...W(-1.5+k*.6,.97,.5),.5,.22,.8,GOODS[(i+k)%6],ry);
  for(let k=0;k<6;k++)pbox(K.o,...W(-1.9+k*.66+.33,2.4,0),.66,.12,2.4,aw[k%2],ry);COL.push([sx,sz,1.6]);TOWN.stalls.push([sx,sz,ry])}
 for(const[bx,bz,ry]of[[x0+3,-312,Math.PI/2],[x1-3,-312,-Math.PI/2]])pbox(K.o,bx,Y0+.4,bz,2,.1,.6,[.45,.3,.15],ry);
 /* TOWN HALL with clock tower, on the north side */
 const hx=-20,hz=-336-RW-PW-2-8,W=LWB(hx,hz,0),w=40,d=16,KH=ck(hx,hz),H=10.5;
 pbox(KH.s,...W(0,0,0),w,H,d,[1.02,.98,.9]);pbox(KH.s,...W(0,H,0),w+.6,.6,d+.6,[.9,.86,.78]);pbox(KH.r,...W(0,H+.6,0),w-1,1.6,d-1,[.34,.36,.4]);
 for(let i=0;i<5;i++)pbox(KH.s,...W(-8+i*4,0,d/2+2),1,7.2,1,[1.05,1.02,.95]);pbox(KH.s,...W(0,7.2,d/2+1.4),19,1.2,3.6,[1,.96,.88]);
 {const p=[W(-9.5,8.4,d/2+3.2),W(9.5,8.4,d/2+3.2),W(0,11,d/2+3.2)];KH.s.tri(p[0],p[1],p[2],[.98,.94,.86],null,null,false,W(0,8,0))}
 for(const sd of[1,-1])for(let i=0;i<9;i++){const lx=-w/2+2.5+i*4.4;if(sd>0&&Math.abs(lx)<9.5)continue;for(const ly of[1.6,6]){pbox(KH.l,...W(lx,ly,sd*(d/2+.03)),1.4,2.4,.08,[1,1,1]);pbox(KH.s,...W(lx,ly-.25,sd*(d/2+.08)),1.8,.25,.2,[.9,.86,.78])}}
 pbox(KH.o,...W(0,0,d/2+.05),3,4.2,.1,[.22,.14,.08]);for(let k=0;k<3;k++)pbox(KH.s,...W(0,0,d/2+.4+k*.5),8-k*.6,.18*(3-k),.5,[.85,.82,.76]);
 {const f=W(0,9.2,d/2+3.25);signPlane(KH,'COZYTOWN TOWN HALL','#1a1a20','#f2d27a',9,.7,f[0],f[1],f[2],0,512,40)}
 /* the clock tower */
 const tw=6.4,tb=H+.6;pbox(KH.s,...W(0,tb,0),tw,9,tw,[1.02,.98,.9]);pbox(KH.s,...W(0,tb+9,0),tw+.8,.6,tw+.8,[.9,.86,.78]);pbox(KH.s,...W(0,tb+9.6,0),tw-.6,4,tw-.6,[1,.96,.88]);
 for(const[a,b]of[[-1,-1],[1,-1],[1,1],[-1,1]])pbox(KH.s,...W(a*(tw/2-.6),tb+9.6,b*(tw/2-.6)),.9,4,.9,[1.04,1,.92]);
 {const p=W(0,tb+13.6,0);pcone(KH.r,p[0],p[1],p[2],tw*.62,5,8,[.25,.48,.42],.3927);pcyl(KH.o,p[0],p[1]+5,p[2],.05,2.2,4,[.85,.7,.2]);pbox(KH.o,p[0],p[1]+6.4,p[2],1.4,.06,.06,[.85,.7,.2])}
 const cv=document.createElement('canvas');cv.width=cv.height=128;const ct=new THREE.CanvasTexture(cv);const cm=new THREE.MeshBasicMaterial({map:ct,transparent:true});
 for(let f=0;f<4;f++){const a=f*Math.PI/2,m=new THREE.Mesh(new THREE.CircleGeometry(2.3,28),cm),q=W(Math.sin(a)*(tw/2+.06),tb+5.6,Math.cos(a)*(tw/2+.06));m.position.set(q[0],q[1],q[2]);m.rotation.y=a;KH.x.push(m)}
 TOWN.clock={cv,ct,last:-1};perimCol(hx,hz,0,w/2,d/2,.5,1.2);for(let i=0;i<5;i++)COL.push([W(-8+i*4,0,d/2+2)[0],W(-8+i*4,0,d/2+2)[2],.6]);
 BLD.push({x:hx,z:hz,rot:0,w,d,k:'townhall',n:1});OBS.push({x:hx,z:hz,c:1,s:0,hw:w/2,hd:d/2});reserve(hx,hz,w/2+1,d/2+4);TOWN.hall=[hx,hz+d/2+4]}

/* ---------------------------------------------------------------- shops, pubs and landmarks along the new streets */
TOWNFILL=1;
const S_=(t,bg,fg,col)=>({t,bg,fg:fg||'#ffffff',col});
special({kind:'shop',units:4,w:28,d:10,eaves:6.4,ridge:3.2,fg:.6,wall:'brick',wc:[1,.9,.84],roof:'slate',names:[S_('COZYTOWN BANK','#1a2a5a','#f0d070',[.1,.16,.35]),S_('THE TEA ROOMS','#5a2a4a','#ffe8f0',[.4,.18,.3]),S_('OPTICIANS','#1a5a6a','#fff',[.1,.35,.4]),S_('TOY SHOP','#d02a2a','#ffe040',[.7,.15,.15])]},-62,-312,0,1,1);
special({kind:'shop',units:4,w:28,d:10,eaves:6.4,ridge:3.2,fg:.6,wall:'render',wc:[.96,.92,.84],roof:'tile',names:[S_('HARDWARE','#3a3a3a','#ffd040',[.25,.25,.25]),S_('SWEET SHOP','#e85a9a','#fff',[.8,.3,.55]),S_('RECORD SHOP','#101010','#40e0ff',[.06,.06,.06]),S_('BUILDING SOCIETY','#0a4a3a','#fff',[.05,.3,.22])]},22,-312,0,-1,1);
special({kind:'shop',units:3,w:20,d:9,eaves:6.2,ridge:3,fg:.6,wall:'brick',wc:[.92,.8,.74],roof:'slate',names:[S_('MARKET NEWS','#2a2a6a','#fff',[.16,.16,.42]),S_('BARBER','#a01818','#fff',[.6,.1,.1]),S_('CHARITY SHOP','#3a7a3a','#fff',[.2,.45,.2])]},-45,-288,1,0,1);
special({kind:'shop',units:3,w:20,d:9,eaves:6.2,ridge:3,fg:.6,wall:'render',wc:[.94,.96,.98],roof:'tile',names:[S_('PET SHOP','#d07010','#fff',[.7,.4,.05]),S_('LAUNDERETTE','#2a6ab0','#fff',[.15,.4,.7]),S_('KEBAB HOUSE','#c81e1e','#ffe040',[.7,.1,.1])]},5,-288,1,0,1);
special({kind:'shop',units:5,w:30,d:9,eaves:6.2,ridge:3,fg:.6,wall:'brick',wc:[1,.86,.76],roof:'slate',names:[S_('GREENGROCER','#2a6a1a','#fff',[.15,.4,.1]),S_("BETTY'S CAFE",'#6a3a1a','#fff',[.4,.22,.1]),S_('JEWELLER','#101820','#f2c84a',[.06,.1,.12]),S_('PHONE REPAIRS','#2a2a2a','#40ff80',[.15,.15,.15]),S_('SHOE SHOP','#6a1a3a','#fff',[.4,.1,.22])]},-20,-252,0,-1,1);
special({kind:'shop',units:5,w:30,d:9,eaves:6.2,ridge:3,fg:.6,wall:'render',wc:[.92,.88,.78],roof:'tile',names:[S_('LIBRARY','#1a3a5a','#f0e8c8',[.1,.22,.35]),S_('DENTIST','#2a8ab0','#fff',[.15,.5,.65]),S_('TRAVEL AGENT','#f0a010','#102040',[.85,.55,.05]),S_('WOOL SHOP','#8a3a8a','#fff',[.5,.2,.5]),S_('FISHMONGER','#1a4a7a','#fff',[.1,.28,.45])]},-20,-252,0,-1,-1);
special({kind:'pub',pname:'THE NARROWBOAT',pbg:'#2a1a4a',w:15,d:10,eaves:5.6,ridge:2.8,fg:1.5,wall:'brick',wc:[.9,.74,.66],roof:'slate',hip:1},560,-430,1,0,-1);
special({kind:'pub',pname:'THE RAILWAY TAVERN',pbg:'#4a1a14',w:15,d:10,eaves:5.6,ridge:2.8,fg:1.5,wall:'brick',wc:[.8,.56,.46],roof:'slate',hip:1},-620,-560,1,0,1);
special({kind:'pub',pname:'THE DUKE OF WELLINGTON',pbg:'#14284a',w:15,d:10,eaves:5.6,ridge:2.8,fg:1.5,wall:'render',wc:[.96,.94,.86],roof:'slate',hip:1},-760,-200,1,0,-1);
special({kind:'pub',pname:'THE SHIP INN',pbg:'#0a3a5a',w:15,d:10,eaves:5.6,ridge:2.8,fg:1.5,wall:'render',wc:[.98,.98,.98],roof:'slate',hip:1},560,200,1,0,-1);
special({kind:'shop',units:2,w:13,d:9,eaves:6,ridge:3,fg:.6,wall:'brick',wc:[.85,.62,.52],roof:'slate',names:[S_("PATEL'S NEWS",'#0e4a8a','#fff',[.05,.3,.55]),S_('THE CHIPPY','#f2c814','#a01010',[.9,.78,.1])]},-680,-350,0,1,1);
special({kind:'shop',units:2,w:13,d:9,eaves:6,ridge:3,fg:.6,wall:'brick',wc:[.8,.58,.5],roof:'slate',names:[S_('CORNER SHOP','#1a6a2a','#fff',[.1,.4,.15]),S_('HAIR SALON','#d04a8a','#fff',[.75,.25,.5])]},-520,-232,0,1,-1);
special({kind:'shop',units:2,w:13,d:9,eaves:6,ridge:3,fg:.6,wall:'render',wc:[.95,.9,.82],roof:'tile',names:[S_('SPAR-ISH','#0a5a2a','#ffe040',[.05,.35,.15]),S_('TAKEAWAY','#c02020','#fff',[.7,.1,.1])]},500,-240,0,-1,1);
special({kind:'shop',units:2,w:14,d:9,eaves:6,ridge:3,fg:.6,wall:'render',wc:[.96,.96,.9],roof:'tile',names:[S_('SEAFRONT CHIPS','#0a4a8a','#fff',[.05,.3,.55]),S_('ROCK & FUDGE','#e04a8a','#fff',[.8,.3,.5])]},432,200,1,0,-1);
special({kind:'shop',units:1,w:16,d:10,eaves:6,ridge:3,fg:.6,wall:'render',wc:[.98,.94,.86],roof:'tile',names:[S_('AMUSEMENTS','#5a0a6a','#ffe040',[.35,.05,.4])]},700,200,1,0,-1);
special({kind:'shop',units:1,w:44,d:28,eaves:8,ridge:.6,fg:22,wall:'render',wc:[.92,.94,.96],roof:'slate',names:[S_('COZCO SUPERSTORE','#0a3a8a','#ffffff',[.05,.22,.5])]},600,50,0,1,-1);
special({kind:'shop',units:1,w:28,d:24,eaves:9,ridge:.6,fg:8,wall:'render',wc:[.3,.2,.4],roof:'slate',names:[S_('THE ROXY CINEMA','#1a0a2a','#ff4040',[.14,.05,.2])]},700,140,1,0,-1);
special({kind:'shop',units:1,w:30,d:22,eaves:7,ridge:.6,fg:14,wall:'render',wc:[.95,.6,.2],roof:'slate',names:[S_('DIY DEPOT','#e06010','#ffffff',[.8,.35,.05])]},790,140,1,0,-1);
special({kind:'shop',units:1,w:14,d:12,eaves:5,ridge:.6,fg:10,wall:'render',wc:[.9,.2,.15],roof:'slate',names:[S_('BURGER BARN','#c81e1e','#ffe040',[.7,.1,.1])]},600,115,0,1,1);
special({kind:'church',w:20,d:8.5,eaves:6.5,ridge:3.8,fg:8,wall:'brick',wc:[.82,.55,.45],roof:'slate'},-840,-470,0,1,1);
special({kind:'school',sname:'MEADOW PRIMARY SCHOOL',w:30,d:9,eaves:3.6,ridge:2.2,fg:6,wall:'brick',wc:[.95,.82,.72],roof:'tile',hip:1},760,-200,1,0,1);
special({kind:'shop',units:1,w:24,d:12,eaves:7,ridge:.6,fg:8,wall:'brick',wc:[.75,.78,.9],roof:'slate',names:[S_('COZYTOWN POLICE','#0a2a6a','#ffffff',[.05,.15,.45])]},150,-380,1,0,-1);
/* country pub at the end of Plough Lane */
{const r=ROADS.find(q=>q.n==='PLOUGH LANE'),a=r.p[1],b=r.p[2],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);special({kind:'pub',pname:'THE PLOUGH',pbg:'#3a2a10',w:15,d:10,eaves:4.8,ridge:3,fg:6,wall:'stone',wc:[1,.94,.8],roof:'thatch'},a[0]+dx*.7,a[1]+dz*.7,dx/l,dz/l,1)}
/* farm shop + farmhouse on Moor Lane */
special({kind:'shop',units:1,w:14,d:9,eaves:4.6,ridge:2.6,fg:6,wall:'stone',wc:[1,.94,.8],roof:'slate',names:[S_('MOOR FARM SHOP','#3a5a1a','#fff',[.2,.35,.1])]},-20,-760,0,-1,-1);
TOWNFILL=0;
/* ---------------------------------------------------------------- MORE TOWN: reserved spaces, new landmark buildings */
const ZX={golf:[240,660,-940,-680],caravan:[-220,-70,-1150,-1020],fest:[730,868,-1100,-980],green:[298,-1040,22],lido:[-700,165],mere:[-850,-800]};
reserve(450,-530,200,22);reserve(340,-602,52,30);reserve(470,-602,52,30);reserve(600,-605,26,26);reserve(70,-600,6,6);reserve(-950,-470,8,8);
reserve(-145,-1085,78,58);reserve(450,-810,212,132);reserve(800,-1040,66,58);reserve(298,-1040,24,24);reserve(-700,165,20,14);reserve(-835,-848,22,12);
TOWNFILL=1;
special({kind:'shop',units:1,w:30,d:20,eaves:8,ridge:.6,fg:4,wall:'brick',wc:[.72,.52,.44],roof:'slate',names:[S_('COZYTOWN BOXING CLUB','#101010','#ff3030',[.08,.08,.08])]},120,-560,1,0,-1);
special({kind:'shop',units:1,w:22,d:16,eaves:6.5,ridge:.6,fg:3,wall:'brick',wc:[.6,.66,.6],roof:'slate',names:[S_('THE CUE CLUB','#0a3a1a','#f0e0a0',[.05,.25,.1])]},200,-560,1,0,1);
special({kind:'shop',units:1,w:26,d:16,eaves:7,ridge:.6,fg:3,wall:'render',wc:[.96,.8,.9],roof:'slate',names:[S_('COZY BINGO','#a0106a','#ffe040',[.6,.05,.4])]},-170,-288,1,0,1);
special({kind:'shop',units:1,w:20,d:10,eaves:4.8,ridge:2.4,fg:6,wall:'render',wc:[1,1,.96],roof:'slate',names:[S_('COZY GOLF CLUB','#1a4a2a','#f0e0a0',[.1,.3,.15])]},200,-800,0,1,-1);
{const r=ROADS.find(q=>q.n==='WINDMILL LANE'),a=r.p[0],b=r.p[1],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);
 special({kind:'church',w:16,d:8,eaves:5.6,ridge:3.4,fg:6,wall:'stone',wc:[1.1,1.05,.95],roof:'slate'},a[0]+dx*.22,a[1]+dz*.22,dx/l,dz/l,-1);
 special({kind:'shop',units:1,w:12,d:8,eaves:4.4,ridge:2.6,fg:4,wall:'stone',wc:[1,.94,.8],roof:'thatch',names:[S_('LITTLE COZING STORES','#2a4a1a','#fff',[.15,.3,.1])]},a[0]+dx*.8,a[1]+dz*.8,dx/l,dz/l,-1)}
TOWNFILL=0;

/* ---------------------------------------------------------------- houses along every new street */
for(const r of ROADS)if(/STREET|ROAD$/.test(r.n)&&['GLADSTONE STREET','DICKENS STREET','BRUNEL STREET','VICTORIA ROAD','ALBERT ROAD','QUEEN STREET','WEST STREET','NORTH STREET','BRIDGE STREET','CHAPEL STREET','MARKET PLACE'].includes(r.n))r.tight=1;
const BLD0=BLD.length;
TOWNFILL=1;{const cnt2={};for(const s of SEG){const r=ROADS[s.ri];if(!r.nw||!r.dens||!r.mix||!r.mix.length)continue;const mix=r.mix.filter(k=>KIND[k]);if(!mix.length)continue;
 for(const sd of[1,-1]){let t=5+rnd()*4;while(t<s.l-5){const o=KIND[mix[Math.floor(rnd()*mix.length)]]();if(r.tight&&o.kind==='terr'){o.units=4+Math.floor(rnd()*3);o.w=5*o.units}
  const px=s.a[0]+s.dx*(t+o.w/2),pz=s.a[1]+s.dz*(t+o.w/2),f=frontage(px,pz,s.dx,s.dz,sd,o.fg,o.d);
  if(rnd()<r.dens&&footOK(f.cx,f.cz,f.rot,o.w/2+.8,o.d/2+.8)){o.road=r.n;o.side=sd;bld(f.cx,f.cz,f.rot,o);cnt2[r.n]=(cnt2[r.n]||0)+1;t+=o.w+(r.tight?.4:1+rnd()*4)}else t+=r.rural?14:4}}}TOWN.cnt=cnt2}
TOWNFILL=0;
/* ---------------------------------------------------------------- back gardens: fences, lawns, sheds, washing lines (new-town houses) */
{const HK={terr:1,semi:1,det:1,cot:1,bung:1},PG=new Map(),PC=30;for(const p of PLACED){const r=p.hw+p.hd;for(let a=Math.floor((p.x-r)/PC);a<=Math.floor((p.x+r)/PC);a++)for(let b=Math.floor((p.z-r)/PC);b<=Math.floor((p.z+r)/PC);b++){const k=a*4096+b;let L=PG.get(k);if(!L)PG.set(k,L=[]);L.push(p)}}
 const hit=(x,z,self)=>{const L=PG.get(Math.floor(x/PC)*4096+Math.floor(z/PC));if(L)for(const p of L){if(p===self)continue;if(obbHit({x,z,rot:0,hw:.6,hd:.6},p))return true}return false};
 const FC=[[.45,.32,.2],[.5,.38,.24],[.38,.28,.18]],CL=[[.9,.2,.2],[.95,.95,.95],[.2,.4,.85],[.95,.8,.2],[.4,.7,.4]];let n=0;
 for(let i=BLD0;i<BLD.length;i++){const b=BLD[i];if(!HK[b.k])continue;const s=Math.sin(b.rot),c=Math.cos(b.rot),self=PLACED.find(p=>Math.abs(p.x-b.x)<.01&&Math.abs(p.z-b.z)<.01);
  const W=(lx,lz)=>[b.x+lx*c+lz*s,b.z-lx*s+lz*c];let G=14;
  for(;G>=5;G-=1.5){let ok=true;for(const f of[-.5,0,.5]){const p=W(f*b.w,-b.d/2-G);if(roadDist(p[0],p[1])<RW+PW+1||wetAt(p[0],p[1])||!landAt(p[0],p[1])||Math.abs(p[1]-RAILZ)<6||hit(p[0],p[1],self)){ok=false;break}}if(ok)break}
  if(G<5)continue;n++;{const m=W(0,-b.d/2-G/2),gp={x:m[0],z:m[1],rot:b.rot,hw:b.w/2,hd:G/2+1.2},r=gp.hw+gp.hd;for(let a=Math.floor((gp.x-r)/PC);a<=Math.floor((gp.x+r)/PC);a++)for(let bq=Math.floor((gp.z-r)/PC);bq<=Math.floor((gp.z+r)/PC);bq++){const k=a*4096+bq;let L=PG.get(k);if(!L)PG.set(k,L=[]);L.push(gp)}}const z0=-b.d/2,z1=-b.d/2-G,K=ck(b.x,b.z),fc=FC[i%3],u=Math.max(1,b.n||1),uw=b.w/u;
  {const a=W(-b.w/2,z0),bb=W(b.w/2,z0),cc=W(b.w/2,z1),dd=W(-b.w/2,z1);quadXZ(gk(b.x,b.z),a,bb,cc,dd,[.3,.55,.22],Y0+.008)}
  {const p=W(0,z1);pbox(K.o,p[0],Y0,p[1],b.w,1.5,.12,fc,b.rot);for(let x=-b.w/2;x<=b.w/2;x+=2.5){const q=W(x,z1);COL.push([q[0],q[1],.4])}}
  for(let k=0;k<=u;k++){const lx=-b.w/2+k*uw,p=W(lx,(z0+z1)/2);pbox(K.o,p[0],Y0,p[1],.1,k===0||k===u?1.5:1.2,G,fc,b.rot);if(k===0||k===u)for(let z=z0;z>=z1;z-=2.5){const q=W(lx,z);COL.push([q[0],q[1],.35])}}
  for(let k=0;k<u;k++){const h=hash2(i*7+k,k*13+i),cx=-b.w/2+uw*(k+.5);
   if(h<.3){const p=W(cx+uw*.25,z1+1.6);pbox(K.o,p[0],Y0,p[1],1.8,1.9,1.4,[.42,.3,.2],b.rot);pbox(K.o,p[0],Y0+1.9,p[1],2,.12,1.6,[.25,.25,.28],b.rot);COL.push([p[0],p[1],1])}
   else if(h<.55){const a=W(cx-uw*.3,z0-G*.45),bb=W(cx+uw*.3,z0-G*.45);for(const q of[a,bb])pbox(K.o,q[0],Y0,q[1],.06,1.9,.06,[.6,.6,.6]);const m=W(cx,z0-G*.45);pbox(K.o,m[0],Y0+1.85,m[1],uw*.6,.02,.02,[.8,.8,.8],b.rot);for(let q=0;q<3;q++){const cp=W(cx-uw*.2+q*uw*.2,z0-G*.45);pbox(K.o,cp[0],Y0+1.3,cp[1],.5,.55,.04,CL[(i+q+k)%5],b.rot)}}
   else if(h<.6){const p=W(cx,z0-G*.5);pcyl(K.o,p[0],Y0+.5,p[1],1.6,.1,12,[.15,.15,.18]);pcyl(K.o,p[0],Y0,p[1],.05,.5,4,[.3,.3,.3]);COL.push([p[0],p[1],1.5])}
   else if(h<.75){const p=W(cx,z0-G*.6);pbox(K.o,p[0],Y0+.35,p[1],1.2,.06,.7,[.85,.85,.85],b.rot);pbox(K.o,p[0],Y0,p[1],1,.35,.5,[.3,.3,.3],b.rot)}}}
 TOWN.gardens=n}


/* ---------------------------------------------------------------- COZY PARK: paths, bandstand, duck pond, playground, railings, allotments */
{const[x0,x1,z0,z1]=ZONE.park,K0=ck(-725,106);
 const path=(ax,az,bx,bz)=>{const l=Math.hypot(bx-ax,bz-az);for(let t=0;t<l;t+=12){const t1=Math.min(l,t+12.3),p0=[ax+(bx-ax)*t/l,az+(bz-az)*t/l],p1=[ax+(bx-ax)*t1/l,az+(bz-az)*t1/l];band(ck((p0[0]+p1[0])/2,(p0[1]+p1[1])/2).rd,p0[0],p0[1],p1[0],p1[1],-1.3,1.3,[.74,.68,.56],Y0+.03)}};
 path(-900,22,-900,190);path(-560,22,-560,190);path(-410,106,-1040,106);path(-760,22,-640,80);path(-760,106,-820,190);
 /* bandstand */
 {const bx=-760,bz=60,K=ck(bx,bz);pcyl(K.s,bx,Y0,bz,5.2,.8,8,[.85,.82,.76]);for(let i=0;i<8;i++){const a=i/8*6.2832+.39;pbox(K.o,bx+Math.cos(a)*4.6,Y0+.8,bz+Math.sin(a)*4.6,.2,3,.2,[.95,.95,.92]);COL.push([bx+Math.cos(a)*4.6,bz+Math.sin(a)*4.6,.25])}
  pcone(K.r,bx,Y0+3.8,bz,6,2.6,8,[.2,.45,.3],.39);pcyl(K.o,bx,Y0+3.6,bz,5.6,.3,8,[.9,.2,.2]);pcone(K.o,bx,Y0+6.3,bz,.4,1,6,[.85,.7,.2]);disc(K.rd,bx,bz,9,[.74,.68,.56],Y0+.028,16);TOWN.band=[bx,bz]}
 /* playground */
 {const px=-470,pz=60,K=ck(px,pz);quadXZ(K.rd,[px-16,pz-12],[px+16,pz-12],[px+16,pz+12],[px-16,pz+12],[.55,.32,.26],Y0+.03);
  for(const sx of[-1,1]){pbox(K.o,px-8+sx*2.5,Y0,pz-4,.15,2.6,.15,[.9,.2,.2]);pbox(K.o,px-8+sx*2.5,Y0,pz-4+2,.15,2.6,.15,[.9,.2,.2])}pbox(K.o,px-8,Y0+2.6,pz-3,5.2,.15,.15,[.9,.2,.2]);
  for(const sx of[-1,1]){pbox(K.o,px-8+sx*1.2,Y0+.5,pz-3,.5,.06,.3,[.2,.2,.2])}
  pbox(K.o,px+6,Y0,pz-5,1.6,2.2,1.6,[.2,.4,.85]);for(let k=0;k<6;k++)pbox(K.o,px+6,Y0+2.1-k*.36,pz-3.6+k*.6,1,.1,.6,[.95,.8,.1]);pbox(K.o,px+2,Y0,pz+5,4,.5,.4,[.9,.5,.1]);pcyl(K.o,px+9,Y0,pz+6,2,.4,10,[.2,.7,.4]);
  for(const[a,b]of[[px-8,pz-3],[px+6,pz-5],[px+9,pz+6]])COL.push([a,b,1.2]);{const f=[px,Y0+2.6,pz-12.4];signPlane(K,'PLAYGROUND','#2a7a3a','#fff',2.2,.5,f[0],f[1],f[2],Math.PI,128,32)}}
 /* park cafe */
 {const W=LWB(-500,150,Math.PI/2),K=ck(-500,150);pbox(K.o,...W(0,0,0),10,3.4,7,[.95,.92,.84],Math.PI/2);pbox(K.r,...W(0,3.4,0),11,.3,8,[.2,.45,.3],Math.PI/2);perimCol(-500,150,Math.PI/2,5,3.5,.5,1.2);
  for(let k=0;k<3;k++){const q=W(-3.5+k*3.5,0,6);pbox(K.o,q[0],Y0+.75,q[2],1.2,.08,1.2,[.95,.95,.95]);pcyl(K.o,q[0],Y0,q[2],.06,.75,5,[.2,.2,.2])}{const f=W(0,2.7,3.55);signPlane(K,'PARK CAFE','#2a5a3a','#fff',3,.6,f[0],f[1],f[2],Math.PI/2,128,28)}}
 /* benches + lamps along paths */
 for(let x=-1020;x<-420;x+=34){for(const z of[102.2,109.8]){const K=ck(x,z);pbox(K.o,x,Y0+.42,z,1.8,.1,.55,[.45,.3,.15]);pbox(K.o,x,Y0,z,1.5,.42,.4,[.18,.18,.18])}const K=ck(x+17,98);pbox(K.o,x+17,Y0,98,.14,3.6,.14,[.12,.12,.12]);pbox(K.l,x+17,Y0+3.6,98,.4,.5,.4,[1,1,1]);COL.push([x+17,98,.2])}
 /* railings with gates where paths meet the road */
 const gates=[[-900,'z'],[-560,'z'],[-410,'x'],[-1040,'x']];const rail=(ax,az,bx,bz)=>{const l=Math.hypot(bx-ax,bz-az);for(let t=0;t<=l;t+=1.2){const x=ax+(bx-ax)*t/l,z=az+(bz-az)*t/l;if(Math.abs(z-106)<3.5&&(Math.abs(x-x0)<2||Math.abs(x-x1)<2))continue;if((Math.abs(x+900)<3||Math.abs(x+560)<3)&&(Math.abs(z-z0)<2||Math.abs(z-z1)<2))continue;const K=ck(x,z);pbox(K.o,x,Y0,z,.06,1.2,.06,[.08,.08,.08]);if(((t/1.2)|0)%3===0)COL.push([x,z,.25])}
  const K=ck((ax+bx)/2,(az+bz)/2);for(const y of[.2,1.05]){const steps=Math.ceil(l/20);for(let i=0;i<steps;i++){const a0=i/steps,a1=(i+1)/steps;pbox(ck(ax+(bx-ax)*(a0+a1)/2,az+(bz-az)*(a0+a1)/2).o,ax+(bx-ax)*(a0+a1)/2,Y0+y,az+(bz-az)*(a0+a1)/2,Math.abs(bx-ax)*(a1-a0)+.06,.06,Math.abs(bz-az)*(a1-a0)+.06,[.08,.08,.08])}}};
 rail(x0,z0,x1,z0);rail(x0,z1,x1,z1);rail(x0,z0,x0,z1);rail(x1,z0,x1,z1);
 {const K=ck(-480,z0);signPlane(K,'COZY PARK','#1a4a2a','#f0e0a0',3.4,.8,-430,Y0+2.6,z0-.4,Math.PI,256,56);pbox(K.o,-430,Y0,z0-.4,.2,2.2,.2,[.1,.1,.1])}
 /* allotments (west end) */
 {const ax0=-1030,ax1=-930;for(let z=30;z<180;z+=12){for(let x=ax0;x<ax1;x+=16){const K=ck(x+7,z+5),soil=rnd()<.5?[.4,.28,.18]:[.34,.24,.16];quadXZ(K.rd,[x,z],[x+14,z],[x+14,z+10],[x,z+10],soil,Y0+.032);
   for(let r=0;r<4;r++)band(K.rd,x+1,z+1.5+r*2.4,x+13,z+1.5+r*2.4,-.35,.35,rnd()<.5?[.2,.5,.2]:[.3,.55,.18],Y0+.034);
   if(rnd()<.35){pbox(K.o,x+12,Y0,z+8,2.2,2,1.8,[.42,.3,.2]);pbox(K.o,x+12,Y0+2,z+8,2.5,.12,2.1,[.2,.2,.22]);COL.push([x+12,z+8,1.3])}
   if(rnd()<.4)for(let k=0;k<3;k++)pcone(K.o,x+3+k*1.4,Y0,z+6,.35,2.2,4,[.3,.25,.15])}}
  {const K=ck(-980,26);signPlane(K,'COZYTOWN ALLOTMENTS','#3a2a10','#f0e0a0',3.6,.6,-980,Y0+2.2,24.6,Math.PI,256,40)}}
 /* trees */
 for(let k=0;k<160;k++){const x=rr(x0+6,x1-6),z=rr(z0+6,z1-6);if(x<-925)continue;if(Math.abs(z-106)<5||Math.abs(x+900)<4||Math.abs(x+560)<4||wetAt(x,z)||Math.hypot(x+760,z-60)<12||Math.abs(x+470)<20&&Math.abs(z-60)<16||Math.hypot(x+500,z-150)<10||Math.abs(x+700)<24&&Math.abs(z-165)<16)continue;
  if(PONDS[0]&&Math.hypot((x-PONDS[0][0])/(PONDS[0][2]+5),(z-PONDS[0][1])/(PONDS[0][3]+5))<1)continue;if(rnd()<.25)conifer(x,z,1+rnd()*.7);else tree(x,z,1+rnd()*.8);COL.push([x,z,.6])}
 TOWN.ducks.push(...[0,1,2,3,4].map(i=>({p:PONDS[0],a:i*1.3,r:.3+i*.12})))}

/* ---------------------------------------------------------------- the seafront: beach huts, groynes, deckchairs, kiosks */
{const HUT=[[.95,.4,.45],[.4,.7,.95],[.98,.85,.3],[.5,.85,.6],[.95,.95,.95],[.7,.55,.9],[.98,.6,.3]];
 const huts=(x0,x1,z)=>{for(let x=x0;x<x1;x+=4.2){if(onRoadish(x,z,3)||Math.abs(x-560)<14||Math.abs(x-400)<10||Math.abs(x-480)<10)continue;if((((x-x0)/4.2)|0)%9===8)continue;const K=ck(x,z),c=HUT[((((x/4.2)|0)%7)+7)%7],W=LWB(x,z,0);
  pbox(K.o,...W(0,0,0),3.4,2.6,3,c);pbox(K.o,...W(0,0,1.55),3.4,.2,.5,[.6,.5,.36]);for(let k=0;k<5;k++)pbox(K.o,...W(-1.36+k*.68,.2,1.52),.08,2.4,.04,[.98,.98,.98]);
  const r=[x-1.9,Y0+2.6,z-1.7],r2=[x+1.9,Y0+2.6,z-1.7],r3=[x+1.9,Y0+2.6,z+1.9],r4=[x-1.9,Y0+2.6,z+1.9],tp=[x,Y0+3.6,z+.1],rc=[.92,.92,.94];K.o.tri(r4,r3,tp,rc,null,null,true);K.o.tri(r,tp,r2,shd(rc,.85),null,null,true);K.o.tri(r2,tp,r3,shd(rc,.9),null,null,true);K.o.tri(r,r4,tp,shd(rc,.9),null,null,true);
  pbox(K.o,...W(0,.3,.2),1.2,1.8,.04,[.2,.2,.24]);COL.push([x-.9,z,1.1],[x+.9,z,1.1])}};
 huts(290,850,214);huts(-1040,-420,218);
 /* groynes */
 const groyne=x=>{const cz=coastZ(x);for(let z=cz-14;z<cz+18;z+=1.1){const K=ck(x,Math.min(z,1150));pbox(K.o,x,Y0-.3,z,.5,.9+(z>cz?-.2:.1),.35,[.36,.26,.18])}};
 for(let x=310;x<900;x+=70)groyne(x);for(let x=-1020;x<-420;x+=70)groyne(x);
 /* deckchairs + windbreaks */
 const DC=[[.9,.2,.2],[.2,.4,.85],[.95,.8,.2],[.2,.65,.35]];for(let k=0;k<70;k++){const x=rnd()<.5?rr(300,880):rr(-1030,-430),cz=coastZ(x),z=rr(cz-14,cz-6);if(onRoadish(x,z,2))continue;const K=ck(x,z),c=DC[k%4],ry=rr(-.4,.4)+Math.PI,W=LWB(x,z,ry);
  if(k%5===0){for(let i=0;i<4;i++)pbox(K.o,...W(-2.4+i*1.6,0,0),1.6,1.2,.06,i%2?[.95,.95,.92]:c,ry)}else{pbox(K.o,...W(0,.25,0),.7,.06,1.1,c,ry);pbox(K.o,...W(0,.25,-.5),.7,.8,.06,c,ry);pbox(K.o,...W(0,0,0),.75,.3,1,[.5,.36,.2],ry)}}
 /* promenade railings + lamps */
 const prom=(x0,x1,z)=>{for(let x=x0;x<x1;x+=2){if(onRoadish(x,z,2.5))continue;if((((x-x0)/2)|0)%25<2)continue;const K=ck(x,z);pbox(K.o,x,Y0,z,.08,1,.08,[.1,.3,.5]);pbox(K.o,x+1,Y0+.95,z,2,.08,.08,[.1,.3,.5])}
  for(let x=x0+10;x<x1;x+=26){if(onRoadish(x,z,2))continue;const K=ck(x,z);pbox(K.o,x,Y0,z,.16,4.2,.16,[.1,.3,.5]);pbox(K.l,x,Y0+4.1,z,.45,.55,.45,[1,1,1]);COL.push([x,z,.2])}};
 prom(268,858,207.6);prom(-1058,-374,212.6);
 /* lifeguard flags + an ice cream van */
 {const K=ck(600,226);for(const x of[560,640]){pbox(K.o,x,Y0,226,.08,3.2,.08,[.9,.9,.9]);pbox(K.o,x+.5,Y0+2.6,226,1,.6,.03,[.95,.85,.1]);pbox(K.o,x+.5,Y0+2.3,226,1,.3,.03,[.9,.1,.1])}}
 {const K=ck(330,196);signPlane(K,'WELCOME TO COZYTOWN-ON-SEA','#0a3a6a','#ffffff',5.5,.9,330,Y0+3,196,0,512,64);pbox(ck(330,196).o,327.4,Y0,196,.15,2.6,.15,[.2,.2,.2]);pbox(ck(330,196).o,332.6,Y0,196,.15,2.6,.15,[.2,.2,.2])}}

/* ---------------------------------------------------------------- cricket club between the canal and the railway */
{const cx=-185,cz=-558,K=ck(cx,cz);for(let a=0;a<28;a++){const t=a/28*6.2832,t2=(a+1)/28*6.2832;gk(cx,cz).tri([cx,Y0+.02,cz],[cx+Math.cos(t)*62,Y0+.02,cz+Math.sin(t)*42],[cx+Math.cos(t2)*62,Y0+.02,cz+Math.sin(t2)*42],[.3,.6,.24],null,null,true)}
 quadXZ(K.rd,[cx-1.6,cz-11],[cx+1.6,cz-11],[cx+1.6,cz+11],[cx-1.6,cz+11],[.72,.7,.5],Y0+.035);for(const z of[cz-10,cz+10])for(const x of[-.25,0,.25])pbox(K.o,cx+x,Y0,z,.05,.7,.05,[.95,.92,.85]);
 const W=LWB(cx,cz-36,0);pbox(K.o,...W(0,.6,0),16,3.4,7,[.96,.95,.9]);pbox(K.o,...W(0,0,0),17,.6,8,[.5,.36,.24]);pbox(K.r,...W(0,4,0),17,.25,8,[.2,.4,.26]);{const p=[W(-8.5,4.2,4),W(8.5,4.2,4),W(0,6.4,4)];K.r.tri(p[0],p[1],p[2],[.96,.95,.9],null,null,false,W(0,4,0))}
 pbox(K.o,...W(0,6.4,0),1.4,1.4,1.4,[.96,.95,.9]);{const f=W(0,2.8,3.6);signPlane(K,'COZYTOWN CRICKET CLUB 1878','#1a3a1a','#f0e0a0',6,.6,f[0],f[1],f[2],0,512,40)}perimCol(cx,cz-36,0,8,3.5,.5,1.2);
 pbox(K.o,cx+50,Y0,cz-20,6,4,.3,[.15,.15,.15]);for(let k=0;k<4;k++)pbox(K.o,cx+50,Y0+.6+k*.8,cz-20+.16,4.6,.5,.04,[.95,.95,.95]);
 for(let k=0;k<40;k++){const a=k/40*6.2832,x=cx+Math.cos(a)*68,z=cz+Math.sin(a)*48;if(!wetAt(x,z)&&!onRoadish(x,z,3)&&Math.abs(z-RAILZ)>10){if(k%3)tree(x,z,1.1+rnd()*.5);else conifer(x,z,1.2);COL.push([x,z,.6])}}}

const T_pois_push=q=>(TOWN.extraPois=TOWN.extraPois||[]).push(q);
/* ---------------------------------------------------------------- MORE TOWN: industry, pier, mere, caravans, hamlet green, golf, festival, lido, landmarks */
{const bx=(x,y,z,w,h,d,c,r,k)=>pbox(ck(x,z)[k||'o'],x,Y0+y,z,w,h,d,c,r||0);
 const flat=(x0,z0,x1,z1,c,y,k)=>{for(let x=x0;x<x1;x+=20)for(let z=z0;z<z1;z+=20){const xe=Math.min(x1,x+20),ze=Math.min(z1,z+20);quadXZ(k==='gr'?gk((x+xe)/2,(z+ze)/2):ck((x+xe)/2,(z+ze)/2).rd,[x,z],[xe,z],[xe,ze],[x,ze],c,Y0+(y||.03))}};
 const bld2=(x,z,w,d,n)=>{BLD.push({x,z,rot:0,w,d,k:n||'shop',n:1});OBS.push({x,z,c:1,s:0,hw:w/2,hd:d/2});perimCol(x,z,0,w/2,d/2,.5,1.4)};
 const sign=(t,bg,fg,x,y,z,ry,w)=>signPlane(ck(x,z),t,bg,fg,w||Math.min(9,t.length*.55),.8,x,Y0+y,z,ry||0,512,56);
 /* --- warehouses (south side of Foundry Lane) */
 for(const[x,w]of[[300,56],[400,40],[560,64]]){const z=-526,d=26,c=[.62,.66,.7];bx(x,0,z,w,8,d,c);bx(x,8,z,w+.6,.4,d+.6,[.5,.52,.56]);for(let k=-w/2+2;k<w/2;k+=2)bx(x+k,.2,z-d/2-.03,.15,7.6,.06,[.52,.56,.6]);
  for(let k=0;k<Math.floor(w/16);k++){const dx=x-w/2+8+k*16;bx(dx,0,z-d/2-.08,6,5,.12,[.4,.42,.46]);for(let s=0;s<5;s++)bx(dx,.5+s,z-d/2-.15,6,.08,.05,[.3,.32,.36])}
  flat(x-w/2,z-d/2-14,x+w/2,z-d/2,[.42,.42,.44]);bld2(x,z,w,d,'shop');sign(['COZY FREIGHT','MOORSIDE MILLS','EASTFIELD LOGISTICS'][[300,400,560].indexOf(x)],'#1a2a3a','#fff',x,6.4,z-d/2-.2,Math.PI)}
 /* --- Scrappy's scrapyard */
 {const x0=300,x1=388,z0=-628,z1=-574;flat(x0,z0,x1,z1,[.38,.34,.3]);for(let x=x0;x<x1;x+=2.2){if(x>338&&x<350)continue;bx(x+1.1,0,z1,2.2,2.6,.15,[.5,.45,.38].map(v=>v*(.85+.3*hash2(x|0,3))))}for(let x=x0;x<x1;x+=2.2)bx(x+1.1,0,z0,2.2,2.6,.15,[.5,.45,.38]);for(let z=z0;z<z1;z+=2.2){bx(x0,0,z+1.1,.15,2.6,2.2,[.5,.45,.38]);bx(x1,0,z+1.1,.15,2.6,2.2,[.5,.45,.38])}
  for(let x=x0;x<=x1;x+=2.5){if(x<338||x>350)COL.push([x,z1,.6]);COL.push([x,z0,.6])}for(let z=z0;z<=z1;z+=2.5){COL.push([x0,z,.6]);COL.push([x1,z,.6])}
  const CC=[[.7,.1,.1],[.1,.3,.7],[.8,.7,.1],[.3,.5,.3],[.6,.6,.62],[.4,.25,.15]];for(let k=0;k<26;k++){const px=x0+8+(k%7)*11+rr(-2,2),pz=z0+8+Math.floor(k/7)*11+rr(-2,2);const h=1+Math.floor(rnd()*4);for(let q=0;q<h;q++)bx(px+rr(-.3,.3),q*.9,pz+rr(-.3,.3),4,.85,1.8,CC[(k+q)%6],rr(-.2,.2));COL.push([px-1.2,pz,1.2],[px+1.2,pz,1.2])}
  bx(370,0,-610,1.2,14,1.2,[.9,.7,.1]);bx(362,13,-610,18,.8,.8,[.9,.7,.1]);bx(354,8,-610,.1,5,.1,[.2,.2,.2]);bx(354,7,-610,2.4,.3,1.6,[.3,.3,.3]);COL.push([370,-610,1.2]);
  bx(310,0,-584,8,3,4,[.85,.85,.8]);bx(310,3,-584,8.4,.2,4.4,[.3,.3,.3]);COL.push([306,-584,2],[314,-584,2]);sign("SCRAPPY'S YARD",'#3a2a10','#ffd040',344,3.6,z1+.2,0,8)}
 /* --- bus depot with red double-deckers */
 {const x=470,z=-602;bx(x,0,z-14,52,.3,2,[.5,.5,.52]);for(let k=0;k<5;k++)bx(x-24+k*12,0,z-14,.4,8,.4,[.3,.3,.32]);bx(x,8,z-4,54,.4,22,[.45,.48,.5]);bx(x,0,z-15,52,8,.3,[.6,.62,.64]);bx(x-26,0,z-4,.3,8,22,[.6,.62,.64]);bx(x+26,0,z-4,.3,8,22,[.6,.62,.64]);flat(x-28,z-16,x+28,z+28,[.36,.36,.38]);
  for(let k=0;k<4;k++){const bx0=x-18+k*12,bz=z-2;bx(bx0,.35,bz,2.5,2.3,10.5,[.78,.08,.08]);bx(bx0,2.65,bz,2.5,1.9,10.5,[.78,.08,.08]);for(const y of[1.4,3.3])bx(bx0,y,bz,2.52,.9,9.8,[.15,.2,.28]);bx(bx0,1.2,bz,2.53,.12,10.2,[.95,.85,.1]);for(const wz of[-3.5,3.5])for(const sd of[-1,1])bx(bx0+sd*1.1,0,bz+wz,.4,.9,.9,[.08,.08,.08]);COL.push([bx0,bz-3.5,1.4],[bx0,bz,1.4],[bx0,bz+3.5,1.4])}
  for(let z2=z-15;z2<z+7;z2+=2.5){COL.push([x-26,z2,.5],[x+26,z2,.5])}for(let x2=x-26;x2<=x+26;x2+=2.5)COL.push([x2,z-15,.5]);sign('COZYTOWN BUS DEPOT','#7a0a0a','#fff',x,7,z+7.2,0,8);BLD.push({x,z:z-4,rot:0,w:52,d:22,k:'shop',n:1})}
 /* --- gasholder: the east-end landmark */
 {const x=600,z=-605,r=20,K=ck(x,z);pcyl(K.o,x,Y0,z,r-1.5,16,24,[.32,.42,.36]);pcone(K.o,x,Y0+16,z,r-1.5,2.2,24,[.3,.4,.34]);for(let i=0;i<14;i++){const a=i/14*6.2832,cx=x+Math.cos(a)*r,cz=z+Math.sin(a)*r;pbox(K.o,cx,Y0,cz,.7,24,.7,[.5,.18,.15]);COL.push([cx,cz,.6])}
  for(const y of[8,16,23.5])for(let i=0;i<28;i++){const a=(i+.5)/28*6.2832,a2=(i+1.5)/28*6.2832;pbox(K.o,x+Math.cos(a)*r,Y0+y,z+Math.sin(a)*r,.4,.4,r*6.2832/28+.2,[.5,.18,.15],-a)}for(let a=0;a<24;a++)COL.push([x+Math.cos(a/24*6.2832)*(r-1.5),z+Math.sin(a/24*6.2832)*(r-1.5),1])}
 /* --- old brickworks chimney + Victorian water tower: landmarks you can see from afar */
 {const K=ck(70,-600);pcyl(K.b,70,Y0,-600,3,6,10,[.9,.6,.5]);pcyl(K.b,70,Y0+6,-600,2.2,34,10,[.9,.6,.5]);pcyl(K.o,70,Y0+40,-600,2.6,1.2,10,[.25,.2,.2]);COL.push([70,-600,3.2]);
  const W=ck(-950,-470);for(const[a,b]of[[-3,-3],[3,-3],[3,3],[-3,3]]){pbox(W.s,-950+a,Y0,-470+b,.8,18,.8,[.78,.72,.62]);COL.push([-950+a,-470+b,.6])}pcyl(W.b,-950,Y0+18,-470,5.5,7,12,[.95,.7,.6]);pcone(W.r,-950,Y0+25,-470,6,3,12,[.3,.32,.36]);for(const y of[6,12])pbox(W.s,-950,Y0+y,-470,6.8,.5,6.8,[.78,.72,.62])}
 /* --- the pier */
 {const P_=PIER,x=P_.x;for(let z=P_.z0+4;z<P_.hz[0];z+=10){const ze=Math.min(P_.hz[0],z+10.2),K=ck(x,z+5);quadXZ(K.rd,[x-P_.w-.4,z],[x+P_.w+.4,z],[x+P_.w+.4,ze],[x-P_.w-.4,ze],[.55,.42,.3],Y0+.08);for(let q=z;q<ze;q+=1)band(K.rd,x-P_.w,q,x+P_.w,q,-.05,.05,[.4,.3,.2],Y0+.085)}
  {const K=ck(x,428);quadXZ(K.rd,[P_.hx[0],P_.hz[0]],[P_.hx[1],P_.hz[0]],[P_.hx[1],P_.hz[1]],[P_.hx[0],P_.hz[1]],[.55,.42,.3],Y0+.08)}
  for(let z=P_.z0+30;z<P_.hz[1];z+=9)for(const sd of[-1,1]){const px=z<P_.hz[0]?x+sd*(P_.w+.2):(sd<0?P_.hx[0]+.5:P_.hx[1]-.5);bx(px,-3,z,.6,3.1,.6,[.3,.24,.18])}
  const rail=(ax,az,bx_,bz)=>{const l=Math.hypot(bx_-ax,bz-az),ry=Math.atan2(bx_-ax,bz-az);for(let t=0;t<=l;t+=1.5){const px=ax+(bx_-ax)*t/l,pz=az+(bz-az)*t/l;bx(px,0,pz,.1,1.1,.1,[.92,.92,.95]);if(((t/1.5)|0)%2===0)COL.push([px,pz,.3])}for(let t=0;t<l;t+=10){const t1=Math.min(l,t+10),mx=ax+(bx_-ax)*(t+t1)/2/l,mz=az+(bz-az)*(t+t1)/2/l;bx(mx,1.05,mz,.12,.1,t1-t+.1,[.92,.92,.95],ry)}};
  rail(x-P_.w,P_.z0+28,x-P_.w,P_.hz[0]);rail(x+P_.w,P_.z0+28,x+P_.w,P_.hz[0]);rail(P_.hx[0],P_.hz[0],x-P_.w,P_.hz[0]);rail(x+P_.w,P_.hz[0],P_.hx[1],P_.hz[0]);rail(P_.hx[0],P_.hz[0],P_.hx[0],P_.hz[1]);rail(P_.hx[1],P_.hz[0],P_.hx[1],P_.hz[1]);rail(P_.hx[0],P_.hz[1],P_.hx[1],P_.hz[1]);
  for(let k=0;k<5;k++){const px=x-P_.w+.3+k*((2*P_.w-.6)/4);bx(px,0,P_.z0+8,.35,.9,.35,[.2,.2,.22]);COL.push([px,P_.z0+8,.32])}
  for(let z=P_.z0+40;z<P_.hz[0];z+=24)for(const sd of[-1,1]){bx(x+sd*(P_.w-.3),0,z,.16,4.2,.16,[.1,.3,.5]);bx(x+sd*(P_.w-.3),4.1,z,.45,.55,.45,[1,1,1],0,'l');COL.push([x+sd*(P_.w-.3),z,.2])}
  {const W=LWB(x,P_.hz[0]+16,Math.PI),K=ck(x,P_.hz[0]+16),w=30,d=22;pbox(K.o,...W(0,0,0),w,6,d,[.98,.98,.96],Math.PI);pbox(K.o,...W(0,6,0),w+.8,.5,d+.8,[.2,.5,.6],Math.PI);{const p=W(0,6.5,0);pcyl(K.o,p[0],p[1],p[2],6,2,12,[.98,.98,.96]);pcone(K.r,p[0],p[1]+2,p[2],6.4,4,12,[.2,.5,.6])}
   for(let i=0;i<6;i++)pbox(K.l,...W(-12.5+i*5,2,d/2+.05),2.6,2.4,.08,[1,1,1],Math.PI);pbox(K.o,...W(0,0,d/2+.06),3,3.4,.1,[.2,.12,.08],Math.PI);perimCol(x,P_.hz[0]+16,Math.PI,w/2,d/2,.5,1.2);
   {const f=W(0,5,d/2+.2);signPlane(K,'PIER PAVILION','#0a4a6a','#ffe040',8,1,f[0],f[1],f[2],Math.PI,512,64)}BLD.push({x,z:P_.hz[0]+16,rot:Math.PI,w,d,k:'shop',n:1});
   const dr=W(0,0,d/2+1.6);SHOPD.push({x:dr[0],z:dr[2],psi:Math.PI,t:'PIER PAVILION',bg:'#0a4a6a',fg:'#ffe040'})}
  {bx(x+P_.w-1.6,0,360,2.6,2.6,2.6,[.95,.85,.3]);bx(x+P_.w-1.6,2.6,360,3,.15,3,[.2,.4,.7]);sign('TACKLE & BAIT','#2a4a7a','#fff',x+P_.w-2.95,2,360,-Math.PI/2,2.4);COL.push([x+P_.w-1.6,360,1.4]);TOWN.tackle=[x+P_.w-3.6,360]}
  sign('COZYTOWN PIER','#0a4a6a','#ffffff',x,4.4,P_.z0+6,0,6);bx(x-4,0,P_.z0+6,.2,4.6,.2,[.1,.3,.5]);bx(x+4,0,P_.z0+6,.2,4.6,.2,[.1,.3,.5]);
  TOWN.fishSpots=[[x,P_.hz[1]-1.5,'pier'],[P_.hx[0]+1.5,430,'pier'],[P_.hx[1]-1.5,430,'pier']]}
 /* --- Coze Mere: jetty, boathouse, rowing boats */
 {const[mx,mz]=ZX.mere;for(let z=-842;z<-812;z+=3)quadXZ(ck(mx,z).rd,[mx-2,z],[mx+2,z],[mx+2,z+3.1],[mx-2,z+3.1],[.55,.42,.3],Y0+.1);for(let z=-838;z<-812;z+=6)for(const sd of[-1,1])bx(mx+sd*2,-.5,z,.3,1.6,.3,[.35,.26,.18]);
  bx(-828,0,-848,10,4,7,[.42,.28,.18]);bx(-828,4,-848,11,.3,8,[.25,.35,.25]);perimCol(-828,-848,0,5,3.5,.5,1.2);sign('COZE MERE BOATHOUSE','#2a3a1a','#fff',-828,3.2,-844.4,0,6);
  for(let k=0;k<3;k++){const bx0=mx+5+k*2.8,bz=-822;bx(bx0,-.1,bz,1.4,.5,4,[[.8,.2,.2],[.2,.4,.8],[.9,.8,.2]][k]);bx(bx0,.3,bz,1,.12,1.2,[.5,.36,.2])}
  TOWN.fishSpots.push([mx,-813,'mere'],[mx+1.5,-813,'mere'])}
 /* canal fishing spots along the towpath */for(const x of[-100,80,300,520,760])TOWN.fishSpots.push([x,plDz(x)+4.8,'canal']);
 /* --- Sunny Vale caravan park */
 {const[x0,x1,z0,z1]=ZX.caravan;flat(x0,z0,x1,z1,[.36,.56,.24],.015,'gr');flat(-90,-1088,x1,-1082,[.5,.46,.4]);for(let x=x0+12;x<x1-8;x+=22)for(let z=z0+12;z<z1-8;z+=20){if(Math.abs(z+1085)<8)continue;const c=[[.3,.6,.85],[.4,.7,.4],[.9,.6,.3],[.7,.5,.8]][((x+z)|0)%4<0?0:((x+z)|0)%4];
   bx(x,.4,z,10,2.6,3.4,[.96,.96,.94]);bx(x,1.3,z+1.71,9.8,.4,.04,c);bx(x,3,z,10.2,.2,3.6,[.8,.8,.82]);bx(x-2,1.3,z+1.72,1.4,1,.04,[.4,.5,.6]);bx(x+2.5,1.3,z+1.72,1.4,1,.04,[.4,.5,.6]);bx(x-3.5,0,z+2.6,2.4,.4,1.6,[.6,.45,.3]);COL.push([x-3.5,z,1.8],[x,z,1.8],[x+3.5,z,1.8])}
  bx(-80,0,-1100,8,3.2,6,[.95,.9,.8]);bx(-80,3.2,-1100,8.6,.25,6.6,[.7,.3,.2]);perimCol(-80,-1100,0,4,3,.5,1.2);sign('SUNNY VALE CARAVAN PARK','#2a6a3a','#fff',-60,3.2,-1081,0,7);bx(-60,0,-1081,.15,3,.15,[.3,.3,.3])}
 /* --- Little Cozing village green */
 {const[gx,gz,gr]=ZX.green,K=ck(gx,gz);disc(gk(gx,gz),gx,gz,gr,[.34,.62,.26],Y0+.02,24);disc(K.rd,gx+8,gz-4,4.5,[.25,.45,.55],Y0+.035,16);pcyl(K.o,gx,Y0,gz,.18,7,6,[.95,.95,.92]);for(let i=0;i<8;i++){const a=i/8*6.2832;pbox(K.o,gx+Math.cos(a)*2.2,Y0+3.5,gz+Math.sin(a)*2.2,.08,7,.08,[[.9,.2,.2],[.2,.4,.9],[.95,.85,.2],[.2,.7,.3]][i%4],a)}COL.push([gx,gz,.4]);
  for(const a of[.4,2.4,4.2]){const x=gx+Math.cos(a)*(gr-3),z=gz+Math.sin(a)*(gr-3);pbox(K.o,x,Y0+.42,z,1.8,.1,.55,[.45,.3,.15],a+1.57);pbox(K.o,x,Y0,z,1.5,.42,.4,[.2,.2,.2],a+1.57)}for(let k=0;k<6;k++){const a=k*1.05+.3;tree(gx+Math.cos(a)*(gr+4),gz+Math.sin(a)*(gr+4),1.3);COL.push([gx+Math.cos(a)*(gr+4),gz+Math.sin(a)*(gr+4),.6])}
  T_pois_push({x:gx,z:gz,n:'LITTLE COZING',c:'farm',ic:'🏡',r:70})}
 /* --- Cozy Golf Club: four holes */
 {const[x0,x1,z0,z1]=ZX.golf,H=[[[270,-720],[420,-760]],[[440,-700],[620,-740]],[[620,-800],[460,-840]],[[440,-900],[270,-860]]];flat(x0,z0,x1,z1,[.3,.52,.22],.012,'gr');
  for(const[t,g]of H){const dx=g[0]-t[0],dz=g[1]-t[1],l=Math.hypot(dx,dz);for(let s=0;s<l;s+=12){const s1=Math.min(l,s+12.3);band(gk(t[0]+dx*s/l,t[1]+dz*s/l),t[0]+dx*s/l,t[1]+dz*s/l,t[0]+dx*s1/l,t[1]+dz*s1/l,-12,12,[.38,.66,.28],Y0+.018)}disc(gk(g[0],g[1]),g[0],g[1],9,[.45,.78,.32],Y0+.022,20);disc(gk(t[0],t[1]),t[0],t[1],4,[.42,.7,.3],Y0+.022,8);
   pbox(ck(g[0],g[1]).o,g[0],Y0,g[1],.08,2.4,.08,[.95,.95,.95]);pbox(ck(g[0],g[1]).o,g[0]+.4,Y0+1.9,g[1],.8,.5,.03,[.9,.1,.1]);const bk=[t[0]+dx*.7+12,t[1]+dz*.7+8];disc(ck(bk[0],bk[1]).rd,bk[0],bk[1],5,[.9,.84,.6],Y0+.03,12)}
  for(let k=0;k<50;k++){const x=rr(x0+5,x1-5),z=rr(z0+5,z1-5);let ok=true;for(const[t,g]of H){const q=segDist(x,z,{a:t,b:g,dx:(g[0]-t[0])/Math.hypot(g[0]-t[0],g[1]-t[1]),dz:(g[1]-t[1])/Math.hypot(g[0]-t[0],g[1]-t[1]),l:Math.hypot(g[0]-t[0],g[1]-t[1])});if(q.d<20)ok=false}if(ok){tree(x,z,1.2+rnd()*.6);COL.push([x,z,.6])}}TOWN.golf=H}
 /* --- CozyFest field */
 {const[x0,x1,z0,z1]=ZX.fest,cx=(x0+x1)/2,K=ck(cx,-1060);flat(x0,z0,x1,z1,[.4,.54,.24],.014,'gr');pbox(K.o,cx,Y0,-1080,26,1.4,10,[.2,.2,.22]);for(const sx of[-12,12])pbox(K.o,cx+sx,Y0,-1080,.5,9,.5,[.15,.15,.15]);pbox(K.o,cx,Y0+9,-1081,27,.6,11,[.1,.1,.12]);for(const sx of[-15,15])pbox(K.o,cx+sx,Y0,-1077,2.4,5,2,[.08,.08,.08]);perimCol(cx,-1080,0,13,5,.6,1.4);
  signPlane(K,'COZYFEST','#5a0a8a','#ffe040',8,1.4,cx,Y0+7.6,-1074.6,0,512,90);
  for(let k=0;k<6;k++){const tx=x0+12+k*20,tz=-1000;pcone(ck(tx,tz).o,tx,Y0,tz,4,4.5,6,[[.9,.2,.2],[.95,.95,.95],[.2,.5,.9],[.95,.8,.2]][k%4]);COL.push([tx,tz,3.4])}
  for(let k=0;k<3;k++){const vx=x0+20+k*30,vz=-1030;pbox(ck(vx,vz).o,vx,Y0+.3,vz,2.4,2.8,5,[[.95,.85,.3],[.4,.8,.9],[.95,.5,.7]][k]);COL.push([vx,vz-1.5,1.4],[vx,vz+1.5,1.4])}
  for(let k=0;k<30;k++){const a=k/30,x=x0+4+a*(x1-x0-8);pbox(ck(x,-1046).o,x,Y0+5.5+Math.sin(a*30)*.3,-1046,.4,.5,.05,[[.9,.2,.2],[.2,.5,.9],[.95,.85,.2],[.2,.7,.3]][k%4])}TOWN.fest=[cx,-1060]}
 /* --- the lido in Cozy Park */
 {const[lx,lz]=ZX.lido,K=ck(lx,lz);quadXZ(K.rd,[lx-18,lz-11],[lx+18,lz-11],[lx+18,lz+11],[lx-18,lz+11],[.92,.92,.9],Y0+.03);quadXZ(K.rd,[lx-15,lz-8],[lx+15,lz-8],[lx+15,lz+8],[lx-15,lz+8],[.3,.65,.85],Y0+.04);for(let x=lx-12;x<lx+15;x+=4)band(K.rd,x,lz-8,x,lz+8,-.08,.08,[.25,.55,.75],Y0+.045);
  for(let x=lx-18;x<=lx+18;x+=2){COL.push([x,lz-11,.4]);COL.push([x,lz+11,.4]);pbox(K.o,x,Y0,lz-11,2,1.5,.1,[.3,.6,.8]);pbox(K.o,x,Y0,lz+11,2,1.5,.1,[.3,.6,.8])}for(let z=lz-11;z<=lz+11;z+=2){if(Math.abs(z-lz)>2.5)COL.push([lx+18,z,.4]);COL.push([lx-18,z,.4]);pbox(K.o,lx-18,Y0,z,.1,1.5,2,[.3,.6,.8]);if(Math.abs(z-lz)>2.5)pbox(K.o,lx+18,Y0,z,.1,1.5,2,[.3,.6,.8])}
  pbox(K.o,lx-13,Y0,lz,1.6,3.2,1.6,[.95,.95,.95]);pbox(K.o,lx-10.6,Y0+3.1,lz,4,.2,1,[.2,.5,.8]);for(let k=0;k<5;k++)pbox(K.o,lx-14,Y0+k*.62,lz+1,.5,.08,.8,[.8,.8,.8]);for(let k=0;k<4;k++){pbox(K.o,lx-6+k*4,Y0,lz-9.6,1.4,.3,.7,[[.95,.4,.3],[.95,.85,.3],[.3,.6,.9],[.95,.95,.95]][k])}
  signPlane(K,'COZY LIDO','#2a6a9a','#fff',3.6,.8,lx+18.2,Y0+2.2,lz,Math.PI/2,256,56);TOWN.lido=[lx-14.5,lz+2.5];T_pois_push({x:lx,z:lz,n:'COZY LIDO',c:'fun',ic:'🏊',r:50})}}

/* ---------------------------------------------------------------- countryside: patchwork fields, hedgerows, dry-stone walls, sheep, hay */
{const FC=[[.62,.6,.22],[.32,.5,.2],[.42,.3,.2],[.86,.78,.2],[.28,.48,.18],[.5,.56,.24]],FT=['wheat','pasture','plough','rape','pasture','hay'];
 const hedge=(ax,az,bx,bz,wall)=>{const l=Math.hypot(bx-ax,bz-az),ry=Math.atan2(bx-ax,bz-az);let gate=rr(.2,.8)*l;for(let t=0;t<l;t+=3){const x=ax+(bx-ax)*(t+1.5)/l,z=az+(bz-az)*(t+1.5)/l;
   if(Math.abs(t-gate)<4||onRoadish(x,z,1.5)||wetAt(x,z)||Math.abs(z-RAILZ)<7||!landAt(x,z))continue;if(PLACED.some(p=>Math.abs(p.x-x)<p.hw+p.hd+2&&Math.abs(p.z-z)<p.hw+p.hd+2&&obbHit({x,z,rot:0,hw:1,hd:1},p)))continue;const K=ck(x,z);
   if(wall){pbox(K.s,x,Y0,z,.7,1+rnd()*.15,3.05,[.72,.7,.64],ry);}else{pbox(K.o,x,Y0,z,1.2,1.3+rnd()*.3,3.1,shd([.16,.36,.14],.9+rnd()*.2),ry);if(rnd()<.06){tree(x,z,1+rnd()*.5);}}COL.push([x,z,.75])}};
 let fi=0;for(let gx=-1120;gx<950;gx+=115)for(let gz=-1160;gz<-690;gz+=86){const x0=gx+rr(-6,6),z0=gz+rr(-5,5),x1=x0+rr(95,118),z1=z0+rr(70,88),cx=(x0+x1)/2,cz=(z0+z1)/2;
  const inZX=(x,z)=>inZone(ZX.golf,x,z)||inZone(ZX.caravan,x,z)||inZone(ZX.fest,x,z)||Math.hypot(x-298,z+1040)<30||Math.hypot((x+850)/68,(z+800)/42)<1||Math.hypot(x+835,z+848)<14;
  if(Math.hypot(cx-ZONE.windmill[0],cz-ZONE.windmill[1])<60||Math.hypot(cx-90,cz+850)<40||inZX(cx,cz))continue;const ft=Math.floor(hash2(gx,gz)*FT.length),c=FC[ft],wall=gz<-1000&&hash2(gz,gx)<.6;fi++;
  for(let x=x0+3;x<x1-3;x+=10)for(let z=z0+3;z<z1-3;z+=10){const xe=Math.min(x+10,x1-3),ze=Math.min(z+10,z1-3),mx=(x+xe)/2,mz=(z+ze)/2;if(onRoadish(mx,mz,3)||wetAt(mx,mz)||inZX(mx,mz)||Math.abs(mz-RAILZ)<6||mz<TB.z0+4||mx<TB.x0+4||mx>TB.x1-4)continue;
   const B=gk(mx,mz),cc=shd(c,.94+hash2(x|0,z|0)*.12);quadXZ(B,[x,z],[xe,z],[xe,ze],[x,ze],cc,Y0+.012);
   if(ft===0||ft===3)for(let k=x+1;k<xe;k+=2.5)band(B,k,z,k,ze,-.3,.3,shd(cc,.86),Y0+.016);if(ft===2)for(let k=z+1;k<ze;k+=1.6)band(B,x,k,xe,k,-.25,.25,shd(cc,.8),Y0+.016)}
  hedge(x0,z0,x1,z0,wall);hedge(x0,z1,x1,z1,wall);hedge(x0,z0,x0,z1,wall);hedge(x1,z0,x1,z1,wall);
  if(FT[ft]==='pasture')for(let k=0;k<6;k++){const sx=rr(x0+8,x1-8),sz=rr(z0+8,z1-8);if(onRoadish(sx,sz,3)||wetAt(sx,sz))continue;TOWN.sheep.push({x:sx,z:sz,a:rnd()*6.28,x0:x0+6,x1:x1-6,z0:z0+6,z1:z1-6})}
  if(FT[ft]==='hay')for(let k=0;k<5;k++){const hx=rr(x0+10,x1-10),hz=rr(z0+10,z1-10);if(onRoadish(hx,hz,3))continue;const K=ck(hx,hz);pcyl(K.o,hx,Y0,hz,.75,1.5,10,[.86,.74,.36]);COL.push([hx,hz,.9])}}
 TOWN.fields=fi;
 /* edge woodland so the town fades into countryside */
 for(let x=TB.x0+6;x<TB.x1-6;x+=7)for(const z of[TB.z0+8+rnd()*8,TB.z0+20+rnd()*10])if(!onRoadish(x,z,3)&&!inAnyBld(x,z,1)&&!wetAt(x,z)){if(rnd()<.5)conifer(x,z,1.2+rnd()*.8);else tree(x,z,1.1+rnd()*.7);COL.push([x,z,.6])}
 for(let z=TB.z0+20;z<coastZ(TB.x0)-30;z+=7)for(const x of[TB.x0+8+rnd()*8,TB.x0+20+rnd()*10])if(!onRoadish(x,z,3)&&!inAnyBld(x,z,1)&&Math.abs(z-RAILZ)>8&&!inZone(ZONE.park,x,z)){if(rnd()<.5)conifer(x,z,1.2+rnd()*.8);else tree(x,z,1.1+rnd()*.7);COL.push([x,z,.6])}
 for(let z=TB.z0+20;z<coastZ(TB.x1)-30;z+=7)for(const x of[TB.x1-8-rnd()*8,TB.x1-20-rnd()*10])if(!onRoadish(x,z,3)&&!inAnyBld(x,z,1)&&Math.abs(z-RAILZ)>8){if(rnd()<.5)conifer(x,z,1.2+rnd()*.8);else tree(x,z,1.1+rnd()*.7);COL.push([x,z,.6])}
 /* COZE WOOD: a little wood on the river north of the railway */
 for(let k=0;k<180;k++){const x=rr(-560,-250),z=rr(-1150,-700);if(wetAt(x,z)||plD(x,z,RIV)[0]<rivW(z)+3||onRoadish(x,z,3)||Math.abs(z-RAILZ)<9)continue;if(rnd()<.4)conifer(x,z,1.2+rnd()*.8);else tree(x,z,1+rnd()*.9);COL.push([x,z,.6])}}

/* ---------------------------------------------------------------- windmill hill */
{const[wx,wz,wr]=ZONE.windmill,K=ck(wx,wz);for(let k=0;k<4;k++){pcyl(K.o,wx,Y0-.2+k*.5,wz,wr-k*6,.55,14,[.3,.5,.2].map(c=>c*(1+k*.04)))}pcyl(K.o,wx,Y0+1.8,wz,wr-21,.3,14,[.34,.52,.22]);
 for(let a=0;a<18;a++)COL.push([wx+Math.cos(a/18*6.2832)*(wr-21),wz+Math.sin(a/18*6.2832)*(wr-21),1.2]);
 pcyl(K.o,wx,Y0+2,wz,4.2,12,10,[.96,.95,.92]);pcyl(K.o,wx,Y0+14,wz,3.4,1.2,10,[.96,.95,.92]);pcone(K.r,wx,Y0+15,wz,3.9,3.4,10,[.25,.25,.28]);
 pbox(K.o,wx,Y0+2,wz+4.1,1.4,2.4,.2,[.3,.18,.1]);for(const y of[6,10])pbox(K.l,wx,Y0+y,wz+3.9,.8,1.1,.15,[1,1,1]);
 const sails=new THREE.Group(),sb=new Builder(3);for(let i=0;i<4;i++){const a=i*Math.PI/2,c=Math.cos(a),s=Math.sin(a);for(let k=1;k<=6;k++){const r=k*1.55;pbox(sb,c*r,s*r-.06,0,i%2?1.1:.24,i%2?.24:1.1,.08,[.95,.93,.88]);pbox(sb,c*r-s*.9,s*r+c*.9-.4,0,1.5,1.5,.05,[.9,.88,.82])}pbox(sb,c*5,s*5,0,i%2?.2:10,i%2?10:.2,.16,[.45,.3,.18])}
 sails.add(sb.mesh(mObj));sails.position.set(wx,Y0+14.4,wz+4.6);K.x.push(sails);TOWN.sails=sails;
 {const f=[wx+9,Y0+2.6,wz+wr-14];signPlane(K,'WINDMILL HILL','#3a2a10','#f0e0a0',2.8,.6,f[0],f[1],f[2],0,128,28)}}

/* ---------------------------------------------------------------- mill pond swans + general town trees + welcome signs */
TOWN.ducks.push(...[0,1,2].map(i=>({p:PONDS[1],a:i*2,r:.35+i*.15,swan:1})));
for(let q=0,n=0;q<9000&&n<1500;q++){const x=rr(TB.x0+30,TB.x1-30),z=rr(TB.z0+30,250);if(inOld(x,z,4)||!landAt(x,z)||z>coastZ(x)-30||wetAt(x,z)||Math.abs(z-RAILZ)<9)continue;
 if(roadDist(x,z)<RW+PW+2.2||inAnyBld(x,z,3)||inZone(ZONE.park,x,z)||inZone(ZONE.retail,x,z))continue;if(z<-690&&rnd()<.75)continue;if(rnd()<.18)conifer(x,z,1+rnd()*.6);else tree(x,z,.9+rnd()*.8);COL.push([x,z,.6]);n++}
for(const[x,z,ry,t]of[[-1052,-120,Math.PI/2,'COZYTOWN'],[852,-140,-Math.PI/2,'COZYTOWN'],[-10,-1100,0,'COZYTOWN 2 MILES'],[868,-560,-Math.PI/2,'EASTFIELD STATION ←']]){const K=ck(x,z);pbox(K.o,x-1.6,Y0,z,.14,2.2,.14,[.2,.2,.2]);pbox(K.o,x+1.6,Y0,z,.14,2.2,.14,[.2,.2,.2]);signPlane(K,t,'#ffffff','#101018',3.6,.7,x,Y0+2.1,z,ry,256,48)}

/* ---------------------------------------------------------------- finalise every chunk (village + town) */
for(const c of CHL){const g=new THREE.Group();c.grp=g;for(const[k,m]of[['o',mObj],['b',mBrick],['s',mStone],['r',mRoof],['g',mGlass],['l',gLit],['rd',mRoad],['gr',mGrass],['wa',mWater]]){if(!c[k])continue;if(c[k].p.length){const me=c[k].mesh(cmat(m),k==='gr');g.add(me);if(k==='gr'&&me.geometry.attributes.color){me.userData.cs=me.geometry.attributes.color.array.slice();TOWN.grM=TOWN.grM||[];TOWN.grM.push(me)}}c[k].p=c[k].c=c[k].u=null}for(const e of c.x)g.add(e);scene.add(g)}
{for(const me of TOWN.grM||[]){const c8=me.userData.cs,cw=new Uint8Array(c8.length),K=1/127.5,w8=v=>Math.max(0,Math.min(255,Math.round(v*127.5)));for(let i=0;i<c8.length;i+=3){const r=c8[i]*K,gg=c8[i+1]*K,b=c8[i+2]*K;const sand=r>.6&&b<r*.8&&gg>.55;if(sand){cw[i]=c8[i];cw[i+1]=c8[i+1];cw[i+2]=c8[i+2];continue}const l=.84+.12*(gg-.4);cw[i]=w8(.86*l);cw[i+1]=w8(.89*l);cw[i+2]=w8(.93*l)}me.userData.cw=cw}
}
function cullChunks(){syncCMat();const R=scene.fog.far+15,R2=R*R,cx=cam.position.x,cz=cam.position.z;for(const c of CHL){const dx=c.cx-cx,dz=c.cz-cz;c.grp.visible=dx*dx+dz*dz<R2}homeG.visible=Math.hypot(HM.x-cx,HM.z-cz)<R+20}
/* every static collider so far goes into a spatial grid; COL keeps only the ones added later (traffic, doors, minigames) */
TOWN.ncol=COL.length;colGrid(COL.splice(0));
window.VINFO={bld:BLD.length,tg:TG.length,col:TOWN.ncol,chunks:CHL.length,cnt,town:TOWN.cnt,fields:TOWN.fields};
window.TOWN=TOWN;
/* shared by the minimap and the full map: sea, land, beach, park, fields, water, railway */
function townMap(g,X,Z,k){g.save();g.fillStyle='#3f7a35';g.beginPath();g.moveTo(X(TB.x0),Z(TB.z0));g.lineTo(X(TB.x1),Z(TB.z0));for(let x=TB.x1;x>=TB.x0;x-=10)g.lineTo(X(x),Z(coastZ(x)));g.closePath();g.fill();
 g.fillStyle='#4f8a3a';g.fillRect(Math.min(X(TB.x0),X(TB.x1)),Math.min(Z(TB.z0),Z(RAILZ-40)),Math.abs(X(TB.x1)-X(TB.x0)),Math.abs(Z(RAILZ-40)-Z(TB.z0)));
 g.strokeStyle='#e0d0a0';g.lineWidth=16*k;g.beginPath();for(let x=TB.x0;x<=TB.x1;x+=10){const z=coastZ(x)-8;if(Math.abs(x)<262){g.moveTo(X(x+10),Z(coastZ(x+10)-8));continue}g.lineTo(X(x),Z(z))}g.stroke();
 const rect=(r,c)=>{g.fillStyle=c;g.fillRect(Math.min(X(r[0]),X(r[1])),Math.min(Z(r[2]),Z(r[3])),Math.abs(X(r[1])-X(r[0])),Math.abs(Z(r[3])-Z(r[2])))};
 rect(ZONE.park,'#5aa648');rect([-1030,-930,30,180],'#8a6a3a');rect(ZONE.square,'#b8a88a');g.fillStyle='#5aa648';g.beginPath();g.ellipse(X(-185),Z(-558),62*k,42*k,0,0,6.3);g.fill();g.beginPath();g.arc(X(ZONE.windmill[0]),Z(ZONE.windmill[1]),ZONE.windmill[2]*k,0,6.3);g.fill();
 g.strokeStyle='#4a82b4';g.lineCap='round';g.lineJoin='round';g.lineWidth=14*k;g.beginPath();RIV.forEach((q,i)=>i?g.lineTo(X(q[0]),Z(q[1])):g.moveTo(X(q[0]),Z(q[1])));g.stroke();g.lineWidth=8.4*k;g.beginPath();CAN.forEach((q,i)=>i?g.lineTo(X(q[0]),Z(q[1])):g.moveTo(X(q[0]),Z(q[1])));g.stroke();
 g.fillStyle='#4a82b4';for(const p of PONDS){g.beginPath();g.ellipse(X(p[0]),Z(p[1]),p[2]*k,p[3]*k,0,0,6.3);g.fill()}
 g.strokeStyle='#3a3030';g.lineWidth=Math.max(1.5,4*k);g.beginPath();g.moveTo(X(RAILX0),Z(RAILZ));g.lineTo(X(RAILX1),Z(RAILZ));g.stroke();g.strokeStyle='#e8e0d0';g.lineWidth=Math.max(.6,1.6*k);g.setLineDash([6*k,6*k]);g.beginPath();g.moveTo(X(RAILX0),Z(RAILZ));g.lineTo(X(RAILX1),Z(RAILZ));g.stroke();g.setLineDash([]);
 g.restore()}
