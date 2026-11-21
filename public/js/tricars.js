/* Triangle cars: vehicles built only from plain coloured triangles (no textures).
   Each car is a short spec: real dimensions, a side profile and a few shapes (grille, lights,
   plates). The builder lofts a body from cross-sections, projects the flat shapes onto it and
   bakes the shading into vertex colours, so a car is 2 opaque body meshes (paint + trim) and
   a respray is one material colour. The same geometry serves the player car, the showroom,
   village/town traffic and (instanced) the city traffic.
   Cars 6.. are registered here: Audi A6 first, then the fleet. */
(function(){
if(!window.NC||!window.THREE)return;

/* ================================================================ helpers */
const pl=k=>z=>{if(z>=k[0][0])return k[0][1];for(let i=1;i<k.length;i++)if(z>=k[i][0]){const a=k[i-1],b=k[i],t=(z-b[0])/(a[0]-b[0]);return b[1]+(a[1]-b[1])*t}return k[k.length-1][1]};
const ss=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
const hx=h=>[(h>>16&255)/255,(h>>8&255)/255,(h&255)/255];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],crs=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const nrm=v=>{const l=Math.hypot(v[0],v[1],v[2]);return l<1e-12?null:[v[0]/l,v[1]/l,v[2]/l]};
const LD=(()=>{const v=[-.35,.78,.52],l=Math.hypot(...v);return v.map(x=>x/l)})();
const shade=n=>Math.min(1.1,Math.max(.32,.60+.34*Math.max(0,n[0]*LD[0]+n[1]*LD[1]+n[2]*LD[2])+.14*n[1]));
const GLASS=0x18222c,WSC=0x223140,TRIM=0x17181b,CHR=0xaab0b7,UNDER=0x0d0e10;
const isGlass=h=>h===GLASS||h===WSC;
const rect=(u0,v0,u1,v1)=>[[u0,v0],[u1,v0],[u1,v1],[u0,v1]];
const mX=poly=>poly.map(q=>[-q[0],q[1]]).reverse();
const circ=(cx,cy,rx,ry,n)=>{const o=[];n=n||14;for(let i=0;i<n;i++){const a=i/n*6.2832;o.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)])}return o};
const shrink=(poly,k,dy)=>{let cx=0,cy=0;for(const q of poly){cx+=q[0];cy+=q[1]}cx/=poly.length;cy/=poly.length;return poly.map(q=>[cx+(q[0]-cx)*k,cy+(q[1]-cy)*k+(dy||0)])};

