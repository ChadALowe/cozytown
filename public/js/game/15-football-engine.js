/* ---- football realism pass: engine v2 ---- */
const HT0=116,HT1=128,TUN=[0,-16.2];
const SUR=['HOLLIS','BARNES','OKAFOR','PRICE','WALSH','DOYLE','PATEL','MOSS','FINCH','REYES','COLE','GRANT','KEANE','DIXON','EVANS','HUGHES','LOWE','MORGAN','NASH','OWEN','PIKE','QUINN','ROSS','SHAW','TATE','URWIN','VANCE','WEBB','YATES','ZANE'];
function fcRoster(seed){const r=bkRng(seed),a=SUR.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,11)}
const FCHOME=fcRoster(31);
const fcDur=k=>k==='goal'?7:k==='corner'?4.2:(k==='foul'||k==='yellow'||k==='offside')?3.6:3.2;
function fcFix(n){if(FCF[n]&&FCF[n].v2)return FCF[n];const r=bkRng(555000+n*131),opp=BKTM.filter(x=>x!==FCG.HOME),o=opp[Math.floor(r()*opp.length)],ah=.9+r()*.8,aa=.8+r()*.9,lh=Math.min(3.2,1.2*ah*1.15),la=Math.min(3,aa*.95);
 const ps=l=>{let u=r(),k=0,p=Math.exp(-l),s=p;while(u>s&&k<8){k++;p*=l/k;s+=p}return k};let hg=Math.min(ps(lh),6),ag=Math.min(ps(la),5);
 const S=24,base=[];for(let i=0;i<S;i++)base.push(7+i*8.4+(r()-.5)*2.6);
 let hc=Math.max(hg+3,Math.round(S/2+(r()-.5)*4)),ac=S-hc;if(ac<ag+3){ac=ag+3;hc=S-ac}
 const teams=[];for(let i=0;i<hc;i++)teams.push(0);for(let i=0;i<ac;i++)teams.push(1);for(let i=teams.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[teams[i],teams[j]]=[teams[j],teams[i]]}
 const gi={0:[],1:[]};teams.forEach((t,i)=>gi[t].push(i));const gs=new Set();for(const t of[0,1]){const need=t===0?hg:ag,a=gi[t].slice();for(let k=0;k<need;k++){const j=Math.floor(r()*a.length);gs.add(a.splice(j,1)[0])}}
 const kinds=['save','save','save','wide','wide','block','corner','foul','yellow','offside','post','save'];
 let ev=[],end=0;for(let i=0;i<S;i++){const team=teams[i],goal=gs.has(i),kind=goal?'goal':kinds[Math.floor(r()*kinds.length)];let te=Math.max(base[i],end+2.6);if(te>HT0-9&&te<HT1+3)te=HT1+3.5;if(te>FCG.LIVE-5)break;ev.push({te,team,kind,sz:(r()-.5)*12,gz:(r()-.5)*3.6,sh:[9,10,8,7,6][Math.floor(r()*5)],cm:Math.floor(r()*3)});end=te+fcDur(kind)}
 hg=ev.filter(e=>e.kind==='goal'&&e.team===0).length;ag=ev.filter(e=>e.kind==='goal'&&e.team===1).length;
 return FCF[n]={n,opp:o,hg,ag,ev,sd:Math.floor(r()*1e6),v2:1,ros:[FCHOME,fcRoster(900+n*7)]}}
function fcMinute(tl){return tl<HT0?tl/HT0*45:tl<HT1?45:Math.min(90,45+(tl-HT1)/(FCG.LIVE-HT1)*45)}
function fcMin(st){return st.ph===0?0:st.ph===1?Math.floor(fcMinute(st.tl)):90}
function fcPhases(fx){if(fx.phs)return fx.phs;const r=bkRng(fx.sd+9),L=FCG.LIVE,P=[];let t=0,lc=0,ht=0;
 const build=(t0,t1,team,c0,c1)=>P.push({k:'b',t0,t1,team,c0,c1,zc:0,chain:fcChain(r,team,Math.max(2,Math.round((t1-t0)/1.3)),false)});
 const fill=(t0,t1)=>{let tt=t0;while(t1-tt>1.5){const d=Math.min(t1-tt,3.2+r()*3),team=r()<.5?0:1,cx=(team===0?1:-1)*(r()*8-3);build(tt,tt+d,team,lc,cx);lc=cx;tt+=d}return tt};
 const doHT=()=>{t=fill(t,HT0);P.push({k:'ht',t0:HT0,t1:HT1,team:0,c0:0,c1:0,zc:0});t=HT1;lc=0;ht=1};
 for(const e of fx.ev){if(!ht&&e.te-5.4>HT0-1)doHT();const a=Math.max(t,e.te-5.4);const tt=fill(t,a);const s=e.team===0?1:-1,shooter=e.sh,tA=Math.min(tt,e.te-1.2);
  P.push({k:'a',t0:tA,t1:e.te,team:e.team,c0:lc,c1:s*(FHL-11),zc:e.sz*.5,chain:fcChain(r,e.team,Math.max(3,Math.round((e.te-tA)/1.3)),true,shooter),e});
  const du=fcDur(e.kind);P.push({k:'d',t0:e.te,t1:e.te+du,team:e.team,c0:s*(FHL-11),c1:0,zc:e.sz*.5,e,shooter});t=e.te+du;lc=0}
 if(!ht&&t<HT0-1)doHT();
 if(L-t>1.5)fill(t,L);const lastT=P[P.length-1].t1;if(lastT<L)P.push({k:'b',t0:lastT,t1:L,team:0,c0:lc,c1:0,zc:0,chain:fcChain(r,0,2,false)});return fx.phs=P}
function fcFoc(p,t){if(p.k==='ht')return[0,0];const u=(t-p.t0)/Math.max(.01,p.t1-p.t0);if(p.k==='b')return[p.c0+(p.c1-p.c0)*fcSm(u)+3*Math.sin(t*.6),Math.sin(t*.5)*4];if(p.k==='a')return[p.c0+(p.c1-p.c0)*fcSm(u),p.zc*fcSm(u)];const uu=Math.min(1,(t-p.t0)/2.4);return[p.c1*0+p.c0+(0-p.c0)*fcSm(uu)*0,p.zc*(1-fcSm(uu))]}
function fcEvText(e,fx){const nm=(t,i)=>fx.ros[t][i]+' ('+(i+1)+')',tm=e.team===0?'ROVERS':fx.opp,def=e.team===0?fx.opp:'ROVERS',w=nm(e.team,e.sh);
 if(e.kind==='goal')return[e.team===0?'GOAL! '+w+' SCORES FOR ROVERS!':'GOAL for '+fx.opp+'. '+w+' finishes it.','goal'];
 if(e.kind==='save')return[w+' shoots... saved! Great stop by the '+def+' keeper.','ooh'];
 if(e.kind==='wide')return[w+' lets fly and puts it wide.','groan'];
 if(e.kind==='block')return[w+' shoots - blocked by a brave defender!','ooh'];
 if(e.kind==='post')return[w+' hits the POST! So close!','ooh'];
 if(e.kind==='corner')return['Corner to '+tm+'. Bodies in the box.','ooh'];
 if(e.kind==='foul')return['Foul on '+nm(e.team,e.sh)+'. Free kick given.','boo'];
 if(e.kind==='yellow')return['Yellow card for '+(e.team===0?fx.opp:'ROVERS')+' after that challenge.','boo'];
 return['Flag is up. '+w+' was offside.','boo']}
