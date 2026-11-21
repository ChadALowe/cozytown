/* Audi A6 saloon (C8), car 6: built from plain coloured triangles. No textures at all.
   Real size: 4.939 m long, 1.886 m wide, 1.457 m tall, 2.924 m wheelbase, 255/40 R20 wheels.
   The body is a loft of cross-sections; glass, lights, grille, plates and trim are flat
   polygons projected onto it. Shading is baked into vertex colours, so the body is just
   2 draw calls (paint + trim), opaque, and a respray is one material colour change. */
(function(){
if(!window.NC||!window.THREE)return;
const ID=6,R_=.356,TW=.1275,WB=2.924,ZF=1.52,ZB=ZF-WB,RA=.395,NZ=2.4695,W0=.943;
const STOCK=[.70,.72,.75];

/* ---------- side-view keyframes (z = metres forward of centre) ---------- */
const pl=k=>z=>{if(z>=k[0][0])return k[0][1];for(let i=1;i<k.length;i++)if(z>=k[i][0]){const a=k[i-1],b=k[i],t=(z-b[0])/(a[0]-b[0]);return b[1]+(a[1]-b[1])*t}return k[k.length-1][1]};
const wAt=pl([[2.47,.80],[2.445,.85],[2.38,.89],[2.2,.922],[1.9,.938],[1.5,W0],[-1.4,W0],[-1.9,.938],[-2.2,.922],[-2.36,.897],[-2.44,.865],[-2.47,.835]]);
const ybAt=pl([[2.47,.25],[2.40,.19],[2.25,.165],[1.9,.16],[-1.9,.16],[-2.2,.19],[-2.40,.26],[-2.47,.32]]);
const beltAt=pl([[2.47,.70],[2.445,.745],[2.38,.775],[2.2,.81],[1.8,.85],[1.2,.895],[.95,.925],[.3,.952],[-.5,.972],[-1.2,.988],[-1.7,1.0],[-2.1,1.01],[-2.33,1.012],[-2.43,.99],[-2.47,.955]]);
const roofAt=pl([[1.0,.90],[.96,.935],[.80,1.06],[.55,1.22],[.30,1.345],[.10,1.415],[-.15,1.45],[-.40,1.457],[-.70,1.44],[-.92,1.405],[-1.12,1.33],[-1.38,1.19],[-1.58,1.07],[-1.71,.99]]);
const ghAt=z=>Math.max(0,roofAt(z)-beltAt(z));
const ss=t=>t<=0?0:t>=1?1:t*t*(3-2*t);

/* half cross-section, bottom centre -> top centre (x>=0). 11 points, 10 bands */
function prof(z,yb){const w=wAt(z),b=beltAt(z),gh=ghAt(z),t=ss(gh/.42);
 const x8=(w-.07)+(.655-(w-.07))*t,y8=b+.012+.88*gh,x9=x8-.07,y9=b+.012+.97*gh+.03*(1-t),y10=b+gh+.048*(1-t);
 const P=[[0,yb],[w-.10,yb],[w-.025,yb+.06],[w,Math.max(yb+.08,.43)],[w,b-.15],[w-.012,b-.11],[w-.035,b],[w-.065,b+.012],[x8,y8],[x9,y9],[0,y10]];
 for(let i=2;i<P.length;i++)if(P[i][1]<P[i-1][1]+.002)P[i][1]=P[i-1][1]+.002;
 return{P,gh}}

/* stations: an even spread, extra at the rounded ends, and a semicircle cut out over each axle */
const ST=[];{let o=0;const base=[];for(let i=0;i<=64;i++)base.push(NZ-i*2*NZ/64);for(const e of[2.457,2.445,2.43,2.41,2.39])base.push(e,-e);
 for(const z of base)if(Math.abs(z-ZF)>RA+.01&&Math.abs(z-ZB)>RA+.01)ST.push([z,ybAt(z),0]);
 for(const za of[ZF,ZB]){ST.push([za+RA,ybAt(za+RA),++o]);for(let k=0;k<=12;k++){const a=k/12*Math.PI;ST.push([za+RA*Math.cos(a),R_+RA*Math.sin(a),++o])}ST.push([za-RA,ybAt(za-RA),++o])}
 ST.sort((a,b)=>b[0]-a[0]||a[2]-b[2])}
const RING=ST.map(s=>Object.assign(prof(s[0],s[1]),{z:s[0]}));

/* ---------- triangle soup builders ---------- */
const LD=(()=>{const v=[-.35,.78,.52],l=Math.hypot(...v);return v.map(x=>x/l)})();
const shade=n=>Math.min(1.1,Math.max(.32,.60+.34*Math.max(0,n[0]*LD[0]+n[1]*LD[1]+n[2]*LD[2])+.14*n[1]));
const hx=h=>[(h>>16&255)/255,(h>>8&255)/255,(h&255)/255];
const GLASS=0x18222c,WSC=0x223140,TRIM=0x17181b,CHR=0xaab0b7,UNDER=0x0d0e10;
const isGlass=h=>h===GLASS||h===WSC;
const PB={p:[],c:[]},FB={p:[],c:[]},HULL=[];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],crs=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const nrm=v=>{const l=Math.hypot(v[0],v[1],v[2]);return l<1e-12?null:[v[0]/l,v[1]/l,v[2]/l]};
/* emit one triangle. hex=null -> paint buffer. ref (optional) = a direction the face should point along */
function tri(a,b,c,hex,ref,hull){let n=nrm(crs(sub(b,a),sub(c,a)));if(!n)return;
 if(ref&&n[0]*ref[0]+n[1]*ref[1]+n[2]*ref[2]<0){const t=b;b=c;c=t;n=[-n[0],-n[1],-n[2]]}
 let s=shade(n),col;if(hex==null)col=[s,s,s];else{const k=hx(hex);if(isGlass(hex)){const r=.72+.45*Math.max(0,n[1]);col=[k[0]*r+.05,k[1]*r+.06,k[2]*r+.07]}else col=[k[0]*s,k[1]*s,k[2]*s]}
 const B=hex==null?PB:FB;B.p.push(...a,...b,...c);for(let i=0;i<3;i++)B.c.push(...col);
 if(hull)HULL.push([a,b,c,n])}

/* what each band of the hull is made of, between two stations */
function cls(b,z0,z1,g0,g1){const zm=(z0+z1)/2,g=Math.min(g0,g1);
 if(b===0)return UNDER;
 if(b===6)return g>.06?CHR:null;
 if(b===7){if(g<.05||zm>.93||zm<-1.30)return null;if((zm<-.03&&zm>-.13)||(zm<-1.095&&zm>-1.135))return TRIM;return GLASS}
 if(b===9){if(g<.015)return null;if((zm<.97&&zm>.10)||(zm<-.92&&zm>-1.71))return WSC;return null}
 return null}

/* hull: loft both halves */
for(let i=0;i<RING.length-1;i++){const A=RING[i],Bq=RING[i+1];
 for(let b=0;b<10;b++){const hex=cls(b,A.z,Bq.z,A.gh,Bq.gh);
  for(const s of[1,-1]){const v=(r,k)=>[s*r.P[k][0],r.P[k][1],r.z];
   const a=v(A,b),bb=v(A,b+1),c=v(Bq,b+1),d=v(Bq,b);
   if(s>0){tri(a,d,c,hex,null,1);tri(a,c,bb,hex,null,1)}else{tri(a,c,d,hex,null,1);tri(a,bb,c,hex,null,1)}}}}
/* nose and tail caps */
for(const[ri,dz]of[[0,1],[RING.length-1,-1]]){const r=RING[ri],L=[];for(const p of r.P)L.push([p[0],p[1],r.z]);for(let k=r.P.length-2;k>=1;k--)L.push([-r.P[k][0],r.P[k][1],r.z]);
 let cx=0,cy=0;for(const p of L){cx+=p[0];cy+=p[1]}const C=[cx/L.length,cy/L.length,r.z];
 for(let k=0;k<L.length;k++)tri(C,L[k],L[(k+1)%L.length],null,[0,0,dz],1)}

/* ---------- projecting flat shapes onto the hull ---------- */
const GS_=.08,GRID={x:new Map(),z:new Map()};
const uvOf=(ax,p)=>ax==='z'?[p[0],p[1]]:[p[2],p[1]];
HULL.forEach((t,i)=>{for(const ax of['x','z']){const q=t.slice(0,3).map(p=>uvOf(ax,p));
 const u0=Math.floor(Math.min(q[0][0],q[1][0],q[2][0])/GS_),u1=Math.floor(Math.max(q[0][0],q[1][0],q[2][0])/GS_),v0=Math.floor(Math.min(q[0][1],q[1][1],q[2][1])/GS_),v1=Math.floor(Math.max(q[0][1],q[1][1],q[2][1])/GS_);
 for(let u=u0;u<=u1;u++)for(let v=v0;v<=v1;v++){const k=u+','+v,m=GRID[ax];if(!m.has(k))m.set(k,[]);m.get(k).push(i)}}});
/* axis 'z': look along z at (u=x,v=y); sg=+1 takes the front-most surface. axis 'x': (u=z,v=y), sg=+1 the +x side */
function hit(ax,sg,u,v){const L=GRID[ax].get(Math.floor(u/GS_)+','+Math.floor(v/GS_));if(!L)return null;let best=null,bd=-1e9;
 for(const i of L){const t=HULL[i],q=t.slice(0,3).map(p=>uvOf(ax,p));
  const d=(q[1][1]-q[2][1])*(q[0][0]-q[2][0])+(q[2][0]-q[1][0])*(q[0][1]-q[2][1]);if(Math.abs(d)<1e-12)continue;
  const l0=((q[1][1]-q[2][1])*(u-q[2][0])+(q[2][0]-q[1][0])*(v-q[2][1]))/d,l1=((q[2][1]-q[0][1])*(u-q[2][0])+(q[0][0]-q[2][0])*(v-q[2][1]))/d,l2=1-l0-l1;
  if(l0<-1e-6||l1<-1e-6||l2<-1e-6)continue;
  const ci=ax==='z'?2:0,w=t[0][ci]*l0+t[1][ci]*l1+t[2][ci]*l2;if(w*sg>bd){bd=w*sg;best=[w,t[3]]}}
 if(!best)return null;const p=ax==='z'?[u,v,best[0]]:[best[0],v,u];return{p,n:best[1]}}
/* poly: convex [[u,v]..]. layer lifts it further off the paint so stacked shapes never flicker */
function decal(ax,sg,poly,hex,layer){const us=poly.map(q=>q[0]),vs=poly.map(q=>q[1]),ext=Math.max(Math.max(...us)-Math.min(...us),Math.max(...vs)-Math.min(...vs));
 const off=.0035+(layer||0)*.003,N=ext>.6?4:ext>.25?3:ext>.09?2:1;let cu=0,cv=0;for(const q of poly){cu+=q[0];cv+=q[1]}cu/=poly.length;cv/=poly.length;
 const ref=ax==='z'?[0,0,sg]:[sg,0,0];
 for(let e=0;e<poly.length;e++){const A=[cu,cv],B=poly[e],C=poly[(e+1)%poly.length],pt={};
  const P=(i,j)=>{const k=i+','+j;if(k in pt)return pt[k];const a=i/N,b=j/N,u=A[0]+(B[0]-A[0])*a+(C[0]-A[0])*b,v=A[1]+(B[1]-A[1])*a+(C[1]-A[1])*b,h=hit(ax,sg,u,v);
   return pt[k]=h?[h.p[0]+h.n[0]*off,h.p[1]+h.n[1]*off,h.p[2]+h.n[2]*off,h.n]:null};
  for(let i=0;i<N;i++)for(let j=0;j<N-i;j++){const t1=[P(i,j),P(i+1,j),P(i,j+1)];if(t1.every(Boolean)){const r=nrm(t1.reduce((s,x)=>[s[0]+x[3][0],s[1]+x[3][1],s[2]+x[3][2]],[0,0,0]))||ref;tri(t1[0].slice(0,3),t1[1].slice(0,3),t1[2].slice(0,3),hex,r)}
   if(i+j<N-1){const t2=[P(i+1,j),P(i+1,j+1),P(i,j+1)];if(t2.every(Boolean)){const r=nrm(t2.reduce((s,x)=>[s[0]+x[3][0],s[1]+x[3][1],s[2]+x[3][2]],[0,0,0]))||ref;tri(t2[0].slice(0,3),t2[1].slice(0,3),t2[2].slice(0,3),hex,r)}}}}}
const mX=poly=>poly.map(q=>[-q[0],q[1]]).reverse();
const rect=(u0,v0,u1,v1)=>[[u0,v0],[u1,v0],[u1,v1],[u0,v1]];
const both=(ax,sg,poly,hex,layer)=>{decal(ax,sg,poly,hex,layer);decal(ax,sg,mX(poly),hex,layer)};
const sides=(poly,hex,layer)=>{decal('x',1,poly,hex,layer);decal('x',-1,poly,hex,layer)};
const plate=(ax,sg,y0,y1,bg)=>{decal(ax,sg,rect(-.26,y0,.26,y1),bg,4);decal(ax,sg,rect(-.258,y0+.004,-.236,y1-.004),0x1d3fa0,5);
 const cw=.034,gap=.012;let x=-.215;for(let k=0;k<7;k++){if(k===4)x+=.03;decal(ax,sg,rect(x,y0+.022,x+cw,y1-.022),0x18181a,5);x+=cw+gap}};

/* ---- front ---- */
decal('z',1,rect(-.80,.19,.80,.255),0x1a1b1e,0);                                   // lower lip
const SF=[[-.40,.69],[.40,.69],[.47,.62],[.45,.33],[.36,.235],[-.36,.235],[-.45,.33],[-.47,.62]];
decal('z',1,SF,0x55585e,1);                                                          // Singleframe surround
decal('z',1,SF.map(q=>[q[0]*.95,.235+(q[1]-.235)*.95+.012]),0x0f1012,2);            // grille
for(let y=.30;y<.66;y+=.055)decal('z',1,rect(-.40,y,.40,y+.013),0x34373c,3);         // horizontal slats
plate('z',1,.36,.47,0xeeeeea);
both('z',1,[[.47,.645],[.53,.608],[.80,.62],[.865,.66],[.845,.712],[.49,.703]],0x262b31,1); // headlight housing
both('z',1,[[.50,.655],[.55,.63],[.79,.64],[.835,.67],[.82,.70],[.51,.695]],0x8f9ba6,2);     // lens
both('z',1,[[.535,.616],[.79,.628],[.795,.642],[.54,.630]],0xf6f9ff,3);                       // DRL strip
for(let k=0;k<5;k++){const x=.58+k*.045;both('z',1,rect(x,.645,x+.02,.668),0xe8eef6,3)}       // DRL segments
both('z',1,[[.52,.265],[.74,.265],[.80,.325],[.78,.455],[.56,.44],[.49,.36]],0x131416,1);   // side intakes
both('z',1,rect(.53,.352,.78,.366),0x5c6066,2);                                               // intake blade
/* ---- rear ---- */
both('z',-1,[[.40,.885],[.86,.90],[.905,.955],[.865,.985],[.42,.978],[.38,.93]],0x6d0a10,1); // tail light
both('z',-1,[[.43,.905],[.84,.915],[.875,.952],[.845,.968],[.44,.962],[.41,.932]],0xc31a26,2);
both('z',-1,rect(.46,.935,.84,.945),0xff5560,3);                                              // light bar
decal('z',-1,rect(-.40,.916,.40,.93),0xb2b7bd,1);                                            // chrome strip
plate('z',-1,.70,.81,0xf0c418);
decal('z',-1,[[-.84,.335],[.84,.335],[.86,.43],[-.86,.43]],0x16171a,1);                     // diffuser
both('z',-1,[[.50,.35],[.78,.35],[.80,.41],[.48,.41]],0xbfc4c9,2);                           // trapezoid tailpipe trims
both('z',-1,[[.52,.358],[.765,.358],[.783,.402],[.50,.402]],0x0b0b0c,3);
both('z',-1,rect(.80,.48,.88,.505),0x7a1016,1);                                               // reflectors
/* ---- sides ---- */
sides(rect(-1.0,.165,1.115,.26),0x26272b,1);                                                  // sill
for(const z of[.95,-.075])sides(rect(z-.0035,.27,z+.0035,beltAt(z)-.005),0x1b1c1f,1);        // door shut lines
sides([[-1.135,.66],[-1.128,.66],[-1.128,.98],[-1.135,.98]],0x1b1c1f,1);
sides(rect(.05,.862,.22,.884),0x55595f,1);sides(rect(-.98,.875,-.81,.897),0x55595f,1);        // door handles
sides(rect(2.29,.635,2.445,.708),0x262b31,1);sides(rect(2.30,.62,2.44,.632),0xf2f6ff,2);     // headlight wrap
sides(rect(-2.445,.89,-2.25,.975),0x6d0a10,1);sides(rect(-2.43,.905,-2.27,.96),0xc31a26,2);  // tail light wrap
sides(rect(2.0,.47,2.07,.49),0xd88a20,1);                                                     // side marker

/* arch liners, so you can't see through the body over the wheels */
for(const za of[ZF,ZB])for(const s of[1,-1]){const x=s*.62,L=[];for(let k=0;k<=12;k++){const a=k/12*Math.PI;L.push([x,R_+RA*Math.sin(a),za+RA*Math.cos(a)])}L.push([x,.16,za-RA],[x,.16,za+RA]);
 let cy=0,cz=0;for(const p of L){cy+=p[1];cz+=p[2]}const C=[x,cy/L.length,cz/L.length];
 for(let k=0;k<L.length;k++){tri(C,L[k],L[(k+1)%L.length],0x101113,[s,0,0]);tri(C,L[k],L[(k+1)%L.length],0x101113,[-s,0,0])}}

/* boxes (mirrors) */
function box(c,sz,ry,hex,faces){const[hx2,hy,hz]=sz.map(v=>v/2),cs=Math.cos(ry),sn=Math.sin(ry);
 const P=(x,y,z)=>[c[0]+x*cs+z*sn,c[1]+y,c[2]-x*sn+z*cs];
 const F=[[[1,0,0],[[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]]],[[-1,0,0],[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]]],[[0,1,0],[[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1]]],[[0,-1,0],[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]],[[0,0,1],[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]],[[0,0,-1],[[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1]]]];
 F.forEach(([n,q],fi)=>{const h=faces&&faces[fi]!==undefined?faces[fi]:hex,v=q.map(k=>P(k[0]*hx2,k[1]*hy,k[2]*hz)),r=[n[0]*cs+n[2]*sn,n[1],-n[0]*sn+n[2]*cs];tri(v[0],v[1],v[2],h,r);tri(v[0],v[2],v[3],h,r)})}