/* ================================================================ builder */
function build(S){
 const NZ=S.NZ,W0=S.W0,R_=S.R,ZF=S.ZF,ZB=S.ZB,RA=S.RA,TW=S.TW;
 const wAt=pl(S.wK),ybAt=pl(S.ybK),beltAt=pl(S.beltK),roofAt=pl(S.roofK);
 const ghAt=z=>Math.max(0,roofAt(z)-beltAt(z));
 const roofW=S.roofW,aw=S.aw,crown=S.crown,p3y=S.p3y,ns=NZ-.1695;

 /* half cross-section, bottom centre -> top centre (x>=0). 11 points, 10 bands.
    cabin shape: glass sill, window, pillar/rail, roof.  panel shape: rolled edge, crowned bonnet/boot */
 function prof(z,yb){const w=wAt(z),b=beltAt(z),gh=ghAt(z),t=ss(gh/.42);
  const u=ss(gh/.10),L=(a,c)=>a+(c-a)*u,cr=1-t,c8=(w-.07)+(roofW-(w-.07))*t;
  const x7=L(w-.075,w-.065),y7=b+L(.022,.012),x8=L(w-.17,c8),y8=L(b+.042*crown/.066,b+.012+.88*gh),x9=L(w*.52,c8-aw),y9=L(b+.060*crown/.066,b+.012+.97*gh+.03*cr),
   y10=b+gh+crown*cr*(z>ns?1-.45*Math.min(1,(z-ns)/.17):1);
  const P=[[0,yb],[w-.10,yb],[w-.025,yb+.06],[w,Math.max(yb+.08,p3y)],[w,b-.15],[w-.012,b-.11],[w-.032-.012*cr,b-.012*cr],[x7,y7],[x8,y8],[x9,y9],[0,y10]];
  for(let i=2;i<P.length;i++)if(P[i][1]<P[i-1][1]+.002)P[i][1]=P[i-1][1]+.002;
  return{P,gh}}

 /* stations: an even spread, extra at the rounded ends, and a semicircle cut out over each axle */
 const ST=[];{let o=0;const base=[];for(let i=0;i<=64;i++)base.push(NZ-i*2*NZ/64);
  for(const e of[.0125,.0245,.0395,.0595,.0795])base.push(NZ-e,-(NZ-e));for(const e of[.1095,.1495,.1895,.2295,.2695])base.push(NZ-e);
  if(S.rearExtra)for(const e of[.1095,.1495,.1895,.2295,.2695])base.push(-(NZ-e));
  for(const z of base)if(Math.abs(z-ZF)>RA+.01&&Math.abs(z-ZB)>RA+.01)ST.push([z,ybAt(z),0]);
  for(const za of[ZF,ZB]){ST.push([za+RA,ybAt(za+RA),++o]);for(let k=0;k<=12;k++){const a=k/12*Math.PI;ST.push([za+RA*Math.cos(a),R_+RA*Math.sin(a),++o])}ST.push([za-RA,ybAt(za-RA),++o])}
  ST.sort((a,b)=>b[0]-a[0]||a[2]-b[2])}
 const RING=ST.map(s=>Object.assign(prof(s[0],s[1]),{z:s[0]}));

 const PB={p:[],c:[]},FB={p:[],c:[]},HULL=[];
 function tri(a,b,c,hex,ref,hull){let n=nrm(crs(sub(b,a),sub(c,a)));if(!n)return;
  if(ref&&n[0]*ref[0]+n[1]*ref[1]+n[2]*ref[2]<0){const t=b;b=c;c=t;n=[-n[0],-n[1],-n[2]]}
  let s=shade(n),col;if(hex==null)col=[s,s,s];else{const k=hx(hex);if(isGlass(hex)){const r=.72+.45*Math.max(0,n[1]);col=[k[0]*r+.05,k[1]*r+.06,k[2]*r+.07]}else col=[k[0]*s,k[1]*s,k[2]*s]}
  const B=hex==null?PB:FB;B.p.push(...a,...b,...c);for(let i=0;i<3;i++)B.c.push(...col);
  if(hull)HULL.push([a,b,c,n])}

 /* what each band of the hull is made of, between two stations */
 const G=S.glass,inR=(z,r)=>r&&z>r[0]&&z<r[1];
 function cls(b,z0,z1,g0,g1){const zm=(z0+z1)/2,g=Math.min(g0,g1);
  if(b===0)return UNDER;
  if(b===6)return g>.06?(G.sill===undefined?CHR:G.sill):null;
  if(b===7){if(g<.05)return null;if(!inR(zm,G.side))return G.pillars&&g>.12?TRIM:null;for(const q of G.posts||[])if(inR(zm,q))return TRIM;return GLASS}
  if(b===8){if(g<.05)return null;if(G.pillars&&g>.12)return TRIM;if(G.roofCol!=null&&g>.15&&!inR(zm,G.ws)&&!inR(zm,G.rs))return G.roofCol;return null}
  if(b===9){if(g<.015)return null;if(inR(zm,G.ws)||inR(zm,G.rs))return WSC;if(G.roofCol!=null&&g>.15)return G.roofCol;return null}
  return null}

 /* nose and tail shaping: corners pulled back (rounded in plan), upper front/back leaned in */
 const BF=S.bendF,BR=S.bendR;
 const bend=(x,y,z)=>{const ax=Math.min(1,Math.abs(x)/W0);
  if(BF&&z>BF.from){const k=Math.pow(Math.min(1,(z-BF.from)/(NZ-BF.from)),1.6);return z-k*(BF.pull*ax*ax+BF.rake*Math.min(1,Math.max(0,(y-BF.y0)/(BF.y1-BF.y0))))}
  if(BR&&z<BR.from){const k=Math.pow(Math.min(1,(BR.from-z)/(NZ+BR.from)),1.6);return z+k*(BR.pull*ax*ax+BR.rake*Math.min(1,Math.max(0,(y-BR.y0)/(BR.y1-BR.y0))))}
  return z};

 /* hull: loft both halves */
 for(let i=0;i<RING.length-1;i++){const A=RING[i],Bq=RING[i+1];
  for(let b=0;b<10;b++){const hex=cls(b,A.z,Bq.z,A.gh,Bq.gh);
   for(const s of[1,-1]){const v=(r,k)=>[s*r.P[k][0],r.P[k][1],bend(r.P[k][0],r.P[k][1],r.z)];
    const a=v(A,b),bb=v(A,b+1),c=v(Bq,b+1),d=v(Bq,b);
    if(s>0){tri(a,d,c,hex,null,1);tri(a,c,bb,hex,null,1)}else{tri(a,c,d,hex,null,1);tri(a,bb,c,hex,null,1)}}}}
 for(const[ri,dz]of[[0,1],[RING.length-1,-1]]){const r=RING[ri],L=[];for(const p of r.P)L.push([p[0],p[1],bend(p[0],p[1],r.z)]);for(let k=r.P.length-2;k>=1;k--)L.push([-r.P[k][0],r.P[k][1],bend(r.P[k][0],r.P[k][1],r.z)]);
  let cx=0,cy=0,cz=0;for(const p of L){cx+=p[0];cy+=p[1];cz+=p[2]}const C=[cx/L.length,cy/L.length,cz/L.length];
  for(let k=0;k<L.length;k++)tri(C,L[k],L[(k+1)%L.length],S.capCol==null?null:S.capCol,[0,0,dz],1)}

 /* ---- projecting flat shapes onto the hull ---- */
 const GS_=.08,GRID={x:new Map(),z:new Map()};
 const uvOf=(ax,p)=>ax==='z'?[p[0],p[1]]:[p[2],p[1]];
 HULL.forEach((t,i)=>{for(const ax of['x','z']){const q=t.slice(0,3).map(p=>uvOf(ax,p));
  const u0=Math.floor(Math.min(q[0][0],q[1][0],q[2][0])/GS_),u1=Math.floor(Math.max(q[0][0],q[1][0],q[2][0])/GS_),v0=Math.floor(Math.min(q[0][1],q[1][1],q[2][1])/GS_),v1=Math.floor(Math.max(q[0][1],q[1][1],q[2][1])/GS_);
  for(let u=u0;u<=u1;u++)for(let v=v0;v<=v1;v++){const k=u+','+v,m=GRID[ax];if(!m.has(k))m.set(k,[]);m.get(k).push(i)}}});
 function hit(ax,sg,u,v){const L=GRID[ax].get(Math.floor(u/GS_)+','+Math.floor(v/GS_));if(!L)return null;let best=null,bd=-1e9;
  for(const i of L){const t=HULL[i],q=t.slice(0,3).map(p=>uvOf(ax,p));
   const d=(q[1][1]-q[2][1])*(q[0][0]-q[2][0])+(q[2][0]-q[1][0])*(q[0][1]-q[2][1]);if(Math.abs(d)<1e-12)continue;
   const l0=((q[1][1]-q[2][1])*(u-q[2][0])+(q[2][0]-q[1][0])*(v-q[2][1]))/d,l1=((q[2][1]-q[0][1])*(u-q[2][0])+(q[0][0]-q[2][0])*(v-q[2][1]))/d,l2=1-l0-l1;
   if(l0<-1e-6||l1<-1e-6||l2<-1e-6)continue;
   const ci=ax==='z'?2:0,w=t[0][ci]*l0+t[1][ci]*l1+t[2][ci]*l2;if(w*sg>bd){bd=w*sg;best=[w,t[3]]}}
  if(!best)return null;const p=ax==='z'?[u,v,best[0]]:[best[0],v,u];return{p,n:best[1]}}
 function decal(ax,sg,poly,hex,layer){const us=poly.map(q=>q[0]),vs=poly.map(q=>q[1]),ext=Math.max(Math.max(...us)-Math.min(...us),Math.max(...vs)-Math.min(...vs));
  const off=.0035+(layer||0)*.003,N=ext>.6?4:ext>.25?3:ext>.09?2:1;let cu=0,cv=0;for(const q of poly){cu+=q[0];cv+=q[1]}cu/=poly.length;cv/=poly.length;
  const ref=ax==='z'?[0,0,sg]:[sg,0,0];
  for(let e=0;e<poly.length;e++){const A=[cu,cv],B=poly[e],C=poly[(e+1)%poly.length],pt={};
   const P=(i,j)=>{const k=i+','+j;if(k in pt)return pt[k];const a=i/N,b=j/N,u=A[0]+(B[0]-A[0])*a+(C[0]-A[0])*b,v=A[1]+(B[1]-A[1])*a+(C[1]-A[1])*b,h=hit(ax,sg,u,v);
    return pt[k]=h?[h.p[0]+h.n[0]*off,h.p[1]+h.n[1]*off,h.p[2]+h.n[2]*off,h.n]:null};
   const emit=t=>{if(!t.every(Boolean))return;const r=nrm(t.reduce((s,x)=>[s[0]+x[3][0],s[1]+x[3][1],s[2]+x[3][2]],[0,0,0]))||ref;tri(t[0].slice(0,3),t[1].slice(0,3),t[2].slice(0,3),hex,r)};
   for(let i=0;i<N;i++)for(let j=0;j<N-i;j++){emit([P(i,j),P(i+1,j),P(i,j+1)]);if(i+j<N-1)emit([P(i+1,j),P(i+1,j+1),P(i,j+1)])}}}
 const both=(ax,sg,poly,hex,layer)=>{decal(ax,sg,poly,hex,layer);decal(ax,sg,mX(poly),hex,layer)};
 const sides=(poly,hex,layer)=>{decal('x',1,poly,hex,layer);decal('x',-1,poly,hex,layer)};
 const plate=(ax,sg,y0,y1,bg)=>{decal(ax,sg,rect(-.26,y0,.26,y1),bg,4);decal(ax,sg,rect(-.258,y0+.004,-.236,y1-.004),0x1d3fa0,5);
  const cw=.034,gap=.012;let x=-.215;for(let k=0;k<7;k++){if(k===4)x+=.03;decal(ax,sg,rect(x,y0+.022,x+cw,y1-.022),0x18181a,5);x+=cw+gap}};
 /* boxes (mirrors, rails, signs) */
 function box(c,sz,ry,hex,faces){const[hx2,hy,hz]=sz.map(v=>v/2),cs=Math.cos(ry),sn=Math.sin(ry);
  const P=(x,y,z)=>[c[0]+x*cs+z*sn,c[1]+y,c[2]-x*sn+z*cs];
  const F=[[[1,0,0],[[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]]],[[-1,0,0],[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]]],[[0,1,0],[[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1]]],[[0,-1,0],[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]],[[0,0,1],[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]],[[0,0,-1],[[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1]]]];
  F.forEach(([n,q],fi)=>{const h=faces&&faces[fi]!==undefined?faces[fi]:hex,v=q.map(k=>P(k[0]*hx2,k[1]*hy,k[2]*hz)),r=[n[0]*cs+n[2]*sn,n[1],-n[0]*sn+n[2]*cs];tri(v[0],v[1],v[2],h,r);tri(v[0],v[2],v[3],h,r)})}
 const D={decal,both,sides,plate,box,tri,rect,mX,circ,shrink,beltAt,wAt,roofAt,ybAt,NZ,W0,ZF,ZB,R:R_,S};
 S.deco(D);

 /* arch liners, so you can't see through the body over the wheels */
 for(const za of[ZF,ZB])for(const s of[1,-1]){const x=s*S.lx,L=[];for(let k=0;k<=12;k++){const a=k/12*Math.PI;L.push([x,R_+RA*Math.sin(a),za+RA*Math.cos(a)])}L.push([x,.16,za-RA],[x,.16,za+RA]);
  let cy=0,cz=0;for(const p of L){cy+=p[1];cz+=p[2]}const C=[x,cy/L.length,cz/L.length];
  for(let k=0;k<L.length;k++){tri(C,L[k],L[(k+1)%L.length],0x101113,[s,0,0]);tri(C,L[k],L[(k+1)%L.length],0x101113,[-s,0,0])}}
 for(const s of[1,-1]){const m=S.mirror;box([s*m.x,m.y,m.z],m.s,-s*.12,m.col===undefined?null:m.col,{5:0x2c333a});box([s*(m.x-.07),m.y-.03,m.z+.01],[.06,.05,.05],-s*.12,TRIM)}
 if(S.extras)S.extras(D);
 return{PB,FB,tris:(PB.p.length+FB.p.length)/9}}