/* ---- ideal positions ---- */
const fcDir=t=>t===0?1:-1;
function fcIdeal(st,tm,mode,out){const fx=st.fx,V=FCV;
 if(mode==='pre'){const r=st.tl;
  for(let team=0;team<2;team++)for(let i=0;i<11;i++){let x,z,h=0;const sl=fcPos(team,i,[0,0],0,0);
   if(r<80){const a=tm*.55+i*1.1+team*2,rad=i===0?1.2:3.2;x=sl[0]*.75+(team===0?-6:6)*.3+Math.cos(a)*rad;z=FCZ+(sl[1]-FCZ)*.8+Math.sin(a)*rad*.8;if(team===0&&i===0){x=-FHL+3}if(team===1&&i===0){x=FHL-3}}
   else if(r<94){x=TUN[0];z=TUN[1];h=1}
   else if(r<126){x=TUN[0];z=TUN[1];h=2}
   else if(r<146){const row=-6.0+i*1.15,sx=team===0?row-7:row+7;const stg=Math.max(0,Math.min(1,(r-126-i*.5-team*.2)/6));x=r<126+i*.5+team*.2?TUN[0]:sx;z=r<126+i*.5+team*.2?TUN[1]:-35.6;h=r<126+i*.5+team*.2?3:0;if(stg<1&&h===0){x=TUN[0]+(sx-TUN[0])*Math.max(.001,stg);z=TUN[1]+(-35.6-TUN[1])*Math.max(.001,stg)}}
   else{x=sl[0];z=sl[1]}
   out[team][i]=[x,z,h]}return}
 if(mode==='post'){const r=st.tl;for(let team=0;team<2;team++)for(let i=0;i<11;i++){const sl=fcPos(team,i,[0,0],0,0);let x=sl[0]*.5+(team===0?-1:1)*1.0,z=FCZ+(sl[1]-FCZ)*.5,h=0;if(r>7){x=TUN[0];z=TUN[1];h=1}out[team][i]=[x,z,h,r<7?4:0]}return}
 const P=fcPhases(fx),p=fcPhaseAt(P,tm),F=fcFoc(p,tm),poss=p.team,opp=1-poss,ball=[V.ballx||0,V.ballz||FCZ];
 if(p.k==='ht'){for(let team=0;team<2;team++)for(let i=0;i<11;i++)out[team][i]=[TUN[0],TUN[1],1];return}
 for(let team=0;team<2;team++)for(let i=0;i<11;i++){const q=fcPos(team,i,F,tm,(poss===team&&p.k!=='b')?1:0);out[team][i]=[q[0],q[1],0]}
 // attack/defence shape
 if(p.k==='a'||p.k==='b'){const ds=fcDir(poss),k=p.k==='a'?1:.5;for(let i=5;i<11;i++){out[poss][i][0]+=ds*(i>8?5:2.5)*k}for(let i=1;i<5;i++)out[opp][i][0]+=fcDir(opp)*-2.5*k}
 // press
 {const cand=[];for(let i=1;i<11;i++){const o2=out[opp][i];cand.push([Math.hypot(o2[0]-ball[0],o2[1]-ball[1]),i])}cand.sort((a,b)=>a[0]-b[0]);const dd=fcDir(opp);for(let k=0;k<2;k++){const i=cand[k][1],w=k===0?1:.55;out[opp][i][0]=out[opp][i][0]+(ball[0]-dd*1.7-out[opp][i][0])*w;out[opp][i][1]=out[opp][i][1]+(ball[1]-out[opp][i][1])*w}
  const c2=[];for(let i=1;i<11;i++){const o2=out[poss][i];c2.push([Math.hypot(o2[0]-ball[0],o2[1]-ball[1]),i])}c2.sort((a,b)=>a[0]-b[0]);const i2=c2[1]?c2[1][1]:5;out[poss][i2][0]+=(ball[0]-out[poss][i2][0])*.25;out[poss][i2][1]+=(ball[1]-out[poss][i2][1])*.25}
 // keepers drift with the ball
 for(const team of[0,1]){const gk=out[team][0],gx=team===0?-FHL+1.6:FHL-1.6;gk[0]=gx;gk[1]=FCZ+Math.max(-3,Math.min(3,(ball[1]-FCZ)*.18))}
 // set pieces / outcomes
 if(p.k==='d'){const e=p.e,u=tm-e.te,sg=fcDir(e.team),ds=1-e.team,zs=e.sz>0?1:-1;
  if(e.kind==='goal'){const C=[sg*(FHL-3.5),FCZ+zs*(FHW-3)],sc=e.sh;
   if(u>.8){const ring=[7,8,9,10,5,6,4,3].filter(x=>x!==sc);out[e.team][sc]=[C[0]+(u<1.6?-sg*(1.6-u)*4:0),C[1]+(u<1.6?-zs*(1.6-u)*4:0),5];ring.forEach((i,k)=>{const a=k*.8+u*.2;out[e.team][i]=[C[0]-sg*2.6+Math.cos(a)*1.4,C[1]-zs*2+Math.sin(a)*1.4,u>1.8?5:0]});
    if(u>4.9){for(let i=0;i<11;i++){const q=fcPos(e.team,i,[0,0],0,0);out[e.team][i]=[q[0],q[1],0]}}}
   for(let i=0;i<11;i++){if(u>.5&&i>0)(function(){const q=fcPos(ds,i,[0,0],0,0);const k=u>4.9?1:.25;out[ds][i]=[q[0]*k+out[ds][i][0]*(1-k),q[1]*k+out[ds][i][1]*(1-k),0]})()}}
  else if(e.kind==='corner'){const fl=[sg*(FHL-.8),FCZ+zs*(FHW-.8)];out[e.team][7]=u<2.0?fl:[sg*(FHL-12),FCZ+zs*(FHW-5),0];[5,8,9,10,6].forEach((i,k)=>{out[e.team][i]=[sg*(FHL-5.5-k*1.1),FCZ-zs*(k*1.3-2.2)+zs*(2-1.4*(k%2)),0]});[1,2,3,4,5,6].forEach((i,k)=>{out[ds][i]=[-sg*0+(-sg)*(-(FHL-4-k*.9)),FCZ-zs*(k*1.2-2)+(k%2?1.2:-1.2),0]});out[ds][0]=[-sg*(-(FHL-1.4)),FCZ+zs*-1,0]}
  else if(e.kind==='foul'||e.kind==='yellow'||e.kind==='offside'){const S=e._s||[0,FCZ];out[e.team][e.sh]=[S[0],S[1],0];const j=e.kind==='offside'?(1-e.team):(1-e.team);out[ds][Math.min(10,3+(e.cm))]=[S[0]+sg*.9,S[1]+.4,0]}
 }
}
/* ---- ball from visible actors ---- */
function fcFoot(g,off){return[g.px+Math.sin(g.rotation.y)*off,g.pz+Math.cos(g.rotation.y)*off]}
function fcBallLive(fx,tm){const V=FCV,P=fcPhases(fx),p=fcPhaseAt(P,tm);if(p.k==='ht')return null;const pl=(t,i)=>V.pl[t][i];
 if(p.k==='d'){const e=p.e,u=tm-e.te,sg=fcDir(e.team),shg=pl(e.team,e.sh);if(!e._s){const f=fcFoot(shg,.5);e._s=[f[0],f[1]]}const S=e._s,zs=e.sz>0?1:-1,L=(a,b,s)=>a+(b-a)*s,E=s=>s<=0?0:s>=1?1:s*s*(3-2*s);let x,y,z;
  if(e.kind==='goal'){const T=[sg*(FHL+1.3),.9,FCZ+e.gz];if(u<.55){const s=E(u/.55);x=L(S[0],T[0],s);z=L(S[1],T[2],s);y=.3+.6*s+Math.sin(s*Math.PI)*.5}else if(u<5){const s=Math.min(1,(u-.55)/.8);x=L(T[0],sg*(FHL+1.9),s);z=L(T[2],T[2]+(zs*.4),s);y=Math.max(.24,.9*(1-s)+.24)}else{x=0;y=.24;z=FCZ}}
  else if(e.kind==='save'){const K=[sg*(FHL-1.7),.9,FCZ+Math.max(-2.3,Math.min(2.3,e.sz*.22))];if(u<.5){const s=E(u/.5);x=L(S[0],K[0],s);z=L(S[1],K[2],s);y=.3+.6*s}else{const s=E(Math.min(1,(u-.5)/.9)),D=[sg*(FHL-7),.24,K[2]+zs*5];x=L(K[0],D[0],s);z=L(K[2],D[2],s);y=.24+Math.sin(s*Math.PI)*.8}}
  else if(e.kind==='wide'){const W=[sg*(FHL+3),.7,FCZ+zs*(3.6+Math.abs(e.sz)*.3)];const s=E(Math.min(1,u/.6));x=L(S[0],W[0],s)+(u>.6?sg*(u-.6)*3:0);z=L(S[1],W[2],s)+(u>.6?zs*(u-.6)*2:0);y=.3+.5*s+(u>.6?(u-.6)*1.3:0)}
  else if(e.kind==='post'){const Pp=[sg*FHL,1.2,FCZ+zs*2.7];if(u<.4){const s=E(u/.4);x=L(S[0],Pp[0],s);z=L(S[1],Pp[2],s);y=.3+.9*s}else{const s=E(Math.min(1,(u-.4)/.9)),R2=[sg*(FHL-7),.24,Pp[2]+zs*4];x=L(Pp[0],R2[0],s);z=L(Pp[2],R2[2],s);y=L(1.2,.24,s)+Math.sin(s*Math.PI)*.7}}
  else if(e.kind==='block'){const B=pl(1-e.team,3);const s0=E(Math.min(1,u/.35));if(u<.35){x=L(S[0],B.px,s0);z=L(S[1],B.pz,s0);y=.3+.4*s0}else{const s=E(Math.min(1,(u-.35)/1.0)),C=[sg*(FHL-3),.24,FCZ+zs*(FHW-2)];x=L(B.px,C[0],s);z=L(B.pz,C[2],s);y=.5*(1-s)+.24+Math.sin(s*Math.PI)*.5}}
  else if(e.kind==='corner'){const fl=[sg*(FHL-.8),FCZ+zs*(FHW-.8)];if(u<.9){const s=E(u/.9);x=L(S[0],fl[0],s);z=L(S[1],fl[1],s);y=.24+Math.sin(s*Math.PI)*.4}else if(u<2.0){x=fl[0]-sg*.35;z=fl[1]-zs*.2;y=.24}else if(u<2.9){const s=(u-2.0)/.9,T=[sg*(FHL-6),0,FCZ-zs*1.2];x=L(fl[0],T[0],s);z=L(fl[1],T[2],s);y=.24+Math.sin(s*Math.PI)*4.2}else{const s=E(Math.min(1,(u-2.9)/.9)),T=[sg*(FHL-6),0,FCZ-zs*1.2],O=[sg*(FHL-10),0,FCZ+zs*(-4)];x=L(T[0],O[0],s);z=L(T[2],O[2],s);y=.24+Math.sin(s*Math.PI)*.8}}
  else{const f=fcFoot(shg,.5);x=u<.2?f[0]:S[0];z=u<.2?f[1]:S[1];y=.24}
  return[x,y,z,p]}
 const ch=p.chain,m=ch.length-1,dt0=(p.t1-p.t0)/(m+1),fl=Math.min(.6,dt0*.45),k=Math.max(0,Math.min(m,Math.floor((tm-p.t0)/dt0))),tk=p.t0+(k+1)*dt0-fl;
 if(k<m&&tm>=tk){const s=Math.min(1,(tm-tk)/fl),a=pl(p.team,ch[k]),b=pl(p.team,ch[k+1]),bf=fcFoot(b,1.1);return[a.px+(bf[0]-a.px)*s,.24+Math.sin(s*Math.PI)*.6,a.pz+(bf[1]-a.pz)*s,p,k+.5]}
 const g=pl(p.team,ch[k]),off=.5+.18*Math.sin(g.ph*2),f=fcFoot(g,off);return[f[0],.24+Math.abs(Math.sin(g.ph*2))*.07,f[1],p,k]}
