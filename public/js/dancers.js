/* ===== SELF-CONTAINED CABARET DANCER (pole stages only) =====
   Used only by the Gilded Cage pole stages (casino3.js). Builds an ordinary person with the game's own mkPerson,
   then dresses THAT ONE INSTANCE: cropped sequin vest, bare arms, short shorts, a rounded bust and
   a feathered headband. Every mesh it edits is created fresh for the dancer, and nothing in game/*.js or any other
   file is modified, so ordinary characters are never affected.
   API: window.mkDancer(seed, parent, x, z, ry, {hs, acc:[r,g,b], bc:[r,g,b], sk}) -> THREE.Group (limbs: up, a1, a2, l1, l2) ===== */
(function(){
const mat=h=>fmc(h);
const hex=c=>((c[0]*255|0)<<16)|((c[1]*255|0)<<8)|(c[2]*255|0);
const GOLD=0xe8bf4a;
const flat=(g,n)=>{g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(n*3).fill(1),3))};

/* cut every triangle of a (non-indexed) geometry along the plane y=Yc so a colour change can be a crisp edge */
function splitY(g,ys){let pos=g.attributes.position.array,col=g.attributes.color.array,uv=g.attributes.uv.array;
 for(const Yc of ys){const P=[],C=[],U=[];
  const V=i=>({p:[pos[i*3],pos[i*3+1],pos[i*3+2]],c:[col[i*3],col[i*3+1],col[i*3+2]],u:[uv[i*2],uv[i*2+1]]});
  const mix=(a,b,t)=>({p:a.p.map((v,k)=>v+(b.p[k]-v)*t),c:a.c.map((v,k)=>v+(b.c[k]-v)*t),u:a.u.map((v,k)=>v+(b.u[k]-v)*t)});
  const emit=q=>{for(let k=1;k<q.length-1;k++)for(const v of[q[0],q[k],q[k+1]]){P.push(...v.p);C.push(...v.c);U.push(...v.u)}};
  for(let t=0;t<pos.length/9;t++){const v=[V(t*3),V(t*3+1),V(t*3+2)],up=[],lo=[];
   for(let i=0;i<3;i++){const a=v[i],b=v[(i+1)%3],da=a.p[1]-Yc,db=b.p[1]-Yc;
    if(da>=0)up.push(a);else lo.push(a);
    if((da>=0)!==(db>=0)){const m=mix(a,b,da/(da-db));up.push(m);lo.push(m)}}
   if(up.length>2)emit(up);if(lo.length>2)emit(lo)}
  pos=new Float32Array(P);col=new Float32Array(C);uv=new Float32Array(U)}
 const ng=new THREE.BufferGeometry();ng.setAttribute('position',new THREE.BufferAttribute(pos,3));ng.setAttribute('color',new THREE.BufferAttribute(col,3));ng.setAttribute('uv',new THREE.BufferAttribute(uv,2));return ng}

/* recolour whole triangles by the height of their centre; fn(cy,triIndex,avgBrightness) -> [r,g,b] or null to keep */
function recol(mesh,fn){const g=mesh.geometry,pos=g.attributes.position,col=g.attributes.color;
 for(let t=0;t<pos.count/3;t++){const i=t*3,cy=(pos.getY(i)+pos.getY(i+1)+pos.getY(i+2))/3,br=(col.getX(i)+col.getY(i)+col.getZ(i)+col.getX(i+1)+col.getY(i+1)+col.getZ(i+1)+col.getX(i+2)+col.getY(i+2)+col.getZ(i+2))/9,c=fn(cy,t,br);
  if(c)for(let k=0;k<3;k++)col.setXYZ(i+k,c[0],c[1],c[2])}
 col.needsUpdate=true}

const ring=(r,h,y,sz,hx,par)=>{const g=new THREE.CylinderGeometry(r,r,h,12,1,true);flat(g,g.attributes.position.count);const m=new THREE.Mesh(g,mat(hx));m.material.side=THREE.DoubleSide;m.scale.z=sz;m.position.y=y;par.add(m);return m};
const ball=(r,x,y,z,hx,par)=>{const g=new THREE.SphereGeometry(r,10,8);flat(g,g.attributes.position.count);const m=new THREE.Mesh(g,mat(hx));m.scale.set(1,1.05,.95);m.position.set(x,y,z);par.add(m)};

function dress(p,o){const acc=o.acc,bc=o.bc,hx=hex(acc);
 // skin tone, sampled from the hand of this dancer's own arm mesh
 const ag=p.a1.geometry.attributes,ap=ag.position;let bi=0,bd=9;for(let i=0;i<ap.count;i++){const d=Math.abs(ap.getY(i)+.64);if(d<bd){bd=d;bi=i}}
 const sk=[ag.color.getX(bi),ag.color.getY(bi),ag.color.getZ(bi)];
 // cropped vest: sequinned band, bare midriff, with crisp edges
 p.up.geometry=splitY(p.up.geometry,[1.12,1.46]);
 recol(p.up,(cy,t)=>cy>1.12&&cy<1.46?(k=>[acc[0]*k,acc[1]*k,acc[2]*k])(.82+.3*((t*2654435761>>>0)%7/7)):cy>.8&&cy<=1.12?[sk[0]*.95,sk[1]*.95,sk[2]*.95]:null);
 // bare arms
 for(const a of[p.a1,p.a2])recol(a,()=>sk);
 // short shorts: cut the legs at the hem, shorts colour above it, skin below
 for(const l of[p.l1,p.l2]){l.geometry=splitY(l.geometry,[-.17]);recol(l,cy=>cy>-.17?[bc[0]*.9,bc[1]*.9,bc[2]*.9]:cy>-.395?sk:null)}
 // rounded bust, in the vest colour
 for(const sx of[-1,1])ball(.088,sx*.075,1.23,.105,hx,p.up);
 // feathered headband
 p.up.geometry.computeBoundingBox();const top=p.up.geometry.boundingBox.max.y;
 ring(.118,.035,top-.075,1,GOLD,p.up);
 [[-.07,-.12],[0,-.2],[.07,-.12]].forEach(([x,t],i)=>{const g=new THREE.BoxGeometry(.03,.2,.015);flat(g,g.attributes.position.count);const m=new THREE.Mesh(g,mat(i===1?GOLD:hx));m.position.set(x,top+.02,-.06);m.rotation.z=t*1.4;p.up.add(m)})}

window.mkDancer=function(seed,parent,x,z,ry,o){
 const spec=pSpec(seed,{f:true,hs:o.hs,ts:2,sh:1,bc:o.bc,tc:o.acc,sk:PSK[o.sk|0],gl:false,scarf:null,bp:false,bag:0,old:false});
 const g=personIn(spec,x,z,ry);SG.remove(g);parent.add(g);dress(g,o);return g};
})();
