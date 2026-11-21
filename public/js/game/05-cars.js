/* ---------- Ford Fiesta (second car): standard materials, projected from the supplied sheet ---------- */
var CARI=0,FU={uTint:{value:new THREE.Vector3(1,1,1)}},fiesRecolor=function(){};
const fies=new THREE.Group();fies.visible=false;car.add(fies);
{const img=new Image(),tex=new THREE.Texture(img);tex.flipY=false;tex.generateMipmaps=true;tex.minFilter=THREE.LinearMipmapLinearFilter;tex.magFilter=THREE.LinearFilter;
 const cv=document.createElement('canvas');cv.width=cv.height=1024;const cx=cv.getContext('2d'),bodyTex=new THREE.CanvasTexture(cv);bodyTex.flipY=false;bodyTex.minFilter=THREE.LinearMipmapLinearFilter;bodyTex.magFilter=THREE.LinearFilter;
 let orig=null,mk=null,lk=null,out=null;const LUT=new Float32Array(256);for(let i=0;i<256;i++)LUT[i]=Math.pow(i/255,1.6)*1.08;
 const sm=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
 fiesRecolor=function(){if(!orig)return;const d=out.data,o=orig.data,t=FU.uTint.value,n=1024*1024;for(let i=0;i<n;i++){const m=mk[i]/255,q=i*4;if(m<.004){d[q]=o[q];d[q+1]=o[q+1];d[q+2]=o[q+2];continue}const L=LUT[lk[i]]*255;d[q]=o[q]+(t.x*L-o[q])*m;d[q+1]=o[q+1]+(t.y*L-o[q+1])*m;d[q+2]=o[q+2]+(t.z*L-o[q+2])*m}cx.putImageData(out,0,0);bodyTex.needsUpdate=true};
 const mImg=new Image();let rd=0;
 const build=()=>{if(++rd<2)return;tex.needsUpdate=true;cx.drawImage(img,0,0);FU.uTint.value.set(...paintC);orig=cx.getImageData(0,0,1024,1024);out=cx.createImageData(1024,1024);for(let i=3;i<out.data.length;i+=4)out.data[i]=255;
  const mc=document.createElement('canvas');mc.width=mc.height=1024;const mx=mc.getContext('2d');mx.drawImage(mImg,0,0);const md=mx.getImageData(0,0,1024,1024).data,n=1024*1024;mk=new Uint8Array(n);lk=new Uint8Array(n);
  for(let i=0;i<n;i++){const l=(.299*orig.data[i*4]+.587*orig.data[i*4+1]+.114*orig.data[i*4+2])/255;lk[i]=Math.round(Math.min(1,l)*255);mk[i]=md[i*4]}fiesRecolor()};
 img.onload=build;mImg.onload=build;img.src=FZ_IMG;mImg.src=FZ_MASK;
 // hull from silhouette stations
 const pos=[],idx=[],rings=[];
 const ring=(z,yb,H,w)=>{const ys=1.05,ysp=Math.min(ys,H-.04),R=[],y3=Math.min(yb+.25,H-.1);
  const r=[[w*.84,yb],[w*.97,yb+.09],[w,y3]];
  if(H>ysp+.06){r.push([w,ysp],[w*.9,ysp+.4*(H-ysp)],[w*.79,ysp+.8*(H-ysp)],[w*.73,H-.05],[w*.69,H])}else{r.push([w,Math.max(y3+.01,H-.09)],[w*.97,H-.06],[w*.92,H-.035],[w*.84,H-.015],[w*.6,H])}
  R.push([0,yb]);for(const q of r)R.push([q[0],q[1]]);R.push([0,H]);for(let i=r.length-1;i>=0;i--)R.push([-r[i][0],r[i][1]]);return R.map(q=>[q[0],q[1],z])};
 for(const s of FZ.st)rings.push(ring(s[0],s[1],Math.max(s[2],s[1]+.12),Math.max(s[3],.12)));
 const K=rings[0].length;for(const r of rings)for(const q of r)pos.push(...q);
 for(let i=0;i<rings.length-1;i++)for(let k=0;k<K;k++){const k2=(k+1)%K,a=i*K+k,b=i*K+k2,c=(i+1)*K+k,d=(i+1)*K+k2;idx.push(a,b,c,b,d,c)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
 {const mid=Math.floor(rings.length/2),vi=mid*K+Math.floor(K/2),ny=g.attributes.normal.getY(vi);if(ny<0){for(let t=0;t<idx.length;t+=3){const x=idx[t+1];idx[t+1]=idx[t+2];idx[t+2]=x}}}
 const cap=(i,dirz)=>{const r=rings[i];let cx=0,cy=0,cz=r[0][2];for(const q of r){cx+=q[0];cy+=q[1]}cx/=K;cy/=K;const ci=pos.length/3;pos.push(cx,cy,cz);for(let k=0;k<K;k++){const a=i*K+k,b=i*K+(k+1)%K,ax=pos[a*3]-cx,ay=pos[a*3+1]-cy,bx=pos[b*3]-cx,by=pos[b*3+1]-cy,nz=ax*by-ay*bx;if(nz*dirz>0)idx.push(ci,a,b);else idx.push(ci,b,a)}};
 cap(0,1);cap(rings.length-1,-1);
 g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();

 const bodyMs=[];
 const P5=[FZ.pL,FZ.pR,FZ.pT,FZ.pF,FZ.pB];
 const uvOf=(k,x,y,z)=>{const p=P5[k];let u,v;if(k===0){u=p[0]-z*p[1];v=p[2]-y*p[3]}else if(k===1){u=p[0]+z*p[1];v=p[2]-y*p[3]}else if(k===2){u=p[0]-z*p[1];v=p[2]+x*p[3]}else if(k===3){u=p[0]+x*p[1];v=p[2]-y*p[3]}else{u=p[0]-x*p[1];v=p[2]-y*p[3]}return[u/1254,v/1254]};
 const sst=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
 const gN=new THREE.BufferGeometry();gN.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));gN.setIndex(idx);gN.computeVertexNormals();
 const NV=pos.length/3,nrm=gN.attributes.normal,posA=new THREE.Float32BufferAttribute(pos,3),idxA=new THREE.BufferAttribute(new Uint16Array(idx),1);
 const UVs=[0,1,2,3,4].map(()=>new Float32Array(NV*2)),COLs=[0,1,2,3,4].map(()=>new Float32Array(NV*4));
 for(let v=0;v<NV;v++){const x=pos[v*3],y=pos[v*3+1],z=pos[v*3+2],nx=nrm.getX(v),ny=nrm.getY(v),nz=nrm.getZ(v),E=5;
  let w=[Math.pow(Math.max(nx,0),E),Math.pow(Math.max(-nx,0),E),ny>0?Math.pow(ny,E):0,Math.pow(Math.max(nz,0),E),Math.pow(Math.max(-nz,0),E)];
  const lz=sst(1.42,1.58,z)*sst(.45,.55,y)*(1-sst(.9,.98,y))*sst(.2,.3,Math.abs(x));w[0]*=1-lz;w[1]*=1-lz;const zt=sst(1.5,1.65,z)*sst(.3,.4,Math.abs(x));w[3]+=w[2]*zt;w[2]*=1-zt;
  let cum=0;const dk=1-.9*sst(.55,.9,-ny);
  for(let k=0;k<5;k++){cum+=w[k];const u=uvOf(k,x,y,z);UVs[k][v*2]=u[0];UVs[k][v*2+1]=u[1];const a=cum>1e-9?w[k]/cum:0;COLs[k].set([dk,dk,dk,k===0?1:a],v*4)}}
 const bodyG=new THREE.Group();bodyG.scale.y=.93;fies.add(bodyG);
 const FGEO=[];
 for(let k=0;k<5;k++){const g=new THREE.BufferGeometry();FGEO.push(g);g.setAttribute('position',posA);g.setIndex(idxA);g.setAttribute('uv',new THREE.BufferAttribute(UVs[k],2));g.setAttribute('color',new THREE.BufferAttribute(COLs[k],4));
  const m=new THREE.MeshBasicMaterial({map:bodyTex,vertexColors:true,transparent:k>0,depthWrite:k===0});if(k>0){m.polygonOffset=true;m.polygonOffsetFactor=-1;m.polygonOffsetUnits=-1}
  const me=new THREE.Mesh(g,m);me.frustumCulled=false;me.renderOrder=10+k;bodyG.add(me);bodyMs.push(m)}
 const mirM=new THREE.MeshBasicMaterial({color:0xffffff}),stM=new THREE.MeshBasicMaterial({color:0x151518});for(const sx of[1,-1]){const m=new THREE.Mesh(new THREE.BoxGeometry(.11,.1,.17),mirM);m.position.set(sx*.9,1.03,.74);m.rotation.y=-sx*.3;bodyG.add(m);const st=new THREE.Mesh(new THREE.BoxGeometry(.1,.03,.06),stM);st.position.set(sx*.82,.98,.75);bodyG.add(st)}
 // wheels
 const tyreM=new THREE.MeshBasicMaterial({color:0x151518}),R_=.335,wzs=FZ.wz,wls=[];
 const dM=new THREE.MeshBasicMaterial({map:tex});
 function disc(sx,cx,cy){const gd=new THREE.CircleGeometry(R_*.99,18),p=gd.attributes.position,uv=[];for(let i=0;i<p.count;i++){uv.push((cx+p.getX(i)/R_*FZ.wl.rp)/1254,(cy-p.getY(i)/R_*FZ.wl.rp)/1254)}gd.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));gd.rotateY(sx>0?Math.PI/2:-Math.PI/2);gd.translate(sx*.103,0,0);return new THREE.Mesh(gd,dM)}
 const stz=z=>{let b=FZ.st[0];for(const s of FZ.st)if(Math.abs(s[0]-z)<Math.abs(b[0]-z))b=s;return b};
 for(const sx of[1,-1])for(let k=0;k<2;k++){const z=wzs[k],w=stz(z)[3],piv=new THREE.Group(),spin=new THREE.Group();piv.position.set(sx*(w+.015-.1),R_,z);
  const ty=new THREE.Mesh(new THREE.CylinderGeometry(R_*.985,R_*.985,.2,14).rotateZ(Math.PI/2),tyreM);spin.add(ty);
  const wl=sx>0?FZ.wl.L:FZ.wl.R,cxp=sx>0?(k?wl[1]:wl[0]):(k?wl[0]:wl[1]);
  spin.add(disc(sx,cxp,wl[2]));piv.add(spin);fies.add(piv);wls.push({piv,spin,front:k==0})}
 const mergeG=(L)=>{const P=[],U2=[],I=[];let o=0;for(const g of L){const p=g.attributes.position,u=g.attributes.uv;for(let i=0;i<p.count;i++){P.push(p.getX(i),p.getY(i),p.getZ(i));U2.push(u?u.getX(i):0,u?u.getY(i):0)}const ix=g.index;for(let i=0;i<ix.count;i++)I.push(ix.getX(i)+o);o+=p.count}const m=new THREE.BufferGeometry();m.setAttribute('position',new THREE.Float32BufferAttribute(P,3));m.setAttribute('uv',new THREE.Float32BufferAttribute(U2,2));m.setIndex(I);return m};
 const stGeo=[],dsGeo=[];for(const sx of[1,-1])for(let k=0;k<2;k++){const z=wzs[k],w=stz(z)[3],px=sx*(w+.015-.1);const a=new THREE.CylinderGeometry(R_*.985,R_*.985,.2,14).rotateZ(Math.PI/2);a.translate(px,R_,z);stGeo.push(a);const wl=sx>0?FZ.wl.L:FZ.wl.R,cxp=sx>0?(k?wl[1]:wl[0]):(k?wl[0]:wl[1]);const d=disc(sx,cxp,wl[2]).geometry;d.translate(px,R_,z);dsGeo.push(d)}
 const wGeo=[mergeG(stGeo),mergeG(dsGeo)],FV={},FTM=new THREE.MeshBasicMaterial({color:0x151518}),FDM=new THREE.MeshBasicMaterial({map:tex});
 window.fiesInst=function(col){if(!orig)return null;const key=col.map(x=>Math.round(x*20)).join(',');let V=FV[key];
  if(!V){const c=document.createElement('canvas');c.width=c.height=1024;const x2=c.getContext('2d'),tx=new THREE.CanvasTexture(c);tx.flipY=false;tx.minFilter=THREE.LinearMipmapLinearFilter;tx.magFilter=THREE.LinearFilter;
   const id=x2.createImageData(1024,1024),d=id.data,o=orig.data,n=1024*1024;for(let i=0;i<n;i++){const m=mk[i]/255,q=i*4;d[q+3]=255;if(m<.004){d[q]=o[q];d[q+1]=o[q+1];d[q+2]=o[q+2];continue}const L=LUT[lk[i]]*255;d[q]=o[q]+(col[0]*L-o[q])*m;d[q+1]=o[q+1]+(col[1]*L-o[q+1])*m;d[q+2]=o[q+2]+(col[2]*L-o[q+2])*m}x2.putImageData(id,0,0);tx.needsUpdate=true;
   const ms=[];for(let k=0;k<5;k++){const m=new THREE.MeshBasicMaterial({map:tx,vertexColors:true,transparent:k>0,depthWrite:k===0});if(k>0){m.polygonOffset=true;m.polygonOffsetFactor=-1;m.polygonOffsetUnits=-1}ms.push(m)}V=FV[key]={ms}}
  const g=new THREE.Group(),b=new THREE.Group();b.scale.y=.93;g.add(b);for(let k=0;k<5;k++){const me=new THREE.Mesh(FGEO[k],V.ms[k]);me.frustumCulled=false;me.renderOrder=10+k;b.add(me)}
  g.add(new THREE.Mesh(wGeo[0],FTM),new THREE.Mesh(wGeo[1],FDM));return g};
 window.fiesCivUpd=function(l){for(const k in FV)for(const m of FV[k].ms)m.color.setRGB(l.x,l.y,l.z);FTM.color.setRGB(.085*l.x,.085*l.y,.09*l.z);FDM.color.setRGB(l.x,l.y,l.z)};
 window.fiesUpd=function(){const l=U.uLight.value;for(const m of bodyMs)m.color.setRGB(l.x,l.y,l.z);mirM.color.setRGB(paintC[0]*.93*l.x,paintC[1]*.93*l.y,paintC[2]*.93*l.z);tyreM.color.setRGB(.085*l.x,.085*l.y,.09*l.z);dM.color.setRGB(l.x,l.y,l.z);for(const w of wls){w.spin.rotation.x=GS_SPIN*.275/R_;if(w.front)w.piv.rotation.y=GS.steer*.5}};
}
const c1Kids=car.children.filter(k=>k!==fies&&k!==shadow&&k!==beam);
function setCar(i){CARI=i|0;for(const k of c1Kids)k.visible=!CARI;fies.visible=CARI===1;van.visible=CARI===2;lrv.visible=CARI===3;applyUpg();applyPaint()}
var VZ={"L": 4.4, "BW": 1.85, "W": 1672, "H": 941, "pL": [437.5, 186.13636363636363, 368.0, 186.13636363636363], "pR": [474.5, 193.4090909090909, 720.0, 193.4090909090909], "pT": [462.0, 147.72727272727272, 857.6477272727273, 147.72727272727272], "pF": [1082.0, 188.1081081081081, 529.0, 205.07465644820294], "pB": [1467.0, 190.27027027027026, 529.0, 205.6157505285412], "st": [[2.195, 0.281, 0.473, 0.925], [2.192, 0.277, 0.587, 0.925], [2.183, 0.27, 0.694, 0.925], [2.167, 0.264, 0.766, 0.925], [2.145, 0.259, 0.815, 0.925], [2.118, 0.255, 0.865, 0.925], [2.084, 0.251, 0.925, 0.925], [2.044, 0.247, 0.983, 0.925], [1.999, 0.244, 1.03, 0.925], [1.948, 0.241, 1.065, 0.925], [1.891, 0.238, 1.092, 0.925], [1.829, 0.236, 1.114, 0.925], [1.762, 0.231, 1.132, 0.925], [1.69, 0.223, 1.149, 0.923], [1.613, 0.213, 1.164, 0.92], [1.531, 0.205, 1.179, 0.916], [1.445, 0.201, 1.196, 0.913], [1.355, 0.2, 1.221, 0.911], [1.262, 0.201, 1.261, 0.911], [1.164, 0.204, 1.321, 0.911], [1.064, 0.211, 1.393, 0.911], [0.96, 0.22, 1.472, 0.911], [0.853, 0.227, 1.552, 0.912], [0.745, 0.23, 1.631, 0.914], [0.634, 0.231, 1.705, 0.916], [0.521, 0.231, 1.764, 0.918], [0.407, 0.231, 1.801, 0.92], [0.291, 0.231, 1.82, 0.922], [0.175, 0.232, 1.829, 0.924], [0.058, 0.233, 1.835, 0.925], [-0.058, 0.234, 1.838, 0.925], [-0.175, 0.235, 1.841, 0.925], [-0.291, 0.236, 1.844, 0.925], [-0.407, 0.236, 1.846, 0.925], [-0.521, 0.236, 1.847, 0.925], [-0.634, 0.236, 1.848, 0.925], [-0.745, 0.236, 1.848, 0.924], [-0.853, 0.236, 1.848, 0.922], [-0.96, 0.235, 1.848, 0.921], [-1.064, 0.231, 1.848, 0.919], [-1.164, 0.223, 1.848, 0.918], [-1.262, 0.213, 1.848, 0.918], [-1.355, 0.205, 1.848, 0.918], [-1.445, 0.201, 1.848, 0.919], [-1.531, 0.2, 1.847, 0.921], [-1.613, 0.201, 1.846, 0.922], [-1.69, 0.205, 1.844, 0.924], [-1.762, 0.213, 1.842, 0.925], [-1.829, 0.224, 1.836, 0.925], [-1.891, 0.234, 1.821, 0.925], [-1.948, 0.241, 1.785, 0.925], [-1.999, 0.245, 1.709, 0.925], [-2.044, 0.249, 1.579, 0.925], [-2.084, 0.253, 1.38, 0.925], [-2.118, 0.258, 1.114, 0.925], [-2.145, 0.267, 0.835, 0.925], [-2.167, 0.279, 0.627, 0.925], [-2.183, 0.293, 0.519, 0.925], [-2.192, 0.306, 0.479, 0.925], [-2.195, 0.315, 0.467, 0.925]], "wl": {"c": [1481.5, 833.5, 107.5]}, "wz": [1.354, -1.613], "H0": 1.8481074481074482};
var VZ_IMG="assets/vz-img.jpg";
/* ---------- Royal Mail van (third car): projected from the supplied sheet ---------- */
const van=new THREE.Group();van.visible=false;car.add(van);
const vanBodyMs=[];var vanUpd=function(){};
{const img=new Image(),tex=new THREE.Texture(img);tex.flipY=false;tex.generateMipmaps=true;tex.minFilter=THREE.LinearMipmapLinearFilter;tex.magFilter=THREE.LinearFilter;tex.anisotropy=4;
 img.onload=()=>{tex.needsUpdate=true};img.src=VZ_IMG;
 const IW=VZ.W,IH2=VZ.H;
 const pos=[],idx=[],rings=[];
 const ring=(z,yb,H,w)=>{const c=Math.min(1,Math.max(0,(H-.9)/.3)),sh=H-(.09+.19*c),y3=Math.min(yb+.25,H-.1),hh=H-sh,R=[];
  const r=[[w*.9,yb],[w*.98,yb+.08],[w,y3],[w,Math.max(y3+.01,sh)],[w*(.985-.005*c),sh+hh*.55],[w*(.93-.0*c),sh+hh*.88],[w*(.84+.05*c),H]];
  R.push([0,yb]);for(const q of r)R.push([q[0],q[1]]);R.push([0,H]);for(let i=r.length-1;i>=0;i--)R.push([-r[i][0],r[i][1]]);return R.map(q=>[q[0],q[1],z])};
 for(const s of VZ.st)rings.push(ring(s[0],s[1],Math.max(s[2],s[1]+.12),Math.max(s[3],.12)));
 const K=rings[0].length;for(const r of rings)for(const q of r)pos.push(...q);
 for(let i=0;i<rings.length-1;i++)for(let k=0;k<K;k++){const k2=(k+1)%K,a=i*K+k,b=i*K+k2,c=(i+1)*K+k,d=(i+1)*K+k2;idx.push(a,b,c,b,d,c)}
 {const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
  const mid=Math.floor(rings.length/2),vi=mid*K+Math.floor(K/2),ny=g.attributes.normal.getY(vi);if(ny<0){for(let t=0;t<idx.length;t+=3){const x=idx[t+1];idx[t+1]=idx[t+2];idx[t+2]=x}}}
 const cap=(i,dirz)=>{const r=rings[i];let cx=0,cy=0,cz=r[0][2];for(const q of r){cx+=q[0];cy+=q[1]}cx/=K;cy/=K;const ci=pos.length/3;pos.push(cx,cy,cz);for(let k=0;k<K;k++){const a=i*K+k,b=i*K+(k+1)%K,ax=pos[a*3]-cx,ay=pos[a*3+1]-cy,bx=pos[b*3]-cx,by=pos[b*3+1]-cy,nz=ax*by-ay*bx;if(nz*dirz>0)idx.push(ci,a,b);else idx.push(ci,b,a)}};
 cap(0,1);cap(rings.length-1,-1);
 const gN=new THREE.BufferGeometry();gN.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));gN.setIndex(idx);gN.computeVertexNormals();
 const P5=[VZ.pL,VZ.pR,VZ.pT,VZ.pF,VZ.pB];
 const uvOf=(k,x,y,z)=>{const p=P5[k];let u,v;if(k===0){u=p[0]-z*p[1];v=p[2]-y*p[3]}else if(k===1){u=p[0]+z*p[1];v=p[2]-y*p[3]}else if(k===2){u=p[0]+z*p[1];v=p[2]-Math.abs(x)*p[3]}else if(k===3){u=p[0]+x*p[1];v=p[2]-y*p[3]}else{u=p[0]-x*p[1];v=p[2]-y*p[3]}return[u/IW,v/IH2]};
 const NV=pos.length/3,nrm=gN.attributes.normal,posA=new THREE.Float32BufferAttribute(pos,3),idxA=new THREE.BufferAttribute(new Uint16Array(idx),1);
 const UVs=[0,1,2,3,4].map(()=>new Float32Array(NV*2)),COLs=[0,1,2,3,4].map(()=>new Float32Array(NV*4));
 for(let v=0;v<NV;v++){const x=pos[v*3],y=pos[v*3+1],z=pos[v*3+2],nx=nrm.getX(v),ny=nrm.getY(v),nz=nrm.getZ(v),E=5;
  const w=[Math.pow(Math.max(nx,0),E),Math.pow(Math.max(-nx,0),E),ny>0?Math.pow(ny,E):0,Math.pow(Math.max(nz,0),E),Math.pow(Math.max(-nz,0),E)];
  let cum=0;const dk=1-.9*Math.min(1,Math.max(0,(-ny-.55)/.35));
  for(let k=0;k<5;k++){cum+=w[k];const u=uvOf(k,x,y,z);UVs[k][v*2]=u[0];UVs[k][v*2+1]=u[1];const a=cum>1e-9?w[k]/cum:0;COLs[k].set([dk,dk,dk,k===0?1:a],v*4)}}
 const bodyG=new THREE.Group();van.add(bodyG);
 const VGEO=[];
 for(let k=0;k<5;k++){const g=new THREE.BufferGeometry();VGEO.push(g);g.setAttribute('position',posA);g.setIndex(idxA);g.setAttribute('uv',new THREE.BufferAttribute(UVs[k],2));g.setAttribute('color',new THREE.BufferAttribute(COLs[k],4));
  const m=new THREE.MeshBasicMaterial({map:tex,vertexColors:true,transparent:k>0,depthWrite:k===0});if(k>0){m.polygonOffset=true;m.polygonOffsetFactor=-1;m.polygonOffsetUnits=-1}
  const me=new THREE.Mesh(g,m);me.frustumCulled=false;me.renderOrder=10+k;bodyG.add(me);vanBodyMs.push(m)}
 const mirM=new THREE.MeshBasicMaterial({color:0x151518});for(const sx of[1,-1]){const m=new THREE.Mesh(new THREE.BoxGeometry(.09,.15,.13),mirM);m.position.set(sx*.99,1.17,.66);m.rotation.y=-sx*.25;bodyG.add(m)}
 const tyreM=new THREE.MeshBasicMaterial({color:0x151518}),R_=.33,wzs=VZ.wz,wls=[],dM=new THREE.MeshBasicMaterial({map:tex});
 function disc(sx){const gd=new THREE.CircleGeometry(R_*.99,18),p=gd.attributes.position,uv=[],c=VZ.wl.c;for(let i=0;i<p.count;i++)uv.push((c[0]+p.getX(i)/R_*c[2])/IW,(c[1]-p.getY(i)/R_*c[2])/IH2);gd.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));gd.rotateY(sx>0?Math.PI/2:-Math.PI/2);gd.translate(sx*.103,0,0);return new THREE.Mesh(gd,dM)}
 const stz=z=>{let b=VZ.st[0];for(const s of VZ.st)if(Math.abs(s[0]-z)<Math.abs(b[0]-z))b=s;return b};
 for(const sx of[1,-1])for(let k=0;k<2;k++){const z=wzs[k],w=stz(z)[3],piv=new THREE.Group(),spin=new THREE.Group();piv.position.set(sx*(w+.015-.1),R_,z);
  spin.add(new THREE.Mesh(new THREE.CylinderGeometry(R_*.985,R_*.985,.2,14).rotateZ(Math.PI/2),tyreM));spin.add(disc(sx));piv.add(spin);van.add(piv);wls.push({piv,spin,front:k==0})}
 const mergeG=(L)=>{const P=[],U2=[],I=[];let o=0;for(const g of L){const p=g.attributes.position,u=g.attributes.uv;for(let i=0;i<p.count;i++){P.push(p.getX(i),p.getY(i),p.getZ(i));U2.push(u?u.getX(i):0,u?u.getY(i):0)}const ix=g.index;for(let i=0;i<ix.count;i++)I.push(ix.getX(i)+o);o+=p.count}const m=new THREE.BufferGeometry();m.setAttribute('position',new THREE.Float32BufferAttribute(P,3));m.setAttribute('uv',new THREE.Float32BufferAttribute(U2,2));m.setIndex(I);return m};
 const stG=[],dsG=[];for(const sx of[1,-1])for(let k=0;k<2;k++){const z=wzs[k],w=stz(z)[3],px=sx*(w+.015-.1);const a=new THREE.CylinderGeometry(R_*.985,R_*.985,.2,14).rotateZ(Math.PI/2);a.translate(px,R_,z);stG.push(a);const d=disc(sx).geometry;d.translate(px,R_,z);dsG.push(d)}
 const vwG=[mergeG(stG),mergeG(dsG)],vms=[],VTM=new THREE.MeshBasicMaterial({color:0x151518}),VDM=new THREE.MeshBasicMaterial({map:tex});
 for(let k=0;k<5;k++){const m=new THREE.MeshBasicMaterial({map:tex,vertexColors:true,transparent:k>0,depthWrite:k===0});if(k>0){m.polygonOffset=true;m.polygonOffsetFactor=-1;m.polygonOffsetUnits=-1}vms.push(m)}
 window.vanInst=function(){const g=new THREE.Group();for(let k=0;k<5;k++){const me=new THREE.Mesh(VGEO[k],vms[k]);me.frustumCulled=false;me.renderOrder=10+k;g.add(me)}g.add(new THREE.Mesh(vwG[0],VTM),new THREE.Mesh(vwG[1],VDM));return g};
 window.vanCivUpd=function(l){for(const m of vms)m.color.setRGB(l.x,l.y,l.z);VTM.color.setRGB(.085*l.x,.085*l.y,.09*l.z);VDM.color.setRGB(l.x,l.y,l.z)};
 vanUpd=function(){const l=U.uLight.value;for(const m of vanBodyMs)m.color.setRGB(l.x,l.y,l.z);tyreM.color.setRGB(.085*l.x,.085*l.y,.09*l.z);dM.color.setRGB(l.x,l.y,l.z);mirM.color.setRGB(.09*l.x,.09*l.y,.1*l.z);for(const w of wls){w.spin.rotation.x=GS_SPIN*.275/R_;if(w.front)w.piv.rotation.y=GS.steer*.5}};
}
var LZ={"L": 3.9, "BW": 1.79, "W": 1448, "H": 1086, "pL": [361.0, 179.4871794871795, 504.0, 200.0], "pR": [1087.0, 180.0, 504.0, 200.0], "pT": [1094.0, 174.87179487179486, 837.0, 174.87179487179486], "pF": [193.0, 179.4871794871795, 1049.0, 208.33333333333334], "pB": [558.0, 179.4871794871795, 1049.0, 208.33333333333334], "st": [[1.946, 0.55, 0.68, 0.832], [1.944, 0.548, 0.682, 0.83], [1.94, 0.545, 0.685, 0.827], [1.932, 0.542, 0.688, 0.824], [1.921, 0.54, 0.69, 0.822], [1.908, 0.54, 0.706, 0.819], [1.891, 0.54, 0.802, 0.818], [1.871, 0.54, 0.983, 0.819], [1.848, 0.54, 1.093, 0.823], [1.823, 0.539, 1.145, 0.829], [1.794, 0.535, 1.199, 0.833], [1.763, 0.52, 1.236, 0.845], [1.729, 0.446, 1.254, 0.868], [1.692, 0.319, 1.263, 0.885], [1.652, 0.251, 1.269, 0.891], [1.61, 0.24, 1.273, 0.892], [1.565, 0.24, 1.277, 0.892], [1.518, 0.24, 1.28, 0.892], [1.468, 0.24, 1.286, 0.892], [1.416, 0.24, 1.295, 0.892], [1.362, 0.24, 1.303, 0.892], [1.306, 0.24, 1.312, 0.892], [1.248, 0.24, 1.322, 0.892], [1.187, 0.24, 1.328, 0.892], [1.125, 0.24, 1.33, 0.892], [1.061, 0.24, 1.33, 0.892], [0.995, 0.242, 1.329, 0.889], [0.928, 0.254, 1.324, 0.877], [0.859, 0.297, 1.316, 0.857], [0.789, 0.363, 1.32, 0.848], [0.718, 0.405, 1.356, 0.849], [0.645, 0.41, 1.433, 0.861], [0.572, 0.398, 1.528, 0.881], [0.497, 0.391, 1.638, 0.89], [0.422, 0.39, 1.752, 0.892], [0.346, 0.39, 1.843, 0.892], [0.27, 0.39, 1.889, 0.892], [0.193, 0.39, 1.905, 0.892], [0.116, 0.39, 1.914, 0.892], [0.039, 0.39, 1.92, 0.892], [-0.039, 0.39, 1.925, 0.892], [-0.116, 0.39, 1.934, 0.892], [-0.193, 0.39, 1.959, 0.892], [-0.27, 0.39, 1.999, 0.892], [-0.346, 0.39, 2.026, 0.891], [-0.422, 0.393, 2.034, 0.882], [-0.497, 0.395, 2.035, 0.865], [-0.572, 0.38, 2.035, 0.855], [-0.645, 0.331, 2.035, 0.861], [-0.718, 0.271, 2.035, 0.88], [-0.789, 0.244, 2.035, 0.89], [-0.859, 0.24, 2.035, 0.892], [-0.928, 0.24, 2.035, 0.892], [-0.995, 0.24, 2.035, 0.892], [-1.061, 0.24, 2.035, 0.892], [-1.125, 0.24, 2.035, 0.892], [-1.187, 0.24, 2.035, 0.892], [-1.248, 0.24, 2.035, 0.892], [-1.306, 0.24, 2.035, 0.889], [-1.362, 0.24, 2.032, 0.877], [-1.416, 0.244, 2.013, 0.861], [-1.468, 0.265, 1.977, 0.852], [-1.518, 0.302, 1.958, 0.848], [-1.565, 0.306, 1.95, 0.84], [-1.61, 0.289, 1.935, 0.822], [-1.652, 0.354, 1.89, 0.794], [-1.692, 0.533, 1.773, 0.749], [-1.729, 0.679, 1.626, 0.652], [-1.763, 0.728, 1.556, 0.515], [-1.794, 0.735, 1.545, 0.446], [-1.823, 0.735, 1.545, 0.435], [-1.848, 0.735, 1.545, 0.435], [-1.871, 0.737, 1.543, 0.434], [-1.891, 0.745, 1.538, 0.433], [-1.908, 0.762, 1.528, 0.432], [-1.921, 0.784, 1.511, 0.432], [-1.932, 0.802, 1.491, 0.432], [-1.94, 0.809, 1.478, 0.432], [-1.944, 0.81, 1.472, 0.432], [-1.946, 0.81, 1.47, 0.432]], "wl": {"c": [139.0, 420.0, 80.5]}, "wz": [1.237, -1.07], "H0": 2.04, "WR": 0.448};
var LZ_IMG="assets/lz-img.jpg";
/* ---------- Land Rover Defender (fourth car): projected from the supplied sheet ---------- */
const lrv=new THREE.Group();lrv.visible=false;car.add(lrv);
const lrBodyMs=[];var lrUpd=function(){};
{const img=new Image(),tex=new THREE.Texture(img);tex.flipY=false;tex.generateMipmaps=true;tex.minFilter=THREE.LinearMipmapLinearFilter;tex.magFilter=THREE.LinearFilter;tex.anisotropy=4;
 img.onload=()=>{tex.needsUpdate=true};img.src=LZ_IMG;
 const IW=LZ.W,IH2=LZ.H;
 const pos=[],idx=[],rings=[];
 const ring=(z,yb,H,w)=>{const hh=Math.min(.16,(H-yb)*.3),y3=Math.min(yb+.14,H-hh-.02),R=[];
  const r=[[w*.93,yb],[w*.995,yb+.06],[w,y3],[w,H-hh-.01],[w*.985,H-hh*.45],[w*.9,H-.012],[w*.8,H]];
  R.push([0,yb]);for(const q of r)R.push([q[0],q[1]]);R.push([0,H]);for(let i=r.length-1;i>=0;i--)R.push([-r[i][0],r[i][1]]);return R.map(q=>[q[0],q[1],z])};
 for(const s of LZ.st)rings.push(ring(s[0],s[1],Math.max(s[2],s[1]+.12),Math.max(s[3],.12)));
 const K=rings[0].length;for(const r of rings)for(const q of r)pos.push(...q);
 for(let i=0;i<rings.length-1;i++)for(let k=0;k<K;k++){const k2=(k+1)%K,a=i*K+k,b=i*K+k2,c=(i+1)*K+k,d=(i+1)*K+k2;idx.push(a,b,c,b,d,c)}
 {const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
  const mid=Math.floor(rings.length/2),vi=mid*K+Math.floor(K/2),ny=g.attributes.normal.getY(vi);if(ny<0){for(let t=0;t<idx.length;t+=3){const x=idx[t+1];idx[t+1]=idx[t+2];idx[t+2]=x}}}
 const cap=(i,dirz)=>{const r=rings[i];let cx=0,cy=0,cz=r[0][2];for(const q of r){cx+=q[0];cy+=q[1]}cx/=K;cy/=K;const ci=pos.length/3;pos.push(cx,cy,cz);for(let k=0;k<K;k++){const a=i*K+k,b=i*K+(k+1)%K,ax=pos[a*3]-cx,ay=pos[a*3+1]-cy,bx=pos[b*3]-cx,by=pos[b*3+1]-cy,nz=ax*by-ay*bx;if(nz*dirz>0)idx.push(ci,a,b);else idx.push(ci,b,a)}};
 cap(0,1);cap(rings.length-1,-1);
 const gN=new THREE.BufferGeometry();gN.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));gN.setIndex(idx);gN.computeVertexNormals();
 const P5=[LZ.pL,LZ.pR,LZ.pT,LZ.pF,LZ.pB];
 const uvOf=(k,x,y,z)=>{const p=P5[k];let u,v;if(k===0){u=p[0]-z*p[1];v=p[2]-y*p[3]}else if(k===1){u=p[0]+z*p[1];v=p[2]-y*p[3]}else if(k===2){u=p[0]+z*p[1];v=p[2]-Math.abs(x)*p[3]}else if(k===3){u=p[0]+x*p[1];v=p[2]-y*p[3]}else{u=p[0]-x*p[1];v=p[2]-y*p[3]}return[u/IW,v/IH2]};
 const NV=pos.length/3,nrm=gN.attributes.normal,posA=new THREE.Float32BufferAttribute(pos,3),idxA=new THREE.BufferAttribute(new Uint16Array(idx),1);
 const UVs=[0,1,2,3,4].map(()=>new Float32Array(NV*2)),COLs=[0,1,2,3,4].map(()=>new Float32Array(NV*4));
 for(let v=0;v<NV;v++){const x=pos[v*3],y=pos[v*3+1],z=pos[v*3+2],nx=nrm.getX(v),ny=nrm.getY(v),nz=nrm.getZ(v),E=5;
  const w=[Math.pow(Math.max(nx,0),E),Math.pow(Math.max(-nx,0),E),ny>0?Math.pow(ny,11):0,Math.pow(Math.max(nz,0),E),Math.pow(Math.max(-nz,0),E)];
  let cum=0;const dk=1-.9*Math.min(1,Math.max(0,(-ny-.55)/.35));
  for(let k=0;k<5;k++){cum+=w[k];const u=uvOf(k,x,y,z);UVs[k][v*2]=u[0];UVs[k][v*2+1]=u[1];const a=cum>1e-9?w[k]/cum:0;COLs[k].set([dk,dk,dk,k===0?1:a],v*4)}}
 const bodyG=new THREE.Group();lrv.add(bodyG);
 const LGEO=[];
 for(let k=0;k<5;k++){const g=new THREE.BufferGeometry();LGEO.push(g);g.setAttribute('position',posA);g.setIndex(idxA);g.setAttribute('uv',new THREE.BufferAttribute(UVs[k],2));g.setAttribute('color',new THREE.BufferAttribute(COLs[k],4));
  const m=new THREE.MeshBasicMaterial({map:tex,vertexColors:true,transparent:k>0,depthWrite:k===0});if(k>0){m.polygonOffset=true;m.polygonOffsetFactor=-1;m.polygonOffsetUnits=-1}
  const me=new THREE.Mesh(g,m);me.frustumCulled=false;me.renderOrder=10+k;bodyG.add(me);lrBodyMs.push(m)}
 const mirM=new THREE.MeshBasicMaterial({color:0x151518});for(const sx of[1,-1]){const m=new THREE.Mesh(new THREE.BoxGeometry(.1,.27,.13),mirM);m.position.set(sx*.97,1.6,.5);bodyG.add(m);const arm=new THREE.Mesh(new THREE.BoxGeometry(.08,.05,.05),mirM);arm.position.set(sx*.9,1.45,.5);bodyG.add(arm)}
 const roofH=(()=>{let b=LZ.st[0];for(const q of LZ.st)if(Math.abs(q[0]+.86)<Math.abs(b[0]+.86))b=q;return b[2]})();
 for(const sx of[1,-1]){const r=new THREE.Mesh(new THREE.BoxGeometry(.05,.05,1.25),mirM);r.position.set(sx*.55,roofH+.06,-.86);bodyG.add(r);for(const z of[-.3,-1.42]){const p=new THREE.Mesh(new THREE.BoxGeometry(.05,.08,.05),mirM);p.position.set(sx*.55,roofH+.02,z);bodyG.add(p)}}
 const tyreM=new THREE.MeshBasicMaterial({color:0x151518}),R_=LZ.WR*0+.43,wzs=LZ.wz,wls=[],dM=new THREE.MeshBasicMaterial({map:tex});
 function disc(sx){const gd=new THREE.CircleGeometry(R_*.95,18),p=gd.attributes.position,uv=[],c=LZ.wl.c;for(let i=0;i<p.count;i++)uv.push((c[0]+p.getX(i)/R_*c[2])/IW,(c[1]-p.getY(i)/R_*c[2])/IH2);gd.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));gd.rotateY(sx>0?Math.PI/2:-Math.PI/2);gd.translate(sx*.138,0,0);return new THREE.Mesh(gd,dM)}
 const stz=z=>{let b=LZ.st[0];for(const s of LZ.st)if(Math.abs(s[0]-z)<Math.abs(b[0]-z))b=s;return b};
 for(const sx of[1,-1])for(let k=0;k<2;k++){const z=wzs[k],w=stz(z)[3],piv=new THREE.Group(),spin=new THREE.Group();piv.position.set(sx*(w+.05-.135),R_,z);
  spin.add(new THREE.Mesh(new THREE.CylinderGeometry(R_*.985,R_*.985,.27,14).rotateZ(Math.PI/2),tyreM));spin.add(disc(sx));piv.add(spin);lrv.add(piv);wls.push({piv,spin,front:k==0})}
 const mergeG=(L)=>{const P=[],U2=[],I=[];let o=0;for(const g of L){const p=g.attributes.position,u=g.attributes.uv;for(let i=0;i<p.count;i++){P.push(p.getX(i),p.getY(i),p.getZ(i));U2.push(u?u.getX(i):0,u?u.getY(i):0)}const ix=g.index;for(let i=0;i<ix.count;i++)I.push(ix.getX(i)+o);o+=p.count}const m=new THREE.BufferGeometry();m.setAttribute('position',new THREE.Float32BufferAttribute(P,3));m.setAttribute('uv',new THREE.Float32BufferAttribute(U2,2));m.setIndex(I);return m};
 const stG=[],dsG=[];for(const sx of[1,-1])for(let k=0;k<2;k++){const z=wzs[k],w=stz(z)[3],px=sx*(w+.05-.135);const a=new THREE.CylinderGeometry(R_*.985,R_*.985,.27,14).rotateZ(Math.PI/2);a.translate(px,R_,z);stG.push(a);const d=disc(sx).geometry;d.translate(px,R_,z);dsG.push(d)}
 const vwG=[mergeG(stG),mergeG(dsG)],vms=[],VTM=new THREE.MeshBasicMaterial({color:0x151518}),VDM=new THREE.MeshBasicMaterial({map:tex});
 for(let k=0;k<5;k++){const m=new THREE.MeshBasicMaterial({map:tex,vertexColors:true,transparent:k>0,depthWrite:k===0});if(k>0){m.polygonOffset=true;m.polygonOffsetFactor=-1;m.polygonOffsetUnits=-1}vms.push(m)}
 const LVT=[tex],LVM=[vms];
 const recol=(rgb)=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const x=c.getContext('2d');x.drawImage(img,0,0);const d=x.getImageData(0,0,c.width,c.height),a=d.data;
  for(let i=0;i<a.length;i+=4){const r=a[i]/255,g=a[i+1]/255,b=a[i+2]/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),df=mx-mn;if(mx<.1||df<.07)continue;if(df/mx<.09)continue;let h;if(mx===r)h=((g-b)/df+(g<b?6:0))*60;else if(mx===g)h=((b-r)/df+2)*60;else h=((r-g)/df+4)*60;if(h<65||h>180)continue;const f=Math.min(1.3,mx/.5);a[i]=Math.min(255,rgb[0]*f*255);a[i+1]=Math.min(255,rgb[1]*f*255);a[i+2]=Math.min(255,rgb[2]*f*255)}
  x.putImageData(d,0,0);const t=new THREE.CanvasTexture(c);t.flipY=false;t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.anisotropy=4;return t};
 const mkMs=t=>{const m=[];for(let k=0;k<5;k++){const mt=new THREE.MeshBasicMaterial({map:t,vertexColors:true,transparent:k>0,depthWrite:k===0});if(k>0){mt.polygonOffset=true;mt.polygonOffsetFactor=-1;mt.polygonOffsetUnits=-1}m.push(mt)}return m};
 window.lrInst=function(vi){vi=vi|0;let m=LVM[vi];if(!m){if(!img.complete||!img.naturalWidth){vi=0;m=LVM[0]}else{LVT[vi]=recol(LVC[vi]);m=LVM[vi]=mkMs(LVT[vi])}}const g=new THREE.Group();for(let k=0;k<5;k++){const me=new THREE.Mesh(LGEO[k],m[k]);me.frustumCulled=false;me.renderOrder=10+k;g.add(me)}g.add(new THREE.Mesh(vwG[0],VTM),new THREE.Mesh(vwG[1],VDM));return g};
 const pc={};window.lrPaint=function(){const w=paintC[0]>.97&&paintC[1]>.97&&paintC[2]>.97;let t=tex;if(!w&&img.complete&&img.naturalWidth){const key=paintC.join(',');t=pc[key]||(pc[key]=recol(paintC))}for(const m of lrBodyMs){m.map=t;m.needsUpdate=true}};
 window.lrCivUpd=function(l){for(const arr of LVM)if(arr)for(const m of arr)m.color.setRGB(l.x,l.y,l.z);VTM.color.setRGB(.085*l.x,.085*l.y,.09*l.z);VDM.color.setRGB(l.x,l.y,l.z)};
 lrUpd=function(){const l=U.uLight.value;for(const m of lrBodyMs)m.color.setRGB(l.x,l.y,l.z);tyreM.color.setRGB(.085*l.x,.085*l.y,.09*l.z);dM.color.setRGB(l.x,l.y,l.z);mirM.color.setRGB(.09*l.x,.09*l.y,.1*l.z);for(const w of wls){w.spin.rotation.x=GS_SPIN*.275/R_;if(w.front)w.piv.rotation.y=GS.steer*.5}};
}
/* ---------- secret car gallery (tap the title 5 times on the start menu, or ?gallery=1) ---------- */
var GAL={on:0,az:.62,d:6.6,h:1.5,fov:30,spin:0,wheels:1,steer:0,lights:0,lt:'STUDIO',t:0,sv:null,fromMenu:0,auto:0};
const GX=-3000,GY=300,GZ=-3000;
const galG=new THREE.Group();galG.visible=false;scene.add(galG);
{const fl=new THREE.Mesh(new THREE.CircleGeometry(9,48).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x30343c,fog:false}));fl.position.set(GX,GY-.02,GZ);galG.add(fl);
 for(const r of[2.5,5,8.4]){const rg=new THREE.Mesh(new THREE.RingGeometry(r,r+.05,64).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x5d6470,fog:false}));rg.position.set(GX,GY-.01,GZ);galG.add(rg)}
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2,ln=new THREE.Mesh(new THREE.PlaneGeometry(.04,6.2).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x444a55,fog:false}));ln.rotation.y=a;ln.position.set(GX,GY-.015,GZ);galG.add(ln)}
 const sg=new THREE.SphereGeometry(70,24,12),pc=sg.attributes.position,cc=[];for(let i=0;i<pc.count;i++){const t=Math.min(1,Math.max(0,(pc.getY(i)+10)/60));cc.push(.18+.26*(1-t)+.02,.2+.28*(1-t),.26+.3*(1-t))}sg.setAttribute('color',new THREE.Float32BufferAttribute(cc,3));
 const sp=new THREE.Mesh(sg,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false}));sp.position.set(GX,GY,GZ);galG.add(sp)}
