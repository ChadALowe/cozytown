/* ===== PROPERTY OWNERSHIP: Ruth & Co. list every house in the village. Buy them, renovate for a higher rent, collect the
   money from the estate agent. A flag by the door shows what you own. ===== */
(function(){
const PR={own:{},pend:{},sold:0};/* own[i]=reno level 0-3, pend[i]=rent waiting */
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.pp=PR;return o};cozyLoad=function(z){l0(z);if(z&&z.pp){PR.own=z.pp.own||{};PR.pend=z.pp.pend||{};PR.sold=z.pp.sold|0}refresh()}}
const price=i=>1200+((i*7919+13)%41)*100,RENO=['ORIGINAL','REFRESHED','MODERNISED','LUXURY'],renoCost=(i,l)=>Math.round(price(i)*[0,.25,.4,.6][l]/50)*50,rate=(i,l)=>[.03,.045,.06,.08][l];
const rent=i=>Math.round(price(i)*rate(i,PR.own[i]||0));
const flagCol=[0xc8d0d8,0x6ab0ff,0xffd24a,0xd040ff],flags={};
function refresh(){for(const k in flags){flags[k].parent&&flags[k].parent.remove(flags[k]);delete flags[k]}
 for(const k in PR.own){const t=TG[k];if(!t)continue;const vx=t.dx-t.x,vz=t.dz-t.z,l=Math.hypot(vx,vz)||1,px=t.x-vz/l*1.6,pz=t.z+vx/l*1.6,g=new THREE.Group();
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,3.2,6),new THREE.MeshBasicMaterial({color:0x888890}));pole.position.y=1.6;g.add(pole);
  const fl=new THREE.Mesh(new THREE.BoxGeometry(.9,.55,.04),new THREE.MeshBasicMaterial({color:flagCol[PR.own[k]]}));fl.position.set(.45,2.9,0);g.add(fl);
  g.position.set(px,gH(px,pz),pz);scene.add(g);flags[k]=g}}
{const n0=newDay;newDay=function(){const r=n0.apply(this,arguments);let tot=0;for(const k in PR.own){const add=rent(k);PR.pend[k]=Math.min((PR.pend[k]||0)+add,add*14);tot+=add}if(tot)setTimeout(()=>toast('RENT DUE: £'+tot+' WAITING AT RUTH & CO.'),1500);return r}}
const pending=()=>Object.values(PR.pend).reduce((a,b)=>a+b,0);
let OV=null;
function open(tab){if(OV||busy)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;
 const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:60;background:rgba(0,0,10,.7);font:bold 13px monospace;color:#fff;display:flex;align-items:center;justify-content:center';document.body.appendChild(ov);
 const pn=document.createElement('div');pn.style.cssText='width:min(94vw,560px);max-height:90vh;overflow:auto;background:#10131e;border:3px solid #6ab0ff;box-shadow:4px 4px 0 #000;padding:10px;box-sizing:border-box';ov.appendChild(pn);pn.onpointerdown=e=>e.stopPropagation();
 OV={ov,pn,tab:tab||0,msg:''};OV.kd=e=>{if(e.key==='Escape')close()};addEventListener('keydown',OV.kd);render()}
