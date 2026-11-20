/* ---- people: lofted low-poly figures with seeded variety (cheap: ~300 tris, 5 draw calls) ---- */
const PSK=[[.96,.78,.66],[.89,.69,.54],[.78,.57,.41],[.6,.42,.3],[.44,.3,.21],[.93,.74,.6]],
PHR=[[.1,.07,.05],[.27,.15,.08],[.5,.34,.14],[.82,.68,.38],[.64,.64,.66],[.06,.06,.07],[.55,.2,.1],[.2,.12,.07]],
PTC=[[.78,.2,.2],[.2,.35,.7],[.9,.82,.3],[.25,.55,.35],[.85,.85,.88],[.5,.25,.5],[.9,.5,.2],[.15,.45,.5],[.35,.35,.4],[.95,.6,.7],[.55,.4,.25],[.12,.12,.15]],
PBC=[[.2,.3,.5],[.1,.1,.12],[.5,.43,.3],[.35,.35,.38],[.14,.18,.3],[.35,.25,.15],[.25,.4,.3]],
PSH=[[.12,.1,.1],[.4,.25,.15],[.85,.85,.85],[.5,.12,.12]];
function pRng(seed){let s=(seed>>>0)||1;return()=>(s=(s*1664525+1013904223)>>>0)/4294967296}
function pSpec(seed,o){const r=pRng(seed*2654435761+97),pk=a=>a[Math.floor(r()*a.length)],f=r()<.5,old=r()<.22;r();const sp={f,w:(f?.92:1)*(.92+r()*.2),h:.9+r()*.2,sk:pk(PSK),hr:old?PHR[4]:pk(PHR),hs:Math.floor(r()*8),beard:!f&&r()<.28,ts:Math.floor(r()*5),tc:pk(PTC),bc:pk(PBC),sc:pk(PSH),scarf:r()<.22?pk(PTC):null,gl:r()<.22,bag:r()<.28?1:0,bp:r()<.12,st:old?.035:r()*.01,sh:f&&r()<.4,old};if(f&&sp.ts===3&&r()<.5)sp.ts=4;if(!f&&sp.ts===4)sp.ts=1;if(sp.hs===3&&f)sp.hs=1;return Object.assign(sp,o||{})}
const dk=(c,k)=>[c[0]*k,c[1]*k,c[2]*k];
function lft(B,R,seg,cap,capB){const P=R.map(r=>{const a=[];for(let i=0;i<seg;i++){const t=i/seg*6.2832;a.push([(r.cx||0)+Math.cos(t)*r.rx,r.y,(r.cz||0)+Math.sin(t)*r.rz])}return a});
 for(let k=0;k<R.length-1;k++){const a=R[k],b=R[k+1],cen=[((a.cx||0)+(b.cx||0))/2,(a.y+b.y)/2,((a.cz||0)+(b.cz||0))/2];for(let i=0;i<seg;i++){const j=(i+1)%seg;B.tri(P[k][i],P[k][j],P[k+1][j],a.c,a.c,b.c,false,cen);B.tri(P[k][i],P[k+1][j],P[k+1][i],a.c,b.c,b.c,false,cen)}}
 if(cap){const L=R[R.length-1],pp=P[R.length-1],c=[L.cx||0,L.y+(L.top||0),L.cz||0];for(let i=0;i<seg;i++)B.tri(pp[i],pp[(i+1)%seg],c,L.c,L.c,L.c,true)}
 if(capB){const L=R[0],pp=P[0],c=[L.cx||0,L.y-.002,L.cz||0];for(let i=0;i<seg;i++)B.tri(pp[i],pp[(i+1)%seg],c,L.c,L.c,L.c,false,[c[0],c[1]+.2,c[2]])}}
function lfz(B,R,seg,col,oy){const P=R.map(r=>{const a=[];for(let i=0;i<seg;i++){const t=i/seg*6.2832;a.push([(r.cx||0)+Math.cos(t)*r.rx,oy+(r.cy)+Math.sin(t)*r.ry,r.z])}return a});
 for(let k=0;k<R.length-1;k++){const cen=[0,oy+(R[k].cy+R[k+1].cy)/2,(R[k].z+R[k+1].z)/2];for(let i=0;i<seg;i++){const j=(i+1)%seg;B.tri(P[k][i],P[k][j],P[k+1][j],col,col,col,false,cen);B.tri(P[k][i],P[k+1][j],P[k+1][i],col,col,col,false,cen)}}}
