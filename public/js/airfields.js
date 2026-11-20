/* ===== Airfields + Marlowe City + the village airport office, built on top of airport.js ===== */
(function(){
const A=window.AIRPORT,{AP,MAPS,CIN,registerMap,chunk,setActive,pump,mapAt,wmt,cvx,LAY,PATH,Wc}=A;
const Y=G0,TAU=Math.PI*2;
const crp=(a,b,c,d,t)=>{const t2=t*t,t3=t2*t;return[0,1].map(k=>.5*(2*b[k]+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t2+(-a[k]+3*b[k]-3*c[k]+d[k])*t3))};
const spline=(P,n)=>{const o=[];for(let i=0;i<P.length-1;i++)for(let k=0;k<n;k++)o.push(crp(P[Math.max(0,i-1)],P[i],P[i+1],P[Math.min(P.length-1,i+2)],k/n));o.push(P[P.length-1]);return o};
let rs=77;const rnd=()=>(rs=(rs*16807)%2147483647)/2147483647;
/* ---------------------------------------------------------------- maps */
const HOME=registerMap({id:'home',city:'COZY VILLAGE',airfield:'COZY AIRFIELD',ox:-1500,oz:1500,reg:[-430,340,-640,640],style:'country',welcome:'WELCOME BACK TO THE VILLAGE'});
const MARL=registerMap({id:'marlowe',city:'MARLOWE',airfield:'MARLOWE INTERNATIONAL',ox:2400,oz:-1500,reg:[-740,260,-560,1000],style:'city',welcome:'WELCOME TO MARLOWE'});
const ROUTES={home:['marlowe'],marlowe:['home']},FARE=150,CAPN=20;
/* ---------------------------------------------------------------- shared builders */
const mk=m=>({m,Br:new Builder(2),L:{},Bo:new Builder(3),W:(u,v)=>[m.ox+u,m.oz+v]});
const mLay=[];const lm=k=>mLay[k]||(mLay[k]=wmat(null,{polygonOffset:true,polygonOffsetFactor:-2-k*2,polygonOffsetUnits:-2-k*4},roadTex));const lyr=(c,y)=>{const k=y<=.035?0:y<=.045?1:y<=.055?2:y<=.065?3:y<=.075?4:5;if(!k)return c.Br;return c.L[k]||(c.L[k]=new Builder(2))};
function flush(c){const g=new THREE.Group();if(c.Br.p.length)g.add(c.Br.mesh(mRoad));for(const k in c.L){if(!c.L[k].p.length)continue;const mt=lm(k);g.add(c.L[k].mesh(mt))}c.L={};if(c.Bo.p.length)g.add(c.Bo.mesh(mObj));if(g.children.length)chunk(c.m,g);c.Br=new Builder(2);c.Bo=new Builder(3)}
const qd=(c,u0,v0,u1,v1,col,y)=>{const W=c.W;quadXZ(lyr(c,y),W(u0,v0),W(u1,v0),W(u1,v1),W(u0,v1),col,Y+y*3.2)};
const qpoly=(c,pts,w,col,y)=>{const W=c.W;for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1,nx=-(b[1]-a[1])/l*w/2,nz=(b[0]-a[0])/l*w/2;quadXZ(lyr(c,y),W(a[0]-nx,a[1]-nz),W(a[0]+nx,a[1]+nz),W(b[0]+nx,b[1]+nz),W(b[0]-nx,b[1]-nz),col,Y+y*3.2)}};
const pb=(c,u,y,v,sx,sy,sz,col,rot)=>{const p=c.W(u,v);pbox(c.Bo,p[0],Y+y,p[1],sx,sy,sz,col,rot||0)};
const pc=(c,u,y,v,r,h,sg,col)=>{const p=c.W(u,v);pcyl(c.Bo,p[0],Y+y,p[1],r,h,sg,col)};
const pn=(c,u,y,v,r,h,sg,col)=>{const p=c.W(u,v);pcone(c.Bo,p[0],Y+y,p[1],r,h,sg,col,0)};
const col_=(m,u,v,w,d,rot)=>{const p=[m.ox+u,m.oz+v];perimCol(p[0],p[1],rot||0,w/2,d/2,2.2,5);OBS.push({x:p[0],z:p[1],c:1,s:0,hw:w/2,hd:d/2})};
const RW=[.17,.17,.19],SH=[.24,.24,.26],WT=[.95,.95,.92],YL=[.95,.78,.1],CON=[.56,.56,.57];
const sign=(m,t,bg,fg,u,y,v,wd,ht,ry,pw,ph,sz)=>{const p=Wc(m,u,v),mm=new THREE.Mesh(new THREE.PlaneGeometry(wd,ht),new THREE.MeshBasicMaterial({map:txtTex(pw||512,ph||Math.round((pw||512)*ht/wd),bg,fg,t,sz),side:THREE.DoubleSide}));mm.position.set(p[0],Y+y,p[1]);mm.rotation.y=ry||0;return mm};
const glowPts=(pts,col,size)=>{const g=new THREE.BufferGeometry(),a=new Float32Array(pts.length*3);pts.forEach((p,i)=>{a[i*3]=p[0];a[i*3+1]=p[1];a[i*3+2]=p[2]});g.setAttribute('position',new THREE.BufferAttribute(a,3));return new THREE.Points(g,new THREE.PointsMaterial({color:col,size:size||3.2,sizeAttenuation:false,fog:false}))};
function glassTex(tag){return cvx(512,128,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#7fb4d8');g.addColorStop(.55,'#5a8fb8');g.addColorStop(1,'#2e5a80');c.fillStyle=g;c.fillRect(0,0,w,h);c.fillStyle='rgba(255,255,255,.14)';for(let i=0;i<7;i++){c.beginPath();c.moveTo(i*80,0);c.lineTo(i*80+26,0);c.lineTo(i*80-30,h);c.lineTo(i*80-56,h);c.fill()}c.fillStyle='#e8ecef';for(let x=0;x<=w;x+=32)c.fillRect(x-1.5,0,3,h);c.fillRect(0,h*.52,w,3);c.fillRect(0,0,w,4);c.fillRect(0,h-5,w,5)})}
/* ---------------------------------------------------------------- the airfield (identical local frame everywhere) */
function* airfield(m){const c=mk(m),W=c.W;
 /* runway */
 qd(c,-30,-575,30,575,SH,.04);qd(c,-22,-560,22,560,RW,.05);
 for(const sd of[-1,1]){qd(c,sd*20.4-.3,-555,sd*20.4+.3,555,WT,.07)}
 for(let z=-540;z<=540;z+=30)qd(c,-.45,z-7.5,.45,z+7.5,WT,.07);
 for(const sg of[-1,1]){const z0=sg*545;for(let k=-7;k<=7;k++){if(k===0)continue;qd(c,k*2.6-.8,sg>0?z0-30:z0,k*2.6+.8,sg>0?z0:z0+30,WT,.07)}
  for(const zz of[300,400,160]){const z=sg*zz;for(const sx of[-1,1]){qd(c,sx*9-1.4,z-12,sx*9+1.4,z+12,WT,.07);qd(c,sx*13.5-1.4,z-12,sx*13.5+1.4,z+12,WT,.07)}}}
 /* taxiways: exit curve, parallel taxiway, connector to the threshold, apron */
 qpoly(c,PATH.p,20,RW,.05);qd(c,-95,-300,-77,430,RW,.05);
 qpoly(c,spline([[-86,330],[-84,372],[-62,404],[-28,418],[0,412]],8),20,RW,.05);
 qpoly(c,PATH.p,.5,YL,.07);qd(c,-86.2,-300,-85.8,425,YL,.07);qpoly(c,spline([[-86,330],[-84,372],[-62,404],[-28,418],[0,412]],8),.5,YL,.07);
 qd(c,-136,-302,-45,-96,CON,.044);for(let z=-290;z<=-110;z+=18)qd(c,-135,z-.1,-46,z+.1,[.5,.5,.51],.06);qd(c,-86.3,-250,-85.7,-110,YL,.08);qd(c,-96,-203,-76,-197,YL,.08);qd(c,-94,-212,-78,-211.7,YL,.08);
 {const num=cvx(256,256,(g,w,h)=>{g.fillStyle='#f4f4ee';g.font='bold 170px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('36',w/2,h/2)});const nm=new THREE.Mesh(new THREE.PlaneGeometry(14,14).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:num,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));const p=W(0,500);nm.position.set(p[0],Y+.09,p[1]);const g=new THREE.Group();g.add(nm);chunk(m,g);
  const n2=nm.clone();n2.material=nm.material.clone();n2.material.map=cvx(256,256,(g2,w,h)=>{g2.fillStyle='#f4f4ee';g2.font='bold 170px Arial';g2.textAlign='center';g2.textBaseline='middle';g2.save();g2.translate(w/2,h/2);g2.rotate(Math.PI);g2.fillText('18',0,0);g2.restore()});const p2=W(0,-500);n2.position.set(p2[0],Y+.09,p2[1]);const g2=new THREE.Group();g2.add(n2);chunk(m,g2)}
 flush(c);yield;
 /* edge + approach + taxi lights */
 {const e=[],ce=[],ap=[],tx=[];for(let z=-555;z<=555;z+=30)for(const sx of[-1,1]){const p=W(sx*23.5,z);e.push([p[0],Y+.35,p[1]])}
  for(let z=-540;z<=540;z+=15){const p=W(0,z);ce.push([p[0],Y+.12,p[1]])}
  for(let z=565;z<=980;z+=30){const p=W(0,z);ap.push([p[0],Y+.5,p[1]]);if((z-565)%60===0)for(const sx of[-1,1])for(let k=1;k<=3;k++){const q=W(sx*k*4,z);ap.push([q[0],Y+.5,q[1]])}}
  for(let z=-300;z<=420;z+=30)for(const sx of[-1,1]){const p=W(-86+sx*10.5,z);tx.push([p[0],Y+.3,p[1]])}
  const g=new THREE.Group();g.add(glowPts(e,0xfff6d8,3.4),glowPts(ce,0xffffff,2.2),glowPts(ap,0xfff0d0,3.4),glowPts(tx,0x58a8ff,3));
  const th=[],te=[];for(const sd of[-1,1])for(let k=-5;k<=5;k++){const p=W(k*4,sd*559);(sd>0?th:te).push([p[0],Y+.3,p[1]])}g.add(glowPts(th,0x40ff70,3.6),glowPts(te,0xff4050,3.6));
  const pa=[];for(let k=0;k<4;k++){const p=W(-30-k*2.2,255);pa.push([p[0],Y+.4,p[1]])}g.add(glowPts(pa,0xff6a50,4));chunk(m,g)}
 yield;
 /* terminal */
 pb(c,-150,0,-200,24,11,130,[.82,.84,.86]);pb(c,-146,11,-200,34,1.3,138,[.9,.9,.92]);pb(c,-130,10.6,-200,12,.5,138,[.28,.3,.34]);
 for(let z=-262;z<=-138;z+=14)pc(c,-125,0,z,.42,10.6,8,[.88,.88,.9]);
 pb(c,-150,12.3,-200,18,2.2,80,[.7,.72,.76]);for(let k=0;k<6;k++)pb(c,-156,12.3,-160-k*14,3,2.8,3,[.6,.62,.66]);
 pb(c,-138,0,-200,.4,.7,130,[.3,.32,.36]);
 flush(c);
 {const gt=glassTex();gt.wrapS=THREE.RepeatWrapping;gt.repeat.set(5,1);const gm=wmt(gt,{side:THREE.DoubleSide}),gp=new THREE.Mesh(new THREE.PlaneGeometry(126,8.2),gm),p=W(-137.7,-200);gp.position.set(p[0],Y+5,p[1]);gp.rotation.y=Math.PI/2;const gg=new THREE.Group();gg.add(gp);
  const sg=sign(m,m.airfield,'#13202e','#ffffff',-123.8,10.6,-200,40,1.9,Math.PI/2,1024,48,44);gg.add(sg);chunk(m,gg)}
 /* door frames for the gate */
 {const g=new THREE.Group(),d=sign(m,'GATE 1','#1a3c78','#ffffff',-123.6,8.2,-211,5,1.1,Math.PI/2,256,56,36);g.add(d);chunk(m,g)}
 yield;
 /* control tower, hangar, vehicles, windsock, fuel */
 pc(c,-172,0,-100,3,26,12,[.86,.86,.88]);pc(c,-172,26,-100,5.4,2.4,12,[.3,.3,.34]);pb(c,-172,28.4,-100,9,3.6,9,[.34,.5,.62]);pb(c,-172,32,-100,10.5,.8,10.5,[.9,.9,.92]);pc(c,-172,32.8,-100,.25,7,6,[.8,.1,.1]);
 for(let k=0;k<4;k++)pc(c,-172,6+k*5.5,-100,3.05,.5,12,[.8,.14,.14]);
 flush(c);
 pb(c,-150,0,140,34,10,56,[.7,.74,.78]);pb(c,-150,10,140,36,1.2,58,[.46,.5,.56]);pb(c,-133,0,140,.4,8,34,[.2,.22,.26]);for(let k=0;k<5;k++)pb(c,-132.7,0,124+k*8,.3,8,.2,[.55,.58,.62]);
 col_(m,-150,140,34,56);col_(m,-150,-200,24,130);col_(m,-172,-100,10,10);
 pb(c,-64,0,-250,3.2,1.2,2.2,[.9,.6,.1]);for(let k=0;k<3;k++)pb(c,-64,0,-256-k*3.6,2.6,.9,3.2,[.4,.45,.52]);pb(c,-60,0,-238,5.5,2.2,2.4,[.95,.95,.95]);pb(c,-110,0,-125,2.4,1.6,5,[.95,.95,.95]);pc(c,-110,1.0,-125,1.2,2.4,10,[.9,.9,.92]);pb(c,-74,0,-122,1.4,1.2,2,[.2,.5,.85]);
 for(let k=0;k<10;k++)pc(c,-96+k*3.3,0,-286,.28,.7,6,[.95,.45,.1]);
 {const w=W(40,330),pole=new THREE.Mesh(new THREE.CylinderGeometry(.08,.1,7,6),new THREE.MeshBasicMaterial({color:0xcccccc}));pole.position.set(w[0],Y+3.5,w[1]);const sock=new THREE.Mesh(new THREE.ConeGeometry(.55,3,10,1,true).rotateZ(-Math.PI/2),new THREE.MeshBasicMaterial({color:0xff7a18,side:THREE.DoubleSide}));sock.position.set(w[0]+1.5,Y+7,w[1]);const g=new THREE.Group();g.add(pole,sock);chunk(m,g)}
 flush(c);yield;
 if(m.style==='country')yield*countryside(m,c);else yield*(window.MCITY?window.MCITY(m,c):city(m,c))}
function* countryside(m,c){const W=c.W;
 /* patchwork fields */
 const fc=[[.38,.55,.22],[.55,.58,.24],[.3,.48,.2],[.62,.55,.28],[.42,.52,.3],[.7,.62,.34]];let k=0;
 for(let u=70;u<360;u+=95)for(let v=-600;v<600;v+=130){qd(c,u,v,u+88,v+122,fc[(k++)%fc.length],.02)}
 for(let u=-420;u<-190;u+=95)for(let v=-600;v<-300;v+=130){qd(c,u,v,u+88,v+122,fc[(k++)%fc.length],.02)}
 for(let u=-420;u<-190;u+=95)for(let v=330;v<620;v+=130){qd(c,u,v,u+88,v+122,fc[(k++)%fc.length],.02)}
 qd(c,64,-600,70,600,[.34,.3,.24],.03);
 flush(c);yield;
 /* barn, silo, trees, hedges */
 pb(c,220,0,-120,20,6,30,[.7,.2,.16]);pb(c,220,6,-120,22,2.2,32,[.38,.18,.14]);pc(c,244,0,-110,3.4,15,12,[.78,.78,.8]);pn(c,244,15,-110,3.7,3,12,[.5,.54,.6]);col_(m,220,-120,20,30);
 for(let i=0;i<460;i++){const u=-420+rnd()*740,v=-620+rnd()*1240;if(Math.abs(u)<75&&true)continue;if(u>-190&&u<-40&&Math.abs(v+200)<160)continue;if(u>-190&&u<-40&&v>80&&v<220)continue;if(u>-100&&u<-40&&v>-320&&v<440)continue;if(u<-60&&u>-200&&v<-60&&v>-340)continue;const h=3+rnd()*4;pc(c,u,0,v,.3,h*.55,5,[.4,.28,.18]);pn(c,u,h*.4,v,1.7+rnd()*1.2,h,6,[.12+rnd()*.12,.34+rnd()*.14,.14+rnd()*.06])}
 for(let k2=0;k2<12;k2++){const u=90+k2*24;pb(c,u,0,-500,18,1.1,1.2,[.2,.4,.16])}
 for(let i=0;i<10;i++)pn(c,-520+i*90,0,-900,70+rnd()*40,40+rnd()*36,8,[.28,.46,.3]);
 for(let i=0;i<8;i++)pn(c,500+i*10,0,-700+i*160,80,50+rnd()*30,8,[.3,.46,.3]);
 flush(c);yield}
/* ---------------------------------------------------------------- Marlowe: a city of ~230 buildings, built in slices */
function winTex(kind){const S=[{wall:'#9aa8b8',win:'#2a4a6a',lit:'#ffe9a8',pw:.64},{wall:'#2a3a4a',win:'#4a7ea8',lit:'#ffe9a8',pw:.78},{wall:'#d8d2c4',win:'#4a5a6a',lit:'#ffe9a8',pw:.5},{wall:'#a8583c',win:'#2e3a46',lit:'#ffe9a8',pw:.46},{wall:'#c8b88a',win:'#46586a',lit:'#ffe9a8',pw:.52}][kind];
 const t=cvx(128,128,(c,w,h)=>{c.fillStyle=S.wall;c.fillRect(0,0,w,h);for(let fy=0;fy<2;fy++)for(let fx=0;fx<2;fx++){const lit=((fx*3+fy*5+kind)%3===0);c.fillStyle=lit?S.lit:S.win;const ww=w/2*S.pw,wh=h/2*.56;c.fillRect(fx*w/2+(w/2-ww)/2,fy*h/2+h/2*.2,ww,wh);c.fillStyle='rgba(255,255,255,.18)';c.fillRect(fx*w/2+(w/2-ww)/2,fy*h/2+h/2*.2,ww,wh*.28)}c.fillStyle='rgba(0,0,0,.18)';c.fillRect(0,h/2-2,w,2);c.fillRect(0,h-2,w,2)});t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
function MB(){return{p:[],c:[],u:[],n:0}}
function wall(b,x0,z0,x1,z1,y0,y1,sh,tint){const L=Math.hypot(x1-x0,z1-z0),ur=L/4,vr=(y1-y0)/3.4,k=b.n;b.p.push(x0,y0,z0,x1,y0,z1,x1,y1,z1,x0,y1,z0);b.u.push(0,0,ur,0,ur,vr,0,vr);for(let i=0;i<4;i++)b.c.push(sh*tint[0],sh*tint[1],sh*tint[2]);b.n+=4;return k}
function bmesh(b,mat){const g=new THREE.BufferGeometry(),idx=[];for(let k=0;k<b.n;k+=4)idx.push(k,k+1,k+2,k,k+2,k+3);g.setAttribute('position',new THREE.Float32BufferAttribute(b.p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(b.c,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(b.u,2));g.setIndex(idx);g.computeBoundingSphere();return new THREE.Mesh(g,mat)}
function roofQ(b,x0,z0,x1,z1,y,tint){const k=b.n;b.p.push(x0,y,z0,x1,y,z0,x1,y,z1,x0,y,z1);b.u.push(0,0,1,0,1,1,0,1);for(let i=0;i<4;i++)b.c.push(tint[0],tint[1],tint[2]);b.n+=4}
let OFS=[0,0];function boxB(bs,roof,x,z,w,d,h,y0,kind,tint){x+=OFS[0];z+=OFS[1];const b=bs[kind],x0=x-w/2,x1=x+w/2,z0=z-d/2,z1=z+d/2,y1=y0+h;wall(b,x0,z1,x1,z1,y0,y1,.88,tint);wall(b,x1,z1,x1,z0,y0,y1,.76,tint);wall(b,x1,z0,x0,z0,y0,y1,.86,tint);wall(b,x0,z0,x0,z1,y0,y1,.7,tint);roofQ(roof,x0,z0,x1,z1,y1,[.5,.52,.55])}
function* city(m,c){OFS=[m.ox,m.oz];const W=c.W,mats=[0,1,2,3,4].map(k=>wmt(winTex(k),{vertexColors:true})),roofM=wmt(null,{vertexColors:true},[1,1,1]);
 /* streets: one big asphalt slab, pavement per block, dashed centre lines */
 qd(c,-700,-500,-196,960,[.17,.17,.19],.03);const bx=[],bz=[];for(let i=0;i<6;i++)bx.push(-265-i*70);for(let j=0;j<20;j++)bz.push(-400+j*70);
 for(const x of bx)for(const z of bz)qd(c,x-28,z-28,x+28,z+28,[.52,.52,.5],.06);
 for(let i=0;i<=6;i++){const x=-230-i*70+(-0);for(let z=-470;z<960;z+=9)qd(c,x-.2,z,x+.2,z+4.5,[.85,.82,.5],.045)}
 for(let j=0;j<=20;j++){const z=-435+j*70;for(let x=-690;x<-205;x+=9)qd(c,x,z-.2,x+4.5,z+.2,[.85,.82,.5],.045)}
 flush(c);yield;
 /* plaza in front of the terminal + kiosk + fountain */
 qd(c,-215,-282,-164,-120,[.66,.64,.6],.06);qd(c,-212,-278,-168,-124,[.72,.7,.65],.07);
 pc(c,-190,0,-200,6,.7,24,[.58,.58,.6]);pc(c,-190,.7,-200,5.3,.15,24,[.2,.5,.7]);pc(c,-190,.7,-200,.7,3.4,10,[.75,.75,.78]);pc(c,-190,3.5,-200,1.6,.5,12,[.5,.74,.9]);
  for(let k=0;k<6;k++){pc(c,-170,0,-272+k*30,.12,5.6,6,[.3,.3,.34]);pb(c,-170,5.5,-272+k*30,.5,.3,.5,[1,.95,.7])}
 for(let k=0;k<8;k++){const z=-270+k*20;pc(c,-208,0,z,.3,2.6,6,[.4,.28,.18]);pn(c,-208,2.2,z,1.8,2.8,7,[.18,.5,.22])}
 col_(m,-190,-200,12,12);
 flush(c);
 pb(c,-162.3,0,-200,.5,3.6,5.2,[.08,.12,.18]);pb(c,-162.2,0,-202.9,.6,3.8,.5,[.85,.7,.2]);pb(c,-162.2,0,-197.1,.6,3.8,.5,[.85,.7,.2]);pb(c,-162.2,3.6,-200,.6,.5,6.4,[.85,.7,.2]);pb(c,-166.4,4.1,-200,9,.4,12,[.2,.3,.5]);for(const sv of[-1,1])pc(c,-170.6,0,-200+sv*5.4,.25,4.1,8,[.85,.85,.88]);
 pb(c,-163.2,0,-200,2.8,.06,5.6,[.5,.18,.2]);
 const kg=new THREE.Group();kg.add(sign(m,'ARRIVALS  ·  CHECK-IN  ·  SHOPS','#14223a','#ffd24a',-171.05,4.3,-200,8,.8,-Math.PI/2,768,76,34));
 
 const sk=sign(m,'WELCOME TO MARLOWE','#101a2a','#e8d890',-190,6.5,-120,16,2,0,1024,128,56);kg.add(sk);chunk(m,kg);flush(c);yield;
 /* the skyline and blocks */
 const cxn=-440,czn=560;let nb=0,bs=[0,1,2,3,4].map(MB),roof=MB(),colTally=0;
 const flushB=()=>{const g=new THREE.Group();bs.forEach((b,k)=>{if(b.n)g.add(bmesh(b,mats[k]))});if(roof.n)g.add(bmesh(roof,roofM));if(g.children.length)chunk(m,g);bs=[0,1,2,3,4].map(MB);roof=MB()};
 for(const x of bx)for(const z of bz){
  if(z>-210&&z<-130&&x>-300)continue;/* keep the plaza approach clear */
  const park=((Math.round(x/70)+Math.round(z/70)*3)%13===0);
  if(park){qd(c,x-27,z-27,x+27,z+27,[.3,.5,.24],.08);for(let t=0;t<9;t++){const u=x-20+rnd()*40,v=z-20+rnd()*40;pc(c,u,0,v,.28,2.4,5,[.4,.28,.18]);pn(c,u,1.8,v,2.1+rnd(),4.4,7,[.14+rnd()*.1,.42+rnd()*.14,.16])}if(Math.abs(x+300)<60&&z<200)pc(c,x,0,z,4,.5,16,[.5,.52,.5]);continue}
  const dd=Math.hypot(x-cxn,(z-czn)*.8),core=Math.max(0,1-dd/420),sub=(rnd()<.45?2:1);
  for(let q=0;q<sub;q++){const w=sub===2?23:44,d=sub===2?44:42,ox=sub===2?(q?13:-13):0,tint=[.88+rnd()*.2,.88+rnd()*.2,.88+rnd()*.2],kind=(rnd()*5)|0;let h=10+rnd()*20+core*core*(80+rnd()*90)+(rnd()<.06?40:0);if(x>-300&&z<260)h=Math.min(h,16+rnd()*10);if(core<.15&&rnd()<.5)h=8+rnd()*10;
   const bxp=x+ox,bzp=z;boxB(bs,roof,bxp,bzp,w,d,h,Y,kind,tint);
   if(h>46){const h2=h*.28,k2=(rnd()*5)|0;boxB(bs,roof,bxp,bzp,w*.62,d*.62,h2,Y+h,k2,tint);if(rnd()<.6)pc(c,bxp,h+h2,bzp,.35,10+rnd()*14,5,[.7,.7,.74])}
   else if(rnd()<.5)pb(c,bxp+rnd()*6-3,h,bzp+rnd()*6-3,5,2,5,[.55,.56,.6]);
   if(x>-560&&z<520)col_(m,bxp,bzp,w,d)}
  if(++nb%7===0){flushB();flush(c);yield}}
 flushB();flush(c);yield;
 /* sky tower landmark */
 {const x=-420,z=470;pc(c,x,0,z,7,40,16,[.74,.76,.8]);pc(c,x,40,z,5.2,110,16,[.8,.82,.86]);pc(c,x,150,z,17,5,24,[.3,.34,.42]);pc(c,x,155,z,19,3,24,[.82,.84,.88]);pc(c,x,158,z,13,6,20,[.3,.34,.42]);pc(c,x,164,z,.7,70,8,[.7,.7,.74]);pc(c,x,233,z,1.2,1.6,8,[.9,.1,.1]);
  const sg=sign(m,'MARLOWE SKY TOWER','#12202e','#ffe9a8',x,153,z+19.1,22,2.6,0,1024,120,52);const g=new THREE.Group();g.add(sg);for(const[ry,dx,dz]of[[Math.PI/2,19.1,0],[Math.PI,0,-19.1],[-Math.PI/2,-19.1,0]]){const s2=sg.clone();s2.position.x+=dx;s2.position.z+=dz-19.1;s2.rotation.y=ry;g.add(s2)}
  chunk(m,g);flush(c);col_(m,x,z,14,14)}
 yield;
 /* parked cars + street lamps near the plaza and main roads */
 for(let k=0;k<64;k++){const x=bx[(rnd()*6)|0]+(rnd()<.5?-1:1)*30.5,z=bz[(rnd()*20)|0]+(rnd()*50-25);if(x>-300&&z>-300&&z<-100)continue;const cs=[[.8,.15,.15],[.15,.3,.7],[.9,.9,.9],[.15,.15,.18],[.85,.7,.15],[.2,.5,.3]][(rnd()*6)|0];pb(c,x,0,z,1.9,.7,4.2,cs);pb(c,x,.7,z-.2,1.7,.6,2.2,[.16,.2,.26])}
 for(let k=0;k<70;k++){const x=bx[(rnd()*6)|0]+(rnd()<.5?-1:1)*29.5,z=bz[(rnd()*20)|0]+(rnd()*50-25);pc(c,x,0,z,.11,5.2,5,[.3,.3,.34]);pb(c,x,5.1,z,.9,.2,.4,[1,.95,.7])}
 flush(c);yield;
 /* a ring of distant towers so the skyline reads from the approach */
 for(let k=0;k<40;k++){const a=-1.35+k*.07,r=520+rnd()*140,x=-440+Math.cos(a+Math.PI)*r*.9,z=520+Math.sin(a+Math.PI)*r;if(x>-250)continue;const h=70+rnd()*110,w=26+rnd()*20;boxB(bs,roof,x,z,w,w,h,Y,(rnd()*2)|0,[.9,.9,.95])}
 flushB();yield}
/* ---------------------------------------------------------------- arrival hooks (where the player is put when a flight ends) */
HOME.gen=airfield;MARL.gen=airfield;
HOME.arrive=function(){const D=OFFICE.door;GS.inside=0;if(window.inG)inG.visible=false;P.x=D[0];P.z=D[1];P.y=gH(P.x,P.z)+.02;P.psi=OFFICE.psi;P.speed=0;GS.onFoot=1;man.visible=true;camAng=P.psi;AP.at='home'};
const MTERM={x:MARL.ox-163.8,z:MARL.oz-200,psi:-Math.PI/2,t:'MARLOWE AIRPORT',bg:'#14223a',fg:'#ffd24a',apt:2,rx:12.5,rz:6,sz:3.4};
MARL.arrive=function(){AP.at='marlowe';GS.inside=0;GS.onFoot=1;man.visible=true;P.x=MTERM.x;P.z=MTERM.z;P.y=G0;P.speed=0;SHOPCUR={o:MTERM,k:[]};enterShop(MTERM,true);toast('WELCOME TO MARLOWE')};
/* region activation follows the player (also covers loading a save made abroad) */
{const u0=updCozy;updCozy=function(dt){u0(dt);if(CIN.on)return;const p=GS.onFoot?P:GS,m=mapAt(p.x,p.z);for(const k in MAPS){const q=MAPS[k];if(m===q&&!q.built){pump(q,6)}if(q.built&&q.active!==(m===q?1:0))setActive(q,m===q?1:0)}A.warmTick()}}
/* ---------------------------------------------------------------- goods trade */
const GOODS=[['coffee','MARLOWE COFFEE','marlowe',12,23],['choc','SWISS CHOCOLATE','marlowe',9,17],['watch','DESIGNER WATCH','marlowe',140,235,4],['cheese','VILLAGE CHEDDAR','home',14,29],['ale','ROYAL OAK ALE','home',10,21],['honey','COZY HONEY','home',18,36]];
function demand(){const d=typeof DAY==='number'?DAY:0;if(AP.day===d&&Object.keys(AP.dem).length)return;AP.day=d;for(const g of GOODS)AP.dem[g[0]]=Math.round((.82+Math.random()*.45)*100)/100}
const carryN=()=>Object.values(AP.goods).reduce((a,b)=>a+b,0);
/* ---------------------------------------------------------------- overlay: flights + trade */
let OV=null;
function open(tab){if(OV||busy||CIN.on)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;demand();
 const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:60;background:rgba(0,0,10,.72);font:bold 13px monospace;color:#fff;display:flex;align-items:center;justify-content:center';document.body.appendChild(ov);
 const pn_=document.createElement('div');pn_.style.cssText='width:min(94vw,580px);max-height:92vh;overflow:auto;background:#0b1422;border:3px solid #6aa8ff;box-shadow:4px 4px 0 #000;padding:10px;box-sizing:border-box';ov.appendChild(pn_);pn_.onpointerdown=e=>e.stopPropagation();
 OV={ov,pn:pn_,tab:tab||0,msg:''};OV.kd=e=>{if(e.key==='Escape')close()};addEventListener('keydown',OV.kd);render()}
function close(){if(!OV)return;removeEventListener('keydown',OV.kd);OV.ov.remove();OV=null;busy=0}
function here(){const p=GS.onFoot?P:GS,m=mapAt(p.x,p.z);return m?m.id:'home'}
function render(){const pn_=OV.pn;pn_.textContent='';const el=(t,css,txt,par)=>{const e=document.createElement(t);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;(par||pn_).appendChild(e);return e};
 const bt=(par,txt,on,fn,dis)=>{const b=el('button','font:bold 12px monospace;border:2px solid '+(on?'#6aa8ff':'#556')+';border-radius:6px;color:#fff;background:'+(on?'#1c3a6a':'#242838')+';padding:6px 9px;margin:2px;touch-action:manipulation;'+(dis?'opacity:.4;':''),txt,par);b.onclick=e=>{e.stopPropagation();fn()};return b};
 const loc=here(),M=MAPS[loc];const hd=el('div','display:flex;justify-content:space-between;align-items:center;margin-bottom:6px');el('div','font-size:16px;color:#8cf','COZY AIRWAYS  ·  '+M.airfield,hd);bt(hd,'CLOSE',0,close);
 el('div','color:#9fe','CASH £'+Math.round(cash)+'  ·  FLIGHTS TAKEN '+AP.trips);if(OV.msg)el('div','color:#ffd24a;margin:3px 0',OV.msg);
 const tb=el('div','margin:6px 0');['FLIGHTS','TRADE GOODS'].forEach((t,i)=>{if(i===OV.tab)el('div','color:#ffd24a;font-size:15px;letter-spacing:1px',i?'DUTY FREE SHOP':'TICKET DESK',tb)});
 if(OV.tab===0){(ROUTES[loc]||[]).forEach(to=>{const T=MAPS[to],r=el('div','display:flex;justify-content:space-between;align-items:center;border:2px solid #234;padding:8px;margin:4px 0;background:#0f1c30'),L=el('div','',null,r);el('div','font-size:15px;color:#fff',T.airfield+'  ·  '+T.city,L);el('div','font-size:11px;color:#9ab',(to==='marlowe'?'A BIG CITY OF GLASS TOWERS, SHOPS AND THE SKY TOWER':'BACK TO THE QUIET VILLAGE')+'  ·  ECONOMY  £'+FARE,L);
   bt(r,'CHECK IN  £'+FARE,1,()=>{if(cash<FARE)return(OV.msg='NOT ENOUGH CASH',render());cash-=FARE;AP.spent+=FARE;close();begin(loc,to)},cash<FARE)});
  el('div','margin-top:8px;color:#9ab;font-size:11px','TIP: BUY GOODS HERE, SELL THEM THERE FOR MORE. YOU CAN CARRY '+CAPN+' ITEMS ('+carryN()+' NOW).')}
 else{const my=GOODS.filter(g=>g[2]===loc),other=GOODS.filter(g=>g[2]!==loc);el('div','color:#8cf;margin-top:2px','BUY  (MADE HERE)');
  my.forEach(g=>{const lim=g[5]||CAPN,have=AP.goods[g[0]]|0,p=g[3],r=el('div','display:flex;justify-content:space-between;align-items:center;border-top:1px solid #234;padding:4px 2px'),L=el('div','',null,r);el('div','color:#fff',g[1]+'  £'+p+' EACH',L);el('div','font-size:11px;color:#9ab','IN BAG '+have+(g[5]?'  ·  MAX '+g[5]:''),L);const R=el('div','',null,r);
   const buy=n=>{n=Math.min(n,CAPN-carryN(),lim-have,Math.floor(cash/p));if(n<1){OV.msg=cash<p?'NOT ENOUGH CASH':'BAG IS FULL';return render()}cash-=n*p;AP.goods[g[0]]=have+n;beep(800,.06,'square',.05);OV.msg='BOUGHT '+n+' x '+g[1];render()};bt(R,'BUY 1',0,()=>buy(1));bt(R,'BUY 5',1,()=>buy(5));bt(R,'MAX',0,()=>buy(99))});
  el('div','color:#8cf;margin-top:10px','SELL  (BROUGHT FROM '+(loc==='home'?'MARLOWE':'THE VILLAGE')+')');let any=0;
  other.forEach(g=>{const have=AP.goods[g[0]]|0,pr=Math.round(g[4]*(AP.dem[g[0]]||1)),r=el('div','display:flex;justify-content:space-between;align-items:center;border-top:1px solid #234;padding:4px 2px'),L=el('div','',null,r);any+=have;el('div','color:#fff',g[1]+'  £'+pr+' EACH',L);el('div','font-size:11px;color:'+(AP.dem[g[0]]>1.1?'#40e060':AP.dem[g[0]]<.92?'#ff7070':'#9ab'),'DEMAND '+(AP.dem[g[0]]>1.1?'HIGH':AP.dem[g[0]]<.92?'LOW':'NORMAL')+'  ·  IN BAG '+have,L);const R=el('div','',null,r);
   bt(R,'SELL ALL',1,()=>{if(!have)return;const t=have*pr;cash+=t;AP.goods[g[0]]=0;beep(880,.1,'square',.06);OV.msg='SOLD '+have+' FOR £'+t;render()},!have)});
  const mine=GOODS.filter(g=>g[2]===loc&&(AP.goods[g[0]]|0)>0);if(mine.length)el('div','margin-top:8px;color:#9ab;font-size:11px','YOU ARE STILL CARRYING LOCAL GOODS - TAKE THEM ON A FLIGHT TO SELL.')}}
function begin(from,to){if(GS.inside)leaveShop(true);A.start(from,to)}
/* ---------------------------------------------------------------- village airport office */
const OFFICE={cx:-160,cz:-178,rot:0,w:38,d:15,h:7};
const W2=(lx,lz)=>{const c=Math.cos(OFFICE.rot),s=Math.sin(OFFICE.rot);return[OFFICE.cx+lx*c+lz*s,OFFICE.cz-lx*s+lz*c]};
OFFICE.door=W2(0,OFFICE.d/2+1.4);OFFICE.psi=OFFICE.rot;
{const Bo=new Builder(3),Br=new Builder(2),p_=(lx,y,lz,sx,sy,sz,col)=>{const p=W2(lx,lz);pbox(Bo,p[0],Y+y,p[1],sx,sy,sz,col,OFFICE.rot)},{w,d,h}=OFFICE,WH=[.94,.95,.97],NV=[.1,.18,.38],GL=[.2,.34,.5];
 p_(0,0,0,w,h,d,WH);p_(0,h,0,w+.8,.5,d+.8,NV);p_(0,h+.5,0,w+.8,.14,d+.8,[.85,.7,.1]);p_(0,0,d/2+.02,w+.2,.5,.3,NV);
 for(let i=0;i<9;i++){if(i===4)continue;p_(-w/2+2.2+i*(w-4.4)/8,1.2,d/2+.12,3.0,3.6,.2,GL)}
 p_(0,0,d/2+.3,5.2,3.8,.5,[.08,.12,.18]);p_(0,3.9,d/2+1.6,9,.4,3.6,NV);for(const sx of[-1,1])pcyl(Bo,W2(sx*4,d/2+3.1)[0],Y,W2(sx*4,d/2+3.1)[1],.3,3.9,8,[.85,.85,.88]);
 {const p=W2(w/2-5,-1);pcyl(Bo,p[0],Y,p[1],2.2,h+16,14,[.86,.86,.88]);pcyl(Bo,p[0],Y+h+16,p[1],4,2.4,14,[.3,.3,.34]);pbox(Bo,p[0],Y+h+18.4,p[1],7,3,7,[.34,.5,.62],0);pbox(Bo,p[0],Y+h+21.4,p[1],8,.6,8,[.9,.9,.92],0);pcyl(Bo,p[0],Y+h+22,p[1],.2,6,5,[.8,.1,.1]);for(let k=0;k<3;k++)pcyl(Bo,p[0],Y+4+k*5.5,p[1],2.28,.5,14,[.8,.14,.14])}
 p_(-w/2+8,h+.6,-1,10,1.4,6,NV);
 for(let k=0;k<3;k++){const p=W2(-w/2-1.4,d/2+2+k*2.4);pcyl(Bo,p[0],Y,p[1],.3,2.2,6,[.4,.28,.18]);pcone(Bo,p[0],Y+1.8,p[1],1.5,2.8,7,[.18,.5,.22],0)}
 const q0=W2(0,d/2+5);quadXZ(Br,[q0[0]-w/2-6,q0[1]-5.5],[q0[0]+w/2+6,q0[1]-5.5],[q0[0]+w/2+6,q0[1]+5.5],[q0[0]-w/2-6,q0[1]+5.5],[.42,.42,.44],Y+.055);
 const ph=Y+.05;
 /* a model jet on a pylon on the roof */
 {const p=W2(3,0),jet=new THREE.Group(),m1=new THREE.MeshBasicMaterial({color:0xf2f4f6}),m2=new THREE.MeshBasicMaterial({color:0x1d56b8}),fu=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,6,10).rotateX(Math.PI/2),m1),wg=new THREE.Mesh(new THREE.BoxGeometry(6.5,.12,1.6),m1),tl=new THREE.Mesh(new THREE.BoxGeometry(.12,1.6,1),m2);wg.position.z=-.2;tl.position.set(0,.8,-2.6);jet.add(fu,wg,tl);jet.position.set(p[0],Y+h+4.2,p[1]);jet.rotation.y=OFFICE.rot+.5;jet.rotation.x=-.18;scene.add(jet);
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,3.4,6),new THREE.MeshBasicMaterial({color:0x8a8e96}));pole.position.set(p[0],Y+h+1.8,p[1]);scene.add(pole)}
 const gr=new THREE.Group();scene.add(gr);gr.add(Br.mesh(mRoad));gr.add(Bo.mesh(mObj));
 const sg=(t,bg,fg,wd,ht,lx,y,lz,pw,ph,sz)=>{const p=W2(lx,lz),m=new THREE.Mesh(new THREE.PlaneGeometry(wd,ht),new THREE.MeshBasicMaterial({map:txtTex(pw,ph,bg,fg,t,sz),side:THREE.DoubleSide}));m.position.set(p[0],Y+y,p[1]);m.rotation.y=OFFICE.rot;gr.add(m)};
 sg('COZY AIRWAYS  ·  AIRPORT','#10244a','#ffd24a',20,2.1,0,h-1.1,d/2+.47,1024,108,52);sg('FLIGHTS  ·  CHECK-IN  ·  DUTY FREE','#a8141c','#ffffff',11,.9,0,h+1.15,d/2+.5,640,52,26);
 perimCol(OFFICE.cx,OFFICE.cz,OFFICE.rot,w/2,d/2,.5,1.2);OBS.push({x:OFFICE.cx,z:OFFICE.cz,c:1,s:0,hw:w/2,hd:d/2});BLD.push({x:OFFICE.cx,z:OFFICE.cz,rot:OFFICE.rot,w,d,k:'airport',n:1});
 SHOPD.push({x:OFFICE.door[0],z:OFFICE.door[1],psi:OFFICE.rot,t:'COZY AIRWAYS',bg:'#10244a',fg:'#ffd24a',apt:1,rx:12.5,rz:6,sz:3.4});Object.assign(HRS,{'COZY AIRWAYS':[6,22]});
 const cone=new THREE.ConeGeometry(.34,.7,4);cone.rotateX(Math.PI);cone.translate(0,-.35,0);const stem=new THREE.BoxGeometry(.16,.5,.16);stem.translate(0,.25,0);const am=new THREE.MeshBasicMaterial({color:0x6aa8ff,fog:false}),ag=new THREE.Group();ag.add(new THREE.Mesh(cone,am),new THREE.Mesh(stem,am));ag.visible=false;scene.add(ag);
 const u0=updCozy;updCozy=function(dt){u0(dt);const px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z,dist=Math.hypot(OFFICE.door[0]-px,OFFICE.door[1]-pz),t=performance.now()/1000;ag.visible=!CIN.on&&!GS.inside&&dist<38&&!menuOpen&&Math.abs(px)<1000;if(ag.visible){ag.position.set(OFFICE.door[0],G0+2.6+Math.sin(t*3.2)*.18,OFFICE.door[1]);ag.rotation.y=t*1.2;ag.scale.setScalar(Math.max(.7,Math.min(1.3,dist/14)))}}}
/* AIRPORT ROAD: a new road north off the High Street, ending at the terminal forecourt, with a car park and a signpost */
{const RDW=3.5,AX=OFFICE.cx,Z0=-6,Z1=OFFICE.cz+OFFICE.d/2+5-5.5,L=[new Builder(2),new Builder(2),new Builder(2),new Builder(2)],Bo=new Builder(3),q=(k,x0,z0,x1,z1,col,y)=>quadXZ(L[k],[x0,z0],[x1,z0],[x1,z1],[x0,z1],col,Y+y);
 ROADS.push({n:'AIRPORT ROAD',p:[[AX,Z0],[AX,Z1]]});{const a=[AX,Z0],b=[AX,Z1],l=Math.abs(Z1-Z0);SEG.push({ri:ROADS.length-1,a,b,l,dx:0,dz:-1})}
 q(0,AX-RDW-PW,Z1,AX+RDW+PW,Z0,[.52,.52,.5],.09);q(1,AX-RDW,Z1,AX+RDW,-3.3,[.17,.17,.19],.13);
 /* flared corners so it reads as a proper junction */
 {const R=4.5,N=8,col=[.17,.17,.19];for(const sx of[-1,1]){const C=[AX+sx*RDW,-3.3],cx=AX+sx*(RDW+R),cz=-3.3-R;for(let i=0;i<N;i++){const t0=i/N*Math.PI/2,t1=(i+1)/N*Math.PI/2;let A=[cx-sx*R*Math.cos(t0),cz+R*Math.sin(t0)],B2=[cx-sx*R*Math.cos(t1),cz+R*Math.sin(t1)];const cr=(A[0]-C[0])*(B2[1]-A[1])-(A[1]-C[1])*(B2[0]-A[0]);if(cr<0){const t=A;A=B2;B2=t}quadXZ(L[1],C,A,B2,B2,col,Y+.13)}}}
 for(let z=Z0-4;z>Z1+2;z-=9)q(2,AX-.2,z-4.5,AX+.2,z,[.85,.82,.5],.17);
 for(const sx of[-1,1])q(2,AX+sx*(RDW-.25)-.1,Z1,AX+sx*(RDW-.25)+.1,Z0,[.9,.9,.88],.17);
 /* lamps down both sides */
 for(let z=-20;z>Z1;z-=26)for(const sx of[-1,1]){pcyl(Bo,AX+sx*(RDW+PW-.4),Y,z,.11,5.2,5,[.3,.3,.34]);pbox(Bo,AX+sx*(RDW+PW-.4),Y+5.1,z,.9,.2,.4,[1,.95,.7],0)}
 /* car park on the east side */
 {const x0=AX+16,x1=AX+66,z0=-168,z1=-120;q(1,x0,z0,x1,z1,[.2,.2,.22],.12);q(1,AX+RDW+PW,z0+14,x0,z0+22,[.2,.2,.22],.12);
  for(let x=x0+4;x<x1;x+=4.2){q(2,x-.1,z0+3,x+.1,z0+13,[.9,.9,.9],.17);q(2,x-.1,z1-13,x+.1,z1-3,[.9,.9,.9],.17)}
  const cc=[[.8,.15,.15],[.15,.3,.7],[.9,.9,.9],[.15,.15,.18],[.85,.7,.15],[.2,.5,.3]];let n=0;for(let x=x0+6;x<x1-2;x+=4.2)for(const zz of[z0+8,z1-8]){if(((x*7+zz*3)|0)%5===0)continue;const c=cc[(n++)%6];pbox(Bo,x,Y,zz,1.9,.7,4.2,c,0);pbox(Bo,x,Y+.7,zz-.1,1.7,.6,2.2,[.16,.2,.26],0)}
  pbox(Bo,x0+10,Y,z0+18,6,2.6,3,[.14,.2,.34],0);pbox(Bo,x0+10,Y+2.6,z0+18,6.6,.3,3.4,[.9,.7,.1],0)}
 /* the terminal's plane-spotting apron wall and flag poles */
 for(const sx of[-1,1]){const x=OFFICE.cx+sx*(OFFICE.w/2+4),z=OFFICE.cz+OFFICE.d/2+3;pcyl(Bo,x,Y,z,.14,9,6,[.8,.8,.84]);pbox(Bo,x+1.1,Y+8,z,2.2,1.3,.05,sx>0?[.1,.3,.7]:[.8,.1,.15],0)}
 const gr=new THREE.Group();scene.add(gr);L.forEach((b,k)=>{if(b.p.length)gr.add(b.mesh(k?lm(k):mRoad))});gr.add(Bo.mesh(mObj));
 /* signpost at the junction */
 {const sgn=new THREE.Mesh(new THREE.PlaneGeometry(6,1.9),new THREE.MeshBasicMaterial({map:txtTex(512,160,'#1c4a8a','#ffffff','✈ AIRPORT ↑',64),side:THREE.DoubleSide}));sgn.position.set(AX-RDW-PW-1.8,Y+3.6,-8.5);sgn.rotation.y=0;const pl=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,3.6,6),new THREE.MeshBasicMaterial({color:0x6a6e76}));pl.position.set(AX-RDW-PW-1.8,Y+1.8,-8.5);gr.add(sgn,pl)}
 /* painted road markings: AIRPORT with a direction arrow */
 {const mk=(kind)=>{const t=cvx(256,256,(g,W,H)=>{g.clearRect(0,0,W,H);g.fillStyle='rgba(248,248,240,.96)';g.font='bold 56px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('AIRPORT',W/2,34);
   g.beginPath();if(kind==='L'){g.moveTo(150,252);g.lineTo(150,150);g.lineTo(84,150);g.lineTo(84,178);g.lineTo(20,136);g.lineTo(84,94);g.lineTo(84,122);g.lineTo(188,122);g.lineTo(188,252)}
   else if(kind==='R'){g.moveTo(106,252);g.lineTo(106,150);g.lineTo(172,150);g.lineTo(172,178);g.lineTo(236,136);g.lineTo(172,94);g.lineTo(172,122);g.lineTo(68,122);g.lineTo(68,252)}
   else{g.moveTo(100,252);g.lineTo(100,150);g.lineTo(58,150);g.lineTo(128,78);g.lineTo(198,150);g.lineTo(156,150);g.lineTo(156,252)}
   g.closePath();g.fill()});return t},
  put=(tex,x,z,th,w,h)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-8,polygonOffsetUnits:-8}));m.rotation.set(-Math.PI/2,0,th);m.position.set(x,Y+.3,z);m.renderOrder=3;gr.add(m)};
  put(mk('S'),AX-1.75,-26,0,3,12);put(mk('S'),AX-1.75,-80,0,3,12);
  put(mk('L'),AX-22,-1.75,-Math.PI/2,3,12);put(mk('R'),AX+22,1.75,Math.PI/2,3,12)}
 /* show it on the minimap too */
 try{const x=mb.getContext('2d');x.strokeStyle='#d8d8d0';x.lineCap='round';x.lineWidth=2.6;x.beginPath();x.moveTo(mx(AX),mz(Z0));x.lineTo(mx(AX),mz(Z1));x.stroke();x.fillStyle='#3a8a9a';x.fillRect(mx(OFFICE.cx)-OFFICE.w/2*MMS/SIZE,mz(OFFICE.cz)-OFFICE.d/2*MMS/SIZE,OFFICE.w*MMS/SIZE,OFFICE.d*MMS/SIZE)}catch(e){}}
{const cone=new THREE.ConeGeometry(.34,.7,4);cone.rotateX(Math.PI);cone.translate(0,-.35,0);const stem=new THREE.BoxGeometry(.16,.5,.16);stem.translate(0,.25,0);const am=new THREE.MeshBasicMaterial({color:0x6aa8ff,fog:false}),ag=new THREE.Group();ag.add(new THREE.Mesh(cone,am),new THREE.Mesh(stem,am));ag.visible=false;scene.add(ag);
 const u0=updCozy;updCozy=function(dt){u0(dt);const px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z,dist=Math.hypot(MTERM.x-px,MTERM.z-pz),t=performance.now()/1000;ag.visible=!CIN.on&&!GS.inside&&dist<45&&!menuOpen&&MARL.built&&MARL.active;if(ag.visible){ag.position.set(MTERM.x,gH(MTERM.x,MTERM.z)+2.6+Math.sin(t*3.2)*.18,MTERM.z);ag.rotation.y=t*1.2;ag.scale.setScalar(Math.max(.7,Math.min(1.3,dist/14)))}}}