/* ================================================================ wheels */
function rimArr(sx,S,B){const x=sx*(S.TW+.004),k=S.rimR/.254,P=(r,a)=>[x,r*k*Math.sin(a),r*k*Math.cos(a)],R=S.rim,silver=R.col,ox=S.wx||0;
 const push=(a,b,c,h)=>{let n=nrm(crs(sub(b,a),sub(c,a)));if(!n)return;if(n[0]*sx<0){const t=b;b=c;c=t}const q=hx(h);B.p.push(...a,...b,...c);for(let i=0;i<3;i++)B.c.push(...q)};
 const seg=40;for(let i=0;i<seg;i++){const a0=i/seg*6.2832,a1=(i+1)/seg*6.2832;push(P(.236,a0),P(.254,a0),P(.254,a1),R.lip||silver);push(P(.236,a0),P(.254,a1),P(.236,a1),R.lip||silver);push([x,0,0],P(.068,a0),P(.068,a1),R.hub||0xa3a8ae)}
 const tw=R.twin===false?[0]:[-.11,.11];
 for(let j=0;j<R.n;j++)for(const d of tw){const a=j*6.2832/R.n+d,e=(r,w)=>{const c=P(r,a);return[x,c[1]+Math.cos(a)*w*k,c[2]-Math.sin(a)*w*k]},w0=R.w0||.018,w1=R.w1||.012;
  push(e(.06,w0),e(.24,w1),e(.24,-w1),silver);push(e(.06,w0),e(.24,-w1),e(.06,-w0),silver)}
 for(let i=0;i<16;i++){const a0=i/16*6.2832,a1=(i+1)/16*6.2832,xi=x+sx*.002,Q=(r,a)=>[xi,r*k*Math.sin(a),r*k*Math.cos(a)];let a=[xi,0,0],b=Q(.032,a0),c=Q(.032,a1),n=nrm(crs(sub(b,a),sub(c,a)));if(n[0]*sx<0){const t=b;b=c;c=t}const q=hx(R.cap||0x1e1f22);B.p.push(...a,...b,...c);for(let j=0;j<3;j++)B.c.push(...q)}
 return B}
/* whole wheel as triangles (for the static copies): tyre, dark barrel, rim face */
function wheelArr(S,sx,cx,cz,B){const R=S.R*.985,T=S.TW,n=24,ty=hx(0x161619),bar=hx(0x2a2c30),add=(a,b,c,col,ref)=>{let nn=nrm(crs(sub(b,a),sub(c,a)));if(!nn)return;if(ref&&nn[0]*ref[0]+nn[1]*ref[1]+nn[2]*ref[2]<0){const t=b;b=c;c=t;nn=[-nn[0],-nn[1],-nn[2]]}const s=Math.min(1,.55+.45*Math.max(0,nn[1])+.1);B.p.push(...a,...b,...c);for(let i=0;i<3;i++)B.c.push(col[0]*s,col[1]*s,col[2]*s)};
 const p=(x,r,a)=>[cx+x,S.R+r*Math.sin(a),cz+r*Math.cos(a)];
 for(let i=0;i<n;i++){const a0=i/n*6.2832,a1=(i+1)/n*6.2832,am=(a0+a1)/2,o=[0,Math.sin(am),Math.cos(am)];
  add(p(-T,R,a0),p(T,R,a0),p(T,R,a1),ty,o);add(p(-T,R,a0),p(T,R,a1),p(-T,R,a1),ty,o);
  for(const e of[1,-1]){add(p(e*T,0,0),p(e*T,R,a0),p(e*T,R,a1),e===sx?ty:ty,[e,0,0])}
  add(p(sx*(T+.001),0,0),p(sx*(T+.001),S.rimR*.992,a0),p(sx*(T+.001),S.rimR*.992,a1),bar,[sx,0,0])}
 const W=rimArr(sx,S,{p:[],c:[]});for(let i=0;i<W.p.length;i+=3){B.p.push(W.p[i]+cx,W.p[i+1]+S.R,W.p[i+2]+cz)}for(const c of W.c)B.c.push(c)}

/* ================================================================ spec from a few numbers
   type: saloon | hatch (also SUV, van, cab).  z is metres forward of the car's centre. */
function gen(p){const NZ=p.L/2,W0=p.W/2,ZF=NZ-p.fo,ZB=ZF-p.WB,rd=p.round==null?1:p.round,yb=p.yb==null?.15:p.yb,H=p.H,sal=p.type==='saloon';
 const wK=[[NZ,W0*(1-.17*rd)],[NZ-.012,W0*(1-.12*rd)],[NZ-.035,W0*(1-.085*rd)],[NZ-.09,W0*(1-.05*rd)],[NZ-.25,W0*(1-.022*rd)],[NZ-.55,W0],[-NZ+.5,W0],[-NZ+.25,W0*(1-.02*rd)],[-NZ+.1,W0*(1-.05*rd)],[-NZ+.03,W0*(1-.08*rd)],[-NZ,W0*(1-.115*rd)]];
 const ybK=[[NZ,yb+.09],[NZ-.07,yb+.03],[NZ-.22,yb+.005],[NZ-.6,yb],[-NZ+.6,yb],[-NZ+.27,yb+.03],[-NZ+.07,yb+.1],[-NZ,yb+(p.tailLift==null?.16:p.tailLift)]];
 const q=p.q==null?.42:p.q,bK=[];
 for(const s of[0,.008,.02,.04,.07,.11,.17,.25,.36,.5,.68,.85,1])bK.push([NZ-s*(NZ-p.ws0),p.nose+(p.cowl-p.nose)*Math.pow(s,q)]);
 if(sal){bK.push([(p.ws0+p.rs0)/2,(p.cowl+p.deck)/2+.01],[p.rs0,p.deck],[-NZ+.25,p.deck+.006],[-NZ+.12,p.deck+.008],[-NZ+.04,p.deck-.02],[-NZ,p.deck-.06])}
 else bK.push([(p.ws0-NZ)/2,(p.cowl+p.beltR)/2+.01],[-NZ+.15,p.beltR],[-NZ+.04,p.beltR-.02],[-NZ,p.beltR-.05]);
 const rK=[[p.ws0+.03,0],[p.ws0,p.cowl-.03]];
 for(const s of[.12,.25,.4,.55,.7,.85,1])rK.push([p.ws0+(p.ws1-p.ws0)*s,p.cowl+(H-.04-p.cowl)*Math.pow(Math.sin(s*Math.PI/2),p.wsp==null?.9:p.wsp)]);
 for(const s of[.25,.5,.75,1])rK.push([p.ws1+(p.zpk-p.ws1)*s,H-.04+.04*Math.sin(s*Math.PI/2)]);
 const rfd=p.rfd==null?.05:p.rfd;for(const s of[.25,.5,.75,1])rK.push([p.zpk+(p.rf1-p.zpk)*s,H-rfd*Math.pow(s,1.6)]);
 const yr1=H-rfd;
 if(sal){for(const s of[.15,.3,.45,.6,.75,.9,1])rK.push([p.rf1+(p.rs0-p.rf1)*s,p.deck-.01+(yr1-p.deck+.01)*Math.pow(Math.cos(s*Math.PI/2),p.rsp==null?1.1:p.rsp)]);rK.push([p.rs0-.03,0])}
 else for(const s of[.25,.5,.75,1])rK.push([p.rf1+(-NZ-p.rf1)*s,yr1+(p.tail-yr1)*Math.pow(s,p.tp==null?1.5:p.tp)]);
 const side=[p.sideB!=null?p.sideB:sal?p.rs0+.3:-NZ+.42,p.ws0-.03];
 const S={NZ,W0,ZF,ZB,R:p.R,RA:p.R+.039,TW:p.TW||.1275,rimR:p.rimR||p.R*.715,inset:p.inset||.125,wK,ybK,beltK:bK,roofK:rK,
  roofW:p.roofW||W0*.70,aw:p.aw||.07,crown:p.crown==null?.066:p.crown,p3y:p.p3y||yb+.27,lx:W0-.32,rearExtra:!sal,
  bendF:{from:NZ-.62,pull:.13*rd,rake:p.rakeF==null?.05:p.rakeF,y0:p.nose-.2,y1:p.nose+.1},
  bendR:p.rakeR||p.pullR?{from:-NZ+.55,pull:p.pullR==null?.08*rd:p.pullR,rake:p.rakeR||0,y0:(sal?p.deck:p.beltR)-.05,y1:sal?p.deck+.05:p.tail}:null,
  glass:{side,posts:p.posts||[],ws:[p.ws1,p.ws0+.02],rs:sal?[p.rs0,p.rf1]:p.rsGlass||null,sill:p.sill,pillars:p.pillars,roofCol:p.roofCol},
  mirror:Object.assign({x:W0+.04,y:p.cowl+.06,z:p.ws0-.16,s:[.15,.095,.075]},p.mirror||{}),rim:p.rim||{n:5,col:0xb8bdc3},
  deco:p.deco,extras:p.extras,capCol:p.capCol};
 return S}

