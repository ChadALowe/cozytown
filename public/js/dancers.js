/* ===== SELF-CONTAINED CABARET DANCER (pole stages only) =====
   Used only by the Gilded Cage pole stages (casino3.js). Builds an ordinary person with the game's own mkPerson,
   then dresses THAT ONE INSTANCE: cropped strap top, bare arms, short shorts, high heels, a rounded bust. Every mesh it edits is created fresh for the dancer, and nothing in game/*.js or any other
   file is modified, so ordinary characters are never affected.
   API: window.mkDancer(seed, parent, x, z, ry, {hs, acc:[r,g,b], bc:[r,g,b], sk, hr:[r,g,b] (optional hair colour)}) -> THREE.Group (limbs: up, a1, a2, l1, l2) ===== */
(function(){
const mat=h=>fmc(h);
const hex=c=>((c[0]*255|0)<<16)|((c[1]*255|0)<<8)|(c[2]*255|0);
const GOLD=0xe8bf4a;
const flat=(g,n)=>{g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(n*3).fill(1),3))};

/* cut every triangle of a (non-indexed) geometry along the plane axis=Yc (axis 0=x, 1=y) so a colour change can be a crisp edge */
function splitA(g,ax,ys){let pos=g.attributes.position.array,col=g.attributes.color.array,uv=g.attributes.uv.array;
 for(const Yc of ys){const P=[],C=[],U=[];
  const V=i=>({p:[pos[i*3],pos[i*3+1],pos[i*3+2]],c:[col[i*3],col[i*3+1],col[i*3+2]],u:[uv[i*2],uv[i*2+1]]});
  const mix=(a,b,t)=>({p:a.p.map((v,k)=>v+(b.p[k]-v)*t),c:a.c.map((v,k)=>v+(b.c[k]-v)*t),u:a.u.map((v,k)=>v+(b.u[k]-v)*t)});
  const emit=q=>{for(let k=1;k<q.length-1;k++)for(const v of[q[0],q[k],q[k+1]]){P.push(...v.p);C.push(...v.c);U.push(...v.u)}};
  for(let t=0;t<pos.length/9;t++){const v=[V(t*3),V(t*3+1),V(t*3+2)],up=[],lo=[];
   for(let i=0;i<3;i++){const a=v[i],b=v[(i+1)%3],da=a.p[ax]-Yc,db=b.p[ax]-Yc;
    if(da>=0)up.push(a);else lo.push(a);
    if((da>=0)!==(db>=0)){const m=mix(a,b,da/(da-db));up.push(m);lo.push(m)}}
   if(up.length>2)emit(up);if(lo.length>2)emit(lo)}
  pos=new Float32Array(P);col=new Float32Array(C);uv=new Float32Array(U)}
 const ng=new THREE.BufferGeometry();ng.setAttribute('position',new THREE.BufferAttribute(pos,3));ng.setAttribute('color',new THREE.BufferAttribute(col,3));ng.setAttribute('uv',new THREE.BufferAttribute(uv,2));return ng}

/* recolour whole triangles by the height of their centre; fn(cy,triIndex,avgBrightness) -> [r,g,b] or null to keep */
function recol(mesh,fn){const g=mesh.geometry,pos=g.attributes.position,col=g.attributes.color,N=pos.count/3,cols=new Array(N),nrm=new Float32Array(N*3),acc=new Map();
 const key=(x,y,z)=>Math.round(x*2e3)+','+Math.round(y*2e3)+','+Math.round(z*2e3);
 for(let t=0;t<N;t++){const i=t*3,ax=pos.getX(i),ay=pos.getY(i),az=pos.getZ(i),bx=pos.getX(i+1),by=pos.getY(i+1),bz=pos.getZ(i+1),qx=pos.getX(i+2),qy=pos.getY(i+2),qz=pos.getZ(i+2),
  cy=(ay+by+qy)/3,mx=(ax+bx+qx)/3,mz=(az+bz+qz)/3,cx=Math.abs(mx),dy=Math.max(ay,by,qy)-Math.min(ay,by,qy),
  br=(col.getX(i)+col.getY(i)+col.getZ(i)+col.getX(i+1)+col.getY(i+1)+col.getZ(i+1)+col.getX(i+2)+col.getY(i+2)+col.getZ(i+2))/9,
  cr=(col.getX(i)+col.getX(i+1)+col.getX(i+2))/3,cg=(col.getY(i)+col.getY(i+1)+col.getY(i+2))/3,cb=(col.getZ(i)+col.getZ(i+1)+col.getZ(i+2))/3;
  cols[t]=fn(cy,t,br,cx,cr,cg,cb,dy);
  let nx=(by-ay)*(qz-az)-(bz-az)*(qy-ay),ny=(bz-az)*(qx-ax)-(bx-ax)*(qz-az),nz=(bx-ax)*(qy-ay)-(by-ay)*(qx-ax);const l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;
  if(Math.abs(ny)<.8?(nx*mx+nz*mz<0):(cy>1&&ny<0)){nx=-nx;ny=-ny;nz=-nz} // outward-facing; flat top faces (shoulders, neck base) face up
  nrm[t*3]=nx;nrm[t*3+1]=ny;nrm[t*3+2]=nz;
  for(let k=0;k<3;k++){const kk=key(pos.getX(i+k),pos.getY(i+k),pos.getZ(i+k)),a=acc.get(kk)||[0,0,0];a[0]+=nx;a[1]+=ny;a[2]+=nz;acc.set(kk,a)}}
 // smooth (Gouraud) lighting from the game's sun: each vertex uses the average normal of every face that shares it, so curves look rounded, not faceted
 for(let t=0;t<N;t++){const c=cols[t];if(!c)continue;
  for(let k=0;k<3;k++){const i=t*3+k,a=acc.get(key(pos.getX(i),pos.getY(i),pos.getZ(i))),l=Math.hypot(a[0],a[1],a[2])||1,d=Math.max(0,(a[0]*SUN.x+a[1]*SUN.y+a[2]*SUN.z)/l),m=Math.min(1.1,(.86+.3*d)/.95);
   col.setXYZ(i,Math.min(1,c[0]*m),Math.min(1,c[1]*m),Math.min(1,c[2]*m))}}
 col.needsUpdate=true}


