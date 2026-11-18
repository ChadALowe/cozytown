/* ---- FPS counter at the top of the screen ---- */
(function(){
const d=document.createElement('div');
d.style.cssText='position:fixed;top:4px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.55);color:#9f9;font:bold 12px monospace;padding:2px 8px;border-radius:6px;z-index:30;pointer-events:none;letter-spacing:1px';
d.textContent='-- FPS';document.body.appendChild(d);
let n=0,t0=performance.now();
function f(now){n++;if(now-t0>=500){const v=Math.round(n*1000/(now-t0));d.textContent=v+' FPS';d.style.color=v>=50?'#9f9':v>=30?'#ee8':'#f88';n=0;t0=now}requestAnimationFrame(f)}
requestAnimationFrame(f);
})();