/* generic decoration from a few shapes (front-view coords for x>0 at the front, rear-view at the back) */
function std(o){return D=>{const{decal,both,sides,plate}=D,NZ=D.NZ;
 if(o.bumpF)decal('z',1,rect(-1.2,o.bumpF[0],1.2,o.bumpF[1]),o.bumpCol||0x1a1b1e,0);
 if(o.lip)decal('z',1,rect(-1.2,o.lip[0],1.2,o.lip[1]),0x1a1b1e,0);
 if(o.grille){if(o.surround!==false)decal('z',1,o.grille,o.surround||0x55585e,1);decal('z',1,shrink(o.grille,.93),o.grilleCol||0x0f1012,2);
  if(o.slats){const ys=o.grille.map(q=>q[1]),xs=o.grille.map(q=>q[0]),y0=Math.min(...ys),y1=Math.max(...ys),x1=Math.max(...xs)*.85;for(let y=y0+.04;y<y1-.03;y+=o.slats)decal('z',1,rect(-x1,y,x1,y+.012),o.slatCol||0x34373c,3)}}
 if(o.grille2)for(const g of o.grille2)decal('z',1,g[0],g[1],g[2]||2);
 if(o.intake)both('z',1,o.intake,0x131416,1);
 if(o.hl){both('z',1,o.hl,o.hlCol||0x262b31,1);both('z',1,shrink(o.hl,.78,.003),o.lensCol||0x8f9ba6,2);
  if(o.drl!==false){const ys=o.hl.map(q=>q[1]),xs=o.hl.map(q=>q[0]),y0=Math.min(...ys),x0=Math.min(...xs),x1=Math.max(...xs);both('z',1,rect(x0+(x1-x0)*.12,y0+.008,x0+(x1-x0)*.9,y0+.02),0xf6f9ff,3)}}
 if(o.hlRound)for(const c of o.hlRound){both('z',1,circ(c[0],c[1],c[2]*1.12,c[2]*1.12),o.ringCol||0xb4b8be,1);both('z',1,circ(c[0],c[1],c[2],c[2]),0x262b31,2);both('z',1,circ(c[0],c[1],c[2]*.62,c[2]*.62),0xc8d2dc,3);both('z',1,circ(c[0],c[1],c[2]*.3,c[2]*.3),0xf4f8ff,4)}
 if(o.fplate!=null)plate('z',1,o.fplate,o.fplate+.11,0xeeeeea);
 if(o.bumpR)decal('z',-1,rect(-1.2,o.bumpR[0],1.2,o.bumpR[1]),o.bumpCol||0x1a1b1e,0);
 if(o.diff)decal('z',-1,rect(-o.diffW||-.84,o.diff[0],o.diffW||.84,o.diff[1]),0x16171a,1);
 if(o.hatchWin)decal('z',-1,o.hatchWin,WSC,1);
 if(o.tl){both('z',-1,o.tl,o.tlCol||0x6d0a10,1);both('z',-1,shrink(o.tl,.8),0xc31a26,2)}
 if(o.tlBar)decal('z',-1,rect(-o.tlBar[2],o.tlBar[0],o.tlBar[2],o.tlBar[1]),o.tlBarCol||0xd21c28,o.tlBarLayer||1);
 if(o.rplate!=null)plate('z',-1,o.rplate,o.rplate+.11,0xf0c418);
 if(o.sill)sides(rect(o.sill[0],o.sill[1],o.sill[2],o.sill[3]),o.sillCol||0x26272b,1);
 for(const z of o.doors||[])sides(rect(z-.0035,o.doorY0||.28,z+.0035,D.beltAt(z)-.005),0x1b1c1f,1);
 for(const z of o.handles||[])sides(rect(z,D.beltAt(z)-.10,z+.17,D.beltAt(z)-.078),0x55595f,1);
 if(o.wrapF)sides(rect(...o.wrapF),o.hlCol||0x262b31,1);
 if(o.wrapR)sides(rect(...o.wrapR),0x6d0a10,1);
 if(o.custom)o.custom(D)}}