/* ---- actor stepping ---- */
function fcMove(g,tx,tz,dt,maxSp,acc){if(g.px===undefined||!isFinite(g.px)){g.px=tx;g.pz=tz;g.vx=g.vz=0;return}let dx=tx-g.px,dz=tz-g.pz,d=Math.hypot(dx,dz);if(d>30){g.px=tx;g.pz=tz;g.vx=g.vz=0;return}const want=Math.min(maxSp,d*2.4),wx=d>1e-3?dx/d*want:0,wz=d>1e-3?dz/d*want:0;let vx=g.vx||0,vz=g.vz||0;const ax=wx-vx,az=wz-vz,al=Math.hypot(ax,az),lim=acc*dt;if(al>lim){vx+=ax/al*lim;vz+=az/al*lim}else{vx=wx;vz=wz}g.vx=vx;g.vz=vz;g.px+=vx*dt;g.pz+=vz*dt}
function fcActStep(dt,st,tm,mode,t,snap){const V=FCV,fx=st.fx,out=[[],[]];fcIdeal(st,tm,mode,out);
 let P=null,p=null;if(mode==='live'){P=fcPhases(fx);p=fcPhaseAt(P,tm)}
 for(let team=0;team<2;team++)for(let i=0;i<11;i++){const g=V.pl[team][i],q=out[team][i];if(g.rotation.order!=='YXZ')g.rotation.order='YXZ';
  const h=q[2];if(h===1||h===2){// walking to / waiting in the tunnel
   if(g.hid){continue}fcMove(g,TUN[0],TUN[1],dt,6,10);if(Math.hypot(g.px-TUN[0],g.pz-TUN[1])<1.4&&h===1){g.hid=1;g.visible=false}}
  else{if(g.hid){g.hid=0;g.visible=true;g.px=TUN[0]+(i-5)*.25;g.pz=TUN[1]+.4;g.vx=g.vz=0}
   const jit=mode==='live'?[Math.sin(t*.9+i*1.7+team*3)*.5,Math.sin(t*.7+i*2.3+team)*.5]:[0,0],tx=q[0]+jit[0],tz=q[1]+jit[1];if(snap||g.px===undefined){g.px=tx;g.pz=tz;g.vx=g.vz=0}
   const sprint=(p&&p.k==='d'&&q[2]===5)?9:7.6;fcMove(g,tx,tz,dt,i===0?5.4:sprint,i===0?10:15)}
  if(!isFinite(g.rotation.y))g.rotation.y=0;if(!isFinite(g.px)||!isFinite(g.pz)){g.px=0;g.pz=FCZ;g.vx=g.vz=0}if(!isFinite(g.vx)||!isFinite(g.vz))g.vx=g.vz=0;if(!isFinite(g.sp))g.sp=0;if(!isFinite(g.ph))g.ph=0
  g.visible=!g.hid;const sp=Math.hypot(g.vx||0,g.vz||0);g.sp=g.sp*.7+sp*.3;
  if(g.sp>.7){const ty=Math.atan2(g.vx,g.vz);let d=ty-g.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));g.rotation.y+=d*Math.min(1,dt*9)}else if((isFinite(V.ballx)&&isFinite(V.ballz))){const tb=Math.atan2(V.ballx-g.px,V.ballz-g.pz);let d=tb-g.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));g.rotation.y+=d*Math.min(1,dt*3)}
  g.ph+=dt*(2.6+g.sp*1.25);const a=Math.min(1,g.sp/5)*.9,cel=q[2]===5||q[2]===4;g.l1.rotation.x=Math.sin(g.ph)*a;g.l2.rotation.x=-Math.sin(g.ph)*a;
  if(cel){g.a1.rotation.x=-2.7;g.a2.rotation.x=-2.7+Math.sin(t*10+i)*.3}else{g.a1.rotation.x=-Math.sin(g.ph)*a*.7;g.a2.rotation.x=Math.sin(g.ph)*a*.7}
  g.position.set(g.px,cel&&q[2]===5?Math.abs(Math.sin(t*9+i))*.22:0,g.pz);g.rotation.x=Math.min(.22,g.sp*.03);g.rotation.z=0;
  const sh=V.shd[team*11+i];if(sh){sh.position.set(g.px,.05,g.pz);sh.visible=g.visible}}
 // keeper dive
 if(p&&p.k==='d'){const e=p.e,u=tm-e.te;if(u>0&&u<1.9&&(e.kind==='goal'||e.kind==='save'||e.kind==='post'||e.kind==='wide')){const kt=1-e.team,g=V.pl[kt][0],zs=(e.kind==='goal'?-1:1)*(e.sz>0?1:-1),fs=kt===0?1:-1,s=Math.min(1,u/.5),ang=zs*1.25*fcSm(s)*(u<1.4?1:Math.max(0,(1.9-u)/.5));g.rotation.z=ang*fs;g.position.y=Math.sin(s*Math.PI)*.35*(u<.7?1:0);g.position.z=g.pz+zs*fcSm(s)*1.4;g.a1.rotation.x=g.a2.rotation.x=-2.8}}
 // referee
 {const r=V.ref,B=[V.ballx||0,V.ballz||FCZ];let tx,tz;if(mode==='live'&&p&&p.k!=='ht'){tx=B[0]*.8-3;tz=FCZ+(B[1]-FCZ)*.5+5}else if(mode==='pre'&&st.tl>=126&&st.tl<146){tx=0;tz=-33.5}else if(mode==='pre'&&st.tl<126){tx=TUN[0];tz=TUN[1]+1.5}else{tx=0;tz=-35}
  if(snap||r.px===undefined){r.px=tx;r.pz=tz;r.vx=r.vz=0}fcMove(r,tx,tz,dt,6.5,10);const sp=Math.hypot(r.vx,r.vz);r.sp=r.sp*.7+sp*.3;if(!isFinite(r.rotation.y))r.rotation.y=0;if(r.sp>.6){const ty=Math.atan2(r.vx,r.vz);let d=ty-r.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));r.rotation.y+=d*Math.min(1,dt*8)}else{const tb=Math.atan2(B[0]-r.px,B[1]-r.pz);let d=tb-r.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));r.rotation.y+=d*Math.min(1,dt*3)}
  r.ph+=dt*(2.6+r.sp*1.25);const a=Math.min(1,r.sp/4)*.85;r.l1.rotation.x=Math.sin(r.ph)*a;r.l2.rotation.x=-Math.sin(r.ph)*a;r.a1.rotation.x=-Math.sin(r.ph)*a*.6;let card=0;
  if(p&&p.k==='d'&&tm-p.e.te>.1&&tm-p.e.te<2.6&&(p.e.kind==='foul'||p.e.kind==='yellow'||p.e.kind==='offside')){r.a2.rotation.x=-2.6;card=p.e.kind==='yellow'}else r.a2.rotation.x=Math.sin(r.ph)*a*.6;
  r.position.set(r.px,0,r.pz);r.rotation.x=0;if(V.card)V.card.visible=!!card;if(card&&V.card){V.card.position.set(r.px+Math.cos(r.rotation.y)*.35,2.55,r.pz-Math.sin(r.rotation.y)*.35)}
  const sh=V.shd[22];if(sh)sh.position.set(r.px,.05,r.pz)}
 // ball
 let b=null;if(mode==='live'){b=fcBallLive(fx,tm)}else if(mode==='pre'&&st.tl<80){const pl=(i)=>V.pl[0][i],c=Math.floor(tm/1.4),i0=5+c%4,i1=5+(c+1)%4,s=Math.min(1,(tm%1.4)/.7),a=pl(i0),bb=pl(i1);b=[a.px+(bb.px-a.px)*s,.24+Math.sin(s*Math.PI)*.3,a.pz+(bb.pz-a.pz)*s,null,c+s]}else if(mode==='pre'||mode==='post'){b=[0,.24,FCZ]}
 if(b){V.ball.visible=true;const dx=b[0]-(V.ballx||b[0]),dz=b[2]-(V.ballz||b[2]),dd=Math.hypot(dx,dz);V.ball.position.set(b[0],b[1],b[2]);V.bsh.position.set(b[0],.05,b[2]);V.bsh.visible=true;V.ball.rotation.x+=dd/.24*Math.sign(dz||1);V.ball.rotation.z+=dd/.24*.3;V.ballx=b[0];V.ballz=b[2];V.balls=dd/Math.max(dt,.001);
  if(b[4]!==undefined&&b[4]!==V.lastK&&!V.nosnd){V.lastK=b[4];if(mode==='live'&&Math.abs(b[4]%1-.5)<.01&&GW)fcTone(110,AC.currentTime,.07,.05,'triangle',70)}}else{V.ball.visible=false;V.bsh.visible=false}
 if(GW)GW.ball=V.ball.visible?[V.ballx,V.ball.position.y,V.ballz]:[0,.3,FCZ];return p}