for(const s of[1,-1]){box([s*.985,1.005,.79],[.15,.095,.075],-s*.12,null,{5:0x2c333a});            // housing, glass at the back
 box([s*.915,.975,.80],[.06,.05,.05],-s*.12,TRIM)}

/* ---------- three.js objects ---------- */
const geo=B=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(B.p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(B.c,3));g.computeBoundingSphere();return g};
const PG=geo(PB),FG=geo(FB);
/* wheel face: 5 twin spokes, lip and hub */
function rimGeo(sx){const B={p:[],c:[]},x=sx*(TW+.004),ref=[sx,0,0],P=(r,a)=>[x,r*Math.sin(a),r*Math.cos(a)],silver=0xb8bdc3;
 const push=(a,b,c,h)=>{let n=nrm(crs(sub(b,a),sub(c,a)));if(!n)return;if(n[0]*sx<0){const t=b;b=c;c=t}const k=hx(h);B.p.push(...a,...b,...c);for(let i=0;i<3;i++)B.c.push(...k)};
 const seg=40;for(let i=0;i<seg;i++){const a0=i/seg*6.2832,a1=(i+1)/seg*6.2832;push(P(.236,a0),P(.254,a0),P(.254,a1),silver);push(P(.236,a0),P(.254,a1),P(.236,a1),silver);push([x,0,0],P(.068,a0),P(.068,a1),0xa3a8ae)}
 for(let k=0;k<5;k++)for(const d of[-.11,.11]){const a=k*1.2566+d,e=(r,w)=>{const c=P(r,a);return[x,c[1]+Math.cos(a)*w,c[2]-Math.sin(a)*w]};
  push(e(.06,.018),e(.24,.012),e(.24,-.012),silver);push(e(.06,.018),e(.24,-.012),e(.06,-.018),silver)}
 for(let i=0;i<16;i++){const a0=i/16*6.2832,a1=(i+1)/16*6.2832,xi=x+sx*.002,Q=(r,a)=>[xi,r*Math.sin(a),r*Math.cos(a)];const k=hx(0x1e1f22);let a=[xi,0,0],b=Q(.032,a0),c=Q(.032,a1),n=nrm(crs(sub(b,a),sub(c,a)));if(n[0]*sx<0){const t=b;b=c;c=t}B.p.push(...a,...b,...c);for(let j=0;j<3;j++)B.c.push(...k)}
 return geo(B)}
