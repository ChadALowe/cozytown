/* Mazda MX-5 (car 5) and Volvo V60 estate (car 6): projected from the supplied sheets.
   Body paint is recoloured per pixel through a paint mask (see assets/*-mask.png); stock paint (white swatch) is the original silver. */
(function(){
const CAL={"mx5":{"W":1448,"H":1086,"L":3.915,"BW":1.735,"Lref":0.596,"pL":[366.0,180.843,416.0,206.478],"pR":[1089.0,178.289,416.0,204.858],"wz":[1.164,-1.277],"R":0.298,"wl":[155.5,353.5,61.6],"pF":[200.0,212.104,888.0,218.623],"pB":[581.0,203.458,889.0,219.433],"pT":[1110.5,168.327,776.5,170.029],"st":[[1.956,0.504,0.624,0.135],[1.954,0.499,0.619,0.197],[1.945,0.247,0.542,0.241],[1.932,0.189,0.562,0.291],[1.912,0.184,0.581,0.371],[1.888,0.179,0.605,0.441],[1.858,0.174,0.625,0.512],[1.822,0.174,0.644,0.576],[1.782,0.17,0.673,0.629],[1.736,0.165,0.693,0.676],[1.686,0.165,0.717,0.718],[1.63,0.16,0.746,0.747],[1.57,0.16,0.77,0.779],[1.506,0.165,0.789,0.809],[1.438,0.17,0.814,0.832],[1.365,0.17,0.833,0.844],[1.288,0.17,0.848,0.865],[1.208,0.17,0.862,0.868],[1.125,0.17,0.872,0.868],[1.038,0.17,0.881,0.868],[0.948,0.17,0.886,0.865],[0.856,0.17,0.886,0.859],[0.761,0.155,0.886,0.85],[0.664,0.155,0.886,0.844],[0.565,0.16,0.901,0.844],[0.464,0.16,0.915,0.844],[0.362,0.16,0.94,0.844],[0.26,0.16,1.007,0.844],[0.156,0.16,1.065,0.844],[0.052,0.16,1.119,0.868],[-0.052,0.16,1.167,0.868],[-0.156,0.16,1.206,0.844],[-0.26,0.16,1.225,0.844],[-0.362,0.16,1.23,0.841],[-0.464,0.16,1.235,0.841],[-0.565,0.16,1.235,0.841],[-0.664,0.16,1.23,0.841],[-0.761,0.16,1.22,0.847],[-0.856,0.155,1.201,0.856],[-0.948,0.155,1.177,0.865],[-1.038,0.17,1.119,0.868],[-1.125,0.17,1.065,0.868],[-1.208,0.17,1.017,0.868],[-1.288,0.17,0.969,0.868],[-1.365,0.17,0.925,0.853],[-1.438,0.17,0.911,0.835],[-1.506,0.17,0.92,0.809],[-1.57,0.17,0.891,0.773],[-1.63,0.223,0.881,0.738],[-1.686,0.223,0.867,0.703],[-1.736,0.237,0.857,0.659],[-1.782,0.252,0.852,0.606],[-1.822,0.262,0.843,0.544],[-1.858,0.266,0.838,0.476],[-1.888,0.31,0.746,0.409],[-1.912,0.358,0.683,0.335],[-1.932,0.441,0.664,0.223],[-1.945,0.484,0.644,0.132],[-1.954,0.518,0.638,0.12],[-1.956,0.518,0.638,0.12]]},"v60":{"W":1448,"H":1086,"L":4.62,"BW":1.8,"Lref":0.602,"pL":[369.5,156.494,404.0,173.381],"pR":[1091.5,150.866,404.0,172.662],"wz":[1.482,-1.438],"R":0.314,"wl":[137.5,348.5,54.5],"pF":[193.0,197.778,897.0,198.561],"pB":[565.5,187.222,896.0,202.158],"pT":[1099.5,147.403,771.5,147.222],"st":[[2.309,0.577,0.697,0.12],[2.306,0.559,0.679,0.187],[2.296,0.254,0.681,0.262],[2.279,0.231,0.704,0.421],[2.257,0.225,0.715,0.475],[2.228,0.213,0.732,0.537],[2.192,0.196,0.75,0.598],[2.15,0.19,0.773,0.679],[2.102,0.185,0.79,0.74],[2.049,0.179,0.813,0.778],[1.989,0.173,0.831,0.812],[1.924,0.173,0.848,0.846],[1.853,0.173,0.865,0.869],[1.777,0.17,0.877,0.897],[1.696,0.17,0.894,0.9],[1.611,0.17,0.906,0.9],[1.52,0.17,0.923,0.9],[1.426,0.17,0.934,0.9],[1.327,0.17,0.946,0.9],[1.225,0.17,0.957,0.9],[1.119,0.173,0.963,0.9],[1.01,0.179,0.963,0.9],[0.898,0.179,0.98,0.893],[0.783,0.179,1.044,0.893],[0.666,0.179,1.102,0.886],[0.548,0.179,1.159,0.886],[0.428,0.179,1.211,0.9],[0.306,0.179,1.263,0.9],[0.184,0.179,1.303,0.886],[0.062,0.185,1.332,0.886],[-0.062,0.185,1.355,0.886],[-0.184,0.185,1.367,0.89],[-0.306,0.185,1.373,0.89],[-0.428,0.185,1.378,0.893],[-0.548,0.185,1.378,0.893],[-0.666,0.185,1.378,0.893],[-0.783,0.185,1.378,0.893],[-0.898,0.19,1.378,0.893],[-1.01,0.19,1.373,0.893],[-1.119,0.17,1.367,0.897],[-1.225,0.17,1.361,0.9],[-1.327,0.17,1.355,0.9],[-1.426,0.17,1.378,0.9],[-1.52,0.17,1.39,0.897],[-1.611,0.17,1.327,0.897],[-1.696,0.17,1.315,0.883],[-1.777,0.219,1.303,0.869],[-1.853,0.219,1.292,0.849],[-1.924,0.231,1.286,0.832],[-1.989,0.242,1.275,0.812],[-2.049,0.248,1.136,0.791],[-2.102,0.26,1.084,0.764],[-2.15,0.265,1.044,0.737],[-2.192,0.271,1.027,0.686],[-2.228,0.283,0.969,0.622],[-2.257,0.311,0.94,0.513],[-2.279,0.34,0.906,0.387],[-2.296,0.398,0.565,0.197],[-2.306,0.41,0.559,0.12],[-2.309,0.41,0.559,0.12]]}};
const CFG=[
 {id:4,key:'mx5',img:'assets/mx5-img.jpg',mask:'assets/mx5-mask.png',bl:.80,mirror:{x:.9,y:.89,z:-.04,s:[.09,.09,.15]}},
 {id:5,key:'v60',img:'assets/v60-img.jpg',mask:'assets/v60-mask.png',bl:.98,mirror:{x:.94,y:.96,z:.48,s:[.08,.1,.15]}}
];
const NC={cars:{},ready:0};
function build(cfg){
 const C=CAL[cfg.key],IW=C.W,IH=C.H;
 const grp=new THREE.Group();grp.visible=false;car.add(grp);
 const img=new Image(),mImg=new Image();
 const tex=new THREE.Texture(img);tex.flipY=false;tex.generateMipmaps=true;tex.minFilter=THREE.LinearMipmapLinearFilter;tex.magFilter=THREE.LinearFilter;tex.anisotropy=4;
 const S={id:cfg.id,grp,ready:0,orig:null,lum:null,mask:null,cache:{},order:[],bodyMs:[]};
 NC.cars[cfg.id]=S;
 let rd=0;
 const loaded=()=>{if(++rd<2)return;tex.needsUpdate=true;
  const c=document.createElement('canvas');c.width=IW;c.height=IH;const x=c.getContext('2d');
  x.drawImage(img,0,0);S.orig=x.getImageData(0,0,IW,IH).data;
  x.clearRect(0,0,IW,IH);x.drawImage(mImg,0,0);const md=x.getImageData(0,0,IW,IH).data;
  const n=IW*IH,o=S.orig;S.mask=new Uint8Array(n);S.lum=new Float32Array(n);
  for(let i=0;i<n;i++){S.mask[i]=md[i*4];S.lum[i]=(.299*o[i*4]+.587*o[i*4+1]+.114*o[i*4+2])/255}
  S.ready=1;S.paint()};
 S.load=function(){if(S.started)return;S.started=1;img.onload=loaded;mImg.onload=loaded;img.src=cfg.img;mImg.src=cfg.mask};

 /* ---- hull from silhouette stations ---- */
 const bl=cfg.bl,pos=[],idx=[],rings=[];
 const ring=(z,yb,H,w)=>{const y3=Math.min(yb+.22,H-.1);let r;
  if(H>bl+.06){const t=H-bl;r=[[w*.86,yb],[w*.97,yb+.08],[w,y3],[w,bl],[w*.95,bl+.3*t],[w*.85,bl+.7*t],[w*.76,H-.04],[w*.64,H]]}
  else r=[[w*.86,yb],[w*.97,yb+.08],[w,y3],[w,Math.max(y3+.01,H-.1)],[w*.96,H-.06],[w*.88,H-.03],[w*.75,H-.012],[w*.55,H]];
  for(let i=1;i<r.length;i++)if(r[i][1]<r[i-1][1])r[i][1]=r[i-1][1];
  const R=[[0,yb]];for(const q of r)R.push([q[0],q[1]]);R.push([0,H]);for(let i=r.length-1;i>=0;i--)R.push([-r[i][0],r[i][1]]);return R.map(q=>[q[0],q[1],z])};
 for(const s of C.st)rings.push(ring(s[0],s[1],Math.max(s[2],s[1]+.12),Math.max(s[3],.12)));
 const K=rings[0].length;for(const r of rings)for(const q of r)pos.push(...q);
 for(let i=0;i<rings.length-1;i++)for(let k=0;k<K;k++){const k2=(k+1)%K,a=i*K+k,b=i*K+k2,c=(i+1)*K+k,d=(i+1)*K+k2;idx.push(a,b,c,b,d,c)}
 {const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
  const mid=Math.floor(rings.length/2),vi=mid*K+Math.floor(K/2),ny=g.attributes.normal.getY(vi);if(ny<0){for(let t=0;t<idx.length;t+=3){const x=idx[t+1];idx[t+1]=idx[t+2];idx[t+2]=x}}}
 const cap=(i,dirz)=>{const r=rings[i];let cx=0,cy=0,cz=r[0][2];for(const q of r){cx+=q[0];cy+=q[1]}cx/=K;cy/=K;const ci=pos.length/3;pos.push(cx,cy,cz);for(let k=0;k<K;k++){const a=i*K+k,b=i*K+(k+1)%K,ax=pos[a*3]-cx,ay=pos[a*3+1]-cy,bx=pos[b*3]-cx,by=pos[b*3+1]-cy,nz=ax*by-ay*bx;if(nz*dirz>0)idx.push(ci,a,b);else idx.push(ci,b,a)}};
 cap(0,1);cap(rings.length-1,-1);
 const gN=new THREE.BufferGeometry();gN.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));gN.setIndex(idx);gN.computeVertexNormals();
 const P5=[C.pL,C.pR,C.pT,C.pF,C.pB];
 const uvOf=(k,x,y,z)=>{const p=P5[k];let u,v;if(k===0){u=p[0]-z*p[1];v=p[2]-y*p[3]}else if(k===1){u=p[0]+z*p[1];v=p[2]-y*p[3]}else if(k===2){u=p[0]-z*p[1];v=p[2]+x*p[3]}else if(k===3){u=p[0]+x*p[1];v=p[2]-y*p[3]}else{u=p[0]-x*p[1];v=p[2]-y*p[3]}return[u/IW,v/IH]};
 const NV=pos.length/3,nrm=gN.attributes.normal,posA=new THREE.Float32BufferAttribute(pos,3),idxA=new THREE.BufferAttribute(new Uint16Array(idx),1);
 const UVs=[0,1,2,3,4].map(()=>new Float32Array(NV*2)),COLs=[0,1,2,3,4].map(()=>new Float32Array(NV*4));
 for(let v=0;v<NV;v++){const x=pos[v*3],y=pos[v*3+1],z=pos[v*3+2],nx=nrm.getX(v),ny=nrm.getY(v),nz=nrm.getZ(v),E=7;
  const w=[Math.pow(Math.max(nx,0),E),Math.pow(Math.max(-nx,0),E),ny>0?Math.pow(ny,8):0,Math.pow(Math.max(nz,0),E),Math.pow(Math.max(-nz,0),E)];
  let cum=0;const dk=1-.9*Math.min(1,Math.max(0,(-ny-.55)/.35));
  for(let k=0;k<5;k++){cum+=w[k];const u=uvOf(k,x,y,z);UVs[k][v*2]=u[0];UVs[k][v*2+1]=u[1];const a=cum>1e-9?w[k]/cum:0;COLs[k].set([dk,dk,dk,k===0?1:a],v*4)}}
 const bodyG=new THREE.Group();grp.add(bodyG);
 for(let k=0;k<5;k++){const g=new THREE.BufferGeometry();g.setAttribute('position',posA);g.setIndex(idxA);g.setAttribute('uv',new THREE.BufferAttribute(UVs[k],2));g.setAttribute('color',new THREE.BufferAttribute(COLs[k],4));
  const m=new THREE.MeshBasicMaterial({map:tex,vertexColors:true,transparent:k>0,depthWrite:k===0});if(k>0){m.polygonOffset=true;m.polygonOffsetFactor=-1;m.polygonOffsetUnits=-1}
  const me=new THREE.Mesh(g,m);me.frustumCulled=false;me.renderOrder=10+k;bodyG.add(me);S.bodyMs.push(m)}
 /* mirrors */
 const mirM=new THREE.MeshBasicMaterial({color:0x151518}),mi=cfg.mirror;
 for(const sx of[1,-1]){const m=new THREE.Mesh(new THREE.BoxGeometry(mi.s[0],mi.s[1],mi.s[2]),mirM);m.position.set(sx*mi.x,mi.y,mi.z);m.rotation.y=-sx*.25;bodyG.add(m)}
 /* wheels */
 const tyreM=new THREE.MeshBasicMaterial({color:0x151518}),R_=C.R,wls=[],dM=new THREE.MeshBasicMaterial({map:tex});
 function disc(sx){const gd=new THREE.CircleGeometry(R_*.99,20),p=gd.attributes.position,uv=[],c=C.wl;for(let i=0;i<p.count;i++)uv.push((c[0]+p.getX(i)/R_*c[2])/IW,(c[1]-p.getY(i)/R_*c[2])/IH);gd.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));gd.rotateY(sx>0?Math.PI/2:-Math.PI/2);gd.translate(sx*.113,0,0);return new THREE.Mesh(gd,dM)}
 const stz=z=>{let b=C.st[0];for(const s of C.st)if(Math.abs(s[0]-z)<Math.abs(b[0]-z))b=s;return b};
 for(const sx of[1,-1])for(let k=0;k<2;k++){const z=C.wz[k],w=stz(z)[3],piv=new THREE.Group(),spin=new THREE.Group();piv.position.set(sx*(w+.02-.11),R_,z);
  spin.add(new THREE.Mesh(new THREE.CylinderGeometry(R_*.985,R_*.985,.22,16).rotateZ(Math.PI/2),tyreM));spin.add(disc(sx));piv.add(spin);grp.add(piv);wls.push({piv,spin,front:k==0})}

 /* ---- paint ---- */
 S.recol=function(rgb){const o=S.orig,n=IW*IH,c=document.createElement('canvas');c.width=IW;c.height=IH;const x=c.getContext('2d'),id=x.createImageData(IW,IH),d=id.data,Lr=C.Lref,mk=S.mask,lm=S.lum;
  const R=rgb[0]*255,G=rgb[1]*255,B=rgb[2]*255;
  for(let i=0,q=0;i<n;i++,q+=4){const m=mk[i]/255;d[q+3]=255;if(m<.004){d[q]=o[q];d[q+1]=o[q+1];d[q+2]=o[q+2];continue}
   let f=lm[i]/Lr;f=f<.12?.12:f>1.45?1.45:f;let r=R*f,g=G*f,b=B*f;if(r>255)r=255;if(g>255)g=255;if(b>255)b=255;
   d[q]=o[q]+(r-o[q])*m;d[q+1]=o[q+1]+(g-o[q+1])*m;d[q+2]=o[q+2]+(b-o[q+2])*m}
  x.putImageData(id,0,0);const t=new THREE.CanvasTexture(c);t.flipY=false;t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.anisotropy=4;return t};
 S.paint=function(){if(!S.ready)return;const stock=paintC[0]>.97&&paintC[1]>.97&&paintC[2]>.97;let t=tex;
  if(!stock){const key=paintC.map(v=>Math.round(v*100)).join(',');t=S.cache[key];if(!t){t=S.cache[key]=S.recol(paintC);S.order.push(key);while(S.order.length>3){const old=S.order.shift();if(S.cache[old]){S.cache[old].dispose();delete S.cache[old]}}}}
  for(const m of S.bodyMs){m.map=t;m.needsUpdate=true}};
 S.upd=function(){const l=U.uLight.value;for(const m of S.bodyMs)m.color.setRGB(l.x,l.y,l.z);tyreM.color.setRGB(.085*l.x,.085*l.y,.09*l.z);dM.color.setRGB(l.x,l.y,l.z);mirM.color.setRGB(.09*l.x,.09*l.y,.1*l.z);for(const w of wls){w.spin.rotation.x=GS_SPIN*.275/R_;if(w.front)w.piv.rotation.y=GS.steer*.5}};
 return S}
for(const c of CFG)build(c);
LPOS[4]={f:[.58,.66,1.95],b:[.62,.82,-1.78]};
LPOS[5]={f:[.66,.74,2.28],b:[.7,1.02,-2.3]};
NC.paint=function(){for(const k in NC.cars)NC.cars[k].paint()};
NC.upd=function(){const s=NC.cars[CARI];if(s)s.upd()};
NC.show=function(){for(const k in NC.cars){const c=NC.cars[k];c.grp.visible=(CARI===+k);if(CARI===+k)c.load()}};
/* fetch the textures a few seconds after the game is up, so START is never held back by them */
setTimeout(()=>{for(const k in NC.cars)NC.cars[k].load()},6000);
{const s0=setCar;setCar=function(i){s0(i);NC.show()}}
window.NC=NC;
})();
