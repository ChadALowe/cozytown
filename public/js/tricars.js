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
  if(G.bed&&b>=7&&inR(zm,G.bed))return 0x1c1d20;
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
 else if(p.cabEnd!=null){rK.push([p.cabEnd,yr1-.03],[p.cabEnd-.1,p.beltR-.12])}
 else for(const s of[.25,.5,.75,1])rK.push([p.rf1+(-NZ-p.rf1)*s,yr1+(p.tail-yr1)*Math.pow(s,p.tp==null?1.5:p.tp)]);
 const side=[p.sideB!=null?p.sideB:sal?p.rs0+.3:-NZ+.42,p.ws0-.03];
 const S={NZ,W0,ZF,ZB,R:p.R,RA:p.R+.039,TW:p.TW||.1275,rimR:p.rimR||p.R*.715,inset:p.inset||.125,wK,ybK,beltK:bK,roofK:rK,
  roofW:p.roofW||W0*.70,aw:p.aw||.07,crown:p.crown==null?.066:p.crown,p3y:p.p3y||yb+.27,lx:W0-.32,rearExtra:!sal,
  bendF:{from:NZ-.62,pull:.13*rd,rake:p.rakeF==null?.05:p.rakeF,y0:p.nose-.2,y1:p.nose+.1},
  bendR:p.rakeR||p.pullR?{from:-NZ+.55,pull:p.pullR==null?.08*rd:p.pullR,rake:p.rakeR||0,y0:(sal?p.deck:p.beltR)-.05,y1:sal?p.deck+.05:p.tail}:null,
  glass:{side,posts:p.posts||[],ws:[p.ws1,p.ws0+.02],rs:sal?[p.rs0,p.rf1]:p.rsGlass||null,sill:p.sill,pillars:p.pillars,roofCol:p.roofCol,bed:p.bed},
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

/* ================================================================ the big catalogue
   One line per car: real size + a body type + a brand style. typeGen() turns the size and
   type into a side profile; brandDeco() draws that brand's grille, lights and tail lights. */
const TYPES={/* f: front-overhang share, nose/cowl/deck/beltR/tail as fractions of height, a: windscreen base behind front axle (share of wheelbase),
               rk: windscreen run per rise, rl: roof length (share of length), R: wheel radius, d2: two doors */
 hatchS:{f:.52,nose:.48,cowl:.65,beltR:.69,tail:.82,yb:.11,a:.16,rk:1.25,rl:.26,R:.29,rakeR:.18,tp:.85,hatch:1},
 hatch:{f:.50,nose:.43,cowl:.63,beltR:.68,tail:.73,yb:.105,a:.20,rk:1.45,rl:.22,R:.31,rakeR:.30,tp:.85,hatch:1},
 estate:{f:.47,nose:.42,cowl:.62,beltR:.68,tail:.93,yb:.105,a:.29,rk:1.55,rl:.42,R:.33,rakeR:.07,tp:1.6,hatch:1},
 saloon:{f:.44,nose:.42,cowl:.63,deck:.69,yb:.105,a:.30,rk:1.6,rl:.21,rs:.15,R:.33,sal:1},
 coupe:{f:.44,nose:.43,cowl:.62,deck:.71,yb:.1,a:.34,rk:1.8,rl:.14,rs:.20,R:.34,sal:1,d2:1},
 gt:{f:.40,nose:.45,cowl:.64,deck:.73,yb:.1,a:.45,rk:1.8,rl:.12,rs:.19,R:.35,sal:1,d2:1,crown:.05},
 roadster:{f:.42,nose:.45,cowl:.66,deck:.73,yb:.1,a:.40,rk:1.6,rl:.08,rs:.10,R:.33,sal:1,d2:1,soft:1},
 super:{f:.42,nose:.33,cowl:.58,deck:.80,yb:.085,a:.03,rk:2.1,rl:.10,rs:.20,R:.35,sal:1,d2:1,crown:-.03,roofW:.60,q:.5,intakes:1},
 suvS:{f:.48,nose:.49,cowl:.64,beltR:.68,tail:.87,yb:.125,a:.25,rk:1.3,rl:.34,R:.33,rakeR:.18,tp:1.3,hatch:1,p3:.33},
 suv:{f:.47,nose:.50,cowl:.64,beltR:.69,tail:.90,yb:.13,a:.25,rk:1.3,rl:.40,R:.355,rakeR:.12,tp:1.4,hatch:1,p3:.35,round:.7},
 suvL:{f:.45,nose:.52,cowl:.65,beltR:.69,tail:.93,yb:.14,a:.25,rk:1.25,rl:.44,R:.385,rakeR:.07,tp:1.5,hatch:1,p3:.37,round:.55,roofW:.76},
 box4x4:{f:.40,nose:.55,cowl:.62,beltR:.64,tail:.97,yb:.14,a:.27,rk:.55,rl:.52,R:.385,rakeR:0,tp:1,hatch:1,p3:.36,round:.2,roofW:.86,spare:1},
 van:{f:.47,nose:.48,cowl:.57,beltR:.61,tail:.975,yb:.13,a:-.02,rk:1.4,rl:.55,R:.34,rakeR:.02,tp:1,hatch:1,p3:.28,round:.35,roofW:.86,van:1},
 vanL:{f:.33,nose:.40,cowl:.48,beltR:.50,tail:.98,yb:.11,a:-.06,rk:1.0,rl:.60,R:.36,rakeR:.01,tp:1,hatch:1,p3:.25,round:.25,roofW:.9,van:1},
 pickup:{f:.42,nose:.54,cowl:.64,beltR:.62,tail:.62,yb:.15,a:.20,rk:1.25,rl:.12,R:.38,hatch:1,p3:.36,round:.5,roofW:.78,pickup:1},
 classic:{f:.42,nose:.52,cowl:.66,beltR:.70,tail:.88,yb:.12,a:.22,rk:.95,rl:.28,R:.27,rakeR:.14,tp:1.2,hatch:1,round:1.2},
 classicSaloon:{f:.44,nose:.50,cowl:.64,deck:.70,yb:.12,a:.30,rk:1.1,rl:.20,rs:.12,R:.29,sal:1,round:1.2},
 gtclassic:{f:.40,nose:.42,cowl:.62,deck:.70,yb:.11,a:.52,rk:1.5,rl:.12,rs:.18,R:.33,sal:1,d2:1,round:1.2},
 roadsterClassic:{f:.42,nose:.50,cowl:.68,deck:.72,yb:.12,a:.42,rk:1.2,rl:.08,rs:.10,R:.30,sal:1,d2:1,soft:1,round:1.2}};

function typeGen(T,c){const L=c.L,W=c.W,H=c.H,WB=c.WB,NZ=L/2,ZF=NZ-(L-WB)*T.f,ZB=ZF-WB,R=c.R||T.R,yb=H*(T.yb||.11);
 const nose=H*T.nose,cowl=H*T.cowl,ws0=ZF-T.a*WB,ws1=ws0-(H-.04-cowl)*T.rk,zpk=ws1-.12*L,rf1=Math.max(ws1-T.rl*L,-NZ+.35);
 const p={L,W,H,WB,fo:NZ-ZF,R,yb,nose,cowl,ws0,ws1,zpk:Math.max(zpk,(ws1+rf1)/2),rf1,rfd:.04,q:T.q,crown:T.crown,round:T.round,roofW:T.roofW?W/2*T.roofW:null,p3y:T.p3?H*T.p3:null,rim:c.rim,sill:c.sill};
 if(T.sal){p.type='saloon';p.deck=H*T.deck;p.rs0=Math.max(rf1-T.rs*L*(T.soft?.6:1),-NZ+.30);if(T.d2)p.posts=[];else{const bp=(ws1+rf1)/2+.02;p.posts=[[bp-.05,bp+.05]]}}
 else{p.type='hatch';p.beltR=H*T.beltR;p.tail=H*T.tail;p.rakeR=T.rakeR;p.pullR=.08*(T.round==null?1:T.round);p.tp=T.tp;
  if(T.van){p.sideB=ws1-.5;p.posts=[]}
  else if(T.pickup){p.cabEnd=ws1-.95;p.rf1=p.cabEnd+.12;p.zpk=(ws1+p.rf1)/2;p.sideB=p.cabEnd+.05;p.bed=[-NZ-.1,p.cabEnd-.08];p.rsGlass=[p.cabEnd-.1,p.cabEnd+.01];const bp=(ws1+p.cabEnd)/2;p.posts=[[bp-.05,bp+.05]]}
  else{p.sideB=-NZ+(T.tail>.9?.45:.55);const bp=(ws1+rf1)/2+.1;p.posts=[[bp-.05,bp+.05]];if(T.tail>.85&&!c.d2)p.posts.push([p.sideB+.32,p.sideB+.36])}}
 if(T.soft)p.roofCol=0x1a1a1c;
 if(c.pillars)p.pillars=1;if(c.roofCol!=null)p.roofCol=c.roofCol;
 return p}

/* brand looks: grille g, headlight h, tail light t (+ chrome-bumper classics) */
const BRAND={audi:{g:'single',h:'slim',t:'wedgeBar'},bmw:{g:'kidney',h:'angled',t:'L'},merc:{g:'wide',h:'angled',t:'wedge'},vw:{g:'slot',h:'slim',t:'wedge'},
 ford:{g:'trap',h:'swept',t:'wedge'},vauxhall:{g:'vizor',h:'inVizor',t:'slim'},toyota:{g:'lowbig',h:'hammer',t:'bar'},honda:{g:'slot',h:'slim',t:'wedge'},
 nissan:{g:'vmotion',h:'boomerang',t:'wedge'},kia:{g:'tiger',h:'swept',t:'vertical'},hyundai:{g:'cascade',h:'pixel',t:'bar'},mazda:{g:'wing',h:'slim',t:'round2'},
 skoda:{g:'square',h:'swept',t:'wedge'},seat:{g:'trap',h:'slim',t:'bar'},renault:{g:'wide',h:'cshape',t:'wedge'},peugeot:{g:'wide',h:'fang',t:'claw'},
 citroen:{g:'slot',h:'split',t:'wedge'},dacia:{g:'wide',h:'swept',t:'vertical'},fiat:{g:'small',h:'round',t:'round'},suzuki:{g:'wide',h:'swept',t:'wedge'},
 mg:{g:'wide',h:'swept',t:'wedge'},volvo:{g:'square',h:'thor',t:'vertical'},tesla:{g:'none',h:'slim',t:'wedge'},polestar:{g:'none',h:'thor',t:'bar'},
 byd:{g:'none',h:'swept',t:'bar'},porsche:{g:'none',h:'round',t:'bar'},ferrari:{g:'super',h:'slim',t:'round2'},lambo:{g:'super',h:'yshape',t:'wedge'},
 mclaren:{g:'super',h:'hammer2',t:'slim'},bugatti:{g:'horseshoe',h:'quadRound',t:'bar'},aston:{g:'trap',h:'swept',t:'bar'},bentley:{g:'matrix',h:'quadRound',t:'oval'},
 rolls:{g:'tall',h:'slimRect',t:'vertical'},jeep:{g:'seven',h:'round',t:'square'},isuzu:{g:'wide',h:'swept',t:'vertical'},
 classicmini:{g:'classicbar',h:'round',t:'square',chrome:1},jagclassic:{g:'oval',h:'round',t:'round',chrome:1},mgclassic:{g:'classicbar',h:'round',t:'round',chrome:1},
 triumphc:{g:'classicbar',h:'round',t:'round',chrome:1},morris:{g:'classicbar',h:'round',t:'round',chrome:1},fordc:{g:'classicbar',h:'quadRound',t:'square',chrome:1},
 astonc:{g:'trap',h:'round',t:'round',chrome:1},lrc:{g:'rect',h:'round',t:'square'}};

function brandDeco(B,P,T){const W0=P.W/2,NZ=P.L/2,yF0=P.yb+.09,yF1=P.nose,yR0=P.yb+.16,yR1=(T.sal?P.deck-.05:P.beltR-.04);
 const F=(u,v)=>[u*W0,yF0+v*(yF1-yF0)],Rr=(u,v)=>[u*W0,yR0+v*(yR1-yR0)],fp=a=>a.map(q=>F(q[0],q[1])),rp=a=>a.map(q=>Rr(q[0],q[1]));
 return D=>{const{decal,both,sides,plate,circ,shrink}=D;const bx=(a,b)=>[[a[0],a[1]],[b[0],a[1]],[b[0],b[1]],[a[0],b[1]]];
  const grille=(poly,col,sur,slat,vert)=>{if(sur!==false)decal('z',1,fp(poly),sur||0x55585e,1);decal('z',1,shrink(fp(poly),.92),col||0x0f1012,2);
   if(slat){const P_=fp(poly),ys=P_.map(q=>q[1]),xs=P_.map(q=>q[0]),y0=Math.min(...ys),y1=Math.max(...ys),x1=Math.max(...xs)*.8;
    if(vert)for(let x=-x1;x<x1;x+=slat)decal('z',1,rect(x,y0+.03,x+.012,y1-.03),B.slatCol||0x3a3d42,3);else for(let y=y0+.035;y<y1-.025;y+=slat)decal('z',1,rect(-x1,y,x1,y+.012),B.slatCol||0x34373c,3)}};
  /* chrome bumpers for classics */
  if(B.chrome){decal('z',1,fp(bx([-1.05,.0],[1.05,.13])),0xc8ccd2,0);decal('z',-1,rp(bx([-1.05,.0],[1.05,.14])),0xc8ccd2,0)}
  else{decal('z',1,fp(bx([-1.05,-.05],[1.05,.06])),0x1a1b1e,0);decal('z',-1,rp(bx([-1.05,-.08],[1.05,.06])),0x1a1b1e,0)}
  if(T.pickup||T.van||T.spare)decal('z',1,fp(bx([-1.05,-.05],[1.05,.22])),0x1e1f22,0);
  /* grille */
  const g=B.g;
  if(g==='single'){grille([[-.42,.92],[.42,.92],[.50,.80],[.48,.30],[.38,.12],[-.38,.12],[-.48,.30],[-.50,.80]],0,0x55585e,.055)}
  else if(g==='kidney'){for(const s of[1,-1]){const k=[[.03,.42],[.23,.42],[.26,.48],[.26,.86],[.22,.92],[.03,.92]].map(q=>[q[0]*s,q[1]]);decal('z',1,fp(s>0?k:k.reverse()),0xb4b8be,1);decal('z',1,shrink(fp(s>0?k:k.slice().reverse()),.86),0x0f1012,2)}
   decal('z',1,fp([[-.42,.12],[.42,.12],[.46,.30],[-.46,.30]]),0x111214,1)}
  else if(g==='wide'){grille([[-.52,.60],[.52,.60],[.52,.90],[-.52,.90]],0,0x6a6e74,.05);decal('z',1,fp([[-.45,.10],[.45,.10],[.5,.34],[-.5,.34]]),0x111214,1)}
  else if(g==='slot'){decal('z',1,fp([[-.62,.82],[.62,.82],[.60,.90],[-.60,.90]]),0x111214,1);grille([[-.46,.10],[.46,.10],[.54,.44],[-.54,.44]],0x111214,false,.05)}
  else if(g==='trap'){grille([[-.44,.88],[.44,.88],[.38,.40],[-.38,.40]],0,0x6a6e74,.05);decal('z',1,fp([[-.5,.10],[.5,.10],[.52,.26],[-.52,.26]]),0x111214,1)}
  else if(g==='vizor'){decal('z',1,fp([[-.95,.70],[.95,.70],[.93,.95],[-.93,.95]]),0x101113,1);decal('z',1,fp([[-.44,.12],[.44,.12],[.48,.34],[-.48,.34]]),0x111214,1)}
  else if(g==='lowbig'){decal('z',1,fp([[-.5,.86],[.5,.86],[.48,.92],[-.48,.92]]),0x111214,1);grille([[-.50,.10],[.50,.10],[.58,.50],[-.58,.50]],0x111214,false,.055)}
  else if(g==='vmotion'){grille([[-.48,.88],[.48,.88],[.36,.40],[-.36,.40]],0x141518,0xb4b8be,.05);decal('z',1,fp([[-.5,.10],[.5,.10],[.52,.30],[-.52,.30]]),0x111214,1)}
  else if(g==='tiger'){grille([[-.30,.88],[.30,.88],[.34,.76],[.28,.62],[-.28,.62],[-.34,.76]],0x121315,0x6a6e74,.045);decal('z',1,fp([[-.46,.10],[.46,.10],[.5,.38],[-.5,.38]]),0x111214,1)}
  else if(g==='cascade'){grille([[-.5,.86],[.5,.86],[.56,.6],[.44,.18],[-.44,.18],[-.56,.6]],0x141518,0x3a3d42,.045)}
  else if(g==='wing'){grille([[-.40,.84],[.40,.84],[.47,.62],[.36,.28],[-.36,.28],[-.47,.62]],0x141518,false,.05);decal('z',1,fp([[-.46,.80],[.46,.80],[.6,.86],[-.6,.86]]),0xb4b8be,3)}
  else if(g==='square'){grille([[-.34,.92],[.34,.92],[.34,.46],[-.34,.46]],0x141518,0x8a8e94,.045,1);decal('z',1,fp([[-.5,.10],[.5,.10],[.52,.30],[-.52,.30]]),0x111214,1)}
  else if(g==='rect'){grille([[-.50,.58],[.50,.58],[.50,.92],[-.50,.92]],0x15161a,0x3a3d42,.045)}
  else if(g==='tall'){grille([[-.27,1.02],[.27,1.02],[.27,.36],[-.27,.36]],0xc8ccd2,0xdde0e4,.04,1)}
  else if(g==='matrix'){grille([[-.36,.96],[.36,.96],[.40,.40],[-.40,.40]],0x2a2c30,0xc8ccd2,.04);grille([[-.36,.96],[.36,.96],[.40,.40],[-.40,.40]],0x2a2c30,false,.06,1)}
  else if(g==='none'){decal('z',1,fp([[-.40,.10],[.40,.10],[.44,.28],[-.44,.28]]),0x111214,1)}
  else if(g==='small'){decal('z',1,fp([[-.25,.28],[.25,.28],[.28,.40],[-.28,.40]]),0x111214,1)}
  else if(g==='super'){decal('z',1,fp([[-.36,.06],[.36,.06],[.40,.30],[-.40,.30]]),0x0f1012,1);both('z',1,fp([[.52,.02],[.92,.02],[.96,.46],[.58,.40]]),0x0f1012,1)}
  else if(g==='horseshoe'){grille([[-.16,.80],[.16,.80],[.18,.40],[.10,.24],[-.10,.24],[-.18,.40]],0x0f1012,0xc8ccd2,.03);both('z',1,fp([[.40,.06],[.90,.06],[.94,.40],[.46,.36]]),0x0f1012,1)}
  else if(g==='seven'){for(let k=-3;k<=3;k++){const u=k*.11;decal('z',1,fp([[u-.035,.48],[u+.035,.48],[u+.035,.90],[u-.035,.90]]),0x111214,1)}}
  else if(g==='classicbar'){grille([[-.30,.40],[.30,.40],[.30,.80],[-.30,.80]],0x2a2c30,0xc8ccd2,.045)}
  else if(g==='oval'){decal('z',1,fp(circ(0,.42,.22,.16,16)),0xc8ccd2,1);decal('z',1,shrink(fp(circ(0,.42,.22,.16,16)),.85),0x111214,2)}
  /* headlights */
  const h=B.h,lamp=(poly,col)=>{both('z',1,fp(poly),col||0x262b31,1);both('z',1,shrink(fp(poly),.78,.003),0x9aa6b0,2)},
   drl=poly=>both('z',1,fp(poly),0xf4f8ff,3),rnd=(u,v,r)=>{const c=F(u,v),R=r*W0;both('z',1,circ(c[0],c[1],R*1.15,R*1.15),B.chrome?0xc8ccd2:0x2a2c30,1);both('z',1,circ(c[0],c[1],R,R),0xb8c4ce,2);both('z',1,circ(c[0],c[1],R*.45,R*.45),0xf4f8ff,3)};
  if(h==='slim'){lamp([[.50,.84],[.88,.82],[.93,.90],[.88,.97],[.52,.95]]);drl([[.54,.85],[.86,.83],[.87,.86],[.55,.88]])}
  else if(h==='angled'){lamp([[.34,.78],[.82,.74],[.91,.84],[.84,.95],[.38,.92]]);drl([[.40,.80],[.80,.77],[.82,.80],[.42,.83]])}
  else if(h==='swept'){lamp([[.46,.76],[.86,.78],[.95,.90],[.84,.98],[.50,.90]]);drl([[.52,.78],[.84,.80],[.86,.83],[.54,.81]])}
  else if(h==='inVizor'){both('z',1,fp([[.62,.76],[.88,.78],[.88,.90],[.62,.88]]),0xa8b4c0,3);drl([[.62,.74],[.88,.76],[.88,.78],[.62,.76]])}
  else if(h==='hammer'){lamp([[.44,.84],[.90,.86],[.93,.94],[.46,.93]]);drl([[.80,.6],[.84,.6],[.88,.85],[.84,.85]])}
  else if(h==='boomerang'){lamp([[.52,.80],[.90,.82],[.93,.94],[.56,.92]]);drl([[.86,.5],[.90,.5],[.92,.82],[.88,.82]])}
  else if(h==='pixel'){lamp([[.56,.80],[.92,.80],[.92,.93],[.56,.93]]);for(let k=0;k<4;k++)drl(bx([.6+k*.08,.83],[.65+k*.08,.88]))}
  else if(h==='round'){rnd(.66,.74,.12)}
  else if(h==='quadRound'){rnd(.52,.76,.09);rnd(.76,.76,.11)}
  else if(h==='fang'){lamp([[.52,.82],[.88,.82],[.92,.92],[.56,.94]]);drl([[.78,.40],[.82,.40],[.86,.80],[.82,.80]])}
  else if(h==='split'){drl([[.50,.90],[.90,.90],[.90,.95],[.50,.95]]);lamp([[.60,.58],[.86,.58],[.86,.72],[.60,.72]])}
  else if(h==='thor'){lamp([[.52,.78],[.90,.78],[.92,.94],[.54,.94]]);drl(bx([.58,.85],[.86,.87]));drl(bx([.70,.80],[.72,.92]))}
  else if(h==='slimRect'){lamp([[.56,.80],[.92,.80],[.92,.96],[.56,.96]]);drl(bx([.58,.81],[.90,.83]))}
  else if(h==='yshape'){lamp([[.50,.78],[.95,.86],[.86,.98],[.56,.92]]);drl([[.60,.84],[.84,.88],[.80,.91],[.60,.87]])}
  else if(h==='hammer2'){lamp([[.58,.70],[.92,.80],[.90,.96],[.56,.88]]);drl([[.62,.76],[.70,.76],[.70,.86],[.62,.84]])}
  else if(h==='cshape'){lamp([[.52,.80],[.90,.80],[.92,.94],[.54,.94]]);drl(bx([.84,.45],[.88,.80]))}
  /* plates, lower intakes */
  if(!T.van&&!T.pickup&&g!=='super'&&g!=='horseshoe')both('z',1,fp([[.56,.10],[.80,.12],[.84,.34],[.60,.32]]),0x131416,1);
  plate('z',1,F(0,.30)[1],F(0,.30)[1]+.11,0xeeeeea);
  /* rear */
  const t=B.t,tl=(poly,c2)=>{both('z',-1,rp(poly),0x6d0a10,1);both('z',-1,shrink(rp(poly),.8),c2||0xc31a26,2)},rr=(u,v,r)=>{const c=Rr(u,v),R=r*W0;both('z',-1,circ(c[0],c[1],R*1.12,R*1.12),B.chrome?0xc8ccd2:0x2a2c30,1);both('z',-1,circ(c[0],c[1],R,R),0xc31a26,2)};
  if(t==='wedge'||t==='wedgeBar'){tl([[.40,.70],[.88,.72],[.95,.86],[.88,.98],[.44,.95]]);if(t==='wedgeBar')decal('z',-1,rp(bx([-.40,.80],[.40,.86])),0xc8ccd2,1)}
  else if(t==='L'){tl(bx([.44,.80],[.92,.98]));tl(bx([.80,.56],[.92,.80]))}
  else if(t==='bar'){decal('z',-1,rp(bx([-.92,.80],[.92,.90])),0xc31a26,1);decal('z',-1,rp(bx([-.90,.83],[.90,.87])),0xff4d58,2)}
  else if(t==='vertical'){tl(bx([.80,.42],[.95,.99]))}
  else if(t==='round'){rr(.72,.76,.09)}
  else if(t==='round2'){rr(.56,.78,.08);rr(.80,.78,.08)}
  else if(t==='slim'){tl([[.45,.84],[.92,.86],[.95,.95],[.47,.94]])}
  else if(t==='claw'){tl(bx([.50,.72],[.92,.96]));for(let k=0;k<3;k++)both('z',-1,rp(bx([.56+k*.12,.76],[.62+k*.12,.92])),0xff4d58,3)}
  else if(t==='square'){tl(bx([.70,.55],[.92,.85]))}
  else if(t==='oval'){both('z',-1,rp(circ(.72,.78,.18,.12)),0x6d0a10,1);both('z',-1,shrink(rp(circ(.72,.78,.18,.12)),.8),0xc31a26,2)}
  const rpY=T.sal?Rr(0,.45)[1]:Rr(0,.30)[1];plate('z',-1,rpY,rpY+.11,0xf0c418);
  if(T.hatch&&!T.pickup){const a=W0*(T.van?.82:.64),b2=W0*(T.van?.80:.54),y0=P.beltR+.03,y1=P.tail-.07;if(y1-y0>.12){if(T.van){both('z',-1,[[.05,y0+.05],[a,y0+.05],[b2,y1],[.05,y1]],WSC,1);decal('z',-1,rect(-.008,yR0,.008,P.tail-.03),0x1b1c1f,1)}else decal('z',-1,[[-a,y0],[a,y0],[b2,y1],[-b2,y1]],WSC,1)}}
  if(T.intakes)sides([[P.ZB+P.R+.1,P.yb+.25],[P.ZB+P.R+.85,P.yb+.25],[P.ZB+P.R+.85,P.deck-.2],[P.ZB+P.R+.3,P.deck-.25]],0x0f1012,1);
  /* doors, handles, sills */
  const ZF=NZ-P.fo,ZB=ZF-P.WB,RA=P.R+.039,d0=P.ws0-.06;let doors;
  if(T.van)doors=[d0,P.ws1-.45,ZB+RA+.15];else if(T.d2)doors=[d0,(P.ws1+P.rf1)/2-.25];else{const bp=P.posts&&P.posts[0]?(P.posts[0][0]+P.posts[0][1])/2:(P.ws1+P.rf1)/2;doors=[d0,bp,Math.min(ZB+RA+.05,bp-.85)]}
  for(const z of doors)sides(rect(z-.0035,P.yb+.13,z+.0035,D.beltAt(z)-.005),0x1b1c1f,1);
  for(let k=1;k<doors.length;k++){const z=doors[k]+.06;sides(rect(z,D.beltAt(z)-.10,z+.16,D.beltAt(z)-.078),0x55595f,1)}
  sides(rect(ZB+RA+.02,P.yb+.01,ZF-RA-.02,P.yb+.10),B.chrome?0xc8ccd2:0x26272b,1)}}

/* spare wheel on the back door of the boxy 4x4s */
const spareX=P=>D=>{const NZ=D.NZ,y=P.beltR*.82,r=P.R*.95;const L=[];for(let i=0;i<16;i++){const a=i/16*6.2832;L.push([r*Math.cos(a),y+r*Math.sin(a)])}D.decal('z',-1,L,0x18181b,4);D.decal('z',-1,L.map(q=>[q[0]*.55,y+(q[1]-y)*.55]),0x8a8e94,5)};

const RIMS={silver:{n:5,col:0xb8bdc3},twin:{n:5,col:0xc0c4c9,twin:true},dark:{n:5,col:0x3a3d42,twin:true,lip:0x55585e},fine:{n:10,col:0x9aa0a6,twin:false,w0:.012,w1:.009},
 super:{n:10,col:0x2a2c30,twin:false,w0:.013,w1:.01,lip:0x3a3c40},y:{n:6,col:0xb8bdc3,twin:true},steel:{n:4,col:0xd0d4d8,twin:false,w0:.05,w1:.05,hub:0xdde0e4,cap:0xc8ccd2},
 offroad:{n:6,col:0x55585e,twin:false,w0:.024,w1:.02,hub:0x3a3c40},wire:{n:16,col:0xd8dce0,twin:false,w0:.006,w1:.004,hub:0xc8ccd2}};
const PAL={every:[[.92,.92,.93],[.08,.08,.09],[.45,.47,.5],[.72,.74,.76],[.12,.24,.5],[.62,.06,.08]],
 prem:[[.06,.06,.07],[.92,.92,.93],[.36,.38,.41],[.1,.14,.28],[.68,.7,.72]],
 super:[[.78,.05,.05],[.95,.76,.08],[.92,.42,.06],[.18,.5,.22],[.94,.94,.95],[.06,.06,.07]],
 classic:[[.92,.88,.76],[.06,.24,.14],[.66,.06,.06],[.58,.72,.82],[.08,.1,.22]],
 trade:[[.95,.95,.95],[.95,.95,.95],[.72,.74,.76],[.08,.08,.09],[.1,.2,.42]],
 ev:[[.94,.94,.95],[.08,.08,.09],[.4,.42,.45],[.16,.3,.5],[.7,.08,.1]]};

/* key, name, brand, type, length, width, height, wheelbase, price, performance 0-11, palette, extra */
const CAT=[
 // ---- BUDGET WHEELS
 ['fiat500','FIAT 500','fiat','hatchS',3.571,1.627,1.488,2.300,140,2,'every',{rim:'silver'}],
 ['panda','FIAT PANDA','fiat','hatchS',3.686,1.672,1.551,2.300,120,1,'every'],
 ['sandero','DACIA SANDERO','dacia','hatch',4.088,1.848,1.499,2.604,130,2,'every'],
 ['picanto','KIA PICANTO','kia','hatchS',3.595,1.595,1.485,2.400,125,2,'every'],
 ['i10','HYUNDAI i10','hyundai','hatchS',3.670,1.680,1.480,2.425,130,2,'every'],
 ['aygox','TOYOTA AYGO X','toyota','hatchS',3.700,1.740,1.510,2.430,150,2,'every'],
 ['up','VW UP!','vw','hatchS',3.600,1.645,1.504,2.420,120,2,'every'],
 ['swift','SUZUKI SWIFT','suzuki','hatchS',3.860,1.735,1.495,2.450,150,3,'every'],
 ['corsa','VAUXHALL CORSA','vauxhall','hatch',4.060,1.765,1.435,2.538,170,3,'every'],
 ['clio','RENAULT CLIO','renault','hatch',4.050,1.798,1.440,2.583,175,3,'every'],
 ['p208','PEUGEOT 208','peugeot','hatch',4.055,1.745,1.430,2.540,180,3,'every'],
 ['c3','CITROEN C3','citroen','hatch',3.996,1.749,1.474,2.540,160,2,'every'],
 ['fabia','SKODA FABIA','skoda','hatch',4.108,1.780,1.459,2.564,160,3,'every'],
 ['mg3','MG3','mg','hatch',4.113,1.797,1.502,2.570,155,2,'every'],
 ['micra','NISSAN MICRA','nissan','hatch',3.999,1.743,1.455,2.525,140,2,'every'],
 ['polo','VW POLO','vw','hatch',4.074,1.751,1.451,2.552,190,3,'every'],
 ['yaris','TOYOTA YARIS','toyota','hatch',3.940,1.745,1.500,2.560,190,3,'every'],
 ['jazz','HONDA JAZZ','honda','hatchS',4.044,1.694,1.526,2.517,190,2,'every'],
 // ---- FAMILY MOTORS (European)
 ['focus','FORD FOCUS','ford','hatch',4.378,1.825,1.454,2.700,240,4,'every'],
 ['puma','FORD PUMA','ford','suvS',4.207,1.805,1.537,2.588,250,4,'every'],
 ['kuga','FORD KUGA','ford','suv',4.614,1.883,1.666,2.710,320,4,'every'],
 ['astra','VAUXHALL ASTRA','vauxhall','hatch',4.374,1.860,1.470,2.675,250,4,'every'],
 ['mokka','VAUXHALL MOKKA','vauxhall','suvS',4.151,1.791,1.532,2.557,240,3,'every',{pillars:1,roofCol:0x111214}],
 ['octavia','SKODA OCTAVIA ESTATE','skoda','estate',4.689,1.829,1.468,2.686,280,4,'every'],
 ['kodiaq','SKODA KODIAQ','skoda','suv',4.758,1.864,1.659,2.791,380,4,'every',{rim:'twin'}],
 ['tiguan','VW TIGUAN','vw','suv',4.539,1.842,1.639,2.680,380,4,'every',{rim:'twin'}],
 ['passat','VW PASSAT ESTATE','vw','estate',4.917,1.852,1.506,2.841,390,4,'prem',{rim:'twin'}],
 ['leon','SEAT LEON','seat','hatch',4.368,1.800,1.456,2.686,260,5,'every',{rim:'dark'}],
 ['p3008','PEUGEOT 3008','peugeot','suv',4.542,1.895,1.641,2.739,340,4,'every',{pillars:1,roofCol:0x111214}],
 ['captur','RENAULT CAPTUR','renault','suvS',4.239,1.797,1.576,2.639,230,3,'every',{roofCol:0x111214}],
 ['duster','DACIA DUSTER','dacia','suv',4.343,1.813,1.656,2.657,200,3,'every',{rim:'offroad'}],
 ['xc40','VOLVO XC40','volvo','suvS',4.440,1.863,1.652,2.702,380,5,'prem',{roofCol:0xeeeeec}],
 ['xc90','VOLVO XC90','volvo','suvL',4.953,1.958,1.776,2.984,650,5,'prem',{rim:'twin'}],
 // ---- FAR EAST AUTOS
 ['corolla','TOYOTA COROLLA','toyota','hatch',4.370,1.790,1.435,2.640,280,4,'every'],
 ['rav4','TOYOTA RAV4','toyota','suv',4.600,1.855,1.685,2.690,370,4,'every',{rim:'dark'}],
 ['yariscross','TOYOTA YARIS CROSS','toyota','suvS',4.180,1.765,1.590,2.560,250,3,'every'],
 ['civic','HONDA CIVIC','honda','hatch',4.551,1.802,1.408,2.734,320,5,'every'],
 ['crv','HONDA CR-V','honda','suv',4.706,1.866,1.681,2.700,420,4,'every'],
 ['juke','NISSAN JUKE','nissan','suvS',4.210,1.800,1.593,2.636,230,4,'every',{pillars:1,roofCol:0x111214}],
 ['xtrail','NISSAN X-TRAIL','nissan','suv',4.680,1.840,1.725,2.705,400,4,'every'],
 ['sportage','KIA SPORTAGE','kia','suv',4.515,1.865,1.645,2.680,330,4,'every',{pillars:1}],
 ['ceed','KIA CEED','kia','hatch',4.310,1.800,1.447,2.650,240,4,'every'],
 ['tucson','HYUNDAI TUCSON','hyundai','suv',4.500,1.865,1.650,2.680,330,4,'every'],
 ['kona','HYUNDAI KONA','hyundai','suvS',4.350,1.825,1.580,2.660,280,4,'every'],
 ['mazda3','MAZDA 3','mazda','hatch',4.460,1.795,1.435,2.725,270,4,'every'],
 ['cx5','MAZDA CX-5','mazda','suv',4.575,1.845,1.680,2.700,340,4,'every'],
 ['gr86','TOYOTA GR86','toyota','coupe',4.265,1.775,1.310,2.575,320,7,'super',{rim:'dark'}],
 ['supra','TOYOTA GR SUPRA','toyota','coupe',4.379,1.854,1.292,2.470,560,8,'super',{rim:'dark'}],
 ['civicr','HONDA CIVIC TYPE R','honda','hatch',4.594,1.890,1.407,2.735,480,8,'super',{rim:'dark'}],
 // ---- PRESTIGE GERMANY
 ['aclass','MERCEDES A-CLASS','merc','hatch',4.419,1.796,1.440,2.729,320,5,'prem',{rim:'twin'}],
 ['cclass','MERCEDES C-CLASS','merc','saloon',4.751,1.820,1.438,2.865,450,5,'prem',{rim:'twin'}],
 ['eclass','MERCEDES E-CLASS','merc','saloon',4.949,1.880,1.468,2.961,600,6,'prem',{rim:'twin'}],
 ['sclass','MERCEDES S-CLASS','merc','saloon',5.179,1.921,1.503,3.106,1050,7,'prem',{rim:'fine'}],
 ['gclass','MERCEDES G-CLASS','merc','box4x4',4.873,1.984,1.969,2.890,1400,6,'prem',{rim:'dark'}],
 ['glc','MERCEDES GLC','merc','suv',4.716,1.890,1.640,2.888,550,5,'prem',{rim:'twin'}],
 ['bmw1','BMW 1 SERIES','bmw','hatch',4.361,1.800,1.459,2.670,300,5,'prem',{rim:'twin'}],
 ['bmw5','BMW 5 SERIES','bmw','saloon',5.060,1.900,1.515,2.995,600,6,'prem',{rim:'twin'}],
 ['x5','BMW X5','bmw','suvL',4.922,2.004,1.745,2.975,750,6,'prem',{rim:'y'}],
 ['m4','BMW M4','bmw','coupe',4.794,1.887,1.393,2.857,800,9,'super',{rim:'dark'}],
 ['z4','BMW Z4','bmw','roadster',4.324,1.864,1.304,2.470,500,7,'prem',{rim:'twin'}],
 ['a3','AUDI A3','audi','hatch',4.343,1.816,1.449,2.636,300,5,'prem',{rim:'twin'}],
 ['q5','AUDI Q5','audi','suv',4.682,1.893,1.662,2.819,520,5,'prem',{rim:'twin'}],
 ['rs6','AUDI RS6 AVANT','audi','estate',4.995,1.951,1.460,2.928,1000,9,'prem',{rim:'dark'}],
 ['tt','AUDI TT','audi','coupe',4.191,1.832,1.353,2.505,400,7,'prem',{rim:'twin'}],
 ['cayenne','PORSCHE CAYENNE','porsche','suvL',4.930,1.983,1.698,2.895,800,7,'prem',{rim:'twin'}],
 ['taycan','PORSCHE TAYCAN','porsche','saloon',4.963,1.966,1.379,2.900,850,9,'super',{rim:'dark'}],
 ['macan','PORSCHE MACAN','porsche','suv',4.726,1.922,1.622,2.807,600,7,'prem',{rim:'twin'}],
 ['boxster','PORSCHE BOXSTER','porsche','roadster',4.379,1.801,1.281,2.475,650,8,'super',{rim:'twin'}],
 ['golfgti','VW GOLF GTI','vw','hatch',4.289,1.789,1.471,2.627,350,7,'every',{rim:'dark'}],
 // ---- ELECTRIC AVENUE
 ['modely','TESLA MODEL Y','tesla','suvS',4.751,1.921,1.624,2.890,500,7,'ev',{rim:'dark',roofCol:0x1a222c}],
 ['models','TESLA MODEL S','tesla','saloon',4.970,1.964,1.445,2.960,850,9,'ev',{rim:'dark',roofCol:0x1a222c}],
 ['polestar2','POLESTAR 2','polestar','saloon',4.606,1.859,1.479,2.735,480,7,'ev',{rim:'twin'}],
 ['leaf','NISSAN LEAF','nissan','hatch',4.490,1.791,1.540,2.700,280,3,'ev'],
 ['ev6','KIA EV6','kia','suvS',4.695,1.890,1.550,2.900,450,7,'ev',{rim:'dark'}],
 ['ioniq5','HYUNDAI IONIQ 5','hyundai','suvS',4.635,1.890,1.605,3.000,450,6,'ev',{rim:'fine'}],
 ['atto3','BYD ATTO 3','byd','suvS',4.455,1.875,1.615,2.720,360,5,'ev'],
 ['mg4','MG4','mg','hatch',4.287,1.836,1.504,2.705,270,5,'ev',{rim:'dark'}],
 ['id3','VW ID.3','vw','hatch',4.261,1.809,1.568,2.770,350,4,'ev',{rim:'dark'}],
 ['zoe','RENAULT ZOE','renault','hatchS',4.087,1.787,1.562,2.588,240,2,'ev'],
 ['i4','BMW i4','bmw','saloon',4.783,1.852,1.448,2.856,580,7,'ev',{rim:'twin'}],
 // ---- SUPERCAR SALON
 ['f296','FERRARI 296 GTB','ferrari','super',4.565,1.958,1.187,2.600,2400,10,'super',{rim:'super'}],
 ['sf90','FERRARI SF90','ferrari','super',4.710,1.972,1.186,2.650,3800,10,'super',{rim:'super'}],
 ['roma','FERRARI ROMA','ferrari','gt',4.656,1.974,1.301,2.670,1900,9,'super',{rim:'fine'}],
 ['huracan','LAMBORGHINI HURACAN','lambo','super',4.520,1.933,1.165,2.620,2200,10,'super',{rim:'super'}],
 ['revuelto','LAMBORGHINI REVUELTO','lambo','super',4.947,2.033,1.160,2.779,4500,11,'super',{rim:'super'}],
 ['urus','LAMBORGHINI URUS','lambo','suvL',5.112,2.016,1.638,3.003,1900,9,'super',{rim:'super'}],
 ['m750s','McLAREN 750S','mclaren','super',4.569,1.930,1.196,2.670,2500,10,'super',{rim:'super'}],
 ['artura','McLAREN ARTURA','mclaren','super',4.539,1.976,1.193,2.640,1900,9,'super',{rim:'super'}],
 ['db12','ASTON MARTIN DB12','aston','gt',4.725,1.980,1.295,2.805,1900,9,'super',{rim:'fine'}],
 ['vantage','ASTON MARTIN VANTAGE','aston','gt',4.495,1.980,1.275,2.705,1650,9,'super',{rim:'dark'}],
 ['contgt','BENTLEY CONTINENTAL GT','bentley','gt',4.850,1.966,1.405,2.851,1900,8,'prem',{rim:'fine'}],
 ['bentayga','BENTLEY BENTAYGA','bentley','suvL',5.125,1.998,1.728,2.995,1700,7,'prem',{rim:'fine'}],
 ['phantom','ROLLS-ROYCE PHANTOM','rolls','saloon',5.762,2.018,1.646,3.552,4600,6,'prem',{rim:'fine',R:.40}],
 ['cullinan','ROLLS-ROYCE CULLINAN','rolls','suvL',5.341,2.000,1.835,3.295,3400,6,'prem',{rim:'fine'}],
 ['chiron','BUGATTI CHIRON','bugatti','super',4.544,2.038,1.212,2.711,25000,11,'super',{rim:'super'}],
 // ---- BRITISH CLASSICS
 ['mini59','CLASSIC MINI','classicmini','classic',3.054,1.410,1.346,2.036,150,2,'classic',{rim:'steel',R:.25,roofCol:0xeeeeea}],
 ['etype','JAGUAR E-TYPE','jagclassic','gtclassic',4.453,1.657,1.226,2.438,1500,7,'classic',{rim:'wire'}],
 ['mgb','MG B ROADSTER','mgclassic','roadsterClassic',3.890,1.520,1.250,2.310,350,3,'classic',{rim:'wire'}],
 ['spitfire','TRIUMPH SPITFIRE','triumphc','roadsterClassic',3.785,1.450,1.200,2.110,300,3,'classic',{rim:'steel'}],
 ['minor','MORRIS MINOR','morris','classicSaloon',3.760,1.550,1.520,2.180,200,1,'classic',{rim:'steel'}],
 ['escort','FORD ESCORT MK1','fordc','classicSaloon',3.978,1.570,1.346,2.400,450,4,'classic',{rim:'steel'}],
 ['db5','ASTON MARTIN DB5','astonc','gtclassic',4.570,1.680,1.340,2.490,6000,6,'classic',{rim:'wire'}],
 ['series3','LAND ROVER SERIES III','lrc','box4x4',3.620,1.680,1.970,2.240,400,2,'classic',{rim:'steel',roofCol:0xeeeeea}],
 // ---- TRADE & 4X4
 ['sprinter','MERCEDES SPRINTER','merc','vanL',5.932,2.020,2.640,3.665,560,1,'trade',{rim:'steel'}],
 ['transporter','VW TRANSPORTER','vw','van',4.904,1.904,1.990,3.000,420,2,'trade',{rim:'steel'}],
 ['vivaro','VAUXHALL VIVARO','vauxhall','van',4.959,1.920,1.890,2.975,380,2,'trade',{rim:'steel'}],
 ['hilux','TOYOTA HILUX','toyota','pickup',5.325,1.855,1.815,3.085,420,3,'trade',{rim:'offroad'}],
 ['ranger','FORD RANGER','ford','pickup',5.370,1.918,1.884,3.270,450,4,'trade',{rim:'offroad'}],
 ['dmax','ISUZU D-MAX','isuzu','pickup',5.277,1.870,1.790,3.125,360,2,'trade',{rim:'offroad'}],
 ['wrangler','JEEP WRANGLER','jeep','box4x4',4.882,1.894,1.848,3.008,560,4,'every',{rim:'offroad'}],
 ['jimny','SUZUKI JIMNY','suzuki','box4x4',3.645,1.645,1.720,2.250,200,2,'every',{rim:'offroad',R:.34}],
 ['landcruiser','TOYOTA LAND CRUISER','toyota','suvL',4.920,1.980,1.870,2.850,700,4,'prem',{rim:'offroad'}]];

const CATLABEL={hatchS:'CITY CAR',hatch:'HATCHBACK',estate:'ESTATE',saloon:'SALOON',coupe:'COUPE',gt:'GRAND TOURER',roadster:'ROADSTER',super:'SUPERCAR',suvS:'SMALL SUV',suv:'SUV',suvL:'BIG SUV',
 box4x4:'4X4',van:'VAN',vanL:'BIG VAN',pickup:'PICKUP',classic:'CLASSIC',classicSaloon:'CLASSIC',gtclassic:'CLASSIC GT',roadsterClassic:'CLASSIC ROADSTER'};
const PERF=['GENTLE','EASYGOING','STEADY','LIVELY','PERKY','QUICK','BRISK','FAST','VERY FAST','RAPID','BLISTERING','HYPERCAR'];
for(const row of CAT){const[key,name,brand,type,L,W,H,WB,price,pf,pal,ex]=row,T=TYPES[type],X=ex||{};
 const P=typeGen(T,{L,W,H,WB,R:X.R,rim:RIMS[X.rim||(pf>=8?'dark':'silver')],sill:X.sill,pillars:X.pillars,roofCol:X.roofCol,d2:T.d2});
 const B=BRAND[brand]||BRAND.vw;const body=brandDeco(B,P,T);
 P.deco=T.spare?(D=>{body(D);spareX(P)(D)}):body;
 if(type==='super')P.extras=D=>{D.box([0,P.deck+.03,-L/2+.18],[W*.62,.025,.14],0,null)};
 const S=gen(P);const big=T===TYPES.suvL||T===TYPES.box4x4||T===TYPES.van||T===TYPES.vanL||T===TYPES.pickup;
 const grip=.95+pf*.035+(big?.04:0),stat=[Math.round(pf*1.6-3),+(0.88+pf*.055).toFixed(2),+grip.toFixed(2)];
 SPECS.push({key,name,desc:CATLABEL[type]+' · '+PERF[Math.min(11,pf)],price,stat,hgt:Math.min(1.6,Math.max(.9,H*.78)),rad:+(L*.235).toFixed(2),
  far:type==='hatchS'||type==='classic'?0:type==='hatch'?1:type.startsWith('van')?3:big||type.startsWith('suv')?4:2,
  stock:PAL[pal][[...key].reduce((h,c)=>h*31+c.charCodeAt(0)>>>0,7)%PAL[pal].length],pal:PAL[pal],cat:type,brand,S,lamps:{f:[W*.36,P.nose-.08,L/2-.05],b:[W*.38,(P.deck||P.beltR)-.08,-L/2+.02]}})}

/* ================================================================ motorbikes
   Built from lofted octagon sections (fairing, tank, seat, tail), beams (frame, fork, swingarm)
   and a seated rider. Same output as the cars: paint buffer + trim buffer, wheels separate. */
function buildBike(S){const PB={p:[],c:[]},FB={p:[],c:[]},RB={p:[],c:[]};let OUT=null;
 const tri=(a,b,c,hex,ref)=>{let n=nrm(crs(sub(b,a),sub(c,a)));if(!n)return;if(ref&&n[0]*ref[0]+n[1]*ref[1]+n[2]*ref[2]<0){const t=b;b=c;c=t;n=[-n[0],-n[1],-n[2]]}
  const s=shade(n),k=hex==null?[1,1,1]:hx(hex),B=OUT||(hex==null?PB:FB);B.p.push(...a,...b,...c);for(let i=0;i<3;i++)B.c.push(k[0]*s,k[1]*s,k[2]*s)};
 const oct=(z,cx,cy,w,h)=>{const o=[];for(let i=0;i<8;i++){const a=(i+.5)/8*6.2832;o.push([cx+Math.cos(a)*w/2/Math.cos(Math.PI/8),cy+Math.sin(a)*h/2/Math.cos(Math.PI/8),z])}return o};
 /* loft through sections [z,cy,w,h] (or [z,cy,w,h,cx]) */
 const loft=(secs,hex)=>{const R=secs.map(q=>oct(q[0],q[4]||0,q[1],q[2],q[3]));let cx=0,cy=0,cz=0,n=0;for(const r of R)for(const p of r){cx+=p[0];cy+=p[1];cz+=p[2];n++}const C=[cx/n,cy/n,cz/n];
  const out=(a,b,c)=>{const m=[(a[0]+b[0]+c[0])/3-C[0],(a[1]+b[1]+c[1])/3-C[1],(a[2]+b[2]+c[2])/3-C[2]];tri(a,b,c,hex,m)};
  for(let i=0;i<R.length-1;i++)for(let k=0;k<8;k++){const a=R[i][k],b=R[i][(k+1)%8],c=R[i+1][(k+1)%8],d=R[i+1][k];out(a,b,c);out(a,c,d)}
  for(const r of[R[0],R[R.length-1]]){let x=0,y=0,z=0;for(const p of r){x+=p[0];y+=p[1];z+=p[2]}const m=[x/8,y/8,z/8];for(let k=0;k<8;k++)out(m,r[k],r[(k+1)%8])}};
 /* square beam from a to b */
 const beam=(a,b,w,hex)=>{const d=nrm(sub(b,a));if(!d)return;let u=Math.abs(d[1])<.9?[0,1,0]:[1,0,0];const s1=nrm(crs(d,u)),s2=crs(s1,d),h=w/2;
  const P=(p,i,j)=>[p[0]+s1[0]*i*h+s2[0]*j*h,p[1]+s1[1]*i*h+s2[1]*j*h,p[2]+s1[2]*i*h+s2[2]*j*h];
  const q=[[1,1],[-1,1],[-1,-1],[1,-1]],m=[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2];
  for(let k=0;k<4;k++){const A=P(a,...q[k]),B=P(a,...q[(k+1)%4]),C=P(b,...q[(k+1)%4]),D=P(b,...q[k]),o=sub([(A[0]+C[0])/2,(A[1]+C[1])/2,(A[2]+C[2])/2],m);tri(A,B,C,hex,o);tri(A,C,D,hex,o)}
  for(const[p,sg]of[[a,-1],[b,1]]){const A=P(p,1,1),B=P(p,-1,1),C=P(p,-1,-1),D=P(p,1,-1),o=d.map(v=>v*sg);tri(A,B,C,hex,o);tri(A,C,D,hex,o)}};
 const box=(c,sz,hex,rx)=>{const[a,b,d]=sz.map(v=>v/2),cr=Math.cos(rx||0),sr=Math.sin(rx||0),P=(x,y,z)=>[c[0]+x,c[1]+y*cr-z*sr,c[2]+y*sr+z*cr];
  const F=[[[1,0,0],[[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]]],[[-1,0,0],[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]]],[[0,1,0],[[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1]]],[[0,-1,0],[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]],[[0,0,1],[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]],[[0,0,-1],[[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1]]]];
  for(const[n,q]of F){const v=q.map(k=>P(k[0]*a,k[1]*b,k[2]*d)),r=[n[0],n[1]*cr-n[2]*sr,n[1]*sr+n[2]*cr];tri(v[0],v[1],v[2],hex,r);tri(v[0],v[2],v[3],hex,r)}};
 const t=S.type,R=S.R,zf=S.WB/2,zr=-S.WB/2,BLK=0x17181b,ENG=0x4a4d52,CH=0xc8ccd2,GL=0x2a3a4a,LT=0xf4f8ff,RD=0xc31a26,FR=S.frame||0x2a2c30;
 const sc=t==='scooter',cr=t==='cruiser',adv=t==='adv',sp=t==='sport',cl=t==='classic';
 const head=[0,R+(sc?.62:cr?.58:adv?.78:.62),zf-(sc?.12:cr?.32:.24)];
 /* fork and steering head */
 for(const s of[1,-1])beam([s*.075,R,zf],[s*.06,head[1],head[2]],.045,sc?null:cr||cl?CH:0x8a8e94);
 /* frame, engine, swingarm, exhaust */
 const piv=[0,R+.12,-.18];
 if(!sc){beam(head,[0,R+.40,-.15],.07,FR);beam([0,R+.40,-.15],piv,.07,FR);
  box([0,R+.06,.02],[.30,cr?.42:.36,cr?.58:.48],ENG);if(cr||cl)for(const s of[1,-1])box([s*.17,R+.16,.10],[.06,.20,.22],CH);
  for(const s of[1,-1])beam([s*.10,piv[1],piv[2]],[s*.07,R,zr],.05,FR);
  const ex=cr||cl?[[1,-1],CH]:[[1],sp?ENG:0x6a6e74];for(const s of ex[0])beam([s*.14,R-.06,.05],[s*.16,R+.02,zr-.08],.07,ex[1])}
 /* bodywork */
 if(sp){loft([[zf-.02,R+.58,.08,.10],[zf-.18,R+.60,.30,.30],[zf-.40,R+.52,.40,.42],[zf-.55,R+.40,.36,.46]],null);
  loft([[zf-.58,R+.04,.30,.16],[zf-.78,R-.02,.32,.14],[-.10,R+.0,.24,.10]],null);
  box([0,R+.82,zf-.30],[.30,.02,.24],GL,-1.0);box([0,R+.60,zf+.0],[.12,.06,.02],LT)}
 else if(adv){loft([[zf-.10,R+.82,.10,.08],[zf-.26,R+.80,.30,.24],[zf-.42,R+.72,.40,.30]],null);box([0,R+1.02,zf-.32],[.34,.02,.32],GL,-1.15);box([0,R+.80,zf-.08],[.16,.08,.02],LT);
  loft([[zf+.12,R+.28,.10,.02],[zf-.10,R+.36,.16,.03]],null)}
 else if(cr){loft([[zf-.12,R+.62,.20,.16],[zf-.28,R+.66,.78,.36],[zf-.42,R+.60,.80,.30]],null);box([0,R+.92,zf-.38],[.52,.02,.16],GL,-.6);box([0,R+.66,zf-.10],[.18,.12,.02],LT);
  loft([[zf+.20,R+.10,.20,.04],[zf,R+.36,.24,.06],[zf-.24,R+.38,.24,.06]],null);loft([[zr+.18,R+.40,.26,.06],[zr-.04,R+.36,.26,.06],[zr-.24,R+.16,.24,.04]],null);
  for(const s of[1,-1])loft([[zr+.30,R+.30,.20,.32,s*.34],[zr-.08,R+.30,.22,.34,s*.34],[zr-.22,R+.24,.18,.24,s*.33]],null)}
 else if(sc){loft([[zf-.04,R+.20,.36,.10],[zf-.10,R+.72,.40,.10],[zf-.22,R+.86,.32,.10]],null);box([0,R+.02,-.05],[.36,.05,.62],BLK);
  loft([[-.30,R+.05,.30,.20],[-.40,R+.32,.42,.42],[zr+.12,R+.40,.40,.34],[zr-.06,R+.36,.24,.18]],null);box([0,R+.92,zf-.24],[.24,.10,.08],LT);
  loft([[zf+.10,R+.06,.16,.04],[zf-.14,R+.30,.16,.06]],null)}
 else{/* naked / classic: round headlight, mudguards */const hl=[0,R+.62,zf-.10];loft([[hl[2]+.06,hl[1],.12,.12],[hl[2],hl[1],.18,.18],[hl[2]-.08,hl[1],.14,.14]],cl?CH:BLK);box([0,hl[1],hl[2]+.07],[.12,.12,.01],LT);
  loft([[zf+.14,R+.24,.12,.03],[zf,R+.36,.14,.04],[zf-.14,R+.30,.12,.03]],cl?CH:null);if(cl)loft([[zr+.20,R+.42,.16,.04],[zr,R+.40,.16,.05],[zr-.24,R+.20,.14,.04]],CH)}
 /* tank, seat, tail */
 if(!sc){const tz=cr?.0:-.02,ty=R+(adv?.66:cr?.54:.56);loft([[tz+.34,ty-.02,.24,.14],[tz+.18,ty+.06,.36,.22],[tz-.06,ty+.06,.34,.20],[tz-.18,ty,.24,.12]],null);
  const sy=R+(adv?.66:cr?.42:sp?.60:.54);box([0,sy,-.36],[.28,.08,cr?.34:.42],BLK);
  if(sp)loft([[-.36,sy+.02,.26,.12],[-.62,sy+.10,.20,.10],[-.82,sy+.16,.06,.05]],null);
  else if(!cr)loft([[-.50,sy-.02,.22,.08],[zr+.10,sy-.06,.18,.06],[zr-.06,sy-.12,.10,.04]],cl?CH:null)}
 else box([0,R+.62,-.32],[.28,.10,.50],BLK);
 /* tail light, bars, mirrors */
 box([0,R+(sp?.74:sc?.46:cr?.42:.56),zr-(sp?.02:.06)],[.10,.04,.02],RD);
 const bar=[0,head[1]+(cr?.18:adv?.10:sp?-.06:.08),head[2]-.06],bw=cr?.42:adv?.40:sc?.30:sp?.30:.36;beam([-bw,bar[1],bar[2]-.04],[bw,bar[1],bar[2]-.04],.03,BLK);
 for(const s of[1,-1])beam([s*bw*.8,bar[1],bar[2]],[s*(bw*.8+.06),bar[1]+.14,bar[2]+.02],.02,BLK),box([s*(bw*.8+.08),bar[1]+.16,bar[2]+.02],[.08,.05,.02],BLK);
 if(adv)for(const s of[1,-1])box([s*.30,R+.40,zr+.30],[.14,.34,.44],0x3a3c40);
 /* rider: helmet, torso, arms, legs, boots (own mesh: only shown while you're riding) */
 OUT=RB;
 const J=S.jacket||0x1c1d22,PN=0x22242a,HL=S.helmet||0xe8e8ea,lean=sp?.95:adv?.25:cr?-.1:sc?.05:.35,seat=[0,R+(adv?.74:cr?.50:sp?.68:sc?.70:.62),sc?-.30:cr?-.36:-.30];
 const hip=[0,seat[1]+.10,seat[2]],sh=[0,hip[1]+.50*Math.cos(lean*.6),hip[2]+.50*Math.sin(lean*.6)+(sp?.08:0)],hd=[0,sh[1]+.20-(sp?.06:0),sh[2]+.06];
 beam(hip,sh,.30,J);box([0,sh[1]-.02,sh[2]],[.40,.12,.20],J);loft([[hd[2]+.13,hd[1],.12,.12],[hd[2]+.08,hd[1],.25,.26],[hd[2]-.06,hd[1],.27,.28],[hd[2]-.15,hd[1],.14,.16]],HL);box([0,hd[1]+.01,hd[2]+.12],[.18,.07,.04],0x111418);
 for(const s of[1,-1]){const S0=[s*.20,sh[1]-.02,sh[2]],H_=[s*bw*.75,bar[1]+.02,bar[2]],E_=[(S0[0]+H_[0])/2+s*.06,(S0[1]+H_[1])/2-.06,(S0[2]+H_[2])/2-.02];
  beam(S0,E_,.09,J);beam(E_,H_,.08,J);box(H_,[.07,.07,.08],0x111214);
  const K=sc?[s*.16,R+.62,.05]:cr?[s*.20,R+.52,.12]:[s*.16,R+(adv?.68:.56),-.02+(sp?.08:0)],F_=sc?[s*.14,R+.10,.06]:cr?[s*.24,R+.12,.42]:[s*.16,R+(adv?.20:.18),-.18+(sp?-.08:0)];
  beam([s*.12,hip[1]-.02,hip[2]],K,.13,PN);beam(K,F_,.11,PN);box([F_[0],F_[1]-.02,F_[2]+.06],[.10,.08,.22],0x101012)}
 OUT=null;
 return{PB,FB,RB,tris:(PB.p.length+FB.p.length+RB.p.length)/9}}