/* ---- extras, cameras, replay, commentary, cards, main loop ---- */
function fcEnsure(){const V=FCV;if(!V.shd){V.shd=[];for(let i=0;i<23;i++){const m=new THREE.Mesh(new THREE.CircleGeometry(.5,10).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.32,depthWrite:false}));m.position.y=.05;V.ST.add(m);V.shd.push(m)}}
 if(!V.card){V.card=new THREE.Mesh(new THREE.BoxGeometry(.14,.2,.01),new THREE.MeshBasicMaterial({color:0xffe020}));V.card.visible=false;V.ST.add(V.card)}}
function fcCard(html,ms){const G=GW;if(!G)return;let c=document.getElementById('fcCard');if(!c){c=document.createElement('div');c.id='fcCard';c.style.cssText='position:absolute;left:50%;top:22%;transform:translateX(-50%);width:min(88vw,340px);background:rgba(8,12,24,.93);border:3px solid #fff;box-shadow:4px 4px 0 #000;padding:10px;text-align:center;pointer-events:none;font:bold 13px monospace;color:#fff';G.ov.appendChild(c)}c.innerHTML=html;c.style.display='block';clearTimeout(G.cardT);G.cardT=setTimeout(()=>{c.style.display='none'},ms||6000)}
function fcStatsHTML(st,title){const fx=st.fx,tl=st.ph===1?st.tl:FCG.LIVE,sh=[0,0],sc=fcScore(fx,tl);for(const e of fx.ev)if(e.te<=tl&&['goal','save','wide','block','post'].includes(e.kind))sh[e.team]++;const G=GW,pt=G.poss[0]+G.poss[1]||1,p0=Math.round(G.poss[0]/pt*100);
 return'<div style="color:#ffd840;font-size:15px">'+title+'</div><div style="font-size:26px;margin:6px 0">ROVERS '+sc[0]+' - '+sc[1]+' '+fx.opp.slice(0,12)+'</div><div style="color:#9fd8b0;line-height:1.6">POSSESSION &nbsp;'+p0+'% - '+(100-p0)+'%<br>SHOTS &nbsp;'+sh[0]+' - '+sh[1]+'</div>'}
function fcLineup(fx){const l=(t)=>fx.ros[t].map((n,i)=>(i+1)+' '+n).join('<br>');return'<div style="color:#ffd840;font-size:14px;margin-bottom:6px">TEAM NEWS</div><div style="display:flex;gap:14px;text-align:left;font-size:11px;line-height:1.35"><div style="flex:1"><div style="color:#f77">ROVERS</div>'+l(0)+'</div><div style="flex:1"><div style="color:#8af">'+fx.opp.slice(0,14)+'</div>'+l(1)+'</div></div>'}
function fcCam(){const G=GW,S=FSEAT[G.seat],b=G.ball||[0,.3,FCZ],z=G.zoom?.55:1;let ex,ey,ez,lx,ly,lz,fov;
 if(G.rp){const sg=fcDir(G.rp.e.team);ex=sg*(FHL+8);ey=3.2;ez=FCZ+12+Math.sin(G.t*.4)*1.5;lx=b[0];ly=1;lz=b[2];fov=46*z}
 else if(G.cm===1){ex=Math.max(-26,Math.min(26,b[0]*.8));ey=10.6;ez=-9;lx=b[0];ly=.7;lz=b[2];fov=44*z}
 else if(G.cm===2){if(G.endS===undefined)G.endS=1;if(Math.abs(b[0])>9&&Math.sign(b[0])!==G.endS)G.endS=Math.sign(b[0]);ex=G.endS*(FHL+10);ey=2.3;ez=FCZ+3;lx=b[0];ly=.8;lz=b[2];fov=54*z}
 else{const f=.45,tx=S.base[0]+(b[0]-S.base[0])*f,tz=S.base[2]+(b[2]-S.base[2])*f;lx=tx;ly=S.base[1];lz=tz;ex=S.e[0];ey=S.e[1]+Math.abs(Math.sin(G.cj))*.05*G.excite;ez=S.e[2];fov=S.fov*z}
 if(![lx,ly,lz].every(isFinite)){window.__bad=JSON.stringify([lx,ly,lz,b,G.cm,G.seat]);lx=0;ly=1;lz=FCZ}
 G.lk=G.lk||[lx,ly,lz];if(!G.lk.every(isFinite))G.lk=[lx,ly,lz];const k=G.rp?.2:.07;G.lk[0]+=(lx-G.lk[0])*k;G.lk[1]+=(ly-G.lk[1])*k;G.lk[2]+=(lz-G.lk[2])*k;
 let dx=G.lk[0]-ex,dz=G.lk[2]-ez;if(G.cm===0&&!G.rp){const c=Math.cos(G.oy),s=Math.sin(G.oy),rx=dx*c-dz*s,rz=dx*s+dz*c;dx=rx;dz=rz}
 DZ.look=SG.localToWorld(new THREE.Vector3(ex+dx,G.lk[1]+(G.cm===0&&!G.rp?G.op:0),ez+dz));DZ.fov=fov;return SG.localToWorld(new THREE.Vector3(ex,ey,ez))}
{const w0=fcWatch;fcWatch=function(k){w0(k);const G=GW;if(!G)return;fcEnsure();G.cm=0;G.zoom=0;G.poss=[0,0];G.snap=1;G.nextCh=G.t+25+Math.random()*20;G.cmt=4;G.pa={};
  const bs='position:absolute;right:6px;font:bold 12px monospace;border:3px solid #f5e6a0;border-radius:8px;color:#fff;padding:6px 9px;background:#333;pointer-events:auto;touch-action:manipulation',mk=(t,top,fn)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText=bs+';top:'+top+'px';b.onpointerdown=e=>{e.stopPropagation();fn(b)};G.ov.appendChild(b);return b};
  mk('CAM: SEAT',104,b=>{G.cm=(G.cm+1)%3;G.lk=null;b.textContent='CAM: '+['SEAT','TV','ENDS'][G.cm]});mk('ZOOM',138,b=>{G.zoom=G.zoom?0:1;b.style.background=G.zoom?'#1c4fa0':'#333'});
  const rp=document.createElement('div');rp.id='fcRP';rp.style.cssText='position:absolute;left:10px;top:150px;font:900 20px monospace;color:#ff3030;text-shadow:2px 2px 0 #000;display:none;pointer-events:none';rp.textContent='● REPLAY';G.ov.appendChild(rp)}}
{const l0=fcLeave;fcLeave=function(){const V=FCV;l0();if(V){V.pl[0].concat(V.pl[1]).forEach(g=>{g.visible=true;g.hid=0;g.rotation.z=0});if(V.ref)V.ref.visible=true;if(V.card)V.card.visible=false}}}
function fcPlay(G,p,tm,fx){const V=FCV;if(!p||p.k==='ht')return null;const ch=p.chain;if(!ch)return null;const m=ch.length-1,dt0=(p.t1-p.t0)/(m+1),k=Math.max(0,Math.min(m,Math.floor((tm-p.t0)/dt0)));const n=fx.ros[p.team][ch[k]],tn=p.team===0?'ROVERS':fx.opp;
 const A=p.k==='a'?[n+' drives forward for '+tn+'!',tn+' are on the attack - '+n+' with it.','Dangerous here. '+n+' looking for the shot.']:[n+' on the ball.',tn+' knock it around patiently.',n+' looks up for a pass.','Little pressure on '+n+' there.',tn+' building from the back.'];return A[Math.floor(Math.random()*A.length)]}