SHOPD.push(MTERM);
const sl0=shopLabel;shopLabel=function(o){return o&&o.apt?(shopOpen(o).open?(o.apt===2?'ENTER AIRPORT TERMINAL':'ENTER AIRPORT OFFICE'):sl0(o)):sl0(o)};
Object.assign(HRS,{'MARLOWE AIRPORT':[0,24]});
{const b0=buildShop;buildShop=function(o){if(!o||!o.apt)return b0(o);
 while(SG.children.length)SG.remove(SG.children[0]);RX=o.rx;RZ=o.rz;SHK=null;const M2=o.apt===2,PX=2.8,B=(x,y,z,w2,h2,d2,hex)=>sbox(x,y,z,w2,h2,d2,fmc(hex)),Hh=IH+.9,MB_=c=>new THREE.MeshBasicMaterial({map:c,side:THREE.DoubleSide});
 SG.add(new THREE.Mesh(new THREE.PlaneGeometry(2*RX,2*RZ).rotateX(-Math.PI/2),imat(FLR.tile())));
 const wc=M2?0x1f4a52:0x2a4466,wm=tx=>{const m=imat(tx);m.color.setHex(wc);return m};
 splane(2*RX,Hh,0,Hh/2,-RZ,0,wm(sWl));splane(2*RX,Hh,0,Hh/2,RZ,Math.PI,wm(sWl));splane(2*RZ,Hh,RX,Hh/2,0,-Math.PI/2,wm(sWl2));splane(2*RZ,Hh,-RX,Hh/2,0,Math.PI/2,wm(sWl2));
 const vd=new THREE.Mesh(new THREE.BoxGeometry(90,70,90),new THREE.MeshBasicMaterial({color:0x0c1420,side:THREE.BackSide,fog:false}));vd.position.y=Hh/2;SG.add(vd);splane(1.1,2.2,0,1.1,RZ-.02,Math.PI,imat(T_FDOOR));
 /* departures / arrivals board + world map */
 const dest=M2?'COZY VILLAGE':'MARLOWE',hd=M2?'ARRIVALS  ·  DEPARTURES':'DEPARTURES';
 splane(5.4,1.9,0,2.0,-RZ+.03,0,MB_(cvx(768,270,(g,W,H)=>{g.fillStyle='#050a14';g.fillRect(0,0,W,H);g.strokeStyle='#6aa8ff';g.lineWidth=5;g.strokeRect(4,4,W-8,H-8);g.fillStyle='#ffd24a';g.font='bold 30px monospace';g.fillText(hd,24,48);g.font='bold 24px monospace';g.fillStyle='#fff';g.fillText('CA101   '+dest+'   GATE 1   ON TIME',24,110);g.fillStyle='#9fe';g.fillText('CA102   '+dest+'   GATE 1   BOARDING',24,160);g.fillStyle='#667';g.fillText('CA201   ...      GATE 2   COMING SOON',24,210)})));
 splane(3.2,1.8,-RX+.03,1.9,-1.5,Math.PI/2,MB_(cvx(300,170,(g,W,H)=>{g.fillStyle='#17304e';g.fillRect(0,0,W,H);g.fillStyle='#3e7a4a';for(const[x,y,r]of[[70,60,30],[140,100,24],[210,60,34],[250,120,14]]){g.beginPath();g.arc(x,y,r,0,6.3);g.fill()}g.strokeStyle='#ffd24a';g.setLineDash([6,5]);g.lineWidth=3;g.beginPath();g.moveTo(80,70);g.quadraticCurveTo(150,10,215,62);g.stroke();g.fillStyle='#fff';g.font='bold 14px monospace';g.fillText('COZY AIRWAYS NETWORK',40,155)})));
 /* check-in desk + clerk */
 B(0,0,-RZ+2.4,5.2,1.0,.8,0x10244a);B(0,1.0,-RZ+2.4,5.3,.07,.9,0xd8c890);B(-1.3,1.07,-RZ+2.4,.6,.4,.05,0x202228);B(1.3,1.07,-RZ+2.4,.6,.4,.05,0x202228);
 const cl=personIn(pSpec(9217,{f:true,hs:2,ts:1,gl:false,scarf:[.1,.2,.5],bp:false,bag:0,old:false,tc:[.1,.2,.45],sk:PSK[1]}),0,-RZ+1.6,0);SG.add(cl);
 /* waiting benches */
 for(const[bx,bz]of[[-RX+1.0,2.6],[-RX+1.0,-4.0],[-6.5,-2.6],[-6.5,2.6]]){const L=bx<-RX+2;B(bx,0,bz,L?1.0:3.0,.45,L?2.6:.9,0x1c3a6a);if(L)B(bx-.45,.45,bz,.3,.5,2.6,0x1c3a6a);else B(bx,.45,bz+(bz>0?.4:-.4),3.0,.5,.2,0x1c3a6a)}
 /* the doorway into the shop (no door) */
 const hw=1.6,sh=Hh-2.4;B(PX,0,-(RZ+hw)/2,.3,Hh,RZ-hw,0x2f5a8a);B(PX,0,(RZ+hw)/2,.3,Hh,RZ-hw,0x2f5a8a);B(PX,2.4,0,.3,sh,2*hw,0x2f5a8a);
 for(const sd of[-1,1])B(PX,0,sd*hw,.4,2.4,.14,0xd8b040);B(PX,2.36,0,.4,.1,2*hw+.14,0xd8b040);
 splane(3.6,.56,PX-.18,Hh-.3,0,-Math.PI/2,MB_(cvx(512,80,(g,W,H)=>{g.fillStyle='#7a1a22';g.fillRect(0,0,W,H);g.strokeStyle='#ffd24a';g.lineWidth=5;g.strokeRect(5,5,W-10,H-10);g.fillStyle='#ffe9a8';g.font='bold 44px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('DUTY FREE SHOP',W/2,H/2+2)})));
 splane(3.6,.56,PX+.18,Hh-.3,0,Math.PI/2,MB_(cvx(512,80,(g,W,H)=>{g.fillStyle='#1c3a6a';g.fillRect(0,0,W,H);g.fillStyle='#fff';g.font='bold 40px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('← TERMINAL',W/2,H/2+2)})));
 /* the little shop */
 {const cp=new THREE.Mesh(new THREE.PlaneGeometry(RX-PX-.2,2*RZ-.1).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x6b2f38}));cp.position.set((PX+RX)/2+.1,.012,0);SG.add(cp);
  const gc={cheese:0xe8c050,ale:0x6a3a1a,honey:0xe09a20,coffee:0x2a1a12,choc:0x5a3220,watch:0xbfc4cc},gk=Object.keys(gc);let q=0;
  const shelf=(x,z,alongZ)=>{const w2=alongZ?.7:1.9,d2=alongZ?1.9:.7;B(x,0,z,w2,2.0,d2,0x5a3a24);for(let lv=0;lv<3;lv++)for(let k=0;k<3;k++){const c=gc[gk[q++%6]],gx=alongZ?x-.42:x-.6+k*.6,gz=alongZ?z-.6+k*.6:z+.42;B(gx,.22+lv*.6,gz,.3,.34,.3,c)}};
  for(const z of[-4.6,-2.4,2.4,4.6])shelf(RX-.5,z,1);for(const x of[PX+2.4,PX+4.6,PX+6.8])shelf(x,-RZ+.5,0);
  B(RX-3.6,0,0,1.0,1.0,8,0x7a1a22);B(RX-3.6,1.0,0,1.15,.07,8.15,0xd8c890);B(RX-3.7,1.07,1.2,.5,.4,.05,0x202228);
  const kp=personIn(pSpec(9305,{f:false,hs:1,ts:2,gl:false,scarf:[.7,.2,.2],bp:false,bag:0,old:false,tc:[.55,.12,.16],sk:PSK[0]}),RX-2.2,0,-Math.PI/2);SG.add(kp);
  splane(7,.7,RX-.04,2.9,0,-Math.PI/2,MB_(cvx(768,80,(g,W,H)=>{g.fillStyle='#14223a';g.fillRect(0,0,W,H);g.fillStyle='#ffd24a';g.font='bold 46px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('DUTY FREE  ·  LOCAL GOODS',W/2,H/2+2)})))}
 IROOM.splice(0,IROOM.length,[-RX-1,RX+1,-RZ-1,-RZ+.9],[-2.8,2.8,-RZ+1.9,-RZ+2.8],[-RX,-RX+1.2,1.2,4],[-RX,-RX+1.2,-5.4,-2.6],[-8,-5,-3.1,-2.1],[-8,-5,2.1,3.1],
  [PX-.2,PX+.2,-RZ-1,-hw],[PX-.2,PX+.2,hw,RZ+1],[RX-4.2,RX-3.0,-4.1,4.1],[RX-4.2,RX-.9,4.1,RZ+1],[RX-4.2,RX-.9,-RZ-1,-4.1],[RX-1.2,RX,-RZ,RZ],[PX+1.2,RX-1.3,-RZ,-RZ+1.6]);
 SHOPCUR={o:o,k:['AGENT',M2?"Welcome to Marlowe. Check in here for the flight home, or browse the shop.":"Welcome to Cozy Airways. Marlowe is only a flight away."]};
 IA.splice(0,IA.length,{r:[-2.6,2.6,-RZ+2.8,-RZ+3.8],label:'BOOK A FLIGHT',fn:()=>open(0)},{r:[RX-6.0,RX-4.3,-2.8,2.8],label:'DUTY FREE & TRADE',fn:()=>open(1)},{r:[-1.0,1.0,RZ-.3,RZ],label:'LEAVE',fn:()=>leaveShop()});
 try{addVisitors(o)}catch(e){}}}
window.AIRFIELDS={HOME,MARL,open,close,begin,OFFICE,GOODS,ROUTES};
})();