function mkPerson(sp,mat,parent){const w=sp.w,S=sp.sk,hr=sp.hr,tc=sp.tc,bc=sp.bc,UP=new Builder(3),A1=new Builder(3),A2=new Builder(3),L1=new Builder(3),L2=new Builder(3),st=sp.st,ts=sp.ts,F=sp.f;
 const hem=ts===3?.62:ts===4?.55:.86,topc=ts===11?dk(tc,.62):tc,tdk=dk(tc,.8),GD=[.92,.74,.26],LONG=ts===11||ts===13,skc=ts===11?tc:bc;
 // torso
 const T=[{y:hem,rx:(ts===3||ts===4?(F?.27:.23):.222)*w,rz:(ts===3||ts===4?.15:.15),c:tdk},{y:.98,rx:(F?.2:.205)*w,rz:.128,c:topc},{y:1.14,rx:(F?.145:.168)*w,rz:.1,cz:st*.5,c:topc},{y:1.28,rx:(F?.165:.195)*w,rz:.11,cz:st,c:topc},{y:1.4,rx:(F?.18:.215)*w,rz:.105,cz:st*1.5,c:dk(topc,1.05)},{y:1.47,rx:.1*w,rz:.08,cz:st*2,c:ts===2?dk(topc,.9):S},{y:1.53,rx:.06,rz:.062,cz:st*2.4,c:S}];
  const CL={3:[.5,.245,.145],5:[.7,.215,.128],6:[.8,.215,.12],7:[.58,.225,.134],8:[.42,.3,.18],10:[.54,.232,.138],12:[.46,.242,.145]}[ts];
  if(CL){const[h0,r0,z0]=CL,cc=ts===7?dk(tc,.9):tdk;T.splice(0,2,{y:h0-.015,rx:r0*w,rz:z0,c:dk(tc,.55)},{y:h0,rx:r0*w,rz:z0,c:cc},{y:(h0+.93)/2,rx:(r0+.218)/2*w,rz:(z0+.128)/2,c:cc},{y:.93,rx:.218*w,rz:.128,c:cc},{y:1.05,rx:(F?.15:.165)*w,rz:.106,c:topc})}
  else if(LONG){const sk=skc;T.splice(0,2,{y:.05,rx:.272*w,rz:.205,c:dk(GD,.8)},{y:.06,rx:.272*w,rz:.205,c:GD},{y:.13,rx:.268*w,rz:.2,c:GD},{y:.14,rx:.266*w,rz:.198,c:sk},{y:.45,rx:.246*w,rz:.172,c:sk},{y:.75,rx:.228*w,rz:.142,c:dk(sk,.96)},{y:.93,rx:.212*w,rz:.127,c:sk},{y:1.04,rx:(F?.14:.155)*w,rz:.098,c:topc})}
  else if(ts===4){const sk=dk(bc,1.15);T.splice(0,2,{y:.535,rx:.262*w,rz:.15,c:dk(bc,.7)},{y:.55,rx:.262*w,rz:.15,c:sk},{y:.75,rx:.236*w,rz:.138,c:sk},{y:.93,rx:.214*w,rz:.126,c:sk},{y:1.04,rx:(F?.14:.155)*w,rz:.098,c:topc})}
  T[T.length-1].top=0;lft(UP,T,8,true,true);
  if(ts===3){const bk=dk(tc,.45),lt=dk(tc,1.12);
   lft(UP,[{y:.9,rx:.222*w,rz:.132,c:[.3,.2,.12]},{y:.98,rx:.222*w,rz:.132,c:[.34,.23,.14]}],8,false);
   pb(UP,0,.96,.136,.05,.07,.02,[.85,.75,.3]);
   pb(UP,0,.76,.145,.018,.58,.016,bk);pb(UP,0,1.2,.122+st*1.2,.018,.34,.016,bk);
   for(const y of[.62,.74,1.1,1.22])pb(UP,0,y,.152,.034,.034,.02,[.85,.82,.7]);
   for(const sx of[-1,1]){pb(UP,sx*.13*w,.7,.142,.07,.012,.016,bk);pb(UP,sx*.14*w,.64,.143,.08,.07,.018,dk(tc,.85));
    pb(UP,sx*.085,1.4,.108+st*1.6,.06,.2,.02,lt);pb(UP,sx*.06,1.47,.106+st*1.9,.08,.07,.02,lt)}
   lft(UP,[{y:1.43,rx:.118,rz:.108,cz:st*2.1,c:lt},{y:1.56,rx:.1,rz:.1,cz:st*2.4,c:dk(tc,.95)}],8,false)}
  if(ts===5){const lp=dk(tc,1.25),dkk=dk(tc,.5),wh=[.95,.95,.97],gd=[.82,.72,.3];
   pb(UP,0,1.28,.118+st*1.2,.075,.3,.016,wh);pb(UP,0,1.27,.124+st*1.2,.028,.26,.014,[.7,.1,.15]);
   for(const sx of[-1,1]){pb(UP,sx*.078,1.3,.114+st*1.2,.055,.3,.02,lp);pb(UP,sx*.13*w,.82,.134,.075,.012,.016,dkk);pb(UP,sx*.12*w,1.18,.122+st,.045,.012,.014,wh)}
   pb(UP,0,.86,.134,.02,.02,.02,gd);pb(UP,0,.98,.129,.02,.02,.02,gd);
   lft(UP,[{y:1.44,rx:.112,rz:.104,cz:st*2.2,c:wh},{y:1.52,rx:.096,rz:.094,cz:st*2.4,c:wh}],8,false)}
  if(ts===6){const lt=dk(tc,1.3),dkk=dk(tc,.55),sv=[.82,.82,.86];
   pb(UP,0,1.04,.12,.014,.66,.014,sv);for(const sx of[-1,1]){pb(UP,sx*.11*w,.93,.125,.07,.012,.014,sv);pb(UP,sx*.16*w,1.46,0,.07,.025,.1,dkk);pb(UP,sx*.085,1.38,.1+st*1.5,.06,.16,.02,lt)}
   lft(UP,[{y:1.42,rx:.122,rz:.112,cz:st*2.1,c:dkk},{y:1.56,rx:.108,rz:.1,cz:st*2.4,c:dk(tc,.85)}],8,false);
   lft(UP,[{y:.8,rx:.218*w,rz:.122,c:dkk},{y:.88,rx:.219*w,rz:.123,c:dkk}],8,false)}
  if(ts===7){const bk=[.03,.03,.05],wh=[.97,.97,.99];
   pb(UP,0,1.28,.116,.11,.34,.016,wh);pb(UP,0,1.43,.123,.1,.045,.02,bk);pb(UP,0,1.43,.128,.03,.04,.024,bk);
   for(const sx of[-1,1]){pb(UP,sx*.078,1.26,.112,.045,.36,.022,bk);pb(UP,sx*.07,.4,-.125,.1,.34,.03,dk(tc,.95))}
   pb(UP,0,.97,.134,.02,.02,.02,bk);pb(UP,.1,1.2,.12,.03,.02,.014,[.8,.1,.2])}
  if(ts===8){const fur=[Math.min(1,tc[0]*1.15+.12),Math.min(1,tc[1]*1.15+.12),Math.min(1,tc[2]*1.15+.12)],gd=[.9,.76,.28];
   lft(UP,[{y:1.3,rx:.2,rz:.145,cz:st*1.6,c:fur},{y:1.42,rx:.175,rz:.13,cz:st*2,c:dk(fur,1.06)},{y:1.52,rx:.135,rz:.115,cz:st*2.3,c:fur},{y:1.6,rx:.09,rz:.09,cz:st*2.4,c:dk(fur,.92)}],8,false);
   lft(UP,[{y:.4,rx:.305*w,rz:.185,c:fur},{y:.52,rx:.292*w,rz:.172,c:dk(fur,1.05)}],8,false);
   lft(UP,[{y:.9,rx:.222*w,rz:.132,c:gd},{y:.96,rx:.222*w,rz:.132,c:gd}],8,false);
   for(const y of[.62,.78,1.1])pb(UP,0,y,.172,.04,.04,.02,gd)}
  if(ts===9)lft(UP,[{y:1.42,rx:.108,rz:.102,cz:st*2.2,c:dk(tc,.95)},{y:1.52,rx:.1,rz:.096,cz:st*2.4,c:dk(tc,1.05)},{y:1.6,rx:.085,rz:.086,cz:st*2.5,c:tc}],8,false);
  /* ---- Indian wear ---- */
  if(ts===10||ts===12){const h0=CL[0],tr=ts===12?GD:dk(tc,1.35),cl=ts===12?dk(tc,.85):dk(tc,.8);
   lft(UP,[{y:h0+.005,rx:CL[1]*w+.004,rz:CL[2]+.004,c:tr},{y:h0+(ts===12?.06:.045),rx:(CL[1]-.004)*w+.004,rz:CL[2]+.002,c:tr}],8,false);
   lft(UP,[{y:1.42,rx:.104,rz:.1,cz:st*2.2,c:cl},{y:1.53,rx:.098,rz:.094,cz:st*2.4,c:cl},{y:1.535,rx:.099,rz:.095,cz:st*2.4,c:tr}],8,false);
   if(ts===12){pb(UP,0,.74,.15,.03,.5,.014,GD);pb(UP,0,1.2,.124+st*1.2,.03,.46,.014,GD);for(const y of[.6,.78,.96,1.1,1.24,1.36])pb(UP,0,y,y<.97?.16:.134+st*1.2,.03,.03,.02,[1,.9,.5]);for(const sx of[-1,1])pb(UP,sx*.16*w,.62,.15,.06,.06,.02,GD)}
   else{pb(UP,0,1.27,.12+st*1.2,.026,.26,.014,tr);for(const y of[1.18,1.26,1.34])pb(UP,0,y,.128+st*1.2,.02,.02,.016,[.95,.9,.75])}}
  if(LONG){const dp=ts===11?tc:dk(bc,1.25),bd=GD,pal=(x0,y0,z0,x1,y1,z1,n,cc,wd)=>{for(let k=0;k<=n;k++){const t=n?k/n:0;pb(UP,x0+(x1-x0)*t,y0+(y1-y0)*t,z0+(z1-z0)*t,wd,.1,.025,cc)}};
   if(ts===13){lft(UP,[{y:.3,rx:.258*w,rz:.188,c:bd},{y:.34,rx:.256*w,rz:.186,c:bd}],8,false);lft(UP,[{y:1.0,rx:(F?.163:.178)*w,rz:.105,c:S},{y:1.08,rx:(F?.148:.166)*w,rz:.102,c:S}],8,false)}
   pal(.15*w,.92,.15,-.11,1.44,.128+st*1.8,9,dp,.12);pal(.16*w,.86,.152,-.1,1.38,.132+st*1.8,9,bd,.03);
   pal(-.13,1.47,0,-.13,1.47,0,0,dp,.13);pal(-.12,1.44,-.115,-.12,.62,-.155,8,dp,.13);pb(UP,-.12,.58,-.157,.135,.06,.026,bd)}
  if(ts===4){lft(UP,[{y:1.02,rx:(F?.142:.157)*w,rz:.1,c:dk(bc,.65)},{y:1.06,rx:(F?.142:.157)*w,rz:.1,c:dk(bc,.7)}],8,false)}
 if(ts===2){lft(UP,[{y:1.42,rx:.1,rz:.1,cz:st*2.2-.02,c:dk(tc,.8)},{y:1.52,rx:.095,rz:.1,cz:st*2.4-.04,c:dk(tc,.85)},{y:1.6,rx:.07,rz:.08,cz:st*2.4-.06,c:dk(tc,.9)}],8,false)}
 if(sp.scarf){const c=sp.scarf;lft(UP,[{y:1.44,rx:.095,rz:.09,cz:st*2.2,c:c},{y:1.55,rx:.088,rz:.085,cz:st*2.4,c:c}],8,false);pb(UP,0,1.36,.09+st*1.6,.07,.17,.03,c)}
 // head
 const hz=st*2.8,H=[{y:1.54,rx:.052,rz:.055,cz:hz,c:S},{y:1.6,rx:.07,rz:.08,cz:hz+.01,c:S},{y:1.67,rx:.09,rz:.098,cz:hz,c:S},{y:1.75,rx:.095,rz:.105,cz:hz,c:S},{y:1.82,rx:.085,rz:.096,cz:hz-.005,c:S},{y:1.87,rx:.055,rz:.062,cz:hz-.01,c:S}];H[5].top=.012;lft(UP,H,8,true,false);
 pb(UP,0,1.65,hz+.098,.032,.05,.045,dk(S,.93));
 for(const sx of[-1,1]){pb(UP,sx*.043,1.735,hz+.092,.026,.02,.012,[.08,.06,.06]);pb(UP,sx*.1,1.69,hz-.005,.018,.055,.04,dk(S,.9))}
 pb(UP,0,1.625,hz+.085,.04,.011,.012,dk(S,.6));
 if(sp.beard)pb(UP,0,1.58,hz+.055,.12,.08,.07,hr);
 if(sp.gl){const gl=sp.gl===3,fr=gl?[.9,.75,.25]:[.08,.08,.1],ln=sp.gl===2?[.04,.04,.06]:gl?[.75,.55,.2]:[.6,.7,.8],sz=sp.gl>1?.055:.045;pb(UP,0,1.74,hz+.1,.15,.012,.012,fr);pb(UP,-.045,1.735,hz+.1,sz,sp.gl>1?.05:.04,.012,ln);pb(UP,.045,1.735,hz+.1,sz,sp.gl>1?.05:.04,.012,ln);if(sp.gl>1){pb(UP,-.092,1.74,hz+.04,.01,.012,.11,fr);pb(UP,.092,1.74,hz+.04,.01,.012,.11,fr)}}
  if(sp.nk){const gd=[.92,.78,.3];lft(UP,[{y:1.395,rx:.112,rz:.104,cz:st*2.1,c:gd},{y:1.408,rx:.112,rz:.104,cz:st*2.1,c:gd}],8,false);pb(UP,0,1.3,.124+st*1.6,.03,.05,.012,gd);pb(UP,0,1.34,.123+st*1.6,.012,.06,.01,gd)}
 const hNew=(hs,cap)=>{const dh=(f)=>dk(hr,f),hc=sp.hc||[.2,.25,.5];
   if(hs===8)lft(UP,cap.map(r=>({...r,rx:r.rx*.965,rz:r.rz*.965,c:dh(.85)})),8,true);
   else if(hs===9){lft(UP,cap,8,true);for(const sx of[-1,1])pb(UP,sx*.108,1.66,hz-.01,.03,.2,.17,hr);pb(UP,0,1.66,hz-.1,.2,.2,.04,dh(.9));pb(UP,0,1.84,hz+.108,.19,.05,.03,hr)}
   else if(hs===10){lft(UP,cap.map(r=>({...r,rx:r.rx*.965,rz:r.rz*.965,c:dh(.45)})),8,true);for(let k=0;k<6;k++){const h=.1+.05*Math.sin(k*.5+.4);pb(UP,0,1.9+h/2,hz+.09-k*.034,.03,h,.034,hr)}}
   else if(hs===11){lft(UP,cap,8,true);pb(UP,0,1.93,hz+.05,.13,.07,.13,hr);pb(UP,0,1.98,hz+.1,.1,.06,.08,dh(1.1))}
   else if(hs===12){lft(UP,cap,8,true);for(const sx of[-1,1]){pb(UP,sx*.12,1.76,hz-.02,.05,.05,.06,[.9,.3,.5]);pb(UP,sx*.125,1.6,hz-.03,.06,.22,.06,hr)}}
   else if(hs===13){lft(UP,[{y:1.72,rx:.125,rz:.13,cz:hz-.03,c:dh(.85)},{y:1.84,rx:.14,rz:.138,cz:hz-.03,c:hr},{y:1.96,rx:.1,rz:.1,cz:hz-.03,top:.03,c:dh(1.1)}],8,true);for(const sx of[-1,1])pb(UP,sx*.125,1.58,hz-.03,.05,.24,.13,hr);pb(UP,0,1.55,hz-.1,.22,.3,.07,dh(.9))}
   else if(hs===14){lft(UP,cap.map(r=>({...r,c:dh(.8)})),8,true);pb(UP,0,1.78,hz-.11,.15,.14,.03,dh(.8));pb(UP,0,1.915,hz,.1,.008,.14,dh(1.9))}
   else if(hs===15){lft(UP,cap,8,true);for(const[x,z]of[[-.05,.05],[.05,.05],[0,.08],[-.06,-.03],[.06,-.03],[0,-.02],[0,-.1]])pb(UP,x,1.97,hz+z,.035,.08,.035,hr)}
   else if(hs===16){lft(UP,cap,8,true);for(const[x,y,z]of[[-.07,1.9,.06],[.06,1.92,.07],[0,1.95,.0],[-.08,1.88,-.05],[.08,1.9,-.04],[.02,1.93,-.08],[-.03,1.9,.1]])pb(UP,x,y,hz+z,.05,.045,.05,dh(.9+x*2))}
   else if(hs===17){lft(UP,[{y:1.8,rx:.112,rz:.122,cz:hz-.01,c:dk(hc,.8)},{y:1.855,rx:.135,rz:.145,cz:hz-.02,c:hc},{y:1.9,rx:.105,rz:.115,cz:hz-.02,top:.01,c:dk(hc,1.1)}],8,true);pb(UP,0,1.93,hz-.02,.02,.03,.02,dk(hc,.7))}
   else if(hs===18){lft(UP,[{y:1.8,rx:.168,rz:.172,cz:hz-.01,c:dk(hc,.7)},{y:1.815,rx:.168,rz:.172,cz:hz-.01,c:dk(hc,.85)}],8,true);lft(UP,[{y:1.81,rx:.1,rz:.112,cz:hz-.01,c:hc},{y:1.9,rx:.096,rz:.106,cz:hz-.01,c:hc},{y:1.96,rx:.08,rz:.096,cz:hz-.01,top:.012,c:dk(hc,1.1)}],8,true);lft(UP,[{y:1.815,rx:.103,rz:.115,cz:hz-.01,c:[.08,.08,.1]},{y:1.85,rx:.102,rz:.114,cz:hz-.01,c:[.08,.08,.1]}],8,false)}
   else if(hs===19){lft(UP,[{y:1.8,rx:.165,rz:.17,cz:hz-.01,c:[.05,.05,.07]},{y:1.815,rx:.165,rz:.17,cz:hz-.01,c:[.08,.08,.1]}],8,true);lft(UP,[{y:1.81,rx:.098,rz:.108,cz:hz-.01,c:[.06,.06,.08]},{y:2.1,rx:.092,rz:.102,cz:hz-.01,top:.01,c:[.09,.09,.11]}],8,true);lft(UP,[{y:1.815,rx:.1,rz:.11,cz:hz-.01,c:[.7,.12,.16]},{y:1.88,rx:.1,rz:.11,cz:hz-.01,c:[.78,.14,.18]}],8,false)}
   else if(hs===21){const dd=dk(hc,.8),lt=dk(hc,1.15);lft(UP,[{y:1.72,rx:.112,rz:.124,cz:hz-.012,c:dd},{y:1.79,rx:.13,rz:.142,cz:hz-.012,c:hc},{y:1.87,rx:.137,rz:.148,cz:hz-.016,c:lt},{y:1.94,rx:.122,rz:.132,cz:hz-.02,c:hc},{y:1.99,rx:.078,rz:.088,cz:hz-.02,top:.012,c:lt}],8,true);
    for(let k=0;k<4;k++){pb(UP,-.075+k*.05,1.765+k*.05,hz+.138-k*.004,.07,.028,.02,dd);pb(UP,.075-k*.05,1.79+k*.05,hz+.14-k*.004,.07,.026,.02,k%2?hc:lt)}pb(UP,0,1.9,hz+.134,.06,.13,.022,lt)}
   else if(hs===20){const gd=[.95,.8,.25];lft(UP,[{y:1.84,rx:.1,rz:.11,cz:hz-.01,c:dk(gd,.85)},{y:1.9,rx:.104,rz:.114,cz:hz-.01,c:gd}],8,true);for(let k=0;k<6;k++){const a=k/6*6.2832;pb(UP,Math.cos(a)*.1,1.95,hz-.01+Math.sin(a)*.108,.03,.07,.03,gd)}pb(UP,0,1.915,hz+.112,.025,.025,.02,[.9,.1,.2]);pb(UP,-.09,1.915,hz+.05,.025,.025,.02,[.1,.5,.9])}};
  const hH=hs=>{const cap=[{y:1.725,rx:.1,rz:.112,cz:hz-.012,c:dk(hr,.8)},{y:1.8,rx:.101,rz:.113,cz:hz-.012,c:hr},{y:1.87,rx:.088,rz:.1,cz:hz-.012,c:hr},{y:1.92,rx:.05,rz:.062,cz:hz-.012,top:.012,c:hr}];
  if(hs>=8){hNew(hs,cap);return}
   if(hs===0)lft(UP,cap,8,true);
  else if(hs===1){lft(UP,cap,8,true);lft(UP,[{y:1.74,rx:.104,rz:.04,cz:hz-.085,c:hr},{y:1.55,rx:.11,rz:.05,cz:hz-.1,c:hr},{y:1.38,rx:.09,rz:.05,cz:hz-.09,c:dk(hr,.85)}],8,false)}
  else if(hs===2){lft(UP,cap,8,true);pb(UP,0,1.88,hz-.12,.08,.07,.08,hr)}
  else if(hs===3){lft(UP,[{y:1.725,rx:.1,rz:.112,cz:hz-.012,c:dk(hr,.8)},{y:1.8,rx:.101,rz:.113,cz:hz-.012,c:hr},{y:1.87,rx:.09,rz:.102,cz:hz-.012,c:hr},{y:1.935,rx:.052,rz:.066,cz:hz-.005,top:.012,c:hr}],8,true);pb(UP,0,1.915,hz+.075,.13,.05,.07,hr)}
  else if(hs===4){lft(UP,cap,8,true);pb(UP,0,1.83,hz+.12,.19,.02,.11,dk([.35,.3,.28],1))}
  else if(hs===5){lft(UP,[{y:1.74,rx:.108,rz:.12,cz:hz-.012,c:[.6,.2,.2]},{y:1.85,rx:.105,rz:.118,cz:hz-.012,c:[.7,.25,.25]},{y:1.94,rx:.07,rz:.08,cz:hz-.012,top:.01,c:[.7,.25,.25]}],8,true);pb(UP,0,1.95,hz-.012,.04,.04,.04,[.9,.9,.9])}
  else if(hs===6){lft(UP,[{y:1.7,rx:.13,rz:.14,cz:hz-.02,c:dk(hr,.8)},{y:1.82,rx:.15,rz:.155,cz:hz-.02,c:hr},{y:1.95,rx:.12,rz:.13,cz:hz-.02,top:.02,c:hr}],8,true)}
  else{lft(UP,cap,8,true);lft(UP,[{y:1.75,rx:.108,rz:.1,cz:hz-.01,c:hr},{y:1.62,rx:.105,rz:.098,cz:hz-.02,c:dk(hr,.9)}],8,false)}};hH(sp.hs);
 if(sp.bp)pb(UP,0,1.0,-.2+st,.28*w,.4,.13,dk(tc,.5));
 if(sp.bag)pb(UP,.26*w,.88,.0,.07,.2,.22,[.5,.35,.2]);
 // arms
 const armR=(sleeve)=>{const R=[{y:.03,rx:.062,rz:.06,c:dk(tc,1.05)},{y:-.05,rx:.062,rz:.06,c:tc},{y:-.15,rx:.055,rz:.055,c:tc}];if(sleeve>=1){R.push({y:-.3,rx:.046,rz:.046,c:tc},{y:-.5,rx:.04,rz:.04,c:dk(tc,.9)})}else{R.push({y:-.16,rx:.05,rz:.05,c:S},{y:-.3,rx:.044,rz:.046,c:S},{y:-.5,rx:.036,rz:.038,c:S})}
  if(sleeve>=1)R.push({y:-.51,rx:.036,rz:.038,c:S});R.push({y:-.56,rx:.04,rz:.024,c:S},{y:-.66,rx:.034,rz:.02,c:dk(S,.95)},{y:-.7,rx:.02,rz:.014,top:0,c:dk(S,.9)});return R};
 const sl=ts===0||ts===4||ts===11||ts===13?0:1;lft(A1,armR(sl),6,true);lft(A2,armR(sl),6,true);
 if(sp.bn){const gd=[.95,.78,.28];for(const A of[A1,A2])for(const y of[-.48,-.505])lft(A,[{y,rx:.046,rz:.046,c:gd},{y:y-.012,rx:.046,rz:.046,c:dk(gd,.85)}],6,false)}
 // legs
 const short=sp.sh||(ts===4&&0),skirt=ts===4,lg=y=>(short&&y<-.38)||(skirt&&y<-.35)?S:LONG?skc:bc;
 const bs=sp.bs|0,ss=sp.ss|0,boot=(ss===1)&&!(short||skirt),scc=sp.sc||[.85,.85,.85];
 const legR0=boot?[{y:.02,rx:.1*w,rz:.1,c:LONG?skc:bc},{y:-.3,rx:.092*w,rz:.095,c:bc},{y:-.46,rx:.074*w,rz:.08,c:bc},{y:-.6,rx:.07*w,rz:.074,c:bc},{y:-.63,rx:.075*w,rz:.079,c:scc},{y:-.86,rx:.062*w,rz:.066,c:scc},{y:-.9,rx:.064*w,rz:.068,c:scc}]:[{y:.02,rx:.1*w,rz:.1,c:lg(0)},{y:-.3,rx:.092*w,rz:.095,c:lg(-.3)},{y:-.46,rx:.074*w,rz:.08,c:lg(-.46)},{y:-.7,rx:.066*w,rz:.07,c:lg(-.7)},{y:-.86,rx:.054*w,rz:.058,c:lg(-.86)},{y:-.9,rx:.056*w,rz:.06,c:lg(-.9)}];
 const legR=(short||skirt)?(()=>{const hy=short?-.38:-.35,k=(hy+.3)/-.16,a=legR0[1],b=legR0[2],rx=a.rx+(b.rx-a.rx)*k,rz=a.rz+(b.rz-a.rz)*k;return[legR0[0],a,{y:hy,rx,rz,c:bc},{y:hy-.004,rx,rz,c:S},...legR0.slice(2)]})():legR0;
 const shoe=[{z:-.07,rx:.05,ry:.05,cy:.055},{z:.04,rx:.053,ry:.046,cy:.047},{z:.15,rx:.045,ry:.034,cy:.033},{z:.23,rx:.02,ry:.018,cy:.02}];
 const shoeF=[{z:-.07,rx:.044,ry:.04,cy:.05},{z:.05,rx:.046,ry:.036,cy:.042},{z:.17,rx:.04,ry:.028,cy:.03},{z:.27,rx:.016,ry:.016,cy:.02}],shoeC=[{z:-.08,rx:.056,ry:.062,cy:.062},{z:.04,rx:.06,ry:.058,cy:.058},{z:.16,rx:.052,ry:.045,cy:.045},{z:.25,rx:.03,ry:.03,cy:.03}];
 for(const[ix,Lb]of[[0,L1],[1,L2]]){const sd=ix?1:-1;lft(Lb,legR,6,false,true);
  if(!short&&!skirt&&bs){const st2=bs===1?dk(bc,.62):bs===2?[.3,.3,.35]:bs===4?[.92,.78,.3]:dk(bc,2);
   if(bs===1||bs===3){for(const[y,z,h]of[[-.16,.099,.28],[-.38,.09,.18],[-.6,.076,.26],[-.8,.066,.16]])pb(Lb,0,y,z,.014,h,.01,st2)}
   else for(const[y,x,h]of[[-.15,.097,.3],[-.38,.085,.18],[-.6,.07,.26],[-.8,.06,.16]])pb(Lb,sd*x*w,y,0,.012,h,.05,st2)}
  lfz(Lb,ss===2||ss===4||ss===5?shoeF:ss===3?shoeC:shoe,6,scc,-.92);
  if(ss===5){pb(Lb,0,-.872,.285,.022,.045,.03,scc);pb(Lb,0,-.84,.12,.07,.012,.09,[.95,.8,.32]);pb(Lb,0,-.85,.0,.08,.01,.03,[.95,.8,.32])}
  if(ss===3)lfz(Lb,[{z:-.085,rx:.058,ry:.022,cy:.02},{z:.25,rx:.034,ry:.022,cy:.02}],6,[.96,.96,.96],-.92);
  if(ss===2)pb(Lb,0,-.835,.1,.032,.008,.1,[.78,.78,.8]);
  if(ss===4){pb(Lb,0,-.835,.1,.05,.012,.03,[1,.92,.4]);pb(Lb,0,-.835,.06,.06,.01,.012,[1,.92,.4])}}
 const g=new THREE.Group(),sc=sp.h;const up=UP.mesh(mat),a1=A1.mesh(mat),a2=A2.mesh(mat),l1=L1.mesh(mat),l2=L2.mesh(mat);
 const sx=.215*w;a1.position.set(-sx,1.4,st*1.5);a2.position.set(sx,1.4,st*1.5);a1.rotation.z=.07;a2.rotation.z=-.07;l1.position.set(-.1*w,.92,0);l2.position.set(.1*w,.92,0);
 g.add(up,a1,a2,l1,l2);g.up=up;g.a1=a1;g.a2=a2;g.l1=l1;g.l2=l2;g.scale.setScalar(sc);if(parent)parent.add(g);return g}