function fcLoop(now){const G=GW;if(!G)return;const dt=Math.min(.05,(now-G.last)/1000);G.last=now;G.t+=dt;G.cj+=dt*9;const V=FCV,st=fcSt(fcNow()),fx=st.fx;
 if(G.stn===undefined)G.stn=st.n;if(st.n!==G.stn){G.ev=0;G.hf=0;G.rp=null;G.rpAt=0;G.poss=[0,0];G.pa={};G.snap=1;G.stn=st.n;G.ph=-1;fcSay('NEXT FIXTURE: ROVERS v '+fx.opp);G.ev=0}
 if(st.ph!==G.ph){const old=G.ph;G.snap=1;
  if(st.ph===1&&old===0){fcSnd('whistle');fcSay("KICK-OFF! ROVERS v "+fx.opp.toUpperCase());G.excite=.9;fcHome(.7,.7,.7)}
  if(st.ph===2&&old===1){fcSnd('whistle');fcSnd('whistle');const w=fx.hg>fx.ag,d=fx.hg===fx.ag;fcSay('FULL TIME. ROVERS '+fx.hg+' - '+fx.ag+' '+fx.opp+(w?'. WHAT A WIN!':d?'. HONOURS EVEN.':'. HARD LUCK.'));if(w){fcHome(1,1,1);fcSnd('cheer');fanAdd(8,'WIN BONUS +8')}else if(d)fanAdd(3);else for(const r of[0,1,2])V.mood[r].d=1;G.excite=.6;G.rp=null;fcCard(fcStatsHTML(st,'FULL TIME'),9000)}
  G.ph=st.ph}
 if(G.ev>fx.ev.length)G.ev=0;
 if(st.ph===1){while(G.ev<fx.ev.length&&fx.ev[G.ev].te<=st.tl){const e=fx.ev[G.ev];if(e.te>st.tl-3){fcEvent(e,fx,st);if(e.kind==='goal')G.rpAt=e.te+2.0;if(e.kind==='foul'||e.kind==='yellow')fcSnd('whistle')}G.ev++}
  if(st.tl>=HT0&&!G.hf){G.hf=1;fcSay("HALF TIME. "+fcScore(fx,st.tl).join('-')+'. Time for a pie.');fcSnd('whistle');fcSnd('whistle');fcCard(fcStatsHTML(st,'HALF TIME'),8000)}
  if(G.rpAt&&st.tl>=G.rpAt&&st.tl<G.rpAt+2&&!G.rp){const e=fx.ev.find(q=>Math.abs(q.te+2-G.rpAt)<.01);if(e){G.rp={e,r:0,s0:e.te-3.0,dur:5.4}}G.rpAt=0;G.snap2=1}
  const P=fcPhases(fx),p=fcPhaseAt(P,st.tl);if(p.k==='a'&&p.t1-st.tl<2.6){const q=p.team===0?[0,1,2]:[3];for(const r of q)V.mood[r].j=Math.max(V.mood[r].j,.25)}
  if(p.k!=='ht'&&p.team!==undefined)G.poss[p.team]+=dt;
  G.cmt-=dt;if(G.cmt<=0&&G.t-G.evT>5&&!G.rp){G.cmt=4.5+Math.random()*2;const tx=fcPlay(G,p,st.tl,fx);if(tx)fcSay(fcMin(st)+"' "+tx)}}
 else if(st.ph===0){G.ev=0;const pa=G.pa,tl=st.tl,say=(k,t,fn)=>{if(!pa[k]){pa[k]=1;fcSay(t);if(fn)fn()}};
  say('a','WELCOME TO THE RECREATION GROUND. ROVERS v '+fx.opp.toUpperCase()+' - KICK-OFF IN '+bkClock(st.rem));if(tl>=82)say('b','The players head back to the tunnel to get ready.');if(tl>=100)say('c','PA: Team news for today...',()=>fcCard(fcLineup(fx),9000));
  if(tl>=125)say('d','THE TEAMS ARE OUT! A huge roar from the Rovers faithful.',()=>{fcSnd('cheer');fcHome(1,1,1);G.excite=.8;fcSnd('whistle')});if(tl>=146)say('e','Handshakes done. Here we go...')}
 else{G.ev=0}
 // actors (live or replay)
 const snap=!!G.snap;G.snap=0;let cp=null;
 if(G.rp){const R=G.rp;R.r+=dt;const sim=R.s0+R.r*.72;const first=!R.on;R.on=1;cp=fcActStep(dt,{fx,tl:sim,ph:1},sim,'live',G.t,first);const el=document.getElementById('fcRP');if(el){el.style.display='block';el.style.opacity=Math.floor(G.t*2)%2?1:.4}if(R.r>=R.dur){G.rp=null;G.snap=1;if(el)el.style.display='none'}}
 else{const el=document.getElementById('fcRP');if(el&&el.style.display!=='none')el.style.display='none';
  cp=fcActStep(dt,st,st.ph===1?st.tl:st.tl,st.ph===0?'pre':st.ph===2?'post':'live',G.t,snap)}
 // crowd energy follows play
 if(st.ph===1&&(isFinite(V.ballx)&&isFinite(V.ballz))&&!G.rp){const pr=Math.max(0,(Math.abs(V.ballx)-(FHL-20))/20);if(pr>.55)G.excite=Math.max(G.excite,pr*.5)}
 if(G.chant>0){G.chant-=dt;const c=document.getElementById('fcC');if(c){const ph=Math.floor((7-G.chant)*1.6)%4;c.textContent=G.chant>.2?['RO-VERS','RO-VERS','ROV-ERS!','ROV-ERS!'][ph]:''}for(const r of[0,1,2])V.mood[r].s=1}else{const c=document.getElementById('fcC');if(c&&c.textContent)c.textContent=''}
 if(st.ph===1&&G.t>G.nextCh&&!G.chant){G.nextCh=G.t+35+Math.random()*30;fcSnd('chant');G.chant=7}
 if(V.wave>0){G.wvt-=dt;V.wavet+=dt;if(G.wvt<2)V.wave=Math.max(0,G.wvt/2);if(G.wvt<=0)V.wave=0}
 G.excite=Math.max(0,G.excite-dt*.12);for(const m of V.mood){const k=Math.exp(-dt*.45);m.j*=Math.exp(-dt*.3);m.a*=k;if(G.chant<=0)m.s*=Math.exp(-dt*.6);m.d*=Math.exp(-dt*.25)}
 if(G.bed&&AC)G.bed.g.gain.value=.025+G.excite*.06+(st.ph===1?.02:0);
 fcCrowdUpd(dt,G.t);fcPtsUpd(dt);fcSb(st);
 G.sbt-=dt;if(G.sbt<=0){G.sbt=.5;const e=document.getElementById('fcT'),sc=st.ph===0?[0,0]:st.ph===1?fcScore(fx,st.tl):[fx.hg,fx.ag];if(e)e.textContent='ROVERS '+sc[0]+' - '+sc[1]+' '+fx.opp+'  '+(st.ph===0?'KO '+bkClock(st.rem):st.ph===1?(st.tl>=HT0&&st.tl<HT1?'HT':fcMin(st)+"'"):'FT');const f=document.getElementById('fcF');if(f)f.textContent='FAN LV '+fanLevel()+'  '+(FAN.xp%100)+'/100'}
 G.raf=requestAnimationFrame(fcLoop)}