const BIKES=[ // key,name,type,wheelbase,R,tyre half-width,price,perf,colours,frame,jacket,helmet
 ['cbr600','HONDA CBR600RR','sport',1.375,.30,.06,120,9,[[.8,.06,.06],[.06,.06,.07],[.94,.94,.95]],0x2a2c30,0x1c1d22,0xc81818],
 ['panigale','DUCATI PANIGALE V4','sport',1.47,.31,.065,280,11,[[.8,.04,.04],[.06,.06,.07]],0x8a1010,0xb01818,0xe8e8ea],
 ['ninja650','KAWASAKI NINJA 650','sport',1.41,.30,.055,75,7,[[.28,.62,.12],[.06,.06,.07]],0x2a2c30,0x1c1d22,0x2a8a18],
 ['r1','YAMAHA YZF-R1','sport',1.405,.31,.06,200,11,[[.08,.18,.6],[.06,.06,.07]],0x3a3d42,0x14245a,0x1a2c8a],
 ['mt07','YAMAHA MT-07','naked',1.40,.30,.055,75,7,[[.12,.14,.2],[.4,.42,.46]],0x2a6ab0,0x1c1d22,0x2a2c30],
 ['z900','KAWASAKI Z900','naked',1.45,.31,.06,95,8,[[.06,.06,.07],[.28,.62,.12]],0x2a8a18,0x1c1d22,0x0f1012],
 ['streettriple','TRIUMPH STREET TRIPLE','naked',1.40,.31,.06,110,9,[[.36,.38,.42],[.9,.4,.06]],0x8a1010,0x2a2016,0xe8e8ea],
 ['duke390','KTM 390 DUKE','naked',1.36,.29,.05,55,6,[[.96,.42,.04],[.94,.94,.95]],0xe06010,0x1c1d22,0xe06010],
 ['bonneville','TRIUMPH BONNEVILLE T120','classic',1.45,.33,.055,120,6,[[.06,.2,.12],[.06,.06,.07],[.6,.06,.08]],0x111214,0x3a2416,0xd8d0b8],
 ['enfield','ROYAL ENFIELD CLASSIC 350','classic',1.39,.32,.05,45,3,[[.5,.06,.06],[.1,.14,.3],[.06,.06,.07]],0x111214,0x4a3a22,0x2a2c30],
 ['streetglide','HARLEY-DAVIDSON STREET GLIDE','cruiser',1.625,.33,.07,280,6,[[.06,.06,.07],[.5,.06,.06],[.1,.14,.3]],0x111214,0x111111,0x111111],
 ['gs1300','BMW R 1300 GS','adv',1.52,.34,.065,200,8,[[.94,.94,.95],[.1,.2,.55]],0x2a2c30,0x3a3d42,0xe8e8ea],
 ['africatwin','HONDA AFRICA TWIN','adv',1.575,.35,.06,150,7,[[.94,.94,.95],[.8,.06,.06]],0xb01010,0x2a2c30,0xc81818],
 ['vespa','VESPA PRIMAVERA','scooter',1.34,.20,.05,45,2,[[.7,.86,.84],[.94,.94,.92],[.8,.1,.1]],0x111214,0x8a6a3a,0xe8e8ea],
 ['pcx','HONDA PCX125','scooter',1.31,.22,.05,35,1,[[.94,.94,.95],[.08,.08,.09],[.6,.06,.08]],0x111214,0x1c1d22,0x2a2c30]];