const GLT={STUDIO:[1.08,1.08,1.1],DAY:null,DUSK:null,NIGHT:null};
let galUI=null;
function galView(az,h,d,fov){GAL.az=az;GAL.h=h;GAL.d=d;if(fov)GAL.fov=fov}
function openGallery(){if(GAL.on)return;GAL.on=1;GAL.fromMenu=menuOpen;
 GAL.sv={x:GS.x,y:GS.y,z:GS.z,psi:GS.psi,onFoot:GS.onFoot,car:CARI,paint:paintC,busy:busy,steer:GS.steer};
 GS.onFoot=0;man.visible=false;GS.x=GX;GS.z=GZ;GS.y=GY;GS.psi=0;GS.vx=GS.vz=GS.vy=GS.speed=0;GS.pitch=GS.roll=GS.dp=GS.dr=0;GS.steer=0;busy=1;menuOpen=false;$('menu').style.display='none';document.body.classList.add('mo');
 galG.visible=true;skyG.visible=false;rain.visible=false;snow.visible=false;galUI.style.display='block';GAL.t=0;galView(.62,1.5,6.6,30);window.DBGC=[0,0,0,.75,30]}
function closeGallery(){if(!GAL.on)return;GAL.on=0;BRKON=0;const s=GAL.sv;galUI.style.display='none';galG.visible=false;skyG.visible=true;window.DBGC=null;
 GS.x=s.x;GS.y=s.y;GS.z=s.z;GS.psi=s.psi;GS.onFoot=s.onFoot;GS.vx=GS.vz=GS.vy=GS.speed=0;GS.steer=0;GS.pitch=GS.roll=GS.dp=GS.dr=0;man.visible=!!s.onFoot&&!GS.inside;busy=s.busy;
 paintC=s.paint;setCar(s.car);applyTOD(todI);beam.visible=false;U.uLight.value.set(...TOD[todI].car);
 if(GAL.fromMenu)setMenu(true);else document.body.classList.remove('mo')}