/* ===== vD7: range FPS viewmodels (pistol / rifle / bow), tracers, flash, shells ===== */
const VMM=new THREE.MeshBasicMaterial({vertexColors:true,fog:false});
const VSK=0xd8a07c,VSL=0x2b3a52,VST=0x2a2c33,VPO=0x17171b,VWD=0x7a4e28;
function vmShade(g,col){const c=new THREE.Color(col),n=g.attributes.normal,p=g.attributes.position,a=new Float32Array(p.count*3);for(let i=0;i<p.count;i++){const l=Math.max(0,-.35*n.getX(i)+.8*n.getY(i)+.5*n.getZ(i)),s=.5+.55*l;a[i*3]=Math.min(1,c.r*s);a[i*3+1]=Math.min(1,c.g*s);a[i*3+2]=Math.min(1,c.b*s)}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g}
function vmM(p,g,col,x,y,z){const m=new THREE.Mesh(vmShade(g,col),VMM);m.position.set(x||0,y||0,z||0);m.frustumCulled=false;p.add(m);return m}
function vB(p,w,h,d,col,x,y,z,rx,ry,rz){const m=vmM(p,new THREE.BoxGeometry(w,h,d),col,x,y,z);if(rx)m.rotation.x=rx;if(ry)m.rotation.y=ry;if(rz)m.rotation.z=rz;return m}
function vC(p,rt,rb,len,col,x,y,z,ax){const g=new THREE.CylinderGeometry(rt,rb,len,14);if(ax==='x')g.rotateZ(-Math.PI/2);else if(ax!=='y')g.rotateX(-Math.PI/2);return vmM(p,g,col,x,y,z)}
function vS(p,r,col,x,y,z){return vmM(p,new THREE.SphereGeometry(r,10,8),col,x,y,z)}
const vmUZ=new THREE.Vector3(0,0,1);
function vmSeg(m,a,b){const d=b.clone().sub(a),l=d.length();m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(vmUZ,d.normalize());m.scale.z=l}
function vmSegMesh(p,t,col){const m=vmM(p,new THREE.BoxGeometry(t,t,1),col);return m}
function vmHand(p,x,y,z,s,rz){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.z=rz||0;p.add(g);vB(g,.05*s,.032*s,.06*s,VSK,0,0,0);for(let i=0;i<4;i++)vB(g,.011*s,.013*s,.045*s,VSK,-.018*s+i*.0125*s,-.006*s,-.05*s);vB(g,.014*s,.014*s,.04*s,VSK,.03*s,.008*s,-.02*s,0,-.5);return g}
function vmFlashTex(){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),r=g.createRadialGradient(32,32,2,32,32,30);r.addColorStop(0,'rgba(255,255,230,1)');r.addColorStop(.25,'rgba(255,210,80,.9)');r.addColorStop(.6,'rgba(255,120,20,.35)');r.addColorStop(1,'rgba(255,80,0,0)');g.fillStyle=r;g.fillRect(0,0,64,64);g.fillStyle='rgba(255,230,150,.9)';for(let i=0;i<6;i++){g.save();g.translate(32,32);g.rotate(i*1.047);g.fillRect(-1.5,0,3,30);g.restore()}return new THREE.CanvasTexture(c)}
function vmPistol(){
 const R=new THREE.Group(),G=new THREE.Group(),SL=new THREE.Group();R.add(G);G.add(SL);G.position.set(.125,-.125,-.44);G.rotation.y=.12;
 vB(SL,.034,.036,.2,VST,0,.02,-.1);vB(SL,.012,.004,.19,0x3a3d46,0,.0405,-.1);
 for(let i=0;i<7;i++)vB(SL,.0365,.03,.005,0x101014,0,.021,-.01-i*.009);
 vB(SL,.004,.014,.05,0x08080a,.0175,.027,-.1);vB(SL,.004,.012,.03,0xb08a40,.0175,.003,-.2);
 vB(SL,.007,.012,.008,VST,0,.047,-.19);vB(SL,.003,.003,.002,0xffffff,0,.047,-.195);
 vB(SL,.007,.011,.008,VST,-.01,.046,-.02);vB(SL,.007,.011,.008,VST,.01,.046,-.02);vB(SL,.002,.003,.002,0xffffff,-.01,.047,-.025);vB(SL,.002,.003,.002,0xffffff,.01,.047,-.025);
 vC(SL,.0085,.0085,.026,0x0e0e12,0,.016,-.212);vC(SL,.005,.005,.003,0x000000,0,.016,-.226);
 vB(SL,.036,.004,.2,0x4a4d58,0,.002,-.1);
 vB(G,.03,.026,.17,VPO,0,-.003,-.09);vB(G,.03,.006,.05,VPO,0,-.012,-.18);vB(G,.034,.01,.03,0x4a4d58,0,-.006,-.095);
 vB(G,.027,.005,.052,VPO,0,-.032,-.083);vB(G,.027,.024,.005,VPO,0,-.02,-.109);vB(G,.027,.024,.005,VPO,0,-.02,-.057);
 vB(G,.006,.017,.006,0x8a8a92,0,-.016,-.07,.2);
 vB(G,.034,.09,.05,0x1b1b1f,0,-.058,-.014,.2);
 for(let sx=-1;sx<=1;sx+=2)for(let i=0;i<3;i++)for(let j=0;j<5;j++)vB(G,.002,.007,.007,0x34343c,sx*.0185,-.03-j*.0125+.02*i*0,-.034+i*.012+j*.0025,.2);
 vB(G,.039,.008,.055,0x555560,0,-.105,-.002,.2);vB(G,.008,.012,.012,0x8a8a92,0,.013,.003);
 vB(G,.004,.009,.032,0x8a8a92,.0185,.0,-.07);vB(G,.005,.008,.01,0x8a8a92,.019,.012,-.02);vC(G,.003,.003,.03,0xb08a40,0,.008,-.205,'x');
 const hr=vmHand(G,-.004,-.052,.012,1.15);hr.rotation.set(.2,0,0);vB(G,.065,.06,.22,VSL,.012,-.12,.15,.45,0,.1);vB(G,.07,.026,.07,0xdddddd,.012,-.095,.045,.3);
 vB(G,.012,.011,.04,VSK,0,-.012,-.062);vB(G,.014,.014,.05,VSK,-.027,-.03,-.03,0,0,0);
 vB(G,.055,.024,.065,VSK,-.014,-.112,-.012,.2);for(let i=0;i<3;i++)vB(G,.04,.012,.03,VSK,-.012-i*.002,-.094+i*.0,-.058,.1);vB(G,.055,.05,.22,VSL,-.12,-.17,.12,.4,.7,.1);
 const mz=new THREE.Object3D();mz.position.set(0,.016,-.228);G.add(mz);return{g:R,G,SL,muz:mz,k:'pistol',bz:-.44,by:-.125,bx:.125}}
