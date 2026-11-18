/* ===== Cleaner HUD =====
   One tidy panel (top-left) holds the money, delivered count + stars, the time, and the food / energy bars.
   Toasts become small pills, and the job hint only shows when you actually have a job on. */
(function(){
const st=document.createElement('style');
st.textContent=`
#czp{position:absolute;left:max(10px,env(safe-area-inset-left));top:8px;display:flex;flex-direction:column;gap:.7vmin;min-width:24vmin;padding:1vmin 1.8vmin 1.2vmin;background:rgba(10,14,30,.58);border:2px solid rgba(255,255,255,.3);border-radius:12px;pointer-events:none;z-index:3}
#czp #gems{order:1;position:static!important;font-size:5.2vmin!important;line-height:1;display:flex;align-items:baseline;gap:1.2vmin;flex-wrap:wrap}
#czp #gems small{font-size:.42em!important;color:#cfe0ff;font-weight:700}
#czp .cztime{order:2;position:static!important;font:800 3.2vmin ui-monospace,monospace!important;color:#fff;text-align:left!important;text-shadow:2px 2px 0 #000;letter-spacing:.05em}
#czp #hnhud{order:3;position:static!important;width:100%!important;font:800 2.1vmin ui-monospace,monospace!important;letter-spacing:.06em;z-index:auto!important}
#czp #hnhud>div>div{height:1.5vmin!important;border-radius:4px;overflow:hidden;margin-top:.3vmin}
#czp #sta{order:4;position:static!important;font-size:2.1vmin!important}
#toast{left:50%!important;right:auto!important;transform:translateX(-50%);width:max-content;max-width:78vw;top:23%!important;font-size:3vmin!important;background:rgba(10,14,30,.72);border-radius:999px;padding:.8vmin 2.6vmin;border:2px solid rgba(255,225,74,.55);line-height:1.25}
#job{left:50%!important;transform:translateX(-50%);top:8px!important;width:max-content;max-width:54vw;text-align:center;font-size:2.3vmin!important;line-height:1.3;background:rgba(10,14,30,.62);border:2px solid rgba(255,255,255,.3);border-radius:12px;padding:.7vmin 2vmin;pointer-events:none}
#job #jl1{color:#ffe14a}#job #jl2{color:#e8ecf4;font-size:.9em}
`;document.head.appendChild(st);
const hud=document.getElementById('hud'),p=document.createElement('div');p.id='czp';hud.insertBefore(p,hud.firstChild);
const gems=document.getElementById('gems');if(gems)p.appendChild(gems);
let tm=null;function grabTime(){if(tm&&tm.isConnected)return;for(const e of hud.children){if(e!==p&&!e.id&&e.style&&e.style.cssText.indexOf('10vmin')>0&&e.style.cssText.indexOf('2.4vmin')>0){tm=e;e.classList.add('cztime');p.appendChild(e);return}}}
function grabBars(){const e=document.getElementById('hnhud');if(e&&e.parentNode!==p){p.appendChild(e)}const s=document.getElementById('sta');if(s&&s.parentNode!==p)p.appendChild(s)}
const u0=updJob;updJob=function(dt){u0(dt);grabTime();grabBars()};
const h0=updJobHUD;updJobHUD=function(){h0();const show=!GS.inside&&!menuOpen&&(JOB.on||(window.PJ&&PJ.acc));if(!show){document.getElementById('job').style.display='none';document.getElementById('arrow').style.display='none'}};
})();