function updGallery(dt){if(!GAL.on)return;GAL.t+=dt;if(GAL.spin)GAL.az+=dt*.5;
 const c=window.DBGC,asp=innerWidth/innerHeight,k=Math.max(1,1.0/asp),de=GAL.d*k;if(c){c[0]=GAL.az;c[1]=de;c[2]=GAL.h*(GAL.h>8?1:k);c[3]=.75-.06*de*(asp<1?1:0);c[4]=GAL.fov}
 scene.fog.near=400;scene.fog.far=900;R.setClearColor(new THREE.Color(.2,.22,.28));
 const l=GAL.lt==='STUDIO'?GLT.STUDIO:GAL.lt==='DAY'?TOD[0].car:GAL.lt==='DUSK'?TOD[1].car:TOD[2].car;U.uLight.value.set(l[0],l[1],l[2]);
 if(GAL.wheels)GS_SPIN+=dt*5;GS.steer=GAL.steer?Math.sin(GAL.t*1.6)*.7:0;beam.visible=!!GAL.lights;
 GS.x=GX;GS.z=GZ;GS.y=GY}
{const css=document.createElement('style');css.textContent='#galUI{display:none;position:fixed;inset:0;z-index:60;touch-action:none;font-family:monospace}#galP{position:absolute;left:6px;right:6px;bottom:6px;background:rgba(8,10,16,.8);border:1px solid #556;border-radius:10px;padding:6px;display:flex;flex-direction:column;gap:5px}#galP .r{display:flex;gap:4px;flex-wrap:wrap;align-items:center}#galP button{flex:1;min-width:52px;padding:8px 4px;font:700 12px monospace;color:#dde;background:#2b3140;border:1px solid #667;border-radius:6px}#galP button.on{background:#3a6fb0;color:#fff;border-color:#9cf}#galP i{display:inline-block;width:22px;height:22px;border-radius:50%;border:2px solid #889;flex:0 0 22px}#galT{position:absolute;top:8px;left:0;right:0;text-align:center;color:#cde;font-size:12px;text-shadow:0 1px 2px #000;pointer-events:none}';document.head.appendChild(css);
 galUI=document.createElement('div');galUI.id='galUI';document.body.appendChild(galUI);
 const T=document.createElement('div');T.id='galT';T.textContent='GALLERY · DRAG TO ORBIT · PINCH TO ZOOM';galUI.appendChild(T);
 const P_=document.createElement('div');P_.id='galP';galUI.appendChild(P_);
 const row=()=>{const r=document.createElement('div');r.className='r';P_.appendChild(r);return r},btn=(r,t,fn,grp)=>{const b=document.createElement('button');b.textContent=t;b.onclick=e=>{e.stopPropagation();fn(b)};if(grp){b.dataset.g=grp}r.appendChild(b);return b};
 const mark=(g,b)=>{for(const x of galUI.querySelectorAll('button[data-g="'+g+'"]'))x.classList.toggle('on',x===b)};
 let r=row();const bc=[btn(r,'CITROËN C1',b=>{setCar(0);mark('car',b)},'car'),btn(r,'FORD FIESTA',b=>{setCar(1);mark('car',b)},'car'),btn(r,'RM VAN',b=>{setCar(2);mark('car',b)},'car'),btn(r,'DEFENDER',b=>{setCar(3);mark('car',b)},'car'),btn(r,'MX-5',b=>{setCar(4);mark('car',b)},'car'),btn(r,'V60',b=>{setCar(5);mark('car',b)},'car'),btn(r,'A6',b=>{setCar(6);mark('car',b)},'car')];
 r=row();const prow=r;setTimeout(()=>{r=prow;PCOL.forEach((c,i)=>{const b=btn(r,'',()=>{paintC=c[1];applyPaint()});b.style.flex='0 0 34px';b.style.minWidth='34px';b.style.padding='4px';const d=document.createElement('i');d.style.background=c[0];b.appendChild(d)})},0);
 r=row();btn(r,'3/4',()=>galView(.62,1.5,6.6,30));btn(r,'FRONT',()=>galView(0,.9,7.5,28));btn(r,'SIDE',()=>galView(1.5708,.9,8,28));btn(r,'REAR',()=>galView(3.1416,.9,7.5,28));btn(r,'TOP',()=>galView(0,11,.5,40));btn(r,'LOW',()=>galView(.5,.25,5.5,40));
 r=row();for(const k of['STUDIO','DAY','DUSK','NIGHT'])btn(r,k,b=>{GAL.lt=k;mark('lt',b)},'lt');
 r=row();const tg=(t,key)=>{const b=btn(r,t,b=>{GAL[key]=GAL[key]?0:1;b.classList.toggle('on',!!GAL[key])})};tg('SPIN CAR','spin');const wb=btn(r,'WHEELS',b=>{GAL.wheels=GAL.wheels?0:1;b.classList.toggle('on',!!GAL.wheels)});wb.classList.add('on');tg('STEER','steer');tg('LIGHTS','lights');btn(r,'BRAKE',b=>{BRKON=BRKON?0:1;b.classList.toggle('on',!!BRKON)});
 r=row();btn(r,'ZOOM −',()=>GAL.d=Math.min(18,GAL.d*1.2));btn(r,'ZOOM +',()=>GAL.d=Math.max(2.5,GAL.d/1.2));btn(r,'EXIT',()=>closeGallery());
 galUI.querySelector('button[data-g="lt"]').classList.add('on');
 // drag / pinch
 const pts=new Map();let pd=0;
 galUI.addEventListener('pointerdown',e=>{if(e.target.closest('#galP'))return;pts.set(e.pointerId,[e.clientX,e.clientY]);galUI.setPointerCapture(e.pointerId);GAL.spin=0;if(pts.size==2){const a=[...pts.values()];pd=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])}});
 galUI.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);if(!p)return;if(pts.size==1){GAL.az-=(e.clientX-p[0])*.01;GAL.h=Math.max(.1,Math.min(14,GAL.h+(e.clientY-p[1])*.02))}pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size==2){const a=[...pts.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);if(pd)GAL.d=Math.max(2.5,Math.min(18,GAL.d*pd/d));pd=d}});
 const up=e=>{pts.delete(e.pointerId);pd=0};galUI.addEventListener('pointerup',up);galUI.addEventListener('pointercancel',up);
 const h1=document.querySelector('#mainCard h1');let taps=0,tt=0;if(h1)h1.addEventListener('click',()=>{const n=performance.now();taps=n-tt<1500?taps+1:1;tt=n;if(taps>=5){taps=0;openGallery()}});
}
/* ---------- lamp glows: headlights at dusk/night, brake lights when braking ---------- */
var BRKON=0;
const lampTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
const lampG=new THREE.Group();car.add(lampG);
const LMP=[];
for(const sx of[1,-1])for(const f of[1,0]){const m=new THREE.Mesh(new THREE.PlaneGeometry(f?.4:.3,f?.4:.3),new THREE.MeshBasicMaterial({map:lampTex,color:f?0xfff2c8:0xff2a1a,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false}));if(!f)m.rotation.y=Math.PI;m.renderOrder=50;lampG.add(m);LMP.push({m,sx,f})}
const LPOS={0:{f:[.55,.72,1.62],b:[.6,.95,-1.5]},1:{f:[.6,.79,1.83],b:[.63,.95,-1.93]},2:{f:[.66,.9,2.2],b:[.82,.99,-2.22]},3:{f:[.62,.94,1.9],b:[.78,1.1,-1.7]}};
function lampsUpd(){const p=LPOS[CARI],head=beam.visible&&!GS.inside,brk=BRKON||((inp.brk||keys.down)&&!GS.onFoot&&GS.speed>.8);
 for(const l of LMP){const q=l.f?p.f:p.b;l.m.position.set(l.sx*q[0],q[1],q[2]+(l.f?.02:-.02));if(l.f){l.m.visible=head;l.m.material.opacity=1}else{l.m.visible=brk||head;l.m.material.opacity=brk?1:.35}}}