const BIKELABEL={sport:'SPORTS BIKE',naked:'NAKED BIKE',classic:'CLASSIC BIKE',cruiser:'CRUISER',adv:'ADVENTURE BIKE',scooter:'SCOOTER'};
for(const b of BIKES){const[key,name,type,WB,R,tw,price,pf,pal,frame,jacket,helmet]=b;
 const S={bike:1,type,WB,R,TW:tw,rimR:R*(type==='scooter'?.65:.72),inset:0,ZF:WB/2,ZB:-WB/2,W0:.4,NZ:WB/2+R,frame,jacket,helmet,
  rim:type==='classic'||type==='cruiser'?RIMS.wire:type==='scooter'?{n:5,col:0xb8bdc3,twin:false,w0:.03,w1:.025}:{n:3,col:0x2a2c30,twin:true,w0:.016,w1:.012}};
 SPECS.push({key,name,desc:BIKELABEL[type]+' · '+PERF[Math.min(11,pf)],price,bike:1,cat:'bike',stat:[Math.round(pf*1.7-4),+(1.0+pf*.07).toFixed(2),+(.9+pf*.02).toFixed(2)],
  hgt:type==='scooter'?1.45:1.4,rad:.7,far:0,stock:pal[0],pal,S,lamps:{f:[.04,R+.62,WB/2+.05],b:[.04,R+.5,-WB/2-.2]}})}

