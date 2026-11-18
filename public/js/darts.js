/* ===== Darts: landscape layout =====
   On a wide (landscape phone) screen the status text used to sit on top of the board and the chalkboard was tiny.
   Now the board is shifted to the left and fills the height, and the right-hand side holds the status text with a
   large copy of the chalkboard scores underneath.  Portrait / square screens keep the old layout. */
(function(){
const wide=()=>innerWidth/innerHeight>1.3;
let key='';
function layout(){const G=DG;if(!G)return;const w=wide(),k=innerWidth+'x'+innerHeight+w;if(k===key)return;key=k;
 const hud=G.ov.children[1],cc=G._cc;
 if(w){hud.style.cssText='position:absolute;left:auto;right:14px;width:32vw;top:44px;text-align:center;pointer-events:none;text-shadow:2px 2px 0 #000';
  const t=document.getElementById('dtT');if(t)t.style.fontSize='clamp(14px,2.6vw,22px)';const s=document.getElementById('dtS');if(s)s.style.fontSize='clamp(11px,1.7vw,15px)';const m=document.getElementById('dtM');if(m){m.style.fontSize='clamp(12px,1.9vw,16px)';m.style.minHeight='2.6em'}
  if(cc){cc.style.display='block';hud.appendChild(cc)}
  cam.setViewOffset(innerWidth,innerHeight,Math.round(innerWidth*.17),-Math.round(innerHeight*.07),innerWidth,innerHeight)}
 else{hud.style.cssText='position:absolute;left:0;right:0;top:8px;text-align:center;pointer-events:none;text-shadow:2px 2px 0 #000';
  const t=document.getElementById('dtT');if(t)t.style.fontSize='15px';const s=document.getElementById('dtS');if(s)s.style.fontSize='13px';const m=document.getElementById('dtM');if(m){m.style.fontSize='13px';m.style.minHeight='20px'}
  if(cc)cc.style.display='none';cam.clearViewOffset()}}
function sync(){const G=DG;if(!G||!G._cc||!window.CHALK)return;const c=CHALK.cv,cc=G._cc;if(cc.width!==c.width||cc.height!==c.height){cc.width=c.width;cc.height=c.height}cc.getContext('2d').drawImage(c,0,0)}
const o0=dartsOpen;dartsOpen=function(){o0();const G=DG;if(!G)return;key='';const cc=document.createElement('canvas');cc.style.cssText='display:none;width:100%;margin-top:6px;border:3px solid #6a4a2a;border-radius:6px;background:#1f2a25;box-sizing:border-box';G._cc=cc;layout();sync()};
const d0=dartsDraw;dartsDraw=function(dt){layout();d0(dt)};
const c0=chalkDraw;chalkDraw=function(){c0();sync()};
const x0=dartsClose;dartsClose=function(q){x0(q);cam.clearViewOffset();key=''};
})();