function pb(B,x,y,z,sx,sy,sz,col){pbox(B,x,y-sy/2,z,sx,sy,sz,col)}
/* swap village pedestrians to the new figures */
for(let i=0;i<NPC.length;i++){const n=NPC[i];scene.remove(n.g);n.g=mkPerson(pSpec(i+3),mObj,scene)}
{const u0=updPeds;updPeds=function(dt,now){u0(dt,now);for(const n of NPC){if(!n.g.visible)continue;const sw=Math.sin(n.ph)*.55;n.g.a1.rotation.x=-sw*.85;n.g.a2.rotation.x=sw*.85;n.g.up.rotation.y=sw*.09;n.g.up.position.y=-Math.abs(Math.cos(n.ph))*.012}}}
/* interior people */
const IMAT=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide});
function personIn(sp,x,z,ry,seated){const g=mkPerson(sp,IMAT,SG);g.position.set(x,seated?-.44*sp.h:0,z);g.rotation.y=ry||0;g.scale.setScalar(sp.h*.96);if(seated){g.l1.rotation.x=g.l2.rotation.x=-1.4;g.a1.rotation.x=g.a2.rotation.x=-.5}return g}
visitor=function(n,x,z){const sp=pSpec(hash(n)%9973+11);personIn(sp,x,z,Math.PI+((hash(n)%5)-2)*.15);IROOM.push([x-.28,x+.28,z-.28,z+.28]);IA.push({r:[x-.7,x+.7,z-.7,z+.7],label:()=>'CHAT: '+n+' '+hearts(n),fn:()=>chat(n)})};
{const b0=buildShop;buildShop=function(o){b0(o);if(SHK){SG.remove(SHK);const hs=hash(o.t)%9973+5,sp=pSpec(hs,{ts:1,tc:TH[o.t]&&TH[o.t].sh!=null?[(TH[o.t].sh>>16&255)/255,(TH[o.t].sh>>8&255)/255,(TH[o.t].sh&255)/255]:[.8,.3,.3]});SHK=new THREE.Group();SHK.position.set(0,0,-2.1);SG.add(SHK);mkPerson(sp,IMAT,SHK);SHK.children[0].scale.setScalar(sp.h*.96)}}}
cfSeat=function(i){const c=CF.cs[i];if(c.mesh)return;const[tx,tz]=CTB[i],sx=tx>0?-.7:.7,sp=pSpec(Math.floor(Math.random()*9000)+20,{});const g=personIn(sp,tx+sx,tz,sx>0?-1.57:1.57,true);c.mesh=[g]};