/* ================================================================ register */
const FIRST=6,MAT=c=>new THREE.MeshBasicMaterial({vertexColors:true,color:c||0xffffff});
const geo=B=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(B.p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(B.c,3));g.computeBoundingSphere();return g};
const lit=(m,base)=>{m.onBeforeRender=function(){const l=U.uLight.value,c=base||[1,1,1];this.material.color.setRGB(c[0]*l.x,c[1]*l.y,c[2]*l.z)};return m};
const TRI={specs:SPECS,ids:[],build,gen,byKey:{}};
SPECS.forEach((C,k)=>{const id=FIRST+k,S=C.S;C.id=id;C.k=k;TRI.ids.push(id);TRI.byKey[C.key]=id;
 let G=null;const ensure=()=>{if(G)return G;const t0=performance.now(),o=C.bike?buildBike(S):build(S);
  const st={p:o.FB.p.slice(),c:o.FB.c.slice()};for(const sx of[1,-1])for(const z of[S.ZF,S.ZB])wheelArr(S,sx,C.bike?0:sx*(S.W0-S.inset),z,st);
  const tf=o.RB?{p:st.p.concat(o.RB.p),c:st.c.concat(o.RB.c)}:null;
  G={P:geo(o.PB),F:geo(o.FB),SF:geo(st),TF:tf?geo(tf):null,RD:o.RB?geo(o.RB):null,RG:{1:geo(rimArr(1,S,{p:[],c:[]})),'-1':geo(rimArr(-1,S,{p:[],c:[]}))},tris:o.tris,ms:performance.now()-t0};return G};
 /* the drivable car: lazily built the first time it is shown */
 const pM=MAT(),fM=MAT(),rM=MAT(),tyreM=new THREE.MeshBasicMaterial({color:0x151518}),dM=new THREE.MeshBasicMaterial({color:0x2a2c30});
 const grp=new THREE.Group();grp.visible=false;car.add(grp);const wl=[];
 const N={id,grp,ready:1,pc:C.stock,spec:C,built:0,
  load(){if(N.built||CARI!==id)return;N.built=1;const g=ensure();grp.add(new THREE.Mesh(g.P,pM),new THREE.Mesh(g.F,fM));if(g.RD){N.rider=new THREE.Mesh(g.RD,fM);N.rider.visible=false;grp.add(N.rider)}
   const tyreG=new THREE.CylinderGeometry(S.R*.985,S.R*.985,S.TW*2,24).rotateZ(Math.PI/2);
   const dG=sx=>{const dg=new THREE.CircleGeometry(S.rimR*.992,24);dg.rotateY(sx>0?Math.PI/2:-Math.PI/2);dg.translate(sx*(S.TW+.001),0,0);return dg};
   for(const sx of C.bike?[1]:[1,-1])for(const[f,z]of[[1,S.ZF],[0,S.ZB]]){const piv=new THREE.Group(),spin=new THREE.Group();piv.position.set(C.bike?0:sx*(S.W0-S.inset),S.R,z);
    spin.add(new THREE.Mesh(tyreG,tyreM),new THREE.Mesh(dG(sx),dM),new THREE.Mesh(g.RG[sx],rM));if(C.bike)spin.add(new THREE.Mesh(dG(-1),dM),new THREE.Mesh(g.RG[-1],rM));piv.add(spin);grp.add(piv);wl.push({piv,spin,front:f})}
   N.upd(1)},
  paint(){const w=paintC[0]>.97&&paintC[1]>.97&&paintC[2]>.97;N.pc=w?C.stock:paintC.slice();N.upd(1)},
  upd(still){const l=U.uLight.value,c=N.pc;pM.color.setRGB(c[0]*l.x,c[1]*l.y,c[2]*l.z);fM.color.setRGB(l.x,l.y,l.z);rM.color.setRGB(l.x,l.y,l.z);
   tyreM.color.setRGB(.085*l.x,.085*l.y,.09*l.z);dM.color.setRGB(.17*l.x,.17*l.y,.19*l.z);if(still)return;
   for(const w of wl){w.spin.rotation.x=GS_SPIN*.275/S.R;if(w.front)w.piv.rotation.y=GS.steer*.5}
   if(N.rider)N.rider.visible=!GS.onFoot&&CARI===id;
   if(C.bike){const v=Math.min(1,Math.abs(GS.speed||0)/10),tl=GS.onFoot?0:-(GS.steer||0)*v*.55;grp.rotation.z+=(tl-grp.rotation.z)*.2}},
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
TRI.isBike=i=>{const C=SPECS[i-FIRST];return!!(C&&C.bike)};
TRI.FIRST=FIRST;
TRI.N=SPECS.length;
TRI.len=k=>SPECS[k].S.NZ*2;
/* traffic: a static copy in one of the model's usual colours */
TRI.civ=(k,col)=>NC.cars[FIRST+k].inst(col);
TRI.pal=(k,r)=>{const p=SPECS[k].pal;return p[Math.floor(r*p.length)%p.length]};
TRI.geoK=k=>NC.cars[FIRST+k].geo();
/* models the Marlowe city traffic draws (instanced); the black cab is TRI.cityCab */
TRI.city=['a6','golf','m3','911','mini','3s','qq','prius','focus','corsa','tiguan','modely','eclass','rr','sprinter','mt07','vespa','tx'].map(k=>TRI.byKey[k]-FIRST);TRI.cityCab=TRI.city.length-1;
TRI.mat=MAT;TRI.lit=lit;
window.TRI=TRI;

/* ---- gallery: step through cars (the dealer's stock in a showroom, otherwise the cars you own) ---- */
{const b0=document.querySelector('#galP button[data-g="car"]');
 if(b0){const row=b0.parentNode,list=()=>{if(typeof GAL!=='undefined'&&GAL.mode==='show'&&TRI.curStock)return TRI.curStock;const o=[];for(let i=0;i<CARN.length;i++)if(i<6||OWN.car[i]||i===CARI)o.push(i);return o};
  const step=d=>{const L=list();let j=L.indexOf(CARI);j=j<0?0:(j+d+L.length)%L.length;setCar(L[j]);for(const x of row.querySelectorAll('button[data-g="car"]'))x.classList.remove('on')};
  for(const[t,d]of[['◀',-1],['▶',1]]){const b=document.createElement('button');b.textContent=t;b.dataset.g='carstep';b.style.flex='0 0 44px';b.onclick=e=>{e.stopPropagation();step(d)};row.appendChild(b)}}}

/* ---- black cab: fares pay 20% more (village taxi and Marlowe cab careers) ---- */
try{if(typeof crPay==='function'){const p0=crPay;crPay=function(k,base,msg){return p0(k,CARI===FIRST+9&&(k==='taxi'||k==='mcab')?base*1.2:base,msg)}}}catch(e){}

/* ---- village/town traffic: about half the small cars and some vans become fleet models ---- */
{const CARK=['a6','golf','m3','mini','3s','qq','prius','corsa','polo','focus','puma','fiat500','corolla','juke','sportage','tiguan','modely','cclass','xc40','clio'].map(k=>TRI.byKey[k]-FIRST),hash=(o,n)=>{const v=Math.sin((o.x||0)*12.9898+(o.z||0)*78.233+n*37.719)*43758.5453;return v-Math.floor(v)};let n=0;
 const swap=o=>{n++;if(o.m===3||o.m>=10)return o;const r=hash(o,n);
  if((o.m===0||o.m===1)&&r<.55){const k=CARK[Math.floor(hash(o,n+7)*CARK.length)%CARK.length];o.m=10+k;o.col=TRI.pal(k,hash(o,n+13))}
  else if(o.m===2&&r<.4){const k=TRI.byKey[r<.2?'tc':'transporter']-FIRST;o.m=10+k;o.col=TRI.pal(k,hash(o,n+13))}
  return o};
 if(typeof CIV!=='undefined')for(const o of CIV){const m=o.m;swap(o);if(o.m!==m&&o.inst){scene.remove(o.inst);o.inst=null}if(o.m!==m&&o.far){scene.remove(o.far);o.far=null}}
 try{if(typeof civAdd==='function'){const c0=civAdd;civAdd=function(o){return c0(swap(o))}}}catch(e){}}
})();