/* ================================================================ the cars */
const SPECS=[];
/* ---- 6: Audi A6 (C8) — hand-tuned profile, see the A6 notes ---- */
SPECS.push({key:'a6',name:'AUDI A6',desc:'QUATTRO + COMFY',price:520,stat:[5,1.1,1.16],hgt:1.13,rad:1.16,far:2,
 stock:[.70,.72,.75],pal:[[.70,.72,.75],[.08,.08,.1],[.92,.92,.93],[.12,.2,.42],[.32,.34,.37]],
 S:(()=>{const NZ=2.4695,W0=.943,ZF=1.52;return{NZ,W0,ZF,ZB:ZF-2.924,R:.356,RA:.395,TW:.1275,rimR:.254,inset:.125,
  wK:[[2.47,.78],[2.46,.82],[2.445,.85],[2.42,.873],[2.38,.892],[2.2,.922],[1.9,.938],[1.5,W0],[-1.4,W0],[-1.9,.938],[-2.2,.922],[-2.36,.897],[-2.44,.865],[-2.47,.835]],
  ybK:[[2.47,.25],[2.40,.19],[2.25,.165],[1.9,.16],[-1.9,.16],[-2.2,.19],[-2.40,.26],[-2.47,.32]],
  beltK:[[2.47,.575],[2.455,.625],[2.43,.665],[2.39,.70],[2.33,.733],[2.25,.762],[2.15,.79],[2.02,.815],[1.88,.837],[1.7,.86],[1.4,.897],[1.15,.912],[.95,.925],[.3,.952],[-.5,.972],[-1.2,.988],[-1.7,1.0],[-2.1,1.01],[-2.33,1.012],[-2.43,.99],[-2.47,.955]],
  roofK:[[1.03,0],[1.0,.90],[.96,.935],[.80,1.06],[.55,1.22],[.30,1.345],[.10,1.415],[-.15,1.45],[-.40,1.457],[-.70,1.44],[-.92,1.405],[-1.12,1.33],[-1.38,1.19],[-1.58,1.07],[-1.71,.99],[-1.74,0]],
  roofW:.655,aw:.07,crown:.066,p3y:.43,lx:.62,
  bendF:{from:1.85,pull:.13,rake:.05,y0:.38,y1:.68},bendR:null,
  glass:{side:[-1.30,.93],posts:[[-.13,-.03],[-1.135,-1.095]],ws:[.10,.97],rs:[-1.71,-.92]},
  mirror:{x:.985,y:1.005,z:.79,s:[.15,.095,.075]},rim:{n:5,col:0xb8bdc3},
  deco:D=>{const{decal,both,sides,plate,beltAt}=D;
   decal('z',1,rect(-.80,.19,.80,.255),0x1a1b1e,0);
   const SF=[[-.40,.605],[.40,.605],[.47,.56],[.45,.33],[.36,.235],[-.36,.235],[-.45,.33],[-.47,.56]];
   decal('z',1,SF,0x55585e,1);decal('z',1,SF.map(q=>[q[0]*.95,.235+(q[1]-.235)*.95+.012]),0x0f1012,2);
   for(let y=.30;y<.66;y+=.055)decal('z',1,rect(-.40,y,.40,y+.013),0x34373c,3);
   plate('z',1,.36,.47,0xeeeeea);
   both('z',1,[[.46,.595],[.52,.562],[.78,.57],[.85,.592],[.83,.628],[.48,.632]],0x262b31,1);
   both('z',1,[[.49,.602],[.54,.582],[.77,.588],[.82,.603],[.805,.622],[.50,.624]],0x8f9ba6,2);
   both('z',1,[[.525,.57],[.775,.578],[.78,.59],[.53,.582]],0xf6f9ff,3);
   for(let k=0;k<5;k++){const x=.57+k*.043;both('z',1,rect(x,.594,x+.019,.61),0xe8eef6,3)}
   both('z',1,[[.52,.265],[.74,.265],[.80,.325],[.78,.455],[.56,.44],[.49,.36]],0x131416,1);
   both('z',1,rect(.53,.352,.78,.366),0x5c6066,2);
   both('z',-1,[[.40,.885],[.86,.90],[.905,.955],[.865,.985],[.42,.978],[.38,.93]],0x6d0a10,1);
   both('z',-1,[[.43,.905],[.84,.915],[.875,.952],[.845,.968],[.44,.962],[.41,.932]],0xc31a26,2);
   both('z',-1,rect(.46,.935,.84,.945),0xff5560,3);
   decal('z',-1,rect(-.40,.916,.40,.93),0xb2b7bd,1);
   plate('z',-1,.70,.81,0xf0c418);
   decal('z',-1,[[-.84,.335],[.84,.335],[.86,.43],[-.86,.43]],0x16171a,1);
   both('z',-1,[[.50,.35],[.78,.35],[.80,.41],[.48,.41]],0xbfc4c9,2);
   both('z',-1,[[.52,.358],[.765,.358],[.783,.402],[.50,.402]],0x0b0b0c,3);
   both('z',-1,rect(.80,.48,.88,.505),0x7a1016,1);
   sides(rect(-1.0,.165,1.115,.26),0x26272b,1);
   for(const z of[.95,-.075])sides(rect(z-.0035,.27,z+.0035,beltAt(z)-.005),0x1b1c1f,1);
   sides([[-1.135,.66],[-1.128,.66],[-1.128,.98],[-1.135,.98]],0x1b1c1f,1);
   sides(rect(.05,.862,.22,.884),0x55595f,1);sides(rect(-.98,.875,-.81,.897),0x55595f,1);
   sides(rect(2.24,.58,2.36,.635),0x262b31,1);sides(rect(2.25,.568,2.355,.58),0xf2f6ff,2);
   sides(rect(-2.445,.89,-2.25,.975),0x6d0a10,1);sides(rect(-2.43,.905,-2.27,.96),0xc31a26,2);
   sides(rect(2.0,.47,2.07,.49),0xd88a20,1)}}})(),
 lamps:{f:[.66,.60,2.40],b:[.66,.935,-2.475]}});

/* ---- 7: VW Golf Mk8 ---- */
SPECS.push({key:'golf',name:'VW GOLF',desc:'NIPPY + EASY',price:300,stat:[3,1.06,1.06],hgt:1.1,rad:1.0,far:0,
 stock:[.86,.87,.88],pal:[[.92,.92,.93],[.36,.38,.41],[.1,.22,.5],[.07,.07,.08],[.62,.06,.08]],
 S:gen({L:4.284,W:1.789,H:1.456,WB:2.636,fo:.86,R:.316,yb:.15,type:'hatch',nose:.62,cowl:.90,beltR:.98,ws0:.80,ws1:.02,zpk:-.35,rf1:-1.05,rfd:.04,tail:1.06,tp:.85,rakeR:.30,pullR:.09,
  sideB:-1.22,posts:[[-.36,-.27]],rsGlass:[-2.06,-1.05],crown:.05,
  deco:std({lip:[.17,.24],grille:[[-.62,.64],[.62,.64],[.6,.67],[-.6,.67]],surround:false,
   grille2:[[[[-.42,.26],[.42,.26],[.50,.44],[-.50,.44]],0x111214,1],[[[-.40,.28],[.40,.28],[.47,.42],[-.47,.42]],0x24262a,2]],
   hl:[[.44,.62],[.80,.61],[.84,.65],[.80,.70],[.46,.69]],fplate:.445,
   intake:[[.56,.25],[.74,.25],[.78,.33],[.60,.36]],
   tl:[[.30,.84],[.82,.88],[.86,.97],[.32,.96]],rplate:.72,diff:[.27,.37],
   sill:[-.9,.17,.9,.25],doors:[.82,-.30,-1.30],handles:[.08,-.98],wrapF:[1.96,.62,2.10,.69],wrapR:[-2.13,.87,-1.98,.95]})}),
 lamps:{f:[.64,.65,2.10],b:[.6,.92,-2.12]}});

/* ---- 8: Range Rover (L460) ---- */
SPECS.push({key:'rr',name:'RANGE ROVER',desc:'LUXURY + 4X4 GRIP',price:900,stat:[4,1.05,1.2],hgt:1.38,rad:1.2,far:4,
 stock:[.08,.085,.09],pal:[[.08,.085,.09],[.93,.93,.92],[.42,.44,.45],[.14,.2,.16],[.24,.2,.17]],
 S:gen({L:5.052,W:2.047,H:1.870,WB:2.997,fo:.93,R:.41,yb:.27,type:'hatch',round:.55,nose:.92,cowl:1.13,beltR:1.20,ws0:.92,ws1:.12,zpk:-.6,rf1:-2.15,rfd:.04,tail:1.76,tp:1.4,rakeR:.06,
  sideB:-2.02,posts:[[-.36,-.24],[-1.52,-1.46]],pillars:1,roofCol:0x15161a,crown:.04,q:.5,p3y:.62,sill:0xa9aeb4,
  rim:{n:6,col:0x6b6f75,twin:true,w0:.016,w1:.011},mirror:{y:1.22,z:.74,s:[.17,.11,.08]},
  deco:std({lip:[.30,.38],grille:[[-.48,.62],[.48,.62],[.48,.88],[-.48,.88]],grilleCol:0x15161a,surround:0x3a3d42,slats:.045,slatCol:0x2a2d33,
   hl:[[.50,.80],[.94,.80],[.96,.86],[.52,.87]],fplate:.48,intake:[[.55,.40],[.88,.40],[.90,.55],[.57,.55]],
   hatchWin:[[-.72,1.30],[.72,1.30],[.66,1.68],[-.66,1.68]],bumpR:[.40,.55],tlBar:[1.20,1.27,.95],tlBarCol:0x141518,
   tl:[[.86,.90],[.98,.90],[.98,1.32],[.86,1.32]],rplate:.70,
   sill:[-1.0,.30,1.10,.42],sillCol:0x3a3d42,doors:[.88,-.30,-1.49],handles:[.05,-1.15],wrapF:[2.34,.80,2.50,.86],wrapR:[-2.52,.92,-2.40,1.30],
   custom:D=>{D.decal('z',-1,rect(-.6,1.21,.6,1.255),0x3a3d42,2)}})}),
 lamps:{f:[.74,.83,2.48],b:[.92,1.1,-2.52]}});