/* split every triangle whose centre passes pred(cy) into 4 (repeated `lv` times). Edge midpoints are shared with neighbours, so
   displacing vertices afterwards never opens cracks. */
function subdiv(g,pred,lv){let pos=g.attributes.position.array,col=g.attributes.color.array,uv=g.attributes.uv.array;
 for(let L=0;L<lv;L++){const P=[],C=[],U=[];
  const V=i=>({p:[pos[i*3],pos[i*3+1],pos[i*3+2]],c:[col[i*3],col[i*3+1],col[i*3+2]],u:[uv[i*2],uv[i*2+1]]});
  const mid=(a,b)=>({p:a.p.map((v,k)=>(v+b.p[k])/2),c:a.c.map((v,k)=>(v+b.c[k])/2),u:a.u.map((v,k)=>(v+b.u[k])/2)});
  const emit=(a,b,c)=>{for(const v of[a,b,c]){P.push(...v.p);C.push(...v.c);U.push(...v.u)}};
  for(let t=0;t<pos.length/9;t++){const a=V(t*3),b=V(t*3+1),c=V(t*3+2),cy=(a.p[1]+b.p[1]+c.p[1])/3;
   if(pred(cy)){const ab=mid(a,b),bc=mid(b,c),ca=mid(c,a);emit(a,ab,ca);emit(ab,b,bc);emit(ca,bc,c);emit(ab,bc,ca)}else emit(a,b,c)}
  pos=new Float32Array(P);col=new Float32Array(C);uv=new Float32Array(U)}
 const ng=new THREE.BufferGeometry();ng.setAttribute('position',new THREE.BufferAttribute(pos,3));ng.setAttribute('color',new THREE.BufferAttribute(col,3));ng.setAttribute('uv',new THREE.BufferAttribute(uv,2));return ng}

/* remove every triangle whose centre is below y (used to delete the hidden hem flare so torso and thighs are one clean surface) */
function dropBelow(g,y){const pos=g.attributes.position.array,col=g.attributes.color.array,uv=g.attributes.uv.array,P=[],C=[],U=[];
 for(let t=0;t<pos.length/9;t++){const cy=(pos[t*9+1]+pos[t*9+4]+pos[t*9+7])/3;if(cy<y)continue;for(let k=0;k<9;k++){P.push(pos[t*9+k]);C.push(col[t*9+k])}for(let k=0;k<6;k++)U.push(uv[t*6+k])}
 const ng=new THREE.BufferGeometry();ng.setAttribute('position',new THREE.BufferAttribute(new Float32Array(P),3));ng.setAttribute('color',new THREE.BufferAttribute(new Float32Array(C),3));ng.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(U),2));return ng}