function vmRifle(){
 const R=new THREE.Group(),G=new THREE.Group(),BO=new THREE.Group();R.add(G);G.add(BO);G.position.set(.11,-.15,-.38);G.rotation.y=.07;
 vB(G,.042,.05,.3,0x23252b,0,0,-.15);vB(G,.044,.008,.3,0x3a3c44,0,.027,-.15);vB(G,.004,.018,.06,0x08080a,.0215,.01,-.12);
 vC(G,.0105,.0105,.52,0x1a1b20,0,.012,-.57);vC(G,.014,.014,.02,0x3a3c44,0,.012,-.83);vC(G,.005,.005,.003,0,0,.012,-.842);
 vB(G,.004,.022,.004,0x1a1b20,0,.032,-.80);vB(G,.014,.006,.014,0x1a1b20,0,.043,-.80);
 vB(G,.048,.04,.3,VWD,0,-.032,-.4);vB(G,.046,.004,.3,0x9a6a38,0,-.011,-.4);for(let i=0;i<7;i++)vB(G,.0485,.002,.02,0x5a3818,0,-.03+((i*7)%4)*.006,-.28-i*.04);
 vB(G,.054,.022,.02,0x15151a,0,-.016,-.56);
 vB(G,.05,.065,.32,VWD,0,-.03,.17,-.05);vB(G,.044,.018,.14,0x8a5a2e,0,.014,.12);vB(G,.052,.09,.03,0x15151a,0,-.045,.33,-.08);
 for(let i=0;i<8;i++)vB(G,.052,.002,.03,0x5a3818,0,-.02+((i*5)%5)*.01,.07+i*.04,-.05);
 vB(G,.036,.09,.042,0x6a4222,0,-.085,.04,.35);vB(G,.04,.01,.05,0x15151a,0,-.13,.055,.35);
 vB(G,.024,.005,.07,0x15151a,0,-.062,-.04);vB(G,.024,.03,.005,0x15151a,0,-.047,-.075);vB(G,.005,.016,.004,0x8a8a92,0,-.045,-.025,.15);
 vB(G,.022,.05,.06,0x303038,0,-.07,-.17);vB(G,.02,.006,.062,0x606068,0,-.098,-.17);
 vC(G,.004,.004,.02,0x8a8a92,.0,-.058,-.52,'x');
 vC(BO,.0045,.0045,.05,0x8a8a92,.047,.012,-.01,'x');vS(BO,.011,0x15151a,.074,.012,-.01);vB(BO,.014,.014,.05,0x23252b,.0,.012,-.03);
 const sg=new THREE.Group();sg.position.set(0,.075,0);G.add(sg);
 vC(sg,.015,.015,.28,0x101014,0,0,-.17);vC(sg,.027,.02,.07,0x101014,0,0,-.34);vC(sg,.021,.027,.012,0x24242a,0,0,-.382);vC(sg,.023,.023,.002,0x3a6aa8,0,0,-.389);
 vC(sg,.013,.022,.06,0x101014,0,0,.01);vC(sg,.022,.022,.01,0x24242a,0,0,.043);vC(sg,.014,.014,.002,0x6aa0e0,0,0,.049);
 vC(sg,.012,.012,.02,0x303038,0,.02,-.16,'y');vC(sg,.012,.012,.02,0x303038,.021,0,-.16,'x');vC(sg,.016,.016,.006,0x0a0a0c,0,.032,-.16,'y');
 vB(sg,.03,.035,.014,0x2a2a30,0,-.026,-.09);vB(sg,.03,.035,.014,0x2a2a30,0,-.026,-.25);vB(sg,.016,.014,.016,0x2a2a30,0,.0,-.17+.01);
 vB(G,.006,.003,.05,0xc8c8d0,0,.0295,-.17);
 vmHand(G,0,-.075,.04,1.2).rotation.set(.35,0,0);vB(G,.07,.06,.22,VSL,.02,-.15,.17,.5,0,.15);vB(G,.07,.024,.07,0xdddddd,.02,-.12,.08,.4);
 vB(G,.07,.022,.075,VSK,0,-.062,-.44);for(let i=0;i<4;i++)vB(G,.012,.014,.05,VSK,-.027+i*.018,-.01,-.44,0,0,0);vB(G,.014,.014,.04,VSK,.034,-.03,-.42,0,-.4);vB(G,.07,.055,.22,VSL,-.1,-.12,-.31,.1,.6,.1);
 const mz=new THREE.Object3D();mz.position.set(0,.012,-.85);G.add(mz);return{g:R,G,BO,sg,muz:mz,k:'rifle',bz:-.38,by:-.15,bx:.11}}
function vmBow(){
 const R=new THREE.Group(),G=new THREE.Group();R.add(G);G.position.set(-.1,-.12,-.6);G.rotation.y=-.17;
 vB(G,.026,.3,.034,0x1c1e24,0,0,0);vB(G,.032,.09,.04,0x6a4222,0,-.01,.0);for(let i=0;i<5;i++)vB(G,.033,.004,.041,0x3a2410,0,-.04+i*.016,0);
 vB(G,.004,.05,.04,0x8a8a92,-.02,.07,-.01);vC(G,.002,.002,.012,0x40e060,-.02,.09,-.03,'z');vB(G,.012,.01,.05,0x1c1e24,-.026,.03,-.02);
 vC(G,.006,.006,.2,0x2a2c33,.0,-.1,.0,'y');vB(G,.012,.01,.012,0xb02020,0,-.205,0);vC(G,.006,.006,.12,0x2a2c33,.004,0,-.12);vB(G,.012,.012,.012,0xd0a020,.004,0,-.19);
 const P=[[.14,0],[.2,.02],[.27,.06],[.33,.12],[.375,.2]],lim=[];
 for(const sg of [1,-1])for(let i=0;i<P.length-1;i++){const a=new THREE.Vector3(0,sg*P[i][0],P[i][1]),b=new THREE.Vector3(0,sg*P[i+1][0],P[i+1][1]),m=vmSegMesh(G,.022-.003*i,i<2?0x15161a:0x8a5a2e);vmSeg(m,a,b);m.scale.z*=1.08}
 const tU=new THREE.Vector3(0,.375,.2),tL=new THREE.Vector3(0,-.375,.2);vB(G,.014,.014,.02,0xd0d0d8,0,.378,.21);vB(G,.014,.014,.02,0xd0d0d8,0,-.378,.21);
 const sU=vmSegMesh(G,.0025,0xf0ead0),sL=vmSegMesh(G,.0025,0xf0ead0);
 const AR=new THREE.Group();G.add(AR);vC(AR,.0035,.0035,.72,0xcdb88a,0,0,-.36);vC(AR,0,.007,.05,0xb0b0b8,0,0,-.745);
 for(let i=0;i<3;i++){const f=vB(AR,.0015,.026,.07,i?0xf0f0f0:0xd02828,0,0,-.04,0,0,i*2.094);}
 vB(AR,.012,.012,.012,0xe04020,0,0,.0);
 const hl=new THREE.Group();G.add(hl);vmHand(hl,-.005,-.012,.03,1.25).rotation.set(0,0,0);vB(hl,.06,.06,.22,VSL,-.05,-.12,.2,.5,.0,-.2);
 const hr=new THREE.Group();G.add(hr);vB(hr,.04,.03,.045,VSK,0,0,.02);for(let i=0;i<3;i++)vB(hr,.034,.009,.03,VSK,0,.006-i*.011,-.02);vB(hr,.05,.05,.3,VSL,.1,-.08,.2,.2,-.4,-.3);vB(hr,.052,.026,.07,0x9a9aa2,.06,-.04,.12);
 const mz=new THREE.Object3D();mz.position.set(0,0,-.745);AR.add(mz);return{g:R,G,AR,hr,sU,sL,tU,tL,muz:mz,k:'bow',bz:-.6,by:-.12,bx:-.1}}