/* ---- 9: Tesla Model 3 ---- */
SPECS.push({key:'m3',name:'TESLA MODEL 3',desc:'SILENT + QUICK',price:600,stat:[6,1.25,1.12],hgt:1.1,rad:1.1,far:2,
 stock:[.92,.92,.93],pal:[[.92,.92,.93],[.07,.07,.08],[.62,.04,.06],[.1,.2,.48],[.4,.42,.45]],
 S:gen({L:4.72,W:1.85,H:1.441,WB:2.875,fo:.84,R:.335,yb:.14,type:'saloon',nose:.56,cowl:.88,deck:.99,ws0:1.0,ws1:.15,zpk:-.25,rf1:-.85,rs0:-1.62,rsp:1.0,
  sideB:-1.28,posts:[[-.18,-.08]],roofCol:0x1a222c,sill:0x17181b,crown:.06,q:.36,
  rim:{n:5,col:0x2a2c30,twin:true,lip:0x3a3c40},
  deco:std({lip:[.18,.26],grille2:[[[[-.40,.26],[.40,.26],[.44,.36],[-.44,.36]],0x111214,1]],
   hl:[[.48,.58],[.82,.56],[.86,.60],[.80,.635],[.50,.62]],fplate:.40,
   tl:[[.36,.86],[.86,.86],[.90,.93],[.84,.965],[.40,.95]],rplate:.48,diff:[.28,.38],
   doors:[.98,-.13,-1.30],handles:[.12,-.95],wrapF:[2.2,.58,2.32,.63],wrapR:[-2.36,.86,-2.2,.95]})}),
 lamps:{f:[.68,.6,2.3],b:[.64,.9,-2.36]}});

/* ---- 10: Porsche 911 (992) ---- */
SPECS.push({key:'911',name:'PORSCHE 911',desc:'FASTEST + GRIPPIEST',price:1200,stat:[10,1.32,1.26],hgt:.95,rad:1.08,far:2,
 stock:[.74,.75,.77],pal:[[.74,.75,.77],[.72,.06,.06],[.95,.78,.1],[.06,.06,.07],[.12,.26,.5]],
 S:gen({L:4.519,W:1.852,H:1.298,WB:2.45,fo:.98,R:.34,yb:.12,type:'saloon',nose:.60,cowl:.78,deck:.97,ws0:.50,rakeF:.02,ws1:-.28,zpk:-.55,rf1:-.85,rs0:-1.70,rsp:.75,rfd:.06,
  sideB:-1.08,posts:[[-.70,-.64]],crown:-.06,q:.5,roofW:.58,p3y:.38,
  rim:{n:5,col:0xc3c7cc,twin:true},mirror:{z:.38,y:.88},
  deco:std({lip:[.14,.20],grille2:[[[[-.32,.22],[.32,.22],[.34,.33],[-.34,.33]],0x111214,1],[[[.46,.22],[.74,.24],[.76,.34],[.48,.34]],0x111214,1],[[[-.46,.22],[-.48,.34],[-.76,.34],[-.74,.24]],0x111214,1]],
   hlRound:[[.62,.60,.095]],ringCol:0x2a2c30,fplate:.37,
   tlBar:[.885,.905,.86],tl:[[.62,.86],[.88,.865],[.90,.93],[.64,.925]],rplate:.48,diff:[.22,.34],diffW:.7,
   doors:[.42,-.66],handles:[-.48],wrapR:[-2.25,.86,-2.1,.93],
   custom:D=>{const NZ=D.NZ;D.decal('z',-1,rect(-.48,.96,.48,1.03),0x111214,2);for(let x=-.44;x<.44;x+=.06)D.decal('z',-1,rect(x,.965,x+.03,1.025),0x2a2d31,3)}}),
  extras:D=>{const NZ=D.NZ;D.box([0,1.04,-NZ+.16],[1.2,.03,.16],0,null)}}),
 lamps:{f:[.62,.63,2.2],b:[.76,.9,-2.26]}});

/* ---- 11: Mini Cooper (F56, 3-door) ---- */
SPECS.push({key:'mini',name:'MINI COOPER',desc:'GO-KART HANDLING',price:260,stat:[2,1.08,1.14],hgt:1.08,rad:.92,far:0,
 stock:[.06,.22,.14],pal:[[.06,.22,.14],[.66,.05,.06],[.92,.92,.92],[.1,.24,.5],[.9,.72,.1]],
 S:gen({L:3.876,W:1.727,H:1.414,WB:2.495,fo:.70,R:.30,yb:.15,type:'hatch',nose:.70,cowl:.92,beltR:.97,ws0:.98,ws1:.42,zpk:-.25,rf1:-1.45,rfd:.03,tail:1.32,tp:1.1,rakeR:.08,pullR:.06,
  sideB:-1.42,pillars:1,roofCol:0xeeeeec,crown:.07,q:.55,wsp:.8,
  rim:{n:7,col:0xc0c4c9,twin:false,w0:.024,w1:.018},mirror:{col:0xeeeeec},
  deco:std({lip:[.18,.25],grille:[[-.22,.62],[.22,.62],[.30,.52],[.26,.38],[.18,.33],[-.18,.33],[-.26,.38],[-.30,.52]],surround:0xb4b8be,slats:.05,
   hlRound:[[.56,.72,.12]],fplate:.36,intake:[[.54,.24],[.72,.24],[.74,.30],[.56,.32]],
   hatchWin:[[-.58,1.0],[.58,1.0],[.54,1.25],[-.54,1.25]],tl:[[.62,.80],[.80,.80],[.80,.98],[.62,.98]],rplate:.70,bumpR:[.26,.36],
   doors:[.92,-.55],handles:[-.40],sill:[-.85,.17,.85,.24]})}),
 lamps:{f:[.56,.72,1.9],b:[.71,.89,-1.94]}});

/* ---- 12: BMW 3 Series (G20) ---- */
SPECS.push({key:'3s',name:'BMW 3 SERIES',desc:'SHARP + SPORTY',price:540,stat:[5,1.14,1.13],hgt:1.1,rad:1.1,far:2,
 stock:[.1,.12,.2],pal:[[.1,.12,.2],[.92,.92,.93],[.06,.06,.07],[.46,.48,.5],[.28,.36,.5]],
 S:gen({L:4.709,W:1.827,H:1.442,WB:2.851,fo:.80,R:.33,yb:.15,type:'saloon',nose:.62,cowl:.90,deck:1.0,ws0:.86,ws1:.05,zpk:-.35,rf1:-.95,rs0:-1.56,
  sideB:-1.24,posts:[[-.16,-.06]],sill:0x17181b,
  rim:{n:5,col:0xb8bdc3,twin:true},
  deco:std({lip:[.18,.25],grille2:[[[[.03,.44],[.22,.44],[.24,.47],[.24,.63],[.21,.66],[.03,.66]],0xb4b8be,1],[[[-.03,.44],[-.03,.66],[-.21,.66],[-.24,.63],[-.24,.47],[-.22,.44]],0xb4b8be,1],
    [[[.045,.455],[.21,.455],[.225,.475],[.225,.625],[.205,.645],[.045,.645]],0x0f1012,2],[[[-.045,.455],[-.045,.645],[-.205,.645],[-.225,.625],[-.225,.475],[-.21,.455]],0x0f1012,2],
    [[[-.42,.24],[.42,.24],[.44,.34],[-.44,.34]],0x111214,1]],
   hl:[[.30,.60],[.80,.58],[.86,.62],[.80,.66],[.32,.645]],fplate:.36,intake:[[.56,.25],[.78,.26],[.80,.38],[.60,.38]],
   tl:[[.40,.88],[.86,.89],[.90,.96],[.86,.99],[.44,.97],[.40,.95]],rplate:.72,diff:[.30,.40],
   doors:[.84,-.11,-1.28],handles:[.0,-1.0],wrapF:[2.12,.59,2.27,.65],wrapR:[-2.35,.88,-2.18,.97],sill:[-.98,.16,1.0,.25]})}),
 lamps:{f:[.6,.62,2.3],b:[.66,.93,-2.35]}});