/* push the surface of g out with a smooth gaussian bump: fn(x,y,z) -> [dx,dy,dz] */
function sculpt(g,fn){const q=g.attributes.position;for(let i=0;i<q.count;i++){const d=fn(q.getX(i),q.getY(i),q.getZ(i));if(d){q.setXYZ(i,q.getX(i)+d[0],q.getY(i)+d[1],q.getZ(i)+d[2])}}q.needsUpdate=true}
/* one cheek shape in the dancer's own space, used for BOTH torso and thighs so the two shells stay flush: returns backward push for a point at (x,y,z) */
const cheek=(x,y,z)=>{if(z>=0||y<.5||y>1.06)return 0;const fx=dome((Math.abs(x)-.09)/.105),fy=dome((y-.83)/.15);return .15*fx*fy*Math.min(1,-z/.04)};
/* hips also widen sideways (same field on torso and thighs) so the figure has an hourglass shape */
const hipW=(x,y)=>(y<.6||y>1.05)?0:Math.sign(x)*.04*Math.exp(-(((y-.86)/.13)**2)*1.3)*Math.min(1,Math.abs(x)/.08)
const bump=(x,y,cx,cy,sx,sy)=>Math.exp(-Math.pow(((x-cx)/sx)**2+((y-cy)/sy)**2,1.5)*1.2); // rounded dome (flat-topped), not a pointed gaussian
const dome=u=>Math.exp(-Math.pow(u*u,1.5)*1.2);

const ring=(r,h,y,sz,hx,par)=>{const g=new THREE.CylinderGeometry(r,r,h,12,1,true);flat(g,g.attributes.position.count);const m=new THREE.Mesh(g,mat(hx));m.material.side=THREE.DoubleSide;m.scale.z=sz;m.position.y=y;par.add(m);return m};