function vmBuild(R){const w=R.w.k,V=w==='pistol'?vmPistol():w==='rifle'?vmRifle():vmBow();V.t0=0;V.kick=0;V.slT=9;V.fl=0;V.pr=[];V.sh=[];V.py=0;V.pp=0;V.lagY=0;V.lagP=0;V.first=1;
 const f=new THREE.Mesh(new THREE.PlaneGeometry(.26,.26),new THREE.MeshBasicMaterial({map:vmFlashTex(),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));f.visible=false;f.frustumCulled=false;V.muz.add(f);V.flm=f;
 V.shellG=new THREE.CylinderGeometry(.0034,.0034,.012,8);V.shellM=new THREE.MeshBasicMaterial({color:0xc8a040,fog:false});
 scene.add(V.g);return V}
function vmFree(R){const V=R.vm;if(!V)return;scene.remove(V.g);for(const p of V.pr)scene.remove(p.m);for(const s of V.sh)V.g.remove(s.m);R.vm=null;cam.near=.3;cam.updateProjectionMatrix()}
function vmFire(pw){const R=RG,V=R.vm;if(!V)return;const w=R.w.k;V.kick=1;
 const a=new THREE.Vector3();V.muz.getWorldPosition(a);
 let b;if(R.hitP)b=SG.localToWorld(new THREE.Vector3(R.hitP[0],R.hitP[1],R.hitP[2]));else{const D=R.shotD||new THREE.Vector3(0,0,-1),t=Math.abs((-12.5-RGZ)/(D.z||-1));b=SG.localToWorld(new THREE.Vector3(R.lx+D.x*t,RGEY+D.y*t,RGZ+D.z*t))}
 if(w==='bow'){const m=new THREE.Group();vC(m,.0035,.0035,.72,0xcdb88a,0,0,-.36);vC(m,0,.007,.05,0xb0b0b8,0,0,-.745);for(let i=0;i<3;i++)vB(m,.0015,.026,.07,i?0xf0f0f0:0xd02828,0,0,-.04,0,0,i*2.094);m.scale.setScalar(1);scene.add(m);const dist=a.distanceTo(b),spd=28+42*pw;V.pr.push({m,a,b,t:0,dur:Math.max(.08,dist/spd),k:'arrow'});V.AR.visible=false}
 else{const m=vmSegMesh(scene,.012,0xfff0a0);m.material=new THREE.MeshBasicMaterial({color:0xfff0a0,transparent:true,fog:false,depthWrite:false});vmSeg(m,a,b);V.pr.push({m,a,b,t:0,dur:.07,k:'trc'});V.fl=.055;V.flm.rotation.z=Math.random()*6.28;V.flm.scale.setScalar(.8+Math.random()*.6);
  if(w==='pistol'){V.slT=0;const sh=new THREE.Mesh(V.shellG,V.shellM);sh.position.set(.04,.0,-.1).add(new THREE.Vector3(V.bx,V.by,V.bz));sh.frustumCulled=false;V.g.add(sh);V.sh.push({m:sh,v:new THREE.Vector3(.9+Math.random()*.5,1.1+Math.random()*.5,.5+Math.random()*.4),t:0,sp:(Math.random()-.5)*30})}
  else V.bt=0}}
function vmUpdate(dt){const R=RG;if(!R||!R.vm||!R.ph)return;const V=R.vm,w=R.w.k;
 if(R.ph!=='setup'&&cam.near>.1){cam.near=.08;cam.updateProjectionMatrix()}
 const show=DZ.k>.92&&R.ph!=='setup'&&!(w==='rifle'&&R.scope);V.g.visible=show;V.g.position.copy(cam.position);V.g.quaternion.copy(cam.quaternion);
 const d=rgDir(R),vy=V.first?0:(d.y-V.py)/Math.max(dt,.001),vp=V.first?0:(d.p-V.pp)/Math.max(dt,.001);V.first=0;V.py=d.y;V.pp=d.p;
 V.lagY+=(Math.max(-.14,Math.min(.14,vy*.05))-V.lagY)*Math.min(1,dt*10);V.lagP+=(Math.max(-.12,Math.min(.12,-vp*.05))-V.lagP)*Math.min(1,dt*10);
 const t=R.t,kk=V.kick=Math.max(0,V.kick-dt*(w==='rifle'?3.2:w==='pistol'?7:5)),G=V.G;
 G.position.set(V.bx+Math.sin(t*1.1)*.0016,V.by+Math.sin(t*1.7)*.0022,V.bz);
 if(w==='pistol'){G.position.z+=kk*.05;G.position.y+=kk*.008;G.rotation.x=kk*.26+V.lagP;G.rotation.y=.12+V.lagY;V.slT+=dt;const s=V.slT<.03?V.slT/.03:Math.max(0,1-(V.slT-.03)/.09);V.SL.position.z=s*.034}
 else if(w==='rifle'){G.position.z+=kk*.07;G.position.y+=kk*.012;G.rotation.x=kk*.2+V.lagP;G.rotation.y=.07+V.lagY;const p=R.cdt>0?1-R.cdt/R.w.cd:1;let o=0;if(p>.18&&p<.8)o=p<.38?(p-.18)/.2:p<.6?1:1-(p-.6)/.2;V.BO.position.z=o*.05;V.BO.rotation.z=o*.0}
 else{const dr=R.drawing?R.draw:0,nz=.12+dr*.3,sh=dr>.85?(Math.sin(t*38)*.0012):0;G.rotation.x=V.lagP;G.rotation.y=-.17+V.lagY;G.position.x+=sh;const N=new THREE.Vector3(0,0,nz);vmSeg(V.sU,V.tU,N);vmSeg(V.sL,V.tL,N);V.AR.position.set(-.018,.02,nz+.0);V.AR.visible=R.cdt<.3||R.drawing;V.hr.position.set(-.004,0,nz+.015);V.hr.visible=dr>.02||R.drawing;G.position.z+=kk*.02}
 const cx=V.cx&&V.cx.isConnected?V.cx:(V.cx=R.ov.querySelector('#rgx'));if(cx)cx.style.transform='scale('+(1+Math.min(2.2,R.rec*55+Math.abs(vy)*.5))+')';
 if(V.fl>0){V.fl-=dt;V.flm.visible=V.fl>0}else V.flm.visible=false;
 for(let i=V.pr.length-1;i>=0;i--){const p=V.pr[i];p.t+=dt;const u=Math.min(1,p.t/p.dur);if(p.k==='arrow'){p.m.position.lerpVectors(p.a,p.b,u);p.m.lookAt(p.b);p.m.rotateY(Math.PI);if(u>=1){p.m.position.copy(p.b);p.hold=(p.hold||0)+dt;if(p.hold>.6){scene.remove(p.m);V.pr.splice(i,1)}}}else{p.m.material.opacity=1-u;if(u>=1){scene.remove(p.m);V.pr.splice(i,1)}}}
 for(let i=V.sh.length-1;i>=0;i--){const s=V.sh[i];s.t+=dt;s.v.y-=4*dt;s.m.position.addScaledVector(s.v,dt);s.m.rotation.x+=s.sp*dt;if(s.t>.7){V.g.remove(s.m);V.sh.splice(i,1)}}}
function rgSprite(k){const d=document.createElement('div');d.style.display='none';return d}
function rgFov(){const R=RG;return R.w.k==='rifle'?(R.scope?24:50):R.w.k==='bow'?52:58}
{const s0=rgStart;rgStart=function(){const ph0=RG&&RG.ph;s0();const R=RG;if(!R||R.ph!=='play'||ph0!=='setup')return;R.scope=false;if(!R.vm){R.vm=vmBuild(R)}
 if(R.w.k==='rifle'){const b=document.createElement('div');b.className='rgb';b.textContent='SCOPE';b.style.cssText='left:12px;bottom:118px;width:78px;height:50px;border-radius:12px;background:#6a3a8a;display:flex;align-items:center;justify-content:center;font-size:12px';b.onpointerdown=e=>{e.stopPropagation();e.preventDefault();R.scope=!R.scope;const sc=R.ov.querySelector('#rgscope');if(sc)sc.style.display=R.scope?'block':'none';b.style.background=R.scope?'#a060d0':'#6a3a8a'};R.ov.appendChild(b);const sc=R.ov.querySelector('#rgscope');if(sc)sc.style.display='none'}}}
{const f0=rgShoot;rgShoot=function(pw){const R=RG,c=R?R.cdt:1;f0(pw);if(R&&R.vm&&c<=0&&R.cdt>0)vmFire(pw)}}
{const c0=rgClose;rgClose=function(q){const R=RG;if(R&&R.vm)vmFree(R);c0(q)}}
{const u1=updateCam;updateCam=function(dt){u1(dt);if(RG&&RG.vm)vmUpdate(dt)}}
/* ===== vD8: NEON ARCADE - interior, 5 mini-games, tickets & prize counter ===== */
Object.assign(HRS,{'NEON ARCADE':[10,24]});
TH['NEON ARCADE']={wall:0x2a2040,fl:'stone',cnt:0x303038,top:0x888890,sh:0x2a2a30};
var ARP={tix:0,best:{},won:{}};try{Object.assign(ARP,JSON.parse(localStorage.getItem('c1arc')||'{}'))}catch(e){czErr(e,"15-football-engine.js")}
function arSave(){try{localStorage.setItem('c1arc',JSON.stringify(ARP))}catch(e){czErr(e,"15-football-engine.js")}}
const ARN=['ROVER INVADERS','BRICK BASH','C1 RUSH','WHACK-A-MOLE','CLAW GRABBER','AIR HOCKEY','STREET BRAWLER','SNAKE BITE','ROVER RUNNER','ROVER RACER','PINBALL'];
const ARC=[0x20e0ff,0xff4090,0xffa020,0x60ff60,0xc060ff,0x4090ff,0xff3030,0x80ff40,0xffd040,0xff6020,0xff40ff];
{const c0=cloItems;cloItems=function(){const fresh=!CLOIT,r=c0();if(fresh){r[3].push({id:'acc:arp',n:'NEON PINK SCARF',p:30,ap:c=>{c.scarf=[1,.2,.7]},rm:c=>{c.scarf=null},has:c=>chEq(c.scarf,[1,.2,.7])},{id:'acc:arc',n:'ARCADE CYAN SCARF',p:30,ap:c=>{c.scarf=[.1,.85,.95]},rm:c=>{c.scarf=null},has:c=>chEq(c.scarf,[.1,.85,.95])});r[0].push({id:'top:arg',n:'GOLDEN WINNER SHIRT',p:60,ap:c=>{c.ts=0;c.tc=[.95,.75,.1]},has:c=>c.ts===0&&chEq(c.tc,[.95,.75,.1])})}return r}}