const RG={1:rimGeo(1),'-1':rimGeo(-1)};
const tyreG=new THREE.CylinderGeometry(R_*.985,R_*.985,TW*2,24).rotateZ(Math.PI/2);
const discG=s=>{const g=new THREE.CircleGeometry(.252,24);g.rotateY(s>0?Math.PI/2:-Math.PI/2);g.translate(s*(TW+.001),0,0);return g};
const DG={1:discG(1),'-1':discG(-1)};

function makeCar(pm,fm,tm,dm,rm,live){const g=new THREE.Group(),wl=[];
 const b1=new THREE.Mesh(PG,pm),b2=new THREE.Mesh(FG,fm);g.add(b1,b2);
 for(const sx of[1,-1])for(const[k,z]of[[0,ZF],[1,ZB]]){const piv=new THREE.Group(),spin=new THREE.Group();piv.position.set(sx*(W0-.125),R_,z);
  spin.add(new THREE.Mesh(tyreG,tm),new THREE.Mesh(DG[sx],dm),new THREE.Mesh(RG[sx],rm));piv.add(spin);g.add(piv);wl.push({piv,spin,front:k===0})}
 return{g,wl}}
const mat=c=>new THREE.MeshBasicMaterial({vertexColors:true,color:c||0xffffff});
const pM=mat(),fM=mat(),rM=mat(),tyreM=new THREE.MeshBasicMaterial({color:0x151518}),dM=new THREE.MeshBasicMaterial({color:0x2a2c30});
const live=makeCar(pM,fM,tyreM,dM,rM,1),grp=live.g;grp.visible=false;car.add(grp);
const S={id:ID,grp,ready:1,load(){},pc:STOCK};
S.paint=function(){const w=paintC[0]>.97&&paintC[1]>.97&&paintC[2]>.97;S.pc=w?STOCK:paintC.slice();S.upd(1)};
S.upd=function(still){const l=U.uLight.value,c=S.pc;pM.color.setRGB(c[0]*l.x,c[1]*l.y,c[2]*l.z);fM.color.setRGB(l.x,l.y,l.z);rM.color.setRGB(l.x,l.y,l.z);
 tyreM.color.setRGB(.085*l.x,.085*l.y,.09*l.z);dM.color.setRGB(.17*l.x,.17*l.y,.19*l.z);if(still)return;
 for(const w of live.wl){w.spin.rotation.x=GS_SPIN*.275/R_;if(w.front)w.piv.rotation.y=GS.steer*.5}};
/* a static copy in stock paint, for the showroom pods */
S.inst=function(){const m=makeCar(mat(new THREE.Color(...STOCK)),mat(),new THREE.MeshBasicMaterial({color:0x151518}),new THREE.MeshBasicMaterial({color:0x2a2c30}),mat());return m.g};
S.stats={tris:(PB.p.length+FB.p.length)/9};
NC.cars[ID]=S;
LPOS[ID]={f:[.66,.665,2.47],b:[.66,.935,-2.475]};
})();