/* ---- 13: Ford Transit Custom ---- */
SPECS.push({key:'tc',name:'FORD TRANSIT CUSTOM',desc:'HUGE LOAD SPACE',price:420,stat:[-2,.9,.98],hgt:1.52,rad:1.22,far:3,
 stock:[.95,.95,.95],pal:[[.95,.95,.95],[.95,.95,.95],[.68,.7,.72],[.12,.22,.48],[.08,.08,.09]],
 S:gen({L:4.973,W:2.032,H:1.97,WB:2.933,fo:.93,R:.35,yb:.25,type:'hatch',round:.35,nose:.95,cowl:1.12,beltR:1.20,ws0:1.62,ws1:.52,zpk:-.2,rf1:-2.2,rfd:.02,tail:1.92,tp:1,wsp:.85,
  sideB:.10,posts:[],crown:.05,p3y:.55,q:.45,sill:0x17181b,
  rim:{n:8,col:0x55585e,twin:false,w0:.02,w1:.02,hub:0x3a3c40},mirror:{y:1.30,z:1.45,s:[.18,.22,.09],col:0x17181b},
  deco:std({bumpF:[.25,.55],grille:[[-.56,.60],[.56,.60],[.60,.86],[-.60,.86]],grilleCol:0x141518,surround:0x2a2c30,slats:.08,slatCol:0x9aa0a6,
   hl:[[.62,.68],[.92,.70],[.94,.90],[.66,.92]],fplate:.36,
   bumpR:[.25,.55],custom:D=>{D.decal('z',-1,rect(-.008,.56,.008,1.88),0x1b1c1f,1);D.both('z',-1,[[.10,1.30],[.82,1.30],[.80,1.78],[.12,1.78]],WSC,1)},
   tl:[[.86,.70],[.98,.70],[.98,1.28],[.86,1.28]],rplate:.62,
   doors:[1.50,.10,-1.10],handles:[.25,-.40],wrapF:[2.32,.70,2.47,.90],wrapR:[-2.49,.70,-2.38,1.28],sill:[-1.2,.27,1.2,.40]})}),
 lamps:{f:[.78,.80,2.45],b:[.92,1.0,-2.49]}});

/* ---- 14: Nissan Qashqai (J12) ---- */
SPECS.push({key:'qq',name:'NISSAN QASHQAI',desc:'HIGH UP + COMFY',price:360,stat:[1,1.0,1.06],hgt:1.28,rad:1.06,far:4,
 stock:[.62,.08,.08],pal:[[.62,.08,.08],[.92,.92,.93],[.42,.44,.46],[.08,.08,.09],[.14,.24,.42]],
 S:gen({L:4.425,W:1.835,H:1.625,WB:2.665,fo:.90,R:.35,yb:.21,type:'hatch',nose:.76,cowl:1.0,beltR:1.07,ws0:.78,ws1:.02,zpk:-.55,rf1:-1.5,rfd:.04,tail:1.47,tp:1.3,rakeR:.2,pullR:.08,
  sideB:-1.58,posts:[[-.34,-.25],[-1.2,-1.14]],pillars:1,roofCol:0x15161a,crown:.05,p3y:.5,sill:0x17181b,
  rim:{n:5,col:0xc3c7cc,twin:true,lip:0x2a2c30},
  deco:std({lip:[.24,.32],grille:[[-.48,.62],[.48,.62],[.40,.38],[-.40,.38]],grilleCol:0x141518,surround:0xb4b8be,slats:.045,slatCol:0x2e3136,
   hl:[[.46,.70],[.84,.70],[.88,.75],[.48,.76]],fplate:.42,intake:[[.54,.30],[.80,.30],[.82,.45],[.56,.45]],
   hatchWin:[[-.60,1.12],[.60,1.12],[.52,1.40],[-.52,1.40]],tl:[[.34,1.0],[.86,1.0],[.90,1.08],[.36,1.07]],rplate:.78,bumpR:[.30,.46],
   sill:[-1.0,.22,1.0,.40],sillCol:0x1a1b1e,doors:[.74,-.30,-1.22],handles:[.06,-1.02],wrapF:[2.0,.70,2.14,.76],wrapR:[-2.21,1.0,-2.06,1.07]}),
  extras:D=>{for(const s of[1,-1])D.box([s*.66,1.64,-.4],[.05,.05,1.9],0,0xa9aeb4)}}),
 lamps:{f:[.66,.73,2.15],b:[.62,1.04,-2.21]}});

/* ---- 15: LEVC TX (London black cab) ---- */
SPECS.push({key:'tx',name:'LONDON TAXI (TX)',desc:'FARES PAY +20%',price:480,stat:[0,.95,1.0],hgt:1.4,rad:1.16,far:4,
 stock:[.05,.05,.06],pal:[[.05,.05,.06],[.05,.05,.06],[.05,.05,.06],[.92,.92,.93],[.62,.08,.08]],
 S:gen({L:4.855,W:1.94,H:1.88,WB:2.985,fo:.87,R:.35,yb:.21,type:'hatch',round:.8,nose:.80,cowl:1.05,beltR:1.14,ws0:.98,ws1:.30,zpk:-.6,rf1:-1.85,rfd:.05,tail:1.62,tp:1.6,rakeR:.22,pullR:.1,
  sideB:-1.98,posts:[[-.32,-.22],[-1.50,-1.42]],crown:.07,p3y:.5,q:.5,sill:0xb4b8be,
  rim:{n:5,col:0xc3c7cc,twin:false,w0:.03,w1:.024},
  deco:std({lip:[.22,.30],grille:circ(0,.56,.24,.12,16),surround:0xb4b8be,grilleCol:0x15161a,slats:.035,slatCol:0x8a8e94,
   hlRound:[[.62,.70,.10]],fplate:.34,
   hatchWin:[[-.66,1.18],[.66,1.18],[.58,1.56],[-.58,1.56]],tl:[[.74,.80],[.88,.80],[.88,1.14],[.74,1.14]],rplate:.74,bumpR:[.28,.42],
   doors:[.92,-.27,-1.46],handles:[-.15,-1.34],sill:[-1.0,.22,1.0,.32],
   custom:D=>{D.sides(rect(-1.8,1.25,-.4,1.30),0x1b1c1f,1)}}),
  extras:D=>{D.box([0,1.92,.05],[.62,.11,.16],0,0xf2c016,{4:0xfff0a0,5:0xfff0a0});D.box([0,1.885,.05],[.66,.03,.18],0,0x17181b)}}),
 lamps:{f:[.62,.7,2.38],b:[.81,.97,-2.4]}});

/* ---- 16: Toyota Prius (5th gen) ---- */
SPECS.push({key:'prius',name:'TOYOTA PRIUS',desc:'SIPS FUEL + SMOOTH',price:340,stat:[1,1.03,1.04],hgt:1.08,rad:1.08,far:1,
 stock:[.92,.92,.93],pal:[[.92,.92,.93],[.72,.74,.76],[.36,.38,.4],[.07,.07,.08],[.1,.3,.5]],
 S:gen({L:4.60,W:1.78,H:1.43,WB:2.75,fo:.93,R:.335,yb:.14,type:'hatch',nose:.58,cowl:.86,beltR:.98,ws0:1.12,ws1:.0,zpk:-.35,rf1:-1.05,rfd:.05,tail:1.07,tp:.9,wsp:.95,
  sideB:-1.42,posts:[[-.24,-.14]],rsGlass:[-2.15,-1.05],crown:.05,q:.36,sill:0x17181b,
  rim:{n:10,col:0x9aa0a6,twin:false,w0:.012,w1:.009},
  deco:std({lip:[.17,.24],grille2:[[[[-.46,.24],[.46,.24],[.50,.38],[-.50,.38]],0x111214,1]],
   hl:[[.42,.57],[.82,.55],[.86,.58],[.78,.61],[.44,.60]],fplate:.40,custom:D=>{D.decal('z',1,rect(-.42,.572,.42,.585),0xf2f6ff,2)},
   tlBar:[.96,.985,.86],tl:[[.62,.93],[.86,.93],[.88,.99],[.64,.995]],rplate:.62,diff:[.27,.38],
   doors:[1.0,-.19,-1.40],handles:[.15,-.95],wrapR:[-2.30,.93,-2.15,.99]})}),
 lamps:{f:[.64,.58,2.26],b:[.74,.96,-2.3]}});

