/* ===== SELF-CONTAINED CABARET DANCER (pole stages only) =====
   Used only by the Gilded Cage pole stages (casino3.js). Builds an ordinary person with the game's own mkPerson,
   then dresses THAT ONE INSTANCE: cropped strap top, bare arms, short shorts, high heels, a rounded bust. Every mesh it edits is created fresh for the dancer, and nothing in game/*.js or any other
   file is modified, so ordinary characters are never affected.
   API: window.mkDancer(seed, parent, x, z, ry, {hs, acc:[r,g,b], bc:[r,g,b], sk}) -> THREE.Group (limbs: up, a1, a2, l1, l2) ===== */
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
function recol(mesh,fn){const g=mesh.geometry,pos=g.attributes.position,col=g.attributes.color;
 for(let t=0;t<pos.count/3;t++){const i=t*3,cy=(pos.getY(i)+pos.getY(i+1)+pos.getY(i+2))/3,cx=Math.abs(pos.getX(i)+pos.getX(i+1)+pos.getX(i+2))/3,br=(col.getX(i)+col.getY(i)+col.getZ(i)+col.getX(i+1)+col.getY(i+1)+col.getZ(i+1)+col.getX(i+2)+col.getY(i+2)+col.getZ(i+2))/9,c=fn(cy,t,br,cx,(col.getX(i)+col.getX(i+1)+col.getX(i+2))/3,(col.getY(i)+col.getY(i+1)+col.getY(i+2))/3,(col.getZ(i)+col.getZ(i+1)+col.getZ(i+2))/3);
  if(c)for(let k=0;k<3;k++)col.setXYZ(i+k,c[0],c[1],c[2])}
 col.needsUpdate=true}

const ring=(r,h,y,sz,hx,par)=>{const g=new THREE.CylinderGeometry(r,r,h,12,1,true);flat(g,g.attributes.position.count);const m=new THREE.Mesh(g,mat(hx));m.material.side=THREE.DoubleSide;m.scale.z=sz;m.position.y=y;par.add(m);return m};
const ball=(r,x,y,z,hx,par)=>{const g=new THREE.SphereGeometry(r,10,8);flat(g,g.attributes.position.count);const m=new THREE.Mesh(g,mat(hx));m.scale.set(1,1.05,.95);m.position.set(x,y,z);par.add(m)};

function dress(p,o){const acc=o.acc,bc=o.bc,hx=hex(acc);
 // skin tone, sampled from the hand of this dancer's own arm mesh
 const ag=p.a1.geometry.attributes,ap=ag.position;let bi=0,bd=9;for(let i=0;i<ap.count;i++){const d=Math.abs(ap.getY(i)+.64);if(d<bd){bd=d;bi=i}}
 const sk=[ag.color.getX(bi),ag.color.getY(bi),ag.color.getZ(bi)];
 // cropped strap top: sequinned band over the chest, thin shoulder straps, bare shoulders and midriff, crisp edges
 {let g=splitA(p.up.geometry,1,[.98,1.12,1.34,1.46]);g=splitA(g,0,[-.105,-.055,.055,.105]);p.up.geometry=g}
 recol(p.up,(cy,t,br,cx,cr,cg,cb)=>{const k=.82+.3*((t*2654435761>>>0)%7/7);
  if(cy>1.12&&cy<=1.34)return[acc[0]*k,acc[1]*k,acc[2]*k];
  if(cy>1.34&&cy<1.46)return(cx>.055&&cx<.105)?[acc[0]*k,acc[1]*k,acc[2]*k]:[sk[0]*.95,sk[1]*.95,sk[2]*.95];
  if(cy>.98&&cy<=1.12)return[sk[0]*.95,sk[1]*.95,sk[2]*.95];
  if(cy>.8&&cy<=.98)return[bc[0]*.9,bc[1]*.9,bc[2]*.9];
  // leftover t-shirt neck/collar above the straps: anything not skin-coloured (blends of the top colour) becomes skin
  if(cy>1.46&&cy<1.64&&(Math.abs(cg/(cr||1)-.8)>.14||Math.abs(cb/(cr||1)-.7)>.14))return[sk[0]*.95,sk[1]*.95,sk[2]*.95];
  return null});
 // bare arms
 for(const a of[p.a1,p.a2])recol(a,()=>sk);
 // short shorts: cut the legs at the hem, shorts colour above it, skin below
 // short shorts (cut at the hem) + black high heels: recolour the shoe, tip the foot up onto its toes, add a stiletto heel
 const SHOE=[.07,.05,.07];
 for(const l of[p.l1,p.l2]){l.geometry=splitA(l.geometry,1,[-.17,-.865]);
  recol(l,cy=>cy>-.17?[bc[0]*.9,bc[1]*.9,bc[2]*.9]:cy>-.395?sk:cy<-.865?SHOE:null);
  const lp=l.geometry.attributes.position,PH=-.35;
  for(let i=0;i<lp.count;i++){const y=lp.getY(i),w=Math.max(0,Math.min(1,(-.78-y)/.1));if(!w)continue;const f=PH*w,dz=lp.getZ(i)-.25,dy=y+.92;
   lp.setY(i,-.92+dz*Math.sin(f)+dy*Math.cos(f));lp.setZ(i,.25+dz*Math.cos(f)-dy*Math.sin(f))}
  lp.needsUpdate=true;
  const hg=new THREE.BoxGeometry(.022,.11,.022);flat(hg,hg.attributes.position.count);const h=new THREE.Mesh(hg,mat(0x120c12));h.position.set(0,-.865,-.05);l.add(h)}
 // rounded bust, in the vest colour
 for(const sx of[-1,1])ball(.088,sx*.075,1.23,.105,hx,p.up);
 // fuller hips and rear, in the shorts colour (fixed to the torso)
 for(const sx of[-1,1])ball(.098,sx*.075,.86,-.085,hex(bc),p.up);}

window.mkDancer=function(seed,parent,x,z,ry,o){
 const spec=pSpec(seed,{f:true,hs:o.hs,ts:2,sh:1,bc:o.bc,tc:o.acc,sk:PSK[o.sk|0],gl:false,scarf:null,bp:false,bag:0,old:false});
 const g=personIn(spec,x,z,ry);SG.remove(g);parent.add(g);dress(g,o);return g};
})();