function dress(p,o){const acc=o.acc,bc=acc,hx=hex(acc),F=.92; // one solid colour: top, shorts and bust all match
 // skin tone, sampled from the hand of this dancer's own arm mesh
 const ag=p.a1.geometry.attributes,ap=ag.position;let bi=0,bd=9;for(let i=0;i<ap.count;i++){const d=Math.abs(ap.getY(i)+.64);if(d<bd){bd=d;bi=i}}
 const sk=[ag.color.getX(bi),ag.color.getY(bi),ag.color.getZ(bi)];
 // cropped strap top: solid-colour band over the chest, thin shoulder straps, bare shoulders and midriff, crisp edges
 // the tee's collar is a wide three-ring tube (y 1.42 / 1.52 / 1.60): find exactly those triangles, slim them into a neck and make them skin
 {const g0=p.up.geometry,q=g0.attributes.position,c0=g0.attributes.color,L=[1.42,1.52,1.6],lv=y=>L.findIndex(v=>Math.abs(v-y)<.004);
  for(let t=0;t<q.count/3;t++){const i=t*3,a=lv(q.getY(i)),b=lv(q.getY(i+1)),c=lv(q.getY(i+2));
   if(a>=0&&b>=0&&c>=0&&!(a===b&&b===c))for(let k=0;k<3;k++){q.setX(i+k,q.getX(i+k)*.6);q.setZ(i+k,q.getZ(i+k)*.6);c0.setXYZ(i+k,sk[0]*.97,sk[1]*.97,sk[2]*.97)}}
  q.needsUpdate=true;c0.needsUpdate=true}
 // sculpt a smooth bust and fuller hips into the torso itself (no stuck-on shapes)
 p.up.geometry=subdiv(p.up.geometry,cy=>cy>.8&&cy<1.45,2);
 sculpt(p.up.geometry,(x,y,z)=>{let dx=0,dz=0,hit=0;
  // waist: slimmer through the middle
  {const w=Math.exp(-(((y-1.04)/.075)**2)*1.3);if(w>.01){dx-=x*.14*w;dz-=z*.07*w;hit=1}}
  // bust: two smooth, large rounded forms on the front of the chest
  if(y>1.05&&y<1.45&&z>0){const f=Math.max(bump(x,y,.085,1.235,.1,.11),bump(x,y,-.085,1.235,.1,.11));if(f>.001){dz+=.17*f;dx+=Math.sign(x)*.024*f;hit=1}}
  // pelvis: slim the hem depth down to the thigh depth (no flat shelf), widen the hips, add the shared rear shape
  if(y>.8&&y<1.05){const t=Math.max(0,Math.min(1,(.99-y)/.09)),k=.3*t*t*(3-2*t);dx+=-x*k*.18+hipW(x,y);dz+=-z*k*(z<0?1:.6)-cheek(x,y,z);hit=1}
  return hit?[dx,0,dz]:null});
 p.up.geometry=dropBelow(splitA(p.up.geometry,1,[.9]),.9);
 {let g=splitA(p.up.geometry,1,[.98,1.12,1.34,1.46]);g=splitA(g,0,[-.135,-.09,.09,.135]);p.up.geometry=g}
 recol(p.up,(cy,t,br,cx,cr,cg,cb,dy)=>{const k=F;
  if(cy>1.12&&cy<=1.34)return[acc[0]*k,acc[1]*k,acc[2]*k];
  if(cy>1.34&&cy<1.46)return(cx>.09&&cx<.135&&dy>.004)?[acc[0]*k,acc[1]*k,acc[2]*k]:[sk[0]*.95,sk[1]*.95,sk[2]*.95];
  if(cy>.98&&cy<=1.12)return[sk[0]*.95,sk[1]*.95,sk[2]*.95];
  if(cy>.8&&cy<=.98)return[acc[0]*F,acc[1]*F,acc[2]*F];
  if(cy>1.46&&cy<1.58){const m=Math.hypot(cr,cg,cb)||1,a=Math.hypot(acc[0],acc[1],acc[2])||1;if(Math.hypot(cr/m-acc[0]/a,cg/m-acc[1]/a,cb/m-acc[2]/a)<.4)return[sk[0]*.97,sk[1]*.97,sk[2]*.97]}
  if(cy>1.5&&cy<1.9&&Math.abs(cg/(cr||1)-sk[1]/sk[0])<.06&&Math.abs(cb/(cr||1)-sk[2]/sk[0])<.06)return[Math.min(1,cr*1.3),Math.min(1,cg*1.3),Math.min(1,cb*1.3)];
  return null});
 // final tidy: nothing but skin in the front neck zone between the straps (catches stray blended collar triangles)
 {const q=p.up.geometry.attributes.position,c=p.up.geometry.attributes.color;for(let k=0;k<q.count;k++){const y=q.getY(k);if(y>1.34&&y<1.62&&Math.abs(q.getX(k))<.088&&q.getZ(k)>0){const r=c.getX(k),g=c.getY(k),b=c.getZ(k),m=Math.hypot(r,g,b)||1,n=Math.hypot(sk[0],sk[1],sk[2]);if(Math.abs(g/r-sk[1]/sk[0])>.12||Math.abs(b/r-sk[2]/sk[0])>.12){c.setXYZ(k,sk[0]*.97,sk[1]*.97,sk[2]*.97)}}}c.needsUpdate=true}
 // bare arms
 for(const a of[p.a1,p.a2])recol(a,()=>sk);
 // short shorts: cut the legs at the hem, shorts colour above it, skin below
 // short shorts (cut at the hem) + black high heels: recolour the shoe, tip the foot up onto its toes, add a stiletto heel
 const SHOE=[.07,.05,.07];
 for(const l of[p.l1,p.l2]){l.geometry=subdiv(l.geometry,cy=>cy>-.3,2);sculpt(l.geometry,(x,y,z)=>{const xw=x+l.position.x,yw=y+l.position.y,c=cheek(xw,yw,z),h=hipW(xw,yw);return(c||h)?[h,0,-c]:null});
  l.geometry=splitA(l.geometry,1,[-.17,-.835]);
  recol(l,cy=>cy>-.17?[acc[0]*F,acc[1]*F,acc[2]*F]:cy>-.835?[sk[0]*.96,sk[1]*.96,sk[2]*.96]:SHOE);
  const lp=l.geometry.attributes.position,PH=-.35;
  for(let i=0;i<lp.count;i++){const y=lp.getY(i),w=Math.max(0,Math.min(1,(-.78-y)/.1));if(!w)continue;const f=PH*w,dz=lp.getZ(i)-.25,dy=y+.92;
   lp.setY(i,-.92+dz*Math.sin(f)+dy*Math.cos(f));lp.setZ(i,.25+dz*Math.cos(f)-dy*Math.sin(f))}
  lp.needsUpdate=true;
  const hg=new THREE.BoxGeometry(.022,.11,.022);flat(hg,hg.attributes.position.count);const h=new THREE.Mesh(hg,mat(0x120c12));h.position.set(0,-.865,-.05);l.add(h)}
 // red lipstick: find the mouth on this dancer's own face mesh and put a red lip over it
 {const q=p.up.geometry.attributes.position;let zm=-9;for(let i=0;i<q.count;i++){const x=q.getX(i),y=q.getY(i),z=q.getZ(i);if(Math.abs(x)<.03&&y>1.612&&y<1.64&&z>.06&&z>zm)zm=z}
  if(zm>-9){const g=new THREE.BoxGeometry(.052,.017,.012);flat(g,g.attributes.position.count);const m=new THREE.Mesh(g,mat(0xc4101e));m.position.set(0,1.625,zm+.001);p.up.add(m)}}}

window.mkDancer=function(seed,parent,x,z,ry,o){
 const so={f:true,hs:o.hs,ts:2,sh:1,bc:o.bc,tc:o.acc,sk:PSK[o.sk|0],gl:false,scarf:null,bp:false,bag:0,old:false};if(o.hr)so.hr=o.hr;
 const spec=pSpec(seed,so);
 const g=personIn(spec,x,z,ry);SG.remove(g);parent.add(g);dress(g,o);g.userData.dancer=1;return g};
})();