/* ================================================================ register */
const FIRST=6,MAT=c=>new THREE.MeshBasicMaterial({vertexColors:true,color:c||0xffffff});
const geo=B=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(B.p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(B.c,3));g.computeBoundingSphere();return g};
const lit=(m,base)=>{m.onBeforeRender=function(){const l=U.uLight.value,c=base||[1,1,1];this.material.color.setRGB(c[0]*l.x,c[1]*l.y,c[2]*l.z)};return m};
const TRI={specs:SPECS,ids:[],build,gen};
SPECS.forEach((C,k)=>{const id=FIRST+k,S=C.S;C.id=id;TRI.ids.push(id);
 let G=null;const ensure=()=>{if(G)return G;const t0=performance.now(),o=build(S);
  const st={p:o.FB.p.slice(),c:o.FB.c.slice()};for(const sx of[1,-1])for(const z of[S.ZF,S.ZB])wheelArr(S,sx,sx*(S.W0-S.inset),z,st);
  G={P:geo(o.PB),F:geo(o.FB),SF:geo(st),RG:{1:geo(rimArr(1,S,{p:[],c:[]})),'-1':geo(rimArr(-1,S,{p:[],c:[]}))},tris:o.tris,ms:performance.now()-t0};return G};
 /* the drivable car: lazily built the first time it is shown */
 const pM=MAT(),fM=MAT(),rM=MAT(),tyreM=new THREE.MeshBasicMaterial({color:0x151518}),dM=new THREE.MeshBasicMaterial({color:0x2a2c30});
 const grp=new THREE.Group();grp.visible=false;car.add(grp);const wl=[];
 const N={id,grp,ready:1,pc:C.stock,spec:C,built:0,
  load(){if(N.built)return;N.built=1;const g=ensure();grp.add(new THREE.Mesh(g.P,pM),new THREE.Mesh(g.F,fM));
   const tyreG=new THREE.CylinderGeometry(S.R*.985,S.R*.985,S.TW*2,24).rotateZ(Math.PI/2);
   for(const sx of[1,-1])for(const[f,z]of[[1,S.ZF],[0,S.ZB]]){const piv=new THREE.Group(),spin=new THREE.Group();piv.position.set(sx*(S.W0-S.inset),S.R,z);
    const dg=new THREE.CircleGeometry(S.rimR*.992,24);dg.rotateY(sx>0?Math.PI/2:-Math.PI/2);dg.translate(sx*(S.TW+.001),0,0);
    spin.add(new THREE.Mesh(tyreG,tyreM),new THREE.Mesh(dg,dM),new THREE.Mesh(g.RG[sx],rM));piv.add(spin);grp.add(piv);wl.push({piv,spin,front:f})}
   N.upd(1)},
  paint(){const w=paintC[0]>.97&&paintC[1]>.97&&paintC[2]>.97;N.pc=w?C.stock:paintC.slice();N.upd(1)},
  upd(still){const l=U.uLight.value,c=N.pc;pM.color.setRGB(c[0]*l.x,c[1]*l.y,c[2]*l.z);fM.color.setRGB(l.x,l.y,l.z);rM.color.setRGB(l.x,l.y,l.z);
   tyreM.color.setRGB(.085*l.x,.085*l.y,.09*l.z);dM.color.setRGB(.17*l.x,.17*l.y,.19*l.z);if(still)return;
   for(const w of wl){w.spin.rotation.x=GS_SPIN*.275/S.R;if(w.front)w.piv.rotation.y=GS.steer*.5}},
  /* a static copy: showroom pods (stock paint) and traffic (any colour) */
  inst(col){const g=ensure(),o=new THREE.Group();o.add(lit(new THREE.Mesh(g.P,MAT()),col||C.stock),lit(new THREE.Mesh(g.SF,MAT())));return o},
  geo:ensure};
 NC.cars[id]=N;
 const a=C.lamps;LPOS[id]={f:a.f,b:a.b};
 CARN[id]=C.name;CARSD[id]=C.desc;
 if(typeof FSTY!=="undefined")FSTY[10+k]=C.far});
TRI.price=i=>{const C=SPECS[i-FIRST];return C?C.price:0};
TRI.stat=i=>{const C=SPECS[i-FIRST];return C?C.stat:[0,1,1]};
TRI.rad=i=>{const C=SPECS[i-FIRST];return C?C.rad:1.1};
TRI.hgt=i=>{const C=SPECS[i-FIRST];return C?C.hgt:1.15};
TRI.isTri=i=>i>=FIRST&&i<FIRST+SPECS.length;
TRI.FIRST=FIRST;
TRI.N=SPECS.length;
TRI.len=k=>SPECS[k].S.NZ*2;
/* traffic: a static copy in one of the model's usual colours */
TRI.civ=(k,col)=>NC.cars[FIRST+k].inst(col);
TRI.pal=(k,r)=>{const p=SPECS[k].pal;return p[Math.floor(r*p.length)%p.length]};
TRI.geoK=k=>NC.cars[FIRST+k].geo();
TRI.mat=MAT;TRI.lit=lit;
window.TRI=TRI;

/* ---- gallery: one button per car ---- */
{const SHORT=['A6','GOLF','RANGE ROVER','MODEL 3','911','MINI','3 SERIES','TRANSIT','QASHQAI','TAXI','PRIUS'];
 const b0=document.querySelector('#galP button[data-g="car"]');
 if(b0){const row=b0.parentNode;TRI.ids.forEach((id,k)=>{const b=document.createElement('button');b.textContent=SHORT[k]||CARN[id];b.dataset.g='car';
  b.onclick=e=>{e.stopPropagation();setCar(id);for(const x of row.querySelectorAll('button[data-g="car"]'))x.classList.toggle('on',x===b)};row.appendChild(b)})}}

/* ---- black cab: fares pay 20% more (village taxi and Marlowe cab careers) ---- */
try{if(typeof crPay==='function'){const p0=crPay;crPay=function(k,base,msg){return p0(k,CARI===FIRST+9&&(k==='taxi'||k==='mcab')?base*1.2:base,msg)}}}catch(e){}

/* ---- village/town traffic: about half the small cars and some vans become fleet models ---- */
{const CARK=[0,1,2,3,4,5,6,8,10],hash=(o,n)=>{const v=Math.sin((o.x||0)*12.9898+(o.z||0)*78.233+n*37.719)*43758.5453;return v-Math.floor(v)};let n=0;
 const swap=o=>{n++;if(o.m===3||o.m>=10)return o;const r=hash(o,n);
  if((o.m===0||o.m===1)&&r<.55){const k=CARK[Math.floor(hash(o,n+7)*CARK.length)%CARK.length];o.m=10+k;o.col=TRI.pal(k,hash(o,n+13))}
  else if(o.m===2&&r<.4){o.m=10+7;o.col=TRI.pal(7,hash(o,n+13))}
  return o};
 if(typeof CIV!=='undefined')for(const o of CIV){const m=o.m;swap(o);if(o.m!==m&&o.inst){scene.remove(o.inst);o.inst=null}if(o.m!==m&&o.far){scene.remove(o.far);o.far=null}}
 try{if(typeof civAdd==='function'){const c0=civAdd;civAdd=function(o){return c0(swap(o))}}}catch(e){}}
})();