function close(){if(!OV)return;removeEventListener('keydown',OV.kd);OV.ov.remove();OV=null;busy=0}
function render(){const pn=OV.pn;pn.textContent='';const el=(t,css,txt,par)=>{const e=document.createElement(t);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;(par||pn).appendChild(e);return e};
 const bt=(par,txt,on,fn,dis)=>{const b=el('button','font:bold 12px monospace;border:2px solid '+(on?'#6ab0ff':'#556')+';border-radius:6px;color:#fff;background:'+(on?'#1c3a6a':'#242838')+';padding:6px 9px;margin:2px;touch-action:manipulation;'+(dis?'opacity:.4;':''),txt,par);b.onclick=e=>{e.stopPropagation();fn()};return b};
 const hd=el('div','display:flex;justify-content:space-between;align-items:center;margin-bottom:6px');el('div','font-size:16px;color:#6ab0ff','RUTH & CO. PROPERTY LISTINGS',hd);bt(hd,'CLOSE',0,close);
 const own=Object.keys(PR.own).map(Number),inc=own.reduce((a,k)=>a+rent(k),0),pd=pending();
 el('div','color:#9fe','CASH £'+Math.round(cash)+'  ·  PROPERTIES '+own.length+'  ·  RENT £'+inc+'/DAY  ·  WAITING £'+pd);
 if(OV.msg)el('div','color:#ffd24a;margin:3px 0',OV.msg);
 const tb=el('div','margin:6px 0');bt(tb,'FOR SALE',OV.tab===0,()=>{OV.tab=0;render()});bt(tb,'MY PROPERTIES ('+own.length+')',OV.tab===1,()=>{OV.tab=1;render()});
 if(OV.tab===1&&pd>0)bt(tb,'COLLECT RENT £'+pd,1,()=>{cash+=pd;OV.msg='COLLECTED £'+pd;for(const k in PR.pend)PR.pend[k]=0;beep(880,.1,'square',.06);render()});
 const ids=[];TG.forEach((t,i)=>{if(OV.tab===1?PR.own[i]!=null:PR.own[i]==null)ids.push(i)});ids.sort((a,b)=>OV.tab?a-b:price(a)-price(b));
 if(!ids.length)el('div','color:#aab;margin:8px','NOTHING HERE.');
 ids.slice(0,60).forEach(i=>{const t=TG[i],r=el('div','display:flex;justify-content:space-between;align-items:center;border-top:1px solid #334;padding:4px 2px'),L=el('div','',null,r);
  const lv=PR.own[i];el('div','color:#fff',t.addr.toUpperCase(),L);
  if(lv==null)el('div','color:#9ab;font-size:11px','£'+price(i)+'  ·  RENT £'+Math.round(price(i)*rate(i,0))+'/DAY  ·  ~'+Math.ceil(1/rate(i,0))+' DAYS TO PAY BACK',L);
  else el('div','color:#9ab;font-size:11px',RENO[lv]+'  ·  RENT £'+rent(i)+'/DAY  ·  WAITING £'+(PR.pend[i]||0),L);
  const R=el('div','',null,r);
  if(lv==null)bt(R,'BUY £'+price(i),1,()=>{if(cash<price(i)){OV.msg='NOT ENOUGH CASH';beep(120,.2,'sawtooth',.08);return render()}cash-=price(i);PR.own[i]=0;PR.pend[i]=0;refresh();OV.msg='SOLD! '+t.addr.toUpperCase()+' IS YOURS. A FLAG MARKS THE DOOR.';beep(880,.1,'square',.06);setTimeout(()=>beep(1320,.14,'square',.06),90);render()},cash<price(i));
  else{if(lv<3)bt(R,'RENOVATE £'+renoCost(i,lv+1),1,()=>{const c=renoCost(i,lv+1);if(cash<c){OV.msg='NOT ENOUGH CASH';return render()}cash-=c;PR.own[i]=lv+1;refresh();OV.msg=RENO[lv+1]+' — RENT NOW £'+rent(i)+'/DAY';beep(660,.1,'square',.06);render()},cash<renoCost(i,lv+1));
   bt(R,'SELL £'+Math.round(price(i)*.7),0,()=>{cash+=Math.round(price(i)*.7);delete PR.own[i];delete PR.pend[i];refresh();OV.msg='SOLD FOR £'+Math.round(price(i)*.7);render()})}});
 if(ids.length>60)el('div','color:#aab','…AND MORE')}
{const b0=buildShop;buildShop=function(o){b0(o);if(o&&o.t==='ESTATE AGENT'&&!(o.race))IA.push({r:[1.6,3.6,.9,2.1],label:'PROPERTY LISTINGS',fn:()=>open(0)})}}
window.PROP={PR,open,close,price,rent,refresh,pending};
})();
